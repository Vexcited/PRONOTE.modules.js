exports.ObjetVignetteMediatheque = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetVignette_1 = require("ObjetVignette");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const ObjetMoteurBlog_1 = require("ObjetMoteurBlog");
const TypeGenreMiniature_1 = require("TypeGenreMiniature");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetVignetteMediatheque extends ObjetVignette_1.ObjetVignette {
	constructor() {
		super(...arguments);
		this.moteur = new ObjetMoteurBlog_1.ObjetMoteurBlog();
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
			altImage: ObjetTraduction_1.GTraductions.getValeur(
				"blog.altImageMediatheque",
			),
		};
		if (lOptions.petitFormat === true) {
			$.extend(lParamVignette, { taillePoliceIcone: 50 });
		}
		this.setParam(lParamVignette);
		const lDocCasier = aElement.documentCasier;
		lDocCasier.miniature = TypeGenreMiniature_1.TypeGenreMiniature.GM_400;
		const lGenreDocCasier = lDocCasier.getGenre();
		$.extend(aElement, { libelle: aElement.documentCasier.getLibelle() });
		const lData = {
			data: aElement,
			lien: ObjetChaine_1.GChaine.creerUrlBruteLienExterne(
				aElement.documentCasier,
				{
					genreRessource: Enumere_Ressource_1.EGenreRessource.DocumentJoint,
					miniature: aElement.documentCasier.miniature,
				},
			),
			estImg: ObjetChaine_1.GChaine.estFichierImageAvecMiniaturePossible(
				lDocCasier.getLibelle(),
			),
			estSiteWeb:
				lGenreDocCasier === Enumere_DocumentJoint_1.EGenreDocumentJoint.Url,
			estFichier:
				lGenreDocCasier === Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
			estCloud:
				lGenreDocCasier === Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud,
		};
		this.setDonnees(lData);
	}
}
exports.ObjetVignetteMediatheque = ObjetVignetteMediatheque;
