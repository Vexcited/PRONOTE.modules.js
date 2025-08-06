exports.ObjetRequetePageAgenda = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const Cache_1 = require("Cache");
const ObjetDeserialiser_1 = require("ObjetDeserialiser");
class ObjetRequetePageAgenda extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParams) {
		this.JSON = {
			NumeroSemaine: aParams.numeroSemaine,
			avecEventsPasses: aParams.avecEventsPasses,
			AvecListeClasses:
				Cache_1.GCache &&
				!Cache_1.GCache.agenda.existeDonnee("listeClassesGroupes"),
		};
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lListeEvenements =
			new ObjetDeserialiser_1.ObjetDeserialiser().getListeEvenements(
				this.JSONReponse.ListeEvenements,
			);
		const lListeFamilles =
			this.JSONReponse.listeFamilles ||
			new ObjetListeElements_1.ObjetListeElements();
		lListeFamilles.parcourir((aElement) => {
			const lLibelleHtml = [];
			lLibelleHtml.push(
				'<span class="AlignementMilieuVertical InlineBlock" style="width: 12px; height: 12px;',
				ObjetStyle_1.GStyle.composeCouleurFond(aElement.couleur),
				'"></span>',
			);
			lLibelleHtml.push(
				'<span class="AlignementMilieuVertical EspaceGauche">',
				aElement.Libelle,
				"</span>",
			);
			aElement.libelleHtml = lLibelleHtml.join("");
		});
		const lListeJourDansMois =
			this.JSONReponse.listeJourDansMois ||
			new ObjetListeElements_1.ObjetListeElements();
		let lListeClassesGroupes;
		if (Cache_1.GCache) {
			if (this.JSONReponse.ListeClassesGroupes) {
				lListeClassesGroupes =
					new ObjetListeElements_1.ObjetListeElements().fromJSON(
						this.JSONReponse.ListeClassesGroupes,
						this._ajouterClassesGroupes.bind(this),
					);
				Cache_1.GCache.agenda.setDonnee(
					"listeClassesGroupes",
					lListeClassesGroupes,
				);
			} else if (Cache_1.GCache.agenda.existeDonnee("listeClassesGroupes")) {
				lListeClassesGroupes = Cache_1.GCache.agenda.getDonnee(
					"listeClassesGroupes",
				);
			}
		}
		const lParam = {
			parametreExportICal: this.JSONReponse.ParametreExportiCal,
			avecExportICal: this.JSONReponse.AvecExportiCal,
			listeEvenements: lListeEvenements,
			listeFamilles: lListeFamilles,
			listeJourDansMois: lListeJourDansMois,
			listeClassesGroupes: lListeClassesGroupes,
			dateFinPrevisionnel: this.JSONReponse.dateFinPrevisionnel,
			dateDebutPrevisionnel: this.JSONReponse.dateDebutPrevisionnel,
		};
		this.callbackReussite.appel(lParam);
	}
	_ajouterClassesGroupes(aJSON, aElement) {
		if (aJSON.niveau) {
			aElement.niveau = aJSON.niveau
				? new ObjetElement_1.ObjetElement().fromJSON(aJSON.niveau)
				: null;
		}
		if (aJSON.EPeda) {
			aElement.equipePedagogique =
				new ObjetListeElements_1.ObjetListeElements().fromJSON(aJSON.EPeda);
		}
	}
}
exports.ObjetRequetePageAgenda = ObjetRequetePageAgenda;
CollectionRequetes_1.Requetes.inscrire("PageAgenda", ObjetRequetePageAgenda);
