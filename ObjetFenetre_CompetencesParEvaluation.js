exports.ObjetFenetre_CompetencesParEvaluation = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetRequeteSaisieEvaluations_1 = require("ObjetRequeteSaisieEvaluations");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetListeElements_1 = require("ObjetListeElements");
const InterfaceCompetencesParEvaluation_1 = require("InterfaceCompetencesParEvaluation");
const ObjetHtml_1 = require("ObjetHtml");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const TypeGenreValidationCompetence_1 = require("TypeGenreValidationCompetence");
const TypeModeAssociationDevoirEvaluation_1 = require("TypeModeAssociationDevoirEvaluation");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const ObjetRequeteSaisieNotesUnitaire_1 = require("ObjetRequeteSaisieNotesUnitaire");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_CompetencesParEvaluation extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationScoEspace = (0, AccessApp_1.getApp)();
		this.etatUtilisateurScoEspace =
			this.applicationScoEspace.getEtatUtilisateur();
		if (
			this.etatUtilisateurScoEspace.competences_modeSaisieClavierVertical ===
			undefined
		) {
			this.etatUtilisateurScoEspace.competences_modeSaisieClavierVertical = true;
		}
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Notes.TitreCompetencesParEvaluation",
			),
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
			largeur: 790,
		});
		this.estFenetreEditionCommentaireSurNoteUniquement = false;
	}
	construireInstances() {
		this.identCompetencesParEvaluation = this.add(
			InterfaceCompetencesParEvaluation_1.InterfaceCompetencesParEvaluation,
			this._evenementSurCompetencesParEvaluation,
		);
	}
	setDonnees(aParams, aOptionsAffichage) {
		const lDevoirDuplique = MethodesObjet_1.MethodesObjet.dupliquer(
			aParams.devoir,
		);
		lDevoirDuplique.evaluation = null;
		lDevoirDuplique.modeAssociation =
			TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE.tMIADE_Modification;
		if (aParams.devoir && aParams.devoir.evaluation) {
			aParams.devoir.evaluation.devoir = lDevoirDuplique;
		}
		this.listeEvaluations = new ObjetListeElements_1.ObjetListeElements();
		if (aParams.devoir.evaluation) {
			this.listeEvaluations.addElement(aParams.devoir.evaluation);
		}
		this.getInstance(this.identCompetencesParEvaluation).setParametres({
			hauteurAdapteContenu: true,
		});
		this.getInstance(
			this.identCompetencesParEvaluation,
		).setOptionsAffichageListe({
			afficherProjetsAccompagnement:
				aOptionsAffichage.afficherProjetsAccompagnement,
		});
		this.getInstance(
			this.identCompetencesParEvaluation,
		).setAfficherCommentaireSurNote(
			aOptionsAffichage.afficherCommentaireSurNote,
		);
		this.getInstance(this.identCompetencesParEvaluation).setDonnees(aParams);
		this.updateTitre();
		this.afficher();
	}
	composeContenu() {
		const H = [];
		H.push(
			'<div class="m-bottom" style="display: flex; justify-content: end; gap: 0.5rem;">',
			'<span ie-html="getLibelleDevoir"></span>',
			`<div ie-if="btnMrFiche.avecBtn">${UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche("btnMrFiche")}</div>`,
			UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnSaisieHorizontalVertical(
				"btnHV",
			),
			"</div>",
		);
		H.push(
			'<div id="',
			this.getNomInstance(this.identCompetencesParEvaluation),
			'"></div>',
		);
		return H.join("");
	}
	saisieNotesUnitaire(aParamEvnt) {
		if (
			this.applicationScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.estEnConsultation,
			)
		) {
			return;
		}
		new ObjetRequeteSaisieNotesUnitaire_1.ObjetRequeteSaisieNotesUnitaire(
			this,
			() => {
				if (aParamEvnt && aParamEvnt.eleve) {
					aParamEvnt.eleve.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
					if (aParamEvnt.devoir && aParamEvnt.devoir.listeEleves) {
						const lEleveDuDevoir =
							aParamEvnt.devoir.listeEleves.getElementParNumero(
								aParamEvnt.eleve.getNumero(),
							);
						if (lEleveDuDevoir) {
							lEleveDuDevoir.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
						}
					}
				}
			},
		).lancerRequete(aParamEvnt);
	}
	saisieUnitaire() {
		if (
			!this.applicationScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.estEnConsultation,
			)
		) {
			const lListeEvaluations = this.listeEvaluations;
			new ObjetRequeteSaisieEvaluations_1.ObjetRequeteSaisieEvaluations(this)
				.setOptions({
					sansBlocageInterface: true,
					afficherMessageErreur: false,
				})
				.lancerRequete(
					this.etatUtilisateurScoEspace.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Service,
					),
					this.etatUtilisateurScoEspace.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Classe,
					),
					lListeEvaluations,
				);
			if (!!lListeEvaluations) {
				lListeEvaluations.parcourir((aEval) => {
					if (aEval.listeEleves) {
						aEval.listeEleves.parcourir((aEleve) => {
							if (aEleve.pourValidation()) {
								aEleve.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
								if (!!aEleve.listeCompetences) {
									aEleve.listeCompetences.parcourir((aCompetence) => {
										if (aCompetence.pourValidation()) {
											aCompetence.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
										}
									});
								}
							}
						});
					}
				});
			}
		}
	}
	surValidation(aNumeroBouton) {
		if (!!this.listeEvaluations) {
			this.listeEvaluations.parcourir((D) => {
				D.enCache = false;
			});
		}
		this.callback.appel(aNumeroBouton);
		this.fermer();
	}
	_evenementSurCompetencesParEvaluation(aGenre, aParams) {
		switch (aGenre) {
			case InterfaceCompetencesParEvaluation_1
				.EGenreEvenementCompetencesParEvaluation.recupererDonnees:
				this.positionnerFenetre();
				break;
			case InterfaceCompetencesParEvaluation_1
				.EGenreEvenementCompetencesParEvaluation.editerCompetence:
				this.saisieUnitaire();
				break;
			case InterfaceCompetencesParEvaluation_1
				.EGenreEvenementCompetencesParEvaluation.editionNote:
			case InterfaceCompetencesParEvaluation_1
				.EGenreEvenementCompetencesParEvaluation.editionCommentaireSurNote:
				this.estFenetreEditionCommentaireSurNoteUniquement
					? this.saisieNotesUnitaire(aParams)
					: this.saisieUnitaire();
				break;
		}
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getLibelleDevoir() {
				return "";
			},
			btnMrFiche: {
				event() {
					const lElement = null;
					UtilitaireCompetences_1.TUtilitaireCompetences.afficherAideSaisieNiveauMaitrise(
						{
							genreChoixValidationCompetence:
								TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
									.tGVC_EvaluationEtItem,
							callback: function () {
								ObjetHtml_1.GHtml.setFocus(lElement);
							},
						},
					);
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"competences.TitreAideSaisieNivMaitrise",
					);
				},
				avecBtn() {
					return !aInstance.estFenetreEditionCommentaireSurNoteUniquement;
				},
			},
			btnHV: {
				event() {
					aInstance.etatUtilisateurScoEspace.competences_modeSaisieClavierVertical =
						!aInstance.etatUtilisateurScoEspace
							.competences_modeSaisieClavierVertical;
				},
				getSelection() {
					return aInstance.etatUtilisateurScoEspace
						.competences_modeSaisieClavierVertical;
				},
				getTitle() {
					return aInstance.etatUtilisateurScoEspace
						.competences_modeSaisieClavierVertical
						? ObjetTraduction_1.GTraductions.getValeur(
								"competences.SensDeSaisieHorizontal",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"competences.SensDeSaisieVertical",
							);
				},
				getClassesMixIcon() {
					return UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getClassesMixIconSaisieHorizontalVertical(
						aInstance.etatUtilisateurScoEspace
							.competences_modeSaisieClavierVertical,
					);
				},
			},
		});
	}
	setEstFenetreEditionCommentaireSurNoteUniquement(aValeur) {
		this.estFenetreEditionCommentaireSurNoteUniquement = aValeur;
	}
	updateTitre() {
		let lTitre = ObjetTraduction_1.GTraductions.getValeur(
			"Notes.TitreCompetencesParEvaluation",
		);
		if (
			this.getInstance(
				this.identCompetencesParEvaluation,
			).avecAffichageCommentaireSurNote()
		) {
			if (this.estFenetreEditionCommentaireSurNoteUniquement) {
				lTitre = ObjetTraduction_1.GTraductions.getValeur(
					"Notes.TitreCompetencesParEvaluationRemarquesUniquement",
				);
			} else {
				lTitre = ObjetTraduction_1.GTraductions.getValeur(
					"Notes.TitreCompetencesParEvaluationEtRemarque",
				);
			}
		}
		this.setOptionsFenetre({ titre: lTitre });
	}
}
exports.ObjetFenetre_CompetencesParEvaluation =
	ObjetFenetre_CompetencesParEvaluation;
