exports.ObjetFenetre_EditionQuestionQCM_PN = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetFenetre_EditionQuestionQCM_1 = require("ObjetFenetre_EditionQuestionQCM");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Etat_1 = require("Enumere_Etat");
const DonneesListe_EvaluationsQCM_1 = require("DonneesListe_EvaluationsQCM");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Competences_1 = require("ObjetFenetre_Competences");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
class ObjetFenetre_EditionQuestionQCM_PN extends ObjetFenetre_EditionQuestionQCM_1.ObjetFenetre_EditionQuestionQCM {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = GApplication;
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
		this.hauteurEditeurTexte = 360;
		this.hauteurEditeur = 180;
		this.hauteurListesReponses = 150;
		this.hauteurContenuDonneesListes = 30;
		this.setOptionsFenetreEditionQuestionQCM({
			avecEvaluations:
				!this.etatUtilisateurSco.pourPrimaire() ||
				lApplicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionCompetences,
				),
			avecAffichageBareme: !this.etatUtilisateurSco.pourPrimaire(),
			avecVerificationMatierePourEvaluations:
				this.etatUtilisateurSco.pourPrimaire(),
		});
	}
	construireInstances() {
		super.construireInstances();
		if (this.optionsFenetreEditionQuestion.avecEvaluations) {
			this.identListeEvaluations = this.add(
				ObjetListe_1.ObjetListe,
				this.evenementSurListeEvaluations,
				this.initialiserListeEvaluations,
			);
		}
	}
	setDonnees(aParam) {
		super.setDonnees(aParam);
		if (this.optionsFenetreEditionQuestion.avecEvaluations) {
			let lListeCompetences;
			if (!!this.eltQuestion) {
				if (!this.eltQuestion.listeEvaluations) {
					this.eltQuestion.listeEvaluations =
						new ObjetListeElements_1.ObjetListeElements();
				}
				lListeCompetences = this.eltQuestion.listeEvaluations;
			} else {
				lListeCompetences = new ObjetListeElements_1.ObjetListeElements();
			}
			const lDonneesListe =
				new DonneesListe_EvaluationsQCM_1.DonneesListe_EvaluationsQCM(
					lListeCompetences,
					{
						hauteurMinCellule: this.hauteurContenuDonneesListes,
						avecEditionTBMaitrise: true,
						avecCreationNouvelleCompetence:
							this.etatUtilisateurSco.pourPrimaire(),
						callbackChoixCompetenceDansReferentiel:
							this._ouvrirFenetreCompetences.bind(this),
						avecMessageAucuneMatierePourEvaluations:
							this.optionsFenetreEditionQuestion
								.avecVerificationMatierePourEvaluations &&
							this.qcm &&
							(!this.qcm.matiere || !this.qcm.matiere.existeNumero()),
						listePaliersDesReferentielsUniques:
							aParam.listePaliersDesReferentielsUniques,
					},
				);
			lDonneesListe.setOptions({
				avecEvnt_ApresCreation: true,
				avecEvnt_Suppression: true,
			});
			this.getInstance(this.identListeEvaluations).setDonnees(lDonneesListe);
		}
	}
	initialiserListeEvaluations(aInstance) {
		const lOptions =
			DonneesListe_EvaluationsQCM_1.DonneesListe_EvaluationsQCM.getOptionsListe(
				true,
			);
		$.extend(lOptions, {
			hauteurMaxAdapteContenu: GNavigateur.ecranH < 940 ? 90 : 120,
			hauteurCelluleTitreStandard: this.hauteurContenuDonneesListes,
			hauteurZoneContenuListeMin: this.hauteurContenuDonneesListes,
		});
		aInstance.setOptionsListe(lOptions);
	}
	evenementSurListeEvaluations(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this._ouvrirFenetreCompetences();
				return Enumere_EvenementListe_1.EGenreEvenementListe.Creation;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresCreation:
				this.setBoutonActif(1, true);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
				if (
					aParametres.idColonne ===
					DonneesListe_EvaluationsQCM_1.DonneesListe_EvaluationsQCM.colonnes
						.maitrise
				) {
					aParametres.article.tbMaitrise = !aParametres.article.tbMaitrise;
					aParametres.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					this.actualiserListeEvaluations();
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				this.setBoutonActif(1, true);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				this.setBoutonActif(1, true);
				break;
		}
	}
	actualiserListeEvaluations() {
		if (this.optionsFenetreEditionQuestion.avecEvaluations) {
			this.getInstance(this.identListeEvaluations).actualiser(true);
			this.setBoutonActif(1, true);
		}
	}
	composeContenu() {
		const T = [];
		T.push(super.composeContenu());
		if (this.eltQuestion) {
			if (this.optionsFenetreEditionQuestion.avecEvaluations) {
				T.push(this.composeEvaluation());
			}
		}
		return T.join("");
	}
	composeEvaluation() {
		const T = [];
		T.push(
			'<div class="Espace MargeHaut"><div id="' +
				this.getNomInstance(this.identListeEvaluations) +
				'" style="width: 100%;"></div>',
		);
		return T.join("");
	}
	surValidation(aNumeroBouton) {
		super.surValidation(aNumeroBouton);
	}
	_ouvrirFenetreCompetences() {
		if (
			this.optionsFenetreEditionQuestion
				.avecVerificationMatierePourEvaluations &&
			this.qcm &&
			(!this.qcm.matiere || !this.qcm.matiere.existeNumero())
		) {
			GApplication.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				message: ObjetTraduction_1.GTraductions.getValeur(
					"QCM_Divers.MatiereObligatoire",
				),
			});
		} else if (!!this.eltQuestion) {
			const lInstance = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_Competences_1.ObjetFenetre_Competences,
				{
					pere: this,
					evenement: this._surEvenementFenetreCompetences.bind(this),
					initialiser: false,
				},
			);
			lInstance.setOptionsFenetre({
				modale: true,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"competences.choixCompetencesConnaissancesAEvaluer",
				),
				largeur: 620,
				hauteur: 420,
				listeBoutons: [
					ObjetTraduction_1.GTraductions.getValeur("Annuler"),
					ObjetTraduction_1.GTraductions.getValeur("Valider"),
				],
			});
			lInstance.initialiser();
			const lListeCompetences = !!this.eltQuestion.listeEvaluations
				? MethodesObjet_1.MethodesObjet.dupliquer(
						this.eltQuestion.listeEvaluations,
					)
				: new ObjetListeElements_1.ObjetListeElements();
			lInstance.setDonnees({
				listeCompetences: lListeCompetences,
				qcm: this.qcm,
				optionsContexte: {
					avecControleCompetenceLVE: false,
					avecColonneNombreRelations: false,
				},
			});
		} else {
		}
	}
	_surEvenementFenetreCompetences(aGenreBouton, aListeCompetencesDEvaluation) {
		if (aGenreBouton === 1) {
			if (!!this.eltQuestion && !!this.eltQuestion.listeEvaluations) {
				this.eltQuestion.listeEvaluations.vider();
				this.eltQuestion.listeEvaluations.add(aListeCompetencesDEvaluation);
				this.actualiserListeEvaluations();
			} else {
			}
		}
	}
}
exports.ObjetFenetre_EditionQuestionQCM_PN = ObjetFenetre_EditionQuestionQCM_PN;
