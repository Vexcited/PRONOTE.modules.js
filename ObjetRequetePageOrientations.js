exports.ObjetRequetePageOrientations = exports.NSOrientation = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTri_1 = require("ObjetTri");
var NSOrientation;
(function (NSOrientation) {
	let EGenreRessource;
	(function (EGenreRessource) {
		EGenreRessource[(EGenreRessource["orientation"] = 0)] = "orientation";
		EGenreRessource[(EGenreRessource["specialite"] = 1)] = "specialite";
		EGenreRessource[(EGenreRessource["option"] = 2)] = "option";
		EGenreRessource[(EGenreRessource["lv1"] = 3)] = "lv1";
		EGenreRessource[(EGenreRessource["lv2"] = 4)] = "lv2";
		EGenreRessource[(EGenreRessource["lvAutre"] = 5)] = "lvAutre";
	})(
		(EGenreRessource =
			NSOrientation.EGenreRessource || (NSOrientation.EGenreRessource = {})),
	);
})(NSOrientation || (exports.NSOrientation = NSOrientation = {}));
class ObjetRequetePageOrientations extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	actionApresRequete() {
		const lParam = {};
		lParam.Message = this.JSONReponse.Message;
		if (!lParam.Message) {
			lParam.texteNiveau = this.JSONReponse.texteNiveau;
			if (this.JSONReponse.listeOrientations) {
				lParam.listeOrientations = _organiseListeOrientation.call(
					this,
					this.JSONReponse.listeOrientations,
				);
			}
			lParam.listeRubriques = this.JSONReponse.listeRubriques;
			lParam.estNiveauPremiere = this.JSONReponse.estNiveauPremiere;
			lParam.estMultiNiveau = this.JSONReponse.estMultiNiveau;
		}
		this.callbackReussite.appel(lParam);
	}
}
exports.ObjetRequetePageOrientations = ObjetRequetePageOrientations;
CollectionRequetes_1.Requetes.inscrire(
	"PageOrientations",
	ObjetRequetePageOrientations,
);
function _organiseListeOrientation(aListeOrientations) {
	aListeOrientations.setTri([
		ObjetTri_1.ObjetTri.init((a) => {
			return a.voieMefStat5;
		}),
	]);
	aListeOrientations.trier();
	let lVoieCourante;
	const lListeOrganisee = new ObjetListeElements_1.ObjetListeElements();
	aListeOrientations.parcourir((a) => {
		if (!a.getNumero()) {
			if (a.voieMefStat5 !== lVoieCourante) {
				lVoieCourante = a.voieMefStat5;
				lListeOrganisee.addElement(a);
			}
		} else {
			lListeOrganisee.addElement(a);
		}
	});
	return lListeOrganisee;
}
