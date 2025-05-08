const { MethodesObjet } = require("MethodesObjet.js");
const { GChaine } = require("ObjetChaine.js");
const { EGenreCommandeMenu } = require("Enumere_CommandeMenu.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GDate } = require("ObjetDate.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
  EGenreRessourcePedagogique,
  EGenreRessourcePedagogiqueUtil,
} = require("Enumere_RessourcePedagogique.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
class DonneesListe_RessourcesPedagogiquesProfesseur extends ObjetDonneesListe {
  constructor(aParam) {
    const lParams = $.extend(
      {
        donnees: null,
        pourPartage: false,
        afficherCumul: false,
        publics: null,
        genreAffiches: null,
        listeMatieresParRessource: null,
        evenementMenuContextuel: null,
        getParamMenuContextuelSelecFile: null,
        callbackSurAjout: null,
      },
      aParam,
    );
    if (!lParams._ressourceAcceptee) {
      lParams._ressourceAcceptee = _ressourceAcceptee;
    }
    super(_construireListe(lParams));
    this.param = lParams;
    const lIndexs = [
      function (D) {
        return D.donnee && D.donnee.ressource
          ? D.donnee.ressource.getLibelle()
          : null;
      },
      function (D) {
        return D.donnee ? D.donnee.getGenre() : null;
      },
      function (D) {
        return D.donnee && D.donnee.proprietaire
          ? D.donnee.proprietaire.getGenre()
          : null;
      },
      function (D) {
        return D.donnee && D.donnee.proprietaire
          ? D.donnee.proprietaire.getNumero()
          : null;
      },
      function (D) {
        return D.donnee && D.donnee.editable ? D.donnee.editable : false;
      },
      function (D) {
        return D.index;
      },
    ];
    if (this.param.pourPartage) {
      lIndexs.push((D) => {
        return D.donnee && D.donnee.matiere
          ? D.donnee.matiere.getNumero()
          : null;
      });
    }
    this.creerIndexUnique(lIndexs);
  }
  avecEvenementEdition(aParams) {
    return (
      this.options.avecEvnt_Edition ||
      (aParams.idColonne ===
        DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.themes &&
        !!aParams &&
        !!aParams.article &&
        !!aParams.article.donnee &&
        !!aParams.article.donnee.estThemable) ||
      (!!aParams &&
        !!aParams.article &&
        !!aParams.article.donnee &&
        (!!aParams.article.donnee.editable ||
          !!aParams.article.donnee.estModifiableParAutrui) &&
        aParams.article.donnee.getGenre() === EGenreRessourcePedagogique.site &&
        [
          DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle,
          DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.commentaire,
        ].includes(aParams.idColonne))
    );
  }
  avecEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle:
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.commentaire:
        return (
          !!aParams.article.donnee.editable ||
          !!aParams.article.donnee.estModifiableParAutrui
        );
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.themes:
        return !!aParams.article.donnee.estThemable;
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.modif:
        return !!aParams.article.donnee.editable;
    }
    return false;
  }
  avecTrimSurEdition() {
    return true;
  }
  avecSelection(aParams) {
    return (
      super.avecSelection(aParams) &&
      !!aParams.article &&
      !aParams.article.estUnDeploiement
    );
  }
  avecMultiSelection() {
    return true;
  }
  avecDeploiement() {
    return true;
  }
  avecSuppression(aParams) {
    return (
      !aParams.article.estUnDeploiement &&
      (!!aParams.article.donnee.editable ||
        aParams.article.donnee.estSupprimableCdT)
    );
  }
  avecEvenementSelection(aParams) {
    if (
      aParams.idColonne ===
      DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle
    ) {
      return (
        aParams.article.donnee.getGenre() ===
          EGenreRessourcePedagogique.kiosque ||
        aParams.article.donnee.getGenre() ===
          EGenreRessourcePedagogique.travailRendu
      );
    }
    return false;
  }
  avecEvenementCreation() {
    return true;
  }
  avecEvenementApresCreation() {
    return true;
  }
  avecEvenementApresSuppression() {
    return true;
  }
  autoriserChaineVideSurEdition(aParams) {
    return (
      aParams.idColonne ===
      DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.commentaire
    );
  }
  getCouleurCellule(aParams) {
    if (aParams.article.estUnDeploiement) {
      return $.extend(MethodesObjet.dupliquer(GCouleur.liste.editable), {
        fond: aParams.article.pere
          ? GCouleur.themeCouleur.claire
          : GCouleur.themeCouleur.moyen1,
        texte: aParams.article.pere ? "#000000" : "#ffffff",
      });
    }
    return this.avecEdition(aParams)
      ? ObjetDonneesListe.ECouleurCellule.Blanc
      : ObjetDonneesListe.ECouleurCellule.Gris;
  }
  fusionCelluleAvecColonnePrecedente(aParams) {
    return aParams.article.estUnDeploiement;
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.type:
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle:
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.commentaire:
        return ObjetDonneesListe.ETypeCellule.Html;
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.modif:
        return ObjetDonneesListe.ETypeCellule.Coche;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
  getClass(aParams) {
    const lTab = [];
    if (
      aParams.article &&
      !aParams.article.estUnDeploiement &&
      _getIntersectionListePublics(this.param, aParams.article.donnee).count() >
        1
    ) {
      lTab.push("Gras");
    }
    return lTab.join(" ");
  }
  getHintForce(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.date:
        return aParams.article.donnee.dateHint
          ? aParams.article.donnee.dateHint
          : "";
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.modif:
        return aParams.article.donnee
          ? aParams.article.donnee.estModifiableParAutrui
            ? GTraductions.getValeur("RessourcePedagogique.hint.modifiable")
            : GTraductions.getValeur("RessourcePedagogique.hint.nonModifiable")
          : "";
    }
    return "";
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.type:
        if (aParams.article.estUnDeploiement) {
          const lImageDeploiement = aParams.article.estDeploye
            ? "Image_DeploiementListe_Deploye"
            : "Image_DeploiementListe_NonDeploye";
          return (
            (aParams.article.pere ? "&nbsp;&nbsp;" : "") +
            '<div class="InlineBlock ' +
            lImageDeploiement +
            '"></div>&nbsp;' +
            '<div class="InlineBlock Gras">' +
            aParams.article.getLibelle() +
            " " +
            "(" +
            aParams.article.nbrRessources +
            ")" +
            "</div>"
          );
        }
        return (
          '<i class="' +
          EGenreRessourcePedagogiqueUtil.getIcone(
            aParams.article.donnee.getGenre(),
          ) +
          '" style="font-size:1.4rem;"></i>'
        );
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle:
        if (aParams && aParams.surEdition) {
          if (
            aParams.article.donnee.getGenre() ===
            EGenreRessourcePedagogique.documentJoint
          ) {
            return GChaine.extraireNomFichier(
              aParams.article.donnee.ressource.getLibelle(),
            );
          }
          return aParams.article.donnee.ressource.getLibelle();
        }
        switch (aParams.article.donnee.getGenre()) {
          case EGenreRessourcePedagogique.QCM:
            return aParams.article.donnee.ressource.getLibelle();
          case EGenreRessourcePedagogique.travailRendu:
            return aParams.article.donnee.ressource.getLibelle();
          default: {
            if (
              (!!aParams.article.donnee.fichier &&
                aParams.article.donnee.fichier.getEtat() ===
                  EGenreEtat.Creation) ||
              (!!aParams.article.donnee.ressource &&
                aParams.article.donnee.ressource.getEtat() ===
                  EGenreEtat.Creation)
            ) {
              return (
                "<div>" +
                (!!aParams.article.donnee.ressource.getLibelle()
                  ? aParams.article.donnee.ressource.getLibelle()
                  : aParams.article.donnee.url) +
                "</div>"
              );
            }
            const lUrlBrute = EGenreRessourcePedagogiqueUtil.composerURL(
              aParams.article.donnee.getGenre(),
              aParams.article.donnee.ressource,
              !!aParams.article.donnee.ressource.getLibelle()
                ? aParams.article.donnee.ressource.getLibelle()
                : aParams.article.donnee.url,
              true,
            );
            return (
              '<a href="' +
              lUrlBrute +
              '" target="_blank" onclick="event.stopPropagation();">' +
              (!!aParams.article.donnee.ressource.getLibelle()
                ? aParams.article.donnee.ressource.getLibelle()
                : aParams.article.donnee.url) +
              "</a>"
            );
          }
        }
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.themes:
        return aParams.article.donnee.ListeThemes &&
          aParams.article.donnee.ListeThemes.count()
          ? aParams.article.donnee.ListeThemes.getTableauLibelles().join(", ")
          : "";
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.commentaire: {
        let lCommentaire = aParams.article.donnee.commentaire;
        if (!aParams || !aParams.surEdition) {
          lCommentaire = lCommentaire
            .replace(/\r\n/gi, " ")
            .replace(/\n/gi, " ");
        }
        return `<div class="tiny-view">${lCommentaire}</div>`;
      }
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.public:
        return _getIntersectionListePublics(this.param, aParams.article.donnee)
          .getTableauLibelles(null, true, true)
          .join(", ");
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.date:
        return aParams.article.donnee.date
          ? GDate.formatDate(aParams.article.donnee.date, "%JJ/%MM/%AAAA")
          : "";
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.proprietaire:
        return aParams.article.donnee.proprietaire
          ? aParams.article.donnee.proprietaire.getLibelle()
          : "";
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.modif:
        return aParams.article.donnee.estModifiableParAutrui;
      default:
    }
    return "";
  }
  avecContenuTronque(aParams) {
    return (
      aParams.idColonne ===
      DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.commentaire
    );
  }
  static creerElement(aDonnees) {
    const lDonnees = $.extend(
      {
        libelle: "",
        fichier: null,
        matiere: null,
        genreCreation: null,
        listePublics: null,
      },
      aDonnees,
    );
    const lResult = new ObjetElement();
    lResult.setEtat(EGenreEtat.Modification);
    lResult.ressource = new ObjetElement({
      Genre: EGenreRessource.DocumentCasier,
    });
    lResult.ressource.setEtat(EGenreEtat.Creation);
    lResult.ressource.setLibelle(lDonnees.libelle);
    if (lDonnees.fichier) {
      lResult.fichier = lDonnees.fichier;
    }
    if (lDonnees.url) {
      lResult.url = lDonnees.url;
    }
    lResult.Genre = lDonnees.genreCreation;
    lResult.matiere = lDonnees.matiere;
    lResult.listeNiveaux = lDonnees.listeNiveaux;
    lResult.listePublics = new ObjetListeElements();
    lDonnees.listePublics.parcourir((aElement) => {
      const lElement = new ObjetElement(
        aElement.getLibelle(),
        aElement.getNumero(),
        aElement.getGenre(),
      );
      lElement.setEtat(EGenreEtat.Creation);
      lResult.listePublics.addElement(lElement);
    });
    lResult.ListeThemes = new ObjetListeElements();
    lResult.estThemable = true;
    lResult.libelleCBTheme = GTraductions.getValeur(
      "Theme.libelleCB.ressource",
    );
    lResult.commentaire = lDonnees.commentaire || "";
    lResult.date = GDate.getDateHeureCourante();
    lResult.editable = true;
    lResult.estModifiableParAutrui = false;
    lResult.proprietaire = MethodesObjet.dupliquer(
      GEtatUtilisateur.getUtilisateur(),
    );
    return lResult;
  }
  getMessageDoublon() {
    return GTraductions.getValeur("RessourcePedagogique.CeNomExisteDeja");
  }
  getMessageSuppressionConfirmation(aArticle) {
    const lMsg = [];
    if (aArticle.donnee && aArticle.donnee.estSupprimableCdT) {
      lMsg.push(
        GTraductions.getValeur(
          "RessourcePedagogique.ConfirmSuppr_RessourcesCDT",
        ),
        "<br>",
      );
    }
    lMsg.push(
      GTraductions.getValeur("RessourcePedagogique.ConfirmSuppr_Ressources"),
    );
    return lMsg.join("");
  }
  surEdition(aParams, V) {
    aParams.article.donnee.setEtat(EGenreEtat.Modification);
    switch (aParams.idColonne) {
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle:
        if (
          aParams.article.donnee.getGenre() ===
          EGenreRessourcePedagogique.documentJoint
        ) {
          const lExtension = GChaine.extraireExtensionFichier(
            aParams.article.donnee.ressource.getLibelle(),
          );
          aParams.article.donnee.ressource.setLibelle(
            V + (lExtension ? "." + lExtension : ""),
          );
        } else {
          aParams.article.donnee.ressource.setLibelle(V);
        }
        break;
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.commentaire:
        aParams.article.donnee.commentaire = V;
        break;
      case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.modif:
        aParams.article.donnee.estModifiableParAutrui =
          !aParams.article.donnee.estModifiableParAutrui;
        break;
      default:
        break;
    }
  }
  _surSuppression(J, aListeSuppressions) {
    aListeSuppressions.parcourir(function (aArticle) {
      this.surSuppression(aArticle);
      if (aArticle.donnee.estSupprimableCdT) {
        aArticle.donnee.setEtat(EGenreEtat.Suppression);
        return;
      }
      aArticle.setEtat(EGenreEtat.Modification);
      aArticle.donnee.setEtat(EGenreEtat.Modification);
      if (this.param.pourPartage) {
        aArticle.donnee.listeNiveaux.parcourir((D) => {
          if (aArticle.niveau.getNumero() === D.getNumero()) {
            D.setEtat(EGenreEtat.Suppression);
          }
        });
      } else {
        const lPublicsSelectionne = this.param.publics;
        aArticle.donnee.listePublics.parcourir((D) => {
          const lElement = lPublicsSelectionne.getElementParElement(D);
          if (lElement) {
            D.setEtat(EGenreEtat.Suppression);
          }
        });
      }
    }, this);
    this.trier();
    return -1;
  }
  getVisible(D) {
    return D.visible;
  }
  getTri(aColonneDeTri, aGenreTri) {
    const lTris = [
      ObjetTri.init((D) => {
        return !D.visible;
      }),
      ObjetTri.initRecursif("pere", [
        ObjetTri.init("Libelle"),
        ObjetTri.init("Numero"),
      ]),
    ];
    const lFuncTriGenre = function (D) {
        return D.pere && D.donnee ? D.donnee.getGenre() : 0;
      },
      lFuncTriLibelle = function (D) {
        return D.donnee && D.donnee.ressource
          ? D.donnee.ressource.getLibelle()
          : "";
      };
    if (MethodesObjet.isNumber(aColonneDeTri)) {
      switch (this.getId(aColonneDeTri)) {
        case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.type:
          lTris.push(ObjetTri.init(lFuncTriGenre, aGenreTri));
          break;
        case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle:
          lTris.push(ObjetTri.init(lFuncTriLibelle, aGenreTri));
          break;
        case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.themes:
        case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.commentaire:
        case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes
          .proprietaire:
        case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.public:
          lTris.push(
            ObjetTri.init(
              this.getValeurPourTri.bind(this, aColonneDeTri),
              aGenreTri,
            ),
          );
          break;
        case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.date:
          lTris.push(
            ObjetTri.init((D) => {
              return D.donnee ? D.donnee.date : 0;
            }, aGenreTri),
          );
          break;
        case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.modif:
          lTris.push(
            ObjetTri.init((D) => {
              return D.donnee ? !D.donnee.estModifiableParAutrui : false;
            }, aGenreTri),
          );
          break;
        case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.coche:
          lTris.push(
            ObjetTri.init((D) => {
              return D.donnee ? !D.donnee.selectionne : false;
            }, aGenreTri),
          );
          break;
        default:
      }
    }
    lTris.push(
      ObjetTri.init(lFuncTriGenre),
      ObjetTri.init(lFuncTriLibelle),
      ObjetTri.init((D) => {
        return D.donnees ? !!D.donnee.editable : false;
      }),
    );
    return lTris;
  }
  avecMenuContextuel() {
    return true;
  }
  initialisationObjetContextuel(aParametres) {
    if (!aParametres.menuContextuel) {
      return;
    }
    if (aParametres.surFondListe) {
      return;
    }
    if (aParametres.ligne > -1) {
      const lNbSelections = aParametres.listeSelection.count();
      aParametres.menuContextuel.addCommande(
        DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu.consulter,
        GTraductions.getValeur("RessourcePedagogique.Consulter"),
        lNbSelections === 1 &&
          aParametres.article.donnee &&
          aParametres.article.donnee.getGenre() !==
            EGenreRessourcePedagogique.QCM &&
          (!aParametres.article.donnee.fichier ||
            aParametres.article.donnee.fichier.getEtat() !==
              EGenreEtat.Creation),
      );
      aParametres.menuContextuel.addCommande(
        EGenreCommandeMenu.Edition,
        GTraductions.getValeur("liste.modifier"),
        lNbSelections === 1 &&
          this.avecEdition(aParametres) &&
          !aParametres.nonEditable,
      );
      const lAvecRemplacement =
        lNbSelections === 1 &&
        aParametres.article &&
        aParametres.article.donnee &&
        aParametres.article.donnee.getGenre() ===
          EGenreRessourcePedagogique.documentJoint &&
        this.avecEdition(aParametres) &&
        !aParametres.nonEditable;
      aParametres.menuContextuel.addSelecFile(
        GTraductions.getValeur("RessourcePedagogique.RemplacerDocExistant"),
        this.param.getParamMenuContextuelSelecFile({
          element: aParametres.article.donnee,
          type: DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu
            .remplacerDoc,
        }),
        lAvecRemplacement,
      );
      if (this.param.pourPartage) {
        const lListeEditables = aParametres.listeSelection.getListeElements(
          (D) => {
            return !!D.donnee.editable;
          },
        );
        if (lListeEditables.count() > 0) {
          aParametres.menuContextuel.addSousMenu(
            GTraductions.getValeur("RessourcePedagogique.AutoriserModif"),
            (aInstanceSousMenu) => {
              aInstanceSousMenu.addCommande(
                DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu
                  .deverrouiller,
                GTraductions.getValeur("principal.oui"),
                aParametres.article &&
                  aParametres.article.donnee &&
                  !aParametres.article.donnee.estModifiableParAutrui,
                { listeEditables: lListeEditables },
              );
              aInstanceSousMenu.addCommande(
                DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu
                  .verrouiller,
                GTraductions.getValeur("principal.non"),
                aParametres.article &&
                  aParametres.article.donnee &&
                  !!aParametres.article.donnee.estModifiableParAutrui,
                { listeEditables: lListeEditables },
              );
            },
          );
        }
      }
      aParametres.menuContextuel.addCommande(
        EGenreCommandeMenu.Suppression,
        GTraductions.getValeur("liste.supprimer"),
        this._avecSuppression(aParametres) &&
          ((aParametres.article.donnee &&
            aParametres.article.donnee.estSupprimableCdT) ||
            !aParametres.nonEditable),
      );
      if (this.param.callbackSurAjout) {
        aParametres.menuContextuel.add(
          GTraductions.getValeur("CahierDeTexte.Ajouter"),
          _avecCreation.call(this),
          () => {
            this.param.callbackSurAjout();
          },
        );
      }
      aParametres.menuContextuel.setDonnees(aParametres.id);
    }
  }
  evenementMenuContextuel(aParametres) {
    if (
      this.param.evenementMenuContextuel(
        aParametres.ligneMenu,
        null,
        aParametres.article,
      )
    ) {
      aParametres.avecActualisation = false;
    }
  }
}
DonneesListe_RessourcesPedagogiquesProfesseur.colonnes = {
  type: "type",
  libelle: "libelle",
  themes: "themes",
  commentaire: "commentaire",
  public: "public",
  date: "date",
  proprietaire: "proprietaire",
  modif: "modif",
  coche: "coche",
};
DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu = {
  ajoutDoc: 1,
  ajoutAutreClasse: 2,
  consulter: 3,
  remplacerDoc: 4,
  ajoutSauvegarde: 5,
  verrouiller: 6,
  deverrouiller: 7,
  ajoutSite: 8,
};
function _construireListe(aParams) {
  const lHashMatiere = {};
  const lHashNiveau = {};
  let lMatiere = null;
  const lListe = new ObjetListeElements();
  aParams.donnees.parcourir((aElement) => {
    aElement.visible = false;
    let LLigne = new ObjetElement();
    LLigne.donnee = aElement;
    LLigne.visible = false;
    LLigne.index = 0;
    lListe.addElement(LLigne);
    if (
      aParams.genreAffiches &&
      !aParams.genreAffiches.contains(aElement.getGenre())
    ) {
      return;
    }
    if (!aParams._ressourceAcceptee(aParams, aElement)) {
      return;
    }
    LLigne.deploye = true;
    if (aElement.listeNiveaux) {
      const lListeNiveaux = aElement.listeNiveaux.getListeElements((D) => {
        return D.existe();
      });
      LLigne.visible = lListeNiveaux.count() > 0;
      lListeNiveaux.parcourir((aNiveau, aIndex) => {
        let lNiveau = lHashNiveau[aNiveau.getNumero()];
        if (!lNiveau) {
          lNiveau = lHashNiveau[aNiveau.getNumero()] =
            MethodesObjet.dupliquer(aNiveau);
          lNiveau.nbrRessources = 1;
          lNiveau.estUnDeploiement = true;
          lNiveau.estDeploye = true;
          lNiveau.visible = true;
        } else {
          lNiveau.nbrRessources += 1;
        }
        let lLigneNiveau;
        if (aIndex > 0) {
          lLigneNiveau = new ObjetElement();
          lLigneNiveau.donnee = aElement;
          lLigneNiveau.index = aIndex;
          lLigneNiveau.visible = true;
          lListe.addElement(lLigneNiveau);
        } else {
          lLigneNiveau = LLigne;
        }
        if (!aParams.publics || aParams.publics.count() > 1) {
          lMatiere = _getCumulMatiere(aElement.matiere, lHashMatiere, lNiveau);
          lLigneNiveau.pere = lMatiere;
        } else {
          lLigneNiveau.pere = lNiveau;
        }
        lLigneNiveau.niveau = lNiveau;
      });
    } else {
      if (aElement.existe()) {
        LLigne.visible = true;
        const lMatiereElement = aElement.matiere
          ? aElement.matiere
          : aElement.listePublics.get(0);
        lMatiere = _getCumulMatiere(lMatiereElement, lHashMatiere);
        LLigne.pere = lMatiere;
      }
    }
  });
  if (aParams.afficherCumul) {
    for (let i in lHashMatiere) {
      lListe.addElement(lHashMatiere[i]);
    }
    for (let i in lHashNiveau) {
      lListe.addElement(lHashNiveau[i]);
    }
  }
  return lListe;
}
function _ressourceAcceptee(aParametres, aRessource) {
  if (
    aParametres.publics &&
    _getIntersectionListePublics(aParametres, aRessource).count() === 0
  ) {
    return false;
  }
  return true;
}
function _getIntersectionListePublics(aParametres, aRessource) {
  if (!aRessource) {
    return new ObjetListeElements();
  }
  const lListe = new ObjetListeElements(),
    lListeMatieresParRessource = aParametres.listeMatieresParRessource;
  if (aParametres.pourPartage) {
    if (aParametres.publics.getElementParElement(aRessource.matiere)) {
      lListe.addElement(aRessource.matiere);
    }
  } else {
    aRessource.listePublics.parcourir((aPublic) => {
      if (!aPublic.existe()) {
        return;
      }
      if (aParametres.publics.getElementParElement(aPublic)) {
        lListe.addElement(aPublic);
      } else if (aPublic.getGenre() === EGenreRessource.Groupe) {
        const lModeleGroupe =
          lListeMatieresParRessource.getElementParElement(aPublic);
        if (lModeleGroupe && lModeleGroupe.composantes) {
          lModeleGroupe.composantes.parcourir((aClasse) => {
            if (
              aParametres.publics.getElementParElement(aClasse) &&
              !lListe.getElementParElement(aPublic)
            ) {
              lListe.addElement(aPublic);
              return false;
            }
          });
        }
      }
    });
  }
  return lListe;
}
function _avecCreation() {
  return (
    (!this.param.pourPartage || this.param.publics.count() === 1) &&
    GApplication.droits.get(TypeDroits.cahierDeTexte.avecSaisiePieceJointe)
  );
}
function _getCumulMatiere(aMatiere, aHash, aNiveau) {
  const lCle =
    aMatiere.getNumero() + (aNiveau ? "-" + aNiveau.getNumero() : "");
  let lMatiere = aHash[lCle];
  if (!lMatiere) {
    lMatiere = aHash[lCle] = MethodesObjet.dupliquer(aMatiere);
    lMatiere.nbrRessources = 1;
    lMatiere.estUnDeploiement = true;
    lMatiere.estDeploye = true;
    lMatiere.visible = true;
    if (aNiveau) {
      lMatiere.pere = aNiveau;
    }
  } else {
    lMatiere.nbrRessources += 1;
  }
  return lMatiere;
}
module.exports = { DonneesListe_RessourcesPedagogiquesProfesseur };
