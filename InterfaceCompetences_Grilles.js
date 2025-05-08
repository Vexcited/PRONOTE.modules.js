exports.InterfaceCompetences_Grilles = void 0;
const TypeFusionTitreListe_1 = require("TypeFusionTitreListe");
const MethodesObjet_1 = require("MethodesObjet");
const DonneesListe_Simple_1 = require("DonneesListe_Simple");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const DonneesListe_Competences_Grilles_1 = require("DonneesListe_Competences_Grilles");
const DonneesListe_Saisie_Competences_1 = require("DonneesListe_Saisie_Competences");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const ObjetFenetre_ParamGrilleCompetences_1 = require("ObjetFenetre_ParamGrilleCompetences");
const ObjetFenetre_SelectionClasseGroupe_1 = require("ObjetFenetre_SelectionClasseGroupe");
const ObjetRequeteCompetencesGrilles_1 = require("ObjetRequeteCompetencesGrilles");
const ObjetRequeteSaisieCompetencesGrilles_1 = require("ObjetRequeteSaisieCompetencesGrilles");
const TypeNiveauEquivalenceCE_1 = require("TypeNiveauEquivalenceCE");
const TypeReferentielGrilleCompetence_1 = require("TypeReferentielGrilleCompetence");
const TypeCategorieCompetence_1 = require("TypeCategorieCompetence");
const DonneesListe_ListeACocher_1 = require("DonneesListe_ListeACocher");
const ObjetFenetre_1 = require("ObjetFenetre");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
class InterfaceCompetences_Grilles extends InterfacePage_1.InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    const lApplicationSco = GApplication;
    this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
    this.elementsStockageCopierColler =
      this.etatUtilisateurSco.getInfosSupp("GrillesCompetences");
    this.cache = { referentielSelectionne: null };
    this.donnees = {
      avecCreation: false,
      avecCreationDomaine: false,
      avecCreationCompetence: false,
      estGrilleModifiable: false,
      avecSousItems: false,
      listeReferentiels: new ObjetListeElements_1.ObjetListeElements(),
      listeCompetences: new ObjetListeElements_1.ObjetListeElements(),
      listeTousLesReferentiels: new ObjetListeElements_1.ObjetListeElements(),
      listeTousLesDomaines: new ObjetListeElements_1.ObjetListeElements(),
      listeClassesPossibles: new ObjetListeElements_1.ObjetListeElements(),
      avecListeClassesCommuneEntreReferentiels: false,
    };
    this.optionsAffichage = {
      afficherNbEvaluationsConcernees: false,
      masquerElementsOfficiels: false,
      afficherSeulementElementsEvaluables: false,
    };
    if (this.etatUtilisateurSco.pourPrimaire()) {
      this.optionsAffichage.afficherSeulementElementsEvaluables = true;
    }
    this.etats = {
      listeElementsDeploiementDansLaListeCompetence:
        new ObjetListeElements_1.ObjetListeElements(),
    };
  }
  construireInstances() {
    this.pourCN =
      this.categorieCompetence ===
      TypeCategorieCompetence_1.TypeCategorieCompetence.CompetenceNumerique;
    this.pourApprentissage =
      this.etatUtilisateurSco.pourPrimaire() &&
      GEtatUtilisateur.getGenreOnglet() ===
        Enumere_Onglet_1.EGenreOnglet.ListeApprentissages;
    this.identTripleCombo = this.add(
      InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
      this.evenementSurDernierMenuDeroulant,
      this.initialiserTripleCombo,
    );
    this.identListeGrilles = this.add(
      ObjetListe_1.ObjetListe,
      this._evenementSurListeGrilles,
      null,
    );
    this.identListeCompetences = this.add(
      ObjetListe_1.ObjetListe,
      this._evenementSurListeCompetences,
      null,
    );
    this.identFenetreSelectNivEquivalence = this.addFenetre(
      ObjetFenetre_Liste_1.ObjetFenetre_Liste,
      this._evntFenetreNivEquivalence.bind(this),
      this._initFenetreNivEquivalence,
    );
    this.identFenetreSaisieClasses = this.addFenetre(
      ObjetFenetre_SelectionClasseGroupe_1.ObjetFenetre_SelectionClasseGroupe,
      this._evenementFenetreSaisieClasses.bind(this),
      this._initFenetreSaisieClasses,
    );
    this.identFenetreParamGrilleCompetences = this.addFenetre(
      ObjetFenetre_ParamGrilleCompetences_1.ObjetFenetre_ParamGrilleCompetences,
      this._evntFenetreParamGrilleCompetences,
      this._initFenetreParamGrilleCompetences,
    );
  }
  setParametresGeneraux() {
    this.GenreStructure =
      Enumere_StructureAffichage_1.EStructureAffichage.Autre;
    this.avecBandeau = true;
    this.IdentZoneAlClient = this.identListeGrilles;
    this.AddSurZone = [];
    this.AddSurZone.push(this.identTripleCombo);
    this.AddSurZone.push({ separateur: true });
    if (!this.etatUtilisateurSco.pourPrimaire() && !this.pourCN) {
      this.AddSurZone.push({
        html:
          '<ie-checkbox ie-model="cbAfficherSeulementElementsEvaluables" class="EspaceDroit">' +
          ObjetTraduction_1.GTraductions.getValeur(
            "competencesGrilles.Parametrage.AfficherSeulementEvaluables",
          ) +
          "</ie-checkbox>",
      });
    }
    if (!this.pourApprentissage) {
      this.AddSurZone.push({
        html:
          '<ie-checkbox ie-model="cbMasquerElementsOfficiels" ie-display="cbMasquerElementsOfficiels.estVisible" class="EspaceDroit">' +
          ObjetTraduction_1.GTraductions.getValeur(
            "competencesGrilles.Parametrage.MasquerElementsOfficiels",
          ) +
          "</ie-checkbox>",
      });
    }
    if (!this.pourCN && !this.pourApprentissage) {
      this.AddSurZone.push({
        html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnParametrer(
          "btnParametrage",
        ),
      });
    }
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnParametrage: {
        event: function () {
          const lFenetreParam = aInstance.getInstance(
            aInstance.identFenetreParamGrilleCompetences,
          );
          lFenetreParam.setDonnees(
            aInstance.getGenreReferentiel(),
            aInstance._getReferentielSelectionne(),
            {
              afficherNbEvaluations:
                aInstance.optionsAffichage.afficherNbEvaluationsConcernees,
            },
          );
          lFenetreParam.afficher();
        },
        getTitle() {
          return ObjetTraduction_1.GTraductions.getValeur(
            "competencesGrilles.FenetreParametrage.HintBouton",
          );
        },
        getSelection() {
          return aInstance
            .getInstance(aInstance.identFenetreParamGrilleCompetences)
            .estAffiche();
        },
        getDisabled: function () {
          const lReferentielSelectionne =
            aInstance._getReferentielSelectionne();
          return (
            !lReferentielSelectionne ||
            lReferentielSelectionne.estGrilleModifiable !== true
          );
        },
      },
      cbMasquerElementsOfficiels: {
        getValue: function () {
          return !!aInstance.optionsAffichage.masquerElementsOfficiels;
        },
        setValue: function (aValue) {
          aInstance.optionsAffichage.masquerElementsOfficiels = aValue;
          aInstance._actualiserPage(
            aInstance._getReferentielSelectionne(),
            aInstance._getElementCompetenceSelectionne(),
          );
        },
        getDisabled: function () {
          const lReferentielSelectionne =
            aInstance._getReferentielSelectionne();
          return (
            !lReferentielSelectionne ||
            lReferentielSelectionne.estGrilleModifiable !== true
          );
        },
        estVisible: function () {
          let lEstVisible = false;
          if (aInstance.etatUtilisateurSco.pourPrimaire()) {
            lEstVisible = !aInstance.pourCN;
          }
          return lEstVisible;
        },
      },
      cbAfficherSeulementElementsEvaluables: {
        getValue: function () {
          return !!aInstance.optionsAffichage
            .afficherSeulementElementsEvaluables;
        },
        setValue: function (aValue) {
          aInstance.optionsAffichage.afficherSeulementElementsEvaluables =
            aValue;
          aInstance._actualiserPage(
            aInstance._getReferentielSelectionne(),
            aInstance._getElementCompetenceSelectionne(),
          );
        },
        getDisabled: function () {
          const lReferentielSelectionne =
            aInstance._getReferentielSelectionne();
          return !lReferentielSelectionne;
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
          {
            id: this.idPage,
            class: "flex-contain full-size flex-gap-xl p-all-l",
          },
          IE.jsx.str("div", {
            class: "fix-bloc",
            id: this.getInstance(this.identListeGrilles).getNom(),
            style: "width: 40%;",
          }),
          IE.jsx.str("div", {
            class: "fluid-bloc",
            id: this.getInstance(this.identListeCompetences).getNom(),
          }),
        ),
      ),
    );
    return H.join("");
  }
  _getListeReferentielsPossibles() {
    const lListeReferentielsExistants = this.donnees.listeReferentiels;
    return this.donnees.listeTousLesReferentiels.getListeElements((D) => {
      return (
        lListeReferentielsExistants.getElementParNumero(D.getNumero()) ===
        undefined
      );
    });
  }
  _getReferentielSelectionne() {
    return this.cache.referentielSelectionne;
  }
  _getElementCompetenceSelectionne() {
    const lListeCompetenceSelection = this.getInstance(
      this.identListeCompetences,
    ).getListeElementsSelection();
    if (lListeCompetenceSelection.count() > 0) {
      return lListeCompetenceSelection.getPremierElement();
    }
    return null;
  }
  _surEditionDomainesAssocies(aElementCompetence) {}
  _surEditionElmtSignifiant(aElementCompetence) {}
  _actualiserPage(
    aReferentielSelectionne,
    aCompetenceSelectionnee,
    aMessageApresActualisation,
  ) {
    const lInstanceListeComp = this.getInstance(this.identListeCompetences);
    if (lInstanceListeComp && lInstanceListeComp.getListeArticles) {
      this._setEtatDeploiementDansLaListeCompetence(
        lInstanceListeComp.getListeArticles(),
      );
    }
    new ObjetRequeteCompetencesGrilles_1.ObjetRequeteCompetencesGrilles(
      this,
      this._surReponseActualiserPage.bind(
        this,
        aReferentielSelectionne,
        aCompetenceSelectionnee,
        aMessageApresActualisation,
      ),
    ).lancerRequete({
      genreReferentiel: this.getGenreReferentiel(),
      categorieCompetence: this.categorieCompetence,
      afficherSeulementEvaluables:
        this.optionsAffichage.afficherSeulementElementsEvaluables,
      masquerElementsOfficiels: this.optionsAffichage.masquerElementsOfficiels,
    });
  }
  _saisie(aCommande, aParametresSaisie, aParametresDeMiseAJourGraphique) {
    const lParametresSaisie = $.extend(
      { commande: aCommande, genreReferentiel: this.getGenreReferentiel() },
      aParametresSaisie,
    );
    const lParametresDeMiseAJourGraphique = $.extend(
      { referentielSelectionne: null, competenceSelectionnee: null },
      aParametresDeMiseAJourGraphique,
    );
    new ObjetRequeteSaisieCompetencesGrilles_1.ObjetRequeteSaisieCompetencesGrilles(
      this,
      function (aJSONRapportSaisie, aJSONReponse) {
        const lThis = this;
        if (
          aJSONReponse &&
          (aJSONReponse.messageConfirmation || aJSONReponse.messageInformation)
        ) {
          if (!!aJSONReponse.messageConfirmation) {
            GApplication.getMessage().afficher({
              type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
              message: aJSONReponse.messageConfirmation,
              callback: function (aGenreAction) {
                if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
                  const lParametresSaisieAvecConfirmation = $.extend(
                    { confirmation: true },
                    lParametresSaisie,
                  );
                  lThis._saisie(
                    aCommande,
                    lParametresSaisieAvecConfirmation,
                    aParametresDeMiseAJourGraphique,
                  );
                } else {
                  if (
                    aParametresDeMiseAJourGraphique &&
                    aParametresDeMiseAJourGraphique.callbackCancel
                  ) {
                    aParametresDeMiseAJourGraphique.callbackCancel();
                  }
                }
              },
            });
          } else {
            GApplication.getMessage().afficher({
              type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
              message: aJSONReponse.messageInformation,
              callback: function () {
                if (
                  aParametresDeMiseAJourGraphique &&
                  aParametresDeMiseAJourGraphique.callbackCancel
                ) {
                  aParametresDeMiseAJourGraphique.callbackCancel();
                }
              },
            });
          }
          return;
        } else {
          if (aJSONRapportSaisie && aJSONRapportSaisie.messageInformation) {
            lThis._actualiserPage(
              lParametresDeMiseAJourGraphique.referentielSelectionne,
              lParametresDeMiseAJourGraphique.competenceSelectionnee,
              aJSONRapportSaisie.messageInformation,
            );
          } else {
            lThis._actualiserPage(
              lParametresDeMiseAJourGraphique.referentielSelectionne,
              lParametresDeMiseAJourGraphique.competenceSelectionnee,
            );
          }
        }
      },
    ).lancerRequete(lParametresSaisie);
  }
  initialiserTripleCombo(aInstance) {
    aInstance.setParametres([Enumere_Ressource_1.EGenreRessource.Palier]);
  }
  evenementSurDernierMenuDeroulant() {
    this.getInstance(this.identListeGrilles).setActif(true);
    this.afficherBandeau(true);
    this._actualiserPage();
  }
  _initFenetreParamGrilleCompetences(aInstance) {
    aInstance.setOptionsFenetre({
      titre: ObjetTraduction_1.GTraductions.getValeur(
        "competencesGrilles.FenetreParametrage.Titre",
      ),
      largeur: 350,
      hauteur: 80,
      listeBoutons: [
        ObjetTraduction_1.GTraductions.getValeur("Annuler"),
        ObjetTraduction_1.GTraductions.getValeur("Valider"),
      ],
    });
  }
  _evntFenetreParamGrilleCompetences(aNumeroBouton, aParametresGrille) {
    const lReferentielSelectionne = this._getReferentielSelectionne();
    if (aNumeroBouton === 1 && !!lReferentielSelectionne) {
      let lAvecActualisationNecessaire = false;
      let lAvecSaisieNecessaire = false;
      if (
        lReferentielSelectionne.avecSousItems !== aParametresGrille.avecSousItem
      ) {
        lAvecSaisieNecessaire = true;
      } else if (
        this.getGenreReferentiel() ===
          TypeReferentielGrilleCompetence_1.TypeGenreReferentiel
            .GR_PilierDeCompetence &&
        (lReferentielSelectionne.avecCoeffElmtPilier !==
          aParametresGrille.avecCoeffElementPilier ||
          lReferentielSelectionne.avecCoeffCompetence !==
            aParametresGrille.avecCoeffCompetence ||
          lReferentielSelectionne.avecCoeffSousItem !==
            aParametresGrille.avecCoeffSousItem)
      ) {
        lAvecSaisieNecessaire = true;
      }
      if (
        this.optionsAffichage.afficherNbEvaluationsConcernees !==
        aParametresGrille.afficherNbEvaluations
      ) {
        this.optionsAffichage.afficherNbEvaluationsConcernees =
          aParametresGrille.afficherNbEvaluations;
        lAvecActualisationNecessaire = true;
      }
      if (lAvecSaisieNecessaire || lAvecActualisationNecessaire) {
        if (lAvecSaisieNecessaire) {
          this._saisie(
            ObjetRequeteSaisieCompetencesGrilles_1
              .CommandeSaisieCompetencesGrilles.saisieParametrageGrille,
            {
              referentiel: lReferentielSelectionne,
              avecSousItems: aParametresGrille.avecSousItem,
              avecCoeffElmtPilier: aParametresGrille.avecCoeffElementPilier,
              avecCoeffCompetence: aParametresGrille.avecCoeffCompetence,
              avecCoeffSousItem: aParametresGrille.avecCoeffSousItem,
            },
            { referentielSelectionne: lReferentielSelectionne },
          );
        } else {
          this._actualiserListeGrilles(
            lReferentielSelectionne,
            this._getElementCompetenceSelectionne(),
          );
        }
      }
    }
  }
  _getListeColonnesGrilles() {
    let lTitreLibelle;
    if (
      this.getGenreReferentiel() ===
      TypeReferentielGrilleCompetence_1.TypeGenreReferentiel
        .GR_PilierDeCompetence
    ) {
      lTitreLibelle = ObjetTraduction_1.GTraductions.getValeur(
        "competencesGrilles.GrilleCompetences.TitreLibelleDomaines",
      );
    } else {
      lTitreLibelle = ObjetTraduction_1.GTraductions.getValeur(
        "competencesGrilles.GrilleCompetences.TitreLibelleMatieres",
      );
    }
    const lColonnes = [];
    lColonnes.push({
      id: DonneesListe_Competences_Grilles_1.DonneesListe_Competences_Grilles
        .colonnes.libelle,
      taille: "55%",
      titre: lTitreLibelle,
    });
    if (!this.pourApprentissage) {
      lColonnes.push({
        id: DonneesListe_Competences_Grilles_1.DonneesListe_Competences_Grilles
          .colonnes.nbCompetences,
        taille: 40,
        titre: this.pourCN
          ? ObjetTraduction_1.GTraductions.getValeur(
              "competencesGrilles.GrilleCompetences.TitreNbCompetencesNumeriques",
            )
          : ObjetTraduction_1.GTraductions.getValeur(
              "competencesGrilles.GrilleCompetences.TitreNbCompetences",
            ),
        hint: this.pourCN
          ? ObjetTraduction_1.GTraductions.getValeur(
              "competencesGrilles.GrilleCompetences.HintNbCompetencesNumeriques",
            )
          : ObjetTraduction_1.GTraductions.getValeur(
              "competencesGrilles.GrilleCompetences.HintNbCompetences",
            ),
      });
      lColonnes.push({
        id: DonneesListe_Competences_Grilles_1.DonneesListe_Competences_Grilles
          .colonnes.nbItems,
        taille: 30,
        titre: ObjetTraduction_1.GTraductions.getValeur(
          "competencesGrilles.GrilleCompetences.TitreNbItems",
        ),
        hint: this.pourCN
          ? ObjetTraduction_1.GTraductions.getValeur(
              "competencesGrilles.GrilleCompetences.HintNbItemsCompetencesNumeriques",
            )
          : ObjetTraduction_1.GTraductions.getValeur(
              "competencesGrilles.GrilleCompetences.HintNbItems",
            ),
      });
    }
    lColonnes.push({
      id: DonneesListe_Competences_Grilles_1.DonneesListe_Competences_Grilles
        .colonnes.classes,
      taille: "30%",
      titre: ObjetTraduction_1.GTraductions.getValeur(
        "competencesGrilles.GrilleCompetences.TitreClasses",
      ),
    });
    if (!this.pourCN && !this.pourApprentissage) {
      lColonnes.push({
        id: DonneesListe_Competences_Grilles_1.DonneesListe_Competences_Grilles
          .colonnes.lve,
        taille: 30,
        titre: ObjetTraduction_1.GTraductions.getValeur(
          "competencesGrilles.GrilleCompetences.TitreLVE",
        ),
        hint: ObjetTraduction_1.GTraductions.getValeur(
          "competencesGrilles.GrilleCompetences.HintLVE",
        ),
      });
    }
    return lColonnes;
  }
  _evenementSurListeGrilles(aParametres) {
    switch (aParametres.genreEvenement) {
      case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
        const lObjetGrille = aParametres.article;
        this.cache.referentielSelectionne = lObjetGrille;
        this.donnees.avecCreationDomaine = lObjetGrille.avecCreationDomaine;
        this.donnees.avecCreationCompetence =
          lObjetGrille.avecCreationCompetence;
        this.donnees.estGrilleModifiable = lObjetGrille.estGrilleModifiable;
        this.donnees.avecSousItems = lObjetGrille.avecSousItems;
        this.donnees.listeCompetences =
          new ObjetListeElements_1.ObjetListeElements();
        if (lObjetGrille && lObjetGrille.listeCompetences) {
          const lTableauPeres = [];
          lObjetGrille.listeCompetences.parcourir((D) => {
            lTableauPeres[D.getGenre()] = D;
            D.pere =
              lTableauPeres[
                Enumere_Ressource_1.EGenreRessourceUtil.getGenrePereCompetence(
                  D.getGenre(),
                )
              ];
            if (!!D.pere) {
              D.pere.estUnDeploiement = true;
              D.pere.estDeploye = true;
            }
          });
          this.donnees.listeCompetences = lObjetGrille.listeCompetences;
        }
        if (this.donnees.listeCompetences) {
          this.donnees.listeCompetences.setTri([
            ObjetTri_1.ObjetTri.initRecursif("pere", [
              ObjetTri_1.ObjetTri.init("ordre"),
            ]),
          ]);
        }
        this._actualiserListeCompetences();
        break;
      }
      case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
        this._surCreationReferentiel();
        return Enumere_EvenementListe_1.EGenreEvenementListe.Creation;
      case Enumere_EvenementListe_1.EGenreEvenementListe.ApresCreation: {
        const lThis = this;
        this._saisie(
          ObjetRequeteSaisieCompetencesGrilles_1
            .CommandeSaisieCompetencesGrilles.saisieReferentiel,
          { referentiel: aParametres.article },
          {
            referentielSelectionne: aParametres.article,
            callbackCancel: function () {
              lThis._actualiserPage(aParametres.article);
            },
          },
        );
        break;
      }
      case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
        switch (aParametres.idColonne) {
          case DonneesListe_Competences_Grilles_1
            .DonneesListe_Competences_Grilles.colonnes.classes: {
            const lListeClassesSelectionnees =
              MethodesObjet_1.MethodesObjet.dupliquer(
                aParametres.article.listeClasses,
              );
            this.getInstance(this.identFenetreSaisieClasses).setDonnees({
              listeRessources: this.donnees.listeClassesPossibles,
              listeRessourcesSelectionnees: lListeClassesSelectionnees,
              titre: ObjetTraduction_1.GTraductions.getValeur(
                "fenetreSelectionClasseGroupe.titreClasses",
              ),
            });
            break;
          }
        }
        break;
      case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
        this._supprimerReferentiel(aParametres.article);
        break;
      case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
        switch (aParametres.idColonne) {
          case DonneesListe_Competences_Grilles_1
            .DonneesListe_Competences_Grilles.colonnes.libelle:
          case DonneesListe_Competences_Grilles_1
            .DonneesListe_Competences_Grilles.colonnes.lve: {
            const lThis = this;
            this._saisie(
              ObjetRequeteSaisieCompetencesGrilles_1
                .CommandeSaisieCompetencesGrilles.saisieReferentiel,
              { referentiel: aParametres.article },
              {
                referentielSelectionne: aParametres.article,
                callbackCancel: function () {
                  lThis._actualiserPage(aParametres.article);
                },
              },
            );
            break;
          }
        }
        break;
    }
  }
  _supprimerReferentiel(aReferentiel) {
    this._saisie(
      ObjetRequeteSaisieCompetencesGrilles_1.CommandeSaisieCompetencesGrilles
        .suppressionRelationReferentiel,
      { referentiel: aReferentiel },
    );
  }
  _evenementBoutonSupprimerGrille() {
    const lReferentielSelectionne = this._getReferentielSelectionne();
    this._supprimerReferentiel(lReferentielSelectionne);
  }
  _getDisabledBoutonSupprimerGrille(aParam) {
    const lListeSelection = aParam.liste.getListeElementsSelection();
    if (lListeSelection.count() !== 1) {
      return true;
    }
    return false;
  }
  _getListeColonnesCompetences(
    aGenreReferentiel,
    aReferentiel,
    aOptionsAffichage,
  ) {
    const lEstContextePrimaire = this.etatUtilisateurSco.pourPrimaire();
    const lPourApprentissage =
      this.etatUtilisateurSco.pourPrimaire() &&
      GEtatUtilisateur.getGenreOnglet() ===
        Enumere_Onglet_1.EGenreOnglet.ListeApprentissages;
    const lColonnes = [];
    lColonnes.push({
      id: DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
        .colonnes.plus_competence,
      taille: 10,
      titre: lPourApprentissage
        ? ObjetTraduction_1.GTraductions.getValeur(
            "competencesGrilles.ListeCompetences.TitreLibelleApprentissage",
          )
        : ObjetTraduction_1.GTraductions.getValeur(
            "competencesGrilles.ListeCompetences.TitreLibelle",
          ),
    });
    lColonnes.push({
      id: DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
        .colonnes.deploy_competence,
      taille: 10,
      titre: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
    });
    lColonnes.push({
      id: DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
        .colonnes.lib_competence,
      taille: 10,
      titre: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
    });
    lColonnes.push({
      id: DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
        .colonnes.lib_item,
      taille: 10,
      titre: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
    });
    lColonnes.push({
      id: DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
        .colonnes.lib_sousItem,
      taille: "100%",
      titre: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
    });
    if (
      aReferentiel.estLVE === true ||
      aReferentiel.estCompetenceNumerique === true
    ) {
      lColonnes.push({
        id: DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
          .colonnes.niveau_equiv_ce,
        taille: 60,
        titre:
          aReferentiel.estLVE === true
            ? ObjetTraduction_1.GTraductions.getValeur(
                "competencesGrilles.ListeCompetences.TitreNiveauLVE",
              )
            : ObjetTraduction_1.GTraductions.getValeur(
                "competencesGrilles.ListeCompetences.TitreNiveauCN",
              ),
        hint:
          aReferentiel.estLVE === true
            ? ObjetTraduction_1.GTraductions.getValeur(
                "competencesGrilles.ListeCompetences.HintNiveauLVE",
              )
            : ObjetTraduction_1.GTraductions.getValeur(
                "competencesGrilles.ListeCompetences.HintNiveauCN",
              ),
      });
    }
    if (
      aGenreReferentiel ===
      TypeReferentielGrilleCompetence_1.TypeGenreReferentiel
        .GR_PilierDeCompetence
    ) {
      if (
        aReferentiel.avecCoeffElmtPilier ||
        aReferentiel.avecCoeffCompetence ||
        (aReferentiel.avecCoeffSousItem && aReferentiel.avecSousItems)
      ) {
        lColonnes.push({
          id: DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
            .colonnes.coefficient,
          taille: 60,
          titre: ObjetTraduction_1.GTraductions.getValeur(
            "competencesGrilles.ListeCompetences.TitreCoefficient",
          ),
          hint: ObjetTraduction_1.GTraductions.getValeur(
            "competencesGrilles.ListeCompetences.HintCoefficient",
          ),
        });
      }
    } else if (
      aGenreReferentiel ===
      TypeReferentielGrilleCompetence_1.TypeGenreReferentiel.GR_Metamatiere
    ) {
      if (aReferentiel.estCompetenceTransversale === true) {
        lColonnes.push({
          id: DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
            .colonnes.libelle_bulletin,
          taille: 100,
          titre: ObjetTraduction_1.GTraductions.getValeur(
            "competencesGrilles.ListeCompetences.TitreLibelleBulletin",
          ),
          hint: ObjetTraduction_1.GTraductions.getValeur(
            "competencesGrilles.ListeCompetences.HintLibelleBulletin",
          ),
        });
      }
      if (lEstContextePrimaire || aReferentiel.estPalierSocleCommun === true) {
        lColonnes.push({
          id: DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
            .colonnes.domainesAssocies,
          taille: 150,
          titre: ObjetTraduction_1.GTraductions.getValeur(
            "competencesGrilles.ListeCompetences.TitreDomainesAssocies",
          ),
          hint: ObjetTraduction_1.GTraductions.getValeur(
            "competencesGrilles.ListeCompetences.HintDomainesAssocies",
          ),
        });
      }
      if (!lEstContextePrimaire && aReferentiel.estPalierSocleCommun === true) {
        lColonnes.push({
          id: DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
            .colonnes.elmtsSignifiants,
          taille: 150,
          titre: ObjetTraduction_1.GTraductions.getValeur(
            "competencesGrilles.ListeCompetences.TitreEltSignifiant",
          ),
          hint: ObjetTraduction_1.GTraductions.getValeur(
            "competencesGrilles.ListeCompetences.HintEltSignifiant",
          ),
        });
      }
    }
    if (!lEstContextePrimaire && !aReferentiel.estCompetenceNumerique) {
      lColonnes.push({
        id: DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
          .colonnes.evaluable,
        taille: 60,
        titre: ObjetTraduction_1.GTraductions.getValeur(
          "competencesGrilles.ListeCompetences.TitreEvaluable",
        ),
        hint: ObjetTraduction_1.GTraductions.getValeur(
          "competencesGrilles.ListeCompetences.HintEvaluable",
        ),
      });
    }
    if (aOptionsAffichage.afficherNbEvaluationsConcernees) {
      lColonnes.push({
        id: DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
          .colonnes.nb_evaluations,
        taille: 60,
        titre: ObjetTraduction_1.GTraductions.getValeur(
          "competencesGrilles.ListeCompetences.TitreNbEvaluations",
        ),
        hint: ObjetTraduction_1.GTraductions.getValeur(
          "competencesGrilles.ListeCompetences.HintNbEvaluations",
        ),
      });
      if (!lEstContextePrimaire) {
        lColonnes.push({
          id: DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
            .colonnes.nb_evaluationsHisto,
          taille: 60,
          titre: ObjetTraduction_1.GTraductions.getValeur(
            "competencesGrilles.ListeCompetences.TitreNbEvaluationsHistoriques",
          ),
          hint: ObjetTraduction_1.GTraductions.getValeur(
            "competencesGrilles.ListeCompetences.HintNbEvaluationsHistoriques",
          ),
        });
      }
    }
    if (lEstContextePrimaire) {
      lColonnes.push({
        id: DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
          .colonnes.auteur,
        taille: 100,
        titre: ObjetTraduction_1.GTraductions.getValeur(
          "competencesGrilles.ListeCompetences.TitreAuteur",
        ),
        hint: ObjetTraduction_1.GTraductions.getValeur(
          "competencesGrilles.ListeCompetences.HintAuteur",
        ),
      });
    }
    if (lEstContextePrimaire) {
      lColonnes.push({
        id: DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
          .colonnes.niveaux,
        taille: 100,
        titre: ObjetTraduction_1.GTraductions.getValeur(
          "competencesGrilles.ListeCompetences.TitreNiveaux",
        ),
        hint: ObjetTraduction_1.GTraductions.getValeur(
          "competencesGrilles.ListeCompetences.HintNiveaux",
        ),
      });
    }
    return lColonnes;
  }
  _getListeColonnesCompetencesSansBordureDroite(aAvecSousItem) {
    const result = [
      DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences.colonnes
        .plus_competence,
      DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences.colonnes
        .deploy_competence,
      DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences.colonnes
        .lib_competence,
    ];
    if (aAvecSousItem) {
      result.push(
        DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
          .colonnes.lib_item,
      );
    }
    return result;
  }
  _surEditionNiveauEquivalence(aElementCompetence) {
    if (!aElementCompetence) {
      return;
    }
    const lReferentielSelectionne = this._getReferentielSelectionne();
    if (!lReferentielSelectionne) {
      return;
    }
    let lListeNiveauxEquivalence;
    let lTitreFenetre = "";
    if (lReferentielSelectionne.estLVE === true) {
      lTitreFenetre = ObjetTraduction_1.GTraductions.getValeur(
        "competencesGrilles.ListeCompetences.FenetreNivEquivalence.TitreLVE",
      );
      lListeNiveauxEquivalence =
        TypeNiveauEquivalenceCE_1.TypeNiveauEquivalenceCEUtil.getListeNiveauxEquivalenceLVE(
          false,
        );
    } else {
      lTitreFenetre = ObjetTraduction_1.GTraductions.getValeur(
        "competencesGrilles.ListeCompetences.FenetreNivEquivalence.TitreCN",
      );
      lListeNiveauxEquivalence =
        TypeNiveauEquivalenceCE_1.TypeNiveauEquivalenceCEUtil.getListeNiveauxEquivalenceCN(
          true,
        );
    }
    const lFenetre = this.getInstance(this.identFenetreSelectNivEquivalence);
    lFenetre.setOptionsFenetre({ titre: lTitreFenetre });
    lFenetre.setDonnees(
      new DonneesListe_Simple_1.DonneesListe_Simple(lListeNiveauxEquivalence),
      true,
    );
  }
  _surEditionNiveauxConcernes(aElementCompetence) {
    if (!aElementCompetence) {
      return;
    }
    if (
      !aElementCompetence.listeNiveauxPossibles ||
      aElementCompetence.listeNiveauxPossibles.count() === 0
    ) {
      return;
    }
    const lNiveauxPossibles = new ObjetListeElements_1.ObjetListeElements();
    aElementCompetence.listeNiveauxPossibles.parcourir((aNiveau) => {
      const lNiveau = MethodesObjet_1.MethodesObjet.dupliquer(aNiveau);
      lNiveau.selectionne = !!aNiveau.estSelectionne;
      lNiveau.estSelectionnable = !!aNiveau.estActif;
      lNiveau.estModifiable = false;
      lNiveau.estSupprimable = false;
      lNiveauxPossibles.add(lNiveau);
    });
    const lFenetreSimpleChoixNiveaux =
      ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
        ObjetFenetre_Liste_1.ObjetFenetre_Liste,
        {
          pere: this,
          initialiser: function (aInstance) {
            const lColonnes = [];
            lColonnes.push({
              id: DonneesListe_ListeACocher_1.DonneesListe_ListeACocher.colonnes
                .coche,
              titre: "",
              taille: 50,
            });
            lColonnes.push({
              id: DonneesListe_ListeACocher_1.DonneesListe_ListeACocher.colonnes
                .libelle,
              titre: ObjetTraduction_1.GTraductions.getValeur(
                "competencesGrilles.ListeCompetences.FenetreChoixNiveaux.LibelleNiveau",
              ),
              taille: "100%",
            });
            const lParamsListe = {
              optionsListe: {
                colonnes: lColonnes,
                hauteurAdapteContenu: true,
                hauteurMaxAdapteContenu: 500,
              },
            };
            aInstance.setOptionsFenetre({
              modale: true,
              titre: ObjetTraduction_1.GTraductions.getValeur(
                "competencesGrilles.ListeCompetences.FenetreChoixNiveaux.Titre",
              ),
              largeur: 300,
              hauteur: null,
              listeBoutons: [
                ObjetTraduction_1.GTraductions.getValeur("Annuler"),
                ObjetTraduction_1.GTraductions.getValeur("Valider"),
              ],
              modeActivationBtnValider:
                aInstance.modeActivationBtnValider.autre,
            });
            aInstance.paramsListe = lParamsListe;
          },
          evenement: (aNumeroBouton) => {
            if (aNumeroBouton === 1) {
              const lListeNouvellesRestrictionsNiveaux =
                new ObjetListeElements_1.ObjetListeElements();
              lNiveauxPossibles.parcourir((aNiveauDeListe) => {
                if (!!aNiveauDeListe && aNiveauDeListe.pourValidation()) {
                  const lNiveauDeCompetence =
                    aElementCompetence.listeNiveauxPossibles.getElementParNumero(
                      aNiveauDeListe.getNumero(),
                    );
                  if (!!lNiveauDeCompetence) {
                    const lChangementEtat =
                      aNiveauDeListe.selectionne !==
                      lNiveauDeCompetence.estSelectionne;
                    if (lChangementEtat) {
                      if (!aNiveauDeListe.selectionne) {
                        aNiveauDeListe.setEtat(
                          Enumere_Etat_1.EGenreEtat.Suppression,
                        );
                      }
                      lListeNouvellesRestrictionsNiveaux.add(aNiveauDeListe);
                    }
                  }
                }
              });
              if (lListeNouvellesRestrictionsNiveaux.count() > 0) {
                aElementCompetence.listeRestrictionsNiveaux =
                  lListeNouvellesRestrictionsNiveaux;
                aElementCompetence.setEtat(
                  Enumere_Etat_1.EGenreEtat.Modification,
                );
                const lReferentielSelectionne =
                  this._getReferentielSelectionne();
                this._saisie(
                  ObjetRequeteSaisieCompetencesGrilles_1
                    .CommandeSaisieCompetencesGrilles.saisieRestrictionsNiveaux,
                  {
                    referentiel: lReferentielSelectionne,
                    elementsCompetence:
                      new ObjetListeElements_1.ObjetListeElements().addElement(
                        aElementCompetence,
                      ),
                  },
                  { referentielSelectionne: lReferentielSelectionne },
                );
              }
            }
          },
        },
      );
    lFenetreSimpleChoixNiveaux.verifierActivationBtnValider = function (
      aBoutonRepeat,
    ) {
      let lBoutonActif = true;
      if (aBoutonRepeat.element.index === 1) {
        lBoutonActif = false;
        lNiveauxPossibles.parcourir((aNiveau) => {
          if (aNiveau.selectionne) {
            lBoutonActif = true;
            return false;
          }
        });
      }
      return lBoutonActif;
    };
    lFenetreSimpleChoixNiveaux.setDonnees(
      new DonneesListe_ListeACocher_1.DonneesListe_ListeACocher(
        lNiveauxPossibles,
      ),
    );
  }
  _evenementSurListeCompetences(aParametres, aGenreEvenement) {
    let lReferentielSelectionne;
    switch (aGenreEvenement) {
      case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
        aParametres.instance.setCreationLigne(aParametres.ligne);
        break;
      case Enumere_EvenementListe_1.EGenreEvenementListe.ApresCreation:
        lReferentielSelectionne = this._getReferentielSelectionne();
        if (
          lReferentielSelectionne &&
          lReferentielSelectionne.listeCompetences
        ) {
          let lCompetenceCreee = null;
          lReferentielSelectionne.listeCompetences.parcourir((D) => {
            if (D.getEtat() === Enumere_Etat_1.EGenreEtat.Creation) {
              lCompetenceCreee = D;
              return false;
            }
          });
          if (lCompetenceCreee) {
            if (this.pourCN) {
              aParametres.article.nivEquivalenceCEEditable = true;
              if (
                !!aParametres.article.pere &&
                aParametres.article.pere.estUnDeploiement &&
                !aParametres.article.pere.estDeploye
              ) {
                aParametres.article.pere.estDeploye = true;
                aParametres.instance.actualiser({
                  selections: [{ article: aParametres.article }],
                });
              }
              this._surEditionNiveauEquivalence(lCompetenceCreee);
            } else {
              this._saisie(
                ObjetRequeteSaisieCompetencesGrilles_1
                  .CommandeSaisieCompetencesGrilles.creationElementsCompetence,
                {
                  referentiel: lReferentielSelectionne,
                  elementsCompetence:
                    new ObjetListeElements_1.ObjetListeElements().addElement(
                      lCompetenceCreee,
                    ),
                },
                { referentielSelectionne: lReferentielSelectionne },
              );
            }
          }
        }
        break;
      case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
        if (
          aParametres.idColonne ===
          DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
            .colonnes.domainesAssocies
        ) {
          this._surEditionDomainesAssocies(aParametres.article);
        } else if (
          aParametres.idColonne ===
          DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
            .colonnes.niveau_equiv_ce
        ) {
          this._surEditionNiveauEquivalence(aParametres.article);
        } else if (
          aParametres.idColonne ===
          DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
            .colonnes.elmtsSignifiants
        ) {
          this._surEditionElmtSignifiant(aParametres.article);
        } else if (
          aParametres.idColonne ===
          DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
            .colonnes.niveaux
        ) {
          this._surEditionNiveauxConcernes(aParametres.article);
        }
        break;
      case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition: {
        lReferentielSelectionne = this._getReferentielSelectionne();
        aParametres.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
        let lCommandeSaisie =
          ObjetRequeteSaisieCompetencesGrilles_1
            .CommandeSaisieCompetencesGrilles.editionElementsCompetenceLibelle;
        if (
          aParametres.idColonne ===
          DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
            .colonnes.libelle_bulletin
        ) {
          lCommandeSaisie =
            ObjetRequeteSaisieCompetencesGrilles_1
              .CommandeSaisieCompetencesGrilles
              .editionElementsCompetenceLibelleBulletin;
        } else if (
          aParametres.idColonne ===
          DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
            .colonnes.coefficient
        ) {
          lCommandeSaisie =
            ObjetRequeteSaisieCompetencesGrilles_1
              .CommandeSaisieCompetencesGrilles
              .editionElementsCompetenceCoefficient;
        } else if (
          aParametres.idColonne ===
          DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
            .colonnes.evaluable
        ) {
          lCommandeSaisie =
            ObjetRequeteSaisieCompetencesGrilles_1
              .CommandeSaisieCompetencesGrilles
              .editionElementsCompetenceEvaluable;
        }
        this._saisie(
          lCommandeSaisie,
          {
            referentiel: lReferentielSelectionne,
            elementsCompetence:
              new ObjetListeElements_1.ObjetListeElements().addElement(
                aParametres.article,
              ),
          },
          {
            referentielSelectionne: lReferentielSelectionne,
            competenceSelectionnee: aParametres.article,
          },
        );
        break;
      }
      case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
        aParametres.listeSuppressions.parcourir((D) => {
          D.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
        });
        lReferentielSelectionne = this._getReferentielSelectionne();
        this._saisie(
          ObjetRequeteSaisieCompetencesGrilles_1
            .CommandeSaisieCompetencesGrilles.suppressionElementsCompetence,
          {
            referentiel: lReferentielSelectionne,
            elementsCompetence: aParametres.listeSuppressions,
          },
          {
            referentielSelectionne: lReferentielSelectionne,
            callbackCancel: function () {
              aParametres.listeSuppressions.parcourir((D) => {
                D.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
              });
            },
          },
        );
        break;
    }
  }
  _initFenetreSaisieClasses(aInstance) {
    aInstance.setAvecCumul(true);
    aInstance.setSelectionObligatoire(false);
  }
  _evenementFenetreSaisieClasses(
    aGenreRessource,
    aListeClasses,
    aNumeroBouton,
  ) {
    if (aNumeroBouton !== 1) {
      return;
    }
    const lListeReferentielSelectionne = this._getReferentielSelectionne();
    const lListeReferentiels =
      new ObjetListeElements_1.ObjetListeElements().addElement(
        lListeReferentielSelectionne,
      );
    if (lListeReferentielSelectionne) {
      lListeReferentielSelectionne.setEtat(
        Enumere_Etat_1.EGenreEtat.Modification,
      );
      this._saisie(
        ObjetRequeteSaisieCompetencesGrilles_1.CommandeSaisieCompetencesGrilles
          .saisieClasses,
        { listeClasses: aListeClasses, listeReferentiels: lListeReferentiels },
        { referentielSelectionne: lListeReferentielSelectionne },
      );
    }
  }
  _initFenetreNivEquivalence(aInstance) {
    aInstance.setOptionsFenetre({
      modale: true,
      largeur: 280,
      hauteur: this.pourCN ? 350 : 250,
      listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
    });
    const lParamsListe = { tailles: ["100%"], editable: false };
    aInstance.paramsListe = lParamsListe;
  }
  _evntFenetreNivEquivalence(aNumeroBouton, aNiveauEquivalence) {
    const lElementCompetenceSelectionne =
      this._getElementCompetenceSelectionne();
    if (
      aNumeroBouton === 1 ||
      lElementCompetenceSelectionne.getEtat() ===
        Enumere_Etat_1.EGenreEtat.Creation
    ) {
      if (aNumeroBouton === 1 && this.pourCN) {
        lElementCompetenceSelectionne.strNivEquivalenceCE =
          aNiveauEquivalence > 0 ? "" + aNiveauEquivalence : "";
      }
      const lReferentielSelectionne = this._getReferentielSelectionne();
      lElementCompetenceSelectionne.setEtat(
        Enumere_Etat_1.EGenreEtat.Modification,
      );
      this._saisie(
        ObjetRequeteSaisieCompetencesGrilles_1.CommandeSaisieCompetencesGrilles
          .editionElementsCompetenceNivEquivalence,
        {
          referentiel: lReferentielSelectionne,
          elementsCompetence:
            new ObjetListeElements_1.ObjetListeElements().addElement(
              lElementCompetenceSelectionne,
            ),
          niveauEquivalenceCE: aNiveauEquivalence,
        },
        {
          referentielSelectionne: lReferentielSelectionne,
          competenceSelectionnee: lElementCompetenceSelectionne,
        },
      );
    }
    if (
      this.pourCN &&
      lElementCompetenceSelectionne.strNivEquivalenceCE === ""
    ) {
      GApplication.getMessage().afficher({
        type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
        message: ObjetTraduction_1.GTraductions.getValeur(
          "competencesGrilles.ListeCompetences.InfoUtiliteNiveauCompNumeriques",
        ),
      });
    }
  }
  _callbackAjouterElementCompetence(aLigneElementParent) {
    this.getInstance(this.identListeCompetences).setCreationLigne(
      aLigneElementParent,
    );
  }
  _callbackCopierElementsCompetence(aListeItems) {
    this.elementsStockageCopierColler.copieItems =
      MethodesObjet_1.MethodesObjet.dupliquer(aListeItems);
    this.elementsStockageCopierColler.optionsCopieItems = {
      seulementElementsEvaluables:
        this.optionsAffichage.afficherSeulementElementsEvaluables,
    };
  }
  _callbackCollerElementsCompetence(aListeDestinataires) {
    const lListeElementsCopies = this.elementsStockageCopierColler.copieItems;
    aListeDestinataires.setSerialisateurJSON({ ignorerEtatsElements: true });
    lListeElementsCopies.setSerialisateurJSON({ ignorerEtatsElements: true });
    const lReferentielSelectionne = this._getReferentielSelectionne();
    this._saisie(
      ObjetRequeteSaisieCompetencesGrilles_1.CommandeSaisieCompetencesGrilles
        .collerElementsCompetence,
      {
        destinations: aListeDestinataires,
        copies: lListeElementsCopies,
        seulementElementsEvaluables:
          this.elementsStockageCopierColler.optionsCopieItems
            .seulementElementsEvaluables,
      },
      { referentielSelectionne: lReferentielSelectionne },
    );
  }
  _callbackCopierGrille() {
    const lReferentielSelectionne = this._getReferentielSelectionne();
    this.elementsStockageCopierColler.copieGrille = {
      referentiel: MethodesObjet_1.MethodesObjet.dupliquer(
        lReferentielSelectionne,
      ),
      palier: this.etatUtilisateurSco.Navigation.getRessource(
        Enumere_Ressource_1.EGenreRessource.Palier,
      ),
      seulementElementsPerso: this.optionsAffichage.masquerElementsOfficiels,
      seulementElementsEvaluables:
        this.optionsAffichage.afficherSeulementElementsEvaluables,
    };
  }
  _callbackCollerGrille() {
    const lReferentielSelectionne = this._getReferentielSelectionne();
    this._saisie(
      ObjetRequeteSaisieCompetencesGrilles_1.CommandeSaisieCompetencesGrilles
        .collerGrille,
      {
        destination: lReferentielSelectionne,
        source: this.elementsStockageCopierColler.copieGrille.referentiel,
        palierSource: this.elementsStockageCopierColler.copieGrille.palier,
        seulementElementsPerso:
          this.elementsStockageCopierColler.copieGrille.seulementElementsPerso,
        seulementElementsEvaluables:
          this.elementsStockageCopierColler.copieGrille
            .seulementElementsEvaluables,
      },
      { referentielSelectionne: lReferentielSelectionne },
    );
    this.elementsStockageCopierColler.copieGrille = null;
  }
  _callbackDeplacer(aArticleSource, aArticleDestination) {
    const lReferentielSelectionne = this._getReferentielSelectionne();
    this._saisie(
      ObjetRequeteSaisieCompetencesGrilles_1.CommandeSaisieCompetencesGrilles
        .echOrdreElementsCompetence,
      {
        srcElementCompetence: aArticleSource,
        destElementCompetence: aArticleDestination,
      },
      {
        referentielSelectionne: lReferentielSelectionne,
        competenceSelectionnee: aArticleSource,
      },
    );
  }
  _actualiserListeCompetences() {
    let lOrdre_Domaine = 0;
    let lOrdre_Item = 0;
    let lOrdre_SousItem = 0;
    this.donnees.listeCompetences.parcourir((aElement, aIndex, aListe) => {
      if (aElement.getEtat() === Enumere_Etat_1.EGenreEtat.Suppression) {
        return;
      }
      aElement.nbFils = 0;
      if (
        aElement.getGenre() ===
        Enumere_Ressource_1.EGenreRessource.ElementPilier
      ) {
        aElement.estUnDeploiement = true;
        aElement.estDeploye = true;
      }
      if (aElement.pere) {
        aElement.pere.nbFils += 1;
      }
      switch (aElement.getGenre()) {
        case Enumere_Ressource_1.EGenreRessource.ElementPilier:
          lOrdre_Domaine += 1;
          lOrdre_Item = 0;
          lOrdre_SousItem = 0;
          aElement.ordre = lOrdre_Domaine;
          break;
        case Enumere_Ressource_1.EGenreRessource.Competence:
          lOrdre_Item += 1;
          lOrdre_SousItem = 0;
          aElement.ordre = lOrdre_Item;
          break;
        case Enumere_Ressource_1.EGenreRessource.SousItem:
          lOrdre_SousItem += 1;
          aElement.ordre = lOrdre_SousItem;
          break;
      }
    });
    this.donnees.listeCompetences.parcourir((aElement) => {
      aElement.estUnDeploiement =
        aElement.estUnDeploiement && aElement.nbFils > 0;
    });
    this.donnees.listeCompetences.trier();
    if (
      this.etats &&
      this.etats.listeElementsDeploiementDansLaListeCompetence
    ) {
      this.etats.listeElementsDeploiementDansLaListeCompetence.parcourir(
        (aElement) => {
          if ("estDeploye" in aElement) {
            const lIndice =
              this.donnees.listeCompetences.getIndiceParElement(aElement);
            if (lIndice >= 0) {
              const lLigne = this.donnees.listeCompetences.get(lIndice);
              lLigne.estDeploye = aElement.estDeploye;
            }
          }
        },
      );
      this.etats.listeElementsDeploiementDansLaListeCompetence =
        new ObjetListeElements_1.ObjetListeElements();
    }
    this.getInstance(this.identListeCompetences).setVisible(true);
    const lDonneesListeCompetences =
      new DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences(
        this.donnees.listeCompetences,
        {
          avecCreationDomaine: this.donnees.avecCreationDomaine,
          avecCreationCompetence: this.donnees.avecCreationCompetence,
          estGrilleModifiable: this.donnees.estGrilleModifiable,
          avecSousItems: this.donnees.avecSousItems,
          avecMultiSelection: true,
          callbackAjouterElement:
            this._callbackAjouterElementCompetence.bind(this),
          callbackCopierElements:
            this._callbackCopierElementsCompetence.bind(this),
          callbackCollerElements:
            this._callbackCollerElementsCompetence.bind(this),
          callbackCopierGrille: this._callbackCopierGrille.bind(this),
          callbackCollerGrille: this._callbackCollerGrille.bind(this),
          callbackDeplacer: this._callbackDeplacer.bind(this),
        },
      );
    const lListeBoutonCompentences = [];
    lListeBoutonCompentences.push(
      { genre: ObjetListe_1.ObjetListe.typeBouton.deployer },
      { genre: ObjetListe_1.ObjetListe.typeBouton.rechercher },
    );
    if (this.donnees.avecCreationDomaine) {
      lListeBoutonCompentences.push({
        genre: ObjetListe_1.ObjetListe.typeBouton.monter,
      });
      lListeBoutonCompentences.push({
        genre: ObjetListe_1.ObjetListe.typeBouton.descendre,
      });
    }
    this.getInstance(this.identListeCompetences)
      .setOptionsListe({
        colonnes: this._getListeColonnesCompetences(
          this.getGenreReferentiel(),
          this._getReferentielSelectionne(),
          this.optionsAffichage,
        ),
        colonnesSansBordureDroit:
          this._getListeColonnesCompetencesSansBordureDroite(
            this.donnees.avecSousItems,
          ),
        scrollHorizontal: false,
        listeCreations: [
          DonneesListe_Saisie_Competences_1.DonneesListe_Saisie_Competences
            .colonnes.lib_competence,
        ],
        avecLigneCreation: this.donnees.avecCreationDomaine === true,
        titreCreation: ObjetTraduction_1.GTraductions.getValeur(
          "competencesGrilles.ListeCompetences.AjouterCompetence",
        ),
        nonEditableSurModeExclusif: true,
        boutons: lListeBoutonCompentences,
      })
      .setDonnees(lDonneesListeCompetences);
  }
  _actualiserListeGrilles(
    aReferentielSelectionne,
    aCompetenceSelectionnee,
    aMessageApresActualisation,
  ) {
    let lLibelleLigneCreation = "";
    const lListeBoutonGrilles = [];
    if (!this.pourCN && !this.pourApprentissage) {
      lListeBoutonGrilles.push({
        genre: ObjetListe_1.ObjetListe.typeBouton.supprimer,
        event: this._evenementBoutonSupprimerGrille.bind(this),
        getDisabled: this._getDisabledBoutonSupprimerGrille.bind(this),
      });
    }
    if (!!this.donnees.avecCreation) {
      if (
        this.getGenreReferentiel() ===
        TypeReferentielGrilleCompetence_1.TypeGenreReferentiel
          .GR_PilierDeCompetence
      ) {
        lListeBoutonGrilles.push({
          genre: ObjetListe_1.ObjetListe.typeBouton.monter,
        });
        lListeBoutonGrilles.push({
          genre: ObjetListe_1.ObjetListe.typeBouton.descendre,
        });
      }
      if (!this.pourApprentissage) {
        lLibelleLigneCreation = ObjetTraduction_1.GTraductions.getValeur(
          "competencesGrilles.GrilleCompetences.AjouterRefentiel",
        );
      } else {
        lLibelleLigneCreation = ObjetTraduction_1.GTraductions.getValeur(
          "competencesGrilles.GrilleCompetences.AjouterDomaineApprentiss",
        );
      }
    }
    this.cache.referentielSelectionne = null;
    const lListeGrilles = this.getInstance(this.identListeGrilles);
    lListeGrilles.setOptionsListe({
      colonnes: this._getListeColonnesGrilles(),
      nonEditableSurModeExclusif: true,
      scrollHorizontal: false,
      listeCreations: 0,
      avecLigneCreation: !!this.donnees.avecCreation,
      titreCreation: lLibelleLigneCreation,
      boutons: lListeBoutonGrilles,
    });
    const lDonneesListe =
      new DonneesListe_Competences_Grilles_1.DonneesListe_Competences_Grilles(
        this.donnees.listeReferentiels,
        {
          avecFusionClasses:
            this.donnees.avecListeClassesCommuneEntreReferentiels,
          avecCreationParSaisieDirecte: this.pourApprentissage,
          surDeplacer: (aSource, aDestination) => {
            this._saisie(
              ObjetRequeteSaisieCompetencesGrilles_1
                .CommandeSaisieCompetencesGrilles.echOrdreReferentiels,
              { srcReferentiel: aSource, destReferentiel: aDestination },
              { referentielSelectionne: aSource },
            );
          },
        },
      );
    lDonneesListe.setOptions({
      avecSuppression: !this.pourCN && !this.pourApprentissage,
    });
    lListeGrilles.setDonnees(lDonneesListe);
    const lListeCompetences = this.getInstance(this.identListeCompetences);
    lListeCompetences.setVisible(false);
    if (!!aReferentielSelectionne) {
      lListeGrilles.setListeElementsSelection(
        new ObjetListeElements_1.ObjetListeElements().addElement(
          aReferentielSelectionne,
        ),
        { avecEvenement: true },
      );
    }
    if (!!aCompetenceSelectionnee && lListeCompetences.Visible) {
      lListeCompetences.setListeElementsSelection(
        new ObjetListeElements_1.ObjetListeElements().addElement(
          aCompetenceSelectionnee,
        ),
        { avecEvenement: false, avecScroll: true },
      );
    }
    if (!!aMessageApresActualisation) {
      GApplication.getMessage().afficher({
        type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
        message: aMessageApresActualisation,
      });
    }
  }
  _surReponseActualiserPage(
    aReferentielSelectionne,
    aCompetenceSelectionnee,
    aMessageApresActualisation,
    aJSON,
  ) {
    this.donnees.listeReferentiels = aJSON.listeReferentiels;
    this.donnees.avecCreation = aJSON.avecCreation;
    this.donnees.listeTousLesReferentiels = aJSON.listeTousLesReferentiels;
    this.donnees.listeTousLesDomaines = aJSON.listeTousLesDomaines;
    this.donnees.listeClassesPossibles = aJSON.listeClassesPossibles;
    this.donnees.avecListeClassesCommuneEntreReferentiels =
      aJSON.estListeClassesCommuneEntreReferentiels;
    this._actualiserListeGrilles(
      aReferentielSelectionne,
      aCompetenceSelectionnee,
      aMessageApresActualisation,
    );
  }
  _setEtatDeploiementDansLaListeCompetence(aListe) {
    if (
      aListe &&
      this.etats &&
      this.etats.listeElementsDeploiementDansLaListeCompetence
    ) {
      aListe.parcourir((aElement) => {
        if (aElement.estUnDeploiement) {
          this.etats.listeElementsDeploiementDansLaListeCompetence.add(
            aElement,
          );
        }
      });
    }
  }
}
exports.InterfaceCompetences_Grilles = InterfaceCompetences_Grilles;
