exports.ObjetFenetre_ResultatsQCM_PN = void 0;
const TypeHttpSaisieResultatQCM_1 = require("TypeHttpSaisieResultatQCM");
const ObjetFenetre_ResultatsQCM_1 = require("ObjetFenetre_ResultatsQCM");
const ObjetRequeteSaisieQCMResultat_1 = require("ObjetRequeteSaisieQCMResultat");
const ObjetRequeteQCMPourCDT_InfosCours_1 = require("ObjetRequeteQCMPourCDT_InfosCours");
const ObjetFenetre_SaisieQCMResultat_1 = require("ObjetFenetre_SaisieQCMResultat");
const ObjetFenetre_1 = require("ObjetFenetre");
class ObjetFenetre_ResultatsQCM_PN extends ObjetFenetre_ResultatsQCM_1.ObjetFenetre_ResultatsQCM {
	surRecommencerTAF(aParam) {
		const lParamCours = {
			typeSaisieQCMResultat:
				TypeHttpSaisieResultatQCM_1.TypeHttpSaisieResultatQCM
					.HttpSaisieResultatQCM_RedonnerLeTAFAuxElevesJusquaLaDate,
			execution: aParam.element,
			eleves: aParam.eleves,
		};
		if (
			this.cacheInfoCoursExecution[aParam.element.getNumero()] !== undefined
		) {
			this.actionSurInfosCours(
				aParam,
				lParamCours,
				this.cacheInfoCoursExecution[aParam.element.getNumero()],
			);
		} else {
			new ObjetRequeteQCMPourCDT_InfosCours_1.ObjetRequeteQCMPourCDT_InfosCours(
				this,
				this.actionSurInfosCours.bind(this, aParam, lParamCours),
			).lancerRequete({ execution: aParam.element });
		}
	}
	actionSurInfosCours(aParam, aParamCours, aJSONCours) {
		this.cacheInfoCoursExecution[aParamCours.execution.getNumero()] =
			aJSONCours;
		this.ouvrirFenetreSaisieQCMResultat(aParam, aParamCours, aJSONCours);
	}
	ouvrirFenetreSaisieQCMResultat(aParam, aParamFenetre, aJSONCours) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SaisieQCMResultat_1.ObjetFenetre_SaisieQCMResultat,
			{
				pere: this,
				evenement: (aNumeroBouton, aParamFenetreOut) => {
					new ObjetRequeteSaisieQCMResultat_1.ObjetRequeteSaisieQCMResultat(
						this,
					)
						.lancerRequete(aParamFenetreOut)
						.then((aJSON) => {
							aParam.JSON = aJSON;
							this.callback.appel(aParam);
						});
				},
			},
		);
		lFenetre.setOptionsExecutionQCM({
			consigne: true,
			personnalisationProjAcc:
				this.options.avecPersonnalisationProjetAccompagnement,
			avecModeCorrigeALaDate: true,
			avecMultipleExecutions: true,
		});
		lFenetre.setDonnees(aParamFenetre, aJSONCours);
	}
}
exports.ObjetFenetre_ResultatsQCM_PN = ObjetFenetre_ResultatsQCM_PN;
