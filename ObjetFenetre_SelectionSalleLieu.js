const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { ObjetListe } = require("ObjetListe.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
class ObjetFenetre_SelectionSalleLieu extends ObjetFenetre_Liste {
	constructor(...aParams) {
		super(...aParams);
	}
	setDonnees(aParam) {
		this.avecMonoSelection =
			aParam.avecMonoSelection !== null &&
			aParam.avecMonoSelection !== undefined
				? aParam.avecMonoSelection
				: false;
		this.eltSelectionne = null;
		this._construireListeRessourceAvecCumul(
			aParam.listeRessources,
			aParam.listeRessourcesSelectionnees,
		);
		this.getInstance(this.identListe).setOptionsListe({
			boutons: [{ genre: ObjetListe.typeBouton.rechercher }],
		});
		this.afficher();
		this._actualiserListe();
	}
	_construireListeRessourceAvecCumul(
		aListeRessources,
		aListeRessourcesSelectionnees,
	) {
		this.listeRessources = new ObjetListeElements();
		const lCumulSalles = new ObjetElement(
			GTraductions.getValeur("TvxIntendance.FenetreSelectionLieu_CumulSalles"),
			-1,
			EGenreRessource.Salle,
		);
		lCumulSalles.estDeploye = false;
		lCumulSalles.estUnDeploiement = true;
		lCumulSalles.setActif(true);
		const lCumulLieux = new ObjetElement(
			GTraductions.getValeur("TvxIntendance.FenetreSelectionLieu_CumulLieux"),
			-2,
			EGenreRessource.LieuDossier,
		);
		lCumulLieux.estDeploye = GEtatUtilisateur.pourPrimaire();
		lCumulLieux.estUnDeploiement = true;
		lCumulLieux.setActif(true);
		let lAvecSalles = false;
		let lAvecLieu = false;
		for (let i = 0; i < aListeRessources.count(); i++) {
			const lRessource = MethodesObjet.dupliquer(aListeRessources.get(i));
			if (lRessource.getGenre() === EGenreRessource.Salle) {
				lAvecSalles = true;
				lRessource.pere = lCumulSalles;
			} else {
				lAvecLieu = true;
				lRessource.pere = lCumulLieux;
			}
			if (!!aListeRessourcesSelectionnees) {
				const lEltTrouve =
					aListeRessourcesSelectionnees.getElementParElement(lRessource);
				lRessource.selectionne =
					lEltTrouve !== null && lEltTrouve !== undefined;
				lRessource.estCoche = lEltTrouve !== null && lEltTrouve !== undefined;
			}
			if (!lRessource.pere.estCoche) {
				lRessource.pere.estCoche = lRessource.estCoche;
			}
			if (lRessource.selectionne) {
				lRessource.pere.estDeploye = true;
				this.eltSelectionne = lRessource;
			}
			this.listeRessources.addElement(lRessource);
		}
		if (lAvecSalles) {
			this.listeRessources.addElement(lCumulSalles);
		}
		if (lAvecLieu) {
			if (!GEtatUtilisateur.pourPrimaire()) {
				this.listeRessources.addElement(lCumulLieux);
			}
		}
		this.listeRessources.setTri([
			ObjetTri.init("Genre", true),
			ObjetTri.init((D) => {
				return D.getGenre() === EGenreRessource.LieuDossier;
			}),
			ObjetTri.init((D) => {
				return !!D.pere;
			}),
			ObjetTri.init("Libelle"),
		]);
		this.listeRessources.trier();
	}
	_actualiserListe() {
		const lObjetDonneesListe = new DonneesListe_SallesLieux(
			this.listeRessources,
			{ avecMonoSelection: this.avecMonoSelection },
		);
		lObjetDonneesListe.setOptions({ avecSuppression: true });
		this.getInstance(this.identListe).setDonnees(lObjetDonneesListe, true);
	}
	evenementSurListe(aParametres) {
		if (this.avecMonoSelection) {
			switch (aParametres.genreEvenement) {
				case EGenreEvenementListe.SelectionClick:
					if (aParametres.article.estUnDeploiement) {
						return;
					}
					this.surValidation(1, aParametres.article);
					break;
			}
		}
	}
	surValidation(aNumeroBouton, aArticleSelectionne) {
		this.fermer();
		let lListeSelectionnes;
		if (aArticleSelectionne) {
			lListeSelectionnes = new ObjetListeElements().add(aArticleSelectionne);
		} else {
			lListeSelectionnes = this.listeRessources.getListeElements(
				function (aElement) {
					return aElement.estCoche && !aElement.estUnDeploiement;
				},
			);
		}
		this.callback.appel(aNumeroBouton, lListeSelectionnes);
	}
}
class DonneesListe_SallesLieux extends ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.param = aParam ? aParam : { avecMonoSelection: false };
		this.setOptions({
			avecSelection: true,
			avecSuppression: false,
			avecEtatSaisie: false,
			avecEvnt_ApresEdition: false,
			avecEvnt_Selection: false,
			avecDeploiement: true,
			avecEvnt_Deploiement: true,
			avecEventDeploiementSurCellule: true,
			avecCocheCBSurLigne: !this.param.avecMonoSelection,
			avecEvnt_SelectionClick: this.param.avecMonoSelection,
			avecCB: !this.param.avecMonoSelection,
		});
	}
	getTitreZonePrincipale(aParams) {
		let H = [];
		H.push(
			`<div ie-ellipsis class="ie-titre" >${aParams.article.getLibelle()}</div>`,
		);
		return H.join("");
	}
	_construireBtnAction(aDonnees) {
		let H = [];
		return H.join("");
	}
	setValueCB(aParams, aValue) {
		aParams.article.estCoche = aValue;
	}
}
module.exports = { ObjetFenetre_SelectionSalleLieu };
