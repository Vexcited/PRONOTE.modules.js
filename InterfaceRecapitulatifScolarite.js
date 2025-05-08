exports.InterfaceRecapitulatifScolarite = void 0;
const ObjetRequeteRecapitulatifScolarite_1 = require("ObjetRequeteRecapitulatifScolarite");
const ObjetRequeteListeRegimesEleve_1 = require("ObjetRequeteListeRegimesEleve");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_CalendrierAnnuel_1 = require("ObjetFenetre_CalendrierAnnuel");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const DonneesListe_RecapitulatifScolarite_1 = require("DonneesListe_RecapitulatifScolarite");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const TypeColonneRecapScolarite_1 = require("TypeColonneRecapScolarite");
const ObjetFenetre_DetailAbsences_1 = require("ObjetFenetre_DetailAbsences");
const ObjetFenetre_EditionAbsencesNonReglees_1 = require("ObjetFenetre_EditionAbsencesNonReglees");
const ObjetRequeteDetailAbsences_1 = require("ObjetRequeteDetailAbsences");
class InterfaceRecapitulatifScolarite extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = GApplication;
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
	}
	construireInstances() {
		this.IdentTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this.evenementTripleCombo.bind(this),
			this.initialiserTripleCombo,
		);
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListe,
		);
		this.identFenetreDetailAbs = this.addFenetre(
			ObjetFenetre_EditionAbsencesNonReglees_1.ObjetFenetre_EditionAbsencesNonReglees,
			null,
			this._initFenetreDetailAbs,
		);
		this.identFenetreDefautCarnet = this.addFenetre(
			ObjetFenetre_CalendrierAnnuel_1.ObjetFenetre_CalendrierAnnuel,
			null,
			this._initFenetreDefautCarnet,
		);
		this.identFenetreAbsParCours = this.addFenetre(
			ObjetFenetre_DetailAbsences_1.ObjetFenetre_DetailAbsences,
			null,
			this._initFenetreAbsParCours,
		);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = true;
		this.AddSurZone = [this.IdentTripleCombo];
	}
	_initialiserListe(aInstance, aListeColonnesJSON) {
		const lListeColonnes = [];
		let lAvecCumul = false;
		aListeColonnesJSON.parcourir((aCol) => {
			if (
				aCol.genreRecapScolarite ===
					TypeColonneRecapScolarite_1.TypeColonneRecapScolarite
						.CRS_AutreObservation ||
				aCol.genreRecapScolarite ===
					TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_Mention
			) {
				lAvecCumul = true;
				return true;
			}
		});
		aListeColonnesJSON.parcourir((aCol) => {
			let lIdColonne;
			if (
				aCol.genreRecapScolarite ===
				TypeColonneRecapScolarite_1.TypeColonneRecapScolarite
					.CRS_AutreObservation
			) {
				lIdColonne =
					DonneesListe_RecapitulatifScolarite_1
						.DonneesListe_RecapitulatifScolarite.prefixeColonnes
						.autreObservations + aCol.getGenre();
			} else if (
				aCol.genreRecapScolarite ===
				TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_Mention
			) {
				lIdColonne =
					DonneesListe_RecapitulatifScolarite_1
						.DonneesListe_RecapitulatifScolarite.prefixeColonnes.mentions +
					aCol.getGenre();
			} else {
				lIdColonne =
					DonneesListe_RecapitulatifScolarite_1
						.DonneesListe_RecapitulatifScolarite.prefixeColonnes.default +
					aCol.genreRecapScolarite;
			}
			const lColonne = {
				id: lIdColonne,
				taille: this._getTailleDeTypeRecapScolarite(aCol.genreRecapScolarite),
			};
			if (lAvecCumul) {
				if (aCol.colCumul) {
					lColonne.titre = [
						{ libelle: aCol.colCumul, avecFusionColonne: true },
						{ libelle: aCol.getLibelle() },
					];
				} else {
					lColonne.titre = aCol.getLibelle();
				}
			} else {
				lColonne.titre = aCol.getLibelle();
			}
			lListeColonnes.push(lColonne);
		});
		const lOptionsListe = {
			colonnes: lListeColonnes,
			avecLigneTotal: true,
			scrollHorizontal: true,
			avecTri: false,
		};
		aInstance.setOptionsListe(lOptionsListe, true);
	}
	_formaterDonnees(aListeDonnees) {
		const lListeFormatee = new ObjetListeElements_1.ObjetListeElements();
		let lCumulCourant;
		for (const lElt of aListeDonnees) {
			if (!lElt.estTotal) {
				if (lElt.estUnDeploiement) {
					lCumulCourant = lElt;
				} else {
					if (lCumulCourant) {
						lElt.pere = lCumulCourant;
					}
				}
				lListeFormatee.addElement(lElt);
			}
		}
		return lListeFormatee;
	}
	_actionSurRequeteRecapitulatifScolarite(aJSON) {
		this.donnees = aJSON;
		this._initialiserListe(this.getInstance(this.identListe), aJSON.colonnes);
		const lListeFormattee = this._formaterDonnees(aJSON.listeLignes);
		let lLigneTotal = null;
		for (const lObj of aJSON.listeLignes) {
			if (lObj.estTotal) {
				lLigneTotal = lObj;
				break;
			}
		}
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_RecapitulatifScolarite_1.DonneesListe_RecapitulatifScolarite(
				lListeFormattee,
				lLigneTotal,
			),
		);
		this.surResizeInterface();
	}
	afficherListeDetailAbs(aListe) {
		aListe.setTri([ObjetTri_1.ObjetTri.init("Position")]);
		aListe.trier(Enumere_TriElement_1.EGenreTriElement.Decroissant);
		this.getInstance(this.identFenetreDetailAbs).setDonnees(aListe);
	}
	_evenementSurListe(aParametres) {
		let lGenreRessource;
		let lListeEvntVS;
		let lNatureObservation;
		const lIndexColonne = aParametres.colonne;
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition: {
				switch (aParametres.idColonne) {
					case DonneesListe_RecapitulatifScolarite_1
						.DonneesListe_RecapitulatifScolarite.colonnes.Absence:
						lGenreRessource = Enumere_Ressource_1.EGenreRessource.Absence;
						lListeEvntVS = aParametres.article.listeAbsences;
						break;
					case DonneesListe_RecapitulatifScolarite_1
						.DonneesListe_RecapitulatifScolarite.colonnes.Retard:
						lGenreRessource = Enumere_Ressource_1.EGenreRessource.Retard;
						lListeEvntVS = aParametres.article.listeRetards;
						break;
					case DonneesListe_RecapitulatifScolarite_1
						.DonneesListe_RecapitulatifScolarite.colonnes.Exclusion:
						lGenreRessource = Enumere_Ressource_1.EGenreRessource.Exclusion;
						lListeEvntVS = aParametres.article.listeExclusions;
						break;
					case DonneesListe_RecapitulatifScolarite_1
						.DonneesListe_RecapitulatifScolarite.colonnes.Punition:
						lGenreRessource = Enumere_Ressource_1.EGenreRessource.Punition;
						lListeEvntVS = aParametres.article.listePunitions;
						break;
					case DonneesListe_RecapitulatifScolarite_1
						.DonneesListe_RecapitulatifScolarite.colonnes.Sanction:
						lGenreRessource = Enumere_Ressource_1.EGenreRessource.Sanction;
						lListeEvntVS = aParametres.article.listeSanctions;
						break;
					default:
						lGenreRessource = Enumere_Ressource_1.EGenreRessource.Observation;
						lNatureObservation = this.donnees.colonnes.get(lIndexColonne);
						break;
				}
				const lDetailAbsenceCourant = {
					genreAbsence: lGenreRessource,
					observation: null,
				};
				if (!!lListeEvntVS) {
					lListeEvntVS.setSerialisateurJSON({ ignorerEtatsElements: true });
				}
				if (
					[
						Enumere_Ressource_1.EGenreRessource.Absence,
						Enumere_Ressource_1.EGenreRessource.Retard,
					].includes(lGenreRessource)
				) {
					if (lGenreRessource === Enumere_Ressource_1.EGenreRessource.Absence) {
						$.extend(lDetailAbsenceCourant, {
							nbDJBull: aParametres.article.colonnes[lIndexColonne],
						});
					}
					new ObjetRequeteListeRegimesEleve_1.ObjetRequeteListeRegimesEleve(
						this,
						this.surRecupererDetailRegimes.bind(
							this,
							aParametres.article,
							lDetailAbsenceCourant,
						),
					).lancerRequete({
						avecRegimesEleves: false,
						avecMotifsAbsence: false,
						avecMotifsAbsRepas: false,
						avecMotifsAbsInternat: false,
						avecMotifsRetard: false,
						avecMotifsInfirmerie: false,
						avecIssuesInfirmerie: false,
						avecDetailElts: true,
						genreRessource: lGenreRessource,
						listeElts: lListeEvntVS,
					});
				} else {
					const lClasse = this.donnees.listeClasses.getElementParNumero(
						aParametres.article.classe.getNumero(),
					);
					const lParam = {
						eleve: aParametres.article,
						dateDebut: lClasse.dateDebutVS,
						dateFin: lClasse.dateFinVS,
						genreAbsence: lGenreRessource,
					};
					if (
						[
							Enumere_Ressource_1.EGenreRessource.Exclusion,
							Enumere_Ressource_1.EGenreRessource.Punition,
							Enumere_Ressource_1.EGenreRessource.Sanction,
						].includes(lGenreRessource)
					) {
						$.extend(lParam, { listeAbsences: lListeEvntVS });
					} else {
						$.extend(lDetailAbsenceCourant, {
							observation: lNatureObservation,
						});
						$.extend(lParam, {
							observation: lDetailAbsenceCourant.observation,
						});
					}
					new ObjetRequeteDetailAbsences_1.ObjetRequeteDetailAbsences(
						this,
						this.actionSurRecupererDetailAbsences.bind(
							this,
							aParametres.article,
							lDetailAbsenceCourant,
						),
					).lancerRequete(lParam);
				}
				break;
			}
		}
	}
	initialiserTripleCombo(aInstance) {
		aInstance.setParametres(
			[
				Enumere_Ressource_1.EGenreRessource.Classe,
				Enumere_Ressource_1.EGenreRessource.Periode,
			],
			true,
		);
	}
	evenementTripleCombo() {
		const lParamsRequete = {
			classes: this.etatUtilisateurSco.Navigation.getRessources(
				Enumere_Ressource_1.EGenreRessource.Classe,
			),
			periode: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
			),
		};
		lParamsRequete.classes.setSerialisateurJSON({ ignorerEtatsElements: true });
		new ObjetRequeteRecapitulatifScolarite_1.ObjetRequeteRecapitulatifScolarite(
			this,
			this._actionSurRequeteRecapitulatifScolarite,
		).lancerRequete(lParamsRequete);
	}
	_getTailleDeTypeRecapScolarite(aGenre) {
		switch (aGenre) {
			case TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_Classe:
				return 100;
			case TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_Eleve:
				return 200;
			case TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_Naissance:
				return 90;
			case TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_Regime:
				return 200;
		}
		return 70;
	}
	_initFenetreDetailAbs(aInstance) {
		aInstance.setOptionsFenetre({ modale: false });
		aInstance.setAvecEdition(false);
	}
	_initFenetreDefautCarnet(aInstance) {
		aInstance.setOptionsFenetre({
			modale: false,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CarnetCorrespondance.DefautCarnet",
			),
			largeur: 650,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
	}
	_initFenetreAbsParCours(aInstance) {
		aInstance.setOptionsFenetre({
			modale: false,
			largeur: 600,
			hauteur: 350,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("principal.fermer"),
			],
		});
	}
	_getStrDateDepuis(aDonnee) {
		const lClasse = this.donnees.listeClasses.getElementParNumero(
			aDonnee.classe.getNumero(),
		);
		return ObjetDate_1.GDate.formatDate(lClasse.dateDebutVS, "%JJ/%MM/%AAAA");
	}
	actionSurRecupererDetailAbsences(
		aDonnee,
		aDetailAbsenceCourant,
		aListeAbsences,
	) {
		const lStrDate = this._getStrDateDepuis(aDonnee);
		const lGenreRessource = aDetailAbsenceCourant.genreAbsence;
		const lEstGenrePunition = [
			Enumere_Ressource_1.EGenreRessource.Exclusion,
			Enumere_Ressource_1.EGenreRessource.Punition,
			Enumere_Ressource_1.EGenreRessource.Sanction,
		].includes(lGenreRessource);
		const lEstDefautCarnet =
			!lEstGenrePunition &&
			aDetailAbsenceCourant.observation.getGenre() ===
				TypeColonneRecapScolarite_1.TypeColonneRecapScolarite.CRS_DefautCarnet;
		let lTitreFenetre;
		if (lEstDefautCarnet) {
			lTitreFenetre = ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.defautCarnetDepuis",
				[aDonnee.getLibelle(), lStrDate],
			);
			this.afficherFenetreDefautDeCarnet(
				lTitreFenetre,
				aListeAbsences,
				aDonnee.classe,
			);
		} else {
			const lArrayTitreFenetre = [aDonnee.getLibelle()];
			let lNbAbs = 0;
			const lNbr = aListeAbsences.listeAbsences.count();
			for (let i = 0; i < lNbr; i++) {
				if (!aListeAbsences.listeAbsences.get(i).estUnDeploiement) {
					lNbAbs++;
				}
			}
			let lTraduc;
			let lTabStr = [lNbAbs, lStrDate];
			switch (lGenreRessource) {
				case Enumere_Ressource_1.EGenreRessource.Exclusion:
					lTraduc =
						lNbAbs > 1
							? "AbsenceVS.exclusionsDepuis"
							: "AbsenceVS.exclusionDepuis";
					break;
				case Enumere_Ressource_1.EGenreRessource.Punition:
					lTraduc =
						lNbAbs > 1
							? "AbsenceVS.punitionsDepuis"
							: "AbsenceVS.punitionDepuis";
					break;
				case Enumere_Ressource_1.EGenreRessource.Sanction:
					lTraduc =
						lNbAbs > 1
							? "AbsenceVS.sanctionsSansNatureDepuis"
							: "AbsenceVS.sanctionSansNatureDepuis";
					break;
				case Enumere_Ressource_1.EGenreRessource.Observation:
					lTraduc = lNbAbs > 1 ? "AbsenceVS.obssDepuis" : "AbsenceVS.obsDepuis";
					lTabStr = [
						lNbAbs,
						aDetailAbsenceCourant.observation.getLibelle(),
						lStrDate,
					];
					break;
			}
			lArrayTitreFenetre.push(
				ObjetTraduction_1.GTraductions.getValeur(lTraduc, lTabStr),
			);
			lTitreFenetre = lArrayTitreFenetre.join(" - ");
			const lEstAvecAccuseReception =
				lGenreRessource === Enumere_Ressource_1.EGenreRessource.Observation
					? aDetailAbsenceCourant.observation.avecARObservation
					: false;
			this.afficherFenetreAbsenceParCours(
				lTitreFenetre,
				aDonnee,
				aListeAbsences,
				lGenreRessource,
				lEstAvecAccuseReception,
			);
		}
	}
	afficherFenetreDefautDeCarnet(aTitreFenetre, aListeAbsences, aClasse) {
		const lListeCDC = aListeAbsences.listeAbsences.getListeElements(
			(element) => {
				return element.estUnDeploiement !== true;
			},
		);
		lListeCDC.parcourir((aDefautDeCarnet) => {
			aDefautDeCarnet.date = ObjetDate_1.GDate.placeAnnuelleEnDate(
				aDefautDeCarnet.placeDebut,
			);
		});
		const lClasse = this.donnees.listeClasses.getElementParNumero(
			aClasse.getNumero(),
		);
		const lFenetreDefautCarnet = this.getInstance(
			this.identFenetreDefautCarnet,
		);
		if (!!aTitreFenetre) {
			lFenetreDefautCarnet.setOptionsFenetre({ titre: aTitreFenetre });
		}
		lFenetreDefautCarnet.afficherDefautCarnet(
			{ premiereDate: lClasse.dateDebutVS, derniereDate: lClasse.dateFinVS },
			lListeCDC,
		);
	}
	afficherFenetreAbsenceParCours(
		aTitreFenetre,
		aDonnee,
		aListeAbsences,
		aGenreRessource,
		aEstAvecAccuseReception,
	) {
		const lFenetreAbsParCours = this.getInstance(this.identFenetreAbsParCours);
		lFenetreAbsParCours.setOptionsFenetre({ titre: aTitreFenetre });
		lFenetreAbsParCours.setDonnees(
			null,
			null,
			true,
			aDonnee,
			aListeAbsences,
			aGenreRessource,
			aEstAvecAccuseReception,
		);
		lFenetreAbsParCours.afficher();
	}
	surRecupererDetailRegimes(aDonnee, aDetailAbsenceCourant, aParam) {
		const lStrDate = this._getStrDateDepuis(aDonnee);
		const lFenetreDetailAbs = this.getInstance(this.identFenetreDetailAbs);
		const lTitre = [aDonnee.getLibelle()];
		let lNbrAbs = 0;
		switch (aDetailAbsenceCourant.genreAbsence) {
			case Enumere_Ressource_1.EGenreRessource.Absence: {
				let lNbDJ;
				lNbrAbs = aDonnee.listeAbsences.count();
				lTitre.push(
					ObjetTraduction_1.GTraductions.getValeur(
						lNbrAbs > 1 ? "AbsenceVS.xAbsences" : "AbsenceVS.xAbsence",
						[lNbrAbs],
					),
				);
				lNbDJ = aDetailAbsenceCourant.nbDJBull;
				lTitre.push(
					ObjetTraduction_1.GTraductions.getValeur(
						lNbDJ > 1
							? "AbsenceVS.DJBulletinsDepuis"
							: "AbsenceVS.DJBullDepuis",
						[lNbDJ, lStrDate],
					),
				);
				lFenetreDetailAbs.setOptionsFenetre({ titre: lTitre.join(" - ") });
				lFenetreDetailAbs.setParametres({
					avecDureeAbsence: true,
					avecDuree: false,
				});
				this.afficherListeDetailAbs(aParam.listeAbsences);
				break;
			}
			case Enumere_Ressource_1.EGenreRessource.Retard: {
				const lNbrRetards = aDonnee.listeRetards.count();
				lTitre.push(
					ObjetTraduction_1.GTraductions.getValeur(
						lNbrRetards > 1
							? "AbsenceVS.retardsDepuis"
							: "AbsenceVS.retardDepuis",
						[lNbrRetards, lStrDate],
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
			}
		}
	}
}
exports.InterfaceRecapitulatifScolarite = InterfaceRecapitulatifScolarite;
