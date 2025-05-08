const { InterfacePage_Mobile } = require("InterfacePage_Mobile.js");
const { ObjetSelection } = require("ObjetSelection.js");
const ObjetRequetePageNotes = require("ObjetRequetePageNotes.js");
const PageNotes_Devoirs = require("PageNotes_Devoirs.js");
const { ObjetRequeteSaisieNotes } = require("ObjetRequeteSaisieNotes.js");
const {
	ObjetRequeteSaisieNotesUnitaire,
} = require("ObjetRequeteSaisieNotesUnitaire.js");
const { MoteurSelectionContexte } = require("MoteurSelectionContexte.js");
const { MoteurNotes } = require("MoteurNotes.js");
const { MoteurNotesCP } = require("MoteurNotesCP.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreMessage } = require("Enumere_Message.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
class InterfacePageNotesMobile extends InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.selectionContexte = [];
		this.moteurSelectionContexte = new MoteurSelectionContexte();
		this.moteurNotes = new MoteurNotes();
		this.moteurNotesCP = new MoteurNotesCP(this.moteurNotes);
		this.donnees = { service: null, listeEleves: null, moyGenerales: {} };
	}
	construireInstances() {
		this.identComboClasse = this.add(
			ObjetSelection,
			_evntSelecteur.bind(this, {
				genreSelecteur: EGenreRessource.Classe,
				genreSelecteurSuivant: EGenreRessource.Periode,
				estDernierSelecteur: false,
			}),
			_initSelecteur.bind(this, EGenreMessage.SelectionClasse),
		);
		this.identComboPeriode = this.add(
			ObjetSelection,
			_evntSelecteur.bind(this, {
				genreSelecteur: EGenreRessource.Periode,
				genreSelecteurSuivant: EGenreRessource.Service,
				estDernierSelecteur: false,
			}),
			_initSelecteur.bind(this, EGenreMessage.SelectionPeriode),
		);
		this.identComboService = this.add(
			ObjetSelection,
			_evntSelecteur.bind(this, {
				genreSelecteur: EGenreRessource.Service,
				genreSelecteurSuivant: null,
				estDernierSelecteur: true,
			}),
			_initSelecteur.bind(this, EGenreMessage.SelectionService),
		);
		this.identPage = this.add(
			PageNotes_Devoirs,
			_surEvenementPageDevoirs.bind(this),
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
			clbck: function (aParam) {
				this.moteurSelectionContexte.remplirSelecteur(
					$.extend({}, aParam, {
						instance: this.getInstance(this.identComboClasse),
						genreRessource: EGenreRessource.Classe,
						pere: this,
						clbck: this.afficherMessage.bind(this),
					}),
				);
			}.bind(this),
		});
	}
	valider(aParam) {
		const lListeSujetsEtCorriges = new ObjetListeElements();
		lListeSujetsEtCorriges.add(this.donnees.listeSujets);
		lListeSujetsEtCorriges.add(this.donnees.listeCorriges);
		const lListeCloud = lListeSujetsEtCorriges.getListeElements((aElement) => {
			return aElement.getGenre() === EGenreDocumentJoint.Cloud;
		});
		new ObjetRequeteSaisieNotes(
			this,
			this.actionSurValidation.bind(this, aParam),
		)
			.addUpload({
				listeFichiers: lListeSujetsEtCorriges,
				listeDJCloud: lListeCloud,
			})
			.lancerRequete({
				periode: this.selectionContexte[EGenreRessource.Periode],
				service: this.donnees.service,
				listeEleves: this.donnees.listeEleves,
				listeDevoirs: this.donnees.listeDevoirs,
				listeSujetsEtCorriges: lListeSujetsEtCorriges,
			});
	}
	validerUnitaire(aParam) {
		if (!GApplication.droits.get(TypeDroits.estEnConsultation)) {
			aParam.periode = this.selectionContexte[EGenreRessource.Periode];
			aParam.service = this.donnees.service;
			new ObjetRequeteSaisieNotesUnitaire(this, null).lancerRequete(aParam);
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
		_recupererDonnees.call(this, {
			numDevoirSelection: lNumeroDevoirSelection,
		});
	}
}
function _recupererDonnees(aParam) {
	const lClasse = this.selectionContexte[EGenreRessource.Classe];
	const lService = this.selectionContexte[EGenreRessource.Service];
	const lPeriode = this.selectionContexte[EGenreRessource.Periode];
	if (
		lClasse !== null &&
		lClasse !== undefined &&
		lService !== null &&
		lService !== undefined &&
		lPeriode !== null &&
		lPeriode !== undefined
	) {
		new ObjetRequetePageNotes(
			this,
			_actionSurRecupererDonnees.bind(this, aParam),
		).lancerRequete({
			numeroRessource: lClasse.getNumero(),
			genreRessource: lClasse.getGenre(),
			numeroService: lService.getNumero(),
			periode: lPeriode,
		});
	}
}
function _actionSurRecupererDonnees(aBind, aParam) {
	if (!!aParam.listeEleves) {
		this.donnees.listeEleves = aParam.listeEleves;
		this.donnees.listeDevoirs = aParam.listeDevoirs;
		this.donnees.service = aParam.Service;
		this.moteurNotesCP.controlerElevesDansDevoir({
			listeEleves: this.donnees.listeEleves,
			listeDevoirs: this.donnees.listeDevoirs,
			clbckEleveDansDevoir: this.moteurNotes.eleveDansDevoir,
		});
		const lPeriode = this.selectionContexte[EGenreRessource.Periode];
		this.donnees.listeClasses = aParam.listeClasses;
		this.donnees.baremeParDefaut = aParam.baremeParDefaut;
		_calculerMoyennes.call(this, {});
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
			classe: this.selectionContexte[EGenreRessource.Classe],
			listeClasses: aParam.listeClasses,
			baremeParDefaut: aParam.baremeParDefaut,
			listeSujets: aParam.listeSujets,
			listeCorriges: aParam.listeCorriges,
			strInfoCloture: aParam.strInfoCloture || "",
			selectionDevoir: lSelection,
		});
	}
}
function _calculerMoyennes(aParam) {
	const lPeriode = this.selectionContexte[EGenreRessource.Periode];
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
function _initSelecteur(aGenreMessage, aInstance) {
	aInstance.setParametres({
		avecBoutonsPrecedentSuivant: false,
		optionsCombo: {
			labelWAICellule: GTraductions.getValeur("Message")[aGenreMessage],
		},
	});
}
function _evntSelecteur(aContexte, aParam) {
	this.selectionContexte[aContexte.genreSelecteur] = aParam.element;
	if (aContexte.estDernierSelecteur === true) {
		_recupererDonnees.call(this);
	} else {
		if (aParam.element) {
			switch (aContexte.genreSelecteurSuivant) {
				case EGenreRessource.Periode:
					this.moteurSelectionContexte.getListePeriodes({
						classe: this.selectionContexte[EGenreRessource.Classe],
						pere: this,
						clbck: function (aParam) {
							this.moteurSelectionContexte.remplirSelecteur(
								$.extend({}, aParam, {
									instance: this.getInstance(this.identComboPeriode),
									genreRessource: aContexte.genreSelecteurSuivant,
									pere: this,
									clbck: this.afficherMessage.bind(this),
								}),
							);
						}.bind(this),
					});
					break;
				case EGenreRessource.Service:
					this.moteurSelectionContexte.getListeServices({
						utilisateur: GEtatUtilisateur.getUtilisateur(),
						classe: this.selectionContexte[EGenreRessource.Classe],
						periode: this.selectionContexte[EGenreRessource.Periode],
						pere: this,
						clbck: function (aParam) {
							this.moteurSelectionContexte.remplirSelecteur(
								$.extend({}, aParam, {
									instance: this.getInstance(this.identComboService),
									genreRessource: aContexte.genreSelecteurSuivant,
									pere: this,
									clbck: this.afficherMessage.bind(this),
								}),
							);
						}.bind(this),
					});
					break;
			}
		}
	}
}
function _surEvenementPageDevoirs(aParam) {
	if (GApplication.droits.get(TypeDroits.estEnConsultation)) {
		this.setEtatSaisie(true);
	}
	switch (aParam.genreEvnt) {
		case PageNotes_Devoirs.genreEvnt.valider:
			if (aParam.validationAuto === true) {
				this.valider(aParam);
			}
			break;
		case PageNotes_Devoirs.genreEvnt.validerUnitaire:
			this.validerUnitaire(aParam);
			break;
		case PageNotes_Devoirs.genreEvnt.majMoyennes:
			_calculerMoyennes.call(this, {
				listeElevesSelection:
					aParam && aParam.eleve
						? new ObjetListeElements().addElement(aParam.eleve)
						: null,
				listeDevoirsSelection:
					aParam && aParam.devoir
						? new ObjetListeElements().addElement(aParam.devoir)
						: null,
			});
			break;
	}
}
module.exports = InterfacePageNotesMobile;
