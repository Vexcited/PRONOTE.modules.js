const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GStyle } = require("ObjetStyle.js");
const { tag } = require("tag.js");
const { GChaine } = require("ObjetChaine.js");
const { TUtilitaireRencontre } = require("UtilitaireRencontres.js");
const { TypeVoeuRencontreUtil } = require("Enumere_VoeuRencontre.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
class DonneesListe_RencontresDesiderata extends ObjetDonneesListeFlatDesign {
  constructor(aDonnees, aParams) {
    super(aDonnees);
    this.avecEleve = aParams.avecEleve;
    this.autorisations = aParams.autorisations;
    this.callbackDuree = aParams.callbackDuree;
    this.avecSaisie = aParams.avecSaisie;
    this.duree = { min: 3, max: 30 };
    this.setOptions({
      avecEvnt_Selection: false,
      avecSelection: false,
      avecDeselectionSurNonSelectionnable: false,
      avecEvnt_SelectionDblClick: false,
      avecBoutonActionLigne: false,
      avecTri: false,
      flatDesignMinimal: true,
    });
    this.avecSaisieDuree = [
      EGenreEspace.Professeur,
      EGenreEspace.Mobile_Professeur,
      EGenreEspace.Etablissement,
      EGenreEspace.Mobile_Etablissement,
    ].includes(GEtatUtilisateur.GenreEspace);
  }
  _getNombreVoeuxSaisies(aGenreVoeux) {
    if (this.autorisations.listeVoeux) {
      const lListeVoeuxSaisieDuGenre = this.Donnees.getListeElements(
        (aElement) => {
          return aElement.validationvoeu && aElement.voeu === aGenreVoeux;
        },
      );
      return lListeVoeuxSaisieDuGenre.count();
    }
    return 0;
  }
  estUnVoeuSaisissable(aNumero, aGenreVoeux) {
    const lElement = this.Donnees.getElementParNumero(aNumero);
    const lNombreSaisie = this._getNombreVoeuxSaisies(aGenreVoeux);
    const lLimiteVoeux = TUtilitaireRencontre.getLimiteNbSaisissable(
      this.autorisations.listeVoeux,
      aGenreVoeux,
    );
    let lSaisiePossible = false;
    let lAvecMessage = false;
    if (lElement) {
      if (lLimiteVoeux === 0) {
        lSaisiePossible =
          !lElement.validationvoeu || aGenreVoeux !== lElement.voeu;
      } else {
        if (lNombreSaisie < lLimiteVoeux) {
          lSaisiePossible =
            !lElement.validationvoeu || aGenreVoeux !== lElement.voeu;
        } else {
          if (lElement.validationvoeu && lElement.voeu === aGenreVoeux) {
            lSaisiePossible = true;
          } else {
            lAvecMessage = true;
          }
        }
      }
    }
    return { saisiePossible: lSaisiePossible, avecMessage: lAvecMessage };
  }
  getResponsables(aArticle) {
    return aArticle.responsables
      ? aArticle.responsables.getTableauLibelles().join(", ")
      : "";
  }
  getZoneGauche(aParams) {
    const lCouleurFond = aParams.article.couleurMatiere
      ? `style="${GStyle.composeCouleurFond(aParams.article.couleurMatiere)}"`
      : "";
    return !this.avecSaisieDuree && !aParams.article.estUnDeploiement
      ? `<div class="trait-couleur" ${lCouleurFond}></div>`
      : "";
  }
  getInfosSuppZonePrincipale(aParams) {
    return [EGenreEspace.Parent, EGenreEspace.Mobile_Parent].includes(
      GEtatUtilisateur.GenreEspace,
    )
      ? aParams.article.strMatiereFonction || "&nbsp;"
      : this.getResponsables(aParams.article);
  }
  getTitreZonePrincipale(aParams) {
    let lTitre = "";
    if (aParams.article.estUnDeploiement) {
      lTitre = aParams.article.classe
        ? aParams.article.classe.getLibelle()
        : aParams.article.getLibelle();
    } else if (
      [EGenreEspace.Parent, EGenreEspace.Mobile_Parent].includes(
        GEtatUtilisateur.GenreEspace,
      )
    ) {
      const lLibelles = [];
      aParams.article.listeInterlocuteursTriees.parcourir((aInterlocuteur) => {
        let lLibelle = [aInterlocuteur.getLibelle()];
        if (aInterlocuteur.estPP) {
          lLibelle.push(`(${GTraductions.getValeur("ProfPrincipal")})`);
        }
        if (aInterlocuteur.estTuteur) {
          lLibelle.push(`(${GTraductions.getValeur("Tuteur")})`);
        }
        lLibelles.push(lLibelle.join(" "));
      });
      lTitre = aParams.article.listeInterlocuteursTriees
        ? lLibelles.join(", ")
        : "";
    } else {
      lTitre = aParams.article.titre ? aParams.article.titre : "";
    }
    return lTitre;
  }
  getZoneMessage(aParams) {
    if (aParams.article.estUnDeploiement || aParams.article.estUnEleve) {
      return;
    }
    const H = [];
    const lClasse = IE.estMobile ? "m-left-nega-xl" : "justify-end";
    H.push(
      `<fieldset class="flex-contain m-top-l f-wrap ${lClasse}">\n      <legend class="sr-only">${this.getTitreZonePrincipale(aParams)}</legend>`,
    );
    if (this.autorisations && this.autorisations.listeVoeux) {
      this.autorisations.listeVoeux.parcourir((aVoeu) => {
        H.push(
          tag(
            "div",
            { class: ["voeux"] },
            tag(
              "ie-radio",
              {
                "ie-model": tag.funcAttr("rbVoeux", [
                  aParams.article.getNumero(),
                  aVoeu.getGenre(),
                ]),
                class: [
                  "as-chips",
                  "m-right",
                  "m-bottom-l",
                  TypeVoeuRencontreUtil.getClass(aVoeu.getGenre()),
                ],
                name: `rbVoeux_${aParams.article.getNumero()}`,
              },
              TypeVoeuRencontreUtil.getLibelle(aVoeu.getGenre()),
            ),
            !!aVoeu.limiteNbSaisies
              ? `${tag("span", { class: "ie-titre-petit" }, GTraductions.getValeur("Rencontres.max", [aVoeu.limiteNbSaisies]))}`
              : "",
          ),
        );
      });
    }
    H.push("</fieldset>");
    return H.join("");
  }
  getZoneComplementaire(aParams) {
    if (aParams.article.duree) {
      const lDuree =
        aParams.article.duree.toString() +
        " " +
        GTraductions.getValeur("Rencontres.abbrMin");
      this.autorisations.saisieDuree;
      return (
        '<div class="flex-contain' +
        (this.autorisations.saisieDuree
          ? ' AvecMain" tabindex="0" role="button" aria-haspopup="dialog" ie-node="' +
            tag.funcAttr("btnModifierDuree", [aParams.article.getNumero()]) +
            '"'
          : '"') +
        '><i role="img" class="icon_edt_permanence i-as-deco" title="' +
        GTraductions.getValeur("Duree") +
        '" aria-label="' +
        GTraductions.getValeur("Duree") +
        '"></i>' +
        lDuree +
        "</div>"
      );
    }
    return "";
  }
  getTri() {
    const lTris = [];
    if (this.avecEleve) {
      lTris.push(
        ObjetTri.init((D) => {
          return D.classe ? D.classe.getLibelle() : "";
        }),
      );
      lTris.push(
        ObjetTri.init((D) => {
          return D.eleve ? D.eleve.getLibelle() : "";
        }),
      );
      lTris.push(
        ObjetTri.init((D) => {
          return D.strMatiereFonction || "";
        }),
      );
      lTris.push(
        ObjetTri.init((D) => {
          return D.strResponsables || "";
        }),
      );
    } else {
      lTris.push(
        ObjetTri.init((D) => {
          return !!D.pere
            ? D.pere.getNumero() !== EGenreEspace.Professeur
            : D.getNumero() !== EGenreEspace.Professeur;
        }),
      );
      lTris.push(
        ObjetTri.init((D) => {
          return !D.estUnDeploiement;
        }),
      );
      lTris.push(
        ObjetTri.init((D) => {
          if (
            !!D.pere &&
            !!D.listeInterlocuteursTriees &&
            D.listeInterlocuteursTriees.count() > 0
          ) {
            return D.listeInterlocuteursTriees
              .getPremierElement()
              .getPosition();
          } else {
            return 0;
          }
        }),
      );
    }
    return lTris;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      rbVoeux: {
        getValue(aNumero, aGenreVoeux) {
          if (aNumero) {
            const lElement = aInstance.Donnees.getElementParNumero(aNumero);
            if (lElement) {
              return lElement.validationvoeu && lElement.voeu === aGenreVoeux;
            }
          }
          return false;
        },
        setValue(aNumero, aGenreVoeux) {
          if (aNumero) {
            const lElement = aInstance.Donnees.getElementParNumero(aNumero);
            const lVerif = aInstance.estUnVoeuSaisissable(aNumero, aGenreVoeux);
            if (lVerif.saisiePossible) {
              lElement.setEtat(EGenreEtat.Modification);
              lElement.validationvoeu = lElement.validationvoeu
                ? lElement.voeu !== aGenreVoeux
                : true;
              lElement.voeu = aGenreVoeux;
              this.instance.callback.appel({
                article: lElement,
                genreEvenement: EGenreEvenementListe.ApresEdition,
              });
            } else {
              if (lVerif.avecMessage) {
                const lLimite = TUtilitaireRencontre.getLimiteNbSaisissable(
                  aInstance.autorisations.listeVoeux,
                  aGenreVoeux,
                );
                GApplication.getMessage().afficher({
                  type: EGenreBoiteMessage.Information,
                  titre: GTraductions.getValeur("Rencontres.saisieImpossible"),
                  message:
                    GTraductions.getValeur(
                      lLimite === 1
                        ? "Rencontres.desiderataAutorise"
                        : "Rencontres.desiderataAutorisesPluriel",
                      [lLimite],
                    ) +
                    "<br>" +
                    GTraductions.getValeur(
                      [
                        EGenreEspace.Parent,
                        EGenreEspace.Mobile_Parent,
                      ].includes(GEtatUtilisateur.GenreEspace)
                        ? "Rencontres.msgDesactiveResponsable"
                        : "Rencontres.msgDesactiveEnseignant",
                    ),
                });
              }
              this.controleur.$refresh();
            }
          }
        },
        getDisabled() {
          return !(
            aInstance.autorisations.saisieDesiderata && aInstance.avecSaisie
          );
        },
      },
      btnModifierDuree: function (aNumero) {
        $(this.node).eventValidation(() => {
          const lElement = aInstance.Donnees.getElementParNumero(aNumero);
          if (lElement) {
            _ouvrirFenetreModifierDuree.call(aInstance, lElement);
          }
        });
      },
    });
  }
}
function _ouvrirFenetreModifierDuree(aRencontre) {
  const lFenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre, {
    pere: this,
    evenement: function (aGenreBouton) {
      if (aGenreBouton) {
        aRencontre.setEtat(EGenreEtat.Modification);
        this.callbackDuree(aRencontre);
      }
    },
    initialiser: function (aInstance) {
      aInstance.duree = this.duree;
      aInstance.setOptionsFenetre({
        titre: GTraductions.getValeur("Duree"),
        largeur: 300,
        hauteur: 200,
        listeBoutons: [
          GTraductions.getValeur("Annuler"),
          GTraductions.getValeur("Valider"),
        ],
      });
    },
  });
  const lAncienneDuree = aRencontre.duree;
  const lControleur = {
    inputDuree: {
      getValue() {
        return aRencontre.duree;
      },
      setValue(aValue) {
        const lDuree = GChaine.strToInteger(aValue || 0);
        aRencontre.duree = lDuree;
      },
      exitChange: function () {
        if (
          aRencontre.duree < this.instance.duree.min ||
          aRencontre.duree > this.instance.duree.max
        ) {
          aRencontre.duree = lAncienneDuree;
          GApplication.getMessage().afficher({
            message: GTraductions.getValeur("ErreurMinMaxEntier", [
              this.instance.duree.min,
              this.instance.duree.max,
            ]),
          });
        }
      },
    },
  };
  $.extend(lFenetre.controleur, lControleur);
  const lHtml = tag("input", {
    type: "number",
    "ie-model": "inputDuree",
    class: "round-style EspaceInput",
    style: "width:100%;",
    title: GTraductions.getValeur("Duree"),
  });
  lFenetre.afficher(lHtml);
}
module.exports = DonneesListe_RencontresDesiderata;
