const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { _Cache } = require("_Cache.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetElement } = require("ObjetElement.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GCache } = require("Cache.js");
class ObjetRequetePageSuivisAbsenceRetard extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aEleve, aDateDebut, aDateFin, aElementSuivi) {
		this._eleve = aEleve;
		if (!GCache.suivisAbsenceRetard) {
			GCache.suivisAbsenceRetard = {};
		}
		if (!GCache.suivisAbsenceRetard.listeInterlocuteurs) {
			GCache.suivisAbsenceRetard.listeInterlocuteurs = new _Cache();
		}
		this.JSON.eleve = aEleve;
		this.JSON.dateDebut = aDateDebut;
		this.JSON.dateFin = aDateFin;
		if (aElementSuivi) {
			this.JSON.elementSuivi = aElementSuivi;
		}
		if (!GCache.suivisAbsenceRetard.listePersonnel) {
			this.JSON.avecListePersonnel = true;
		}
		if (
			!GCache.suivisAbsenceRetard.listeInterlocuteurs.existeDonnee(
				GCache.suivisAbsenceRetard.listeInterlocuteurs.getCle([aEleve]),
			)
		) {
			this.JSON.avecListeInterlocuteurs = true;
		}
		if (!GCache.suivisAbsenceRetard.listeMotifsAbsenceEleve) {
			this.JSON.AvecMotifsAbsenceEleve = true;
		}
		if (!GCache.suivisAbsenceRetard.listeMotifsRetard) {
			this.JSON.AvecMotifsRetard = true;
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		if (this.JSONReponse.ListePersonnel) {
			this.JSONReponse.ListePersonnel.insererElement(
				new ObjetElement(GTraductions.getValeur("Aucun"), 0),
				0,
			);
			GCache.suivisAbsenceRetard.listePersonnel =
				this.JSONReponse.ListePersonnel;
		}
		if (this.JSONReponse.listeInterlocuteurs) {
			const lListeInterlocuteurs = this.JSONReponse.listeInterlocuteurs;
			lListeInterlocuteurs.insererElement(
				new ObjetElement(GTraductions.getValeur("Autre"), 0),
				0,
			);
			GCache.suivisAbsenceRetard.listeInterlocuteurs.setDonnee(
				GCache.suivisAbsenceRetard.listeInterlocuteurs.getCle([this._eleve]),
				lListeInterlocuteurs,
			);
		}
		if (this.JSONReponse.listeMotifsAbsenceEleve) {
			GCache.suivisAbsenceRetard.listeMotifsAbsenceEleve =
				this.JSONReponse.listeMotifsAbsenceEleve;
		}
		if (this.JSONReponse.listeMotifsRetard) {
			GCache.suivisAbsenceRetard.listeMotifsRetard =
				this.JSONReponse.listeMotifsRetard;
		}
		const lListeSuivis = this.JSONReponse.listeSuivis;
		_listeSuivisAbsenceRetard(lListeSuivis, this.JSONReponse.ListeMedias);
		this.callbackReussite.appel(
			lListeSuivis,
			GCache.suivisAbsenceRetard.listePersonnel,
			this.JSONReponse.message
				? null
				: GCache.suivisAbsenceRetard.listeInterlocuteurs.getDonnee(
						GCache.suivisAbsenceRetard.listeInterlocuteurs.getCle([
							this._eleve,
						]),
					),
			this.JSONReponse.ListeMedias,
			GCache.suivisAbsenceRetard.listeMotifsAbsenceEleve,
			GCache.suivisAbsenceRetard.listeMotifsRetard,
			this.JSONReponse.message,
		);
	}
}
Requetes.inscrire(
	"PageSuivisAbsenceRetard",
	ObjetRequetePageSuivisAbsenceRetard,
);
function _listeSuivisAbsenceRetard(aListe, aListeMedias) {
	let lPere;
	if (!!aListe) {
		aListe.parcourir((aElement) => {
			if (aElement.estPere) {
				lPere = aElement;
				aElement.estDeploye = true;
			} else {
				aElement.pere = lPere;
				lPere.estUnDeploiement = true;
			}
			if (aElement.media) {
				aElement.media = aListeMedias.getElementParElement(aElement.media);
			}
			if (!aElement.libelleLettre) {
				aElement.libelleLettre = "";
			}
			if (!aElement.respEleve) {
				aElement.respEleve = "";
			}
			if (!aElement.respEleveReponse) {
				aElement.respEleveReponse = "";
			}
			if (!aElement.commentaire) {
				aElement.commentaire = "";
			}
			if (aElement.motif) {
				let lTrouve =
					GCache.suivisAbsenceRetard.listeMotifsAbsenceEleve.getElementParElement(
						aElement.motif,
					);
				if (!lTrouve) {
					lTrouve =
						GCache.suivisAbsenceRetard.listeMotifsRetard.getElementParElement(
							aElement.motif,
						);
				}
				if (lTrouve && lTrouve.nonConnu) {
					aElement.motif.nonConnu = true;
				}
			}
		});
	}
}
module.exports = ObjetRequetePageSuivisAbsenceRetard;
