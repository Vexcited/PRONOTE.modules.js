const { InterfacePage } = require("InterfacePage.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeArborescente } = require("ObjetListeArborescente.js");
const {
  DonneesListe_FicheLivretScolaire,
} = require("DonneesListe_FicheLivretScolaire.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const { ObjetPiedFicheScolaire } = require("ObjetPiedFicheScolaire.js");
const { ObjetFicheGraphe } = require("ObjetFicheGraphe.js");
const {
  ObjetRequeteListeCompetencesLivretScolaire,
} = require("ObjetRequeteListeCompetencesLivretScolaire.js");
const { ObjetRequeteLivretScolaire } = require("ObjetRequeteLivretScolaire.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GChaine } = require("ObjetChaine.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreAction } = require("Enumere_Action.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreEvntMenusDeroulants } = require("Enumere_EvntMenusDeroulants.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const MultipleObjetAffichagePageAvecMenusDeroulants = require("InterfacePageAvecMenusDeroulants.js");
const ObjetAffichagePageAvecMenusDeroulants =
  MultipleObjetAffichagePageAvecMenusDeroulants
    ? MultipleObjetAffichagePageAvecMenusDeroulants.ObjetAffichagePageAvecMenusDeroulants
    : null;
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
  ObjetFenetre_AssistantSaisie,
} = require("ObjetFenetre_AssistantSaisie.js");
const {
  EBoutonFenetreAssistantSaisie,
} = require("EBoutonFenetreAssistantSaisie.js");
const {
  ObjetRequeteSaisieLivretScolaire,
} = require("ObjetRequeteSaisieLivretScolaire.js");
const {
  ObjetRequeteCalculCompetencesLivretScolaire,
} = require("ObjetRequeteCalculCompetencesLivretScolaire.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ETypeAppreciationUtil } = require("Enumere_TypeAppreciation.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { ObjetMoteurAssistantSaisie } = require("ObjetMoteurAssistantSaisie.js");
const {
  TypeOptionMaquetteLivretScolaireStandard,
} = require("TypeOptionMaquetteLivretScolaireStandard.js");
const { ToucheClavier } = require("ToucheClavier.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const ObjetRequeteSaisieAccuseReceptionDocument = require("ObjetRequeteSaisieAccuseReceptionDocument.js");
const {
  ObjetFenetre_EditionAppreciationAnnuelleMS,
} = require("ObjetFenetre_EditionAppreciationAnnuelleMS.js");
class InterfaceFicheLivretScolaire extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.moteur = new ObjetMoteurReleveBulletin();
    this.moteurAssSaisie = new ObjetMoteurAssistantSaisie();
    this.visuJauge = true;
    this.donnees = { libelleBandeau: "", hintLibelleBandeau: "" };
    this.avecGestionAccuseReception =
      GEtatUtilisateur.GenreEspace === EGenreEspace.Parent;
  }
  construireInstances() {
    this.listeClasseHistorique = null;
    if (
      GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur &&
      ObjetAffichagePageAvecMenusDeroulants
    ) {
      this.identTripleCombo = this.add(
        ObjetAffichagePageAvecMenusDeroulants,
        this.evenementSurDernierMenuDeroulant,
        this.initialiserTripleCombo,
      );
    }
    if (
      this.identTripleCombo !== null &&
      this.identTripleCombo !== undefined &&
      this.getInstance(this.identTripleCombo) !== null
    ) {
      this.IdPremierElement = this.getInstance(
        this.identTripleCombo,
      ).getPremierElement();
    }
    if (
      GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.LivretScolaire_Fiche
    ) {
      if (!GEtatUtilisateur.estModeAccessible()) {
        this.IdentPage = this.add(
          ObjetListe,
          _evntSurListeLivret.bind(this),
          _initListeLivret.bind(this),
        );
      } else {
        this.IdentPage = this.add(ObjetListeArborescente, null, null);
      }
      this.IdentMoyGen = this.add(
        ObjetListe,
        null,
        _initListeMoyenne.bind(this),
      );
      this.IdentPied = this.add(ObjetPiedFicheScolaire, null, null);
    } else {
      if (
        GEtatUtilisateur.getGenreOnglet() ===
        EGenreOnglet.LivretScolaire_Appreciations
      ) {
        this.IdentAppreciations = this.add(
          ObjetListe,
          _evntSurListeLivret.bind(this),
          null,
        );
      }
      if (
        GEtatUtilisateur.getGenreOnglet() ===
        EGenreOnglet.LivretScolaire_Competences
      ) {
        this.IdentCompetences = this.add(
          ObjetListe,
          _evntSurListeCompetences.bind(this),
          null,
        );
      }
      this.IdentResultat = this.add(
        ObjetListe,
        null,
        _initListeResultat.bind(this),
      );
    }
    if (
      [EGenreEspace.Eleve, EGenreEspace.Parent].includes(
        GEtatUtilisateur.GenreEspace,
      )
    ) {
      const lEleve = GEtatUtilisateur.getMembre();
      const lNrDernierClasse = lEleve.Classe.getNumero();
      if (lEleve && lEleve.listeClasseHistorique) {
        this.listeClasseHistorique =
          lEleve.listeClasseHistorique.getListeElements((aElement) => {
            return (
              (aElement.avecNote && !aElement.avecFiliere) ||
              aElement.getNumero() === lNrDernierClasse
            );
          });
      }
    }
    if (this.listeClasseHistorique && this.listeClasseHistorique.count() > 1) {
      this.identCmbClasseHistorique = this.add(
        ObjetSaisie,
        this.evenementClasseHistorique,
        this.initialiserClasseHistorique,
      );
    }
    if (this.avecAssistantSaisie()) {
      this.identFenetreAssistantSaisie = this.add(
        ObjetFenetre_AssistantSaisie,
        _evntSurFenetreAssistantSaisie.bind(this),
        this.moteurAssSaisie.initialiserFenetreAssistantSaisie,
      );
    }
    if (GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur) {
      this.construireFicheEleveEtFichePhoto();
    }
    this.avecBoutonGraphe =
      GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.LivretScolaire_Fiche;
    if (this.avecBoutonGraphe) {
      this.identFicheGraphe = this.add(ObjetFicheGraphe);
    }
  }
  avecAssistantSaisie() {
    return this.moteurAssSaisie.avecAssistantSaisie({
      typeReleveBulletin: TypeReleveBulletin.LivretScolaire,
    });
  }
  recupererDonnees() {
    if (!this.Pere.EnConstruction) {
      if (GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur) {
        new ObjetRequeteListeCompetencesLivretScolaire(
          this,
          this.actionSurListeCompetencesLivretScolaire,
        ).lancerRequete();
      } else {
        this.classeSelectionne = GEtatUtilisateur.getMembre().Classe;
        if (
          this.listeClasseHistorique &&
          this.listeClasseHistorique.count() > 1
        ) {
          const lNumero = this.classeSelectionne.getNumero();
          let lIndice = this.listeClasseHistorique.getIndiceElementParFiltre(
            (aElement) => {
              return aElement.getNumero() === lNumero;
            },
          );
          if (lIndice === -1) {
            lIndice = 0;
          }
          this.getInstance(this.identCmbClasseHistorique).setDonnees(
            this.listeClasseHistorique,
            lIndice,
          );
        } else {
          this.afficherPage();
        }
      }
    }
  }
  initialiserClasseHistorique(aInstance) {
    aInstance.setOptionsObjetSaisie({ longueur: 200 });
  }
  setParametresGeneraux() {
    if (
      GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.LivretScolaire_Fiche
    ) {
      this.IdentZoneAlClient = this.IdentPage;
    }
    if (
      GEtatUtilisateur.getGenreOnglet() ===
      EGenreOnglet.LivretScolaire_Appreciations
    ) {
      this.IdentZoneAlClient = this.IdentAppreciations;
    }
    if (
      GEtatUtilisateur.getGenreOnglet() ===
      EGenreOnglet.LivretScolaire_Competences
    ) {
      this.IdentZoneAlClient = this.IdentCompetences;
    }
    this.GenreStructure = EStructureAffichage.Autre;
    this.AddSurZone = [];
    if (MethodesObjet.isNumber(this.identTripleCombo)) {
      this.AddSurZone.push(this.identTripleCombo);
    }
    if (GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur) {
      this.AddSurZone.push({
        html: '<span ie-html="getInformationSorti" class="Italique"></span>',
      });
    }
    this.AddSurZone.push({
      html: '<span ie-if="Bandeau.avecBandeau" class="Gras" ie-html="Bandeau.getLibelle" ie-hint="Bandeau.getHint"></span>',
    });
    if (this.listeClasseHistorique && this.listeClasseHistorique.count() > 1) {
      this.AddSurZone.push(this.identCmbClasseHistorique);
    }
    if (GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur) {
      this.AddSurZone.push({
        html: '<span ie-html="getInformationDatePublication"></span>',
      });
    }
    if (
      GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur &&
      GEtatUtilisateur.getGenreOnglet() ===
        EGenreOnglet.LivretScolaire_Competences
    ) {
      this.AddSurZone.push({ separateur: true });
      this.AddSurZone.push({
        html:
          '<ie-checkbox class="livretscolaire ls-espace" ie-model="choixJauge" ie-display="choixJauge.visible">' +
          GTraductions.getValeur("ficheScolaire.afficherResultatsEvals") +
          "</ie-checkbox>",
      });
      this.AddSurZone.push({
        html:
          '<ie-bouton class="livretscolaire ls-espace small-bt themeBoutonSecondaire" ie-model="calculeAuto" ie-display="calculeAuto.visible">' +
          GTraductions.getValeur("ficheScolaire.calculerAutoEval") +
          "</ie-bouton>",
      });
    }
    if (
      this.avecFicheEleve() ||
      this.avecBoutonGraphe ||
      this.avecAssistantSaisie()
    ) {
      this.AddSurZone.push({ separateur: true });
      if (this.avecAssistantSaisie()) {
        this.AddSurZone.push({
          html: UtilitaireBoutonBandeau.getHtmlBtnAssistantSaisie(
            "btnAssistantSaisie",
          ),
        });
      }
      this.addSurZoneFicheEleve();
      this.addSurZonePhotoEleve();
      if (this.avecGestionAccuseReception) {
        this.addSurZoneAccuseReception();
      }
      if (this.avecBoutonGraphe) {
        this.AddSurZone.push({ html: this.getHtmlBoutonBandeauGraphe() });
      }
    }
  }
  estAvecBandeau() {
    return (
      GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur ||
      (this.listeClasseHistorique && this.listeClasseHistorique.count() > 1)
    );
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      Bandeau: {
        avecBandeau: function () {
          return aInstance.estAvecBandeau();
        },
        getLibelle: function () {
          return aInstance.donnees.libelleBandeau;
        },
        getHint: function () {
          return aInstance.donnees.hintLibelleBandeau;
        },
      },
      getInformationSorti: function () {
        return !!aInstance.donnees ? aInstance.donnees.infoSorti || "" : "";
      },
      getInformationDatePublication: function () {
        return !!aInstance.donnees
          ? aInstance.donnees.strInfoDatePublication || ""
          : "";
      },
      choixJauge: {
        getValue: function () {
          if (aInstance.visuJauge === undefined) {
            aInstance.visuJauge = true;
          }
          return aInstance.visuJauge;
        },
        setValue: function (aValeur) {
          aInstance.visuJauge = aValeur;
          _initListeCompetences.bind(aInstance)(
            aInstance.getInstance(aInstance.IdentCompetences),
          );
          aInstance.getInstance(aInstance.IdentCompetences).actualiser();
        },
        visible: function () {
          return aInstance.donnees && aInstance.donnees.avecJauge;
        },
      },
      calculeAuto: {
        event: function () {
          const lmessage = [];
          lmessage.push('<div class="livretscolaire">');
          lmessage.push('<div class="ls-section-titre">');
          lmessage.push(
            '<div class="ls-titre">',
            GTraductions.getValeur("ficheScolaire.msgAutoEval.titre"),
            "</div>",
          );
          lmessage.push(
            '<div class="ls-mrfiche" ie-mrfiche="ficheScolaire.MFicheValidationCompetencesLSL"></div>',
          );
          lmessage.push("</div>");
          lmessage.push(
            '<div class="ls-corps">',
            GTraductions.getValeur("ficheScolaire.msgAutoEval.texte"),
            "</div>",
          );
          lmessage.push(
            '<div class="ls-choix"><ie-checkbox ie-model="choixRemplacer">',
            GTraductions.getValeur("ficheScolaire.msgAutoEval.choix"),
            "</ie-checkbox></div>",
          );
          lmessage.push("</div>");
          const lThis = aInstance;
          GApplication.getMessage().afficher({
            type: EGenreBoiteMessage.Confirmation,
            width: 450,
            message: lmessage.join(""),
            controleur: {
              choixRemplacer: {
                getValue: function () {
                  if (GEtatUtilisateur.remplacerEvalCompetences === undefined) {
                    GEtatUtilisateur.remplacerEvalCompetences = false;
                  }
                  return GEtatUtilisateur.remplacerEvalCompetences;
                },
                setValue: function (aValue) {
                  GEtatUtilisateur.remplacerEvalCompetences = aValue;
                },
              },
            },
            callback: function (aGenreAction) {
              if (aGenreAction === EGenreAction.Valider) {
                lThis.calculCompetencesLivretScolaire(
                  GEtatUtilisateur.remplacerEvalCompetences,
                );
                GEtatUtilisateur.remplacerEvalCompetences = false;
              }
            },
          });
        },
        getDisabled: function () {
          return (
            !aInstance.donnees || !aInstance.donnees.avecCalculeCompetences
          );
        },
        visible: function () {
          return aInstance.donnees && aInstance.donnees.avecJauge;
        },
      },
      btnAssistantSaisie: {
        event() {
          _evntSurAssistant.call(aInstance);
        },
        getTitle() {
          return aInstance.moteurAssSaisie.getTitleBoutonAssistantSaisie();
        },
        getSelection() {
          return GEtatUtilisateur.assistantSaisieActif;
        },
      },
      cbAccuseReception: {
        getValue: function () {
          const lResponsableAR = aInstance._getResponsableAccuseReception();
          return !!lResponsableAR ? lResponsableAR.aPrisConnaissance : false;
        },
        setValue: function (aValue) {
          const lResponsableAR = aInstance._getResponsableAccuseReception();
          if (!!lResponsableAR) {
            lResponsableAR.aPrisConnaissance = aValue;
            new ObjetRequeteSaisieAccuseReceptionDocument(
              aInstance,
            ).lancerRequete({
              periode: aInstance.periodeSelectionnee,
              aPrisConnaissance: aValue,
            });
          }
        },
        getDisabled: function () {
          const lResponsableAR = aInstance._getResponsableAccuseReception();
          return !!lResponsableAR ? lResponsableAR.aPrisConnaissance : true;
        },
        estVisible: function () {
          const lResponsableAR = aInstance._getResponsableAccuseReception();
          return (
            !aInstance.avecMessage &&
            aInstance.avecGestionAccuseReception &&
            !!lResponsableAR
          );
        },
      },
    });
  }
  calculCompetencesLivretScolaire(aRemplacer) {
    const lObjet = {
      genre: GEtatUtilisateur.getGenreOnglet(),
      classe: this.classeSelectionne,
      discipline: GEtatUtilisateur.Navigation.getRessource(
        EGenreRessource.DisciplineLivretScolaire,
      ),
      nePasRemplacer: !aRemplacer,
    };
    new ObjetRequeteCalculCompetencesLivretScolaire(
      this,
      this.actionSurValidation,
    ).lancerRequete(lObjet);
  }
  getTitleBoutonGraphe() {
    return GTraductions.getValeur("ficheScolaire.boutonGraphe");
  }
  initialiserTripleCombo(aInstance) {
    switch (GEtatUtilisateur.getGenreOnglet()) {
      case EGenreOnglet.LivretScolaire_Appreciations:
        aInstance.setParametres([
          EGenreRessource.Classe,
          EGenreRessource.DisciplineLivretScolaire,
        ]);
        break;
      case EGenreOnglet.LivretScolaire_Competences:
        aInstance.setParametres([
          EGenreRessource.Classe,
          EGenreRessource.DisciplineLivretScolaire,
        ]);
        break;
      default:
        aInstance.setParametres([
          EGenreRessource.Classe,
          EGenreRessource.Eleve,
        ]);
        break;
    }
    aInstance.setEvenementMenusDeroulants(this.surEvntMenusDeroulants);
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push('<div class="Espace BorderBox" style="_eight:100%;">');
    if (
      GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.LivretScolaire_Fiche
    ) {
      H.push(
        '<div id="',
        this.getInstance(this.IdentPage).getNom(),
        '"></div>',
      );
      H.push(
        '<div id="',
        this.getInstance(this.IdentMoyGen).getNom(),
        '" style="margin-right:5px"></div>',
      );
      H.push(
        '<div id="',
        this.getInstance(this.IdentPied).getNom(),
        '"></div>',
      );
    } else {
      if (
        GEtatUtilisateur.getGenreOnglet() ===
        EGenreOnglet.LivretScolaire_Appreciations
      ) {
        H.push(
          '<div id="',
          this.getInstance(this.IdentAppreciations).getNom(),
          '"></div>',
        );
      }
      if (
        GEtatUtilisateur.getGenreOnglet() ===
        EGenreOnglet.LivretScolaire_Competences
      ) {
        H.push(
          '<div id="',
          this.getInstance(this.IdentCompetences).getNom(),
          '"></div>',
        );
      }
      H.push(
        '<div class="EspaceHaut" id="',
        this.getInstance(this.IdentResultat).getNom(),
        '"></div>',
      );
    }
    H.push("</div>");
    return H.join("");
  }
  evenementSurDernierMenuDeroulant() {
    if (
      GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.LivretScolaire_Fiche
    ) {
      this.surSelectionEleve();
    }
    this.afficherPage();
  }
  evenementClasseHistorique(aParams) {
    switch (aParams.genreEvenement) {
      case EGenreEvenementObjetSaisie.selection:
        this.classeSelectionne = aParams.element;
        this.afficherPage();
        break;
      case EGenreEvenementObjetSaisie.deploiement:
        break;
      default:
        break;
    }
  }
  surEvntMenusDeroulants(aParam) {
    super.surEvntMenusDeroulants(aParam);
    const lClasse = GEtatUtilisateur.Navigation.getRessource(
      EGenreRessource.Classe,
    );
    if (
      aParam.genreCombo === EGenreRessource.DisciplineLivretScolaire &&
      aParam.genreEvenement === EGenreEvntMenusDeroulants.surOuvertureCombo &&
      GEtatUtilisateur.getGenreOnglet() ===
        EGenreOnglet.LivretScolaire_Competences
    ) {
      if (
        lClasse &&
        lClasse.getGenre() === EGenreRessource.Classe &&
        !lClasse.avecFiliere
      ) {
        this.bloquerDonneesAffichage = true;
      } else {
        this.bloquerDonneesAffichage = false;
      }
    }
    if (
      aParam.genreEvenement === EGenreEvntMenusDeroulants.ressourceNonTrouve &&
      this.getInstance(this.IdentPied)
    ) {
      this.getInstance(this.IdentPied).setDonnees(null);
    }
    if (
      aParam.genreEvenement === EGenreEvntMenusDeroulants.ressourceNonTrouve &&
      this.getInstance(this.IdentMoyGen)
    ) {
      this.getInstance(this.IdentMoyGen).effacer();
    }
    if (
      aParam.genreEvenement === EGenreEvntMenusDeroulants.ressourceNonTrouve &&
      this.getInstance(this.IdentResultat)
    ) {
      this.getInstance(this.IdentResultat).effacer();
    }
    if (
      aParam.genreCombo === EGenreRessource.DisciplineLivretScolaire &&
      aParam.aucunElement &&
      aParam.genreEvenement === EGenreEvntMenusDeroulants.ressourceNonTrouve
    ) {
      if (
        GEtatUtilisateur.getGenreOnglet() ===
        EGenreOnglet.LivretScolaire_Competences
      ) {
        if (lClasse && lClasse.getGenre() === EGenreRessource.Classe) {
          this.evenementAfficherMessage(
            GTraductions.getValeur("ficheScolaire.messageClasseSansFiliere"),
          );
        } else {
          this.evenementAfficherMessage(
            GTraductions.getValeur("ficheScolaire.messageGroupeSansFiliere"),
          );
        }
      }
    }
    Invocateur.evenement(
      ObjetInvocateur.events.activationImpression,
      EGenreImpression.Aucune,
    );
  }
  actionSurListeCompetencesLivretScolaire(aDonnees) {
    this.listeSaisie = aDonnees;
  }
  actionSurRecupererDonnees(aDonnees) {
    this.afficherBandeau(true);
    this.donnees = aDonnees;
    this.donnees.listeSaisie = this.listeSaisie;
    this.donnees.classeSelectionne = GEtatUtilisateur.Navigation.getRessource(
      EGenreRessource.Classe,
    );
    this.listeAccusesReception = aDonnees.listeAccusesReception;
    if (
      GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.LivretScolaire_Fiche
    ) {
      this.setGraphe(null);
      const lEleve =
        GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur
          ? GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve)
          : GEtatUtilisateur.getMembre();
      if (!!this.donnees.graphe) {
        this.setGraphe({
          image: [this.donnees.graphe],
          titre: GChaine.format(
            GTraductions.getValeur("ficheScolaire.titreGraphe"),
            [lEleve.getLibelle()],
          ),
          message: GTraductions.getValeur("ficheScolaire.pasDAffichageGraphe"),
        });
      }
      this.actualiserFicheGraphe();
    }
    if (
      GEtatUtilisateur.estModeAccessible() &&
      GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.LivretScolaire_Fiche
    ) {
      this.getInstance(this.IdentPied).effacer();
      this.getInstance(this.IdentMoyGen).effacer();
      this.afficherListeAccessible();
    } else {
      if (this.donnees.message) {
        this.evenementAfficherMessage(this.donnees.message);
      } else {
        if (
          GEtatUtilisateur.getGenreOnglet() ===
          EGenreOnglet.LivretScolaire_Fiche
        ) {
          if (this.donnees.eleve.listeLivret.count() > 0) {
            this.getInstance(this.IdentPied).setDonnees(
              this.donnees.piedDePage,
              this.donnees.estFilierePro,
              this.donnees.estCasBACPRO,
            );
          } else {
            this.getInstance(this.IdentPied).setDonnees(null);
          }
        }
        let lTailleMax = null;
        if (this.donnees.tailleMaxSaisie) {
          lTailleMax = this.donnees.tailleMaxSaisie;
        }
        this.affichage = {};
        this.affichage.avecRangEleve =
          !this.donnees.options ||
          this.donnees.options.contains(
            TypeOptionMaquetteLivretScolaireStandard.OMLST_AvecRangEleve,
          ) ||
          this.donnees.estFilierePro;
        this.affichage.avecMoyenneEleve =
          !this.donnees.options ||
          this.donnees.options.contains(
            TypeOptionMaquetteLivretScolaireStandard.OMLST_AvecMoyenneEleve,
          ) ||
          this.donnees.estFilierePro;
        this.affichage.avecMoyenneClasse =
          this.donnees.genre === EGenreOnglet.LivretScolaire_Fiche &&
          (!this.donnees.options ||
            this.donnees.options.contains(
              TypeOptionMaquetteLivretScolaireStandard.OMLST_AvecMoyenneClasse,
            ) ||
            this.donnees.estFilierePro);
        this.affichage.avecRepartition =
          this.donnees.genre === EGenreOnglet.LivretScolaire_Fiche &&
          (!this.donnees.options ||
            this.donnees.options.contains(
              TypeOptionMaquetteLivretScolaireStandard.OMLST_AvecRepartitionMoyenne,
            ) ||
            this.donnees.estFilierePro);
        this.affichage.avecCompetences =
          this.donnees.genre === EGenreOnglet.LivretScolaire_Fiche &&
          this.donnees.avecFiliere;
        this.affichage.avecAppreciationsPeriode =
          !this.donnees.options ||
          this.donnees.options.contains(
            TypeOptionMaquetteLivretScolaireStandard.OMLST_AvecAppreciationsParPeriode,
          );
        this.affichage.avecAppreciations =
          this.affichage.avecAppreciationsPeriode ||
          (this.donnees.options.contains(
            TypeOptionMaquetteLivretScolaireStandard.OMLST_AvecAppreciation,
          ) &&
            this.donnees.options.contains(
              TypeOptionMaquetteLivretScolaireStandard.OMLST_AvecMoyenneAnnuelle,
            ));
        this.affichage.avecColonneAppreciationsAnnuelles =
          this.donnees.options &&
          (this.donnees.options.contains(
            TypeOptionMaquetteLivretScolaireStandard.OMLST_AvecAppreciation,
          ) ||
            this.donnees.estFilierePro) &&
          (!this.donnees.options.contains(
            TypeOptionMaquetteLivretScolaireStandard.OMLST_AvecMoyenneAnnuelle,
          ) ||
            (this.affichage.avecAppreciations &&
              !this.affichage.avecAppreciationsPeriode));
        if (
          GEtatUtilisateur.getGenreOnglet() ===
          EGenreOnglet.LivretScolaire_Fiche
        ) {
          this.getInstance(this.IdentPage).setDonnees(
            new DonneesListe_FicheLivretScolaire(
              {
                donnees: this.donnees.eleve.listeLivret,
                donneesClasse: this.donnees.classe.listeLivret,
              },
              {
                affichage: this.affichage,
                avecFiliere: this.donnees.avecFiliere,
                initMenuContextuel: _initMenuContextuel.bind(this),
                instance: this.getInstance(this.IdentPage),
                listeEvaluations: this.listeSaisie,
                tailleMax: lTailleMax,
                eleveRedoublant: this.donnees.eleve.estRedoublant,
              },
            ),
          );
          if (!this.donnees.avecFiliere) {
            this.getInstance(this.IdentMoyGen).setDonnees(
              new DonneesListe_FicheLivretScolaire(
                {
                  donnees: this.donnees.eleve.listeMoyenne,
                  donneesClasse: this.donnees.classe.listeMoyenne,
                },
                {
                  affichage: this.affichage,
                  avecFiliere: this.donnees.avecFiliere,
                  initMenuContextuel: null,
                  instance: this.getInstance(this.IdentMoyGen),
                  listeEvaluations: null,
                  tailleMax: null,
                },
              ),
            );
          } else {
            this.getInstance(this.IdentMoyGen).effacer();
          }
        } else {
          if (
            GEtatUtilisateur.getGenreOnglet() ===
            EGenreOnglet.LivretScolaire_Appreciations
          ) {
            _initListeAppreciations.bind(this)(
              this.getInstance(this.IdentAppreciations),
            );
            this.getInstance(this.IdentAppreciations).setDonnees(
              new DonneesListe_FicheLivretScolaire(
                {
                  donnees: this.donnees.service.listeLivret,
                  donneesClasse: null,
                },
                {
                  affichage: this.affichage,
                  avecFiliere: null,
                  initMenuContextuel: null,
                  instance: this.getInstance(this.IdentAppreciations),
                  listeEvaluations: null,
                  tailleMax: lTailleMax,
                },
              ),
            );
          }
          if (
            GEtatUtilisateur.getGenreOnglet() ===
            EGenreOnglet.LivretScolaire_Competences
          ) {
            _initListeCompetences.bind(this)(
              this.getInstance(this.IdentCompetences),
            );
            this.getInstance(this.IdentCompetences).setDonnees(
              new DonneesListe_FicheLivretScolaire(
                {
                  donnees: this.donnees.service.listeLivret,
                  donneesClasse: null,
                },
                {
                  affichage: this.affichage,
                  avecFiliere: null,
                  initMenuContextuel: _initMenuContextuel.bind(this),
                  instance: this.getInstance(this.IdentCompetences),
                  listeEvaluations: this.listeSaisie,
                  tailleMax: lTailleMax,
                },
              ),
            );
          }
          this.getInstance(this.IdentResultat).setDonnees(
            new DonneesListe_FicheLivretScolaire(
              {
                donnees: this.donnees.service.listeMoyenne,
                donneesClasse: null,
              },
              {
                affichage: null,
                avecFiliere: null,
                initMenuContextuel: null,
                instance: this.getInstance(this.IdentResultat),
                listeEvaluations: null,
                tailleMax: null,
              },
            ),
          );
        }
        if (this.estAvecBandeau()) {
          this.donnees.libelleBandeau = "";
          this.donnees.hintLibelleBandeau = "";
          if (
            (this.donnees.service &&
              this.donnees.service.libelleEnseignement) ||
            (this.donnees.eleve && this.donnees.eleve.libelleEnseignement)
          ) {
            this.donnees.libelleBandeau = "&nbsp;";
            const lLibelleEnseignement =
              GEtatUtilisateur.getGenreOnglet() ===
              EGenreOnglet.LivretScolaire_Fiche
                ? this.donnees.eleve.libelleEnseignement
                : this.donnees.service.libelleEnseignement;
            const lLibelle = GChaine.getChaine(
              lLibelleEnseignement,
              10,
              true,
              Math.ceil(
                GChaine.getLongueurChaine(lLibelleEnseignement, 10, true),
              ),
            );
            this.donnees.libelleBandeau = lLibelle;
            if (lLibelle !== lLibelleEnseignement) {
              this.donnees.hintLibelleBandeau = lLibelleEnseignement;
            }
          }
        }
        this.surResizeInterface();
        if (
          GEtatUtilisateur.getGenreOnglet() !==
          EGenreOnglet.LivretScolaire_Competences
        ) {
          if (
            !_estSoumisADroitPourImprimer.call(this) ||
            GApplication.droits.get(
              TypeDroits.autoriserImpressionBulletinReleveBrevet,
            )
          ) {
            Invocateur.evenement(
              ObjetInvocateur.events.activationImpression,
              GEtatUtilisateur.getGenreOnglet() ===
                EGenreOnglet.LivretScolaire_Fiche ||
                GEtatUtilisateur.getGenreOnglet() ===
                  EGenreOnglet.LivretScolaire_Appreciations
                ? EGenreImpression.GenerationPDF
                : EGenreImpression.Format,
              this,
              () => {
                if (
                  GEtatUtilisateur.getGenreOnglet() ===
                  EGenreOnglet.LivretScolaire_Fiche
                ) {
                  return {
                    genreGenerationPDF: TypeHttpGenerationPDFSco.LivretScolaire,
                    eleve:
                      GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur
                        ? GEtatUtilisateur.Navigation.getRessource(
                            EGenreRessource.Eleve,
                          )
                        : GEtatUtilisateur.getMembre(),
                  };
                }
                const lMetaMatiere = GEtatUtilisateur.Navigation.getRessource(
                  EGenreRessource.DisciplineLivretScolaire,
                );
                return {
                  genreGenerationPDF:
                    TypeHttpGenerationPDFSco.LivretScolaire_Appreciations,
                  classe: this.classeSelectionne,
                  service: lMetaMatiere.service,
                  metaMatiere: lMetaMatiere,
                  genreEnseignement:
                    lMetaMatiere.typeEnseignement !== null ||
                    lMetaMatiere.typeEnseignement !== undefined
                      ? lMetaMatiere.typeEnseignement
                      : undefined,
                };
              },
            );
          }
        }
      }
    }
  }
  getListeTypesAppreciations() {
    this.moteurAssSaisie.getListeTypesAppreciations({
      typeReleveBulletin: TypeReleveBulletin.LivretScolaire,
      clbck: function (aListeTypesAppreciations) {
        this.listeTypesAppreciations = aListeTypesAppreciations;
      }.bind(this),
    });
  }
  traiterValidationAppreciationSelectionnee(aElmtAppreciationSelectionne) {
    const lInstanceListe =
      GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.LivretScolaire_Fiche
        ? this.getInstance(this.IdentPage)
        : this.getInstance(this.IdentAppreciations);
    const lCell = lInstanceListe.Donnees.celluleCourante;
    this.setEtatSaisie(true);
    lCell.setEtat(EGenreEtat.Modification);
    if (
      aElmtAppreciationSelectionne &&
      aElmtAppreciationSelectionne.existeNumero()
    ) {
      lCell.appreciationAnnuelle.setEtat(EGenreEtat.Modification);
      lCell.appreciationAnnuelle.Libelle =
        aElmtAppreciationSelectionne.getLibelle();
      lCell.appreciation = aElmtAppreciationSelectionne.getLibelle();
    }
  }
  getEleve() {
    return this.donnees.eleve;
  }
  valider() {
    this.donnees.genre = GEtatUtilisateur.getGenreOnglet();
    this.donnees.listeTypesAppreciations = this.listeTypesAppreciations;
    new ObjetRequeteSaisieLivretScolaire(
      this,
      this.actionSurValidation,
    ).lancerRequete(this.donnees);
  }
  afficherPage() {
    if (GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur) {
      this.classeSelectionne = GEtatUtilisateur.Navigation.getRessource(
        EGenreRessource.Classe,
      );
      this.getListeTypesAppreciations();
    }
    this.setEtatSaisie(false);
    if (this.bloquerDonneesAffichage) {
      this.getInstance(this.IdentPage).setDonnees(null);
      if (this.getInstance(this.identTripleCombo)) {
        this.getInstance(this.identTripleCombo).afficherCombo(
          EGenreRessource.DisciplineLivretScolaire,
          false,
        );
      }
      return;
    } else if (
      GEtatUtilisateur.getGenreOnglet() ===
        EGenreOnglet.LivretScolaire_Competences &&
      this.getInstance(this.identTripleCombo)
    ) {
      this.getInstance(this.identTripleCombo).afficherCombo(
        EGenreRessource.DisciplineLivretScolaire,
        true,
      );
    }
    const lObjet = {
      genre: GEtatUtilisateur.getGenreOnglet(),
      classe: this.classeSelectionne,
    };
    if (
      GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.LivretScolaire_Fiche
    ) {
      lObjet.eleve =
        GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur
          ? GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve)
          : GEtatUtilisateur.getMembre();
    } else {
      lObjet.discipline = GEtatUtilisateur.Navigation.getRessource(
        EGenreRessource.DisciplineLivretScolaire,
      );
    }
    new ObjetRequeteLivretScolaire(
      this,
      this.actionSurRecupererDonnees,
    ).lancerRequete(lObjet);
  }
  getPageImpression(AFormat) {
    const H = [];
    if (this.getInstance(this.IdentPage)) {
      H.push(this.getInstance(this.IdentPage).composePage(true, AFormat));
    }
    if (this.getInstance(this.IdentPied)) {
      H.push(this.getInstance(this.IdentPied).composeImpression(AFormat));
    }
    return {
      titre1: GEtatUtilisateur.getLibelleImpression(
        GTraductions.getValeur("ficheScolaire.livretScolaire"),
        false,
        true,
        true,
        false,
        false,
        false,
      ),
      contenu: H.join(""),
    };
  }
  surResizeInterface() {
    super.surResizeInterface();
  }
  afficherListeAccessible() {
    const lObjArborescent = this.Instances[this.IdentPage];
    const lRacine = lObjArborescent.construireRacine();
    let lNoeudGenreEnseignement,
      lNoeudMetaMatiere,
      lNoeudService,
      lNoeudPeriode,
      lNoeudCompetence,
      lNoeudAppreciation,
      lNoeudOnglet,
      lNoeudRepartition;
    let lNoeudRegroupement;
    let lObjetNoeudCompetences;
    let lMetaMatiere, lService, lCompetence, lAppreciation, lEvaluation;
    let lElmEleve, lElmClasse;
    let lID;
    let lIDAppr;
    const lClasseNoeud = "Gras EspaceGauche MargeHaut MargeBas";
    const lClasseFeuille = "MargeHaut MargeBas";
    if (this.donnees.message) {
      lObjArborescent.ajouterUneFeuilleAuNoeud(
        lRacine,
        this.Nom + "_GenreEnseignement_0",
        this.donnees.message,
        lClasseFeuille,
      );
    } else {
      if (this.donnees.avecFiliere) {
        for (let i = 0; i < this.donnees.eleve.listeLivret.count(); i++) {
          lElmEleve = this.donnees.eleve.listeLivret.get(i);
          lElmClasse = this.donnees.classe.listeLivret.get(i);
          if (!lElmEleve.pere) {
            lMetaMatiere = null;
            lService = null;
            lID = this.Nom + "_GenreEnseignement_" + lElmEleve.getGenre();
            lNoeudGenreEnseignement = lObjArborescent.ajouterUnNoeudAuNoeud(
              lRacine,
              lID,
              lElmEleve.getLibelle(),
              lClasseNoeud,
              true,
              true,
            );
          } else {
            if (
              !lMetaMatiere ||
              lMetaMatiere.getNumero() !== lElmEleve.metaMatiere.getNumero()
            ) {
              lMetaMatiere = lElmEleve.metaMatiere;
              lService = null;
              lID =
                this.Nom +
                "_Meta_" +
                lElmEleve.pere.getGenre() +
                "_" +
                lMetaMatiere.getNumero();
              lNoeudMetaMatiere = lObjArborescent.ajouterUnNoeudAuNoeud(
                lNoeudGenreEnseignement,
                lID,
                lMetaMatiere.getLibelle(),
                lClasseNoeud,
                true,
              );
              lObjetNoeudCompetences =
                lObjArborescent.construireUnNoeudPourNoeud(
                  lNoeudMetaMatiere,
                  this.Nom +
                    "_Competences_" +
                    lElmEleve.pere.getGenre() +
                    "_" +
                    lMetaMatiere.getNumero(),
                  GTraductions.getValeur(
                    "ficheScolaire.Accessible.Competences",
                  ),
                  lClasseNoeud,
                );
            }
            if (lElmEleve.service) {
              if (
                !lService ||
                lService.getNumero() !== lElmEleve.service.getNumero()
              ) {
                lService = lElmEleve.service;
                lAppreciation = null;
                lID =
                  this.Nom +
                  "_Service_" +
                  lElmEleve.pere.getGenre() +
                  "_" +
                  lMetaMatiere.getNumero() +
                  "_" +
                  lService.getNumero();
                lNoeudService = lObjArborescent.ajouterUnNoeudAuNoeud(
                  lNoeudMetaMatiere,
                  lID,
                  lService.getLibelle(),
                  lClasseNoeud,
                  true,
                );
              }
              if (lElmEleve.periode) {
                lID =
                  this.Nom +
                  "_Periode_" +
                  lElmEleve.pere.getGenre() +
                  "_" +
                  lMetaMatiere.getNumero() +
                  "_" +
                  lService.getNumero() +
                  "_" +
                  lElmEleve.periode.getNumero();
                lNoeudPeriode = lObjArborescent.ajouterUnNoeudAuNoeud(
                  lNoeudService,
                  lID,
                  lElmEleve.periode.getLibelle(),
                  lClasseNoeud,
                );
                this._construireFeuillesPeriode(
                  lElmEleve,
                  lElmClasse,
                  lObjArborescent,
                  lNoeudPeriode,
                  lID,
                  lClasseNoeud,
                  lClasseFeuille,
                );
              }
              if (lElmEleve.appreciationAnnuelle) {
                lAppreciation = lElmEleve.appreciationAnnuelle;
                lIDAppr =
                  this.Nom +
                  "_Periode_" +
                  lElmEleve.pere.getGenre() +
                  "_" +
                  lMetaMatiere.getNumero() +
                  "_" +
                  lService.getNumero() +
                  "_" +
                  lAppreciation.getNumero();
              }
            }
            if (
              lAppreciation &&
              lElmEleve.avecServices &&
              (lElmEleve.dernierDuService || lElmEleve.derniereligne)
            ) {
              let lLibelleAppreciation = lAppreciation
                ? lAppreciation.getLibelle()
                : GTraductions.getValeur("ficheScolaire.Accessible.pasevalue");
              if (lLibelleAppreciation === "") {
                lLibelleAppreciation = GTraductions.getValeur(
                  "ficheScolaire.Accessible.pasevalue",
                );
              }
              lNoeudAppreciation = lObjArborescent.ajouterUnNoeudAuNoeud(
                lNoeudService,
                lIDAppr,
                GTraductions.getValeur("ficheScolaire.titreColAppreciations"),
                lClasseNoeud,
              );
              lObjArborescent.ajouterUneFeuilleAuNoeud(
                lNoeudAppreciation,
                "",
                lLibelleAppreciation,
                lClasseFeuille,
              );
            }
            if (lElmEleve.itemLivretScolaire) {
              lCompetence = lElmEleve.itemLivretScolaire;
              lID =
                this.Nom +
                "_Competence_" +
                lElmEleve.pere.getGenre() +
                "_" +
                lMetaMatiere.getNumero() +
                "_" +
                lCompetence.getNumero();
              lNoeudCompetence = lObjArborescent.ajouterUnNoeudAuNoeud(
                lObjetNoeudCompetences.container,
                lID,
                lCompetence.getLibelle(),
                lClasseNoeud,
              );
              lEvaluation =
                lCompetence.evaluation && lCompetence.evaluation.getLibelle()
                  ? lCompetence.evaluation.getLibelle()
                  : GTraductions.getValeur(
                      "ficheScolaire.Accessible.pasevalue",
                    );
              lObjArborescent.ajouterUneFeuilleAuNoeud(
                lNoeudCompetence,
                lID + "_eval",
                GTraductions.getValeur("ficheScolaire.Accessible.evaluation") +
                  " : " +
                  lEvaluation,
                lClasseFeuille,
              );
            }
            if (lElmEleve.derniereligne) {
              lObjArborescent.ajouterArbreNoeudAuNoeud(
                lNoeudMetaMatiere,
                lObjetNoeudCompetences.noeud,
              );
            }
          }
        }
      } else {
        for (let i = 0; i < this.donnees.eleve.listeLivret.count(); i++) {
          lElmEleve = this.donnees.eleve.listeLivret.get(i);
          lElmClasse = this.donnees.classe.listeLivret.get(i);
          if (!lElmEleve.avecRegroupement) {
            lNoeudRegroupement = null;
          }
          if (lElmEleve.titreEnseignement) {
            lID = this.Nom + "_Regroupement_" + lElmEleve.getGenre();
            lNoeudRegroupement = lObjArborescent.ajouterUnNoeudAuNoeud(
              lRacine,
              lID,
              lElmEleve.getLibelle(),
              lClasseNoeud,
              true,
              true,
            );
            lService = null;
          } else {
            if (lElmEleve.avecRegroupement && !lNoeudRegroupement) {
            }
            if (
              !lService ||
              lService.getNumero() !== lElmEleve.service.getNumero()
            ) {
              lService = lElmEleve.service;
              const lNoeud = lNoeudRegroupement ? lNoeudRegroupement : lRacine;
              lID = this.Nom + "_Service_" + lService.getNumero();
              lNoeudService = lObjArborescent.ajouterUnNoeudAuNoeud(
                lNoeud,
                lID,
                lService.getLibelle(),
                lClasseNoeud,
                true,
              );
            }
          }
          if (lService && lElmEleve.periode) {
            lID =
              this.Nom +
              "_Periode_" +
              lService.getNumero() +
              "_" +
              lElmEleve.periode.getNumero();
            lNoeudPeriode = lObjArborescent.ajouterUnNoeudAuNoeud(
              lNoeudService,
              lID,
              lElmEleve.periode.getLibelle(),
              lClasseNoeud,
            );
            this._construireFeuillesPeriode(
              lElmEleve,
              lElmClasse,
              lObjArborescent,
              lNoeudPeriode,
              lID,
              lClasseNoeud,
              lClasseFeuille,
            );
            if (lElmEleve.appreciation) {
              lAppreciation =
                GTraductions.getValeur("ficheScolaire.titreColAppreciations") +
                " : " +
                lElmEleve.appreciation;
              lID =
                this.Nom +
                "_AppreciationPeriode_" +
                lService.getNumero() +
                "_" +
                lElmEleve.periode.getNumero();
              lObjArborescent.ajouterUneFeuilleAuNoeud(
                lNoeudPeriode,
                lID,
                lAppreciation,
                lClasseFeuille,
              );
            }
          }
        }
      }
      if (
        GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.LivretScolaire_Fiche
      ) {
        let lLibelleCommentaire, lLibelleAvis;
        if (this.donnees.piedDePage.avecAvisCE) {
          lID = this.Nom + "_Avis_";
          const lLibelle = this.donnees.piedDePage.estIssueDUnBOLycee
            ? GTraductions.getValeur("ficheScolaire.AvisEnVueDuBac")
            : GTraductions.getValeur("ficheScolaire.AvisDuChefDetablissement");
          lNoeudOnglet = lObjArborescent.ajouterUnNoeudAuNoeud(
            lRacine,
            lID,
            lLibelle,
            lClasseNoeud,
            false,
          );
          if (this.donnees.piedDePage.avisCE.infosLivret.avis) {
            lLibelleAvis =
              this.donnees.piedDePage.avisCE.infosLivret.avis.getLibelle();
            lObjArborescent.ajouterUneFeuilleAuNoeud(
              lNoeudOnglet,
              lID,
              lLibelleAvis,
              lClasseFeuille,
            );
          }
          if (this.donnees.piedDePage.avisCE.infosLivret.commentaire) {
            lLibelleCommentaire =
              this.donnees.piedDePage.avisCE.infosLivret.commentaire;
            lObjArborescent.ajouterUneFeuilleAuNoeud(
              lNoeudOnglet,
              lID,
              lLibelleCommentaire,
              lClasseFeuille,
            );
          }
          lID = this.Nom + "_Repartition_";
          lNoeudRepartition = lObjArborescent.ajouterUnNoeudAuNoeud(
            lRacine,
            lID,
            this.donnees.piedDePage.avisCE.libelleRepatition,
            lClasseNoeud,
            false,
          );
          this._construireRepartition(
            lObjArborescent,
            lNoeudRepartition,
            lClasseFeuille,
          );
        }
        if (this.donnees.piedDePage.avecEngagements) {
          lID = this.Nom + "_Engagements_";
          lNoeudOnglet = lObjArborescent.ajouterUnNoeudAuNoeud(
            lRacine,
            lID,
            GTraductions.getValeur("ficheScolaire.Engagements"),
            lClasseNoeud,
            false,
          );
          if (this.donnees.piedDePage.engagements.listeEngagements) {
            lLibelleAvis = this.donnees.piedDePage.engagements.listeEngagements
              .getTableauLibelles()
              .join(", ");
            lObjArborescent.ajouterUneFeuilleAuNoeud(
              lNoeudOnglet,
              lID,
              lLibelleAvis,
              lClasseFeuille,
            );
          }
          if (this.donnees.piedDePage.engagements.infosLivret.commentaire) {
            lLibelleCommentaire =
              this.donnees.piedDePage.engagements.infosLivret.commentaire;
            lObjArborescent.ajouterUneFeuilleAuNoeud(
              lNoeudOnglet,
              lID,
              lLibelleCommentaire,
              lClasseFeuille,
            );
          }
        }
        if (this.donnees.piedDePage.avecInvestissement) {
          lID = this.Nom + "_Investissement_";
          lNoeudOnglet = lObjArborescent.ajouterUnNoeudAuNoeud(
            lRacine,
            lID,
            GTraductions.getValeur("ficheScolaire.Investissement"),
            lClasseNoeud,
            false,
          );
          if (this.donnees.piedDePage.investissement.infosLivret.commentaire) {
            lLibelleCommentaire =
              this.donnees.piedDePage.investissement.infosLivret.commentaire;
            lObjArborescent.ajouterUneFeuilleAuNoeud(
              lNoeudOnglet,
              lID,
              lLibelleCommentaire,
              lClasseFeuille,
            );
          }
        }
        if (this.donnees.piedDePage.avecPFMP) {
        }
      }
    }
    $("#" + lObjArborescent.Nom.escapeJQ()).replaceWith(
      lObjArborescent.construireAffichage("100%"),
    );
    lObjArborescent.setDonnees(lRacine);
  }
  _construireFeuillesPeriode(
    aElmEleve,
    aElmClasse,
    aObjArborescent,
    aNoeudPeriode,
    aID,
    aClasseNoeud,
    aClasseFeuille,
  ) {
    const lRang = this._getClassementEleve(aElmEleve, aElmClasse);
    let lLibelleMoyenneEleve,
      lLibelleMoyenneClasse,
      lLibelleInf8,
      lLibelleDe8a12,
      lLibelleSup12;
    let lNoeudRepartition;
    if (lRang > 0 && aElmClasse.rangTotal !== undefined) {
      aObjArborescent.ajouterUneFeuilleAuNoeud(
        aNoeudPeriode,
        aID + "_rang",
        GTraductions.getValeur("ficheScolaire.titreColRang") +
          " : " +
          lRang +
          "/" +
          aElmClasse.rangTotal,
        aClasseFeuille,
      );
    }
    lLibelleMoyenneEleve = aElmEleve.moyEleve.getNote();
    if (lLibelleMoyenneEleve === "") {
      lLibelleMoyenneEleve = GTraductions.getValeur(
        "ficheScolaire.Accessible.pasevalue",
      );
    }
    lLibelleMoyenneEleve =
      GTraductions.getValeur("ficheScolaire.titreColMoyEleve") +
      " : " +
      lLibelleMoyenneEleve;
    lLibelleMoyenneClasse = aElmClasse.moyClasse.getNote();
    if (lLibelleMoyenneClasse === "") {
      lLibelleMoyenneClasse = GTraductions.getValeur(
        "ficheScolaire.Accessible.pasevalue",
      );
    }
    lLibelleMoyenneClasse =
      GTraductions.getValeur("ficheScolaire.titreColMoyClasse") +
      " : " +
      lLibelleMoyenneClasse;
    aObjArborescent.ajouterUneFeuilleAuNoeud(
      aNoeudPeriode,
      aID + "_MoyEleve",
      lLibelleMoyenneEleve,
      aClasseFeuille,
    );
    aObjArborescent.ajouterUneFeuilleAuNoeud(
      aNoeudPeriode,
      aID + "_MoyClasse",
      lLibelleMoyenneClasse,
      aClasseFeuille,
    );
    lNoeudRepartition = aObjArborescent.ajouterUnNoeudAuNoeud(
      aNoeudPeriode,
      aID + "_Repartition",
      GTraductions.getValeur(
        "ficheScolaire.Accessible.RepartitionDesNotesDansLaClasse",
      ),
      aClasseNoeud,
      false,
    );
    if (aElmClasse.inf8) {
      lLibelleInf8 =
        GTraductions.getValeur("ficheScolaire.Accessible.inf8") +
        " : " +
        aElmClasse.inf8 +
        " %";
      aObjArborescent.ajouterUneFeuilleAuNoeud(
        lNoeudRepartition,
        aID + "_Inf8",
        lLibelleInf8,
        aClasseFeuille,
      );
    }
    if (aElmClasse.de8a12) {
      lLibelleDe8a12 =
        GTraductions.getValeur("ficheScolaire.Accessible.de8a12") +
        " : " +
        aElmClasse.de8a12 +
        " %";
      aObjArborescent.ajouterUneFeuilleAuNoeud(
        lNoeudRepartition,
        aID + "_de8a12",
        lLibelleDe8a12,
        aClasseFeuille,
      );
    }
    if (aElmClasse.sup12) {
      lLibelleSup12 =
        GTraductions.getValeur("ficheScolaire.Accessible.sup12") +
        " : " +
        aElmClasse.sup12 +
        " %";
      aObjArborescent.ajouterUneFeuilleAuNoeud(
        lNoeudRepartition,
        aID + "_sup12",
        lLibelleSup12,
        aClasseFeuille,
      );
    }
  }
  _getClassementEleve(aElmEleve, aElmClasse) {
    const lMoyEleve = aElmEleve.moyEleve ? aElmEleve.moyEleve : 0;
    if (!aElmClasse || !aElmClasse.tabMoyennes) {
      return 0;
    }
    const lTabMoyenne = aElmClasse.tabMoyennes;
    if (!lMoyEleve || !lMoyEleve.estUneValeur()) {
      return 0;
    }
    let lRang = 1;
    for (let i = 0; i < lTabMoyenne.length; i++) {
      if (
        lTabMoyenne[i].estUneValeur() &&
        lTabMoyenne[i].getValeur() > lMoyEleve.getValeur()
      ) {
        lRang += 1;
      }
    }
    return lRang;
  }
  _construireRepartition(aObjArborescent, aNoeudRepartition, aClasseFeuille) {
    const lObjPied = this.donnees.piedDePage.avisCE;
    let lValeur,
      lLibelleRepartition,
      lID,
      lNbAvisNonRemplis = lObjPied.nbElevesTotal;
    for (let i = 0; i < lObjPied.listeAvis.count(); i++) {
      let lAvis = lObjPied.listeAvis.get(i);
      lNbAvisNonRemplis -= lAvis.nbEleves;
      lValeur =
        Math.round((lAvis.nbEleves * 10000) / lObjPied.nbElevesTotal) / 100;
      lLibelleRepartition =
        lValeur.toFixed(2) + " %" + " : " + lAvis.getLibelle();
      lID = this.Nom + "_Repartition_" + i;
      aObjArborescent.ajouterUneFeuilleAuNoeud(
        aNoeudRepartition,
        lID,
        lLibelleRepartition,
        aClasseFeuille,
      );
    }
    lValeur =
      Math.round((lNbAvisNonRemplis * 10000) / lObjPied.nbElevesTotal) / 100;
    lLibelleRepartition =
      lValeur.toFixed(2) +
      " %" +
      " : " +
      GTraductions.getValeur("ficheScolaire.AvisNonRempli");
    lID = this.Nom + "_Repartition_" + "AvisNonRempli";
    aObjArborescent.ajouterUneFeuilleAuNoeud(
      aNoeudRepartition,
      lID,
      lLibelleRepartition,
      aClasseFeuille,
    );
  }
  addSurZoneAccuseReception() {
    if (this.avecGestionAccuseReception) {
      this.AddSurZone.push({ separateur: true });
      this.AddSurZone.push({
        html:
          '<ie-checkbox class="AlignementMilieuVertical" ie-model="cbAccuseReception" ie-if="cbAccuseReception.estVisible">' +
          GTraductions.getValeur(
            "BulletinEtReleve.JAiPrisConnaissanceDuBulletin",
          ) +
          "</ie-checkbox>",
      });
      return true;
    }
    return false;
  }
  _getResponsableAccuseReception() {
    let lReponsableAccuseReception = null;
    if (
      !!this.listeAccusesReception &&
      this.listeAccusesReception.count() > 0
    ) {
      lReponsableAccuseReception =
        this.listeAccusesReception.getPremierElement();
      if (!!lReponsableAccuseReception) {
      }
    }
    return lReponsableAccuseReception;
  }
}
function _initMenuContextuel(aParametres) {
  const lThis = this;
  const lInstanceListe = _getInstanceListeSelonOnglet.call(this);
  const lSelections = lInstanceListe.Donnees.celluleCourante,
    lDonnees = lInstanceListe.Donnees,
    lMenu = aParametres.menuContextuel,
    lListeEval =
      (lSelections.itemLivretScolaire &&
        lSelections.itemLivretScolaire.estEvaluationLV) ||
      (lSelections.listeCompetences &&
        lSelections.listeCompetences.get(0).estEvaluationLV)
        ? lDonnees.parametres.listeEvaluations.listeEvaluationsLSLV
        : lDonnees.parametres.listeEvaluations.listeEvaluationsLS;
  lListeEval.parcourir((aElement) => {
    aElement.tableauLibelles = [aElement.getLibelle()];
    if (
      aElement.getGenre() === undefined ||
      aElement.getGenre() === null ||
      aElement.getGenre() === -1
    ) {
      aElement.raccourci = "0";
    } else if (aElement.getGenre() === 0) {
      aElement.raccourci = "N";
    } else {
      aElement.raccourci = aElement.getGenre().toString();
    }
    aElement.tableauLibelles.push(aElement.raccourci);
  });
  lDonnees.listeEval = lListeEval;
  lMenu.setOptions({ lLargeurMin: 150, largeurColonneGauche: 0 });
  lMenu.addTitre(
    GTraductions.getValeur("ficheScolaire.titreSaisieEvaluations"),
  );
  for (let i = 0, lNbr = lListeEval.count(); i < lNbr; i++) {
    const lEval = lListeEval.get(i);
    lMenu.add(
      lEval.tableauLibelles || lEval.getLibelle(),
      true,
      function () {
        this.Donnees.evenementMenuContextuel(aParametres);
        this.setEtatSaisie(true);
        const lElmPage = $("#" + lThis.getNom().escapeJQ());
        const lScroll = lElmPage.scrollTop();
        this.actualiser(true);
        lElmPage.scrollTop(lScroll);
      },
      { data: i },
    );
  }
}
function _initListeLivret(aInstance) {
  aInstance.setOptionsListe({
    colonnes: [
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.regroupement,
        titre: {
          title: GTraductions.getValeur("ficheScolaire.titreColDiscipline"),
          libelleHtml: GTraductions.getValeur(
            "ficheScolaire.titreColDiscipline",
          ),
          estCoche: true,
        },
        taille: 5,
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.discipline,
        titre: {
          title: GTraductions.getValeur("ficheScolaire.titreColDiscipline"),
          libelleHtml: GTraductions.getValeur(
            "ficheScolaire.titreColDiscipline",
          ),
          avecFusionColonne: true,
        },
        taille: 300,
      },
      { id: DonneesListe_FicheLivretScolaire.colonnes.periode, taille: 35 },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.anciennesNotes,
        titre: {
          libelleHtml: GTraductions.getValeur(
            "ficheScolaire.TitreColonneAnneePrecedente",
          ),
          nbLignes: 2,
          title: GTraductions.getValeur(
            "ficheScolaire.HintColonneAnneePrecedente",
          ),
        },
        taille: 25,
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.rang,
        titre: {
          libelleHtml: GTraductions.getValeur("ficheScolaire.titreColRang"),
          nbLignes: 2,
          title: GTraductions.getValeur("ficheScolaire.titreColRang"),
        },
        taille: 40,
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.moyEleve,
        titre: {
          libelleHtml: GTraductions.getValeur(
            "ficheScolaire.titreColAbbrMoyEleve",
          ),
          nbLignes: 2,
          title: GTraductions.getValeur("ficheScolaire.titreColMoyEleve"),
        },
        taille: 40,
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.moyClasse,
        titre: {
          libelleHtml: GTraductions.getValeur(
            "ficheScolaire.titreColAbbrMoyClasse",
          ),
          nbLignes: 2,
          title: GTraductions.getValeur("ficheScolaire.titreColMoyClasse"),
        },
        taille: 40,
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.inf8,
        titre: {
          libelleHtml: GTraductions.getValeur("ficheScolaire.titreColInf8"),
          nbLignes: 2,
          title: GTraductions.getValeur("ficheScolaire.Accessible.inf8"),
        },
        taille: 40,
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.de8a12,
        titre: {
          libelleHtml: GTraductions.getValeur("ficheScolaire.titreCol8A12"),
          nbLignes: 2,
          title: GTraductions.getValeur("ficheScolaire.Accessible.de8a12"),
        },
        taille: 40,
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.sup12,
        titre: {
          libelleHtml: GTraductions.getValeur("ficheScolaire.titreColSup12"),
          nbLignes: 2,
          title: GTraductions.getValeur("ficheScolaire.Accessible.sup12"),
        },
        taille: 40,
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.evaluation,
        titre: {
          libelleHtml: GTraductions.getValeur(
            "ficheScolaire.titreColCompetences",
          ),
          nbLignes: 2,
          title: GTraductions.getValeur("ficheScolaire.titreColCompetences"),
        },
        taille: "100%",
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.saisieEval,
        titre: {
          libelleHtml: GTraductions.getValeur(
            "ficheScolaire.titreColCompetences",
          ),
          nbLignes: 2,
          title: GTraductions.getValeur("ficheScolaire.titreColCompetences"),
          avecFusionColonne: true,
        },
        taille: 20,
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.appreciation,
        titre: {
          libelleHtml: GTraductions.getValeur(
            "ficheScolaire.titreColAppreciations",
          ),
          nbLignes: 2,
          title: GTraductions.getValeur("ficheScolaire.titreColAppreciations"),
        },
        taille: "100%",
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.apprAnnuelle,
        titre: {
          libelleHtml: GTraductions.getValeur(
            "ficheScolaire.titreColAppreciationsAnn",
          ),
          nbLignes: 2,
          title: GTraductions.getValeur(
            "ficheScolaire.titreColAppreciationsAnn",
          ),
        },
        taille: "100%",
      },
    ],
    boutons: [
      { genre: ObjetListe.typeBouton.rechercher },
      { genre: ObjetListe.typeBouton.deployer },
    ],
    hauteurAdapteContenu: Infinity,
  });
}
function _initListeMoyenne(aInstance) {
  aInstance.setOptionsListe({
    colonnes: [
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.regroupement,
        estCoche: true,
        taille: 5,
      },
      { id: DonneesListe_FicheLivretScolaire.colonnes.discipline, taille: 300 },
      { id: DonneesListe_FicheLivretScolaire.colonnes.periode, taille: 35 },
      { id: DonneesListe_FicheLivretScolaire.colonnes.rang, taille: 40 },
      { id: DonneesListe_FicheLivretScolaire.colonnes.moyEleve, taille: 40 },
      { id: DonneesListe_FicheLivretScolaire.colonnes.moyClasse, taille: 40 },
      { id: DonneesListe_FicheLivretScolaire.colonnes.inf8, taille: 40 },
      { id: DonneesListe_FicheLivretScolaire.colonnes.de8a12, taille: 40 },
      { id: DonneesListe_FicheLivretScolaire.colonnes.sup12, taille: 40 },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.evaluation,
        taille: "100%",
      },
      { id: DonneesListe_FicheLivretScolaire.colonnes.saisieEval, taille: 20 },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.appreciation,
        taille: "100%",
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.apprAnnuelle,
        taille: "100%",
      },
    ],
    avecLigneCreation: false,
    hauteurAdapteContenu: true,
  });
}
function _initListeAppreciations(aInstance) {
  aInstance.setOptionsListe({
    colonnes: [
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.regroupement,
        titre: {
          title: this.donnees.service.titre,
          libelleHtml: this.donnees.service.titre,
          estCoche: true,
        },
        taille: 5,
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.discipline,
        titre: {
          title: this.donnees.service.titre,
          libelleHtml: this.donnees.service.titre,
          avecFusionColonne: true,
        },
        taille: 300,
      },
      { id: DonneesListe_FicheLivretScolaire.colonnes.periode, taille: 35 },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.rang,
        titre: {
          libelleHtml: GTraductions.getValeur("ficheScolaire.titreColRang"),
          nbLignes: 2,
          title: GTraductions.getValeur("ficheScolaire.titreColRang"),
        },
        taille: 40,
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.moyEleve,
        titre: {
          libelleHtml: GTraductions.getValeur(
            "ficheScolaire.titreColAbbrMoyEleve",
          ),
          nbLignes: 2,
          title: GTraductions.getValeur("ficheScolaire.titreColMoyEleve"),
        },
        taille: 40,
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.moyClasse,
        titre: {
          libelleHtml: GTraductions.getValeur(
            "ficheScolaire.titreColAbbrMoyClasse",
          ),
          nbLignes: 2,
          title: GTraductions.getValeur("ficheScolaire.titreColMoyClasse"),
        },
        taille: 40,
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.inf8,
        titre: {
          libelleHtml: GTraductions.getValeur("ficheScolaire.titreColInf8"),
          nbLignes: 2,
          title: GTraductions.getValeur("ficheScolaire.Accessible.inf8"),
        },
        taille: 40,
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.de8a12,
        titre: {
          libelleHtml: GTraductions.getValeur("ficheScolaire.titreCol8A12"),
          nbLignes: 2,
          title: GTraductions.getValeur("ficheScolaire.Accessible.de8a12"),
        },
        taille: 40,
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.sup12,
        titre: {
          libelleHtml: GTraductions.getValeur("ficheScolaire.titreColSup12"),
          nbLignes: 2,
          title: GTraductions.getValeur("ficheScolaire.Accessible.sup12"),
        },
        taille: 40,
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.evaluation,
        titre: {
          libelleHtml: GTraductions.getValeur(
            "ficheScolaire.titreColCompetences",
          ),
          nbLignes: 2,
          title: GTraductions.getValeur("ficheScolaire.titreColCompetences"),
        },
        taille: "100%",
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.saisieEval,
        titre: {
          libelleHtml: GTraductions.getValeur(
            "ficheScolaire.titreColCompetences",
          ),
          nbLignes: 2,
          title: GTraductions.getValeur("ficheScolaire.titreColCompetences"),
          avecFusionColonne: true,
        },
        taille: 20,
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.appreciation,
        titre: {
          libelleHtml: GTraductions.getValeur("BulletinEtReleve.Appreciations"),
          nbLignes: 2,
          title: GTraductions.getValeur("BulletinEtReleve.Appreciations"),
        },
        taille: "100%",
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.apprAnnuelle,
        titre: {
          libelleHtml: GTraductions.getValeur(
            "ficheScolaire.titreColAppreciationsAnn",
          ),
          nbLignes: 2,
          title: GTraductions.getValeur(
            "ficheScolaire.titreColAppreciationsAnn",
          ),
        },
        taille: "100%",
      },
    ],
    hauteurAdapteContenu: true,
  });
}
function _initListeCompetences(aInstance) {
  const lColonnes = [
    {
      id: DonneesListe_FicheLivretScolaire.colonnes.regroupement,
      titre: {
        title: this.donnees.service.titre,
        libelleHtml: this.donnees.service.titre,
        estCoche: true,
      },
      taille: 5,
    },
    {
      id: DonneesListe_FicheLivretScolaire.colonnes.discipline,
      titre: {
        title: this.donnees.service.titre,
        libelleHtml: this.donnees.service.titre,
        avecFusionColonne: true,
      },
      taille: 300,
    },
    { id: DonneesListe_FicheLivretScolaire.colonnes.periode, taille: 35 },
    {
      id: DonneesListe_FicheLivretScolaire.colonnes.rang,
      titre: {
        libelleHtml: GTraductions.getValeur("ficheScolaire.titreColRang"),
        nbLignes: 2,
        title: GTraductions.getValeur("ficheScolaire.titreColRang"),
      },
      taille: 40,
    },
    {
      id: DonneesListe_FicheLivretScolaire.colonnes.moyEleve,
      titre: {
        libelleHtml: GTraductions.getValeur(
          "ficheScolaire.titreColAbbrMoyEleve",
        ),
        nbLignes: 2,
        title: GTraductions.getValeur("ficheScolaire.titreColMoyEleve"),
      },
      taille: 40,
    },
  ];
  const lDiscipline = this.donnees.service.listeLivret.get(0);
  const lListeCompetences =
    lDiscipline && lDiscipline.listeCompetences
      ? lDiscipline.listeCompetences
      : null;
  if (!!lListeCompetences) {
    for (let i = 0, lNbr = lListeCompetences.count(); i < lNbr; i++) {
      if (this.donnees.avecJauge && this.visuJauge) {
        lColonnes.push({
          id: DonneesListe_FicheLivretScolaire.colonnes.jaugeEval + i,
          rangJauge: i,
          titre: {
            libelleHtml: lListeCompetences.get(i).getLibelle(),
            title: lListeCompetences.get(i).getLibelle(),
            avecFusionColonne: true,
          },
          taille: "80%",
        });
      }
      lColonnes.push({
        id: DonneesListe_FicheLivretScolaire.colonnes.saisieEval + i,
        rangColonne: i,
        titre: {
          libelleHtml: lListeCompetences.get(i).getLibelle(),
          title: lListeCompetences.get(i).getLibelle(),
          avecFusionColonne: true,
        },
        taille: this.donnees.avecJauge && this.visuJauge ? "20%" : "100%",
      });
    }
  } else {
  }
  aInstance.setOptionsListe({
    colonnes: lColonnes,
    hauteurAdapteContenu: Infinity,
  });
}
function _initListeResultat(aInstance) {
  aInstance.setOptionsListe({
    colonnes: [
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.regroupement,
        estCoche: true,
        taille: 5,
      },
      { id: DonneesListe_FicheLivretScolaire.colonnes.discipline, taille: 300 },
      { id: DonneesListe_FicheLivretScolaire.colonnes.periode, taille: 35 },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.moyClasse,
        titre: {
          libelleHtml: GTraductions.getValeur(
            "ficheScolaire.titreColAbbrMoyClasse",
          ),
          nbLignes: 2,
          title: GTraductions.getValeur("ficheScolaire.titreColMoyClasse"),
        },
        taille: 40,
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.inf8,
        titre: {
          libelleHtml: GTraductions.getValeur("ficheScolaire.titreColInf8"),
          nbLignes: 2,
          title: GTraductions.getValeur("ficheScolaire.Accessible.inf8"),
        },
        taille: 40,
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.de8a12,
        titre: {
          libelleHtml: GTraductions.getValeur("ficheScolaire.titreCol8A12"),
          nbLignes: 2,
          title: GTraductions.getValeur("ficheScolaire.Accessible.de8a12"),
        },
        taille: 40,
      },
      {
        id: DonneesListe_FicheLivretScolaire.colonnes.sup12,
        titre: {
          libelleHtml: GTraductions.getValeur("ficheScolaire.titreColSup12"),
          nbLignes: 2,
          title: GTraductions.getValeur("ficheScolaire.Accessible.sup12"),
        },
        taille: 40,
      },
    ],
    avecLigneCreation: false,
    hauteurAdapteContenu: true,
  });
}
function _evenementFenetreEditionAppr(aParams) {
  if (aParams.numeroBouton === 1) {
    this.elementCourant.setEtat(EGenreEtat.Modification);
    const lLibelle = [];
    if (aParams.services) {
      for (let index = 0; index < aParams.services.count(); index++) {
        const lService = aParams.services.get(index);
        const lServiceSaisie = this.elementCourant.services.getElementParNumero(
          lService.getNumero(),
        );
        if (
          lService.appreciationAnnuelle &&
          lService.appreciationAnnuelle.getEtat() !== EGenreEtat.Aucun
        ) {
          lServiceSaisie.appreciationAnnuelle.setLibelle(
            lService.appreciationAnnuelle.getLibelle(),
          );
          lServiceSaisie.appreciationAnnuelle.setEtat(EGenreEtat.Modification);
          lServiceSaisie.setEtat(EGenreEtat.Modification);
        }
        lLibelle.push(lService.appreciationAnnuelle.getLibelle());
      }
      const lInstanceListe =
        GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.LivretScolaire_Fiche
          ? this.getInstance(this.IdentPage)
          : this.getInstance(this.IdentAppreciations);
      const lCell = lInstanceListe.Donnees.celluleCourante;
      this.setEtatSaisie(true);
      lCell.setEtat(EGenreEtat.Modification);
      lCell.appreciationAnnuelle.setEtat(EGenreEtat.Modification);
      lCell.appreciationAnnuelle.Libelle = lLibelle.join("\n");
      lCell.appreciation = lLibelle.join("\n");
      lInstanceListe.actualiser(true);
    }
  }
}
function _evenementSaisieAppreciationMultiService(aParam) {
  if (GEtatUtilisateur.GenreEspace !== EGenreEspace.Professeur) {
    return;
  }
  this.elementCourant = aParam.article;
  const lAppreciation = aParam.article.appreciation;
  this.objCelluleAppreciation = $.extend(
    {
      article: aParam.article,
      appreciation: lAppreciation,
      idColonne: aParam.idColonne,
    },
    { ctxPiedBulletin: false },
  );
  const lFenetre = ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_EditionAppreciationAnnuelleMS,
    {
      pere: this,
      evenement: _evenementFenetreEditionAppr.bind(this),
      initialiser: true,
    },
  );
  lFenetre.setDonnees({
    element: this.elementCourant,
    services: this.elementCourant.services,
    tailleMaxSaisie: this.moteur.getTailleMaxAppreciation({
      estCtxPied: false,
      eleve: this.getEleve(),
      typeReleveBulletin: TypeReleveBulletin.LivretScolaire,
      tailleMaxDonneesAffichage: this.donnees.tailleMaxSaisie,
    }),
    moteurAssSaisie: this.moteurAssSaisie,
    listeTypesAppreciations: this.listeTypesAppreciations,
  });
}
function _evntSurListeLivret(aParam) {
  switch (aParam.genreEvenement) {
    case EGenreEvenementListe.Edition:
      if (
        aParam.idColonne ===
        DonneesListe_FicheLivretScolaire.colonnes.saisieEval
      ) {
        aParam.ouvrirMenuContextuel();
      } else if (
        aParam.article.services &&
        aParam.article.services.count() > 1
      ) {
        _evenementSaisieAppreciationMultiService.call(this, aParam);
      } else {
        if (GEtatUtilisateur.assistantSaisieActif) {
          const lAppreciation = aParam.article.appreciation;
          this.moteurAssSaisie.evenementOuvrirAssistantSaisie({
            instanceFenetreAssistantSaisie: this.getInstance(
              this.identFenetreAssistantSaisie,
            ),
            listeTypesAppreciations: this.listeTypesAppreciations,
            tabTypeAppreciation: ETypeAppreciationUtil.getTypeAppreciation(
              GEtatUtilisateur.getGenreOnglet(),
              lAppreciation,
              false,
            ),
            tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
              estCtxPied: false,
              eleve: this.getEleve(),
              typeReleveBulletin: TypeReleveBulletin.LivretScolaire,
              tailleMaxDonneesAffichage: this.donnees.tailleMaxSaisie,
            }),
          });
          this.objCelluleAppreciation = $.extend(
            {
              article: aParam.article,
              appreciation: lAppreciation,
              idColonne: aParam.idColonne,
            },
            { ctxPiedBulletin: false },
          );
        }
      }
      break;
    case EGenreEvenementListe.KeyPressListe:
      return _surKeyUpListe.call(this, aParam.event, false);
    default:
      break;
  }
}
function _evntSurListeCompetences(aParam) {
  switch (aParam.genreEvenement) {
    case EGenreEvenementListe.Selection: {
      let lNouvelleRessource = null;
      const lListeCellulesSelectionnees =
        aParam.instance.getTableauCellulesSelection();
      if (
        !!lListeCellulesSelectionnees &&
        lListeCellulesSelectionnees.length > 0
      ) {
        if (
          lListeCellulesSelectionnees.length === 1 &&
          !!lListeCellulesSelectionnees[0]
        ) {
          lNouvelleRessource = lListeCellulesSelectionnees[0].article;
        } else {
          for (let i = 0; i < lListeCellulesSelectionnees.length; i++) {
            if (!!lListeCellulesSelectionnees[i]) {
              const lCellule = lListeCellulesSelectionnees[i];
              if (!lNouvelleRessource) {
                lNouvelleRessource = lCellule.article;
              } else if (
                !!lCellule.article &&
                lCellule.article.getNumero() !== lNouvelleRessource.getNumero()
              ) {
                lNouvelleRessource = null;
                break;
              }
            }
          }
        }
      }
      const lRessourceActuelle = GEtatUtilisateur.Navigation.getRessource(
        EGenreRessource.Eleve,
      );
      if (!!lRessourceActuelle || !!lNouvelleRessource) {
        const lEleve = !!lNouvelleRessource
          ? lNouvelleRessource.eleve
          : undefined;
        if (
          (!lRessourceActuelle && !!lEleve) ||
          (!!lRessourceActuelle && !lEleve) ||
          lRessourceActuelle.getNumero() !== lEleve.getNumero()
        ) {
          GEtatUtilisateur.Navigation.setRessource(
            EGenreRessource.Eleve,
            lEleve,
          );
        }
      }
      break;
    }
    case EGenreEvenementListe.Edition:
      aParam.ouvrirMenuContextuel();
      break;
    case EGenreEvenementListe.KeyPressListe:
      return _surKeyUpListe.call(this, aParam.event, true);
    default:
      break;
  }
}
function _surKeyUpListe(aEvent, aPourCompetences) {
  const lListe = aPourCompetences
    ? this.getInstance(this.IdentCompetences)
    : this.getInstance(this.IdentPage);
  const lSelections = lListe.getTableauCellulesSelection();
  let lSelectionCellule = null;
  lSelections.forEach((aSelection) => {
    if (DonneesListe_FicheLivretScolaire.estUneColonneCompetence(aSelection)) {
      lSelectionCellule = aSelection;
      return false;
    }
  });
  if (!!lSelectionCellule) {
    let lCompetence = null;
    if (aPourCompetences) {
      lCompetence = lSelectionCellule.article.listeCompetences.get(
        lSelectionCellule.declarationColonne.rangColonne,
      );
    } else {
      lCompetence = lSelectionCellule.article.itemLivretScolaire;
    }
    const lListeEval =
      !!lCompetence && lCompetence.estEvaluationLV
        ? this.listeSaisie.listeEvaluationsLSLV
        : this.listeSaisie.listeEvaluationsLS;
    const lCompetenceDEvent = _getCompetencesDEventClavier(aEvent, lListeEval);
    if (lCompetenceDEvent) {
      lCompetence.evaluation = lCompetenceDEvent;
      if (lCompetenceDEvent.getGenre() === -1) {
        lCompetence.evaluation.setEtat(EGenreEtat.Suppression);
      }
      lSelectionCellule.article.setEtat(EGenreEtat.FilsModification);
      lCompetence.setEtat(EGenreEtat.FilsModification);
      this.setEtatSaisie(true);
      const lElmPage = $("#" + this.getNom().escapeJQ());
      const lScroll = lElmPage.scrollTop();
      lListe.actualiser(true);
      lElmPage.scrollTop(lScroll);
      lListe.selectionnerCelluleSuivante({
        orientationVerticale: !aPourCompetences,
        avecCelluleEditable: true,
        entrerEdition: false,
      });
      return true;
    }
  }
}
function _getCompetencesDEventClavier(aEvent, aListeCompetences) {
  if (!aListeCompetences || !aEvent) {
    return null;
  }
  if (aEvent.ctrlKey || aEvent.altKey) {
    return null;
  }
  let lEventKey =
    !!aEvent.key && !!aEvent.key.toLowerCase ? aEvent.key.toLowerCase() : "";
  const lEstSupprimer =
    aEvent.which === ToucheClavier.Supprimer ||
    aEvent.which === ToucheClavier.Backspace ||
    lEventKey === "0";
  let lResult = null;
  if (!!lEventKey || lEstSupprimer) {
    if (lEstSupprimer) {
      lResult = MethodesObjet.dupliquer(
        aListeCompetences.getElementParGenre(-1),
      );
    } else {
      if (lEventKey === "n") {
        lEventKey = 0;
      }
      const lKeyValue = parseInt(lEventKey);
      if (MethodesObjet.isNumber(lKeyValue)) {
        aListeCompetences.parcourir((aCompetence) => {
          if (lKeyValue === aCompetence.getGenre()) {
            lResult = aCompetence;
            return false;
          }
        });
      }
    }
  }
  return lResult;
}
function _getInstanceListeSelonOnglet() {
  let lInstanceListe;
  if (GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.LivretScolaire_Fiche) {
    lInstanceListe = this.getInstance(this.IdentPage);
  } else if (
    GEtatUtilisateur.getGenreOnglet() ===
    EGenreOnglet.LivretScolaire_Competences
  ) {
    lInstanceListe = this.getInstance(this.IdentCompetences);
  } else {
    lInstanceListe = this.getInstance(this.IdentAppreciations);
  }
  return lInstanceListe;
}
function _evntSurAssistant() {
  const lInstanceListe = _getInstanceListeSelonOnglet.call(this);
  if (GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.LivretScolaire_Fiche) {
    this.moteurAssSaisie.evntBtnAssistant({
      instanceListe: lInstanceListe,
      instancePied: this.getInstance(this.IdentPied),
    });
  } else if (
    GEtatUtilisateur.getGenreOnglet() ===
    EGenreOnglet.LivretScolaire_Appreciations
  ) {
    this.moteurAssSaisie.evntBtnAssistant({
      instanceListe: lInstanceListe,
      instancePied: null,
    });
  }
}
function _evntSurFenetreAssistantSaisie(aNumeroBouton) {
  const lThis = this;
  const lParam = {
    instanceFenetreAssistantSaisie: this.getInstance(
      this.identFenetreAssistantSaisie,
    ),
    eventChangementUtiliserAssSaisie: function () {
      const lInstanceListe = _getInstanceListeSelonOnglet.call(lThis);
      lInstanceListe.actualiser(true);
    },
    evntClbck: surEvntAssSaisie.bind(this),
    evntFinallyClbck: _surEvntFinallyAssSaisie.bind(this),
  };
  this.moteurAssSaisie.evenementAssistantSaisie(aNumeroBouton, lParam);
}
function _surEvntFinallyAssSaisie(aParam) {
  const lInstanceListe = _getInstanceListeSelonOnglet.call(this);
  if (lInstanceListe !== null && lInstanceListe !== undefined) {
    switch (aParam.cmd) {
      case EBoutonFenetreAssistantSaisie.Valider: {
        lInstanceListe.actualiser(true);
        lInstanceListe.selectionnerCelluleSuivante({
          orientationVerticale: true,
          avecCelluleEditable: true,
          entrerEdition: true,
          avecSelection: false,
        });
      }
    }
  }
}
function surEvntAssSaisie(aParam) {
  const lInstanceListe = _getInstanceListeSelonOnglet.call(this);
  if (lInstanceListe !== null && lInstanceListe !== undefined) {
    let lClbck;
    switch (aParam.cmd) {
      case EBoutonFenetreAssistantSaisie.Valider: {
        lClbck = function () {
          this.traiterValidationAppreciationSelectionnee(aParam.eltSelectionne);
        }.bind(this);
        break;
      }
      case EBoutonFenetreAssistantSaisie.PasserEnSaisie: {
        lClbck = function () {
          const lIdColonneAppreciation =
            lInstanceListe._options.colonnesCachees.includes(
              DonneesListe_FicheLivretScolaire.colonnes.apprAnnuelle,
            )
              ? DonneesListe_FicheLivretScolaire.colonnes.appreciation
              : DonneesListe_FicheLivretScolaire.colonnes.apprAnnuelle;
          this.moteurAssSaisie.passerEnSaisie({
            instanceListe: lInstanceListe,
            idColonne: lIdColonneAppreciation,
            ligneCell: lInstanceListe.Donnees.celluleCourante.Genre - 1,
          });
        }.bind(this);
        break;
      }
      case EBoutonFenetreAssistantSaisie.Fermer:
        lClbck = null;
        break;
      default:
    }
    this.moteurAssSaisie.saisirModifAssSaisieAvantTraitement({
      estAssistantModifie: aParam.estAssistantModifie,
      pere: this,
      clbck: lClbck,
    });
  }
}
function _estSoumisADroitPourImprimer() {
  return (
    GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.LivretScolaire_Fiche &&
    [EGenreEspace.Professeur, EGenreEspace.Eleve].includes(
      GEtatUtilisateur.GenreEspace,
    )
  );
}
module.exports = InterfaceFicheLivretScolaire;
