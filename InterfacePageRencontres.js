const PageRencontresDesiderata = require("PageRencontresDesiderata_Mobile.js");
const PageRencontresPlanning = require("PageRencontresPlanning.js");
const { InterfacePage_Mobile } = require("InterfacePage_Mobile.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetSelection } = require("ObjetSelection.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { TUtilitaireRencontre } = require("UtilitaireRencontres.js");
const {
	ObjetRequeteSessionRencontres,
} = require("ObjetRequeteSessionRencontres.js");
const ObjetRequeteRencontres = require("ObjetRequeteRencontres.js");
const { ObjetTabOnglets } = require("ObjetTabOnglets.js");
const { GHtml } = require("ObjetHtml.js");
class ObjetAffichagePageRencontres_Mobile extends InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.ids = {
			principal: "wrapper_page_rencontre",
			message: "page_rencontre_message",
		};
		this.TypeOnglet = { DESIDERATA: 0, PLANNING: 1 };
		this.donnees = { listeOnglets: new ObjetListeElements() };
	}
	construireInstances() {
		this.identSelection = this.add(
			ObjetSelection,
			_evenementSelectionSession.bind(this),
			(aInstance) => {
				aInstance.setParametres({
					labelWAICellule: GTraductions.getValeur(
						"WAI.SelectionSessionRencontre",
					),
				});
			},
		);
		this.identTabs = this.add(
			ObjetTabOnglets,
			_surEvenementObjetTabs.bind(this),
			(aInstance) => {
				aInstance.setOptionsTabOnglets({ afficherOngletUnique: true });
			},
		);
		this.ObjetRencontresDesiderata = this.add(PageRencontresDesiderata, () => {
			_lancerRequete.call(this);
		});
		this.ObjetRencontresPlanning = this.add(PageRencontresPlanning, () => {
			_lancerRequete.call(this);
		});
		this.AddSurZone = [this.identSelection, this.identTabs];
	}
	setParametresGeneraux() {
		super.setParametresGeneraux();
		this.GenreStructure = EStructureAffichage.Autre;
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
		new ObjetRequeteSessionRencontres(
			this,
			this.actionSurRecupererDonnees,
		).lancerRequete();
	}
	actionSurRecupererDonnees(aParams) {
		const lListeSessionsRencontre =
			TUtilitaireRencontre.formaterListeSessionsRencontrePourCombo(
				aParams.listeSessions,
				true,
			);
		if (!lListeSessionsRencontre || lListeSessionsRencontre.count() === 0) {
			this.getInstance(this.identSelection).setVisible(false);
			GHtml.setHtml(
				this.ids.principal,
				this.composeAucuneDonnee(
					GTraductions.getValeur("Rencontres.aucuneSession"),
				),
			);
		} else {
			lListeSessionsRencontre.setTri([
				ObjetTri.init("date"),
				ObjetTri.init("Libelle"),
			]);
			lListeSessionsRencontre.trier();
			let lIndiceSession = 0;
			if (GEtatUtilisateur.jeton_notifRencontre) {
				lIndiceSession = lListeSessionsRencontre.getIndiceParElement(
					GEtatUtilisateur.jeton_notifRencontre,
				);
				this.ongletSelectionne = this.TypeOnglet.PLANNING;
				delete GEtatUtilisateur.jeton_notifRencontre;
			} else {
				lIndiceSession =
					TUtilitaireRencontre.chercherIndiceSessionProchaineSession(
						lListeSessionsRencontre,
					);
			}
			this.getInstance(this.identSelection).setDonnees(
				lListeSessionsRencontre,
				lIndiceSession,
			);
		}
	}
}
function _evenementSelectionSession(aParam) {
	this.sessionSelectionne = aParam.element;
	_lancerRequete.call(this);
}
function _lancerRequete() {
	new ObjetRequeteRencontres(
		this,
		_surReponseRequeteRencontres.bind(this, this.sessionSelectionne),
	).lancerRequete(this.sessionSelectionne);
}
function _surReponseRequeteRencontres(aSessionRencontre, aJSON) {
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
			const lListeOnglet = new ObjetListeElements();
			const lElementDesiderata = new ObjetElement(
				GTraductions.getValeur("Rencontres.Onglet.Desiderata"),
				null,
				this.TypeOnglet.DESIDERATA,
			);
			lElementDesiderata.idDiv = this.getInstance(
				this.ObjetRencontresDesiderata,
			).getNom();
			const lElementPlanning = new ObjetElement(
				GTraductions.getValeur("Rencontres.Onglet.Planning"),
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
function _surEvenementObjetTabs(aOngletSelectionne) {
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
module.exports = ObjetAffichagePageRencontres_Mobile;
