exports.ObjetFenetre_ParametrageSaml = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_ParametrageSaml extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"pageParametrageCAS.titreFenetreParametresCAS",
			),
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		this.optionsFenetreParametrageSaml = {
			largeurLibelle: 120,
			largeurInput: 500,
			heightZone: 20,
		};
	}
	setOptionsFenetresParametragSaml(aOptions) {
		Object.assign(this.optionsFenetreParametrageSaml, aOptions);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			inputGenre: {
				getValue() {
					return aInstance.getInfosParGenre().libelle;
				},
				setValue() {},
				getDisabled() {
					return false;
				},
			},
			getTitleInputGenre() {
				return aInstance.getInfosParGenre().uri;
			},
			btnGenre: {
				event() {
					aInstance.ouvrirFenetreRevendications();
				},
				getDisabled() {
					return false;
				},
			},
		});
	}
	composeContenu() {
		const H = [];
		H.push('<div class="Espace">', this.composeRevendication(), "</div>");
		return H.join("");
	}
	setDonnees(aParametresSaml) {
		this.parametresSaml =
			MethodesObjet_1.MethodesObjet.dupliquer(aParametresSaml);
		this.listeRevendications = new ObjetListeElements_1.ObjetListeElements();
		if (this.parametresSaml && this.parametresSaml.revendicationsDisponibles) {
			this.parametresSaml.revendicationsDisponibles.forEach(
				(aElement, aIndex) => {
					if (aElement) {
						const lElement = new ObjetElement_1.ObjetElement(
							aElement.description,
							aIndex,
						);
						lElement.uri = aElement.uri;
						this.listeRevendications.addElement(lElement);
					}
				},
			);
		}
		this.$refreshSelf();
		this.afficher();
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		this.callback.appel(
			aNumeroBouton,
			aNumeroBouton === 1 ? this.parametresSaml : null,
		);
	}
	modifierRevendication(aRevendication) {
		this.parametresSaml.identifiantUnique = aRevendication.uri;
	}
	ouvrirFenetreRevendications() {
		let lListeReference = new ObjetListeElements_1.ObjetListeElements().add(
			this.listeRevendications,
		);
		const lAucun = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur("wsfed.NePasLireCetAttribut"),
			-1,
		);
		lAucun.uri = "";
		lAucun.aucun = true;
		lListeReference.insererElement(lAucun, 0);
		const lThis = this;
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			{
				pere: this,
				evenement: function (aNumeroBouton, aIndiceSelection) {
					if (aNumeroBouton === 1) {
						lThis.modifierRevendication(lListeReference.get(aIndiceSelection));
					}
				},
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: ObjetChaine_1.GChaine.format(
							ObjetTraduction_1.GTraductions.getValeur(
								"wsfed.ChoixRevedication_S",
							),
							[lThis.getLibelleRevendicationDeGenre()],
						),
						largeur: 500,
						hauteur: 600,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
						modeActivationBtnValider:
							aInstance.modeActivationBtnValider.toujoursActifs,
					});
					aInstance.paramsListe = {
						optionsListe: { colonnes: [{ taille: "100%" }], nonEditable: true },
					};
				},
			},
		);
		const lDonneesListe = new ObjetDonneesListe_1.ObjetDonneesListe(
			lListeReference,
		);
		lDonneesListe.getTooltip = function (aParams) {
			return aParams.article.uri;
		};
		lDonneesListe.setOptions({
			avecTri: false,
			avecEvnt_Selection: true,
			avecEvnt_SelectionDblClick: true,
		});
		let lInfo = this.getInfosParGenre();
		let lIndiceSelection = null;
		if (lInfo.trouve) {
			lListeReference.parcourir((D, aIndex) => {
				if (lInfo.uri === D.uri) {
					lIndiceSelection = aIndex;
					return false;
				}
			});
		} else {
			lIndiceSelection = 0;
		}
		lFenetre.setDonnees(lDonneesListe, false, lIndiceSelection);
	}
	getInfosParGenre() {
		const lResult = {
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"wsfed.NePasLireCetAttribut",
			),
			uri: "",
			trouve: false,
		};
		if (
			this.parametresSaml &&
			this.parametresSaml.identifiantUnique &&
			this.parametresSaml.revendicationsDisponibles
		) {
			for (const lRevendication of this.parametresSaml
				.revendicationsDisponibles) {
				if (lRevendication.uri === this.parametresSaml.identifiantUnique) {
					lResult.libelle = lRevendication.description;
					lResult.uri = lRevendication.uri;
					lResult.trouve = true;
					break;
				}
			}
		}
		return lResult;
	}
	getLibelleRevendicationDeGenre() {
		return ObjetTraduction_1.GTraductions.getValeur("wsfed.IdentifiantUnique");
	}
	composeRevendication() {
		const H = [];
		H.push(
			'<div class="NoWrap">',
			'<div class="InlineBlock AlignementMilieuVertical" style="',
			ObjetStyle_1.GStyle.composeWidth(
				this.optionsFenetreParametrageSaml.largeurLibelle,
			),
			'">',
			this.getLibelleRevendicationDeGenre(),
			"</div>",
			'<div class="InlineBlock AlignementMilieuVertical EspaceGauche">',
			'<input type="text" ',
			ObjetHtml_1.GHtml.composeAttr("ie-model", "inputGenre"),
			" readonly ",
			ObjetHtml_1.GHtml.composeAttr("ie-title", "getTitleInputGenre"),
			' style="',
			ObjetStyle_1.GStyle.composeHeight(
				this.optionsFenetreParametrageSaml.heightZone,
			),
			ObjetStyle_1.GStyle.composeWidth(
				this.optionsFenetreParametrageSaml.largeurInput,
			),
			ObjetStyle_1.GStyle.composeCouleurBordure(
				(0, AccessApp_1.getApp)().getCouleur().noir,
			),
			'" />',
			"</div>",
			'<div class="InlineBlock AlignementMilieuVertical EspaceGauche">',
			"<ie-bouton ",
			ObjetHtml_1.GHtml.composeAttr("ie-model", "btnGenre"),
			">...</ie-bouton>",
			"</div>",
			"</div>",
		);
		return H.join("");
	}
}
exports.ObjetFenetre_ParametrageSaml = ObjetFenetre_ParametrageSaml;
