exports._InterfaceBilanFinDeCycle = void 0;
const PageBilanFinDeCycle_1 = require("PageBilanFinDeCycle");
const GUID_1 = require("GUID");
const Invocateur_1 = require("Invocateur");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetFicheGraphe_1 = require("ObjetFicheGraphe");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ObjetWAI_1 = require("ObjetWAI");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const ObjetRequeteBilanFinDeCycle_1 = require("ObjetRequeteBilanFinDeCycle");
const TypeGenreAppreciation_1 = require("TypeGenreAppreciation");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const TypeEnseignementComplement_1 = require("TypeEnseignementComplement");
const TypePointsEnseignementComplement_1 = require("TypePointsEnseignementComplement");
const Enumere_Espace_1 = require("Enumere_Espace");
class _InterfaceBilanFinDeCycle extends InterfacePage_1.InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    const lApplicationSco = GApplication;
    this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
    this.parametresSco = lApplicationSco.getObjetParametres();
    this.idZoneAppreciation = GUID_1.GUID.getId();
    this.idAppreciation = GUID_1.GUID.getId();
    this.idLabelAppreciation = GUID_1.GUID.getId();
    this.idLabelComplement = GUID_1.GUID.getId();
    this.idLabelComplementConteneur = GUID_1.GUID.getId();
    this.idZoneEnseignementComplement = GUID_1.GUID.getId();
    this.donneesRecues = false;
    this.donnees = { EnseignementDeComplement: null };
    this.optionsAffichage = { uneJaugeParPeriode: true };
    this.estParentOuEleve = [
      Enumere_Espace_1.EGenreEspace.Parent,
      Enumere_Espace_1.EGenreEspace.Eleve,
    ].includes(GEtatUtilisateur.GenreEspace);
    this.avecMessage = false;
    this.avecGestionAccuseReception =
      GEtatUtilisateur.GenreEspace === Enumere_Espace_1.EGenreEspace.Parent;
  }
  construireInstances() {
    this.identFicheGraphe = this.add(ObjetFicheGraphe_1.ObjetFicheGraphe);
    this.identBilanFinDeCycle = this.add(
      PageBilanFinDeCycle_1.PageBilanFinDeCycle,
      this._evenementInterfaceBilanFinDeCycle,
    );
    this._construireInstancesSupplementaires();
  }
  _construireInstancesSupplementaires() {}
  setParametresGeneraux() {
    this.GenreStructure =
      Enumere_StructureAffichage_1.EStructureAffichage.Autre;
    this.IdentZoneAlClient = this.identBilanFinDeCycle;
    this.avecBandeau = true;
    this._addSurZone();
  }
  recupererDonnees() {
    ObjetHtml_1.GHtml.setDisplay(this.idZoneAppreciation, false);
  }
  lancerRequeteRecuperationDonnees() {
    const lListeEleves = this.getListeEleves();
    if (lListeEleves && lListeEleves.count() > 0) {
      new ObjetRequeteBilanFinDeCycle_1.ObjetRequeteBilanFinDeCycle(
        this,
        this._actionSurAfficherPage,
      ).lancerRequete({
        classe: this.getClasseConcernee(),
        periode: this.getPeriodeConcernee(),
        palier: this.getPalierConcerne(),
        listeEleves: lListeEleves,
      });
    }
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      estRecapNbSynthesesRempliesAffiche() {
        return aInstance.affichageDecompteDesResultats();
      },
      getLibelleRecapNbAppreciationsRemplies() {
        let lCleTraductionNbAppRemplies;
        const lNbAppRemplies = aInstance.nbAppreciationsRemplies || 0;
        const lPeriodeActive =
          aInstance.etatUtilisateurSco.Navigation.getRessource(
            Enumere_Ressource_1.EGenreRessource.Periode,
          );
        if (!!lPeriodeActive && lPeriodeActive.existeNumero()) {
          lCleTraductionNbAppRemplies =
            lNbAppRemplies > 1
              ? "competences.xAppreciationsRemplies"
              : "competences.xAppreciationRemplie";
        } else {
          lCleTraductionNbAppRemplies =
            lNbAppRemplies > 1
              ? "competences.xSynthesesRemplies"
              : "competences.xSyntheseRemplie";
        }
        return ObjetTraduction_1.GTraductions.getValeur(
          lCleTraductionNbAppRemplies,
          [lNbAppRemplies],
        );
      },
      avecBoutonTransfertAppreciations() {
        return !!aInstance.avecBtnTransfertAppreciations;
      },
      boutonTransfererAppreciations: {
        event() {
          if (aInstance.nbAppreciationsRemplies > 0) {
            GApplication.getMessage().afficher({
              type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
              message: ObjetTraduction_1.GTraductions.getValeur(
                "competences.ConfirmationRecopierAppreciations",
                [aInstance.nbAppreciationsRemplies],
              ),
              callback: function (aNumeroBouton) {
                aInstance.validerTransfertAppreciations(
                  aNumeroBouton === Enumere_Action_1.EGenreAction.Valider,
                );
              },
            });
          } else {
            aInstance.validerTransfertAppreciations(true);
          }
        },
      },
      estZoneAppreciationAffichee() {
        return !aInstance.affichageDecompteDesResultats();
      },
      getLibelleAppreciation() {
        let lLibelleApp = "";
        const lPeriodeActive =
          aInstance.etatUtilisateurSco.Navigation.getRessource(
            Enumere_Ressource_1.EGenreRessource.Periode,
          );
        if (
          !!lPeriodeActive &&
          lPeriodeActive.existeNumero() &&
          !aInstance.estParentOuEleve
        ) {
          lLibelleApp = ObjetTraduction_1.GTraductions.getValeur(
            "competences.AppreciationDeLEleve",
          );
        } else {
          lLibelleApp = ObjetTraduction_1.GTraductions.getValeur(
            "competences.Synthese",
          );
        }
        return lLibelleApp;
      },
      appreciation: {
        getValue() {
          return aInstance.appreciation ? aInstance.appreciation : "";
        },
        setValue(aValue) {
          if (aInstance.appreciation !== aValue) {
            aInstance.appreciation = aValue;
            aInstance.estAppreciationModifiee = true;
          }
        },
        getDisabled() {
          return (
            !!aInstance.appreciationNonEditable || aInstance.estParentOuEleve
          );
        },
        node() {
          $(this.node).on({
            focusout_TextareaMax: function () {
              if (aInstance.estAppreciationModifiee === true) {
                aInstance.valider();
              }
            },
          });
        },
      },
      estZoneEnseignementComplementAffichee() {
        return (
          !!aInstance.donnees.EnseignementDeComplement &&
          !aInstance.estParentOuEleve
        );
      },
      comboEnseignementComplement: {
        init(aInstanceCombo) {
          aInstanceCombo.setOptionsObjetSaisie({ longueur: 200 });
        },
        getDonnees(aDonnees) {
          if (!aDonnees) {
            return TypeEnseignementComplement_1.TypeEnseignementComplementUtil.toListe();
          }
        },
        getIndiceSelection(aInstanceCombo) {
          let lIndice = 0;
          if (aInstance.donnees.EnseignementDeComplement) {
            const lValeurEleve =
              aInstance.donnees.EnseignementDeComplement.valeurEleve;
            const lListe = aInstanceCombo.getListeElements();
            if (lListe) {
              lIndice = lListe.getIndiceElementParFiltre((D) => {
                return D.getGenre() === lValeurEleve;
              });
            }
          }
          return Math.max(lIndice, 0);
        },
        event(aParametres) {
          if (
            aParametres.genreEvenement ===
              Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
                .selection &&
            !!aParametres.estSelectionManuelle &&
            !!aParametres.element
          ) {
            if (!!aInstance.donnees.EnseignementDeComplement) {
              aInstance.donnees.EnseignementDeComplement.valeurEleve =
                aParametres.element.getGenre();
              aInstance.valider();
            }
          }
        },
        getDisabled() {
          return (
            !aInstance.donnees.EnseignementDeComplement ||
            !aInstance.donnees.EnseignementDeComplement.estEditable
          );
        },
      },
      comboEnseignementComplementPoint: {
        init(aInstanceCombo) {
          aInstanceCombo.setOptionsObjetSaisie({ longueur: 200 });
        },
        getDonnees(aDonnees) {
          if (!aDonnees) {
            return TypePointsEnseignementComplement_1.TypePointsEnseignementComplementUtil.toListe(
              true,
            );
          }
        },
        getIndiceSelection(aInstanceCombo) {
          let lIndice = 0;
          if (aInstance.donnees.EnseignementDeComplement) {
            const lValeurPoints =
              aInstance.donnees.EnseignementDeComplement.valeurPoints;
            const lListe = aInstanceCombo.getListeElements();
            if (lListe) {
              lIndice = lListe.getIndiceElementParFiltre((D) => {
                return D.getGenre() === lValeurPoints;
              });
            }
          }
          return Math.max(lIndice, 0);
        },
        event(aParametres) {
          if (
            aParametres.genreEvenement ===
              Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
                .selection &&
            !!aParametres.estSelectionManuelle &&
            !!aParametres.element
          ) {
            if (!!aInstance.donnees.EnseignementDeComplement) {
              aInstance.donnees.EnseignementDeComplement.valeurPoints =
                aParametres.element.getGenre();
              aInstance.valider();
            }
          }
        },
        getDisabled() {
          const lEnsComplement = aInstance.donnees.EnseignementDeComplement;
          const lAvecEnsComplement =
            !!lEnsComplement &&
            lEnsComplement.valeurEleve !==
              TypeEnseignementComplement_1.TypeEnseignementComplement.tecAucun;
          const lDisabled =
            this.controleur.comboEnseignementComplement.getDisabled.call(this);
          return lDisabled || !lAvecEnsComplement;
        },
      },
    });
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push(
      IE.jsx.str(
        IE.jsx.fragment,
        null,
        IE.jsx.str(
          "div",
          { class: "Espace" },
          IE.jsx.str("div", {
            id: this.getNomInstance(this.identBilanFinDeCycle),
          }),
          IE.jsx.str(
            "div",
            {
              class: "EspaceHaut10",
              "ie-if": "estRecapNbSynthesesRempliesAffiche",
            },
            IE.jsx.str("span", {
              class: "AlignementMilieuVertical Gras",
              "ie-html": "getLibelleRecapNbAppreciationsRemplies",
            }),
            IE.jsx.str(
              "span",
              {
                class: "AlignementMilieuVertical GrandEspaceGauche",
                "ie-if": "avecBoutonTransfertAppreciations",
              },
              IE.jsx.str(
                "ie-bouton",
                { "ie-model": "boutonTransfererAppreciations" },
                ObjetTraduction_1.GTraductions.getValeur(
                  "competences.RecopierAppreciations",
                ),
              ),
            ),
          ),
          IE.jsx.str(
            "div",
            {
              id: this.idZoneAppreciation,
              class: "EspaceHaut10",
              "ie-if": "estZoneAppreciationAffichee",
            },
            IE.jsx.str("div", {
              class: "Gras EspaceBas",
              id: this.idLabelAppreciation,
              "ie-html": "getLibelleAppreciation",
            }),
            IE.jsx.str(
              "div",
              null,
              IE.jsx.str(
                "ie-textareamax",
                Object.assign(
                  { "ie-model": "appreciation", id: this.idAppreciation },
                  ObjetWAI_1.GObjetWAI.getObjetAttributValeur(
                    ObjetWAI_1.EGenreAttribut.labelledby,
                    this.idLabelAppreciation,
                  ),
                  {
                    maxlength:
                      this.parametresSco.getTailleMaxAppreciationParEnumere(
                        TypeGenreAppreciation_1.TypeGenreAppreciation
                          .GA_BilanAnnuel_Generale,
                      ),
                    style: "width:100%; height:60px;",
                  },
                ),
              ),
            ),
          ),
          IE.jsx.str(
            "div",
            {
              id: this.idZoneEnseignementComplement,
              class: "EspaceHaut10",
              "ie-if": "estZoneEnseignementComplementAffichee",
            },
            IE.jsx.str(
              "div",
              { class: "Gras EspaceBas" },
              ObjetTraduction_1.GTraductions.getValeur(
                "competences.EnseignementDeComplement",
              ),
            ),
            IE.jsx.str(
              "div",
              null,
              IE.jsx.str("ie-combo", {
                "ie-model": "comboEnseignementComplement",
                class: "InlineBlock",
              }),
              IE.jsx.str("ie-combo", {
                "ie-model": "comboEnseignementComplementPoint",
                class: "InlineBlock MargeGauche",
              }),
            ),
          ),
          IE.jsx.str(
            "div",
            {
              id: this.idLabelComplementConteneur,
              class: "EspaceHaut10",
              style: "display:none;",
            },
            IE.jsx.str(
              "div",
              { class: "Gras EspaceBas" },
              ObjetTraduction_1.GTraductions.getValeur(
                "competences.EnseignementDeComplement",
              ),
            ),
            IE.jsx.str("div", { id: this.idLabelComplement }, "\u00A0"),
          ),
        ),
      ),
    );
    return H.join("");
  }
  _actionSurAfficherPage(aParametres) {
    Invocateur_1.Invocateur.evenement(
      Invocateur_1.ObjetInvocateur.events.activationImpression,
      Enumere_GenreImpression_1.EGenreImpression.Aucune,
    );
    if (aParametres.message) {
      this.evenementAfficherMessage(aParametres.message);
      this.avecMessage = true;
    } else {
      this.donneesRecues = true;
      const lListeElevesDeClasse = aParametres.listeElevesDeClasse;
      const lListePiliers = aParametres.listePiliers;
      const lAvecValidationAuto = !!aParametres.avecValidationAuto;
      this.appreciation = aParametres.appreciation;
      this.nbAppreciationsRemplies = aParametres.nbAppreciationsRemplies;
      this.avecBtnTransfertAppreciations =
        aParametres.avecBtnTransfertAppreciations;
      this.appreciationNonEditable = !!aParametres.appreciationNonEditable;
      this.estAppreciationModifiee = false;
      this.listeAccusesReception = aParametres.listeAccusesReception;
      ObjetHtml_1.GHtml.setDisplay(this.idZoneAppreciation, true);
      this.donnees.EnseignementDeComplement = null;
      if (!!aParametres.avecAffichageEnsComplements) {
        this.donnees.EnseignementDeComplement = {
          estEditable: !!aParametres.enseignementComplementEstEditable,
          valeurEleve: aParametres.enseignementComplementEleve,
          valeurPoints: aParametres.pointEnseignementComplementEleve,
        };
      }
      let lInfosColonneNbPointsExamen = null;
      if (aParametres.avecColonneNbPointsExamen) {
        lInfosColonneNbPointsExamen = {
          titre: aParametres.titreColonneNbPointsExamen,
          hint: aParametres.hintColonneNbPointsExamen,
        };
      }
      lListePiliers.setTri([
        ObjetTri_1.ObjetTri.init("ordrePalier"),
        ObjetTri_1.ObjetTri.init("ordrePilier"),
      ]);
      lListePiliers.trier();
      this.getInstance(this.identBilanFinDeCycle).setDonnees({
        pourDecompte: this.affichageDecompteDesResultats(),
        avecValidationAuto: lAvecValidationAuto,
        listePiliers: lListePiliers,
        listeElevesDeClasse: lListeElevesDeClasse,
        infoColonneNbPointsExamen: lInfosColonneNbPointsExamen,
      });
      ObjetHtml_1.GHtml.setValue(this.idAppreciation, this.appreciation);
      this.setGraphe(null);
      if (!!aParametres.grapheCalculAuto && !!aParametres.grapheSaisie) {
        this.setGraphe({
          image: [aParametres.grapheCalculAuto, aParametres.grapheSaisie],
          titre: ObjetTraduction_1.GTraductions.getValeur(
            "competences.graphe.TitreFenetre",
          ),
          message: ObjetTraduction_1.GTraductions.getValeur(
            "competences.graphe.GrapheNonDisponible",
          ),
          titreChoixGraphe: ObjetTraduction_1.GTraductions.getValeur(
            "competences.graphe.TitreChoixGraphes",
          ),
          libelleChoixGraphe: [
            ObjetTraduction_1.GTraductions.getValeur(
              "competences.graphe.CalculeAutomatiquement",
            ),
            ObjetTraduction_1.GTraductions.getValeur(
              "competences.graphe.SaisieParEnseignant",
            ),
          ],
        });
        this.actualiserFicheGraphe();
      } else {
        this.getInstance(this.identFicheGraphe).fermer();
      }
      const lDetails = [];
      const lListe =
        TypeEnseignementComplement_1.TypeEnseignementComplementUtil.toListe();
      const lListePlus =
        TypePointsEnseignementComplement_1.TypePointsEnseignementComplementUtil.toListe();
      const lIndice = lListe.getIndiceElementParFiltre((D) => {
        return D.getGenre() === aParametres.enseignementComplementEleve;
      });
      const lIndicePlus = lListePlus.getIndiceElementParFiltre((D) => {
        return D.getGenre() === aParametres.pointEnseignementComplementEleve;
      });
      if (!!lListe.get(lIndice) && lListe.get(lIndice).getLibelle() !== "") {
        lDetails.push(lListe.get(lIndice).getLibelle());
      }
      if (
        !!lListePlus.get(lIndicePlus) &&
        lListePlus.get(lIndicePlus).getLibelle() !== ""
      ) {
        lDetails.push(lListePlus.get(lIndicePlus).getLibelle());
      }
      ObjetHtml_1.GHtml.setDisplay(
        this.idLabelComplementConteneur,
        !!this.donnees.EnseignementDeComplement && this.estParentOuEleve,
      );
      ObjetHtml_1.GHtml.setHtml(this.idLabelComplement, lDetails.join(", "));
      const lListeEleves = this.getListeEleves();
      const lAvecPDF =
        this.estParentOuEleve ||
        (lListeEleves.count() === 1 &&
          lListeEleves.getGenre(0) ===
            Enumere_Ressource_1.EGenreRessource.Eleve);
      const lGenreGenerationImpression = lAvecPDF
        ? Enumere_GenreImpression_1.EGenreImpression.GenerationPDF
        : Enumere_GenreImpression_1.EGenreImpression.Aucune;
      Invocateur_1.Invocateur.evenement(
        Invocateur_1.ObjetInvocateur.events.activationImpression,
        lGenreGenerationImpression,
        this,
        this._getParametresPDF.bind(this, lListeEleves),
      );
    }
  }
  _getParametresPDF(aListeEleves) {
    if (aListeEleves) {
      aListeEleves.setSerialisateurJSON({ ignorerEtatsElements: true });
    }
    const lParametresPDF = {
      genreGenerationPDF:
        TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.BilanFinDeCycle,
      classe: this.getClasseConcernee(),
      periode: this.getPeriodeConcernee(),
      palier: this.getPalierConcerne(),
      listeEleves: aListeEleves,
      jaugeChronologique: this.getInstance(
        this.identBilanFinDeCycle,
      ).estJaugeChronologique(),
      uneJaugeParPeriode: this.getInstance(
        this.identBilanFinDeCycle,
      ).estUneJaugeParPeriode(),
      avecCodeCompetences: GEtatUtilisateur.estAvecCodeCompetences(),
    };
    return lParametresPDF;
  }
  _evenementInterfaceBilanFinDeCycle() {
    this.recupererDonnees();
  }
  valider() {}
  validerTransfertAppreciations(aEcraserAppreciations) {}
  evenementAfficherMessage(aGenreMessage) {
    ObjetHtml_1.GHtml.setDisplay(this.idZoneAppreciation, false);
    super.evenementAfficherMessage(aGenreMessage);
  }
  affichageDecompteDesResultats() {
    const lPalierConcerne = this.getPalierConcerne();
    const lClasseConcernee = this.getClasseConcernee();
    const lListeEleves = this.getListeEleves();
    return (
      this.donneesRecues &&
      !!lPalierConcerne &&
      lClasseConcernee &&
      lClasseConcernee.getGenre() ===
        Enumere_Ressource_1.EGenreRessource.Classe &&
      !!lListeEleves &&
      (lListeEleves.count() !== 1 ||
        lListeEleves.getGenre(0) !== Enumere_Ressource_1.EGenreRessource.Eleve)
    );
  }
}
exports._InterfaceBilanFinDeCycle = _InterfaceBilanFinDeCycle;
