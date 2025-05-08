const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { GDate } = require("ObjetDate.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  _InterfaceCompetencesNumeriques,
} = require("_InterfaceCompetencesNumeriques.js");
const {
  DonneesListe_BilanParDomaine,
} = require("DonneesListe_BilanParDomaine.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
  ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const {
  ObjetRequeteCompetencesNumeriques,
} = require("ObjetRequeteCompetencesNumeriques.js");
const {
  ObjetRequeteSaisieCompetencesNumeriques,
} = require("ObjetRequeteSaisieCompetencesNumeriques.js");
const {
  TypeGenreValidationCompetence,
} = require("TypeGenreValidationCompetence.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const {
  TypeNiveauEquivalenceCE,
  TypeNiveauEquivalenceCEUtil,
} = require("TypeNiveauEquivalenceCE.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
class InterfaceCompetencesNumeriques_Saisie extends _InterfaceCompetencesNumeriques {
  constructor(...aParams) {
    super(...aParams);
  }
  construireInstances() {
    this.identTripleCombo = this.add(
      ObjetAffichagePageAvecMenusDeroulants,
      _evenementSurTripleCombo.bind(this),
      _initialiseTripleCombo,
    );
    this.identReleve = this.add(ObjetListe, _evenementSurListe);
    this.IdPremierElement = this.getInstance(
      this.identTripleCombo,
    ).getPremierElement();
  }
  setParametresGeneraux() {
    super.setParametresGeneraux();
    this.AddSurZone = [];
    this.AddSurZone.push(this.identTripleCombo);
    this.AddSurZone.push({ blocGauche: true });
    this.AddSurZone = this.AddSurZone.concat(this._construitAddSurZoneCommun());
    this.AddSurZone.push({
      html: UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche("btnMrFiche"),
    });
    this.AddSurZone.push({ blocDroit: true });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnMrFiche: {
        event() {
          GApplication.getMessage().afficher({
            idRessource: "competences.MFicheEchelleCompetencesNumeriques",
          });
        },
        getTitle() {
          return GTraductions.getTitreMFiche(
            "competences.MFicheEchelleCompetencesNumeriques",
          );
        },
      },
    });
  }
  estAffichageDeLaClasse() {
    const lEleve = GEtatUtilisateur.Navigation.getRessource(
      EGenreRessource.Eleve,
    );
    return !lEleve || !lEleve.existeNumero();
  }
  getParametresPDF() {
    return {
      genreGenerationPDF: TypeHttpGenerationPDFSco.LivretCompetenceNumerique,
      eleveSelectionne: GEtatUtilisateur.Navigation.getRessource(
        EGenreRessource.Eleve,
      ),
      filtrerNiveauxSansEvaluation: this.filtrerNiveauxSansEvaluation,
      avecCodeCompetences: GEtatUtilisateur.estAvecCodeCompetences(),
    };
  }
  _initMenuContextuelListe(aParametres) {
    const lListeSelections = this.getInstance(
      this.identReleve,
    ).getListeElementsSelection();
    let lNiveauAcquiEditable = false;
    if (!lListeSelections || lListeSelections.count() === 0) {
      return;
    }
    let lNeContientQueDesElementsPilier;
    lListeSelections.parcourir((aSelection) => {
      if (aSelection.niveauEstEditable) {
        lNiveauAcquiEditable = true;
      }
      if (
        lNeContientQueDesElementsPilier === undefined ||
        lNeContientQueDesElementsPilier === true
      ) {
        lNeContientQueDesElementsPilier =
          aSelection.getGenre() === EGenreRessource.ElementPilier;
      }
    });
    if (lNeContientQueDesElementsPilier) {
      TUtilitaireCompetences.initMenuContextuelNiveauEquivalenceCN({
        instance: this,
        menuContextuel: aParametres.menuContextuel,
        evaluationsEditables: lNiveauAcquiEditable,
        callbackNiveau: _modifierNiveauCEDeSelectionCourante.bind(this),
      });
    } else {
      TUtilitaireCompetences.initMenuContextuelNiveauAcquisition({
        instance: this,
        menuContextuel: aParametres.menuContextuel,
        avecLibelleRaccourci: true,
        genreChoixValidationCompetence:
          TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
        evaluationsEditables: lNiveauAcquiEditable,
        callbackNiveau:
          _modifierNiveauAcquisitionDeSelectionCourante.bind(this),
      });
    }
  }
  afficherPage() {
    new ObjetRequeteCompetencesNumeriques(
      this,
      this._reponseRequeteCompetences,
    ).lancerRequete({
      classe: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe),
      eleve: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
      filtrerNiveauxSansEvaluation: this.filtrerNiveauxSansEvaluation,
    });
  }
  _actualiserCommandePDF() {
    if (
      GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve) &&
      this.donnees.listeCompetences &&
      this.donnees.listeCompetences.count() > 0
    ) {
      Invocateur.evenement(
        ObjetInvocateur.events.activationImpression,
        EGenreImpression.GenerationPDF,
        this,
        this.getParametresPDF.bind(this),
      );
    }
  }
  valider() {
    const lParams = {
      classe: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe),
      eleve: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
      listeElementsCompetences: this.donnees.listeCompetences,
      appreciation: this.donnees.appreciation,
    };
    new ObjetRequeteSaisieCompetencesNumeriques(
      this,
      this.actionSurValidation,
    ).lancerRequete(lParams);
  }
}
function _editionListeSelectionListe(aListeSelections, aMethodeEdition) {
  if (!aListeSelections || aListeSelections.count() === 0) {
    return;
  }
  let lAvecModif = false;
  aListeSelections.parcourir((aSelection) => {
    if (aMethodeEdition.call(this, aSelection)) {
      aSelection.setEtat(EGenreEtat.Modification);
      lAvecModif = true;
    }
  });
  if (lAvecModif) {
    this.setEtatSaisie(true);
    this.getInstance(this.identReleve).focusSurPremierElement();
    this.getInstance(this.identReleve).actualiser({ conserverSelection: true });
  }
}
function _modifierNiveauAcquisitionDeSelectionCourante(aNiveau) {
  if (!aNiveau) {
    return;
  }
  const lListe = this.getInstance(this.identReleve),
    lSelections = lListe.getListeElementsSelection();
  if (lSelections.count() === 0) {
    return;
  }
  _editionListeSelectionListe.call(this, lSelections, (aSelection) => {
    if (aSelection.getGenre() === EGenreRessource.ElementPilier) {
      return false;
    } else if (
      aSelection.niveauEstEditable &&
      !!aNiveau &&
      (!aSelection.niveauDAcquisition ||
        aSelection.niveauDAcquisition.getGenre() !== aNiveau.getGenre())
    ) {
      aSelection.niveauDAcquisition = aNiveau;
      aSelection.dateValidation = GDate.getDateCourante();
      return true;
    }
  });
}
function _modifierNiveauCEDeSelectionCourante(aNiveauEquivalenceCE) {
  if (!aNiveauEquivalenceCE) {
    return;
  }
  const lListe = this.getInstance(this.identReleve),
    lSelections = lListe.getListeElementsSelection();
  if (lSelections.count() === 0) {
    return;
  }
  _editionListeSelectionListe.call(this, lSelections, (aSelection) => {
    if (
      aSelection.niveauEstEditable &&
      aSelection.getGenre() === EGenreRessource.ElementPilier
    ) {
      aSelection.niveauDEquivalenceCE =
        aNiveauEquivalenceCE.getGenre() === TypeNiveauEquivalenceCE.TNECE_Aucun
          ? null
          : aNiveauEquivalenceCE;
      return true;
    }
  });
}
function _evenementSurListe(aParametres) {
  switch (aParametres.genreEvenement) {
    case EGenreEvenementListe.Edition:
      switch (aParametres.idColonne) {
        case DonneesListe_BilanParDomaine.colonnes.niveau:
          aParametres.ouvrirMenuContextuel();
          break;
      }
      break;
    case EGenreEvenementListe.KeyUpListe:
      _surKeyUpListe.call(this, aParametres.event);
      break;
  }
}
function _surKeyUpListe(aEvent) {
  const lListeSelections = this.getInstance(
    this.identReleve,
  ).getListeElementsSelection();
  if (!lListeSelections || lListeSelections.count() === 0) {
    return;
  }
  let lNeContientQueDesElementsPilier;
  lListeSelections.parcourir((aSelection) => {
    if (
      lNeContientQueDesElementsPilier === undefined ||
      lNeContientQueDesElementsPilier === true
    ) {
      lNeContientQueDesElementsPilier =
        aSelection.getGenre() === EGenreRessource.ElementPilier;
    }
  });
  if (lNeContientQueDesElementsPilier) {
    const lEventKey =
      !!aEvent.key && !!aEvent.key.toLowerCase ? aEvent.key.toLowerCase() : "";
    const lNiveauEquivalenceCE =
      TypeNiveauEquivalenceCEUtil.getTypeParRaccourci(false, lEventKey);
    if (!!lNiveauEquivalenceCE) {
      _modifierNiveauCEDeSelectionCourante.call(this, lNiveauEquivalenceCE);
    }
  } else {
    if (GParametres.listeNiveauxDAcquisitions) {
      const lNiveauxConcernes =
        GParametres.listeNiveauxDAcquisitions.getListeElements((D) => {
          return D.actifPour.contains(
            TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
          );
        });
      const lNiveau = TUtilitaireCompetences.getNiveauAcqusitionDEventClavier(
        aEvent,
        lNiveauxConcernes,
      );
      if (!!lNiveau) {
        _modifierNiveauAcquisitionDeSelectionCourante.call(this, lNiveau);
      }
    }
  }
}
function _initialiseTripleCombo(aInstance) {
  aInstance.setParametres([EGenreRessource.Classe, EGenreRessource.Eleve]);
}
function _evenementSurTripleCombo() {
  this.afficherBandeau(true);
  this.afficherPage();
}
module.exports = { InterfaceCompetencesNumeriques_Saisie };
