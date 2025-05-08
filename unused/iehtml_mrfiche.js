const IEHtml = require("IEHtml");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetTraduction_1 = require("ObjetTraduction");
IEHtml.addAttribut(
	"ie-mrfiche",
	(aContexteCourant, aNodeName, aAttributValue, aOutils) => {
		_creerMrFiche(aContexteCourant, aNodeName, aAttributValue, aOutils, {
			class: "icon_question btnImageIcon mrfiche",
		});
	},
);
IEHtml.addAttribut(
	"ie-mrficheblanc",
	(aContexteCourant, aNodeName, aAttributValue, aOutils) => {
		_creerMrFiche(aContexteCourant, aNodeName, aAttributValue, aOutils, {
			class: "Image_MrFicheFenetre",
			width: 18,
		});
	},
);
IEHtml.addAttribut(
	"ie-mrfichewidget",
	(aContexteCourant, aNodeName, aAttributValue, aOutils) => {
		_creerMrFiche(aContexteCourant, aNodeName, aAttributValue, aOutils, {
			class: "icon as-button bt-widget icon_info_widget btnImageIcon",
		});
	},
);
function _creerMrFiche(
	aContexteCourant,
	aNodeName,
	aAttributValue,
	aOutils,
	aImage,
) {
	if (!aAttributValue) {
		return true;
	}
	const lControleur = {
		btnMrFiche: {
			event: function () {
				const lNode = this.node;
				GApplication.getMessage()
					.afficher({ idRessource: aAttributValue })
					.then(() => {
						ObjetHtml_1.GHtml.setFocus(lNode);
					});
			},
		},
	};
	const H = [
		IE.jsx.str("ie-btnimage", {
			"ie-model": "btnMrFiche",
			class: aImage.class + " AvecMain",
			style: ObjetStyle_1.GStyle.composeWidth(aImage.width),
			title: ObjetTraduction_1.GTraductions.getTitreMFiche(aAttributValue),
		}),
	];
	aOutils.addCommentaireDebug(
		aContexteCourant.node,
		'ie-mrfiche="' + aAttributValue + '"',
	);
	aOutils.injectHTML({
		element: aContexteCourant.node,
		html: H.join(""),
		controleur: lControleur,
		ignorerScroll: true,
		contexte: aContexteCourant.contexte,
	});
	return { node: aContexteCourant.node, avecCompileFils: false };
}
