exports.ObjetFenetre_ListeCategoriesDiscussion = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetRequeteJSON_2 = require("ObjetRequeteJSON");
const DonneesListe_CategoriesDiscussion_1 = require("DonneesListe_CategoriesDiscussion");
const ObjetFenetre_SelecteurCouleur_1 = require("ObjetFenetre_SelecteurCouleur");
const AccessApp_1 = require("AccessApp");
const TypeOrigineCreationEtiquetteMessage_1 = require("TypeOrigineCreationEtiquetteMessage");
const ObjetElement_1 = require("ObjetElement");
class ObjetRequeteSaisieEtiquetteMessage extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
CollectionRequetes_1.Requetes.inscrire(
	"SaisieEtiquetteMessage",
	ObjetRequeteSaisieEtiquetteMessage,
);
class ObjetFenetre_ListeCategoriesDiscussion extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.setOptionsFenetre({ largeur: 350 });
		this.parametres = {};
	}
	construireInstances() {
		this.IdentListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListe.bind(this),
		);
	}
	setDonnees(aParametres) {
		this.parametres = Object.assign(
			{ listeMessages: null, listeEtiquettes: null },
			aParametres,
		);
		this.setOptionsFenetre({
			titre: this.parametres.listeMessages
				? ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.categorie.SelectionnerCategorieEtiquette",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.categorie.EditerCategorieEtiquette",
					),
			listeBoutons: this.parametres.listeMessages
				? [
						ObjetTraduction_1.GTraductions.getValeur("Annuler"),
						ObjetTraduction_1.GTraductions.getValeur("Valider"),
					]
				: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
		this.afficher();
		const lColonnes = [];
		if (this.parametres.listeMessages) {
			lColonnes.push({
				id: DonneesListe_CategoriesDiscussion_1
					.DonneesListe_CategoriesDiscussion.colonnes.coche,
				titre: "",
				taille: 20,
			});
		}
		lColonnes.push(
			{
				id: DonneesListe_CategoriesDiscussion_1
					.DonneesListe_CategoriesDiscussion.colonnes.couleur,
				titre: { classeCssImage: "Image_PaletteDesCouleurs" },
				taille: 18,
			},
			{
				id: DonneesListe_CategoriesDiscussion_1
					.DonneesListe_CategoriesDiscussion.colonnes.nom,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"Messagerie.categorie.Nom",
				),
				taille: "100%",
			},
			{
				id: DonneesListe_CategoriesDiscussion_1
					.DonneesListe_CategoriesDiscussion.colonnes.abr,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"Messagerie.categorie.Abrev",
				),
				taille: IE.estMobile ? 45 : 40,
			},
		);
		this.getInstance(this.IdentListe).setOptionsListe({
			colonnes: lColonnes,
			avecLigneCreation: !this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.estEnConsultation,
			),
			listeCreations: [
				DonneesListe_CategoriesDiscussion_1.DonneesListe_CategoriesDiscussion
					.colonnes.nom,
			],
			titreCreation: IE.estMobile
				? ObjetTraduction_1.GTraductions.getValeur("liste.nouveau")
				: ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.categorie.CreerCategorieEtiquette",
					),
			boutons: IE.estMobile
				? []
				: [{ genre: ObjetListe_1.ObjetListe.typeBouton.supprimer }],
			nonEditable: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.estEnConsultation,
			),
			hauteurAdapteContenu: true,
			hauteurMaxAdapteContenu: 500,
		});
		this._actualiserListe();
		this.positionnerFenetre();
	}
	composeContenu() {
		const T = [];
		T.push(IE.jsx.str("div", { id: this.getNomInstance(this.IdentListe) }));
		return T.join("");
	}
	surValidation(aNumeroBouton) {
		if (this._saisieEnCours) {
			return;
		}
		Promise.resolve()
			.then(() => {
				if (this.parametres.listeMessages && aNumeroBouton === 1) {
					const lListePossessions =
						new ObjetListeElements_1.ObjetListeElements();
					this.parametres.listeMessages.parcourir((aMessage) => {
						if (aMessage.possessionMessage) {
							lListePossessions.addElement(aMessage.possessionMessage);
						} else if (aMessage.listePossessionsMessages) {
							lListePossessions.add(aMessage.listePossessionsMessages);
						} else {
						}
					});
					const lListeEtiquettesPlus =
							new ObjetListeElements_1.ObjetListeElements(),
						lListeEtiquettesMoins =
							new ObjetListeElements_1.ObjetListeElements();
					this.getInstance(this.IdentListe)
						.getListeArticles()
						.parcourir((aArticle) => {
							if (
								aArticle.getEtat() === Enumere_Etat_1.EGenreEtat.Modification
							) {
								switch (aArticle.coche) {
									case ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Aucune:
										lListeEtiquettesMoins.addElement(aArticle.etiquette);
										break;
									case ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Verte:
										lListeEtiquettesPlus.addElement(aArticle.etiquette);
										break;
									default:
								}
							}
						});
					if (
						lListeEtiquettesPlus.count() > 0 ||
						lListeEtiquettesMoins.count() > 0
					) {
						return this._saisie({
							commande: "modifierEtiquettesMessages",
							listePossessionsMessages: lListePossessions.setSerialisateurJSON({
								ignorerEtatsElements: true,
							}),
							listeEtiquettesPlus: lListeEtiquettesPlus.setSerialisateurJSON({
								ignorerEtatsElements: true,
							}),
							listeEtiquettesMoins: lListeEtiquettesMoins.setSerialisateurJSON({
								ignorerEtatsElements: true,
							}),
						});
					}
				}
			})
			.then(() => {
				this.fermer();
			});
	}
	_saisie(aParametres) {
		const lListe = this.getInstance(this.IdentListe);
		let lSelections = lListe.getListeElementsSelection();
		this._saisieEnCours = true;
		return new ObjetRequeteSaisieEtiquetteMessage(this)
			.lancerRequete(aParametres)
			.then(
				(aParams) => {
					if (
						aParams &&
						aParams.genreReponse ===
							ObjetRequeteJSON_2.EGenreReponseSaisie.succes
					) {
						this.optionsFenetre.surSaisieEtiquette();
						if (aParams.JSONReponse && aParams.JSONReponse.listeEtiquettes) {
							this.parametres.listeEtiquettes =
								aParams.JSONReponse.listeEtiquettes.trier();
						}
						if (
							aParametres.commande === "creation" &&
							aParams.JSONRapportSaisie &&
							aParams.JSONRapportSaisie.etiquetteCree
						) {
							lSelections =
								new ObjetListeElements_1.ObjetListeElements().addElement(
									aParams.JSONRapportSaisie.etiquetteCree,
								);
						}
					}
					return aParams;
				},
				() => {},
			)
			.then(() => {
				this._actualiserListe();
				lListe.setListeElementsSelection(lSelections);
			})
			.finally(() => {
				delete this._saisieEnCours;
			});
	}
	_evenementSurListe(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				switch (aParams.idColonne) {
					case DonneesListe_CategoriesDiscussion_1
						.DonneesListe_CategoriesDiscussion.colonnes.couleur:
						ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_SelecteurCouleur_1.ObjetFenetre_SelecteurCouleur,
							{
								pere: this,
								evenement: function (aGenreBouton, aCouleur) {
									if (aGenreBouton === 1) {
										if (aParams.article.etiquette.couleur !== aCouleur) {
											this._saisie({
												commande: "couleur",
												etiquette: aParams.article.etiquette,
												couleur: aCouleur,
											});
										}
									}
								},
							},
						).setDonnees(aParams.article.etiquette.couleur);
						break;
					default:
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				switch (aParams.idColonne) {
					case DonneesListe_CategoriesDiscussion_1
						.DonneesListe_CategoriesDiscussion.colonnes.nom:
						if (
							aParams.article.getLibelle() &&
							aParams.article.getLibelle() !==
								aParams.article.etiquette.getLibelle()
						) {
							this._saisie({
								commande: "libelle",
								etiquette: aParams.article.etiquette,
								libelle: aParams.article.getLibelle(),
							});
						}
						break;
					case DonneesListe_CategoriesDiscussion_1
						.DonneesListe_CategoriesDiscussion.colonnes.abr:
						if (aParams.article.abr !== aParams.article.etiquette.abr) {
							this._saisie({
								commande: "abr",
								etiquette: aParams.article.etiquette,
								abr: aParams.article.abr,
							});
						}
						break;
					default:
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresCreation:
				this._saisie({
					commande: "creation",
					libelle: aParams.article.getLibelle(),
				});
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				this._saisie({
					commande: "suppression",
					etiquette: aParams.article.etiquette,
				});
				break;
		}
	}
	_actualiserListe() {
		const lListe = this.getInstance(this.IdentListe);
		const lOldListeAffichage = lListe.getDonneesListe()
			? lListe.getListeArticles()
			: null;
		const lListeDonneesListe = this.formatterDonnees(
			this.parametres.listeEtiquettes,
			this.parametres.listeMessages,
			lOldListeAffichage,
		);
		lListe.setDonnees(
			new DonneesListe_CategoriesDiscussion_1.DonneesListe_CategoriesDiscussion(
				lListeDonneesListe,
			),
		);
	}
	formatterDonnees(aListeEtiquettes, aListeMessages, aOldListeAffichage) {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		aListeEtiquettes.parcourir((aEtiquette) => {
			if (
				!TypeOrigineCreationEtiquetteMessage_1.TypeOrigineCreationEtiquetteMessageUtil.estEtiquettePerso(
					aEtiquette.getGenre(),
				)
			) {
				return true;
			}
			const lElement = new ObjetElement_1.ObjetElement(
				aEtiquette.getLibelle(),
				aEtiquette.getNumero(),
			);
			lElement.estPerso = aEtiquette.estPerso;
			lElement.etiquette = aEtiquette;
			lListe.addElement(lElement);
			lElement.coche = ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Aucune;
			let lInit = false;
			if (aListeMessages) {
				aListeMessages.parcourir((aMessage) => {
					let lEtiquetteExiste = null;
					if (aMessage && aMessage.listeEtiquettes) {
						lEtiquetteExiste = aMessage.listeEtiquettes.getElementParNumero(
							aEtiquette.getNumero(),
						);
					}
					if (
						!lEtiquetteExiste &&
						lElement.coche ===
							ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Verte
					) {
						lElement.coche =
							ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Grise;
						return false;
					}
					if (
						lEtiquetteExiste &&
						lElement.coche ===
							ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Aucune
					) {
						lElement.coche = lInit
							? ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Grise
							: ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Verte;
					}
					if (
						lElement.coche ===
						ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Grise
					) {
						return false;
					}
					lInit = true;
				});
			}
			if (aOldListeAffichage) {
				const lOldEtiquette = aOldListeAffichage.getElementParNumeroEtGenre(
					lElement.getNumero(),
				);
				if (
					lOldEtiquette &&
					lOldEtiquette.getEtat() === Enumere_Etat_1.EGenreEtat.Modification &&
					lElement.coche !== lOldEtiquette.coche
				) {
					lElement.coche = lOldEtiquette.coche;
					lElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
			}
		});
		return lListe;
	}
}
exports.ObjetFenetre_ListeCategoriesDiscussion =
	ObjetFenetre_ListeCategoriesDiscussion;
