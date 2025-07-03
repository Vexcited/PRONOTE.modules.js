exports.InterfaceCompetencesNumeriques_Saisie = void 0;
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const _InterfaceCompetencesNumeriques_1 = require("_InterfaceCompetencesNumeriques");
const DonneesListe_CompetencesNumeriques_1 = require("DonneesListe_CompetencesNumeriques");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const ObjetRequeteSaisieCompetencesNumeriques_1 = require("ObjetRequeteSaisieCompetencesNumeriques");
const TypeGenreValidationCompetence_1 = require("TypeGenreValidationCompetence");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const TypeNiveauEquivalenceCE_1 = require("TypeNiveauEquivalenceCE");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const Invocateur_1 = require("Invocateur");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
class InterfaceCompetencesNumeriques_Saisie extends _InterfaceCompetencesNumeriques_1._InterfaceCompetencesNumeriques {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		super.construireInstances();
		this.identTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this._evenementSurTripleCombo.bind(this),
			this._initialiseTripleCombo,
		);
		this.IdPremierElement = this.getInstance(
			this.identTripleCombo,
		).getPremierElement();
	}
	setParametresGeneraux() {
		super.setParametresGeneraux();
		this.AddSurZone = [];
		this.AddSurZone.push(this.identTripleCombo);
		this.AddSurZone.push({ blocGauche: true });
		this.AddSurZone = this.AddSurZone.concat(this._construitAddSurZoneCommun());
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche(
				"btnMrFiche",
			),
		});
		this.AddSurZone.push({ blocDroit: true });
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnMrFiche: {
				event() {
					GApplication.getMessage().afficher({
						idRessource: "competences.MFicheEchelleCompetencesNumeriques",
					});
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getTitreMFiche(
						"competences.MFicheEchelleCompetencesNumeriques",
					);
				},
			},
		});
	}
	estAffichageDeLaClasse() {
		const lEleve = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Eleve,
		);
		return !lEleve || !lEleve.existeNumero();
	}
	getParametresPDF() {
		return {
			genreGenerationPDF:
				TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
					.LivretCompetenceNumerique,
			eleveSelectionne: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Eleve,
			),
			filtrerNiveauxSansEvaluation: this.filtrerNiveauxSansEvaluation,
			avecCodeCompetences: this.etatUtilisateurSco.estAvecCodeCompetences(),
		};
	}
	avecMenuContextuel() {
		return true;
	}
	_initMenuContextuelListe(aParametres) {
		const lListeSelections = this.getInstance(
			this.identReleve,
		).getListeElementsSelection();
		let lNiveauAcquiEditable = false;
		if (!lListeSelections || lListeSelections.count() === 0) {
			return;
		}
		let lNeContientQueDesElementsPilier;
		lListeSelections.parcourir((aSelection) => {
			if (aSelection.niveauEstEditable) {
				lNiveauAcquiEditable = true;
			}
			if (
				lNeContientQueDesElementsPilier === undefined ||
				lNeContientQueDesElementsPilier === true
			) {
				lNeContientQueDesElementsPilier =
					aSelection.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.ElementPilier;
			}
		});
		if (lNeContientQueDesElementsPilier) {
			UtilitaireCompetences_1.TUtilitaireCompetences.initMenuContextuelNiveauEquivalenceCN(
				{
					instance: this,
					menuContextuel: aParametres.menuContextuel,
					evaluationsEditables: lNiveauAcquiEditable,
					callbackNiveau: this._modifierNiveauCEDeSelectionCourante.bind(this),
				},
			);
		} else {
			UtilitaireCompetences_1.TUtilitaireCompetences.initMenuContextuelNiveauAcquisition(
				{
					instance: this,
					menuContextuel: aParametres.menuContextuel,
					avecLibelleRaccourci: true,
					genreChoixValidationCompetence:
						TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
							.tGVC_EvaluationEtItem,
					evaluationsEditables: lNiveauAcquiEditable,
					callbackNiveau:
						this._modifierNiveauAcquisitionDeSelectionCourante.bind(this),
				},
			);
		}
	}
	getParametresRequete() {
		return {
			classe: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			),
			eleve: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Eleve,
			),
			filtrerNiveauxSansEvaluation: this.filtrerNiveauxSansEvaluation,
		};
	}
	_actualiserCommandePDF() {
		if (
			this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Eleve,
			) &&
			this.donnees.listeCompetences &&
			this.donnees.listeCompetences.count() > 0
		) {
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
				this,
				this.getParametresPDF.bind(this),
			);
		}
	}
	valider() {
		const lParams = {
			classe: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			),
			eleve: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Eleve,
			),
			listeElementsCompetences: this.donnees.listeCompetences,
			appreciation: this.donnees.appreciation,
		};
		new ObjetRequeteSaisieCompetencesNumeriques_1.ObjetRequeteSaisieCompetencesNumeriques(
			this,
			this.actionSurValidation,
		).lancerRequete(lParams);
	}
	evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				switch (aParametres.idColonne) {
					case DonneesListe_CompetencesNumeriques_1
						.DonneesListe_CompetencesNumeriques.colonnes.niveau:
						aParametres.ouvrirMenuContextuel();
						break;
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.KeyUpListe:
				this._surKeyUpListe(aParametres.event);
				break;
		}
	}
	_editionListeSelectionListe(aListeSelections, aMethodeEdition) {
		if (!aListeSelections || aListeSelections.count() === 0) {
			return;
		}
		let lAvecModif = false;
		aListeSelections.parcourir((aSelection) => {
			if (aMethodeEdition.call(this, aSelection)) {
				aSelection.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				lAvecModif = true;
			}
		});
		if (lAvecModif) {
			this.setEtatSaisie(true);
			this.getInstance(this.identReleve).focusSurPremierElement();
			this.getInstance(this.identReleve).actualiser({
				conserverSelection: true,
				conserverFocusSelection: true,
			});
		}
	}
	_modifierNiveauAcquisitionDeSelectionCourante(aNiveau) {
		if (!aNiveau) {
			return;
		}
		const lListe = this.getInstance(this.identReleve);
		const lSelections = lListe.getListeElementsSelection();
		if (lSelections.count() === 0) {
			return;
		}
		this._editionListeSelectionListe(lSelections, (aSelection) => {
			if (
				aSelection.getGenre() ===
				Enumere_Ressource_1.EGenreRessource.ElementPilier
			) {
				return false;
			} else if (
				aSelection.niveauEstEditable &&
				!!aNiveau &&
				(!aSelection.niveauDAcquisition ||
					aSelection.niveauDAcquisition.getGenre() !== aNiveau.getGenre())
			) {
				aSelection.niveauDAcquisition = aNiveau;
				aSelection.dateValidation = ObjetDate_1.GDate.getDateCourante();
				return true;
			}
		});
	}
	_modifierNiveauCEDeSelectionCourante(aNiveauEquivalenceCE) {
		if (!aNiveauEquivalenceCE) {
			return;
		}
		const lListe = this.getInstance(this.identReleve);
		const lSelections = lListe.getListeElementsSelection();
		if (lSelections.count() === 0) {
			return;
		}
		this._editionListeSelectionListe(lSelections, (aSelection) => {
			if (
				aSelection.niveauEstEditable &&
				aSelection.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.ElementPilier
			) {
				aSelection.niveauDEquivalenceCE =
					aNiveauEquivalenceCE.getGenre() ===
					TypeNiveauEquivalenceCE_1.TypeNiveauEquivalenceCE.TNECE_Aucun
						? null
						: aNiveauEquivalenceCE;
				return true;
			}
		});
	}
	_surKeyUpListe(aEvent) {
		const lListeSelections = this.getInstance(
			this.identReleve,
		).getListeElementsSelection();
		if (!lListeSelections || lListeSelections.count() === 0) {
			return;
		}
		let lNeContientQueDesElementsPilier;
		lListeSelections.parcourir((aSelection) => {
			if (
				lNeContientQueDesElementsPilier === undefined ||
				lNeContientQueDesElementsPilier === true
			) {
				lNeContientQueDesElementsPilier =
					aSelection.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.ElementPilier;
			}
		});
		if (lNeContientQueDesElementsPilier) {
			const lEventKey =
				!!aEvent.key && !!aEvent.key.toLowerCase
					? aEvent.key.toLowerCase()
					: "";
			const lNiveauEquivalenceCE =
				TypeNiveauEquivalenceCE_1.TypeNiveauEquivalenceCEUtil.getTypeParRaccourci(
					false,
					lEventKey,
				);
			if (!!lNiveauEquivalenceCE) {
				this._modifierNiveauCEDeSelectionCourante(lNiveauEquivalenceCE);
			}
		} else {
			if (this.parametresSco.listeNiveauxDAcquisitions) {
				const lNiveauxConcernes =
					this.parametresSco.listeNiveauxDAcquisitions.getListeElements((D) => {
						return D.actifPour.contains(
							TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
								.tGVC_EvaluationEtItem,
						);
					});
				const lNiveau =
					UtilitaireCompetences_1.TUtilitaireCompetences.getNiveauAcqusitionDEventClavier(
						aEvent,
						lNiveauxConcernes,
					);
				if (!!lNiveau) {
					this._modifierNiveauAcquisitionDeSelectionCourante(lNiveau);
				}
			}
		}
	}
	_initialiseTripleCombo(aInstance) {
		aInstance.setParametres([
			Enumere_Ressource_1.EGenreRessource.Classe,
			Enumere_Ressource_1.EGenreRessource.Eleve,
		]);
	}
	_evenementSurTripleCombo() {
		this.afficherBandeau(true);
		this.afficherPage();
	}
}
exports.InterfaceCompetencesNumeriques_Saisie =
	InterfaceCompetencesNumeriques_Saisie;
