exports.DonneesListe_ListeEntreprises = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
const tag_1 = require("tag");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetDate_1 = require("ObjetDate");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_FiltrePeriodeOffresStages_1 = require("ObjetFenetre_FiltrePeriodeOffresStages");
const Enumere_Saisie_1 = require("Enumere_Saisie");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
class DonneesListe_ListeEntreprises extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
  constructor(aDonnees) {
    super(aDonnees);
    this.setOptions({
      avecSelection: true,
      avecEdition: false,
      avecSuppression: false,
      avecEvnt_Selection: true,
      avecBoutonActionLigne: false,
    });
  }
  avecMenuContextuel() {
    return false;
  }
  getClassCelluleConteneur() {
    return "AvecMain";
  }
  getIconeGaucheContenuFormate(aParams) {
    const lEntreprise = aParams.article;
    return lEntreprise.estSiegeSocial ? "icon_building" : "icon_entreprise";
  }
  getTitreZonePrincipale(aParams) {
    if (!aParams.article) {
      return "";
    }
    const lStrEntreprise =
      aParams.article.getLibelle() +
      (!!aParams.article.nomCommercial
        ? ` ${(0, tag_1.tag)("span", { style: "font-weight:400;" }, "/ " + aParams.article.nomCommercial)}`
        : "");
    return lStrEntreprise;
  }
  getInfosSuppZonePrincipale(aParams) {
    const lEntreprise = aParams.article;
    const H = [];
    if (!!lEntreprise) {
      H.push(
        !!lEntreprise.codePostal || !!lEntreprise.ville
          ? (0, tag_1.tag)(
              "div",
              (lEntreprise.codePostal || "") + " " + (lEntreprise.ville || ""),
            )
          : "",
      );
      H.push(
        !!lEntreprise.activite
          ? (0, tag_1.tag)("div", lEntreprise.activite.getLibelle())
          : "",
      );
      H.push(
        !!lEntreprise.siret
          ? (0, tag_1.tag)(
              "div",
              ObjetTraduction_1.GTraductions.getValeur(
                "OffreStage.titre.NumeroSiret",
              ) +
                " : " +
                lEntreprise.siret,
            )
          : "",
      );
    }
    return H.join("");
  }
  getZoneComplementaire(aParams) {
    const H = [];
    if (!this.enConstruction_cacheRechercheTexte) {
      const lEntreprise = aParams.article;
      if (!!lEntreprise) {
        const lNbOffres = lEntreprise.listeOffresStages
          ? lEntreprise.listeOffresStages.count()
          : 0;
        if (lNbOffres > 0) {
          H.push(
            (0, tag_1.tag)(
              "div",
              { class: "offre-pourvu" },
              lNbOffres +
                ` ${lNbOffres > 1 ? ObjetTraduction_1.GTraductions.getValeur("OffreStage.offres") : ObjetTraduction_1.GTraductions.getValeur("OffreStage.offre")}`,
            ),
          );
        }
        if (lEntreprise.estPublie === false) {
          H.push(
            (0, tag_1.tag)(
              "div",
              IE.estMobile
                ? ObjetTraduction_1.GTraductions.getValeur(
                    "OffreStage.nonPubliee",
                  )
                : ObjetTraduction_1.GTraductions.getValeur(
                    "OffreStage.nonPublieeSurEspaceParentsEleves",
                  ),
            ),
          );
        }
      }
    }
    return H.join("");
  }
  getVisible(aArticle) {
    return !aArticle || aArticle.visible;
  }
  getControleurFiltres(aInstance, aInstanceListe) {
    const lOptions = aInstance.options;
    return $.extend(
      true,
      super.getControleurFiltres(aInstance, aInstanceListe),
      {
        nbSemaines: {
          getValue() {
            return lOptions.filtre.nbrSemaines || "";
          },
          setValue(aValue) {
            lOptions.filtre.nbrSemaines = parseInt(aValue);
            if (
              !MethodesObjet_1.MethodesObjet.isNumber(
                lOptions.filtre.nbrSemaines,
              )
            ) {
              lOptions.filtre.nbrSemaines = 0;
            }
            aInstance._actualiserFiltres();
          },
        },
        cbFiltreSeulementAvecOffres: {
          getValue() {
            return lOptions.filtre.seulementAvecOffres;
          },
          setValue(aValue) {
            lOptions.filtre.seulementAvecOffres = aValue;
            aInstance._actualiserFiltres();
          },
        },
        selecPeriode: {
          event() {
            if (
              lOptions.optionsInterface.avecPeriode &&
              lOptions.optionsInterface.avecFiltrePeriode
            ) {
              aInstance._evntOuvertureFenetrePeriode();
            }
          },
          getLibelle() {
            return lOptions.filtre.periode &&
              lOptions.filtre.periode.getLibelle()
              ? lOptions.filtre.periode.getLibelle().ucfirst()
              : " ";
          },
          getIcone() {
            return (0, tag_1.tag)("i", { class: "icon_calendar_empty" });
          },
        },
        sujet: {
          getValue() {
            return lOptions.filtre.sujet;
          },
          setValue(aValue) {
            lOptions.filtre.sujet = aValue;
            aInstance._actualiserFiltres();
          },
        },
        afficherPeriode() {
          return (
            lOptions.optionsInterface.avecPeriode &&
            lOptions.optionsInterface.avecFiltrePeriode
          );
        },
        comboFiltreActivite: {
          init(aCombo) {
            aInstance.comboFiltreActivite = aCombo;
            aCombo.setOptionsObjetSaisie({
              mode: Enumere_Saisie_1.EGenreSaisie.Combo,
              multiSelection: true,
              longueur: 220,
              libelleHaut: ObjetTraduction_1.GTraductions.getValeur(
                "OffreStage.titre.Activite",
              ),
              avecDesignMobile: true,
              getInfosElementCB: function (aElement) {
                const lEstCumul = aElement.getNumero() === -1;
                return {
                  estCumul: lEstCumul,
                  estFilsCumul: function (aFils) {
                    return (
                      aElement.getGenre() === -1 &&
                      aElement.getGenre() !== aFils.getGenre()
                    );
                  },
                  setModifierSelection: function (aParametresModifie) {
                    if (
                      aParametresModifie.elementSourceSelectionne &&
                      aElement.getGenre() === -1 &&
                      aElement.getGenre() !==
                        aParametresModifie.elementSource.getGenre()
                    ) {
                      return true;
                    }
                  },
                };
              },
            });
            aCombo.setDonnees(
              lOptions.listeActivites,
              lOptions.filtre.activite,
            );
            aCombo.setContenu(lOptions.filtre.activite);
          },
          event(aParametres) {
            if (
              Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
                .selection === aParametres.genreEvenement &&
              aParametres.listeSelections
            ) {
              lOptions.filtre.activite = aParametres.listeSelections;
              aInstance._actualiserFiltres();
            }
          },
          destroy() {
            aInstance.comboFiltreActivite = null;
          },
        },
      },
    );
  }
  construireFiltres() {
    if (!this.options.filtre) {
      return "";
    }
    const H = [];
    H.push('<div class="filtre-conteneur-mobile">');
    H.push(
      `<div class="champs-filtre">\n              <input type="text" ie-model="sujet" class="round-style full-width sujet" placeholder="${ObjetTraduction_1.GTraductions.getValeur("OffreStage.titre.Sujet")}"/>\n            </div>\n\n            <div class="champs-filtre">\n              <ie-combo ie-model="comboFiltreActivite" class="combo-mobile flex-wrap full-width on-mobile"></ie-combo>\n            </div>`,
    );
    H.push(
      `<div ie-if="afficherPeriode" class="champs-filtre">\n    <label>${ObjetTraduction_1.GTraductions.getValeur("OffreStage.titre.Periode")}</label>\n    <ie-btnselecteur ie-model="selecPeriode" placeholder="" style="background-color:transparent"></ie-btnselecteur>\n</div>`,
    );
    H.push(
      `<div class="champs-filtre">\n              <label class="flex-contain flex-center duree-stage">\n                ${ObjetTraduction_1.GTraductions.getValeur("OffreStage.dureeMinimale")}\n                <input type="text" ie-model="nbSemaines" ie-mask="/[^0-9]/i" size="2" maxlength="2" class="round-style semaine" />\n              </label>\n            </div>`,
    );
    H.push(`<div class="fields-wrapper champs-filtre">\n              <ie-checkbox ie-textleft ie-model="cbFiltreSeulementAvecOffres">${ObjetTraduction_1.GTraductions.getValeur("OffreStage.titre.FiltreSeulementAvecOffre")}
            </div>`);
    H.push("</div>");
    return H.join("");
  }
  reinitFiltres() {
    Object.assign(
      this.options.filtre,
      DonneesListe_ListeEntreprises.getFiltresParDefaut(),
    );
    if (this.comboFiltreActivite) {
      this.comboFiltreActivite.setListeSelections(this.options.filtre.activite);
    }
    this._actualiserFiltres();
  }
  estFiltresParDefaut() {
    if (!this.options.filtre) {
      return true;
    }
    return !(
      this.options.filtre.nbrSemaines > 0 ||
      this.options.filtre.seulementAvecOffres ||
      this.options.filtre.sujet !== "" ||
      (this.options.filtre.activite.count() > 0 &&
        this.options.filtre.activite.count() <
          this.options.listeActivites.count() - 1) ||
      this.options.filtre.periode.Actif
    );
  }
  static getFiltresParDefaut() {
    const lPeriodeParDefaut = new ObjetElement_1.ObjetElement();
    lPeriodeParDefaut.setActif(false);
    lPeriodeParDefaut.dateDebut = ObjetDate_1.GDate.aujourdhui;
    lPeriodeParDefaut.dateFin = ObjetDate_1.GDate.aujourdhui;
    return {
      periode: lPeriodeParDefaut,
      sujet: "",
      seulementAvecOffres: false,
      nbrSemaines: 0,
      activite: new ObjetListeElements_1.ObjetListeElements(),
    };
  }
  _actualiserFiltres() {
    this.options.evnFiltre();
    this.paramsListe.actualiserListe();
  }
  _evntOuvertureFenetrePeriode() {
    const lFiltre = this.options.filtre;
    if (!lFiltre.periode) {
      lFiltre.periode = new ObjetElement_1.ObjetElement("");
      lFiltre.periode.dateDebut = null;
      lFiltre.periode.dateFin = null;
    }
    const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_FiltrePeriodeOffresStages_1.ObjetFenetre_FiltrePeriodeOffresStages,
      {
        pere: this,
        evenement(aNumeroBouton, aEstModif) {
          let lLibelle = "";
          if (aEstModif) {
            if (!!lFiltre.periode.dateDebut) {
              if (
                ObjetDate_1.GDate.estDateEgale(
                  lFiltre.periode.dateDebut,
                  lFiltre.periode.dateFin,
                )
              ) {
                lLibelle =
                  ObjetTraduction_1.GTraductions.getValeur("Le") +
                  " " +
                  ObjetDate_1.GDate.formatDate(
                    lFiltre.periode.dateDebut,
                    "%JJ/%MM/%AA",
                  );
              } else {
                lLibelle =
                  ObjetTraduction_1.GTraductions.getValeur("Du") +
                  " " +
                  ObjetDate_1.GDate.formatDate(
                    lFiltre.periode.dateDebut,
                    "%JJ/%MM/%AA",
                  );
                lLibelle +=
                  " " +
                  ObjetTraduction_1.GTraductions.getValeur("Au") +
                  " " +
                  ObjetDate_1.GDate.formatDate(
                    lFiltre.periode.dateFin,
                    "%JJ/%MM/%AA",
                  );
              }
            }
            lFiltre.periode.setLibelle(lLibelle);
            this._actualiserFiltres();
          }
        },
      },
    );
    lFenetre.setDonnees(lFiltre.periode);
    lFenetre.afficher();
  }
}
exports.DonneesListe_ListeEntreprises = DonneesListe_ListeEntreprises;
