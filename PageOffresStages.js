const { GUID } = require("GUID.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { GDate } = require("ObjetDate.js");
const { ObjetDetailOffreStage } = require("ObjetDetailOffreStage.js");
const { ObjetInterface } = require("ObjetInterface.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { ToucheClavier } = require("ToucheClavier.js");
const {
  ObjetFenetre_FiltrePeriodeOffresStages,
} = require("ObjetFenetre_FiltrePeriodeOffresStages.js");
const {
  DonneesListe_ListeEntreprises,
} = require("DonneesListe_ListeEntreprises.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
const { EGenreSaisie } = require("Enumere_Saisie.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { RechercheTexte } = require("RechercheTexte.js");
class PageOffresStages extends ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    this.idFiltre = GUID.getId();
    this.idFiltreSujetTextfield = GUID.getId();
    this.idFiltreNbSemaines = GUID.getId();
    this.idFiltreRechercheTextfield = GUID.getId();
    this.options = {
      avecPeriode: false,
      avecFiltrePeriode: false,
      avecPeriodeUnique: true,
      avecGestionPJ: false,
      genreRessourcePJ: -1,
    };
    this.periode = new ObjetElement("");
    this.periode.dateDebut = GDate.aujourdhui;
    this.periode.dateFin = GDate.aujourdhui;
    this.sujet = "";
    this.recherche = "";
  }
  construireInstances() {
    this.identListeEntreprises = this.add(
      ObjetListe,
      _evnSelectListeEntreprise.bind(this),
      _initListe.bind(this),
    );
    this.identDetailOffreDeStage = this.add(
      ObjetDetailOffreStage,
      null,
      _initDetail.bind(this),
    );
    this.identFiltreActivite = this.add(
      ObjetSaisie,
      _evnFiltreActivite.bind(this),
      (aInstance) => {
        aInstance.setOptionsObjetSaisie({
          mode: EGenreSaisie.Combo,
          multiSelection: true,
          longueur: 220,
          labelWAICellule: GTraductions.getValeur("OffreStage.titre.Activite"),
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
      },
    );
    if (this.options.avecPeriode && this.options.avecFiltrePeriode) {
      this.idFenetrePeriode = this.addFenetre(
        ObjetFenetre_FiltrePeriodeOffresStages,
        _evntFenetrePeriode.bind(this),
        _initFenetrePeriode,
      );
    }
  }
  setOptions(aOptions) {
    $.extend(this.options, aOptions);
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      nbSemaines: {
        getValue: function () {
          return aInstance.filtreNbrSemaines || "";
        },
        setValue: function (aValue) {
          aInstance.filtreNbrSemaines = parseInt(aValue);
          if (!MethodesObjet.isNumber(aInstance.filtreNbrSemaines)) {
            aInstance.filtreNbrSemaines = 0;
          }
          _evnFiltre.call(aInstance);
        },
      },
      cbFiltreSeulementAvecOffres: {
        getValue: function () {
          return aInstance.filtreSeulementAvecOffres;
        },
        setValue: function (aValue) {
          aInstance.filtreSeulementAvecOffres = aValue;
          _evnFiltre.call(aInstance);
        },
      },
      surZoneMouseenterMouseleave: function (aEvent) {
        if (!aInstance.Actif) {
          return;
        }
        aInstance._enSurvol = aEvent.type === "mouseenter";
        this.controleur.$refreshSelf();
      },
      getStyleBouton: function () {
        return {
          "background-color": aInstance
            ? aInstance._enSurvol
              ? GCouleur.themeNeutre.moyen2
              : GCouleur.blanc
            : "",
        };
      },
      getPeriode: function () {
        return aInstance && aInstance.periode
          ? aInstance.periode.getLibelle().ucfirst()
          : " ";
      },
      eventPeriode: function () {
        if (
          aInstance &&
          aInstance.options.avecPeriode &&
          aInstance.options.avecFiltrePeriode
        ) {
          aInstance.evntOuvertureFenetrePeriode();
        }
      },
      recherche: {
        getValue: function () {
          return aInstance ? aInstance.recherche : "";
        },
        setValue: function (aValue) {
          if (aInstance) {
            aInstance.recherche = aValue;
            _evnFiltre.call(aInstance);
          }
        },
      },
      sujet: {
        getValue: function () {
          return aInstance ? aInstance.sujet : "";
        },
        setValue: function (aValue) {
          if (aInstance) {
            aInstance.sujet = aValue;
            _evnFiltre.call(aInstance, true);
          }
        },
      },
    });
  }
  evntOuvertureFenetrePeriode() {
    if (!this.periode) {
      this.periode = new ObjetElement("");
      this.periode.dateDebut = null;
      this.periode.dateFin = null;
    }
    this.getInstance(this.idFenetrePeriode).setDonnees(this.periode);
    this.getInstance(this.idFenetrePeriode).afficher();
  }
  setParametresGeneraux() {
    this.avecBandeau = true;
    this.GenreStructure = EStructureAffichage.Autre;
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push(
      '<div class="PageOffreStage-conteneur interface_affV">',
      `<div class="conteneur-gauche">`,
      `<div id="${this.idFiltre}_div" class="filtre-conteneur">${_composeFiltre.call(this)}</div>`,
      `<div id="${this.getInstance(this.identListeEntreprises).getNom()}" class="liste-offres" tabindex="-1"></div>`,
      "</div>",
      '<div class="interface_affV_client overflow-auto">',
      `<div id="${this.getInstance(this.identDetailOffreDeStage).getNom()}" class="detail-offre" tabindex="-1"></div>`,
      "</div>",
      "</div>",
    );
    return H.join("");
  }
  setDonnees(aListeEntreprise) {
    this.listeEntreprises = aListeEntreprise;
    if (this.listeEntreprises) {
      let lEntreprise;
      this.filtreActivite = new ObjetListeElements();
      this.filtreSeulementAvecOffres = false;
      this.filtreNbrSemaines = 0;
      this.listeActivites = new ObjetListeElements();
      let LActiviteAjoute = false;
      for (
        let i = 0, nbEntreprises = this.listeEntreprises.count();
        i < nbEntreprises;
        i++
      ) {
        lEntreprise = this.listeEntreprises.get(i);
        if (lEntreprise.activite) {
          const lActivite = MethodesObjet.dupliquer(lEntreprise.activite);
          if (
            this.listeActivites.getIndiceParNumeroEtGenre(
              lActivite.getNumero(),
            ) === undefined
          ) {
            lActivite.Position = 2;
            this.listeActivites.addElement(lActivite);
          }
        } else {
          if (!LActiviteAjoute) {
            const lAucuneActivite = new ObjetElement(
              GTraductions.getValeur("OffreStage.ActiviteNonDefini"),
              null,
              0,
              1,
            );
            lAucuneActivite.filtreAucun = true;
            this.listeActivites.addElement(lAucuneActivite);
            LActiviteAjoute = true;
          }
        }
        lEntreprise.visible = true;
      }
      this.listeActivites.add(
        new ObjetElement(
          '<div class="Gras">' +
            GTraductions.getValeur("OffreStage.touteLesActivites") +
            "</div>",
          -1,
          -1,
          0,
        ),
      );
      this.listeActivites.trier();
      _trierListe(this.listeEntreprises);
      this.getInstance(this.identFiltreActivite).setDonnees(
        this.listeActivites,
      );
    }
    this.getInstance(this.identListeEntreprises).setDonnees(
      new DonneesListe_ListeEntreprises(this.listeEntreprises),
    );
    $("#" + this.idFiltreNbSemaines.escapeJQ()).on(
      "keyup",
      null,
      { aObjet: this },
      (event) => {
        if (event.which === ToucheClavier.RetourChariot) {
          event.data.aObjet._setFocusListeOffres();
        }
        event.stopPropagation();
      },
    );
    $("#" + this.idFiltreRechercheTextfield.escapeJQ()).on(
      "keyup",
      null,
      { aObjet: this },
      (event) => {
        if (event.which === ToucheClavier.RetourChariot) {
          event.data.aObjet._setFocusListeOffres();
        }
        event.stopPropagation();
      },
    );
    $("#" + this.idFiltreSujetTextfield.escapeJQ()).on(
      "keyup",
      null,
      { aObjet: this },
      (event) => {
        if (event.which === ToucheClavier.RetourChariot) {
          event.data.aObjet._setFocusListeOffres();
        }
        event.stopPropagation();
      },
    );
  }
  _setFocusListeOffres() {
    $(
      "#" + this.getInstance(this.identListeEntreprises).getNom().escapeJQ(),
    ).focus();
  }
}
function _initListe(aInstance) {
  const lObjOptionsListe = {
    skin: ObjetListe.skin.flatDesign,
    colonnes: [{ taille: "100%" }],
    messageContenuVide: GTraductions.getValeur("OffreStage.aucuneEntreprise"),
    forcerOmbreScrollTop: true,
  };
  if (this.options.largeurImage !== undefined) {
    lObjOptionsListe.largeurImage = this.options.largeurImage;
  }
  aInstance.setOptionsListe(lObjOptionsListe);
}
function _initDetail(aInstance) {
  aInstance.setOptions({
    avecPeriode: this.options.avecPeriode,
    avecPeriodeUnique: this.options.avecPeriodeUnique,
    avecGestionPJ: this.options.avecGestionPJ,
    genreRessourcePJ: this.options.genreRessourcePJ,
  });
}
function _initFenetrePeriode(aInstance) {
  aInstance.setOptionsFenetre({ largeur: 350 });
}
function _evnSelectListeEntreprise(aParametres) {
  this.entrepriseSelectionnee = this.listeEntreprises.get(aParametres.ligne);
  this.getInstance(this.identDetailOffreDeStage).setDonnees({
    entreprise: this.entrepriseSelectionnee,
  });
}
function _evnFiltreActivite(aParams) {
  if (
    EGenreEvenementObjetSaisie.selection === aParams.genreEvenement &&
    aParams.listeSelections
  ) {
    this.filtreActivite = aParams.listeSelections;
    _evnFiltre.call(this);
  }
}
function _evnFiltre() {
  const lArrActivites = this.filtreActivite.getTableauNumeros();
  const lEstActiviteVide =
    this.filtreActivite.getIndiceElementParFiltre((aElement) => {
      return aElement.filtreAucun;
    }) > -1;
  this.listeEntreprises.parcourir((aEntreprise) => {
    let lFiltreRecherche = true;
    if (this.recherche && this.recherche.length > 1) {
      lFiltreRecherche = false;
      RechercheTexte.getTabRechercheTexteNormalize(this.recherche).forEach(
        (aSearch, aIndex) => {
          const lRegex = new RegExp(aSearch, "i");
          if (
            ((aEntreprise.ville && lRegex.test(aEntreprise.ville)) ||
              (aEntreprise.getLibelle() &&
                lRegex.test(aEntreprise.getLibelle())) ||
              (aEntreprise.nomCommercial &&
                lRegex.test(aEntreprise.nomCommercial)) ||
              (aEntreprise.codePostal &&
                lRegex.test(aEntreprise.codePostal))) &&
            (aIndex === 0 || lFiltreRecherche)
          ) {
            lFiltreRecherche = true;
          } else {
            lFiltreRecherche = false;
          }
        },
      );
    }
    const lFiltreActivite =
      lArrActivites.length === 0 ||
      (aEntreprise &&
        aEntreprise.activite &&
        $.inArray(aEntreprise.activite.getNumero(), lArrActivites) > -1) ||
      (lEstActiviteVide &&
        aEntreprise &&
        (!aEntreprise.activite || !aEntreprise.activite.existeNumero()));
    const lFiltreSeulementAvecOffres =
      !this.filtreSeulementAvecOffres ||
      (aEntreprise.listeOffresStages &&
        aEntreprise.listeOffresStages.count() > 0);
    const lNbOffresStages = aEntreprise.listeOffresStages
      ? aEntreprise.listeOffresStages.count()
      : 0;
    let lOffre = null;
    let lFiltreSujet = true;
    if (this.sujet && this.sujet.length > 1) {
      lFiltreSujet = false;
      RechercheTexte.getTabRechercheTexteNormalize(this.sujet).forEach(
        (aSearch, aIndex) => {
          const lRegex = new RegExp(aSearch, "i");
          lOffre = null;
          let lEstRechercheBonne = false;
          for (let k = 0; k < lNbOffresStages; k++) {
            lOffre = aEntreprise.listeOffresStages.get(k);
            lEstRechercheBonne =
              lOffre.sujet && lRegex.test(lOffre.sujet.getLibelle());
            if (lEstRechercheBonne && (aIndex === 0 || lFiltreSujet)) {
              lFiltreSujet = true;
              break;
            }
          }
          if (lFiltreSujet && !lEstRechercheBonne) {
            lFiltreSujet = false;
          }
        },
      );
    }
    let lFiltreNbSemaines = true;
    if (this.filtreNbrSemaines > 0) {
      lFiltreNbSemaines = false;
      lOffre = null;
      for (let m = 0; m < lNbOffresStages; m++) {
        lOffre = aEntreprise.listeOffresStages.get(m);
        if (
          lOffre.dureeEnJours &&
          lOffre.dureeEnJours >= this.filtreNbrSemaines * 7
        ) {
          lFiltreNbSemaines = true;
          break;
        }
      }
    }
    let lFiltrePeriode = true;
    if (
      this.options.avecPeriode &&
      this.options.avecFiltrePeriode &&
      this.periode &&
      this.periode.dateDebut &&
      this.periode.dateDebut.getTime() > 0 &&
      this.periode.dateFin
    ) {
      lFiltrePeriode = false;
      lOffre = null;
      for (let n = 0; n < lNbOffresStages; n++) {
        lOffre = aEntreprise.listeOffresStages.get(n);
        if (
          !lOffre.periode ||
          (!lOffre.periode.dateDebut && !lOffre.periode.dateFin)
        ) {
          lFiltrePeriode = true;
          break;
        } else if (lOffre.periode.dateDebut && lOffre.periode.dateFin) {
          if (
            lOffre.periode.dateDebut <= this.periode.dateDebut &&
            lOffre.periode.dateFin >= this.periode.dateFin
          ) {
            lFiltrePeriode = true;
            break;
          }
        }
      }
    }
    aEntreprise.visible =
      lFiltreRecherche &&
      lFiltreActivite &&
      lFiltreSeulementAvecOffres &&
      lFiltreSujet &&
      lFiltreNbSemaines &&
      lFiltrePeriode;
    if (
      this.entrepriseSelectionnee &&
      this.entrepriseSelectionnee === aEntreprise &&
      !aEntreprise.visible
    ) {
      this.entrepriseSelectionnee = null;
      this.getInstance(this.identListeEntreprises).selectionnerLigne({
        deselectionnerTout: true,
        ligne: -1,
      });
    }
  });
  this.getInstance(this.identListeEntreprises).actualiser(true);
  this.getInstance(this.identDetailOffreDeStage).setDonnees({
    entreprise: this.entrepriseSelectionnee,
  });
}
function _evntFenetrePeriode(aNumeroBouton, aEstModif) {
  let lLibelle = "";
  if (aEstModif) {
    if (!!this.periode.dateDebut) {
      if (GDate.estDateEgale(this.periode.dateDebut, this.periode.dateFin)) {
        lLibelle =
          GTraductions.getValeur("Le") +
          " " +
          GDate.formatDate(this.periode.dateDebut, "%JJ/%MM/%AA");
      } else {
        lLibelle =
          GTraductions.getValeur("Du") +
          " " +
          GDate.formatDate(this.periode.dateDebut, "%JJ/%MM/%AA");
        lLibelle +=
          " " +
          GTraductions.getValeur("Au") +
          " " +
          GDate.formatDate(this.periode.dateFin, "%JJ/%MM/%AA");
      }
    }
    this.periode.setLibelle(lLibelle);
    _evnFiltre.bind(this)();
  }
}
function _composeFiltre() {
  const H = [];
  H.push(
    `<div class="fields-wrapper">\n            <div class="input-field">\n              <input type="text" id="${this.idFiltreRechercheTextfield}" ie-model="recherche" class="round-style recherche" placeholder="${GTraductions.getValeur("OffreStage.titre.Recherche")}"/>\n            </div>\n            <div class="input-field">\n              <input type="text" id="${this.idFiltreSujetTextfield}" ie-model="sujet" class="round-style sujet" placeholder="${GTraductions.getValeur("OffreStage.titre.Sujet")}"/>\n            </div>\n            <div class="input-field">\n              <label>${GTraductions.getValeur("OffreStage.titre.Activite")}</label>\n              <div id="${this.getInstance(this.identFiltreActivite).getNom()}"></div>\n            </div>\n          </div>`,
  );
  H.push(`<div class="fields-wrapper">`);
  if (this.options.avecPeriode && this.options.avecFiltrePeriode) {
    H.push(
      `<div class="input-field">\n              <label>${GTraductions.getValeur("OffreStage.titre.Periode")}</label>\n                <div ie-event="mouseenter-mouseleave->surZoneMouseenterMouseleave" class="like-input as-calendar" style="background-color:#fff;">\n                    <div class="periode" ie-texte="getPeriode" ie-event="keyup-click->eventPeriode"></div>\n                    <i ie-event="keyup-click->eventPeriode" class="icon_calendar_empty"></i>\n                </div>\n            </div>`,
    );
  }
  H.push(
    `  <div class="input-field">\n              <label for="${this.idFiltreNbSemaines}">${GTraductions.getValeur("OffreStage.dureeMinimale")}</label>\n              <input type="text" ie-model="nbSemaines" ie-mask="/[^0-9]/i" id="${this.idFiltreNbSemaines}" size="2" maxlength="2" class="round-style"/>\n              \n            </div>\n        </div>`,
  );
  H.push(`<div class="fields-wrapper input-field">\n            <ie-checkbox ie-textleft ie-model="cbFiltreSeulementAvecOffres">${GTraductions.getValeur("OffreStage.titre.FiltreSeulementAvecOffre")}
          </div>`);
  return H.join("");
}
function _trierListe(aListe) {
  aListe.setTri([ObjetTri.init("Position"), ObjetTri.init("Libelle")]);
  aListe.trier();
}
module.exports = { PageOffresStages };
