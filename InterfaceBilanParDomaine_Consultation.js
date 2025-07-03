exports.InterfaceBilanParDomaine_Consultation = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const _InterfaceBilanParDomaine_1 = require("_InterfaceBilanParDomaine");
const Enumere_Message_1 = require("Enumere_Message");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class InterfaceBilanParDomaine_Consultation extends _InterfaceBilanParDomaine_1._InterfaceBilanParDomaine {
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
		this.identComboPilier = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.evenementSurComboPilier,
			this._initialiserComboPilier,
		);
		this.IdPremierElement = this.getInstance(
			this.identComboPilier,
		).getPremierElement();
	}
	setParametresGeneraux() {
		super.setParametresGeneraux();
		this.AddSurZone = [
			this.identComboPalier,
			this.identComboPilier,
			{ separateur: true },
		];
		this.AddSurZone.push({ blocGauche: true });
		this.AddSurZone = this.AddSurZone.concat(this._construitAddSurZoneCommun());
		this.AddSurZone.push({ blocDroit: true });
	}
	recupererDonnees() {
		const lListePaliers =
			this.etatUtilisateurSco.getOngletListePaliers() ||
			new ObjetListeElements_1.ObjetListeElements();
		if (lListePaliers.count() === 0) {
			ObjetHtml_1.GHtml.setDisplay(
				this.getNomInstance(this.identComboPalier),
				false,
			);
			ObjetHtml_1.GHtml.setDisplay(
				this.getNomInstance(this.identComboPilier),
				false,
			);
			this.evenementAfficherMessage(
				Enumere_Message_1.EGenreMessage.AucunPilierPourEleve,
			);
		} else {
			this.getInstance(this.identComboPalier).setDonnees(lListePaliers, 0);
		}
	}
	getListeEleves() {
		const result = new ObjetListeElements_1.ObjetListeElements();
		result.addElement(this.etatUtilisateurSco.getMembre());
		return result;
	}
	getServiceConcerne() {
		const lPilierSelectionne = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Pilier,
		);
		return !!lPilierSelectionne ? lPilierSelectionne.Service : null;
	}
	_initialiserComboPalier(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 100,
			avecTriListeElements: true,
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
			this.etatUtilisateurSco.Navigation.setRessource(
				Enumere_Ressource_1.EGenreRessource.Palier,
				aParams.element,
			);
			this.etatUtilisateurSco.Navigation.setRessource(
				Enumere_Ressource_1.EGenreRessource.Pilier,
				null,
			);
			let lAvecSocleCommun = false;
			let lAvecPersonnalise = false;
			let lPilier;
			const lListePiliers = new ObjetListeElements_1.ObjetListeElements();
			const lListePiliersOnglet =
				aParams.element.listePiliers ||
				new ObjetListeElements_1.ObjetListeElements();
			if (lListePiliersOnglet.count() === 0) {
				this.evenementAfficherMessage(
					Enumere_Message_1.EGenreMessage.AucunPilierPourEleve,
				);
			} else {
				for (let i = 0; i < lListePiliersOnglet.count(); i++) {
					lPilier = lListePiliersOnglet.get(i);
					if (lPilier.estSocleCommun) {
						lAvecSocleCommun = true;
						lPilier.positionSocle = 0;
					}
					if (lPilier.estPersonnalise && !lPilier.estSocleCommun) {
						lAvecPersonnalise = true;
						lPilier.positionSocle = 2;
					}
				}
				lListePiliers.add(lListePiliersOnglet);
				if (lAvecSocleCommun && lAvecPersonnalise) {
					lPilier = new ObjetElement_1.ObjetElement(
						ObjetTraduction_1.GTraductions.getValeur("pilier.socleCommun"),
					);
					lPilier.positionSocle = 0;
					lPilier.Position = -1;
					lPilier.AvecSelection = false;
					lListePiliers.addElement(lPilier);
					lPilier = new ObjetElement_1.ObjetElement(
						ObjetTraduction_1.GTraductions.getValeur("pilier.personnalise"),
					);
					lPilier.positionSocle = 2;
					lPilier.Position = -1;
					lPilier.AvecSelection = false;
					lListePiliers.addElement(lPilier);
				}
				lListePiliers.setTri([
					ObjetTri_1.ObjetTri.init((D) => {
						return D.positionSocle;
					}),
					ObjetTri_1.ObjetTri.init((D) => {
						return D.getPosition();
					}),
				]);
				lListePiliers.trier();
				this.getInstance(this.identComboPilier).setDonnees(
					lListePiliers,
					lAvecSocleCommun && lAvecPersonnalise ? 1 : 0,
				);
				this.getInstance(this.identComboPilier).setSelectionParIndice(0);
			}
		}
	}
	_initialiserComboPilier(aInstance) {
		const lOptions = {
			longueur: 450,
			largeurListe: 450,
			avecTriListeElements: true,
			getClassElement: (aParams) => {
				return aParams.element.Position === -1 ? "titre-liste" : "";
			},
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.listeSelectionCompetence",
			),
		};
		aInstance.setOptionsObjetSaisie(lOptions);
	}
	evenementSurComboPilier(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.etatUtilisateurSco.Navigation.setRessource(
				Enumere_Ressource_1.EGenreRessource.Pilier,
				aParams.element,
			);
			this.afficherPage();
		}
	}
}
exports.InterfaceBilanParDomaine_Consultation =
	InterfaceBilanParDomaine_Consultation;
