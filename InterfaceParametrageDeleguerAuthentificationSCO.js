exports.InterfaceParametrageDeleguerAuthentificationSCO = void 0;
const InterfaceParametrageDeleguerAuthentification_1 = require("InterfaceParametrageDeleguerAuthentification");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetTraduction_1 = require("ObjetTraduction");
const WSPublicationServeurHttp_1 = require("WSPublicationServeurHttp");
const WSGestionDelegationsAuthentification_1 = require("WSGestionDelegationsAuthentification");
const InterfaceParametrageCASSCO_1 = require("InterfaceParametrageCASSCO");
const InterfaceParametrageWsFedSco_1 = require("InterfaceParametrageWsFedSco");
const InterfaceParametrageEduConnect_1 = require("InterfaceParametrageEduConnect");
const InterfaceParametrageSamlSco_1 = require("InterfaceParametrageSamlSco");
class InterfaceParametrageDeleguerAuthentificationSCO extends InterfaceParametrageDeleguerAuthentification_1.InterfaceParametrageDeleguerAuthentification {
	constructor(...aParams) {
		super(...aParams);
		this.optionsAuthentification.estServeurHttp = true;
		this.recupererDonneesPage();
	}
	estConnecterAuServeur() {
		var _a, _b;
		return !!((_b =
			(_a = this.objetApplicationConsoles) === null || _a === void 0
				? void 0
				: _a.etatServeurHttp) === null || _b === void 0
			? void 0
			: _b.getConnecteAuServeur());
	}
	estServeurActif() {
		var _a, _b;
		return !!(
			((_b =
				(_a = this.objetApplicationConsoles) === null || _a === void 0
					? void 0
					: _a.etatServeurHttp) === null || _b === void 0
				? void 0
				: _b.getEtatActif()) === true
		);
	}
	construireInstances() {
		super.construireInstances();
		this.identZoneCAS = this.add(
			InterfaceParametrageCASSCO_1.InterfaceParametrageCASSCO,
		);
		this.identZoneWsFed = this.add(
			InterfaceParametrageWsFedSco_1.InterfaceParametrageWsFedSco,
		);
		this.identZoneSaml = this.add(
			InterfaceParametrageSamlSco_1.InterfaceParametrageSamlSco,
		);
		if (this.objetApplicationConsoles.avecEduConnect) {
			this.identZoneEduConnect = this.add(
				InterfaceParametrageEduConnect_1.InterfaceParametrageEduConnect,
			);
		}
	}
	getDonneesPourListe() {
		var _a;
		const lResult = new ObjetListeElements_1.ObjetListeElements();
		const lDa_Cas = this.getEspacesDeTypeDelegation(
			WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW
				.DA_Cas,
		);
		const lDa_WsFed = this.getEspacesDeTypeDelegation(
			WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW
				.DA_WsFed,
		);
		const lDa_Saml = this.getEspacesDeTypeDelegation(
			WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW
				.DA_Saml,
		);
		const lDa_EduConnect = this.getEspacesDeTypeDelegation(
			WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW
				.DA_EduConnect,
		);
		let lTabListeEspaces = [];
		if (
			(_a = this.objetApplicationConsoles) === null || _a === void 0
				? void 0
				: _a.etatServeurHttp
		) {
			lTabListeEspaces =
				this.objetApplicationConsoles.etatServeurHttp.getListeEspaces();
		}
		let lIndex = 0;
		for (const lEspaceDeListe of lTabListeEspaces) {
			if (
				lEspaceDeListe.genreTerminal ===
					WSPublicationServeurHttp_1.ETypeGenreTerminal.GT_StationTravail &&
				lEspaceDeListe.typeEspace !== "Espace_Inscription" &&
				lEspaceDeListe.typeEspace !== "Espace_PagePubliqueEtablissement"
			) {
				const lEspace = new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"pageParametresPublication." + lEspaceDeListe.identifiant,
					),
					null,
					lEspaceDeListe.ordinal,
					lIndex,
				);
				lEspace.identifiant = lEspaceDeListe.identifiant;
				lEspace.estPageCommune = lEspaceDeListe.identifiant === "Espace_Commun";
				lEspace.estEspaceIndependant = false;
				lEspace.estEspaceConformeEduConnect = false;
				if (!!this.objetApplicationConsoles.avecEduConnect) {
					const lEspacesAutorises = this.getEspacesAutorises(
						WSGestionDelegationsAuthentification_1
							.ETypeDelegationAuthentificationSvcW.DA_EduConnect,
					);
					if (lEspacesAutorises.includes(lEspaceDeListe.ordinal)) {
						lEspace.estEspaceConformeEduConnect = true;
					}
				}
				if (lDa_Cas.includes(lEspaceDeListe.ordinal)) {
					lEspace.typeDA =
						WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW.DA_Cas;
				} else if (lDa_WsFed.includes(lEspaceDeListe.ordinal)) {
					lEspace.typeDA =
						WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW.DA_WsFed;
				} else if (lDa_Saml.includes(lEspaceDeListe.ordinal)) {
					lEspace.typeDA =
						WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW.DA_Saml;
				} else if (lDa_EduConnect.includes(lEspaceDeListe.ordinal)) {
					lEspace.typeDA =
						WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW.DA_EduConnect;
				} else {
					lEspace.typeDA =
						WSGestionDelegationsAuthentification_1.ETypeDelegationAuthentificationSvcW.DA_Aucune;
				}
				lResult.add(lEspace);
				lIndex++;
			}
		}
		return lResult;
	}
}
exports.InterfaceParametrageDeleguerAuthentificationSCO =
	InterfaceParametrageDeleguerAuthentificationSCO;
