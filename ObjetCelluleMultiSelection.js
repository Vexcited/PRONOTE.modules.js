exports.DonneesListe_CelluleMultiSelection =
	exports.ObjetCelluleMultiSelection = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const Enumere_Event_1 = require("Enumere_Event");
const ObjetCelluleBouton_1 = require("ObjetCelluleBouton");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetCelluleBouton_2 = require("ObjetCelluleBouton");
const ToucheClavier_1 = require("ToucheClavier");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetWAI_1 = require("ObjetWAI");
class ObjetCelluleMultiSelection extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.setOptions({
			genreBouton: ObjetCelluleBouton_2.EGenreBoutonCellule.Points,
			classTexte: "",
			largeurBouton: 150,
			hauteurBouton: 18,
			titreFenetre: "",
			titresColonnes: null,
			taillesColonnes: null,
			listeBoutons: null,
			optionsListe: null,
			donneesListe: null,
			paramListe: null,
			avecLigneCreation: false,
			creations: null,
			callbckCreation: null,
			callbckEdition: null,
			colonnesCachees: null,
			largeurFenetre: 300,
			hauteurFenetre: 250,
			avecAuMoinsUnEltSelectionne: false,
		});
	}
	detruireInstances() {
		this._fermerFenetre();
	}
	initialiser() {
		this.cellule = new ObjetCelluleBouton_1.ObjetCelluleBouton(
			this.Nom + ".cellule",
			null,
			this,
			this.surCellule,
		);
		this.setPremierElement(this.cellule.NomEdit);
		this.cellule.setOptionsObjetCelluleBouton({
			estSaisissable: false,
			genreBouton: this.options.genreBouton,
			hauteur: this.options.hauteurBouton,
			largeur: this.options.largeurBouton,
			classTexte: this.options.classTexte,
			avecZoneSaisie: false,
			placeHolder: this.options.placeHolder,
			labelWAI: this.options.labelWAI,
			labelledById: this.options.labelledByWAI,
			describedById: this.options.describedById,
			roleWAI: ObjetWAI_1.EGenreRole.Combobox,
			popupWAI: "dialog",
		});
		this.afficher();
		this.cellule.initialiser();
		this.cellule.setActif(this.Actif);
	}
	_initDonnees(aListeSelectionnee, aListeOrigin) {
		const lResult = MethodesObjet_1.MethodesObjet.dupliquer(aListeOrigin);
		for (let i = 0; i < aListeSelectionnee.count(); i++) {
			const lElm = lResult.getElementParNumero(aListeSelectionnee.getNumero(i));
			if (lElm) {
				lElm.cmsActif = true;
			}
		}
		return lResult;
	}
	setDonnees(aListeComplet, aListeSelectionne) {
		if (aListeComplet) {
			if (
				aListeSelectionne &&
				aListeSelectionne instanceof ObjetListeElements_1.ObjetListeElements
			) {
				this.donnees = this._initDonnees(aListeSelectionne, aListeComplet);
			} else {
				this.donnees = MethodesObjet_1.MethodesObjet.dupliquer(aListeComplet);
			}
			if (this.donnees) {
				this._actualiserCellule();
			}
		}
	}
	construireAffichage() {
		return IE.jsx.str("div", {
			id: this.cellule.getNom(),
			class: "input-wrapper",
			"ie-class": "getClassesDynamiques",
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getClassesDynamiques: function () {
				const lClasses = [];
				if (!aInstance.getActif()) {
					lClasses.push("input-wrapper-disabled");
				}
				return lClasses.join(" ");
			},
		});
	}
	surCellule(aGenreEvent, aEvent) {
		if (!this.getActif()) {
			return;
		}
		switch (aGenreEvent) {
			case Enumere_Event_1.EEvent.SurClick: {
				this._ouvrirFenetre();
				break;
			}
			case Enumere_Event_1.EEvent.SurKeyUp: {
				if (
					aEvent.which === ToucheClavier_1.ToucheClavier.RetourChariot ||
					aEvent.which === ToucheClavier_1.ToucheClavier.FlecheBas
				) {
					this._ouvrirFenetre();
				}
			}
		}
	}
	_actualiserCellule() {
		const lListeSelectionne = this.donnees.getListeElements((aElement) => {
			return aElement.cmsActif;
		});
		this.cellule.setLibelle(lListeSelectionne.getTableauLibelles().join(", "));
	}
	_ouvrirFenetre() {
		if (this.fenetre) {
			this._fermerFenetre();
		}
		this.fenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			{ pere: this, evenement: this.surFenetre, initialiser: false },
		);
		const lSelf = this;
		this.fenetre.ajouterCallbackSurDestruction(() => {
			lSelf.fenetre = null;
		});
		const lParam = {
			titres: this.options.titresColonnes
				? this.options.titresColonnes
				: [
						{ estCoche: true },
						ObjetTraduction_1.GTraductions.getValeur("Libelle"),
					],
			tailles: this.options.taillesColonnes
				? this.options.taillesColonnes
				: [20, "100%"],
			avecLigneCreation: this.options.avecLigneCreation,
			creations: this.options.creations,
			callbckCreation: this.options.callbckCreation,
			callbckEdition: this.options.callbckEdition,
			colonnesCachees: this.options.colonnesCachees,
			optionsListe: this.options.optionsListe,
			editable: true,
		};
		const lOptionsFenetre = {
			titre: this.options.titreFenetre,
			largeur: this.options.largeurFenetre,
			hauteur: this.options.hauteurFenetre,
			listeBoutons: this.options.listeBoutons
				? this.options.listeBoutons
				: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		};
		if (this.options.avecAuMoinsUnEltSelectionne) {
			lOptionsFenetre.modeActivationBtnValider =
				this.fenetre.modeActivationBtnValider.auMoinsUnEltSelectionne;
		}
		this.fenetre.setOptionsFenetre(lOptionsFenetre);
		this.fenetre.paramsListe = lParam;
		this.fenetre.initialiser();
		this.donneesListe = this.options.donneesListe
			? new this.options.donneesListe(this.donnees, this.options.paramListe)
			: new DonneesListe_CelluleMultiSelection(this.donnees);
		this.fenetre.setDonnees(this.donneesListe, false);
		this.fenetre.positionnerSousId(this.Nom);
	}
	_nbrCochees() {
		let lNombre = 0;
		for (let i = 0, lNb = this.donnees.count(); i < lNb; i++) {
			if (this.donnees.get(i).cmsActif) {
				lNombre++;
			}
		}
		return lNombre;
	}
	_fermerFenetre() {
		if (!this.fenetre) {
			return;
		}
		this.fenetre.fermer();
	}
	surFenetre(aGenreBouton, aSelection, aAvecChangementListe) {
		this.genreBouton = aGenreBouton;
		this._actualiserCellule();
		this._fermerFenetre();
		(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
			const lListeActif = this.donnees.getListeElements((aElement) => {
				return aElement.cmsActif;
			});
			this.callback.appel(
				this.genreBouton,
				lListeActif,
				aAvecChangementListe ? this.donnees : null,
			);
		}, !this.ControleNavigation);
	}
	setActif(AActif) {
		super.setActif(AActif);
		this.$refreshSelf();
	}
}
exports.ObjetCelluleMultiSelection = ObjetCelluleMultiSelection;
class DonneesListe_CelluleMultiSelection extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecSelection: false,
			avecSuppression: false,
			avecEtatSaisie: false,
			avecEvnt_ApresEdition: true,
			avecEvnt_Selection: true,
		});
	}
	avecEdition(aParams) {
		return aParams.colonne === 0;
	}
	getTypeValeur(aParams) {
		return aParams.colonne === 0
			? ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche
			: ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getValeur(aParams) {
		switch (aParams.colonne) {
			case 0:
				return aParams.article.cmsActif !== undefined
					? aParams.article.cmsActif
					: false;
			case 1:
				return aParams.article.getLibelle();
		}
		return "";
	}
	surEdition(aParams, V) {
		if (aParams.colonne === 0) {
			aParams.article.cmsActif = V;
		}
	}
	getColonneTransfertEdition() {
		return 0;
	}
	getCouleurCellule() {
		return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
	}
}
exports.DonneesListe_CelluleMultiSelection = DonneesListe_CelluleMultiSelection;
