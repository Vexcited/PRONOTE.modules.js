exports.ObjetFenetre_ProjetAccompagnement = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetIdentite_1 = require("ObjetIdentite");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetDate_1 = require("ObjetDate");
const ObjetRequeteSaisieFicheEleve_1 = require("ObjetRequeteSaisieFicheEleve");
const ObjetSelecteurPJ_1 = require("ObjetSelecteurPJ");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const ObjetHtml_1 = require("ObjetHtml");
const GUID_1 = require("GUID");
const ObjetCelluleBouton_1 = require("ObjetCelluleBouton");
const ObjetCelluleBouton_2 = require("ObjetCelluleBouton");
const Enumere_Event_1 = require("Enumere_Event");
const ObjetFenetre_TypeProjetAccompagnement_1 = require("ObjetFenetre_TypeProjetAccompagnement");
const ObjetFenetre_MotifProjetAccompagnement_1 = require("ObjetFenetre_MotifProjetAccompagnement");
const MethodesObjet_1 = require("MethodesObjet");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_ProjetAccompagnement extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.setOptionsFenetre({
			largeur: 430,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			avecComposeBasInFooter: true,
		});
		this.enModification = false;
		this.ids = {
			pieceJointe: GUID_1.GUID.getId(),
			docsJoints: GUID_1.GUID.getId(),
		};
	}
	construireInstances() {
		this.selecDateDebut = ObjetIdentite_1.Identite.creerInstance(
			ObjetCelluleDate_1.ObjetCelluleDate,
			{
				pere: this,
				evenement: (aDate, aGenreBouton) => {
					if (aGenreBouton === 0) {
						delete this.projetAccompagnement.debut;
						this.projetAccompagnement.dateDebut = "";
						this.selecDateDebut.initialiser();
					} else {
						this.projetAccompagnement.debut = aDate;
						this.projetAccompagnement.dateDebut = ObjetDate_1.GDate.formatDate(
							aDate,
							"%JJ/%MM/%AAAA",
						);
					}
					this._initialiserSelecteurDate();
				},
			},
		);
		this.selecDateDebut.setOptionsObjetCelluleDate({
			largeurComposant: IE.estMobile ? 130 : 100,
			formatDate: "%JJ/%MM/%AAAA",
			placeHolder: ObjetTraduction_1.GTraductions.getValeur(
				"FicheEleve.DateDebut",
			),
			ariaLabel: ObjetTraduction_1.GTraductions.getValeur(
				"FicheEleve.DateDebut",
			),
		});
		this.selecDateFin = ObjetIdentite_1.Identite.creerInstance(
			ObjetCelluleDate_1.ObjetCelluleDate,
			{
				pere: this,
				evenement: (aDate, aGenreBouton) => {
					if (aGenreBouton === 0) {
						delete this.projetAccompagnement.fin;
						this.projetAccompagnement.dateFin = "";
						this.selecDateFin.initialiser();
					} else {
						this.projetAccompagnement.fin = aDate;
						this.projetAccompagnement.dateFin = ObjetDate_1.GDate.formatDate(
							aDate,
							"%JJ/%MM/%AAAA",
						);
					}
					this._initialiserSelecteurDate();
				},
			},
		);
		this.selecDateFin.setOptionsObjetCelluleDate({
			largeurComposant: IE.estMobile ? 130 : 100,
			formatDate: "%JJ/%MM/%AAAA",
			placeHolder:
				ObjetTraduction_1.GTraductions.getValeur("FicheEleve.DateFin"),
			ariaLabel: ObjetTraduction_1.GTraductions.getValeur("FicheEleve.DateFin"),
		});
		this.identSelecteurPJ = this.add(
			ObjetSelecteurPJ_1.ObjetSelecteurPJ,
			this._evntSelecteurPJ.bind(this),
			this._initSelecteurPJ.bind(this),
		);
		this.identType = this.add(
			ObjetCelluleBouton_1.ObjetCelluleBouton,
			this._evntType.bind(this),
			this._initType.bind(this),
		);
		this.identMotif = this.add(
			ObjetCelluleBouton_1.ObjetCelluleBouton,
			this._evntMotif.bind(this),
			this._initMotif.bind(this),
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			inputCommentaire: {
				getValue() {
					return aInstance.projetAccompagnement
						? aInstance.projetAccompagnement.commentaire
						: "";
				},
				setValue(aValue) {
					aInstance.projetAccompagnement.commentaire = aValue;
				},
			},
			cbConsultableEquipePeda: {
				getValue() {
					return aInstance.projetAccompagnement
						? aInstance.projetAccompagnement.consultableEquipePeda
						: false;
				},
				setValue(aValue) {
					aInstance.projetAccompagnement.consultableEquipePeda = aValue;
				},
				getDisplay: function () {
					return !aInstance.applicationSco.estPrimaire;
				},
			},
			getNodeSelecDate: function (aEstDateDebut) {
				const lInstanceDate = aEstDateDebut
					? aInstance.selecDateDebut
					: aInstance.selecDateFin;
				lInstanceDate.initialiser();
				if (aInstance.projetAccompagnement) {
					lInstanceDate.setParametresFenetre(
						GParametres.PremierLundi,
						aEstDateDebut
							? GParametres.PremiereDate
							: aInstance.projetAccompagnement.debut
								? aInstance.projetAccompagnement.debut
								: GParametres.PremiereDate,
						aEstDateDebut
							? aInstance.projetAccompagnement.fin
								? aInstance.projetAccompagnement.fin
								: GParametres.DerniereDate
							: GParametres.DerniereDate,
						GParametres.JoursOuvres,
						null,
						GParametres.JoursFeries,
						null,
						null,
					);
				}
			},
			btnSupprimer: {
				event: function () {
					if (
						aInstance.enModification &&
						aInstance.donnees &&
						aInstance.projetAccompagnement &&
						aInstance.projetAccompagnement.existeNumero()
					) {
						GApplication.getMessage()
							.afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								width: 370,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"FicheEleve.msgConfirmerSuppression",
									[""],
								),
							})
							.then(
								((aGenreAction) => {
									if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
										aInstance.projetAccompagnement.setEtat(
											Enumere_Etat_1.EGenreEtat.Suppression,
										);
										aInstance.surValidation(1);
									}
								}).bind(aInstance),
							);
					}
				},
				getDisabled: function () {
					return !aInstance.donnees || !aInstance.enModification;
				},
			},
			fenetreBtn: {
				getDisabled: function (aBoutonRepeat) {
					if (aBoutonRepeat.element.index === 1) {
						return !(
							aInstance.projetAccompagnement &&
							aInstance.projetAccompagnement.projetIndividuel &&
							aInstance.projetAccompagnement.projetIndividuel.existeNumero()
						);
					}
					return (
						aInstance.optionsFenetre.listeBoutonsInactifs &&
						aInstance.optionsFenetre.listeBoutonsInactifs[
							aBoutonRepeat.element.index
						] === true
					);
				},
			},
			chipsPJ: {
				event: function () {
					return true;
				},
				eventBtn: function (aIndex) {
					aInstance._evntSupprPJ(aIndex);
				},
			},
		});
	}
	setDonnees(aDonnees) {
		this.donnees = aDonnees;
		if (aDonnees.projetAccompagnement) {
			this.enModification = true;
			this.projetAccompagnement = MethodesObjet_1.MethodesObjet.dupliquer(
				aDonnees.projetAccompagnement,
			);
			this._initialiserSelecteurDate();
			this.projetAccompagnement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		} else {
			this.projetAccompagnement = ObjetElement_1.ObjetElement.create();
			this.projetAccompagnement.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			this.projetAccompagnement.consultableEquipePeda = true;
			this.projetAccompagnement.listeHandicaps = this.donnees.listeMotifs;
		}
		this.getInstance(this.identSelecteurPJ).setDonnees({
			listePJ: this.projetAccompagnement.documents,
			listeTotale: new ObjetListeElements_1.ObjetListeElements(),
			idContextFocus: this.Nom,
		});
		this._actualiserPJ();
		const lLibelleType =
			this.projetAccompagnement && this.projetAccompagnement.projetIndividuel
				? this.projetAccompagnement.projetIndividuel.getLibelle()
				: "";
		this.getInstance(this.identType).setLibelle(lLibelleType);
		this.getInstance(this.identType).setActif(true);
		if (this.projetAccompagnement && this.projetAccompagnement.listeHandicaps) {
			this.getInstance(this.identMotif).setLibelle(
				this.projetAccompagnement.listeHandicaps
					.getListeElements((aElement) => {
						return aElement.selectionne;
					})
					.getTableauLibelles()
					.join(", "),
			);
		}
		this.getInstance(this.identMotif).setActif(true);
		this.afficher();
	}
	surValidation(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			const lListeProjetAccompagnement =
				new ObjetListeElements_1.ObjetListeElements();
			const lListeFichiers = this.projetAccompagnement.documents;
			lListeProjetAccompagnement.add(this.projetAccompagnement);
			new ObjetRequeteSaisieFicheEleve_1.ObjetRequeteSaisieFicheEleve(
				this,
				this.actionSurValidation,
			)
				.addUpload({ listeFichiers: lListeFichiers })
				.lancerRequete({
					listeTypes: this.donnees.listeTypes,
					listeProjets: lListeProjetAccompagnement,
					listeFichiers: lListeFichiers,
					eleve: this.donnees.eleve,
				});
			this.callback.appel(aNumeroBouton, this.projetAccompagnement, {
				listeMotifs: this.donnees.listeMotifs,
				listeTypes: this.donnees.listeTypes,
			});
		}
		this.fermer();
	}
	composeContenu() {
		return IE.jsx.str(
			"div",
			{ class: "flex-contain cols" },
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str(
					"label",
					{
						for: this.getNomInstance(this.identType),
						class: "ie-titre-petit",
						style: "width: 4.5rem;",
					},
					ObjetTraduction_1.GTraductions.getValeur("FicheEleve.type"),
					" : ",
				),
				IE.jsx.str("div", {
					class: "full-width",
					id: this.getNomInstance(this.identType),
				}),
			),
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str(
					"label",
					{
						for: this.getNomInstance(this.identMotif),
						class: "ie-titre-petit ",
						style: "width: 4.5rem;",
					},
					ObjetTraduction_1.GTraductions.getValeur("FicheEleve.motifs"),
					" : ",
				),
				IE.jsx.str("div", { id: this.getNomInstance(this.identMotif) }),
			),
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str(
					"label",
					{ class: "ie-titre-petit" },
					ObjetTraduction_1.GTraductions.getValeur("FicheEleve.commentaire"),
					" : ",
				),
				IE.jsx.str("ie-textareamax", {
					"ie-model": "inputCommentaire",
					class: "txt-comment fluid-bloc full-width",
					maxlength: "1000",
					placeholder: ObjetTraduction_1.GTraductions.getValeur(
						"FicheEleve.redigezCommentaire",
					),
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"FicheEleve.redigezCommentaire",
					),
				}),
			),
			IE.jsx.str(
				"div",
				{ class: "field-contain label-up" },
				IE.jsx.str("div", {
					id: this.getNomInstance(this.identSelecteurPJ),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"FicheEleve.ajouterPJ",
					),
				}),
				IE.jsx.str("div", {
					id: this.ids.docsJoints,
					class: "pj-liste-conteneur",
				}),
			),
			IE.jsx.str(
				"div",
				{ class: "flex-contain flex-center flex-gap" },
				IE.jsx.str(
					"div",
					{ class: "field-contain label-up" },
					IE.jsx.str(
						"label",
						{ class: "ie-titre-petit" },
						ObjetTraduction_1.GTraductions.getValeur("FicheEleve.DateDebut"),
					),
					IE.jsx.str("div", {
						class: "m-left-s",
						id: this.selecDateDebut.getNom(),
						"ie-node": "getNodeSelecDate(true)",
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "field-contain label-up" },
					IE.jsx.str(
						"label",
						{ class: "ie-titre-petit" },
						ObjetTraduction_1.GTraductions.getValeur("FicheEleve.DateFin"),
					),
					IE.jsx.str("div", {
						id: this.selecDateFin.getNom(),
						"ie-node": "getNodeSelecDate(false)",
					}),
				),
			),
			IE.jsx.str(
				"div",
				{
					class: "public-team",
					"ie-display": "cbConsultableEquipePeda.getDisplay",
				},
				IE.jsx.str("i", {
					class: "icon_info_sondage_publier i-medium i-as-deco m-right",
					role: "presentation",
				}),
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": "cbConsultableEquipePeda" },
					ObjetTraduction_1.GTraductions.getValeur(
						"FicheEleve.publieEquipePeda",
					),
				),
			),
		);
	}
	composeBas() {
		const lHTML = [];
		lHTML.push(
			IE.jsx.str(
				"div",
				{ class: "compose-bas" },
				IE.jsx.str("ie-btnicon", {
					"ie-model": "btnSupprimer",
					title: ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
					class: "icon_trash avecFond i-medium",
				}),
			),
		);
		return lHTML.join("");
	}
	_initialiserSelecteurDate() {
		if (this.projetAccompagnement) {
			if (this.selecDateDebut) {
				this.selecDateDebut.setPremiereDateSaisissable(
					GParametres.PremiereDate,
					true,
				);
				this.selecDateDebut.setOptionsObjetCelluleDate({
					avecAucuneDate: true,
				});
				if (this.projetAccompagnement.debut) {
					this.selecDateDebut.setDonnees(this.projetAccompagnement.debut);
				}
				this.selecDateDebut.setParametresFenetre(
					GParametres.PremierLundi,
					GParametres.PremiereDate,
					this.projetAccompagnement.fin
						? this.projetAccompagnement.fin
						: GParametres.DerniereDate,
					GParametres.JoursOuvres,
					null,
					null,
					true,
					null,
				);
			}
			if (this.selecDateFin) {
				this.selecDateFin.setPremiereDateSaisissable(
					this.projetAccompagnement.debut,
					true,
				);
				this.selecDateFin.setOptionsObjetCelluleDate({ avecAucuneDate: true });
				if (this.projetAccompagnement.fin) {
					this.selecDateFin.setDonnees(this.projetAccompagnement.fin);
				}
				this.selecDateFin.setParametresFenetre(
					GParametres.PremierLundi,
					this.projetAccompagnement.debut
						? this.projetAccompagnement.debut
						: GParametres.PremiereDate,
					GParametres.DerniereDate,
					GParametres.JoursOuvres,
					null,
					null,
					true,
					null,
				);
			}
		}
	}
	_initSelecteurPJ(aInstance) {
		aInstance.setOptions({
			genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
			genreRessourcePJ:
				Enumere_Ressource_1.EGenreRessource.DocJointEtablissement,
			maxFiles: 0,
			maxSize: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
			),
			idLibellePJ: this.ids.pieceJointe,
			avecAjoutExistante: true,
			avecEtatSaisie: false,
			avecBoutonSupp: true,
			ouvrirFenetreChoixTypesAjout: false,
			libelleSelecteur: ObjetTraduction_1.GTraductions.getValeur(
				"AjouterDesPiecesJointes",
			),
		});
	}
	_actualiserPJ() {
		if (!this.projetAccompagnement.documents) {
			this.projetAccompagnement.documents =
				new ObjetListeElements_1.ObjetListeElements();
		}
		const lInstance = this.getInstance(this.identSelecteurPJ);
		lInstance.setDonnees({
			listePJ: this.projetAccompagnement.documents,
			listeTotale: new ObjetListeElements_1.ObjetListeElements(),
			idContextFocus: this.Nom,
		});
		if (this.projetAccompagnement.documents.count() > 0) {
			ObjetHtml_1.GHtml.setHtml(
				this.ids.docsJoints,
				UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
					this.projetAccompagnement.documents,
					{ IEModelChips: "chipsPJ" },
				),
				{ controleur: this.controleur },
			);
		}
	}
	_evntSelecteurPJ() {
		this._actualiserPJ();
	}
	_evntSupprPJ(aIndex) {
		if (!!this.projetAccompagnement && this.projetAccompagnement.documents) {
			this.projetAccompagnement.documents
				.get(aIndex)
				.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
		}
		this._actualiserPJ();
	}
	_initType(aInstance) {
		aInstance.setOptionsObjetCelluleBouton({
			estSaisissable: true,
			avecZoneSaisie: false,
			genreBouton: ObjetCelluleBouton_2.EGenreBoutonCellule.Points,
			largeur: 180,
			hauteur: 17,
			placeHolder: ObjetTraduction_1.GTraductions.getValeur(
				"FicheEleve.aucunTypeDeProjet",
			),
			popupWAI: "dialog",
		});
	}
	_evntType(aGenreEvent) {
		if (
			(aGenreEvent === Enumere_Event_1.EEvent.SurKeyUp &&
				GNavigateur.isToucheSelection()) ||
			aGenreEvent === Enumere_Event_1.EEvent.SurMouseDown
		) {
			const lFenetreTypeProjAcc =
				ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_TypeProjetAccompagnement_1.ObjetFenetre_TypeProjetAccompagnement,
					{
						pere: this,
						evenement(aNumeroBouton, aTypeSelectionne, aListeType) {
							if (aNumeroBouton === 1) {
								if (aTypeSelectionne) {
									this.projetAccompagnement.setLibelle(
										aTypeSelectionne.getLibelle(),
									);
									this.projetAccompagnement.projetIndividuel = aTypeSelectionne;
									this.getInstance(this.identType).setLibelle(
										this.projetAccompagnement.projetIndividuel.getLibelle(),
									);
								}
							}
							this.donnees.listeTypes = aListeType;
						},
						initialiser(aInstance) {
							aInstance.setOptionsFenetre({
								titre: ObjetTraduction_1.GTraductions.getValeur(
									"FicheEleve.typeDeProjet",
								),
							});
						},
					},
				);
			lFenetreTypeProjAcc.setDonnees(this.donnees.listeTypes, {
				eleve: this.donnees.eleve,
			});
		}
	}
	_initMotif(aInstance) {
		aInstance.setOptionsObjetCelluleBouton({
			estSaisissable: true,
			avecZoneSaisie: false,
			genreBouton: ObjetCelluleBouton_2.EGenreBoutonCellule.Points,
			largeur: 180,
			hauteur: 17,
			placeHolder: ObjetTraduction_1.GTraductions.getValeur(
				"FicheEleve.aucunMotifProjet",
			),
			popupWAI: "dialog",
		});
	}
	_evntMotif(aGenreEvent) {
		if (
			(aGenreEvent === Enumere_Event_1.EEvent.SurKeyUp &&
				GNavigateur.isToucheSelection()) ||
			aGenreEvent === Enumere_Event_1.EEvent.SurMouseDown
		) {
			const lFenetreMotifProjAcc =
				ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_MotifProjetAccompagnement_1.ObjetFenetre_MotifProjetAccompagnement,
					{
						pere: this,
						evenement(aNumeroBouton, aMotifSelectionnes) {
							if (aNumeroBouton === 1) {
								if (aMotifSelectionnes) {
									this.projetAccompagnement.listeHandicaps = aMotifSelectionnes;
									if (
										this.projetAccompagnement &&
										this.projetAccompagnement.listeHandicaps
									) {
										this.getInstance(this.identMotif).setLibelle(
											this.projetAccompagnement.listeHandicaps
												.getListeElements((aElement) => {
													return aElement.selectionne;
												})
												.getTableauLibelles()
												.join(", "),
										);
									}
								}
							}
						},
						initialiser(aInstance) {
							aInstance.setOptionsFenetre({
								titre:
									ObjetTraduction_1.GTraductions.getValeur("FicheEleve.motifs"),
							});
						},
					},
				);
			lFenetreMotifProjAcc.setDonnees(this.projetAccompagnement.listeHandicaps);
		}
	}
}
exports.ObjetFenetre_ProjetAccompagnement = ObjetFenetre_ProjetAccompagnement;
