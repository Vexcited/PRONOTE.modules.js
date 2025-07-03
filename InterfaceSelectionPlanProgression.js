exports.InterfaceSelectionPlanProgression = void 0;
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const Enumere_EvenementTreeView_1 = require("Enumere_EvenementTreeView");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTreeView_1 = require("ObjetTreeView");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetDonneesTreeViewProgression_1 = require("ObjetDonneesTreeViewProgression");
const ObjetDonneesTreeViewProgression_2 = require("ObjetDonneesTreeViewProgression");
const ObjetDonneesTreeViewProgression_3 = require("ObjetDonneesTreeViewProgression");
const ObjetFenetre_Progression_1 = require("ObjetFenetre_Progression");
const ObjetFenetre_RemplirProgression_1 = require("ObjetFenetre_RemplirProgression");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const InterfaceListeProgression_1 = require("InterfaceListeProgression");
class InterfaceSelectionPlanProgression extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.options = {
			selectionTreeView: null,
			bloquerInterface: null,
			surEdition: function () {},
			callbackDragNode: null,
			nonEditable: false,
			cssConteneur: "",
		};
		this.donnees = { progressionSelection: null, itemTreeView: null };
	}
	recupererDonnees() {
		super.recupererDonnees();
	}
	setOptionsSelectionProgression(aOptions) {
		Object.assign(this.options, aOptions);
		return this;
	}
	construireInstances() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.identListeProgression = this.add(
			InterfaceListeProgression_1.InterfaceListeProgression,
			null,
			function (aInstance) {
				aInstance.setOptions({
					nonEditable: this.options.nonEditable,
					classeFenetreProgression:
						ObjetFenetre_Progression_1.ObjetFenetre_Progression,
					callbackSelectionProgression: () => {
						var _a, _b;
						const lProgression = this.getProgressionSelection();
						if (
							lProgression &&
							this.donnees.progressionSelection &&
							lProgression.getNumero() ===
								this.donnees.progressionSelection.getNumero()
						) {
							return;
						}
						this.donnees.progressionSelection = lProgression;
						this._actualiserTreeView(true);
						(_b = (_a = this.options).selectionListe) === null || _b === void 0
							? void 0
							: _b.call(_a);
					},
				});
			},
		);
		this.identTreeView = this.add(
			ObjetTreeView_1.ObjetTreeView,
			this._evenementSurTreeView,
			(aInstance) => {
				aInstance.setParametres();
			},
		);
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			'<div class="InterfaceSelectionPlanProgression',
			this.options.cssConteneur ? " " + this.options.cssConteneur : "",
			'">',
			'<div class="isp_liste">',
			'<div class="isp_conteneurComposant">',
			'<div class="isp_bandeau">',
			"<div>",
			ObjetTraduction_1.GTraductions.getValeur("progression.MesProgressions"),
			"</div>",
			"</div>",
			'<div id="',
			this.getNomInstance(this.identListeProgression),
			'"></div>',
			"</div>",
			"</div>",
			'<div class="isp_treeview">',
			'<div class="isp_conteneurComposant">',
			'<div class="isp_bandeau">',
			"<div>",
			ObjetTraduction_1.GTraductions.getValeur(
				"progression.PlanDeLaProgression",
			),
			"</div>",
			"</div>",
			'<div id="',
			this.getNomInstance(this.identTreeView),
			'"></div>',
			"</div>",
			"</div>",
			"</div>",
		);
		return H.join("");
	}
	actualiser(aDonnees) {
		this.donnees.itemTreeView = null;
		Object.assign(this.donnees, aDonnees);
		this.getInstance(this.identListeProgression).actualiser(aDonnees);
		this.donnees.progressionSelection = this.getProgressionSelection();
		let lOrdresNoeudsSelectionnes;
		if (this.donnees.progressionSelection) {
			lOrdresNoeudsSelectionnes = this.getInstance(
				this.identTreeView,
			).getOrdreSelection();
		}
		this._actualiserTreeView();
		if (lOrdresNoeudsSelectionnes && lOrdresNoeudsSelectionnes.length > 0) {
			this.getInstance(this.identTreeView).setSelectionParOrdre(
				lOrdresNoeudsSelectionnes,
				true,
			);
		} else {
			this._setItemTreeViewSelection(null);
		}
	}
	setEtatSaisie(aEtatSaisie) {
		if (aEtatSaisie) {
			this.options.surEdition();
		}
	}
	getProgressionSelection() {
		return this.getInstance(this.identListeProgression)
			? this.getInstance(this.identListeProgression).getProgressionSelection()
			: null;
	}
	remplirProgressionCourante(aNode) {
		this.getInstance(this.identListeProgression).remplirProgressionCourante(
			aNode,
		);
	}
	_actualiserTreeView(aAvecSelection) {
		const lProgression = this.getProgressionSelection();
		const lTreeView = this.getInstance(this.identTreeView);
		const lClassDonneesTreeView =
			this.options.nonEditable ||
			GApplication.droits.get(ObjetDroitsPN_1.TypeDroits.estEnConsultation)
				? ObjetDonneesTreeViewProgression_2.ObjetDonneesTreeViewProgression_Affectation
				: ObjetDonneesTreeViewProgression_1.ObjetDonneesTreeViewProgression;
		if (lProgression) {
			if (!lProgression.listeDossiers) {
				lProgression.listeDossiers =
					new ObjetListeElements_1.ObjetListeElements();
			}
			lTreeView.setDonnees(
				new lClassDonneesTreeView(lProgression.listeDossiers),
			);
		} else {
			lTreeView.setDonnees(
				new lClassDonneesTreeView(
					new ObjetListeElements_1.ObjetListeElements(),
				).setOptionsTreeView({ avecCreation: false }),
			);
		}
		if (aAvecSelection) {
			this._setItemTreeViewSelection(null);
		}
	}
	_setItemTreeViewSelection(aItem, aNode) {
		if (this.donnees.itemTreeView !== aItem) {
			this.donnees.itemTreeView = aItem;
			if (this.options.selectionTreeView && this.donnees.progressionSelection) {
				this.options.selectionTreeView(
					aItem,
					aNode,
					this.donnees.progressionSelection.matiere,
				);
			}
			this.$refresh();
		}
	}
	_evenementSurTreeView(
		aGenreEvenement,
		aNode,
		aSurInteractionUtilisateur,
		aLigneMenuContextuel,
	) {
		switch (aGenreEvenement) {
			case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.selection: {
				this._setItemTreeViewSelection(aNode ? aNode.contenu : null, aNode);
				break;
			}
			case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.editionDebut:
			case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.dragDebut:
				if (this.options.bloquerInterface) {
					this.options.bloquerInterface(true);
				}
				if (
					this.options.callbackDragNode &&
					aGenreEvenement ===
						Enumere_EvenementTreeView_1.EGenreEvenementTreeView.dragDebut
				) {
					this.options.callbackDragNode(aNode);
				}
				break;
			case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.editionFin:
			case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.dragFin:
				if (this.options.bloquerInterface) {
					this.options.bloquerInterface(false);
				}
				if (
					this.options.callbackDragNode &&
					aGenreEvenement ===
						Enumere_EvenementTreeView_1.EGenreEvenementTreeView.dragFin
				) {
					this.options.callbackDragNode(null);
				}
				break;
			case Enumere_EvenementTreeView_1.EGenreEvenementTreeView.menuContextuel: {
				switch (aLigneMenuContextuel.getNumero()) {
					case ObjetDonneesTreeViewProgression_3
						.EGenreEvenementContextuelTreeViewProgression.affecterProgramme:
						ObjetFenetre_RemplirProgression_1.ObjetFenetre_RemplirProgression.programmeNational(
							{
								progression: this.getProgressionSelection(),
								pere: this,
								evenement: () => {
									this.options.surEdition();
								},
							},
						);
						return;
				}
				break;
			}
		}
	}
}
exports.InterfaceSelectionPlanProgression = InterfaceSelectionPlanProgression;
