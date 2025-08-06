exports.InterfaceReleveDeNotes_Consultation = void 0;
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetFenetreVisuEleveQCM_1 = require("ObjetFenetreVisuEleveQCM");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Message_1 = require("Enumere_Message");
const InterfacePiedBulletin_1 = require("InterfacePiedBulletin");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const _InterfaceReleveDeNotes_1 = require("_InterfaceReleveDeNotes");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
class InterfaceReleveDeNotes_Consultation extends _InterfaceReleveDeNotes_1._InterfaceReleveDeNotes {
	constructor(...aParams) {
		super(...aParams);
		this.genreMessage = Enumere_Message_1.EGenreMessage.AucunRelevePourEleve;
		this.initParams({
			avecSaisie: false,
			avecInfosEleve: false,
			avecCorrige: true,
		});
	}
	instancierCombos() {
		return this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.evenementSurCombo,
			this.initialiserCombo,
		);
	}
	instancierPiedBulletin() {
		return this.add(
			InterfacePiedBulletin_1.InterfacePiedBulletin,
			null,
			this._initPiedPage,
		);
	}
	instancierFenetreVisuEleveQCM() {
		return this.addFenetre(ObjetFenetreVisuEleveQCM_1.ObjetFenetreVisuEleveQCM);
	}
	initialiserBulletin(aListe) {
		aListe.setOptionsListe({
			ariaLabel: () => {
				var _a;
				return `${this.etatUtilScoEspace.getLibelleLongOnglet()} ${((_a = this.getPeriode()) === null || _a === void 0 ? void 0 : _a.getLibelle()) || ""}`.trim();
			},
		});
	}
	getEleve() {
		return this.etatUtilScoEspace.getMembre();
	}
	getClasseGroupe() {
		return undefined;
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.AddSurZone = [null, this.identTripleCombo];
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = true;
		this.addSurZoneAccuseReception();
	}
	addSurZoneAccuseReception() {
		if (this.avecGestionAccuseReception) {
			this.AddSurZone.push({ separateur: true });
			const lvisibiliteAR = () => {
				const lResponsableAR = this._getResponsableAccuseReception();
				return (
					!this.avecMessage &&
					this.avecGestionAccuseReception &&
					!!lResponsableAR
				);
			};
			const lcbAccuseReception = () => {
				return {
					getValue: () => {
						const lResponsableAR = this._getResponsableAccuseReception();
						return !!lResponsableAR ? lResponsableAR.aPrisConnaissance : false;
					},
					setValue: (aValue) => {
						const lResponsableAR = this._getResponsableAccuseReception();
						if (!!lResponsableAR) {
							lResponsableAR.aPrisConnaissance = aValue;
							this.moteur.saisieAR({ periode: this.getPeriode() });
						}
					},
					getDisabled: () => {
						const lResponsableAR = this._getResponsableAccuseReception();
						return !!lResponsableAR ? lResponsableAR.aPrisConnaissance : true;
					},
				};
			};
			this.AddSurZone.push({
				html: IE.jsx.str(
					"ie-checkbox",
					{
						class: "AlignementMilieuVertical",
						"ie-model": lcbAccuseReception,
						"ie-display": lvisibiliteAR,
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.JAiPrisConnaissanceDuReleve",
					),
				),
			});
			return true;
		}
		return false;
	}
	initialiserCombo(aInstance) {
		aInstance.setOptionsObjetSaisie({
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionPeriode",
			),
		});
	}
	evenementSurCombo(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
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
			libelleClasse: this.etatUtilScoEspace.Identification.getLibelleClasse(),
			numeroClasse: this.etatUtilScoEspace.Identification.getNumeroClasse(),
		});
	}
	recupererDonnees() {
		if (this.getInstance(this.identTripleCombo)) {
			this.IdPremierElement = this.getInstance(
				this.identTripleCombo,
			).getPremierElement();
			this.listePeriodes = this.etatUtilScoEspace.getOngletListePeriodes();
			if (this.listePeriodes && this.listePeriodes.count()) {
				this.getInstance(this.identTripleCombo).setVisible(true);
				this.getInstance(this.identTripleCombo).setDonnees(this.listePeriodes);
				this.getInstance(this.identTripleCombo).setSelectionParElement(
					this.etatUtilScoEspace.getPeriode(),
					0,
				);
			} else {
				this.getInstance(this.identTripleCombo).setVisible(false);
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
}
exports.InterfaceReleveDeNotes_Consultation =
	InterfaceReleveDeNotes_Consultation;
