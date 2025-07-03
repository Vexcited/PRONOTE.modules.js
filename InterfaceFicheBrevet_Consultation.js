exports.InterfaceFicheBrevet_Consultation = void 0;
const ObjetRequetePageFicheBrevet_1 = require("ObjetRequetePageFicheBrevet");
const GUID_1 = require("GUID");
const Invocateur_1 = require("Invocateur");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_FicheBrevetCompetence_1 = require("DonneesListe_FicheBrevetCompetence");
const DonneesListe_FicheBrevetResultat_1 = require("DonneesListe_FicheBrevetResultat");
const InterfacePage_1 = require("InterfacePage");
const ObjetZoneTexte_1 = require("ObjetZoneTexte");
const TypeEnseignementComplement_1 = require("TypeEnseignementComplement");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const TypePointsEnseignementComplement_1 = require("TypePointsEnseignementComplement");
const Type3Etats_1 = require("Type3Etats");
class InterfaceFicheBrevet_Consultation extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.idMessage = GUID_1.GUID.getId();
		this.idEnseignementComplTitreAvis = GUID_1.GUID.getId();
		this.idEnseignementComplAvis = GUID_1.GUID.getId();
		this.idEnseignementComplAppreciation = GUID_1.GUID.getId();
		this.idPage = GUID_1.GUID.getId();
	}
	construireInstances() {
		this.identListeCompetence = this.add(
			ObjetListe_1.ObjetListe,
			null,
			_initialiserCompetence,
		);
		this.identEnseignementCompl = this.add(
			ObjetListe_1.ObjetListe,
			null,
			_initialiserEnseignementCompl.bind(this),
		);
		this.identEnseignementComplPoints = this.add(
			ObjetZoneTexte_1.ObjetZoneTexte,
		);
		this.avecBandeau = true;
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	jsxDisplayEnseignementsComplementaires() {
		return !this.estCFG;
	}
	jsxDisplayInformationsEnseignementsComplementaires() {
		return !this.estCFG;
	}
	jsxDisplayAppreciationsEnseignementsComplementaires() {
		return !this.estCFG;
	}
	jsxDisplayMessageCFG() {
		return this.estCFG;
	}
	jsxGetHtmlMessageCFG() {
		if (!!this.recu) {
			switch (this.recu.getGenre()) {
				case Type3Etats_1.Type3Etats.TE_Oui:
					return ObjetTraduction_1.GTraductions.getValeur(
						"FicheBrevet.CFG.obtenue",
					);
				case Type3Etats_1.Type3Etats.TE_Non:
					return ObjetTraduction_1.GTraductions.getValeur(
						"FicheBrevet.CFG.nonObtenue",
					);
			}
		}
		return "";
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			'<div id="',
			this.idPage,
			'" class="Espace" style="display: none;">',
		);
		H.push(
			'<div id="',
			this.getNomInstance(this.identListeCompetence),
			'"></div>',
		);
		H.push(
			IE.jsx.str("div", {
				class: "EspaceHaut10",
				id: this.getNomInstance(this.identEnseignementCompl),
				"ie-display": this.jsxDisplayEnseignementsComplementaires.bind(this),
			}),
		);
		H.push(
			IE.jsx.str(
				"div",
				{
					class: "NoWrap EspaceHaut10",
					"ie-display":
						this.jsxDisplayInformationsEnseignementsComplementaires.bind(this),
				},
				IE.jsx.str("div", {
					class: "InlineBlock AlignementMilieuVertical Gras",
					id: this.idEnseignementComplTitreAvis,
				}),
				IE.jsx.str("div", {
					class: "InlineBlock AlignementMilieuVertical EspaceGauche",
					id: this.idEnseignementComplAvis,
				}),
			),
		);
		H.push(
			IE.jsx.str("div", {
				class: "EspaceHaut",
				style: "width:850px",
				id: this.idEnseignementComplAppreciation,
				"ie-display":
					this.jsxDisplayAppreciationsEnseignementsComplementaires.bind(this),
			}),
		);
		H.push(
			IE.jsx.str("div", {
				"ie-display": this.jsxDisplayMessageCFG.bind(this),
				class: "ie-titre m-top-xxl",
				"ie-html": this.jsxGetHtmlMessageCFG.bind(this),
			}),
		);
		H.push("</div>");
		H.push('<div id="', this.idMessage, '"></div>');
		return H.join("");
	}
	evenementAfficherMessage(aGenreMessage) {
		ObjetHtml_1.GHtml.setDisplay(this.idPage, false);
		ObjetHtml_1.GHtml.setDisplay(this.idMessage, true);
		this.afficherBandeau(true);
		const lMessage =
			typeof aGenreMessage === "number"
				? ObjetTraduction_1.GTraductions.getValeur("Message")[aGenreMessage]
				: aGenreMessage;
		ObjetHtml_1.GHtml.setHtml(this.idMessage, this.composeMessage(lMessage));
	}
	recupererDonnees() {
		new ObjetRequetePageFicheBrevet_1.ObjetRequetePageFicheBrevet(
			this,
			this.actionSurRecupererDonnees,
		).lancerRequete({ eleve: GEtatUtilisateur.getMembre() });
	}
	actionSurRecupererDonnees(aJSON) {
		if (aJSON.message) {
			this.evenementAfficherMessage(aJSON.message);
		} else {
			this.estCFG = aJSON.estCFG;
			if (this.estCFG) {
				this.initCFG(aJSON);
				return;
			}
			this.donneesRecu = true;
			this.competences = aJSON.competences;
			this.complements = aJSON.Complements;
			this.appGenerale = aJSON.appGenerale;
			ObjetHtml_1.GHtml.setDisplay(this.idPage, true);
			const lMessageEnseignementComplTitreAvis =
				ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.AvisChefEtablissement",
				) + " :";
			const lMessageEnseignementComplAvis =
				this.appGenerale.avisChefDEtablissement.getLibelle();
			const lMessageEnseignementComplAppreciation =
				this.appGenerale.appreciationAnnuelle.getLibelle();
			ObjetHtml_1.GHtml.setHtml(
				this.idEnseignementComplTitreAvis,
				lMessageEnseignementComplTitreAvis,
			);
			ObjetHtml_1.GHtml.setHtml(
				this.idEnseignementComplAvis,
				lMessageEnseignementComplAvis,
			);
			ObjetHtml_1.GHtml.setHtml(
				this.idEnseignementComplAppreciation,
				lMessageEnseignementComplAppreciation,
			);
			const lListeResult = new ObjetListeElements_1.ObjetListeElements();
			const lResult = new ObjetElement_1.ObjetElement(
				TypeEnseignementComplement_1.TypeEnseignementComplementUtil.getLibelle(
					this.complements.enseignementComplement.getGenre(),
				),
				undefined,
				TypePointsEnseignementComplement_1.TypePointsEnseignementComplementUtil.getLibelle(
					this.complements.nombreDePoints.getGenre(),
				),
			);
			lResult.points =
				TypePointsEnseignementComplement_1.TypePointsEnseignementComplementUtil.getPoints(
					this.complements.nombreDePoints.getGenre(),
				);
			lListeResult.addElement(lResult);
			this.afficherListeCompetence();
			this.getInstance(this.identEnseignementCompl).setDonnees(
				new DonneesListe_FicheBrevetResultat_1.DonneesListe_FicheBrevetResultat(
					lListeResult,
				),
			);
			this.getInstance(this.identEnseignementComplPoints).setDonnees(
				TypePointsEnseignementComplement_1.TypePointsEnseignementComplementUtil.getLibelle(
					this.complements.nombreDePoints.getGenre(),
				),
			);
			ObjetHtml_1.GHtml.setDisplay(this.idEnseignementComplTitreAvis, false);
			if (
				this.appGenerale.avisChefDEtablissement.getLibelle() ||
				this.appGenerale.appreciationAnnuelle.getLibelle()
			) {
				ObjetHtml_1.GHtml.setDisplay(this.idEnseignementComplTitreAvis, true);
				ObjetHtml_1.GHtml.setDisplay(this.idEnseignementComplAvis, true);
				ObjetHtml_1.GHtml.setDisplay(
					this.idEnseignementComplAppreciation,
					true,
				);
			}
			this.activerImpression();
		}
	}
	initCFG(aJSON) {
		this.donneesRecu = true;
		this.competences = aJSON.competences;
		this.recu = aJSON.recu;
		ObjetHtml_1.GHtml.setDisplay(this.idPage, true);
		this.afficherListeCompetence();
		this.activerImpression();
	}
	afficherListeCompetence() {
		this.getInstance(this.identListeCompetence).setDonnees(
			new DonneesListe_FicheBrevetCompetence_1.DonneesListe_FicheBrevetCompetence(
				this.competences,
				{},
			),
		);
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
					eleve: GEtatUtilisateur.getMembre(),
				};
			},
		);
	}
}
exports.InterfaceFicheBrevet_Consultation = InterfaceFicheBrevet_Consultation;
function _initialiserCompetence(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_FicheBrevetCompetence_1.DonneesListe_FicheBrevetCompetence
			.colonnes.competences,
		taille: 400,
		titre: ObjetTraduction_1.GTraductions.getValeur(
			"FicheBrevet.titre.DomainesSocle",
		),
	});
	lColonnes.push({
		id: DonneesListe_FicheBrevetCompetence_1.DonneesListe_FicheBrevetCompetence
			.colonnes.maitrise,
		taille: 250,
		titre: ObjetTraduction_1.GTraductions.getValeur(
			"FicheBrevet.titre.Maitrise",
		),
	});
	lColonnes.push({
		id: DonneesListe_FicheBrevetCompetence_1.DonneesListe_FicheBrevetCompetence
			.colonnes.points,
		taille: 100,
		titre: ObjetTraduction_1.GTraductions.getValeur("FicheBrevet.titre.Points"),
	});
	lColonnes.push({
		id: DonneesListe_FicheBrevetCompetence_1.DonneesListe_FicheBrevetCompetence
			.colonnes.bareme,
		taille: 100,
		titre: ObjetTraduction_1.GTraductions.getValeur("FicheBrevet.titre.Bareme"),
	});
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		hauteurAdapteContenu: true,
		avecLigneTotal: true,
	});
}
function _initialiserEnseignementCompl(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_FicheBrevetResultat_1.DonneesListe_FicheBrevetResultat
			.colonnes.competences,
		taille: 400,
		titre: ObjetTraduction_1.GTraductions.getValeur(
			"FicheBrevet.EnseignementsComplements",
		),
	});
	lColonnes.push({
		id: DonneesListe_FicheBrevetResultat_1.DonneesListe_FicheBrevetResultat
			.colonnes.objectifs,
		taille: 250,
		titre: ObjetTraduction_1.GTraductions.getValeur("FicheBrevet.Objectifs"),
	});
	lColonnes.push({
		id: DonneesListe_FicheBrevetResultat_1.DonneesListe_FicheBrevetResultat
			.colonnes.points,
		taille: 100,
		titre: ObjetTraduction_1.GTraductions.getValeur("FicheBrevet.titre.Points"),
	});
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		hauteurAdapteContenu: true,
	});
}
