const { GHtml } = require("ObjetHtml.js");
const { _InterfaceBulletinNotes } = require("_InterfaceBulletinNotes.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const MultipleObjetDocumentsATelecharger = require("ObjetDocumentsATelecharger.js");
const { ObjetListe } = require("ObjetListe.js");
const { InterfacePiedBulletin } = require("InterfacePiedBulletin.js");
const { EGenreMessage } = require("Enumere_Message.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const ObjetRequeteSaisieAccuseReceptionDocument = require("ObjetRequeteSaisieAccuseReceptionDocument.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
class InterfaceBulletinNotes extends _InterfaceBulletinNotes {
	constructor(aNom, aIdent, aPere, aEvenement) {
		const lEstContexteBulletinDeClasse =
			GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.ConseilDeClasse;
		const lParam = {
			avecSaisie: false,
			avecInfosEleve: false,
			avecDocsATelecharger: lEstContexteBulletinDeClasse
				? false
				: [
						EGenreEspace.Eleve,
						EGenreEspace.Parent,
						EGenreEspace.Accompagnant,
						EGenreEspace.Tuteur,
					].includes(GEtatUtilisateur.GenreEspace),
			avecGraphe: !lEstContexteBulletinDeClasse,
		};
		super(aNom, aIdent, aPere, aEvenement, lParam);
		this.avecGestionAccuseReception =
			[EGenreEspace.Parent].includes(GEtatUtilisateur.GenreEspace) &&
			GApplication.droits.get(TypeDroits.fonctionnalites.gestionARBulletins);
		this.estCtxBulletinClasse = lEstContexteBulletinDeClasse;
		this.genreMessage = this.estCtxBulletinClasse
			? EGenreMessage.AucunConseilPourEleve
			: EGenreMessage.AucunBulletinPourEleve;
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
						new ObjetRequeteSaisieAccuseReceptionDocument(
							aInstance,
						).lancerRequete({
							periode: aInstance.getPeriode(),
							aPrisConnaissance: aValue,
						});
					}
				},
				getDisabled: function () {
					const lResponsableAR = aInstance._getResponsableAccuseReception();
					return !!lResponsableAR ? lResponsableAR.aPrisConnaissance : true;
				},
			},
		});
	}
	recupererDonnees() {
		const lInstance = this.getInstance(this.identTripleCombo);
		if (lInstance) {
			this.listePeriodes = GEtatUtilisateur.getOngletListePeriodes();
			if (this.listePeriodes && this.listePeriodes.count()) {
				lInstance.setVisible(true);
				lInstance.setDonnees(this.listePeriodes);
				lInstance.setSelectionParElement(GEtatUtilisateur.getPeriode(), 0);
			} else {
				lInstance.setVisible(false);
				this.evenementAfficherMessage(this.genreMessage);
			}
		}
	}
	instancierCombos() {
		return this.add(
			ObjetSaisiePN,
			_evntSurCombo.bind(this),
			_initCombo.bind(this),
		);
	}
	instancierBulletin() {
		return this.add(ObjetListe);
	}
	instancierPiedBulletin() {
		return this.add(InterfacePiedBulletin);
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
			typeReleveBulletin: TypeReleveBulletin.BulletinNotes,
		});
		this.initPiedPage({ typeContexteBulletin: lTypeCtxBull });
		const lParam = { periode: this.getPeriode() };
		this.envoyerRequeteBulletin(lParam);
	}
	addSurZoneAccuseReception() {
		if (this.avecGestionAccuseReception && !this.estCtxBulletinClasse) {
			this.AddSurZone.push({ separateur: true });
			this.AddSurZone.push({
				html:
					'<ie-checkbox class="AlignementMilieuVertical" ie-model="cbAccuseReception" ie-display="visibiliteAR">' +
					GTraductions.getValeur(
						"BulletinEtReleve.JAiPrisConnaissanceDuBulletin",
					) +
					"</ie-checkbox>",
			});
			return true;
		}
		return false;
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
function _initCombo(aInstance) {
	aInstance.setOptionsObjetSaisie({
		labelWAICellule: GTraductions.getValeur("WAI.ListeSelectionPeriode"),
	});
}
function _evntSurCombo(aParams) {
	if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
		this.setPeriode(aParams.element);
		if (
			this.param.avecDocsATelecharger &&
			aParams.element &&
			aParams.element.estAnneesPrecedentes &&
			this.getInstance(this.identDocumentsATelecharger)
		) {
			GHtml.setDisplay(
				this.getInstance(this.identDocumentsATelecharger).getNom(),
				true,
			);
			GHtml.setDisplay(this.idBulletin, false);
			this.getInstance(this.identDocumentsATelecharger)
				.setOptions({ avecScroll: false })
				.setDonnees({ avecNotes: true });
			this.desactiverImpression();
		} else {
			if (
				this.param.avecDocsATelecharger &&
				this.getInstance(this.identDocumentsATelecharger)
			) {
				GHtml.setDisplay(
					this.getInstance(this.identDocumentsATelecharger).getNom(),
					false,
				);
			}
			GHtml.setDisplay(this.idBulletin, true);
			this.afficherPage({ periode: aParams.element });
		}
	}
}
module.exports = InterfaceBulletinNotes;
