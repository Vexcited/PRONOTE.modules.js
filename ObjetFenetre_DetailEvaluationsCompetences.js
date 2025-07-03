exports.ObjetFenetre_DetailEvaluationsCompetences = void 0;
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const TypeGenreValidationCompetence_1 = require("TypeGenreValidationCompetence");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDate_1 = require("ObjetDate");
var TypeLigneDetailEvaluationsCompetences;
(function (TypeLigneDetailEvaluationsCompetences) {
	TypeLigneDetailEvaluationsCompetences[
		(TypeLigneDetailEvaluationsCompetences["Matiere"] = 0)
	] = "Matiere";
	TypeLigneDetailEvaluationsCompetences[
		(TypeLigneDetailEvaluationsCompetences["Evaluation"] = 1)
	] = "Evaluation";
	TypeLigneDetailEvaluationsCompetences[
		(TypeLigneDetailEvaluationsCompetences["Competence"] = 2)
	] = "Competence";
})(
	TypeLigneDetailEvaluationsCompetences ||
		(TypeLigneDetailEvaluationsCompetences = {}),
);
class ObjetFenetre_DetailEvaluationsCompetences extends ObjetFenetre_1.ObjetFenetre {
	constructor() {
		super(...arguments);
		this.idStrDomaine = GUID_1.GUID.getId();
	}
	construireInstances() {
		this.identListeEvaluations = this.add(
			ObjetListe_1.ObjetListe,
			this._surEvenementListe,
		);
	}
	composeContenu() {
		const T = [];
		T.push('<div class="EspaceBas10 hide" id="', this.idStrDomaine, '"></div>');
		T.push(
			'<div id="',
			this.getNomInstance(this.identListeEvaluations),
			'" style="width: 100%; height: 100%"></div>',
		);
		return T.join("");
	}
	getTitreFenetreParDefaut(aEleve, aElt) {
		const lTitreFenetre = [];
		if (!!aEleve) {
			lTitreFenetre.push(aEleve.getLibelle());
		}
		let lLibelleSuite;
		if (!!aElt.service) {
			lLibelleSuite = aElt.service.getLibelle
				? aElt.service.getLibelle()
				: aElt.service;
		} else {
			lLibelleSuite = aElt.getLibelle();
		}
		if (lLibelleSuite) {
			lTitreFenetre.push(lLibelleSuite);
		}
		return lTitreFenetre.join(" - ");
	}
	setDonnees(aElt, aJSON, aParametres) {
		this.afficher();
		let lTitreFenetre = null;
		if (!!aParametres && !!aParametres.titreFenetre) {
			lTitreFenetre = aParametres.titreFenetre;
		}
		if (!lTitreFenetre) {
			lTitreFenetre = aElt.getLibelle();
		}
		this.setOptionsFenetre({ titre: lTitreFenetre });
		let lLibelleComplementaire;
		if (!!aParametres && aParametres.libelleComplementaire) {
			lLibelleComplementaire = aParametres.libelleComplementaire;
		} else if (
			aElt.getGenre() === TypeLigneDetailEvaluationsCompetences.Competence &&
			!!aElt.strElmtCompetence
		) {
			lLibelleComplementaire = aElt.strElmtCompetence;
		}
		if (!!lLibelleComplementaire) {
			ObjetHtml_1.GHtml.setHtml(
				this.idStrDomaine.escapeJQ(),
				lLibelleComplementaire,
			);
			$("#" + this.idStrDomaine.escapeJQ()).removeClass("hide");
			const lHauteurDomaine = $(
				"#" + this.idStrDomaine.escapeJQ(),
			).outerHeight();
			$("#" + this.getNomInstance(this.identListeEvaluations).escapeJQ()).css(
				"height",
				"calc(100% - " + lHauteurDomaine + "px)",
			);
		} else {
			$("#" + this.idStrDomaine.escapeJQ()).addClass("hide");
			$("#" + this.getNomInstance(this.identListeEvaluations).escapeJQ()).css(
				"height",
				"100%",
			);
		}
		const lListePourAffichage = new ObjetListeElements_1.ObjetListeElements();
		if (!!aJSON.listeLignes) {
			let lEltPereCourant0;
			let lEltPereCourant1;
			aJSON.listeLignes.parcourir((aLigneJSON) => {
				if (
					aLigneJSON.getGenre() ===
					TypeLigneDetailEvaluationsCompetences.Matiere
				) {
					lEltPereCourant0 = aLigneJSON;
				} else if (
					aLigneJSON.getGenre() ===
					TypeLigneDetailEvaluationsCompetences.Evaluation
				) {
					lEltPereCourant1 = aLigneJSON;
					if (!!lEltPereCourant0) {
						aLigneJSON.pere = lEltPereCourant0;
						lEltPereCourant0.estUnDeploiement = true;
						lEltPereCourant0.estDeploye = true;
					}
				} else {
					if (!!lEltPereCourant1) {
						aLigneJSON.pere = lEltPereCourant1;
						lEltPereCourant1.estUnDeploiement = true;
						lEltPereCourant1.estDeploye = true;
					}
				}
				lListePourAffichage.addElement(aLigneJSON);
			});
		}
		const lObjetListe = this.getInstance(this.identListeEvaluations);
		if (!!aParametres && aParametres.affichageListeSimplifiee) {
			this._initListeColonnesAffichageSimplifie(lObjetListe);
		} else {
			this._initListeColonnesDefault(lObjetListe, aJSON.titreColonneEvaluation);
		}
		lObjetListe.setDonnees(
			new DonneesListe_DetailEvaluationsCompetences(lListePourAffichage, {
				callbackRemplirMenuContextuel:
					this._remplirMenuContextuelListe.bind(this),
			}),
		);
	}
	surValidation(aNumeroBouton) {
		const lListeElementsModifies =
			new ObjetListeElements_1.ObjetListeElements();
		const lListeElementsComp = this.getInstance(
			this.identListeEvaluations,
		).getListeArticles();
		if (!!lListeElementsComp) {
			lListeElementsComp.parcourir((D) => {
				if (!!D && D.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun) {
					lListeElementsModifies.addElement(D);
				}
			});
		}
		this.fermer();
		if (!!lListeElementsModifies && lListeElementsModifies.count() > 0) {
			this.callback.appel(aNumeroBouton, lListeElementsModifies);
		}
	}
	_initListeColonnesDefault(aInstance, aTitreColonneEvaluation) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_DetailEvaluationsCompetences.genreColonne.evaluation,
			titre: aTitreColonneEvaluation,
			taille: "100%",
		});
		lColonnes.push({
			id: DonneesListe_DetailEvaluationsCompetences.genreColonne.coefficient,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"competences.colonne.coef",
			),
			taille: 50,
		});
		lColonnes.push({
			id: DonneesListe_DetailEvaluationsCompetences.genreColonne.niveauAcqu,
			titre: ObjetTraduction_1.GTraductions.getValeur("competences.niveau"),
			taille: 50,
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.deployer }],
			ariaLabel: this.optionsFenetre.titre,
		});
	}
	_initListeColonnesAffichageSimplifie(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_DetailEvaluationsCompetences.genreColonne.dateEvaluation,
			titre: "",
			taille: 70,
		});
		lColonnes.push({
			id: DonneesListe_DetailEvaluationsCompetences.genreColonne.evaluation,
			titre: "",
			taille: "100%",
		});
		lColonnes.push({
			id: DonneesListe_DetailEvaluationsCompetences.genreColonne.niveauAcqu,
			titre: "",
			taille: 50,
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			ariaLabel: this.optionsFenetre.titre,
		});
	}
	_surEvenementListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				if (
					aParametres.idColonne ===
					DonneesListe_DetailEvaluationsCompetences.genreColonne.niveauAcqu
				) {
					aParametres.ouvrirMenuContextuel();
				}
				break;
		}
	}
	_remplirMenuContextuelListe(aParametres) {
		const lAvecDispense = true;
		UtilitaireCompetences_1.TUtilitaireCompetences.initMenuContextuelNiveauAcquisition(
			{
				instance: this,
				menuContextuel: aParametres.menuContextuel,
				genreChoixValidationCompetence:
					TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
						.tGVC_Competence,
				callbackNiveau: this._surSelectionNiveauAcquisition.bind(
					this,
					aParametres.article,
				),
				avecDispense: lAvecDispense,
			},
		);
	}
	_surSelectionNiveauAcquisition(aArticle, aNiveau) {
		if (!!aArticle) {
			aArticle.niveauAcqu = aNiveau;
			aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.getInstance(this.identListeEvaluations).actualiser(true, true);
		}
	}
}
exports.ObjetFenetre_DetailEvaluationsCompetences =
	ObjetFenetre_DetailEvaluationsCompetences;
