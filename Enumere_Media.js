exports.EGenreMediaUtil = exports.EGenreMedia = void 0;
var EGenreMedia;
(function (EGenreMedia) {
  EGenreMedia[(EGenreMedia["Utilisateur"] = 0)] = "Utilisateur";
  EGenreMedia[(EGenreMedia["Telephone"] = 1)] = "Telephone";
  EGenreMedia[(EGenreMedia["Lettre"] = 2)] = "Lettre";
  EGenreMedia[(EGenreMedia["Fax"] = 3)] = "Fax";
  EGenreMedia[(EGenreMedia["Mail"] = 4)] = "Mail";
  EGenreMedia[(EGenreMedia["Entretien"] = 5)] = "Entretien";
  EGenreMedia[(EGenreMedia["SMS"] = 6)] = "SMS";
  EGenreMedia[(EGenreMedia["LettreManuscrite"] = 7)] = "LettreManuscrite";
  EGenreMedia[(EGenreMedia["MessageRepondeur"] = 8)] = "MessageRepondeur";
})(EGenreMedia || (exports.EGenreMedia = EGenreMedia = {}));
const EGenreMediaUtil = {
  getNomImage(aGenre, aReception) {
    let lNomImage = "";
    if (aGenre > EGenreMedia.Utilisateur) {
      switch (aGenre) {
        case EGenreMedia.Telephone:
          lNomImage = aReception ? "Image_Media_1_Reception" : "Image_Media_1";
          break;
        case EGenreMedia.Lettre:
          lNomImage = aReception ? "Image_Media_2_Reception" : "Image_Media_2";
          break;
        case EGenreMedia.Fax:
          lNomImage = aReception ? "Image_Media_3_Reception" : "Image_Media_3";
          break;
        case EGenreMedia.Mail:
          lNomImage = aReception ? "Image_Media_4_Reception" : "Image_Media_4";
          break;
        case EGenreMedia.Entretien:
          lNomImage = aReception ? "Image_Media_5_Reception" : "Image_Media_5";
          break;
        case EGenreMedia.SMS:
          lNomImage = aReception ? "Image_Media_6_Reception" : "Image_Media_6";
          break;
        case EGenreMedia.LettreManuscrite:
          lNomImage = aReception ? "Image_Media_7_Reception" : "Image_Media_7";
          break;
        case EGenreMedia.MessageRepondeur:
          lNomImage = aReception ? "Image_Media_8_Reception" : "Image_Media_8";
          break;
      }
    }
    return lNomImage;
  },
};
exports.EGenreMediaUtil = EGenreMediaUtil;
