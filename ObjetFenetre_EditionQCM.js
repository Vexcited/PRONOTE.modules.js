exports.ObjetFenetre_EditionQCM = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetFenetre_SelectionMatiere_1 = require("ObjetFenetre_SelectionMatiere");
const ObjetFenetre_SelectionCategoriesQCM_1 = require("ObjetFenetre_SelectionCategoriesQCM");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const GUID_1 = require("GUID");
class ObjetFenetre_EditionQCM extends ObjetFenetre_1.ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      largeur: 350,
      hauteur: 250,
      listeBoutons: [
        ObjetTraduction_1.GTraductions.getValeur("Annuler"),
        ObjetTraduction_1.GTraductions.getValeur("Valider"),
      ],
    });
    this.donnees = { QCM: null, listeMatieres: null, listeEtiquettes: null };
    this.estContexteModeCollaboratif = false;
    this.optionsAffichage = {
      avecSaisieMatiereParFenetre: true,
      avecSaisieMatiereParCombo: false,
      avecSaisieNiveau: false,
      avecSaisieEtiquette: false,
    };
    this.estSaisieMatiereObligatoire = false;
    this.avecModificationEtiquettes = false;
    this.avecThemes = false;
  }
  construireInstances() {
    this.addInstanceThemes();
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      Libelle: {
        inputTxt: {
          getValue: function () {
            return aInstance.donnees.QCM
              ? aInstance.donnees.QCM.getLibelle()
              : "";
          },
          setValue: function (aValue) {
            if (aInstance.donnees.QCM) {
              aInstance.donnees.QCM.setLibelle(aValue);
              aInstance.donnees.QCM.setEtat(
                Enumere_Etat_1.EGenreEtat.Modification,
              );
              aInstance.verifierCoherencePourValider();
            }
          },
          getDisabled: function () {
            return !aInstance.donnees.QCM;
          },
        },
      },
      Matiere: {
        avecSaisieMatiereParCombo: function () {
          return !!aInstance.optionsAffichage.avecSaisieMatiereParCombo;
        },
        comboMatieres: {
          init: function (aCombo) {
            aCombo.setOptionsObjetSaisie({
              longueur: 288,
              hauteur: 16,
              hauteurLigneDefault: 16,
              labelWAICellule:
                ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.Matiere"),
            });
          },
          getDonnees: function (aDonnees) {
            if (!aDonnees && aInstance.donnees.listeMatieres) {
              const lListeLignes =
                new ObjetListeElements_1.ObjetListeElements();
              lListeLignes.add(aInstance.donnees.listeMatieres);
              return lListeLignes;
            }
          },
          getIndiceSelection: function () {
            const lNumero = aInstance.donnees.QCM.matiere.getNumero();
            return aInstance.donnees.listeMatieres.getIndiceElementParFiltre(
              (aElement) => {
                return aElement.getNumero() === lNumero;
              },
            );
          },
          getLibelle: function () {
            let lLibelle = "";
            if (aInstance.donnees.QCM && aInstance.donnees.QCM.matiere) {
              const lNumero = aInstance.donnees.QCM.matiere.getNumero();
              const lMatiereSelectionnee =
                aInstance.donnees.listeMatieres.getElementParNumero(lNumero);
              if (lMatiereSelectionnee) {
                lLibelle = lMatiereSelectionnee.getLibelle();
              }
            }
            return lLibelle;
          },
          event: function (aParametres) {
            if (
              !!aInstance.donnees.QCM &&
              aParametres.genreEvenement ===
                Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
                  .selection &&
              aParametres.indice !==
                aInstance.donnees.listeMatieres.getIndiceParElement(
                  aInstance.donnees.QCM.matiere,
                )
            ) {
              aInstance.donnees.QCM.matiere =
                aInstance.donnees.listeMatieres.get(aParametres.indice);
              aInstance.donnees.QCM.setEtat(
                Enumere_Etat_1.EGenreEtat.Modification,
              );
              aInstance.verifierCoherencePourValider();
            }
          },
          getDisabled: function () {
            return (
              !aInstance.donnees.QCM ||
              aInstance.donnees.QCM.nbCompetencesTotal > 0 ||
              aInstance.donnees.QCM.estVerrouille
            );
          },
        },
        avecSaisieMatiereParFenetre: function () {
          return !!aInstance.optionsAffichage.avecSaisieMatiereParFenetre;
        },
        getHtmlMatiere: function () {
          let lStrMatiere = "";
          if (!!aInstance.donnees.QCM && !!aInstance.donnees.QCM.matiere) {
            lStrMatiere = aInstance.donnees.QCM.matiere.getLibelle();
          }
          return lStrMatiere || "&nbsp;";
        },
        nodeInputTexte: function () {
          $(this.node).eventValidation(() => {
            aInstance.surBoutonChoixMatiere();
          });
        },
      },
      Niveau: {
        avecSaisieNiveau: function () {
          return !!aInstance.optionsAffichage.avecSaisieNiveau;
        },
        getHtmlNiveau: function () {
          let lStrNiveau = "";
          if (!!aInstance.donnees.QCM && !!aInstance.donnees.QCM.niveau) {
            lStrNiveau = aInstance.donnees.QCM.niveau.getLibelle();
          }
          return lStrNiveau || "&nbsp;";
        },
        nodeInputTexte: function () {
          $(this.node).eventValidation(() => {
            aInstance.surBoutonChoixNiveau();
          });
        },
      },
      Etiquette: {
        avecSaisieEtiquette: function () {
          return (
            !aInstance.estContexteModeCollaboratif &&
            aInstance.optionsAffichage.avecSaisieEtiquette
          );
        },
        getHtmlEtiquettes: function () {
          const lStrEtiquettes = [];
          if (!!aInstance.donnees.QCM && !!aInstance.donnees.QCM.categories) {
            aInstance.donnees.QCM.categories.parcourir((aEtiquette) => {
              lStrEtiquettes.push(
                UtilitaireQCM_1.UtilitaireQCM.dessineIconeCategorieQCM(
                  aEtiquette.couleur,
                  aEtiquette.abr,
                ),
              );
            });
          }
          return lStrEtiquettes.length > 0
            ? lStrEtiquettes.join(" ")
            : "&nbsp;";
        },
        nodeInputTexte: function () {
          $(this.node).eventValidation(() => {
            aInstance.surBoutonChoixEtiquettes();
          });
        },
      },
      Partage: {
        cbPartager: {
          getValue() {
            return !!aInstance.donnees.QCM
              ? !aInstance.donnees.QCM.statutPrive
              : false;
          },
          setValue(aValue) {
            aInstance.donnees.QCM.statutPrive = !aValue;
            aInstance.donnees.QCM.setEtat(
              Enumere_Etat_1.EGenreEtat.Modification,
            );
            aInstance.verifierCoherencePourValider();
          },
        },
      },
    });
  }
  composeContenu() {
    const T = [];
    T.push('<div class="ObjetFenetreEditionQCM">');
    const lIdLibelle = GUID_1.GUID.getId();
    T.push(
      '<div class="LigneChamp">',
      '<label for="',
      lIdLibelle,
      '">',
      ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.Libelle"),
      "</label>",
      '<div class="LigneChampValeur">',
      '<input id="',
      lIdLibelle,
      '" ie-model="Libelle.inputTxt" type="text" class="round-style" title="',
      ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.HintLibelle"),
      '" spellcheck="false" tabindex="0" />',
      "</div>",
      "</div>",
    );
    T.push(
      '<div class="LigneChamp">',
      "<div>",
      ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.Matiere"),
      "</div>",
      '<div ie-if="Matiere.avecSaisieMatiereParFenetre" class="LigneChampValeur ChampChoixParFenetre">',
      '<div ie-html="Matiere.getHtmlMatiere" class="like-input AvecMain" ie-node="Matiere.nodeInputTexte" tabindex="0"></div>',
      "</div>",
      '<div ie-if="Matiere.avecSaisieMatiereParCombo" class="LigneChampValeur">',
      '<ie-combo ie-model="Matiere.comboMatieres" title="',
      ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.HintMatiere"),
      '"></ie-combo>',
      "</div>",
      "</div>",
    );
    if (this.avecThemes) {
      T.push(
        '<div class="LigneChamp">',
        "<div>",
        ObjetTraduction_1.GTraductions.getValeur("Themes"),
        " :</div>",
        '<div id="',
        this.getInstance(this.identMultiSelectionTheme).getNom(),
        '"></div>',
        "</div>",
      );
    }
    T.push(
      '<div ie-if="Niveau.avecSaisieNiveau" class="LigneChamp">',
      "<div>",
      ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.Niveau"),
      "</div>",
      '<div class="LigneChampValeur ChampChoixParFenetre">',
      '<div ie-html="Niveau.getHtmlNiveau" class="like-input AvecMain" ie-node="Niveau.nodeInputTexte" tabindex="0"></div>',
      "</div>",
      "</div>",
    );
    T.push(
      '<div ie-if="Etiquette.avecSaisieEtiquette" class="LigneChamp">',
      "<div>",
      ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.Categorie"),
      "</div>",
      '<div class="LigneChampValeur ChampChoixParFenetre">',
      '<div ie-html="Etiquette.getHtmlEtiquettes" class="like-input AvecMain" ie-node="Etiquette.nodeInputTexte" tabindex="0"></div>',
      "</div>",
      "</div>",
    );
    T.push(
      '<div class="LigneChamp LigneChampPartage">',
      '<i class="icon_sondage_bibliotheque IconePartage" aria-hidden="true" role="presentation"></i>',
      '<ie-checkbox ie-model="Partage.cbPartager">',
      ObjetTraduction_1.GTraductions.getValeur(
        "QCM_Divers.PartagerViaBiblioEtablissement",
      ),
      "</ie-checkbox>",
      "</div>",
    );
    T.push("</div>");
    return T.join("");
  }
  setContexteAffichage(aEstModeCollaboratif) {
    this.estContexteModeCollaboratif = aEstModeCollaboratif;
  }
  setDonnees(aQCM, aListeMatieres, aListeEtiquettes) {
    this.donnees.QCM = MethodesObjet_1.MethodesObjet.dupliquer(aQCM);
    this.avecModificationEtiquettes = false;
    this.donnees.listeEtiquettes = aListeEtiquettes;
    this.donnees.listeMatieres = new ObjetListeElements_1.ObjetListeElements();
    this.donnees.listeMatieres.add(aListeMatieres);
    if (this.optionsAffichage.avecSaisieMatiereParCombo) {
      let lPere = null;
      this.donnees.listeMatieres.parcourir((aElement) => {
        if (lPere && aElement.cumul > lPere.cumul) {
          aElement.pere = lPere;
          lPere.listeMatieres.addElement(aElement);
        } else {
          lPere = aElement;
          lPere.listeMatieres = new ObjetListeElements_1.ObjetListeElements();
          if (lPere) {
            lPere.listeMatieres.addElement(lPere);
          }
        }
        if (!aElement.libelleHtml) {
          aElement.libelleHtml = this._composeMatiereLibelleHTML(aElement);
        }
      });
    }
    if (this.avecThemes) {
      this.getInstance(this.identMultiSelectionTheme).setDonnees(
        this.donnees.QCM.ListeThemes ||
          new ObjetListeElements_1.ObjetListeElements(),
        !!this.donnees.QCM.matiere && this.donnees.QCM.matiere.getNumero()
          ? this.donnees.QCM.matiere
          : null,
        this.donnees.QCM.libelleCBTheme,
      );
    }
    this.afficher();
    this.setBoutonActif(1, false);
  }
  addInstanceThemes() {}
  surBoutonChoixNiveau() {}
  surBoutonChoixMatiere() {
    const lThis = this;
    const lFenetreChoixMatiere =
      ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
        ObjetFenetre_SelectionMatiere_1.ObjetFenetre_SelectionMatiere,
        {
          pere: lThis,
          evenement: function (
            aNumeroBouton,
            aIndiceSelection,
            aNumeroSelection,
          ) {
            if (aNumeroBouton === 1) {
              const lMatiereSelectionnee =
                lThis.donnees.listeMatieres.getElementParNumero(
                  aNumeroSelection,
                ) || new ObjetElement_1.ObjetElement();
              lThis.donnees.QCM.matiere = lMatiereSelectionnee;
              lThis.donnees.QCM.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
              lThis.verifierCoherencePourValider();
            }
          },
          initialiser: function (aInstanceFenetre) {
            aInstanceFenetre.setOptionsFenetre({
              titre:
                ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.Matiere"),
              largeur: 300,
              hauteur: 400,
              listeBoutons: [
                ObjetTraduction_1.GTraductions.getValeur("Fermer"),
              ],
            });
          },
        },
      );
    const lInfosListMatieres = {
      liste: lThis.donnees.listeMatieres,
      avecChoixFiltrageEnseignees: true,
      avecSelectionAucune: true,
      filtreEnseignees: null,
    };
    lFenetreChoixMatiere.setLibelleFiltreEnseignees(
      ObjetTraduction_1.GTraductions.getValeur(
        "SaisieQCM.UniquementMatieresEnseignees",
      ),
    );
    lFenetreChoixMatiere.setDonnees(
      lInfosListMatieres.liste,
      lInfosListMatieres.avecChoixFiltrageEnseignees,
      lInfosListMatieres.avecSelectionAucune,
      lInfosListMatieres.filtreEnseignees,
    );
  }
  surBoutonChoixEtiquettes() {
    const lThis = this;
    const lFenetreSelectionEtiquettes =
      ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
        ObjetFenetre_SelectionCategoriesQCM_1.ObjetFenetre_SelectionCategoriesQCM,
        {
          pere: lThis,
          evenement: function (aNumeroBouton, aDonnees) {
            if (aNumeroBouton === 1) {
              lThis.donnees.QCM.categories = !!aDonnees
                ? aDonnees.etiquettesCochees
                : null;
              lThis.donnees.QCM.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
              lThis.verifierCoherencePourValider();
            } else if (
              aDonnees.avecModification &&
              !!aDonnees.listeToutesEtiquettes
            ) {
              lThis.avecModificationEtiquettes = true;
              if (!!lThis.donnees.QCM.categories) {
                lThis.donnees.QCM.categories.parcourir((aEtiquette) => {
                  const lEtiquetteModifiee =
                    aDonnees.listeToutesEtiquettes.getElementParNumero(
                      aEtiquette.getNumero(),
                    );
                  if (!!lEtiquetteModifiee) {
                    aEtiquette.setLibelle(lEtiquetteModifiee.getLibelle());
                    aEtiquette.abr = lEtiquetteModifiee.abr;
                    aEtiquette.couleur = lEtiquetteModifiee.couleur;
                  }
                });
                lThis.$refresh();
              }
            }
          },
        },
      );
    lFenetreSelectionEtiquettes.setDonnees(lThis.donnees.listeEtiquettes, {
      listeEtiquettesSelectionnees: lThis.donnees.QCM.categories,
      avecCocheSelection: true,
    });
  }
  surValidation(ANumeroBouton) {
    const lParametres = {
      QCM: this.donnees.QCM,
      avecModificationEtiquettes: false,
    };
    if (this.avecModificationEtiquettes) {
      lParametres.avecModificationEtiquettes = this.avecModificationEtiquettes;
    }
    this.callback.appel(ANumeroBouton, lParametres);
    this.fermer();
  }
  verifierCoherencePourValider() {
    let lEstBoutonValiderActif = false;
    const lQCM = this.donnees.QCM;
    if (!!lQCM) {
      const lLibelleOK = !!lQCM.getLibelle();
      const lMatiereOK =
        !this.estSaisieMatiereObligatoire ||
        (!!lQCM.matiere && lQCM.matiere.existeNumero());
      lEstBoutonValiderActif = lLibelleOK && lMatiereOK;
    }
    this.setBoutonActif(1, lEstBoutonValiderActif);
  }
  _composeMatiereLibelleHTML(aArticle) {
    const T = [];
    if (aArticle.couleur) {
      const lBorder =
        aArticle.cumul > 1
          ? "border-radius:6px;"
          : "border-radius:6px 0 0 6px;";
      const lHeight = aArticle.cumul > 1 ? 6 : 25;
      T.push(
        '<div style="display:flex; align-items:center;">',
        '<div style="',
        ObjetStyle_1.GStyle.composeHeight(lHeight),
        "min-width:6px; margin-right: 3px; " +
          ObjetStyle_1.GStyle.composeCouleurFond(aArticle.couleur),
        lBorder,
        '"></div>',
        "<div >",
        aArticle.getLibelle(),
        "</div>",
        "</div>",
      );
    } else {
      T.push(aArticle.getLibelle());
    }
    return T.join("");
  }
}
exports.ObjetFenetre_EditionQCM = ObjetFenetre_EditionQCM;
