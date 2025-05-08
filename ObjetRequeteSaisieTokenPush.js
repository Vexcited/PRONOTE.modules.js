const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { TypeGenreTokenPush } = require("TypeGenreTokenPush.js");
class ObjetRequeteSaisieTokenPush extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
    this.setOptions({ afficherMessageErreur: false });
  }
  lancerRequete(aParam) {
    const lMapGenreToken = {
      android: TypeGenreTokenPush.GTP_TokenAndroid,
      ios: TypeGenreTokenPush.GTP_TokenIos,
      web: TypeGenreTokenPush.GTP_TokenWeb,
      androidhms: TypeGenreTokenPush.GTP_TokenHuawei,
    };
    this.JSON = {
      token: aParam.token,
      genreToken: lMapGenreToken[aParam.platform.toLowerCase()],
      uuid: aParam.uuid,
      suppr: aParam.suppr,
    };
    if (GApplication.getModeExclusif()) {
      return Promise.reject();
    }
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel(this.JSONReponse);
  }
}
Requetes.inscrire("SaisieTokenPush", ObjetRequeteSaisieTokenPush);
module.exports = { ObjetRequeteSaisieTokenPush };
