const { TypeDroits } = require("ObjetDroitsPN.js");
const {
  ObjetRequeteConsultation,
  ObjetRequeteSaisie,
  EGenreReponseSaisie,
} = require("ObjetRequeteJSON.js");
const { TypeFusionTitreListe } = require("TypeFusionTitreListe.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GChaine } = require("ObjetChaine.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeNote } = require("TypeNote.js");
const DonneesListe_ElementsProgramme = require("DonneesListe_ElementsProgramme.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
  ObjetFenetre_SelectionClasseGroupe,
} = require("ObjetFenetre_SelectionClasseGroupe.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const {
  ObjetFenetre_OrdonnerElementsProgramme,
} = require("ObjetFenetre_OrdonnerElementsProgramme.js");
const { GUID } = require("GUID.js");
require("IEHtml.InputNote.js");
Requetes.inscrire("ListeElementsProgramme", ObjetRequeteConsultation);
Requetes.inscrire("SaisieElementsProgramme", ObjetRequeteSaisie);
class ObjetFenetre_ElementsProgramme extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      titre: GTraductions.getValeur("Fenetre_ElementsProgramme.Titre"),
      largeur: 700,
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Valider"),
      ],
      contextePrimaire: GEtatUtilisateur.pourPrimaire(),
    });
    this.TypeAffichage = { ParMatiere: 0, ParDomaine: 1, ParEltSaisisCDT: 2 };
    if (
      !GApplication.parametresUtilisateur.get(
        "CDT.ElementProgramme.TypeAffichage",
      )
    ) {
      GApplication.parametresUtilisateur.set(
        "CDT.ElementProgramme.TypeAffichage",
        this.TypeAffichage.ParMatiere,
      );
    }
    this.idLabelPalier = GUID.getId();
    this.idLabelMatiere = GUID.getId();
    this.donnees = {};
    this.parametresJSON = {};
  }
  estAffichageDuBulletin() {
    return !!this.donnees.service;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      estAfficherDansContexteBulletin: function () {
        return aInstance.estAffichageDuBulletin();
      },
      rbFiltreActif: {
        getValue: function (aValue) {
          return (
            GApplication.parametresUtilisateur.get(
              "CDT.ElementProgramme.TypeAffichage",
            ) === aValue
          );
        },
        setValue: function (aValue) {
          GApplication.parametresUtilisateur.set(
            "CDT.ElementProgramme.TypeAffichage",
            aValue,
          );
          _actualiserListe.call(aInstance, null, {
            avecListeMatieres: false,
            avecListeDomaines: false,
          });
        },
      },
      cbAfficherDuProfesseur: {
        getValue: function () {
          return GApplication.parametresUtilisateur.get(
            "CDT.ElementProgramme.AfficherEltDuProfesseur",
          );
        },
        setValue: function (aValue) {
          GApplication.parametresUtilisateur.set(
            "CDT.ElementProgramme.AfficherEltDuProfesseur",
            aValue,
          );
          _actualiserListe.call(aInstance, null, { avecListeDomaines: false });
        },
        getDisabled: function () {
          return !_estFiltreParMatiere.call(aInstance);
        },
      },
      cbAfficherBO: {
        getValue: function () {
          return GApplication.parametresUtilisateur.get(
            "CDT.ElementProgramme.AfficherBO",
          );
        },
        setValue: function (aValue) {
          GApplication.parametresUtilisateur.set(
            "CDT.ElementProgramme.AfficherBO",
            aValue,
          );
          _actualiserListe.call(aInstance, null, { avecListeDomaines: false });
        },
        getDisabled: function () {
          return !_estFiltreParMatiere.call(aInstance);
        },
      },
      cbAfficherPartages: {
        getValue: function () {
          return GApplication.parametresUtilisateur.get(
            "CDT.ElementProgramme.AfficherPartage",
          );
        },
        setValue: function (aValue) {
          GApplication.parametresUtilisateur.set(
            "CDT.ElementProgramme.AfficherPartage",
            aValue,
          );
          _actualiserListe.call(aInstance, null, { avecListeDomaines: false });
        },
        getDisabled: function () {
          return !_estFiltreParMatiere.call(aInstance);
        },
      },
      cbAfficherCompetences: {
        getValue: function () {
          return GApplication.parametresUtilisateur.get(
            "CDT.ElementProgramme.AfficherCompetences",
          );
        },
        setValue: function (aValue) {
          GApplication.parametresUtilisateur.set(
            "CDT.ElementProgramme.AfficherCompetences",
            aValue,
          );
          _actualiserListe.call(aInstance, null, { avecListeDomaines: false });
        },
        getDisabled: function () {
          return !_estFiltreParMatiere.call(aInstance);
        },
      },
      cbFiltreTravail: {
        getValue: function () {
          return GApplication.parametresUtilisateur.get(
            "CDT.ElementProgramme.FiltreEltsTravailles",
          );
        },
        setValue: function (aValue) {
          GApplication.parametresUtilisateur.set(
            "CDT.ElementProgramme.FiltreEltsTravailles",
            aValue,
          );
          _actualiserListe.call(aInstance, null, {
            avecListeMatieres: false,
            avecListeDomaines: false,
          });
        },
        getDisabled: function () {
          return !_estFiltreParElementsSaisisCDT.call(aInstance);
        },
      },
      inputNbTravail: {
        getNote: function () {
          return new TypeNote(
            GApplication.parametresUtilisateur.get(
              "CDT.ElementProgramme.NbFiltreEltsTravailles",
            ) || 0,
          );
        },
        setNote: function (aNote) {
          GApplication.parametresUtilisateur.set(
            "CDT.ElementProgramme.NbFiltreEltsTravailles",
            aNote.getValeur(),
          );
          if (_estFiltreParElementsSaisisCDT.call(aInstance)) {
            _actualiserListe.call(aInstance, null, {
              avecListeMatieres: false,
              avecListeDomaines: false,
            });
          }
        },
        getOptionsNote: function () {
          return {
            avecVirgule: false,
            sansNotePossible: false,
            avecAnnotation: false,
            min: 1,
            max: 50,
            hintSurErreur: true,
          };
        },
        getDisabled: function () {
          return !_estFiltreParElementsSaisisCDT.call(aInstance);
        },
      },
      getHtmlNbMax: function () {
        const lMaxDepasse =
          aInstance.donnees &&
          aInstance.donnees.listeElementsProgramme_saisie &&
          aInstance.parametresJSON &&
          aInstance.parametresJSON.nbMaxElements > 0 &&
          aInstance.donnees.listeElementsProgramme_saisie.count() >
            aInstance.parametresJSON.nbMaxElements;
        return !lMaxDepasse
          ? GTraductions.getValeur(
              "Fenetre_ElementsProgramme.LimitNBEltProgrammeTravailles",
            ) +
              " " +
              (aInstance.parametresJSON.nbMaxElements > 0
                ? aInstance.parametresJSON.nbMaxElements
                : GTraductions.getValeur("Fenetre_ElementsProgramme.Illimite"))
          : '<label class="Gras" style="color:red">' +
              GChaine.format(
                GTraductions.getValeur(
                  "Fenetre_ElementsProgramme.LimiteNBEltProgrammeTravaillesDepassee",
                ),
                [aInstance.parametresJSON.nbMaxElements],
              ) +
              "</label>";
      },
      btnAffectation: {
        event: function () {
          const lListe =
            aInstance.parametresJSON.listeServicesAffectation ||
            new ObjetListeElements();
          if (lListe.count() === 0) {
            return GApplication.getMessage().afficher({
              message: GTraductions.getValeur(
                "Fenetre_ElementsProgramme.AucuneClasseSimilaireTrouvee",
              ),
            });
          }
          ObjetFenetre.creerInstanceFenetre(
            ObjetFenetre_SelectionClasseGroupe,
            {
              pere: aInstance,
              evenement: function (
                aGenreRessource,
                aListeSelection,
                aNumeroBouton,
              ) {
                if (aNumeroBouton !== 1) {
                  return;
                }
                if (aListeSelection.count() === 0) {
                  return;
                }
                _getPromesseConfirmationSaisieAffectation
                  .call(this, aListeSelection)
                  .then(
                    function () {
                      return Requetes(
                        "SaisieElementsProgramme",
                        this,
                      ).lancerRequete({
                        estAffectation: true,
                        periode: this.donnees.periode,
                        service: this.donnees.service,
                        listeServices: aListeSelection.setSerialisateurJSON({
                          ignorerEtatsElements: true,
                        }),
                        listeElements: MethodesObjet.dupliquer(
                          this.donnees.listeElementsProgramme_saisie,
                        ).setSerialisateurJSON({ ignorerEtatsElements: true }),
                      });
                    }.bind(aInstance),
                    () => {},
                  )
                  .then(() => {
                    _actualiserListe.call(aInstance);
                  });
              },
            },
          ).setDonnees({
            listeRessources: lListe,
            listeRessourcesSelectionnees: new ObjetListeElements(),
            titre: GTraductions.getValeur(
              "Fenetre_ElementsProgramme.TitreSelectionElts",
            ),
          });
        },
      },
      btnOrdonnerElements: {
        event: function () {
          const lListeElements_Saisie =
            aInstance.donnees.listeElementsProgramme_saisie;
          ObjetFenetre.creerInstanceFenetre(
            ObjetFenetre_OrdonnerElementsProgramme,
            {
              pere: aInstance,
              initialiser: function (aInstance) {
                aInstance.initialiserFenetre();
              },
              evenement: function (aAvecSaisie) {
                if (aAvecSaisie) {
                  const lListe = this.getInstance(this.identListe);
                  lListe.getListeArticles().parcourir((D) => {
                    D.actif = !!lListeElements_Saisie.getElementParNumero(
                      D.getNumero(),
                    );
                  });
                  lListe.actualiser(false, false);
                }
              },
            },
          ).setDonneesFenetreOrdonnerElementProgramme({
            service: aInstance.donnees.service,
            periode: aInstance.donnees.periode,
            listeElementsProgramme: lListeElements_Saisie,
          });
        },
        getDisabled: function () {
          let lDisabled = true;
          if (
            aInstance.donnees &&
            aInstance.donnees.listeElementsProgramme_saisie &&
            aInstance.donnees.listeElementsProgramme_saisie.count() > 1
          ) {
            lDisabled = false;
          }
          return lDisabled;
        },
      },
      panelComptabiliserPourBulletin: {
        estVisible: function () {
          return false;
        },
        checkComptabiliserPourBulletin: {
          getValue: function () {
            const lNbServicesDispo = !!aInstance.donnees.listeServicesDuCours
              ? aInstance.donnees.listeServicesDuCours.count()
              : 0;
            return (
              lNbServicesDispo > 0 &&
              GApplication.parametresUtilisateur.get(
                "CDT.ElementProgramme.ComptabiliserPourBulletin",
              )
            );
          },
          setValue: function (aValue) {
            GApplication.parametresUtilisateur.set(
              "CDT.ElementProgramme.ComptabiliserPourBulletin",
              aValue,
            );
          },
          getDisabled: function () {
            const lNbServicesDispo = !!aInstance.donnees.listeServicesDuCours
              ? aInstance.donnees.listeServicesDuCours.count()
              : 0;
            return lNbServicesDispo === 0;
          },
        },
        avecComboChoixServices: function () {
          const lNbServicesDispo = !!aInstance.donnees.listeServicesDuCours
            ? aInstance.donnees.listeServicesDuCours.count()
            : 0;
          return lNbServicesDispo > 0;
        },
        sansComboChoixServices: function () {
          return !this.controleur.panelComptabiliserPourBulletin.avecComboChoixServices();
        },
        getMessageAucunService: function () {
          let lLibelleMatiereDuCours = "";
          let lLibelleClasseDuCours = "";
          if (
            !!aInstance.donnees.cours &&
            !!aInstance.donnees.cours.ListeContenus
          ) {
            aInstance.donnees.cours.ListeContenus.parcourir((aContenu) => {
              if (!!aContenu) {
                if (aContenu.getGenre() === EGenreRessource.Matiere) {
                  lLibelleMatiereDuCours = aContenu.getLibelle();
                }
                if (
                  aContenu.getGenre() === EGenreRessource.Classe ||
                  aContenu.getGenre() === EGenreRessource.Groupe
                ) {
                  lLibelleClasseDuCours = aContenu.getLibelle();
                }
              }
              if (
                lLibelleMatiereDuCours.length > 0 &&
                lLibelleClasseDuCours.length > 0
              ) {
                return true;
              }
            });
          }
          return GTraductions.getValeur(
            "Fenetre_ElementsProgramme.SaisieCDT.AucunServiceDisponible",
            [lLibelleClasseDuCours, lLibelleMatiereDuCours],
          );
        },
        comboChoixServicesPourBulletin: {
          init: function (aCombo) {
            aCombo.setOptionsObjetSaisie({ longueur: 400 });
          },
          getDonnees: function (aDonnees) {
            if (!aDonnees) {
              if (!!aInstance.donnees.listeServicesDuCours) {
                aInstance.donnees.listeServicesDuCours.parcourir((aService) => {
                  const lLibelleService = [aService.getLibelle()];
                  if (
                    !!aService.listeDernPeriodesNonCloturees &&
                    aService.listeDernPeriodesNonCloturees.count() > 0
                  ) {
                    const lPremierePeriode =
                      aService.listeDernPeriodesNonCloturees.getPremierElement();
                    if (!!lPremierePeriode) {
                      lLibelleService.push(" ", lPremierePeriode.getLibelle());
                    }
                  }
                  aService.setLibelle(lLibelleService.join(""));
                });
              }
              return aInstance.donnees.listeServicesDuCours;
            }
          },
          getIndiceSelection: function () {
            let lIndice = 0;
            if (
              !!aInstance.serviceDuCoursSelectionne &&
              !!aInstance.donnees.listeServicesDuCours &&
              aInstance.donnees.listeServicesDuCours.count() > 0
            ) {
              lIndice =
                aInstance.donnees.listeServicesDuCours.getIndiceParNumeroEtGenre(
                  aInstance.serviceDuCoursSelectionne.getNumero(),
                );
            }
            return Math.max(lIndice, 0);
          },
          event: function (aParametres) {
            if (
              aParametres.genreEvenement ===
                EGenreEvenementObjetSaisie.selection &&
              !!aParametres.element
            ) {
              aInstance.serviceDuCoursSelectionne = aParametres.element;
            }
          },
          getDisabled: function () {
            const lChoixCompatbiliserEstActif =
              this.controleur.panelComptabiliserPourBulletin.checkComptabiliserPourBulletin.getValue();
            return !lChoixCompatbiliserEstActif;
          },
        },
      },
      getHtmlParMatiere() {
        return aInstance.optionsFenetre.contextePrimaire ||
          !aInstance.estAffichageDuBulletin()
          ? [
              "<div>",
              '<label id="',
              aInstance.idLabelMatiere,
              '" class="AlignementMilieuVertical InlineBlock">',
              GTraductions.getValeur(
                "Fenetre_ElementsProgramme.Matiere.AfficherMatiere",
              ),
              "</label>",
              '<ie-combo ie-model="comboMatiere" class="AlignementMilieuVertical InlineBlock EspaceGauche"></ie-combo>',
              "</div>",
            ].join("")
          : [
              '<ie-radio ie-model="rbFiltreActif(',
              aInstance.TypeAffichage.ParMatiere,
              ')">',
              '<label id="',
              aInstance.idLabelMatiere,
              '" class="AlignementMilieuVertical">',
              GTraductions.getValeur(
                "Fenetre_ElementsProgramme.Matiere.AfficherMatiere",
              ),
              "</label>",
              "</ie-radio>",
              '<ie-combo ie-model="comboMatiere" class="AlignementMilieuVertical InlineBlock EspaceGauche"></ie-combo>',
            ].join("");
      },
      comboMatiere: {
        init(aCombo) {
          aCombo.setOptionsObjetSaisie({
            longueur: 320,
            getClassElement: function (aParams) {
              if (aParams && aParams.element && aParams.element.avecElt) {
                return "element-distinct";
              }
            },
            labelledById: aInstance.idLabelMatiere,
          });
        },
        getDonnees(aDonnees) {
          if (!aDonnees) {
            return aInstance.listeMatieres;
          }
        },
        getIndiceSelection() {
          let lIndice = 0;
          if (
            !!aInstance.listeMatieres &&
            !!aInstance.donnees &&
            aInstance.donnees.matiere
          ) {
            lIndice = aInstance.listeMatieres.getIndiceParElement(
              aInstance.donnees.matiere,
            );
          }
          return Math.max(lIndice, 0);
        },
        event(aParametres) {
          if (
            aParametres.genreEvenement === EGenreEvenementObjetSaisie.selection
          ) {
            aInstance.donnees.matiere = aParametres.element;
            if (aParametres.interactionUtilisateur) {
              _actualiserListe.call(aInstance, null, {
                avecListeMatieres: false,
                avecListeDomaines: false,
              });
            }
          }
        },
        getDisabled() {
          return !_estFiltreParMatiere.call(aInstance);
        },
      },
    });
  }
  construireInstances() {
    this.identComboPalier = this.add(
      ObjetSaisiePN,
      function (aParams) {
        if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
          this.donnees.palier = aParams.element;
          if (
            this.getInstance(
              this.identComboPalier,
            ).estUneInteractionUtilisateur()
          ) {
            _actualiserListe.call(this);
          }
        }
      },
      (aInstance) => {
        aInstance.setOptionsObjetSaisie({
          longueur: 120,
          labelledById: this.idLabelPalier,
        });
      },
    );
    this.identComboDomaine = this.add(
      ObjetSaisiePN,
      function (aParams) {
        if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
          this.donnees.domaine = aParams.element;
          if (
            this.getInstance(
              this.identComboDomaine,
            ).estUneInteractionUtilisateur()
          ) {
            _actualiserListe.call(this, null, {
              avecListeMatieres: false,
              avecListeDomaines: false,
            });
          }
        }
      },
      (aInstance) => {
        aInstance.setOptionsObjetSaisie({
          longueur: 320,
          getClassElement: function (aParams) {
            if (aParams && aParams.element && aParams.element.avecElt) {
              return "element-distinct";
            }
          },
        });
      },
    );
    this.identListe = this.add(
      ObjetListe,
      _evenementSurliste.bind(this),
      _initialiserliste.bind(this),
    );
    Invocateur.abonner(
      ObjetInvocateur.events.modeExclusif,
      _actualiserSurModeExclusif,
      this,
    );
  }
  setDonnees(aDonnees) {
    this.donnees = $.extend(
      {
        cours: null,
        numeroSemaine: null,
        service: null,
        periode: null,
        contenu: null,
        palier: new ObjetElement("", 0),
        matiere: null,
        domaine: null,
        listeElementsProgramme: new ObjetListeElements(),
        progression: null,
        ressource: null,
        cahierJournal: null,
        listeServicesDuCours: null,
      },
      aDonnees,
    );
    this.donnees.serviceDuCoursSelectionne = null;
    if (
      !this.estAffichageDuBulletin() &&
      _estFiltreParElementsSaisisCDT.call(this)
    ) {
      GApplication.parametresUtilisateur.set(
        "CDT.ElementProgramme.TypeAffichage",
        this.TypeAffichage.ParMatiere,
      );
    }
    let lPosition = 1;
    this.donnees.listeElementsProgramme.parcourir((D) => {
      D.Genre = EGenreRessource.ElementProgramme;
      D.Position = lPosition;
      lPosition++;
    });
    this.donnees.listeElementsProgramme_saisie = MethodesObjet.dupliquer(
      this.donnees.listeElementsProgramme,
    );
    this.afficher();
    _actualiserListe.call(this).then(() => {
      this.positionnerFenetre();
    });
  }
  composeContenu() {
    const T = [];
    T.push(
      "<div>",
      '<label id="',
      this.idLabelPalier,
      '">',
      GTraductions.getValeur("Fenetre_ElementsProgramme.ElementsCycle"),
      "</label>",
      '<div class="AlignementMilieuVertical InlineBlock EspaceGauche" id="' +
        this.getNomInstance(this.identComboPalier) +
        '"></div>',
      "</div>",
    );
    const lId = `${this.Nom}_sec_mat`;
    T.push(
      '<div class="EspaceHaut">',
      "<div>",
      `<div ie-html="getHtmlParMatiere" class="PetitEspaceBas" id="${lId}"></div>`,
      `<div class="GrandEspaceGauche" role="group" aria-labelledby=${lId}>`,
      '<div class="PetitEspaceBas">',
      '<ie-checkbox ie-model="cbAfficherDuProfesseur">',
      GTraductions.getValeur(
        "Fenetre_ElementsProgramme.Matiere.AfficherEltDuProfesseur",
      ),
      "</ie-checkbox>",
      "</div>",
      '<div class="PetitEspaceBas">',
      '<ie-checkbox ie-model="cbAfficherBO">',
      GTraductions.getValeur("Fenetre_ElementsProgramme.Matiere.AfficherLSU"),
      "</ie-checkbox>",
      "</div>",
      this.optionsFenetre.contextePrimaire
        ? ""
        : [
            '<div class="PetitEspaceBas">',
            '<ie-checkbox ie-model="cbAfficherPartages">',
            GTraductions.getValeur(
              "Fenetre_ElementsProgramme.Matiere.AfficherEltPartages",
            ),
            "</ie-checkbox>",
            "</div>",
          ].join(""),
      '<div class="PetitEspaceBas">',
      '<ie-checkbox ie-model="cbAfficherCompetences">',
      GTraductions.getValeur(
        "Fenetre_ElementsProgramme.Matiere.AfficherCompetences",
      ),
      "</ie-checkbox>",
      "</div>",
      "</div>",
      "</div>",
    );
    if (!this.optionsFenetre.contextePrimaire) {
      T.push(
        '<div ie-if="estAfficherDansContexteBulletin()">',
        '<div class="PetitEspaceBas">',
        '<ie-radio ie-model="rbFiltreActif(',
        this.TypeAffichage.ParEltSaisisCDT,
        ')">',
        GTraductions.getValeur(
          "Fenetre_ElementsProgramme.SaisieCDT.AfficherEltCDT",
        ),
        "</ie-radio>",
        "</div>",
        '<div class="NoWrap">',
        '<div class="GrandEspaceGauche InlineBlock">',
        '<ie-checkbox ie-model="cbFiltreTravail">',
        GTraductions.getValeur(
          "Fenetre_ElementsProgramme.SaisieCDT.AfficherLesEltsParOccurence1_2",
        ),
        '<ie-inputnote class="m-left m-right" ie-model="inputNbTravail" style="width:30px;"></ie-inputnote>',
        GTraductions.getValeur(
          "Fenetre_ElementsProgramme.SaisieCDT.AfficherLesEltsParOccurence2_2",
        ),
        "</ie-checkbox>",
        "</div>",
        "</div>",
        "</div>",
        "</div>",
      );
    }
    T.push(
      '<div id="' +
        this.getNomInstance(this.identListe) +
        '" class="EspaceHaut" style="width: 100%; min-height: 350px;"></div>',
    );
    T.push(
      '<div class="EspaceHaut" ie-if="estAfficherDansContexteBulletin()" ie-html="getHtmlNbMax"></div>',
    );
    T.push(
      '<div class="EspaceHaut" ie-if="panelComptabiliserPourBulletin.estVisible()">',
      '<div class="Gras">',
      GTraductions.getValeur(
        "Fenetre_ElementsProgramme.SaisieCDT.ReportSurBulletin",
      ),
      "</div>",
      '<div class="GrandEspaceGauche EspaceHaut">',
      '<div><ie-checkbox ie-model="panelComptabiliserPourBulletin.checkComptabiliserPourBulletin">',
      GTraductions.getValeur(
        "Fenetre_ElementsProgramme.SaisieCDT.ComptabiliserPourBulletin",
      ),
      "</ie-checkbox></div>",
      '<div ie-if="panelComptabiliserPourBulletin.avecComboChoixServices">',
      '<div class="EspaceHaut"><ie-combo ie-model="panelComptabiliserPourBulletin.comboChoixServicesPourBulletin"></ie-combo></div>',
      "<div>",
      GTraductions.getValeur(
        "Fenetre_ElementsProgramme.SaisieCDT.LimiteDuReport",
      ),
      "</div>",
      "</div>",
      '<div ie-if="panelComptabiliserPourBulletin.sansComboChoixServices" ie-html="panelComptabiliserPourBulletin.getMessageAucunService">',
      "</div>",
      "</div>",
      "</div>",
    );
    return T.join("");
  }
  composeBas() {
    const T = [];
    T.push(
      '<div class="flex-contain" ie-if="estAfficherDansContexteBulletin()">',
      GApplication.estPrimaire
        ? ""
        : `<ie-bouton ie-model="btnAffectation">${GTraductions.getValeur("Fenetre_ElementsProgramme.AffecterA")}</ie-bouton>`,
      '<ie-bouton ie-model="btnOrdonnerElements" class="MargeGauche">',
      GTraductions.getValeur("Fenetre_ElementsProgramme.OrdonnerElements"),
      "</ie-bouton>",
      "</div>",
    );
    return T.join("");
  }
  surValidation(aGenreBouton) {
    this.fermer();
    let lListe = this.donnees.listeElementsProgramme;
    if (aGenreBouton === 1) {
      lListe = this.donnees.listeElementsProgramme_saisie;
      lListe.avecSaisie = true;
      lListe.setSerialisateurJSON({ ignorerEtatsElements: true });
    }
    const lEstValider = aGenreBouton === 1;
    const lDonneesCallback = {
      listeElementsProgramme: lListe,
      palierActif: this.donnees.palier,
    };
    if (
      GApplication.parametresUtilisateur.get(
        "CDT.ElementProgramme.ComptabiliserPourBulletin",
      ) &&
      !!this.serviceDuCoursSelectionne
    ) {
      lDonneesCallback.servicePourComptabilisationBulletin =
        this.serviceDuCoursSelectionne;
    }
    this.callback.appel(lEstValider, lDonneesCallback);
  }
}
function _estFiltreParMatiere() {
  return (
    GApplication.parametresUtilisateur.get(
      "CDT.ElementProgramme.TypeAffichage",
    ) === this.TypeAffichage.ParMatiere
  );
}
function _estFiltreParDomaine() {
  return (
    GApplication.parametresUtilisateur.get(
      "CDT.ElementProgramme.TypeAffichage",
    ) === this.TypeAffichage.ParDomaine
  );
}
function _estFiltreParElementsSaisisCDT() {
  return (
    GApplication.parametresUtilisateur.get(
      "CDT.ElementProgramme.TypeAffichage",
    ) === this.TypeAffichage.ParEltSaisisCDT
  );
}
function _getPromesseConfirmationSaisieAffectation(aSelectionServices) {
  let lAvecElementsClasse = false;
  aSelectionServices.parcourir((D) => {
    if (D.avecElements) {
      lAvecElementsClasse = true;
      return false;
    }
  });
  return lAvecElementsClasse
    ? GApplication.getMessage()
        .afficher({
          type: EGenreBoiteMessage.Confirmation,
          message: GTraductions.getValeur(
            "Fenetre_ElementsProgramme.SuppressionEltsTravilles",
          ),
        })
        .then((aGenreAction) => {
          if (aGenreAction !== EGenreAction.Valider) {
            return Promise.reject();
          }
        })
    : Promise.resolve();
}
function _getListeAvecFils(aListe) {
  const lListe = new ObjetListeElements(),
    lListeTousElements = this.donnees.liste;
  aListe.parcourir((aElement) => {
    lListe.addElement(aElement);
    if (aElement.getGenre() !== EGenreRessource.ElementProgramme) {
      lListeTousElements.parcourir((aElementFils) => {
        if (
          aElementFils.pere &&
          aElementFils.pere.getNumero() === aElement.getNumero()
        ) {
          lListe.addElement(aElementFils);
        }
      });
    }
  });
  return lListe;
}
function _modifierLibelle(aListe, aElementSource) {
  const lTrouve = aListe.getElementParElement(aElementSource);
  if (lTrouve) {
    lTrouve.Libelle = aElementSource.getLibelle();
  }
}
function _gererSuppressionElement(aListe, aElementSource) {
  const lIndice = aListe.getIndiceParElement(aElementSource);
  if (lIndice >= 0 && MethodesObjet.isNumber(lIndice)) {
    aListe.remove(lIndice);
  }
}
function _saisie(aListe, aEstSuppression) {
  aListe.setSerialisateurJSON({
    methodeSerialisation: function (aElement, aJSON) {
      aJSON.pere = aElement.pere;
      if (aElement.actif) {
        aJSON.coche = true;
      }
      aJSON.partage = aElement.partage;
    },
  });
  Requetes("SaisieElementsProgramme", this)
    .lancerRequete({
      typeSaisie: GApplication.parametresUtilisateur.get(
        "CDT.ElementProgramme.TypeAffichage",
      ),
      matiere: this.donnees.matiere,
      palier: this.donnees.palier,
      service: this.donnees.service,
      liste: aListe,
    })
    .then(
      (aReponse) => {
        if (aReponse.genreReponse === EGenreReponseSaisie.succes) {
          if (aReponse.JSONRapportSaisie.liste) {
            aReponse.JSONRapportSaisie.liste.parcourir(function (aElement) {
              if (aElement.coche) {
                this.donnees.listeElementsProgramme_saisie.addElement(aElement);
              }
              _modifierLibelle(this.donnees.listeElementsProgramme, aElement);
              _modifierLibelle(
                this.donnees.listeElementsProgramme_saisie,
                aElement,
              );
            }, this);
          }
          if (aEstSuppression) {
            _getListeAvecFils.call(this, aListe).parcourir(function (aElement) {
              _gererSuppressionElement(
                this.donnees.listeElementsProgramme,
                aElement,
              );
              _gererSuppressionElement(
                this.donnees.listeElementsProgramme_saisie,
                aElement,
              );
            }, this);
          }
        }
        _actualiserListe.call(this, aReponse.JSONRapportSaisie.liste, null, {
          conserverPositionScroll: true,
        });
      },
      () => {
        _actualiserListe.call(this);
      },
    );
}
function _evenementSurliste(aParametres) {
  let lListe;
  switch (aParametres.genreEvenement) {
    case EGenreEvenementListe.SelectionClick:
      aParametres.instance.setCreationLigne(aParametres.ligne);
      break;
    case EGenreEvenementListe.ApresEdition:
      switch (aParametres.idColonne) {
        case DonneesListe_ElementsProgramme.genreColonne.coche: {
          if (
            aParametres.article.getGenre() !==
              EGenreRessource.ElementProgramme &&
            aParametres.article.getGenre() !== EGenreRessource.Competence
          ) {
            return;
          }
          if (
            aParametres.article.getGenre() === EGenreRessource.Competence &&
            aParametres.article.actif
          ) {
            _saisie.call(
              this,
              new ObjetListeElements().addElement(aParametres.article),
            );
            return;
          }
          const lIndice =
            this.donnees.listeElementsProgramme_saisie.getIndiceParNumeroEtGenre(
              aParametres.article.getNumero(),
            );
          if (aParametres.article.actif) {
            if (lIndice < 0 || !MethodesObjet.isNumber(lIndice)) {
              this.donnees.listeElementsProgramme_saisie.addElement(
                aParametres.article,
              );
            } else {
            }
          } else {
            if (lIndice >= 0 && MethodesObjet.isNumber(lIndice)) {
              this.donnees.listeElementsProgramme_saisie.remove(lIndice);
            }
          }
          break;
        }
        case DonneesListe_ElementsProgramme.genreColonne.libelle:
          if (
            aParametres.article.getLibelle() &&
            aParametres.article.getLibelle() !==
              aParametres.article.Libelle_bak &&
            aParametres.article.Libelle_bak !== undefined
          ) {
            _saisie.call(
              this,
              new ObjetListeElements().addElement(aParametres.article),
            );
          }
          break;
        case DonneesListe_ElementsProgramme.genreColonne.partage:
          _saisie.call(
            this,
            new ObjetListeElements().addElement(aParametres.article),
          );
          break;
        default:
      }
      break;
    case EGenreEvenementListe.ApresCreation:
      GApplication.parametresUtilisateur.set(
        "CDT.ElementProgramme.AfficherEltDuProfesseur",
        true,
      );
      lListe = new ObjetListeElements();
      this.donnees.liste.parcourir((D) => {
        if (D.getEtat() === EGenreEtat.Creation) {
          lListe.addElement(D);
        }
      });
      _saisie.call(this, lListe);
      break;
    case EGenreEvenementListe.Suppression:
      lListe = MethodesObjet.dupliquer(aParametres.listeSuppressions);
      lListe.parcourir((aElement) => {
        aElement.setEtat(EGenreEtat.Suppression);
      }, this);
      _saisie.call(this, lListe, true);
      break;
    case EGenreEvenementListe.Edition:
      switch (aParametres.idColonne) {
        case DonneesListe_ElementsProgramme.genreColonne.partage: {
          aParametres.article.partage = !aParametres.article.partage;
          aParametres.article.setEtat(EGenreEtat.Modification);
          const lListe = this.getInstance(this.identListe);
          lListe.actualiser(true);
          _saisie.call(
            this,
            new ObjetListeElements().addElement(aParametres.article),
          );
        }
      }
      break;
    default:
  }
}
function _initialiserliste(aInstance) {
  let lColonneLibelle = null;
  if (_estFiltreParMatiere.call(this) && !!this.donnees.matiere) {
    lColonneLibelle = this.donnees.matiere.getLibelle();
  } else if (_estFiltreParDomaine.call(this) && !!this.donnees.domaine) {
    lColonneLibelle = this.donnees.domaine.getLibelle();
  } else {
    lColonneLibelle = GTraductions.getValeur(
      "Fenetre_ElementsProgramme.Liste.TitreSaisisDsCDT",
    );
  }
  const lColonnes = [
    {
      id: DonneesListe_ElementsProgramme.genreColonne.coche,
      titre: "[Image_CocheVerte as-icon]",
      taille: 20,
    },
    {
      id: DonneesListe_ElementsProgramme.genreColonne.deploiement,
      titre: lColonneLibelle,
      taille: 7,
    },
    {
      id: DonneesListe_ElementsProgramme.genreColonne.libelle,
      titre: TypeFusionTitreListe.FusionGauche,
      taille: "100%",
    },
  ];
  if (this.donnees.service) {
    lColonnes.push({
      id: DonneesListe_ElementsProgramme.genreColonne.nombre,
      titre: {
        libelleHtml:
          '<div class="Image_CahierDeTexte" style="margin-left:auto; margin-right:auto;"></div>',
      },
      hint: GChaine.format(
        GTraductions.getValeur("Fenetre_ElementsProgramme.HintTitreOccurence"),
        [this.donnees.periode ? this.donnees.periode.getLibelle() : ""],
      ),
      taille: 30,
    });
  }
  lColonnes.push({
    id: DonneesListe_ElementsProgramme.genreColonne.proprietaire,
    titre: GTraductions.getValeur("Fenetre_ElementsProgramme.TitreSaisiPar"),
    hint: GTraductions.getValeur("Fenetre_ElementsProgramme.HintTitreSaisiPar"),
    taille: 140,
  });
  if (!this.optionsFenetre.contextePrimaire) {
    lColonnes.push({
      id: DonneesListe_ElementsProgramme.genreColonne.partage,
      titre: {
        libelleHtml:
          '<i class="icon_fiche_cours_partage" style="font-size: 1.4rem;"></i>',
      },
      hint: GTraductions.getValeur(
        "Fenetre_ElementsProgramme.HintTitrePartage",
      ),
      taille: 20,
    });
  }
  aInstance.setOptionsListe({
    colonnes: lColonnes,
    listeCreations: DonneesListe_ElementsProgramme.genreColonne.libelle,
    avecLigneCreation:
      _estFiltreParMatiere.call(this) &&
      !GApplication.droits.get(TypeDroits.estEnConsultation),
    titreCreation: GTraductions.getValeur(
      "Fenetre_ElementsProgramme.Liste.Creation",
    ),
    colonnesSansBordureDroit: [
      DonneesListe_ElementsProgramme.genreColonne.deploiement,
    ],
    AvecSuppression: !GApplication.droits.get(TypeDroits.estEnConsultation),
    boutons: [
      { genre: ObjetListe.typeBouton.deployer },
      { genre: ObjetListe.typeBouton.supprimer },
    ],
  });
}
function _actualiserListe(
  aListeSelection,
  aParamsAvecListes,
  aParamsObjetListe,
) {
  const lParamsAvecListes = {};
  lParamsAvecListes.avecListeMatieres =
    !aParamsAvecListes || aParamsAvecListes.avecListeMatieres !== false;
  lParamsAvecListes.avecListeDomaines =
    !aParamsAvecListes || aParamsAvecListes.avecListeDomaines !== false;
  const lAvecListeServicesDuCours =
    !this.estAffichageDuBulletin() && !this.donnees.listeServicesDuCours;
  const lParam = {
    cours: this.donnees.cours,
    numeroSemaine: this.donnees.numeroSemaine,
    service: this.donnees.service,
    periode: this.donnees.periode,
    progression: this.donnees.progression,
    cahierJournal: this.donnees.cahierJournal
      ? this.donnees.cahierJournal.toJSON()
      : null,
    ressource: this.donnees.ressource,
    contenu: this.donnees.contenu,
    palier: this.donnees.palier,
    matiere: _estFiltreParMatiere.call(this) ? this.donnees.matiere : null,
    domaine: _estFiltreParDomaine.call(this) ? this.donnees.domaine : null,
    avecListePaliers: !this.parametresJSON.listePaliers,
    avecListeMatiere: lParamsAvecListes.avecListeMatieres,
    avecListeDomaines: lParamsAvecListes.avecListeDomaines,
    avecListeServicesDuCours: lAvecListeServicesDuCours,
  };
  if (!!this.donnees.cahierJournal && !!this.donnees.cahierJournal.matiere) {
    lParam.cahierJournal.matiere = this.donnees.cahierJournal.matiere.toJSON();
  }
  return Requetes("ListeElementsProgramme", this)
    .lancerRequete(lParam)
    .then((aJSON) => {
      _actionSurListeElementsProgramme.call(
        this,
        aListeSelection,
        aJSON,
        aParamsObjetListe,
      );
    });
}
function _actualiserSurModeExclusif() {
  _actualiserListe.call(
    this,
    this.getInstance(this.identListe).getListeElementsSelection(),
  );
}
function _actionSurListeElementsProgramme(
  aListeSelection,
  aJSON,
  aParamsListe,
) {
  this.parametresJSON = $.extend(
    { nbMaxElements: 0 },
    this.parametresJSON,
    aJSON,
  );
  if (
    aJSON.palierParDefaut &&
    (!this.donnees.palier || this.donnees.palier.getNumero() === 0)
  ) {
    this.donnees.palier = aJSON.palierParDefaut;
  }
  if (aJSON.listePaliers) {
    this.getInstance(this.identComboPalier).setDonnees(
      this.parametresJSON.listePaliers,
      this.parametresJSON.listePaliers.getIndiceParElement(this.donnees.palier),
    );
  }
  if (aJSON.matiere && !this.donnees.matiere) {
    this.donnees.matiere = aJSON.matiere;
  }
  if (aJSON.domaine && !this.donnees.domaine) {
    this.donnees.domaine = aJSON.domaine;
  }
  if (aJSON.listeMatieres) {
    this.listeMatieres = aJSON.listeMatieres;
    this.listeMatieres.trier();
  }
  if (aJSON.listeDomaines) {
    this.getInstance(this.identComboDomaine).setDonnees(
      aJSON.listeDomaines,
      aJSON.listeDomaines.getIndiceParElement(this.donnees.domaine),
    );
  }
  if (aJSON.listeServicesDuCours) {
    this.donnees.listeServicesDuCours = aJSON.listeServicesDuCours;
  }
  this.getInstance(this.identComboDomaine).setActif(
    _estFiltreParDomaine.call(this),
  );
  _initialiserliste.call(this, this.getInstance(this.identListe));
  let lNbElementsActuelHorsListe = !!this.donnees.listeElementsProgramme_saisie
    ? this.donnees.listeElementsProgramme_saisie.count()
    : 0;
  const lAncienneListeProgramme = this.donnees.liste;
  this.donnees.liste = aJSON.listeElementsProgramme;
  let lPere = null;
  if (this.donnees.liste) {
    this.donnees.liste.parcourir(function (aElement) {
      if (
        aElement.getGenre() === EGenreRessource.ChapitreEltPgm ||
        aElement.getGenre() === EGenreRessource.ElementPilier
      ) {
        lPere = aElement;
        aElement.estUnDeploiement = true;
        const lAncienElement = lAncienneListeProgramme
          ? lAncienneListeProgramme.getElementParElement(aElement)
          : null;
        aElement.estDeploye = lAncienElement ? lAncienElement.estDeploye : true;
      } else {
        aElement.pere = lPere;
        aElement.estUnDeploiement = false;
        aElement.actif =
          !!this.donnees.listeElementsProgramme_saisie.getElementParNumero(
            aElement.getNumero(),
          );
        if (aElement.actif) {
          lNbElementsActuelHorsListe--;
        }
      }
    }, this);
  }
  const lDonneesListe = new DonneesListe_ElementsProgramme(this.donnees.liste, {
    periode: this.donnees.periode,
    nbElementsActuelHorsListe: lNbElementsActuelHorsListe,
    nbMaxElements: this.parametresJSON.nbMaxElements,
    avecCreationPossible:
      !GApplication.droits.get(TypeDroits.estEnConsultation) &&
      !_estFiltreParDomaine.call(this),
  });
  this.getInstance(this.identListe).setDonnees(
    lDonneesListe,
    null,
    aParamsListe,
  );
  if (aListeSelection) {
    this.getInstance(this.identListe).setListeElementsSelection(
      aListeSelection,
      { avecScroll: true },
    );
  }
}
module.exports = { ObjetFenetre_ElementsProgramme };
