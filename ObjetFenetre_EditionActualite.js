const { TypeDroits } = require("ObjetDroitsPN.js");
const {
	ObjetRequeteDonneesEditionInformation,
} = require("ObjetRequeteDonneesEditionInformation.js");
const { TinyInit } = require("TinyInit.js");
const {
	DonneesListe_ActualitesChoix,
} = require("DonneesListe_ActualitesChoix.js");
const {
	ObjetRequeteSaisieActualites,
} = require("ObjetRequeteSaisieActualites.js");
const { GUID } = require("GUID.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const {
	DonneesListe_ActualitesQuestion,
} = require("DonneesListe_ActualitesQuestion.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
	ObjetFenetre_SelectionRessource,
} = require("ObjetFenetre_SelectionRessource.js");
const { ObjetSelecteurPJ } = require("ObjetSelecteurPJ.js");
const {
	TypeGenreReponseInternetActualite,
} = require("TypeGenreReponseInternetActualite.js");
const { TypeHttpNotificationDonnes } = require("TypeHttpNotificationDonnes.js");
const { TUtilitaireInformations } = require("UtilitaireInformations.js");
const { ObjetPublication } = require("ObjetPublication.js");
const {
	ObjetDestinatairesActualite,
} = require("ObjetDestinatairesActualite.js");
const { UtilitaireGenreRessource } = require("GestionnaireBlocPN.js");
const { UtilitaireGenreEspace } = require("GestionnaireBlocPN.js");
const { UtilitaireGenreReponse } = require("GestionnaireBlocPN.js");
const { ObjetMoteurActus } = require("ObjetMoteurActus.js");
const { MoteurInfoSondage } = require("MoteurInfoSondage.js");
const { tag } = require("tag.js");
const { TypeNote } = require("TypeNote.js");
class ObjetFenetre_EditionActualite extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
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
			EditeurHTML: GUID.getId() + "_editeur",
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
		let lWidthTrad = GChaine.getLongueurChaineDansDiv(
			GTraductions.getValeur("actualites.Edition.ReponseASaisir"),
			10,
			true,
		);
		if (lWidthTrad > this.widthTrad) {
			this.widthTrad = lWidthTrad;
		}
		lWidthTrad = GChaine.getLongueurChaineDansDiv(
			GTraductions.getValeur("actualites.Edition.ChoixMultiple"),
			10,
			true,
		);
		if (lWidthTrad > this.widthTrad) {
			this.widthTrad = lWidthTrad;
		}
		lWidthTrad = GChaine.getLongueurChaineDansDiv(
			GTraductions.getValeur("actualites.Edition.ChoixUnique"),
			10,
			true,
		);
		if (lWidthTrad > this.widthTrad) {
			this.widthTrad = lWidthTrad;
		}
		this.tailleMaxTitre = 200;
		this.tailleMaxReponse = 500;
		this.avecPublicationPageEtablissement = GApplication.droits.get(
			TypeDroits.communication.avecPublicationPageEtablissement,
		);
		this.setUtilitaires({
			genreRessource: new UtilitaireGenreRessource(),
			genreEspace: new UtilitaireGenreEspace(),
			genreReponse: new UtilitaireGenreReponse(),
		});
	}
	setUtilitaires(aUtilitaires) {
		this.utilitaires = aUtilitaires;
		this.moteur = new ObjetMoteurActus(this.utilitaires);
		this.moteurInfoSond = new MoteurInfoSondage(this.utilitaires);
	}
	construireInstances() {
		this.identDestinataires = this.add(
			ObjetDestinatairesActualite,
			_evntDestinataires.bind(this),
			_initDestinataires.bind(this),
		);
		this.identCategorie = this.add(
			ObjetSaisie,
			_evntCategorie.bind(this),
			_initCategorie.bind(this),
		);
		this.identPJ = this.add(
			ObjetSelecteurPJ,
			_evenementPJ.bind(this),
			_initialiserPJ.bind(this),
		);
		this.identPublication = this.add(
			ObjetPublication,
			_evenementPublication.bind(this),
			null,
		);
		this.identQuestions = this.add(
			ObjetListe,
			_evenementQuestion.bind(this),
			_initialiserQuestion,
		);
		this.identChoix = this.add(
			ObjetListe,
			_evenementListeChoix.bind(this),
			_initialiserListeChoix,
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
				aParam.genreReponse === TypeGenreReponseInternetActualite.SansAR
			) {
				aParam.genreReponse = TypeGenreReponseInternetActualite.AvecAR;
			}
		}
		if (!this.estCasModele) {
			const lGenresRessourceAffDest =
				aParam && aParam.genresPublic
					? aParam.genresPublic
					: aParam.genrePublic && aParam.genrePublic !== EGenreRessource.Aucune
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
				).estGenreInGenresRessourceAffDestinataire(EGenreRessource.Eleve)
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
		new ObjetRequeteDonneesEditionInformation(
			this,
			_apresRequeteDonneesEditionInformation.bind(this, aParam),
		).lancerRequete(lParam);
	}
	appliquerModele(aParam) {
		const lModele = aParam.modele;
		this.information = TUtilitaireInformations.appliquerModeleSurExistant({
			modele: lModele,
			infoSond: this.information,
		});
		this.information.setEtat(_verifierEtatModification.call(this));
	}
	actualiserSurAppliquerModele() {
		const lEstUneInformation = _estUneInformation.call(this);
		GHtml.setValue(this.id.titre, this.information.getLibelle());
		_actualiserCategorie.call(this);
		this.question = undefined;
		_actualiserQuestions.call(this, { estCasSondage: !lEstUneInformation });
	}
	actualiserListeCloud() {
		if (GEtatUtilisateur.avecCloudDisponibles()) {
			GHtml.setHtml(
				this.id.listeCloud,
				UtilitaireUrl.construireListeUrls(this.question.listePiecesJointes, {
					genreFiltre: EGenreDocumentJoint.Cloud,
					separateur: " ",
					IEModelChips: "chipsFichierCloud",
				}),
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
						lElement.setEtat(EGenreEtat.Suppression);
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
					$(this.node).eventValidation(
						function () {
							this.moteur.getListeModeles({
								estCasSondage: this.information.estSondage,
								evntClbck: function (aParam) {
									this.appliquerModele({ modele: aParam.modele });
									this.actualiserSurAppliquerModele();
								}.bind(this),
								listeCategories: this.listeCategories,
							});
						}.bind(aInstance),
					);
				},
				getTitle: function () {
					return GTraductions.getValeur("actualites.recupererModele");
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
						: TypeGenreReponseInternetActualite.ChoixUnique;
					return aTypeNature === lTypeNatureActuel;
				},
				setValue(aTypeNature, aValeur) {
					if (aInstance.question && aValeur) {
						aInstance.question.genreReponse = aTypeNature;
						_initAffNature.call(aInstance);
						aInstance.question.setEtat(EGenreEtat.Modification);
						aInstance.information.setEtat(
							_verifierEtatModification.call(aInstance),
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
						aInstance.question.setEtat(EGenreEtat.Modification);
						aInstance.information.setEtat(
							_verifierEtatModification.call(aInstance),
						);
					}
				},
				getDisabled() {
					return (
						!aInstance.question ||
						aInstance.question.genreReponse !==
							TypeGenreReponseInternetActualite.ChoixMultiple
					);
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
					return new TypeNote(lValeur);
				},
				setNote(aValue) {
					if (aInstance.question && !aValue.estUneNoteVide()) {
						aInstance.question.tailleReponse = aValue.getValeur();
						aInstance.question.setEtat(EGenreEtat.Modification);
						aInstance.information.setEtat(
							_verifierEtatModification.call(aInstance),
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
							TypeGenreReponseInternetActualite.Textuelle
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
					return new TypeNote(lValeur);
				},
				setNote(aValue) {
					if (aInstance.question && !aValue.estUneNoteVide()) {
						aInstance.question.nombreReponsesMax = aValue.getValeur();
						aInstance.question.setEtat(EGenreEtat.Modification);
						aInstance.information.setEtat(
							_verifierEtatModification.call(aInstance),
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
						this.controleur.cbAvecLimiteNbChoixReponses.getDisabled() ||
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
								lReponseLibre.Etat = EGenreEtat.Aucun;
								lReponseLibre.rang =
									aInstance.question.listeChoix.getNbrElementsExistes();
								lReponseLibre.setEtat(EGenreEtat.Modification);
							} else {
								const lLibelleAutre = GTraductions.getValeur(
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
									lReponseLibre.setEtat(EGenreEtat.Modification);
								} else {
									lReponseLibre = new ObjetElement(lLibelleAutre);
									lReponseLibre.setEtat(EGenreEtat.Creation);
									aInstance.question.listeChoix.addElement(lReponseLibre);
								}
								lReponseLibre.estReponseLibre = true;
								lReponseLibre.rang =
									aInstance.question.listeChoix.getNbrElementsExistes();
							}
						} else {
							if (lReponseLibre) {
								lReponseLibre.setEtat(EGenreEtat.Suppression);
							}
						}
						aInstance.question.setEtat(EGenreEtat.Modification);
						aInstance.information.setEtat(
							_verifierEtatModification.call(aInstance),
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
						lReponseLibre.setEtat(EGenreEtat.Modification);
						aInstance.question.setEtat(EGenreEtat.Modification);
						aInstance.information.setEtat(
							_verifierEtatModification.call(aInstance),
						);
					}
				},
				exitChange(aValue) {
					let lReponseLibre = aInstance.getReponseReponseLibre(
						aInstance.question,
					);
					if (lReponseLibre && lReponseLibre.existe() && !aValue) {
						lReponseLibre.setLibelle(
							GTraductions.getValeur("actualites.Edition.ChoixAutre"),
						);
						lReponseLibre.setEtat(EGenreEtat.Modification);
						aInstance.question.setEtat(EGenreEtat.Modification);
						aInstance.information.setEtat(
							_verifierEtatModification.call(aInstance),
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
							TypeGenreReponseInternetActualite.AvecAR;
					}
					return lResult;
				},
				setValue(aChecked) {
					if (aInstance.question && aInstance.information) {
						aInstance.question.genreReponse = aChecked
							? TypeGenreReponseInternetActualite.AvecAR
							: TypeGenreReponseInternetActualite.SansAR;
						aInstance.question.setEtat(EGenreEtat.Modification);
						aInstance.information.setEtat(
							_verifierEtatModification.bind(aInstance)(),
						);
					}
				},
				getDisabled() {
					return _estUnSondage.call(aInstance);
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
							_actualiserAffichageApresChoixAnonyme.bind(aInstance)(false);
							break;
						case "anonyme":
							aInstance.information.reponseAnonyme = true;
							_actualiserAffichageApresChoixAnonyme.bind(aInstance)(true);
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
	getReponseAvecLibelle(aQuestion, aLibelleRecherche) {
		let lReponseAvecLibelle;
		if (
			aQuestion &&
			(aQuestion.genreReponse ===
				TypeGenreReponseInternetActualite.ChoixMultiple ||
				aQuestion.genreReponse ===
					TypeGenreReponseInternetActualite.ChoixUnique) &&
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
				TypeGenreReponseInternetActualite.ChoixMultiple ||
				aQuestion.genreReponse ===
					TypeGenreReponseInternetActualite.ChoixUnique) &&
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
			lIndividusSelectionnes = MethodesObjet.dupliquer(
				this.information.listeIndividusPartage,
			);
		} else {
			lIndividusSelectionnes = new ObjetListeElements();
		}
		const lFenetre = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SelectionRessource,
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
					const lTitreFenetre = [];
					lTitreFenetre.push(GTraductions.getValeur("actualites.Professeurs"));
					lTitreFenetre.push(GTraductions.getValeur("actualites.Personnels"));
					aInstance.setOptionsFenetre({ titre: lTitreFenetre.join(" / ") });
				},
			},
		);
		lFenetre.setOptionsFenetreSelectionRessource({ autoriseEltAucun: true });
		lFenetre.setDonnees({
			listeRessources: this.listeIndividusPossiblesPartage,
			listeRessourcesSelectionnees: lIndividusSelectionnes,
			genreRessource: EGenreRessource.Personnel,
		});
	}
	surValidation(aGenreBouton) {
		if (aGenreBouton === 1) {
			if (this.question && GHtml.getDisplay(this.id.message)) {
				const lEditor = TinyInit.get(this.id.EditeurHTML);
				const lContent = lEditor.getContent();
				this.question.texte = lContent;
				this.question.setEtat(EGenreEtat.Modification);
				if (TinyInit.estContenuVide(this.question.texte)) {
					GApplication.getMessage().afficher({
						type: EGenreBoiteMessage.Information,
						message: GTraductions.getValeur("actualites.MsgAucunContenu"),
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
					).estGenreInGenresRessourceAffDestinataire(EGenreRessource.Eleve) &&
					this.information.listePublicIndividu.count() > 0
				) {
					for (
						let i = 0;
						i < this.information.listePublicIndividu.count() &&
						!lIlYADesIndividusSelectionne;
						i++
					) {
						const lIndividu = this.information.listePublicIndividu.get(i);
						if (lIndividu.Genre !== EGenreRessource.Eleve) {
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
				if (GEtatUtilisateur.pourPrimaire()) {
					if (lNbPublicEntite === 0 && !lIlYADesIndividusSelectionne) {
						lMessagePbDestinataires = GTraductions.getValeur(
							"actualites.MsgAucunUnDestinataire",
						);
					}
				} else {
					if (lNbGenreEntite > 0 && lNbPublicEntite === 0) {
						lMessagePbDestinataires = GTraductions.getValeur(
							"actualites.MsgSelectionnerUneClasseGroupe",
						);
					} else if (lNbGenreEntite === 0 && lNbPublicEntite > 0) {
						lMessagePbDestinataires = GTraductions.getValeur(
							"actualites.MsgSelectionnerUneEntite",
						);
					} else if (lNbPublicEntite === 0 && !lIlYADesIndividusSelectionne) {
						lMessagePbDestinataires = GTraductions.getValeur(
							"actualites.MsgAucunUnDestinataire",
						);
					}
				}
				if (!!lMessagePbDestinataires) {
					GApplication.getMessage().afficher({
						type: EGenreBoiteMessage.Information,
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
							TypeGenreReponseInternetActualite.SansReponse
						) {
							lTestPossedeAuMoinsUneQuestion = true;
						}
						if (TinyInit.estContenuVide(aQuestion.texte)) {
							lListeQuestionsVides.push(aQuestion);
						}
					}
				});
				if (!lTestPossedeAuMoinsUneQuestion || lTestAucuneQuestion) {
					GApplication.getMessage().afficher({
						type: EGenreBoiteMessage.Information,
						message: GTraductions.getValeur("actualites.MsgAucuneQuestion"),
					});
					return;
				}
				if (lListeQuestionsVides.length > 0) {
					GApplication.getMessage().afficher({
						type: EGenreBoiteMessage.Information,
						message:
							lListeQuestionsVides[0].genreReponse !==
							TypeGenreReponseInternetActualite.SansReponse
								? GTraductions.getValeur("actualites.saisirContenuQuestionN", [
										lListeQuestionsVides[0].indice,
									])
								: GTraductions.getValeur("actualites.saisirContenuTexteN", [
										lListeQuestionsVides[0].indice,
									]),
					});
					return;
				}
				this.information.setEtat(_verifierEtatModification.bind(this)());
			}
		}
		if (aGenreBouton === 1) {
			_validationAuto.bind(this)(aGenreBouton);
		} else {
			_finSurValidation.bind(this)(aGenreBouton);
		}
	}
	getGenresRessourceAffDestinataire() {
		return this.getInstance(
			this.identDestinataires,
		).getGenresRessourceAffDestinataire();
	}
	composeContenu() {
		const T = [];
		const lHeightDest = _getHeightDestinataires.call(this);
		T.push('<div class="flex-contain cols full-height flex-gap">');
		T.push(
			'<div id="',
			this.getInstance(this.identDestinataires).getNom(),
			'" style="',
			GStyle.composeHeight(lHeightDest),
			'"></div>',
		);
		T.push('<div id="', this.id.message, '" class="m-top-l">');
		T.push(_composeRecupModele.call(this));
		T.push(
			'<div id="',
			this.id.choixReponseAnonyme,
			'">',
			_composeReponseAnonyme.call(this),
			"</div>",
		);
		T.push(_composeTitre.bind(this)());
		T.push(
			'<div class="flex-contain fluid-bloc m-bottom">',
			`<div class="fix-bloc m-right-l" id="${this.getInstance(this.identQuestions).getNom()}"></div>`,
			'<div class="fluid-bloc flex-contain cols">',
			`<div id="content_${this.id.message}"></div>`,
			'<div class="flex-contain">',
			`<div class="fix-bloc flex-contain cols">${_composePJ.bind(this)()}</div>`,
			'<div class="fluid-bloc flex-contain cols justify-between">',
			_composeTinyMessage.bind(this)(),
			"</div>",
			"</div>",
			_composeNatureReponse.bind(this)(),
			_composeListePJ.bind(this)(),
			"</div>",
			"</div>",
		);
		T.push("</div>");
		T.push(
			`<div id="${this.id.message}_bis" class="fluid-bloc flex-contain p-all-xl" style="display: none;">`,
			this.composeMessage(
				GTraductions.getValeur("actualites.Edition.NonModifiable"),
			),
			"</div>",
		);
		T.push(_composeAccuseReception.bind(this)());
		T.push('<div class="general-conteneur fond-gris m-top-l cols">');
		T.push(
			`<div id="${this.id.partage}" class="flex-contain flex-center p-top-l p-bottom-l">`,
			'<i class="icon_eye_open i-medium i-as-deco m-right"></i>',
			`<label id="${this.id.labelBtnChoixIndividusPartage}">${GTraductions.getValeur("actualites.Edition.DonnerAccesConsultationAuSondage")}</label>`,
			`<ie-bouton ie-model="boutonChoixIndividusPartage" class="m-left" aria-labelledby="${this.id.labelBtnChoixIndividusPartage}" aria-describedby="${this.id.nbIndividusPartage}">...</ie-bouton>`,
			`<span id="${this.id.nbIndividusPartage}" ie-html="getHtmlNbIndividusPartage" ie-hint="getHintIndividusPartage" class="m-left"></span>`,
			"</div>",
		);
		T.push(
			`<div id="${this.id.publication}" class="p-top-l p-bottom-l">`,
			`<div id="${this.getInstance(this.identPublication).getNom()}"></div>`,
			"</div>",
		);
		if (this.avecPublicationPageEtablissement) {
			T.push(
				tag(
					"ie-checkbox",
					{
						"ie-model": "cbPublicationPageEtablissement",
						"ie-display": "pourPageEtablissement",
						class: ["p-top-l", "p-bottom-l"],
					},
					GTraductions.getValeur(
						"actualites.Edition.publicationPageEtablissement",
					),
				),
			);
		}
		T.push("</div>");
		T.push("</div>");
		return T.join("");
	}
	surSaisieTitre(aValeur) {
		this.information.setLibelle(aValeur);
		this.information.setEtat(_verifierEtatModification.bind(this)());
	}
	controlerSurValidation() {
		if (!!this.question && this.tinySet) {
			const lEditor = TinyInit.get(this.id.EditeurHTML);
			const lContent = lEditor.getContent();
			this.question.texte = lContent;
			this.question.setEtat(EGenreEtat.Modification);
			if (TinyInit.estContenuVide(this.question.texte)) {
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Information,
					message: GTraductions.getValeur("actualites.MsgAucunContenu"),
				});
				return false;
			}
		}
		return true;
	}
}
function _estUneInformation() {
	return !!this.information && !!this.information.estInformation;
}
function _estUnSondage() {
	return !_estUneInformation.call(this);
}
function _evntCategorie(aParams) {
	if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
		this.information.categorie = aParams.element;
		this.information.setEtat(_verifierEtatModification.bind(this)());
	}
}
function _evntDestinataires() {
	this.information.setEtat(_verifierEtatModification.bind(this)());
}
function _evenementPJ() {
	this.question.setEtat(EGenreEtat.Modification);
	this.information.setEtat(_verifierEtatModification.bind(this)());
}
function _evenementPublication(aResult) {
	this.information.publie = aResult.publie;
	if (!this.information.publie) {
		this.information.publicationPageEtablissement = false;
	}
	this.information.dateDebut = aResult.dateDebut;
	this.information.dateFin = aResult.dateFin;
	this.information.setEtat(_verifierEtatModification.bind(this)());
	_actualiserLibelleBtnValider.call(this);
}
function _actualiserLibelleBtnValider() {
	if (this.creation && !this.information.estModele) {
		const lStr = this.information.publie
			? GTraductions.getValeur("infoSond.publier")
			: GTraductions.getValeur("infoSond.creerBrouillon");
		this.setBoutonLibelle(1, lStr);
	}
}
function _evenementQuestion(aParametres) {
	let lIndice, lContent;
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.Selection: {
			const lQuestion = this.information.listeQuestions.get(aParametres.ligne);
			if (
				!!this.question &&
				lQuestion.getNumero() === this.question.getNumero() &&
				lQuestion.getLibelle() === this.question.getLibelle()
			) {
				return;
			}
			if (this.tinySet && !!this.question) {
				const lEditor = TinyInit.get(this.id.EditeurHTML);
				lContent = lEditor.getContent();
				this.question.texte = lContent;
				this.question.setEtat(EGenreEtat.Modification);
				if (
					TinyInit.estContenuVide(this.question.texte) &&
					this.question.getEtat() !== EGenreEtat.Suppression
				) {
					GApplication.getMessage().afficher({
						type: EGenreBoiteMessage.Information,
						message: GTraductions.getValeur("actualites.MsgAucunContenu"),
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
			_actualiserAffichageQuestion.call(this);
			_actualiserDonneesQuestion.call(this);
			break;
		}
		case EGenreEvenementListe.ApresSuppression: {
			let lNbr = this.information.listeQuestions.count() + 1;
			let lRang = 1;
			this.information.listeQuestions.setTri([ObjetTri.init("rang")]);
			this.information.listeQuestions.trier();
			let lIndiceT = 1,
				lIndiceQ = 1;
			this.information.listeQuestions.parcourir((aElement) => {
				if (aElement.existe()) {
					if (aElement.rang !== lRang) {
						aElement.rang = lRang;
						aElement.setEtat(EGenreEtat.Modification);
					}
					lRang++;
					if (
						aElement.genreReponse ===
						TypeGenreReponseInternetActualite.SansReponse
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
				_actualiserAffichageQuestion.call(this);
				_actualiserDonneesQuestion.call(this);
			}
			break;
		}
		case EGenreEvenementListe.Creation:
			if (this.tinySet && !!this.question) {
				const lEditor = TinyInit.get(this.id.EditeurHTML);
				lContent = lEditor.getContent();
				this.question.texte = lContent;
				this.question.setEtat(EGenreEtat.Modification);
				if (TinyInit.estContenuVide(this.question.texte)) {
					GApplication.getMessage().afficher({
						type: EGenreBoiteMessage.Information,
						message: GTraductions.getValeur("actualites.MsgAucunContenu"),
					});
					return EGenreEvenementListe.Creation;
				}
			}
			ObjetMenuContextuel.afficher({
				pere: this,
				initCommandes: function (aInstanceMenu) {
					aInstanceMenu.add(
						GTraductions.getValeur("actualites.Edition.Question"),
						true,
						function () {
							creerNouvelleQuestionOuTexte.call(this, false);
						},
					);
					aInstanceMenu.add(
						GTraductions.getValeur("actualites.Edition.Texte"),
						true,
						function () {
							creerNouvelleQuestionOuTexte.call(this, true);
						},
					);
				},
			});
			return EGenreEvenementListe.Creation;
		default:
			break;
	}
}
function creerNouvelleQuestionOuTexte(aEstUnTexte) {
	const lListe = this.information.listeQuestions.getListeElements(
		(aElement) => {
			return (
				aElement.existe() &&
				((aEstUnTexte &&
					aElement.genreReponse ===
						TypeGenreReponseInternetActualite.SansReponse) ||
					(!aEstUnTexte &&
						aElement.genreReponse !==
							TypeGenreReponseInternetActualite.SansReponse))
			);
		},
	);
	const lParamsCreationQuestion = {
		rang: this.information.listeQuestions.getNbrElementsExistes() + 1,
		rangElement: lListe.getNbrElementsExistes() + 1,
		genreReponse: aEstUnTexte
			? TypeGenreReponseInternetActualite.SansReponse
			: TypeGenreReponseInternetActualite.ChoixUnique,
	};
	const lElement = TUtilitaireInformations.creerQuestionOuTexteSondage(
		lParamsCreationQuestion,
	);
	this.information.listeQuestions.addElement(lElement);
	lElement.setEtat(EGenreEtat.Creation);
	this.information.setEtat(EGenreEtat.Modification);
	this.getInstance(this.identQuestions).actualiser();
	const lIndice = this.information.listeQuestions.getIndiceParElement(lElement);
	if (lIndice !== null) {
		this.getInstance(this.identQuestions).selectionnerLigne({
			ligne: lIndice,
			avecEvenement: true,
		});
	}
}
function _evenementListeChoix(aParametres) {
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.ApresCreation:
		case EGenreEvenementListe.ApresEdition:
		case EGenreEvenementListe.ApresSuppression:
			this.choixVide = false;
			break;
		case EGenreEvenementListe.Creation:
			GApplication.getMessage().afficher({
				type: EGenreBoiteMessage.Information,
				message: GTraductions.getValeur("actualites.MaxNombreChoix"),
			});
			break;
		default:
			break;
	}
}
function _callbackSurMenuContextListeQuestions(aGenreActionMenu, aIndiceLigne) {
	switch (aGenreActionMenu) {
		case DonneesListe_ActualitesQuestion.genreAction.monter:
		case DonneesListe_ActualitesQuestion.genreAction.descendre:
			this.getInstance(this.identQuestions).actualiser(aIndiceLigne === -1);
			if (aIndiceLigne > -1) {
				this.getInstance(this.identQuestions).selectionnerLigne({
					ligne: aIndiceLigne,
					avecEvenement: true,
				});
			}
			break;
		case DonneesListe_ActualitesQuestion.genreAction.dupliquer:
			return this.controlerSurValidation();
	}
}
function _callbackSurMenuContextListeChoix(aGenreActionMenu, aIndiceLigne) {
	switch (aGenreActionMenu) {
		case DonneesListe_ActualitesChoix.genreAction.monter:
		case DonneesListe_ActualitesChoix.genreAction.descendre:
			if (aIndiceLigne > -1) {
				this.getInstance(this.identChoix).selectionnerLigne({
					ligne: aIndiceLigne,
					avecEvenement: true,
				});
			}
			break;
	}
}
function _initCategorie(aInstance) {
	aInstance.setOptionsObjetSaisie({
		longueur: 150,
		labelWAICellule: GTraductions.getValeur("actualites.Categorie"),
	});
}
function _initDestinataires(aInstance) {
	aInstance.setOptions({
		largeur: this.optionsFenetre.largeur,
		avecCallbckSurModification: true,
	});
}
function _initialiserPJ(aInstance) {
	aInstance.setOptions({
		genrePJ: EGenreDocumentJoint.Fichier,
		genreRessourcePJ: EGenreRessource.DocJointEtablissement,
		avecMenuContextuel: false,
		maxFiles: 0,
		maxSize: GApplication.droits.get(TypeDroits.tailleMaxDocJointEtablissement),
		ouvrirFenetreChoixTypesAjout: true,
		optionsCloud: {
			avecCloud: true,
			callbackChoixFichierParFichier: surAjoutUnFichierCloud.bind(this),
			callbackChoixFichierFinal: surAjoutFinalFichiersClouds.bind(this),
		},
		avecAjoutExistante: true,
		avecBoutonSupp: true,
		fenetrePieceJointe: { avecBoutonActualiser: false },
		avecEtatSaisie: this.avecEtatSaisie,
		title: GTraductions.getValeur("actualites.Edition.ModifPJ"),
	});
}
function surAjoutUnFichierCloud(aNewElement) {
	this.question.listePiecesJointes.addElement(aNewElement);
	this.listePJ.addElement(aNewElement);
}
function surAjoutFinalFichiersClouds() {
	this.actualiserListeCloud();
	this.information.setEtat(EGenreEtat.Modification);
	if (this.avecEtatSaisie) {
		this.setEtatSaisie(true);
	}
}
function _initialiserQuestion(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_ActualitesQuestion.colonnes.libelle,
		taille: 140,
	});
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		titreCreation: GTraductions.getValeur("actualites.question.nouveau"),
		avecLigneCreation: true,
		boutons: [
			{ genre: ObjetListe.typeBouton.monter },
			{ genre: ObjetListe.typeBouton.descendre },
			{ genre: ObjetListe.typeBouton.supprimer },
		],
	});
}
function _initialiserListeChoix(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_ActualitesChoix.colonnes.libelle,
		taille: "100%",
	});
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		titreCreation: GTraductions.getValeur("actualites.choix.nouveau"),
		listeCreations: 0,
		avecLigneCreation: true,
		avecCreationEnBoutonDesignClassique: true,
		boutons: [
			{ genre: ObjetListe.typeBouton.monter },
			{ genre: ObjetListe.typeBouton.descendre },
			{ genre: ObjetListe.typeBouton.supprimer },
		],
	});
}
function _initTiny(aEstUneInformation, aReset) {
	const lEditor = TinyInit.get(this.id.EditeurHTML);
	if (this.id.EditeurHTML && !lEditor) {
		const lHeight =
			this.height.zoneMessage - 80 - (aEstUneInformation ? 0 : 83);
		TinyInit.init({
			id: this.id.EditeurHTML,
			min_height: lHeight,
			max_height: lHeight,
		}).then(
			() => {
				_initTiny.call(this, aEstUneInformation, aReset);
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
function _apresRequeteDonneesEditionInformation(aParam, aDonnees) {
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
			const lListeIndividusPossiblesPartage = new ObjetListeElements();
			const lHashParents = {};
			aDonnees.listeIndividusPossiblesPartage.parcourir((aElement) => {
				const lGenre = aElement.getGenre();
				if (!lHashParents[lGenre]) {
					const lParent = new ObjetElement(
						lGenre === EGenreRessource.Personnel
							? GTraductions.getValeur("Messagerie.Personnels")
							: GTraductions.getValeur("Messagerie.Profs"),
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
	const lListePeriodes = TUtilitaireInformations.initListePeriodes.bind(this)();
	this.listePJ = MethodesObjet.dupliquer(
		GEtatUtilisateur.listeDonnees[
			TypeHttpNotificationDonnes.THND_ListeDocJointEtablissement
		],
	);
	if (aDonnees.equipe) {
		this.listePartiel = aDonnees.equipe;
	} else {
		this.listePartiel = undefined;
	}
	this.tinySet = false;
	const lNewInformation = TUtilitaireInformations.initialiserNouveauItem.call(
		this,
		{
			categorie: this.listeCategories.get(this.indiceCategorieParDefaut),
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
		},
	);
	this.informationOriginal = aParam.donnee || lNewInformation;
	if (aDonnees.titre) {
		this.informationOriginal.setLibelle(aDonnees.titre);
	}
	this.information = MethodesObjet.dupliquer(this.informationOriginal);
	this.information.avecEleve = false;
	this.information.avecResp1 = false;
	this.information.avecResp2 = false;
	this.information.avecProfsPrincipaux = false;
	this.information.avecTuteurs = false;
	if (aParam.listePublicDeListeDiffusion) {
		this.information.listePublicIndividu = MethodesObjet.dupliquer(
			aParam.listePublicDeListeDiffusion,
		);
	}
	if (aParam.appliquerModele !== null && aParam.appliquerModele !== undefined) {
		this.appliquerModele({ modele: aParam.appliquerModele });
	}
	GHtml.setValue(this.id.titre, this.information.getLibelle());
	const lEstUneInformation = _estUneInformation.call(this);
	let lHeightDest;
	if (!this.information.estVerrouille) {
		lHeightDest = _getHeightDestinataires.call(this);
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
		GHtml.setDisplay(this.id.message + "_bis", false);
		GHtml.setDisplay(this.id.message, true);
		$(
			"#" + this.getInstance(this.identDestinataires).getNom().escapeJQ(),
		).height(lHeightDest);
	} else {
		GHtml.setDisplay(this.id.message, false);
		GHtml.setDisplay(this.id.message + "_bis", true);
	}
	_actualiserCategorie.call(this);
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
	_actualiserQuestions.call(this, {
		estCasSondage: !lEstUneInformation,
		texteInfo: aDonnees.texte,
	});
	if (!this.estCasModele) {
		_actualiserPublication.call(this, { listePeriodes: lListePeriodes });
		_actualiserDestinataires.call(this, { donnees: aDonnees });
	} else {
		$("#" + this.id.publication.escapeJQ()).hide();
		$("#" + this.id.partage.escapeJQ()).hide();
		$(
			"#" + this.getInstance(this.identDestinataires).getNom().escapeJQ(),
		).hide();
	}
	_actualiserLibelleBtnValider.call(this);
}
function _actualiserAffichageQuestion() {
	this.choixVide = !this.question || this.question.listeChoix.count() === 0;
	if (!!this.question) {
		$("#" + "content_" + this.id.message.escapeJQ()).show();
	} else {
		$("#" + "content_" + this.id.message.escapeJQ()).hide();
	}
	if (!this.information.estVerrouille) {
		_initTiny.call(this, _estUneInformation.call(this), this.tinySet);
	}
	if (!!this.question) {
		if (
			this.question.genreReponse ===
			TypeGenreReponseInternetActualite.SansReponse
		) {
			$("#" + this.id.natureReponse.escapeJQ()).hide();
			$("#" + this.id.conteneurListeChoixReponses.escapeJQ()).hide();
		} else {
			if (!this.information.estInformation) {
				$("#" + this.id.natureReponse.escapeJQ()).show();
			}
			if (
				this.question.genreReponse ===
					TypeGenreReponseInternetActualite.ChoixMultiple ||
				this.question.genreReponse ===
					TypeGenreReponseInternetActualite.ChoixUnique
			) {
				$("#" + this.id.conteneurListeChoixReponses.escapeJQ()).show();
				_initListeChoix.bind(this)();
				this.getInstance(this.identChoix).setDonnees(
					new DonneesListe_ActualitesChoix(
						this.question.listeChoix,
						_callbackSurMenuContextListeChoix.bind(this),
						true,
					),
				);
			} else {
				$("#" + this.id.conteneurListeChoixReponses.escapeJQ()).hide();
			}
		}
	}
}
function _actualiserDonneesQuestion() {
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
		_actualiserAffichageApresChoixAnonyme.call(
			this,
			this.information.reponseAnonyme,
		);
	}
	this.actualiserListeCloud();
}
function _validationAuto(aGenreBouton) {
	if (this.information && this.information.getEtat() !== EGenreEtat.Aucun) {
		this.information.setEtat(EGenreEtat.Modification);
		const lListeActualites = new ObjetListeElements();
		lListeActualites.addElement(this.information);
		const lGenresRessAffDestinataire = this.getGenresRessourceAffDestinataire();
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
		new ObjetRequeteSaisieActualites(this, _reponseSaisie.bind(this, 1))
			.addUpload({ listeFichiers: this.listePJ, listeDJCloud: this.listePJ })
			.lancerRequete(lObjetSaisie);
	} else {
		_finSurValidation.call(this, aGenreBouton);
	}
}
function _reponseSaisie(aGenreBouton, aJSONReponse, aJSONRapportSaisie) {
	if (this.avecEtatSaisie) {
		this.setEtatSaisie(false);
	}
	_finSurValidation.bind(this)(aGenreBouton, aJSONRapportSaisie);
}
function _finSurValidation(aGenreBouton, aJSONRapportSaisie) {
	if (this.id.EditeurHTML && GHtml.getDisplay(this.id.message)) {
		const lEditor = TinyInit.get(this.id.EditeurHTML);
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
function _composeRecupModele() {
	const T = [];
	T.push(
		'<div id="',
		this.id.recupModele,
		'" class="m-bottom-l m-left-big m-top-l">',
	);
	T.push(
		'<ie-bouton ie-icon="icon_sondage_bibliotheque" ie-node="btnRecupModele.getNode" ie-title="btnRecupModele.getTitle" class="themeBoutonNeutre">',
		GTraductions.getValeur("actualites.recupererModele"),
		"</ie-bouton>",
	);
	T.push("</div>");
	return T.join("");
}
function _composeTitre() {
	const T = [];
	T.push(
		`<div class="flex-contain flex-center justify-between m-bottom-xl">\n            <label for="${this.id.titre}" class="ie-titre-petit semi-bold fix-bloc m-right">${GTraductions.getValeur("actualites.Colonnes.Titre")} : </label>\n             <input class="round-style fluid-bloc m-right" name="titre" maxlength=${this.tailleMaxTitre}" id="${this.id.titre}" onkeyup="${this.Nom}.surSaisieTitre (value)" onchange="${this.Nom}.surSaisieTitre (value)" />\n             <div class="Gras fix-bloc" id="${this.getInstance(this.identCategorie).getNom()}"></div>\n          </div>`,
	);
	return T.join("");
}
function _composePJ() {
	const T = [];
	T.push(
		'<div class="pj-global-conteneur" id="',
		this.getInstance(this.identPJ).getNom(),
		'"></div>',
	);
	return T.join("");
}
function _composeTinyMessage() {
	let lHeightARetirer = 0;
	if (_estUnSondage.call(this)) {
		lHeightARetirer = 83;
	}
	const T = [];
	T.push(
		'<div class="round-style" id="',
		this.id.EditeurHTML,
		'" style="width:100%;',
		GStyle.composeHeight(this.height.zoneMessage - 80 - lHeightARetirer),
		'"></div>',
	);
	return T.join("");
}
function _composeListePJ() {
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
function _composeNatureReponse() {
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
		TypeGenreReponseInternetActualite.Textuelle,
		')">',
		GTraductions.getValeur("actualites.Edition.ReponseASaisir"),
		"</ie-radio>",
		'<ie-inputnote id ="',
		this.id.tailleTexte,
		'" ie-model="inputTailleTexteMax" style="width: 3.5rem;" class="round-style m-left m-right"></ie-inputnote>',
		'<label for="',
		this.id.tailleTexte,
		'">',
		GTraductions.getValeur("actualites.Edition.NbrCharTexte"),
		"</label>",
		"</div>",
	);
	T.push(
		"<div>",
		'<ie-radio ie-model="radioNatureReponse(',
		TypeGenreReponseInternetActualite.ChoixUnique,
		')">',
		GTraductions.getValeur("actualites.Edition.ChoixUnique"),
		"</ie-radio>",
		"</div>",
	);
	T.push(
		'<div class="flex-contain flex-center">',
		'<ie-radio ie-model="radioNatureReponse(',
		TypeGenreReponseInternetActualite.ChoixMultiple,
		')">',
		GTraductions.getValeur("actualites.Edition.ChoixMultiple"),
		"</ie-radio>",
		'<ie-checkbox ie-model="cbAvecLimiteNbChoixReponses" class="m-left"><span id="',
		this.id.nbrChoix,
		'">',
		GTraductions.getValeur("actualites.Edition.NbrChoix"),
		"</span></ie-checkbox>",
		'<ie-inputnote aria-labelledby="',
		this.id.nbrChoix,
		'" ie-model="inputNbMaximalesReponses" style="width: 2.5rem;" class="round-style m-left"></ie-inputnote>',
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
		GTraductions.getValeur("actualites.Edition.AvecChoixAutre"),
		"</span></ie-checkbox>",
		'<input aria-labelledby="',
		this.id.reponseAutre,
		'" class="round-style m-left m-top-s m-bottom-s" ie-model="labelReponseAutre" maxlength="200"></input>',
		"</div>",
		'<div style="',
		GStyle.composeHeight(110),
		'" id="',
		this.getInstance(this.identChoix).getNom(),
		'">',
		"</div>",
		"</div>",
	);
	T.push("</div>");
	return T.join("");
}
function _composeAccuseReception() {
	const T = [];
	T.push(
		'<div id="',
		this.id.accuseReception,
		'" class="general-conteneur m-top p-top-l p-bottom-l flex-center">',
		'<ie-checkbox ie-model="cbAR">',
		GTraductions.getValeur("actualites.Edition.AvecAR"),
		"</ie-checkbox>",
		"</div>",
	);
	return T.join("");
}
function _composeReponseAnonyme() {
	const T = [];
	T.push(
		'<div class="flex-contain flex-center m-top-l m-bottom-l m-left-big">',
		'<div class="flex-contain flex-center fix-bloc m-right-l m-left-l">',
		"<ie-radio ie-model=\"surSaisieAnonyme('nominatif')\">",
		GTraductions.getValeur("actualites.Nominatif"),
		"</ie-radio>",
		"</div>",
		'<div class="flex-contain flex-center fix-bloc m-right-l">',
		"<ie-radio ie-model=\"surSaisieAnonyme('anonyme')\">",
		GTraductions.getValeur("actualites.Anonyme"),
		"</ie-radio>",
		"</div>",
		"</div>",
	);
	return T.join("");
}
function _getHeightDestinataires() {
	return (
		this.getInstance(this.identDestinataires).getHeightZoneDestinataires() + 10
	);
}
function _actualiserAffichageApresChoixAnonyme() {
	this.getInstance(this.identDestinataires).actualiserTabs({
		avecIndividuelInvisible: false,
		conserverSelection: true,
	});
}
function _initAffNature() {
	if (
		this.question.genreReponse ===
			TypeGenreReponseInternetActualite.ChoixMultiple ||
		this.question.genreReponse === TypeGenreReponseInternetActualite.ChoixUnique
	) {
		$("#" + this.id.conteneurListeChoixReponses.escapeJQ()).show();
		_initListeChoix.bind(this)();
		this.getInstance(this.identChoix).setDonnees(
			new DonneesListe_ActualitesChoix(
				this.question.listeChoix,
				_callbackSurMenuContextListeChoix.bind(this),
				true,
			),
		);
	} else {
		$("#" + this.id.conteneurListeChoixReponses.escapeJQ()).hide();
	}
}
function _reinitChoixUnique(aQuestion) {
	let lNewChoix = new ObjetElement(GTraductions.getValeur("actualites.Oui"));
	lNewChoix.rang = 1;
	lNewChoix.setEtat(EGenreEtat.Creation);
	aQuestion.listeChoix.addElement(lNewChoix);
	lNewChoix = new ObjetElement(GTraductions.getValeur("actualites.Non"));
	lNewChoix.rang = 2;
	lNewChoix.setEtat(EGenreEtat.Creation);
	aQuestion.listeChoix.addElement(lNewChoix);
}
function _initListeChoix() {
	if (
		this.question.genreReponse ===
			TypeGenreReponseInternetActualite.ChoixUnique &&
		this.question.listeChoix.count() === 0
	) {
		_reinitChoixUnique.call(this, this.question);
	}
	if (
		this.choixVide &&
		this.question.genreReponse ===
			TypeGenreReponseInternetActualite.ChoixMultiple
	) {
		this.question.listeChoix = new ObjetListeElements();
	}
}
function _publicEstModifie() {
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
			lTestGenrePublic = !(lElementOriginal && lElementOriginal.existeNumero());
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
function _verifierEtatModification() {
	let lVerifSelonCtx = false;
	if (!this.estCasModele) {
		this.information.avecModificationPublic =
			this.creation || _publicEstModifie.bind(this)();
		lVerifSelonCtx =
			this.information.publie !== this.informationOriginal.publie ||
			!GDate.estJourEgal(
				this.information.dateDebut,
				this.informationOriginal.dateDebut,
			) ||
			!GDate.estJourEgal(
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
	return lTest ? EGenreEtat.Modification : EGenreEtat.Aucun;
}
function _actualiserCategorie() {
	const lIndice = this.listeCategories.getIndiceParNumeroEtGenre(
		this.information.categorie.getNumero(),
		this.information.categorie.getGenre(),
	);
	this.getInstance(this.identCategorie).setDonnees(
		this.listeCategories,
		lIndice ? lIndice : 0,
	);
}
function _actualiserQuestions(aParam) {
	if (aParam.estCasSondage) {
		this.getInstance(this.identQuestions).setDonnees(
			new DonneesListe_ActualitesQuestion(
				this.information.listeQuestions,
				_callbackSurMenuContextListeQuestions.bind(this),
				{ genreReponse: new UtilitaireGenreReponse() },
				{ avecEdition: true },
			),
			0,
		);
	} else {
		this.question =
			this.information.listeQuestions.getNbrElementsExistes() > 0
				? this.information.listeQuestions.getPremierElement()
				: TUtilitaireInformations.creerQuestionOuTexteSondage();
		if (aParam.texteInfo) {
			this.question.texte = aParam.texteInfo;
		}
		_actualiserAffichageQuestion.call(this);
		_actualiserDonneesQuestion.call(this);
	}
}
function _actualiserPublication(aParam) {
	this.getInstance(this.identPublication).setDonnees({
		publie: this.information.publie,
		dateDebut: this.information.dateDebut,
		dateFin: this.information.dateFin,
		listePeriodes: aParam.listePeriodes,
		estSondage: this.information.estSondage,
	});
}
function _actualiserDestinataires(aParam) {
	this.getInstance(this.identDestinataires).setChoixResponsableParEntite(
		this.pourCarnetDeClasse,
	);
	this.getInstance(this.identDestinataires).setDonnees(
		this.information,
		aParam.donnees,
	);
}
module.exports = { ObjetFenetre_EditionActualite };
