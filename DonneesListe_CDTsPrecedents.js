exports.DonneesListe_CDTsPrecedents = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
class DonneesListe_CDTsPrecedents extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aNbVisibles) {
		aDonnees.parcourir((aArticle) => {
			aArticle.estUnDeploiement = true;
			aArticle.estDeploye = false;
		});
		super(aDonnees);
		this.nbVisibles = aNbVisibles;
		this.setOptions({
			avecSelection: false,
			avecEdition: false,
			avecDeploiement: true,
			hauteurMinCellule: 27,
		});
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_CDTsPrecedents.colonnes.deploiement:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule
					.CocheDeploiement;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
	}
	getValeur(aParams) {
		const T = [];
		switch (aParams.idColonne) {
			case DonneesListe_CDTsPrecedents.colonnes.contenu: {
				if (aParams.article.estDeploye) {
					aParams.article.contenus.parcourir((aContenu) => {
						const lHtml = [_getTitreContenu(aContenu) + "<br/>"];
						if (aContenu.descriptif) {
							lHtml.push(
								'<div class="PetitEspaceHaut">' +
									aContenu.descriptif +
									"</div>",
							);
						}
						if (aContenu.listeQCMs && aContenu.listeQCMs.length > 0) {
							lHtml.push(
								'<span class="Gras EspaceHaut">',
								ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.Contenu_QCMAssocie",
								),
								"</span>",
							);
							lHtml.push(
								'<ul class="EspaceGauche PetitEspaceHaut PetitEspaceBas">',
							);
							aContenu.listeQCMs.forEach((aLibelle) => {
								lHtml.push("<li>", aLibelle, "</li>");
							});
							lHtml.push("</ul>");
						}
						T.push(lHtml.join(""));
					});
				} else {
					if (aParams.article.contenus && aParams.article.contenus.get(0)) {
						T.push(_getTitreContenu(aParams.article.contenus.get(0)));
					}
				}
				let lSansContenu = false;
				const lAvecElementsProg =
					aParams.article.elementsProgrammeCDT &&
					aParams.article.elementsProgrammeCDT.count() > 0;
				if (
					!aParams.article.contenus ||
					aParams.article.contenus.count() === 0
				) {
					lSansContenu = true;
					T.push(
						'<span class="',
						lAvecElementsProg ? "Gras" : "Italique",
						'">',
						lAvecElementsProg
							? ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.ElementsProgramme",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.SansContenu",
								),
						"</span>",
					);
				}
				if (aParams.article.estDeploye && lAvecElementsProg) {
					if (!lSansContenu) {
						T.push(
							"<br/>",
							'<div class="Gras">',
							ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.ElementsProgramme",
							),
							"</div>",
						);
					}
					T.push('<ul class="EspaceGauche PetitEspaceHaut PetitEspaceBas">');
					aParams.article.elementsProgrammeCDT.parcourir((aElement) => {
						T.push("<li>", aElement.getLibelle(), "</li>");
					});
					T.push("</ul>");
				}
				return T.join("");
			}
			case DonneesListe_CDTsPrecedents.colonnes.taf:
				if (aParams.article.tafs && aParams.article.tafs.count() > 0) {
					T.push(
						'<span class="Italique">',
						aParams.article.tafs.count() === 1
							? ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.TravailAFaire",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.TravauxAFaire",
								),
						"</span>",
					);
					if (aParams.article.estDeploye) {
						aParams.article.tafs.parcourir((aTaf) => {
							if (aTaf.descriptif) {
								T.push(
									'<div class="EspaceHaut">' + aTaf.descriptif + "</div><br>",
								);
							}
						});
					}
				}
				return T.join("");
		}
		return "";
	}
	getClassCelluleConteneur(aParams) {
		return aParams.article.estDeploye ? "" : "AvecMain";
	}
	getStyle(aParams) {
		const lStyles = [];
		if (aParams.article && aParams.article.estDeploye) {
			lStyles.push("padding-top:3px;");
		}
		return lStyles.join("");
	}
	getTooltip(aParams) {
		if (aParams.idColonne === DonneesListe_CDTsPrecedents.colonnes.contenu) {
			return ObjetChaine_1.GChaine.format(
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.HintCDTRecapitulatif",
				),
				[
					ObjetDate_1.GDate.formatDate(aParams.article.date, "%JJ/%MM/%AAAA"),
					aParams.article.strPublics,
					aParams.article.strProfs,
				],
			);
		}
		return "";
	}
	estVisible(J) {
		return J >= this.Donnees.count() - this.nbVisibles;
	}
}
exports.DonneesListe_CDTsPrecedents = DonneesListe_CDTsPrecedents;
(function (DonneesListe_CDTsPrecedents) {
	let colonnes;
	(function (colonnes) {
		colonnes["deploiement"] = "deploiement";
		colonnes["contenu"] = "contenu";
		colonnes["taf"] = "taf";
	})(
		(colonnes =
			DonneesListe_CDTsPrecedents.colonnes ||
			(DonneesListe_CDTsPrecedents.colonnes = {})),
	);
})(
	DonneesListe_CDTsPrecedents ||
		(exports.DonneesListe_CDTsPrecedents = DonneesListe_CDTsPrecedents = {}),
);
function _getTitreContenu(aContenu) {
	const T = [];
	if (aContenu.categorie && aContenu.categorie.getLibelle()) {
		T.push(aContenu.categorie.getLibelle());
	}
	if (aContenu.getLibelle()) {
		T.push(aContenu.getLibelle());
	}
	let lClass;
	if (T.length === 0) {
		T.push(ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.SansTitre"));
		lClass = "Italique";
	} else {
		lClass = "Gras";
	}
	return '<span class="' + lClass + '">' + T.join(" -- ") + "</span>";
}
