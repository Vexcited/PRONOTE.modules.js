exports.ObjetFenetre_SelectionServicesDEvaluation = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Espace_1 = require("Enumere_Espace");
class ObjetFenetre_SelectionServicesDEvaluation extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			largeur: 250,
			hauteur: 500,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	setDonnees(aListeServices, aAvecMultiSelection, aAvecDetailServices) {
		this.listeServices =
			MethodesObjet_1.MethodesObjet.dupliquer(aListeServices);
		this.avecMultiSelection = aAvecMultiSelection;
		this.avecDetailServices = aAvecDetailServices;
		const lNbrServices = this.listeServices.count();
		if (lNbrServices === 0) {
			GApplication.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				message: ObjetTraduction_1.GTraductions.getValeur(
					"competences.ImpossibleDeDupliquer",
				),
			});
		} else if (lNbrServices === 1) {
			this.callback.appel(aListeServices, 1);
		} else {
			const lTitreFenetre =
				GEtatUtilisateur.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Etablissement
					? ObjetTraduction_1.GTraductions.getValeur(
							"competences.DupliquerEvalLVE",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"competences.DupliquerEvalService",
						);
			this.setOptionsFenetre({ titre: lTitreFenetre });
			this._initialiserListe(this.getInstance(this.identListe));
			this.afficher();
			this._actualiserListe();
			this.positionnerFenetre();
		}
	}
	surValidation(ANumeroBouton) {
		let lListeSelection = new ObjetListeElements_1.ObjetListeElements();
		if (ANumeroBouton === 1) {
			lListeSelection = this.getInstance(
				this.identListe,
			).getListeElementsSelection();
		}
		this.fermer();
		this.callback.appel(lListeSelection, ANumeroBouton);
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListe.bind(this),
		);
	}
	composeContenu() {
		const T = [];
		T.push(
			'<div id="',
			this.getNomInstance(this.identListe),
			'" class="table-contain full-size"></div>',
		);
		return T.join("");
	}
	_initialiserListe(aInstance) {
		const lColonnes = [];
		if (this.avecDetailServices) {
			lColonnes.push({
				id: DonneesListeSelectionService.colonnes.classeGroupe,
				titre:
					ObjetTraduction_1.GTraductions.getValeur("Classe") +
					"/" +
					ObjetTraduction_1.GTraductions.getValeur("Groupe"),
				taille: 90,
			});
			lColonnes.push({
				id: DonneesListeSelectionService.colonnes.service,
				titre: ObjetTraduction_1.GTraductions.getValeur("Matiere"),
				taille: 150,
			});
			lColonnes.push({
				id: DonneesListeSelectionService.colonnes.professeurs,
				titre: ObjetTraduction_1.GTraductions.getValeur("Professeurs"),
				taille: 150,
			});
		} else {
			lColonnes.push({
				id: DonneesListeSelectionService.colonnes.classeGroupe,
				titre: ObjetTraduction_1.GTraductions.getValeur("Classe"),
				taille: 150,
			});
		}
		aInstance.setOptionsListe({ colonnes: lColonnes });
	}
	_actualiserListe() {
		this.setBoutonActif(1, false);
		this.getInstance(this.identListe).setDonnees(
			new DonneesListeSelectionService(
				this.listeServices,
				this.avecMultiSelection,
			),
		);
	}
	_evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.setBoutonActif(
					1,
					this.getInstance(this.identListe)
						.getListeElementsSelection()
						.count() > 0,
				);
				break;
		}
	}
}
exports.ObjetFenetre_SelectionServicesDEvaluation =
	ObjetFenetre_SelectionServicesDEvaluation;
class DonneesListeSelectionService extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aAvecMultiSelection) {
		super(aDonnees);
		this.setOptions({
			avecMultiSelection: aAvecMultiSelection,
			avecEdition: false,
			avecSuppression: false,
			avecEvnt_Selection: true,
		});
	}
	getTri() {
		const lTris = [];
		lTris.push(
			ObjetTri_1.ObjetTri.init((D) => {
				return D.strClasseGroupe || "";
			}),
		);
		lTris.push(ObjetTri_1.ObjetTri.init("Libelle"));
		return lTris;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListeSelectionService.colonnes.classeGroupe:
				return aParams.article.strClasseGroupe || "";
			case DonneesListeSelectionService.colonnes.service:
				return aParams.article.getLibelle();
			case DonneesListeSelectionService.colonnes.professeurs:
				return aParams.article.strProfesseur || "";
		}
		return "";
	}
}
(function (DonneesListeSelectionService) {
	let colonnes;
	(function (colonnes) {
		colonnes["classeGroupe"] = "SelectionService_classeGroupe";
		colonnes["service"] = "SelectionService_service";
		colonnes["professeurs"] = "SelectionService_profs";
	})(
		(colonnes =
			DonneesListeSelectionService.colonnes ||
			(DonneesListeSelectionService.colonnes = {})),
	);
})(DonneesListeSelectionService || (DonneesListeSelectionService = {}));
