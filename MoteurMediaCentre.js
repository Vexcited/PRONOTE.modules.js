exports.MediaCentre = exports.MoteurMediaCentre = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const GlossaireMediaCentre_1 = require("GlossaireMediaCentre");
class MoteurMediaCentre {
	async recupererDonnees() {
		await this.requeteDonnees().then((aJSON) => {
			this.donnees = aJSON.liste;
			if (this.donnees && this.donnees.count() > 0) {
				this.rubriques = new ObjetListeElements_1.ObjetListeElements();
				let lCnt = 1;
				this.rubriques.add(
					ObjetElement_1.ObjetElement.create({
						Genre: "",
						Libelle:
							GlossaireMediaCentre_1.TradGlossaireMediaCentre.ToutesCategories,
						icon: "icon_th_large",
						Position: lCnt,
						compteur: 0,
					}),
				);
				this.donnees.parcourir((aElement) => {
					const lCode = aElement.typePresentation.code;
					const lArtRubrique = this.rubriques.getElementParGenre(lCode);
					if (!lArtRubrique) {
						lCnt++;
						this.rubriques.add(
							ObjetElement_1.ObjetElement.create({
								Genre: lCode,
								Libelle: aElement.typePresentation.getLibelle().ucfirst(),
								Position: lCnt,
								compteur: 1,
							}),
						);
					} else {
						lArtRubrique.compteur++;
					}
				});
			}
		});
	}
	async requeteDonnees() {
		const lReponse = await new ObjetRequeteMediaCentre().lancerRequete();
		return lReponse;
	}
	getLibellePourBandeau() {
		let lResult = "";
		if (this.rubriqueSelectionnee) {
			lResult = this.rubriqueSelectionnee.getLibelle();
		}
		return lResult;
	}
	getLibelleListeVide() {
		return GlossaireMediaCentre_1.TradGlossaireMediaCentre.ListeVide;
	}
	getLibelleAucuneRessource() {
		return GlossaireMediaCentre_1.TradGlossaireMediaCentre.AucuneRessource;
	}
	actualiserDonneesSelonCode(aCode) {
		const lArtRubrique = this.rubriques.getElementParGenre(aCode);
		if (lArtRubrique) {
			this.rubriqueSelectionnee = lArtRubrique;
		}
		this.donnees.parcourir((aElement) => {
			aElement.visible =
				aCode === "" || aElement.typePresentation.code === aCode;
		});
	}
}
exports.MoteurMediaCentre = MoteurMediaCentre;
var MediaCentre;
(function (MediaCentre) {
	let genreEcran;
	(function (genreEcran) {
		genreEcran["selecteur"] = "MediaCentre.selecteur";
		genreEcran["liste"] = "MediaCentre.liste";
	})((genreEcran = MediaCentre.genreEcran || (MediaCentre.genreEcran = {})));
})(MediaCentre || (exports.MediaCentre = MediaCentre = {}));
class ObjetRequeteMediaCentre extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
CollectionRequetes_1.Requetes.inscrire("MediaCentre", ObjetRequeteMediaCentre);
