exports.TypeGenreParcoursEducatifUtil = exports.TypeGenreParcoursEducatif =
	void 0;
var TypeGenreParcoursEducatif;
(function (TypeGenreParcoursEducatif) {
	TypeGenreParcoursEducatif[
		(TypeGenreParcoursEducatif["GPE_ParcoursAvenir"] = 0)
	] = "GPE_ParcoursAvenir";
	TypeGenreParcoursEducatif[
		(TypeGenreParcoursEducatif["GPE_ParcoursCitoyen"] = 1)
	] = "GPE_ParcoursCitoyen";
	TypeGenreParcoursEducatif[
		(TypeGenreParcoursEducatif["GPE_ParcoursArtistique"] = 2)
	] = "GPE_ParcoursArtistique";
	TypeGenreParcoursEducatif[
		(TypeGenreParcoursEducatif["GPE_ParcoursSante"] = 3)
	] = "GPE_ParcoursSante";
	TypeGenreParcoursEducatif[
		(TypeGenreParcoursEducatif["GPE_ParcoursExcellence"] = 4)
	] = "GPE_ParcoursExcellence";
})(
	TypeGenreParcoursEducatif ||
		(exports.TypeGenreParcoursEducatif = TypeGenreParcoursEducatif = {}),
);
const MethodesObjet_1 = require("MethodesObjet");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const TypeGenreParcoursEducatifUtil = {
	getLibelle(aGenre) {
		const lParametresPN = GParametres;
		if (lParametresPN.pourNouvelleCaledonie) {
			switch (aGenre) {
				case TypeGenreParcoursEducatif.GPE_ParcoursAvenir:
					return ObjetTraduction_1.GTraductions.getValeur(
						"TypeGenreParcoursEducatif.libelle.Orientation",
					);
				case TypeGenreParcoursEducatif.GPE_ParcoursCitoyen:
					return ObjetTraduction_1.GTraductions.getValeur(
						"TypeGenreParcoursEducatif.libelle.Civique",
					);
				case TypeGenreParcoursEducatif.GPE_ParcoursArtistique:
					return ObjetTraduction_1.GTraductions.getValeur(
						"TypeGenreParcoursEducatif.libelle.Artistique",
					);
				case TypeGenreParcoursEducatif.GPE_ParcoursExcellence:
					return ObjetTraduction_1.GTraductions.getValeur(
						"TypeGenreParcoursEducatif.libelle.Excellence",
					);
				default:
					return "";
			}
		} else {
			switch (aGenre) {
				case TypeGenreParcoursEducatif.GPE_ParcoursAvenir:
					return ObjetTraduction_1.GTraductions.getValeur(
						"TypeGenreParcoursEducatif.libelle.Avenir",
					);
				case TypeGenreParcoursEducatif.GPE_ParcoursCitoyen:
					return ObjetTraduction_1.GTraductions.getValeur(
						"TypeGenreParcoursEducatif.libelle.Citoyen",
					);
				case TypeGenreParcoursEducatif.GPE_ParcoursArtistique:
					return ObjetTraduction_1.GTraductions.getValeur(
						"TypeGenreParcoursEducatif.libelle.Artistique",
					);
				case TypeGenreParcoursEducatif.GPE_ParcoursSante:
					return ObjetTraduction_1.GTraductions.getValeur(
						"TypeGenreParcoursEducatif.libelle.Sante",
					);
				case TypeGenreParcoursEducatif.GPE_ParcoursExcellence:
					return ObjetTraduction_1.GTraductions.getValeur(
						"TypeGenreParcoursEducatif.libelle.Excellence",
					);
				default:
					return "";
			}
		}
	},
	toListe() {
		const lParametresPN = GParametres;
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
			TypeGenreParcoursEducatif,
		)) {
			const lGenre = TypeGenreParcoursEducatif[lKey];
			if (
				lGenre === TypeGenreParcoursEducatif.GPE_ParcoursExcellence &&
				!lParametresPN.GestionParcoursExcellence
			) {
				continue;
			}
			lListe.addElement(
				new ObjetElement_1.ObjetElement(
					TypeGenreParcoursEducatifUtil.getLibelle(lGenre),
					0,
					lGenre,
				),
			);
		}
		lListe.setTri([ObjetTri_1.ObjetTri.init("Genre")]);
		lListe.trier();
		return lListe;
	},
};
exports.TypeGenreParcoursEducatifUtil = TypeGenreParcoursEducatifUtil;
