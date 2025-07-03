exports.InterfaceListeElevesBIA = void 0;
const InterfacePage_1 = require("InterfacePage");
const ObjetDocumentsATelecharger_1 = require("ObjetDocumentsATelecharger");
const ObjetListe_1 = require("ObjetListe");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTri_1 = require("ObjetTri");
const ObjetDate_1 = require("ObjetDate");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetRequeteListeElevesBIA_1 = require("ObjetRequeteListeElevesBIA");
const AccessApp_1 = require("AccessApp");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
class InterfaceListeElevesBIA extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.avecFiltreEleves = true;
	}
	construireInstances() {
		this.avecBandeau = true;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListe,
			this._initListe,
		);
		this.identDoc = this.add(
			ObjetDocumentsATelecharger_1.ObjetDocumentsATelecharger,
		);
		this.applicationSco = (0, AccessApp_1.getApp)();
	}
	jsxModeleCheckboxFiltreEleve() {
		return {
			getValue: () => {
				return this.avecFiltreEleves;
			},
			setValue: (aValue) => {
				this.avecFiltreEleves = aValue;
				this.recupererDonnees();
			},
			getDisabled: () => {
				return false;
			},
		};
	}
	construireStructureAffichageAutre() {
		return IE.jsx.str(
			"div",
			{ class: "Espace BorderBox Table flex-contain cols flex-gap-l" },
			this.avecDroitVoirTousLesEleves() &&
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": this.jsxModeleCheckboxFiltreEleve.bind(this) },
					ObjetTraduction_1.GTraductions.getValeur(
						"InterfaceListeElevesBIA.afficherUniquement",
					),
				),
			IE.jsx.str(
				"div",
				{ class: "flex-contain full-height" },
				IE.jsx.str("div", {
					style: "flex:none; width:400px; height:100%;",
					id: this.getInstance(this.identListe).getNom(),
				}),
				IE.jsx.str("div", {
					style: "height:100%; padding-left: 10px; width:400px",
					id: this.getNomInstance(this.identDoc),
				}),
			),
		);
	}
	avecDroitVoirTousLesEleves() {
		return this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.eleves.voirTousLesEleves,
		);
	}
	recupererDonnees() {
		new ObjetRequeteListeElevesBIA_1.ObjetRequeteListeElevesBIA(this)
			.lancerRequete({ avecFiltreEleves: this.avecFiltreEleves })
			.then((aJSON) => {
				this.getInstance(this.identListe).setDonnees(
					new DonneesListe_elevesBIA(aJSON.liste),
				);
				this.getInstance(this.identDoc).setDonnees({
					listeDocs: new ObjetListeElements_1.ObjetListeElements(),
				});
			});
	}
	_initListe(aInstance) {
		aInstance.setOptionsListe({
			colonnes: [
				{
					id: DonneesListe_elevesBIA.colonnes.nom,
					taille: "100%",
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.Eleve",
					),
				},
				{
					id: DonneesListe_elevesBIA.colonnes.neLe,
					taille: 80,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"ListeRessources.NeLe",
					),
				},
			],
			nonEditable: true,
		});
		GEtatUtilisateur.setTriListe({
			liste: aInstance,
			tri: DonneesListe_elevesBIA.colonnes.nom,
		});
	}
	_evenementListe(aParametres) {
		if (
			aParametres.genreEvenement ===
			Enumere_EvenementListe_1.EGenreEvenementListe.Selection
		) {
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
}
exports.InterfaceListeElevesBIA = InterfaceListeElevesBIA;
class DonneesListe_elevesBIA extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecEvnt_Selection: true });
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_elevesBIA.colonnes.nom:
				return aParams.article.nom + " " + aParams.article.prenom;
			case DonneesListe_elevesBIA.colonnes.neLe:
				return ObjetDate_1.GDate.formatDate(
					aParams.article.neLe,
					"%JJ/%MM/%AAAA",
				);
		}
	}
	getTri(aColonneTri, aGenreTri) {
		const lTris = [];
		switch (this.getId(aColonneTri)) {
			case DonneesListe_elevesBIA.colonnes.nom:
				lTris.push(
					ObjetTri_1.ObjetTri.init("nom", aGenreTri),
					ObjetTri_1.ObjetTri.init("prenom", aGenreTri),
					ObjetTri_1.ObjetTri.init("neLe"),
				);
				break;
			case DonneesListe_elevesBIA.colonnes.neLe:
				lTris.push(
					ObjetTri_1.ObjetTri.init("neLe", aGenreTri),
					ObjetTri_1.ObjetTri.init("nom"),
					ObjetTri_1.ObjetTri.init("prenom"),
				);
				break;
		}
		return lTris;
	}
}
(function (DonneesListe_elevesBIA) {
	let colonnes;
	(function (colonnes) {
		colonnes["nom"] = "nom";
		colonnes["neLe"] = "neLe";
	})(
		(colonnes =
			DonneesListe_elevesBIA.colonnes ||
			(DonneesListe_elevesBIA.colonnes = {})),
	);
})(DonneesListe_elevesBIA || (DonneesListe_elevesBIA = {}));
