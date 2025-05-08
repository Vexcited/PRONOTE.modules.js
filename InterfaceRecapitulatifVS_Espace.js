exports.InterfaceRecapitulatifVS_Espace = void 0;
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const InterfaceRecapitulatifVS_1 = require("InterfaceRecapitulatifVS");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
class InterfaceRecapitulatifVS_Espace extends InterfaceRecapitulatifVS_1.InterfaceRecapitulatifVS {
	constructor(...aParams) {
		super(...aParams);
		this.etatUtilisateurScoEspace = this.applicationSco.getEtatUtilisateur();
	}
	construireInstances() {
		this.identSelection = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.evenementSurCmbPeriode,
			this.initialiserCmbPeriode,
		);
		super.construireInstances();
	}
	recupererDonnees() {
		var _a, _b, _c;
		if (this.fiche) {
			this.fiche.fermer(false);
		}
		this.listePeriodes = this.etatUtilisateurScoEspace.getOngletListePeriodes();
		this.getInstance(this.identSelection).setDonnees(this.listePeriodes);
		this.getInstance(this.identSelection).setSelectionParElement(
			(
				(_c =
					(_b = (_a = this.etatUtilisateurScoEspace).getPage) === null ||
					_b === void 0
						? void 0
						: _b.call(_a)) === null || _c === void 0
					? void 0
					: _c.retourAccueil
			)
				? this.listePeriodes.getPremierElement()
				: this.etatUtilisateurScoEspace.getOngletPeriodeParDefaut(),
			0,
		);
	}
	initialiserCmbPeriode(aInstance) {
		aInstance.setOptionsObjetSaisie({
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.comboPeriode",
			),
			longueur: 160,
		});
	}
	evenementSurCmbPeriode(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			if (aParams.element.existeNumero()) {
				this.periodeCourant =
					this.parametresSco.listePeriodes.getElementParNumero(
						aParams.element.getNumero(),
					);
				this.positionPeriodeCourant = this.listePeriodes.getIndiceParElement(
					this.periodeCourant,
				);
				this.recupererDonneesRecapVS();
			} else {
				this.periodeCourant = aParams.element;
				this.recupererDonneesRecapVS();
			}
		}
	}
}
exports.InterfaceRecapitulatifVS_Espace = InterfaceRecapitulatifVS_Espace;
