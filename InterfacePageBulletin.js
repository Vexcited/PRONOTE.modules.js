const ObjetHtml_1 = require("ObjetHtml");
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSelection_1 = require("ObjetSelection");
const ObjetTraduction_1 = require("ObjetTraduction");
const PageBulletin_1 = require("PageBulletin");
const Enumere_Message_1 = require("Enumere_Message");
const ObjetRequetePageBulletins_1 = require("ObjetRequetePageBulletins");
const Enumere_Espace_1 = require("Enumere_Espace");
const MultiObjetRequeteSaisieAccuseReceptionDocument = require("ObjetRequeteSaisieAccuseReceptionDocument");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const AccessApp_1 = require("AccessApp");
class InterfacePageBulletin extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	constructor() {
		super(...arguments);
		this.appScoMobile = (0, AccessApp_1.getApp)();
		this.etatUtilScoMobile = this.appScoMobile.getEtatUtilisateur();
		this.estCtxBulletinClasse =
			this.etatUtilScoMobile.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.ConseilDeClasse;
		this.listePeriodes = new ObjetListeElements_1.ObjetListeElements();
		this.periodeCourant = new ObjetElement_1.ObjetElement();
		this.indiceParDefaut = 0;
		this.avecGestionAccuseReception =
			[Enumere_Espace_1.EGenreEspace.Mobile_Parent].includes(
				this.etatUtilScoMobile.GenreEspace,
			) &&
			this.appScoMobile.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionARBulletins,
			);
		this.aCopier = {};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			visibiliteAR: function () {
				const lResponsableAR = aInstance._getResponsableAccuseReception();
				return (
					!aInstance.avecMessage &&
					aInstance.avecGestionAccuseReception &&
					!aInstance.estCtxBulletinClasse &&
					!!lResponsableAR
				);
			},
			cbAccuseReception: {
				getValue: function () {
					const lResponsableAR = aInstance._getResponsableAccuseReception();
					return !!lResponsableAR ? lResponsableAR.aPrisConnaissance : false;
				},
				setValue: function (aValue) {
					const lResponsableAR = aInstance._getResponsableAccuseReception();
					if (!!lResponsableAR) {
						lResponsableAR.aPrisConnaissance = aValue;
						new MultiObjetRequeteSaisieAccuseReceptionDocument.ObjetRequeteSaisieAccuseReceptionDocument(
							aInstance,
						).lancerRequete({
							periode: aInstance.periodeCourant,
							aPrisConnaissance: aValue,
						});
					}
				},
				getDisabled: function () {
					const lResponsableAR = aInstance._getResponsableAccuseReception();
					return !!lResponsableAR ? lResponsableAR.aPrisConnaissance : true;
				},
			},
		});
	}
	_getResponsableAccuseReception() {
		let lReponsableAccuseReception = null;
		if (
			!!this.aCopier.listeAccusesReception &&
			this.aCopier.listeAccusesReception.count() > 0
		) {
			lReponsableAccuseReception =
				this.aCopier.listeAccusesReception.getPremierElement();
			if (!!lReponsableAccuseReception) {
			}
		}
		return lReponsableAccuseReception;
	}
	construireInstances() {
		this.identSelection = this.add(
			ObjetSelection_1.ObjetSelection,
			this.evenementSelection,
			_initSelecteur.bind(this),
		);
		this.identPage = this.add(PageBulletin_1.PageBulletinMobile);
		this.AddSurZone = [this.identSelection];
		if (this.avecGestionAccuseReception) {
			this.AddSurZone.push({ html: _getHtmlCBAccuseReception.call(this) });
		}
	}
	recupererDonnees() {
		const lOngletInfosPeriodes =
			this.etatUtilScoMobile.getOngletInfosPeriodes();
		let lNrPeriodeParDefaut;
		if (lOngletInfosPeriodes.message) {
			this.getInstance(this.identPage).setMessage(lOngletInfosPeriodes.message);
		} else {
			this.listePeriodes = lOngletInfosPeriodes.listePeriodes;
			if (!(this.listePeriodes && this.listePeriodes.count())) {
				const lGenreMessage =
					Enumere_Message_1.EGenreMessage.AucunBulletinPourEleve;
				const lMessage =
					typeof lGenreMessage === "number"
						? ObjetTraduction_1.GTraductions.getValeur("Message")[lGenreMessage]
						: lGenreMessage;
				ObjetHtml_1.GHtml.setHtml(this.Nom, this.composeAucuneDonnee(lMessage));
			} else {
				if (this.etatUtilScoMobile.getPeriodePourBulletin()) {
					lNrPeriodeParDefaut = this.etatUtilScoMobile.getPeriodePourBulletin();
				} else {
					lNrPeriodeParDefaut =
						this.etatUtilScoMobile.getPage() &&
						this.etatUtilScoMobile.getPage().periode
							? this.etatUtilScoMobile.getPage().periode.getNumero()
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
		if (this.etatUtilScoMobile.getPeriodePourBulletin()) {
			this.etatUtilScoMobile.setPeriodePourBulletin(null);
		}
	}
	recupererDonneesBulletin() {
		new ObjetRequetePageBulletins_1.ObjetRequetePageBulletins(
			this,
			this.actionSurRecupBulletin,
		).lancerRequete({ periode: this.periodeCourant });
	}
	actionSurRecupBulletin(aParam) {
		this.aCopier.graph = "";
		this.avecMessage = !!aParam.Message;
		if (this.avecMessage) {
			this.getInstance(this.identPage).setMessage(aParam.Message);
		} else {
			Object.assign(this.aCopier, aParam.aCopier);
			$.extend(this, aParam.aCopier);
			this.getInstance(this.identPage).setDonnees(
				this.aCopier.ListeElements,
				this.positionPeriodeCourant,
				this.listePeriodes.count() - 1,
				this.aCopier.tableauSurMatieres,
				this.aCopier.MoyenneGenerale,
				aParam.absences,
				this.aCopier.PiedDePage,
				this.aCopier.Affichage,
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
		'<ie-checkbox class="AlignementMilieuVertical" ie-model="cbAccuseReception" ie-display="visibiliteAR">',
		ObjetTraduction_1.GTraductions.getValeur(
			"BulletinEtReleve.JAiPrisConnaissanceDuBulletin",
		),
		"</ie-checkbox>",
		"</div>",
	);
	return lHtml.join("");
}
function _initSelecteur(aInstance) {
	aInstance.setParametres({
		labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
			"WAI.ListeSelectionPeriode",
		),
	});
}
module.exports = InterfacePageBulletin;
