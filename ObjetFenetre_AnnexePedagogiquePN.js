exports.ObjetFenetre_AnnexePedagogiquePN = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypesAnnexePedagogique_1 = require("TypesAnnexePedagogique");
const GUID_1 = require("GUID");
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
	jsxModeleTextareaAnnexePeda(aTypeAnnexePedagogique) {
		return {
			getValue: () => {
				switch (aTypeAnnexePedagogique) {
					case TypesAnnexePedagogique_1.TypeAnnexePedagogique.TAP_SujetDetaille:
						return this.donnees.sujetDetaille;
					case TypesAnnexePedagogique_1.TypeAnnexePedagogique
						.TAP_ActivitesDejaRealisees:
						return this.donnees.activitesDejaRealisees;
					case TypesAnnexePedagogique_1.TypeAnnexePedagogique
						.TAP_CompetencesMobilisees:
						return this.donnees.competencesMobilisees;
					case TypesAnnexePedagogique_1.TypeAnnexePedagogique.TAP_Objectifs:
						return this.donnees.objectifs;
					case TypesAnnexePedagogique_1.TypeAnnexePedagogique
						.TAP_ActivitesPrevues:
						return this.donnees.activitesPrevues;
					case TypesAnnexePedagogique_1.TypeAnnexePedagogique
						.TAP_MoyensMobilises:
						return this.donnees.moyensMobilises;
					case TypesAnnexePedagogique_1.TypeAnnexePedagogique
						.TAP_CompetencesVisees:
						return this.donnees.competencesVisees;
					case TypesAnnexePedagogique_1.TypeAnnexePedagogique
						.TAP_TravauxAuxMineurs:
						return this.donnees.travauxAuxMineurs;
					case TypesAnnexePedagogique_1.TypeAnnexePedagogique
						.TAP_ModalitesDeConcertation:
						return this.donnees.modalitesConcertation;
					case TypesAnnexePedagogique_1.TypeAnnexePedagogique
						.TAP_ModalitesDEvaluation:
						return this.donnees.modalitesEvaluation;
				}
			},
			setValue: (aValue) => {
				if (!!this.donnees) {
					switch (aTypeAnnexePedagogique) {
						case TypesAnnexePedagogique_1.TypeAnnexePedagogique
							.TAP_SujetDetaille:
							this.donnees.sujetDetaille = aValue;
							break;
						case TypesAnnexePedagogique_1.TypeAnnexePedagogique
							.TAP_ActivitesDejaRealisees:
							this.donnees.activitesDejaRealisees = aValue;
							break;
						case TypesAnnexePedagogique_1.TypeAnnexePedagogique
							.TAP_CompetencesMobilisees:
							this.donnees.competencesMobilisees = aValue;
							break;
						case TypesAnnexePedagogique_1.TypeAnnexePedagogique.TAP_Objectifs:
							this.donnees.objectifs = aValue;
							break;
						case TypesAnnexePedagogique_1.TypeAnnexePedagogique
							.TAP_ActivitesPrevues:
							this.donnees.activitesPrevues = aValue;
							break;
						case TypesAnnexePedagogique_1.TypeAnnexePedagogique
							.TAP_MoyensMobilises:
							this.donnees.moyensMobilises = aValue;
							break;
						case TypesAnnexePedagogique_1.TypeAnnexePedagogique
							.TAP_CompetencesVisees:
							this.donnees.competencesVisees = aValue;
							break;
						case TypesAnnexePedagogique_1.TypeAnnexePedagogique
							.TAP_TravauxAuxMineurs:
							this.donnees.travauxAuxMineurs = aValue;
							break;
						case TypesAnnexePedagogique_1.TypeAnnexePedagogique
							.TAP_ModalitesDeConcertation:
							this.donnees.modalitesConcertation = aValue;
							break;
						case TypesAnnexePedagogique_1.TypeAnnexePedagogique
							.TAP_ModalitesDEvaluation:
							this.donnees.modalitesEvaluation = aValue;
							break;
					}
					this.verifierDonnees();
				}
			},
		};
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
						"ie-model": this.jsxModeleTextareaAnnexePeda.bind(
							this,
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
							"ie-model": this.jsxModeleTextareaAnnexePeda.bind(
								this,
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
