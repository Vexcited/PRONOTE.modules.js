const { GTraductions } = require("ObjetTraduction.js");
const {
	TypeModuleFonctionnelPiedBulletin,
} = require("TypeModuleFonctionnelPiedBulletin.js");
const { TypeContexteBulletin } = require("TypeContexteBulletin.js");
const {
	TypeModeAffichagePiedBulletin,
} = require("TypeModeAffichagePiedBulletin.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { TypeGenreAppreciation } = require("TypeGenreAppreciation.js");
const {
	EGenreAppreciationGenerale,
} = require("Enumere_AppreciationGenerale.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const { ObjetMoteurGrilleSaisie } = require("ObjetMoteurGrilleSaisie.js");
class ObjetMoteurPiedDeBulletin {
	constructor() {
		this.moteurGrille = new ObjetMoteurGrilleSaisie();
	}
	getContexteBulletin(aParam) {
		switch (aParam.typeReleveBulletin) {
			case TypeReleveBulletin.BulletinNotes: {
				const lCtxEleve =
					aParam !== null && aParam !== undefined && aParam.estCtxEleve;
				return lCtxEleve
					? TypeContexteBulletin.CB_Eleve
					: TypeContexteBulletin.CB_Classe;
			}
			case TypeReleveBulletin.ReleveDeNotes:
				return TypeContexteBulletin.CB_Eleve;
			case TypeReleveBulletin.AppreciationsBulletinProfesseur:
				return TypeContexteBulletin.CB_Classe;
			default:
		}
	}
	getModulesHorsOnglets(aParam) {
		const lContexteBulletin = aParam.typeContexteBulletin;
		const lAvecSaisie = aParam.avecSaisie;
		switch (aParam.typeReleveBulletin) {
			case TypeReleveBulletin.BulletinNotes:
				if (lAvecSaisie) {
					return lContexteBulletin === TypeContexteBulletin.CB_Eleve
						? [
								TypeModuleFonctionnelPiedBulletin.MFPB_Projets,
								TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire,
							]
						: [TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire];
				} else {
					return lContexteBulletin === TypeContexteBulletin.CB_Eleve
						? [
								TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
								TypeModuleFonctionnelPiedBulletin.MFPB_Competences,
								TypeModuleFonctionnelPiedBulletin.MFPB_Projets,
								TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire,
								TypeModuleFonctionnelPiedBulletin.MFPB_Certificats,
							]
						: [TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire];
				}
			case TypeReleveBulletin.ReleveDeNotes:
				return [
					TypeModuleFonctionnelPiedBulletin.MFPB_Projets,
					TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire,
				];
			case TypeReleveBulletin.BulletinCompetences:
				if (lAvecSaisie) {
					return lContexteBulletin === TypeContexteBulletin.CB_Eleve
						? [
								TypeModuleFonctionnelPiedBulletin.MFPB_Projets,
								TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire,
							]
						: [TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire];
				} else {
					return lContexteBulletin === TypeContexteBulletin.CB_Eleve
						? [
								TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
								TypeModuleFonctionnelPiedBulletin.MFPB_Projets,
								TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire,
								TypeModuleFonctionnelPiedBulletin.MFPB_Certificats,
							]
						: [
								TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
								TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire,
							];
				}
			case TypeReleveBulletin.ReleveCompetences:
				return lAvecSaisie
					? [
							TypeModuleFonctionnelPiedBulletin.MFPB_Projets,
							TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire,
						]
					: [
							TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
							TypeModuleFonctionnelPiedBulletin.MFPB_Projets,
							TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire,
							TypeModuleFonctionnelPiedBulletin.MFPB_Certificats,
						];
			case TypeReleveBulletin.AppreciationsBulletinParEleve:
				return [];
			default:
		}
	}
	getModulesOnglets(aParam) {
		const lAvecSaisie = aParam.avecSaisie;
		const lContexteBulletin = aParam.typeContexteBulletin;
		switch (aParam.typeReleveBulletin) {
			case TypeReleveBulletin.BulletinNotes:
				if (lAvecSaisie) {
					return lContexteBulletin === TypeContexteBulletin.CB_Eleve
						? [
								TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
								TypeModuleFonctionnelPiedBulletin.MFPB_Competences,
								TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
								TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
								TypeModuleFonctionnelPiedBulletin.MFPB_Stages,
								TypeModuleFonctionnelPiedBulletin.MFPB_Certificats,
								TypeModuleFonctionnelPiedBulletin.MFPB_Credits,
								TypeModuleFonctionnelPiedBulletin.MFPB_Engagements,
							]
						: [
								TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
								TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
								TypeModuleFonctionnelPiedBulletin.MFPB_Mentions,
								TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
							];
				} else {
					return lContexteBulletin === TypeContexteBulletin.CB_Eleve
						? [
								TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
								TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
								TypeModuleFonctionnelPiedBulletin.MFPB_Stages,
								TypeModuleFonctionnelPiedBulletin.MFPB_Legende,
								TypeModuleFonctionnelPiedBulletin.MFPB_Credits,
								TypeModuleFonctionnelPiedBulletin.MFPB_Engagements,
							]
						: [
								TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
								TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
								TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
								TypeModuleFonctionnelPiedBulletin.MFPB_Mentions,
							];
				}
			case TypeReleveBulletin.ReleveDeNotes:
				return [
					TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
					TypeModuleFonctionnelPiedBulletin.MFPB_Engagements,
				];
			case TypeReleveBulletin.BulletinCompetences:
				if (lAvecSaisie) {
					return lContexteBulletin === TypeContexteBulletin.CB_Eleve
						? [
								TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
								TypeModuleFonctionnelPiedBulletin.MFPB_Competences,
								TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
								TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
								TypeModuleFonctionnelPiedBulletin.MFPB_Stages,
								TypeModuleFonctionnelPiedBulletin.MFPB_Certificats,
								TypeModuleFonctionnelPiedBulletin.MFPB_Engagements,
							]
						: [
								TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
								TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
								TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
								TypeModuleFonctionnelPiedBulletin.MFPB_Mentions,
							];
				} else {
					return lContexteBulletin === TypeContexteBulletin.CB_Eleve
						? [
								TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
								TypeModuleFonctionnelPiedBulletin.MFPB_Competences,
								TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
								TypeModuleFonctionnelPiedBulletin.MFPB_Stages,
								TypeModuleFonctionnelPiedBulletin.MFPB_Legende,
								TypeModuleFonctionnelPiedBulletin.MFPB_Engagements,
							]
						: [
								TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
								TypeModuleFonctionnelPiedBulletin.MFPB_Mentions,
								TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
							];
				}
			case TypeReleveBulletin.ReleveCompetences:
				return lAvecSaisie
					? [
							TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
							TypeModuleFonctionnelPiedBulletin.MFPB_Competences,
							TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
							TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
							TypeModuleFonctionnelPiedBulletin.MFPB_Stages,
							TypeModuleFonctionnelPiedBulletin.MFPB_Certificats,
							TypeModuleFonctionnelPiedBulletin.MFPB_Engagements,
						]
					: [
							TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
							TypeModuleFonctionnelPiedBulletin.MFPB_Competences,
							TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
							TypeModuleFonctionnelPiedBulletin.MFPB_Stages,
							TypeModuleFonctionnelPiedBulletin.MFPB_Legende,
							TypeModuleFonctionnelPiedBulletin.MFPB_Engagements,
						];
			case TypeReleveBulletin.AppreciationsBulletinParEleve:
				return [
					TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations_Annuelles,
					TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations_Generales_Annuelles,
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
			case EGenreAppreciationGenerale.AG_Assiduite:
			case EGenreAppreciationGenerale.AG_Autonomie:
			case EGenreAppreciationGenerale.AG_Globale:
			case EGenreAppreciationGenerale.AG_Mention:
				return true;
			default:
				return false;
		}
	}
	estMention(aParam) {
		return (
			!!aParam.appreciation &&
			aParam.appreciation.Genre === EGenreAppreciationGenerale.AG_Mention
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
			case EGenreAppreciationGenerale.AG_Commentaire1:
			case EGenreAppreciationGenerale.AG_Commentaire2:
			case EGenreAppreciationGenerale.AG_Commentaire3:
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
			case EGenreAppreciationGenerale.AG_CPE:
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
			return aParam.typeReleveBulletin === TypeReleveBulletin.ReleveDeNotes
				? TypeGenreAppreciation.GA_Releve_Generale
				: aParam.genreAppr !== null &&
						aParam.genreAppr !== undefined &&
						this.estGenreApprCPE(aParam.genreAppr)
					? TypeGenreAppreciation.GA_Bulletin_CPE
					: TypeGenreAppreciation.GA_Bulletin_Generale;
		} else if (
			this.estGenreApprConseilDeClasse(aParam.genreAppr) ||
			this.estGenreApprCommentaire(aParam.genreAppr)
		) {
			return TypeGenreAppreciation.GA_Bulletin_Generale;
		} else if (this.estGenreApprCPE(aParam.genreAppr)) {
			return TypeGenreAppreciation.GA_Bulletin_CPE;
		}
		return null;
	}
	avecAppCPE(aParam) {
		return (
			aParam.typeReleveBulletin === TypeReleveBulletin.BulletinNotes ||
			aParam.typeReleveBulletin === TypeReleveBulletin.BulletinCompetences
		);
	}
	avecAppConseilDeClasse(aParam) {
		return (
			aParam.typeReleveBulletin === TypeReleveBulletin.BulletinNotes ||
			aParam.typeReleveBulletin === TypeReleveBulletin.BulletinCompetences
		);
	}
	avecAppCommentaire(aParam) {
		return (
			(aParam.typeReleveBulletin === TypeReleveBulletin.BulletinNotes ||
				aParam.typeReleveBulletin === TypeReleveBulletin.BulletinCompetences) &&
			aParam.contexte === TypeContexteBulletin.CB_Eleve
		);
	}
	avecAppAG(aParam) {
		return aParam.typeReleveBulletin === TypeReleveBulletin.ReleveDeNotes;
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
			GTraductions.getValeur("Appreciations.Mentions"),
		);
		lFenetre.setOptionsFenetre({
			titre: GTraductions.getValeur("Appreciations.SaisieMentions"),
			largeur: 300,
			hauteur: 300,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
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
		aParam.article.setEtat(EGenreEtat.Modification);
		const lAppreciation = aParam.appreciation;
		const lElmtSelectionne = aParam.eltSelectionne;
		if (lElmtSelectionne && lElmtSelectionne.existeNumero()) {
			lAppreciation.setEtat(EGenreEtat.Modification);
			lAppreciation.setLibelle(lElmtSelectionne.getLibelle());
		} else {
			lAppreciation.setEtat(EGenreEtat.Suppression);
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
function _getModulesParDefaut(aParam) {
	const lAvecSaisie = aParam.avecSaisie;
	const lContexteBulletin = aParam.typeContexteBulletin;
	switch (aParam.typeReleveBulletin) {
		case TypeReleveBulletin.BulletinNotes:
			if (lAvecSaisie) {
				return lContexteBulletin === TypeContexteBulletin.CB_Eleve
					? [
							TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
							TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
						]
					: [TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations];
			} else {
				return null;
			}
		case TypeReleveBulletin.ReleveDeNotes:
			return lAvecSaisie
				? [TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations]
				: null;
		case TypeReleveBulletin.BulletinCompetences:
			if (lAvecSaisie) {
				return lContexteBulletin === TypeContexteBulletin.CB_Eleve
					? [
							TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
							TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
						]
					: [TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations];
			} else {
				return lContexteBulletin === TypeContexteBulletin.CB_Eleve
					? null
					: [TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations];
			}
		case TypeReleveBulletin.ReleveCompetences:
			return lAvecSaisie
				? [
						TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
						TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
					]
				: null;
		case TypeReleveBulletin.AppreciationsBulletinParEleve:
			return [
				TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
				TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
				TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations_Annuelles,
			];
		default:
	}
}
function _getModeAffichage(aParam) {
	if (
		aParam.typeReleveBulletin ===
		TypeReleveBulletin.AppreciationsBulletinParEleve
	) {
		return TypeModeAffichagePiedBulletin.MAPB_Onglets;
	}
	const lAvecSaisie = aParam.avecSaisie;
	if (GEtatUtilisateur.estModeAccessible()) {
		return TypeModeAffichagePiedBulletin.MAPB_Accessible;
	} else {
		return lAvecSaisie
			? TypeModeAffichagePiedBulletin.MAPB_Onglets
			: TypeModeAffichagePiedBulletin.MAPB_Lineaire;
	}
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
module.exports = { ObjetMoteurPiedDeBulletin };
