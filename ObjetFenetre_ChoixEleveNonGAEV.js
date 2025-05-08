const { TypeFusionTitreListe } = require("TypeFusionTitreListe.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const ObjetRequeteListeElevesGAEV = require("ObjetRequeteListeElevesGAEV.js");
class ObjetFenetre_ChoixEleveNonGAEV extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: GTraductions.getValeur("ChoixEleveGAEV.titre"),
			largeur: 500,
			hauteur: 600,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
			],
		});
	}
	getControleur() {
		return $.extend(true, super.getControleur(this), {
			fenetreBtn: {
				getDisabled: function (aBoutonRepeat) {
					if (aBoutonRepeat.element.index === 0) {
						return false;
					}
					return (
						!this.instance.donnees ||
						!this.instance.donnees.selections ||
						this.instance.donnees.selections.count() === 0
					);
				},
			},
		});
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe,
			_evenementListeEleves,
			_initialiserListeEleves,
		);
	}
	setDonnees(aGroupe, aDomaine) {
		this.donnees = {
			groupe: aGroupe,
			domaine: aDomaine,
			liste: null,
			selections: new ObjetListeElements(),
		};
		new ObjetRequeteListeElevesGAEV(
			this,
			_actionSurRequeteListeElevesGAEV,
		).lancerRequete({
			groupe: this.donnees.groupe,
			domaine: this.donnees.domaine,
		});
	}
	composeContenu() {
		const T = [];
		T.push(
			'<div id="',
			this.getNomInstance(this.identListe),
			'" style="width:100%; height:100%"></div>',
		);
		return T.join("");
	}
	surValidation(aGenreBouton) {
		this.fermer();
		this.callback.appel(aGenreBouton === 1, this.donnees.selections);
	}
}
function _initialiserListeEleves(aInstance) {
	aInstance.setOptionsListe({
		colonnes: [
			{
				id: DonneesListe_ElevesNonGAEV.colonnes.nom,
				titre: GTraductions.getValeur("ChoixEleveGAEV.colonne.nom"),
				taille: "100%",
			},
			{
				id: DonneesListe_ElevesNonGAEV.colonnes.indispo,
				titre: TypeFusionTitreListe.FusionGauche,
				taille: 20,
			},
			{
				id: DonneesListe_ElevesNonGAEV.colonnes.option,
				titre: GTraductions.getValeur("ChoixEleveGAEV.colonne.options"),
				taille: 250,
			},
		],
		colonnesSansBordureDroit: [DonneesListe_ElevesNonGAEV.colonnes.nom],
	});
}
function _actionSurRequeteDemandeElevesDeClasse(aClasse, aJSON) {
	aClasse.listeEleves = aJSON.listeEleves;
	_actualiserListe.call(this, true);
}
function _evenementListeEleves(aParametres) {
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.Deploiement:
			if (!aParametres.article.listeEleves) {
				new ObjetRequeteListeElevesGAEV(
					this,
					_actionSurRequeteDemandeElevesDeClasse.bind(
						this,
						aParametres.article,
					),
				).lancerRequete({
					groupe: this.donnees.groupe,
					domaine: this.donnees.domaine,
					classeDemande: aParametres.article,
				});
			} else {
				this.getInstance(this.identListe).setListeElementsSelection(
					this.donnees.selections,
				);
			}
			break;
		case EGenreEvenementListe.Selection:
			this.donnees.selections = this.getInstance(
				this.identListe,
			).getListeElementsSelection();
			break;
	}
}
function _actualiserListe(aConserverScroll) {
	const lListe = this.getInstance(this.identListe);
	lListe.setDonnees(new DonneesListe_ElevesNonGAEV(this.donnees.liste), null, {
		conserverPositionScroll: aConserverScroll,
	});
	lListe.setListeElementsSelection(this.donnees.selections);
}
function _actionSurRequeteListeElevesGAEV(aJSON) {
	this.afficher();
	this.donnees.liste = aJSON.listeClasses;
	aJSON.listeClasses.parcourir((aElement) => {
		aElement.estUnDeploiement = true;
		aElement.estDeploye = false;
	});
	_actualiserListe.call(this);
}
class DonneesListe_ElevesNonGAEV extends ObjetDonneesListe {
	constructor(aDonnees) {
		const lListe = new ObjetListeElements();
		aDonnees.parcourir((aClasse) => {
			lListe.addElement(aClasse);
			if (aClasse.listeEleves) {
				aClasse.listeEleves.parcourir((aEleve) => {
					lListe.addElement(aEleve);
					aEleve.pere = aClasse;
				});
			}
		});
		super(lListe);
		this.setOptions({
			avecEdition: false,
			avecDeploiement: true,
			avecSuppression: false,
			avecEvnt_Deploiement: true,
			avecMultiSelection: true,
		});
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ElevesNonGAEV.colonnes.indispo:
				return ObjetDonneesListe.ETypeCellule.Html;
			default:
				return ObjetDonneesListe.ETypeCellule.Texte;
		}
	}
	avecMenuContextuel() {
		return false;
	}
	avecEvenementSelection(aParams) {
		return !aParams.article.estUnDeploiement;
	}
	avecSelection(aParams) {
		return !aParams.article.estUnDeploiement;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ElevesNonGAEV.colonnes.nom:
				return aParams.article.getLibelle();
			case DonneesListe_ElevesNonGAEV.colonnes.indispo:
				if (aParams.article.indispoTotale) {
					return '<div class="Image_CoursExportPNCoursRouge"></div>';
				}
				if (aParams.article.indispoPartielle) {
					return '<div class="Image_CoursExportPNCoursOrange"></div>';
				}
				return "";
			case DonneesListe_ElevesNonGAEV.colonnes.option:
				return aParams.article.options;
			default:
		}
	}
	fusionCelluleAvecColonnePrecedente(aParams) {
		return (
			aParams.article.estUnDeploiement &&
			aParams.idColonne !== DonneesListe_ElevesNonGAEV.colonnes.nom
		);
	}
	getClass(aParams) {
		return aParams.article.estUnDeploiement && aParams.article.avecEleve
			? "Gras AvecMain"
			: "";
	}
	getCouleurCellule(aParams) {
		return aParams.article.estUnDeploiement
			? ObjetDonneesListe.ECouleurCellule.Deploiement
			: ObjetDonneesListe.ECouleurCellule.Gris;
	}
	getTri() {
		return [
			ObjetTri.initRecursif("pere", [
				ObjetTri.init((aElement) => {
					return !aElement.avecEleve;
				}),
				ObjetTri.init("Libelle"),
			]),
		];
	}
	getHintForce(aParams) {
		if (
			aParams.idColonne === DonneesListe_ElevesNonGAEV.colonnes.indispo &&
			aParams.article.hintIndispo
		) {
			return aParams.article.hintIndispo;
		}
		return "";
	}
}
DonneesListe_ElevesNonGAEV.colonnes = {
	nom: "nom",
	indispo: "indispo",
	option: "option",
};
module.exports = ObjetFenetre_ChoixEleveNonGAEV;
