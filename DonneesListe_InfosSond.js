const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { GChaine } = require("ObjetChaine.js");
const { MoteurInfoSondage } = require("MoteurInfoSondage.js");
const { GDate } = require("ObjetDate.js");
const { GTraductions } = require("ObjetTraduction.js");
const { MethodesObjet } = require("MethodesObjet.js");
class DonneesListe_InfosSond extends ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aOptions, aUtilitaires) {
		super(aDonnees);
		this.utilitaires = aUtilitaires;
		this.moteurCP = new MoteurInfoSondage(aUtilitaires);
		this.param = aOptions;
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.getLibelle();
	}
	estLigneOff(aParams) {
		const lActu = aParams.article;
		const lLue = lActu.lue;
		const lEstModeReception = !this.param.avecEditionActualite;
		return lEstModeReception && lLue;
	}
	getInfosSuppZonePrincipale(aParams) {
		const H = [];
		const lActu = aParams.article;
		H.push("<div>");
		const lAvecCategorie =
			lActu.categorie !== null && lActu.categorie !== undefined;
		if (lAvecCategorie) {
			H.push(lActu.categorie.getLibelle());
		}
		const lEstModeReception = !this.param.avecEditionActualite;
		const lEstModeModele = this.param.estCtxModeles;
		if ((lEstModeReception || lEstModeModele) && !!lActu.auteur) {
			H.push(lAvecCategorie ? " - " : "");
			H.push(lActu.auteur);
		}
		H.push("</div>");
		if (lEstModeReception && this.moteurCP.avecInfoPublic(lActu)) {
			H.push("<div>");
			H.push(lActu.public.getLibelle());
			H.push("</div>");
		}
		const lEstModeDiffusion = this.param.avecEditionActualite;
		if (lEstModeDiffusion) {
			const lDetailPublic = lActu.detailPublicSuccinct
				? GChaine.replaceRCToHTML(lActu.detailPublicSuccinct)
				: "";
			H.push(
				'<div style="color:',
				GCouleur.themeCouleur.foncee,
				'">',
				lDetailPublic,
				"</div>",
			);
		} else {
			H.push(
				'<time datetime="',
				GDate.formatDate(lActu.dateDebut, "%MM-%JJ"),
				'">',
				GDate.formatDate(lActu.dateDebut, "%JJJ %JJ %MMM"),
				"</time>",
			);
		}
		return H.join("");
	}
	getZoneComplementaire(aParams) {
		const lActu = aParams.article;
		const lEstModeDiffusion = this.param.avecEditionActualite;
		const H = [];
		const lListePiecesJointes =
			this.moteurCP.getListePiecesJointesDActualite(lActu);
		if (lEstModeDiffusion) {
			H.push('<div class="icones-conteneur">');
			if (lListePiecesJointes.count() > 0) {
				H.push('<i class="icon icon_piece_jointe"></i>');
			}
			if (lActu.estModele !== true) {
				if (
					lActu.listeIndividusPartage !== null &&
					lActu.listeIndividusPartage !== undefined &&
					lActu.listeIndividusPartage.count() > 0
				) {
					H.push(
						'<i title="',
						GTraductions.getValeur("infoSond.detailPartageSondN", [
							lActu.listeIndividusPartage.count(),
						]),
						'" class="icon icon_eye_open"></i>',
					);
				}
				H.push(
					this.moteurCP.composeIconDiffusionPageEtablissement({
						actualite: lActu,
					}),
				);
				H.push(this.moteurCP.composeIconPublication({ actualite: lActu }));
			} else {
				if (lActu.estModelePartage === true) {
					H.push(
						'<i class="icon icon_sondage_bibliotheque" aria-hidden="true"></i>',
					);
				}
			}
			H.push("</div>");
			if (
				Object.prototype.hasOwnProperty.call(lActu, "pourcentRepondu") &&
				MethodesObjet.isNumeric(lActu.pourcentRepondu)
			) {
				const lHint = GTraductions.getValeur(
					lActu.estSondage
						? "infoSond.TauxReponse"
						: lActu.estInformation
							? "infoSond.TauxLecture"
							: "",
				);
				H.push(
					`<div class="pourcentage-conteneur">`,
					`<span class="ie-sous-titre" ie-hint="${lHint}" >${lActu.pourcentRepondu} %</span>`,
					`</div>`,
				);
			}
		} else {
			if (lListePiecesJointes.count() > 0) {
				H.push('<div class="icones-conteneur">');
				H.push('<i class="icon icon_piece_jointe"></i>');
				H.push("</div>");
			}
		}
		return H.join("");
	}
	getZoneMessage(aParams) {
		const lActu = aParams.article;
		const lEstModeReception = !this.param.avecEditionActualite;
		const H = [];
		if (lEstModeReception && lActu && lActu.estSondage) {
			H.push(_composeEtatReponseSondage.call(this, lActu));
		}
		return H.join("");
	}
	remplirMenuContextuel(aParams) {
		const lMenu = aParams.menuContextuel;
		const lArticle = aParams.article;
		this.moteurCP.initCommandesMenuCtxDInfoSond(lMenu, lArticle, this.param);
	}
}
function _composeEtatReponseSondage(aActu) {
	const H = [];
	const lARepondu = this.moteurCP.aToutRepondu(aActu);
	const lNbJoursRestants = GDate.getDifferenceJours(aActu.dateFin, new Date());
	if (!lARepondu) {
		const lStrJRestants =
			lNbJoursRestants > 0
				? GTraductions.getValeur("infoSond.repondre", [lNbJoursRestants + 1])
				: GTraductions.getValeur("infoSond.repondre1");
		H.push('<span class="like-link">');
		H.push(lStrJRestants);
		H.push('<i class="icon_justifier"></i>');
		H.push("</span>");
	} else {
		const lEstDerniereReponse = this.moteurCP.getDerniereReponse(aActu);
		if (!!lEstDerniereReponse) {
			if (lEstDerniereReponse.reponse.estRepondant) {
				H.push(
					'<span class="like-link" style="color:',
					GCouleur.noir,
					';">',
					GTraductions.getValeur(
						"actualites.aiReponduLe",
						GDate.formatDate(
							lEstDerniereReponse.reponse.reponduLe,
							"%JJ/%MM/%AAAA",
						),
					),
					lNbJoursRestants > 0
						? " (" +
								GTraductions.getValeur("actualites.modifiableXJours", [
									lNbJoursRestants,
								]) +
								")"
						: "",
					"</span>",
				);
			} else if (lEstDerniereReponse.reponse.estRepondant === false) {
				H.push(
					'<span class="like-link">',
					GTraductions.getValeur("actualites.reponduParX", [
						lEstDerniereReponse.reponse.strRepondant,
						GDate.formatDate(
							lEstDerniereReponse.reponse.reponduLe,
							"%JJ/%MM/%AAAA",
						),
					]),
					"</span>",
				);
			}
		}
	}
	return H.join("");
}
module.exports = { DonneesListe_InfosSond };
