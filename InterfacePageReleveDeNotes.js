exports.InterfacePageReleveDeNotes = void 0;
const PageReleveDeNotes_1 = require("PageReleveDeNotes");
const ObjetRequetePageReleve_1 = require("ObjetRequetePageReleve");
const ObjetHtml_1 = require("ObjetHtml");
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSelection_1 = require("ObjetSelection");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Message_1 = require("Enumere_Message");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const AccessApp_1 = require("AccessApp");
class InterfacePageReleveDeNotes extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	constructor() {
		super(...arguments);
		this.appScoMobile = (0, AccessApp_1.getApp)();
		this.etatUtilScoMobile = this.appScoMobile.getEtatUtilisateur();
		this.listePeriodes = new ObjetListeElements_1.ObjetListeElements();
		this.periodeCourant = new ObjetElement_1.ObjetElement();
		this.indiceParDefaut = 0;
		this.moteur = new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
		this.avecGestionAccuseReception =
			[Enumere_Espace_1.EGenreEspace.Mobile_Parent].includes(
				this.etatUtilScoMobile.GenreEspace,
			) &&
			this.appScoMobile.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionARBulletins,
			);
		this.aCopier = {};
	}
	construireInstances() {
		this.identSelection = this.add(
			ObjetSelection_1.ObjetSelection,
			this.evenementSelection,
			_initSelecteur.bind(this),
		);
		this.identPage = this.add(PageReleveDeNotes_1.ObjetReleveDeNotes);
		this.AddSurZone = [this.identSelection];
		if (this.avecGestionAccuseReception) {
			this.AddSurZone.push({ html: _getHtmlCBAccuseReception.call(this) });
		}
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			visibiliteAR: function () {
				const lResponsableAR = aInstance._getResponsableAccuseReception();
				return aInstance.avecGestionAccuseReception && !!lResponsableAR;
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
						aInstance.moteur.saisieAR({ periode: aInstance.periodeCourant });
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
	recupererDonnees() {
		const lOngletInfosPeriodes =
			this.etatUtilScoMobile.getOngletInfosPeriodes();
		let lNrPeriodeParDefaut;
		if (
			!(
				lOngletInfosPeriodes.listePeriodes &&
				lOngletInfosPeriodes.listePeriodes.count()
			)
		) {
			const lGenreMessage =
				Enumere_Message_1.EGenreMessage.AucunRelevePourEleve;
			const lMessage =
				typeof lGenreMessage === "number"
					? ObjetTraduction_1.GTraductions.getValeur("Message")[lGenreMessage]
					: lGenreMessage;
			ObjetHtml_1.GHtml.setHtml(this.Nom, this.composeAucuneDonnee(lMessage));
		} else {
			this.listePeriodes = lOngletInfosPeriodes.listePeriodes;
			if (this.etatUtilScoMobile.getPeriodePourReleve()) {
				lNrPeriodeParDefaut = this.etatUtilScoMobile.getPeriodePourReleve();
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
						"#" + this.getNomInstance(this.identSelection).escapeJQ(),
					).height()) *
					0.9 +
					"px",
			);
		}
		if (this.etatUtilScoMobile.getPeriodePourReleve()) {
			this.etatUtilScoMobile.setPeriodePourReleve(null);
		}
	}
	recupererDonneesReleve() {
		new ObjetRequetePageReleve_1.ObjetRequetePageReleve(
			this,
			this.actionSurRecupererReleve,
		).lancerRequete({
			numeroEleve: this.etatUtilScoMobile.getMembre().getNumero(),
			genrePeriode: this.periodeCourant.getGenre(),
			numeroPeriode: this.periodeCourant.getNumero(),
		});
	}
	actionSurRecupererReleve(aParam) {
		$.extend(this.aCopier, aParam.aCopier);
		this.donneesAbsences = aParam.absences;
		this.listeAccusesReception = aParam.listeAccusesReception;
		if (!!aParam.Message) {
			this.getInstance(this.identPage).setMessage(aParam.Message);
		} else if (!this.aCopier.ExisteDevoir) {
			this.getInstance(this.identPage).setMessage(
				ObjetTraduction_1.GTraductions.getValeur("Message")[9],
			);
		} else {
			this.getInstance(this.identPage).setDonnees(
				this.aCopier.ListeElements,
				this.aCopier.MoyenneGenerale,
				this.donneesAbsences,
				this.aCopier.PiedDePage,
				this.aCopier.Affichage,
				this.positionPeriodeCourant,
				this.listePeriodes.count() - 1,
				this.periodeCourant,
			);
		}
	}
	evenementSelection(aParam) {
		this.periodeCourant = aParam.element;
		this.positionPeriodeCourant = this.listePeriodes.getIndiceParElement(
			this.periodeCourant,
		);
		this.recupererDonneesReleve();
	}
}
exports.InterfacePageReleveDeNotes = InterfacePageReleveDeNotes;
function _getHtmlCBAccuseReception() {
	const lHtml = [];
	lHtml.push(
		'<div class="p-all">',
		'<ie-checkbox class="AlignementMilieuVertical" ie-model="cbAccuseReception" ie-display="visibiliteAR">',
		ObjetTraduction_1.GTraductions.getValeur(
			"BulletinEtReleve.JAiPrisConnaissanceDuReleve",
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
