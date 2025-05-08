exports.GenerationPDF = void 0;
const ObjetRequeteGenerationPDF_1 = require("ObjetRequeteGenerationPDF");
const Invocateur_1 = require("Invocateur");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_MessageHtml_1 = require("Enumere_MessageHtml");
const UtilitaireOAuth2_1 = require("UtilitaireOAuth2");
const MethodesObjet_1 = require("MethodesObjet");
const GenerationPDF = {
	genererPDF(aParam) {
		if (aParam.cloudCible) {
			return new ObjetRequeteGenerationPDF_1.ObjetRequeteGenerationPDF()
				.lancerRequete(aParam.paramPDF, aParam.optionsPDF, aParam.cloudCible)
				.then(
					(aJSON) => {
						if (aJSON && aJSON.message) {
							return GApplication.getMessage().afficher({
								message: aJSON.message,
							});
						}
					},
					(aJSON) => {
						return _surEchecRequetePDFVersCloud(aParam, aJSON);
					},
				);
		}
		const lAvecProblemeOuvertureWindow = !!(
			GNavigateur.isAndroid || GApplication.estAppliMobile
		);
		let lWindowPDF = null;
		if (!lAvecProblemeOuvertureWindow && !aParam.cloudCible) {
			lWindowPDF = window.open(
				Enumere_MessageHtml_1.EGenreMessageHtmlUtil.construireUrl(
					Enumere_MessageHtml_1.EGenreMessageHtml.patiencePDF,
				),
			);
		}
		return new ObjetRequeteGenerationPDF_1.ObjetRequeteGenerationPDF()
			.lancerRequete(aParam.paramPDF, aParam.optionsPDF)
			.then(
				(aJSON) => {
					return _actionSurRequeteGenerationPDF(
						lAvecProblemeOuvertureWindow,
						lWindowPDF,
						aJSON,
					);
				},
				() => {
					if (lWindowPDF && lWindowPDF.close) {
						lWindowPDF.close();
					}
				},
			);
	},
};
exports.GenerationPDF = GenerationPDF;
function _actionSurRequeteGenerationPDF(
	aAvecProblemeOuvertureWindow,
	aWindowPDF,
	aJSON,
) {
	if (!!aJSON.message) {
		if (aWindowPDF && aWindowPDF.close) {
			aWindowPDF.close();
		}
		return GApplication.getMessage()
			.afficher({ message: aJSON.message })
			.then(() => {});
	}
	if (!aJSON.url) {
		if (aWindowPDF && aWindowPDF.close) {
			aWindowPDF.close();
		}
		return GApplication.getMessage()
			.afficher({
				message: ObjetTraduction_1.GTraductions.getValeur("requete.erreur"),
			})
			.then(() => {});
	}
	const lUrl = ObjetChaine_1.GChaine.encoderUrl(aJSON.url);
	if (!aAvecProblemeOuvertureWindow) {
		if (aWindowPDF && aWindowPDF.location) {
			let lTimeout = null;
			aWindowPDF.onbeforeunload = function () {
				clearTimeout(lTimeout);
			};
			lTimeout = setTimeout(() => {
				if (aWindowPDF.closed) {
					return;
				}
				if (
					!aWindowPDF.location.href ||
					!aWindowPDF.location.href.endsWith ||
					!aWindowPDF.location.href.endsWith(lUrl)
				) {
					if (aWindowPDF.close) {
						aWindowPDF.close();
					}
					Invocateur_1.Invocateur.evenement("OuvrirFenetreLienPDF", lUrl);
				}
			}, 2000);
			aWindowPDF.location.href = lUrl;
		} else {
			window.open(lUrl);
		}
	} else {
		Invocateur_1.Invocateur.evenement("OuvrirFenetreLienPDF", lUrl);
	}
}
function _surEchecRequetePDFVersCloud(aParamAppel, aJSON) {
	if (!(aJSON && aJSON.idOAuth2)) {
		let lMessage = !!aJSON
			? aJSON.message
				? aJSON.message
				: aJSON
			: ObjetTraduction_1.GTraductions.getValeur("requete.erreurGenerationPDF");
		if (
			MethodesObjet_1.MethodesObjet.isString(lMessage) &&
			lMessage.length > 0
		) {
			return GApplication.getMessage().afficher({ message: lMessage });
		}
		return;
	}
	return UtilitaireOAuth2_1.UtilitaireOAuth2.authentificationPromise(
		aJSON.idOAuth2,
	).then(
		() => {
			let lListe = GEtatUtilisateur.listeCloud;
			let lCloud = lListe.getElementParGenre(aJSON.service);
			if (!!lCloud) {
				lCloud.idOAuth2 = aJSON.idOAuth2;
			}
			lListe = GEtatUtilisateur.listeCloudDepotServeur;
			lCloud = lListe.getElementParGenre(aJSON.service);
			if (!!lCloud) {
				lCloud.idOAuth2 = aJSON.idOAuth2;
			}
			return GenerationPDF.genererPDF(aParamAppel);
		},
		() => {},
	);
}
