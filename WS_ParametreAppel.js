exports.NomEtValeur =
	exports.ParametreTableauNomsEtValeurs =
	exports.ParametreObject =
	exports.ParametreArray =
	exports.ParametreDate =
	exports.ParametreNumber =
	exports.ParametreBoolean =
	exports.ParametreString =
		void 0;
const TableauDElements_1 = require("TableauDElements");
function _valeurTexte(aNoeudXml) {
	const lElements = aNoeudXml.childNodes;
	let lValeur = "";
	for (
		let lIndice = 0, lTaille = lElements.length;
		lIndice < lTaille;
		lIndice++
	) {
		const lElement = lElements[lIndice];
		if (lElement.nodeType !== 3) {
			throw new Error("Noeud texte attendu.");
		}
		lValeur += lElement.nodeValue;
	}
	return lValeur;
}
class ParametreString {
	constructor(aNom, aNomJs) {
		this.nom = aNom;
		this.nomJs = aNomJs || aNom;
	}
	getNom() {
		return this.nom;
	}
	getNomJs() {
		return this.nomJs;
	}
	serialiser(aDocumentXml, aNoeudXml, aValeur) {
		if (aValeur) {
			aNoeudXml.appendChild(aDocumentXml.createTextNode(aValeur));
		}
	}
	deserialiser(aDocumentXml, aNoeudXml) {
		return _valeurTexte(aNoeudXml);
	}
}
exports.ParametreString = ParametreString;
class ParametreBoolean {
	constructor(aNom, aNomJs) {
		this.nom = aNom;
		this.nomJs = aNomJs || aNom;
	}
	getNom() {
		return this.nom;
	}
	getNomJs() {
		return this.nomJs;
	}
	serialiser(aDocumentXml, aNoeudXml, aValeur) {
		const lValeur = aValeur ? "true" : "false";
		aNoeudXml.appendChild(aDocumentXml.createTextNode(lValeur));
	}
	deserialiser(aDocumentXml, aNoeudXml) {
		const lValeur = _valeurTexte(aNoeudXml);
		return lValeur === "1" || lValeur.toLowerCase() === "true";
	}
}
exports.ParametreBoolean = ParametreBoolean;
class ParametreNumber {
	constructor(aNom, aNomJs) {
		this.nom = aNom;
		this.nomJs = aNomJs || aNom;
	}
	getNom() {
		return this.nom;
	}
	getNomJs() {
		return this.nomJs;
	}
	serialiser(aDocumentXml, aNoeudXml, aValeur) {
		aNoeudXml.appendChild(aDocumentXml.createTextNode(aValeur));
	}
	deserialiser(aDocumentXml, aNoeudXml) {
		const lValeur = _valeurTexte(aNoeudXml);
		const lValeurNum = Number(lValeur);
		if (isNaN(lValeurNum)) {
			throw new Error(lValeur + " n'est pas une valeur numérique.");
		}
		return lValeurNum;
	}
}
exports.ParametreNumber = ParametreNumber;
class ParametreDate {
	constructor(aNom, aNomJs) {
		this.nom = aNom;
		this.nomJs = aNomJs || aNom;
	}
	getNom() {
		return this.nom;
	}
	getNomJs() {
		return this.nomJs;
	}
	serialiser(aDocumentXml, aNoeudXml, aValeur) {
		aNoeudXml.appendChild(aDocumentXml.createTextNode(aValeur.toISOString()));
	}
	deserialiser(aDocumentXml, aNoeudXml) {
		const lValeur = _valeurTexte(aNoeudXml);
		return new Date(lValeur);
	}
}
exports.ParametreDate = ParametreDate;
class ParametreArray {
	constructor(aNom, aParametreElements, aNomJs) {
		this.nom = aNom;
		this.parametreElements = aParametreElements;
		this.nomJs = aNomJs || aNom;
	}
	getNom() {
		return this.nom;
	}
	getNomJs() {
		return this.nomJs;
	}
	serialiser(aDocumentXml, aNoeudXml, aValeur, aEspaceNommage) {
		const lNomElements = this.parametreElements.nom;
		for (
			let lIndice = 0, lTaille = aValeur.length;
			lIndice < lTaille;
			lIndice++
		) {
			const lElement = aDocumentXml.createElementNS(
				aEspaceNommage,
				lNomElements,
			);
			aNoeudXml.appendChild(lElement);
			this.parametreElements.serialiser(
				aDocumentXml,
				lElement,
				aValeur[lIndice],
				aEspaceNommage,
			);
		}
	}
	deserialiser(aDocumentXml, aNoeudXml) {
		const lValeur = [];
		const lElements = aNoeudXml.childNodes;
		const lNomElements = this.parametreElements.nom;
		for (
			let lIndice = 0, lTaille = lElements.length;
			lIndice < lTaille;
			lIndice++
		) {
			const lElement = lElements[lIndice];
			if (lElement.nodeType === 1) {
				if (lElement.localName !== lNomElements) {
					throw new Error("Élément inattendu " + lElement.localName);
				}
				lValeur.push(
					this.parametreElements.deserialiser(aDocumentXml, lElement),
				);
			}
		}
		return lValeur;
	}
}
exports.ParametreArray = ParametreArray;
class ParametreObject {
	constructor(aParametresMembres) {
		this.parametresMembres = aParametresMembres;
	}
	serialiser(aDocumentXml, aNoeudXml, aValeur, aEspaceNommage) {
		for (
			let lIndice = 0, lTaille = this.parametresMembres.length;
			lIndice < lTaille;
			lIndice++
		) {
			const lParametreMembre = this.parametresMembres[lIndice];
			const lNom = lParametreMembre.getNom();
			const lElement = aDocumentXml.createElementNS(aEspaceNommage, lNom);
			aNoeudXml.appendChild(lElement);
			lParametreMembre.serialiser(
				aDocumentXml,
				lElement,
				aValeur[lParametreMembre.getNomJs()],
				aEspaceNommage,
			);
		}
	}
	deserialiserSurPlace(aDocumentXml, aNoeudXml, aValeur) {
		const lElements = aNoeudXml.childNodes;
		for (
			let lIndice = 0, lTaille = lElements.length;
			lIndice < lTaille;
			lIndice++
		) {
			const lElement = lElements[lIndice];
			if (lElement.nodeType === 1) {
				const lNom = lElement.localName;
				let lParametreElement = null;
				for (
					let lIndice2 = 0, lTaille2 = this.parametresMembres.length;
					lIndice2 < lTaille2;
					lIndice2++
				) {
					const lParametre = this.parametresMembres[lIndice2];
					if (lParametre.getNom() === lNom) {
						lParametreElement = lParametre;
						break;
					}
				}
				if (lParametreElement === null) {
					throw new Error("Élément inattendu " + lNom);
				}
				aValeur[lParametreElement.getNomJs()] = lParametreElement.deserialiser(
					aDocumentXml,
					lElement,
				);
			}
		}
	}
}
exports.ParametreObject = ParametreObject;
class NomEtValeur {
	constructor(aNom) {
		this.nom = aNom;
		this.valeur = null;
	}
	getNom() {
		return this.nom;
	}
	getValeur() {
		return this.valeur;
	}
	setValeur(aValeur) {
		this.valeur = aValeur;
	}
}
exports.NomEtValeur = NomEtValeur;
class ParametreTableauNomsEtValeurs {
	constructor(aNom, aTabParam) {
		this.nom = aNom;
		this.parametres = aTabParam;
	}
	getNom() {
		return this.nom;
	}
	serialiser(aDocumentXml, aNoeudXml, aValeur, aEspaceNommage) {
		for (
			let lIndice = 0, lTaille = this.parametres.length;
			lIndice < lTaille;
			lIndice++
		) {
			const lParametre = this.parametres[lIndice];
			const lNom = lParametre.nom;
			const lElem = aValeur.getElement(lNom);
			if (lElem && lElem.getValeur()) {
				const lElement = aDocumentXml.createElementNS(aEspaceNommage, lNom);
				aNoeudXml.appendChild(lElement);
				lParametre.serialiser(
					aDocumentXml,
					lElement,
					lElem.getValeur(),
					aEspaceNommage,
				);
			}
		}
	}
	deserialiser(aDocumentXml, aNoeudXml) {
		const lValeur = new TableauDElements_1.TableauDElements();
		const lElements = aNoeudXml.childNodes;
		for (
			let lIndice = 0, lTaille = lElements.length;
			lIndice < lTaille;
			lIndice++
		) {
			const lElement = lElements[lIndice];
			if (lElement.nodeType === 1) {
				const lNom = lElement.localName;
				let lParametreElement = null;
				for (
					let lIndice2 = 0, lTaille2 = this.parametres.length;
					lIndice2 < lTaille2;
					lIndice2++
				) {
					const lParametre = this.parametres[lIndice2];
					if (lParametre.nom === lNom) {
						lParametreElement = lParametre;
						break;
					}
				}
				if (lParametreElement === null) {
					throw new Error("Élément inattendu " + lNom);
				}
				const lNomEtValeur = new NomEtValeur(lNom);
				lNomEtValeur.setValeur(
					lParametreElement.deserialiser(aDocumentXml, lElement),
				);
				lValeur.ajouterElement(lNomEtValeur);
			}
		}
		return lValeur;
	}
}
exports.ParametreTableauNomsEtValeurs = ParametreTableauNomsEtValeurs;
