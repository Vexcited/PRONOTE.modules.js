const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetFenetreVisuEleveQCM } = require("ObjetFenetreVisuEleveQCM.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreMessage } = require("Enumere_Message.js");
const { InterfacePiedBulletin } = require("InterfacePiedBulletin.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const { _InterfaceReleveDeNotes } = require("_InterfaceReleveDeNotes.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
class InterfaceReleveDeNotes extends _InterfaceReleveDeNotes {
	constructor(aNom, aIdent, aPere, aEvenement) {
		const lParam = {
			avecSaisie: false,
			avecInfosEleve: false,
			avecCorrige: true,
		};
		super(aNom, aIdent, aPere, aEvenement, lParam);
		this.genreMessage = EGenreMessage.AucunRelevePourEleve;
	}
	instancierCombos() {
		return this.add(
			ObjetSaisiePN,
			this.evenementSurCombo,
			this.initialiserCombo,
		);
	}
	instancierPiedBulletin() {
		return this.add(InterfacePiedBulletin, null, this._initPiedPage);
	}
	instancierFenetreVisuEleveQCM() {
		return this.addFenetre(ObjetFenetreVisuEleveQCM);
	}
	getEleve() {
		return GEtatUtilisateur.getMembre();
	}
	setParametresGeneraux() {
		this.GenreStructure = EStructureAffichage.Autre;
		this.AddSurZone = ["", this.identTripleCombo];
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = true;
		this.addSurZoneAccuseReception();
	}
	addSurZoneAccuseReception() {
		if (this.avecGestionAccuseReception) {
			this.AddSurZone.push({ separateur: true });
			this.AddSurZone.push({
				html:
					'<ie-checkbox class="AlignementMilieuVertical" ie-model="cbAccuseReception" ie-display="visibiliteAR">' +
					GTraductions.getValeur(
						"BulletinEtReleve.JAiPrisConnaissanceDuReleve",
					) +
					"</ie-checkbox>",
			});
			return true;
		}
		return false;
	}
	initialiserCombo(aInstance) {
		aInstance.setOptionsObjetSaisie({
			labelWAICellule: GTraductions.getValeur("WAI.ListeSelectionPeriode"),
		});
	}
	evenementSurCombo(aParams) {
		if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
			this.fermerFenetreCalculMoy();
			this.setPeriode(aParams.element);
			const lParam = {
				numeroEleve: this.getEleve().getNumero(),
				genrePeriode: aParams.element.getGenre(),
				numeroPeriode: aParams.element.getNumero(),
			};
			this.envoyerRequeteBulletin(lParam);
		}
	}
	actualiserPage() {
		const lParam = {
			numeroEleve: this.getEleve().getNumero(),
			genrePeriode: this.getPeriode().getGenre(),
			numeroPeriode: this.getPeriode().getNumero(),
		};
		this.envoyerRequeteBulletin(lParam);
	}
	getParametresCalcul(aParamEvnt) {
		return $.extend(super.getParametresCalcul(aParamEvnt), {
			libelleEleve: this.getEleve().getLibelle(),
			numeroEleve: this.getEleve().getNumero(),
			libelleClasse: GEtatUtilisateur.Identification.getLibelleClasse(),
			numeroClasse: GEtatUtilisateur.Identification.getNumeroClasse(),
		});
	}
	recupererDonnees() {
		if (this.Instances[this.identTripleCombo]) {
			this.IdPremierElement = this.getInstance(
				this.identTripleCombo,
			).getPremierElement();
			this.listePeriodes = GEtatUtilisateur.getOngletListePeriodes();
			if (this.listePeriodes && this.listePeriodes.count()) {
				this.Instances[this.identTripleCombo].setVisible(true);
				this.Instances[this.identTripleCombo].setDonnees(this.listePeriodes);
				this.Instances[this.identTripleCombo].setSelectionParElement(
					GEtatUtilisateur.getPeriode(),
					0,
				);
			} else {
				this.Instances[this.identTripleCombo].setVisible(false);
				this.evenementAfficherMessage(this.genreMessage);
				this.IdPremierElement = this.idMessageActionRequise;
			}
		}
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
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			visibiliteAR: function () {
				const lResponsableAR = aInstance._getResponsableAccuseReception();
				return (
					!aInstance.avecMessage &&
					aInstance.avecGestionAccuseReception &&
					!!lResponsableAR
				);
			},
			cbAccuseReception: {
				getValue: function () {
					const lResponsableAR = aInstance._getResponsableAccuseReception();
					return !!lResponsableAR ? lResponsableAR.aPrisConnaissance : false;
				},
				setValue: function (aValue) {
					const lResponsableAR = aInstance._getResponsableAccuseReception();
					if (!!lResponsableAR) {
						lResponsableAR.aPrisConnaissance = aValue;
						aInstance.moteur.saisieAR({ periode: aInstance.getPeriode() });
					}
				},
				getDisabled: function () {
					const lResponsableAR = aInstance._getResponsableAccuseReception();
					return !!lResponsableAR ? lResponsableAR.aPrisConnaissance : true;
				},
			},
		});
	}
}
module.exports = InterfaceReleveDeNotes;
