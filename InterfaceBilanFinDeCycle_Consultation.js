exports.InterfaceBilanFinDeCycle_Consultation = void 0;
const _InterfaceBilanFinDeCycle_1 = require("_InterfaceBilanFinDeCycle");
const ObjetElement_1 = require("ObjetElement");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetRequeteSaisieAccuseReceptionDocument_1 = require("ObjetRequeteSaisieAccuseReceptionDocument");
const ObjetListeElements_1 = require("ObjetListeElements");
class InterfaceBilanFinDeCycle_Consultation extends _InterfaceBilanFinDeCycle_1._InterfaceBilanFinDeCycle {
	constructor(...aParams) {
		super(...aParams);
		let lPeriode = new ObjetElement_1.ObjetElement();
		lPeriode.Genre = 0;
		this.periodeSelectionnee = lPeriode;
	}
	_addSurZone() {
		if (this.avecGestionAccuseReception) {
			this.AddSurZone.push({ separateur: true });
			this.AddSurZone.push({
				html: IE.jsx.str(
					"ie-checkbox",
					{
						class: "AlignementMilieuVertical",
						"ie-model": this.jsxModeleCheckboxAccuseReception.bind(this),
						"ie-if": this.jsxAfficherCheckboxAccuseReception.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.JAiPrisConnaissanceDuBulletin",
					),
				),
			});
			return true;
		}
		return false;
	}
	recupererDonnees() {
		super.recupererDonnees();
		this.lancerRequeteRecuperationDonnees();
	}
	jsxModeleCheckboxAccuseReception() {
		return {
			getValue: () => {
				const lResponsableAR = this._getResponsableAccuseReception();
				return !!lResponsableAR ? lResponsableAR.aPrisConnaissance : false;
			},
			setValue: (aValue) => {
				const lResponsableAR = this._getResponsableAccuseReception();
				if (!!lResponsableAR) {
					lResponsableAR.aPrisConnaissance = aValue;
					new ObjetRequeteSaisieAccuseReceptionDocument_1.ObjetRequeteSaisieAccuseReceptionDocument(
						this,
					).lancerRequete({
						periode: this.periodeSelectionnee,
						aPrisConnaissance: aValue,
					});
				}
			},
			getDisabled: () => {
				const lResponsableAR = this._getResponsableAccuseReception();
				return !!lResponsableAR ? lResponsableAR.aPrisConnaissance : true;
			},
		};
	}
	jsxAfficherCheckboxAccuseReception() {
		const lResponsableAR = this._getResponsableAccuseReception();
		return (
			!this.avecMessage && this.avecGestionAccuseReception && !!lResponsableAR
		);
	}
	_getResponsableAccuseReception() {
		let lReponsableAccuseReception = null;
		if (
			!!this.listeAccusesReception &&
			this.listeAccusesReception.count() > 0
		) {
			lReponsableAccuseReception =
				this.listeAccusesReception.getPremierElement();
			if (!!lReponsableAccuseReception) {
			}
		}
		return lReponsableAccuseReception;
	}
	getListeEleves() {
		return new ObjetListeElements_1.ObjetListeElements().addElement(
			GEtatUtilisateur.getMembre(),
		);
	}
	getClasseConcernee() {
		return GEtatUtilisateur.getMembre().Classe;
	}
	getPeriodeConcernee() {
		return this.periodeSelectionnee;
	}
	getPalierConcerne() {
		return null;
	}
}
exports.InterfaceBilanFinDeCycle_Consultation =
	InterfaceBilanFinDeCycle_Consultation;
