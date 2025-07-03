exports.PageFicheStage = void 0;
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListe_1 = require("ObjetListe");
const DonneesListe_SuiviStage_1 = require("DonneesListe_SuiviStage");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const UtilitaireFicheStage_1 = require("UtilitaireFicheStage");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_AffichageFicheStage_1 = require("Enumere_AffichageFicheStage");
class PageFicheStage extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.idSurSuivi = this.Nom + "_surSuivi";
		this.initParametres();
	}
	construireInstances() {
		this.identListeSuivis = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementListeSuivis.bind(this),
			this._initialiserListeSuivis,
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	initParametres() {
		this.parametres = {
			avecEdition: false,
			avecEditionDocumentsJoints: false,
			avecEditionSuivisDeStage: false,
		};
	}
	setParametres(aParametres) {
		$.extend(this.parametres, aParametres);
	}
	setDonnees(aDonnees) {
		this.donnees = aDonnees.stage;
		this.listePJ = aDonnees.pj;
		this.selectOngletStage = aDonnees.genreOnglet;
		(this.evenements = aDonnees.evenements),
			(this.lieux = aDonnees.lieux),
			(this.parametres.listeSujetsStage = aDonnees.listeSujetsStage),
			(this.dateFinSaisieSuivi = aDonnees.dateFinSaisieSuivi);
		this.initControleur = Object.assign({}, this.controleur);
		this.controleur = {};
		this.controleur = this.getControleur(this);
		this.afficher();
		if (
			!!this.donnees &&
			this.selectOngletStage ===
				Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Suivi
		) {
			if (!!this.donnees.suiviStage) {
				const lThis = this;
				this.donnees.suiviStage.parcourir((aSuivi) => {
					if (!!lThis.evenements && !!aSuivi.evenement) {
						const lEvenementDeListeComplete =
							lThis.evenements.getElementParNumero(
								aSuivi.evenement.getNumero(),
							);
						if (!!lEvenementDeListeComplete) {
							aSuivi.evenement = lEvenementDeListeComplete;
						}
					}
					if (!!lThis.lieux && !!aSuivi.lieu) {
						const lLieuDeListeComplete = lThis.lieux.getElementParNumero(
							aSuivi.lieu.getNumero(),
						);
						if (!!lLieuDeListeComplete) {
							aSuivi.lieu = lLieuDeListeComplete;
						}
					}
				});
			}
			this.getInstance(this.identListeSuivis).setOptionsListe({
				messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
					"FicheStage.listeSuivis.AucunSuivi",
				),
				avecLigneCreation: this.parametres.avecEditionSuivisDeStage,
			});
			this.getInstance(this.identListeSuivis).setDonnees(
				new DonneesListe_SuiviStage_1.DonneesListe_SuiviStage(
					this.donnees.suiviStage,
					this.parametres,
				),
			);
			if (
				!!this.suivi &&
				!!this.donnees.suiviStage.getElementParNumero(this.suivi.getNumero())
			) {
				this.getInstance(this.identListeSuivis).selectionnerLigne({
					ligne: this.donnees.suiviStage.getIndiceParElement(this.suivi),
					avecEvenement: true,
				});
			}
		}
	}
	construireAffichage() {
		if (!this.donnees) {
			return "";
		}
		const H = [];
		if (
			this.selectOngletStage !==
			Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Suivi
		) {
			H.push(
				IE.jsx.str("div", { class: "conteneur-FicheStage" }, () => {
					switch (this.selectOngletStage) {
						case Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage
							.Details:
							return UtilitaireFicheStage_1.UtilitaireFicheStage.composeBlocDetails(
								this.donnees,
								{ parametres: this.parametres, controleur: this.controleur },
							);
						case Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Annexe:
							return UtilitaireFicheStage_1.UtilitaireFicheStage.composeBlocAnnexe(
								this.donnees,
								{ parametres: this.parametres, controleur: this.controleur },
							);
						case Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage
							.Appreciations:
							return UtilitaireFicheStage_1.UtilitaireFicheStage.composeBlocAppreciations(
								this.donnees,
								{ parametres: this.parametres, controleur: this.controleur },
							);
						default:
							break;
					}
				}),
			);
		} else {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "flex-contain onglet-suivi" },
					IE.jsx.str("div", {
						class: "conteneur-liste-suivi",
						id: this.getInstance(this.identListeSuivis).getNom(),
					}),
					IE.jsx.str("div", {
						class: "conteneur-FicheStage",
						id: this.idSurSuivi,
						tabindex: "0",
					}),
				),
			);
		}
		return H.join("");
	}
	actualiserListeSuivis(aSuiviSelectionne) {
		this.getInstance(this.identListeSuivis).actualiser();
		this.getInstance(this.identListeSuivis).setListeElementsSelection(
			new ObjetListeElements_1.ObjetListeElements().add(aSuiviSelectionne),
		);
	}
	actionSurValidation() {
		this.callback.appel();
	}
	evenementListeSuivis(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				UtilitaireFicheStage_1.UtilitaireFicheStage.composeFenetreCreerSuivi(
					this,
				);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.suivi = aParams.article;
				this.controleur = Object.assign({}, this.initControleur);
				ObjetHtml_1.GHtml.setHtml(
					this.idSurSuivi,
					UtilitaireFicheStage_1.UtilitaireFicheStage.composeSurSuivi(
						this.suivi,
						{
							parametres: this.parametres,
							controleur: this.controleur,
							stage: this.donnees,
							evenements: this.evenements,
							lieux: this.lieux,
							pere: this.Nom,
						},
					),
					this.controleur,
				);
				ObjetHtml_1.GHtml.setFocus(this.idSurSuivi);
				break;
		}
	}
	_initialiserListeSuivis(aInstance) {
		const lColonnes = [{ id: "PageFicheStage_ListeSuivis", taille: "100%" }];
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecOmbreDroite: true,
			hauteurZoneContenuListeMin: 200,
			titreCreation: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreSuiviStage.NouveauSuivi",
			),
			ariaLabel: () => {
				var _a, _b;
				return (
					((_b = (_a = this.parametres).getLabelListe) === null || _b === void 0
						? void 0
						: _b.call(_a)) || ""
				);
			},
		});
	}
}
exports.PageFicheStage = PageFicheStage;
