exports.DonneesListe_AppreciationsBulletinParEleve = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const TypeGenreLigneRecapDevoisEvalsEleve_1 = require("TypeGenreLigneRecapDevoisEvalsEleve");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const nombreCompetenceMax = 4;
class DonneesListe_AppreciationsBulletinParEleve extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aListeColonnesDevoirsEval, aOptionsAffichageListe) {
		super(aDonnees);
		this.ListeColonnesDevoirsEval = aListeColonnesDevoirsEval;
		this.setOptions({
			avecSelection: false,
			avecEdition: false,
			avecSuppression: false,
			avecDeploiement: true,
			avecTri: false,
			avecEvnt_KeyUpListe: false,
		});
		this.optionsAffichageListe = aOptionsAffichageListe;
	}
	static getDevoir(aParams) {
		if (aParams.article.listeDevoirs === undefined) {
			return null;
		}
		for (
			let lNumDevoir = 0;
			lNumDevoir < aParams.article.listeDevoirs.count();
			lNumDevoir++
		) {
			if (
				aParams.idColonne ===
				DonneesListe_AppreciationsBulletinParEleve.colonnes.devoir + lNumDevoir
			) {
				return aParams.article.listeDevoirs.get(lNumDevoir);
			}
		}
		return null;
	}
	static getPeriode(aParams) {
		if (aParams.article.listeMoyennePeriode === undefined) {
			return null;
		}
		for (
			let lNumPeriode = 0;
			lNumPeriode < aParams.article.listeMoyennePeriode.count();
			lNumPeriode++
		) {
			if (
				aParams.idColonne ===
				DonneesListe_AppreciationsBulletinParEleve.colonnes.periode +
					lNumPeriode
			) {
				return aParams.article.listeMoyennePeriode.get(lNumPeriode);
			}
		}
		return null;
	}
	avecEvenementSelection() {
		return false;
	}
	avecEvenementSelectionClick() {
		return true;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_AppreciationsBulletinParEleve.colonnes.genreLigne: {
				return aParams.article.getLibelle();
			}
			case DonneesListe_AppreciationsBulletinParEleve.colonnes
				.moyenneAnnuelle: {
				return aParams.article.moyenneAnnuelle;
			}
			default: {
				const lDevoir =
					DonneesListe_AppreciationsBulletinParEleve.getDevoir(aParams);
				if (lDevoir) {
					if (
						aParams.article.getGenre() ===
						TypeGenreLigneRecapDevoisEvalsEleve_1
							.TypeGenreLigneRecapDevoisEvalsEleve.LigneElementComp
					) {
						if (
							lDevoir.getGenre() === Enumere_Ressource_1.EGenreRessource.Devoir
						) {
							return "";
						} else if (
							lDevoir.getGenre() ===
							Enumere_Ressource_1.EGenreRessource.Evaluation
						) {
							const lContenuCellule = [];
							let lAvecTroisPoints = false;
							if (lDevoir.listeNiveaux) {
								if (GParametres.listeNiveauxDAcquisitions) {
									const nbrDevoir = lDevoir.listeNiveaux.count();
									lAvecTroisPoints =
										!this.optionsAffichageListe.colonneElargie &&
										nbrDevoir > nombreCompetenceMax;
									let lNiveau = lAvecTroisPoints
										? nbrDevoir - nombreCompetenceMax
										: 0;
									for (; lNiveau < nbrDevoir; lNiveau++) {
										const lNiveauDAcquisition =
											GParametres.listeNiveauxDAcquisitions.getElementParNumero(
												lDevoir.listeNiveaux.getNumero(lNiveau),
											);
										lContenuCellule.push(
											Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
												lNiveauDAcquisition,
												{ avecTitle: false },
											),
										);
									}
								}
							}
							if (lAvecTroisPoints) {
								lContenuCellule.unshift('<span class="Gras">...</span>');
							}
							return lContenuCellule.join(" ");
						}
					}
					if (
						aParams.article.getGenre() ===
						TypeGenreLigneRecapDevoisEvalsEleve_1
							.TypeGenreLigneRecapDevoisEvalsEleve.LigneTitreEval
					) {
						return lDevoir.getGenre() ===
							Enumere_Ressource_1.EGenreRessource.Evaluation
							? lDevoir.getLibelle()
							: "";
					} else {
						return lDevoir.note;
					}
				}
				const lPeriode =
					DonneesListe_AppreciationsBulletinParEleve.getPeriode(aParams);
				if (lPeriode) {
					return lPeriode.note;
				}
			}
		}
		return "";
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_AppreciationsBulletinParEleve.colonnes.genreLigne:
				return undefined;
			case DonneesListe_AppreciationsBulletinParEleve.colonnes.moyenneAnnuelle:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Note;
			default:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
	}
	getClass(aParams) {
		const T = [];
		if (_estColAvecGras.call(this, aParams)) {
			T.push("Gras");
		}
		if (_estColAvecAlignementDroit.call(this, aParams)) {
			T.push("AlignementDroit");
		}
		T.push("ie-ellipsis");
		return T.join(" ");
	}
	getColonneDeFusion(aParams) {
		if (
			aParams.article.getGenre() ===
				TypeGenreLigneRecapDevoisEvalsEleve_1
					.TypeGenreLigneRecapDevoisEvalsEleve.LigneTitreEval &&
			(aParams.idColonne ===
				DonneesListe_AppreciationsBulletinParEleve.colonnes.moyenneAnnuelle ||
				aParams.idColonne.startsWith(
					DonneesListe_AppreciationsBulletinParEleve.colonnes.periode,
				))
		) {
			return DonneesListe_AppreciationsBulletinParEleve.colonnes.genreLigne;
		}
		return null;
	}
	getCouleurCellule(aParams) {
		return aParams.article.estUnDeploiement
			? ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Deploiement
			: aParams.idColonne ===
					DonneesListe_AppreciationsBulletinParEleve.colonnes.genreLigne
				? ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Fixe
				: ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Gris;
	}
	avecImageSurColonneDeploiement(aParams) {
		return (
			aParams.article.estUnDeploiement &&
			aParams.idColonne ===
				DonneesListe_AppreciationsBulletinParEleve.colonnes.genreLigne
		);
	}
	avecDeploiementSurColonne(aParams) {
		return (
			aParams.article.estUnDeploiement &&
			[
				DonneesListe_AppreciationsBulletinParEleve.colonnes.genreLigne,
				DonneesListe_AppreciationsBulletinParEleve.colonnes.moyenneAnnuelle,
			].includes(aParams.idColonne)
		);
	}
	getTooltip(aParams) {
		if (
			aParams.article.getGenre() ===
			TypeGenreLigneRecapDevoisEvalsEleve_1.TypeGenreLigneRecapDevoisEvalsEleve
				.LigneElementComp
		) {
			const lDevoir =
				DonneesListe_AppreciationsBulletinParEleve.getDevoir(aParams);
			if (lDevoir) {
				if (
					aParams.article.getGenre() ===
					TypeGenreLigneRecapDevoisEvalsEleve_1
						.TypeGenreLigneRecapDevoisEvalsEleve.LigneElementComp
				) {
					if (
						lDevoir.getGenre() === Enumere_Ressource_1.EGenreRessource.Devoir
					) {
						return "";
					} else if (
						lDevoir.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.Evaluation
					) {
						return _hintCompetence(lDevoir);
					}
				}
			}
		} else if (
			aParams.article.getGenre() ===
			TypeGenreLigneRecapDevoisEvalsEleve_1.TypeGenreLigneRecapDevoisEvalsEleve
				.LigneTitreEval
		) {
			const lDevoir =
				DonneesListe_AppreciationsBulletinParEleve.getDevoir(aParams);
			if (
				lDevoir &&
				lDevoir.getGenre() === Enumere_Ressource_1.EGenreRessource.Evaluation
			) {
				return lDevoir.getLibelle();
			}
		}
		return "";
	}
}
exports.DonneesListe_AppreciationsBulletinParEleve =
	DonneesListe_AppreciationsBulletinParEleve;
