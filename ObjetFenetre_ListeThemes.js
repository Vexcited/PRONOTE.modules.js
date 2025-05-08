const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const DonneesListe_Themes = require("DonneesListe_Themes.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const ObjetFenetre_EditionTheme = require("ObjetFenetre_EditionTheme.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const ObjetRequeteSaisieListeThemes = require("ObjetRequeteSaisieListeThemes.js");
class ObjetFenetre_ListeThemes extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: GTraductions.getValeur("Themes"),
			largeur: 450,
			hauteur: 500,
			heightMax_mobile: true,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
			],
		});
		this.avecThemeLesMiens = false;
		this.avecThemeAssocieSelection = true;
		this.avecThemesMesMatieres = false;
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe,
			evenementSurListe.bind(this),
			_initialiserListe,
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			cbThemeLesMiens: {
				getValue: function () {
					return aInstance.avecThemeLesMiens;
				},
				setValue: function () {
					aInstance.avecThemeLesMiens = !aInstance.avecThemeLesMiens;
					if (aInstance.avecThemeLesMiens) {
						aInstance.avecThemeAssocieSelection = false;
						aInstance.avecThemesMesMatieres = false;
					}
					_filtrageSelection.call(aInstance);
				},
			},
			cbThemeSelection: {
				getValue: function () {
					return aInstance.avecThemeAssocieSelection;
				},
				setValue: function () {
					aInstance.avecThemeAssocieSelection =
						!aInstance.avecThemeAssocieSelection;
					if (aInstance.avecThemeAssocieSelection) {
						aInstance.avecThemeLesMiens = false;
						aInstance.avecThemesMesMatieres = false;
					}
					_filtrageSelection.call(aInstance);
				},
			},
			cbThemeMesMatieres: {
				getValue: function () {
					return aInstance.avecThemesMesMatieres;
				},
				setValue: function () {
					aInstance.avecThemesMesMatieres = !aInstance.avecThemesMesMatieres;
					if (aInstance.avecThemesMesMatieres) {
						aInstance.avecThemeLesMiens = false;
						aInstance.avecThemeAssocieSelection = false;
					}
					_filtrageSelection.call(aInstance);
				},
			},
		});
	}
	setDonnees(aParams) {
		this.donnees = MethodesObjet.dupliquer(aParams.listeThemes);
		this.matiereContexte = aParams.matiereContexte;
		this.listeMatieres = aParams.listeMatieres;
		this.tailleLibelleTheme = aParams.tailleLibelleTheme;
		this.libelleCB = aParams.libelleCB;
		this.matiereNonDesignee = aParams.matiereNonDesignee;
		if (!this.libelleCB) {
		}
		this.afficher(this.composeContenu());
		this.surFixerTaille();
		_filtrageSelection.call(this);
	}
	composeContenu() {
		const lHtml = [];
		lHtml.push(
			'<div class="flex-contain cols" style="height:100%">',
			'<div class="field-contain">',
			'<ie-checkbox ie-model="cbThemeLesMiens">',
			GTraductions.getValeur("Theme.filtrePar.lesMiens"),
			"</ie-checkbox>",
			"</div>",
			'<div class="field-contain">',
			'<ie-checkbox ie-model="cbThemeSelection">',
			this.libelleCB || GTraductions.getValeur("Theme.libelleCB.selection"),
			"</ie-checkbox>",
			"</div>",
			'<div class="field-contain">',
			'<ie-checkbox ie-model="cbThemeMesMatieres">',
			GTraductions.getValeur("Theme.filtrePar.mesMatieres"),
			"</ie-checkbox>",
			"</div>",
			'<div class="field-contain" style="flex: 1 1 auto;" id="' +
				this.getNomInstance(this.identListe) +
				'"></div>',
			"</div>",
		);
		return lHtml.join("");
	}
	_actualiserListe(aListeFiltrees) {
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_Themes(
				aListeFiltrees,
				this.listeMatieres,
				this.tailleLibelleTheme,
			),
		);
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		this.callback.appel(aNumeroBouton, this.donnees);
	}
}
function _initialiserListe(aInstance) {
	aInstance.setOptionsListe({
		colonnes: [{ taille: "100%" }],
		avecLigneCreation: true,
		estBoutonCreationPiedFlottant_mobile: false,
		skin: ObjetListe.skin.flatDesign,
	});
}
function evenementSurListe(aParametres) {
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.Creation:
			_ouvrirFenetreCreation.call(this, aParametres);
			break;
	}
}
function _filtrageSelection() {
	let lListeFiltrees = new ObjetListeElements();
	if (
		!this.avecThemeAssocieSelection &&
		!this.avecThemesMesMatieres &&
		!this.avecThemeLesMiens
	) {
		lListeFiltrees = this.donnees;
	} else {
		if (this.avecThemeLesMiens) {
			this.donnees.parcourir((aTheme) => {
				if (!aTheme.auteur) {
					lListeFiltrees.add(aTheme);
				}
			});
		} else if (
			this.avecThemeAssocieSelection ||
			!GEtatUtilisateur.listeMatieres
		) {
			const lListeThemesActifs = new ObjetListeElements();
			this.donnees.parcourir((aTheme) => {
				if (aTheme.cmsActif) {
					lListeThemesActifs.add(aTheme);
				}
			});
			const lListeMatieresSelectionnees = {};
			if (this.matiereContexte) {
				lListeMatieresSelectionnees[this.matiereContexte.getNumero()] =
					this.matiereContexte;
			}
			if (this.matiereNonDesignee) {
				lListeMatieresSelectionnees[this.matiereNonDesignee.getNumero()] =
					this.matiereNonDesignee;
			}
			lListeThemesActifs.parcourir((aTheme) => {
				if (!lListeMatieresSelectionnees[aTheme.matiere.getNumero()]) {
					lListeMatieresSelectionnees[aTheme.matiere.getNumero()] =
						aTheme.matiere;
				}
			});
			this.donnees.parcourir((aTheme) => {
				let lEstDejaDansLaListe = false;
				for (let i in lListeMatieresSelectionnees) {
					if (
						!lEstDejaDansLaListe &&
						(!aTheme.matiere ||
							aTheme.matiere.getNumero() ===
								lListeMatieresSelectionnees[i].getNumero())
					) {
						lListeFiltrees.add(aTheme);
						lEstDejaDansLaListe = true;
					}
				}
			});
		} else {
			const lListeMatieresEnseignees = new ObjetListeElements();
			GEtatUtilisateur.listeMatieres.parcourir((aMatiere) => {
				if (aMatiere.estEnseignee) {
					lListeMatieresEnseignees.add(aMatiere);
				}
			});
			if (this.matiereNonDesignee) {
				lListeMatieresEnseignees.add(this.matiereNonDesignee);
			}
			this.donnees.parcourir((aTheme) => {
				let lEstDejaDansLaListe = false;
				lListeMatieresEnseignees.parcourir((aMatiere) => {
					if (
						!lEstDejaDansLaListe &&
						(!aTheme.matiere ||
							aTheme.matiere.getNumero() === aMatiere.getNumero())
					) {
						lListeFiltrees.add(aTheme);
						lEstDejaDansLaListe = true;
					}
				});
			});
		}
	}
	this._actualiserListe(lListeFiltrees);
}
function _ouvrirFenetreCreation(aParams) {
	const lFenetre = ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_EditionTheme,
		{
			pere: this,
			evenement: function (aTheme) {
				if (aTheme.getEtat() === EGenreEtat.Creation) {
					aTheme.cmsActif = true;
					aTheme.modificationAutorisee = true;
					new ObjetRequeteSaisieListeThemes(this, (aDonneesJSON) => {
						if (!!aDonneesJSON && !!aDonneesJSON.JSONRapportSaisie) {
							const lThemeCree = aDonneesJSON.JSONRapportSaisie.ThemeCree;
							if (!!lThemeCree) {
								aTheme.setNumero(lThemeCree.getNumero());
								if (aTheme.getEtat() !== EGenreEtat.Suppression) {
									aTheme.setEtat(EGenreEtat.Aucun);
								}
								this.donnees.addElement(aTheme);
								_filtrageSelection.call(this);
							}
						}
					}).lancerRequete({
						ListeThemes: new ObjetListeElements().add(aTheme),
					});
				}
			},
			initialiser: function (aInstance) {
				aInstance.setOptionsFenetre({
					titre: GTraductions.getValeur("Theme.titre.nouveauTheme"),
					listeBoutons: [
						GTraductions.getValeur("Fermer"),
						{
							theme: TypeThemeBouton.primaire,
							libelle: GTraductions.getValeur("Theme.btn.creer"),
						},
					],
				});
			},
		},
	);
	lFenetre.setDonnees(aParams, {
		matiereContexte: this.matiereContexte,
		listeMatieres: this.listeMatieres,
		enCreation: true,
		tailleLibelleTheme: this.tailleLibelleTheme,
		listeThemes: this.donnees,
	});
}
module.exports = { ObjetFenetre_ListeThemes };
