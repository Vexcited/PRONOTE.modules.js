exports.ObjetRequeteCoursNonAssures = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteCoursNonAssures extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteCoursNonAssures = ObjetRequeteCoursNonAssures;
CollectionRequetes_1.Requetes.inscrire(
	"CoursNonAssures",
	ObjetRequeteCoursNonAssures,
);
