exports.ObjetFenetre_SuiviStage = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetTri_1 = require("ObjetTri");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetFenetre_SelectionResponsable_1 = require("ObjetFenetre_SelectionResponsable");
const GUID_1 = require("GUID");
class ObjetFenetre_SuiviStage extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.listes = { evenements: null, lieux: null, responsables: null };
		this.parametres = {
			libellePublication: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreSuiviStage.Publier",
			),
		};
		this.idLabelResp = GUID_1.GUID.getId();
		this.setOptionsFenetre({
			largeur: 400,
			hauteur: 320,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	construireInstances() {
		this.identDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this.evenementSelecteurDate.bind(this),
		);
		this.identRespAdmin = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._evenementSelecteurRespAdmin.bind(this),
			(aInstance) => {
				aInstance.setOptionsObjetSaisie({
					ariaLabelledBy: this.idLabelResp,
					longueur: "100%",
					avecDesignMobile: false,
				});
			},
		);
	}
	setParametresFenetreSuivi(aParametres) {
		Object.assign(this.parametres, aParametres);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbAvecHeure: {
				getValue: function () {
					return !!aInstance.suivi && !!aInstance.suivi.avecHeure;
				},
				setValue: function (aValeur) {
					if (!!aInstance.suivi) {
						aInstance.suivi.avecHeure = aValeur;
						if (!aValeur) {
							aInstance.suivi.avecHeureFin = false;
						}
						aInstance.suivi.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
			},
			inputHeure: {
				getValue: function () {
					const lDate = aInstance.suivi ? aInstance.suivi.date : null;
					return !!lDate ? ObjetDate_1.GDate.formatDate(lDate, "%hh:%mm") : "";
				},
				setValue: function (aValue, aParamsSetter) {
					if (!!aInstance.suivi) {
						const lDate = aInstance.suivi.date;
						if (!lDate) {
							return;
						}
						lDate.setHours(aParamsSetter.time.heure);
						lDate.setMinutes(aParamsSetter.time.minute);
						aInstance.suivi.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
				getDisabled: function () {
					return !aInstance.suivi || !aInstance.suivi.avecHeure;
				},
			},
			cbAvecHeureFin: {
				getValue: function () {
					return !!aInstance.suivi && !!aInstance.suivi.avecHeureFin;
				},
				setValue: function (aValeur) {
					if (!!aInstance.suivi) {
						aInstance.suivi.avecHeureFin = aValeur;
						aInstance.suivi.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						if (aValeur && aInstance.suivi.date) {
							const lDateFin = new Date(aInstance.suivi.date);
							lDateFin.setHours(aInstance.suivi.date.getHours() + 2);
							aInstance.suivi.dateFin = lDateFin;
						} else {
							aInstance.suivi.dateFin = null;
						}
					}
				},
				getDisabled: function () {
					return !aInstance.suivi || !aInstance.suivi.avecHeure;
				},
			},
			inputHeureFin: {
				getValue: function () {
					const lDate = aInstance.suivi ? aInstance.suivi.dateFin : null;
					return !!lDate ? ObjetDate_1.GDate.formatDate(lDate, "%hh:%mm") : "";
				},
				setValue: function (aValue, aParamsSetter) {
					if (!!aInstance.suivi) {
						const lDate = aInstance.suivi.dateFin;
						if (!lDate) {
							return;
						}
						lDate.setHours(aParamsSetter.time.heure);
						lDate.setMinutes(aParamsSetter.time.minute);
						aInstance.suivi.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
				getDisabled: function () {
					return !aInstance.suivi || !aInstance.suivi.avecHeureFin;
				},
			},
			comboEvenements: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						estLargeurAuto: false,
						avecTriListeElements: false,
						celluleAvecTexteHtml: true,
						labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
							"FenetreSuiviStage.Evenement",
						),
					});
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees) {
						return aInstance.listes.evenements;
					}
				},
				getIndiceSelection: function () {
					let lIndice = 0;
					if (!!aInstance.suivi && !!aInstance.suivi.evenement) {
						lIndice = aInstance.listes.evenements.getIndiceParNumeroEtGenre(
							aInstance.suivi.evenement.getNumero(),
						);
					}
					return Math.max(lIndice, 0);
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						!!aParametres.element &&
						!!aInstance.suivi
					) {
						aInstance.suivi.evenement = aParametres.element;
						aInstance.suivi.setLibelle(aParametres.element.getLibelle());
						aInstance.suivi.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
			},
			comboLieux: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						estLargeurAuto: false,
						placeHolder: ObjetTraduction_1.GTraductions.getValeur(
							"FenetreSuiviStage.ChoixLieu",
						),
						avecTriListeElements: false,
						labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
							"FenetreSuiviStage.Lieu",
						),
					});
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees) {
						return aInstance.listes.lieux;
					}
				},
				getIndiceSelection: function () {
					let lIndice = 0;
					if (!!aInstance.suivi && !!aInstance.suivi.lieu) {
						lIndice = aInstance.listes.lieux.getIndiceParNumeroEtGenre(
							aInstance.suivi.lieu.getNumero(),
						);
					}
					return Math.max(lIndice, 0);
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						!!aParametres.element &&
						!!aInstance.suivi
					) {
						aInstance.suivi.lieu = aParametres.element;
						aInstance.suivi.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
			},
			avecSelectionRespAdmin() {
				return (
					aInstance.listes.responsables &&
					!!aInstance.listes.responsables.count()
				);
			},
			modelAjouterPJ: {
				getOptionsSelecFile: function () {
					return {
						multiple: true,
						maxFiles: 0,
						maxSize: aInstance.parametres.maxSizeDocumentJoint,
					};
				},
				addFiles: function (aParams) {
					if (!!aInstance.suivi) {
						if (!aInstance.suivi.listePJ) {
							aInstance.suivi.listePJ =
								new ObjetListeElements_1.ObjetListeElements();
						}
						aInstance.suivi.listePJ.add(aParams.listeFichiers);
						aInstance.listePJEleve.add(aParams.listeFichiers);
						aInstance.suivi.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
				getLibelle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"FenetreSuiviStage.AjouterPieceJointe",
					);
				},
				getIcone() {
					return "icon_piece_jointe";
				},
			},
			getLibellesPiecesJointes: function () {
				const lDisplayListePJ = [];
				if (!!aInstance.suivi && !!aInstance.suivi.listePJ) {
					lDisplayListePJ.push(
						UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
							aInstance.suivi.listePJ,
							{ IEModelChips: "chipsPieceJointe" },
						),
					);
				}
				return lDisplayListePJ.join("");
			},
			chipsPieceJointe: {
				eventBtn: function (aIndice) {
					if (!!aInstance.suivi && !!aInstance.suivi.listePJ) {
						const lPieceJointeASupp = aInstance.suivi.listePJ.get(aIndice);
						if (!!lPieceJointeASupp) {
							lPieceJointeASupp.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
							aInstance.suivi.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						}
					}
				},
			},
			txtCommentaire: {
				getValue: function () {
					return !!aInstance.suivi ? aInstance.suivi.commentaire : "";
				},
				setValue: function (aValeur) {
					if (!!aInstance.suivi) {
						aInstance.suivi.commentaire = aValeur;
						aInstance.suivi.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
			},
			getClassLabelCommentaire: function () {
				return !!aInstance.suivi &&
					!!aInstance.suivi.commentaire &&
					aInstance.suivi.commentaire !== ""
					? "active"
					: "";
			},
			cbPublierSuivi: {
				getValue: function () {
					return !!aInstance.suivi && !!aInstance.suivi.publier;
				},
				setValue: function (aValue) {
					if (!!aInstance.suivi) {
						aInstance.suivi.publier = aValue;
						aInstance.suivi.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
				getLibelle: function () {
					return aInstance.parametres.libellePublication;
				},
			},
		});
	}
	setDonnees(aParam) {
		this.listes.evenements = aParam.evenements;
		this.listes.lieux = aParam.lieux;
		this.listes.responsables = aParam.listeResponsables;
		this.dateFinSaisieSuivi = aParam.dateFinSaisieSuivi;
		this.respAdminCBFiltrage = aParam.respAdminCBFiltrage;
		if (!!this.listes.evenements) {
			this.listes.evenements.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
			this.listes.evenements.trier();
		}
		if (!!this.listes.lieux) {
			this.listes.lieux.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
			this.listes.lieux.trier();
		}
		this.suivi = MethodesObjet_1.MethodesObjet.dupliquer(aParam.suivi);
		this.listePJEleve = MethodesObjet_1.MethodesObjet.dupliquer(
			aParam.listePJEleve,
		);
		if (this.dateFinSaisieSuivi) {
			this.getInstance(this.identDate).setDerniereDateSaisissable(
				this.dateFinSaisieSuivi,
			);
		}
		this.getInstance(this.identDate).setDonnees(this.suivi.date);
		if (
			this.listes.responsables &&
			this.listes.responsables.count() &&
			this.suivi.responsable
		) {
			this.getInstance(this.identRespAdmin).setContenu(
				this.suivi.responsable.getLibelle(),
			);
		}
		this.afficher();
	}
	composeContenu() {
		const H = [];
		const lIdLabelCommentaire = GUID_1.GUID.getId();
		H.push(
			IE.jsx.str(
				"div",
				{ class: "flex-contain cols p-top-l" },
				IE.jsx.str(
					"div",
					{ class: "field-contain dates-contain as-grid" },
					IE.jsx.str(
						"label",
						{ class: "ie-sous-titre" },
						ObjetTraduction_1.GTraductions.getValeur("FenetreSuiviStage.Date"),
						" : ",
					),
					IE.jsx.str("div", {
						id: this.getInstance(this.identDate).getNom(),
						class: "date-wrapper",
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "field-contain horaires-conteneur" },
					IE.jsx.str(
						"div",
						{ class: "horaire" },
						IE.jsx.str(
							"ie-checkbox",
							{ "ie-model": "cbAvecHeure" },
							ObjetTraduction_1.GTraductions.getValeur(
								"FenetreSuiviStage.AfficherHeureDebut",
							),
						),
						IE.jsx.str(
							"div",
							{ id: "wrapperInputHeure", class: "wrapper-input" },
							IE.jsx.str("label", {
								class: "ie-sous-titre",
								for: "defHoraireSuivi",
								"aria-label": ObjetTraduction_1.GTraductions.getValeur(
									"FenetreSuiviStage.DefinirHoraireSuivi",
								),
							}),
							IE.jsx.str("input", {
								id: "defHoraireSuivi",
								type: "time",
								"ie-model": "inputHeure",
								class: "input-time",
							}),
						),
					),
					IE.jsx.str(
						"div",
						{ class: "horaire" },
						IE.jsx.str(
							"ie-checkbox",
							{ "ie-model": "cbAvecHeureFin" },
							ObjetTraduction_1.GTraductions.getValeur(
								"FenetreSuiviStage.AfficherHeureFin",
							),
						),
						IE.jsx.str(
							"div",
							{ id: "wrapperInputHeureFin", class: "wrapper-input" },
							IE.jsx.str("label", {
								for: "defHoraireFinSuivi",
								"aria-label": ObjetTraduction_1.GTraductions.getValeur(
									"FenetreSuiviStage.DefinirHoraireSuiviFin",
								),
							}),
							IE.jsx.str("input", {
								id: "defHoraireFinSuivi",
								type: "time",
								"ie-model": "inputHeureFin",
								class: "input-time",
							}),
						),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "field-contain as-grid" },
					IE.jsx.str(
						"label",
						{ class: "ie-sous-titre" },
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreSuiviStage.Evenement",
						),
						" : ",
					),
					IE.jsx.str("ie-combo", {
						"ie-model": "comboEvenements",
						class: "   events-contain",
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "field-contain as-grid" },
					IE.jsx.str(
						"label",
						{ class: "fix-bloc ie-sous-titre" },
						ObjetTraduction_1.GTraductions.getValeur("FenetreSuiviStage.Lieu"),
						" : ",
					),
					IE.jsx.str("ie-combo", {
						"ie-model": "comboLieux",
						class: "full-width",
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "field-contain", "ie-display": "avecSelectionRespAdmin" },
					IE.jsx.str(
						"label",
						{ class: "fix-bloc", id: this.idLabelResp },
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreSuiviStage.RespAdmin",
						),
						" : ",
					),
					IE.jsx.str("div", {
						class: "m-top full-width",
						id: this.getInstance(this.identRespAdmin).getNom(),
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "field-contain" },
					IE.jsx.str("ie-btnselecteur", {
						class: "pj",
						"ie-model": "modelAjouterPJ",
						"ie-selecfile": true,
						role: "button",
					}),
					IE.jsx.str("div", {
						class: "pj-liste-conteneur",
						"ie-html": "getLibellesPiecesJointes",
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "field-contain label-up" },
					IE.jsx.str(
						"label",
						{
							id: lIdLabelCommentaire,
							class: "ie-sous-titre",
							"ie-class": "getClassLabelCommentaire",
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreSuiviStage.Commentaire",
						),
					),
					IE.jsx.str("ie-textareamax", {
						"aria-labelledby": lIdLabelCommentaire,
						maxlength: "5000",
						class: "txt-comment fluid-bloc full-width",
						"ie-autoresize": true,
						"ie-model": "txtCommentaire",
						style:
							"max-height: 11rem;" + (!IE.estMobile ? "" : `overflow:auto;`),
						placeholder: ObjetTraduction_1.GTraductions.getValeur(
							"FenetreSuiviStage.RedigezVotreCommentaire",
						),
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "field-contain" },
					IE.jsx.str("ie-checkbox", {
						class: "long-text",
						"ie-model": "cbPublierSuivi",
					}),
				),
			),
		);
		return H.join("");
	}
	surValidation(ANumeroBouton) {
		this.fermer();
		const lGenreAction =
			ANumeroBouton === 1
				? Enumere_Action_1.EGenreAction.Valider
				: Enumere_Action_1.EGenreAction.Annuler;
		this.callback.appel(lGenreAction, this.suivi, this.listePJEleve);
	}
	static ouvrir(aParametres) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SuiviStage,
			{
				pere: aParametres.pere,
				evenement: aParametres.evenement,
				initialiser: aParametres.initialiser,
			},
		);
		if (aParametres.optionsFenetre) {
			lFenetre.setOptionsFenetre(aParametres.optionsFenetre);
		}
		lFenetre.setDonnees(aParametres.donnees);
	}
	evenementSelecteurDate(aDate) {
		if (!ObjetDate_1.GDate.estJourEgal(this.suivi.date, aDate)) {
			this.suivi.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			if (this.suivi.date) {
				aDate.setHours(this.suivi.date.getHours());
				aDate.setMinutes(this.suivi.date.getMinutes());
			}
			this.suivi.date = aDate;
		}
	}
	_evenementSelecteurRespAdmin() {
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SelectionResponsable_1.ObjetFenetre_SelectionResponsable,
			{
				pere: this,
				evenement: (aSelection) => {
					if (aSelection && aSelection.responsableSelection) {
						this.suivi.responsable = aSelection.responsableSelection;
						this.getInstance(this.identRespAdmin).setContenu(
							this.suivi.responsable.getLibelle(),
						);
					}
				},
				initialiser: (aInstance) => {
					aInstance.respAdminCBFiltrage = this.respAdminCBFiltrage;
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"FenetreSuiviStage.SelectionnerRespAdmin",
						),
					});
				},
			},
		).setDonnees(this.listes.responsables);
	}
}
exports.ObjetFenetre_SuiviStage = ObjetFenetre_SuiviStage;
