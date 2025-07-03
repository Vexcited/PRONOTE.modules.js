exports.InterfaceParamListeAppareilsMobile = void 0;
const ObjetInterface_1 = require("ObjetInterface");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const TypeSecurisationCompte_1 = require("TypeSecurisationCompte");
const ObjetListe_1 = require("ObjetListe");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDate_1 = require("ObjetDate");
class InterfaceParamListeAppareilsMobile extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
	}
	static getTitre() {
		return (
			ObjetTraduction_1.GTraductions.getValeur(
				"PageCompte.ApplicationMobileEnregistres",
			) + " (DEBUG)"
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementListe,
			this.initialiserListe,
		);
	}
	initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			hauteurAdapteContenu: true,
		});
	}
	evenementListe(aParametres) {}
	setDonnees(aListe) {
		this.initialiser();
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_AppareilsMobile(aListe),
		);
	}
	construireStructureAffichageAutre() {
		return IE.jsx.str("div", { id: this.getNomInstance(this.identListe) });
	}
}
exports.InterfaceParamListeAppareilsMobile = InterfaceParamListeAppareilsMobile;
class DonneesListe_AppareilsMobile extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecSelection: false, avecBoutonActionLigne: false });
	}
	getTitreZonePrincipale(aParams) {
		let lLibelle = "";
		if (aParams.article.modele) {
			lLibelle = aParams.article.modele;
		}
		if (aParams.article.plateforme) {
			if (aParams.article.modele) {
				lLibelle += " - ";
			}
			lLibelle += aParams.article.plateforme;
		}
		return lLibelle;
	}
	getInfosSuppZonePrincipale(aParams) {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			aParams.article.dateAjout &&
				IE.jsx.str(
					"p",
					null,
					ObjetTraduction_1.GTraductions.getValeur("PageCompte.DateAjout", [
						ObjetDate_1.GDate.formatDate(
							aParams.article.dateAjout,
							"%JJ/%MM/%AAAA",
						),
					]),
				),
			aParams.article.dateDerniereConnexion &&
				IE.jsx.str(
					"p",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"PageCompte.DateDerniereConnexion",
						[
							ObjetDate_1.GDate.formatDate(
								aParams.article.dateDerniereConnexion,
								"%JJ/%MM/%AAAA",
							),
						],
					),
				),
		);
	}
	getIconeGaucheContenuFormate(aParams) {
		return TypeSecurisationCompte_1.TypeGenreSourceConnexionUtil.getIcone(
			aParams.article.getGenre(),
		);
	}
	avecMenuContextuel() {
		return false;
	}
}
