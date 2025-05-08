exports.DocumentsATelecharger = void 0;
var DocumentsATelecharger;
(function (DocumentsATelecharger) {
  let GenreRubriqueDAT;
  (function (GenreRubriqueDAT) {
    GenreRubriqueDAT[(GenreRubriqueDAT["bulletins"] = 1)] = "bulletins";
    GenreRubriqueDAT[(GenreRubriqueDAT["documents"] = 2)] = "documents";
    GenreRubriqueDAT[(GenreRubriqueDAT["documentsAFournir"] = 3)] =
      "documentsAFournir";
  })(
    (GenreRubriqueDAT =
      DocumentsATelecharger.GenreRubriqueDAT ||
      (DocumentsATelecharger.GenreRubriqueDAT = {})),
  );
})(
  DocumentsATelecharger ||
    (exports.DocumentsATelecharger = DocumentsATelecharger = {}),
);
