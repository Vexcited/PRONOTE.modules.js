exports.InterfaceFicheStage_Mobile = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const InterfaceFicheStageCP_Mobile_1 = require("InterfaceFicheStageCP_Mobile");
const PageFicheStage_Mobile_1 = require("PageFicheStage_Mobile");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const ObjetHtml_1 = require("ObjetHtml");
const PageSuiviStage_Mobile_1 = require("PageSuiviStage_Mobile");
const Enumere_AffichageFicheStage_1 = require("Enumere_AffichageFicheStage");
const ObjetRequetePageStageGeneral_1 = require("ObjetRequetePageStageGeneral");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetRequetePageAppreciationFinDeStage_1 = require("ObjetRequetePageAppreciationFinDeStage");
const ObjetElement_1 = require("ObjetElement");
const ObjetSelection_1 = require("ObjetSelection");
const MoteurSelectionContexte_1 = require("MoteurSelectionContexte");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const AccessApp_1 = require("AccessApp");
class InterfaceFicheStage_Mobile extends InterfaceFicheStageCP_Mobile_1.InterfaceFicheStageCP_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.moteurSelectionContexte =
			new MoteurSelectionContexte_1.MoteurSelectionContexte();
		this.parametres = {
			avecEdition: false,
			avecEditionSuivisDeStage: false,
			avecSelectionEleve: [
				Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
				Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
			].includes(GEtatUtilisateur.GenreEspace),
			tailleMaxPieceJointe: (0, AccessApp_1.getApp)().droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
			),
		};
		const lOnglet = GEtatUtilisateur.listeOnglets.getElementParGenre(
			Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationDeFinDeStage,
		);
		if (lOnglet) {
			this.infosNotificationStage = GEtatUtilisateur.getInfosSupp(
				lOnglet.getLibelle(),
			);
		}
	}
	creerInstancePage() {
		return this.add(
			PageFicheStage_Mobile_1.PageFicheStage_Mobile,
			this.surEvenementPageStage,
		);
	}
	creerInstanceSuivi() {
		return this.add(
			PageSuiviStage_Mobile_1.PageSuiviStage_Mobile,
			this.evtPageSuiviStage.bind(this),
		);
	}
	construireInstances() {
		this.identComboClasse = this.add(
			ObjetSelection_1.ObjetSelection,
			this.evntSelecteur.bind(this, {
				genreSelecteur: Enumere_Ressource_1.EGenreRessource.Classe,
				genreSelecteurSuivant: Enumere_Ressource_1.EGenreRessource.Eleve,
				estDernierSelecteur: false,
			}),
			_initSelecteur.bind(this, Enumere_Ressource_1.EGenreRessource.Classe),
		);
		this.identComboEleve = this.add(
			ObjetSelection_1.ObjetSelection,
			this.evntSelecteur.bind(this, {
				genreSelecteur: Enumere_Ressource_1.EGenreRessource.Eleve,
				genreSelecteurSuivant: null,
				estDernierSelecteur: true,
			}),
			_initSelecteur.bind(this, Enumere_Ressource_1.EGenreRessource.Eleve),
		);
		super.construireInstances();
		const lOngletAnnexe = new ObjetElement_1.ObjetElement(
			Enumere_AffichageFicheStage_1.EGenreAffichageFicheStageUtil.getTraductionOnglet(
				Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Annexe,
			),
			null,
			Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Annexe,
		);
		this.listeTabs.add(lOngletAnnexe);
		const lOngletAppreciations = new ObjetElement_1.ObjetElement(
			Enumere_AffichageFicheStage_1.EGenreAffichageFicheStageUtil.getTraductionOnglet(
				Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Appreciations,
			),
			null,
			Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Appreciations,
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
		(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
			if (
				lStage &&
				lStage.getNumero() &&
				(!lThis.stage || lStage.getNumero() !== lThis.stage.getNumero())
			) {
				lThis.stage = lStage;
				const lEleve = new ObjetElement_1.ObjetElement(
					"",
					lThis.numeroEleve || GEtatUtilisateur.getMembre().getNumero(),
				);
				new ObjetRequetePageAppreciationFinDeStage_1.ObjetRequetePageAppreciationFinDeStage(
					lThis,
					this.surReponse.bind(lThis),
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
			case Enumere_Espace_1.EGenreEspace.Mobile_Eleve:
			case Enumere_Espace_1.EGenreEspace.Mobile_Parent:
			case Enumere_Espace_1.EGenreEspace.Mobile_Entreprise:
				this.numeroEleve = GEtatUtilisateur.getMembre()
					? GEtatUtilisateur.getMembre().getNumero()
					: 0;
				new ObjetRequetePageStageGeneral_1.ObjetRequetePageStageGeneral(
					this,
					this.surListeStage.bind(this),
				).lancerRequete(this.numeroEleve);
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Professeur:
			case Enumere_Espace_1.EGenreEspace.Mobile_Etablissement:
				if (this.numeroClasse && this.numeroEleve) {
					new ObjetRequetePageStageGeneral_1.ObjetRequetePageStageGeneral(
						this,
						this.surListeStage.bind(this),
					).lancerRequete(
						this.numeroEleve,
						GEtatUtilisateur.GenreEspace ===
							Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
					);
				} else {
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
				break;
			default:
				break;
		}
	}
	actualiser() {
		if (this.selectModeAffStage === undefined) {
			this.selectModeAffStage =
				Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Suivi;
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
	afficherMessage(aMessage) {
		ObjetHtml_1.GHtml.setHtml(
			this.getInstance(this.identPage).getNom(),
			IE.jsx.str(
				"div",
				{ class: "Texte12 Gras AlignementMilieu" },
				IE.jsx.str("br", null),
				aMessage,
			),
		);
	}
	evntSelecteur(aContexte, aParam) {
		if (!aContexte.estDernierSelecteur) {
			this.numeroClasse = !!aParam.element ? aParam.element.getNumero() : 0;
			this.moteurSelectionContexte.getListeEleves({
				classe: aParam.element,
				pere: this,
				avecUniquementStagiaire: [
					Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
				].includes(GEtatUtilisateur.GenreEspace),
				clbck: (aParam) => {
					this.moteurSelectionContexte.remplirSelecteur(
						$.extend({}, aParam, {
							instance: this.getInstance(this.identComboEleve),
							genreRessource: Enumere_Ressource_1.EGenreRessource.Eleve,
							pere: this,
							clbck: this.afficherMessage.bind(this),
						}),
					);
				},
			});
		} else {
			this.numeroEleve = !!aParam.element ? aParam.element.getNumero() : 0;
			this.recupererDonnees();
		}
	}
	evtPageSuiviStage(aParam) {
		if (!aParam) {
			$("#" + this.getInstance(this.identPage).getNom().escapeJQ()).show();
			$("#" + (0, AccessApp_1.getApp)().idLigneBandeau.escapeJQ()).show();
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
	surReponse(aJSON) {
		this.stage = aJSON.stage;
		this.stage.numeroEleve = this.numeroEleve;
		GEtatUtilisateur.Navigation.setRessource(
			Enumere_Ressource_1.EGenreRessource.Stage,
			this.stage,
		);
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
			aPieceJointe.Actif = true;
			aPieceJointe.Genre = Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier;
		});
		this.listeDocJointsStage = MethodesObjet_1.MethodesObjet.dupliquer(
			aJSON.listePJEleve,
		);
		this.actualiser();
	}
	surListeStage(aListeStages, aListeEvenements, aListeLieux, aListeSujets) {
		this.listeEvenementsSuiviStage = aListeEvenements;
		this.listeLieuxSuiviStage = aListeLieux;
		this.listeSujetsStage = aListeSujets;
		const lListeStages = aListeStages;
		if (!!lListeStages && lListeStages.count() > 0) {
			let lIndice = 0;
			const lStageSelect = GEtatUtilisateur.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Stage,
			);
			if (!!lStageSelect) {
				lIndice = lListeStages.getIndiceElementParFiltre((aElement) => {
					return aElement.getNumero() === lStageSelect.getNumero();
				});
			}
			lListeStages.parcourir((aStage) => {
				if (aStage.periode) {
					aStage.libelleHtmlTitre = `<p>${aStage.getLibelle()}</p><p>${aStage.periodeDebutFin}</p>`;
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
			this.afficherMessage(
				ObjetTraduction_1.GTraductions.getValeur("FicheStage.msgAucunStage"),
			);
		}
	}
}
exports.InterfaceFicheStage_Mobile = InterfaceFicheStage_Mobile;
function _initSelecteur(aGenre, aInstance) {
	let lLabel = "";
	switch (aGenre) {
		case Enumere_Ressource_1.EGenreRessource.Classe:
			lLabel = ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionClasse",
			);
			break;
		case Enumere_Ressource_1.EGenreRessource.Eleve:
			lLabel = ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionEleve",
			);
			break;
	}
	aInstance.setParametres({
		avecBoutonsPrecedentSuivant: false,
		labelWAICellule: lLabel,
	});
}
