exports.InterfacePageDispenses = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequetePageDispenses_1 = require("ObjetRequetePageDispenses");
const DonneesListe_Dispenses_1 = require("DonneesListe_Dispenses");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireDispenses_1 = require("UtilitaireDispenses");
const InterfacePageEtablissement_1 = require("InterfacePageEtablissement");
const ObjetRequeteSaisieDispenses_1 = require("ObjetRequeteSaisieDispenses");
const GlossaireCP_1 = require("GlossaireCP");
class InterfacePageDispenses extends InterfacePageEtablissement_1.InterfacePageEtablissement {
	constructor() {
		super(...arguments);
		this._autorisations = {
			saisie: this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.dispenses.saisie,
			),
		};
	}
	initialiserListe(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes.eleve,
			taille: 200,
			titre: ObjetTraduction_1.GTraductions.getValeur("Eleve"),
		});
		lColonnes.push({
			id: DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes.classe,
			taille: 100,
			titre: ObjetTraduction_1.GTraductions.getValeur("Classe"),
		});
		lColonnes.push({
			id: DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes.matiere,
			taille: 210,
			titre: ObjetTraduction_1.GTraductions.getValeur("Matiere"),
		});
		lColonnes.push({
			id: DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes.date,
			taille: 200,
			titre: ObjetTraduction_1.GTraductions.getValeur("Date"),
		});
		lColonnes.push({
			id: DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes
				.presenceObligatoire,
			taille: 70,
			titre: {
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"dispenses.presenceObligatoire",
				),
				nbLignes: 2,
			},
		});
		lColonnes.push({
			id: DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes
				.heuresPerdues,
			taille: 55,
			titre: {
				libelle: ObjetTraduction_1.GTraductions.getValeur("HeuresPerdues"),
				nbLignes: 2,
			},
		});
		lColonnes.push({
			id: DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes.commentaire,
			taille: 250,
			titre: ObjetTraduction_1.GTraductions.getValeur("Commentaire"),
		});
		lColonnes.push({
			id: DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes.fichierJoint,
			taille: 25,
			titre: [
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("dispenses.pj"),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"dispenses.piecesjointes",
					),
					avecFusionColonne: true,
				},
				{
					getLibelleHtml: () =>
						IE.jsx.str("i", {
							class: fonts_css_1.StylesFonts.icon_piece_jointe,
							role: "presentation",
						}),
					title: GlossaireCP_1.TradGlossaireCP.PiecesJointes,
				},
			],
		});
		lColonnes.push({
			id: DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes
				.publierPJFeuilleDA,
			taille: 25,
			titre: [
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("dispenses.pj"),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"dispenses.piecesjointes",
					),
					avecFusionColonne: true,
				},
				{
					classeCssImage: "Image_Publie",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"dispenses.publicationPJFeuilleDAppel",
					),
				},
			],
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			hauteurAdapteContenu: true,
		});
	}
	evenementSurListe(aParam) {
		switch (aParam.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				switch (aParam.idColonne) {
					case DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes
						.presenceObligatoire:
						aParam.article.presenceOblig = !aParam.article.presenceOblig;
						this._actualiserApresSaisie(aParam.article);
						break;
					case DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes
						.heuresPerdues:
						break;
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresSuppression:
				break;
		}
	}
	requetePage(aNavigation) {
		new ObjetRequetePageDispenses_1.ObjetRequetePageDispenses(
			this,
			this._reponseRequetePageDispenses,
		).lancerRequete({
			dateDebut: aNavigation.dateDebut,
			dateFin: aNavigation.dateFin,
		});
	}
	actionApresSaisieDocument() {
		this.getInstance(this.identListe).actualiser();
	}
	valider() {
		this.listeDispenses.setSerialisateurJSON({
			methodeSerialisation:
				UtilitaireDispenses_1.TUtilitaireDispenses.serialisationDonnees.bind(
					this,
				),
		});
		new ObjetRequeteSaisieDispenses_1.ObjetRequeteSaisieDispenses(
			this,
			this.actionSurValidation,
		)
			.addUpload({ listeFichiers: this.listeFichiersUpload })
			.lancerRequete({ listeDispenses: this.listeDispenses });
	}
	_reponseRequetePageDispenses(aJSON) {
		this.listeDispenses = aJSON.listeDispenses;
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_Dispenses_1.DonneesListe_Dispenses({
				donnees: aJSON.listeDispenses,
				autorisations: this._autorisations,
			}).setOptions({
				saisie: UtilitaireDispenses_1.TUtilitaireDispenses.saisieDocument.bind(
					this,
					this,
				),
			}),
		);
	}
	_actualiserApresSaisie(aDonnee) {
		aDonnee.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.setEtatSaisie(true);
		this.getInstance(this.identListe).actualiser();
	}
}
exports.InterfacePageDispenses = InterfacePageDispenses;
