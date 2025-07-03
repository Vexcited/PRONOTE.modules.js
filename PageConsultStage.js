exports.PageConsultStage = void 0;
const ObjetInterface_1 = require("ObjetInterface");
const GUID_1 = require("GUID");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_StructureAffichage_js_1 = require("Enumere_StructureAffichage.js");
const ObjetDate_js_1 = require("ObjetDate.js");
const ObjetFenetre_EditionOffreStage_1 = require("ObjetFenetre_EditionOffreStage");
const ObjetFenetre_1 = require("ObjetFenetre");
const MethodesObjet_js_1 = require("MethodesObjet.js");
const ObjetHtml_1 = require("ObjetHtml");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const ObjetChaine_1 = require("ObjetChaine");
class PageConsultStage extends ObjetInterface_1.ObjetInterface {
	constructor() {
		super(...arguments);
		this.idPage = GUID_1.GUID.getId();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			avecEditionOffre() {
				var _a;
				return (
					((_a = aInstance._parametres) === null || _a === void 0
						? void 0
						: _a.autoriserEditionToutesOffresStages) ||
					aInstance.stage.estAuteur
				);
			},
			btnRetour: {
				event: function () {
					aInstance.callBackRetourEcranPrec();
				},
			},
			btnEditer: {
				event: function () {
					if (!!aInstance.callbackReturnParams) {
						aInstance._parametres = aInstance.callbackReturnParams();
					}
					const lParametres = aInstance._parametres;
					const lFenetreModifierStage =
						ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_EditionOffreStage_1.ObjetFenetre_EditionOffreStage,
							{
								pere: aInstance,
								evenement: function (aParam) {
									var _a;
									(_a = aInstance.callbackModifier) === null || _a === void 0
										? void 0
										: _a.call(aInstance, aParam);
								},
								initialiser: (aFenetreModifierStage) => {
									aFenetreModifierStage.setOptionsFenetre({
										titre: ObjetTraduction_1.GTraductions.getValeur(
											"OffreStage.TitreEdition",
										),
										listeBoutons: [
											ObjetTraduction_1.GTraductions.getValeur("Annuler"),
											ObjetTraduction_1.GTraductions.getValeur("Valider"),
										],
									});
									aFenetreModifierStage.setParametresEditionOffreStage({
										avecSujetObjetSaisie: lParametres.avecSujetObjetSaisie,
										avecPeriode: lParametres.avecPeriode,
										avecPeriodeUnique: lParametres.avecPeriodeUnique,
										avecGestionPJ: lParametres.avecGestionPJ,
									});
								},
							},
						);
					const lOffre = MethodesObjet_js_1.MethodesObjet.dupliquer(
						aInstance.stage,
					);
					lFenetreModifierStage.setDonnees({
						offre: lOffre,
						sujetsStage: aInstance.sujetsStage,
						estEnEdition: true,
					});
					lFenetreModifierStage.afficher();
				},
				getDisabled: function () {
					return aInstance.stage.estPublie;
				},
			},
			btnSupprimer: {
				event() {
					aInstance.callbackAlerteSupprimer();
				},
				getDisabled: function () {
					return aInstance.stage.estPublie;
				},
			},
		});
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_js_1.EStructureAffichage.Autre;
	}
	setDonnees(aParam) {
		this.stage = aParam.stage;
		this.avecDefinitionStage = aParam.avecDefinitionStage;
		this.sujetsStage = aParam.sujetsStage;
		this.callbackAlerteSupprimer = aParam.callbackAlerteSupprimer;
		this.callBackRetourEcranPrec = aParam.callBackRetourEcranPrec;
		this.callbackModifier = aParam.callbackModifier;
		this.callbackReturnParams = aParam.callbackReturnParams;
		this.afficher(this.construireStructureAffichageAutre());
	}
	construireStructureAffichageAutre() {
		var _a, _b;
		let lSujet = "";
		let lSujetDetail = "";
		let lCommentaire = "";
		const lTableauPeriodes = [];
		if (!!this.stage) {
			const lDuree = this.stage.duree ? " (" + this.stage.duree + ")" : "";
			lSujet = this.stage.sujet.getLibelle() + lDuree;
			lSujetDetail = this.stage.sujetDetaille;
			lCommentaire = this.stage.commentaire;
			if (!!this.stage.periodes) {
				if (this.stage.periodes.count() > 0) {
					this.stage.periodes.parcourir((aPeriode) => {
						const lFormatDateDebut = ObjetDate_js_1.GDate.formatDate(
							aPeriode.dateDebut,
							"%JJ/%MM/%AAAA",
						);
						const lFormatDateFin = ObjetDate_js_1.GDate.formatDate(
							aPeriode.dateFin,
							"%JJ/%MM/%AAAA",
						);
						if (lFormatDateDebut !== lFormatDateFin) {
							lTableauPeriodes.push(
								ObjetTraduction_1.GTraductions.getValeur("Du") +
									" " +
									lFormatDateDebut +
									" " +
									ObjetTraduction_1.GTraductions.getValeur("Au") +
									" " +
									lFormatDateFin,
							);
						} else {
							lTableauPeriodes.push(
								ObjetTraduction_1.GTraductions.getValeur("Le") +
									" " +
									lFormatDateDebut,
							);
						}
					});
				}
			}
		}
		const H = [];
		H.push(`<div id=${this.idPage} >`);
		if (IE.estMobile) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "flex-contain" },
					IE.jsx.str("ie-btnicon", {
						"ie-model": "btnRetour",
						"aria-label": ObjetTraduction_1.GTraductions.getValeur("Precedent"),
						class: "icon_retour_mobile retour i-large m-all",
					}),
					IE.jsx.str(
						"h3",
						{ class: "flex-contain fluid-bloc justify-center flex-center" },
						lSujet,
					),
				),
			);
		}
		if (this.avecDefinitionStage) {
			H.push('<div ie-if="avecEditionOffre" class="ombre-scroll bottom">');
			H.push(
				'<div class="ObjetMenuCtxMixte ',
				IE.estMobile ? "ie-shadow-bottom p-bottom-xl" : "",
				' ">',
			);
			H.push(
				'<ie-btnicon title="',
				ObjetTraduction_1.GTraductions.getValeur("Modifier"),
				'" class= "icon_pencil avecFond i-medium" ie-model="btnEditer"></ie-btnicon>',
			);
			H.push(
				'<ie-btnicon title="',
				ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
				'" class= "icon_trash avecFond i-medium" ie-model="btnSupprimer"></ie-btnicon>',
			);
			H.push("</div>");
			H.push("</div>");
			H.push('<div class="flex-contain m-top-xxl">');
			H.push(
				IE.jsx.str(
					"div",
					{
						class: "conteneur-icone-validation",
						style: "display: flex;align-items: center;justify-content: center;",
					},
					IE.jsx.str("i", {
						class: [
							this.stage.estPublie ? "icon_ok" : "icon_edt_permanence",
							"i-medium m-x-xl icone-titre",
						],
						role: "presentation",
					}),
				),
			);
			H.push('<div style="align-content: center;">');
			if (!IE.estMobile) {
				H.push(
					IE.jsx.str("p", { class: "semi-bold taille-m m-bottom-l" }, lSujet),
				);
			}
			if (!this.stage.estPublie) {
				H.push(
					IE.jsx.str(
						"p",
						{ class: "semi-bold " },
						ObjetTraduction_1.GTraductions.getValeur("OffreStage.NonPublie"),
					),
				);
			} else if (this.stage.estPublie) {
				H.push(
					IE.jsx.str(
						"p",
						{ style: "color:var(--theme-foncee)" },
						ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.PostesPourvus",
						) +
							" : " +
							this.stage.nbPourvus +
							"/" +
							this.stage.nbPropose,
					),
				);
			}
			H.push("</div>");
			H.push("</div>");
			H.push('<div class="m-top-xxl">');
			if (lTableauPeriodes.length === 0) {
				H.push(
					IE.jsx.str(
						"p",
						null,
						ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.aucunePeriodeImposee",
						),
					),
				);
			} else {
				lTableauPeriodes.forEach((aPeriode) => {
					H.push(IE.jsx.str("p", null, aPeriode));
				});
			}
			H.push("</div>");
			if (lSujetDetail) {
				H.push(
					IE.jsx.str(
						"p",
						{ class: "m-y-xl ie-titre-petit" },
						ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.SujetDetaille",
						),
					),
				);
				H.push(
					IE.jsx.str(
						"div",
						null,
						ObjetChaine_1.GChaine.replaceRCToHTML(lSujetDetail),
					),
				);
			}
			if (lCommentaire) {
				H.push(
					IE.jsx.str(
						"p",
						{ class: "m-y-xl ie-titre-petit" },
						ObjetTraduction_1.GTraductions.getValeur("OffreStage.Commentaire"),
						" :",
					),
				);
				H.push(IE.jsx.str("p", { class: "Italique" }, lCommentaire));
			}
			if (
				(_b =
					(_a = this.stage) === null || _a === void 0
						? void 0
						: _a.piecesjointes) === null || _b === void 0
					? void 0
					: _b.count()
			) {
				H.push(
					IE.jsx.str(
						"div",
						{ class: "m-top-xl" },
						UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
							this.stage.piecesjointes,
						),
					),
				);
			}
		}
		H.push("</div>");
		return H.join("");
	}
	resetHtml() {
		ObjetHtml_1.GHtml.setHtml(this.idPage, "");
	}
	setParametres(aParam) {
		this._parametres = aParam;
	}
}
exports.PageConsultStage = PageConsultStage;
