const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const {
	DonneesListe_RessourceOrientation,
} = require("DonneesListe_RessourceOrientation.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { EGenreEvnt } = require("UtilitaireOrientation.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetListe } = require("ObjetListe.js");
class ObjetFenetre_RessourceOrientation extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.listeRessources = new ObjetListeElements();
		this.afficherSpecialiteAnneePrecedente = true;
		this.setOptionsFenetre({ heightMax_mobile: true });
	}
	construireInstances() {
		this.identListe = this.add(ObjetListe, this.evenementSurListe);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			cbFilrePremiere: {
				getValue: function () {
					return aInstance.afficherSpecialiteAnneePrecedente;
				},
				setValue: function (aData) {
					aInstance.afficherSpecialiteAnneePrecedente = aData;
					aInstance.actualiserListe();
				},
				getDisplay: function () {
					return (
						aInstance.genreRessource === EGenreEvnt.specialite &&
						aInstance.estNiveauPremiere
					);
				},
			},
		});
	}
	actualiserListe() {
		const lParam = {
			listeRessources: this.listeRessources,
			genre: this.genreRessource,
			avecFiltreNiveau: this.afficherSpecialiteAnneePrecedente,
			estNiveauPremiere: this.estNiveauPremiere,
			estMultiNiveau: this.estMultiNiveau,
			afficherPicto: this.afficherPicto,
		};
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_RessourceOrientation(lParam),
		);
		this.positionnerFenetre();
	}
	evenementSurListe(aParametres, aGenreEvenementListe, I, J) {
		this.posRessource = J;
		switch (aGenreEvenementListe) {
			case EGenreEvenementListe.Selection:
			case EGenreEvenementListe.SelectionDblClick:
			case EGenreEvenementListe.Edition:
				if (
					[EGenreEvnt.lv1, EGenreEvnt.lv2, EGenreEvnt.lvautre].includes(
						this.genreRessource,
					)
				) {
					this.surValidationLangues(1);
				} else {
					this.surValidation(1);
				}
				break;
		}
	}
	surValidation(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			const ressource = this.getRessourceSelectionnee();
			switch (this.genreRessource) {
				case EGenreEvnt.orientation:
					this.element.donnees.orientation = ressource;
					this.element.donnees.specialites = new ObjetListeElements();
					this.element.donnees.options = new ObjetListeElements();
					break;
				case EGenreEvnt.specialite:
					this.element.donnees.specialites.remove(this.index);
					this.element.donnees.specialites.insererElement(
						ressource,
						this.index,
					);
					break;
				case EGenreEvnt.option:
					this.element.donnees.options.addElement(ressource);
					break;
			}
			this.element.donnees.setEtat(EGenreEtat.Modification);
			this.element.actualiser(true);
		}
		this.fermer();
	}
	surValidationLangues(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			const ressource = this.getRessourceSelectionnee();
			if (this.genreRessource === EGenreEvnt.lvautre) {
				if (this.element.LVAutres === undefined) {
					this.element.LVAutres = new ObjetListeElements();
				}
				this.element.LVAutres.add(ressource);
				this.setEtatSaisie(true);
			} else {
				this.callback.appel({ genre: this.genreRessource, element: ressource });
			}
		}
		this.fermer();
	}
	getRessourceSelectionnee() {
		if (!!this.listeRessources) {
			return this.listeRessources.get(this.posRessource);
		}
		return null;
	}
	initialiserListe(aInstance) {
		const lFiltre = [];
		lFiltre.push({
			html: `<ie-checkbox class="Espace" ie-model="cbFilrePremiere" ie-display="cbFilrePremiere.getDisplay" > ${GTraductions.getValeur("Orientation.Specialites.UniquementSpecialiteEleve")}</ie-checkbox>`,
			controleur: this.controleur,
		});
		lFiltre.push({ genre: ObjetListe.typeBouton.rechercher });
		const lParam = {
			skin: ObjetListe.skin.flatDesign,
			colonnesTriables: false,
			boutons: lFiltre,
		};
		if (!IE.estMobile) {
			$.extend(lParam, {
				hauteurAdapteContenu: true,
				hauteurMaxAdapteContenu: 500,
			});
		}
		aInstance.setOptionsListe(lParam);
	}
	composeContenu() {
		const T = [];
		T.push(
			'<div style="height: 100%" class="PetitEspace" id="',
			this.getInstance(this.identListe).getNom(),
			'"></div>',
		);
		return T.join("");
	}
	composeBas() {
		const T = [];
		if (this.afficherPicto) {
			T.push(
				'<div class="InterfacePageOrientation LegendeOrientation flex-contain cols" >',
				'<div class="PetitEspace flex-contain">',
				'<div class="IPO_Lettre IPO_LettreHorsEtablissement IPO_LegendeHorsEtablissement" style="align-items: center;">',
				GTraductions.getValeur(
					"Orientation.Ressources.LettreHorsEtablissement",
				),
				"</div>",
				'<div class="PetitEspaceGauche Texte9" >',
				GTraductions.getValeur("Orientation.Ressources.DispoHorsEtablissement"),
				"</div>",
				"</div>",
				'<div class="PetitEspace flex-contain">',
				'<div class="IPO_Lettre IPO_LettreEtablissement" style="align-items: center;">',
				GTraductions.getValeur("Orientation.Ressources.LettreEtablissement"),
				"</div>",
				'<div class="PetitEspaceGauche  Texte9">',
				GTraductions.getValeur("Orientation.Ressources.DispoEtablissement"),
				"</div>",
				"</div>",
				"</div>",
			);
		}
		return T.join("");
	}
	setDonnees(aParam) {
		this.afficher();
		this.genreRessource = aParam.genre;
		this.listeRessources = aParam.listeRessource;
		this.element = aParam.element;
		this.index = aParam.index;
		this.estNiveauPremiere = aParam.estNiveauPremiere;
		this.estMultiNiveau = aParam.estMultiNiveau;
		this.afficherPicto = [
			EGenreEvnt.orientation,
			EGenreEvnt.specialite,
			EGenreEvnt.option,
		].includes(this.genreRessource);
		this.initialiserListe(this.getInstance(this.identListe));
		this.actualiserListe();
	}
}
module.exports = { ObjetFenetre_RessourceOrientation };
