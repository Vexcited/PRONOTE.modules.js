const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { TypeFusionTitreListe } = require("TypeFusionTitreListe.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const {
  DonneesListe_CategoriesMotif,
} = require("DonneesListe_CategoriesMotif.js");
const { DonneesListe_Actions } = require("DonneesListe_Actions.js");
const { DonneesListe_Incidents } = require("DonneesListe_Incidents.js");
const { DonneesListe_Protagonistes } = require("DonneesListe_Protagonistes.js");
const {
  ObjetRequeteSaisieIncidents,
} = require("ObjetRequeteSaisieIncidents.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
  ObjetFenetre_SignalementIncident,
} = require("ObjetFenetre_SignalementIncident.js");
const {
  ObjetFenetre_MesureIncident,
} = require("ObjetFenetre_MesureIncident.js");
const { GUID } = require("GUID.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { MethodesTableau } = require("MethodesTableau.js");
const { GHtml } = require("ObjetHtml.js");
const { GPosition } = require("ObjetPosition.js");
const { Requetes } = require("CollectionRequetes.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EEvent } = require("Enumere_Event.js");
const { EGenreSaisie } = require("Enumere_Saisie.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetSelecteurClasseGpe } = require("ObjetSelecteurClasseGpe.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { ObjetCelluleMultiSelection } = require("ObjetCelluleMultiSelection.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const {
  ObjetFenetre_SelectionPublic,
  TypeGenreCumulSelectionPublic,
} = require("ObjetFenetre_SelectionPublic.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetSelecteurPJCP } = require("ObjetSelecteurPJCP.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const {
  EGenreRessource,
  EGenreRessourceUtil,
} = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const {
  ObjetCelluleMultiSelectionMotif,
} = require("ObjetCelluleMultiSelectionMotif.js");
const { ObjetSelecteurPJ } = require("ObjetSelecteurPJ.js");
const {
  DonneesListe_SelectionMotifs,
} = require("DonneesListe_SelectionMotifs.js");
const { TypeGenreIndividuAuteur } = require("TypeGenreIndividuAuteur.js");
const { TypeGenrePunition } = require("TypeGenrePunition.js");
const {
  TypeGenreStatutProtagonisteIncident,
} = require("TypeGenreStatutProtagonisteIncident.js");
const { ObjetRequeteListePublics } = require("ObjetRequeteListePublics.js");
const {
  TypeGenreReponseInternetActualite,
} = require("TypeGenreReponseInternetActualite.js");
const { TUtilitaireDuree } = require("UtilitaireDuree.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const { EGenreAction } = require("Enumere_Action.js");
const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { UtilitaireMessagerie } = require("UtilitaireMessagerie.js");
const {
  ObjetFenetre_EditionActualite,
} = require("ObjetFenetre_EditionActualite.js");
Requetes.inscrire("Incidents", ObjetRequeteConsultation);
Requetes.inscrire("ListesSaisiesPourIncidents", ObjetRequeteConsultation);
Requetes.inscrire("donneesSaisieMesure", ObjetRequeteConsultation);
class InterfaceIncidents extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this._autorisations = {
      acces: false,
      saisie: false,
      publier: false,
      publierDossierVS: false,
    };
    this.donneesSaisie = {
      tailleTravailAFaire: GApplication.droits.get(
        TypeDroits.tailleTravailAFaire,
      ),
      tailleCirconstance: GApplication.droits.get(
        TypeDroits.tailleCirconstance,
      ),
      tailleCommentaire: GApplication.droits.get(TypeDroits.tailleCommentaire),
    };
    this.saisieVise = [
      EGenreEspace.Administrateur,
      EGenreEspace.PrimDirection,
    ].includes(GEtatUtilisateur.GenreEspace);
    this.uniquementMesIncidents = this.saisieVise
      ? false
      : GEtatUtilisateur.getUniquementMesIncidents();
    this.uniquementNonRegle = GEtatUtilisateur.getUniquementNonRegle();
    this.nrIncidentSelectionne = undefined;
    GEtatUtilisateur.setNrIncidentSelectionne(this.nrIncidentSelectionne);
    $.extend(true, this._autorisations, {
      acces: GApplication.droits.get(TypeDroits.incidents.acces),
      uniquementMesIncidentsSignales: GApplication.droits.get(
        TypeDroits.incidents.uniquementMesIncidentsSignales,
      ),
      saisie: GApplication.droits.get(TypeDroits.incidents.saisie),
      publier: GApplication.droits.get(TypeDroits.incidents.publier),
    });
    this._autorisations.publierDossierVS = GApplication.droits.get(
      TypeDroits.dossierVS.publierDossiersVS,
    );
    this._autorisations.saisiePunitions = {
      acces: GApplication.droits.get(TypeDroits.punition.acces),
      saisie: GApplication.droits.get(TypeDroits.punition.saisie),
      avecPublicationPunitions:
        GApplication.droits.get(TypeDroits.punition.avecPublicationPunitions) &&
        !GApplication.droits.get(TypeDroits.estEnConsultation),
      creerMotifIncidentPunitionSanction: GApplication.droits.get(
        TypeDroits.creerMotifIncidentPunitionSanction,
      ),
    };
    this.idInterfaceIncidents = "InterfaceIncidents";
    this.idReponse = GUID.getId();
    this.idBandeauDroite = GUID.getId();
    this.idLabelMotifs = GUID.getId();
    this.idLabelActions = GUID.getId();
    this.listeToutesClassesDisponibles = GEtatUtilisateur.getListeClasses({
      avecClasse: true,
      uniquementClasseEnseignee: true,
    });
    this.donnees = { classes: this.listeToutesClassesDisponibles };
    this.listePJ = new ObjetListeElements();
    this._initColonnes();
  }
  construireInstances() {
    this.identSelecteurClasses = this.add(
      ObjetSelecteurClasseGpe,
      surEvenementSelecteurFiltreClasse,
      _initialiserSelecteurFiltreClasse,
    );
    this.identIncidents = this.add(
      ObjetListe,
      _evntListe.bind(this),
      _initListe.bind(this),
    );
    this.identProtagonistes = this.add(
      ObjetListe,
      _evntProtagonistes.bind(this),
      _initProtagonistes.bind(this),
    );
    this.identDate = this.add(
      ObjetCelluleDate,
      _evntSurDate.bind(this),
      _initDate.bind(this),
    );
    this.identCMS_Motifs = this.add(
      ObjetCelluleMultiSelectionMotif,
      _evnCMS_Motifs.bind(this),
      _initCMS_Motifs.bind(this),
    );
    this.identSelecteurPJ = this.add(
      ObjetSelecteurPJ,
      _evntSelecteurPJ.bind(this),
      _initSelecteurPJ.bind(this),
    );
    this.identCMS_Actions = this.add(
      ObjetCelluleMultiSelection,
      _evnCMS_Actions.bind(this),
      _initCMS_Actions.bind(this),
    );
    this.identFenetreLieux = this.addFenetre(
      ObjetFenetre_Liste,
      _evntFenetreLieux.bind(this),
      _initFenetreLieux.bind(this),
    );
    this.identFenetreSignalement = this.addFenetre(
      ObjetFenetre_SignalementIncident,
      _evntFenetreSignalement.bind(this),
      _initFenetreSignalement.bind(this),
    );
    this.identFenetreSousCategorieDossier = this.addFenetre(
      ObjetFenetre_Liste,
      _evntFenetreSousCategorieDossier.bind(this),
      _initFenetreSousCategorieDossier.bind(this),
    );
    this.identFenetreSelectPublic = this.addFenetre(
      ObjetFenetre_SelectionPublic,
      _evenementFenetreIndividu.bind(this),
      _initFenetreSelectPublic,
    );
    this.identFenetreSelectPunition = this.addFenetre(
      ObjetFenetre_Liste,
      _evntFenetreSelectPunition.bind(this),
      _initFenetreSelectPunition.bind(this),
    );
    this.identFenetreMesureIncident = this.addFenetre(
      ObjetFenetre_MesureIncident,
      _evntFenetreMesureIncident.bind(this),
      _initFenetreMesureIncident.bind(this),
    );
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Autre;
    this.avecBandeau = true;
    this.AddSurZone = [
      this.identSelecteurClasses,
      {
        html:
          '<ie-checkbox class="GrandEspaceDroit" ie-model="filtres.checkboxNonReglesAdm">' +
          GTraductions.getValeur("incidents.uniquementNonRA") +
          "</ie-checkbox>",
      },
      {
        html:
          '<ie-checkbox ie-model="filtres.checkboxMesIncidents" ie-display="filtres.estVisibleCheckboxMesIncidents">' +
          GTraductions.getValeur("incidents.uniquementMesIncidents") +
          "</ie-checkbox>",
      },
    ];
  }
  _initColonnes() {
    const lTabColonnesParDefaut = [
      { id: DonneesListe_Incidents.colonnes.date },
      { id: DonneesListe_Incidents.colonnes.heure },
      { id: DonneesListe_Incidents.colonnes.motifs },
      { id: DonneesListe_Incidents.colonnes.lieu },
      { id: DonneesListe_Incidents.colonnes.details },
      { id: DonneesListe_Incidents.colonnes.gravite, visible: false },
      { id: DonneesListe_Incidents.colonnes.rapporteur, visible: false },
      { id: DonneesListe_Incidents.colonnes.auteurs, visible: false },
      { id: DonneesListe_Incidents.colonnes.victimes, visible: false },
      { id: DonneesListe_Incidents.colonnes.temoins, visible: false },
      { id: DonneesListe_Incidents.colonnes.vise },
      { id: DonneesListe_Incidents.colonnes.regle },
      { id: DonneesListe_Incidents.colonnes.faitDeViolence, visible: false },
      { id: DonneesListe_Incidents.colonnes.actionsEnvisagees, visible: false },
    ];
    this.paramColonnes =
      GApplication.parametresUtilisateur.get("Incidents.Cols");
    if (!this.paramColonnes) {
      this.paramColonnes = lTabColonnesParDefaut;
      GApplication.parametresUtilisateur.set(
        "Incidents.Cols",
        this.paramColonnes,
      );
    } else if (lTabColonnesParDefaut.length > this.paramColonnes.length) {
      lTabColonnesParDefaut.forEach((aColonneParDefaut, aIndex) => {
        let lEstPresente = false;
        this.paramColonnes.forEach((aColonne) => {
          if (aColonneParDefaut.id === aColonne.id) {
            lEstPresente = true;
          }
        });
        if (!lEstPresente) {
          this.paramColonnes.splice(aIndex, 0, aColonneParDefaut);
        }
      });
      GApplication.parametresUtilisateur.set(
        "Incidents.Cols",
        this.paramColonnes,
      );
    }
  }
  _evntSurCreationMotif(aCol) {
    switch (aCol) {
      case DonneesListe_SelectionMotifs.colonnes.incident:
        this.getInstance(this.identFenetreSousCategorieDossier).setDonnees(
          new DonneesListe_CategoriesMotif(
            this.donneesSaisie.listeSousCategorieDossier,
          ),
        );
        return true;
      default:
        break;
    }
  }
  construireStructureAffichageAutre() {
    const H = [];
    const lWidth = _getWidthDeListe.call(this);
    const lHeight = 28;
    H.push(
      `<div id="${this.idInterfaceIncidents}" style="width:100%;height:100%;max-height:calc(100% - 0.8rem)">`,
    );
    H.push(`  <div class="ly-cols-2">`);
    H.push(
      `    <div id="${this.getNomInstance(this.identIncidents)}" class="aside-content p-right" style="${GStyle.composeWidth(lWidth)};max-width:50%;">`,
    );
    H.push(`    </div>`);
    H.push(
      `    <div id="${this.idReponse}'_section" class="main-content cols">`,
    );
    H.push(
      `      <div class="fix-bloc m-bottom flex-contain" style="height:${lHeight}px;">${composeBandeauDroite.bind(this)()}</div>`,
    );
    H.push(
      `      <div class="fluid-bloc full-height">${_composeDetail.bind(this)()}</div>`,
    );
    H.push(`    </div>`);
    H.push(`  </div>`);
    H.push(`</div>`);
    return H.join("");
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      filtres: {
        checkboxNonReglesAdm: {
          getValue: function () {
            return aInstance.uniquementNonRegle;
          },
          setValue: function () {
            aInstance.uniquementNonRegle = !aInstance.uniquementNonRegle;
            const lInstanceListeIncidents = aInstance.getInstance(
              aInstance.identIncidents,
            );
            lInstanceListeIncidents.getDonneesListe().uniquementNonRegle =
              aInstance.uniquementNonRegle;
            GEtatUtilisateur.setUniquementNonRegle(
              aInstance.uniquementNonRegle,
            );
            let lGarderSelection = false;
            if (
              !aInstance.uniquementNonRegle ||
              !aInstance.incident ||
              aInstance.incident.estRA
            ) {
              lGarderSelection = true;
            } else {
              aInstance.incident = undefined;
              _actualiserIncident.call(aInstance);
            }
            lInstanceListeIncidents.actualiser(lGarderSelection);
          },
        },
        estVisibleCheckboxMesIncidents: function () {
          return (
            !aInstance.saisieVise &&
            !aInstance._autorisations.uniquementMesIncidentsSignales
          );
        },
        checkboxMesIncidents: {
          getValue: function () {
            return aInstance.uniquementMesIncidents;
          },
          setValue: function () {
            aInstance.uniquementMesIncidents =
              !aInstance.uniquementMesIncidents;
            const lInstanceListeIncidents = aInstance.getInstance(
              aInstance.identIncidents,
            );
            lInstanceListeIncidents.getDonneesListe().uniquementMesIncidents =
              aInstance.uniquementMesIncidents;
            GEtatUtilisateur.setUniquementMesIncidents(
              aInstance.uniquementMesIncidents,
            );
            let lGarderSelection = false;
            if (
              !aInstance.uniquementMesIncidents ||
              !aInstance.incident ||
              aInstance.incident.estRapporteur
            ) {
              lGarderSelection = true;
            } else {
              aInstance.incident = undefined;
              _actualiserIncident.call(aInstance);
            }
            lInstanceListeIncidents.actualiser(lGarderSelection);
          },
        },
      },
      auteur: {
        getValue: function () {
          return aInstance.incident && aInstance.incident.rapporteur
            ? aInstance.incident.rapporteur.Libelle
            : "";
        },
        getDisabled: function () {
          return true;
        },
      },
      gravite: {
        getValue: function () {
          return aInstance.incident ? aInstance.incident.gravite : 1;
        },
        setValue: function (aValue) {
          if (aValue) {
            try {
              const lValue = parseInt(aValue);
              if (lValue > 0 && lValue < 6) {
                aInstance.incident.gravite = lValue;
                aInstance.incident.setEtat(EGenreEtat.Modification);
                aInstance.setEtatSaisie(true);
              }
            } catch (e) {}
          } else if (aValue === "") {
            aInstance.incident.gravite = "";
          }
        },
        exitChange: function () {
          if (aInstance.incident.gravite === "") {
            aInstance.incident.gravite = 1;
            aInstance.incident.setEtat(EGenreEtat.Modification);
            aInstance.setEtatSaisie(true);
          }
        },
        getDisabled: function () {
          return (
            !aInstance._autorisations.saisie ||
            !aInstance.incident ||
            !aInstance.incident.estEditable
          );
        },
      },
      getFaitDeViolence: {
        getValue: function () {
          return aInstance.incident ? aInstance.incident.faitDeViolence : false;
        },
        setValue: function (aValue) {
          if (!!aInstance.incident) {
            aInstance.incident.faitDeViolence = aValue;
            aInstance.incident.setEtat(EGenreEtat.Modification);
            aInstance.setEtatSaisie(true);
            aInstance.getInstance(aInstance.identIncidents).actualiser(true);
          }
        },
        getDisabled: function () {
          return (
            !aInstance._autorisations.saisie ||
            !aInstance.incident ||
            !aInstance.incident.avecEditFaitDeViolence
          );
        },
      },
      heure: {
        getValue: function () {
          return aInstance.incident
            ? GDate.formatDate(aInstance.incident.dateheure, "%hh:%mm")
            : "";
        },
        setValue: function (aValue, aParamsSetter) {
          const lDate = new Date(
            aInstance.incident.dateheure.getFullYear(),
            aInstance.incident.dateheure.getMonth(),
            aInstance.incident.dateheure.getDate(),
            aParamsSetter.time.heure,
            aParamsSetter.time.minute,
          );
          aInstance.incident.dateheure = lDate;
          aInstance.incident.setEtat(EGenreEtat.Modification);
          aInstance.setEtatSaisie(true);
        },
        exitChange: function () {
          aInstance.getInstance(aInstance.identIncidents).actualiser(true);
        },
        getDisabled: function () {
          return (
            !aInstance._autorisations.saisie ||
            !aInstance.incident ||
            !aInstance.incident.estEditable
          );
        },
      },
      lieu: {
        init: function (aCombo) {
          const lOptions = {
            mode: EGenreSaisie.Combo,
            celluleAvecTexteHtml: true,
            longueur: 133,
            classTexte: "",
            hauteur: 17,
            deroulerListeSeulementSiPlusieursElements: false,
            initAutoSelectionAvecUnElement: false,
            labelWAICellule: GTraductions.getValeur("WAI.SelectionLieu"),
            getClassElement: function (aParams) {
              return aParams.element.getNumero() === 0 ||
                aParams.element.getNumero() === -1
                ? "titre-liste"
                : "";
            },
          };
          aCombo.setOptionsObjetSaisie(lOptions);
          aInstance.combo = aCombo;
        },
        getDonnees: function () {
          if (aInstance.donneesSaisie && aInstance.donneesSaisie.lieux) {
            return aInstance.donneesSaisie.lieux;
          }
        },
        getIndiceSelection: function () {
          return aInstance._indiceLieu;
        },
        event: function (aParametres) {
          if (
            aParametres.genreEvenement ===
              EGenreEvenementObjetSaisie.selection &&
            aInstance.incident &&
            aInstance._autorisations.saisie &&
            aInstance.incident.estEditable
          ) {
            aInstance._indiceLieu = aParametres.indice;
            if (
              !aInstance.incident.lieu ||
              aParametres.element.getNumero() !==
                aInstance.incident.lieu.getNumero()
            ) {
              aInstance.incident.lieu = aParametres.element;
              aInstance.getInstance(aInstance.identIncidents).actualiser(true);
              aInstance.incident.setEtat(EGenreEtat.Modification);
              aInstance.setEtatSaisie(true);
            }
          }
        },
        getDisabled: function () {
          return (
            !aInstance._autorisations.saisie ||
            !aInstance.incident ||
            !aInstance.incident.estEditable
          );
        },
      },
      details: {
        getValue: function () {
          return aInstance.incident ? aInstance.incident.Libelle : "";
        },
        setValue: function (aValue) {
          aInstance.incident.Libelle = aValue;
          aInstance.incident.setEtat(EGenreEtat.Modification);
          aInstance.setEtatSaisie(true);
        },
        eventChange: function () {
          aInstance.getInstance(aInstance.identIncidents).actualiser(true);
        },
        getDisabled: function () {
          return (
            !aInstance._autorisations.saisie ||
            !aInstance.incident ||
            !aInstance.incident.estEditable
          );
        },
      },
      detailActionEnvisagee: {
        getValue: function () {
          return aInstance.incident
            ? aInstance.incident.detailActionEnvisagee
            : "";
        },
        setValue: function (aValue) {
          aInstance.incident.detailActionEnvisagee = aValue;
          aInstance.incident.setEtat(EGenreEtat.Modification);
          aInstance.setEtatSaisie(true);
        },
        eventChange: function () {
          aInstance.getInstance(aInstance.identIncidents).actualiser(true);
        },
        getDisabled: function () {
          return (
            !aInstance._autorisations.saisie ||
            !aInstance.incident ||
            !aInstance.incident.estEditable
          );
        },
      },
      boutonInformation: {
        event: function () {
          aInstance.gestionFenetreEditionInformation();
        },
        getDisabled() {
          return !aInstance.incident || !aInstance.incident.estEditable;
        },
      },
      messageEnvoye: function () {
        return aInstance.incident && aInstance.incident.messageEnvoye;
      },
    });
  }
  gestionFenetreEditionInformation() {
    if (GEtatUtilisateur.EtatSaisie) {
      this.demandeOuvertureFenetreEditionInformation = true;
      this.valider();
    } else {
      this.ouvrirFenetreEditionInformation();
    }
  }
  ouvrirFenetreEditionInformation() {
    const lFenetre = ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_EditionActualite,
      {
        pere: this,
        evenement: function (aGenreBouton, aParam) {
          if (aGenreBouton === 1 && aParam.creation && aParam.incident) {
            aParam.incident.messageEnvoye = true;
          }
        },
        initialiser: function (aInstance) {
          aInstance.setOptionsFenetre({
            titre: GTraductions.getValeur("actualites.creerInfo"),
            largeur: 750,
            hauteur: 700,
            listeBoutons: [
              GTraductions.getValeur("Annuler"),
              GTraductions.getValeur("Valider"),
            ],
          });
        },
      },
    );
    lFenetre.setDonnees({
      donnee: null,
      creation: true,
      genreReponse: TypeGenreReponseInternetActualite.AvecAR,
      forcerAR: GApplication.droits.get(
        TypeDroits.fonctionnalites.forcerARInfos,
      ),
      genresPublic: [EGenreRessource.Enseignant, EGenreRessource.Personnel],
      incident: this.incident,
    });
  }
  recupererDonnees() {
    this.setEtatSaisie(false);
    this.getInstance(this.identSelecteurClasses).setDonnees({
      listeSelection: this.donnees.classes,
      listeTotale: this.listeToutesClassesDisponibles,
    });
    this.getInstance(this.identSelecteurClasses).actualiserLibelle();
    $("#" + this.idReponse.escapeJQ() + "_detail").hide();
    _setTexteBandeau.bind(this)(
      GTraductions.getValeur("incidents.selectionnez"),
    );
    this.nrIncidentSelectionnee = GEtatUtilisateur.getNrIncidentSelectionne();
    if (!this.nrIncidentSelectionnee) {
      Requetes(
        "ListesSaisiesPourIncidents",
        this,
        _actionApresRequeteListesSaisiesPourIncidents,
      ).lancerRequete({
        avecLieux: true,
        avecSalles: true,
        avecMotifs: true,
        avecActions: true,
        avecSousCategorieDossier: this._autorisations.saisie,
        avecPunitions: this._autorisations.saisie,
        avecSanctions: false,
        avecProtagonistes: this._autorisations.saisie,
      });
    } else {
      Requetes("Incidents", this, _actionApresRequeteIncidents).lancerRequete(
        getParametresRequetesIncidents.call(this),
      );
    }
  }
  valider() {
    const lObjetSaisie = {
      incidents: this.incidents,
      listeFichiers: this.listePJ,
    };
    this.actionValidationIncidents = true;
    new ObjetRequeteSaisieIncidents(this, this.actionSurValidation)
      .addUpload({ listeFichiers: this.listePJ })
      .lancerRequete(lObjetSaisie);
  }
}
function _initialiserSelecteurFiltreClasse(aInstance) {
  aInstance.setOptions({ avecSelectionObligatoire: true });
}
function surEvenementSelecteurFiltreClasse(aParam) {
  this.donnees.classes = aParam.listeSelection;
  this.recupererDonnees();
}
function _setTexteBandeau(aMessage) {
  GHtml.setHtml(this.idBandeauDroite + "_Texte", aMessage);
}
function _getWidthDeColonne(aColonne) {
  switch (aColonne) {
    case DonneesListe_Incidents.colonnes.date:
      return 62;
    case DonneesListe_Incidents.colonnes.heure:
      return 40;
    case DonneesListe_Incidents.colonnes.motifs:
      return 150;
    case DonneesListe_Incidents.colonnes.lieu:
      return 120;
    case DonneesListe_Incidents.colonnes.details:
      return 150;
    case DonneesListe_Incidents.colonnes.auteurs:
      return 120;
    case DonneesListe_Incidents.colonnes.victimes:
      return 120;
    case DonneesListe_Incidents.colonnes.temoins:
      return 120;
    case DonneesListe_Incidents.colonnes.vise:
      return 30;
    case DonneesListe_Incidents.colonnes.regle:
      return 28;
    case DonneesListe_Incidents.colonnes.faitDeViolence:
      return 28;
    case DonneesListe_Incidents.colonnes.actionsEnvisagees:
      return 100;
    case DonneesListe_Incidents.colonnes.rapporteur:
      return 120;
    case DonneesListe_Incidents.colonnes.gravite:
      return 40;
    default:
      return 0;
  }
}
function _initListe(aInstance) {
  const lColonnes = [];
  lColonnes.push({
    id: DonneesListe_Incidents.colonnes.date,
    taille: _getWidthDeColonne.call(this, DonneesListe_Incidents.colonnes.date),
    titre: GTraductions.getValeur("incidents.date"),
    nonDeplacable: true,
    nonSupprimable: true,
  });
  lColonnes.push({
    id: DonneesListe_Incidents.colonnes.heure,
    taille: _getWidthDeColonne.call(
      this,
      DonneesListe_Incidents.colonnes.heure,
    ),
    titre: GTraductions.getValeur("incidents.heure"),
    nonDeplacable: true,
    nonSupprimable: true,
  });
  lColonnes.push({
    id: DonneesListe_Incidents.colonnes.motifs,
    taille: _getWidthDeColonne.call(
      this,
      DonneesListe_Incidents.colonnes.motifs,
    ),
    titre: GTraductions.getValeur("incidents.motifs"),
    nonDeplacable: true,
    nonSupprimable: true,
  });
  lColonnes.push({
    id: DonneesListe_Incidents.colonnes.lieu,
    taille: _getWidthDeColonne.call(this, DonneesListe_Incidents.colonnes.lieu),
    titre: GTraductions.getValeur("incidents.lieu"),
  });
  lColonnes.push({
    id: DonneesListe_Incidents.colonnes.details,
    taille: _getWidthDeColonne.call(
      this,
      DonneesListe_Incidents.colonnes.details,
    ),
    titre: GTraductions.getValeur("incidents.details"),
  });
  lColonnes.push({
    id: DonneesListe_Incidents.colonnes.gravite,
    taille: _getWidthDeColonne.call(
      this,
      DonneesListe_Incidents.colonnes.gravite,
    ),
    titre: GTraductions.getValeur("incidents.gravite"),
  });
  lColonnes.push({
    id: DonneesListe_Incidents.colonnes.rapporteur,
    taille: _getWidthDeColonne.call(
      this,
      DonneesListe_Incidents.colonnes.rapporteur,
    ),
    titre: GTraductions.getValeur("incidents.rapporteur"),
  });
  lColonnes.push({
    id: DonneesListe_Incidents.colonnes.auteurs,
    taille: _getWidthDeColonne.call(
      this,
      DonneesListe_Incidents.colonnes.auteurs,
    ),
    titre: GTraductions.getValeur("incidents.auteurs"),
  });
  lColonnes.push({
    id: DonneesListe_Incidents.colonnes.victimes,
    taille: _getWidthDeColonne.call(
      this,
      DonneesListe_Incidents.colonnes.victimes,
    ),
    titre: GTraductions.getValeur("incidents.victimes"),
  });
  lColonnes.push({
    id: DonneesListe_Incidents.colonnes.temoins,
    taille: _getWidthDeColonne.call(
      this,
      DonneesListe_Incidents.colonnes.temoins,
    ),
    titre: GTraductions.getValeur("incidents.temoins"),
  });
  lColonnes.push({
    id: DonneesListe_Incidents.colonnes.vise,
    taille: _getWidthDeColonne.call(this, DonneesListe_Incidents.colonnes.vise),
    titre: GTraductions.getValeur("incidents.vise"),
  });
  lColonnes.push({
    id: DonneesListe_Incidents.colonnes.regle,
    taille: _getWidthDeColonne.call(
      this,
      DonneesListe_Incidents.colonnes.regle,
    ),
    titre: GTraductions.getValeur("incidents.regle"),
  });
  lColonnes.push({
    id: DonneesListe_Incidents.colonnes.faitDeViolence,
    taille: _getWidthDeColonne.call(
      this,
      DonneesListe_Incidents.colonnes.faitDeViolence,
    ),
    titre: GTraductions.getValeur("incidents.faitDeViolence"),
  });
  lColonnes.push({
    id: DonneesListe_Incidents.colonnes.actionsEnvisagees,
    taille: _getWidthDeColonne.call(
      this,
      DonneesListe_Incidents.colonnes.actionsEnvisagees,
    ),
    titre: GTraductions.getValeur("incidents.actionsEnvisagees"),
    hint: GTraductions.getValeur("incidents.hintActionsEnvisagees"),
  });
  const lOptions = {
    colonnes: lColonnes,
    gestionModificationColonnes: {
      getColonnes: function () {
        return GApplication.parametresUtilisateur.get("Incidents.Cols");
      }.bind(this),
      setColonnes: function (aColonnes) {
        this.paramColonnes = aColonnes;
        const lWidth = _getWidthDeListe.call(this);
        GPosition.setWidth(this.getNomInstance(this.identIncidents), lWidth);
        GApplication.parametresUtilisateur.set("Incidents.Cols", aColonnes);
      }.bind(this),
    },
    scrollHorizontal: true,
    boutons: [{ genre: ObjetListe.typeBouton.parametrer }],
  };
  if (this._autorisations.saisie) {
    $.extend(lOptions, {
      titreCreation: GTraductions.getValeur("incidents.creation"),
      listeCreations: 1,
      avecLigneCreation: true,
    });
  }
  aInstance.setOptionsListe(lOptions, true);
  aInstance.controleur.inputTime = {
    getValueInit: function (aNumero, aEtat) {
      const lNumero =
        aEtat === EGenreEtat.Creation ? parseInt(aNumero) : aNumero;
      const lElement = this.instance
        .getListeArticles()
        .getElementParNumero(lNumero);
      return lElement ? GDate.formatDate(lElement.dateheure, "%hh:%mm") : "";
    },
    exitChange: function (aNumero, aEtat, aValue, aParams) {
      if (!aParams.time.ok) {
        return;
      }
      const lNumero =
        aEtat === EGenreEtat.Creation ? parseInt(aNumero) : aNumero;
      const lElement = this.instance
        .getListeArticles()
        .getElementParNumero(lNumero);
      const lDate = new Date(
        lElement.dateheure.getFullYear(),
        lElement.dateheure.getMonth(),
        lElement.dateheure.getDate(),
        aParams.time.heure,
        aParams.time.minute,
      );
      lElement.dateheure = lDate;
      lElement.setEtat(EGenreEtat.Modification);
      this.instance.Pere.setEtatSaisie(true);
    },
  };
}
function _initProtagonistes(aInstance) {
  const lColonnes = [];
  lColonnes.push({
    id: DonneesListe_Protagonistes.colonnes.identite,
    titre: GTraductions.getValeur("incidents.protagonistes.identite"),
    taille: 200,
  });
  lColonnes.push({
    id: DonneesListe_Protagonistes.colonnes.implication,
    titre: GTraductions.getValeur("incidents.protagonistes.implication"),
    taille: 80,
  });
  lColonnes.push({
    id: DonneesListe_Protagonistes.colonnes.avecSanction,
    titre: [
      {
        libelle: GTraductions.getValeur("incidents.protagonistes.suiteADonner"),
        avecFusionColonne: true,
      },
      {
        libelle: GTraductions.getValeur("incidents.protagonistes.oui"),
        title: GTraductions.getValeur("incidents.protagonistes.hintOui"),
      },
    ],
    taille: 20,
  });
  lColonnes.push({
    id: DonneesListe_Protagonistes.colonnes.sansSanction,
    titre: [
      {
        libelle: GTraductions.getValeur("incidents.protagonistes.suiteADonner"),
        avecFusionColonne: true,
      },
      {
        libelle: GTraductions.getValeur("incidents.protagonistes.non"),
        title: GTraductions.getValeur("incidents.protagonistes.hintNon"),
      },
    ],
    taille: 20,
  });
  lColonnes.push({
    id: DonneesListe_Protagonistes.colonnes.mesure,
    titre: [
      {
        libelle: GTraductions.getValeur("incidents.protagonistes.suiteADonner"),
        avecFusionColonne: true,
      },
      { libelle: GTraductions.getValeur("incidents.protagonistes.mesures") },
    ],
    taille: 170,
  });
  lColonnes.push({
    id: DonneesListe_Protagonistes.colonnes.date,
    titre: [
      {
        libelle: GTraductions.getValeur("incidents.protagonistes.suiteADonner"),
        avecFusionColonne: true,
      },
      { libelle: GTraductions.getValeur("incidents.protagonistes.date") },
    ],
    taille: 60,
  });
  if (!!this._autorisations.publierDossierVS) {
    lColonnes.push({
      id: DonneesListe_Protagonistes.colonnes.pubDossier,
      titre: {
        libelleHtml: '<i class="icon_folder_close mix-icon_ok i-green"></i>',
      },
      hint: GTraductions.getValeur("incidents.protagonistes.pubDossier"),
      taille: 20,
    });
  }
  if (!!this._autorisations.publier) {
    lColonnes.push({
      id: DonneesListe_Protagonistes.colonnes.publication,
      titre: {
        libelleHtml:
          '<i class="icon_info_sondage_publier mix-icon_ok i-green"></i>',
      },
      hint: GTraductions.getValeur("incidents.protagonistes.publier"),
      taille: 20,
    });
    lColonnes.push({
      id: DonneesListe_Protagonistes.colonnes.vuLe,
      titre: GTraductions.getValeur("incidents.protagonistes.vuLe"),
      taille: 70,
    });
  }
  const lOptions = { colonnes: lColonnes };
  if (this._autorisations.saisie) {
    $.extend(lOptions, {
      titreCreation: GTraductions.getValeur("incidents.protagonistes.ajouter"),
      listeCreations: 1,
      avecLigneCreation: true,
      hauteurAdapteContenu: true,
      getHauteurMaxAdapteListe: function () {
        return 242;
      },
    });
  }
  aInstance.setOptionsListe(lOptions);
}
function _initCMS_Motifs(aInstance) {
  aInstance.setOptions({
    largeurBouton: 302,
    classTexte: "",
    gestionnaireMotifs: { avecAuMoinsUnEltSelectionne: true },
    labelledById: this.idLabelMotifs,
  });
}
function _initDate(aInstance) {
  aInstance.setOptionsObjetCelluleDate({ classeCSSTexte: " " });
  aInstance.setControleNavigation(false);
}
function _initSelecteurPJ(aInstance) {
  aInstance.setOptions({
    genrePJ: null,
    genreRessourcePJ: EGenreRessource.RelationIncidentFichierExterne,
    title: GTraductions.getValeur("AjouterDesPiecesJointes"),
    maxFiles: 0,
    libelleSelecteur: GTraductions.getValeur("AjouterDesPiecesJointes"),
    avecBoutonSupp: true,
    avecCmdAjoutNouvelle: false,
    avecMenuSuppressionPJ: false,
    maxSize: GApplication.droits.get(TypeDroits.tailleMaxDocJointEtablissement),
  });
  aInstance.setActif(this._autorisations.saisie);
}
function _initCMS_Actions(aInstance) {
  aInstance.setOptions({
    largeurBouton: 302,
    classTexte: "",
    titreFenetre: GTraductions.getValeur("fenetreActions.titre"),
    titresColonnes: ["", GTraductions.getValeur("fenetreActions.libelle")],
    taillesColonnes: ["20", "100%"],
    avecLigneCreation: false,
    creations: null,
    listeBoutons: [
      GTraductions.getValeur("Annuler"),
      GTraductions.getValeur("Valider"),
    ],
    donneesListe: DonneesListe_Actions,
    colonnesCachees: [],
    paramListe: { avecCreation: false },
    largeurFenetre: 350,
    hauteurFenetre: 400,
    describedById: this.idLabelActions,
  });
}
function _initFenetreLieux(aInstance) {
  const lParamsListe = {
    tailles: ["100%"],
    editable: false,
    optionsListe: {
      skin: ObjetListe.skin.flatDesign,
      boutons: [
        { genre: ObjetListe.typeBouton.deployer },
        { genre: ObjetListe.typeBouton.rechercher },
      ],
    },
  };
  aInstance.setOptionsFenetre({
    titre: GTraductions.getValeur("incidents.selectLieux"),
    largeur: 300,
    hauteur: 400,
    listeBoutons: [
      GTraductions.getValeur("Annuler"),
      GTraductions.getValeur("Valider"),
    ],
  });
  aInstance.paramsListe = lParamsListe;
}
function _initFenetreSousCategorieDossier(aInstance) {
  const lParamsListe = { tailles: ["100%"], editable: false };
  aInstance.setOptionsFenetre({
    titre: GTraductions.getValeur("dossierVS.titreIncident"),
    largeur: 300,
    hauteurMin: 160,
    listeBoutons: [
      GTraductions.getValeur("Annuler"),
      GTraductions.getValeur("Valider"),
    ],
  });
  aInstance.paramsListe = lParamsListe;
}
function _initFenetreSignalement(aInstance) {
  const lAvecCreationMotifs = GApplication.droits.get(
    TypeDroits.creerMotifIncidentPunitionSanction,
  );
  const lParamsListe = {
    titres: [
      "",
      GTraductions.getValeur("fenetreMotifs.motif"),
      TypeFusionTitreListe.FusionGauche,
      GTraductions.getValeur("fenetreMotifs.genre"),
    ],
    tailles: ["20", "100%", "15", "150"],
    avecLigneCreation: !!lAvecCreationMotifs,
    creations: lAvecCreationMotifs
      ? [
          DonneesListe_SelectionMotifs.colonnes.motif,
          DonneesListe_SelectionMotifs.colonnes.incident,
        ]
      : null,
    callbckCreation: this._evntSurCreationMotif.bind(this),
    editable: true,
    optionsListe: { colonnesSansBordureDroit: [false, true, false, false] },
  };
  aInstance.setOptionsFenetre({
    titre: GTraductions.getValeur("incidents.signalement.titre"),
    largeur: 500,
    hauteur: 450,
    listeBoutons: [
      GTraductions.getValeur("Annuler"),
      GTraductions.getValeur("Valider"),
    ],
    modeActivationBtnValider:
      aInstance.modeActivationBtnValider.auMoinsUnEltSelectionne,
  });
  aInstance.paramsListe = lParamsListe;
}
function _initFenetreSelectPublic(aInstance) {
  aInstance.setOptions({ selectionCumul: false });
}
function _initFenetreSelectPunition(aInstance) {
  const lParamsListe = {
    tailles: ["100%"],
    editable: false,
    optionsListe: { skin: ObjetListe.skin.flatDesign },
  };
  aInstance.setOptionsFenetre({
    titre: GTraductions.getValeur("incidents.selectMesuresDisciplinaire"),
    largeur: 350,
    hauteur: 275,
    listeBoutons: [
      GTraductions.getValeur("Annuler"),
      GTraductions.getValeur("Valider"),
    ],
  });
  aInstance.paramsListe = lParamsListe;
}
function _initFenetreMesureIncident(aInstance) {
  aInstance.setOptionsFenetre({
    titre: "",
    largeur: 620,
    hauteur: 270,
    listeBoutons: [GTraductions.getValeur("Fermer")],
  });
}
function _evntListe(aParametres, aGenreEvenementListe, aColonne, aLigne) {
  switch (aGenreEvenementListe) {
    case EGenreEvenementListe.Selection:
      if (
        !this.incident ||
        !this.nrIncidentSelectionne ||
        this.nrIncidentSelectionne !== this.incidents.getNumero(aLigne) ||
        this.actionValidationIncidents
      ) {
        this.actionValidationIncidents = false;
        this.incident = this.incidents.get(aLigne);
        this._protagoniste = undefined;
        _actualiserIncident.bind(this)();
      }
      break;
    case EGenreEvenementListe.Creation:
      this.incidentEnCreation = _initNouveauIncident();
      this.tempMotifs = MethodesObjet.dupliquer(this.donneesSaisie.motifs);
      this.getInstance(this.identFenetreSignalement).setDonnees({
        objetDonneesListe: new DonneesListe_SelectionMotifs(this.tempMotifs, {
          avecCreation: GApplication.droits.get(
            TypeDroits.creerMotifIncidentPunitionSanction,
          ),
          avecEdition: GApplication.droits.get(
            TypeDroits.creerMotifIncidentPunitionSanction,
          ),
        }),
        motifs: this.tempMotifs,
        incident: this.incidentEnCreation,
        avecValidation: false,
        incidents: MethodesObjet.dupliquer(this.incidents),
        listePJ: this.listePJ,
      });
      return EGenreEvenementListe.Creation;
    case EGenreEvenementListe.Edition:
      if (!this.incident) {
        break;
      }
      switch (aParametres.idColonne) {
        case DonneesListe_Incidents.colonnes.motifs:
          this.getInstance(this.identCMS_Motifs).surCellule(EEvent.SurClick);
          break;
        case DonneesListe_Incidents.colonnes.lieu:
          this.getInstance(this.identFenetreLieux).setDonnees(
            new ObjetDonneesListeFlatDesign(
              this.donneesSaisie.lieux,
            ).setOptions({
              avecBoutonActionLigne: false,
              avecEvnt_Selection: true,
            }),
          );
          break;
        default:
          break;
      }
      break;
    case EGenreEvenementListe.ApresEdition:
      if (aParametres.idColonne !== DonneesListe_Incidents.colonnes.motifs) {
        this.incident = this.incidents.get(aLigne);
        _actualiserIncident.bind(this)();
      }
      break;
    case EGenreEvenementListe.ApresSuppression:
      this.incident = undefined;
      _actualiserIncident.bind(this)();
      break;
    default:
      break;
  }
}
function _actualiserIncident() {
  if (this.incident) {
    this.nrIncidentSelectionne = this.incident.getNumero();
    if (this.nrIncidentSelectionne) {
      GEtatUtilisateur.setNrIncidentSelectionne(this.nrIncidentSelectionne);
    }
    const lLibelle = GTraductions.getValeur("incidents.declaration", [
      GDate.formatDate(this.incident.dateheure, "%JJ/%MM/%AAAA"),
    ]);
    _setTexteBandeau.bind(this)(lLibelle);
    if (this.incident && this.incident.lieu) {
      this._indiceLieu = this.donneesSaisie.lieux.getIndiceParElement(
        this.incident.lieu,
      );
    } else {
      this._indiceLieu = -1;
    }
    $("#" + this.idReponse.escapeJQ() + "_detail").show();
    const lAvecSaisie =
      this._autorisations.saisie && this.incident && this.incident.estEditable;
    if (lAvecSaisie) {
      this.getInstance(this.identProtagonistes).setOptionsListe({
        listeCreations: 1,
        avecLigneCreation: true,
      });
    } else {
      this.getInstance(this.identProtagonistes).setOptionsListe({
        listeCreations: null,
        avecLigneCreation: false,
      });
    }
    this.getInstance(this.identProtagonistes).setDonnees(
      new DonneesListe_Protagonistes(this.incident.protagonistes, {
        avecSaisie: lAvecSaisie,
        typesProtagonistes: this.donneesSaisie.typesProtagonistes,
        evenementMenuContextuel: _evenementSurMenuContextuelListe.bind(this),
        saisiePunition: this._autorisations.saisiePunitions,
      }),
    );
    this.getInstance(this.identDate).setDonnees(this.incident.dateheure);
    this.getInstance(this.identDate).setActif(lAvecSaisie);
    this.getInstance(this.identCMS_Motifs).setActif(lAvecSaisie);
    this.getInstance(this.identCMS_Motifs).setDonnees(
      this.incident.listeMotifs,
      true,
    );
    const lListePJ = this.incident.documents
      ? this.incident.documents
      : new ObjetListeElements();
    this.getInstance(this.identSelecteurPJ).setActif(lAvecSaisie);
    this.getInstance(this.identSelecteurPJ).setDonnees({
      listePJ: lListePJ,
      listeTotale: new ObjetListeElements(),
      idContextFocus: this.Nom,
    });
    this.getInstance(this.identCMS_Actions).setActif(lAvecSaisie);
    this.getInstance(this.identCMS_Actions).setDonnees(
      this.donneesSaisie.actions,
      this.incident.actionsEnvisagees,
    );
  } else {
    this.nrIncidentSelectionne = null;
    GEtatUtilisateur.setNrIncidentSelectionne();
    $("#" + this.idReponse.escapeJQ() + "_detail").hide();
    _setTexteBandeau.bind(this)(
      GTraductions.getValeur("incidents.selectionnez"),
    );
  }
}
function _evntProtagonistes(aParametres) {
  switch (aParametres.genreEvenement) {
    case EGenreEvenementListe.Selection:
      if (this.incident) {
        this._protagoniste = aParametres.article;
      }
      break;
    case EGenreEvenementListe.Creation:
      break;
    case EGenreEvenementListe.Edition:
      switch (aParametres.idColonne) {
        case DonneesListe_Protagonistes.colonnes.avecSanction:
          if (aParametres.article.avecSanction) {
            GApplication.getMessage().afficher({
              type: EGenreBoiteMessage.Confirmation,
              message: GTraductions.getValeur(
                "incidents.protagonistes.msgConfSuppr",
              ),
              callback: (aGenreAction) => {
                if (aGenreAction === EGenreAction.Valider) {
                  aParametres.article.avecSanction = false;
                  _evntFenetreSelectPunition.call(this, 1, 0, true);
                  this.getInstance(this.identProtagonistes).actualiser();
                }
              },
            });
          } else {
            _afficherFenetreSelectionPunition.call(this);
          }
          break;
        case DonneesListe_Protagonistes.colonnes.sansSanction:
          if (aParametres.article.avecSanction) {
            GApplication.getMessage().afficher({
              type: EGenreBoiteMessage.Confirmation,
              message: GTraductions.getValeur(
                "incidents.protagonistes.msgConfSuppr",
              ),
              callback: (aGenreAction) => {
                if (aGenreAction === EGenreAction.Valider) {
                  aParametres.article.sansSanction = true;
                  aParametres.article.avecSanction = false;
                  _evntFenetreSelectPunition.call(this, 1, 0, true);
                  this.getInstance(this.identProtagonistes).actualiser();
                }
              },
            });
          } else {
            aParametres.article.sansSanction =
              !aParametres.article.sansSanction;
            aParametres.article.avecSanction = false;
            _evntFenetreSelectPunition.call(this, 1, 0, true);
            this.getInstance(this.identProtagonistes).actualiser();
          }
          break;
        case DonneesListe_Protagonistes.colonnes.mesure: {
          _afficherFenetreSelectionPunition.call(this);
          break;
        }
        case DonneesListe_Protagonistes.colonnes.date:
          if (this._protagoniste && this._protagoniste.mesure) {
            if (
              this._protagoniste.mesure &&
              this._protagoniste.mesure.nature.getGenre() ===
                TypeGenrePunition.GP_ExclusionCours &&
              !this._protagoniste.mesure.donneesSaisie
            ) {
              _requeteDonneesSaisieMesure.call(this);
            } else {
              _evenementOuvertureMesureIncident.call(this);
            }
          }
          break;
        default:
          break;
      }
      break;
    case EGenreEvenementListe.ApresEdition:
      if (
        aParametres.idColonne ===
          DonneesListe_Protagonistes.colonnes.pubDossier ||
        aParametres.idColonne ===
          DonneesListe_Protagonistes.colonnes.publication
      ) {
        this.incident.setEtat(EGenreEtat.FilsModification);
        this.setEtatSaisie(true);
      }
      break;
    case EGenreEvenementListe.ApresSuppression:
      if (this.incident) {
        this.getInstance(this.identIncidents).actualiser(true);
        this.incident.setEtat(EGenreEtat.FilsModification);
        this.setEtatSaisie(true);
      }
      break;
    default:
      break;
  }
}
function _requeteDonneesSaisieMesure() {
  Requetes(
    "donneesSaisieMesure",
    this,
    _actionApresRequeteDonneesSaisieMesure,
  ).lancerRequete({
    incident: this.incident,
    protagoniste: this._protagoniste.protagoniste,
  });
}
function _actionApresRequeteDonneesSaisieMesure(aJSON) {
  if (aJSON.durees) {
    this._protagoniste.mesure.donneesSaisie = { durees: aJSON.durees };
    this._protagoniste.mesure.donneesSaisie.accompagnateurs =
      new ObjetListeElements();
    this._protagoniste.mesure.donneesSaisie.accompagnateurs.addElement(
      new ObjetElement("", undefined, -1),
    );
    this._protagoniste.mesure.donneesSaisie.accompagnateurs.add(
      aJSON.accompagnateurs,
    );
  }
  _evenementOuvertureMesureIncident.call(this);
}
function _evenementOuvertureMesureIncident() {
  let lTitre = "";
  if (this._protagoniste && this._protagoniste.mesure) {
    lTitre =
      this._protagoniste.mesure.nature.getLibelle() +
      " " +
      GTraductions.getValeur("De").toLowerCase() +
      " " +
      this._protagoniste.protagoniste.getLibelle();
  }
  this.getInstance(this.identFenetreMesureIncident).setDonnees({
    titre: lTitre,
    mesure: this._protagoniste.mesure,
    avecDossier:
      this._protagoniste.dossier !== null &&
      this._protagoniste.dossier !== undefined,
  });
}
function _evenementSurMenuContextuelListe(aItemMenuContextuel) {
  this._typeProtagoniste = aItemMenuContextuel.data;
  let lGenre = EGenreRessource.Aucune;
  switch (aItemMenuContextuel.getNumero()) {
    case DonneesListe_Protagonistes.genreAction.ajout_Auteur:
      lGenre = EGenreRessource.Eleve;
      break;
    case DonneesListe_Protagonistes.genreAction.ajout_Victime_Eleve:
      lGenre = EGenreRessource.Eleve;
      break;
    case DonneesListe_Protagonistes.genreAction.ajout_Victime_Professeur:
      lGenre = EGenreRessource.Enseignant;
      break;
    case DonneesListe_Protagonistes.genreAction.ajout_Victime_Personnel:
      lGenre = EGenreRessource.Personnel;
      break;
    case DonneesListe_Protagonistes.genreAction.ajout_Temoin_Eleve:
      lGenre = EGenreRessource.Eleve;
      break;
    case DonneesListe_Protagonistes.genreAction.ajout_Temoin_Professeur:
      lGenre = EGenreRessource.Enseignant;
      break;
    case DonneesListe_Protagonistes.genreAction.ajout_Temoin_Personnel:
      lGenre = EGenreRessource.Personnel;
      break;
    default:
      this._typeProtagoniste = null;
      break;
  }
  if (this._typeProtagoniste) {
    new ObjetRequeteListePublics(
      this,
      _evntListePublicApresRequete.bind(this),
    ).lancerRequete({
      genres: [lGenre],
      sansFiltreSurEleve: true,
      avecFonctionPersonnel: true,
    });
  }
}
function _evnCMS_Motifs(aNumeroBouton, aListeDonnees, aListeTot) {
  if (aNumeroBouton === 1) {
    const lArrInitial = this.incident.listeMotifs.getTableauNumeros();
    const lArrNew = aListeDonnees.getTableauNumeros();
    let lLibelleAChange = false;
    for (let i = 0; i < aListeDonnees.count(); i++) {
      const lMotif = aListeDonnees.get(i);
      const lMotifIncident = this.incident.listeMotifs.getElementParNumero(
        lMotif.getNumero(),
      );
      if (
        lMotifIncident &&
        lMotifIncident.getLibelle() !== lMotif.getLibelle()
      ) {
        lLibelleAChange = true;
      }
    }
    if (
      !MethodesTableau.inclus(lArrInitial, lArrNew) ||
      !MethodesTableau.inclus(lArrNew, lArrInitial) ||
      lLibelleAChange
    ) {
      const lAvecMotifFaitDeViolenceAvant =
        this.incident.listeMotifs.getIndiceElementParFiltre((aElement) => {
          return aElement.estFaitDeViolence;
        }) > -1;
      const lAvecMotifDossierObligatoireInitial =
        this.incident.listeMotifs.getIndiceElementParFiltre((aElement) => {
          return aElement.dossierObligatoire;
        }) > -1;
      this.incident.listeMotifs = aListeDonnees;
      const lAvecMotifDossierObligatoire =
        this.incident.listeMotifs.getIndiceElementParFiltre((aElement) => {
          return aElement.dossierObligatoire;
        }) > -1;
      const lAvecMotifFaitDeViolenceApres =
        this.incident.listeMotifs.getIndiceElementParFiltre((aElement) => {
          return aElement.estFaitDeViolence;
        }) > -1;
      if (lAvecMotifFaitDeViolenceAvant !== lAvecMotifFaitDeViolenceApres) {
        if (lAvecMotifFaitDeViolenceAvant === this.incident.faitDeViolence) {
          this.incident.faitDeViolence = lAvecMotifFaitDeViolenceApres;
        }
      }
      const lAvecMotifPublicationDefaut =
        this.incident.listeMotifs.getIndiceElementParFiltre((aElement) => {
          return aElement.publication;
        }) > -1;
      this.incident.protagonistes.parcourir((aElement) => {
        if (!lAvecMotifDossierObligatoire) {
          aElement.dossier = null;
        } else if (
          lAvecMotifDossierObligatoireInitial !== lAvecMotifDossierObligatoire
        ) {
          aElement.dossier = new ObjetElement("");
          aElement.dossier.publication = false;
          aElement.setEtat(EGenreEtat.Modification);
        }
        if (!aElement.publication && lAvecMotifPublicationDefaut) {
          aElement.publication = lAvecMotifPublicationDefaut;
          aElement.setEtat(EGenreEtat.Modification);
        }
      });
      this.incident.avecModifMotif = true;
      this.incident.setEtat(EGenreEtat.Modification);
      this.setEtatSaisie(true);
      this.getInstance(this.identIncidents).actualiser(true);
      this.getInstance(this.identProtagonistes).actualiser(true);
    }
    if (!!aListeTot) {
      this.donneesSaisie.motifs = aListeTot;
      this.donneesSaisie.motifs.parcourir((aElement) => {
        aElement.cmsActif = false;
      });
    }
  } else {
    this.getInstance(this.identCMS_Motifs).setDonnees(
      this.incident.listeMotifs,
    );
  }
}
function _evntSurDate(aDate) {
  const lDate = new Date(
    aDate.getFullYear(),
    aDate.getMonth(),
    aDate.getDate(),
    this.incident.dateheure.getHours(),
    this.incident.dateheure.getMinutes(),
  );
  this.incident.dateheure = lDate;
  this.incident.setEtat(EGenreEtat.Modification);
  this.setEtatSaisie(true);
  this.getInstance(this.identIncidents).actualiser(true);
}
function _evntSelecteurPJ(aParam) {
  switch (aParam.evnt) {
    case ObjetSelecteurPJCP.genreEvnt.selectionPJ:
      if (this.incident) {
        this.listePJ.addElement(aParam.fichier);
        this.incident.setEtat(EGenreEtat.Modification);
        this.setEtatSaisie(true);
      }
      break;
    case ObjetSelecteurPJCP.genreEvnt.suppressionPJ:
      if (this.incident) {
        this.incident.setEtat(EGenreEtat.Modification);
        this.setEtatSaisie(true);
      }
      break;
    default:
      break;
  }
}
function _evnCMS_Actions(aNumeroBouton, aListeDonnees) {
  if (aNumeroBouton === 1) {
    this.incident.actionsEnvisagees = aListeDonnees;
    this.incident.setEtat(EGenreEtat.Modification);
    this.setEtatSaisie(true);
  } else {
    this.getInstance(this.identCMS_Actions).setDonnees(
      this.donneesSaisie.actions,
      this.incident.actionsEnvisagees,
    );
  }
}
function _evntFenetreLieux(aGenreBouton, aSelection) {
  if (aGenreBouton === 1 && this.incident) {
    this._indiceLieu = aSelection;
    const lLieux = this.donneesSaisie.lieux.get(aSelection);
    if (
      lLieux.getNumero() !== this.incident.lieu.getNumero() &&
      lLieux.AvecSelection !== false
    ) {
      this.incident.lieu = lLieux;
      this.incident.setEtat(EGenreEtat.Modification);
      this.setEtatSaisie(true);
      this.getInstance(this.identIncidents).actualiser(true);
      _actualiserIncident.bind(this)();
      this.$refreshSelf();
    }
  }
}
function _evntFenetreSousCategorieDossier(aGenreBouton, aSelection) {
  const lFenetre = this.getInstance(this.identFenetreSignalement);
  if (aGenreBouton === 1) {
    const lIncident =
      this.donneesSaisie.listeSousCategorieDossier.get(aSelection);
    lFenetre.getInstance(lFenetre.identListe).ajouterElementCreation(lIncident);
  } else {
    lFenetre.getInstance(lFenetre.identListe).annulerCreation();
  }
}
function _evntFenetreSignalement(
  aGenreBouton,
  aSelection,
  aAvecChangementListe,
) {
  if (aGenreBouton === 1) {
    if (aAvecChangementListe) {
      this.donneesSaisie.motifs = MethodesObjet.dupliquer(this.tempMotifs);
      this.donneesSaisie.motifs.parcourir((aElement) => {
        aElement.cmsActif = false;
      });
      this.getInstance(this.identIncidents).actualiser(true);
    }
    this.recupererDonnees();
  } else {
    if (!!this.nrIncidentSelectionne) {
      const lIndiceEff = this.incidents.getIndiceParNumeroEtGenre(
        this.nrIncidentSelectionnee,
      );
      if (lIndiceEff > -1) {
        this.incident = this.incidents.get(lIndiceEff);
        _actualiserIncident.call(this);
      }
    }
  }
}
function _genreRessourceToGenreIndividuAuteur(aGenreRessource) {
  switch (aGenreRessource) {
    case EGenreRessource.Eleve:
      return TypeGenreIndividuAuteur.GIA_Eleve;
    case EGenreRessource.Enseignant:
      return TypeGenreIndividuAuteur.GIA_Professeur;
    case EGenreRessource.Personnel:
      return TypeGenreIndividuAuteur.GIA_Personnel;
    default:
      break;
  }
}
function _evntListePublicApresRequete(aDonnees) {
  _evntDeclencherFenetreRessource.bind(this)({
    listeComplet: aDonnees.listePublic,
    listeSelectionnee: new ObjetListeElements(),
    genre: aDonnees.genres[0],
  });
}
function _evntDeclencherFenetreRessource(aDonnees) {
  const lInstance = this.getInstance(this.identFenetreSelectPublic);
  if (
    aDonnees.genre === EGenreRessource.Eleve ||
    aDonnees.genre === EGenreRessource.Responsable
  ) {
    const lListeCumuls = new ObjetListeElements();
    lListeCumuls.addElement(
      new ObjetElement(
        GTraductions.getValeur("actualites.Cumul.Classe"),
        0,
        TypeGenreCumulSelectionPublic.classe,
        0,
      ),
    );
    lListeCumuls.addElement(
      new ObjetElement(
        GTraductions.getValeur("actualites.Cumul.Groupe"),
        0,
        TypeGenreCumulSelectionPublic.groupe,
        1,
      ),
    );
    lListeCumuls.addElement(
      new ObjetElement(
        GTraductions.getValeur("actualites.Cumul.Alphabetique"),
        0,
        TypeGenreCumulSelectionPublic.initial,
        2,
      ),
    );
    lInstance.setListeCumuls(lListeCumuls);
  }
  if (aDonnees.genre === EGenreRessource.Personnel) {
    const lListeCumuls = new ObjetListeElements();
    lListeCumuls.add(
      new ObjetElement(
        GTraductions.getValeur("Fenetre_SelectionPublic.Cumul.Aucun"),
        0,
        TypeGenreCumulSelectionPublic.sans,
        0,
      ),
    );
    lListeCumuls.add(
      new ObjetElement(
        GTraductions.getValeur("actualites.Cumul.Fonction"),
        0,
        TypeGenreCumulSelectionPublic.fonction,
        1,
      ),
    );
    lInstance.setListeCumuls(lListeCumuls);
    lInstance.setOptions({
      getInfosSuppZonePrincipale(aParams) {
        return lInstance.getGenreCumul() !==
          TypeGenreCumulSelectionPublic.fonction
          ? UtilitaireMessagerie.getLibelleSuppListePublics(aParams.article)
          : "";
      },
    });
  }
  if (aDonnees.genreCumul) {
    lInstance.setGenreCumulActif(aDonnees.genreCumul);
  }
  lInstance.setSelectionObligatoire(false);
  lInstance.setDonnees({
    listeRessources: aDonnees.listeComplet,
    listeRessourcesSelectionnees: MethodesObjet.dupliquer(
      aDonnees.listeSelectionnee,
    ),
    genreRessource: aDonnees.genre,
    titre: EGenreRessourceUtil.getTitreFenetreSelectionRessource(
      aDonnees.genre,
    ),
    estGenreRessourceDUtilisateurConnecte:
      EGenreRessourceUtil.correspondAuGenreUtilisateurEspaceCourant(
        aDonnees.genre,
      ),
  });
}
function _evenementFenetreIndividu(
  aGenreRessource,
  aListeRessourcesSelectionnees,
) {
  let lAvecChangement = false;
  let lExisteDeja = false;
  const lArrExistant = [];
  if (
    this.incident &&
    aListeRessourcesSelectionnees &&
    aListeRessourcesSelectionnees.count() > 0
  ) {
    for (let i = 0, max = aListeRessourcesSelectionnees.count(); i < max; i++) {
      let lRessource = aListeRessourcesSelectionnees.get(i);
      const lNrRessource = lRessource.getNumero();
      const lGenreRessource = _genreRessourceToGenreIndividuAuteur(
        lRessource.getGenre(),
      );
      const lIndice = this.incident.protagonistes.getIndiceElementParFiltre(
        (aElement) => {
          const lNumeroEgal =
            aElement.protagoniste.getNumero() === lNrRessource;
          const lGenreEgal =
            aElement.protagoniste.getGenre() === lGenreRessource;
          return lNumeroEgal && lGenreEgal && aElement.existe();
        },
      );
      if (lIndice === -1) {
        let lProtagoniste = _initNouveauProtagoniste.bind(this)(
          this._typeProtagoniste,
          lRessource,
        );
        lProtagoniste.setEtat(EGenreEtat.Creation);
        this.incident.protagonistes.addElement(lProtagoniste);
        lAvecChangement = true;
      } else {
        lExisteDeja = true;
        lArrExistant.push(lRessource.getLibelle());
      }
    }
    if (lExisteDeja) {
      GApplication.getMessage().afficher({
        type: EGenreBoiteMessage.Information,
        message:
          GTraductions.getValeur("incidents.protagonistes.existent") +
          "<br>" +
          lArrExistant.join(", "),
      });
    }
  }
  if (lAvecChangement) {
    this.incident.setEtat(EGenreEtat.FilsModification);
    this.getInstance(this.identIncidents).actualiser(true);
    this.getInstance(this.identProtagonistes).actualiser();
    this.setEtatSaisie(true);
  }
}
function _evntFenetreSelectPunition(aGenreBouton, aSelection, aSansModifCoche) {
  if (aGenreBouton === 1 && this.incident && this._protagoniste) {
    const lNature = this.donneesSaisie.mesuresDisciplinaires.get(aSelection);
    if (
      !this.incident.mesure ||
      lNature.getNumero() !== this.incident.mesure.nature.getNumero()
    ) {
      if (!aSansModifCoche) {
        this._protagoniste.avecSanction = true;
        this._protagoniste.sansSanction = false;
      }
      this._protagoniste.mesure = _initNouveauMesure.bind(this)(lNature);
      if (lNature.getGenre() === TypeGenrePunition.GP_ExclusionCours) {
        this._protagoniste.strDate = GDate.formatDate(
          this.incident.dateheure,
          "%JJ/%MM/%AAAA",
        );
      } else {
        this._protagoniste.strDate = "";
      }
      if (lNature.getGenre() === -1) {
        this._protagoniste.avecEditionDate = false;
        this._protagoniste.mesure.setEtat(EGenreEtat.Suppression);
      } else {
        this._protagoniste.avecEditionDate = true;
        this._protagoniste.mesure.setEtat(EGenreEtat.Creation);
      }
      this._protagoniste.setEtat(EGenreEtat.Modification);
      this.incident.setEtat(EGenreEtat.FilsModification);
      this.setEtatSaisie(true);
      this.getInstance(this.identProtagonistes).actualiser(true);
    }
  }
}
function _evntFenetreMesureIncident(aGenreBouton, aParam) {
  if (aParam.mesure.getEtat() !== EGenreEtat.Aucun) {
    this._protagoniste.mesure.duree = aParam.mesure.duree;
    this._protagoniste.mesure.accompagnateur = aParam.mesure.accompagnateur;
    this._protagoniste.mesure.travailAFaire = aParam.mesure.travailAFaire;
    this._protagoniste.mesure.documentsTAF = aParam.mesure.documentsTAF;
    this._protagoniste.mesure.publierTafApresDebutRetenue =
      aParam.mesure.publierTafApresDebutRetenue;
    if (aParam.mesure.getGenre() === EGenreRessource.Punition) {
      this._protagoniste.mesure.datePublication = aParam.mesure.datePublication;
    } else {
      this._protagoniste.mesure.publication = aParam.mesure.publication;
    }
    this._protagoniste.mesure.publicationDossierVS =
      aParam.mesure.publicationDossierVS;
    this._protagoniste.mesure.dateProgrammation =
      aParam.mesure.dateProgrammation;
    if (
      this._protagoniste.mesure.nature.getGenre() ===
        TypeGenrePunition.GP_Devoir &&
      this._protagoniste.mesure.dateProgrammation
    ) {
      this._protagoniste.strDate = GDate.formatDate(
        this._protagoniste.mesure.dateProgrammation,
        "%JJ/%MM/%AAAA",
      );
    }
    this._protagoniste.mesure.setEtat(aParam.mesure.Etat);
    this._protagoniste.setEtat(EGenreEtat.Modification);
    this.incident.setEtat(EGenreEtat.FilsModification);
    this.setEtatSaisie(true);
    this.getInstance(this.identProtagonistes).actualiser(true);
  }
}
function _getWidthDeListe() {
  let lWidth = 0;
  for (const i in this.paramColonnes) {
    const lColonne = this.paramColonnes[i];
    if (lColonne.visible !== false) {
      lWidth += _getWidthDeColonne.call(this, lColonne.id) + 17;
    }
  }
  lWidth += 25;
  return lWidth;
}
function composeBandeauDroite() {
  const T = [];
  T.push(`<div class="div-header fluid-bloc">`);
  T.push(`<h2 id="${this.idBandeauDroite}_Texte"></h2>`);
  T.push(`</div>`);
  return T.join("");
}
function _composeTitreSection(aMessage, aAvecMargeHaut) {
  const T = [];
  T.push(
    `<div class="as-header-bullet m-right-l m-bottom-l${aAvecMargeHaut ? ` m-top-l` : ``}">`,
  );
  T.push(`  <h3>${aMessage}</h3>`);
  T.push(`</div>`);
  return T.join("");
}
function _composeDetail() {
  const H = [];
  H.push(`<div id="${this.idReponse}_detail">`);
  H.push(
    _composeTitreSection(
      GTraductions.getValeur("incidents.protagonistes.titre"),
    ),
  );
  H.push(
    `<div class="p-top-l" id="${this.getNomInstance(this.identProtagonistes)}"></div>`,
  );
  H.push(
    _composeTitreSection(
      GTraductions.getValeur("incidents.circonstances"),
      true,
    ),
  );
  H.push('<div id="ZoneCirconstancesIncident" class="p-bottom-l">');
  H.push('<div id="ZoneAuteurGravite" class="flex-contain flex-center p-y-l">');
  const lIdAuteurSignalement = GUID.getId();
  H.push(
    ' <div class="m-right-l">',
    '<label for="',
    lIdAuteurSignalement,
    '" class="m-right m-bottom">',
    GTraductions.getValeur("incidents.auteurDuSignalement"),
    "</label>",
    '<input id="',
    lIdAuteurSignalement,
    '" ie-model="auteur" type="text" ie-etatsaisie class="round-style" style="',
    GStyle.composeWidth(280),
    '" spellcheck="false" tabindex="0" />',
    "</div>",
  );
  const lIdGravite = GUID.getId();
  H.push(
    ' <div class="m-right-l">',
    '<label for="',
    lIdGravite,
    '" class="m-right m-bottom">',
    GTraductions.getValeur("incidents.gravite"),
    "</label>",
    '<input id="',
    lIdGravite,
    '" ie-model="gravite" type="text" ie-etatsaisie ie-mask="/[^1-5]/i" maxlength="1" class="round-style" style="',
    GStyle.composeWidth(20),
    '" spellcheck="false" tabindex="0" />',
    " </div>",
  );
  H.push(
    ' <ie-checkbox ie-model="getFaitDeViolence">',
    GTraductions.getValeur("incidents.faitDeViolence"),
    "</ie-checkbox>",
  );
  H.push("</div>");
  H.push('<div id="ZoneDateLieu" class="flex-contain flex-center p-y-l">');
  H.push(
    '  <div class="m-right-l m-bottom">',
    '<label class="m-right m-bottom bloc-contain">',
    GTraductions.getValeur("incidents.date"),
    "</label>",
    '<div id="',
    this.getNomInstance(this.identDate),
    '"></div>',
    "</div>",
  );
  const lIdLabelInput = GUID.getId();
  H.push(
    '  <div class="m-right-l">',
    '<label for="',
    lIdLabelInput,
    '" class="m-right m-bottom bloc-contain">',
    GTraductions.getValeur("incidents.heure"),
    "</label>",
    '<input id="',
    lIdLabelInput,
    '" type="time" ie-model="heure" class="round-style"/>',
    "</div>",
  );
  H.push(
    '  <div class="m-right-l">',
    '<label class="m-right m-bottom bloc-contain">',
    GTraductions.getValeur("incidents.lieu"),
    "</label>",
    '<ie-combo ie-model="lieu"></ie-combo>',
    "</div>",
  );
  H.push("</div>");
  H.push(
    '<div id="ZoneMotifs" class="p-y-l">',
    '  <label id="',
    this.idLabelMotifs,
    '" class="bloc-contain m-bottom">',
    GTraductions.getValeur("incidents.motifs"),
    "</label>",
    '  <div id="',
    this.getNomInstance(this.identCMS_Motifs),
    '"></div>',
    "</div>",
  );
  const lIdTextareaDetail = GUID.getId();
  H.push(
    '<div id="ZoneDetail" class="p-top-l">',
    '  <label for="',
    lIdTextareaDetail,
    '" class="bloc-contain m-bottom">',
    GTraductions.getValeur("incidents.details"),
    "</label>",
    `<ie-textareamax id="${lIdTextareaDetail}" ie-model="details" ie-event="change->eventChange" class="round-style" maxlength="${this.donneesSaisie.tailleCirconstance}" style="${GStyle.composeWidth(810)} ${GStyle.composeHeight(120)}"></ie-textareamax>`,
    "</div>",
  );
  H.push(
    '<div id="ZonePJ" class="p-y-l">',
    '<div class="pj-global-conteneur',
    !this._autorisations.saisie ? " is-disabled" : "",
    '" id="',
    this.getNomInstance(this.identSelecteurPJ),
    '"></div>',
    "</div>",
  );
  H.push(
    '<div id="ZoneActionsEnvisagees" class="p-y-l">',
    '  <label id="',
    this.idLabelActions,
    '" class="bloc-contain m-bottom">',
    GTraductions.getValeur("incidents.actions"),
    "</label>",
    '  <div id="',
    this.getNomInstance(this.identCMS_Actions),
    '"></div>',
    "</div>",
  );
  const lIdTextareaCommentaire = GUID.getId();
  H.push(
    '<div id="ZoneDetail" class="p-y-l">',
    '  <label for="',
    lIdTextareaCommentaire,
    '" class="bloc-contain m-bottom">',
    GTraductions.getValeur("incidents.commentaire"),
    "</label>",
    `<ie-textareamax id="${lIdTextareaCommentaire}" ie-model="detailActionEnvisagee" ie-event="change->eventChange" class="round-style" maxlength="${this.donneesSaisie.tailleCirconstance}" style="${GStyle.composeWidth(810)} ${GStyle.composeHeight(120)}"></ie-textareamax>`,
    "</div>",
  );
  H.push("</div>");
  if (GApplication.droits.get(TypeDroits.actualite.avecSaisieActualite)) {
    H.push(
      _composeTitreSection(
        GTraductions.getValeur("incidents.diffuserInfoTitre"),
        true,
      ),
    );
    H.push(
      '<div class="flex-contain flex-center p-y-l">',
      '<label class="m-right" >',
      GTraductions.getValeur("incidents.diffuserEquipesPedagogiques"),
      "</label>",
      UtilitaireBoutonBandeau.getHtmlBtnDiffuserInformation(
        "boutonInformation",
        GTraductions.getValeur("incidents.diffuserEquipesPedagogiques"),
      ),
      '<div class="flex-contain flex-center p-x-l" ie-display="messageEnvoye">',
      ' <label class="m-right">',
      GTraductions.getValeur("incidents.messageEnvoye"),
      "</label>",
      ' <div class="Image_DestinataireCourrier" aria-hidden="true"></div>',
      "</div>",
      "</div>",
    );
  }
  H.push(`</div>`);
  H.push(`</div>`);
  return H.join("");
}
function getParametresRequetesIncidents() {
  if (!!this.donnees.classes) {
    this.donnees.classes.setSerialisateurJSON({ ignorerEtatsElements: true });
  }
  return { classes: this.donnees.classes };
}
function _actionApresRequeteListesSaisiesPourIncidents(aJSON) {
  if (aJSON.lieux) {
    this.donneesSaisie.lieux = aJSON.lieux;
    this.donneesSaisie.lieux.insererElement(
      new ObjetElement(
        GTraductions.getValeur("Aucune"),
        undefined,
        EGenreRessource.Aucune,
      ),
      0,
    );
    const lLieu = new ObjetElement("Lieu", 0, EGenreRessource.LieuDossier);
    lLieu.estUnDeploiement = true;
    lLieu.estDeploye = false;
    lLieu.AvecSelection = false;
    lLieu.Position = 0;
    const lSalle = new ObjetElement(
      GTraductions.getValeur("Salle"),
      0,
      EGenreRessource.Salle,
    );
    lSalle.estUnDeploiement = true;
    lSalle.estDeploye = false;
    lSalle.AvecSelection = false;
    lSalle.Position = 0;
    this.donneesSaisie.lieux.insererElement(lLieu, 1);
    this.donneesSaisie.lieux.insererElement(lSalle, 2);
    this.donneesSaisie.lieux.parcourir((aLieu) => {
      if (aLieu.existeNumero()) {
        if (aLieu.getGenre() === EGenreRessource.LieuDossier) {
          aLieu.pere = lLieu;
        }
        if (aLieu.getGenre() === EGenreRessource.Salle) {
          aLieu.pere = lSalle;
        }
      }
    });
    this.donneesSaisie.lieux.setTri([
      ObjetTri.init("Genre"),
      ObjetTri.init((D) => {
        return D.existeNumero();
      }),
      ObjetTri.init("Position"),
    ]);
    this.donneesSaisie.lieux.trier();
  }
  if (aJSON.motifs) {
    this.donneesSaisie.motifs = aJSON.motifs;
  }
  if (aJSON.listeSousCategorieDossier) {
    this.donneesSaisie.listeSousCategorieDossier =
      aJSON.listeSousCategorieDossier;
  }
  if (aJSON.actions) {
    this.donneesSaisie.actions = aJSON.actions;
  }
  if (aJSON.typesProtagonistes) {
    this.donneesSaisie.typesProtagonistes = aJSON.typesProtagonistes;
  }
  if (aJSON.punitions) {
    this.donneesSaisie.mesuresDisciplinaires = aJSON.punitions;
    this.donneesSaisie.mesuresDisciplinaires.insererElement(
      new ObjetElement(
        GTraductions.getValeur("incidents.protagonistes.enAttente"),
        null,
        -1,
      ),
      0,
    );
  }
  Requetes("Incidents", this, _actionApresRequeteIncidents).lancerRequete(
    getParametresRequetesIncidents.call(this),
  );
}
function _actionApresRequeteIncidents(aJSON) {
  this.incidents = aJSON.incidents;
  this.incidents.setTri([
    ObjetTri.init("dateheure", EGenreTriElement.Decroissant),
  ]);
  this.incidents.trier();
  const lIndiceEff = this.incidents.getIndiceParNumeroEtGenre(
    this.nrIncidentSelectionnee,
  );
  if (!!this.nrIncidentSelectionne && lIndiceEff > -1) {
    this.incident = this.incidents.get(lIndiceEff);
  }
  this.getInstance(this.identIncidents).setDonnees(
    (this.objetDonnees = new DonneesListe_Incidents(
      this.incidents,
      this.uniquementMesIncidents,
      this._autorisations.saisie,
      this.uniquementNonRegle,
    )),
    lIndiceEff,
  );
  if (this.incident) {
    _actualiserIncident.bind(this)();
    if (this.demandeOuvertureFenetreEditionInformation) {
      this.demandeOuvertureFenetreEditionInformation = false;
      this.ouvrirFenetreEditionInformation();
    }
  }
}
function _initNouveauIncident() {
  const lIncident = new ObjetElement("", null, EGenreRessource.Incident);
  lIncident.estRapporteur = true;
  lIncident.estEditable = true;
  lIncident.avecEditDate = true;
  lIncident.avecEditHeure = true;
  lIncident.avecEditMotifs = true;
  lIncident.avecEditLieu = true;
  lIncident.avecEditDescription = true;
  lIncident.rapporteur = GEtatUtilisateur.getUtilisateur();
  lIncident.protagonistes = new ObjetListeElements();
  lIncident.lieu = new ObjetElement("");
  lIncident.gravite = 1;
  lIncident.commentaire = "";
  lIncident.dateheure = GDate.getDateHeureCourante();
  const lDate = new Date();
  lIncident.dateheure.setHours(lDate.getHours(), lDate.getMinutes());
  lIncident.messageEnvoye = false;
  lIncident.actionsEnvisagees = new ObjetListeElements();
  lIncident.listeMotifs = new ObjetListeElements();
  lIncident.documents = new ObjetListeElements();
  lIncident.detailActionsEnvisagees = "";
  return lIncident;
}
function _initNouveauProtagoniste(aElementTypeProtagoniste, aRessource) {
  if (!this.incident) {
    return null;
  }
  const lProtagoniste = new ObjetElement(
    aElementTypeProtagoniste.getLibelle(),
    null,
    aElementTypeProtagoniste.getGenre(),
  );
  const lEstTypeAuteur =
    lProtagoniste.getGenre() === TypeGenreStatutProtagonisteIncident.GSP_Auteur;
  lProtagoniste.protagoniste = new ObjetElement(
    aRessource.getLibelle(),
    aRessource.getNumero(),
    _genreRessourceToGenreIndividuAuteur(aRessource.getGenre()),
  );
  lProtagoniste.nom = aRessource.getLibelle();
  switch (aRessource.getGenre()) {
    case EGenreRessource.Eleve:
      if (aRessource.classes) {
        lProtagoniste.nom +=
          " (" + aRessource.classes.getTableauLibelles().join(", ") + ")";
      }
      break;
    case EGenreRessource.Enseignant:
      lProtagoniste.nom +=
        " (" + GTraductions.getValeur("incidents.professeur") + ")";
      break;
    case EGenreRessource.Personnel:
      lProtagoniste.nom +=
        " (" + GTraductions.getValeur("incidents.personnel") + ")";
      break;
    default:
      break;
  }
  lProtagoniste.hintDate = "";
  lProtagoniste.strDate = "";
  lProtagoniste.avecEditionMesure = lEstTypeAuteur;
  lProtagoniste.avecEditionDate = false;
  lProtagoniste.avecEditionPublication =
    this._autorisations.publier && lEstTypeAuteur;
  const lAvecMotifDossierObligatoire =
    this.incident.listeMotifs.getIndiceElementParFiltre((aElement) => {
      return aElement.dossierObligatoire;
    }) > -1;
  const lAvecMotifPublicationDefaut =
    this.incident.listeMotifs.getIndiceElementParFiltre((aElement) => {
      return aElement.publication;
    }) > -1;
  lProtagoniste.publication = lEstTypeAuteur && lAvecMotifPublicationDefaut;
  lProtagoniste.avecEditionPublicationDossier =
    this._autorisations.publierDossierVS &&
    lAvecMotifDossierObligatoire &&
    lEstTypeAuteur;
  if (lAvecMotifDossierObligatoire && lEstTypeAuteur) {
    lProtagoniste.dossier = new ObjetElement("");
    lProtagoniste.dossier.publication = false;
  }
  return lProtagoniste;
}
function _initNouveauMesure(aNature) {
  if (!this.incident || !this._protagoniste || !aNature) {
    return null;
  }
  const lMesure = new ObjetElement("", null, EGenreRessource.Punition);
  if (aNature.getGenre() === -1) {
    let lLibelle = "";
    if (this._protagoniste.avecSanction && !this._protagoniste.sansSanction) {
      lLibelle = GTraductions.getValeur("incidents.protagonistes.enAttente");
    } else if (
      this._protagoniste.sansSanction &&
      !this._protagoniste.avecSanction
    ) {
      lLibelle = GTraductions.getValeur("incidents.protagonistes.aucuneMesure");
    }
    lMesure.nature = new ObjetElement(lLibelle);
  } else {
    lMesure.nature = aNature;
  }
  lMesure.travailAFaire = "";
  lMesure.duree = 0;
  if (!!aNature.dureeParDefaut) {
    lMesure.duree = TUtilitaireDuree.dureeEnMin(aNature.dureeParDefaut);
  }
  lMesure.documentsTAF = new ObjetListeElements();
  lMesure.estProgrammable = aNature.programmable;
  return lMesure;
}
function _afficherFenetreSelectionPunition() {
  const lDonneesListe = new ObjetDonneesListeFlatDesign(
    this.donneesSaisie.mesuresDisciplinaires,
  );
  lDonneesListe.setOptions({
    avecTri: false,
    avecBoutonActionLigne: false,
    flatDesignMinimal: true,
    avecEvnt_Selection: true,
  });
  this.getInstance(this.identFenetreSelectPunition).setDonnees(lDonneesListe);
}
module.exports = { InterfaceIncidents };
