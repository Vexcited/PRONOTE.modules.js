exports.PiedBulletin_Certificats = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Date_1 = require("ObjetFenetre_Date");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_ListeAttestations_1 = require("DonneesListe_ListeAttestations");
const TypeModeAffichagePiedBulletin_1 = require("TypeModeAffichagePiedBulletin");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequeteSaisieFicheEleve_1 = require("ObjetRequeteSaisieFicheEleve");
const AccessApp_1 = require("AccessApp");
class PiedBulletin_Certificats extends ObjetInterface_1.ObjetInterface {
	constructor() {
		super(...arguments);
		this.appSco = (0, AccessApp_1.getApp)();
		this.params = {
			modeAffichage:
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Onglets,
		};
		this.avecSaisie =
			this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.avecSaisieAttestations,
			) || this.appSco.getEtatUtilisateur().pourPrimaire();
		this.attestationEtendue = this.appSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.fonctionnalites.attestationEtendue,
		);
	}
	setDonnees(aParam) {
		$.extend(true, this.params, aParam);
		this.listeAttestations = aParam.listeAttestations;
		this.listeAttestationsEleve = aParam.listeAttestationsEleve;
		this.eleve = aParam.eleve;
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.idListeAttestations;
		this.avecBandeau = false;
		this.AvecCadre = false;
	}
	construireInstances() {
		this.idListeAttestations = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementListeAttestations,
			this.initialiserListeAttestations,
		);
	}
	initialiserListeAttestations(aInstance) {
		const lColonnes = [
			{
				id: DonneesListe_ListeAttestations_1.DonneesListe_ListeAttestations
					.colonnes.libelle,
				titre: ObjetTraduction_1.GTraductions.getValeur("FicheEleve.libelle"),
				taille: 150,
			},
			{
				id: DonneesListe_ListeAttestations_1.DonneesListe_ListeAttestations
					.colonnes.libelleLong,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"FicheEleve.libelleLong",
				),
				taille: 400,
			},
			{
				id: DonneesListe_ListeAttestations_1.DonneesListe_ListeAttestations
					.colonnes.descriptif,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"FicheEleve.descriptifAttestation",
				),
				taille: 75,
			},
			{
				id: DonneesListe_ListeAttestations_1.DonneesListe_ListeAttestations
					.colonnes.etat,
				titre: ObjetTraduction_1.GTraductions.getValeur("FicheEleve.etat"),
				taille: 40,
			},
			{
				id: DonneesListe_ListeAttestations_1.DonneesListe_ListeAttestations
					.colonnes.date,
				titre: ObjetTraduction_1.GTraductions.getValeur("FicheEleve.date"),
				taille: 150,
			},
		];
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			AvecSuppression: false,
			avecLigneCreation: false,
			colonnesCachees: this.attestationEtendue
				? []
				: [
						DonneesListe_ListeAttestations_1.DonneesListe_ListeAttestations
							.colonnes.descriptif,
					],
		});
	}
	evenementListeAttestations(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
				const lEtat = aParametres.article.delivree;
				if (lEtat && this.avecSaisie) {
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_Date_1.ObjetFenetre_Date,
						{
							pere: this,
							evenement: function (aNumeroBouton, aDate) {
								if (aNumeroBouton === 1) {
									aParametres.article.date = aDate;
								}
								aParametres.article.setEtat(
									Enumere_Etat_1.EGenreEtat.Modification,
								);
								this.getInstance(this.idListeAttestations).actualiser();
								this._validerAttestations();
							},
							initialiser: function (aInstance) {
								aInstance.setParametres(
									ObjetDate_1.GDate.PremierLundi,
									ObjetDate_1.GDate.premiereDate,
									GParametres.DerniereDate,
								);
							},
						},
					).setDonnees(
						ObjetDate_1.GDate.getDateBornee(aParametres.article.date),
					);
				}
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				if (this.avecSaisie) {
					this._validerAttestations();
				}
				break;
		}
	}
	getDonneesSaisie() {
		if (
			[
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Onglets,
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Lineaire,
			].includes(this.params.modeAffichage)
		) {
			return { listeAttestationsEleve: this.listeAttestationsEleve };
		}
	}
	estAffiche() {
		return !!this.listeAttestations && this.listeAttestations.count() > 0;
	}
	setParametres(aParam) {
		$.extend(true, this.params, aParam);
	}
	afficher(aParam) {
		$.extend(true, this.params, aParam);
		switch (aParam.modeAffichage) {
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Onglets: {
				const lResult = new ObjetListeElements_1.ObjetListeElements();
				const lListe = this.listeAttestationsEleve;
				this.listeAttestations.parcourir((aAttestation) => {
					lListe.parcourir((aAttestationEleve) => {
						if (aAttestation.abbreviation === aAttestationEleve.abbreviation) {
							aAttestation.date = aAttestationEleve.date
								? aAttestationEleve.date
								: new Date();
							aAttestation.delivree = aAttestationEleve.delivree;
						}
					});
					lResult.addElement(aAttestation);
				});
				this.listeAttestationsEleve = lResult;
				if (this.getInstance(this.idListeAttestations)) {
					const lDonneesListe =
						new DonneesListe_ListeAttestations_1.DonneesListe_ListeAttestations(
							lResult,
						);
					lDonneesListe.setParametres({ avecValidationAuto: this.avecSaisie });
					this.getInstance(this.idListeAttestations).setDonnees(lDonneesListe);
				}
				break;
			}
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Lineaire:
				ObjetHtml_1.GHtml.setHtml(
					this.Nom,
					this._construireAttestations(this.listeAttestationsEleve),
				);
				break;
		}
	}
	_construireAttestations(aParam) {
		const T = [];
		if (aParam) {
			const lNbr = aParam.count();
			T.push(
				'<h2 class="p-y ie-titre-petit Gras" style="',
				ObjetStyle_1.GStyle.composeCouleurTexte(GCouleur.themeCouleur.foncee),
				'">',
				ObjetTraduction_1.GTraductions.getValeur("FicheEleve.attestations"),
				"</h2>",
			);
			T.push(
				'<div><ul class="Texte10" style="display:table; width:50%; padding:0; margin:0">',
			);
			for (let i = 0; i < lNbr; i++) {
				const aElement = aParam.get(i);
				T.push(
					'<li style="display:table-row;">',
					'<span class="AlignementGauche" style="display:table-cell;">- ',
					aElement.getLibelle(),
					"</span>",
				);
				T.push(
					'<div class="Italique AlignementDroit">',
					aElement.delivree
						? ObjetTraduction_1.GTraductions.getValeur("FicheEleve.delivree") +
								" " +
								ObjetDate_1.GDate.formatDate(aElement.date, "%JJ/%MM/%AAAA")
						: ObjetTraduction_1.GTraductions.getValeur(
								"FicheEleve.nonDelivree",
							),
					"</div></li>",
				);
			}
			T.push("</ul></div>");
		}
		return T.join("");
	}
	_validerAttestations() {
		if (this.avecSaisie) {
			new ObjetRequeteSaisieFicheEleve_1.ObjetRequeteSaisieFicheEleve(
				this,
			).lancerRequete({
				listeAttestations: this.listeAttestationsEleve,
				eleve: this.eleve,
			});
		}
	}
}
exports.PiedBulletin_Certificats = PiedBulletin_Certificats;
