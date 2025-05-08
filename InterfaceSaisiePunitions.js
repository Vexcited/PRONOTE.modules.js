const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { TypeFusionTitreListe } = require("TypeFusionTitreListe.js");
const {
	ObjetRequeteSaisieListePunitions,
} = require("ObjetRequeteSaisieListePunitions.js");
const { GUID } = require("GUID.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { MethodesTableau } = require("MethodesTableau.js");
const { GHtml } = require("ObjetHtml.js");
const { Requetes } = require("CollectionRequetes.js");
const { GStyle } = require("ObjetStyle.js");
const { DonneesListe_Simple } = require("DonneesListe_Simple.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EEvent } = require("Enumere_Event.js");
const { EGenreSaisie } = require("Enumere_Saisie.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetCelluleBouton } = require("ObjetCelluleBouton.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
const { ObjetSelecteurPJCP } = require("ObjetSelecteurPJCP.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const {
	DonneesListe_SaisiePunitions,
} = require("DonneesListe_SaisiePunitions.js");
const {
	DonneesListe_SelectionDemandeur,
} = require("DonneesListe_SelectionDemandeur.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreEvntMenusDeroulants } = require("Enumere_EvntMenusDeroulants.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const {
	ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const {
	ObjetCelluleMultiSelectionMotif,
} = require("ObjetCelluleMultiSelectionMotif.js");
const {
	ObjetFenetre_SignalementPunition,
} = require("ObjetFenetre_SignalementPunition.js");
const { ObjetSelecteurPJ } = require("ObjetSelecteurPJ.js");
const {
	DonneesListe_SelectionMotifs,
} = require("DonneesListe_SelectionMotifs.js");
const { Type3Etats } = require("Type3Etats.js");
const { TypeGenrePunition } = require("TypeGenrePunition.js");
const { EGenreBoutonCellule } = require("ObjetCelluleBouton.js");
const { ObjetRequeteListePublics } = require("ObjetRequeteListePublics.js");
const {
	DonneesListe_CategoriesMotif,
} = require("DonneesListe_CategoriesMotif.js");
const {
	TypeGenreReponseInternetActualite,
} = require("TypeGenreReponseInternetActualite.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const { ObjetUtilitaireAbsence } = require("ObjetUtilitaireAbsence.js");
const {
	ObjetFenetre_ChoixDatePublicationPunition,
} = require("ObjetFenetre_ChoixDatePublicationPunition.js");
const {
	ObjetFenetre_EditionActualite,
} = require("ObjetFenetre_EditionActualite.js");
Requetes.inscrire("ListesSaisiesPourIncidents", ObjetRequeteConsultation);
Requetes.inscrire("ListePunitions", ObjetRequeteConsultation);
class InterfaceSaisiePunitions extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this._autorisations = {
			acces: false,
			saisie: false,
			saisieDemandeur: true,
			avecPublicationPunitions: false,
			avecPublicationDossier: GApplication.droits.get(
				TypeDroits.dossierVS.publierDossiersVS,
			),
		};
		$.extend(true, this._autorisations, {
			acces: GApplication.droits.get(TypeDroits.punition.acces),
			saisie: GApplication.droits.get(TypeDroits.punition.saisie),
			avecPublicationPunitions:
				GApplication.droits.get(TypeDroits.punition.avecPublicationPunitions) &&
				!GApplication.droits.get(TypeDroits.estEnConsultation),
			creerMotifIncidentPunitionSanction:
				GApplication.droits.get(
					TypeDroits.creerMotifIncidentPunitionSanction,
				) && !GApplication.droits.get(TypeDroits.estEnConsultation),
		});
		this.donneesSaisie = {
			tailleTravailAFaire: GApplication.droits.get(
				TypeDroits.tailleTravailAFaire,
			),
			tailleCirconstance: GApplication.droits.get(
				TypeDroits.tailleCirconstance,
			),
			tailleCommentaire: GApplication.droits.get(TypeDroits.tailleCommentaire),
		};
		this.idReponse = GUID.getId();
		this.idSuiteDonnee = GUID.getId();
		this.idSuiteExclusion = GUID.getId();
		this.idSuiteRetenues = GUID.getId();
		this.idSuiteTIG = GUID.getId();
		this.idSuiteDevoir = GUID.getId();
		this.idSuiteAutre = GUID.getId();
		this.idSectionListe = GUID.getId();
		this.idSectionProgrammation = GUID.getId();
		this.idBandeauGauche = GApplication.idBreadcrumbPerso;
		this.idBandeauDroite = GUID.getId();
		this.idLabelDuree = GUID.getId();
		this.idLabelDureeProgrammation = GUID.getId();
		this.idLabelAccompagnateur = GUID.getId();
		this.idLabelSurveillant = GUID.getId();
		this.idLabelLieuProgra = GUID.getId();
		this.idLabelMotifs = GUID.getId();
		this.idLabelDemandeur = GUID.getId();
		this.listePJ = new ObjetListeElements();
		this.nrPunitionSelectionnee = undefined;
	}
	evenementSurMenuDeroulant(aParam) {
		if (
			aParam.genreCombo === EGenreRessource.Eleve &&
			aParam.genreEvenement === EGenreEvntMenusDeroulants.ressourceNonTrouve
		) {
			this.eleveSelectionne = undefined;
			this.punition = null;
			this.nrPunitionSelectionnee = undefined;
			GEtatUtilisateur.setNrPunitionSelectionnee(this.nrPunitionSelectionnee);
			this.documents = undefined;
			this.listePunitions = new ObjetListeElements();
			_actualiserPunition.call(this);
			this.getInstance(this.identPunitions).reset();
			this.getInstance(this.identPunitions).setVisible(false);
		}
	}
	_evntSurCreationMotif(aCol) {
		switch (aCol) {
			case DonneesListe_SelectionMotifs.colonnes.incident:
				this.getInstance(this.identFenetreSousCategorieDossier).setDonnees(
					new DonneesListe_CategoriesMotif(
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
			ObjetAffichagePageAvecMenusDeroulants,
			_evenementSurDernierMenuDeroulant.bind(this),
			_initialiserTripleCombo.bind(this),
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
			ObjetListe,
			_evntListe.bind(this),
			_initListe.bind(this),
		);
		this.identDemandeur = this.add(
			ObjetCelluleBouton,
			_evntDemandeur.bind(this),
			_initDemandeur.bind(this),
		);
		this.identDate = this.add(
			ObjetCelluleDate,
			_evntSurDate.bind(this),
			_initDate.bind(this),
		);
		this.identHeure = this.add(
			ObjetSaisie,
			_evntSurHeure.bind(this),
			_initHeure.bind(this),
		);
		this.identCMS_Motifs = this.add(
			ObjetCelluleMultiSelectionMotif,
			_evnCMS_Motifs.bind(this),
			_initCMS_Motifs.bind(this),
		);
		this.identSelecteurPJ = this.add(
			ObjetSelecteurPJ,
			_evntSelecteurPJ.bind(this),
			_initSelecteurPJ.bind(this),
		);
		this.identSelecteurPJTAF = this.add(
			ObjetSelecteurPJ,
			_evntSelecteurPJTAF.bind(this),
			_initSelecteurPJ.bind(this),
		);
		this.identDuree = this.add(
			ObjetSaisie,
			_evntSurDuree.bind(this),
			_initDuree.bind(this, false),
		);
		this.identAccompagnateur = this.add(
			ObjetSaisie,
			_evntSurAccompagnateur.bind(this),
			_initAccompagnateur.bind(this),
		);
		this.identDateDevoir = this.add(
			ObjetCelluleDate,
			_evntSurDateDevoir.bind(this),
			_initDate.bind(this),
		);
		this.identProgrammations = this.add(
			ObjetListe,
			_evntListeProg.bind(this),
			_initialiserListeProgrammationsPunition.bind(this),
		);
		this.identDateProgrammation = this.add(
			ObjetCelluleDate,
			_evntSurDateProgrammation.bind(this),
			_initDate.bind(this),
		);
		this.identHeureProgrammation = this.add(
			ObjetSaisie,
			_evntSurHeureProgrammation.bind(this),
			_initHeure.bind(this),
		);
		this.identDureeProgrammation = this.add(
			ObjetSaisie,
			_evntSurDureeProgrammation.bind(this),
			_initDuree.bind(this, true),
		);
		this.identLieuProgrammation = this.add(
			ObjetSaisie,
			_evntSurLieuProgrammation.bind(this),
			_initLieu.bind(this),
		);
		this.identDateRealisation = this.add(
			ObjetCelluleDate,
			_evntSurDateRealisation.bind(this),
			_initDate.bind(this),
		);
		this.identSurveillant = this.add(
			ObjetCelluleBouton,
			_evntSurveillant.bind(this),
			_initSurveillant.bind(this),
		);
		this.identFenetreDuree = this.addFenetre(
			ObjetFenetre_Liste,
			_evntFenetreDuree.bind(this),
			_initialiserFenetreDuree,
		);
		this.identFenetreSousCategorieDossier = this.addFenetre(
			ObjetFenetre_Liste,
			_evntFenetreSousCategorieDossier.bind(this),
			_initFenetreSousCategorieDossier,
		);
		this.identFenetreSignalement = this.addFenetre(
			ObjetFenetre_SignalementPunition,
			_evntFenetreSignalement.bind(this),
			_initFenetreSignalement.bind(this),
		);
		this.identFenetreDemandeur = this.addFenetre(
			ObjetFenetre_Liste,
			_evntFenetreDemandeurSurveillant.bind(this),
			_initFenetreDemandeur,
		);
	}
	setParametresGeneraux() {
		this.GenreStructure = EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const H = [];
		let lWidth = 620;
		const lHeight = 32;
		H.push('<div style="height:calc(100% - 0.8rem);">');
		H.push('<div class="ly-cols-2">');
		H.push(
			`  <div id="${this.idSectionListe}" class="aside-content cols" style="${GStyle.composeWidth(lWidth)}">`,
		);
		H.push(
			`    <div class="fix-bloc m-bottom flex-contain" style="height:${lHeight}px;">${composeBandeauGauche.bind(this)()}</div>`,
		);
		H.push(
			`    <div class="fluid-bloc full-height" id="${this.getNomInstance(this.identPunitions)}"></div>`,
		);
		H.push("</div>");
		H.push('<div class="main-content cols">');
		H.push(
			`    <div class="fix-bloc m-bottom flex-contain" style="height:${lHeight}px;">${composeBandeauDroite.bind(this)()}</div>`,
		);
		H.push(
			`    <div class="fluid-bloc full-height">${_composeDetail.bind(this)()}</div>`,
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
						GTraductions.getValeur("punition.circonstances")
					);
				} else {
					return GTraductions.getValeur("punition.circonstances");
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
						aInstance.punition.setEtat(EGenreEtat.Modification);
						aInstance.setEtatSaisie(true);
					}
				},
				eventChange() {},
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
						aInstance.punition.setEtat(EGenreEtat.Modification);
						aInstance.setEtatSaisie(true);
					}
				},
				eventChange() {},
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
						aInstance.punition.setEtat(EGenreEtat.Modification);
						aInstance.setEtatSaisie(true);
					}
				},
				getDisplay() {
					return (
						aInstance.punition &&
						aInstance.punition.nature &&
						aInstance.punition.nature.getGenre() ===
							TypeGenrePunition.GP_Retenues
					);
				},
			},
			getLibelleNature() {
				if (aInstance.punition && aInstance.punition.nature) {
					if (
						aInstance.punition.nature.getGenre() ===
						TypeGenrePunition.GP_ExclusionCours
					) {
						return GTraductions.getValeur("punition.exclusionDeCoursDe");
					} else {
						return (
							aInstance.punition.nature.getLibelle() +
							" " +
							GTraductions.getValeur("De")
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
					return GTraductions.getValeur("punition.programmeeLe");
				} else {
					return GTraductions.getValeur("punition.aProgrammer");
				}
			},
			dateInitial() {
				if (
					aInstance.programmationSelectionne &&
					aInstance.programmationSelectionne.report &&
					aInstance.programmationSelectionne.report.existe()
				) {
					const lResult = aInstance.programmationSelectionne.dateExecution
						? GDate.formatDate(
								aInstance.programmationSelectionne.dateExecution,
								"%JJ/%MM/%AAAA",
							)
						: "...";
					return GTraductions.getValeur("punition.initialementPrevu", [
						lResult,
					]);
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
						aInstance.programmationSelectionne.setEtat(EGenreEtat.Modification);
						aInstance.punition.setEtat(EGenreEtat.Modification);
						aInstance.setEtatSaisie(true);
					}
				},
				eventChange() {},
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
						GApplication.getMessage().afficher({
							type: EGenreBoiteMessage.Information,
							message: GTraductions.getValeur("punition.msgChangementMultiple"),
						});
					} else {
						aInstance.punition.retenueMultiple = aMultiSeances;
						aInstance.punition.setEtat(EGenreEtat.Modification);
						aInstance.setEtatSaisie(true);
						_actualiserPunition.call(aInstance);
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
							aInstance.programmationSelectionne.report = new ObjetElement("");
							aInstance.programmationSelectionne.report.setEtat(
								EGenreEtat.Creation,
							);
							aInstance.programmationSelectionne.setEtat(
								EGenreEtat.Modification,
							);
							aInstance.punition.setEtat(EGenreEtat.Modification);
							aInstance.setEtatSaisie(true);
							_actualiserProgrammation.call(
								aInstance,
								aInstance.programmationSelectionne,
							);
						} else {
							GApplication.getMessage().afficher({
								type: EGenreBoiteMessage.Confirmation,
								message: GTraductions.getValeur("punition.msgAnnulationReport"),
								callback: function (aAccepte) {
									if (aAccepte === EGenreAction.Valider) {
										if (
											this.programmationSelectionne.report &&
											this.programmationSelectionne.report.existe()
										) {
											this.programmationSelectionne.report.setEtat(
												EGenreEtat.Suppression,
											);
											this.programmationSelectionne.setEtat(
												EGenreEtat.Modification,
											);
											this.punition.setEtat(EGenreEtat.Modification);
											this.setEtatSaisie(true);
											_actualiserProgrammation.call(
												this,
												this.programmationSelectionne,
											);
										}
									} else {
										_actualiserProgrammation.call(
											this,
											this.programmationSelectionne,
										);
									}
								}.bind(aInstance),
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
							Type3Etats.TE_Oui
					);
				},
				setValue(aValue) {
					if (aValue) {
						aInstance.programmationSelectionne.etatProgrammation =
							Type3Etats.TE_Oui;
						aInstance.programmationSelectionne.dateRealisation = !!aInstance
							.programmationSelectionne.dateRealisation
							? aInstance.programmationSelectionne.dateRealisation
							: aInstance.programmationSelectionne.dateExecution
								? aInstance.programmationSelectionne.dateExecution
								: GDate.getDateCourante();
					} else {
						aInstance.programmationSelectionne.etatProgrammation =
							Type3Etats.TE_Inconnu;
					}
					if (
						aInstance.programmationSelectionne.etatProgrammation ===
							Type3Etats.TE_Inconnu &&
						aInstance.programmationSelectionne.dateRealisation
					) {
						aInstance.programmationSelectionne.dateRealisation = undefined;
					}
					aInstance.programmationSelectionne.setEtat(EGenreEtat.Modification);
					aInstance.punition.setEtat(EGenreEtat.Modification);
					aInstance.setEtatSaisie(true);
					_actualiserProgrammation.call(
						aInstance,
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
							Type3Etats.TE_Non
					);
				},
				setValue(aValue) {
					if (aValue) {
						aInstance.programmationSelectionne.etatProgrammation =
							Type3Etats.TE_Non;
					} else {
						aInstance.programmationSelectionne.etatProgrammation =
							Type3Etats.TE_Inconnu;
					}
					if (
						aInstance.programmationSelectionne.etatProgrammation ===
							Type3Etats.TE_Non &&
						aInstance.programmationSelectionne.dateRealisation
					) {
						aInstance.programmationSelectionne.dateRealisation = undefined;
					}
					aInstance.programmationSelectionne.setEtat(EGenreEtat.Modification);
					aInstance.punition.setEtat(EGenreEtat.Modification);
					aInstance.setEtatSaisie(true);
					_actualiserProgrammation.call(
						aInstance,
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
					aInstance.punition.setEtat(EGenreEtat.Modification);
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
				return ObjetUtilitaireAbsence.getClassesIconePublicationPunition(
					aInstance.punition ? aInstance.punition.datePublication : null,
				);
			},
			getHintImagePublication() {
				const lPunition = aInstance.punition;
				return ObjetUtilitaireAbsence.getHintPublicationPunition(
					lPunition ? lPunition.datePublication : null,
				);
			},
			modelSelecteurDatePublication: {
				getLibelle() {
					const lStrLibelle = [];
					if (aInstance.punition && aInstance.punition.datePublication) {
						lStrLibelle.push(
							GDate.formatDate(
								aInstance.punition.datePublication,
								"%JJ/%MM/%AAAA",
							),
						);
					}
					return lStrLibelle.join("");
				},
				getIcone() {
					return '<i class="icon_calendar_empty"></i>';
				},
				event() {
					if (aInstance.punition) {
						const lFenetre = ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_ChoixDatePublicationPunition,
							{
								pere: aInstance,
								evenement(aNumeroBouton, aDateChoisie) {
									if (aNumeroBouton) {
										setDatePublicationPunition.call(
											aInstance,
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
					return !estPunitionPubliee(aInstance.punition);
				},
			},
			cbPublierPunition: {
				getValue() {
					return estPunitionPubliee(aInstance.punition);
				},
				setValue(aValue) {
					if (aInstance.punition) {
						let lNouvelleDatePublication = null;
						if (aValue) {
							lNouvelleDatePublication =
								ObjetUtilitaireAbsence.getDatePublicationPunitionParDefaut(
									aInstance.punition.nature,
								);
						}
						setDatePublicationPunition.call(
							aInstance,
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
							TypeGenrePunition.GP_ExclusionCours
					);
				},
				exclusionEtTigEtRetenues: function () {
					return (
						aInstance.punition &&
						aInstance.punition.nature &&
						(aInstance.punition.nature.getGenre() ===
							TypeGenrePunition.GP_ExclusionCours ||
							aInstance.punition.estPlanifiable)
					);
				},
				devoir: function () {
					return (
						aInstance.punition &&
						aInstance.punition.nature &&
						aInstance.punition.nature.getGenre() === TypeGenrePunition.GP_Devoir
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
		if (GEtatUtilisateur.EtatSaisie) {
			this.demandeOuvertureFenetreEditionInformation = true;
			this.valider();
		} else {
			this.ouvrirFenetreEditionInformation();
		}
	}
	ouvrirFenetreEditionInformation() {
		const lFenetre = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_EditionActualite,
			{
				pere: this,
				evenement: function (aGenreBouton, aParam) {
					if (aGenreBouton === 1 && aParam.creation && aParam.punition) {
						aParam.punition.messageEnvoye = true;
					}
				},
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: GTraductions.getValeur("actualites.creerInfo"),
						largeur: 750,
						hauteur: 700,
						listeBoutons: [
							GTraductions.getValeur("Annuler"),
							GTraductions.getValeur("Valider"),
						],
					});
				},
			},
		);
		lFenetre.setDonnees({
			donnee: null,
			creation: true,
			genreReponse: TypeGenreReponseInternetActualite.AvecAR,
			forcerAR: GApplication.droits.get(
				TypeDroits.fonctionnalites.forcerARInfos,
			),
			genresPublic: [EGenreRessource.Enseignant, EGenreRessource.Personnel],
			eleve: this.eleveSelectionne,
			punition: this.punition,
		});
	}
	recupererDonnees() {
		this.setEtatSaisie(false);
		$("#" + this.idReponse.escapeJQ() + "_detail").hide();
		this.nrPunitionSelectionnee = GEtatUtilisateur.getNrPunitionSelectionnee();
		if (!this._cacheListeSaisie) {
			if (this.eleveSelectionne) {
				_setTexteBandeau.bind(this)(
					GTraductions.getValeur("punition.selectionner"),
				);
			} else {
				_setTexteBandeau.bind(this)(
					GTraductions.getValeur("punition.selectionnerEleve"),
				);
			}
			this._cacheListeSaisie = true;
			Requetes(
				"ListesSaisiesPourIncidents",
				this,
				_actionApresRequeteListesPourSaisiePunitions,
			).lancerRequete({
				avecLieux: true,
				avecSalles: true,
				avecMotifs: true,
				avecActions: false,
				avecSousCategorieDossier:
					this._autorisations.creerMotifIncidentPunitionSanction,
				avecPunitions: this._autorisations.saisie,
				avecSanctions: false,
				avecProtagonistes: false,
			});
		} else {
			_faireRequeteDonneesEleve.call(this);
		}
	}
	afficherPage() {
		this.recupererDonnees();
	}
	valider() {
		GEtatUtilisateur.setNrPunitionSelectionnee(this.nrPunitionSelectionnee);
		const lObjetSaisie = {
			punitions: this.listePunitions,
			motifs: this.donneesSaisie.motifs,
		};
		this.actionValidationPunition = true;
		new ObjetRequeteSaisieListePunitions(this, this.actionSurValidation)
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
}
function _setTexteBandeau(aMessage) {
	GHtml.setHtml(this.idBandeauDroite + "_Texte", aMessage);
}
function _initialiserTripleCombo(aInstance) {
	aInstance.setParametres([EGenreRessource.Classe, EGenreRessource.Eleve]);
	aInstance.setEvenementMenusDeroulants(this.evenementSurMenuDeroulant);
}
function _initListe(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_SaisiePunitions.colonnes.date,
		titre: GTraductions.getValeur("punition.titre.Date"),
		taille: 55,
	});
	lColonnes.push({
		id: DonneesListe_SaisiePunitions.colonnes.nature,
		titre: GTraductions.getValeur("punition.titre.Punition"),
		taille: 160,
	});
	lColonnes.push({
		id: DonneesListe_SaisiePunitions.colonnes.motif,
		titre: GTraductions.getValeur("punition.titre.Motif"),
		taille: "100%",
	});
	lColonnes.push({
		id: DonneesListe_SaisiePunitions.colonnes.etat,
		titre: GTraductions.getValeur("punition.titre.Etat"),
		hint: GTraductions.getValeur("punition.hint.Etat"),
		taille: 20,
	});
	if (this._autorisations.avecPublicationDossier) {
		lColonnes.push({
			id: DonneesListe_SaisiePunitions.colonnes.dossier,
			titre: {
				libelleHtml: '<i class="icon_folder_close mix-icon_ok i-green"></i>',
				title: GTraductions.getValeur("punition.hint.Dossier"),
			},
			taille: 20,
		});
	}
	if (this._autorisations.avecPublicationPunitions) {
		lColonnes.push({
			id: DonneesListe_SaisiePunitions.colonnes.publication,
			titre: {
				libelleHtml:
					'<i class="icon_info_sondage_publier mix-icon_ok i-green"></i>',
				title: GTraductions.getValeur("punition.hint.Publication"),
			},
			taille: 20,
		});
	}
	const lOptionsListe = {
		colonnes: lColonnes,
		numeroColonneTriDefaut: {
			id: DonneesListe_SaisiePunitions.colonnes.date,
			genre: EGenreTriElement.Decroissant,
		},
	};
	if (this._autorisations.saisie) {
		$.extend(lOptionsListe, {
			titreCreation: GTraductions.getValeur("punition.creation"),
			avecLigneCreation: true,
		});
	}
	aInstance.setOptionsListe(lOptionsListe);
	const lThis = this;
	aInstance.controleur.inputTime = {
		getValue: function (aNumero, aEtat) {
			const lNumero =
				aEtat === EGenreEtat.Creation ? parseInt(aNumero) : aNumero;
			const lElement = this.instance
				.getListeArticles()
				.getElementParNumero(lNumero);
			return lElement ? GDate.formatDate(lElement.dateheure, "%hh:%mm") : "";
		},
		setValue: function (aNumero, aEtat, aValue, aHeures, aMinutes) {
			const lNumero =
				aEtat === EGenreEtat.Creation ? parseInt(aNumero) : aNumero;
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
			lElement.setEtat(EGenreEtat.Modification);
			lThis.setEtatSaisie(true);
		},
	};
}
function _initDemandeur(aInstance) {
	aInstance.setOptionsObjetCelluleBouton({
		estSaisissable: false,
		avecZoneSaisie: false,
		genreBouton: EGenreBoutonCellule.Aucun,
		largeur: 280,
		hauteur: 17,
		largeurBouton: 16,
		describedById: this.idLabelDemandeur,
	});
	aInstance.setActif(false);
}
function _initSurveillant(aInstance) {
	aInstance.setOptionsObjetCelluleBouton({
		estSaisissable: false,
		avecZoneSaisie: false,
		genreBouton: EGenreBoutonCellule.Aucun,
		largeur: 180,
		hauteur: 17,
		largeurBouton: 16,
		labelledById: this.idLabelSurveillant,
	});
}
function _initDate(aInstance) {
	aInstance.setOptionsObjetCelluleDate({ classeCSSTexte: " " });
	aInstance.setParametresFenetre(
		GParametres.PremierLundi,
		GParametres.PremiereDate,
		GParametres.DerniereDate,
	);
	aInstance.setControleNavigation(false);
}
function _initHeure(aInstance) {
	aInstance.setOptionsObjetSaisie({
		mode: EGenreSaisie.Combo,
		longueur: 80,
		hauteur: 17,
		classTexte: "",
		deroulerListeSeulementSiPlusieursElements: false,
		initAutoSelectionAvecUnElement: false,
		labelWAICellule: GTraductions.getValeur("punition.heure"),
	});
}
function _initCMS_Motifs(aInstance) {
	aInstance.setOptions({
		largeurBouton: 457,
		classTexte: "",
		labelledById: this.idLabelMotifs,
	});
}
function _initDuree(aEstDureeProgrammation, aInstance) {
	aInstance.setOptionsObjetSaisie({
		mode: EGenreSaisie.Combo,
		longueur: 60,
		hauteur: 17,
		classTexte: "",
		deroulerListeSeulementSiPlusieursElements: false,
		initAutoSelectionAvecUnElement: false,
		labelledById: aEstDureeProgrammation
			? this.idLabelDureeProgrammation
			: this.idLabelDuree,
	});
}
function _initLieu(aInstance) {
	const lOptions = {
		mode: EGenreSaisie.Combo,
		celluleAvecTexteHtml: true,
		longueur: 160,
		classTexte: "",
		labelledById: this.idLabelLieuProgra,
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
function _initAccompagnateur(aInstance) {
	aInstance.setOptionsObjetSaisie({
		mode: EGenreSaisie.Combo,
		longueur: 130,
		hauteur: 17,
		classTexte: "",
		labelledById: this.idLabelAccompagnateur,
		deroulerListeSeulementSiPlusieursElements: false,
		initAutoSelectionAvecUnElement: false,
	});
}
function _initialiserFenetreDuree(aInstance) {
	aInstance.setOptionsFenetre({
		modale: true,
		titre: GTraductions.getValeur("punition.SelectDuree"),
		largeur: 200,
		hauteur: 300,
		listeBoutons: [
			GTraductions.getValeur("Annuler"),
			GTraductions.getValeur("Valider"),
		],
	});
	aInstance.paramsListe = { tailles: ["100%"], editable: false };
}
function _initFenetreSousCategorieDossier(aInstance) {
	aInstance.setOptionsFenetre({
		modale: true,
		titre: GTraductions.getValeur("dossierVS.titreIncident"),
		largeur: 300,
		hauteurMin: 160,
		listeBoutons: [
			GTraductions.getValeur("Annuler"),
			GTraductions.getValeur("Valider"),
		],
	});
	aInstance.paramsListe = { tailles: ["100%"], editable: false };
}
function _initFenetreSignalement(aInstance) {
	const lAvecCreationMotifs = GApplication.droits.get(
		TypeDroits.creerMotifIncidentPunitionSanction,
	);
	const lParam = {
		titres: [
			"",
			GTraductions.getValeur("fenetreMotifs.motif"),
			TypeFusionTitreListe.FusionGauche,
			GTraductions.getValeur("fenetreMotifs.genre"),
		],
		tailles: ["20", "100%", "15", "120"],
		listeBoutons: [
			GTraductions.getValeur("Annuler"),
			GTraductions.getValeur("Valider"),
		],
		avecLigneCreation: !!lAvecCreationMotifs,
		creations: lAvecCreationMotifs
			? [
					DonneesListe_SelectionMotifs.colonnes.motif,
					DonneesListe_SelectionMotifs.colonnes.incident,
				]
			: null,
		callbckCreation: this._evntSurCreationMotif.bind(this),
		editable: true,
		optionsListe: { colonnesSansBordureDroit: [false, true, false, false] },
	};
	aInstance.setOptionsFenetre({
		modale: true,
		titre: GTraductions.getValeur("punition.titreFenetreCreation"),
		largeur: 650,
		hauteur: 450,
		listeBoutons: [
			GTraductions.getValeur("Annuler"),
			GTraductions.getValeur("Valider"),
		],
	});
	aInstance.paramsListe = lParam;
	$.extend(aInstance.optionsFenetre, {
		modeActivationBtnValider: aInstance.modeActivationBtnValider.autre,
	});
}
function _initFenetreDemandeur(aInstance) {
	aInstance.setOptionsFenetre({
		modale: true,
		titre: GTraductions.getValeur("punition.selectionDemandeur"),
		largeur: 300,
		hauteur: 400,
		listeBoutons: [
			GTraductions.getValeur("Annuler"),
			GTraductions.getValeur("Valider"),
		],
		avecVerificationLigneSelectionne: true,
	});
	aInstance.paramsListe = { tailles: ["100%"], editable: false };
}
function _initSelecteurPJ(aInstance) {
	aInstance.setOptions({
		genrePJ: EGenreDocumentJoint.Fichier,
		genreRessourcePJ: EGenreRessource.DocJointEleve,
		interdireDoublonsLibelle: false,
		libelleSelecteur: GTraductions.getValeur("AjouterDesPiecesJointes"),
		avecBoutonSupp: true,
		avecCmdAjoutNouvelle: false,
		avecMenuSuppressionPJ: false,
		avecAjoutExistante: true,
		ouvrirFenetreChoixTypesAjout: false,
		maxFiles: 0,
		maxSize: GApplication.droits.get(TypeDroits.tailleMaxDocJointEtablissement),
	});
}
function _initialiserListeProgrammationsPunition(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		titre: GTraductions.getValeur("punition.seances"),
		taille: 69,
	});
	const lOptions = { colonnes: lColonnes };
	if (this._autorisations.saisie) {
		$.extend(lOptions, { listeCreations: 1, avecLigneCreation: true });
	}
	aInstance.setOptionsListe(lOptions);
}
function _evenementSurDernierMenuDeroulant() {
	if (!!this.punition) {
		this.punition = null;
		this.nrPunitionSelectionnee = undefined;
		GEtatUtilisateur.setNrPunitionSelectionnee(this.nrPunitionSelectionnee);
		_actualiserPunition.call(this);
	}
	this.eleveSelectionne = GEtatUtilisateur.Navigation.getRessource(
		EGenreRessource.Eleve,
	);
	_setTexteBandeau.bind(this)(GTraductions.getValeur("punition.selectionner"));
	_faireRequeteDonneesEleve.call(this);
}
function _faireRequeteDonneesEleve() {
	Requetes(
		"ListePunitions",
		this,
		_actionApresRequeteListePunitions,
	).lancerRequete({ eleve: this.eleveSelectionne });
}
function _evntListeProg(aParametres, aGenreEvenementListe, aColonne, aLigne) {
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.Selection:
			_actualiserProgrammation.call(
				this,
				this.punition.programmations.get(aLigne),
			);
			break;
		case EGenreEvenementListe.Edition:
			this.programmationEstEnCreation = false;
			this.getInstance(this.identFenetreDuree).setDonnees(
				new DonneesListe_Simple(this.donneesSaisie.durees),
			);
			break;
		case EGenreEvenementListe.Creation:
			this.programmationEstEnCreation = true;
			this.getInstance(this.identFenetreDuree).setDonnees(
				new DonneesListe_Simple(this.donneesSaisie.durees),
			);
			return EGenreEvenementListe.Creation;
		case EGenreEvenementListe.ApresSuppression:
			this.programmationSelectionne.setEtat(EGenreEtat.Suppression);
			this.programmationSelectionne = undefined;
			_actualiserPunition.call(this);
			this.punition.setEtat(EGenreEtat.Modification);
			break;
		default:
			break;
	}
}
function _evntListe(aParametres, aGenreEvenementListe, aColonne, aLigne) {
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.Selection:
			_evntSelection.call(this, aLigne);
			break;
		case EGenreEvenementListe.Creation:
			this.punitionEnCreation = _creerNouvellePunition(this.eleveSelectionne);
			this.tempMotifs = MethodesObjet.dupliquer(this.donneesSaisie.motifs);
			this.getInstance(this.identFenetreSignalement).setDonnees({
				listeNaturePunitions: this.donneesSaisie.punitions,
				objetDonneesListeMotifs: new DonneesListe_SelectionMotifs(
					this.tempMotifs,
					{
						avecCreation: GApplication.droits.get(
							TypeDroits.creerMotifIncidentPunitionSanction,
						),
					},
				),
				motifs: this.tempMotifs,
				punition: this.punitionEnCreation,
				avecValidation: false,
				listePunitions: MethodesObjet.dupliquer(this.listePunitions),
				listePJ: this.listePJ,
			});
			return EGenreEvenementListe.Creation;
		case EGenreEvenementListe.Edition:
			if (!this.punition) {
				break;
			}
			switch (aParametres.idColonne) {
				case DonneesListe_SaisiePunitions.colonnes.motif:
					this.getInstance(this.identCMS_Motifs).surCellule(EEvent.SurClick);
					break;
				case DonneesListe_SaisiePunitions.colonnes.publication: {
					let lNouvelleDatePublication = null;
					if (!aParametres.article.datePublication) {
						lNouvelleDatePublication = GDate.getDateCourante();
					}
					aParametres.article.datePublication = lNouvelleDatePublication;
					const lListe = this.getInstance(this.identPunitions);
					lListe.actualiser(true);
					break;
				}
			}
			break;
		case EGenreEvenementListe.ApresEdition:
			_evntSelection.call(this, aLigne);
			break;
		case EGenreEvenementListe.ApresSuppression:
			this.punition = null;
			this.nrPunitionSelectionnee = null;
			GEtatUtilisateur.setNrPunitionSelectionnee();
			this._cacheListeSaisie = false;
			_actualiserPunition.call(this);
			break;
	}
}
function _evntSelection(aLigne) {
	if (
		!this.punition ||
		!this.nrPunitionSelectionnee ||
		this.nrPunitionSelectionnee !== this.listePunitions.getNumero(aLigne) ||
		this.actionValidationPunition
	) {
		this.actionValidationPunition = false;
		this.punition = this.listePunitions.get(aLigne);
		this.nrPunitionSelectionnee = this.punition.getNumero();
		GEtatUtilisateur.setNrPunitionSelectionnee(this.nrPunitionSelectionnee);
		this.punition.programmations.setTri([
			ObjetTri.init((D) => {
				const lProgrammationEffectif =
					D.report && D.report.existe() ? D.report : D;
				if (lProgrammationEffectif.dateExecution) {
					return 0;
				} else {
					return 1;
				}
			}),
			ObjetTri.init((D) => {
				const lProgrammationEffectif =
					D.report && D.report.existe() ? D.report : D;
				return lProgrammationEffectif.dateExecution;
			}),
			ObjetTri.init((D) => {
				const lProgrammationEffectif =
					D.report && D.report.existe() ? D.report : D;
				if (lProgrammationEffectif.placeExecution) {
					return 0;
				} else {
					return 1;
				}
			}),
			ObjetTri.init((D) => {
				const lProgrammationEffectif =
					D.report && D.report.existe() ? D.report : D;
				return lProgrammationEffectif.placeExecution;
			}),
			ObjetTri.init("Libelle"),
		]);
		this.punition.programmations.trier();
		_actualiserPunition.call(this);
	}
}
function _evntDemandeur(aGenreEvent) {
	if (
		(aGenreEvent === EEvent.SurKeyUp && GNavigateur.isToucheSelection()) ||
		aGenreEvent === EEvent.SurMouseDown
	) {
		let lElmDemandeur;
		if (this.punition.professeurDemandeur) {
			lElmDemandeur = this.punition.professeurDemandeur;
		} else if (this.punition.personnelDemandeur) {
			lElmDemandeur = this.punition.personnelDemandeur;
		}
		let lIndice = -1;
		if (lElmDemandeur) {
			lIndice = this.donneesSaisie.listePublic.getIndiceElementParFiltre(
				(aElement) => {
					return (
						aElement.getNumero() === lElmDemandeur.getNumero() &&
						aElement.getGenre() === lElmDemandeur.getGenre()
					);
				},
			);
		}
		_resetPublic.call(this, lIndice);
		this.estSelectionSurveillant = false;
		this.getInstance(this.identFenetreDemandeur).setOptionsFenetre({
			titre: GTraductions.getValeur("punition.selectionDemandeur"),
		});
		this.getInstance(this.identFenetreDemandeur).setDonnees(
			new DonneesListe_SelectionDemandeur(this.donneesSaisie.listePublic),
			false,
			lIndice,
		);
	}
}
function _evntSurveillant(aGenreEvent) {
	if (
		(aGenreEvent === EEvent.SurKeyUp && GNavigateur.isToucheSelection()) ||
		aGenreEvent === EEvent.SurMouseDown
	) {
		const lProgrammationEffectif =
			this.programmationSelectionne.report &&
			this.programmationSelectionne.report.existe()
				? this.programmationSelectionne.report
				: this.programmationSelectionne;
		const lSurveillant = lProgrammationEffectif.surveillant;
		let lIndice = -1;
		if (lSurveillant) {
			lIndice = this.donneesSaisie.listePublic.getIndiceElementParFiltre(
				(aElement) => {
					return (
						aElement.getNumero() === lSurveillant.getNumero() &&
						aElement.getGenre() === lSurveillant.getGenre()
					);
				},
			);
		}
		_resetPublic.call(this, lIndice);
		this.estSelectionSurveillant = true;
		this.getInstance(this.identFenetreDemandeur).setOptionsFenetre({
			titre: GTraductions.getValeur("punition.selectionSurveillant"),
		});
		this.getInstance(this.identFenetreDemandeur).setDonnees(
			new DonneesListe_SelectionDemandeur(this.donneesSaisie.listePublic),
			false,
			lIndice,
		);
	}
}
function _resetPublic(aIndiceSelection) {
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
function _evntSurDate(aDate) {
	let lDateCalcul = new Date(
		this.punition.dateDemande.getFullYear(),
		this.punition.dateDemande.getMonth(),
		this.punition.dateDemande.getDate(),
	);
	let lPlace = GDate.dateEnPlaceAnnuelle(lDateCalcul);
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
		GParametres.JoursFeries.getValeur(
			GDate.getNbrJoursEntreDeuxDates(
				IE.Cycles.dateDebutPremierCycle(),
				aDate,
			) + 1,
		)
	) {
		GApplication.getMessage().afficher({
			type: EGenreBoiteMessage.Information,
			message: GTraductions.getValeur("punition.estUnJourFerie", [
				GDate.formatDate(aDate, "%JJ/%MM/%AAAA"),
			]),
		});
		_actualiserPunition.call(this);
	} else if (!GDate.estUnJourOuvre(aDate)) {
		GApplication.getMessage().afficher({
			type: EGenreBoiteMessage.Information,
			message: GTraductions.getValeur("punition.pasUnJourOuvre", [
				GDate.formatDate(aDate, "%JJ/%MM/%AAAA"),
			]),
		});
		_actualiserPunition.call(this);
	} else if (!GDate.estDateEgale(lDate, this.punition.dateDemande)) {
		this.punition.dateDemande = lDate;
		lDateCalcul = new Date(
			this.punition.dateDemande.getFullYear(),
			this.punition.dateDemande.getMonth(),
			this.punition.dateDemande.getDate(),
		);
		lPlace = GDate.dateEnPlaceAnnuelle(lDateCalcul);
		this.punition.placeDemande = lPlace + lPlaceJour;
		_actualiserDatesSaisissable.call(this);
		this.punition.setEtat(EGenreEtat.Modification);
		this.setEtatSaisie(true);
		this.getInstance(this.identPunitions).actualiser(true);
	}
}
function _evntSurDateDevoir(aDate) {
	if (
		GParametres.JoursFeries.getValeur(
			GDate.getNbrJoursEntreDeuxDates(
				IE.Cycles.dateDebutPremierCycle(),
				aDate,
			) + 1,
		)
	) {
		GApplication.getMessage().afficher({
			type: EGenreBoiteMessage.Information,
			message: GTraductions.getValeur("punition.estUnJourFerie", [
				GDate.formatDate(aDate, "%JJ/%MM/%AAAA"),
			]),
		});
		_actualiserPunition.call(this);
	} else if (!GDate.estUnJourOuvre(aDate)) {
		GApplication.getMessage().afficher({
			type: EGenreBoiteMessage.Information,
			message: GTraductions.getValeur("punition.pasUnJourOuvre", [
				GDate.formatDate(aDate, "%JJ/%MM/%AAAA"),
			]),
		});
		_actualiserPunition.call(this);
	} else if (
		this.punition &&
		this.punition.nature.getGenre() === TypeGenrePunition.GP_Devoir
	) {
		let lProg;
		if (this.punition.programmations) {
			lProg = this.punition.programmations.getPremierElement();
		}
		if (!lProg) {
			lProg = new ObjetElement("");
		}
		if (
			!lProg.dateExecution ||
			!GDate.estDateEgale(aDate, lProg.dateExecution)
		) {
			lProg.dateExecution = aDate;
			_actualiserDatesSaisissable.call(this);
			lProg.setEtat(EGenreEtat.Modification);
			this.punition.setEtat(EGenreEtat.Modification);
			this.setEtatSaisie(true);
		}
	}
}
function _evntSurDateProgrammation(aDate) {
	if (
		GParametres.JoursFeries.getValeur(
			GDate.getNbrJoursEntreDeuxDates(
				IE.Cycles.dateDebutPremierCycle(),
				aDate,
			) + 1,
		)
	) {
		GApplication.getMessage().afficher({
			type: EGenreBoiteMessage.Information,
			message: GTraductions.getValeur("punition.estUnJourFerie", [
				GDate.formatDate(aDate, "%JJ/%MM/%AAAA"),
			]),
		});
		_actualiserProgrammation.call(this, this.programmationSelectionne);
	} else if (!GDate.estUnJourOuvre(aDate)) {
		GApplication.getMessage().afficher({
			type: EGenreBoiteMessage.Confirmation,
			message: GTraductions.getValeur("punition.saisieSurUnJourNonOuvre", [
				GDate.formatDate(aDate, "%JJ/%MM/%AAAA"),
			]),
			callback: function (aAccepte) {
				if (aAccepte === EGenreAction.Valider) {
					_affecterDateProgrammation.call(this, aDate);
				} else {
					_actualiserProgrammation.call(this, this.programmationSelectionne);
				}
			}.bind(this),
		});
	} else if (this.punition && this.programmationSelectionne) {
		_affecterDateProgrammation.call(this, aDate);
	}
}
function _affecterDateProgrammation(aDate) {
	let lProg;
	if (
		this.programmationSelectionne.report &&
		this.programmationSelectionne.report.existe()
	) {
		lProg = this.programmationSelectionne.report;
	} else {
		lProg = this.programmationSelectionne;
	}
	if (!lProg.dateExecution || !GDate.estDateEgale(aDate, lProg.dateExecution)) {
		if (
			!_existePunitionProgrammationChevauchant.call(this, {
				numero: this.programmationSelectionne.getNumero(),
				date: aDate,
				place: lProg.placeExecution,
				duree: this.programmationSelectionne.duree,
			})
		) {
			lProg.dateExecution = aDate;
			_actualiserDatesSaisissable.call(this);
			lProg.setEtat(EGenreEtat.Modification);
			this.programmationSelectionne.setEtat(EGenreEtat.Modification);
			this.punition.setEtat(EGenreEtat.Modification);
			this.setEtatSaisie(true);
		} else {
			_afficherMessageExisteAutresProgrammations.call(this);
		}
	}
}
function _evntSurDateRealisation(aDate) {
	if (this.punition && this.programmationSelectionne) {
		this.programmationSelectionne.dateRealisation = aDate;
		_actualiserDatesSaisissable.call(this);
		this.programmationSelectionne.setEtat(EGenreEtat.Modification);
		this.punition.setEtat(EGenreEtat.Modification);
		this.setEtatSaisie(true);
	}
}
function _evntSurHeureProgrammation(aParams) {
	if (
		aParams.genreEvenement === EGenreEvenementObjetSaisie.selection &&
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
				!_existePunitionProgrammationChevauchant.call(this, {
					numero: this.programmationSelectionne.getNumero(),
					date: lProg.dateExecution,
					place: lPlace,
					duree: this.programmationSelectionne.duree,
				})
			) {
				lProg.place = lPlace;
				lProg.placeExecution = lPlace;
				lProg.setEtat(EGenreEtat.Modification);
				this.programmationSelectionne.setEtat(EGenreEtat.Modification);
				this.punition.setEtat(EGenreEtat.Modification);
				this.setEtatSaisie(true);
			} else {
				_afficherMessageExisteAutresProgrammations.call(this);
			}
		}
	}
}
function _afficherMessageExisteAutresProgrammations() {
	GApplication.getMessage().afficher({
		type: EGenreBoiteMessage.Information,
		message: GTraductions.getValeur("punition.message.autresProgs"),
	});
	_actualiserProgrammation.call(this, this.programmationSelectionne);
}
function _existePunitionProgrammationChevauchant(aParams) {
	let lResult = false;
	aParams.nbrPlaces = aParams.duree
		? GDate.minutesEnNombrePlaces(aParams.duree)
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
					const lNbrPlaces = lDuree ? GDate.minutesEnNombrePlaces(lDuree) : 0;
					if (lProg.report && lProg.report.existe()) {
						lDate = lProg.report.dateExecution;
						lPlace = lProg.report.placeExecution;
					}
					const lPlaceFin = lPlace + lNbrPlaces;
					if (GDate.estDateEgale(lDate, aParams.date) && lNbrPlaces > 0) {
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
								(aParams.placeFin > lPlace && aParams.placeFin <= lPlaceFin) ||
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
function _evntSurDureeProgrammation(aParams) {
	if (
		aParams.genreEvenement === EGenreEvenementObjetSaisie.selection &&
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
			!_existePunitionProgrammationChevauchant.call(this, {
				numero: this.programmationSelectionne.getNumero(),
				date: lProg.dateExecution,
				place: lProg.placeExecution,
				duree: aParams.element.getGenre(),
			})
		) {
			this.programmationSelectionne.duree = aParams.element.getGenre();
			this.programmationSelectionne.setEtat(EGenreEtat.Modification);
			this.punition.setEtat(EGenreEtat.Modification);
			this.setEtatSaisie(true);
		} else {
			_afficherMessageExisteAutresProgrammations.call(this);
		}
	}
}
function _evntSurLieuProgrammation(aParams) {
	if (
		aParams.genreEvenement === EGenreEvenementObjetSaisie.selection &&
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
		if (!lProg.lieu || lProg.lieu.getNumero() !== aParams.element.getNumero()) {
			lProg.lieu = aParams.element;
			lProg.setEtat(EGenreEtat.Modification);
			this.programmationSelectionne.setEtat(EGenreEtat.Modification);
			this.punition.setEtat(EGenreEtat.Modification);
			this.setEtatSaisie(true);
		}
	}
}
function _evntSurHeure(aParams) {
	if (
		aParams.genreEvenement === EGenreEvenementObjetSaisie.selection &&
		this.punition
	) {
		this.punition.place = aParams.element.getGenre();
		this.punition.horsCours = aParams.element.getGenre() === -1;
		if (aParams.element.getGenre() !== -1) {
			const lPlace = GDate.dateEnPlaceAnnuelle(this.punition.dateDemande);
			this.punition.placeDemande = lPlace + aParams.element.getGenre();
		} else {
			this.punition.placeDemande = 0;
		}
		this.punition.setEtat(EGenreEtat.Modification);
		this.setEtatSaisie(true);
	}
}
function _evnCMS_Motifs(aNumeroBouton, aListeDonnees, aListeTot) {
	if (aNumeroBouton === 1) {
		const lArrInitial = this.punition.motifs.getTableauNumeros();
		const lArrNew = aListeDonnees.getTableauNumeros();
		if (
			!MethodesTableau.inclus(lArrInitial, lArrNew) ||
			!MethodesTableau.inclus(lArrNew, lArrInitial)
		) {
			this.punition.motifs = aListeDonnees;
			const lAvecMotifDossierObligatoire =
				this.punition.motifs.getIndiceElementParFiltre((aElement) => {
					return aElement.dossierObligatoire;
				}) > -1;
			if (!this.punition.avecDossier && lAvecMotifDossierObligatoire) {
				this.punition.avecDossier = true;
				this.punition.publicationDossier =
					this.punition.motifs.getIndiceElementParFiltre((aElement) => {
						return aElement.publication;
					}) > -1;
			}
			if (!estPunitionPubliee(this.punition)) {
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
					this.punition.datePublication = GDate.getDateCourante();
				}
			}
			this.punition.avecModifMotif = true;
			this.punition.setEtat(EGenreEtat.Modification);
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
function _evntSurDuree(aParams) {
	if (
		aParams.genreEvenement === EGenreEvenementObjetSaisie.selection &&
		this.punition &&
		this.punition.duree !== aParams.element.getGenre()
	) {
		this.punition.duree = aParams.element.getGenre();
		this.punition.setEtat(EGenreEtat.Modification);
		this.setEtatSaisie(true);
	}
}
function _evntSurAccompagnateur(aParams) {
	if (
		aParams.genreEvenement === EGenreEvenementObjetSaisie.selection &&
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
			this.punition.setEtat(EGenreEtat.Modification);
			this.setEtatSaisie(true);
		}
	}
}
function _evntFenetreSignalement(
	aGenreBouton,
	aSelection,
	aAvecChangementListe,
) {
	if (aGenreBouton === 1) {
		if (aAvecChangementListe) {
			this.donneesSaisie.motifs = MethodesObjet.dupliquer(this.tempMotifs);
			this.donneesSaisie.motifs.parcourir((aElement) => {
				aElement.cmsActif = false;
			});
		}
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
			_evntSelection.call(this, lIndiceEff);
		}
	}
}
function _evntFenetreDuree(aGenreBouton, aSelection) {
	if (aGenreBouton === 1 && this.programmationSelectionne) {
		const lElement = this.donneesSaisie.durees.get(aSelection);
		if (this.programmationEstEnCreation) {
			this.programmationSelectionne = new ObjetElement(lElement.getLibelle());
			this.punition.programmations.addElement(this.programmationSelectionne);
			this.punition.programmations.setTri([
				ObjetTri.init((D) => {
					const lProgrammationEffectif =
						D.report && D.report.existe() ? D.report : D;
					if (lProgrammationEffectif.dateExecution) {
						return 0;
					} else {
						return 1;
					}
				}),
				ObjetTri.init((D) => {
					const lProgrammationEffectif =
						D.report && D.report.existe() ? D.report : D;
					return lProgrammationEffectif.dateExecution;
				}),
				ObjetTri.init((D) => {
					const lProgrammationEffectif =
						D.report && D.report.existe() ? D.report : D;
					if (lProgrammationEffectif.placeExecution) {
						return 0;
					} else {
						return 1;
					}
				}),
				ObjetTri.init((D) => {
					const lProgrammationEffectif =
						D.report && D.report.existe() ? D.report : D;
					return lProgrammationEffectif.placeExecution;
				}),
				ObjetTri.init("Libelle"),
			]);
			this.punition.programmations.trier();
		}
		this.programmationSelectionne.duree = lElement.getGenre();
		this.programmationSelectionne.etatProgrammation = Type3Etats.TE_Inconnu;
		this.programmationSelectionne.setLibelle(lElement.getLibelle());
		this.programmationSelectionne.setEtat(EGenreEtat.Modification);
		this.punition.setEtat(EGenreEtat.Modification);
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
function _evntFenetreSousCategorieDossier(aGenreBouton, aSelection) {
	const lFenetre = this.getInstance(this.identFenetreSignalement);
	if (aGenreBouton === 1) {
		const lIncident =
			this.donneesSaisie.listeSousCategorieDossier.get(aSelection);
		lFenetre.getInstance(lFenetre.identListe).ajouterElementCreation(lIncident);
	} else {
		lFenetre.getInstance(lFenetre.identListe).annulerCreation();
	}
}
function _evntFenetreDemandeurSurveillant(
	aGenreBouton,
	aSelection,
	aAvecChangementListe,
) {
	if (this.estSelectionSurveillant) {
		_evntFenetreSurveillant.call(
			this,
			aGenreBouton,
			aSelection,
			aAvecChangementListe,
		);
	} else {
		_evntFenetreDemandeur.call(
			this,
			aGenreBouton,
			aSelection,
			aAvecChangementListe,
		);
	}
}
function _evntFenetreSurveillant(aGenreBouton, aSelection) {
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
			lProgrammationEffectif.setEtat(EGenreEtat.Modification);
			this.programmationSelectionne.setEtat(EGenreEtat.Modification);
			this.punition.setEtat(EGenreEtat.Modification);
			this.setEtatSaisie(true);
		}
		let lLibelle = "";
		if (lProgrammationEffectif.surveillant) {
			lLibelle = lProgrammationEffectif.surveillant.getLibelle();
		}
		this.getInstance(this.identSurveillant).setLibelle(lLibelle);
	}
}
function _evntFenetreDemandeur(aGenreBouton, aSelection) {
	if (aGenreBouton === 1 && this.punition) {
		const lElm = this.donneesSaisie.listePublic.get(aSelection);
		if (!!lElm) {
			if (lElm.estAucun) {
				this.punition.professeurDemandeur = null;
				this.punition.personnelDemandeur = null;
			} else if (!lElm.estUnDeploiement) {
				if (lElm.Genre === EGenreRessource.Enseignant) {
					this.punition.professeurDemandeur = lElm;
					this.punition.personnelDemandeur = null;
				} else if (lElm.Genre === EGenreRessource.Personnel) {
					this.punition.personnelDemandeur = lElm;
					this.punition.professeurDemandeur = null;
				}
			}
			this.punition.setEtat(EGenreEtat.Modification);
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
function _evntSelecteurPJ(aParam) {
	switch (aParam.evnt) {
		case ObjetSelecteurPJCP.genreEvnt.selectionPJ:
			if (this.punition) {
				this.listePJ.addElement(aParam.fichier);
				this.punition.setEtat(EGenreEtat.Modification);
				IE.log.addLog("_evntSelecteurPJ.selectionPJ");
				this.setEtatSaisie(true);
			}
			break;
		case ObjetSelecteurPJCP.genreEvnt.suppressionPJ:
			if (this.punition) {
				this.punition.setEtat(EGenreEtat.Modification);
				IE.log.addLog("_evntSelecteurPJ.suppressionPJ");
				this.setEtatSaisie(true);
			}
			break;
		default:
			break;
	}
}
function _evntSelecteurPJTAF(aParam) {
	switch (aParam.evnt) {
		case ObjetSelecteurPJCP.genreEvnt.selectionPJ:
			if (this.punition) {
				this.listePJ.addElement(aParam.fichier);
				this.punition.setEtat(EGenreEtat.Modification);
				IE.log.addLog("_evntSelecteurPJ.selectionPJ");
				this.setEtatSaisie(true);
			}
			break;
		case ObjetSelecteurPJCP.genreEvnt.suppressionPJ:
			if (this.punition) {
				this.punition.setEtat(EGenreEtat.Modification);
				IE.log.addLog("_evntSelecteurPJ.suppressionPJ");
				this.setEtatSaisie(true);
			}
			break;
		default:
			break;
	}
}
function composeBandeauGauche() {
	const T = [];
	T.push(`<div class="div-header fluid-bloc">`);
	T.push(
		`<h1 tabindex="0" class="titre-onglet" id="${this.idBandeauGauche}">${GEtatUtilisateur.getLibelleOnglet()}</h1>`,
	);
	T.push(
		`<div class="flex-contain flex-center flex-gap" id="${this.getInstance(this.identTripleCombo).getNom()}"></div>`,
	);
	T.push(`</div>`);
	return T.join("");
}
function composeBandeauDroite() {
	const T = [];
	T.push(`<div class="div-header fluid-bloc">`);
	T.push(
		`<h2 id="${this.idBandeauDroite}">\n <span id="${this.idBandeauDroite}_Texte"></span></h2>`,
	);
	T.push(`</div>`);
	return T.join("");
}
function _composeTitreSection(aMessage, aAvecMargeHaut, aIETexte, aIEDisplay) {
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
function _composeDetail() {
	const H = [];
	H.push('<div id="', this.idReponse, '_detail">');
	H.push('<div class="p-top-l" id="', this.idReponse, '_fils1">');
	H.push(
		_composeTitreSection(
			GTraductions.getValeur("punition.circonstances"),
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
		GTraductions.getValeur("punition.titre.Demandeur"),
		"</label>",
		'<div id="',
		this.getNomInstance(this.identDemandeur),
		'"></div>',
		"</div>",
	);
	H.push(
		'<div class="m-right">',
		'<label class="m-bottom">',
		GTraductions.getValeur("punition.titre.Date"),
		"</label>",
		'<div id="',
		this.getNomInstance(this.identDate),
		'"></div>',
		"</div>",
	);
	H.push(
		'<div class="m-right">',
		'<label class="m-bottom">',
		GTraductions.getValeur("punition.heure"),
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
		GTraductions.getValeur("punition.motifs"),
		"</label>",
		'<div id="',
		this.getNomInstance(this.identCMS_Motifs),
		'"></div>',
		"</div>",
	);
	const lIdDetails = GUID.getId();
	H.push(
		'<div class="p-top-l">',
		'<label for="',
		lIdDetails,
		'" class="bloc-contain m-bottom">',
		GTraductions.getValeur("punition.detailsCirconstances"),
		"</label>",
		'<ie-textareamax id="',
		lIdDetails,
		'" ie-model="circonstance" ie-event="change->eventChange" maxlength="',
		this.donneesSaisie.tailleCirconstance,
		'" class="round-style TextePunitionCirconstance" style="',
		GStyle.composeWidth(700),
		GStyle.composeHeight(120),
		'"></ie-textareamax>',
		"</div>",
	);
	H.push(
		'<div class="pj-global-conteneur no-line p-y-l" id="',
		this.getNomInstance(this.identSelecteurPJ),
		'"></div>',
	);
	H.push(
		_composeTitreSection(GTraductions.getValeur("punition.suiteDonnee"), true),
	);
	H.push(_composeSuitePunition.call(this, this.punition));
	H.push(_composeSuiteDevoir.call(this, this.punition));
	const lIdTAF = GUID.getId();
	H.push(
		'<div class="p-top-l">',
		'<label for="',
		lIdTAF,
		'" class="bloc-contain m-bottom">',
		GTraductions.getValeur("punition.titre.taf"),
		"</label>",
		'<ie-textareamax id="',
		lIdTAF,
		'" ie-model="taf" ie-event="change->eventChange" maxlength="',
		this.donneesSaisie.tailleTravailAFaire,
		'" class="round-style TextePunitionTAF" style="',
		GStyle.composeWidth(700),
		GStyle.composeHeight(120),
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
		GTraductions.getValeur("punition.publierUniquementDebutRetenue"),
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
		GStyle.composeWidth(92),
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
		GTraductions.getValeur("punition.uneSeance"),
		"</ie-radio>",
		"</div>",
		'<div class="m-right-l" ie-display="nature.peutEtreMultiSeances">',
		'<ie-radio ie-model="rbMultiSeances(',
		true,
		')">',
		GTraductions.getValeur("punition.plusieursSeances"),
		"</ie-radio>",
		"</div>",
		"</div>",
	);
	H.push('<div class="flex-contain cols">');
	H.push('<div class="flex-contain flex-gap-l m-bottom-l">');
	H.push(
		'<div class="flex-contain cols">',
		'<label class="m-bottom">',
		GTraductions.getValeur("punition.titre.Date"),
		"</label>",
		'<div id="',
		this.getNomInstance(this.identDateProgrammation),
		'"></div>',
		"</div>",
	);
	H.push(
		'<div class="flex-contain cols">',
		'<label class="m-bottom">',
		GTraductions.getValeur("punition.heure"),
		"</label>",
		'<div id="',
		this.getNomInstance(this.identHeureProgrammation),
		'"></div>',
		"</div>",
	);
	H.push(
		'<ie-checkbox class="self-end m-bottom" ie-model="cbReport">',
		GTraductions.getValeur("punition.titre.Reportee"),
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
		GTraductions.getValeur("punition.surveillant"),
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
		GTraductions.getValeur("punition.duree"),
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
		GTraductions.getValeur("punition.salle"),
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
		_composeTitreSection(GTraductions.getValeur("punition.realisation"), true),
	);
	H.push('<div class="flex-contain flex-gap-l">');
	H.push(
		'<ie-checkbox ie-model="cbRealiseLe">',
		GTraductions.getValeur("punition.titre.RealiseLe"),
		"</ie-checkbox>",
	);
	H.push(
		'<div id="',
		this.getNomInstance(this.identDateRealisation),
		'"></div>',
	);
	H.push(
		'<ie-checkbox ie-model="cbNonRealise">',
		GTraductions.getValeur("punition.nonRealise"),
		"</ie-checkbox>",
	);
	H.push("</div>");
	H.push(
		'<div class="flex-contain cols flex-gap">',
		"<label>",
		GTraductions.getValeur("punition.commentaire"),
		"</label>",
		'<ie-textareamax ie-model="commentaire" ie-event="change->eventChange" maxlength="',
		this.donneesSaisie.tailleCommentaire,
		'" class="round-style TextePunitionCommentaire" style="',
		GStyle.composeWidth(700),
		GStyle.composeHeight(60),
		'"></ie-textareamax>',
		"</div>",
	);
	H.push("</div>");
	H.push("</div>");
	H.push("</div>");
	H.push("</div>");
	const lAvecPublicationDossier =
		GEtatUtilisateur.GenreEspace === EGenreEspace.Etablissement
			? this._autorisations.avecPublicationPunitions
			: this._autorisations.avecPublicationDossier;
	if (lAvecPublicationDossier || this._autorisations.avecPublicationPunitions) {
		H.push(
			_composeTitreSection(
				GTraductions.getValeur("punition.prevenirResponsables"),
				true,
				null,
				"nature.avecDossierPlus",
			),
		);
		if (lAvecPublicationDossier) {
			H.push(
				'<div ie-display="nature.avecDossier" class="flex-contain flex-center p-y-l flex-gap-l" style="min-width: 435px;">',
				'<ie-checkbox ie-model="cbPublierElementDossier">',
				GTraductions.getValeur("punition.publierElementPunitionDossier"),
				"</ie-checkbox>",
				'<i ie-class="imageDossier"></i>',
				"</div>",
			);
		}
		if (this._autorisations.avecPublicationPunitions) {
			H.push('<div class="p-y-l" style="min-width: 435px;">');
			H.push(
				'<div class="flex-contain flex-gap-l">',
				'<ie-checkbox ie-model="cbPublierPunition">',
				GTraductions.getValeur("punition.publierPunition"),
				"</ie-checkbox>",
				'<i ie-class="getClasseCssImagePublication" ie-hint="getHintImagePublication"></i>',
				"</div>",
			);
			H.push(
				'<div class="p-top-l flex-contain flex-center flex-gap-l">',
				'<span class="fix-bloc">',
				GTraductions.getValeur("Le_Maj"),
				"</span>",
				`<div style="width:10rem;"><ie-btnselecteur ie-model="modelSelecteurDatePublication" aria-label="${GTraductions.getValeur("Le_Maj")}"></ie-btnselecteur></div>`,
				"</div>",
			);
			H.push("</div>");
		}
	}
	if (GApplication.droits.get(TypeDroits.actualite.avecSaisieActualite)) {
		H.push(
			_composeTitreSection(
				GTraductions.getValeur("punition.diffuserInformation"),
				true,
			),
		);
		H.push(
			'<div class="flex-contain flex-center p-y-l">',
			' <label class="m-right" >',
			GTraductions.getValeur("punition.informerEquipePedagogique"),
			"</label>",
			UtilitaireBoutonBandeau.getHtmlBtnDiffuserInformation(
				"boutonInformation",
				GTraductions.getValeur("punition.informerEquipePedagogique"),
			),
			' <div class="flex-contain flex-center p-x-l" ie-display="messageEnvoye">',
			' <label class="m-right">',
			GTraductions.getValeur("punition.messageEnvoye"),
			"</label>",
			' <div class="Image_DestinataireCourrier"></div>',
			"</div>",
			"</div>",
		);
	}
	H.push("</div>");
	return H.join("");
}
function _composeSuitePunition() {
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
		GTraductions.getValeur("punition.accompagnateur"),
		"</label>",
		'<div id="',
		this.getNomInstance(this.identAccompagnateur),
		'"></div>',
		"</div>",
	);
	H.push("</div>");
	return H.join("");
}
function _composeSuiteDevoir() {
	const H = [];
	H.push('<div ie-display="nature.devoir" class="NoWrap">');
	H.push(
		'<div class="InlineBlock AlignementMilieuVertical PetitEspaceDroit"><label>',
		GTraductions.getValeur("punition.devoirSuplementaireARendre"),
		"</label></div>",
		'<div class="InlineBlock AlignementMilieuVertical GrandEspaceDroit" id="',
		this.getNomInstance(this.identDateDevoir),
		'"></div>',
	);
	H.push("</div>");
	return H.join("");
}
function _actionApresRequeteListesPourSaisiePunitions(aJSON) {
	if (aJSON.motifs) {
		this.donneesSaisie.motifs = aJSON.motifs;
	}
	if (aJSON.lieux) {
		this.donneesSaisie.lieux = aJSON.lieux;
	}
	this.donneesSaisie.lieux.insererElement(
		new ObjetElement(GTraductions.getValeur("Aucune"), 0, -1),
		0,
	);
	const lLieu = new ObjetElement("Lieu", 0, EGenreRessource.LieuDossier);
	lLieu.estCumul = true;
	lLieu.AvecSelection = false;
	lLieu.Position = 0;
	const lSalle = new ObjetElement(
		GTraductions.getValeur("Salle"),
		0,
		EGenreRessource.Salle,
	);
	lSalle.estCumul = true;
	lSalle.AvecSelection = false;
	lSalle.Position = 0;
	this.donneesSaisie.lieux.insererElement(lLieu, 1);
	this.donneesSaisie.lieux.insererElement(lSalle, 2);
	this.donneesSaisie.lieux.parcourir((aLieu) => {
		if (aLieu.existeNumero()) {
			if (aLieu.getGenre() === EGenreRessource.LieuDossier) {
				aLieu.Pere = lLieu;
			}
			if (aLieu.getGenre() === EGenreRessource.Salle) {
				aLieu.Pere = lSalle;
			}
		}
	});
	this.donneesSaisie.lieux.setTri([
		ObjetTri.init("Genre"),
		ObjetTri.init((D) => {
			return D.existeNumero();
		}),
		ObjetTri.init("Position"),
	]);
	this.donneesSaisie.lieux.trier();
	if (aJSON.punitions) {
		this.donneesSaisie.punitions = aJSON.punitions;
	}
	if (aJSON.listeSousCategorieDossier) {
		this.donneesSaisie.listeSousCategorieDossier =
			aJSON.listeSousCategorieDossier;
	}
	this.donneesSaisie.listePublic = new ObjetListeElements();
	new ObjetRequeteListePublics(
		this,
		_evntListePublicApresRequete.bind(this),
	).lancerRequete({
		genres: [EGenreRessource.Enseignant, EGenreRessource.Personnel],
		sansFiltreSurEleve: true,
		avecFonctionPersonnel: true,
	});
}
function _evntListePublicApresRequete(aDonnees) {
	this.donneesSaisie.listePublic = MethodesObjet.dupliquer(
		aDonnees.listePublic,
	);
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
	this.donneesSaisie.listePublic.parcourir((aPublic) => {
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
		this.donneesSaisie.listePublic.addElement(lElement);
	}
	if (lAvecIndefini) {
		this.donneesSaisie.listePublic.addElement(lPereIndefini);
	}
	if (lAvecProf) {
		this.donneesSaisie.listePublic.addElement(lPereProf);
	}
	const lElmAucun = new ObjetElement(
		GTraductions.getValeur("punition.selection.Aucun"),
		null,
		0,
		0,
	);
	lElmAucun.estAucun = true;
	this.donneesSaisie.listePublic.addElement(lElmAucun);
	this.donneesSaisie.listePublic.setTri([
		ObjetTri.init((D) => {
			return D.estAucun || D.estUnDeploiement ? D.Genre : D.pere.Genre;
		}),
		ObjetTri.init("Position"),
		ObjetTri.init("Libelle"),
	]);
	this.donneesSaisie.listePublic.trier();
}
function _actionApresRequeteListePunitions(aJSON) {
	this.documents = aJSON.documents;
	this.listePunitions = aJSON.listePunitions;
	this.listePunitions.parcourir((aPunition) => {
		if (aPunition.horsCours) {
			aPunition.place = -1;
		} else {
			aPunition.place = aPunition.placeDemande % GParametres.PlacesParJour;
		}
		if (aPunition.programmations) {
			aPunition.programmations.avecAuMoinsUneProgrammation = function () {
				for (let I = 0; I < this.count(); I++) {
					const lElement = this.get(I);
					if (
						lElement.existe() &&
						lElement.dateExecution &&
						GDate.estDateValide(lElement.dateExecution)
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
						aProgrammation.placeExecution % GParametres.PlacesParJour;
				} else {
					aProgrammation.place = undefined;
				}
			});
		}
		if (!aPunition.documentsTAF) {
			aPunition.documentsTAF = new ObjetListeElements();
		}
		if (!aPunition.documents) {
			aPunition.documents = new ObjetListeElements();
		}
	});
	this.listePunitions.setTri([
		ObjetTri.init("dateDemande", EGenreTriElement.Decroissant),
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
		new DonneesListe_SaisiePunitions(this.listePunitions, this._autorisations),
		lIndiceEff,
	);
	if (this.punition) {
		_actualiserPunition.call(this);
		if (this.demandeOuvertureFenetreEditionInformation) {
			this.demandeOuvertureFenetreEditionInformation = false;
			this.ouvrirFenetreEditionInformation();
		}
	}
}
function _creerNouvellePunition(aEleveSelectionne) {
	const lPunition = new ObjetElement("", null, EGenreRessource.Punition);
	lPunition.dateDemande = GDate.getDateCourante();
	lPunition.horsCours = false;
	lPunition.place = -1;
	const lDemandeur = GEtatUtilisateur.getUtilisateur();
	if (lDemandeur.getGenre() === EGenreRessource.Enseignant) {
		lPunition.professeurDemandeur = lDemandeur;
		lPunition.personnelDemandeur = undefined;
	} else if (lDemandeur.getGenre() === EGenreRessource.Personnel) {
		lPunition.professeurDemandeur = undefined;
		lPunition.personnelDemandeur = lDemandeur;
	}
	lPunition.motifs = new ObjetListeElements();
	lPunition.programmations = new ObjetListeElements();
	lPunition.documentsTAF = new ObjetListeElements();
	lPunition.documents = new ObjetListeElements();
	lPunition.eleve = aEleveSelectionne;
	return lPunition;
}
function estPunitionPubliee(aPunition) {
	return aPunition && aPunition.datePublication;
}
function setDatePublicationPunition(aPunition, aDatePublication) {
	aPunition.datePublication = aDatePublication;
	aPunition.setEtat(EGenreEtat.Modification);
	this.setEtatSaisie(true);
	this.getInstance(this.identPunitions).actualiser(true);
}
function _actualiserProgrammation(aProgrammationSelectionne) {
	const lAvecSaisie = this._autorisations.saisie && this.punition;
	let lProgrammationEffectif;
	if (aProgrammationSelectionne) {
		this.programmationSelectionne = aProgrammationSelectionne;
	} else if (this.punition.programmations.avecAuMoinsUneProgrammation()) {
		this.programmationSelectionne =
			this.punition.programmations.getPremierElement();
	} else {
		this.programmationSelectionne = new ObjetElement("");
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
	const lListe = GParametres.LibellesHeures.getListeElements();
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
			this.programmationSelectionne.etatProgrammation === Type3Etats.TE_Oui,
	);
	this.getInstance(this.identDateRealisation).setDonnees(
		this.programmationSelectionne.dateRealisation,
	);
}
function _actualiserDatesSaisissable() {
	let lDatePremier = window.GParametres.PremiereDate;
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
	let lDateDernier = window.GParametres.DerniereDate;
	for (let i = 0; i < this.punition.programmations.count(); i++) {
		const lProg = this.punition.programmations.get(i);
		if (
			lProg.dateExecution &&
			GDate.estAvantJour(lProg.dateExecution, lDateDernier)
		) {
			lDateDernier = lProg.dateExecution;
		}
		if (
			lProg.dateRealisation &&
			GDate.estAvantJour(lProg.dateRealisation, lDateDernier)
		) {
			lDateDernier = lProg.dateRealisation;
		}
		if (
			lProg.report &&
			lProg.report.existe() &&
			lProg.report.dateExecution &&
			GDate.estAvantJour(lProg.report.dateRealisation, lDateDernier)
		) {
			lDateDernier = lProg.report.dateRealisation;
		}
	}
	this.getInstance(this.identDate).setOptionsObjetCelluleDate({
		derniereDate: lDateDernier,
	});
}
function _actualiserPunition() {
	if (this.punition) {
		this.donneesSaisie.durees = new ObjetListeElements();
		this.donneesSaisie.accompagnateurs = new ObjetListeElements();
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
			this.punition.nature.getGenre() === TypeGenrePunition.GP_ExclusionCours
		) {
			this.donneesSaisie.accompagnateurs.addElement(
				new ObjetElement("", undefined, -1),
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
		_setTexteBandeau.bind(this)(lLibelle);
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
		const lListe = GParametres.LibellesHeures.getListeElements(
			(aElement, aIndice) => {
				return aIndice <= GParametres.PlacesParJour - 1;
			},
		);
		if (
			this.punition.nature.getGenre() !== TypeGenrePunition.GP_ExclusionCours
		) {
			const lHorsCours = new ObjetElement(
				GTraductions.getValeur("punition.horsCours"),
				undefined,
				-1,
			);
			lListe.insererElement(lHorsCours, 0);
		}
		const lIndice = lListe.getIndiceParNumeroEtGenre(null, this.punition.place);
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
			: new ObjetListeElements();
		const lListePJ = this.punition.documents
			? this.punition.documents
			: new ObjetListeElements();
		this.getInstance(this.identSelecteurPJTAF).setActif(lAvecSaisie);
		this.getInstance(this.identSelecteurPJTAF).setOptions({
			genreRessourcePJ: EGenreRessource.DocJointEleve,
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
				? EGenreRessource.RelationIncidentFichierExterne
				: EGenreRessource.DocJointEleve,
		});
		this.getInstance(this.identSelecteurPJ).setDonnees({
			listePJ: lListePJ,
			listeTotale: this.documents,
			idContextFocus: this.Nom,
		});
		this.getInstance(this.identDuree).reset();
		this.getInstance(this.identDuree).setActif(lAvecSaisie);
		this.getInstance(this.identDuree).setDonnees(this.donneesSaisie.durees);
		this.getInstance(this.identDuree).initSelection(this._indicedureeExclusion);
		this.getInstance(this.identAccompagnateur).reset();
		this.getInstance(this.identAccompagnateur).setActif(lAvecSaisie);
		this.getInstance(this.identAccompagnateur).setDonnees(
			this.donneesSaisie.accompagnateurs,
		);
		this.getInstance(this.identAccompagnateur).initSelection(
			this._indiceAccompagnateur,
		);
		if (this.punition.nature.getGenre() === TypeGenrePunition.GP_Devoir) {
			if (this.punition.programmations.avecAuMoinsUneProgrammation()) {
				this.getInstance(this.identDateDevoir).setDonnees(
					this.punition.programmations.getPremierElement().dateExecution,
				);
			} else {
				this.getInstance(this.identDateDevoir).setDonnees();
			}
			this.getInstance(this.identDateDevoir).setActif(lAvecSaisie);
		} else if (this.punition.estPlanifiable && this.punition.estProgrammable) {
			_actualiserProgrammation.call(this);
		}
		_actualiserDatesSaisissable.call(this);
		this.setVisibilite();
		this.surResizeProgrammation(true);
		this.getInstance(this.identProgrammations).setDonnees(
			new DonneesListe_Simple(this.punition.programmations, {
				avecEdition: lAvecSaisie,
				avecEvnt_Edition: lAvecSaisie,
				avecEvnt_Creation: lAvecSaisie,
				avecEvnt_ApresSuppression: lAvecSaisie,
				avecSuppression: lAvecSaisie,
			}),
			0,
		);
	} else {
		$("#" + this.idReponse.escapeJQ() + "_detail").hide();
		if (this.eleveSelectionne) {
			_setTexteBandeau.bind(this)(
				GTraductions.getValeur("punition.selectionner"),
			);
		} else {
			_setTexteBandeau.bind(this)(
				GTraductions.getValeur("punition.selectionnerEleve"),
			);
		}
	}
}
module.exports = InterfaceSaisiePunitions;
