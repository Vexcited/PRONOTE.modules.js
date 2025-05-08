const { MethodesObjet } = require("MethodesObjet.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { ObjetInterfaceFicheStageCP } = require("InterfaceFicheStageCP.js");
const {
	DonneesListe_SelectionOngletStage,
} = require("InterfaceFicheStageCP.js");
const { ObjetFenetre_SuiviStage } = require("ObjetFenetre_SuiviStage.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ControleSaisieEvenement } = require("ControleSaisieEvenement.js");
const { ObjetElement } = require("ObjetElement.js");
const { tag } = require("tag.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const {
	ObjetRequetePageStageGeneral,
} = require("ObjetRequetePageStageGeneral.js");
const {
	ObjetRequetePageAppreciationFinDeStage,
} = require("ObjetRequetePageAppreciationFinDeStage.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const {
	ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { PageFicheStage } = require("PageFicheStage.js");
const ObjetRequeteSaisieAppreciationFinDeStage = require("ObjetRequeteSaisieAppreciationFinDeStage.js");
const {
	EGenreAffichageFicheStage,
	EGenreAffichageFicheStageUtil,
} = require("Enumere_AffichageFicheStage.js");
const {
	UtilitaireFicheEleve,
	UtilitairePhotoEleve,
} = require("UtilitaireRenseignementsEleve.js");
const { EGenreEvntMenusDeroulants } = require("Enumere_EvntMenusDeroulants.js");
const { ObjetListe } = require("ObjetListe.js");
class ObjetInterfaceFicheStage extends ObjetInterfaceFicheStageCP {
	constructor(...aParams) {
		super(...aParams);
		this.parametres = {
			avecEdition: false,
			avecEditionSuivisDeStage: false,
			tailleMaxPieceJointe: GApplication.droits.get(
				TypeDroits.tailleMaxDocJointEtablissement,
			),
		};
		this.genreOngletSelectionne = EGenreAffichageFicheStage.Suivi;
		const lOnglet = GEtatUtilisateur.listeOnglets.getElementParGenre(
			GEtatUtilisateur.getGenreOnglet(),
		);
		if (lOnglet) {
			this.infosNotificationStage = GEtatUtilisateur.getInfosSupp(
				lOnglet.getLibelle(),
			);
			if (
				this.infosNotificationStage &&
				this.infosNotificationStage.genreAffichage !== undefined
			) {
				this.genreOngletSelectionne =
					this.infosNotificationStage.genreAffichage;
			}
		}
		const lOngletSuivi = new ObjetElement(
			EGenreAffichageFicheStageUtil.getTraductionOnglet(
				EGenreAffichageFicheStage.Suivi,
			),
			null,
			EGenreAffichageFicheStage.Suivi,
		);
		lOngletSuivi.icone = "icon_th_list";
		const lOngletDetails = new ObjetElement(
			EGenreAffichageFicheStageUtil.getTraductionOnglet(
				EGenreAffichageFicheStage.Details,
			),
			null,
			EGenreAffichageFicheStage.Details,
		);
		lOngletDetails.icone = "icon_entreprise";
		const lOngletAnnexe = new ObjetElement(
			EGenreAffichageFicheStageUtil.getTraductionOnglet(
				EGenreAffichageFicheStage.Annexe,
			),
			null,
			EGenreAffichageFicheStage.Annexe,
		);
		lOngletAnnexe.icone = "icon_details_seance";
		const lOngletAppreciations = new ObjetElement(
			EGenreAffichageFicheStageUtil.getTraductionOnglet(
				EGenreAffichageFicheStage.Appreciations,
			),
			null,
			EGenreAffichageFicheStage.Appreciations,
		);
		lOngletAppreciations.icone = "icon_post_it_rempli";
		this.listeOnglets = new ObjetListeElements();
		this.listeOnglets.add(lOngletSuivi);
		this.listeOnglets.add(lOngletDetails);
		this.listeOnglets.add(lOngletAnnexe);
		this.listeOnglets.add(lOngletAppreciations);
		this.estBoutonsFicheEleveActif = false;
	}
	creerInstancePage() {
		return this.add(PageFicheStage, surEvenementPageStage.bind(this));
	}
	construireInstances() {
		super.construireInstances();
		if (
			[EGenreEspace.Professeur, EGenreEspace.Etablissement].includes(
				GEtatUtilisateur.GenreEspace,
			)
		) {
			this.IdentTripleCombo = this.add(
				ObjetAffichagePageAvecMenusDeroulants,
				this.evenementSurDernierMenuDeroulant,
				this.initialiserTripleCombo,
			);
			if (
				this.IdentTripleCombo !== null &&
				this.IdentTripleCombo !== undefined &&
				this.getInstance(this.IdentTripleCombo) !== null
			) {
				this.IdPremierElement = this.getInstance(
					this.IdentTripleCombo,
				).getPremierElement();
			}
		}
		if (GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur) {
			UtilitaireFicheEleve.construireInstances(this);
			UtilitairePhotoEleve.construireInstances(this);
		}
	}
	setParametresGeneraux() {
		super.setParametresGeneraux();
		if (GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur) {
			this.AddSurZone.push({ separateur: true });
			UtilitaireFicheEleve.addSurZone(this);
			UtilitairePhotoEleve.addSurZone(this);
		}
	}
	getControleur(aInstance) {
		const lControleur = $.extend(true, super.getControleur(aInstance));
		UtilitaireFicheEleve.ajoutControleur(aInstance, lControleur);
		UtilitairePhotoEleve.ajoutControleur(aInstance, lControleur);
		return lControleur;
	}
	eventModeAffStage(aParam) {
		this.genreOngletSelectionne = aParam.article.getGenre();
		this.getInstance(this.identPageStage).setDonnees({
			stage: this.stage,
			pj: this.listeDocJointsStage,
			genreOnglet: this.genreOngletSelectionne,
			evenements: this.listeEvenementsSuiviStage,
			lieux: this.listeLieuxSuiviStage,
			listeSujetsStage: this.listeSujetsStage,
			dateFinSaisieSuivi: this.dateFinSaisieSuivi,
		});
	}
	recupererDonnees() {
		this.setEtatSaisie(false);
		this.stage = undefined;
		switch (GEtatUtilisateur.GenreEspace) {
			case EGenreEspace.Entreprise:
			case EGenreEspace.Eleve:
			case EGenreEspace.Parent:
				this.numeroEleve = GEtatUtilisateur.getMembre()
					? GEtatUtilisateur.getMembre().getNumero()
					: 0;
				new ObjetRequetePageStageGeneral(
					this,
					_surListeStage.bind(this),
				).lancerRequete(this.numeroEleve);
				break;
			case EGenreEspace.Professeur:
			case EGenreEspace.Etablissement:
				if (this.numeroClasse && this.numeroEleve) {
					new ObjetRequetePageStageGeneral(
						this,
						_surListeStage.bind(this),
					).lancerRequete(this.numeroEleve);
				}
				break;
			default:
				break;
		}
	}
	valider() {
		const lListeFichiersUpload = new ObjetListeElements();
		if (!!this.listeDocJointsStage) {
			lListeFichiersUpload.add(this.listeDocJointsStage);
		}
		if (!!this.listePJSuivis) {
			lListeFichiersUpload.add(this.listePJSuivis);
		}
		new ObjetRequeteSaisieAppreciationFinDeStage(
			this,
			surEvenementPageStage.bind(this),
		)
			.addUpload({ listeFichiers: lListeFichiersUpload })
			.lancerRequete({
				numEleve: this.stage.numeroEleve,
				stage: this.stage,
				appreciations: this.stage.appreciations,
				listePJ: this.listePJ,
			});
	}
	initialiserTripleCombo(aInstance) {
		aInstance.setParametres(
			[EGenreRessource.Classe, EGenreRessource.Eleve],
			true,
		);
		aInstance.setEvenementMenusDeroulants(this.surEvntMenusDeroulants);
	}
	evenementSurDernierMenuDeroulant(aLigneClasse, aLignePeriode, aLigneEleve) {
		this.numeroClasse = !!aLigneClasse ? aLigneClasse.getNumero() : 0;
		this.numeroEleve = !!aLigneEleve ? aLigneEleve.getNumero() : 0;
		this.estBoutonsFicheEleveActif = true;
		_surSelectionEleve.call(this);
		this.recupererDonnees();
	}
	surEvntMenusDeroulants(aParam) {
		switch (aParam.genreEvenement) {
			case EGenreEvntMenusDeroulants.ressourceNonTrouve:
				this.estBoutonsFicheEleveActif = false;
				break;
		}
		if (aParam.genreCombo === EGenreRessource.Classe) {
			this.numeroEleve = 0;
			this.stage = undefined;
			this.getInstance(this.identCmbStage).setVisible(false);
			this.getInstance(this.identListeOnglet).setVisible(false);
			this.evenementAfficherMessage(
				this.getInstance(this.IdentTripleCombo).getMessageSelection(
					aParam.genreCombo,
				),
			);
		}
	}
	evntCmbStage(aParams) {
		if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
			const lThis = this;
			ControleSaisieEvenement(() => {
				if (
					aParams.element &&
					aParams.element.getNumero() &&
					(!lThis.stage ||
						aParams.element.getNumero() !== lThis.stage.getNumero())
				) {
					lThis.stage = aParams.element;
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
	}
}
function initialiserFenetreSuiviStage(aInstance) {
	aInstance.setParametresFenetreSuivi({
		libellePublication: GTraductions.getValeur(
			"FicheStage.listeSuivis.hintPublication",
		),
		maxSizeDocumentJoint: GApplication.droits.get(
			TypeDroits.tailleMaxDocJointEtablissement,
		),
	});
}
function surEvenementPageStage(aParam) {
	if (!aParam) {
		this.recupererDonnees();
	} else if (aParam.suivi) {
		const lListePJEleves = new ObjetListeElements();
		if (!!this.listePJSuivis) {
			lListePJEleves.add(this.listePJSuivis);
		}
		let lTitreFenetre = GTraductions.getValeur("FenetreSuiviStage.CreerSuivi");
		if (aParam.suivi.getEtat() !== EGenreEtat.Creation) {
			lTitreFenetre = GTraductions.getValeur("FenetreSuiviStage.ModifierSuivi");
		}
		ObjetFenetre_SuiviStage.ouvrir({
			pere: this,
			evenement: this.evenementFenetreSuiviStage,
			initialiser: initialiserFenetreSuiviStage,
			optionsFenetre: { titre: lTitreFenetre },
			donnees: {
				suivi: aParam.suivi,
				listeResponsables: this.stage.listeResponsables,
				respAdminCBFiltrage: this.stage.respAdminCBFiltrage,
				evenements: this.listeEvenementsSuiviStage,
				lieux: this.listeLieuxSuiviStage,
				listePJEleve: lListePJEleves,
			},
		});
	}
}
function _surReponse(aJSON) {
	this.stage = aJSON.stage;
	this.stage.numeroEleve = this.numeroEleve;
	GEtatUtilisateur.Navigation.setRessource(EGenreRessource.Stage, this.stage);
	this.parametres.avecEdition = this.stage.avecEditionAnnexe;
	this.parametres.avecEditionSuivisDeStage = this.stage.avecEdition;
	this.getInstance(this.identPageStage).setParametres({
		avecEdition: this.parametres.avecEdition,
		avecEditionDocumentsJoints: this.parametres.avecEdition,
		avecEditionSuivisDeStage: this.parametres.avecEditionSuivisDeStage,
		tailleMaxPieceJointe: this.parametres.tailleMaxPieceJointe,
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
		aPieceJointe.Genre = EGenreDocumentJoint.Fichier;
	});
	this.listeDocJointsStage = MethodesObjet.dupliquer(aJSON.listePJEleve);
	const lNiveauInterTitre = ObjetListe.typeInterTitre.h3;
	const lIndiceDernierElement = this.listeOnglets.count() - 1;
	const lDernierElementListe = this.listeOnglets.get(lIndiceDernierElement);
	if (
		!!lDernierElementListe &&
		lDernierElementListe.estInterTitre === lNiveauInterTitre
	) {
		this.listeOnglets.remove(lIndiceDernierElement);
	}
	let lElementConventionEtiquette;
	let lCpt = 0;
	let lNrMax = 3;
	if (!!this.stage.convention) {
		lNrMax = this.stage.convention.roles.count();
		this.stage.convention.roles.parcourir((aRole) => {
			if (aRole.aSignee) {
				lCpt++;
			}
		});
	} else {
		if (this.stage.conventionSigneeEleve) {
			lCpt++;
		}
		if (this.stage.conventionSigneeEntreprise) {
			lCpt++;
		}
		if (this.stage.conventionSigneeEtablissement) {
			lCpt++;
		}
	}
	if (lCpt > 0) {
		lElementConventionEtiquette = Object.assign(
			new ObjetElement(
				tag(
					"div",
					{ style: "display: flex;align-items: center;" },
					tag(
						"ie-chips",
						{ class: "tag-style chips-design-liste color-theme" },
						GTraductions.getValeur("FicheStage.conventionSignee") +
							" " +
							lCpt +
							"/" +
							lNrMax,
					) +
						tag("ie-btnicon", {
							class: "icon_question avecFond",
							"ie-model": "getInfoConvention",
							"aria-label": GTraductions.getValeur(
								"FicheStage.detailInfoSignatureConvention",
							),
						}),
				),
			),
			{ estInterTitre: lNiveauInterTitre },
		);
	} else {
		lElementConventionEtiquette = Object.assign(
			new ObjetElement(
				tag(
					"ie-chips",
					{ class: "tag-style chips-design-liste" },
					GTraductions.getValeur("FicheStage.conventionNonSignee"),
				),
			),
			{ estInterTitre: lNiveauInterTitre },
		);
	}
	this.listeOnglets.add(lElementConventionEtiquette);
	this.getInstance(this.identListeOnglet).setVisible(true);
	this.getInstance(this.identListeOnglet).setDonnees(
		new DonneesListe_SelectionOngletStage(this.listeOnglets, this.stage),
	);
	this.getInstance(this.identListeOnglet).selectionnerLigne({
		ligne: this.listeOnglets.getIndiceParElement(
			this.listeOnglets.getElementParGenre(this.genreOngletSelectionne),
		),
		avecEvenement: true,
	});
}
function _surListeStage(
	aListeStages,
	aListeEvenements,
	aListeLieux,
	aListeSujets,
	aDateFinSaisieSuivi,
) {
	this.listeEvenementsSuiviStage = aListeEvenements;
	this.listeLieuxSuiviStage = aListeLieux;
	this.listeSujetsStage = aListeSujets;
	this.dateFinSaisieSuivi = aDateFinSaisieSuivi;
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
				aStage.setLibelle(aStage.getLibelle() + " " + aStage.periodeDebutFin);
			}
		});
		this.getInstance(this.identCmbStage).setVisible(true);
		this.getInstance(this.identCmbStage).setDonnees(
			lListeStages,
			Math.max(lIndice, 0),
		);
	} else {
		this.getInstance(this.identCmbStage).setVisible(false);
		this.evenementAfficherMessage(
			GTraductions.getValeur("FicheStage.msgAucunStage"),
		);
	}
}
function _surSelectionEleve() {
	let lFenetre = this.getInstance(this.identFenetreFicheEleve);
	if (lFenetre && lFenetre.estAffiche()) {
		if (GEtatUtilisateur.estModeAccessible()) {
			lFenetre.fermer();
		} else {
			lFenetre.setDonnees(null, true);
		}
	}
	if (UtilitairePhotoEleve.estPhotoEleveAffiche.call(this)) {
		if (GEtatUtilisateur.estModeAccessible()) {
			UtilitairePhotoEleve.fermerPhotoEleve();
		} else {
			UtilitairePhotoEleve._afficherPhotoEleve.call(this, true);
		}
	}
}
module.exports = { ObjetInterfaceFicheStage };
