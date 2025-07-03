exports.DonneesListe_RessourcesPedagogiques = void 0;
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_RessourcePedagogique_1 = require("Enumere_RessourcePedagogique");
const UtilitaireQCM_1 = require("UtilitaireQCM");
class DonneesListe_RessourcesPedagogiques extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aGenresAffiches, aCallbackExecutionQCM) {
		super(aDonnees.ensembleDocuments);
		aDonnees.ensembleDocuments.parcourir((D) => {
			D.visible = D.genres.dupliquer().intersect(aGenresAffiches).count() > 0;
		});
		this.callbackExecutionQCM = aCallbackExecutionQCM;
		this.setOptions({
			hauteurMinCellule: 30,
			avecSelection: false,
			avecEdition: false,
		});
	}
	avecEvenementSelection(aParams) {
		return (
			aParams.idColonne ===
				DonneesListe_RessourcesPedagogiques.colonnes.libelle &&
			aParams.article.getGenre() ===
				Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.kiosque
		);
	}
	getClass(aParams) {
		const lClasses = [];
		switch (aParams.idColonne) {
			case DonneesListe_RessourcesPedagogiques.colonnes.types:
				lClasses.push("AlignementMilieu");
				break;
			case DonneesListe_RessourcesPedagogiques.colonnes.date:
				lClasses.push("AlignementDroit");
				break;
		}
		return lClasses.join(" ");
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_RessourcesPedagogiques.colonnes.types:
			case DonneesListe_RessourcesPedagogiques.colonnes.libelle:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	eventQCM(aParams) {
		if (
			aParams.article.genres.contains(
				Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.QCM,
			) ||
			aParams.article.genres.contains(
				Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.corrige,
			)
		) {
			this.callbackExecutionQCM(aParams.article.ressource);
		} else {
		}
	}
	getValeur(aParams) {
		const H = [];
		switch (aParams.idColonne) {
			case DonneesListe_RessourcesPedagogiques.colonnes.types: {
				const lItems = aParams.article.genres.items();
				for (let i = 0; i < lItems.length; i++) {
					H.push(
						'<i class="' +
							Enumere_RessourcePedagogique_1.EGenreRessourcePedagogiqueUtil.getIcone(
								lItems[i],
							) +
							'" style="font-size:1.6rem;" role="presentation"></i>',
					);
				}
				return H.join(" ");
			}
			case DonneesListe_RessourcesPedagogiques.colonnes.matiere:
				return aParams.article.matiere
					? aParams.article.matiere.getLibelle()
					: "";
			case DonneesListe_RessourcesPedagogiques.colonnes.libelle:
				if (
					aParams.article.getGenre() ===
					Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.QCM
				) {
					if (
						UtilitaireQCM_1.UtilitaireQCM.estCliquable(
							aParams.article.ressource,
						)
					) {
						H.push(
							IE.jsx.str(
								"span",
								{
									class: "LienAccueil",
									"ie-eventvalidation": this.eventQCM.bind(this, aParams),
									role: "button",
									tabindex: "0",
								},
								aParams.article.ressource.QCM.getLibelle(),
							),
						);
					} else {
						H.push(
							'<span class="Texte10">',
							aParams.article.ressource.QCM.getLibelle(),
							"</span>",
						);
					}
					return H.join("");
				} else {
					H.push(
						Enumere_RessourcePedagogique_1.EGenreRessourcePedagogiqueUtil.composerURL(
							aParams.article.getGenre(),
							aParams.article.ressource,
							aParams.article.getGenre() ===
								Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
									.travailRendu
								? ObjetTraduction_1.GTraductions.getValeur(
										"RessourcePedagogique.DevoirDu",
										[
											ObjetDate_1.GDate.formatDate(
												aParams.article.ressource.pourLe,
												"%JJ/%MM/%AA",
											),
										],
									)
								: null,
						),
					);
					return H.join("");
				}
			case DonneesListe_RessourcesPedagogiques.colonnes.date: {
				let lDate = aParams.article.date;
				if (aParams.article.dates) {
					lDate = aParams.article.dates[0];
				}
				return ObjetDate_1.GDate.formatDate(lDate, "%JJ/%MM/%AA");
			}
		}
		return "";
	}
	getTooltip(aParams) {
		if (
			aParams.idColonne === DonneesListe_RessourcesPedagogiques.colonnes.date &&
			aParams.article.dates
		) {
			if (!aParams.article.dates.trie) {
				aParams.article.dates.sort((a, b) => {
					return a.getTime() - b.getTime();
				});
				aParams.article.dates.trie = true;
			}
			let lLibelle = "";
			aParams.article.dates.forEach((aDate) => {
				if (lLibelle.length > 0) {
					lLibelle += "\n";
				}
				lLibelle += ObjetDate_1.GDate.formatDate(aDate, "%JJ/%MM/%AA");
			});
			return lLibelle;
		}
		return "";
	}
	getTri(aColonne, aGenreTri) {
		const lTris = [];
		switch (this.getId(aColonne)) {
			case DonneesListe_RessourcesPedagogiques.colonnes.types:
				lTris.push(
					ObjetTri_1.ObjetTri.init((D) => {
						return D.genres.count();
					}, aGenreTri),
				);
				lTris.push(ObjetTri_1.ObjetTri.init("Genre", aGenreTri));
				break;
			case DonneesListe_RessourcesPedagogiques.colonnes.libelle:
				lTris.push(
					ObjetTri_1.ObjetTri.init((D) => {
						return D.ressource.QCM
							? D.ressource.QCM.getLibelle()
							: D.ressource.getLibelle();
					}, aGenreTri),
				);
				break;
			case DonneesListe_RessourcesPedagogiques.colonnes.date:
				lTris.push(
					ObjetTri_1.ObjetTri.init(
						"date",
						aGenreTri === Enumere_TriElement_1.EGenreTriElement.Decroissant
							? Enumere_TriElement_1.EGenreTriElement.Croissant
							: Enumere_TriElement_1.EGenreTriElement.Decroissant,
					),
				);
				break;
			case DonneesListe_RessourcesPedagogiques.colonnes.matiere:
				lTris.push(
					ObjetTri_1.ObjetTri.init((D) => {
						return D.matiere.getLibelle();
					}, aGenreTri),
				);
				lTris.push(
					ObjetTri_1.ObjetTri.init((D) => {
						return D.matiere.getNumero();
					}, aGenreTri),
				);
				break;
		}
		lTris.push(ObjetTri_1.ObjetTri.init("Libelle", aGenreTri));
		lTris.push(ObjetTri_1.ObjetTri.init("date", aGenreTri));
		return lTris;
	}
	getVisible(D) {
		return D.visible;
	}
}
exports.DonneesListe_RessourcesPedagogiques =
	DonneesListe_RessourcesPedagogiques;
(function (DonneesListe_RessourcesPedagogiques) {
	let colonnes;
	(function (colonnes) {
		colonnes["types"] = "Dl_RessPeda_types";
		colonnes["libelle"] = "Dl_RessPeda_libelle";
		colonnes["date"] = "Dl_RessPeda_date";
		colonnes["matiere"] = "Dl_RessPeda_matiere";
	})(
		(colonnes =
			DonneesListe_RessourcesPedagogiques.colonnes ||
			(DonneesListe_RessourcesPedagogiques.colonnes = {})),
	);
})(
	DonneesListe_RessourcesPedagogiques ||
		(exports.DonneesListe_RessourcesPedagogiques =
			DonneesListe_RessourcesPedagogiques =
				{}),
);
