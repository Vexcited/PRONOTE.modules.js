exports.ObjetFenetre_EditionActualite = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequeteDonneesEditionInformation_1 = require("ObjetRequeteDonneesEditionInformation");
const TinyInit_1 = require("TinyInit");
const DonneesListe_ActualitesChoix_1 = require("DonneesListe_ActualitesChoix");
const ObjetRequeteSaisieActualites_1 = require("ObjetRequeteSaisieActualites");
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const DonneesListe_ActualitesQuestion_1 = require("DonneesListe_ActualitesQuestion");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetFenetre_SelectionRessource_1 = require("ObjetFenetre_SelectionRessource");
const ObjetSelecteurPJ_1 = require("ObjetSelecteurPJ");
const TypeGenreReponseInternetActualite_1 = require("TypeGenreReponseInternetActualite");
const TypeHttpNotificationDonnes_1 = require("TypeHttpNotificationDonnes");
const UtilitaireInformations_1 = require("UtilitaireInformations");
const ObjetPublication_1 = require("ObjetPublication");
const ObjetDestinatairesActualite_1 = require("ObjetDestinatairesActualite");
const GestionnaireBlocPN_1 = require("GestionnaireBlocPN");
const GestionnaireBlocPN_2 = require("GestionnaireBlocPN");
const GestionnaireBlocPN_3 = require("GestionnaireBlocPN");
const ObjetMoteurActus_1 = require("ObjetMoteurActus");
const MoteurInfoSondage_1 = require("MoteurInfoSondage");
const TypeNote_1 = require("TypeNote");
const AccessApp_1 = require("AccessApp");
const Toast_1 = require("Toast");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const Tooltip_1 = require("Tooltip");
class ObjetFenetre_EditionActualite extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.appSco = (0, AccessApp_1.getApp)();
		this.avecEtatSaisie = true;
		this.avecChoixAnonyme = true;
		this.forcerAR = false;
		this.id = {
			titre: this.Nom + "_TitreActu",
			message: this.Nom + "_MessageActu",
			choixReponseAnonyme: this.Nom + "_choixReponseAnonyme",
			destinataires: this.Nom + "_Destinataires",
			listeQuestions: this.Nom + "_listeQuestions",
			zonePJ: this.Nom + "_ZonePJActu",
			EditeurHTML: GUID_1.GUID.getId() + "_editeur",
			listePJ: this.Nom + "_ListePJ",
			listeCloud: this.Nom + "_ListeCloud",
			natureReponse: this.Nom + "_NatureActu",
			tailleTexte: this.Nom + "_TailleTexteActu",
			nbrChoix: this.Nom + "_NbrChoix",
			reponseAutre: this.Nom + "_ReponseAutre",
			conteneurListeChoixReponses: this.Nom + "_ConteneurListeReponses",
			partage: this.Nom + "_ZonePartageActu",
			labelBtnChoixIndividusPartage:
				this.Nom + "_LabelBtnChoixIndividusPartage",
			nbIndividusPartage: this.Nom + "_NbIndividusPartage",
			accuseReception: this.Nom + "_ZoneARActu",
			publication: this.Nom + "publication",
			recupModele: this.Nom + "recupModele",
		};
		this.pourCarnetDeClasse = false;
		this.height = {
			zoneReponseAnonyme: 25,
			zoneMessage: 345,
			zonePublication: 25,
		};
		this.widthTrad = 0;
		this.tailleMaxTitre = 200;
		this.tailleMaxReponse = 500;
		this.avecPublicationPageEtablissement = this.appSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.communication.avecPublicationPageEtablissement,
		);
		let lWidthTrad = ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
			ObjetTraduction_1.GTraductions.getValeur(
				"actualites.Edition.ReponseASaisir",
			),
			10,
			true,
		);
		if (lWidthTrad > this.widthTrad) {
			this.widthTrad = lWidthTrad;
		}
		lWidthTrad = ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
			ObjetTraduction_1.GTraductions.getValeur(
				"actualites.Edition.ChoixMultiple",
			),
			10,
			true,
		);
		if (lWidthTrad > this.widthTrad) {
			this.widthTrad = lWidthTrad;
		}
		lWidthTrad = ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
			ObjetTraduction_1.GTraductions.getValeur(
				"actualites.Edition.ChoixUnique",
			),
			10,
			true,
		);
		if (lWidthTrad > this.widthTrad) {
			this.widthTrad = lWidthTrad;
		}
		this.setUtilitaires({
			genreRessource: new GestionnaireBlocPN_1.UtilitaireGenreRessource(),
			genreEspace: new GestionnaireBlocPN_2.UtilitaireGenreEspace(),
			genreReponse: new GestionnaireBlocPN_3.UtilitaireGenreReponse(),
		});
	}
	setUtilitaires(aUtilitaires) {
		this.utilitaires = aUtilitaires;
		this.moteur = new ObjetMoteurActus_1.ObjetMoteurActus(this.utilitaires);
		this.moteurInfoSond = new MoteurInfoSondage_1.MoteurInfoSondage(
			this.utilitaires,
		);
	}
	construireInstances() {
		this.identDestinataires = this.add(
			ObjetDestinatairesActualite_1.ObjetDestinatairesActualite,
			this._evntDestinataires.bind(this),
			this._initDestinataires.bind(this),
		);
		this.identCategorie = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._evntCategorie.bind(this),
			this._initCategorie.bind(this),
		);
		this.identPJ = this.add(
			ObjetSelecteurPJ_1.ObjetSelecteurPJ,
			this._evenementPJ.bind(this),
			this._initialiserPJ.bind(this),
		);
		this.identPublication = this.add(
			ObjetPublication_1.ObjetPublication,
			this._evenementPublication.bind(this),
			null,
		);
		this.identQuestions = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementQuestion.bind(this),
			this._initialiserQuestion,
		);
		this.identChoix = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListeChoix.bind(this),
			this._initialiserListeChoix,
		);
	}
	setDonnees(aParam) {
		this.pourCarnetDeClasse =
			!!aParam && !!aParam.pourCarnetDeClasse
				? aParam.pourCarnetDeClasse
				: false;
		this.estCasModele = aParam.estModele;
		this.optionsFenetre.hauteurMin = 660;
		if (aParam.avecChoixAnonyme !== undefined) {
			this.avecChoixAnonyme = aParam.avecChoixAnonyme;
		}
		this.avecRecupModele = aParam.avecRecupModele === true;
		if (aParam.forcerAR !== null && aParam.forcerAR !== undefined) {
			this.forcerAR = aParam.forcerAR;
			if (
				this.forcerAR === true &&
				aParam.genreReponse ===
					TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
						.SansAR
			) {
				aParam.genreReponse =
					TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite.AvecAR;
			}
		}
		if (!this.estCasModele) {
			const lGenresRessourceAffDest =
				aParam && aParam.genresPublic
					? aParam.genresPublic
					: aParam.genrePublic &&
							aParam.genrePublic !== Enumere_Ressource_1.EGenreRessource.Aucune
						? [aParam.genrePublic]
						: [];
			this.getInstance(
				this.identDestinataires,
			).setGenresRessourceAffDestinataire(lGenresRessourceAffDest);
		}
		this.creation = aParam.creation || !aParam.donnee;
		const lParam = { init: true };
		if (!this.estCasModele) {
			if (aParam.cours && aParam.date) {
				lParam.avecCours = true;
				lParam.cours = aParam.cours;
				lParam.date = aParam.date;
			} else if (
				this.getInstance(
					this.identDestinataires,
				).estGenreInGenresRessourceAffDestinataire(
					Enumere_Ressource_1.EGenreRessource.Eleve,
				)
			) {
				lParam.avecPublic = true;
				lParam.listePublic = aParam.listePublic;
			} else if (aParam.listePublicDeListeDiffusion) {
				lParam.listePublicDeListeDiffusion = aParam.listePublicDeListeDiffusion;
			} else if (aParam.punition && aParam.eleve) {
				this.pourPunitionIncident = true;
				this.punition = aParam.punition;
				lParam.eleve = aParam.eleve;
				lParam.punition = aParam.punition;
			} else if (aParam.incident) {
				this.pourPunitionIncident = true;
				this.incident = aParam.incident;
				lParam.incident = aParam.incident;
			}
		}
		new ObjetRequeteDonneesEditionInformation_1.ObjetRequeteDonneesEditionInformation(
			this,
			this._apresRequeteDonneesEditionInformation.bind(this, aParam),
		).lancerRequete(lParam);
	}
	appliquerModele(aParam) {
		const lModele = aParam.modele;
		this.information =
			UtilitaireInformations_1.TUtilitaireInformations.appliquerModeleSurExistant(
				{ modele: lModele, infoSond: this.information },
			);
		this.information.setEtat(this._verifierEtatModification());
	}
	actualiserSurAppliquerModele() {
		const lEstUneInformation = this._estUneInformation();
		this._actualiserCategorie();
		this.question = undefined;
		this._actualiserQuestions({ estCasSondage: !lEstUneInformation });
	}
	actualiserListeCloud() {
		if (GEtatUtilisateur.avecCloudDisponibles()) {
			ObjetHtml_1.GHtml.setHtml(
				this.id.listeCloud,
				UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
					this.question.listePiecesJointes,
					{
						genreFiltre: Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud,
						separateur: " ",
						IEModelChips: "chipsFichierCloud",
					},
				),
				{ controleur: this.controleur },
			);
		}
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			chipsFichierCloud: {
				eventBtn: function (aIndice) {
					const lElement = aInstance.question.listePiecesJointes.get(aIndice);
					if (lElement) {
						lElement.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
						aInstance.actualiserListeCloud();
					}
				},
			},
			boutonChoixIndividusPartage: {
				event: function () {
					if (!!aInstance.information) {
						aInstance.afficherFenetreChoixIndividusPartage();
					}
				},
			},
			getHtmlNbIndividusPartage: function () {
				let lNbIndividusPartage = 0;
				if (
					!!aInstance.information &&
					!!aInstance.information.listeIndividusPartage
				) {
					lNbIndividusPartage =
						aInstance.information.listeIndividusPartage.count();
				}
				return lNbIndividusPartage;
			},
			getHintIndividusPartage: function () {
				let H = [];
				if (
					!!aInstance.information &&
					!!aInstance.information.listeIndividusPartage
				) {
					const lMaxIndividusAffiches = 10;
					const lNbIndividusPartage =
						aInstance.information.listeIndividusPartage.count();
					if (lNbIndividusPartage <= lMaxIndividusAffiches) {
						H =
							aInstance.information.listeIndividusPartage.getTableauLibelles();
					} else {
						aInstance.information.listeIndividusPartage.parcourir(
							(D, aIndex) => {
								H.push(D.getLibelle());
								if (aIndex >= lMaxIndividusAffiches - 1) {
									H.push("...");
									return false;
								}
							},
						);
					}
				}
				return H.length > 0 ? H.join("<br/>") : "";
			},
			btnRecupModele: {
				getNode: function () {
					$(this.node).eventValidation(function () {
						aInstance.moteur.getListeModeles({
							estCasSondage: aInstance.information.estSondage,
							evntClbck: function (aParam) {
								aInstance.appliquerModele({ modele: aParam.modele });
								aInstance.actualiserSurAppliquerModele();
							},
							listeCategories: aInstance.listeCategories,
						});
					});
				},
				getTitle: function () {
					return ObjetTraduction_1.GTraductions.getValeur(
						"actualites.recupererModele",
					);
				},
			},
			cbPublicationPageEtablissement: {
				getValue() {
					return (
						!!aInstance.information &&
						aInstance.information.estInformation &&
						!!aInstance.information.publicationPageEtablissement
					);
				},
				setValue(aValue) {
					if (!!aInstance.information && aInstance.information.estInformation) {
						aInstance.information.publicationPageEtablissement = aValue;
					}
				},
				getDisabled() {
					return !aInstance.information || !aInstance.information.publie;
				},
			},
			pourPageEtablissement: function () {
				if (
					aInstance.avecPublicationPageEtablissement &&
					!!aInstance.information &&
					aInstance.information.estInformation &&
					!aInstance.estCasModele &&
					!aInstance.pourPunitionIncident
				) {
					return true;
				}
				return false;
			},
			radioNatureReponse: {
				getValue(aTypeNature) {
					const lTypeNatureActuel = aInstance.question
						? aInstance.question.genreReponse
						: TypeGenreReponseInternetActualite_1
								.TypeGenreReponseInternetActualite.ChoixUnique;
					return aTypeNature === lTypeNatureActuel;
				},
				setValue(aTypeNature, aValeur) {
					if (aInstance.question && aValeur) {
						aInstance.question.genreReponse = aTypeNature;
						aInstance._initAffNature();
						aInstance.question.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.information.setEtat(
							aInstance._verifierEtatModification(),
						);
					}
				},
			},
			cbAvecLimiteNbChoixReponses: {
				getValue() {
					return aInstance.question && aInstance.question.avecMaximum;
				},
				setValue(aValeur) {
					if (aInstance.question) {
						aInstance.question.avecMaximum = aValeur;
						if (aValeur) {
							const lNombre = aInstance.question.nombreReponsesMax
								? aInstance.question.nombreReponsesMax
								: 2;
							aInstance.question.nombreReponsesMax = lNombre;
						} else {
							aInstance.question.nombreReponsesMax = 0;
						}
						aInstance.question.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.information.setEtat(
							aInstance._verifierEtatModification(),
						);
					}
				},
				getDisabled() {
					return aInstance.getDisabledCBQuestion();
				},
			},
			inputTailleTexteMax: {
				getNote() {
					const lValeurMin = 1;
					let lValeur = null;
					if (aInstance.question) {
						lValeur = aInstance.question.tailleReponse;
					}
					lValeur = Math.max(lValeur, lValeurMin);
					return new TypeNote_1.TypeNote(lValeur);
				},
				setNote(aValue) {
					if (aInstance.question && !aValue.estUneNoteVide()) {
						aInstance.question.tailleReponse = aValue.getValeur();
						aInstance.question.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.information.setEtat(
							aInstance._verifierEtatModification(),
						);
					}
				},
				getOptionsNote() {
					return {
						avecVirgule: false,
						afficherAvecVirgule: false,
						hintSurErreur: true,
						avecAnnotation: false,
						sansNotePossible: false,
						textAlign: "center",
						min: 1,
						max: aInstance.tailleMaxReponse,
					};
				},
				getDisabled() {
					return (
						!aInstance.question ||
						aInstance.question.genreReponse !==
							TypeGenreReponseInternetActualite_1
								.TypeGenreReponseInternetActualite.Textuelle
					);
				},
			},
			inputNbMaximalesReponses: {
				getNote() {
					const lValeurMin = 2;
					let lValeur = null;
					if (aInstance.question) {
						lValeur = aInstance.question.nombreReponsesMax;
					}
					lValeur = Math.max(lValeur, lValeurMin);
					return new TypeNote_1.TypeNote(lValeur);
				},
				setNote(aValue) {
					if (aInstance.question && !aValue.estUneNoteVide()) {
						aInstance.question.nombreReponsesMax = aValue.getValeur();
						aInstance.question.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.information.setEtat(
							aInstance._verifierEtatModification(),
						);
					}
				},
				getOptionsNote() {
					return {
						avecVirgule: false,
						afficherAvecVirgule: false,
						hintSurErreur: true,
						avecAnnotation: false,
						sansNotePossible: false,
						textAlign: "center",
						min: 2,
						max: 100,
					};
				},
				getDisabled() {
					return (
						aInstance.getDisabledCBQuestion() ||
						!aInstance.question ||
						!aInstance.question.avecMaximum
					);
				},
			},
			cbAvecReponseAutre: {
				getValue() {
					let lReponseLibre = aInstance.getReponseReponseLibre(
						aInstance.question,
					);
					return lReponseLibre && lReponseLibre.existe();
				},
				setValue(aValeur) {
					if (aInstance.question && aInstance.question.listeChoix) {
						let lReponseLibre = aInstance.getReponseReponseLibre(
							aInstance.question,
						);
						if (aValeur) {
							if (lReponseLibre) {
								lReponseLibre.Etat = Enumere_Etat_1.EGenreEtat.Aucun;
								lReponseLibre.rang =
									aInstance.question.listeChoix.getNbrElementsExistes();
								lReponseLibre.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							} else {
								const lLibelleAutre = ObjetTraduction_1.GTraductions.getValeur(
									"actualites.Edition.ChoixAutre",
								);
								const lReponseAvecLibelleAutre =
									aInstance.getReponseAvecLibelle(
										aInstance.question,
										lLibelleAutre,
									);
								if (!!lReponseAvecLibelleAutre) {
									lReponseLibre = lReponseAvecLibelleAutre;
									lReponseLibre.setLibelle(lLibelleAutre);
									lReponseLibre.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
								} else {
									lReponseLibre = new ObjetElement_1.ObjetElement(
										lLibelleAutre,
									);
									lReponseLibre.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
									aInstance.question.listeChoix.addElement(lReponseLibre);
								}
								lReponseLibre.estReponseLibre = true;
								lReponseLibre.rang =
									aInstance.question.listeChoix.getNbrElementsExistes();
							}
						} else {
							if (lReponseLibre) {
								lReponseLibre.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
							}
						}
						aInstance.question.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.information.setEtat(
							aInstance._verifierEtatModification(),
						);
					}
				},
			},
			labelReponseAutre: {
				getValue() {
					let lReponseLibre = aInstance.getReponseReponseLibre(
						aInstance.question,
					);
					return lReponseLibre && lReponseLibre.existe()
						? lReponseLibre.getLibelle()
						: "";
				},
				setValue(aValeur) {
					let lReponseLibre = aInstance.getReponseReponseLibre(
						aInstance.question,
					);
					if (lReponseLibre && lReponseLibre.existe()) {
						lReponseLibre.setLibelle(aValeur);
						lReponseLibre.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.question.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.information.setEtat(
							aInstance._verifierEtatModification(),
						);
					}
				},
				exitChange(aValue) {
					let lReponseLibre = aInstance.getReponseReponseLibre(
						aInstance.question,
					);
					if (lReponseLibre && lReponseLibre.existe() && !aValue) {
						lReponseLibre.setLibelle(
							ObjetTraduction_1.GTraductions.getValeur(
								"actualites.Edition.ChoixAutre",
							),
						);
						lReponseLibre.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.question.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.information.setEtat(
							aInstance._verifierEtatModification(),
						);
					}
				},
				getDisabled() {
					let lReponseLibre = aInstance.getReponseReponseLibre(
						aInstance.question,
					);
					return !lReponseLibre || !lReponseLibre.existe();
				},
			},
			cbAR: {
				getValue() {
					let lResult = false;
					if (aInstance.question) {
						lResult =
							aInstance.question.genreReponse ===
							TypeGenreReponseInternetActualite_1
								.TypeGenreReponseInternetActualite.AvecAR;
					}
					return lResult;
				},
				setValue(aChecked) {
					if (aInstance.question && aInstance.information) {
						aInstance.question.genreReponse = aChecked
							? TypeGenreReponseInternetActualite_1
									.TypeGenreReponseInternetActualite.AvecAR
							: TypeGenreReponseInternetActualite_1
									.TypeGenreReponseInternetActualite.SansAR;
						aInstance.question.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.information.setEtat(
							aInstance._verifierEtatModification(),
						);
					}
				},
				getDisabled() {
					return aInstance._estUnSondage();
				},
			},
			surSaisieAnonyme: {
				getValue(aValeur) {
					switch (aValeur) {
						case "nominatif":
							return (
								aInstance.information && !aInstance.information.reponseAnonyme
							);
						case "anonyme":
							return (
								aInstance.information && !!aInstance.information.reponseAnonyme
							);
						default:
							break;
					}
				},
				setValue(aValeur) {
					switch (aValeur) {
						case "nominatif":
							aInstance.information.reponseAnonyme = false;
							aInstance._actualiserAffichageApresChoixAnonyme();
							break;
						case "anonyme":
							aInstance.information.reponseAnonyme = true;
							aInstance._actualiserAffichageApresChoixAnonyme();
							break;
						default:
							break;
					}
				},
				getDisabled() {
					return aInstance.information && !!aInstance.information.estVerrouille;
				},
			},
		});
	}
	getDisabledCBQuestion() {
		return (
			!this.question ||
			this.question.genreReponse !==
				TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
					.ChoixMultiple
		);
	}
	getReponseAvecLibelle(aQuestion, aLibelleRecherche) {
		let lReponseAvecLibelle;
		if (
			aQuestion &&
			(aQuestion.genreReponse ===
				TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
					.ChoixMultiple ||
				aQuestion.genreReponse ===
					TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
						.ChoixUnique) &&
			aQuestion.listeChoix &&
			aLibelleRecherche
		) {
			aQuestion.listeChoix.getListeElements((aChoix) => {
				if (
					aChoix &&
					aChoix.getLibelle() &&
					aChoix.getLibelle().toLowerCase() === aLibelleRecherche.toLowerCase()
				) {
					lReponseAvecLibelle = aChoix;
					return false;
				}
			});
		}
		return lReponseAvecLibelle;
	}
	getReponseReponseLibre(aQuestion) {
		let lReponseAutre;
		if (
			aQuestion &&
			(aQuestion.genreReponse ===
				TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
					.ChoixMultiple ||
				aQuestion.genreReponse ===
					TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
						.ChoixUnique) &&
			aQuestion.listeChoix
		) {
			aQuestion.listeChoix.getListeElements((aChoix) => {
				if (aChoix.estReponseLibre) {
					lReponseAutre = aChoix;
					return false;
				}
			});
		}
		return lReponseAutre;
	}
	afficherFenetreChoixIndividusPartage() {
		let lIndividusSelectionnes;
		if (!!this.information.listeIndividusPartage) {
			lIndividusSelectionnes = MethodesObjet_1.MethodesObjet.dupliquer(
				this.information.listeIndividusPartage,
			);
		} else {
			lIndividusSelectionnes = new ObjetListeElements_1.ObjetListeElements();
		}
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource,
			{
				pere: this,
				evenement: function (
					aGenreRessource,
					aListeSelectionnee,
					aNumeroBouton,
				) {
					if (aNumeroBouton !== 0) {
						return;
					}
					this.information.listeIndividusPartage = aListeSelectionnee;
					this.information.partageAEteModifie = true;
				},
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"actualites.SelectionnerProfPersonnel",
						),
					});
				},
			},
		);
		lFenetre.setOptionsFenetreSelectionRessource({ autoriseEltAucun: true });
		lFenetre.setDonnees({
			listeRessources: this.listeIndividusPossiblesPartage,
			listeRessourcesSelectionnees: lIndividusSelectionnes,
			genreRessource: Enumere_Ressource_1.EGenreRessource.Personnel,
		});
	}
	surValidation(aGenreBouton) {
		if (aGenreBouton === 1) {
			if (this.question && ObjetHtml_1.GHtml.getDisplay(this.id.message)) {
				const lEditor = TinyInit_1.TinyInit.get(this.id.EditeurHTML);
				const lContent = lEditor.getContent();
				this.question.texte = lContent;
				this.question.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				if (TinyInit_1.TinyInit.estContenuVide(this.question.texte)) {
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"actualites.MsgAucunContenu",
						),
					});
					return;
				}
			}
			if (
				!this.estCasModele &&
				!!this.information.publie &&
				!this.information.publicationPageEtablissement
			) {
				let lIlYADesIndividusSelectionne = false;
				if (
					this.getInstance(
						this.identDestinataires,
					).estGenreInGenresRessourceAffDestinataire(
						Enumere_Ressource_1.EGenreRessource.Eleve,
					) &&
					this.information.listePublicIndividu.count() > 0
				) {
					for (
						let i = 0;
						i < this.information.listePublicIndividu.count() &&
						!lIlYADesIndividusSelectionne;
						i++
					) {
						const lIndividu = this.information.listePublicIndividu.get(i);
						if (lIndividu.Genre !== Enumere_Ressource_1.EGenreRessource.Eleve) {
							lIlYADesIndividusSelectionne = true;
						}
					}
					if (!lIlYADesIndividusSelectionne) {
						lIlYADesIndividusSelectionne =
							this.information.avecEleve ||
							this.information.avecResp1 ||
							this.information.avecResp2 ||
							this.information.avecProfsPrincipaux ||
							this.information.avecTuteurs;
					}
				} else {
					lIlYADesIndividusSelectionne =
						this.information.listePublicIndividu.count() > 0 ||
						!!this.information.avecDirecteur;
				}
				const lNbPublicEntite = this.information.listePublicEntite.count();
				const lNbGenreEntite = this.information.genresPublicEntite.count();
				let lMessagePbDestinataires = null;
				if (this.appSco.getEtatUtilisateur().pourPrimaire()) {
					if (lNbPublicEntite === 0 && !lIlYADesIndividusSelectionne) {
						lMessagePbDestinataires = ObjetTraduction_1.GTraductions.getValeur(
							"actualites.MsgAucunUnDestinataire",
						);
					}
				} else {
					if (lNbGenreEntite > 0 && lNbPublicEntite === 0) {
						lMessagePbDestinataires = ObjetTraduction_1.GTraductions.getValeur(
							"actualites.MsgSelectionnerUneClasseGroupe",
						);
					} else if (lNbGenreEntite === 0 && lNbPublicEntite > 0) {
						lMessagePbDestinataires = ObjetTraduction_1.GTraductions.getValeur(
							"actualites.MsgSelectionnerUneEntite",
						);
					} else if (lNbPublicEntite === 0 && !lIlYADesIndividusSelectionne) {
						lMessagePbDestinataires = ObjetTraduction_1.GTraductions.getValeur(
							"actualites.MsgAucunUnDestinataire",
						);
					}
				}
				if (!!lMessagePbDestinataires) {
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message: lMessagePbDestinataires,
					});
					return;
				}
			}
			if (this.estCasModele === true || !!this.information.publie) {
				let lTestAucuneQuestion = true;
				let lTestPossedeAuMoinsUneQuestion = false;
				const lListeQuestionsVides = [];
				this.information.listeQuestions.parcourir((aQuestion) => {
					if (aQuestion.existe()) {
						lTestAucuneQuestion = false;
						if (
							aQuestion.genreReponse !==
							TypeGenreReponseInternetActualite_1
								.TypeGenreReponseInternetActualite.SansReponse
						) {
							lTestPossedeAuMoinsUneQuestion = true;
						}
						if (TinyInit_1.TinyInit.estContenuVide(aQuestion.texte)) {
							lListeQuestionsVides.push(aQuestion);
						}
					}
				});
				if (!lTestPossedeAuMoinsUneQuestion || lTestAucuneQuestion) {
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"actualites.MsgAucuneQuestion",
						),
					});
					return;
				}
				if (lListeQuestionsVides.length > 0) {
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message:
							lListeQuestionsVides[0].genreReponse !==
							TypeGenreReponseInternetActualite_1
								.TypeGenreReponseInternetActualite.SansReponse
								? ObjetTraduction_1.GTraductions.getValeur(
										"actualites.saisirContenuQuestionN",
										[lListeQuestionsVides[0].indice],
									)
								: ObjetTraduction_1.GTraductions.getValeur(
										"actualites.saisirContenuTexteN",
										[lListeQuestionsVides[0].indice],
									),
					});
					return;
				}
				this.information.setEtat(this._verifierEtatModification());
			}
		}
		if (aGenreBouton === 1) {
			this._validationAuto(aGenreBouton);
		} else {
			this._finSurValidation(aGenreBouton);
		}
	}
	getGenresRessourceAffDestinataire() {
		return this.getInstance(
			this.identDestinataires,
		).getGenresRessourceAffDestinataire();
	}
	composeContenu() {
		const T = [];
		const lHeightDest = this._getHeightDestinataires();
		T.push('<div class="flex-contain cols full-height flex-gap">');
		T.push(
			'<div id="',
			this.getNomInstance(this.identDestinataires),
			'" style="',
			ObjetStyle_1.GStyle.composeHeight(lHeightDest),
			'"></div>',
		);
		T.push('<div id="', this.id.message, '" class="m-top-xl">');
		T.push(this._composeRecupModele());
		T.push(
			'<div id="',
			this.id.choixReponseAnonyme,
			'">',
			this._composeReponseAnonyme(),
			"</div>",
		);
		T.push(this._composeTitre());
		T.push(
			'<div class="flex-contain fluid-bloc m-bottom">',
			`<div class="fix-bloc m-right-l" id="${this.getInstance(this.identQuestions).getNom()}"></div>`,
			'<div class="fluid-bloc flex-contain cols">',
			`<div id="content_${this.id.message}"></div>`,
			'<div class="flex-contain">',
			`<div class="fix-bloc flex-contain cols">${this._composePJ()}</div>`,
			'<div class="fluid-bloc flex-contain cols justify-between">',
			this._composeTinyMessage(),
			"</div>",
			"</div>",
			this._composeNatureReponse(),
			this._composeListePJ(),
			this.composeBtnSignature(),
			"</div>",
			"</div>",
		);
		T.push("</div>");
		T.push(
			`<div id="${this.id.message}_bis" class="fluid-bloc flex-contain p-all-xl" style="display: none;">`,
			this.composeMessage(
				ObjetTraduction_1.GTraductions.getValeur(
					"actualites.Edition.NonModifiable",
				),
			),
			"</div>",
		);
		T.push(this._composeAccuseReception());
		T.push('<div class="general-conteneur fond-gris m-top-l cols">');
		T.push(
			IE.jsx.str(
				"div",
				{
					id: this.id.partage,
					class: "flex-contain flex-center p-top-l p-bottom-l",
				},
				IE.jsx.str("i", {
					class: "icon_eye_open i-medium i-as-deco m-right",
					role: "presentation",
				}),
				IE.jsx.str(
					"label",
					{ id: this.id.labelBtnChoixIndividusPartage },
					ObjetTraduction_1.GTraductions.getValeur(
						"actualites.Edition.DonnerAccesConsultationAuSondage",
					),
				),
				IE.jsx.str(
					"ie-bouton",
					{
						"ie-model": "boutonChoixIndividusPartage",
						class: "m-left",
						"data-tooltip": Tooltip_1.Tooltip.Type.default,
						"aria-label": ObjetTraduction_1.GTraductions.getValeur(
							"actualites.SelectionnerProfPersonnel",
						),
						"aria-describedby": [
							this.id.labelBtnChoixIndividusPartage,
							this.id.nbIndividusPartage,
						].join(" "),
						"aria-haspopup": "dialog",
					},
					"...",
				),
				IE.jsx.str("span", {
					id: this.id.nbIndividusPartage,
					"ie-html": "getHtmlNbIndividusPartage",
					"ie-hint": "getHintIndividusPartage",
					class: "m-left",
				}),
			),
		);
		T.push(
			`<div id="${this.id.publication}" class="p-top-l p-bottom-l">`,
			`<div id="${this.getInstance(this.identPublication).getNom()}"></div>`,
			"</div>",
		);
		if (this.avecPublicationPageEtablissement) {
			T.push(
				IE.jsx.str(
					"ie-checkbox",
					{
						"ie-model": "cbPublicationPageEtablissement",
						"ie-display": "pourPageEtablissement",
						class: "p-top-l p-bottom-l",
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"actualites.Edition.publicationPageEtablissement",
					),
				),
			);
		}
		T.push("</div>");
		T.push("</div>");
		return T.join("");
	}
	jsxSaisieTitre() {
		return {
			getValue: () => {
				var _a;
				return (_a = this.information) === null || _a === void 0
					? void 0
					: _a.getLibelle();
			},
			setValue: (aValue) => {
				this.information.setLibelle(aValue);
				this.information.setEtat(this._verifierEtatModification());
			},
		};
	}
	jsxDisplayBoutonSignature() {
		if (!this.avecBtnSignature()) {
			return false;
		}
		if (
			this._estUnSondage() &&
			this.question &&
			"genreReponse" in this.question &&
			this.question.genreReponse !==
				TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
					.SansReponse
		) {
			return false;
		}
		return !!this.question;
	}
	jsxModelBoutonSignature() {
		return {
			event: () => {
				const lEtatUtilisateur = this.appSco.getEtatUtilisateur();
				if (!lEtatUtilisateur.messagerieSignature) {
					return;
				}
				const lSignature = lEtatUtilisateur.messagerieSignature.signature;
				if (this.question && this.tinySet) {
					const lEditor = TinyInit_1.TinyInit.get(this.id.EditeurHTML);
					const lContent = lEditor.getContent();
					this.question.texte = lContent ? lContent + lSignature : lSignature;
					this.question.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					this._actualiserAffichageQuestion();
				}
			},
			getDisabled: () => {
				return this.information && this.information.estVerrouille;
			},
		};
	}
	controlerSurValidation() {
		if (!!this.question && this.tinySet) {
			const lEditor = TinyInit_1.TinyInit.get(this.id.EditeurHTML);
			const lContent = lEditor.getContent();
			this.question.texte = lContent;
			this.question.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			if (TinyInit_1.TinyInit.estContenuVide(this.question.texte)) {
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"actualites.MsgAucunContenu",
					),
				});
				return false;
			}
		}
		return true;
	}
	_estUneInformation() {
		return !!this.information && !!this.information.estInformation;
	}
	_estUnSondage() {
		return !this._estUneInformation();
	}
	_evntCategorie(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.information.categorie = aParams.element;
			this.information.setEtat(this._verifierEtatModification());
		}
	}
	_evntDestinataires() {
		this.information.setEtat(this._verifierEtatModification());
	}
	_evenementPJ() {
		this.question.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.information.setEtat(this._verifierEtatModification());
	}
	_evenementPublication(aResult) {
		this.information.publie = aResult.publie;
		if (!this.information.publie) {
			this.information.publicationPageEtablissement = false;
		}
		this.information.dateDebut = aResult.dateDebut;
		this.information.dateFin = aResult.dateFin;
		this.information.setEtat(this._verifierEtatModification());
		this._actualiserLibelleBtnValider();
	}
	_actualiserLibelleBtnValider() {
		if (this.creation && !this.information.estModele) {
			const lStr = this.information.publie
				? ObjetTraduction_1.GTraductions.getValeur("infoSond.publier")
				: ObjetTraduction_1.GTraductions.getValeur("infoSond.creerBrouillon");
			this.setBoutonLibelle(1, lStr);
		}
	}
	_evenementQuestion(aParametres) {
		let lIndice, lContent;
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
				const lQuestion = this.information.listeQuestions.get(
					aParametres.ligne,
				);
				if (
					!!this.question &&
					lQuestion.getNumero() === this.question.getNumero() &&
					lQuestion.getLibelle() === this.question.getLibelle()
				) {
					return;
				}
				if (this.tinySet && !!this.question) {
					const lEditor = TinyInit_1.TinyInit.get(this.id.EditeurHTML);
					lContent = lEditor.getContent();
					this.question.texte = lContent;
					this.question.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					if (
						TinyInit_1.TinyInit.estContenuVide(this.question.texte) &&
						this.question.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression
					) {
						GApplication.getMessage().afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"actualites.MsgAucunContenu",
							),
						});
						lIndice = this.information.listeQuestions.getIndiceParElement(
							this.question,
						);
						this.getInstance(this.identQuestions).selectionnerLigne({
							deselectionnerTout: true,
							ligne: lIndice,
							avecEvenement: false,
						});
						return;
					}
				}
				this.question = lQuestion;
				this._actualiserAffichageQuestion();
				this._actualiserDonneesQuestion();
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresSuppression: {
				let lNbr = this.information.listeQuestions.count() + 1;
				let lRang = 1;
				this.information.listeQuestions.setTri([
					ObjetTri_1.ObjetTri.init("rang"),
				]);
				this.information.listeQuestions.trier();
				let lIndiceT = 1,
					lIndiceQ = 1;
				this.information.listeQuestions.parcourir((aElement) => {
					if (aElement.existe()) {
						if (aElement.rang !== lRang) {
							aElement.rang = lRang;
							aElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						}
						lRang++;
						if (
							aElement.genreReponse ===
							TypeGenreReponseInternetActualite_1
								.TypeGenreReponseInternetActualite.SansReponse
						) {
							aElement.indice = lIndiceT;
							lIndiceT++;
						} else {
							aElement.indice = lIndiceQ;
							lIndiceQ++;
						}
						aElement.setLibelle(
							this.moteurInfoSond.getLibelleAffichageComposanteQuest({
								composante: aElement,
								rang: aElement.indice,
							}),
						);
					} else {
						aElement.rang = lNbr;
						lNbr++;
					}
				});
				this.information.listeQuestions.trier();
				this.getInstance(this.identQuestions).actualiser();
				if (this.information.listeQuestions.getNbrElementsExistes() > 0) {
					this.getInstance(this.identQuestions).selectionnerLigne({
						ligne: 0,
						avecEvenement: true,
					});
				} else {
					this.question = undefined;
					this._actualiserAffichageQuestion();
					this._actualiserDonneesQuestion();
				}
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				if (this.tinySet && !!this.question) {
					const lEditor = TinyInit_1.TinyInit.get(this.id.EditeurHTML);
					lContent = lEditor.getContent();
					this.question.texte = lContent;
					this.question.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					if (TinyInit_1.TinyInit.estContenuVide(this.question.texte)) {
						GApplication.getMessage().afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"actualites.MsgAucunContenu",
							),
						});
						return Enumere_EvenementListe_1.EGenreEvenementListe.Creation;
					}
				}
				ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
					pere: this,
					initCommandes: (aInstanceMenu) => {
						aInstanceMenu.add(
							ObjetTraduction_1.GTraductions.getValeur(
								"actualites.Edition.Question",
							),
							true,
							() => {
								this.creerNouvelleQuestionOuTexte(false);
							},
						);
						aInstanceMenu.add(
							ObjetTraduction_1.GTraductions.getValeur(
								"actualites.Edition.Texte",
							),
							true,
							() => {
								this.creerNouvelleQuestionOuTexte(true);
							},
						);
					},
				});
				return Enumere_EvenementListe_1.EGenreEvenementListe.Creation;
			default:
				break;
		}
	}
	creerNouvelleQuestionOuTexte(aEstUnTexte) {
		const lListe = this.information.listeQuestions.getListeElements(
			(aElement) => {
				return (
					aElement.existe() &&
					((aEstUnTexte &&
						aElement.genreReponse ===
							TypeGenreReponseInternetActualite_1
								.TypeGenreReponseInternetActualite.SansReponse) ||
						(!aEstUnTexte &&
							aElement.genreReponse !==
								TypeGenreReponseInternetActualite_1
									.TypeGenreReponseInternetActualite.SansReponse))
				);
			},
		);
		const lParamsCreationQuestion = {
			rang: this.information.listeQuestions.getNbrElementsExistes() + 1,
			rangElement: lListe.getNbrElementsExistes() + 1,
			genreReponse: aEstUnTexte
				? TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
						.SansReponse
				: TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
						.ChoixUnique,
		};
		const lElement =
			UtilitaireInformations_1.TUtilitaireInformations.creerQuestionOuTexteSondage(
				lParamsCreationQuestion,
			);
		this.information.listeQuestions.addElement(lElement);
		lElement.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		this.information.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.getInstance(this.identQuestions).actualiser();
		const lIndice =
			this.information.listeQuestions.getIndiceParElement(lElement);
		if (lIndice !== null) {
			this.getInstance(this.identQuestions).selectionnerLigne({
				ligne: lIndice,
				avecEvenement: true,
			});
		}
	}
	_evenementListeChoix(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresCreation:
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresSuppression:
				this.choixVide = false;
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"actualites.MaxNombreChoix",
					),
				});
				break;
			default:
				break;
		}
	}
	_callbackSurMenuContextListeQuestions(aGenreActionMenu, aIndiceLigne) {
		switch (aGenreActionMenu) {
			case DonneesListe_ActualitesQuestion_1.DonneesListe_ActualitesQuestion
				.genreAction.monter:
			case DonneesListe_ActualitesQuestion_1.DonneesListe_ActualitesQuestion
				.genreAction.descendre: {
				this.getInstance(this.identQuestions).actualiser(aIndiceLigne === -1);
				if (aIndiceLigne > -1) {
					this.getInstance(this.identQuestions).selectionnerLigne({
						ligne: aIndiceLigne,
						avecEvenement: true,
					});
				}
				return;
			}
			case DonneesListe_ActualitesQuestion_1.DonneesListe_ActualitesQuestion
				.genreAction.dupliquer:
				return this.controlerSurValidation();
		}
	}
	_callbackSurMenuContextListeChoix(aGenreActionMenu, aIndiceLigne) {
		switch (aGenreActionMenu) {
			case DonneesListe_ActualitesChoix_1.DonneesListe_ActualitesChoix
				.genreAction.monter:
			case DonneesListe_ActualitesChoix_1.DonneesListe_ActualitesChoix
				.genreAction.descendre:
				if (aIndiceLigne > -1) {
					this.getInstance(this.identChoix).selectionnerLigne({
						ligne: aIndiceLigne,
						avecEvenement: true,
					});
				}
				break;
		}
	}
	_initCategorie(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 150,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"actualites.Categorie",
			),
		});
	}
	_initDestinataires(aInstance) {
		aInstance.setOptions({
			largeur: this.optionsFenetre.largeur,
			avecCallbckSurModification: true,
		});
	}
	_initialiserPJ(aInstance) {
		aInstance.setOptions({
			genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
			genreRessourcePJ:
				Enumere_Ressource_1.EGenreRessource.DocJointEtablissement,
			avecMenuContextuel: false,
			maxFiles: 0,
			maxSize: this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
			),
			ouvrirFenetreChoixTypesAjout: true,
			optionsCloud: {
				avecCloud: true,
				callbackChoixFichierParFichier: this.surAjoutUnFichierCloud.bind(this),
				callbackChoixFichierFinal: this.surAjoutFinalFichiersClouds.bind(this),
			},
			avecAjoutExistante: true,
			avecBoutonSupp: true,
			fenetrePieceJointe: { avecBoutonActualiser: false },
			avecEtatSaisie: this.avecEtatSaisie,
			title: ObjetTraduction_1.GTraductions.getValeur(
				"actualites.Edition.ModifPJ",
			),
		});
	}
	surAjoutUnFichierCloud(aNewElement) {
		this.question.listePiecesJointes.addElement(aNewElement);
		this.listePJ.addElement(aNewElement);
	}
	surAjoutFinalFichiersClouds() {
		this.actualiserListeCloud();
		this.information.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		if (this.avecEtatSaisie) {
			this.setEtatSaisie(true);
		}
	}
	_initialiserQuestion(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_ActualitesQuestion_1.DonneesListe_ActualitesQuestion
				.colonnes.libelle,
			taille: 140,
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			ariaLabel: ObjetTraduction_1.GTraductions.getValeur(
				"actualites.question.ariaLabel",
			),
			titreCreation: ObjetTraduction_1.GTraductions.getValeur(
				"actualites.question.nouveau",
			),
			avecLigneCreation: true,
			boutons: [
				{ genre: ObjetListe_1.ObjetListe.typeBouton.monter },
				{ genre: ObjetListe_1.ObjetListe.typeBouton.descendre },
				{ genre: ObjetListe_1.ObjetListe.typeBouton.supprimer },
			],
		});
	}
	_initialiserListeChoix(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_ActualitesChoix_1.DonneesListe_ActualitesChoix.colonnes
				.libelle,
			taille: "100%",
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			ariaLabel: ObjetTraduction_1.GTraductions.getValeur(
				"actualites.choix.ariaLabel",
			),
			titreCreation: ObjetTraduction_1.GTraductions.getValeur(
				"actualites.choix.nouveau",
			),
			listeCreations: 0,
			avecLigneCreation: true,
			avecCreationEnBoutonDesignClassique: true,
			boutons: [
				{ genre: ObjetListe_1.ObjetListe.typeBouton.monter },
				{ genre: ObjetListe_1.ObjetListe.typeBouton.descendre },
				{ genre: ObjetListe_1.ObjetListe.typeBouton.supprimer },
			],
		});
	}
	_initTiny(aEstUneInformation, aReset) {
		const lEditor = TinyInit_1.TinyInit.get(this.id.EditeurHTML);
		if (this.id.EditeurHTML && !lEditor) {
			const lHeight =
				this.height.zoneMessage - 80 - (aEstUneInformation ? 0 : 83);
			TinyInit_1.TinyInit.init({
				id: this.id.EditeurHTML,
				min_height: lHeight,
				max_height: lHeight,
			}).then(
				() => {
					this._initTiny(aEstUneInformation, aReset);
				},
				() => {},
			);
			return;
		}
		if (aReset) {
			lEditor.setContent("");
		}
		if (!!this.question) {
			lEditor.show();
			lEditor.setContent(this.question.texte);
			this.tinySet = true;
		} else {
			lEditor.hide();
			this.tinySet = false;
		}
	}
	_apresRequeteDonneesEditionInformation(aParam, aDonnees) {
		if (aDonnees.listeCategories) {
			this.listeCategories = aDonnees.listeCategories;
		}
		if (aDonnees.tailleMaxTitre) {
			this.tailleMaxTitre = aDonnees.tailleMaxTitre;
		}
		if (aDonnees.tailleMaxReponse) {
			this.tailleMaxReponse = aDonnees.tailleMaxReponse;
		}
		if (!this.estCasModele) {
			if (!!aDonnees.listeIndividusPossiblesPartage) {
				const lListeIndividusPossiblesPartage =
					new ObjetListeElements_1.ObjetListeElements();
				const lHashParents = {};
				aDonnees.listeIndividusPossiblesPartage.parcourir((aElement) => {
					const lGenre = aElement.getGenre();
					if (!lHashParents[lGenre]) {
						const lParent = new ObjetElement_1.ObjetElement(
							lGenre === Enumere_Ressource_1.EGenreRessource.Personnel
								? ObjetTraduction_1.GTraductions.getValeur(
										"Messagerie.Personnels",
									)
								: ObjetTraduction_1.GTraductions.getValeur("Messagerie.Profs"),
							0,
							lGenre,
						);
						lHashParents[lGenre] = lParent;
						lParent.estUnDeploiement = true;
						lParent.estDeploye = true;
						lListeIndividusPossiblesPartage.addElement(lParent);
					}
					aElement.pere = lHashParents[lGenre];
					lListeIndividusPossiblesPartage.addElement(aElement);
				});
				this.listeIndividusPossiblesPartage = lListeIndividusPossiblesPartage;
			}
		}
		if (this.pourPunitionIncident && aDonnees.categorie) {
			this.indiceCategorieParDefaut =
				this.listeCategories.getIndiceElementParFiltre((aElement) => {
					return aElement.getNumero() === aDonnees.categorie.getNumero();
				});
		} else {
			this.indiceCategorieParDefaut =
				this.listeCategories.getIndiceElementParFiltre((aElement) => {
					return aElement.estDefaut;
				});
		}
		if (this.indiceCategorieParDefaut === -1) {
			this.indiceCategorieParDefaut = 0;
		}
		const lListePeriodes =
			UtilitaireInformations_1.TUtilitaireInformations.initListePeriodes.bind(
				this,
			)();
		this.listePJ = MethodesObjet_1.MethodesObjet.dupliquer(
			this.appSco.getEtatUtilisateur().listeDonnees[
				TypeHttpNotificationDonnes_1.TypeHttpNotificationDonnes
					.THND_ListeDocJointEtablissement
			],
		);
		if (aDonnees.equipe) {
			this.listePartiel = aDonnees.equipe;
		} else {
			this.listePartiel = undefined;
		}
		this.tinySet = false;
		const lNewInformation =
			UtilitaireInformations_1.TUtilitaireInformations.initialiserNouveauItem({
				categorie: this.listeCategories.get(this.indiceCategorieParDefaut),
				indiceCategorieParDefaut: this.indiceCategorieParDefaut,
				genresPublic: aParam.genresPublic,
				listePublic:
					aParam.cours && aParam.date
						? aDonnees.listeEleves
						: aParam.listePublic
							? aParam.listePublic
							: aDonnees && aDonnees.listePublic
								? aDonnees.listePublic
								: undefined,
				genreReponse: aParam.genreReponse,
				publie: aParam.publie,
				estModele: this.estCasModele,
				genresRessourceAffDestinataire:
					this.getGenresRessourceAffDestinataire(),
			});
		this.informationOriginal = aParam.donnee || lNewInformation;
		if (aDonnees.titre) {
			this.informationOriginal.setLibelle(aDonnees.titre);
		}
		this.information = MethodesObjet_1.MethodesObjet.dupliquer(
			this.informationOriginal,
		);
		this.information.avecEleve = false;
		this.information.avecResp1 = false;
		this.information.avecResp2 = false;
		this.information.avecProfsPrincipaux = false;
		this.information.avecTuteurs = false;
		if (aParam.listePublicDeListeDiffusion) {
			this.information.listePublicIndividu =
				MethodesObjet_1.MethodesObjet.dupliquer(
					aParam.listePublicDeListeDiffusion,
				);
		}
		if (
			aParam.appliquerModele !== null &&
			aParam.appliquerModele !== undefined
		) {
			this.appliquerModele({ modele: aParam.appliquerModele });
		}
		ObjetHtml_1.GHtml.setValue(this.id.titre, this.information.getLibelle());
		const lEstUneInformation = this._estUneInformation();
		let lHeightDest;
		if (!this.information.estVerrouille) {
			lHeightDest = this._getHeightDestinataires();
			this.height.zoneMessage =
				this.optionsFenetre.hauteur -
				(lEstUneInformation || !this.avecChoixAnonyme
					? 0
					: this.height.zoneReponseAnonyme) -
				lHeightDest -
				this.height.zonePublication -
				90;
		} else {
			this.height.zoneMessage = 200;
			this.optionsFenetre.hauteur = 360;
			this.optionsFenetre.hauteurMin = 360;
		}
		this.afficher();
		if (!this.information.estVerrouille) {
			ObjetHtml_1.GHtml.setDisplay(this.id.message + "_bis", false);
			ObjetHtml_1.GHtml.setDisplay(this.id.message, true);
			$("#" + this.getNomInstance(this.identDestinataires).escapeJQ()).height(
				lHeightDest,
			);
		} else {
			ObjetHtml_1.GHtml.setDisplay(this.id.message, false);
			ObjetHtml_1.GHtml.setDisplay(this.id.message + "_bis", true);
		}
		this._actualiserCategorie();
		if (this.avecRecupModele) {
			$("#" + this.id.recupModele.escapeJQ()).show();
		} else {
			$("#" + this.id.recupModele.escapeJQ()).hide();
		}
		if (lEstUneInformation) {
			$("#" + this.getInstance(this.identQuestions).getNom().escapeJQ()).hide();
			$("#" + this.id.choixReponseAnonyme.escapeJQ()).hide();
			$("#" + this.id.natureReponse.escapeJQ()).hide();
			if (this.forcerAR !== true) {
				$("#" + this.id.accuseReception.escapeJQ()).show();
			} else {
				$("#" + this.id.accuseReception.escapeJQ()).hide();
			}
			$("#" + this.id.partage.escapeJQ()).hide();
		} else {
			$("#" + this.getInstance(this.identQuestions).getNom().escapeJQ()).show();
			if (this.avecChoixAnonyme) {
				$("#" + this.id.choixReponseAnonyme.escapeJQ()).show();
			} else {
				$("#" + this.id.choixReponseAnonyme.escapeJQ()).hide();
			}
			$("#" + this.id.accuseReception.escapeJQ()).hide();
			$("#" + this.id.natureReponse.escapeJQ()).show();
			if (!this.estCasModele) {
				$("#" + this.id.partage.escapeJQ()).show();
			}
		}
		this._actualiserQuestions({
			estCasSondage: !lEstUneInformation,
			texteInfo: aDonnees.texte,
		});
		if (!this.estCasModele) {
			this._actualiserPublication({ listePeriodes: lListePeriodes });
			this._actualiserDestinataires({ donnees: aDonnees });
		} else {
			$("#" + this.id.publication.escapeJQ()).hide();
			$("#" + this.id.partage.escapeJQ()).hide();
			$("#" + this.getNomInstance(this.identDestinataires).escapeJQ()).hide();
		}
		this._actualiserLibelleBtnValider();
	}
	_actualiserAffichageQuestion() {
		this.choixVide = !this.question || this.question.listeChoix.count() === 0;
		if (!!this.question) {
			$("#" + "content_" + this.id.message.escapeJQ()).show();
		} else {
			$("#" + "content_" + this.id.message.escapeJQ()).hide();
		}
		if (!this.information.estVerrouille) {
			this._initTiny(this._estUneInformation(), this.tinySet);
		}
		if (!!this.question) {
			if (
				this.question.genreReponse ===
				TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
					.SansReponse
			) {
				$("#" + this.id.natureReponse.escapeJQ()).hide();
				$("#" + this.id.conteneurListeChoixReponses.escapeJQ()).hide();
			} else {
				if (!this.information.estInformation) {
					$("#" + this.id.natureReponse.escapeJQ()).show();
				}
				if (
					this.question.genreReponse ===
						TypeGenreReponseInternetActualite_1
							.TypeGenreReponseInternetActualite.ChoixMultiple ||
					this.question.genreReponse ===
						TypeGenreReponseInternetActualite_1
							.TypeGenreReponseInternetActualite.ChoixUnique
				) {
					$("#" + this.id.conteneurListeChoixReponses.escapeJQ()).show();
					this._initListeChoix();
					this.getInstance(this.identChoix).setDonnees(
						new DonneesListe_ActualitesChoix_1.DonneesListe_ActualitesChoix(
							this.question.listeChoix,
							this._callbackSurMenuContextListeChoix.bind(this),
							true,
						),
					);
				} else {
					$("#" + this.id.conteneurListeChoixReponses.escapeJQ()).hide();
				}
			}
		}
	}
	_actualiserDonneesQuestion() {
		this.getInstance(this.identPJ).setActif(!!this.question);
		if (!this.question) {
			return;
		}
		this.getInstance(this.identPJ).setDonnees({
			idListePJ: this.id.listePJ,
			listePJ: this.question.listePiecesJointes,
			listeTotale: this.listePJ,
			idContextFocus: this.Nom,
		});
		if (this.avecChoixAnonyme) {
			this._actualiserAffichageApresChoixAnonyme();
		}
		this.actualiserListeCloud();
	}
	_validationAuto(aGenreBouton) {
		this.toastMessage = ObjetTraduction_1.GTraductions.getValeur(
			"actualites.PublicationEffective",
		);
		if (
			this.information &&
			this.information.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun
		) {
			this.information.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			if (this.information.publie === false) {
				this.toastMessage = ObjetTraduction_1.GTraductions.getValeur(
					"actualites.BrouillonEnregistre",
				);
			}
			const lListeActualites = new ObjetListeElements_1.ObjetListeElements();
			lListeActualites.addElement(this.information);
			const lGenresRessAffDestinataire =
				this.getGenresRessourceAffDestinataire();
			const lObjetSaisie = {
				listeActualite: lListeActualites,
				validationDirecte: false,
				saisieActualite: true,
				listeDocuments: this.listePJ,
				genresAffDestinataire: lGenresRessAffDestinataire,
			};
			if (this.pourPunitionIncident) {
				if (this.punition) {
					lObjetSaisie.punition = this.punition;
				}
				if (this.incident) {
					lObjetSaisie.incident = this.incident;
				}
			}
			new ObjetRequeteSaisieActualites_1.ObjetRequeteSaisieActualites(
				this,
				this._reponseSaisie.bind(this, 1),
			)
				.addUpload({ listeFichiers: this.listePJ, listeDJCloud: this.listePJ })
				.lancerRequete(lObjetSaisie)
				.then((aReponse) => {
					if (aReponse[0] === ObjetRequeteJSON_1.EGenreReponseSaisie.succes) {
						if (!this.information.estModele) {
							Toast_1.Toast.afficher({
								msg: this.toastMessage,
								type: Toast_1.ETypeToast.succes,
							});
						}
					}
				});
		} else {
			this._finSurValidation(aGenreBouton);
		}
	}
	_reponseSaisie(aGenreBouton, aJSONReponse, aJSONRapportSaisie) {
		if (this.avecEtatSaisie) {
			this.setEtatSaisie(false);
		}
		this._finSurValidation(aGenreBouton, aJSONRapportSaisie);
	}
	_finSurValidation(aGenreBouton, aJSONRapportSaisie) {
		if (this.id.EditeurHTML && ObjetHtml_1.GHtml.getDisplay(this.id.message)) {
			const lEditor = TinyInit_1.TinyInit.get(this.id.EditeurHTML);
			if (lEditor) {
				lEditor.execCommand("mceFocus", false, this.id.EditeurHTML);
				lEditor.execCommand("mceRemoveControl", false, this.id.EditeurHTML);
			}
		}
		this.fermer();
		const lParam = {
			creation: this.creation,
			donnee: aGenreBouton === 0 ? this.informationOriginal : this.information,
			listeDocuments: this.listePJ,
		};
		if (this.pourPunitionIncident) {
			if (this.punition) {
				lParam.punition = this.punition;
			}
			if (this.incident) {
				lParam.incident = this.incident;
			}
		}
		if (
			aJSONRapportSaisie !== null &&
			aJSONRapportSaisie !== undefined &&
			aJSONRapportSaisie.infoSondCree !== null &&
			aJSONRapportSaisie.infoSondCree !== undefined
		) {
			lParam.eltCree = aJSONRapportSaisie.infoSondCree;
		}
		this.callback.appel(aGenreBouton, lParam);
	}
	_composeRecupModele() {
		const T = [];
		T.push(
			'<div id="',
			this.id.recupModele,
			'" class="m-bottom-l m-left-big m-top-l">',
		);
		T.push(
			'<ie-bouton ie-icon="icon_sondage_bibliotheque" ie-node="btnRecupModele.getNode" ie-title="btnRecupModele.getTitle" class="themeBoutonNeutre" aria-haspopup="dialog">',
			ObjetTraduction_1.GTraductions.getValeur("actualites.recupererModele"),
			"</ie-bouton>",
		);
		T.push("</div>");
		return T.join("");
	}
	_composeTitre() {
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				{ class: "flex-contain flex-center justify-between m-bottom-xl" },
				IE.jsx.str(
					"label",
					{
						for: this.id.titre,
						class: "ie-titre-petit semi-bold fix-bloc m-right",
					},
					ObjetTraduction_1.GTraductions.getValeur("actualites.Colonnes.Titre"),
					": ",
				),
				IE.jsx.str("input", {
					class: "fluid-bloc m-right",
					name: "titre",
					maxlength: this.tailleMaxTitre,
					id: this.id.titre,
					"ie-model": this.jsxSaisieTitre.bind(this),
				}),
				IE.jsx.str("div", {
					class: "Gras fix-bloc",
					id: this.getNomInstance(this.identCategorie),
				}),
			),
		);
		return T.join("");
	}
	_composePJ() {
		const T = [];
		T.push(
			'<div class="pj-global-conteneur" id="',
			this.getInstance(this.identPJ).getNom(),
			'"></div>',
		);
		return T.join("");
	}
	_composeTinyMessage() {
		let lHeightARetirer = 0;
		if (this._estUnSondage()) {
			lHeightARetirer = 83;
		}
		const T = [];
		T.push(
			'<div  id="',
			this.id.EditeurHTML,
			'" style="width:100%;',
			ObjetStyle_1.GStyle.composeHeight(
				this.height.zoneMessage - 80 - lHeightARetirer,
			),
			'"></div>',
		);
		return T.join("");
	}
	_composeListePJ() {
		const T = [];
		T.push('<div class="m-y-l m-left-big p-left">');
		T.push(
			'<div class="docs-joints" id="',
			this.id.listePJ,
			'" style="width:100%;"></div>',
		);
		T.push('<div id="', this.id.listeCloud, '" style="width:100%;"></div>');
		T.push("</div>");
		return T.join("");
	}
	avecBtnSignature() {
		var _a, _b;
		return (
			!!((_b =
				(_a = this.appSco.getEtatUtilisateur()) === null || _a === void 0
					? void 0
					: _a.messagerieSignature) === null || _b === void 0
				? void 0
				: _b.signature) &&
			(this._estUneInformation() || this._estUnSondage())
		);
	}
	composeBtnSignature() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			this.avecBtnSignature() &&
				IE.jsx.str(
					"div",
					{
						class: ["m-left-big"],
						"ie-display": this.jsxDisplayBoutonSignature.bind(this),
					},
					IE.jsx.str(
						"ie-bouton",
						{
							"ie-model": this.jsxModelBoutonSignature.bind(this),
							"ie-icon": "icon_signature",
							class: "themeBoutonNeutre",
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"actualites.HintAjouterSignature",
						),
					),
				),
		);
	}
	_composeNatureReponse() {
		const T = [];
		T.push(
			'<div id="',
			this.id.natureReponse,
			'" class="fluid-bloc flex-contain cols m-top-l">',
		);
		T.push('<div style="margin-left:3.5rem;">');
		T.push(
			'<div class="flex-contain flex-center">',
			'<ie-radio ie-model="radioNatureReponse(',
			TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
				.Textuelle,
			')">',
			ObjetTraduction_1.GTraductions.getValeur(
				"actualites.Edition.ReponseASaisir",
			),
			"</ie-radio>",
			'<ie-inputnote id ="',
			this.id.tailleTexte,
			'" ie-model="inputTailleTexteMax" style="width: 3.5rem;" class="m-left m-right"></ie-inputnote>',
			'<label for="',
			this.id.tailleTexte,
			'">',
			ObjetTraduction_1.GTraductions.getValeur(
				"actualites.Edition.NbrCharTexte",
			),
			"</label>",
			"</div>",
		);
		T.push(
			"<div>",
			'<ie-radio ie-model="radioNatureReponse(',
			TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
				.ChoixUnique,
			')">',
			ObjetTraduction_1.GTraductions.getValeur(
				"actualites.Edition.ChoixUnique",
			),
			"</ie-radio>",
			"</div>",
		);
		T.push(
			'<div class="flex-contain flex-center">',
			'<ie-radio ie-model="radioNatureReponse(',
			TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
				.ChoixMultiple,
			')">',
			ObjetTraduction_1.GTraductions.getValeur(
				"actualites.Edition.ChoixMultiple",
			),
			"</ie-radio>",
			'<ie-checkbox ie-model="cbAvecLimiteNbChoixReponses" class="m-left"><span id="',
			this.id.nbrChoix,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("actualites.Edition.NbrChoix"),
			"</span></ie-checkbox>",
			'<ie-inputnote aria-labelledby="',
			this.id.nbrChoix,
			'" ie-model="inputNbMaximalesReponses" style="width: 2.5rem;" class="m-left"></ie-inputnote>',
			"</div>",
		);
		T.push("</div>");
		T.push(
			'<div id="',
			this.id.conteneurListeChoixReponses,
			'">',
			'<div class="flex-contain flex-center">',
			'<ie-checkbox ie-model="cbAvecReponseAutre"><span id="',
			this.id.reponseAutre,
			'">',
			ObjetTraduction_1.GTraductions.getValeur(
				"actualites.Edition.AvecChoixAutre",
			),
			"</span></ie-checkbox>",
			'<input aria-labelledby="',
			this.id.reponseAutre,
			'" class="m-left m-top-s m-bottom-s" ie-model="labelReponseAutre" maxlength="200"></input>',
			"</div>",
			'<div style="',
			ObjetStyle_1.GStyle.composeHeight(110),
			'" id="',
			this.getInstance(this.identChoix).getNom(),
			'">',
			"</div>",
			"</div>",
		);
		T.push("</div>");
		return T.join("");
	}
	_composeAccuseReception() {
		const T = [];
		T.push(
			'<div id="',
			this.id.accuseReception,
			'" class="general-conteneur m-top p-top-l p-bottom-l flex-center">',
			'<ie-checkbox ie-model="cbAR">',
			ObjetTraduction_1.GTraductions.getValeur("actualites.Edition.AvecAR"),
			"</ie-checkbox>",
			"</div>",
		);
		return T.join("");
	}
	_composeReponseAnonyme() {
		const T = [];
		T.push(
			'<div class="flex-contain flex-center m-top-l m-bottom-l m-left-big">',
			'<div class="flex-contain flex-center fix-bloc m-right-l m-left-l">',
			"<ie-radio ie-model=\"surSaisieAnonyme('nominatif')\">",
			ObjetTraduction_1.GTraductions.getValeur("actualites.Nominatif"),
			"</ie-radio>",
			"</div>",
			'<div class="flex-contain flex-center fix-bloc m-right-l">',
			"<ie-radio ie-model=\"surSaisieAnonyme('anonyme')\">",
			ObjetTraduction_1.GTraductions.getValeur("actualites.Anonyme"),
			"</ie-radio>",
			"</div>",
			"</div>",
		);
		return T.join("");
	}
	_getHeightDestinataires() {
		return (
			this.getInstance(this.identDestinataires).getHeightZoneDestinataires() +
			10
		);
	}
	_actualiserAffichageApresChoixAnonyme() {
		this.getInstance(this.identDestinataires).actualiserTabs({
			avecIndividuelInvisible: false,
			conserverSelection: true,
		});
	}
	_initAffNature() {
		if (
			this.question.genreReponse ===
				TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
					.ChoixMultiple ||
			this.question.genreReponse ===
				TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
					.ChoixUnique
		) {
			$("#" + this.id.conteneurListeChoixReponses.escapeJQ()).show();
			this._initListeChoix();
			this.getInstance(this.identChoix).setDonnees(
				new DonneesListe_ActualitesChoix_1.DonneesListe_ActualitesChoix(
					this.question.listeChoix,
					this._callbackSurMenuContextListeChoix.bind(this),
					true,
				),
			);
		} else {
			$("#" + this.id.conteneurListeChoixReponses.escapeJQ()).hide();
		}
	}
	_reinitChoixUnique(aQuestion) {
		let lNewChoix = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur("actualites.Oui"),
		);
		lNewChoix.rang = 1;
		lNewChoix.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		aQuestion.listeChoix.addElement(lNewChoix);
		lNewChoix = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur("actualites.Non"),
		);
		lNewChoix.rang = 2;
		lNewChoix.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		aQuestion.listeChoix.addElement(lNewChoix);
	}
	_initListeChoix() {
		if (
			this.question.genreReponse ===
				TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
					.ChoixUnique &&
			this.question.listeChoix.count() === 0
		) {
			this._reinitChoixUnique(this.question);
		}
		if (
			this.choixVide &&
			this.question.genreReponse ===
				TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
					.ChoixMultiple
		) {
			this.question.listeChoix = new ObjetListeElements_1.ObjetListeElements();
		}
	}
	_publicEstModifie() {
		if (this.estCasModele) {
			return false;
		}
		let lTestListePublicIndividu = false,
			lElement,
			lElementOriginal;
		const lTestCocheAvecDirecteur =
			this.information.avecDirecteur !== this.informationOriginal.avecDirecteur;
		const lTestCocheAvecElevesRattaches =
			this.information.avecElevesRattaches !==
			this.informationOriginal.avecElevesRattaches;
		let lTestGenrePublic =
			!this.information.genresPublicEntite.contains(
				this.informationOriginal.genresPublicEntite,
			) ||
			!this.informationOriginal.genresPublicEntite.contains(
				this.information.genresPublicEntite,
			);
		if (!lTestGenrePublic) {
			lTestListePublicIndividu =
				this.information.listePublicEntite.count() !==
				this.informationOriginal.listePublicEntite.count();
			for (
				let i = 0;
				i < this.information.listePublicEntite.count() && !lTestGenrePublic;
				i++
			) {
				lElement = this.information.listePublicEntite.get(i);
				lElementOriginal =
					this.informationOriginal.listePublicEntite.getElementParNumeroEtGenre(
						lElement.getNumero(),
						lElement.getGenre(),
					);
				lTestGenrePublic = !(
					lElementOriginal && lElementOriginal.existeNumero()
				);
			}
			lTestListePublicIndividu =
				lTestListePublicIndividu ||
				this.information.listePublicIndividu.count() !==
					this.informationOriginal.listePublicIndividu.count();
			for (
				let i = 0;
				i < this.information.listePublicIndividu.count() &&
				!lTestListePublicIndividu;
				i++
			) {
				lElement = this.information.listePublicIndividu.get(i);
				lElementOriginal =
					this.informationOriginal.listePublicIndividu.getElementParNumeroEtGenre(
						lElement.getNumero(),
						lElement.getGenre(),
					);
				lTestListePublicIndividu = !(
					lElementOriginal && lElementOriginal.existeNumero()
				);
			}
		}
		return (
			lTestGenrePublic ||
			lTestListePublicIndividu ||
			lTestCocheAvecElevesRattaches ||
			lTestCocheAvecDirecteur
		);
	}
	_verifierEtatModification() {
		let lVerifSelonCtx = false;
		if (!this.estCasModele) {
			this.information.avecModificationPublic =
				this.creation || this._publicEstModifie();
			lVerifSelonCtx =
				this.information.publie !== this.informationOriginal.publie ||
				!ObjetDate_1.GDate.estJourEgal(
					this.information.dateDebut,
					this.informationOriginal.dateDebut,
				) ||
				!ObjetDate_1.GDate.estJourEgal(
					this.information.dateFin,
					this.informationOriginal.dateFin,
				) ||
				this.information.avecModificationPublic ||
				!!this.information.partageAEteModifie;
		}
		const lTest =
			lVerifSelonCtx ||
			this.information.getLibelle() !== this.informationOriginal.getLibelle() ||
			this.information.categorie.getNumero() !==
				this.informationOriginal.categorie.getNumero() ||
			this.information.listeQuestions.existeElementPourValidation();
		return lTest
			? Enumere_Etat_1.EGenreEtat.Modification
			: Enumere_Etat_1.EGenreEtat.Aucun;
	}
	_actualiserCategorie() {
		const lIndice = this.listeCategories.getIndiceParNumeroEtGenre(
			this.information.categorie.getNumero(),
			this.information.categorie.getGenre(),
		);
		this.getInstance(this.identCategorie).setDonnees(
			this.listeCategories,
			lIndice ? lIndice : 0,
		);
	}
	_actualiserQuestions(aParam) {
		if (aParam.estCasSondage) {
			this.getInstance(this.identQuestions).setDonnees(
				new DonneesListe_ActualitesQuestion_1.DonneesListe_ActualitesQuestion(
					this.information.listeQuestions,
					this._callbackSurMenuContextListeQuestions.bind(this),
					{ genreReponse: new GestionnaireBlocPN_3.UtilitaireGenreReponse() },
					{ avecEdition: true },
				),
				0,
			);
		} else {
			this.question =
				this.information.listeQuestions.getNbrElementsExistes() > 0
					? this.information.listeQuestions.getPremierElement()
					: UtilitaireInformations_1.TUtilitaireInformations.creerQuestionOuTexteSondage(
							{},
						);
			if (aParam.texteInfo) {
				this.question.texte = aParam.texteInfo;
			}
			this._actualiserAffichageQuestion();
			this._actualiserDonneesQuestion();
		}
	}
	_actualiserPublication(aParam) {
		this.getInstance(this.identPublication).setDonnees({
			publie: this.information.publie,
			dateDebut: this.information.dateDebut,
			dateFin: this.information.dateFin,
			listePeriodes: aParam.listePeriodes,
			estSondage: this.information.estSondage,
		});
	}
	_actualiserDestinataires(aParam) {
		this.getInstance(this.identDestinataires).setChoixResponsableParEntite(
			this.pourCarnetDeClasse,
		);
		this.getInstance(this.identDestinataires).setDonnees(
			this.information,
			aParam.donnees,
		);
	}
}
exports.ObjetFenetre_EditionActualite = ObjetFenetre_EditionActualite;
