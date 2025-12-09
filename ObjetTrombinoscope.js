exports.ObjetTrombinoscope = void 0;
const ObjetStyle_1 = require("ObjetStyle");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetStyle_2 = require("ObjetStyle");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class ObjetTrombinoscope extends ObjetIdentite_1.Identite {
	constructor() {
		super(...arguments);
		this.donneesRecues = false;
	}
	setDonnees(aParam) {
		this.donneesRecues = true;
		this.params = aParam;
		this.afficher();
	}
	construireAffichage() {
		if (this.donneesRecues) {
			return this.construireTrombinoscope();
		} else {
			return "";
		}
	}
	jsxNodePhoto(aRessource, aNode) {
		$(aNode).on("error", () => {
			if (aRessource) {
				aRessource.avecPhoto = false;
			}
		});
	}
	construireTrombinoscope(aPourImpression) {
		const H = [];
		const lCmp = this.params.listeRessources.count();
		if (lCmp === 0) {
			H.push(
				'<div class="Texte10 Gras AlignementMilieu EspaceHaut">',
				this.params.message,
				"</div>",
			);
		} else {
			ObjetTri_1.ObjetTri.trierTableau(
				this.params.listeRessources.genresRessources,
				[ObjetTri_1.ObjetTri.init("genre")],
			);
			this.params.listeRessources.genresRessources.forEach(
				(aRessource, aIndex) => {
					if (this.params.listeRessources.genresRessources.length > 1) {
						H.push(
							'<div style="padding-bottom:10px;',
							aIndex > 0 ? "padding-top:5px;" : "",
							'">',
						);
						if (aIndex > 0) {
							H.push(
								'<div style="',
								ObjetStyle_2.GStyle.composeCouleurBordure(
									GCouleur.bordure,
									1,
									ObjetStyle_1.EGenreBordure.bas,
								),
								'"></div>',
							);
						}
						const lNb = aRessource.nb;
						H.push(
							'<div class="EspaceHaut Gras Texte12">',
							ObjetChaine_1.GChaine.format("%s %s", [
								aRessource.nb,
								(aRessource.genre ===
								Enumere_Ressource_1.EGenreRessource.Personnel
									? lNb > 1
										? ObjetTraduction_1.GTraductions.getValeur("Personnels")
										: ObjetTraduction_1.GTraductions.getValeur("Personnel")
									: lNb > 1
										? ObjetTraduction_1.GTraductions.getValeur("Professeurs")
										: ObjetTraduction_1.GTraductions.getValeur("Professeur")
								).toLowerCase(),
							]),
							"</div>",
						);
						H.push("</div>");
						H.push('<div class="GrandEspaceGauche">');
					}
					H.push(
						this._composeBlocParGenreRessource(
							aRessource.genre,
							aPourImpression,
						),
					);
					if (this.params.listeRessources.genresRessources.length > 1) {
						H.push("</div>");
					}
				},
			);
		}
		return H.join("");
	}
	_composeListeRessources(aListe, aPourImpression) {
		const lNb = aListe.count();
		return IE.jsx.str(
			"ul",
			{ class: "flex-contain flex-wrap ie-imgviewer-container" },
			(H) => {
				for (let i = 0; i < lNb; i++) {
					let lRessource = aListe.get(i);
					lRessource.avecPhoto = true;
					const lUrl =
						ObjetChaine_1.GChaine.composeUrlImgPhotoIndividu(lRessource);
					let lSousTitre = "";
					if (lRessource.libellePlus) {
						lSousTitre = lRessource.libellePlus;
					} else if (lRessource.filtres) {
						lSousTitre = lRessource.filtres
							.getTableauLibelles()
							.sort()
							.join(", ");
					}
					const lLibelle = ObjetTraduction_1.GTraductions.getValeur(
						"PhotoDe_S",
						[lRessource.getLibelle()],
					);
					H.push(
						IE.jsx.str(
							"li",
							{ style: "width:120px; height:150px;" },
							IE.jsx.str(
								"div",
								{
									style: "width: 78px; height: 100px; overflow: hidden;",
									class: "EspaceDroit",
								},
								IE.jsx.str("img", {
									"ie-load-src":
										lRessource.avecPhoto && !aPourImpression ? lUrl : false,
									src: aPourImpression && lRessource.avecPhoto ? lUrl : false,
									"ie-node": this.jsxNodePhoto.bind(this, lRessource),
									class: "img-portrait",
									"ie-imgviewer": !aPourImpression,
									style: "width: 78px;",
									alt: lLibelle,
									"data-libelle": lLibelle,
								}),
							),
							lSousTitre
								? IE.jsx.str(
										"div",
										{
											"ie-ellipsis": true,
											style: "width:110px; padding-top:3px;padding-bottom:2px;",
											class: "Texte9",
										},
										lSousTitre.toLowerCase(),
									)
								: "",
							IE.jsx.str(
								"div",
								{
									class: [
										Divers_css_1.StylesDivers.ellipsisMultilignes,
										Divers_css_1.StylesDivers.ellipsisSansHyphens,
										lRessource.nomGras ? Divers_css_1.StylesDivers.Gras : "",
									],
									style: {
										"word-wrap": "break-word",
										"min-height": 28,
										"margin-top": 2,
										width: 110,
									},
								},
								lRessource.getLibelle(),
							),
						),
					);
				}
			},
		);
	}
	_composeBlocParGenreRessource(aGenreRessource, aPourImpression) {
		const H = [];
		if (this.params.triParFiltre) {
			let lFiltre;
			for (let i = 0; i < this.params.listeFiltres.count(); i++) {
				lFiltre = this.params.listeFiltres.get(i);
				if (lFiltre.genreRessource === aGenreRessource) {
					lFiltre.listeRessources.trier();
					H.push(
						IE.jsx.str(
							"div",
							{
								class: "EspaceHaut",
								role: "group",
								"aria-label": lFiltre.getLibelle(),
							},
							IE.jsx.str(
								"div",
								{ class: "Texte12 Gras EspaceBas" },
								lFiltre.getLibelle().toUpperCase(),
							),
							this._composeListeRessources(
								lFiltre.listeRessources,
								aPourImpression,
							),
						),
					);
				}
			}
		} else {
			H.push(
				this._composeListeRessources(
					this.params.listeRessources.getListeElements((aRessource) => {
						return aRessource.getGenre() === aGenreRessource;
					}),
					aPourImpression,
				),
			);
		}
		return H.join("");
	}
}
exports.ObjetTrombinoscope = ObjetTrombinoscope;
