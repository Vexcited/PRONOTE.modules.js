exports.InterfacePageDossiers_Consultation = void 0;
const _InterfacePageDossiers_1 = require("_InterfacePageDossiers");
const ObjetListe_1 = require("ObjetListe");
const DonneesListe_Dossiers_1 = require("DonneesListe_Dossiers");
const GlossaireDossierVieScolaire_1 = require("GlossaireDossierVieScolaire");
class InterfacePageDossiers_Consultation extends _InterfacePageDossiers_1._InterfacePageDossiers {
	recupererDonnees() {
		this.lancerRequeteDonnees();
	}
	initialiserListe(aInstance) {
		const lColonnes = [
			{
				id: DonneesListe_Dossiers_1.DonneesListe_Dossiers.colonnes.evenement,
				titre:
					GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
						.Evenement,
				taille: 120,
			},
			{
				id: DonneesListe_Dossiers_1.DonneesListe_Dossiers.colonnes.date,
				titre:
					GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire.Date,
				taille: 145,
			},
			{
				id: DonneesListe_Dossiers_1.DonneesListe_Dossiers.colonnes.responsable,
				titre:
					GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
						.DemandeurRespAdministratif,
				taille: 160,
			},
			{
				id: DonneesListe_Dossiers_1.DonneesListe_Dossiers.colonnes
					.interlocuteur,
				titre:
					GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
						.Interlocuteur,
				taille: 160,
			},
			{
				id: DonneesListe_Dossiers_1.DonneesListe_Dossiers.colonnes
					.complementInfo,
				titre:
					GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
						.ComplementDInformation,
				taille: "100%",
			},
		];
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.deployer }],
		});
	}
}
exports.InterfacePageDossiers_Consultation = InterfacePageDossiers_Consultation;
