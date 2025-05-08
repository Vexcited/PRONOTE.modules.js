const { GChaine } = require("ObjetChaine.js");
const { ObjetVignette } = require("ObjetVignette.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { ObjetMoteurBlog } = require("ObjetMoteurBlog.js");
const { TypeGenreMiniature } = require("TypeGenreMiniature.js");
const { GTraductions } = require("ObjetTraduction.js");
class ObjetVignetteMediatheque extends ObjetVignette {
	constructor(...aParams) {
		super(...aParams);
		this.moteur = new ObjetMoteurBlog();
	}
	construireAffichage() {
		return this.afficher();
	}
	setParametres(aElement, aOptions) {
		const lOptions = { petitFormat: false };
		if (aOptions === null || aOptions === undefined) {
			aOptions = {};
		}
		$.extend(lOptions, aOptions);
		const lParamVignette = {
			avecSurvol: true,
			avecSelection: true,
			avecImage: true,
			estDiapo: true,
			largeur: 0,
			hauteur: 0,
			taillePoliceIcone: 60,
			altImage: GTraductions.getValeur("blog.altImageMediatheque"),
		};
		if (lOptions.petitFormat === true) {
			$.extend(lParamVignette, { taillePoliceIcone: 50 });
		}
		this.setParam(lParamVignette);
		const lDocCasier = aElement.documentCasier;
		lDocCasier.miniature = TypeGenreMiniature.GM_400;
		const lGenreDocCasier = lDocCasier.getGenre();
		$.extend(aElement, { libelle: aElement.documentCasier.getLibelle() });
		const lData = {
			data: aElement,
			lien: GChaine.creerUrlBruteLienExterne(aElement.documentCasier, {
				genreRessource: EGenreRessource.DocumentJoint,
				miniature: aElement.documentCasier.miniature,
			}),
			estImg: GChaine.estFichierImageAvecMiniaturePossible(
				lDocCasier.getLibelle(),
			),
			estSiteWeb: lGenreDocCasier === EGenreDocumentJoint.Url,
			estFichier: lGenreDocCasier === EGenreDocumentJoint.Fichier,
			estCloud: lGenreDocCasier === EGenreDocumentJoint.Cloud,
		};
		this.setDonnees(lData);
	}
}
module.exports = { ObjetVignetteMediatheque };
