const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { GStyle } = require("ObjetStyle.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetTri } = require("ObjetTri.js");
const { GCache } = require("Cache.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { GTraductions } = require("ObjetTraduction.js");
class ObjetRequetePageDossiers_Fenetre extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
    this.cache = GCache.dossierVS;
    this.eleveConcerne = null;
  }
  lancerRequete(aEleve) {
    this.eleveConcerne = aEleve;
    if (this.cache.existeDonnee(aEleve.getNumero())) {
      const lDonnees = this.cache.getDonnee(aEleve.getNumero());
      this.callbackReussite.appel(lDonnees);
    } else {
      this.JSON = { eleve: aEleve };
      return this.appelAsynchrone();
    }
  }
  actionApresRequete() {
    const lDonneesSaisieDossier = {};
    lDonneesSaisieDossier.listeCategories = new ObjetListeElements();
    lDonneesSaisieDossier.listeCategories.add(this.JSONReponse.listeCategories);
    lDonneesSaisieDossier.listeCategories.parcourir((aCategorie) => {
      const H = [];
      H.push(
        "<div>",
        '<div class="InlineBlock AlignementMilieuVertical" style="width: 8px; height: 10px;',
        GStyle.composeCouleurBordure("darkgray"),
        GStyle.composeCouleurFond(aCategorie.couleur),
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
    lDonneesSaisieDossier.listeCategories.setTri([ObjetTri.init("Genre")]);
    lDonneesSaisieDossier.listeCategories.trier();
    lDonneesSaisieDossier.listeRespAdmin = new ObjetListeElements();
    lDonneesSaisieDossier.listeRespAdmin.add(this.JSONReponse.listeRespAdmin);
    lDonneesSaisieDossier.listeRespAdmin.insererElement(
      new ObjetElement(
        GTraductions.getValeur("Aucune"),
        0,
        EGenreRessource.Aucune,
      ),
      0,
    );
    let lCumulPersonnel;
    if (
      lDonneesSaisieDossier.listeRespAdmin.getNbrElementsExistes(
        EGenreRessource.Personnel,
      ) > 0
    ) {
      lCumulPersonnel = new ObjetElement(
        GTraductions.getValeur("Personnels"),
        0,
        EGenreRessource.Personnel,
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
        EGenreRessource.Enseignant,
      ) > 0
    ) {
      lCumulProfesseur = new ObjetElement(
        GTraductions.getValeur("Professeurs"),
        0,
        EGenreRessource.Enseignant,
      );
      lCumulProfesseur.estCumul = true;
      lCumulProfesseur.AvecSelection = false;
      lCumulProfesseur.Position = 0;
      lCumulProfesseur.ClassAffichage = "Gras";
      lDonneesSaisieDossier.listeRespAdmin.add(lCumulProfesseur);
    }
    lDonneesSaisieDossier.listeRespAdmin.parcourir((aElement) => {
      if (
        [EGenreRessource.Personnel, EGenreRessource.Enseignant].includes(
          aElement.getGenre(),
        ) &&
        !aElement.estCumul
      ) {
        aElement.ClassAffichage = "p-left";
        if (aElement.getGenre() === EGenreRessource.Personnel) {
          aElement.pere = lCumulPersonnel;
        } else {
          aElement.pere = lCumulProfesseur;
        }
      }
    });
    lDonneesSaisieDossier.listeRespAdmin.setTri([
      ObjetTri.init((D) => {
        switch (D.getGenre()) {
          case EGenreRessource.Aucune:
            return 0;
          case EGenreRessource.Personnel:
            return 1;
          case EGenreRessource.Enseignant:
            return 2;
          default:
            return 3;
        }
      }),
      ObjetTri.init("Position"),
    ]);
    lDonneesSaisieDossier.listeRespAdmin.trier();
    lDonneesSaisieDossier.listeLieux = new ObjetListeElements();
    lDonneesSaisieDossier.listeLieux.add(this.JSONReponse.listeLieux);
    lDonneesSaisieDossier.listeLieux.insererElement(new ObjetElement("", 0), 0);
    lDonneesSaisieDossier.listeActeurs = new ObjetListeElements();
    lDonneesSaisieDossier.listeActeurs.add(this.JSONReponse.listeActeurs);
    lDonneesSaisieDossier.listeActeurs.insererElement(
      new ObjetElement("", 0),
      0,
    );
    lDonneesSaisieDossier.listeInterlocuteurs = new ObjetListeElements();
    lDonneesSaisieDossier.listeInterlocuteurs.add(
      this.JSONReponse.listeInterlocuteurs,
    );
    lDonneesSaisieDossier.listeResponsables = new ObjetListeElements();
    lDonneesSaisieDossier.listeResponsables.add(
      this.JSONReponse.listeResponsables,
    );
    lDonneesSaisieDossier.listeEquipePedagogique = new ObjetListeElements();
    lDonneesSaisieDossier.listeEquipePedagogique.add(
      this.JSONReponse.listeEquipePedagogique,
    );
    lDonneesSaisieDossier.listeTypes = new ObjetListeElements();
    lDonneesSaisieDossier.listeTypes.add(this.JSONReponse.listeTypes);
    lDonneesSaisieDossier.listeTypes.trier();
    lDonneesSaisieDossier.listeSousCategorieDossier = new ObjetListeElements();
    lDonneesSaisieDossier.listeSousCategorieDossier.add(
      this.JSONReponse.listeSousCategorieDossier,
    );
    lDonneesSaisieDossier.listeSousCategorieDossier.setTri([
      ObjetTri.init("Position"),
      ObjetTri.init("Libelle"),
    ]);
    lDonneesSaisieDossier.listeSousCategorieDossier.trier();
    this.cache.setDonnee(this.eleveConcerne, lDonneesSaisieDossier);
    this.callbackReussite.appel(lDonneesSaisieDossier);
  }
}
Requetes.inscrire("PageDossiers_Fenetre", ObjetRequetePageDossiers_Fenetre);
module.exports = { ObjetRequetePageDossiers_Fenetre };
