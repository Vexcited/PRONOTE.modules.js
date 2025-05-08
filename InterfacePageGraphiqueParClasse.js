const { ObjetHistogramme } = require("ObjetHistogramme.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const {
	ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
class InterfacePageGraphiqueParClasse extends InterfacePage {
	construireInstances() {
		this.IdentTripleCombo = this.add(
			ObjetAffichagePageAvecMenusDeroulants,
			this.evenementSurDernierMenuDeroulant,
			this.initialiserTripleCombo,
		);
		this.IdPremierElement = this.getInstance(
			this.IdentTripleCombo,
		).getPremierElement();
		this.IdentPage = this.add(ObjetHistogramme);
	}
	setParametresGeneraux() {
		this.AddSurZone = [this.IdentTripleCombo];
		this.IdentZoneAlClient = this.IdentPage;
	}
	initialiserTripleCombo(aInstance) {
		const lGenresCombo = [EGenreRessource.Classe];
		if (
			GEtatUtilisateur.getGenreOnglet() !== EGenreOnglet.Graphique_Evolution
		) {
			lGenresCombo.push(EGenreRessource.Periode);
		}
		lGenresCombo.push(EGenreRessource.Eleve);
		aInstance.setParametres(lGenresCombo, true);
		aInstance.setEvenementMenusDeroulants(this.surEvntMenusDeroulants);
	}
	getParametresPDF() {
		return {
			genreGenerationPDF: TypeHttpGenerationPDFSco.GraphiqueProfil,
			eleve: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
			periode: GEtatUtilisateur.Navigation.getRessource(
				EGenreRessource.Periode,
			),
		};
	}
	evenementSurDernierMenuDeroulant() {
		GHtml.setHtml(this.Instances[this.IdentPage].getNom(), "&nbsp;");
		this.Instances[this.IdentPage].setDonneesImage(
			GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
			GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Periode),
		);
	}
}
module.exports = { InterfacePageGraphiqueParClasse };
