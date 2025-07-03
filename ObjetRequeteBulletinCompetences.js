exports.ObjetRequeteBulletinCompetences = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteBulletinCompetences extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		this.JSON = {
			classe: aParam.classe,
			periode: aParam.periode,
			eleve: aParam.eleve,
			bulletin: aParam.bulletin,
		};
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lListeLignes = this.JSONReponse.listeLignes;
		if (lListeLignes) {
			lListeLignes.parcourir((aLigne) => {
				if (!!aLigne.niveauAcqComp) {
					Object.assign(
						aLigne.niveauAcqComp,
						this._getNiveauAcquisitionGlobal(aLigne.niveauAcqComp),
					);
				}
				if (!!aLigne.posLSUNiveauP1) {
					Object.assign(
						aLigne.posLSUNiveauP1,
						this._getNiveauAcquisitionGlobal(aLigne.posLSUNiveauP1),
					);
				}
				if (!!aLigne.posLSUNiveauP2) {
					Object.assign(
						aLigne.posLSUNiveauP2,
						this._getNiveauAcquisitionGlobal(aLigne.posLSUNiveauP2),
					);
				}
				if (!!aLigne.posLSUNiveau) {
					Object.assign(
						aLigne.posLSUNiveau,
						this._getNiveauAcquisitionGlobal(aLigne.posLSUNiveau),
					);
				}
				if (aLigne.listeColonnesTransv) {
					aLigne.listeColonnesTransv.parcourir((aElementColonneTransv) => {
						if (
							!!aElementColonneTransv.niveauAcqui &&
							aElementColonneTransv.niveauAcqui.existeNumero()
						) {
							Object.assign(
								aElementColonneTransv.niveauAcqui,
								this._getNiveauAcquisitionGlobal(
									aElementColonneTransv.niveauAcqui,
								),
							);
						}
						if (
							!!aElementColonneTransv.niveauAcquiCalc &&
							aElementColonneTransv.niveauAcquiCalc.existeNumero()
						) {
							Object.assign(
								aElementColonneTransv.niveauAcquiCalc,
								this._getNiveauAcquisitionGlobal(
									aElementColonneTransv.niveauAcquiCalc,
								),
							);
						}
					});
				}
			});
		}
		this.callbackReussite.appel(this.JSONReponse);
	}
	_getNiveauAcquisitionGlobal(aNiveauAcquision) {
		return GParametres.listeNiveauxDAcquisitions.getElementParGenre(
			aNiveauAcquision.getGenre(),
		);
	}
}
exports.ObjetRequeteBulletinCompetences = ObjetRequeteBulletinCompetences;
CollectionRequetes_1.Requetes.inscrire(
	"BulletinCompetences",
	ObjetRequeteBulletinCompetences,
);
