const { InterfacePage } = require("InterfacePage.js");
const { ObjetDocumentsATelecharger } = require("ObjetDocumentsATelecharger.js");
const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetTri } = require("ObjetTri.js");
const { GDate } = require("ObjetDate.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
Requetes.inscrire("ListeElevesBIA", ObjetRequeteConsultation);
class InterfaceListeElevesBIA extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.avecFiltreEleves = true;
	}
	construireInstances() {
		this.avecBandeau = true;
		this.GenreStructure = EStructureAffichage.Autre;
		this.identListe = this.add(ObjetListe, _evenementListe, _initListe);
		this.identDoc = this.add(ObjetDocumentsATelecharger, null, (aInstance) => {
			if (GNavigateur.isLayoutTactile) {
				aInstance.setOptions({ avecScroll: false });
			}
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbUniquementAnneeEnCours: {
				getValue() {
					return aInstance.avecFiltreEleves;
				},
				setValue(aValue) {
					aInstance.avecFiltreEleves = aValue;
					aInstance.recupererDonnees();
				},
				getDisabled() {
					false;
				},
			},
		});
	}
	construireStructureAffichageAutre() {
		return [
			'<div class="Espace BorderBox Table flex-contain cols flex-gap-l',
			GNavigateur.isLayoutTactile ? " height-auto" : "",
			'">',
			GApplication.droits.get(TypeDroits.eleves.voirTousLesEleves)
				? `<ie-checkbox ie-model="cbUniquementAnneeEnCours">${GTraductions.getValeur("InterfaceListeElevesBIA.afficherUniquement")}</ie-checkbox>`
				: "",
			'<div class="flex-contain full-height">',
			'<div style="flex:none; width:400px; height:100%;" id="' +
				this.getInstance(this.identListe).getNom() +
				'"></div>',
			'<div style="height:100%; padding-left: 10px; width:400px" id="' +
				this.getInstance(this.identDoc).getNom() +
				'"></div>',
			"</div>",
			"</div>",
		].join("");
	}
	recupererDonnees() {
		Requetes("ListeElevesBIA", this)
			.lancerRequete({ avecFiltreEleves: this.avecFiltreEleves })
			.then((aJSON) => {
				this.getInstance(this.identListe).setDonnees(
					new DonneesListe_elevesBIA(aJSON.liste),
				);
				this.getInstance(this.identDoc).setDonnees({
					listeDocs: new ObjetListeElements(),
				});
			});
	}
}
function _initListe(aInstance) {
	aInstance.setOptionsListe({
		colonnes: [
			{
				id: DonneesListe_elevesBIA.colonnes.nom,
				taille: "100%",
				titre: GTraductions.getValeur("BulletinEtReleve.Eleve"),
			},
			{
				id: DonneesListe_elevesBIA.colonnes.neLe,
				taille: 80,
				titre: GTraductions.getValeur("ListeRessources.NeLe"),
			},
		],
		nonEditable: true,
	});
	GEtatUtilisateur.setTriListe({
		liste: aInstance,
		tri: DonneesListe_elevesBIA.colonnes.nom,
	});
}
function _evenementListe(aParametres) {
	if (aParametres.genreEvenement === EGenreEvenementListe.Selection) {
		this.getInstance(this.identDoc)
			.setDonnees({
				listeDocs: aParametres.article.listeDocs,
				listeElevesBIA: aParametres.article.listeElevesBIA,
			})
			.then((aParams) => {
				aParametres.article.listeDocs = aParams ? aParams.listeDocs : null;
			});
	}
}
class DonneesListe_elevesBIA extends ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecEvnt_Selection: true });
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_elevesBIA.colonnes.nom:
				return aParams.article.nom + " " + aParams.article.prenom;
			case DonneesListe_elevesBIA.colonnes.neLe:
				return GDate.formatDate(aParams.article.neLe, "%JJ/%MM/%AAAA");
		}
	}
	getTri(aColonneTri, aGenreTri) {
		const lTris = [];
		switch (this.getId(aColonneTri)) {
			case DonneesListe_elevesBIA.colonnes.nom:
				lTris.push(
					ObjetTri.init("nom", aGenreTri),
					ObjetTri.init("prenom", aGenreTri),
					ObjetTri.init("neLe"),
				);
				break;
			case DonneesListe_elevesBIA.colonnes.neLe:
				lTris.push(
					ObjetTri.init("neLe", aGenreTri),
					ObjetTri.init("nom"),
					ObjetTri.init("prenom"),
				);
				break;
		}
		return lTris;
	}
}
DonneesListe_elevesBIA.colonnes = { nom: "nom", neLe: "neLe" };
module.exports = { InterfaceListeElevesBIA };
