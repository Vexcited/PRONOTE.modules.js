const { InterfacePage } = require("InterfacePage.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { EGenreAction } = require("Enumere_Action.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjetListe } = require("ObjetListe.js");
const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GUID } = require("GUID.js");
const { GDate } = require("ObjetDate.js");
const { UtilitaireInscriptions } = require("UtilitaireInscriptions.js");
const {
	ObjetInscriptionsEtablissement,
} = require("ObjetInscriptionsEtablissement.js");
const {
	ObjetRequeteParametresInscriptionEtablissement,
} = require("ObjetRequeteParametresInscriptionEtablissement.js");
const {
	ObjetRequeteSaisieDemandeInscription,
} = require("ObjetRequeteSaisieDemandeInscription.js");
const {
	ObjetRequeteDonneesInscriptionEtablissement,
} = require("ObjetRequeteDonneesInscriptionEtablissement.js");
const {
	DonneesListe_SessionsInscription,
} = require("DonneesListe_SessionsInscription.js");
const {
	DonneesListe_EtapeInscription,
} = require("DonneesListe_EtapeInscription.js");
const { tag } = require("tag.js");
const {
	TypeOrigineCreationEtatDemandeInscriptionUtil,
} = require("TypeOrigineCreationEtatDemandeInscription.js");
const { Toast, ETypeToast } = require("Toast.js");
class InterfaceInscriptionsEtablissement extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.ids = { etape: GUID.getId() };
		this.etatSaisie = false;
	}
	setParametresGeneraux() {
		this.GenreStructure = EStructureAffichage.Autre;
		this.IdentZoneAlClient = this.identInscriptions;
		this.avecBandeau = true;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			avecSessionsInscriptions: function () {
				return (
					!aInstance.listeSessions ||
					aInstance.listeSessions.count() > 0 ||
					!!aInstance.saisieEnCours
				);
			},
			getEnteteEtape: function () {
				const H = [];
				if (aInstance.session) {
					const lTableauFormation =
						aInstance.session.orientations &&
						aInstance.session.orientations.count() > 0
							? aInstance.session.orientations.getTableauLibelles()
							: [];
					const lDescription =
						aInstance.donnees &&
						aInstance.donnees.resumeInscription &&
						aInstance.donnees.resumeInscription.numeroDossier
							? tag(
									"div",
									{ class: "flex-contain flex-center m-y-l" },
									tag("i", {
										class: [
											TypeOrigineCreationEtatDemandeInscriptionUtil.getIcone(
												aInstance.donnees.resumeInscription.etatDemande,
											),
											"m-right-l theme_color_moyen1",
										],
									}),
									tag(
										"span",
										TypeOrigineCreationEtatDemandeInscriptionUtil.getLibelle(
											aInstance.donnees.resumeInscription.etatDemande,
										),
									),
								) + aInstance.donnees.resumeInscription.nomElevePostulant
								? tag(
										"span",
										GTraductions.getValeur("inscriptionsEtablissement.pour", [
											aInstance.donnees.resumeInscription.nomElevePostulant,
										]),
									)
								: ""
							: tag(
									"p",
									{ class: "text-right m-top Gras text-util-rouge-moyen" },
									GTraductions.getValeur(
										"inscriptionsEtablissement.ouvertJusquau",
										[
											GDate.formatDate(
												aInstance.session.dateFin,
												"%JJ/%MM/%AAAA",
											),
										],
									),
								);
					H.push(
						tag("p", { class: "Gras" }, aInstance.session.getLibelle()),
						tag(
							"p",
							{ class: "" },
							GTraductions.getValeur("inscriptionsEtablissement.formations"),
							" ",
							lTableauFormation.join(", "),
						),
						lDescription,
					);
				}
				return H.join("");
			},
		});
	}
	recupererDonnees() {
		new ObjetRequeteParametresInscriptionEtablissement(
			this,
			this.actionSurRecupererParams,
		).lancerRequete({
			responsable: new ObjetElement(
				"",
				GEtatUtilisateur.getUtilisateur().getNumero(),
			),
		});
	}
	actionSurRecupererParams(aDonnees) {
		const lObjListes = {
			listeCivilites: aDonnees.listeCivilites,
			listePays: aDonnees.listePays,
			listeLienParente: aDonnees.listeLienParente,
			listeSituations: aDonnees.listeSituations,
			listeEtablissements: aDonnees.listeEtablissements,
			listeProjetsAccompagnement: aDonnees.listeProjetsAccompagnement,
			listeProfessions: aDonnees.listeProfessions,
			listeRegimes: aDonnees.listeRegimes,
			listeResponsabilites: aDonnees.listeNiveauxResponsabilites,
			listeLV1: aDonnees.listeLV1,
			listeLV2: aDonnees.listeLV2,
			sessionsInscriptions: aDonnees.listeSessionsInscriptions,
		};
		lObjListes.listeCivilites.setTri([ObjetTri.init("Libelle")]);
		lObjListes.listeCivilites.trier();
		lObjListes.listeLienParente.setTri([ObjetTri.init("Libelle")]);
		lObjListes.listeLienParente.trier();
		lObjListes.listeSituations.setTri([ObjetTri.init("Libelle")]);
		lObjListes.listeSituations.trier();
		lObjListes.listeEtablissements.setTri([ObjetTri.init("Libelle")]);
		lObjListes.listeEtablissements.trier();
		lObjListes.listeProjetsAccompagnement.setTri([ObjetTri.init("Libelle")]);
		lObjListes.listeProjetsAccompagnement.trier();
		lObjListes.listeProfessions.setTri([ObjetTri.init("Libelle")]);
		lObjListes.listeProfessions.trier();
		lObjListes.listeRegimes.setTri([ObjetTri.init("Libelle")]);
		lObjListes.listeRegimes.trier();
		lObjListes.listeLV1.setTri([ObjetTri.init("Libelle")]);
		lObjListes.listeLV1.trier();
		lObjListes.listeLV2.setTri([ObjetTri.init("Libelle")]);
		lObjListes.listeLV2.trier();
		this.getInstance(this.identInscriptions).setListesSaisie(lObjListes);
		this.listeSessionsInscriptions =
			aDonnees.listeSessionsInscriptions || new ObjetListeElements();
		this.listeHistoriqueInscriptions =
			aDonnees.historiqueDemandes || new ObjetListeElements();
		if (this.listeHistoriqueInscriptions.count() > 0) {
			this.listeHistoriqueInscriptions.parcourir((aElement) => {
				aElement.estUneDemande = true;
			});
			this.listeHistoriqueInscriptions.trier(EGenreTriElement.Decroissant);
			this.estEnCreation = false;
		}
		this.listeSessions = new ObjetListeElements();
		if (this.listeHistoriqueInscriptions.count() > 0) {
			const lInterTitre = new ObjetElement(
				GTraductions.getValeur("inscriptionsEtablissement.mesDemandes"),
			);
			lInterTitre.estInterTitre = ObjetDonneesListeFlatDesign.typeInterTitre.h5;
			this.listeSessions.add(lInterTitre);
			this.listeSessions.add(this.listeHistoriqueInscriptions);
		}
		const lListeSessionEnCours =
			this.listeSessionsInscriptions.getListeElements((aSession) => {
				return aSession.estEnCours;
			});
		if (lListeSessionEnCours.count() > 0) {
			const lInterTitre = new ObjetElement(
				GTraductions.getValeur("inscriptionsEtablissement.sessionEnCours"),
			);
			lInterTitre.estInterTitre = ObjetDonneesListeFlatDesign.typeInterTitre.h5;
			this.listeSessions.add(lInterTitre);
			this.listeSessions.add(lListeSessionEnCours);
		}
		$("#" + this.ids.etape).hide();
		let lMessage = "";
		if (this.listeSessions.count() > 0) {
			lMessage = GTraductions.getValeur(
				"inscriptionsEtablissement.selectionnerSession",
			);
			this.getInstance(this.identSessions).setDonnees(
				new DonneesListe_SessionsInscription(this.listeSessions),
			);
		} else {
			lMessage = GTraductions.getValeur(
				"inscriptionsEtablissement.aucuneSession",
			);
		}
		this.evenementAfficherMessage(this.composeAucuneDonnee(lMessage));
		this.saisieEnCours = false;
	}
	construireInstances() {
		this.identSessions = this.add(
			ObjetListe,
			_evenementSurSession.bind(this),
			_initialiserSessions.bind(this),
		);
		this.identEtapes = this.add(
			ObjetListe,
			_evenementSurEtape.bind(this),
			_initialiserEtapes.bind(this),
		);
		this.identInscriptions = this.add(
			ObjetInscriptionsEtablissement,
			_evenementInscription.bind(this),
		);
		this.idPage = this.getNomInstance(this.identInscriptions);
	}
	composeAucuneDonnee(aMessage) {
		return tag(
			"div",
			{ id: this.idMessage, class: "message-vide" },
			tag("div", { class: "message" }, aMessage),
			tag("div", { class: ["Image_No_Data"], "aria-hidden": "true" }),
		);
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			tag(
				"div",
				{ class: ["ifc-inscriptions-etab", "flex-contain"] },
				tag(
					"section",
					{ class: ["section-session"] },
					tag("div", {
						id: this.getNomInstance(this.identSessions),
						class: ["liste-session", "col-listes"],
					}),
				),
				tag(
					"section",
					{ class: "section-etape", id: this.ids.etape },
					tag("div", { class: "m-all-l", "ie-html": "getEnteteEtape" }),
					tag("div", {
						id: this.getNomInstance(this.identEtapes),
						class: ["liste-session", "col-listes"],
					}),
				),
				tag("section", {
					id: this.getNomInstance(this.identInscriptions),
					class: ["fluid-bloc", "section-formulaire"],
				}),
			),
		);
		return H.join("");
	}
	getSession(aElement) {
		this.estEnCreation = true;
		this.session = aElement;
		this.listeOrientations = aElement.orientations
			? aElement.orientations.setTri([ObjetTri.init("Libelle")])
			: new ObjetListeElements();
		let lMessageValide = UtilitaireInscriptions.getMessageSessionValide(
			this.session,
			true,
		);
		if (!lMessageValide.estValide) {
			let lMessage =
				GTraductions.getValeur(
					"inscriptionsEtablissement.inscriptionImpossible",
				) +
				"<br>" +
				lMessageValide.message;
			$("#" + this.ids.etape).hide();
			this.evenementAfficherMessage(lMessage);
		} else {
			$("#" + this.ids.etape).show();
			this.getInstance(this.identEtapes).setVisible(true);
			this.inscriptionCourante = undefined;
			new ObjetRequeteDonneesInscriptionEtablissement(
				this,
				this.actionSurRecupererDonnees.bind(this, false),
			).lancerRequete({
				responsable: new ObjetElement(
					"",
					GEtatUtilisateur.getUtilisateur().getNumero(),
				),
			});
		}
	}
	getHistorique(aElement) {
		this.estEnCreation = false;
		this.inscriptionCourante = aElement;
		delete this.etapeEnCours;
		$("#" + this.ids.etape).show();
		new ObjetRequeteDonneesInscriptionEtablissement(
			this,
			this.actionSurRecupererDonnees.bind(this, true),
		).lancerRequete({
			inscription: this.inscriptionCourante,
			responsable: new ObjetElement(
				"",
				GEtatUtilisateur.getUtilisateur().getNumero(),
			),
		});
	}
	actionSurRecupererDonnees(aEstResume, aDonnees) {
		this.donnees = {};
		this.donnees.resumeInscription = aDonnees.resumeInscription;
		this.sauvegardeRecherches = {};
		let lParam = Object.assign({}, aDonnees);
		this.donnees.fratrie = lParam.fratrie;
		this.donnees.responsables = lParam.responsables;
		if (!!this.session) {
			this.donnees.session = this.session;
		} else {
			this.donnees.session = this.donnees.resumeInscription;
		}
		this.donnees.identite = Object.assign(
			{
				dateNaissance: null,
				sexeEnfant: 0,
				adresse: [],
				codePostal: "",
				ville: "",
				pays: "",
			},
			lParam.identite,
		);
		let lCommentaire = !!lParam.resumeInscription
			? lParam.resumeInscription.commentaire
			: "";
		this.donnees.scolariteActuelle = Object.assign(
			{
				optionsChoisies: new ObjetListeElements(),
				redoublant: false,
				etablissementActuel: new ObjetElement("", 0),
				commentaire: lCommentaire,
			},
			lParam.scolariteActuelle,
		);
		this.donnees.scolarite = !!lParam.scolarite ? lParam.scolarite : {};
		this.sauvegardeRecherches = MethodesObjet.dupliquer(this.donnees);
		if (aEstResume) {
			let lIndice = this.listeSessionsInscriptions.getIndiceParElement(
				this.donnees.scolarite.session,
			);
			this.session = this.listeSessionsInscriptions.get(lIndice);
		}
		this.listeEtapes = UtilitaireInscriptions.getListeEtape(
			this.donnees,
			this.estEnCreation,
		);
		const lObj = {
			donnees: this.donnees,
			estResume: aEstResume,
			session: this.session,
			listeEtapes: this.listeEtapes,
		};
		if (aEstResume && !!this.inscriptionCourante) {
			lObj.inscriptionCourante = this.inscriptionCourante;
		}
		$("#" + this.ids.etape).show();
		this.getInstance(this.identEtapes).setDonnees(
			new DonneesListe_EtapeInscription(this.listeEtapes, {
				enCreation: this.estEnCreation,
			}),
		);
		if (!aEstResume) {
			this.etapeEnCours = this.listeEtapes.get(0);
			this.getInstance(this.identEtapes).selectionnerLigne({ ligne: 0 });
		}
		this.getInstance(this.identInscriptions).setDonnees(lObj);
	}
}
function _evenementInscription(aParams) {
	switch (aParams.genre) {
		case ObjetInscriptionsEtablissement.genreEvenement.annuler:
			this.getInstance(this.identInscriptions).vider();
			this.recupererDonnees();
			break;
		case ObjetInscriptionsEtablissement.genreEvenement.modifier: {
			this.listeEtapes.parcourir((aEtape) => aEtape.setActif(true));
			this.getInstance(this.identEtapes).actualiser(true);
			this.getInstance(this.identEtapes).selectionnerLigne({
				ligne: 0,
				avecEvenement: false,
			});
			this.etapeEnCours = this.listeEtapes.get(0);
			this.getInstance(this.identInscriptions).setEtape(this.etapeEnCours);
			break;
		}
		case ObjetInscriptionsEtablissement.genreEvenement.supprimer: {
			const lData = {
				supprimerDemande: true,
				inscription: this.inscriptionCourante,
			};
			new ObjetRequeteSaisieDemandeInscription(this)
				.lancerRequete(lData)
				.then((aJSON) => {
					if (aJSON.messageCorps) {
						Toast.afficher({
							msg: aJSON.messageCorps,
							type: ETypeToast.erreur,
						});
					} else {
						if (!!!aJSON.RapportSaisie) {
							Toast.afficher({
								msg: GTraductions.getValeur(
									"inscriptionsEtablissement.demandeSupprimee",
								),
								type: ETypeToast.succes,
							});
						}
					}
					this.getInstance(this.identInscriptions).vider();
					this.recupererDonnees();
				});
			break;
		}
		case ObjetInscriptionsEtablissement.genreEvenement.valider: {
			this.saisieEnCours = true;
			const lData = {
				estEnCreation: this.estEnCreation,
				responsables: aParams.donnees.responsables,
				identite: Object.assign({ sexeEnfant: 0 }, aParams.donnees.identite),
				scolariteActuelle: Object.assign(
					{ redoublant: false },
					aParams.donnees.scolariteActuelle,
				),
				documentsFournis: aParams.listeDocuments,
				session: this.session,
				inscription: this.inscriptionCourante,
			};
			new ObjetRequeteSaisieDemandeInscription(this)
				.addUpload({ listeFichiers: aParams.listeDocuments })
				.lancerRequete(lData)
				.then((aJSON) => {
					this.etapeEnCours = undefined;
					if (aJSON.messageCorps) {
						Toast.afficher({
							type: ETypeToast.erreur,
							msg: aJSON.messageCorps,
						});
						this.getInstance(this.identInscriptions).vider();
						this.recupererDonnees();
					} else {
						if (!!!aJSON.RapportSaisie && !aJSON._erreurSaisie_) {
							Toast.afficher({
								msg: this.estEnCreation
									? GTraductions.getValeur(
											"inscriptionsEtablissement.inscriptionEnvoyee",
										)
									: GTraductions.getValeur(
											"inscriptionsEtablissement.inscriptionModifiee",
										),
								type: ETypeToast.succes,
							});
							if (this.estEnCreation && !!aJSON.inscription) {
								this.inscriptionCourante = aJSON.inscription;
							}
							this.recupererDonnees();
							if (this.inscriptionCourante) {
								_selectionnerSession.call(this, this.inscriptionCourante, true);
							}
						}
					}
				});
			break;
		}
		case ObjetInscriptionsEtablissement.genreEvenement.precedent: {
			const lIndice = this.etapeEnCours.getNumero() - 1;
			if (lIndice < 0) {
				return;
			}
			const lEtape = this.listeEtapes.get(lIndice);
			if (lEtape) {
				this.getInstance(this.identEtapes).selectionnerLigne({
					ligne: lIndice,
					avecEvenement: true,
				});
			} else {
			}
			break;
		}
		case ObjetInscriptionsEtablissement.genreEvenement.suivant: {
			const lIndice = this.etapeEnCours.getNumero() + 1;
			if (lIndice >= this.listeEtapes.count()) {
				return;
			}
			const lEtape = this.listeEtapes.get(lIndice);
			if (lEtape) {
				this.getInstance(this.identEtapes).selectionnerLigne({
					ligne: lIndice,
					avecEvenement: true,
				});
			} else {
			}
			break;
		}
		default:
			break;
	}
}
function _initialiserSessions(aInstance) {
	aInstance.setOptionsListe({
		skin: ObjetListe.skin.flatDesign,
		flatDesignMinimal: true,
		avecOmbreDroite: true,
	});
}
function _evenementSurSession(aParametres) {
	if (!aParametres.article.estInterTitre) {
		switch (aParametres.genreEvenement) {
			case EGenreEvenementListe.Selection: {
				if (this.etapeEnCours && this.etapeEnCours.getPosition() > 0) {
					GApplication.getMessage().afficher({
						type: EGenreBoiteMessage.Confirmation,
						message: GTraductions.getValeur(
							"inscriptionsEtablissement.msgAvertissementConsigne",
						),
						callback: (aGenreAction) => {
							if (aGenreAction === EGenreAction.Valider) {
								_selectionnerSession.call(
									this,
									aParametres.article,
									aParametres.article.estUneDemande,
								);
							}
						},
					});
				} else {
					_selectionnerSession.call(
						this,
						aParametres.article,
						aParametres.article.estUneDemande,
					);
				}
				break;
			}
		}
	}
}
function _selectionnerSession(aArticle, aEstUneDemande) {
	if (aEstUneDemande) {
		this.getHistorique(aArticle);
	} else {
		this.getSession(aArticle);
	}
}
function _initialiserEtapes(aInstance) {
	aInstance.setOptionsListe({
		skin: ObjetListe.skin.flatDesign,
		avecOmbreDroite: true,
	});
}
function _evenementSurEtape(aParametres) {
	if (this.etapeEnCours === undefined) {
		return;
	}
	let lChangerEtape = false;
	const lEtapeEnCours = this.etapeEnCours.getNumero();
	const lEtapeSelectionnee = aParametres.article.getNumero();
	const lInstanceFormulaire = this.getInstance(this.identInscriptions);
	if (this.estEnCreation) {
		if (lEtapeSelectionnee <= lEtapeEnCours) {
			lChangerEtape = true;
		} else if (
			lEtapeSelectionnee === lEtapeEnCours + 1 &&
			lInstanceFormulaire &&
			lInstanceFormulaire.verifierChamps()
		) {
			lChangerEtape = true;
		}
	} else {
		if (lInstanceFormulaire && lInstanceFormulaire.verifierChamps()) {
			lChangerEtape = true;
		}
	}
	if (lChangerEtape) {
		this.etapeEnCours = aParametres.article;
		this.etapeEnCours.setActif(true);
		lInstanceFormulaire.setEtape(aParametres.article);
	}
	this.getInstance(this.identEtapes).actualiser(true);
	this.getInstance(this.identEtapes).selectionnerLigne({
		ligne: this.etapeEnCours.getNumero(),
		avecEvenement: false,
	});
}
module.exports = { InterfaceInscriptionsEtablissement };
