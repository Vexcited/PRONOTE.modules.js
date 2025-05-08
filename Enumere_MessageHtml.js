exports.EGenreMessageHtmlUtil = exports.EGenreMessageHtml = void 0;
var EGenreMessageHtml;
(function (EGenreMessageHtml) {
  EGenreMessageHtml["patiencePDF"] = "patiencePDF";
  EGenreMessageHtml["patiencePDF_Mobile"] = "patiencePDF_mobile";
  EGenreMessageHtml["deconnexionENT"] = "deconnexionENT";
  EGenreMessageHtml["deconnexionENT_Mobile"] = "deconnexionENT_Mobile";
})(EGenreMessageHtml || (exports.EGenreMessageHtml = EGenreMessageHtml = {}));
const EGenreMessageHtmlUtil = {
  construireUrl(aGenreMessageHtml) {
    let lUrl = "message.html";
    if (aGenreMessageHtml) {
      lUrl += "?G=" + aGenreMessageHtml;
    }
    return lUrl;
  },
};
exports.EGenreMessageHtmlUtil = EGenreMessageHtmlUtil;
