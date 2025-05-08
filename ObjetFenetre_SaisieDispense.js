exports.ObjetFenetre_SaisieDispense = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const GUID_1 = require("GUID");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetDate_1 = require("ObjetDate");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetFenetre_SelectionCours_1 = require("ObjetFenetre_SelectionCours");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
class ObjetFenetre_SaisieDispense extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.estCreation = true;
		this.ids = {
			labelCours: GUID_1.GUID.getId(),
			labelDateDebut: GUID_1.GUID.getId(),
			labelDateFin: GUID_1.GUID.getId(),
			labelCommentaire: GUID_1.GUID.getId(),
			describedCours: GUID_1.GUID.getId(),
			describedMatiere: GUID_1.GUID.getId(),
			describedJustificatif: GUID_1.GUID.getId(),
		};
		this.etatUtilisateur = GEtatUtilisateur;
		this.dispense = ObjetElement_1.ObjetElement.create();
		this.dispense.Genre = Enumere_Ressource_1.EGenreRessource.Dispense;
		this.dispense.justificatifs = new ObjetListeElements_1.ObjetListeElements();
		this.dispense.commentaire = "";
		this.setOptionsFenetre({
			largeur: 400,
			hauteur: 250,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			avecComposeBasInFooter: true,
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getHtmlDispense: () => {
				if (this.estDispenseLongue) {
					return IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str(
							"article",
							{
								"ie-if": "estSurCreation",
								class: "field-contain label-up border-bottom p-bottom-xl",
							},
							IE.jsx.str("ie-combo", { "ie-model": "choixMatiere" }),
							IE.jsx.str(
								"p",
								{ id: this.ids.describedMatiere, class: "m-top-xl" },
								ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.dispense.demandePossibleCertainesMatieres",
								),
							),
						),
						IE.jsx.str(
							"article",
							{
								"ie-if": "estSurCreation",
								class: "field-contain label-up border-bottom p-bottom-xl",
							},
							IE.jsx.str(
								"label",
								{ id: this.ids.labelDateDebut },
								ObjetTraduction_1.GTraductions.getValeur("Debut"),
							),
							IE.jsx.str("div", {
								"ie-identite": "getIdentSelectDate(true)",
								class: "m-bottom-l",
							}),
							IE.jsx.str(
								"label",
								{ id: this.ids.labelDateFin },
								ObjetTraduction_1.GTraductions.getValeur("Fin"),
							),
							IE.jsx.str("div", { "ie-identite": "getIdentSelectDate(false)" }),
						),
						IE.jsx.str(
							"article",
							{
								"ie-if": "estSurModification",
								class: "field-contain border-bottom p-bottom-xl",
							},
							IE.jsx.str(
								"h2",
								{ class: "ie-titre" },
								this.getLibelleDeMatiere(),
							),
						),
						this.getHtmlJustificatifEtCommentaire(),
					);
				} else {
					return IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str(
							"article",
							{
								"ie-if": "estSurCreation",
								class: "field-contain label-up border-bottom p-bottom-xl",
							},
							IE.jsx.str(
								"label",
								{ id: this.ids.labelCours },
								ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.dispense.labelCours",
								),
							),
							IE.jsx.str("ie-btnselecteur", {
								"aria-labelledby": this.ids.labelCours,
								"aria-describedby": this.ids.describedCours,
								placeholder: ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.dispense.placeholderCours",
								),
								"ie-model": "choixCours",
								"aria-required": "true",
							}),
							IE.jsx.str(
								"p",
								{ id: this.ids.describedCours, class: "m-top-xl" },
								ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.dispense.demandePossibleCertainesMatieres",
								),
							),
						),
						IE.jsx.str(
							"article",
							{
								"ie-if": "estSurModification",
								class: "field-contain border-bottom p-bottom-xl",
							},
							IE.jsx.str("h2", { class: "ie-titre" }, this.getLibelleDuCours()),
						),
						this.getHtmlJustificatifEtCommentaire(),
					);
				}
			},
			choixCours: {
				event: () => {
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_SelectionCours_1.ObjetFenetre_SelectionCours,
						{
							pere: this,
							initialiser(aFenetre) {
								aFenetre.TypeInstanceEDT =
									ObjetFenetre_SelectionCours_1.ObjetFenetre_SelectionCours.TypeInstanceEDT.Dispense;
							},
							evenement: (aGenreBouton, aCours) => {
								if (
									this.estCreation &&
									aGenreBouton === 1 &&
									this.estDispenseCD(this.dispense)
								) {
									this.dispense.cours = aCours;
								}
							},
						},
					).afficher();
				},
				getLibelle: () => {
					return this.getLibelleDuCours();
				},
			},
			choixMatiere: {
				init: (aCombo) => {
					aCombo.setOptionsObjetSaisie({
						avecDesignMobile: true,
						avecElementObligatoire: true,
						longueur: 330,
						libelleHaut: ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.dispense.labelMatiere",
						),
						describedById: this.ids.describedMatiere,
						multiSelection: true,
						placeHolder: ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.dispense.placeholderMatiere",
						),
						required: true,
					});
				},
				getDonnees: () => {
					return this.etatUtilisateur.getMembre()
						.listeMatieresDeclarationDispense;
				},
				getIndiceSelection: () => {
					return this.dispense.matieres;
				},
				event: (aParams) => {
					if (
						this.estCreation &&
						aParams.interactionUtilisateur &&
						aParams.listeSelections !== null &&
						this.estDispenseLD(this.dispense)
					) {
						this.dispense.matieres = MethodesObjet_1.MethodesObjet.dupliquer(
							aParams.listeSelections,
						);
					}
				},
				getDisabled: () => {
					var _a;
					return (
						((_a =
							this.etatUtilisateur.getMembre()
								.listeMatieresDeclarationDispense) === null || _a === void 0
							? void 0
							: _a.count()) <= 1
					);
				},
			},
			getIdentSelectDate: (aEstDateDebut) => {
				return {
					class: ObjetCelluleDate_1.ObjetCelluleDate,
					pere: this,
					init: (aInstanceDate) => {
						const lNbMaxJoursDeclarationDispLD =
							this.etatUtilisateur.Identification.ressource
								.nbMaxJoursDeclarationDispLD;
						aInstanceDate.initialiser();
						aInstanceDate.setOptionsObjetCelluleDate({
							designMobile: true,
							premiereDateSaisissable: ObjetDate_1.GDate.aujourdhui,
							derniereDate:
								lNbMaxJoursDeclarationDispLD && aEstDateDebut
									? ObjetDate_1.GDate.getJourSuivant(
											ObjetDate_1.GDate.aujourdhui,
											lNbMaxJoursDeclarationDispLD,
										)
									: ObjetDate_1.GDate.derniereDate,
							labelledById: aEstDateDebut
								? this.ids.labelDateDebut
								: this.ids.labelDateFin,
							required: true,
						});
						if (aEstDateDebut) {
							this.selectDateDebut = aInstanceDate;
						} else {
							this.selectDateFin = aInstanceDate;
						}
					},
					start: (aInstanceDate) => {
						if (this.estDispenseLD(this.dispense)) {
							aInstanceDate.setDonnees(
								aEstDateDebut ? this.dispense.dateDebut : this.dispense.dateFin,
							);
						}
					},
					evenement: (aDate) => {
						if (this.estCreation && this.estDispenseLD(this.dispense)) {
							if (aEstDateDebut) {
								this.dispense.dateDebut = new Date(aDate);
								if (
									ObjetDate_1.GDate.estDateJourAvant(
										this.dispense.dateFin,
										aDate,
									)
								) {
									this.selectDateFin.setDonnees(aDate, true);
								}
							} else {
								this.dispense.dateFin = new Date(aDate);
								if (
									ObjetDate_1.GDate.estDateJourAvant(
										aDate,
										this.dispense.dateDebut,
									)
								) {
									this.selectDateDebut.setDonnees(aDate, true);
								}
							}
						}
					},
				};
			},
			btnJustificatif: {
				getOptionsSelecFile: () => {
					return {
						genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
						genreRessourcePJ: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
						maxFiles: 1,
						maxSize: GApplication.droits.get(
							ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
						),
					};
				},
				addFiles: (aParamsAddFiles) => {
					this.dispense.justificatifs.add(aParamsAddFiles.listeFichiers);
					this.dispense.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				},
				getLibelle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.dispense.ajouterJustificatif",
					);
				},
				getIcone() {
					return IE.jsx.str("i", {
						class: "icon_piece_jointe",
						"aria-hidden": "true",
					});
				},
				getDisabled: () => {
					var _a, _b;
					return (
						((_b =
							(_a = this.dispense) === null || _a === void 0
								? void 0
								: _a.justificatifs) === null || _b === void 0
							? void 0
							: _b.getNbrElementsExistes()) > 0
					);
				},
			},
			avecListePJ: () => {
				var _a, _b;
				return (
					((_b =
						(_a = this.dispense) === null || _a === void 0
							? void 0
							: _a.justificatifs) === null || _b === void 0
						? void 0
						: _b.getNbrElementsExistes()) > 0
				);
			},
			getHtmlPJ: () => {
				var _a, _b;
				if (
					((_b =
						(_a = this.dispense) === null || _a === void 0
							? void 0
							: _a.justificatifs) === null || _b === void 0
						? void 0
						: _b.getNbrElementsExistes()) > 0
				) {
					return [
						UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
							this.dispense.justificatifs,
							{ IEModelChips: "chipsJustificatif" },
						),
					].join("");
				} else {
					return "";
				}
			},
			chipsJustificatif: {
				eventBtn: (aIndice) => {
					var _a;
					if (
						(_a = this.dispense) === null || _a === void 0
							? void 0
							: _a.justificatifs
					) {
						const lPieceJointeASupp = this.dispense.justificatifs.get(aIndice);
						if (!!lPieceJointeASupp) {
							lPieceJointeASupp.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
							this.dispense.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						}
					}
				},
			},
			commentaire: {
				getValue: () => {
					var _a;
					return (
						((_a = this.dispense) === null || _a === void 0
							? void 0
							: _a.commentaire) || ""
					);
				},
				setValue: (aValue) => {
					if (this.dispense.commentaire !== aValue) {
						this.dispense.commentaire = aValue;
						this.dispense.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
			},
			avecSuppression: () => {
				return !this.estCreation;
			},
			btnSupprimer: {
				event: () => {
					GApplication.getMessage().afficher({
						message: ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.dispense.confirmationSuppressionDemande",
						),
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						callback: (aEGenreAction) => {
							if (aEGenreAction === Enumere_Action_1.EGenreAction.Valider) {
								this.dispense.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
								this.callback.appel(
									new ObjetListeElements_1.ObjetListeElements().add(
										this.dispense,
									),
								);
							}
						},
					});
				},
			},
			estSurCreation: () => {
				return this.estCreation;
			},
			estSurModification: () => {
				return !this.estCreation;
			},
		});
	}
	composeContenu() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str("section", { "ie-html": "getHtmlDispense" }),
		);
	}
	composeBas() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ "ie-if": "avecSuppression", class: "compose-bas" },
				IE.jsx.str("ie-btnicon", {
					"ie-model": "btnSupprimer",
					title: ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
					class: "icon_trash avecFond i-medium",
				}),
			),
		);
	}
	setDonnees(aParams) {
		var _a;
		this.estDispenseLongue = aParams.estDispenseLongue;
		if (aParams.dispense) {
			this.dispense = aParams.dispense;
			this.estCreation = false;
		} else {
			if (this.estDispenseCD(this.dispense)) {
				this.dispense.cours = null;
			} else {
				if (
					((_a =
						this.etatUtilisateur.getMembre()
							.listeMatieresDeclarationDispense) === null || _a === void 0
						? void 0
						: _a.count()) === 1
				) {
					this.dispense.matieres =
						this.etatUtilisateur.getMembre().listeMatieresDeclarationDispense;
				} else {
					this.dispense.matieres =
						new ObjetListeElements_1.ObjetListeElements();
				}
				this.dispense.dateDebut = ObjetDate_1.GDate.aujourdhui;
				this.dispense.dateFin = ObjetDate_1.GDate.aujourdhui;
			}
		}
		this.setOptionsFenetre({
			titre: this.estDispenseLongue
				? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.dispense.titreLD")
				: ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.dispense.titreCD",
					),
		});
		this.afficher();
	}
	surValidation(aGenreBouton) {
		if (aGenreBouton === 1) {
			if (
				this.estDispenseCD(this.dispense) &&
				(!this.dispense.cours || this.dispense.commentaire === "")
			) {
				GApplication.getMessage().afficher({
					message: this.estCreation
						? ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.dispense.msgValidationEchoueeCD",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.dispense.msgValidationEchouee",
							),
				});
			} else if (
				this.estDispenseLD(this.dispense) &&
				(this.dispense.matieres.count() === 0 ||
					this.dispense.commentaire === "")
			) {
				GApplication.getMessage().afficher({
					message: this.estCreation
						? ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.dispense.msgValidationEchoueeLD",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.dispense.msgValidationEchouee",
							),
				});
			} else {
				if (this.estCreation) {
					this.dispense.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				}
				if (this.dispense.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun) {
					this.callback.appel(
						new ObjetListeElements_1.ObjetListeElements().add(this.dispense),
						this.dispense.justificatifs,
					);
				} else {
					this.fermer();
				}
			}
		} else {
			this.fermer();
		}
	}
	estDispenseCD(aDispense) {
		return !this.estDispenseLongue;
	}
	estDispenseLD(aDispense) {
		return this.estDispenseLongue;
	}
	getLibelleDuCours() {
		if (this.estDispenseCD(this.dispense) && this.dispense.cours) {
			const lDateDebut = ObjetDate_1.GDate.placeAnnuelleEnDate(
				this.dispense.cours.Debut,
				false,
			);
			const lDateFin = ObjetDate_1.GDate.placeAnnuelleEnDate(
				this.dispense.cours.Fin,
				true,
			);
			this.dispense.cours.Libelle =
				ObjetDate_1.GDate.formatDate(
					this.dispense.cours.DateDuCours,
					`[%JJJ %J %MMM]`,
				).ucfirst() +
				" " +
				ObjetDate_1.GDate.formatDate(
					lDateDebut,
					ObjetTraduction_1.GTraductions.getValeur("De") + " %hh%sh%mm",
				) +
				" " +
				ObjetDate_1.GDate.formatDate(
					lDateFin,
					ObjetTraduction_1.GTraductions.getValeur("A") + " %hh%sh%mm",
				);
			return `${this.dispense.cours.matiere.getLibelle()} - ${this.dispense.cours.getLibelle()}`;
		}
		return "";
	}
	getLibelleDeMatiere() {
		var _a;
		if (
			this.estDispenseLD(this.dispense) &&
			((_a = this.dispense.matieres) === null || _a === void 0
				? void 0
				: _a.count())
		) {
			const lDateDebut = ObjetDate_1.GDate.formatDate(
				this.dispense.dateDebut,
				"%JJJ %JJ %MMM",
			);
			const lDateFin = ObjetDate_1.GDate.formatDate(
				this.dispense.dateDebut,
				"%JJ %MMM",
			);
			const lHeureDebut = ObjetDate_1.GDate.formatDate(
				this.dispense.dateDebut,
				"%hh%sh%mm",
			);
			const lHeureFin = ObjetDate_1.GDate.formatDate(
				this.dispense.dateFin,
				"%hh%sh%mm",
			);
			const lStrDate = ObjetDate_1.GDate.estJourEgal(
				this.dispense.dateDebut,
				this.dispense.dateFin,
			)
				? lDateDebut +
					" " +
					ObjetTraduction_1.GTraductions.getValeur(
						"Dates.DeHeureDebutAHeureFin",
						[lHeureDebut, lHeureFin],
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"Dates.DuDateDebutAHeureDebutAuDateFinAHeureFin",
						[lDateDebut, lHeureDebut, lDateFin, lHeureFin],
					);
			return `${this.dispense.matieres.get(0).getLibelle()} - ${lStrDate.ucfirst()}`;
		}
		return "";
	}
	getHtmlJustificatifEtCommentaire() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"article",
				{ class: "field-contain label-up border-bottom p-bottom-xl" },
				IE.jsx.str("ie-btnselecteur", {
					"aria-describedby": this.ids.describedJustificatif,
					role: "button",
					class: "pj",
					"ie-selecfile": true,
					"ie-model": "btnJustificatif",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.dispense.ajouterJustificatif",
					),
				}),
				IE.jsx.str("div", {
					class: ["pj-liste-conteneur"],
					"ie-if": "avecListePJ",
					"ie-html": "getHtmlPJ",
				}),
				IE.jsx.str(
					"p",
					{ id: this.ids.describedJustificatif, class: "m-top-xl" },
					ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.dispense.justificatifConsultableVS",
					),
				),
			),
			IE.jsx.str(
				"article",
				{ class: "field-contain label-up" },
				IE.jsx.str(
					"label",
					{ for: this.ids.labelCommentaire, class: ["m-bottom"] },
					ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.dispense.commentaire",
					),
				),
				IE.jsx.str("ie-textareamax", {
					id: this.ids.labelCommentaire,
					"ie-model": "commentaire",
					"ie-autoresize": true,
					maxlength: "200",
					class: ["txt-comment", "round-style", "fluid-bloc"],
					placeholder: ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.AjouterUnCommentaire",
					),
					required: true,
				}),
			),
		);
	}
}
exports.ObjetFenetre_SaisieDispense = ObjetFenetre_SaisieDispense;
