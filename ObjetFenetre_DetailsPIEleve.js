const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const { ObjetRequeteDetailsPIEleve } = require("ObjetRequeteDetailsPIEleve.js");
const { GHtml } = require("ObjetHtml.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { GUID } = require("GUID.js");
const { GDate } = require("ObjetDate.js");
const { GChaine } = require("ObjetChaine.js");
const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
class ObjetFenetre_DetailsPIEleve extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.idDetailsProjet = GUID.getId();
    this.uniquementMatiereProf = false;
    this.projet = null;
    this.setOptionsFenetre({
      listeBoutons: [GTraductions.getValeur("Fermer")],
      largeur: 500,
      hauteur: 150,
    });
  }
  construireInstances() {
    this.identListe = this.add(ObjetListe, null, this.initialiserListe);
    this.identCombo = this.add(
      ObjetSaisiePN,
      this.evenementCombo,
      this.initialiserCombo,
    );
  }
  evenementCombo(aParams) {
    if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
      this.projet = this.listeProjetsEleve.getElementParNumero(
        aParams.element.getNumero(),
      );
      GHtml.setHtml(
        this.idDetailsProjet,
        this.composeDetailsProjet(this.projet),
        { controleur: this.controleur },
      );
      const lDetails = this.listeDetailsProjets.getElementParNumero(
        this.projet.getNumero(),
      );
      if (!!lDetails) {
        const lListeFiltree = new ObjetListeElements();
        lDetails.details.parcourir((aDonnee) => {
          if (aDonnee.correspondMatiereProfesseur === true) {
            lListeFiltree.addElement(aDonnee);
          }
        });
        this.listeAffichee = lDetails.details;
        this.listeFiltree = lListeFiltree;
        _actualiserListe.call(
          this,
          this.formatDonnees(
            this.uniquementMatiereProf === true
              ? this.listeFiltree
              : this.listeAffichee,
          ),
        );
      }
    }
  }
  composeDetailsProjet(aProjet) {
    const H = [];
    H.push('<div class="field-contain label-up border-bottom p-bottom-l">');
    H.push("<div>");
    H.push(
      GTraductions.getValeur("FicheEleve.misEnPlace", [
        aProjet.libelleCourt || aProjet.getLibelle(),
      ]),
    );
    if (!!aProjet.motifs) {
      H.push(" (", aProjet.motifs, ")");
    }
    if (!!aProjet.dateDebut) {
      H.push("&nbsp;");
      H.push(
        GTraductions.getValeur(
          "FicheEleve.aPartir",
          typeof aProjet.dateDebut === "string"
            ? aProjet.dateDebut
            : GDate.formatDate(aProjet.dateDebut, "%JJ/%MM/%AAAA"),
        ),
      );
    }
    if (!!aProjet.dateFin) {
      H.push("&nbsp;");
      H.push(
        GTraductions.getValeur(
          "FicheEleve.jusquau",
          typeof aProjet.dateFin === "string"
            ? aProjet.dateFin
            : GDate.formatDate(aProjet.dateFin, "%JJ/%MM/%AAAA"),
        ),
      );
    }
    H.push("</div>");
    if (aProjet.commentaire) {
      H.push('<div class="m-top-l">', aProjet.commentaire, "</div>");
    }
    if (aProjet.documents && aProjet.documents.count()) {
      H.push('<div class="m-top-l Texte10 SansMain">');
      aProjet.documents.parcourir((aDocument) => {
        const lURL = GChaine.composerUrlLienExterne({
          documentJoint: aDocument,
          libelleEcran: aDocument.getLibelle(),
          genreRessource: EGenreRessource.DocJointEleve,
          maxWidth: 480,
        });
        H.push('<div class="m-all InlineBlock">', lURL, "</div>");
      });
      H.push("</div>");
    }
    H.push(`</div>`);
    if (aProjet.estCompatibleAmenagements) {
      H.push('<div class="field-contain label-up border-bottom p-bottom-l">');
      H.push(
        '<div class="ie-titre-petit Gras">',
        aProjet.estAvecActions
          ? GTraductions.getValeur("FicheEleve.actions")
          : GTraductions.getValeur("FicheEleve.amenagements"),
        "</div>",
      );
      H.push('<div ie-if="cbMetaMatiere.afficher">');
      H.push(
        '<ie-checkbox class="m-top-l" ie-model="cbMetaMatiere">',
        aProjet.estAvecActions
          ? GTraductions.getValeur("FicheEleve.UniquementActionMesDisciplines")
          : GTraductions.getValeur(
              "FicheEleve.UniquementAmenagementMesDisciplines",
            ),
        "</ie-checkbox>",
      );
      H.push("</div>");
      H.push(
        '<div class="m-top-l full-height full-width" id="',
        this.getInstance(this.identListe).getNom(),
        '"></div>',
      );
      H.push("</div>");
      if (
        [EGenreRessource.Enseignant].includes(
          GEtatUtilisateur.getUtilisateur().getGenre(),
        )
      ) {
        H.push(
          '<div style="display:inline-flex" class="m-top-l"><span class="m-top m-right-l" ie-html="publication.getHtml(',
          !!aProjet.publieFamille,
          ')"></span><div ie-class="publication.getClass(',
          !!aProjet.publieFamille,
          ')"></div></div>',
        );
      }
    }
    if (aProjet.consultableEquipePeda) {
      H.push(
        '<div class="m-top-l">',
        GTraductions.getValeur("FicheEleve.consultable"),
        "</div>",
      );
    }
    return H.join("");
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      cbMetaMatiere: {
        getValue: function () {
          return aInstance.uniquementMatiereProf;
        },
        setValue: function (aValue) {
          if (aValue !== null && aValue !== undefined) {
            aInstance.uniquementMatiereProf = aValue;
            _actualiserListe.call(
              aInstance,
              aInstance.formatDonnees(
                aValue === true
                  ? aInstance.listeFiltree
                  : aInstance.listeAffichee,
              ),
            );
          }
        },
        afficher: function () {
          return (
            !GApplication.estPrimaire &&
            !!aInstance.listeAffichee &&
            aInstance.listeAffichee.count() > 0
          );
        },
      },
      publication: {
        getHtml(aEstPublie) {
          return aEstPublie
            ? GTraductions.getValeur("FicheEleve.verrouPublieFamille")
            : GTraductions.getValeur("FicheEleve.nonVerrouPublieFamille");
        },
        getClass(aEstPublie) {
          return aEstPublie ? "Image_Publie" : "Image_NonPublie";
        },
      },
    });
  }
  initialiserCombo(aObjet) {
    aObjet.setOptionsObjetSaisie({
      longueur: 160,
      libelleHaut: GTraductions.getValeur("FicheEleve.choixProjetAcc"),
    });
  }
  setDonnees(aParams) {
    this.setOptionsFenetre({
      titre: GTraductions.getValeur("FicheEleve.projetAccEleve", [
        aParams.eleve.getLibelle(),
      ]),
    });
    if (!aParams.projet) {
      new ObjetRequeteDetailsPIEleve(
        this,
        this._reponseRequeteAmenagementsEleve,
      ).lancerRequete({ eleve: aParams.eleve, matiere: aParams.matiere });
    } else {
      this.projet = aParams.projet;
      this.afficher();
      this.getInstance(this.identCombo).setVisible(false);
      GHtml.setHtml(
        this.idDetailsProjet,
        this.composeDetailsProjet(this.projet),
        { controleur: this.controleur },
      );
      if (this.projet.details) {
        _actualiserListe.call(this, this.formatDonnees(this.projet.details));
      }
    }
  }
  _reponseRequeteAmenagementsEleve(aParams) {
    this.afficher();
    this.listeProjetsEleve = aParams.listeProjetsEleve;
    this.listeDetailsProjets = aParams.listeDetailsProjets;
    this.projet = this.listeProjetsEleve.get(0);
    if (aParams.listeProjetsEleve.count() > 1) {
      this.getInstance(this.identCombo).initialiser();
      this.getInstance(this.identCombo).setDonnees(this.listeProjetsEleve);
      this.Instances[this.identCombo].setSelection(0);
      this.getInstance(this.identCombo).setVisible(true);
      this.getInstance(this.identCombo).setActif(true);
    } else if (aParams.listeProjetsEleve.count() === 1) {
      this.getInstance(this.identCombo).setVisible(false);
      GHtml.setHtml(
        this.idDetailsProjet,
        this.composeDetailsProjet(this.projet),
        { controleur: this.controleur },
      );
    }
    if (aParams.listeDetailsProjets) {
      const lDetails = aParams.listeDetailsProjets.getElementParNumero(
        this.projet.getNumero(),
      );
      this.listeAffichee = !!lDetails
        ? lDetails.details
        : new ObjetListeElements();
      const lListeFiltree = new ObjetListeElements();
      if (lDetails && lDetails.details) {
        lDetails.details.parcourir((aDonnee) => {
          if (aDonnee.correspondMatiereProfesseur === true) {
            lListeFiltree.addElement(aDonnee);
          }
        });
      }
      this.listeFiltree = lListeFiltree;
      _actualiserListe.call(this, this.formatDonnees(this.listeAffichee));
    }
  }
  formatDonnees(aListe) {
    aListe.setTri([
      ObjetTri.init("numCategorie"),
      ObjetTri.init("numeroAmenagement"),
    ]);
    aListe.trier();
    let lPere;
    aListe.parcourir((aElement) => {
      if (aElement.estPere) {
        lPere = aElement;
        aElement.estUnDeploiement = true;
        aElement.estDeploye = true;
      } else {
        if (aElement.numCategorie === lPere.numCategorie) {
          aElement.pere = lPere;
        }
      }
    });
    return aListe;
  }
  initialiserListe(aInstance) {
    aInstance.setOptionsListe({
      skin: ObjetListe.skin.flatDesign,
      forcerOmbreScrollTop: true,
      forcerOmbreScrollBottom: true,
      hauteurAdapteContenu: true,
      hauteurMaxAdapteContenu: 300,
    });
  }
  composeContenu() {
    const T = [];
    T.push('<div id="' + this.getNomInstance(this.identCombo) + '"> </div>');
    T.push('<div class="m-top-l" id="', this.idDetailsProjet, '"></div>');
    return T.join("");
  }
}
function _actualiserListe(aDonnees) {
  this.getInstance(this.identListe).setDonnees(
    new DonneesListe_Accompagnement(aDonnees),
  );
  this.getInstance(this.identListe).setOptionsListe({
    messageContenuVide: this.projet.estAvecActions
      ? GTraductions.getValeur("FicheEleve.aucuneAction")
      : GTraductions.getValeur("FicheEleve.aucunAmenagement"),
  });
}
class DonneesListe_Accompagnement extends ObjetDonneesListeFlatDesign {
  constructor(...aParams) {
    super(...aParams);
    this.setOptions({
      avecSelection: false,
      avecBoutonActionLigne: false,
      avecEllipsis: false,
      flatDesignMinimal: true,
    });
  }
  getTitreZonePrincipale(aParams) {
    return aParams.article.estPere ? aParams.article.getLibelle() : "";
  }
  getInfosSuppZonePrincipale(aParams) {
    return aParams.article.estPere ? "" : aParams.article.getLibelle();
  }
}
module.exports = { ObjetFenetre_DetailsPIEleve };
