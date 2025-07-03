exports.DonneesListe_DernieresEvaluations = void 0;
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetElement_1 = require("ObjetElement");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const ObjetChaine_1 = require("ObjetChaine");
const TypeFichierExterneHttpSco_1 = require("TypeFichierExterneHttpSco");
const AccessApp_1 = require("AccessApp");
class DonneesListe_DernieresEvaluations extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParamsAffichage) {
		super(aDonnees);
		this.etatUtilSco = (0, AccessApp_1.getApp)().getEtatUtilisateur();
		this.parametres = { avecCumulMatiere: false, callbackExecutionQCM: null };
		this.setParametres(aParamsAffichage);
		this.setOptions({ avecBoutonActionLigne: false, avecDeploiement: false });
	}
	setParametres(aParams) {
		Object.assign(this.parametres, aParams);
	}
	getVisible(D) {
		return this.parametres.avecCumulMatiere || !_estUneMatiere(D);
	}
	avecSelection(aParams) {
		return !_estUneMatiere(aParams.article);
	}
	avecEvenementSelectionClick(aParams) {
		return this.avecSelection(aParams);
	}
	avecEvenementSelection(aParams) {
		return this.avecSelection(aParams);
	}
	getTitreZonePrincipale(aParams) {
		const H = [];
		if (!!aParams.article) {
			if (_estUneMatiere(aParams.article)) {
				H.push(
					IE.jsx.str(
						"span",
						{ class: "ie-titre-gros" },
						aParams.article.getLibelle(),
					),
				);
			} else {
				if (
					!this.parametres.avecCumulMatiere &&
					!!aParams.article.matiere &&
					aParams.article.matiere.getLibelle() !== ""
				) {
					H.push(
						IE.jsx.str("span", null, aParams.article.matiere.getLibelle()),
					);
				}
			}
		}
		return H.join("");
	}
	getZoneGauche(aParams) {
		const H = [];
		if (!_estUneMatiere(aParams.article)) {
			const lClasses = ["date-contain"];
			let lStyle = "";
			if (!this.parametres.avecCumulMatiere) {
				lClasses.push("ie-line-color");
				lStyle = `--color-line :${aParams.article.matiere.couleur};`;
			}
			H.push(
				IE.jsx.str(
					"time",
					{
						datetime: ObjetDate_1.GDate.formatDate(
							aParams.article.date,
							"%MM-%JJ",
						),
						class: lClasses.join(" "),
						style: lStyle,
					},
					ObjetDate_1.GDate.formatDate(aParams.article.date, "%J %MMM"),
				),
			);
		} else {
			H.push(
				IE.jsx.str("span", {
					class: "ie-line-color static only-color var-height",
					style: `--color-line :${aParams.article.couleur};--var-height:2.2rem;`,
				}),
			);
		}
		return H.join("");
	}
	getInfosSuppZonePrincipale(aParams) {
		const H = [];
		if (!_estUneMatiere(aParams.article)) {
			if (
				this.etatUtilSco.pourPrimaire() &&
				aParams.article.coefficient === 0
			) {
				H.push(
					IE.jsx.str(
						"span",
						{ class: "ie-sous-titre" },
						"(",
						ObjetTraduction_1.GTraductions.getValeur(
							"evaluations.NonComptabiliseDansBilan",
						),
						")",
					),
				);
			}
			H.push(this._composePieceJointeEval(aParams.article));
		}
		return H.join("");
	}
	getZoneComplementaire(aParams) {
		const H = [];
		if (!_estUneMatiere(aParams.article)) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "eval-devoir" },
					_composeNiveauxAcquisition.call(this, aParams.article),
				),
			);
		}
		return H.join("");
	}
	getAriaLabelZoneCellule(aParams, aZone) {
		if (
			aZone ===
			ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign
				.ZoneCelluleFlatDesign.zoneComplementaire
		) {
			if (!_estUneMatiere(aParams.article)) {
				const H = [];
				if (
					aParams.article.listeNiveauxDAcquisitions &&
					aParams.article.listeNiveauxDAcquisitions.count()
				) {
					aParams.article.listeNiveauxDAcquisitions.parcourir(
						(aNiveauDAcquisition) => {
							const lNiveauDAcquisition =
								GParametres.listeNiveauxDAcquisitions.getElementParGenre(
									aNiveauDAcquisition.getGenre(),
								);
							H.push(
								Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getLibelle(
									lNiveauDAcquisition,
								),
							);
						},
					);
				}
				return H.join(", ");
			}
		}
		return "";
	}
	avecSeparateurLigneHautFlatdesign(aParams) {
		return !_estUneMatiere(aParams.article);
	}
	desactiverIndentationParente() {
		return true;
	}
	getTri() {
		const lTris = [];
		if (this.parametres.avecCumulMatiere) {
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					return _estUneMatiere(D) ? D.ordre || -1 : D.matiere.ordre || -1;
				}, Enumere_TriElement_1.EGenreTriElement.Croissant),
			);
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					return _estUneMatiere(D) ? D.getLibelle() : D.matiere.getLibelle();
				}, Enumere_TriElement_1.EGenreTriElement.Croissant),
			);
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					return _estUneMatiere(D)
						? D.serviceConcerne.getNumero()
						: D.matiere.serviceConcerne.getNumero();
				}),
			);
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					return !_estUneMatiere(D);
				}),
			);
		}
		lTris.push(
			ObjetTri_1.ObjetTri.init(
				"date",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
		);
		lTris.push(ObjetTri_1.ObjetTri.init("matiere.Libelle"));
		return lTris;
	}
	_composePieceJointeEval(aEval) {
		const H = [];
		let lDocumentJointSujet, lDocumentJointCorrige, lLienSujet, lLienCorrige;
		if (!!aEval.elmSujet) {
			lDocumentJointSujet = aEval.elmSujet;
		} else if (!!aEval.libelleSujet) {
			lDocumentJointSujet = new ObjetElement_1.ObjetElement(
				aEval.libelleSujet,
				aEval.getNumero(),
				Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
			);
		}
		if (lDocumentJointSujet) {
			lLienSujet = ObjetChaine_1.GChaine.composerUrlLienExterne({
				documentJoint: lDocumentJointSujet,
				genreRessource:
					TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.EvaluationSujet,
				libelleEcran: ObjetTraduction_1.GTraductions.getValeur("AfficherSujet"),
				class: "chips-design-liste",
			});
		}
		if (!!aEval.elmCorrige) {
			lDocumentJointCorrige = aEval.elmCorrige;
		} else if (!!aEval.libelleCorrige) {
			lDocumentJointCorrige = new ObjetElement_1.ObjetElement(
				aEval.libelleCorrige,
				aEval.getNumero(),
				Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
			);
		}
		if (lDocumentJointCorrige) {
			lLienCorrige = ObjetChaine_1.GChaine.composerUrlLienExterne({
				documentJoint: lDocumentJointCorrige,
				genreRessource:
					TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
						.EvaluationCorrige,
				libelleEcran:
					ObjetTraduction_1.GTraductions.getValeur("AfficherCorrige"),
				class: "chips-design-liste",
			});
		}
		if (lLienSujet || lLienCorrige) {
			H.push(
				`<div class="flex-contain flex-center flex-gap m-top m-bottom">${lLienSujet || ""} ${lLienCorrige || ""}</div>`,
			);
		}
		if (
			!!aEval.executionQCM &&
			!!aEval.executionQCM.fichierDispo &&
			!!aEval.executionQCM.publierCorrige &&
			this.parametres.callbackExecutionQCM
		) {
			H.push(
				IE.jsx.str(
					"ie-bouton",
					{
						class: "themeBoutonNeutre small-bt bg-white",
						"ie-model": this.jsxModelBouton.bind(this, aEval),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"ExecutionQCM.presentationCorrige.VisualiserCorrige",
					),
				),
			);
		}
		return H.join("");
	}
	jsxModelBouton(aEval) {
		return {
			event: () => {
				if (!!this.parametres && !!this.parametres.callbackExecutionQCM) {
					if (IE.estMobile) {
						if (aEval && aEval.executionQCM) {
							this.parametres.callbackExecutionQCM(aEval.executionQCM);
						}
					} else {
						this.parametres.callbackExecutionQCM(
							aEval.getNumero(),
							aEval.getGenre(),
						);
					}
				}
			},
		};
	}
}
exports.DonneesListe_DernieresEvaluations = DonneesListe_DernieresEvaluations;
function _estUneMatiere(D) {
	return D.getGenre() === Enumere_Ressource_1.EGenreRessource.Matiere;
}
function _composeNiveauxAcquisition(aEval) {
	const H = [];
	let lNiveauDAcquisition;
	if (
		aEval.listeNiveauxDAcquisitions &&
		aEval.listeNiveauxDAcquisitions.count()
	) {
		aEval.listeNiveauxDAcquisitions.parcourir((aNiveauDAcquisition) => {
			lNiveauDAcquisition =
				GParametres.listeNiveauxDAcquisitions.getElementParGenre(
					aNiveauDAcquisition.getGenre(),
				);
			H.push(
				IE.jsx.str(
					"span",
					null,
					Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
						lNiveauDAcquisition,
					),
				),
			);
		});
	}
	return H.join("");
}
