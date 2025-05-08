exports.InterfaceCommissions = void 0;
const InterfacePage_1 = require("InterfacePage");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetDate_1 = require("ObjetDate");
const ObjetDetailCommission_1 = require("ObjetDetailCommission");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetRequeteCommissions_1 = require("ObjetRequeteCommissions");
class InterfaceCommissions extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.listeCommissions = new ObjetListeElements_1.ObjetListeElements();
		this.listeNaturesCommission = new ObjetListeElements_1.ObjetListeElements();
		this.commissionSelectionnee = null;
		this.listeNaturesCommissionFiltrees = null;
	}
	construireInstances() {
		this.identCommissions = this.add(
			ObjetListe_1.ObjetListe,
			this._evntListeCommission.bind(this),
			this._initListeCommission,
		);
		this.identObjetDetailCommission = this.add(
			ObjetDetailCommission_1.ObjetDetailCommission,
			this._evtDetailCommission.bind(this),
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.IdentZoneAlClient = this.identCommissions;
		this.avecBandeau = true;
	}
	recupererDonnees() {
		new ObjetRequeteCommissions_1.ObjetRequeteCommissions(
			this,
			this._actionApresRequete.bind(this),
		).lancerRequete();
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "flex-contain full-size" },
					IE.jsx.str("div", {
						id: this.getInstance(this.identCommissions).getNom(),
						class: "full-height",
						style: "width:65rem;",
					}),
					IE.jsx.str("div", {
						id: this.getInstance(this.identObjetDetailCommission).getNom(),
						class: "flex-contain flex-cols full-height p-all-xl",
						style: "width:85rem;",
						tabindex: "0",
					}),
				),
			),
		);
		return H.join("");
	}
	_actionApresRequete(aJSON) {
		if (aJSON.commissions) {
			this.listeCommissions = aJSON.commissions;
			this.listeNaturesCommission =
				new ObjetListeElements_1.ObjetListeElements();
			this.listeCommissions.parcourir((aCommission) => {
				if (
					!this.listeNaturesCommission.getElementParElement(aCommission.nature)
				) {
					this.listeNaturesCommission.add(aCommission.nature);
				}
			});
		}
		this._actualiserDonneesListe();
	}
	_actualiserDonneesListe(aFiltre) {
		const lAvecFiltre = this.listeNaturesCommission.count() > 1;
		const lBoutons = [];
		let lListeCommissions = this.listeCommissions;
		let lDonneesListeCommissions;
		if (lAvecFiltre) {
			lBoutons.push({ genre: ObjetListe_1.ObjetListe.typeBouton.filtrer });
			const lNatures = aFiltre
				? aFiltre.natures
				: this.listeNaturesCommissionFiltrees || this.listeNaturesCommission;
			if (lNatures) {
				lListeCommissions = new ObjetListeElements_1.ObjetListeElements();
				this.listeCommissions.parcourir((aCommission) => {
					if (lNatures.getElementParElement(aCommission.nature)) {
						lListeCommissions.add(aCommission);
					}
				});
			}
			lDonneesListeCommissions = new DonneesListe_CommissionVisuProf(
				lListeCommissions,
				{
					donneesFiltre: {
						filtreListeNatures: this.listeNaturesCommission,
						natures: lNatures,
					},
					evenementFiltre: (aFiltre) => {
						this.listeNaturesCommissionFiltrees = aFiltre.natures;
						this._actualiserDonneesListe(aFiltre);
					},
				},
			);
			lDonneesListeCommissions.setOptions({
				filtre: {
					filtreListeNatures: this.listeNaturesCommission,
					natures: lNatures,
				},
				evtFiltre: (aFiltre) => {
					this.listeNaturesCommissionFiltrees = aFiltre.natures;
					this._actualiserDonneesListe(aFiltre);
				},
			});
			this.commissionSelectionnee = lListeCommissions.getElementParElement(
				this.commissionSelectionnee,
			);
		} else {
			lDonneesListeCommissions = new DonneesListe_CommissionVisuProf(
				lListeCommissions,
			);
		}
		lBoutons.push({ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher });
		this.getInstance(this.identCommissions).setOptionsListe({
			boutons: lBoutons,
		});
		this.getInstance(this.identCommissions).setDonnees(
			lDonneesListeCommissions,
		);
		this._actualiserDetailsCommission();
	}
	_initListeCommission(aInstance) {
		aInstance.setOptionsListe({
			colonnes: [{ taille: "100%" }],
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecOmbreDroite: true,
			messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.aucuneCommission",
			).ucfirst(),
		});
	}
	_evntListeCommission(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
				this.commissionSelectionnee = aParams.article;
				this._actualiserDetailsCommission();
				break;
		}
	}
	_actualiserDetailsCommission() {
		this.getInstance(this.identObjetDetailCommission).setDonnees(
			this.commissionSelectionnee,
		);
	}
	_evtDetailCommission() {
		this.recupererDonnees();
	}
}
exports.InterfaceCommissions = InterfaceCommissions;
class DonneesListe_CommissionVisuProf extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aListeCommissions, aParametres) {
		super(aListeCommissions);
		this.donneesFiltre =
			aParametres === null || aParametres === void 0
				? void 0
				: aParametres.donneesFiltre;
		this.evenementFiltre =
			aParametres === null || aParametres === void 0
				? void 0
				: aParametres.evenementFiltre;
		this.setOptions({
			avecBoutonActionLigne: false,
			avecEvnt_SelectionClick: true,
		});
	}
	getZoneGauche(aParams) {
		return IE.jsx.str(
			"time",
			{
				class: "date-contain",
				datetime: ObjetDate_1.GDate.formatDate(
					aParams.article.dateDebut,
					"%MM-%JJ",
				),
			},
			ObjetDate_1.GDate.formatDate(aParams.article.dateDebut, "%JJ %MMM"),
		);
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.listeConvoques.getTableauLibelles().join(", ");
	}
	getInfosSuppZonePrincipale(aParams) {
		return ObjetTraduction_1.GTraductions.getValeur(
			"Commissions.natureCommissionPresideePar",
			[
				aParams.article.nature.getLibelle(),
				aParams.article.president.getLibelle(),
			],
		);
	}
	getZoneComplementaire(aParams) {
		const H = [];
		const lAvecListeMembre =
			aParams.article.listeMembres && aParams.article.listeMembres.count();
		const lAvecPublieeParents = aParams.article.avecPublicationParent;
		if (lAvecListeMembre || lAvecPublieeParents) {
			H.push(
				`<div ${lAvecListeMembre && lAvecPublieeParents ? 'class="flex-contain"' : ""}>`,
			);
			if (lAvecListeMembre) {
				H.push(
					`<i class="icon_intervenants i-medium i-as-deco" title="${ObjetTraduction_1.GTraductions.getValeur("Commissions.listeMembres", [aParams.article.listeMembres.getTableauLibelles().join(", ")])}"></i>`,
				);
			}
			if (lAvecPublieeParents) {
				H.push(
					`<i class="icon_info_sondage_publier mix-icon_ok i-as-deco ${lAvecListeMembre ? "m-left-l" : ""}" title="${ObjetTraduction_1.GTraductions.getValeur("Commissions.publieePourParents")}"></i>`,
				);
			}
			H.push("</div>");
		}
		return H.join("");
	}
	getControleurFiltres(aDonneesListe, aInstanceListe) {
		return {
			cmbNature: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						estLargeurAuto: true,
						libelleHaut: ObjetTraduction_1.GTraductions.getValeur(
							"Commissions.naturesCommissions",
						),
						avecDesignMobile: true,
						multiSelection: true,
						avecElementObligatoire: true,
						getLibelleCelluleMultiSelection: function (aListeSelections) {
							return aListeSelections &&
								aListeSelections.count() !==
									aDonneesListe.donneesFiltre.filtreListeNatures.count()
								? aListeSelections.getTableauLibelles().join(", ")
								: ObjetTraduction_1.GTraductions.getValeur(
										"Commissions.toutesLesCommissions",
									);
						},
					});
				},
				getDonnees() {
					return aDonneesListe.donneesFiltre.filtreListeNatures;
				},
				getIndiceSelection() {
					return aDonneesListe.donneesFiltre.natures;
				},
				event(aInstanceCombo) {
					if (
						aInstanceCombo.listeSelections !== null &&
						aInstanceCombo.interactionUtilisateur
					) {
						aDonneesListe.donneesFiltre.natures =
							aInstanceCombo.listeSelections;
						aDonneesListe.evenementFiltre(aDonneesListe.donneesFiltre);
					}
				},
			},
		};
	}
	construireFiltres() {
		if (!this.donneesFiltre) {
			return "";
		}
		return IE.jsx.str("ie-combo", { "ie-model": "cmbNature" });
	}
	reinitFiltres() {
		if (this.donneesFiltre) {
			this.donneesFiltre.natures = this.donneesFiltre.filtreListeNatures;
			this.evenementFiltre(this.donneesFiltre);
		}
	}
	estFiltresParDefaut() {
		if (!this.donneesFiltre) {
			return true;
		}
		return (
			this.donneesFiltre.natures.count() ===
			this.donneesFiltre.filtreListeNatures.count()
		);
	}
}
