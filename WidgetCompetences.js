exports.WidgetCompetences = void 0;
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const ObjetElement_1 = require("ObjetElement");
const TypeFichierExterneHttpSco_1 = require("TypeFichierExterneHttpSco");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
class WidgetCompetences extends ObjetWidget_1.Widget.ObjetWidget {
  constructor(...aParams) {
    super(...aParams);
    const lApplicationSco = GApplication;
    this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
  }
  construire(aParams) {
    this.donnees = aParams.donnees;
    this.donnees.listeEvaluations.setTri([
      ObjetTri_1.ObjetTri.init(
        "date",
        Enumere_TriElement_1.EGenreTriElement.Decroissant,
      ),
      ObjetTri_1.ObjetTri.init("matiere.Libelle"),
    ]);
    this.donnees.listeEvaluations.trier();
    const H = [];
    H.push('<ul class="liste-clickable">');
    for (let i = 0; i < this.donnees.listeEvaluations.count(); i++) {
      const lEvaluation = this.donnees.listeEvaluations.get(i);
      H.push(this.composeEvaluation(lEvaluation, i));
    }
    H.push("</ul>");
    const lWidget = {
      html: H.join(""),
      nbrElements: this.donnees.listeEvaluations.count(),
      afficherMessage: this.donnees.listeEvaluations.count() === 0,
      getPage: () => {
        if (this.donnees.listeEvaluations.count()) {
          const lPeriode =
            this.donnees.listeEvaluations.getPremierElement().periode;
          this.etatUtilisateurSco.Navigation.setRessource(
            Enumere_Ressource_1.EGenreRessource.Periode,
            lPeriode,
          );
        }
        return this.donnees.page;
      },
    };
    $.extend(true, this.donnees, lWidget);
    aParams.construireWidget(this.donnees);
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      surDernieresEvaluationClick(i) {
        $(this.node).eventValidation((aEvent) => {
          aInstance._surDernieresEvaluationClick(aEvent, i);
        });
      },
    });
  }
  composeEvaluation(aEvaluation, aIndex) {
    const H = [];
    aEvaluation.listeNiveauxDAcquisitions.setTri([
      ObjetTri_1.ObjetTri.init("ordre"),
    ]);
    aEvaluation.listeNiveauxDAcquisitions.trier();
    const lStrDate = [];
    if (aEvaluation.date) {
      lStrDate.push(
        ObjetDate_1.GDate.formatDate(
          aEvaluation.date,
          "[" +
            ObjetTraduction_1.GTraductions.getValeur("Le") +
            " " +
            "%J %MMM" +
            "]",
        ),
      );
    }
    if (
      this.etatUtilisateurSco.pourPrimaire() &&
      aEvaluation.coefficient === 0
    ) {
      if (lStrDate.length > 0) {
        lStrDate.push(" ");
      }
      lStrDate.push(
        "(",
        ObjetTraduction_1.GTraductions.getValeur(
          "evaluations.NonComptabiliseDansBilan",
        ),
        ")",
      );
    }
    H.push(
      "<li>",
      '<a tabindex="0" class="wrapper-link" ie-node="surDernieresEvaluationClick(',
      aIndex,
      ')">',
      '<div class="wrap">',
      "<h3><span>",
      aEvaluation.matiere.getLibelle(),
      "</span></h3>",
      '<div class="infos-conteneur">',
      '<span class="date">',
      lStrDate.join(""),
      "</span>",
    );
    const lArrayLiensSujetCorrige = [];
    if (!!aEvaluation.libelleSujet) {
      const lDocumentJointSujet = new ObjetElement_1.ObjetElement(
        aEvaluation.libelleSujet,
        aEvaluation.getNumero(),
        Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
      );
      lArrayLiensSujetCorrige.push(
        ObjetChaine_1.GChaine.composerUrlLienExterne({
          documentJoint: lDocumentJointSujet,
          genreRessource:
            TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
              .EvaluationSujet,
          libelleEcran:
            ObjetTraduction_1.GTraductions.getValeur("AfficherSujet"),
        }),
      );
    }
    if (!!aEvaluation.libelleCorrige) {
      const lDocumentJointCorrige = new ObjetElement_1.ObjetElement(
        aEvaluation.libelleCorrige,
        aEvaluation.getNumero(),
        Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
      );
      lArrayLiensSujetCorrige.push(
        ObjetChaine_1.GChaine.composerUrlLienExterne({
          documentJoint: lDocumentJointCorrige,
          genreRessource:
            TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
              .EvaluationCorrige,
          libelleEcran:
            ObjetTraduction_1.GTraductions.getValeur("AfficherCorrige"),
        }),
      );
    }
    if (lArrayLiensSujetCorrige.length > 0) {
      H.push(
        `<div class="flex-contain flex-center full-width flex-gap-l m-top">${lArrayLiensSujetCorrige.join(" ")} </div>`,
      );
    }
    H.push("</div>", "</div>");
    H.push('<div class="evaluations-conteneur flex-wrap">');
    aEvaluation.listeNiveauxDAcquisitions.parcourir((D) => {
      let lHintNiveauDAcquisition = D.getLibelle();
      if (!!D.item) {
        lHintNiveauDAcquisition += " - " + D.item.getLibelle();
      } else if (!!D.domaine) {
        lHintNiveauDAcquisition += " - " + D.domaine.getLibelle();
      }
      const lNiveauDAcquisitionGlobal =
        GParametres.listeNiveauxDAcquisitions.getElementParNumero(
          D.getNumero(),
        );
      const lImage =
        Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
          lNiveauDAcquisitionGlobal,
          { avecTitle: false },
        );
      H.push(
        "<span",
        !!lHintNiveauDAcquisition
          ? ' title="' +
              ObjetChaine_1.GChaine.toTitle(lHintNiveauDAcquisition) +
              '"'
          : "",
        ">",
        lImage,
        "</span>",
      );
    });
    H.push("</div>");
    H.push("</a>");
    H.push("</li>");
    return H.join("");
  }
  _surDernieresEvaluationClick(aEvent, i) {
    if (
      $(aEvent.target)
        .parentsUntil(aEvent.currentTarget)
        .addBack()
        .filter("a[target=_blank]").length === 0
    ) {
      const lEvaluation = this.donnees.listeEvaluations.get(i);
      this.etatUtilisateurSco.Navigation.setRessource(
        Enumere_Ressource_1.EGenreRessource.Evaluation,
        lEvaluation,
      );
      this.donnees.page.periode = lEvaluation.periode;
      let lPageDestination;
      if (this.etatUtilisateurSco.estEspaceMobile()) {
        lPageDestination = {
          genreOngletDest: this.donnees.page.Onglet,
          page: this.donnees.page,
        };
        this.setEvaluationWidgetSelectionne(lEvaluation);
      } else {
        lPageDestination = this.donnees.page;
      }
      lPageDestination.periode = lEvaluation.periode;
      this.callback.appel(
        this.donnees.genre,
        Enumere_EvenementWidget_1.EGenreEvenementWidget.NavigationVersPage,
        lPageDestination,
      );
    }
  }
  setEvaluationWidgetSelectionne(aEval) {
    const lGEtatUtilisateur = GEtatUtilisateur;
    if (!lGEtatUtilisateur.infosSupp) {
      lGEtatUtilisateur.infosSupp = {};
    }
    if (!lGEtatUtilisateur.infosSupp.DernieresEvaluationsMobile) {
      lGEtatUtilisateur.infosSupp.DernieresEvaluationsMobile = {};
    }
    lGEtatUtilisateur.infosSupp.DernieresEvaluationsMobile.evaluationWidgetSelectionne =
      aEval;
  }
}
exports.WidgetCompetences = WidgetCompetences;
