exports.DonneesListe_RecapitulatifExportLSU = void 0;
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTri_1 = require("ObjetTri");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const TypeColonneRecapExportLSU_1 = require("TypeColonneRecapExportLSU");
const TypeExportabiliteLSU_1 = require("TypeExportabiliteLSU");
const TypeGenreAppreciation_1 = require("TypeGenreAppreciation");
class DonneesListe_RecapitulatifExportLSU extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParams) {
		super(aDonnees);
		const lApplicationSco = GApplication;
		this.parametresSco = lApplicationSco.getObjetParametres();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
		this.setOptions({ avecSuppression: false, editionApresSelection: false });
		this.param = Object.assign({ uniquementNonExportables: false }, aParams);
	}
	avecMenuContextuel() {
		return false;
	}
	autoriserChaineVideSurEdition() {
		return true;
	}
	getVisible(D) {
		let lEstVisible = true;
		if (this.param.uniquementNonExportables) {
			lEstVisible =
				D.exportable ===
				TypeExportabiliteLSU_1.TypeExportabiliteLSU.telsu_NonExportable;
		}
		return lEstVisible;
	}
	getClass(aParams) {
		if (this.isColonnePilierDeCompetence(aParams.idColonne)) {
			return "AlignementMilieu";
		} else {
			switch (parseInt(aParams.idColonne)) {
				case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Diagnostic:
				case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Sconet:
				case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Niveau:
				case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Classe:
				case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Onde:
				case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Mef:
				case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_CodeSiecle:
				case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
					.tcrl_ElementsTravailles:
				case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
					.tcrl_CompetencesEvaluees:
				case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_DateCC:
				case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
					.tcrl_CompetencesNumeriques:
				case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
					.tcrl_ParcoursEducatif:
				case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_BilanComplet:
					return "AlignementMilieu";
				case TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
					.tcrl_DomainesRenseignes:
					return "AlignementDroit";
			}
		}
		return "";
	}
	getClassCelluleConteneur() {
		return "AlignementHaut";
	}
	setParametres(aOptions) {
		$.extend(true, this.param, aOptions);
	}
	avecEdition(aParams) {
		let lObjetElement;
		const lIdColonne = parseInt(aParams.idColonne);
		if (
			lIdColonne ===
			TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
				.tcrl_EnseignementDeComplement
		) {
			lObjetElement = this.getObjetElementDeLaCellule(
				aParams.article,
				lIdColonne,
			);
			if (!!lObjetElement) {
				return lObjetElement.estEditable;
			}
		} else if (
			lIdColonne ===
			TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Objectifs
		) {
			lObjetElement = this.getObjetElementDeLaCellule(
				aParams.article,
				TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
					.tcrl_EnseignementDeComplement,
			);
			if (!!lObjetElement && !!lObjetElement.valeur) {
				return lObjetElement.estEditable;
			}
		} else if (
			lIdColonne ===
			TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_LangueRegionale
		) {
			lObjetElement = this.getObjetElementDeLaCellule(
				aParams.article,
				lIdColonne,
			);
			if (!!lObjetElement) {
				return lObjetElement.estEditable;
			}
		} else if (
			lIdColonne ===
			TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
				.tcrl_NiveauLangueRegionale
		) {
			lObjetElement = this.getObjetElementDeLaCellule(
				aParams.article,
				TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_LangueRegionale,
			);
			if (!!lObjetElement && !!lObjetElement.valeur) {
				return lObjetElement.estEditable;
			}
		} else if (this.isColonnePilierDeCompetence(aParams.idColonne)) {
			lObjetElement = this.getObjetElementDeLaCellule(
				aParams.article,
				lIdColonne,
				this.getIndexPilierDeCompetence(aParams.idColonne),
			);
			if (!!lObjetElement) {
				return lObjetElement.estEditable;
			}
		} else if (
			lIdColonne ===
			TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
				.tcrl_AppreciationFinDeCycle
		) {
			lObjetElement = this.getObjetElementDeLaCellule(
				aParams.article,
				lIdColonne,
			);
			if (!!lObjetElement) {
				return lObjetElement.estEditable;
			}
		}
		return false;
	}
	avecEvenementEdition(aParams) {
		if (
			parseInt(aParams.idColonne) ===
			TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
				.tcrl_AppreciationFinDeCycle
		) {
			return false;
		}
		return this.avecEdition(aParams);
	}
	avecEvenementSelection() {
		return true;
	}
	surEdition(aParams, V) {
		if (
			parseInt(aParams.idColonne) ===
			TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
				.tcrl_AppreciationFinDeCycle
		) {
			const lObjetElementAppreciation = this.getObjetElementDeLaCellule(
				aParams.article,
				TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
					.tcrl_AppreciationFinDeCycle,
			);
			lObjetElementAppreciation.valeur = V;
			lObjetElementAppreciation.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
	}
	getControleCaracteresInput(aParams) {
		if (
			parseInt(aParams.idColonne) ===
			TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
				.tcrl_AppreciationFinDeCycle
		) {
			return {
				tailleMax: this.parametresSco.getTailleMaxAppreciationParEnumere(
					TypeGenreAppreciation_1.TypeGenreAppreciation.GA_BilanAnnuel_Generale,
				),
			};
		}
		return null;
	}
	isColonnePilierDeCompetence(aIdColonne) {
		return (
			aIdColonne &&
			aIdColonne.indexOf(
				TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_SocleCommun.toString(),
			) === 0
		);
	}
	getIndexPilierDeCompetence(aIdColonne) {
		return parseInt(aIdColonne.substring(aIdColonne.indexOf("_") + 1));
	}
	getValeur(aParams) {
		const H = [];
		let lObjetElement = null;
		const lStringIdColonne = aParams.idColonne;
		if (this.isColonnePilierDeCompetence(aParams.idColonne)) {
			lObjetElement = this.getObjetElementDeLaCellule(
				aParams.article,
				lStringIdColonne,
				this.getIndexPilierDeCompetence(aParams.idColonne),
			);
			if (
				lObjetElement &&
				lObjetElement.valeur &&
				lObjetElement.valeur.getGenre() !== 0
			) {
				const lNiveau =
					GParametres.listeNiveauxDAcquisitions.getElementParGenre(
						lObjetElement.valeur.getGenre(),
					);
				H.push(
					Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
						lNiveau,
					),
				);
			}
		} else {
			lObjetElement = this.getObjetElementDeLaCellule(
				aParams.article,
				lStringIdColonne,
			);
			if (lObjetElement) {
				if (!!aParams.surEdition) {
					return lObjetElement.valeur || "";
				}
				const lIdColonne = parseInt(lStringIdColonne);
				let lClasse = "",
					lStyle = "",
					lLibelle = "";
				if (
					lIdColonne ===
					TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Diagnostic
				) {
					let lEleveEstExportable = aParams.article.exportable;
					if (this.etatUtilisateurSco.pourPrimaire()) {
						if (
							lEleveEstExportable !==
							TypeExportabiliteLSU_1.TypeExportabiliteLSU.telsu_NonExportable
						) {
							lEleveEstExportable =
								TypeExportabiliteLSU_1.TypeExportabiliteLSU.telsu_Exportable;
						}
					}
					if (
						lEleveEstExportable ===
						TypeExportabiliteLSU_1.TypeExportabiliteLSU.telsu_Exportable
					) {
						lClasse += "Image_CoursExportSTSExportable";
					} else if (
						lEleveEstExportable ===
						TypeExportabiliteLSU_1.TypeExportabiliteLSU
							.telsu_ExportableAvecAvertissement
					) {
						lClasse += "Image_CoursExportExportableConditions";
					} else if (
						lEleveEstExportable ===
						TypeExportabiliteLSU_1.TypeExportabiliteLSU.telsu_Partiellement
					) {
						lClasse += "Image_STSPartiellementExportable";
					} else if (
						lEleveEstExportable ===
						TypeExportabiliteLSU_1.TypeExportabiliteLSU.telsu_NonExportable
					) {
						lClasse += "Image_CoursExportSTSNonExportable";
					}
					lClasse += " InlineBlock";
				} else if (
					lIdColonne ===
						TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
							.tcrl_BilanComplet ||
					lIdColonne ===
						TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
							.tcrl_CompetencesNumeriques
				) {
					if (!!lObjetElement.valeur) {
						lClasse += "Image_" + lObjetElement.valeur;
						lClasse += " InlineBlock";
					} else {
						lLibelle = "-";
					}
				} else {
					if (lObjetElement.couleur) {
						lStyle = "color: " + lObjetElement.couleur + ";";
					}
					lLibelle = lObjetElement.valeur;
				}
				H.push(
					"<span",
					lClasse ? ' class="' + lClasse + '"' : "",
					lStyle ? ' style="' + lStyle + '"' : "",
					">",
					lLibelle ? lLibelle : "",
					"</span>",
				);
			}
		}
		return H.join("");
	}
	getHintHtmlForce(aParams) {
		if (!this.isColonnePilierDeCompetence(aParams.idColonne)) {
			const lObjetElement = this.getObjetElementDeLaCellule(
				aParams.article,
				aParams.idColonne,
			);
			if (!!lObjetElement && !!lObjetElement.hint) {
				return lObjetElement.hint;
			}
		}
		return "";
	}
	getTypeValeur(aParams) {
		if (
			parseInt(aParams.idColonne) ===
				TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
					.tcrl_AppreciationFinDeCycle &&
			aParams.surEdition
		) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.ZoneTexte;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
	}
	getTri(aColonneDeTri, aGenreTri) {
		if (aColonneDeTri === null || aColonneDeTri === undefined) {
			return [];
		}
		const lTris = [];
		for (let i = 0; i < aColonneDeTri.length; i++) {
			const lCol = aColonneDeTri[i];
			const lGenreTri = aGenreTri[i];
			if (
				this.getId(lCol) ===
				TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_Diagnostic.toString()
			) {
				lTris.push(
					ObjetTri_1.ObjetTri.init((D) => {
						return D.exportable;
					}, lGenreTri),
				);
			} else if (this.isColonnePilierDeCompetence(this.getId(lCol))) {
				lTris.push(
					ObjetTri_1.ObjetTri.init(
						this.getValeurPourTri.bind(this, lCol),
						lGenreTri,
					),
				);
			} else {
				const lIdColonneTemp = this.getId(lCol);
				lTris.push(
					ObjetTri_1.ObjetTri.init((D) => {
						const lObjetElement = this.getObjetElementDeLaCellule(
							D,
							lIdColonneTemp,
						);
						if (lObjetElement && !!lObjetElement.valeur) {
							let lValeur = lObjetElement.valeur;
							if (
								lValeur.length > 0 &&
								lValeur.indexOf("/") !== -1 &&
								(lIdColonneTemp ===
									TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_ElementsTravailles.toString() ||
									lIdColonneTemp ===
										TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_CompetencesEvaluees.toString() ||
									lIdColonneTemp ===
										TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_ParcoursEducatif.toString() ||
									lIdColonneTemp ===
										TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN.tcrl_CodeSiecle.toString())
							) {
								return parseInt(lValeur.substring(0, lValeur.indexOf("/")));
							}
							return lValeur;
						}
						return "";
					}, lGenreTri),
				);
			}
		}
		return lTris;
	}
	remplirMenuContextuel(aParametres) {
		this.param.initMenuContextuel(aParametres);
	}
	getObjetElementDeLaCellule(D, aIdColonne, aIndexPilier) {
		let result = null;
		if (D.ListeColonnes) {
			if (aIndexPilier !== undefined) {
				let lColonne = null;
				for (let i = 0; i < D.ListeColonnes.count(); i++) {
					lColonne = D.ListeColonnes.get(i);
					if (
						lColonne &&
						lColonne.getGenre() ===
							TypeColonneRecapExportLSU_1.TypeColonneRecapLSUN
								.tcrl_SocleCommun &&
						lColonne.indexPilier === aIndexPilier
					) {
						result = lColonne;
						break;
					}
				}
			} else {
				if (typeof aIdColonne === "string") {
					aIdColonne = parseInt(aIdColonne);
				}
				result = D.ListeColonnes.getElementParGenre(aIdColonne);
			}
		}
		return result;
	}
}
exports.DonneesListe_RecapitulatifExportLSU =
	DonneesListe_RecapitulatifExportLSU;
