class ObjetMoteurGrilleSaisie {
  constructor() {}
  selectionCelluleSuivante(aParam) {
    aParam.instanceListe.selectionnerCelluleSuivante(
      Object.assign(
        { entrerEdition: true, avecCelluleEditable: true },
        aParam.suivante,
      ),
    );
  }
  estColVariable(aIdCol, aRacineCol) {
    return aIdCol !== null && aIdCol !== undefined
      ? aIdCol.startsWith(aRacineCol)
      : false;
  }
  getIdColVariable(aIndice, aRacineCol) {
    return aRacineCol + "_" + aIndice;
  }
  getIndiceColVariable(aIdCol) {
    if (aIdCol !== null && aIdCol !== undefined) {
      const lTab = aIdCol.split("_");
      const lTaille = lTab.length;
      return parseInt(lTab[lTaille - 1]);
    }
    return 0;
  }
}
module.exports = { ObjetMoteurGrilleSaisie };