class DonneesListe_DetailEvaluationsCompetences extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParams) {
		super(aDonnees);
		this.param = Object.assign(
			{ callbackRemplirMenuContextuel: null },
			aParams,
		);
		this.setOptions({
			avecSelection: false,
			avecSuppression: false,
			avecDeploiement: true,
			avecTri: false,
		});
	}
	getCouleurCellule(aParams) {
		if (!!aParams.article && aParams.article.estUnDeploiement) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Deploiement;
		}
	}
	avecImageSurColonneDeploiement(aParams) {
		return (
			aParams.idColonne ===
			DonneesListe_DetailEvaluationsCompetences.genreColonne.evaluation
		);
	}
	avecEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_DetailEvaluationsCompetences.genreColonne.niveauAcqu:
				return !!aParams.article.estEditable;
		}
		return false;
	}
	avecEvenementEdition(aParams) {
		return this.avecEdition(aParams);
	}
	avecMenuContextuel() {
		return false;
	}
	remplirMenuContextuel(aParametres) {
		this.param.callbackRemplirMenuContextuel(aParametres);
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_DetailEvaluationsCompetences.genreColonne
				.dateEvaluation:
				return !!aParams.article.dateEvaluation
					? ObjetDate_1.GDate.formatDate(
							aParams.article.dateEvaluation,
							"%JJ/%MM/%AAAA",
						)
					: "";
			case DonneesListe_DetailEvaluationsCompetences.genreColonne.evaluation:
				return aParams.article.getLibelle();
			case DonneesListe_DetailEvaluationsCompetences.genreColonne.coefficient:
				return aParams.article.strCoef ? aParams.article.strCoef : "";
			case DonneesListe_DetailEvaluationsCompetences.genreColonne.niveauAcqu: {
				const lHtmlNivAcquisition = [];
				if (
					aParams.article.getGenre() ===
						TypeLigneDetailEvaluationsCompetences.Competence &&
					!!aParams.article.niveauAcqu
				) {
					const lNiveauAcqui = aParams.article.niveauAcqu;
					const lNiveauAcquiGlobal =
						GParametres.listeNiveauxDAcquisitions.getElementParGenre(
							aParams.article.niveauAcqu.getGenre(),
						);
					lHtmlNivAcquisition.push(
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
							lNiveauAcquiGlobal,
						),
					);
					if (!!lNiveauAcqui.observation) {
						lHtmlNivAcquisition.push(
							IE.jsx.str("i", {
								style: "position:absolute; right:0px; bottom:0px;",
								class: " icon_comment",
								role: "presentation",
							}),
						);
					}
				}
				return lHtmlNivAcquisition.join("");
			}
		}
		return "";
	}
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_DetailEvaluationsCompetences.genreColonne.coefficient:
				return !!aParams.article ? aParams.article.hintCoef : "";
			case DonneesListe_DetailEvaluationsCompetences.genreColonne.niveauAcqu: {
				const lHintNiveauAcqui = [];
				if (
					aParams.article.getGenre() ===
						TypeLigneDetailEvaluationsCompetences.Competence &&
					!!aParams.article.niveauAcqu
				) {
					const lNiveauAcqui = aParams.article.niveauAcqu;
					const lNiveauDAcquisitionGlobal =
						GParametres.listeNiveauxDAcquisitions.getElementParNumero(
							lNiveauAcqui.getNumero(),
						);
					if (!!lNiveauDAcquisitionGlobal) {
						lHintNiveauAcqui.push(
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getLibelle(
								lNiveauDAcquisitionGlobal,
							),
						);
					}
					if (!!lNiveauAcqui.observation) {
						const lObs = lNiveauAcqui.observation.replace(/\n/g, "<br/>");
						if (lHintNiveauAcqui.length > 0) {
							lHintNiveauAcqui.push("<br />");
						}
						lHintNiveauAcqui.push(lObs);
						if (!!lNiveauAcqui.observationPubliee) {
							lHintNiveauAcqui.push(
								" (",
								ObjetTraduction_1.GTraductions.getValeur(
									"competences.PublieSurEspaceParent",
								),
								")",
							);
						}
					}
				}
				return lHintNiveauAcqui.join("");
			}
		}
		return "";
	}
	getClass(aParams) {
		const lClasses = [];
		if (!!aParams.article && aParams.article.estUnDeploiement) {
			lClasses.push("Gras");
			lClasses.push("AvecMain");
		}
		switch (aParams.idColonne) {
			case DonneesListe_DetailEvaluationsCompetences.genreColonne.evaluation:
				if (aParams.article && aParams.article.estHistorique) {
					lClasses.push("Italique");
				}
				break;
			case DonneesListe_DetailEvaluationsCompetences.genreColonne.coefficient:
				lClasses.push("AlignementDroit");
				break;
			case DonneesListe_DetailEvaluationsCompetences.genreColonne
				.dateEvaluation:
			case DonneesListe_DetailEvaluationsCompetences.genreColonne.niveauAcqu:
				lClasses.push("AlignementMilieu");
				break;
		}
		return lClasses.join(" ");
	}
	getTypeValeur(aParams) {
		if (
			aParams.idColonne ===
			DonneesListe_DetailEvaluationsCompetences.genreColonne.niveauAcqu
		) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
}
(function (DonneesListe_DetailEvaluationsCompetences) {
	let genreColonne;
	(function (genreColonne) {
		genreColonne["dateEvaluation"] = "DetailEvalComp_dateEvaluation";
		genreColonne["evaluation"] = "DetailEvalComp_evaluation";
		genreColonne["coefficient"] = "DetailEvalComp_coefficient";
		genreColonne["niveauAcqu"] = "DetailEvalComp_niveau";
	})(
		(genreColonne =
			DonneesListe_DetailEvaluationsCompetences.genreColonne ||
			(DonneesListe_DetailEvaluationsCompetences.genreColonne = {})),
	);
})(
	DonneesListe_DetailEvaluationsCompetences ||
		(DonneesListe_DetailEvaluationsCompetences = {}),
);
