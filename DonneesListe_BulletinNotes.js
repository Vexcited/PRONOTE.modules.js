const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { TypeNote } = require("TypeNote.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreAnnotation } = require("Enumere_Annotation.js");
const {
	TypePositionnement,
	TypePositionnementUtil,
} = require("TypePositionnement.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetMoteurAssistantSaisie } = require("ObjetMoteurAssistantSaisie.js");
const { ObjetMoteurGrilleSaisie } = require("ObjetMoteurGrilleSaisie.js");
class DonneesListe_BulletinNotes extends ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.moteur = new ObjetMoteurReleveBulletin();
		this.moteurAssSaisie = new ObjetMoteurAssistantSaisie();
		this.moteurGrille = new ObjetMoteurGrilleSaisie();
		this.param = $.extend(
			{
				instanceListe: null,
				affichage: null,
				estCtxClasse: false,
				estEnConsultation: true,
				saisie: false,
				periode: null,
				total: null,
				baremeNotationNiveau: GParametres.baremeNotation,
			},
			aParam,
		);
		if (this.param.instanceListe !== null && this.param.affichage !== null) {
			this.initOptions(this.param.instanceListe, this.param);
		}
		this.setOptions({
			avecDeploiement: true,
			avecTri: false,
			avecSuppression: false,
			avecEvnt_ApresEdition: true,
			avecEvnt_ApresEditionValidationSansModification: true,
		});
	}
	getControleur(aInstanceDonneesListe, aInstanceListe) {
		return $.extend(
			true,
			super.getControleur(aInstanceDonneesListe, aInstanceListe),
			{
				getNodeCrayonElements: function () {
					$(this.node).on("click", () => {
						GApplication.getMessage().afficher({
							message: GTraductions.getValeur(
								"BulletinEtReleve.InfoHintElementsPgm",
							),
						});
					});
				},
			},
		);
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_BulletinNotes.colonnes.regroupement:
				return aParams.article.estUnDeploiement === true
					? ObjetDonneesListe.ETypeCellule.CocheDeploiement
					: ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_BulletinNotes.colonnes.moyClasse:
			case DonneesListe_BulletinNotes.colonnes.moyInf:
			case DonneesListe_BulletinNotes.colonnes.moySup:
			case DonneesListe_BulletinNotes.colonnes.moyMediane:
				return ObjetDonneesListe.ETypeCellule.Note;
			case DonneesListe_BulletinNotes.colonnes.moyDeliberee:
			case DonneesListe_BulletinNotes.colonnes.moyProposee:
				if (_estServiceAvisReligion.call(this, aParams.article)) {
					return ObjetDonneesListe.ETypeCellule.Texte;
				} else {
					return ObjetDonneesListe.ETypeCellule.Note;
				}
			case DonneesListe_BulletinNotes.colonnes.ects:
				return ObjetDonneesListe.ETypeCellule.Note;
			case DonneesListe_BulletinNotes.colonnes.matiere:
			case DonneesListe_BulletinNotes.colonnes.nivMaitriseEleve:
			case DonneesListe_BulletinNotes.colonnes.moyEleve:
			case DonneesListe_BulletinNotes.colonnes.moyAnnuelle:
				return ObjetDonneesListe.ETypeCellule.Html;
			default:
				if (_estColMoyPrec.call(this, aParams.idColonne)) {
					return ObjetDonneesListe.ETypeCellule.Html;
				} else {
					if (_estColAppreciation.call(this, aParams.idColonne)) {
						return ObjetDonneesListe.ETypeCellule.ZoneTexte;
					} else {
						return ObjetDonneesListe.ETypeCellule.Texte;
					}
				}
		}
	}
	getValeur(aParams) {
		let lIndice, lNote;
		if (aParams.article.estUnDeploiement) {
			switch (aParams.idColonne) {
				case DonneesListe_BulletinNotes.colonnes.matiere:
					return aParams.article.getLibelle();
				case DonneesListe_BulletinNotes.colonnes.coeff:
					return aParams.article.surMatiere
						? this.moteur.getStrNote(aParams.article.surMatiere.Coefficient)
						: "";
				case DonneesListe_BulletinNotes.colonnes.nbNotes:
					return aParams.article.surMatiere
						? aParams.article.surMatiere.NombreDevoirs
						: "";
				case DonneesListe_BulletinNotes.colonnes.moyAnnuelle:
					return aParams.article.surMatiere
						? this.moteur.composeHtmlNote({
								note: aParams.article.surMatiere.MoyenneAnnuelle,
							})
						: "";
				case DonneesListe_BulletinNotes.colonnes.pts:
					return aParams.article.surMatiere
						? this.moteur.getStrNote(
								aParams.article.surMatiere.NombrePointsEleve,
							)
						: "";
				case DonneesListe_BulletinNotes.colonnes.ects:
					return aParams.article.surMatiere && aParams.article.surMatiere.ECTS
						? new TypeNote(aParams.article.surMatiere.ECTS)
						: null;
				case DonneesListe_BulletinNotes.colonnes.nivMaitriseEleve:
					return "";
				case DonneesListe_BulletinNotes.colonnes.moyEleve:
					return aParams.article.surMatiere
						? this.moteur.getStrNote(aParams.article.surMatiere.MoyenneEleve)
						: "";
				case DonneesListe_BulletinNotes.colonnes.moyClasse:
					return aParams.article.surMatiere
						? aParams.article.surMatiere.MoyenneClasse
						: null;
				case DonneesListe_BulletinNotes.colonnes.moySup:
					return aParams.article.surMatiere
						? aParams.article.surMatiere.MoyenneSup
						: null;
				case DonneesListe_BulletinNotes.colonnes.moyInf:
					return aParams.article.surMatiere
						? aParams.article.surMatiere.MoyenneInf
						: null;
				case DonneesListe_BulletinNotes.colonnes.moyMediane:
					return aParams.article.surMatiere
						? aParams.article.surMatiere.MoyenneMediane
						: null;
				default:
					if (_estColMoyPrec.call(this, aParams.idColonne)) {
						lIndice = aParams.declarationColonne.indice;
						lNote =
							aParams.article.surMatiere &&
							aParams.article.surMatiere.ListeMoyennesPeriodes
								? aParams.article.surMatiere.ListeMoyennesPeriodes[lIndice]
								: null;
						return this.moteur.getStrNote(lNote);
					} else {
						return "";
					}
			}
		}
		const lAffichage = this.param.affichage;
		switch (aParams.idColonne) {
			case DonneesListe_BulletinNotes.colonnes.regroupement:
				return "";
			case DonneesListe_BulletinNotes.colonnes.matiere:
				return aParams.surModeAccessible
					? this.moteur.composeHtmlServiceAccessible({
							service: aParams.article,
						})
					: this.moteur.composeHtmlService({
							service: aParams.article,
							nbrMaxProfesseurs:
								DonneesListe_BulletinNotes.dimensions.nbMaxProfs,
						});
			case DonneesListe_BulletinNotes.colonnes.volumeHoraire:
				return this.moteur.getStrNote(aParams.article.VolumeHoraire);
			case DonneesListe_BulletinNotes.colonnes.coeff:
				return this.moteur.getStrNote(aParams.article.Coefficient);
			case DonneesListe_BulletinNotes.colonnes.nbNotes:
				return this.moteur.getStrNote(aParams.article.NombreDevoirs);
			case DonneesListe_BulletinNotes.colonnes.rang:
				return this.moteur.getStrNote(
					aParams.article.ClassementEleve > 0
						? aParams.article.ClassementEleve
						: null,
				);
			case DonneesListe_BulletinNotes.colonnes.pts:
				return this.moteur.getStrNote(aParams.article.NombrePointsEleve);
			case DonneesListe_BulletinNotes.colonnes.ects:
				return aParams.article.ECTS ? new TypeNote(aParams.article.ECTS) : "";
			case DonneesListe_BulletinNotes.colonnes.nivMaitriseEleve:
				return this.moteur.composeHtmlNote({
					note: null,
					niveauDAcquisition: aParams.article.NiveauDAcquisition,
					genrePositionnement:
						TypePositionnementUtil.getGenrePositionnementParDefaut(
							aParams.article.TypePositionnementClasse,
						),
					avecPrefixe: false,
				});
			case DonneesListe_BulletinNotes.colonnes.moyEleve:
				return this.moteur.composeHtmlNote({
					note: aParams.article.MoyenneEleve,
					niveauDAcquisition: lAffichage.AvecNivMaitriseEleve
						? null
						: aParams.article.NiveauDAcquisition,
					genrePositionnement:
						TypePositionnementUtil.getGenrePositionnementParDefaut(
							aParams.article.TypePositionnementClasse,
						),
					estMoyNR: aParams.article.estMoyNR,
					avecMoyNRUniquement: this.param.affichage.avecMoyNRUniquement,
				});
			case DonneesListe_BulletinNotes.colonnes.moyClasse:
				return aParams.article.MoyenneClasse;
			case DonneesListe_BulletinNotes.colonnes.moySup:
				return aParams.article.MoyenneSup;
			case DonneesListe_BulletinNotes.colonnes.moyInf:
				return aParams.article.MoyenneInf;
			case DonneesListe_BulletinNotes.colonnes.moyMediane:
				return aParams.article.MoyenneMediane;
			case DonneesListe_BulletinNotes.colonnes.moyAnnuelle:
				return this.moteur.composeHtmlNote({
					note: aParams.article.MoyenneAnnuelle,
					estMoyNR: aParams.article.estMoyAnnuelleNR,
					avecMoyNRUniquement: this.param.affichage.avecMoyNRUniquement,
				});
			case DonneesListe_BulletinNotes.colonnes.heuresAbs:
				return this.moteur.getStrNote(aParams.article.DureeDesAbsences);
			case DonneesListe_BulletinNotes.colonnes.evolution:
				return this.moteur.composeHtmlEvolution({
					genreEvol: !!aParams.article.Evolution
						? aParams.article.Evolution.getGenre()
						: 0,
				});
			case DonneesListe_BulletinNotes.colonnes.elmtPgm:
				return this.moteur.composeHtmlElementProgramme({
					elements: aParams.article.ElementsProgrammeBulletin,
				});
			case DonneesListe_BulletinNotes.colonnes.moyProposee:
				return _estServiceAvisReligion.call(this, aParams.article)
					? aParams.article.avisReligionPropose.getLibelle()
					: aParams.article.moyenneProposee;
			case DonneesListe_BulletinNotes.colonnes.moyDeliberee:
				return _estServiceAvisReligion.call(this, aParams.article)
					? aParams.article.avisReligionDelibere.getLibelle()
					: aParams.article.moyenneDeliberee;
			case DonneesListe_BulletinNotes.colonnes.nbMoyInf8:
				return this.moteur.getStrNote(
					!!aParams.article.NombreNotesEntre
						? aParams.article.NombreNotesEntre[0]
						: null,
				);
			case DonneesListe_BulletinNotes.colonnes.nbMoyEntre8Et12:
				return this.moteur.getStrNote(
					!!aParams.article.NombreNotesEntre
						? aParams.article.NombreNotesEntre[1]
						: null,
				);
			case DonneesListe_BulletinNotes.colonnes.nbMoySup12:
				return this.moteur.getStrNote(
					!!aParams.article.NombreNotesEntre
						? aParams.article.NombreNotesEntre[2]
						: null,
				);
			default:
				if (_estColMoyPrec.call(this, aParams.idColonne)) {
					lIndice = aParams.declarationColonne.indice;
					lNote = aParams.article.ListeMoyennesPeriodes
						? aParams.article.ListeMoyennesPeriodes[lIndice]
						: null;
					const lMoyNR =
						aParams.article.ListeMoyNRPeriodes !== null &&
						aParams.article.ListeMoyNRPeriodes !== undefined
							? aParams.article.ListeMoyNRPeriodes[lIndice]
							: false;
					return this.moteur.composeHtmlNote({
						note: lNote,
						niveauDAcquisition:
							aParams.article.ListeNiveauDAcquisitionPeriodes.get(lIndice),
						genrePositionnement:
							TypePositionnementUtil.getGenrePositionnementParDefaut(
								aParams.article.TypePositionnementClasse,
							),
						estMoyNR: lMoyNR,
						avecMoyNRUniquement: this.param.affichage.avecMoyNRUniquement,
					});
				} else {
					if (_estColAppreciation.call(this, aParams.idColonne)) {
						lIndice = aParams.declarationColonne.indice;
						return aParams.article.ListeAppreciations
							? aParams.article.ListeAppreciations.getLibelle(lIndice)
							: null;
					} else {
					}
				}
		}
	}
	getClass(aParams) {
		const T = [];
		if (!aParams.article.estUnDeploiement) {
			if (aParams.idColonne === DonneesListe_BulletinNotes.colonnes.matiere) {
				if (!aParams.article.Actif) {
					T.push("GrisClair");
				}
			}
		}
		return T.join(" ");
	}
	getClassCelluleConteneur(aParams) {
		const T = [];
		if (aParams.article.estUnDeploiement) {
			T.push("Gras");
			if (_estColAvecAlignementDroit.call(this, aParams)) {
				T.push("AlignementDroit");
			} else if (_estColAvecAlignementMilieu(aParams)) {
				T.push("AlignementMilieu");
			}
		} else {
			if (aParams.article.estService && _estColAvecGras.call(this, aParams)) {
				T.push("Gras");
			}
			if (_estColAvecAlignementDroit.call(this, aParams)) {
				T.push("AlignementDroit");
			} else if (_estColAvecAlignementMilieu(aParams)) {
				T.push("AlignementMilieu");
			}
			const lAvecCurseurInterdiction =
				!this.param.estEnConsultation && !_estCellEditable.call(this, aParams);
			switch (aParams.idColonne) {
				case DonneesListe_BulletinNotes.colonnes.matiere:
					T.push(
						aParams.article.estService ? "AlignementGauche" : "AlignementDroit",
					);
					if (!aParams.article.Actif) {
						T.push("GrisClair");
					}
					break;
				case DonneesListe_BulletinNotes.colonnes.moyProposee:
				case DonneesListe_BulletinNotes.colonnes.moyDeliberee:
				case DonneesListe_BulletinNotes.colonnes.ects:
				case DonneesListe_BulletinNotes.colonnes.elmtPgm:
					if (lAvecCurseurInterdiction) {
						T.push("AvecInterdiction");
					}
					break;
			}
			if (_estColAppreciation.call(this, aParams.idColonne)) {
				if (lAvecCurseurInterdiction) {
					T.push("AvecInterdiction");
				} else {
					if (
						this.moteurAssSaisie.avecAssistantSaisieActif({
							typeReleveBulletin: TypeReleveBulletin.BulletinNotes,
						})
					) {
						T.push("Curseur_AssistantSaisieActif");
					}
				}
			}
		}
		return T.join(" ");
	}
	avecBordureDroite(aParams) {
		if (
			aParams.idColonne === DonneesListe_BulletinNotes.colonnes.regroupement
		) {
			return !_estCelluleDeploiement(aParams);
		}
		if (aParams && aParams.article && aParams.article.estUnDeploiement) {
			return false;
		}
		return true;
	}
	avecBordureBas(aParamsLigne) {
		const lEstColMatiere =
			aParamsLigne.idColonne === DonneesListe_BulletinNotes.colonnes.matiere;
		if (lEstColMatiere) {
			if (
				aParamsLigne.article.estUnDeploiement ||
				(aParamsLigne.celluleLigneSuivante &&
					aParamsLigne.celluleLigneSuivante.article &&
					aParamsLigne.celluleLigneSuivante.article.estUnDeploiement)
			) {
				return true;
			}
			const lAvecSousServiceSurLigneSuiv =
				aParamsLigne.celluleLigneSuivante &&
				aParamsLigne.celluleLigneSuivante.article &&
				!aParamsLigne.celluleLigneSuivante.article.estService;
			return !lAvecSousServiceSurLigneSuiv;
		}
		if (
			aParamsLigne.idColonne ===
			DonneesListe_BulletinNotes.colonnes.regroupement
		) {
			return !_estCelluleDeploiement(aParamsLigne);
		}
		return true;
	}
	fusionCelluleAvecLignePrecedente(aParams) {
		if (
			aParams.idColonne === DonneesListe_BulletinNotes.colonnes.regroupement
		) {
			if (_estCelluleDeploiement(aParams.celluleLignePrecedente)) {
				return false;
			}
			return (
				!aParams.article.estUnDeploiement &&
				aParams.article.regroupement &&
				aParams.celluleLignePrecedente &&
				aParams.celluleLignePrecedente.article.regroupement ===
					aParams.article.regroupement
			);
		}
		if (aParams.article.estUnDeploiement === true) {
			return false;
		}
		if (
			_estColAppreciation.call(this, aParams.idColonne) &&
			!aParams.article.avecAppreciationParSousService &&
			!aParams.article.estService
		) {
			return true;
		}
		return (
			[DonneesListe_BulletinNotes.colonnes.elmtPgm].includes(
				aParams.idColonne,
			) &&
			!aParams.article.avecEltPgmeParSousService &&
			!aParams.article.estService
		);
	}
	getColonneDeFusion(aParams) {
		if (
			aParams.idColonne === DonneesListe_BulletinNotes.colonnes.regroupement &&
			!aParams.article.estUnDeploiement &&
			!aParams.article.regroupement
		) {
			return DonneesListe_BulletinNotes.colonnes.matiere;
		}
	}
	getHintForce(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_BulletinNotes.colonnes.matiere: {
				const lTitle = this.moteur._getHintListeProfsDeServices({
					service: aParams.article,
					nbMaxProfs: DonneesListe_BulletinNotes.dimensions.nbMaxProfs,
					largeur: DonneesListe_BulletinNotes.dimensions.largeurService,
				});
				return lTitle !== "" ? lTitle : null;
			}
		}
		if (
			_estDonneeEditable.call(this, aParams) &&
			_estDonneeCloture.call(this, aParams)
		) {
			return GTraductions.getValeur("PeriodeCloturee");
		}
	}
	getHintHtmlForce(aParams) {
		if (aParams.article.estUnDeploiement === true) {
			return "";
		}
		switch (aParams.idColonne) {
			case DonneesListe_BulletinNotes.colonnes.elmtPgm:
				return this.moteur.getHintElementProgramme({
					service: aParams.article,
				});
		}
	}
	getCouleurCellule(aParams) {
		if (
			aParams.article.estUnDeploiement ||
			(aParams.idColonne === DonneesListe_BulletinNotes.colonnes.regroupement &&
				aParams.article.regroupement)
		) {
			return ObjetDonneesListe.ECouleurCellule.Deploiement;
		}
		if (_estColFixe.call(this, aParams)) {
			return ObjetDonneesListe.ECouleurCellule.Fixe;
		}
		if (_estColCouleurTotal.call(this, aParams)) {
			return ObjetDonneesListe.ECouleurCellule.Total;
		}
		if (_estDonneeEditable.call(this, aParams)) {
			return ObjetDonneesListe.ECouleurCellule.Blanc;
		} else {
			return ObjetDonneesListe.ECouleurCellule.Gris;
		}
	}
	avecSelection(aParams) {
		return (
			!aParams.article.estUnDeploiement &&
			aParams.idColonne !== DonneesListe_BulletinNotes.colonnes.regroupement
		);
	}
	avecEdition(aParams) {
		return _estCellEditable.call(this, aParams);
	}
	avecEvenementEdition(aParams) {
		if (
			!_estColEditable.call(this, aParams) ||
			!_estDonneeEditable.call(this, aParams)
		) {
			return false;
		}
		if (_estDonneeCloture.call(this, aParams)) {
			return true;
		}
		switch (aParams.idColonne) {
			case DonneesListe_BulletinNotes.colonnes.elmtPgm:
				return _estCellEditable.call(this, aParams);
			case DonneesListe_BulletinNotes.colonnes.moyProposee:
			case DonneesListe_BulletinNotes.colonnes.moyDeliberee:
				return _estServiceAvisReligion.call(this, aParams.article);
			default:
				if (_estColAppreciation.call(this, aParams.idColonne)) {
					return (
						_estCellEditable.call(this, aParams) &&
						this.moteurAssSaisie.avecAssistantSaisieActif({
							typeReleveBulletin: TypeReleveBulletin.BulletinNotes,
						})
					);
				}
				break;
		}
		return false;
	}
	autoriserChaineVideSurEdition() {
		return true;
	}
	getControleCaracteresInput(aParams) {
		switch (aParams.idColonne) {
			default:
				if (_estColAppreciation.call(this, aParams.idColonne)) {
					return { tailleMax: this.param.tailleMaxAppreciation };
				} else {
					return null;
				}
		}
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_BulletinNotes.colonnes.ects: {
				const lValeurECTS =
					V === "" || !V.estUneValeur() ? undefined : V.getValeur();
				aParams.article.ectsModifie =
					lValeurECTS !== aParams.article.ECTS ? lValeurECTS : null;
				break;
			}
			case DonneesListe_BulletinNotes.colonnes.moyProposee:
				aParams.article.moyProposeeModifie = V;
				break;
			case DonneesListe_BulletinNotes.colonnes.moyDeliberee:
				aParams.article.moyDelibereeModifie = V;
				break;
			default:
				if (_estColAppreciation.call(this, aParams.idColonne)) {
					const lIndice = aParams.declarationColonne.indice;
					const lAppr = aParams.article.ListeAppreciations
						? aParams.article.ListeAppreciations.get(lIndice)
						: null;
					if (lAppr) {
						lAppr.setLibelle(!!V ? V.trim() : "");
						lAppr.setEtat(EGenreEtat.Modification);
					}
				}
		}
	}
	getOptionsNote(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_BulletinNotes.colonnes.moyProposee:
			case DonneesListe_BulletinNotes.colonnes.moyDeliberee:
				return {
					avecAnnotation: true,
					listeAnnotations: [EGenreAnnotation.dispense],
					sansNotePossible: true,
					min: 0,
					max:
						this.param.baremeNotationNiveau &&
						this.param.baremeNotationNiveau.estUneValeur()
							? this.param.baremeNotationNiveau.getValeur()
							: 20,
					avecVirgule: false,
					afficherAvecVirgule: true,
				};
			case DonneesListe_BulletinNotes.colonnes.ects: {
				const lNbECTSService = !aParams.article.nbECTSService
					? GParametres.general.maxECTS
					: aParams.article.nbECTSService;
				return {
					avecAnnotation: false,
					listeAnnotations: [],
					sansNotePossible: true,
					min: 0,
					max: lNbECTSService,
					avecVirgule: true,
					afficherAvecVirgule: false,
				};
			}
		}
	}
	avecMenuContextuel() {
		return false;
	}
	calculerTotalECTS() {
		let lTotalECTS = 0;
		if (this.param.affichage.avecECTS) {
			let lService;
			for (let i = 0; i < this.Donnees.count(); i++) {
				lService = this.Donnees.get(i);
				if (!!lService.ECTS) {
					lTotalECTS += lService.ECTS;
				}
			}
		}
		return new TypeNote(lTotalECTS, 3);
	}
	calculerNombrePointsEleve() {
		let lTotal = 0;
		if (this.param.affichage.AvecNombrePointsEleve) {
			let lService;
			for (let i = 0, lNbr = this.Donnees.count(); i < lNbr; i++) {
				lService = this.Donnees.get(i);
				if (lService.NombrePointsEleve) {
					lTotal += lService.NombrePointsEleve.getValeur();
				}
			}
		}
		return new TypeNote(lTotal, 2);
	}
	getListeLignesTotal() {
		if (this.param.affichage.AvecMoyenneGenerale) {
			const lListe = new ObjetListeElements();
			if (this.param.total !== null && this.param.total !== undefined) {
				lListe.addElement(
					new ObjetElement(
						GTraductions.getValeur("BulletinEtReleve.MoyGen"),
						DonneesListe_BulletinNotes.genreMoyGenerale.moyGen,
					),
				);
			}
			return lListe;
		}
	}
	getContenuTotal(aParams) {
		if (
			aParams.article.Numero ===
			DonneesListe_BulletinNotes.genreMoyGenerale.moyGen
		) {
			const lGeneral = this.param.total;
			const lAffichage = this.param.affichage;
			if (lGeneral !== null && lGeneral !== undefined) {
				switch (aParams.idColonne) {
					case DonneesListe_BulletinNotes.colonnes.matiere:
						return GTraductions.getValeur("BulletinEtReleve.MoyGen");
					case DonneesListe_BulletinNotes.colonnes.rang:
						return lGeneral.ClassementEleve > 0 &&
							lAffichage.AvecClassementGeneral
							? this.moteur.strClassement(lGeneral.ClassementEleve)
							: "";
					case DonneesListe_BulletinNotes.colonnes.evolution:
						return this.moteur.composeHtmlEvolution({
							genreEvol: !!lGeneral.Evolution
								? lGeneral.Evolution.getGenre()
								: 0,
						});
					case DonneesListe_BulletinNotes.colonnes.pts:
						lGeneral.NombrePointsEleve = this.calculerNombrePointsEleve();
						return lGeneral.NombrePointsEleve.getValeur() > 0
							? lGeneral.NombrePointsEleve.getNote()
							: "";
					case DonneesListe_BulletinNotes.colonnes.ects:
						lGeneral.TotalECTS = this.calculerTotalECTS();
						return lGeneral.TotalECTS.getValeur() > 0
							? lGeneral.TotalECTS.getNoteSansDecimaleForcee()
							: "";
					case DonneesListe_BulletinNotes.colonnes.moyEleve:
						return lGeneral.MoyenneEleve &&
							lGeneral.MoyenneEleve.getValeur() > 0
							? lGeneral.MoyenneEleve.getNote()
							: "";
					case DonneesListe_BulletinNotes.colonnes.moyClasse:
						return lGeneral.MoyenneClasse &&
							lGeneral.MoyenneClasse.getValeur() > 0
							? lGeneral.MoyenneClasse.getNote()
							: "";
					case DonneesListe_BulletinNotes.colonnes.moyAnnuelle:
						return lGeneral.MoyenneAnnuelle &&
							lGeneral.MoyenneAnnuelle.getValeur() > 0
							? lGeneral.MoyenneAnnuelle.getNote()
							: "";
					case DonneesListe_BulletinNotes.colonnes.moyDeliberee:
						return lGeneral.moyenneDeliberee &&
							lGeneral.moyenneDeliberee.getValeur() > 0
							? lGeneral.moyenneDeliberee.getNote()
							: "";
					default:
						if (_estColMoyPrec.call(this, aParams.idColonne)) {
							const lIndice = aParams.declarationColonne.indice;
							return lGeneral.ListeMoyennesPeriodes &&
								lGeneral.ListeMoyennesPeriodes[lIndice]
								? lGeneral.ListeMoyennesPeriodes[lIndice].getNote()
								: "";
						}
				}
			}
		}
		return "";
	}
	getClassTotal(aParams) {
		const T = [];
		T.push("Gras");
		if (
			_estColAvecAlignementDroit.call(this, aParams) ||
			aParams.idColonne === DonneesListe_BulletinNotes.colonnes.matiere
		) {
			T.push("AlignementDroit");
		} else if (_estColAvecAlignementMilieu(aParams)) {
			T.push("AlignementMilieu");
		}
		return T.join(" ");
	}
	getTypeCelluleTotal(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_BulletinNotes.colonnes.matiere:
				return ObjetDonneesListe.typeCelluleTotal.fond;
			case DonneesListe_BulletinNotes.colonnes.rang:
			case DonneesListe_BulletinNotes.colonnes.evolution:
			case DonneesListe_BulletinNotes.colonnes.moyAnnuelle:
			case DonneesListe_BulletinNotes.colonnes.pts:
			case DonneesListe_BulletinNotes.colonnes.ects:
			case DonneesListe_BulletinNotes.colonnes.moyEleve:
			case DonneesListe_BulletinNotes.colonnes.moyClasse:
			case DonneesListe_BulletinNotes.colonnes.moyProposee:
			case DonneesListe_BulletinNotes.colonnes.moyDeliberee:
			case DonneesListe_BulletinNotes.colonnes.nivMaitriseEleve:
				return ObjetDonneesListe.typeCelluleTotal.defaut;
			default:
				if (_estColMoyPrec.call(this, aParams.idColonne)) {
					return ObjetDonneesListe.typeCelluleTotal.defaut;
				} else {
					return ObjetDonneesListe.typeCelluleTotal.fond;
				}
		}
	}
	getColonneDeFusionTotal(aParams) {
		let lColRef;
		const lIdCol = aParams.idColonne;
		const lAffichage = this.param.affichage;
		const lColRefMatiere = getColRef_BlocMatiere.call(this);
		if (estColDeBlocMatiere.call(this, lIdCol)) {
			return lColRefMatiere;
		}
		if (!lAffichage.alignementMoyADroite) {
			if (estColDeBlocAppreciations.call(this, lIdCol)) {
				if (existeFinBlocMoyennes.call(this)) {
					lColRef = getColRef_FinBlocMoyennes.call(this);
					return lColRef;
				} else {
					if (existe_BlocMoyennes.call(this)) {
						lColRef = getColRef_BlocAppreciations.call(this);
						return lColRef;
					} else {
						return lColRefMatiere;
					}
				}
			}
		} else {
			if (estColDeBlocAppreciations.call(this, lIdCol)) {
				return lColRefMatiere;
			}
		}
		if (estColDebBlocMoyennes.call(this, lIdCol)) {
			return lColRefMatiere;
		}
		if (estColFinBlocMoyennes.call(this, lIdCol)) {
			lColRef = getColRef_FinBlocMoyennes.call(this);
			return lColRef;
		}
	}
	avecEtatSaisie() {
		return false;
	}
	initOptions(aInstance, aParam) {
		aInstance.setOptionsListe({
			colonnes: this.getColonnesOrdonneesSelonContexte(aParam),
			scrollHorizontal: false,
			colonnesCachees: this.getColonnesCacheesSelonContexte(aParam),
			avecLigneTotal: aParam.affichage.AvecMoyenneGenerale,
			colonnesTriables: false,
			hauteurAdapteContenu: true,
			avecModeAccessible: true,
			nonEditableSurModeExclusif: true,
		});
	}
	avecDeploiementSurColonne(aParams) {
		return (
			aParams.idColonne === DonneesListe_BulletinNotes.colonnes.regroupement
		);
	}
	getPadding(aParams) {
		if (
			aParams.idColonne === DonneesListe_BulletinNotes.colonnes.regroupement
		) {
			return 4;
		}
	}
	getHauteurMinCellule(aParams) {
		if (aParams && aParams.article && aParams.article.estUnDeploiement) {
			return DonneesListe_BulletinNotes.dimensions.hauteurTitre;
		}
		return this.options.hauteurMinCellule;
	}
	getColonnesOrdonneesSelonContexte(aParam) {
		const lDimensions = DonneesListe_BulletinNotes.dimensions;
		const lColonnes = [];
		let i, lNbr, lIdCol;
		lColonnes.push({
			id: DonneesListe_BulletinNotes.colonnes.regroupement,
			taille: lDimensions.largeurRegroupement,
			titre: GTraductions.getValeur("BulletinEtReleve.Matieres"),
		});
		lColonnes.push({
			id: DonneesListe_BulletinNotes.colonnes.matiere,
			taille: lDimensions.largeurService,
			titre: {
				libelle: GTraductions.getValeur("BulletinEtReleve.Matieres"),
				avecFusionColonne: true,
			},
		});
		lColonnes.push({
			id: DonneesListe_BulletinNotes.colonnes.volumeHoraire,
			taille: lDimensions.largeurNote,
			titre: GTraductions.getValeur("BulletinEtReleve.VolH"),
		});
		if (!aParam.affichage.alignementMoyADroite) {
			getColonnesOrdonneesBlocMoyennes.call(this, lColonnes, aParam);
		}
		const lAvecCrayon = this.param.saisie && this.param.avecCrayonEltPgm;
		let lTitre;
		if (lAvecCrayon) {
			lTitre = {
				libelleHtml:
					'<div ie-node="getNodeCrayonElements" class="Image_Crayon1EtatClair InlineBlock" style="margin-right:3px;"></div>' +
					aParam.affichage.intituleElementProgramme,
			};
		} else {
			lTitre = {
				libelle: aParam.affichage.intituleElementProgramme,
				nbLignes: 5,
			};
		}
		lColonnes.push({
			id: DonneesListe_BulletinNotes.colonnes.elmtPgm,
			taille: ObjetListe.initColonne(100, lDimensions.largeurMinAppr),
			titre: lTitre,
			hint: lAvecCrayon
				? _getHintTitreDeCol.call(
						this,
						DonneesListe_BulletinNotes.colonnes.elmtPgm,
					)
				: "",
		});
		for (i = 0, lNbr = aParam.affichage.NombreAppreciations; i < lNbr; i++) {
			const lLibelle =
				aParam.affichage.ListeIntitulesAppreciations.getLibelle(i);
			lIdCol = _getIdColAppreciation.call(this, i);
			lColonnes.push({
				id: lIdCol,
				indice: i,
				taille: ObjetListe.initColonne(100, lDimensions.largeurMinAppr),
				titre: { libelle: lLibelle, nbLignes: 5 },
			});
		}
		if (aParam.affichage.alignementMoyADroite) {
			getColonnesOrdonneesBlocMoyennes.call(this, lColonnes, aParam);
		}
		return lColonnes;
	}
	getColonnesCacheesSelonContexte(aParam) {
		const lColonnesCachees = [];
		const lAffichage = aParam.affichage;
		const lTabColonnes = [
			DonneesListe_BulletinNotes.colonnes.volumeHoraire,
			DonneesListe_BulletinNotes.colonnes.coeff,
			DonneesListe_BulletinNotes.colonnes.nbNotes,
			DonneesListe_BulletinNotes.colonnes.rang,
			DonneesListe_BulletinNotes.colonnes.pts,
			DonneesListe_BulletinNotes.colonnes.ects,
			DonneesListe_BulletinNotes.colonnes.nivMaitriseEleve,
			DonneesListe_BulletinNotes.colonnes.moyEleve,
			DonneesListe_BulletinNotes.colonnes.moyAnnuelle,
			DonneesListe_BulletinNotes.colonnes.moyClasse,
			DonneesListe_BulletinNotes.colonnes.moySup,
			DonneesListe_BulletinNotes.colonnes.moyInf,
			DonneesListe_BulletinNotes.colonnes.moyMediane,
			DonneesListe_BulletinNotes.colonnes.heuresAbs,
			DonneesListe_BulletinNotes.colonnes.evolution,
			DonneesListe_BulletinNotes.colonnes.elmtPgm,
			DonneesListe_BulletinNotes.colonnes.moyProposee,
			DonneesListe_BulletinNotes.colonnes.moyDeliberee,
			DonneesListe_BulletinNotes.colonnes.nbMoyInf8,
			DonneesListe_BulletinNotes.colonnes.nbMoyEntre8Et12,
			DonneesListe_BulletinNotes.colonnes.nbMoySup12,
		];
		let lIdCol;
		for (let i = 0, lNbr = lAffichage.NombreMoyennesPeriodes; i < lNbr; i++) {
			lTabColonnes.push(_getIdColMoyPrec.call(this, i));
		}
		for (let i = 0, lNbr = lTabColonnes.length; i < lNbr; i++) {
			lIdCol = lTabColonnes[i];
			if (!_estColVisible.call(this, lIdCol)) {
				lColonnesCachees.push(lIdCol);
			}
		}
		return lColonnesCachees;
	}
}
DonneesListe_BulletinNotes.colonnes = {
	regroupement: "regroupement",
	matiere: "matiere",
	volumeHoraire: "volumeHoraire",
	coeff: "coeff",
	nbNotes: "nbNotes",
	rang: "rang",
	pts: "pts",
	ects: "ects",
	moyEleve: "moyEleve",
	moyClasse: "moyClasse",
	moySup: "moySup",
	moyInf: "moyInf",
	moyMediane: "moyMediane",
	nivMaitriseEleve: "nivMaitriseEleve",
	moyPrec: "moyPrec",
	moyAnnuelle: "moyAnnuelle",
	heuresAbs: "heuresAbs",
	evolution: "evolution",
	moyProposee: "moyProposee",
	moyDeliberee: "moyDeliberee",
	nbMoyInf8: "nbMoyInf8",
	nbMoyEntre8Et12: "nbMoyEntre8Et12",
	nbMoySup12: "nbMoySup12",
	elmtPgm: "elmtPgm",
	appreciation: "appreciation",
};
DonneesListe_BulletinNotes.dimensions = {
	largeurRegroupement: 4,
	largeurService: 175,
	largeurSousService: 125,
	largeurNote: 45,
	largeurMoyenneDeliberee: 65,
	largeurMinAppr: 160,
	hauteurTitre: 20,
	hauteurService: 45,
	nbMaxProfs: 10,
};
DonneesListe_BulletinNotes.genreMoyGenerale = { moyGen: 1 };
function _estColMoyPrec(aIdCol) {
	return this.moteurGrille.estColVariable(
		aIdCol,
		DonneesListe_BulletinNotes.colonnes.moyPrec,
	);
}
function _getIdColMoyPrec(aIndice) {
	return this.moteurGrille.getIdColVariable(
		aIndice,
		DonneesListe_BulletinNotes.colonnes.moyPrec,
	);
}
function _estColAppreciation(aIdCol) {
	return this.moteurGrille.estColVariable(
		aIdCol,
		DonneesListe_BulletinNotes.colonnes.appreciation,
	);
}
function _getIdColAppreciation(aIndice) {
	return this.moteurGrille.getIdColVariable(
		aIndice,
		DonneesListe_BulletinNotes.colonnes.appreciation,
	);
}
function _estServiceAvisReligion(D) {
	return (
		(D.avisReligionPropose !== null && D.avisReligionPropose !== undefined) ||
		(D.avisReligionDelibere !== null && D.avisReligionDelibere !== undefined)
	);
}
function _estColAvecGras(aParams) {
	return (
		[
			DonneesListe_BulletinNotes.colonnes.volumeHoraire,
			DonneesListe_BulletinNotes.colonnes.coeff,
			DonneesListe_BulletinNotes.colonnes.nbNotes,
			DonneesListe_BulletinNotes.colonnes.rang,
			DonneesListe_BulletinNotes.colonnes.pts,
			DonneesListe_BulletinNotes.colonnes.ects,
			DonneesListe_BulletinNotes.colonnes.moyEleve,
			DonneesListe_BulletinNotes.colonnes.moyClasse,
			DonneesListe_BulletinNotes.colonnes.moySup,
			DonneesListe_BulletinNotes.colonnes.moyInf,
			DonneesListe_BulletinNotes.colonnes.moyMediane,
			DonneesListe_BulletinNotes.colonnes.moyAnnuelle,
			DonneesListe_BulletinNotes.colonnes.heuresAbs,
			DonneesListe_BulletinNotes.colonnes.nbMoyInf8,
			DonneesListe_BulletinNotes.colonnes.nbMoyEntre8Et12,
			DonneesListe_BulletinNotes.colonnes.nbMoySup12,
			DonneesListe_BulletinNotes.colonnes.moyProposee,
			DonneesListe_BulletinNotes.colonnes.moyDeliberee,
		].includes(aParams.idColonne) ||
		_estColMoyPrec.call(this, aParams.idColonne)
	);
}
function _estColAvecAlignementDroit(aParams) {
	return (
		[
			DonneesListe_BulletinNotes.colonnes.volumeHoraire,
			DonneesListe_BulletinNotes.colonnes.coeff,
			DonneesListe_BulletinNotes.colonnes.nbNotes,
			DonneesListe_BulletinNotes.colonnes.rang,
			DonneesListe_BulletinNotes.colonnes.pts,
			DonneesListe_BulletinNotes.colonnes.ects,
			DonneesListe_BulletinNotes.colonnes.moyEleve,
			DonneesListe_BulletinNotes.colonnes.moyClasse,
			DonneesListe_BulletinNotes.colonnes.moySup,
			DonneesListe_BulletinNotes.colonnes.moyInf,
			DonneesListe_BulletinNotes.colonnes.moyMediane,
			DonneesListe_BulletinNotes.colonnes.moyAnnuelle,
			DonneesListe_BulletinNotes.colonnes.heuresAbs,
			DonneesListe_BulletinNotes.colonnes.nbMoyInf8,
			DonneesListe_BulletinNotes.colonnes.nbMoyEntre8Et12,
			DonneesListe_BulletinNotes.colonnes.nbMoySup12,
			DonneesListe_BulletinNotes.colonnes.moyProposee,
			DonneesListe_BulletinNotes.colonnes.moyDeliberee,
		].includes(aParams.idColonne) ||
		_estColMoyPrec.call(this, aParams.idColonne)
	);
}
function _estColAvecAlignementMilieu(aParams) {
	return [DonneesListe_BulletinNotes.colonnes.evolution].includes(
		aParams.idColonne,
	);
}
function _estColFixe(aParams) {
	const lTabColFixe = [
		DonneesListe_BulletinNotes.colonnes.matiere,
		DonneesListe_BulletinNotes.colonnes.volumeHoraire,
		DonneesListe_BulletinNotes.colonnes.coeff,
		DonneesListe_BulletinNotes.colonnes.nbNotes,
		DonneesListe_BulletinNotes.colonnes.rang,
		DonneesListe_BulletinNotes.colonnes.pts,
		DonneesListe_BulletinNotes.colonnes.moySup,
		DonneesListe_BulletinNotes.colonnes.moyInf,
		DonneesListe_BulletinNotes.colonnes.moyMediane,
		DonneesListe_BulletinNotes.colonnes.moyAnnuelle,
		DonneesListe_BulletinNotes.colonnes.heuresAbs,
		DonneesListe_BulletinNotes.colonnes.moyPrec,
		DonneesListe_BulletinNotes.colonnes.evolution,
		DonneesListe_BulletinNotes.colonnes.nbMoyInf8,
		DonneesListe_BulletinNotes.colonnes.nbMoyEntre8Et12,
		DonneesListe_BulletinNotes.colonnes.nbMoySup12,
	];
	if (!this.param.estCtxClasse) {
		lTabColFixe.push(DonneesListe_BulletinNotes.colonnes.moyClasse);
	}
	if (this.param.estEnConsultation) {
		lTabColFixe.push(DonneesListe_BulletinNotes.colonnes.ects);
		lTabColFixe.push(DonneesListe_BulletinNotes.colonnes.moyProposee);
		lTabColFixe.push(DonneesListe_BulletinNotes.colonnes.moyDeliberee);
	}
	return (
		lTabColFixe.includes(aParams.idColonne) ||
		_estColMoyPrec.call(this, aParams.idColonne)
	);
}
function _estColEditable(aParams) {
	const lTabColEditable = [
		DonneesListe_BulletinNotes.colonnes.ects,
		DonneesListe_BulletinNotes.colonnes.elmtPgm,
		DonneesListe_BulletinNotes.colonnes.moyProposee,
		DonneesListe_BulletinNotes.colonnes.moyDeliberee,
	];
	if (lTabColEditable.includes(aParams.idColonne)) {
		return true;
	} else {
		const lEstColAppr = _estColAppreciation.call(this, aParams.idColonne);
		return lEstColAppr;
	}
}
function _estDonneeEditable(aParams) {
	if (!_estColEditable.call(this, aParams)) {
		return false;
	}
	switch (aParams.idColonne) {
		case DonneesListe_BulletinNotes.colonnes.ects:
			return this.param.saisie && aParams.article.ECTSEditable;
		case DonneesListe_BulletinNotes.colonnes.elmtPgm:
			return this.param.saisie && aParams.article.eltsProgrammeEditable;
		case DonneesListe_BulletinNotes.colonnes.moyProposee:
			return this.param.saisie && aParams.article.moyProposeeEditable;
		case DonneesListe_BulletinNotes.colonnes.moyDeliberee:
			return this.param.saisie && aParams.article.moyDelibereeEditable;
		default: {
			const lEstColAppr = _estColAppreciation.call(this, aParams.idColonne);
			if (lEstColAppr) {
				return this.param.saisie && aParams.article.Editable;
			}
			return false;
		}
	}
}
function _estDonneeCloture(aParams) {
	switch (aParams.idColonne) {
		case DonneesListe_BulletinNotes.colonnes.moyProposee:
			return aParams.article.moyProposeeCloture;
		case DonneesListe_BulletinNotes.colonnes.moyDeliberee:
			return aParams.article.moyDelibereeCloture;
		case DonneesListe_BulletinNotes.colonnes.elmtPgm:
			return aParams.article.elementsCloture !== null &&
				aParams.article.elementsCloture !== undefined
				? aParams.article.elementsCloture
				: aParams.article.Cloture;
		default:
			return aParams.article.Cloture;
	}
}
function _estCellEditable(aParams) {
	const lEditable = _estDonneeEditable.call(this, aParams);
	const lCloture = _estDonneeCloture.call(this, aParams);
	return lEditable && !lCloture;
}
function _estColCouleurTotal(aParams) {
	const lTabColFixe = [
		DonneesListe_BulletinNotes.colonnes.moyEleve,
		DonneesListe_BulletinNotes.colonnes.nivMaitriseEleve,
	];
	if (this.param.estCtxClasse) {
		lTabColFixe.push(DonneesListe_BulletinNotes.colonnes.moyClasse);
	}
	return lTabColFixe.includes(aParams.idColonne);
}
function _existeBloc(aTabColBloc) {
	for (let i = 0, lNbr = aTabColBloc.length; i < lNbr; i++) {
		const lIdCol = aTabColBloc[i];
		if (_estColVisible.call(this, lIdCol)) {
			return true;
		}
	}
	return false;
}
function _estColDeBloc(aIdCol, aTabColBloc) {
	return aTabColBloc.includes(aIdCol);
}
function _getPremiereColVisible(aTabCol) {
	let i, lNbr;
	for (i = 0, lNbr = aTabCol.length; i < lNbr; i++) {
		const lIdCol = aTabCol[i];
		if (_estColVisible.call(this, lIdCol)) {
			return lIdCol;
		}
	}
	return null;
}
function _getTabColsFixesBlocMatiere() {
	return [
		DonneesListe_BulletinNotes.colonnes.regroupement,
		DonneesListe_BulletinNotes.colonnes.matiere,
		DonneesListe_BulletinNotes.colonnes.volumeHoraire,
	];
}
function getColRef_BlocMatiere() {
	return DonneesListe_BulletinNotes.colonnes.matiere;
}
function estColDeBlocMatiere(aIdCol) {
	return _estColDeBloc.call(this, aIdCol, _getTabColsFixesBlocMatiere());
}
function _getTabColsFixesBlocMoyennes() {
	return [
		DonneesListe_BulletinNotes.colonnes.coeff,
		DonneesListe_BulletinNotes.colonnes.nbNotes,
		DonneesListe_BulletinNotes.colonnes.rang,
		DonneesListe_BulletinNotes.colonnes.evolution,
		DonneesListe_BulletinNotes.colonnes.moyAnnuelle,
		DonneesListe_BulletinNotes.colonnes.moyProposee,
		DonneesListe_BulletinNotes.colonnes.moyDeliberee,
		DonneesListe_BulletinNotes.colonnes.pts,
		DonneesListe_BulletinNotes.colonnes.ects,
		DonneesListe_BulletinNotes.colonnes.nivMaitriseEleve,
		DonneesListe_BulletinNotes.colonnes.moyEleve,
		DonneesListe_BulletinNotes.colonnes.moyClasse,
		DonneesListe_BulletinNotes.colonnes.moyInf,
		DonneesListe_BulletinNotes.colonnes.moySup,
		DonneesListe_BulletinNotes.colonnes.moyMediane,
		DonneesListe_BulletinNotes.colonnes.nbMoyInf8,
		DonneesListe_BulletinNotes.colonnes.nbMoyEntre8Et12,
		DonneesListe_BulletinNotes.colonnes.nbMoySup12,
		DonneesListe_BulletinNotes.colonnes.heuresAbs,
	];
}
function _getTabDebBlocMoyennes() {
	return [
		DonneesListe_BulletinNotes.colonnes.coeff,
		DonneesListe_BulletinNotes.colonnes.nbNotes,
	];
}
function _getTabFinBlocMoyennes() {
	return [
		DonneesListe_BulletinNotes.colonnes.moyInf,
		DonneesListe_BulletinNotes.colonnes.moySup,
		DonneesListe_BulletinNotes.colonnes.moyMediane,
		DonneesListe_BulletinNotes.colonnes.nbMoyInf8,
		DonneesListe_BulletinNotes.colonnes.nbMoyEntre8Et12,
		DonneesListe_BulletinNotes.colonnes.nbMoySup12,
		DonneesListe_BulletinNotes.colonnes.heuresAbs,
	];
}
function existe_BlocMoyennes() {
	if (_existeBloc.call(this, _getTabColsFixesBlocMoyennes.call(this))) {
		return true;
	}
	return this.param.affichage.AvecMoyennePeriode;
}
function existeFinBlocMoyennes() {
	return _existeBloc.call(this, _getTabFinBlocMoyennes.call(this));
}
function estColDebBlocMoyennes(aIdCol) {
	return _estColDeBloc.call(this, aIdCol, _getTabDebBlocMoyennes.call(this));
}
function estColFinBlocMoyennes(aIdCol) {
	return _estColDeBloc.call(this, aIdCol, _getTabFinBlocMoyennes.call(this));
}
function getColRef_FinBlocMoyennes() {
	const lTabColBloc = _getTabFinBlocMoyennes.call(this);
	return _getPremiereColVisible.call(this, lTabColBloc);
}
function _getTabColsFixesBlocAppreciations() {
	return [DonneesListe_BulletinNotes.colonnes.elmtPgm];
}
function getColRef_BlocAppreciations() {
	const lColFixe = _getPremiereColVisible.call(
		this,
		_getTabColsFixesBlocAppreciations.call(this),
	);
	if (lColFixe !== null) {
		return lColFixe;
	} else {
		const lAffichage = this.param.affichage;
		if (lAffichage.NombreAppreciations > 0) {
			return _getIdColAppreciation.call(this, 0);
		} else {
			return null;
		}
	}
}
function estColDeBlocAppreciations(aIdCol) {
	return (
		_estColDeBloc.call(
			this,
			aIdCol,
			_getTabColsFixesBlocAppreciations.call(this),
		) || _estColAppreciation.call(this, aIdCol)
	);
}
function _estColVisible(aIdCol) {
	const lAffichage = this.param.affichage;
	switch (aIdCol) {
		case DonneesListe_BulletinNotes.colonnes.volumeHoraire:
			return lAffichage.AvecVolumeHoraire;
		case DonneesListe_BulletinNotes.colonnes.coeff:
			return lAffichage.AvecCoefficient;
		case DonneesListe_BulletinNotes.colonnes.nbNotes:
			return lAffichage.AvecNombreDevoirs;
		case DonneesListe_BulletinNotes.colonnes.rang:
			return lAffichage.AvecClassementEleve;
		case DonneesListe_BulletinNotes.colonnes.pts:
			return lAffichage.AvecNombrePointsEleve;
		case DonneesListe_BulletinNotes.colonnes.ects:
			return lAffichage.avecECTS;
		case DonneesListe_BulletinNotes.colonnes.nivMaitriseEleve:
			return lAffichage.AvecNivMaitriseEleve;
		case DonneesListe_BulletinNotes.colonnes.moyEleve:
			return lAffichage.AvecMoyenneEleve;
		case DonneesListe_BulletinNotes.colonnes.moyAnnuelle:
			return lAffichage.AvecMoyenneAnnuelle;
		case DonneesListe_BulletinNotes.colonnes.moyClasse:
			return lAffichage.AvecMoyenneClasse;
		case DonneesListe_BulletinNotes.colonnes.moySup:
		case DonneesListe_BulletinNotes.colonnes.moyInf:
			return lAffichage.AvecMoyenneInfSup;
		case DonneesListe_BulletinNotes.colonnes.moyMediane:
			return lAffichage.AvecMoyenneMediane;
		case DonneesListe_BulletinNotes.colonnes.heuresAbs:
			return lAffichage.AvecDureeDesAbsenses;
		case DonneesListe_BulletinNotes.colonnes.evolution:
			return lAffichage.AvecEvolution;
		case DonneesListe_BulletinNotes.colonnes.elmtPgm:
			return lAffichage.avecElementProgramme;
		case DonneesListe_BulletinNotes.colonnes.moyProposee:
			return lAffichage.AvecMoyenneProposee;
		case DonneesListe_BulletinNotes.colonnes.moyDeliberee:
			return lAffichage.AvecMoyenneDeliberee;
		case DonneesListe_BulletinNotes.colonnes.nbMoyInf8:
		case DonneesListe_BulletinNotes.colonnes.nbMoyEntre8Et12:
		case DonneesListe_BulletinNotes.colonnes.nbMoySup12:
			return lAffichage.AvecNombrePointsEntre;
		default:
			if (_estColMoyPrec.call(this, aIdCol)) {
				return lAffichage.AvecMoyennePeriode;
			} else {
				if (_estColAppreciation.call(this, aIdCol)) {
					return lAffichage.NombreAppreciations > 0;
				} else {
					return true;
				}
			}
	}
}
function _getHintTitreDeCol(aIdCol, aParam) {
	if (
		aIdCol === DonneesListe_BulletinNotes.colonnes.moyEleve ||
		_estColMoyPrec.call(this, aIdCol)
	) {
		let lHintMoyenneEleve;
		const lPeriode = aParam.libellePeriode;
		const lAffichage = aParam.affichage;
		let lEstPosLSU = false;
		if (!lAffichage.pourClasseAvecNotes) {
			const lPosClasse = lAffichage.posClasse;
			lEstPosLSU = lPosClasse === TypePositionnement.POS_ObjApprentissage;
		}
		if (lAffichage.pourClasseAvecNotes) {
			lHintMoyenneEleve = lPeriode
				? GTraductions.getValeur("BulletinEtReleve.HintMoyennePeriode", [
						lPeriode.getLibelle(),
					])
				: GTraductions.getValeur("BulletinEtReleve.HintMoyenne");
		} else if (lAffichage.pourClasseSansNotes) {
			lHintMoyenneEleve = lPeriode
				? lEstPosLSU
					? GTraductions.getValeur(
							"BulletinEtReleve.HintPositionnementObjAppPeriode",
							[lPeriode.getLibelle()],
						)
					: GTraductions.getValeur(
							"BulletinEtReleve.HintPositionnementPeriode",
							[lPeriode.getLibelle()],
						)
				: lEstPosLSU
					? GTraductions.getValeur("BulletinEtReleve.HintPositionnementObjApp")
					: GTraductions.getValeur("BulletinEtReleve.HintPositionnement");
		} else {
			lHintMoyenneEleve = lPeriode
				? lEstPosLSU
					? GTraductions.getValeur(
							"BulletinEtReleve.HintMoyenneOuPositionnementObjAppPeriode",
							[lPeriode.getLibelle()],
						)
					: GTraductions.getValeur(
							"BulletinEtReleve.HintMoyenneOuPositionnementPeriode",
							[lPeriode.getLibelle()],
						)
				: lEstPosLSU
					? GTraductions.getValeur(
							"BulletinEtReleve.HintMoyenneOuPositionnementObjApp",
						)
					: GTraductions.getValeur(
							"BulletinEtReleve.HintMoyenneOuPositionnement",
						);
		}
		if (
			aParam.infosFusionColMoyennes &&
			aParam.infosFusionColMoyennes.avecFusion
		) {
			return ["", lHintMoyenneEleve];
		} else {
			return lHintMoyenneEleve;
		}
	} else {
		switch (aIdCol) {
			case DonneesListe_BulletinNotes.colonnes.elmtPgm:
				return GTraductions.getValeur("BulletinEtReleve.InfoHintElementsPgm");
			default:
				return "";
		}
	}
}
function _getLibelleMoyennes(aParam) {
	let lLibelleMoyennes =
		aParam.nbrMoy === 1
			? GTraductions.getValeur("BulletinEtReleve.Moy")
			: aParam.affichage.AvecMoyenneProposee ||
					aParam.affichage.AvecMoyenneDeliberee
				? GTraductions.getValeur("BulletinEtReleve.MoyCalculee")
				: GTraductions.getValeur("BulletinEtReleve.Moyennes");
	if (aParam.avecFusion) {
		if (
			(aParam.affichage.NombreMoyennesPeriodes > 0 ||
				aParam.affichage.AvecMoyenneAnnuelle) &&
			aParam.periode
		) {
			const lPeriode =
				aParam.affichage.listeLibellesPeriodes.getElementParNumero(
					aParam.periode.getNumero(),
				);
			if (lPeriode) {
				lLibelleMoyennes += " " + lPeriode.getLibelle();
			}
		}
	}
	return lLibelleMoyennes;
}
function _getLibelleMoyEleve(aParam) {
	let lLibelleMoyenneEleve = aParam.avecFusion
		? GTraductions.getValeur("Eleve")
		: GTraductions.getValeur("BulletinEtReleve.Moy");
	if (!aParam.avecFusion) {
		if (aParam.affichage.pourClasseSansNotes) {
			lLibelleMoyenneEleve =
				GTraductions.getValeur("BulletinEtReleve.Pos") +
				"<br/>" +
				GTraductions.getValeur("BulletinEtReleve.Echelle");
		}
		if (
			(aParam.affichage.NombreMoyennesPeriodes > 0 ||
				aParam.affichage.AvecMoyenneAnnuelle) &&
			aParam.periode
		) {
			const lPeriode =
				aParam.affichage.listeAbbreviationsPeriodes.getElementParNumero(
					aParam.periode.getNumero(),
				);
			if (lPeriode) {
				lLibelleMoyenneEleve = lPeriode.getLibelle();
			}
		}
	}
	return lLibelleMoyenneEleve;
}
function _getInfosTitreColMoyennes(aParam) {
	const lResult = {
		avecFusion: false,
		libelleMoyennes: "",
		libelleMoyEleve: "",
	};
	const lAff = aParam.affichage;
	const lNbrMoy =
		Number(lAff.AvecMoyenneEleve) +
		Number(lAff.AvecMoyenneClasse) +
		2 * Number(lAff.AvecMoyenneInfSup) +
		3 * Number(lAff.AvecNombrePointsEntre);
	lResult.avecFusion = !(
		lNbrMoy === 1 &&
		lAff.AvecMoyenneEleve &&
		!(lAff.AvecMoyenneProposee || lAff.AvecMoyenneDeliberee)
	);
	$.extend(aParam, { nbrMoy: lNbrMoy, avecFusion: lResult.avecFusion });
	lResult.libelleMoyennes = _getLibelleMoyennes.call(this, aParam);
	lResult.libelleMoyEleve = _getLibelleMoyEleve.call(this, aParam);
	return lResult;
}
function _estColFusionMoyennes(aIdCol) {
	return [
		DonneesListe_BulletinNotes.colonnes.moyEleve,
		DonneesListe_BulletinNotes.colonnes.moyClasse,
		DonneesListe_BulletinNotes.colonnes.moyInf,
		DonneesListe_BulletinNotes.colonnes.moySup,
		DonneesListe_BulletinNotes.colonnes.moyMediane,
		DonneesListe_BulletinNotes.colonnes.nbMoyInf8,
		DonneesListe_BulletinNotes.colonnes.nbMoyEntre8Et12,
		DonneesListe_BulletinNotes.colonnes.nbMoySup12,
	].includes(aIdCol);
}
function _getTitreDeCol(aIdCol, aParam) {
	const lEstColonneFusionMoyenne = _estColFusionMoyennes.call(this, aIdCol);
	if (lEstColonneFusionMoyenne) {
		const lInfosFusion = aParam.infosFusionColMoyennes;
		const lEstColMoyEleve =
			aIdCol === DonneesListe_BulletinNotes.colonnes.moyEleve;
		if (lInfosFusion.avecFusion) {
			const lTabTitre = [];
			lTabTitre.push({
				libelle: lInfosFusion.libelleMoyennes,
				avecFusionColonne: true,
			});
			lTabTitre.push(
				lEstColMoyEleve ? lInfosFusion.libelleMoyEleve : aParam.titre,
			);
			return lTabTitre;
		} else {
			return lEstColMoyEleve ? lInfosFusion.libelleMoyEleve : aParam.titre;
		}
	} else {
		return aParam.titre;
	}
}
function _estCelluleDeploiement(aParams) {
	return (
		aParams.idColonne === DonneesListe_BulletinNotes.colonnes.regroupement &&
		aParams.article.estUnDeploiement === true
	);
}
function getColonnesOrdonneesBlocMoyennes(aColonnes, aParam) {
	const lDimensions = DonneesListe_BulletinNotes.dimensions;
	let i, lNbr, lIdCol;
	aColonnes.push({
		id: DonneesListe_BulletinNotes.colonnes.coeff,
		taille: lDimensions.largeurNote,
		titre: {
			libelle: GTraductions.getValeur("BulletinEtReleve.Coeff"),
			nbLignes: 5,
		},
		hint: GTraductions.getValeur("BulletinEtReleve.HintCoeff"),
	});
	aColonnes.push({
		id: DonneesListe_BulletinNotes.colonnes.nbNotes,
		taille: lDimensions.largeurNote,
		titre: {
			libelle: GTraductions.getValeur("BulletinEtReleve.NbrNotes"),
			nbLignes: 5,
		},
		hint: GTraductions.getValeur("BulletinEtReleve.HintNbrNotes"),
	});
	aColonnes.push({
		id: DonneesListe_BulletinNotes.colonnes.rang,
		taille: lDimensions.largeurNote,
		titre: {
			libelle: GTraductions.getValeur("BulletinEtReleve.Rang"),
			nbLignes: 5,
		},
		hint: GTraductions.getValeur("BulletinEtReleve.HintRang"),
	});
	aColonnes.push({
		id: DonneesListe_BulletinNotes.colonnes.evolution,
		taille: lDimensions.largeurNote,
		titre: {
			libelle: GTraductions.getValeur("BulletinEtReleve.Evol"),
			nbLignes: 5,
		},
		hint: GTraductions.getValeur("BulletinEtReleve.HintEvol"),
	});
	aColonnes.push({
		id: DonneesListe_BulletinNotes.colonnes.moyAnnuelle,
		taille: lDimensions.largeurNote,
		titre: {
			libelle: GTraductions.getValeur("BulletinEtReleve.MoyAnnee"),
			nbLignes: 5,
		},
		hint: GTraductions.getValeur("BulletinEtReleve.HintMoyAnnee"),
	});
	for (i = 0, lNbr = aParam.affichage.NombreMoyennesPeriodes; i < lNbr; i++) {
		const lAbbPeriode = aParam.affichage.listeAbbreviationsPeriodes.get(i);
		const lLibelleMoyennePeriode = lAbbPeriode ? lAbbPeriode.getLibelle() : "";
		lIdCol = _getIdColMoyPrec.call(this, i);
		aColonnes.push({
			id: lIdCol,
			indice: i,
			taille: lDimensions.largeurNote,
			titre: { libelle: lLibelleMoyennePeriode, nbLignes: 5 },
			hint: _getHintTitreDeCol.call(this, lIdCol, {
				libellePeriode: aParam.affichage.listeLibellesPeriodes.get(i),
				affichage: aParam.affichage,
			}),
		});
	}
	aColonnes.push({
		id: DonneesListe_BulletinNotes.colonnes.moyProposee,
		taille: lDimensions.largeurNote,
		titre: {
			libelle: GTraductions.getValeur("BulletinEtReleve.MoyProposee"),
			nbLignes: 5,
		},
		hint: GTraductions.getValeur("BulletinEtReleve.HintMoyProposee"),
	});
	aColonnes.push({
		id: DonneesListe_BulletinNotes.colonnes.moyDeliberee,
		taille: lDimensions.largeurMoyenneDeliberee,
		titre: {
			libelle: GTraductions.getValeur("BulletinEtReleve.MoyDeliberee"),
			nbLignes: 5,
		},
		hint: GTraductions.getValeur("BulletinEtReleve.HintMoyDeliberee"),
	});
	aColonnes.push({
		id: DonneesListe_BulletinNotes.colonnes.pts,
		taille: lDimensions.largeurNote,
		titre: {
			libelle: GTraductions.getValeur("BulletinEtReleve.Pts"),
			nbLignes: 5,
		},
		hint: GTraductions.getValeur("BulletinEtReleve.PtsHint"),
	});
	aColonnes.push({
		id: DonneesListe_BulletinNotes.colonnes.ects,
		taille: lDimensions.largeurNote,
		titre: {
			libelle: GTraductions.getValeur("BulletinEtReleve.ECTS"),
			nbLignes: 5,
		},
		hint: GTraductions.getValeur("BulletinEtReleve.ECTS"),
	});
	aColonnes.push({
		id: DonneesListe_BulletinNotes.colonnes.nivMaitriseEleve,
		taille: lDimensions.largeurNote,
		titre: GTraductions.getValeur("BulletinEtReleve.Pos"),
		hint: GTraductions.getValeur("BulletinEtReleve.HintPositionnement"),
	});
	const lInfosFusionColMoyennes = _getInfosTitreColMoyennes.call(this, {
		affichage: aParam.affichage,
		periode: this.param.periode,
	});
	aColonnes.push({
		id: DonneesListe_BulletinNotes.colonnes.moyEleve,
		taille: lDimensions.largeurNote,
		titre: _getTitreDeCol.call(
			this,
			DonneesListe_BulletinNotes.colonnes.moyEleve,
			{
				titre: GTraductions.getValeur("Eleve"),
				infosFusionColMoyennes: lInfosFusionColMoyennes,
			},
		),
		hint: _getHintTitreDeCol.call(
			this,
			DonneesListe_BulletinNotes.colonnes.moyEleve,
			{
				libellePeriode:
					aParam.affichage.listeLibellesPeriodes.getElementParNumero(
						this.param.periode.getNumero(),
					),
				affichage: aParam.affichage,
				infosFusionColMoyennes: lInfosFusionColMoyennes,
			},
		),
	});
	aColonnes.push({
		id: DonneesListe_BulletinNotes.colonnes.moyClasse,
		taille: lDimensions.largeurNote,
		titre: _getTitreDeCol.call(
			this,
			DonneesListe_BulletinNotes.colonnes.moyClasse,
			{
				titre: GTraductions.getValeur("Classe"),
				infosFusionColMoyennes: lInfosFusionColMoyennes,
			},
		),
		hint: GTraductions.getValeur("BulletinEtReleve.MoyenneClasse"),
	});
	aColonnes.push({
		id: DonneesListe_BulletinNotes.colonnes.moyInf,
		taille: lDimensions.largeurNote,
		titre: _getTitreDeCol.call(
			this,
			DonneesListe_BulletinNotes.colonnes.moyInf,
			{
				titre: GTraductions.getValeur("BulletinEtReleve.MoyMin"),
				infosFusionColMoyennes: lInfosFusionColMoyennes,
			},
		),
		hint: GTraductions.getValeur("BulletinEtReleve.MoyBasse"),
	});
	aColonnes.push({
		id: DonneesListe_BulletinNotes.colonnes.moySup,
		taille: lDimensions.largeurNote,
		titre: _getTitreDeCol.call(
			this,
			DonneesListe_BulletinNotes.colonnes.moySup,
			{
				titre: GTraductions.getValeur("BulletinEtReleve.MoyMax"),
				infosFusionColMoyennes: lInfosFusionColMoyennes,
			},
		),
		hint: GTraductions.getValeur("BulletinEtReleve.MoyHaute"),
	});
	aColonnes.push({
		id: DonneesListe_BulletinNotes.colonnes.moyMediane,
		taille: lDimensions.largeurNote,
		titre: _getTitreDeCol.call(
			this,
			DonneesListe_BulletinNotes.colonnes.moyMediane,
			{
				titre: GTraductions.getValeur("BulletinEtReleve.MoyMediane"),
				infosFusionColMoyennes: lInfosFusionColMoyennes,
			},
		),
		hint: GTraductions.getValeur("BulletinEtReleve.HintMoyMediane"),
	});
	aColonnes.push({
		id: DonneesListe_BulletinNotes.colonnes.nbMoyInf8,
		taille: lDimensions.largeurNote,
		titre: _getTitreDeCol.call(
			this,
			DonneesListe_BulletinNotes.colonnes.nbMoyInf8,
			{
				titre: GTraductions.getValeur("BulletinEtReleve.MoyInf8"),
				infosFusionColMoyennes: lInfosFusionColMoyennes,
			},
		),
		hint: GTraductions.getValeur("BulletinEtReleve.HintInf8"),
	});
	aColonnes.push({
		id: DonneesListe_BulletinNotes.colonnes.nbMoyEntre8Et12,
		taille: lDimensions.largeurNote,
		titre: _getTitreDeCol.call(
			this,
			DonneesListe_BulletinNotes.colonnes.nbMoyEntre8Et12,
			{
				titre: GTraductions.getValeur("BulletinEtReleve.MoyEntre"),
				infosFusionColMoyennes: lInfosFusionColMoyennes,
			},
		),
		hint: GTraductions.getValeur("BulletinEtReleve.HintEntre"),
	});
	aColonnes.push({
		id: DonneesListe_BulletinNotes.colonnes.nbMoySup12,
		taille: lDimensions.largeurNote,
		titre: _getTitreDeCol.call(
			this,
			DonneesListe_BulletinNotes.colonnes.nbMoySup12,
			{
				titre: GTraductions.getValeur("BulletinEtReleve.MoySup12"),
				infosFusionColMoyennes: lInfosFusionColMoyennes,
			},
		),
		hint: GTraductions.getValeur("BulletinEtReleve.HintSup12"),
	});
	aColonnes.push({
		id: DonneesListe_BulletinNotes.colonnes.heuresAbs,
		taille: lDimensions.largeurNote,
		titre: {
			libelle: GTraductions.getValeur("BulletinEtReleve.HAbs"),
			nbLignes: 5,
		},
		hint: GTraductions.getValeur("BulletinEtReleve.HeuresAbsences"),
	});
}
module.exports = { DonneesListe_BulletinNotes };
