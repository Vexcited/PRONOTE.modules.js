exports.InterfaceFicheBrevet_Consultation = void 0;
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_FicheBrevetCompetence_1 = require("DonneesListe_FicheBrevetCompetence");
const Type3Etats_1 = require("Type3Etats");
const _InterfaceFicheBrevet_1 = require("_InterfaceFicheBrevet");
const DonneesListe_FicheBrevetCC_1 = require("DonneesListe_FicheBrevetCC");
class InterfaceFicheBrevet_Consultation extends _InterfaceFicheBrevet_1._InterfaceFicheBrevet {
	constructor(...aParams) {
		super(...aParams);
		this.idEnseignementComplTitreAvis = GUID_1.GUID.getId();
		this.idEnseignementComplAvis = GUID_1.GUID.getId();
		this.idEnseignementComplAppreciation = GUID_1.GUID.getId();
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
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ id: this.idPage, class: "Espace", style: { display: "none" } },
				this.getHtmlListeCC(),
				IE.jsx.str("div", {
					id: this.getNomInstance(this.identListeCompetence),
					"ie-display": this.jsxDisplayCFG.bind(this),
				}),
				IE.jsx.str(
					"div",
					{
						class: ["NoWrap", "EspaceHaut10"],
						"ie-display": this.jsxDisplayBrevet.bind(this),
					},
					IE.jsx.str("div", {
						class: ["InlineBlock", "AlignementMilieuVertical", "Gras"],
						id: this.idEnseignementComplTitreAvis,
					}),
					IE.jsx.str("div", {
						class: ["InlineBlock", "AlignementMilieuVertical", "EspaceGauche"],
						id: this.idEnseignementComplAvis,
					}),
				),
				IE.jsx.str("div", {
					class: "EspaceHaut",
					style: { width: 850 },
					id: this.idEnseignementComplAppreciation,
					"ie-display": this.jsxDisplayBrevet.bind(this),
				}),
				IE.jsx.str("div", {
					"ie-display": this.jsxDisplayCFG.bind(this),
					class: ["ie-titre", "m-top-xxl"],
					"ie-html": this.jsxGetHtmlMessageCFG.bind(this),
				}),
			),
			IE.jsx.str("div", { id: this.idMessage }),
		);
	}
	recupererDonnees() {
		this.requeteConsultation();
	}
	actionSurRecupererDonnees(aJSON) {
		if (aJSON.message) {
			this.evenementAfficherMessage(aJSON.message);
			return;
		}
		this.estCFG = aJSON.estCFG;
		this.donneesRecu = true;
		this.competences = aJSON.competences;
		if (this.estCFG) {
			this.initCFG(aJSON);
			return;
		}
		this.initBrevet(aJSON);
	}
	initBrevet(aJSON) {
		super.initBrevet(aJSON);
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
		this.afficherListeCompetence();
		if (this.listeControleContinu) {
			this.getInstance(this.identListeControleContinu).setDonnees(
				new DonneesListe_FicheBrevetCC_1.DonneesListe_FicheBrevetCC(
					this.listeControleContinu,
				),
			);
		}
		ObjetHtml_1.GHtml.setDisplay(this.idEnseignementComplTitreAvis, false);
		if (
			this.appGenerale.avisChefDEtablissement.getLibelle() ||
			this.appGenerale.appreciationAnnuelle.getLibelle()
		) {
			ObjetHtml_1.GHtml.setDisplay(this.idEnseignementComplTitreAvis, true);
			ObjetHtml_1.GHtml.setDisplay(this.idEnseignementComplAvis, true);
			ObjetHtml_1.GHtml.setDisplay(this.idEnseignementComplAppreciation, true);
		}
		this.activerImpression();
	}
	initCFG(aJSON) {
		this.recu = aJSON.recu;
		ObjetHtml_1.GHtml.setDisplay(this.idPage, true);
		this.afficherListeCompetence();
		this.activerImpression();
	}
	afficherListeCompetence() {
		if (this.competences) {
			this.getInstance(this.identListeCompetence).setDonnees(
				new DonneesListe_FicheBrevetCompetence_1.DonneesListe_FicheBrevetCompetence(
					this.competences,
					{},
				),
			);
		}
	}
	getEleve() {
		return GEtatUtilisateur.getMembre();
	}
}
exports.InterfaceFicheBrevet_Consultation = InterfaceFicheBrevet_Consultation;
