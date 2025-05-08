const { GDate } = require("ObjetDate.js");
const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { tag } = require("tag.js");
const { UtilitaireDocument } = require("UtilitaireDocument.js");
const {
  TypeConsultationDocumentCasier,
} = require("TypeConsultationDocumentCasier.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetElement } = require("ObjetElement.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const {
  UtilitaireDocumentATelecharger,
} = require("UtilitaireDocumentATelecharger.js");
const { GUID } = require("GUID.js");
class DonneesListe_Casier extends ObjetDonneesListeFlatDesign {
  constructor(aDonnees, aParam) {
    super(aDonnees);
    this.ids = { labelNatures: GUID.getId(), labelClasse: GUID.getId() };
    this.pere = aParam.pere;
    this.evenement = aParam.evenement;
    this.avecFct = aParam.avecFct;
    this.typeConsultation = aParam.typeConsultation;
    this.listeCategories = MethodesObjet.dupliquer(aParam.listeCategories);
    this.listeClasses = MethodesObjet.dupliquer(aParam.listeClasses);
    this.avecToutesLesClasses = aParam.avecToutesLesClasses;
    this.classeSelectionne = aParam.classeSelectionne;
    this.rubriqueCasier = aParam.rubriqueCasier;
    this.callbackCollecte = aParam.callbackCollecte;
    this.setClasseSelectionne = aParam.setClasseSelectionne;
    this.getFiltreParDefaut = aParam.getFiltreParDefaut;
    this.setFiltre = aParam.setFiltre;
    this.getfiltre = aParam.getfiltre;
    this.setIndiceClasse = aParam.setIndiceClasse;
    this.setIndiceCategorie = aParam.setIndiceCategorie;
    this.setCbNonLu = aParam.setCbNonLu;
    const lEstCollecte = aParam.estCollecte;
    const lEstCollecteParDocument = aParam.estCollecteParDocument;
    const lEstCollecteParEleve = lEstCollecte && !lEstCollecteParDocument;
    if (this.listeClasses) {
      this.listeClasses.trier();
    }
    if (this.listeCategories.count() > 0) {
      this.listeCategories.insererElement(
        new ObjetElement({
          estTotal: true,
          Libelle: GTraductions.getValeur("Casier.toutes"),
        }),
        0,
      );
    }
    if (this.avecToutesLesClasses && this.listeClasses.count() > 0) {
      this.listeClasses.insererElement(
        new ObjetElement({
          estTotal: true,
          Libelle: GTraductions.getValeur("Casier.toutes"),
        }),
        0,
      );
    }
    const lEstReception =
      this.typeConsultation ===
      TypeConsultationDocumentCasier.CoDC_Destinataire;
    const lEstDiffusion = [
      TypeConsultationDocumentCasier.CoDC_Depositaire,
      TypeConsultationDocumentCasier.CoDC_DepResponsable,
    ].includes(this.typeConsultation);
    this.visu = {
      memo: lEstReception,
      date: lEstReception,
      destinataire: lEstDiffusion,
      iconModifiable: lEstReception,
      classes: lEstCollecte,
      echeance: lEstCollecte,
      nbrCollecte: lEstCollecte,
      dateDeNaissance: lEstCollecteParEleve,
    };
    this.inputMAJ = aParam.inputMAJ;
    this.setOptions({
      avecEvnt_SelectionClick: true,
      avecEvnt_Creation: true,
      avecEvnt_ApresEdition: true,
    });
    this.optionsCasier = {
      avectri: true,
      avecFiltreCategorie: true,
      avecFiltreNonLus: false,
      avecFiltreClasse: false,
      avecComboClasse: false,
      avecCouleurNature: false,
      avecIconeFormatFoc: true,
    };
    this.filtre = this.getfiltre();
  }
  setOptionsCasier(aOptionsCasier) {
    $.extend(this.optionsCasier, aOptionsCasier);
  }
  getTitreZonePrincipale(aParams) {
    let lLibelle = aParams.article.getLibelle();
    if (aParams.article.estUnDeploiement) {
      const lListeEnfantsAvecLaMemeCategorie = this.Donnees.getListeElements(
        (aI) => {
          let lValue = false;
          if (
            aI.categorie.getNumero() ===
              aParams.article.categorie.getNumero() &&
            !aI.estUnDeploiement
          ) {
            lValue = true;
            if (
              this.optionsCasier.avecFiltreNonLus &&
              this.filtre.cbNonLu &&
              !aI.estNonLu
            ) {
              lValue = false;
            }
          }
          return lValue;
        },
      );
      const lCompteur = lListeEnfantsAvecLaMemeCategorie.count();
      lLibelle = tag(
        "div",
        { class: ["flex-contain", "flex-gap"] },
        UtilitaireDocumentATelecharger.getIconListeRubrique(aParams.article),
        tag(
          "div",
          { class: "ie-titre-couleur-lowercase Gras" },
          lLibelle +
            ` ${MethodesObjet.isNumeric(lCompteur) ? `(${lCompteur})` : ""}`,
        ),
      );
    }
    return lLibelle;
  }
  getAriaLabelZoneCellule(aParams, aZone) {
    if (aZone === ObjetDonneesListeFlatDesign.ZoneCelluleFlatDesign.titre) {
      return aParams.article.estUnDeploiement
        ? aParams.article.getLibelle()
        : GTraductions.getValeur("Casier.Cmd.Telecharger") +
            " " +
            aParams.article.getLibelle();
    }
  }
  avecBoutonActionLigne(aParams) {
    return (
      this.options.avecBoutonActionLigne && !aParams.article.estUnDeploiement
    );
  }
  estLigneOff(aParams) {
    if (aParams.article.estNonLu === false || aParams.article.plusConsultable) {
      return true;
    }
    return false;
  }
  avecSeparateurLigneHautFlatdesign(aParamsCellule, aParamsCellulePrec) {
    return (
      super.avecSeparateurLigneHautFlatdesign(
        aParamsCellule,
        aParamsCellulePrec,
      ) && !aParamsCellulePrec.article.estUnDeploiement
    );
  }
  getHintForce(aParams) {
    if (aParams.article.plusConsultable) {
      return aParams.article.hintPersonnel;
    }
  }
  getZoneMessage(aParams) {
    if (aParams.article.estUnDeploiement) {
      return;
    }
    const H = [];
    if (this.visu.date) {
      if (aParams.article.infoDepositaire) {
        H.push(
          tag(
            "div",
            { class: "ie-sous-titre" },
            GTraductions.getValeur("Casier.dateDestinataire", [
              GDate.formatDate(aParams.article.date, "%J %MMM"),
              aParams.article.infoDepositaire,
            ]),
          ),
        );
      } else {
        H.push(
          tag(
            "div",
            { class: "ie-sous-titre" },
            GDate.formatDate(aParams.article.date, "%J %MMM"),
          ),
        );
      }
    }
    if (this.visu.classes) {
      if (aParams.article.classes) {
        H.push(
          tag(
            "div",
            { class: "ie-sous-titre" },
            GTraductions.getValeur("Casier.classes") +
              " " +
              aParams.article.classes,
          ),
        );
      }
    }
    if (this.visu.dateDeNaissance) {
      if (aParams.article.dateDeNaissance) {
        H.push(
          tag(
            "div",
            { class: "ie-sous-titre" },
            GTraductions.getValeur("Casier.neeLe", [
              GDate.formatDate(aParams.article.dateDeNaissance, "%J %MMM"),
            ]),
          ),
        );
      }
    }
    if (this.visu.echeance) {
      let lString = "";
      if (aParams.article.depotEtablissement) {
        lString = GTraductions.getValeur("Casier.depotEtablissement");
      } else if (aParams.article.sansDateLimite) {
        lString = GTraductions.getValeur("Casier.depotSansLimite");
      } else if (aParams.article.dateEcheance) {
        lString = GTraductions.getValeur("Casier.depotJusquau", [
          GDate.formatDate(aParams.article.dateEcheance, "%J %MMM"),
        ]);
      }
      if (lString !== "") {
        H.push(tag("div", { class: "ie-sous-titre" }, lString));
      }
    }
    if (this.visu.destinataire) {
      const lDestinataires = [];
      switch (this.typeConsultation) {
        case TypeConsultationDocumentCasier.CoDC_Depositaire:
          if (aParams.article.infoPersonnel) {
            const lCleTrad = IE.estMobile
              ? GTraductions.getValeur("Casier.pers")
              : GTraductions.getValeur("Casier.personnels");
            lDestinataires.push(
              `${lCleTrad} : ${aParams.article.infoPersonnel}`,
            );
          }
          if (aParams.article.infoProfesseur) {
            const lCleTrad = IE.estMobile
              ? GTraductions.getValeur("Casier.profs")
              : GTraductions.getValeur("Casier.professeurs");
            lDestinataires.push(
              `${lCleTrad} : ${aParams.article.infoProfesseur}`,
            );
          }
          if (aParams.article.infoMaitreDeStage) {
            const lCleTrad = IE.estMobile
              ? GTraductions.getValeur("Casier.mStage")
              : GTraductions.getValeur("Casier.maitresDeStage");
            lDestinataires.push(
              `${lCleTrad} : ${aParams.article.infoMaitreDeStage}`,
            );
          }
          if (aParams.article.infoEquipePedagogique) {
            const lCleTrad = IE.estMobile
              ? GTraductions.getValeur("Casier.peda")
              : GTraductions.getValeur("Casier.equipePedagogique");
            lDestinataires.push(
              `${lCleTrad} : ${aParams.article.infoEquipePedagogique}`,
            );
          }
          break;
        case TypeConsultationDocumentCasier.CoDC_DepResponsable:
          if (aParams.article.infoResponsable) {
            lDestinataires.push(
              `${GTraductions.getValeur("Casier.responsables")} : ${aParams.article.infoResponsable}`,
            );
          }
          break;
        default:
          break;
      }
      let lStrPublication = "";
      if (aParams.article.dateDebut) {
        const lDate = GDate.formatDate(aParams.article.dateDebut, "%J %MMM");
        if (aParams.article.dateFin) {
          lStrPublication += GTraductions.getValeur("Casier.du") + " " + lDate;
        } else {
          lStrPublication += GTraductions.getValeur("Casier.diffuseLe", [
            lDate,
          ]);
        }
      }
      if (aParams.article.dateFin) {
        let lStr =
          GTraductions.getValeur("Casier.au") +
          " " +
          GDate.formatDate(aParams.article.dateFin, "%J %MMM");
        if (aParams.article.dateDebut) {
          lStr = lStr.toLowerCase();
        }
        lStrPublication += " " + lStr;
      }
      if (lStrPublication !== "") {
        H.push(tag("div", { class: "ie-sous-titre" }, lStrPublication));
      }
      const lAvecDestinataire = lDestinataires.length > 0;
      if (lAvecDestinataire) {
        H.push(
          tag("div", { class: "ie-sous-titre" }, lDestinataires.join(" - ")),
        );
      }
    }
    if (
      aParams.article.plusConsultable &&
      aParams.article.hintPersonnel &&
      aParams.article.hintPersonnel.length > 0
    ) {
      H.push(
        tag(
          "div",
          { class: ["text-util-rouge-foncee", "m-top"] },
          aParams.article.hintPersonnel,
        ),
      );
    }
    return H.join("");
  }
  getZoneComplementaire(aParams) {
    const H = [];
    H.push(`<div class="flex-contain flex-gap flex-center">`);
    if (
      this.visu.iconModifiable &&
      aParams.article.estModifiableParDestinataires
    ) {
      H.push(
        tag("i", {
          class: "icon_pencil i-small theme_color_moyen1",
          title: GTraductions.getValeur(
            "Casier.hintDocumentModifiableDestinataire",
          ),
        }),
      );
    }
    if (aParams.article.memo && aParams.article.memo.length > 0) {
      H.push(
        tag("i", {
          class: "icon_post_it_rempli theme_color_moyen1 i-medium",
          title: GTraductions.getValeur("Casier.memo"),
        }),
      );
    }
    if (this.visu.nbrCollecte) {
      const lClasseSelectionne = this.listeClasses.get(
        this.filtre.indiceClasse,
      );
      let lCompteur = "";
      if (aParams.article.listeDocuments) {
        const lNombreDocTotal = aParams.article.listeDocuments.count();
        if (lNombreDocTotal > 0) {
          const lNombreDocDepose = aParams.article.listeDocuments
            .getListeElements(
              (aDoc) => aDoc.documentsEleve && aDoc.documentsEleve.count() > 0,
            )
            .count();
          lCompteur = `${lNombreDocDepose}/${lNombreDocTotal}`;
        }
      } else if (
        aParams.article.compteur &&
        lClasseSelectionne &&
        lClasseSelectionne.estTotal
      ) {
        lCompteur = aParams.article.compteur;
      }
      if (lCompteur) {
        H.push(tag("span", { class: "theme_color_moyen1" }, lCompteur));
      }
    }
    H.push(`</div>`);
    return H.join("");
  }
  getZoneGauche(aParams) {
    if (!aParams.article.estUnDeploiement) {
      if (this.optionsCasier.avecIconeFormatFoc) {
        return tag("i", {
          class: [
            "i-medium",
            UtilitaireDocument.getIconFromFileName(
              aParams.article.getLibelle(),
            ),
          ],
        });
      }
    }
    return "";
  }
  avecEvenementSelection(aParams) {
    return !!aParams.article && !aParams.article.estUnDeploiement;
  }
  avecEvenementSelectionClick(aParams) {
    return this.avecEvenementSelection(aParams);
  }
  avecMenuContextuel(aParams) {
    return aParams.ligne >= 0;
  }
  initialisationObjetContextuel(aParametres) {
    if (!aParametres.menuContextuel || aParametres.article.estUnDeploiement) {
      return;
    }
    if (
      aParametres.article.memo &&
      aParametres.article.memo.length > 0 &&
      this.avecFct.consulterLeMemo
    ) {
      aParametres.menuContextuel.add(
        GTraductions.getValeur("Casier.consulterLeMemo"),
        true,
        () =>
          this.evenementMenuContextuel({
            numeroMenu: DonneesListe_Casier.genreCommande.consulterLeMemo,
            article: aParametres.article,
          }),
        { icon: "icon_post_it_rempli theme_color_moyen1" },
      );
    }
    if (this.avecFct.telecharger) {
      aParametres.menuContextuel.add(
        GTraductions.getValeur("Casier.Cmd.Telecharger"),
        true,
        () =>
          this.evenementMenuContextuel({
            numeroMenu: DonneesListe_Casier.genreCommande.telecharger,
            article: aParametres.article,
          }),
        { icon: "icon_download_alt" },
      );
    }
    if (
      this.avecFct.remplacerLeDocument &&
      !!aParametres.article.estModifiableParDestinataires &&
      !!aParametres.article.estModifiableParUtilisateur
    ) {
      const lLibelle = GTraductions.getValeur("Casier.remplacerLeDocument");
      const lEstUnDocumentCloud =
        aParametres.article.documentCasier &&
        aParametres.article.documentCasier.getGenre() ===
          EGenreDocumentJoint.Cloud;
      if (lEstUnDocumentCloud) {
        aParametres.menuContextuel.add(
          lLibelle,
          true,
          () =>
            this.evenementMenuContextuel({
              numeroMenu:
                DonneesListe_Casier.genreCommande.remplacerDocumentCloud,
              article: aParametres.article,
            }),
          { icon: "icon_pencil" },
        );
      } else {
        aParametres.menuContextuel.addSelecFile(lLibelle, {
          getOptionsSelecFile: () => {
            return UtilitaireDocument.getOptionsSelecFile();
          },
          addFiles: (aParametresInput) => {
            if (aParametresInput && aParametresInput.eltFichier) {
              this.evenementMenuContextuel({
                numeroMenu: DonneesListe_Casier.genreCommande.remplacer,
                article: aParametres.article,
                eltFichier: aParametresInput.eltFichier,
              });
            }
          },
          icon: "icon_pencil",
        });
      }
    }
    if (
      this.avecFct.majDoc &&
      ![EGenreEspace.Accompagnant, EGenreEspace.Tuteur].includes(
        GEtatUtilisateur.GenreEspace,
      )
    ) {
      aParametres.menuContextuel.add(
        GTraductions.getValeur("Modifier"),
        true,
        () =>
          this.evenementMenuContextuel({
            numeroMenu: DonneesListe_Casier.genreCommande.modifier,
            article: aParametres.article,
          }),
        { icon: "icon_pencil" },
      );
    }
    if (this.avecFct.marquerLectureDocument && aParametres.article.estNonLu) {
      aParametres.menuContextuel.add(
        GTraductions.getValeur("Casier.marquerLus"),
        true,
        () =>
          this.evenementMenuContextuel({
            numeroMenu: DonneesListe_Casier.genreCommande.marquerLus,
            article: aParametres.article,
          }),
        { icon: "icon_eye_open" },
      );
    }
    if (
      this.avecFct.marquerLectureDocument &&
      aParametres.article.estNonLu === false
    ) {
      aParametres.menuContextuel.add(
        GTraductions.getValeur("Casier.marquerNonLus"),
        true,
        () =>
          this.evenementMenuContextuel({
            numeroMenu: DonneesListe_Casier.genreCommande.marquerNonLus,
            article: aParametres.article,
          }),
        { icon: "icon_eye_close" },
      );
    }
    if (this.avecFct.suppressionDoc) {
      const lCleTrad =
        this.typeConsultation ===
        TypeConsultationDocumentCasier.CoDC_Destinataire
          ? GTraductions.getValeur("Casier.supprimerDuCasier")
          : GTraductions.getValeur("Casier.supprimerDeTousLesCasiers");
      aParametres.menuContextuel.add(
        lCleTrad,
        aParametres && !aParametres.nonEditable,
        () =>
          this.evenementMenuContextuel({
            numeroMenu: DonneesListe_Casier.genreCommande.suppression,
            article: aParametres.article,
          }),
        { icon: "icon_trash" },
      );
    }
    aParametres.menuContextuel.setDonnees();
  }
  evenementMenuContextuel(aParametres) {
    this.evenement.call(this.pere, aParametres);
  }
  getVisible(aArticle) {
    let lVisible = true;
    if (this.optionsCasier.avecFiltreCategorie) {
      const lFiltre = this.listeCategories.get(this.filtre.indiceCategorie);
      if (lFiltre && !lFiltre.estTotal) {
        lVisible = aArticle.categorie.getNumero() === lFiltre.getNumero();
      }
    }
    if (this.optionsCasier.avecFiltreNonLus && this.filtre.cbNonLu) {
      if (aArticle.estUnDeploiement) {
        let lAvecEnfantNonLu =
          this.Donnees.getListeElements(
            (aElement) =>
              !aElement.estUnDeploiement &&
              aElement.pere.categorie.getNumero() ===
                aArticle.categorie.getNumero() &&
              aElement.estNonLu,
          ).count() > 0;
        lVisible = lVisible && lAvecEnfantNonLu;
      } else {
        lVisible = lVisible && aArticle.estNonLu;
      }
    }
    if (this.optionsCasier.avecFiltreClasse) {
      const lFiltre = this.listeClasses.get(this.filtre.indiceClasse);
      if (lFiltre && !lFiltre.estTotal) {
        lVisible =
          aArticle.listeClasses &&
          aArticle.listeClasses
            .getListeElements(
              (aClasse) => aClasse.getNumero() === lFiltre.getNumero(),
            )
            .get(0);
      }
    }
    if (this.optionsCasier.avecFiltreElevesAvecDocADeposer) {
      lVisible =
        lVisible &&
        aArticle.listeDocuments &&
        aArticle.listeDocuments.count() > 0;
    }
    return lVisible;
  }
  getTri(aColonne, aGenreTri) {
    if (!this.optionsCasier.avectri) {
      return;
    }
    const lTris = [
      ObjetTri.init((aElement) => {
        return aElement.pere
          ? aElement.pere.categorie.getLibelle()
          : aElement.estUnDeploiement
            ? aElement.categorie.getLibelle()
            : "";
      }),
      ObjetTri.init((aElement) => {
        return !!aElement.pere;
      }),
    ];
    switch (this.getId(aColonne)) {
      case DonneesListe_Casier.genreColonne.nomDocument:
        lTris.push(
          ObjetTri.init((aElement) => {
            return aElement.getLibelle();
          }, aGenreTri),
        );
        break;
      case DonneesListe_Casier.genreColonne.date:
        lTris.push(
          ObjetTri.init((aElement) => {
            return aElement.date;
          }, aGenreTri),
        );
        break;
      default:
        lTris.push(
          ObjetTri.init(this.getValeurPourTri.bind(this, aColonne), aGenreTri),
        );
        break;
    }
    lTris.push(ObjetTri.init("Libelle"));
    return lTris;
  }
  construireFiltres() {
    const H = [];
    if (this.optionsCasier.avecComboClasse) {
      H.push(
        tag(
          "label",
          { class: ["m-bottom-l"], id: this.ids.labelClasse },
          GTraductions.getValeur("Casier.classeConcernee"),
        ),
        tag("ie-combo", {
          tabindex: "0",
          "ie-model": "comboClasses",
          class: "combo-sans-fleche",
        }),
      );
    }
    if (!!this.optionsCasier.avecFiltreCategorie) {
      H.push(
        tag(
          "label",
          { class: ["m-bottom-l"], id: this.ids.labelNatures },
          GTraductions.getValeur("Casier.natures"),
        ),
        tag("ie-combo", {
          "ie-model": "comboCategories",
          class: "combo-sans-fleche",
        }),
      );
    }
    if (!!this.optionsCasier.avecFiltreNonLus) {
      H.push(
        tag("div", { class: ["DAT_separateur", "m-y-xl"] }, ""),
        tag(
          "ie-checkbox",
          { class: IE.estMobile ? "m-bottom-l" : "", "ie-model": "cbNonLu" },
          GTraductions.getValeur("Casier.FiltreNonLus"),
        ),
      );
    }
    return tag("div", { class: ["flex-contain", "cols"] }, H.join(""));
  }
  reinitFiltres() {
    this.setFiltre(this.getFiltreParDefaut());
    this.filtre = this.getfiltre();
    if (this.callbackCollecte) {
      this.callbackCollecte(null);
    }
    this.paramsListe.actualiserListe({ conserverSelection: false });
  }
  estFiltresParDefaut() {
    let lEstParDefaut = true;
    const lValeurFiltreParDefaut = this.getFiltreParDefaut();
    for (const prop in this.filtre) {
      if (this.filtre[prop] !== lValeurFiltreParDefaut[prop]) {
        lEstParDefaut = false;
      }
    }
    return lEstParDefaut;
  }
  getControleurFiltres() {
    return {
      cbNonLu: {
        getValue: () => {
          return this.filtre.cbNonLu;
        },
        setValue: (aValue) => {
          this.setCbNonLu(!!aValue);
          this.paramsListe.actualiserListe();
        },
      },
      comboCategories: {
        init: (aCombo) => {
          aCombo.setDonneesObjetSaisie({
            options: {
              labelledById: this.ids.labelNatures,
              estLargeurAuto: true,
            },
          });
        },
        getDonnees: () => {
          if (this.listeCategories) {
            return this.listeCategories;
          }
        },
        event: (aParam) => {
          if (
            aParam.genreEvenement === EGenreEvenementObjetSaisie.selection &&
            aParam.element
          ) {
            const lindiceCategorie =
              this.listeCategories.getIndiceElementParFiltre(
                (aCat) => aCat === aParam.element,
              );
            this.setIndiceCategorie(lindiceCategorie);
            this.paramsListe.actualiserListe();
          }
        },
        getIndiceSelection: () => {
          return MethodesObjet.isNumeric(this.filtre.indiceCategorie)
            ? this.filtre.indiceCategorie
            : -1;
        },
      },
      comboClasses: {
        init: (aCombo) => {
          aCombo.setOptionsObjetSaisie({
            longueur: 200,
            placeHolder: GTraductions.getValeur("Casier.classe"),
            initAutoSelectionAvecUnElement: false,
            deroulerListeSeulementSiPlusieursElements: false,
            labelledById: this.ids.labelClasse,
          });
          aCombo.setDonneesObjetSaisie({ liste: this.listeClasses });
        },
        event: (aParam) => {
          if (aParam.element && aParam.estSelectionManuelle) {
            this.setIndiceClasse(
              this.listeClasses.getIndiceElementParFiltre(
                (aClasse) => aClasse === aParam.element,
              ),
            );
            if (this.callbackCollecte) {
              this.callbackCollecte(aParam.element);
            }
            this.paramsListe.actualiserListe();
          }
        },
        getIndiceSelection: () => {
          return MethodesObjet.isNumeric(this.filtre.indiceClasse)
            ? this.filtre.indiceClasse
            : -1;
        },
      },
    };
  }
}
DonneesListe_Casier.genreColonne = {
  nomDocument: "DL_Casier_nom",
  categorie: "DL_Casier_categorie",
  memo: "DL_Casier_memo",
  infoPersonnel: "DL_Casier_destPersonnels",
  infoProfesseur: "DL_Casier_destProfs",
  infoMaitreDeStage: "DL_Casier_destMS",
  depositaire: "DL_Casier_depositaire",
  date: "DL_Casier_date",
  autorisationModification: "DL_Casier_autorisation",
};
DonneesListe_Casier.genreCommande = {
  telecharger: 3,
  consulter: 4,
  remplacerDocumentCloud: 5,
  marquerLus: 6,
  marquerNonLus: 7,
  detail: 8,
  suppression: 9,
  renommer: 10,
  remplacer: 11,
  consulterLeMemo: 12,
  modifier: 13,
};
module.exports = { DonneesListe_Casier };
