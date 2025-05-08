const { MethodesObjet } = require("MethodesObjet.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const { ObjetCelluleBouton } = require("ObjetCelluleBouton.js");
const { EGenreBoutonCellule } = require("ObjetCelluleBouton.js");
const { EEvent } = require("Enumere_Event.js");
const {
	DonneesListe_SelectionDemandeur,
} = require("DonneesListe_SelectionDemandeur.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const { DonneesListe_Simple } = require("DonneesListe_Simple.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { UtilitaireHtml } = require("UtilitaireHtml.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { TypeFichierExterneHttpSco } = require("TypeFichierExterneHttpSco.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const { GHtml } = require("ObjetHtml.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const { EGenreEspace } = require("Enumere_Espace.js");
class ObjetFenetre_Correspondance extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.idGroupeEnvoiReception = this.Nom + "_groupeEnvoiReception";
		this.idListeDocuments = this.Nom + "_documentsjoints";
		this.idLabelAuteur = this.Nom + "_labelAuteur";
		this.avecDocuments = [
			EGenreEspace.Professeur,
			EGenreEspace.Mobile_Professeur,
		].includes(GEtatUtilisateur.GenreEspace);
	}
	construireInstances() {
		this.identDate = this.add(
			ObjetCelluleDate,
			evenementSelecteurDate.bind(this),
			_initialiserSelecteurDate,
		);
		this.identType = this.add(
			ObjetSaisiePN,
			this.evenementComboType,
			_initialiserComboType,
		);
		this.identAuteur = this.add(
			ObjetCelluleBouton,
			_evntAuteur.bind(this),
			_initAuteur,
		);
		this.identFenetreAuteur = this.addFenetre(
			ObjetFenetre_Liste,
			_evntFenetreAuteur.bind(this),
			_initFenetreAuteur.bind(this),
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnChoixInterlocuteur: {
				event() {
					_evenementBtnSelectionInterlocuteur.call(aInstance);
				},
				getTitle() {
					return GTraductions.getValeur(
						"FenetreCorrespondance.SelectionnerInterlocuteur",
					);
				},
				getDisabled() {
					return (
						!aInstance.donneesSaisie ||
						!aInstance.donneesSaisie.listeInterlocuteurs ||
						aInstance.donneesSaisie.listeInterlocuteurs.count() <= 1
					);
				},
			},
			Interlocuteur: {
				getValue() {
					return !!aInstance.correspondance
						? aInstance.correspondance.interlocuteur || ""
						: "";
				},
				setValue(aValue) {
					if (!!aInstance.correspondance) {
						aInstance.correspondance.interlocuteur = aValue;
					}
				},
			},
			Commentaire: {
				getValue() {
					return !!aInstance.correspondance
						? aInstance.correspondance.commentaire || ""
						: "";
				},
				setValue(aValue) {
					if (!!aInstance.correspondance) {
						aInstance.correspondance.commentaire = aValue;
					}
				},
			},
			avecDocuments: function () {
				return aInstance.avecDocuments;
			},
			btnUpload: {
				getOptionsSelecFile: function () {
					return {
						genrePJ: EGenreDocumentJoint.Fichier,
						genreRessourcePJ: EGenreRessource.DocJointEleve,
						interdireDoublonsLibelle: false,
						maxFiles: 0,
						maxSize: GApplication.droits.get(
							TypeDroits.tailleMaxDocJointEtablissement,
						),
					};
				},
				addFiles: function (aElt) {
					aInstance.listePJEleve.addElement(aElt.eltFichier);
					aInstance.correspondance.listePJ.addElement(aElt.eltFichier);
					aInstance.redessinerDocumentsFournis(
						aInstance.correspondance.listePJ,
					);
				},
				getDisabled: function () {
					return false;
				},
				getLibelle() {
					return GTraductions.getValeur("AjouterDesPiecesJointes");
				},
				getIcone() {
					return '<i class="icon_piece_jointe"></i>';
				},
			},
			chipsDocJoint: {
				eventBtn: function (aIndice) {
					let lElement = aInstance.correspondance.listePJ
						? aInstance.correspondance.listePJ.get(aIndice)
						: null;
					if (lElement) {
						const message =
							"<div ie-ellipsis-fixe>" +
							GTraductions.getValeur("selecteurPJ.msgConfirmPJ", [
								lElement.getLibelle(),
							]) +
							"</div>";
						GApplication.getMessage().afficher({
							type: EGenreBoiteMessage.Confirmation,
							message: message,
							callback: (aAccepte) => {
								if (aAccepte === EGenreAction.Valider) {
									lElement.setEtat(EGenreEtat.Suppression);
									aInstance.redessinerDocumentsFournis(
										aInstance.correspondance.listePJ,
									);
								}
							},
						});
					}
				},
			},
		});
	}
	redessinerDocumentsFournis(aListe) {
		let lHTML = "";
		if (aListe && aListe.count()) {
			lHTML = UtilitaireUrl.construireListeUrls(aListe, {
				separateur: " ",
				IEModelChips: "chipsDocJoint",
				genreRessource: TypeFichierExterneHttpSco.DocJointEleve,
				argsIEModelChips: [],
				maxWidth: 300,
			});
		}
		GHtml.setHtml(this.idListeDocuments, lHTML, {
			controleur: this.controleur,
		});
	}
	resetDonneesAffichage() {
		this.getInstance(this.identType).reset();
	}
	setDonnees(aCorrespondance, aDonneesSaisieCorrespondance, aListePJEleve) {
		this.resetDonneesAffichage();
		this.donneesSaisie = aDonneesSaisieCorrespondance;
		this.correspondance = $.extend(true, {}, aCorrespondance);
		this.correspondance.listePJ = MethodesObjet.dupliquer(
			aCorrespondance.listePJ,
		);
		this.listePJEleve = MethodesObjet.dupliquer(aListePJEleve);
		$("#" + this.idGroupeEnvoiReception.escapeJQ() + " > input")
			.off("change")
			.on("change", _evenementRadioDemiJournee.bind(this, true));
		if (aDonneesSaisieCorrespondance) {
			this.getInstance(this.identType).setDonnees(
				aDonneesSaisieCorrespondance.listeTypes,
			);
			let lLibelle = "";
			if (
				this.correspondance.element &&
				this.correspondance.element.respAdmin &&
				this.correspondance.element.respAdmin.getGenre() !==
					EGenreRessource.Aucune
			) {
				lLibelle = this.correspondance.element.respAdmin.getLibelle();
			}
			this.getInstance(this.identAuteur).setLibelle(lLibelle);
			this.getInstance(this.identAuteur).setActif(true);
		}
		if (aCorrespondance.getEtat() === 1) {
			this.correspondance.date = GDate.getDateCourante();
			this.getInstance(this.identType).setSelectionParIndice(0);
			this.getInstance(this.identDate).setDonnees(this.correspondance.date);
		} else {
			this.getInstance(this.identDate).setDonnees(this.correspondance.date);
		}
		let lIndiceType;
		if (this.correspondance.type && this.correspondance.type.getGenre() > 0) {
			lIndiceType =
				aDonneesSaisieCorrespondance.listeTypes.getIndiceParNumeroEtGenre(
					null,
					this.correspondance.type.Genre,
				);
		} else {
			lIndiceType = aDonneesSaisieCorrespondance.listeTypes.getIndiceParLibelle(
				this.correspondance.Libelle,
			);
		}
		this.getInstance(this.identType).setSelectionParIndice(
			lIndiceType ? lIndiceType : 0,
		);
		$("#" + this.idGroupeEnvoiReception.escapeJQ())
			.find("input")
			.removeAttr("checked");
		$("#" + this.idGroupeEnvoiReception.escapeJQ())
			.find("input")
			.removeAttr("checked");
		if (!this.correspondance.listePJ) {
			this.correspondance.listePJ = new ObjetListeElements();
		}
		this.redessinerDocumentsFournis(this.correspondance.listePJ);
		let lTypeCorrespondance;
		if (!!this.correspondance) {
			lTypeCorrespondance = !!this.correspondance.avecReponseCourrier;
		}
		$("#" + this.idGroupeEnvoiReception.escapeJQ())
			.find('input[value="' + lTypeCorrespondance + '"]')
			.attr("checked", "checked");
		this.afficher();
	}
	evenementComboType(aParams) {
		if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
			this.correspondance.Libelle = aParams.element.getLibelle();
			this.correspondance.type = MethodesObjet.dupliquer(aParams.element);
		}
	}
	composeContenu() {
		const lHtml = [];
		lHtml.push('<div class="FenetreCorrespondance">');
		lHtml.push('<div class="LigneFormulaire">');
		const lRadios = [
			{
				libelle: GTraductions.getValeur("FenetreCorrespondance.Envoi"),
				value: false,
			},
			{
				libelle: GTraductions.getValeur("FenetreCorrespondance.Reponse"),
				value: true,
			},
		];
		lHtml.push(
			UtilitaireHtml.composeGroupeRadiosBoutons({
				id: this.idGroupeEnvoiReception,
				listeRadios: lRadios,
			}),
		);
		lHtml.push("</div>");
		lHtml.push(
			'<div class="LigneFormulaire">',
			'<label class="ZoneLibelleChamp">',
			GTraductions.getValeur("FenetreCorrespondance.TypeContact"),
			"</label>",
			'<div class="ZoneChamp">',
			'<div id="',
			this.getInstance(this.identType).getNom(),
			'"></div>',
			"</div>",
			"</div>",
		);
		lHtml.push(
			'<div class="LigneFormulaire">',
			'<label class="ZoneLibelleChamp">',
			GTraductions.getValeur("FenetreCorrespondance.Date"),
			"</label>",
			'<div class="ZoneChamp">',
			'<div id="',
			this.getInstance(this.identDate).getNom(),
			'" style="width:100%;"></div>',
			"</div>",
			"</div>",
		);
		lHtml.push(
			'<div class="LigneFormulaire">',
			'<label id="',
			this.idLabelAuteur,
			'" class="ZoneLibelleChamp">',
			GTraductions.getValeur("FenetreCorrespondance.Auteur"),
			"</label>",
			'<div class="ZoneChamp">',
			'<div id="',
			this.getInstance(this.identAuteur).getNom(),
			'"></div>',
			"</div>",
			"</div>",
		);
		lHtml.push(
			'<div class="LigneFormulaire">',
			'<label for="inputInterlocuteur" class="ZoneLibelleChamp">',
			GTraductions.getValeur("FenetreCorrespondance.Interlocuteur"),
			"</label>",
			'<div class="ZoneChamp">',
			'<input id="inputInterlocuteur" type="text" class="style-input" ie-model="Interlocuteur" />',
			'<div id="btnSelectInterlocuteurWrapper">',
			'<ie-btnicon ie-model="btnChoixInterlocuteur" class="bt-activable icon_plus_cercle"></ie-btnicon>',
			"</div>",
			"</div>",
			"</div>",
		);
		lHtml.push(
			'<label id="ZoneCommentaire" for="textareaCommentaire">',
			GTraductions.getValeur("FenetreCorrespondance.SaisirCommentaires"),
			"</label>",
			"<div>",
			'<textarea class="round-style" ie-model="Commentaire" id="textareaCommentaire"></textarea>',
			"</div>",
		);
		lHtml.push(
			'<div class="pj-global-conteneur m-y-l" ie-if="avecDocuments">',
			'<ie-btnselecteur ie-model="btnUpload" ie-selecfile class="pj" role="button"></ie-btnselecteur>',
			'<div class="pj-liste-conteneur" id="',
			this.idListeDocuments,
			'"></div>',
			"</div>",
		);
		lHtml.push("</div>");
		return lHtml.join("");
	}
	surValidation(aNumeroBouton) {
		this.callback.appel(aNumeroBouton, this.correspondance, this.listePJEleve);
		this.fermer();
	}
}
function _evenementRadioDemiJournee(aTypeCommunication) {
	if (!!this.correspondance) {
		this.correspondance.avecReponseCourrier = aTypeCommunication === true;
	}
}
function _initAuteur(aInstance) {
	aInstance.setOptionsObjetCelluleBouton({
		describedById: this.idLabelAuteur,
		estSaisissable: false,
		avecZoneSaisie: false,
		genreBouton: EGenreBoutonCellule.Aucun,
		classTexte: "Gras",
		largeur: "100%",
		hauteur: 17,
	});
}
function _initFenetreAuteur(aInstance) {
	const lParamsListe = { tailles: ["100%"], editable: false };
	const lInstance = this;
	aInstance.verifierActivationBtnValider = function (aBouton) {
		let lBoutonActif = false;
		if (aBouton.element.index === 0) {
			return true;
		}
		lInstance.donneesSaisie.listePublic.parcourir((aElement) => {
			if (aElement.selectionne) {
				lBoutonActif = true;
			}
		});
		return lBoutonActif;
	};
	aInstance.setOptionsFenetre({
		titre: GTraductions.getValeur("FenetreCorrespondance.Auteur"),
		largeur: 400,
		hauteur: 700,
		listeBoutons: [
			GTraductions.getValeur("Annuler"),
			GTraductions.getValeur("Valider"),
		],
		modeActivationBtnValider: aInstance.modeActivationBtnValider.autre,
	});
	aInstance.paramsListe = lParamsListe;
}
function _evntAuteur(aGenreEvent) {
	if (
		(aGenreEvent === EEvent.SurKeyUp && GNavigateur.isToucheSelection()) ||
		aGenreEvent === EEvent.SurMouseDown
	) {
		const lAuteur = this.correspondance.element.respAdmin;
		let lIndice = -1;
		if (lAuteur) {
			lIndice = this.donneesSaisie.listePublic.getIndiceElementParFiltre(
				(aElement) => {
					return (
						(aElement.getNumero() === lAuteur.getNumero() &&
							aElement.getGenre() === lAuteur.getGenre()) ||
						(lAuteur.getGenre() === EGenreRessource.Aucune &&
							aElement.getGenre() === lAuteur.getGenre())
					);
				},
			);
		}
		_resetPublic.call(this, lIndice);
		this.estSelectionSurveillant = true;
		this.getInstance(this.identFenetreAuteur).setDonnees(
			new DonneesListe_SelectionDemandeur(this.donneesSaisie.listePublic),
			false,
			lIndice,
		);
	}
}
function _evntFenetreAuteur(aGenreBouton, aSelection) {
	if (aGenreBouton === 1 && this.correspondance) {
		const lElm = this.donneesSaisie.listePublic.get(aSelection);
		this.correspondance.element.respAdmin = lElm;
		this.correspondance.element.respAdmin.setEtat(EGenreEtat.Modification);
		let lLibelle = "";
		if (this.correspondance.element && this.correspondance.element.respAdmin) {
			lLibelle = this.correspondance.element.respAdmin.getLibelle();
		}
		this.getInstance(this.identAuteur).setLibelle(lLibelle);
	}
}
function _resetPublic(aIndiceSelection) {
	const lIndice = aIndiceSelection;
	this.donneesSaisie.listePublic.parcourir((aPublic, aIndice) => {
		if (aPublic.estUnDeploiement) {
			aPublic.estDeploye = false;
		}
		if (aIndice === lIndice) {
			if (aPublic.pere) {
				aPublic.pere.estDeploye = true;
			}
		}
	});
}
function _initialiserSelecteurDate(aInstance) {
	aInstance.setOptionsObjetCelluleDate({ largeurComposant: "100%" });
}
function evenementSelecteurDate(aDate) {
	if (!GDate.estJourEgal(this.correspondance.date, aDate)) {
		this.correspondance.setEtat(EGenreEtat.Modification);
		this.correspondance.date = aDate;
	}
}
function _initialiserComboType(aInstance) {
	aInstance.setOptionsObjetSaisie({
		longueur: "100%",
		labelWAICellule: GTraductions.getValeur(
			"FenetreCorrespondance.TypeContact",
		),
	});
}
function _evenementBtnSelectionInterlocuteur() {
	const lListeInterlocuteurs = !!this.donneesSaisie
		? this.donneesSaisie.listeInterlocuteurs
		: null;
	if (!!lListeInterlocuteurs && !!this.correspondance) {
		const lThis = this;
		const lFenetreListeInterlocuteurs = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Liste,
			{
				pere: this,
				evenement: function (aNumeroBouton, aIndiceSelection) {
					if (aNumeroBouton !== -1) {
						const lInterlocuteurSelectionnee =
							lListeInterlocuteurs.get(aIndiceSelection);
						if (!!lInterlocuteurSelectionnee) {
							lThis.correspondance.interlocuteur =
								lInterlocuteurSelectionnee.getLibelle();
						}
					}
				},
				initialiser: function (aInstance) {
					const lParamsListe = {
						tailles: ["100%"],
						editable: false,
						optionsListe: {
							hauteurAdapteContenu: true,
							hauteurMaxAdapteContenu: 500,
						},
					};
					aInstance.setOptionsFenetre({
						titre: GTraductions.getValeur(
							"FenetreCorrespondance.SelectionnerInterlocuteur",
						),
						largeur: 300,
						hauteur: 400,
						listeBoutons: [
							GTraductions.getValeur("Annuler"),
							GTraductions.getValeur("Valider"),
						],
						avecTailleSelonContenu: true,
					});
					aInstance.paramsListe = lParamsListe;
				},
			},
		);
		lFenetreListeInterlocuteurs.setDonnees(
			new DonneesListe_Simple(lListeInterlocuteurs),
			true,
		);
	}
}
module.exports = { ObjetFenetre_Correspondance };
