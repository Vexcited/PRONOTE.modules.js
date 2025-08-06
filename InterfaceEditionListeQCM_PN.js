exports.InterfaceEditionListeQCM_PN = void 0;
const InterfaceEditionListeQCM_1 = require("InterfaceEditionListeQCM");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const ObjetFenetre_QCMPourCDT_1 = require("ObjetFenetre_QCMPourCDT");
const ObjetRequeteSaisieCopieQCM_1 = require("ObjetRequeteSaisieCopieQCM");
const ObjetRequeteSaisieQCMPourCDT_1 = require("ObjetRequeteSaisieQCMPourCDT");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDate_1 = require("ObjetDate");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeNote_1 = require("TypeNote");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetFenetre_Activite_1 = require("ObjetFenetre_Activite");
const ObjetRequeteListeQCMCumuls_1 = require("ObjetRequeteListeQCMCumuls");
const ObjetFenetre_DevoirPN_1 = require("ObjetFenetre_DevoirPN");
const ObjetFenetre_EvaluationQCM_1 = require("ObjetFenetre_EvaluationQCM");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetRequeteSaisieQCMEvaluation_1 = require("ObjetRequeteSaisieQCMEvaluation");
const ObjetUtilitaireEvaluation_1 = require("ObjetUtilitaireEvaluation");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const UtilitairePartenaire_1 = require("UtilitairePartenaire");
const ObjetRequeteAccesSecurisePageProfil_1 = require("ObjetRequeteAccesSecurisePageProfil");
const TypeGenreTravailAFaire_1 = require("TypeGenreTravailAFaire");
const UtilitaireActiviteTAFPP_1 = require("UtilitaireActiviteTAFPP");
const ObjetFenetre_EditionQCM_PN_1 = require("ObjetFenetre_EditionQCM_PN");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_Activites_Tvx_1 = require("Enumere_Activites_Tvx");
const ObjetUtilitaireDevoir_1 = require("ObjetUtilitaireDevoir");
const ObjetRequeteResultatsQCM_1 = require("ObjetRequeteResultatsQCM");
const ObjetFenetre_ResultatsQCM_PN_1 = require("ObjetFenetre_ResultatsQCM_PN");
const ObjetRequeteSaisieQCMDevoir_1 = require("ObjetRequeteSaisieQCMDevoir");
const DonneesListe_ResultatsQCM_1 = require("DonneesListe_ResultatsQCM");
const TypeEvolutionResultatsQCM_1 = require("TypeEvolutionResultatsQCM");
const ObjetRequeteListeElevesPourLesRessourcesALaDate_1 = require("ObjetRequeteListeElevesPourLesRessourcesALaDate");
const AccessApp_1 = require("AccessApp");
const UtilitaireSaisieCDT_1 = require("UtilitaireSaisieCDT");
class InterfaceEditionListeQCM_PN extends InterfaceEditionListeQCM_1.InterfaceEditionListeQCM {
	constructor(...aParams) {
		super(...aParams);
		DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM.setTypeEvolutionResultatsQCM(
			TypeEvolutionResultatsQCM_1.TypeEvolutionResultats,
		);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
		$.extend(this.options, {
			avecNiveau: !this.etatUtilisateurSco.pourPrimaire(),
			avecCompetences:
				!this.etatUtilisateurSco.pourPrimaire() ||
				lApplicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionCompetences,
				),
			avecAssocEvaluations: true,
			verrouilleEditionMatiereAvecCompetences: false,
			avecBoutonPartageQCM: true,
			avecValidationAuto: true,
			avecMenuContexteListe: true,
			avecSelectionClasseObligatoire: this.etatUtilisateurSco.pourPrimaire(),
			avecAssocActivite: this.etatUtilisateurSco.pourPrimaire(),
			avecAssocTAFPrim: this.etatUtilisateurSco.pourPrimaire(),
			avecThemes: lApplicationSco.parametresUtilisateur.get(
				"avecGestionDesThemes",
			),
			avecPersonnalisationProjetAccompagnement: true,
		});
		this.contructeurRequeteListeQCMCumuls =
			ObjetRequeteListeQCMCumuls_1.ObjetRequeteListeQCMCumuls;
	}
	estCloudIndexActif() {
		return !!this.etatUtilisateurSco.cloudIndexActif;
	}
	avecCloudIndex() {
		return !!this.etatUtilisateurSco.avecCloudIndex;
	}
	lancerRequeteResultatsQCM() {
		new ObjetRequeteResultatsQCM_1.ObjetRequeteResultatsQCM(
			this,
			this.actionSurResultatsQCM,
		).lancerRequete({ element: this.element });
	}
	lancerRequeteSaisieQCMDevoir(aParams, aCallback) {
		new ObjetRequeteSaisieQCMDevoir_1.ObjetRequeteSaisieQCMDevoir(
			this,
			aCallback,
		).lancerRequete(aParams);
	}
	setInfosCollab(aInfosCollab) {
		this.listeQCM.parcourir((D) => {
			D.avecVerrouCollab = false;
		});
		this.element.avecVerrouCollab = aInfosCollab.avecVerrouCollab;
		this.getInstance(this.identListeQCM).actualiser(true);
	}
	initialiserFenetreSelectionQCM(aInstance) {
		UtilitaireQCM_1.UtilitaireQCM.initFenetreSelectionQCM(aInstance);
		aInstance.setGenreRessources({
			genreQCM: Enumere_Ressource_1.EGenreRessource.QCM,
			genreNiveau: Enumere_Ressource_1.EGenreRessource.Niveau,
			genreMatiere: Enumere_Ressource_1.EGenreRessource.Matiere,
			genreAucun: Enumere_Ressource_1.EGenreRessource.Aucune,
		});
	}
	evenementSurSelectionQCM(aNumeroBouton, aListeQCM) {
		if (aNumeroBouton > 0) {
			if (
				aListeQCM
					.getListeElements((aEle) => {
						return aEle.getGenre() === Enumere_Ressource_1.EGenreRessource.QCM;
					})
					.count()
			) {
				const lParam = { QCM: aListeQCM, classe: null };
				if (this.classePrimSelectionne) {
					lParam.classe = this.classePrimSelectionne;
				}
				new ObjetRequeteSaisieCopieQCM_1.ObjetRequeteSaisieCopieQCM(
					this,
					this.actionCopieQCM,
				).lancerRequete(lParam);
			}
		} else {
			this.callback.appel({
				genreEvnt:
					InterfaceEditionListeQCM_1.InterfaceEditionListeQCM.GenreEvenement
						.copieQCM,
			});
		}
	}
	initFenetreSelectionQCMQuestion(aInstance) {
		aInstance.setGenreRessources({
			genreQCM: Enumere_Ressource_1.EGenreRessource.QCM,
			genreNiveau: Enumere_Ressource_1.EGenreRessource.Niveau,
			genreMatiere: Enumere_Ressource_1.EGenreRessource.Matiere,
			genreAucun: Enumere_Ressource_1.EGenreRessource.Aucune,
		});
	}
	evntSurSelectionQCMQuestion(aNumeroBouton, aParams) {
		if (
			aParams.bouton.valider &&
			this.element &&
			this.element.contenuQCM &&
			aParams.listeQuestions
		) {
			aParams.listeQuestions.parcourir((aQuestionEnCopie) => {
				const lEltCopie =
					MethodesObjet_1.MethodesObjet.dupliquer(aQuestionEnCopie);
				lEltCopie.Numero = null;
				lEltCopie.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
				lEltCopie.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				lEltCopie.Position = this.element.contenuQCM.listeQuestions.count();
				lEltCopie.nouvellePosition = lEltCopie.Position;
				if (lEltCopie.listeReponses) {
					for (let i = 0; i < lEltCopie.listeReponses.count(); i++) {
						const lRep = lEltCopie.listeReponses.get(i);
						lRep.Numero = null;
						lRep.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
						lRep.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
						if (lRep.associationA) {
							lRep.associationA.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
							lRep.associationA.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
						}
						if (lRep.associationB) {
							lRep.associationB.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
							lRep.associationB.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
						}
					}
				}
				this.evtSurAddListeQuestions(lEltCopie);
			});
			const lInstanceFenetre = this.getInstance(
				this.identFenetreSelectionQCMQuestion,
			);
			lInstanceFenetre.afficherMessageToastSuccesAjout(
				aParams.listeQuestions.count(),
			);
			let lInfosCollab = null;
			if (this.options.estModeCollab) {
				lInfosCollab = {
					avecVerrouCollab: this.element.contenuQCM.avecVerrouCollab,
					possesseurVerrou: this.element.contenuQCM.possesseurVerrou,
				};
			}
			this.callback.appel({
				genreEvnt:
					InterfaceEditionListeQCM_1.InterfaceEditionListeQCM.GenreEvenement
						.AjoutQuestions,
				infosCollab: lInfosCollab,
			});
		} else {
			this.validationAuto();
		}
	}
	evtSurAddListeQuestions(aEltQuestion) {
		this.element.contenuQCM.listeQuestions.addElement(aEltQuestion);
		this.element.contenuQCM.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.setEtatSaisie(true);
	}
	construireInstanceFenetreResultatsQCM() {
		this.identFenetreResultatsQCM = this.addFenetre(
			ObjetFenetre_ResultatsQCM_PN_1.ObjetFenetre_ResultatsQCM_PN,
			this.evntSurResultatsQCM,
			this.initialiserFenetreResultatsQCM,
		);
	}
	initialiserFenetreResultatsQCM(aInstance) {
		aInstance.setOptions({
			avecOptionPDFCopie: false,
			avecRectificationNotePossible: true,
			avecPersonnalisationProjetAccompagnement:
				this.options.avecPersonnalisationProjetAccompagnement,
		});
	}
	construireInstancesAssociationDevoir() {
		if (this.options.avecAssocDevoirs) {
			this.idFenetreDevoir = this.add(
				ObjetFenetre_DevoirPN_1.ObjetFenetre_DevoirPN,
				this.evntSurFenetreDevoir,
				this.initFenetreDevoir,
			);
		}
	}
	creerDevoirParDefaut(aService) {
		const lDevoir = new ObjetElement_1.ObjetElement();
		lDevoir.service = aService;
		lDevoir.estDevoirEditable = true;
		lDevoir.date = ObjetDate_1.GDate.getDateCourante(true);
		lDevoir.coefficient = new TypeNote_1.TypeNote(1.0);
		lDevoir.bareme = new TypeNote_1.TypeNote(
			GParametres.baremeNotation.getValeur(),
		);
		lDevoir.commentaire = "";
		lDevoir.datePublication =
			ObjetUtilitaireDevoir_1.ObjetUtilitaireDevoir.getDatePublicationDevoirParDefaut(
				lDevoir.date,
			);
		lDevoir.listeClasses = this.creerDevoirParDefautListeClasses(aService);
		lDevoir.listeEleves = new ObjetListeElements_1.ObjetListeElements();
		lDevoir.ramenerSur20 = false;
		lDevoir.commeUnBonus = false;
		lDevoir.commeUneNote = false;
		lDevoir.verrouille = false;
		return lDevoir;
	}
	creerDevoirParDefautEltClasse(aClasse) {
		const lElementClasse = this.listeClasses.getElementParNumeroEtGenre(
			aClasse.getNumero(),
		);
		const lClasse = ObjetElement_1.ObjetElement.create({
			Libelle: lElementClasse.getLibelle(),
			Numero: lElementClasse.getNumero(),
			Genre: lElementClasse.getGenre(),
		});
		lClasse.service = MethodesObjet_1.MethodesObjet.dupliquer(aClasse.service);
		lClasse.listePeriodes = new ObjetListeElements_1.ObjetListeElements();
		lClasse.listePeriodes.addElement(
			MethodesObjet_1.MethodesObjet.dupliquer(lElementClasse.periodeParDefaut),
		);
		lClasse.listePeriodes.addElement(new ObjetElement_1.ObjetElement("", 0));
		return lClasse;
	}
	creerDevoirParDefautListeClasses(aService) {
		const lListeClasse = new ObjetListeElements_1.ObjetListeElements();
		if (aService !== null && aService !== undefined) {
			if (aService.classe.existeNumero()) {
				lListeClasse.addElement(
					this.creerDevoirParDefautEltClasse(aService.classe),
				);
			} else {
				for (
					let i = 0, lNbr = aService.groupe.listeClasses.count();
					i < lNbr;
					i++
				) {
					lListeClasse.addElement(
						this.creerDevoirParDefautEltClasse(
							aService.groupe.listeClasses.get(i),
						),
					);
				}
			}
		}
		return lListeClasse;
	}
	construireInstancesAssociationCdT() {
		if (this.options.avecAssocTAF) {
			this.identFenetreQCMPourCDT = this.addFenetre(
				ObjetFenetre_QCMPourCDT_1.ObjetFenetre_QCMPourCDT,
				this.evntFenetreCDT,
			);
		}
	}
	construireInstanceObjetFenetreEditionQCM() {
		this.identFenetreEditionQCM = this.add(
			ObjetFenetre_EditionQCM_PN_1.ObjetFenetre_EditionQCM_PN,
			this.evenementFenetreEditionQCM,
		);
	}
	async evntFenetreCDT(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			const lConteneurDonnees = this.getInstance(this.identFenetreQCMPourCDT);
			let lAccepteAffectation = true;
			if (
				lConteneurDonnees.getParametresFenetreQCMPourCDT().QCMPourTAF &&
				lConteneurDonnees.getParametresFenetreQCMPourCDT().infosCours
			) {
				lAccepteAffectation =
					await UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.autoriserCreationTAF({
						ajoutNouveauTAFInterdit:
							lConteneurDonnees.getParametresFenetreQCMPourCDT().infosCours
								.ajoutNouveauTAFInterdit,
						messageSurNouveauTAF:
							lConteneurDonnees.getParametresFenetreQCMPourCDT().infosCours
								.messageSurNouveauTAF,
					});
			}
			if (lAccepteAffectation) {
				new ObjetRequeteSaisieQCMPourCDT_1.ObjetRequeteSaisieQCMPourCDT(this)
					.lancerRequete({
						cours:
							lConteneurDonnees.getParametresFenetreQCMPourCDT()
								.coursSelectionne,
						numeroCycle:
							lConteneurDonnees.getParametresFenetreQCMPourCDT().cycle,
						QCM: lConteneurDonnees.getParametresFenetreQCMPourCDT().QCM,
						estPourTAF:
							lConteneurDonnees.getParametresFenetreQCMPourCDT().QCMPourTAF,
						dateTAF: lConteneurDonnees.getParametresFenetreQCMPourCDT().dateTAF,
						cahier:
							lConteneurDonnees.getParametresFenetreQCMPourCDT()
								.coursSelectionne.cahierDeTextes,
					})
					.then((aReponse) => {
						if (
							aReponse.genreReponse ===
							ObjetRequeteJSON_1.EGenreReponseSaisie.succes
						) {
							this.getInstance(this.identFenetreQCMPourCDT).fermer();
							this.callback.appel({
								genreEvnt:
									InterfaceEditionListeQCM_1.InterfaceEditionListeQCM
										.GenreEvenement.associeCdT,
							});
						}
					});
			}
		} else {
			this.getInstance(this.identFenetreQCMPourCDT).fermer();
		}
	}
	setSelectionListe(aListeSelection) {
		this.getInstance(this.identListeQCM).setListeElementsSelection(
			aListeSelection,
			{ avecEvenement: true, avecScroll: true },
		);
	}
	associerNouvelleEvaluation(aQcmSelectionne) {
		const lListeServicesDisponibles = !!aQcmSelectionne
			? aQcmSelectionne.listeServicesCompatiblesAvecCompetencesDuQCM
			: null;
		if (!!lListeServicesDisponibles && lListeServicesDisponibles.count() > 0) {
			const lThis = this;
			if (aQcmSelectionne.nombreQuestionsSoumises === 0) {
				const lFenetreCreationEvaluation =
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_EvaluationQCM_1.ObjetFenetre_EvaluationQCM,
						{
							pere: this,
							evenement: function (aGenreBouton, aEvaluation) {
								if (aGenreBouton === 1) {
									aEvaluation.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
									new ObjetRequeteSaisieQCMEvaluation_1.ObjetRequeteSaisieQCMEvaluation(
										lThis,
										() => {
											lThis.callback.appel({
												genreEvnt:
													InterfaceEditionListeQCM_1.InterfaceEditionListeQCM
														.GenreEvenement.associeEvaluation,
											});
										},
									).lancerRequete({ evaluation: aEvaluation });
								}
							},
							initialiser: function (aInstance) {
								aInstance.setOptionsFenetre({
									titre: ObjetTraduction_1.GTraductions.getValeur(
										"SaisieQCM.FenetreAssocEvaluation.CreerEvaluation",
									),
								});
							},
						},
					);
				lFenetreCreationEvaluation.setDonnees({
					evaluation: this.creerEvaluationVide(aQcmSelectionne),
					avecChoixService: true,
				});
			} else {
				const lOptionsMessage = [];
				lOptionsMessage.push(
					ObjetTraduction_1.GTraductions.getValeur(
						"FenetreParamExecutionQCM.SeulementQuestions",
					),
				);
				lOptionsMessage.push(aQcmSelectionne.nombreQuestionsSoumises);
				lOptionsMessage.push(
					ObjetTraduction_1.GTraductions.getValeur(
						"FenetreParamExecutionQCM.QuestionsPrisesAuHasard",
					),
				);
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"SaisieQCM.MsgOptionIncompatibleAvecEvaluation",
						lOptionsMessage,
					),
				});
			}
		} else {
			GApplication.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				message: ObjetTraduction_1.GTraductions.getValeur(
					"SaisieQCM.AucunServiceCompatiblePourQCM",
				),
			});
		}
	}
	evntSurBtnPartageQCM() {
		UtilitairePartenaire_1.TUtilitairePartenaire.ouvrirPatience();
		if (
			ObjetRequeteAccesSecurisePageProfil_1.ObjetRequeteAccesSecurisePageProfil
		) {
			new ObjetRequeteAccesSecurisePageProfil_1.ObjetRequeteAccesSecurisePageProfil(
				this,
			)
				.lancerRequete({ listeQCM: true })
				.then((aReponse) => {
					this.actionSurRequetePartageQCM(
						aReponse.titre,
						aReponse.message,
						aReponse.url,
					);
				});
		}
	}
	actionSurRequetePartageQCM(aTitre, aMessage, aUrl) {
		if (aMessage) {
			UtilitairePartenaire_1.TUtilitairePartenaire.fermerPatience();
			GApplication.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				titre: aTitre,
				message: aMessage,
			});
		} else if (aUrl) {
			UtilitairePartenaire_1.TUtilitairePartenaire.ouvrirUrl(aUrl);
		} else {
			UtilitairePartenaire_1.TUtilitairePartenaire.fermerPatience();
		}
	}
	creerActivite(aQCM, aRessource) {
		const lDate = ObjetDate_1.GDate.getProchainJourOuvre(
			ObjetDate_1.GDate.hier,
		);
		const lActivite =
			UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.creerNouvelleActivite({
				date: lDate,
				genre: TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Activite,
				ressource: aRessource,
				QCM: aQCM,
				matiere: aQCM.matiere,
			});
		new ObjetRequeteListeElevesPourLesRessourcesALaDate_1.ObjetRequeteListeElevesPourLesRessourcesALaDate(
			this,
		)
			.lancerRequete({ ressource: aRessource, date: lActivite.DateDebut })
			.then((aJSON) => {
				UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.miseAJourInfosEleves(
					lActivite,
					aJSON.eleves,
				);
				lActivite.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				ObjetFenetre_Activite_1.ObjetFenetre_Activite.ouvrir({
					instance: this,
					article: lActivite,
					listeMatieres: this.listeMatieresPrim,
					estCreation: true,
					ressource: aRessource,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.Menu.AssocierActivite",
					),
					genre: Enumere_Activites_Tvx_1.EGenreActivite_Tvx.ga_Act_QCM,
					callback: this._surFenetreActivite.bind(this),
					nonModifiable: true,
				});
			});
	}
	creerTAF(aQCM, aRessource) {
		const lDate = ObjetDate_1.GDate.getProchainJourOuvre(
			ObjetDate_1.GDate.getDateCourante(),
		);
		const lTravail =
			UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.creerNouvelleActivite({
				date: lDate,
				genre: TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Travail,
				ressource: aRessource,
				QCM: aQCM,
				matiere: aQCM.matiere,
			});
		new ObjetRequeteListeElevesPourLesRessourcesALaDate_1.ObjetRequeteListeElevesPourLesRessourcesALaDate(
			this,
		)
			.lancerRequete({ ressource: aRessource, date: lTravail.DateDebut })
			.then((aJSON) => {
				UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.miseAJourInfosEleves(
					lTravail,
					aJSON.eleves,
				);
				lTravail.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				ObjetFenetre_Activite_1.ObjetFenetre_Activite.ouvrir({
					instance: this,
					article: lTravail,
					listeMatieres: this.listeMatieresPrim,
					estCreation: true,
					ressource: aRessource,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.Menu.AssocierTAF",
					),
					genre: Enumere_Activites_Tvx_1.EGenreActivite_Tvx.ga_Taf_QCM,
					callback: this._surFenetreActivite.bind(this),
					nonModifiable: true,
				});
			});
	}
	afficherExerciceCDT(aElt) {
		this.getInstance(this.identFenetreQCMPourCDT).afficherExerciceCDT(aElt);
	}
	getTitreTheme() {
		return ObjetTraduction_1.GTraductions.getValeur("Themes");
	}
	creerEvaluationVide(aQCM) {
		let lServiceEvaluation = null;
		if (!!aQCM && !!aQCM.listeServicesCompatiblesAvecCompetencesDuQCM) {
			lServiceEvaluation =
				aQCM.listeServicesCompatiblesAvecCompetencesDuQCM.getPremierElement();
		}
		return ObjetUtilitaireEvaluation_1.ObjetUtilitaireEvaluation.creerNouvelleEvaluationQCM(
			aQCM,
			lServiceEvaluation,
		);
	}
	_surFenetreActivite(aNumeroBouton, aParam) {
		if (
			aNumeroBouton ===
			ObjetFenetre_Activite_1.ObjetFenetre_Activite.genreAction.valider
		) {
			if (aParam.activite) {
				const lActivite = aParam.activite;
				lActivite.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				this.setEtatSaisie(true);
				aParam.callback = this._surApresRequeteSaisieActivite.bind(this);
				UtilitaireActiviteTAFPP_1.UtilitaireActiviteTAFPP.requeteSaisie.call(
					this,
					lActivite,
					aParam,
				);
			}
		}
	}
	_surApresRequeteSaisieActivite() {
		this.callback.appel({
			genreEvnt:
				InterfaceEditionListeQCM_1.InterfaceEditionListeQCM.GenreEvenement
					.creationAutoQCM,
			selection: this.element,
		});
	}
}
exports.InterfaceEditionListeQCM_PN = InterfaceEditionListeQCM_PN;
