exports.InterfaceRecapitulatifVS = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetRequeteSaisieVieScolaire_1 = require("ObjetRequeteSaisieVieScolaire");
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetRequetePageVieScolaire_1 = require("ObjetRequetePageVieScolaire");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetInterfacePageCP_1 = require("ObjetInterfacePageCP");
const ObjetUtilitaireAbsence_1 = require("ObjetUtilitaireAbsence");
const ObjetVSListeDetails_1 = require("ObjetVSListeDetails");
const Toast_1 = require("Toast");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const DonneesListe_EvenementsVS_1 = require("DonneesListe_EvenementsVS");
const ObjetDate_1 = require("ObjetDate");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const ObjetFenetre_ServicesPeriscolairePourAbsence_1 = require("ObjetFenetre_ServicesPeriscolairePourAbsence");
const ObjetRequeteSaisieServicesPeriscolairePourAbsence_1 = require("ObjetRequeteSaisieServicesPeriscolairePourAbsence");
const ObjetFenetre_DetailElementVS_1 = require("ObjetFenetre_DetailElementVS");
const ObjetDetailElementVS_1 = require("ObjetDetailElementVS");
const _ObjetDetailElementVS_1 = require("_ObjetDetailElementVS");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetPosition_1 = require("ObjetPosition");
const UtilitaireContactReferents_1 = require("UtilitaireContactReferents");
class InterfaceRecapitulatifVS extends ObjetInterfacePageCP_1.InterfacePageCP {
	constructor(...aParams) {
		super(...aParams);
		this.utilitaireAbsence =
			new ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence();
		this.identListeBoutons = GUID_1.GUID.getId();
		this.retourAccueil = false;
		this.applicationSco = GApplication;
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.parametresSco = this.applicationSco.getObjetParametres();
		this.donnees = {
			listeRecapitulatifs: new ObjetListeElements_1.ObjetListeElements(),
			listeAbsences: new ObjetListeElements_1.ObjetListeElements(),
			totaux: {},
			listeMatieres: new ObjetListeElements_1.ObjetListeElements(),
			apresValidation: false,
			elementSelection: null,
		};
		this.setOptionsEcrans({ nbNiveaux: 4, avecBascule: IE.estMobile });
		this.contexte = {
			niveauCourant: 0,
			ecran: [
				InterfaceRecapitulatifVS.genreEcran.listeRecap,
				InterfaceRecapitulatifVS.genreEcran.listeElements,
			],
			selection: [],
			guidRef: GUID_1.GUID.getId(),
		};
	}
	revenirSurEcranPrecedent() {
		if (!this.retourAccueil) {
			super.revenirSurEcranPrecedent();
		} else {
			this.etatUtilisateurSco.setPage({
				Onglet: Enumere_Onglet_1.EGenreOnglet.Accueil,
			});
			if (GEtatUtilisateur.getGenreOnglet()) {
				const lGenreOnglet = GEtatUtilisateur.getGenreOnglet();
				GInterface.evenementSurOnglet(lGenreOnglet);
			}
		}
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementListeEvenementsVS,
			this.initialiserListeEvenementsVS,
		);
		this.identListeDetails = this.add(
			ObjetVSListeDetails_1.ObjetVSListeDetails,
			this.evenementListeDetails,
			(aInstance) => {
				aInstance.setOptions({
					avecBascule: this.optionsEcrans.avecBascule,
					funcTitreListe: () => this.getTitreListe(),
				});
			},
		);
		this.identDetailElement = this.add(
			ObjetDetailElementVS_1.ObjetDetailElementVS,
			this.evenementObjetDetailElement,
		);
	}
	setParametresGeneraux() {
		this.AvecCadre = false;
		this.avecBandeau = true;
		this.AddSurZone = [this.identSelection];
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const H = [];
		const lClass = [];
		if (this.optionsEcrans.avecBascule) {
			lClass.push("avecBascule");
		} else {
			lClass.push("sansBascule");
		}
		if (IE.estMobile) {
			lClass.push("mobile-recapVS mobile-main-content");
		} else {
			lClass.push("espace-recapVS");
		}
		H.push(
			'<div class="ifc_RecapVS ObjetFenetre_Edition_Contenu ',
			lClass.join(" "),
			'">',
		);
		lClass.pop();
		lClass.push("ifc_RecapVS_EcranRecap");
		H.push(
			'<div id="',
			this.getIdDeNiveau({ niveauEcran: 0 }),
			'"',
			' class="',
			lClass.join(" "),
			'">',
		);
		H.push(
			'<div id="',
			this.getNomInstance(this.identListe),
			'" style="height:100%;" class="FlatListeEvenementsVS ',
			this.etatUtilisateurSco.pourPrimaire() ? "EspaceHaut" : "",
			'"></div>',
		);
		H.push("</div>");
		lClass.pop();
		lClass.push("ifc_RecapVS_EcranListe");
		H.push(
			'<div id="',
			this.getIdDeNiveau({ niveauEcran: 1 }),
			'" class="',
			lClass.join(" "),
			'">',
		);
		H.push(
			'<div id="',
			this.getNomInstance(this.identListeDetails),
			'" class="ifc_RecapVS_EcranListe_Content"></div>',
		);
		H.push("</div>");
		lClass.pop();
		lClass.push("ifc_RecapVS_EcranElement");
		H.push(
			'<div id="',
			this.getIdDeNiveau({ niveauEcran: 2 }),
			'" class="',
			lClass.join(" "),
			'">',
		);
		H.push(
			'<div id="',
			this.getNomInstance(this.identDetailElement),
			'" class="ifc_RecapVS_EcranElement_Content contenu-edition"></div>',
		);
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
	construireEcran(aEcran) {
		let lHtmlBandeau = "";
		switch (aEcran.genreEcran) {
			case InterfaceRecapitulatifVS.genreEcran.listeRecap:
				return new Promise((aResolve) => {
					this.initialiser(true);
					aResolve();
				});
			case InterfaceRecapitulatifVS.genreEcran.listeElements:
				return new Promise((aResolve) => {
					if (this.optionsEcrans.avecBascule) {
						const lDonnees = this.getCtxSelection({ niveauEcran: 0 });
						lHtmlBandeau = this.construireBandeauEcranVisu({
							titre: lDonnees.recapitulatif.titreSection,
							sousTitre: this.periodeCourant.getLibelle(),
						});
						this.setHtmlStructureAffichageBandeau(lHtmlBandeau);
						ObjetHtml_1.GHtml.setDisplay(
							this.applicationSco.idLigneBandeau,
							true,
						);
					}
					if (!!this.objDonneesDuRecap) {
						this.getInstance(this.identListeDetails).setDonnees(
							this.objDonneesDuRecap,
						);
					}
					aResolve();
				});
			default:
				return new Promise((aResolve) => {
					aResolve();
				});
		}
	}
	construireBandeauEcranVisu(aObjet) {
		const H = [];
		H.push('<div class="titres-contain">');
		if (aObjet.titre) {
			H.push('<h3 class="ifc_RecapVS_TexteBandeau">', aObjet.titre, "</h3>");
		}
		if (aObjet.sousTitre) {
			H.push(
				'<div class="ifc_RecapVS_TexteBandeauSecondaire">',
				aObjet.sousTitre,
				"</div>",
			);
		}
		H.push("</div>");
		return this.construireBandeauEcran(H.join(""), { bgWhite: true });
	}
	afficherListeElementsVSDeRecap() {
		const lEcranSrc = {
			niveauEcran: 0,
			genreEcran: this.getCtxEcran({ niveauEcran: 0 }),
			dataEcran: this.getCtxSelection({ niveauEcran: 0 }),
		};
		const lEcranDest = {
			niveauEcran: 1,
			genreEcran: this.getCtxEcran({ niveauEcran: 1 }),
		};
		this.basculerEcran(lEcranSrc, lEcranDest);
		$(".ifc_RecapVS_EcranListe_Content").find("li:first-child").focus();
	}
	afficherEcranSaisie() {
		const lEcranSrc = {
			niveauEcran: 3,
			genreEcran: this.getCtxEcran({ niveauEcran: 3 }),
		};
		const lEcranDest = {
			niveauEcran: 0,
			genreEcran: this.getCtxEcran({ niveauEcran: 0 }),
			dataEcran: this.getCtxSelection({ niveauEcran: 0 }),
		};
		this.basculerEcran(lEcranSrc, lEcranDest);
	}
	ajouterAbsence() {
		ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.ajouterAbsence({
			instanceAppel: this,
			callbackApresSaisieAbsences: this.callbackApresSaisieAbsences.bind(this),
			commentaireAbsenceObligatoire:
				!!this.donnees.commentaireAbsenceObligatoire,
		});
	}
	callbackApresSaisieAbsences(aParams) {
		if (
			!!aParams &&
			!!aParams.servicesPeriscolairePourAbsence &&
			!!aParams.servicesPeriscolairePourAbsence.liste &&
			aParams.servicesPeriscolairePourAbsence.liste.count()
		) {
			this.servicesPeriscolairePourAbsence =
				aParams.servicesPeriscolairePourAbsence;
			if (aParams.absenceAjoutee) {
				if (this.servicesPeriscolairePourAbsence.absence) {
					this.servicesPeriscolairePourAbsence.absence.debut =
						aParams.absenceAjoutee.debut;
					this.servicesPeriscolairePourAbsence.absence.fin =
						aParams.absenceAjoutee.fin;
				} else {
					this.servicesPeriscolairePourAbsence.absence = aParams.absenceAjoutee;
				}
			}
			this.recupererDonnees();
		} else {
			this.actionApresSaisieCreation(
				Enumere_Ressource_1.EGenreRessource.Absence,
			);
		}
	}
	ajouterDispense(aEstDispenseLongue) {
		ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.ajouterDispense({
			instanceAppel: this,
			estDispenseLongue: aEstDispenseLongue,
			callbackApresSaisieDispense: this.callbackApresSaisieDispense.bind(this),
		});
	}
	callbackApresSaisieDispense() {
		this.actionApresSaisieCreation(
			Enumere_Ressource_1.EGenreRessource.Dispense,
		);
	}
	async actionApresSaisieCreation(aGenreRessource) {
		await this.recupererDonneesRecapVS();
		const lRecap =
			this.donnees.listeRecapitulatifs.getElementParGenre(aGenreRessource);
		this.objDonneesDuRecap = this.utilitaireAbsence.getDonneesAAfficher.call(
			this,
			{ recapitulatif: lRecap },
		);
		this.deselectionnerRecap();
		this.selectionnerRecap(this.objDonneesDuRecap);
		this.afficherListeElementsVSDeRecap();
		let lIndice = this.donnees.listeRecapitulatifs.getIndiceParElement(lRecap);
		this.getInstance(this.identListe).selectionnerLigne({
			ligne: this.etatUtilisateurSco.pourPrimaire() ? lIndice : ++lIndice,
			avecScroll: true,
			avecEvenement: false,
		});
	}
	actionRetourAccueil() {
		this.etatUtilisateurSco.setPage({
			Onglet: Enumere_Onglet_1.EGenreOnglet.Accueil,
		});
		if (GEtatUtilisateur.getGenreOnglet()) {
			const lGenreOnglet = GEtatUtilisateur.getGenreOnglet();
			GInterface.evenementSurOnglet(lGenreOnglet);
		}
	}
	initialiserListeEvenementsVS(aInstance) {
		aInstance.setOptionsListe({
			titreCreation:
				ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.Prevenir"),
			avecLigneCreation:
				this.utilitaireAbsence.avecCommandeContacterReferentsVS() ||
				this.utilitaireAbsence.avecCommandeDeclarerUneAbsence() ||
				this.utilitaireAbsence.avecCommandeDeclarerUneDispensePonctuelle() ||
				this.utilitaireAbsence.avecCommandeDeclarerUneDispenseLongue(),
			ariaHasPopupBtnCreation: "menu",
			ariaLabel: () => this.getTitreListe(),
			forcerScrollV_mobile: true,
		});
	}
	getTitreListe() {
		var _a;
		return `${this.etatUtilisateurSco.getLibelleLongOnglet()} ${((_a = this.periodeCourant) === null || _a === void 0 ? void 0 : _a.getLibelle()) || ""}`.trim();
	}
	evenementListeEvenementsVS(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation: {
				const lPosBtn = ObjetPosition_1.GPosition.getClientRect(
					aParametres.nodeBouton,
				);
				ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
					pere: this,
					id: { x: lPosBtn.left, y: lPosBtn.bottom + 10 },
					initCommandes: (aInstance) => {
						var _a;
						if (this.utilitaireAbsence.avecCommandeContacterReferentsVS()) {
							aInstance.add(
								ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.ContacterLaVieScolaire",
								),
								true,
								() => {
									UtilitaireContactReferents_1.UtilitaireContactReferents.contacterReferentsVieScolaire(
										this,
										this.etatUtilisateurSco.getEtablissement()
											.listeReferentsVieScolaire,
									);
								},
								{ icon: "icon_envoyer" },
							);
						}
						if (this.utilitaireAbsence.avecCommandeDeclarerUneAbsence()) {
							aInstance.add(
								ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.PrevenirAbsenceParent",
								),
								true,
								() => {
									this.ajouterAbsence();
								},
								{ icon: "icon_absences_prevue" },
							);
						}
						const lAvecAuMoinsUneMatiereDispensable =
							(_a =
								this.etatUtilisateurSco.getMembre()
									.listeMatieresDeclarationDispense) === null || _a === void 0
								? void 0
								: _a.count();
						if (lAvecAuMoinsUneMatiereDispensable) {
							if (
								this.utilitaireAbsence.avecCommandeDeclarerUneDispensePonctuelle()
							) {
								aInstance.add(
									ObjetTraduction_1.GTraductions.getValeur(
										"AbsenceVS.PrevenirDispensePonctuelle",
									),
									true,
									() => {
										this.ajouterDispense(false);
									},
									{ icon: "icon_dispense" },
								);
							}
							if (
								this.utilitaireAbsence.avecCommandeDeclarerUneDispenseLongue()
							) {
								aInstance.add(
									ObjetTraduction_1.GTraductions.getValeur(
										"AbsenceVS.PrevenirDispenseLongue",
									),
									true,
									() => {
										this.ajouterDispense(true);
									},
									{ icon: "icon_dispense mix-icon_time i-as-deco" },
								);
							}
						}
					},
				});
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
				let lRecap;
				this.objDonneesDuRecap = null;
				const lGenre = aParametres.article.getGenre();
				if (
					lGenre ===
					Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve
				) {
					for (
						let i = 0, lNbrElem = this.donnees.listeRecapitulatifs.count();
						i < lNbrElem;
						i++
					) {
						const lRecapitulatif = this.donnees.listeRecapitulatifs.get(i);
						if (
							lRecapitulatif.genreObservation ===
							aParametres.article.genreObservation
						) {
							lRecap = lRecapitulatif;
						}
					}
				} else {
					lRecap = this.donnees.listeRecapitulatifs.getElementParGenre(lGenre);
				}
				if (this.etatUtilisateurSco.Navigation.OptionsOnglet) {
					this.etatUtilisateurSco.Navigation.OptionsOnglet.recap = lRecap;
				} else {
					this.etatUtilisateurSco.Navigation.OptionsOnglet = { recap: lRecap };
				}
				if (this.etatUtilisateurSco.pourPrimaire()) {
					ObjetHtml_1.GHtml.setDisplay(
						this.identListeBoutons,
						aParametres.article.getGenre() ===
							Enumere_Ressource_1.EGenreRessource.Absence,
					);
				}
				if (
					lGenre === Enumere_Ressource_1.EGenreRessource.Aucune ||
					(!!lRecap && lRecap.nombre)
				) {
					if (lGenre === Enumere_Ressource_1.EGenreRessource.Aucune) {
						this.objDonneesDuRecap = {
							recapitulatif: {
								titreSection: ObjetTraduction_1.GTraductions.getValeur(
									"RecapAbsenceEleve.TotalDesHeuresManquees",
								),
							},
							donnees: this.donnees.listeMatieres,
							genre: Enumere_Ressource_1.EGenreRessource.Aucune,
							totaux: this.donnees.totaux,
							utilitaireAbsence: this.utilitaireAbsence,
							autorisations: this.donnees.autorisations,
						};
					} else {
						this.objDonneesDuRecap =
							this.utilitaireAbsence.getDonneesAAfficher.call(this, {
								recapitulatif: lRecap,
							});
					}
					this.deselectionnerRecap();
					this.selectionnerRecap(this.objDonneesDuRecap);
					this.afficherListeElementsVSDeRecap();
				} else if (!!lRecap && lRecap.Nombre && lRecap.Nombre.length === 0) {
					const lMessage = this.getRecapitulatifLibelle(lRecap);
					this.deselectionnerRecap();
					this.getInstance(this.identListeDetails).setHtmlMessageVide(lMessage);
				}
				break;
			}
		}
	}
	evenementListeDetails(aParam) {
		switch (aParam.evenement) {
			case ObjetVSListeDetails_1.ObjetVSListeDetails.evenement
				.validationObservation:
				if (!!aParam.element && !aParam.element.estLue) {
					aParam.element.estLue = true;
					aParam.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					new ObjetRequeteSaisieVieScolaire_1.ObjetRequeteSaisieVieScolaire(
						this,
					)
						.lancerRequete({ listeAbsences: this.donnees.listeAbsences })
						.then(() => {
							if (!!this.objDonneesDuRecap) {
								this.getInstance(this.identListeDetails).setDonnees(
									this.objDonneesDuRecap,
								);
							}
							Toast_1.Toast.afficher({
								msg: ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.message.prisConnaissanceinfo",
								),
								type: Toast_1.ETypeToast.succes,
							});
						});
				}
				break;
			case ObjetVSListeDetails_1.ObjetVSListeDetails.evenement
				.validationARPunition:
				if (!!aParam.element && !aParam.element.estLue) {
					aParam.element.parentAAccuseDeReception = true;
					aParam.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					const lCleTraduction =
						aParam.element.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.Incident
							? "AbsenceVS.message.ARIncident"
							: "AbsenceVS.message.accuseDeReception";
					new ObjetRequeteSaisieVieScolaire_1.ObjetRequeteSaisieVieScolaire(
						this,
					)
						.lancerRequete({ listeAbsences: this.donnees.listeAbsences })
						.then(() => {
							if (!!this.objDonneesDuRecap) {
								this.getInstance(this.identListeDetails).setDonnees(
									this.objDonneesDuRecap,
								);
							}
							Toast_1.Toast.afficher({
								msg: ObjetTraduction_1.GTraductions.getValeur(lCleTraduction),
								type: Toast_1.ETypeToast.succes,
							});
						});
				}
				break;
			case ObjetVSListeDetails_1.ObjetVSListeDetails.evenement
				.editionMotifParent:
				if (!!aParam.element) {
					const lElement = aParam.element;
					const lElmPourSaisie =
						MethodesObjet_1.MethodesObjet.dupliquer(lElement);
					if (!lElmPourSaisie.html) {
						this.utilitaireAbsence.remplirContentHtml({
							element: lElmPourSaisie,
							genre: lElmPourSaisie.getGenre(),
							pourParent:
								GEtatUtilisateur.getUtilisateur().getGenre() ===
								Enumere_Ressource_1.EGenreRessource.Responsable,
							avecBascule: this.optionsEcrans.avecBascule,
							avecSaisie:
								GEtatUtilisateur.getUtilisateur().getGenre() ===
									Enumere_Ressource_1.EGenreRessource.Responsable &&
								this.objDonneesDuRecap.recapitulatif.avecAutorisation,
						});
					}
					const lLibelle = _getLibelleDeGenre(lElmPourSaisie);
					const lFenetreDetailElement =
						ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_DetailElementVS_1.ObjetFenetre_DetailElementVS,
							{
								pere: this,
								evenement: (aNumeroBouton, aDonnees) => {
									this.utilitaireAbsence.eventApresFiche.call(this, lElement, {
										element: aDonnees.element,
										documents: aDonnees.documents,
										callback: this.actualisationApresSaisieFiche.bind(this),
									});
								},
								initialiser(aInstance) {
									aInstance.setOptionsFenetre({
										titre: lLibelle,
										listeBoutons: [],
									});
								},
							},
						);
					const lPropCommentaireObligatoire =
						lElmPourSaisie.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.Absence
							? "commentaireAbsenceObligatoire"
							: "commentaireRetardObligatoire";
					const lAvecCommentaireObligatoire =
						!!this.donnees[lPropCommentaireObligatoire];
					lFenetreDetailElement.setDonnees(lElmPourSaisie, {
						avecCommentaireObligatoire: lAvecCommentaireObligatoire,
					});
				}
				break;
			case ObjetVSListeDetails_1.ObjetVSListeDetails.evenement
				.editionDispenseParent:
				if (!!aParam.element) {
					ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.ajouterDispense({
						instanceAppel: this,
						element: aParam.element,
						callbackApresSaisieDispense:
							this.callbackApresSaisieDispense.bind(this),
					});
				}
				break;
			default:
				break;
		}
	}
	async actualisationApresSaisieFiche() {
		await this.recupererDonneesRecapVS();
		this.objDonneesDuRecap = this.utilitaireAbsence.getDonneesAAfficher.call(
			this,
			{ recapitulatif: this.objDonneesDuRecap.recapitulatif },
		);
		this.afficherListeElementsVSDeRecap();
	}
	majAbsenceApresSaisie(aAbsenceOrig, aAbsenceSaisie) {
		this.utilitaireAbsence._majAbsenceApresSaisie(aAbsenceOrig, aAbsenceSaisie);
	}
	evenementObjetDetailElement(aTypeEvenement, aParam) {
		if (
			aTypeEvenement ===
			_ObjetDetailElementVS_1.TypeBoutonFenetreDetailElementVS.Annuler
		) {
			if (this.retourAccueil) {
				this.actionRetourAccueil();
			} else {
				this.revenirSurEcranPrecedent();
			}
		} else {
			if (!!aParam && aParam.element) {
				const lElement = this.getCtxSelection({ niveauEcran: 1 });
				this.utilitaireAbsence.eventApresFiche.call(this, lElement, aParam);
			}
		}
	}
	deselectionnerRecap() {
		const lDataSelection = this.getCtxSelection({ niveauEcran: 0 });
		if (lDataSelection !== null && lDataSelection !== undefined) {
			if (!this.optionsEcrans.avecBascule) {
				lDataSelection.estSelectionne = false;
				this.getInstance(this.identListeDetails).setDonnees();
			}
			this.setCtxSelection({ niveauEcran: 0, dataEcran: null });
		}
	}
	selectionnerRecap(aRecap) {
		this.setCtxSelection({ niveauEcran: 0, dataEcran: aRecap });
		if (!this.optionsEcrans.avecBascule) {
			const lSelection = this.getCtxSelection({ niveauEcran: 0 });
			if (lSelection !== null && lSelection !== undefined) {
				lSelection.estSelectionne = true;
			}
		}
	}
	async recupererDonneesRecapVS() {
		let lDateDebut, lDateFin;
		if (this.periodeCourant.existeNumero()) {
			this.periodeCourant =
				this.parametresSco.listePeriodes.getElementParNumero(
					this.periodeCourant.getNumero(),
				);
			lDateDebut = this.periodeCourant.dates.debut;
			lDateFin = this.periodeCourant.dates.fin;
		} else {
			lDateDebut = this.parametresSco.PremiereDate;
			lDateFin = this.parametresSco.DerniereDate;
		}
		return new ObjetRequetePageVieScolaire_1.ObjetRequetePageVieScolaire(
			this,
			this.actionSurRecupererDonneesRecapVS,
		).lancerRequete({
			DateDebut: lDateDebut,
			DateFin: lDateFin,
			periode: this.periodeCourant,
		});
	}
	actionSurRecupererDonneesRecapVS(aObjet) {
		$.extend(this.donnees, aObjet);
		if (!!this.donnees.listeRecapitulatifs.count()) {
			for (
				let i = 0, lNbr = this.donnees.listeRecapitulatifs.count();
				i < lNbr;
				i++
			) {
				const lRecap = this.donnees.listeRecapitulatifs.get(i);
				lRecap.avecAutorisation = _estAutorise(
					lRecap,
					this.donnees.autorisations,
				);
				lRecap.estVisible = lRecap.getNombre() > 0;
			}
			this.getInstance(this.identListe).setOptionsListe({
				colonnes: [{ taille: "100%" }],
				skin: ObjetListe_1.ObjetListe.skin.flatDesign,
				avecOmbreDroite: true,
			});
			const lListeAvecAutorisation =
				this.donnees.listeRecapitulatifs.getListeElements((aElt) => {
					return aElt.avecAutorisation;
				});
			const lListeMiseEnForme = new ObjetListeElements_1.ObjetListeElements();
			const aInstance = this;
			if (
				!this.etatUtilisateurSco.pourPrimaire() &&
				this.donnees.autorisations.totalHeuresManquees
			) {
				const lTotal = new ObjetElement_1.ObjetElement();
				lTotal.titreSection = ObjetTraduction_1.GTraductions.getValeur(
					"RecapAbsenceEleve.TotalDesHeuresManquees",
				);
				const lTotaux = this.donnees.totaux;
				lTotal.iconSection = "icon_time total";
				lTotal.Genre = Enumere_Ressource_1.EGenreRessource.Aucune;
				lTotal.detail = ObjetTraduction_1.GTraductions.getValeur(
					"RecapAbsenceEleve.TotalDesHeuresM_Info",
				);
				lTotal.nombre = aInstance.getDureeTotal(lTotaux.total);
				lTotal.estVisible = true;
				lListeMiseEnForme.addElement(lTotal);
			}
			lListeAvecAutorisation.parcourir((aElt) => {
				const lElement = aElt;
				lElement.titreSection = aInstance.getRecapitulatifLibelle(aElt);
				lElement.iconSection = aInstance.getImage(aElt);
				lElement.detail = aInstance.getDetails(aElt).join(", ");
				lElement.nombre = aElt.getNombre();
				lListeMiseEnForme.addElement(lElement);
			});
			this.getInstance(this.identListe).setDonnees(
				new DonneesListe_EvenementsVS_1.DonneesListe_EvenementsVS(
					lListeMiseEnForme,
					this.donnees.autorisations.totalHeuresManquees,
				),
			);
			if (!IE.estMobile) {
				let lRecap;
				if (
					this.etatUtilisateurSco.Navigation.OptionsOnglet &&
					this.etatUtilisateurSco.Navigation.OptionsOnglet.recap
				) {
					this.donnees.listeRecapitulatifs.getIndiceElementParFiltre(
						(aRecap) => {
							if (
								aRecap.titreSection ===
								this.etatUtilisateurSco.Navigation.OptionsOnglet.recap
									.titreSection
							) {
								lRecap = aRecap;
							}
						},
					);
				} else {
					lRecap = this.donnees.listeRecapitulatifs.getElementParGenre(
						Enumere_Ressource_1.EGenreRessource.Absence,
					);
				}
				if (lRecap && lRecap.estVisible) {
					this.objDonneesDuRecap =
						this.utilitaireAbsence.getDonneesAAfficher.call(this, {
							recapitulatif: lRecap,
						});
					this.deselectionnerRecap();
					this.selectionnerRecap(this.objDonneesDuRecap);
					this.afficherListeElementsVSDeRecap();
					let lIndice =
						this.donnees.listeRecapitulatifs.getIndiceElementParFiltre(
							(aRecap) => {
								return aRecap.titreSection === lRecap.titreSection;
							},
						);
					this.getInstance(this.identListe).selectionnerLigne({
						ligne:
							this.etatUtilisateurSco.pourPrimaire() ||
							!this.donnees.autorisations.totalHeuresManquees
								? lIndice
								: ++lIndice,
						avecScroll: true,
						avecEvenement: false,
					});
					ObjetHtml_1.GHtml.setDisplay(this.identListeBoutons, true);
				} else {
					this.deselectionnerRecap();
				}
			}
		}
		if (
			this.etatUtilisateurSco.getPage() ||
			!!this.etatUtilisateurSco.Navigation.OptionsOnglet
		) {
			const lPage = IE.estMobile
				? this.etatUtilisateurSco.getPage()
				: this.etatUtilisateurSco.Navigation.OptionsOnglet;
			if (lPage && lPage.executerSaisieAbsenceParent) {
				if (!!lPage.retourAccueil) {
					this.retourAccueil = lPage.retourAccueil;
				}
				this.ajouterAbsence();
				GEtatUtilisateur.resetPage();
			}
			if (lPage && lPage.executerSaisieMotifAbsence) {
				this.retourAccueil = true;
				const lGenreElement = lPage.element.getGenre();
				let lIndice =
					this.donnees.listeRecapitulatifs.getIndiceElementParFiltre(
						(aElement) => {
							if (
								aElement.getGenre() ===
								Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve
							) {
								return (
									aElement.genreObservation === lPage.element.genreObservation
								);
							} else {
								return aElement.getGenre() === lGenreElement;
							}
						},
					);
				const lRecap = this.donnees.listeRecapitulatifs.get(lIndice);
				this.objDonneesDuRecap =
					this.utilitaireAbsence.getDonneesAAfficher.call(this, {
						recapitulatif: lRecap,
					});
				this.deselectionnerRecap();
				this.selectionnerRecap(this.objDonneesDuRecap);
				this.getInstance(this.identListe).selectionnerLigne({
					ligne:
						this.etatUtilisateurSco.pourPrimaire() ||
						!this.donnees.autorisations.totalHeuresManquees
							? lIndice
							: ++lIndice,
					avecScroll: true,
					avecEvenement: false,
				});
				this.afficherListeElementsVSDeRecap();
				GEtatUtilisateur.resetPage();
				this.etatUtilisateurSco.Navigation.OptionsOnglet = { recap: lRecap };
			}
		}
		if (
			this.servicesPeriscolairePourAbsence &&
			this.servicesPeriscolairePourAbsence.liste &&
			this.servicesPeriscolairePourAbsence.liste.count()
		) {
			ObjetFenetre_ServicesPeriscolairePourAbsence_1.ObjetFenetre_ServicesPeriscolairePourAbsence.ouvrir(
				{
					pere: this,
					evenement: (aGenreBouton, aParams) => {
						if (aParams.bouton && aParams.bouton.valider) {
							if (aParams.liste && aParams.liste.count()) {
								new ObjetRequeteSaisieServicesPeriscolairePourAbsence_1.ObjetRequeteSaisieServicesPeriscolairePourAbsence(
									this,
								)
									.lancerRequete({
										liste: aParams.liste,
										debut: this.servicesPeriscolairePourAbsence.debut,
										fin: this.servicesPeriscolairePourAbsence.fin,
										eleve: GEtatUtilisateur.getMembre(),
									})
									.then(() => {
										if (this.retourAccueil) {
											this.actionRetourAccueil();
										}
									});
							}
						} else {
							if (this.retourAccueil) {
								this.actionRetourAccueil();
							}
						}
						this.servicesPeriscolairePourAbsence = undefined;
					},
					donnees: {
						liste: this.servicesPeriscolairePourAbsence.liste,
						absence: this.servicesPeriscolairePourAbsence.absence,
					},
				},
			);
		}
	}
	getRecapitulatifLibelle(aRecapitulatif) {
		const lResult = this.utilitaireAbsence.getChaineTraductionGenreAbsenceTitre(
			{
				genre: aRecapitulatif.Genre,
				genreObservation: aRecapitulatif.genreObservation,
				aucun: aRecapitulatif.getNombre() === 0,
				genreNature: aRecapitulatif.genreNature,
				libelle:
					aRecapitulatif.Genre !== Enumere_Ressource_1.EGenreRessource.Sanction
						? aRecapitulatif.Genre !==
							Enumere_Ressource_1.EGenreRessource.MesureConservatoire
							? undefined
							: aRecapitulatif.getLibelle().toUpperCase()
						: aRecapitulatif.getLibelle(),
			},
		);
		return lResult ? lResult.ucfirst() : "";
	}
	getImage(aRecap) {
		return Enumere_Ressource_1.EGenreRessourceUtil.getNomImageAbsence(
			aRecap.Genre,
			{
				genreObservation: aRecap.genreObservation,
				genreNature: aRecap.nature ? aRecap.nature.Genre : undefined,
				justifie: aRecap.justifie === undefined ? true : aRecap.justifie,
				estProgrammation:
					aRecap.estProgrammation === undefined
						? false
						: aRecap.estProgrammation,
				estLue: aRecap.estLue === undefined ? true : aRecap.estLue,
			},
		);
	}
	getDureeTotal(aPlaces) {
		return aPlaces > 0
			? ObjetDate_1.GDate.formatDureeEnMillisecondes(
					aPlaces * 1000,
					"%hh%sh%mm",
				)
			: "";
	}
	getDetails(aRecap) {
		aRecap.details = [];
		if (
			aRecap.getGenre() ===
			Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve
		) {
			this.remplirDetailObservation(aRecap);
		} else if (
			aRecap.getGenre() === Enumere_Ressource_1.EGenreRessource.Absence
		) {
			this.remplirDetailAbsence(aRecap);
		} else if (
			aRecap.getGenre() === Enumere_Ressource_1.EGenreRessource.Dispense
		) {
			this.remplirDetailDispense(aRecap);
		} else if (
			aRecap.getGenre() === Enumere_Ressource_1.EGenreRessource.Retard &&
			aRecap.Nombre[0] > 0
		) {
			this.remplirDetailRetard(aRecap);
		} else if (
			aRecap.getGenre() === Enumere_Ressource_1.EGenreRessource.Punition ||
			aRecap.getGenre() === Enumere_Ressource_1.EGenreRessource.Sanction ||
			aRecap.getGenre() === Enumere_Ressource_1.EGenreRessource.Incident
		) {
			this.remplirDetailPunitionSanctionIncident(aRecap);
		} else {
			aRecap.htmlContent = "";
		}
		return aRecap.details;
	}
	valider(aListePJs) {
		const lRequete =
			new ObjetRequeteSaisieVieScolaire_1.ObjetRequeteSaisieVieScolaire(
				this,
				this.actionSurValidation,
			);
		if (aListePJs && aListePJs.count() > 0) {
			lRequete.addUpload({ listeFichiers: aListePJs });
		}
		lRequete.lancerRequete({ listeAbsences: this.donnees.listeAbsences });
	}
	remplirDetailAbsence(aRecap) {
		if (aRecap.Nombre[0] > 0) {
			aRecap.details.push(
				this.utilitaireAbsence
					.getXAbsencesNonJustifiees(aRecap.Nombre[0])
					.ucfirst(),
			);
		}
		const lHeuresManquees = this.getHeuresCoursManquees(aRecap, true);
		if (lHeuresManquees !== "" && !this.etatUtilisateurSco.pourPrimaire()) {
			aRecap.details.push(lHeuresManquees);
		}
	}
	remplirDetailRetard(aRecap) {
		if (aRecap.Nombre[0] > 0) {
			aRecap.details.push(
				this.utilitaireAbsence
					.getDontXRetardNonJustifies(aRecap.Nombre[0])
					.ucfirst(),
			);
		}
	}
	remplirDetailDispense(aRecap) {
		if (aRecap.Nombre[0] > 0) {
			aRecap.details.push(
				this.utilitaireAbsence
					.getXDispensesEnAttente(aRecap.Nombre[0])
					.ucfirst(),
			);
		}
	}
	remplirDetailPunitionSanctionIncident(aRecap) {
		for (const j in aRecap.Nombre) {
			const lLibelle = aRecap.libelles[j];
			const lNombre = aRecap.Nombre[j];
			if (lNombre > 0) {
				aRecap.details.push(lLibelle + " : " + lNombre);
			}
		}
	}
	remplirDetailObservation(aRecap) {
		if (aRecap.Nombre[0] > 0) {
			aRecap.details.push(
				this.utilitaireAbsence.getDontXObservationsNonLu(aRecap.Nombre[0]),
			);
		}
	}
	getHeuresCoursManquees(aElement, aSansSpan) {
		if (!aElement.nbrHeures || aElement.nbrHeures === "0h00") {
			return "";
		}
		let lTrad = "";
		if (parseInt(aElement.nbrHeures.charAt(0)) < 2) {
			lTrad = ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.heureCoursManque",
				[aElement.nbrHeures],
			);
		} else {
			lTrad = ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.heuresCoursManquees",
				[aElement.nbrHeures],
			);
		}
		if (aSansSpan) {
			return lTrad;
		}
		return "<span>" + lTrad + "</span><br>";
	}
}
exports.InterfaceRecapitulatifVS = InterfaceRecapitulatifVS;
(function (InterfaceRecapitulatifVS) {
	let genreEcran;
	(function (genreEcran) {
		genreEcran["listeRecap"] = "listeRecap";
		genreEcran["listeElements"] = "listeElements";
	})(
		(genreEcran =
			InterfaceRecapitulatifVS.genreEcran ||
			(InterfaceRecapitulatifVS.genreEcran = {})),
	);
})(
	InterfaceRecapitulatifVS ||
		(exports.InterfaceRecapitulatifVS = InterfaceRecapitulatifVS = {}),
);
function _getLibelleDeGenre(aElement) {
	let lResult = "";
	switch (aElement.getGenre()) {
		case Enumere_Ressource_1.EGenreRessource.Absence:
			if (aElement.html && aElement.html.avecSaisie) {
				lResult = aElement.estUneCreationParent
					? ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.PrevenirAbsenceParent",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.JustifierAbsence",
						);
			} else {
				lResult = ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.AbsenceDu",
					[aElement.infosDate.dateDebut],
				);
			}
			break;
		case Enumere_Ressource_1.EGenreRessource.Retard:
			if (aElement.html && aElement.html.avecSaisie) {
				lResult = ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.JustifierRetard",
				);
			} else {
				lResult = ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.RetardDu",
					[aElement.infosDate.dateDebut],
				);
			}
			break;
		default:
			break;
	}
	return lResult;
}
function _estAutorise(aRecap, aAutorisations) {
	if (!!aAutorisations) {
		switch (aRecap.getGenre()) {
			case Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve:
				return !!aAutorisations.observation;
			case Enumere_Ressource_1.EGenreRessource.Absence:
				return !!aAutorisations.absence;
			case Enumere_Ressource_1.EGenreRessource.AbsenceRepas:
				return !!aAutorisations.absenceRepas;
			case Enumere_Ressource_1.EGenreRessource.AbsenceInternat:
				return !!aAutorisations.absenceInternat;
			case Enumere_Ressource_1.EGenreRessource.Dispense:
				return !!aAutorisations.dispense;
			case Enumere_Ressource_1.EGenreRessource.Infirmerie:
				return !!aAutorisations.infirmerie;
			case Enumere_Ressource_1.EGenreRessource.Retard:
				return !!aAutorisations.retard;
			case Enumere_Ressource_1.EGenreRessource.Incident:
				return !!aAutorisations.incident;
			case Enumere_Ressource_1.EGenreRessource.Punition:
				return !!aAutorisations.exclusion || !!aAutorisations.punition;
			case Enumere_Ressource_1.EGenreRessource.Sanction:
				return !!aAutorisations.sanction;
			case Enumere_Ressource_1.EGenreRessource.MesureConservatoire:
				return !!aAutorisations.mesureConservatoire;
			case Enumere_Ressource_1.EGenreRessource.Commission:
				return !!aAutorisations.commission;
			case Enumere_Ressource_1.EGenreRessource.RetardInternat:
				return !!aAutorisations.retardInternat;
			default:
				return false;
		}
	} else {
		return false;
	}
}
