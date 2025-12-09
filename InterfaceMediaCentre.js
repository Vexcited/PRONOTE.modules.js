exports.InterfaceMediaCentre = void 0;
const ObjetInterfacePageCP_1 = require("ObjetInterfacePageCP");
const ObjetListe_1 = require("ObjetListe");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const MoteurMediaCentre_1 = require("MoteurMediaCentre");
const DonneesListe_MediaCentre_1 = require("DonneesListe_MediaCentre");
class InterfaceMediaCentre extends ObjetInterfacePageCP_1.InterfacePageCP {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsEcrans({ nbNiveaux: 2, avecBascule: IE.estMobile });
		this.contexte = $.extend(this.contexte, {
			ecran: [
				MoteurMediaCentre_1.MediaCentre.genreEcran.selecteur,
				MoteurMediaCentre_1.MediaCentre.genreEcran.liste,
			],
		});
		this.moteur = new MoteurMediaCentre_1.MoteurMediaCentre();
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = this.optionsEcrans.avecBascule;
	}
	construireInstances() {
		this.identListeTypePresentation = this.add(
			ObjetListe_1.ObjetListe,
			(aParametres) => {
				switch (aParametres.genreEvenement) {
					case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
						this.moteur.actualiserDonneesSelonCode(
							aParametres.article.getGenre(),
						);
						this.basculerEcran(
							{ niveauEcran: 0, dataEcran: aParametres.article },
							{
								niveauEcran: 1,
								genreEcran: this.getCtxEcran({ niveauEcran: 1 }),
							},
						);
						break;
				}
			},
			(aListe) => {
				aListe.setOptionsListe({
					skin: ObjetListe_1.ObjetListe.skin.flatDesign,
					nonEditableSurModeExclusif: true,
					avecOmbreDroite: false,
					messageContenuVide: this.moteur.getLibelleAucuneRessource(),
					avecLigneCreation: false,
				});
			},
		);
		this.identListeRessources = this.add(
			ObjetListe_1.ObjetListe,
			(aParametres) => {
				switch (aParametres.genreEvenement) {
					case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
						break;
				}
			},
			(aListe) => {
				aListe.setOptionsListe({
					skin: ObjetListe_1.ObjetListe.skin.flatDesign,
					nonEditableSurModeExclusif: true,
					avecOmbreDroite: true,
					avecLigneCreation: false,
					messageContenuVide: this.moteur.getLibelleListeVide(),
					boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher }],
				});
			},
		);
	}
	construireStructureAffichageAutre() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ class: MediaCentre_css_1.StylesMediaCentre.InterfaceMediaCentre },
				IE.jsx.str(
					"section",
					{
						id: this.getIdDeNiveau({ niveauEcran: 0 }),
						class: [
							"liste",
							MediaCentre_css_1.StylesMediaCentre.typepresentation,
						],
					},
					IE.jsx.str("div", {
						id: this.getNomInstance(this.identListeTypePresentation),
						class: ["full-height"],
					}),
				),
				IE.jsx.str(
					"aside",
					{
						id: this.getIdDeNiveau({ niveauEcran: 1 }),
						class: [
							"liste",
							MediaCentre_css_1.StylesMediaCentre.ressourcesmediacentre,
						],
						tabindex: "0",
					},
					IE.jsx.str("div", {
						id: this.getNomInstance(this.identListeRessources),
						class: ["full-height"],
					}),
				),
			),
		);
	}
	recupererDonnees() {
		this.moteur.recupererDonnees().then(() => {
			this.getInstance(this.identListeTypePresentation).setDonnees(
				new DonneesListe_MediaCentre_1.DonneesListe_TypePresentationMediaCentre(
					this.moteur.rubriques,
				),
			);
			if (this.optionsEcrans.avecBascule) {
				this.basculerEcran(null, {
					niveauEcran: 0,
					genreEcran: this.getCtxEcran({ niveauEcran: 0 }),
				});
			} else {
				this.actualiserAffichage();
			}
		});
	}
	_evntRetourEcranPrec() {
		switch (this.getCtxEcran({ niveauEcran: this.contexte.niveauCourant })) {
			case MoteurMediaCentre_1.MediaCentre.genreEcran.liste:
				this.revenirSurEcranPrecedent();
				break;
		}
	}
	async construireEcran(aParams) {
		switch (aParams.genreEcran) {
			case MoteurMediaCentre_1.MediaCentre.genreEcran.selecteur:
				if (this.optionsEcrans.avecBascule) {
					let lHtmlBandeau = "";
					this.setHtmlStructureAffichageBandeau(lHtmlBandeau);
				}
				break;
			case MoteurMediaCentre_1.MediaCentre.genreEcran.liste: {
				if (this.optionsEcrans.avecBascule) {
					let lHtmlBandeau = this.construireBandeauEcran(
						`<div class="titretypePresentation">${this.moteur.getLibellePourBandeau()}</div>`,
						{ bgWhite: true },
					);
					this.setHtmlStructureAffichageBandeau(lHtmlBandeau);
				}
				this.moteur.actualiserDonneesSelonCode(
					this.moteur.rubriqueSelectionnee.getGenre(),
				);
				this.actualiserAffichage();
				break;
			}
		}
	}
	actualiserAffichage() {
		if (!this.moteur.rubriqueSelectionnee) {
			this.getInstance(this.identListeRessources).reset();
			if (!this.moteur.rubriques) {
				this.getInstance(this.identListeRessources).setVisible(false);
			}
		} else {
			this.getInstance(this.identListeRessources).setDonnees(
				new DonneesListe_MediaCentre_1.DonneesListe_MediaCentre(
					this.moteur.donnees,
					this.moteur.rubriqueSelectionnee,
				),
			);
		}
	}
}
exports.InterfaceMediaCentre = InterfaceMediaCentre;
