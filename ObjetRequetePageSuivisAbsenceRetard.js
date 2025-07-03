exports.ObjetRequetePageSuivisAbsenceRetard = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const _Cache_1 = require("_Cache");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetElement_1 = require("ObjetElement");
const ObjetTraduction_1 = require("ObjetTraduction");
const Cache_1 = require("Cache");
class ObjetRequetePageSuivisAbsenceRetard extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aEleve, aDateDebut, aDateFin, aElementSuivi) {
		this._eleve = aEleve;
		if (!Cache_1.GCache.suivisAbsenceRetard) {
			Cache_1.GCache.suivisAbsenceRetard = {};
		}
		if (!Cache_1.GCache.suivisAbsenceRetard.listeInterlocuteurs) {
			Cache_1.GCache.suivisAbsenceRetard.listeInterlocuteurs =
				new _Cache_1._Cache();
		}
		this.JSON.eleve = aEleve;
		this.JSON.dateDebut = aDateDebut;
		this.JSON.dateFin = aDateFin;
		if (aElementSuivi) {
			this.JSON.elementSuivi = aElementSuivi;
		}
		if (!Cache_1.GCache.suivisAbsenceRetard.listePersonnel) {
			this.JSON.avecListePersonnel = true;
		}
		if (
			!Cache_1.GCache.suivisAbsenceRetard.listeInterlocuteurs.existeDonnee(
				Cache_1.GCache.suivisAbsenceRetard.listeInterlocuteurs.getCle([aEleve]),
			)
		) {
			this.JSON.avecListeInterlocuteurs = true;
		}
		if (!Cache_1.GCache.suivisAbsenceRetard.listeMotifsAbsenceEleve) {
			this.JSON.AvecMotifsAbsenceEleve = true;
		}
		if (!Cache_1.GCache.suivisAbsenceRetard.listeMotifsRetard) {
			this.JSON.AvecMotifsRetard = true;
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		if (this.JSONReponse.ListePersonnel) {
			this.JSONReponse.ListePersonnel.insererElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("Aucun"),
					0,
				),
				0,
			);
			Cache_1.GCache.suivisAbsenceRetard.listePersonnel =
				this.JSONReponse.ListePersonnel;
		}
		if (this.JSONReponse.listeInterlocuteurs) {
			const lListeInterlocuteurs = this.JSONReponse.listeInterlocuteurs;
			lListeInterlocuteurs.insererElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("Autre"),
					0,
				),
				0,
			);
			Cache_1.GCache.suivisAbsenceRetard.listeInterlocuteurs.setDonnee(
				Cache_1.GCache.suivisAbsenceRetard.listeInterlocuteurs.getCle([
					this._eleve,
				]),
				lListeInterlocuteurs,
			);
		}
		if (this.JSONReponse.listeMotifsAbsenceEleve) {
			Cache_1.GCache.suivisAbsenceRetard.listeMotifsAbsenceEleve =
				this.JSONReponse.listeMotifsAbsenceEleve;
		}
		if (this.JSONReponse.listeMotifsRetard) {
			Cache_1.GCache.suivisAbsenceRetard.listeMotifsRetard =
				this.JSONReponse.listeMotifsRetard;
		}
		const lListeSuivis = this.JSONReponse.listeSuivis;
		_listeSuivisAbsenceRetard(lListeSuivis, this.JSONReponse.ListeMedias);
		this.callbackReussite.appel(
			lListeSuivis,
			Cache_1.GCache.suivisAbsenceRetard.listePersonnel,
			this.JSONReponse.message
				? null
				: Cache_1.GCache.suivisAbsenceRetard.listeInterlocuteurs.getDonnee(
						Cache_1.GCache.suivisAbsenceRetard.listeInterlocuteurs.getCle([
							this._eleve,
						]),
					),
			this.JSONReponse.ListeMedias,
			Cache_1.GCache.suivisAbsenceRetard.listeMotifsAbsenceEleve,
			Cache_1.GCache.suivisAbsenceRetard.listeMotifsRetard,
			this.JSONReponse.message,
		);
	}
}
exports.ObjetRequetePageSuivisAbsenceRetard =
	ObjetRequetePageSuivisAbsenceRetard;
CollectionRequetes_1.Requetes.inscrire(
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
					Cache_1.GCache.suivisAbsenceRetard.listeMotifsAbsenceEleve.getElementParElement(
						aElement.motif,
					);
				if (!lTrouve) {
					lTrouve =
						Cache_1.GCache.suivisAbsenceRetard.listeMotifsRetard.getElementParElement(
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
