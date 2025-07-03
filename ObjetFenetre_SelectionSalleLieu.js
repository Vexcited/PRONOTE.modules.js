exports.DonneesListe_SallesLieux = exports.ObjetFenetre_SelectionSalleLieu =
	void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const C_CumulHebergement = "hebergement";
class ObjetFenetre_SelectionSalleLieu extends ObjetFenetre_Liste_1.ObjetFenetre_Liste {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = GApplication;
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
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
		this.afficher();
		this._actualiserListe();
	}
	_construireListeRessourceAvecCumul(
		aListeRessources,
		aListeRessourcesSelectionnees,
	) {
		const _construireCumul = function (
			aLibelle,
			aGenre,
			aPosition,
			aEstDeploye,
		) {
			const lCumulSalles = ObjetElement_1.ObjetElement.create({
				Libelle: aLibelle,
				Genre: aGenre,
				Position: aPosition,
			});
			lCumulSalles.estDeploye = aEstDeploye;
			lCumulSalles.estUnDeploiement = true;
			lCumulSalles.setActif(true);
			return lCumulSalles;
		};
		this.listeRessources = new ObjetListeElements_1.ObjetListeElements();
		const lCumulSalles = _construireCumul(
			ObjetTraduction_1.GTraductions.getValeur(
				"TvxIntendance.FenetreSelectionLieu_CumulSalles",
			),
			Enumere_Ressource_1.EGenreRessource.Salle,
			0,
			false,
		);
		const lCumulLieux = _construireCumul(
			ObjetTraduction_1.GTraductions.getValeur(
				"TvxIntendance.FenetreSelectionLieu_CumulLieux",
			),
			Enumere_Ressource_1.EGenreRessource.LieuDossier,
			1,
			this.etatUtilisateurSco.pourPrimaire(),
		);
		const lCumulInternat = _construireCumul(
			ObjetTraduction_1.GTraductions.getValeur(
				"TvxIntendance.FenetreSelectionLieu_CumulInternat",
			),
			C_CumulHebergement,
			2,
			false,
		);
		const lCumulDortoir = _construireCumul(
			ObjetTraduction_1.GTraductions.getValeur(
				"TvxIntendance.FenetreSelectionLieu_CumulDortoir",
			),
			Enumere_Ressource_1.EGenreRessource.Dortoir,
			0,
			false,
		);
		lCumulDortoir.pere = lCumulInternat;
		const lCumulChambre = _construireCumul(
			ObjetTraduction_1.GTraductions.getValeur(
				"TvxIntendance.FenetreSelectionLieu_CumulChambre",
			),
			Enumere_Ressource_1.EGenreRessource.Chambre,
			1,
			false,
		);
		lCumulChambre.pere = lCumulInternat;
		let lAvecSalles = false;
		let lAvecLieu = false;
		let lAvecDortoir = false;
		let lAvecChambre = false;
		for (let i = 0; i < aListeRessources.count(); i++) {
			const lRessource = MethodesObjet_1.MethodesObjet.dupliquer(
				aListeRessources.get(i),
			);
			switch (lRessource.getGenre()) {
				case Enumere_Ressource_1.EGenreRessource.Salle:
					lAvecSalles = true;
					lRessource.pere = lCumulSalles;
					break;
				case Enumere_Ressource_1.EGenreRessource.LieuDossier:
					lAvecLieu = true;
					lRessource.pere = lCumulLieux;
					break;
				case Enumere_Ressource_1.EGenreRessource.Dortoir:
					lAvecDortoir = true;
					lRessource.nbChambre = 0;
					lRessource.pere = lCumulDortoir;
					break;
				case Enumere_Ressource_1.EGenreRessource.Chambre:
					if (lRessource.dortoir) {
						break;
					} else {
						lAvecChambre = true;
						lRessource.pere = lCumulChambre;
					}
					break;
				default:
					break;
			}
			if (!!aListeRessourcesSelectionnees) {
				const lEltTrouve =
					aListeRessourcesSelectionnees.getElementParElement(lRessource);
				lRessource.selectionne =
					lEltTrouve !== null && lEltTrouve !== undefined;
				lRessource.estCoche = lEltTrouve !== null && lEltTrouve !== undefined;
			}
			if (lRessource.pere && !lRessource.pere.estCoche) {
				lRessource.pere.estCoche = lRessource.estCoche;
			}
			if (lRessource.selectionne) {
				if (lRessource.pere) {
					lRessource.pere.estDeploye = true;
				}
				this.eltSelectionne = lRessource;
			}
			this.listeRessources.addElement(lRessource);
		}
		this.listeRessources.parcourir((aRessource) => {
			if (
				aRessource.getGenre() === Enumere_Ressource_1.EGenreRessource.Chambre &&
				aRessource.dortoir
			) {
				const lDortoir = this.listeRessources.getElementParNumeroEtGenre(
					aRessource.dortoir.getNumero(),
					Enumere_Ressource_1.EGenreRessource.Dortoir,
				);
				if (lDortoir) {
					aRessource.pere = lDortoir;
					lDortoir.estDeploye = true;
					lDortoir.estUnDeploiement = true;
					lDortoir.nbChambre++;
				}
			}
		});
		if (lAvecSalles) {
			this.listeRessources.addElement(lCumulSalles);
		}
		if (lAvecLieu) {
			if (!this.etatUtilisateurSco.pourPrimaire()) {
				this.listeRessources.addElement(lCumulLieux);
			}
		}
		if (lAvecChambre || lAvecDortoir) {
			this.listeRessources.addElement(lCumulInternat);
			if (lAvecDortoir) {
				this.listeRessources.addElement(lCumulDortoir);
			}
			if (lAvecChambre) {
				this.listeRessources.addElement(lCumulChambre);
			}
		}
		this.listeRessources.setTri([
			ObjetTri_1.ObjetTri.initRecursif("pere", [
				ObjetTri_1.ObjetTri.init("Position"),
				ObjetTri_1.ObjetTri.init("Libelle"),
			]),
		]);
		this.listeRessources.trier();
	}
	_actualiserListe() {
		const lObjetDonneesListe = new DonneesListe_SallesLieux(
			this.listeRessources,
			{ avecMonoSelection: this.avecMonoSelection },
		);
		this.getInstance(this.identListe).setDonnees(lObjetDonneesListe);
	}
	evenementSurListe(aParams) {
		if (this.avecMonoSelection) {
			switch (aParams.genreEvenement) {
				case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
					if (aParams.article.estUnDeploiement) {
						if (
							aParams.article.getGenre() !==
								Enumere_Ressource_1.EGenreRessource.Dortoir &&
							aParams.article.getNumero() !== undefined
						) {
							return;
						}
					}
					this.surValidation(1);
					break;
			}
		}
	}
	surValidation(aNumeroBouton) {
		let lListeSelectionnes = new ObjetListeElements_1.ObjetListeElements();
		if (this.avecMonoSelection) {
			const lMaSelection = this.getInstance(
				this.identListe,
			).getElementSelection();
			if (lMaSelection && !lMaSelection.estUnDeploiement) {
				lListeSelectionnes = new ObjetListeElements_1.ObjetListeElements().add(
					lMaSelection,
				);
			}
		} else {
			lListeSelectionnes = this.listeRessources.getListeElements((aElement) => {
				return aElement.estCoche && aElement.existeNumero();
			});
		}
		this.callback.appel(aNumeroBouton, lListeSelectionnes, true);
		this.fermer();
	}
}
exports.ObjetFenetre_SelectionSalleLieu = ObjetFenetre_SelectionSalleLieu;
class DonneesListe_SallesLieux extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.setOptions({
			avecSelection: true,
			avecEvnt_Selection: false,
			avecDeploiement: true,
			avecEvnt_Deploiement: true,
			avecEventDeploiementSurCellule: true,
			avecCocheCBSurLigne: !aParam.avecMonoSelection,
			avecEvnt_SelectionClick: aParam.avecMonoSelection,
			avecCB: !aParam.avecMonoSelection,
			avecBoutonActionLigne: false,
		});
	}
	getTitreZonePrincipale(aParams) {
		return IE.jsx.str(
			"div",
			{ "ie-ellipsis": true, class: "ie-titre" },
			aParams.article.getLibelle(),
		);
	}
	estCocheSelonFilsSurLigneDeploiement(aArticle) {
		if (this.estDortoir(aArticle)) {
			return false;
		}
		return true;
	}
	estDortoir(aArticle) {
		return (
			aArticle.getGenre() === Enumere_Ressource_1.EGenreRessource.Dortoir &&
			aArticle.getNumero() !== undefined
		);
	}
	getNombreChambreCocheePourDortoir(aDortoir) {
		if (!this.estDortoir(aDortoir)) {
			return 0;
		}
		const lChambresCochees = this.Donnees.getListeElements((aElement) => {
			if (aElement.getGenre() !== Enumere_Ressource_1.EGenreRessource.Chambre) {
				return false;
			}
			return (
				(aElement === null || aElement === void 0
					? void 0
					: aElement.dortoir) &&
				aElement.dortoir.getNumero() === aDortoir.getNumero() &&
				aElement.estCoche
			);
		});
		return lChambresCochees.count();
	}
}
exports.DonneesListe_SallesLieux = DonneesListe_SallesLieux;
