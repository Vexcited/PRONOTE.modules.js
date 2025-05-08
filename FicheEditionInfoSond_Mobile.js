const { MethodesObjet } = require("MethodesObjet.js");
const { MoteurInfoSondage } = require("MoteurInfoSondage.js");
const { Identite } = require("ObjetIdentite.js");
const { GHtml } = require("ObjetHtml.js");
const { GUID } = require("GUID.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { tag } = require("tag.js");
const { Toast, ETypeToast } = require("Toast.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { GDate } = require("ObjetDate.js");
const { ObjetSelection } = require("ObjetSelection.js");
const { MoteurDestinataires } = require("MoteurDestinataires.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
	FenetreEditionDestinatairesParEntites: FenetreEditDestParEntites,
} = require("FenetreEditionDestinatairesParEntites.js");
const {
	FenetreEditionDestinatairesParIndividus: FenetreEditDestParIndividus,
} = require("FenetreEditionDestinatairesParIndividus.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
class FicheEditionInfoSond_Mobile extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.id = {
			titre: GUID.getId(),
			listePJ: GUID.getId(),
			nbEntiteClasse: GUID.getId(),
			nbEntiteGpe: GUID.getId(),
			nbIndividus: GUID.getId(),
			nbProfs: GUID.getId(),
			nbPersonnels: GUID.getId(),
			nbResponsables: GUID.getId(),
		};
		this.forcerAR = false;
		this.options = {};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			avecBtnListeDiffusion() {
				return aInstance.avecListeDiffusion;
			},
			btnListeDiffusion: {
				event() {
					aInstance.surBtnListeDiffusion().then((aListeSelec) => {
						if (aListeSelec && aListeSelec.count() > 0) {
							aListeSelec.parcourir((aDiffusion) => {
								aDiffusion.listePublicIndividu.parcourir((aElement) => {
									if (
										!aInstance.donnee.listePublicIndividu.getElementParElement(
											aElement,
										)
									) {
										aInstance.donnee.listePublicIndividu.addElement(
											MethodesObjet.dupliquer(aElement),
										);
										aInstance.donnee.avecModificationPublic = true;
									}
								});
							});
							aInstance.updateCompteursDestinataires();
						}
					});
				},
			},
			getEntiteClasse: {
				getLibelle() {
					return `${GTraductions.getValeur("infoSond.parClasses")}<span class="strNumber" id="${aInstance.id.nbEntiteClasse}"> (0) </span> ${GTraductions.getValeur("infoSond.ouGroupes")}<span class="strNumber" id="${aInstance.id.nbEntiteGpe}"> (0) </span>`;
				},
				getIcone() {
					return `<i class="icon_group"></i>`;
				},
			},
			getSelectRessource: {
				getIcone() {
					return `<i class="icon_group"></i>`;
				},
			},
			nodeSelectDestParEntite: function () {
				$(this.node).on(
					"click",
					function () {
						const lFenetre = ObjetFenetre.creerInstanceFenetre(
							FenetreEditDestParEntites,
							{
								pere: this,
								evenement: function (aNumeroBouton, aDonnees) {
									if (aNumeroBouton === 1) {
										this.donnee = aDonnees.donnee;
										this.updateCompteursDestinataires();
									}
								}.bind(this),
								initialiser: function (aInstanceFenetre) {
									aInstanceFenetre.setUtilitaires(aInstance.utilitaires);
									aInstanceFenetre.setOptions({
										avecCBElevesRattaches: this.options
											? this.options.avecCBElevesRattaches
											: false,
									});
									aInstanceFenetre.setOptionsFenetre({
										modale: true,
										titre: GTraductions.getValeur(
											"destinataires.destsParEntites",
										),
										listeBoutons: [
											GTraductions.getValeur("Annuler"),
											GTraductions.getValeur("Valider"),
										],
									});
								}.bind(this),
							},
						);
						lFenetre.setDonnees({ donnee: this.donnee });
					}.bind(aInstance),
				);
			},
			getIndividu: {
				getLibelle() {
					return `${GTraductions.getValeur("infoSond.aTitreIndiv")}<span class="strNumber" id="${aInstance.id.nbIndividus}"> (0)</span>`;
				},
				getIcone() {
					return `<i class="icon_user"></i>`;
				},
			},
			nodeSelectDestParIndiv: function () {
				$(this.node).on(
					"click",
					function () {
						const lFenetre = ObjetFenetre.creerInstanceFenetre(
							FenetreEditDestParIndividus,
							{
								pere: this,
								evenement: function (aNumeroBouton, aDonnees) {
									if (aNumeroBouton === 1) {
										this.donnee = aDonnees.donnee;
										this.updateCompteursDestinataires();
									}
								}.bind(aInstance),
								initialiser: function (aInstanceFenetre) {
									aInstanceFenetre.setUtilitaires(aInstance.utilitaires);
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
										avecGestionIPR: this.options
											? this.options.avecGestionIPR
											: true,
									});
									aInstanceFenetre.avecListeDiffusion = this.avecListeDiffusion;
									aInstanceFenetre.surBtnListeDiffusion =
										this.surBtnListeDiffusion;
									aInstanceFenetre.setOptionsFenetre({
										modale: true,
										titre: GTraductions.getValeur(
											"destinataires.destsATitreIndiv",
										),
										listeBoutons: [
											GTraductions.getValeur("Annuler"),
											GTraductions.getValeur("Valider"),
										],
									});
								},
							},
						);
						lFenetre.setDonnees({ donnee: this.donnee });
					}.bind(aInstance),
				);
			},
			nodeSelectDest_RespToResp: function () {
				$(this.node).on(
					"click",
					function () {
						this.openModaleSelectionPublic({
							genreRessource:
								this.utilitaires.genreRessource.getRessourceParent(),
							listePublicDonnee: this.donnee.listePublicIndividu,
							clbck: function (aParam) {
								this.donnee.listePublicIndividu = aParam.listePublicDonnee;
								this.donnee.avecModificationPublic =
									aParam.avecModificationPublic;
								this.updateCompteursDestinataires();
							}.bind(this),
						});
					}.bind(aInstance),
				);
			},
			nodeSelectDestPrimaire_RespClasses: function (aGenreRessource) {
				$(this.node).on(
					"click",
					function () {
						this.openModaleSelectRespClasses({
							genreRessource: aGenreRessource,
							donnee: this.donnee,
							clbck: function () {
								this.utilitaires.moteurDestinataires.surSelectEntitesPrimaireRespClasses(
									{ donnee: this.donnee },
								);
								this.updateCompteursDestinataires();
							}.bind(this),
						});
					}.bind(aInstance),
				);
			},
			nodeSelectDestPrimaire_Public: function (aGenreRessource) {
				$(this.node).on(
					"click",
					function () {
						this.openModaleSelectionPublic({
							genreRessource: aGenreRessource,
							listePublicDonnee: this.donnee.listePublicIndividu,
							clbck: function (aParam) {
								this.donnee.listePublicIndividu = aParam.listePublicDonnee;
								this.donnee.avecModificationPublic =
									aParam.avecModificationPublic;
								this.updateCompteursDestinataires();
							}.bind(this),
						});
					}.bind(aInstance),
				);
			},
			cbPrimaire_Directeur: {
				getValue: function () {
					return this.donnee.avecDirecteur;
				}.bind(aInstance),
				setValue: function (aValue) {
					this.donnee.avecDirecteur = aValue;
					this.donnee.avecModificationPublic = true;
				}.bind(aInstance),
				getDisabled: function () {
					return false;
				}.bind(aInstance),
			},
			nodeTitre: function () {
				$(this.node).on(
					"focusin",
					function () {
						GHtml.setSelectionEdit(this.id.titre);
					}.bind(aInstance),
				);
			},
			titre: {
				getValue: function () {
					return this.donnee !== null && this.donnee !== undefined
						? this.donnee.getLibelle()
						: "";
				}.bind(aInstance),
				setValue: function (aValue) {
					this.donnee.setLibelle(aValue);
				}.bind(aInstance),
				getDisabled: function () {
					return this.donnee.estVerrouille;
				}.bind(aInstance),
				node: function () {
					$(this.node).attr(
						"placeholder",
						GTraductions.getValeur("infoSond.redigerTitre"),
					);
				},
			},
			contenu: {
				getValue: function () {
					let lResult = "";
					if (
						this.donnee !== null &&
						this.donnee !== undefined &&
						this.donnee.estInformation &&
						this.donnee.listeQuestions.getNbrElementsExistes() > 0
					) {
						const lContenu = this.donnee.listeQuestions.getPremierElement();
						lResult = lContenu.texte;
					}
					return lResult;
				}.bind(aInstance),
				setValue: function (aValue) {
					if (
						this.donnee !== null &&
						this.donnee !== undefined &&
						this.donnee.estInformation &&
						this.donnee.listeQuestions.getNbrElementsExistes() > 0
					) {
						const lContenu = this.donnee.listeQuestions.getPremierElement();
						lContenu.texte = aValue;
						lContenu.setEtat(EGenreEtat.Modification);
					}
				}.bind(aInstance),
				getDisabled: function () {
					return this.donnee.estVerrouille;
				}.bind(aInstance),
			},
			cbAR: {
				getValue: function () {
					let lResult = false;
					if (
						this.donnee !== null &&
						this.donnee !== undefined &&
						this.donnee.estInformation &&
						this.donnee.listeQuestions.getNbrElementsExistes() > 0
					) {
						const lContenu = this.donnee.listeQuestions.getPremierElement();
						lResult = lContenu.avecAR;
					}
					return lResult;
				}.bind(aInstance),
				setValue: function () {
					if (
						this.donnee !== null &&
						this.donnee !== undefined &&
						this.donnee.estInformation &&
						this.donnee.listeQuestions.getNbrElementsExistes() > 0
					) {
						const lContenu = this.donnee.listeQuestions.getPremierElement();
						lContenu.avecAR = !lContenu.avecAR;
						lContenu.setEtat(EGenreEtat.Modification);
					}
				}.bind(aInstance),
				getDisabled: function () {
					return this.donnee !== null && this.donnee !== undefined
						? !this.donnee.estInformation
						: true;
				}.bind(aInstance),
			},
			selecteurPJ: function () {
				$(this.node).on(
					"click",
					function () {
						if (
							this.donnee !== null &&
							this.donnee !== undefined &&
							this.donnee.estInformation &&
							this.donnee.listeQuestions.getNbrElementsExistes() > 0
						) {
							const lContenu = this.donnee.listeQuestions.getPremierElement();
							_evntSurEditPJ.call(aInstance, {
								instance: aInstance,
								element: aInstance.donnee,
								genre: EGenreDocumentJoint.Fichier,
								listePiecesJointes: this.listePJ,
								listePJContexte: lContenu.listePiecesJointes,
								maxSize: this.maxSizePJ,
								listePeriodes: null,
								dateCoursDeb: null,
								validation: function (
									aParamsFenetre,
									aListeFichiers,
									aAvecSaisie,
								) {
									if (
										aAvecSaisie &&
										this.donnee !== null &&
										this.donnee !== undefined &&
										this.donnee.estInformation &&
										this.donnee.listeQuestions.getNbrElementsExistes() > 0
									) {
										this.listePJCree.add(aListeFichiers);
										const lContenu =
											this.donnee.listeQuestions.getPremierElement();
										lContenu.setEtat(EGenreEtat.Modification);
									}
									GHtml.setHtml(
										this.id.listePJ,
										_construireHtmlListePJ.call(this),
										this.controleur,
									);
								}.bind(this),
							});
						}
					}.bind(aInstance),
				);
			},
			btnPJ: {
				getIcone() {
					return '<i class="icon_piece_jointe"></i>';
				},
				getLibelle() {
					return GTraductions.getValeur("infoSond.ajouterPJ");
				},
			},
			chipsPJ: {
				eventBtn: function (aIndice) {
					if (
						this.donnee !== null &&
						this.donnee !== undefined &&
						this.donnee.estInformation &&
						this.donnee.listeQuestions.getNbrElementsExistes() > 0
					) {
						const lContenu = this.donnee.listeQuestions.getPremierElement();
						const lPJ = lContenu.listePiecesJointes.get(aIndice);
						if (lPJ) {
							GApplication.getMessage().afficher({
								type: EGenreBoiteMessage.Confirmation,
								message: GTraductions.getValeur("selecteurPJ.msgConfirmPJ", [
									lPJ.getLibelle(),
								]),
								callback: function (aAccepte) {
									if (aAccepte !== EGenreAction.Valider) {
										return;
									}
									lPJ.setEtat(EGenreEtat.Suppression);
									lContenu.setEtat(EGenreEtat.Modification);
									GHtml.setHtml(
										this.id.listePJ,
										_construireHtmlListePJ.call(this),
										this.controleur,
									);
								}.bind(this),
							});
						}
					}
				}.bind(aInstance),
			},
			radioPublication: {
				getValue: function (aBool) {
					return !!this.donnee && this.donnee.publie === aBool;
				}.bind(aInstance),
				setValue: function (aBool) {
					this.donnee.publie = aBool;
					this.instanceCalendrierDebPublication.setActif(!!this.donnee.publie);
					this.instanceCalendrierFinPublication.setActif(!!this.donnee.publie);
				}.bind(aInstance),
			},
			cbPublicationPageEtablissement: {
				getValue() {
					return (
						!!aInstance.donnee &&
						aInstance.donnee.estInformation &&
						!!aInstance.donnee.publicationPageEtablissement
					);
				},
				setValue(aValue) {
					if (!!aInstance.donnee && aInstance.donnee.estInformation) {
						aInstance.donnee.publicationPageEtablissement = aValue;
					}
				},
				getDisabled() {
					return !aInstance.donnee || !aInstance.donnee.publie;
				},
			},
			pourPageEtablissement: function () {
				if (
					aInstance.options.avecPublicationPageEtablissement &&
					!!aInstance.donnee &&
					aInstance.donnee.estInformation &&
					!aInstance.donnee.estModele &&
					!aInstance.pourPunitionIncident
				) {
					return true;
				}
				return false;
			},
		});
	}
	setUtilitaires(aUtilitaires) {
		this.utilitaires = aUtilitaires;
		this.moteurCP = new MoteurInfoSondage(this.utilitaires);
		this.moteurDestinataires = new MoteurDestinataires(this.utilitaires);
	}
	construireInstances() {
		this.instanceCalendrierDebPublication = this.instancierCalendrier(
			(aDate) => {
				if (
					this.donnee.publie === true &&
					!GDate.estJourEgal(aDate, this.donnee.dateDebut)
				) {
					this.donnee.dateDebut = aDate;
					if (this.donnee.dateDebut > this.donnee.dateFin) {
						this.donnee.dateFin = this.donnee.dateDebut;
						this.instanceCalendrierFinPublication.setDonnees(
							this.donnee.dateFin,
						);
					}
				}
			},
			this,
		);
		this.instanceCalendrierFinPublication = this.instancierCalendrier(
			(aDate) => {
				if (
					this.donnee.publie === true &&
					!GDate.estJourEgal(aDate, this.donnee.dateFin)
				) {
					this.donnee.dateFin = aDate;
					if (this.donnee.dateFin < this.donnee.dateDebut) {
						this.donnee.dateDebut = this.donnee.dateFin;
						this.instanceCalendrierDebPublication.setDonnees(
							this.donnee.dateDebut,
						);
					}
				}
			},
			this,
		);
		this.instanceSelectCategorie = this.instancierSelecteur(
			(aParam) => {
				this.donnee.categorie = aParam.element;
			},
			this,
			{
				avecBoutonsPrecedentSuivant: false,
				labelWAICellule: GTraductions.getValeur("infoSond.categorie"),
			},
		);
	}
	composeDate(aParam) {
		const H = [];
		H.push('<div id="', aParam.id, '" class="', aParam.classCss, '"></div>');
		return H.join("");
	}
	composeSelecteur(aParam) {
		const H = [];
		H.push(
			'<label class="ie-titre-petit">',
			GTraductions.getValeur("infoSond.categorie"),
			"</label>",
		);
		H.push('<div id="', aParam.id, '" class="', aParam.classCss, '"></div>');
		return H.join("");
	}
	updateContenu() {
		this.instanceCalendrierDebPublication.initialiser();
		this.instanceCalendrierDebPublication.setDonnees(this.donnee.dateDebut);
		this.instanceCalendrierDebPublication.setActif(!!this.donnee.publie);
		this.instanceCalendrierFinPublication.initialiser();
		this.instanceCalendrierFinPublication.setDonnees(this.donnee.dateFin);
		this.instanceCalendrierFinPublication.setActif(!!this.donnee.publie);
		this.updateSelecteur({
			liste: this.listeCategories,
			donnee: this.donnee.categorie,
			instanceSelect: this.instanceSelectCategorie,
		});
		this.updateCompteursDestinataires();
	}
	instancierCalendrier(aEvnt, aPere) {
		const lInstance = Identite.creerInstance(ObjetCelluleDate, {
			pere: aPere,
			evenement: aEvnt.bind(aPere),
		});
		lInstance.setParametresFenetre(
			window.GParametres.PremierLundi,
			GDate.getJourSuivant(window.GParametres.PremiereDate, -100),
			GDate.getJourSuivant(window.GParametres.DerniereDate, 100),
		);
		return lInstance;
	}
	instancierSelecteur(aEvnt, aPere, aParam) {
		const lInstance = Identite.creerInstance(ObjetSelection, {
			pere: aPere,
			evenement: aEvnt.bind(aPere),
		});
		lInstance.setParametres(aParam);
		return lInstance;
	}
	updateSelecteur(aParam) {
		if (aParam.liste) {
			let lIndiceParDefaut = 0;
			const lDonnee = aParam.donnee;
			if (lDonnee !== null && lDonnee !== undefined) {
				lIndiceParDefaut = aParam.liste.getIndiceElementParFiltre((aElt) => {
					if (aParam.comparerGenre === true) {
						return aElt.getGenre() === lDonnee.getGenre();
					} else {
						return aElt.getNumero() === lDonnee.getNumero();
					}
				});
			}
			aParam.instanceSelect.setDonnees(aParam.liste, lIndiceParDefaut);
		}
	}
	setOptions(aOptions) {
		this.options = aOptions;
	}
	setDonnees(aParam) {
		Promise.resolve()
			.then(() => {
				return this.utilitaires.moteurGestionPJ.getDonneesEditionInformation();
			})
			.then((aDonnees) => {
				this.listePJCree = new ObjetListeElements();
				this.listePJ =
					this.utilitaires.moteurGestionPJ.getListePJEtablissement();
				this.maxSizePJ = aParam.maxSizePJ;
				this.listeCategories = aDonnees.listeCategories;
				this.indiceCategorieParDefaut =
					this.listeCategories.getIndiceElementParFiltre((aElement) => {
						return aElement.estDefaut;
					});
				if (this.indiceCategorieParDefaut === -1) {
					this.indiceCategorieParDefaut = 0;
				}
				if (aParam.forcerAR !== null && aParam.forcerAR !== undefined) {
					this.forcerAR = aParam.forcerAR;
				}
				if (aParam.donnee !== null && aParam.donnee !== undefined) {
					this.donneeOrigine = aParam.donnee;
				} else {
					this.donneeOrigine = this.moteurCP.initialiserNouveauItem({
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
						estInformation: aParam.estInfo,
						dateFinDerniereDate: true,
						publie: aParam.publie,
					});
				}
				this.donnee = MethodesObjet.dupliquer(this.donneeOrigine);
				this.afficher(this.composeContenu());
				this.updateContenu();
				if (_estCasParentsDelegues.call(this)) {
					this.utilitaires.moteurDestinataires.automatiserSelectionPublic({
						genreRessource:
							this.utilitaires.genreRessource.getRessourceParent(),
						donnee: this.donnee,
						clbck: function () {
							this.updateCompteursDestinataires();
						}.bind(this),
					});
				}
			});
	}
	composeContenu() {
		return this.construireHtml();
	}
	updateCompteursDestinataires() {
		const lNbClasses = this.donnee.listePublicEntite
			.getListeElements((D) => {
				return (
					D.getGenre() === this.utilitaires.genreRessource.getRessourceClasse()
				);
			})
			.getNbrElementsExistes();
		GHtml.setHtml(
			this.id.nbEntiteClasse,
			_construireHtmlNb.call(this, lNbClasses),
		);
		const lNbGpe = this.donnee.listePublicEntite
			.getListeElements((D) => {
				return (
					D.getGenre() === this.utilitaires.genreRessource.getRessourceGroupe()
				);
			})
			.getNbrElementsExistes();
		GHtml.setHtml(this.id.nbEntiteGpe, _construireHtmlNb.call(this, lNbGpe));
		if (this.utilitaires.genreEspace.estPourPrimaire()) {
			const lNbResponsables = this.donnee.listePublicIndividu
				.getListeElements((D) => {
					return (
						D.getGenre() ===
						this.utilitaires.genreRessource.getRessourceParent()
					);
				})
				.getNbrElementsExistes();
			GHtml.setHtml(
				this.id.nbResponsables,
				_construireHtmlNb.call(this, lNbResponsables),
			);
			const lNbProfs = this.donnee.listePublicIndividu
				.getListeElements((D) => {
					return (
						D.getGenre() === this.utilitaires.genreRessource.getRessourceProf()
					);
				})
				.getNbrElementsExistes();
			GHtml.setHtml(this.id.nbProfs, _construireHtmlNb.call(this, lNbProfs));
			const lNbPersonnels = this.donnee.listePublicIndividu
				.getListeElements((D) => {
					return (
						D.getGenre() ===
						this.utilitaires.genreRessource.getRessourcePersonnel()
					);
				})
				.getNbrElementsExistes();
			GHtml.setHtml(
				this.id.nbPersonnels,
				_construireHtmlNb.call(this, lNbPersonnels),
			);
		} else if (_estCasParentsDelegues.call(this)) {
			const lNbResponsables = this.donnee.listePublicIndividu
				.getListeElements((D) => {
					return (
						D.getGenre() ===
						this.utilitaires.genreRessource.getRessourceParent()
					);
				})
				.getNbrElementsExistes();
			GHtml.setHtml(
				this.id.nbResponsables,
				_construireHtmlNb.call(this, lNbResponsables),
			);
		} else {
			const lNbIndiv = this.donnee.listePublicIndividu.getNbrElementsExistes();
			GHtml.setHtml(
				this.id.nbIndividus,
				_construireHtmlNb.call(this, lNbIndiv),
			);
		}
	}
	construireHtml() {
		const H = [];
		let lSansBordure =
			this.options.avecPublicationPageEtablissement &&
			!!this.donnee &&
			this.donnee.estInformation &&
			!this.donnee.estModele &&
			!this.pourPunitionIncident;
		H.push('<div class="FicheEditionInfoSond_Mobile">');
		if (this.donnee !== null && this.donnee !== undefined) {
			H.push('<div class="field-contain">');
			H.push(_construireHtmlDestinataires.call(this));
			H.push("</div>");
			if (!this.donnee.estVerrouille) {
				H.push('<div class="field-contain">');
				H.push(
					this.composeSelecteur({
						id: this.instanceSelectCategorie.getNom(),
						classCss: "",
					}),
				);
				H.push("</div>");
				H.push('<div class="field-contain">');
				H.push(
					'<label class="ie-titre-petit">',
					GTraductions.getValeur("infoSond.libelleTitre"),
					"</label>",
				);
				H.push(
					this.moteurCP.composeFormText({
						id: this.id.titre,
						node: "nodeTitre",
						model: "titre",
						classCss: "round-style",
					}),
				);
				H.push("</div>");
				if (
					this.donnee.estInformation &&
					this.donnee.listeQuestions.getNbrElementsExistes() > 0
				) {
					H.push('<div class="field-contain">');
					H.push(
						'<label class="ie-titre-petit">',
						GTraductions.getValeur("infoSond.Contenu"),
						"</label>",
					);
					H.push(
						tag(
							"div",
							{
								contenteditable: "true",
								"ie-model": "contenu",
								class: ["contenteditable_index"],
								placeholder: GTraductions.getValeur(
									"infoSond.redigerContenuInfo",
								),
							},
							"",
						),
					);
					H.push("</div>");
					H.push('<div class="pj-global-conteneur p-x-l m-bottom-l">');
					H.push(
						"<ie-btnselecteur ",
						GHtml.composeAttr("ie-node", "selecteurPJ", []),
						' ie-model="btnPJ" class="pj" role="button">',
					);
					H.push("</ie-btnselecteur>");
					H.push(
						`<div class="pj-liste-conteneur" id="${this.id.listePJ}">`,
						_construireHtmlListePJ.call(this),
						"</div>",
					);
					H.push("</div>");
				}
			} else {
				H.push(
					'<div class="ie-titre-petit item msgContenuNonModifiable">',
					GTraductions.getValeur("actualites.Edition.NonModifiable"),
					"</div>",
				);
			}
			if (this.forcerAR !== true) {
				H.push('<div class="field-contain">');
				H.push(
					'<ie-checkbox class="first-capitalize" ie-model="cbAR">',
					GTraductions.getValeur("actualites.Edition.AvecAR"),
					"</ie-checkbox>",
				);
				H.push("</div>");
			}
			H.push(`<div class="field-contain flex-contain cols flex-gap-l">`);
			H.push(
				'<ie-radio ie-model="radioPublication(false)" class="itemPublication">',
				GTraductions.getValeur("actualites.NonPubliee"),
				"</ie-radio>",
			);
			H.push(
				'<ie-radio ie-model="radioPublication(true)" class="itemPublication last">',
				GTraductions.getValeur("actualites.Publier"),
				"</ie-radio>",
			);
			H.push(`</div>`);
			IE.log.addLog(`Message ${lSansBordure}`);
			H.push(
				`<div class="field-contain ${lSansBordure ? `` : `no-line`} flex-contain flex-center flex-gap">`,
			);
			H.push("<span>", GTraductions.getValeur("Du"), "</span>");
			H.push(
				this.composeDate({
					id: this.instanceCalendrierDebPublication.getNom(),
				}),
			);
			H.push("<span>", GTraductions.getValeur("Au"), "</span>");
			H.push(
				this.composeDate({
					id: this.instanceCalendrierFinPublication.getNom(),
				}),
			);
			H.push("</div>");
			H.push('<div class="field-contain" ie-display="pourPageEtablissement">');
			H.push(
				'<ie-checkbox ie-model="cbPublicationPageEtablissement">',
				GTraductions.getValeur(
					"actualites.Edition.publicationPageEtablissement",
				),
				"</ie-checkbox>",
			);
			H.push("</div>");
			H.push("</div>");
		}
		H.push("</div>");
		return H.join("");
	}
	openModaleSelectRespClasses(aParam) {
		this.utilitaires.moteurDestinataires.ouvrirModaleSelectionRessource(aParam);
	}
	openModaleSelectionPublic(aParam) {
		this.utilitaires.moteurDestinataires.ouvrirModaleSelectionPublic(aParam);
	}
	surValidation(aGenreBouton) {
		const lEstValidation = aGenreBouton === 1;
		if (lEstValidation) {
			const lControleContenu = _controlerContenu.call(this);
			if (!lControleContenu) {
				Toast.afficher({
					msg: GTraductions.getValeur("actualites.MsgAucunContenu"),
					type: ETypeToast.info,
				});
				return;
			}
			if (!!this.donnee.publie) {
				const lControleDetinataires =
					this.moteurDestinataires.controlerSurValidation({
						donnee: this.donnee,
					});
				if (!lControleDetinataires) {
					return;
				}
			}
			this.donnee.setEtat(
				this.moteurCP.verifierEtatModification({
					donnee: this.donnee,
					donneeOrigine: this.donneeOrigine,
				}),
			);
		}
		if (lEstValidation) {
			this.moteurCP.validerEdition({
				donnee: this.donnee,
				listePJ: this.listePJ,
				envoyerRequete: function (aObjetSaisie) {
					this.envoyerRequete({
						listePJ: this.listePJ,
						listePJCree: this.listePJCree,
						paramRequete: aObjetSaisie,
						clbckSurReussite: this.finaliserValidation.bind(this),
					});
				}.bind(this),
			});
		} else {
			this.finaliserValidation(aGenreBouton);
		}
	}
	finaliserValidation(aGenreBouton, aJSONReponse, aJSONRapport) {
		this.fermer();
		const lParam = {
			donnee: aGenreBouton === 0 ? this.donneeOrigine : this.donnee,
			eltCree:
				aJSONRapport !== null &&
				aJSONRapport !== undefined &&
				aJSONRapport.infoSondCree !== null &&
				aJSONRapport.infoSondCree !== undefined
					? aJSONRapport.infoSondCree
					: null,
		};
		this.callback.appel(aGenreBouton, lParam);
	}
}
function _estCasParentsDelegues() {
	return this.utilitaires.genreEspace.estEspaceParent(
		GEtatUtilisateur.GenreEspace,
	);
}
function _construireHtmlListePJ() {
	const H = [];
	const lQuestion = this.donnee.listeQuestions.getPremierElement();
	H.push(
		UtilitaireUrl.construireListeUrls(lQuestion.listePiecesJointes, {
			IEModelChips: "chipsPJ",
		}),
	);
	return H.join("");
}
function _construireHtmlNb(aNb) {
	return " (" + aNb + ") ";
}
function _construireHtmlDestinataires() {
	const H = [];
	const lIdLabel = GUID.getId();
	H.push(
		'<label id="',
		lIdLabel,
		'" class="ie-titre-petit">',
		GTraductions.getValeur("infoSond.destinataires"),
		"</label>",
	);
	if (this.utilitaires.genreEspace.estPourPrimaire()) {
		H.push(
			'<div class="m-bottom-l" ie-if="avecBtnListeDiffusion"><ie-bouton class="small-bt themeBoutonNeutre" ie-model="btnListeDiffusion">',
			GTraductions.getValeur("listeDiffusion.btnListeDiffusion"),
			"</ie-bouton></div>",
		);
		H.push(
			this.utilitaires.moteurDestinataires.construireHtmlDestPrimaireResponsables(
				{
					node: "nodeSelectDestPrimaire_Public",
					idCompteur: this.id.nbResponsables,
				},
			),
		);
		H.push(
			this.utilitaires.moteurDestinataires.construireHtmlDestPrimaireProfs({
				node: "nodeSelectDestPrimaire_Public",
				idCompteur: this.id.nbProfs,
			}),
		);
		H.push(
			this.utilitaires.moteurDestinataires.construireHtmlDestPrimairePersonnels(
				{
					node: "nodeSelectDestPrimaire_Public",
					idCompteur: this.id.nbPersonnels,
				},
			),
		);
		H.push(
			this.utilitaires.moteurDestinataires.construireHtmlDestPrimaireDirecteur({
				node: "cbPrimaire_Directeur",
				str: GTraductions.getValeur("actualites.Directeur"),
			}),
		);
	} else if (_estCasParentsDelegues.call(this)) {
		H.push(
			this.utilitaires.moteurDestinataires.construireHtmlDestRespToResp({
				node: "nodeSelectDest_RespToResp",
				idCompteur: this.id.nbResponsables,
			}),
		);
	} else {
		H.push(
			`<ie-btnselecteur class="m-bottom" ie-model="getEntiteClasse" ie-node="nodeSelectDestParEntite()" aria-labelledby="${lIdLabel}"></ie-btnselecteur>`,
		);
		H.push(
			`<ie-btnselecteur ie-model="getIndividu" ie-node="nodeSelectDestParIndiv()" aria-labelledby="${lIdLabel}"></ie-btnselecteur>`,
		);
	}
	return H.join("");
}
function _controlerContenu() {
	let lEstContenuVide = false;
	if (
		this.donnee !== null &&
		this.donnee !== undefined &&
		this.donnee.estInformation &&
		this.donnee.listeQuestions.getNbrElementsExistes() > 0
	) {
		const lContenu = this.donnee.listeQuestions.getPremierElement();
		const lStr = lContenu.texte.trim();
		const lContenuEscape = $(GHtml.htmlToDOM(tag("div", lStr)))
			.text()
			.trim();
		lEstContenuVide = lContenuEscape === "";
	}
	return !lEstContenuVide;
}
function _evntSurEditPJ(aParam) {
	this.utilitaires.moteurGestionPJ.ouvrirModaleSelectionPJ(aParam);
}
module.exports = { FicheEditionInfoSond_Mobile };
