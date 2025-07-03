exports.DonneesListe_BulletinCompetences = void 0;
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const TypeGenreElementBulletinCompetence_1 = require("TypeGenreElementBulletinCompetence");
const TypeJaugeEvaluationBulletinCompetence_1 = require("TypeJaugeEvaluationBulletinCompetence");
const TypePositionnement_1 = require("TypePositionnement");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const Enumere_Annotation_1 = require("Enumere_Annotation");
const AccessApp_1 = require("AccessApp");
const GlossaireCompetences_1 = require("GlossaireCompetences");
class DonneesListe_BulletinCompetences extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParams) {
		let lAvecAuMoinsUnNiveauAbsent = false;
		let lAvecAuMoinsUnNiveauDispense = false;
		let lAvecAuMoinsUnNiveauNonEvalue = false;
		let lRegroupement = null;
		if (aDonnees) {
			aDonnees.parcourir((D) => {
				if (
					!!D.listeNiveaux &&
					!(
						lAvecAuMoinsUnNiveauAbsent &&
						lAvecAuMoinsUnNiveauDispense &&
						lAvecAuMoinsUnNiveauNonEvalue
					)
				) {
					D.listeNiveaux.parcourir((aNiveau) => {
						if (
							aNiveau.getGenre() ===
								Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Absent &&
							!!aNiveau.nbr
						) {
							lAvecAuMoinsUnNiveauAbsent = true;
						}
						if (
							aNiveau.getGenre() ===
								Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition
									.Dispense &&
							!!aNiveau.nbr
						) {
							lAvecAuMoinsUnNiveauDispense = true;
						} else if (
							aNiveau.getGenre() ===
								Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition
									.NonEvalue &&
							!!aNiveau.nbr
						) {
							lAvecAuMoinsUnNiveauNonEvalue = true;
						}
					});
				}
				if (
					D.getGenre() ===
					TypeGenreElementBulletinCompetence_1
						.TypeGenreElementBulletinCompetence.tEBPM_SurMatiere
				) {
					D.estUnDeploiement = true;
					D.estDeploye = true;
					lRegroupement = D;
				} else {
					if (
						[
							TypeGenreElementBulletinCompetence_1
								.TypeGenreElementBulletinCompetence.tEBPM_EltPilier,
							TypeGenreElementBulletinCompetence_1
								.TypeGenreElementBulletinCompetence.tEBPM_Competence,
							TypeGenreElementBulletinCompetence_1
								.TypeGenreElementBulletinCompetence.tEBPM_SousItem,
						].includes(D.getGenre()) ||
						(D.getGenre() ===
							TypeGenreElementBulletinCompetence_1
								.TypeGenreElementBulletinCompetence.tEBPM_Service &&
							D.estDansRegroupement)
					) {
						D.pere = lRegroupement;
					} else {
						lRegroupement = null;
					}
				}
			});
		}
		super(aDonnees);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
		this.avecAuMoinsUnNiveauAbsent = lAvecAuMoinsUnNiveauAbsent;
		this.avecAuMoinsUnNiveauDispense = lAvecAuMoinsUnNiveauDispense;
		this.avecAuMoinsUnNiveauNonEvalue = lAvecAuMoinsUnNiveauNonEvalue;
		this.maquette = aParams.maquette;
		this.typePositionnementSansNote =
			aParams.typePositionnementSansNote ||
			TypePositionnement_1.TypePositionnement.POS_Echelle;
		this.estJaugeEvaluationsCliquable = aParams.estJaugeEvaluationsCliquable;
		this.avecAssistantSaisie = aParams.avecAssistantSaisie || false;
		this.tailleMaxAppreciation = aParams.tailleMaxAppr || 0;
		this.avecAppreciationsSurRegroupement =
			aParams.avecAppreciationsSurRegroupement;
		this.donneesLigneTotal = aParams.donneesLigneTotal;
		this.estJaugeCliquable = aParams.estJaugeCliquable;
		this.setOptions({
			editionApresSelection: false,
			avecDeploiement: true,
			avecSuppression: false,
			avecEvnt_ApresEdition: true,
		});
	}
	_estJaugeChronologique() {
		return (
			this.maquette.genreJauge ===
			TypeJaugeEvaluationBulletinCompetence_1
				.TypeJaugeEvaluationBulletinCompetence.tJBC_Chronologique
		);
	}
	static estUneColonneTransversale(aIdColonne) {
		return aIdColonne.startsWith(
			DonneesListe_BulletinCompetences.colonnes.prefixe_col_transv,
		);
	}
	static getObjetElementColonneTransversale(aArticle, aParams) {
		let result;
		if (!!aArticle && !!aArticle.listeColonnesTransv) {
			const lIndex = aParams.declarationColonne.indexColonneTransv;
			if (lIndex > -1) {
				result = aArticle.listeColonnesTransv.get(lIndex);
			}
		}
		return result;
	}
	getClass(aParams) {
		if (
			DonneesListe_BulletinCompetences.estUneColonneTransversale(
				aParams.idColonne,
			)
		) {
			return "AlignementMilieu";
		}
		switch (aParams.idColonne) {
			case DonneesListe_BulletinCompetences.colonnes.service: {
				const lResult = [];
				if (
					aParams.article.getGenre() ===
					TypeGenreElementBulletinCompetence_1
						.TypeGenreElementBulletinCompetence.tEBPM_SurMatiere
				) {
					lResult.push("semi-bold");
				}
				if (!aParams.article.imprimable) {
					lResult.push("color-neutre-sombre");
				}
				return lResult.join(" ");
			}
			case DonneesListe_BulletinCompetences.colonnes.niveauAcqComp:
			case DonneesListe_BulletinCompetences.colonnes.pourcentage:
			case DonneesListe_BulletinCompetences.colonnes.posLSUP1:
			case DonneesListe_BulletinCompetences.colonnes.posLSUP2:
			case DonneesListe_BulletinCompetences.colonnes.posLSU:
			case DonneesListe_BulletinCompetences.colonnes.note:
			case DonneesListe_BulletinCompetences.colonnes.moyenneClasse:
			case DonneesListe_BulletinCompetences.colonnes.moyenneInf:
			case DonneesListe_BulletinCompetences.colonnes.moyenneSup:
				return "AlignementMilieu";
		}
		return "";
	}
	getClassCelluleConteneur(aParams) {
		if (this._estCelluleDeploiement(aParams)) {
			return "AvecMain";
		}
		switch (aParams.idColonne) {
			case DonneesListe_BulletinCompetences.colonnes.jauge:
				if (this.avecColJaugeCliquable(aParams)) {
					return "AvecMain";
				}
				return "";
			case DonneesListe_BulletinCompetences.colonnes.note:
				return this.avecEdition(aParams) ? "AvecMain" : "";
			case DonneesListe_BulletinCompetences.colonnes.appreciationA:
			case DonneesListe_BulletinCompetences.colonnes.appreciationB:
			case DonneesListe_BulletinCompetences.colonnes.appreciationC: {
				let lClasseAppreciation = "";
				if (this.estAppreciationEditable(aParams.idColonne, aParams.article)) {
					if (
						this.avecAssistantSaisie &&
						this.etatUtilisateurSco.assistantSaisieActif
					) {
						lClasseAppreciation = "Curseur_AssistantSaisieActif";
					} else {
						lClasseAppreciation = "AvecMain";
					}
				}
				return lClasseAppreciation;
			}
		}
		return "";
	}
	avecColJaugeCliquable(aParams) {
		return (
			aParams.idColonne === DonneesListe_BulletinCompetences.colonnes.jauge &&
			!!aParams.article.relationsESI &&
			aParams.article.relationsESI.length > 0 &&
			this.estJaugeCliquable()
		);
	}
	getAriaHasPopup(aParams) {
		if (this.avecColJaugeCliquable(aParams)) {
			return "dialog";
		}
		return false;
	}
	avecContenuTronque(aParams) {
		return (
			aParams.idColonne === DonneesListe_BulletinCompetences.colonnes.competence
		);
	}
	getTypeValeur(aParams) {
		if (this.estUneColonneAppreciation(aParams.idColonne)) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.ZoneTexte;
		} else {
			switch (aParams.idColonne) {
				case DonneesListe_BulletinCompetences.colonnes.regroupement:
					return aParams.article.getGenre() ===
						TypeGenreElementBulletinCompetence_1
							.TypeGenreElementBulletinCompetence.tEBPM_SurMatiere
						? ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule
								.CocheDeploiement
						: ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
				case DonneesListe_BulletinCompetences.colonnes.service:
					return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
				case DonneesListe_BulletinCompetences.colonnes.elementsProgramme:
					return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
				case DonneesListe_BulletinCompetences.colonnes.niveauAcqComp:
				case DonneesListe_BulletinCompetences.colonnes.posLSUP1:
				case DonneesListe_BulletinCompetences.colonnes.posLSUP2:
				case DonneesListe_BulletinCompetences.colonnes.posLSU:
					return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
				case DonneesListe_BulletinCompetences.colonnes.note:
				case DonneesListe_BulletinCompetences.colonnes.moyenneClasse:
				case DonneesListe_BulletinCompetences.colonnes.moyenneInf:
				case DonneesListe_BulletinCompetences.colonnes.moyenneSup:
					return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Note;
			}
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
	}
	avecDeploiementSurColonne(aParams) {
		return (
			aParams.idColonne ===
			DonneesListe_BulletinCompetences.colonnes.regroupement
		);
	}
	avecMenuContextuel() {
		return false;
	}
	getPadding(aParams) {
		if (
			aParams.idColonne ===
			DonneesListe_BulletinCompetences.colonnes.regroupement
		) {
			return 4;
		}
	}
	getCouleurCellule(aParams) {
		return aParams.article.getGenre() ===
			TypeGenreElementBulletinCompetence_1.TypeGenreElementBulletinCompetence
				.tEBPM_SurMatiere ||
			(aParams.idColonne ===
				DonneesListe_BulletinCompetences.colonnes.regroupement &&
				aParams.article.estDansRegroupement)
			? ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Deploiement
			: null;
	}
	avecBordureDroite(aParams) {
		return !this._estCelluleDeploiement(aParams);
	}
	avecBordureBas(aParams) {
		return (
			!this._estCelluleDeploiement(aParams) ||
			!aParams.celluleLigneSuivante ||
			!aParams.celluleLigneSuivante.article.pere
		);
	}
	getColonneDeFusion(aParams) {
		if (
			aParams.idColonne !==
				DonneesListe_BulletinCompetences.colonnes.regroupement &&
			aParams.article.getGenre() ===
				TypeGenreElementBulletinCompetence_1.TypeGenreElementBulletinCompetence
					.tEBPM_SurMatiere
		) {
			return DonneesListe_BulletinCompetences.colonnes.service;
		}
		if (
			aParams.idColonne ===
				DonneesListe_BulletinCompetences.colonnes.regroupement &&
			aParams.article.getGenre() !==
				TypeGenreElementBulletinCompetence_1.TypeGenreElementBulletinCompetence
					.tEBPM_SurMatiere &&
			!aParams.article.estDansRegroupement
		) {
			return DonneesListe_BulletinCompetences.colonnes.service;
		}
	}
	fusionCelluleAvecLignePrecedente(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_BulletinCompetences.colonnes.regroupement:
				if (this._estCelluleDeploiement(aParams.celluleLignePrecedente)) {
					return false;
				}
				return (
					[
						TypeGenreElementBulletinCompetence_1
							.TypeGenreElementBulletinCompetence.tEBPM_EltPilier,
						TypeGenreElementBulletinCompetence_1
							.TypeGenreElementBulletinCompetence.tEBPM_Competence,
						TypeGenreElementBulletinCompetence_1
							.TypeGenreElementBulletinCompetence.tEBPM_SousItem,
					].includes(aParams.article.getGenre()) ||
					(aParams.article.getGenre() ===
						TypeGenreElementBulletinCompetence_1
							.TypeGenreElementBulletinCompetence.tEBPM_Service &&
						aParams.article.estDansRegroupement)
				);
			case DonneesListe_BulletinCompetences.colonnes.service:
			case DonneesListe_BulletinCompetences.colonnes.elementsProgramme:
			case DonneesListe_BulletinCompetences.colonnes.pourcentage:
			case DonneesListe_BulletinCompetences.colonnes.posLSUP1:
			case DonneesListe_BulletinCompetences.colonnes.posLSUP2:
			case DonneesListe_BulletinCompetences.colonnes.posLSU:
			case DonneesListe_BulletinCompetences.colonnes.note:
			case DonneesListe_BulletinCompetences.colonnes.moyenneClasse:
			case DonneesListe_BulletinCompetences.colonnes.moyenneInf:
			case DonneesListe_BulletinCompetences.colonnes.moyenneSup:
			case DonneesListe_BulletinCompetences.colonnes.appreciationA:
			case DonneesListe_BulletinCompetences.colonnes.appreciationB:
			case DonneesListe_BulletinCompetences.colonnes.appreciationC: {
				let lAvecFusionLigne;
				if (
					this.estUneColonneAppreciation(aParams.idColonne) &&
					this.avecAppreciationsSurRegroupement &&
					aParams.article.estDansRegroupement
				) {
					const lCellulePrecedente = aParams.celluleLignePrecedente;
					lAvecFusionLigne =
						lCellulePrecedente &&
						lCellulePrecedente.article &&
						!lCellulePrecedente.article.estUnDeploiement;
				} else {
					lAvecFusionLigne = [
						TypeGenreElementBulletinCompetence_1
							.TypeGenreElementBulletinCompetence.tEBPM_EltPilier,
						TypeGenreElementBulletinCompetence_1
							.TypeGenreElementBulletinCompetence.tEBPM_Competence,
						TypeGenreElementBulletinCompetence_1
							.TypeGenreElementBulletinCompetence.tEBPM_SousItem,
					].includes(aParams.article.getGenre());
				}
				return lAvecFusionLigne;
			}
		}
		return false;
	}
	avecSelection(aParams) {
		return (
			aParams.article.getGenre() !==
				TypeGenreElementBulletinCompetence_1.TypeGenreElementBulletinCompetence
					.tEBPM_SurMatiere &&
			(aParams.idColonne !==
				DonneesListe_BulletinCompetences.colonnes.regroupement ||
				!aParams.article.pere)
		);
	}
	avecEvenementSelectionClick() {
		return true;
	}
	avecEdition(aParams) {
		if (
			DonneesListe_BulletinCompetences.estUneColonneTransversale(
				aParams.idColonne,
			)
		) {
			const lObjetElementColonneTransv =
				DonneesListe_BulletinCompetences.getObjetElementColonneTransversale(
					aParams.article,
					aParams,
				);
			return lObjetElementColonneTransv
				? lObjetElementColonneTransv.editable
				: false;
		} else if (this.estUneColonneAppreciation(aParams.idColonne)) {
			return this.estAppreciationEditable(aParams.idColonne, aParams.article);
		}
		switch (aParams.idColonne) {
			case DonneesListe_BulletinCompetences.colonnes.niveauAcqComp:
				return aParams.article.niveauAcqCompEditable;
			case DonneesListe_BulletinCompetences.colonnes.posLSU:
				return aParams.article.posNiveauEditable;
			case DonneesListe_BulletinCompetences.colonnes.note:
				return aParams.article.posNoteEditable;
			case DonneesListe_BulletinCompetences.colonnes.elementsProgramme:
				return aParams.article.eltProgEditable;
		}
		return false;
	}
	avecEvenementEdition(aParams) {
		if (
			DonneesListe_BulletinCompetences.estUneColonneTransversale(
				aParams.idColonne,
			)
		) {
			return this.avecEdition(aParams);
		}
		switch (aParams.idColonne) {
			case DonneesListe_BulletinCompetences.colonnes.niveauAcqComp:
				return aParams.article.niveauAcqCompEditable;
			case DonneesListe_BulletinCompetences.colonnes.posLSU:
				return aParams.article.posNiveauEditable;
			case DonneesListe_BulletinCompetences.colonnes.elementsProgramme:
				return aParams.article.eltProgEditable;
			case DonneesListe_BulletinCompetences.colonnes.appreciationA:
			case DonneesListe_BulletinCompetences.colonnes.appreciationB:
			case DonneesListe_BulletinCompetences.colonnes.appreciationC: {
				let lAvecEventEdition = false;
				if (
					this.avecAssistantSaisie &&
					this.etatUtilisateurSco.assistantSaisieActif
				) {
					lAvecEventEdition = this.estAppreciationEditable(
						aParams.idColonne,
						aParams.article,
					);
				}
				return lAvecEventEdition;
			}
		}
		return false;
	}
	avecEtatSaisie(aParams) {
		return (
			!this.estUneColonneAppreciation(aParams.idColonne) &&
			!(aParams.idColonne === DonneesListe_BulletinCompetences.colonnes.note)
		);
	}
	autoriserChaineVideSurEdition() {
		return true;
	}
	getControleCaracteresInput(aParams) {
		if (this.estUneColonneAppreciation(aParams.idColonne)) {
			return { tailleMax: this.tailleMaxAppreciation };
		}
		return null;
	}
	getOptionsNote() {
		return {
			sansNotePossible: true,
			afficherAvecVirgule: true,
			hintSurErreur: false,
			min: 0,
			max: 20,
			listeAnnotations: [
				Enumere_Annotation_1.EGenreAnnotation.absent,
				Enumere_Annotation_1.EGenreAnnotation.dispense,
				Enumere_Annotation_1.EGenreAnnotation.nonNote,
			],
		};
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_BulletinCompetences.colonnes.note:
				aParams.article.posLSUNote = aParams.valeur;
				aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				break;
			case DonneesListe_BulletinCompetences.colonnes.appreciationA:
				aParams.article.appreciationA = V ? V.trim() : "";
				break;
			case DonneesListe_BulletinCompetences.colonnes.appreciationB:
				aParams.article.appreciationB = V ? V.trim() : "";
				break;
			case DonneesListe_BulletinCompetences.colonnes.appreciationC:
				aParams.article.appreciationC = V ? V.trim() : "";
				break;
		}
	}
	getValeur(aParams) {
		if (
			DonneesListe_BulletinCompetences.estUneColonneTransversale(
				aParams.idColonne,
			)
		) {
			const lObjetElementColonneTransv =
				DonneesListe_BulletinCompetences.getObjetElementColonneTransversale(
					aParams.article,
					aParams,
				);
			if (!!lObjetElementColonneTransv) {
				const lExisteUnNiveauAcqui = !!lObjetElementColonneTransv.niveauAcqui;
				const lAUnNiveauAcquiSaisi =
					lExisteUnNiveauAcqui &&
					lObjetElementColonneTransv.niveauAcqui.existeNumero();
				const lAUnNiveauAcquiCalcule =
					!!lObjetElementColonneTransv.niveauAcquiCalc &&
					lObjetElementColonneTransv.niveauAcquiCalc.existeNumero();
				const H = [];
				if (lExisteUnNiveauAcqui && lAUnNiveauAcquiCalcule) {
					if (lAUnNiveauAcquiSaisi) {
						H.push(
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
								lObjetElementColonneTransv.niveauAcqui,
								{ avecTitle: false },
							),
						);
					} else {
						H.push('<div style="width:16px;" class="InlineBlock">&nbsp;</div>');
					}
					H.push(
						" (",
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
							lObjetElementColonneTransv.niveauAcquiCalc,
							{ avecTitle: false },
						),
						")",
					);
				} else if (lAUnNiveauAcquiSaisi || lAUnNiveauAcquiCalcule) {
					if (lAUnNiveauAcquiSaisi) {
						H.push(
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
								lObjetElementColonneTransv.niveauAcqui,
								{ avecTitle: false },
							),
						);
					} else {
						H.push(
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
								lObjetElementColonneTransv.niveauAcquiCalc,
								{ avecTitle: false },
							),
						);
					}
				}
				return H.join("");
			}
		}
		switch (aParams.idColonne) {
			case DonneesListe_BulletinCompetences.colonnes.service:
				return (
					(aParams.article.strServiceEtProf || "") +
					(aParams.article.strServiceEtProf && !aParams.article.imprimable
						? " *"
						: "")
				);
			case DonneesListe_BulletinCompetences.colonnes.competence:
				return aParams.article.strElmtCompetence || "";
			case DonneesListe_BulletinCompetences.colonnes.elementsProgramme:
				return aParams.article.strEltProg || "";
			case DonneesListe_BulletinCompetences.colonnes.jauge: {
				let lJauge = "";
				if (this._estJaugeChronologique()) {
					lJauge =
						UtilitaireCompetences_1.TUtilitaireCompetences.composeJaugeChronologique(
							{
								listeNiveaux: aParams.article.listeNiveauxChronologique,
								hint: this.getTooltipJauge(aParams),
							},
						);
				} else {
					const lOptionsJauge = {
						listeNiveaux: aParams.article.listeNiveaux,
						hint: this.getTooltipJauge(aParams),
						listeGenreNiveauxIgnores: [],
					};
					if (this.avecAuMoinsUnNiveauAbsent === false) {
						lOptionsJauge.listeGenreNiveauxIgnores.push(
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Absent,
						);
					}
					if (this.avecAuMoinsUnNiveauDispense === false) {
						lOptionsJauge.listeGenreNiveauxIgnores.push(
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Dispense,
						);
					}
					if (this.avecAuMoinsUnNiveauNonEvalue === false) {
						lOptionsJauge.listeGenreNiveauxIgnores.push(
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.NonEvalue,
						);
					}
					if (
						[
							TypeGenreElementBulletinCompetence_1
								.TypeGenreElementBulletinCompetence.tEBPM_EltPilier,
							TypeGenreElementBulletinCompetence_1
								.TypeGenreElementBulletinCompetence.tEBPM_Competence,
							TypeGenreElementBulletinCompetence_1
								.TypeGenreElementBulletinCompetence.tEBPM_SousItem,
						].includes(aParams.article.getGenre())
					) {
						lJauge =
							UtilitaireCompetences_1.TUtilitaireCompetences.composeJaugeParPastilles(
								lOptionsJauge,
							);
					} else {
						lJauge =
							UtilitaireCompetences_1.TUtilitaireCompetences.composeJaugeParNiveaux(
								lOptionsJauge,
							);
					}
				}
				return lJauge;
			}
			case DonneesListe_BulletinCompetences.colonnes.niveauAcqComp:
				return aParams.article.niveauAcqComp
					? Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
							aParams.article.niveauAcqComp,
						)
					: "";
			case DonneesListe_BulletinCompetences.colonnes.pourcentage:
				return aParams.article.pourcentage ? aParams.article.pourcentage : "";
			case DonneesListe_BulletinCompetences.colonnes.posLSUP1:
				return !!aParams.article.posLSUNiveauP1
					? Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImagePositionnement(
							{
								niveauDAcquisition: aParams.article.posLSUNiveauP1,
								genrePositionnement: this.typePositionnementSansNote,
							},
						)
					: "";
			case DonneesListe_BulletinCompetences.colonnes.posLSUP2:
				return !!aParams.article.posLSUNiveauP2
					? Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImagePositionnement(
							{
								niveauDAcquisition: aParams.article.posLSUNiveauP2,
								genrePositionnement: this.typePositionnementSansNote,
							},
						)
					: "";
			case DonneesListe_BulletinCompetences.colonnes.posLSU:
				return !!aParams.article.posLSUNiveau
					? Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImagePositionnement(
							{
								niveauDAcquisition: aParams.article.posLSUNiveau,
								genrePositionnement: this.typePositionnementSansNote,
							},
						)
					: "";
			case DonneesListe_BulletinCompetences.colonnes.note:
				return aParams.article.posLSUNote;
			case DonneesListe_BulletinCompetences.colonnes.moyenneClasse:
				return aParams.article.moyenneClasse || "";
			case DonneesListe_BulletinCompetences.colonnes.moyenneInf:
				return aParams.article.moyenneInf || "";
			case DonneesListe_BulletinCompetences.colonnes.moyenneSup:
				return aParams.article.moyenneSup || "";
			case DonneesListe_BulletinCompetences.colonnes.appreciationA:
				return aParams.article.appreciationA || "";
			case DonneesListe_BulletinCompetences.colonnes.appreciationB:
				return aParams.article.appreciationB || "";
			case DonneesListe_BulletinCompetences.colonnes.appreciationC:
				return aParams.article.appreciationC || "";
		}
		return "";
	}
	getTooltipJauge(aParams) {
		if (aParams.article.listeNiveauxChronologique) {
			return aParams.article.listeNiveauxChronologique
				.getTableauLibelles()
				.join(", ");
		}
		return aParams.article.hintNiveaux;
	}
	getContenuTotal(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_BulletinCompetences.colonnes.service:
				return GlossaireCompetences_1.TradGlossaireCompetences.MoyenneGenerale;
			case DonneesListe_BulletinCompetences.colonnes.note:
				return !!this.donneesLigneTotal
					? this.donneesLigneTotal.moyEleve || ""
					: "";
			case DonneesListe_BulletinCompetences.colonnes.moyenneClasse:
				return !!this.donneesLigneTotal
					? this.donneesLigneTotal.moyClasse || ""
					: "";
			case DonneesListe_BulletinCompetences.colonnes.moyenneInf:
				return !!this.donneesLigneTotal
					? this.donneesLigneTotal.moyInf || ""
					: "";
			case DonneesListe_BulletinCompetences.colonnes.moyenneSup:
				return !!this.donneesLigneTotal
					? this.donneesLigneTotal.moySup || ""
					: "";
		}
		return "";
	}
	getClassTotal(aParams) {
		const lClasses = [];
		switch (aParams.idColonne) {
			case DonneesListe_BulletinCompetences.colonnes.service:
				lClasses.push("Gras");
				lClasses.push("AlignementDroit");
				break;
			case DonneesListe_BulletinCompetences.colonnes.note:
			case DonneesListe_BulletinCompetences.colonnes.moyenneClasse:
				lClasses.push("AlignementMilieu");
				break;
		}
		return lClasses.join(" ");
	}
	getColonneDeFusionTotal(aParams) {
		if (
			aParams.idColonne ===
			DonneesListe_BulletinCompetences.colonnes.regroupement
		) {
			return DonneesListe_BulletinCompetences.colonnes.service;
		}
		return null;
	}
	getTooltip(aParams) {
		if (
			DonneesListe_BulletinCompetences.estUneColonneTransversale(
				aParams.idColonne,
			)
		) {
			const lObjetElementColonneTransv =
				DonneesListe_BulletinCompetences.getObjetElementColonneTransversale(
					aParams.article,
					aParams,
				);
			if (!!lObjetElementColonneTransv) {
				let lHint;
				if (this.etatUtilisateurSco.estEspacePourEleve()) {
					const lNiveau = lObjetElementColonneTransv.niveauAcqui;
					lHint =
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getLibelle(
							lNiveau,
						);
				} else {
					lHint = lObjetElementColonneTransv.hint;
				}
				return lHint || "";
			}
		} else {
			switch (aParams.idColonne) {
				case DonneesListe_BulletinCompetences.colonnes.service: {
					if (!aParams.article.imprimable) {
						return `* : ${GlossaireCompetences_1.TradGlossaireCompetences.ServiceNonImprimable}`;
					}
					return "";
				}
				case DonneesListe_BulletinCompetences.colonnes.competence:
					return aParams.article.strElmtCompetence || "";
				case DonneesListe_BulletinCompetences.colonnes.jauge: {
					let lStr = this.getTooltipJauge(aParams) || "";
					if (this.avecColJaugeCliquable(aParams)) {
						lStr +=
							(lStr ? "<br/>" : "") +
							GlossaireCompetences_1.TradGlossaireCompetences.OuvrirDetailEval;
					}
					return lStr;
				}
				case DonneesListe_BulletinCompetences.colonnes.niveauAcqComp:
					return aParams.article.niveauAcqComp
						? Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getLibelle(
								aParams.article.niveauAcqComp,
							)
						: "";
				case DonneesListe_BulletinCompetences.colonnes.posLSUP1:
					return aParams.article.posLSUNiveauP1
						? Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getLibelle(
								aParams.article.posLSUNiveauP1,
							)
						: "";
				case DonneesListe_BulletinCompetences.colonnes.posLSUP2:
					return aParams.article.posLSUNiveauP2
						? Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getLibelle(
								aParams.article.posLSUNiveauP2,
							)
						: "";
				case DonneesListe_BulletinCompetences.colonnes.posLSU:
					return aParams.article.posLSUNiveau
						? Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getLibelle(
								aParams.article.posLSUNiveau,
							)
						: "";
				case DonneesListe_BulletinCompetences.colonnes.elementsProgramme:
					return aParams.article.hintEltProg || "";
			}
		}
	}
	_estCelluleDeploiement(aParams) {
		return (
			aParams.idColonne ===
				DonneesListe_BulletinCompetences.colonnes.regroupement &&
			aParams.article.getGenre() ===
				TypeGenreElementBulletinCompetence_1.TypeGenreElementBulletinCompetence
					.tEBPM_SurMatiere
		);
	}
	estAppreciationEditable(aIdColonne, aArticle) {
		return (
			(aIdColonne === DonneesListe_BulletinCompetences.colonnes.appreciationA &&
				aArticle.appAEditable) ||
			(aIdColonne === DonneesListe_BulletinCompetences.colonnes.appreciationB &&
				aArticle.appBEditable) ||
			(aIdColonne === DonneesListe_BulletinCompetences.colonnes.appreciationC &&
				aArticle.appCEditable)
		);
	}
	estUneColonneAppreciation(aIdColonne) {
		return [
			DonneesListe_BulletinCompetences.colonnes.appreciationA,
			DonneesListe_BulletinCompetences.colonnes.appreciationB,
			DonneesListe_BulletinCompetences.colonnes.appreciationC,
		].includes(aIdColonne);
	}
}
exports.DonneesListe_BulletinCompetences = DonneesListe_BulletinCompetences;
DonneesListe_BulletinCompetences.colonnes = {
	regroupement: "regroupement",
	service: "service",
	competence: "competence",
	elementsProgramme: "elementsProgramme",
	jauge: "jauge",
	niveauAcqComp: "niveauAcqComp",
	pourcentage: "pourcentage",
	posLSUP1: "posLSUP1",
	posLSUP2: "posLSUP2",
	posLSU: "posLSU",
	note: "note",
	moyenneClasse: "moyenneClasse",
	moyenneInf: "moyenneInf",
	moyenneSup: "moyenneSup",
	appreciationA: "appreciationA",
	appreciationB: "appreciationB",
	appreciationC: "appreciationC",
	prefixe_col_transv: "transversal_",
};
