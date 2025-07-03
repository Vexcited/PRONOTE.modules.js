exports.InterfaceBulletinNotes_Consultation = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const _InterfaceBulletinNotes_1 = require("_InterfaceBulletinNotes");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_Espace_1 = require("Enumere_Espace");
const MultipleObjetDocumentsATelecharger = require("ObjetDocumentsATelecharger");
const ObjetListe_1 = require("ObjetListe");
const InterfacePiedBulletin_1 = require("InterfacePiedBulletin");
const Enumere_Message_1 = require("Enumere_Message");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const MultiObjetRequeteSaisieAccuseReceptionDocument = require("ObjetRequeteSaisieAccuseReceptionDocument");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const AccessApp_1 = require("AccessApp");
class InterfaceBulletinNotes_Consultation extends _InterfaceBulletinNotes_1._InterfaceBulletinNotes {
	constructor(aParams) {
		const lEtatUtil = (0, AccessApp_1.getApp)().getEtatUtilisateur();
		const lEstContexteBulletinDeClasse =
			lEtatUtil.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.ConseilDeClasse;
		const lParams = Object.assign(aParams, {
			params: {
				avecSaisie: false,
				avecInfosEleve: false,
				avecDocsATelecharger: lEstContexteBulletinDeClasse
					? false
					: [
							Enumere_Espace_1.EGenreEspace.Eleve,
							Enumere_Espace_1.EGenreEspace.Parent,
							Enumere_Espace_1.EGenreEspace.Accompagnant,
							Enumere_Espace_1.EGenreEspace.Tuteur,
						].includes(lEtatUtil.GenreEspace),
				avecGraphe: !lEstContexteBulletinDeClasse,
			},
		});
		super(lParams);
		this.avecGestionAccuseReception =
			[Enumere_Espace_1.EGenreEspace.Parent].includes(
				this.etatUtilScoEspace.GenreEspace,
			) &&
			this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionARBulletins,
			);
		this.estCtxBulletinClasse = lEstContexteBulletinDeClasse;
		this.genreMessage = this.estCtxBulletinClasse
			? Enumere_Message_1.EGenreMessage.AucunConseilPourEleve
			: Enumere_Message_1.EGenreMessage.AucunBulletinPourEleve;
	}
	recupererDonnees() {
		const lInstance = this.getInstance(this.identTripleCombo);
		if (lInstance) {
			this.listePeriodes = this.etatUtilScoEspace.getOngletListePeriodes();
			if (this.listePeriodes && this.listePeriodes.count()) {
				lInstance.setVisible(true);
				lInstance.setDonnees(this.listePeriodes);
				lInstance.setSelectionParElement(
					this.etatUtilScoEspace.getPeriode(),
					0,
				);
			} else {
				lInstance.setVisible(false);
				this.evenementAfficherMessage(this.genreMessage);
			}
		}
	}
	instancierCombos() {
		return this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this._evntSurCombo.bind(this),
			this._initCombo.bind(this),
		);
	}
	instancierBulletin() {
		return this.add(ObjetListe_1.ObjetListe, null, (aListe) => {
			aListe.setOptionsListe({
				ariaLabel: () => {
					var _a;
					return `${this.etatUtilScoEspace.getLibelleLongOnglet()} ${((_a = this.getPeriode()) === null || _a === void 0 ? void 0 : _a.getLibelle()) || ""}`.trim();
				},
			});
		});
	}
	instancierPiedBulletin() {
		return this.add(InterfacePiedBulletin_1.InterfacePiedBulletin);
	}
	instancierDocsATelecharger() {
		let lIndentDocsATelecharger = 0;
		if (MultipleObjetDocumentsATelecharger) {
			lIndentDocsATelecharger = this.add(
				MultipleObjetDocumentsATelecharger.ObjetDocumentsATelecharger,
			);
		}
		return lIndentDocsATelecharger;
	}
	afficherPage() {
		const lEstContexteEleve = !this.estCtxBulletinClasse;
		const lTypeCtxBull = this.moteurPdB.getContexteBulletin({
			estCtxEleve: lEstContexteEleve,
			typeReleveBulletin: TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes,
		});
		this.initPiedPage({ typeContexteBulletin: lTypeCtxBull });
		const lParam = { periode: this.getPeriode() };
		this.envoyerRequeteBulletin(lParam);
	}
	addSurZoneAccuseReception() {
		if (this.avecGestionAccuseReception && !this.estCtxBulletinClasse) {
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
							new MultiObjetRequeteSaisieAccuseReceptionDocument.ObjetRequeteSaisieAccuseReceptionDocument(
								this,
							).lancerRequete({
								periode: this.getPeriode(),
								aPrisConnaissance: aValue,
							});
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
						"BulletinEtReleve.JAiPrisConnaissanceDuBulletin",
					),
				),
			});
			return true;
		}
		return false;
	}
	_getResponsableAccuseReception() {
		let lReponsableAccuseReception = null;
		if (
			!!this.aCopier.listeAccusesReception &&
			this.aCopier.listeAccusesReception.count() > 0
		) {
			lReponsableAccuseReception =
				this.aCopier.listeAccusesReception.getPremierElement();
			if (!!lReponsableAccuseReception) {
			}
		}
		return lReponsableAccuseReception;
	}
	_initCombo(aInstance) {
		aInstance.setOptionsObjetSaisie({
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionPeriode",
			),
		});
	}
	_evntSurCombo(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.setPeriode(aParams.element);
			if (
				this.param.avecDocsATelecharger &&
				aParams.element &&
				aParams.element.estAnneesPrecedentes &&
				this.getInstance(this.identDocumentsATelecharger)
			) {
				ObjetHtml_1.GHtml.setDisplay(
					this.getInstance(this.identDocumentsATelecharger).getNom(),
					true,
				);
				ObjetHtml_1.GHtml.setDisplay(this.idBulletin, false);
				this.getInstance(this.identDocumentsATelecharger)
					.setOptions({ avecScroll: false })
					.setDonnees({ avecNotes: true });
				this.desactiverImpression();
			} else {
				if (
					this.param.avecDocsATelecharger &&
					this.getInstance(this.identDocumentsATelecharger)
				) {
					ObjetHtml_1.GHtml.setDisplay(
						this.getInstance(this.identDocumentsATelecharger).getNom(),
						false,
					);
				}
				ObjetHtml_1.GHtml.setDisplay(this.idBulletin, true);
				this.afficherPage();
			}
		}
	}
}
exports.InterfaceBulletinNotes_Consultation =
	InterfaceBulletinNotes_Consultation;
