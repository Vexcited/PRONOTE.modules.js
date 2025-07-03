exports.ObjetRequetePageResultatsClasses = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequetePageResultatsClasses extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParams) {
		$.extend(this.JSON, aParams);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequetePageResultatsClasses = ObjetRequetePageResultatsClasses;
CollectionRequetes_1.Requetes.inscrire(
	"ResultatsClasses",
	ObjetRequetePageResultatsClasses,
);
(function (ObjetRequetePageResultatsClasses) {
	let TypeMoyenneAffichee;
	(function (TypeMoyenneAffichee) {
		TypeMoyenneAffichee[(TypeMoyenneAffichee["Calculee"] = 0)] = "Calculee";
		TypeMoyenneAffichee[(TypeMoyenneAffichee["Proposee"] = 1)] = "Proposee";
		TypeMoyenneAffichee[(TypeMoyenneAffichee["Deliberee"] = 2)] = "Deliberee";
	})(
		(TypeMoyenneAffichee =
			ObjetRequetePageResultatsClasses.TypeMoyenneAffichee ||
			(ObjetRequetePageResultatsClasses.TypeMoyenneAffichee = {})),
	);
})(
	ObjetRequetePageResultatsClasses ||
		(exports.ObjetRequetePageResultatsClasses =
			ObjetRequetePageResultatsClasses =
				{}),
);
