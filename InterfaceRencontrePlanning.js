const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const {
	ObjetRequeteRencontrePlanning,
} = require("ObjetRequeteRencontrePlanning.js");
const {
	ObjetRequeteSessionRencontres,
} = require("ObjetRequeteSessionRencontres.js");
const {
	DonneesListe_RencontresPlanning,
} = require("DonneesListe_RencontresPlanning.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { Requetes } = require("CollectionRequetes.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { EGenreSaisie } = require("Enumere_Saisie.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { GObjetWAI, EGenreAttribut } = require("ObjetWAI.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { InterfacePage } = require("InterfacePage.js");
const { TUtilitaireRencontre } = require("UtilitaireRencontres.js");
Requetes.inscrire("SaisieRencontreAEuLieu", ObjetRequeteSaisie);
class InterfaceRencontrePlanning extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.avecRencontreNonPlacee = false;
		this.idMessage = this.Nom + "_Message";
	}
	construireInstances() {
		this.genreOnglet = GEtatUtilisateur.getGenreOnglet();
		this.idComboSession = this.add(
			ObjetSaisie,
			_evenementSurComboSessions.bind(this),
			_initialiserComboSessions,
		);
		this.identPage = this.add(
			ObjetListe,
			_evenementListe.bind(this),
			_initialiserListe.bind(this),
		);
	}
	setParametresGeneraux() {
		this.GenreStructure = EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone = [];
		this.AddSurZone.push(this.idComboSession);
		this.AddSurZone.push({
			html:
				'<ie-checkbox class="Gras" ie-model="checkAfficherNonPlanifiees" ie-display="avecCBAfficherNonPlanifiees">' +
				GTraductions.getValeur("Rencontres.afficherNonPlanifiees") +
				"</ie-checkbox>",
		});
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push('<div class="Espace full-height">');
		H.push(
			'<div style="max-width: 80rem" class="full-height" id="',
			this.getInstance(this.identPage).getNom(),
			'"></div>',
		);
		H.push(
			'<div id="' +
				this.idMessage +
				'" tabindex="0" "' +
				GObjetWAI.composeAttribut({
					genre: EGenreAttribut.labelledby,
					valeur: this.idMessage,
				}) +
				'" class="interface_affV_client Gras EspaceHaut AlignementMilieu"></div>',
		);
		H.push("</div>");
		return H.join("");
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			avecCBAfficherNonPlanifiees: function () {
				return (
					GEtatUtilisateur.GenreEspace !== EGenreEspace.Parent &&
					aInstance.genreOnglet === EGenreOnglet.Rencontre_Planning_Liste &&
					aInstance._session &&
					aInstance._session.listeRencontres
				);
			},
			checkAfficherNonPlanifiees: {
				getValue: function () {
					return !!aInstance.avecRencontreNonPlacee;
				},
				setValue: function (aValeur) {
					aInstance.avecRencontreNonPlacee = aValeur;
					if (aInstance.genreOnglet === EGenreOnglet.Rencontre_Planning_Liste) {
						const lInstanceListe = aInstance.getInstance(aInstance.identPage);
						lInstanceListe.getDonneesListe().setAvecRencontreNonPlacee(aValeur);
						lInstanceListe.actualiser(true);
					}
				},
			},
		});
	}
	recupererDonnees() {
		new ObjetRequeteSessionRencontres(
			this,
			this.actionSurRecupererDonnees,
		).lancerRequete();
	}
	actionSurRecupererDonnees(aParams) {
		let lIndiceSession;
		const lListeSessionsRencontre =
			TUtilitaireRencontre.formaterListeSessionsRencontrePourCombo(
				aParams.listeSessions,
			);
		if (!lListeSessionsRencontre || lListeSessionsRencontre.count() === 0) {
			this.getInstance(this.idComboSession).setVisible(false);
			_afficherPage.bind(this)(
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
			if (GEtatUtilisateur.jeton_notifRencontre) {
				GEtatUtilisateur.getOnglet().sessionRencontre =
					GEtatUtilisateur.jeton_notifRencontre;
				delete GEtatUtilisateur.jeton_notifRencontre;
			}
			if (GEtatUtilisateur.getOnglet().sessionRencontre) {
				lIndiceSession = lListeSessionsRencontre.getIndiceParElement(
					GEtatUtilisateur.getOnglet().sessionRencontre,
				);
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
			_afficherPage.bind(this)(lIndiceSession !== undefined);
		}
	}
	afficherPage() {
		this.setEtatSaisie(false);
		this.recupererDonnees();
	}
	getPageImpression(aProportion) {
		const H = [];
		if (this.getInstance(this.identPage)) {
			H.push(this.getInstance(this.identPage).composeImpression(aProportion));
		}
		const lTitre = GTraductions.getValeur("Rencontres.planningDeLaSession", [
			GEtatUtilisateur.getOnglet().sessionRencontre.getLibelle(),
		]);
		return { titre1: lTitre, contenu: H.join("") };
	}
}
function _initialiserComboSessions(aInstance) {
	aInstance.setOptionsObjetSaisie({
		mode: EGenreSaisie.Combo,
		longueur: 260,
		avecBouton: true,
		labelWAICellule: GTraductions.getValeur("WAI.SelectionSessionRencontre"),
	});
	aInstance.setControleNavigation(true);
}
function _afficherPage(aAfficher, aMessage) {
	if (aAfficher) {
		$("#" + this.getInstance(this.identPage).getNom().escapeJQ()).show();
		$("#" + this.idMessage.escapeJQ()).hide();
	} else {
		aMessage = aMessage
			? aMessage
			: GTraductions.getValeur("Rencontres.selectionnerSession");
		$("#" + this.getInstance(this.identPage).getNom().escapeJQ()).hide();
		$("#" + this.idMessage.escapeJQ())
			.html(aMessage)
			.show();
	}
	this.surResizeInterface();
}
function _evenementSurComboSessions(aParams) {
	switch (aParams.genreEvenement) {
		case EGenreEvenementObjetSaisie.selection:
			GEtatUtilisateur.getOnglet().sessionRencontre = aParams.element;
			new ObjetRequeteRencontrePlanning(
				this,
				_surReponseRequeteRencontrePlanning,
			).lancerRequete(aParams.element);
			break;
		default:
			break;
	}
}
function _initialiserListe(aInstance) {
	aInstance.setOptionsListe({
		colonnes: [{ taille: "100%" }],
		skin: ObjetListe.skin.flatDesign,
		messageContenuVide: GTraductions.getValeur("Rencontres.aucuneRencontre"),
		avecOmbreDroite: false,
		avecFondBlanc: true,
	});
}
function _evenementListe(aRencontre) {
	if (aRencontre) {
		const lJSON = aRencontre.toJSONAll();
		Requetes(
			"SaisieRencontreAEuLieu",
			this,
			this.actionSurValidation,
		).lancerRequete({ rencontre: lJSON });
	}
}
function _surReponseRequeteRencontrePlanning(aJSONSession) {
	this._session = aJSONSession;
	if (
		this._session &&
		(this._session.messageNonPublie || this._session.Message)
	) {
		_afficherPage.bind(this)(
			false,
			this._session.messageNonPublie || this._session.Message,
		);
		Invocateur.evenement(
			ObjetInvocateur.events.activationImpression,
			EGenreImpression.Aucune,
		);
	} else {
		_afficherPage.bind(this)(true);
		const lDonneesListe = new DonneesListe_RencontresPlanning(
			this._session.listeRencontres,
			this.avecRencontreNonPlacee,
			{ callbackVisio: _validerVisio.bind(this) },
		);
		this.getInstance(this.identPage).setDonnees(lDonneesListe, null, {
			conserverPositionScroll: true,
		});
		this.getInstance(this.identPage).actualiser();
	}
}
function _validerVisio(aVisio, aRencontre) {
	if (aVisio.lienVisio) {
		const lJSONRencontre = aRencontre.toJSONAll();
		const lJSONVisio = aVisio.lienVisio.toJSONAll();
		Requetes(
			"SaisieRencontreAEuLieu",
			this,
			this.actionSurValidation,
		).lancerRequete({ rencontre: lJSONRencontre, visio: lJSONVisio });
	}
}
module.exports = { InterfaceRencontrePlanning };
