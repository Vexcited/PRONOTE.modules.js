exports.ObjetMoteurActus = void 0;
const EGenreEvntActu_1 = require("EGenreEvntActu");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetRequeteSaisieActualites_1 = require("ObjetRequeteSaisieActualites");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDate_1 = require("ObjetDate");
const Toast_1 = require("Toast");
const ObjetRequeteListeSondagesDeBiblioEtablissement_1 = require("ObjetRequeteListeSondagesDeBiblioEtablissement");
const ObjetFenetre_SelectionModeleInfoSond_1 = require("ObjetFenetre_SelectionModeleInfoSond");
const DonneesListe_SondagesBiblio_1 = require("DonneesListe_SondagesBiblio");
const ObjetElement_1 = require("ObjetElement");
const ObjetTri_1 = require("ObjetTri");
const ObjetFenetre_1 = require("ObjetFenetre");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const MoteurInfoSondage_1 = require("MoteurInfoSondage");
const ObjetIdentite_1 = require("ObjetIdentite");
class ObjetMoteurActus extends ObjetIdentite_1.Identite {
	constructor(aUtilitaires) {
		super();
		this.moteurCP = new MoteurInfoSondage_1.MoteurInfoSondage(aUtilitaires);
	}
	surEvntSaisieReponseActu(aActualite, aGenreEvnt, aParam) {
		if (aGenreEvnt === EGenreEvntActu_1.EGenreEvntActu.SurValidationSondage) {
			aParam.avecMsgConfirm = true;
		}
		this.declencherSaisieDirecte(aActualite, aGenreEvnt, aParam);
	}
	declencherSaisieDirecte(aActualite, aGenreEvnt, aParam) {
		const lListeActualites = new ObjetListeElements_1.ObjetListeElements();
		lListeActualites.addElement(aActualite);
		const lObjetSaisie = {
			listeActualite: lListeActualites,
			validationDirecte: true,
			saisieActualite: aParam.modeAuteur,
		};
		new ObjetRequeteSaisieActualites_1.ObjetRequeteSaisieActualites(
			this,
			this._reponseSaisieDirecte.bind(this, aActualite, aGenreEvnt, aParam),
		).lancerRequete(lObjetSaisie);
	}
	_reponseSaisieDirecte(aActualite, aGenreEvnt, aParam) {
		let lMessage, lIcon;
		switch (aGenreEvnt) {
			case EGenreEvntActu_1.EGenreEvntActu.SurValidationSondage:
				lMessage = ObjetTraduction_1.GTraductions.getValeur(
					"actualites.msgConfirmValidation",
					[ObjetDate_1.GDate.formatDate(aActualite.dateFin, "%J/%MM/%AAAA")],
				);
				lIcon = "icon_diffuser_sondage";
				break;
			case EGenreEvntActu_1.EGenreEvntActu.SurAR:
				lMessage =
					ObjetTraduction_1.GTraductions.getValeur("infoSond.msgSurAR");
				lIcon = null;
				break;
			default:
				lMessage = "";
		}
		if (lMessage !== "") {
			Toast_1.Toast.afficher({
				msg: lMessage,
				type: Toast_1.ETypeToast.succes,
				icon: lIcon,
			});
			this._surConfirmReponseSaisieDirecte(aParam);
		} else {
			this._surConfirmReponseSaisieDirecte(aParam);
		}
	}
	_surConfirmReponseSaisieDirecte(aParam) {
		if (!!aParam.avecRecupDonnees) {
			aParam.clbckRecupDonnees.call(aParam.pereRecupDonnees);
		}
	}
	getListeModeles(aParam) {
		new ObjetRequeteListeSondagesDeBiblioEtablissement_1.ObjetRequeteListeSondagesDeBiblioEtablissement(
			this,
			this._surReceptionListeSondageDeBiblioEtablissement.bind(this, aParam),
		).lancerRequete({ estCasSondage: aParam.estCasSondage });
	}
	_surReceptionListeSondageDeBiblioEtablissement(aParam, aJSON) {
		if (!!aJSON && !!aJSON.listeModeles && aJSON.listeModeles.count() > 0) {
			const lListeModelesPourObjetListe =
				new ObjetListeElements_1.ObjetListeElements();
			aJSON.listeModeles.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
			aJSON.listeModeles.trier();
			aJSON.listeModeles.parcourir((aModele) => {
				aModele.estUnDeploiement = true;
				aModele.estDeploye = false;
				aModele.estModele = true;
				aModele.estSondage = aParam.estCasSondage;
				aModele.estInformation = !aModele.estSondage;
				aModele.visible = true;
				lListeModelesPourObjetListe.addElement(aModele);
				if (!!aModele.listeQuestions) {
					const lLibelleDetailSondage = [];
					aModele.listeQuestions.parcourir((aQuestion, aIndexQuestion) => {
						lLibelleDetailSondage.push(
							this.moteurCP.composeComposanteSondage({
								instance: this,
								actu: aModele,
								composante: aQuestion,
								indice: aIndexQuestion,
								avecLibelleQuestion: false,
								estAffEditionActualite: true,
							}),
						);
					});
					const lDetailSondage = new ObjetElement_1.ObjetElement(
						lLibelleDetailSondage.join(""),
					);
					lDetailSondage.pere = aModele;
					lDetailSondage.visible = true;
					lListeModelesPourObjetListe.addElement(lDetailSondage);
				}
			});
			const lFenetreListeModeles =
				ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_SelectionModeleInfoSond_1.ObjetFenetre_SelectionModeleInfoSond,
					{
						pere: this,
						evenement: (aGenreBouton, aSelection) => {
							if (aGenreBouton === 1) {
								let lElementSelectionne =
									lListeModelesPourObjetListe.get(aSelection);
								if (!!lElementSelectionne) {
									if (!!lElementSelectionne.pere) {
										lElementSelectionne = lElementSelectionne.pere;
									}
									aParam.evntClbck({ modele: lElementSelectionne });
								}
							}
						},
						initialiser: (aFenetre) => {
							aFenetre.setOptionsFenetre({
								titre:
									aParam && aParam.estCasSondage
										? ObjetTraduction_1.GTraductions.getValeur(
												"actualites.modeles.ListeSondages",
											)
										: ObjetTraduction_1.GTraductions.getValeur(
												"actualites.modeles.ListeInfos",
											),
							});
							aFenetre.setOptions({
								listeBruteCategories: aParam.listeCategories,
							});
						},
					},
				);
			lFenetreListeModeles.setDonnees(
				new DonneesListe_SondagesBiblio_1.DonneesListeSondagesBiblio(
					lListeModelesPourObjetListe,
				),
			);
		} else {
			GApplication.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				message:
					aParam && aParam.estCasSondage
						? ObjetTraduction_1.GTraductions.getValeur(
								"actualites.modeles.AucunSondageDisponible",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"actualites.modeles.AucuneInfoDisponible",
							),
			});
		}
	}
}
exports.ObjetMoteurActus = ObjetMoteurActus;
