exports.DonneesListe_FicheBrevetCC = void 0;
const TypeColonneControlContinuBrevet_1 = require("TypeColonneControlContinuBrevet");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const AccessApp_1 = require("AccessApp");
const TypeNote_1 = require("TypeNote");
class DonneesListe_FicheBrevetCC extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.application = (0, AccessApp_1.getApp)();
		this.etatUtilisatuer = this.application.getEtatUtilisateur();
	}
	getErreur(aArticle, aGenre) {
		const lErreur = aArticle.listeColoneesErreur.getElementParFiltre(
			({ genreColonne }) => aGenre === genreColonne,
		);
		const lMessage =
			lErreur === null || lErreur === void 0 ? void 0 : lErreur.message;
		return [!!lMessage, lMessage];
	}
	getTooltip(aParams) {
		const [lAvecErreur, lMessageErreur] = this.getErreur(
			aParams.article,
			aParams.declarationColonne.genreColonne,
		);
		if (lAvecErreur) {
			return lMessageErreur;
		}
		switch (aParams.declarationColonne.genreColonne) {
			case TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
				.tCCCB_Enseignement:
				return aParams.article.hintInfosService;
			case TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
				.tCCCB_MoyP1:
			case TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
				.tCCCB_MoyP2:
			case TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
				.tCCCB_MoyP3: {
				const lMoyenne = this.getMoyenneParGenreColonne(
					aParams.article,
					aParams.declarationColonne.genreColonne,
				);
				return lMoyenne && "estNonRepresentative" in lMoyenne
					? ObjetTraduction_1.GTraductions.getValeur(
							"Notes.Colonne.HintMoyenneNR",
						)
					: "";
			}
			default:
				return "";
		}
	}
	avecSaisie() {
		return this.etatUtilisatuer.estEspacePourProf();
	}
	getClass(aParams) {
		const lClass = [];
		const [lAvecErreur] = this.getErreur(
			aParams.article,
			aParams.declarationColonne.genreColonne,
		);
		const lSansInfosService =
			[
				TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
					.tCCCB_Enseignement,
			].includes(aParams.declarationColonne.genreColonne) &&
			!aParams.article.infosService &&
			!aParams.article.estNonSuivi;
		if (lAvecErreur || lSansInfosService) {
			if (this.avecSaisie()) {
				lClass.push(Couleurs_css_1.StylesCouleurs.colorRedMoyen);
			}
		}
		if (
			![
				TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
					.tCCCB_Enseignement,
			].includes(aParams.declarationColonne.genreColonne)
		) {
			lClass.push(Divers_css_1.StylesDivers.textRight);
		}
		return lClass.join(" ");
	}
	surEdition(aParams, V) {
		if (
			!this.avecSaisie() ||
			aParams.declarationColonne.genreColonne !==
				TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
					.tCCCB_MoyA
		) {
			return;
		}
		if (V instanceof TypeNote_1.TypeNote && !V.estUneNoteVide()) {
			if (!aParams.article.moyenneAnnuel) {
				return;
			}
			aParams.article.moyenneAnnuel.moyenne = V;
		}
	}
	avecEdition(aParams) {
		if (!this.avecSaisie()) {
			return false;
		}
		switch (aParams.declarationColonne.genreColonne) {
			case TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
				.tCCCB_MoyA: {
				const lPeutEditMoye =
					aParams.article.moyenneAnnuel &&
					"avecMoyenneASaisir" in aParams.article.moyenneAnnuel &&
					aParams.article.moyenneAnnuel.avecMoyenneASaisir;
				return lPeutEditMoye;
			}
			default:
				return false;
		}
	}
	getValeur(aParams) {
		switch (aParams.declarationColonne.genreColonne) {
			case TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
				.tCCCB_Enseignement:
				return this.getHtmlEnseignement(aParams.article);
			case TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
				.tCCCB_MoyP1:
			case TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
				.tCCCB_MoyP2:
			case TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
				.tCCCB_MoyP3:
			case TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
				.tCCCB_MoyA: {
				const [lValeur] = this.getValeurEtTypeMoyenne(
					aParams.article,
					aParams.declarationColonne.genreColonne,
				);
				return lValeur;
			}
			default:
				return;
		}
	}
	getValeurEtTypeMoyenne(aArticle, aGenreColonne) {
		const lMoyenne = this.getMoyenneParGenreColonne(aArticle, aGenreColonne);
		const lTypeCellule =
			ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		if (!lMoyenne) {
			return ["", lTypeCellule];
		}
		if ("moyenne" in lMoyenne && !lMoyenne.moyenne.estUneNoteVide()) {
			return [
				lMoyenne.moyenne,
				ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Note,
			];
		}
		if ("avecWarningNote" in lMoyenne && lMoyenne.avecWarningNote) {
			return [this.avecSaisie() ? this.getHtmlWarningNote() : "", lTypeCellule];
		}
		if (
			aGenreColonne ===
			TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
				.tCCCB_MoyA
		) {
			if ("avecMoyenneASaisir" in lMoyenne) {
				return [
					new TypeNote_1.TypeNote(),
					ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Note,
				];
			}
		} else {
			if ("estNonRepresentative" in lMoyenne && lMoyenne.estNonRepresentative) {
				return [this.getHtmlNr(), lTypeCellule];
			}
		}
		return ["", lTypeCellule];
	}
	getHtmlWarningNote() {
		return IE.jsx.str("i", {
			class: [
				fonts_css_1.StylesFonts.icon_warning_sign,
				Divers_css_1.StylesDivers.iMedium,
			],
			role: "presentation",
		});
	}
	getHtmlNr() {
		return IE.jsx.str(
			"div",
			{
				class: Divers_css_1.StylesDivers.notation_pastille_moy_NR,
				"aria-hidden": "true",
			},
			ObjetTraduction_1.GTraductions.getValeur("Notes.Colonne.TitreMoyNR"),
		);
	}
	getMoyenneParGenreColonne(aArticle, aGenreColonne) {
		switch (aGenreColonne) {
			case TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
				.tCCCB_MoyP1:
				return aArticle.moyenneP1;
			case TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
				.tCCCB_MoyP2:
				return aArticle.moyenneP2;
			case TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
				.tCCCB_MoyP3:
				return aArticle.moyenneP3;
			case TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
				.tCCCB_MoyA:
				return aArticle.moyenneAnnuel;
		}
	}
	getHtmlEnseignement(aArticle) {
		var _a;
		return IE.jsx.str(
			"div",
			null,
			IE.jsx.str(
				"p",
				{
					"ie-ellipsis": true,
					class: [
						Divers_css_1.StylesDivers.semiBold,
						aArticle.infosService && Divers_css_1.StylesDivers.mBottom,
					],
				},
				aArticle.libelleMatiere,
			),
			(_a = aArticle.infosService) === null || _a === void 0
				? void 0
				: _a.map((aInfo) => IE.jsx.str("p", { "ie-ellipsis": true }, aInfo)),
		);
	}
	getTypeValeur(aParams) {
		switch (aParams.declarationColonne.genreColonne) {
			case TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
				.tCCCB_Enseignement:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
				.tCCCB_MoyP1:
			case TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
				.tCCCB_MoyP2:
			case TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
				.tCCCB_MoyP3:
			case TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
				.tCCCB_MoyA: {
				const [, lTypeValeur] = this.getValeurEtTypeMoyenne(
					aParams.article,
					aParams.declarationColonne.genreColonne,
				);
				return lTypeValeur;
			}
			default:
				return super.getTypeValeur(aParams);
		}
	}
}
exports.DonneesListe_FicheBrevetCC = DonneesListe_FicheBrevetCC;
