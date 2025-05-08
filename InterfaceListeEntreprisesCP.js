exports.InterfaceListeEntreprisesCP = void 0;
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const ObjetElement_1 = require("ObjetElement");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const MethodesObjet_1 = require("MethodesObjet");
const DonneesListe_ListeEntreprises_1 = require("DonneesListe_ListeEntreprises");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTri_1 = require("ObjetTri");
const ObjetTabOnglets_1 = require("ObjetTabOnglets");
const ObjetDetailOffreStage_1 = require("ObjetDetailOffreStage");
const RechercheTexte_1 = require("RechercheTexte");
class InterfaceListeEntreprisesCP extends InterfacePage_Mobile_1.InterfacePage_Mobile {
  constructor(...aParams) {
    super(...aParams);
    this.options = {
      avecPeriode: false,
      avecFiltrePeriode: false,
      avecPeriodeUnique: true,
      avecGestionPJ: false,
      genreRessourcePJ: -1,
      largeurImage: 0,
    };
    this.filtre =
      DonneesListe_ListeEntreprises_1.DonneesListe_ListeEntreprises.getFiltresParDefaut();
    this.GenreStructure =
      Enumere_StructureAffichage_1.EStructureAffichage.Autre;
  }
  construireInstances() {
    this.identListeEntreprises = this.add(
      ObjetListe_1.ObjetListe,
      this._evnSelectListeEntreprise,
      this._initListe,
    );
    this.identDetailOffreDeStage = this.add(
      ObjetDetailOffreStage_1.ObjetDetailOffreStage,
      null,
      this._initDetail,
    );
    this.getInstance(this.identDetailOffreDeStage).setVisible(false);
    this.identTabs = this.add(
      ObjetTabOnglets_1.ObjetTabOnglets,
      this._evntModeAffDetailOffreStage,
      (aInstance) => {
        aInstance.setOptionsTabOnglets({ afficherOngletUnique: true });
      },
    );
    this.AddSurZone = [
      { html: this._composeBandeau(), controleur: this.controleur },
      {
        html:
          '<div id="' + this.getInstance(this.identTabs).getNom() + '"></div>',
      },
    ];
    this.IdPremierElement = this.identListeEntreprises.toString();
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      afficherBandeau() {
        return aInstance.getInstance(aInstance.identDetailOffreDeStage).Visible;
      },
      retour: {
        event() {
          $(
            "#" +
              aInstance
                .getInstance(aInstance.identListeEntreprises)
                .getNom()
                .escapeJQ(),
          ).show();
          aInstance
            .getInstance(aInstance.identDetailOffreDeStage)
            .setVisible(false);
          $(
            "#" +
              aInstance.getInstance(aInstance.identTabs).getNom().escapeJQ(),
          ).hide();
          aInstance
            .getInstance(aInstance.identListeEntreprises)
            .selectionnerLigne({ deselectionnerTout: true, ligne: -1 });
        },
      },
      nomEntrepriseHTML() {
        const H = [];
        if (aInstance.entrepriseSelectionnee) {
          H.push(aInstance.entrepriseSelectionnee.getLibelle() || "");
        }
        return H.join("");
      },
    });
  }
  construireStructureAffichageAutre() {
    return [
      '<div class="PageOffreStage-conteneur">',
      '<div class="liste-offres" id="',
      this.getInstance(this.identListeEntreprises).getNom(),
      '"></div>',
      '<div id="',
      this.getInstance(this.identDetailOffreDeStage).getNom(),
      '" class="detail-offre" tabindex="-1"></div>',
      "</div>",
    ].join("");
  }
  traiterDonnees() {
    if (this.listeEntreprises) {
      let lEntreprise;
      this.listeActivites = new ObjetListeElements_1.ObjetListeElements();
      let LActiviteAjoute = false;
      for (
        let i = 0, nbEntreprises = this.listeEntreprises.count();
        i < nbEntreprises;
        i++
      ) {
        lEntreprise = this.listeEntreprises.get(i);
        if (lEntreprise.activite) {
          const lActivite = MethodesObjet_1.MethodesObjet.dupliquer(
            lEntreprise.activite,
          );
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
            const lAucuneActivite = new ObjetElement_1.ObjetElement(
              ObjetTraduction_1.GTraductions.getValeur(
                "OffreStage.ActiviteNonDefini",
              ),
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
        new ObjetElement_1.ObjetElement(
          '<div class="Gras">' +
            ObjetTraduction_1.GTraductions.getValeur(
              "OffreStage.touteLesActivites",
            ) +
            "</div>",
          -1,
          -1,
          0,
        ),
      );
      this.listeActivites.trier();
      this._trierListe(this.listeEntreprises);
    }
    this.getInstance(this.identListeEntreprises).setDonnees(
      new DonneesListe_ListeEntreprises_1.DonneesListe_ListeEntreprises(
        this.listeEntreprises,
      ).setOptions({
        filtre: this.filtre,
        optionsInterface: this.options,
        listeActivites: this.listeActivites,
        evnFiltre: this._evnFiltre.bind(this),
      }),
    );
    $(
      "#" + this.getInstance(this.identListeEntreprises).getNom().escapeJQ(),
    ).show();
    this.getInstance(this.identDetailOffreDeStage).setVisible(false);
    $("#" + this.getInstance(this.identTabs).getNom().escapeJQ()).hide();
  }
  _composeBandeau() {
    const H = [];
    H.push(
      '<div ie-if="afficherBandeau" class="Bandeau-filtre">',
      '<ie-btnicon class="icon_retour_mobile" title="',
      ObjetTraduction_1.GTraductions.getValeur("OffreStage.retourListe"),
      '" ie-model="retour"></ie-btnicon>',
      '<h3 ie-html="nomEntrepriseHTML" class="bandeau-nom"></h3>',
      "</div>",
    );
    return H.join("");
  }
  _initListe(aInstance) {
    const lObjOptionsListe = {
      skin: ObjetListe_1.ObjetListe.skin.flatDesign,
      colonnes: [{ taille: "100%" }],
      messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
        "OffreStage.aucuneEntreprise",
      ),
      boutons: [
        { genre: ObjetListe_1.ObjetListe.typeBouton.rechercher },
        { genre: ObjetListe_1.ObjetListe.typeBouton.filtrer },
      ],
    };
    if (this.options.largeurImage !== undefined) {
      lObjOptionsListe.largeurImage = this.options.largeurImage;
    }
    aInstance.setOptionsListe(lObjOptionsListe);
  }
  _evnSelectListeEntreprise(aParametres) {
    this.entrepriseSelectionnee = this.listeEntreprises.get(aParametres.ligne);
    $(
      "#" + this.getInstance(this.identListeEntreprises).getNom().escapeJQ(),
    ).hide();
    this.listeTabs = new ObjetListeElements_1.ObjetListeElements();
    const lDetailStage = new ObjetElement_1.ObjetElement({
      Libelle: ObjetTraduction_1.GTraductions.getValeur("OffreStage.details"),
      Genre: 0,
    });
    this.listeTabs.addElement(lDetailStage);
    const lAvecOffre =
      !!this.entrepriseSelectionnee.listeOffresStages &&
      !!this.entrepriseSelectionnee.listeOffresStages.count();
    let lPourvu = true;
    if (lAvecOffre) {
      this.entrepriseSelectionnee.listeOffresStages.parcourir((aOffre) => {
        if (aOffre.nbPourvus !== aOffre.nbPropose) {
          lPourvu = false;
        }
      });
      const lOffreStage = new ObjetElement_1.ObjetElement({
        Libelle:
          ObjetTraduction_1.GTraductions.getValeur(
            "OffreStage.offres",
          ).ucfirst() +
          (lAvecOffre
            ? " (" + this.entrepriseSelectionnee.listeOffresStages.count() + ")"
            : ""),
        Genre: 1,
      });
      this.listeTabs.addElement(lOffreStage);
    }
    const lAvecNonPourvu = lAvecOffre && !lPourvu;
    this.getInstance(this.identTabs).setDonnees(this.listeTabs);
    $("#" + this.getInstance(this.identTabs).getNom().escapeJQ()).show();
    this.getInstance(this.identTabs).selectOnglet(
      lAvecOffre && lAvecNonPourvu ? 1 : 0,
    );
  }
  _initDetail(aInstance) {
    aInstance.setOptions({
      avecPeriode: this.options.avecPeriode,
      avecPeriodeUnique: !!this.options.avecPeriodeUnique,
      avecGestionPJ: this.options.avecGestionPJ,
    });
  }
  _evnFiltre() {
    const lArrActivites = this.filtre.activite.getTableauNumeros();
    const lEstActiviteVide =
      this.filtre.activite.getIndiceElementParFiltre((aElement) => {
        return aElement.filtreAucun;
      }) > -1;
    this.listeEntreprises.parcourir((aEntreprise) => {
      const lFiltreActivite =
        lArrActivites.length === 0 ||
        (aEntreprise &&
          aEntreprise.activite &&
          lArrActivites.includes(aEntreprise.activite.getNumero())) ||
        (lEstActiviteVide &&
          aEntreprise &&
          (!aEntreprise.activite || !aEntreprise.activite.existeNumero()));
      const lFiltreSeulementAvecOffres =
        !this.filtre.seulementAvecOffres ||
        (aEntreprise.listeOffresStages &&
          aEntreprise.listeOffresStages.count() > 0);
      const lNbOffresStages = aEntreprise.listeOffresStages
        ? aEntreprise.listeOffresStages.count()
        : 0;
      let lFiltreSujet = true;
      if (this.filtre.sujet) {
        lFiltreSujet = false;
        RechercheTexte_1.RechercheTexte.getTabRechercheTexteNormalize(
          this.filtre.sujet,
        ).forEach((aSearch, aIndex) => {
          const lRegex = new RegExp(aSearch, "i");
          let lEstRechercheBonne = false;
          for (let k = 0; k < lNbOffresStages; k++) {
            const lOffre = aEntreprise.listeOffresStages.get(k);
            if (lOffre) {
              lEstRechercheBonne =
                lOffre.sujet && lRegex.test(lOffre.sujet.getLibelle());
              if (lEstRechercheBonne && (aIndex === 0 || lFiltreSujet)) {
                lFiltreSujet = true;
                break;
              }
            }
          }
          if (lFiltreSujet && !lEstRechercheBonne) {
            lFiltreSujet = false;
          }
        });
      }
      let lFiltreNbSemaines = true;
      if (this.filtre.nbrSemaines > 0) {
        lFiltreNbSemaines = false;
        for (let m = 0; m < lNbOffresStages; m++) {
          const lOffre = aEntreprise.listeOffresStages.get(m);
          if (lOffre) {
            if (
              lOffre.dureeEnJours &&
              lOffre.dureeEnJours >= this.filtre.nbrSemaines * 7
            ) {
              lFiltreNbSemaines = true;
              break;
            }
          }
        }
      }
      let lFiltrePeriode = true;
      if (
        this.options.avecPeriode &&
        this.options.avecFiltrePeriode &&
        this.filtre.periode &&
        this.filtre.periode.Actif &&
        this.filtre.periode.dateDebut &&
        this.filtre.periode.dateDebut.getTime() > 0 &&
        this.filtre.periode.dateFin
      ) {
        lFiltrePeriode = false;
        for (let n = 0; n < lNbOffresStages; n++) {
          const lOffre = aEntreprise.listeOffresStages.get(n);
          if (lOffre) {
            if (
              !lOffre.periode ||
              (!lOffre.periode.dateDebut && !lOffre.periode.dateFin)
            ) {
              lFiltrePeriode = true;
              break;
            } else if (lOffre.periode.dateDebut && lOffre.periode.dateFin) {
              if (
                lOffre.periode.dateDebut <= this.filtre.periode.dateDebut &&
                lOffre.periode.dateFin >= this.filtre.periode.dateFin
              ) {
                lFiltrePeriode = true;
                break;
              }
            }
          }
        }
      }
      aEntreprise.visible =
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
  }
  _trierListe(aListe) {
    aListe.setTri([
      ObjetTri_1.ObjetTri.init("Position"),
      ObjetTri_1.ObjetTri.init("Libelle"),
    ]);
    aListe.trier();
  }
  _evntModeAffDetailOffreStage(aParam) {
    if (aParam) {
      this.getInstance(this.identDetailOffreDeStage).setDonnees(
        { entreprise: this.entrepriseSelectionnee },
        aParam.getGenre(),
      );
      this.getInstance(this.identDetailOffreDeStage).setVisible(true);
    }
  }
}
exports.InterfaceListeEntreprisesCP = InterfaceListeEntreprisesCP;
