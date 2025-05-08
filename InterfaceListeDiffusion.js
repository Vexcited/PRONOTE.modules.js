const { TypeDroits } = require("ObjetDroitsPN.js");
const { GUID } = require("GUID.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { GCache } = require("Cache.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { DonneesListe_Diffusion } = require("DonneesListe_Diffusion.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const {
	EGenreRessource,
	EGenreRessourceUtil,
} = require("Enumere_Ressource.js");
const { InterfacePageCP } = require("ObjetInterfacePageCP.js");
const { ObjetDetailListeDiffusion } = require("ObjetDetailListeDiffusion.js");
const {
	ObjetRequeteSaisieListeDiffusion,
} = require("ObjetRequeteSaisieListeDiffusion.js");
const {
	TypeGenreReponseInternetActualite,
} = require("TypeGenreReponseInternetActualite.js");
const {
	getCumulPourFenetrePublic,
} = require("UtilitaireFenetreSelectionPublic.js");
const { ObjetFenetre_Message } = require("ObjetFenetre_Message.js");
const { ObjetRequeteListePublics } = require("ObjetRequeteListePublics.js");
const {
	TypeGenreCumulSelectionPublic,
} = require("ObjetFenetre_SelectionPublic.js");
const {
	ObjetFenetre_SelectionPublic_PN,
} = require("ObjetFenetre_SelectionPublic_PN.js");
const {
	ObjetRequeteDonneesEditionInformation,
} = require("ObjetRequeteDonneesEditionInformation.js");
const { ObjetRequeteListeDiffusion } = require("ObjetRequeteListeDiffusion.js");
const { UtilitaireMessagerie } = require("UtilitaireMessagerie.js");
const { tag } = require("tag.js");
const { EGenreCommandeMenu } = require("Enumere_CommandeMenu.js");
const { TypeEnsembleNombre } = require("TypeEnsembleNombre.js");
const {
	ObjetFenetre_EditionListeDiffusion,
} = require("ObjetFenetre_EditionListeDiffusion.js");
const {
	ObjetFenetre_EditionActualite,
} = require("ObjetFenetre_EditionActualite.js");
const { UtilitaireListePublics } = require("UtilitaireListePublics.js");
class InterfaceListeDiffusion extends InterfacePageCP {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsEcrans({ nbNiveaux: 2, avecBascule: IE.estMobile });
		this.contexte = {
			niveauCourant: 0,
			ecran: [
				InterfaceListeDiffusion.genreEcran.liste,
				InterfaceListeDiffusion.genreEcran.detail,
			],
			selection: [],
			guidRef: GUID.getId(),
		};
		this.donnees = new ObjetListeElements();
		this.avecValidationAuto = true;
		if (GEtatUtilisateur.pourPrimaire()) {
			this.genresRessources = [
				EGenreRessource.Responsable,
				EGenreRessource.Enseignant,
				EGenreRessource.Personnel,
			];
		} else if (GApplication.estEDT) {
			this.genresRessources = [
				EGenreRessource.Eleve,
				EGenreRessource.Responsable,
				EGenreRessource.Enseignant,
				EGenreRessource.Personnel,
			];
		} else {
			this.genresRessources = [
				EGenreRessource.Eleve,
				EGenreRessource.Responsable,
				EGenreRessource.MaitreDeStage,
				EGenreRessource.Enseignant,
				EGenreRessource.Personnel,
				EGenreRessource.InspecteurPedagogique,
			];
		}
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe,
			_evenementSurListe.bind(this),
			this.initialiserListe,
		);
		this.identDiffusion = this.add(
			ObjetDetailListeDiffusion,
			_evenementDetail.bind(this),
			_initialiserDetail.bind(this),
		);
		this.identFenetreSelectPublic = this.addFenetre(
			ObjetFenetre_SelectionPublic_PN,
			_evenementFenetreIndividu.bind(this),
		);
		this.idPremierObjet = this.getNomInstance(this.identListe);
	}
	setParametresGeneraux() {
		this.GenreStructure = EStructureAffichage.Autre;
		this.avecBandeau = true;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			btnRetourEcranPrec: {
				event: function () {
					this.revenirSurEcranPrecedent();
				}.bind(aInstance),
			},
		});
	}
	initialiserListe(aInstance) {
		const lInstance = this;
		const lListeBoutons = [];
		lListeBoutons.push({
			html: tag(
				"ie-checkbox",
				{ "ie-model": "cbMesListes" },
				GTraductions.getValeur("listeDiffusion.lesMiens"),
			),
			controleur: {
				cbMesListes: {
					getValue: function () {
						return GApplication.parametresUtilisateur.get(
							"listeDiffusion.uniquementMesListes",
						);
					},
					setValue: function (aValue) {
						_evenementSurCB.call(lInstance, aValue);
					},
				},
			},
		});
		aInstance.setOptionsListe({
			colonnes: [{ taille: "100%" }],
			skin: ObjetListe.skin.flatDesign,
			avecOmbreDroite: true,
			avecLigneCreation: true,
			titreCreation: GTraductions.getValeur("listeDiffusion.nouvelle"),
			iconeTitreCreation: "icon_plus_fin",
			boutons: lListeBoutons,
			nonEditableSurModeExclusif: true,
			messageContenuVide: GTraductions.getValeur("listeDiffusion.aucune"),
		});
	}
	construireStructureAffichageAutre() {
		return tag(
			"div",
			{ class: ["ifc_listediffusion"] },
			tag(
				"div",
				{
					id: this.getIdDeNiveau({ niveauEcran: 0 }),
					class: ["section_liste"],
				},
				tag("div", {
					id: this.getNomInstance(this.identListe),
					class: ["liste"],
				}),
			),
			tag(
				"div",
				{
					id: this.getIdDeNiveau({ niveauEcran: 1 }),
					class: ["section_detail"],
					style: this.optionsEcrans.avecBascule ? "display:none;" : "",
				},
				tag("div", {
					id: this.getNomInstance(this.identDiffusion),
					class: ["ObjetDetailListeDiffusion"],
				}),
			),
		);
	}
	recupererDonnees() {
		this.afficherPage();
	}
	afficherPage() {
		new ObjetRequeteListeDiffusion(
			this,
			_actionApresRequeteListeDiffusion,
		).lancerRequete();
	}
	construireEcran(aEcran) {
		switch (aEcran.genreEcran) {
			case InterfaceListeDiffusion.genreEcran.liste:
				if (this.optionsEcrans.avecBascule) {
					GEtatUtilisateur.listeDiffusion = undefined;
					this.setHtmlStructureAffichageBandeau("");
					this.getInstance(this.identListe).selectionnerLigne({
						deselectionnerTout: true,
					});
				}
				break;
			case InterfaceListeDiffusion.genreEcran.detail:
				if (this.optionsEcrans.avecBascule) {
					this.setHtmlStructureAffichageBandeau(
						this.construireBandeauEcran(
							this.getCtxSelection({ niveauEcran: 0 }),
						),
					);
				}
				this.getInstance(this.identDiffusion).setDonnees(
					this.listeSelectionnee,
				);
				break;
			default:
		}
	}
	construireBandeauEcran(aElement) {
		const lHtml = [];
		if (!!aElement) {
			lHtml.push(aElement.getLibelle());
		}
		return super.construireBandeauEcran(lHtml.join(""), {
			bgWhite: true,
			class: "text-center ie-titre",
		});
	}
	valider(aSansActionSurListeSelectionnee) {
		GEtatUtilisateur.indexlisteDiffusion = undefined;
		if (this.listeSelectionnee) {
			if (this.listeSelectionnee.getEtat() === EGenreEtat.Creation) {
				const lNrListeSelection = this.listeSelectionnee.getNumero();
				const lIndexSelection = this.donnees.getIndiceElementParFiltre(
					(aElement) => {
						return aElement.getNumero() === lNrListeSelection;
					},
				);
				GEtatUtilisateur.indexlisteDiffusion = lIndexSelection;
				GEtatUtilisateur.listeDiffusion = undefined;
			} else {
				GEtatUtilisateur.listeDiffusion =
					aSansActionSurListeSelectionnee && IE.estMobile
						? undefined
						: this.listeSelectionnee;
				this.donnees.addElement(
					this.listeSelectionnee,
					this.donnees.getIndiceParNumeroEtGenre(
						this.listeSelectionnee.getNumero(),
					),
				);
			}
		}
		new ObjetRequeteSaisieListeDiffusion(
			this,
			_surSaisieListeDiffusion.bind(this),
		).lancerRequete({ liste: this.donnees });
	}
}
InterfaceListeDiffusion.genreEcran = {
	liste: "liste-diffusion-liste",
	detail: "liste-diffusion-detail",
};
function _surSaisieListeDiffusion(aJSON) {
	if (aJSON.listeDiffusionCree) {
		this.listeSelectionnee = aJSON.listeDiffusionCree;
		GEtatUtilisateur.listeDiffusion = this.listeSelectionnee;
	}
	this.actionSurValidation();
}
function _evenementSurListe(aParametres) {
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.ApresErreurCreation:
			if (this.listeSelectionnee) {
				const lNrListeSelection = this.listeSelectionnee.getNumero();
				const lIndexSelection = this.donnees.getIndiceElementParFiltre(
					(aElement) => {
						return aElement.getNumero() === lNrListeSelection;
					},
				);
				if (lIndexSelection > -1) {
					this.getInstance(this.identListe).selectionnerLigne({
						ligne: lIndexSelection,
					});
				}
			}
			break;
		case EGenreEvenementListe.ApresSuppression:
			_viderSelection.call(this);
			break;
		case EGenreEvenementListe.Selection:
			this.listeSelectionnee = aParametres.article;
			if (this.listeSelectionnee) {
				GEtatUtilisateur.listeDiffusion = this.listeSelectionnee;
				if (!this.optionsEcrans.avecBascule) {
					GHtml.setHtml(
						this.idBandeauDroite + "_Texte",
						this.listeSelectionnee.getLibelle() +
							" - " +
							GTraductions.getValeur("listeDiffusion.compositionDeLaListe"),
					);
					this.getInstance(this.identDiffusion).setDonnees(
						this.listeSelectionnee,
					);
				} else {
					this.basculerEcran(
						{
							niveauEcran: 0,
							genreEcran: this.getCtxEcran({ niveauEcran: 0 }),
							dataEcran: this.listeSelectionnee,
						},
						{
							niveauEcran: 1,
							genreEcran: this.getCtxEcran({ niveauEcran: 1 }),
						},
					);
				}
			} else {
				_viderSelection.call(this);
			}
			break;
		case EGenreEvenementListe.Creation: {
			const lArticle = new ObjetElement("");
			lArticle.estPublique = false;
			lArticle.libelleAuteur = GTraductions.getValeur("listeDiffusion.moi");
			lArticle.triAuteur = "0";
			lArticle.estAuteur = true;
			lArticle.genresPublicEntite = new TypeEnsembleNombre();
			lArticle.listePublicEntite = new ObjetListeElements();
			lArticle.listePublicIndividu = new ObjetListeElements();
			ObjetFenetre_EditionListeDiffusion.ouvrir({
				instance: this,
				evenement: function (aGenreBouton, aParams) {
					if (aParams && aParams.bouton && aParams.bouton.valider) {
						aParams.element.setEtat(EGenreEtat.Creation);
						this.donnees.addElement(aParams.element);
						this.valider();
					}
				},
				donnees: { element: lArticle, liste: this.donnees },
			});
			break;
		}
	}
}
function _initialiserDetail(aInstance) {
	aInstance.setParametres({
		callbackAjoutRessource: _ouvrirFenetreSelectionRessourceDeGenre.bind(this),
		callbackSuppressionRessource: _surSuppressionRessource.bind(this),
		genresRessources: this.genresRessources,
	});
}
function _evenementDetail(aItemMenuContextuel) {
	if (aItemMenuContextuel.data) {
		this.listeSelectionnee = aItemMenuContextuel.data;
	}
	switch (aItemMenuContextuel.getNumero()) {
		case DonneesListe_Diffusion.genreAction.partager:
		case DonneesListe_Diffusion.genreAction.departager:
			this.valider();
			break;
		case DonneesListe_Diffusion.genreAction.renommer:
			ObjetFenetre_EditionListeDiffusion.ouvrir({
				instance: this,
				titre: GTraductions.getValeur("listeDiffusion.renommer"),
				evenement: function (aGenreBouton, aParams) {
					if (aParams && aParams.bouton && aParams.bouton.valider) {
						aParams.element.setEtat(EGenreEtat.Modification);
						this.listeSelectionnee = aParams.element;
						this.valider();
					}
				},
				donnees: { element: this.listeSelectionnee, liste: this.donnees },
			});
			break;
		case DonneesListe_Diffusion.genreAction.ajouterpublic:
			_ouvrirFenetreSelectionRessourceDeGenre.call(
				this,
				aItemMenuContextuel.genreRessource,
				aItemMenuContextuel.data,
			);
			break;
		default:
			break;
	}
}
function _evenementSurMenuContextuelListe(aItemMenuContextuel) {
	if (
		this.listeSelectionnee ||
		(aItemMenuContextuel && aItemMenuContextuel.data)
	) {
		this.listeSelectionnee = aItemMenuContextuel.data;
		switch (aItemMenuContextuel.getNumero()) {
			case DonneesListe_Diffusion.genreAction.diffuserInformation:
				_evenementFenetreEditionActu.call(
					this,
					TypeGenreReponseInternetActualite.AvecAR,
				);
				break;
			case DonneesListe_Diffusion.genreAction.effectuerSondage:
				_evenementFenetreEditionActu.call(
					this,
					TypeGenreReponseInternetActualite.ChoixUnique,
				);
				break;
			case DonneesListe_Diffusion.genreAction.demarrerDiscussion:
				ObjetFenetre_Message.creerFenetreDiscussion(
					this,
					_getDonneesFenetreEditionDiscussion.call(this),
				);
				break;
			case DonneesListe_Diffusion.genreAction.partager:
			case DonneesListe_Diffusion.genreAction.departager:
				this.valider(true);
				break;
			case DonneesListe_Diffusion.genreAction.renommer:
				ObjetFenetre_EditionListeDiffusion.ouvrir({
					instance: this,
					titre: GTraductions.getValeur("listeDiffusion.renommer"),
					evenement: function (aGenreBouton, aParams) {
						if (aParams && aParams.bouton && aParams.bouton.valider) {
							aParams.element.setEtat(EGenreEtat.Modification);
							this.listeSelectionnee = aParams.element;
							this.valider(true);
						}
					},
					donnees: { element: this.listeSelectionnee, liste: this.donnees },
				});
				break;
			case EGenreCommandeMenu.Suppression:
				this.valider();
				_viderSelection.call(this);
				break;
			default:
				break;
		}
	}
}
function _getDonneesFenetreEditionDiscussion() {
	const lDonnees = {};
	const lGenresRessources = [];
	[
		EGenreRessource.Eleve,
		EGenreRessource.Responsable,
		EGenreRessource.Enseignant,
		EGenreRessource.Personnel,
	].forEach((aGenre) => {
		lGenresRessources.push({
			genre: aGenre,
			getDisabled() {
				return !UtilitaireMessagerie.estGenreDestinataireAutorise(aGenre);
			},
			listeDestinataires: _getListeDonneesSelectionnees
				.call(this, aGenre)
				.getListeElements((aElement) => {
					return !aElement.refusMess;
				}),
		});
	});
	lDonnees.genresRessources = lGenresRessources;
	lDonnees.avecIndicationDiscussionInterdit = [
		EGenreEspace.Professeur,
		EGenreEspace.Etablissement,
	].includes(GEtatUtilisateur.GenreEspace);
	lDonnees.message = { objet: "", contenu: "" };
	return lDonnees;
}
function _evenementFenetreEditionActu(aGenreReponse) {
	const lFenetre = ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_EditionActualite,
		{
			pere: this,
			initialiser: function (aInstance) {
				aInstance.setOptionsFenetre({
					modale: true,
					titre:
						aGenreReponse === TypeGenreReponseInternetActualite.AvecAR
							? GTraductions.getValeur("actualites.creerInfo")
							: GTraductions.getValeur("actualites.creerSondage"),
					largeur: 750,
					hauteur: 700,
					listeBoutons: [
						GTraductions.getValeur("Annuler"),
						GTraductions.getValeur("Valider"),
					],
				});
			},
		},
	);
	lFenetre.setDonnees({
		donnee: null,
		creation: true,
		genreReponse: aGenreReponse,
		forcerAR: GApplication.droits.get(TypeDroits.fonctionnalites.forcerARInfos),
		listePublicDeListeDiffusion: this.listeSelectionnee.listePublicIndividu,
	});
}
function _viderSelection() {
	GHtml.setHtml(this.idBandeauDroite + "_Texte", "");
	this.getInstance(this.identDiffusion).setDonnees(undefined);
	GEtatUtilisateur.listeDiffusion = undefined;
	this.listeSelectionnee = undefined;
}
function _evntListePublic(aGenre, aRessource) {
	new ObjetRequeteListePublics(
		this,
		_evntListePublicApresRequete.bind(this, aRessource),
	).lancerRequete({
		genres: [aGenre],
		sansFiltreSurEleve: GApplication.droits.get(
			TypeDroits.communication.toutesClasses,
		),
		avecFonctionPersonnel: true,
	});
}
function _getListeDonneesSelectionnees(aGenre) {
	return this.listeSelectionnee.listePublicIndividu.getListeElements(
		(aElement) => {
			return aElement.getGenre() === aGenre;
		},
	);
}
function _evntListePublicApresRequete(aRessource, aDonnees) {
	_evntDeclencherFenetreRessource.bind(
		this,
		aRessource,
	)({
		listeComplet: aDonnees.listePublic,
		listeFamilles: aDonnees.listeFamilles,
		listeServicesPeriscolaire: aDonnees.listeServicesPeriscolaire,
		listeProjetsAcc: aDonnees.listeProjetsAcc,
		listeSelectionnee: _getListeDonneesSelectionnees.bind(this)(
			aDonnees.genres[0],
		),
		genre: aDonnees.genres[0],
		genreCumul: getCumulPourFenetrePublic(
			aDonnees.genres[0],
			aDonnees.checked,
			aDonnees.listePublic.count(),
		),
		listePartiel: this.listePartiel,
		listeNiveauxResponsabilite: aDonnees.listeNiveauxResponsabilite,
	});
}
function _ouvrirFenetreSelectionRessourceDeGenre(aGenre, aRessource) {
	_evntListePublic.call(this, aGenre, aRessource);
}
function _surSuppressionRessource(aInfosRessource) {
	if (this.listeSelectionnee) {
		let lElement;
		switch (aInfosRessource.genre) {
			case EGenreRessource.Eleve:
			case EGenreRessource.Responsable:
			case EGenreRessource.MaitreDeStage:
			case EGenreRessource.Enseignant:
			case EGenreRessource.Personnel:
			case EGenreRessource.InspecteurPedagogique:
				lElement =
					this.listeSelectionnee.listePublicIndividu.getElementParElement(
						aInfosRessource.ressource,
					);
				if (lElement) {
					lElement.setEtat(EGenreEtat.Suppression);
					this.listeSelectionnee.setEtat(EGenreEtat.Modification);
					this.getInstance(this.identDiffusion).actualiserAffichage(true);
				}
				break;
			default:
				break;
		}
	}
}
function _gererSelectionListes(
	aGenreRessource,
	aListeRessourcesSelectionnees,
	lListeActuelle,
) {
	const lCacheRessSelec = new Map();
	aListeRessourcesSelectionnees.parcourir((aElement, aIndice) => {
		if (aElement && aElement.existe()) {
			lCacheRessSelec.set(aElement.getCleHash(), { indice: aIndice });
		}
	});
	const lTabIndiceSupprListeSelec = [];
	lListeActuelle.parcourir((aElement) => {
		if (aElement.existe() && aElement.getGenre() === aGenreRessource) {
			const lCle = aElement.getCleHash();
			const lEltResSel = lCacheRessSelec.get(lCle);
			if (!lEltResSel) {
				aElement.setEtat(EGenreEtat.Suppression);
			} else {
				lTabIndiceSupprListeSelec.push(lEltResSel.indice);
				lCacheRessSelec.delete(lCle);
			}
		}
	});
	lTabIndiceSupprListeSelec.sort((a, b) => a - b);
	for (let i = lTabIndiceSupprListeSelec.length - 1; i >= 0; i--) {
		aListeRessourcesSelectionnees.remove(lTabIndiceSupprListeSelec[i]);
	}
	const lCacheRess = new Map();
	lListeActuelle.parcourir((aElement, aIndice) => {
		if (aElement && aElement.existe()) {
			lCacheRess.set(aElement.getCleHash(), true);
		}
	});
	aListeRessourcesSelectionnees.parcourir((aElement) => {
		if (aElement.existe() && aElement.getGenre() === aGenreRessource) {
			const lCle = aElement.getCleHash();
			if (lCacheRessSelec.has(lCle)) {
				const lElement = MethodesObjet.dupliquer(aElement);
				lElement.setEtat(EGenreEtat.Modification);
				lListeActuelle.addElement(lElement);
				lCacheRess.set(lCle, true);
			}
		}
	});
	lListeActuelle.trier();
	this.listeSelectionnee.setEtat(EGenreEtat.Modification);
	if (this.avecValidationAuto) {
		this.valider();
	} else {
		this.getInstance(this.identDiffusion).actualiserAffichage(true);
	}
}
function _evntDeclencherFenetreRessource(aRessource, aDonnees) {
	const lInstance = this.getInstance(this.identFenetreSelectPublic);
	if (
		aDonnees.genre === EGenreRessource.Eleve ||
		aDonnees.genre === EGenreRessource.Responsable
	) {
		const lListeCumuls = new ObjetListeElements();
		lListeCumuls.addElement(
			new ObjetElement(
				GTraductions.getValeur("actualites.Cumul.Classe"),
				0,
				TypeGenreCumulSelectionPublic.classe,
				0,
			),
		);
		lListeCumuls.addElement(
			new ObjetElement(
				GTraductions.getValeur("actualites.Cumul.Groupe"),
				0,
				TypeGenreCumulSelectionPublic.groupe,
				1,
			),
		);
		lListeCumuls.addElement(
			new ObjetElement(
				GTraductions.getValeur("actualites.Cumul.Alphabetique"),
				0,
				TypeGenreCumulSelectionPublic.initial,
				2,
			),
		);
		if (aDonnees.genre === EGenreRessource.Responsable) {
			lListeCumuls.addElement(
				new ObjetElement(
					GTraductions.getValeur("actualites.Cumul.NomDesEleves"),
					0,
					TypeGenreCumulSelectionPublic.nomEleves,
				),
			);
		}
		if (aDonnees.listeServicesPeriscolaire) {
			lListeCumuls.addElement(
				new ObjetElement(
					GTraductions.getValeur("actualites.Cumul.ServicesPeriscolaire"),
					0,
					TypeGenreCumulSelectionPublic.servicesPeriscolaire,
				),
			);
		}
		if (aDonnees.listeProjetsAcc) {
			lListeCumuls.addElement(
				new ObjetElement(
					GTraductions.getValeur("actualites.Cumul.ProjetsAccompagnement"),
					0,
					TypeGenreCumulSelectionPublic.projetsAccompagnement,
				),
			);
		}
		if (aDonnees.listeFamilles) {
			aDonnees.listeFamilles.parcourir((aFamille) => {
				const lFiltreFamille = new ObjetElement(
					aFamille.getLibelle(),
					0,
					TypeGenreCumulSelectionPublic.famille,
				);
				lFiltreFamille.famille = aFamille;
				lListeCumuls.addElement(lFiltreFamille);
			});
		}
		lInstance.setListeCumuls(lListeCumuls);
	}
	if (aDonnees.genre === EGenreRessource.Personnel) {
		const lListeCumuls = new ObjetListeElements();
		lListeCumuls.add(
			new ObjetElement(
				GTraductions.getValeur("Fenetre_SelectionPublic.Cumul.Aucun"),
				0,
				TypeGenreCumulSelectionPublic.sans,
				0,
			),
		);
		lListeCumuls.add(
			new ObjetElement(
				GTraductions.getValeur("actualites.Cumul.Fonction"),
				0,
				TypeGenreCumulSelectionPublic.fonction,
				1,
			),
		);
		lInstance.setListeCumuls(lListeCumuls);
		lInstance.setOptions({
			getInfosSuppZonePrincipale(aParams) {
				return lInstance.getGenreCumul() !==
					TypeGenreCumulSelectionPublic.fonction
					? UtilitaireMessagerie.getLibelleSuppListePublics(aParams.article)
					: "";
			},
		});
	}
	if (
		[
			EGenreRessource.Enseignant,
			EGenreRessource.Responsable,
			EGenreRessource.Eleve,
		].includes(aDonnees.genre)
	) {
		lInstance.setOptions({
			getInfosSuppZonePrincipale(aParams) {
				return UtilitaireListePublics.getLibelleSuppListePublics(
					aParams.article,
				);
			},
		});
	}
	if (aDonnees.genreCumul) {
		lInstance.setGenreCumulActif(aDonnees.genreCumul);
	}
	lInstance.setSelectionObligatoire(false);
	const lListePartiel = aDonnees.listePartiel;
	const lFiltres = [];
	if (lListePartiel && aDonnees.genre === EGenreRessource.Enseignant) {
		aDonnees.listeComplet.parcourir((aElement) => {
			const lNumero = aElement.getNumero();
			aElement.estMembreEquipe =
				lListePartiel.getIndiceElementParFiltre((aElement) => {
					return aElement.getNumero() === lNumero;
				}) > -1;
		});
		lFiltres.push({
			libelle: GTraductions.getValeur("actualites.filtre.equipePedagogique"),
			filtre: function (aElement, aChecked) {
				return aChecked ? aElement.estMembreEquipe : true;
			},
			checked: false,
		});
	}
	lInstance.setOptions({ filtres: lFiltres, avecCocheRessources: true });
	lInstance.setDonnees({
		listeRessources: aDonnees.listeComplet,
		listeRessourcesSelectionnees: MethodesObjet.dupliquer(
			aDonnees.listeSelectionnee,
		),
		genreRessource: aDonnees.genre,
		titre: EGenreRessourceUtil.getTitreFenetreSelectionRessource(
			aDonnees.genre,
		),
		estGenreRessourceDUtilisateurConnecte:
			EGenreRessourceUtil.correspondAuGenreUtilisateurEspaceCourant(
				aDonnees.genre,
			),
		listeNiveauxResponsabilite: aDonnees.listeNiveauxResponsabilite,
	});
}
function _evenementFenetreIndividu(
	aGenreRessource,
	aListeRessourcesSelectionnees,
	aNumeroBouton,
) {
	if (aGenreRessource === EGenreRessource.Eleve) {
		new ObjetRequeteDonneesEditionInformation(
			this,
			_evenementApresFenetreIndividu.bind(
				this,
				aGenreRessource,
				aListeRessourcesSelectionnees,
				aNumeroBouton,
			),
		).lancerRequete({
			avecPublic: true,
			listePublic: aListeRessourcesSelectionnees,
		});
	} else {
		_evenementApresFenetreIndividu.bind(this)(
			aGenreRessource,
			aListeRessourcesSelectionnees,
			aNumeroBouton,
		);
	}
}
function _evenementApresFenetreIndividu(
	aGenreRessource,
	aListeRessourcesSelectionnees,
	aNumeroBouton,
) {
	if (aNumeroBouton === 1) {
		const lListeActuelle = this.listeSelectionnee.listePublicIndividu;
		_gererSelectionListes.call(
			this,
			aGenreRessource,
			aListeRessourcesSelectionnees,
			lListeActuelle,
		);
	}
}
function _evenementSurCB(aValue) {
	const lValue = !!aValue;
	let lSelection = true;
	GApplication.parametresUtilisateur.set(
		"listeDiffusion.uniquementMesListes",
		lValue,
	);
	if (
		this.getInstance(this.identListe) &&
		this.getInstance(this.identListe).getDonneesListe()
	) {
		if (lValue && this.listeSelectionnee && !this.listeSelectionnee.estAuteur) {
			lSelection = false;
		}
		this.getInstance(this.identListe)
			.getDonneesListe()
			.setUniquementMesListes(lValue);
		this.getInstance(this.identListe).actualiser(lSelection, false);
	}
	if (!lSelection) {
		_viderSelection.call(this);
	}
}
function _actionApresRequeteListeDiffusion(aJSON) {
	if (aJSON && aJSON.liste) {
		this.donnees = aJSON.liste;
		if (GCache) {
			GCache.general.setDonnee("listeDiffusion", aJSON.liste);
			GCache.general.vider("listeDiffusion_messagerie");
		}
	}
	this.getInstance(this.identListe).setDonnees(
		new DonneesListe_Diffusion({
			donnees: this.donnees,
			evenementMenuContextuel: _evenementSurMenuContextuelListe.bind(this),
			uniquementMesListes: GApplication.parametresUtilisateur.get(
				"listeDiffusion.uniquementMesListes",
			),
		}),
	);
	let lIndexSelection = -1;
	if (GEtatUtilisateur.listeDiffusion) {
		const lNrListeSelection = GEtatUtilisateur.listeDiffusion.getNumero();
		lIndexSelection = this.donnees.getIndiceElementParFiltre((aElement) => {
			return aElement.getNumero() === lNrListeSelection;
		});
	} else if (GEtatUtilisateur.indexlisteDiffusion > -1) {
		lIndexSelection = GEtatUtilisateur.indexlisteDiffusion;
	}
	if (lIndexSelection > -1) {
		this.listeSelectionnee = this.donnees.get(lIndexSelection);
		GEtatUtilisateur.listeDiffusion = this.listeSelectionnee;
		if (this.listeSelectionnee) {
			GHtml.setHtml(
				this.idBandeauDroite + "_Texte",
				this.listeSelectionnee.getLibelle() +
					" - " +
					GTraductions.getValeur("listeDiffusion.compositionDeLaListe"),
			);
			this.getInstance(this.identListe).selectionnerLigne({
				ligne: lIndexSelection,
				avecEvenement: true,
			});
		}
	}
}
module.exports = { InterfaceListeDiffusion };
