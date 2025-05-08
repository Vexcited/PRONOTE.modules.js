exports.UtilitaireInitCalendrier = void 0;
const Enumere_DomaineFrequence_1 = require("Enumere_DomaineFrequence");
exports.UtilitaireInitCalendrier = {
  init(aCalendrier, aOptions) {
    aCalendrier.setOptionsCalendrier(
      Object.assign(
        {
          avecControlePeriodeConsultation: true,
          numeroPremiereSemaine:
            GApplication.getObjetParametres().numeroPremiereSemaine,
          addClasseJour: function (aInstance, aNumeroJour) {
            if (aInstance.frequences && aInstance.frequences[aNumeroJour]) {
              if (
                aInstance.frequences[aNumeroJour].genre ===
                Enumere_DomaineFrequence_1.EGenreDomaineFrequence.QZ1
              ) {
                return "quinzaine-1";
              }
              if (
                aInstance.frequences[aNumeroJour].genre ===
                Enumere_DomaineFrequence_1.EGenreDomaineFrequence.QZ2
              ) {
                return "quinzaine-2";
              }
            }
            return null;
          },
        },
        aOptions,
      ),
    );
  },
};
