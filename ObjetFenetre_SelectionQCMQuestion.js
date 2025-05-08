exports.TypeBibliothequeQCM = exports.ObjetFenetre_SelectionQCMQuestion =
	void 0;
const DonneesListe_SelectionQCM_1 = require("DonneesListe_SelectionQCM");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const ObjetRequeteQCMQuestions_1 = require("ObjetRequeteQCMQuestions");
const ObjetSaisieQCM_1 = require("ObjetSaisieQCM");
const ObjetListeElements_1 = require("ObjetListeElements");
const Toast_1 = require("Toast");
var TypeBibliothequeQCM;
(function (TypeBibliothequeQCM) {
	TypeBibliothequeQCM["Etablissement"] = "Etablissement";
	TypeBibliothequeQCM["Editeur"] = "Editeur";
	TypeBibliothequeQCM["Collaboratif"] = "Collaboratif";
	TypeBibliothequeQCM["Personnel"] = "Personnel";
})(
	TypeBibliothequeQCM ||
		(exports.TypeBibliothequeQCM = TypeBibliothequeQCM = {}),
);
const TypeBibliothequeQCMUtil = {
	getLibelle(aType) {
		switch (aType) {
			case TypeBibliothequeQCM.Etablissement:
				return ObjetTraduction_1.GTraductions.getValeur(
					"SaisieQCM.ListeDesQCMEtablissement",
				);
			case TypeBibliothequeQCM.Editeur:
				return ObjetTraduction_1.GTraductions.getValeur(
					"SaisieQCM.ListeDesQCMEditeur",
				);
			case TypeBibliothequeQCM.Collaboratif:
				return ObjetTraduction_1.GTraductions.getValeur(
					"SaisieQCM.ListeDesQCMCollaboratif",
				);
			case TypeBibliothequeQCM.Personnel:
				return ObjetTraduction_1.GTraductions.getValeur(
					"SaisieQCM.ListeDesQCMPersonnel",
				);
		}
		return "";
	},
};
class ObjetFenetre_SelectionQCMQuestion extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.AjouterDesQuestions",
			),
			largeur: 850,
			hauteur: 550,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Fermer"),
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("Ajouter"),
					theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
					valider: true,
					sansFermeture: true,
				},
			],
			addParametresValidation: () => {
				return { listeQuestions: this.questionsEnCopies };
			},
		});
		this.constructeurRequeteListeQCMCumuls = null;
		this.questionsEnCopies = new ObjetListeElements_1.ObjetListeElements();
	}
	setConstructeurRequeteListeQCMCumuls(aConstructeurRequete) {
		this.constructeurRequeteListeQCMCumuls = aConstructeurRequete;
	}
	construireInstances() {
		this.identListeQCM = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurListeQCM,
			this.initialiserListeQCM,
		);
		this.idSaisieQCM = this.add(
			ObjetSaisieQCM_1.ObjetSaisieQCM,
			this.evntSurSaisieQCM,
			this.initialiserSaisieQCM,
		);
	}
	setDonnees(aDonnees) {
		this.donnees = { avecNiveaux: true };
		$.extend(this.donnees, aDonnees);
		let lTitre = ObjetTraduction_1.GTraductions.getValeur(
			"SaisieQCM.AjouterDesQuestions",
		);
		let lStrSourceLiqteQCM = TypeBibliothequeQCMUtil.getLibelle(
			aDonnees.typeBibilioQCM,
		);
		if (lStrSourceLiqteQCM) {
			lTitre += " - " + lStrSourceLiqteQCM;
		}
		this.setOptionsFenetre({ titre: lTitre });
		const lParamsRequete = {
			qcmPerso: false,
			qcmNathan: false,
			qcmCollab: false,
			qcmEtab: false,
		};
		switch (aDonnees.typeBibilioQCM) {
			case TypeBibliothequeQCM.Personnel:
				lParamsRequete.qcmPerso = true;
				break;
			case TypeBibliothequeQCM.Editeur:
				lParamsRequete.qcmNathan = true;
				break;
			case TypeBibliothequeQCM.Collaboratif:
				lParamsRequete.qcmCollab = true;
				break;
			case TypeBibliothequeQCM.Etablissement:
				lParamsRequete.qcmEtab = true;
				break;
			default:
				break;
		}
		new this.constructeurRequeteListeQCMCumuls(
			this,
			this.actionSurListeQCMCumuls,
		).lancerRequete(lParamsRequete);
	}
	actionSurListeQCMCumuls(aListeQCM, aMessage) {
		if (aMessage) {
			GApplication.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				message: aMessage,
				callback: () => {
					this.fermer();
				},
			});
		} else {
			this.listeQCM = aListeQCM;
			this.actualiser();
			this.afficher();
			this.setBoutonActif(1, false);
			this._actualiserListe();
		}
	}
	initialiserSaisieQCM(aInstance) {
		aInstance.setOptions({ avecGestionBareme: false });
	}
	evntSurSaisieQCM(aParam) {
		switch (aParam.action) {
			case ObjetSaisieQCM_1.ObjetSaisieQCM.TypeCallback.Selection:
				this.questionsEnCopies.vider();
				if (!!aParam.listeQuestions && aParam.listeQuestions.count() > 0) {
					this.questionsEnCopies.add(aParam.listeQuestions);
				}
				this.setBoutonActif(1, this.questionsEnCopies.count() > 0);
				break;
			default:
				break;
		}
	}
	setGenreRessources(aParam) {
		this.ress = aParam;
	}
	composeContenu() {
		const T = [];
		T.push('<div class="flex-contain" style="height: 100%">');
		T.push(
			'<div id="',
			this.getNomInstance(this.identListeQCM),
			'" style="width: 280px; height:100%;" class="m-right"></div>',
		);
		T.push(
			'<div class="fluid-bloc flex-contain cols" style="height: 100%;">',
			'<div class="full-height" id="',
			this.getNomInstance(this.idSaisieQCM),
			'"></div>',
			"</div>",
		);
		T.push("</div>");
		return T.join("");
	}
	evenementSurListeQCM(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.element = aParametres.article;
				new ObjetRequeteQCMQuestions_1.ObjetRequeteQCMQuestions(
					this,
					this.actionSurQCMQuestions,
				).lancerRequete({
					element: aParametres.article,
					pourSelectionQuestions: true,
				});
				break;
		}
	}
	initialiserListeQCM(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			labelWAI: ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.ListeDesQCM",
			),
		});
	}
	reloadQCM() {
		if (
			this.compteurEchec < 30 &&
			this.numeroElementEnEchec === this.element.getNumero()
		) {
			new ObjetRequeteQCMQuestions_1.ObjetRequeteQCMQuestions(
				this,
				this.actionSurQCMQuestions,
			).lancerRequete({ element: this.element, pourSelectionQuestions: true });
		} else {
			this.compteurEchec = 0;
			this.numeroElementEnEchec = null;
		}
	}
	actionSurQCMQuestions(aParam) {
		if (aParam.message) {
			this.numeroElementEnEchec = this.element.getNumero();
			this.compteurEchec++;
			clearTimeout(this.timerQCM);
			this.timerQCM = setTimeout(this.reloadQCM.bind(this), 2000);
			return;
		}
		this.compteurEchec = 0;
		this.numeroElementEnEchec = null;
		let lElementContenuQCM = null;
		if (this.element.pere && this.element.pere.existeNumero()) {
			lElementContenuQCM = this.listeQCM.getElementParNumero(
				this.element.pere.getNumero(),
			);
		} else {
			lElementContenuQCM = this.element;
		}
		const lCtx = { verrouUniquement: false, QCM: null };
		const lUniquementVerrou =
			lCtx.verrouUniquement !== null &&
			lCtx.verrouUniquement !== undefined &&
			lCtx.verrouUniquement === true;
		lElementContenuQCM.contenuQCM = lUniquementVerrou ? lCtx.QCM : aParam.QCM;
		this.qcm = lElementContenuQCM.contenuQCM;
		if (lElementContenuQCM.matiere) {
			this.qcm.matiere = lElementContenuQCM.matiere;
		}
		if (lElementContenuQCM.niveau) {
			this.qcm.niveau = lElementContenuQCM.niveau;
		}
		this.actualiserListeQuestions();
	}
	actualiserListeQuestions() {
		if (this.qcm.listeQuestions.count()) {
			const lNoteRef = this.qcm.listeQuestions.get(0).note;
			this.element.avecQuestionsSoumises =
				this.qcm.listeQuestions
					.getListeElements((aEle) => {
						return aEle.existe() && aEle.note === lNoteRef;
					})
					.count() === this.qcm.listeQuestions.getNbrElementsExistes();
		}
		this.majNbPoint(this.element);
		this.getInstance(this.idSaisieQCM).setDonnees({
			contenuQCM: this.qcm,
			avecEdition: false,
			nombreQuestionsSoumises: this.element.nombreQuestionsSoumises,
		});
	}
	majNbPoint(aQCM) {
		if (aQCM.contenuQCM && aQCM.contenuQCM.listeQuestions) {
			if (aQCM.nombreQuestionsSoumises) {
				aQCM.nombreDePoints =
					aQCM.nombreQuestionsSoumises *
					aQCM.contenuQCM.listeQuestions.get(0).note;
			} else {
				let lNbPoint = 0;
				for (
					let i = 0;
					i < aQCM.contenuQCM.listeQuestions.getNbrElementsExistes();
					i++
				) {
					lNbPoint += aQCM.contenuQCM.listeQuestions.get(i).note;
				}
				aQCM.nombreDePoints = lNbPoint;
			}
			aQCM.nbQuestionsTotal =
				aQCM.contenuQCM.listeQuestions.getNbrElementsExistes();
		}
	}
	_actualiserListe() {
		this.getInstance(this.identListeQCM).setDonnees(
			new DonneesListe_SelectionQCM_1.DonneesListe_SelectionQCM(
				this.listeQCM,
				null,
				{
					formatBiblio: false,
					multiSelection: this.donnees.multiSelection,
					genreQCM: this.ress.genreQCM,
					estFDMinimal: true,
				},
			),
		);
	}
	afficherMessageToastSuccesAjout(aNbQuestionsAjoutees) {
		let lMsgSuccesAjout;
		if (aNbQuestionsAjoutees > 1) {
			lMsgSuccesAjout = ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.MsgSuccesAjoutXQuestions",
				[aNbQuestionsAjoutees],
			);
		} else {
			lMsgSuccesAjout = ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.MsgSuccesAjoutUneQuestion",
			);
		}
		Toast_1.Toast.afficher({
			msg: lMsgSuccesAjout,
			type: Toast_1.ETypeToast.succes,
		});
	}
}
exports.ObjetFenetre_SelectionQCMQuestion = ObjetFenetre_SelectionQCMQuestion;
