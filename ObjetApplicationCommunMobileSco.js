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
const ObjetWAI_1 = require("ObjetWAI");
const UtilitaireRedirection_1 = require("UtilitaireRedirection");
const Enumere_Espace_1 = require("Enumere_Espace");
const Invocateur_1 = require("Invocateur");
const ThemesCouleurs_1 = require("ThemesCouleurs");
const UtilitaireMenuContextuelNatif_1 = require("UtilitaireMenuContextuelNatif");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const TypeThemeCouleur_1 = require("TypeThemeCouleur");
const UtilitairePagePubliqueEtablissement_1 = require("UtilitairePagePubliqueEtablissement");
const ObjetWAI_2 = require("ObjetWAI");
const _ObjetCouleur_1 = require("_ObjetCouleur");
const TypeCollectivite_1 = require("TypeCollectivite");
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
		if (aParam.avecPagePubliqueEtab === true) {
			global.GParametres = Object.assign({}, aParam);
			global.GCouleur = new _ObjetCouleur_1._ObjetCouleur(undefined);
			const lParam = Object.assign({ id: this.getIdConteneur() }, aParam);
			this.utilitairePagePubliqueEtablissement =
				new UtilitairePagePubliqueEtablissement_1.UtilitairePagePubliqueEtablissement(
					{ estSurMobile: true, estPrimaire: this.estPrimaire },
				);
			this.utilitairePagePubliqueEtablissement.initGlobales();
			this.donneesRequete =
				this.utilitairePagePubliqueEtablissement.initDonneesRequete();
			CollectionRequetes_1.Requetes.inscrire(
				"PagePubliqueEtablissement",
				ObjetRequeteJSON_1.ObjetRequeteConsultation,
			);
			(0, CollectionRequetes_1.Requetes)("PagePubliqueEtablissement", this)
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
			UtilitaireMenuContextuelNatif_1.UtilitaireMenuContextuelNatif.desactiverSurElement(
				$(document),
			);
			$(window).on("resize", { aObjet: this }, this.centrer).resize();
		}
	}
	construireAffichage() {
		const lHtml = [];
		lHtml.push('<div class="accueil-mobile">');
		lHtml.push(this.construireEntete());
		lHtml.push('<main class="main-contain">', this.construirePage(), "</main>");
		lHtml.push(this.construireFooter());
		lHtml.push("</div>");
		return lHtml.join("");
	}
	construireEntete() {
		const lHtml = [];
		lHtml.push(
			'<nav class="nav-login">',
			'<div class="nav-wrapper main-header disable-dark-mode">',
			' <div class="header-gauche">',
			'   <div class="masque-vide"></div>',
			" </div>",
			' <div class="header-droit">',
			'   <div class="infos-container" tabindex="0" role="heading">',
			"     <h2> ",
			this.nomEtablissementConnexion,
			"</h2>",
			"   </div>",
			" </div>",
			"</div>",
			"</nav>",
		);
		return lHtml.join("");
	}
	construirePage() {
		const lHtml = [];
		lHtml.push(
			`<div id="${this.idWrapper}" class="liste-wrapper">\n                <ul id="${this.idConnect}">`,
		);
		for (let I = 0; I < this.listeBoutons.count(); I++) {
			const lBouton = this.listeBoutons.get(I);
			lHtml.push(
				`<li>\n                  <a id="${this.idBouton}${I}" class="ie-ripple btn-connexion" onclick="location.assign('${lBouton.url}${new UtilitaireRedirection_1.UtilitaireRedirection().getParametresUrl({ parametresASupprimer: ["redirect"] })}')" ${ObjetWAI_2.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Button)} target="_self" tabindex="0" accessKey="${I + 1}">\n                         <span class="img-btn ${this.getImageEspace(lBouton.Genre)}"></span>\n                         <span class="libelle">${lBouton.getLibelle()}</span>\n                  </a>\n                </li>`,
			);
		}
		lHtml.push(`</ul>\n          </div>`);
		if (this.avecBoutonRetourEspace) {
			lHtml.push(
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
		return lHtml.join("");
	}
	construireFooter() {
		const lNomApp = this.estEDT
			? "EDT"
			: this.estPrimaire
				? "PRONOTE PRIMAIRE"
				: "PRONOTE";
		const lHtml = [];
		lHtml.push("<footer>");
		if (!!this.mentionsPagesPubliques && !!this.mentionsPagesPubliques.lien) {
			lHtml.push(
				'<div style="flex-basis: 100%; text-align: center;">',
				this.mentionsPagesPubliques.lien,
				"</div>",
			);
		}
		if (this.lienMentions) {
			lHtml.push(
				'<a href="',
				this.lienMentions,
				'" target="_blank">',
				ObjetTraduction_1.GTraductions.getValeur("mentionsLegales"),
				"</a>",
			);
		}
		lHtml.push(
			'<a href="',
			this.lienIndex,
			'" title="',
			this.version,
			'" target="_blank">',
		);
		lHtml.push(lNomApp);
		lHtml.push("&copy;", " ", this.millesime);
		lHtml.push("</a>");
		lHtml.push("</footer>");
		return lHtml.join("");
	}
	centrer() {}
	getImageEspace(aEspace) {
		let lImageEspace = "Icone_EspaceInvite";
		switch (aEspace) {
			case Enumere_Espace_1.EGenreEspace.Mobile_Professeur:
				lImageEspace = "Icone_EspaceEnseignant";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur:
				lImageEspace = "Icone_EspaceEnseignant";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Eleve:
				lImageEspace = "Icone_EspaceEtudiant";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve:
				lImageEspace = "Icone_EspaceEtudiant";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Etablissement:
				lImageEspace = "Icone_EspaceSecretariat";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Parent:
				lImageEspace = "Icone_EspaceParent";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimParent:
				lImageEspace = "Icone_EspaceParent";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Administrateur:
				lImageEspace = "Icone_EspaceAdministratif";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant:
				lImageEspace = "Icone_EspaceAccompagnant";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant:
				lImageEspace = "Icone_EspaceAccompagnant";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Tuteur:
				lImageEspace = "Icone_EspaceTuteur";
				break;
			case Enumere_Espace_1.EGenreEspace.PrimPeriscolaire:
				lImageEspace = "Icone_EspacePeriscolaire";
				break;
			case Enumere_Espace_1.EGenreEspace.PrimMairie:
				lImageEspace = "Icone_EspaceMairie";
				break;
			case Enumere_Espace_1.EGenreEspace.PrimDirection:
				lImageEspace = "Icone_EspaceAdministratif";
				break;
		}
		return lImageEspace;
	}
}
exports.ObjetApplicationCommunMobileSco = ObjetApplicationCommunMobileSco;
