exports.ObjetGrilleTranches = void 0;
class ObjetGrilleTranches {
  constructor() {
    this.init();
  }
  init() {
    this.tranches = [];
    return this;
  }
  add(aTranche) {
    const lTranche = aTranche || {};
    lTranche.numeroTranche = this.tranches.length;
    this.tranches.push(lTranche);
    return this;
  }
  get(aNumeroTranche) {
    return this.tranches[aNumeroTranche];
  }
  count() {
    return this.tranches.length;
  }
  parcourir(aFunction) {
    this.tranches.every((aTranche, aIndex) => {
      const lResult = aFunction(
        aIndex,
        aTranche,
        aIndex === this.tranches.length - 1,
      );
      return lResult !== false;
    }, this);
    return this;
  }
  getTailleGouttiere(aNumeroTranche) {
    if (aNumeroTranche >= 0 && aNumeroTranche < this.tranches.length - 1) {
      const lTranche = this.tranches[aNumeroTranche];
      if (lTranche) {
        return lTranche.tailleGouttiere || 0;
      }
    }
    return 0;
  }
}
exports.ObjetGrilleTranches = ObjetGrilleTranches;
