const {
	ObjetAffOffresDeStages_Base,
} = require("ObjetAffOffresDeStages_Base.js");
const { GUID } = require("GUID.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeEventOffresStages } = require("TypeEventOffresStages.js");
class ObjetAffSaisieOffresDeStages extends ObjetAffOffresDeStages_Base {
	constructor(...aParams) {
		super(...aParams);
		this.idOffre = GUID.getId();
		this.idImgOffre = GUID.getId();
		this.idPoubelle = GUID.getId();
		this.idCrayon = GUID.getId();
	}
	supprimerOffre(i) {
		this.callback.appel({
			genreEvnt: TypeEventOffresStages.SuppressionOffre,
			indOffre: i,
		});
	}
	editerOffre(i) {
		this.callback.appel({
			genreEvnt: TypeEventOffresStages.ModificationOffre,
			indOffre: i,
		});
	}
	surSurvolOffre(i, aEnter) {
		const lEltModifiable = this.estOffreModifiable(i);
		if (aEnter) {
			$("#" + _getIdImgOffre.bind(this)(i).escapeJQ()).html(
				this.afficherImg(i),
			);
			if (lEltModifiable.estModifiable) {
				$("#" + this.idPoubelle.escapeJQ()).on(
					"click",
					{ aObjet: this, aInd: i },
					(event) => {
						event.data.aObjet.supprimerOffre(event.data.aInd);
					},
				);
				$("#" + this.idCrayon.escapeJQ()).on(
					"click",
					{ aObjet: this, aInd: i },
					(event) => {
						event.data.aObjet.editerOffre(event.data.aInd);
					},
				);
			}
		} else {
			$("#" + _getIdImgOffre.bind(this)(i).escapeJQ()).html("");
			if (lEltModifiable.estModifiable) {
				$("#" + this.idPoubelle.escapeJQ()).off("click");
				$("#" + this.idCrayon.escapeJQ()).off("click");
			}
		}
	}
	actualiser() {
		super.actualiser();
		for (let i = 0, lNbr = this.listeOffres.count(); i < lNbr; i++) {
			$("#" + _getIdOffre.bind(this)(i).escapeJQ())
				.on("mouseenter", { aObjet: this, aInd: i }, (event) => {
					event.data.aObjet.surSurvolOffre(event.data.aInd, true);
				})
				.on("mouseleave", { aObjet: this, aInd: i }, (event) => {
					event.data.aObjet.surSurvolOffre(event.data.aInd, false);
				});
		}
	}
	afficherListeOffres() {
		const H = [];
		const lNbr = this.listeOffres.count();
		if (lNbr > 0) {
			for (let i = 0, lNbr = this.listeOffres.count(); i < lNbr; i++) {
				let lElt = this.listeOffres.get(i);
				H.push('<article id="', _getIdOffre.bind(this)(i), '">');
				H.push(
					this.afficherOffre({
						offre: lElt,
						htmlEdition: _construireImgsEdition.call(this, i),
						tailleEdition: 48,
					}),
				);
				H.push("</article>");
			}
		} else {
			H.push(
				'<div class="no-offer">',
				GTraductions.getValeur("OffreStage.MsgAucuneOffre"),
				"</div>",
			);
		}
		return H.join("");
	}
	estOffreModifiable(i) {
		const lElt = this.listeOffres.get(i);
		const lEstModifiable =
			!lElt.estPublie &&
			(lElt.estAuteur ||
				this._autorisations.autoriserEditionToutesOffresStages);
		const lHint = lEstModifiable
			? ""
			: lElt.estPublie
				? GTraductions.getValeur("OffreStage.EditInterdit_Publie")
				: GTraductions.getValeur("OffreStage.EditInterdit_Auteur");
		return { estModifiable: lEstModifiable, hintMotif: lHint };
	}
	afficherImg(i) {
		const lEltModifiable = this.estOffreModifiable(i);
		const lImgSuppr = lEltModifiable.estModifiable ? "theme-color" : "inactif";
		const lImgEdit = lEltModifiable.estModifiable ? "theme-color" : "inactif";
		const lTitle = lEltModifiable.hintMotif;
		const H = [];
		H.push(
			'<i id="',
			this.idPoubelle,
			'" class="icon_trash ',
			lImgSuppr,
			'" title="',
			lTitle,
			'"></i>',
		);
		H.push(
			'<i id="',
			this.idCrayon,
			'" class="icon_pencil ',
			lImgEdit,
			'" title="',
			lTitle,
			'"></i>',
		);
		return H.join("");
	}
	getInfos(aOffre) {
		return {
			str:
				" " +
				(aOffre.duree ? "(" + aOffre.duree + ")" : "") +
				" - " +
				(aOffre.estPublie
					? GTraductions.getValeur("OffreStage.PostesPourvus") +
						" : " +
						aOffre.nbPourvus +
						"/" +
						aOffre.nbPropose
					: GTraductions.getValeur("OffreStage.NonPublie")),
			hint:
				aOffre.estPublie && aOffre.nbPourvus > 0
					? this.strListeEleves(aOffre)
					: "",
		};
	}
}
function _construireImgsEdition(aIndice) {
	const H = [];
	H.push('<div id="', _getIdImgOffre.bind(this)(aIndice), '"></div>');
	return H.join("");
}
function _getIdOffre(i) {
	return this.idOffre + "_" + i;
}
function _getIdImgOffre(i) {
	return this.idImgOffre + "_" + i;
}
module.exports = { ObjetAffSaisieOffresDeStages };
