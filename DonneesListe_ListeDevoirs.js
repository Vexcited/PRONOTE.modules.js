const { GStyle } = require("ObjetStyle.js");
const { GDate } = require("ObjetDate.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetTri } = require("ObjetTri.js");
class DonneesListe_ListeDevoirs extends ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecEdition: false, avecSuppression: false });
	}
	avecMenuContextuel() {
		return false;
	}
	getTri(aColonneDeTri, aGenreTri) {
		const lTris = [
			_getTri.call(this, aColonneDeTri[0], aGenreTri[0]),
			_getTri.call(this, aColonneDeTri[1], aGenreTri[1]),
		];
		return lTris.concat([ObjetTri.init("professeur.Libelle")]);
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeDevoirs.colonnes.professeur:
				return aParams.article.professeur.getLibelle();
			case DonneesListe_ListeDevoirs.colonnes.classe:
				if (aParams.article.classe && aParams.article.classe.existeNumero()) {
					return aParams.article.classe.getLibelle();
				}
				if (aParams.article.groupe && aParams.article.groupe.existeNumero()) {
					return aParams.article.groupe.getLibelle();
				}
				return "";
			case DonneesListe_ListeDevoirs.colonnes.matiere:
				return aParams.article.matiere.getLibelle();
			case DonneesListe_ListeDevoirs.colonnes.sousMatiere:
				return aParams.article.sousMatiere.getLibelle();
			case DonneesListe_ListeDevoirs.colonnes.date:
				return GDate.formatDate(aParams.article.dateDevoir, "%JJ/%MM/%AAAA");
			case DonneesListe_ListeDevoirs.colonnes.publieLe:
				return GDate.formatDate(
					aParams.article.datePublication,
					"%JJ/%MM/%AAAA",
				);
			case DonneesListe_ListeDevoirs.colonnes.periode1:
				return aParams.article.libellePeriode1;
			case DonneesListe_ListeDevoirs.colonnes.periode2:
				return aParams.article.libellePeriode2;
			case DonneesListe_ListeDevoirs.colonnes.qcm:
				return aParams.article.estLieAUnQCM;
			case DonneesListe_ListeDevoirs.colonnes.piecesJointes:
				return aParams.article.avecCorrige ? "Image_Trombone" : "";
			case DonneesListe_ListeDevoirs.colonnes.facultatif: {
				let lFacultatif = "";
				if (aParams.article.facultatif.estFacultatif) {
					lFacultatif =
						'<div class="NoWrap"><div class="InlineBlock AlignementMilieuVertical" style="height: 10px; width: 10px; ' +
						GStyle.composeCouleurBordure(GCouleur.noir) +
						GStyle.composeCouleurFond(aParams.article.facultatif.couleur) +
						'"></div><div class="InlineBlock AlignementMilieuVertical PetitEspaceGauche">' +
						aParams.article.facultatif.getLibelle() +
						"</div> </div>";
				}
				return lFacultatif;
			}
			case DonneesListe_ListeDevoirs.colonnes.commentaire:
				return aParams.article.commentaire;
			case DonneesListe_ListeDevoirs.colonnes.verrouille:
				return aParams.article.verouille
					? '<i class="icon_lock" style="color: red;"></i>'
					: "";
			case DonneesListe_ListeDevoirs.colonnes.cloturee:
				return aParams.article.cloturee ? "Image_Verrou" : "";
			case DonneesListe_ListeDevoirs.colonnes.bareme:
				return aParams.article.bareme.getNote();
			case DonneesListe_ListeDevoirs.colonnes.moyenne:
				return aParams.article.moyenne.getNote();
			case DonneesListe_ListeDevoirs.colonnes.maximum:
				return aParams.article.noteHaute.getNote();
			case DonneesListe_ListeDevoirs.colonnes.minimum:
				return aParams.article.noteBasse.getNote();
			case DonneesListe_ListeDevoirs.colonnes.mediane:
				return aParams.article.noteMediane.getNote();
			case DonneesListe_ListeDevoirs.colonnes.coefficient:
				return aParams.article.coefficient.getNote();
			case DonneesListe_ListeDevoirs.colonnes.devoirSaisiLe:
				return GDate.formatDate(aParams.article.dateCreation, "%JJ/%MM/%AAAA");
		}
		return "";
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeDevoirs.colonnes.qcm:
				return ObjetDonneesListe.ETypeCellule.Coche;
			case DonneesListe_ListeDevoirs.colonnes.piecesJointes:
			case DonneesListe_ListeDevoirs.colonnes.cloturee:
				return ObjetDonneesListe.ETypeCellule.Image;
			case DonneesListe_ListeDevoirs.colonnes.verrouille:
			case DonneesListe_ListeDevoirs.colonnes.facultatif:
				return ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe.ETypeCellule.Texte;
	}
}
DonneesListe_ListeDevoirs.colonnes = {
	professeur: "listeDevoirsProfesseur",
	classe: "listeDevoirsClasse",
	matiere: "listeDevoirsMatiere",
	sousMatiere: "listeDevoirsSousMatiere",
	date: "listeDevoirsDate",
	periode1: "listeDevoirsPeriode1",
	periode2: "listeDevoirsPeriode2",
	publieLe: "listeDevoirsPublieLe",
	facultatif: "listeDevoirsFacultatif",
	qcm: "listeDevoirsQCM",
	commentaire: "listeDevoirsCommentaire",
	piecesJointes: "listeDevoirsPiecesJointes",
	bareme: "listeDevoirsBareme",
	moyenne: "listeDevoirsMoyenne",
	maximum: "listeDevoirsMaximum",
	minimum: "listeDevoirsMinimum",
	mediane: "listeDevoirsMediane",
	coefficient: "listeDevoirsCoefficient",
	verrouille: "listeDevoirsVerrouille",
	cloturee: "listeDevoirsCloturee",
	devoirSaisiLe: "listeDevoirsDevoirSaisiLe",
	dateInitiale: "listeDevoirsDateInitiale",
};
function _getTri(aCol, aGenre) {
	switch (this.getId(aCol)) {
		case DonneesListe_ListeDevoirs.colonnes.date:
			return ObjetTri.init("dateDevoir");
		case DonneesListe_ListeDevoirs.colonnes.publieLe:
			return ObjetTri.init("datePublication");
		case DonneesListe_ListeDevoirs.colonnes.devoirSaisiLe:
			return ObjetTri.init("dateCreation");
		case DonneesListe_ListeDevoirs.colonnes.facultatif:
			return ObjetTri.init("facultatif.Libelle");
		default:
			return ObjetTri.init(this.getValeurPourTri.bind(this, aCol), aGenre);
	}
}
module.exports = { DonneesListe_ListeDevoirs };
