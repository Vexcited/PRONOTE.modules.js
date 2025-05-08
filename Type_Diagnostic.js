exports.TypeDiagnosticUtil = exports.TypeDiagnostic = void 0;
var TypeDiagnostic;
(function (TypeDiagnostic) {
  TypeDiagnostic[(TypeDiagnostic["DiagAucun"] = 0)] = "DiagAucun";
  TypeDiagnostic[(TypeDiagnostic["DiagVoeuCours"] = 1)] = "DiagVoeuCours";
  TypeDiagnostic[(TypeDiagnostic["DiagVoeuRessource"] = 2)] =
    "DiagVoeuRessource";
  TypeDiagnostic[(TypeDiagnostic["DiagRepartitionQuinzaine"] = 3)] =
    "DiagRepartitionQuinzaine";
  TypeDiagnostic[(TypeDiagnostic["DiagMaximumHoraireRessourceJourneeAB"] = 4)] =
    "DiagMaximumHoraireRessourceJourneeAB";
  TypeDiagnostic[(TypeDiagnostic["DiagMaximumHoraireRessourceMatinAB"] = 5)] =
    "DiagMaximumHoraireRessourceMatinAB";
  TypeDiagnostic[(TypeDiagnostic["DiagMaximumHoraireRessourceSoirAB"] = 6)] =
    "DiagMaximumHoraireRessourceSoirAB";
  TypeDiagnostic[
    (TypeDiagnostic["DiagMaximumHoraireRessourceMatinOuSoirAB"] = 7)
  ] = "DiagMaximumHoraireRessourceMatinOuSoirAB";
  TypeDiagnostic[(TypeDiagnostic["DiagMaximumHoraireRessourceJourneeQ"] = 8)] =
    "DiagMaximumHoraireRessourceJourneeQ";
  TypeDiagnostic[(TypeDiagnostic["DiagMaximumHoraireRessourceMatinQ"] = 9)] =
    "DiagMaximumHoraireRessourceMatinQ";
  TypeDiagnostic[(TypeDiagnostic["DiagMaximumHoraireRessourceSoirQ"] = 10)] =
    "DiagMaximumHoraireRessourceSoirQ";
  TypeDiagnostic[
    (TypeDiagnostic["DiagMaximumHoraireRessourceMatinOuSoirQ"] = 11)
  ] = "DiagMaximumHoraireRessourceMatinOuSoirQ";
  TypeDiagnostic[(TypeDiagnostic["DiagPlageHoraireGarantie"] = 12)] =
    "DiagPlageHoraireGarantie";
  TypeDiagnostic[(TypeDiagnostic["DiagDemiJourneeTravaillee"] = 13)] =
    "DiagDemiJourneeTravaillee";
  TypeDiagnostic[(TypeDiagnostic["DiagSuccessionMatiere"] = 14)] =
    "DiagSuccessionMatiere";
  TypeDiagnostic[(TypeDiagnostic["DiagMatieresIncompatiblesJournee"] = 15)] =
    "DiagMatieresIncompatiblesJournee";
  TypeDiagnostic[(TypeDiagnostic["DiagMatieresIncompatiblesMatin"] = 16)] =
    "DiagMatieresIncompatiblesMatin";
  TypeDiagnostic[(TypeDiagnostic["DiagMatieresIncompatiblesSoir"] = 17)] =
    "DiagMatieresIncompatiblesSoir";
  TypeDiagnostic[
    (TypeDiagnostic["DiagMatieresIncompatiblesMatinOuSoir"] = 18)
  ] = "DiagMatieresIncompatiblesMatinOuSoir";
  TypeDiagnostic[(TypeDiagnostic["DiagMatieresIncompatiblesDeuxJours"] = 19)] =
    "DiagMatieresIncompatiblesDeuxJours";
  TypeDiagnostic[(TypeDiagnostic["DiagRecreation"] = 20)] = "DiagRecreation";
  TypeDiagnostic[(TypeDiagnostic["DiagMaximumHoraireMatiereJourneeAB"] = 21)] =
    "DiagMaximumHoraireMatiereJourneeAB";
  TypeDiagnostic[(TypeDiagnostic["DiagMaximumHoraireMatiereMatinAB"] = 22)] =
    "DiagMaximumHoraireMatiereMatinAB";
  TypeDiagnostic[(TypeDiagnostic["DiagMaximumHoraireMatiereSoirAB"] = 23)] =
    "DiagMaximumHoraireMatiereSoirAB";
  TypeDiagnostic[
    (TypeDiagnostic["DiagMaximumHoraireMatiereMatinOuSoirAB"] = 24)
  ] = "DiagMaximumHoraireMatiereMatinOuSoirAB";
  TypeDiagnostic[(TypeDiagnostic["DiagMaximumHoraireMatiereJourneeQ"] = 25)] =
    "DiagMaximumHoraireMatiereJourneeQ";
  TypeDiagnostic[(TypeDiagnostic["DiagMaximumHoraireMatiereMatinQ"] = 26)] =
    "DiagMaximumHoraireMatiereMatinQ";
  TypeDiagnostic[(TypeDiagnostic["DiagMaximumHoraireMatiereSoirQ"] = 27)] =
    "DiagMaximumHoraireMatiereSoirQ";
  TypeDiagnostic[
    (TypeDiagnostic["DiagMaximumHoraireMatiereMatinOuSoirQ"] = 28)
  ] = "DiagMaximumHoraireMatiereMatinOuSoirQ";
  TypeDiagnostic[(TypeDiagnostic["DiagIndisponibiliteSoupleClasse"] = 29)] =
    "DiagIndisponibiliteSoupleClasse";
  TypeDiagnostic[(TypeDiagnostic["DiagIndisponibiliteSoupleProf"] = 30)] =
    "DiagIndisponibiliteSoupleProf";
  TypeDiagnostic[(TypeDiagnostic["DiagIndisponibiliteSoupleSalle"] = 31)] =
    "DiagIndisponibiliteSoupleSalle";
  TypeDiagnostic[(TypeDiagnostic["DiagIndisponibiliteSoupleCours"] = 32)] =
    "DiagIndisponibiliteSoupleCours";
  TypeDiagnostic[(TypeDiagnostic["DiagPoidsPedagogiquesJournee"] = 33)] =
    "DiagPoidsPedagogiquesJournee";
  TypeDiagnostic[(TypeDiagnostic["DiagPoidsPedagogiquesMatin"] = 34)] =
    "DiagPoidsPedagogiquesMatin";
  TypeDiagnostic[(TypeDiagnostic["DiagPoidsPedagogiquesSoir"] = 35)] =
    "DiagPoidsPedagogiquesSoir";
  TypeDiagnostic[(TypeDiagnostic["DiagPoidsPedagogiquesMatinOuSoir"] = 36)] =
    "DiagPoidsPedagogiquesMatinOuSoir";
  TypeDiagnostic[
    (TypeDiagnostic["DiagSitesIncompatiblesHeureTransition"] = 37)
  ] = "DiagSitesIncompatiblesHeureTransition";
  TypeDiagnostic[(TypeDiagnostic["DiagSitesIncompatiblesDureeTrajet"] = 38)] =
    "DiagSitesIncompatiblesDureeTrajet";
  TypeDiagnostic[
    (TypeDiagnostic["DiagSitesIncompatiblesNbTransitionsJour"] = 39)
  ] = "DiagSitesIncompatiblesNbTransitionsJour";
  TypeDiagnostic[(TypeDiagnostic["DiagDemiPensionPasDeService"] = 40)] =
    "DiagDemiPensionPasDeService";
  TypeDiagnostic[(TypeDiagnostic["DiagDemiPensionMaximaDepasses"] = 41)] =
    "DiagDemiPensionMaximaDepasses";
  TypeDiagnostic[(TypeDiagnostic["DiagIndisponibiliteCours"] = 42)] =
    "DiagIndisponibiliteCours";
  TypeDiagnostic[(TypeDiagnostic["DiagChoixSemaineCours"] = 43)] =
    "DiagChoixSemaineCours";
  TypeDiagnostic[(TypeDiagnostic["DiagIndisponibiliteDureRessource"] = 44)] =
    "DiagIndisponibiliteDureRessource";
  TypeDiagnostic[(TypeDiagnostic["DiagPicOccupation"] = 45)] =
    "DiagPicOccupation";
  TypeDiagnostic[(TypeDiagnostic["DiagOccupeCoursPrioritaire"] = 46)] =
    "DiagOccupeCoursPrioritaire";
  TypeDiagnostic[(TypeDiagnostic["DiagOccupe"] = 47)] = "DiagOccupe";
  TypeDiagnostic[(TypeDiagnostic["DiagOccupeVerrouilleDure"] = 48)] =
    "DiagOccupeVerrouilleDure";
  TypeDiagnostic[(TypeDiagnostic["DiagOccupePermanence"] = 49)] =
    "DiagOccupePermanence";
  TypeDiagnostic[(TypeDiagnostic["DiagOccupePermanenceVerrouillee"] = 50)] =
    "DiagOccupePermanenceVerrouillee";
  TypeDiagnostic[(TypeDiagnostic["DiagOrdreHebdo"] = 51)] = "DiagOrdreHebdo";
  TypeDiagnostic[(TypeDiagnostic["DiagProblemeSurSalle"] = 52)] =
    "DiagProblemeSurSalle";
  TypeDiagnostic[(TypeDiagnostic["DiagPeriodeCloturee"] = 53)] =
    "DiagPeriodeCloturee";
  TypeDiagnostic[(TypeDiagnostic["DiagIndisponibiliteEtablissement"] = 54)] =
    "DiagIndisponibiliteEtablissement";
  TypeDiagnostic[(TypeDiagnostic["DiagHorsGrille"] = 55)] = "DiagHorsGrille";
  TypeDiagnostic[(TypeDiagnostic["DiagJoursEcourtesGarantis"] = 56)] =
    "DiagJoursEcourtesGarantis";
  TypeDiagnostic[(TypeDiagnostic["DiagAbsenceRessource"] = 57)] =
    "DiagAbsenceRessource";
  TypeDiagnostic[(TypeDiagnostic["DiagRemplacementHorsTrou"] = 58)] =
    "DiagRemplacementHorsTrou";
  TypeDiagnostic[(TypeDiagnostic["DiagRemplacementHorsJourneePresence"] = 59)] =
    "DiagRemplacementHorsJourneePresence";
  TypeDiagnostic[
    (TypeDiagnostic["DiagRemplacementHorsDemiJourneePresence"] = 60)
  ] = "DiagRemplacementHorsDemiJourneePresence";
  TypeDiagnostic[(TypeDiagnostic["DiagRemplacementHorsPriorite1"] = 61)] =
    "DiagRemplacementHorsPriorite1";
  TypeDiagnostic[(TypeDiagnostic["DiagRemplacementHorsPriorite2"] = 62)] =
    "DiagRemplacementHorsPriorite2";
  TypeDiagnostic[(TypeDiagnostic["DiagRemplacementHorsPriorite3"] = 63)] =
    "DiagRemplacementHorsPriorite3";
  TypeDiagnostic[(TypeDiagnostic["DiagJourFerie"] = 64)] = "DiagJourFerie";
  TypeDiagnostic[(TypeDiagnostic["DiagPresenceConseil"] = 65)] =
    "DiagPresenceConseil";
  TypeDiagnostic[(TypeDiagnostic["DiagEnchainementImposeJournee"] = 66)] =
    "DiagEnchainementImposeJournee";
  TypeDiagnostic[(TypeDiagnostic["DiagEnchainementImposeDemiJournee"] = 67)] =
    "DiagEnchainementImposeDemiJournee";
  TypeDiagnostic[(TypeDiagnostic["DiagChangementCycleGAEV"] = 68)] =
    "DiagChangementCycleGAEV";
  TypeDiagnostic[
    (TypeDiagnostic["DiagSitesIncompatiblesNbTransitionsHebdo"] = 69)
  ] = "DiagSitesIncompatiblesNbTransitionsHebdo";
  TypeDiagnostic[
    (TypeDiagnostic["DiagRemplacementHorsMemeSitePresence"] = 70)
  ] = "DiagRemplacementHorsMemeSitePresence";
  TypeDiagnostic[(TypeDiagnostic["DiagConseilOccupeOO"] = 71)] =
    "DiagConseilOccupeOO";
  TypeDiagnostic[(TypeDiagnostic["DiagConseilOccupeOOVerrou"] = 72)] =
    "DiagConseilOccupeOOVerrou";
  TypeDiagnostic[(TypeDiagnostic["DiagConseilOccupeOF"] = 73)] =
    "DiagConseilOccupeOF";
  TypeDiagnostic[(TypeDiagnostic["DiagConseilOccupeFO"] = 74)] =
    "DiagConseilOccupeFO";
  TypeDiagnostic[(TypeDiagnostic["DiagConseilOccupeFF"] = 75)] =
    "DiagConseilOccupeFF";
  TypeDiagnostic[(TypeDiagnostic["DiagMatieresEcartDj"] = 76)] =
    "DiagMatieresEcartDj";
  TypeDiagnostic[(TypeDiagnostic["DiagIndisponibiliteSouplePersonnel"] = 77)] =
    "DiagIndisponibiliteSouplePersonnel";
  TypeDiagnostic[(TypeDiagnostic["DiagDemiPensionPasDeServiceSeul"] = 78)] =
    "DiagDemiPensionPasDeServiceSeul";
  TypeDiagnostic[(TypeDiagnostic["DiagIndisponibiliteSoupleMateriel"] = 79)] =
    "DiagIndisponibiliteSoupleMateriel";
  TypeDiagnostic[(TypeDiagnostic["DiagPauseRencontre"] = 80)] =
    "DiagPauseRencontre";
  TypeDiagnostic[(TypeDiagnostic["DiagInterrencontre"] = 81)] =
    "DiagInterrencontre";
  TypeDiagnostic[(TypeDiagnostic["DiagMatiereOrdreClassePartiesFixe"] = 82)] =
    "DiagMatiereOrdreClassePartiesFixe";
  TypeDiagnostic[
    (TypeDiagnostic["DiagMatiereOrdreClassePartiesComplexe"] = 83)
  ] = "DiagMatiereOrdreClassePartiesComplexe";
  TypeDiagnostic[
    (TypeDiagnostic["DiagSitesIncompatiblesHeureTransitionRecreation"] = 84)
  ] = "DiagSitesIncompatiblesHeureTransitionRecreation";
  TypeDiagnostic[(TypeDiagnostic["DiagOccupeSuperposable"] = 85)] =
    "DiagOccupeSuperposable";
  TypeDiagnostic[(TypeDiagnostic["DiagDebutCoursInterdit"] = 86)] =
    "DiagDebutCoursInterdit";
  TypeDiagnostic[(TypeDiagnostic["DiagMaximumPresentielRessource"] = 87)] =
    "DiagMaximumPresentielRessource";
  TypeDiagnostic[(TypeDiagnostic["DiagItalieProfHoraireRisque"] = 88)] =
    "DiagItalieProfHoraireRisque";
  TypeDiagnostic[(TypeDiagnostic["DiagItalieProfJourRisque"] = 89)] =
    "DiagItalieProfJourRisque";
  TypeDiagnostic[(TypeDiagnostic["DiagOccupeCoursNonPrioritaire"] = 90)] =
    "DiagOccupeCoursNonPrioritaire";
  TypeDiagnostic[(TypeDiagnostic["DiagAbsenceOccupableRessource"] = 91)] =
    "DiagAbsenceOccupableRessource";
})(TypeDiagnostic || (exports.TypeDiagnostic = TypeDiagnostic = {}));
const TypeDiagnosticUtil = {
  getDiagnosticsDP() {
    return [
      TypeDiagnostic.DiagDemiPensionPasDeService,
      TypeDiagnostic.DiagDemiPensionPasDeServiceSeul,
      TypeDiagnostic.DiagDemiPensionMaximaDepasses,
    ];
  },
  getDiagnosticsSite() {
    return [
      TypeDiagnostic.DiagSitesIncompatiblesHeureTransition,
      TypeDiagnostic.DiagSitesIncompatiblesDureeTrajet,
      TypeDiagnostic.DiagSitesIncompatiblesNbTransitionsJour,
      TypeDiagnostic.DiagSitesIncompatiblesNbTransitionsHebdo,
    ];
  },
  getDiagnosticsAutorises() {
    return [
      TypeDiagnostic.DiagOccupePermanence,
      TypeDiagnostic.DiagOccupePermanenceVerrouillee,
      TypeDiagnostic.DiagIndisponibiliteDureRessource,
      TypeDiagnostic.DiagIndisponibiliteEtablissement,
      TypeDiagnostic.DiagOccupeSuperposable,
    ].concat(TypeDiagnosticUtil.getDiagnosticsDP());
  },
};
exports.TypeDiagnosticUtil = TypeDiagnosticUtil;
