const { TypeDroits } = require("ObjetDroitsPN.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { GDate } = require("ObjetDate.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { GTraductions } = require("ObjetTraduction.js");
const { DonneesListe_Dossiers } = require("DonneesListe_Dossiers.js");
const {
	EGenreElementDossier,
	EGenreElementDossierUtil,
} = require("Enumere_ElementDossier.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const { ObjetRequetePageDossiers } = require("ObjetRequetePageDossiers.js");
const {
	ObjetRequetePageDossiers_Fenetre,
} = require("ObjetRequetePageDossiers_Fenetre.js");
const { TypeGenreCategorieDossier } = require("TypeGenreCategorieDossier.js");
const { ObjetRequeteListePublics } = require("ObjetRequeteListePublics.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjetFenetre_Message } = require("ObjetFenetre_Message.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_Discussion } = require("ObjetFenetre_Discussion.js");
class _InterfacePageDossiers extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.genreElement = { dossier: 0, elementDossier: 1 };
		this.genreEvenement = {
			creer: 0,
			modifier: 1,
			modifierPublication: 2,
			ajouterElement: 3,
			modifierElement: 4,
			contextmenu: 5,
		};
		this.lOptionsListe = {
			callbackAjouterElement: _callbackAjouterElement.bind(this),
			callbackmodifierDossier: _callbackmodifierDossier.bind(this),
			callbacksupprimerDossier: _callbacksupprimerDossier.bind(this),
			callbackmodifierElement: _callbackmodifierElement.bind(this),
			callbacksupprimerElement: _callbacksupprimerElement.bind(this),
		};
		this.afficherAnneesPrecedentes = false;
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		this.AddSurZone = [];
		if (this.IdentBandeau) {
			this.AddSurZone.push(this.IdentBandeau);
		}
		this.IdentZoneAlClient = this.identListeDossiers;
	}
	_getEleveSelectionne() {}
	evenementListeDossiers(aParametres, aGenreEvenementListe) {
		if (GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur) {
			this.dossierCourant = this._initDossier();
			if (aParametres.article && aParametres.article.Numero) {
				this.dossierCourant = this.ListeDossiers.getElementParNumeroEtGenre(
					aParametres.article.Numero,
				);
			}
			switch (aGenreEvenementListe) {
				case EGenreEvenementListe.Creation:
					this.getInstance(this.identFenetreDossier).setOptionsFenetre({
						titre: GTraductions.getValeur("dossierVieScolaire.fenetre.titre"),
					});
					new ObjetRequetePageDossiers_Fenetre(
						this,
						this.actionSurRecupDonneesFenetre,
					).lancerRequete(this._getEleveSelectionne());
					break;
				case EGenreEvenementListe.SelectionDblClick:
					if (
						(!aParametres.article.estDossier &&
							aParametres.article.Genre === EGenreElementDossier.Punition) ||
						aParametres.article.estDecrochageScolaire
					) {
						break;
					}
					if (aParametres.article && !aParametres.article.estDossier) {
						this.dossierCourant = aParametres.article.pere;
						this.elementCourant = aParametres.article;
						new ObjetRequetePageDossiers_Fenetre(
							this,
							this.actionSurRecupDonneesFenetreCorrespondance,
						).lancerRequete(this._getEleveSelectionne());
					} else {
						this.getInstance(this.identFenetreDossier).setOptionsFenetre({
							titre: GTraductions.getValeur(
								"dossierVieScolaire.fenetre.titreModification",
							),
						});
						new ObjetRequetePageDossiers_Fenetre(
							this,
							this.actionSurRecupDonneesFenetre,
						).lancerRequete(this._getEleveSelectionne());
					}
					break;
				case EGenreEvenementListe.Suppression:
					if (!!aParametres.article) {
						if (aParametres.article.estDossier) {
							_callbacksupprimerDossier.call(this, aParametres.article);
						} else {
							_callbacksupprimerElement.call(this, aParametres.article);
						}
					}
					break;
			}
		}
	}
	evenementSurPunition(aNumeroBouton, aElement) {
		if (aNumeroBouton === 1) {
			if (aElement.existeNumero()) {
				const lElement = this._initElementDossier(
					this.dossierCourant.getNumero(),
					aElement.Numero,
					EGenreElementDossier.Punition,
				);
				lElement.Libelle = aElement.naturePunition.Libelle;
				lElement.element.commentaire = aElement.commentaire;
				lElement.commentaire = aElement.circonstance;
				lElement.element.listeMotifs = aElement.listeMotifs;
				lElement.element.respAdmin = aElement.demandeur
					? aElement.demandeur
					: new ObjetElement("", 0);
				lElement.element.date = aElement.dateDemande;
				lElement.date = aElement.dateDemande;
				lElement.strDate = GDate.formatDate(
					lElement.date,
					GTraductions.getValeur("Le_Maj") + " %JJ/%MM/%AAAA",
				);
				lElement.genreElement = "P";
				lElement.setEtat(EGenreEtat.Creation);
				this.dossierCourant.listeElements.addElement(lElement);
				this.dossierCourant.setEtat(EGenreEtat.Modification);
				this.setEtatSaisie(true);
				const ListeDossiersMiseEnForme = new ObjetListeElements();
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
					new DonneesListe_Dossiers(
						ListeDossiersMiseEnForme,
						this.lOptionsListe,
					),
				);
			}
		}
	}
	evenementSurCorrespondance(aNumeroBouton, aElement, aListePJ) {
		if (aNumeroBouton === 1) {
			this.elementCourant.element = aElement;
			this.elementCourant.Libelle = aElement.type.Libelle;
			this.elementCourant.date = aElement.date;
			this.elementCourant.strDate = GDate.formatDate(
				aElement.date,
				GTraductions.getValeur("Le_Maj") + " %JJ/%MM/%AAAA",
			);
			this.elementCourant.genre = aElement.type.getGenre();
			this.elementCourant.commentaire = aElement.commentaire;
			this.elementCourant.interlocuteur = aElement.interlocuteur;
			this.elementCourant.element.respAdmin = aElement.element.respAdmin;
			this.elementCourant.avecReponseCourrier = aElement.avecReponseCourrier;
			if (aElement.element.isNew) {
				this.elementCourant.setEtat(EGenreEtat.Creation);
				this.dossierCourant.listeElements.addElement(this.elementCourant);
			} else {
				this.elementCourant.setEtat(EGenreEtat.Modification);
			}
			this.elementCourant.listePJ = aElement.listePJ;
			this.listePJEleve = aListePJ;
			this.dossierCourant.setEtat(EGenreEtat.Modification);
			this.setEtatSaisie(true);
			this.focusListeDossiers();
			this.valider();
		}
	}
	evenementSurFenetre(aGenreBouton, aDossier, aListePJEleve, aListeCategories) {
		if (aGenreBouton === 1) {
			switch (aDossier.Genre) {
				case TypeGenreCategorieDossier.CD_Social:
					aDossier.lieu = new ObjetElement("", 0);
					aDossier.temoin = new ObjetElement("", 0);
					aDossier.victime = new ObjetElement("", 0);
					break;
				case TypeGenreCategorieDossier.CD_Sante:
					aDossier.victime = new ObjetElement("", 0);
					break;
			}
			if (aDossier.isNew) {
				aDossier.isNew = false;
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
			if (this.dossierCourant.getEtat() !== EGenreEtat.Aucun) {
				this.setEtatSaisie(true);
			}
			this.listeCategories = aListeCategories;
			this.focusListeDossiers();
			this.valider();
		}
	}
	_initDossier() {
		const lResult = new ObjetElement("", null, -1);
		lResult.commentaire = "";
		lResult.couleur = null;
		lResult.date = GParametres.getDateDansPeriodeDeNotation(
			null,
			GEtatUtilisateur.getPeriode().getNumero(),
		);
		lResult.listeMotifs = new ObjetListeElements();
		lResult.respAdmin = GEtatUtilisateur.getUtilisateur();
		lResult.lieu = new ObjetElement("", 0);
		lResult.victime = new ObjetElement("", 0);
		lResult.temoin = new ObjetElement("", 0);
		lResult.publie = false;
		lResult.listeElements = new ObjetListeElements();
		lResult.listePJ = new ObjetListeElements();
		lResult.isNew = true;
		return lResult;
	}
	_initElementDossier(aNumeroDossier, aNumeroElement, aGenreElement) {
		const lResult = new ObjetElement("", null, aGenreElement);
		lResult.element = new ObjetElement(
			"",
			aNumeroElement,
			EGenreElementDossierUtil.toGenreRessource(aGenreElement),
		);
		lResult.numeroDossier = aNumeroDossier;
		lResult.commentaire = "";
		lResult.date = null;
		lResult.strDate = "";
		lResult.element.respAdmin = new ObjetElement("", 0);
		lResult.interlocuteur = "";
		lResult.avecReponseCourrier = false;
		lResult.publie = false;
		lResult.setEtat(EGenreEtat.Creation);
		return lResult;
	}
	_initCorrespondance() {
		const lResult = new ObjetElement(
			"",
			null,
			EGenreElementDossierUtil.toGenreRessource(
				EGenreElementDossier.Communication,
			),
		);
		lResult.type = new ObjetElement("", 0);
		lResult.date = GDate.getDateCourante();
		lResult.respAdmin = new ObjetElement("", 0);
		lResult.interlocuteur = "";
		lResult.listePJ = new ObjetListeElements();
		lResult.commentaire = "";
		lResult.avecReponseCourrier = false;
		lResult.isNew = true;
		lResult.setEtat(EGenreEtat.Creation);
		return lResult;
	}
	actionSurRecupDonneesFenetre(aDonneesSaisie) {
		this.donneesSaisieDossiers = aDonneesSaisie;
		this.setVisibiliteCategorieDossier();
		if (
			this.identFenetreDossier !== null &&
			this.identFenetreDossier !== undefined
		) {
			this.getInstance(this.identFenetreDossier).setDonnees({
				dossier: this.dossierCourant,
				donneesSaisieDossier: this.donneesSaisieDossiers,
				autorisations: this.autorisations,
				numEleve: GEtatUtilisateur.Navigation.getRessource(
					EGenreRessource.Eleve,
				).getNumero(),
				periode: GEtatUtilisateur.getPeriode(),
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
		new ObjetRequeteListePublics(
			this,
			this._evntListePublicApresRequete,
		).lancerRequete({
			genres: [EGenreRessource.Enseignant, EGenreRessource.Personnel],
			sansFiltreSurEleve: true,
			avecFonctionPersonnel: true,
		});
	}
	actionSurRecupDonneesFenetreDiscussion(aAvecEquipePeda, aDonneesSaisie) {
		this.donneesSaisieDossiers = aDonneesSaisie;
		let lListeProfesseurs = aAvecEquipePeda
			? this.donneesSaisieDossiers.listeEquipePedagogique
			: new ObjetListeElements();
		let lListeResponsables = this.donneesSaisieDossiers.listeResponsables;
		ObjetFenetre_Message.creerFenetreDiscussion(
			this,
			{
				ListeRessources: this.donneesSaisieDossiers.listeInterlocuteurs,
				genresRessources: [
					{
						genre: EGenreRessource.Enseignant,
						listeDestinataires: lListeProfesseurs,
					},
					{
						genre: EGenreRessource.Personnel,
						listeDestinataires: new ObjetListeElements(),
					},
					{
						genre: EGenreRessource.Responsable,
						listeDestinataires: lListeResponsables,
					},
				],
			},
			{
				avecChoixDestinataires: true,
				estCreationDossierDecrochage: true,
				dossier: this.dossierCourant,
			},
		);
	}
	actionSurRecupDonneesFenetreVoirDiscussion() {
		const lFenetreDiscussions = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Discussion,
			{
				pere: this,
				evenement: function (aNumeroBouton) {
					if (aNumeroBouton !== 1) {
						this.fermer();
					}
				},
				initialiser: function (aInstance) {
					aInstance.setOptions({
						avecListeDiscussions: false,
						avecBoutonCreation: false,
					});
					aInstance.setOptionsFenetre({
						titre: "",
						largeur: 550 + 400,
						hauteur: 600,
						listeBoutons: [GTraductions.getValeur("Fermer")],
					});
				},
			},
		);
		lFenetreDiscussions.setDonnees({
			titreFenetre: "titre",
			messagesCommunsEntreLesRessources: false,
			avecSelectionPremiereDiscussion: true,
			eleveCarnetLiaison: this._getEleveSelectionne(),
		});
	}
	_evntListePublicApresRequete(aDonnees) {
		this.donneesSaisieDossiers.listePublic = _evntListePublicApresRequete.call(
			this,
			aDonnees,
		);
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
	setVisibiliteCategorieDossier() {
		if (!this.autorisations.creerMotif) {
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
	afficherPage() {
		this.setEtatSaisie(false);
		this.executerRequetePageDossiers();
	}
	executerRequetePageDossiers() {
		const lPeriode = GEtatUtilisateur.Navigation.getRessource(
			EGenreRessource.Periode,
		);
		const lParamsRequete = {
			eleve: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
			periode: lPeriode,
		};
		if (
			!!this.afficherAnneesPrecedentes &&
			!!lPeriode &&
			!lPeriode.existeNumero()
		) {
			lParamsRequete.afficherAnneesPrecedentes = this.afficherAnneesPrecedentes;
		}
		new ObjetRequetePageDossiers(
			this,
			this.actionSurRequetePageDossiers,
		).lancerRequete(lParamsRequete);
	}
	actionSurRequetePageDossiers(aParam) {
		this.afficherBandeau(true);
		if (!!aParam.msg) {
			this.evenementAfficherMessage(aParam.msg);
		} else {
			this.autorisations = {
				creerMotif: GApplication.droits.get(
					TypeDroits.dossierVS.saisieMotifsDossiersVS,
				),
			};
			this.listePJEleve = aParam.listePJ;
			this.ListeGenres = aParam.listeGenres;
			this.ListeDossiers = aParam.listeDossiers;
			if (GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur) {
				this.Instances[this.IdentRecapitulatif].setDonnees(
					aParam.listeGenres,
					this.afficherAnneesPrecedentes,
				);
			}
			this.focusListeDossiers();
		}
	}
	eventSupprimerElement(aAccepte) {
		if (aAccepte !== EGenreAction.Valider) {
			return;
		}
		this.elementCourant.setEtat(EGenreEtat.Suppression);
		this.dossierCourant.setEtat(EGenreEtat.Modification);
		this.setEtatSaisie(true);
		this.focusListeDossiers();
	}
	eventSupprimerDossier(aAccepte) {
		if (aAccepte !== EGenreAction.Valider) {
			return;
		}
		this.dossierCourant.setEtat(EGenreEtat.Suppression);
		this.dossierCourant.listeElements.parcourir((aElement) => {
			aElement.setEtat(EGenreEtat.Suppression);
		});
		this.setEtatSaisie(true);
		this.focusListeDossiers();
	}
	focusListeDossiers() {
		const ListeDossiersMiseEnForme = new ObjetListeElements();
		this.ListeDossiers.parcourir((aDossier) => {
			aDossier.estDossier = true;
			ListeDossiersMiseEnForme.addElement(aDossier);
			if (aDossier.listeElements) {
				aDossier.listeElements.parcourir((aElement) => {
					aElement.pere = aDossier;
					aElement.estDossier = false;
					aDossier.estUnDeploiement = true;
					aDossier.estDeploye = true;
					if (aElement.getEtat() !== EGenreEtat.Suppression) {
						ListeDossiersMiseEnForme.addElement(aElement);
					}
				});
			}
		});
		this.getInstance(this.identListeDossiers).setDonnees(
			new DonneesListe_Dossiers(ListeDossiersMiseEnForme, this.lOptionsListe),
		);
		$(window).trigger("resize");
		GHtml.setFocus(this.getInstance(this.identListeDossiers));
	}
}
function _evntListePublicApresRequete(aDonnees) {
	const lListePublic = MethodesObjet.dupliquer(aDonnees.listePublic);
	let lInc = 1;
	const lPereIndefini = new ObjetElement(
		GTraductions.getValeur("punition.selection.SansFonction"),
		null,
		10001,
	);
	lPereIndefini.estUnDeploiement = true;
	lPereIndefini.estDeploye = false;
	lPereIndefini.Position = 0;
	let lAvecIndefini = false;
	const lPereProf = new ObjetElement(
		GTraductions.getValeur("punition.selection.Professeurs"),
		null,
		10002,
	);
	lPereProf.estUnDeploiement = true;
	lPereProf.estDeploye = false;
	lPereProf.Position = 0;
	let lAvecProf = false;
	const lPeres = new ObjetListeElements();
	lListePublic.parcourir((aPublic) => {
		let lPere;
		if (aPublic.Genre === EGenreRessource.Personnel) {
			if (aPublic.fonction) {
				lPere = lPeres.getElementParNumero(aPublic.fonction.getNumero());
				if (!lPere) {
					lPere = new ObjetElement(
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
	const lElmAucun = new ObjetElement(
		GTraductions.getValeur("punition.selection.Aucun"),
		null,
		0,
		0,
	);
	lElmAucun.estAucun = true;
	lListePublic.addElement(lElmAucun);
	lListePublic.setTri([
		ObjetTri.init((D) => {
			return D.estAucun || D.estUnDeploiement ? D.Genre : D.pere.Genre;
		}),
		ObjetTri.init("Position"),
		ObjetTri.init("Libelle"),
	]);
	lListePublic.trier();
	return lListePublic;
}
function _callbackAjouterElement(aArticle) {
	this.dossierCourant = aArticle;
	ObjetMenuContextuel.afficher({
		pere: this,
		options: { largeurMin: 100 },
		initCommandes: function (aInstance) {
			this.genreSelectionnee = this.ListeGenres.getElementParGenre(
				EGenreElementDossier.Punition,
			);
			aInstance.add(
				GTraductions.getValeur("dossierVieScolaire.correspondance"),
				true,
				function () {
					this.elementCourant = this._initElementDossier(
						aArticle.getNumero(),
						null,
						EGenreElementDossier.Communication,
					);
					this.elementCourant.element = this._initCorrespondance();
					new ObjetRequetePageDossiers_Fenetre(
						this,
						this.actionSurRecupDonneesFenetreCorrespondance,
					).lancerRequete(this._getEleveSelectionne());
				},
			);
			if (!this.dossierCourant.estDecrochageScolaire) {
				aInstance.add(
					GTraductions.getValeur("dossierVieScolaire.punition"),
					true,
					function () {
						this.getInstance(this.identFenetrePunition).setDonnees(
							this.genreSelectionnee.detail,
						);
					},
				);
			}
			aInstance.add(
				GTraductions.getValeur("dossierVS.discussionPeda"),
				true,
				function () {
					new ObjetRequetePageDossiers_Fenetre(
						this,
						this.actionSurRecupDonneesFenetreDiscussion.bind(this, true),
					).lancerRequete(this._getEleveSelectionne());
				},
			);
			aInstance.add(
				GTraductions.getValeur("dossierVS.discussionFamille"),
				true,
				function () {
					new ObjetRequetePageDossiers_Fenetre(
						this,
						this.actionSurRecupDonneesFenetreDiscussion.bind(this, false),
					).lancerRequete(this._getEleveSelectionne());
				},
			);
			aInstance.add(
				GTraductions.getValeur("dossierVieScolaire.discussion") + " (voir)",
				true,
				function () {
					new ObjetRequetePageDossiers_Fenetre(
						this,
						this.actionSurRecupDonneesFenetreVoirDiscussion,
					).lancerRequete(this._getEleveSelectionne());
				},
			);
		},
	});
}
function construireTitre(aDossier) {
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
	lString += GDate.formatDate(aDossier.date, " - %JJ/%MM/%AA");
	return lString;
}
function _callbackmodifierDossier(aDossier) {
	this.dossierCourant = this.ListeDossiers.getElementParNumeroEtGenre(
		aDossier.Numero,
	);
	this.getInstance(this.identFenetreDossier).setOptionsFenetre({
		titre: GTraductions.getValeur(
			"dossierVieScolaire.fenetre.titreModification",
		),
	});
	new ObjetRequetePageDossiers_Fenetre(
		this,
		this.actionSurRecupDonneesFenetre,
	).lancerRequete(this._getEleveSelectionne());
}
function _callbacksupprimerDossier(aArticle) {
	let lMsg;
	this.dossierCourant = aArticle;
	if (
		this.dossierCourant.respAdmin.getNumero() ===
		GEtatUtilisateur.getUtilisateur().getNumero()
	) {
		lMsg = GChaine.format(
			GTraductions.getValeur("dossierVieScolaire.supprimerDossier"),
			[construireTitre(this.dossierCourant)],
		);
	} else if (!this.dossierCourant.respAdmin.existeNumero()) {
		lMsg = GChaine.format(
			GTraductions.getValeur("dossierVieScolaire.suppressionVSDossier"),
			[GTraductions.getValeur("dossierVieScolaire.viescolaire")],
		);
	} else {
		lMsg = GChaine.format(
			GTraductions.getValeur("dossierVieScolaire.suppressionVSDossier"),
			[
				GTraductions.getValeur("dossierVieScolaire.professeur") +
					" (" +
					this.dossierCourant.respAdmin.getLibelle() +
					")",
			],
		);
	}
	const lThis = this;
	GApplication.getMessage().afficher({
		type: EGenreBoiteMessage.Confirmation,
		message: lMsg,
		callback: function (aAccepte) {
			lThis.eventSupprimerDossier(aAccepte);
		},
	});
}
function _callbackmodifierElement(aArticle) {
	this.dossierCourant = aArticle.pere;
	this.elementCourant = aArticle;
	new ObjetRequetePageDossiers_Fenetre(
		this,
		this.actionSurRecupDonneesFenetreCorrespondance,
	).lancerRequete(this._getEleveSelectionne());
}
function _callbacksupprimerElement(aArticle) {
	let lMsg;
	this.dossierCourant = aArticle.pere;
	this.elementCourant = aArticle;
	if (
		this.dossierCourant.respAdmin.getNumero() ===
		GEtatUtilisateur.getUtilisateur().getNumero()
	) {
		lMsg = GTraductions.getValeur("dossierVieScolaire.supprimerElement");
		if (
			aArticle.Genre === EGenreElementDossier.Punition &&
			aArticle.element.necessiteLaCreationDUnDossier
		) {
			lMsg +=
				"<br><br>" +
				GTraductions.getValeur("dossierVieScolaire.suppressionPunition");
		}
	} else if (
		!this.dossierCourant.respAdmin.existeNumero() ||
		this.dossierCourant.respAdmin.getGenre() === EGenreRessource.Personnel
	) {
		lMsg = GChaine.format(
			GTraductions.getValeur("dossierVieScolaire.suppressionVSElement"),
			[GTraductions.getValeur("dossierVieScolaire.viescolaire")],
		);
	} else {
		lMsg = GChaine.format(
			GTraductions.getValeur("dossierVieScolaire.suppressionVSElement"),
			[
				GTraductions.getValeur("dossierVieScolaire.professeur") +
					" (" +
					this.dossierCourant.respAdmin.getLibelle() +
					")",
			],
		);
	}
	GApplication.getMessage().afficher({
		type: EGenreBoiteMessage.Confirmation,
		message: lMsg,
		callback: this.eventSupprimerElement.bind(this),
	});
}
module.exports = { _InterfacePageDossiers };
