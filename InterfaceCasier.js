const { tag } = require("tag.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { GTraductions } = require("ObjetTraduction.js");
const { UtilitaireDocument } = require("UtilitaireDocument.js");
const { ObjetRequeteCasier } = require("ObjetRequeteCasier.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetRequeteSaisieCasier } = require("ObjetRequeteSaisieCasier.js");
const { ObjetListe } = require("ObjetListe.js");
const { DonneesListe_Casier } = require("DonneesListe_Casier.js");
const { GChaine } = require("ObjetChaine.js");
const { _InterfaceDocuments } = require("_InterfaceDocuments.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
  ObjetFenetre_DepotDocument,
  EGenreEvenementDepotDoc,
} = require("ObjetFenetre_DepotDocument.js");
const {
  EGenreRessource,
  EGenreRessourceUtil,
} = require("Enumere_Ressource.js");
const { ObjetRequeteListePublics } = require("ObjetRequeteListePublics.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const {
  ObjetFenetre_SelectionPublic_PN,
} = require("ObjetFenetre_SelectionPublic_PN.js");
const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const {
  TypeConsultationDocumentCasier,
} = require("TypeConsultationDocumentCasier.js");
const {
  TypeGenreCumulSelectionPublic,
} = require("ObjetFenetre_SelectionPublic.js");
const {
  getCumulPourFenetrePublic,
} = require("UtilitaireFenetreSelectionPublic.js");
const { GPosition } = require("ObjetPosition.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { UtilitaireMessagerie } = require("UtilitaireMessagerie.js");
const { Toast } = require("Toast.js");
const { GUID } = require("GUID.js");
const {
  DonneesListe_CasierListeEleves,
} = require("DonneesListe_CasierListeEleves.js");
const { GHtml } = require("ObjetHtml.js");
const {
  UtilitaireDocumentATelecharger,
} = require("UtilitaireDocumentATelecharger.js");
const { ObjetTri } = require("ObjetTri.js");
const genreRubriqueCasier = {
  monCasier: 1,
  depositaire: 2,
  responsable: 3,
  collecteParDocument: 4,
  collecteParEleve: 5,
};
class InterfaceCasier extends _InterfaceDocuments {
  constructor(...aParams) {
    super(...aParams);
    this.genreRubriqueSelectionne = genreRubriqueCasier.monCasier;
    this.titreFenetreRubrique = GTraductions.getValeur("Casier.natures");
    this.modeAff = this.getModeAffichage();
    this.contexte = Object.assign(this.contexte, {
      ecran: [
        _InterfaceDocuments.genreEcran.ecranCentrale,
        _InterfaceDocuments.genreEcran.ecranDroite,
      ],
      niveauCourant: 0,
    });
    this.classCssPrincipale = "InterfaceCasier";
    this.id = { titreEcranDroite: GUID.getId(), ctnEcranDroite: GUID.getId() };
    this.filtres = this.composeFiltre();
    this.indiceComboClasseCollecteParEleve = -1;
    this.avecEcranDroiteVisible = false;
  }
  construireInstances() {
    this.identDocuments = this.add(
      ObjetListe,
      this.eventDocuments,
      this.initDocuments,
    );
    if (this.avecDroitDocumentEleve()) {
      this.identListeEleves = this.add(ObjetListe, null, this.initListeEleves);
    }
    super.construireInstances();
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnRetour: {
        event() {
          aInstance.basculerEcran({ src: 1, dest: 0 });
        },
      },
      comboClasses: {
        init: (aCombo) => {
          aCombo.setOptionsObjetSaisie({
            longueur: 200,
            placeHolder: GTraductions.getValeur("Casier.selectionnezUneClasse"),
            labelWAICellule: GTraductions.getValeur(
              "Casier.selectionnezUneClasse",
            ),
          });
          aCombo.setDonneesObjetSaisie({
            liste: this.listeClasses,
            selection: aInstance.indiceComboClasseCollecteParEleve,
          });
        },
        event: (aParam) => {
          if (aParam.element && aParam.estSelectionManuelle) {
            aInstance.classeSelectionne = aParam.element;
            aInstance.indiceComboClasseCollecteParEleve =
              aInstance.listeClasses.getIndiceElementParFiltre(
                (aClasse) => aClasse === aParam.element,
              );
            aInstance.requeteConsultation({
              requete: { classe: aParam.element },
              callback: aInstance.reponseRequeteCollecteEleves.bind(aInstance),
            });
          }
        },
      },
    });
  }
  getRubriqueParTypeConsultation(aType) {
    let lRubrique;
    if (aType >= 0) {
      lRubrique = this.getDonneesDelaListeRubrique()
        .getListeElements((aI) => aI.typeConsultation === aType)
        .get(0);
    }
    return lRubrique;
  }
  reponseRequeteCollecteDocument(aParam) {
    const lDonnees = aParam.json || new ObjetListeElements();
    const lArticle = aParam.requete && aParam.requete.document;
    lArticle.listeEleves = lDonnees.listeEleves || new ObjetListeElements();
    this.listeElevesCollecteParDocuments = lArticle.listeEleves;
    if (
      aParam.requete &&
      aParam.requete.classeSelectionne &&
      !aParam.requete.classeSelectionne.estTotal
    ) {
      lArticle.listeEleves = lArticle.listeEleves.getListeElements((aEleve) =>
        this.eleveEstDansClasse(aEleve, aParam.requete.classeSelectionne),
      );
      lArticle.classeSelectionne = aParam.requete.classeSelectionne;
    }
    this.basculerEcran({ src: 0, dest: 1, data: lArticle });
  }
  eleveEstDansClasse(aEleve, aClasse) {
    if (aEleve.classe) {
      const lNumeroClasseEleve = aEleve.classe.getNumero();
      if (aClasse.listeComposantes) {
        return !!aClasse.listeComposantes.getElementParNumero(
          lNumeroClasseEleve,
        );
      } else {
        return lNumeroClasseEleve === aClasse.getNumero();
      }
    }
    return false;
  }
  reponseRequeteCollecteEleves(aParam) {
    this.listeCollecteParEleves = null;
    const lDonnees = aParam.json;
    this.effacerEcranDroite();
    this.listeCollecteParEleves =
      (lDonnees && lDonnees.listeCollecteParEleves) || new ObjetListeElements();
    this.basculerEcran({ src: null, dest: 0 });
  }
  reponseRequeteCasier({ json: aJSON }) {
    this.listeDocumentsMonCasier = aJSON.listeDocumentsMonCasier;
    this.listeCategoriesMonCasier = aJSON.listeCategoriesMonCasier;
    this.listeDocumentsDepositaire = aJSON.listeDocumentsDepositaire;
    this.listeCategoriesDepositaire = aJSON.listeCategoriesDepositaire;
    this.listeDocumentsResponsable = aJSON.listeDocumentsResponsable;
    this.listeCategoriesResponsable = aJSON.listeCategoriesResponsable;
    this.listeCollecteParDocuments = aJSON.listeCollecteParDocuments;
    this.listeClasses = this.getListeClasses(this.listeCollecteParDocuments);
    this.listeFichiers = new ObjetListeElements();
    this.listeFichiersCloud = new ObjetListeElements();
    this.courant = {
      ligneCourante: -1,
      selectionIN: new ObjetListeElements(),
      selectionOUT: new ObjetListeElements(),
    };
    this.avecDocumentsDejaDeposes = aJSON.avecDocumentsDejaDeposes;
    this.listeRubrique = this.getlisteRubrique();
    this.initAff();
  }
  reponseRequeteListePublics(aDonnees, aParams) {
    this.courant.selectionIN = new ObjetListeElements();
    aDonnees.listePublic.parcourir((aElem) => (aElem.aSupprimeDoc = false));
    aParams.liste.parcourir((aElem) => {
      if (aElem.existe()) {
        this.courant.selectionIN.addElement(MethodesObjet.dupliquer(aElem));
      }
      if (aElem.aSupprimeDoc) {
        let lElt2 = aDonnees.listePublic.getElementParNumero(aElem.getNumero());
        if (lElt2) {
          lElt2.aSupprimeDoc = true;
        }
      }
    });
    const lGenreRessource = aDonnees.genres[0];
    const lListeCoche = MethodesObjet.dupliquer(this.courant.selectionIN);
    let lLibelleDepotGroupe;
    switch (lGenreRessource) {
      case EGenreRessource.Personnel:
        lLibelleDepotGroupe = GTraductions.getValeur(
          "Casier.deposerNouveauPersonnel",
        );
        break;
      case EGenreRessource.Enseignant:
        lLibelleDepotGroupe = GTraductions.getValeur(
          "Casier.deposerNouveauProfesseur",
        );
        break;
      case EGenreRessource.MaitreDeStage:
        lLibelleDepotGroupe = GTraductions.getValeur(
          "Casier.deposerNouveauMaitre",
        );
        break;
      case EGenreRessource.Responsable:
        lLibelleDepotGroupe = GTraductions.getValeur(
          "Casier.deposerNouveauResponsable",
        );
        break;
    }
    let lGenreCumul = null;
    const lListeCumuls = new ObjetListeElements();
    if (lGenreRessource === EGenreRessource.Responsable) {
      lGenreCumul = getCumulPourFenetrePublic(
        lGenreRessource,
        aDonnees.checked,
        aDonnees.listePublic.count(),
      );
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
      lListeCumuls.addElement(
        new ObjetElement(
          GTraductions.getValeur("actualites.Cumul.NomDesEleves"),
          0,
          TypeGenreCumulSelectionPublic.nomEleves,
        ),
      );
      if (aDonnees.listeServicesPeriscolaire) {
        lListeCumuls.addElement(
          new ObjetElement(
            GTraductions.getValeur("actualites.Cumul.ServicesPeriscolaire"),
            0,
            TypeGenreCumulSelectionPublic.servicesPeriscolaire,
          ),
        );
      }
      if (aDonnees.listeProjetsAcc) {
        lListeCumuls.addElement(
          new ObjetElement(
            GTraductions.getValeur("actualites.Cumul.ProjetsAccompagnement"),
            0,
            TypeGenreCumulSelectionPublic.projetsAccompagnement,
          ),
        );
      }
      if (aDonnees.listeFamilles) {
        aDonnees.listeFamilles.parcourir((aFamille) => {
          const lFiltreFamille = new ObjetElement(
            aFamille.getLibelle(),
            0,
            TypeGenreCumulSelectionPublic.famille,
          );
          lFiltreFamille.famille = aFamille;
          lListeCumuls.addElement(lFiltreFamille);
        });
      }
    }
    if (lGenreRessource === EGenreRessource.Personnel) {
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
    }
    this.fenetreSelectionPublic = ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_SelectionPublic_PN,
      {
        pere: this,
        initialiser(aInstance) {
          aInstance.setListeCumuls(lListeCumuls);
          if (lGenreCumul) {
            aInstance.setGenreCumulActif(lGenreCumul);
          }
          if (lGenreRessource === EGenreRessource.Personnel) {
            aInstance.setOptions({
              getInfosSuppZonePrincipale(aParams) {
                return aInstance.getGenreCumul() !==
                  TypeGenreCumulSelectionPublic.fonction
                  ? UtilitaireMessagerie.getLibelleSuppListePublics(
                      aParams.article,
                    )
                  : "";
              },
            });
          }
          aInstance.setSelectionObligatoire(false);
          aInstance.setOptionsFenetreSelectionRessource({
            avecCocheRessources: true,
            getClassRessource: function (D) {
              return D.aSupprimeDoc ? "Italique GrisTresFonce" : "";
            },
            getHintRessource: function (D) {
              return D.aSupprimeDoc
                ? GTraductions.getValeur("Casier.HintDocSupprime")
                : "";
            },
          });
        },
        evenement(
          aGenreRessource,
          aListeRessourcesSelectionnees,
          aNumeroBouton,
        ) {
          if (aNumeroBouton > 0) {
            const lListeOut = new ObjetListeElements();
            let lValeurDepotGroupe = false;
            aListeRessourcesSelectionnees.parcourir((aRessource) => {
              if (!aRessource.estDepotgroupe) {
                lListeOut.add(aRessource);
              } else {
                lValeurDepotGroupe = true;
              }
            });
            this.courant.selectionOUT = lListeOut;
            const lIn = this.courant.selectionIN;
            let lListeDonnees;
            const lLigne = this.courant.ligneCourante;
            switch (aGenreRessource) {
              case EGenreRessource.Enseignant:
                lLigne.listeProfesseurs = lListeOut;
                lListeDonnees = lLigne.listeProfesseurs;
                lLigne.avecEnvoiGroupeProfesseur = lValeurDepotGroupe;
                break;
              case EGenreRessource.MaitreDeStage:
                lLigne.listeMaitreStage = lListeOut;
                lListeDonnees = lLigne.listeMaitreStage;
                lLigne.avecEnvoiGroupeMaitreDeStage = lValeurDepotGroupe;
                break;
              case EGenreRessource.Personnel:
                lLigne.listePersonnels = lListeOut;
                lListeDonnees = lLigne.listePersonnels;
                lLigne.avecEnvoiGroupePersonnel = lValeurDepotGroupe;
                break;
              case EGenreRessource.Responsable:
                lLigne.listeResponsables = lListeOut;
                lListeDonnees = lLigne.listeResponsables;
                lLigne.avecEnvoiGroupeResponsable = lValeurDepotGroupe;
                break;
              case EGenreRessource.Classe:
                lLigne.listeEquipesPedagogique = lListeOut;
                lListeDonnees = lLigne.listeEquipesPedagogique;
                break;
              default:
                break;
            }
            const lEstListeAvecModif =
              !lIn.listeIdentiqueParElementsOrdonnes(lListeDonnees);
            if (
              lLigne.getEtat() !== EGenreEtat.Creation &&
              lEstListeAvecModif
            ) {
              lLigne.setEtat(EGenreEtat.Modification);
            }
            if (lEstListeAvecModif) {
              lIn.parcourir((aElement) => {
                const lEstPasDansOut = !lListeDonnees.getElementParNumero(
                  aElement.getNumero(),
                );
                if (lEstPasDansOut) {
                  lListeDonnees.add(aElement.setEtat(EGenreEtat.Suppression));
                }
              });
              lListeDonnees.parcourir((aElement) => {
                const lEstDansIn = lIn.getElementParNumero(
                  aElement.getNumero(),
                );
                if (
                  !lEstDansIn ||
                  (lEstDansIn && lLigne.getEtat() === EGenreEtat.Creation)
                ) {
                  aElement.setEtat(EGenreEtat.Creation);
                }
              });
            }
            if (aGenreRessource === EGenreRessource.Responsable) {
              lLigne.infoResponsable =
                lLigne.listeResponsables.getNbrElementsExistes();
            } else {
              lLigne.infoPersonnel =
                lLigne.listePersonnels.getNbrElementsExistes();
              lLigne.infoProfesseur =
                lLigne.listeProfesseurs.getNbrElementsExistes();
              lLigne.infoMaitreDeStage =
                lLigne.listeMaitreStage.getNbrElementsExistes();
              lLigne.infoEquipePedagogique =
                lLigne.listeEquipesPedagogique.getNbrElementsExistes();
            }
          }
        },
      },
    );
    let lElementDepotGroupe = null;
    if (lLibelleDepotGroupe) {
      const lLibelleHtml = tag(
        "p",
        { class: ["flex-contain", "WhiteSpaceNormal"] },
        tag("i", { class: ["icon_group", "m-right"] }),
        tag("span", lLibelleDepotGroupe),
      );
      lElementDepotGroupe = new ObjetElement({
        Libelle: lLibelleHtml,
        selectionne: !!aParams.avecDepotGroupe,
        estDepotgroupe: true,
      });
    }
    const lAvecEltAucun = ![
      EGenreRessource.Classe,
      EGenreRessource.MaitreDeStage,
    ].includes(lGenreRessource);
    this.fenetreSelectionPublic.setAutoriseEltAucun(lAvecEltAucun);
    this.fenetreSelectionPublic.setListeElementsAPositionnerEnPremier(
      lElementDepotGroupe
        ? new ObjetListeElements().add(lElementDepotGroupe)
        : null,
    );
    this.fenetreSelectionPublic.setDonnees({
      listeRessources: aDonnees.listePublic,
      listeRessourcesSelectionnees: lListeCoche,
      genreRessource: lGenreRessource,
      titre:
        EGenreRessourceUtil.getTitreFenetreSelectionRessource(lGenreRessource),
      estGenreRessourceDUtilisateurConnecte:
        EGenreRessourceUtil.correspondAuGenreUtilisateurEspaceCourant(
          lGenreRessource,
        ),
      listeNiveauxResponsabilite: aDonnees.listeNiveauxResponsabilite,
    });
  }
  requeteSaisie(aParams = {}) {
    const lParams = Object.assign(
      {
        genreSaisie: ObjetRequeteSaisieCasier.genreSaisie.saisieCasier,
        listeLignes: this.listeDocuments,
      },
      aParams,
    );
    if (lParams && MethodesObjet.isNumeric(lParams.genreSaisie)) {
      new ObjetRequeteSaisieCasier(
        this,
        aParams.callback ? aParams.callback : this.recupererDonnees,
      )
        .addUpload({
          listeFichiers: this.listeFichiers,
          listeDJCloud: this.listeFichiersCloud,
        })
        .lancerRequete({
          genreSaisie: lParams.genreSaisie,
          documents: lParams.documents,
          listeLignes: lParams.listeLignes,
          documentLu: lParams.documentLu,
          typeConsultation:
            aParams.typeConsultation >= 0
              ? aParams.typeConsultation
              : this.getTypeConsultation(),
        });
    } else {
    }
  }
  requeteListePublics(aParams) {
    const lParams = { genres: [aParams.genre], avecFonctionPersonnel: true };
    if (aParams.sansFiltreSurEleve) {
      lParams.sansFiltreSurEleve = true;
    }
    new ObjetRequeteListePublics(this)
      .lancerRequete(lParams)
      .then((aDonnees) => this.reponseRequeteListePublics(aDonnees, aParams));
  }
  recupererDonnees() {
    this.requeteConsultation();
  }
  requeteConsultation(aParam = {}) {
    new ObjetRequeteCasier(this).lancerRequete(aParam.requete).then((aJSON) => {
      const lCallback = aParam.callback
        ? aParam.callback
        : this.reponseRequeteCasier;
      lCallback.call(this, { json: aJSON, requete: aParam.requete });
    });
  }
  initDocuments(aInstance) {
    const lListeBoutons = [];
    const lOptions = {
      nonEditableSurModeExclusif: true,
      avecOmbreDroite: true,
      avecLigneCreation: !!this.avecFonctionnalite(
        InterfaceCasier.fonctionnalite.creationDoc,
      ),
      titreCreation: GTraductions.getValeur("Casier.diffuserDocument"),
      skin: ObjetListe.skin.flatDesign,
      boutons: lListeBoutons,
      messageContenuVide: this.getMessageContenuVide(),
    };
    lListeBoutons.push({ genre: ObjetListe.typeBouton.rechercher });
    if (
      [genreRubriqueCasier.collecteParEleve].includes(
        this.genreRubriqueSelectionne,
      )
    ) {
      lListeBoutons.push({
        html: tag("ie-combo", {
          "ie-model": "comboClasses",
          class: "combo-sans-fleche",
        }),
        controleur: this.controleur,
      });
    }
    if (
      ![genreRubriqueCasier.collecteParEleve].includes(
        this.genreRubriqueSelectionne,
      )
    ) {
      lListeBoutons.push({ genre: ObjetListe.typeBouton.filtrer });
    }
    switch (this.genreRubriqueSelectionne) {
      case genreRubriqueCasier.responsable:
        lOptions.avecLigneCreation =
          lOptions.avecLigneCreation && this.avecDroitSaisieResponsable();
        break;
      case genreRubriqueCasier.depositaire:
        lOptions.avecLigneCreation =
          lOptions.avecLigneCreation && this.avecDroitSaisieIntervenant();
        break;
      case genreRubriqueCasier.monCasier:
        lOptions.avecLigneCreation =
          (lOptions.avecLigneCreation && this.avecDroitSaisieResponsable()) ||
          this.avecDroitSaisieIntervenant();
        break;
      case genreRubriqueCasier.collecteParEleve:
        break;
    }
    aInstance.setOptionsListe(lOptions);
    GEtatUtilisateur.setTriListe({ liste: aInstance });
  }
  eventDocuments(aParams) {
    const lArticle = aParams.article || new ObjetElement();
    switch (aParams.genreEvenement) {
      case EGenreEvenementListe.Creation:
        this.surCreationListe(aParams.nodeBouton);
        break;
      case EGenreEvenementListe.SelectionClick:
        switch (this.genreRubriqueSelectionne) {
          case genreRubriqueCasier.monCasier:
            this.telechargerDoc(lArticle);
            if (
              this.avecFonctionnalite(
                InterfaceCasier.fonctionnalite.marquerLectureDocument,
              )
            ) {
              this.surMarquerLu(lArticle);
            }
            break;
          case genreRubriqueCasier.depositaire:
          case genreRubriqueCasier.responsable:
            if (
              this.avecFonctionnalite(
                InterfaceCasier.fonctionnalite.miseAJourDoc,
              )
            ) {
              this.ouvrirFenetreSaisieDocument({
                genreSaisie: EGenreEtat.Modification,
                document: aParams.article,
              });
            }
            break;
          case genreRubriqueCasier.collecteParDocument:
            {
              const lParams = {
                requete: { document: aParams.article },
                callback: this.reponseRequeteCollecteDocument.bind(this),
              };
              const lFiltre = this.getFiltreParGenre();
              if (lFiltre.indiceClasse >= 0) {
                const lClasse = this.listeClasses.get(lFiltre.indiceClasse - 1);
                if (lClasse) {
                  lParams.requete.classeSelectionne = lClasse;
                }
              }
              this.requeteConsultation(lParams);
            }
            break;
          case genreRubriqueCasier.collecteParEleve:
            this.basculerEcran({ src: 0, dest: 1, data: aParams.article });
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }
  callbackCollecte(aClasse) {
    if (
      this.genreRubriqueSelectionne === genreRubriqueCasier.collecteParDocument
    ) {
      if (aClasse) {
        if (
          this.listeElevesCollecteParDocuments &&
          this.listeElevesCollecteParDocuments.count() > 0 &&
          this.avecEcranDroiteVisible
        ) {
          const lArticle = this.getCtxSelection({ niveauEcran: 0 });
          if (aClasse.estTotal) {
            lArticle.listeEleves = this.listeElevesCollecteParDocuments;
          } else {
            lArticle.listeEleves =
              this.listeElevesCollecteParDocuments.getListeElements((aEleve) =>
                this.eleveEstDansClasse(aEleve, aClasse),
              );
          }
          if (
            !this.optionsEcrans.avecBascule &&
            lArticle.listeEleves.count() > 0
          ) {
            return this.basculerEcran({ src: 0, dest: 1, data: lArticle });
          }
        }
      }
      this.effacerEcranDroite();
    }
  }
  initListeEleves(aInstance) {
    const lListeBoutons = [];
    lListeBoutons.push(
      { genre: ObjetListe.typeBouton.rechercher },
      { genre: ObjetListe.typeBouton.filtrer },
    );
    aInstance.setOptionsListe({
      messageContenuVide: GTraductions.getValeur("Casier.sansCollecte"),
      skin: ObjetListe.skin.flatDesign,
      avecFiltresVisibles: false,
      boutons: lListeBoutons,
    });
  }
  evenementFenetreDepot(aParams) {
    switch (aParams.genreEvenement) {
      case EGenreEvenementDepotDoc.surSelectionRessource:
        this.surSelectionRessource(aParams);
        break;
      case EGenreEvenementDepotDoc.ajoutDocument:
        this.surAjoutDocument({
          article: aParams.article,
          documentJoint: aParams.documentJoint,
          typeConsultation: aParams.typeConsultation,
        });
        break;
      case EGenreEvenementDepotDoc.editionDocument:
        if (!!aParams.documentJoint) {
          this.surAjoutDocument({
            article: aParams.documentModifie,
            documentJoint: aParams.documentJoint,
          });
          return;
        }
        this.requeteSaisie({
          genreSaisie: ObjetRequeteSaisieCasier.genreSaisie.saisieCasier,
          listeLignes: new ObjetListeElements().add(aParams.documentModifie),
        });
        break;
      case EGenreEvenementDepotDoc.renommerDocument:
        this.ouvrirFenetreRename({
          article: aParams.article,
          documentJoint: aParams.documentJoint,
        });
        break;
      case EGenreEvenementDepotDoc.supprimerDocument: {
        const lDocuments = this.getListeDocument();
        if (lDocuments) {
          const lArticle = lDocuments.getElementParNumero(
            aParams.article.getNumero(),
          );
          if (lArticle) {
            lArticle.setEtat(EGenreEtat.Suppression);
            this.requeteSaisie({
              listeLignes: new ObjetListeElements().add(lArticle),
              genreSaisie: ObjetRequeteSaisieCasier.genreSaisie.saisieCasier,
            });
          }
        }
        break;
      }
      case EGenreEvenementDepotDoc.apresDepotDocument: {
        if (this.fenetreDepot) {
          this.fenetreDepot.afficher();
        }
        break;
      }
      default:
        break;
    }
  }
  surSelectionListeRubrique(aArticle, aSurInteractionUtilisateur) {
    let lRubrique = this.getRubriqueParDefaut();
    if (aSurInteractionUtilisateur) {
      this.resetFiltre();
    }
    if (aArticle) {
      const lEstRubriqueAffichee = !!this.getlisteRubrique().getElementParGenre(
        aArticle.getGenre(),
      );
      if (lEstRubriqueAffichee) {
        lRubrique = aArticle;
      }
    }
    this.effacerEcranDroite();
    this.setRubriqueSelectionne(lRubrique);
    this.modeAff = this.getModeAffichage();
    this.marquerSelectionListeRubrique();
    this.basculerEcran({ src: null, dest: 0 });
  }
  setRubriqueSelectionne(aRubrique) {
    if (aRubrique) {
      this.rubriqueSelectionne = aRubrique;
      this.genreRubriqueSelectionne = aRubrique.getGenre();
    }
  }
  surSelectionRessource(aParams) {
    const lParam = {
      liste: null,
      genre: aParams.genreRessource,
      avecDepotGroupe: aParams.avecDepotGroupe,
    };
    switch (aParams.genreRessource) {
      case EGenreRessource.Personnel:
        lParam.liste = aParams.article.listePersonnels;
        break;
      case EGenreRessource.Enseignant:
        lParam.liste = aParams.article.listeProfesseurs;
        break;
      case EGenreRessource.MaitreDeStage:
        lParam.liste = aParams.article.listeMaitreStage;
        break;
      case EGenreRessource.Responsable:
        lParam.liste = aParams.article.listeResponsables;
        lParam.sansFiltreSurEleve =
          this.avecDroitCommunicationToutesLesClasses();
        break;
      case EGenreRessource.Classe:
        lParam.liste = aParams.article.listeEquipesPedagogique;
        break;
      default:
        return;
    }
    if (lParam.liste) {
      this.requeteListePublics(lParam);
      this.courant.ligneCourante = aParams.article;
    }
  }
  surAjoutDocument(aParams) {
    if (aParams.article) {
      const lEstDocumentCloud =
        aParams.documentJoint.Genre === EGenreDocumentJoint.Cloud;
      this[lEstDocumentCloud ? "listeFichiersCloud" : "listeFichiers"].add(
        aParams.documentJoint,
      );
      const lRubrique = this.getRubriqueParTypeConsultation(
        aParams.typeConsultation,
      );
      this.setRubriqueSelectionne(lRubrique);
      this.requeteSaisie({
        typeConsultation: aParams.typeConsultation,
        listeLignes: new ObjetListeElements().add(aParams.article),
      });
    }
  }
  eventSurMenuContext(aParams) {
    switch (aParams.numeroMenu) {
      case DonneesListe_Casier.genreCommande.telecharger:
        this.telechargerDoc(aParams.article);
        break;
      case DonneesListe_Casier.genreCommande.consulter:
        if (
          this.modeAff === InterfaceCasier.modeAffichage.destinataire.saisie
        ) {
          if (!!aParams.article && !!aParams.article.estNonLu) {
            this.requeteSaisie({
              genreSaisie:
                ObjetRequeteSaisieCasier.genreSaisie.marquerLectureDocument,
              listeLignes: this.listeDocuments,
              documentLu: aParams.article,
            });
          }
        }
        break;
      case DonneesListe_Casier.genreCommande.marquerLus: {
        this.surMarquerLu(aParams.article);
        break;
      }
      case DonneesListe_Casier.genreCommande.marquerNonLus: {
        if (aParams.article && !aParams.article.estNonLu) {
          this.requeteSaisie({
            genreSaisie: ObjetRequeteSaisieCasier.genreSaisie.marquerNonLus,
            documents: new ObjetListeElements().add(aParams.article),
          });
        }
        break;
      }
      case DonneesListe_Casier.genreCommande.suppression: {
        this.surSuppression(aParams.article);
        break;
      }
      case DonneesListe_Casier.genreCommande.renommer:
        this.ouvrirFenetreRename({
          article: aParams.article,
          callbackRenameFile: () => {
            aParams.article.setEtat(EGenreEtat.Modification);
            this.requeteSaisie();
          },
        });
        break;
      case DonneesListe_Casier.genreCommande.remplacer:
        this.remplacerFichier(aParams.article, aParams.eltFichier);
        break;
      case DonneesListe_Casier.genreCommande.remplacerDocumentCloud:
        this.remplacerFichierCloud(aParams.article);
        break;
      case DonneesListe_Casier.genreCommande.modifier:
        this.ouvrirFenetreSaisieDocument({
          genreSaisie: EGenreEtat.Modification,
          document: aParams.article,
        });
        break;
      case DonneesListe_Casier.genreCommande.consulterLeMemo: {
        if (aParams.article.memo) {
          const lFenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre, {
            pere: this,
            initialiser(aFenetre) {
              aFenetre.setOptionsFenetre({
                largeurMin: 300,
                avecTailleSelonContenu: true,
                listeBoutons: [GTraductions.getValeur("Fermer")],
                titre: aParams.article.getLibelle(),
              });
            },
          });
          lFenetre.afficher(`<p>${aParams.article.memo}</p>`);
        }
        break;
      }
    }
  }
  ouvrirFenetreRename(aParams) {
    const lFenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre, {
      pere: this,
      evenement(aNumeroBouton, aParametres) {
        if (aNumeroBouton === 1 && aParams && aParams.article) {
          const lExtension = GChaine.extraireExtensionFichier(
            aParams.article.getLibelle(),
          );
          const lNom = `${aParametres.instance.libelleDocumentCasier}.${lExtension}`;
          aParams.article.Libelle = lNom;
          if (
            aParams.callbackRenameFile &&
            MethodesObjet.isFunction(aParams.callbackRenameFile)
          ) {
            aParams.callbackRenameFile();
          }
        }
      },
      initialiser(aFenetre) {
        aFenetre.setOptionsFenetre({
          avecTailleSelonContenu: true,
          largeur: 350,
          listeBoutons: [
            GTraductions.getValeur("Annuler"),
            GTraductions.getValeur("Valider"),
          ],
          titre: GTraductions.getValeur("Casier.renommer"),
        });
        aFenetre.libelleDocumentCasier =
          aParams && aParams.article
            ? GChaine.extraireNomFichier(aParams.article.getLibelle())
            : "";
        aFenetre.controleur.inputNom = {
          getValue() {
            return aFenetre.libelleDocumentCasier;
          },
          setValue(aValue) {
            aFenetre.libelleDocumentCasier = aValue;
          },
        };
      },
    });
    lFenetre.afficher(
      tag("input", {
        type: "text",
        "ie-model": "inputNom",
        class: ["round-style", "full-width"],
        placeholder:
          aParams && aParams.article ? aParams.article.getLibelle() : "",
      }),
    );
  }
  telechargerDoc(aArticle) {
    if (aArticle.documentCasier) {
      UtilitaireDocument.ouvrirUrl(aArticle.documentCasier);
    }
  }
  ouvrirFenetreSaisieDocument(aParams) {
    this.fenetreDepot = ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_DepotDocument,
      {
        pere: this,
        evenement: this.evenementFenetreDepot,
        initialiser(aFenetre) {
          aFenetre.setOptionsFenetre({
            largeur: 400,
            avecTailleSelonContenu: true,
            listeBoutons: [
              GTraductions.getValeur("Annuler"),
              GTraductions.getValeur("Valider"),
            ],
            titre: GTraductions.getValeur("Casier.diffuserDocument"),
          });
          aFenetre.setOptionsDepot({
            genreSaisie: aParams.genreSaisie || EGenreEtat.Creation,
            callbackApresDepot: aParams.avecOuverturePjAuLancement || false,
          });
        },
      },
    );
    const lTypeConsultation =
      aParams.typeConsultation >= 0
        ? aParams.typeConsultation
        : this.getTypeConsultation();
    const lRubriqueDuType =
      this.getRubriqueParTypeConsultation(lTypeConsultation);
    this.fenetreDepot.setDonnees({
      documentJoint: aParams.documentJoint || null,
      listeCategories:
        this.getListeCategorie(lRubriqueDuType && lRubriqueDuType.getGenre()) ||
        new ObjetListeElements(),
      document: aParams.document
        ? aParams.document
        : this.getDocumentCasierParDefaut(),
      typeConsultation: lTypeConsultation,
      avecFct: {
        suppressionDoc: this.avecFonctionnalite(
          InterfaceCasier.fonctionnalite.suppressionDoc,
        ),
      },
    });
    if (aParams.avecOuverturePjAuLancement) {
      this.fenetreDepot.surDeposerNouveau(
        this.getNomInstance(this.identDocuments),
      );
    } else {
      this.fenetreDepot.afficher();
    }
  }
  remplacerFichier(aArticle, aEltFichier) {
    if (aArticle && aEltFichier) {
      aArticle.setLibelle(aEltFichier.getLibelle());
      aArticle.documentCasier = aEltFichier;
      aArticle.setEtat(EGenreEtat.Modification);
      const lEstDocumentCloud = aEltFichier.Genre === EGenreDocumentJoint.Cloud;
      this[lEstDocumentCloud ? "listeFichiersCloud" : "listeFichiers"].add(
        aEltFichier,
      );
      this.requeteSaisie({
        typeConsultation: TypeConsultationDocumentCasier.CoDC_Destinataire,
        listeLignes: new ObjetListeElements().add(aArticle),
        callback: () => {
          Toast.afficher({
            msg: GTraductions.getValeur("Casier.documentBienRemplace"),
          });
          this.recupererDonnees();
        },
      });
    }
  }
  remplacerFichierCloud(aArticle) {
    if (aArticle) {
      const lOptions = {};
      const lEstCloud =
        aArticle.documentCasier.Genre === EGenreDocumentJoint.Cloud;
      const lEstFichier =
        aArticle.documentCasier.Genre === EGenreDocumentJoint.Fichier;
      lOptions.avecFichierDepuisCloud = lEstCloud;
      lOptions.avecFichierDepuisDocument = lEstFichier;
      if (lEstCloud) {
        lOptions.fenetreFichierCloud = { avecMonoSelection: true };
      }
      UtilitaireDocument.ouvrirFenetreChoixFichierCloud(
        (aParams) => this.remplacerFichier(aArticle, aParams.eltFichier),
        lOptions,
      );
    }
  }
  getListeDocument(aGenreRubrique) {
    return _getListeDocumentsEtCategories.call(this, aGenreRubrique).documents;
  }
  getListeCategorie(aGenreRubrique) {
    return _getListeDocumentsEtCategories.call(this, aGenreRubrique).categories;
  }
  getClasseSelectionne() {
    let lClasse;
    switch (this.genreRubriqueSelectionne) {
      case genreRubriqueCasier.collecteParEleve:
        lClasse = this.classeSelectionne;
        break;
    }
    return lClasse;
  }
  getListeClassesAvecDecalagePourCombo(aListe) {
    if (GEtatUtilisateur.pourPrimaire()) {
      aListe.parcourir((aClasse) => {
        if (aClasse.listeComposantes && aClasse.listeComposantes.count() > 0) {
          aClasse.listeComposantes.parcourir((aNiveau) => {
            const lClasseComposantes = aListe.getElementParNumero(
              aNiveau.getNumero(),
            );
            if (lClasseComposantes) {
              lClasseComposantes.ClassAffichage = "p-left-l";
              lClasseComposantes.pere = aClasse;
            }
          });
        }
      });
    }
    return aListe;
  }
  afficherListeRubrique(aIndiceASelectionner, aListe) {
    const lInstanceListe = this.getInstance(this.identListeRubrique);
    const lDonneesListeRubrique = aListe
      ? aListe
      : this.getDonneesListeRubrique();
    lInstanceListe.setDonnees(lDonneesListeRubrique);
    if (
      !this.optionsEcrans.avecBascule &&
      aIndiceASelectionner >= 0 &&
      lDonneesListeRubrique.Donnees.get(aIndiceASelectionner)
    ) {
      lInstanceListe.selectionnerLigne({
        avecEvenement: true,
        ligne: aIndiceASelectionner,
      });
    }
  }
  afficherEcranCentrale() {
    this.initDocuments(this.getInstance(this.identDocuments));
    const lListe = this.getListeDocument();
    const lParamsDonneesListe = {
      pere: this,
      evenement: this.eventSurMenuContext,
      avecFct: {
        suppressionDoc: this.avecFonctionnalite(
          InterfaceCasier.fonctionnalite.suppressionDoc,
        ),
        majDoc: this.avecFonctionnalite(
          InterfaceCasier.fonctionnalite.miseAJourDoc,
        ),
        consulterLeMemo: this.avecFonctionnalite(
          InterfaceCasier.fonctionnalite.consulterLeMemo,
        ),
        remplacerLeDocument: this.avecFonctionnalite(
          InterfaceCasier.fonctionnalite.remplacerFichier,
        ),
        telecharger: this.avecFonctionnalite(
          InterfaceCasier.fonctionnalite.telecharger,
        ),
        marquerLectureDocument: this.avecFonctionnalite(
          InterfaceCasier.fonctionnalite.marquerLectureDocument,
        ),
      },
      typeConsultation: this.getTypeConsultation(),
      listeClasses: this.listeClasses,
      listeCategories: this.getListeCategorie(),
      estCollecteParDocument: [
        genreRubriqueCasier.collecteParDocument,
      ].includes(this.genreRubriqueSelectionne),
      estCollecteParEleve: [genreRubriqueCasier.collecteParEleve].includes(
        this.genreRubriqueSelectionne,
      ),
      estCollecte: [
        genreRubriqueCasier.collecteParDocument,
        genreRubriqueCasier.collecteParEleve,
      ].includes(this.genreRubriqueSelectionne),
      classeSelectionne: this.getClasseSelectionne(),
      avecToutesLesClasses: [genreRubriqueCasier.collecteParDocument].includes(
        this.genreRubriqueSelectionne,
      ),
      callbackCollecte:
        [genreRubriqueCasier.collecteParDocument].includes(
          this.genreRubriqueSelectionne,
        ) && this.callbackCollecte.bind(this),
      getFiltreParDefaut: this.getFiltreParDefaut.bind(this),
      setFiltre: this.setFiltreParGenre.bind(this),
      getfiltre: this.getFiltreParGenre.bind(this),
      setIndiceClasse: this.setFiltreIndiceClasse.bind(this),
      setIndiceCategorie: this.setFiltreIndiceCategorie.bind(this),
      setCbNonLu: this.setFiltreCbNonLu.bind(this),
      rubriqueCasier: this.rubriqueSelectionne,
    };
    const lDonneesListeCasier = new DonneesListe_Casier(
      lListe,
      lParamsDonneesListe,
    );
    lDonneesListeCasier.setOptions({
      avecBoutonActionLigne: [
        genreRubriqueCasier.monCasier,
        genreRubriqueCasier.depositaire,
        genreRubriqueCasier.responsable,
      ].includes(this.genreRubriqueSelectionne),
    });
    lDonneesListeCasier.setOptionsCasier({
      avectri:
        genreRubriqueCasier.collecteParEleve !== this.genreRubriqueSelectionne,
      avecFiltreNonLus: [genreRubriqueCasier.monCasier].includes(
        this.genreRubriqueSelectionne,
      ),
      avecFiltreCategorie: [
        genreRubriqueCasier.monCasier,
        genreRubriqueCasier.depositaire,
        genreRubriqueCasier.responsable,
      ].includes(this.genreRubriqueSelectionne),
      avecFiltreClasse: [genreRubriqueCasier.collecteParDocument].includes(
        this.genreRubriqueSelectionne,
      ),
      avecComboClasse: [genreRubriqueCasier.collecteParDocument].includes(
        this.genreRubriqueSelectionne,
      ),
      avecFiltreElevesAvecDocADeposer: [
        genreRubriqueCasier.collecteParEleve,
      ].includes(this.genreRubriqueSelectionne),
      estDestinataire: [genreRubriqueCasier.monCasier].includes(
        this.genreRubriqueSelectionne,
      ),
      avecCouleurNature: [genreRubriqueCasier.responsable].includes(
        this.genreRubriqueSelectionne,
      ),
      avecIconeFormatFoc: [
        genreRubriqueCasier.monCasier,
        genreRubriqueCasier.depositaire,
        genreRubriqueCasier.responsable,
      ].includes(this.genreRubriqueSelectionne),
    });
    this.getInstance(this.identDocuments).setDonnees(lDonneesListeCasier);
  }
  construireAffichageEcranDroite() {
    const H = [];
    H.push(`<div id="${this.id.ctnEcranDroite}" style="height: 100%;">`);
    if (this.optionsEcrans.avecBascule) {
      H.push(
        `<div class="flex-contain p-all-l">`,
        `<ie-btnicon ie-model="btnRetour" class="icon_retour_mobile retour i-large"></ie-btnicon>`,
        `<h3 id="${this.id.titreEcranDroite}" class="flex-contain fluid-bloc justify-center flex-center"></h3>`,
        `</div>`,
      );
    }
    H.push(
      tag("div", {
        id: this.getNomInstance(this.identListeEleves),
        style: "height: 100%;",
      }),
    );
    H.push(`</div>`);
    return H.join("");
  }
  effacerEcranDroite() {
    const lId = this.getNomInstance(this.identListeEleves);
    if (lId) {
      GHtml.setHtml(this.getNomInstance(this.identListeEleves), "");
      this.avecEcranDroiteVisible = false;
    }
  }
  afficherEcranDroite() {
    let lLibelleTitre,
      lListe,
      lParams = {},
      lOptions = {};
    const lInstanceListeEleves = this.getInstance(this.identListeEleves);
    this.initListeEleves(lInstanceListeEleves);
    const lArticle = this.getCtxSelection({ niveauEcran: 0 });
    switch (this.genreRubriqueSelectionne) {
      case genreRubriqueCasier.collecteParDocument: {
        if (this.optionsEcrans.avecBascule) {
          lLibelleTitre = lArticle.getLibelle();
        }
        if (lArticle.listeEleves) {
          lListe = lArticle.listeEleves;
          lParams = {
            listeClasses: lArticle.listeClasses || new ObjetListeElements(),
            optionsCasier: { avecFiltreClasse: false },
          };
          lOptions = { avecSelection: false };
        }
        break;
      }
      case genreRubriqueCasier.collecteParEleve: {
        if (this.optionsEcrans.avecBascule) {
          lLibelleTitre = lArticle.getLibelle();
        }
        if (lArticle.listeDocuments) {
          lListe = lArticle.listeDocuments;
          lParams = {
            listeResponsables:
              lArticle.listeResponsables || new ObjetListeElements(),
          };
          lOptions = { avecSelection: false };
          if (lArticle.listeDocuments.count() === 0) {
            lInstanceListeEleves.setOptionsListe({ boutons: [] });
          }
        }
        break;
      }
      default:
        break;
    }
    if (lLibelleTitre) {
      GHtml.setHtml(this.id.titreEcranDroite, lLibelleTitre);
    }
    if (lInstanceListeEleves && lListe) {
      const lDonneesListe = new DonneesListe_CasierListeEleves(
        lListe,
        Object.assign(
          {
            estDepotParDocument:
              this.genreRubriqueSelectionne ===
              genreRubriqueCasier.collecteParDocument,
            avecDroitSaisieInfoSondages: this.avecDroitSaisieInfoSondages(),
          },
          lParams,
        ),
      );
      lDonneesListe.setOptions(lOptions);
      lInstanceListeEleves.setDonnees(lDonneesListe);
      this.avecEcranDroiteVisible = true;
    }
  }
  surMarquerLu(aArticle) {
    if (aArticle && aArticle.estNonLu) {
      this.requeteSaisie({
        genreSaisie: ObjetRequeteSaisieCasier.genreSaisie.marquerLus,
        documents: new ObjetListeElements().add(aArticle),
      });
    }
  }
  surCreationListe(aNodeBouton) {
    const _addFile = (aParamsAddFile, aDocument, aTypeConsultation) => {
      const lDocument = aDocument;
      lDocument.setLibelle(aParamsAddFile.eltFichier.getLibelle());
      lDocument.documentCasier = aParamsAddFile.eltFichier;
      const lDocumentJoint = aParamsAddFile.eltFichier;
      this.ouvrirFenetreSaisieDocument({
        documentJoint: lDocumentJoint,
        genreSaisie: EGenreEtat.Creation,
        document: lDocument,
        typeConsultation: aTypeConsultation,
      });
    };
    switch (this.genreRubriqueSelectionne) {
      case genreRubriqueCasier.monCasier: {
        if (aNodeBouton) {
          const lAvecBtnCreationResponsable = this.avecDroitSaisieResponsable();
          const lAvecBtnCreationIntervenant = this.avecDroitSaisieIntervenant();
          const lOuvrirFenetreCreationResponsable = () =>
            this.ouvrirFenetreSaisieDocument({
              genreSaisie: EGenreEtat.Creation,
              typeConsultation:
                TypeConsultationDocumentCasier.CoDC_DepResponsable,
              document: this.getDocumentCasierPourResponsable(),
              avecOuverturePjAuLancement: true,
            });
          const lOuvrirFenetreCreationIntervenant = () =>
            this.ouvrirFenetreSaisieDocument({
              genreSaisie: EGenreEtat.Creation,
              typeConsultation: TypeConsultationDocumentCasier.CoDC_Depositaire,
              document: this.getDocumentCasierPourIntervenant(),
              avecOuverturePjAuLancement: true,
            });
          if (lAvecBtnCreationResponsable && lAvecBtnCreationIntervenant) {
            const lPosBtn = GPosition.getClientRect(aNodeBouton);
            ObjetMenuContextuel.afficher({
              pere: this,
              id: { x: lPosBtn.left, y: lPosBtn.bottom + 10 },
              initCommandes(aMenu) {
                const lAvecCloudDisponible =
                  GEtatUtilisateur.avecCloudDisponibles();
                if (lAvecCloudDisponible) {
                  aMenu.add(
                    GTraductions.getValeur("Casier.IntervenantDiffusion"),
                    true,
                    () => lOuvrirFenetreCreationIntervenant(),
                    { icon: "icon_enseignant_prof" },
                  );
                  aMenu.add(
                    GTraductions.getValeur("Casier.responsablesDiffusion"),
                    true,
                    () => lOuvrirFenetreCreationResponsable(),
                    { icon: "icon_parents mix-icon_fiche_cours_partage" },
                  );
                } else {
                  aMenu.addSelecFile(
                    GTraductions.getValeur("Casier.IntervenantDiffusion"),
                    {
                      icon: "icon_enseignant_prof",
                      getOptionsSelecFile: () =>
                        UtilitaireDocument.getOptionsSelecFile(),
                      addFiles: (aParams) =>
                        _addFile(
                          aParams,
                          this.getDocumentCasierPourIntervenant(),
                          TypeConsultationDocumentCasier.CoDC_Depositaire,
                        ),
                    },
                  );
                  aMenu.addSelecFile(
                    GTraductions.getValeur("Casier.responsablesDiffusion"),
                    {
                      icon: "icon_parents mix-icon_fiche_cours_partage",
                      getOptionsSelecFile: () =>
                        UtilitaireDocument.getOptionsSelecFile(),
                      addFiles: (aParams) =>
                        _addFile(
                          aParams,
                          this.getDocumentCasierPourResponsable(),
                          TypeConsultationDocumentCasier.CoDC_DepResponsable,
                        ),
                    },
                  );
                }
              },
            });
          } else if (lAvecBtnCreationIntervenant) {
            lOuvrirFenetreCreationIntervenant();
          } else if (lAvecBtnCreationResponsable) {
            lOuvrirFenetreCreationResponsable();
          } else {
          }
        }
        break;
      }
      default:
        this.ouvrirFenetreSaisieDocument({
          genreSaisie: EGenreEtat.Creation,
          avecOuverturePjAuLancement: true,
        });
        break;
    }
  }
  surSuppression(aArticle) {
    return new Promise((aResolve) => {
      GApplication.getMessage()
        .afficher({
          type: EGenreBoiteMessage.Confirmation,
          message: this.getMessageSuppressionConfirmation(
            aArticle.getLibelle(),
          ),
        })
        .then((aAccepte) => {
          if (aAccepte !== EGenreAction.Valider) {
            return;
          }
          this.fenetreDepot;
          aArticle.setEtat(EGenreEtat.Suppression);
          this.requeteSaisie({
            listeLignes: new ObjetListeElements().add(aArticle),
            genreSaisie: ObjetRequeteSaisieCasier.genreSaisie.saisieCasier,
          });
          aResolve();
        });
    });
  }
  composeFiltre() {
    const lFiltres = new ObjetListeElements();
    for (const lProp in genreRubriqueCasier) {
      lFiltres.add(
        new ObjetElement({
          Libelle: lProp,
          Genre: genreRubriqueCasier[lProp],
          filtre: this.getFiltreParDefaut(genreRubriqueCasier[lProp]),
        }),
      );
    }
    return lFiltres;
  }
  setFiltreParGenre(aValeurFiltre, aGenreRubriqueCasier) {
    if (!this.filtres) {
      this.filtres = this.composeFiltre();
    }
    const lFiltre = this.filtres.getElementParGenre(
      aGenreRubriqueCasier >= 0
        ? aGenreRubriqueCasier
        : this.genreRubriqueSelectionne,
    );
    if (lFiltre) {
      lFiltre.filtre = aValeurFiltre;
    }
  }
  resetFiltre() {
    this.filtres = this.composeFiltre();
    this.classeSelectionne = undefined;
  }
  getFiltreParGenre(aGenreRubriqueCasier) {
    if (!this.filtres) {
      this.filtres = this.composeFiltre();
    }
    const lFiltre = this.filtres.getElementParGenre(
      aGenreRubriqueCasier >= 0
        ? aGenreRubriqueCasier
        : this.genreRubriqueSelectionne,
    );
    return (lFiltre && lFiltre.filtre) || null;
  }
  getFiltreParDefaut(aGenreRubriqueCasier) {
    const lFiltre = {};
    switch (
      aGenreRubriqueCasier >= 0
        ? aGenreRubriqueCasier
        : this.genreRubriqueSelectionne
    ) {
      case genreRubriqueCasier.monCasier:
        lFiltre.cbNonLu = false;
        lFiltre.indiceCategorie = 0;
        break;
      case genreRubriqueCasier.depositaire:
        lFiltre.indiceCategorie = 0;
        break;
      case genreRubriqueCasier.responsable:
        lFiltre.indiceCategorie = 0;
        break;
      case genreRubriqueCasier.collecteParDocument:
        lFiltre.indiceClasse = 0;
        break;
      case genreRubriqueCasier.collecteParEleve:
        lFiltre.indiceClasse = -1;
        break;
    }
    return lFiltre;
  }
  setFiltreIndiceCategorie(aValeur, aGenreRubriqueCasier) {
    const lFiltre = this.getFiltreParGenre(aGenreRubriqueCasier);
    lFiltre.indiceCategorie = aValeur;
  }
  setFiltreIndiceClasse(aValeur, aGenreRubriqueCasier) {
    const lFiltre = this.getFiltreParGenre(aGenreRubriqueCasier);
    lFiltre.indiceClasse = aValeur;
  }
  setFiltreCbNonLu(aValeur, aGenreRubriqueCasier) {
    const lFiltre = this.getFiltreParGenre(aGenreRubriqueCasier);
    lFiltre.cbNonLu = aValeur;
  }
  estModeDestinataire(aModeAff = this.modeAff) {
    return (
      aModeAff === InterfaceCasier.modeAffichage.destinataire.consultation ||
      aModeAff === InterfaceCasier.modeAffichage.destinataire.saisie
    );
  }
  avecDroitSaisieIntervenant() {
    return GApplication.droits.get(
      TypeDroits.casierNumerique.avecSaisieDocumentsCasiersIntervenant,
    );
  }
  avecDroitSaisieResponsable() {
    return GApplication.droits.get(
      TypeDroits.casierNumerique.avecSaisieDocumentsCasiersResponsable,
    );
  }
  avecDroitDocumentEleve() {
    return GApplication.droits.get(
      TypeDroits.casierNumerique.avecAccesALaListeDesDocumentEleve,
    );
  }
  avecDroitCommunicationToutesLesClasses() {
    return GApplication.droits.get(TypeDroits.communication.toutesClasses);
  }
  avecDroitSaisieInfoSondages() {
    return GApplication.droits.get(TypeDroits.actualite.avecSaisieActualite);
  }
  avecFonctionnalite(aFonctionnalite) {
    switch (this.modeAff) {
      case InterfaceCasier.modeAffichage.destinataire.consultation:
      case InterfaceCasier.modeAffichage.depositaire.consultation:
      case InterfaceCasier.modeAffichage.responsable.consultation:
        return false;
      case InterfaceCasier.modeAffichage.depositaire.saisie:
      case InterfaceCasier.modeAffichage.responsable.saisie:
        return ![
          InterfaceCasier.fonctionnalite.notificationOuvertureDoc,
          InterfaceCasier.fonctionnalite.consulterLeMemo,
          InterfaceCasier.fonctionnalite.remplacerFichier,
        ].includes(aFonctionnalite);
      case InterfaceCasier.modeAffichage.destinataire.saisie:
        return [
          InterfaceCasier.fonctionnalite.notificationOuvertureDoc,
          InterfaceCasier.fonctionnalite.consulterLeMemo,
          InterfaceCasier.fonctionnalite.marquerLectureDocument,
          InterfaceCasier.fonctionnalite.suppressionDoc,
          InterfaceCasier.fonctionnalite.creationDoc,
          InterfaceCasier.fonctionnalite.remplacerFichier,
        ].includes(aFonctionnalite);
      case InterfaceCasier.modeAffichage.depositaire.saisieRestreinte:
      case InterfaceCasier.modeAffichage.responsable.saisieRestreinte:
        return (
          aFonctionnalite === InterfaceCasier.fonctionnalite.suppressionDoc
        );
      case InterfaceCasier.modeAffichage.collecte.parDocument:
      case InterfaceCasier.modeAffichage.collecte.parEleve:
        return false;
    }
  }
  getOptionsSelecFile() {
    return {
      maxSize: GApplication.droits.get(
        TypeDroits.tailleMaxDocJointEtablissement,
      ),
      multiple: false,
    };
  }
  getModeAffichage() {
    const lEstEnConsultation = GApplication.droits.get(
      TypeDroits.estEnConsultation,
    );
    switch (this.genreRubriqueSelectionne) {
      case genreRubriqueCasier.monCasier:
        if (lEstEnConsultation) {
          return InterfaceCasier.modeAffichage.destinataire.consultation;
        } else {
          return InterfaceCasier.modeAffichage.destinataire.saisie;
        }
      case genreRubriqueCasier.depositaire:
        if (lEstEnConsultation) {
          return InterfaceCasier.modeAffichage.depositaire.consultation;
        }
        if (this.avecDroitSaisieIntervenant()) {
          return InterfaceCasier.modeAffichage.depositaire.saisie;
        } else {
          return InterfaceCasier.modeAffichage.depositaire.saisieRestreinte;
        }
      case genreRubriqueCasier.responsable:
        if (lEstEnConsultation) {
          return InterfaceCasier.modeAffichage.responsable.consultation;
        }
        if (this.avecDroitSaisieResponsable()) {
          return InterfaceCasier.modeAffichage.responsable.saisie;
        } else {
          return InterfaceCasier.modeAffichage.responsable.saisieRestreinte;
        }
      case genreRubriqueCasier.collecteParDocument:
        return InterfaceCasier.modeAffichage.collecte.parDocument;
      case genreRubriqueCasier.collecteParEleve:
        return InterfaceCasier.modeAffichage.collecte.parEleve;
      default:
        break;
    }
  }
  getDonneesListeRubrique(aListe) {
    return new DonneesListe_RubriqueCasier(
      aListe && aListe.parcourir ? aListe : this.listeRubrique,
    );
  }
  getDocumentCasierParDefaut() {
    switch (this.genreRubriqueSelectionne) {
      case genreRubriqueCasier.depositaire:
        return this.getDocumentCasierPourIntervenant();
      case genreRubriqueCasier.responsable:
        return this.getDocumentCasierPourResponsable();
      default:
        break;
    }
  }
  getDocumentCasierPourIntervenant() {
    const lObj = {
      Libelle: "",
      hintNomDocument: "",
      documentCasier: null,
      categorie: null,
      memo: "",
      infoPersonnel: 0,
      hintPersonnel: "",
      listePersonnels: new ObjetListeElements(),
      infoProfesseur: 0,
      hintProfesseur: "",
      listeProfesseurs: new ObjetListeElements(),
      infoMaitreDeStage: 0,
      hintMaitreDeStage: "",
      listeMaitreStage: new ObjetListeElements(),
      infoEquipePedagogique: 0,
      listeEquipesPedagogique: new ObjetListeElements(),
      date: new Date(),
      estModifiableParDestinataires: false,
      avecEnvoiGroupePersonnel: false,
      avecEnvoiGroupeProfesseur: false,
      avecEnvoiGroupeMaitreDeStage: false,
    };
    if (GEtatUtilisateur.pourPrimaire()) {
      lObj.avecEnvoiDirecteur = false;
    }
    return new ObjetElement(lObj);
  }
  getDocumentCasierPourResponsable() {
    return new ObjetElement({
      Libelle: "",
      documentCasier: null,
      categorie: null,
      memo: "",
      dateDebutPublication: null,
      dateFinPublication: null,
      date: new Date(),
      infoResponsable: 0,
      listeResponsables: new ObjetListeElements(),
      estModifiableParDestinataires: false,
      avecEnvoiGroupeResponsable: false,
      dateDebut: null,
      dateFin: null,
    });
  }
  getlisteRubrique() {
    const lArr = [
      {
        Libelle: GTraductions.getValeur("Casier.monCasier"),
        icon: "icon_inbox",
        Genre: genreRubriqueCasier.monCasier,
        typeConsultation: TypeConsultationDocumentCasier.CoDC_Destinataire,
        compteur: this.listeDocumentsMonCasier
          .getListeElements((aI) => aI.estNonLu)
          .count(),
      },
    ];
    const lAvecDocumentDejaDeposesDestinataire =
      this.avecDocumentsDejaDeposes &&
      this.listeDocumentsDepositaire &&
      this.listeDocumentsDepositaire.count() > 0;
    const lAvecDocumentDejaDeposesResponsable =
      this.avecDocumentsDejaDeposes &&
      this.listeDocumentsResponsable &&
      this.listeDocumentsResponsable.count() > 0;
    if (
      lAvecDocumentDejaDeposesDestinataire ||
      lAvecDocumentDejaDeposesResponsable ||
      this.avecDroitSaisieIntervenant() ||
      this.avecDroitSaisieResponsable()
    ) {
      const lLigneSeparateur = {
        Libelle: GTraductions.getValeur("Casier.diffusion"),
        icon: "icon_envoyer",
        Genre: null,
        estLigneOff: true,
      };
      lArr.push(lLigneSeparateur);
      if (
        this.avecDroitSaisieIntervenant() ||
        lAvecDocumentDejaDeposesDestinataire
      ) {
        const lCleTrad = IE.estMobile
          ? GTraductions.getValeur("Casier.IntervenantDiffusionSansBr")
          : GTraductions.getValeur("Casier.Intervenant");
        const lLibelle = tag(
          "div",
          { class: ["WhiteSpaceNormal", "ellipsis-multilignes"] },
          `${lCleTrad}`,
        );
        lArr.push({
          Libelle: lLibelle,
          icon: "icon_enseignant_prof",
          Genre: genreRubriqueCasier.depositaire,
          typeConsultation: TypeConsultationDocumentCasier.CoDC_Depositaire,
          pere: lLigneSeparateur,
        });
      }
      if (
        this.avecDroitSaisieResponsable() ||
        lAvecDocumentDejaDeposesResponsable
      ) {
        const lCleTrad = IE.estMobile
          ? GTraductions.getValeur("Casier.responsablesDiffusion")
          : GTraductions.getValeur("Casier.responsables");
        lArr.push({
          Libelle: lCleTrad,
          icon: "icon_parents mix-icon_fiche_cours_partage",
          Genre: genreRubriqueCasier.responsable,
          typeConsultation: TypeConsultationDocumentCasier.CoDC_DepResponsable,
          pere: lLigneSeparateur,
        });
      }
    }
    if (this.avecDroitDocumentEleve()) {
      const lLigneSeparateur = {
        Libelle: GTraductions.getValeur("Casier.collecte"),
        icon: "icon_arrow_down",
        Genre: null,
        estLigneOff: true,
      };
      lArr.push(lLigneSeparateur);
      lArr.push({
        Libelle: GTraductions.getValeur("Casier.documentsACollecter"),
        icon: "icon_inbox mix-icon_arrow_down",
        Genre: genreRubriqueCasier.collecteParDocument,
        pere: lLigneSeparateur,
      });
      lArr.push({
        Libelle: GTraductions.getValeur("Casier.recapitulatifParEleve"),
        icon: "icon_eleve mix-icon_arrow_down",
        Genre: genreRubriqueCasier.collecteParEleve,
        pere: lLigneSeparateur,
      });
    }
    const lListe = new ObjetListeElements();
    lArr.map((aObjet) => {
      if (aObjet.pere) {
        aObjet.pere = new ObjetElement(aObjet.pere);
      }
      lListe.add(new ObjetElement(aObjet));
    });
    return lListe;
  }
  getRubriqueParDefaut() {
    return this.getlisteRubrique().get(0);
  }
  getMessageSuppressionConfirmation(aLibelle) {
    return this.estModeDestinataire(this.modeAff)
      ? GTraductions.getValeur("Casier.msgConfirmSupprDest", [aLibelle])
      : GTraductions.getValeur("Casier.msgConfirmSupprDepositaire", [aLibelle]);
  }
  getTypeConsultation() {
    const lRubrique = this.listeRubrique.getElementParGenre(
      this.genreRubriqueSelectionne,
    );
    if (MethodesObjet.isNumeric(lRubrique.typeConsultation)) {
      return lRubrique.typeConsultation;
    }
    return null;
  }
  getListeClasses(aListeDocuments) {
    let lListeClasse = new ObjetListeElements();
    if (aListeDocuments) {
      aListeDocuments.parcourir((aDoc) => {
        if (aDoc) {
          aDoc.listeClasses.parcourir((aClasse) => {
            if (aClasse) {
              const lLaClasseEstPasDansLaListe =
                !lListeClasse.getElementParNumero(aClasse.getNumero());
              if (lLaClasseEstPasDansLaListe) {
                lListeClasse.add(aClasse);
              }
            }
          });
        }
      });
      lListeClasse = this.getListeClassesAvecDecalagePourCombo(lListeClasse);
    }
    lListeClasse.setTri([
      ObjetTri.init((D) => (!!D.pere ? D.pere.getLibelle() : D.getLibelle())),
      ObjetTri.init((D) => !!D.pere),
      ObjetTri.init("Libelle"),
    ]);
    lListeClasse.trier();
    return lListeClasse;
  }
  getMessageContenuVide() {
    switch (this.genreRubriqueSelectionne) {
      case genreRubriqueCasier.collecteParEleve:
        return this.classeSelectionne
          ? GTraductions.getValeur("Casier.aucunDocumentACellecter")
          : GTraductions.getValeur("Casier.selectionnezUneClasse");
      default:
        return GTraductions.getValeur("Casier.msgCasierVide");
    }
  }
}
InterfaceCasier.fonctionnalite = {
  creationDoc: 1,
  suppressionDoc: 2,
  miseAJourDoc: 3,
  notificationOuvertureDoc: 4,
  telecharger: 8,
  consulterLeMemo: 9,
  marquerLectureDocument: 10,
};
InterfaceCasier.modeAffichage = {
  depositaire: { saisie: 1, saisieRestreinte: 2, consultation: 3 },
  destinataire: { saisie: 4, consultation: 5 },
  responsable: { saisie: 6, saisieRestreinte: 7, consultation: 8 },
  collecte: { parDocument: 9, parEleve: 10 },
};
class DonneesListe_RubriqueCasier extends ObjetDonneesListeFlatDesign {
  constructor(aListe, aParams) {
    super(aListe);
    this.parametres = Object.assign({}, aParams);
    this.setOptions({
      avecTri: false,
      avecDeselectionSurNonSelectionnable: false,
      flatDesignMinimal: true,
      avecBoutonActionLigne: false,
      avecSelection: true,
      avecEvnt_Selection: true,
      avecIndentationSousInterTitre: true,
    });
  }
  getTitreZonePrincipale(aParams) {
    return aParams.article.getLibelle();
  }
  avecSelection(aParams) {
    return !aParams.article.nonSelectionnable && !aParams.article.estLigneOff;
  }
  getIconeGaucheContenuFormate(aParams) {
    return aParams.article.icon || "";
  }
  avecSeparateurLigneHautFlatdesign(aParamsCellule, aParamsCellulePrec) {
    return (
      super.avecSeparateurLigneHautFlatdesign(
        aParamsCellule,
        aParamsCellulePrec,
      ) && !aParamsCellulePrec.article.estLigneOff
    );
  }
  avecEvenementSelection(aParams) {
    return !aParams.article.estLigneOff;
  }
  avecEvenementSelectionClick(aParams) {
    return this.avecEvenementSelection(aParams);
  }
  getZoneComplementaire(aParams) {
    if (aParams.article.compteur >= 0) {
      return `<div class="ie-texte">${aParams.article.compteur}</div>`;
    }
    return "";
  }
}
function _getListeDocumentsEtCategories(aGenreRubrique) {
  const lObj = {
    categories: new ObjetListeElements(),
    documents: new ObjetListeElements(),
  };
  const lGenre = aGenreRubrique
    ? aGenreRubrique
    : this.genreRubriqueSelectionne;
  switch (lGenre) {
    case genreRubriqueCasier.monCasier:
      lObj.categories = this.listeCategoriesMonCasier;
      lObj.documents =
        UtilitaireDocumentATelecharger.construireListeCumulParCategorie(
          this.listeDocumentsMonCasier,
        );
      break;
    case genreRubriqueCasier.depositaire:
      lObj.categories = this.listeCategoriesDepositaire;
      lObj.documents =
        UtilitaireDocumentATelecharger.construireListeCumulParCategorie(
          this.listeDocumentsDepositaire,
        );
      break;
    case genreRubriqueCasier.responsable:
      lObj.categories = this.listeCategoriesResponsable;
      lObj.documents =
        UtilitaireDocumentATelecharger.construireListeCumulParCategorie(
          this.listeDocumentsResponsable,
        );
      break;
    case genreRubriqueCasier.collecteParDocument:
      lObj.documents = this.listeCollecteParDocuments;
      break;
    case genreRubriqueCasier.collecteParEleve:
      if (this.listeCollecteParEleves) {
        lObj.documents = this.listeCollecteParEleves;
      }
      break;
  }
  if (lObj.categories) {
    lObj.categories.setTri(ObjetTri.init("Libelle"));
    lObj.categories.trier();
  }
  return lObj;
}
module.exports = { InterfaceCasier };
