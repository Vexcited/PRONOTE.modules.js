exports.UtilitaireListePublics = UtilitaireListePublics;
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
function UtilitaireListePublics() {}
UtilitaireListePublics.getLibelleSuppListePublics = (
	aArticle,
	aOptions = {},
) => {
	const lOptions = Object.assign(
		{
			avecProfPrincipal: false,
			avecTuteur: false,
			avecListeRessource: false,
			avecReferentHarcelement: true,
			avecMonCpe: true,
			avecFonction: true,
		},
		aOptions,
	);
	const H = [];
	if (aArticle) {
		switch (aArticle.getGenre()) {
			case Enumere_Ressource_1.EGenreRessource.Enseignant:
				if (lOptions.avecProfPrincipal && aArticle.estPrincipal) {
					H.push(
						`<p><i role="presentation" class="icon_star m-right-s"></i>${ObjetTraduction_1.GTraductions.getValeur("Messagerie.ProfPrincipal")}</p>`,
					);
				}
				if (lOptions.avecTuteur && aArticle.estTuteur) {
					H.push(
						`<p><i role="presentation" class="icon_star m-right-s"></i>${ObjetTraduction_1.GTraductions.getValeur("Messagerie.Tuteur")}</p>`,
					);
				}
				if (lOptions.avecListeRessource && aArticle.listeRessources) {
					H.push(aArticle.listeRessources.getTableauLibelles().join("<br>"));
				}
				break;
			case Enumere_Ressource_1.EGenreRessource.Personnel:
				if (lOptions.avecMonCpe && aArticle.estMonCpe) {
					H.push(
						`<p><i role="presentation" class="icon_star m-right-s"></i>${ObjetTraduction_1.GTraductions.getValeur("Messagerie.monCPE")}</p>`,
					);
				}
				if (lOptions.avecFonction && aArticle.fonction) {
					H.push(`<p>${aArticle.fonction.getLibelle()}</p>`);
				}
				break;
			case Enumere_Ressource_1.EGenreRessource.Eleve:
			case Enumere_Ressource_1.EGenreRessource.Responsable:
				if (aArticle.classesNiv) {
					H.push(
						`<p>${aArticle.classesNiv.getTableauLibelles().join(", ")}</p>`,
					);
				}
		}
	}
	return H.join("");
};
