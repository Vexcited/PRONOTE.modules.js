exports.InterfaceRencontrePlanning = void 0;
const ObjetRequeteRencontrePlanning_1 = require("ObjetRequeteRencontrePlanning");
const ObjetRequeteSessionRencontres_1 = require("ObjetRequeteSessionRencontres");
const DonneesListe_RencontresPlanning_1 = require("DonneesListe_RencontresPlanning");
const Invocateur_1 = require("Invocateur");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const Enumere_Saisie_1 = require("Enumere_Saisie");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetListe_1 = require("ObjetListe");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ObjetWAI_1 = require("ObjetWAI");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const InterfacePage_1 = require("InterfacePage");
const UtilitaireRencontres_1 = require("UtilitaireRencontres");
const AccessApp_1 = require("AccessApp");
const ObjetRequeteSaisieRencontreAEuLieu_1 = require("ObjetRequeteSaisieRencontreAEuLieu");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const TypeEtatCours_1 = require("TypeEtatCours");
class InterfaceRencontrePlanning extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.etatUtilScoEspace = (0, AccessApp_1.getApp)().getEtatUtilisateur();
		this.avecRencontreNonPlacee = false;
		this.idMessage = this.Nom + "_Message";
	}
	construireInstances() {
		this.genreOnglet = this.etatUtilScoEspace.getGenreOnglet();
		this.idComboSession = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._evenementSurComboSessions.bind(this),
			this._initialiserComboSessions,
		);
		this.identPage = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this._initialiserListe.bind(this),
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone = [];
		this.AddSurZone.push(this.idComboSession);
		this.AddSurZone.push({
			html:
				'<ie-checkbox class="Gras" ie-model="checkAfficherNonPlanifiees" ie-display="avecCBAfficherNonPlanifiees">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"Rencontres.afficherNonPlanifiees",
				) +
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
				ObjetWAI_1.GObjetWAI.composeAttribut({
					genre: ObjetWAI_1.EGenreAttribut.labelledby,
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
				return !!(
					aInstance.etatUtilScoEspace.GenreEspace !==
						Enumere_Espace_1.EGenreEspace.Parent &&
					aInstance.genreOnglet ===
						Enumere_Onglet_1.EGenreOnglet.Rencontre_Planning_Liste &&
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
					if (
						aInstance.genreOnglet ===
						Enumere_Onglet_1.EGenreOnglet.Rencontre_Planning_Liste
					) {
						const lInstanceListe = aInstance.getInstance(aInstance.identPage);
						lInstanceListe.getDonneesListe().setAvecRencontreNonPlacee(aValeur);
						aInstance.actualiserListe(true);
					}
				},
			},
		});
	}
	recupererDonnees() {
		new ObjetRequeteSessionRencontres_1.ObjetRequeteSessionRencontres(
			this,
			this.actionSurRecupererDonnees,
		).lancerRequete();
	}
	actionSurRecupererDonnees(aParams) {
		let lIndiceSession;
		const lListeSessionsRencontre =
			UtilitaireRencontres_1.TUtilitaireRencontre.formaterListeSessionsRencontrePourCombo(
				aParams.listeSessions,
			);
		if (!lListeSessionsRencontre || lListeSessionsRencontre.count() === 0) {
			this.getInstance(this.idComboSession).setVisible(false);
			this._afficherPage(
				false,
				ObjetTraduction_1.GTraductions.getValeur("Rencontres.aucuneSession"),
			);
		} else {
			lListeSessionsRencontre.setTri([
				ObjetTri_1.ObjetTri.init("date"),
				ObjetTri_1.ObjetTri.init("Libelle"),
			]);
			lListeSessionsRencontre.trier();
			this.getInstance(this.idComboSession).setVisible(true);
			if (this.etatUtilScoEspace.jeton_notifRencontre) {
				this.etatUtilScoEspace.getOnglet().sessionRencontre =
					this.etatUtilScoEspace.jeton_notifRencontre;
				delete this.etatUtilScoEspace.jeton_notifRencontre;
			}
			if (this.etatUtilScoEspace.getOnglet().sessionRencontre) {
				lIndiceSession = lListeSessionsRencontre.getIndiceParElement(
					this.etatUtilScoEspace.getOnglet().sessionRencontre,
				);
			} else {
				lIndiceSession =
					UtilitaireRencontres_1.TUtilitaireRencontre.chercherIndiceSessionProchaineSession(
						lListeSessionsRencontre,
					);
			}
			this.getInstance(this.idComboSession).setDonnees(
				lListeSessionsRencontre,
				lIndiceSession,
			);
			this._afficherPage(lIndiceSession !== undefined);
		}
	}
	afficherPage() {
		this.setEtatSaisie(false);
		this.recupererDonnees();
	}
	_initialiserComboSessions(aInstance) {
		aInstance.setOptionsObjetSaisie({
			mode: Enumere_Saisie_1.EGenreSaisie.Combo,
			longueur: 260,
			avecBouton: true,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.SelectionSessionRencontre",
			),
		});
		aInstance.setControleNavigation(true);
	}
	_afficherPage(aAfficher, aMessage) {
		if (aAfficher) {
			$("#" + this.getInstance(this.identPage).getNom().escapeJQ()).show();
			$("#" + this.idMessage.escapeJQ()).hide();
		} else {
			aMessage = aMessage
				? aMessage
				: ObjetTraduction_1.GTraductions.getValeur(
						"Rencontres.selectionnerSession",
					);
			$("#" + this.getInstance(this.identPage).getNom().escapeJQ()).hide();
			$("#" + this.idMessage.escapeJQ())
				.html(aMessage)
				.show();
		}
		this.surResizeInterface();
	}
	_evenementSurComboSessions(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection:
				this.etatUtilScoEspace.getOnglet().sessionRencontre = aParams.element;
				new ObjetRequeteRencontrePlanning_1.ObjetRequeteRencontrePlanning(
					this,
					this._surReponseRequeteRencontrePlanning,
				).lancerRequete(aParams.element);
				break;
			default:
				break;
		}
	}
	_initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			colonnes: [{ taille: "100%" }],
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
				"Rencontres.aucuneRencontre",
			),
			avecOmbreDroite: false,
		});
	}
	actualiserListe(aConserverSelection) {
		this.getInstance(this.identPage).actualiser(aConserverSelection);
		const lListeRencontresPlanifie =
			this._session.listeRencontres.getListeElements(function (aElement) {
				return (
					aElement.etat === TypeEtatCours_1.TypeEtatCours.Impose ||
					aElement.etat === TypeEtatCours_1.TypeEtatCours.Pose
				);
			});
		if (
			(lListeRencontresPlanifie === null || lListeRencontresPlanifie === void 0
				? void 0
				: lListeRencontresPlanifie.count()) > 0 ||
			this.avecRencontreNonPlacee
		) {
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
				this,
				this.getParametresPDF.bind(this),
			);
		} else {
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.Aucune,
			);
		}
	}
	getParametresPDF() {
		return {
			genreGenerationPDF:
				TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.RencontrePlanning,
			avecRencontreNonPlacee: this.avecRencontreNonPlacee,
			sessionRencontre: this.etatUtilScoEspace.getOnglet().sessionRencontre,
		};
	}
	_surReponseRequeteRencontrePlanning(aJSONSession) {
		this._session = aJSONSession;
		if (
			this._session &&
			(this._session.messageNonPublie || this._session.Message)
		) {
			this._afficherPage(
				false,
				this._session.messageNonPublie || this._session.Message,
			);
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.Aucune,
			);
		} else {
			this._afficherPage(true);
			const lDonneesListe =
				new DonneesListe_RencontresPlanning_1.DonneesListe_RencontresPlanning(
					this._session.listeRencontres,
					this.avecRencontreNonPlacee,
					{
						callback: (aRencontre, aVisio) => {
							new ObjetRequeteSaisieRencontreAEuLieu_1.ObjetRequeteSaisieRencontreAEuLieu(
								this,
								this.actionSurValidation,
							).lancerRequete({
								rencontre: aRencontre.toJSONAll(),
								visio: aVisio ? aVisio.lienVisio.toJSONAll() : undefined,
							});
						},
					},
				);
			this.getInstance(this.identPage).setDonnees(lDonneesListe, null, {
				conserverPositionScroll: true,
			});
			this.actualiserListe();
		}
	}
}
exports.InterfaceRencontrePlanning = InterfaceRencontrePlanning;
