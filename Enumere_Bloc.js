exports.EGenreBlocUtil = exports.EGenreBloc = void 0;
var EGenreBloc;
(function (EGenreBloc) {
  EGenreBloc[(EGenreBloc["Actu"] = 1)] = "Actu";
  EGenreBloc[(EGenreBloc["Agenda"] = 2)] = "Agenda";
  EGenreBloc[(EGenreBloc["Discussion"] = 3)] = "Discussion";
  EGenreBloc[(EGenreBloc["Casier"] = 4)] = "Casier";
  EGenreBloc[(EGenreBloc["Absence"] = 5)] = "Absence";
  EGenreBloc[(EGenreBloc["Retard"] = 6)] = "Retard";
  EGenreBloc[(EGenreBloc["TravailAFaire"] = 7)] = "TravailAFaire";
  EGenreBloc[(EGenreBloc["ContenuDeCours"] = 8)] = "ContenuDeCours";
  EGenreBloc[(EGenreBloc["SaisiePrim_CDC"] = 9)] = "SaisiePrim_CDC";
  EGenreBloc[(EGenreBloc["CahiersDeTexte"] = 10)] = "CahiersDeTexte";
  EGenreBloc[(EGenreBloc["Billet"] = 11)] = "Billet";
  EGenreBloc[(EGenreBloc["Activite_Prim"] = 12)] = "Activite_Prim";
  EGenreBloc[(EGenreBloc["InfoSondage"] = 13)] = "InfoSondage";
  EGenreBloc[(EGenreBloc["CahierJournal"] = 14)] = "CahierJournal";
  EGenreBloc[(EGenreBloc["EvenementRappel"] = 15)] = "EvenementRappel";
})(EGenreBloc || (exports.EGenreBloc = EGenreBloc = {}));
const Enumere_Ressource_1 = require("Enumere_Ressource");
const EGenreBlocUtil = {
  associerGenreBlocAListeElements(aGenreBloc, aListeElements) {
    for (let i = 0, lNbr = aListeElements.count(); i < lNbr; i++) {
      const lElement = aListeElements.get(i);
      lElement.genreBloc = aGenreBloc;
    }
  },
  getGenreBlocDeRessource(aGenreRessource) {
    switch (aGenreRessource) {
      case Enumere_Ressource_1.EGenreRessource.Absence:
        return EGenreBloc.Absence;
      case Enumere_Ressource_1.EGenreRessource.Retard:
        return EGenreBloc.Retard;
      default:
    }
  },
};
exports.EGenreBlocUtil = EGenreBlocUtil;
