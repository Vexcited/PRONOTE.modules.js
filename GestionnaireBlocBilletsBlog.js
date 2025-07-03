exports.GestionnaireBlocBilletsBlog = void 0;
const GestionnaireBloc_1 = require("GestionnaireBloc");
const ObjetBlocBillet_1 = require("ObjetBlocBillet");
class GestionnaireBlocBilletsBlog extends GestionnaireBloc_1.GestionnaireBlocDeBase {
	setOptions(aOptions) {
		super.setOptions(aOptions);
		for (const lInstanceBloc of this._instances) {
			lInstanceBloc.setOptions(this._options);
		}
		return this;
	}
	ouvrirFenetreCommentairesDeBillet(aBillet) {
		if (aBillet) {
			for (const lInstanceBloc of this._instances) {
				if (
					lInstanceBloc.getBilletConcerne().getNumero() === aBillet.getNumero()
				) {
					lInstanceBloc.ouvrirFenetreCommentairesDeBillet(aBillet);
					break;
				}
			}
		}
	}
	composeBloc(aDataBloc) {
		const lInstance = this.getInstanceObjetMetier(
			aDataBloc,
			ObjetBlocBillet_1.ObjetBlocBillet,
		);
		return {
			html: this.composeZoneInstance(lInstance),
			controleur: lInstance.controleur,
		};
	}
}
exports.GestionnaireBlocBilletsBlog = GestionnaireBlocBilletsBlog;
