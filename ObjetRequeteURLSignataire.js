exports.ObjetRequeteURLSignataire = exports.TypeActionSignataire = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
var TypeActionSignataire;
(function (TypeActionSignataire) {
	TypeActionSignataire[(TypeActionSignataire["signer"] = 0)] = "signer";
	TypeActionSignataire[(TypeActionSignataire["voirDocument"] = 1)] =
		"voirDocument";
})(
	TypeActionSignataire ||
		(exports.TypeActionSignataire = TypeActionSignataire = {}),
);
class ObjetRequeteURLSignataire extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteURLSignataire = ObjetRequeteURLSignataire;
CollectionRequetes_1.Requetes.inscrire(
	"URLSignataire",
	ObjetRequeteURLSignataire,
);
