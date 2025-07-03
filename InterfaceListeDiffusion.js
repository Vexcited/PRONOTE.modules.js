exports.InterfaceListeDiffusion = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const Cache_1 = require("Cache");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_Diffusion_1 = require("DonneesListe_Diffusion");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetInterfacePageCP_1 = require("ObjetInterfacePageCP");
const ObjetDetailListeDiffusion_1 = require("ObjetDetailListeDiffusion");
const ObjetRequeteSaisieListeDiffusion_1 = require("ObjetRequeteSaisieListeDiffusion");
const TypeGenreReponseInternetActualite_1 = require("TypeGenreReponseInternetActualite");
const UtilitaireFenetreSelectionPublic_1 = require("UtilitaireFenetreSelectionPublic");
const ObjetFenetre_Message_1 = require("ObjetFenetre_Message");
const ObjetRequeteListePublics_1 = require("ObjetRequeteListePublics");
const ObjetFenetre_SelectionPublic_1 = require("ObjetFenetre_SelectionPublic");
const ObjetFenetre_SelectionPublic_PN_1 = require("ObjetFenetre_SelectionPublic_PN");
const ObjetRequeteDonneesEditionInformation_1 = require("ObjetRequeteDonneesEditionInformation");
const ObjetRequeteListeDiffusion_1 = require("ObjetRequeteListeDiffusion");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const Enumere_CommandeMenu_1 = require("Enumere_CommandeMenu");
const ObjetFenetre_EditionListeDiffusion_1 = require("ObjetFenetre_EditionListeDiffusion");
const ObjetFenetre_EditionActualite_1 = require("ObjetFenetre_EditionActualite");
const UtilitaireListePublics_1 = require("UtilitaireListePublics");
const AccessApp_1 = require("AccessApp");
class InterfaceListeDiffusion extends ObjetInterfacePageCP_1.InterfacePageCP {
	constructor(...aParams) {
		super(...aParams);
		this.appSco = (0, AccessApp_1.getApp)();
		this.etatUtilSco = this.appSco.getEtatUtilisateur();
		this.setOptionsEcrans({ nbNiveaux: 2, avecBascule: IE.estMobile });
		this.contexte = {
			niveauCourant: 0,
			ecran: [
				InterfaceListeDiffusion.genreEcran.liste,
				InterfaceListeDiffusion.genreEcran.detail,
			],
			selection: [],
			guidRef: GUID_1.GUID.getId(),
		};
		this.donnees = new ObjetListeElements_1.ObjetListeElements();
		this.avecValidationAuto = true;
		if (this.etatUtilSco.pourPrimaire()) {
			this.genresRessources = [
				Enumere_Ressource_1.EGenreRessource.Responsable,
				Enumere_Ressource_1.EGenreRessource.Enseignant,
				Enumere_Ressource_1.EGenreRessource.Personnel,
			];
		} else if (this.appSco.estEDT) {
			this.genresRessources = [
				Enumere_Ressource_1.EGenreRessource.Eleve,
				Enumere_Ressource_1.EGenreRessource.Responsable,
				Enumere_Ressource_1.EGenreRessource.Enseignant,
				Enumere_Ressource_1.EGenreRessource.Personnel,
			];
		} else {
			this.genresRessources = [
				Enumere_Ressource_1.EGenreRessource.Eleve,
				Enumere_Ressource_1.EGenreRessource.Responsable,
				Enumere_Ressource_1.EGenreRessource.MaitreDeStage,
				Enumere_Ressource_1.EGenreRessource.Enseignant,
				Enumere_Ressource_1.EGenreRessource.Personnel,
				Enumere_Ressource_1.EGenreRessource.InspecteurPedagogique,
			];
		}
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListe.bind(this),
			this.initialiserListe,
		);
		this.identDiffusion = this.add(
			ObjetDetailListeDiffusion_1.ObjetDetailListeDiffusion,
			this._evenementDetail.bind(this),
			this._initialiserDetail.bind(this),
		);
		this.identFenetreSelectPublic = this.addFenetre(
			ObjetFenetre_SelectionPublic_PN_1.ObjetFenetre_SelectionPublic_PN,
			this._evenementFenetreIndividu.bind(this),
		);
		this.idPremierObjet = this.getNomInstance(this.identListe);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
	}
	initialiserListe(aInstance) {
		const lInstance = this;
		const lcbMesListes = () => {
			return {
				getValue: () => {
					return lInstance.appSco.parametresUtilisateur.get(
						"listeDiffusion.uniquementMesListes",
					);
				},
				setValue(aValue) {
					lInstance._evenementSurCB(aValue);
				},
			};
		};
		const lListeBoutons = [];
		lListeBoutons.push({
			getHtml: () =>
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": lcbMesListes },
					ObjetTraduction_1.GTraductions.getValeur("listeDiffusion.lesMiens"),
				),
		});
		aInstance.setOptionsListe({
			colonnes: [{ taille: "100%" }],
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecOmbreDroite: true,
			avecLigneCreation: true,
			titreCreation: ObjetTraduction_1.GTraductions.getValeur(
				"listeDiffusion.nouvelle",
			),
			iconeTitreCreation: "icon_plus_fin",
			boutons: lListeBoutons,
			nonEditableSurModeExclusif: true,
			messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
				"listeDiffusion.aucune",
			),
			ariaLabel: this.etatUtilSco.getLibelleLongOnglet(),
		});
	}
	construireStructureAffichageAutre() {
		return IE.jsx.str(
			"div",
			{ class: "ifc_listediffusion" },
			IE.jsx.str(
				"div",
				{ id: this.getIdDeNiveau({ niveauEcran: 0 }), class: "section_liste" },
				IE.jsx.str("div", {
					id: this.getNomInstance(this.identListe),
					class: "liste",
				}),
			),
			IE.jsx.str(
				"div",
				{
					id: this.getIdDeNiveau({ niveauEcran: 1 }),
					class: "section_detail",
					style: this.optionsEcrans.avecBascule ? "display:none;" : "",
				},
				IE.jsx.str("div", {
					id: this.getNomInstance(this.identDiffusion),
					class: "ObjetDetailListeDiffusion",
				}),
			),
		);
	}
	recupererDonnees() {
		this.afficherPage();
	}
	afficherPage() {
		new ObjetRequeteListeDiffusion_1.ObjetRequeteListeDiffusion(
			this,
			this._actionApresRequeteListeDiffusion,
		).lancerRequete();
	}
	construireEcran(aEcran) {
		switch (aEcran.genreEcran) {
			case InterfaceListeDiffusion.genreEcran.liste:
				if (this.optionsEcrans.avecBascule) {
					this.etatUtilSco.listeDiffusion = undefined;
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
		InterfaceListeDiffusion.indexlisteDiffusion = undefined;
		if (this.listeSelectionnee) {
			if (
				this.listeSelectionnee.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
			) {
				const lNrListeSelection = this.listeSelectionnee.getNumero();
				const lIndexSelection = this.donnees.getIndiceElementParFiltre(
					(aElement) => {
						return aElement.getNumero() === lNrListeSelection;
					},
				);
				InterfaceListeDiffusion.indexlisteDiffusion = lIndexSelection;
				this.etatUtilSco.listeDiffusion = undefined;
			} else {
				this.etatUtilSco.listeDiffusion =
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
		new ObjetRequeteSaisieListeDiffusion_1.ObjetRequeteSaisieListeDiffusion(
			this,
		)
			.lancerRequete({ liste: this.donnees })
			.then((aReponse) => {
				var _a;
				if (
					(_a =
						aReponse === null || aReponse === void 0
							? void 0
							: aReponse.JSONRapportSaisie) === null || _a === void 0
						? void 0
						: _a.listeDiffusionCree
				) {
					this.listeSelectionnee =
						aReponse.JSONRapportSaisie.listeDiffusionCree;
					this.etatUtilSco.listeDiffusion = this.listeSelectionnee;
				}
				this.actionSurValidation();
			});
	}
	_evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresErreurCreation:
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
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresSuppression:
				this._viderSelection();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.listeSelectionnee = aParametres.article;
				if (this.listeSelectionnee) {
					this.etatUtilSco.listeDiffusion = this.listeSelectionnee;
					if (!this.optionsEcrans.avecBascule) {
						ObjetHtml_1.GHtml.setHtml(
							this.idBandeauDroite + "_Texte",
							this.listeSelectionnee.getLibelle() +
								" - " +
								ObjetTraduction_1.GTraductions.getValeur(
									"listeDiffusion.compositionDeLaListe",
								),
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
					this._viderSelection();
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation: {
				const lArticle = new ObjetElement_1.ObjetElement("");
				lArticle.estPublique = false;
				lArticle.libelleAuteur =
					ObjetTraduction_1.GTraductions.getValeur("listeDiffusion.moi");
				lArticle.triAuteur = "0";
				lArticle.estAuteur = true;
				lArticle.listePublicIndividu =
					new ObjetListeElements_1.ObjetListeElements();
				ObjetFenetre_EditionListeDiffusion_1.ObjetFenetre_EditionListeDiffusion.ouvrir(
					{
						instance: this,
						evenement: (aGenreBouton, aParams) => {
							if (aParams && aParams.bouton && aParams.bouton.valider) {
								aParams.element.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
								this.donnees.addElement(aParams.element);
								this.valider();
							}
						},
						donnees: { element: lArticle, liste: this.donnees },
					},
				);
				break;
			}
		}
	}
	_initialiserDetail(aInstance) {
		aInstance.setParametres({
			callbackAjoutRessource:
				this._ouvrirFenetreSelectionRessourceDeGenre.bind(this),
			callbackSuppressionRessource: this._surSuppressionRessource.bind(this),
			genresRessources: this.genresRessources,
		});
	}
	_evenementDetail(aItemMenuContextuel) {
		if (aItemMenuContextuel.data) {
			this.listeSelectionnee = aItemMenuContextuel.data;
		}
		switch (aItemMenuContextuel.getNumero()) {
			case DonneesListe_Diffusion_1.DonneesListe_Diffusion.genreAction.partager:
			case DonneesListe_Diffusion_1.DonneesListe_Diffusion.genreAction
				.departager:
				this.valider();
				break;
			case DonneesListe_Diffusion_1.DonneesListe_Diffusion.genreAction.renommer:
				ObjetFenetre_EditionListeDiffusion_1.ObjetFenetre_EditionListeDiffusion.ouvrir(
					{
						instance: this,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"listeDiffusion.renommer",
						),
						evenement: (aGenreBouton, aParams) => {
							if (aParams && aParams.bouton && aParams.bouton.valider) {
								aParams.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
								this.listeSelectionnee = aParams.element;
								this.valider();
							}
						},
						donnees: { element: this.listeSelectionnee, liste: this.donnees },
					},
				);
				break;
			case DonneesListe_Diffusion_1.DonneesListe_Diffusion.genreAction
				.ajouterpublic:
				this._ouvrirFenetreSelectionRessourceDeGenre(
					aItemMenuContextuel.genreRessource,
					aItemMenuContextuel.data,
				);
				break;
			default:
				break;
		}
	}
	_evenementSurMenuContextuelListe(aItemMenuContextuel) {
		if (
			this.listeSelectionnee ||
			(aItemMenuContextuel && aItemMenuContextuel.data)
		) {
			this.listeSelectionnee = aItemMenuContextuel.data;
			switch (aItemMenuContextuel.getNumero()) {
				case DonneesListe_Diffusion_1.DonneesListe_Diffusion.genreAction
					.diffuserInformation:
					this._evenementFenetreEditionActu(
						TypeGenreReponseInternetActualite_1
							.TypeGenreReponseInternetActualite.AvecAR,
					);
					break;
				case DonneesListe_Diffusion_1.DonneesListe_Diffusion.genreAction
					.effectuerSondage:
					this._evenementFenetreEditionActu(
						TypeGenreReponseInternetActualite_1
							.TypeGenreReponseInternetActualite.ChoixUnique,
					);
					break;
				case DonneesListe_Diffusion_1.DonneesListe_Diffusion.genreAction
					.demarrerDiscussion:
					ObjetFenetre_Message_1.ObjetFenetre_Message.creerFenetreDiscussion(
						this,
						this._getDonneesFenetreEditionDiscussion(),
					);
					break;
				case DonneesListe_Diffusion_1.DonneesListe_Diffusion.genreAction
					.partager:
				case DonneesListe_Diffusion_1.DonneesListe_Diffusion.genreAction
					.departager:
					this.valider(true);
					break;
				case DonneesListe_Diffusion_1.DonneesListe_Diffusion.genreAction
					.renommer:
					ObjetFenetre_EditionListeDiffusion_1.ObjetFenetre_EditionListeDiffusion.ouvrir(
						{
							instance: this,
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"listeDiffusion.renommer",
							),
							evenement: (aGenreBouton, aParams) => {
								if (aParams && aParams.bouton && aParams.bouton.valider) {
									aParams.element.setEtat(
										Enumere_Etat_1.EGenreEtat.Modification,
									);
									this.listeSelectionnee = aParams.element;
									this.valider(true);
								}
							},
							donnees: { element: this.listeSelectionnee, liste: this.donnees },
						},
					);
					break;
				case Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression:
					this.valider();
					this._viderSelection();
					break;
				default:
					break;
			}
		}
	}
	_getDonneesFenetreEditionDiscussion() {
		const lDonnees = {};
		const lGenresRessources = [];
		[
			Enumere_Ressource_1.EGenreRessource.Eleve,
			Enumere_Ressource_1.EGenreRessource.Responsable,
			Enumere_Ressource_1.EGenreRessource.Enseignant,
			Enumere_Ressource_1.EGenreRessource.Personnel,
		].forEach((aGenre) => {
			lGenresRessources.push({
				genre: aGenre,
				getDisabled() {
					return !UtilitaireMessagerie_1.UtilitaireMessagerie.estGenreDestinataireAutorise(
						aGenre,
					);
				},
				listeDestinataires: this._getListeDonneesSelectionnees(
					aGenre,
				).getListeElements((aElement) => {
					return !aElement.refusMess;
				}),
			});
		});
		lDonnees.genresRessources = lGenresRessources;
		lDonnees.avecIndicationDiscussionInterdit = [
			Enumere_Espace_1.EGenreEspace.Professeur,
			Enumere_Espace_1.EGenreEspace.Etablissement,
		].includes(this.etatUtilSco.GenreEspace);
		lDonnees.message = { objet: "", contenu: "" };
		return lDonnees;
	}
	_evenementFenetreEditionActu(aGenreReponse) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_EditionActualite_1.ObjetFenetre_EditionActualite,
			{
				pere: this,
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						modale: true,
						titre:
							aGenreReponse ===
							TypeGenreReponseInternetActualite_1
								.TypeGenreReponseInternetActualite.AvecAR
								? ObjetTraduction_1.GTraductions.getValeur(
										"actualites.creerInfo",
									)
								: ObjetTraduction_1.GTraductions.getValeur(
										"actualites.creerSondage",
									),
						largeur: 750,
						hauteur: 700,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
					});
				},
			},
		);
		lFenetre.setDonnees({
			donnee: null,
			creation: true,
			genreReponse: aGenreReponse,
			forcerAR: this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.forcerARInfos,
			),
			listePublicDeListeDiffusion: this.listeSelectionnee.listePublicIndividu,
		});
	}
	_viderSelection() {
		ObjetHtml_1.GHtml.setHtml(this.idBandeauDroite + "_Texte", "");
		this.getInstance(this.identDiffusion).setDonnees(undefined);
		this.etatUtilSco.listeDiffusion = undefined;
		this.listeSelectionnee = undefined;
	}
	_evntListePublic(aGenre, aRessource) {
		new ObjetRequeteListePublics_1.ObjetRequeteListePublics(
			this,
			this._evntListePublicApresRequete.bind(this),
		).lancerRequete({
			genres: [aGenre],
			sansFiltreSurEleve: this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.toutesClasses,
			),
			avecFonctionPersonnel: true,
		});
	}
	_getListeDonneesSelectionnees(aGenre) {
		return this.listeSelectionnee.listePublicIndividu.getListeElements(
			(aElement) => {
				return aElement.getGenre() === aGenre;
			},
		);
	}
	_evntListePublicApresRequete(aDonnees) {
		this._evntDeclencherFenetreRessource({
			listeComplet: aDonnees.listePublic,
			listeFamilles: aDonnees.listeFamilles,
			listeServicesPeriscolaire: aDonnees.listeServicesPeriscolaire,
			listeProjetsAcc: aDonnees.listeProjetsAcc,
			listeSelectionnee: this._getListeDonneesSelectionnees(aDonnees.genres[0]),
			genre: aDonnees.genres[0],
			genreCumul: (0,
			UtilitaireFenetreSelectionPublic_1.getCumulPourFenetrePublic)(
				aDonnees.genres[0],
				aDonnees.checked,
				aDonnees.listePublic.count(),
			),
			listePartiel: this.listePartiel,
			listeNiveauxResponsabilite: aDonnees.listeNiveauxResponsabilite,
		});
	}
	_ouvrirFenetreSelectionRessourceDeGenre(aGenre, aRessource) {
		this._evntListePublic(aGenre, aRessource);
	}
	_surSuppressionRessource(aInfosRessource) {
		if (this.listeSelectionnee) {
			let lElement;
			switch (aInfosRessource.genre) {
				case Enumere_Ressource_1.EGenreRessource.Eleve:
				case Enumere_Ressource_1.EGenreRessource.Responsable:
				case Enumere_Ressource_1.EGenreRessource.MaitreDeStage:
				case Enumere_Ressource_1.EGenreRessource.Enseignant:
				case Enumere_Ressource_1.EGenreRessource.Personnel:
				case Enumere_Ressource_1.EGenreRessource.InspecteurPedagogique:
					lElement =
						this.listeSelectionnee.listePublicIndividu.getElementParElement(
							aInfosRessource.ressource,
						);
					if (lElement) {
						lElement.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
						this.listeSelectionnee.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
						this.getInstance(this.identDiffusion).actualiserAffichage(true);
					}
					break;
				default:
					break;
			}
		}
	}
	_gererSelectionListes(
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
					aElement.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
				} else {
					lTabIndiceSupprListeSelec.push(lEltResSel.indice);
					lCacheRessSelec.delete(lCle);
				}
			}
		});
		aListeRessourcesSelectionnees.remove(lTabIndiceSupprListeSelec);
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
					const lElement = MethodesObjet_1.MethodesObjet.dupliquer(aElement);
					lElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					lListeActuelle.addElement(lElement);
					lCacheRess.set(lCle, true);
				}
			}
		});
		lListeActuelle.trier();
		this.listeSelectionnee.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		if (this.avecValidationAuto) {
			this.valider();
		} else {
			this.getInstance(this.identDiffusion).actualiserAffichage(true);
		}
	}
	_evntDeclencherFenetreRessource(aDonnees) {
		const lInstance = this.getInstance(this.identFenetreSelectPublic);
		if (
			aDonnees.genre === Enumere_Ressource_1.EGenreRessource.Eleve ||
			aDonnees.genre === Enumere_Ressource_1.EGenreRessource.Responsable
		) {
			const lListeCumuls = new ObjetListeElements_1.ObjetListeElements();
			lListeCumuls.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("actualites.Cumul.Classe"),
					0,
					ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.classe,
					0,
				),
			);
			lListeCumuls.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("actualites.Cumul.Groupe"),
					0,
					ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.groupe,
					1,
				),
			);
			lListeCumuls.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"actualites.Cumul.Alphabetique",
					),
					0,
					ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.initial,
					2,
				),
			);
			if (aDonnees.genre === Enumere_Ressource_1.EGenreRessource.Responsable) {
				lListeCumuls.addElement(
					new ObjetElement_1.ObjetElement(
						ObjetTraduction_1.GTraductions.getValeur(
							"actualites.Cumul.NomDesEleves",
						),
						0,
						ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic
							.nomEleves,
					),
				);
			}
			if (aDonnees.listeServicesPeriscolaire) {
				lListeCumuls.addElement(
					new ObjetElement_1.ObjetElement(
						ObjetTraduction_1.GTraductions.getValeur(
							"actualites.Cumul.ServicesPeriscolaire",
						),
						0,
						ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic
							.servicesPeriscolaire,
					),
				);
			}
			if (aDonnees.listeProjetsAcc) {
				lListeCumuls.addElement(
					new ObjetElement_1.ObjetElement(
						ObjetTraduction_1.GTraductions.getValeur(
							"actualites.Cumul.ProjetsAccompagnement",
						),
						0,
						ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic
							.projetsAccompagnement,
					),
				);
			}
			if (aDonnees.listeFamilles) {
				aDonnees.listeFamilles.parcourir((aFamille) => {
					const lFiltreFamille = new ObjetElement_1.ObjetElement(
						aFamille.getLibelle(),
						0,
						ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic
							.famille,
					);
					lFiltreFamille.famille = aFamille;
					lListeCumuls.addElement(lFiltreFamille);
				});
			}
			lInstance.setListeCumuls(lListeCumuls);
		}
		if (aDonnees.genre === Enumere_Ressource_1.EGenreRessource.Personnel) {
			const lListeCumuls = new ObjetListeElements_1.ObjetListeElements();
			lListeCumuls.add(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_SelectionPublic.Cumul.Aucun",
					),
					0,
					ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.sans,
					0,
				),
			);
			lListeCumuls.add(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("actualites.Cumul.Fonction"),
					0,
					ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.fonction,
					1,
				),
			);
			lInstance.setListeCumuls(lListeCumuls);
			lInstance.setOptions({
				getInfosSuppZonePrincipale(aParams) {
					return lInstance.getGenreCumul() !==
						ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic
							.fonction
						? UtilitaireMessagerie_1.UtilitaireMessagerie.getLibelleSuppListePublics(
								aParams.article,
							)
						: "";
				},
			});
		}
		if (
			[
				Enumere_Ressource_1.EGenreRessource.Enseignant,
				Enumere_Ressource_1.EGenreRessource.Responsable,
				Enumere_Ressource_1.EGenreRessource.Eleve,
			].includes(aDonnees.genre)
		) {
			lInstance.setOptions({
				getInfosSuppZonePrincipale(aParams) {
					return UtilitaireListePublics_1.UtilitaireListePublics.getLibelleSuppListePublics(
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
		if (
			lListePartiel &&
			aDonnees.genre === Enumere_Ressource_1.EGenreRessource.Enseignant
		) {
			aDonnees.listeComplet.parcourir((aElement) => {
				const lNumero = aElement.getNumero();
				aElement.estMembreEquipe =
					lListePartiel.getIndiceElementParFiltre((aElement) => {
						return aElement.getNumero() === lNumero;
					}) > -1;
			});
			lFiltres.push({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"actualites.filtre.equipePedagogique",
				),
				filtre: function (aElement, aChecked) {
					return aChecked ? aElement.estMembreEquipe : true;
				},
				checked: false,
			});
		}
		lInstance.setOptions({ filtres: lFiltres, avecCocheRessources: true });
		lInstance.setDonnees({
			listeRessources: aDonnees.listeComplet,
			listeRessourcesSelectionnees: MethodesObjet_1.MethodesObjet.dupliquer(
				aDonnees.listeSelectionnee,
			),
			genreRessource: aDonnees.genre,
			titre:
				Enumere_Ressource_1.EGenreRessourceUtil.getTitreFenetreSelectionRessource(
					aDonnees.genre,
				),
			estGenreRessourceDUtilisateurConnecte:
				Enumere_Ressource_1.EGenreRessourceUtil.correspondAuGenreUtilisateurEspaceCourant(
					aDonnees.genre,
				),
			listeNiveauxResponsabilite: aDonnees.listeNiveauxResponsabilite,
		});
	}
	_evenementFenetreIndividu(
		aGenreRessource,
		aListeRessourcesSelectionnees,
		aNumeroBouton,
	) {
		if (aGenreRessource === Enumere_Ressource_1.EGenreRessource.Eleve) {
			new ObjetRequeteDonneesEditionInformation_1.ObjetRequeteDonneesEditionInformation(
				this,
				this._evenementApresFenetreIndividu.bind(
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
			this._evenementApresFenetreIndividu(
				aGenreRessource,
				aListeRessourcesSelectionnees,
				aNumeroBouton,
			);
		}
	}
	_evenementApresFenetreIndividu(
		aGenreRessource,
		aListeRessourcesSelectionnees,
		aNumeroBouton,
	) {
		if (aNumeroBouton === 1) {
			const lListeActuelle = this.listeSelectionnee.listePublicIndividu;
			this._gererSelectionListes(
				aGenreRessource,
				aListeRessourcesSelectionnees,
				lListeActuelle,
			);
		}
	}
	_evenementSurCB(aValue) {
		const lValue = !!aValue;
		let lSelection = true;
		this.appSco.parametresUtilisateur.set(
			"listeDiffusion.uniquementMesListes",
			lValue,
		);
		if (
			this.getInstance(this.identListe) &&
			this.getInstance(this.identListe).getDonneesListe()
		) {
			if (
				lValue &&
				this.listeSelectionnee &&
				!this.listeSelectionnee.estAuteur
			) {
				lSelection = false;
			}
			this.getInstance(this.identListe)
				.getDonneesListe()
				.setUniquementMesListes(lValue);
			this.getInstance(this.identListe).actualiser(lSelection, false);
		}
		if (!lSelection) {
			this._viderSelection();
		}
	}
	_actionApresRequeteListeDiffusion(aJSON) {
		if (aJSON && aJSON.liste) {
			this.donnees = aJSON.liste;
			if (Cache_1.GCache) {
				Cache_1.GCache.general.setDonnee("listeDiffusion", aJSON.liste);
				Cache_1.GCache.general.vider("listeDiffusion_messagerie");
			}
		}
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_Diffusion_1.DonneesListe_Diffusion({
				donnees: this.donnees,
				evenementMenuContextuel:
					this._evenementSurMenuContextuelListe.bind(this),
				uniquementMesListes: this.appSco.parametresUtilisateur.get(
					"listeDiffusion.uniquementMesListes",
				),
			}),
		);
		let lIndexSelection = -1;
		if (this.etatUtilSco.listeDiffusion) {
			const lNrListeSelection = this.etatUtilSco.listeDiffusion.getNumero();
			lIndexSelection = this.donnees.getIndiceElementParFiltre((aElement) => {
				return aElement.getNumero() === lNrListeSelection;
			});
		} else if (InterfaceListeDiffusion.indexlisteDiffusion > -1) {
			lIndexSelection = InterfaceListeDiffusion.indexlisteDiffusion;
		}
		if (lIndexSelection > -1) {
			this.listeSelectionnee = this.donnees.get(lIndexSelection);
			this.etatUtilSco.listeDiffusion = this.listeSelectionnee;
			if (this.listeSelectionnee) {
				ObjetHtml_1.GHtml.setHtml(
					this.idBandeauDroite + "_Texte",
					this.listeSelectionnee.getLibelle() +
						" - " +
						ObjetTraduction_1.GTraductions.getValeur(
							"listeDiffusion.compositionDeLaListe",
						),
				);
				this.getInstance(this.identListe).selectionnerLigne({
					ligne: lIndexSelection,
					avecEvenement: true,
				});
			}
		}
	}
}
exports.InterfaceListeDiffusion = InterfaceListeDiffusion;
(function (InterfaceListeDiffusion) {
	let genreEcran;
	(function (genreEcran) {
		genreEcran["liste"] = "liste-diffusion-liste";
		genreEcran["detail"] = "liste-diffusion-detail";
	})(
		(genreEcran =
			InterfaceListeDiffusion.genreEcran ||
			(InterfaceListeDiffusion.genreEcran = {})),
	);
})(
	InterfaceListeDiffusion ||
		(exports.InterfaceListeDiffusion = InterfaceListeDiffusion = {}),
);
