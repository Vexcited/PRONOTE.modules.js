exports.DonneesListe_ListeDelegationAuthentification = void 0;
const WSGestionDelegationsAuthentification_1 = require("WSGestionDelegationsAuthentification");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetTri_1 = require("ObjetTri");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetTraduction_1 = require("ObjetTraduction");
const jsx_1 = require("jsx");
function _construireListeDeleg(aTabDeleg, aAvecEduConnect) {
	const lListe = new ObjetListeElements_1.ObjetListeElements();
	const lCumulCAS = new ObjetElement_1.ObjetElement(
		ObjetTraduction_1.GTraductions.getValeur(
			"pageParametresDeleguerLAuthentification.Protocole_S",
			[
				ObjetTraduction_1.GTraductions.getValeur(
					"pageParametresDeleguerLAuthentification.liste.CAS",
				),
			],
		),
		WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW
			.DA_Cas,
	);
	lCumulCAS.estDeploye = true;
	lCumulCAS.estUnDeploiement = true;
	lListe.add(lCumulCAS);
	const lCumulWsFed = new ObjetElement_1.ObjetElement(
		ObjetTraduction_1.GTraductions.getValeur(
			"pageParametresDeleguerLAuthentification.Protocole_S",
			[
				ObjetTraduction_1.GTraductions.getValeur(
					"pageParametresDeleguerLAuthentification.liste.WsFed",
				),
			],
		),
		WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW
			.DA_WsFed,
	);
	lCumulWsFed.estDeploye = true;
	lCumulWsFed.estUnDeploiement = true;
	lListe.add(lCumulWsFed);
	let lCumulEDU;
	if (aAvecEduConnect) {
		lCumulEDU = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur(
				"pageParametresDeleguerLAuthentification.Protocole_S",
				[
					ObjetTraduction_1.GTraductions.getValeur(
						"pageParametresDeleguerLAuthentification.liste.EduConnect",
					),
				],
			),
			WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW
				.DA_EduConnect,
		);
		lCumulEDU.estDeploye = true;
		lCumulEDU.estUnDeploiement = true;
		lListe.add(lCumulEDU);
	}
	const lCumulSaml = new ObjetElement_1.ObjetElement(
		ObjetTraduction_1.GTraductions.getValeur(
			"pageParametresDeleguerLAuthentification.Protocole_S",
			[
				ObjetTraduction_1.GTraductions.getValeur(
					"pageParametresDeleguerLAuthentification.liste.SAML",
				),
			],
		),
		WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW
			.DA_Saml,
	);
	lCumulSaml.estDeploye = true;
	lCumulSaml.estUnDeploiement = true;
	lListe.add(lCumulSaml);
	aTabDeleg.forEach((aDescriptionDelegation) => {
		let lElement;
		switch (aDescriptionDelegation.protocole) {
			case WSGestionDelegationsAuthentification_1
				.ETypeDelegationAuthentificationSvcW.DA_Cas:
				lCumulCAS.definitionDelegation = aDescriptionDelegation;
				break;
			case WSGestionDelegationsAuthentification_1
				.ETypeDelegationAuthentificationSvcW.DA_WsFed:
				lCumulWsFed.definitionDelegation = aDescriptionDelegation;
				break;
			case WSGestionDelegationsAuthentification_1
				.ETypeDelegationAuthentificationSvcW.DA_EduConnect:
				if (lCumulEDU) {
					lCumulEDU.definitionDelegation = aDescriptionDelegation;
				}
				break;
			case WSGestionDelegationsAuthentification_1
				.ETypeDelegationAuthentificationSvcW.DA_Saml:
				lCumulSaml.definitionDelegation = aDescriptionDelegation;
				break;
			default:
		}
		if (aDescriptionDelegation.parametres) {
			aDescriptionDelegation.parametres.forEach((aParametreDelegation) => {
				if (
					aDescriptionDelegation.protocole !==
						WSGestionDelegationsAuthentification_1
							.ETypeDelegationAuthentificationSvcW.DA_EduConnect ||
					aAvecEduConnect
				) {
					lElement = new ObjetElement_1.ObjetElement(
						aParametreDelegation.nom,
						aDescriptionDelegation.protocole,
						aParametreDelegation.idParametres,
					);
					lElement.val = aParametreDelegation;
					lElement.protocole = aDescriptionDelegation.protocole;
					lListe.add(lElement);
					switch (aDescriptionDelegation.protocole) {
						case WSGestionDelegationsAuthentification_1
							.ETypeDelegationAuthentificationSvcW.DA_Cas:
							lElement.pere = lCumulCAS;
							break;
						case WSGestionDelegationsAuthentification_1
							.ETypeDelegationAuthentificationSvcW.DA_WsFed:
							lElement.pere = lCumulWsFed;
							break;
						case WSGestionDelegationsAuthentification_1
							.ETypeDelegationAuthentificationSvcW.DA_EduConnect:
							lElement.pere = lCumulEDU;
							break;
						case WSGestionDelegationsAuthentification_1
							.ETypeDelegationAuthentificationSvcW.DA_Saml:
							lElement.pere = lCumulSaml;
							break;
					}
				}
			});
		}
	});
	return lListe;
}
class DonneesListe_ListeDelegationAuthentification extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aDonneesSupplementaires) {
		super(
			_construireListeDeleg(aDonnees, aDonneesSupplementaires.avecEduConnect),
		);
		this.setOptions({
			avecDeploiement: true,
			avecImageSurColonneDeploiement: true,
			avecEvnt_Suppression: true,
			avecInterruptionSuppression: true,
			avecEvnt_ApresEdition: true,
		});
		this.donneesSupplementaires = aDonneesSupplementaires;
	}
	getControleur(aDonneesListe, aListe) {
		return $.extend(true, super.getControleur(aDonneesListe, aListe), {
			btnCreation: {
				event(aDelegation) {
					aDonneesListe.donneesSupplementaires.callbackCreation(aDelegation);
				},
				node() {
					$(this.node).on("mousedown", (aEvent) => {
						aEvent.stopPropagation();
					});
				},
			},
			btnParam: {
				event(aIdParametres) {
					let lArticle = null;
					aDonneesListe.Donnees.parcourir((aArticle) => {
						if (aArticle.val && aArticle.val.idParametres === aIdParametres) {
							lArticle = aArticle;
							return false;
						}
					});
					if (lArticle) {
						aDonneesListe.donneesSupplementaires.callbackModification(lArticle);
					}
				},
			},
		});
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeDelegationAuthentification.colonnes.actif:
				return aParams.article.val.Actif;
			case DonneesListe_ListeDelegationAuthentification.colonnes.nom: {
				let lTitle;
				switch (aParams.article.getNumero()) {
					case WSGestionDelegationsAuthentification_1
						.ETypeDelegationAuthentificationSvcW.DA_Cas:
						lTitle = ObjetTraduction_1.GTraductions.getValeur(
							"pageParametresDeleguerLAuthentification.activerCAS",
						);
						break;
					case WSGestionDelegationsAuthentification_1
						.ETypeDelegationAuthentificationSvcW.DA_WsFed:
						lTitle = ObjetTraduction_1.GTraductions.getValeur(
							"pageParametresDeleguerLAuthentification.activerWsFed",
						);
						break;
					case WSGestionDelegationsAuthentification_1
						.ETypeDelegationAuthentificationSvcW.DA_Saml:
						lTitle = ObjetTraduction_1.GTraductions.getValeur(
							"pageParametresDeleguerLAuthentification.activerSaml",
						);
						break;
					default:
						lTitle = ObjetTraduction_1.GTraductions.getValeur(
							"pageParametresDeleguerLAuthentification.activerWsFed",
						);
						break;
				}
				if (!!aParams.article.definitionDelegation) {
					const lAvecMulti =
						aParams.article.definitionDelegation.multiInstanceAutorise ||
						aParams.article.definitionDelegation.parametres.length === 0;
					let lBtnCreation = "";
					if (lAvecMulti) {
						lBtnCreation =
							"<ie-btnimage " +
							ObjetHtml_1.GHtml.composeAttr(
								"ie-model",
								"btnCreation",
								aParams.article.getNumero(),
							) +
							ObjetHtml_1.GHtml.composeAttr("title", lTitle) +
							' class="icon_plus btnImageIcon" style="flex: none; margin-right: 0.5rem; margin-left: 0.5rem; font-size: 1.4rem;"></ie-btnimage>';
					}
					return [
						'<div style="display:flex; align-items: center;">',
						lBtnCreation,
						'<div style="flex: 1 1 auto;" ie-ellipsis>',
						aParams.article.getLibelle(),
						"</div>",
						"</div>",
					].join("");
				}
				if (aParams.article.val) {
					return IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str(
							"div",
							{ style: "display:flex; align-items: center;" },
							IE.jsx.str(
								"div",
								{ style: "flex: 1 1 auto;", "ie-ellipsis": true },
								aParams.article.getLibelle(),
							),
							IE.jsx.str("ie-btnimage", {
								"ie-model": (0, jsx_1.jsxFuncAttr)(
									"btnParam",
									aParams.article.val.idParametres,
								),
								title: lTitle,
								class: "icon_cog btnImageIcon",
								style: "flex: none; margin-left: 0.3rem; font-size: 1.5rem;",
							}),
						),
					);
				}
				return aParams.article.getLibelle();
			}
			default:
				return "";
		}
	}
	getLibelleDraggable(aParams) {
		return aParams.article.getLibelle() || "";
	}
	avecSuppression(aParams) {
		return !!(aParams.article && aParams.article.val);
	}
	getMessageSuppressionConfirmation(D) {
		const lTradExplication = ObjetTraduction_1.GTraductions.getValeur(
			"pageParametresDeleguerLAuthentification.ExplicationsDelegation",
		);
		return (
			(lTradExplication ? lTradExplication + "<br><br>" : "") +
			ObjetTraduction_1.GTraductions.getValeur(
				"pageParametresDeleguerLAuthentification.ConfirmationSuppressionParametres_S",
				[D.getLibelle()],
			)
		);
	}
	suppressionImpossible() {
		return this.donneesSupplementaires.estServeurActif;
	}
	getMessageSuppressionImpossible() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"pageParametresDeleguerLAuthentification.OperationImpossibleServeurActif",
		);
	}
	avecEdition(aParams) {
		return (
			!!aParams.article.val &&
			aParams.idColonne ===
				DonneesListe_ListeDelegationAuthentification.colonnes.actif
		);
	}
	surEdition(aParams, V) {
		if (
			aParams.idColonne ===
			DonneesListe_ListeDelegationAuthentification.colonnes.actif
		) {
			aParams.article.val.setActif(V);
		}
	}
	getMessageEditionRefusee() {
		return this.donneesSupplementaires.estServeurActif
			? ObjetTraduction_1.GTraductions.getValeur(
					"pageParametresDeleguerLAuthentification.OperationImpossibleServeurActif",
				)
			: "";
	}
	getTypeValeur(aParams) {
		return aParams.idColonne ===
			DonneesListe_ListeDelegationAuthentification.colonnes.actif
			? ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche
			: ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
	}
	getTri() {
		return [
			ObjetTri_1.ObjetTri.initRecursif("pere", [
				ObjetTri_1.ObjetTri.init("Libelle"),
			]),
		];
	}
	getCouleurCellule(aParams) {
		return aParams.article.estUnDeploiement
			? ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Deploiement
			: ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
	}
	getClass(aParams) {
		return aParams.article.estUnDeploiement ? "Gras" : "";
	}
	getColonneDeFusion(aParams) {
		return aParams.article.estUnDeploiement
			? DonneesListe_ListeDelegationAuthentification.colonnes.nom
			: aParams.idColonne;
	}
}
exports.DonneesListe_ListeDelegationAuthentification =
	DonneesListe_ListeDelegationAuthentification;
DonneesListe_ListeDelegationAuthentification.colonnes = {
	actif: "actif",
	nom: "nom",
};
