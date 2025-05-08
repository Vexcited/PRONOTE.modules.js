exports.DonneesListe_QCM = void 0;
const Enumere_CommandeMenu_1 = require("Enumere_CommandeMenu");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const UtilitaireQCM_1 = require("UtilitaireQCM");
class DonneesListe_QCM extends ObjetDonneesListe_1.ObjetDonneesListe {
  constructor(aParam, aOptions, aDroits) {
    super(aParam.donnees);
    this.evenement = aParam.evenement;
    this.avecService = aParam.avecServices;
    this.avecServicesEvaluation = !!aParam.avecServicesEvaluation;
    this.optionsQCM = aOptions;
    this.droits = aDroits;
    this._genreQCM = aParam.genreQCM;
    this._genreExecQCM = aParam.genreExecQCM;
    this.setOptions({
      avecDeploiement: true,
      avecEvnt_Selection: true,
      avecEvnt_Creation: true,
      avecEvnt_Suppression: true,
      avecContenuTronque: true,
      avecEvnt_ApresSuppression: this.optionsQCM.avecValidationAuto,
    });
    this.creerIndexUnique([this._fctPourTri.bind(this)]);
  }
  _fctPourTri(D) {
    const lEstExecutionQCM = this._estUneExecQCM(D.getGenre());
    return lEstExecutionQCM ? null : D.getLibelle();
  }
  _estUnQCM(aGenre) {
    return aGenre === this._genreQCM;
  }
  _estUneExecQCM(aGenre) {
    return aGenre === this._genreExecQCM;
  }
  _estUtilisateurProprietaireDuQCM(aEltQCM) {
    const lEltProprietaire = aEltQCM.proprietaire;
    if (lEltProprietaire !== null && lEltProprietaire !== undefined) {
      return (
        GEtatUtilisateur.getMembre().getNumero() === lEltProprietaire.Numero
      );
    }
    return false;
  }
  getVisible(D) {
    return D.visible !== false;
  }
  avecDeploiementSurColonne(aParams) {
    return aParams.colonne === 0;
  }
  avecImageSurColonneDeploiement(aParams) {
    return aParams.article.estUnDeploiement && aParams.article.nbExecution > 0;
  }
  avecEventDeploiementSurCellule() {
    return false;
  }
  avecEdition(aParams) {
    let lResult = false;
    if (this._estUnQCM(aParams.article.getGenre())) {
      if (
        this.optionsQCM.verrouilleEditionMatiereAvecCompetences &&
        aParams.idColonne === DonneesListe_QCM.colonnes.matiere &&
        aParams.article &&
        (aParams.article.nbCompetencesTotal > 0 ||
          aParams.article.estVerrouille)
      ) {
        return false;
      }
      lResult =
        aParams.idColonne !== DonneesListe_QCM.colonnes.nbElementsCompetences;
    }
    if (lResult === true && this.optionsQCM.estModeCollab) {
      if (
        aParams.article.avecVerrouCollab !== null &&
        aParams.article.avecVerrouCollab !== undefined
      ) {
        lResult = !aParams.article.avecVerrouCollab;
      }
      if (
        lResult === true &&
        aParams.idColonne === DonneesListe_QCM.colonnes.statutPrive
      ) {
        lResult = this._estUtilisateurProprietaireDuQCM(aParams.article);
      }
    }
    return lResult;
  }
  avecEvenementEdition(aParams) {
    if (
      aParams.idColonne === DonneesListe_QCM.colonnes.categorie ||
      aParams.idColonne === DonneesListe_QCM.colonnes.QCM ||
      aParams.idColonne === DonneesListe_QCM.colonnes.matiere ||
      aParams.idColonne === DonneesListe_QCM.colonnes.themes ||
      aParams.idColonne === DonneesListe_QCM.colonnes.niveau ||
      aParams.idColonne === DonneesListe_QCM.colonnes.proprietaire ||
      aParams.idColonne === DonneesListe_QCM.colonnes.contributeurs ||
      aParams.idColonne === DonneesListe_QCM.colonnes.statutPrive
    ) {
      return this.avecEdition(aParams);
    }
    return false;
  }
  avecSuppression(aParams) {
    return (
      this._estUnQCM(aParams.article.Genre) && !aParams.article.estVerrouille
    );
  }
  getColonneDeFusion(aParams) {
    if (this._estUneExecQCM(aParams.article.getGenre())) {
      return DonneesListe_QCM.colonnes.QCM;
    }
    return null;
  }
  getCouleurCellule(aParams) {
    if (this._estUneExecQCM(aParams.article.getGenre())) {
      return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
    }
    return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Deploiement;
  }
  getMessageSuppressionConfirmation(D) {
    const lEstProprietaire = this.optionsQCM.estModeCollab
      ? this._estUtilisateurProprietaireDuQCM(D)
      : false;
    return this.optionsQCM.estModeCollab
      ? lEstProprietaire
        ? ObjetTraduction_1.GTraductions.getValeur(
            "QCM_Divers.msgSupprQCMCollabProprio",
          )
        : ObjetTraduction_1.GTraductions.getValeur(
            "QCM_Divers.msgSupprQCMCollabContrib",
          )
      : ObjetTraduction_1.GTraductions.getValeur("liste.suppressionSelection");
  }
  avecMenuContextuel(aParams) {
    if (aParams.ligne === -1) {
      return (
        !this.optionsQCM.estModeCollab && this.optionsQCM.avecMenuContexteListe
      );
    }
    return true;
  }
  _ajouterCommandesAjoutQuestions(
    aMenuParent,
    aParametres,
    aAvecLibelleLong = false,
  ) {
    let lLibelleCommande;
    const lPrefixeLibelleLong =
      ObjetTraduction_1.GTraductions.getValeur(
        "SaisieQCM.AjouterDesQuestions",
      ) + " ";
    lLibelleCommande = aAvecLibelleLong ? lPrefixeLibelleLong : "";
    lLibelleCommande += ObjetTraduction_1.GTraductions.getValeur(
      "QCM_Divers.MnuAjoutQuestionsPerso",
    );
    aMenuParent.addCommande(
      DonneesListe_QCM.GenreCommande.AjoutQuestionsPerso,
      lLibelleCommande,
      this.avecEdition(aParametres) &&
        !aParametres.nonEditable &&
        !aParametres.article.estVerrouille,
    );
    if (this.optionsQCM.avecCollaboratif) {
      lLibelleCommande = aAvecLibelleLong ? lPrefixeLibelleLong : "";
      lLibelleCommande += ObjetTraduction_1.GTraductions.getValeur(
        "QCM_Divers.MnuAjoutQuestionsCollab",
      );
      aMenuParent.addCommande(
        DonneesListe_QCM.GenreCommande.AjoutQuestionsCollab,
        lLibelleCommande,
        this.avecEdition(aParametres) &&
          !aParametres.nonEditable &&
          !aParametres.article.estVerrouille,
      );
    }
    if (this.optionsQCM.avecImportBiblio) {
      lLibelleCommande = aAvecLibelleLong ? lPrefixeLibelleLong : "";
      lLibelleCommande += ObjetTraduction_1.GTraductions.getValeur(
        "QCM_Divers.MnuImportQCMBiblioEtablissement",
      );
      aMenuParent.addCommande(
        DonneesListe_QCM.GenreCommande.AjoutQuestionsEtab,
        lLibelleCommande,
        this.avecEdition(aParametres) &&
          !aParametres.nonEditable &&
          !aParametres.article.estVerrouille,
      );
    }
    if (this.optionsQCM.avecImportNathan) {
      lLibelleCommande = aAvecLibelleLong ? lPrefixeLibelleLong : "";
      lLibelleCommande += ObjetTraduction_1.GTraductions.getValeur(
        "QCM_Divers.MnuImportQCMBiblioNathan",
      );
      aMenuParent.addCommande(
        DonneesListe_QCM.GenreCommande.AjoutQuestionsNathan,
        lLibelleCommande,
        this.avecEdition(aParametres) &&
          !aParametres.nonEditable &&
          !aParametres.article.estVerrouille,
      );
    }
  }
  _ajouterCommandesImport(aMenuParent, aParametresMenuContextuel) {
    let lLibelleCommande;
    if (this.optionsQCM.avecImportBiblio) {
      lLibelleCommande = ObjetTraduction_1.GTraductions.getValeur(
        "QCM_Divers.MnuImportQCMBiblioEtablissement",
      );
      aMenuParent.addCommande(
        DonneesListe_QCM.GenreCommande.ImportQCMBiblio,
        lLibelleCommande,
        !aParametresMenuContextuel.nonEditable,
      );
    }
    if (this.optionsQCM.avecImportNathan) {
      lLibelleCommande = ObjetTraduction_1.GTraductions.getValeur(
        "QCM_Divers.MnuImportQCMBiblioNathan",
      );
      aMenuParent.addCommande(
        DonneesListe_QCM.GenreCommande.ImportQCMNathan,
        lLibelleCommande,
        !aParametresMenuContextuel.nonEditable,
      );
    }
    if (this.optionsQCM.avecImportFichier) {
      lLibelleCommande = ObjetTraduction_1.GTraductions.getValeur(
        "QCM_Divers.MnuImportQCMFichier",
      );
      const lThis = this;
      const aExtend = {
        estSelecFile: true,
        getOptionsSelecFile: function () {
          return { maxSize: lThis.optionsQCM.maxSize };
        },
        addFiles: function (aParametresInput) {
          lThis.evenement(
            DonneesListe_QCM.GenreCommande.ImportQCMFichier,
            null,
            aParametresInput,
          );
        },
      };
      const lElement = aMenuParent.addCommande(
        DonneesListe_QCM.GenreCommande.ImportQCMFichier,
        lLibelleCommande,
        true,
      );
      lElement.setCallback(null);
      if (aExtend) {
        $.extend(lElement, aExtend);
      }
    }
  }
  initialisationObjetContextuel(aParametres) {
    if (!aParametres.menuContextuel) {
      return;
    }
    const lThis = this;
    if (aParametres.ligne === -1 || !aParametres.article) {
      const lLibelleCreer = this.optionsQCM.estModeCollab
        ? ObjetTraduction_1.GTraductions.getValeur(
            "SaisieQCM.LigneNouveauQCMCollab",
          )
        : ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.LigneNouveauQCM");
      aParametres.menuContextuel.addCommande(
        Enumere_CommandeMenu_1.EGenreCommandeMenu.Creation,
        lLibelleCreer,
        true,
      );
      if (!this.optionsQCM.estModeCollab) {
        aParametres.menuContextuel.addSousMenu(
          ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.ImportQCMs"),
          (aInstanceItemMenu) => {
            lThis._ajouterCommandesImport(aInstanceItemMenu, aParametres);
          },
        );
      }
    } else {
      aParametres.menuContextuel.addSousMenu(
        ObjetTraduction_1.GTraductions.getValeur(
          "SaisieQCM.AjouterDesQuestions",
        ),
        (aInstanceItemMenu) => {
          this._ajouterCommandesAjoutQuestions(aInstanceItemMenu, aParametres);
        },
      );
      aParametres.menuContextuel.addCommande(
        Enumere_CommandeMenu_1.EGenreCommandeMenu.Edition,
        ObjetTraduction_1.GTraductions.getValeur("liste.modifier"),
        this.avecEdition(aParametres) && !aParametres.nonEditable,
      );
      if (this._estUnQCM(aParametres.article.getGenre())) {
        aParametres.menuContextuel.addCommande(
          DonneesListe_QCM.GenreCommande.CopierQCM,
          ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.DupliquerQCM"),
          !aParametres.nonEditable,
        );
      }
      if (this.optionsQCM.estModeCollab) {
        aParametres.menuContextuel.addCommande(
          Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression,
          ObjetTraduction_1.GTraductions.getValeur("liste.supprimer"),
          !aParametres.article.avecVerrouCollab,
        );
      } else {
        if (this.avecSuppression(aParametres)) {
          aParametres.menuContextuel.addCommande(
            Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression,
            ObjetTraduction_1.GTraductions.getValeur("liste.supprimer"),
            !aParametres.nonEditable,
          );
        } else {
          aParametres.menuContextuel.addCommande(
            DonneesListe_QCM.GenreCommande.SuppressionServeur,
            ObjetTraduction_1.GTraductions.getValeur("liste.supprimer"),
            !aParametres.nonEditable,
          );
        }
      }
      if (
        this._estUnQCM(aParametres.article.getGenre()) &&
        this.optionsQCM.avecCopie &&
        this.optionsQCM.avecCollaboratif
      ) {
        aParametres.menuContextuel.addSeparateur();
        aParametres.menuContextuel.addCommande(
          DonneesListe_QCM.GenreCommande.CopierQCMVers,
          this.optionsQCM.estModeCollab
            ? ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.CopierQCM")
            : ObjetTraduction_1.GTraductions.getValeur(
                "QCM_Divers.CopierDansQCMCollab",
              ),
          !aParametres.nonEditable,
        );
      }
      if (
        (!this._estUnQCM(aParametres.article.getGenre()) ||
          (aParametres.article.nbQuestionsTotal > 0 &&
            aParametres.article.getEtat() ===
              Enumere_Etat_1.EGenreEtat.Aucun)) &&
        this.optionsQCM.avecVisuEleves &&
        this.optionsQCM.avecMenuContexteListe
      ) {
        aParametres.menuContextuel.addCommande(
          DonneesListe_QCM.GenreCommande.VisuEleve,
          ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.VisuEleve"),
          !aParametres.nonEditable && !aParametres.article.enEtatActualisation,
        );
      }
      aParametres.menuContextuel.avecSeparateurSurSuivant();
      if (
        !this.optionsQCM.estModeCollab &&
        this.optionsQCM.avecMenuContexteListe
      ) {
        aParametres.menuContextuel.addSousMenu(
          ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.ImportQCMs"),
          (aInstanceItemMenu) => {
            lThis._ajouterCommandesImport(aInstanceItemMenu, aParametres);
          },
        );
      }
      if (
        this._estUnQCM(aParametres.article.getGenre()) &&
        this.optionsQCM.avecMenuContexteListe &&
        aParametres.article.nbQuestionsTotal > 0 &&
        aParametres.article.getEtat() === Enumere_Etat_1.EGenreEtat.Aucun
      ) {
        const lLibelleExport =
          ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.ExporterQCM") +
          " " +
          ObjetTraduction_1.GTraductions.getValeur(
            "QCM_Divers.ExporterQCMFormatXML",
          );
        aParametres.menuContextuel.addCommande(
          DonneesListe_QCM.GenreCommande.ExportQCM,
          lLibelleExport,
          !aParametres.nonEditable,
        );
      }
      if (
        this._estUnQCM(aParametres.article.getGenre()) &&
        aParametres.article.nbQuestionsTotal > 0 &&
        aParametres.article.getEtat() === Enumere_Etat_1.EGenreEtat.Aucun
      ) {
        if (
          this.optionsQCM.avecAssocDevoirs ||
          this.optionsQCM.avecAssocTAF ||
          this.optionsQCM.avecAssocEvaluations
        ) {
          aParametres.menuContextuel.addSeparateur();
        }
        if (
          this.droits.avecGestionNotation &&
          this.optionsQCM.avecAssocDevoirs
        ) {
          aParametres.menuContextuel.addCommande(
            DonneesListe_QCM.GenreCommande.CreerDevoir,
            ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.CreerDevoir"),
            !aParametres.nonEditable &&
              this.avecService &&
              this.droits.avecSaisieDevoirs,
          );
        }
        if (
          this.optionsQCM.avecAssocEvaluations &&
          aParametres.article.nbCompetencesTotal > 0
        ) {
          aParametres.menuContextuel.addCommande(
            DonneesListe_QCM.GenreCommande.CreerEvaluation,
            ObjetTraduction_1.GTraductions.getValeur(
              "SaisieQCM.CreerEvaluation",
            ),
            !aParametres.nonEditable &&
              this.avecServicesEvaluation &&
              this.droits.avecSaisieEvaluations,
          );
        }
        if (this.optionsQCM.avecAssocTAF) {
          aParametres.menuContextuel.addCommande(
            DonneesListe_QCM.GenreCommande.AjouterExerciceCDT,
            ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.CDTPourLeQCM"),
            !aParametres.nonEditable && this.droits.avecSaisieCahierDeTexte,
          );
        }
        if (this.optionsQCM.avecAssocActivite) {
          aParametres.menuContextuel.addCommande(
            DonneesListe_QCM.GenreCommande.CreerActivite,
            ObjetTraduction_1.GTraductions.getValeur(
              "QCM_Divers.Menu.AssocierActivite",
            ),
            !aParametres.nonEditable && this.droits.avecSaisieCahierDeTexte,
          );
        }
        if (this.optionsQCM.avecAssocTAFPrim) {
          aParametres.menuContextuel.addCommande(
            DonneesListe_QCM.GenreCommande.CreerTAF,
            ObjetTraduction_1.GTraductions.getValeur(
              "QCM_Divers.Menu.AssocierTAF",
            ),
            !aParametres.nonEditable && this.droits.avecSaisieCahierDeTexte,
          );
        }
      }
      if (
        this.droits.avecGestionNotation &&
        this.optionsQCM.avecAssocDevoirs &&
        this.optionsQCM.avecTafToDevoir &&
        !this._estUnQCM(aParametres.article.getGenre()) &&
        !aParametres.article.estLieADevoir &&
        !aParametres.article.estLieAEvaluation &&
        aParametres.article.estUnTAF
      ) {
        aParametres.menuContextuel.addSeparateur();
        aParametres.menuContextuel.addCommande(
          DonneesListe_QCM.GenreCommande.TafToDevoir,
          ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.TafToDevoir"),
          !aParametres.nonEditable && this.droits.avecSaisieDevoirs,
        );
      }
    }
    aParametres.menuContextuel.setDonnees();
  }
  evenementMenuContextuel(aParametres) {
    if (
      aParametres.numeroMenu === DonneesListe_QCM.GenreCommande.ImportQCMFichier
    ) {
      return;
    }
    this.evenement(aParametres.numeroMenu, aParametres.article);
  }
  getValeur(aParams) {
    const lEstExecutionQCM = this._estUneExecQCM(aParams.article.getGenre());
    if (lEstExecutionQCM) {
      switch (aParams.idColonne) {
        case DonneesListe_QCM.colonnes.categorie:
          return "";
        case DonneesListe_QCM.colonnes.QCM: {
          const lIcon = UtilitaireQCM_1.UtilitaireQCM.getIconeTypeExecutionQCM(
            aParams.article,
          );
          return [
            '<div style="display:flex; flex-wrap:wrap; align-items:center;">',
            '<div class="Texte12 EspaceDroit"><i class="' +
              lIcon +
              '"></i></div>',
            "<div ie-ellipsis>",
            aParams.article.getLibelle(),
            "&nbsp;&nbsp;",
            aParams.article.nomPublic,
            "</div>",
            aParams.article.estLieADevoir ||
            aParams.article.estLieAEvaluation ||
            aParams.article.estUnTAF
              ? '<div style="margin-left:auto;">' +
                ObjetTraduction_1.GTraductions.getValeur(
                  "QCM_Divers.reponduSur",
                  [aParams.article.nbRepondu, aParams.article.nbRepondant],
                ) +
                "</div>"
              : "",
            "</div>",
          ].join("");
        }
        case DonneesListe_QCM.colonnes.matiere:
          return "";
        case DonneesListe_QCM.colonnes.themes:
          return "";
        case DonneesListe_QCM.colonnes.niveau:
          return "";
        case DonneesListe_QCM.colonnes.nbElementsCompetences:
          return "";
        case DonneesListe_QCM.colonnes.proprietaire:
          return "";
        case DonneesListe_QCM.colonnes.contributeurs:
          return "";
        case DonneesListe_QCM.colonnes.statutPrive:
          return "";
      }
    } else {
      switch (aParams.idColonne) {
        case DonneesListe_QCM.colonnes.categorie: {
          const lStrCategorie = [];
          if (!!aParams.article.categories) {
            aParams.article.categories.parcourir((aCategorie) => {
              lStrCategorie.push(
                UtilitaireQCM_1.UtilitaireQCM.dessineIconeCategorieQCM(
                  aCategorie.couleur,
                  aCategorie.abr,
                ),
              );
            });
          }
          return lStrCategorie.join(" ");
        }
        case DonneesListe_QCM.colonnes.QCM:
          return aParams.article.getLibelle();
        case DonneesListe_QCM.colonnes.matiere:
          return !!aParams.article.matiere &&
            aParams.article.matiere.existeNumero()
            ? aParams.article.matiere.getLibelle()
            : "";
        case DonneesListe_QCM.colonnes.themes:
          return aParams.article.ListeThemes &&
            aParams.article.ListeThemes.count()
            ? aParams.article.ListeThemes.getTableauLibelles().join(", ")
            : "";
        case DonneesListe_QCM.colonnes.niveau:
          return !!aParams.article.niveau &&
            aParams.article.niveau.existeNumero()
            ? aParams.article.niveau.getLibelle()
            : "";
        case DonneesListe_QCM.colonnes.nbElementsCompetences:
          return aParams.article.nbCompetencesTotal > 0
            ? aParams.article.nbCompetencesTotal
            : "";
        case DonneesListe_QCM.colonnes.proprietaire: {
          const lPropietaires = [];
          if (
            aParams.article.listeProprietaires === null ||
            aParams.article.listeProprietaires === undefined
          ) {
            aParams.article.listeProprietaires =
              new ObjetListeElements_1.ObjetListeElements();
            aParams.article.listeProprietaires.addElement(
              aParams.article.proprietaire,
            );
          }
          aParams.article.listeProprietaires.parcourir((aProprietaire) => {
            if (aProprietaire.existe()) {
              lPropietaires.push(aProprietaire.getLibelle());
            }
          });
          return lPropietaires.join("\n");
        }
        case DonneesListe_QCM.colonnes.contributeurs: {
          const lContributeurs = [];
          if (
            aParams.article.listeContributeurs === null ||
            aParams.article.listeContributeurs === undefined
          ) {
            aParams.article.listeContributeurs =
              new ObjetListeElements_1.ObjetListeElements();
            return "";
          }
          let lNbr = aParams.article.listeContributeurs.count();
          const lSeuil = 5;
          if (lNbr > lSeuil) {
            lContributeurs.push(lNbr);
          } else {
            for (let i = 0; i < lNbr; i++) {
              if (aParams.article.listeContributeurs.get(i).existe()) {
                lContributeurs.push(
                  aParams.article.listeContributeurs.getLibelle(i),
                );
              }
            }
          }
          return lContributeurs.join("\n");
        }
        case DonneesListe_QCM.colonnes.statutPrive: {
          const lHtmlStatutPrive = [];
          if (!aParams.article.statutPrive) {
            const lAriaLabel = this.getHintForce(aParams);
            lHtmlStatutPrive.push(
              `<i class="icon_sondage_bibliotheque" aria-label="${lAriaLabel}"></i>`,
            );
          }
          return lHtmlStatutPrive.join("");
        }
      }
    }
  }
  getHintForce(aParams) {
    if (aParams.idColonne === DonneesListe_QCM.colonnes.statutPrive) {
      const lEstExecutionQCM = this._estUneExecQCM(aParams.article.getGenre());
      if (!lEstExecutionQCM && !aParams.article.statutPrive) {
        return ObjetTraduction_1.GTraductions.getValeur(
          "SaisieQCM.HintQCMPartage",
        );
      }
    }
    return "";
  }
  getClass(aParams) {
    const lClasses = [];
    if (aParams.idColonne === DonneesListe_QCM.colonnes.statutPrive) {
      lClasses.push("AlignementMilieu");
    }
    return lClasses.join(" ");
  }
  getPadding(aParams) {
    if (
      this._estUnQCM(aParams.article.getGenre()) &&
      aParams.idColonne === DonneesListe_QCM.colonnes.statutPrive &&
      !aParams.article.statutPrive
    ) {
      return 1;
    }
    return false;
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_QCM.colonnes.categorie:
        return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
      case DonneesListe_QCM.colonnes.QCM:
        return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
      case DonneesListe_QCM.colonnes.matiere:
        return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
      case DonneesListe_QCM.colonnes.niveau:
        return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
      case DonneesListe_QCM.colonnes.nbElementsCompetences:
        return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
      case DonneesListe_QCM.colonnes.proprietaire:
        return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
      case DonneesListe_QCM.colonnes.contributeurs:
        return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
      case DonneesListe_QCM.colonnes.statutPrive:
        return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
    }
    return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
  }
  getTri(aColonneDeTri, aGenreTri) {
    const lIdColonneTri = this.getId(aColonneDeTri);
    switch (lIdColonneTri) {
      case DonneesListe_QCM.colonnes.categorie:
        return [
          ObjetTri_1.ObjetTri.init((D) => {
            const lListeCategories = D.pere ? D.pere.categories : D.categories;
            return !!lListeCategories ? lListeCategories.count() : 0;
          }, aGenreTri),
          ObjetTri_1.ObjetTri.init((D) => {
            return D.pere ? D.pere.getLibelle() : D.getLibelle();
          }, aGenreTri),
          ObjetTri_1.ObjetTri.init((D) => {
            return !!D.pere;
          }),
        ];
      case DonneesListe_QCM.colonnes.QCM:
        return [
          ObjetTri_1.ObjetTri.init((D) => {
            return D.pere ? D.pere.getLibelle() : D.getLibelle();
          }, aGenreTri),
          ObjetTri_1.ObjetTri.init((D) => {
            return !!D.pere;
          }),
          ObjetTri_1.ObjetTri.init("Libelle", aGenreTri),
        ];
      case DonneesListe_QCM.colonnes.matiere:
        return [
          ObjetTri_1.ObjetTri.init((D) => {
            return D.pere
              ? D.pere.matiere.getLibelle()
              : D.matiere.getLibelle();
          }, aGenreTri),
        ];
      case DonneesListe_QCM.colonnes.themes:
        return [
          ObjetTri_1.ObjetTri.init((D) => {
            return D.ListeThemes.getTableauLibelles().join("");
          }, aGenreTri),
        ];
      case DonneesListe_QCM.colonnes.niveau:
        return [
          ObjetTri_1.ObjetTri.init((D) => {
            return D.pere ? D.pere.niveau.getLibelle() : D.niveau.getLibelle();
          }, aGenreTri),
        ];
      case DonneesListe_QCM.colonnes.nbElementsCompetences:
        return [
          ObjetTri_1.ObjetTri.init((D) => {
            const lNbCpt = D.pere
              ? D.pere.nbCompetencesTotal
              : D.nbCompetencesTotal;
            return lNbCpt || 0;
          }, aGenreTri),
        ];
      case DonneesListe_QCM.colonnes.proprietaire:
        return [
          ObjetTri_1.ObjetTri.init((D) => {
            const lListeProprietaires = D.pere
              ? D.pere.listeProprietaires
              : D.listeProprietaires;
            const lPremierProprietaire = lListeProprietaires
              ? lListeProprietaires.get(0)
              : null;
            return lPremierProprietaire
              ? lPremierProprietaire.getPosition()
              : -1;
          }, aGenreTri),
          ObjetTri_1.ObjetTri.init((D) => {
            return D.pere ? D.pere.getLibelle() : D.getLibelle();
          }),
          ObjetTri_1.ObjetTri.init((D) => {
            return !!D.pere;
          }),
        ];
      case DonneesListe_QCM.colonnes.contributeurs:
        return [];
      case DonneesListe_QCM.colonnes.statutPrive:
        return [
          ObjetTri_1.ObjetTri.init((D) => {
            return D.pere ? !!D.pere.statutPrive : !!D.statutPrive;
          }, aGenreTri),
        ];
    }
  }
}
exports.DonneesListe_QCM = DonneesListe_QCM;
DonneesListe_QCM.colonnes = {
  categorie: "DL_QCM_categorie",
  QCM: "DL_QCM_QCM",
  matiere: "DL_QCM_matiere",
  themes: "DL_QCM_themes",
  niveau: "DL_QCM_niveau",
  nbElementsCompetences: "DL_QCM_nbCpt",
  proprietaire: "DL_QCM_proprietaire",
  contributeurs: "DL_QCM_contributeurs",
  statutPrive: "DL_QCM_statut",
};
(function (DonneesListe_QCM) {
  let GenreCommande;
  (function (GenreCommande) {
    GenreCommande[(GenreCommande["VisuEleve"] = 0)] = "VisuEleve";
    GenreCommande[(GenreCommande["TafToDevoir"] = 1)] = "TafToDevoir";
    GenreCommande[(GenreCommande["ExportQCM"] = 2)] = "ExportQCM";
    GenreCommande[(GenreCommande["CopierQCM"] = 3)] = "CopierQCM";
    GenreCommande[(GenreCommande["ImportQCMBiblio"] = 4)] = "ImportQCMBiblio";
    GenreCommande[(GenreCommande["ImportQCMNathan"] = 5)] = "ImportQCMNathan";
    GenreCommande[(GenreCommande["CreerDevoir"] = 6)] = "CreerDevoir";
    GenreCommande[(GenreCommande["CreerEvaluation"] = 7)] = "CreerEvaluation";
    GenreCommande[(GenreCommande["AjouterExerciceCDT"] = 8)] =
      "AjouterExerciceCDT";
    GenreCommande[(GenreCommande["SuppressionServeur"] = 9)] =
      "SuppressionServeur";
    GenreCommande[(GenreCommande["CopierQCMVers"] = 10)] = "CopierQCMVers";
    GenreCommande[(GenreCommande["ImportQCMFichier"] = 11)] =
      "ImportQCMFichier";
    GenreCommande[(GenreCommande["AjoutQuestionsPerso"] = 12)] =
      "AjoutQuestionsPerso";
    GenreCommande[(GenreCommande["AjoutQuestionsCollab"] = 13)] =
      "AjoutQuestionsCollab";
    GenreCommande[(GenreCommande["AjoutQuestionsEtab"] = 14)] =
      "AjoutQuestionsEtab";
    GenreCommande[(GenreCommande["AjoutQuestionsNathan"] = 15)] =
      "AjoutQuestionsNathan";
    GenreCommande[(GenreCommande["CreerActivite"] = 16)] = "CreerActivite";
    GenreCommande[(GenreCommande["CreerTAF"] = 17)] = "CreerTAF";
  })(
    (GenreCommande =
      DonneesListe_QCM.GenreCommande || (DonneesListe_QCM.GenreCommande = {})),
  );
})(DonneesListe_QCM || (exports.DonneesListe_QCM = DonneesListe_QCM = {}));
