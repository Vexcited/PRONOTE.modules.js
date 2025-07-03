exports.InterfacePageRencontres = void 0;
const PageRencontresDesiderata_Mobile_1 = require("PageRencontresDesiderata_Mobile");
const PageRencontresPlanning_1 = require("PageRencontresPlanning");
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetSelection_1 = require("ObjetSelection");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const UtilitaireRencontres_1 = require("UtilitaireRencontres");
const ObjetRequeteSessionRencontres_1 = require("ObjetRequeteSessionRencontres");
const ObjetRequeteRencontres_1 = require("ObjetRequeteRencontres");
const ObjetTabOnglets_1 = require("ObjetTabOnglets");
const ObjetHtml_1 = require("ObjetHtml");
const AccessApp_1 = require("AccessApp");
class InterfacePageRencontres extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	constructor() {
		super(...arguments);
		this.ids = {
			principal: "wrapper_page_rencontre",
			message: "page_rencontre_message",
		};
		this.TypeOnglet = { DESIDERATA: 0, PLANNING: 1 };
		this.donnees = {
			listeOnglets: new ObjetListeElements_1.ObjetListeElements(),
		};
	}
	construireInstances() {
		this.identSelection = this.add(
			ObjetSelection_1.ObjetSelection,
			this._evenementSelectionSession.bind(this),
			(aInstance) => {
				aInstance.setParametres({
					labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
						"WAI.SelectionSessionRencontre",
					),
				});
			},
		);
		this.identTabs = this.add(
			ObjetTabOnglets_1.ObjetTabOnglets,
			this._surEvenementObjetTabs.bind(this),
			(aInstance) => {
				aInstance.setOptionsTabOnglets({ afficherOngletUnique: true });
			},
		);
		this.ObjetRencontresDesiderata = this.add(
			PageRencontresDesiderata_Mobile_1.PageRencontresDesiderata,
			() => {
				this._lancerRequete();
			},
		);
		this.ObjetRencontresPlanning = this.add(
			PageRencontresPlanning_1.PageRencontresPlanning,
			() => {
				this._lancerRequete();
			},
		);
		this.AddSurZone = [this.identSelection, this.identTabs];
	}
	setParametresGeneraux() {
		super.setParametresGeneraux();
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const lHtml = [];
		lHtml.push(
			'<div id="',
			this.ids.principal,
			'" style="height: 100%;">',
			'<div id="',
			this.getInstance(this.ObjetRencontresDesiderata).getNom(),
			'"></div>',
			'<div id="',
			this.getInstance(this.ObjetRencontresPlanning).getNom(),
			'"></div>',
			"</div>",
		);
		lHtml.push('<div id="', this.ids.message, '"></div>');
		return lHtml.join("");
	}
	recupererDonnees() {
		new ObjetRequeteSessionRencontres_1.ObjetRequeteSessionRencontres(
			this,
			this.actionSurRecupererDonnees,
		).lancerRequete();
	}
	actionSurRecupererDonnees(aParams) {
		const lListeSessionsRencontre =
			UtilitaireRencontres_1.TUtilitaireRencontre.formaterListeSessionsRencontrePourCombo(
				aParams.listeSessions,
				true,
			);
		if (!lListeSessionsRencontre || lListeSessionsRencontre.count() === 0) {
			this.getInstance(this.identSelection).setVisible(false);
			ObjetHtml_1.GHtml.setHtml(
				this.ids.principal,
				this.composeAucuneDonnee(
					ObjetTraduction_1.GTraductions.getValeur("Rencontres.aucuneSession"),
				),
			);
		} else {
			lListeSessionsRencontre.setTri([
				ObjetTri_1.ObjetTri.init("date"),
				ObjetTri_1.ObjetTri.init("Libelle"),
			]);
			lListeSessionsRencontre.trier();
			let lIndiceSession = 0;
			if ((0, AccessApp_1.getApp)().getEtatUtilisateur().jeton_notifRencontre) {
				lIndiceSession = lListeSessionsRencontre.getIndiceParElement(
					(0, AccessApp_1.getApp)().getEtatUtilisateur().jeton_notifRencontre,
				);
				this.ongletSelectionne = this.TypeOnglet.PLANNING;
				delete (0, AccessApp_1.getApp)().getEtatUtilisateur()
					.jeton_notifRencontre;
			} else {
				lIndiceSession =
					UtilitaireRencontres_1.TUtilitaireRencontre.chercherIndiceSessionProchaineSession(
						lListeSessionsRencontre,
					);
			}
			this.getInstance(this.identSelection).setDonnees(
				lListeSessionsRencontre,
				lIndiceSession,
			);
		}
	}
	_evenementSelectionSession(aParam) {
		this.sessionSelectionne = aParam.element;
		this._lancerRequete();
	}
	_lancerRequete() {
		new ObjetRequeteRencontres_1.ObjetRequeteRencontres(
			this,
			this._surReponseRequeteRencontres.bind(this, this.sessionSelectionne),
		).lancerRequete(this.sessionSelectionne);
	}
	_surReponseRequeteRencontres(aSessionRencontre, aJSON) {
		$("#" + this.ids.principal).show();
		$("#" + this.ids.message).hide();
		if (!!aJSON) {
			if (!!aJSON.Message) {
				$("#" + this.ids.principal).hide();
				$("#" + this.ids.message)
					.html(this.composeAucuneDonnee(aJSON.Message))
					.show();
			} else {
				aSessionRencontre.dateDebutSaisie = aJSON.dateDebutSaisie;
				aSessionRencontre.dateFinSaisie = aJSON.dateFinSaisie;
				$("#" + this.ids.principal).scrollTop(0);
				const lListeOnglet = new ObjetListeElements_1.ObjetListeElements();
				const lElementDesiderata = new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"Rencontres.Onglet.Desiderata",
					),
					null,
					this.TypeOnglet.DESIDERATA,
				);
				lElementDesiderata.idDiv = this.getInstance(
					this.ObjetRencontresDesiderata,
				).getNom();
				const lElementPlanning = new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"Rencontres.Onglet.Planning",
					),
					null,
					this.TypeOnglet.PLANNING,
				);
				lElementPlanning.idDiv = this.getInstance(
					this.ObjetRencontresPlanning,
				).getNom();
				let lNbreTabVisible = 0;
				if (!!aJSON.indisponibilites || !!aJSON.desiderata) {
					this.getInstance(this.ObjetRencontresDesiderata).setVisible(true);
					lListeOnglet.addElement(lElementDesiderata);
					this.getInstance(this.ObjetRencontresDesiderata).setDonnees({
						sessionRencontre: aSessionRencontre,
						indisponibilites: aJSON.indisponibilites,
						desiderata: aJSON.desiderata,
						autorisations: aJSON.autorisations,
						information: aJSON.information,
					});
					lElementDesiderata.setActif(true);
					lNbreTabVisible++;
				} else {
					lElementDesiderata.setActif(false);
					this.getInstance(this.ObjetRencontresDesiderata).setVisible(false);
				}
				if (!!aJSON.planning) {
					this.getInstance(this.ObjetRencontresPlanning).setVisible(true);
					lListeOnglet.addElement(lElementPlanning);
					this.getInstance(this.ObjetRencontresPlanning).setDonnees(
						aJSON.planning,
					);
					lElementPlanning.setActif(true);
					lNbreTabVisible++;
				} else {
					lElementPlanning.setActif(false);
					this.getInstance(this.ObjetRencontresPlanning).setVisible(false);
				}
				let lOngletSelectionne = this.ongletSelectionne || 0;
				if (lOngletSelectionne >= lNbreTabVisible) {
					lOngletSelectionne = 0;
				}
				this.getInstance(this.identTabs).setDonnees(
					lListeOnglet,
					lOngletSelectionne,
				);
			}
		}
	}
	_surEvenementObjetTabs(aOngletSelectionne) {
		if (!!aOngletSelectionne) {
			this.ongletSelectionne = aOngletSelectionne.getGenre();
			const lAvecPiedDePage =
				!!aOngletSelectionne &&
				aOngletSelectionne.getGenre() === this.TypeOnglet.DESIDERATA;
			const lBtnFlottant = this.getInstance(
				this.ObjetRencontresDesiderata,
			).identBtnFlottant;
			if (!!lBtnFlottant) {
				lBtnFlottant.setVisible(lAvecPiedDePage);
			}
		}
	}
}
exports.InterfacePageRencontres = InterfacePageRencontres;
