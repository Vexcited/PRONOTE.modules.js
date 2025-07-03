exports.InterfaceCompetencesNumeriques_Consultation = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetListeElements_1 = require("ObjetListeElements");
const _InterfaceCompetencesNumeriques_1 = require("_InterfaceCompetencesNumeriques");
const Enumere_Message_1 = require("Enumere_Message");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const Invocateur_1 = require("Invocateur");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const ObjetTraduction_1 = require("ObjetTraduction");
class InterfaceCompetencesNumeriques_Consultation extends _InterfaceCompetencesNumeriques_1._InterfaceCompetencesNumeriques {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		super.construireInstances();
		this.identComboPalier = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.evenementSurComboPalier,
			this._initialiserComboPalier,
		);
		this.IdPremierElement = this.getInstance(
			this.identComboPalier,
		).getPremierElement();
	}
	setParametresGeneraux() {
		super.setParametresGeneraux();
		this.AddSurZone = [this.identComboPalier, { separateur: true }];
		this.AddSurZone.push({ blocGauche: true });
		this.AddSurZone = this.AddSurZone.concat(this._construitAddSurZoneCommun());
		this.AddSurZone.push({ blocDroit: true });
	}
	estAffichageDeLaClasse() {
		return false;
	}
	recupererDonnees() {
		const lListePaliers =
			this.etatUtilisateurSco.getOngletListePaliers() ||
			new ObjetListeElements_1.ObjetListeElements();
		ObjetHtml_1.GHtml.setDisplay(
			this.getNomInstance(this.identComboPalier),
			lListePaliers.count() > 1,
		);
		if (lListePaliers.count() === 0) {
			this.evenementAfficherMessage(
				Enumere_Message_1.EGenreMessage.AucunPilierPourEleve,
			);
		} else {
			this.getInstance(this.identComboPalier).setDonnees(lListePaliers, 0);
		}
	}
	_actualiserCommandePDF() {
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.autoriserImpressionBulletinReleveBrevet,
			)
		) {
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
				this,
				this.getParametresPDF.bind(this),
			);
		}
	}
	getParametresRequete() {
		return {
			eleve: this.etatUtilisateurSco.getMembre(),
			filtrerNiveauxSansEvaluation: this.filtrerNiveauxSansEvaluation,
		};
	}
	getParametresPDF() {
		return {
			genreGenerationPDF:
				TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
					.LivretCompetenceNumerique,
			filtrerNiveauxSansEvaluation: this.filtrerNiveauxSansEvaluation,
			avecCodeCompetences: this.etatUtilisateurSco.estAvecCodeCompetences(),
		};
	}
	_initialiserComboPalier(aInstance) {
		aInstance.setOptionsObjetSaisie({
			avecTriListeElements: true,
			longueur: 150,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.listeSelectionPalier",
			),
		});
	}
	evenementSurComboPalier(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.afficherPage();
		}
	}
}
exports.InterfaceCompetencesNumeriques_Consultation =
	InterfaceCompetencesNumeriques_Consultation;
