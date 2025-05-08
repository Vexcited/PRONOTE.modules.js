exports.PageBilanFinDeCycle = void 0;
const TypeFusionTitreListe_1 = require("TypeFusionTitreListe");
const ObjetFenetre_DetailEvaluationsCompetences_1 = require("ObjetFenetre_DetailEvaluationsCompetences");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_BilanFinDeCycle_1 = require("DonneesListe_BilanFinDeCycle");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetRequeteDetailEvaluationsCompetences_1 = require("ObjetRequeteDetailEvaluationsCompetences");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const Enumere_Onglet_1 = require("Enumere_Onglet");
class PageBilanFinDeCycle extends ObjetInterface_1.ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    const lApplicationSco = GApplication;
    this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
    this.donneesPageBilanFinDeCycle = {
      listePiliers: null,
      infoColonneNbPointsExamen: null,
    };
    this.optionsAffichageListe = {
      uneJaugeParPeriode: true,
      jaugeChronologique: false,
      boutonValidationAuto: true,
    };
    this.moteur = new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
  }
  construireInstances() {
    this.identListe = this.add(
      ObjetListe_1.ObjetListe,
      this.evenementSurListe,
      this.initialiserListe,
    );
    this.identFenetreDetailEvaluations = this.addFenetre(
      ObjetFenetre_DetailEvaluationsCompetences_1.ObjetFenetre_DetailEvaluationsCompetences,
      this._evenementFenetreDetailEvaluations,
      this._initFenetreDetailEvaluations,
    );
  }
  setParametresGeneraux() {
    this.IdentZoneAlClient = this.identListe;
    this.avecBandeau = false;
    this.AvecCadre = false;
  }
  setDonnees(aDonnees) {
    this.optionsAffichageListe.boutonValidationAuto =
      aDonnees.avecValidationAuto === undefined
        ? true
        : aDonnees.avecValidationAuto;
    this.initialiser(true);
    this.listeElevesDeClasse = aDonnees.listeElevesDeClasse;
    const lEstSurEspaceProfEtablissement = [
      Enumere_Espace_1.EGenreEspace.Professeur,
      Enumere_Espace_1.EGenreEspace.Etablissement,
      Enumere_Espace_1.EGenreEspace.PrimProfesseur,
      Enumere_Espace_1.EGenreEspace.PrimDirection,
    ].includes(GEtatUtilisateur.GenreEspace);
    const lEstFinCycleParent =
      this.etatUtilisateurSco.genreOnglet ===
        Enumere_Onglet_1.EGenreOnglet.BilanFinDeCycle &&
      [
        Enumere_Espace_1.EGenreEspace.Parent,
        Enumere_Espace_1.EGenreEspace.Eleve,
      ].includes(GEtatUtilisateur.GenreEspace);
    const lPeriode = this.getPeriode();
    const lPourDecompte = aDonnees.pourDecompte;
    this.donneesPageBilanFinDeCycle.listePiliers = aDonnees.listePiliers;
    this.donneesPageBilanFinDeCycle.infoColonneNbPointsExamen =
      aDonnees.infoColonneNbPointsExamen;
    const lSansColonneJauge =
      GEtatUtilisateur.GenreEspace ===
        Enumere_Espace_1.EGenreEspace.Professeur &&
      (lPourDecompte || !lEstSurEspaceProfEtablissement);
    if (!lSansColonneJauge) {
      this.calculJaugeParNiveau(aDonnees.listePiliers);
    }
    const lSansColonneScoreEleve = lSansColonneJauge || lEstFinCycleParent;
    const lSansColonneNbPointsExamen =
      lSansColonneJauge ||
      !this.donneesPageBilanFinDeCycle.infoColonneNbPointsExamen;
    const lColonnesCachees = [];
    if (lSansColonneJauge) {
      lColonnesCachees.push(
        DonneesListe_BilanFinDeCycle_1.DonneesListe_BilanFinDeCycle.colonnes
          .jauge,
      );
    }
    if (lSansColonneScoreEleve) {
      lColonnesCachees.push(
        DonneesListe_BilanFinDeCycle_1.DonneesListe_BilanFinDeCycle.colonnes
          .score,
      );
    }
    if (lSansColonneNbPointsExamen) {
      lColonnesCachees.push(
        DonneesListe_BilanFinDeCycle_1.DonneesListe_BilanFinDeCycle.colonnes
          .nbPointsExamen,
      );
    }
    this.getInstance(this.identListe).setOptionsListe({
      colonnesCachees: lColonnesCachees,
    });
    const lDonneesListe =
      new DonneesListe_BilanFinDeCycle_1.DonneesListe_BilanFinDeCycle(
        this.donneesPageBilanFinDeCycle.listePiliers,
      );
    lDonneesListe.setOptionsBilanFinDeCycle({
      pourDecompte: lPourDecompte,
      estMultiJauges:
        (!lPeriode || !lPeriode.existeNumero()) &&
        !!this.optionsAffichageListe.uneJaugeParPeriode,
      affichageJaugeChronologique:
        this.optionsAffichageListe.jaugeChronologique,
      avecCocheVerte: true,
      callbackClicJauge: this._surClicJaugeEvaluation.bind(this),
    });
    this.getInstance(this.identListe).setDonnees(lDonneesListe);
  }
  setOptionsAffichageListe(aOptions) {
    Object.assign(this.optionsAffichageListe, aOptions);
    const lPeriode = this.getPeriode();
    const lInstanceListe = this.getInstance(this.identListe);
    lInstanceListe
      .getDonneesListe()
      .setOptionsBilanFinDeCycle({
        affichageJaugeChronologique:
          this.optionsAffichageListe.jaugeChronologique,
        estMultiJauges:
          (!lPeriode || !lPeriode.existeNumero()) &&
          !!this.optionsAffichageListe.uneJaugeParPeriode,
      });
    lInstanceListe.actualiser(true);
  }
  _surClicJaugeEvaluation(aPilier, aObjetJaugeConcerne) {
    if (aPilier && aObjetJaugeConcerne) {
      if (
        aObjetJaugeConcerne.relationsESI &&
        aObjetJaugeConcerne.relationsESI.length > 0
      ) {
        new ObjetRequeteDetailEvaluationsCompetences_1.ObjetRequeteDetailEvaluationsCompetences(
          this,
          this._reponseRequeteDetailEvaluations.bind(this, aPilier),
        ).lancerRequete({
          eleve: this.getEleve(),
          pilier: aPilier,
          periode: this.getPeriode(),
          numRelESI: aObjetJaugeConcerne.relationsESI,
        });
      } else {
        this.getInstance(this.identFenetreDetailEvaluations).fermer();
      }
    } else {
      this.getInstance(this.identFenetreDetailEvaluations).fermer();
    }
  }
  afficherPage() {
    this.callback.appel();
  }
  evenementSurListe(aParametres) {
    switch (aParametres.genreEvenement) {
      case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
        if (
          DonneesListe_BilanFinDeCycle_1.DonneesListe_BilanFinDeCycle.estUneColonneMaitrise(
            aParametres.idColonne,
          )
        ) {
          const lInstanceListe = this.getInstance(this.identListe);
          const lAvecActualisationAffichageNecessaire =
            this.estColonneNbPointsExamenVisible();
          const lLigne = aParametres.article;
          this.moteur.saisiePositionnement({
            paramRequete: {
              estPourElementCompetence: false,
              positionnement: lLigne.niveauDAcquisition,
              classe: this.getClasse(),
              periode: this.getPeriode(),
              eleve: this.getEleve(),
              palier: lLigne.palier,
              pilier: lLigne,
            },
            instanceListe: lInstanceListe,
            clbckSucces: (aParamSucces) => {
              if (!lAvecActualisationAffichageNecessaire) {
                const lDonneesListe = this.getInstance(
                  this.identListe,
                ).getListeArticles();
                const lLignes = lDonneesListe.getListeElements((aLigne) => {
                  return aLigne.getNumero() === aParamSucces.numeroPilier;
                });
                const lLigne = lLignes.get(0);
                lLigne.niveauDAcquisition = aParamSucces.niveauAcquSaisi;
              } else {
                this.afficherPage();
              }
            },
            clbckEchec: function () {},
          });
        }
        break;
    }
  }
  getListePiliers() {
    return this.donneesPageBilanFinDeCycle.listePiliers;
  }
  estJaugeChronologique() {
    return this.optionsAffichageListe.jaugeChronologique;
  }
  estUneJaugeParPeriode() {
    return this.optionsAffichageListe.uneJaugeParPeriode;
  }
  getEleve() {
    return this.etatUtilisateurSco.Navigation.getRessource(
      Enumere_Ressource_1.EGenreRessource.Eleve,
    );
  }
  getClasse() {
    return this.etatUtilisateurSco.Navigation.getRessource(
      Enumere_Ressource_1.EGenreRessource.Classe,
    );
  }
  getPeriode() {
    return this.etatUtilisateurSco.Navigation.getRessource(
      Enumere_Ressource_1.EGenreRessource.Periode,
    );
  }
  getListeElevesConcernes() {
    return this.listeElevesDeClasse
      ? this.listeElevesDeClasse
      : this.etatUtilisateurSco.Navigation.getRessources(
          Enumere_Ressource_1.EGenreRessource.Eleve,
        );
  }
  estColonneNbPointsExamenVisible() {
    return this.getInstance(this.identListe).estColonneVisibleDIdColonne(
      DonneesListe_BilanFinDeCycle_1.DonneesListe_BilanFinDeCycle.colonnes
        .nbPointsExamen,
    );
  }
  calculJaugeParNiveau(aListePiliers) {
    if (!!aListePiliers) {
      aListePiliers.parcourir((aPilier) => {
        if (aPilier) {
          if (aPilier.jaugeUnique) {
            aPilier.jaugeUnique.listeNiveauxParNiveau =
              UtilitaireCompetences_1.TUtilitaireCompetences.regroupeNiveauxDAcquisitions(
                aPilier.jaugeUnique.listeNiveaux,
              );
          }
          if (
            aPilier.listeJaugesDePeriode &&
            aPilier.listeJaugesDePeriode.count() > 0
          ) {
            aPilier.listeJaugesDePeriode.parcourir((aJaugeDePeriode) => {
              aJaugeDePeriode.listeNiveauxParNiveau =
                UtilitaireCompetences_1.TUtilitaireCompetences.regroupeNiveauxDAcquisitions(
                  aJaugeDePeriode.listeNiveaux,
                );
            });
          }
        }
      });
    }
  }
  _reponseRequeteDetailEvaluations(aPilier, aJSON) {
    const lFenetre = this.getInstance(this.identFenetreDetailEvaluations);
    const lTitreParDefaut = lFenetre.getTitreFenetreParDefaut(
      this.getEleve(),
      aPilier,
    );
    lFenetre.setDonnees(aPilier, aJSON, { titreFenetre: lTitreParDefaut });
  }
  _initFenetreDetailEvaluations(aInstance) {
    aInstance.setOptionsFenetre({
      modale: false,
      largeur: 700,
      hauteur: 500,
      listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
    });
  }
  _evenementFenetreDetailEvaluations() {
    IE.log.addLog(
      "Saisie non gérée pour le moment ; saisie non permise par delphi",
    );
  }
  initialiserListe(aInstance) {
    const lInstance = this;
    const lColonnes = [];
    lColonnes.push({
      id: DonneesListe_BilanFinDeCycle_1.DonneesListe_BilanFinDeCycle.colonnes
        .competences,
      taille: ObjetListe_1.ObjetListe.initColonne(100, 200, 400),
      titre: ObjetTraduction_1.GTraductions.getValeur("competences.Domaines"),
    });
    const lTitreColonneEvaluations = [];
    lTitreColonneEvaluations.push(
      `<div class="flex-contain flex-center justify-center">`,
    );
    lTitreColonneEvaluations.push(
      `<ie-btnimage ie-model="btnBasculeJauge" class="Image_BasculeJauge" style="width: 18px;"></ie-btnimage>`,
    );
    lTitreColonneEvaluations.push(
      `<span>${ObjetTraduction_1.GTraductions.getValeur("competences.evaluations")}</span>`,
    );
    lTitreColonneEvaluations.push(`</div>`);
    lColonnes.push({
      id: DonneesListe_BilanFinDeCycle_1.DonneesListe_BilanFinDeCycle.colonnes
        .jauge,
      taille: ObjetListe_1.ObjetListe.initColonne(100, 200, 300),
      titre: {
        libelleHtml: lTitreColonneEvaluations.join(""),
        title: ObjetTraduction_1.GTraductions.getValeur(
          "competences.hintEvaluations",
        ),
        controleur: {
          btnBasculeJauge: {
            event() {
              lInstance.setOptionsAffichageListe({
                jaugeChronologique:
                  !lInstance.optionsAffichageListe.jaugeChronologique,
              });
            },
            getTitle() {
              return lInstance.optionsAffichageListe.jaugeChronologique
                ? ObjetTraduction_1.GTraductions.getValeur(
                    "BulletinEtReleve.hintBtnAfficherJaugeParNiveau",
                  )
                : ObjetTraduction_1.GTraductions.getValeur(
                    "BulletinEtReleve.hintBtnAfficherJaugeChronologique",
                  );
            },
            getSelection() {
              return lInstance.optionsAffichageListe.jaugeChronologique;
            },
          },
        },
      },
    });
    const lNiveauxAcquiOrdonnes = getListeNiveauxAcquisitionsOrdonnes();
    lColonnes.push({
      id: DonneesListe_BilanFinDeCycle_1.DonneesListe_BilanFinDeCycle.colonnes
        .score,
      taille: 60,
      titre: {
        libelle: ObjetTraduction_1.GTraductions.getValeur(
          "competences.ScoreEleve",
        ),
        titleHtml: this._getHtmlHintDetailPointsNiveauxAcqui(
          lNiveauxAcquiOrdonnes,
          ObjetTraduction_1.GTraductions.getValeur(
            "competences.ScoreEleveHint",
          ),
        ),
      },
    });
    let lNiveauDAcquisition;
    for (let i = 0; i < lNiveauxAcquiOrdonnes.length; i++) {
      lNiveauDAcquisition =
        GParametres.listeNiveauxDAcquisitions.getElementParGenre(
          lNiveauxAcquiOrdonnes[i],
        );
      if (lNiveauDAcquisition) {
        let lControleur = null;
        const lObjTitreColonne = {};
        if (i === 0) {
          const lSuperTitreNiveauMaitrise = [];
          lSuperTitreNiveauMaitrise.push('<div class="InlineBlock">');
          if (this.optionsAffichageListe.boutonValidationAuto) {
            lSuperTitreNiveauMaitrise.push(
              '<ie-btnicon ie-model="btnValidationAuto" ie-hint="getHintHtmlBoutonValidationAuto" class="icon_sigma color-neutre MargeDroit"></ie-btnicon>',
            );
          }
          lSuperTitreNiveauMaitrise.push(
            ObjetTraduction_1.GTraductions.getValeur(
              "competences.niveauDeMaitrise",
            ),
          );
          lSuperTitreNiveauMaitrise.push("</div>");
          lObjTitreColonne.libelleHtml = lSuperTitreNiveauMaitrise.join("");
          lControleur = {
            btnValidationAuto: {
              event() {
                UtilitaireCompetences_1.TUtilitaireCompetences.surBoutonValidationAuto(
                  {
                    estPourLaClasse: !!lInstance.listeElevesDeClasse,
                    avecChoixCalcul: true,
                    instance: lInstance,
                    periode: lInstance.getPeriode(),
                    listePiliers:
                      lInstance.donneesPageBilanFinDeCycle.listePiliers,
                    listeEleves: lInstance.getListeElevesConcernes(),
                  },
                );
              },
            },
            getHintHtmlBoutonValidationAuto() {
              return lInstance._getHtmlHintDetailPointsNiveauxAcqui(
                getListeNiveauxAcquisitionsOrdonnes(),
                ObjetTraduction_1.GTraductions.getValeur(
                  "competences.validationAuto.hintBoutonDomaines",
                ),
              );
            },
          };
        } else {
          lObjTitreColonne.libelle =
            TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche;
        }
        lColonnes.push({
          id:
            DonneesListe_BilanFinDeCycle_1.DonneesListe_BilanFinDeCycle.colonnes
              .prefixeNiveauAcqui + lNiveauDAcquisition.getGenre(),
          taille: 70,
          titre: [
            lObjTitreColonne,
            {
              libelleHtml:
                Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
                  lNiveauDAcquisition,
                ),
              title:
                Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getLibelle(
                  lNiveauDAcquisition,
                ),
              controleur: lControleur,
            },
          ],
        });
      }
    }
    lColonnes.push({
      id: DonneesListe_BilanFinDeCycle_1.DonneesListe_BilanFinDeCycle.colonnes
        .nbPointsExamen,
      taille: 70,
      titre: {
        libelleHtml: '<span ie-html="getLibelleColNbPointsExamen"></span>',
        titleHtml: () =>
          this.donneesPageBilanFinDeCycle.infoColonneNbPointsExamen
            ? this.donneesPageBilanFinDeCycle.infoColonneNbPointsExamen.hint
            : "",
        controleur: {
          getLibelleColNbPointsExamen() {
            return lInstance.donneesPageBilanFinDeCycle
              .infoColonneNbPointsExamen
              ? lInstance.donneesPageBilanFinDeCycle.infoColonneNbPointsExamen
                  .titre
              : "";
          },
        },
      },
    });
    aInstance.setOptionsListe({
      colonnes: lColonnes,
      hauteurAdapteContenu: true,
      nonEditableSurModeExclusif: true,
    });
  }
  _getHtmlHintDetailPointsNiveauxAcqui(aListeNiveauxAcqui, aPreMessage = "") {
    const H = [];
    if (aPreMessage) {
      H.push('<div class="m-bottom-xl">', aPreMessage, "</div>");
    }
    const lListeNiveaux = [];
    for (let i = aListeNiveauxAcqui.length - 1; i >= 0; i--) {
      if (
        aListeNiveauxAcqui[i] !==
        Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Dispense
      ) {
        const lNiveauDAcquisition =
          GParametres.listeNiveauxDAcquisitions.getElementParGenre(
            aListeNiveauxAcqui[i],
          );
        lListeNiveaux.push({
          niveau: lNiveauDAcquisition,
          valeurPonderation: !!lNiveauDAcquisition.ponderation
            ? lNiveauDAcquisition.ponderation.getValeur()
            : 0,
        });
      }
    }
    H.push(
      "<div>",
      ObjetTraduction_1.GTraductions.getValeur(
        "competences.ExplicationCalculStr1",
      ),
      "</div>",
    );
    let lValeurSeuilTemporaire = null;
    for (let j = 0; j < lListeNiveaux.length; j++) {
      let lMin = null;
      if (j < lListeNiveaux.length - 1) {
        const lValeurProchainePonderation =
          lListeNiveaux[j + 1].valeurPonderation;
        lMin = Math.ceil(
          (lListeNiveaux[j].valeurPonderation + lValeurProchainePonderation) /
            2,
        );
      }
      const lMax = !!lValeurSeuilTemporaire
        ? lValeurSeuilTemporaire
        : lListeNiveaux[j].valeurPonderation;
      lValeurSeuilTemporaire = lMin;
      let lStrMaxMin;
      if (lMin !== null) {
        const lStrMax = (j === 0 ? "<=" : "<") + " " + lMax;
        const lStrMin = ">= " + lMin;
        lStrMaxMin =
          lStrMax +
          " " +
          ObjetTraduction_1.GTraductions.getValeur("competences.Et") +
          " " +
          lStrMin;
      } else {
        lStrMaxMin = "< " + lMax;
      }
      H.push(
        '<div style="padding-left: 0.5rem; padding-top: 0.5rem;">',
        lStrMaxMin,
        " ",
        ObjetTraduction_1.GTraductions.getValeur(
          "competences.ExplicationCalculStr2",
          [
            Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
              lListeNiveaux[j].niveau,
            ),
          ],
        ),
        "</div>",
      );
    }
    return H.join("");
  }
}
exports.PageBilanFinDeCycle = PageBilanFinDeCycle;
function getListeNiveauxAcquisitionsOrdonnes() {
  return [
    Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Dispense,
    Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.NonAcquis,
    Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.EnCoursAcquisition,
    Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Acquis,
    Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Expert,
  ];
}
