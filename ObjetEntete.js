exports.ObjetEnteteMobile = void 0;
const _ObjetEntete_1 = require("_ObjetEntete");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_Espace_1 = require("Enumere_Espace");
const GUID_1 = require("GUID");
const ObjetFenetre_SelecteurMembrePN_1 = require("ObjetFenetre_SelecteurMembrePN");
const ObjetTraduction_1 = require("ObjetTraduction");
const AccessApp_1 = require("AccessApp");
class ObjetEnteteMobile extends _ObjetEntete_1._ObjetEnteteMobile {
	constructor(...aParams) {
		super(...aParams);
		this.applicationScoMobile = (0, AccessApp_1.getApp)();
		this.interfaceMobile = GInterface;
		this.etatUtilisateur = this.applicationScoMobile.getEtatUtilisateur();
		this.parametres = this.applicationScoMobile.getObjetParametres();
		this.idSelecteurMembre = GUID_1.GUID.getId();
		this.C_NbreRecherche = 10;
		this.avecMembre = false;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			selecteurMembre: {
				event() {
					ObjetFenetre_SelecteurMembrePN_1.ObjetFenetre_SelecteurMembrePN.ouvrir();
				},
				getLibelle() {
					var _a;
					return (_a =
						aInstance === null || aInstance === void 0
							? void 0
							: aInstance.titreMembre) !== null && _a !== void 0
						? _a
						: "";
				},
				getIcone() {
					return "icon_angle_down";
				},
			},
		});
	}
	setAvecMembre(aAvecMembre) {
		this.avecMembre = aAvecMembre;
		this.actualiserTitre();
	}
	getImageUtilisateurOuMembre() {
		if (this.parametres.estAfficheDansENT) {
			return "";
		}
		return super.getImageUtilisateurOuMembre();
	}
	actualiserTitre() {
		const lTitre = { titre: "", sousTitre: "", avecImage: false };
		const lGenreOnglet = this.etatUtilisateur.getGenreOnglet();
		const lOnglet =
			this.etatUtilisateur.listeOnglets.getElementParGenre(lGenreOnglet);
		if (!!lOnglet) {
			lTitre.titre = lOnglet.getLibelle();
		}
		const lAvecMembre = GParametres.avecMembre && this.avecMembre;
		lTitre.sousTitre = this.etatUtilisateur.getMembre().getLibelle();
		if (
			[
				Enumere_Espace_1.EGenreEspace.PrimParent,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
				Enumere_Espace_1.EGenreEspace.PrimEleve,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve,
				Enumere_Espace_1.EGenreEspace.Accompagnant,
				Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
				Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
			].includes(this.etatUtilisateur.GenreEspace)
		) {
			lTitre.sousTitre =
				this.etatUtilisateur.getMembre().libelleLong ||
				this.etatUtilisateur.getMembre().getLibelle();
		} else if (this.parametres.estAfficheDansENT && !lAvecMembre) {
			lTitre.sousTitre = "";
		}
		let lStrTitre = "";
		if (lAvecMembre) {
			lStrTitre = IE.jsx.str("ie-btnselecteur", {
				"ie-model": "selecteurMembre",
				class: "disable-dark-mode",
				"aria-label": ObjetTraduction_1.GTraductions.getValeur(
					"WAI.ListeSelectionEleve",
				),
			});
			this.titreMembre = lTitre.sousTitre;
		} else if (lTitre.sousTitre) {
			lStrTitre = IE.jsx.str(
				"h1",
				{ class: "disable-dark-mode" },
				lTitre.sousTitre,
			);
		}
		lStrTitre += IE.jsx.str("h2", { class: "disable-dark-mode" }, lTitre.titre);
		ObjetHtml_1.GHtml.setHtml(this.idTitre, lStrTitre, {
			controleur: this.controleur,
		});
	}
}
exports.ObjetEnteteMobile = ObjetEnteteMobile;
