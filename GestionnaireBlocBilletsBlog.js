const { GestionnaireBlocDeBase } = require("GestionnaireBloc.js");
const { ObjetBlocBillet } = require("ObjetBlocBillet.js");
class GestionnaireBlocBilletsBlog extends GestionnaireBlocDeBase {
	constructor(...aParams) {
		super(...aParams);
	}
	setOptions(aOptions) {
		super.setOptions(aOptions);
		for (const lInstanceBloc of this._instances) {
			lInstanceBloc.setOptions(this._options);
		}
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
		const lInstance = this.getInstanceObjetMetier(aDataBloc, ObjetBlocBillet);
		return {
			html: this.composeZoneInstance(lInstance),
			controleur: lInstance.controleur,
		};
	}
}
module.exports = { GestionnaireBlocBilletsBlog };
