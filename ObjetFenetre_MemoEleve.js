exports.ObjetFenetre_MemoEleve = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDate_1 = require("ObjetDate");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetElement_1 = require("ObjetElement");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetRequeteSaisieMemoEleve_1 = require("ObjetRequeteSaisieMemoEleve");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_MemoEleve extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.setOptionsFenetre({
			largeur: 450,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			avecComposeBasInFooter: true,
		});
		this.enModification = false;
	}
	construireInstances() {
		this.identSelecteurDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this.evenementSelecteurDate.bind(this),
			this.initialiserSelecteurDate,
		);
	}
	initialiserSelecteurDate(aInstance) {
		aInstance.setParametresFenetre(
			GParametres.PremierLundi,
			GParametres.PremiereDate,
			GParametres.DerniereDate,
			GParametres.JoursOuvres,
			null,
			GParametres.JoursFeries,
			null,
			null,
		);
		aInstance.setPremiereDateSaisissable(GParametres.PremiereDate, true);
		aInstance.setOptionsObjetCelluleDate({
			largeurComposant: IE.estMobile ? 130 : 100,
			formatDate: "%JJ/%MM/%AAAA",
		});
	}
	evenementSelecteurDate(aDate) {
		this.memo.date = aDate;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			inputLibelle: {
				getValue() {
					return aInstance.memo ? aInstance.memo.getLibelle() : "";
				},
				setValue(aValue) {
					aInstance.memo.setLibelle(aValue);
				},
				getDisabled() {
					return aInstance.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.estEnConsultation,
					);
				},
			},
			getVisibleSelecDate: function () {
				return !aInstance.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.estEnConsultation,
				);
			},
			btnSupprimer: {
				event() {
					if (
						aInstance.enModification &&
						aInstance.donnees &&
						aInstance.donnees.memo &&
						aInstance.donnees.memo.existeNumero()
					) {
						GApplication.getMessage()
							.afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								message:
									aInstance.donnees && aInstance.donnees.estValorisation
										? ObjetTraduction_1.GTraductions.getValeur(
												"AbsenceVS.msgSuppressionValorisation",
											)
										: ObjetTraduction_1.GTraductions.getValeur(
												"AbsenceVS.msgSuppressionMemo",
											),
							})
							.then(
								((aGenreAction) => {
									if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
										aInstance.donnees.memo.setEtat(
											Enumere_Etat_1.EGenreEtat.Suppression,
										);
										aInstance.surValidation(1);
									}
								}).bind(aInstance),
							);
					}
				},
				getDisabled() {
					return (
						!aInstance.donnees ||
						!aInstance.enModification ||
						aInstance.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.estEnConsultation,
						)
					);
				},
			},
			fenetreBtn: {
				getDisabled: function (aBoutonRepeat) {
					if (aBoutonRepeat.element.index === 1) {
						return (
							!(aInstance.memo && aInstance.memo.getLibelle() !== "") ||
							aInstance.applicationSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.estEnConsultation,
							)
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
			cbPublie: {
				getValue() {
					return aInstance.memo ? aInstance.memo.publie : false;
				},
				setValue(aValue) {
					aInstance.memo.publie = aValue;
				},
			},
			cbPublieVS: {
				getValue() {
					return aInstance.memo ? aInstance.memo.publieVS : false;
				},
				setValue(aValue) {
					aInstance.memo.publieVS = aValue;
				},
			},
			afficherCbPublie() {
				return (
					!!aInstance.donnees &&
					!aInstance.donnees.estValorisation &&
					GEtatUtilisateur.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.Etablissement
				);
			},
		});
	}
	setDonnees(aDonnees) {
		this.donnees = aDonnees;
		if (aDonnees.memo) {
			this.enModification = true;
			this.memo = aDonnees.memo;
			this.memo.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		} else {
			const lUserConnecte = GEtatUtilisateur.getUtilisateur();
			this.memo = ObjetElement_1.ObjetElement.create({
				date: ObjetDate_1.GDate.aujourdhui,
				publie: true,
				publieVS: true,
				auteur: new ObjetElement_1.ObjetElement(
					lUserConnecte.getLibelle(),
					lUserConnecte.getNumero(),
					lUserConnecte.getGenre(),
				),
				editable: true,
			});
			this.memo.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		}
		this.getInstance(this.identSelecteurDate).setDonnees(this.memo.date);
		this.afficher();
	}
	surValidation(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			const lListeMemo = new ObjetListeElements_1.ObjetListeElements();
			lListeMemo.add(this.memo);
			new ObjetRequeteSaisieMemoEleve_1.ObjetRequeteSaisieMemoEleve(
				this,
			).lancerRequete({
				eleve: this.donnees.eleve,
				listeMemos: lListeMemo,
				estValorisation: this.donnees.estValorisation,
			});
			this.callback.appel(aNumeroBouton, this.memo, this.enModification);
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
					{ class: "fix-bloc ie-titre-petit only-mobile m-bottom-l" },
					ObjetTraduction_1.GTraductions.getValeur("FicheEleve.commentaire"),
				),
				IE.jsx.str("textarea", {
					"ie-model": "inputLibelle",
					class: "fluid-bloc m-bottom",
					style: "width:100%;",
					placeholder: ObjetTraduction_1.GTraductions.getValeur(
						"FicheEleve.redigezCommentaire",
					),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"FicheEleve.redigezCommentaire",
					),
				}),
			),
			IE.jsx.str(
				"div",
				{ class: "field-contain periode-contain m-bottom-l" },
				IE.jsx.str(
					"label",
					{ class: "fix-bloc m-right self-center" },
					ObjetTraduction_1.GTraductions.getValeur("Date"),
					" :",
				),
				IE.jsx.str("div", {
					id: this.getNomInstance(this.identSelecteurDate),
					"ie-display": "getVisibleSelecDate",
				}),
			),
			IE.jsx.str(
				"div",
				{ class: "field-contain shared-contain no-line" },
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": "cbPublie", "ie-if": "afficherCbPublie" },
					ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.PartageEnseignant",
					),
				),
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": "cbPublieVS", "ie-if": "afficherCbPublie" },
					ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.PartagePersonnel",
					),
				),
			),
		);
	}
	composeBas() {
		return IE.jsx.str(
			"div",
			{ class: "compose-bas" },
			IE.jsx.str("ie-btnicon", {
				"ie-model": "btnSupprimer",
				title: ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
				class: "icon_trash avecFond i-medium",
			}),
		);
	}
}
exports.ObjetFenetre_MemoEleve = ObjetFenetre_MemoEleve;
