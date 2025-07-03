exports.InterfaceRecapPunitions = exports.ObjetRequeteRecapPunitions = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const _InterfaceRecapVS_1 = require("_InterfaceRecapVS");
const ParamAffRecapPunitions_1 = require("ParamAffRecapPunitions");
const DonneesListe_RecapPunitions_1 = require("DonneesListe_RecapPunitions");
const Invocateur_1 = require("Invocateur");
const ObjetChaine_1 = require("ObjetChaine");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const ObjetDate_1 = require("ObjetDate");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const ObjetRequeteDetailAbsences_1 = require("ObjetRequeteDetailAbsences");
const ObjetRequeteListeRegimesEleve_1 = require("ObjetRequeteListeRegimesEleve");
class ObjetRequeteRecapPunitions extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteRecapPunitions = ObjetRequeteRecapPunitions;
CollectionRequetes_1.Requetes.inscrire(
	"RecapPunitions",
	ObjetRequeteRecapPunitions,
);
class InterfaceRecapPunitions extends _InterfaceRecapVS_1._InterfaceRecapVS {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		super.construireInstances();
		this.identParamEtFiltres = this.add(
			ParamAffRecapPunitions_1.ParamAffRecapPunitions,
			this._evntSurParamAff,
		);
		this.identRecap = this.add(ObjetListe_1.ObjetListe, this._evntSurListe);
	}
	setAutorisations() {}
	_evntSurParamAff(aParam) {
		switch (aParam.evnt) {
			case ParamAffRecapPunitions_1.ParamAffRecapPunitions.GenreCallback
				.actualiserDonnees:
				if (aParam.avecModifCBGpe) {
					this._actualiserVisibiliteColonnes();
				}
				this.requeteDonneesRecap(this._parametres);
				break;
		}
	}
	_actualiserVisibiliteColonnes() {
		const lColonnesCachees = [];
		const lCacherColPunition =
			!this.droits.avecPunitions ||
			!this._parametres.criteresFiltres.avecGpePunitions ||
			!this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.punition.avecRecapPunitions,
			);
		const lCacherColSanction =
			!this._parametres.criteresFiltres.avecGpeSanctions ||
			!this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.punition.avecRecapSanctions,
			);
		const lCacherMC =
			!this._parametres.criteresFiltres.avecMesuresConservatoires;
		const lCacherCommissions =
			!this._parametres.criteresFiltres.avecCommissions ||
			!this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.avecCommissions,
			);
		if (lCacherColPunition && !!this._parametres.listeNaturePunition) {
			this._parametres.listeNaturePunition.parcourir(
				(aNaturePunition, aIndice) => {
					lColonnesCachees.push(
						DonneesListe_RecapPunitions_1.DonneesListe_RecapPunitions.colonnes
							.prefixe_punition + aIndice,
					);
				},
			);
		}
		if (lCacherColSanction && !!this._parametres.listeNatureSanction) {
			this._parametres.listeNatureSanction.parcourir(
				(aNatureSanction, aIndice) => {
					lColonnesCachees.push(
						DonneesListe_RecapPunitions_1.DonneesListe_RecapPunitions.colonnes
							.prefixe_sanction + aIndice,
					);
				},
			);
		}
		if (lCacherCommissions && !!this._parametres.listeNatureCommissions) {
			this._parametres.listeNatureCommissions.parcourir(
				(aNatureCommission, aIndice) => {
					lColonnesCachees.push(
						DonneesListe_RecapPunitions_1.DonneesListe_RecapPunitions.colonnes
							.prefixe_commission + aIndice,
					);
				},
			);
		}
		if (lCacherMC) {
			lColonnesCachees.push(
				DonneesListe_RecapPunitions_1.DonneesListe_RecapPunitions.colonnes
					.mesuresConservatoire,
			);
		}
		if (!this.droits.avecChoixRepas && !this.droits.avecChoixInternat) {
			lColonnesCachees.push(
				DonneesListe_RecapPunitions_1.DonneesListe_RecapPunitions.colonnes
					.regimes,
			);
		}
		this.getInstance(this.identRecap).setOptionsListe(
			{ colonnesCachees: lColonnesCachees },
			true,
		);
	}
	requeteDonneesRecap(aParam) {
		aParam.classes.setSerialisateurJSON({ ignorerEtatsElements: true });
		aParam.regimes.setSerialisateurJSON({ ignorerEtatsElements: true });
		aParam.criteresFiltres.motifsPunitions.setSerialisateurJSON({
			ignorerEtatsElements: true,
		});
		new ObjetRequeteRecapPunitions(
			this,
			this.surRecupererDonneesRecap.bind(this, aParam),
		).lancerRequete({
			classes: aParam.classes,
			regimes: aParam.regimes,
			criteres: aParam.criteresFiltres,
			domaine: aParam.domaine,
		});
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
							.RecapPunitionSanction,
					classes: aParamDonnees.classes,
					regimes: aParamDonnees.regimes,
					criteres: aParamDonnees.criteresFiltres,
					domaine: aParamDonnees.domaine,
				};
			},
		);
		this.getInstance(this.identRecap).setDonnees(
			new DonneesListe_RecapPunitions_1.DonneesListe_RecapPunitions(
				aParam.ListeLignes,
				aParam.LigneCumul,
			),
		);
		this._actualiserVisibiliteColonnes();
	}
	_evntSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick: {
				const lDonneesListe = this.getInstance(
					this.identRecap,
				).getDonneesListe();
				const lEstColonnePunition = lDonneesListe.estColonnePunition(
					aParametres.idColonne,
				);
				const lEstColonneSanction = lDonneesListe.estColonneSanction(
					aParametres.idColonne,
				);
				const lEstColonneCommission = lDonneesListe.estColonneCommission(
					aParametres.idColonne,
				);
				const lEstColonneMC =
					aParametres.idColonne ===
					DonneesListe_RecapPunitions_1.DonneesListe_RecapPunitions.colonnes
						.mesuresConservatoire;
				if (
					lEstColonnePunition ||
					lEstColonneSanction ||
					lEstColonneCommission ||
					lEstColonneMC
				) {
					let lGenreAbsence;
					if (lEstColonnePunition) {
						lGenreAbsence = Enumere_Ressource_1.EGenreRessource.Punition;
					} else if (lEstColonneSanction) {
						lGenreAbsence = Enumere_Ressource_1.EGenreRessource.Sanction;
					} else if (lEstColonneCommission) {
						lGenreAbsence = Enumere_Ressource_1.EGenreRessource.Commission;
					} else {
						lGenreAbsence =
							Enumere_Ressource_1.EGenreRessource.MesureConservatoire;
					}
					let lNatureAbsence;
					if (lEstColonnePunition) {
						const lIndicePunition = lDonneesListe.getIndicePunitionDeColonne(
							aParametres.idColonne,
						);
						lNatureAbsence =
							aParametres.article.listeRubriquePunition.get(lIndicePunition);
					} else if (lEstColonneSanction) {
						const lIndiceSanction = lDonneesListe.getIndiceSanctionDeColonne(
							aParametres.idColonne,
						);
						lNatureAbsence =
							aParametres.article.listeRubriqueSanction.get(lIndiceSanction);
					} else if (lEstColonneCommission) {
						const lIndiceCommission =
							lDonneesListe.getIndiceCommissionDeColonne(aParametres.idColonne);
						lNatureAbsence =
							aParametres.article.listeCommissions.get(lIndiceCommission);
					} else {
						lNatureAbsence = aParametres.article.mesureConservatoire;
					}
					const lDetailAbsenceCourante = {
						genreAbsence: lGenreAbsence,
						absence: lNatureAbsence,
					};
					lNatureAbsence.listeAbsences.setSerialisateurJSON({
						ignorerEtatsElements: true,
					});
					new ObjetRequeteDetailAbsences_1.ObjetRequeteDetailAbsences(
						this,
						this.actionSurRecupererDetailAbsences.bind(
							this,
							aParametres.article,
							lDetailAbsenceCourante,
						),
					).lancerRequete({
						eleve: aParametres.article.eleve,
						domaine: this._parametres.domaine,
						genreAbsence: lGenreAbsence,
						natureAbsence: lNatureAbsence,
						listeAbsences: lNatureAbsence.listeAbsences,
					});
				}
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
			avecObservations: false,
			avecMotifsPunition: true,
			avecPunitions: true,
			avecSanctions: true,
			avecCommissions: true,
		});
	}
	getCriteresSelectionParDefaut() {
		return {
			uniquementPlusJeunesQue: false,
			borneAge: 18,
			avecGpePunitions: this.droits.avecPunitions,
			avecGpeSanctions: true,
			motifsPunitions: new ObjetListeElements_1.ObjetListeElements(),
			uniquementFilles: true,
			uniquementGarcons: true,
			avecMesuresConservatoires: true,
			avecCommissions: true,
		};
	}
	aFaireSurRecupererCriteresSelection(aParam) {
		$.extend(this._parametres.criteresFiltres, {
			motifsPunitions: aParam.motifs,
		});
		this.getInstance(this.identParamEtFiltres).setDonnees({
			selection: this._parametres.criteresFiltres,
			motifsPunitions: aParam.motifs,
		});
		$.extend(this._parametres, {
			listeNaturePunition: aParam.listeNaturePunition,
		});
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_RecapPunitions_1.DonneesListe_RecapPunitions.colonnes
				.eleves,
			titre: ObjetTraduction_1.GTraductions.getValeur("RecapAbs.colEleves"),
			taille: 200,
		});
		lColonnes.push({
			id: DonneesListe_RecapPunitions_1.DonneesListe_RecapPunitions.colonnes
				.classes,
			titre: ObjetTraduction_1.GTraductions.getValeur("RecapAbs.colClasses"),
			taille: 100,
		});
		lColonnes.push({
			id: DonneesListe_RecapPunitions_1.DonneesListe_RecapPunitions.colonnes
				.dateNaissance,
			titre: ObjetTraduction_1.GTraductions.getValeur("RecapAbs.colNaiss"),
			taille: 100,
		});
		lColonnes.push({
			id: DonneesListe_RecapPunitions_1.DonneesListe_RecapPunitions.colonnes
				.age,
			titre: ObjetTraduction_1.GTraductions.getValeur("RecapAbs.colAge"),
			taille: 40,
		});
		lColonnes.push({
			id: DonneesListe_RecapPunitions_1.DonneesListe_RecapPunitions.colonnes
				.sexe,
			titre: ObjetTraduction_1.GTraductions.getValeur("RecapAbs.colSexe"),
			taille: 30,
		});
		lColonnes.push({
			id: DonneesListe_RecapPunitions_1.DonneesListe_RecapPunitions.colonnes
				.regimes,
			titre: ObjetTraduction_1.GTraductions.getValeur("RecapAbs.colRegime"),
			taille: 250,
		});
		if (!!this._parametres.listeNaturePunition) {
			this._parametres.listeNaturePunition.parcourir(
				(aNaturePunition, aIndice) => {
					lColonnes.push({
						id:
							DonneesListe_RecapPunitions_1.DonneesListe_RecapPunitions.colonnes
								.prefixe_punition + aIndice,
						titre: [
							{
								libelle: ObjetTraduction_1.GTraductions.getValeur(
									"RecapPunition.colPunition",
								),
								avecFusionColonne: true,
							},
							{
								libelle: aNaturePunition.libCourt,
								title: aNaturePunition.getLibelle(),
							},
						],
						taille: 70,
					});
				},
			);
		}
		$.extend(this._parametres, {
			listeNatureSanction: aParam.listeNatureSanction,
		});
		if (!!this._parametres.listeNatureSanction) {
			this._parametres.listeNatureSanction.parcourir(
				(aNatureSanction, aIndice) => {
					lColonnes.push({
						id:
							DonneesListe_RecapPunitions_1.DonneesListe_RecapPunitions.colonnes
								.prefixe_sanction + aIndice,
						titre: [
							{
								libelle: ObjetTraduction_1.GTraductions.getValeur(
									"RecapPunition.colSanction",
								),
								avecFusionColonne: true,
							},
							{
								libelle: aNatureSanction.libCourt,
								title: aNatureSanction.getLibelle(),
							},
						],
						taille: 70,
					});
				},
			);
		}
		const lColonnesCachees = [];
		if (!this.droits.avecChoixRepas && !this.droits.avecChoixInternat) {
			lColonnesCachees.push(
				DonneesListe_RecapPunitions_1.DonneesListe_RecapPunitions.colonnes
					.regimes,
			);
		}
		lColonnes.push({
			id: DonneesListe_RecapPunitions_1.DonneesListe_RecapPunitions.colonnes
				.mesuresConservatoire,
			titre: {
				libelle: ObjetTraduction_1.GTraductions.getValeur("RecapPunition.MC"),
				title: ObjetTraduction_1.GTraductions.getValeur(
					"RecapPunition.mesuresConservatoires",
				),
			},
			taille: 70,
		});
		$.extend(this._parametres, {
			listeNatureCommissions: aParam.listeNatureCommission,
		});
		if (!!this._parametres.listeNatureCommissions) {
			this._parametres.listeNatureCommissions.parcourir(
				(aNatureCommission, aIndice) => {
					lColonnes.push({
						id:
							DonneesListe_RecapPunitions_1.DonneesListe_RecapPunitions.colonnes
								.prefixe_commission + aIndice,
						titre: [
							{
								libelle: ObjetTraduction_1.GTraductions.getValeur(
									"RecapPunition.commissions",
								),
								avecFusionColonne: true,
							},
							{ libelle: aNatureCommission.getLibelle() },
						],
						taille: 70,
					});
				},
			);
		}
		this.getInstance(this.identRecap).setOptionsListe(
			{
				colonnes: lColonnes,
				colonnesCachees: lColonnesCachees,
				avecLigneTotal: true,
				scrollHorizontal: true,
			},
			true,
		);
	}
	actionSurRecupererDetailAbsences(
		aDonnee,
		aDetailAbsenceCourante,
		aListeAbsences,
	) {
		const lDate = IE.Cycles.dateDebutCycle(
			this._parametres.domaine.getPremierePosition(),
		);
		const lStrDate = ObjetDate_1.GDate.formatDate(lDate, "%JJ/%MM/%AAAA");
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
		switch (aDetailAbsenceCourante.genreAbsence) {
			case Enumere_Ressource_1.EGenreRessource.MesureConservatoire:
				lTitre.push(
					ObjetChaine_1.GChaine.format(
						ObjetTraduction_1.GTraductions.getValeur(
							lNbAbs > 1
								? "AbsenceVS.mesuresConservatoiresDepuis"
								: "AbsenceVS.mesureConservatoireDepuis",
						),
						[lNbAbs, lStrDate],
					),
				);
				break;
			case Enumere_Ressource_1.EGenreRessource.Commission:
				lTitre.push(
					ObjetChaine_1.GChaine.format(
						ObjetTraduction_1.GTraductions.getValeur(
							lNbAbs > 1
								? "AbsenceVS.commissionsDepuis"
								: "AbsenceVS.commissionDepuis",
						),
						[lNbAbs, aDetailAbsenceCourante.absence.getLibelle(), lStrDate],
					),
				);
				break;
			default:
				lTitre.push(
					ObjetChaine_1.GChaine.format(
						ObjetTraduction_1.GTraductions.getValeur(
							lNbAbs > 1
								? "AbsenceVS.sanctionsDepuis"
								: "AbsenceVS.sanctionDepuis",
						),
						[lNbAbs, aDetailAbsenceCourante.absence.getLibelle(), lStrDate],
					),
				);
		}
		this.getInstance(this.identFenetreAbsParCours).setOptionsFenetre({
			titre: lTitre.join(" - "),
		});
		const lGenreAbsence =
			"estExclusion" in aDetailAbsenceCourante.absence &&
			aDetailAbsenceCourante.absence.estExclusion
				? Enumere_Ressource_1.EGenreRessource.Exclusion
				: aDetailAbsenceCourante.genreAbsence;
		this.getInstance(this.identFenetreAbsParCours).setDonnees(
			null,
			null,
			true,
			aDonnee.eleve,
			aListeAbsences,
			lGenreAbsence,
			!!aDetailAbsenceCourante.absence.getNumero(),
		);
		this.getInstance(this.identFenetreAbsParCours).afficher();
	}
}
exports.InterfaceRecapPunitions = InterfaceRecapPunitions;
