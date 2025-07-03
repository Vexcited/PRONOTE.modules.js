exports.InterfaceRessourcePedagogique_Professeur = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequeteRessourcePedagogique_1 = require("ObjetRequeteRessourcePedagogique");
const ObjetRequeteSaisieRessourcePedagogique_1 = require("ObjetRequeteSaisieRessourcePedagogique");
const _InterfaceRessourcePedagogique_1 = require("_InterfaceRessourcePedagogique");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_SelectionMatiere_1 = require("ObjetFenetre_SelectionMatiere");
const ObjetFenetre_SelectionRessource_1 = require("ObjetFenetre_SelectionRessource");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const DonneesListe_RessourcesPedagogiquesProfesseur_1 = require("DonneesListe_RessourcesPedagogiquesProfesseur");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_RessourcePedagogique_1 = require("Enumere_RessourcePedagogique");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const ObjetFenetre_SelectionImportRessourcePedagogique_1 = require("ObjetFenetre_SelectionImportRessourcePedagogique");
const ObjetFenetre_SelectionRessourcePedagogique_1 = require("ObjetFenetre_SelectionRessourcePedagogique");
const ObjetFenetre_ListeTAFFaits_1 = require("ObjetFenetre_ListeTAFFaits");
const ObjetFenetre_ListeTAFFaits_2 = require("ObjetFenetre_ListeTAFFaits");
const ObjetFenetre_EditionUrl_1 = require("ObjetFenetre_EditionUrl");
const ObjetRequeteListeTousLesThemes_1 = require("ObjetRequeteListeTousLesThemes");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetFenetre_ListeThemes_1 = require("ObjetFenetre_ListeThemes");
const ObjetFenetre_ActionContextuelle_1 = require("ObjetFenetre_ActionContextuelle");
class InterfaceRessourcePedagogique_Professeur extends _InterfaceRessourcePedagogique_1._InterfaceRessourcePedagogique {
	constructor(...aParams) {
		super(...aParams);
		this.idTout = this.Nom + "_tout";
		this.idMessage = this.Nom + "_mess";
		this.pourPartage =
			this.etatUtilScoEspace.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.RessourcePedagogique_Partage;
		if (
			this.etatUtilScoEspace.getOnglet().uniquementMatieresEnseignees ===
			undefined
		) {
			this.etatUtilScoEspace.getOnglet().uniquementMatieresEnseignees = true;
		}
	}
	construireInstances() {
		this.identTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this._evenementSurDernierMenuDeroulant,
			this._initialiserTripleCombo,
		);
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListe.bind(this),
			this._initialiserListe,
		);
	}
	_actualiserAffichage() {
		const lListe = this.getInstance(this.identListe);
		const lListePublics = this._getListePublicsSelectionnes();
		if (!this.etatUtilScoEspace.Navigation.avecGenresRessourcePedagogique) {
			this.etatUtilScoEspace.Navigation.avecGenresRessourcePedagogique =
				new TypeEnsembleNombre_1.TypeEnsembleNombre()
					.add(
						Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
							.documentJoint,
					)
					.add(Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.site)
					.add(Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.QCM)
					.add(Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.sujet)
					.add(
						Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.corrige,
					)
					.add(
						Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
							.travailRendu,
					)
					.add(
						Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.kiosque,
					)
					.add(
						Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
							.documentCloud,
					);
		}
		this.parametres = {
			avecGenres:
				this.etatUtilScoEspace.Navigation.avecGenresRessourcePedagogique,
		};
		lListe.setOptionsListe({
			avecLigneCreation:
				this.appScoEspace.droits.get(
					ObjetDroitsPN_1.TypeDroits.cahierDeTexte.avecSaisiePieceJointe,
				) &&
				(!this.pourPartage || lListePublics.count() === 1),
			titreCreation: this.pourPartage
				? ObjetTraduction_1.GTraductions.getValeur(
						"RessourcePedagogique.AjouterUneRscePartagee",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"RessourcePedagogique.AjouterUneRessource",
					),
		});
		lListe.setDonnees(
			new DonneesListe_RessourcesPedagogiquesProfesseur_1.DonneesListe_RessourcesPedagogiquesProfesseur(
				{
					donnees: this.listeRessources,
					pourPartage: this.pourPartage,
					afficherCumul: this.afficherCumul,
					publics: lListePublics,
					genreAffiches: this.parametres.avecGenres,
					listeMatieresParRessource: this.listeMatieresParRessource,
					evenementMenuContextuel: this._evenementSurMenuContextuel.bind(this),
					getParamMenuContextuelSelecFile:
						this._getParamMenuContextuelSelecFile.bind(this),
					callbackSurAjout: () => {
						this.ouvrirFenetreCreation();
					},
				},
			),
		);
	}
	ouvrirFenetreCreation() {
		const lThis = this;
		const lTabActions = [];
		if (!lThis.pourPartage) {
			lTabActions.push({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"RessourcePedagogique.AjoutParmiDocumentsAutreClasse",
				),
				icon: "icon_file_alt",
				event() {
					lThis.ouvrirFenetreAjoutDocumentDepuisAutreClasse();
				},
				class: "bg-green-claire",
			});
		}
		lTabActions.push({
			libelle: IE.estMobile
				? ObjetTraduction_1.GTraductions.getValeur(
						"RessourcePedagogique.AjoutDepuisMesDocuments",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"RessourcePedagogique.AjoutDepuisMonPoste",
					),
			icon: "icon_folder_open",
			selecFile: true,
			optionsSelecFile: this._getOptionsSelecFile(false),
			event(aParamsInput) {
				if (aParamsInput) {
					const lParametres = {
						type: DonneesListe_RessourcesPedagogiquesProfesseur_1
							.DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu.ajoutDoc,
						element: null,
					};
					lThis._evenementInputFile(aParamsInput, lParametres);
				}
			},
			class: "bg-orange-claire",
		});
		lTabActions.push({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"RessourcePedagogique.AjoutDepuisMesSauvegardes",
			),
			icon: "icon_upload_alt",
			selecFile: true,
			optionsSelecFile: this._getOptionsSelecFile(true),
			event(aParamsInput) {
				if (aParamsInput) {
					const lParametres = {
						type: DonneesListe_RessourcesPedagogiquesProfesseur_1
							.DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu
							.ajoutSauvegarde,
						element: null,
					};
					lThis._evenementInputFile(aParamsInput, lParametres);
				}
			},
			class: "bg-orange-claire",
		});
		lTabActions.push({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"RessourcePedagogique.AjoutNouveauLien",
			),
			icon: "icon_globe mix-icon_plus",
			event() {
				lThis.ouvrirFenetreEditionSite();
			},
			class: "bg-blue-claire",
		});
		ObjetFenetre_ActionContextuelle_1.ObjetFenetre_ActionContextuelle.ouvrir(
			lTabActions,
			{ pere: this },
		);
	}
	afficherPage() {
		this._envoieRequete(true);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone = [this.identTripleCombo];
	}
	evenementAfficherMessage(aGenreMessage) {
		ObjetHtml_1.GHtml.setDisplay(this.idTout, false);
		ObjetHtml_1.GHtml.setDisplay(this.idMessage, true);
		ObjetHtml_1.GHtml.setHtml(
			this.idMessage,
			this.composeMessage(
				ObjetTraduction_1.GTraductions.getValeur("Message")[aGenreMessage],
			),
			{ controleur: this.controleur },
		);
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			`<section id="${this.idTout}" style="display:none;" class="ly-cols-1">`,
		);
		H.push(
			`<header>${this.composerCBs(true, true, !this.pourPartage, true)}</header>`,
		);
		H.push(
			`<div class="content-bloc fluid-bloc p-all-l" id="${this.getNomInstance(this.identListe)}"></div>`,
		);
		H.push(`</section>`);
		H.push(
			'<div id="',
			this.idMessage,
			'" class="GrandEspace" style="display:none;"></div>',
		);
		return H.join("");
	}
	valider() {
		this._saisie();
	}
	_evenementSurDernierMenuDeroulant() {
		this._envoieRequete();
	}
	_initialiserListe(aInstance) {
		const lColonnesCachees = [];
		if (this.pourPartage) {
			lColonnesCachees.push(
				DonneesListe_RessourcesPedagogiquesProfesseur_1
					.DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.public,
			);
		} else {
			lColonnesCachees.push(
				DonneesListe_RessourcesPedagogiquesProfesseur_1
					.DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.proprietaire,
				DonneesListe_RessourcesPedagogiquesProfesseur_1
					.DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.modif,
			);
		}
		if (!this.appScoEspace.parametresUtilisateur.get("avecGestionDesThemes")) {
			lColonnesCachees.push(
				DonneesListe_RessourcesPedagogiquesProfesseur_1
					.DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.themes,
			);
		}
		aInstance.setOptionsListe({
			colonnes: [
				{
					id: DonneesListe_RessourcesPedagogiquesProfesseur_1
						.DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.type,
					taille: 21,
					titre: "",
				},
				{
					id: DonneesListe_RessourcesPedagogiquesProfesseur_1
						.DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle,
					taille: ObjetListe_1.ObjetListe.initColonne(100, 300, 500),
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"RessourcePedagogique.colonne.document",
					),
				},
				{
					id: DonneesListe_RessourcesPedagogiquesProfesseur_1
						.DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.themes,
					taille: 80,
					titre: ObjetTraduction_1.GTraductions.getValeur("Themes"),
				},
				{
					id: DonneesListe_RessourcesPedagogiquesProfesseur_1
						.DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.commentaire,
					taille: ObjetListe_1.ObjetListe.initColonne(100, 200, 400),
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"RessourcePedagogique.colonne.commentaire",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"RessourcePedagogique.hintColonne.commentaire",
					),
				},
				{
					id: DonneesListe_RessourcesPedagogiquesProfesseur_1
						.DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.public,
					taille: 80,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"RessourcePedagogique.colonne.public",
					),
				},
				{
					id: DonneesListe_RessourcesPedagogiquesProfesseur_1
						.DonneesListe_RessourcesPedagogiquesProfesseur.colonnes
						.proprietaire,
					taille: 200,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"RessourcePedagogique.colonne.proprietaire",
					),
				},
				{
					id: DonneesListe_RessourcesPedagogiquesProfesseur_1
						.DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.date,
					taille: 70,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"RessourcePedagogique.colonne.deposeLe",
					),
				},
				{
					id: DonneesListe_RessourcesPedagogiquesProfesseur_1
						.DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.modif,
					taille: 60,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"RessourcePedagogique.colonne.modif",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"RessourcePedagogique.hintColonne.modif",
					),
				},
			],
			colonnesCachees: lColonnesCachees,
		});
		this.etatUtilScoEspace.setTriListe({
			liste: aInstance,
			tri: DonneesListe_RessourcesPedagogiquesProfesseur_1
				.DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.type,
		});
	}
	_getGenrePublicSelection() {
		return this.pourPartage
			? Enumere_Ressource_1.EGenreRessource.Matiere
			: Enumere_Ressource_1.EGenreRessource.Classe;
	}
	_initialiserTripleCombo(aInstance) {
		aInstance.setParametres([this._getGenrePublicSelection()], true);
		aInstance.setControleNavigation(false);
	}
	_surModificationAjouterDestinatairesDansRessource(aRessource, aListeNiveaux) {
		const lPourPartage = this.pourPartage;
		const lDestinataires = lPourPartage
			? aListeNiveaux
			: this._getListePublicsSelectionnes();
		this.setEtatSaisie(true);
		aRessource.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		let lAvecAjout = false;
		lDestinataires.parcourir((aDestinataire) => {
			const lListe = lPourPartage
				? aRessource.listeNiveaux
				: aRessource.listePublics;
			const lTrouve = lListe.getElementParElement(aDestinataire);
			if (!lTrouve || !lTrouve.existe()) {
				lAvecAjout = true;
				const lDestinataireAjoute = new ObjetElement_1.ObjetElement(
					aDestinataire.getLibelle(),
					aDestinataire.getNumero(),
					aDestinataire.getGenre(),
				);
				lDestinataireAjoute.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				lListe.addElement(lDestinataireAjoute);
			}
		});
		this._actualiserAffichage();
		return lAvecAjout;
	}
	_getUrlElement(aElement) {
		let lUrl = null;
		switch (aElement.getGenre()) {
			case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
				.documentJoint:
				if (aElement.ressource.url) {
					lUrl = aElement.ressource.url;
				} else {
					lUrl = ObjetChaine_1.GChaine.creerUrlBruteLienExterne(
						aElement.ressource,
						{ libelle: aElement.ressource.getLibelle() },
					);
				}
				break;
			case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
				.documentCloud:
				lUrl = aElement.ressource.url;
				break;
			case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.site:
				lUrl = ObjetChaine_1.GChaine.encoderUrl(
					ObjetChaine_1.GChaine.verifierURLHttp(aElement.url),
				);
				break;
			case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.sujet:
			case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.corrige:
				lUrl =
					Enumere_RessourcePedagogique_1.EGenreRessourcePedagogiqueUtil.composerURL(
						aElement.getGenre(),
						aElement.ressource,
						aElement.ressource.getLibelle(),
						true,
					);
				break;
			case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
				.travailRendu:
				lUrl = ObjetChaine_1.GChaine.creerUrlBruteLienExterne(
					aElement.ressource,
					{ libelle: aElement.ressource.getLibelle() },
				);
				break;
		}
		return lUrl;
	}
	_evenementSurMenuContextuel(aLigne, aElementMenu, aElement) {
		switch (aLigne.getNumero()) {
			case DonneesListe_RessourcesPedagogiquesProfesseur_1
				.DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu.consulter:
				if (aElement && aElement.donnee) {
					if (
						aElement.donnee.getGenre() ===
						Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
							.travailRendu
					) {
						if (!!aElement.donnee.ressource) {
							ObjetFenetre_ListeTAFFaits_1.ObjetFenetre_ListeTAFFaits.ouvrir(
								{
									pere: this,
									evenement: this._evenementFenetreTAFARendre.bind(this),
								},
								aElement.donnee.ressource,
							);
						}
					} else {
						const lURLDocument = this._getUrlElement(aElement.donnee);
						if (!!lURLDocument) {
							window.open(lURLDocument);
						}
					}
				}
				break;
			case DonneesListe_RessourcesPedagogiquesProfesseur_1
				.DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu.verrouiller:
			case DonneesListe_RessourcesPedagogiquesProfesseur_1
				.DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu.deverrouiller:
				if (
					aLigne.data &&
					aLigne.data.listeEditables &&
					aLigne.data.listeEditables.count() > 0
				) {
					aLigne.data.listeEditables.parcourir((D) => {
						D.donnee.estModifiableParAutrui =
							aLigne.getNumero() ===
							DonneesListe_RessourcesPedagogiquesProfesseur_1
								.DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu
								.deverrouiller;
						D.donnee.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					});
					this.setEtatSaisie(true);
				}
				break;
			default:
				return true;
		}
	}
	ouvrirFenetreEditionSite() {
		const lThis = this;
		const lFenetre =
			ObjetFenetre_EditionUrl_1.ObjetFenetre_EditionUrl.creerInstanceFenetreEditionUrl(
				{
					pere: this,
					evenement: (aValider, aParams) => {
						if (
							!!aParams &&
							!!aParams.bouton &&
							aParams.bouton.valider &&
							!!aParams.donnee
						) {
							const lDonnee = aParams.donnee;
							if (lThis.pourPartage) {
								const lElmTrouve = lThis._getElementParLibelleRessourceEtGenre(
									lDonnee.libelle,
									Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
										.site,
								);
								lThis._ouvrirFenetreSelectionNiveaux({
									elementDoublon: lElmTrouve,
									callback: function (aReussite, aListeNiveaux) {
										if (!aReussite) {
											return;
										}
										if (lElmTrouve) {
											lThis._surModificationAjouterDestinatairesDansRessource(
												lElmTrouve,
												aListeNiveaux,
											);
										} else {
											lThis.listeRessources.addElement(
												DonneesListe_RessourcesPedagogiquesProfesseur_1.DonneesListe_RessourcesPedagogiquesProfesseur.creerElement(
													{
														libelle: lDonnee.libelle
															? lDonnee.libelle
															: lDonnee.url,
														url: lDonnee.url,
														commentaire: lDonnee.commentaire,
														listeNiveaux: aListeNiveaux,
														matiere: lThis
															._getListePublicsSelectionnes()
															.get(0),
														genreCreation:
															Enumere_RessourcePedagogique_1
																.EGenreRessourcePedagogique.site,
														listePublics:
															new ObjetListeElements_1.ObjetListeElements(),
													},
												),
											);
										}
										lThis.setEtatSaisie(true);
										lThis._actualiserAffichage();
									},
								});
							} else {
								lThis._ouvrirFenetreSelectionMatiere((aReussite, aMatiere) => {
									if (aReussite) {
										lThis.listeRessources.addElement(
											DonneesListe_RessourcesPedagogiquesProfesseur_1.DonneesListe_RessourcesPedagogiquesProfesseur.creerElement(
												{
													libelle: lDonnee.libelle,
													url: lDonnee.url,
													commentaire: lDonnee.commentaire,
													matiere: aMatiere,
													genreCreation:
														Enumere_RessourcePedagogique_1
															.EGenreRessourcePedagogique.site,
													listePublics: lThis._getListePublicsSelectionnes(),
												},
											),
										);
										lThis.setEtatSaisie(true);
										lThis._actualiserAffichage();
									}
								});
							}
						}
					},
				},
			);
		lFenetre.setDonnees({ libelle: "", url: "http://", commentaire: "" });
	}
	ouvrirFenetreAjoutDocumentDepuisAutreClasse() {
		const lThis = this;
		const lInstanceFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SelectionRessourcePedagogique_1.ObjetFenetre_SelectionRessourcePedagogique,
			{
				pere: this,
				evenement: function (aValider, aRessourceSelectionne) {
					if (aValider) {
						lThis._surModificationAjouterDestinatairesDansRessource(
							aRessourceSelectionne,
						);
					}
				},
			},
		);
		lInstanceFenetre.setDonnees({
			donnees: this.listeRessources,
			publics: this._getListePublicsSelectionnes(),
			afficherCumul: this.afficherCumul,
			listeMatieresParRessource: this.listeMatieresParRessource,
		});
	}
	_ouvrirFenetreSelectionNiveaux(aParam) {
		const lParam = $.extend(
			{ elementDoublon: null, callback: null, avecValidationAuto: false },
			aParam,
		);
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		this.listeNiveaux.parcourir((aNiveau) => {
			if (
				!lParam.elementDoublon ||
				!lParam.elementDoublon.listeNiveaux.getElementParElement(aNiveau) ||
				!lParam.elementDoublon.listeNiveaux
					.getElementParElement(aNiveau)
					.existe()
			) {
				lListe.addElement(aNiveau);
			}
		});
		if (lListe.count() === 0) {
			this.appScoEspace
				.getMessage()
				.afficher({
					message: ObjetTraduction_1.GTraductions.getValeur(
						"RessourcePedagogique.CeNomExisteDeja",
					),
				});
			return false;
		}
		const lThis = this,
			lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource,
				{
					pere: this,
					evenement: function (
						aGenreRessource,
						aListeRessourcesSelectionnees,
						aNumeroBouton,
					) {
						const lListe = new ObjetListeElements_1.ObjetListeElements();
						if (aNumeroBouton === 0) {
							aListeRessourcesSelectionnees.parcourir((D) => {
								const lElement = new ObjetElement_1.ObjetElement(
									D.getLibelle(),
									D.getNumero(),
									D.getGenre(),
								);
								lElement.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
								lListe.addElement(lElement);
							});
						}
						lParam.callback.call(this, aNumeroBouton === 0, lListe);
						lThis._actualiserAffichage();
					},
				},
				{
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"RessourcePedagogique.Destinataire",
					),
				},
			);
		lFenetre.setOptionsFenetreSelectionRessource({
			selectionObligatoire: true,
		});
		lFenetre.setDonnees({
			listeRessources: lListe,
			listeRessourcesSelectionnees:
				new ObjetListeElements_1.ObjetListeElements(),
			genreRessource: Enumere_Ressource_1.EGenreRessource.Niveau,
		});
		return true;
	}
	_getElementParLibelleRessourceEtGenre(aLibelle, aGenre, aElementaExclure) {
		let lResult = null;
		let lMatieresFiltre = null;
		const lProprietaire = this.etatUtilScoEspace.getUtilisateur();
		if (this.pourPartage) {
			lMatieresFiltre = this._getListePublicsSelectionnes();
		}
		this.listeRessources.parcourir((aElement) => {
			if (
				aElement.ressource &&
				(!aElementaExclure ||
					aElement.ressource.getNumero() !== aElementaExclure.getNumero()) &&
				aElement.editable &&
				aElement.existe() &&
				aGenre === aElement.getGenre() &&
				aElement.proprietaire &&
				lProprietaire.getGenre() === aElement.proprietaire.getGenre() &&
				lProprietaire.getNumero() === aElement.proprietaire.getNumero() &&
				aLibelle.toLowerCase() ===
					aElement.ressource.getLibelle().toLowerCase() &&
				(!lMatieresFiltre ||
					lMatieresFiltre.getElementParElement(aElement.matiere))
			) {
				lResult = aElement;
				return false;
			}
		});
		return lResult;
	}
	_getOptionsSelecFile(aEstAjoutDepuisSauvegarde) {
		return {
			maxSize: aEstAjoutDepuisSauvegarde
				? this.appScoEspace.droits.get(
						ObjetDroitsPN_1.TypeDroits.tailleMaxUpload,
					)
				: this.appScoEspace.droits.get(
						ObjetDroitsPN_1.TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
					),
			extensions: aEstAjoutDepuisSauvegarde ? ["zip"] : null,
			accept: aEstAjoutDepuisSauvegarde ? "application/zip" : "",
			avecTransformationFlux: !aEstAjoutDepuisSauvegarde,
		};
	}
	_getParamMenuContextuelSelecFile(aParams) {
		const lParametres = $.extend({ element: null, type: null }, aParams);
		const lAjoutSauvegarde =
			lParametres.type ===
			DonneesListe_RessourcesPedagogiquesProfesseur_1
				.DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu
				.ajoutSauvegarde;
		return {
			getOptionsSelecFile: this._getOptionsSelecFile.bind(
				this,
				lAjoutSauvegarde,
			),
			addFiles: (aParamsUpload) => {
				this._evenementInputFile(aParamsUpload, lParametres);
			},
		};
	}
	_evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				if (aParametres.article && aParametres.article.donnee) {
					const D = aParametres.article.donnee;
					if (
						D.getGenre() ===
						Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
							.travailRendu
					) {
						if (!!D.ressource) {
							ObjetFenetre_ListeTAFFaits_1.ObjetFenetre_ListeTAFFaits.ouvrir(
								{
									pere: this,
									evenement: this._evenementFenetreTAFARendre.bind(this),
								},
								D.ressource,
							);
						}
					}
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				if (!!aParametres.article.donnee) {
					if (
						aParametres.idColonne ===
						DonneesListe_RessourcesPedagogiquesProfesseur_1
							.DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.themes
					) {
						const lListeThemeOriginaux =
							new ObjetListeElements_1.ObjetListeElements();
						if (
							!!aParametres.article.donnee.ListeThemes &&
							aParametres.article.donnee.ListeThemes.count()
						) {
							aParametres.article.donnee.ListeThemes.parcourir((aTheme) => {
								aTheme.cmsActif = true;
								lListeThemeOriginaux.add(
									MethodesObjet_1.MethodesObjet.dupliquer(aTheme),
								);
							});
						}
						new ObjetRequeteListeTousLesThemes_1.ObjetRequeteListeTousLesThemes(
							this,
							this._ouvrirFenetreThemes.bind(
								this,
								aParametres.article.donnee,
								lListeThemeOriginaux,
							),
						).lancerRequete();
						break;
					} else {
						const lThis = this;
						const lFenetre =
							ObjetFenetre_EditionUrl_1.ObjetFenetre_EditionUrl.creerInstanceFenetreEditionUrl(
								{
									pere: this,
									evenement: (aValider, aParams) => {
										if (
											!!aParams &&
											!!aParams.bouton &&
											aParams.bouton.valider &&
											!!aParams.donnee
										) {
											const lDonnee = aParams.donnee;
											const lElmTrouve =
												lThis._getElementParLibelleRessourceEtGenre(
													lDonnee.libelle,
													Enumere_RessourcePedagogique_1
														.EGenreRessourcePedagogique.site,
													aParametres.article.donnee.ressource,
												);
											if (!!lElmTrouve) {
												this.appScoEspace
													.getMessage()
													.afficher({
														titre: ObjetTraduction_1.GTraductions.getValeur(
															"liste.editionImpossible",
														),
														message: ObjetTraduction_1.GTraductions.getValeur(
															"RessourcePedagogique.CeNomExisteDeja",
														),
													});
											} else {
												aParametres.article.donnee.ressource.setLibelle(
													lDonnee.libelle ? lDonnee.libelle : lDonnee.url,
												);
												aParametres.article.donnee.url = lDonnee.url;
												aParametres.article.donnee.commentaire =
													lDonnee.commentaire;
												aParametres.article.donnee.setEtat(
													Enumere_Etat_1.EGenreEtat.Modification,
												);
												lThis.setEtatSaisie(true);
												lThis._actualiserAffichage();
											}
										}
									},
								},
							);
						lFenetre.setDonnees({
							libelle:
								aParametres.article.donnee.ressource.getLibelle() !==
								aParametres.article.donnee.url
									? aParametres.article.donnee.ressource.getLibelle()
									: "",
							url: aParametres.article.donnee.url,
							commentaire: aParametres.article.donnee.commentaire,
						});
					}
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresCreation:
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresSuppression:
				this._actualiserAffichage();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation: {
				const lMessageCreationImpossible = this.getMessageCreationImpossible();
				if (lMessageCreationImpossible) {
					this.appScoEspace
						.getMessage()
						.afficher({ message: lMessageCreationImpossible });
					return Enumere_EvenementListe_1.EGenreEvenementListe.Creation;
				} else {
					this.ouvrirFenetreCreation();
				}
				break;
			}
		}
	}
	_evenementFenetreTAFARendre(aGenreBouton) {
		if (this.getEtatSaisie() !== true) {
			if (
				aGenreBouton ===
				ObjetFenetre_ListeTAFFaits_2.TypeBoutonFenetreTAFFaits.Fermer
			) {
				this._envoieRequete(true);
			}
		}
	}
	_getListePublicsSelectionnes() {
		const lListe = this.etatUtilScoEspace.Navigation.getRessources(
			this._getGenrePublicSelection(),
		);
		if (!lListe) {
			return new ObjetListeElements_1.ObjetListeElements();
		}
		return lListe;
	}
	_getListeMatieresSelonSelection() {
		let lListeMatieres = new ObjetListeElements_1.ObjetListeElements();
		const lThis = this;
		const lPublicSelectionne = this.etatUtilScoEspace.Navigation.getRessources(
			this._getGenrePublicSelection(),
		);
		if (lPublicSelectionne && lPublicSelectionne.count() > 0) {
			let lPublic = this.listeMatieresParRessource.getElementParElement(
				lPublicSelectionne.get(0),
			);
			if (lPublic) {
				lListeMatieres = lPublic.listeMatieres;
				lPublicSelectionne.parcourir((D) => {
					lPublic = lThis.listeMatieresParRessource.getElementParElement(D);
					if (lPublic) {
						lListeMatieres = lPublic.listeMatieres.getListeElements((D) => {
							return !!lListeMatieres.getElementParElement(D);
						});
					}
				});
			}
		}
		return lListeMatieres;
	}
	_ouvrirFenetreSelectionMatiere(aEvenement) {
		const lListeMatieres = this._getListeMatieresSelonSelection();
		if (lListeMatieres.count() > 1) {
			const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_SelectionMatiere_1.ObjetFenetre_SelectionMatiere,
				{
					pere: this,
					evenement: function (aNumeroBouton, aIndice, aNumeroMatiere) {
						if (aNumeroBouton === 1) {
							aEvenement(
								true,
								lListeMatieres.getElementParNumero(aNumeroMatiere),
							);
						} else {
							aEvenement(false);
						}
					},
				},
				{
					largeur: 250,
					hauteur: 250,
					listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
				},
			);
			lFenetre.setDonnees(lListeMatieres, false, false);
		} else if (lListeMatieres.count() === 1) {
			aEvenement(true, lListeMatieres.get(0), true);
		} else {
			this.appScoEspace.getMessage().afficher({
				message: this.getMessageCreationImpossible(),
				callback: function () {
					aEvenement(false);
				},
			});
		}
	}
	_ouvrirFenetreThemes(aRessource, aListeSelection, aJSON) {
		let lListeThemes = MethodesObjet_1.MethodesObjet.dupliquer(
			aJSON.listeTousLesThemes,
		);
		if (lListeThemes) {
			for (let i = 0; i < aListeSelection.count(); i++) {
				const lElm = lListeThemes.getElementParNumero(
					aListeSelection.getNumero(i),
				);
				if (lElm) {
					lElm.cmsActif = true;
					lElm.estMixte = aListeSelection.get(i).estMixte;
				}
			}
		} else {
			lListeThemes = new ObjetListeElements_1.ObjetListeElements();
		}
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_ListeThemes_1.ObjetFenetre_ListeThemes,
			{
				pere: this,
				evenement: function (aGenreBouton, aChangementListe) {
					lFenetre.fermer();
					if (aGenreBouton === 1) {
						const lListeActif = aChangementListe.getListeElements(
							(aElement) => {
								return aElement.cmsActif;
							},
						);
						aRessource.ListeThemes = lListeActif;
						aRessource.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						this.setEtatSaisie(true);
						this.getInstance(this.identListe).actualiser(true);
					}
				},
			},
		);
		lFenetre.setDonnees({
			listeThemes: lListeThemes,
			matiereContexte: aRessource.matiere || aJSON.matiereNonDesignee,
			listeMatieres: aJSON.listeMatieres,
			tailleLibelleTheme: aJSON.tailleLibelleTheme,
			libelleCB: aRessource.libelleCBTheme,
			matiereNonDesignee: aJSON.matiereNonDesignee,
		});
	}
	getMessageCreationImpossible() {
		let lMessageCreationImpossible = "";
		if (
			!this.pourPartage &&
			this._getListeMatieresSelonSelection().count() === 0
		) {
			const lListePublics = this._getListePublicsSelectionnes();
			lMessageCreationImpossible =
				lListePublics.count() === 1
					? lListePublics.get(0).getGenre() ===
						Enumere_Ressource_1.EGenreRessource.Classe
						? ObjetTraduction_1.GTraductions.getValeur(
								"RessourcePedagogique.AucuneMatierePourLaClasse",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"RessourcePedagogique.AucuneMatierePourLeGroupe",
							)
					: this._getEnsembleGenrePublicDeListePublic(lListePublics).contains(
								Enumere_Ressource_1.EGenreRessource.Classe,
							)
						? ObjetTraduction_1.GTraductions.getValeur(
								"RessourcePedagogique.AucuneMatiereClasse",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"RessourcePedagogique.AucuneMatiereGroupe",
							);
		}
		return lMessageCreationImpossible;
	}
	_reponseRequeteRessourcePedagogique(
		aAvecDonnees,
		aListeMatieres,
		aListeRessources,
		aListeMatieresParRessource,
		aAfficherCumul,
		aJSON,
	) {
		if (aAvecDonnees) {
			this._avecDonnees = true;
			this.listeRessources = aListeRessources;
			if (this.pourPartage) {
				const lListeRessources = (this.listeRessources =
					new ObjetListeElements_1.ObjetListeElements());
				aListeRessources.parcourir((aRessource) => {
					let lRessourceTrouve = null;
					if (
						aRessource.editable &&
						aRessource.ressource &&
						aRessource.matiere &&
						aRessource.proprietaire
					) {
						lListeRessources.parcourir((aElementCherche) => {
							if (
								aRessource.editable === aElementCherche.editable &&
								aElementCherche.ressource &&
								aRessource.ressource.getNumero() ===
									aElementCherche.ressource.getNumero() &&
								aRessource.ressource.getGenre() ===
									aElementCherche.ressource.getGenre() &&
								aRessource.getGenre() === aElementCherche.getGenre() &&
								aElementCherche.proprietaire &&
								aRessource.proprietaire.getGenre() ===
									aElementCherche.proprietaire.getGenre() &&
								aRessource.proprietaire.getNumero() ===
									aElementCherche.proprietaire.getNumero() &&
								aRessource.matiere &&
								aRessource.matiere.getNumero() ===
									aElementCherche.matiere.getNumero()
							) {
								lRessourceTrouve = aElementCherche;
								return false;
							}
						});
					}
					if (lRessourceTrouve) {
						aRessource.listeNiveaux.parcourir((aNiveau) => {
							if (
								!lRessourceTrouve.listeNiveaux.getElementParElement(aNiveau)
							) {
								lRessourceTrouve.listeNiveaux.addElement(aNiveau);
							}
						});
					} else {
						lListeRessources.addElement(aRessource);
					}
				}, this);
			}
			this.afficherCumul = aAfficherCumul;
			this.listeDocumentsUpload = new ObjetListeElements_1.ObjetListeElements();
			this.listeMatieresParRessource = aListeMatieresParRessource;
			this.listeNiveaux = aJSON.listeNiveaux;
		} else {
			if (aListeMatieresParRessource) {
				aListeMatieresParRessource.parcourir((aPublic) => {
					const lPublic =
						this.listeMatieresParRessource.getElementParElement(aPublic);
					if (lPublic && aPublic.listeMatieres) {
						lPublic.listeMatieres = aPublic.listeMatieres;
					}
				});
			}
		}
		ObjetHtml_1.GHtml.setDisplay(this.idTout, true);
		ObjetHtml_1.GHtml.setDisplay(this.idMessage, false);
		this._actualiserAffichage();
	}
	_envoieRequete(aViderDonnees) {
		if (aViderDonnees) {
			this._avecDonnees = false;
		}
		const lListePublic = this._getListePublicsSelectionnes();
		if (lListePublic.count() > 0) {
			const lAvecDonnees = !this._avecDonnees;
			new ObjetRequeteRessourcePedagogique_1.ObjetRequeteRessourcePedagogique(
				this,
				this._reponseRequeteRessourcePedagogique.bind(this, lAvecDonnees),
			).lancerRequete({
				avecRessourcesPronote: true,
				avecRessourcesEditeur: true,
				listePublic: lListePublic,
				avecDonnees: lAvecDonnees,
			});
		}
	}
	_confirmationMessageChoixCreation(aBouton, aRemplacer, aFichier, aRessource) {
		if (aBouton !== 0) {
			return;
		}
		if (aRemplacer) {
			if (this.pourPartage) {
				this._ouvrirFenetreSelectionNiveaux({
					elementDoublon: aRessource,
					callback: (aReussite, aListeNiveaux) => {
						if (aReussite) {
							aRessource.fichier = aFichier;
							this.listeDocumentsUpload.addElement(aFichier);
							this._surModificationAjouterDestinatairesDansRessource(
								aRessource,
								aListeNiveaux,
							);
						}
					},
				});
				return;
			} else {
				aRessource.fichier = aFichier;
				this.listeDocumentsUpload.addElement(aFichier);
				this._surModificationAjouterDestinatairesDansRessource(aRessource);
			}
		} else {
			let lCompteur = 1;
			const lNomFichier = ObjetChaine_1.GChaine.extraireNomFichier(
				aFichier.Libelle,
			);
			const lExtension = ObjetChaine_1.GChaine.extraireExtensionFichier(
				aFichier.Libelle,
			);
			let lLibelle = aFichier.Libelle;
			while (
				this._getElementParLibelleRessourceEtGenre(
					lLibelle,
					Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
						.documentJoint,
				)
			) {
				lLibelle = lNomFichier + "_" + lCompteur + "." + lExtension;
				lCompteur += 1;
			}
			this._confirmerCreationRessourcePJ(aFichier, lLibelle);
		}
	}
	_getEnsembleGenrePublicDeListePublic(aListePublics) {
		const lEnsemble = new TypeEnsembleNombre_1.TypeEnsembleNombre();
		if (aListePublics) {
			aListePublics.parcourir((D) => {
				lEnsemble.add(D.getGenre());
			});
		}
		return lEnsemble;
	}
	_gererMessageDoublonFichier(aFichier, aRessource) {
		let lRemplacer = false;
		const lGetModel = (aChoix) => {
			return () => {
				return {
					getValue() {
						return lRemplacer === aChoix;
					},
					setValue() {
						lRemplacer = aChoix;
					},
					getName: () => {
						return `${this.Nom}_MessageDoublonFichier`;
					},
				};
			};
		};
		const H = [];
		let lGenresRessource;
		let lTraduction = "";
		let lDestinataires = "";
		if (this.pourPartage) {
			lTraduction = ObjetChaine_1.GChaine.format(
				ObjetTraduction_1.GTraductions.getValeur(
					"RessourcePedagogique.DocumentIdentique_Niveau_S",
				),
				[
					"",
					"",
					aRessource.listeNiveaux
						.getTableauLibelles(null, true, true)
						.sort()
						.join(", "),
				],
			);
		} else {
			lGenresRessource = this._getEnsembleGenrePublicDeListePublic(
				aRessource.listePublics,
			);
			lDestinataires = aRessource.listePublics
				.getTableauLibelles(null, true, true)
				.sort()
				.join(", ");
			if (
				lGenresRessource.contains(Enumere_Ressource_1.EGenreRessource.Classe)
			) {
				lTraduction = ObjetChaine_1.GChaine.format(
					ObjetTraduction_1.GTraductions.getValeur(
						"RessourcePedagogique.DocumentIdentique_Classe_S",
					),
					[lDestinataires],
				);
			} else {
				lTraduction = ObjetChaine_1.GChaine.format(
					ObjetTraduction_1.GTraductions.getValeur(
						"RessourcePedagogique.DocumentIdentique_Groupe_S",
					),
					["", lDestinataires],
				);
			}
		}
		H.push(lTraduction, "<br /><br />");
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"ie-radio",
					{ "ie-model": lGetModel(true), class: "NoWrap PetitEspaceHaut" },
					ObjetTraduction_1.GTraductions.getValeur(
						"RessourcePedagogique.RemplacerDocExistant",
					),
				),
				IE.jsx.str(
					"ie-radio",
					{ "ie-model": lGetModel(false), class: "NoWrap EspaceHaut" },
					ObjetTraduction_1.GTraductions.getValeur(
						"RessourcePedagogique.ConserverDocExistant",
					),
				),
				IE.jsx.str("br", null),
				IE.jsx.str("br", null),
			),
		);
		this.appScoEspace
			.getMessage()
			.afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				message: H.join(""),
			})
			.then((aBouton) => {
				this._confirmationMessageChoixCreation(
					aBouton,
					lRemplacer,
					aFichier,
					aRessource,
				);
			});
	}
	_confirmerCreationRessourcePJ(aFichier, aLibelle) {
		const lThis = this;
		if (this.pourPartage) {
			this._ouvrirFenetreSelectionNiveaux({
				elementDoublon: lThis._getElementParLibelleRessourceEtGenre(
					aLibelle,
					Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
						.documentJoint,
				),
				callback: function (aReussite, aListeNiveaux) {
					if (!aReussite) {
						return;
					}
					lThis.listeDocumentsUpload.addElement(aFichier);
					lThis.listeRessources.addElement(
						DonneesListe_RessourcesPedagogiquesProfesseur_1.DonneesListe_RessourcesPedagogiquesProfesseur.creerElement(
							{
								libelle: aLibelle,
								fichier: aFichier,
								matiere: lThis._getListePublicsSelectionnes().get(0),
								listeNiveaux: aListeNiveaux,
								genreCreation:
									Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
										.documentJoint,
								listePublics: lThis._getListePublicsSelectionnes(),
							},
						),
					);
					lThis.setEtatSaisie(true);
				},
			});
		} else {
			this._ouvrirFenetreSelectionMatiere((aReussite, aMatiere) => {
				if (aReussite) {
					lThis.listeDocumentsUpload.addElement(aFichier);
					lThis.listeRessources.addElement(
						DonneesListe_RessourcesPedagogiquesProfesseur_1.DonneesListe_RessourcesPedagogiquesProfesseur.creerElement(
							{
								libelle: aLibelle,
								fichier: aFichier,
								matiere: aMatiere,
								genreCreation:
									Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
										.documentJoint,
								listePublics: lThis._getListePublicsSelectionnes(),
							},
						),
					);
					lThis.setEtatSaisie(true);
					lThis._actualiserAffichage();
				}
			});
		}
	}
	_saisieImport(
		aListeIdents,
		aListeDestinataires,
		aLibelleFichier,
		aMatiere,
		aParametresImport,
	) {
		const lImport = {
			idents: aListeIdents,
			pourPartage: this.pourPartage,
			libelleFichier: aLibelleFichier,
			idFichier: aParametresImport.nomFichier,
			listePublics: aListeDestinataires.setSerialisateurJSON({
				ignorerEtatsElements: true,
			}),
			matiere: aMatiere,
		};
		this._saisie(lImport);
	}
	_saisieAnnulerImport(aParametresImport) {
		if (aParametresImport.import) {
			new ObjetRequeteSaisieRessourcePedagogique_1.ObjetRequeteSaisieRessourcePedagogique(
				this,
				() => {},
			).lancerRequete({ annulerImport: true });
		}
	}
	_reponseUploadFichier(aLibelleFichier, aSuccesSaisie) {
		if (!aSuccesSaisie) {
			return;
		}
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SelectionImportRessourcePedagogique_1.ObjetFenetre_SelectionImportRessourcePedagogique,
			{
				pere: this,
				evenement: (aValider, aParametres, aListeIdents) => {
					if (!aValider || !aListeIdents || aListeIdents.length === 0) {
						this._saisieAnnulerImport(aParametres);
						return;
					}
					if (this.pourPartage) {
						this._ouvrirFenetreSelectionNiveaux({
							elementDoublon: null,
							callback: (aReussite, aListeNiveaux) => {
								if (!aReussite) {
									this._saisieAnnulerImport(aParametres);
									return;
								}
								this._saisieImport(
									aListeIdents,
									aListeNiveaux,
									aLibelleFichier,
									this._getListePublicsSelectionnes().get(0),
									aParametres,
								);
							},
						});
					} else {
						this._saisieImport(
							aListeIdents,
							this._getListePublicsSelectionnes(),
							aLibelleFichier,
							null,
							aParametres,
						);
					}
				},
			},
		).setDonnees(aSuccesSaisie.JSONReponse);
	}
	_evenementInputFile(aParamUpload, aParametres) {
		if (
			aParamUpload.eltFichier.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
		) {
			if (
				aParametres.type ===
				DonneesListe_RessourcesPedagogiquesProfesseur_1
					.DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu
					.ajoutSauvegarde
			) {
				const lListe = new ObjetListeElements_1.ObjetListeElements();
				lListe.addElement(aParamUpload.eltFichier);
				new ObjetRequeteSaisieRessourcePedagogique_1.ObjetRequeteSaisieRessourcePedagogique(
					this,
					this._reponseUploadFichier.bind(
						this,
						aParamUpload.eltFichier.Libelle,
					),
				)
					.addUpload({ listeFichiers: lListe })
					.lancerRequete({ choixImport: true, pourPartage: this.pourPartage });
				return;
			}
			const lDoublon = this._getElementParLibelleRessourceEtGenre(
				aParamUpload.eltFichier.Libelle,
				Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.documentJoint,
			);
			if (
				aParametres.type ===
					DonneesListe_RessourcesPedagogiquesProfesseur_1
						.DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu
						.remplacerDoc &&
				aParametres.element
			) {
				if (lDoublon) {
					this.appScoEspace
						.getMessage()
						.afficher({
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"liste.editionImpossible",
							),
							message: ObjetTraduction_1.GTraductions.getValeur(
								"RessourcePedagogique.CeNomExisteDeja",
							),
						});
					return;
				}
				this.listeDocumentsUpload.addElement(aParamUpload.eltFichier);
				aParametres.element.setLibelle(aParamUpload.eltFichier.Libelle);
				aParametres.element.ressource.setLibelle(
					aParamUpload.eltFichier.Libelle,
				);
				aParametres.element.fichier = aParamUpload.eltFichier;
				aParametres.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.setEtatSaisie(true);
				this._actualiserAffichage();
				return;
			}
			if (lDoublon) {
				this._gererMessageDoublonFichier(aParamUpload.eltFichier, lDoublon);
			} else {
				this._confirmerCreationRessourcePJ(
					aParamUpload.eltFichier,
					aParamUpload.eltFichier.Libelle,
				);
			}
		}
	}
	_saisie(aImport) {
		this.setEtatSaisie(false);
		new ObjetRequeteSaisieRessourcePedagogique_1.ObjetRequeteSaisieRessourcePedagogique(
			this,
			this.actionSurValidation,
		)
			.addUpload({ listeFichiers: this.listeDocumentsUpload })
			.lancerRequete({ depot: this.listeRessources, import: aImport });
	}
}
exports.InterfaceRessourcePedagogique_Professeur =
	InterfaceRessourcePedagogique_Professeur;
