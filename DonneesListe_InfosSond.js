exports.DonneesListe_InfosSond = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetChaine_1 = require("ObjetChaine");
const MoteurInfoSondage_1 = require("MoteurInfoSondage");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const MethodesObjet_1 = require("MethodesObjet");
const AccessApp_1 = require("AccessApp");
class DonneesListe_InfosSond extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aOptions, aUtilitaires) {
		super(aDonnees);
		this.utilitaires = aUtilitaires;
		this.moteurCP = new MoteurInfoSondage_1.MoteurInfoSondage(aUtilitaires);
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
				? ObjetChaine_1.GChaine.replaceRCToHTML(lActu.detailPublicSuccinct)
				: "";
			H.push(
				'<div style="color:',
				(0, AccessApp_1.getApp)().getCouleur().themeCouleur.foncee,
				'">',
				lDetailPublic,
				"</div>",
			);
		} else {
			H.push(
				'<time datetime="',
				ObjetDate_1.GDate.formatDate(lActu.dateDebut, "%MM-%JJ"),
				'">',
				ObjetDate_1.GDate.formatDate(lActu.dateDebut, "%JJJ %JJ %MMM"),
				"</time>",
			);
		}
		return H.join("");
	}
	getZoneComplementaire(aParams) {
		var _a, _b, _c, _d;
		const lActu = aParams.article;
		const lEstModeDiffusion = this.param.avecEditionActualite;
		const H = [];
		const lListePiecesJointes =
			this.moteurCP.getListePiecesJointesDActualite(lActu);
		if (lEstModeDiffusion) {
			H.push('<div class="icones-conteneur">');
			if (lListePiecesJointes.count() > 0) {
				H.push(this.getIconePJ());
			}
			if (lActu.estModele !== true) {
				if (
					lActu.listeIndividusPartage !== null &&
					lActu.listeIndividusPartage !== undefined &&
					lActu.listeIndividusPartage.count() > 0
				) {
					H.push(
						IE.jsx.str("i", {
							"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
								"infoSond.detailPartageSondN",
								[lActu.listeIndividusPartage.count()],
							),
							class: "icon icon_eye_open",
							role: "img",
						}),
					);
				}
				H.push(
					this.moteurCP.composeIconDiffusionPageEtablissement({
						actualite: lActu,
					}),
				);
				H.push(this.moteurCP.composeIconPublication({ actualite: lActu }));
			} else {
				if (
					lActu.avecGestionPartage &&
					((_a =
						lActu === null || lActu === void 0
							? void 0
							: lActu.listeModalitesParPublic) === null || _a === void 0
						? void 0
						: _a.count()) > 0
				) {
					const lHint =
						(_d =
							(_c =
								(_b = this.param) === null || _b === void 0
									? void 0
									: _b.getHintModalite) === null || _c === void 0
								? void 0
								: _c.call(
										_b,
										lActu === null || lActu === void 0
											? void 0
											: lActu.listeModalitesParPublic,
									)) !== null && _d !== void 0
							? _d
							: ObjetTraduction_1.GTraductions.getValeur(
									"infoSond.modelePartage",
								);
					H.push(
						IE.jsx.str("i", {
							class: "icon icon_fiche_cours_partage",
							"ie-tooltiplabel": lHint,
							role: "img",
						}),
					);
				}
			}
			H.push("</div>");
			if (
				Object.prototype.hasOwnProperty.call(lActu, "pourcentRepondu") &&
				MethodesObjet_1.MethodesObjet.isNumeric(lActu.pourcentRepondu)
			) {
				const lHint = ObjetTraduction_1.GTraductions.getValeur(
					lActu.estSondage
						? "infoSond.TauxReponse"
						: lActu.estInformation
							? "infoSond.TauxLecture"
							: "",
				);
				H.push(
					IE.jsx.str(
						"div",
						{ class: "pourcentage-conteneur" },
						IE.jsx.str(
							"span",
							{ class: "ie-sous-titre", "ie-tooltipdescribe": lHint },
							lActu.pourcentRepondu,
							"%",
						),
					),
				);
			}
		} else {
			if (lListePiecesJointes.count() > 0) {
				H.push('<div class="icones-conteneur">');
				H.push(this.getIconePJ());
				H.push("</div>");
			}
		}
		return H.join("");
	}
	getIconePJ() {
		return IE.jsx.str("i", {
			class: "icon icon_piece_jointe",
			"ie-tooltiplabel":
				ObjetTraduction_1.GTraductions.getValeur("infoSond.avecPJ"),
			role: "img",
		});
	}
	getZoneMessage(aParams) {
		const lActu = aParams.article;
		const lEstModeReception = !this.param.avecEditionActualite;
		const H = [];
		if (lEstModeReception && lActu && lActu.estSondage) {
			H.push(this._composeEtatReponseSondage(lActu));
		}
		return H.join("");
	}
	remplirMenuContextuel(aParams) {
		const lMenu = aParams.menuContextuel;
		const lArticle = aParams.article;
		this.moteurCP.initCommandesMenuCtxDInfoSond(lMenu, lArticle, this.param);
	}
	_composeEtatReponseSondage(aActu) {
		const H = [];
		const lARepondu = this.moteurCP.aToutRepondu(aActu);
		const lNbJoursRestants = ObjetDate_1.GDate.getDifferenceJours(
			aActu.dateFin,
			new Date(),
		);
		if (!lARepondu) {
			const lStrJRestants =
				lNbJoursRestants > 0
					? ObjetTraduction_1.GTraductions.getValeur("infoSond.repondre", [
							lNbJoursRestants + 1,
						])
					: ObjetTraduction_1.GTraductions.getValeur("infoSond.repondre1");
			H.push('<span class="like-link alert-color">');
			H.push(lStrJRestants);
			H.push('<i class="icon_justifier" role="presentation"></i>');
			H.push("</span>");
		} else {
			const lEstDerniereReponse = this.moteurCP.getDerniereReponse(aActu);
			if (!!lEstDerniereReponse) {
				if (lEstDerniereReponse.reponse.estRepondant) {
					H.push(
						'<span class="like-link alert-color">',
						ObjetTraduction_1.GTraductions.getValeur(
							"actualites.aiReponduLe",
							ObjetDate_1.GDate.formatDate(
								lEstDerniereReponse.reponse.reponduLe,
								"%JJ/%MM/%AAAA",
							),
						),
						lNbJoursRestants > 0
							? " (" +
									ObjetTraduction_1.GTraductions.getValeur(
										"actualites.modifiableXJours",
										[lNbJoursRestants],
									) +
									")"
							: "",
						"</span>",
					);
				} else if (lEstDerniereReponse.reponse.estRepondant === false) {
					H.push(
						'<span class="like-link alert-color">',
						ObjetTraduction_1.GTraductions.getValeur("actualites.reponduParX", [
							lEstDerniereReponse.reponse.strRepondant,
							ObjetDate_1.GDate.formatDate(
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
}
exports.DonneesListe_InfosSond = DonneesListe_InfosSond;
