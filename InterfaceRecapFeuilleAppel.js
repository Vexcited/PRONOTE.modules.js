exports.InterfaceRecapFeuilleAppel = exports.ObjetRequeteRecapFeuilleAppel =
	void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const _InterfaceRecapVS_1 = require("_InterfaceRecapVS");
const DonneesListe_RecapFeuilleAppel_1 = require("DonneesListe_RecapFeuilleAppel");
const Invocateur_1 = require("Invocateur");
const ObjetChaine_1 = require("ObjetChaine");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_CalendrierAnnuel_1 = require("ObjetFenetre_CalendrierAnnuel");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeGenreObservationVS_1 = require("TypeGenreObservationVS");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const ObjetRequeteDetailAbsences_1 = require("ObjetRequeteDetailAbsences");
const ObjetRequeteListeRegimesEleve_1 = require("ObjetRequeteListeRegimesEleve");
class ObjetRequeteRecapFeuilleAppel extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteRecapFeuilleAppel = ObjetRequeteRecapFeuilleAppel;
CollectionRequetes_1.Requetes.inscrire(
	"RecapFeuilleAppel",
	ObjetRequeteRecapFeuilleAppel,
);
class InterfaceRecapFeuilleAppel extends _InterfaceRecapVS_1._InterfaceRecapVS {
	constructor(...aParams) {
		super(...aParams);
	}
	setAutorisations() {
		this.domaineRecap = this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.absences.domaineRecapitulatifAbsences,
		);
	}
	construireInstances() {
		super.construireInstances();
		this.identRecap = this.add(ObjetListe_1.ObjetListe, this._evntSurListe);
		this.idFenetreCalCDC = this.addFenetre(
			ObjetFenetre_CalendrierAnnuel_1.ObjetFenetre_CalendrierAnnuel,
			null,
			this._initFenetreCalCDC,
		);
	}
	_initFenetreCalCDC(aInstance) {
		aInstance.setOptionsFenetre({
			modale: false,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CarnetCorrespondance.DefautCarnet",
			),
			largeur: 650,
			hauteur: null,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
	}
	_evntSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition: {
				const lObservationCourante =
					aParametres.article.listeRubriquesObservations.get(
						aParametres.colonne - 3,
					);
				new ObjetRequeteDetailAbsences_1.ObjetRequeteDetailAbsences(
					this,
					this.actionSurRecupererDetailAbsences.bind(
						this,
						aParametres.article,
						lObservationCourante,
					),
				).lancerRequete({
					eleve: aParametres.article.eleve,
					domaine: this._parametres.domaine,
					genreAbsence: Enumere_Ressource_1.EGenreRessource.Observation,
					observation: lObservationCourante,
					uniquementDontJeSuisAuteur:
						this._parametres.uniquementDontJeSuisAuteur,
				});
				break;
			}
		}
	}
	requeteCriteresSelection() {
		new ObjetRequeteListeRegimesEleve_1.ObjetRequeteListeRegimesEleve(
			this,
			this.surRecupererCriteresSelection,
		).lancerRequete({
			avecRegimesEleves: true,
			avecSeulementUtilises: true,
			avecAucun: true,
			avecMotifsAbsence: false,
			avecMotifsAbsRepas: false,
			avecMotifsAbsInternat: false,
			avecMotifsRetardInternat: false,
			avecMotifsRetard: false,
			avecMotifsInfirmerie: false,
			avecIssuesInfirmerie: false,
			avecDetailElts: false,
			avecObservations: true,
		});
	}
	aFaireSurRecupererCriteresSelection(aParam) {
		$.extend(this._parametres, {
			rubriquesObservation: aParam.listeRubriquesObservations,
		});
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_RecapFeuilleAppel_1.DonneesListe_RecapFeuilleAppel
				.colonnes.eleves,
			taille: 200,
			titre: ObjetTraduction_1.GTraductions.getValeur("RecapAbs.colEleves"),
		});
		lColonnes.push({
			id: DonneesListe_RecapFeuilleAppel_1.DonneesListe_RecapFeuilleAppel
				.colonnes.classes,
			taille: 150,
			titre: ObjetTraduction_1.GTraductions.getValeur("RecapAbs.colClasses"),
		});
		lColonnes.push({
			id: DonneesListe_RecapFeuilleAppel_1.DonneesListe_RecapFeuilleAppel
				.colonnes.regimes,
			taille: 300,
			titre: ObjetTraduction_1.GTraductions.getValeur("RecapAbs.colRegime"),
		});
		for (
			let i = 0, lNbr = this._parametres.rubriquesObservation.count();
			i < lNbr;
			i++
		) {
			lColonnes.push({
				id:
					DonneesListe_RecapFeuilleAppel_1.DonneesListe_RecapFeuilleAppel
						.colonnes.prefixe_dyn + i,
				taille: 150,
				titre: this._parametres.rubriquesObservation.getLibelle(i),
			});
		}
		const lColonnesCachees = [];
		if (!this.droits.avecChoixRepas && !this.droits.avecChoixInternat) {
			lColonnesCachees.push(
				DonneesListe_RecapFeuilleAppel_1.DonneesListe_RecapFeuilleAppel.colonnes
					.regimes,
			);
		}
		this.getInstance(this.identRecap).setOptionsListe(
			{
				colonnes: lColonnes,
				avecLigneTotal: true,
				scrollHorizontal: true,
				colonnesCachees: lColonnesCachees,
			},
			true,
		);
	}
	surRecupererDonneesRecap(aParamDonnees, aParam) {
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
			this,
			() => {
				return {
					genreGenerationPDF:
						TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
							.RecapFeuilleAppel,
					classes: aParamDonnees.classes,
					regimes: aParamDonnees.regimes,
					rubriquesObservation: aParamDonnees.rubriquesObservation,
					domaine: aParamDonnees.domaine,
					uniquementDontJeSuisAuteur: aParamDonnees.uniquementDontJeSuisAuteur,
				};
			},
		);
		this.getInstance(this.identRecap).setDonnees(
			new DonneesListe_RecapFeuilleAppel_1.DonneesListe_RecapFeuilleAppel(
				aParam.ListeLignes,
				aParam.LigneCumul,
			),
		);
	}
	requeteDonneesRecap(aParam) {
		aParam.classes.setSerialisateurJSON({ ignorerEtatsElements: true });
		aParam.regimes.setSerialisateurJSON({ ignorerEtatsElements: true });
		aParam.rubriquesObservation.setSerialisateurJSON({
			ignorerEtatsElements: true,
		});
		new ObjetRequeteRecapFeuilleAppel(
			this,
			this.surRecupererDonneesRecap.bind(this, aParam),
		).lancerRequete({
			classes: aParam.classes,
			regimes: aParam.regimes,
			rubriquesObservation: aParam.rubriquesObservation,
			domaine: aParam.domaine,
			uniquementDontJeSuisAuteur: aParam.uniquementDontJeSuisAuteur,
		});
	}
	actionSurRecupererDetailAbsences(
		aDonnee,
		aObservationCourante,
		aListeAbsences,
	) {
		const lDate = IE.Cycles.dateDebutCycle(
			this._parametres.domaine.getPremierePosition(),
		);
		const lStrDate = ObjetDate_1.GDate.formatDate(lDate, "%JJ/%MM/%AAAA");
		if (
			aObservationCourante.getGenre() ===
			TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_DefautCarnet
		) {
			const lListeCDC = aListeAbsences.listeAbsences.getListeElements(
				(element) => {
					return element.estUnDeploiement !== true;
				},
			);
			for (let i = 0, lNbr = lListeCDC.count(); i < lNbr; i++) {
				let lElt = lListeCDC.get(i);
				lElt.date = ObjetDate_1.GDate.placeAnnuelleEnDate(lElt.placeDebut);
			}
			this.getInstance(this.idFenetreCalCDC).setOptionsFenetre({
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.defautCarnetDepuis",
					[aDonnee.eleve.getLibelle(), lStrDate],
				),
			});
			this.getInstance(this.idFenetreCalCDC).afficherDefautCarnet(
				{
					premiereDate: lDate,
					derniereDate: IE.Cycles.dateFinCycle(
						this._parametres.domaine.getDernierePosition(),
					),
				},
				lListeCDC,
			);
		} else {
			const lTitre = [aDonnee.eleve.getLibelle()];
			let lNbAbs = 0;
			for (
				let i = 0, lNbr = aListeAbsences.listeAbsences.count();
				i < lNbr;
				i++
			) {
				if (!aListeAbsences.listeAbsences.get(i).estUnDeploiement) {
					lNbAbs++;
				}
			}
			lTitre.push(
				ObjetChaine_1.GChaine.format(
					ObjetTraduction_1.GTraductions.getValeur(
						lNbAbs > 1 ? "AbsenceVS.obssDepuis" : "AbsenceVS.obsDepuis",
					),
					[lNbAbs, aObservationCourante.getLibelle(), lStrDate],
				),
			);
			this.getInstance(this.identFenetreAbsParCours).setOptionsFenetre({
				titre: lTitre.join(" - "),
			});
			this.getInstance(this.identFenetreAbsParCours).setDonnees(
				null,
				null,
				true,
				aDonnee.eleve,
				aListeAbsences,
				Enumere_Ressource_1.EGenreRessource.Observation,
				aObservationCourante.avecARObservation,
			);
			this.getInstance(this.identFenetreAbsParCours).afficher();
		}
	}
}
exports.InterfaceRecapFeuilleAppel = InterfaceRecapFeuilleAppel;
