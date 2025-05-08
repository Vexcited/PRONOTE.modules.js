const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { GStyle } = require("ObjetStyle.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GCache } = require("Cache.js");
const { ObjetDeserialiser } = require("ObjetDeserialiser.js");
class ObjetRequetePageAgenda extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aNumeroSemaine) {
		this.JSON = {
			NumeroSemaine: aNumeroSemaine,
			AvecListeClasses:
				GCache && !GCache.agenda.existeDonnee("listeClassesGroupes"),
		};
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lParam = {
			ListeClassesGroupes: null,
			parametreExportICal: this.JSONReponse.ParametreExportiCal,
			avecExportICal: this.JSONReponse.AvecExportiCal,
		};
		lParam.listeEvenements = new ObjetDeserialiser().getListeEvenements(
			this.JSONReponse.ListeEvenements,
		);
		lParam.listeFamilles =
			this.JSONReponse.listeFamilles || new ObjetListeElements();
		lParam.listeFamilles.parcourir((aElement) => {
			const lLibelleHtml = [];
			lLibelleHtml.push(
				'<span class="AlignementMilieuVertical InlineBlock" style="width: 12px; height: 12px;',
				GStyle.composeCouleurFond(aElement.couleur),
				'"></span>',
			);
			lLibelleHtml.push(
				'<span class="AlignementMilieuVertical EspaceGauche">',
				aElement.Libelle,
				"</span>",
			);
			aElement.libelleHtml = lLibelleHtml.join("");
		});
		lParam.listeJourDansMois =
			this.JSONReponse.listeJourDansMois || new ObjetListeElements();
		if (GCache) {
			if (this.JSONReponse.ListeClassesGroupes) {
				lParam.listeClassesGroupes = new ObjetListeElements().fromJSON(
					this.JSONReponse.ListeClassesGroupes,
					_ajouterClassesGroupes.bind(this),
				);
				GCache.agenda.setDonnee(
					"listeClassesGroupes",
					lParam.listeClassesGroupes,
				);
			} else if (GCache.agenda.existeDonnee("listeClassesGroupes")) {
				lParam.listeClassesGroupes = GCache.agenda.getDonnee(
					"listeClassesGroupes",
				);
			}
		}
		lParam.dateFinPrevisionnel = this.JSONReponse.dateFinPrevisionnel;
		lParam.dateDebutPrevisionnel = this.JSONReponse.dateDebutPrevisionnel;
		this.callbackReussite.appel(lParam);
	}
}
Requetes.inscrire("PageAgenda", ObjetRequetePageAgenda);
function _ajouterClassesGroupes(aJSON, aElement) {
	if (aJSON.niveau) {
		aElement.niveau = aJSON.niveau
			? new ObjetElement().fromJSON(aJSON.niveau)
			: null;
	}
	if (aJSON.EPeda) {
		aElement.equipePedagogique = new ObjetListeElements().fromJSON(aJSON.EPeda);
	}
}
module.exports = { ObjetRequetePageAgenda };
