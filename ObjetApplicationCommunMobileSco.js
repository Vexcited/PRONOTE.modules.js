exports.ObjetApplicationCommunMobileSco = void 0;
require("NamespaceIE.js");
require("DeclarationJQuery.js");
require("DeclarationCurseurPN.js");
require("ObjetNavigateur.js");
const ObjetApplicationProduit_1 = require("ObjetApplicationProduit");
const ObjetRequetePageCommune_1 = require("ObjetRequetePageCommune");
const CommunicationProduit_1 = require("CommunicationProduit");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireRedirection_1 = require("UtilitaireRedirection");
const Enumere_Espace_1 = require("Enumere_Espace");
const Invocateur_1 = require("Invocateur");
const ThemesCouleurs_1 = require("ThemesCouleurs");
const UtilitaireMenuContextuelNatif_1 = require("UtilitaireMenuContextuelNatif");
const TypeThemeCouleur_1 = require("TypeThemeCouleur");
const UtilitairePagePubliqueEtablissement_1 = require("UtilitairePagePubliqueEtablissement");
const _ObjetCouleur_1 = require("_ObjetCouleur");
const TypeCollectivite_1 = require("TypeCollectivite");
const ObjetParametresCommunSco_1 = require("ObjetParametresCommunSco");
const AccessApp_1 = require("AccessApp");
const GlossaireCP_1 = require("GlossaireCP");
const ObjetRequetePagePubliqueEtablissement_1 = require("ObjetRequetePagePubliqueEtablissement");
class ObjetApplicationCommunMobileSco extends ObjetApplicationProduit_1.ObjetApplicationProduit {
	constructor() {
		super();
		this.Nom = "GApplication";
		this.PositionFocus = 1;
		this.idWrapper = this.Nom + "_wrapper";
		this.idConnect = this.Nom + "_connect";
		this.idBouton = this.Nom + "_bouton_";
		this.idRedirect = this.Nom + "_redirect";
		if (window.location.search.search("redirect=1") > 0) {
			this.avecBoutonRetourEspace = true;
		} else {
			this.avecBoutonRetourEspace = false;
		}
	}
	async lancer(aParametres) {
		const lNumeroSession = aParametres.h;
		this.numeroEspace =
			aParametres.a || Enumere_Espace_1.EGenreEspace.Mobile_Commun;
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.initChiffrement,
			aParametres,
		);
		this.setCommunication(
			new CommunicationProduit_1.CommunicationProduit(
				this.numeroEspace,
				lNumeroSession,
			),
		);
		this.actionSurRecupererDonnees(
			await new ObjetRequetePageCommune_1.ObjetRequetePageCommune(
				this,
			).lancerRequete(),
		);
	}
	actionSurRecupererDonnees(aParam) {
		var _a, _b;
		let lTheme = GApplication.estEDT
			? TypeThemeCouleur_1.TypeThemeProduit.EDT
			: TypeThemeCouleur_1.TypeThemeProduit.Pronote;
		if (
			(aParam === null || aParam === void 0 ? void 0 : aParam.Collectivite) &&
			Object.values(TypeCollectivite_1.TypeCollectivite).includes(
				(_a = aParam.Collectivite) === null || _a === void 0
					? void 0
					: _a.genreCollectivite,
			) &&
			((_b = aParam.Collectivite) === null || _b === void 0
				? void 0
				: _b.genreCollectivite) !==
				TypeCollectivite_1.TypeCollectivite.TCL_Aucune
		) {
			const lThemeCollectivite = (0,
			TypeCollectivite_1.TypeCollectiviteToTypeThemeCollectivite)(
				aParam.Collectivite.genreCollectivite,
			);
			if (lThemeCollectivite) {
				lTheme = lThemeCollectivite;
			}
		}
		ThemesCouleurs_1.ThemesCouleurs.setTheme(lTheme);
		const lParametres = (global.GParametres =
			new ObjetParametresCommunSco_1.ObjetParametresCommunSco(aParam));
		if (aParam.avecPagePubliqueEtab === true) {
			global.GCouleur = new _ObjetCouleur_1._ObjetCouleur(undefined);
			const lParam = Object.assign({ id: this.getIdConteneur() }, aParam);
			this.utilitairePagePubliqueEtablissement =
				new UtilitairePagePubliqueEtablissement_1.UtilitairePagePubliqueEtablissement(
					{
						estSurMobile: true,
						estPrimaire: this.estPrimaire,
						parametresCommun: lParametres,
					},
				);
			this.utilitairePagePubliqueEtablissement.initGlobales();
			this.donneesRequete =
				this.utilitairePagePubliqueEtablissement.initDonneesRequete();
			new ObjetRequetePagePubliqueEtablissement_1.ObjetRequetePagePubliqueEtablissement(
				this,
			)
				.lancerRequete(this.donneesRequete)
				.then((aParam) => {
					$.extend(lParam, aParam);
					this.utilitairePagePubliqueEtablissement.construire(
						lParam,
						this.donneesRequete,
					);
				});
		} else {
			this.listeBoutons = aParam.espaces;
			this.lienIndex = aParam.urlSiteIndexEducation;
			this.nomEtablissement = aParam.NomEtablissement;
			this.nomEtablissementConnexion = aParam.NomEtablissementConnexion;
			this.anneeScolaire = aParam.anneeScolaire;
			this.version = aParam.version;
			this.millesime = aParam.millesime;
			this.avecImage = aParam.AvecImagesConnexion;
			this.url = aParam.url;
			this.lienMentions = aParam.lienMentions;
			this.mentionsPagesPubliques = aParam.mentionsPagesPubliques;
			ObjetHtml_1.GHtml.setHtml(
				this.getIdConteneur(),
				this.construireAffichage(),
			);
			(0, AccessApp_1.getApp)()
				.getObjetParametres()
				.setDocumentTitle(GlossaireCP_1.TradGlossaireCP.PageCommune);
			UtilitaireMenuContextuelNatif_1.UtilitaireMenuContextuelNatif.desactiverSurElement(
				$(document),
			);
			$(window).on("resize", { aObjet: this }, this.centrer).resize();
		}
	}
	construireAffichage() {
		const H = [];
		H.push('<div class="accueil-mobile">');
		H.push(this.construireEntete());
		H.push('<main class="main-contain">', this.construirePage(), "</main>");
		H.push(this.construireFooter());
		H.push("</div>");
		return H.join("");
	}
	construireEntete() {
		const H = [];
		H.push(
			IE.jsx.str(
				"nav",
				{ class: "nav-login" },
				IE.jsx.str(
					"div",
					{ class: "nav-wrapper main-header disable-dark-mode" },
					IE.jsx.str(
						"div",
						{ class: "header-gauche" },
						IE.jsx.str("div", { class: "masque-vide" }),
					),
					IE.jsx.str(
						"div",
						{ class: "header-droit" },
						IE.jsx.str(
							"div",
							{
								class: "infos-container",
								tabindex: "-1",
								role: "heading",
								"aria-level": "1",
							},
							IE.jsx.str("h2", null, " ", this.nomEtablissementConnexion),
						),
					),
				),
			),
		);
		return H.join("");
	}
	construirePage() {
		const H = [];
		H.push(
			`<div id="${this.idWrapper}" class="liste-wrapper">\n                <ul id="${this.idConnect}">`,
		);
		for (let I = 0; I < this.listeBoutons.count(); I++) {
			const lBouton = this.listeBoutons.get(I);
			H.push(
				IE.jsx.str(
					"li",
					null,
					IE.jsx.str(
						"a",
						{
							id: this.idBouton + I,
							class: [
								IEHtml_Ripple_css_1.StylesIEHtmlRipple.ieRipple,
								"btn-connexion",
							],
							onclick: `location.assign('${lBouton.url}${new UtilitaireRedirection_1.UtilitaireRedirection().getParametresUrl({ parametresASupprimer: ["redirect"] })}')`,
							role: "button",
							target: "_self",
							tabindex: "0",
							accesskey: I + 1 + "",
						},
						IE.jsx.str(
							"div",
							{ class: "img-btn-bg" },
							IE.jsx.str("span", {
								class: ["img-btn", this.getImageEspace(lBouton.Genre)],
							}),
						),
						IE.jsx.str("span", { class: "libelle" }, lBouton.getLibelle()),
					),
				),
			);
		}
		H.push(`</ul>\n          </div>`);
		if (this.avecBoutonRetourEspace) {
			H.push(
				'<div id="',
				this.idRedirect,
				'" class="retour-espace">',
				"<p>",
				ObjetTraduction_1.GTraductions.getValeur(
					"mobile.redirigeVersionMobile",
				),
				"</p>",
				'<ie-bouton class=" small-bt themeBoutonNeutre" onclick="location.assign(\'',
				this.url ? this.url : ".",
				new UtilitaireRedirection_1.UtilitaireRedirection().getParametresUrl({
					parametres: [{ parametre: "fd", valeur: "1" }],
					parametresASupprimer: ["redirect"],
				}),
				"')\">",
				ObjetTraduction_1.GTraductions.getValeur(
					"mobile.accederVersionClassique",
				),
				"</ie-bouton>",
				"</div>",
			);
		}
		return H.join("");
	}
	construireFooter() {
		const lNomApp = this.estEDT
			? "EDT"
			: this.estPrimaire
				? "PRONOTE PRIMAIRE"
				: "PRONOTE";
		const H = [];
		H.push("<footer>");
		if (!!this.mentionsPagesPubliques && !!this.mentionsPagesPubliques.lien) {
			H.push(
				'<div style="flex-basis: 100%; text-align: center;">',
				this.mentionsPagesPubliques.lien,
				"</div>",
			);
		}
		if (this.lienMentions) {
			H.push(
				'<a href="',
				this.lienMentions,
				'" target="_blank">',
				ObjetTraduction_1.GTraductions.getValeur("mentionsLegales"),
				"</a>",
			);
		}
		H.push(
			'<a href="',
			this.lienIndex,
			'" title="',
			this.version,
			'" target="_blank" style="flex: auto;">',
		);
		H.push(lNomApp);
		H.push("&copy;", " ", this.millesime);
		H.push("</a>");
		H.push("</footer>");
		return H.join("");
	}
	centrer() {}
	getImageEspace(aEspace) {
		let lImageEspace = "Icone_EspaceInvite";
		switch (aEspace) {
			case Enumere_Espace_1.EGenreEspace.Mobile_Professeur:
				lImageEspace = "Icone_EspaceEnseignant";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur:
				lImageEspace = "Icone_EspacePrimEnseignant";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Eleve:
				lImageEspace = "Icone_EspaceEtudiant";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve:
				lImageEspace = "Icone_EspacePrimEtudiant";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Etablissement:
				lImageEspace = "Icone_EspaceSecretariat";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Parent:
				lImageEspace = "Icone_EspaceParent";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimParent:
				lImageEspace = "Icone_EspacePrimParent";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Entreprise:
				lImageEspace = "Icone_EspaceEntreprise";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Administrateur:
				lImageEspace = "Icone_EspaceAdministratif";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant:
				lImageEspace = "Icone_EspaceAccompagnant";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant:
				lImageEspace = "Icone_EspacePrimAccompagnant";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Tuteur:
				lImageEspace = "Icone_EspaceTuteur";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimPeriscolaire:
				lImageEspace = "Icone_EspacePeriscolaire";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimMairie:
				lImageEspace = "Icone_EspaceMairie";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection:
				lImageEspace = "Icone_EspacePrimAdministratif";
				break;
		}
		return lImageEspace;
	}
}
exports.ObjetApplicationCommunMobileSco = ObjetApplicationCommunMobileSco;
