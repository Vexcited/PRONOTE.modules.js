exports.InterfaceRemplacementsEnseignants = void 0;
const ObjetInterfacePageCP_1 = require("ObjetInterfacePageCP");
const TypeAffichageRemplacements_1 = require("TypeAffichageRemplacements");
const ObjetListe_1 = require("ObjetListe");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const DonneesListe_RemplacementsEnseignants_1 = require("DonneesListe_RemplacementsEnseignants");
const MoteurRemplacementsEnseignants_1 = require("MoteurRemplacementsEnseignants");
const Toast_1 = require("Toast");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListeElements_1 = require("ObjetListeElements");
const Type3Etats_1 = require("Type3Etats");
const ObjetDate_1 = require("ObjetDate");
class InterfaceRemplacementsEnseignants extends ObjetInterfacePageCP_1.InterfacePageCP {
  constructor(...aParams) {
    super(...aParams);
    this.applicationSco = GApplication;
    this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
    this.setOptionsEcrans({ nbNiveaux: 2, avecBascule: IE.estMobile });
    this.contexte = $.extend(this.contexte, {
      ecran: [
        MoteurRemplacementsEnseignants_1.RemplacementsEnseignants.genreEcran
          .selecteur,
        MoteurRemplacementsEnseignants_1.RemplacementsEnseignants.genreEcran
          .liste,
      ],
    });
    this.moteur =
      new MoteurRemplacementsEnseignants_1.MoteurRemplacementsEnseignants(
        TypeAffichageRemplacements_1.TypeAffichageRemplacements.tarPropositions,
      );
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnRetourEcranPrec: {
        event: () => {
          this._evntRetourEcranPrec();
        },
      },
    });
  }
  setParametresGeneraux() {
    this.GenreStructure =
      Enumere_StructureAffichage_1.EStructureAffichage.Autre;
    this.avecBandeau = true;
  }
  construireInstances() {
    this.identListeTypeAffichage = this.add(
      ObjetListe_1.ObjetListe,
      (aParametres) => {
        switch (aParametres.genreEvenement) {
          case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
            this.moteur.setAffichageCourant(aParametres.article.getGenre());
            if (this.moteur.avecActualiserDonnees()) {
              this.moteur.requeteDonnees().then((aJSON) => {
                this.donnees = aJSON;
                this.basculerEcran(
                  { niveauEcran: 0, dataEcran: aParametres.article },
                  {
                    niveauEcran: 1,
                    genreEcran: this.getCtxEcran({ niveauEcran: 1 }),
                  },
                );
              });
            } else {
              this.moteur.actualiserDonneesSelonFiltre(this.donnees);
              this.basculerEcran(
                { niveauEcran: 0, dataEcran: aParametres.article },
                {
                  niveauEcran: 1,
                  genreEcran: this.getCtxEcran({ niveauEcran: 1 }),
                },
              );
            }
            break;
        }
      },
      (aListe) => {
        aListe.setOptionsListe({
          skin: ObjetListe_1.ObjetListe.skin.flatDesign,
          nonEditableSurModeExclusif: true,
          avecOmbreDroite: true,
          avecLigneCreation: false,
        });
      },
    );
    this.identListeRemplacements = this.add(
      ObjetListe_1.ObjetListe,
      (aParametres) => {
        switch (aParametres.genreEvenement) {
          case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
            break;
        }
      },
      (aListe) => {
        aListe.setOptionsListe({
          skin: ObjetListe_1.ObjetListe.skin.flatDesign,
          nonEditableSurModeExclusif: true,
          avecOmbreDroite: true,
          avecLigneCreation: false,
          boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.filtrer }],
        });
      },
    );
  }
  async construireEcran(aParams) {
    switch (aParams.genreEcran) {
      case MoteurRemplacementsEnseignants_1.RemplacementsEnseignants.genreEcran
        .selecteur:
        if (this.optionsEcrans.avecBascule) {
          let lHtmlBandeau = "";
          this.setHtmlStructureAffichageBandeau(lHtmlBandeau);
          this.getInstance(this.identListeTypeAffichage).selectionnerLigne({
            deselectionnerTout: true,
          });
        }
        break;
      case MoteurRemplacementsEnseignants_1.RemplacementsEnseignants.genreEcran
        .liste: {
        if (this.optionsEcrans.avecBascule) {
          let lHtmlBandeau = this.construireBandeauEcran(
            `<div class="titretypeAffRemplacements">${TypeAffichageRemplacements_1.TypeAffichageRemplacementsUtil.getLibelle(this.moteur.affichageCourant.filtre.type)}</div>`,
            { bgWhite: true },
          );
          this.setHtmlStructureAffichageBandeau(lHtmlBandeau);
        }
        this.moteur.actualiserDonneesSelonFiltre(this.donnees);
        this.actualiserAffichage();
        break;
      }
    }
  }
  _evntRetourEcranPrec() {
    switch (this.getCtxEcran({ niveauEcran: this.contexte.niveauCourant })) {
      case MoteurRemplacementsEnseignants_1.RemplacementsEnseignants.genreEcran
        .liste:
        this.revenirSurEcranPrecedent();
        break;
    }
  }
  construireStructureAffichageAutre() {
    return IE.jsx.str(
      IE.jsx.fragment,
      null,
      IE.jsx.str(
        "div",
        { class: "InterfaceRemplacementsEnseignants" },
        IE.jsx.str(
          "section",
          {
            id: this.getIdDeNiveau({ niveauEcran: 0 }),
            class: ["liste", "typeAffichage"],
          },
          IE.jsx.str("div", {
            id: this.getInstance(this.identListeTypeAffichage).getNom(),
            class: ["full-height"],
          }),
        ),
        IE.jsx.str(
          "aside",
          {
            id: this.getIdDeNiveau({ niveauEcran: 1 }),
            class: ["liste", "remplacements"],
            tabindex: "0",
          },
          IE.jsx.str("div", {
            id: this.getInstance(this.identListeRemplacements).getNom(),
            class: ["full-height"],
          }),
        ),
      ),
    );
  }
  recupererDonnees() {
    this.contexteNavigation =
      this.etatUtilisateurSco.getContexteRemplacementsEnseignant();
    if (this.contexteNavigation) {
      this.moteur.setAffichageCourant(this.contexteNavigation.genreAffichage);
      if (
        this.contexteNavigation.debut &&
        (![
          TypeAffichageRemplacements_1.TypeAffichageRemplacements
            .tarPropositions,
          TypeAffichageRemplacements_1.TypeAffichageRemplacements.tarVolontaire,
          TypeAffichageRemplacements_1.TypeAffichageRemplacements
            .tarMesRemplacementsAVenir,
        ].includes(this.contexteNavigation.genreAffichage) ||
          !ObjetDate_1.GDate.estAvantJourCourant(this.contexteNavigation.debut))
      ) {
        this.moteur.setDateFiltreCourant(this.contexteNavigation.debut, true);
      }
      if (this.contexteNavigation.fin) {
        this.moteur.setDateFiltreCourant(this.contexteNavigation.fin, false);
      }
      this.etatUtilisateurSco.setContexteRemplacementsEnseignant(undefined);
    }
    this.getInstance(this.identListeTypeAffichage).setDonnees(
      new DonneesListe_RemplacementsEnseignants_1.DonneesListe_TypeAffRemplacements(
        this.moteur.getListeRubriques(),
      ),
    );
    this.moteur.requeteDonnees().then((aJSON) => {
      this.setDonnees(aJSON);
    });
  }
  evenementDonnees(aGenreAction, aParams) {
    switch (aGenreAction) {
      case MoteurRemplacementsEnseignants_1.RemplacementsEnseignants.action
        .filtre:
        if (this.moteur.avecActualiserDonnees()) {
          this.moteur.requeteDonnees().then((aJSON) => {
            this.donnees = aJSON;
            this.actualiserAffichage();
          });
        } else {
          this.moteur.actualiserDonneesSelonFiltre(this.donnees);
          this.actualiserAffichage();
        }
        break;
      case MoteurRemplacementsEnseignants_1.RemplacementsEnseignants.action
        .saisie:
        this.moteur.requeteSaisieRemplacements(aParams).then((aJSON) => {
          if (
            aJSON.JSONRapportSaisie &&
            !aJSON.JSONRapportSaisie._erreurSaisie_
          ) {
            if (
              this.moteur.affichageCourant.getGenre() ===
                TypeAffichageRemplacements_1.TypeAffichageRemplacements
                  .tarPropositions ||
              aParams.genreReponse !== Type3Etats_1.Type3Etats.TE_Inconnu
            ) {
              Toast_1.Toast.afficher({
                msg: ObjetTraduction_1.GTraductions.getValeur(
                  "RemplacementsEnseignants.choixEnregistre",
                ),
                type: Toast_1.ETypeToast.succes,
                dureeAffichage: 3000,
              });
            }
          }
        });
        break;
      default:
        break;
    }
  }
  setDonnees(aDonnees) {
    this.donnees = aDonnees;
    if (this.optionsEcrans.avecBascule) {
      if (this.contexteNavigation) {
        this.moteur.setAffichageCourant(
          TypeAffichageRemplacements_1.TypeAffichageRemplacements
            .tarPropositions,
        );
        const lListeSelection = new ObjetListeElements_1.ObjetListeElements();
        lListeSelection.addElement(this.moteur.affichageCourant);
        this.getInstance(
          this.identListeTypeAffichage,
        ).setListeElementsSelection(lListeSelection, { avecEvenement: true });
        this.contexteNavigation = undefined;
      } else {
        this.basculerEcran(null, {
          niveauEcran: 0,
          genreEcran: this.getCtxEcran({ niveauEcran: 0 }),
        });
      }
    } else {
      const lListeSelection = new ObjetListeElements_1.ObjetListeElements();
      lListeSelection.addElement(this.moteur.affichageCourant);
      this.getInstance(this.identListeTypeAffichage).setListeElementsSelection(
        lListeSelection,
      );
      this.actualiserAffichage();
    }
  }
  actualiserAffichage() {
    const lInstance = this.getInstance(this.identListeRemplacements);
    const lOptions = {
      messageContenuVide:
        TypeAffichageRemplacements_1.TypeAffichageRemplacementsUtil.getLibelleListeVide(
          this.moteur.affichageCourant.getGenre(),
        ),
    };
    lInstance.setOptionsListe(lOptions);
    lInstance.setDonnees(
      new DonneesListe_RemplacementsEnseignants_1.DonneesListe_RemplacementsEnseignants(
        this.donnees.listeFiltre,
        { moteur: this.moteur, evenement: this.evenementDonnees.bind(this) },
      ),
    );
  }
}
exports.InterfaceRemplacementsEnseignants = InterfaceRemplacementsEnseignants;
