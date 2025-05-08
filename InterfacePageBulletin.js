const { GHtml } = require("ObjetHtml.js");
const { InterfacePage_Mobile } = require("InterfacePage_Mobile.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetSelection } = require("ObjetSelection.js");
const { GTraductions } = require("ObjetTraduction.js");
const { PageBulletinMobile } = require("PageBulletin.js");
const { EGenreMessage } = require("Enumere_Message.js");
const { ObjetRequetePageBulletins } = require("ObjetRequetePageBulletins.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const ObjetRequeteSaisieAccuseReceptionDocument = require("ObjetRequeteSaisieAccuseReceptionDocument.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
class InterfacePageBulletin extends InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.estCtxBulletinClasse =
			GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.ConseilDeClasse;
		this.listePeriodes = new ObjetListeElements();
		this.periodeCourant = new ObjetElement();
		this.indiceParDefaut = 0;
		this.swipeActif = true;
		this.avecGestionAccuseReception =
			[EGenreEspace.Mobile_Parent].includes(GEtatUtilisateur.GenreEspace) &&
			GApplication.droits.get(TypeDroits.fonctionnalites.gestionARBulletins);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			visibiliteAR: function () {
				const lResponsableAR = this._getResponsableAccuseReception();
				return (
					!this.avecMessage &&
					this.avecGestionAccuseReception &&
					!this.estCtxBulletinClasse &&
					!!lResponsableAR
				);
			}.bind(aInstance),
			cbAccuseReception: {
				getValue: function () {
					const lResponsableAR = this._getResponsableAccuseReception();
					return !!lResponsableAR ? lResponsableAR.aPrisConnaissance : false;
				}.bind(aInstance),
				setValue: function (aValue) {
					const lResponsableAR = this._getResponsableAccuseReception();
					if (!!lResponsableAR) {
						lResponsableAR.aPrisConnaissance = aValue;
						new ObjetRequeteSaisieAccuseReceptionDocument(this).lancerRequete({
							periode: this.periodeCourant,
							aPrisConnaissance: aValue,
						});
					}
				}.bind(aInstance),
				getDisabled: function () {
					const lResponsableAR = this._getResponsableAccuseReception();
					return !!lResponsableAR ? lResponsableAR.aPrisConnaissance : true;
				}.bind(aInstance),
			},
		});
	}
	_getResponsableAccuseReception() {
		let lReponsableAccuseReception = null;
		if (
			!!this.listeAccusesReception &&
			this.listeAccusesReception.count() > 0
		) {
			lReponsableAccuseReception =
				this.listeAccusesReception.getPremierElement();
			if (!!lReponsableAccuseReception) {
			}
		}
		return lReponsableAccuseReception;
	}
	construireInstances() {
		this.identSelection = this.add(
			ObjetSelection,
			this.evenementSelection,
			_initSelecteur.bind(this),
		);
		this.identPage = this.add(PageBulletinMobile, null, function (aInstance) {
			aInstance.setSwipeActif = function (aActif) {
				this.swipeActif = aActif;
			}.bind(this);
		});
		this.AddSurZone = [this.identSelection];
		if (this.avecGestionAccuseReception) {
			this.AddSurZone.push({ html: _getHtmlCBAccuseReception.call(this) });
		}
	}
	detruireInstances() {}
	evenementSwipe(event) {
		if (this.swipeActif) {
			if (event.type === "swiperight") {
				this.getInstance(this.identSelection).surPrecedent();
			} else {
				this.getInstance(this.identSelection).surSuivant();
			}
		}
	}
	recupererDonnees() {
		const lOngletInfosPeriodes = GEtatUtilisateur.getOngletInfosPeriodes();
		let lNrPeriodeParDefaut;
		if (lOngletInfosPeriodes.message) {
			this.getInstance(this.identPage).setMessage(lOngletInfosPeriodes.message);
		} else {
			this.listePeriodes = lOngletInfosPeriodes.listePeriodes;
			if (!(this.listePeriodes && this.listePeriodes.count())) {
				const lGenreMessage = EGenreMessage.AucunBulletinPourEleve;
				const lMessage =
					typeof lGenreMessage === "number"
						? GTraductions.getValeur("Message")[lGenreMessage]
						: lGenreMessage;
				const lHtml = [];
				lHtml.push(this.composeAucuneDonnee(lMessage));
				GHtml.setHtml(this.Nom, lHtml);
			} else {
				if (GEtatUtilisateur.getPeriodePourBulletin()) {
					lNrPeriodeParDefaut = GEtatUtilisateur.getPeriodePourBulletin();
				} else {
					lNrPeriodeParDefaut =
						GEtatUtilisateur.getPage() && GEtatUtilisateur.getPage().periode
							? GEtatUtilisateur.getPage().periode.getNumero()
							: lOngletInfosPeriodes.periodeParDefaut.getNumero();
				}
				this.indiceParDefaut =
					this.listePeriodes.getIndiceParNumeroEtGenre(lNrPeriodeParDefaut);
				if (!this.indiceParDefaut) {
					this.indiceParDefaut = 0;
				}
				this.periodeCourant = this.listePeriodes.get(this.indiceParDefaut);
				this.getInstance(this.identSelection).setDonnees(
					this.listePeriodes,
					this.indiceParDefaut,
					this.getInstance(this.identPage).getNom(),
					"",
				);
				$("#" + this.getInstance(this.identPage).getNom().escapeJQ()).css(
					"min-height",
					(parseInt($("#" + this.Nom.escapeJQ()).css("min-height")) -
						$(
							"#" + this.getInstance(this.identSelection).getNom().escapeJQ(),
						).height()) *
						0.9 +
						"px",
				);
			}
		}
		if (GEtatUtilisateur.getPeriodePourBulletin()) {
			GEtatUtilisateur.setPeriodePourBulletin(null);
		}
	}
	recupererDonneesBulletin() {
		new ObjetRequetePageBulletins(
			this,
			this.actionSurRecupBulletin,
		).lancerRequete({ periode: this.periodeCourant });
	}
	actionSurRecupBulletin(aParam) {
		this.graph = "";
		this.avecMessage = !!aParam.Message;
		if (this.avecMessage) {
			this.getInstance(this.identPage).setMessage(aParam.Message);
		} else {
			$.extend(this, aParam.aCopier);
			this.getInstance(this.identPage).setDonnees(
				this.ListeElements,
				this.positionPeriodeCourant,
				this.listePeriodes.count() - 1,
				this.tableauSurMatieres,
				this.MoyenneGenerale,
				aParam.absences,
				this.PiedDePage,
				this.Affichage,
				this.periodeCourant,
			);
		}
		this.actionAppliMobile();
	}
	actionAppliMobile() {}
	evenementSelection(aParam) {
		this.periodeCourant = aParam.element;
		this.positionPeriodeCourant = this.listePeriodes.getIndiceParElement(
			this.periodeCourant,
		);
		this.recupererDonneesBulletin();
	}
}
function _getHtmlCBAccuseReception() {
	const lHtml = [];
	lHtml.push(
		'<div style="padding: 0.5rem;">',
		'<ie-checkbox ie-textright class="AlignementMilieuVertical" ie-model="cbAccuseReception" ie-display="visibiliteAR">',
		GTraductions.getValeur("BulletinEtReleve.JAiPrisConnaissanceDuBulletin"),
		"</ie-checkbox>",
		"</div>",
	);
	return lHtml.join("");
}
function _initSelecteur(aInstance) {
	aInstance.setParametres({
		labelWAICellule: GTraductions.getValeur("WAI.ListeSelectionPeriode"),
	});
}
module.exports = InterfacePageBulletin;
