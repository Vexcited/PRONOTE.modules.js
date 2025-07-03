exports.ObjetRequeteSaisieTAFARendre = exports.TypeSaisieTAFARendre = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
var TypeSaisieTAFARendre;
(function (TypeSaisieTAFARendre) {
	TypeSaisieTAFARendre[(TypeSaisieTAFARendre["Rendu"] = 0)] = "Rendu";
	TypeSaisieTAFARendre[(TypeSaisieTAFARendre["CopieEleve"] = 1)] = "CopieEleve";
	TypeSaisieTAFARendre[(TypeSaisieTAFARendre["Verrou"] = 2)] = "Verrou";
	TypeSaisieTAFARendre[(TypeSaisieTAFARendre["CopieCorrigee"] = 3)] =
		"CopieCorrigee";
	TypeSaisieTAFARendre[(TypeSaisieTAFARendre["CommentaireCorrige"] = 4)] =
		"CommentaireCorrige";
	TypeSaisieTAFARendre[(TypeSaisieTAFARendre["DateReportRendu"] = 5)] =
		"DateReportRendu";
	TypeSaisieTAFARendre[(TypeSaisieTAFARendre["annulerProlongation"] = 6)] =
		"annulerProlongation";
})(
	TypeSaisieTAFARendre ||
		(exports.TypeSaisieTAFARendre = TypeSaisieTAFARendre = {}),
);
class ObjetRequeteSaisieTAFARendre extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aTypeSaisie, aDonnees) {
		$.extend(this.JSON, aDonnees);
		aDonnees.listeEleves.setSerialisateurJSON({
			methodeSerialisation: function (aElement, aJSON) {
				switch (aTypeSaisie) {
					case TypeSaisieTAFARendre.Rendu:
						aJSON.estRendu = aElement.estRendu;
						break;
					case TypeSaisieTAFARendre.CopieEleve:
						if (!!aElement.copieEleve && aElement.copieEleve.pourValidation()) {
							aJSON.copieEleve = aElement.copieEleve.toJSON();
							aJSON.copieEleve.idFichier = aElement.copieEleve.idFichier;
						}
						break;
					case TypeSaisieTAFARendre.Verrou:
						aJSON.estVerrouille = aElement.estVerrouille;
						break;
					case TypeSaisieTAFARendre.CopieCorrigee:
						if (
							!!aElement.copieCorrigee &&
							aElement.copieCorrigee.pourValidation()
						) {
							aJSON.copieCorrigee = aElement.copieCorrigee.toJSON();
							aJSON.copieCorrigee.idFichier = aElement.copieCorrigee.idFichier;
						}
						break;
					case TypeSaisieTAFARendre.CommentaireCorrige:
						aJSON.commentaireCorrige = aElement.commentaireCorrige;
						break;
					case TypeSaisieTAFARendre.DateReportRendu:
						aJSON.dateReportRendu = aElement.dateReportRendu;
						break;
					case TypeSaisieTAFARendre.annulerProlongation:
						aJSON.annulationProlongation = aElement.annulationProlongation;
						break;
					default:
						break;
				}
			},
		});
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieTAFARendre = ObjetRequeteSaisieTAFARendre;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieTAFARendre",
	ObjetRequeteSaisieTAFARendre,
);
