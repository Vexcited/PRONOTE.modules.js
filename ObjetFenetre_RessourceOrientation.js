exports.ObjetFenetre_RessourceOrientation = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetListe_1 = require("ObjetListe");
const ObjetRequetePageOrientations_1 = require("ObjetRequetePageOrientations");
const Enumere_Etat_1 = require("Enumere_Etat");
const DonneesListe_RessourceOrientation_1 = require("DonneesListe_RessourceOrientation");
const ObjetIdentite_1 = require("ObjetIdentite");
const GlossaireOrientation_1 = require("GlossaireOrientation");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetFenetre_RessourceOrientation extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.listeRessources = new ObjetListeElements_1.ObjetListeElements();
		this.afficherSpecialiteAnneePrecedente = true;
		this.setOptionsFenetre({
			largeur: 400,
			hauteur: 80,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
	}
	construireInstances() {
		this.identListe = ObjetIdentite_1.Identite.creerInstance(
			ObjetListe_1.ObjetListe,
			{
				pere: this,
				evenement: (aParametres) => {
					switch (aParametres.genreEvenement) {
						case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
							if (aParametres.article) {
								if (
									[
										ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
											.lv1,
										ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
											.lv2,
										ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
											.lvAutre,
									].includes(this.genreRessource)
								) {
									this.surValidationLangues(aParametres.article);
								} else {
									this.surValidationRessource(aParametres.article);
								}
							}
							break;
					}
				},
			},
		);
	}
	jsxModelCheckboxFiltrePremiere() {
		return {
			getValue: () => {
				return this.afficherSpecialiteAnneePrecedente;
			},
			setValue: (aValue) => {
				this.afficherSpecialiteAnneePrecedente = aValue;
				this.actualiserListe();
			},
		};
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
		this.identListe.setDonnees(
			new DonneesListe_RessourceOrientation_1.DonneesListe_RessourceOrientation(
				lParam,
			),
		);
		this.positionnerFenetre();
	}
	surValidationRessource(aArticle) {
		switch (this.genreRessource) {
			case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
				.orientation:
				this.voeux.orientation = aArticle;
				this.voeux.specialites = new ObjetListeElements_1.ObjetListeElements();
				this.voeux.options = new ObjetListeElements_1.ObjetListeElements();
				break;
			case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
				.specialite:
				this.voeux.specialites.remove(this.index);
				this.voeux.specialites.insererElement(aArticle, this.index);
				break;
			case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.option:
				this.voeux.options.addElement(aArticle);
				break;
		}
		this.voeux.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.fermer();
	}
	surValidationLangues(aArticle) {
		this.callback.appel({ genre: this.genreRessource, element: aArticle });
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
		if (
			this.genreRessource ===
				ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
					.specialite &&
			this.estNiveauPremiere
		) {
			lFiltre.push({
				getHtml: () =>
					IE.jsx.str(
						"ie-checkbox",
						{
							class: "Espace",
							"ie-model": this.jsxModelCheckboxFiltrePremiere.bind(this),
						},
						" ",
						GlossaireOrientation_1.TradGlossaireOrientation.Specialites
							.UniquementSpecialiteEleve,
					),
			});
		}
		lFiltre.push({ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher });
		const lParam = {
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			colonnesTriables: false,
			boutons: lFiltre,
			ariaLabel: this.optionsFenetre.titre,
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
		return IE.jsx.str("div", {
			class: "PetitEspace full-height",
			id: this.identListe.getNom(),
		});
	}
	composeBas() {
		if (this.afficherPicto) {
			return IE.jsx.str(
				"div",
				{
					class:
						"InterfacePageOrientation LegendeOrientation flex-contain cols",
				},
				IE.jsx.str(
					"div",
					{ class: "PetitEspace flex-contain" },
					IE.jsx.str(
						"div",
						{
							class:
								"IPO_Lettre IPO_LettreHorsEtablissement IPO_LegendeHorsEtablissement",
							style: "align-items: center;",
						},
						GlossaireOrientation_1.TradGlossaireOrientation.Ressources
							.LettreHorsEtablissement,
					),
					IE.jsx.str(
						"div",
						{ class: "PetitEspaceGauche Texte9" },
						GlossaireOrientation_1.TradGlossaireOrientation.Ressources
							.DispoHorsEtablissement,
					),
				),
				IE.jsx.str(
					"div",
					{ class: "PetitEspace flex-contain" },
					IE.jsx.str(
						"div",
						{
							class: "IPO_Lettre IPO_LettreEtablissement",
							style: "align-items: center;",
						},
						GlossaireOrientation_1.TradGlossaireOrientation.Ressources
							.LettreEtablissement,
					),
					IE.jsx.str(
						"div",
						{ class: "PetitEspaceGauche  Texte9" },
						GlossaireOrientation_1.TradGlossaireOrientation.Ressources
							.DispoEtablissement,
					),
				),
			);
		}
	}
	setDonnees(aParam) {
		this.afficher();
		this.genreRessource = aParam.genre;
		this.listeRessources = aParam.listeRessources;
		this.voeux = aParam.voeux;
		this.index = aParam.index;
		this.estNiveauPremiere = aParam.estNiveauPremiere;
		this.estMultiNiveau = aParam.estMultiNiveau;
		this.afficherPicto = [
			ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.orientation,
			ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.specialite,
			ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.option,
		].includes(this.genreRessource);
		this.initialiserListe(this.identListe);
		this.actualiserListe();
	}
}
exports.ObjetFenetre_RessourceOrientation = ObjetFenetre_RessourceOrientation;
