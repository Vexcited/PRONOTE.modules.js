exports.ObjetEditionOffreStage = void 0;
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireStage_1 = require("UtilitaireStage");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_CalendrierPeriode_1 = require("ObjetFenetre_CalendrierPeriode");
class ObjetEditionOffreStage extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.idSujetDetaille = GUID_1.GUID.getId();
		this.idNbPostes = GUID_1.GUID.getId();
		this.idDuree = GUID_1.GUID.getId();
		this.idComment = GUID_1.GUID.getId();
		this.idLabelSujet = GUID_1.GUID.getId();
		this.idSujet = GUID_1.GUID.getId();
		this._parametres = {
			avecPeriode: true,
			avecPeriodeUnique: true,
			avecSujetObjetSaisie: true,
			avecGestionPJ: false,
			tailleMaxPieceJointe: 0,
			avecEditionDocumentsJoints: false,
			genreRessourcePJ: 0,
			maxWidth: 0,
			dureeParDefaut: 70,
		};
	}
	setParametres(aParam) {
		$.extend(this._parametres, aParam);
	}
	construireInstances() {
		if (this._parametres.avecSujetObjetSaisie) {
			this.identComboSujet = this.add(
				ObjetSaisie_1.ObjetSaisie,
				this._evntComboSujet.bind(this),
				this._initComboSujet.bind(this),
			);
		}
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const H = [];
		let classPN = "";
		if (this._parametres.avecSujetObjetSaisie && !IE.estMobile) {
			classPN = "flex-contain";
		}
		H.push(
			IE.jsx.str(
				"div",
				{ class: classPN },
				this.construireSujet(),
				this.construirePeriode(),
			),
		);
		H.push(
			IE.jsx.str(
				"div",
				{ class: "m-y-xl" },
				IE.jsx.str(
					"label",
					{ for: this.idSujetDetaille },
					ObjetTraduction_1.GTraductions.getValeur("OffreStage.SujetDetaille"),
				),
				IE.jsx.str("textarea", {
					"ie-autoresize": true,
					title: ObjetTraduction_1.GTraductions.getValeur(
						"OffreStage.SujetDetaille",
					),
					"ie-model": "sujetDetaille",
					id: this.idSujetDetaille,
				}),
			),
		);
		H.push(
			IE.jsx.str(
				"div",
				{ class: "m-y-xl" },
				IE.jsx.str(
					"label",
					{ for: this.idComment },
					ObjetTraduction_1.GTraductions.getValeur("OffreStage.Commentaire"),
				),
				IE.jsx.str("textarea", {
					"ie-autoresize": true,
					title: ObjetTraduction_1.GTraductions.getValeur(
						"OffreStage.Commentaire",
					),
					"ie-model": "commentaire",
					id: this.idComment,
				}),
			),
		);
		const lStyleMobile = {
			style: IE.estMobile ? "width:20px;text-align:center;" : "",
		};
		H.push(
			IE.jsx.str(
				"div",
				{ class: [!IE.estMobile ? "flex-contain" : "", "m-y-xxl"] },
				IE.jsx.str(
					"div",
					{
						class: [
							"flex-contain m-y-xl",
							!IE.estMobile ? "m-right-xxl" : "justify-between",
						],
					},
					IE.jsx.str(
						"label",
						{ for: this.idNbPostes, class: "p-right-xl" },
						ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.PostesAPourvoir",
						),
					),
					IE.jsx.str(
						"input",
						Object.assign(
							{
								"ie-model": "nbPostes",
								"ie-mask": "/[^0-9]/i",
								id: this.idNbPostes,
								style: { width: "4rem" },
								maxlength: "2",
								type: "text",
								inputMode: "numeric",
							},
							lStyleMobile,
						),
					),
				),
				IE.jsx.str(
					"div",
					{
						class: [
							"flex-contain m-y-xl",
							!IE.estMobile ? "m-left-xxl" : "justify-between",
						],
					},
					IE.jsx.str(
						"label",
						{ for: this.idDuree, class: "p-right-xl" },
						ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.DureePrevueEnSemaine",
						),
					),
					IE.jsx.str(
						"input",
						Object.assign(
							{
								"ie-model": "duree",
								"ie-mask": "/[^0-9]/i",
								id: this.idDuree,
								style: { width: "4rem" },
								maxlength: "2",
								type: "text",
								inputMode: "numeric",
							},
							lStyleMobile,
						),
					),
				),
			),
		);
		H.push(this.construirePJ());
		return H.join("");
	}
	construireSujet() {
		const H = [];
		H.push('<div class="flex-contain cols m-y-xxl" >');
		H.push(
			IE.jsx.str(
				"label",
				{ id: this.idLabelSujet },
				ObjetTraduction_1.GTraductions.getValeur("OffreStage.Sujet"),
			),
		);
		if (this._parametres.avecSujetObjetSaisie) {
			H.push(
				IE.jsx.str("div", {
					id: this.getNomInstance(this.identComboSujet),
					title: ObjetTraduction_1.GTraductions.getValeur("OffreStage.Sujet"),
				}),
			);
		} else {
			H.push(
				IE.jsx.str("input", {
					"ie-model": "sujet",
					id: this.idSujet,
					maxlength: "50",
					class: "like-input full-width",
					"aria-labelledby": this.idLabelSujet,
				}),
			);
		}
		H.push("</div>");
		return H.join("");
	}
	construirePeriode() {
		let stylePN = "";
		let classPN = "";
		if (this._parametres.avecSujetObjetSaisie && !IE.estMobile) {
			stylePN = 'style="width:200px;"';
			classPN = "p-left-xxl";
		}
		const H = [];
		H.push('<div class="m-y-xxl ', classPN, ' " ', stylePN, ">");
		if (this._parametres.avecPeriode) {
			H.push(
				"<label>",
				ObjetTraduction_1.GTraductions.getValeur(
					"OffreStage.periodePossibleDeStage",
				),
				"</label>",
			);
			H.push(
				'<div ie-ellipsis ie-texte="getPeriode" ie-node="nodeDivPeriode" class="periode like-input" style="',
				this._parametres.maxWidth > 0
					? "max-width: " + this._parametres.maxWidth + "px; "
					: "",
				'"></div>',
			);
		}
		H.push("</div>");
		return H.join("");
	}
	construirePJ() {
		const H = [];
		if (this._parametres.avecGestionPJ) {
			H.push(
				IE.jsx.str("ie-btnselecteur", {
					"ie-model": this.jsxModelBtnSelecteurAjoutPJ.bind(this),
					"ie-selecfile": true,
					class: "pj",
					role: "button",
				}),
			);
			H.push(
				IE.jsx.str("div", {
					class: "m-top",
					"ie-if": this.jsxIfListePiecesJointes.bind(this),
					"ie-html": this.jsxGetHtmlListePiecesJointes.bind(this),
				}),
			);
		}
		return H.join("");
	}
	jsxModelBtnSelecteurAjoutPJ() {
		return {
			getOptionsSelecFile: () => {
				return {
					genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
					maxFiles: 0,
					maxSize: this._parametres.tailleMaxPieceJointe,
				};
			},
			addFiles: (aParams) => {
				this.offreStage.piecesjointes.add(aParams.eltFichier);
			},
			getLibelle: () => {
				return ObjetTraduction_1.GTraductions.getValeur(
					"OffreStage.PiecesJointes",
				);
			},
			getIcone: () => {
				return "icon_piece_jointe";
			},
		};
	}
	jsxIfListePiecesJointes() {
		var _a, _b;
		return (
			((_b =
				(_a = this.offreStage) === null || _a === void 0
					? void 0
					: _a.piecesjointes) === null || _b === void 0
				? void 0
				: _b.count()) > 0
		);
	}
	jsxGetHtmlListePiecesJointes() {
		var _a, _b;
		return (
			(_b =
				(_a = this.offreStage) === null || _a === void 0
					? void 0
					: _a.piecesjointes) === null || _b === void 0
				? void 0
				: _b.count()
		)
			? UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
					this.offreStage.piecesjointes,
					{ IEModelChips: "SupprPieceJointe" },
				)
			: "";
	}
	getElmtOffreDefault() {
		const lPiecesJointes = new ObjetListeElements_1.ObjetListeElements();
		const lDefault = ObjetElement_1.ObjetElement.create({
			sujet: null,
			sujetDetaille: "",
			commentaire: "",
			duree: "",
			dureeEnJours: this._parametres.dureeParDefaut,
			nbPropose: 1,
			piecesjointes: lPiecesJointes,
			nbPourvus: undefined,
		});
		lDefault.periodes = new ObjetListeElements_1.ObjetListeElements();
		return lDefault;
	}
	setDonnees(aParam) {
		this.offreStage = aParam.offreStage || this.getElmtOffreDefault();
		this.sujetsStage = aParam.sujetsStage;
		if (this._parametres.avecPeriode) {
			this.listePeriode = MethodesObjet_1.MethodesObjet.dupliquer(
				this.offreStage.periodes,
			);
		}
		this.actualiser();
	}
	getOffreStage() {
		return this.offreStage;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			sujet: {
				getValue: function () {
					return aInstance && aInstance.offreStage && aInstance.offreStage.sujet
						? aInstance.offreStage.sujet.getLibelle()
						: "";
				},
				setValue: function (aValue) {
					if (aInstance.offreStage) {
						if (!aInstance.offreStage.sujet) {
							aInstance.offreStage.sujet = new ObjetElement_1.ObjetElement("");
						}
						aInstance.offreStage.sujet.setLibelle(aValue);
						aInstance.offreStage.sujet.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
						aInstance.offreStage.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					}
				},
			},
			cmbSujet: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						longueur: "100%",
						hauteur: 16,
						hauteurLigneDefault: 16,
						estLargeurAuto: true,
						avecDesignMobile: true,
					});
				},
				getDonnees(aDonnees) {
					if (!aDonnees) {
						return;
					}
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
						Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
					) {
						aInstance.offreStage.sujet = aParametres.element;
					}
				},
				getIndiceSelection: function () {
					if (aInstance.offreStage.sujet) {
						aInstance.offreStage.sujet;
					} else {
						return 0;
					}
				},
			},
			getPeriode: function () {
				let lResult = "";
				if (aInstance) {
					if (aInstance.offreStage && aInstance.offreStage.periodes) {
						lResult =
							UtilitaireStage_1.UtilitaireStage.composeLibelleDatePeriodes(
								aInstance.offreStage.periodes,
							);
					}
					if (!lResult) {
						lResult = ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.aucunePeriodeImposee",
						);
					}
				}
				return lResult;
			},
			nodeDivPeriode() {
				$(this.node).eventValidation(() => {
					if (aInstance.offreStage) {
						aInstance.eventOuvertureCalendrier();
					}
				});
			},
			sujetDetaille: {
				getValue: function () {
					return aInstance &&
						aInstance.offreStage &&
						aInstance.offreStage.sujetDetaille
						? aInstance.offreStage.sujetDetaille
						: "";
				},
				setValue: function (aValue) {
					if (aInstance.offreStage) {
						aInstance.offreStage.sujetDetaille = aValue;
						aInstance.offreStage.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					}
				},
			},
			nbPostes: {
				getValue: function () {
					return aInstance &&
						aInstance.offreStage &&
						aInstance.offreStage.nbPropose
						? aInstance.offreStage.nbPropose
						: "";
				},
				setValue: function (aValue) {
					if (aInstance.offreStage) {
						aInstance.offreStage.nbPropose =
							ObjetChaine_1.GChaine.strToCardinal(aValue);
						aInstance.offreStage.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					}
				},
				exitChange: function (aValue) {
					if (aInstance.offreStage) {
						const lValue = !!aValue
							? ObjetChaine_1.GChaine.strToCardinal(aValue)
							: 1;
						aInstance.offreStage.nbPropose = lValue;
						aInstance.offreStage.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					}
				},
			},
			duree: {
				getValue: function () {
					return aInstance &&
						aInstance.offreStage &&
						aInstance.offreStage.dureeEnJours
						? parseInt(aInstance.offreStage.dureeEnJours / 7, 10)
						: 0;
				},
				setValue: function (aValue) {
					if (aInstance.offreStage) {
						aInstance.offreStage.dureeEnJours = aValue * 7;
						aInstance.offreStage.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					}
				},
			},
			commentaire: {
				getValue: function () {
					return aInstance &&
						aInstance.offreStage &&
						aInstance.offreStage.commentaire
						? aInstance.offreStage.commentaire
						: "";
				},
				setValue: function (aValue) {
					if (aInstance.offreStage) {
						aInstance.offreStage.commentaire = aValue;
						aInstance.offreStage.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					}
				},
			},
			SupprPieceJointe: {
				eventBtn: function (aIndice) {
					const lFichierASupp = aInstance.offreStage.piecesjointes.get(aIndice);
					if (!!lFichierASupp) {
						lFichierASupp.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					}
				},
			},
		});
	}
	actualiser() {
		if (this._parametres.avecSujetObjetSaisie) {
			this.getInstance(this.identComboSujet).setDonnees(
				this.sujetsStage,
				this.offreStage.sujet !== null
					? this.sujetsStage.getIndiceParElement(this.offreStage.sujet)
					: 0,
			);
		}
		this.$refreshSelf();
	}
	eventOuvertureCalendrier() {
		if (this._parametres.avecPeriode) {
			this.listePeriode = MethodesObjet_1.MethodesObjet.dupliquer(
				this.offreStage.periodes,
			);
			const lFenetreCalendrierPeriode =
				ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_CalendrierPeriode_1.ObjetFenetre_CalendrierPeriode,
					{
						pere: this,
						initialiser(aFenetre) {
							aFenetre.setOptionsFenetre({
								titre: ObjetTraduction_1.GTraductions.getValeur(
									"OffreStage.periodePossibleDeStage",
								),
							});
						},
						evenement: (aDonnees) => {
							this.listePeriode = aDonnees;
							this.offreStage.periodes = this.listePeriode.getListeElements(
								(aEle) => {
									return aEle.existe();
								},
							);
						},
					},
				);
			lFenetreCalendrierPeriode.setParametres({
				avecZoneUnique: this._parametres.avecPeriodeUnique,
			});
			lFenetreCalendrierPeriode.setDonnees(this.listePeriode);
		}
	}
	_evntComboSujet(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.offreStage.sujet = aParams.element;
		}
	}
	_initComboSujet(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 300,
			placeHolder: ObjetTraduction_1.GTraductions.getValeur("OffreStage.Sujet"),
			ariaLabelledBy: this.idLabelSujet,
		});
	}
}
exports.ObjetEditionOffreStage = ObjetEditionOffreStage;
