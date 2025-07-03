exports.ObjetFenetre_ChoixEleveNonGAEV = void 0;
const TypeFusionTitreListe_1 = require("TypeFusionTitreListe");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ObjetRequeteListeElevesGAEV_1 = require("ObjetRequeteListeElevesGAEV");
class ObjetFenetre_ChoixEleveNonGAEV extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur("ChoixEleveGAEV.titre"),
			largeur: 500,
			hauteur: 600,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			fenetreBtn: {
				getDisabled: function (aBoutonRepeat) {
					if (aBoutonRepeat.element.index === 0) {
						return false;
					}
					return (
						!aInstance.donnees ||
						!aInstance.donnees.selections ||
						aInstance.donnees.selections.count() === 0
					);
				},
			},
		});
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListeEleves,
			this._initialiserListeEleves,
		);
	}
	setDonnees(aGroupe, aDomaine) {
		this.donnees = {
			groupe: aGroupe,
			domaine: aDomaine,
			liste: null,
			selections: new ObjetListeElements_1.ObjetListeElements(),
		};
		new ObjetRequeteListeElevesGAEV_1.ObjetRequeteListeElevesGAEV(
			this,
			this._actionSurRequeteListeElevesGAEV,
		).lancerRequete({
			groupe: this.donnees.groupe,
			domaine: this.donnees.domaine,
		});
	}
	composeContenu() {
		const T = [];
		T.push(
			IE.jsx.str("div", {
				id: this.getNomInstance(this.identListe),
				style: "width:100%; height:100%",
			}),
		);
		return T.join("");
	}
	surValidation(aGenreBouton) {
		this.fermer();
		this.callback.appel(aGenreBouton === 1, this.donnees.selections);
	}
	_initialiserListeEleves(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_ElevesNonGAEV.colonnes.nom,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"ChoixEleveGAEV.colonne.nom",
			),
			taille: "100%",
		});
		lColonnes.push({
			id: DonneesListe_ElevesNonGAEV.colonnes.indispo,
			titre: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
			taille: 20,
		});
		lColonnes.push({
			id: DonneesListe_ElevesNonGAEV.colonnes.option,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"ChoixEleveGAEV.colonne.options",
			),
			taille: 250,
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			colonnesSansBordureDroit: [DonneesListe_ElevesNonGAEV.colonnes.nom],
		});
	}
	_evenementListeEleves(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Deploiement:
				if (
					ObjetFenetre_ChoixEleveNonGAEV.estUnArticleClasse(
						aParametres.article,
					) &&
					!aParametres.article.listeEleves
				) {
					new ObjetRequeteListeElevesGAEV_1.ObjetRequeteListeElevesGAEV(
						this,
						this._actionSurRequeteDemandeElevesDeClasse.bind(
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
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.donnees.selections = this.getInstance(
					this.identListe,
				).getListeElementsSelection();
				break;
		}
	}
	_actionSurRequeteDemandeElevesDeClasse(aClasse, aJSON) {
		aClasse.listeEleves = aJSON.listeEleves;
		this._actualiserListe(true);
	}
	_actualiserListe(aConserverScroll = false) {
		const lListe = this.getInstance(this.identListe);
		lListe.setDonnees(
			new DonneesListe_ElevesNonGAEV(this.donnees.liste),
			null,
			{ conserverPositionScroll: aConserverScroll },
		);
		lListe.setListeElementsSelection(this.donnees.selections);
	}
	_actionSurRequeteListeElevesGAEV(aJSON) {
		this.afficher();
		this.donnees.liste = aJSON.listeClasses;
		aJSON.listeClasses.parcourir((aElement) => {
			aElement.estUnDeploiement = true;
			aElement.estDeploye = false;
		});
		this._actualiserListe();
	}
	static estUnArticleClasse(aObjet) {
		return "avecEleve" in aObjet;
	}
}
exports.ObjetFenetre_ChoixEleveNonGAEV = ObjetFenetre_ChoixEleveNonGAEV;
class DonneesListe_ElevesNonGAEV extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
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
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
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
				if (
					!ObjetFenetre_ChoixEleveNonGAEV.estUnArticleClasse(aParams.article) &&
					aParams.article.indispoTotale
				) {
					return '<div class="Image_CoursExportPNCoursRouge"></div>';
				}
				if (
					!ObjetFenetre_ChoixEleveNonGAEV.estUnArticleClasse(aParams.article) &&
					aParams.article.indispoPartielle
				) {
					return '<div class="Image_CoursExportPNCoursOrange"></div>';
				}
				return "";
			case DonneesListe_ElevesNonGAEV.colonnes.option:
				if (
					!ObjetFenetre_ChoixEleveNonGAEV.estUnArticleClasse(aParams.article)
				) {
					return aParams.article.options;
				}
				return "";
		}
		return "";
	}
	fusionCelluleAvecColonnePrecedente(aParams) {
		return (
			aParams.article.estUnDeploiement &&
			aParams.idColonne !== DonneesListe_ElevesNonGAEV.colonnes.nom
		);
	}
	getClass(aParams) {
		const lClasses = [];
		if (aParams.article.estUnDeploiement) {
			if (
				ObjetFenetre_ChoixEleveNonGAEV.estUnArticleClasse(aParams.article) &&
				aParams.article.avecEleve
			) {
				lClasses.push("Gras", "AvecMain");
			}
		}
		return lClasses.join(" ");
	}
	getCouleurCellule(aParams) {
		return aParams.article.estUnDeploiement
			? ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Deploiement
			: ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Gris;
	}
	getTri() {
		return [
			ObjetTri_1.ObjetTri.initRecursif("pere", [
				ObjetTri_1.ObjetTri.init((aElement) => {
					return (
						ObjetFenetre_ChoixEleveNonGAEV.estUnArticleClasse(aElement) &&
						!aElement.avecEleve
					);
				}),
				ObjetTri_1.ObjetTri.init("Libelle"),
			]),
		];
	}
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ElevesNonGAEV.colonnes.indispo:
				if (
					!ObjetFenetre_ChoixEleveNonGAEV.estUnArticleClasse(aParams.article) &&
					aParams.article.hintIndispo
				) {
					return aParams.article.hintIndispo;
				}
		}
		return "";
	}
}
DonneesListe_ElevesNonGAEV.colonnes = {
	nom: "nom",
	indispo: "indispo",
	option: "option",
};
