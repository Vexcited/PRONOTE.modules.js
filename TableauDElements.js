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
		const lNbElements = this.elements.length;
		let Trouve = false;
		let I = 0;
		while (!Trouve && I < lNbElements) {
			if (this.elements[I].getNom() === aNomElement) {
				Trouve = true;
				return this.elements[I];
			}
			I++;
		}
		if (!Trouve) {
			return null;
		}
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
