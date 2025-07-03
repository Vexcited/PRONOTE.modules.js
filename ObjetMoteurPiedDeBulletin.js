exports.ObjetMoteurPiedDeBulletin = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeModuleFonctionnelPiedBulletin_1 = require("TypeModuleFonctionnelPiedBulletin");
const TypeContexteBulletin_1 = require("TypeContexteBulletin");
const TypeModeAffichagePiedBulletin_1 = require("TypeModeAffichagePiedBulletin");
const Enumere_Etat_1 = require("Enumere_Etat");
const TypeGenreAppreciation_1 = require("TypeGenreAppreciation");
const Enumere_AppreciationGenerale_1 = require("Enumere_AppreciationGenerale");
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const ObjetMoteurGrilleSaisie_1 = require("ObjetMoteurGrilleSaisie");
class ObjetMoteurPiedDeBulletin {
	constructor() {
		this.moteurGrille = new ObjetMoteurGrilleSaisie_1.ObjetMoteurGrilleSaisie();
	}
	getContexteBulletin(aParam) {
		switch (aParam.typeReleveBulletin) {
			case TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes: {
				const lCtxEleve =
					aParam !== null && aParam !== undefined && aParam.estCtxEleve;
				return lCtxEleve
					? TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve
					: TypeContexteBulletin_1.TypeContexteBulletin.CB_Classe;
			}
			case TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes:
				return TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve;
			case TypeReleveBulletin_1.TypeReleveBulletin
				.AppreciationsBulletinProfesseur:
				return TypeContexteBulletin_1.TypeContexteBulletin.CB_Classe;
			default:
		}
	}
	getModulesHorsOnglets(aParam) {
		const lContexteBulletin = aParam.typeContexteBulletin;
		const lAvecSaisie = aParam.avecSaisie;
		switch (aParam.typeReleveBulletin) {
			case TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes:
				if (lAvecSaisie) {
					return lContexteBulletin ===
						TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve
						? [
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Projets,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire,
							]
						: [
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire,
							];
				} else {
					return lContexteBulletin ===
						TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve
						? [
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Competences,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Projets,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Certificats,
							]
						: [
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire,
							];
				}
			case TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes:
				return [
					TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
						.MFPB_Projets,
					TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
						.MFPB_VieScolaire,
				];
			case TypeReleveBulletin_1.TypeReleveBulletin.BulletinCompetences:
				if (lAvecSaisie) {
					return lContexteBulletin ===
						TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve
						? [
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Projets,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire,
							]
						: [
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire,
							];
				} else {
					return lContexteBulletin ===
						TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve
						? [
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Projets,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Certificats,
							]
						: [
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire,
							];
				}
			case TypeReleveBulletin_1.TypeReleveBulletin.ReleveCompetences:
				return lAvecSaisie
					? [
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Projets,
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire,
						]
					: [
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Projets,
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire,
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Certificats,
						];
			case TypeReleveBulletin_1.TypeReleveBulletin
				.AppreciationsBulletinParEleve:
				return [];
			default:
		}
	}
	getModulesOnglets(aParam) {
		const lAvecSaisie = aParam.avecSaisie;
		const lContexteBulletin = aParam.typeContexteBulletin;
		switch (aParam.typeReleveBulletin) {
			case TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes:
				if (lAvecSaisie) {
					return lContexteBulletin ===
						TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve
						? [
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Competences,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Stages,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Certificats,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Credits,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Engagements,
							]
						: [
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Mentions,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
							];
				} else {
					return lContexteBulletin ===
						TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve
						? [
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Stages,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Legende,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Credits,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Engagements,
							]
						: [
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Mentions,
							];
				}
			case TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes:
				return [
					TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
						.MFPB_Appreciations,
					TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
						.MFPB_Engagements,
				];
			case TypeReleveBulletin_1.TypeReleveBulletin.BulletinCompetences:
				if (lAvecSaisie) {
					return lContexteBulletin ===
						TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve
						? [
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Competences,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Stages,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Certificats,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Engagements,
							]
						: [
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Mentions,
							];
				} else {
					return lContexteBulletin ===
						TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve
						? [
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Competences,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Stages,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Legende,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Engagements,
							]
						: [
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Mentions,
								TypeModuleFonctionnelPiedBulletin_1
									.TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
							];
				}
			case TypeReleveBulletin_1.TypeReleveBulletin.ReleveCompetences:
				return lAvecSaisie
					? [
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Competences,
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Stages,
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Certificats,
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Engagements,
						]
					: [
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Competences,
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Stages,
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Legende,
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Engagements,
						];
			case TypeReleveBulletin_1.TypeReleveBulletin
				.AppreciationsBulletinParEleve:
				return [
					TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
						.MFPB_Appreciations_Annuelles,
					TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
						.MFPB_Appreciations_Generales_Annuelles,
				];
			default:
		}
	}
	initPiedPage(aInstance, aParam) {
		const lContexteBulletin =
			aParam.typeContexteBulletin !== null &&
			aParam.typeContexteBulletin !== undefined
				? aParam.typeContexteBulletin
				: this.getContexteBulletin(aParam);
		const lParam = $.extend(aParam, {
			typeContexteBulletin: lContexteBulletin,
		});
		const lParametres = {
			typeReleveBulletin: lParam.typeReleveBulletin,
			modeSaisie: lParam.avecSaisie,
			modeAffichage: _getModeAffichage.call(this, lParam),
			contexte: lContexteBulletin,
			modulesHorsOnglets: this.getModulesHorsOnglets(lParam),
			modulesOnglets: this.getModulesOnglets(lParam),
			avecContenuVide: lParam.avecSaisie,
			avecValidationAuto: lParam.avecValidationAuto,
			clbckValidationAutoSurEdition: lParam.clbckValidationAutoSurEdition,
		};
		const lDefaultModule = _getModulesParDefaut.call(this, lParam);
		if (lDefaultModule !== null) {
			$.extend(lParametres, { modulesParDefaut: lDefaultModule });
		}
		aInstance.setParametres(lParametres);
	}
	estAppreciationGenerale(aParam) {
		if (!aParam.appreciation) {
			return false;
		}
		return this.estGenreApprGenerale(aParam.appreciation.Genre);
	}
	estGenreApprGenerale(aGenreAppr) {
		switch (aGenreAppr) {
			case 0:
				return true;
			default:
				return false;
		}
	}
	estAppreciationConseilDeClasse(aParam) {
		if (!aParam.appreciation) {
			return false;
		}
		return this.estGenreApprConseilDeClasse(aParam.appreciation.Genre);
	}
	estGenreApprConseilDeClasse(aGenreAppr) {
		switch (aGenreAppr) {
			case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
				.AG_Assiduite:
			case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
				.AG_Autonomie:
			case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale.AG_Globale:
			case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale.AG_Mention:
				return true;
			default:
				return false;
		}
	}
	estMention(aParam) {
		return (
			!!aParam.appreciation &&
			aParam.appreciation.Genre ===
				Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale.AG_Mention
		);
	}
	estAppreciationCommentaire(aParam) {
		if (!aParam.appreciation) {
			return false;
		}
		return this.estGenreApprCommentaire(aParam.appreciation.Genre);
	}
	estGenreApprCommentaire(aGenreAppr) {
		switch (aGenreAppr) {
			case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
				.AG_Commentaire1:
			case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
				.AG_Commentaire2:
			case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale
				.AG_Commentaire3:
				return true;
			default:
				return false;
		}
	}
	estAppreciationCPE(aParam) {
		if (!aParam.appreciation) {
			return false;
		}
		return this.estGenreApprCPE(aParam.appreciation.Genre);
	}
	estGenreApprCPE(aGenreAppr) {
		switch (aGenreAppr) {
			case Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale.AG_CPE:
				return true;
			default:
				return false;
		}
	}
	getTypeGenreAppreciationPdB(aParam) {
		if (
			aParam.estCtxApprGenerale === true ||
			this.estGenreApprGenerale(aParam.genreAppr)
		) {
			return aParam.typeReleveBulletin ===
				TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes
				? TypeGenreAppreciation_1.TypeGenreAppreciation.GA_Releve_Generale
				: aParam.genreAppr !== null &&
						aParam.genreAppr !== undefined &&
						this.estGenreApprCPE(aParam.genreAppr)
					? TypeGenreAppreciation_1.TypeGenreAppreciation.GA_Bulletin_CPE
					: TypeGenreAppreciation_1.TypeGenreAppreciation.GA_Bulletin_Generale;
		} else if (
			this.estGenreApprConseilDeClasse(aParam.genreAppr) ||
			this.estGenreApprCommentaire(aParam.genreAppr)
		) {
			return TypeGenreAppreciation_1.TypeGenreAppreciation.GA_Bulletin_Generale;
		} else if (this.estGenreApprCPE(aParam.genreAppr)) {
			return TypeGenreAppreciation_1.TypeGenreAppreciation.GA_Bulletin_CPE;
		}
		return null;
	}
	avecAppCPE(aParam) {
		return (
			aParam.typeReleveBulletin ===
				TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes ||
			aParam.typeReleveBulletin ===
				TypeReleveBulletin_1.TypeReleveBulletin.BulletinCompetences
		);
	}
	avecAppConseilDeClasse(aParam) {
		return (
			aParam.typeReleveBulletin ===
				TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes ||
			aParam.typeReleveBulletin ===
				TypeReleveBulletin_1.TypeReleveBulletin.BulletinCompetences
		);
	}
	avecAppCommentaire(aParam) {
		return (
			(aParam.typeReleveBulletin ===
				TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes ||
				aParam.typeReleveBulletin ===
					TypeReleveBulletin_1.TypeReleveBulletin.BulletinCompetences) &&
			aParam.contexte === TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve
		);
	}
	avecAppAG(aParam) {
		return (
			aParam.typeReleveBulletin ===
			TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes
		);
	}
	evenementOuvrirMentions(aParam) {
		const lFenetre = aParam.instanceFenetre;
		if (lFenetre !== null && lFenetre !== undefined) {
			lFenetre.setDonnees(aParam.listeMentions);
			lFenetre.focusSurPremierElement();
		}
	}
	initialiserMentions(aParam) {
		const lFenetre = aParam.instanceFenetre;
		lFenetre.setParametresMention(
			ObjetTraduction_1.GTraductions.getValeur("Appreciations.Mentions"),
		);
		lFenetre.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Appreciations.SaisieMentions",
			),
			largeur: 300,
			hauteur: 300,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	evenementMention(aGenreBouton, aParam) {
		const lElmtMention = aParam.instanceFenetre.getMentionSelectionnee();
		$.extend(aParam, { eltSelectionne: lElmtMention });
		this.traiterSelectionMention(aGenreBouton, aParam);
	}
	traiterSelectionMention(aGenreBouton, aParam) {
		switch (aGenreBouton) {
			case 1: {
				this.validerDonneesMentionSurValider(aParam);
				const lInstanceListe = aParam.instanceListe;
				if (
					aParam.avecValidationAuto === true &&
					aParam.clbckValidationAutoSurEdition !== null &&
					aParam.clbckValidationAutoSurEdition !== undefined
				) {
					const lParam = {
						instanceListe: lInstanceListe,
						appreciation: aParam.appreciation,
					};
					if (aParam.global === true) {
						$.extend(lParam, { periode: aParam.article });
					}
					aParam.clbckValidationAutoSurEdition(lParam);
				} else {
					lInstanceListe.actualiser(true);
					this.moteurGrille.selectionCelluleSuivante({
						instanceListe: lInstanceListe,
						suivante: { orientationVerticale: false },
					});
				}
				break;
			}
			default:
				break;
		}
	}
	validerDonneesMentionSurValider(aParam) {
		aParam.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		const lAppreciation = aParam.appreciation;
		const lElmtSelectionne = aParam.eltSelectionne;
		if (lElmtSelectionne && lElmtSelectionne.existeNumero()) {
			lAppreciation.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			lAppreciation.setLibelle(lElmtSelectionne.getLibelle());
		} else {
			lAppreciation.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			lAppreciation.Libelle = "";
		}
		lAppreciation.setNumero(lElmtSelectionne.getNumero());
	}
	majAppreciationPdBParPeriode(aParam) {
		_majAppreciation.call(this, $.extend(aParam, { parPeriode: true }));
	}
	majAppreciationPdB(aParam) {
		_majAppreciation.call(this, $.extend(aParam, { parPeriode: false }));
	}
	clbckValidationAutoSurEditionPdB(aCtx, aParam) {
		const lListe = aParam.instanceListe;
		const lEstCtxPiedBulletin = true;
		const lAppr = aParam.appreciation;
		let lTypeGenreAppreciation =
			aParam.global === false &&
			aCtx.typeGenreAppreciation !== null &&
			aCtx.typeGenreAppreciation !== undefined
				? aCtx.typeGenreAppreciation
				: this.getTypeGenreAppreciationPdB({
						estCtxPied: lEstCtxPiedBulletin,
						eleve: aCtx.eleve,
						typeReleveBulletin: aCtx.typeReleveBulletin,
						genreAppr: lAppr ? lAppr.Genre : null,
					});
		aCtx.clbckSaisieAppreciation(
			{
				instanceListe: lListe,
				estCtxPied: lEstCtxPiedBulletin,
				global: aParam.global,
				suivante: aParam.suivante,
			},
			{
				classe: aCtx.classe,
				periode: aCtx.periode,
				eleve: aCtx.eleve,
				service: aCtx.service,
				appreciation: lAppr,
				typeGenreAppreciation: lTypeGenreAppreciation,
			},
		);
	}
}
exports.ObjetMoteurPiedDeBulletin = ObjetMoteurPiedDeBulletin;
function _getModulesParDefaut(aParam) {
	const lAvecSaisie = aParam.avecSaisie;
	const lContexteBulletin = aParam.typeContexteBulletin;
	switch (aParam.typeReleveBulletin) {
		case TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes:
			if (lAvecSaisie) {
				return lContexteBulletin ===
					TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve
					? [
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
						]
					: [
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
						];
			} else {
				return null;
			}
		case TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes:
			return lAvecSaisie
				? [
						TypeModuleFonctionnelPiedBulletin_1
							.TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
					]
				: null;
		case TypeReleveBulletin_1.TypeReleveBulletin.BulletinCompetences:
			if (lAvecSaisie) {
				return lContexteBulletin ===
					TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve
					? [
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
						]
					: [
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
						];
			} else {
				return lContexteBulletin ===
					TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve
					? null
					: [
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
						];
			}
		case TypeReleveBulletin_1.TypeReleveBulletin.ReleveCompetences:
			return lAvecSaisie
				? [
						TypeModuleFonctionnelPiedBulletin_1
							.TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
						TypeModuleFonctionnelPiedBulletin_1
							.TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
					]
				: null;
		case TypeReleveBulletin_1.TypeReleveBulletin.AppreciationsBulletinParEleve:
			return [
				TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
					.MFPB_Orientations,
				TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
					.MFPB_Appreciations,
				TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
					.MFPB_Appreciations_Annuelles,
			];
		default:
	}
}
function _getModeAffichage(aParam) {
	if (
		aParam.typeReleveBulletin ===
		TypeReleveBulletin_1.TypeReleveBulletin.AppreciationsBulletinParEleve
	) {
		return TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
			.MAPB_Onglets;
	}
	const lAvecSaisie = aParam.avecSaisie;
	return lAvecSaisie
		? TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin.MAPB_Onglets
		: TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Lineaire;
}
function _majAppreciation(aParam) {
	const lDonnees = aParam.instanceListe.getListeArticles();
	const lIndice = lDonnees.getIndiceElementParFiltre((aElt) => {
		if (aParam.parPeriode) {
			return aElt.getNumero() === aParam.numeroPeriode;
		} else {
			return aElt.getGenre() === aParam.rangAppr;
		}
	});
	const lLigne = lDonnees.get(lIndice);
	const lListe = aParam.parPeriode
		? aParam.global === true
			? lLigne.listeAppreciationsGenerales
			: lLigne.listeAppreciations
		: lLigne.ListeAppreciations;
	const lIndiceAppr = lListe.getIndiceElementParFiltre((aElt) => {
		return aElt.getGenre() === aParam.apprSaisie.getGenre();
	});
	if (lIndiceAppr !== -1) {
		const lAppr = lListe.get(lIndiceAppr);
		const lApprSaisie = aParam.apprSaisie;
		lAppr.setLibelle(lApprSaisie.getLibelle());
		lAppr.setNumero(lApprSaisie.getNumero());
		lAppr.setEtat(lApprSaisie.Etat);
	} else {
	}
}
