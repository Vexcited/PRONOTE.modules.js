exports._InterfaceFicheBrevet = void 0;
const ObjetRequetePageFicheBrevet_1 = require("ObjetRequetePageFicheBrevet");
const GUID_1 = require("GUID");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const InterfacePage_1 = require("InterfacePage");
const Invocateur_1 = require("Invocateur");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_FicheBrevetCompetence_1 = require("DonneesListe_FicheBrevetCompetence");
const ObjetListe_1 = require("ObjetListe");
const TypeColonneControlContinuBrevet_1 = require("TypeColonneControlContinuBrevet");
const MethodesObjet_1 = require("MethodesObjet");
const TypeFusionTitreListe_1 = require("TypeFusionTitreListe");
const AccessApp_1 = require("AccessApp");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class _InterfaceFicheBrevet extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.idMessage = GUID_1.GUID.getId();
		this.donneesRecu = false;
		this.application = (0, AccessApp_1.getApp)();
		this.etatUtilisateur = this.application.getEtatUtilisateur();
		this.idPage = GUID_1.GUID.getId();
	}
	async requeteConsultation() {
		const lJsonReponse =
			await new ObjetRequetePageFicheBrevet_1.ObjetRequetePageFicheBrevet(
				this,
			).lancerRequete({ eleve: this.getEleve() });
		this.actionSurRecupererDonnees(lJsonReponse);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireInstances() {
		this.identListeCompetence = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this._initialiserCompetence.bind(this),
		);
		this.identListeControleContinu = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this.initListeControleContinu.bind(this),
		);
	}
	jsxDisplayCFG() {
		return this.estCFG;
	}
	jsxDisplayBrevet() {
		return !this.estCFG;
	}
	evenementAfficherMessage(aGenreMessage) {
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
		ObjetHtml_1.GHtml.setDisplay(this.idPage, false);
		ObjetHtml_1.GHtml.setDisplay(this.idMessage, true);
		this.afficherBandeau(true);
		const lMessage =
			typeof aGenreMessage === "number"
				? ObjetTraduction_1.GTraductions.getValeur("Message")[aGenreMessage]
				: aGenreMessage;
		ObjetHtml_1.GHtml.setHtml(this.idMessage, this.composeMessage(lMessage));
	}
	getHtmlListeCC() {
		return IE.jsx.str("div", {
			class: Divers_css_1.StylesDivers.mBottomXl,
			id: this.getNomInstance(this.identListeControleContinu),
			"ie-display": this.jsxDisplayBrevet.bind(this),
		});
	}
	initBrevet(aJSON) {
		this.listeControleContinu = aJSON.listeControleContinu;
		this.listeColonneesCC = aJSON.colonnees;
		const lInstanceListe = this.getInstance(this.identListeControleContinu);
		this.initListeControleContinu(lInstanceListe);
	}
	activerImpression() {
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
			this,
			() => {
				return {
					genreGenerationPDF:
						TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.FicheBrevet,
					eleve: this.getEleve(),
				};
			},
		);
	}
	initListeControleContinu(aInstance) {
		const lColonnes = [];
		if (this.listeColonneesCC) {
			MethodesObjet_1.MethodesObjet.enumKeys(
				TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet,
			).forEach((aKey) => {
				this.ajouterColonneCC(
					lColonnes,
					TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet[
						aKey
					],
				);
			});
		}
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			hauteurAdapteContenu: true,
			ariaLabel: () =>
				this.getAriaLabelListe(
					ObjetTraduction_1.GTraductions.getValeur(
						"FicheBrevet.ControleContinu",
					),
				),
		});
	}
	getAriaLabelListe(aNomListe) {
		const lLabel = [this.etatUtilisateur.getLibelleLongOnglet(), aNomListe];
		const lClass = this.etatUtilisateur.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
		if (lClass) {
			lLabel.push(lClass.getLibelle());
		}
		const lEleve = this.etatUtilisateur.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Eleve,
		);
		if (lEleve) {
			lLabel.push(lEleve.getLibelle());
		}
		return lLabel.join(" - ");
	}
	ajouterColonneCC(aListe = [], aGenre) {
		const lColonneDansListe = this.listeColonneesCC.getElementParFiltre(
			({ genreColonne }) => genreColonne === aGenre,
		);
		if (!lColonneDansListe) {
			return;
		}
		let lTitre = lColonneDansListe.titre;
		if (lColonneDansListe.nomGroupe) {
			const lEstPremier = !aListe.find((aColonne) => {
				return (
					Array.isArray(aColonne.titre) &&
					aColonne.titre.includes(lColonneDansListe.nomGroupe)
				);
			});
			lTitre = [
				lEstPremier
					? lColonneDansListe.nomGroupe
					: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
				lTitre,
			];
		} else if (
			[
				TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
					.tCCCB_MoyA,
			].includes(aGenre)
		) {
			lTitre = { nbLignes: 2, libelle: lColonneDansListe.titre };
		}
		const lColonne = {
			genreColonne: aGenre,
			id: TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet[
				aGenre
			],
			titre: lTitre,
			hint: lColonneDansListe.hint,
			taille:
				aGenre ===
				TypeColonneControlContinuBrevet_1.TypeColonneControlContinuBrevet
					.tCCCB_Enseignement
					? 450
					: 90,
		};
		if ("periode" in lColonneDansListe) {
			lColonne.periode = lColonneDansListe.periode;
		}
		aListe.push(lColonne);
	}
	_initialiserCompetence(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_FicheBrevetCompetence_1
				.DonneesListe_FicheBrevetCompetence.colonnes.competences,
			taille: 400,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FicheBrevet.titre.DomainesSocle",
			),
		});
		lColonnes.push({
			id: DonneesListe_FicheBrevetCompetence_1
				.DonneesListe_FicheBrevetCompetence.colonnes.maitrise,
			taille: 250,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FicheBrevet.titre.Maitrise",
			),
		});
		lColonnes.push({
			id: DonneesListe_FicheBrevetCompetence_1
				.DonneesListe_FicheBrevetCompetence.colonnes.points,
			taille: 100,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FicheBrevet.titre.Points",
			),
		});
		lColonnes.push({
			id: DonneesListe_FicheBrevetCompetence_1
				.DonneesListe_FicheBrevetCompetence.colonnes.bareme,
			taille: 100,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FicheBrevet.titre.Bareme",
			),
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			hauteurAdapteContenu: true,
			avecLigneTotal: true,
			ariaLabel: () =>
				this.getAriaLabelListe(
					ObjetTraduction_1.GTraductions.getValeur(
						"FicheBrevet.titre.DomainesSocle",
					),
				),
		});
	}
}
exports._InterfaceFicheBrevet = _InterfaceFicheBrevet;
