exports.ObjetAffichagePageTrombi_Mobile = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const PageTrombi_1 = require("PageTrombi");
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Message_1 = require("Enumere_Message");
const ObjetRequeteTrombinoscope_1 = require("ObjetRequeteTrombinoscope");
const MoteurSelectionContexte_1 = require("MoteurSelectionContexte");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetSelection_1 = require("ObjetSelection");
const AccessApp_1 = require("AccessApp");
class ObjetAffichagePageTrombi_Mobile extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	constructor() {
		super(...arguments);
		this.appplicationSco = (0, AccessApp_1.getApp)();
		this.selectionContexte = [];
		this.moteurSelectionContexte =
			new MoteurSelectionContexte_1.MoteurSelectionContexte();
	}
	construireInstances() {
		this.identPage = this.add(PageTrombi_1.PageTrombi);
		this.avecPeriode = this.appplicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionPeriodeNotation,
		);
		this.identComboClasse = this.add(
			ObjetSelection_1.ObjetSelection,
			this._evntSelecteur.bind(this, {
				genreSelecteur: Enumere_Ressource_1.EGenreRessource.Classe,
				genreSelecteurSuivant: Enumere_Ressource_1.EGenreRessource.Periode,
				estDernierSelecteur: !this.avecPeriode,
			}),
			this._initSelecteur.bind(
				this,
				Enumere_Message_1.EGenreMessage.SelectionClasse,
			),
		);
		this.AddSurZone = [this.identComboClasse];
		if (this.avecPeriode) {
			this.identComboPeriode = this.add(
				ObjetSelection_1.ObjetSelection,
				this._evntSelecteur.bind(this, {
					genreSelecteur: Enumere_Ressource_1.EGenreRessource.Periode,
					estDernierSelecteur: true,
				}),
				this._initSelecteur.bind(
					this,
					Enumere_Message_1.EGenreMessage.SelectionPeriode,
				),
			);
			this.AddSurZone.push(this.identComboPeriode);
		}
	}
	recupererDonnees() {
		this.moteurSelectionContexte.getListeClasses({
			pere: this,
			clbck: (aParam) => {
				this.moteurSelectionContexte.remplirSelecteur(
					$.extend({}, aParam, {
						instance: this.getInstance(this.identComboClasse),
						genreRessource: Enumere_Ressource_1.EGenreRessource.Classe,
						pere: this,
						clbck: this.afficherMessage.bind(this),
					}),
				);
			},
		});
	}
	_actionSurRecupererPhotos(aDonnees) {
		this.getInstance(this.identPage).setDonnees(aDonnees.ListeRessources, true);
		$("#" + this.getInstance(this.identPage).getNom().escapeJQ()).css(
			"height",
			"100%",
		);
	}
	_initSelecteur(aGenreMessage, aInstance) {
		aInstance.setParametres({
			avecBoutonsPrecedentSuivant: false,
			optionsCombo: {
				labelWAICellule:
					ObjetTraduction_1.GTraductions.getValeur("Message")[aGenreMessage],
			},
		});
	}
	_evntSelecteur(aContexte, aParam) {
		this.selectionContexte[aContexte.genreSelecteur] = aParam.element;
		if (aContexte.estDernierSelecteur === true) {
			this._recupererDonnees();
		} else {
			if (aParam.element && aParam.element.getNumero() !== -1) {
				switch (aContexte.genreSelecteurSuivant) {
					case Enumere_Ressource_1.EGenreRessource.Periode:
						if (this.identComboPeriode) {
							this.moteurSelectionContexte.getListePeriodes({
								classe:
									this.selectionContexte[
										Enumere_Ressource_1.EGenreRessource.Classe
									],
								pere: this,
								clbck: (aParam) => {
									this.moteurSelectionContexte.remplirSelecteur(
										$.extend({}, aParam, {
											instance: this.getInstance(this.identComboPeriode),
											genreRessource: aContexte.genreSelecteurSuivant,
											pere: this,
											clbck: this.afficherMessage.bind(this),
										}),
									);
								},
							});
						}
						break;
				}
			}
		}
	}
	_recupererDonnees() {
		const lClasse =
			this.selectionContexte[Enumere_Ressource_1.EGenreRessource.Classe];
		const lPeriode =
			this.selectionContexte[Enumere_Ressource_1.EGenreRessource.Periode];
		if (!!lClasse) {
			new ObjetRequeteTrombinoscope_1.ObjetRequeteTrombinoscope(
				this,
				this._actionSurRecupererPhotos.bind(this),
			).lancerRequete({ classe: lClasse, periode: lPeriode });
		} else {
			this.afficherMessage(
				ObjetTraduction_1.GTraductions.getValeur("Message")[
					Enumere_Message_1.EGenreMessage.AucuneClasseDisponible
				],
			);
		}
	}
}
exports.ObjetAffichagePageTrombi_Mobile = ObjetAffichagePageTrombi_Mobile;
