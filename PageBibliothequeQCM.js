exports.PageBibliothequeQCM = void 0;
const ObjetSaisieQCM_1 = require("ObjetSaisieQCM");
const ObjetRequeteQCMQuestions_1 = require("ObjetRequeteQCMQuestions");
const ObjetRequeteSaisieCopieQCM_1 = require("ObjetRequeteSaisieCopieQCM");
const ObjetStyle_1 = require("ObjetStyle");
const DonneesListe_SelectionQCM_1 = require("DonneesListe_SelectionQCM");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetFenetreVisuEleveQCM_1 = require("ObjetFenetreVisuEleveQCM");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_SelectionQCM_1 = require("ObjetFenetre_SelectionQCM");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const ObjetFenetre_1 = require("ObjetFenetre");
class PageBibliothequeQCM extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.idMsgSelect = this.Nom + "_MsgSelect";
		this.idSaisieWrapper = this.Nom + "_SaisieWrapper";
		this.questionsEnCopies = new ObjetListeElements_1.ObjetListeElements();
		this.numeroElementEnEchec = null;
		this.compteurEchec = 0;
		this.idBoutonVisu = this.Nom + "_btnVisu";
		this.idBoutonQCM = this.Nom + "_btnQCM";
		this.idBoutonQuestion = this.Nom + "_btnQuestion";
		this.btnVisuActif = false;
		this.btnQCMActif = false;
		this.btnQuestionActif = false;
		this.avecInfoClassePourCopie = false;
		this.avecGestionBaremeSurQuestion = true;
		this.listeNumerosQCMCharges = [];
	}
	construireInstances() {
		this.identListeQCM = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurListeQCM,
			this._initialiserListeQCM,
		);
		this.IdPremierElement = this.getInstance(
			this.identListeQCM,
		).getPremierElement();
		this.idSaisieQCM = this.add(
			ObjetSaisieQCM_1.ObjetSaisieQCM,
			this.evenementSurSaisieQCM,
			this.initialiserSaisieQCM,
		);
	}
	detruireInstances() {
		clearTimeout(this.timerQCM);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnVisu: {
				event() {
					aInstance.evenementSurBoutonVisu();
				},
				getDisabled() {
					return !aInstance.btnVisuActif;
				},
			},
			btnQCM: {
				event() {
					aInstance.evenementSurBoutonQCM();
				},
				getDisabled() {
					return !aInstance.btnQCMActif;
				},
			},
			btnQuestion: {
				event() {
					aInstance.evenementSurBoutonQuestion();
				},
				getDisabled() {
					return !aInstance.btnQuestionActif;
				},
			},
		});
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const T = [];
		const lClassesSaisieWrapper = [];
		lClassesSaisieWrapper.push("display:none;");
		lClassesSaisieWrapper.push("overflow:hidden;");
		lClassesSaisieWrapper.push(
			ObjetStyle_1.GStyle.composeCouleurBordure(GCouleur.bordure, 1),
		);
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "full-size", style: "max-height:calc(100% - 0.8rem)" },
					IE.jsx.str(
						"div",
						{ class: "ly-cols-2" },
						IE.jsx.str(
							"section",
							{ class: "main-content ly-cols-1", style: "width: 50%;" },
							IE.jsx.str("div", {
								class: "content-bloc",
								id: this.getInstance(this.identListeQCM).getNom(),
								style: "overflow:hidden; height:calc(100% - 4.8rem);",
							}),
							IE.jsx.str(
								"footer",
								{
									class: "fix-bloc flex-contain justify-end flex-gap",
									style: "height: 4.8rem;",
								},
								IE.jsx.str(
									"ie-bouton",
									{ id: this.idBoutonQCM, "ie-model": "btnQCM" },
									ObjetTraduction_1.GTraductions.getValeur(
										"QCM_Divers.CopierQCM",
									),
								),
								IE.jsx.str(
									"ie-bouton",
									{ id: this.idBoutonVisu, "ie-model": "btnVisu" },
									ObjetTraduction_1.GTraductions.getValeur(
										"QCM_Divers.VisuEleve",
									),
								),
							),
						),
						IE.jsx.str(
							"section",
							{ class: "main-content ly-cols-1", style: "width: 50%;" },
							IE.jsx.str(
								"div",
								{
									id: this.idMsgSelect,
									class:
										"content-bloc flex-contain flex-center justify-center Gras",
								},
								ObjetTraduction_1.GTraductions.getValeur(
									"SaisieQCM.SelectionnerUnQCM",
								),
							),
							IE.jsx.str(
								"div",
								{
									id: this.idSaisieWrapper,
									class: "content-bloc",
									style: lClassesSaisieWrapper.join(" "),
								},
								IE.jsx.str("div", {
									class: "full-height",
									id: this.getInstance(this.idSaisieQCM).getNom(),
								}),
							),
							IE.jsx.str(
								"footer",
								{ class: "fix-bloc", style: "height: 4.8rem;" },
								IE.jsx.str(
									"ie-bouton",
									{ id: this.idBoutonQuestion, "ie-model": "btnQuestion" },
									ObjetTraduction_1.GTraductions.getValeur(
										"QCM_Divers.CopierQuestion",
									),
								),
							),
						),
					),
				),
			),
		);
		return T.join("");
	}
	setGenreRessources(aParam) {
		this.ress = aParam;
	}
	recupererDonnees() {
		this.getRequeteListeQCMCumuls(
			this.actionSurListeQCMCumuls.bind(this),
		).lancerRequete();
	}
	actionSurListeQCMCumuls(aListeQCM, aMessage) {
		if (aMessage) {
			this.getInstance(this.identListeQCM).setOptionsListe({
				messageContenuVide: aMessage,
			});
		}
		this.listeQCM = aListeQCM;
		this.getInstance(this.identListeQCM).setDonnees(
			new DonneesListe_SelectionQCM_1.DonneesListe_SelectionQCM(
				aListeQCM,
				this.evenementMenuContextuelListeQCM.bind(this),
				{
					formatBiblio: true,
					genreQCM: this.ress.genreQCM,
					multiSelection: false,
					estFDMinimal: false,
				},
			),
		);
	}
	actionSurQCMQuestions(aParam) {
		if (aParam.message) {
			$("#" + this.idSaisieWrapper.escapeJQ()).hide();
			$("#" + this.idMsgSelect.escapeJQ())
				.text(aParam.message)
				.show();
			this.numeroElementEnEchec = this.qcm.getNumero();
			this.compteurEchec++;
			clearTimeout(this.timerQCM);
			this.timerQCM = setTimeout(this.reloadQCM.bind(this), 2000);
			return;
		}
		this.compteurEchec = 0;
		this.numeroElementEnEchec = null;
		$("#" + this.idMsgSelect.escapeJQ()).hide();
		$("#" + this.idSaisieWrapper.escapeJQ()).show();
		this.qcm.contenuQCM = aParam.QCM;
		if (!this.estQCMCharge(this.qcm)) {
			this.listeNumerosQCMCharges.push(this.qcm.getNumero());
		}
		this.getInstance(this.idSaisieQCM).setOptions({ avecCB: true });
		this.getInstance(this.idSaisieQCM).setDonnees({
			contenuQCM: this.qcm.contenuQCM,
			avecEdition: false,
			deployeParDefaut: true,
			envoieVers: false,
		});
		this.btnVisuActif = true;
		this.$refreshSelf();
	}
	estQCMCharge(aQCM) {
		let lEstCharge = false;
		if (aQCM) {
			return this.listeNumerosQCMCharges.includes(aQCM.getNumero());
		}
		return lEstCharge;
	}
	reloadQCM() {
		if (
			this.compteurEchec < 30 &&
			this.numeroElementEnEchec === this.qcm.getNumero()
		) {
			new ObjetRequeteQCMQuestions_1.ObjetRequeteQCMQuestions(
				this,
				this.actionSurQCMQuestions,
			).lancerRequete({ element: this.qcm });
		} else {
			this.compteurEchec = 0;
			this.numeroElementEnEchec = null;
		}
	}
	evenementSurListeQCM(aParametres, aGenreEvenement, I, J) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
				const lElement = this.listeQCM.get(J);
				let lLibelleBandeau = "";
				if (lElement.getGenre() === this.ress.genreQCM) {
					this.qcm = lElement;
					lLibelleBandeau = this.getTitre(this.qcm);
					this.btnQCMActif = true;
					this.$refreshSelf();
					if (!this.estQCMCharge(this.qcm)) {
						new ObjetRequeteQCMQuestions_1.ObjetRequeteQCMQuestions(
							this,
							this.actionSurQCMQuestions,
						).lancerRequete({ element: this.qcm });
					} else {
						this.actionSurQCMQuestions({ QCM: this.qcm.contenuQCM });
					}
				} else {
					$("#" + this.idSaisieWrapper.escapeJQ()).hide();
					$("#" + this.idMsgSelect.escapeJQ()).show();
				}
				this.callback.appel({ libelleBandeau: lLibelleBandeau });
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation: {
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition: {
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression: {
				break;
			}
		}
		return true;
	}
	initialiserSaisieQCM(aInstance) {
		aInstance.setOptions({
			avecGestionBareme: this.avecGestionBaremeSurQuestion,
		});
	}
	evenementSurSaisieQCM(aParam) {
		switch (aParam.action) {
			case ObjetSaisieQCM_1.ObjetSaisieQCM.TypeCallback.CopierQuestion:
				this.getRequeteListeQCMCumuls(
					this.actionSurListeQCMPerso.bind(this),
				).lancerRequete({ qcmPerso: true });
				break;
			case ObjetSaisieQCM_1.ObjetSaisieQCM.TypeCallback.Selection:
				this.questionsEnCopies.vider();
				if (!!aParam.listeQuestions && aParam.listeQuestions.count() > 0) {
					this.questionsEnCopies.add(aParam.listeQuestions);
					this.btnQuestionActif = true;
				} else {
					this.btnQuestionActif = false;
				}
				this.$refreshSelf();
				break;
		}
	}
	actionSurListeQCMPerso(aListeQCM, aMessage) {
		const lFenetreSelectionQCM =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_SelectionQCM_1.ObjetFenetre_SelectionQCM,
				{
					pere: this,
					evenement: (aNumeroBouton, aEltQCM) => {
						if (aNumeroBouton > 0) {
							if (aEltQCM.getGenre() === this.ress.genreQCM) {
								new ObjetRequeteSaisieCopieQCM_1.ObjetRequeteSaisieCopieQCM(
									this,
									this.actionCopieQuestionQCM,
								).lancerRequete({
									sourceQCM: this.qcm,
									questions: this.questionsEnCopies,
									destQCM: aEltQCM,
								});
							}
						}
					},
					initialiser: (aInstance) => {
						UtilitaireQCM_1.UtilitaireQCM.initFenetreSelectionQCM(aInstance);
						aInstance.setGenreRessources({
							genreQCM: this.ress.genreQCM,
							genreNiveau: this.ress.genreNiveau,
							genreMatiere: this.ress.genreMatiere,
							genreAucun: this.ress.genreAucun,
						});
					},
				},
			);
		lFenetreSelectionQCM.setDonnees(aListeQCM, aMessage);
	}
	getClassePourCopiePromise() {
		return Promise.resolve().then(() => {
			return null;
		});
	}
	evenementMenuContextuelListeQCM(aCommande, aElement) {
		if (
			aCommande ===
			DonneesListe_SelectionQCM_1.DonneesListe_SelectionQCM.GenreCommande
				.CopierQCM
		) {
			const lListe = new ObjetListeElements_1.ObjetListeElements();
			lListe.addElement(aElement);
			const lParams = { QCM: lListe, classe: null };
			const lThis = this;
			Promise.resolve()
				.then(() => {
					if (lThis.avecInfoClassePourCopie) {
						return lThis.getClassePourCopiePromise().then((aClasse) => {
							lParams.classe = aClasse;
						});
					}
				})
				.then(() => {
					return new ObjetRequeteSaisieCopieQCM_1.ObjetRequeteSaisieCopieQCM(
						lThis,
						lThis.actionCopieQCM,
					).lancerRequete(lParams);
				})
				.catch((aError) => {
					if (aError) {
					}
				});
		} else if (
			aCommande ===
			DonneesListe_SelectionQCM_1.DonneesListe_SelectionQCM.GenreCommande
				.VisuEleve
		) {
			this.lancerVisuQCM(aElement);
		}
	}
	actionCopieQCM() {
		if (!!this.questionsEnCopies) {
			this.questionsEnCopies.vider();
		}
		GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
			message: ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.copieqcm.ok",
			),
		});
	}
	actionCopieQuestionQCM() {
		if (!!this.questionsEnCopies) {
			this.questionsEnCopies.vider();
		}
		GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
			message: ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.copiequest.ok",
			),
		});
	}
	lancerVisuQCM(aQCM) {
		const lFenetreVisuEleveQCM =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetreVisuEleveQCM_1.ObjetFenetreVisuEleveQCM,
				{ pere: this },
			);
		lFenetreVisuEleveQCM.setParametres(aQCM.getNumero(), true);
		lFenetreVisuEleveQCM.setDonnees(aQCM);
	}
	evenementSurBoutonVisu() {
		this.lancerVisuQCM(this.qcm);
	}
	evenementSurBoutonQCM() {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		lListe.addElement(this.qcm);
		new ObjetRequeteSaisieCopieQCM_1.ObjetRequeteSaisieCopieQCM(
			this,
			this.actionCopieQCM,
		).lancerRequete({ QCM: lListe, avecParametresExecution: false });
	}
	evenementSurBoutonQuestion() {
		this.getRequeteListeQCMCumuls(
			this.actionSurListeQCMPerso.bind(this),
		).lancerRequete({ qcmPerso: true });
	}
	_initialiserListeQCM(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.deployer }],
		});
	}
}
exports.PageBibliothequeQCM = PageBibliothequeQCM;
