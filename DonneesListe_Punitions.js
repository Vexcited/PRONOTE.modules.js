exports.DonneesListe_Punitions = void 0;
const TypeFusionTitreListe_1 = require("TypeFusionTitreListe");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetListe_1 = require("ObjetListe");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeEtatAffichagePunition_1 = require("TypeEtatAffichagePunition");
const GlossaireCP_1 = require("GlossaireCP");
class DonneesListe_Punitions extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aListe) {
		super(aListe);
		this.setOptions({
			avecSelection: false,
			avecSuppression: false,
			avecContenuTronque: true,
		});
	}
	avecEdition(aParams) {
		return (
			aParams.idColonne === DonneesListe_Punitions.colonnes.realisee &&
			!(aParams.article.estUnCumul && aParams.article.estMultiProgrammation)
		);
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Punitions.colonnes.date:
				return aParams.article.estUnCumul &&
					aParams.article.estMultiProgrammation
					? ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte
					: ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Date;
			case DonneesListe_Punitions.colonnes.reportee:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
			case DonneesListe_Punitions.colonnes.etat:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Image;
			case DonneesListe_Punitions.colonnes.realisee:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule
					.DateCalendrier;
			case DonneesListe_Punitions.colonnes.pj:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_Punitions.colonnes.pjPunition:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	jsxModelCertificat(aArticle) {
		return {
			event: () => {
				ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
					pere: this.paramsListe.liste,
					initCommandes: function (aMenu) {
						aArticle.documentsTAF.parcourir((aDocument) => {
							if (aDocument.existe()) {
								aMenu.add(aDocument.getLibelle(), true, () => {
									_openDocumentDArticle(aDocument);
								});
							}
						});
					},
				});
			},
		};
	}
	jsxModelPJPunition(aArticle) {
		return {
			event: () => {
				ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
					pere: this.paramsListe.liste,
					initCommandes: function (aMenu) {
						aArticle.documents.parcourir((aDocument) => {
							if (aDocument.existe()) {
								aMenu.add(aDocument.getLibelle(), true, () => {
									_openDocumentDArticle(aDocument);
								});
							}
						});
					},
				});
			},
		};
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Punitions.colonnes.classe:
				return aParams.article.estUnCumul
					? aParams.article.classe.getLibelle()
					: "";
			case DonneesListe_Punitions.colonnes.nom:
				return aParams.article.estUnCumul
					? aParams.article.eleve.getLibelle()
					: "";
			case DonneesListe_Punitions.colonnes.regime:
				return aParams.article.strRegime || "";
			case DonneesListe_Punitions.colonnes.date:
				return aParams.article.estUnCumul &&
					aParams.article.estMultiProgrammation
					? ObjetTraduction_1.GTraductions.getValeur("punition.xSeances", [
							aParams.article.nombreSeances,
						])
					: aParams.article.dateExecution;
			case DonneesListe_Punitions.colonnes.heure:
				return aParams.article.estUnCumul &&
					aParams.article.estMultiProgrammation
					? ""
					: aParams.article.strHeureExecution;
			case DonneesListe_Punitions.colonnes.surveillant:
				return (aParams.article.estUnCumul &&
					aParams.article.estMultiProgrammation) ||
					!aParams.article.strSurveillant
					? ""
					: aParams.article.strSurveillant;
			case DonneesListe_Punitions.colonnes.lieu:
				return aParams.article.estUnCumul &&
					aParams.article.estMultiProgrammation
					? ""
					: aParams.article.strLieu;
			case DonneesListe_Punitions.colonnes.reportee:
				return aParams.article.estUnCumul &&
					aParams.article.estMultiProgrammation
					? ""
					: aParams.article.estReportee;
			case DonneesListe_Punitions.colonnes.travailAFaire:
				return aParams.article.commentaireDemande;
			case DonneesListe_Punitions.colonnes.punition:
				return !aParams.article.estUnCumul
					? ""
					: aParams.article.naturePunition.getLibelle();
			case DonneesListe_Punitions.colonnes.motif:
				return !aParams.article.estUnCumul ? "" : aParams.article.strMotifs;
			case DonneesListe_Punitions.colonnes.demandeur:
				return !aParams.article.estUnCumul
					? ""
					: aParams.article.demandeur
						? aParams.article.demandeur.getLibelle()
						: "";
			case DonneesListe_Punitions.colonnes.duree:
				return aParams.article.strDuree ? aParams.article.strDuree : "";
			case DonneesListe_Punitions.colonnes.etat:
				return TypeEtatAffichagePunition_1.TypeEtatAffichagePunitionUtil.getClassImage(
					aParams.article.etatAffichagePunition,
				);
			case DonneesListe_Punitions.colonnes.realisee:
				return aParams.article.estUnCumul &&
					aParams.article.estMultiProgrammation
					? ""
					: aParams.article.dateRealisation;
			case DonneesListe_Punitions.colonnes.pjPunition:
				if (
					(!aParams.article.estUnCumul &&
						aParams.article.estMultiProgrammation) ||
					!aParams.article.avecPJ ||
					!aParams.article.documents
				) {
					return "";
				}
				if (aParams.article.documents.count() === 1) {
					const lUrlLienDocument =
						ObjetChaine_1.GChaine.creerUrlBruteLienExterne(
							aParams.article.documents.get(0),
							{
								genreRessource:
									Enumere_Ressource_1.EGenreRessource.DocJointEleve,
							},
						);
					const lTitleDocument = aParams.article.documents.get(0).getLibelle();
					const lDocumentUnique = [];
					lDocumentUnique.push(
						IE.jsx.str(
							"a",
							{
								href: lUrlLienDocument,
								target: "_blank",
								title: lTitleDocument,
							},
							IE.jsx.str("i", {
								class: fonts_css_1.StylesFonts.icon_piece_jointe,
								style: "margin-left:auto; margin-right:auto;",
								role: "presentation",
							}),
						),
					);
					return lDocumentUnique.join("");
				}
				if (aParams.article.documents.count() > 1) {
					return IE.jsx.str("ie-btnicon", {
						class: fonts_css_1.StylesFonts.icon_piece_jointe,
						style: "margin-left:auto; margin-right:auto;",
						"ie-model": this.jsxModelPJPunition.bind(this, aParams.article),
						"aria-haspopup": "menu",
						title: GlossaireCP_1.TradGlossaireCP.ConsulterLesPiecesJointes,
					});
				}
				return "";
			case DonneesListe_Punitions.colonnes.pj:
				if (
					(!aParams.article.estUnCumul &&
						aParams.article.estMultiProgrammation) ||
					!aParams.article.avecPJTaf ||
					!aParams.article.documentsTAF ||
					aParams.article.documentsTAF.count() === 0
				) {
					return "";
				}
				if (aParams.article.documentsTAF.count() === 1) {
					const lUrlLienDocumentTAF =
						ObjetChaine_1.GChaine.creerUrlBruteLienExterne(
							aParams.article.documentsTAF.get(0),
							{
								genreRessource:
									Enumere_Ressource_1.EGenreRessource.DocJointEleve,
							},
						);
					const lTitleDocumentTaf = aParams.article.documentsTAF
						.get(0)
						.getLibelle();
					const lDocumentTafUnique = [];
					lDocumentTafUnique.push(
						IE.jsx.str(
							"a",
							{
								href: lUrlLienDocumentTAF,
								target: "_blank",
								title: lTitleDocumentTaf,
							},
							IE.jsx.str("i", {
								class: fonts_css_1.StylesFonts.icon_piece_jointe,
								style: "margin-left:auto; margin-right:auto;",
								role: "presentation",
							}),
						),
					);
					return lDocumentTafUnique.join("");
				}
				if (aParams.article.documentsTAF.count() > 1) {
					return IE.jsx.str("ie-btnicon", {
						class: fonts_css_1.StylesFonts.icon_piece_jointe,
						style: "margin-left:auto; margin-right:auto;",
						"ie-model": this.jsxModelCertificat.bind(this, aParams.article),
						"aria-haspopup": "menu",
						title: GlossaireCP_1.TradGlossaireCP.ConsulterLesPiecesJointes,
					});
				}
				return "";
		}
		return "";
	}
	getTooltip(aParams) {
		if (aParams.idColonne === DonneesListe_Punitions.colonnes.etat) {
			if (aParams.article) {
				if (aParams.article.hintEtatPunition) {
					return aParams.article.hintEtatPunition;
				}
			}
		}
		return "";
	}
	getVisible(D) {
		return D.visible;
	}
	getClass(aParams) {
		const lClass = [];
		if (
			[
				DonneesListe_Punitions.colonnes.date,
				DonneesListe_Punitions.colonnes.heure,
				DonneesListe_Punitions.colonnes.surveillant,
				DonneesListe_Punitions.colonnes.lieu,
			].includes(aParams.idColonne)
		) {
			if (aParams.article.estUnCumul && aParams.article.estMultiProgrammation) {
				lClass.push("Gras");
			} else if (
				!aParams.article.estUnCumul &&
				aParams.article.estMultiProgrammation
			) {
				lClass.push("Italique");
			}
		}
		return lClass.join(" ");
	}
	getTri(aColonneDeTri, aGenreTri) {
		if (aColonneDeTri === null || aColonneDeTri === undefined) {
			return [];
		}
		const lTris = [];
		let lTriAvecDate = false;
		for (let i = 0; i < aColonneDeTri.length; i++) {
			let lId = this.getId(aColonneDeTri[i]);
			let lGenre;
			if (
				Array.isArray(aGenreTri) &&
				aGenreTri.length &&
				aGenreTri.length === aColonneDeTri.length
			) {
				lGenre = aGenreTri[i];
			} else {
				lGenre = aGenreTri;
			}
			switch (lId) {
				case DonneesListe_Punitions.colonnes.classe:
					lTris.push(
						ObjetTri_1.ObjetTri.init((D) => {
							return D.classe.getLibelle();
						}, lGenre),
					);
					break;
				case DonneesListe_Punitions.colonnes.nom:
					lTris.push(
						ObjetTri_1.ObjetTri.init((D) => {
							return D.eleve.getLibelle();
						}, lGenre),
					);
					break;
				case DonneesListe_Punitions.colonnes.date:
					lTriAvecDate = true;
					lTris.push(
						ObjetTri_1.ObjetTri.init((D) => {
							return !D.estUnCumul ? (!D.dateExecution ? 2 : 1) : 0;
						}),
					);
					lTris.push(ObjetTri_1.ObjetTri.init("dateExecution", lGenre));
					break;
				case DonneesListe_Punitions.colonnes.heure:
					lTris.push(
						ObjetTri_1.ObjetTri.init((D) => {
							return D.placeExecution;
						}, lGenre),
					);
					break;
				case DonneesListe_Punitions.colonnes.etat:
					lTris.push(
						ObjetTri_1.ObjetTri.init((D) => {
							return D.getGenre();
						}, lGenre),
					);
					break;
				case DonneesListe_Punitions.colonnes.realisee:
					lTris.push(
						ObjetTri_1.ObjetTri.init((D) => {
							return D.dateRealisation;
						}, lGenre),
					);
					break;
				default:
					lTris.push(
						ObjetTri_1.ObjetTri.init(
							this.getValeurPourTri.bind(this, aColonneDeTri[i]),
							lGenre,
						),
					);
					break;
			}
		}
		lTris.push(
			ObjetTri_1.ObjetTri.init((D) => {
				return D.classe.getLibelle();
			}),
		);
		lTris.push(
			ObjetTri_1.ObjetTri.init((D) => {
				return D.eleve.getLibelle();
			}),
		);
		if (!lTriAvecDate) {
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					const lTest = !D.estUnCumul ? (!D.dateExecution ? 2 : 1) : 0;
					return lTest;
				}),
			);
			lTris.push(ObjetTri_1.ObjetTri.init("dateExecution"));
		}
		return [ObjetTri_1.ObjetTri.initRecursif("pere", lTris)];
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_Punitions.colonnes.realisee: {
				aParams.article.dateRealisation = V;
				break;
			}
		}
	}
	initialiserObjetGraphique(aParams, aInstance) {
		aInstance.setParametres(
			GParametres.PremierLundi,
			GParametres.PremiereDate,
			GParametres.DerniereDate,
			GParametres.JoursOuvres,
			null,
			GParametres.JoursFeries,
			true,
		);
		if (aParams.article.dateDemande) {
			aInstance.setPremiereDateSaisissable(aParams.article.dateDemande);
		}
	}
	setDonneesObjetGraphique(aParams, aInstance) {
		aInstance.setDonnees(aParams.article.dateRealisation);
	}
}
exports.DonneesListe_Punitions = DonneesListe_Punitions;
(function (DonneesListe_Punitions) {
	let colonnes;
	(function (colonnes) {
		colonnes["classe"] = "punition_prog_classe";
		colonnes["nom"] = "punition_prog_nomEleve";
		colonnes["regime"] = "punition_prog_regime";
		colonnes["date"] = "punition_prog_date";
		colonnes["heure"] = "punition_prog_heure";
		colonnes["surveillant"] = "punition_prog_surveillant";
		colonnes["lieu"] = "punition_prog_lieu";
		colonnes["reportee"] = "punition_prog_reportee";
		colonnes["travailAFaire"] = "punition_prog_TAF";
		colonnes["punition"] = "punition_prog_punition";
		colonnes["motif"] = "punition_prog_motif";
		colonnes["pjPunition"] = "punition_prog_PJPunition";
		colonnes["demandeur"] = "punition_prog_demandeur";
		colonnes["duree"] = "punition_prog_duree";
		colonnes["etat"] = "punition_prog_etat";
		colonnes["realisee"] = "punition_prog_realisee";
		colonnes["pj"] = "punition_prog_pj";
	})(
		(colonnes =
			DonneesListe_Punitions.colonnes ||
			(DonneesListe_Punitions.colonnes = {})),
	);
})(
	DonneesListe_Punitions ||
		(exports.DonneesListe_Punitions = DonneesListe_Punitions = {}),
);
DonneesListe_Punitions.options = {
	colonnes: _getColonnes(),
	colonnesCachees: [],
	hauteurAdapteContenu: true,
	piedDeListe: null,
	scrollHorizontal: true,
};
function _getColonnes() {
	const lColonnes2 = [];
	lColonnes2.push({
		id: DonneesListe_Punitions.colonnes.classe,
		taille: 100,
		titre: [
			ObjetTraduction_1.GTraductions.getValeur("Eleve"),
			ObjetTraduction_1.GTraductions.getValeur("Classe"),
		],
	});
	lColonnes2.push({
		id: DonneesListe_Punitions.colonnes.nom,
		taille: 150,
		titre: [
			TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
			ObjetTraduction_1.GTraductions.getValeur("Nom"),
		],
	});
	lColonnes2.push({
		id: DonneesListe_Punitions.colonnes.regime,
		taille: ObjetListe_1.ObjetListe.initColonne(20, 100, 280),
		titre: {
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"punition.titre.regime",
			),
			nbLignes: 3,
		},
	});
	lColonnes2.push({
		id: DonneesListe_Punitions.colonnes.date,
		taille: 64,
		titre: [
			ObjetTraduction_1.GTraductions.getValeur("punition.titre.programmation"),
			ObjetTraduction_1.GTraductions.getValeur("Date"),
		],
	});
	lColonnes2.push({
		id: DonneesListe_Punitions.colonnes.heure,
		taille: 40,
		titre: [
			TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
			ObjetTraduction_1.GTraductions.getValeur("Heure"),
		],
	});
	lColonnes2.push({
		id: DonneesListe_Punitions.colonnes.surveillant,
		taille: 90,
		titre: [
			TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
			ObjetTraduction_1.GTraductions.getValeur("punition.titre.Surveillant"),
		],
	});
	lColonnes2.push({
		id: DonneesListe_Punitions.colonnes.lieu,
		taille: 90,
		titre: [
			TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
			ObjetTraduction_1.GTraductions.getValeur("punition.titre.Lieu"),
		],
	});
	lColonnes2.push({
		id: DonneesListe_Punitions.colonnes.reportee,
		taille: 60,
		titre: [
			TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
			ObjetTraduction_1.GTraductions.getValeur("punition.titre.Reportee"),
		],
	});
	lColonnes2.push({
		id: DonneesListe_Punitions.colonnes.travailAFaire,
		taille: ObjetListe_1.ObjetListe.initColonne(30, 150, 300),
		titre: ObjetTraduction_1.GTraductions.getValeur("punition.titre.taf"),
	});
	lColonnes2.push({
		id: DonneesListe_Punitions.colonnes.punition,
		taille: 80,
		titre: [
			ObjetTraduction_1.GTraductions.getValeur("punition.titre.Notification"),
			ObjetTraduction_1.GTraductions.getValeur("punition.titre.Punition"),
		],
	});
	lColonnes2.push({
		id: DonneesListe_Punitions.colonnes.motif,
		taille: ObjetListe_1.ObjetListe.initColonne(30, 100, 300),
		titre: [
			TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
			ObjetTraduction_1.GTraductions.getValeur("punition.titre.Motif"),
		],
	});
	lColonnes2.push({
		id: DonneesListe_Punitions.colonnes.pjPunition,
		taille: 16,
		titre: [
			TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
			{
				getLibelleHtml: () =>
					IE.jsx.str("i", {
						class: fonts_css_1.StylesFonts.icon_piece_jointe,
						role: "img",
						"aria-label": GlossaireCP_1.TradGlossaireCP.PiecesJointes,
					}),
			},
		],
		hint: GlossaireCP_1.TradGlossaireCP.PiecesJointes,
	});
	lColonnes2.push({
		id: DonneesListe_Punitions.colonnes.demandeur,
		taille: ObjetListe_1.ObjetListe.initColonne(20, 100, 200),
		titre: [
			TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
			ObjetTraduction_1.GTraductions.getValeur("punition.titre.Demandeur"),
		],
	});
	lColonnes2.push({
		id: DonneesListe_Punitions.colonnes.duree,
		taille: 50,
		titre: [
			TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
			{
				libelleHtml:
					ObjetTraduction_1.GTraductions.getValeur("Heure") +
					" / " +
					ObjetTraduction_1.GTraductions.getValeur("Duree"),
			},
		],
	});
	lColonnes2.push({
		id: DonneesListe_Punitions.colonnes.etat,
		taille: 25,
		titre: ObjetTraduction_1.GTraductions.getValeur("punition.titre.Etat"),
	});
	lColonnes2.push({
		id: DonneesListe_Punitions.colonnes.realisee,
		taille: 50,
		titre: {
			libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
				"punition.titre.RealiseLe",
			),
		},
	});
	lColonnes2.push({
		id: DonneesListe_Punitions.colonnes.pj,
		taille: 16,
		titre: {
			getLibelleHtml: () =>
				IE.jsx.str("i", {
					class: fonts_css_1.StylesFonts.icon_piece_jointe,
					role: "img",
					"aria-label": GlossaireCP_1.TradGlossaireCP.PiecesJointes,
				}),
		},
		hint: GlossaireCP_1.TradGlossaireCP.PiecesJointes,
	});
	return lColonnes2;
}
function _openDocumentDArticle(aDocument) {
	window.open(
		ObjetChaine_1.GChaine.creerUrlBruteLienExterne(aDocument, {
			genreRessource: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
		}),
	);
}
