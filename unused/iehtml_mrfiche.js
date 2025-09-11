const AccessApp_1 = require("AccessApp");
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
	const lModelMrFiche = () => {
		return {
			event: (aEvent, aNode) => {
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({ idRessource: aAttributValue })
					.then(() => {
						ObjetHtml_1.GHtml.setFocus(aNode);
					});
			},
		};
	};
	const lHtml = IE.jsx.str("ie-btnimage", {
		"ie-model": lModelMrFiche,
		class: aImage.class + " AvecMain",
		style: ObjetStyle_1.GStyle.composeWidth(aImage.width),
		"ie-tooltiplabel":
			ObjetTraduction_1.GTraductions.getTitreMFiche(aAttributValue),
		"aria-haspopup": "dialog",
	});
	aOutils.addCommentaireDebug(
		aContexteCourant.node,
		'ie-mrfiche="' + aAttributValue + '"',
	);
	aOutils.injectHTML({
		element: aContexteCourant.node,
		html: lHtml,
		ignorerScroll: true,
		contexte: aContexteCourant.contexte,
	});
	return { node: aContexteCourant.node, avecCompileFils: false };
}
