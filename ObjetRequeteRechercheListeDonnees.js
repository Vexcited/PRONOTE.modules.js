exports.ObjetRequeteRechercheListeDonnees = exports.TypeRechercheListe = void 0;
var TypeRechercheListe;
(function (TypeRechercheListe) {
  TypeRechercheListe[(TypeRechercheListe["trl_ville"] = 0)] = "trl_ville";
  TypeRechercheListe[(TypeRechercheListe["trl_pays"] = 1)] = "trl_pays";
  TypeRechercheListe[(TypeRechercheListe["trl_profession"] = 2)] =
    "trl_profession";
  TypeRechercheListe[(TypeRechercheListe["trl_etablissement"] = 3)] =
    "trl_etablissement";
  TypeRechercheListe[(TypeRechercheListe["trl_fonctionEntreprise"] = 4)] =
    "trl_fonctionEntreprise";
})(
  TypeRechercheListe || (exports.TypeRechercheListe = TypeRechercheListe = {}),
);
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteRechercheListeDonnees extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
  lancerRequete(aParametres) {
    $.extend(this.JSON, aParametres);
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel(this.JSONReponse);
  }
}
exports.ObjetRequeteRechercheListeDonnees = ObjetRequeteRechercheListeDonnees;
CollectionRequetes_1.Requetes.inscrire(
  "RechercheListeDonnees",
  ObjetRequeteRechercheListeDonnees,
);
