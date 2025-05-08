const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { GDate } = require("ObjetDate.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetMoteurTravaux } = require("ObjetMoteurTravaux.js");
const { TypeGenreTravauxIntendance } = require("TypeGenreTravauxIntendance.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
  TypeDestinationDemandeTravaux,
  TypeDestinationDemandeTravauxUtil,
} = require("TypeDestinationDemandeTravaux.js");
const {
  TypeNiveauDUrgence,
  TypeNiveauDUrgenceUtil,
} = require("TypeNiveauDUrgence.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetElement } = require("ObjetElement.js");
const { MethodesObjet } = require("MethodesObjet.js");
const {
  TypeOrigineCreationAvanceeTravaux,
} = require("TypeOrigineCreationAvanceeTravaux.js");
const { GUID } = require("GUID.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
class DonneesListe_DemandesTravaux extends ObjetDonneesListeFlatDesign {
  constructor(aParams) {
    super(aParams.donnees);
    this.param = $.extend(
      true,
      {
        droits: {
          avecDemandeTravaux: false,
          avecExecutionTravaux: false,
          avecGestionTravaux: false,
          avecTransfert: false,
        },
        borneDescription: 1000,
        genre: TypeGenreTravauxIntendance.GTI_Maintenance,
      },
      aParams,
    );
    this.setOptions({
      avecEvnt_SelectionClick: true,
      avecEvnt_Selection: true,
      avecEvnt_Creation: true,
      avecEvnt_Suppression: true,
    });
    this.listeNiveauUrgence = TypeNiveauDUrgenceUtil.toListe();
    this.listeEtatAvancement = aParams.listeEtatsAvancements;
    this.listeNatureTvx = MethodesObjet.dupliquer(aParams.listeNatureTvx);
    this.listeNiveauUrgenceDuplique = MethodesObjet.dupliquer(
      this.listeNiveauUrgence,
    );
    this.listeEtatAvancementDuplique = MethodesObjet.dupliquer(
      this.listeEtatAvancement,
    );
    this.listeNatureTvxDuplique = MethodesObjet.dupliquer(this.listeNatureTvx);
    this.moteur = new ObjetMoteurTravaux(this.param);
    this.setFiltre = aParams.setFiltre;
    this.filtre = aParams.filtreCourant
      ? aParams.filtreCourant
      : this.getFiltreParDefaut();
    this.listeNatureTvx.insererElement(this.getElementTotal(true), 0);
    this.listeEtatAvancement.insererElement(this.getElementTotal(), 0);
  }
  getElementTotal(aPourNature = false) {
    return new ObjetElement({
      estTotal: true,
      Libelle: aPourNature
        ? GTraductions.getValeur("TvxIntendance.Toutes")
        : GTraductions.getValeur("TvxIntendance.Tous"),
      Numero: -1,
    });
  }
  getFiltreParDefaut() {
    return {
      cbMesDemandes: false,
      cbMesTravaux: false,
      cbInterne: true,
      cbMairie: true,
      etatAvancement: new ObjetListeElements().add(this.getElementTotal()),
      nature: new ObjetListeElements().add(this.getElementTotal(true)),
      urgence: this.listeNiveauUrgenceDuplique.getTableauGenres(),
    };
  }
  getFiltreCourant() {
    return this.filtre;
  }
  estFiltresParDefaut() {
    let lEstParDefaut = true;
    const lValeurFiltreParDefaut = this.getFiltreParDefaut();
    ["cbMesDemandes", "cbMesTravaux", "cbInterne", "cbMairie"].forEach(
      (aProp) => {
        if (this.filtre[aProp] !== lValeurFiltreParDefaut[aProp]) {
          lEstParDefaut = false;
        }
      },
    );
    ["urgence", "etatAvancement", "nature"].forEach((aProp) => {
      if (!lEstParDefaut) {
        return;
      }
      const lPropDansFiltre = this.filtre[aProp];
      const lPropParDefaut = lValeurFiltreParDefaut[aProp];
      if (lPropDansFiltre && lPropParDefaut) {
        if (Array.isArray(lPropDansFiltre)) {
          if (lPropDansFiltre.length !== lPropParDefaut.length) {
            lEstParDefaut = false;
            return;
          }
          for (let i = 0; i < lPropDansFiltre.length; i++) {
            const lElementDansFiltre = lPropDansFiltre[i];
            if (!lPropParDefaut.includes(lElementDansFiltre)) {
              lEstParDefaut = false;
            }
          }
          return;
        }
        if (lPropDansFiltre.count() !== lPropParDefaut.count()) {
          lEstParDefaut = false;
          return;
        }
        for (let i = 0; i < lPropDansFiltre.count(); i++) {
          const lElementDansFiltre = lPropDansFiltre.get(i);
          const lElementParDefaut = lPropParDefaut.get(i);
          if (
            lElementParDefaut.getNumero() !== lElementDansFiltre.getNumero()
          ) {
            lEstParDefaut = false;
          }
        }
      }
    });
    return lEstParDefaut;
  }
  avecBoutonActionLigne(aParams) {
    return (
      !aParams.article.estUnDeploiement && super.avecBoutonActionLigne(aParams)
    );
  }
  getTitreZonePrincipale(aParams) {
    let H = [];
    if (aParams.article.estUnDeploiement) {
      H.push(
        `<div ie-ellipsis>${aParams.article.getLibelle()} (${this.getCompteurFilsDeploiement(aParams.article)})</div>`,
      );
    } else {
      H.push(
        `<div ie-ellipsis class="ie-titre" >${aParams.article.nature ? aParams.article.nature.getLibelle() : ""}</div>`,
      );
    }
    return H.join("");
  }
  estLigneOff(aParams) {
    if (aParams.article.estUnDeploiement) {
      return this.getCompteurFilsDeploiement(aParams.article) === 0;
    }
    return super.estLigneOff(aParams);
  }
  getCompteurFilsDeploiement(aArticle) {
    if (aArticle.estUnDeploiement) {
      if (aArticle.estDestination) {
        const lListeCumulsDeDestination =
          this.getArrayFilsVisiblesDePere(aArticle);
        let Compteur = 0;
        for (let lI = 0; lI < lListeCumulsDeDestination.length; lI++) {
          Compteur += this.getCompteurFilsDeploiement(
            lListeCumulsDeDestination[lI].article,
          );
        }
        return Compteur;
      } else {
        return this.getArrayFilsVisiblesDePere(aArticle).length;
      }
    }
    return 0;
  }
  getInfosSuppZonePrincipale(aParams) {
    let H = [];
    if (aParams.article.estUnDeploiement) {
      return;
    }
    if (aParams.article.dateRealisation) {
      let lDate = GDate.formatDate(aParams.article.dateRealisation, "%JJ %MMM");
      H.push(
        `<div>${GTraductions.getValeur("TvxIntendance.colonne.realisationLe")} ${lDate}</div>`,
      );
    } else {
      H.push(`<div>${aParams.article.etat.getLibelle()}</div>`);
    }
    if (aParams.article.demandeur) {
      H.push(
        `<div> ${GTraductions.getValeur("TvxIntendance.colonne.demandeur")} : ${aParams.article.demandeur.getLibelle()}</div>`,
      );
    }
    H.push(`<div ie-ellipsis>${aParams.article.detail || ""}</div>`);
    return H.join("");
  }
  getZoneMessageLarge(aParams) {
    let H = [];
    if (MethodesObjet.isNumeric(aParams.article.niveauDUrgence)) {
      const lEstNiveauEleve =
        aParams.article.niveauDUrgence === TypeNiveauDUrgence.Tndu_Eleve ||
        aParams.article.niveauDUrgence === TypeNiveauDUrgence.Tndu_Prioritaire;
      H.push(`<div class="flex-contain justify-end">`);
      H.push(
        `<span class="${lEstNiveauEleve ? "text-util-rouge-foncee" : ""}">${TypeNiveauDUrgenceUtil.getLibelle(aParams.article.niveauDUrgence)}</span>`,
      );
      if (lEstNiveauEleve) {
        H.push(
          `<i class="icon_warning_sign text-util-rouge-foncee m-x-l" title="${GTraductions.getValeur("TvxIntendance.NiveauDUrgenceEleve")}" aria-label="${GTraductions.getValeur("TvxIntendance.NiveauDUrgenceEleve")}" role="img" ></i>`,
        );
      }
      H.push(`</div>`);
    }
    return H.join("");
  }
  getZoneComplementaire(aParams) {
    let H = [];
    if (aParams.article.estUnDeploiement) {
      return;
    }
    if (aParams.article.dateEcheance) {
      let lDate = GDate.formatDate(
        aParams.article.dateEcheance,
        "%Jjj %JJ %MMM",
      );
      H.push(
        `<time class="text-util-vert-foncee" datetime="${GDate.formatDate(aParams.article.dateEcheance, "%MM-%JJ")}">${lDate}</time>`,
      );
      if (
        [
          EGenreEspace.Mobile_PrimMairie,
          EGenreEspace.PrimMairie,
          EGenreEspace.Mobile_PrimDirection,
          EGenreEspace.PrimDirection,
        ].includes(GEtatUtilisateur.GenreEspace)
      ) {
        if (aParams.article.destination === 1) {
          H.push(
            `<i class="icon_mairie text-util-vert-foncee m-left-l m-y-l" title="${TypeDestinationDemandeTravauxUtil.getLibelle(TypeDestinationDemandeTravaux.DDT_Collectivite)}" aria-label="${TypeDestinationDemandeTravauxUtil.getLibelle(TypeDestinationDemandeTravaux.DDT_Collectivite)}" role="img"></i>`,
          );
        }
      }
    }
    if (aParams.article.listePJ.count() !== 0) {
      H.push(
        `<i class='icon_piece_jointe text-util-vert-foncee m-y-l' title="${GTraductions.getValeur("TvxIntendance.fenetre.pieceJointe")}" aria-label="${GTraductions.getValeur("TvxIntendance.fenetre.pieceJointe")}" role="img"></i>`,
      );
    }
    return H.join("");
  }
  avecEvenementSelectionClick(aParams) {
    if (aParams.article.estCumul) {
      return false;
    }
    if (aParams.article.estUnDeploiement) {
      return;
    }
    return this.options.avecEvnt_SelectionClick;
  }
  construireFiltres() {
    const H = [];
    H.push('<div class="flex-contain cols">');
    if (
      this.param.droits.avecExecutionTravaux &&
      !this.param.droits.uniquementMesDemandesTravaux
    ) {
      H.push(
        '<ie-checkbox class="round-style flex-contain justify-start m-y-l" ie-model="cbMesDemandes">',
        this.param.genre === TypeGenreTravauxIntendance.GTI_Commande
          ? GTraductions.getValeur("TvxIntendance.Filtre_MesCommandes")
          : GTraductions.getValeur("TvxIntendance.Filtre_MesDemandes"),
        "</ie-checkbox>",
      );
    }
    if (this.param.droits.avecDemandeTravaux) {
      let lLibelle = "";
      switch (this.param.genre) {
        case TypeGenreTravauxIntendance.GTI_Maintenance:
          lLibelle = GTraductions.getValeur("TvxIntendance.Filtre_MesTravaux");
          break;
        case TypeGenreTravauxIntendance.GTI_Secretariat:
          lLibelle = GTraductions.getValeur("TvxIntendance.Filtre_MesTaches");
          break;
        case TypeGenreTravauxIntendance.GTI_Informatique:
          lLibelle = GTraductions.getValeur(
            "TvxIntendance.Filtre_MesInterventions",
          );
          break;
        case TypeGenreTravauxIntendance.GTI_Commande:
          lLibelle = GTraductions.getValeur(
            "TvxIntendance.Filtre_MesCommandes",
          );
          break;
      }
      H.push(
        '<ie-checkbox class="round-style flex-contain m-y-l" ie-display="avecCBMesTravaux" ie-model="cbMesTravaux">',
        lLibelle,
        "</ie-checkbox>",
      );
    }
    H.push('<div class="m-y-xl flex-contain cols">');
    H.push(
      '<div class="m-y-m">',
      GTraductions.getValeur("TvxIntendance.fenetre.niveauUrgence"),
      "</div>",
    );
    if (this.listeNiveauUrgence) {
      this.listeNiveauUrgence.parcourir((aUrgence) => {
        H.push(
          `<ie-checkbox class="m-y-l" ie-model="comboNiveauUrgence('${aUrgence.getGenre()}')" >${aUrgence.getLibelle()}</ie-checkbox>`,
        );
      });
    }
    H.push("</div>");
    const lIdNature = GUID.getId();
    H.push(
      '<div class="m-y-m">',
      `<div class="field-contain label-up">`,
      `<label id="${lIdNature}">${GTraductions.getValeur("TvxIntendance.colonne.nature")}</label>`,
      `<ie-combo ie-model="cmbNature" aria-labelledby="${lIdNature}"></ie-combo>`,
      `</div>`,
      "</div>",
    );
    const lIdAvancement = GUID.getId();
    H.push(
      '<div class="m-y-m">',
      `<div class="field-contain label-up">`,
      `<label id="${lIdAvancement}">${GTraductions.getValeur("TvxIntendance.colonne.etatAvancement")}</label>`,
      `<ie-combo ie-model="comboEtatAvancement" aria-labelledby="${lIdAvancement}"></ie-combo>`,
      `</div>`,
      "</div>",
    );
    if (
      [
        EGenreEspace.Mobile_PrimMairie,
        EGenreEspace.PrimMairie,
        EGenreEspace.Mobile_PrimDirec,
        EGenreEspace.PrimDirection,
        EGenreEspace.PrimProfesseur,
        EGenreEspace.Mobile_PrimProfe,
      ].includes(GEtatUtilisateur.GenreEspace)
    ) {
      H.push(
        "<div>",
        '<div class="m-y-l">',
        '<ie-checkbox class="round-style flex-contain justify-between" ie-model="cbInterne">',
        TypeDestinationDemandeTravauxUtil.getLibelle(
          TypeDestinationDemandeTravaux.DDT_Interne,
        ),
        "</ie-checkbox>",
        "</div>",
        '<div class="m-y-l">',
        '<ie-checkbox class="round-style flex-contain justify-between" ie-model="cbMairie">',
        TypeDestinationDemandeTravauxUtil.getLibelle(
          TypeDestinationDemandeTravaux.DDT_Collectivite,
        ),
        '<i class="icon_mairie  m-left-l" title="',
        TypeDestinationDemandeTravauxUtil.getLibelle(
          TypeDestinationDemandeTravaux.DDT_Collectivite,
        ),
        '" aria-label="',
        TypeDestinationDemandeTravauxUtil.getLibelle(
          TypeDestinationDemandeTravaux.DDT_Collectivite,
        ),
        '" role="img"></i></ie-checkbox>',
        "</div>",
        "</div>",
      );
    }
    H.push("</div>");
    return H.join("");
  }
  actualiserListeEtFiltre(aParams) {
    this.setFiltre(this.filtre);
    this.paramsListe.actualiserListe(aParams);
  }
  setModifierSelectionCombo(aElement, aParametresModifie) {
    if (
      aParametresModifie.elementSourceSelectionne &&
      !!aElement.estTotal !== !!aParametresModifie.elementSource.estTotal
    ) {
      return false;
    }
  }
  getControleurFiltres(aInstance) {
    return {
      cbMesDemandes: {
        getValue: () => {
          return this.filtre.cbMesDemandes;
        },
        setValue: (aValue) => {
          this.filtre.cbMesDemandes = !!aValue;
          this.actualiserListeEtFiltre();
        },
      },
      cbMesTravaux: {
        getValue: () => {
          return this.filtre.cbMesTravaux;
        },
        setValue: (aValue) => {
          this.filtre.cbMesTravaux = !!aValue;
          this.actualiserListeEtFiltre();
        },
      },
      avecCBMesTravaux: () => {
        return (
          aInstance.getNbrLignes() > 0 &&
          this.Donnees.getIndiceElementParFiltre(
            this.filtreMesTravaux.bind(aInstance),
          ) > -1
        );
      },
      cbInterne: {
        getValue: () => {
          return this.filtre.cbInterne;
        },
        setValue: (aValue) => {
          this.filtre.cbInterne = !this.filtre.cbInterne;
          this.actualiserListeEtFiltre();
        },
      },
      cbMairie: {
        getValue: () => {
          return this.filtre.cbMairie;
        },
        setValue: (aValue) => {
          this.filtre.cbMairie = !this.filtre.cbMairie;
          this.actualiserListeEtFiltre();
        },
      },
      comboEtatAvancement: {
        init(aCombo) {
          const lListeSelections =
            aInstance.listeEtatAvancement.getListeElements((aEtat) =>
              aInstance.filtre.etatAvancement.getElementParNumero(
                aEtat.getNumero(),
              ),
            );
          aCombo.setDonneesObjetSaisie({
            liste: aInstance.listeEtatAvancement,
            selection: lListeSelections,
            options: {
              longueur: "100%",
              hauteur: 16,
              hauteurLigneDefault: 16,
              multiSelection: true,
              getInfosElementCB: (aElement) => {
                return {
                  setModifierSelection: (aParametresModifie) =>
                    aInstance.setModifierSelectionCombo(
                      aElement,
                      aParametresModifie,
                    ),
                };
              },
            },
          });
          aCombo.setContenu(lListeSelections);
        },
        event(aParametres) {
          if (
            aParametres.genreEvenement === EGenreEvenementObjetSaisie.selection
          ) {
            if (aParametres.listeSelections) {
              aInstance.filtre.etatAvancement = aParametres.listeSelections;
              aInstance.actualiserListeEtFiltre();
              return;
            }
          }
        },
      },
      comboNiveauUrgence: {
        getValue: (aNumeroUrgence) => {
          return (
            this.filtre.urgence &&
            this.filtre.urgence.includes(parseInt(aNumeroUrgence))
          );
        },
        setValue: (aNumeroUrgence, aValue) => {
          if (
            aValue === false &&
            this.filtre.urgence.includes(parseInt(aNumeroUrgence))
          ) {
            this.filtre.urgence.splice(
              this.filtre.urgence.indexOf(parseInt(aNumeroUrgence)),
              1,
            );
          }
          if (
            aValue === true &&
            !this.filtre.urgence.includes(parseInt(aNumeroUrgence))
          ) {
            this.filtre.urgence.push(parseInt(aNumeroUrgence));
          }
          this.actualiserListeEtFiltre();
        },
      },
      cmbNature: {
        init: (aCombo) => {
          const lListeSelections = aInstance.listeNatureTvx.getListeElements(
            (aEtat) =>
              aInstance.filtre.nature.getElementParNumero(aEtat.getNumero()),
          );
          aCombo.setDonneesObjetSaisie({
            liste: aInstance.listeNatureTvx,
            selection: lListeSelections,
            options: {
              longueur: "100%",
              hauteur: 16,
              hauteurLigneDefault: 16,
              multiSelection: true,
              getInfosElementCB: (aElement) => {
                return {
                  setModifierSelection: (aParametresModifie) =>
                    aInstance.setModifierSelectionCombo(
                      aElement,
                      aParametresModifie,
                    ),
                };
              },
            },
          });
          aCombo.setContenu(lListeSelections);
        },
        event(aParametres) {
          if (
            aParametres.genreEvenement === EGenreEvenementObjetSaisie.selection
          ) {
            if (aParametres.listeSelections) {
              aInstance.filtre.nature = aParametres.listeSelections;
              aInstance.actualiserListeEtFiltre();
              return;
            }
          }
        },
      },
    };
  }
  getVisible(aArticle) {
    if (!!aArticle.estUnDeploiement) {
      return true;
    }
    if (this.filtre.cbMesDemandes && !this.moteur.estDemandeur(aArticle)) {
      return false;
    }
    if (this.filtre.cbMesTravaux && !this.filtreMesTravaux(aArticle)) {
      return false;
    }
    if (
      !this.filtre.cbInterne &&
      aArticle.destination === TypeDestinationDemandeTravaux.DDT_Interne
    ) {
      return false;
    }
    if (
      !this.filtre.cbMairie &&
      aArticle.destination === TypeDestinationDemandeTravaux.DDT_Collectivite
    ) {
      return false;
    }
    if (!this.filtre.urgence.includes(aArticle.niveauDUrgence)) {
      return false;
    }
    const lEstFiltreTotalNature =
      this.filtre.nature &&
      this.filtre.nature.getElementParFiltre((aElem) => aElem.estTotal);
    if (
      !lEstFiltreTotalNature &&
      !this.filtre.nature.getElementParNumero(aArticle.nature.getNumero())
    ) {
      return false;
    }
    const lEstFiltreTotalEtatAvancement =
      this.filtre.etatAvancement &&
      this.filtre.etatAvancement.getElementParFiltre((aElem) => aElem.estTotal);
    if (
      !lEstFiltreTotalEtatAvancement &&
      !this.filtre.etatAvancement.getElementParNumero(aArticle.etat.getNumero())
    ) {
      return false;
    }
    return true;
  }
  filtreMesTravaux(aArticle) {
    return (
      this.moteur.estExecutant(aArticle) &&
      aArticle.etat.getGenre() !== TypeOrigineCreationAvanceeTravaux.OCAT_Refuse
    );
  }
  transfererMission(aArticle) {
    let lTypeTransfertDe = "";
    let lTypeTransfertVers = "";
    let lNouveauGenre;
    switch (this.param.genre) {
      case TypeGenreTravauxIntendance.GTI_Maintenance:
        {
          lTypeTransfertDe = GTraductions.getValeur(
            "TvxIntendance.Type.TravauxEntretien",
          );
          lTypeTransfertVers = GTraductions.getValeur(
            "TvxIntendance.Type.MaintenanceInformatique",
          );
          lNouveauGenre = TypeGenreTravauxIntendance.GTI_Informatique;
        }
        break;
      case TypeGenreTravauxIntendance.GTI_Informatique:
        {
          lTypeTransfertDe = GTraductions.getValeur(
            "TvxIntendance.Type.MaintenanceInformatique",
          );
          lTypeTransfertVers = GTraductions.getValeur(
            "TvxIntendance.Type.TravauxEntretien",
          );
          lNouveauGenre = TypeGenreTravauxIntendance.GTI_Maintenance;
        }
        break;
    }
    GApplication.getMessage().afficher({
      type: EGenreBoiteMessage.Confirmation,
      message: GTraductions.getValeur("TvxIntendance.ConfirmationTransferer", [
        lTypeTransfertDe,
        lTypeTransfertVers,
      ]),
      callback: (aGenreAction) => {
        if (aGenreAction === EGenreAction.Valider) {
          aArticle.Genre = lNouveauGenre;
          aArticle.nouveauGenreTravaux = true;
          if (this.param.callbackTransfererMission) {
            this.param.callbackTransfererMission(aArticle);
          }
        }
      },
    });
  }
  reinitFiltres() {
    this.filtre = this.getFiltreParDefaut();
    this.actualiserListeEtFiltre({ conserverSelection: false });
  }
  avecMenuContextuel() {
    return true;
  }
  initialisationObjetContextuel(aParams) {
    if (
      !aParams.menuContextuel ||
      aParams.article.estUnDeploiement ||
      !aParams.article
    ) {
      return;
    }
    aParams.menuContextuel.add(
      GTraductions.getValeur("Modifier"),
      true,
      function () {
        this.callback.appel({
          article: aParams.article,
          genreEvenement: EGenreEvenementListe.Edition,
        });
      },
      { icon: "icon_pencil" },
    );
    if (this.param.droits.avecTransfert) {
      let lTypeTransfertVers = "";
      switch (this.param.genre) {
        case TypeGenreTravauxIntendance.GTI_Maintenance:
          lTypeTransfertVers = GTraductions.getValeur(
            "TvxIntendance.Type.MaintenanceInformatique",
          );
          break;
        case TypeGenreTravauxIntendance.GTI_Informatique:
          lTypeTransfertVers = GTraductions.getValeur(
            "TvxIntendance.Type.TravauxEntretien",
          );
          break;
      }
      aParams.menuContextuel.add(
        GTraductions.getValeur("TvxIntendance.TransfererVers", [
          lTypeTransfertVers,
        ]),
        true,
        () => {
          this.transfererMission(aParams.article);
        },
        { icon: "icon_arrow_right" },
      );
    }
    if (this.param.droits.avecExecutionTravaux) {
      aParams.menuContextuel.add(
        GTraductions.getValeur("Dupliquer"),
        true,
        function () {
          this.callback.appel({
            article: aParams.article,
            genreEvenement: EGenreEvenementListe.Creation,
            estDuplication: true,
          });
        },
        { icon: "icon_dupliquer" },
      );
    }
    aParams.menuContextuel.add(
      GTraductions.getValeur("Supprimer"),
      this.moteur.estIdentificationEditable(aParams.article),
      async function () {
        if (
          (await ObjetMoteurTravaux.getMessageSuppresion()) ===
          EGenreAction.Valider
        ) {
          this.callback.appel({
            article: aParams.article,
            genreEvenement: EGenreEvenementListe.Suppression,
          });
        }
      },
      { icon: "icon_trash" },
    );
    aParams.menuContextuel.setDonnees();
  }
}
module.exports = { DonneesListe_DemandesTravaux };
