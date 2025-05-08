const { EGenreEtat } = require("Enumere_Etat.js");
const { GDate } = require("ObjetDate.js");
const { ObjetIdentite_Mobile } = require("ObjetIdentite_Mobile.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const {
  ObjetRequeteSaisieTAFFaitEleve,
} = require("ObjetRequeteSaisieTAFFaitEleve.js");
const {
  ObjetUtilitaireCahierDeTexte,
} = require("ObjetUtilitaireCahierDeTexte.js");
const { EGenreDirectionSlide } = require("EGenreDirectionSlide.js");
const { UtilitaireTAFEleves } = require("UtilitaireTAFEleves.js");
const { UtilitaireContenuDeCours } = require("UtilitaireContenuDeCours.js");
const { EGenreBtnActionBlocTAF } = require("GestionnaireBlocTAF.js");
const {
  EGenreRessourcePedagogique,
} = require("Enumere_RessourcePedagogique.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const {
  EGenreTypeRessourcesPedagogiques,
} = require("Enumere_TypeRessourcesPedagogiques.js");
const {
  ObjetFenetre_ForumVisuPosts,
} = require("ObjetFenetre_ForumVisuPosts.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetGalerieCarrousel } = require("ObjetGalerieCarrousel.js");
const { ObjetElement } = require("ObjetElement.js");
const { TypeGenreMiniature } = require("TypeGenreMiniature.js");
class PageCahierDeTexte_Mobile extends ObjetIdentite_Mobile {
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
      getCarrouselTAF(aNumeroTAF) {
        return {
          class: ObjetGalerieCarrousel,
          pere: aInstance,
          init: (aCarrousel) => {
            aCarrousel.setOptions({
              dimensionPhoto: 200,
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
                  aPJ.miniature = TypeGenreMiniature.GM_400;
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
              dimensionPhoto: 200,
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
                  aPJ.miniature = TypeGenreMiniature.GM_400;
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
  setDonnees(
    aGenreOnglet,
    aListe,
    aCycleCourant,
    aAvecFiltrage,
    aFiltreMatiere,
    aListeTAFComplet,
    aEstListeRessource,
  ) {
    this.genreOnglet = aGenreOnglet;
    this.ListeTAFComplet = aListeTAFComplet;
    const lSensSwipe =
      !this.cycleCourant || aCycleCourant === this.cycleCourant
        ? EGenreDirectionSlide.Aucune
        : aCycleCourant < this.cycleCourant
          ? EGenreDirectionSlide.Droite
          : EGenreDirectionSlide.Gauche;
    this.cycleCourant = aCycleCourant;
    this.avecFiltrage = aAvecFiltrage;
    this.filtreMatiere = aFiltreMatiere;
    this.estListeRessource = aEstListeRessource;
    if (this.genreOnglet === EGenreOnglet.CDT_TAF) {
      this.ListeTravailAFaire = aListe;
      this.actualiserTravailAFaire(this.ListeTravailAFaire);
    } else {
      this.ListeCahierDeTextes = aListe;
      if (!this.estListeRessource) {
        this.actualiserContenuDeCours(this.ListeCahierDeTextes);
      }
    }
    this.afficher(null, lSensSwipe);
    return this.avecDonnees;
  }
  actualiserContenuDeCours() {
    if (this.ListeCahierDeTextes) {
      if (!this.estListeRessource) {
        this.ListeCahierDeTextes.setTri([ObjetTri.init("Date")]).trier();
      } else {
        this.ListeCahierDeTextes.setTri([
          ObjetTri.init("matiere.Libelle"),
        ]).trier();
      }
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
      : this.estListeRessource
        ? this.composePageRessource(this.ListeCahierDeTextes)
        : this.composePageContenu(this.ListeCahierDeTextes);
  }
  composePageContenu(aListeCahierDeTextes) {
    if (!aListeCahierDeTextes) {
      return "";
    }
    const lHtml = [];
    lHtml.push('<div class="conteneur-liste-CDT">');
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
        this.composeAucuneDonnee(
          GTraductions.getValeur("CahierDeTexte.AucunContenu"),
        ),
      );
    }
    lHtml.push("</div>");
    return lHtml.join("");
  }
  composePageRessource(aListeCahierDeTextes) {
    if (!aListeCahierDeTextes) {
      return "";
    }
    const lHtml = [];
    lHtml.push('<div class="conteneur-liste-CDT">');
    if (!!aListeCahierDeTextes.count()) {
      lHtml.push('<div class="conteneur-ressource-mobile">');
      const lRessourcesPedagogiquesParMatiere =
        _regrouperRessourcesPedagogiquesParMatiere.call(
          this,
          aListeCahierDeTextes,
        );
      for (const lMatiere in lRessourcesPedagogiquesParMatiere) {
        if (!this.avecFiltrage) {
          let lCouleur;
          for (let i = 0; i < aListeCahierDeTextes.count(); i++) {
            const lElement = aListeCahierDeTextes.get(i);
            if (lElement.matiere.getLibelle() === lMatiere) {
              lCouleur = GEtatUtilisateur.pourPrimaire()
                ? lElement.matiere.couleur
                : lElement.matiere.CouleurFond;
              break;
            }
          }
          lHtml.push('<div class="conteneur-ressource-journee">');
          lHtml.push('<div class="entete-element">');
          lHtml.push(
            '<div class="flex-contain">',
            '<div style="background-color:',
            lCouleur,
            ';margin-right:0.8rem;padding:0.2rem;border-radius:0.4rem;"></div>',
          );
          lHtml.push("<div>");
          lHtml.push('<div class="titre-matiere">', lMatiere, "</div>");
          lHtml.push("</div>");
          lHtml.push("</div>");
          lHtml.push("</div>");
        }
        const lRessourcesPedagogiquesParType =
          _regrouperRessourcesPedagogiquesParType.call(
            this,
            lRessourcesPedagogiquesParMatiere[lMatiere],
            this.filtreMatiere,
          );
        for (const lKey of MethodesObjet.enumKeys(
          EGenreTypeRessourcesPedagogiques,
        )) {
          const lType = EGenreTypeRessourcesPedagogiques[lKey];
          lHtml.push(
            this.composeRessourcesPeda(
              lRessourcesPedagogiquesParType[lType],
              lType,
            ),
          );
        }
        lHtml.push("</div>");
      }
      lHtml.push("</div>");
    } else {
      lHtml.push(
        this.composeAucuneDonnee(
          GTraductions.getValeur("CahierDeTexte.AucuneRessource"),
        ),
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
    lHtml.push('<div class="conteneur-liste-CDT">');
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
          GTraductions.getValeur("CahierDeTexte.AucunTAFSelonCriteres"),
        ),
      );
    }
    lHtml.push("</div>");
    return lHtml.join("");
  }
  composeRessourcesPeda(aListeRessPeda, aType) {
    const lHtml = [];
    switch (aType) {
      case EGenreTypeRessourcesPedagogiques.SujetOuCorrige:
        lHtml.push(
          this.utilitaireContenuDeCours.composeRPSujetOuCorrige(
            aListeRessPeda,
            true,
          ),
        );
        break;
      case EGenreTypeRessourcesPedagogiques.TravailRendu:
        lHtml.push(
          this.utilitaireContenuDeCours.composeRPTravailRendu(
            aListeRessPeda,
            true,
            this.controleur,
          ),
        );
        break;
      case EGenreTypeRessourcesPedagogiques.QCM:
        lHtml.push(
          this.utilitaireContenuDeCours.composeRPQCM(aListeRessPeda, true),
        );
        break;
      case EGenreTypeRessourcesPedagogiques.RessourcesGranulaires:
        lHtml.push(
          this.utilitaireContenuDeCours.composeRPRessourcesGranulaires(
            aListeRessPeda,
            true,
          ),
        );
        break;
      case EGenreTypeRessourcesPedagogiques.ForumPedagogique:
        lHtml.push(
          this.utilitaireContenuDeCours.composeRPForumPedagogique(
            aListeRessPeda,
            true,
          ),
        );
        break;
      case EGenreTypeRessourcesPedagogiques.Autre:
        lHtml.push(
          this.utilitaireContenuDeCours.composeRPAutre(aListeRessPeda, true),
        );
        break;
      default:
        break;
    }
    return lHtml.join("");
  }
  composeCours(aDonnees) {
    return this.utilitaireContenuDeCours.composeFicheCours(aDonnees);
  }
  composeTAF(aDonnees, aControleur) {
    return this.utilitaireTAFEleves.composeFicheTAF(
      aDonnees.ListeTravailAFaire,
      this.utilitaireCDT,
      aControleur,
    );
  }
  appelQCM(aNumeroQCM) {
    this.callback.appel({
      GenreBtnAction: EGenreBtnActionBlocTAF.executionQCM,
      executionQCM: aNumeroQCM,
    });
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
  surUtilitaireCDT() {
    this.callback.appel();
  }
  surEvenementTafFait(aTaf) {
    this.callback.appel({ date: aTaf.PourLe });
  }
  evenementTafFait(aNumeroTaf) {
    const lElement = this.ListeTravailAFaire.getElementParNumero(aNumeroTaf);
    if (!!lElement.TAFFait) {
      lElement.TAFFait = false;
    } else {
      lElement.TAFFait = true;
    }
    lElement.setEtat(EGenreEtat.Modification);
    new ObjetRequeteSaisieTAFFaitEleve(this)
      .lancerRequete({ listeTAF: this.ListeTravailAFaire })
      .then(this.surEvenementTafFait(lElement));
  }
}
function _regrouperRessourcesPedagogiquesParType(
  aListeRessources,
  aMatiereFiltrante,
) {
  const lRessourcesPedagogiquesParType = {};
  if (!!aListeRessources) {
    aListeRessources.parcourir((D) => {
      if (
        !D.matiere ||
        !aMatiereFiltrante ||
        D.matiere.getNumero() === aMatiereFiltrante.getNumero()
      ) {
        let lTypeListe;
        if (
          D.getGenre() === EGenreRessourcePedagogique.sujet ||
          D.getGenre() === EGenreRessourcePedagogique.corrige
        ) {
          lTypeListe = EGenreTypeRessourcesPedagogiques.SujetOuCorrige;
        } else if (D.getGenre() === EGenreRessourcePedagogique.travailRendu) {
          lTypeListe = EGenreTypeRessourcesPedagogiques.TravailRendu;
        } else if (D.getGenre() === EGenreRessourcePedagogique.QCM) {
          lTypeListe = EGenreTypeRessourcesPedagogiques.QCM;
        } else if (D.estForumPeda) {
          lTypeListe = EGenreTypeRessourcesPedagogiques.ForumPedagogique;
        } else if (D.getGenre() === EGenreRessourcePedagogique.kiosque) {
          lTypeListe = EGenreTypeRessourcesPedagogiques.RessourcesGranulaires;
        } else {
          lTypeListe = EGenreTypeRessourcesPedagogiques.Autre;
        }
        if (!lRessourcesPedagogiquesParType[lTypeListe]) {
          lRessourcesPedagogiquesParType[lTypeListe] = new ObjetListeElements();
        }
        lRessourcesPedagogiquesParType[lTypeListe].addElement(D);
      }
    });
  }
  return lRessourcesPedagogiquesParType;
}
function _regrouperRessourcesPedagogiquesParMatiere(aListeRessources) {
  const lRessourcesPedagogiquesParMatiere = {};
  if (!!aListeRessources) {
    aListeRessources.parcourir((D) => {
      let lMatiereListe;
      if (D.matiere) {
        lMatiereListe = D.matiere.getLibelle();
      } else {
        lMatiereListe = undefined;
      }
      if (!lRessourcesPedagogiquesParMatiere[lMatiereListe]) {
        lRessourcesPedagogiquesParMatiere[lMatiereListe] =
          new ObjetListeElements();
      }
      lRessourcesPedagogiquesParMatiere[lMatiereListe].addElement(D);
    });
  }
  return lRessourcesPedagogiquesParMatiere;
}
module.exports = { PageCahierDeTexte_Mobile };
