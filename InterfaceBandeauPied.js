exports.ObjetAffichageBandeauPied = void 0;
const _InterfaceBandeauPied_1 = require("_InterfaceBandeauPied");
const Enumere_Commande_1 = require("Enumere_Commande");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireRedirection_1 = require("UtilitaireRedirection");
const AccessApp_1 = require("AccessApp");
const Tooltip_1 = require("Tooltip");
class ObjetAffichageBandeauPied extends _InterfaceBandeauPied_1._ObjetAffichageBandeauPied {
	constructor(...aParams) {
		super(...aParams);
		this.appSco = (0, AccessApp_1.getApp)();
		this.parametresSco = this.appSco.getObjetParametres();
		this.options = {
			mention: this.parametresSco.publierMentions,
			siteIndex:
				this.parametresSco.urlSiteIndexEducation ||
				"https://www.index-education.com",
			urlInfosHebergement: this.parametresSco.urlInfosHebergement,
			logoProduitCss: this.parametresSco.logoProduitCss || "",
			estHebergeEnFrance: this.parametresSco.estHebergeEnFrance,
			pageEtablissement: this.parametresSco.PageEtablissement || "",
			avecBoutonMasquer: true,
			urlDeclarationAccessibilite:
				this.parametresSco.urlDeclarationAccessibilite,
			accessibiliteNonConforme: this.parametresSco.accessibiliteNonConforme,
		};
	}
	getCommande(aGenreCommande) {
		switch (aGenreCommande) {
			case this.genreCommande.forum:
				return Enumere_Commande_1.EGenreCommande.Forum;
			case this.genreCommande.twitter:
				return Enumere_Commande_1.EGenreCommande.Twitter;
			case this.genreCommande.videos:
				return Enumere_Commande_1.EGenreCommande.Videos;
			case this.genreCommande.profil:
				return Enumere_Commande_1.EGenreCommande.Profil;
			default:
				return false;
		}
	}
	evenementBouton(aParam, aGenreBouton) {
		if (aParam.genreCmd === this.getCommande(this.genreCommande.twitter)) {
			if (!!this.parametresSco.urlAccesTwitter) {
				window.open(this.parametresSco.urlAccesTwitter);
			}
			return;
		}
		return super.evenementBouton(aParam, aGenreBouton);
	}
	avecTwitter() {
		return (
			this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionTwitter,
			) && !!this.parametresSco.urlAccesTwitter
		);
	}
	avecPlanSite() {
		return true;
	}
	avecBoutonAccesProfil() {
		return (
			!GNavigateur.isIOS &&
			GEtatUtilisateur.GenreEspace !== Enumere_Espace_1.EGenreEspace.Inscription
		);
	}
	composeBoutonAccesProfil() {
		const lStrTuto = this.appSco.estEDT
			? ObjetTraduction_1.GTraductions.getValeur("PiedPage.tutosForum")
			: ObjetTraduction_1.GTraductions.getValeur("PiedPage.tutosForumQCM");
		return IE.jsx.str(
			"div",
			{
				role: "link",
				tabindex: "0",
				class: "ibp-pill icon_light_bulb",
				"ie-node": this.jsxNodePied.bind(
					this,
					this.getCommande(this.genreCommande.profil),
				),
				"ie-tooltiplabel": `${ObjetTraduction_1.GTraductions.getValeur("PiedPage.toutSavoirPronote")}\n${lStrTuto}`,
			},
			IE.jsx.str(
				"div",
				{ class: "kb-conteneur ellipsis-multilignes nb3" },
				IE.jsx.str(
					"p",
					{ class: "as-title" },
					ObjetTraduction_1.GTraductions.getValeur(
						"PiedPage.toutSavoirPronote",
					),
				),
				IE.jsx.str("p", null, lStrTuto),
			),
		);
	}
	avecBoutonPersonnaliseProduit() {
		return (
			!GNavigateur.isIOS &&
			[
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace) &&
			this.parametresSco.estHebergeEnFrance &&
			!!this.parametresSco.urlCanope
		);
	}
	composeBoutonPersonnaliseProduit() {
		const lnodeCanope = (aNode) => {
			$(aNode).eventValidation(() => {
				window.open(this.parametresSco.urlCanope);
			});
		};
		return IE.jsx.str(
			"div",
			{ class: "ibp-pill partenaire-canope", "ie-node": lnodeCanope },
			IE.jsx.str("ie-btnimage", {
				class: "btnImageIcon Image_Partenaire_Canope_2022",
				role: "link",
				"aria-label":
					ObjetTraduction_1.GTraductions.getValeur("PiedPage.Canope"),
			}),
		);
	}
	avecBoutonPageEtablissement() {
		return !!this.options.pageEtablissement;
	}
	composeBoutonPageEtablissement() {
		const lnodePageEtab = (aNode) => {
			$(aNode).eventValidation(() => {
				let lUrl = window.location.href.split("/");
				lUrl.pop();
				const lStrlUrl = lUrl.join("/") + "/";
				window.open(
					lStrlUrl +
						this.options.pageEtablissement +
						new UtilitaireRedirection_1.UtilitaireRedirection().getParametresUrl(),
				);
			});
		};
		return IE.jsx.str(
			"div",
			{
				tabindex: "0",
				role: "link",
				class: "ibp-pill icon_ecole",
				"aria-label": ObjetTraduction_1.GTraductions.getValeur(
					"PiedPage.PageEtablissement",
				),
				"ie-node": lnodePageEtab,
				"data-tooltip": Tooltip_1.Tooltip.Type.default,
			},
			IE.jsx.str(
				"p",
				{ class: "help-text" },
				" ",
				ObjetTraduction_1.GTraductions.getValeur("PiedPage.PageEtablissement"),
			),
		);
	}
	espacesISO27001() {
		return !this.appSco.getEtatUtilisateur().pourPrimaire();
	}
}
exports.ObjetAffichageBandeauPied = ObjetAffichageBandeauPied;
