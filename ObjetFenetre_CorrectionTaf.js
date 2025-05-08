const { ObjetFenetre } = require("ObjetFenetre.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeFichierExterneHttpSco } = require("TypeFichierExterneHttpSco.js");
class ObjetFenetre_CorrectionTaf extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			modale: true,
			titre: GTraductions.getValeur(
				"CahierDeTexte.TAFARendre.Eleve.CorrectionDeLEnseignant",
			),
			largeur: 400,
			hauteur: 150,
			fermerFenetreSurClicHorsFenetre: true,
			avecCroixFermeture: !GEtatUtilisateur.estEspaceMobile(),
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
						UtilitaireUrl.construireListeUrls(
							new ObjetListeElements().add(
								aInstance.donnees.taf.documentCorrige,
							),
							{
								genreRessource: TypeFichierExterneHttpSco.TAFCorrigeRenduEleve,
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
		const T = [];
		T.push("<div>");
		T.push(
			'<div ie-if="estDocumentCorrigeVisible" ie-html="getHtmlDocumentCorrige"></div>',
		);
		T.push(
			'<div ie-if="estCommentaireCorrigeVisible" ie-html="getHtmlCommentaireCorrige" class="EspaceHaut10"></div>',
		);
		T.push("</div>");
		return T.join("");
	}
}
module.exports = { ObjetFenetre_CorrectionTaf };
