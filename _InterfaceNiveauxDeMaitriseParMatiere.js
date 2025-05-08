const { GTraductions } = require("ObjetTraduction.js");
const {
	DonneesListe_NiveauxDeMaitriseParMatiere,
} = require("DonneesListe_NiveauxDeMaitriseParMatiere.js");
const { InterfacePage } = require("InterfacePage.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
class _InterfaceNiveauxDeMaitriseParMatiere extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.donnees = {};
		this.options = {
			avecDetail: true,
			avecBoutonJaugeChronologique: true,
			jaugeChronologique: false,
		};
	}
	_reponseRequeteNiveauxDeMaitriseParMatiere(aDonnees) {
		if (aDonnees.Message) {
			this.evenementAfficherMessage(aDonnees.Message);
		} else {
			this.donnees = aDonnees;
			const lPourEleve = GEtatUtilisateur.Navigation.getRessource(
				EGenreRessource.Eleve,
			)
				? GEtatUtilisateur.Navigation.getRessource(
						EGenreRessource.Eleve,
					).existeNumero()
				: true;
			this.options.avecDetail = lPourEleve;
			this.options.avecBoutonJaugeChronologique = lPourEleve;
			_initialiserListe.call(this, this.getInstance(this.IdentPage));
			_actualiserListe.call(this);
			if (
				GApplication.droits.get(
					TypeDroits.autoriserImpressionBulletinReleveBrevet,
				)
			) {
				Invocateur.evenement(
					ObjetInvocateur.events.activationImpression,
					EGenreImpression.GenerationPDF,
					this,
					this.getParametresPDF.bind(this),
				);
			}
		}
	}
	getParametresPDF() {
		return {
			genreGenerationPDF: TypeHttpGenerationPDFSco.NiveauxDeMaitriseParMatiere,
			classe: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe),
			periode: GEtatUtilisateur.Navigation.getRessource(
				EGenreRessource.Periode,
			),
			eleve: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
			jaugeChronologique: this.options.jaugeChronologique,
			avecCodeCompetences: GEtatUtilisateur.estAvecCodeCompetences(),
		};
	}
}
function _initialiserListe(aInstance) {
	const lInstance = this;
	aInstance.controleur.btnBasculeJauge = {
		event: function () {
			lInstance.options.jaugeChronologique =
				!lInstance.options.jaugeChronologique;
			aInstance.getDonneesListe().setParametres(lInstance.options);
			aInstance.actualiser(true);
		},
		getTitle: function () {
			return lInstance.options.jaugeChronologique
				? GTraductions.getValeur(
						"BulletinEtReleve.hintBtnAfficherJaugeParNiveau",
					)
				: GTraductions.getValeur(
						"BulletinEtReleve.hintBtnAfficherJaugeChronologique",
					);
		},
		getSelection: function () {
			return lInstance.options.jaugeChronologique;
		},
	};
	const lTitreEtatDAcquisition = [];
	lTitreEtatDAcquisition.push(
		`<div class="flex-contain flex-center justify-center">`,
	);
	if (this.options.avecBoutonJaugeChronologique) {
		lTitreEtatDAcquisition.push(
			`<ie-btnimage ie-model="btnBasculeJauge" class="Image_BasculeJauge" style="width: 18px;"></ie-btnimage>`,
		);
	}
	lTitreEtatDAcquisition.push(
		`<span>${GTraductions.getValeur("competences.syntheseDesEvaluations")}</span>`,
	);
	lTitreEtatDAcquisition.push(`</div>`);
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_NiveauxDeMaitriseParMatiere.colonnes.matieres,
		taille: "100%",
		titre: GTraductions.getValeur("BulletinEtReleve.Matieres"),
	});
	lColonnes.push({
		id: DonneesListe_NiveauxDeMaitriseParMatiere.colonnes.etatDAcquisition,
		taille: 350,
		titre: { libelleHtml: lTitreEtatDAcquisition.join("") },
	});
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		colonnesCachees: this.donnees.maquette.avecEtatAcquisition
			? []
			: [DonneesListe_NiveauxDeMaitriseParMatiere.colonnes.etatDAcquisition],
	});
}
function _actualiserListe() {
	this.getInstance(this.IdentPage).setDonnees(
		new DonneesListe_NiveauxDeMaitriseParMatiere(
			this.donnees.listeLignes,
			this.options,
		),
	);
}
module.exports = { _InterfaceNiveauxDeMaitriseParMatiere };
