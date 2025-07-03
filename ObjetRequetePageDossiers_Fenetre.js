exports.ObjetRequetePageDossiers_Fenetre = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTri_1 = require("ObjetTri");
const Cache_1 = require("Cache");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetRequetePageDossiers_Fenetre extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aEleve) {
		this.eleveConcerne = aEleve;
		if (Cache_1.GCache.dossierVS.existeDonnee(aEleve.getNumero().toString())) {
			const lDonnees = Cache_1.GCache.dossierVS.getDonnee(
				aEleve.getNumero().toString(),
			);
			this.callbackReussite.appel(lDonnees);
		} else {
			this.JSON = { eleve: aEleve };
			return this.appelAsynchrone();
		}
	}
	actionApresRequete() {
		const lDonneesSaisieDossier = {
			listeCategories: new ObjetListeElements_1.ObjetListeElements(),
			listeRespAdmin: new ObjetListeElements_1.ObjetListeElements(),
			listeLieux: new ObjetListeElements_1.ObjetListeElements(),
			listeActeurs: new ObjetListeElements_1.ObjetListeElements(),
			listeInterlocuteurs: new ObjetListeElements_1.ObjetListeElements(),
			titreSuivi: "",
			listeResponsables: new ObjetListeElements_1.ObjetListeElements(),
			listeEquipePedagogique: new ObjetListeElements_1.ObjetListeElements(),
			listeTypes: new ObjetListeElements_1.ObjetListeElements(),
			listeSousCategorieDossier: new ObjetListeElements_1.ObjetListeElements(),
		};
		lDonneesSaisieDossier.listeCategories.add(this.JSONReponse.listeCategories);
		lDonneesSaisieDossier.listeCategories.parcourir((aCategorie) => {
			const H = [];
			H.push(
				"<div>",
				'<div class="InlineBlock AlignementMilieuVertical" style="width: 8px; height: 10px;',
				ObjetStyle_1.GStyle.composeCouleurBordure("darkgray"),
				ObjetStyle_1.GStyle.composeCouleurFond(aCategorie.couleur),
				'"></div>',
				'<div class="PetitEspaceGauche InlineBlock AlignementMilieuVertical">',
				aCategorie.getLibelle(),
				"</div>",
				"</div>",
			);
			aCategorie.libelleHtml = H.join("");
			if (!!aCategorie.listeMotifs) {
				aCategorie.listeMotifs.parcourir((aMotif) => {
					aMotif.Editable = aMotif.Supprimable =
						!aMotif.estUtilise && !aMotif.estParDefaut;
				});
			}
		});
		lDonneesSaisieDossier.listeCategories.setTri([
			ObjetTri_1.ObjetTri.init("Genre"),
		]);
		lDonneesSaisieDossier.listeCategories.trier();
		lDonneesSaisieDossier.listeRespAdmin.add(this.JSONReponse.listeRespAdmin);
		lDonneesSaisieDossier.listeRespAdmin.insererElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("Aucune"),
				0,
				Enumere_Ressource_1.EGenreRessource.Aucune,
			),
			0,
		);
		let lCumulPersonnel;
		if (
			lDonneesSaisieDossier.listeRespAdmin.getNbrElementsExistes(
				Enumere_Ressource_1.EGenreRessource.Personnel,
			) > 0
		) {
			lCumulPersonnel = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("Personnels"),
				0,
				Enumere_Ressource_1.EGenreRessource.Personnel,
			);
			lCumulPersonnel.estCumul = true;
			lCumulPersonnel.AvecSelection = false;
			lCumulPersonnel.Position = 0;
			lCumulPersonnel.ClassAffichage = "Gras";
			lDonneesSaisieDossier.listeRespAdmin.add(lCumulPersonnel);
		}
		let lCumulProfesseur;
		if (
			lDonneesSaisieDossier.listeRespAdmin.getNbrElementsExistes(
				Enumere_Ressource_1.EGenreRessource.Enseignant,
			) > 0
		) {
			lCumulProfesseur = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("Professeurs"),
				0,
				Enumere_Ressource_1.EGenreRessource.Enseignant,
			);
			lCumulProfesseur.estCumul = true;
			lCumulProfesseur.AvecSelection = false;
			lCumulProfesseur.Position = 0;
			lCumulProfesseur.ClassAffichage = "Gras";
			lDonneesSaisieDossier.listeRespAdmin.add(lCumulProfesseur);
		}
		lDonneesSaisieDossier.listeRespAdmin.parcourir((aElement) => {
			if (
				[
					Enumere_Ressource_1.EGenreRessource.Personnel,
					Enumere_Ressource_1.EGenreRessource.Enseignant,
				].includes(aElement.getGenre()) &&
				!aElement.estCumul
			) {
				aElement.ClassAffichage = "p-left";
				if (
					aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Personnel
				) {
					aElement.pere = lCumulPersonnel;
				} else {
					aElement.pere = lCumulProfesseur;
				}
			}
		});
		lDonneesSaisieDossier.listeRespAdmin.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				switch (D.getGenre()) {
					case Enumere_Ressource_1.EGenreRessource.Aucune:
						return 0;
					case Enumere_Ressource_1.EGenreRessource.Personnel:
						return 1;
					case Enumere_Ressource_1.EGenreRessource.Enseignant:
						return 2;
					default:
						return 3;
				}
			}),
			ObjetTri_1.ObjetTri.init("Position"),
		]);
		lDonneesSaisieDossier.listeRespAdmin.trier();
		lDonneesSaisieDossier.listeLieux.add(this.JSONReponse.listeLieux);
		lDonneesSaisieDossier.listeLieux.insererElement(
			new ObjetElement_1.ObjetElement("", 0),
			0,
		);
		lDonneesSaisieDossier.listeActeurs.add(this.JSONReponse.listeActeurs);
		lDonneesSaisieDossier.listeActeurs.insererElement(
			new ObjetElement_1.ObjetElement("", 0),
			0,
		);
		lDonneesSaisieDossier.listeInterlocuteurs.add(
			this.JSONReponse.listeInterlocuteurs,
		);
		lDonneesSaisieDossier.titreSuivi = this.JSONReponse.titreSuivi;
		lDonneesSaisieDossier.listeResponsables.add(
			this.JSONReponse.listeResponsables,
		);
		lDonneesSaisieDossier.listeEquipePedagogique.add(
			this.JSONReponse.listeEquipePedagogique,
		);
		lDonneesSaisieDossier.listeTypes.add(this.JSONReponse.listeTypes);
		lDonneesSaisieDossier.listeTypes.trier();
		lDonneesSaisieDossier.listeSousCategorieDossier.add(
			this.JSONReponse.listeSousCategorieDossier,
		);
		lDonneesSaisieDossier.listeSousCategorieDossier.setTri([
			ObjetTri_1.ObjetTri.init("Position"),
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		lDonneesSaisieDossier.listeSousCategorieDossier.trier();
		Cache_1.GCache.dossierVS.setDonnee(
			this.eleveConcerne.getNumero().toString(),
			lDonneesSaisieDossier,
		);
		this.callbackReussite.appel(lDonneesSaisieDossier);
	}
}
exports.ObjetRequetePageDossiers_Fenetre = ObjetRequetePageDossiers_Fenetre;
CollectionRequetes_1.Requetes.inscrire(
	"PageDossiers_Fenetre",
	ObjetRequetePageDossiers_Fenetre,
);
