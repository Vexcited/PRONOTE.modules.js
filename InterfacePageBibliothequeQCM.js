exports.InterfacePageBibliothequeQCM = void 0;
const PageBibliothequeQCM_1 = require("PageBibliothequeQCM");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const ObjetRequeteListeQCMCumuls_1 = require("ObjetRequeteListeQCMCumuls");
const DonneesListe_Simple_1 = require("DonneesListe_Simple");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const AccessApp_1 = require("AccessApp");
class InterfacePageBibliothequeQCM extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.donnees = {
			libelleBandeau: ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.SelectionnerUnQCM",
			),
		};
	}
	construireInstances() {
		this.identBiblio = this.add(
			PageBibliothequeQCM_PN,
			this.evenementInterfaceBiblio,
			this.initialiserInterfaceBiblio,
		);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identBiblio;
		this.AddSurZone = [];
		this.AddSurZone.push({
			html: '<span class="Gras" ie-html="getLibelleBandeau"></span>',
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getLibelleBandeau: function () {
				return aInstance.donnees.libelleBandeau;
			},
		});
	}
	initialiserInterfaceBiblio(aInstance) {
		aInstance.setGenreRessources({
			genreQCM: Enumere_Ressource_1.EGenreRessource.QCM,
			genreNiveau: Enumere_Ressource_1.EGenreRessource.Niveau,
			genreMatiere: Enumere_Ressource_1.EGenreRessource.Matiere,
			genreAucun: Enumere_Ressource_1.EGenreRessource.Aucune,
		});
	}
	evenementInterfaceBiblio(aParam) {
		this.donnees.libelleBandeau = aParam.libelleBandeau;
	}
	afficherPage() {
		this.setEtatSaisie(false);
	}
}
exports.InterfacePageBibliothequeQCM = InterfacePageBibliothequeQCM;
class PageBibliothequeQCM_PN extends PageBibliothequeQCM_1.PageBibliothequeQCM {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
		this.avecInfoClassePourCopie = this.etatUtilisateurSco.pourPrimaire();
		this.avecGestionBaremeSurQuestion = !this.etatUtilisateurSco.pourPrimaire();
	}
	getRequeteListeQCMCumuls(aCallback) {
		return new ObjetRequeteListeQCMCumuls_1.ObjetRequeteListeQCMCumuls(
			this,
			aCallback,
		);
	}
	async getClassePourCopiePromise() {
		const lListe = this.etatUtilisateurSco.listeClasses.getListeElements(
			(aElement) => {
				return (
					aElement.existe() &&
					aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Classe &&
					aElement.enseigne
				);
			},
		);
		const lThis = this;
		if (lListe.count() === 1) {
			return Promise.resolve().then(() => {
				return lListe.get(0);
			});
		} else {
			return new Promise((aresolve, areject) => {
				const lFenetreListe = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_Liste_1.ObjetFenetre_Liste,
					{
						pere: lThis,
						initialiser: function (aInstance) {
							const lParamsListe = {
								tailles: ["100%"],
								optionsListe: {
									hauteurAdapteContenu: true,
									hauteurMaxAdapteContenu: 500,
								},
							};
							aInstance.setOptionsFenetre({
								titre: ObjetTraduction_1.GTraductions.getValeur("Message")[0],
								largeur: 300,
								hauteur: null,
								listeBoutons: [
									ObjetTraduction_1.GTraductions.getValeur("Annuler"),
									ObjetTraduction_1.GTraductions.getValeur("Valider"),
								],
							});
							aInstance.paramsListe = lParamsListe;
						},
						evenement: function (aNumeroBouton, aElementSelectionne) {
							if (aNumeroBouton === 1) {
								const lElement = lListe.get(aElementSelectionne);
								aresolve(lElement);
							} else {
								areject(false);
							}
						},
					},
				);
				lFenetreListe.setDonnees(
					new DonneesListe_Simple_1.DonneesListe_Simple(lListe),
				);
			});
		}
	}
	getTitre(aQCM) {
		const lTitre = [];
		const lListeProprietes = ["proprietaire", "matiere", "niveau"];
		for (const x in lListeProprietes) {
			if (aQCM[lListeProprietes[x]] && aQCM[lListeProprietes[x]].getLibelle()) {
				lTitre.push(aQCM[lListeProprietes[x]].getLibelle());
			}
		}
		lTitre.push(aQCM.getLibelle());
		return lTitre.join("&nbsp;&gt;&nbsp;");
	}
}
