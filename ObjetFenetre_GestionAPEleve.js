const { ObjetFenetre } = require("ObjetFenetre.js");
const { TypeDomaine } = require("TypeDomaine.js");
const { tag } = require("tag.js");
const { ObjetListe } = require("ObjetListe.js");
const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetCalendrier } = require("ObjetCalendrier.js");
const { ObjetTri } = require("ObjetTri.js");
const { UtilitaireInitCalendrier } = require("UtilitaireInitCalendrier.js");
const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { GChaine } = require("ObjetChaine.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { GDate } = require("ObjetDate.js");
const { EGenreAction } = require("Enumere_Action.js");
const { ControleSaisieEvenement } = require("ControleSaisieEvenement.js");
module.exports = {
	ouvrirFenetrePromise(aInstance, aEleve, aDate) {
		const lDomaine = new TypeDomaine().setValeur(
			true,
			IE.Cycles.cycleDeLaDate(aDate),
		);
		return new Promise((aResolve) => {
			ControleSaisieEvenement(() => {
				aResolve();
			});
		}).then(() => {
			return new ObjetRequeteSaisieGestionAPEleve(aInstance)
				.lancerRequete({ eleve: aEleve, domaine: lDomaine })
				.then((aParams) => {
					if (aParams.JSONReponse) {
						if (!aParams.JSONReponse.listeGroupes) {
							return GApplication.getMessage().afficher({
								message: aParams.JSONReponse.message || "",
							});
						}
						return ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_GestionAPEleve,
							{ pere: aInstance },
							{
								titre: GChaine.format("%s - %s", [
									aEleve.getLibelle(),
									GTraductions.getValeur(
										"ObjetFenetre_GestionAPEleve.GroupeGAEVEleve",
									),
								]),
							},
						).setDonneespromise({
							domaine: lDomaine,
							eleve: aEleve,
							groupes: aParams.JSONReponse,
						});
					}
				});
		});
	},
};
class ObjetFenetre_GestionAPEleve extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			largeur: 700,
			hauteur: 600,
			listeBoutons: [GTraductions.getValeur("Fermer")],
		});
		this._groupeSelection = null;
		Invocateur.abonner(
			ObjetInvocateur.events.modeExclusif,
			() => {
				this.fermer();
			},
			this,
		);
	}
	construireInstances() {
		this.identCalendrier = this.add(
			ObjetCalendrier,
			(ASelection, aDomaine) => {
				this.donnees.domaine = aDomaine;
				if (
					this.getInstance(this.identCalendrier).estUneInteractionUtilisateur()
				) {
					_requeteListeGroupes.call(this);
				}
			},
			(aCalendrier) => {
				UtilitaireInitCalendrier.init(aCalendrier, {
					avecMultiSemainesContinues: true,
				});
				aCalendrier.setFrequences(GParametres.frequences, true);
			},
		);
		this.identListeGroupe = this.add(
			ObjetListe,
			(aParametres) => {
				switch (aParametres.genreEvenement) {
					case EGenreEvenementListe.ModificationSelection: {
						this._groupeSelection = aParametres.instance.getElementSelection();
						_surSelectionGroupe.call(this);
						break;
					}
				}
			},
			(aListe) => {
				aListe.setOptionsListe({
					skin: ObjetListe.skin.flatDesign,
					boutons: [{ genre: ObjetListe.typeBouton.rechercher }],
				});
			},
		);
		this.identListeEleve = this.add(ObjetListe, null, (aListe) => {
			aListe.setOptionsListe({
				skin: ObjetListe.skin.flatDesign,
				boutons: [{ genre: ObjetListe.typeBouton.rechercher }],
			});
		});
	}
	setDonneespromise(aDonnees) {
		this.donnees = aDonnees;
		const lPromise = this.afficher();
		this.getInstance(this.identCalendrier).construireAffichage();
		this.getInstance(this.identCalendrier).setDomaine(
			this.donnees.domaine,
			true,
		);
		_actualiserListeGroupes.call(this);
		return lPromise.then(() => {
			return { avecSaisie: this.avecSaisie };
		});
	}
	composeContenu() {
		const T = [];
		T.push(
			tag(
				"div",
				{ class: "container" },
				tag("div", {
					id: this.getInstance(this.identCalendrier).Nom,
					class: "calendrier",
				}),
				tag("label", { class: "legende", "ie-html": "getHtmlLegende" }),
				tag(
					"div",
					{ class: "listes" },
					tag("div", {
						id: this.getInstance(this.identListeGroupe).Nom,
						class: "liste-groupe",
					}),
					tag(
						"div",
						{
							id: this.getInstance(this.identListeEleve).Nom,
							class: "liste-eleve",
						},
						_getMessageVide(),
					),
				),
			),
		);
		return T.join("");
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getHtmlLegende() {
				return aInstance.donnees && aInstance.donnees.groupes
					? aInstance.donnees.groupes.message || ""
					: "";
			},
		});
	}
}
function _requeteListeGroupes() {
	new ObjetRequeteSaisieGestionAPEleve(this)
		.lancerRequete({ eleve: this.donnees.eleve, domaine: this.donnees.domaine })
		.then((aParams) => {
			if (aParams.JSONReponse) {
				this.donnees.groupes = aParams.JSONReponse;
				_actualiserListeGroupes.call(this);
			}
		});
}
function _actualiserListeGroupes() {
	const lJSelecListe = $(`#${this.Nom.escapeJQ()} .container>.listes`);
	if (!this.donnees.groupes.listeGroupes) {
		this._groupeSelection = null;
		_surSelectionGroupe.call(this);
		lJSelecListe.hide();
	} else {
		lJSelecListe.show();
		this.getInstance(this.identListeGroupe).setDonnees(
			new DonneesListe_ListeGroupes(
				this.donnees.groupes.listeGroupes,
			).setOptions({
				callbackSaisie: (aGroupe, aAjout) => {
					_saisie.call(this, aGroupe, this.donnees.eleve, aAjout);
				},
			}),
		);
		if (
			!this._groupeSelection ||
			!this.donnees.groupes.listeGroupes.getElementParElement(
				this._groupeSelection,
			)
		) {
			this._groupeSelection = null;
			_surSelectionGroupe.call(this);
		} else {
			this.getInstance(this.identListeGroupe).setListeElementsSelection(
				new ObjetListeElements().add(this._groupeSelection),
				{ avecScroll: true },
			);
		}
	}
}
function _surSelectionGroupe() {
	const lListeEleves = this.getInstance(this.identListeEleve);
	if (!this._groupeSelection) {
		lListeEleves.setDonnees(
			new DonneesListe_ListeEleves(new ObjetListeElements()),
		);
		lListeEleves.afficher(_getMessageVide());
	} else {
		new ObjetRequeteSaisieGestionAPEleve(this)
			.lancerRequete({
				pourListeEleves: true,
				groupe: this._groupeSelection,
				eleve: this.donnees.eleve,
				domaine: this.donnees.domaine,
			})
			.then((aParams) => {
				lListeEleves.setDonnees(
					new DonneesListe_ListeEleves(
						aParams.JSONReponse.listeEleves,
					).setOptions({
						callbackSuppr: (aEleve) => {
							_saisie.call(this, this._groupeSelection, aEleve, false);
						},
					}),
				);
			});
	}
}
function _getMessageVide() {
	return tag(
		"div",
		{ class: "text-empty" },
		tag(
			"label",
			GTraductions.getValeur("ObjetFenetre_GestionAPEleve.SelectionnezGroupe"),
		),
	);
}
function _saisie(aGroupe, aEleve, aAjout) {
	return Promise.resolve()
		.then(() => {
			if (!aAjout) {
				return GApplication.getMessage()
					.afficher({
						type: EGenreBoiteMessage.Confirmation,
						message: GChaine.format(
							GTraductions.getValeur(
								"ObjetFenetre_GestionAPEleve.ConfirmezVous_Si",
							),
							[
								aEleve.getLibelle(),
								aGroupe.getLibelle(),
								GDate.formatDate(
									IE.Cycles.dateDebutCycle(
										this.donnees.domaine.getPremierePosition(),
									),
									"%JJ/%MM/%AAAA",
								),
								GDate.formatDate(
									IE.Cycles.dateFinCycle(
										this.donnees.domaine.getDernierePosition(),
									),
									"%JJ/%MM/%AAAA",
								),
							],
						),
					})
					.then((aGenreAction) => {
						if (aGenreAction !== EGenreAction.Valider) {
							return false;
						}
					});
			}
		})
		.then((aResult) => {
			if (aResult === false) {
				return;
			}
			return new ObjetRequeteSaisieGestionAPEleve(this)
				.lancerRequete({
					estSaisie: true,
					groupe: aGroupe,
					ajout: aAjout,
					eleve: aEleve,
					domaine: this.donnees.domaine,
				})
				.then((aParams) => {
					this.avecSaisie = true;
					if (aParams.JSONReponse && aParams.JSONReponse.listeGroupes) {
						this.donnees.groupes = aParams.JSONReponse;
						_actualiserListeGroupes.call(this);
					}
				});
		});
}
class ObjetRequeteSaisieGestionAPEleve extends ObjetRequeteSaisie {
	lancerRequete(aJSON) {
		if (aJSON && !aJSON.estSaisie) {
			this.setOptions({ messageDetail: "" });
		}
		return super.lancerRequete(aJSON);
	}
}
Requetes.inscrire("SaisieGestionAPEleve", ObjetRequeteSaisieGestionAPEleve);
class DonneesListe_ListeGroupes extends ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		aDonnees.parcourir((aArticle) => {
			if (aArticle.estCumul) {
				aArticle.estUnDeploiement = true;
				aArticle.estDeploye = true;
			} else {
				aArticle.pere = aDonnees.get(
					aDonnees.getIndiceParLibelle(aArticle.strMatiere),
				);
			}
		});
		this.setOptions({
			avecBoutonActionLigne: false,
			avecEvnt_ModificationSelection: true,
		});
	}
	getZoneMessage(aParams) {
		if (aParams.article.seances) {
			return aParams.article.seances.replaceRCToHTML();
		}
		return "";
	}
	avecCB(aParams) {
		return !aParams.article.estCumul;
	}
	setValueCB(aParams, aValue) {
		this.options.callbackSaisie(aParams.article, aValue);
	}
	avecSelection(aParams) {
		return !aParams.article.estCumul;
	}
	getTri() {
		return ObjetTri.initRecursif("pere", [ObjetTri.init("Libelle")]);
	}
}
class DonneesListe_ListeEleves extends ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecSelection: false, avecBoutonActionLigne: false });
	}
	getControleur(aDonneeListe, aListe) {
		return $.extend(true, super.getControleur(aDonneeListe, aListe), {
			btnSuppr: {
				event(aNumeroLigne) {
					const lArticle = aDonneeListe.Donnees.get(aNumeroLigne);
					aDonneeListe.options.callbackSuppr(lArticle);
				},
			},
		});
	}
	getZoneComplementaire(aParams) {
		if (aParams.article.estActif) {
			return tag(
				"div",
				{ class: "icones-conteneur" },
				tag("ie-btnicon", {
					class: "icon_trash icon",
					"ie-model": tag.funcAttr("btnSuppr", [aParams.ligne]),
					title: aParams.article.titleBtn,
				}),
			);
		}
		return "";
	}
	getHintForce(aParams) {
		return aParams.article.hint || "";
	}
	estLigneOff(aParams) {
		return !aParams.article.estActif;
	}
	getClassCelluleConteneur(aParams) {
		return aParams.article.italique ? "Italique" : "";
	}
}
