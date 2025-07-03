exports.InterfaceSuiviJustificationsAbsRetards = void 0;
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetSelecteurTypeRessourceAbsence_1 = require("ObjetSelecteurTypeRessourceAbsence");
const ObjetSelecteurClasseGpe_1 = require("ObjetSelecteurClasseGpe");
const ObjetSelecteurRegimeEleve_1 = require("ObjetSelecteurRegimeEleve");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetListe_1 = require("ObjetListe");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_SelectionMotif_1 = require("ObjetFenetre_SelectionMotif");
const InterfacePage_1 = require("InterfacePage");
const ObjetRequeteListeRegimesEleve_1 = require("ObjetRequeteListeRegimesEleve");
const DonneesListe_SuiviJustificationsAbsRetards_1 = require("DonneesListe_SuiviJustificationsAbsRetards");
const TypeFusionTitreListe_1 = require("TypeFusionTitreListe");
const UtilitaireListePeriodes_1 = require("UtilitaireListePeriodes");
const TypeHttpSaisieAbsencesGrille_1 = require("TypeHttpSaisieAbsencesGrille");
const TypeRessourceAbsence_1 = require("TypeRessourceAbsence");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetRequeteSaisieAbsencesGrille_1 = require("ObjetRequeteSaisieAbsencesGrille");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetFenetre_Date_1 = require("ObjetFenetre_Date");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetFenetre_SuiviUnique_1 = require("ObjetFenetre_SuiviUnique");
const AccessApp_1 = require("AccessApp");
class ObjetRequeteSuiviJustificationsAbsencesRetards extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
CollectionRequetes_1.Requetes.inscrire(
	"SuiviJustificationsAbsencesRetards",
	ObjetRequeteSuiviJustificationsAbsencesRetards,
);
class InterfaceSuiviJustificationsAbsRetards extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.cacheListes = {
			periodes:
				UtilitaireListePeriodes_1.TUtilitaireListePeriodes.construireListePeriodes(
					[
						UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix.aujourdhui,
						UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix
							.semainePrecedente,
						UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix
							.semaineCourante,
						UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix
							.moisCourant,
						UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix.annee,
						UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix.periodes,
						UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix.mois,
					],
				),
			motifsAbsences: null,
			motifsRetards: null,
		};
		this.listeTypeRessAbsences = new ObjetListeElements_1.ObjetListeElements();
		this.listeTypeRessAbsences.addElement(
			new ObjetElement_1.ObjetElement(
				TypeRessourceAbsence_1.TypeRessourceAbsenceUtil.getLibelle(
					TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Absence,
				),
				TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Absence,
				TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Absence,
			),
		);
		this.listeTypeRessAbsences.addElement(
			new ObjetElement_1.ObjetElement(
				TypeRessourceAbsence_1.TypeRessourceAbsenceUtil.getLibelle(
					TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Retard,
				),
				TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Retard,
				TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Retard,
			),
		);
		this.listeTypeRessAbsences.parcourir((aGenreRessource) => {
			aGenreRessource.selectionne = true;
		});
		this.donnees = {
			listeClasses: null,
			listeRegimes: null,
			uniquementNonRA: false,
			dateDebut: null,
			dateFin: null,
			listeAbsencesRetards: null,
		};
	}
	construireInstances() {
		this.identSelecteurTypeRessourceAbs = this.add(
			ObjetSelecteurTypeRessourceAbsence_1.ObjetSelecteurTypeRessourceAbsence,
			this.surEvenementSelecteurTypeRessourceAbs.bind(this),
			this.initSelecteurTypeRessourceAbs.bind(this),
		);
		this.identSelecteurClasses = this.add(
			ObjetSelecteurClasseGpe_1.ObjetSelecteurClasseGpe,
			this.surEvenementSelecteurClasses.bind(this),
			this._initSelecteurClasses,
		);
		this.identSelecteurRegimeEleve = this.add(
			ObjetSelecteurRegimeEleve_1.ObjetSelecteurRegimeEleve,
			this.surEvenementSelecteurRegimes.bind(this),
		);
		this.identListeJustifications = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementListeJustifications.bind(this),
			this._initListeJustifications,
		);
		this.identComboPeriode = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._evenementSurComboPeriode,
			this._initialiserComboPeriode.bind(this),
		);
		this.identDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this.surEvenementSelecteurDate.bind(this, true),
			this._initialiserSelecteurDate,
		);
		this.identDate2 = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this.surEvenementSelecteurDate.bind(this, false),
			this._initialiserSelecteurDate,
		);
		this.construireFicheEleveEtFichePhoto();
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		this.IdentZoneAlClient = this.identListeJustifications;
		this.AddSurZone = [];
		this.AddSurZone.push(this.identSelecteurTypeRessourceAbs);
		this.AddSurZone.push(this.identSelecteurClasses);
		this.AddSurZone.push(this.identSelecteurRegimeEleve);
		this.AddSurZone.push({
			html: IE.jsx.str(
				"ie-checkbox",
				{ "ie-model": this.jsxCbFiltreUniquementNonRA.bind(this) },
				ObjetTraduction_1.GTraductions.getValeur(
					"SuiviJustificationAbsRet.FiltreNonRA",
				),
			),
		});
		this.AddSurZone.push({ separateur: true });
		this.AddSurZone.push(
			{ html: ObjetTraduction_1.GTraductions.getValeur("Periode") },
			this.identComboPeriode,
		);
		this.AddSurZone.push(
			{ html: ObjetTraduction_1.GTraductions.getValeur("Du") },
			this.identDate,
		);
		this.AddSurZone.push(
			{ html: ObjetTraduction_1.GTraductions.getValeur("Au") },
			this.identDate2,
		);
		this.addSurZoneFicheEleve();
		this.addSurZonePhotoEleve();
	}
	jsxCbFiltreUniquementNonRA() {
		return {
			getValue: () => {
				return this.donnees.uniquementNonRA;
			},
			setValue: () => {
				this.donnees.uniquementNonRA = !this.donnees.uniquementNonRA;
				this.lancerRequeteRecuperationJustificationsAbsRetards();
			},
		};
	}
	recupererDonnees() {
		this.getInstance(this.identSelecteurTypeRessourceAbs).actualiserLibelle();
		this.donnees.listeClasses = (0, AccessApp_1.getApp)()
			.getEtatUtilisateur()
			.getListeClasses({ avecClasse: true, uniquementClasseEnseignee: true });
		this.getInstance(this.identSelecteurClasses).setDonnees({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreSelectionClasseGroupe.titreClasses",
			),
			listeSelection: this.donnees.listeClasses,
			listeTotale: this.donnees.listeClasses,
		});
		this.getInstance(this.identSelecteurClasses).actualiserLibelle();
		const lThis = this;
		new ObjetRequeteListeRegimesEleve_1.ObjetRequeteListeRegimesEleve(this)
			.lancerRequete({
				avecRegimesEleves: true,
				avecSeulementUtilises: true,
				avecAucun: true,
			})
			.then((aJSONListeRegimes) => {
				lThis.donnees.listeRegimes = aJSONListeRegimes.ListeRegimes;
				lThis
					.getInstance(lThis.identSelecteurRegimeEleve)
					.setDonnees({
						listeSelection: lThis.donnees.listeRegimes,
						listeTotale: lThis.donnees.listeRegimes,
					});
				lThis.getInstance(lThis.identSelecteurRegimeEleve).actualiserLibelle();
				new ObjetRequeteListeRegimesEleve_1.ObjetRequeteListeRegimesEleve(lThis)
					.lancerRequete({
						avecMotifsAbsence: true,
						avecMotifsRetard: true,
						avecSeulementUtilises: false,
						avecAucun: true,
					})
					.then((aJSONListeMotifs) => {
						lThis.cacheListes.motifsAbsences =
							aJSONListeMotifs.listeMotifsAbsenceEleve;
						lThis.cacheListes.motifsRetards =
							aJSONListeMotifs.listeMotifsRetards;
						let lIndiceSemaineCourante = -1;
						lThis.cacheListes.periodes.parcourir((D, aIndice) => {
							if (
								D.choix ===
								UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix
									.semaineCourante
							) {
								lIndiceSemaineCourante = aIndice;
								return false;
							}
						});
						lThis
							.getInstance(lThis.identComboPeriode)
							.setSelection(lIndiceSemaineCourante);
						lThis.lancerRequeteRecuperationJustificationsAbsRetards();
					});
			});
	}
	lancerRequeteRecuperationJustificationsAbsRetards() {
		const lParamsRequete = {
			classes: this.donnees.listeClasses,
			regimes: this.donnees.listeRegimes,
			uniquementNonRA: this.donnees.uniquementNonRA,
			dateDebut: this.donnees.dateDebut,
			dateFin: this.donnees.dateFin,
		};
		if (lParamsRequete.classes) {
			lParamsRequete.classes.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
		}
		if (lParamsRequete.regimes) {
			lParamsRequete.regimes.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
		}
		new ObjetRequeteSuiviJustificationsAbsencesRetards(
			this,
			this.surRecuperationListeJustificationsAbsRetards,
		).lancerRequete(lParamsRequete);
	}
	surRecuperationListeJustificationsAbsRetards(aJSON) {
		this.donnees.listeAbsencesRetards = aJSON.listeJustifications;
		if (!!this.donnees.listeAbsencesRetards) {
			const lThis = this;
			let lMotifDeListe;
			this.donnees.listeAbsencesRetards.parcourir((aJustification) => {
				if (!!aJustification.motif) {
					lMotifDeListe = lThis._getMotifDeListeComplete(
						aJustification.getGenre(),
						aJustification.motif,
					);
					aJustification.motif = lMotifDeListe;
				}
				if (!!aJustification.motifParent) {
					lMotifDeListe = lThis._getMotifDeListeComplete(
						aJustification.getGenre(),
						aJustification.motifParent,
					);
					aJustification.motifParent = lMotifDeListe;
				}
			});
		}
		this.getInstance(this.identListeJustifications).setDonnees(
			new DonneesListe_SuiviJustificationsAbsRetards_1.DonneesListe_SuiviJustificationsAbsRetards(
				this.donnees.listeAbsencesRetards,
				{
					callbackAjoutDocumentJoint:
						this.callbackAjoutDocumentJoint.bind(this),
					callbackRemplacerDocumentJoint:
						this.callbackRemplacerDocumentJoint.bind(this),
					callbackSuppressionDocumentJoint:
						this.callbackSuppressionDocumentJoint.bind(this),
					listeFiltreTypeRessAbsences: this.listeTypeRessAbsences,
				},
			),
		);
	}
	callbackAjoutDocumentJoint(aArticle, aFichier) {
		if (!!aArticle) {
			aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			aArticle.ListeFichiers =
				new ObjetListeElements_1.ObjetListeElements().addElement(aFichier);
			this.valider(
				TypeHttpSaisieAbsencesGrille_1.TypeHttpSaisieAbsencesGrille
					.sag_AjouterCertificat,
				{ Libelle: aFichier.getLibelle(), idFichier: aFichier.idFichier },
			);
		}
	}
	callbackRemplacerDocumentJoint(aArticle, aFichier) {
		if (
			!!aArticle &&
			!!aArticle.listeDocJointsVS &&
			aArticle.listeDocJointsVS.count() > 0
		) {
			aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			aArticle.ListeFichiers =
				new ObjetListeElements_1.ObjetListeElements().addElement(aFichier);
			this.valider(
				TypeHttpSaisieAbsencesGrille_1.TypeHttpSaisieAbsencesGrille
					.sag_RemplacerCertificat,
				{
					ancienCertificat: aArticle.listeDocJointsVS.get(0),
					Libelle: aFichier.getLibelle(),
					idFichier: aFichier.idFichier,
				},
			);
		}
	}
	callbackSuppressionDocumentJoint(aArticle) {
		if (
			!!aArticle &&
			!!aArticle.listeDocJointsVS &&
			aArticle.listeDocJointsVS.count() > 0
		) {
			aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.valider(
				TypeHttpSaisieAbsencesGrille_1.TypeHttpSaisieAbsencesGrille
					.sag_SupprimerCertificat,
				{ certificat: aArticle.listeDocJointsVS.get(0) },
			);
		}
	}
	valider(aTypeSaisie, aDonneesSupplementaires) {
		let lRessourceASaisir = null;
		this.donnees.listeAbsencesRetards.parcourir((D) => {
			if (D.pourValidation()) {
				lRessourceASaisir = D;
				return false;
			}
		});
		if (!!lRessourceASaisir) {
			const lParamsRequete = {
				genreSaisie: aTypeSaisie,
				eleve: lRessourceASaisir.eleve,
				genreAbsence:
					TypeRessourceAbsence_1.TypeRessourceAbsenceUtil.toGenreRessource(
						lRessourceASaisir.getGenre(),
					),
				article: lRessourceASaisir,
			};
			if (!!aDonneesSupplementaires) {
				Object.assign(lParamsRequete, aDonneesSupplementaires);
			}
			let lListeFichiersUpload = null;
			if (
				lRessourceASaisir.ListeFichiers &&
				lRessourceASaisir.ListeFichiers.count() > 0
			) {
				if (!lListeFichiersUpload) {
					lListeFichiersUpload = new ObjetListeElements_1.ObjetListeElements();
				}
				lListeFichiersUpload.add(lRessourceASaisir.ListeFichiers);
			}
			new ObjetRequeteSaisieAbsencesGrille_1.ObjetRequeteSaisieAbsencesGrille(
				this,
				this.lancerRequeteRecuperationJustificationsAbsRetards,
			)
				.addUpload({ listeFichiers: lListeFichiersUpload })
				.lancerRequete(lParamsRequete);
		}
	}
	_getMotifDeListeComplete(aGenreJustification, aMotifRecherche) {
		let lMotifDeListe = null;
		if (aMotifRecherche) {
			let lListeConcernee;
			if (
				aGenreJustification ===
				TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Absence
			) {
				lListeConcernee = this.cacheListes.motifsAbsences;
			} else if (
				aGenreJustification ===
				TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Retard
			) {
				lListeConcernee = this.cacheListes.motifsRetards;
			}
			if (!!lListeConcernee) {
				lMotifDeListe = lListeConcernee.getElementParNumero(
					aMotifRecherche.getNumero(),
				);
			}
		}
		return lMotifDeListe;
	}
	initSelecteurTypeRessourceAbs(aInstance) {
		aInstance.setDonnees({
			listeSelection: this.listeTypeRessAbsences,
			listeTotale: this.listeTypeRessAbsences,
		});
	}
	surEvenementSelecteurTypeRessourceAbs(aParametres) {
		this.listeTypeRessAbsences.parcourir((D) => {
			D.selectionne = false;
		});
		if (!!aParametres.listeSelection) {
			const lThis = this;
			aParametres.listeSelection.parcourir((aTypeRessourceSelectionne) => {
				const lTypeRessourceDeListe =
					lThis.listeTypeRessAbsences.getElementParGenre(
						aTypeRessourceSelectionne.getGenre(),
					);
				if (!!lTypeRessourceDeListe) {
					lTypeRessourceDeListe.selectionne = true;
				}
			});
			this.getInstance(this.identListeJustifications).actualiser(true);
		}
	}
	_initSelecteurClasses(aInstance) {
		aInstance.setOptions({ avecSelectionObligatoire: true });
	}
	surEvenementSelecteurClasses(aParam) {
		this.donnees.listeClasses = aParam.listeSelection;
		this.lancerRequeteRecuperationJustificationsAbsRetards();
	}
	surEvenementSelecteurRegimes(aParam) {
		this.donnees.listeRegimes = aParam.listeSelection;
		this.lancerRequeteRecuperationJustificationsAbsRetards();
	}
	_initialiserComboPeriode(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 150,
			hauteur: 17,
			classTexte: "Gras",
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur("Periode"),
		});
		aInstance.setControleNavigation(true);
		aInstance.setDonnees(this.cacheListes.periodes);
	}
	_evenementSurComboPeriode(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.donnees.dateDebut = aParams.element.dates.debut;
			this.donnees.dateFin = aParams.element.dates.fin;
			this.getInstance(this.identDate).setDonnees(this.donnees.dateDebut);
			this.getInstance(this.identDate2).setDonnees(this.donnees.dateFin);
			if (this.getInstance(this.identComboPeriode).InteractionUtilisateur) {
				this.lancerRequeteRecuperationJustificationsAbsRetards();
			}
		}
	}
	_initialiserSelecteurDate(aInstance) {
		aInstance.setControleNavigation(true);
	}
	surEvenementSelecteurDate(aEstDateDebut, aDate) {
		this.donnees.dateDebut = this.getInstance(this.identDate).getDate();
		this.donnees.dateFin = this.getInstance(this.identDate2).getDate();
		if (aEstDateDebut) {
			if (this.getInstance(this.identDate2).getDate() < aDate) {
				this.getInstance(this.identDate2).setDonnees(aDate);
				this.donnees.dateFin = aDate;
			}
		} else {
			if (this.getInstance(this.identDate).getDate() > aDate) {
				this.getInstance(this.identDate).setDonnees(aDate);
				this.donnees.dateDebut = aDate;
			}
		}
		this._actualiserComboSelonDates(
			this.donnees.dateDebut,
			this.donnees.dateFin,
		);
		this.lancerRequeteRecuperationJustificationsAbsRetards();
	}
	_actualiserComboSelonDates(aDateDebut, aDateFin) {
		let lIndiceSemaineCourante = -1;
		this.cacheListes.periodes.parcourir((D, aIndice) => {
			if (
				ObjetDate_1.GDate.estJourEgal(D.dates.debut, aDateDebut) &&
				ObjetDate_1.GDate.estJourEgal(D.dates.fin, aDateFin)
			) {
				lIndiceSemaineCourante = aIndice;
				return false;
			}
		});
		if (lIndiceSemaineCourante >= 0) {
			this.getInstance(this.identComboPeriode).setSelection(
				lIndiceSemaineCourante,
			);
		} else {
			this.getInstance(this.identComboPeriode).setContenu("");
		}
	}
	_initListeJustifications(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_SuiviJustificationsAbsRetards_1
				.DonneesListe_SuiviJustificationsAbsRetards.colonnes.genre,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviJustificationAbsRet.AouR",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviJustificationAbsRet.AbsenceOuRetard",
			),
			taille: 40,
		});
		lColonnes.push({
			id: DonneesListe_SuiviJustificationsAbsRetards_1
				.DonneesListe_SuiviJustificationsAbsRetards.colonnes.eleve,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviJustificationAbsRet.NomEleve",
			),
			taille: 150,
		});
		lColonnes.push({
			id: DonneesListe_SuiviJustificationsAbsRetards_1
				.DonneesListe_SuiviJustificationsAbsRetards.colonnes.classe,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviJustificationAbsRet.Classe",
			),
			taille: 60,
		});
		lColonnes.push({
			id: DonneesListe_SuiviJustificationsAbsRetards_1
				.DonneesListe_SuiviJustificationsAbsRetards.colonnes.regime,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviJustificationAbsRet.Regime",
			),
			taille: 100,
		});
		lColonnes.push({
			id: DonneesListe_SuiviJustificationsAbsRetards_1
				.DonneesListe_SuiviJustificationsAbsRetards.colonnes.dureeRetard,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviJustificationAbsRet.DureeRetard",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviJustificationAbsRet.HintDureeRetard",
			),
			taille: 60,
		});
		lColonnes.push({
			id: DonneesListe_SuiviJustificationsAbsRetards_1
				.DonneesListe_SuiviJustificationsAbsRetards.colonnes.date,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviJustificationAbsRet.Date",
			),
			taille: 100,
		});
		lColonnes.push({
			id: DonneesListe_SuiviJustificationsAbsRetards_1
				.DonneesListe_SuiviJustificationsAbsRetards.colonnes.motif,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviJustificationAbsRet.Motif",
			),
			taille: 100,
		});
		lColonnes.push({
			id: DonneesListe_SuiviJustificationsAbsRetards_1
				.DonneesListe_SuiviJustificationsAbsRetards.colonnes.documentsParents,
			titre: [
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"SuiviJustificationAbsRet.JustificationParents",
					),
				},
				{
					getLibelleHtml: () =>
						IE.jsx.str("i", {
							class: "icon_piece_jointe",
							role: "img",
							"aria-label": ObjetTraduction_1.GTraductions.getValeur(
								"SuiviJustificationAbsRet.JustificationParents",
							),
						}),
				},
			],
			taille: 20,
		});
		lColonnes.push({
			id: DonneesListe_SuiviJustificationsAbsRetards_1
				.DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.raisonDonneeParents,
			titre: [
				{ libelle: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche },
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"SuiviJustificationAbsRet.RaisonDonneeParents",
					),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"SuiviJustificationAbsRet.JustificationParents",
					),
				},
			],
			taille: 100,
		});
		lColonnes.push({
			id: DonneesListe_SuiviJustificationsAbsRetards_1
				.DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.dateJustificationParents,
			titre: [
				{ libelle: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche },
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"SuiviJustificationAbsRet.DateJustificationParents",
					),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"SuiviJustificationAbsRet.HintDateJustificationParents",
					),
				},
			],
			taille: 80,
		});
		lColonnes.push({
			id: DonneesListe_SuiviJustificationsAbsRetards_1
				.DonneesListe_SuiviJustificationsAbsRetards.colonnes.commentaireParents,
			titre: [
				{ libelle: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche },
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"SuiviJustificationAbsRet.CommentaireParents",
					),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"SuiviJustificationAbsRet.HintCommentaireParents",
					),
				},
			],
			taille: 120,
		});
		lColonnes.push({
			id: DonneesListe_SuiviJustificationsAbsRetards_1
				.DonneesListe_SuiviJustificationsAbsRetards.colonnes.justifieParParents,
			titre: [
				{ libelle: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche },
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"SuiviJustificationAbsRet.JustifiePar",
					),
				},
			],
			taille: 100,
		});
		lColonnes.push({
			id: DonneesListe_SuiviJustificationsAbsRetards_1
				.DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.acceptationEtablissement,
			titre: [
				{ libelle: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche },
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"SuiviJustificationAbsRet.AcceptationEtablissement",
					),
				},
			],
			taille: 100,
		});
		lColonnes.push({
			id: DonneesListe_SuiviJustificationsAbsRetards_1
				.DonneesListe_SuiviJustificationsAbsRetards.colonnes.dureeAbsenceCours,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviJustificationAbsRet.DureeAbsenceCours",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviJustificationAbsRet.HintDureeAbsenceCours",
			),
			taille: 100,
		});
		lColonnes.push({
			id: DonneesListe_SuiviJustificationsAbsRetards_1
				.DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.documentsVieScolaire,
			titre: {
				getLibelleHtml: () =>
					IE.jsx.str("i", {
						class: "icon_piece_jointe",
						role: "img",
						"aria-label": ObjetTraduction_1.GTraductions.getValeur(
							"SuiviJustificationAbsRet.JustificationParents",
						),
					}),
			},
			taille: 20,
		});
		lColonnes.push({
			id: DonneesListe_SuiviJustificationsAbsRetards_1
				.DonneesListe_SuiviJustificationsAbsRetards.colonnes.matieresAffectee,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviJustificationAbsRet.MatieresAffectees",
			),
			taille: 100,
		});
		if (
			(0, AccessApp_1.getApp)().droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieAbsenceOuverte,
			)
		) {
			lColonnes.push({
				id: DonneesListe_SuiviJustificationsAbsRetards_1
					.DonneesListe_SuiviJustificationsAbsRetards.colonnes.estOuvert,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"SuiviJustificationAbsRet.EstOuvert",
				),
				hint: ObjetTraduction_1.GTraductions.getValeur(
					"SuiviJustificationAbsRet.HintEstOuvert",
				),
				taille: 60,
			});
		}
		lColonnes.push({
			id: DonneesListe_SuiviJustificationsAbsRetards_1
				.DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.demiJourneesBulletin,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviJustificationAbsRet.DemiJourneesBulletin",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviJustificationAbsRet.HintDemiJourneesBulletin",
			),
			taille: 60,
		});
		lColonnes.push({
			id: DonneesListe_SuiviJustificationsAbsRetards_1
				.DonneesListe_SuiviJustificationsAbsRetards.colonnes.estMotifRecevable,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviJustificationAbsRet.Justifie",
			),
			taille: 60,
		});
		lColonnes.push({
			id: DonneesListe_SuiviJustificationsAbsRetards_1
				.DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.estRegleAdministrativement,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviJustificationAbsRet.RegleAdministrativement",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviJustificationAbsRet.HintRegleAdministrativement",
			),
			taille: 30,
		});
		lColonnes.push({
			id: DonneesListe_SuiviJustificationsAbsRetards_1
				.DonneesListe_SuiviJustificationsAbsRetards.colonnes.suivi,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviJustificationAbsRet.Suivi",
			),
			taille: 100,
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			colonnesTriables: true,
			scrollHorizontal: true,
		});
	}
	evenementListeJustifications(aParametres) {
		const lThis = this;
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				(0, AccessApp_1.getApp)()
					.getEtatUtilisateur()
					.Navigation.setRessource(
						Enumere_Ressource_1.EGenreRessource.Eleve,
						aParametres.article.eleve,
					);
				this.surSelectionEleve();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				switch (aParametres.idColonne) {
					case DonneesListe_SuiviJustificationsAbsRetards_1
						.DonneesListe_SuiviJustificationsAbsRetards.colonnes.motif:
						this.surEditionMotif(
							aParametres.article,
							true,
							(aArticle, aNouveauMotif) => {
								if (
									!aArticle.motif ||
									(!!aNouveauMotif &&
										aArticle.motif.getNumero() !== aNouveauMotif.getNumero())
								) {
									aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
									lThis.valider(
										TypeHttpSaisieAbsencesGrille_1.TypeHttpSaisieAbsencesGrille
											.sag_Motif,
										{ motifModifie: aNouveauMotif },
									);
								}
							},
						);
						break;
					case DonneesListe_SuiviJustificationsAbsRetards_1
						.DonneesListe_SuiviJustificationsAbsRetards.colonnes
						.acceptationEtablissement: {
						const lMotifOfficielRenseigne =
							!!aParametres.article.motif &&
							aParametres.article.motif.existeNumero() &&
							!aParametres.article.motif.nonConnu;
						let lAvecConfirmationPerteMotif = false;
						if (aParametres.article.estMotifParentAccepte) {
							const lMotifParentEstRenseigne =
								aParametres.article.motifParent &&
								aParametres.article.motifParent.existeNumero() &&
								!aParametres.article.motifParent.nonConnu;
							lAvecConfirmationPerteMotif =
								lMotifOfficielRenseigne && lMotifParentEstRenseigne;
						}
						const lFonctionSaisieRaisonDonneeParParents = function () {
							const lParametresSaisie = {
								accepteRaisonDonneeParents:
									!aParametres.article.estMotifParentAccepte,
							};
							if (
								lParametresSaisie.accepteRaisonDonneeParents &&
								!lMotifOfficielRenseigne &&
								(!aParametres.article.motifParent ||
									!aParametres.article.motifParent.existeNumero() ||
									!!aParametres.article.motifParent.nonConnu)
							) {
								lThis.surEditionMotif(
									aParametres.article,
									false,
									(aArticle, aNouveauMotif) => {
										if (!!aArticle.estOuvert) {
											lThis.surChoixDateFermetureAbsence(
												aArticle,
												(aArticle2, aDate) => {
													aArticle2.setEtat(
														Enumere_Etat_1.EGenreEtat.Modification,
													);
													lParametresSaisie.motif = aNouveauMotif;
													lParametresSaisie.dateFermetureAbsence = aDate;
													lThis.valider(
														TypeHttpSaisieAbsencesGrille_1
															.TypeHttpSaisieAbsencesGrille
															.sag_RaisonDonneeParParents,
														lParametresSaisie,
													);
												},
											);
										} else {
											aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
											lParametresSaisie.motif = aNouveauMotif;
											lThis.valider(
												TypeHttpSaisieAbsencesGrille_1
													.TypeHttpSaisieAbsencesGrille
													.sag_RaisonDonneeParParents,
												lParametresSaisie,
											);
										}
									},
								);
							} else {
								if (!!aParametres.article.estOuvert) {
									lThis.surChoixDateFermetureAbsence(
										aParametres.article,
										(aArticle, aDate) => {
											aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
											lParametresSaisie.dateFermetureAbsence = aDate;
											lThis.valider(
												TypeHttpSaisieAbsencesGrille_1
													.TypeHttpSaisieAbsencesGrille
													.sag_RaisonDonneeParParents,
												lParametresSaisie,
											);
										},
									);
								} else {
									aParametres.article.setEtat(
										Enumere_Etat_1.EGenreEtat.Modification,
									);
									lThis.valider(
										TypeHttpSaisieAbsencesGrille_1.TypeHttpSaisieAbsencesGrille
											.sag_RaisonDonneeParParents,
										lParametresSaisie,
									);
								}
							}
						};
						if (lAvecConfirmationPerteMotif) {
							GApplication.getMessage().afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"SuiviJustificationAbsRet.ConfirmationEcrasementMotif",
								),
								callback: function (aGenreAction) {
									if (aGenreAction === 0) {
										lFonctionSaisieRaisonDonneeParParents();
									}
								},
							});
						} else {
							lFonctionSaisieRaisonDonneeParParents();
						}
						break;
					}
					case DonneesListe_SuiviJustificationsAbsRetards_1
						.DonneesListe_SuiviJustificationsAbsRetards.colonnes
						.estMotifRecevable:
						aParametres.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						this.valider(
							TypeHttpSaisieAbsencesGrille_1.TypeHttpSaisieAbsencesGrille
								.sag_MotifRecevable,
						);
						break;
					case DonneesListe_SuiviJustificationsAbsRetards_1
						.DonneesListe_SuiviJustificationsAbsRetards.colonnes
						.estRegleAdministrativement:
						aParametres.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						this.valider(
							TypeHttpSaisieAbsencesGrille_1.TypeHttpSaisieAbsencesGrille
								.sag_Reglement,
						);
						break;
					case DonneesListe_SuiviJustificationsAbsRetards_1
						.DonneesListe_SuiviJustificationsAbsRetards.colonnes.suivi: {
						const lFenetreSuivi =
							ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
								ObjetFenetre_SuiviUnique_1.ObjetFenetre_SuiviUnique,
								{
									pere: this,
									evenement: function () {
										lThis.lancerRequeteRecuperationJustificationsAbsRetards();
									},
								},
								{
									titre: ObjetTraduction_1.GTraductions.getValeur(
										"SuiviJustificationAbsRet.Suivi",
									),
								},
							);
						lFenetreSuivi.setDonnees(
							aParametres.article.eleve,
							aParametres.article,
						);
						break;
					}
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				aParametres.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.valider(
					TypeHttpSaisieAbsencesGrille_1.TypeHttpSaisieAbsencesGrille
						.sag_DJBulletin,
					{ DJBulletin: aParametres.article.nbDemiJourneeBulletin },
				);
				break;
		}
	}
	surEditionMotif(aArticle, aAvecMotifNonConnu, aSurChoixMotif) {
		if (!!aArticle) {
			let lListeMotifs;
			if (
				aArticle.getGenre() ===
				TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Absence
			) {
				lListeMotifs = this.cacheListes.motifsAbsences;
			} else if (
				aArticle.getGenre() ===
				TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Retard
			) {
				lListeMotifs = this.cacheListes.motifsRetards;
			}
			if (!!lListeMotifs) {
				if (!aAvecMotifNonConnu) {
					lListeMotifs = lListeMotifs.getListeElements((aMotif) => {
						return !aMotif.nonConnu;
					});
				}
				const lFenetreSelectionMotif =
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_SelectionMotif_1.ObjetFenetre_SelectionMotif,
						{
							pere: this,
							evenement: function (aGenreBouton, aMotif) {
								if (aGenreBouton === 1) {
									if (!!aSurChoixMotif) {
										aSurChoixMotif(aArticle, aMotif);
									}
								}
							},
						},
					);
				lFenetreSelectionMotif.setDonnees(lListeMotifs);
			}
		}
	}
	surChoixDateFermetureAbsence(aAbsence, aCallback) {
		const lFenetreChoixDate = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Date_1.ObjetFenetre_Date,
			{
				pere: this,
				evenement: function (aNumeroBouton, aDate) {
					if (aNumeroBouton === 1) {
						aCallback(aAbsence, aDate);
					}
				},
				initialiser: function (aInstance) {
					aInstance.setParametres(
						ObjetDate_1.GDate.PremierLundi,
						new Date(0),
						GParametres.DerniereDate,
					);
				},
			},
		);
		lFenetreChoixDate.setDonnees(null);
	}
}
exports.InterfaceSuiviJustificationsAbsRetards =
	InterfaceSuiviJustificationsAbsRetards;
