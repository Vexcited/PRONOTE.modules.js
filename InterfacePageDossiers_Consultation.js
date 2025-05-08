const { _InterfacePageDossiers } = require("_InterfacePageDossiers.js");
const { ObjetRequetePageDossiers } = require("ObjetRequetePageDossiers.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { DonneesListe_Dossiers } = require("DonneesListe_Dossiers.js");
class InterfacePageDossiers_Consultation extends _InterfacePageDossiers {
	construireInstances() {
		this.identListeDossiers = this.add(
			ObjetListe,
			this.evenementListeDossiers,
			this._initListe,
		);
	}
	recupererDonnees() {
		new ObjetRequetePageDossiers(
			this,
			this.actionSurRequetePageDossiers,
		).lancerRequete();
	}
	_initListe(aInstance) {
		const lTraductionTitres = GTraductions.getValeur(
			"dossierVieScolaire.listeTitres",
		);
		const lColonnes = [
			{
				id: DonneesListe_Dossiers.colonnes.evenement,
				titre: lTraductionTitres[0],
				taille: 120,
			},
			{
				id: DonneesListe_Dossiers.colonnes.date,
				titre: lTraductionTitres[1],
				taille: 145,
			},
			{
				id: DonneesListe_Dossiers.colonnes.responsable,
				titre: lTraductionTitres[2],
				taille: 160,
			},
			{
				id: DonneesListe_Dossiers.colonnes.interlocuteur,
				titre: lTraductionTitres[3],
				taille: 160,
			},
			{
				id: DonneesListe_Dossiers.colonnes.complementInfo,
				titre: lTraductionTitres[4],
				taille: "100%",
			},
			{
				id: DonneesListe_Dossiers.colonnes.pieceJointe,
				titre: { classeCssImage: "Image_Trombone" },
				taille: 24,
			},
			{
				id: DonneesListe_Dossiers.colonnes.publie,
				titre: lTraductionTitres[6],
				taille: 30,
			},
			{
				id: DonneesListe_Dossiers.colonnes.accesRestreint,
				titre: { classeCssImage: "Image_AccesRestreint" },
				taille: 30,
				hint: GTraductions.getValeur("dossierVS.restreindreAcces"),
			},
			{ id: DonneesListe_Dossiers.colonnes.genre, titre: "", taille: 30 },
			{ id: DonneesListe_Dossiers.colonnes.rang, titre: "", taille: 30 },
		];
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			colonnesCachees: [
				DonneesListe_Dossiers.colonnes.genre,
				DonneesListe_Dossiers.colonnes.publie,
				DonneesListe_Dossiers.colonnes.pieceJointe,
				DonneesListe_Dossiers.colonnes.rang,
				DonneesListe_Dossiers.colonnes.accesRestreint,
			],
			avecLigneCreation: false,
			boutons: [{ genre: ObjetListe.typeBouton.deployer }],
		});
	}
}
module.exports = { InterfacePageDossiers_Consultation };
