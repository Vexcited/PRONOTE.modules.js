const { MethodesObjet } = require("MethodesObjet.js");
const {
	InterfaceFicheStageCP_Mobile,
} = require("InterfaceFicheStageCP_Mobile.js");
const { PageFicheStage_Mobile } = require("PageFicheStage_Mobile.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { ControleSaisieEvenement } = require("ControleSaisieEvenement.js");
const { GHtml } = require("ObjetHtml.js");
const { PageSuiviStage_Mobile } = require("PageSuiviStage_Mobile.js");
const {
	EGenreAffichageFicheStage,
	EGenreAffichageFicheStageUtil,
} = require("Enumere_AffichageFicheStage.js");
const {
	ObjetRequetePageStageGeneral,
} = require("ObjetRequetePageStageGeneral.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
	ObjetRequetePageAppreciationFinDeStage,
} = require("ObjetRequetePageAppreciationFinDeStage.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetSelection } = require("ObjetSelection.js");
const { MoteurSelectionContexte } = require("MoteurSelectionContexte.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
class InterfaceFicheStage_Mobile extends InterfaceFicheStageCP_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.moteurSelectionContexte = new MoteurSelectionContexte();
		this.parametres = {
			avecEdition: false,
			avecEditionSuivisDeStage: false,
			avecSelectionEleve:
				GEtatUtilisateur.GenreEspace === EGenreEspace.Mobile_Professeur,
			tailleMaxPieceJointe: GApplication.droits.get(
				TypeDroits.tailleMaxDocJointEtablissement,
			),
		};
		const lOnglet = GEtatUtilisateur.listeOnglets.getElementParGenre(
			EGenreOnglet.SaisieAppreciationDeFinDeStage,
		);
		if (lOnglet) {
			this.infosNotificationStage = GEtatUtilisateur.getInfosSupp(
				lOnglet.getLibelle(),
			);
		}
	}
	creerInstancePage() {
		return this.add(PageFicheStage_Mobile, this.surEvenementPageStage);
	}
	creerInstanceSuivi() {
		return this.add(PageSuiviStage_Mobile, _evtPageSuiviStage.bind(this));
	}
	construireInstances() {
		this.identComboClasse = this.add(
			ObjetSelection,
			_evntSelecteur.bind(this, {
				genreSelecteur: EGenreRessource.Classe,
				genreSelecteurSuivant: EGenreRessource.Eleve,
				estDernierSelecteur: false,
			}),
			_initSelecteur.bind(this, EGenreRessource.Classe),
		);
		this.identComboEleve = this.add(
			ObjetSelection,
			_evntSelecteur.bind(this, {
				genreSelecteur: EGenreRessource.Eleve,
				genreSelecteurSuivant: null,
				estDernierSelecteur: true,
			}),
			_initSelecteur.bind(this, EGenreRessource.Eleve),
		);
		super.construireInstances();
		const lOngletAnnexe = new ObjetElement(
			EGenreAffichageFicheStageUtil.getTraductionOnglet(
				EGenreAffichageFicheStage.Annexe,
			),
			null,
			EGenreAffichageFicheStage.Annexe,
		);
		this.listeTabs.add(lOngletAnnexe);
		const lOngletAppreciations = new ObjetElement(
			EGenreAffichageFicheStageUtil.getTraductionOnglet(
				EGenreAffichageFicheStage.Appreciations,
			),
			null,
			EGenreAffichageFicheStage.Appreciations,
		);
		this.listeTabs.add(lOngletAppreciations);
	}
	ajouterOngletSuivi(aOnglet) {
		this.listeTabs.add(aOnglet);
	}
	ajouterOngletEntreprise(aOnglet) {}
	evntCmbStage(aParams) {
		const lThis = this;
		const lStage = aParams.element;
		ControleSaisieEvenement(() => {
			if (
				lStage &&
				lStage.getNumero() &&
				(!lThis.stage || lStage.getNumero() !== lThis.stage.getNumero())
			) {
				lThis.stage = lStage;
				const lEleve = new ObjetElement(
					"",
					lThis.numeroEleve || GEtatUtilisateur.getMembre().getNumero(),
				);
				new ObjetRequetePageAppreciationFinDeStage(
					lThis,
					_surReponse.bind(lThis),
				).lancerRequete({ eleve: lEleve, stage: lThis.stage });
			}
		});
	}
	eventModeAffStage(aParam) {
		if (aParam) {
			this.selectModeAffStage = aParam.getGenre();
			$("#" + GApplication.getIdConteneur()).scrollTop(0);
			this.getInstance(this.identPage).setDonnees({
				stage: this.stage,
				pj: this.listeDocJointsStage,
				genreOnglet: this.selectModeAffStage,
				evenements: this.listeEvenementsSuiviStage,
				lieux: this.listeLieuxSuiviStage,
				listeSujetsStage: this.listeSujetsStage,
			});
			$("#" + this.getInstance(this.identPageSuivi).getNom().escapeJQ()).hide();
		}
	}
	recupererDonnees() {
		this.setEtatSaisie(false);
		this.stage = undefined;
		switch (GEtatUtilisateur.GenreEspace) {
			case EGenreEspace.Mobile_Eleve:
			case EGenreEspace.Mobile_Parent:
				this.numeroEleve = GEtatUtilisateur.getMembre()
					? GEtatUtilisateur.getMembre().getNumero()
					: 0;
				new ObjetRequetePageStageGeneral(
					this,
					_surListeStage.bind(this),
				).lancerRequete(this.numeroEleve);
				break;
			case EGenreEspace.Mobile_Professeur:
				if (this.numeroClasse && this.numeroEleve) {
					new ObjetRequetePageStageGeneral(
						this,
						_surListeStage.bind(this),
					).lancerRequete(this.numeroEleve);
				} else {
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
				break;
			default:
				break;
		}
	}
	actualiser() {
		if (this.selectModeAffStage === undefined) {
			this.selectModeAffStage = EGenreAffichageFicheStage.Suivi;
			if (
				this.infosNotificationStage &&
				this.infosNotificationStage.genreAffichage !== undefined
			) {
				this.selectModeAffStage = this.infosNotificationStage.genreAffichage;
			}
			this.getInstance(this.identTabs).setDonnees(this.listeTabs);
		}
		this.getInstance(this.identTabs).selectOnglet(
			this.listeTabs.getIndiceParNumeroEtGenre(null, this.selectModeAffStage),
		);
	}
	afficherMessage(AMessage) {
		GHtml.setHtml(
			this.getInstance(this.identPage).getNom(),
			'<div class="Texte12 Gras AlignementMilieu"><br>' + AMessage + "</div>",
		);
	}
}
function _initSelecteur(aGenre, aInstance) {
	let lLabel = "";
	switch (aGenre) {
		case EGenreRessource.Classe:
			lLabel = GTraductions.getValeur("WAI.ListeSelectionClasse");
			break;
		case EGenreRessource.Eleve:
			lLabel = GTraductions.getValeur("WAI.ListeSelectionEleve");
			break;
	}
	aInstance.setParametres({
		avecBoutonsPrecedentSuivant: false,
		labelWAICellule: lLabel,
	});
}
function _evntSelecteur(aContexte, aParam) {
	if (!aContexte.estDernierSelecteur) {
		this.numeroClasse = !!aParam.element ? aParam.element.getNumero() : 0;
		this.moteurSelectionContexte.getListeEleves({
			classe: aParam.element,
			pere: this,
			clbck: function (aParam) {
				this.moteurSelectionContexte.remplirSelecteur(
					$.extend({}, aParam, {
						instance: this.getInstance(this.identComboEleve),
						genreRessource: EGenreRessource.Eleve,
						pere: this,
						clbck: this.afficherMessage.bind(this),
					}),
				);
			}.bind(this),
		});
	} else {
		this.numeroEleve = !!aParam.element ? aParam.element.getNumero() : 0;
		this.recupererDonnees();
	}
}
function _evtPageSuiviStage(aParam) {
	if (!aParam) {
		$("#" + this.getInstance(this.identPage).getNom().escapeJQ()).show();
		$("#" + GApplication.idLigneBandeau.escapeJQ()).show();
		$("#" + this.getInstance(this.identPageSuivi).getNom().escapeJQ()).hide();
		this.recupererDonnees();
	} else if (aParam.suivi) {
		this.getInstance(this.identPageSuivi).setDonnees(
			aParam.suivi,
			aParam.stage,
			{
				evenements: this.listeEvenementsSuiviStage,
				lieux: this.listeLieuxSuiviStage,
			},
		);
	}
}
function _surReponse(aJSON) {
	this.stage = aJSON.stage;
	this.stage.numeroEleve = this.numeroEleve;
	GEtatUtilisateur.Navigation.setRessource(EGenreRessource.Stage, this.stage);
	this.parametres.avecEdition = this.stage.avecEditionAnnexe;
	this.parametres.avecEditionSuivisDeStage = this.stage.avecEdition;
	this.getInstance(this.identPage).setParametres({
		avecEdition: this.parametres.avecEdition,
		avecEditionDocumentsJoints: this.parametres.avecEdition,
		avecEditionSuivisDeStage: this.parametres.avecEditionSuivisDeStage,
		tailleMaxPieceJointe: this.parametres.tailleMaxPieceJointe,
	});
	this.getInstance(this.identPageSuivi).setParametres({
		avecEditionSuivisDeStage: this.parametres.avecEditionSuivisDeStage,
	});
	this.listePJSuivis = null;
	if (!!this.stage.suiviStage) {
		const lThis = this;
		this.stage.suiviStage.parcourir((aSuivi) => {
			if (lThis.listeEvenementsSuiviStage && !!aSuivi.evenement) {
				const lEvenementDeListeComplete =
					lThis.listeEvenementsSuiviStage.getElementParNumero(
						aSuivi.evenement.getNumero(),
					);
				if (!!lEvenementDeListeComplete) {
					aSuivi.evenement = lEvenementDeListeComplete;
				}
			}
			if (!!lThis.listeLieuxSuiviStage && !!aSuivi.lieu) {
				const lLieuDeListeComplete =
					lThis.listeLieuxSuiviStage.getElementParNumero(
						aSuivi.lieu.getNumero(),
					);
				if (!!lLieuDeListeComplete) {
					aSuivi.lieu = lLieuDeListeComplete;
				}
			}
		});
	}
	aJSON.listePJEleve.parcourir((aPieceJointe) => {
		aPieceJointe.actif = true;
		aPieceJointe.Genre = EGenreDocumentJoint.Fichier;
	});
	this.listeDocJointsStage = MethodesObjet.dupliquer(aJSON.listePJEleve);
	this.actualiser();
}
function _surListeStage(
	aListeStages,
	aListeEvenements,
	aListeLieux,
	aListeSujets,
) {
	this.listeEvenementsSuiviStage = aListeEvenements;
	this.listeLieuxSuiviStage = aListeLieux;
	this.listeSujetsStage = aListeSujets;
	const lListeStages = aListeStages;
	if (!!lListeStages && lListeStages.count() > 0) {
		let lIndice = 0;
		const lStageSelect = GEtatUtilisateur.Navigation.getRessource(
			EGenreRessource.Stage,
		);
		if (!!lStageSelect) {
			lIndice = lListeStages.getIndiceElementParFiltre((aElement) => {
				return aElement.getNumero() === lStageSelect.getNumero();
			});
		}
		lListeStages.parcourir((aStage) => {
			if (aStage.periode) {
				aStage.libelleHtmlTitre = `<div style="line-height: 1.25rem;white-space: normal;">${aStage.getLibelle()}</div><div style="line-height: 1.25rem;white-space: normal;">${aStage.periodeDebutFin}</div>`;
			}
		});
		this.getInstance(this.identCmbStage).setVisible(true);
		this.getInstance(this.identCmbStage).setDonnees(
			lListeStages,
			Math.max(lIndice, 0),
		);
	} else {
		this.getInstance(this.identCmbStage).setVisible(false);
		$("#" + this.getInstance(this.identPageSuivi).getNom().escapeJQ()).hide();
		this.afficherMessage(GTraductions.getValeur("FicheStage.msgAucunStage"));
	}
}
module.exports = InterfaceFicheStage_Mobile;
