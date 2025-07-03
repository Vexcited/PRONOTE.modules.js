exports.TableauDElements = void 0;
class TableauDElements {
	constructor() {
		this.elements = [];
	}
	ajouterElement(aElement) {
		const lElement = aElement;
		this.elements.push(lElement);
		return this.elements[this.elements.length - 1];
	}
	getElement(aNomElement) {
		let lElementTrouve = null;
		if (this.elements) {
			for (const lElem of this.elements) {
				if (lElem && lElem.getNom() === aNomElement) {
					lElementTrouve = lElem;
					break;
				}
			}
		}
		return lElementTrouve;
	}
	getElementParPosition(I) {
		return this.elements[I];
	}
	setElementParPosition(I, aElement) {
		this.elements[I] = aElement;
	}
	getNbrElements() {
		return this.elements.length;
	}
	getTabElements() {
		return this.elements;
	}
}
exports.TableauDElements = TableauDElements;
