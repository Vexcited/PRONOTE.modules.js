exports.WidgetVoteElecElecteur = void 0;
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetWidget_1 = require("ObjetWidget");
const ObjetRequeteSaisieURLSSOVoteElec_1 = require("ObjetRequeteSaisieURLSSOVoteElec");
const jsx_1 = require("jsx");
const TypeVoteElec_1 = require("TypeVoteElec");
const TypeVoteElec_2 = require("TypeVoteElec");
class WidgetVoteElecElecteur extends ObjetWidget_1.Widget.ObjetWidget {
	constructor() {
		super(...arguments);
		this.windowVoteOpEP = [];
	}
	construire(aParams) {
		this.donnees = aParams.donnees;
		const lWidget = { getHtml: this.composeWidgetVoteElecElecteur.bind(this) };
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnAccesEspaceElecteur: {
				event(aNumeroOperationEP) {
					aInstance.ouvrirURLSSO(aNumeroOperationEP);
				},
			},
		});
	}
	ouvrirPatience(aNumOpEP) {
		try {
			if (!GApplication.estAppliMobile) {
				this.windowVoteOpEP[aNumOpEP] = window.open(
					"message.html?G=patiencePartenaire",
					this.defaultTarget,
				);
			}
		} catch (e) {
			this.windowVoteOpEP[aNumOpEP] = null;
		}
	}
	ouvrirUrlDansWindowVoteDOpEP(aNumOpEP, aUrl) {
		let lWindow = this.windowVoteOpEP[aNumOpEP];
		if (lWindow && !lWindow.closed) {
			lWindow.location.replace(aUrl);
			lWindow.focus();
		} else {
			this.windowVoteOpEP[aNumOpEP] = window.open(aUrl, this.defaultTarget);
		}
	}
	async ouvrirURLSSO(aNumeroOperationEP) {
		this.ouvrirPatience(aNumeroOperationEP);
		const lReponse =
			await new ObjetRequeteSaisieURLSSOVoteElec_1.ObjetRequeteSaisieURLSSOVoteElec(
				this,
			).lancerRequete({
				operationEP:
					this.donnees.listeOperationsEP.getElementParNumero(
						aNumeroOperationEP,
					),
				genreSso: TypeVoteElec_2.TypeGenrePourSSo.GSSO_Electeur,
			});
		if (lReponse.JSONRapportSaisie && lReponse.JSONRapportSaisie.urlSSO) {
			this.ouvrirUrlDansWindowVoteDOpEP(
				aNumeroOperationEP,
				lReponse.JSONRapportSaisie.urlSSO,
			);
		}
	}
	composeHtmlElection(aElection) {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str("p", { class: "libelle" }, aElection.getLibelle()),
		);
	}
	getEtatScrutin(aOperationEP) {
		if (aOperationEP.listeElections.count() > 0) {
			let lElection = aOperationEP.listeElections.get(0);
			return lElection.etatElectionP;
		} else {
			return TypeVoteElec_1.TypeEtatElectionP.EEP_AvantScrutin;
		}
	}
	strEtatScrutin(aOperationEP) {
		switch (this.getEtatScrutin(aOperationEP)) {
			case TypeVoteElec_1.TypeEtatElectionP.EEP_AvantScrutin:
			case TypeVoteElec_1.TypeEtatElectionP.EEP_PreteScellementAvantScrutin:
			case TypeVoteElec_1.TypeEtatElectionP.EEP_ScelleeAvantScrutin:
				return ObjetDate_1.GDate.estJourEgal(
					aOperationEP.dateDebScrutin,
					aOperationEP.dateFinScrutin,
				)
					? ObjetTraduction_1.GTraductions.getValeur(
							"WidgetVoteElecElecteur.invitElecteur1j",
							[
								ObjetDate_1.GDate.formatDate(
									aOperationEP.dateDebScrutin,
									"%JJ/%MM",
								),
								ObjetDate_1.GDate.formatDate(
									aOperationEP.dateDebScrutin,
									"%hh%sh%mm",
								),
								ObjetDate_1.GDate.formatDate(
									aOperationEP.dateFinScrutin,
									"%hh%sh%mm",
								),
							],
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"WidgetVoteElecElecteur.invitElecteurNj",
							[
								ObjetDate_1.GDate.formatDate(
									aOperationEP.dateDebScrutin,
									"%JJ/%MM",
								),
								ObjetDate_1.GDate.formatDate(
									aOperationEP.dateDebScrutin,
									"%hh%sh%mm",
								),
								ObjetDate_1.GDate.formatDate(
									aOperationEP.dateFinScrutin,
									"%JJ/%MM",
								),
								ObjetDate_1.GDate.formatDate(
									aOperationEP.dateFinScrutin,
									"%hh%sh%mm",
								),
							],
						);
			case TypeVoteElec_1.TypeEtatElectionP.EEP_ScrutinEnCours:
				return ObjetTraduction_1.GTraductions.getValeur(
					"WidgetVoteElecElecteur.infoElecteurEnCours",
					[
						ObjetDate_1.GDate.formatDate(
							aOperationEP.dateFinScrutin,
							"%JJ/%MM",
						),
						ObjetDate_1.GDate.formatDate(
							aOperationEP.dateFinScrutin,
							"%hh%sh%mm",
						),
					],
				);
			case TypeVoteElec_1.TypeEtatElectionP.EEP_ScrutinTermine:
			case TypeVoteElec_1.TypeEtatElectionP.EEP_ScrutinScelle:
				return ObjetTraduction_1.GTraductions.getValeur(
					"WidgetVoteElecMembreBureau.opElecTerminee",
				);
			default:
				return "";
		}
	}
	iconeEtatScrutin(aOperationEP) {
		switch (this.getEtatScrutin(aOperationEP)) {
			case TypeVoteElec_1.TypeEtatElectionP.EEP_AvantScrutin:
			case TypeVoteElec_1.TypeEtatElectionP.EEP_PreteScellementAvantScrutin:
			case TypeVoteElec_1.TypeEtatElectionP.EEP_ScelleeAvantScrutin:
				return "avant-scrutin";
			case TypeVoteElec_1.TypeEtatElectionP.EEP_ScrutinEnCours:
				return "pendant-scrutin";
			case TypeVoteElec_1.TypeEtatElectionP.EEP_ScrutinTermine:
			case TypeVoteElec_1.TypeEtatElectionP.EEP_ScrutinScelle:
				return "termine-scrutin";
			default:
				return "";
		}
	}
	composeHtmlOperationEP(aOperationEP) {
		const lListeElections = [];
		aOperationEP.listeElections.parcourir((D) => {
			lListeElections.push("<li>" + this.composeHtmlElection(D) + "</li>");
		});
		let lAvecOTPEtScelle =
			aOperationEP.avecOTP &&
			[TypeVoteElec_1.TypeEtatElectionP.EEP_ScelleeAvantScrutin].includes(
				this.getEtatScrutin(aOperationEP),
			);
		return IE.jsx.str(
			"div",
			{
				role: "group",
				"aria-label": aOperationEP.getLibelle().toAttrValue(),
				class: "content-conteneur",
			},
			IE.jsx.str(
				"p",
				{ class: "first-capitalize" },
				this.strEtatScrutin(aOperationEP),
			),
			lListeElections.length > 0
				? IE.jsx.str("ul", null, lListeElections.join(""))
				: "",
			aOperationEP.avecOTP &&
				[
					TypeVoteElec_1.TypeEtatElectionP.EEP_AvantScrutin,
					TypeVoteElec_1.TypeEtatElectionP.EEP_PreteScellementAvantScrutin,
					TypeVoteElec_1.TypeEtatElectionP.EEP_ScelleeAvantScrutin,
				].includes(this.getEtatScrutin(aOperationEP))
				? IE.jsx.str(
						"div",
						{ class: "flex-contain cols p-bottom-l" },
						IE.jsx.str(
							"p",
							{ class: "color-red-foncee", style: "text-wrap:wrap;" },
							lAvecOTPEtScelle
								? ObjetTraduction_1.GTraductions.getValeur(
										"WidgetVoteElecElecteur.infosCoordOTPCtxScellee",
									)
								: ObjetTraduction_1.GTraductions.getValeur(
										"WidgetVoteElecElecteur.infosCoordOTP",
									),
						),
						aOperationEP.strTel
							? IE.jsx.str(
									"p",
									null,
									ObjetTraduction_1.GTraductions.getValeur(
										"WidgetVoteElecElecteur.telephone",
									) +
										" : " +
										aOperationEP.strTel,
								)
							: "",
						aOperationEP.strEmail
							? IE.jsx.str(
									"p",
									null,
									ObjetTraduction_1.GTraductions.getValeur(
										"WidgetVoteElecElecteur.email",
									) +
										" : " +
										aOperationEP.strEmail,
								)
							: "",
						lAvecOTPEtScelle
							? ""
							: IE.jsx.str(
									"p",
									{ class: "italic taille-s", style: "text-wrap:wrap;" },
									ObjetTraduction_1.GTraductions.getValeur(
										"WidgetVoteElecElecteur.infoDesynchro",
									),
								),
					)
				: "",
			IE.jsx.str(
				"ie-bouton",
				{
					role: "link",
					class: "self-end",
					"ie-model": (0, jsx_1.jsxFuncAttr)(
						"btnAccesEspaceElecteur",
						aOperationEP.getNumero(),
					),
				},
				ObjetTraduction_1.GTraductions.getValeur(
					"WidgetVoteElecElecteur.accesEspaceElecteur",
				),
			),
		);
	}
	composeWidgetVoteElecElecteur() {
		const H = [];
		const lDonneesWidget = this.donnees;
		if (
			lDonneesWidget &&
			lDonneesWidget.listeOperationsEP &&
			lDonneesWidget.listeOperationsEP.count() > 0
		) {
			const lListeLi = [];
			lDonneesWidget.listeOperationsEP.parcourir((D) => {
				lListeLi.push(
					IE.jsx.str(
						"li",
						{ class: [this.iconeEtatScrutin(D)] },
						this.composeHtmlOperationEP(D),
					),
				);
			});
			if (lListeLi.length > 0) {
				H.push(
					IE.jsx.str("ul", { class: "liste-avec-icone" }, lListeLi.join("")),
				);
			}
		}
		return H.join("");
	}
}
exports.WidgetVoteElecElecteur = WidgetVoteElecElecteur;
