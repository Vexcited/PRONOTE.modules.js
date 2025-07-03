exports.ObjetAffichagePageEmploiDuTemps_Journalier = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetCours_1 = require("ObjetCours");
const ObjetTraduction_1 = require("ObjetTraduction");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetDate_1 = require("ObjetDate");
const ObjetTri_1 = require("ObjetTri");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetRequeteRessourceEDT_1 = require("ObjetRequeteRessourceEDT");
const ObjetRequetePageEmploiDuTemps_1 = require("ObjetRequetePageEmploiDuTemps");
const ObjetRequetePageEmploiDuTemps_DomainePresence_1 = require("ObjetRequetePageEmploiDuTemps_DomainePresence");
const TypeDomaine_1 = require("TypeDomaine");
const ObjetChaine_1 = require("ObjetChaine");
const UtilitaireEDTSortiePedagogique_1 = require("UtilitaireEDTSortiePedagogique");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const UtilitairePrefsGrilleStructure_1 = require("UtilitairePrefsGrilleStructure");
const ObjetBoutonFlottant_1 = require("ObjetBoutonFlottant");
const UtilitaireGenerationPDF_1 = require("UtilitaireGenerationPDF");
const OptionsPDFSco_1 = require("OptionsPDFSco");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const ObjetFenetre_1 = require("ObjetFenetre");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const ObjetSelection_1 = require("ObjetSelection");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const UtilitaireGestionCloudEtPDF_1 = require("UtilitaireGestionCloudEtPDF");
const DetailSortiePedagogique_tsxModele_js_1 = require("DetailSortiePedagogique.tsxModele.js");
const ObjetInterfacePageCP_1 = require("ObjetInterfacePageCP");
class ObjetAffichagePageEmploiDuTemps_Journalier extends ObjetInterfacePageCP_1.InterfacePageCP {
	constructor(...aParams) {
		super(...aParams);
		this.NumeroSemaine = null;
		this.popupOuvert = {};
		this.estEDTAnnuel = false;
		this.avecVerificationJoursPresence = true;
		this.forcerClickCours = false;
		this.AvecTrouEDT = true;
		this.etatUtilisateurSco = GEtatUtilisateur;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		if (this.etatUtilisateurSco.getNavigationDate()) {
			this.etatUtilisateurSco.setDerniereDate(
				this.etatUtilisateurSco.getNavigationDate(),
			);
		}
	}
	initialiserMoteurDate(aInstance) {}
	actionApresListeCours(aParam) {}
	construireInstances() {
		this.ressources = GEtatUtilisateur.getMembre();
		this.membre = GEtatUtilisateur.getMembre();
		this.ressourceSelectionnee = GEtatUtilisateur.getMembre();
		if (
			[
				Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
			].includes(GEtatUtilisateur.GenreEspace) &&
			GEtatUtilisateur.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.EmploiDuTemps
		) {
			this.ressourceSelectionnee = GEtatUtilisateur.getUtilisateur();
		}
		this.identSelecteurDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._evenementCalendrier,
			this.initSelecteurDate,
		);
		this.identPageListe = this.add(
			ObjetCours_1.ObjetCours,
			this.evenementFicheCours,
			this._initialiserPageListe.bind(this),
		);
		this.identComboEdt = this.add(
			ObjetSelection_1.ObjetSelection,
			this._evntSelecteurEdt.bind(this),
			_initSelecteurEdt.bind(this),
		);
		this.identComboRessource = this.add(
			ObjetSelection_1.ObjetSelection,
			this._evntSelecteurRessource.bind(this),
			_initSelecteurEdt.bind(this),
		);
		this.edtSelectionne = null;
		this.AddSurZone = [
			this.identComboEdt,
			this.identComboRessource,
			this.identSelecteurDate,
		];
		this.masquerComboSelectionEdt =
			GEtatUtilisateur.getGenreOnglet() !==
				Enumere_Onglet_1.EGenreOnglet.EmploiDuTemps ||
			[
				Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve,
				Enumere_Espace_1.EGenreEspace.Mobile_Parent,
				Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
				Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
			].includes(GEtatUtilisateur.GenreEspace);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identPageListe;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const H = [];
		if (!this.identBtnFlottant) {
			$("#" + GInterface.idZonePrincipale).ieHtmlAppend(
				'<div class="is-sticky" ie-identite="getIdentiteBouton" ></div>',
				{ controleur: this.controleur, avecCommentaireConstructeur: false },
			);
		}
		this.identBtnFlottant.setVisible(false);
		H.push(
			"<div>",
			'<div class="edtJournalier" id="',
			this.getNomInstance(this.identPageListe),
			'"></div>',
			"</div>",
		);
		return H.join("");
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getIdentiteBouton() {
				return {
					class: ObjetBoutonFlottant_1.ObjetBoutonFlottant,
					pere: this,
					init: (aBtn) => {
						aInstance.identBtnFlottant = aBtn;
						const lParam = {
							listeBoutons: [
								{
									primaire: true,
									icone: "icon_uniF1C1",
									ariaLabel: ObjetTraduction_1.GTraductions.getValeur(
										"GenerationPDF.TitreCommande",
									),
									callback:
										aInstance.afficherModalitesGenerationPDF.bind(aInstance),
								},
							],
						};
						aBtn.setOptionsBouton(lParam);
					},
				};
			},
		});
	}
	afficherModalitesGenerationPDF() {
		let lParams = {
			callbaskEvenement: this.surEvenementFenetre.bind(this),
			modeGestion:
				UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.modeGestion
					.PDFEtCloud,
			avecDepot: true,
			avecTitreSelonOnglet: true,
		};
		UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.creerFenetreGestion(
			lParams,
		);
	}
	surEvenementFenetre(aLigne) {
		const lService = GEtatUtilisateur.listeCloudDepotServeur.get(aLigne);
		this._genererPdf(lService);
	}
	evenementFicheCours(aCours) {
		if (aCours.estSortiePedagogique) {
			this._afficherSortiePeda(aCours);
			return;
		}
	}
	recupererDonnees() {
		new ObjetRequeteRessourceEDT_1.ObjetRequeteRessourceEDT(
			this,
			this.reponseRessourceEDT,
		).lancerRequete();
	}
	reponseRessourceEDT(aJSON) {
		this.donnees = aJSON.listeRessources;
		if (
			[
				Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
				Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
			].includes(GEtatUtilisateur.GenreEspace)
		) {
			const lElement = this.donnees.getElementParGenre(
				Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsClasse,
			);
			if (lElement) {
				const lListeClasseGroupe = this.etatUtilisateurSco.getListeClasses({
					avecClasse: true,
					avecGroupe: true,
					uniquementClasseEnseignee: true,
				});
				lListeClasseGroupe.setTri([ObjetTri_1.ObjetTri.init("Genre")]);
				lListeClasseGroupe.trier();
				lElement.liste = lListeClasseGroupe;
			}
		}
		const lListeClasse = this.donnees.getElementParGenre(
			Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsClasse,
		);
		if (lListeClasse && lListeClasse.liste && lListeClasse.liste.count()) {
			let lAvecClasse = false;
			let lAvecGroupe = false;
			lListeClasse.liste.parcourir((aClasseGroupe) => {
				switch (aClasseGroupe.getGenre()) {
					case Enumere_Ressource_1.EGenreRessource.Classe:
						lAvecClasse = true;
						return;
					case Enumere_Ressource_1.EGenreRessource.Groupe:
						lAvecGroupe = true;
						return;
					default:
						break;
				}
			});
			if (lAvecClasse) {
				let lElement = new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("Classe"),
					-1,
					Enumere_Ressource_1.EGenreRessource.Classe,
					null,
				);
				lElement.AvecSelection = false;
				lListeClasse.liste.addElement(lElement);
			}
			if (lAvecGroupe) {
				let lElement = new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("Groupe"),
					-1,
					Enumere_Ressource_1.EGenreRessource.Groupe,
					null,
				);
				lElement.AvecSelection = false;
				lListeClasse.liste.addElement(lElement);
			}
			lListeClasse.liste.setTri([
				ObjetTri_1.ObjetTri.init((D) => {
					return D.getGenre() !== Enumere_Ressource_1.EGenreRessource.Aucune;
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					return D.getNumero() !== 0;
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					return D.getGenre() !== Enumere_Ressource_1.EGenreRessource.Classe;
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					return D.getNumero() !== -1;
				}),
				ObjetTri_1.ObjetTri.init("Libelle"),
			]);
			lListeClasse.liste.trier();
		}
		const lListeProfesseur = this.donnees.getElementParGenre(
			Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsProfesseur,
		);
		if (lListeProfesseur) {
			lListeProfesseur.liste.trier();
		}
		const lListeSalle = this.donnees.getElementParGenre(
			Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsSalle,
		);
		if (lListeSalle) {
			const lListeSalleTmp = new ObjetListeElements_1.ObjetListeElements();
			lListeSalle.liste.parcourir((aSalle) => {
				_ajouterSalle(lListeSalleTmp, aSalle);
			});
			lListeSalle.liste = lListeSalleTmp;
		}
		this.donnees = this.donnees.getListeElements((aEdt) => {
			return (
				aEdt.getGenre() === Enumere_Onglet_1.EGenreOnglet.EmploiDuTemps ||
				(aEdt.liste && aEdt.liste.count() > 0)
			);
		});
		this.getInstance(this.identComboEdt).setDonnees(this.donnees, 0);
	}
	_getParamsRequeteEDT() {
		const lParam = {
			ressource: this.ressourceSelectionnee,
			dateDebut: this.date,
			estEDTAnnuel: this.estEDTAnnuel,
			avecConseilDeClasse: true,
			avecInfosPrefsGrille: true,
			avecCoursSortiePeda: true,
			avecAbsencesRessource: true,
			avecRetenuesEleve: true,
			avecDisponibilites:
				GEtatUtilisateur.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
		};
		if (
			GEtatUtilisateur.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.EmploiDuTemps
		) {
			lParam.edt = this.edtSelectionne;
		}
		return lParam;
	}
	lancerRequeteEDT() {
		if (this.edtSelectionne) {
			return new ObjetRequetePageEmploiDuTemps_1.ObjetRequetePageEmploiDuTemps(
				this,
			)
				.lancerRequete(Object.assign(this._getParamsRequeteEDT()))
				.then((aParams) => {
					return this._surReponseRequeteEDT(aParams);
				});
		}
	}
	lancerRequeteEdtPourCdT(aParams) {
		return new ObjetRequetePageEmploiDuTemps_1.ObjetRequetePageEmploiDuTemps(
			this,
		).lancerRequete(Object.assign(this._getParamsRequeteEDT(), aParams));
	}
	lancerRequeteDomaine() {
		if (this.identBtnFlottant) {
			this.identBtnFlottant.setVisible(false);
		}
		if (this.estEDTAnnuel) {
			this.getInstance(this.identSelecteurDate).setDonnees(
				this.etatUtilisateurSco.getDerniereDate(),
				true,
			);
		} else {
			if (this.edtSelectionne) {
				new ObjetRequetePageEmploiDuTemps_DomainePresence_1.ObjetRequetePageEmploiDuTemps_DomainePresence(
					this,
				)
					.lancerRequete(this.ressourceSelectionnee)
					.then((aReponse) => {
						const lJoursPresence = this.avecVerificationJoursPresence
							? aReponse.joursPresence
							: null;
						const lMessage = aReponse.message || "";
						if (lMessage !== "") {
							ObjetHtml_1.GHtml.setDisplay(
								this.getNomInstance(this.identSelecteurDate),
								false,
							);
							this.afficherMessage(lMessage);
						} else {
							this.getInstance(
								this.identSelecteurDate,
							).setOptionsObjetCelluleDate({
								domaineValide: GApplication.droits.get(
									ObjetDroitsPN_1.TypeDroits.cours.domaineConsultationEDT,
								),
								joursValidesAnnuels: lJoursPresence,
								estJoursValidesAnnuelsSelonPremiereDate: true,
							});
							ObjetHtml_1.GHtml.setDisplay(
								this.getNomInstance(this.identSelecteurDate),
								true,
							);
							this.getInstance(this.identSelecteurDate).setDonnees(
								this.etatUtilisateurSco.getDerniereDate(),
								true,
							);
						}
					});
			}
		}
	}
	free() {
		super.free();
		if (this.identBtnFlottant) {
			$("#" + this.identBtnFlottant.getNom().escapeJQ()).remove();
		}
	}
	getDateCourante() {
		return this.date;
	}
	initSelecteurDate(aInstance) {
		aInstance.setOptionsObjetCelluleDate({ avecBoutonsPrecedentSuivant: true });
		if (this.initialiserMoteurDate) {
			this.initialiserMoteurDate(aInstance);
		}
	}
	_evntSelecteurEdt(aEdt) {
		if (aEdt.element) {
			this.edtSelectionne = aEdt.element;
			if (this.edtSelectionne.avecRessource && this.edtSelectionne.liste) {
				this.getInstance(this.identComboRessource).setVisible(true);
				this.getInstance(this.identComboRessource).setDonnees(
					this.edtSelectionne.liste,
					0,
				);
			} else {
				if (
					[
						Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
					].includes(GEtatUtilisateur.GenreEspace) &&
					GEtatUtilisateur.getGenreOnglet() ===
						Enumere_Onglet_1.EGenreOnglet.EmploiDuTemps
				) {
					this.ressourceSelectionnee = GEtatUtilisateur.getUtilisateur();
				} else {
					this.ressourceSelectionnee = GEtatUtilisateur.getMembre();
				}
				this.getInstance(this.identComboRessource).setVisible(false);
				if (this.masquerComboSelectionEdt) {
					this.getInstance(this.identComboEdt).setVisible(false);
				}
				this.lancerRequeteDomaine();
			}
		} else {
		}
	}
	_evntSelecteurRessource(aRessource) {
		this.ressourceSelectionnee = aRessource.element;
		this.lancerRequeteDomaine();
	}
	_genererPdf(aService) {
		const lRessources =
			new ObjetListeElements_1.ObjetListeElements().addElement(
				this.ressourceSelectionnee,
			);
		lRessources.setSerialisateurJSON({ ignorerEtatsElements: true });
		const lParametrageAffichage = {
			genreGenerationPDF:
				TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.EDT,
			estPlanning: false,
			estPlanningParRessource: false,
			estPlanningOngletParJour: false,
			estPlanningParJour: false,
			indiceJour: 0,
			domaine: new TypeDomaine_1.TypeDomaine().setValeur(
				true,
				ObjetDate_1.GDate.getSemaine(this.date),
			),
			ressource: lRessources.get(0),
			ressources: lRessources,
			avecCoursAnnules: true,
			grilleInverse: false,
			prefsGrille: this.lPrefsGrille,
		};
		UtilitaireGenerationPDF_1.GenerationPDF.genererPDF({
			paramPDF: lParametrageAffichage,
			optionsPDF: OptionsPDFSco_1.OptionsPDFSco.EDT,
			cloudCible: !!aService ? aService.getGenre() : null,
		});
	}
	_afficherPopUp(aTitre, aContenu) {
		this._fermerFenetre();
		this.fenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{ pere: this },
			{
				titre: aTitre,
				fermerFenetreSurClicHorsFenetre: true,
				callbackFermer: () => {
					this.fenetre = null;
				},
			},
		);
		this.fenetre.afficher(aContenu);
	}
	_fermerFenetre() {
		if (this.fenetre) {
			this.fenetre.fermer();
		}
	}
	_afficherSortiePeda(aCours) {
		const H = [];
		H.push('<div class="Espace">');
		H.push(
			DetailSortiePedagogique_tsxModele_js_1.ModeleDetailSortiePedagogique.getHtml(
				{
					strGenreRess: aCours.strGenreRess,
					strRess: aCours.strRess,
					motif: aCours.motif,
					strDate:
						UtilitaireEDTSortiePedagogique_1.UtilitaireEDTSortiePedagogique.strDate(
							aCours,
						),
					duree: ObjetDate_1.GDate.formatDureeEnPlaces(aCours.dureeReelle),
					accompagnateurs: aCours.accompagnateurs.join(", "),
					avecMemoVisible: aCours.memo !== undefined,
					getMemo: function () {
						return aCours.memo
							? "<div>" +
									ObjetChaine_1.GChaine.replaceRCToHTML(aCours.memo) +
									"</div>"
							: "";
					},
				},
			),
		);
		H.push("</div>");
		this._afficherPopUp(
			ObjetTraduction_1.GTraductions.getValeur(
				"EDT.AbsRess.SortiePedagogique",
			) +
				" " +
				UtilitaireEDTSortiePedagogique_1.UtilitaireEDTSortiePedagogique.strDate(
					aCours,
				),
			H.join(""),
		);
	}
	_evenementCalendrier(aDate) {
		this.date = ObjetDate_1.GDate.getJour(aDate);
		this.etatUtilisateurSco.setDerniereDate(this.date);
		if (this.estEDTAnnuel && this._cacheRequeteAnnuel) {
			this._surReponseRequeteEDT(
				MethodesObjet_1.MethodesObjet.dupliquer(this._cacheRequeteAnnuel),
			);
		} else {
			this.lancerRequeteEDT();
		}
	}
	_initialiserPageListe(aInstance) {
		aInstance.setOptions({
			estCoursVisible: this.estCoursVisible.bind(this),
			forcerClickCours: this.forcerClickCours,
			avecTrouEDT: this.AvecTrouEDT,
		});
	}
	estCoursVisible(aCours) {
		if (this.estEDTAnnuel) {
			return (
				IE.Cycles.dateEnJourCycle(this.date) ===
				Math.floor(aCours.Debut / GParametres.PlacesParJour)
			);
		}
		return ObjetDate_1.GDate.estJourEgal(this.date, aCours.DateDuCours);
	}
	_surReponseRequeteEDT(aParam) {
		if (
			aParam.prefsGrille &&
			[
				Enumere_Espace_1.EGenreEspace.Eleve,
				Enumere_Espace_1.EGenreEspace.PrimEleve,
				Enumere_Espace_1.EGenreEspace.Parent,
				Enumere_Espace_1.EGenreEspace.PrimParent,
				Enumere_Espace_1.EGenreEspace.Accompagnant,
				Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
				Enumere_Espace_1.EGenreEspace.Tuteur,
			].indexOf(GEtatUtilisateur.GenreEspace) >= 0
		) {
			this.lPrefsGrille =
				UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure.getPrefsGrille(
					aParam.prefsGrille.genreRessource,
					false,
					aParam.prefsGrille.numEtablissement,
				);
		} else {
			this.lPrefsGrille =
				UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure.getPrefsGrilleDefaut();
		}
		const lJoursOuvres =
			UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure.getDomaineJoursOuvresDePrefsGrille(
				this.lPrefsGrille,
			);
		const lProchaineDate =
			UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure.getProchaineDateOuvreeDePrefsGrille(
				this.date,
				this.lPrefsGrille,
			);
		const lSelecteurDate = this.getInstance(this.identSelecteurDate);
		if (
			(lProchaineDate.trouve && lProchaineDate.dateChangee) ||
			!lSelecteurDate.getOptionsCelluleDate().joursSemaineValide ||
			!lSelecteurDate
				.getOptionsCelluleDate()
				.joursSemaineValide.egal(lJoursOuvres)
		) {
			lSelecteurDate.setOptionsObjetCelluleDate({
				joursSemaineValide: lJoursOuvres,
			});
			lSelecteurDate.setDonnees(lProchaineDate.date, true);
			return;
		}
		if (this.estEDTAnnuel && !this._cacheRequeteAnnuel) {
			this._cacheRequeteAnnuel =
				MethodesObjet_1.MethodesObjet.dupliquer(aParam);
		}
		const lListeImages = new ObjetListeElements_1.ObjetListeElements();
		lListeImages.addElement(
			new ObjetElement_1.ObjetElement("IconeTravailAFaire"),
		);
		aParam.listeCours.parcourir((aCours) => {
			aCours.ListeContenus.parcourir((aContenu) => {
				if (
					aContenu.getGenre() === Enumere_Ressource_1.EGenreRessource.Matiere &&
					aCours.avecTafPublie
				) {
					aContenu.Class = "";
					aContenu.listeImages = lListeImages;
				}
			});
		});
		if (aParam.listeCours && aParam.listeCours.count() > 0) {
			if (this.identBtnFlottant) {
				this.identBtnFlottant.setVisible(true);
			}
		}
		this.getInstance(this.identPageListe).setDonnees({
			date: this.date,
			numeroSemaine: ObjetDate_1.GDate.getSemaine(this.date),
			listeCours: aParam.listeCours,
			exclusions: aParam.absences && aParam.absences.joursCycle,
			absences: aParam.listeAbsRessources,
			joursStage: aParam.joursStage,
			disponibilites: aParam.disponibilites,
			avecCoursAnnule: !!aParam && aParam.avecCoursAnnule,
			avecIconeAppel:
				GEtatUtilisateur.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_AppelEtSuivi,
			debutDemiPensionHebdo: aParam.debutDemiPensionHebdo,
			finDemiPensionHebdo: aParam.finDemiPensionHebdo,
			premierePlaceHebdoDuJour: aParam.premierePlaceHebdoDuJour,
			recreations: aParam.recreations,
			jourCycleSelectionne: aParam.jourCycleSelectionne,
			callback: this._fermerFenetre.bind(this),
		});
		if (this.etatUtilisateurSco.getNavigationCours()) {
			const lCoursNav = this.etatUtilisateurSco.getNavigationCours();
			this.etatUtilisateurSco.setNavigationCours(null);
			const lCours = aParam.listeCours.getElementParNumero(
				lCoursNav.getNumero(),
			);
			if (lCours !== null && lCours !== undefined) {
				this.evenementFicheCours(lCours);
			}
		}
		if (
			!!this.actionApresListeCours &&
			MethodesObjet_1.MethodesObjet.isFunction(this.actionApresListeCours)
		) {
			this.actionApresListeCours(aParam);
		}
	}
}
exports.ObjetAffichagePageEmploiDuTemps_Journalier =
	ObjetAffichagePageEmploiDuTemps_Journalier;
function _initSelecteurEdt(aInstance) {
	aInstance.setParametres({
		avecBoutonsPrecedentSuivant: false,
		optionsCombo: {
			getClassElement: function (aParams) {
				return aParams && aParams.element && aParams.element.classeElement
					? aParams.element.classeElement
					: "";
			},
			labelWAICellule:
				ObjetTraduction_1.GTraductions.getValeur("WAI.SelectionEDT"),
		},
	});
}
function _ajouterSalle(aListe, aSalle, aProfondeur) {
	const lProfondeur = aProfondeur || 0;
	const lSalle =
		lProfondeur === 0
			? MethodesObjet_1.MethodesObjet.dupliquer(aSalle)
			: aSalle;
	lSalle.profondeur = lProfondeur;
	lSalle.classeElement =
		lProfondeur > 0 ? "element-indentation" : "element-distinct";
	aListe.addElement(lSalle);
	if (lSalle.liste) {
		lSalle.liste.trier();
		for (let j = 0; j < lSalle.liste.count(); j++) {
			_ajouterSalle(aListe, lSalle.liste.get(j), lProfondeur + 1);
		}
	}
}
