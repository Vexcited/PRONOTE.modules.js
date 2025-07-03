exports.InterfacePageDossiers_Saisie = void 0;
const _InterfacePageDossiers_1 = require("_InterfacePageDossiers");
const ObjetFenetre_DossierVieScolaire_1 = require("ObjetFenetre_DossierVieScolaire");
const ObjetFenetre_Punition_1 = require("ObjetFenetre_Punition");
const ObjetFenetre_Correspondance_1 = require("ObjetFenetre_Correspondance");
const ObjetRequeteSaisieDossierVS_1 = require("ObjetRequeteSaisieDossierVS");
const ObjetRequetePageDossiers_Fenetre_1 = require("ObjetRequetePageDossiers_Fenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const Cache_1 = require("Cache");
const DonneesListe_Dossiers_1 = require("DonneesListe_Dossiers");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const ObjetDossiersRecapitulatif_1 = require("ObjetDossiersRecapitulatif");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_ElementDossier_1 = require("Enumere_ElementDossier");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetDate_1 = require("ObjetDate");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const TypeGenreCategorieDossier_1 = require("TypeGenreCategorieDossier");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Discussion_1 = require("ObjetFenetre_Discussion");
const ObjetTri_1 = require("ObjetTri");
const ObjetRequeteListePublics_1 = require("ObjetRequeteListePublics");
const ObjetFenetre_Message_1 = require("ObjetFenetre_Message");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const MethodesObjet_1 = require("MethodesObjet");
const GlossaireDossierVieScolaire_1 = require("GlossaireDossierVieScolaire");
class InterfacePageDossiers_Saisie extends _InterfacePageDossiers_1._InterfacePageDossiers {
	constructor(...aParams) {
		super(...aParams);
		this.avecDroitCreerMotif = this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.dossierVS.saisieMotifsDossiersVS,
		);
	}
	construireInstances() {
		super.construireInstances();
		this.IdentTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this.surEvenementTripleCombo,
			this.initialiserTripleCombo,
		);
		this.IdPremierElement = this.getInstance(
			this.IdentTripleCombo,
		).getPremierElement();
		this.IdentRecapitulatif = this.add(
			ObjetDossiersRecapitulatif_1.ObjetDossiersRecapitulatif,
			this._surEvenementRecapitulatif.bind(this),
		);
		this.identFenetreDossier = this.addFenetre(
			ObjetFenetre_DossierVieScolaire_1.ObjetFenetre_DossierVieScolaire,
			this.evenementSurFenetreDossier,
			this._initialiserFenetreDossier,
		);
		this.identFenetrePunition = this.addFenetre(
			ObjetFenetre_Punition_1.ObjetFenetre_Punition,
			this.evenementSurPunition,
			this._initialiserFenetrePunition,
		);
		this.identFenetreCorrespondance = this.addFenetre(
			ObjetFenetre_Correspondance_1.ObjetFenetre_Correspondance,
			this.evenementSurCorrespondance,
			this._initialiserFenetreCorrespondance,
		);
		this.construireFicheEleveEtFichePhoto();
	}
	detruireInstances() {
		Cache_1.GCache.dossierVS.vider();
	}
	completerAddSurZone() {
		this.AddSurZone.push(this.IdentTripleCombo);
		if (this.avecFicheEleve()) {
			this.AddSurZone.push({ separateur: true });
		}
		this.addSurZoneFicheEleve();
		this.addSurZonePhotoEleve();
	}
	initialiserTripleCombo(aInstance) {
		aInstance.setParametres([
			Enumere_Ressource_1.EGenreRessource.Classe,
			Enumere_Ressource_1.EGenreRessource.Periode,
			Enumere_Ressource_1.EGenreRessource.Eleve,
		]);
	}
	surEvenementTripleCombo() {
		this.surSelectionEleve();
		this.lancerRequeteDonnees();
	}
	_initialiserFenetreDossier(aInstance) {
		aInstance.setOptionsFenetre({
			titre:
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
					.TitreFenetreCreationDossier,
			largeur: 700,
			hauteur: 250,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	evenementSurFenetreDossier(
		aGenreBouton,
		aDossier,
		aListePJEleve,
		aListeCategories,
	) {
		if (aGenreBouton === 1) {
			switch (aDossier.Genre) {
				case TypeGenreCategorieDossier_1.TypeGenreCategorieDossier.CD_Social:
					aDossier.lieu = new ObjetElement_1.ObjetElement("", 0);
					aDossier.temoin = new ObjetElement_1.ObjetElement("", 0);
					aDossier.victime = new ObjetElement_1.ObjetElement("", 0);
					break;
				case TypeGenreCategorieDossier_1.TypeGenreCategorieDossier.CD_Sante:
					aDossier.victime = new ObjetElement_1.ObjetElement("", 0);
					break;
			}
			if (aDossier.Etat === Enumere_Etat_1.EGenreEtat.Creation) {
				this.ListeDossiers.addElement(aDossier);
				this.ListeDossiers.trier();
			}
			this.listePJEleve = aListePJEleve;
			this.ListeDossiers.addElement(
				aDossier,
				this.ListeDossiers.getIndiceParNumeroEtGenre(aDossier.Numero),
			);
			this.dossierCourant = this.ListeDossiers.getElementParNumeroEtGenre(
				aDossier.Numero,
			);
			if (this.dossierCourant.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun) {
				this.setEtatSaisie(true);
			}
			this.valider(aListeCategories);
		}
	}
	_initialiserFenetrePunition(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur("fenetrePunition.titre"),
			largeur: 650,
			hauteur: 320,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	evenementSurPunition(aNumeroBouton, aElement) {
		if (aNumeroBouton === 1) {
			if (aElement.existeNumero()) {
				const lElement = this.creerElementDossier(
					aElement.Numero,
					Enumere_ElementDossier_1.EGenreElementDossier.Punition,
				);
				lElement.Libelle = aElement.naturePunition.Libelle;
				lElement.element.commentaire = aElement.commentaire;
				lElement.commentaire = aElement.circonstance;
				lElement.element.listeMotifs = aElement.listeMotifs;
				lElement.element.respAdmin = aElement.demandeur
					? aElement.demandeur
					: new ObjetElement_1.ObjetElement("", 0);
				lElement.element.date = aElement.dateDemande;
				lElement.date = aElement.dateDemande;
				lElement.strDate = ObjetDate_1.GDate.formatDate(
					lElement.date,
					ObjetTraduction_1.GTraductions.getValeur("Le_Maj") + " %JJ/%MM/%AAAA",
				);
				lElement.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				this.dossierCourant.listeElements.addElement(lElement);
				this.dossierCourant.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.setEtatSaisie(true);
				const ListeDossiersMiseEnForme =
					new ObjetListeElements_1.ObjetListeElements();
				this.ListeDossiers.parcourir((aDossier) => {
					aDossier.estDossier = true;
					ListeDossiersMiseEnForme.addElement(aDossier);
					if (aDossier) {
						aDossier.listeElements.parcourir((aElement) => {
							aElement.pere = aDossier;
							aElement.estDossier = false;
							aDossier.estUnDeploiement = true;
							aDossier.estDeploye = true;
							ListeDossiersMiseEnForme.addElement(aElement);
						});
					}
				});
				this.getInstance(this.identListeDossiers).setDonnees(
					new DonneesListe_Dossiers_1.DonneesListe_Dossiers(
						ListeDossiersMiseEnForme,
						this.getCallbackDeListe(),
					),
				);
			}
		}
	}
	_initialiserFenetreCorrespondance(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreCorrespondance.titre",
			),
			largeur: 400,
			hauteur: 300,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	evenementSurCorrespondance(aNumeroBouton, aElement, aListePJ) {
		if (aNumeroBouton === 1) {
			this.elementCourant.element = aElement;
			this.elementCourant.Libelle = aElement.type.Libelle;
			this.elementCourant.date = aElement.date;
			this.elementCourant.strDate = ObjetDate_1.GDate.formatDate(
				aElement.date,
				ObjetTraduction_1.GTraductions.getValeur("Le_Maj") + " %JJ/%MM/%AAAA",
			);
			this.elementCourant.typeOrigineCreationMedia = aElement.type.getGenre();
			this.elementCourant.commentaire = aElement.commentaire;
			this.elementCourant.interlocuteur = aElement.interlocuteur;
			this.elementCourant.element.respAdmin = aElement.element.respAdmin;
			this.elementCourant.avecReponseCourrier = aElement.avecReponseCourrier;
			if (aElement.element.Etat === Enumere_Etat_1.EGenreEtat.Creation) {
				this.elementCourant.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				this.dossierCourant.listeElements.addElement(this.elementCourant);
			} else {
				this.elementCourant.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			}
			this.elementCourant.listePJ = aElement.listePJ;
			this.listePJEleve = aListePJ;
			this.dossierCourant.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.setEtatSaisie(true);
			this.valider();
		}
	}
	getParametresRequete() {
		const lPeriode = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Periode,
		);
		const lParamsRequete = {
			eleve: this._getEleveSelectionne(),
			periode: lPeriode,
			afficherAnneesPrecedentes: false,
		};
		if (
			!!this.afficherAnneesPrecedentes &&
			!!lPeriode &&
			!lPeriode.existeNumero()
		) {
			lParamsRequete.afficherAnneesPrecedentes = this.afficherAnneesPrecedentes;
		}
		return lParamsRequete;
	}
	_getEleveSelectionne() {
		return this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Eleve,
		);
	}
	valider(aListeCategories) {
		new ObjetRequeteSaisieDossierVS_1.ObjetRequeteSaisieDossierVS(
			this,
			this.actionSurValidation,
		)
			.addUpload({ listeFichiers: this.listePJEleve })
			.lancerRequete({
				listePJ: this.listePJEleve,
				listeDossiers: this.ListeDossiers,
				eleve: this.etatUtilisateurSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Eleve,
				),
				listeCategories: aListeCategories,
			});
	}
	actionSurValidation() {
		this.setEtatSaisie(false);
		this.lancerRequeteDonnees();
	}
	initialiserListe(aInstance) {
		const lColonnes = [
			{
				id: DonneesListe_Dossiers_1.DonneesListe_Dossiers.colonnes.evenement,
				titre:
					GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
						.Evenement,
				taille: 120,
			},
			{
				id: DonneesListe_Dossiers_1.DonneesListe_Dossiers.colonnes.date,
				titre:
					GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire.Date,
				taille: 145,
			},
			{
				id: DonneesListe_Dossiers_1.DonneesListe_Dossiers.colonnes.responsable,
				titre:
					GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
						.DemandeurRespAdministratif,
				taille: 160,
			},
			{
				id: DonneesListe_Dossiers_1.DonneesListe_Dossiers.colonnes
					.interlocuteur,
				titre:
					GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
						.Interlocuteur,
				taille: 160,
			},
			{
				id: DonneesListe_Dossiers_1.DonneesListe_Dossiers.colonnes
					.complementInfo,
				titre:
					GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
						.ComplementDInformation,
				taille: "100%",
			},
			{
				id: DonneesListe_Dossiers_1.DonneesListe_Dossiers.colonnes.pieceJointe,
				titre: {
					libelleHtml: IE.jsx.str("i", {
						class: "icon_piece_jointe",
						role: "presentation",
					}),
				},
				taille: 24,
			},
			{
				id: DonneesListe_Dossiers_1.DonneesListe_Dossiers.colonnes.publie,
				titre: {
					libelleHtml: IE.jsx.str("i", {
						class: "icon_info_sondage_publier mix-icon_ok i-green",
						role: "presentation",
					}),
				},
				taille: 30,
			},
		];
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			avecLigneCreation: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.dossierVS.creerDossiersVS,
			),
			titreCreation:
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
					.CreerDossier,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.deployer }],
		});
	}
	evenementListeDossiers(aParametres) {
		this.dossierCourant = this.creerDossier();
		if (aParametres.article && aParametres.article.Numero) {
			this.dossierCourant = this.ListeDossiers.getElementParNumeroEtGenre(
				aParametres.article.Numero,
			);
		}
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this.getInstance(this.identFenetreDossier).setOptionsFenetre({
					titre:
						GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
							.TitreFenetreCreationDossier,
				});
				new ObjetRequetePageDossiers_Fenetre_1.ObjetRequetePageDossiers_Fenetre(
					this,
					this.actionSurRecupDonneesFenetre,
				).lancerRequete(this._getEleveSelectionne());
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionDblClick:
				if (
					(!aParametres.article.estDossier &&
						aParametres.article.Genre ===
							Enumere_ElementDossier_1.EGenreElementDossier.Punition) ||
					aParametres.article.estDecrochageScolaire
				) {
					break;
				}
				if (aParametres.article && !aParametres.article.estDossier) {
					this.dossierCourant = aParametres.article.pere;
					this.elementCourant = aParametres.article;
					new ObjetRequetePageDossiers_Fenetre_1.ObjetRequetePageDossiers_Fenetre(
						this,
						this.actionSurRecupDonneesFenetreCorrespondance,
					).lancerRequete(this._getEleveSelectionne());
				} else {
					this.getInstance(this.identFenetreDossier).setOptionsFenetre({
						titre:
							GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
								.TitreFenetreModificationDossier,
					});
					new ObjetRequetePageDossiers_Fenetre_1.ObjetRequetePageDossiers_Fenetre(
						this,
						this.actionSurRecupDonneesFenetre,
					).lancerRequete(this._getEleveSelectionne());
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				if (!!aParametres.article) {
					if (aParametres.article.estDossier) {
						this._callbacksupprimerDossier(aParametres.article);
					} else {
						this._callbacksupprimerElement(aParametres.article);
					}
				}
				break;
		}
	}
	getCallbackDeListe() {
		return {
			callbackAjouterElement: this._callbackAjouterElement.bind(this),
			callbackmodifierDossier: this._callbackmodifierDossier.bind(this),
			callbacksupprimerDossier: this._callbacksupprimerDossier.bind(this),
			callbackmodifierElement: this._callbackmodifierElement.bind(this),
			callbacksupprimerElement: this._callbacksupprimerElement.bind(this),
			callbackVoirDiscussion: this.callbackVoirDiscussion.bind(this),
		};
	}
	_callbackAjouterElement(aArticle) {
		this.dossierCourant = aArticle;
		ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
			pere: this,
			options: { largeurMin: 100 },
			initCommandes: (aInstance) => {
				const lGenreSelectionnee = this.ListeGenres.getElementParGenre(
					Enumere_ElementDossier_1.EGenreElementDossier.Punition,
				);
				aInstance.add(
					GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
						.Correspondance,
					true,
					() => {
						this.elementCourant = this.creerElementDossier(
							null,
							Enumere_ElementDossier_1.EGenreElementDossier.Communication,
						);
						this.elementCourant.element = this.creerCorrespondance();
						new ObjetRequetePageDossiers_Fenetre_1.ObjetRequetePageDossiers_Fenetre(
							this,
							this.actionSurRecupDonneesFenetreCorrespondance,
						).lancerRequete(this._getEleveSelectionne());
					},
				);
				if (!this.dossierCourant.estDecrochageScolaire) {
					aInstance.add(
						GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
							.Punition,
						true,
						() => {
							this.getInstance(this.identFenetrePunition).setDonnees(
								lGenreSelectionnee.detail,
							);
						},
					);
				}
				aInstance.add(
					GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
						.DiscussionAvecEquipePeda,
					true,
					() => {
						new ObjetRequetePageDossiers_Fenetre_1.ObjetRequetePageDossiers_Fenetre(
							this,
							this.actionSurRecupDonneesFenetreDiscussion.bind(
								this,
								true,
								false,
							),
						).lancerRequete(this._getEleveSelectionne());
					},
				);
				aInstance.add(
					GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
						.DiscussionAvecFamille,
					true,
					() => {
						new ObjetRequetePageDossiers_Fenetre_1.ObjetRequetePageDossiers_Fenetre(
							this,
							this.actionSurRecupDonneesFenetreDiscussion.bind(
								this,
								false,
								true,
							),
						).lancerRequete(this._getEleveSelectionne());
					},
				);
			},
		});
	}
	_callbackmodifierDossier(aDossier) {
		this.dossierCourant = this.ListeDossiers.getElementParNumeroEtGenre(
			aDossier.Numero,
		);
		this.getInstance(this.identFenetreDossier).setOptionsFenetre({
			titre:
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
					.TitreFenetreModificationDossier,
		});
		new ObjetRequetePageDossiers_Fenetre_1.ObjetRequetePageDossiers_Fenetre(
			this,
			this.actionSurRecupDonneesFenetre,
		).lancerRequete(this._getEleveSelectionne());
	}
	construireTitre(aDossier) {
		let lString = "";
		if (aDossier.listeMotifs) {
			for (let i = 0, lNbr = aDossier.listeMotifs.count(); i < lNbr; i++) {
				let lElt = aDossier.listeMotifs.get(i);
				if (i > 0) {
					lString += ", ";
				}
				lString += lElt.getLibelle();
			}
		}
		lString += ObjetDate_1.GDate.formatDate(aDossier.date, " - %JJ/%MM/%AA");
		return lString;
	}
	_callbacksupprimerDossier(aArticle) {
		let lMsg;
		this.dossierCourant = aArticle;
		if (
			this.dossierCourant.respAdmin.getNumero() ===
			GEtatUtilisateur.getUtilisateur().getNumero()
		) {
			lMsg = ObjetChaine_1.GChaine.format(
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
					.MsgConfirmationSupprimerDossier,
				[this.construireTitre(this.dossierCourant)],
			);
		} else if (!this.dossierCourant.respAdmin.existeNumero()) {
			lMsg =
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire.MsgSuppressionDossierAutreCreateur.format(
					GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
						.ParVieScolaire,
				);
			lMsg = ObjetChaine_1.GChaine.format(
				ObjetTraduction_1.GTraductions.getValeur(
					"dossierVieScolaire.suppressionVSDossier",
				),
				[
					ObjetTraduction_1.GTraductions.getValeur(
						"dossierVieScolaire.viescolaire",
					),
				],
			);
		} else {
			const lStrParAutreProfesseurEtNom =
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
					.ParAutreProfesseur +
				" (" +
				this.dossierCourant.respAdmin.getLibelle() +
				")";
			lMsg =
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire.MsgSuppressionDossierAutreCreateur.format(
					lStrParAutreProfesseurEtNom,
				);
		}
		const lThis = this;
		GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			message: lMsg,
			callback: function (aAccepte) {
				lThis.eventSupprimerDossier(aAccepte);
			},
		});
	}
	_callbackmodifierElement(aArticle) {
		this.dossierCourant = aArticle.pere;
		this.elementCourant = aArticle;
		new ObjetRequetePageDossiers_Fenetre_1.ObjetRequetePageDossiers_Fenetre(
			this,
			this.actionSurRecupDonneesFenetreCorrespondance,
		).lancerRequete(this._getEleveSelectionne());
	}
	_callbacksupprimerElement(aArticle) {
		let lMsg;
		this.dossierCourant = aArticle.pere;
		this.elementCourant = aArticle;
		if (
			this.dossierCourant.respAdmin.getNumero() ===
			GEtatUtilisateur.getUtilisateur().getNumero()
		) {
			lMsg =
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
					.MsgConfirmationSupprimerElement;
			if (
				aArticle.Genre ===
					Enumere_ElementDossier_1.EGenreElementDossier.Punition &&
				aArticle.element.punitionNecessiteLaCreationDUnDossier
			) {
				lMsg +=
					"<br><br>" +
					GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
						.MsgConfirmationSupprimerPunition;
			}
		} else if (
			!this.dossierCourant.respAdmin.existeNumero() ||
			this.dossierCourant.respAdmin.getGenre() ===
				Enumere_Ressource_1.EGenreRessource.Personnel
		) {
			lMsg =
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire.MsgSuppressionElementAutreCreateur.format(
					GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
						.ParVieScolaire,
				);
		} else {
			const lStrParAutreProfEtNom =
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
					.ParAutreProfesseur +
				" (" +
				this.dossierCourant.respAdmin.getLibelle() +
				")";
			lMsg =
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire.MsgSuppressionElementAutreCreateur.format(
					lStrParAutreProfEtNom,
				);
		}
		GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			message: lMsg,
			callback: this.eventSupprimerElement.bind(this),
		});
	}
	callbackVoirDiscussion(aElement) {
		const lFenetreDiscussions =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_Discussion_1.ObjetFenetre_Discussion,
				{
					pere: this,
					initialiser: function (aInstance) {
						aInstance.setOptions({
							avecListeDiscussions: false,
							avecBoutonCreation: false,
						});
						aInstance.setOptionsFenetre({
							titre: "",
							largeur: 750,
							hauteur: 600,
							listeBoutons: [
								ObjetTraduction_1.GTraductions.getValeur("Fermer"),
							],
						});
					},
				},
			);
		const lListeMessagerie =
			new ObjetListeElements_1.ObjetListeElements().addElement(aElement);
		if (!aElement.objet) {
			aElement.objet = aElement.commentaire;
		}
		lFenetreDiscussions.setDonnees({
			messagesCommunsEntreLesRessources: false,
			avecSelectionPremiereDiscussion: true,
			discussion: aElement,
			listeMessagerie: lListeMessagerie,
			possessionMessageDiscussionUnique: aElement.dernierPossessionMessage,
		});
	}
	setDonneesObjetRecapitulatif(aListeGenres, aAfficherAnneesPrecedentes) {
		this.getInstance(this.IdentRecapitulatif).setDonnees(
			aListeGenres,
			aAfficherAnneesPrecedentes,
		);
	}
	_surEvenementRecapitulatif(aInclureAnneesPrecedente) {
		this.afficherAnneesPrecedentes = aInclureAnneesPrecedente;
		this.executerRequetePageDossiers();
	}
	creerDossier() {
		const lResult = new ObjetElement_1.ObjetElement("", null, -1);
		lResult.commentaire = "";
		lResult.couleur = null;
		lResult.date = this.parametresSco.getDateDansPeriodeDeNotation(
			null,
			this.etatUtilisateurSco.getPeriode().getNumero(),
		);
		lResult.listeMotifs = new ObjetListeElements_1.ObjetListeElements();
		lResult.respAdmin = GEtatUtilisateur.getUtilisateur();
		lResult.lieu = new ObjetElement_1.ObjetElement("", 0);
		lResult.victime = new ObjetElement_1.ObjetElement("", 0);
		lResult.temoin = new ObjetElement_1.ObjetElement("", 0);
		lResult.publie = false;
		lResult.listeElements = new ObjetListeElements_1.ObjetListeElements();
		lResult.listePJ = new ObjetListeElements_1.ObjetListeElements();
		lResult.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		return lResult;
	}
	creerElementDossier(aNumeroElement, aGenreElement) {
		const lResult = new ObjetElement_1.ObjetElement("", null, aGenreElement);
		lResult.element = new ObjetElement_1.ObjetElement(
			"",
			aNumeroElement,
			Enumere_ElementDossier_1.EGenreElementDossierUtil.toGenreRessource(
				aGenreElement,
			),
		);
		lResult.commentaire = "";
		lResult.date = null;
		lResult.strDate = "";
		lResult.element.respAdmin = new ObjetElement_1.ObjetElement("", 0);
		lResult.interlocuteur = "";
		lResult.avecReponseCourrier = false;
		lResult.publie = false;
		lResult.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		return lResult;
	}
	creerCorrespondance() {
		const lResult = new ObjetElement_1.ObjetElement(
			"",
			null,
			Enumere_ElementDossier_1.EGenreElementDossierUtil.toGenreRessource(
				Enumere_ElementDossier_1.EGenreElementDossier.Communication,
			),
		);
		lResult.type = new ObjetElement_1.ObjetElement("", 0);
		lResult.date = ObjetDate_1.GDate.getDateCourante();
		lResult.respAdmin = new ObjetElement_1.ObjetElement("", 0);
		lResult.interlocuteur = "";
		lResult.listePJ = new ObjetListeElements_1.ObjetListeElements();
		lResult.commentaire = "";
		lResult.avecReponseCourrier = false;
		lResult.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		return lResult;
	}
	eventSupprimerElement(aAccepte) {
		if (aAccepte !== Enumere_Action_1.EGenreAction.Valider) {
			return;
		}
		this.elementCourant.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
		this.dossierCourant.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.setEtatSaisie(true);
		this.valider();
	}
	eventSupprimerDossier(aAccepte) {
		if (aAccepte !== Enumere_Action_1.EGenreAction.Valider) {
			return;
		}
		this.dossierCourant.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
		this.dossierCourant.listeElements.parcourir((aElement) => {
			aElement.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
		});
		this.setEtatSaisie(true);
		this.valider();
	}
	setVisibiliteCategorieDossier() {
		if (!this.avecDroitCreerMotif) {
			for (
				let i = 0;
				i < this.donneesSaisieDossiers.listeCategories.count();
				i++
			) {
				const lCategorie = this.donneesSaisieDossiers.listeCategories.get(i);
				lCategorie.Visible = lCategorie.listeMotifs.getNbrElementsExistes() > 0;
			}
		}
	}
	actionSurRecupDonneesFenetre(aDonneesSaisie) {
		this.donneesSaisieDossiers = aDonneesSaisie;
		this.setVisibiliteCategorieDossier();
		if (
			this.identFenetreDossier !== null &&
			this.identFenetreDossier !== undefined
		) {
			const lAutorisations = { creerMotif: this.avecDroitCreerMotif };
			this.getInstance(this.identFenetreDossier).setDonnees({
				dossier: this.dossierCourant,
				donneesSaisieDossier: this.donneesSaisieDossiers,
				autorisations: lAutorisations,
				numEleve: this.etatUtilisateurSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Eleve,
				).getNumero(),
				periode: this.etatUtilisateurSco.getPeriode(),
				listePJEleve: this.listePJEleve,
				restriction: {
					estRestreint: this.dossierCourant.estRestreint,
					hintRestriction: this.dossierCourant.hintRestriction,
					nbRestreint: this.dossierCourant.nbRestreint,
				},
			});
		}
	}
	actionSurRecupDonneesFenetreCorrespondance(aDonneesSaisie) {
		this.donneesSaisieDossiers = aDonneesSaisie;
		new ObjetRequeteListePublics_1.ObjetRequeteListePublics(
			this,
			this._evenementSurRequeteListePublic,
		).lancerRequete({
			genres: [
				Enumere_Ressource_1.EGenreRessource.Enseignant,
				Enumere_Ressource_1.EGenreRessource.Personnel,
			],
			sansFiltreSurEleve: true,
			avecFonctionPersonnel: true,
		});
	}
	actionSurRecupDonneesFenetreDiscussion(
		aAvecEquipePeda,
		aAvecResponsables,
		aDonneesSaisie,
	) {
		this.donneesSaisieDossiers = aDonneesSaisie;
		let lListeProfesseurs = aAvecEquipePeda
			? this.donneesSaisieDossiers.listeEquipePedagogique.getListeElements(
					(D) => {
						return (
							D.getGenre() === Enumere_Ressource_1.EGenreRessource.Enseignant
						);
					},
				)
			: new ObjetListeElements_1.ObjetListeElements();
		let lListePersonnel = aAvecEquipePeda
			? this.donneesSaisieDossiers.listeEquipePedagogique.getListeElements(
					(D) => {
						return (
							D.getGenre() === Enumere_Ressource_1.EGenreRessource.Personnel
						);
					},
				)
			: new ObjetListeElements_1.ObjetListeElements();
		let lListeResponsables = aAvecResponsables
			? this.donneesSaisieDossiers.listeResponsables
			: new ObjetListeElements_1.ObjetListeElements();
		ObjetFenetre_Message_1.ObjetFenetre_Message.creerFenetreDiscussion(
			this,
			{
				ListeRessources: this.donneesSaisieDossiers.listeInterlocuteurs,
				genresRessources: [
					{
						genre: Enumere_Ressource_1.EGenreRessource.Enseignant,
						listeDestinataires: lListeProfesseurs,
					},
					{
						genre: Enumere_Ressource_1.EGenreRessource.Personnel,
						listeDestinataires: lListePersonnel,
					},
					{
						genre: Enumere_Ressource_1.EGenreRessource.Responsable,
						listeDestinataires: lListeResponsables,
					},
				],
			},
			{
				avecChoixDestinataires: true,
				estCreationDossierDecrochage: true,
				dossier: this.dossierCourant,
				objet: this.donneesSaisieDossiers.titreSuivi,
				eventApresDiscussion: (aNumeroBouton) => {
					if (aNumeroBouton === 1) {
						this.executerRequetePageDossiers();
					}
				},
			},
		);
	}
	_evenementSurRequeteListePublic(aDonnees) {
		this.donneesSaisieDossiers.listePublic =
			this.getListePublicFormate(aDonnees);
		this.setVisibiliteCategorieDossier();
		if (
			this.identFenetreCorrespondance !== null &&
			this.identFenetreCorrespondance !== undefined
		) {
			this.getInstance(this.identFenetreCorrespondance).setDonnees(
				this.elementCourant,
				this.donneesSaisieDossiers,
				this.listePJEleve,
			);
		}
	}
	getListePublicFormate(aDonnees) {
		const lListePublic = MethodesObjet_1.MethodesObjet.dupliquer(
			aDonnees.listePublic,
		);
		let lInc = 1;
		const lPereIndefini = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur(
				"punition.selection.SansFonction",
			),
			null,
			10001,
		);
		lPereIndefini.estUnDeploiement = true;
		lPereIndefini.estDeploye = false;
		lPereIndefini.Position = 0;
		let lAvecIndefini = false;
		const lPereProf = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur(
				"punition.selection.Professeurs",
			),
			null,
			10002,
		);
		lPereProf.estUnDeploiement = true;
		lPereProf.estDeploye = false;
		lPereProf.Position = 0;
		let lAvecProf = false;
		const lPeres = new ObjetListeElements_1.ObjetListeElements();
		lListePublic.parcourir((aPublic) => {
			let lPere;
			if (aPublic.Genre === Enumere_Ressource_1.EGenreRessource.Personnel) {
				if (aPublic.fonction) {
					lPere = lPeres.getElementParNumero(aPublic.fonction.getNumero());
					if (!lPere) {
						lPere = new ObjetElement_1.ObjetElement(
							aPublic.fonction.getLibelle(),
							aPublic.fonction.getNumero(),
							lInc,
						);
						lInc++;
						lPere.estUnDeploiement = true;
						lPere.estDeploye = false;
						lPere.Position = 0;
						lPeres.addElement(lPere);
					}
				} else {
					lPere = lPereIndefini;
					lAvecIndefini = true;
				}
			} else {
				lPere = lPereProf;
				lAvecProf = true;
			}
			aPublic.pere = lPere;
		});
		for (let i = 0; i < lPeres.count(); i++) {
			const lElement = lPeres.get(i);
			lListePublic.addElement(lElement);
		}
		if (lAvecIndefini) {
			lListePublic.addElement(lPereIndefini);
		}
		if (lAvecProf) {
			lListePublic.addElement(lPereProf);
		}
		const lElmAucun = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur("punition.selection.Aucun"),
			null,
			0,
			0,
		);
		lElmAucun.estAucun = true;
		lListePublic.addElement(lElmAucun);
		lListePublic.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				return D.estAucun || D.estUnDeploiement ? D.Genre : D.pere.Genre;
			}),
			ObjetTri_1.ObjetTri.init("Position"),
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		lListePublic.trier();
		return lListePublic;
	}
}
exports.InterfacePageDossiers_Saisie = InterfacePageDossiers_Saisie;
