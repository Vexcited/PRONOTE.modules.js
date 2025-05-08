const { EGenreEtat } = require("Enumere_Etat.js");
const { GDate } = require("ObjetDate.js");
const { Identite } = require("ObjetIdentite.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const {
  ObjetRequeteSaisieTAFFaitEleve,
} = require("ObjetRequeteSaisieTAFFaitEleve.js");
const {
  ObjetUtilitaireCahierDeTexte,
} = require("ObjetUtilitaireCahierDeTexte.js");
const { UtilitaireTAFEleves } = require("UtilitaireTAFEleves.js");
const { UtilitaireContenuDeCours } = require("UtilitaireContenuDeCours.js");
const { EGenreBtnActionBlocTAF } = require("GestionnaireBlocTAF.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const {
  EGenreTypeRessourcesPedagogiques,
} = require("Enumere_TypeRessourcesPedagogiques.js");
const {
  ObjetFenetre_ForumVisuPosts,
} = require("ObjetFenetre_ForumVisuPosts.js");
const { ObjetGalerieCarrousel } = require("ObjetGalerieCarrousel.js");
const { ObjetElement } = require("ObjetElement.js");
const { TypeGenreMiniature } = require("TypeGenreMiniature.js");
class PageCahierDeTexteEleve extends Identite {
  constructor(...aParams) {
    super(...aParams);
    this.cycleCourant = null;
    this.utilitaireCDT = new ObjetUtilitaireCahierDeTexte(
      this.Nom + ".utilitaireCDT",
      this,
      this.surUtilitaireCDT,
    );
    this.utilitaireTAFEleves = new UtilitaireTAFEleves();
    this.utilitaireContenuDeCours = new UtilitaireContenuDeCours();
    this.idTaf = this.Nom + "_Taf_";
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      appelQCM: {
        event: function (aNumero) {
          aInstance.appelQCM(aNumero);
        },
      },
      appelQCMRessource: {
        event: function (aNumero) {
          aInstance.appelQCMRessource(aNumero);
        },
      },
      appelForumRessource: {
        event(aNumero) {
          ObjetFenetre_ForumVisuPosts.afficher(aInstance, aNumero);
        },
      },
      evenementTafFait: {
        getValue: function (aNumeroTaf) {
          const lElement =
            aInstance.ListeTravailAFaire.getElementParNumero(aNumeroTaf);
          return lElement.TAFFait;
        },
        setValue: function (aNumero) {
          aInstance.evenementTafFait(aNumero);
        },
      },
      appelCours: {
        event: function (aNumero) {
          aInstance.appelCours(aNumero);
        },
      },
      appelTAF: {
        event: function (aNumero) {
          aInstance.appelTAF(aNumero);
        },
      },
      appelDetailTAF: {
        event: function (aNumero) {
          aInstance.appelDetailTAF(aNumero);
        },
      },
      nodeDeploiement: function () {
        $(this.node).on({
          click: function () {
            const lIcone = $(this).children().first().children().first();
            lIcone.toggleClass("icon_chevron_right");
            lIcone.toggleClass("icon_chevron_down");
            $(this).siblings().first().toggle(200);
            aInstance.setInfoRessourceDeploye($(this));
          },
        });
      },
      getCarrouselTAF(aNumeroTAF) {
        return {
          class: ObjetGalerieCarrousel,
          pere: aInstance,
          init: (aCarrousel) => {
            aCarrousel.setOptions({
              dimensionPhoto: 250,
              nbMaxDiaposEnZoneVisible: 10,
              justifieAGauche: true,
              sansBlocLibelle: true,
              altImage: GTraductions.getValeur("CahierDeTexte.altImage.TAF"),
            });
            aCarrousel.initialiser();
          },
          start: (aCarrousel) => {
            let lTAF =
              aInstance.ListeTravailAFaire.getElementParNumero(aNumeroTAF);
            const lListeDiapos = new ObjetListeElements();
            if (lTAF && lTAF.ListePieceJointe) {
              lTAF.ListePieceJointe.parcourir((aPJ) => {
                if (aPJ.avecMiniaturePossible) {
                  let lDiapo = new ObjetElement();
                  lDiapo.setLibelle(aPJ.getLibelle());
                  aPJ.miniature = TypeGenreMiniature.GM_500;
                  lDiapo.documentCasier = aPJ;
                  lListeDiapos.add(lDiapo);
                }
              });
            }
            aCarrousel.setDonnees({ listeDiapos: lListeDiapos });
          },
        };
      },
      getCarrouselCDC(aNumeroContenu) {
        return {
          class: ObjetGalerieCarrousel,
          pere: aInstance,
          init: (aCarrousel) => {
            aCarrousel.setOptions({
              dimensionPhoto: 250,
              nbMaxDiaposEnZoneVisible: 10,
              justifieAGauche: true,
              sansBlocLibelle: true,
              altImage: GTraductions.getValeur("CahierDeTexte.altImage.CDC"),
            });
            aCarrousel.initialiser();
          },
          start: (aCarrousel) => {
            let lContenu;
            aInstance.ListeCahierDeTextes.parcourir((aElement) => {
              if (!!aElement.listeContenus) {
                aElement.listeContenus.parcourir((aCDC) => {
                  if (aCDC.getNumero() === aNumeroContenu) {
                    lContenu = aCDC;
                  }
                });
              }
            });
            const lListeDiapos = new ObjetListeElements();
            if (lContenu && lContenu.ListePieceJointe) {
              lContenu.ListePieceJointe.parcourir((aPJ) => {
                if (aPJ.avecMiniaturePossible) {
                  let lDiapo = new ObjetElement();
                  lDiapo.setLibelle(aPJ.getLibelle());
                  aPJ.miniature = TypeGenreMiniature.GM_500;
                  lDiapo.documentCasier = aPJ;
                  lListeDiapos.add(lDiapo);
                }
              });
            }
            aCarrousel.setDonnees({ listeDiapos: lListeDiapos });
          },
        };
      },
    });
  }
  setDonnees(aParams) {
    this.genreOnglet = GEtatUtilisateur.getGenreOnglet();
    this.avecFiltrage = aParams.avecFiltrage;
    if (this.genreOnglet === EGenreOnglet.CDT_TAF) {
      this.ListeTravailAFaire = aParams.liste;
      this.actualiserTravailAFaire(this.ListeTravailAFaire);
    } else {
      this.ListeCahierDeTextes = aParams.liste;
      this.actualiserContenuDeCours(this.ListeCahierDeTextes);
    }
    this.afficher(null);
    return this.avecDonnees;
  }
  actualiserContenuDeCours() {
    if (this.ListeCahierDeTextes) {
      this.ListeCahierDeTextes.setTri([
        ObjetTri.init("Date", EGenreTriElement.Decroissant),
      ]).trier();
    }
  }
  actualiserTravailAFaire(aListeTravailAFaire) {
    if (aListeTravailAFaire) {
      aListeTravailAFaire
        .setTri([
          ObjetTri.init("PourLe"),
          ObjetTri.init("Matiere.Libelle"),
          ObjetTri.init("DonneLe"),
          ObjetTri.init("Genre"),
        ])
        .trier();
    }
  }
  construireAffichage() {
    return this.genreOnglet === EGenreOnglet.CDT_TAF
      ? this.composePageTravailAFaire(this.ListeTravailAFaire)
      : this.composePageContenu(this.ListeCahierDeTextes);
  }
  composePageContenu(aListeCahierDeTextes) {
    if (!aListeCahierDeTextes) {
      return "";
    }
    const lHtml = [];
    lHtml.push('<div class="AvecSelectionTexte">');
    if (
      !!aListeCahierDeTextes.count() &&
      !!aListeCahierDeTextes
        .getListeElements((aEle) => {
          return (
            (aEle.listeContenus && aEle.listeContenus.count() > 0) ||
            (aEle.listeElementsProgrammeCDT &&
              aEle.listeElementsProgrammeCDT.count() > 0)
          );
        })
        .count()
    ) {
      lHtml.push(
        this.utilitaireContenuDeCours.composePageContenu(
          aListeCahierDeTextes,
          this.avecFiltrage,
        ),
      );
    } else {
      lHtml.push(
        '<div class="message-vide card card-nodata"><div class="card-content">' +
          this.composeMessage(
            GTraductions.getValeur("CahierDeTexte.AucunContenu"),
          ) +
          '</div><div class="Image_No_Data" aria-hidden="true"></div></div>',
      );
    }
    lHtml.push("</div>");
    return lHtml.join("");
  }
  composePageTravailAFaire(aListeTravailAFaire) {
    if (!aListeTravailAFaire) {
      return "";
    }
    const lHtml = [];
    lHtml.push('<div class="AvecSelectionTexte">');
    GEtatUtilisateur.setNavigationDate(GDate.getDateCourante());
    if (!!aListeTravailAFaire.count()) {
      lHtml.push(
        this.utilitaireTAFEleves.composePageTravailAFaire(
          aListeTravailAFaire,
          this.utilitaireCDT,
          this.controleur,
          this.avecFiltrage,
        ),
      );
    } else {
      lHtml.push(
        this.composeAucuneDonnee(
          GTraductions.getValeur("CahierDeTexte.AucunTAF"),
        ),
      );
    }
    lHtml.push("</div>");
    return lHtml.join("");
  }
  composeCours(aDonnees, aEstChronologique) {
    return this.utilitaireContenuDeCours.composeFicheCours(
      aDonnees,
      aEstChronologique,
    );
  }
  composeTAF(aDonnees, aControleur, aEstChronologique) {
    return this.utilitaireTAFEleves.composeFicheTAF(
      aDonnees.ListeTravailAFaire
        ? aDonnees.ListeTravailAFaire
        : new ObjetListeElements().add(aDonnees),
      this.utilitaireCDT,
      aControleur,
      aEstChronologique,
    );
  }
  composeTitreRessourcesPeda() {
    return this.utilitaireContenuDeCours.composeTitreRessourcesPeda();
  }
  composeRessourcesPeda(aListeRessPeda, aType, aInfoRessourceDeploye) {
    const lHtml = [];
    switch (aType) {
      case EGenreTypeRessourcesPedagogiques.SujetOuCorrige:
        lHtml.push(
          this.utilitaireContenuDeCours.composeRPSujetOuCorrige(
            aListeRessPeda,
            aInfoRessourceDeploye.sujetsCorriges,
          ),
        );
        break;
      case EGenreTypeRessourcesPedagogiques.TravailRendu:
        lHtml.push(
          this.utilitaireContenuDeCours.composeRPTravailRendu(
            aListeRessPeda,
            aInfoRessourceDeploye.travauxRendu,
            this.controleur,
          ),
        );
        break;
      case EGenreTypeRessourcesPedagogiques.QCM:
        lHtml.push(
          this.utilitaireContenuDeCours.composeRPQCM(
            aListeRessPeda,
            aInfoRessourceDeploye.QCM,
          ),
        );
        break;
      case EGenreTypeRessourcesPedagogiques.RessourcesGranulaires:
        lHtml.push(
          this.utilitaireContenuDeCours.composeRPRessourcesGranulaires(
            aListeRessPeda,
            aInfoRessourceDeploye.ressourcesGranulaires,
          ),
        );
        break;
      case EGenreTypeRessourcesPedagogiques.ForumPedagogique:
        lHtml.push(
          this.utilitaireContenuDeCours.composeRPForumPedagogique(
            aListeRessPeda,
            aInfoRessourceDeploye.forumPedagogique,
          ),
        );
        break;
      case EGenreTypeRessourcesPedagogiques.Autre:
        lHtml.push(
          this.utilitaireContenuDeCours.composeRPAutre(
            aListeRessPeda,
            aInfoRessourceDeploye.documentsAutres,
          ),
        );
        break;
      default:
        break;
    }
    return lHtml.join("");
  }
  composeManuelsNumeriques(
    aListeManuelsNumeriques,
    aFiltreMatiere,
    aInfoRessourceDeploye,
  ) {
    const lHtml = [];
    lHtml.push(
      this.utilitaireContenuDeCours.composeMN(
        aListeManuelsNumeriques,
        aFiltreMatiere,
        aInfoRessourceDeploye.ressourcesNumeriques,
      ),
    );
    return lHtml.join("");
  }
  setInfoRessourceDeploye(aNode) {
    this.callback.appel({ nodeDeploye: aNode });
  }
  appelQCM(aNumeroQCM) {
    this.callback.appel({ executionQCM: aNumeroQCM });
  }
  appelQCMRessource(aNumeroQCM) {
    this.callback.appel({ executionQCM: aNumeroQCM, estRessource: true });
  }
  appelCours(aNumero) {
    const lTAF = this.ListeTravailAFaire.getElementParNumero(aNumero);
    this.callback.appel({
      GenreBtnAction: EGenreBtnActionBlocTAF.voirContenu,
      taf: lTAF,
    });
  }
  appelTAF(aNumero) {
    const lCours = this.ListeCahierDeTextes.getElementParNumero(aNumero);
    this.callback.appel({ cours: lCours });
  }
  appelDetailTAF(aNumero) {
    const lTAF = this.ListeTravailAFaire.getElementParNumero(aNumero);
    this.callback.appel({
      GenreBtnAction: EGenreBtnActionBlocTAF.detailTAF,
      taf: lTAF,
    });
  }
  surUtilitaireCDT() {
    this.callback.appel();
  }
  surEvenementTafFait() {
    this.callback.appel();
  }
  evenementTafFait(aNumeroTaf) {
    const lElement = this.ListeTravailAFaire.getElementParNumero(aNumeroTaf);
    if (!!lElement.TAFFait) {
      lElement.TAFFait = false;
    } else {
      lElement.TAFFait = true;
    }
    lElement.setEtat(EGenreEtat.Modification);
    new ObjetRequeteSaisieTAFFaitEleve(
      this,
      this.surEvenementTafFait,
    ).lancerRequete({ listeTAF: this.ListeTravailAFaire });
  }
}
module.exports = { PageCahierDeTexteEleve };
