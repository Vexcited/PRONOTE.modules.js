exports.ObjetException = void 0;
class ObjetException extends Error {
  constructor(aNom, aMessage) {
    super();
    this.name = aNom || "";
    this.message = aMessage || "";
  }
  getMessage(aAvecType) {
    let lMessage = "";
    if (aAvecType === true) {
      lMessage += "[" + this.name + "] ";
    }
    lMessage += this.message;
    return lMessage;
  }
}
exports.ObjetException = ObjetException;
