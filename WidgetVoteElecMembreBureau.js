exports.WidgetVoteElecMembreBureau = void 0;
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetWidget_1 = require("ObjetWidget");
const ObjetRequeteSaisieURLSSOVoteElec_1 = require("ObjetRequeteSaisieURLSSOVoteElec");
const jsx_1 = require("jsx");
const TypeVoteElec_1 = require("TypeVoteElec");
const TypeVoteElec_2 = require("TypeVoteElec");
class WidgetVoteElecMembreBureau extends ObjetWidget_1.Widget.ObjetWidget {
	constructor() {
		super(...arguments);
		this.windowVoteOpEP = [];
	}
	construire(aParams) {
		this.donnees = aParams.donnees;
		const lWidget = {
			getHtml: this.composeWidgetVoteElecMembreBureau.bind(this),
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnConnexionCompte: {
				event(aNumeroOperationEP) {
					let lOperationElectorale =
						aInstance.donnees.listeOperationsEP.getElementParNumero(
							aNumeroOperationEP,
						);
					let lUrl = lOperationElectorale.urlLoginMembre;
					if (lUrl) {
						aInstance.ouvrirUrlDansWindowVoteDOpEP(aNumeroOperationEP, lUrl);
					}
				},
			},
			btnCreerCompte: {
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
				genreSso: TypeVoteElec_2.TypeGenrePourSSo.GSSO_MembreBureau,
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
			IE.jsx.str(
				"div",
				null,
				IE.jsx.str("p", { class: "libelle" }, aElection.getLibelle() + ": "),
				IE.jsx.str(
					"p",
					{
						class: [
							"contenu ",
							aElection.avecPassPhrase
								? "color-green-foncee"
								: "color-red-foncee",
						],
					},
					aElection.avecPassPhrase
						? ObjetTraduction_1.GTraductions.getValeur(
								"WidgetVoteElecMembreBureau.secretCree",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"WidgetVoteElecMembreBureau.secretACreer",
								[ObjetDate_1.GDate.formatDate(aElection.dateDebCle, "%JJ/%MM")],
							),
				),
			),
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
				return ObjetTraduction_1.GTraductions.getValeur(
					"WidgetVoteElecMembreBureau.ouvertureOpElecLe",
					[
						ObjetDate_1.GDate.formatDate(aOperationEP.dateDeb, "%JJ/%MM"),
						ObjetDate_1.GDate.formatDate(aOperationEP.dateDeb, "%hh%sh%mm"),
					],
				);
			case TypeVoteElec_1.TypeEtatElectionP.EEP_ScrutinEnCours:
				return ObjetTraduction_1.GTraductions.getValeur(
					"WidgetVoteElecMembreBureau.opElecEnCoursJusquAu",
					[
						ObjetDate_1.GDate.formatDate(aOperationEP.dateFin, "%JJ/%MM"),
						ObjetDate_1.GDate.formatDate(aOperationEP.dateFin, "%hh%sh%mm"),
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
	classEtatScrutin(aOperationEP) {
		switch (this.getEtatScrutin(aOperationEP)) {
			case TypeVoteElec_1.TypeEtatElectionP.EEP_AvantScrutin:
			case TypeVoteElec_1.TypeEtatElectionP.EEP_PreteScellementAvantScrutin:
			case TypeVoteElec_1.TypeEtatElectionP.EEP_ScelleeAvantScrutin:
				return "";
			case TypeVoteElec_1.TypeEtatElectionP.EEP_ScrutinEnCours:
				return "color-green-foncee";
			case TypeVoteElec_1.TypeEtatElectionP.EEP_ScrutinTermine:
			case TypeVoteElec_1.TypeEtatElectionP.EEP_ScrutinScelle:
				return "color-green-foncee";
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
	composeHtmlOpElec(aOperationEP) {
		const lListeElections = [];
		aOperationEP.listeElections.parcourir((D) => {
			lListeElections.push("<li>" + this.composeHtmlElection(D) + "</li>");
		});
		return IE.jsx.str(
			"div",
			{
				role: "group",
				"aria-label": aOperationEP.getLibelle().toAttrValue(),
				class: "content-conteneur",
			},
			IE.jsx.str("h3", null, aOperationEP.getLibelle()),
			IE.jsx.str(
				"p",
				{ class: ["ie-sous-titre", "" + this.classEtatScrutin(aOperationEP)] },
				this.strEtatScrutin(aOperationEP),
			),
			aOperationEP.avecCompte
				? ""
				: IE.jsx.str(
						"p",
						{ class: "color-red-foncee" },
						ObjetTraduction_1.GTraductions.getValeur(
							"WidgetVoteElecMembreBureau.creerCompte",
						),
					),
			lListeElections.length > 0
				? IE.jsx.str("ul", null, lListeElections.join(""))
				: "",
			aOperationEP.estTest
				? IE.jsx.str(
						"ie-chips",
						{
							class:
								"m-bottom tag-style self-start iconic icon_warning_sign alert",
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"WidgetVoteElecMembreBureau.operationTest",
						),
					)
				: "",
			aOperationEP.avecCompte
				? IE.jsx.str(
						"ie-bouton",
						{
							role: "link",
							class: "self-end",
							"ie-model": (0, jsx_1.jsxFuncAttr)(
								"btnConnexionCompte",
								aOperationEP.getNumero(),
							),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"WidgetVoteElecMembreBureau.labelBtnAccederCompte",
						),
					)
				: IE.jsx.str(
						"ie-bouton",
						{
							role: "link",
							class: "self-end",
							"ie-model": (0, jsx_1.jsxFuncAttr)(
								"btnCreerCompte",
								aOperationEP.getNumero(),
							),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"WidgetVoteElecMembreBureau.labelBtnCreerCompte",
						),
					),
		);
	}
	composeWidgetVoteElecMembreBureau() {
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
						this.composeHtmlOpElec(D),
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
exports.WidgetVoteElecMembreBureau = WidgetVoteElecMembreBureau;
