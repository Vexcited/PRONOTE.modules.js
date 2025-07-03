exports.ObjetBoutonFlottant = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const GUID_1 = require("GUID");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetBoutonFlottant extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.iconeCommandeDefaut = "icon_ellipsis_vertical";
		this.positionHorizontalDefaut = "";
		this.positionVerticalDefaut = "bottom";
		this.initOptionsBouton();
	}
	setOptionsBouton(aOptions) {
		$.extend(this.optionsBouton, aOptions);
	}
	getOptionsBouton() {
		return this.optionsBouton;
	}
	actualiser(aParam) {
		if (!!aParam) {
			this.setOptionsBouton(aParam);
		}
		this.afficher();
	}
	construireAffichage() {
		return (
			this.validerListeBouton() &&
			IE.jsx.str(
				"div",
				{
					class: [
						"floating-btn-position",
						this.getClassPosition(),
						this.optionsBouton.fluide,
						this.optionsBouton.retractable && "togglable",
					],
				},
				IE.jsx.str(
					"div",
					{ class: "float-global-conteneur" },
					this.composeBoutons(),
				),
			)
		);
	}
	composeUnSeulBouton(aBouton) {
		if (this.validerParametreBouton(aBouton)) {
			const aIdBtn = GUID_1.GUID.getId();
			let lAvecBtn;
			if (
				aBouton === null || aBouton === void 0
					? void 0
					: aBouton.avecPresenceBoutonDynamique
			) {
				lAvecBtn = () => aBouton.avecPresenceBoutonDynamique();
			}
			const lNodeBtn = (aNode) => {
				$(aNode).eventValidation(aBouton.callback);
			};
			return IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str("input", {
					"ie-if": lAvecBtn,
					type: "checkbox",
					id: aIdBtn,
					class: "on-off",
				}),
				IE.jsx.str(
					"label",
					{
						"ie-if": lAvecBtn,
						for: aIdBtn,
						"ie-node": lNodeBtn,
						class: [
							"btn-float",
							aBouton.primaire && "primary",
							aBouton.disabled && "disabled",
						],
						"aria-label": aBouton.ariaLabel,
					},
					IE.jsx.str("i", {
						class: ["icon", aBouton.icone],
						role: "presentation",
					}),
				),
			);
		}
	}
	composeBoutonCommande(aListeBouton) {
		let lIdBtn = GUID_1.GUID.getId();
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str("input", { type: "checkbox", id: lIdBtn, class: "on-off" }),
			IE.jsx.str(
				"label",
				{
					for: lIdBtn,
					class: [
						"as-button primary command",
						aListeBouton.disabled && "disabled",
						this.optionsBouton.fluide,
					],
					"aria-label":
						ObjetTraduction_1.GTraductions.getValeur("liste.BtnAction"),
				},
				IE.jsx.str("i", {
					class: ["icon", aListeBouton.icone || this.iconeCommandeDefaut],
					role: "presentation",
				}),
			),
			IE.jsx.str(
				"ul",
				{ class: "sub-float-menu" },
				aListeBouton.boutons.map((aBouton, aIndex) => {
					const lNodeBtn = aBouton.callback
						? (aNode) => {
								if (!!aBouton) {
									$(aNode).eventValidation(aBouton.callback);
								}
							}
						: null;
					return (
						this.validerParametreBouton(aBouton) &&
						IE.jsx.str(
							"li",
							{ class: [aBouton.disabled && "disabled"], "ie-node": lNodeBtn },
							aBouton && IE.jsx.str("label", null, " ", aBouton.libelle, " "),
							IE.jsx.str("i", { class: ["icon", aBouton.icone] }),
						)
					);
				}),
			),
		);
	}
	composeBoutons() {
		const H = [];
		const lInstance = this;
		this.optionsBouton.listeBoutons.forEach((aBouton, aIndex) => {
			if (!!aBouton.boutons && aBouton.boutons.length > 0) {
				H.push(lInstance.composeBoutonCommande(aBouton));
			} else {
				H.push(lInstance.composeUnSeulBouton(aBouton));
			}
		});
		return H.join(" ");
	}
	validerListeBouton() {
		if (this.optionsBouton.listeBoutons.length === 0) {
			return false;
		} else if (
			!!this.optionsBouton.listeBoutons &&
			!Array.isArray(this.optionsBouton.listeBoutons)
		) {
			return false;
		}
		return true;
	}
	getClassPosition() {
		const H = [];
		const lHorizontal =
			this.optionsBouton.position && this.optionsBouton.position.horizontal
				? this.optionsBouton.position.horizontal
				: this.positionHorizontalDefaut;
		const lVertical =
			this.optionsBouton.position && this.optionsBouton.position.vertical
				? this.optionsBouton.position.vertical
				: this.positionVerticalDefaut;
		H.push(lHorizontal ? "h-" + lHorizontal : "");
		H.push(lVertical ? "v-" + lVertical : "");
		return H.join(" ");
	}
	validerParametreBouton(lBouton) {
		if (!!lBouton.boutons && !Array.isArray(lBouton.boutons)) {
			return false;
		}
		if (!lBouton.icone) {
			return false;
		}
		return true;
	}
	initOptionsBouton() {
		this.optionsBouton = {
			fluide: "",
			retractable: false,
			position: { vertical: "bottom", horizontal: "" },
			listeBoutons: [
				{
					primaire: false,
					icone: "icon_diffuser_information",
					libelle: "",
					ariaLabel: "",
					disabled: false,
					boutons: [{ icone: "", libelle: "", ariaLabel: "", disabled: false }],
				},
			],
		};
	}
}
exports.ObjetBoutonFlottant = ObjetBoutonFlottant;
