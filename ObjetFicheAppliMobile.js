exports.ObjetFicheAppliMobile = void 0;
const ObjetRequeteSaisieJetonAppliMobile_1 = require("ObjetRequeteSaisieJetonAppliMobile");
const GUID_1 = require("GUID");
const UtilitaireQRCode_1 = require("UtilitaireQRCode");
const TraductionsAppliMobile_1 = require("TraductionsAppliMobile");
const AccessApp_1 = require("AccessApp");
const ObjetFenetre_1 = require("ObjetFenetre");
class ObjetFicheAppliMobile extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.code = "";
		this.idCodeWrapper = GUID_1.GUID.getId();
		this.idLienWrapper = GUID_1.GUID.getId();
		this.idConfigWrapper = GUID_1.GUID.getId();
		this.idInputCode = GUID_1.GUID.getId();
		this.idLien = GUID_1.GUID.getId();
		this.url = "";
		this.setOptionsFenetre({
			titre: TraductionsAppliMobile_1.TradAppliMobile.titreFiche,
			positionSurSouris: true,
		});
	}
	jsxModeleBoutonCode() {
		return {
			event: () => {
				new ObjetRequeteSaisieJetonAppliMobile_1.ObjetRequeteSaisieJetonAppliMobile(
					this,
				)
					.lancerRequete({ code: this.code })
					.then(
						(aData) => {
							const lData = aData.JSONReponse;
							if (lData && lData.jeton && lData.login) {
								lData.url = this.url;
								$("#" + this.idLien.escapeJQ()).hide();
								$("#" + this.idCodeWrapper.escapeJQ()).hide();
								$("#" + this.idConfigWrapper.escapeJQ()).show();
								$("#" + this.idLienWrapper.escapeJQ())
									.html(
										UtilitaireQRCode_1.UtilitaireQRCode.genererImage(
											JSON.stringify(lData),
											{
												taille: 320,
												alt: TraductionsAppliMobile_1.TradAppliMobile
													.QRCodeAppliMobile,
											},
										),
									)
									.show();
							} else {
								(0, AccessApp_1.getApp)()
									.getMessage()
									.afficher({
										message:
											TraductionsAppliMobile_1.TradAppliMobile.ErreurRequete,
									})
									.then(() => {
										this.fermer();
									});
							}
						},
						() => {
							(0, AccessApp_1.getApp)()
								.getMessage()
								.afficher({
									message:
										TraductionsAppliMobile_1.TradAppliMobile.ErreurRequete,
								})
								.then(() => {
									this.fermer();
								});
						},
					);
			},
			getDisabled: () => {
				return !this.code || this.code.length !== 4;
			},
		};
	}
	jsxModeleInputCode() {
		return {
			getValue: () => {
				return this.code;
			},
			setValue: (aValue) => {
				this.code = aValue.substring(0, 4);
			},
			getDisabled: () => {
				return false;
			},
		};
	}
	composeContenu() {
		if (this.url) {
			return IE.jsx.str(
				"div",
				{ style: { width: "475px" }, class: "ie-texte" },
				IE.jsx.str(
					"div",
					{ id: this.idCodeWrapper, class: "m-bottom-xl" },
					IE.jsx.str(
						"p",
						{ class: "m-top-none" },
						TraductionsAppliMobile_1.TradAppliMobile.ModeOpQrCode.format([
							(0, AccessApp_1.getApp)().nomProduit,
						]),
					),
					IE.jsx.str(
						"label",
						{ class: "m-y-xl semi-bold", for: this.idInputCode },
						TraductionsAppliMobile_1.TradAppliMobile.CodeVerification,
						IE.jsx.str("input", {
							id: this.idInputCode,
							type: "password",
							"ie-mask": "/[^0-9]/i",
							maxlength: "4",
							style: { width: "4.3rem" },
							class: "m-left as-input",
							"ie-model": this.jsxModeleInputCode.bind(this),
							autocomplete: "new-password",
						}),
					),
					IE.jsx.str(
						"div",
						{ style: { textAlign: "right" } },
						IE.jsx.str(
							"ie-bouton",
							{ "ie-model": this.jsxModeleBoutonCode.bind(this) },
							TraductionsAppliMobile_1.TradAppliMobile.GenererQRCode,
						),
					),
				),
				IE.jsx.str(
					"div",
					{ id: this.idConfigWrapper, style: { display: "none" } },
					IE.jsx.str(
						"ul",
						{ style: { listStyle: "decimal" } },
						IE.jsx.str(
							"li",
							null,
							TraductionsAppliMobile_1.TradAppliMobile.MethodeConfig.format([
								(0, AccessApp_1.getApp)().nomProduit,
							]),
						),
						IE.jsx.str(
							"li",
							null,
							TraductionsAppliMobile_1.TradAppliMobile.MethodeConfigSuite,
						),
						IE.jsx.str(
							"li",
							null,
							TraductionsAppliMobile_1.TradAppliMobile.MethodeConfigFin,
						),
					),
				),
				IE.jsx.str("div", {
					id: this.idLienWrapper,
					class: "text-center m-y-none m-x-auto",
					style: { backgroundColor: "#fff", display: "none" },
				}),
				IE.jsx.str(
					"div",
					{ id: this.idLien, class: "ie-texte-small" },
					IE.jsx.str(
						"p",
						null,
						TraductionsAppliMobile_1.TradAppliMobile.AccesSiteMobile,
					),
					IE.jsx.str("a", { href: this.url, target: "_blank" }, this.url),
				),
			);
		}
		return "";
	}
	afficher(aUrlMobile) {
		if (aUrlMobile) {
			const lUrl = window.location.href.split("/");
			lUrl.pop();
			lUrl.push(aUrlMobile);
			this.url = lUrl.join("/");
		}
		return super.afficher(this.composeContenu());
	}
}
exports.ObjetFicheAppliMobile = ObjetFicheAppliMobile;
