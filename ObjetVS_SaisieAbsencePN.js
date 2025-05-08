exports.ObjetVS_SaisieAbsencePN = void 0;
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetVS_SaisieAbsence_1 = require("ObjetVS_SaisieAbsence");
const Enumere_Espace_1 = require("Enumere_Espace");
const TypeOptionSaisieAbsParDJ_1 = require("TypeOptionSaisieAbsParDJ");
const ObjetDate_1 = require("ObjetDate");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const ObjetListeElements_1 = require("ObjetListeElements");
class ObjetVS_SaisieAbsencePN extends ObjetVS_SaisieAbsence_1.ObjetVS_SaisieAbsence {
	constructor(...aParams) {
		super(...aParams);
		this.parametresSco = GParametres;
		this.heureDebut = ObjetDate_1.GDate.placeParJourEnDate(0);
		this.strDebut = ObjetDate_1.GDate.formatDate(this.heureDebut, "%hh:%mm");
		this.heureFin = ObjetDate_1.GDate.placeParJourEnDate(
			GParametres.PlacesParJour,
		);
		this.strFin = ObjetDate_1.GDate.formatDate(this.heureFin, "%hh:%mm");
		this.heureMidi = ObjetDate_1.GDate.placeParJourEnDate(
			this.parametresSco.PlaceDemiJournee,
		);
		const lListeHeuresDebut = new ObjetListeElements_1.ObjetListeElements();
		const lListeHeuresFin = new ObjetListeElements_1.ObjetListeElements();
		const lNbrHeureDebut = this.parametresSco.LibellesHeures.count();
		this.parametresSco.LibellesHeures.parcourir((aHeure, aIndice) => {
			aHeure.Position = aIndice;
			if (aIndice !== lNbrHeureDebut - 1) {
				lListeHeuresDebut.add(aHeure);
			}
		});
		const lNbrHeureFin = this.parametresSco.LibellesHeuresFinPourVS.count();
		this.parametresSco.LibellesHeuresFinPourVS.parcourir((aHeure, aIndice) => {
			aHeure.Position = aIndice;
			if (aHeure.getLibelle() && aIndice !== lNbrHeureFin - 1) {
				lListeHeuresFin.add(aHeure);
			}
		});
		const lEstrPrimaire = GApplication.estPrimaire;
		this.setParametres({
			afficherNew: true,
			saisieDJavecPasHoraire:
				lEstrPrimaire &&
				this.parametresSco.saisirAbsencesParDJ ===
					TypeOptionSaisieAbsParDJ_1.TypeOptionSaisieAbsParDJ.tOSAPDJ_ParamUsr,
			avecHoraire: !lEstrPrimaire,
			listeHeuresDebut: lListeHeuresDebut,
			listeHeuresFin: lListeHeuresFin,
		});
	}
	surValidation(aGenreBouton) {
		this.callback.appel(aGenreBouton, this.absenceTraitee);
	}
	getOptionsSelecFile() {
		return {
			genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
			genreRessourcePJ: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
			maxFiles: 1,
			maxSize: GApplication.droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
			),
		};
	}
	composeDocument(aDocument) {
		if (this.parametres.afficherNew) {
			const lDocuments = new ObjetListeElements_1.ObjetListeElements().add(
				aDocument,
			);
			return [
				UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(lDocuments, {
					IEModelChips: "chipsDocument",
				}),
			].join("");
		} else {
			return ObjetChaine_1.GChaine.composerUrlLienExterne({
				documentJoint: aDocument,
				genreRessource: Enumere_Ressource_1.EGenreRessource.DocumentJoint,
				avecLien: [
					Enumere_Espace_1.EGenreEspace.Parent,
					Enumere_Espace_1.EGenreEspace.PrimParent,
					Enumere_Espace_1.EGenreEspace.Mobile_Parent,
					Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
				].includes(GEtatUtilisateur.GenreEspace),
				afficherIconeDocument: false,
				ieChipsMinimal: true,
			});
		}
	}
}
exports.ObjetVS_SaisieAbsencePN = ObjetVS_SaisieAbsencePN;
