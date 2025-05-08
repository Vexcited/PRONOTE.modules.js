const { GUID } = require("GUID.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GChaine } = require("ObjetChaine.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { GDate } = require("ObjetDate.js");
const {
	ObjetFenetre_CalendrierAnnuel,
} = require("ObjetFenetre_CalendrierAnnuel.js");
const { ObjetInterface } = require("ObjetInterface.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
const { GTraductions } = require("ObjetTraduction.js");
const { UtilitaireStage } = require("UtilitaireStage.js");
class ObjetEditionOffreStage extends ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.idSujetDetaille = GUID.getId();
		this.idNbPostes = GUID.getId();
		this.idDuree = GUID.getId();
		this.idComment = GUID.getId();
		this.idSujet = GUID.getId();
		this._parametres = {
			avecPeriode: false,
			avecPeriodeUnique: true,
			avecSujetObjetSaisie: true,
			avecGestionPJ: false,
			tailleMaxPieceJointe: 0,
			avecEditionDocumentsJoints: false,
			genreRessourcePJ: 0,
			maxWidth: 0,
			dureeParDefaut: 70,
		};
	}
	setParametres(aParam) {
		$.extend(this._parametres, aParam);
	}
	construireInstances() {
		if (this._parametres.avecSujetObjetSaisie) {
			this.identComboSujet = this.add(
				ObjetSaisie,
				_evntComboSujet.bind(this),
				_initComboSujet.bind(this),
			);
		}
		if (this._parametres.avecPeriode && this.classSelecteurPJ) {
			this.identPJ = this.add(
				this.classSelecteurPJ,
				_evntPJ.bind(this),
				_initPJ.bind(this),
			);
		}
		if (this._parametres.avecPeriode) {
			this.idFenetreCal = this.add(
				ObjetFenetre_CalendrierAnnuel,
				_evntFenetreCalendrier.bind(this),
				_initFenetreCalendrier,
			);
		}
	}
	setParametresGeneraux() {
		this.GenreStructure = EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const H = [];
		const lStyleBordure = GStyle.composeCouleurBordure(
			GCouleur.themeNeutre.claire,
		);
		const lStyleTexte = GStyle.composeCouleurTexte(GCouleur.texte);
		H.push(this.construireSujet());
		H.push(this.construirePeriode());
		H.push(
			"<label>",
			GTraductions.getValeur("OffreStage.SujetDetaille"),
			"</label>",
		);
		H.push(
			'<textarea ie-model="sujetDetaille" id="',
			this.idSujetDetaille,
			'" class="round-style" style=" height:150px"></textarea>',
		);
		H.push(
			"<label>",
			GTraductions.getValeur("OffreStage.PostesAPourvoir"),
			"</label>",
		);
		H.push(
			'<input ie-model="nbPostes" ie-mask="/[^0-9]/i" id="',
			this.idNbPostes,
			'" size="3" maxlength="3" type="text" class="round-style" />',
		);
		H.push(
			"<label>",
			GTraductions.getValeur("OffreStage.DureePrevueEnSemaine"),
			"</label>",
		);
		H.push(
			'<input ie-model="duree" ie-mask="/[^0-9]/i" id="',
			this.idDuree,
			'" size="2" maxlength="2" type="text" class="round-style" />',
		);
		H.push(this.construirePJ(lStyleBordure, lStyleTexte));
		H.push(
			"<label>",
			GTraductions.getValeur("OffreStage.Commentaire"),
			"</label>",
		);
		H.push(
			'<textarea class="round-style" ie-model="commentaire" id="',
			this.idComment,
			'" style="height:100px;"></textarea>',
		);
		return H.join("");
	}
	construireSujet() {
		const H = [];
		H.push("<label>", GTraductions.getValeur("OffreStage.Sujet"), "</label>");
		if (this._parametres.avecSujetObjetSaisie) {
			H.push(
				'<div id="' +
					this.getInstance(this.identComboSujet).getNom() +
					'"></div>',
			);
		} else {
			H.push(
				'<input ie-model="sujet" id="',
				this.idSujet,
				'" type="text" class="round-style full-width" />',
			);
		}
		return H.join("");
	}
	construirePeriode() {
		const H = [];
		if (this._parametres.avecPeriode) {
			H.push(
				"<label>",
				GTraductions.getValeur("OffreStage.periodePossibleDeStage"),
				"</label>",
			);
			H.push(
				'<div ie-ellipsis ie-texte="getPeriode" ie-event="keyup-click->eventPeriode" class="periode like-input" style="',
				this._parametres.maxWidth > 0
					? "max-width: " + this._parametres.maxWidth + "px; "
					: "",
				'"></div>',
			);
		}
		return H.join("");
	}
	construirePJ() {
		const H = [];
		if (this._parametres.avecGestionPJ) {
			H.push(
				"<label>",
				GTraductions.getValeur("OffreStage.PiecesJointes"),
				"</label>",
			);
			H.push(
				'<div class="Espace" id="',
				this.getInstance(this.identPJ).getNom(),
				'"></div>',
			);
		}
		return H.join("");
	}
	getElmtOffreDefault() {
		const lDefault = new ObjetElement(),
			lPeriodeDefault = new ObjetElement("");
		const lPiecesJointes = new ObjetListeElements();
		lPeriodeDefault.dateDebut = new Date(0);
		lPeriodeDefault.dateFin = new Date(0);
		lPeriodeDefault.nonInitialise = true;
		$.extend(lDefault, {
			sujet: null,
			periode: lPeriodeDefault,
			sujetDetaille: "",
			commentaire: "",
			duree: "",
			dureeEnJours: this._parametres.dureeParDefaut,
			nbPropose: 1,
			piecesjointes: lPiecesJointes,
		});
		if (this._parametres.avecPeriodeUnique) {
			lDefault.periode = lPeriodeDefault;
		} else {
			lDefault.periodes = new ObjetListeElements();
			lDefault.periodes.addElement(lPeriodeDefault);
		}
		return lDefault;
	}
	setDonnees(aParam) {
		const lParam = {
			offreStage: this.getElmtOffreDefault(),
			sujetsStage: new ObjetListeElements(),
			listePJ: new ObjetListeElements(),
		};
		$.extend(true, lParam, aParam);
		this.offreStage = lParam.offreStage;
		this.sujetsStage = lParam.sujetsStage;
		this.listePJ = lParam.listePJ;
		this.actualiser();
	}
	getOffreStage() {
		return this.offreStage;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			sujet: {
				getValue: function () {
					return aInstance && aInstance.offreStage && aInstance.offreStage.sujet
						? aInstance.offreStage.sujet.getLibelle()
						: "";
				},
				setValue: function (aValue) {
					if (aInstance.offreStage) {
						if (!aInstance.offreStage.sujet) {
							aInstance.offreStage.sujet = new ObjetElement("");
						}
						aInstance.offreStage.sujet.setLibelle(aValue);
						aInstance.offreStage.sujet.setEtat(EGenreEtat.Modification);
						aInstance.offreStage.setEtat(EGenreEtat.Modification);
					}
				},
			},
			getPeriode: function () {
				let lResult = "";
				if (aInstance) {
					if (aInstance._parametres.avecPeriodeUnique) {
						if (aInstance.offreStage && aInstance.offreStage.periode) {
							lResult = UtilitaireStage.composeLibelleDatePeriode(
								aInstance.offreStage.periode,
							);
						}
					} else {
						if (aInstance.offreStage && aInstance.offreStage.periodes) {
							lResult = UtilitaireStage.composeLibelleDatePeriodes(
								aInstance.offreStage.periodes,
							);
						}
					}
					if (!lResult) {
						lResult = GTraductions.getValeur("OffreStage.aucunePeriodeImposee");
					}
				}
				return lResult;
			},
			eventPeriode: function () {
				if (aInstance && aInstance.offreStage) {
					aInstance.eventOuvertureCalendrier();
				}
			},
			sujetDetaille: {
				getValue: function () {
					return aInstance &&
						aInstance.offreStage &&
						aInstance.offreStage.sujetDetaille
						? aInstance.offreStage.sujetDetaille
						: "";
				},
				setValue: function (aValue) {
					if (aInstance.offreStage) {
						aInstance.offreStage.sujetDetaille = aValue;
						aInstance.offreStage.setEtat(EGenreEtat.Modification);
					}
				},
			},
			nbPostes: {
				getValue: function () {
					return aInstance &&
						aInstance.offreStage &&
						aInstance.offreStage.nbPropose
						? aInstance.offreStage.nbPropose
						: "";
				},
				setValue: function (aValue) {
					if (aInstance.offreStage) {
						aInstance.offreStage.nbPropose = GChaine.strToCardinal(aValue);
						aInstance.offreStage.setEtat(EGenreEtat.Modification);
					}
				},
				exitChange: function (aValue) {
					if (aInstance.offreStage) {
						const lValue = !!aValue ? GChaine.strToCardinal(aValue) : 1;
						aInstance.offreStage.nbPropose = lValue;
						aInstance.offreStage.setEtat(EGenreEtat.Modification);
					}
				},
			},
			duree: {
				getValue: function () {
					return aInstance &&
						aInstance.offreStage &&
						aInstance.offreStage.dureeEnJours
						? parseInt(aInstance.offreStage.dureeEnJours / 7, 10)
						: 0;
				},
				setValue: function (aValue) {
					if (aInstance.offreStage) {
						aInstance.offreStage.dureeEnJours = aValue * 7;
						aInstance.offreStage.setEtat(EGenreEtat.Modification);
					}
				},
			},
			commentaire: {
				getValue: function () {
					return aInstance &&
						aInstance.offreStage &&
						aInstance.offreStage.commentaire
						? aInstance.offreStage.commentaire
						: "";
				},
				setValue: function (aValue) {
					if (aInstance.offreStage) {
						aInstance.offreStage.commentaire = aValue;
						aInstance.offreStage.setEtat(EGenreEtat.Modification);
					}
				},
			},
		});
	}
	actualiser() {
		if (this._parametres.avecSujetObjetSaisie) {
			this.getInstance(this.identComboSujet).setDonnees(
				this.sujetsStage,
				this.offreStage.sujet !== null
					? this.sujetsStage.getIndiceParElement(this.offreStage.sujet)
					: 0,
			);
		}
		if (this._parametres.avecGestionPJ) {
			this.getInstance(this.identPJ).setDonnees({
				listePJ: this.offreStage.piecesjointes,
				listeTotale: this.listePJ,
				idContextFocus: this.Nom,
			});
		}
		this.$refreshSelf();
	}
	eventOuvertureCalendrier() {
		if (this._parametres.avecPeriode) {
			this.listePeriode = new ObjetListeElements();
			if (this._parametres.avecPeriodeUnique) {
				this.listePeriode.addElement(this.offreStage.periode);
			} else if (this.offreStage.periodes) {
				this.listePeriode = MethodesObjet.dupliquer(this.offreStage.periodes);
			}
			const lParam = {
				premiereDate: GDate.premiereDate,
				derniereDate: GDate.derniereDate,
				ligneDate: false,
				numeroJour: true,
				initialeJour: true,
				hauteurLigne: "35px",
				cadreTotal: true,
				joursOuvres: { editable: true, editablePeriode: true },
				joursFeries: { editable: true, editablePeriode: true },
			};
			this.getInstance(this.idFenetreCal).setParametres(lParam);
			this.getInstance(this.idFenetreCal).setDonnees({
				offreStage: {
					donnees: this.listePeriode,
					variables: ["dateDebut", "dateFin"],
					couleur: GCouleur.rouge,
					texte: { couleur: GCouleur.blanc },
					symbolImpression: "X",
					editable: true,
					editablePeriode: true,
					periodeUnique: this._parametres.avecPeriodeUnique,
				},
			});
			this.getInstance(this.idFenetreCal).afficher();
		}
	}
}
function _evntComboSujet(aParams) {
	if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
		this.offreStage.sujet = aParams.element;
	}
}
function _evntPJ() {}
function _evntFenetreCalendrier(aNumeroBouton, aEstModif) {
	const lLibelle = [];
	if (aEstModif) {
		if (this._parametres.avecPeriodeUnique) {
			this.offreStage.periode = this.listePeriode
				.getListeElements((aEle) => {
					return aEle.existe();
				})
				.get(0);
			lLibelle.push(
				UtilitaireStage.composeLibelleDatePeriode(this.offreStage.periode),
			);
			this.offreStage.periode.setLibelle(lLibelle.join(" - "));
		} else {
			this.offreStage.periodes = this.listePeriode.getListeElements((aEle) => {
				return aEle.existe();
			});
		}
	}
}
function _initComboSujet(aInstance) {
	aInstance.setOptionsObjetSaisie({ longueur: 300 });
}
function _initPJ(aInstance) {
	aInstance.setOptions({
		genrePJ: EGenreDocumentJoint.Fichier,
		genreRessourcePJ: this._parametres.genreRessourcePJ,
		maxFiles: 0,
		maxSize: this._parametres.tailleMaxPieceJointe,
		avecAjoutExistante: true,
		avecEtatSaisie: false,
	});
	aInstance.setActif(this._parametres.avecEditionDocumentsJoints);
}
function _initFenetreCalendrier(aInstance) {
	aInstance.setOptionsFenetre({
		titre: GTraductions.getValeur("OffreStage.periodePossibleDeStage"),
		largeur: 650,
		hauteur: null,
		listeBoutons: [
			GTraductions.getValeur("Annuler"),
			GTraductions.getValeur("Valider"),
		],
	});
}
module.exports = { ObjetEditionOffreStage };
