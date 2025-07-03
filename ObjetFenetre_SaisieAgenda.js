exports.ObjetFenetre_SaisieAgenda = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const GUID_1 = require("GUID");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_Etat_1 = require("Enumere_Etat");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetFenetre_EvenementPeriodicite_1 = require("ObjetFenetre_EvenementPeriodicite");
const GestionnaireBlocPN_1 = require("GestionnaireBlocPN");
const GestionnaireBlocPN_2 = require("GestionnaireBlocPN");
const GestionnaireBlocPN_3 = require("GestionnaireBlocPN");
const MoteurDestinatairesPN_1 = require("MoteurDestinatairesPN");
const MoteurGestionPJPN_1 = require("MoteurGestionPJPN");
const FenetreEditionDestinatairesParEntites_1 = require("FenetreEditionDestinatairesParEntites");
const FenetreEditionDestinatairesParIndividus_1 = require("FenetreEditionDestinatairesParIndividus");
const ObjetRequeteListeDiffusion_1 = require("ObjetRequeteListeDiffusion");
const ObjetFenetre_SelectionListeDiffusion_1 = require("ObjetFenetre_SelectionListeDiffusion");
const Cache_1 = require("Cache");
const DonneesListe_SelectionDiffusion_1 = require("DonneesListe_SelectionDiffusion");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetRequeteSaisieAgenda_1 = require("ObjetRequeteSaisieAgenda");
const EGenreEvtAgenda_1 = require("EGenreEvtAgenda");
const ObjetMoteurFormSaisieMobile_1 = require("ObjetMoteurFormSaisieMobile");
const ObjetSelecteurPJ_1 = require("ObjetSelecteurPJ");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const AccessApp_1 = require("AccessApp");
const c_TailleMaxCommentaire = 1000;
class ObjetFenetre_SaisieAgenda extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.application = (0, AccessApp_1.getApp)();
		this.etatUtilisateur = this.application.getEtatUtilisateur();
		this.objetParametres = this.application.getObjetParametres();
		this.id = {
			titre: GUID_1.GUID.getId(),
			ctnHeure: GUID_1.GUID.getId(),
			ctnDestinataire: GUID_1.GUID.getId(),
			listePJ: GUID_1.GUID.getId(),
			libellePeriodicite: GUID_1.GUID.getId(),
			blocHeure: GUID_1.GUID.getId(),
			blocDate: GUID_1.GUID.getId(),
			ctnPeriodicite: GUID_1.GUID.getId(),
			inputTitre: GUID_1.GUID.getId(),
			inputCtnEvent: GUID_1.GUID.getId(),
			CBdirecteur: GUID_1.GUID.getId(),
			libelleCloud: GUID_1.GUID.getId(),
			libelleDocJoint: GUID_1.GUID.getId(),
			labeComboSelecCategorie: GUID_1.GUID.getId(),
		};
		this.utilitaires = {
			genreRessource: new GestionnaireBlocPN_1.UtilitaireGenreRessource(),
			genreEspace: new GestionnaireBlocPN_2.UtilitaireGenreEspace(),
			genreReponse: new GestionnaireBlocPN_3.UtilitaireGenreReponse(),
			moteurDestinataires: new MoteurDestinatairesPN_1.MoteurDestinatairesPN(),
			moteurGestionPJ: new MoteurGestionPJPN_1.MoteurGestionPJPN(),
		};
		this.moteurFormSaisie =
			new ObjetMoteurFormSaisieMobile_1.ObjetMoteurFormSaisieMobile();
		this.destinataire = {};
		this.options = {
			avecCBElevesRattaches: this.objetParametres.avecElevesRattaches,
			avecGestionEleves: this.application.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionEleves,
			),
			avecGestionPersonnels: this.application.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionPersonnels,
			),
			avecGestionStages: this.application.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionStages,
			),
			avecGestionIPR: this.application.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionIPR,
			),
		};
		this._nbCarTitre = 50;
		this.avecPublicationPageEtablissement = this.application.droits.get(
			ObjetDroitsPN_1.TypeDroits.communication.avecPublicationPageEtablissement,
		);
		this.listeJoursDeLaSemaine = new ObjetListeElements_1.ObjetListeElements();
		for (let i = 0; i < 7; i++) {
			this.listeJoursDeLaSemaine.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("Jours")[i],
				),
			);
		}
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			chipsDocJoint: {
				eventBtn(aIndice) {
					const lElement = aInstance.evenement.listeDocJoints.get(aIndice);
					if (lElement) {
						lElement.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
						aInstance._actualiserLibelleDocJoints();
					}
				},
			},
			selecteurDestParIndiv: {
				event: aInstance._evntSelectDestParIndiv.bind(aInstance),
				getLibelle() {
					const lPourPrim = aInstance.etatUtilisateur.pourPrimaire();
					if (
						lPourPrim ||
						MethodesObjet_1.MethodesObjet.isNumeric(
							aInstance.destinataire.nbIndiv,
						)
					) {
						return lPourPrim
							? ObjetTraduction_1.GTraductions.getValeur(
									"actualites.Edition.Destinataires",
								)
							: `${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.ATitreIndividuel")} <span class="theme_color_moyen1">(${aInstance.destinataire.nbIndiv})</span>`;
					}
					return "";
				},
				getIcone() {
					return "icon_user";
				},
			},
			selecteurDestParEntite: {
				event: aInstance._evntSelectDestParEntite.bind(aInstance),
				getLibelle() {
					if (
						aInstance.destinataire &&
						MethodesObjet_1.MethodesObjet.isNumeric(
							aInstance.destinataire.nbClasses,
						) &&
						MethodesObjet_1.MethodesObjet.isNumeric(
							aInstance.destinataire.nbGpe,
						)
					) {
						return `${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.ParClasses").ucfirst()} <span class="theme_color_moyen1">(${aInstance.destinataire.nbClasses})</span> ${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.OuGroupes")} <span class="theme_color_moyen1">(${aInstance.destinataire.nbGpe})</span>`;
					}
					return "";
				},
				getIcone() {
					return "icon_group";
				},
			},
			selecteurPeriodicite: {
				event: aInstance._evntSelectPeriodicite.bind(aInstance),
				getLibelle() {
					return aInstance.evenement.estPeriodique
						? ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_SaisieAgenda.ModifierLaPeriodicite",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_SaisieAgenda.DefinirPeriodicite",
							);
				},
			},
			CBdirecteur: {
				getValue() {
					return !!aInstance.evenement && !!aInstance.evenement.avecDirecteur;
				},
				setValue(aChecked) {
					if (!!aInstance.evenement && aInstance.evenement.avecDirecteur) {
						aInstance.evenement.avecDirecteur = aChecked;
					}
				},
				getDisabled() {
					return true;
				},
			},
			pourPrim() {
				return aInstance.etatUtilisateur.pourPrimaire();
			},
			pourPN() {
				return !aInstance.etatUtilisateur.pourPrimaire();
			},
			avecPublicationPageEtablissement() {
				return aInstance.avecPublicationPageEtablissement;
			},
			cbPublicationPageEtablissement: {
				getValue() {
					return (
						!!aInstance.evenement &&
						!!aInstance.evenement.publicationPageEtablissement
					);
				},
				setValue(aValue) {
					if (
						!!aInstance.evenement &&
						aInstance.avecPublicationPageEtablissement
					) {
						aInstance.evenement.publicationPageEtablissement = aValue;
					}
				},
				getDisabled() {
					return !aInstance.evenement || !aInstance.evenement.publie;
				},
			},
			estPublie: function () {
				return aInstance.evenement ? aInstance.evenement.publie : true;
			},
			inputTimeHoraire: {
				heureDebut: {
					getValue() {
						return aInstance.valueInputHeureDebut;
					},
					setValue(aValue) {
						aInstance.valueInputHeureDebut = aValue;
					},
					getDisabled() {
						if (!!aInstance.evenement) {
							if (aInstance.evenement.sansHoraire) {
								$("#" + aInstance.id.ctnHeure)
									.children()
									.addClass("is-disabled");
							} else {
								$("#" + aInstance.id.ctnHeure)
									.children()
									.removeClass("is-disabled");
							}
						}
						return aInstance.evenement ? aInstance.evenement.sansHoraire : true;
					},
					exitChange() {
						aInstance._verifValueTime(true);
					},
				},
				heureFin: {
					getValue() {
						return aInstance.valueInputHeureFin;
					},
					setValue(aValue) {
						aInstance.valueInputHeureFin = aValue;
					},
					getDisabled() {
						return aInstance.evenement ? aInstance.evenement.sansHoraire : true;
					},
					exitChange() {
						aInstance._verifValueTime(false);
					},
				},
			},
			switchPartage: {
				getValue() {
					if (aInstance.evenement) {
						if (aInstance.evenement.publie) {
							$("#" + aInstance.id.ctnDestinataire).show();
							$("#" + aInstance.id.ctnDestinataire).removeAttr("aria-hidden");
						} else {
							$("#" + aInstance.id.ctnDestinataire).hide();
							$("#" + aInstance.id.ctnDestinataire).attr("aria-hidden", "true");
						}
					}
					return !!aInstance.evenement ? aInstance.evenement.publie : true;
				},
				setValue(aValue) {
					aInstance.evenement.publie = aValue;
				},
			},
			switchHoraire: {
				getValue() {
					return !!aInstance.evenement
						? !aInstance.evenement.sansHoraire
						: false;
				},
				setValue(aValue) {
					aInstance.evenement.sansHoraire = !aValue;
					if (aInstance.evenement.sansHoraire) {
						$("#" + aInstance.id.ctnHeure)
							.children()
							.addClass("is-disabled");
					} else {
						$("#" + aInstance.id.ctnHeure)
							.children()
							.removeClass("is-disabled");
					}
				},
			},
			inputTitre: {
				getValue() {
					return !!aInstance.evenement && !!aInstance.evenement.Libelle
						? aInstance.evenement.Libelle
						: "";
				},
				setValue(aValue) {
					aInstance.evenement.Libelle = aValue;
				},
			},
			inputCtnEvent: {
				getValue() {
					return !!aInstance.evenement && !!aInstance.evenement.Commentaire
						? aInstance.evenement.Commentaire
						: "";
				},
				setValue(aValue) {
					aInstance.evenement.Commentaire = aValue;
				},
			},
			comboSelecCategorie: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						ariaLabelledBy: aInstance.id.labeComboSelecCategorie,
						estLargeurAuto: true,
						getContenuElement: function (aParams) {
							const T = [];
							T.push(
								`<div class="libelle ie-line-color" style="--color-line:${aParams.element.couleur}">${aParams.element.getLibelle()}</div>`,
							);
							return T.join("");
						},
					});
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees) {
						return !!aInstance.listeFamilles ? aInstance.listeFamilles : null;
					}
				},
				getIndiceSelection() {
					return !!aInstance.evenement && !!aInstance.evenement.indiceFamille
						? aInstance.evenement.indiceFamille
						: 0;
				},
				event(aParam) {
					if (!!aParam.element) {
						aInstance.evenement.famille = aParam.element;
						aInstance.evenement.indiceFamille = aParam.indice;
					}
				},
			},
		});
	}
	construireInstances() {
		this.identDateDebut = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._evenementSurDate.bind(this, true),
		);
		this.getInstance(this.identDateDebut).setOptionsObjetCelluleDate({
			ariaDescription: ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_SaisieAgenda.DescDateDebut",
			),
		});
		this.identDateFin = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._evenementSurDate.bind(this, false),
		);
		this.getInstance(this.identDateFin).setOptionsObjetCelluleDate({
			ariaDescription: ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_SaisieAgenda.DescDateFin",
			),
		});
		this.identPJ = this.add(
			ObjetSelecteurPJ_1.ObjetSelecteurPJ,
			this._evenementPJ.bind(this),
			this._initialiserPJ.bind(this),
		);
	}
	setDonnees(aParametres) {
		this.donnees = aParametres;
		const lParam = Object.assign(
			{
				agenda: null,
				avecSaisie: false,
				etat: Enumere_Etat_1.EGenreEtat.Aucun,
				listeFamilles: new ObjetListeElements_1.ObjetListeElements(),
				listeJourDansMois: new ObjetListeElements_1.ObjetListeElements(),
				genreEvt: EGenreEvtAgenda_1.EGenreEvtAgenda.nonPeriodique,
			},
			aParametres,
		);
		this.listeFamilles = lParam.listeFamilles;
		this.agenda = lParam.agenda;
		this.listePJ = lParam.listePJ;
		this.avecSaisie = lParam.avecSaisie;
		this.dateDebutAgenda =
			aParametres.dateDebutAgenda || this.objetParametres.PremiereDate;
		this.dateFinAgenda = aParametres.dateFinAgenda;
		this.etat = lParam.etat;
		this.listeJourDansMois = lParam.listeJourDansMois;
		this.genreEvt = lParam.genreEvt;
		this.getInstance(this.identDateDebut).setActif(!!this.avecSaisie);
		this.getInstance(this.identDateFin).setActif(!!this.avecSaisie);
		this.getInstance(this.identDateDebut).setParametresFenetre(
			this.objetParametres.PremierLundi,
			this.dateDebutAgenda,
			this.dateFinAgenda,
		);
		this.getInstance(this.identDateFin).setParametresFenetre(
			this.objetParametres.PremierLundi,
			this.dateDebutAgenda,
			this.dateFinAgenda,
		);
		let lTitreFenetre = "";
		if (this.etat !== Enumere_Etat_1.EGenreEtat.Creation) {
			lTitreFenetre = ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_SaisieAgenda.ModificationEvenement",
			);
			this.evenementOrigine = lParam.agenda;
			this.evenement = MethodesObjet_1.MethodesObjet.dupliquer(lParam.agenda);
		} else {
			lTitreFenetre = ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_SaisieAgenda.NouvelEvenement",
			);
			this.evenementOrigine = null;
			this.evenement = lParam.agenda;
			if (
				ObjetDate_1.GDate.estAvantJour(
					this.evenement.DateDebut,
					this.dateDebutAgenda,
				)
			) {
				this.evenement.DateDebut = new Date(this.dateDebutAgenda);
				this.evenement.DateFin = new Date(this.dateDebutAgenda);
				this.evenement.DateDebut.setHours(9);
				this.evenement.DateFin.setHours(17);
				this.evenement.DateDebut.setMinutes(0);
				this.evenement.DateFin.setMinutes(0);
			}
		}
		const lNumero =
			this.genreEvt !== EGenreEvtAgenda_1.EGenreEvtAgenda.surTouteLaSerie
				? this.evenement.famille.getNumero()
				: this.evenement.periodicite.famille.getNumero();
		const lIndiceSession = this.listeFamilles.getIndiceElementParFiltre(
			(aElement) => {
				return aElement.getNumero() === lNumero;
			},
		);
		this.evenement.indiceFamille = lIndiceSession;
		this.setOptionsFenetre({ titre: lTitreFenetre });
		if (
			this.genreEvt !== EGenreEvtAgenda_1.EGenreEvtAgenda.surEvtUniquement &&
			!!this.evenement.periodicite
		) {
			this.evenement.periodicite.estEvtPerso = false;
		}
		if (this.genreEvt === EGenreEvtAgenda_1.EGenreEvtAgenda.surEvtUniquement) {
			this.evenement.periodicite.estEvtPerso = true;
		}
		this._initValueInputHeure();
		this.afficher(this._composeContenu());
		this.construireAffichage();
		this.updateContenu();
	}
	updateCompteursDestinataires() {
		const lNbClasses = this.evenement.listePublicEntite
			.getListeElements((D) => {
				return (
					D.getGenre() === this.utilitaires.genreRessource.getRessourceClasse()
				);
			})
			.getNbrElementsExistes();
		this.destinataire.nbClasses = lNbClasses;
		const lNbGpe = this.evenement.listePublicEntite
			.getListeElements((D) => {
				return (
					D.getGenre() === this.utilitaires.genreRessource.getRessourceGroupe()
				);
			})
			.getNbrElementsExistes();
		this.destinataire.nbGpe = lNbGpe;
		const lNbIndiv = this.evenement.listePublicIndividu.getNbrElementsExistes();
		this.destinataire.nbIndiv = lNbIndiv;
	}
	_composeContenu() {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"section",
					{ class: "flex-contain cols ObjetFenetre_SaisieAgenda" },
					IE.jsx.str(
						"article",
						{ class: "field-contain p-y-l label-up border-bottom" },
						IE.jsx.str(
							"label",
							{ for: this.id.inputTitre, class: "fix-bloc" },
							ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_SaisieAgenda.TitreEvenement",
							),
						),
						IE.jsx.str("input", {
							type: "text",
							"ie-model": "inputTitre",
							id: this.id.inputTitre,
							placeholder: ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_SaisieAgenda.RedigerTitreEvenement",
							),
							maxlength: this._nbCarTitre,
						}),
					),
					IE.jsx.str(
						"article",
						{ class: "field-contain label-up border-bottom p-bottom" },
						IE.jsx.str(
							"label",
							{ for: this.id.inputCtnEvent, class: "fix-bloc" },
							ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_SaisieAgenda.ContenueEvenement",
							),
						),
						IE.jsx.str("ie-textareamax", {
							"ie-model": "inputCtnEvent",
							id: this.id.inputCtnEvent,
							style: { width: "100%", minHeight: !IE.estMobile && "7rem" },
							"ie-compteur": true,
							placeholder: ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_SaisieAgenda.RedigerContenueEvenement",
							),
							maxlength: c_TailleMaxCommentaire,
						}),
					),
					IE.jsx.str(
						"article",
						{ class: "field-contain label-up border-bottom p-bottom-l" },
						IE.jsx.str(
							"label",
							{ class: "fix-bloc", id: this.id.labeComboSelecCategorie },
							ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_SaisieAgenda.Categorie",
							),
						),
						IE.jsx.str("ie-combo", { "ie-model": "comboSelecCategorie" }),
					),
					IE.jsx.str(
						"section",
						{ class: "field-contain label-up border-bottom p-bottom-l" },
						IE.jsx.str("div", {
							class: "pj-global-conteneur no-line",
							id: this.getNomInstance(this.identPJ),
						}),
						IE.jsx.str("div", {
							class: "pj-liste-conteneur",
							id: this.id.libelleDocJoint,
						}),
						IE.jsx.str("div", {
							class: "pj-liste-conteneur",
							id: this.id.libelleCloud,
						}),
					),
					IE.jsx.str(
						"section",
						{ class: "field-contain label-up border-bottom" },
						IE.jsx.str(
							"article",
							{ class: "periode-contain ctn-date", id: this.id.blocDate },
							IE.jsx.str(
								"span",
								{ class: "label-gauche" },
								ObjetTraduction_1.GTraductions.getValeur(
									"Fenetre_SaisieAgenda.FenetrePeriodiciteDu",
								),
							),
							IE.jsx.str("div", {
								id: this.getNomInstance(this.identDateDebut),
								class: "fluid-bloc",
							}),
							IE.jsx.str(
								"span",
								{ class: "label-gauche" },
								ObjetTraduction_1.GTraductions.getValeur(
									"Fenetre_SaisieAgenda.FenetrePeriodiciteAu",
								).toLowerCase(),
							),
							IE.jsx.str("div", {
								id: this.getNomInstance(this.identDateFin),
								class: "m-all fluid-bloc",
							}),
						),
						IE.jsx.str(
							"section",
							null,
							IE.jsx.str(
								"section",
								{ id: this.id.blocHeure },
								IE.jsx.str(
									"ie-switch",
									{
										"ie-model": "switchHoraire",
										"aria-label": ObjetTraduction_1.GTraductions.getValeur(
											"Fenetre_SaisieAgenda.AvecHoraire",
										),
									},
									ObjetTraduction_1.GTraductions.getValeur(
										"Fenetre_SaisieAgenda.AvecHoraire",
									),
								),
								IE.jsx.str(
									"article",
									{ class: "ctn-time", id: this.id.ctnHeure },
									IE.jsx.str(
										"div",
										{ class: "hours-contain" },
										IE.jsx.str("input", {
											type: "time",
											"aria-label": ObjetTraduction_1.GTraductions.getValeur(
												"Fenetre_SaisieAgenda.WAI.heureDebut",
											),
											"ie-model": "inputTimeHoraire.heureDebut",
										}),
									),
									IE.jsx.str(
										"div",
										{ class: "hours-contain" },
										IE.jsx.str("input", {
											type: "time",
											"aria-label": ObjetTraduction_1.GTraductions.getValeur(
												"Fenetre_SaisieAgenda.WAI.heureFin",
											),
											"ie-model": "inputTimeHoraire.heureFin",
										}),
									),
								),
							),
							IE.jsx.str("ie-btnselecteur", {
								id: this.id.ctnPeriodicite,
								class: "m-y",
								"ie-model": "selecteurPeriodicite",
								"aria-label": this.evenement.estPeriodique
									? ObjetTraduction_1.GTraductions.getValeur(
											"Fenetre_SaisieAgenda.ModifierLaPeriodicite",
										)
									: ObjetTraduction_1.GTraductions.getValeur(
											"Fenetre_SaisieAgenda.DefinirPeriodicite",
										),
							}),
							IE.jsx.str("article", {
								id: this.id.libellePeriodicite,
								class: "m-all-l",
							}),
						),
					),
					IE.jsx.str(
						"section",
						{ class: "field-contain label-up" },
						IE.jsx.str(
							"ie-switch",
							{
								"ie-model": "switchPartage",
								"aria-label": ObjetTraduction_1.GTraductions.getValeur(
									"Fenetre_SaisieAgenda.Publie",
								),
							},
							IE.jsx.str("i", {
								class:
									"iconic icon_fiche_cours_partage color-theme i-medium m-right-l fix-bloc",
								role: "presentation",
							}),
							ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_SaisieAgenda.Publie",
							),
						),
						IE.jsx.str(
							"section",
							{ class: "ctn-destinataire", id: this.id.ctnDestinataire },
							IE.jsx.str("ie-btnselecteur", {
								"ie-model": "selecteurDestParEntite",
								"aria-label": ObjetTraduction_1.GTraductions.getValeur(
									"Fenetre_SaisieAgenda.WAI.destinataireClasseGroupe",
								),
								"ie-if": "pourPN",
							}),
							IE.jsx.str("ie-btnselecteur", {
								"ie-model": "selecteurDestParIndiv",
								"aria-label": ObjetTraduction_1.GTraductions.getValeur(
									"Fenetre_SaisieAgenda.WAI.destinataireIndividuel",
								),
							}),
							IE.jsx.str(
								"div",
								{ "ie-if": "pourPrim", class: "field-contain" },
								IE.jsx.str(
									"ie-checkbox",
									{
										class: "def-txt",
										id: this.id.CBdirecteur,
										"ie-model": "CBdirecteur",
									},
									ObjetTraduction_1.GTraductions.getValeur(
										"actualites.Directeur",
									),
								),
							),
						),
						IE.jsx.str(
							"div",
							{ class: "ctn-messages" },
							IE.jsx.str(
								"p",
								{ tabindex: "0" },
								this.etatUtilisateur.pourPrimaire()
									? ObjetTraduction_1.GTraductions.getValeur(
											"Fenetre_SaisieAgenda.InfoPartageAvecPrimaire",
										)
									: ObjetTraduction_1.GTraductions.getValeur(
											"Fenetre_SaisieAgenda.InfoPartageAvec",
										),
							),
						),
					),
					IE.jsx.str(
						"section",
						{ class: "field-contain " },
						IE.jsx.str(
							"ie-checkbox",
							{
								"ie-model": "cbPublicationPageEtablissement",
								"ie-if": "avecPublicationPageEtablissement",
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_SaisieAgenda.publicationPageEtablissement",
							),
						),
					),
				),
			),
		);
		return H.join("");
	}
	updateContenu() {
		if (!!this.evenement.sansHoraire) {
			$("#" + this.id.ctnHeure)
				.children()
				.addClass("is-disabled");
		} else {
			$("#" + this.id.ctnHeure)
				.children()
				.removeClass("is-disabled");
		}
		this._actualiserBlocHoraire();
		this.updateCompteursDestinataires();
		this._actualiserBlocPeriodicite();
		this._setHeureEvent();
		this.getInstance(this.identPJ).setDonnees({
			idListePJ: this.id.libelleDocJoint,
			listePJ: this.evenement.listeDocJoints,
			listeTotale: this.listePJ,
			idContextFocus: this.Nom,
		});
	}
	_actualiserBlocHoraire() {
		this.getInstance(this.identDateDebut).initialiser();
		this.getInstance(this.identDateDebut).setDonnees(this.evenement.DateDebut);
		this.getInstance(this.identDateFin).initialiser();
		this.getInstance(this.identDateFin).setDonnees(this.evenement.DateFin);
	}
	_actualiserBlocPeriodicite() {
		ObjetHtml_1.GHtml.setDisplay(
			this.id.blocDate,
			this.genreEvt !== EGenreEvtAgenda_1.EGenreEvtAgenda.surTouteLaSerie &&
				this.genreEvt !== EGenreEvtAgenda_1.EGenreEvtAgenda.surNouvelleSerie,
		);
		ObjetHtml_1.GHtml.setDisplay(
			this.id.blocHeure,
			this.genreEvt !== EGenreEvtAgenda_1.EGenreEvtAgenda.surTouteLaSerie &&
				this.genreEvt !== EGenreEvtAgenda_1.EGenreEvtAgenda.surNouvelleSerie,
		);
		ObjetHtml_1.GHtml.setDisplay(
			this.id.libellePeriodicite,
			(this.evenement.estPeriodique &&
				this.genreEvt === EGenreEvtAgenda_1.EGenreEvtAgenda.surTouteLaSerie) ||
				this.genreEvt === EGenreEvtAgenda_1.EGenreEvtAgenda.surNouvelleSerie,
		);
		ObjetHtml_1.GHtml.setDisplay(
			this.id.ctnPeriodicite,
			this.genreEvt !== EGenreEvtAgenda_1.EGenreEvtAgenda.surEvtUniquement,
		);
		if (
			(this.genreEvt === EGenreEvtAgenda_1.EGenreEvtAgenda.surTouteLaSerie ||
				this.genreEvt === EGenreEvtAgenda_1.EGenreEvtAgenda.surNouvelleSerie) &&
			this.evenement.estPeriodique
		) {
			ObjetHtml_1.GHtml.setHtml(
				this.id.libellePeriodicite,
				this.evenement.periodicite.libelleDescription,
			);
		}
	}
	surValidation(aGenreBouton) {
		if (aGenreBouton === 1) {
			let lMsgAvertissementPbPartage;
			if (!this.etatUtilisateur.pourPrimaire()) {
				lMsgAvertissementPbPartage = this._getMsgControlePartageEvenement(
					this.evenement,
				);
			}
			if (!!lMsgAvertissementPbPartage) {
				this.application
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message: lMsgAvertissementPbPartage,
					});
				return;
			}
			this.evenement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this._setHeureEvent();
			if (this.evenement.estPeriodique) {
				if (this.evenement.periodicite.estEvtPerso) {
					this.evenement.periodicite.DateEvenement =
						this.evenementOrigine.DateDebut;
				} else {
					this.evenement.DateFin = this.evenement.DateDebut;
				}
			}
		}
		if (aGenreBouton === 1) {
			this._validationAuto();
		} else {
			this._finSurValidation(aGenreBouton);
		}
	}
	_setHeureEvent() {
		if (
			!this.evenement.estPeriodique ||
			this.evenement.periodicite.estEvtPerso
		) {
			const lEvenement = this.evenement;
			const lHeureDebutHeure = parseInt(
				this.valueInputHeureDebut.substring(0, 2),
			);
			const lHeureDebutMin = parseInt(
				this.valueInputHeureDebut.substring(3, 5),
			);
			const lHeureFinHeure = parseInt(this.valueInputHeureFin.substring(0, 2));
			const lHeureFinMin = parseInt(this.valueInputHeureFin.substring(3, 5));
			lEvenement.DateDebut.setHours(lHeureDebutHeure);
			lEvenement.DateDebut.setMinutes(lHeureDebutMin);
			lEvenement.DateFin.setHours(lHeureFinHeure);
			lEvenement.DateFin.setMinutes(lHeureFinMin);
		}
	}
	_validationAuto() {
		if (
			this.evenement &&
			this.evenement.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun
		) {
			this.evenement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			const lListeEvenements = new ObjetListeElements_1.ObjetListeElements();
			lListeEvenements.addElement(this.evenement);
			new ObjetRequeteSaisieAgenda_1.ObjetRequeteSaisieAgenda(
				this,
				this._reponseSaisie.bind(this, 1),
			)
				.addUpload({
					listeFichiers: this.evenement.listeDocJoints,
					listeDJCloud: this.evenement.listeDocJoints,
				})
				.lancerRequete({
					listeEvenements: lListeEvenements,
					listePiecesJointes: this.evenement.listeDocJoints,
				});
		}
	}
	_reponseSaisie(aGenreBouton, aJSON) {
		this.evenementSaisie = aJSON.evenementSaisie || undefined;
		this.setEtatSaisie(false);
		this._finSurValidation(aGenreBouton);
	}
	_finSurValidation(aGenreBouton) {
		var _a, _b;
		this.callback.appel({
			numeroBouton: aGenreBouton,
			etat: this.etat,
			evenement: this.evenement,
			evenementOrigine: this.evenementOrigine,
			numeroEvenementSaisie:
				(_b =
					(_a = this.evenementSaisie) === null || _a === void 0
						? void 0
						: _a.getNumero()) !== null && _b !== void 0
					? _b
					: null,
		});
		this.fermer();
	}
	_initValueInputHeure() {
		const lEvenement = this.evenement;
		const lHoursDeb =
			lEvenement.DateDebut.getHours().toString().length === 1
				? "0" + lEvenement.DateDebut.getHours()
				: lEvenement.DateDebut.getHours();
		const lMinutesDeb =
			lEvenement.DateDebut.getMinutes().toString().length === 1
				? "0" + lEvenement.DateDebut.getMinutes()
				: lEvenement.DateDebut.getMinutes();
		const lHoursFin =
			lEvenement.DateFin.getHours().toString().length === 1
				? "0" + lEvenement.DateFin.getHours()
				: lEvenement.DateFin.getHours();
		const lMinutesFin =
			lEvenement.DateFin.getMinutes().toString().length === 1
				? "0" + lEvenement.DateFin.getMinutes()
				: lEvenement.DateFin.getMinutes();
		this.valueInputHeureDebut = lHoursDeb + ":" + lMinutesDeb;
		this.valueInputHeureFin = lHoursFin + ":" + lMinutesFin;
	}
	_initialiserPJ(aInstance) {
		aInstance.setOptions({
			genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
			genreRessourcePJ:
				Enumere_Ressource_1.EGenreRessource.DocJointEtablissement,
			avecMenuContextuel: false,
			maxFiles: 0,
			maxSize: this.application.droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
			),
			ouvrirFenetreChoixTypesAjout: true,
			optionsCloud: {
				avecCloud: true,
				callbackChoixFichierParFichier: this.surAjoutUnFichierCloud.bind(this),
				callbackChoixFichierFinal: this.surAjoutFinalFichiersClouds.bind(this),
			},
			avecAjoutExistante: true,
			idLibellePJ: this.id.libelleDocJoint,
			avecBoutonSupp: true,
			libelleSelecteur: ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_SaisieAgenda.AjouterPieceJointes",
			),
		});
	}
	_evenementSurDate(aEstDateDebut, aDate) {
		if (aEstDateDebut) {
			this.evenement.DateDebut = aDate;
			if (
				this.evenement.DateDebut > this.evenement.DateFin ||
				this.evenement.estPeriodique
			) {
				this.evenement.DateFin = new Date(this.evenement.DateDebut);
			}
		} else {
			this.evenement.DateFin = aDate;
			if (
				this.evenement.DateDebut > this.evenement.DateFin ||
				this.evenement.estPeriodique
			) {
				this.evenement.DateDebut = new Date(this.evenement.DateFin);
			}
		}
		this.getInstance(this.identDateDebut).setDonnees(this.evenement.DateDebut);
		this.getInstance(this.identDateFin).setDonnees(this.evenement.DateFin);
		this.updateContenu();
	}
	_evntSelectPeriodicite() {
		if (this.etat === Enumere_Etat_1.EGenreEtat.Creation) {
			this._setHeureEvent();
		}
		const lEvenement = this.evenement;
		const lFenetrePeriodicite =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_EvenementPeriodicite_1.ObjetFenetre_EvenementPeriodicite,
				{
					pere: this,
					initialiser: function (aInstance) {
						aInstance.setDonnees(this);
					},
				},
			);
		lFenetrePeriodicite.afficher();
		const lDateDebut =
			lEvenement.estPeriodique && lEvenement.periodicite.DateDebut
				? lEvenement.periodicite.DateDebut
				: lEvenement.DateDebut;
		const lDateFin =
			lEvenement.estPeriodique && lEvenement.periodicite.DateFin
				? lEvenement.periodicite.DateFin
				: !!this.dateFinAgenda
					? this.dateFinAgenda
					: this.objetParametres.DerniereDate;
		lFenetrePeriodicite
			.getInstance(lFenetrePeriodicite.identDateDebut)
			.setDonnees(lDateDebut);
		lFenetrePeriodicite
			.getInstance(lFenetrePeriodicite.identDateFin)
			.setDonnees(lDateFin);
	}
	_evntSelectDestParEntite() {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			FenetreEditionDestinatairesParEntites_1.FenetreEditionDestinatairesParEntites,
			{
				pere: this,
				evenement: this.evenementSelectionDestinataire.bind(this),
				initialiser: (aInstanceFenetre) => {
					aInstanceFenetre.setUtilitaires(this.utilitaires);
					aInstanceFenetre.setOptionsFenetre({
						largeur: 350,
						avecTailleSelonContenu: true,
						modale: true,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"destinataires.destsParEntites",
						),
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
					});
					aInstanceFenetre.setOptions({ avecChoixParEleve: false });
				},
			},
		);
		lFenetre.setDonnees({ donnee: this.evenement });
	}
	evenementSelectionDestinataire(aNumeroBouton, aDonnees) {
		if (aNumeroBouton === 1) {
			this.evenement = aDonnees.donnee;
			this.updateCompteursDestinataires();
		}
	}
	_evntSelectDestParIndiv() {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			FenetreEditionDestinatairesParIndividus_1.FenetreEditionDestinatairesParIndividus,
			{
				pere: this,
				evenement: this.evenementSelectionDestinataire.bind(this),
				initialiser: function (aInstanceFenetre) {
					aInstanceFenetre.setUtilitaires(this.utilitaires);
					aInstanceFenetre.setOptions({
						avecGestionEleves: this.options
							? this.options.avecGestionEleves
							: true,
						avecGestionPersonnels: this.options
							? this.options.avecGestionPersonnels
							: true,
						avecGestionStages: this.options
							? this.options.avecGestionStages
							: true,
						avecGestionIPR: this.options ? this.options.avecGestionIPR : true,
					});
					aInstanceFenetre.avecListeDiffusion = true;
					aInstanceFenetre.surBtnListeDiffusion = () => {
						let lListeDiffusions = null;
						if (
							Cache_1.GCache &&
							Cache_1.GCache.general.existeDonnee("listeDiffusion")
						) {
							lListeDiffusions =
								Cache_1.GCache.general.getDonnee("listeDiffusion");
						}
						return Promise.resolve()
							.then(() => {
								if (!lListeDiffusions) {
									return new ObjetRequeteListeDiffusion_1.ObjetRequeteListeDiffusion(
										this,
									)
										.lancerRequete()
										.then((aJSON) => {
											if (aJSON && aJSON.liste) {
												lListeDiffusions = aJSON.liste;
												if (Cache_1.GCache) {
													Cache_1.GCache.general.setDonnee(
														"listeDiffusion",
														lListeDiffusions,
													);
												}
											}
										});
								}
							})
							.then(() => {
								return new Promise((aResolve) => {
									if (!lListeDiffusions) {
										return null;
									}
									lListeDiffusions.parcourir((aElement) => {
										aElement.cmsActif = false;
									});
									ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
										ObjetFenetre_SelectionListeDiffusion_1.ObjetFenetre_SelectionListeDiffusion,
										{
											pere: this,
											evenement: (aGenreBouton) => {
												let lListeDiffusionsSelection =
													new ObjetListeElements_1.ObjetListeElements();
												if (aGenreBouton === 1) {
													lListeDiffusionsSelection =
														lListeDiffusions.getListeElements(
															(aElement) => !!aElement.cmsActif,
														);
												}
												aResolve(lListeDiffusionsSelection);
											},
										},
									).setDonnees(
										new DonneesListe_SelectionDiffusion_1.DonneesListe_SelectionDiffusion(
											lListeDiffusions,
										),
										false,
									);
								});
							});
					};
					aInstanceFenetre.setOptionsFenetre({
						avecTailleSelonContenu: true,
						modale: true,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"destinataires.destsATitreIndiv",
						),
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
					});
				},
			},
		);
		lFenetre.setDonnees({ donnee: this.evenement });
	}
	surAjoutUnFichierCloud(aNouvelElement) {
		this.evenement.listeDocJoints.addElement(aNouvelElement);
		this.listePJ.addElement(aNouvelElement);
	}
	surAjoutFinalFichiersClouds() {
		this._actualiserLibelleDocJoints();
		this.evenement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
	}
	_actualiserLibelleDocJoints() {
		if (this.etatUtilisateur.avecCloudDisponibles()) {
			const lIEModelChips = !this.avecSaisie ? null : "chipsDocJoint";
			const lSeparateur = !this.avecSaisie ? ", " : " ";
			ObjetHtml_1.GHtml.setHtml(
				this.id.libelleCloud,
				UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
					this.evenement.listeDocJoints,
					{
						genreFiltre: Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud,
						genreRessource:
							Enumere_Ressource_1.EGenreRessource.DocJointEtablissement,
						separateur: lSeparateur,
						IEModelChips: lIEModelChips,
					},
				),
				{ controleur: this.controleur },
			);
		}
	}
	_getMsgControlePartageEvenement(aEvenement) {
		var _a, _b, _c, _d;
		let lMsg = null;
		if (!!aEvenement) {
			const lNbGenreEntites =
				(_b =
					(_a = aEvenement.genresPublicEntite) === null || _a === void 0
						? void 0
						: _a.count()) !== null && _b !== void 0
					? _b
					: 0;
			const lNbPublicEntite =
				(_d =
					(_c = aEvenement.listePublicEntite) === null || _c === void 0
						? void 0
						: _c.count()) !== null && _d !== void 0
					? _d
					: 0;
			if (lNbGenreEntites > 0 && lNbPublicEntite === 0) {
				lMsg = ObjetTraduction_1.GTraductions.getValeur(
					"Fenetre_SaisieAgenda.SelectionnerAuMoinsUneClasseGroupe",
				);
			} else if (lNbGenreEntites === 0 && lNbPublicEntite > 0) {
				lMsg = ObjetTraduction_1.GTraductions.getValeur(
					"Fenetre_SaisieAgenda.SelectionnerAuMoinsUneEntite",
				);
			}
		}
		return lMsg;
	}
	_evenementPJ() {
		this._actualiserLibelleDocJoints();
		this.evenement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
	}
	_verifValueTime(aEstDebut) {
		let lDebut = this.valueInputHeureDebut;
		let lDebutHours = parseInt(lDebut.substring(0, 2));
		let lDebutMin = parseInt(lDebut.substring(3, 5));
		let lFin = this.valueInputHeureFin;
		let lFinHours = parseInt(lFin.substring(0, 2));
		let lFinMin = parseInt(lFin.substring(3, 5));
		if (aEstDebut) {
			if (lDebutHours > lFinHours) {
				this.valueInputHeureFin = lDebut;
			}
			if (lDebutMin > lFinMin && lDebutHours === lFinHours) {
				this.valueInputHeureFin = lDebut;
			}
		} else {
			if (lFinHours < lDebutHours) {
				this.valueInputHeureDebut = lFin;
			}
			if (lFinMin < lDebutMin && lDebutHours === lFinHours) {
				this.valueInputHeureDebut = lFin;
			}
		}
	}
}
exports.ObjetFenetre_SaisieAgenda = ObjetFenetre_SaisieAgenda;