(function (DonneesListe_AppreciationsBulletinParEleve) {
	let colonnes;
	(function (colonnes) {
		colonnes["genreLigne"] = "genre ligne";
		colonnes["moyenneAnnuelle"] = "moyenne annuelle";
		colonnes["periode"] = "periode";
		colonnes["devoir"] = "devoir";
	})(
		(colonnes =
			DonneesListe_AppreciationsBulletinParEleve.colonnes ||
			(DonneesListe_AppreciationsBulletinParEleve.colonnes = {})),
	);
})(
	DonneesListe_AppreciationsBulletinParEleve ||
		(exports.DonneesListe_AppreciationsBulletinParEleve =
			DonneesListe_AppreciationsBulletinParEleve =
				{}),
);
function _hintCompetence(lDevoir) {
	const lContenuCellule = [];
	if (lDevoir.listeNiveaux) {
		if (GParametres.listeNiveauxDAcquisitions) {
			lContenuCellule.push("<div>");
			lContenuCellule.push(
				'<span class="Gras">',
				lDevoir.getLibelle(),
				"</span>",
			);
			for (let lNiveau = 0; lNiveau < lDevoir.listeNiveaux.count(); lNiveau++) {
				const lNiveauDAcquisition = lDevoir.listeNiveaux.get(lNiveau);
				const lCompetence = lNiveauDAcquisition.competence;
				const lMaitrise = lNiveauDAcquisition.getLibelle();
				const lImgPastille =
					Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
						GParametres.listeNiveauxDAcquisitions.getElementParNumero(
							lNiveauDAcquisition.getNumero(),
						),
						{ avecTitle: false },
					);
				lContenuCellule.push(
					'<div class="EspaceHaut">',
					lImgPastille,
					" : ",
					lMaitrise,
					" - ",
					lCompetence,
					"</div>",
				);
			}
			lContenuCellule.push("</div>");
		}
	}
	return lContenuCellule.join("");
}
function _estColAvecGras(aParams) {
	return (
		[
			DonneesListe_AppreciationsBulletinParEleve.colonnes.genreLigne,
			DonneesListe_AppreciationsBulletinParEleve.colonnes.moyenneAnnuelle,
		].includes(aParams.idColonne) ||
		aParams.article.getGenre() ===
			TypeGenreLigneRecapDevoisEvalsEleve_1.TypeGenreLigneRecapDevoisEvalsEleve
				.LigneNote ||
		aParams.article.getGenre() ===
			TypeGenreLigneRecapDevoisEvalsEleve_1.TypeGenreLigneRecapDevoisEvalsEleve
				.LigneTitreEval
	);
}
function _estColAvecAlignementDroit(aParams) {
	return (
		aParams.idColonne !==
		DonneesListe_AppreciationsBulletinParEleve.colonnes.genreLigne
	);
}
