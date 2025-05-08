const {
	ObjetRequeteSessionRencontres,
} = require("ObjetRequeteSessionRencontres.js");
const ObjetRequeteRencontres = require("ObjetRequeteRencontres.js");
const ObjetRequeteSaisieRencontreDesiderata = require("ObjetRequeteSaisieRencontreDesiderata.js");
const DonneesListe_RencontresDesiderata = require("DonneesListe_RencontresDesiderata.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EGenreSaisie } = require("Enumere_Saisie.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { GDate } = require("ObjetDate.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
const ObjetSaisieIndisponibilite = require("ObjetSaisieIndisponibilite.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { InterfacePage } = require("InterfacePage.js");
const { TUtilitaireRencontre } = require("UtilitaireRencontres.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GUID } = require("GUID.js");
class InterfaceRencontreDesiderata extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.idMessage = this.Nom + "_Message";
		this.idInformation = GUID.getId();
		this.afficherTitreRubrique = true;
		this.donnees = { libelleBandeau: "" };
		this.nombreVoeuxNonRenseigne = 0;
	}
	construireInstances() {
		this.idComboSession = this.add(
			ObjetSaisie,
			_evenementSurComboSessions.bind(this),
			_initialiserComboSessions,
		);
		this.identPage = this.add(
			ObjetListe,
			_evenementListeRencontres.bind(this),
			_initialiserListeRencontres,
		);
		this.identIndisponibilite = this.add(
			ObjetSaisieIndisponibilite,
			_evenementSaisieIndispo.bind(this),
		);
	}
	setParametresGeneraux() {
		this.GenreStructure = EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone = [this.idComboSession];
		this.AddSurZone.push({
			html: '<span class="Gras" ie-html="getLibelleBandeau"></span>',
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getLibelleBandeau: function () {
				return aInstance.donnees.libelleBandeau;
			},
			information: {
				getDisplay: function () {
					return !!aInstance.information;
				},
				getHtml: function () {
					return aInstance.information ? `${aInstance.information}` : "";
				},
			},
			btnLegende: {
				event: function () {
					if (
						aInstance.desiderata &&
						aInstance.desiderata.autorisations &&
						aInstance.desiderata.autorisations.listeVoeux
					) {
						TUtilitaireRencontre.ouvrirFenetreLegende(
							aInstance.desiderata.autorisations.listeVoeux,
						);
					}
				},
				getDisplay: function () {
					return (
						aInstance.desiderata &&
						aInstance.desiderata.autorisations &&
						aInstance.desiderata.autorisations.listeVoeux &&
						aInstance.desiderata.listeRencontres &&
						aInstance.desiderata.listeRencontres.count() > 0
					);
				},
			},
			getNombreNonRenseigne: function () {
				if (aInstance.donnees && aInstance.donnees.listeRencontres) {
					const lNombreVoeuxNonRenseigne = aInstance.donnees.listeRencontres
						.getListeElements((aRencontre) => {
							return !aRencontre.estUnDeploiement && !aRencontre.validationvoeu;
						})
						.count();
					return GTraductions.getValeur("Rencontres.desiderata.NonRenseignes", [
						lNombreVoeuxNonRenseigne,
					]);
				}
				return "";
			},
			disponibilite: {
				getDisplay: function () {
					return (
						!!aInstance.indisponibilites &&
						aInstance.indisponibilites.avecSaisie &&
						aInstance.afficherTitreRubrique
					);
				},
			},
			desiderata: {
				getDisplay: function () {
					return !!aInstance.desiderata && aInstance.afficherTitreRubrique;
				},
			},
		});
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			'<div class="FondBlanc PageDesiderataIndisponibilite flex-contain cols full-height">',
		);
		H.push(
			'<p class="m-left-l m-top-l" ie-html="information.getHtml" ie-display="information.getDisplay"></p>',
		);
		H.push(
			`<h2 class="m-left-l ie-titre" ie-display="disponibilite.getDisplay">${GTraductions.getValeur("Rencontres.MesDisponibilites")}</h2>`,
		);
		H.push(
			'<div id="',
			this.getNomInstance(this.identIndisponibilite),
			'"></div>',
		);
		H.push(
			`<h2 class="m-left-l ie-titre" ie-display="desiderata.getDisplay">${GTraductions.getValeur("Rencontres.PriorisationRencontres")}</h2>`,
		);
		H.push(
			`<div id="${this.idInformation}" class="flex-contain justify-between m-all-l" ><div ie-html="getNombreNonRenseigne"></div><ie-btnicon class="icon icon_legende i-large avecFond" ie-model="btnLegende" ie-display="btnLegende.getDisplay" title="${GTraductions.getValeur("Legende")}"></ie-btnicon></div>`,
		);
		H.push(
			'<div style="width:72rem" class="fluid-bloc" id="' +
				this.getInstance(this.identPage).getNom() +
				'"></div>',
		);
		H.push(
			'<div id="' +
				this.idMessage +
				'" class="interface_affV_client Gras EspaceHaut AlignementMilieu"></div>',
		);
		H.push("</div>");
		return H.join("");
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
			);
		if (!lListeSessionsRencontre || lListeSessionsRencontre.count() === 0) {
			this.getInstance(this.idComboSession).setVisible(false);
			_afficherRecapitulatif.bind(this)(
				false,
				GTraductions.getValeur("Rencontres.aucuneSession"),
			);
		} else {
			lListeSessionsRencontre.setTri([
				ObjetTri.init("date"),
				ObjetTri.init("Libelle"),
			]);
			lListeSessionsRencontre.trier();
			this.getInstance(this.idComboSession).setVisible(true);
			let lIndiceSession;
			const lSessionRencontre = GEtatUtilisateur.getOnglet().sessionRencontre;
			if (!!lSessionRencontre) {
				lIndiceSession =
					lListeSessionsRencontre.getIndiceParElement(lSessionRencontre);
			} else {
				lIndiceSession =
					TUtilitaireRencontre.chercherIndiceSessionProchaineSession(
						lListeSessionsRencontre,
					);
			}
			this.getInstance(this.idComboSession).setDonnees(
				lListeSessionsRencontre,
				lIndiceSession,
			);
			_afficherRecapitulatif.bind(this)(lIndiceSession !== undefined);
		}
	}
	afficherPage() {
		this.setEtatSaisie(false);
		if (!!this.desiderata && this.desiderata.listeRencontres) {
			this.desiderata.listeRencontres.parcourir((D) => {
				D.setEtat(EGenreEtat.Aucun);
			});
		}
	}
	valider(aRencontres) {
		new ObjetRequeteSaisieRencontreDesiderata(
			this,
			this.actionSurValidation,
		).lancerRequete({
			session: GEtatUtilisateur.getOnglet().sessionRencontre,
			listeRencontres: aRencontres,
		});
	}
}
function _initialiserListeRencontres(aInstance) {
	aInstance.setOptionsListe({
		skin: ObjetListe.skin.flatDesign,
		messageContenuVide: GTraductions.getValeur("Rencontres.aucuneRencontre"),
		avecOmbreDroite: false,
		avecFondBlanc: true,
	});
}
function _evenementListeRencontres(aParams) {
	switch (aParams.genreEvenement) {
		case EGenreEvenementListe.ApresEdition: {
			const lListeRencontres = new ObjetListeElements();
			lListeRencontres.add(aParams.article);
			this.valider(lListeRencontres);
			break;
		}
	}
}
function _evenementSaisieIndispo() {
	_lancerRequete.call(this);
}
function _afficherRecapitulatif(aAfficher, aMessage) {
	this.afficherTitreRubrique = aAfficher;
	if (aAfficher) {
		$("#" + this.getInstance(this.identPage).getNom().escapeJQ()).show();
		$("#" + this.idInformation.escapeJQ()).show();
		$("#" + this.idMessage.escapeJQ()).hide();
	} else {
		aMessage = aMessage
			? aMessage
			: GTraductions.getValeur("Rencontres.selectionnerSession");
		$("#" + this.getInstance(this.identPage).getNom().escapeJQ()).hide();
		$("#" + this.idInformation.escapeJQ()).hide();
		$("#" + this.idMessage.escapeJQ())
			.html(aMessage)
			.show();
	}
	this.surResizeInterface();
}
function _getListeVoeuxDisponiblesPourLaSession(aSession) {
	let lListeVoeux;
	if (!!aSession && !!aSession.autorisations) {
		lListeVoeux = aSession.autorisations.listeVoeux;
	}
	return lListeVoeux;
}
function _initialiserComboSessions(aInstance) {
	aInstance.setOptionsObjetSaisie({
		mode: EGenreSaisie.Combo,
		longueur: 220,
		avecBouton: true,
		labelWAICellule: GTraductions.getValeur("WAI.SelectionSessionRencontre"),
	});
	aInstance.setControleNavigation(true);
}
function _evenementSurComboSessions(aParams) {
	switch (aParams.genreEvenement) {
		case EGenreEvenementObjetSaisie.selection:
			GEtatUtilisateur.getOnglet().sessionRencontre = aParams.element;
			_lancerRequete.call(this);
			break;
		default:
			break;
	}
}
function _lancerRequete() {
	new ObjetRequeteRencontres(
		this,
		_surReponseRequeteRencontreDesiderata.bind(this),
	).lancerRequete(GEtatUtilisateur.getOnglet().sessionRencontre);
}
function _surReponseRequeteRencontreDesiderata(aJSONSession) {
	this.desiderata = aJSONSession.desiderata;
	this.indisponibilites = aJSONSession.indisponibilites;
	this.autorisations = aJSONSession.autorisations;
	this.donnees.libelleBandeau = "";
	this.information = aJSONSession.information;
	if (aJSONSession.Message) {
		_afficherRecapitulatif.call(this, false, aJSONSession.Message);
	} else {
		if (this.desiderata) {
			_initialiserDesiderata.call(this);
		}
		if (this.indisponibilites && this.indisponibilites.avecSaisie) {
			$(
				"#" + this.getInstance(this.identIndisponibilite).getNom().escapeJQ(),
			).show();
			this.getInstance(this.identIndisponibilite).setDonnees({
				indisponibilites: this.indisponibilites,
				session: GEtatUtilisateur.getOnglet().sessionRencontre,
			});
		} else {
			$(
				"#" + this.getInstance(this.identIndisponibilite).getNom().escapeJQ(),
			).hide();
		}
	}
}
function _initialiserDesiderata() {
	const lListeVoeux = _getListeVoeuxDisponiblesPourLaSession(this.desiderata);
	const lDateCourante = GDate.getDateCourante();
	let lLibelle = "";
	if (
		this.autorisations &&
		(this.autorisations.saisieDesiderata ||
			this.autorisations.saisieDisponibilite)
	) {
		if (lDateCourante < this.desiderata.dateDebutSaisie) {
			_afficherRecapitulatif.bind(this)(
				false,
				GTraductions.getValeur("Rencontres.desiderata.saisieEntre", [
					GDate.formatDate(this.desiderata.dateDebutSaisie, "%JJ/%MM/%AAAA"),
					GDate.formatDate(this.desiderata.dateFinSaisie, "%JJ/%MM/%AAAA"),
				]),
			);
		} else if (
			lDateCourante >= this.desiderata.dateDebutSaisie &&
			lDateCourante <= this.desiderata.dateFinSaisie
		) {
			lLibelle += GTraductions.getValeur("Rencontres.desiderata.saisieJusquA", [
				GDate.formatDate(this.desiderata.dateFinSaisie, "%JJ/%MM/%AAAA"),
			]);
			_afficherRecapitulatif.bind(this)(true);
		} else if (lDateCourante > this.desiderata.dateFinSaisie) {
			lLibelle += GTraductions.getValeur(
				"Rencontres.desiderata.saisieCloturee",
			);
			_afficherRecapitulatif.bind(this)(true);
		}
	} else {
		lLibelle = GTraductions.getValeur(
			"Rencontres.desiderata.saisieParametrage",
		);
	}
	if (!!lListeVoeux && lListeVoeux.count() > 0) {
		this.donnees.libelleBandeau = lLibelle;
	} else {
		this.donnees.libelleBandeau = GTraductions.getValeur(
			"Rencontres.desiderata.saisieParametrage",
		);
	}
	let lListeRencontres;
	if (GEtatUtilisateur.GenreEspace === EGenreEspace.Parent) {
		this.desiderata.listeRencontres.setTri([
			ObjetTri.init((D) => {
				return D.strMatiereFonction || "";
			}),
		]);
		this.desiderata.listeRencontres.trier();
		lListeRencontres =
			TUtilitaireRencontre.formaterListeRencontresAvecProfesseurs(
				this.desiderata.listeRencontres,
			);
	} else {
		this.desiderata.listeRencontres.setTri([
			ObjetTri.init((D) => {
				return D.classe.getLibelle();
			}),
			ObjetTri.init((D) => {
				return D.eleve.getLibelle();
			}),
			ObjetTri.init((D) => {
				return D.eleve.getNumero();
			}),
			ObjetTri.init((D) => {
				return D.strMatiereFonction || "";
			}),
			ObjetTri.init((D) => {
				return D.strResponsables || "";
			}),
		]);
		this.desiderata.listeRencontres.trier();
		lListeRencontres = TUtilitaireRencontre.formaterListeRencontresAvecParents(
			this.desiderata.listeRencontres,
		);
	}
	this.donnees.listeRencontres = lListeRencontres;
	const lAvecEleve = GEtatUtilisateur.GenreEspace !== EGenreEspace.Parent;
	this.surResizeInterface();
	this.$refreshSelf().then(() => {
		this.getInstance(this.identPage).setDonnees(
			new DonneesListe_RencontresDesiderata(lListeRencontres, {
				avecEleve: lAvecEleve,
				autorisations: this.desiderata.autorisations,
				avecSaisie: this.desiderata.avecSaisie,
				callbackDuree: _modifierDuree.bind(this),
			}),
			null,
			{ conserverPositionScroll: true },
		);
	});
}
function _modifierDuree(aRencontre) {
	const lListeRencontres = new ObjetListeElements();
	lListeRencontres.add(aRencontre);
	this.valider(lListeRencontres);
	_initialiserDesiderata.call(this);
}
module.exports = InterfaceRencontreDesiderata;
