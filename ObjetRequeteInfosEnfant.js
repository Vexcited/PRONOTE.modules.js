exports.ObjetRequeteInfosEnfant = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteInfosEnfant extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteInfosEnfant = ObjetRequeteInfosEnfant;
CollectionRequetes_1.Requetes.inscrire("InfosEnfant", ObjetRequeteInfosEnfant);
