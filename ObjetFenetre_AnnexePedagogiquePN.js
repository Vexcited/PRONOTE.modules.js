exports.ObjetFenetre_AnnexePedagogiquePN = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypesAnnexePedagogique_1 = require("TypesAnnexePedagogique");
const GUID_1 = require("GUID");
const jsx_1 = require("jsx");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
class ObjetFenetre_AnnexePedagogiquePN extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreAnnexePedaStage.annexePedagogique",
			),
			largeur: 500,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			comboSujet: {
				getDonnees(aDonnees) {
					if (!aDonnees) {
						return aInstance.parametres.listeSujets;
					}
				},
				getIndiceSelection() {
					return aInstance.parametres.listeSujets.getIndiceParElement(
						aInstance.donnees.sujet,
					);
				},
				event(aParametres) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						!!aParametres.estSelectionManuelle &&
						!!aParametres.element
					) {
						if (!!aInstance.donnees.sujet) {
							aInstance.donnees.sujet = aParametres.element;
							aInstance.verifierDonnees();
						}
					}
				},
			},
			comboModalitesDEvaluation: {
				getDonnees(aDonnees) {
					if (!aDonnees) {
						return TypesAnnexePedagogique_1.TypeModaliteDEvaluationMilieuProfessionnelUtil.getListe();
					}
				},
				getIndiceSelection() {
					return aInstance.donnees.typeModalitesEvaluation.getGenre();
				},
				event(aParametres) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						!!aParametres.estSelectionManuelle &&
						!!aParametres.element
					) {
						if (!!aInstance.donnees.typeModalitesEvaluation) {
							aInstance.donnees.typeModalitesEvaluation = aParametres.element;
							aInstance.verifierDonnees();
						}
					}
				},
			},
			txtAnnexePeda: {
				getValue: function (aTypeAnnexePedagogique) {
					switch (aTypeAnnexePedagogique) {
						case TypesAnnexePedagogique_1.TypeAnnexePedagogique
							.TAP_SujetDetaille:
							return aInstance.donnees.sujetDetaille;
						case TypesAnnexePedagogique_1.TypeAnnexePedagogique
							.TAP_ActivitesDejaRealisees:
							return aInstance.donnees.activitesDejaRealisees;
						case TypesAnnexePedagogique_1.TypeAnnexePedagogique
							.TAP_CompetencesMobilisees:
							return aInstance.donnees.competencesMobilisees;
						case TypesAnnexePedagogique_1.TypeAnnexePedagogique.TAP_Objectifs:
							return aInstance.donnees.objectifs;
						case TypesAnnexePedagogique_1.TypeAnnexePedagogique
							.TAP_ActivitesPrevues:
							return aInstance.donnees.activitesPrevues;
						case TypesAnnexePedagogique_1.TypeAnnexePedagogique
							.TAP_MoyensMobilises:
							return aInstance.donnees.moyensMobilises;
						case TypesAnnexePedagogique_1.TypeAnnexePedagogique
							.TAP_CompetencesVisees:
							return aInstance.donnees.competencesVisees;
						case TypesAnnexePedagogique_1.TypeAnnexePedagogique
							.TAP_TravauxAuxMineurs:
							return aInstance.donnees.travauxAuxMineurs;
						case TypesAnnexePedagogique_1.TypeAnnexePedagogique
							.TAP_ModalitesDeConcertation:
							return aInstance.donnees.modalitesConcertation;
						case TypesAnnexePedagogique_1.TypeAnnexePedagogique
							.TAP_ModalitesDEvaluation:
							return aInstance.donnees.modalitesEvaluation;
					}
				},
				setValue: function (aTypeAnnexePedagogique, aValeur) {
					if (!!aInstance.donnees) {
						switch (aTypeAnnexePedagogique) {
							case TypesAnnexePedagogique_1.TypeAnnexePedagogique
								.TAP_SujetDetaille:
								aInstance.donnees.sujetDetaille = aValeur;
								break;
							case TypesAnnexePedagogique_1.TypeAnnexePedagogique
								.TAP_ActivitesDejaRealisees:
								aInstance.donnees.activitesDejaRealisees = aValeur;
								break;
							case TypesAnnexePedagogique_1.TypeAnnexePedagogique
								.TAP_CompetencesMobilisees:
								aInstance.donnees.competencesMobilisees = aValeur;
								break;
							case TypesAnnexePedagogique_1.TypeAnnexePedagogique.TAP_Objectifs:
								aInstance.donnees.objectifs = aValeur;
								break;
							case TypesAnnexePedagogique_1.TypeAnnexePedagogique
								.TAP_ActivitesPrevues:
								aInstance.donnees.activitesPrevues = aValeur;
								break;
							case TypesAnnexePedagogique_1.TypeAnnexePedagogique
								.TAP_MoyensMobilises:
								aInstance.donnees.moyensMobilises = aValeur;
								break;
							case TypesAnnexePedagogique_1.TypeAnnexePedagogique
								.TAP_CompetencesVisees:
								aInstance.donnees.competencesVisees = aValeur;
								break;
							case TypesAnnexePedagogique_1.TypeAnnexePedagogique
								.TAP_TravauxAuxMineurs:
								aInstance.donnees.travauxAuxMineurs = aValeur;
								break;
							case TypesAnnexePedagogique_1.TypeAnnexePedagogique
								.TAP_ModalitesDeConcertation:
								aInstance.donnees.modalitesConcertation = aValeur;
								break;
							case TypesAnnexePedagogique_1.TypeAnnexePedagogique
								.TAP_ModalitesDEvaluation:
								aInstance.donnees.modalitesEvaluation = aValeur;
								break;
						}
						aInstance.verifierDonnees();
					}
				},
			},
		});
	}
	setDonnees(aDonnees, aParams) {
		this.reference = aDonnees;
		this.donnees = MethodesObjet_1.MethodesObjet.dupliquer(aDonnees);
		this.parametres = aParams;
		this.afficher(this.composeContenu());
		this.setBoutonActif(1, false);
	}
	composeContenu() {
		if (this.donnees) {
			const lIdComboSujet = GUID_1.GUID.getId();
			const lIdComboModalitesDEvaluation = GUID_1.GUID.getId();
			const lIdTxtArea = GUID_1.GUID.getId();
			const lIdTxtAreaSecondaire = GUID_1.GUID.getId();
			return IE.jsx.str(
				IE.jsx.fragment,
				null,
				this.parametres.listeSujets &&
					IE.jsx.str(
						"div",
						{ class: "m-bottom-xl" },
						IE.jsx.str(
							"label",
							{ id: lIdComboSujet, class: "m-bottom" },
							ObjetTraduction_1.GTraductions.getValeur(
								"FicheStage.annexe.sujet",
							),
						),
						IE.jsx.str("ie-combo", {
							"aria-labelledby": lIdComboSujet,
							"ie-model": "comboSujet",
						}),
					),
				this.parametres.genre ===
					TypesAnnexePedagogique_1.TypeAnnexePedagogique
						.TAP_ModalitesDEvaluation &&
					IE.jsx.str(
						"div",
						{ class: "m-bottom-xl" },
						IE.jsx.str(
							"label",
							{ id: lIdComboModalitesDEvaluation, class: "m-bottom" },
							ObjetTraduction_1.GTraductions.getValeur(
								"FicheStage.annexe.typeDEvaluation",
							),
						),
						IE.jsx.str("ie-combo", {
							"aria-labelledby": lIdComboModalitesDEvaluation,
							"ie-model": "comboModalitesDEvaluation",
						}),
					),
				IE.jsx.str(
					"div",
					null,
					IE.jsx.str(
						"label",
						{ for: lIdTxtArea, class: "m-bottom" },
						TypesAnnexePedagogique_1.TypeAnnexePedagogiqueUtil.getLabel(
							this.parametres.genre,
						),
					),
					IE.jsx.str("ie-textareamax", {
						id: lIdTxtArea,
						"ie-autoresize": true,
						maxlength:
							TypesAnnexePedagogique_1.TypeAnnexePedagogiqueUtil.getLongueurMax(),
						class: "min-height:4rem; max-height:8rem;",
						"ie-model": (0, jsx_1.jsxFuncAttr)(
							"txtAnnexePeda",
							this.parametres.genre,
						),
					}),
				),
				this.parametres.genreSecondaire &&
					IE.jsx.str(
						"div",
						{ class: "m-top-xl" },
						IE.jsx.str(
							"label",
							{ for: lIdTxtAreaSecondaire, class: "m-bottom" },
							TypesAnnexePedagogique_1.TypeAnnexePedagogiqueUtil.getLabel(
								this.parametres.genreSecondaire,
							),
						),
						IE.jsx.str("ie-textareamax", {
							id: lIdTxtAreaSecondaire,
							"ie-autoresize": true,
							maxlength:
								TypesAnnexePedagogique_1.TypeAnnexePedagogiqueUtil.getLongueurMax(),
							class: "min-height:4rem; max-height:8rem;",
							"ie-model": (0, jsx_1.jsxFuncAttr)(
								"txtAnnexePeda",
								this.parametres.genreSecondaire,
							),
						}),
					),
			);
		}
	}
	verifierDonnees() {
		if (
			this.donnees.sujet.getNumero() !== this.reference.sujet.getNumero() ||
			this.donnees.sujetDetaille !== this.reference.sujetDetaille ||
			this.donnees.activitesDejaRealisees !==
				this.reference.activitesDejaRealisees ||
			this.donnees.competencesMobilisees !==
				this.reference.competencesMobilisees ||
			this.donnees.objectifs !== this.reference.objectifs ||
			this.donnees.activitesPrevues !== this.reference.activitesPrevues ||
			this.donnees.moyensMobilises !== this.reference.moyensMobilises ||
			this.donnees.competencesVisees !== this.reference.competencesVisees ||
			(this.reference.avecTravauxAuxMineurs &&
				this.donnees.travauxAuxMineurs !== this.reference.travauxAuxMineurs) ||
			this.donnees.modalitesConcertation !==
				this.reference.modalitesConcertation ||
			this.donnees.modalitesEvaluation !== this.reference.modalitesEvaluation ||
			this.donnees.typeModalitesEvaluation.getGenre() !==
				this.reference.typeModalitesEvaluation.getGenre()
		) {
			this.setBoutonActif(1, true);
		} else {
			this.setBoutonActif(1, false);
		}
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		this.callback.appel(aNumeroBouton, this.donnees);
	}
}
exports.ObjetFenetre_AnnexePedagogiquePN = ObjetFenetre_AnnexePedagogiquePN;
