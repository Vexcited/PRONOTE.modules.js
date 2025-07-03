exports.InterfacePageAbsencesEtRetards = void 0;
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_AbsencesEtRetards_1 = require("DonneesListe_AbsencesEtRetards");
const ObjetRequetePageAbsencesEtRetards_1 = require("ObjetRequetePageAbsencesEtRetards");
const ObjetRequeteSaisieListeAbsenceRetard_1 = require("ObjetRequeteSaisieListeAbsenceRetard");
const InterfacePageEtablissement_1 = require("InterfacePageEtablissement");
class InterfacePageAbsencesEtRetards extends InterfacePageEtablissement_1.InterfacePageEtablissement {
	initialiserListe(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_AbsencesEtRetards_1.DonneesListe_AbsencesEtRetards
				.colonnes.type,
			titre: "",
			taille: 20,
		});
		lColonnes.push({
			id: DonneesListe_AbsencesEtRetards_1.DonneesListe_AbsencesEtRetards
				.colonnes.eleve,
			titre: ObjetTraduction_1.GTraductions.getValeur("Eleve"),
			taille: 150,
		});
		lColonnes.push({
			id: DonneesListe_AbsencesEtRetards_1.DonneesListe_AbsencesEtRetards
				.colonnes.classe,
			titre: ObjetTraduction_1.GTraductions.getValeur("Classe"),
			taille: 100,
		});
		lColonnes.push({
			id: DonneesListe_AbsencesEtRetards_1.DonneesListe_AbsencesEtRetards
				.colonnes.regime,
			titre: ObjetTraduction_1.GTraductions.getValeur("SuivisAR.Regime"),
			taille: 150,
		});
		lColonnes.push({
			id: DonneesListe_AbsencesEtRetards_1.DonneesListe_AbsencesEtRetards
				.colonnes.date,
			titre: ObjetTraduction_1.GTraductions.getValeur("Date"),
			taille: 180,
		});
		lColonnes.push({
			id: DonneesListe_AbsencesEtRetards_1.DonneesListe_AbsencesEtRetards
				.colonnes.motifs,
			titre: ObjetTraduction_1.GTraductions.getValeur("SuivisAR.Motif"),
			taille: ObjetListe_1.ObjetListe.initColonne(60, 130, 200),
		});
		lColonnes.push({
			id: DonneesListe_AbsencesEtRetards_1.DonneesListe_AbsencesEtRetards
				.colonnes.matieres,
			titre: ObjetTraduction_1.GTraductions.getValeur("Matieres"),
			taille: ObjetListe_1.ObjetListe.initColonne(40, 90, 180),
		});
		lColonnes.push({
			id: DonneesListe_AbsencesEtRetards_1.DonneesListe_AbsencesEtRetards
				.colonnes.ouverte,
			titre: ObjetTraduction_1.GTraductions.getValeur("SuivisAR.OuverteAbr"),
			taille: 40,
		});
		lColonnes.push({
			id: DonneesListe_AbsencesEtRetards_1.DonneesListe_AbsencesEtRetards
				.colonnes.regleeAdm,
			titre: ObjetTraduction_1.GTraductions.getValeur("RegleAdminAbr"),
			taille: 30,
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			scrollHorizontal: true,
			largeurImage: 17,
		});
		GEtatUtilisateur.setTriListe({
			liste: aInstance,
			tri: [
				DonneesListe_AbsencesEtRetards_1.DonneesListe_AbsencesEtRetards.colonnes
					.eleve,
				DonneesListe_AbsencesEtRetards_1.DonneesListe_AbsencesEtRetards.colonnes
					.classe,
			],
		});
	}
	evenementSurListe(aParametres) {}
	async requetePage(aNavigation) {
		const lReponse =
			await new ObjetRequetePageAbsencesEtRetards_1.ObjetRequetePageAbsencesEtRetards(
				this,
			).lancerRequete(aNavigation.dateDebut, aNavigation.dateFin);
		this.listeAbsencesEtRetards = lReponse.ListeAbsencesEtRetards;
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_AbsencesEtRetards_1.DonneesListe_AbsencesEtRetards(
				this.listeAbsencesEtRetards,
				lReponse.avecSaisieRA,
			),
		);
	}
	valider() {
		new ObjetRequeteSaisieListeAbsenceRetard_1.ObjetRequeteSaisieListeAbsenceRetard(
			this,
			this.actionSurValidation,
		).lancerRequete(this.listeAbsencesEtRetards);
	}
}
exports.InterfacePageAbsencesEtRetards = InterfacePageAbsencesEtRetards;
