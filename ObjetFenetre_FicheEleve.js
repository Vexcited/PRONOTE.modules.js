exports.ObjetFenetre_FicheEleve = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const InterfaceFicheEleve_1 = require("InterfaceFicheEleve");
const ObjetRequeteFicheEleve_1 = require("ObjetRequeteFicheEleve");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_FicheEleve extends ObjetFenetre_1.ObjetFenetre {
	constructor() {
		super(...arguments);
		this.applicationSco = (0, AccessApp_1.getApp)();
	}
	construireInstances() {
		this.idFicheEleve = this.add(InterfaceFicheEleve_1.InterfaceFicheEleve);
	}
	setDonnees(aOngletSelection, aBloquerFocus, aSansFocusPolling) {
		this.setOptionsFenetre({ bloquerFocus: aBloquerFocus });
		this.afficher();
		this.getInstance(this.idFicheEleve).setOptions(this.listeOnglets);
		this.getInstance(this.idFicheEleve).setDonnees({
			onglet: aOngletSelection,
			sansFocusPolling: aSansFocusPolling,
		});
	}
	surValidation(aNumeroBouton) {
		this.getInstance(this.idFicheEleve).surValidation(aNumeroBouton);
	}
	composeContenu() {
		const T = [];
		T.push(
			IE.jsx.str("div", {
				class: "fiche-wrapper",
				style: "height:100%",
				id: this.getNomInstance(this.idFicheEleve),
			}),
		);
		return T.join("");
	}
	composeBas() {
		return this.getInstance(this.idFicheEleve).composeBoutonsCommunication();
	}
	setOngletActif(aGenreOnglet) {
		this.getInstance(this.idFicheEleve).setOngletActif(aGenreOnglet);
	}
	setOngletsVisibles(aParams) {
		this.listeOnglets = aParams;
	}
	recupererDonneesFicheEleve() {
		const lParam = {
			Eleve: this.donnees.eleve,
			AvecEleve: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.consulterIdentiteEleve,
			),
			AvecResponsables: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.consulterFichesResponsables,
			),
			AvecAutresContacts: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.consulterFichesResponsables,
			),
		};
		new ObjetRequeteFicheEleve_1.ObjetRequeteFicheEleve(
			this,
			this.actionSurReponseRequeteFicheEleve,
		).lancerRequete(lParam);
	}
	actionSurReponseRequeteFicheEleve(
		aIdentite,
		aScolarite,
		aListeTypes,
		aListeMotifs,
		aListeAttestations,
		aListeResponsables,
		aListeMemosEleve,
	) {
		const lFicheEleve = {
			identite: aIdentite,
			scolarite: aScolarite,
			listeMemos: aListeMemosEleve,
			listeResponsables: aListeResponsables,
		};
		const lAutorisations = {
			avecIdentiteEleve: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.consulterIdentiteEleve,
			),
			avecFicheResponsables: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.consulterFichesResponsables,
			),
			avecPhotoEleve: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.consulterPhotosEleves,
			),
		};
		Object.assign(this.donnees, lFicheEleve, lAutorisations);
		this.afficher();
		this.afficherFicheEleve();
	}
	afficherFicheEleve() {
		this.applicationSco
			.getEtatUtilisateur()
			.Navigation.setRessource(
				Enumere_Ressource_1.EGenreRessource.Eleve,
				this.donnees.eleve,
			);
		this.getInstance(this.idFicheEleve).setOptions(this.listeOnglets);
		const lParams = { onglet: null };
		if (this.donnees.ongletSelection !== undefined) {
			lParams.onglet = this.donnees.ongletSelection;
		}
		this.getInstance(this.idFicheEleve).setDonnees(lParams);
	}
	_getEleveSuivant(aSuivant) {
		if (this.donnees.listeEleves) {
			const lListeEleves = this.donnees.listeEleves;
			let lIndiceElementActuel, lIndiceProchainElement, lProchainElement;
			lIndiceElementActuel = lListeEleves.getIndiceParElement(
				this.donnees.eleve,
			);
			if (aSuivant) {
				lIndiceProchainElement =
					lIndiceElementActuel + 1 < lListeEleves.count()
						? lIndiceElementActuel + 1
						: 0;
			} else {
				lIndiceProchainElement =
					lIndiceElementActuel === 0
						? lListeEleves.count() - 1
						: lIndiceElementActuel - 1;
			}
			lProchainElement = lListeEleves.get(lIndiceProchainElement);
			if (lProchainElement) {
				this.donnees.eleve = lProchainElement;
				this.afficherFicheEleve();
			}
		}
	}
	static ouvrir(aParametres) {
		if (
			IE.estMobile &&
			!(0, AccessApp_1.getApp)().droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.consulterIdentiteEleve,
			) &&
			!(0, AccessApp_1.getApp)().droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.consulterFichesResponsables,
			)
		) {
			return;
		}
		const lInstanceFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_FicheEleve,
			{
				pere: aParametres.instance,
				initialiser: function (aInstance) {
					const lOptions = { cssFenetre: "liste-eleves" };
					if (!IE.estMobile) {
						lOptions.largeur = 750;
						lOptions.hauteur = 750;
					}
					if (
						aParametres.avecRequeteDonnees &&
						!!aParametres.donnees &&
						!!aParametres.donnees.listeEleves
					) {
						lOptions.avecNavigation = true;
						lOptions.callbackNavigation =
							aInstance._getEleveSuivant.bind(aInstance);
					}
					aInstance.setOptionsFenetre(lOptions);
				},
			},
		);
		if (aParametres.avecRequeteDonnees) {
			lInstanceFenetre.donnees = Object.assign(
				{ eleve: null, listeEleves: null },
				aParametres.donnees,
			);
			lInstanceFenetre.recupererDonneesFicheEleve();
		} else {
			lInstanceFenetre.setDonnees(
				aParametres.donnees.ongletSelection,
				!!aParametres.donnees.bloquerFocus,
			);
		}
	}
}
exports.ObjetFenetre_FicheEleve = ObjetFenetre_FicheEleve;
