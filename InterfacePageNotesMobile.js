exports.InterfacePageNotesMobile = void 0;
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const ObjetSelection_1 = require("ObjetSelection");
const ObjetRequetePageNotes_1 = require("ObjetRequetePageNotes");
const PageNotes_Devoirs_1 = require("PageNotes_Devoirs");
const ObjetRequeteSaisieNotes_1 = require("ObjetRequeteSaisieNotes");
const ObjetRequeteSaisieNotesUnitaire_1 = require("ObjetRequeteSaisieNotesUnitaire");
const MoteurSelectionContexte_1 = require("MoteurSelectionContexte");
const MoteurNotes_1 = require("MoteurNotes");
const MoteurNotesCP_1 = require("MoteurNotesCP");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_Message_1 = require("Enumere_Message");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const AccessApp_1 = require("AccessApp");
class InterfacePageNotesMobile extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	constructor() {
		super(...arguments);
		this.selectionContexte = [];
		this.moteurSelectionContexte =
			new MoteurSelectionContexte_1.MoteurSelectionContexte();
		this.moteurNotes = new MoteurNotes_1.MoteurNotes();
		this.moteurNotesCP = new MoteurNotesCP_1.MoteurNotesCP(this.moteurNotes);
		this.donnees = { service: null, listeEleves: null, moyGenerales: {} };
	}
	construireInstances() {
		this.identComboClasse = this.add(
			ObjetSelection_1.ObjetSelection,
			this._evntSelecteur.bind(this, {
				genreSelecteur: Enumere_Ressource_1.EGenreRessource.Classe,
				genreSelecteurSuivant: Enumere_Ressource_1.EGenreRessource.Periode,
				estDernierSelecteur: false,
			}),
			this._initSelecteur.bind(
				this,
				Enumere_Message_1.EGenreMessage.SelectionClasse,
			),
		);
		this.identComboPeriode = this.add(
			ObjetSelection_1.ObjetSelection,
			this._evntSelecteur.bind(this, {
				genreSelecteur: Enumere_Ressource_1.EGenreRessource.Periode,
				genreSelecteurSuivant: Enumere_Ressource_1.EGenreRessource.Service,
				estDernierSelecteur: false,
			}),
			this._initSelecteur.bind(
				this,
				Enumere_Message_1.EGenreMessage.SelectionPeriode,
			),
		);
		this.identComboService = this.add(
			ObjetSelection_1.ObjetSelection,
			this._evntSelecteur.bind(this, {
				genreSelecteur: Enumere_Ressource_1.EGenreRessource.Service,
				genreSelecteurSuivant: null,
				estDernierSelecteur: true,
			}),
			this._initSelecteur.bind(
				this,
				Enumere_Message_1.EGenreMessage.SelectionService,
			),
		);
		this.identPage = this.add(
			PageNotes_Devoirs_1.PageNotes_Devoirs,
			this._surEvenementPageDevoirs.bind(this),
		);
		this.getInstance(this.identPage).setControleur(this.controleur);
		this.AddSurZone = [
			this.identComboClasse,
			this.identComboPeriode,
			this.identComboService,
		];
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
	valider(aParam) {
		const lListeSujetsEtCorriges =
			new ObjetListeElements_1.ObjetListeElements();
		lListeSujetsEtCorriges.add(this.donnees.listeSujets);
		lListeSujetsEtCorriges.add(this.donnees.listeCorriges);
		const lListeCloud = lListeSujetsEtCorriges.getListeElements((aElement) => {
			return (
				aElement.getGenre() ===
				Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud
			);
		});
		new ObjetRequeteSaisieNotes_1.ObjetRequeteSaisieNotes(
			this,
			this.actionSurValidation.bind(this, aParam),
		)
			.addUpload({
				listeFichiers: lListeSujetsEtCorriges,
				listeDJCloud: lListeCloud,
			})
			.lancerRequete({
				periode:
					this.selectionContexte[Enumere_Ressource_1.EGenreRessource.Periode],
				service: this.donnees.service,
				listeEleves: this.donnees.listeEleves,
				listeDevoirs: this.donnees.listeDevoirs,
				listeSujetsEtCorriges: lListeSujetsEtCorriges,
			});
	}
	validerUnitaire(aParam) {
		if (
			!(0, AccessApp_1.getApp)().droits.get(
				ObjetDroitsPN_1.TypeDroits.estEnConsultation,
			)
		) {
			aParam.periode =
				this.selectionContexte[Enumere_Ressource_1.EGenreRessource.Periode];
			aParam.service = this.donnees.service;
			new ObjetRequeteSaisieNotesUnitaire_1.ObjetRequeteSaisieNotesUnitaire(
				this,
				null,
			).lancerRequete(aParam);
		}
	}
	actionSurValidation(aParam, aJSONReponseSaisie) {
		let lNumeroDevoirSelection;
		if (aParam !== null && aParam !== undefined && aParam.estCreation) {
			if (
				!!aJSONReponseSaisie &&
				!!aJSONReponseSaisie.listeDevoirsCrees &&
				aJSONReponseSaisie.listeDevoirsCrees.count() > 0
			) {
				const lDevoirCree =
					aJSONReponseSaisie.listeDevoirsCrees.getPremierElement();
				if (!!lDevoirCree) {
					lNumeroDevoirSelection = lDevoirCree.getNumero();
				}
			} else {
			}
		}
		this.setEtatSaisie(false);
		this._recupererDonnees({ numDevoirSelection: lNumeroDevoirSelection });
	}
	_recupererDonnees(aParam) {
		const lClasse =
			this.selectionContexte[Enumere_Ressource_1.EGenreRessource.Classe];
		const lService =
			this.selectionContexte[Enumere_Ressource_1.EGenreRessource.Service];
		const lPeriode =
			this.selectionContexte[Enumere_Ressource_1.EGenreRessource.Periode];
		if (
			lClasse !== null &&
			lClasse !== undefined &&
			lService !== null &&
			lService !== undefined &&
			lPeriode !== null &&
			lPeriode !== undefined
		) {
			new ObjetRequetePageNotes_1.ObjetRequetePageNotes(
				this,
				this._actionSurRecupererDonnees.bind(this, aParam),
			).lancerRequete({
				numeroRessource: lClasse.getNumero(),
				genreRessource: lClasse.getGenre(),
				numeroService: lService.getNumero(),
				periode: lPeriode,
			});
		}
	}
	_actionSurRecupererDonnees(aBind, aParam) {
		if (!!aParam.listeEleves) {
			this.donnees.listeEleves = aParam.listeEleves;
			this.donnees.listeDevoirs = aParam.listeDevoirs;
			this.donnees.service = aParam.Service;
			this.moteurNotesCP.controlerElevesDansDevoir({
				listeEleves: this.donnees.listeEleves,
				listeDevoirs: this.donnees.listeDevoirs,
				clbckEleveDansDevoir: this.moteurNotes.eleveDansDevoir,
			});
			const lPeriode =
				this.selectionContexte[Enumere_Ressource_1.EGenreRessource.Periode];
			this.donnees.listeClasses = aParam.listeClasses;
			this.donnees.baremeParDefaut = aParam.baremeParDefaut;
			this._calculerMoyennes({});
			this.donnees.listeSujets = aParam.listeSujets;
			this.donnees.listeCorriges = aParam.listeCorriges;
			let lSelection;
			if (
				aBind !== null &&
				aBind !== undefined &&
				aBind.numDevoirSelection !== null &&
				aBind.numDevoirSelection !== undefined
			) {
				lSelection = this.donnees.listeDevoirs.getElementParNumero(
					aBind.numDevoirSelection,
				);
			}
			this.getInstance(this.identPage).setDonnees({
				listeEleves: this.donnees.listeEleves,
				listeDevoirs: this.donnees.listeDevoirs,
				moyGenerales: this.donnees.moyGenerales,
				service: this.donnees.service,
				periode: lPeriode,
				classe:
					this.selectionContexte[Enumere_Ressource_1.EGenreRessource.Classe],
				listeClasses: aParam.listeClasses,
				baremeParDefaut: aParam.baremeParDefaut,
				listeSujets: aParam.listeSujets,
				listeCorriges: aParam.listeCorriges,
				strInfoCloture: aParam.strInfoCloture || "",
				selectionDevoir: lSelection,
			});
		}
	}
	_calculerMoyennes(aParam) {
		const lPeriode =
			this.selectionContexte[Enumere_Ressource_1.EGenreRessource.Periode];
		const lResult = this.moteurNotesCP.controlerDevoirs({
			listeDevoirs: this.donnees.listeDevoirs,
		});
		const lInfosPeriodes = this.moteurNotes.getInfosPeriodes(
			$.extend({}, lResult, { selection: lPeriode }),
		);
		const lTab = this.moteurNotesCP.calculerMoyennes(
			$.extend(
				{},
				{
					periode: lPeriode,
					infosPeriodes: lInfosPeriodes,
					listeClasses: this.donnees.listeClasses,
					baremeParDefaut: this.donnees.baremeParDefaut,
					forcerSansSousService: false,
					service: this.donnees.service,
					listeDevoirs: this.donnees.listeDevoirs,
					devoirDansPeriode: this.moteurNotes.devoirDansPeriode.bind(
						this.moteurNotes,
					),
					listeEleves: this.donnees.listeEleves,
					affichageAnciensEleves: false,
					eleveDansDevoir: this.moteurNotes.eleveDansDevoir.bind(
						this.moteurNotes,
					),
					avecTotalMoyNR: false,
				},
				{
					listeElevesSelection: aParam ? aParam.listeElevesSelection : null,
					listeDevoirsSelection: aParam ? aParam.listeDevoirsSelection : null,
				},
			),
		);
		this.donnees.moyGenerales.tabGenerales = lTab;
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
			if (aParam.element) {
				switch (aContexte.genreSelecteurSuivant) {
					case Enumere_Ressource_1.EGenreRessource.Periode:
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
						break;
					case Enumere_Ressource_1.EGenreRessource.Service:
						this.moteurSelectionContexte.getListeServices({
							utilisateur: GEtatUtilisateur.getUtilisateur(),
							classe:
								this.selectionContexte[
									Enumere_Ressource_1.EGenreRessource.Classe
								],
							periode:
								this.selectionContexte[
									Enumere_Ressource_1.EGenreRessource.Periode
								],
							pere: this,
							clbck: (aParam) => {
								this.moteurSelectionContexte.remplirSelecteur(
									$.extend({}, aParam, {
										instance: this.getInstance(this.identComboService),
										genreRessource: aContexte.genreSelecteurSuivant,
										pere: this,
										clbck: this.afficherMessage.bind(this),
									}),
								);
							},
						});
						break;
				}
			}
		}
	}
	_surEvenementPageDevoirs(aParam) {
		if (
			(0, AccessApp_1.getApp)().droits.get(
				ObjetDroitsPN_1.TypeDroits.estEnConsultation,
			)
		) {
			this.setEtatSaisie(true);
		}
		switch (aParam.genreEvnt) {
			case PageNotes_Devoirs_1.PageNotes_Devoirs.genreEvnt.valider:
				if (aParam.validationAuto === true) {
					this.valider(aParam);
				}
				break;
			case PageNotes_Devoirs_1.PageNotes_Devoirs.genreEvnt.validerUnitaire:
				this.validerUnitaire(aParam);
				break;
			case PageNotes_Devoirs_1.PageNotes_Devoirs.genreEvnt.majMoyennes:
				this._calculerMoyennes({
					listeElevesSelection:
						aParam && aParam.eleve
							? new ObjetListeElements_1.ObjetListeElements().addElement(
									aParam.eleve,
								)
							: null,
					listeDevoirsSelection:
						aParam && aParam.devoir
							? new ObjetListeElements_1.ObjetListeElements().addElement(
									aParam.devoir,
								)
							: null,
				});
				break;
		}
	}
}
exports.InterfacePageNotesMobile = InterfacePageNotesMobile;
