exports.ObjetRequeteSaisieTokenPush = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const TypeGenreTokenPush_1 = require("TypeGenreTokenPush");
const AccessApp_1 = require("AccessApp");
class ObjetRequeteSaisieTokenPush extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
		this.setOptions({ afficherMessageErreur: false });
	}
	lancerRequete(aParam) {
		const lMapGenreToken = {
			android: TypeGenreTokenPush_1.TypeGenreTokenPush.GTP_TokenAndroid,
			ios: TypeGenreTokenPush_1.TypeGenreTokenPush.GTP_TokenIos,
			web: TypeGenreTokenPush_1.TypeGenreTokenPush.GTP_TokenWeb,
			androidhms: TypeGenreTokenPush_1.TypeGenreTokenPush.GTP_TokenHuawei,
		};
		this.JSON = {
			token: aParam.token,
			genreToken: lMapGenreToken[aParam.platform.toLowerCase()],
			uuid: aParam.uuid,
			suppr: aParam.suppr,
		};
		if ((0, AccessApp_1.getApp)().getModeExclusif()) {
			return Promise.reject();
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieTokenPush = ObjetRequeteSaisieTokenPush;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieTokenPush",
	ObjetRequeteSaisieTokenPush,
);
