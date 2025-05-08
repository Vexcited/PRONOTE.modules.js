exports.ObjetGrille_CreneauxLibres = void 0;
const ObjetGrilleGabarit_1 = require("ObjetGrilleGabarit");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetGrille_1 = require("ObjetGrille");
const TypeResultatRechercheCreneauxLibres_1 = require("TypeResultatRechercheCreneauxLibres");
class ObjetGrille_CreneauxLibres extends ObjetGrille_1.ObjetGrille {
	setDonnees(aParametres) {
		this.initParametresGrille();
		$.extend(this._parametresGrille, {
			infosPlacesLibres: new ObjetListeElements_1.ObjetListeElements(),
			estInfosPlaceLibre: null,
			duree: 1,
			placeSelectionnee: null,
			selectionSalles: true,
		});
		$.extend(this._parametresGrille, aParametres);
		this._options.convertisseurPosition.remplirColonnesVisibles();
		this.donneesRecus = true;
		this.construireAffichage();
		if (
			this._parametresGrille.placeSelectionnee !== null &&
			this._parametresGrille.placeSelectionnee >= 0
		) {
			this._positionnerGabarit();
		}
	}
	getGabarit() {
		return this.gabarit;
	}
	apresConstructionGrille() {
		super.apresConstructionGrille();
		this._positionnerGabarit();
	}
	getContenuHtmlCellule(aPlaceGrille, aParams) {
		const T = [];
		T.push(super.getContenuHtmlCellule(aPlaceGrille, aParams));
		if (!this._parametresGrille.infosPlacesLibres) {
			return T.join("");
		}
		const lInfosPlace =
			this._parametresGrille.infosPlacesLibres.get(aPlaceGrille);
		if (
			this._parametresGrille.estInfosPlaceLibre &&
			this._parametresGrille.estInfosPlaceLibre(lInfosPlace)
		) {
			T.push(this._construireCarrePlaceLibre(aParams, true));
			if (
				!this._parametresGrille.selectionSalles &&
				lInfosPlace.listeSallesLibres
			) {
				T.push(
					'<div class="Texte10 AlignementMilieu" style="position:absolute;' +
						"top:" +
						aParams.top +
						"px;" +
						"line-height:" +
						aParams.height +
						"px;" +
						"left:" +
						aParams.left +
						"px;" +
						"width:" +
						aParams.width +
						'px;">' +
						lInfosPlace.listeSallesLibres.count() +
						"</div>",
				);
			}
		}
		return T.join("");
	}
	surMouseDownGrilleCellule(aPlace) {
		this._parametresGrille.placeSelectionnee = aPlace;
		this._positionnerGabarit();
		if (this._timer) {
			clearTimeout(this._timer);
		}
		if (this._options.callbackPlaceGabarit) {
			this._timer = setTimeout(
				this._options.callbackPlaceGabarit.bind(this, aPlace),
				100,
			);
		}
	}
	getClassCurseurDeCellule(aPlaceGrille) {
		let lClass = super.getClassCurseurDeCellule(aPlaceGrille);
		lClass += this._estPlaceEvaluationInvalide(aPlaceGrille)
			? " AvecInterdiction"
			: " AvecMain";
		return lClass;
	}
	_getTailleBorduresGabarit() {
		let lTailleBordureGabarit = 4;
		if (this.hauteurCellule < 20) {
			lTailleBordureGabarit = 2;
		} else if (this.hauteurCellule < 30) {
			lTailleBordureGabarit = 3;
		}
		return lTailleBordureGabarit;
	}
	_estPlaceEvaluationInvalide(aPlace) {
		if (!this._parametresGrille.infosPlacesLibres) {
			return false;
		}
		const lInfosPlace = this._parametresGrille.infosPlacesLibres.get(aPlace);
		if (!lInfosPlace) {
			return true;
		}
		if (
			lInfosPlace.resultatRecherche ===
				TypeResultatRechercheCreneauxLibres_1
					.TypeResultatRechercheCreneauxLibres.rrIndefini ||
			lInfosPlace.resultatRecherche ===
				TypeResultatRechercheCreneauxLibres_1
					.TypeResultatRechercheCreneauxLibres.rrHorsGrille
		) {
			return true;
		}
		return false;
	}
	_positionnerGabarit() {
		if (
			this._estPlaceEvaluationInvalide(this._parametresGrille.placeSelectionnee)
		) {
			return;
		}
		this.gabarit = new ObjetGrilleGabarit_1.ObjetGrilleGabarit({
			grille: this,
			avecDeplacement: true,
			avecRetaillageHoraire: false,
			avecModificationCreation: false,
			couleurTrait: GCouleur.grille.gabarit,
			tailleTrait: this._getTailleBorduresGabarit(),
			ecartBord: this.hauteurCellule < 20 ? 0 : 2,
			tailleBordureInterne: 1,
			tailleBordureExterne: 1,
			deplacementAutorise: (aParams) => {
				if (this._estPlaceEvaluationInvalide(aParams.place)) {
					return false;
				}
				return true;
			},
			callbackDeplacement: (aParams) => {
				this._parametresGrille.placeSelectionnee = aParams.place;
				if (this._options.callbackPlaceGabarit) {
					this._options.callbackPlaceGabarit(aParams.place);
				}
			},
			callbackDoubleClic: () => {
				this._options.callbackDblClickGabarit();
			},
			callbackMenuContextuel: () => {
				this._options.callbackContextMenuGabarit();
			},
		});
		this.gabarit.demarrerCreation({
			place: this._parametresGrille.placeSelectionnee,
			placeFin:
				this._parametresGrille.placeSelectionnee +
				this._parametresGrille.duree -
				1,
		});
	}
}
exports.ObjetGrille_CreneauxLibres = ObjetGrille_CreneauxLibres;
