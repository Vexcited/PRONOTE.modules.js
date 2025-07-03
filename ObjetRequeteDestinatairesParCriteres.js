exports.ObjetRequeteDestinatairesParCriteres = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ChoixDestinatairesParCriteres_1 = require("ChoixDestinatairesParCriteres");
const ChoixDestinatairesParCriteres_2 = require("ChoixDestinatairesParCriteres");
class ObjetRequeteDestinatairesParCriteres extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParams) {
		const lParams = Object.assign(
			{
				genreRequete:
					ChoixDestinatairesParCriteres_1
						.TypeGenreRequeteDestinataireParCriteres.TGR_InfosCriteres,
			},
			aParams,
		);
		switch (true) {
			case ObjetRequeteDestinatairesParCriteres.isJSONParametresInfosCriteres(
				aParams,
			):
				this.JSON = lParams;
				break;
			case ObjetRequeteDestinatairesParCriteres.isJSONParametresTotalIndividus(
				lParams,
			): {
				const lJSON = {
					genreRequete: lParams.genreRequete,
					genreIndivAssocieAuCritere: lParams.genreIndivAssocieAuCritere,
					genreRessource: lParams.genreRessource,
					choix: lParams.choix,
					options: lParams.options,
				};
				switch (lParams.choix) {
					case ChoixDestinatairesParCriteres_2.TypeChoixTelechargementDoc
						.CTD_Nominatif:
						lParams.listeRessourceSelectionnee.setSerialisateurJSON({
							ignorerEtatsElements: true,
						});
						this.JSON = Object.assign(Object.assign({}, lJSON), {
							listeRessourceSelectionnee: lParams.listeRessourceSelectionnee,
						});
						break;
					case ChoixDestinatairesParCriteres_2.TypeChoixTelechargementDoc
						.CTD_Critere:
						this.JSON = Object.assign(Object.assign({}, lJSON), {
							criteres:
								ObjetRequeteDestinatairesParCriteres.getCriteresPourSerialisation(
									lParams.criteres,
								),
							genreDocumentTelechargeable: lParams.genreDocumentTelechargeable,
						});
						break;
					case ChoixDestinatairesParCriteres_2.TypeChoixTelechargementDoc
						.CTD_Tous:
						this.JSON = lJSON;
						break;
					default:
						break;
				}
				break;
			}
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lRes = Object.assign({}, this.JSONReponse);
		if (lRes.ListeRegimes) {
			lRes.listeRegimes = this.JSONReponse.ListeRegimes;
			delete lRes.ListeRegimes;
		}
		if (lRes.listeTypesProjets) {
			lRes.listeProjetsAcc = this.JSONReponse.listeTypesProjets;
			delete lRes.listeTypesProjets;
		}
		this.callbackReussite.appel(lRes);
	}
	static getCriteresPourSerialisation(aCriteres) {
		if (!aCriteres) {
			return [];
		}
		return Array.from(aCriteres).map(([aGenre, aInfos]) => {
			var _a;
			(_a = aInfos.liste) === null || _a === void 0
				? void 0
				: _a.setSerialisateurJSON({ ignorerEtatsElements: true });
			return Object.assign({ genre: aGenre }, aInfos);
		});
	}
}
exports.ObjetRequeteDestinatairesParCriteres =
	ObjetRequeteDestinatairesParCriteres;
CollectionRequetes_1.Requetes.inscrire(
	"DestinatairesParCriteres",
	ObjetRequeteDestinatairesParCriteres,
);
(function (ObjetRequeteDestinatairesParCriteres) {
	ObjetRequeteDestinatairesParCriteres.isJSONParametresInfosCriteres = (
		aParams,
	) => {
		return (
			aParams.genreRequete ===
			ChoixDestinatairesParCriteres_1.TypeGenreRequeteDestinataireParCriteres
				.TGR_InfosCriteres
		);
	};
	ObjetRequeteDestinatairesParCriteres.isJSONParametresTotalIndividus = (
		aParams,
	) => {
		return (
			aParams.genreRequete ===
			ChoixDestinatairesParCriteres_1.TypeGenreRequeteDestinataireParCriteres
				.TGR_TotalIndividus
		);
	};
})(
	ObjetRequeteDestinatairesParCriteres ||
		(exports.ObjetRequeteDestinatairesParCriteres =
			ObjetRequeteDestinatairesParCriteres =
				{}),
);
