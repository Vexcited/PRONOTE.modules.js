exports.PageMissionsDemande = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const GUID_js_1 = require("GUID.js");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetSelecteurPJ_1 = require("ObjetSelecteurPJ");
const ObjetFenetre_SelectionSalleLieu_js_1 = require("ObjetFenetre_SelectionSalleLieu.js");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetMoteurTravaux_js_1 = require("ObjetMoteurTravaux.js");
const TypeGenreTravauxIntendance_1 = require("TypeGenreTravauxIntendance");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetHtml_1 = require("ObjetHtml");
const TypeNiveauDUrgence_1 = require("TypeNiveauDUrgence");
const TypeDestinationDemandeTravaux_1 = require("TypeDestinationDemandeTravaux");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetElement_1 = require("ObjetElement");
const TypeOrigineCreationAvanceeTravaux_1 = require("TypeOrigineCreationAvanceeTravaux");
const Enumere_Etat_1 = require("Enumere_Etat");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_Onglet_js_1 = require("Enumere_Onglet.js");
const ObjetFenetre_1 = require("ObjetFenetre");
const _ObjetListe_1 = require("_ObjetListe");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Action_js_1 = require("Enumere_Action.js");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetDate_js_1 = require("ObjetDate.js");
const TypeColonneTravauxIntendance_1 = require("TypeColonneTravauxIntendance");
class PageMissionsDemande extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.idSectionListe = GUID_js_1.GUID.getId();
		this.idZoneLieuxSalle = GUID_js_1.GUID.getId();
		this.idPieceJointeFenetre = GUID_js_1.GUID.getId();
		this.idPieceJointe = GUID_js_1.GUID.getId();
		this.idBtnTrash = GUID_js_1.GUID.getId();
		this.idZoneEcheance = GUID_js_1.GUID.getId();
		this.construireInstancesDate();
		this.construireInstancePj();
	}
	construireInstancesDate() {
		this.identDateEcheance = ObjetIdentite_1.Identite.creerInstance(
			ObjetCelluleDate_1.ObjetCelluleDate,
			{ pere: this, evenement: this.evenementSurDateEcheance },
		);
		this.identDateEcheance.setOptionsObjetCelluleDate({
			formatDate: "%JJJ %JJ/%MM/%AAAA",
			largeurComposant: 140,
			placeHolder: ObjetTraduction_1.GTraductions.getValeur("Date"),
			fenetre: { indiceCroixFermeture: -1 },
		});
		this.identDateEcheance.setOptions({
			placeHolder: ObjetTraduction_1.GTraductions.getValeur("Date"),
		});
		return;
	}
	construireInstancePj() {
		this.identSelecteurPJ = ObjetIdentite_1.Identite.creerInstance(
			ObjetSelecteurPJ_1.ObjetSelecteurPJ,
			{ pere: this, evenement: this._evntSelecteurPJ },
		);
		this.identSelecteurPJ.setOptions({
			genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
			genreRessourcePJ:
				Enumere_Ressource_1.EGenreRessource.DocJointEtablissement,
			multiple: true,
			maxFiles: 0,
			libelleSelecteur: ObjetTraduction_1.GTraductions.getValeur(
				"AjouterDesPiecesJointes",
			),
			ouvrirFenetreChoixTypesAjout: true,
			optionsCloud: { avecCloud: false },
			idLibellePJ: this.idPieceJointe,
			avecAjoutExistante: true,
			avecEtatSaisie: false,
			avecBoutonSupp: true,
		});
		return;
	}
	evenementSurDateEcheance(aDateEcheance) {
		this.demandeCourante.dateEcheance = aDateEcheance;
	}
	jsxModeleRadioDestination(aTypeDest) {
		return {
			getValue: () => {
				return (
					!!this.demandeCourante &&
					"destination" in this.demandeCourante &&
					this.demandeCourante.destination === aTypeDest
				);
			},
			setValue: (aValue) => {
				this.demandeCourante.destination = aTypeDest;
			},
			getDisabled: () => {
				return !this._estEditable(
					TypeColonneTravauxIntendance_1.TypeColonneTravauxIntendance
						.tcti_Destination,
				);
			},
			getName: () => {
				return `${this.Nom}_Destination`;
			},
		};
	}
	jsxModeleChipsSalleLieu(aSalleLieuConcerne) {
		return {
			eventBtn: (aEvent) => {
				aEvent.stopPropagation();
				if (
					this._estEditable(
						TypeColonneTravauxIntendance_1.TypeColonneTravauxIntendance
							.tcti_Lieu,
					)
				) {
					this._evntSupprLieuxSalle(aSalleLieuConcerne);
				}
			},
			getDisabled: () => {
				return !this._estEditable(
					TypeColonneTravauxIntendance_1.TypeColonneTravauxIntendance.tcti_Lieu,
				);
			},
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cmbNature: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						longueur: "100%",
						hauteur: 16,
						hauteurLigneDefault: 16,
						estLargeurAuto: true,
						avecDesignMobile: true,
					});
					aCombo.setDonneesObjetSaisie({ liste: aInstance.listeNatureTvx });
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
						Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
					) {
						aInstance.demandeCourante.nature = aParametres.element;
					}
				},
				getIndiceSelection: function () {
					if (aInstance.demandeCourante.nature) {
						return aInstance.listeNatureTvx.getIndiceParElement(
							aInstance.demandeCourante.nature,
						);
					} else {
						return 0;
					}
				},
				getDisabled: function () {
					return !aInstance._estEditable(
						TypeColonneTravauxIntendance_1.TypeColonneTravauxIntendance
							.tcti_Nature,
					);
				},
			},
			comboNiveauUrgence: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						longueur: "100%",
						hauteur: 16,
						hauteurLigneDefault: 16,
					});
					aCombo.setDonneesObjetSaisie({ liste: aInstance.listeNiveauUrgence });
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
						Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
					) {
						aInstance.demandeCourante.niveauDUrgence =
							aParametres.element.getGenre();
					}
				},
				getIndiceSelection: function () {
					if (
						aInstance.demandeCourante.niveauDUrgence !== null &&
						aInstance.demandeCourante.niveauDUrgence !== undefined
					) {
						return aInstance.demandeCourante.niveauDUrgence;
					} else {
						return TypeNiveauDUrgence_1.TypeNiveauDUrgence.Tndu_Normal;
					}
				},
				getDisabled: function () {
					return !aInstance._estEditable(
						TypeColonneTravauxIntendance_1.TypeColonneTravauxIntendance
							.tcti_NiveauDUrgence,
					);
				},
			},
			inputDemande: {
				getValue: function () {
					return !!aInstance.demandeCourante &&
						!!aInstance.demandeCourante.detail
						? aInstance.demandeCourante.detail
						: "";
				},
				setValue: function (aValue) {
					aInstance.demandeCourante.detail = aValue;
				},
				getDisabled: function () {
					return (
						!aInstance._estEditable(
							TypeColonneTravauxIntendance_1.TypeColonneTravauxIntendance
								.tcti_Detail,
						) || aInstance.estEnDuplication
					);
				},
			},
			selectionSalleLieu: {
				event() {
					aInstance.fenetreselectionSalleLieu =
						ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_SelectionSalleLieu_js_1.ObjetFenetre_SelectionSalleLieu,
							{
								pere: aInstance,
								evenement: (aGenreRessource, aListeRessourcesSelectionnees) => {
									aInstance._evntFenetreSalleLieu(
										aGenreRessource,
										aListeRessourcesSelectionnees,
									);
								},
								initialiser: (aInstance) => {
									const lparamsListe = {
										optionsListe: {
											skin: _ObjetListe_1.ObjetListe.skin.flatDesign,
										},
									};
									const lTitre = ObjetTraduction_1.GTraductions.getValeur(
										"TvxIntendance.FenetreSelectionLieu_Titre",
									);
									aInstance.paramsListe = lparamsListe;
									aInstance.setOptionsFenetre({
										titre: lTitre,
										largeur: 450,
										hauteur: 450,
										hauteurMaxContenu: 720,
										avecScroll: true,
										listeBoutons: [
											ObjetTraduction_1.GTraductions.getValeur("Fermer"),
											ObjetTraduction_1.GTraductions.getValeur("Valider"),
										],
									});
								},
							},
						);
					aInstance.fenetreselectionSalleLieu.setDonnees({
						listeRessources: aInstance.listeSallesLieu,
						listeRessourcesSelectionnees:
							aInstance.demandeCourante.listeLieux.getListeElements(
								(aElem) =>
									aElem.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression,
							),
					});
				},
				getLibelle() {
					var _a;
					return (_a =
						aInstance === null || aInstance === void 0
							? void 0
							: aInstance._getHtmlSalleLieux) === null || _a === void 0
						? void 0
						: _a.call(aInstance);
				},
				getDisabled: function () {
					return !aInstance._estEditable(
						TypeColonneTravauxIntendance_1.TypeColonneTravauxIntendance
							.tcti_Lieu,
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
				getDisabled: function () {
					return !aInstance._estEditable(
						TypeColonneTravauxIntendance_1.TypeColonneTravauxIntendance
							.tcti_PiecesJointes,
					);
				},
			},
			btnTrash: {
				event: function () {
					let lMsgConfirmationSuppression = "";
					if (
						GEtatUtilisateur.getGenreOnglet() ===
						Enumere_Onglet_js_1.EGenreOnglet.Intendance_SaisieCommandes
					) {
						lMsgConfirmationSuppression =
							ObjetTraduction_1.GTraductions.getValeur(
								"TvxIntendance.Message.SupprimerCommande",
							);
					} else {
						lMsgConfirmationSuppression =
							ObjetTraduction_1.GTraductions.getValeur(
								"TvxIntendance.Message.SupprimerDemande",
							);
					}
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: lMsgConfirmationSuppression,
						callback: function (aGenreAction) {
							if (aGenreAction === Enumere_Action_js_1.EGenreAction.Valider) {
								aInstance.demandeCourante.setEtat(
									Enumere_Etat_1.EGenreEtat.Suppression,
								);
								aInstance.callback.appel("Supprimer");
							}
						},
					});
				},
			},
		});
	}
	setDonnees(aParam) {
		this.param = MethodesObjet_1.MethodesObjet.dupliquer(aParam);
		this.listeSallesLieu = this.param.listeSalleLieu;
		this.listeNatureTvx = this.param.listeNatureTvx;
		this.listeNiveauUrgence = this.param.listeNiveauUrgence;
		this.listeLieux = this.param.demandeCourante.listeLieux;
		this.listeEtatsAvancement = this.param.listeEtatsAvancement;
		this.estEnDuplication = this.param.estEnDuplication;
		this.pieceJointe = this.param.listePJ;
		this.listeDestination =
			TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravauxUtil.toListe(
				GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.PrimMairie,
			);
		this.destination = aParam.destination;
		this.dateEcheance = aParam.dateEcheance;
		this.estEnCreation = aParam.estEnCreation;
		this.enModification = aParam.enModification;
		if (aParam.estEnCreation) {
			ObjetHtml_1.GHtml.setDisplay(this.idBtnTrash, false);
		}
		this.enModification = false;
		if (!!this.param.demandeCourante) {
			this.demandeCourante = this.param.demandeCourante;
			this.nature = this.param.demandeCourante.nature;
			this.niveauDUrgence = this.param.demandeCourante.niveauDUrgence;
			this.enModification = true;
		} else {
			this.demandeCourante = this.creerNouvelleDemande();
			this.estEnCreation = true;
			this.enModification = true;
		}
		this.moteur = new ObjetMoteurTravaux_js_1.ObjetMoteurTravaux();
		this.genreTravaux = this.moteur.getGenreTravaux();
		this.afficher(this.composeContenu());
		this.identDateEcheance.initialiser();
		this.identDateEcheance.setParametresFenetre(
			GParametres.PremierLundi,
			GParametres.PremiereDate,
			GParametres.DerniereDate,
		);
		this.identDateEcheance.setPremiereDateSaisissable(
			ObjetDate_js_1.GDate.aujourdhui,
		);
		this.identDateEcheance.setActif(
			this._estEditable(
				TypeColonneTravauxIntendance_1.TypeColonneTravauxIntendance
					.tcti_DateDecheance,
			),
		);
		if (!!this.param.demandeCourante.dateEcheance) {
			this.identDateEcheance.setDonnees(this.demandeCourante.dateEcheance);
		}
		this.identSelecteurPJ.initialiser(true);
		this.identSelecteurPJ.setDonnees({
			listePJ: this.demandeCourante.listePJ,
			listeTotale: this.pieceJointe,
			idContextFocus: this.Nom,
		});
		this.identSelecteurPJ.setActif(
			this._estEditable(
				TypeColonneTravauxIntendance_1.TypeColonneTravauxIntendance
					.tcti_PiecesJointes,
			),
		);
	}
	_estEditable(aChamps) {
		if (!this.enModification) {
			return true;
		}
		if (!!this.estEnCreation) {
			return true;
		}
		return this.moteur.estEditable(this.demandeCourante, aChamps);
	}
	creerNouvelleDemande() {
		const lDemande = ObjetElement_1.ObjetElement.create();
		const lUserConnecte = GEtatUtilisateur.getUtilisateur();
		const lEtatDemande = this.listeEtatsAvancement.getElementParGenre(
			TypeOrigineCreationAvanceeTravaux_1.TypeOrigineCreationAvanceeTravaux
				.OCAT_EnAttente,
		);
		lDemande.dateCreation = new Date();
		lDemande.destination =
			TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravaux.DDT_Interne;
		lDemande.detail = "";
		lDemande.genreTravaux = this.genreTravaux;
		lDemande.demandeur = new ObjetElement_1.ObjetElement(
			lUserConnecte.getLibelle(),
			lUserConnecte.getNumero(),
			lUserConnecte.getGenre(),
		);
		lDemande.etat = ObjetElement_1.ObjetElement.create({
			Libelle: lEtatDemande.getLibelle(),
			Numero: lEtatDemande.getNumero(),
			Genre: lEtatDemande.Genre,
		});
		lDemande.listeLieux = new ObjetListeElements_1.ObjetListeElements();
		lDemande.dateEcheance = this.dateEcheance;
		lDemande.niveauDUrgence = this.niveauDUrgence;
		lDemande.listePJ = new ObjetListeElements_1.ObjetListeElements();
		lDemande.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		return lDemande;
	}
	composeContenu() {
		const lEstCommande =
			this.genreTravaux ===
			TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance.GTI_Commande;
		const lEstSecretariat =
			this.genreTravaux ===
			TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance.GTI_Secretariat;
		const idLabelLieu = GUID_js_1.GUID.getId();
		const lWidthLabel = "--width-label:11rem";
		const lLieux = IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ class: "field-contain in-row chips-contain" },
				IE.jsx.str(
					"label",
					{ class: "ie-titre-petit", id: idLabelLieu, style: lWidthLabel },
					ObjetTraduction_1.GTraductions.getValeur(
						"TvxIntendance.colonne.lieu",
					),
				),
				IE.jsx.str("ie-btnselecteur", {
					id: this.idZoneLieuxSalle,
					"ie-model": "selectionSalleLieu",
					"aria-labelledby": idLabelLieu,
					class: "chips-inside fluid-bloc",
				}),
			),
		);
		const lComboPrimaire = IE.jsx.str(
			"div",
			{ class: "field-contain cols flex-gap" },
			IE.jsx.str(
				"ie-radio",
				{
					class: "ThemeCat-communication self-start",
					"ie-model": this.jsxModeleRadioDestination.bind(
						this,
						TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravaux
							.DDT_Interne,
					),
				},
				TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravauxUtil.getLibelle(
					TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravaux
						.DDT_Interne,
				),
			),
			IE.jsx.str(
				"ie-radio",
				{
					class: "ThemeCat-communication self-start",
					"ie-model": this.jsxModeleRadioDestination.bind(
						this,
						TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravaux
							.DDT_Collectivite,
					),
				},
				TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravauxUtil.getLibelle(
					TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravaux
						.DDT_Collectivite,
				),
			),
		);
		const lEcheance = IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ class: "field-contain in-row echeance" },
				IE.jsx.str(
					"label",
					{ class: ["ie-titre-petit"] },
					ObjetTraduction_1.GTraductions.getValeur(
						"TvxIntendance.fenetre.echeance",
					),
				),
				IE.jsx.str("div", {
					class: "date-echeance",
					id: this.identDateEcheance.getNom(),
				}),
			),
		);
		const idNature = GUID_js_1.GUID.getId();
		const idUrgence = GUID_js_1.GUID.getId();
		const lIdDemande = `${this.Nom}_ta_demande`;
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ class: "flex-column justify-between m-bottom-xxl full-width p-x" },
				GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Mobile_PrimMairie ||
					GEtatUtilisateur.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.PrimMairie ||
					GEtatUtilisateur.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection ||
					GEtatUtilisateur.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.PrimDirection ||
					GEtatUtilisateur.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.PrimProfesseur ||
					GEtatUtilisateur.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur
					? lComboPrimaire
					: "",
				!lEstCommande && !lEstSecretariat ? lLieux : "",
				IE.jsx.str(
					"div",
					{ class: "field-contain in-row p-top-l" },
					IE.jsx.str(
						"label",
						{ id: idNature, class: "ie-titre-petit", style: lWidthLabel },
						ObjetTraduction_1.GTraductions.getValeur(
							"TvxIntendance.colonne.nature",
						),
					),
					IE.jsx.str("ie-combo", {
						class: "full-width",
						style: lWidthLabel,
						"ie-model": "cmbNature",
						"aria-labelledby": idNature,
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "field-contain label-up p-top-l no-line" },
					IE.jsx.str(
						"label",
						{ for: lIdDemande, class: "ie-titre-petit" },
						!lEstCommande
							? ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.colonne.description",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.colonne.detailCommande",
								),
					),
					IE.jsx.str("ie-textareamax", {
						"ie-model": "inputDemande",
						id: lIdDemande,
						class: "ie-autoresize m-bottom-l",
						placeholder: !lEstCommande
							? ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.DescriptionMission",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.DescriptionMission",
								),
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "field-contain in-row" },
					IE.jsx.str(
						"label",
						{ class: "ie-titre-petit", id: idUrgence, style: lWidthLabel },
						ObjetTraduction_1.GTraductions.getValeur(
							"TvxIntendance.fenetre.niveauUrgence",
						),
					),
					IE.jsx.str(
						"ie-combo",
						{
							style: lWidthLabel,
							"ie-model": "comboNiveauUrgence",
							"aria-labelledby": idUrgence,
						},
						" ",
					),
				),
				!lEstCommande ? lEcheance : "",
				IE.jsx.str(
					"div",
					{ class: "field-contain label-up" },
					IE.jsx.str("div", { id: this.identSelecteurPJ.getNom() }),
					IE.jsx.str("div", {
						id: this.idPieceJointe,
						class: "pj-liste-conteneur",
						"aria-label": ObjetTraduction_1.GTraductions.getValeur(
							"AjouterDesPiecesJointes",
						),
					}),
				),
			),
		);
	}
	_getHtmlSalleLieux() {
		const T = [];
		if (!!this.demandeCourante.listeLieux) {
			if (
				this.demandeCourante.listeLieux
					.getListeElements(
						(aElem) =>
							aElem.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression,
					)
					.count() === 0
			) {
				return ObjetTraduction_1.GTraductions.getValeur("Aucun");
			}
			this.demandeCourante.listeLieux.parcourir((aLieu) => {
				if (aLieu.existe()) {
					if (
						this._estEditable(
							TypeColonneTravauxIntendance_1.TypeColonneTravauxIntendance
								.tcti_Lieu,
						)
					) {
						T.push(
							IE.jsx.str(
								"ie-chips",
								{
									class: ["avec-event", "m-right"],
									"ie-model": this.jsxModeleChipsSalleLieu.bind(this, aLieu),
									title: aLieu.getLibelle() ? aLieu.getLibelle() : false,
								},
								aLieu.getLibelle(),
							),
						);
					} else {
						T.push(
							IE.jsx.str("ie-chips", { class: "m-all" }, aLieu.getLibelle()),
						);
					}
				}
			});
		}
		return T.join("");
	}
	_evntFenetreSalleLieu(aGenreBouton, aListeSelection) {
		if (
			aGenreBouton === 1 &&
			aListeSelection !== null &&
			this.demandeCourante
		) {
			let lEltTrouve;
			for (let i = 0; i < this.demandeCourante.listeLieux.count(); i++) {
				const lLieu = this.demandeCourante.listeLieux.get(i);
				lEltTrouve = aListeSelection.getElementParElement(lLieu);
				if (!lEltTrouve) {
					lLieu.ancienEtat = lLieu.Etat;
					lLieu.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					this.demandeCourante.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
			}
			for (let j = 0; j < aListeSelection.count(); j++) {
				const lNouveauLieu = aListeSelection.get(j);
				if (lNouveauLieu.getEtat() === Enumere_Etat_1.EGenreEtat.Creation) {
					this.listeSallesLieu.addElement(lNouveauLieu);
				}
				lEltTrouve =
					this.demandeCourante.listeLieux.getElementParElement(lNouveauLieu);
				if (!lEltTrouve) {
					lNouveauLieu.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					this.demandeCourante.listeLieux.addElement(lNouveauLieu);
					this.demandeCourante.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				} else if (lEltTrouve.Etat === Enumere_Etat_1.EGenreEtat.Suppression) {
					lEltTrouve.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
					lEltTrouve.setEtat(lEltTrouve.ancienEtat);
				}
			}
		}
	}
	_evntSupprLieuxSalle(aSalleLieuConcerne) {
		if (aSalleLieuConcerne) {
			const lIndice = this.demandeCourante.listeLieux.getIndiceElementParFiltre(
				(aElement) => {
					return aElement.getNumero() === aSalleLieuConcerne.getNumero();
				},
			);
			const lLieu = this.demandeCourante.listeLieux.get(lIndice);
			if (!!lLieu) {
				lLieu.ancienEtat = lLieu.Etat;
				lLieu.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			}
		}
	}
	_evntSelecteurPJ() {
		this._actualiserPJ();
	}
	_actualiserPJ() {
		if (!this.demandeCourante.listePJ) {
			this.demandeCourante.listePJ =
				new ObjetListeElements_1.ObjetListeElements();
		}
		this.identSelecteurPJ.setDonnees({
			listePJ: this.demandeCourante.listePJ,
			listeTotale: this.pieceJointe,
			idContextFocus: this.Nom,
		});
		this.avecSaisie = true;
		if (this.demandeCourante.listePJ.count() > 0) {
			ObjetHtml_1.GHtml.setHtml(
				this.idPieceJointe,
				UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
					this.demandeCourante.listePJ,
					{ IEModelChips: "chipsPJ" },
				),
				{ controleur: this.controleur },
			);
		} else {
			ObjetHtml_1.GHtml.setHtml(
				this.idPieceJointe,
				'<span class="EspaceGauche">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"TvxIntendance.fenetre.pieceJointe",
					) +
					"</span>",
				{ controleur: this.controleur },
			);
			ObjetHtml_1.GHtml.setHtml(this.idPieceJointe, "", {
				controleur: this.controleur,
			});
		}
	}
	_evntSupprPJ(aIndex) {
		if (!!this.demandeCourante && this.demandeCourante.listePJ) {
			this.demandeCourante.listePJ
				.get(aIndex)
				.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			this.demandeCourante.listePJ.remove(aIndex);
		}
		this._actualiserPJ();
	}
	getDonnees() {
		if (!!this.demandeCourante) {
			return this.demandeCourante;
		}
	}
}
exports.PageMissionsDemande = PageMissionsDemande;
