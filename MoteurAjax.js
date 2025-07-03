exports.MoteurAjax = void 0;
const XmlHttp_1 = require("XmlHttp");
class MoteurAjax {
	constructor(aMethode, aModeAsynchrone) {
		this.requeteur = (0, XmlHttp_1.getXmlHttp)();
		this.methode = aMethode;
		this.modeAsynchrone = aModeAsynchrone;
	}
	associerFonctionDeRappel(aMethodeCallback, aObjetPere) {
		this.requeteur.onreadystatechange = () => {
			if (this.requeteur.readyState === 4) {
				switch (this.requeteur.status) {
					case 200:
						if (this.requeteur.responseText) {
							aMethodeCallback.call(aObjetPere, this.requeteur.responseText);
						}
						break;
					case 401:
						(window.top || window).location.replace("deconnexion.html");
						break;
				}
			}
		};
	}
	definirRequete(aURLCible) {
		try {
			if (this.requeteur) {
				this.requeteur.open(this.methode, aURLCible, this.modeAsynchrone);
			}
		} catch (e) {
			if (e instanceof Error) {
				alert(e.name + " | " + e.message);
			} else {
				alert(e);
			}
		}
	}
	envoyerRequete(aDonnees) {
		if (this.requeteur) {
			this.requeteur.send(aDonnees);
		}
	}
	definirEnteteHTTP(aNomEntete, aValeurEntete) {
		if (this.requeteur) {
			this.requeteur.setRequestHeader(aNomEntete, aValeurEntete);
		}
	}
}
exports.MoteurAjax = MoteurAjax;
