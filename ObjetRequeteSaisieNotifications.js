exports.ObjetRequeteSaisieNotifications = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieNotifications extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
exports.ObjetRequeteSaisieNotifications = ObjetRequeteSaisieNotifications;
CollectionRequetes_1.Requetes.inscrire(
	"SaisiePreferencesNotifications",
	ObjetRequeteSaisieNotifications,
);
