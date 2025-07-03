exports.InterfaceInscriptionsEtablissement = void 0;
const InterfacePage_1 = require("InterfacePage");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetTri_1 = require("ObjetTri");
const ObjetListe_1 = require("ObjetListe");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetTraduction_1 = require("ObjetTraduction");
const GUID_1 = require("GUID");
const ObjetDate_1 = require("ObjetDate");
const UtilitaireInscriptions_1 = require("UtilitaireInscriptions");
const ObjetInscriptionsEtablissement_1 = require("ObjetInscriptionsEtablissement");
const ObjetRequeteParametresInscriptionEtablissement_1 = require("ObjetRequeteParametresInscriptionEtablissement");
const ObjetRequeteSaisieDemandeInscription_1 = require("ObjetRequeteSaisieDemandeInscription");
const ObjetRequeteDonneesInscriptionEtablissement_1 = require("ObjetRequeteDonneesInscriptionEtablissement");
const DonneesListe_SessionsInscription_1 = require("DonneesListe_SessionsInscription");
const DonneesListe_EtapeInscription_1 = require("DonneesListe_EtapeInscription");
const TypeOrigineCreationEtatDemandeInscription_1 = require("TypeOrigineCreationEtatDemandeInscription");
const Toast_1 = require("Toast");
class InterfaceInscriptionsEtablissement extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.ids = { etape: GUID_1.GUID.getId() };
		this.etatSaisie = false;
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.IdentZoneAlClient = this.identInscriptions;
		this.avecBandeau = true;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getEnteteEtape() {
				const H = [];
				if (aInstance.session) {
					const lTableauFormation =
						aInstance.session.orientations &&
						aInstance.session.orientations.count() > 0
							? aInstance.session.orientations.getTableauLibelles()
							: [];
					const lDescription = [];
					if (
						aInstance.donnees &&
						aInstance.donnees.resumeInscription &&
						aInstance.donnees.resumeInscription.numeroDossier
					) {
						lDescription.push(
							IE.jsx.str(
								"div",
								{ class: "flex-contain flex-center m-y-l" },
								IE.jsx.str("i", {
									class: [
										TypeOrigineCreationEtatDemandeInscription_1.TypeOrigineCreationEtatDemandeInscriptionUtil.getIcone(
											aInstance.donnees.resumeInscription.etatDemande,
										),
										"m-right-l theme_color_moyen1",
									],
									role: "img",
									"aria-label":
										TypeOrigineCreationEtatDemandeInscription_1.TypeOrigineCreationEtatDemandeInscriptionUtil.getLibelle(
											aInstance.donnees.resumeInscription.etatDemande,
										),
								}),
								IE.jsx.str(
									"span",
									null,
									TypeOrigineCreationEtatDemandeInscription_1.TypeOrigineCreationEtatDemandeInscriptionUtil.getLibelle(
										aInstance.donnees.resumeInscription.etatDemande,
									),
								),
							),
						);
						if (aInstance.donnees.resumeInscription.nomElevePostulant) {
							lDescription.push(
								IE.jsx.str(
									"span",
									null,
									ObjetTraduction_1.GTraductions.getValeur(
										"inscriptionsEtablissement.pour",
										[aInstance.donnees.resumeInscription.nomElevePostulant],
									),
								),
							);
						}
					} else {
						const lStrDateJusquau = ObjetTraduction_1.GTraductions.getValeur(
							"inscriptionsEtablissement.ouvertJusquau",
							[
								ObjetDate_1.GDate.formatDate(
									aInstance.session.dateFin,
									"%JJ/%MM/%AAAA",
								),
							],
						);
						lDescription.push(
							IE.jsx.str(
								"p",
								{ class: "text-right m-top semi-bold color-red-moyen" },
								lStrDateJusquau,
							),
						);
					}
					H.push(
						IE.jsx.str(
							IE.jsx.fragment,
							null,
							IE.jsx.str(
								"p",
								{ class: "Gras" },
								aInstance.session.getLibelle(),
							),
							IE.jsx.str(
								"p",
								null,
								ObjetTraduction_1.GTraductions.getValeur(
									"inscriptionsEtablissement.formations",
								),
								" ",
								lTableauFormation.join(", "),
							),
							lDescription.join(""),
						),
					);
				}
				return H.join("");
			},
		});
	}
	recupererDonnees() {
		new ObjetRequeteParametresInscriptionEtablissement_1.ObjetRequeteParametresInscriptionEtablissement(
			this,
			this.actionSurRecupererParams,
		).lancerRequete({
			responsable: new ObjetElement_1.ObjetElement(
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
		lObjListes.listeCivilites.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
		lObjListes.listeCivilites.trier();
		lObjListes.listeLienParente.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
		lObjListes.listeLienParente.trier();
		lObjListes.listeSituations.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
		lObjListes.listeSituations.trier();
		lObjListes.listeEtablissements.setTri([
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		lObjListes.listeEtablissements.trier();
		lObjListes.listeProjetsAccompagnement.setTri([
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		lObjListes.listeProjetsAccompagnement.trier();
		lObjListes.listeProfessions.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
		lObjListes.listeProfessions.trier();
		lObjListes.listeRegimes.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
		lObjListes.listeRegimes.trier();
		lObjListes.listeLV1.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
		lObjListes.listeLV1.trier();
		lObjListes.listeLV2.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
		lObjListes.listeLV2.trier();
		this.getInstance(this.identInscriptions).setListesSaisie(lObjListes);
		this.listeSessionsInscriptions =
			aDonnees.listeSessionsInscriptions ||
			new ObjetListeElements_1.ObjetListeElements();
		this.listeHistoriqueInscriptions =
			aDonnees.historiqueDemandes ||
			new ObjetListeElements_1.ObjetListeElements();
		if (this.listeHistoriqueInscriptions.count() > 0) {
			this.listeHistoriqueInscriptions.parcourir((aElement) => {
				aElement.estUneDemande = true;
			});
			this.listeHistoriqueInscriptions.trier(
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			);
			this.estEnCreation = false;
		}
		const lListeSessions = new ObjetListeElements_1.ObjetListeElements();
		if (this.listeHistoriqueInscriptions.count() > 0) {
			const lInterTitre = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.mesDemandes",
				),
			);
			lInterTitre.estInterTitre =
				ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign.typeInterTitre.h5;
			lListeSessions.add(lInterTitre);
			lListeSessions.add(this.listeHistoriqueInscriptions);
		}
		const lListeSessionEnCours =
			this.listeSessionsInscriptions.getListeElements((aSession) => {
				return aSession.estEnCours;
			});
		if (lListeSessionEnCours.count() > 0) {
			const lInterTitre = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.sessionEnCours",
				),
			);
			lInterTitre.estInterTitre =
				ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign.typeInterTitre.h5;
			lListeSessions.add(lInterTitre);
			lListeSessions.add(lListeSessionEnCours);
		}
		$("#" + this.ids.etape).hide();
		let lMessage = "";
		if (lListeSessions.count() > 0) {
			lMessage = ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.selectionnerSession",
			);
			this.getInstance(this.identSessions).setDonnees(
				new DonneesListe_SessionsInscription_1.DonneesListe_SessionsInscription(
					lListeSessions,
				),
			);
		} else {
			lMessage = ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.aucuneSession",
			);
		}
		this.evenementAfficherMessage(this.composeAucuneDonnee(lMessage));
	}
	construireInstances() {
		this.identSessions = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurSession.bind(this),
			this._initialiserSessions,
		);
		this.identEtapes = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurEtape.bind(this),
			this._initialiserEtapes,
		);
		this.identInscriptions = this.add(
			ObjetInscriptionsEtablissement_1.ObjetInscriptionsEtablissement,
			this._evenementInscription.bind(this),
		);
		this.idPage = this.getNomInstance(this.identInscriptions);
	}
	composeAucuneDonnee(aMessage) {
		return IE.jsx.str(
			"div",
			{ class: "message-vide" },
			IE.jsx.str("div", { class: "message" }, aMessage),
			IE.jsx.str("div", { class: "Image_No_Data", "aria-hidden": "true" }),
		);
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: ["ifc-inscriptions-etab", "flex-contain"] },
				IE.jsx.str(
					"section",
					{ class: ["section-session"] },
					IE.jsx.str("div", {
						id: this.getNomInstance(this.identSessions),
						class: ["liste-session", "col-listes"],
					}),
				),
				IE.jsx.str(
					"section",
					{ class: "section-etape", id: this.ids.etape },
					IE.jsx.str("div", { class: "m-all-l", "ie-html": "getEnteteEtape" }),
					IE.jsx.str("div", {
						id: this.getNomInstance(this.identEtapes),
						class: ["liste-session", "col-listes"],
					}),
				),
				IE.jsx.str("section", {
					id: this.getNomInstance(this.identInscriptions),
					class: ["fluid-bloc", "section-formulaire"],
				}),
			),
		);
		return H.join("");
	}
	recupererSession(aElement) {
		this.estEnCreation = true;
		this.session = aElement;
		let lMessageValide =
			UtilitaireInscriptions_1.UtilitaireInscriptions.getMessageSessionValide(
				this.session,
				true,
			);
		if (!lMessageValide.estValide) {
			let lMessage =
				ObjetTraduction_1.GTraductions.getValeur(
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
			new ObjetRequeteDonneesInscriptionEtablissement_1.ObjetRequeteDonneesInscriptionEtablissement(
				this,
				this.actionSurRecupererDonnees.bind(this, false),
			).lancerRequete({
				responsable: new ObjetElement_1.ObjetElement(
					"",
					GEtatUtilisateur.getUtilisateur().getNumero(),
				),
			});
		}
	}
	recupererHistorique(aElement) {
		this.estEnCreation = false;
		this.inscriptionCourante = aElement;
		delete this.etapeEnCours;
		$("#" + this.ids.etape).show();
		new ObjetRequeteDonneesInscriptionEtablissement_1.ObjetRequeteDonneesInscriptionEtablissement(
			this,
			this.actionSurRecupererDonnees.bind(this, true),
		).lancerRequete({
			inscription: this.inscriptionCourante,
			responsable: new ObjetElement_1.ObjetElement(
				"",
				GEtatUtilisateur.getUtilisateur().getNumero(),
			),
		});
	}
	actionSurRecupererDonnees(aEstResume, aDonnees) {
		this.donnees = {
			resumeInscription: aDonnees.resumeInscription,
			fratrie: aDonnees.fratrie,
			responsables: aDonnees.responsables,
			identite: null,
			inscription: null,
			scolarite: null,
			scolariteActuelle: null,
			session: null,
		};
		if (!!this.session) {
			this.donnees.session = this.session;
		} else {
			this.donnees.session = aDonnees.resumeInscription;
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
			aDonnees.identite,
		);
		this.donnees.scolariteActuelle = Object.assign(
			{
				optionsChoisies: new ObjetListeElements_1.ObjetListeElements(),
				redoublant: false,
				etablissementActuel: new ObjetElement_1.ObjetElement("", 0),
				commentaire: !!aDonnees.resumeInscription
					? aDonnees.resumeInscription.commentaire
					: "",
			},
			aDonnees.scolariteActuelle,
		);
		this.donnees.scolarite = aDonnees.scolarite;
		if (aEstResume) {
			let lIndice = this.listeSessionsInscriptions.getIndiceParElement(
				this.donnees.scolarite.session,
			);
			this.session = this.listeSessionsInscriptions.get(lIndice);
		}
		this.listeEtapes =
			UtilitaireInscriptions_1.UtilitaireInscriptions.getListeEtapes(
				this.donnees.session,
				this.estEnCreation,
			);
		const lObj = {
			donnees: this.donnees,
			estResume: aEstResume,
			session: this.session,
			listeEtapes: this.listeEtapes,
			inscriptionCourante: null,
		};
		if (aEstResume && !!this.inscriptionCourante) {
			lObj.inscriptionCourante = this.inscriptionCourante;
		}
		$("#" + this.ids.etape).show();
		this.getInstance(this.identEtapes).setDonnees(
			new DonneesListe_EtapeInscription_1.DonneesListe_EtapeInscription(
				this.listeEtapes,
			),
		);
		if (!aEstResume) {
			this.etapeEnCours = this.listeEtapes.get(0);
			this.getInstance(this.identEtapes).selectionnerLigne({ ligne: 0 });
		}
		this.getInstance(this.identInscriptions).setDonnees(lObj);
	}
	_evenementInscription(aGenreEvenementCallback, aParams) {
		switch (aGenreEvenementCallback) {
			case ObjetInscriptionsEtablissement_1.ObjetInscriptionsEtablissement
				.GenreEvenement.annuler:
				this.getInstance(this.identInscriptions).vider();
				this.recupererDonnees();
				break;
			case ObjetInscriptionsEtablissement_1.ObjetInscriptionsEtablissement
				.GenreEvenement.modifier: {
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
			case ObjetInscriptionsEtablissement_1.ObjetInscriptionsEtablissement
				.GenreEvenement.supprimer: {
				const lData = {
					supprimerDemande: true,
					inscription: this.inscriptionCourante,
				};
				new ObjetRequeteSaisieDemandeInscription_1.ObjetRequeteSaisieDemandeInscription(
					this,
				)
					.lancerRequete(lData)
					.then((aJSON) => {
						if (aJSON.messageCorps) {
							Toast_1.Toast.afficher({
								msg: aJSON.messageCorps,
								type: Toast_1.ETypeToast.erreur,
							});
						} else {
							if (!!!aJSON.RapportSaisie) {
								Toast_1.Toast.afficher({
									msg: ObjetTraduction_1.GTraductions.getValeur(
										"inscriptionsEtablissement.demandeSupprimee",
									),
									type: Toast_1.ETypeToast.succes,
								});
							}
						}
						this.getInstance(this.identInscriptions).vider();
						this.recupererDonnees();
					});
				break;
			}
			case ObjetInscriptionsEtablissement_1.ObjetInscriptionsEtablissement
				.GenreEvenement.valider: {
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
				new ObjetRequeteSaisieDemandeInscription_1.ObjetRequeteSaisieDemandeInscription(
					this,
				)
					.addUpload({ listeFichiers: aParams.listeDocuments })
					.lancerRequete(lData)
					.then((aJSON) => {
						this.etapeEnCours = undefined;
						if (aJSON.messageCorps) {
							Toast_1.Toast.afficher({
								type: Toast_1.ETypeToast.erreur,
								msg: aJSON.messageCorps,
							});
							this.getInstance(this.identInscriptions).vider();
							this.recupererDonnees();
						} else {
							if (!!!aJSON.RapportSaisie && !aJSON._erreurSaisie_) {
								Toast_1.Toast.afficher({
									msg: this.estEnCreation
										? ObjetTraduction_1.GTraductions.getValeur(
												"inscriptionsEtablissement.inscriptionEnvoyee",
											)
										: ObjetTraduction_1.GTraductions.getValeur(
												"inscriptionsEtablissement.inscriptionModifiee",
											),
									type: Toast_1.ETypeToast.succes,
								});
								if (this.estEnCreation && !!aJSON.inscription) {
									this.inscriptionCourante = aJSON.inscription;
								}
								this.recupererDonnees();
								if (this.inscriptionCourante) {
									this._selectionnerSession(this.inscriptionCourante, true);
								}
							}
						}
					});
				break;
			}
			case ObjetInscriptionsEtablissement_1.ObjetInscriptionsEtablissement
				.GenreEvenement.precedent: {
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
			case ObjetInscriptionsEtablissement_1.ObjetInscriptionsEtablissement
				.GenreEvenement.suivant: {
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
	_initialiserSessions(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecOmbreDroite: true,
		});
	}
	_evenementSurSession(aParametres) {
		if (!aParametres.article.estInterTitre) {
			switch (aParametres.genreEvenement) {
				case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
					if (this.etapeEnCours && this.etapeEnCours.getPosition() > 0) {
						GApplication.getMessage().afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"inscriptionsEtablissement.msgAvertissementConsigne",
							),
							callback: (aGenreAction) => {
								if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
									this._selectionnerSession(
										aParametres.article,
										aParametres.article.estUneDemande,
									);
								}
							},
						});
					} else {
						this._selectionnerSession(
							aParametres.article,
							aParametres.article.estUneDemande,
						);
					}
					break;
				}
			}
		}
	}
	_selectionnerSession(aArticle, aEstUneDemande) {
		if (aEstUneDemande) {
			this.recupererHistorique(aArticle);
		} else {
			this.recupererSession(aArticle);
		}
	}
	_initialiserEtapes(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecOmbreDroite: true,
		});
	}
	_evenementSurEtape(aParametres) {
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
}
exports.InterfaceInscriptionsEtablissement = InterfaceInscriptionsEtablissement;
