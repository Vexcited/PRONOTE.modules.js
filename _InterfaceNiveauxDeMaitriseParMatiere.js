exports._InterfaceNiveauxDeMaitriseParMatiere = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_NiveauxDeMaitriseParMatiere_1 = require("DonneesListe_NiveauxDeMaitriseParMatiere");
const InterfacePage_1 = require("InterfacePage");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Invocateur_1 = require("Invocateur");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const ObjetListe_1 = require("ObjetListe");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
class _InterfaceNiveauxDeMaitriseParMatiere extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.options = {
			avecDetail: true,
			avecBoutonJaugeChronologique: true,
			jaugeChronologique: false,
		};
	}
	construireInstances() {
		this.IdentPage = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListe.bind(this),
		);
	}
	_reponseRequeteNiveauxDeMaitriseParMatiere(aDonnees) {
		if (aDonnees.Message) {
			this.evenementAfficherMessage(aDonnees.Message);
		} else {
			this.donnees = aDonnees;
			const lPourEleve = this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Eleve,
			)
				? this.etatUtilisateurSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Eleve,
					).existeNumero()
				: true;
			this.options.avecDetail = lPourEleve;
			this.options.avecBoutonJaugeChronologique = lPourEleve;
			this._initialiserListe(this.getInstance(this.IdentPage));
			this._actualiserListe();
			if (
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.autoriserImpressionBulletinReleveBrevet,
				)
			) {
				Invocateur_1.Invocateur.evenement(
					Invocateur_1.ObjetInvocateur.events.activationImpression,
					Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
					this,
					this.getParametresPDF.bind(this),
				);
			}
		}
	}
	getParametresPDF() {
		return {
			genreGenerationPDF:
				TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
					.NiveauxDeMaitriseParMatiere,
			classe: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			),
			periode: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
			),
			eleve: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Eleve,
			),
			jaugeChronologique: this.options.jaugeChronologique,
			avecCodeCompetences: this.etatUtilisateurSco.estAvecCodeCompetences(),
		};
	}
	_initialiserListe(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_NiveauxDeMaitriseParMatiere_1
				.DonneesListe_NiveauxDeMaitriseParMatiere.colonnes.matieres,
			taille: "100%",
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"BulletinEtReleve.Matieres",
			),
		});
		lColonnes.push({
			id: DonneesListe_NiveauxDeMaitriseParMatiere_1
				.DonneesListe_NiveauxDeMaitriseParMatiere.colonnes.etatDAcquisition,
			taille: 350,
			titre: {
				getLibelleHtml: () => {
					const lStrBoutonJauge = [];
					if (this.options.avecBoutonJaugeChronologique) {
						const lJsxBoutonBasculeJauge = () => {
							return {
								event: () => {
									this.options.jaugeChronologique =
										!this.options.jaugeChronologique;
									const lListe = this.getInstance(this.IdentPage);
									lListe.getDonneesListe().setParametres(this.options);
									lListe.actualiser(true);
								},
								getTitle: () => {
									return this.options.jaugeChronologique
										? ObjetTraduction_1.GTraductions.getValeur(
												"BulletinEtReleve.hintBtnAfficherJaugeParNiveau",
											)
										: ObjetTraduction_1.GTraductions.getValeur(
												"BulletinEtReleve.hintBtnAfficherJaugeChronologique",
											);
								},
							};
						};
						const lJsxGetClasseBoutonBasculeJauge = () => {
							if (this.options.jaugeChronologique) {
								return UtilitaireCompetences_1.TUtilitaireCompetences
									.ClasseIconeJaugeChronologique;
							}
							return UtilitaireCompetences_1.TUtilitaireCompetences
								.ClasseIconeJaugeParNiveau;
						};
						lStrBoutonJauge.push(
							IE.jsx.str("ie-btnicon", {
								"ie-model": lJsxBoutonBasculeJauge,
								"ie-class": lJsxGetClasseBoutonBasculeJauge,
								style: "width: 18px;",
							}),
						);
					}
					const lTitreEtatDAcquisition = [];
					lTitreEtatDAcquisition.push(
						IE.jsx.str(
							"div",
							{ class: "flex-contain flex-center justify-center" },
							lStrBoutonJauge.join(""),
							IE.jsx.str(
								"span",
								null,
								ObjetTraduction_1.GTraductions.getValeur(
									"competences.syntheseDesEvaluations",
								),
							),
						),
					);
					return lTitreEtatDAcquisition.join("");
				},
			},
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			colonnesCachees: this.donnees.maquette.avecEtatAcquisition
				? []
				: [
						DonneesListe_NiveauxDeMaitriseParMatiere_1
							.DonneesListe_NiveauxDeMaitriseParMatiere.colonnes
							.etatDAcquisition,
					],
		});
	}
	_actualiserListe() {
		this.getInstance(this.IdentPage).setDonnees(
			new DonneesListe_NiveauxDeMaitriseParMatiere_1.DonneesListe_NiveauxDeMaitriseParMatiere(
				this.donnees.listeLignes,
				this.options,
			),
		);
	}
}
exports._InterfaceNiveauxDeMaitriseParMatiere =
	_InterfaceNiveauxDeMaitriseParMatiere;
