exports.ObjetRequetePageBulletins = void 0;
const _ObjetRequeteResultat_1 = require("_ObjetRequeteResultat");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetElement_1 = require("ObjetElement");
const UtilitaireDeserialiserPiedBulletin_1 = require("UtilitaireDeserialiserPiedBulletin");
class ObjetRequetePageBulletins extends _ObjetRequeteResultat_1._ObjetRequeteResultat {
	lancerRequete(aParam) {
		const lParam = {
			eleve: new ObjetElement_1.ObjetElement(),
			classe: new ObjetElement_1.ObjetElement(),
			periode: new ObjetElement_1.ObjetElement(),
		};
		$.extend(lParam, aParam);
		this.JSON = {
			eleve: lParam.eleve,
			periode: lParam.periode,
			classe: lParam.classe,
		};
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lParam = { aCopier: {}, absences: {} };
		lParam.Message = this.JSONReponse.Message;
		if (!lParam.Message) {
			lParam.aCopier.classe = this.JSONReponse.Classe;
			lParam.aCopier.strInfoDatePublication =
				this.JSONReponse.strInfoDatePublication;
			if (
				this.JSONReponse.NoteBareme !== null &&
				this.JSONReponse.NoteBareme !== undefined
			) {
				lParam.aCopier.baremeNotationNiveau = this.JSONReponse.NoteBareme;
			}
			const lExisteServiceAvecNotes = this.JSONReponse.existeServiceAvecNotes;
			const lExisteServiceSansNotes = this.JSONReponse.existeServiceSansNotes;
			lParam.aCopier.Affichage = this.JSONReponse.ParametresAffichages;
			lParam.aCopier.Affichage.existeServiceAvecNotes = lExisteServiceAvecNotes;
			lParam.aCopier.Affichage.existeServiceSansNotes = lExisteServiceSansNotes;
			lParam.aCopier.Affichage.pourClasseAvecNotes =
				lExisteServiceAvecNotes && !lExisteServiceSansNotes;
			lParam.aCopier.Affichage.pourClasseSansNotes =
				!lExisteServiceAvecNotes && lExisteServiceSansNotes;
			if (lExisteServiceSansNotes) {
				lParam.aCopier.Affichage.posClasse =
					this.JSONReponse.TypePositionnementClasse;
			}
			this.creerListeServices(this.JSONReponse);
			lParam.aCopier.ServiceEditable = this.ServiceEditable;
			lParam.aCopier.ExisteDevoir = this.ExisteDevoir;
			lParam.aCopier.ExisteService = this.ExisteService;
			lParam.aCopier.NbrMaxServices = this.NbrMaxServices;
			lParam.aCopier.NbrMaxDevoirs = this.NbrMaxDevoirs;
			lParam.aCopier.tableauSurMatieres = this.tableauSurMatieres;
			lParam.aCopier.tableauDebutRegroupement = this.tableauDebutRegroupement;
			lParam.aCopier.ListeElements = this.ListeElements;
			lParam.aCopier.listeAnnotations = this.JSONReponse.listeAnnotations;
			lParam.aCopier.MoyenneGenerale = this.JSONReponse.General;
			lParam.aCopier.graph = this.JSONReponse.graphe;
			lParam.aCopier.baremeParDefaut = this.JSONReponse.baremeParDefaut;
			$.extend(
				lParam.absences,
				new UtilitaireDeserialiserPiedBulletin_1.UtilitaireDeserialiserPiedBulletin().creerAbsences(
					this.JSONReponse,
				),
			);
			lParam.aCopier.PiedDePage =
				new UtilitaireDeserialiserPiedBulletin_1.UtilitaireDeserialiserPiedBulletin().creerPiedDePage(
					this.JSONReponse,
				);
			lParam.aCopier.listeAccusesReception =
				this.JSONReponse.listeAccusesReception;
		}
		this.callbackReussite.appel(lParam);
	}
}
exports.ObjetRequetePageBulletins = ObjetRequetePageBulletins;
CollectionRequetes_1.Requetes.inscrire(
	"PageBulletins",
	ObjetRequetePageBulletins,
);
