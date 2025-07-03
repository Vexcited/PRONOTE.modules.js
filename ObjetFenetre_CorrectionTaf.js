exports.ObjetFenetre_CorrectionTaf = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeFichierExterneHttpSco_1 = require("TypeFichierExterneHttpSco");
class ObjetFenetre_CorrectionTaf extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.setOptionsFenetre({
			modale: true,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.TAFARendre.Eleve.CorrectionDeLEnseignant",
			),
			largeur: 400,
			hauteur: 150,
			fermerFenetreSurClicHorsFenetre: true,
			avecCroixFermeture: !this.etatUtilisateurSco.estEspaceMobile(),
		});
		this.donnees = { taf: null };
	}
	setTAF(aTaf) {
		this.donnees.taf = aTaf;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			estDocumentCorrigeVisible: function () {
				return (
					!!aInstance.donnees.taf && !!aInstance.donnees.taf.documentCorrige
				);
			},
			getHtmlDocumentCorrige: function () {
				const lHtml = [];
				if (
					!!aInstance.donnees.taf &&
					!!aInstance.donnees.taf.documentCorrige
				) {
					lHtml.push(
						UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
							new ObjetListeElements_1.ObjetListeElements().add(
								aInstance.donnees.taf.documentCorrige,
							),
							{
								genreRessource:
									TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
										.TAFCorrigeRenduEleve,
							},
						),
					);
				}
				return lHtml.join("");
			},
			estCommentaireCorrigeVisible: function () {
				return (
					!!aInstance.donnees.taf && !!aInstance.donnees.taf.commentaireCorrige
				);
			},
			getHtmlCommentaireCorrige: function () {
				const lHtml = [];
				if (
					!!aInstance.donnees.taf &&
					!!aInstance.donnees.taf.commentaireCorrige
				) {
					lHtml.push(aInstance.donnees.taf.commentaireCorrige);
				}
				return lHtml.join("");
			},
		});
	}
	composeContenu() {
		return IE.jsx.str(
			"div",
			null,
			IE.jsx.str("div", {
				"ie-if": "estDocumentCorrigeVisible",
				"ie-html": "getHtmlDocumentCorrige",
			}),
			IE.jsx.str("div", {
				"ie-if": "estCommentaireCorrigeVisible",
				"ie-html": "getHtmlCommentaireCorrige",
				class: "EspaceHaut10",
			}),
		);
	}
}
exports.ObjetFenetre_CorrectionTaf = ObjetFenetre_CorrectionTaf;
