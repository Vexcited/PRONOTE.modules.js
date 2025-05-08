const { EGenreBordure } = require("ObjetStyle.js");
const { GUID } = require("GUID.js");
const { GChaine } = require("ObjetChaine.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { Identite } = require("ObjetIdentite.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { UtilitaireStage } = require("UtilitaireStage.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const { GHtml } = require("ObjetHtml.js");
class ObjetAffOffresDeStages_Base extends Identite {
	constructor(...aParams) {
		super(...aParams);
		this.idOffres = GUID.getId();
		this._options = {
			avecPeriode: false,
			avecPeriodeUnique: true,
			avecGestionPJ: false,
			genreRessourcePJ: -1,
		};
		this._autorisations = { autoriserEditionToutesOffresStages: true };
	}
	setOptions(aOptions) {
		$.extend(this._options, aOptions);
	}
	setAutorisations(aAutorisations) {
		$.extend(this._autorisations, aAutorisations);
	}
	construireAffichage() {
		return '<div id="' + this.idOffres + '"></div>';
	}
	setDonnees(aParam) {
		this.listeOffres = aParam.listeOffres;
		this.actualiser();
	}
	actualiser() {
		GHtml.setHtml(this.idOffres, this.afficherListeOffres(this.listeOffres));
	}
	afficherListeOffres(aListe) {
		const lListe = aListe ? aListe : new ObjetListeElements();
		const H = [];
		const lBordureBas = GStyle.composeCouleurBordure(
			GCouleur.bordure,
			1,
			EGenreBordure.bas,
		);
		const lNbr = lListe.count();
		if (lNbr > 0) {
			H.push('<div class="Texte10">');
			for (let i = 0; i < lNbr; i++) {
				let lElt = lListe.get(i);
				H.push(
					'<div class="EspaceBas" style="width:100%; ',
					lBordureBas,
					'">',
					this.afficherOffre({ offre: lElt }),
					"</div>",
				);
			}
			H.push("</div>");
		} else {
			H.push(
				'<div class="Texte10 AlignementMilieu GrandEspaceHaut">',
				GTraductions.getValeur("OffreStage.MsgAucuneOffre"),
				"</div>",
			);
		}
		return H.join("");
	}
	strListeEleves(aOffre) {
		const H = [];
		for (let i = 0, lNbr = aOffre.listeEleves.count(); i < lNbr; i++) {
			if (i > 0) {
				H.push(" - ");
			}
			H.push(aOffre.listeEleves.get(i).getLibelle());
		}
		return H.join("");
	}
	getInfos() {
		return { str: "", hint: "" };
	}
	afficherOffre(aParam) {
		const lInfo = this.getInfos(aParam.offre);
		const H = [];
		if (!!aParam.htmlEdition) {
			H.push("<header>");
			H.push(
				'<h5 title="',
				lInfo.hint,
				'">',
				aParam.offre.sujet.getLibelle(),
				lInfo.str,
				"</h5>",
			);
			H.push('<div class="bt-edition-contain">', aParam.htmlEdition, "</div>");
			H.push("</header>");
		} else {
			H.push(
				'<h5 title="',
				lInfo.hint,
				'">',
				aParam.offre.sujet.getLibelle(),
				lInfo.str,
				"</h5>",
			);
		}
		if (this._options.avecPeriode) {
			let lLibelle = "";
			if (
				this._options.avecPeriodeUnique &&
				aParam.offre.periode &&
				aParam.offre.periode.dateDebut
			) {
				lLibelle = UtilitaireStage.composeLibelleDatePeriode(
					aParam.offre.periode,
				);
			} else if (!this._options.avecPeriodeUnique && !!aParam.offre.periodes) {
				lLibelle = UtilitaireStage.composeLibelleDatePeriodes(
					aParam.offre.periodes,
				);
			}
			if (!lLibelle) {
				lLibelle = GTraductions.getValeur("OffreStage.aucunePeriodeImposee");
			}
			H.push(
				'<div class="GrandEspaceGauche Espace">',
				GChaine.replaceRCToHTML(lLibelle.ucfirst()),
				"</div>",
			);
		}
		H.push(
			'<div class="GrandEspaceGauche Espace">',
			GChaine.replaceRCToHTML(aParam.offre.sujetDetaille),
			"</div>",
		);
		if (
			this._options.avecGestionPJ &&
			aParam.offre.piecesjointes.getNbrElementsExistes() > 0
		) {
			H.push(
				'<div class="GrandEspaceGauche Espace">',
				UtilitaireUrl.construireListeUrls(aParam.offre.piecesjointes, {
					genreFiltre: EGenreDocumentJoint.Fichier,
					genreRessource: this._options.genreRessourcePJ,
				}),
				"</div>",
			);
		}
		H.push(
			'<div class="GrandEspaceGauche Espace">',
			GChaine.replaceRCToHTML(aParam.offre.commentaire),
			"</div>",
		);
		return H.join("");
	}
}
module.exports = { ObjetAffOffresDeStages_Base };
