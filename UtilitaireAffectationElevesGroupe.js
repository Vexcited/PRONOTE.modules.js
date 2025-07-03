exports.TUtilitaireAffectationElevesGroupe = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetFenetre_ChoixDateEleveGAEV_1 = require("ObjetFenetre_ChoixDateEleveGAEV");
const ObjetFenetre_ChoixEleveGAEV_1 = require("ObjetFenetre_ChoixEleveGAEV");
const ObjetFenetre_ChoixEleveNonGAEV_1 = require("ObjetFenetre_ChoixEleveNonGAEV");
const ObjetFenetre_ChoixSemainesEleveGAEV_1 = require("ObjetFenetre_ChoixSemainesEleveGAEV");
const ObjetFenetre_SortieEleveGroupe_1 = require("ObjetFenetre_SortieEleveGroupe");
const ObjetRequeteSaisieElevesGAEV_1 = require("ObjetRequeteSaisieElevesGAEV");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTri_1 = require("ObjetTri");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const AccessApp_1 = require("AccessApp");
const EGenreCreationListeEleves = { choixEleves: 0, choixSemaines: 1 };
class TUtilitaireAffectationElevesGroupe {
	constructor(aInstance) {
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
	}
	autorisationEditionGroupeGAEV(aGroupe, aEstCoursGAEV = false) {
		return (
			((aGroupe && aGroupe.estGAEV) || aEstCoursGAEV) &&
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.avecAffectationElevesGroupesGAEV,
			)
		);
	}
	autorisationEditionGroupeNonGAEV(aGroupe) {
		return (
			aGroupe &&
			!aGroupe.estGAEV &&
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.avecAffectationElevesGroupesNonGAEV,
			)
		);
	}
	ajoutEleveAuGroupe(aParam) {
		let lParam = $.extend(
			{ instance: null, cours: null, domaine: null, callbackSaisie: null },
			aParam,
		);
		if (
			this.autorisationEditionGroupeGAEV(
				lParam.groupe,
				lParam.cours ? lParam.cours.estGAEV : false,
			)
		) {
			ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
				pere: lParam.instance,
				initCommandes: function (aInstance) {
					aInstance.addCommande(
						EGenreCreationListeEleves.choixEleves,
						ObjetTraduction_1.GTraductions.getValeur("ChoixEleveGAEV.nouveau"),
					);
					aInstance.addCommande(
						EGenreCreationListeEleves.choixSemaines,
						ObjetTraduction_1.GTraductions.getValeur(
							"ChoixEleveGAEV.AffecterLesEleves",
						),
					);
				},
				evenement: this._evenementSurMenuContextuelCreationListeEleves.bind(
					this,
					lParam,
				),
			});
			return;
		}
		if (!this.autorisationEditionGroupeNonGAEV(lParam.groupe)) {
			return;
		}
		const lFenetreChoixEleveNonGAEV =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_ChoixEleveNonGAEV_1.ObjetFenetre_ChoixEleveNonGAEV,
				{
					pere: aParam.instance,
					evenement: (aValider, aListeEleves) => {
						if (aValider) {
							aListeEleves.setSerialisateurJSON({ ignorerEtatsElements: true });
							new ObjetRequeteSaisieElevesGAEV_1.ObjetRequeteSaisieElevesGAEV(
								aParam.instance,
								this._surReponseRequeteSaisieElevesGAEV.bind(this, aParam),
							).lancerRequete({
								domaine: aParam.domaine,
								groupe: aParam.groupe,
								listeEleves: aListeEleves,
							});
						}
					},
				},
			);
		lFenetreChoixEleveNonGAEV.setDonnees(aParam.groupe, aParam.domaine);
	}
	surSuppressionEleve(aParam) {
		const lParam = $.extend(
			{
				instance: null,
				cours: null,
				groupe: null,
				domaine: null,
				eleve: null,
				callbackSaisie: null,
			},
			aParam,
		);
		if (this.autorisationEditionGroupeNonGAEV(lParam.groupe)) {
			if (
				lParam.eleve.historiqueGroupes &&
				lParam.eleve.historiqueGroupes.count() > 1
			) {
				this.ouvrirFenetreHistoriqueChangementsDEleve(
					lParam.instance,
					lParam.eleve,
					lParam.callbackSaisie,
				);
				return;
			}
			const lFenetreSortieEleveGroupe =
				ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_SortieEleveGroupe_1.ObjetFenetre_SortieEleveGroupe,
					{
						pere: lParam.instance,
						evenement: (aValider, aSurAnneeComplete, aDate) => {
							if (aValider) {
								const lListeEleves =
									new ObjetListeElements_1.ObjetListeElements();
								lListeEleves.addElement(lParam.eleve);
								lParam.eleve.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
								lListeEleves.setSerialisateurJSON({
									methodeSerialisation: function (aElement, aJSON) {
										if (aSurAnneeComplete) {
											aJSON.surAnneeComplete = aSurAnneeComplete;
										} else {
											aJSON.dateSortie = aDate;
										}
									},
								});
								new ObjetRequeteSaisieElevesGAEV_1.ObjetRequeteSaisieElevesGAEV(
									lParam.instance,
									this._surReponseRequeteSaisieElevesGAEV.bind(this, lParam),
								).lancerRequete({
									cours: lParam.cours,
									domaine: lParam.domaine,
									groupe: lParam.groupe,
									listeEleves: lListeEleves,
								});
							}
						},
					},
				);
			lFenetreSortieEleveGroupe.setDonnees(lParam);
		} else if (
			this.autorisationEditionGroupeGAEV(
				lParam.groupe,
				lParam.cours ? lParam.cours.estGAEV : false,
			)
		) {
			const lListeEleves = new ObjetListeElements_1.ObjetListeElements();
			lListeEleves.addElement(lParam.eleve);
			this._ouvrirFenetreChoixDateEleveGAEV(aParam, lListeEleves);
		} else {
		}
	}
	getOptionsListe(aGroupe, aEstCoursGEAV = false) {
		if (
			this.autorisationEditionGroupeGAEV(aGroupe, aEstCoursGEAV) ||
			this.autorisationEditionGroupeNonGAEV(aGroupe)
		) {
			return {
				listeCreations: 0,
				avecLigneCreation: true,
				titreCreation: this.autorisationEditionGroupeGAEV(
					aGroupe,
					aEstCoursGEAV,
				)
					? ObjetTraduction_1.GTraductions.getValeur("ChoixEleveGAEV.nouveau")
					: ObjetTraduction_1.GTraductions.getValeur("liste.nouveau"),
				AvecSuppression: true,
			};
		}
		return {
			listeCreations: null,
			avecLigneCreation: false,
			AvecSuppression: false,
		};
	}
	saisieDateEleve(aCallback, aEleve, aSurEntree, aGroupe, aParametresSaisie) {
		let lListe = new ObjetListeElements_1.ObjetListeElements().addElement(
			aEleve,
		);
		aEleve.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		lListe.setSerialisateurJSON({
			ignorerEtatsElements: false,
			methodeSerialisation: function (aElement, aJSON) {
				aJSON.modifierDates = true;
				aJSON.dateEntree = aSurEntree ? aElement._saisieEntree : undefined;
				aJSON.dateSortie = !aSurEntree ? aElement._saisieSortie : undefined;
				aJSON.borneEntree =
					aParametresSaisie && aParametresSaisie.dateEntree
						? aParametresSaisie.dateEntree
						: undefined;
				aJSON.borneSortie =
					aParametresSaisie && aParametresSaisie.dateSortie
						? aParametresSaisie.dateSortie
						: undefined;
			},
		});
		new ObjetRequeteSaisieElevesGAEV_1.ObjetRequeteSaisieElevesGAEV(
			this,
			() => {
				aCallback();
			},
		).lancerRequete({
			modifierDates: true,
			groupe: aGroupe
				? aGroupe
				: this.etatUtilisateurSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Classe,
					),
			listeEleves: lListe,
		});
	}
	ouvrirFenetreHistoriqueChangementsDEleve(aInstance, aEleve, aCallback) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_HistoriqueChangementsGroupes,
			{ pere: aInstance, evenement: null },
		);
		lFenetre.setDonnees({
			listeGroupes: aEleve.historiqueGroupes,
			eleve: aEleve,
			callbackSaisieDate: (aGroupe, aSurEntree, aDateEntree, aDateSortie) => {
				aEleve._saisieEntree = aGroupe._saisieEntree;
				aEleve._saisieSortie = aGroupe._saisieSortie;
				this.saisieDateEleve(aCallback, aEleve, aSurEntree, aGroupe, {
					dateEntree: aDateEntree,
					dateSortie: aDateSortie,
				});
			},
		});
	}
	static surEditionDateListe(aSurEntree, aDate, aElementBorne, aElement) {
		if (aSurEntree) {
			if (
				aElementBorne.borneEntree.dateMessageSup &&
				aDate > aElementBorne.borneEntree.dateMessageSup &&
				!ObjetDate_1.GDate.estJourEgal(
					aDate,
					aElementBorne.borneEntree.dateMessageSup,
				) &&
				aElementBorne.borneEntree.messageSup
			) {
				return aElementBorne.borneEntree.messageSup;
			}
			if (
				aElementBorne.borneEntree.dateMessageInf &&
				aDate < aElementBorne.borneEntree.dateMessageInf &&
				!ObjetDate_1.GDate.estJourEgal(
					aDate,
					aElementBorne.borneEntree.dateMessageInf,
				) &&
				aElementBorne.borneEntree.messageInf
			) {
				return aElementBorne.borneEntree.messageInf;
			}
			aElement._saisieEntree = aDate;
		} else {
			if (
				aElementBorne.borneSortie.dateMessageInf &&
				aDate < aElementBorne.borneSortie.dateMessageInf &&
				!ObjetDate_1.GDate.estJourEgal(
					aDate,
					aElementBorne.borneSortie.dateMessageInf,
				) &&
				aElementBorne.borneSortie.messageInf
			) {
				return aElementBorne.borneSortie.messageInf;
			}
			if (
				aElementBorne.borneSortie.dateMessageSup &&
				aDate > aElementBorne.borneSortie.dateMessageSup &&
				!ObjetDate_1.GDate.estJourEgal(
					aDate,
					aElementBorne.borneSortie.dateMessageSup,
				) &&
				aElementBorne.borneSortie.messageSup
			) {
				return aElementBorne.borneSortie.messageSup;
			}
			aElement._saisieSortie = aDate;
		}
	}
	static initialiserDateListe(aInstance, aSurEntree, aElement) {
		aInstance.setParametres(
			GParametres.PremierLundi,
			aSurEntree
				? GParametres.PremiereDate
				: this._getDateEleve(aElement, true),
			aSurEntree
				? this._getDateEleve(aElement, false)
				: GParametres.DerniereDate,
		);
	}
	static setDonneesDateListe(aInstance, aSurEntree, aElement) {
		aInstance.setDonnees(this._getDateEleve(aElement, aSurEntree));
	}
	static _getDateEleve(aEleve, aEstDateEntree) {
		return aEstDateEntree
			? aEleve.entree
				? aEleve.entree
				: GParametres.PremiereDate
			: aEleve.sortie
				? aEleve.sortie
				: GParametres.DerniereDate;
	}
	_surReponseRequeteSaisieElevesGAEV(aParam) {
		aParam.callbackSaisie.call(aParam.instance);
	}
	_saisieElevesGAEV(aParam, aListeElevesGAEV, aDomaine) {
		new ObjetRequeteSaisieElevesGAEV_1.ObjetRequeteSaisieElevesGAEV(
			aParam.instance,
			this._surReponseRequeteSaisieElevesGAEV.bind(aParam.instance, aParam),
		).lancerRequete({
			cours: aParam.cours,
			groupe: aParam.groupe,
			domaine: aDomaine,
			listeEleves: aListeElevesGAEV,
		});
	}
	_ouvrirFenetreChoixDateEleveGAEV(aParam, aListeElevesGAEV) {
		let lEstSuppressionEleve = true;
		aListeElevesGAEV.parcourir((aEleve) => {
			if (
				aEleve.getEtat() === Enumere_Etat_1.EGenreEtat.Modification ||
				aEleve.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
			) {
				lEstSuppressionEleve = false;
				return false;
			}
		});
		const lFenetreChoixDate = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_ChoixDateEleveGAEV_1.ObjetFenetre_ChoixDateEleveGAEV,
			{
				pere: aParam.instance,
				evenement: (aGenreBouton, aDomaine) => {
					if (aGenreBouton === 1) {
						this._saisieElevesGAEV(aParam, aListeElevesGAEV, aDomaine);
					}
				},
			},
		);
		lFenetreChoixDate.setDonnees(aParam.domaine, lEstSuppressionEleve);
	}
	_evenementSurMenuContextuelCreationListeEleves(aParam, aLigne) {
		switch (aLigne.getNumero()) {
			case EGenreCreationListeEleves.choixEleves: {
				const lFenetreChoixEleve =
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_ChoixEleveGAEV_1.ObjetFenetre_ChoixEleveGAEV,
						{
							pere: aParam.instance,
							evenement: (aGenreBouton, aListeElevesGAEV) => {
								if (aGenreBouton === 1) {
									this._ouvrirFenetreChoixDateEleveGAEV(
										aParam,
										aListeElevesGAEV,
									);
								}
							},
						},
						{
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"ChoixEleveGAEV.titre",
							),
							largeur: 500,
							hauteur: 600,
							listeBoutons: [
								ObjetTraduction_1.GTraductions.getValeur("Annuler"),
								ObjetTraduction_1.GTraductions.getValeur("Valider"),
							],
						},
					);
				lFenetreChoixEleve.setDonnees(
					aParam.cours,
					aParam.groupe,
					aParam.domaine,
				);
				break;
			}
			case EGenreCreationListeEleves.choixSemaines: {
				const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_ChoixSemainesEleveGAEV_1.ObjetFenetre_ChoixSemainesEleveGAEV,
					{
						pere: aParam.instance,
						evenement: (aGenreBouton, aNumeroSemaine) => {
							if (aGenreBouton === 1) {
								new ObjetRequeteSaisieElevesGAEV_1.ObjetRequeteSaisieElevesGAEV(
									aParam.instance,
									this._surReponseRequeteSaisieElevesGAEV.bind(this, aParam),
								).lancerRequete({
									cours: aParam.cours,
									groupe: aParam.groupe,
									domaine: aParam.domaine,
									numeroSemaineSource: aNumeroSemaine,
								});
							}
						},
					},
				);
				lFenetre.afficher();
				break;
			}
		}
	}
}
exports.TUtilitaireAffectationElevesGroupe = TUtilitaireAffectationElevesGroupe;
class DonneesListe_HistoriqueGroupe extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
	}
	avecSuppression() {
		return false;
	}
	avecEtatSaisie() {
		return false;
	}
	avecEdition(aParams) {
		return (
			aParams.article &&
			(aParams.idColonne === DonneesListe_HistoriqueGroupe.colonnes.entree ||
				aParams.idColonne === DonneesListe_HistoriqueGroupe.colonnes.sortie)
		);
	}
	getMessageEditionImpossible(aParams, aErreur) {
		if (MethodesObjet_1.MethodesObjet.isString(aErreur)) {
			return aErreur;
		}
		return super.getMessageEditionImpossible(aParams, aErreur);
	}
	avecEvenementApresEdition() {
		return true;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_HistoriqueGroupe.colonnes.nom:
				return aParams.article.getLibelle();
			case DonneesListe_HistoriqueGroupe.colonnes.entree:
				return aParams.article.entree;
			case DonneesListe_HistoriqueGroupe.colonnes.sortie:
				return ObjetDate_1.GDate.estJourEgal(
					aParams.article.sortie,
					GParametres.DerniereDate,
				)
					? null
					: aParams.article.sortie;
			default:
		}
		return "";
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_HistoriqueGroupe.colonnes.entree:
			case DonneesListe_HistoriqueGroupe.colonnes.sortie:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule
					.DateCalendrier;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_HistoriqueGroupe.colonnes.entree:
			case DonneesListe_HistoriqueGroupe.colonnes.sortie: {
				const lResult = TUtilitaireAffectationElevesGroupe.surEditionDateListe(
					aParams.idColonne === DonneesListe_HistoriqueGroupe.colonnes.entree,
					V,
					aParams.article,
					aParams.article,
				);
				if (lResult) {
					return lResult;
				}
				break;
			}
			default:
		}
	}
	getTri() {
		return [
			ObjetTri_1.ObjetTri.init(
				"entree",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
			ObjetTri_1.ObjetTri.init("Libelle"),
		];
	}
	initialiserObjetGraphique(aParams, aInstance) {
		TUtilitaireAffectationElevesGroupe.initialiserDateListe(
			aInstance,
			aParams.idColonne === DonneesListe_HistoriqueGroupe.colonnes.entree,
			aParams.article,
		);
	}
	setDonneesObjetGraphique(aParams, aInstance) {
		TUtilitaireAffectationElevesGroupe.setDonneesDateListe(
			aInstance,
			aParams.idColonne === DonneesListe_HistoriqueGroupe.colonnes.entree,
			aParams.article,
		);
	}
}
DonneesListe_HistoriqueGroupe.colonnes = {
	nom: "nom",
	entree: "entree",
	sortie: "sortie",
};
class ObjetFenetre_HistoriqueChangementsGroupes extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			largeur: 320,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
			avecTailleSelonContenu: true,
		});
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			function (aParametres) {
				switch (aParametres.genreEvenement) {
					case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
						switch (aParametres.idColonne) {
							case DonneesListe_HistoriqueGroupe.colonnes.entree:
								if (
									aParametres.article._saisieEntree &&
									!ObjetDate_1.GDate.estJourEgal(
										aParametres.article._saisieEntree,
										aParametres.article.entree,
									)
								) {
									this.parametres.callbackSaisieDate(
										aParametres.article,
										true,
										aParametres.article.entree,
										aParametres.article.sortie,
									);
									this.fermer();
								}
								break;
							case DonneesListe_HistoriqueGroupe.colonnes.sortie:
								if (
									aParametres.article._saisieSortie &&
									!ObjetDate_1.GDate.estJourEgal(
										aParametres.article._saisieSortie,
										aParametres.article.sortie,
									)
								) {
									this.parametres.callbackSaisieDate(
										aParametres.article,
										false,
										aParametres.article.entree,
										aParametres.article.sortie,
									);
									this.fermer();
								}
								break;
							default:
						}
						return;
				}
			},
			(aInstance) => {
				aInstance.setOptionsListe({
					colonnes: [
						{
							id: DonneesListe_HistoriqueGroupe.colonnes.nom,
							titre: ObjetTraduction_1.GTraductions.getValeur("Nom"),
							taille: "100%",
						},
						{
							id: DonneesListe_HistoriqueGroupe.colonnes.entree,
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"ListeRessources.Entree",
							),
							taille: 60,
						},
						{
							id: DonneesListe_HistoriqueGroupe.colonnes.sortie,
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"ListeRessources.Sortie",
							),
							taille: 60,
						},
					],
					hauteurAdapteContenu: true,
					hauteurMaxAdapteContenu: 300,
					AvecSuppression: false,
				});
			},
		);
	}
	setDonnees(aParams) {
		this.parametres = $.extend(
			{ listeGroupes: null, eleve: null, callbackSaisieDate: null },
			aParams,
		);
		this.setOptionsFenetre({
			titre:
				this.parametres.eleve.getLibelle() +
				" - " +
				ObjetTraduction_1.GTraductions.getValeur(
					"ListeRessources.HistoriqueChangements",
				),
		});
		this.afficher();
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_HistoriqueGroupe(this.parametres.listeGroupes),
		);
	}
	composeContenu() {
		return IE.jsx.str(
			"div",
			{ class: "Table" },
			IE.jsx.str(
				"div",
				{ id: this.getNomInstance(this.identListe), style: "height:100%" },
				"\u00A0",
			),
		);
	}
}
