exports.InterfaceRecapAbsences = exports.ObjetRequeteRecapAbsencesEleves =
	void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const _InterfaceRecapVS_1 = require("_InterfaceRecapVS");
const DonneesListe_RecapAbs_1 = require("DonneesListe_RecapAbs");
const ParamAffRecapAbsences_1 = require("ParamAffRecapAbsences");
const ObjetFenetre_EditionAbsencesNonReglees_1 = require("ObjetFenetre_EditionAbsencesNonReglees");
const Invocateur_1 = require("Invocateur");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDate_1 = require("ObjetDate");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeChoixComptabilisation_1 = require("TypeChoixComptabilisation");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const ObjetRequeteDetailAbsences_1 = require("ObjetRequeteDetailAbsences");
const ObjetRequeteListeRegimesEleve_1 = require("ObjetRequeteListeRegimesEleve");
const ObjetFenetre_ListePassageInfirmerie_1 = require("ObjetFenetre_ListePassageInfirmerie");
class ObjetRequeteRecapAbsencesEleves extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteRecapAbsencesEleves = ObjetRequeteRecapAbsencesEleves;
CollectionRequetes_1.Requetes.inscrire(
	"RecapAbsencesEleves",
	ObjetRequeteRecapAbsencesEleves,
);
class InterfaceRecapAbsences extends _InterfaceRecapVS_1._InterfaceRecapVS {
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
		this.identParamEtFiltres = this.add(
			ParamAffRecapAbsences_1.ParamAffRecapAbsences,
			this._evntSurParamAff,
		);
		this.identRecap = this.add(
			ObjetListe_1.ObjetListe,
			this._evntSurListe,
			this._initListe,
		);
		this.identFenetreDetailAbs = this.addFenetre(
			ObjetFenetre_EditionAbsencesNonReglees_1.ObjetFenetre_EditionAbsencesNonReglees,
			null,
			this._initFenetreDetailAbs,
		);
		this.identFenetreDetailInf = this.add(
			ObjetFenetre_ListePassageInfirmerie_1.ObjetFenetre_ListePassageInfirmerie,
		);
	}
	requeteCriteresSelection() {
		new ObjetRequeteListeRegimesEleve_1.ObjetRequeteListeRegimesEleve(
			this,
			this.surRecupererCriteresSelection,
		).lancerRequete({
			avecRegimesEleves: this.droits.gestionEtendueEleves,
			avecBourses:
				this.droits.gestionEtendueEleves &&
				GEtatUtilisateur.getGenreOnglet() ===
					Enumere_Onglet_1.EGenreOnglet.RecapAbsences,
			avecSeulementUtilises: true,
			avecAucun: true,
			avecMotifsAbsence: true,
			avecMotifsAbsRepas: this.droits.avecChoixRepas,
			avecMotifsAbsInternat: this.droits.avecChoixInternat,
			avecMotifsRetardInternat: this.droits.avecChoixInternat,
			avecCreneauxAppelAbsInternat: this.droits.avecChoixInternat,
			avecMotifsRetard: true,
			avecMotifsInfirmerie: this.droits.avecInfirmerie,
			avecIssuesInfirmerie: this.droits.avecInfirmerie,
			avecDetailElts: false,
			avecObservations: false,
		});
	}
	getCriteresSelectionParDefaut() {
		return {
			uniquementNonRA: false,
			uniquementPlusJeunesQue: false,
			borneAge: 18,
			avecGpeAbsences: true,
			typeDecompteAbs:
				TypeChoixComptabilisation_1.TypeChoixComptabilisation.DemiJBrutes,
			motifsAbsences: new ObjetListeElements_1.ObjetListeElements(),
			uniquementAbsSup: false,
			nbDJ_absSup: 0,
			uniquementTotalAbsSup: false,
			nbDJ_totalAbsSup: 0,
			uniquementAbsInjustifie: false,
			avecGpeAbsRepas: this.droits.avecChoixRepas,
			motifsAbsRepas: new ObjetListeElements_1.ObjetListeElements(),
			avecGpeAbsInternat: this.droits.avecChoixInternat,
			motifsAbsInternat: new ObjetListeElements_1.ObjetListeElements(),
			creneauxAppelAbsInternat: new ObjetListeElements_1.ObjetListeElements(),
			avecGpeRetardInternat: this.droits.avecChoixInternat,
			motifsRetardInternat: new ObjetListeElements_1.ObjetListeElements(),
			creneauxAppelRetardInternat:
				new ObjetListeElements_1.ObjetListeElements(),
			avecGpeRetard: true,
			motifsRetard: new ObjetListeElements_1.ObjetListeElements(),
			uniquementRetardSup: false,
			borneDureeRetard: 0,
			borneNbRetardInternat: 0,
			uniquementRetardInjustifie: false,
			uniquementRetardInternatSup: false,
			avecGpeInfirmerie: this.droits.avecInfirmerie,
			motifsInfirmerie: new ObjetListeElements_1.ObjetListeElements(),
			issuesInfirmerie: new ObjetListeElements_1.ObjetListeElements(),
		};
	}
	surRecupererDonneesRecap(aParamDonnees, aParam) {
		this.getInstance(this.identRecap).setDonnees(
			new DonneesListe_RecapAbs_1.DonneesListe_RecapAbs(
				aParam.ListeLignes,
				aParam.LigneCumul,
			),
		);
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
			this,
			() => {
				return {
					genreGenerationPDF:
						TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.RecapAbsences,
					classes: aParamDonnees.classes,
					regimes: aParamDonnees.regimes,
					bourses: aParamDonnees.bourses,
					criteres: aParamDonnees.criteresFiltres,
					domaine: aParamDonnees.domaine,
				};
			},
		);
	}
	requeteDonneesRecap(aParam) {
		if (aParam.classes) {
			aParam.classes.setSerialisateurJSON({ ignorerEtatsElements: true });
		}
		if (aParam.regimes) {
			aParam.regimes.setSerialisateurJSON({ ignorerEtatsElements: true });
		}
		if (aParam.bourses) {
			aParam.bourses.setSerialisateurJSON({ ignorerEtatsElements: true });
		}
		aParam.criteresFiltres.motifsAbsences.setSerialisateurJSON({
			ignorerEtatsElements: true,
		});
		aParam.criteresFiltres.motifsAbsInternat.setSerialisateurJSON({
			ignorerEtatsElements: true,
		});
		aParam.criteresFiltres.creneauxAppelAbsInternat.setSerialisateurJSON({
			ignorerEtatsElements: true,
		});
		aParam.criteresFiltres.creneauxAppelRetardInternat.setSerialisateurJSON({
			ignorerEtatsElements: true,
		});
		aParam.criteresFiltres.motifsAbsRepas.setSerialisateurJSON({
			ignorerEtatsElements: true,
		});
		aParam.criteresFiltres.motifsRetard.setSerialisateurJSON({
			ignorerEtatsElements: true,
		});
		aParam.criteresFiltres.motifsRetardInternat.setSerialisateurJSON({
			ignorerEtatsElements: true,
		});
		aParam.criteresFiltres.motifsInfirmerie.setSerialisateurJSON({
			ignorerEtatsElements: true,
		});
		aParam.criteresFiltres.issuesInfirmerie.setSerialisateurJSON({
			ignorerEtatsElements: true,
		});
		new ObjetRequeteRecapAbsencesEleves(
			this,
			this.surRecupererDonneesRecap.bind(this, aParam),
		).lancerRequete({
			classes: aParam.classes,
			regimes: aParam.regimes,
			bourses: aParam.bourses,
			criteres: aParam.criteresFiltres,
			domaine: aParam.domaine,
		});
	}
	afficherListeDetailAbs(aListe) {
		let lFenetreDetailAbs = this.getInstance(this.identFenetreDetailAbs);
		aListe.setTri([ObjetTri_1.ObjetTri.init("Position")]);
		aListe.trier(Enumere_TriElement_1.EGenreTriElement.Decroissant);
		lFenetreDetailAbs.setDonnees(aListe);
	}
	aFaireSurRecupererCriteresSelection(aParam) {
		$.extend(this._parametres.criteresFiltres, {
			motifsAbsences: aParam.listeMotifsAbsenceEleve,
			motifsRetard: aParam.listeMotifsRetards,
			motifsRetardInternat: aParam.listeMotifsRetardsInternat,
			motifsInfirmerie: aParam.listeMotifsInfirmerie,
			issuesInfirmerie: aParam.listeIssuesInfirmerie,
			motifsAbsRepas: aParam.listeMotifsAbsenceRepas,
			motifsAbsInternat: aParam.listeMotifsAbsenceInternat,
			creneauxAppelAbsInternat: aParam.listeCreneauxAppelAbsInternat,
			creneauxAppelRetardInternat: aParam.listeCreneauxAppelRetardInternat,
		});
		this.getInstance(this.identParamEtFiltres).setDonnees({
			selection: this._parametres.criteresFiltres,
			motifsAbsences: aParam.listeMotifsAbsenceEleve,
			motifsRetard: aParam.listeMotifsRetards,
			motifsRetardInternat: aParam.listeMotifsRetardsInternat,
			motifsInfirmerie: aParam.listeMotifsInfirmerie,
			issuesInfirmerie: aParam.listeIssuesInfirmerie,
			motifsAbsRepas: aParam.listeMotifsAbsenceRepas,
			motifsAbsInternat: aParam.listeMotifsAbsenceInternat,
			creneauxAppelAbsInternat: aParam.listeCreneauxAppelAbsInternat,
			creneauxAppelRetardInternat: aParam.listeCreneauxAppelRetardInternat,
		});
	}
	_initListe(aInstance) {
		const lColonnesCachees = [];
		if (!this.droits.avecChoixRepas) {
			lColonnesCachees.push(
				DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.nbAbsRepas,
			);
		}
		if (!this.droits.avecChoixInternat) {
			lColonnesCachees.push(
				DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.nbAbsInternat,
			);
			lColonnesCachees.push(
				DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.nbRetardInternat,
			);
		}
		if (!this.droits.gestionEtendueEleves) {
			lColonnesCachees.push(
				DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.regimes,
			);
		}
		if (
			!this.droits.gestionEtendueEleves ||
			GEtatUtilisateur.getGenreOnglet() !==
				Enumere_Onglet_1.EGenreOnglet.RecapAbsences
		) {
			lColonnesCachees.push(
				DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.bourses,
			);
		}
		if (!this.droits.avecInfirmerie) {
			lColonnesCachees.push(
				DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.nbInfirmerie,
			);
		}
		aInstance.setOptionsListe(
			{
				colonnes: this._getColonnesListe(),
				avecLigneTotal: true,
				scrollHorizontal: true,
				colonnesCachees: lColonnesCachees,
			},
			true,
		);
	}
	_initFenetreDetailAbs(aInstance) {
		aInstance.setAvecEdition(false);
	}
	_evntSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition: {
				let lGenreRessource;
				let lListeEvntVS;
				switch (aParametres.idColonne) {
					case DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes
						.nbAbsences:
						lGenreRessource = Enumere_Ressource_1.EGenreRessource.Absence;
						lListeEvntVS = aParametres.article.listeAbsences;
						break;
					case DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes
						.nbAbsRepas:
						lGenreRessource = Enumere_Ressource_1.EGenreRessource.AbsenceRepas;
						lListeEvntVS = aParametres.article.listeAbsRepas;
						break;
					case DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes
						.nbAbsInternat:
						lGenreRessource =
							Enumere_Ressource_1.EGenreRessource.AbsenceInternat;
						lListeEvntVS = aParametres.article.listeAbsInternat;
						break;
					case DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes
						.nbRetardInternat:
						lGenreRessource =
							Enumere_Ressource_1.EGenreRessource.RetardInternat;
						lListeEvntVS = aParametres.article.listeRetardInternat;
						break;
					case DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.nbRetards:
						lGenreRessource = Enumere_Ressource_1.EGenreRessource.Retard;
						lListeEvntVS = aParametres.article.listeRetard;
						break;
					case DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes
						.nbInfirmerie:
						lGenreRessource = Enumere_Ressource_1.EGenreRessource.Infirmerie;
						lListeEvntVS = aParametres.article.listeInfirmerie;
						break;
				}
				lListeEvntVS.setSerialisateurJSON({ ignorerEtatsElements: true });
				new ObjetRequeteListeRegimesEleve_1.ObjetRequeteListeRegimesEleve(
					this,
					this.surRecupererDetailAbsences.bind(
						this,
						aParametres.article,
						lGenreRessource,
					),
				).lancerRequete({
					avecRegimesEleves: false,
					avecBourses: false,
					avecMotifsAbsence: false,
					avecMotifsAbsRepas: false,
					avecMotifsAbsInternat: false,
					avecMotifsRetardInternat: false,
					avecCreneauxAppelAbsInternat: false,
					avecMotifsRetard: false,
					avecMotifsInfirmerie: false,
					avecIssuesInfirmerie: false,
					avecDetailElts: true,
					genreRessource: lGenreRessource,
					listeElts: lListeEvntVS,
				});
				break;
			}
		}
	}
	_evntSurParamAff(aParam) {
		switch (aParam.evnt) {
			case ParamAffRecapAbsences_1.ParamAffRecapAbsences.GenreCallback
				.actualiserDonnees:
				if (aParam.avecModifCBGpe) {
					this._actualiserVisibiliteColonnes();
				}
				if (aParam.avecModifChoixCompta) {
					this._actualiserTitresSelonTypeCompta();
				}
				this.requeteDonneesRecap(this._parametres);
				break;
		}
	}
	_actualiserVisibiliteColonnes() {
		const lColonnesCachees = [];
		if (!this._parametres.criteresFiltres.avecGpeAbsences) {
			lColonnesCachees.push(
				DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.nbAbsences,
			);
			lColonnesCachees.push(
				DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.totalAbsences,
			);
			lColonnesCachees.push(
				DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.justifies,
			);
			lColonnesCachees.push(
				DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.injustifiees,
			);
			lColonnesCachees.push(
				DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.tauxAbsenteisme,
			);
		}
		if (
			!this.droits.avecChoixRepas ||
			!this._parametres.criteresFiltres.avecGpeAbsRepas
		) {
			lColonnesCachees.push(
				DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.nbAbsRepas,
			);
		}
		if (
			!this.droits.avecChoixInternat ||
			!this._parametres.criteresFiltres.avecGpeAbsInternat
		) {
			lColonnesCachees.push(
				DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.nbAbsInternat,
			);
		}
		if (
			!this.droits.avecChoixInternat ||
			!this._parametres.criteresFiltres.avecGpeRetardInternat
		) {
			lColonnesCachees.push(
				DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.nbRetardInternat,
			);
		}
		if (!this.droits.gestionEtendueEleves) {
			lColonnesCachees.push(
				DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.regimes,
			);
		}
		if (
			!this.droits.gestionEtendueEleves ||
			GEtatUtilisateur.getGenreOnglet() !==
				Enumere_Onglet_1.EGenreOnglet.RecapAbsences
		) {
			lColonnesCachees.push(
				DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.bourses,
			);
		}
		if (!this._parametres.criteresFiltres.avecGpeRetard) {
			lColonnesCachees.push(
				DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.nbRetards,
			);
			lColonnesCachees.push(
				DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.minutesRetard,
			);
		}
		if (
			!this.droits.avecInfirmerie ||
			!this._parametres.criteresFiltres.avecGpeInfirmerie
		) {
			lColonnesCachees.push(
				DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.nbInfirmerie,
			);
		}
		this.getInstance(this.identRecap).setOptionsListe(
			{ colonnesCachees: lColonnesCachees },
			true,
		);
	}
	_actualiserTitresSelonTypeCompta() {
		this.getInstance(this.identRecap).setOptionsListe({
			colonnes: this._getColonnesListe(),
		});
	}
	surRecupererDetailAbsences(aDonnee, aGenreRessourceCourante, aParam) {
		const lDate = IE.Cycles.dateDebutCycle(
			this._parametres.domaine.getPremierePosition(),
		);
		const lStrDate = ObjetDate_1.GDate.formatDate(lDate, "%JJ/%MM/%AAAA");
		const lTitre = [aDonnee.eleve.getLibelle()];
		let lFenetreDetailAbs = this.getInstance(this.identFenetreDetailAbs);
		switch (aGenreRessourceCourante) {
			case Enumere_Ressource_1.EGenreRessource.Absence: {
				let lNbDJ;
				const lTypeCompta = this._parametres.criteresFiltres.typeDecompteAbs;
				if (
					lTypeCompta !==
					TypeChoixComptabilisation_1.TypeChoixComptabilisation.HeuresDeCours
				) {
					lTitre.push(
						ObjetTraduction_1.GTraductions.getValeur(
							aDonnee.nbAbs > 1 ? "AbsenceVS.xAbsences" : "AbsenceVS.xAbsence",
							[aDonnee.nbAbs],
						),
					);
					lNbDJ = aDonnee.totalAbs;
				}
				switch (lTypeCompta) {
					case TypeChoixComptabilisation_1.TypeChoixComptabilisation
						.HeuresDeCours:
						break;
					case TypeChoixComptabilisation_1.TypeChoixComptabilisation
						.DemiJBrutes:
						lTitre.push(
							ObjetTraduction_1.GTraductions.getValeur(
								lNbDJ > 1
									? "AbsenceVS.DJBrutesDepuis"
									: "AbsenceVS.DJBruteDepuis",
								[lNbDJ, lStrDate],
							),
						);
						break;
					case TypeChoixComptabilisation_1.TypeChoixComptabilisation
						.DemiJCalculees:
						lTitre.push(
							ObjetTraduction_1.GTraductions.getValeur(
								lNbDJ > 1
									? "AbsenceVS.DJCalculeesDepuis"
									: "AbsenceVS.DJCalculeeDepuis",
								[lNbDJ, lStrDate],
							),
						);
						break;
					case TypeChoixComptabilisation_1.TypeChoixComptabilisation
						.DemiJBulletin:
						lTitre.push(
							ObjetTraduction_1.GTraductions.getValeur(
								lNbDJ > 1
									? "AbsenceVS.DJBulletinsDepuis"
									: "AbsenceVS.DJBullDepuis",
								[lNbDJ, lStrDate],
							),
						);
						break;
				}
				if (
					lTypeCompta !==
					TypeChoixComptabilisation_1.TypeChoixComptabilisation.HeuresDeCours
				) {
					lFenetreDetailAbs.setOptionsFenetre({ titre: lTitre.join(" - ") });
					lFenetreDetailAbs.setParametres({
						avecLibelleDateSurPremiereColonne: false,
						avecDuree: false,
						avecDureeAbsence: false,
					});
					this.afficherListeDetailAbs(aParam.listeAbsences);
				} else {
					new ObjetRequeteDetailAbsences_1.ObjetRequeteDetailAbsences(
						this,
						this.actionSurRecupererDetailAbsences.bind(this, aDonnee),
					).lancerRequete({
						eleve: aDonnee.eleve,
						domaine: this._parametres.domaine,
						genreAbsence: Enumere_Ressource_1.EGenreRessource.Absence,
						listeAbsences: aDonnee.listeAbsences,
					});
				}
				break;
			}
			case Enumere_Ressource_1.EGenreRessource.AbsenceRepas:
				lTitre.push(
					ObjetTraduction_1.GTraductions.getValeur(
						aDonnee.nbAbsRepas > 1
							? "AbsenceVS.absencesRepasDepuis"
							: "AbsenceVS.absRepasDepuis",
						[aDonnee.nbAbsRepas, lStrDate],
					),
				);
				lFenetreDetailAbs.setOptionsFenetre({ titre: lTitre.join(" - ") });
				lFenetreDetailAbs.setParametres({
					avecLibelleDateSurPremiereColonne: true,
				});
				this.afficherListeDetailAbs(aParam.listeAbsRepas);
				break;
			case Enumere_Ressource_1.EGenreRessource.AbsenceInternat:
				lTitre.push(
					ObjetTraduction_1.GTraductions.getValeur(
						aDonnee.nbAbsInternat > 1
							? "AbsenceVS.absencesInternatDepuis"
							: "AbsenceVS.absInternatDepuis",
						[aDonnee.nbAbsInternat, lStrDate],
					),
				);
				lFenetreDetailAbs.setOptionsFenetre({ titre: lTitre.join(" - ") });
				lFenetreDetailAbs.setParametres({
					avecLibelleDateSurPremiereColonne: false,
					avecDuree: false,
					avecDureeAbsence: false,
				});
				this.afficherListeDetailAbs(aParam.listeAbsInternat);
				break;
			case Enumere_Ressource_1.EGenreRessource.RetardInternat:
				lTitre.push(
					ObjetTraduction_1.GTraductions.getValeur(
						aDonnee.nbRetardInternat > 1
							? "AbsenceVS.retardsInternatDepuis"
							: "AbsenceVS.retardInternatDepuis",
						[aDonnee.nbRetardInternat, lStrDate],
					),
				);
				lFenetreDetailAbs.setOptionsFenetre({ titre: lTitre.join(" - ") });
				lFenetreDetailAbs.setParametres({
					avecLibelleDateSurPremiereColonne: true,
					avecDuree: true,
					avecDureeAbsence: false,
				});
				this.afficherListeDetailAbs(aParam.listeRetardInternat);
				break;
			case Enumere_Ressource_1.EGenreRessource.Retard:
				lTitre.push(
					ObjetTraduction_1.GTraductions.getValeur(
						aDonnee.nbRetards > 1
							? "AbsenceVS.retardsDepuis"
							: "AbsenceVS.retardDepuis",
						[aDonnee.nbRetards, lStrDate],
					),
				);
				lFenetreDetailAbs.setOptionsFenetre({ titre: lTitre.join(" - ") });
				lFenetreDetailAbs.setParametres({
					avecLibelleDateSurPremiereColonne: true,
					avecDuree: true,
					avecDureeAbsence: false,
				});
				this.afficherListeDetailAbs(aParam.listeRetards);
				break;
			case Enumere_Ressource_1.EGenreRessource.Infirmerie:
				lTitre.push(
					ObjetTraduction_1.GTraductions.getValeur(
						aDonnee.nbInfirmerie > 1
							? "AbsenceVS.passagesInfDepuis"
							: "AbsenceVS.passInfDepuis",
						[aDonnee.nbInfirmerie, lStrDate],
					),
				);
				aParam.listeInfirmerie.setTri([ObjetTri_1.ObjetTri.init("Position")]);
				aParam.listeInfirmerie.trier(
					Enumere_TriElement_1.EGenreTriElement.Decroissant,
				);
				this.getInstance(this.identFenetreDetailInf).setDonnees(
					aParam.listeInfirmerie,
				);
				this.getInstance(this.identFenetreDetailInf).setOptionsFenetre({
					titre: lTitre.join(" - "),
				});
				break;
		}
	}
	actionSurRecupererDetailAbsences(aDonnee, aListeAbsences) {
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
		lTitre.push(
			ObjetTraduction_1.GTraductions.getValeur(
				lNbAbs > 1
					? "AbsenceVS.coursManquesDepuis"
					: "AbsenceVS.coursManqueDepuis",
				[lNbAbs, lStrDate],
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
			Enumere_Ressource_1.EGenreRessource.Absence,
		);
		this.getInstance(this.identFenetreAbsParCours).afficher();
	}
	_getColonnesListe() {
		const lNotHeuresDeCours =
			this._parametres.criteresFiltres.typeDecompteAbs !==
			TypeChoixComptabilisation_1.TypeChoixComptabilisation.HeuresDeCours;
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.eleves,
			titre: ObjetTraduction_1.GTraductions.getValeur("RecapAbs.colEleves"),
			taille: 200,
		});
		lColonnes.push({
			id: DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.classes,
			titre: ObjetTraduction_1.GTraductions.getValeur("RecapAbs.colClasses"),
			taille: 100,
		});
		lColonnes.push({
			id: DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.dateNaissance,
			titre: ObjetTraduction_1.GTraductions.getValeur("RecapAbs.colNaiss"),
			taille: 100,
		});
		lColonnes.push({
			id: DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.regimes,
			titre: ObjetTraduction_1.GTraductions.getValeur("RecapAbs.colRegime"),
			taille: 300,
		});
		lColonnes.push({
			id: DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.bourses,
			titre: ObjetTraduction_1.GTraductions.getValeur("RecapAbs.colBourse"),
			taille: 200,
		});
		lColonnes.push({
			id: DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.nbAbsences,
			titre: [
				{
					libelle:
						ObjetTraduction_1.GTraductions.getValeur("RecapAbs.gpeColAbs"),
					avecFusionColonne: true,
				},
				{
					libelle:
						ObjetTraduction_1.GTraductions.getValeur("RecapAbs.colNbAbs"),
				},
			],
			taille: 60,
		});
		lColonnes.push({
			id: DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.totalAbsences,
			titre: [
				{
					libelle:
						ObjetTraduction_1.GTraductions.getValeur("RecapAbs.gpeColAbs"),
					avecFusionColonne: true,
				},
				{
					libelleHtml: lNotHeuresDeCours
						? ObjetTraduction_1.GTraductions.getValeur(
								"RecapAbs.colTotDemi",
							).replace(" ", "<br>")
						: ObjetTraduction_1.GTraductions.getValeur(
								"RecapAbs.colDureeTot",
							).replace(" ", "<br>"),
				},
			],
			taille: 60,
		});
		lColonnes.push({
			id: DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.justifies,
			titre: [
				{
					libelle:
						ObjetTraduction_1.GTraductions.getValeur("RecapAbs.gpeColAbs"),
					avecFusionColonne: true,
				},
				{
					libelle: lNotHeuresDeCours
						? ObjetTraduction_1.GTraductions.getValeur(
								"RecapAbs.gpeColAbsJustDJ",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"RecapAbs.gpeColAbsJust",
							),
					avecFusionColonne: true,
				},
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("RecapAbs.colOui"),
				},
			],
			taille: 60,
		});
		lColonnes.push({
			id: DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.injustifiees,
			titre: [
				{
					libelle:
						ObjetTraduction_1.GTraductions.getValeur("RecapAbs.gpeColAbs"),
					avecFusionColonne: true,
				},
				{
					libelle: lNotHeuresDeCours
						? ObjetTraduction_1.GTraductions.getValeur(
								"RecapAbs.gpeColAbsJustDJ",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"RecapAbs.gpeColAbsJust",
							),
					avecFusionColonne: true,
				},
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("RecapAbs.colNon"),
				},
			],
			taille: 60,
		});
		lColonnes.push({
			id: DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes
				.tauxAbsenteisme,
			titre: [
				{
					libelle:
						ObjetTraduction_1.GTraductions.getValeur("RecapAbs.gpeColAbs"),
					avecFusionColonne: true,
				},
				{
					libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
						"RecapAbs.colTauxAbsenteismeCourt",
					),
				},
			],
			taille: 60,
		});
		lColonnes.push({
			id: DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.nbAbsRepas,
			titre: {
				libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
					"RecapAbs.colRepas",
				).replace(" ", "<br>"),
			},
			taille: 60,
		});
		lColonnes.push({
			id: DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.nbAbsInternat,
			titre: {
				libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
					"RecapAbs.colInternat",
				).replace(" ", "<br>"),
			},
			taille: 60,
		});
		lColonnes.push({
			id: DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.nbRetards,
			titre: [
				{
					libelle:
						ObjetTraduction_1.GTraductions.getValeur("RecapAbs.colRetard"),
					avecFusionColonne: true,
				},
				{
					libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
						"RecapAbs.colRetardCourt",
					),
				},
			],
			taille: 30,
		});
		lColonnes.push({
			id: DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.minutesRetard,
			titre: [
				{
					libelle:
						ObjetTraduction_1.GTraductions.getValeur("RecapAbs.colRetard"),
					avecFusionColonne: true,
				},
				{
					libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
						"RecapAbs.colMinutesRetard",
					),
				},
			],
			taille: 60,
		});
		lColonnes.push({
			id: DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes
				.nbRetardInternat,
			titre: {
				libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
					"RecapAbs.colRetardInternat",
				).replace(" ", "<br>"),
			},
			taille: 60,
		});
		lColonnes.push({
			id: DonneesListe_RecapAbs_1.DonneesListe_RecapAbs.colonnes.nbInfirmerie,
			titre: ObjetTraduction_1.GTraductions.getValeur("RecapAbs.colInfirmerie"),
			taille: 70,
		});
		return lColonnes;
	}
}
exports.InterfaceRecapAbsences = InterfaceRecapAbsences;
