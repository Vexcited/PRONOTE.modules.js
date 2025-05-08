exports.ObjetFenetre_SelectionCours = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const InterfacePageEmploiDuTemps_Journalier_1 = require("InterfacePageEmploiDuTemps_Journalier");
const ObjetDate_1 = require("ObjetDate");
class ObjetFenetre_SelectionCours extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.TypeInstanceEDT =
			ObjetFenetre_SelectionCours.TypeInstanceEDT.Classique;
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"ObjetFenetre_SelectionCours.titre",
			),
			hauteur: 700,
			largeur: 350,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
			heightMax_mobile: true,
		});
	}
	construireInstances() {
		let lInstanceEDT;
		switch (this.TypeInstanceEDT) {
			case ObjetFenetre_SelectionCours.TypeInstanceEDT.Classique:
				lInstanceEDT =
					InterfacePageEmploiDuTemps_Journalier_1.ObjetAffichagePageEmploiDuTemps_Journalier;
				break;
			case ObjetFenetre_SelectionCours.TypeInstanceEDT.Dispense:
				lInstanceEDT = DispenseEDTJournalier;
				break;
		}
		this.identEDT = this.add(lInstanceEDT, this.evenementEDT);
	}
	composeContenu() {
		return IE.jsx.str("section", { id: this.getNomInstance(this.identEDT) });
	}
	evenementEDT(aCours) {
		this.fermer();
		this.callback.appel(1, aCours);
	}
}
exports.ObjetFenetre_SelectionCours = ObjetFenetre_SelectionCours;
(function (ObjetFenetre_SelectionCours) {
	let TypeInstanceEDT;
	(function (TypeInstanceEDT) {
		TypeInstanceEDT[(TypeInstanceEDT["Classique"] = 0)] = "Classique";
		TypeInstanceEDT[(TypeInstanceEDT["Dispense"] = 1)] = "Dispense";
	})(
		(TypeInstanceEDT =
			ObjetFenetre_SelectionCours.TypeInstanceEDT ||
			(ObjetFenetre_SelectionCours.TypeInstanceEDT = {})),
	);
})(
	ObjetFenetre_SelectionCours ||
		(exports.ObjetFenetre_SelectionCours = ObjetFenetre_SelectionCours = {}),
);
class DispenseEDTJournalier extends InterfacePageEmploiDuTemps_Journalier_1.ObjetAffichagePageEmploiDuTemps_Journalier {
	constructor(...aParams) {
		super(...aParams);
		this.AvecTrouEDT = false;
	}
	initSelecteurDate(aInstance) {
		aInstance.setOptionsObjetCelluleDate({ largeurComposant: "100%" });
		aInstance.setPremiereDateSaisissable(ObjetDate_1.GDate.aujourdhui);
		const lNbMaxJoursDeclarationDispCD =
			GEtatUtilisateur.Identification.ressource.nbMaxJoursDeclarationDispCD;
		aInstance.setDerniereDateSaisissable(
			lNbMaxJoursDeclarationDispCD
				? ObjetDate_1.GDate.getJourSuivant(
						ObjetDate_1.GDate.aujourdhui,
						lNbMaxJoursDeclarationDispCD,
					)
				: ObjetDate_1.GDate.derniereDate,
		);
		super.initSelecteurDate(aInstance);
	}
	estCoursVisible(aCours) {
		return (
			!!GEtatUtilisateur.getMembre().listeMatieresDeclarationDispense.getElementParNumero(
				aCours.matiere.getNumero(),
			) &&
			ObjetDate_1.GDate.estAvantJour(
				ObjetDate_1.GDate.getDateHeureCourante(),
				aCours.DateDuCours,
			)
		);
	}
	construireStructureAffichageAutre() {
		return IE.jsx.str(
			"section",
			null,
			IE.jsx.str("article", {
				id: this.getNomInstance(this.identSelecteurDate),
			}),
			IE.jsx.str("article", {
				class: "edtJournalier",
				id: this.getNomInstance(this.identPageListe),
			}),
		);
	}
	evenementFicheCours(aCours) {
		if (!!aCours && !!aCours.existeNumero() && this.estCoursVisible(aCours)) {
			this.callback.appel(aCours);
		}
	}
}
