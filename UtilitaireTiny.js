exports.UtilitaireTiny = void 0;
const TinyInit_1 = require("TinyInit");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetNavigateur_1 = require("ObjetNavigateur");
exports.UtilitaireTiny = {
	ouvrirFenetreHtml(aParams) {
		const lParams = Object.assign(
			{
				instance: null,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"ModuleEditeurHtml.miseEnForme",
				),
				readonly: false,
				descriptif: "",
				callback: null,
				editeurEquation: false,
				editeurEquationMaxFileSize: 2048,
				modeMail: false,
			},
			aParams,
		);
		class ObjetFenetreTiny extends ObjetFenetre_1.ObjetFenetre {
			constructor() {
				super(...arguments);
				this.idEditeurHTML = this.getNom() + "_idEditeurHTML";
			}
		}
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetreTiny,
			{ pere: lParams.instance },
			{
				titre: lParams.titre,
				largeur: 900,
				hauteur: 500,
				avecRetaillage: true,
				listeBoutons: [
					ObjetTraduction_1.GTraductions.getValeur("Annuler"),
					{
						valider: true,
						libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
					},
				],
				addParametresValidation: function () {
					let lContent = "";
					if (!ObjetNavigateur_1.Navigateur.withContentEditable) {
						lContent = ObjetHtml_1.GHtml.getValue(lFenetre.idEditeurHTML);
					} else {
						const lEditor = TinyInit_1.TinyInit.get(lFenetre.idEditeurHTML);
						if (lEditor) {
							lContent = lEditor.getContent();
						}
					}
					return { content: lContent };
				}.bind(lParams.instance),
				callback: function (aNumeroBouton, aParams) {
					lParams.callback({
						valider: aParams.bouton.valider,
						descriptif: aParams.content,
						estModifie: !ObjetChaine_1.GChaine.estChaineHTMLEgal(
							aParams.content,
							lParams.descriptif,
						),
						avecModificationAuDebut: lParams.avecModificationAuDebut,
					});
				}.bind(lParams.instance),
			},
		);
		const lHTML = [];
		if (!ObjetNavigateur_1.Navigateur.withContentEditable) {
			lHTML.push(
				IE.jsx.str("textarea", {
					id: lFenetre.idEditeurHTML,
					class: "full-size",
					maxlength: "0",
				}),
			);
			lFenetre.afficher(lHTML.join(""));
			ObjetHtml_1.GHtml.setValue(lFenetre.idEditeurHTML, lParams.descriptif);
		} else {
			lHTML.push(
				IE.jsx.str("div", {
					id: lFenetre.idEditeurHTML,
					class: "full-width is-tiny",
				}),
			);
			lFenetre.afficher(lHTML.join(""));
			ObjetHtml_1.GHtml.setHtml(lFenetre.idEditeurHTML, lParams.descriptif);
			const lObjet = {
				id: lFenetre.idEditeurHTML,
				height: "100%",
				readonly: lParams.readonly,
				ariaLabel:
					lParams.ariaLabel ||
					ObjetTraduction_1.GTraductions.getValeur("Tiny.WAITitre"),
				editeurEquation: lParams.editeurEquation,
				editeurEquationMaxFileSize: lParams.editeurEquationMaxFileSize,
				filePickerOpener: lParams.filePickerOpener,
				filePickerTypes: lParams.filePickerTypes,
				iEContextSearch: lParams.iEContextSearch,
				modeMail: lParams.modeMail,
			};
			if (IE.estMobile) {
				Object.assign(lObjet, {
					autoresize_bottom_margin: 0,
					autoresize_on_init: true,
					min_height: 200,
					max_height: (ObjetNavigateur_1.Navigateur.ecranH * 60) / 100,
					height: "",
					plugins: ["autoresize"],
				});
			}
			if (lParams.fontSize) {
				lObjet.fontSize = lParams.fontSize;
			}
			if (lParams.fontFamily) {
				lObjet.fontFamily = lParams.fontFamily;
			}
			TinyInit_1.TinyInit.init(lObjet);
		}
		return lFenetre;
	},
};
