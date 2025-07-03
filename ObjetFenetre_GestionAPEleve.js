exports.GestionAPEleve = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const TypeDomaine_1 = require("TypeDomaine");
const tag_1 = require("tag");
const ObjetListe_1 = require("ObjetListe");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetCalendrier_1 = require("ObjetCalendrier");
const ObjetTri_1 = require("ObjetTri");
const UtilitaireInitCalendrier_1 = require("UtilitaireInitCalendrier");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetChaine_1 = require("ObjetChaine");
const Invocateur_1 = require("Invocateur");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetDate_1 = require("ObjetDate");
const Enumere_Action_1 = require("Enumere_Action");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const AccessApp_1 = require("AccessApp");
exports.GestionAPEleve = {
	ouvrirFenetrePromise(aInstance, aEleve, aDate) {
		const lDomaine = new TypeDomaine_1.TypeDomaine().setValeur(
			true,
			IE.Cycles.cycleDeLaDate(aDate),
		);
		return new Promise((aResolve) => {
			(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
				aResolve();
			});
		}).then(async () => {
			const lResult = await new ObjetRequeteSaisieGestionAPEleve(
				aInstance,
			).lancerRequete({ eleve: aEleve, domaine: lDomaine });
			if (lResult.JSONReponse) {
				if (!lResult.JSONReponse.listeGroupes) {
					GApplication.getMessage().afficher({
						message: lResult.JSONReponse.message || "",
					});
					return;
				}
				return ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_GestionAPEleve,
					{ pere: aInstance },
					{
						titre: ObjetChaine_1.GChaine.format("%s - %s", [
							aEleve.getLibelle(),
							ObjetTraduction_1.GTraductions.getValeur(
								"ObjetFenetre_GestionAPEleve.GroupeGAEVEleve",
							),
						]),
					},
				).setDonneespromise({
					domaine: lDomaine,
					eleve: aEleve,
					groupes: lResult.JSONReponse,
				});
			}
		});
	},
};
class ObjetFenetre_GestionAPEleve extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			largeur: 700,
			hauteur: 600,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
		this._groupeSelection = null;
		Invocateur_1.Invocateur.abonner(
			Invocateur_1.ObjetInvocateur.events.modeExclusif,
			() => {
				this.fermer();
			},
			this,
		);
	}
	construireInstances() {
		this.identCalendrier = this.add(
			ObjetCalendrier_1.ObjetCalendrier,
			(ASelection, aDomaine) => {
				this.donnees.domaine = aDomaine;
				if (
					this.getInstance(this.identCalendrier).estUneInteractionUtilisateur()
				) {
					this._requeteListeGroupes();
				}
			},
			(aCalendrier) => {
				UtilitaireInitCalendrier_1.UtilitaireInitCalendrier.init(aCalendrier, {
					avecMultiSemainesContinues: true,
				});
				aCalendrier.setFrequences(
					(0, AccessApp_1.getApp)().getObjetParametres().frequences,
					true,
				);
			},
		);
		this.identListeGroupe = this.add(
			ObjetListe_1.ObjetListe,
			(aParametres) => {
				switch (aParametres.genreEvenement) {
					case Enumere_EvenementListe_1.EGenreEvenementListe
						.ModificationSelection: {
						this._groupeSelection = aParametres.instance.getElementSelection();
						this._surSelectionGroupe();
						break;
					}
				}
			},
			(aListe) => {
				aListe.setOptionsListe({
					skin: ObjetListe_1.ObjetListe.skin.flatDesign,
					boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher }],
				});
			},
		);
		this.identListeEleve = this.add(ObjetListe_1.ObjetListe, null, (aListe) => {
			aListe.setOptionsListe({
				skin: ObjetListe_1.ObjetListe.skin.flatDesign,
				boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher }],
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
		this._actualiserListeGroupes();
		return lPromise.then(() => {
			return { avecSaisie: this.avecSaisie };
		});
	}
	composeContenu() {
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				{ class: "container" },
				IE.jsx.str("div", {
					id: this.getInstance(this.identCalendrier).getNom(),
					class: "calendrier",
				}),
				IE.jsx.str("label", { class: "legende", "ie-html": "getHtmlLegende" }),
				IE.jsx.str(
					"div",
					{ class: "listes" },
					IE.jsx.str("div", {
						id: this.getInstance(this.identListeGroupe).getNom(),
						class: "liste-groupe",
					}),
					IE.jsx.str(
						"div",
						{
							id: this.getInstance(this.identListeEleve).getNom(),
							class: "liste-eleve",
						},
						this._getMessageVide(),
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
	_requeteListeGroupes() {
		new ObjetRequeteSaisieGestionAPEleve(this)
			.lancerRequete({
				eleve: this.donnees.eleve,
				domaine: this.donnees.domaine,
			})
			.then((aParams) => {
				if (aParams.JSONReponse) {
					this.donnees.groupes = aParams.JSONReponse;
					this._actualiserListeGroupes();
				}
			});
	}
	_actualiserListeGroupes() {
		const lJSelecListe = $(`#${this.Nom.escapeJQ()} .container>.listes`);
		if (!this.donnees.groupes.listeGroupes) {
			this._groupeSelection = null;
			this._surSelectionGroupe();
			lJSelecListe.hide();
		} else {
			lJSelecListe.show();
			this.getInstance(this.identListeGroupe).setDonnees(
				new DonneesListe_ListeGroupes(
					this.donnees.groupes.listeGroupes,
				).setOptions({
					callbackSaisie: (aGroupe, aAjout) => {
						this._saisie(aGroupe, this.donnees.eleve, aAjout);
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
				this._surSelectionGroupe();
			} else {
				this.getInstance(this.identListeGroupe).setListeElementsSelection(
					new ObjetListeElements_1.ObjetListeElements().add(
						this._groupeSelection,
					),
					{ avecScroll: true },
				);
			}
		}
	}
	_surSelectionGroupe() {
		const lListeEleves = this.getInstance(this.identListeEleve);
		if (!this._groupeSelection) {
			lListeEleves.setDonnees(
				new DonneesListe_ListeEleves(
					new ObjetListeElements_1.ObjetListeElements(),
				),
			);
			lListeEleves.afficher(this._getMessageVide());
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
								this._saisie(this._groupeSelection, aEleve, false);
							},
						}),
					);
				});
		}
	}
	_getMessageVide() {
		return (0, tag_1.tag)(
			"div",
			{ class: "text-empty" },
			(0, tag_1.tag)(
				"label",
				ObjetTraduction_1.GTraductions.getValeur(
					"ObjetFenetre_GestionAPEleve.SelectionnezGroupe",
				),
			),
		);
	}
	_saisie(aGroupe, aEleve, aAjout) {
		return Promise.resolve()
			.then(() => {
				if (!aAjout) {
					return GApplication.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message: ObjetChaine_1.GChaine.format(
								ObjetTraduction_1.GTraductions.getValeur(
									"ObjetFenetre_GestionAPEleve.ConfirmezVous_Si",
								),
								[
									aEleve.getLibelle(),
									aGroupe.getLibelle(),
									ObjetDate_1.GDate.formatDate(
										IE.Cycles.dateDebutCycle(
											this.donnees.domaine.getPremierePosition(),
										),
										"%JJ/%MM/%AAAA",
									),
									ObjetDate_1.GDate.formatDate(
										IE.Cycles.dateFinCycle(
											this.donnees.domaine.getDernierePosition(),
										),
										"%JJ/%MM/%AAAA",
									),
								],
							),
						})
						.then((aGenreAction) => {
							if (aGenreAction !== Enumere_Action_1.EGenreAction.Valider) {
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
							this._actualiserListeGroupes();
						}
					});
			});
	}
}
class ObjetRequeteSaisieGestionAPEleve extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aJSON) {
		if (aJSON && !aJSON.estSaisie) {
			this.setOptions({ messageDetail: "" });
		}
		return super.lancerRequete(aJSON);
	}
}
CollectionRequetes_1.Requetes.inscrire(
	"SaisieGestionAPEleve",
	ObjetRequeteSaisieGestionAPEleve,
);
class DonneesListe_ListeGroupes extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
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
		return [
			ObjetTri_1.ObjetTri.initRecursif("pere", [
				ObjetTri_1.ObjetTri.init("Libelle"),
			]),
		];
	}
}
class DonneesListe_ListeEleves extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecSelection: false, avecBoutonActionLigne: false });
	}
	jsxModeleBoutonSuppr(aArticle) {
		return {
			event: () => {
				this.options.callbackSuppr(aArticle);
			},
		};
	}
	getZoneComplementaire(aParams) {
		if (aParams.article.estActif) {
			return IE.jsx.str(
				"div",
				{ class: "icones-conteneur" },
				IE.jsx.str("ie-btnicon", {
					class: "icon_trash icon",
					"ie-model": this.jsxModeleBoutonSuppr.bind(this, aParams.article),
					title: aParams.article.titleBtn,
				}),
			);
		}
		return "";
	}
	getTooltip(aParams) {
		return aParams.article.hint || "";
	}
	estLigneOff(aParams) {
		return !aParams.article.estActif;
	}
	getClassCelluleConteneur(aParams) {
		return aParams.article.italique ? "Italique" : "";
	}
}
