exports.ObjetFenetre_ConnexionCloudIndex =
	exports.ObjetRequeteSaisieGestionCloudIndexAsync =
	exports.ObjetRequeteSaisieGestionCloudIndex =
		void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_1 = require("ObjetFenetre");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetFenetre_FichiersCloud_1 = require("ObjetFenetre_FichiersCloud");
const TypeClientRest_1 = require("TypeClientRest");
class ObjetRequeteSaisieGestionCloudIndex extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
exports.ObjetRequeteSaisieGestionCloudIndex =
	ObjetRequeteSaisieGestionCloudIndex;
CollectionRequetes_1.Requetes.inscrire(
	"GestionCloudIndex",
	ObjetRequeteSaisieGestionCloudIndex,
);
class ObjetRequeteSaisieGestionCloudIndexAsync extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
exports.ObjetRequeteSaisieGestionCloudIndexAsync =
	ObjetRequeteSaisieGestionCloudIndexAsync;
CollectionRequetes_1.Requetes.inscrire(
	"GestionCloudIndexAsync",
	ObjetRequeteSaisieGestionCloudIndexAsync,
);
class ObjetFenetre_ConnexionCloudIndex extends ObjetFenetre_1.ObjetFenetre {
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnCreation: {
				event: function () {
					new ObjetRequeteSaisieGestionCloudIndexAsync(aInstance)
						.lancerRequete()
						.then((aParams) => {
							if (aParams.JSONRapportSaisie.url) {
								window.open(aParams.JSONRapportSaisie.url);
							}
						});
				},
			},
			btnAssociation: {
				event: function () {
					aInstance
						.getInstance(aInstance.identFenetreFichiersCloud)
						.setDonnees({
							service: TypeClientRest_1.TypeClientRest.crCloudIndex,
							inscriptionSeule: true,
							callbackInscriptionSeule: () => {
								aInstance.fermer();
							},
						});
				},
			},
		});
	}
	construireInstances() {
		this.identFenetreFichiersCloud = this.addFenetre(
			ObjetFenetre_FichiersCloud_1.ObjetFenetre_FichiersCloud,
		);
	}
	composeContenu() {
		const T = [];
		T.push('<div style="min-width: 500px;">');
		T.push(
			"<p>" +
				ObjetTraduction_1.GTraductions.getValeur("cloudIndex.explication") +
				"</p>",
		);
		T.push("<p>");
		T.push(
			'<span class="InlineBlock" style="width:235px;margin-right:1rem;">' +
				ObjetTraduction_1.GTraductions.getValeur("cloudIndex.pasEncoreCompte") +
				"</span>",
		);
		T.push(
			'<ie-bouton ie-image="Image_CreationCompteCloudIndex" ie-model="btnCreation" title="' +
				ObjetTraduction_1.GTraductions.getValeur("cloudIndex.creationCompte") +
				'" class="AlignementMilieuVertical themeBoutonNeutre">' +
				ObjetTraduction_1.GTraductions.getValeur("cloudIndex.creationCompte") +
				"</ie-bouton>",
		);
		T.push("<br /><br />");
		T.push(
			'<span class="InlineBlock" style="width:235px;margin-right:1rem;">' +
				ObjetTraduction_1.GTraductions.getValeur("cloudIndex.dejaCompte") +
				"</span>",
		);
		T.push(
			'<ie-bouton ie-image="Image_AssociationCompteCloudIndex" ie-model="btnAssociation" title="' +
				ObjetTraduction_1.GTraductions.getValeur(
					"cloudIndex.associationCompte",
				) +
				'" class="AlignementMilieuVertical themeBoutonNeutre">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"cloudIndex.associationCompte",
				) +
				"</ie-bouton>",
		);
		T.push("</p>");
		T.push("</div>");
		return T.join("");
	}
}
exports.ObjetFenetre_ConnexionCloudIndex = ObjetFenetre_ConnexionCloudIndex;
