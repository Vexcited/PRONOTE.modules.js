exports.ObjetFenetre_SaisieVisiosCours = void 0;
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const Enumere_Action_1 = require("Enumere_Action");
const MethodesObjet_1 = require("MethodesObjet");
const GUID_1 = require("GUID");
const AccessApp_1 = require("AccessApp");
CollectionRequetes_1.Requetes.inscrire(
	"FenetreSaisieVisiosCours",
	ObjetRequeteJSON_1.ObjetRequeteConsultation,
);
class ObjetFenetre_SaisieVisiosCours extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.saisieDirecte = false;
		this.estPourHP = false;
		this.tailleMaxChamps = { libelle: 60, commentaire: 255 };
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreSaisieVisiosCours.URLAssocieeAuCours",
			),
			largeur: 500,
			hauteur: 300,
			listeBoutons: [
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("Annuler"),
					theme: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
					typeBouton: ObjetFenetre_SaisieVisiosCours.TypeBouton.Annuler,
				},
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
					theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
					typeBouton: ObjetFenetre_SaisieVisiosCours.TypeBouton.Valider,
				},
			],
			avecComposeBasInFooter: true,
		});
		this.callbackOuvrirLienVisio = null;
		this.donnees = { cours: null, progression: null, nbVisiosMaxProgrammes: 0 };
	}
	getVisioCours() {
		return this.donnees.lienVisio;
	}
	getNbVisiosProgrammesSurLaJournee() {
		let lNbVisios = 0;
		if (!!this.donnees.cours) {
			lNbVisios = this.donnees.nbVisiosMaxProgrammes || 0;
		}
		return lNbVisios;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			avecLienTesterURL() {
				const lVisioCours = aInstance.getVisioCours();
				return estLienTesterURLVisible(lVisioCours);
			},
			getNodeTestURL() {
				$(this.node).on("click", (event) => {
					event.preventDefault();
					if (!!aInstance.callbackOuvrirLienVisio) {
						const lVisioCours = aInstance.getVisioCours();
						aInstance.callbackOuvrirLienVisio(lVisioCours);
					}
				});
			},
			modelURL: {
				getValue() {
					const lVisioCours = aInstance.getVisioCours();
					return lVisioCours ? lVisioCours.url || "" : "";
				},
				setValue(aValue) {
					const lVisioCours = aInstance.getVisioCours();
					if (!!lVisioCours) {
						lVisioCours.url = aValue;
						lVisioCours.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
			},
			modelLibelleLien: {
				getValue() {
					const lVisioCours = aInstance.getVisioCours();
					return lVisioCours ? lVisioCours.libelleLien || "" : "";
				},
				setValue(aValue) {
					const lVisioCours = aInstance.getVisioCours();
					if (!!lVisioCours) {
						lVisioCours.libelleLien = aValue;
						lVisioCours.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
			},
			modelCommentaire: {
				getValue() {
					const lVisioCours = aInstance.getVisioCours();
					return lVisioCours ? lVisioCours.commentaire || "" : "";
				},
				setValue(aValue) {
					const lVisioCours = aInstance.getVisioCours();
					if (!!lVisioCours) {
						lVisioCours.commentaire = aValue;
						lVisioCours.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
			},
			btnSupprimer: {
				event() {
					aInstance._surValidation(
						ObjetFenetre_SaisieVisiosCours.TypeBouton.Supprimer,
					);
				},
				getDisabled() {
					const lVisioCours = aInstance.getVisioCours();
					return (
						!lVisioCours ||
						!lVisioCours.existeNumero() ||
						lVisioCours.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
					);
				},
			},
			afficherNbVisiosProgrammes() {
				return aInstance.getNbVisiosProgrammesSurLaJournee() > 0;
			},
			getStrNbVisiosProgrammes() {
				const lNbVisios = aInstance.getNbVisiosProgrammesSurLaJournee();
				if (lNbVisios > 1) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"FenetreSaisieVisiosCours.XCoursEnVisioProgrammes",
						[lNbVisios],
					);
				} else {
					return ObjetTraduction_1.GTraductions.getValeur(
						"FenetreSaisieVisiosCours.1CoursEnVisioProgramme",
					);
				}
			},
		});
	}
	setAvecSaisieDirecte(aSaisieDirecte) {
		this.saisieDirecte = !!aSaisieDirecte;
	}
	setCallbackOuvrirLienVisio(aCallbackOuvrirLienVisio) {
		this.callbackOuvrirLienVisio = aCallbackOuvrirLienVisio;
	}
	setDonnees(aParametres) {
		this.donnees.lienVisio = aParametres.lienVisio;
		this.callbackValider = aParametres.callbackValider;
		this.sauvegardeVisio = MethodesObjet_1.MethodesObjet.dupliquer(
			aParametres.lienVisio,
		);
		if (!!aParametres) {
			if (aParametres.tailleMaxLibelle) {
				this.tailleMaxChamps.libelle = aParametres.tailleMaxLibelle;
			}
			if (aParametres.tailleMaxCommentaire) {
				this.tailleMaxChamps.commentaire = aParametres.tailleMaxCommentaire;
			}
		}
		this.donnees.nbVisiosMaxProgrammes = 0;
		this.afficher();
	}
	composeContenu() {
		const T = [];
		const lIdInputURLCours = GUID_1.GUID.getId();
		const lIdInputLibelleURL = GUID_1.GUID.getId();
		const lIdTextareaCommentaire = GUID_1.GUID.getId();
		T.push('<div class="flex-contain cols">');
		T.push(
			`<div class="field-contain label-up">\n              <div class="flex-contain flex-center justify-between">\n                  <label for="${lIdInputURLCours}" class="fluid-bloc">${ObjetTraduction_1.GTraductions.getValeur("FenetreSaisieVisiosCours.ChampURL")} : ${ObjetTraduction_1.GTraductions.getValeur("FenetreSaisieVisiosCours.MarqueurChampObligatoire")}</label>\n                  <span class="fluid-bloc text-end m-bottom-l" ie-node="getNodeTestURL" ie-if="avecLienTesterURL">\n                    <a href="#">${ObjetTraduction_1.GTraductions.getValeur("FenetreSaisieVisiosCours.TesterURL")}</a>\n                  </span>\n              </div>\n\n              <input id="${lIdInputURLCours}" ie-model="modelURL" ie-trim class="full-width" required="true"/>\n            </div>`,
		);
		T.push(
			`<div class="field-contain label-up">\n              <label for="${lIdInputLibelleURL}">${ObjetTraduction_1.GTraductions.getValeur("FenetreSaisieVisiosCours.ChampLibelleURL")} :</label>\n              <input id="${lIdInputLibelleURL}" ie-model="modelLibelleLien" ie-trim class="full-width" maxlength="${this.tailleMaxChamps.libelle}"/>\n            </div>`,
		);
		T.push(
			`<div class="field-contain label-up">\n              <label for="${lIdTextareaCommentaire}">${ObjetTraduction_1.GTraductions.getValeur("FenetreSaisieVisiosCours.ChampCommentaireURL")} :</label>\n              <ie-textareamax id="${lIdTextareaCommentaire}" ${!IE.estMobile ? `style="height: 6rem;"` : ``}  ie-model="modelCommentaire" class="full-width" maxlength="${this.tailleMaxChamps.commentaire}" placeholder="${ObjetTraduction_1.GTraductions.getValeur("FenetreSaisieVisiosCours.PlaceholderCommentaire")}"></ie-textareamax>\n            </div>`,
		);
		T.push(
			`<div ie-if="afficherNbVisiosProgrammes()">\n              <span ie-html="getStrNbVisiosProgrammes()"></span>\n            </div>`,
		);
		T.push(`<div class="m-top-l ${IE.estMobile ? ` m-bottom-nega-xl` : `m-bottom-nega-l`}">\n                ${ObjetTraduction_1.GTraductions.getValeur("FenetreSaisieVisiosCours.MarqueurChampObligatoire")} ${ObjetTraduction_1.GTraductions.getValeur("FenetreSaisieVisiosCours.ChampObligatoire")}
            </div>`);
		T.push("</div>");
		return T.join("");
	}
	composeBas() {
		const lHTML = [];
		lHTML.push('<div class="compose-bas">');
		lHTML.push(
			'<ie-btnicon ie-model="btnSupprimer" title="',
			ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
			'" class="icon_trash avecFond i-medium"></ie-btnicon>',
		);
		lHTML.push("</div>");
		return lHTML.join("");
	}
	surValidation(aNumeroBouton) {
		let lTypeBouton = ObjetFenetre_SaisieVisiosCours.TypeBouton.Annuler;
		const lBouton = this.getBoutonNumero(aNumeroBouton);
		if (!!lBouton && lBouton.typeBouton !== undefined) {
			lTypeBouton = lBouton.typeBouton;
		}
		this._surValidation(lTypeBouton);
	}
	_surValidation(aTypeBouton) {
		let lVisioCours = this.getVisioCours();
		if (!lVisioCours) {
			this.fermer();
			return;
		}
		if (aTypeBouton === ObjetFenetre_SaisieVisiosCours.TypeBouton.Valider) {
			const lMessagesChampsObligatoires = [];
			if (!lVisioCours.url || lVisioCours.url.length === 0) {
				lMessagesChampsObligatoires.push(
					ObjetTraduction_1.GTraductions.getValeur(
						"FenetreSaisieVisiosCours.ChampURLEstObligatoire",
					),
				);
			}
			if (lMessagesChampsObligatoires.length > 0) {
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message: lMessagesChampsObligatoires.join("<br/>"),
					});
				return;
			}
		}
		if (aTypeBouton === ObjetFenetre_SaisieVisiosCours.TypeBouton.Annuler) {
			lVisioCours = this.sauvegardeVisio;
		}
		const lThis = this;
		(aTypeBouton === ObjetFenetre_SaisieVisiosCours.TypeBouton.Supprimer
			? new Promise((aResolve) => {
					(0, AccessApp_1.getApp)()
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"FenetreSaisieVisiosCours.ConfirmationSuppression",
							),
							callback: function (aNumeroBouton) {
								if (aNumeroBouton === Enumere_Action_1.EGenreAction.Valider) {
									aResolve();
								}
							},
						});
				})
			: Promise.resolve()
		).then(() => {
			if (aTypeBouton === ObjetFenetre_SaisieVisiosCours.TypeBouton.Supprimer) {
				lVisioCours.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			} else if (
				aTypeBouton !== ObjetFenetre_SaisieVisiosCours.TypeBouton.Valider
			) {
				if (lVisioCours.getEtat() === Enumere_Etat_1.EGenreEtat.Creation) {
					lVisioCours.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
				}
			}
			if (
				lThis.saisieDirecte &&
				(aTypeBouton === ObjetFenetre_SaisieVisiosCours.TypeBouton.Valider ||
					aTypeBouton === ObjetFenetre_SaisieVisiosCours.TypeBouton.Supprimer)
			) {
				lThis.callbackValider(aTypeBouton, lThis.donnees);
			} else {
				lThis.callback.appel(aTypeBouton, lThis.donnees);
			}
			lThis.fermer();
		});
	}
}
exports.ObjetFenetre_SaisieVisiosCours = ObjetFenetre_SaisieVisiosCours;
function estLienTesterURLVisible(aVisioCours) {
	let lEstLienVisible = true;
	if (!aVisioCours || !aVisioCours.url || aVisioCours.url.length === 0) {
		lEstLienVisible = false;
	}
	return lEstLienVisible;
}
(function (ObjetFenetre_SaisieVisiosCours) {
	let TypeBouton;
	(function (TypeBouton) {
		TypeBouton["Supprimer"] = "supprimer";
		TypeBouton["Annuler"] = "annuler";
		TypeBouton["Valider"] = "valider";
	})(
		(TypeBouton =
			ObjetFenetre_SaisieVisiosCours.TypeBouton ||
			(ObjetFenetre_SaisieVisiosCours.TypeBouton = {})),
	);
})(
	ObjetFenetre_SaisieVisiosCours ||
		(exports.ObjetFenetre_SaisieVisiosCours = ObjetFenetre_SaisieVisiosCours =
			{}),
);
