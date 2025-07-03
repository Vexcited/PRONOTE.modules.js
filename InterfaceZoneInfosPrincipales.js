exports.InterfaceZoneInfosPrincipales = void 0;
const ObjetInfoBase_1 = require("ObjetInfoBase");
const AppelMethodeDistante_1 = require("AppelMethodeDistante");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
const AccessApp_1 = require("AccessApp");
var EEvenementBoutonPublication;
(function (EEvenementBoutonPublication) {
	EEvenementBoutonPublication[
		(EEvenementBoutonPublication["ArretPublication"] = 1)
	] = "ArretPublication";
	EEvenementBoutonPublication[
		(EEvenementBoutonPublication["Publication"] = 2)
	] = "Publication";
})(EEvenementBoutonPublication || (EEvenementBoutonPublication = {}));
class InterfaceZoneInfosPrincipales extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.objetApplicationConsoles = (0, AccessApp_1.getApp)();
		this.objetCouleurConsoles = this.objetApplicationConsoles.getCouleur();
	}
	jsxGetStyleEntete() {
		const lActif = this.objetApplicationConsoles.etatServeurHttp.getEtatActif();
		return {
			"background-color": lActif
				? this.objetCouleurConsoles.enService.fond
				: (0, AccessApp_1.getApp)().getCouleur().fond,
			color: lActif
				? this.objetCouleurConsoles.enService.texte
				: (0, AccessApp_1.getApp)().getCouleur().texte,
		};
	}
	jsxModelBoutonPublication() {
		return {
			event: () => {
				this.evenementBoutonPublication(
					this.objetApplicationConsoles.etatServeurHttp.getEtatActif()
						? EEvenementBoutonPublication.ArretPublication
						: EEvenementBoutonPublication.Publication,
				);
			},
			getDisabled: () => {
				return !this.objetApplicationConsoles.etatServeurHttp.getConnecteAuServeur();
			},
			getCssImage: () => {
				return this.objetApplicationConsoles.etatServeurHttp.getEtatActif()
					? "Icone_Commande_ArreterServeur"
					: "Icone_Commande_DemarrerServeur";
			},
			getHtml: () => {
				return this._getLibelleBtnPublication();
			},
		};
	}
	jsxGetTitleBoutonPublication() {
		return this._getLibelleBtnPublication();
	}
	construireInstances() {
		this.identZoneInfoBase = this.add(ObjetInfoBase_1.ObjetInfoBase);
	}
	construireStructureAffichage() {
		const lZoneInfoBase = [];
		if (this.identZoneInfoBase >= 0) {
			lZoneInfoBase.push(
				IE.jsx.str("td", {
					class: "Table",
					id: this.getInstance(this.identZoneInfoBase).getNom(),
				}),
			);
		}
		const H = [];
		H.push(
			IE.jsx.str(
				"table",
				{
					role: "banner",
					class: "Table p-all",
					"ie-style": this.jsxGetStyleEntete.bind(this),
				},
				IE.jsx.str(
					"tr",
					null,
					IE.jsx.str(
						"td",
						{ class: "EspaceDroit" },
						IE.jsx.str("ie-boutonhebergement", {
							"ie-model": this.jsxModelBoutonPublication.bind(this),
							"ie-title": this.jsxGetTitleBoutonPublication.bind(this),
							style: "width:185px;",
						}),
					),
					lZoneInfoBase.join(""),
				),
			),
		);
		return H.join("");
	}
	recupererDonnees() {
		this.getInstance(this.identZoneInfoBase).setParametres(
			this.objetApplicationConsoles.etatServeurHttp.getNomBaseChargee(),
		);
		this.getInstance(this.identZoneInfoBase).afficher();
		this.$refreshSelf();
	}
	evenementBoutonPublication(aGenreEvenement) {
		const lNomService =
			aGenreEvenement === EEvenementBoutonPublication.Publication
				? "Publier"
				: "Arreter";
		const lParam = {
			webService: this.objetApplicationConsoles.WS_adminServeur,
			port: "PortPublicationServeurHttp",
			methode: lNomService,
		};
		const lCommunication = this.objetApplicationConsoles.getCommunicationSOAP();
		const lAppelDistant = new AppelMethodeDistante_1.AppelMethodeDistante(
			lCommunication.webServices,
			lParam,
		);
		lCommunication.appelSOAP(
			lAppelDistant,
			this.objetApplicationConsoles.creerCallbackSOAP(
				this,
				this.callbackSurBouton,
			),
		);
	}
	callbackSurBouton() {
		this.callback.appel();
	}
	_getLibelleBtnPublication() {
		return this.objetApplicationConsoles.etatServeurHttp.getEtatActif()
			? ObjetTraduction_1.GTraductions.getValeur(
					"principal.btnArreterPublication",
				)
			: this.objetApplicationConsoles.etatServeurHttp.getConnecteAuServeur()
				? ObjetTraduction_1.GTraductions.getValeur("principal.btnPublier")
				: ObjetTraduction_1.GTraductions.getValeur(
						"principal.btnPublierInactif",
					);
	}
}
exports.InterfaceZoneInfosPrincipales = InterfaceZoneInfosPrincipales;
