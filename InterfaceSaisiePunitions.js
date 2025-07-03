exports.InterfaceSaisiePunitions = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const TypeFusionTitreListe_1 = require("TypeFusionTitreListe");
const ObjetRequeteSaisieListePunitions_1 = require("ObjetRequeteSaisieListePunitions");
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const MethodesTableau_1 = require("MethodesTableau");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const DonneesListe_Simple_1 = require("DonneesListe_Simple");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_Event_1 = require("Enumere_Event");
const Enumere_Saisie_1 = require("Enumere_Saisie");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetCelluleBouton_1 = require("ObjetCelluleBouton");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetSelecteurPJCP_1 = require("ObjetSelecteurPJCP");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const DonneesListe_SaisiePunitions_1 = require("DonneesListe_SaisiePunitions");
const DonneesListe_SelectionDemandeur_1 = require("DonneesListe_SelectionDemandeur");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_EvntMenusDeroulants_1 = require("Enumere_EvntMenusDeroulants");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const ObjetCelluleMultiSelectionMotif_1 = require("ObjetCelluleMultiSelectionMotif");
const ObjetFenetre_SignalementPunition_1 = require("ObjetFenetre_SignalementPunition");
const ObjetSelecteurPJ_1 = require("ObjetSelecteurPJ");
const DonneesListe_SelectionMotifs_1 = require("DonneesListe_SelectionMotifs");
const Type3Etats_1 = require("Type3Etats");
const TypeGenrePunition_1 = require("TypeGenrePunition");
const ObjetCelluleBouton_2 = require("ObjetCelluleBouton");
const ObjetRequeteListePublics_1 = require("ObjetRequeteListePublics");
const DonneesListe_CategoriesMotif_1 = require("DonneesListe_CategoriesMotif");
const TypeGenreReponseInternetActualite_1 = require("TypeGenreReponseInternetActualite");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const ObjetUtilitaireAbsence_1 = require("ObjetUtilitaireAbsence");
const ObjetFenetre_ChoixDatePublicationPunition_1 = require("ObjetFenetre_ChoixDatePublicationPunition");
const ObjetFenetre_EditionActualite_1 = require("ObjetFenetre_EditionActualite");
const ObjetRequeteListesSaisiesPourIncidents_1 = require("ObjetRequeteListesSaisiesPourIncidents");
const ObjetRequeteListePunitions_1 = require("ObjetRequeteListePunitions");
const AccessApp_1 = require("AccessApp");
class InterfaceSaisiePunitions extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.appScoEspace = (0, AccessApp_1.getApp)();
		this.etatUtilScoEspace = this.appScoEspace.getEtatUtilisateur();
		this.paramtresScoEspace = this.appScoEspace.getObjetParametres();
		this.idSuiteDonnee = GUID_1.GUID.getId();
		this.idReponse = GUID_1.GUID.getId();
		this.idSuiteExclusion = GUID_1.GUID.getId();
		this.idSuiteRetenues = GUID_1.GUID.getId();
		this.idSuiteTIG = GUID_1.GUID.getId();
		this.idSuiteDevoir = GUID_1.GUID.getId();
		this.idSuiteAutre = GUID_1.GUID.getId();
		this.idSectionListe = GUID_1.GUID.getId();
		this.idSectionProgrammation = GUID_1.GUID.getId();
		this.idBandeauGauche = this.appScoEspace.idBreadcrumbPerso;
		this.idBandeauDroite = GUID_1.GUID.getId();
		this.idLabelDuree = GUID_1.GUID.getId();
		this.idLabelDureeProgrammation = GUID_1.GUID.getId();
		this.idLabelAccompagnateur = GUID_1.GUID.getId();
		this.idLabelSurveillant = GUID_1.GUID.getId();
		this.idLabelLieuProgra = GUID_1.GUID.getId();
		this.idLabelMotifs = GUID_1.GUID.getId();
		this.idLabelDemandeur = GUID_1.GUID.getId();
		this.listePJ = new ObjetListeElements_1.ObjetListeElements();
		this._autorisations = {
			acces: false,
			saisie: false,
			saisieDemandeur: true,
			avecPublicationPunitions: false,
			avecPublicationDossier: this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.dossierVS.publierDossiersVS,
			),
		};
		$.extend(true, this._autorisations, {
			acces: this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.punition.acces,
			),
			saisie: this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.punition.saisie,
			),
			avecPublicationPunitions:
				this.appScoEspace.droits.get(
					ObjetDroitsPN_1.TypeDroits.punition.avecPublicationPunitions,
				) &&
				!this.appScoEspace.droits.get(
					ObjetDroitsPN_1.TypeDroits.estEnConsultation,
				),
			creerMotifIncidentPunitionSanction:
				this.appScoEspace.droits.get(
					ObjetDroitsPN_1.TypeDroits.creerMotifIncidentPunitionSanction,
				) &&
				!this.appScoEspace.droits.get(
					ObjetDroitsPN_1.TypeDroits.estEnConsultation,
				),
		});
		this.donneesSaisie = {
			tailleTravailAFaire: this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleTravailAFaire,
			),
			tailleCirconstance: this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleCirconstance,
			),
			tailleCommentaire: this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleCommentaire,
			),
		};
		this.nrPunitionSelectionnee = undefined;
	}
	evenementSurMenuDeroulant(aParam) {
		if (
			aParam.genreCombo === Enumere_Ressource_1.EGenreRessource.Eleve &&
			aParam.genreEvenement ===
				Enumere_EvntMenusDeroulants_1.EGenreEvntMenusDeroulants
					.ressourceNonTrouve
		) {
			this.eleveSelectionne = undefined;
			this.punition = null;
			this.nrPunitionSelectionnee = undefined;
			this.etatUtilScoEspace.setNrPunitionSelectionnee(
				this.nrPunitionSelectionnee,
			);
			this.documents = undefined;
			this.listePunitions = new ObjetListeElements_1.ObjetListeElements();
			this._actualiserPunition();
			this.getInstance(this.identPunitions).reset();
			this.getInstance(this.identPunitions).setVisible(false);
		}
	}
	_evntSurCreationMotif(aCol) {
		switch (aCol) {
			case DonneesListe_SelectionMotifs_1.DonneesListe_SelectionMotifs.colonnes
				.incident:
				this.getInstance(this.identFenetreSousCategorieDossier).setDonnees(
					new DonneesListe_CategoriesMotif_1.DonneesListe_CategoriesMotif(
						this.donneesSaisie.listeSousCategorieDossier,
					),
				);
				return true;
			default:
				break;
		}
	}
	construireInstances() {
		this.identTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this._evenementSurDernierMenuDeroulant.bind(this),
			this._initialiserTripleCombo.bind(this),
		);
		if (
			this.identTripleCombo !== null &&
			this.identTripleCombo !== undefined &&
			this.getInstance(this.identTripleCombo) !== null
		) {
			this.IdPremierElement = this.getInstance(
				this.identTripleCombo,
			).getPremierElement();
		}
		this.identPunitions = this.add(
			ObjetListe_1.ObjetListe,
			this._evntListe.bind(this),
			this._initListe.bind(this),
		);
		this.identDemandeur = this.add(
			ObjetCelluleBouton_1.ObjetCelluleBouton,
			this._evntDemandeur.bind(this),
			this._initDemandeur.bind(this),
		);
		this.identDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._evntSurDate.bind(this),
			this._initDate.bind(this),
		);
		this.identHeure = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._evntSurHeure.bind(this),
			this._initHeure.bind(this),
		);
		this.identCMS_Motifs = this.add(
			ObjetCelluleMultiSelectionMotif_1.ObjetCelluleMultiSelectionMotif,
			this._evnCMSMotifs.bind(this),
			this._initCMSMotifs.bind(this),
		);
		this.identSelecteurPJ = this.add(
			ObjetSelecteurPJ_1.ObjetSelecteurPJ,
			this._evntSelecteurPJ.bind(this),
			this._initSelecteurPJ.bind(this),
		);
		this.identSelecteurPJTAF = this.add(
			ObjetSelecteurPJ_1.ObjetSelecteurPJ,
			this._evntSelecteurPJTAF.bind(this),
			this._initSelecteurPJ.bind(this),
		);
		this.identDuree = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._evntSurDuree.bind(this),
			this._initDuree.bind(this, false),
		);
		this.identAccompagnateur = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._evntSurAccompagnateur.bind(this),
			this._initAccompagnateur.bind(this),
		);
		this.identDateDevoir = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._evntSurDateDevoir.bind(this),
			this._initDate.bind(this),
		);
		this.identProgrammations = this.add(
			ObjetListe_1.ObjetListe,
			this._evntListeProg.bind(this),
			this._initialiserListeProgrammationsPunition.bind(this),
		);
		this.identDateProgrammation = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._evntSurDateProgrammation.bind(this),
			this._initDate.bind(this),
		);
		this.identHeureProgrammation = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._evntSurHeureProgrammation.bind(this),
			this._initHeure.bind(this),
		);
		this.identDureeProgrammation = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._evntSurDureeProgrammation.bind(this),
			this._initDuree.bind(this, true),
		);
		this.identLieuProgrammation = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._evntSurLieuProgrammation.bind(this),
			this._initLieu.bind(this),
		);
		this.identDateRealisation = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._evntSurDateRealisation.bind(this),
			this._initDate.bind(this),
		);
		this.identSurveillant = this.add(
			ObjetCelluleBouton_1.ObjetCelluleBouton,
			this._evntSurveillant.bind(this),
			this._initSurveillant.bind(this),
		);
		this.identFenetreDuree = this.addFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			this._evntFenetreDuree.bind(this),
			this._initialiserFenetreDuree,
		);
		this.identFenetreSousCategorieDossier = this.addFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			this._evntFenetreSousCategorieDossier.bind(this),
			this._initFenetreSousCategorieDossier,
		);
		this.identFenetreSignalement = this.addFenetre(
			ObjetFenetre_SignalementPunition_1.ObjetFenetre_SignalementPunition,
			this._evntFenetreSignalement.bind(this),
			this._initFenetreSignalement.bind(this),
		);
		this.identFenetreDemandeur = this.addFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			this._evntFenetreDemandeurSurveillant.bind(this),
			this._initFenetreDemandeur,
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const H = [];
		let lWidth = 620;
		const lHeight = 32;
		H.push('<div style="height:calc(100% - 0.8rem);">');
		H.push('<div class="ly-cols-2">');
		H.push(
			`  <div id="${this.idSectionListe}" class="aside-content cols" style="${ObjetStyle_1.GStyle.composeWidth(lWidth)}">`,
		);
		H.push(
			`    <div class="fix-bloc m-bottom flex-contain" style="height:${lHeight}px;">${this.composeBandeauGauche()}</div>`,
		);
		H.push(
			`    <div class="fluid-bloc full-height" id="${this.getNomInstance(this.identPunitions)}"></div>`,
		);
		H.push("</div>");
		H.push('<div class="main-content cols">');
		H.push(
			`    <div class="fix-bloc m-bottom flex-contain" style="height:${lHeight}px;">${this.composeBandeauDroite()}</div>`,
		);
		H.push(
			`    <div class="fluid-bloc full-height">${this._composeDetail()}</div>`,
		);
		H.push("</div>");
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			titreCirconstances() {
				if (aInstance.punition && aInstance.punition.estLieIncident) {
					return (
						aInstance.punition.titreIncident ||
						ObjetTraduction_1.GTraductions.getValeur("punition.circonstances")
					);
				} else {
					return ObjetTraduction_1.GTraductions.getValeur(
						"punition.circonstances",
					);
				}
			},
			demandeur: {
				getValue() {
					if (aInstance && aInstance.punition) {
						if (aInstance.punition.professeurDemandeur) {
							return aInstance.punition.professeurDemandeur.getLibelle();
						} else if (aInstance.punition.personnelDemandeur) {
							return aInstance.punition.personnelDemandeur.getLibelle();
						}
					}
					return "";
				},
				getDisabled() {
					return true;
				},
			},
			surveillant: {
				getValue() {
					if (
						aInstance &&
						aInstance.punition &&
						aInstance.programmationSelectionne
					) {
						const lProgrammationEffectif =
							aInstance.programmationSelectionne.report &&
							aInstance.programmationSelectionne.report.existe()
								? aInstance.programmationSelectionne.report
								: aInstance.programmationSelectionne;
						if (lProgrammationEffectif.surveillant) {
							return lProgrammationEffectif.surveillant.getLibelle();
						} else {
							return "";
						}
					}
					return "";
				},
				getDisabled() {
					return true;
				},
			},
			circonstance: {
				getValue() {
					return aInstance.punition ? aInstance.punition.circonstance : "";
				},
				setValue(aValue) {
					if (aInstance.punition.circonstance !== aValue) {
						aInstance.punition.circonstance = aValue;
						aInstance.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.setEtatSaisie(true);
					}
				},
				getDisabled() {
					return (
						!aInstance._autorisations.saisie ||
						!aInstance.punition ||
						aInstance.punition.estLieIncident
					);
				},
			},
			taf: {
				getValue() {
					return aInstance.punition
						? aInstance.punition.commentaireDemande
						: "";
				},
				setValue(aValue) {
					if (aInstance.punition.commentaireDemande !== aValue) {
						aInstance.punition.commentaireDemande = aValue;
						aInstance.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.setEtatSaisie(true);
					}
				},
				getDisabled() {
					return !aInstance._autorisations.saisie || !aInstance.punition;
				},
			},
			cbTafPublierDebutSeance: {
				getValue() {
					return (
						aInstance.punition && aInstance.punition.publierTafApresDebutRetenue
					);
				},
				setValue(aValue) {
					if (aInstance.punition) {
						aInstance.punition.publierTafApresDebutRetenue = aValue;
						aInstance.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.setEtatSaisie(true);
					}
				},
				getDisplay() {
					return (
						aInstance.punition &&
						aInstance.punition.nature &&
						aInstance.punition.nature.getGenre() ===
							TypeGenrePunition_1.TypeGenrePunition.GP_Retenues
					);
				},
			},
			getLibelleNature() {
				if (aInstance.punition && aInstance.punition.nature) {
					if (
						aInstance.punition.nature.getGenre() ===
						TypeGenrePunition_1.TypeGenrePunition.GP_ExclusionCours
					) {
						return ObjetTraduction_1.GTraductions.getValeur(
							"punition.exclusionDeCoursDe",
						);
					} else {
						return (
							aInstance.punition.nature.getLibelle() +
							" " +
							ObjetTraduction_1.GTraductions.getValeur("De")
						);
					}
				} else {
					return "";
				}
			},
			getTitreProgrammation() {
				if (
					aInstance.punition &&
					aInstance.punition.programmations &&
					aInstance.punition.programmations.avecAuMoinsUneProgrammation()
				) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"punition.programmeeLe",
					);
				} else {
					return ObjetTraduction_1.GTraductions.getValeur(
						"punition.aProgrammer",
					);
				}
			},
			dateInitial() {
				if (
					aInstance.programmationSelectionne &&
					aInstance.programmationSelectionne.report &&
					aInstance.programmationSelectionne.report.existe()
				) {
					const lResult = aInstance.programmationSelectionne.dateExecution
						? ObjetDate_1.GDate.formatDate(
								aInstance.programmationSelectionne.dateExecution,
								"%JJ/%MM/%AAAA",
							)
						: "...";
					return ObjetTraduction_1.GTraductions.getValeur(
						"punition.initialementPrevu",
						[lResult],
					);
				} else {
					return "";
				}
			},
			commentaire: {
				getValue() {
					return aInstance.programmationSelectionne
						? aInstance.programmationSelectionne.commentaire
						: "";
				},
				setValue(aValue) {
					if (aInstance.programmationSelectionne.commentaire !== aValue) {
						aInstance.programmationSelectionne.commentaire = aValue;
						aInstance.programmationSelectionne.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
						aInstance.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.setEtatSaisie(true);
					}
				},
				getDisabled() {
					return (
						!aInstance._autorisations.saisie ||
						!aInstance.programmationSelectionne
					);
				},
			},
			rbMultiSeances: {
				getValue(aMultiSeances) {
					if (aMultiSeances) {
						return aInstance.punition && aInstance.punition.retenueMultiple;
					} else {
						return aInstance.punition && !aInstance.punition.retenueMultiple;
					}
				},
				setValue(aMultiSeances) {
					if (
						!aMultiSeances &&
						aInstance.punition.programmations.getNbrElementsExistes() > 1
					) {
						aInstance.appScoEspace
							.getMessage()
							.afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"punition.msgChangementMultiple",
								),
							});
					} else {
						aInstance.punition.retenueMultiple = aMultiSeances;
						aInstance.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.setEtatSaisie(true);
						aInstance._actualiserPunition();
					}
				},
				getDisabled() {
					return !aInstance._autorisations.saisie || !aInstance.punition;
				},
			},
			cbReport: {
				getValue() {
					return (
						aInstance.programmationSelectionne &&
						aInstance.programmationSelectionne.report &&
						aInstance.programmationSelectionne.report.existe()
					);
				},
				setValue(aValue) {
					if (aInstance.programmationSelectionne) {
						if (aValue) {
							aInstance.programmationSelectionne.report =
								new ObjetElement_1.ObjetElement("");
							aInstance.programmationSelectionne.report.setEtat(
								Enumere_Etat_1.EGenreEtat.Creation,
							);
							aInstance.programmationSelectionne.setEtat(
								Enumere_Etat_1.EGenreEtat.Modification,
							);
							aInstance.punition.setEtat(
								Enumere_Etat_1.EGenreEtat.Modification,
							);
							aInstance.setEtatSaisie(true);
							aInstance._actualiserProgrammation(
								aInstance.programmationSelectionne,
							);
						} else {
							aInstance.appScoEspace.getMessage().afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"punition.msgAnnulationReport",
								),
								callback: (aAccepte) => {
									if (aAccepte === Enumere_Action_1.EGenreAction.Valider) {
										if (
											aInstance.programmationSelectionne.report &&
											aInstance.programmationSelectionne.report.existe()
										) {
											aInstance.programmationSelectionne.report.setEtat(
												Enumere_Etat_1.EGenreEtat.Suppression,
											);
											aInstance.programmationSelectionne.setEtat(
												Enumere_Etat_1.EGenreEtat.Modification,
											);
											aInstance.punition.setEtat(
												Enumere_Etat_1.EGenreEtat.Modification,
											);
											aInstance.setEtatSaisie(true);
											aInstance._actualiserProgrammation(
												aInstance.programmationSelectionne,
											);
										}
									} else {
										aInstance._actualiserProgrammation(
											aInstance.programmationSelectionne,
										);
									}
								},
							});
						}
					}
				},
				getDisabled() {
					return !aInstance._autorisations.saisie || !aInstance.punition;
				},
			},
			cbRealiseLe: {
				getValue() {
					return (
						aInstance.programmationSelectionne &&
						aInstance.programmationSelectionne.etatProgrammation ===
							Type3Etats_1.Type3Etats.TE_Oui
					);
				},
				setValue(aValue) {
					if (aValue) {
						aInstance.programmationSelectionne.etatProgrammation =
							Type3Etats_1.Type3Etats.TE_Oui;
						aInstance.programmationSelectionne.dateRealisation = !!aInstance
							.programmationSelectionne.dateRealisation
							? aInstance.programmationSelectionne.dateRealisation
							: aInstance.programmationSelectionne.dateExecution
								? aInstance.programmationSelectionne.dateExecution
								: ObjetDate_1.GDate.getDateCourante();
					} else {
						aInstance.programmationSelectionne.etatProgrammation =
							Type3Etats_1.Type3Etats.TE_Inconnu;
					}
					if (
						aInstance.programmationSelectionne.etatProgrammation ===
							Type3Etats_1.Type3Etats.TE_Inconnu &&
						aInstance.programmationSelectionne.dateRealisation
					) {
						aInstance.programmationSelectionne.dateRealisation = undefined;
					}
					aInstance.programmationSelectionne.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
					aInstance.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aInstance.setEtatSaisie(true);
					aInstance._actualiserProgrammation(
						aInstance.programmationSelectionne,
					);
				},
				getDisabled() {
					return !aInstance._autorisations.saisie || !aInstance.punition;
				},
			},
			cbNonRealise: {
				getValue() {
					return (
						aInstance.programmationSelectionne &&
						aInstance.programmationSelectionne.etatProgrammation ===
							Type3Etats_1.Type3Etats.TE_Non
					);
				},
				setValue(aValue) {
					if (aValue) {
						aInstance.programmationSelectionne.etatProgrammation =
							Type3Etats_1.Type3Etats.TE_Non;
					} else {
						aInstance.programmationSelectionne.etatProgrammation =
							Type3Etats_1.Type3Etats.TE_Inconnu;
					}
					if (
						aInstance.programmationSelectionne.etatProgrammation ===
							Type3Etats_1.Type3Etats.TE_Non &&
						aInstance.programmationSelectionne.dateRealisation
					) {
						aInstance.programmationSelectionne.dateRealisation = undefined;
					}
					aInstance.programmationSelectionne.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
					aInstance.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aInstance.setEtatSaisie(true);
					aInstance._actualiserProgrammation(
						aInstance.programmationSelectionne,
					);
				},
				getDisabled() {
					return !aInstance._autorisations.saisie || !aInstance.punition;
				},
			},
			cbPublierElementDossier: {
				getValue: function () {
					return aInstance.punition
						? aInstance.punition.publicationDossier
						: false;
				},
				setValue: function (aValue) {
					aInstance.punition.publicationDossier = aValue;
					aInstance.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aInstance.setEtatSaisie(true);
					aInstance.getInstance(aInstance.identPunitions).actualiser(true);
				},
				getDisabled: function () {
					return !aInstance._autorisations.saisie || !aInstance.punition;
				},
			},
			imageDossier: function () {
				const lClasses = ["icon_folder_close"];
				if (aInstance.punition && aInstance.punition.publicationDossier) {
					lClasses.push("mix-icon_ok");
					lClasses.push("i-green");
				} else {
					lClasses.push("mix-icon_remove");
					lClasses.push("i-red");
				}
				return lClasses.join(" ");
			},
			getClasseCssImagePublication() {
				return ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.getClassesIconePublicationPunition(
					aInstance.punition ? aInstance.punition.datePublication : null,
				);
			},
			getHintImagePublication() {
				const lPunition = aInstance.punition;
				return ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.getHintPublicationPunition(
					lPunition ? lPunition.datePublication : null,
				);
			},
			modelSelecteurDatePublication: {
				getLibelle() {
					const lStrLibelle = [];
					if (aInstance.punition && aInstance.punition.datePublication) {
						lStrLibelle.push(
							ObjetDate_1.GDate.formatDate(
								aInstance.punition.datePublication,
								"%JJ/%MM/%AAAA",
							),
						);
					}
					return lStrLibelle.join("");
				},
				getIcone() {
					return "icon_calendar_empty";
				},
				event() {
					if (aInstance.punition) {
						const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_ChoixDatePublicationPunition_1.ObjetFenetre_ChoixDatePublicationPunition,
							{
								pere: aInstance,
								evenement(aNumeroBouton, aDateChoisie) {
									if (aNumeroBouton) {
										aInstance.setDatePublicationPunition(
											aInstance.punition,
											aDateChoisie,
										);
									}
								},
							},
						);
						lFenetre.setDonnees(aInstance.punition.datePublication);
					}
				},
				getDisabled() {
					return !aInstance.estPunitionPubliee(aInstance.punition);
				},
			},
			cbPublierPunition: {
				getValue() {
					return aInstance.estPunitionPubliee(aInstance.punition);
				},
				setValue(aValue) {
					if (aInstance.punition) {
						let lNouvelleDatePublication = null;
						if (aValue) {
							lNouvelleDatePublication =
								ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.getDatePublicationPunitionParDefaut(
									aInstance.punition.nature,
								);
						}
						aInstance.setDatePublicationPunition(
							aInstance.punition,
							lNouvelleDatePublication,
						);
					}
				},
				getDisabled() {
					return (
						!aInstance._autorisations.avecPublicationPunitions ||
						!aInstance.punition
					);
				},
			},
			boutonInformation: {
				event() {
					aInstance.gestionFenetreEditionInformation();
				},
			},
			messageEnvoye: function () {
				return aInstance.punition && aInstance.punition.messageEnvoye;
			},
			nature: {
				exclusion: function () {
					return (
						aInstance.punition &&
						aInstance.punition.nature &&
						aInstance.punition.nature.getGenre() ===
							TypeGenrePunition_1.TypeGenrePunition.GP_ExclusionCours
					);
				},
				exclusionEtTigEtRetenues: function () {
					return (
						aInstance.punition &&
						aInstance.punition.nature &&
						(aInstance.punition.nature.getGenre() ===
							TypeGenrePunition_1.TypeGenrePunition.GP_ExclusionCours ||
							aInstance.punition.estPlanifiable)
					);
				},
				devoir: function () {
					return (
						aInstance.punition &&
						aInstance.punition.nature &&
						aInstance.punition.nature.getGenre() ===
							TypeGenrePunition_1.TypeGenrePunition.GP_Devoir
					);
				},
				estProgrammable: function () {
					return (
						aInstance.punition &&
						aInstance.punition.estPlanifiable &&
						aInstance.punition.estProgrammable
					);
				},
				peutEtreMultiSeances: function () {
					return aInstance.punition && aInstance.punition.peutEtreMultiSeance;
				},
				avecMultiSeances: function () {
					return aInstance.punition && aInstance.punition.retenueMultiple;
				},
				notAvecMultiSeances: function () {
					return aInstance.punition && !aInstance.punition.retenueMultiple;
				},
				estRealisable: function () {
					return aInstance.punition && aInstance.punition.estProgrammable;
				},
				avecDossier: function () {
					return aInstance.punition && aInstance.punition.avecDossier;
				},
				avecDossierPlus: function () {
					return (
						aInstance.punition &&
						((aInstance._autorisations.avecPublicationDossier &&
							aInstance.punition.avecDossier) ||
							aInstance._autorisations.avecPublicationPunitions)
					);
				},
				notEstLieIncident: function () {
					return aInstance.punition && !aInstance.punition.estLieIncident;
				},
			},
		});
	}
	gestionFenetreEditionInformation() {
		if (this.etatUtilScoEspace.EtatSaisie) {
			this.demandeOuvertureFenetreEditionInformation = true;
			this.valider();
		} else {
			this.ouvrirFenetreEditionInformation();
		}
	}
	ouvrirFenetreEditionInformation() {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_EditionActualite_1.ObjetFenetre_EditionActualite,
			{
				pere: this,
				evenement: function (aGenreBouton, aParam) {
					if (aGenreBouton === 1 && aParam.creation && aParam.punition) {
						aParam.punition.messageEnvoye = true;
					}
				},
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"actualites.creerInfo",
						),
						largeur: 750,
						hauteur: 700,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
					});
				},
			},
		);
		lFenetre.setDonnees({
			donnee: null,
			creation: true,
			genreReponse:
				TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
					.AvecAR,
			forcerAR: this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.forcerARInfos,
			),
			genresPublic: [
				Enumere_Ressource_1.EGenreRessource.Enseignant,
				Enumere_Ressource_1.EGenreRessource.Personnel,
			],
			eleve: this.eleveSelectionne,
			punition: this.punition,
		});
	}
	recupererDonnees() {
		this.setEtatSaisie(false);
		$("#" + this.idReponse.escapeJQ() + "_detail").hide();
		this.nrPunitionSelectionnee =
			this.etatUtilScoEspace.getNrPunitionSelectionnee();
		if (!this._cacheListeSaisie) {
			if (this.eleveSelectionne) {
				this._setTexteBandeau(
					ObjetTraduction_1.GTraductions.getValeur("punition.selectionner"),
				);
			} else {
				this._setTexteBandeau(
					ObjetTraduction_1.GTraductions.getValeur(
						"punition.selectionnerEleve",
					),
				);
			}
			this._cacheListeSaisie = true;
			new ObjetRequeteListesSaisiesPourIncidents_1.ObjetRequeteListesSaisiesPourIncidents(
				this,
				this._actionApresRequeteListesPourSaisiePunitions,
			).lancerRequete({
				avecLieux: true,
				avecSalles: true,
				avecInternat: false,
				avecMotifs: true,
				avecActions: false,
				avecSousCategorieDossier:
					this._autorisations.creerMotifIncidentPunitionSanction,
				avecPunitions: this._autorisations.saisie,
				avecSanctions: false,
				avecProtagonistes: false,
			});
		} else {
			this._faireRequeteDonneesEleve();
		}
	}
	afficherPage() {
		this.recupererDonnees();
	}
	valider() {
		this.etatUtilScoEspace.setNrPunitionSelectionnee(
			this.nrPunitionSelectionnee,
		);
		const lObjetSaisie = {
			punitions: this.listePunitions,
			motifs: this.donneesSaisie.motifs,
		};
		this.actionValidationPunition = true;
		new ObjetRequeteSaisieListePunitions_1.ObjetRequeteSaisieListePunitions(
			this,
			this.actionSurValidation,
		)
			.addUpload({ listeFichiers: this.listePJ })
			.lancerRequete(lObjetSaisie);
	}
	setVisibilite() {
		$("#" + this.idReponse.escapeJQ() + "_detail").show();
		if (this.punition.retenueMultiple) {
			$("#" + this.idSectionProgrammation.escapeJQ()).show();
		} else {
			$("#" + this.idSectionProgrammation.escapeJQ()).hide();
		}
	}
	surResizeProgrammation() {
		const lTaille = this.punition && this.punition.retenueMultiple ? 92 : 0;
		$(".reTailleProgrammable")
			.css("width", "100%")
			.css("width", "-=" + lTaille + "px");
		this.$refreshSelf().then(() => {
			this.getInstance(this.identProgrammations).resize();
		});
	}
	surResizeInterface() {
		super.surResizeInterface();
		this.surResizeProgrammation();
	}
	_setTexteBandeau(aMessage) {
		ObjetHtml_1.GHtml.setHtml(this.idBandeauDroite + "_Texte", aMessage);
	}
	_initialiserTripleCombo(aInstance) {
		aInstance.setParametres([
			Enumere_Ressource_1.EGenreRessource.Classe,
			Enumere_Ressource_1.EGenreRessource.Eleve,
		]);
		aInstance.setEvenementMenusDeroulants(this.evenementSurMenuDeroulant);
	}
	_initListe(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_SaisiePunitions_1.DonneesListe_SaisiePunitions.colonnes
				.date,
			titre: ObjetTraduction_1.GTraductions.getValeur("punition.titre.Date"),
			taille: 55,
		});
		lColonnes.push({
			id: DonneesListe_SaisiePunitions_1.DonneesListe_SaisiePunitions.colonnes
				.nature,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"punition.titre.Punition",
			),
			taille: 160,
		});
		lColonnes.push({
			id: DonneesListe_SaisiePunitions_1.DonneesListe_SaisiePunitions.colonnes
				.motif,
			titre: ObjetTraduction_1.GTraductions.getValeur("punition.titre.Motif"),
			taille: "100%",
		});
		lColonnes.push({
			id: DonneesListe_SaisiePunitions_1.DonneesListe_SaisiePunitions.colonnes
				.etat,
			titre: ObjetTraduction_1.GTraductions.getValeur("punition.titre.Etat"),
			hint: ObjetTraduction_1.GTraductions.getValeur("punition.hint.Etat"),
			taille: 20,
		});
		if (this._autorisations.avecPublicationDossier) {
			lColonnes.push({
				id: DonneesListe_SaisiePunitions_1.DonneesListe_SaisiePunitions.colonnes
					.dossier,
				titre: {
					libelleHtml: `<i class="icon_folder_close mix-icon_ok i-green" aria-label="${ObjetTraduction_1.GTraductions.getValeur("liste.DossierObligatoire")}" role="img"></i>`,
					title: ObjetTraduction_1.GTraductions.getValeur(
						"punition.hint.Dossier",
					),
				},
				taille: 20,
			});
		}
		if (this._autorisations.avecPublicationPunitions) {
			lColonnes.push({
				id: DonneesListe_SaisiePunitions_1.DonneesListe_SaisiePunitions.colonnes
					.publication,
				titre: {
					libelleHtml:
						'<i class="icon_info_sondage_publier mix-icon_ok i-green" role="presentation"></i>',
					title: ObjetTraduction_1.GTraductions.getValeur(
						"punition.hint.Publication",
					),
				},
				taille: 20,
			});
		}
		const lOptionsListe = {
			colonnes: lColonnes,
			numeroColonneTriDefaut: {
				id: DonneesListe_SaisiePunitions_1.DonneesListe_SaisiePunitions.colonnes
					.date,
				genre: Enumere_TriElement_1.EGenreTriElement.Decroissant,
			},
		};
		if (this._autorisations.saisie) {
			$.extend(lOptionsListe, {
				titreCreation:
					ObjetTraduction_1.GTraductions.getValeur("punition.creation"),
				avecLigneCreation: true,
			});
		}
		aInstance.setOptionsListe(lOptionsListe);
		const lThis = this;
		aInstance.controleur.inputTime = {
			getValue: function (aNumero, aEtat) {
				const lNumero =
					aEtat === Enumere_Etat_1.EGenreEtat.Creation
						? parseInt(aNumero)
						: aNumero;
				const lElement = this.instance
					.getListeArticles()
					.getElementParNumero(lNumero);
				return lElement
					? ObjetDate_1.GDate.formatDate(lElement.dateheure, "%hh:%mm")
					: "";
			},
			setValue: function (aNumero, aEtat, aValue, aHeures, aMinutes) {
				const lNumero =
					aEtat === Enumere_Etat_1.EGenreEtat.Creation
						? parseInt(aNumero)
						: aNumero;
				const lElement = this.instance
					.getListeArticles()
					.getElementParNumero(lNumero);
				const lDate = new Date(
					lElement.dateheure.getFullYear(),
					lElement.dateheure.getMonth(),
					lElement.dateheure.getDate(),
					aHeures,
					aMinutes,
				);
				lElement.dateheure = lDate;
				lElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				lThis.setEtatSaisie(true);
			},
		};
	}
	_initDemandeur(aInstance) {
		aInstance.setOptionsObjetCelluleBouton({
			estSaisissable: false,
			avecZoneSaisie: false,
			genreBouton: ObjetCelluleBouton_2.EGenreBoutonCellule.Aucun,
			largeur: 280,
			hauteur: 17,
			ariaDescribedBy: this.idLabelDemandeur,
		});
		aInstance.setActif(false);
	}
	_initSurveillant(aInstance) {
		aInstance.setOptionsObjetCelluleBouton({
			estSaisissable: false,
			avecZoneSaisie: false,
			genreBouton: ObjetCelluleBouton_2.EGenreBoutonCellule.Aucun,
			largeur: 180,
			hauteur: 17,
			ariaLabelledBy: this.idLabelSurveillant,
		});
	}
	_initDate(aInstance) {
		aInstance.setOptionsObjetCelluleDate({ classeCSSTexte: " " });
		aInstance.setParametresFenetre(
			this.paramtresScoEspace.PremierLundi,
			this.paramtresScoEspace.PremiereDate,
			this.paramtresScoEspace.DerniereDate,
		);
		aInstance.setControleNavigation(false);
	}
	_initHeure(aInstance) {
		aInstance.setOptionsObjetSaisie({
			mode: Enumere_Saisie_1.EGenreSaisie.Combo,
			longueur: 80,
			hauteur: 17,
			classTexte: "",
			deroulerListeSeulementSiPlusieursElements: false,
			initAutoSelectionAvecUnElement: false,
			labelWAICellule:
				ObjetTraduction_1.GTraductions.getValeur("punition.heure"),
		});
	}
	_initCMSMotifs(aInstance) {
		aInstance.setOptions({
			largeurBouton: 457,
			classTexte: "",
			ariaLabelledBy: this.idLabelMotifs,
		});
	}
	_initDuree(aEstDureeProgrammation, aInstance) {
		aInstance.setOptionsObjetSaisie({
			mode: Enumere_Saisie_1.EGenreSaisie.Combo,
			longueur: 60,
			hauteur: 17,
			classTexte: "",
			deroulerListeSeulementSiPlusieursElements: false,
			initAutoSelectionAvecUnElement: false,
			ariaLabelledBy: aEstDureeProgrammation
				? this.idLabelDureeProgrammation
				: this.idLabelDuree,
		});
	}
	_initLieu(aInstance) {
		const lOptions = {
			mode: Enumere_Saisie_1.EGenreSaisie.Combo,
			celluleAvecTexteHtml: true,
			longueur: 160,
			classTexte: "",
			ariaLabelledBy: this.idLabelLieuProgra,
			hauteur: 17,
			deroulerListeSeulementSiPlusieursElements: false,
			initAutoSelectionAvecUnElement: false,
			getClassElement: function (aParams) {
				return aParams.element.getNumero() === 0 ||
					aParams.element.getNumero() === -1
					? "titre-liste"
					: "";
			},
		};
		aInstance.setOptionsObjetSaisie(lOptions);
	}
	_initAccompagnateur(aInstance) {
		aInstance.setOptionsObjetSaisie({
			mode: Enumere_Saisie_1.EGenreSaisie.Combo,
			longueur: 130,
			hauteur: 17,
			classTexte: "",
			ariaLabelledBy: this.idLabelAccompagnateur,
			deroulerListeSeulementSiPlusieursElements: false,
			initAutoSelectionAvecUnElement: false,
		});
	}
	_initialiserFenetreDuree(aInstance) {
		aInstance.setOptionsFenetre({
			modale: true,
			titre: ObjetTraduction_1.GTraductions.getValeur("punition.SelectDuree"),
			largeur: 200,
			hauteur: 300,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		aInstance.paramsListe = { tailles: ["100%"], editable: false };
	}
	_initFenetreSousCategorieDossier(aInstance) {
		aInstance.setOptionsFenetre({
			modale: true,
			titre: ObjetTraduction_1.GTraductions.getValeur("GenreDIncident"),
			largeur: 300,
			hauteurMin: 160,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		aInstance.paramsListe = { tailles: ["100%"], editable: false };
	}
	_initFenetreSignalement(aInstance) {
		const lAvecCreationMotifs = this.appScoEspace.droits.get(
			ObjetDroitsPN_1.TypeDroits.creerMotifIncidentPunitionSanction,
		);
		const lParam = {
			titres: [
				"",
				ObjetTraduction_1.GTraductions.getValeur("fenetreMotifs.motif"),
				TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
				ObjetTraduction_1.GTraductions.getValeur("fenetreMotifs.genre"),
			],
			tailles: ["20", "100%", "15", "120"],
			avecLigneCreation: !!lAvecCreationMotifs,
			creations: lAvecCreationMotifs
				? [
						DonneesListe_SelectionMotifs_1.DonneesListe_SelectionMotifs.colonnes
							.motif,
						DonneesListe_SelectionMotifs_1.DonneesListe_SelectionMotifs.colonnes
							.incident,
					]
				: null,
			callbckCreation: this._evntSurCreationMotif.bind(this),
			editable: true,
			optionsListe: { colonnesSansBordureDroit: [false, true, false, false] },
		};
		aInstance.setOptionsFenetre({
			modale: true,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"punition.titreFenetreCreation",
			),
			largeur: 650,
			hauteur: 700,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			modeActivationBtnValider: aInstance.modeActivationBtnValider.autre,
		});
		aInstance.paramsListe = lParam;
	}
	_initFenetreDemandeur(aInstance) {
		aInstance.setOptionsFenetre({
			modale: true,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"punition.selectionDemandeur",
			),
			largeur: 300,
			hauteur: 500,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			avecVerificationLigneSelectionne: true,
		});
		aInstance.paramsListe = {
			editable: false,
			optionsListe: {
				ariaLabel: ObjetTraduction_1.GTraductions.getValeur(
					"punition.selectionDemandeur",
				),
				skin: ObjetListe_1.ObjetListe.skin.flatDesign,
				boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher }],
			},
		};
	}
	_initSelecteurPJ(aInstance) {
		aInstance.setOptions({
			genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
			genreRessourcePJ: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
			interdireDoublonsLibelle: false,
			libelleSelecteur: ObjetTraduction_1.GTraductions.getValeur(
				"AjouterDesPiecesJointes",
			),
			avecBoutonSupp: true,
			avecCmdAjoutNouvelle: false,
			avecMenuSuppressionPJ: false,
			avecAjoutExistante: true,
			ouvrirFenetreChoixTypesAjout: false,
			maxFiles: 0,
			maxSize: this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
			),
		});
	}
	_initialiserListeProgrammationsPunition(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			titre: ObjetTraduction_1.GTraductions.getValeur("punition.seances"),
			taille: 69,
		});
		const lOptions = { colonnes: lColonnes };
		if (this._autorisations.saisie) {
			$.extend(lOptions, { listeCreations: 1, avecLigneCreation: true });
		}
		aInstance.setOptionsListe(lOptions);
	}
	_evenementSurDernierMenuDeroulant() {
		if (!!this.punition) {
			this.punition = null;
			this.nrPunitionSelectionnee = undefined;
			this.etatUtilScoEspace.setNrPunitionSelectionnee(
				this.nrPunitionSelectionnee,
			);
			this._actualiserPunition();
		}
		this.eleveSelectionne = this.etatUtilScoEspace.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Eleve,
		);
		this._setTexteBandeau(
			ObjetTraduction_1.GTraductions.getValeur("punition.selectionner"),
		);
		this._faireRequeteDonneesEleve();
	}
	_faireRequeteDonneesEleve() {
		new ObjetRequeteListePunitions_1.ObjetRequeteListePunitions(this)
			.lancerRequete({ eleve: this.eleveSelectionne })
			.then((aReponse) => {
				this._actionApresRequeteListePunitions(aReponse);
			});
	}
	_evntListeProg(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this._actualiserProgrammation(
					this.punition.programmations.get(aParametres.ligne),
				);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				this.programmationEstEnCreation = false;
				this.getInstance(this.identFenetreDuree).setDonnees(
					new DonneesListe_Simple_1.DonneesListe_Simple(
						this.donneesSaisie.durees,
					),
				);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this.programmationEstEnCreation = true;
				this.getInstance(this.identFenetreDuree).setDonnees(
					new DonneesListe_Simple_1.DonneesListe_Simple(
						this.donneesSaisie.durees,
					),
				);
				return Enumere_EvenementListe_1.EGenreEvenementListe.Creation;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresSuppression:
				this.programmationSelectionne.setEtat(
					Enumere_Etat_1.EGenreEtat.Suppression,
				);
				this.programmationSelectionne = undefined;
				this._actualiserPunition();
				this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				break;
			default:
				break;
		}
	}
	_evntListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this._evntSelection(aParametres.ligne);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this.punitionEnCreation = this._creerNouvellePunition(
					this.eleveSelectionne,
				);
				if (!!this.donneesSaisie.motifs) {
					this.donneesSaisie.motifs.parcourir((D) => {
						if (!!D.cmsActif) {
							D.cmsActif = false;
						}
					});
				}
				this.getInstance(this.identFenetreSignalement).setDonnees({
					listeNaturePunitions: this.donneesSaisie.punitions,
					objetDonneesListeMotifs:
						new DonneesListe_SelectionMotifs_1.DonneesListe_SelectionMotifs(
							this.donneesSaisie.motifs,
							{
								avecCreation: this.appScoEspace.droits.get(
									ObjetDroitsPN_1.TypeDroits.creerMotifIncidentPunitionSanction,
								),
							},
						),
					motifs: this.donneesSaisie.motifs,
					punition: this.punitionEnCreation,
					avecValidation: false,
					listePunitions: MethodesObjet_1.MethodesObjet.dupliquer(
						this.listePunitions,
					),
					listePJ: this.listePJ,
					listeSousCategorieDossier: MethodesObjet_1.MethodesObjet.dupliquer(
						this.donneesSaisie.listeSousCategorieDossier,
					),
				});
				return Enumere_EvenementListe_1.EGenreEvenementListe.Creation;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				if (!this.punition) {
					break;
				}
				switch (aParametres.idColonne) {
					case DonneesListe_SaisiePunitions_1.DonneesListe_SaisiePunitions
						.colonnes.motif:
						this.getInstance(this.identCMS_Motifs).surCellule(
							Enumere_Event_1.EEvent.SurClick,
						);
						break;
					case DonneesListe_SaisiePunitions_1.DonneesListe_SaisiePunitions
						.colonnes.publication: {
						let lNouvelleDatePublication = null;
						if (!aParametres.article.datePublication) {
							lNouvelleDatePublication = ObjetDate_1.GDate.getDateCourante();
						}
						aParametres.article.datePublication = lNouvelleDatePublication;
						const lListe = this.getInstance(this.identPunitions);
						lListe.actualiser(true);
						break;
					}
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				this._evntSelection(aParametres.ligne);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresSuppression:
				this.punition = null;
				this.nrPunitionSelectionnee = null;
				this.etatUtilScoEspace.setNrPunitionSelectionnee();
				this._cacheListeSaisie = false;
				this._actualiserPunition();
				break;
		}
	}
	_evntSelection(aLigne) {
		if (
			!this.punition ||
			!this.nrPunitionSelectionnee ||
			this.nrPunitionSelectionnee !== this.listePunitions.getNumero(aLigne) ||
			this.actionValidationPunition
		) {
			this.actionValidationPunition = false;
			this.punition = this.listePunitions.get(aLigne);
			this.nrPunitionSelectionnee = this.punition.getNumero();
			this.etatUtilScoEspace.setNrPunitionSelectionnee(
				this.nrPunitionSelectionnee,
			);
			this.punition.programmations.setTri([
				ObjetTri_1.ObjetTri.init((D) => {
					const lProgrammationEffectif =
						D.report && D.report.existe() ? D.report : D;
					if (lProgrammationEffectif.dateExecution) {
						return 0;
					} else {
						return 1;
					}
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					const lProgrammationEffectif =
						D.report && D.report.existe() ? D.report : D;
					return lProgrammationEffectif.dateExecution;
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					const lProgrammationEffectif =
						D.report && D.report.existe() ? D.report : D;
					if (lProgrammationEffectif.placeExecution) {
						return 0;
					} else {
						return 1;
					}
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					const lProgrammationEffectif =
						D.report && D.report.existe() ? D.report : D;
					return lProgrammationEffectif.placeExecution;
				}),
				ObjetTri_1.ObjetTri.init("Libelle"),
			]);
			this.punition.programmations.trier();
			this._actualiserPunition();
		}
	}
	_evntDemandeur(aGenreEvent) {
		if (
			(aGenreEvent === Enumere_Event_1.EEvent.SurKeyUp &&
				GNavigateur.isToucheSelection()) ||
			aGenreEvent === Enumere_Event_1.EEvent.SurMouseDown
		) {
			let lIndice = -1;
			this._resetPublic(lIndice);
			this.estSelectionSurveillant = false;
			this.getInstance(this.identFenetreDemandeur).setOptionsFenetre({
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"punition.selectionDemandeur",
				),
			});
			this.getInstance(this.identFenetreDemandeur).setDonnees(
				new DonneesListe_SelectionDemandeur_1.DonneesListe_SelectionDemandeur_Fd(
					this.donneesSaisie.listePublic,
				),
				true,
			);
		}
	}
	_evntSurveillant(aGenreEvent) {
		if (
			(aGenreEvent === Enumere_Event_1.EEvent.SurKeyUp &&
				GNavigateur.isToucheSelection()) ||
			aGenreEvent === Enumere_Event_1.EEvent.SurMouseDown
		) {
			let lIndice = -1;
			this._resetPublic(lIndice);
			this.estSelectionSurveillant = true;
			this.getInstance(this.identFenetreDemandeur).setOptionsFenetre({
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"punition.selectionSurveillant",
				),
			});
			this.getInstance(this.identFenetreDemandeur).setDonnees(
				new DonneesListe_SelectionDemandeur_1.DonneesListe_SelectionDemandeur_Fd(
					this.donneesSaisie.listePublic,
				),
				true,
			);
		}
	}
	_resetPublic(aIndiceSelection) {
		const lIndice = aIndiceSelection;
		this.donneesSaisie.listePublic.parcourir((aPublic, aIndice) => {
			if (aPublic.estUnDeploiement) {
				aPublic.estDeploye = false;
			}
			if (aIndice === lIndice) {
				aPublic.pere.estDeploye = true;
			}
		});
	}
	_evntSurDate(aDate) {
		let lDateCalcul = new Date(
			this.punition.dateDemande.getFullYear(),
			this.punition.dateDemande.getMonth(),
			this.punition.dateDemande.getDate(),
		);
		let lPlace = ObjetDate_1.GDate.dateEnPlaceAnnuelle(lDateCalcul);
		let lPlaceJour = this.punition.placeDemande - lPlace;
		if (lPlaceJour < 0) {
			lPlaceJour = 0;
		}
		const lDate = new Date(
			aDate.getFullYear(),
			aDate.getMonth(),
			aDate.getDate(),
			this.punition.dateDemande.getHours(),
			this.punition.dateDemande.getMinutes(),
		);
		if (
			this.paramtresScoEspace.JoursFeries.getValeur(
				ObjetDate_1.GDate.getNbrJoursEntreDeuxDates(
					IE.Cycles.dateDebutPremierCycle(),
					aDate,
				) + 1,
			)
		) {
			this.appScoEspace
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"punition.estUnJourFerie",
						[ObjetDate_1.GDate.formatDate(aDate, "%JJ/%MM/%AAAA")],
					),
				});
			this._actualiserPunition();
		} else if (!ObjetDate_1.GDate.estUnJourOuvre(aDate)) {
			this.appScoEspace
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"punition.pasUnJourOuvre",
						[ObjetDate_1.GDate.formatDate(aDate, "%JJ/%MM/%AAAA")],
					),
				});
			this._actualiserPunition();
		} else if (
			!ObjetDate_1.GDate.estDateEgale(lDate, this.punition.dateDemande)
		) {
			this.punition.dateDemande = lDate;
			lDateCalcul = new Date(
				this.punition.dateDemande.getFullYear(),
				this.punition.dateDemande.getMonth(),
				this.punition.dateDemande.getDate(),
			);
			lPlace = ObjetDate_1.GDate.dateEnPlaceAnnuelle(lDateCalcul);
			this.punition.placeDemande = lPlace + lPlaceJour;
			this._actualiserDatesSaisissable();
			this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.setEtatSaisie(true);
			this.getInstance(this.identPunitions).actualiser(true);
		}
	}
	_evntSurDateDevoir(aDate) {
		if (
			this.paramtresScoEspace.JoursFeries.getValeur(
				ObjetDate_1.GDate.getNbrJoursEntreDeuxDates(
					IE.Cycles.dateDebutPremierCycle(),
					aDate,
				) + 1,
			)
		) {
			this.appScoEspace
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"punition.estUnJourFerie",
						[ObjetDate_1.GDate.formatDate(aDate, "%JJ/%MM/%AAAA")],
					),
				});
			this._actualiserPunition();
		} else if (!ObjetDate_1.GDate.estUnJourOuvre(aDate)) {
			this.appScoEspace
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"punition.pasUnJourOuvre",
						[ObjetDate_1.GDate.formatDate(aDate, "%JJ/%MM/%AAAA")],
					),
				});
			this._actualiserPunition();
		} else if (
			this.punition &&
			this.punition.nature.getGenre() ===
				TypeGenrePunition_1.TypeGenrePunition.GP_Devoir
		) {
			let lProg;
			if (this.punition.programmations) {
				lProg = this.punition.programmations.getPremierElement();
			}
			if (!lProg) {
				lProg = new ObjetElement_1.ObjetElement("");
			}
			if (
				!lProg.dateExecution ||
				!ObjetDate_1.GDate.estDateEgale(aDate, lProg.dateExecution)
			) {
				lProg.dateExecution = aDate;
				this._actualiserDatesSaisissable();
				lProg.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.setEtatSaisie(true);
			}
		}
	}
	_evntSurDateProgrammation(aDate) {
		if (
			this.paramtresScoEspace.JoursFeries.getValeur(
				ObjetDate_1.GDate.getNbrJoursEntreDeuxDates(
					IE.Cycles.dateDebutPremierCycle(),
					aDate,
				) + 1,
			)
		) {
			this.appScoEspace
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"punition.estUnJourFerie",
						[ObjetDate_1.GDate.formatDate(aDate, "%JJ/%MM/%AAAA")],
					),
				});
			this._actualiserProgrammation(this.programmationSelectionne);
		} else if (!ObjetDate_1.GDate.estUnJourOuvre(aDate)) {
			this.appScoEspace.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				message: ObjetTraduction_1.GTraductions.getValeur(
					"punition.saisieSurUnJourNonOuvre",
					[ObjetDate_1.GDate.formatDate(aDate, "%JJ/%MM/%AAAA")],
				),
				callback: (aAccepte) => {
					if (aAccepte === Enumere_Action_1.EGenreAction.Valider) {
						this._affecterDateProgrammation(aDate);
					} else {
						this._actualiserProgrammation(this.programmationSelectionne);
					}
				},
			});
		} else if (this.punition && this.programmationSelectionne) {
			this._affecterDateProgrammation(aDate);
		}
	}
	_affecterDateProgrammation(aDate) {
		let lProg;
		if (
			this.programmationSelectionne.report &&
			this.programmationSelectionne.report.existe()
		) {
			lProg = this.programmationSelectionne.report;
		} else {
			lProg = this.programmationSelectionne;
		}
		if (
			!lProg.dateExecution ||
			!ObjetDate_1.GDate.estDateEgale(aDate, lProg.dateExecution)
		) {
			if (
				!this._existePunitionProgrammationChevauchant({
					numero: this.programmationSelectionne.getNumero(),
					date: aDate,
					place: lProg.placeExecution,
					duree: this.programmationSelectionne.duree,
				})
			) {
				lProg.dateExecution = aDate;
				this._actualiserDatesSaisissable();
				lProg.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.programmationSelectionne.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.setEtatSaisie(true);
			} else {
				this._afficherMessageExisteAutresProgrammations();
			}
		}
	}
	_evntSurDateRealisation(aDate) {
		if (this.punition && this.programmationSelectionne) {
			this.programmationSelectionne.dateRealisation = aDate;
			this._actualiserDatesSaisissable();
			this.programmationSelectionne.setEtat(
				Enumere_Etat_1.EGenreEtat.Modification,
			);
			this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.setEtatSaisie(true);
		}
	}
	_evntSurHeureProgrammation(aParams) {
		if (
			aParams.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection &&
			this.punition &&
			this.programmationSelectionne
		) {
			const lPlace = aParams.element.getGenre();
			let lProg;
			if (
				this.programmationSelectionne.report &&
				this.programmationSelectionne.report.existe()
			) {
				lProg = this.programmationSelectionne.report;
			} else {
				lProg = this.programmationSelectionne;
			}
			if (!lProg.placeExecution || lPlace !== lProg.place) {
				if (
					!this._existePunitionProgrammationChevauchant({
						numero: this.programmationSelectionne.getNumero(),
						date: lProg.dateExecution,
						place: lPlace,
						duree: this.programmationSelectionne.duree,
					})
				) {
					lProg.place = lPlace;
					lProg.placeExecution = lPlace;
					lProg.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					this.programmationSelectionne.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
					this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					this.setEtatSaisie(true);
				} else {
					this._afficherMessageExisteAutresProgrammations();
				}
			}
		}
	}
	_afficherMessageExisteAutresProgrammations() {
		this.appScoEspace
			.getMessage()
			.afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				message: ObjetTraduction_1.GTraductions.getValeur(
					"punition.message.autresProgs",
				),
			});
		this._actualiserProgrammation(this.programmationSelectionne);
	}
	_existePunitionProgrammationChevauchant(aParams) {
		let lResult = false;
		aParams.nbrPlaces = aParams.duree
			? ObjetDate_1.GDate.minutesEnNombrePlaces(aParams.duree)
			: 0;
		aParams.placeFin = aParams.place + aParams.nbrPlaces;
		for (
			let i = 0;
			i < this.listePunitions.count() &&
			!lResult &&
			aParams.nbrPlaces > 0 &&
			aParams.place !== undefined;
			i++
		) {
			const lPunition = this.listePunitions.get(i);
			if (lPunition.existe() && lPunition.estPlanifiable) {
				for (let j = 0; j < lPunition.programmations.count() && !lResult; j++) {
					const lProg = lPunition.programmations.get(j);
					if (lProg.existe() && lProg.getNumero() !== aParams.numero) {
						let lDate = lProg.dateExecution;
						let lPlace = lProg.placeExecution;
						const lDuree = lProg.duree;
						const lNbrPlaces = lDuree
							? ObjetDate_1.GDate.minutesEnNombrePlaces(lDuree)
							: 0;
						if (lProg.report && lProg.report.existe()) {
							lDate = lProg.report.dateExecution;
							lPlace = lProg.report.placeExecution;
						}
						const lPlaceFin = lPlace + lNbrPlaces;
						if (
							ObjetDate_1.GDate.estDateEgale(lDate, aParams.date) &&
							lNbrPlaces > 0
						) {
							if (
								aParams.place !== undefined &&
								aParams.place !== null &&
								aParams.place > -1 &&
								lPlace !== undefined &&
								lPlace !== null &&
								lPlace > -1
							) {
								if (
									(aParams.place >= lPlace && aParams.place < lPlaceFin) ||
									(aParams.placeFin > lPlace &&
										aParams.placeFin <= lPlaceFin) ||
									(lPlace >= aParams.place && lPlace < aParams.placeFin) ||
									(lPlaceFin > aParams.place && lPlaceFin <= aParams.placeFin)
								) {
									lResult = true;
								}
							}
						}
					}
				}
			}
		}
		return lResult;
	}
	_evntSurDureeProgrammation(aParams) {
		if (
			aParams.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection &&
			this.punition &&
			this.programmationSelectionne &&
			this.programmationSelectionne.duree !== aParams.element.getGenre()
		) {
			let lProg;
			if (
				this.programmationSelectionne.report &&
				this.programmationSelectionne.report.existe()
			) {
				lProg = this.programmationSelectionne.report;
			} else {
				lProg = this.programmationSelectionne;
			}
			if (
				!this._existePunitionProgrammationChevauchant({
					numero: this.programmationSelectionne.getNumero(),
					date: lProg.dateExecution,
					place: lProg.placeExecution,
					duree: aParams.element.getGenre(),
				})
			) {
				this.programmationSelectionne.duree = aParams.element.getGenre();
				this.programmationSelectionne.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.setEtatSaisie(true);
			} else {
				this._afficherMessageExisteAutresProgrammations();
			}
		}
	}
	_evntSurLieuProgrammation(aParams) {
		if (
			aParams.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection &&
			this.punition &&
			this.programmationSelectionne
		) {
			let lProg;
			if (
				this.programmationSelectionne.report &&
				this.programmationSelectionne.report.existe()
			) {
				lProg = this.programmationSelectionne.report;
			} else {
				lProg = this.programmationSelectionne;
			}
			if (
				!lProg.lieu ||
				lProg.lieu.getNumero() !== aParams.element.getNumero()
			) {
				lProg.lieu = aParams.element;
				lProg.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.programmationSelectionne.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.setEtatSaisie(true);
			}
		}
	}
	_evntSurHeure(aParams) {
		if (
			aParams.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection &&
			this.punition
		) {
			this.punition.place = aParams.element.getGenre();
			this.punition.horsCours = aParams.element.getGenre() === -1;
			if (aParams.element.getGenre() !== -1) {
				const lPlace = ObjetDate_1.GDate.dateEnPlaceAnnuelle(
					this.punition.dateDemande,
				);
				this.punition.placeDemande = lPlace + aParams.element.getGenre();
			} else {
				this.punition.placeDemande = 0;
			}
			this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.setEtatSaisie(true);
		}
	}
	_evnCMSMotifs(aNumeroBouton, aListeDonnees, aListeTot) {
		if (aNumeroBouton === 1) {
			const lArrInitial = this.punition.motifs.getTableauNumeros();
			const lArrNew = aListeDonnees.getTableauNumeros();
			if (
				!MethodesTableau_1.MethodesTableau.inclus(lArrInitial, lArrNew) ||
				!MethodesTableau_1.MethodesTableau.inclus(lArrNew, lArrInitial)
			) {
				this.punition.motifs = aListeDonnees;
				const lAvecMotifDossierObligatoire =
					this.punition.motifs.getIndiceElementParFiltre((aElement) => {
						return !!aElement.dossierObligatoire;
					}) > -1;
				if (!this.punition.avecDossier && lAvecMotifDossierObligatoire) {
					this.punition.avecDossier = true;
					this.punition.publicationDossier =
						this.punition.motifs.getIndiceElementParFiltre((aElement) => {
							return aElement.publication;
						}) > -1;
				}
				if (!this.estPunitionPubliee(this.punition)) {
					let lPublication = false;
					for (let i = 0; i < this.punition.motifs.count(); i++) {
						const lMotif = this.punition.motifs.get(i);
						if (lMotif.existe() && lMotif.publication) {
							lPublication = true;
							if (lPublication) {
								break;
							}
						}
					}
					if (lPublication) {
						this.punition.datePublication = ObjetDate_1.GDate.getDateCourante();
					}
				}
				this.punition.avecModifMotif = true;
				this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.setEtatSaisie(true);
				this.getInstance(this.identPunitions).actualiser(true);
			}
			if (!!aListeTot) {
				this.donneesSaisie.motifs = aListeTot;
				this.donneesSaisie.motifs.parcourir((aElement) => {
					aElement.cmsActif = false;
				});
			}
		}
	}
	_evntSurDuree(aParams) {
		if (
			aParams.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection &&
			this.punition &&
			this.punition.duree !== aParams.element.getGenre()
		) {
			this.punition.duree = aParams.element.getGenre();
			this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.setEtatSaisie(true);
		}
	}
	_evntSurAccompagnateur(aParams) {
		if (
			aParams.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection &&
			this.punition
		) {
			if (
				!this.punition.eleveAccompagnateur ||
				aParams.element.getNumero() !==
					this.punition.eleveAccompagnateur.getNumero()
			) {
				if (aParams.element.getGenre() !== -1) {
					this.punition.eleveAccompagnateur = aParams.element;
				} else {
					this.punition.eleveAccompagnateur = undefined;
				}
				this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.setEtatSaisie(true);
			}
		}
	}
	_evntFenetreSignalement(aGenreBouton, aSelection, aAvecChangementListe) {
		if (aGenreBouton === 1) {
			this._cacheListeSaisie = true;
			this.recupererDonnees();
		} else {
			if (!!this.nrPunitionSelectionnee) {
				const lIndiceEff = this.listePunitions.getIndiceParNumeroEtGenre(
					this.nrPunitionSelectionnee,
				);
				if (lIndiceEff > -1) {
					this.punition = this.listePunitions.get(lIndiceEff);
				}
				this._evntSelection(lIndiceEff);
			}
		}
	}
	_evntFenetreDuree(aGenreBouton, aSelection) {
		if (aGenreBouton === 1 && this.programmationSelectionne) {
			const lElement = this.donneesSaisie.durees.get(aSelection);
			if (this.programmationEstEnCreation) {
				this.programmationSelectionne = new ObjetElement_1.ObjetElement(
					lElement.getLibelle(),
				);
				this.punition.programmations.addElement(this.programmationSelectionne);
				this.punition.programmations.setTri([
					ObjetTri_1.ObjetTri.init((D) => {
						const lProgrammationEffectif =
							D.report && D.report.existe() ? D.report : D;
						if (lProgrammationEffectif.dateExecution) {
							return 0;
						} else {
							return 1;
						}
					}),
					ObjetTri_1.ObjetTri.init((D) => {
						const lProgrammationEffectif =
							D.report && D.report.existe() ? D.report : D;
						return lProgrammationEffectif.dateExecution;
					}),
					ObjetTri_1.ObjetTri.init((D) => {
						const lProgrammationEffectif =
							D.report && D.report.existe() ? D.report : D;
						if (lProgrammationEffectif.placeExecution) {
							return 0;
						} else {
							return 1;
						}
					}),
					ObjetTri_1.ObjetTri.init((D) => {
						const lProgrammationEffectif =
							D.report && D.report.existe() ? D.report : D;
						return lProgrammationEffectif.placeExecution;
					}),
					ObjetTri_1.ObjetTri.init("Libelle"),
				]);
				this.punition.programmations.trier();
			}
			this.programmationSelectionne.duree = lElement.getGenre();
			this.programmationSelectionne.etatProgrammation =
				Type3Etats_1.Type3Etats.TE_Inconnu;
			this.programmationSelectionne.setLibelle(lElement.getLibelle());
			this.programmationSelectionne.setEtat(
				Enumere_Etat_1.EGenreEtat.Modification,
			);
			this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.setEtatSaisie(true);
			if (this.programmationEstEnCreation) {
				this.getInstance(this.identProgrammations).actualiser();
				const lIndice = this.punition.programmations.getIndiceParElement(
					this.programmationSelectionne,
				);
				this.programmationEstEnCreation = false;
				this.getInstance(this.identProgrammations).selectionnerLigne({
					ligne: lIndice,
					selectionner: true,
					avecEvenement: true,
					avecScroll: true,
				});
			} else {
				this.getInstance(this.identProgrammations).actualiser(true);
			}
		}
	}
	_evntFenetreSousCategorieDossier(aGenreBouton, aSelection) {
		const lFenetre = this.getInstance(this.identFenetreSignalement);
		if (aGenreBouton === 1) {
			const lIncident =
				this.donneesSaisie.listeSousCategorieDossier.get(aSelection);
			lFenetre.getListe().ajouterElementCreation(lIncident);
		} else {
			lFenetre.getListe().annulerCreation();
		}
	}
	_evntFenetreDemandeurSurveillant(aGenreBouton, aSelection) {
		if (this.estSelectionSurveillant) {
			this._evntFenetreSurveillant(aGenreBouton, aSelection);
		} else {
			this._evntFenetreDemandeur(aGenreBouton, aSelection);
		}
	}
	_evntFenetreSurveillant(aGenreBouton, aSelection) {
		if (aGenreBouton === 1 && this.punition) {
			const lElm = this.donneesSaisie.listePublic.get(aSelection);
			const lProgrammationEffectif =
				this.programmationSelectionne.report &&
				this.programmationSelectionne.report.existe()
					? this.programmationSelectionne.report
					: this.programmationSelectionne;
			if (!!lElm) {
				if (lElm.estAucun) {
					lProgrammationEffectif.surveillant = null;
				} else if (!lElm.estUnDeploiement) {
					lProgrammationEffectif.surveillant = lElm;
				}
				lProgrammationEffectif.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.programmationSelectionne.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.setEtatSaisie(true);
			}
			let lLibelle = "";
			if (lProgrammationEffectif.surveillant) {
				lLibelle = lProgrammationEffectif.surveillant.getLibelle();
			}
			this.getInstance(this.identSurveillant).setLibelle(lLibelle);
		}
	}
	_evntFenetreDemandeur(aGenreBouton, aSelection) {
		if (aGenreBouton === 1 && this.punition) {
			const lElm = this.donneesSaisie.listePublic.get(aSelection);
			if (!!lElm) {
				if (lElm.estAucun) {
					this.punition.professeurDemandeur = null;
					this.punition.personnelDemandeur = null;
				} else if (!lElm.estUnDeploiement) {
					if (lElm.Genre === Enumere_Ressource_1.EGenreRessource.Enseignant) {
						this.punition.professeurDemandeur = lElm;
						this.punition.personnelDemandeur = null;
					} else if (
						lElm.Genre === Enumere_Ressource_1.EGenreRessource.Personnel
					) {
						this.punition.personnelDemandeur = lElm;
						this.punition.professeurDemandeur = null;
					}
				}
				this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.setEtatSaisie(true);
			}
			let lLibelle = "";
			if (this.punition.professeurDemandeur) {
				lLibelle = this.punition.professeurDemandeur.getLibelle();
			} else if (this.punition.personnelDemandeur) {
				lLibelle = this.punition.personnelDemandeur.getLibelle();
			}
			this.getInstance(this.identDemandeur).setLibelle(lLibelle);
		}
	}
	_evntSelecteurPJ(aParam) {
		switch (aParam.evnt) {
			case ObjetSelecteurPJCP_1.ObjetSelecteurPJCP.genreEvnt.selectionPJ:
				if (this.punition) {
					this.listePJ.addElement(aParam.fichier);
					this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					IE.log.addLog("_evntSelecteurPJ.selectionPJ");
					this.setEtatSaisie(true);
				}
				break;
			case ObjetSelecteurPJCP_1.ObjetSelecteurPJCP.genreEvnt.suppressionPJ:
				if (this.punition) {
					this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					IE.log.addLog("_evntSelecteurPJ.suppressionPJ");
					this.setEtatSaisie(true);
				}
				break;
			default:
				break;
		}
	}
	_evntSelecteurPJTAF(aParam) {
		switch (aParam.evnt) {
			case ObjetSelecteurPJCP_1.ObjetSelecteurPJCP.genreEvnt.selectionPJ:
				if (this.punition) {
					this.listePJ.addElement(aParam.fichier);
					this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					IE.log.addLog("_evntSelecteurPJ.selectionPJ");
					this.setEtatSaisie(true);
				}
				break;
			case ObjetSelecteurPJCP_1.ObjetSelecteurPJCP.genreEvnt.suppressionPJ:
				if (this.punition) {
					this.punition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					IE.log.addLog("_evntSelecteurPJ.suppressionPJ");
					this.setEtatSaisie(true);
				}
				break;
			default:
				break;
		}
	}
	composeBandeauGauche() {
		const T = [];
		T.push(`<div class="div-header fluid-bloc">`);
		T.push(
			`<h1 tabindex="0" class="titre-onglet" id="${this.idBandeauGauche}">${this.etatUtilScoEspace.getLibelleOnglet()}</h1>`,
		);
		T.push(
			`<div class="flex-contain flex-center flex-gap" id="${this.getInstance(this.identTripleCombo).getNom()}"></div>`,
		);
		T.push(`</div>`);
		return T.join("");
	}
	composeBandeauDroite() {
		const T = [];
		T.push(`<div class="div-header fluid-bloc">`);
		T.push(
			`<h2 id="${this.idBandeauDroite}">\n  <span id="${this.idBandeauDroite}_Texte"></span></h2>`,
		);
		T.push(`</div>`);
		return T.join("");
	}
	_composeTitreSection(aMessage, aAvecMargeHaut, aIETexte, aIEDisplay) {
		const T = [];
		const lIEDisplay = aIEDisplay ? 'ie-display="' + aIEDisplay + '" ' : "";
		T.push(
			`<div ${lIEDisplay} class="as-header-bullet m-right-l ${aAvecMargeHaut ? ` m-top-xl` : ``}">`,
		);
		T.push(
			`  <h3 ${!!aIETexte ? `ie-texte="${aIETexte}"` : ``}>${aMessage}</h3>`,
		);
		T.push(`</div>`);
		return T.join("");
	}
	_composeDetail() {
		const H = [];
		H.push('<div id="', this.idReponse, '_detail">');
		H.push('<div class="p-top-l" id="', this.idReponse, '_fils1">');
		H.push(
			this._composeTitreSection(
				ObjetTraduction_1.GTraductions.getValeur("punition.circonstances"),
				false,
				"titreCirconstances",
			),
		);
		H.push(
			'<div ie-display="nature.notEstLieIncident" class="flex-contain p-top-l">',
		);
		H.push(
			'<div class="m-right">',
			'<label id="',
			this.idLabelDemandeur,
			'" class="m-bottom">',
			ObjetTraduction_1.GTraductions.getValeur("punition.titre.Demandeur"),
			"</label>",
			'<div id="',
			this.getNomInstance(this.identDemandeur),
			'"></div>',
			"</div>",
		);
		H.push(
			'<div class="m-right">',
			'<label class="m-bottom">',
			ObjetTraduction_1.GTraductions.getValeur("punition.titre.Date"),
			"</label>",
			'<div id="',
			this.getNomInstance(this.identDate),
			'"></div>',
			"</div>",
		);
		H.push(
			'<div class="m-right">',
			'<label class="m-bottom">',
			ObjetTraduction_1.GTraductions.getValeur("punition.heure"),
			"</label>",
			'<div id="',
			this.getNomInstance(this.identHeure),
			'"></div>',
			"</div>",
		);
		H.push("</div>");
		H.push(
			'<div class="p-top-l">',
			'<label id="',
			this.idLabelMotifs,
			'" class="m-bottom">',
			ObjetTraduction_1.GTraductions.getValeur("punition.motifs"),
			"</label>",
			'<div id="',
			this.getNomInstance(this.identCMS_Motifs),
			'"></div>',
			"</div>",
		);
		const lIdDetails = GUID_1.GUID.getId();
		H.push(
			'<div class="p-top-l">',
			'<label for="',
			lIdDetails,
			'" class="bloc-contain m-bottom">',
			ObjetTraduction_1.GTraductions.getValeur("punition.detailsCirconstances"),
			"</label>",
			'<ie-textareamax id="',
			lIdDetails,
			'" ie-model="circonstance" maxlength="',
			this.donneesSaisie.tailleCirconstance,
			'" class="TextePunitionCirconstance" style="',
			ObjetStyle_1.GStyle.composeWidth(700),
			ObjetStyle_1.GStyle.composeHeight(120),
			'"></ie-textareamax>',
			"</div>",
		);
		H.push(
			'<div class="pj-global-conteneur no-line p-y-l" id="',
			this.getNomInstance(this.identSelecteurPJ),
			'"></div>',
		);
		H.push(
			this._composeTitreSection(
				ObjetTraduction_1.GTraductions.getValeur("punition.suiteDonnee"),
				true,
			),
		);
		H.push(this._composeSuitePunition());
		H.push(this._composeSuiteDevoir());
		const lIdTAF = GUID_1.GUID.getId();
		H.push(
			'<div class="p-top-l">',
			'<label for="',
			lIdTAF,
			'" class="bloc-contain m-bottom">',
			ObjetTraduction_1.GTraductions.getValeur("punition.titre.taf"),
			"</label>",
			'<ie-textareamax id="',
			lIdTAF,
			'" ie-model="taf" maxlength="',
			this.donneesSaisie.tailleTravailAFaire,
			'" class="TextePunitionTAF" style="',
			ObjetStyle_1.GStyle.composeWidth(700),
			ObjetStyle_1.GStyle.composeHeight(120),
			'"></ie-textareamax>',
			"</div>",
		);
		H.push(
			'<div class="pj-global-conteneur p-y-l no-line full-width" id="',
			this.getNomInstance(this.identSelecteurPJTAF),
			'"></div>',
		);
		H.push(
			'<div class="p-bottom p-left-l">',
			'<ie-checkbox class="m-top" ie-model="cbTafPublierDebutSeance" ie-display="cbTafPublierDebutSeance.getDisplay">',
			ObjetTraduction_1.GTraductions.getValeur(
				"punition.publierUniquementDebutRetenue",
			),
			"</ie-checkbox></div>",
		);
		H.push("</div>");
		H.push(
			'<div id="',
			this.idReponse,
			'_fils2" class="flex-contain p-top-l full-width">',
		);
		H.push('<div class="flex-contain full-width">');
		H.push(
			'<div id="',
			this.idSectionProgrammation,
			'" class="fix-bloc flex-contain cols" style="',
			ObjetStyle_1.GStyle.composeWidth(92),
			'">',
			'<div id="',
			this.getNomInstance(this.identProgrammations),
			'" class="fluid-bloc"></div>',
			"</div>",
		);
		H.push(
			'<div id="',
			this.idSectionProgrammation,
			'_detail" class="fluid-bloc reTailleProgrammable">',
		);
		H.push(
			'<div class="flex-contain cols fluid-bloc" ie-display="nature.estProgrammable">',
		);
		H.push(
			'<div class="as-header-bullet m-right-l">',
			'<h3 ie-texte="getTitreProgrammation" class="p-right-l"></h3>',
			'<div class="m-right-l" ie-display="nature.peutEtreMultiSeances">',
			'<ie-radio ie-model="rbMultiSeances(',
			false,
			')">',
			ObjetTraduction_1.GTraductions.getValeur("punition.uneSeance"),
			"</ie-radio>",
			"</div>",
			'<div class="m-right-l" ie-display="nature.peutEtreMultiSeances">',
			'<ie-radio ie-model="rbMultiSeances(',
			true,
			')">',
			ObjetTraduction_1.GTraductions.getValeur("punition.plusieursSeances"),
			"</ie-radio>",
			"</div>",
			"</div>",
		);
		H.push('<div class="flex-contain cols">');
		H.push('<div class="flex-contain flex-gap-l m-bottom-l">');
		H.push(
			'<div class="flex-contain cols">',
			'<label class="m-bottom">',
			ObjetTraduction_1.GTraductions.getValeur("punition.titre.Date"),
			"</label>",
			'<div id="',
			this.getNomInstance(this.identDateProgrammation),
			'"></div>',
			"</div>",
		);
		H.push(
			'<div class="flex-contain cols">',
			'<label class="m-bottom">',
			ObjetTraduction_1.GTraductions.getValeur("punition.heure"),
			"</label>",
			'<div id="',
			this.getNomInstance(this.identHeureProgrammation),
			'"></div>',
			"</div>",
		);
		H.push(
			'<ie-checkbox class="self-end m-bottom" ie-model="cbReport">',
			ObjetTraduction_1.GTraductions.getValeur("punition.titre.Reportee"),
			"</ie-checkbox>",
		);
		H.push(
			'<label ie-texte="dateInitial" class="self-end m-bottom p-bottom-s"></label>',
		);
		H.push("</div>");
		H.push('<div class="flex-contain flex-gap-l m-bottom-l">');
		H.push(
			'<div class="flex-contain cols">',
			'<label id="',
			this.idLabelSurveillant,
			'" class="m-bottom">',
			ObjetTraduction_1.GTraductions.getValeur("punition.surveillant"),
			"</label>",
			'<div id="',
			this.getNomInstance(this.identSurveillant),
			'"></div>',
			"</div>",
		);
		H.push(
			'<div ie-display="nature.notAvecMultiSeances" class="flex-contain cols">',
			'<label id="',
			this.idLabelDureeProgrammation,
			'" class="m-bottom">',
			ObjetTraduction_1.GTraductions.getValeur("punition.duree"),
			"</label>",
			'<div id="',
			this.getNomInstance(this.identDureeProgrammation),
			'"></div>',
			"</div>",
		);
		H.push(
			'<div class="flex-contain cols">',
			'<label id="',
			this.idLabelLieuProgra,
			'" class="m-bottom">',
			ObjetTraduction_1.GTraductions.getValeur("punition.salle"),
			"</label>",
			'<div id="',
			this.getNomInstance(this.identLieuProgrammation),
			'"></div>',
			"</div>",
		);
		H.push("</div>");
		H.push("</div>");
		H.push("</div>");
		H.push(
			'<div ie-display="nature.estRealisable" class="flex-contain cols flex-gap-l m-bottom">',
		);
		H.push(
			this._composeTitreSection(
				ObjetTraduction_1.GTraductions.getValeur("punition.realisation"),
				true,
			),
		);
		H.push('<div class="flex-contain flex-gap-l">');
		H.push(
			'<ie-checkbox ie-model="cbRealiseLe">',
			ObjetTraduction_1.GTraductions.getValeur("punition.titre.RealiseLe"),
			"</ie-checkbox>",
		);
		H.push(
			'<div id="',
			this.getNomInstance(this.identDateRealisation),
			'"></div>',
		);
		H.push(
			'<ie-checkbox ie-model="cbNonRealise">',
			ObjetTraduction_1.GTraductions.getValeur("punition.nonRealise"),
			"</ie-checkbox>",
		);
		H.push("</div>");
		H.push(
			'<div class="flex-contain cols flex-gap">',
			'<label for="txtComment">',
			ObjetTraduction_1.GTraductions.getValeur("punition.commentaire"),
			"</label>",
			'<ie-textareamax ie-model="commentaire" id="txtComment" maxlength="',
			this.donneesSaisie.tailleCommentaire,
			'" class="TextePunitionCommentaire" style="',
			ObjetStyle_1.GStyle.composeWidth(700),
			ObjetStyle_1.GStyle.composeHeight(60),
			'"></ie-textareamax>',
			"</div>",
		);
		H.push("</div>");
		H.push("</div>");
		H.push("</div>");
		H.push("</div>");
		const lAvecPublicationDossier =
			this.etatUtilScoEspace.GenreEspace ===
			Enumere_Espace_1.EGenreEspace.Etablissement
				? this._autorisations.avecPublicationPunitions
				: this._autorisations.avecPublicationDossier;
		if (
			lAvecPublicationDossier ||
			this._autorisations.avecPublicationPunitions
		) {
			H.push(
				this._composeTitreSection(
					ObjetTraduction_1.GTraductions.getValeur(
						"punition.prevenirResponsables",
					),
					true,
					null,
					"nature.avecDossierPlus",
				),
			);
			if (lAvecPublicationDossier) {
				H.push(
					'<div ie-display="nature.avecDossier" class="flex-contain flex-center p-y-l flex-gap-l" style="min-width: 435px;">',
					'<ie-checkbox ie-model="cbPublierElementDossier">',
					ObjetTraduction_1.GTraductions.getValeur(
						"punition.publierElementPunitionDossier",
					),
					"</ie-checkbox>",
					'<i ie-class="imageDossier" role="presentation"></i>',
					"</div>",
				);
			}
			if (this._autorisations.avecPublicationPunitions) {
				H.push('<div class="p-y-l" style="min-width: 435px;">');
				H.push(
					'<div class="flex-contain flex-gap-l">',
					'<ie-checkbox ie-model="cbPublierPunition">',
					ObjetTraduction_1.GTraductions.getValeur("punition.publierPunition"),
					"</ie-checkbox>",
					'<i ie-class="getClasseCssImagePublication" role="img" ie-title="getHintImagePublication"></i>',
					"</div>",
				);
				H.push(
					'<div class="p-top-l flex-contain flex-center flex-gap-l">',
					'<span class="fix-bloc">',
					ObjetTraduction_1.GTraductions.getValeur("Le_Maj"),
					"</span>",
					`<div style="width:10rem;"><ie-btnselecteur ie-model="modelSelecteurDatePublication" aria-label="${ObjetTraduction_1.GTraductions.getValeur("Le_Maj")}"></ie-btnselecteur></div>`,
					"</div>",
				);
				H.push("</div>");
			}
		}
		if (
			this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.actualite.avecSaisieActualite,
			)
		) {
			H.push(
				this._composeTitreSection(
					ObjetTraduction_1.GTraductions.getValeur(
						"punition.diffuserInformation",
					),
					true,
				),
			);
			H.push(
				IE.jsx.str(
					"div",
					{ class: "flex-contain flex-center p-y-l" },
					IE.jsx.str(
						"label",
						{ class: "m-right" },
						ObjetTraduction_1.GTraductions.getValeur(
							"punition.informerEquipePedagogique",
						),
					),
					UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnDiffuserInformation(
						"boutonInformation",
						ObjetTraduction_1.GTraductions.getValeur(
							"punition.informerEquipePedagogique",
						),
					),
					IE.jsx.str(
						"div",
						{
							class: "flex-contain flex-center p-x-l",
							"ie-display": "messageEnvoye",
						},
						IE.jsx.str(
							"label",
							{ class: "m-right" },
							ObjetTraduction_1.GTraductions.getValeur(
								"punition.messageEnvoye",
							),
						),
						IE.jsx.str("div", { class: "Image_DestinataireCourrier" }),
					),
				),
			);
		}
		H.push("</div>");
		return H.join("");
	}
	_composeSuitePunition() {
		const H = [];
		H.push(
			'<div ie-display="nature.exclusionEtTigEtRetenues" class="flex-contain flex-center flex-gap-l p-top">',
		);
		H.push(
			'<label id="',
			this.idLabelDuree,
			'" ie-texte="getLibelleNature">',
			"</label>",
			'<div id="',
			this.getNomInstance(this.identDuree),
			'"></div>',
		);
		H.push(
			'<div ie-display="nature.exclusion" class="flex-contain flex-center flex-gap-l m-left-l">',
			'<label id="',
			this.idLabelAccompagnateur,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("punition.accompagnateur"),
			"</label>",
			'<div id="',
			this.getNomInstance(this.identAccompagnateur),
			'"></div>',
			"</div>",
		);
		H.push("</div>");
		return H.join("");
	}
	_composeSuiteDevoir() {
		const H = [];
		H.push('<div ie-display="nature.devoir" class="NoWrap">');
		H.push(
			'<div class="InlineBlock AlignementMilieuVertical PetitEspaceDroit"><label>',
			ObjetTraduction_1.GTraductions.getValeur(
				"punition.devoirSuplementaireARendre",
			),
			"</label></div>",
			'<div class="InlineBlock AlignementMilieuVertical GrandEspaceDroit" id="',
			this.getNomInstance(this.identDateDevoir),
			'"></div>',
		);
		H.push("</div>");
		return H.join("");
	}
	_actionApresRequeteListesPourSaisiePunitions(aJSON) {
		if (aJSON.motifs) {
			this.donneesSaisie.motifs = aJSON.motifs;
		}
		if (aJSON.lieux) {
			this.donneesSaisie.lieux = aJSON.lieux;
		}
		this.donneesSaisie.lieux.insererElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("Aucune"),
				0,
				-1,
			),
			0,
		);
		const lLieu = new ObjetElement_1.ObjetElement(
			"Lieu",
			0,
			Enumere_Ressource_1.EGenreRessource.LieuDossier,
		);
		lLieu.estCumul = true;
		lLieu.AvecSelection = false;
		lLieu.Position = 0;
		const lSalle = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur("Salle"),
			0,
			Enumere_Ressource_1.EGenreRessource.Salle,
		);
		lSalle.estCumul = true;
		lSalle.AvecSelection = false;
		lSalle.Position = 0;
		this.donneesSaisie.lieux.insererElement(lLieu, 1);
		this.donneesSaisie.lieux.insererElement(lSalle, 2);
		this.donneesSaisie.lieux.parcourir((aLieu) => {
			if (aLieu.existeNumero()) {
				if (
					aLieu.getGenre() === Enumere_Ressource_1.EGenreRessource.LieuDossier
				) {
					aLieu.Pere = lLieu;
				}
				if (aLieu.getGenre() === Enumere_Ressource_1.EGenreRessource.Salle) {
					aLieu.Pere = lSalle;
				}
			}
		});
		this.donneesSaisie.lieux.setTri([
			ObjetTri_1.ObjetTri.init("Genre"),
			ObjetTri_1.ObjetTri.init((D) => {
				return D.existeNumero();
			}),
			ObjetTri_1.ObjetTri.init("Position"),
		]);
		this.donneesSaisie.lieux.trier();
		if (aJSON.punitions) {
			this.donneesSaisie.punitions = aJSON.punitions;
		}
		if (aJSON.listeSousCategorieDossier) {
			this.donneesSaisie.listeSousCategorieDossier =
				aJSON.listeSousCategorieDossier;
		}
		this.donneesSaisie.listePublic =
			new ObjetListeElements_1.ObjetListeElements();
		new ObjetRequeteListePublics_1.ObjetRequeteListePublics(
			this,
			this._evntListePublicApresRequete.bind(this),
		).lancerRequete({
			genres: [
				Enumere_Ressource_1.EGenreRessource.Enseignant,
				Enumere_Ressource_1.EGenreRessource.Personnel,
			],
			sansFiltreSurEleve: true,
			avecFonctionPersonnel: true,
		});
	}
	_evntListePublicApresRequete(aDonnees) {
		this.donneesSaisie.listePublic = MethodesObjet_1.MethodesObjet.dupliquer(
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
		this.donneesSaisie.listePublic.parcourir((aPublic) => {
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
			this.donneesSaisie.listePublic.addElement(lElement);
		}
		if (lAvecIndefini) {
			this.donneesSaisie.listePublic.addElement(lPereIndefini);
		}
		if (lAvecProf) {
			this.donneesSaisie.listePublic.addElement(lPereProf);
		}
		const lElmAucun = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur("punition.selection.Aucun"),
			null,
			0,
			0,
		);
		lElmAucun.estAucun = true;
		this.donneesSaisie.listePublic.addElement(lElmAucun);
		this.donneesSaisie.listePublic.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				return D.estAucun || D.estUnDeploiement ? D.Genre : D.pere.Genre;
			}),
			ObjetTri_1.ObjetTri.init("Position"),
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		this.donneesSaisie.listePublic.trier();
	}
	_actionApresRequeteListePunitions(aJSON) {
		this.documents = aJSON.documents;
		this.listePunitions = aJSON.listePunitions;
		this.listePunitions.parcourir((aPunition) => {
			if (aPunition.horsCours) {
				aPunition.place = -1;
			} else {
				aPunition.place =
					aPunition.placeDemande % this.paramtresScoEspace.PlacesParJour;
			}
			if (aPunition.programmations) {
				aPunition.programmations.avecAuMoinsUneProgrammation = function () {
					for (let I = 0; I < this.count(); I++) {
						const lElement = this.get(I);
						if (
							lElement.existe() &&
							lElement.dateExecution &&
							ObjetDate_1.GDate.estDateValide(lElement.dateExecution)
						) {
							return true;
						}
					}
					return false;
				};
				aPunition.programmations.avecMultiSeances = function () {
					return this.getNbrElementsExistes() > 1;
				};
				aPunition.programmations.parcourir((aProgrammation) => {
					if (
						aProgrammation.placeExecution !== undefined ||
						aProgrammation.placeExecution !== null
					) {
						aProgrammation.place =
							aProgrammation.placeExecution %
							this.paramtresScoEspace.PlacesParJour;
					} else {
						aProgrammation.place = undefined;
					}
				});
			}
			if (!aPunition.documentsTAF) {
				aPunition.documentsTAF = new ObjetListeElements_1.ObjetListeElements();
			}
			if (!aPunition.documents) {
				aPunition.documents = new ObjetListeElements_1.ObjetListeElements();
			}
		});
		this.listePunitions.setTri([
			ObjetTri_1.ObjetTri.init(
				"dateDemande",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
		]);
		this.listePunitions.trier();
		const lIndiceEff = this.listePunitions.getIndiceParNumeroEtGenre(
			this.nrPunitionSelectionnee,
		);
		if (!!this.nrPunitionSelectionnee && lIndiceEff > -1) {
			this.punition = this.listePunitions.get(lIndiceEff);
		}
		this.getInstance(this.identPunitions).setVisible(true);
		this.getInstance(this.identPunitions).setDonnees(
			new DonneesListe_SaisiePunitions_1.DonneesListe_SaisiePunitions(
				this.listePunitions,
				this._autorisations,
			),
			lIndiceEff,
		);
		if (this.punition) {
			this._actualiserPunition();
			if (this.demandeOuvertureFenetreEditionInformation) {
				this.demandeOuvertureFenetreEditionInformation = false;
				this.ouvrirFenetreEditionInformation();
			}
		}
	}
	_creerNouvellePunition(aEleveSelectionne) {
		const lPunition = new ObjetElement_1.ObjetElement(
			"",
			null,
			Enumere_Ressource_1.EGenreRessource.Punition,
		);
		lPunition.dateDemande = ObjetDate_1.GDate.getDateCourante();
		lPunition.horsCours = false;
		lPunition.place = -1;
		const lDemandeur = this.etatUtilScoEspace.getUtilisateur();
		if (
			lDemandeur.getGenre() === Enumere_Ressource_1.EGenreRessource.Enseignant
		) {
			lPunition.professeurDemandeur = lDemandeur;
			lPunition.personnelDemandeur = undefined;
		} else if (
			lDemandeur.getGenre() === Enumere_Ressource_1.EGenreRessource.Personnel
		) {
			lPunition.professeurDemandeur = undefined;
			lPunition.personnelDemandeur = lDemandeur;
		}
		lPunition.motifs = new ObjetListeElements_1.ObjetListeElements();
		lPunition.programmations = new ObjetListeElements_1.ObjetListeElements();
		lPunition.documentsTAF = new ObjetListeElements_1.ObjetListeElements();
		lPunition.documents = new ObjetListeElements_1.ObjetListeElements();
		lPunition.eleve = aEleveSelectionne;
		return lPunition;
	}
	estPunitionPubliee(aPunition) {
		return !!(aPunition && aPunition.datePublication);
	}
	setDatePublicationPunition(aPunition, aDatePublication) {
		aPunition.datePublication = aDatePublication;
		aPunition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.setEtatSaisie(true);
		this.getInstance(this.identPunitions).actualiser(true);
	}
	_actualiserProgrammation(aProgrammationSelectionne) {
		const lAvecSaisie = !!(this._autorisations.saisie && this.punition);
		let lProgrammationEffectif;
		if (aProgrammationSelectionne) {
			this.programmationSelectionne = aProgrammationSelectionne;
		} else if (this.punition.programmations.avecAuMoinsUneProgrammation()) {
			this.programmationSelectionne =
				this.punition.programmations.getPremierElement();
		} else {
			this.programmationSelectionne = new ObjetElement_1.ObjetElement("");
		}
		lProgrammationEffectif =
			this.programmationSelectionne.report &&
			this.programmationSelectionne.report.existe()
				? this.programmationSelectionne.report
				: this.programmationSelectionne;
		this.getInstance(this.identDateProgrammation).setActif(lAvecSaisie);
		this.getInstance(this.identDateProgrammation).setDonnees(
			lProgrammationEffectif.dateExecution,
		);
		const lListe = this.paramtresScoEspace.LibellesHeures.getListeElements();
		const lIndice = lListe.getIndiceParNumeroEtGenre(
			null,
			lProgrammationEffectif.placeExecution,
		);
		this.getInstance(this.identHeureProgrammation).reset();
		this.getInstance(this.identHeureProgrammation).setActif(lAvecSaisie);
		this.getInstance(this.identHeureProgrammation).setDonnees(lListe);
		if (lIndice > -1) {
			this.getInstance(this.identHeureProgrammation).initSelection(lIndice);
		}
		let lLibelle = "";
		if (this.punition && this.programmationSelectionne) {
			lProgrammationEffectif =
				this.programmationSelectionne.report &&
				this.programmationSelectionne.report.existe()
					? this.programmationSelectionne.report
					: this.programmationSelectionne;
			if (lProgrammationEffectif.surveillant) {
				lLibelle = lProgrammationEffectif.surveillant.getLibelle();
			}
		}
		this.getInstance(this.identSurveillant).setLibelle(lLibelle);
		this.getInstance(this.identSurveillant).setActif(lAvecSaisie);
		let lIndiceDureeProgrammation = -1;
		if (this.donneesSaisie.durees && this.programmationSelectionne.duree) {
			lIndiceDureeProgrammation =
				this.donneesSaisie.durees.getIndiceExisteParNumeroEtGenre(
					null,
					this.programmationSelectionne.duree,
				);
		}
		this.getInstance(this.identDureeProgrammation).reset();
		this.getInstance(this.identDureeProgrammation).setActif(lAvecSaisie);
		this.getInstance(this.identDureeProgrammation).setDonnees(
			this.donneesSaisie.durees,
		);
		if (lIndiceDureeProgrammation > -1) {
			this.getInstance(this.identDureeProgrammation).initSelection(
				lIndiceDureeProgrammation,
			);
		}
		let lIndiceLieuProgrammation = -1;
		if (this.donneesSaisie.lieux && lProgrammationEffectif.lieu) {
			lIndiceLieuProgrammation =
				this.donneesSaisie.lieux.getIndiceExisteParNumeroEtGenre(
					lProgrammationEffectif.lieu.getNumero(),
					lProgrammationEffectif.lieu.getGenre(),
				);
		}
		this.getInstance(this.identLieuProgrammation).reset();
		this.getInstance(this.identLieuProgrammation).setActif(lAvecSaisie);
		this.getInstance(this.identLieuProgrammation).setDonnees(
			this.donneesSaisie.lieux,
		);
		if (lIndiceLieuProgrammation > -1) {
			this.getInstance(this.identLieuProgrammation).initSelection(
				lIndiceLieuProgrammation,
			);
		}
		this.getInstance(this.identDateRealisation).setActif(
			lAvecSaisie &&
				this.programmationSelectionne.etatProgrammation ===
					Type3Etats_1.Type3Etats.TE_Oui,
		);
		this.getInstance(this.identDateRealisation).setDonnees(
			this.programmationSelectionne.dateRealisation,
		);
	}
	_actualiserDatesSaisissable() {
		let lDatePremier = this.paramtresScoEspace.PremiereDate;
		if (this.punition.dateDemande) {
			lDatePremier = this.punition.dateDemande;
		}
		this.getInstance(this.identDateDevoir).setPremiereDateSaisissable(
			lDatePremier,
		);
		this.getInstance(this.identDateProgrammation).setPremiereDateSaisissable(
			lDatePremier,
		);
		this.getInstance(this.identDateRealisation).setPremiereDateSaisissable(
			lDatePremier,
		);
		let lDateDernier = this.paramtresScoEspace.DerniereDate;
		for (let i = 0; i < this.punition.programmations.count(); i++) {
			const lProg = this.punition.programmations.get(i);
			if (
				lProg.dateExecution &&
				ObjetDate_1.GDate.estAvantJour(lProg.dateExecution, lDateDernier)
			) {
				lDateDernier = lProg.dateExecution;
			}
			if (
				lProg.dateRealisation &&
				ObjetDate_1.GDate.estAvantJour(lProg.dateRealisation, lDateDernier)
			) {
				lDateDernier = lProg.dateRealisation;
			}
			if (
				lProg.report &&
				lProg.report.existe() &&
				lProg.report.dateExecution &&
				ObjetDate_1.GDate.estAvantJour(
					lProg.report.dateRealisation,
					lDateDernier,
				)
			) {
				lDateDernier = lProg.report.dateRealisation;
			}
		}
		this.getInstance(this.identDate).setOptionsObjetCelluleDate({
			derniereDate: lDateDernier,
		});
	}
	_actualiserPunition() {
		if (this.punition) {
			this.donneesSaisie.durees = new ObjetListeElements_1.ObjetListeElements();
			this.donneesSaisie.accompagnateurs =
				new ObjetListeElements_1.ObjetListeElements();
			if (this.punition.durees) {
				this.donneesSaisie.durees.add(this.punition.durees);
				this._indicedureeExclusion =
					this.donneesSaisie.durees.getIndiceExisteParNumeroEtGenre(
						null,
						this.punition.duree,
					);
			} else {
				this._indicedureeExclusion = undefined;
			}
			if (
				this.punition.nature.getGenre() ===
				TypeGenrePunition_1.TypeGenrePunition.GP_ExclusionCours
			) {
				this.donneesSaisie.accompagnateurs.addElement(
					new ObjetElement_1.ObjetElement("", undefined, -1),
				);
				this.donneesSaisie.accompagnateurs.add(this.punition.accompagnateurs);
				if (this.punition.eleveAccompagnateur) {
					this._indiceAccompagnateur =
						this.donneesSaisie.accompagnateurs.getIndiceExisteParNumeroEtGenre(
							this.punition.eleveAccompagnateur.getNumero(),
						);
				} else {
					this._indiceAccompagnateur = 0;
				}
			} else {
				this._indiceAccompagnateur = undefined;
			}
			let lLibelle = this.punition.libelleDetail;
			this._setTexteBandeau(lLibelle);
			const lAvecSaisie = this._autorisations.saisie && !!this.punition;
			lLibelle = "";
			if (this.punition.professeurDemandeur) {
				lLibelle = this.punition.professeurDemandeur.getLibelle();
			} else if (this.punition.personnelDemandeur) {
				lLibelle = this.punition.personnelDemandeur.getLibelle();
			}
			this.getInstance(this.identDemandeur).setLibelle(lLibelle);
			this.getInstance(this.identDemandeur).setActif(
				lAvecSaisie && this._autorisations.saisieDemandeur,
			);
			this.getInstance(this.identDate).setDonnees(this.punition.dateDemande);
			this.getInstance(this.identDate).setActif(lAvecSaisie);
			const lListe = this.paramtresScoEspace.LibellesHeures.getListeElements(
				(aElement, aIndice) => {
					return aIndice <= this.paramtresScoEspace.PlacesParJour - 1;
				},
			);
			if (
				this.punition.nature.getGenre() !==
				TypeGenrePunition_1.TypeGenrePunition.GP_ExclusionCours
			) {
				const lHorsCours = new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("punition.horsCours"),
					undefined,
					-1,
				);
				lListe.insererElement(lHorsCours, 0);
			}
			const lIndice = lListe.getIndiceParNumeroEtGenre(
				null,
				this.punition.place,
			);
			this.getInstance(this.identHeure).reset();
			this.getInstance(this.identHeure).setActif(lAvecSaisie);
			this.getInstance(this.identHeure).setDonnees(lListe);
			this.getInstance(this.identHeure).initSelection(lIndice);
			this.getInstance(this.identCMS_Motifs).setActif(
				lAvecSaisie && !this.punition.estLieIncident,
			);
			this.getInstance(this.identCMS_Motifs).setDonnees(
				this.punition.motifs,
				true,
			);
			const lListePJTAF = this.punition.documentsTAF
				? this.punition.documentsTAF
				: new ObjetListeElements_1.ObjetListeElements();
			const lListePJ = this.punition.documents
				? this.punition.documents
				: new ObjetListeElements_1.ObjetListeElements();
			this.getInstance(this.identSelecteurPJTAF).setActif(lAvecSaisie);
			this.getInstance(this.identSelecteurPJTAF).setOptions({
				genreRessourcePJ: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
			});
			this.getInstance(this.identSelecteurPJTAF).setDonnees({
				listePJ: lListePJTAF,
				listeTotale: this.documents,
				idContextFocus: this.Nom,
			});
			this.getInstance(this.identSelecteurPJ).setActif(
				lAvecSaisie && !this.punition.estLieIncident,
			);
			this.getInstance(this.identSelecteurPJ).setOptions({
				genreRessourcePJ: this.punition.estLieIncident
					? Enumere_Ressource_1.EGenreRessource.RelationIncidentFichierExterne
					: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
			});
			this.getInstance(this.identSelecteurPJ).setDonnees({
				listePJ: lListePJ,
				listeTotale: this.documents,
				idContextFocus: this.Nom,
			});
			this.getInstance(this.identDuree).reset();
			this.getInstance(this.identDuree).setActif(lAvecSaisie);
			this.getInstance(this.identDuree).setDonnees(this.donneesSaisie.durees);
			this.getInstance(this.identDuree).initSelection(
				this._indicedureeExclusion,
			);
			this.getInstance(this.identAccompagnateur).reset();
			this.getInstance(this.identAccompagnateur).setActif(lAvecSaisie);
			this.getInstance(this.identAccompagnateur).setDonnees(
				this.donneesSaisie.accompagnateurs,
			);
			this.getInstance(this.identAccompagnateur).initSelection(
				this._indiceAccompagnateur,
			);
			if (
				this.punition.nature.getGenre() ===
				TypeGenrePunition_1.TypeGenrePunition.GP_Devoir
			) {
				if (this.punition.programmations.avecAuMoinsUneProgrammation()) {
					this.getInstance(this.identDateDevoir).setDonnees(
						this.punition.programmations.getPremierElement().dateExecution,
					);
				} else {
					this.getInstance(this.identDateDevoir).setDonnees();
				}
				this.getInstance(this.identDateDevoir).setActif(lAvecSaisie);
			} else if (
				this.punition.estPlanifiable &&
				this.punition.estProgrammable
			) {
				this._actualiserProgrammation();
			}
			this._actualiserDatesSaisissable();
			this.setVisibilite();
			this.surResizeProgrammation();
			this.getInstance(this.identProgrammations).setDonnees(
				new DonneesListe_Simple_1.DonneesListe_Simple(
					this.punition.programmations,
					{
						avecEdition: lAvecSaisie,
						avecEvnt_Edition: lAvecSaisie,
						avecEvnt_Creation: lAvecSaisie,
						avecEvnt_ApresSuppression: lAvecSaisie,
						avecSuppression: lAvecSaisie,
					},
				),
				0,
			);
		} else {
			$("#" + this.idReponse.escapeJQ() + "_detail").hide();
			if (this.eleveSelectionne) {
				this._setTexteBandeau(
					ObjetTraduction_1.GTraductions.getValeur("punition.selectionner"),
				);
			} else {
				this._setTexteBandeau(
					ObjetTraduction_1.GTraductions.getValeur(
						"punition.selectionnerEleve",
					),
				);
			}
		}
	}
}
exports.InterfaceSaisiePunitions = InterfaceSaisiePunitions;
