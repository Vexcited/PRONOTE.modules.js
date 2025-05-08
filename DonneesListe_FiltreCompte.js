exports.DonneesListe_FiltreCompte = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const Enumere_DonneesPersonnelles_1 = require("Enumere_DonneesPersonnelles");
class DonneesListe_FiltreCompte extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aDonneesComplementaires = {}) {
		super(aDonnees);
		this.setOptions({
			avecEvnt_ModificationSelection: true,
			avecEvnt_SelectionClick: true,
			avecTri: false,
			avecEllipsis: false,
			avecContenuTronque: false,
			avecBoutonActionLigne: false,
		});
		this.donneesComplementaires = aDonneesComplementaires;
	}
	getIconeGaucheContenuFormate(aParams) {
		let lIcon = "";
		switch (aParams.article.getGenre()) {
			case Enumere_DonneesPersonnelles_1.TypeFiltreAffichage.securisation:
				lIcon = "icon_lock";
				break;
			case Enumere_DonneesPersonnelles_1.TypeFiltreAffichage.coords:
				lIcon = "icon_uniF2BD";
				break;
			case Enumere_DonneesPersonnelles_1.TypeFiltreAffichage.communication:
				lIcon = "icon_fiche_cours_partage";
				break;
			case Enumere_DonneesPersonnelles_1.TypeFiltreAffichage.notification:
				lIcon =
					this.donneesComplementaires.iconNotification || "icon_papillon_notif";
				break;
			case Enumere_DonneesPersonnelles_1.TypeFiltreAffichage.deconnexion:
				lIcon = "icon_ne_pas_deranger";
				break;
			case Enumere_DonneesPersonnelles_1.TypeFiltreAffichage.droitImage:
				lIcon = "icon_camera";
				break;
			case Enumere_DonneesPersonnelles_1.TypeFiltreAffichage.profilPrimEnfant:
				lIcon = "icon_user";
				break;
			case Enumere_DonneesPersonnelles_1.TypeFiltreAffichage.signature:
				lIcon = "icon_signature";
				break;
			case Enumere_DonneesPersonnelles_1.TypeFiltreAffichage.style:
				lIcon = "icon_pipette";
				break;
			case Enumere_DonneesPersonnelles_1.TypeFiltreAffichage.cahierDeTexte:
				lIcon = "icon_saisie_cahier_texte";
				break;
			case Enumere_DonneesPersonnelles_1.TypeFiltreAffichage.iCal:
				lIcon = "icon_ical";
				break;
			case Enumere_DonneesPersonnelles_1.TypeFiltreAffichage.generalites:
				lIcon = "icon_wrench";
				break;
			case Enumere_DonneesPersonnelles_1.TypeFiltreAffichage
				.messagerieSignature:
				lIcon = "icon_signature";
				break;
			default:
				lIcon = "icon_user";
		}
		return aParams.article.nonSelectionnable ? "" : lIcon;
	}
	avecSelection(aParams) {
		return !aParams.article.nonSelectionnable;
	}
	avecEvenementSelection(aParams) {
		return this.avecSelection(aParams);
	}
}
exports.DonneesListe_FiltreCompte = DonneesListe_FiltreCompte;
