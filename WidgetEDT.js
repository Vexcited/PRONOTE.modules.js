exports.WidgetEDT = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_AffichageGrilleDate_1 = require("Enumere_AffichageGrilleDate");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_DomaineFrequence_1 = require("Enumere_DomaineFrequence");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_EvenementEDT_1 = require("Enumere_EvenementEDT");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeGenreReponseInternetActualite_1 = require("TypeGenreReponseInternetActualite");
const TypeStatutCours_1 = require("TypeStatutCours");
const UtilitairePrefsGrilleStructure_1 = require("UtilitairePrefsGrilleStructure");
const MultipleObjetModule_EDTSaisie = require("ObjetModule_EDTSaisie");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const UtilitaireVisiosSco_1 = require("UtilitaireVisiosSco");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetFenetre_EditionActualite_1 = require("ObjetFenetre_EditionActualite");
const InterfaceGrilleEDT_1 = require("InterfaceGrilleEDT");
const ObjetWidget_1 = require("ObjetWidget");
const AccessApp_1 = require("AccessApp");
var EGenreCommandeEDT;
(function (EGenreCommandeEDT) {
	EGenreCommandeEDT["onglet"] = "onglet";
	EGenreCommandeEDT["information"] = "information";
	EGenreCommandeEDT["sondage"] = "sondage";
	EGenreCommandeEDT["reservationDeSalles"] = "reservationDeSalles";
	EGenreCommandeEDT["reservationDeMateriels"] = "reservationDeMateriels";
	EGenreCommandeEDT["associerURL"] = "associerURL";
})(EGenreCommandeEDT || (EGenreCommandeEDT = {}));
class WidgetEDT extends ObjetWidget_1.Widget.ObjetWidget {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.parametresSco = this.applicationSco.getObjetParametres();
		this.donneesGrille = {
			avecCoursAnnule: this.etatUtilisateurSco.getAvecCoursAnnule(),
			avecCoursAnnulesSuperposes: !this.etatUtilisateurSco.estEspacePourEleve(),
			numeroSemaine: null,
			listeCours: null,
			joursStage: null,
			date: null,
			absences: null,
			prefsGrille: null,
		};
	}
	jsxBoutonCommande(aCommande) {
		return {
			event: () => {
				if (aCommande) {
					if (aCommande.initMenuContextuel) {
						ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
							pere: this,
							evenement: function () {},
							initCommandes: aCommande.initMenuContextuel.bind(
								this,
								this.cours,
							),
						});
					} else {
						this._surCommande(aCommande.getGenre(), aCommande.genreOnglet);
					}
				}
			},
			getDisabled: () => {
				if (!this.listeCommandes || !aCommande) {
					return true;
				}
				return (
					!this.cours ||
					!this.date ||
					!this._estCommandeActive(aCommande, this.cours, this.date) ||
					(aCommande.estVisible && !aCommande.estVisible(this.cours))
				);
			},
		};
	}
	jsxAvecBoutonCoursAnnule() {
		const lAcces = this.etatUtilisateurSco.getAcces();
		return (
			this.etatUtilisateurSco.getAvecChoixCoursAnnule() &&
			lAcces &&
			lAcces.autoriseSurDate
		);
	}
	jsxModelBoutonAfficherCoursAnnule() {
		return {
			event: () => {
				this.etatUtilisateurSco.setAvecCoursAnnule(
					!this.etatUtilisateurSco.getAvecCoursAnnule(),
				);
				this.donneesGrille.avecCoursAnnule =
					this.etatUtilisateurSco.getAvecCoursAnnule();
				this.cours = null;
				this.date = null;
				this.service = null;
				this.classe = null;
				this.grilleEDT.setDonnees(this.donneesGrille);
			},
			getSelection: () => {
				return this.etatUtilisateurSco.getAvecCoursAnnule();
			},
			getTitle: () => {
				if (this.etatUtilisateurSco.getAvecCoursAnnule()) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"EDT.MasquerCoursAnnules",
					);
				}
				return ObjetTraduction_1.GTraductions.getValeur(
					"EDT.AfficherCoursAnnules",
				);
			},
		};
	}
	jsxGetClassesIconeBoutonAfficherCoursAnnule() {
		return UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getClassesMixIconAfficherCoursAnnules(
			this.etatUtilisateurSco.getAvecCoursAnnule(),
		);
	}
	jsxModelBoutonInfosDetails() {
		return {
			event: () => {
				this.grilleEDT.getInstanceGrille().ouvrirFenetreDetailsGrille();
			},
		};
	}
	construire(aParams) {
		this.donnees = aParams.instance.donnees;
		this.donneesRequete = aParams.instance.donneesRequete;
		let lTitre = "";
		if (this.donnees.EDT.prefsGrille) {
			this.avecEDTDuJour = ![
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Etablissement,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace);
			this.donneesGrille.prefsGrille = this.donnees.EDT.prefsGrille;
			if (this.avecEDTDuJour) {
				const lProchaineDate =
					UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure.getProchaineDateOuvreeDePrefsGrille(
						this.donneesRequete.EDT.date,
						this._getPrefsGrille(),
					);
				if (lProchaineDate.trouve) {
					this.donneesRequete.EDT.date = lProchaineDate.date;
					if (lProchaineDate.dateChangee) {
						this.executerEvenementActualiser();
						return;
					}
				}
			}
			this.donneesGrille.date = this.avecEDTDuJour
				? this.donneesRequete.EDT.date
				: null;
			this.donneesGrille.numeroSemaine = this.avecEDTDuJour
				? null
				: this.donneesRequete.EDT.numeroSemaine;
			this.donneesGrille.listeCours = this.donnees.EDT.listeCours;
			this.donneesGrille.listeAbsRessources =
				this.donnees.EDT.listeAbsRessources;
			this.donneesGrille.joursStage = this.donnees.EDT.joursStage;
			this.donneesGrille.disponibilites = this.donnees.EDT.disponibilites;
			this.donneesGrille.absences = this.donnees.EDT.absences;
			if (!this.etatUtilisateurSco.getAvecChoixCoursAnnule()) {
				this.etatUtilisateurSco.setAvecCoursAnnule(
					this.donnees.EDT.avecCoursAnnule,
				);
				this.donneesGrille.avecCoursAnnule =
					this.etatUtilisateurSco.getAvecCoursAnnule();
			}
			let lnumeroSemaine;
			if (!this.avecEDTDuJour) {
				lnumeroSemaine = this.donneesGrille.date
					? IE.Cycles.cycleDeLaDate(this.donneesGrille.date)
					: this.donneesRequete.EDT.numeroSemaine;
			}
			if (!this.avecEDTDuJour) {
				lTitre =
					(this.etatUtilisateurSco.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Etablissement
						? this.etatUtilisateurSco.getUtilisateur().getLibelle() + " - "
						: "") +
					ObjetTraduction_1.GTraductions.getValeur("accueil.emploiDuTemps") +
					" " +
					"(" +
					ObjetTraduction_1.GTraductions.getValeur("Semaine").toLowerCase() +
					" ";
				if (
					this.parametresSco.frequences &&
					this.parametresSco.frequences[lnumeroSemaine]
				) {
					lTitre += [
						Enumere_DomaineFrequence_1.EGenreDomaineFrequence.QZ1,
						Enumere_DomaineFrequence_1.EGenreDomaineFrequence.QZ2,
					].includes(this.parametresSco.frequences[lnumeroSemaine].genre)
						? this.parametresSco.frequences[lnumeroSemaine].libelle
						: ObjetTraduction_1.GTraductions.getValeur("Feriee").toLowerCase();
				} else {
					lTitre += lnumeroSemaine;
				}
				lTitre += ")";
			}
			this._creerObjetsEDT();
		}
		const lWidget = {
			getHtml: this._composeWidgetEDT.bind(this),
			resize: () => {
				if (!!this.grilleEDT) {
					this.grilleEDT.getInstanceGrille().surPostResize();
				}
			},
			titre: lTitre,
			hint: this.avecEDTDuJour
				? ObjetTraduction_1.GTraductions.getValeur("accueil.info.edtJour")
				: ObjetTraduction_1.GTraductions.getValeur("accueil.info.edtSemaine"),
			nbrElements: null,
			afficherMessage: false,
			listeElementsGraphiques: [
				{ id: this.dateEDT ? this.dateEDT.getNom() : null },
				{ id: this.semaineEDT ? this.semaineEDT.getNom() : null },
				{
					html: IE.jsx.str(
						"div",
						{ "ie-if": this.jsxAvecBoutonCoursAnnule.bind(this) },
						UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnAfficherCoursAnnules(
							this.jsxModelBoutonAfficherCoursAnnule.bind(this),
							this.jsxGetClassesIconeBoutonAfficherCoursAnnule.bind(this),
						),
					),
				},
				{
					html: IE.jsx.str(
						"div",
						{ class: "p-left-l" },
						UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnInformationsGrille(
							this.jsxModelBoutonInfosDetails.bind(this),
						),
					),
				},
			],
		};
		$.extend(true, this.donnees.EDT, lWidget);
		aParams.construireWidget(this.donnees.EDT);
		if (this.grilleEDT) {
			this._initialiserObjetsEDT();
		}
		const lCoursCourant = this.getCoursCourant();
		if (lCoursCourant) {
			this.grilleEDT
				.getInstanceGrille()
				.selectionnerCours(lCoursCourant, true, true);
		}
	}
	getCoursCourant() {
		if (!this.donneesGrille.listeCours) {
			return;
		}
		for (const lCours of this.donneesGrille.listeCours) {
			if (lCours.DateDuCours && lCours.Debut && lCours.Fin) {
				const lDateCourante = new Date();
				const lEstCoursCourant = ObjetDate_1.GDate.estJourEgal(
					lCours.DateDuCours,
					lDateCourante,
				);
				const lPlaceCourante = ObjetDate_1.GDate.dateEnPlaceHebdomadaire(
					new Date(),
				);
				if (
					lEstCoursCourant &&
					lPlaceCourante >= lCours.Debut &&
					lPlaceCourante <= lCours.Fin
				) {
					return lCours;
				}
			}
		}
	}
	executerEvenementActualiser(aGenresWidgetsSupplementaires) {
		let lDonneesCallback;
		if (aGenresWidgetsSupplementaires) {
			lDonneesCallback = {
				genresWidgetsSupplemetaires: aGenresWidgetsSupplementaires,
			};
		}
		this.callback.appel(
			this.donnees.EDT.genre,
			Enumere_EvenementWidget_1.EGenreEvenementWidget.ActualiserWidget,
			lDonneesCallback,
		);
	}
	_initialiserSemaineEDT(aObjet) {
		aObjet.setOptionsObjetSaisie({
			longueur: 105,
			avecBoutonsPrecSuiv: true,
			avecBoutonsPrecSuivVisiblesInactifs: false,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionSemaine",
			),
		});
	}
	_initialiserDateEDT(aInstance) {
		aInstance.setOptionsObjetCelluleDate({
			avecBoutonsPrecedentSuivant: true,
			classeCSSTexte: "Maigre",
			largeurComposant: 90,
		});
		const lJoursOuvres =
			UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure.getDomaineJoursOuvresDePrefsGrille(
				this._getPrefsGrille(),
			);
		aInstance.setParametresFenetre(
			this.parametresSco.PremierLundi,
			this.parametresSco.PremiereDate,
			this.parametresSco.DerniereDate,
			lJoursOuvres,
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.domaineConsultationEDT,
			),
		);
	}
	initialiserGrille(aInstance) {
		aInstance.setOptionsInterfaceGrilleEDT({
			avecParametresUtilisateurs: true,
			optionsGrille: {
				tailleMINPasHoraire: 10,
				tailleMAXPasHoraire: 75,
				genreAffichageDate: !this.avecEDTDuJour
					? Enumere_AffichageGrilleDate_1.EGenreAffichageGrilleDate
							.AvecDateEtJour
					: Enumere_AffichageGrilleDate_1.EGenreAffichageGrilleDate
							.AvecFrequence,
				frequences: this.parametresSco.frequences,
				avecSelection: true,
				margeHauteur: 0,
			},
			evenementMouseDownPlace: () => {
				this.cours = null;
				this.donnees.EDT.coursSelectionne = null;
				this.$refreshSelf();
			},
		});
	}
	_evenementSemaineEDT(aParams) {
		if (
			aParams.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection &&
			this.semaineEDT.InteractionUtilisateur
		) {
			const lNumeroSemaine = aParams.element.getGenre();
			this.donneesRequete.EDT.date = undefined;
			this.donneesRequete.EDT.numeroSemaine = lNumeroSemaine;
			this.donnees.EDT.numeroSemaine = lNumeroSemaine;
			this.executerEvenementActualiser();
			this.cours = null;
			this.date = null;
			this.service = null;
			this.classe = null;
		}
	}
	_evenementDateEDT(aDate) {
		this.donneesRequete.EDT.date = aDate;
		this.donneesRequete.EDT.numeroSemaine = IE.Cycles.cycleDeLaDate(aDate);
		this.executerEvenementActualiser();
	}
	evenementSurGrille(aParam) {
		this.cours = aParam.cours;
		this.donnees.EDT.coursSelectionne = this.cours;
		this.date = aParam.date;
		const lThis = this;
		this.cours.ListeContenus.parcourir((aElement) => {
			if (
				aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Service &&
				"classe" in aElement &&
				aElement.classe
			) {
				lThis.service = aElement;
				lThis.classe = aElement.classe;
			}
		});
		this.paramCours = aParam;
		switch (aParam.genre) {
			case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurContenu:
			case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurImage: {
				if (!aParam.cours.coursMultiple) {
					this._requeteFiche(aParam.cours);
				}
				break;
			}
			case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurCours:
			case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurMenuContextuel: {
				if (this.cours.coursMultiple) {
					break;
				}
				if (
					!aParam.selectionNonManuelle &&
					[
						Enumere_Espace_1.EGenreEspace.Professeur,
						Enumere_Espace_1.EGenreEspace.PrimProfesseur,
						Enumere_Espace_1.EGenreEspace.Etablissement,
						Enumere_Espace_1.EGenreEspace.PrimDirection,
					].includes(GEtatUtilisateur.GenreEspace)
				) {
					this._menuContextuel(this.cours, this.date, aParam.id);
				}
				break;
			}
		}
		this.$refreshSelf();
	}
	_estCommandeActive(aCommande, aCours, aDate) {
		if (!aCours) {
			return false;
		}
		if (
			aCours.estRetenue ||
			aCours.getGenre() === TypeStatutCours_1.TypeStatutCours.ConseilDeClasse
		) {
			return false;
		}
		switch (aCommande.genreOnglet) {
			case Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_AppelEtSuivi:
				return (
					(aCours.utilisableAppel || aCours.estSortiePedagogique) &&
					this.etatUtilisateurSco.getIndiceDateSaisieAbsence(aDate) >= 0 &&
					!aCours.estAppelVerrouille &&
					!aCours.estAnnule
				);
			case Enumere_Onglet_1.EGenreOnglet.SaisieCahierDeTextes:
				return !!aCours.utilisableCDT && !aCours.estSortiePedagogique;
		}
		return !aCours.estSortiePedagogique;
	}
	_evenementBoutonInfoSondage(aGenre) {
		const lFenetreEditionActu =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_EditionActualite_1.ObjetFenetre_EditionActualite,
				{ pere: this, initialiser: false },
			);
		lFenetreEditionActu.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				aGenre ===
					TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
						.AvecAR
					? "actualites.creerInfo"
					: "actualites.creerSondage",
			),
			largeur: 750,
			hauteur: 660,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		lFenetreEditionActu.initialiser();
		lFenetreEditionActu.setDonnees({
			donnee: null,
			creation: true,
			cours: this.cours,
			date: this.date,
			genresPublic: [
				Enumere_Ressource_1.EGenreRessource.Eleve,
				Enumere_Ressource_1.EGenreRessource.Enseignant,
				Enumere_Ressource_1.EGenreRessource.Personnel,
			],
			avecChoixAnonyme: false,
			forcerAR: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.forcerARInfos,
			),
			listePublic: new ObjetListeElements_1.ObjetListeElements(),
			genreReponse: aGenre,
			avecRecupModele: true,
		});
	}
	ouvrirFenetreSaisieURL(aCours) {
		const lThis = this;
		const lCallbackApresModification = function () {
			lThis.executerEvenementActualiser();
		};
		UtilitaireVisiosSco_1.UtilitaireVisios.ouvrirFenetreEditionVisiosCours(
			aCours,
			lCallbackApresModification,
		);
	}
	_creerObjetsEDT() {
		this.largeurBoutonEDT = 64;
		if (
			MultipleObjetModule_EDTSaisie &&
			MultipleObjetModule_EDTSaisie.ObjetModule_EDTSaisie
		) {
			this.moduleSaisie =
				new MultipleObjetModule_EDTSaisie.ObjetModule_EDTSaisie({
					instance: this,
					actionSurValidation: this._evenementSurModuleSaisie.bind(this),
				});
		}
		this.listeCommandes = this._creerListeCommandes();
		if (!this.grilleEDT) {
			this.grilleEDT = ObjetIdentite_1.Identite.creerInstance(
				InterfaceGrilleEDT_1.InterfaceGrilleEDT,
				{ pere: this, evenement: this.evenementSurGrille },
			);
			this.initialiserGrille(this.grilleEDT);
		}
		if (!this.semaineEDT && !this.dateEDT) {
			if (this.avecEDTDuJour) {
				this.dateEDT = ObjetIdentite_1.Identite.creerInstance(
					ObjetCelluleDate_1.ObjetCelluleDate,
					{ pere: this, evenement: this._evenementDateEDT },
				);
				this._initialiserDateEDT(this.dateEDT);
			} else {
				this.semaineEDT = ObjetIdentite_1.Identite.creerInstance(
					ObjetSaisie_1.ObjetSaisie,
					{ pere: this, evenement: this._evenementSemaineEDT },
				);
				this._initialiserSemaineEDT(this.semaineEDT);
			}
		}
	}
	_initialiserObjetsEDT() {
		this.grilleEDT.initialiser();
		this.grilleEDT
			.getInstanceGrille()
			.setOptions({
				recreations:
					this.donnees.EDT.recreations || this.parametresSco.recreations,
			});
		this.grilleEDT.setDonnees(this.donneesGrille);
		if (this.dateEDT) {
			this.dateEDT.initialiser();
			this.dateEDT.setDonnees(this.donneesRequete.EDT.date);
		}
		if (this.semaineEDT) {
			this.semaineEDT.initialiser();
			const lDomaineConsultation = this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.domaineConsultationEDT,
			);
			const lListeSemaines = ObjetDate_1.GDate.getListeSemaines(
				lDomaineConsultation.getValeur(this.numeroSemaineParDefaut - 1)
					? this.numeroSemaineParDefaut - 1
					: this.numeroSemaineParDefaut,
				lDomaineConsultation.getValeur(this.numeroSemaineParDefaut + 1)
					? this.numeroSemaineParDefaut + 1
					: this.numeroSemaineParDefaut,
				Enumere_TriElement_1.EGenreTriElement.Croissant,
			);
			this.semaineEDT.setDonnees(
				lListeSemaines,
				lListeSemaines.getIndiceParNumeroEtGenre(
					null,
					this.donneesRequete.EDT.numeroSemaine,
				),
			);
			this.donnees.EDT.numeroSemaine = this.donneesRequete.EDT.numeroSemaine;
		}
	}
	_composeWidgetEDT() {
		const H = [];
		if (this.grilleEDT) {
			H.push('<div class="edt-global-wrapper">');
			H.push(
				'<div class="edt-wrapper" id="',
				this.grilleEDT.getNom(),
				'"></div>',
			);
			if (this.listeCommandes.count() > 0) {
				H.push('<div class="btn-commandes-wrapper">');
				this.listeCommandes.parcourir((aCommande) => {
					if (aCommande.Genre !== null && aCommande.icon) {
						H.push(
							IE.jsx.str(
								IE.jsx.fragment,
								null,
								IE.jsx.str("ie-btnimage", {
									class: aCommande.icon + " btnImageIcon icon",
									role: aCommande.role || "button",
									"aria-haspopup": aCommande.ariaHaspopup || false,
									"ie-model": this.jsxBoutonCommande.bind(this, aCommande),
									title: aCommande.getLibelle(),
								}),
							),
						);
					}
				});
				H.push("</div>");
			}
			H.push("</div>");
		}
		return H.join("");
	}
	_estEspaceAvecSaisieLiensVisio() {
		return [
			Enumere_Espace_1.EGenreEspace.Professeur,
			Enumere_Espace_1.EGenreEspace.Etablissement,
		].includes(GEtatUtilisateur.GenreEspace);
	}
	_creerListeCommandes() {
		const lListeCommandes = new ObjetListeElements_1.ObjetListeElements();
		let lCommande;
		const lThis = this;
		if (
			GEtatUtilisateur.existeGenreOnglet(
				Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_AppelEtSuivi,
			)
		) {
			lCommande = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("accueil.EDT.commande.appel"),
				null,
				EGenreCommandeEDT.onglet,
			);
			lCommande.genreOnglet =
				Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_AppelEtSuivi;
			lCommande.icon = "icon_faire_appel ";
			lCommande.role = "link";
			lListeCommandes.addElement(lCommande);
		}
		if (
			GEtatUtilisateur.existeGenreOnglet(
				Enumere_Onglet_1.EGenreOnglet.SaisieCahierDeTextes,
			)
		) {
			lCommande = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("accueil.EDT.commande.CDT"),
				null,
				EGenreCommandeEDT.onglet,
			);
			lCommande.genreOnglet =
				Enumere_Onglet_1.EGenreOnglet.SaisieCahierDeTextes;
			lCommande.icon = "icon_saisie_cahier_texte_V2";
			lCommande.role = "link";
			lListeCommandes.addElement(lCommande);
		}
		if (
			GEtatUtilisateur.existeGenreOnglet(
				Enumere_Onglet_1.EGenreOnglet.SaisieNotes,
			)
		) {
			lCommande = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("accueil.EDT.commande.notes"),
				null,
				EGenreCommandeEDT.onglet,
			);
			lCommande.genreOnglet = Enumere_Onglet_1.EGenreOnglet.SaisieNotes;
			lCommande.icon = "icon_saisie_note";
			lCommande.role = "link";
			lListeCommandes.addElement(lCommande);
		}
		if (
			GEtatUtilisateur.existeGenreOnglet(
				Enumere_Onglet_1.EGenreOnglet.Evaluation,
			)
		) {
			lCommande = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"accueil.EDT.commande.evaluations",
				),
				null,
				EGenreCommandeEDT.onglet,
			);
			lCommande.genreOnglet = Enumere_Onglet_1.EGenreOnglet.Evaluation;
			lCommande.icon = "icon_saisie_evaluation";
			lCommande.role = "link";
			lListeCommandes.addElement(lCommande);
		}
		if (
			GEtatUtilisateur.existeGenreOnglet(
				Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsBulletin,
			)
		) {
			lCommande = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"accueil.EDT.commande.appreciations",
				),
				null,
				EGenreCommandeEDT.onglet,
			);
			lCommande.genreOnglet =
				Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsBulletin;
			lCommande.icon = "icon_saisie_appreciation";
			lCommande.role = "link";
			lListeCommandes.addElement(lCommande);
		}
		if (this._estEspaceAvecSaisieLiensVisio()) {
			lCommande = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"accueil.EDT.commande.associerURL",
				),
				null,
				EGenreCommandeEDT.associerURL,
			);
			lCommande.icon =
				UtilitaireVisiosSco_1.UtilitaireVisios.getNomIconeParametrageVisios();
			lCommande.ariaHaspopup = "dialog";
			lListeCommandes.addElement(lCommande);
		}
		if (
			[
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Etablissement,
			].includes(GEtatUtilisateur.GenreEspace) &&
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.actualite.avecSaisieActualite,
			)
		) {
			lCommande = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"accueil.EDT.commande.information",
				),
				null,
				EGenreCommandeEDT.information,
			);
			lCommande.icon = "icon_diffuser_information";
			lCommande.ariaHaspopup = "dialog";
			lListeCommandes.addElement(lCommande);
			lCommande = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"accueil.EDT.commande.sondage",
				),
				null,
				EGenreCommandeEDT.sondage,
			);
			lCommande.icon = "icon_diffuser_sondage";
			lCommande.ariaHaspopup = "dialog";
			lListeCommandes.addElement(lCommande);
		}
		if (
			this.moduleSaisie &&
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.estSemaineModifiable,
				this.donneesRequete.EDT.numeroSemaine,
			) &&
			!this.parametresSco.domaineVerrou.getValeur(
				this.donneesRequete.EDT.numeroSemaine,
			)
		) {
			if (
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.cours.modifierSalles,
				)
			) {
				lCommande = new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.ReservationDeSalles",
					),
					null,
					EGenreCommandeEDT.reservationDeSalles,
				);
				lCommande.icon = "icon_reservation_salle";
				lCommande.ariaHaspopup = "menu";
				lCommande.initMenuContextuel = function (aCours, aInstance) {
					lThis.moduleSaisie.initMenuContextuelReservationDeCours(
						aInstance,
						aCours,
						Enumere_Ressource_1.EGenreRessource.Salle,
					);
				};
				lCommande.estVisible = function (aCours) {
					return lThis.moduleSaisie.autoriserReservationRessourcesDeCours(
						aCours,
						Enumere_Ressource_1.EGenreRessource.Salle,
					);
				};
				lListeCommandes.addElement(lCommande);
			}
			if (
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.cours.modifierMateriels,
				)
			) {
				lCommande = new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.ReservationDeMateriels",
					),
					null,
					EGenreCommandeEDT.reservationDeMateriels,
				);
				lCommande.icon = "icon_reservation_materiel";
				lCommande.ariaHaspopup = "menu";
				lCommande.initMenuContextuel = function (aCours, aInstance) {
					lThis.moduleSaisie.initMenuContextuelReservationDeCours(
						aInstance,
						aCours,
						Enumere_Ressource_1.EGenreRessource.Materiel,
					);
				};
				lCommande.estVisible = function (aCours) {
					return lThis.moduleSaisie.autoriserReservationRessourcesDeCours(
						aCours,
						Enumere_Ressource_1.EGenreRessource.Salle,
					);
				};
				lListeCommandes.addElement(lCommande);
			}
			lCommande = new ObjetElement_1.ObjetElement("", null);
			lCommande.addMenus = function (aInstanceMenu, aCours) {
				aInstanceMenu.avecSeparateurSurSuivant();
				lThis.moduleSaisie.initMenuContextuelModifMatiere(
					aInstanceMenu,
					aCours,
				);
			};
			lCommande.ariaHaspopup = "menu";
			lListeCommandes.addElement(lCommande);
			lCommande = new ObjetElement_1.ObjetElement("", null);
			lCommande.addMenus = function (aInstanceMenu, aCours) {
				aInstanceMenu.avecSeparateurSurSuivant();
				lThis.moduleSaisie.initMenuContextuelSupprimer(aInstanceMenu, aCours);
			};
			lCommande.ariaHaspopup = "menu";
			lListeCommandes.addElement(lCommande);
		}
		return lListeCommandes;
	}
	_getPrefsGrille() {
		return UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure.getPrefsGrille(
			this.donneesGrille.prefsGrille.genreRessource,
			false,
			this.donneesGrille.prefsGrille.numEtablissement,
		);
	}
	_initialiserMenuContextuel(aCours, aDate, aInstance) {
		for (let I = 0; I < this.listeCommandes.count(); I++) {
			const lCommande = this.listeCommandes.get(I);
			if (
				aCours &&
				aCours.getGenre() !==
					TypeStatutCours_1.TypeStatutCours.ConseilDeClasse &&
				!aCours.estRetenue &&
				(!lCommande.estVisible || lCommande.estVisible(aCours))
			) {
				if (MethodesObjet_1.MethodesObjet.isFunction(lCommande.addMenus)) {
					lCommande.addMenus(aInstance, aCours);
				} else if (lCommande.Genre === null) {
					aInstance.avecSeparateurSurSuivant();
				} else {
					let lCommandeMenu;
					if (lCommande.initMenuContextuel) {
						lCommandeMenu = aInstance.addSousMenu(
							lCommande.getLibelle(),
							lCommande.initMenuContextuel.bind(this, aCours),
						);
					} else {
						lCommandeMenu = aInstance.addCommande(
							lCommande.getGenre(),
							lCommande.getLibelle(),
							this._estCommandeActive(lCommande, aCours, aDate),
						);
					}
					lCommandeMenu.genreOnglet = lCommande.genreOnglet;
					lCommandeMenu.icon = lCommande.icon;
					lCommandeMenu.largeurImage = 22;
					lCommandeMenu.ariaHasPopup = lCommande.ariaHaspopup;
				}
			}
		}
	}
	_evenementSurMenuContextuel(aLigne) {
		if (aLigne) {
			this._surCommande(aLigne.getNumero(), aLigne.genreOnglet);
		}
	}
	_surCommande(aGenreCommande, aGenreOnglet) {
		if (aGenreCommande === EGenreCommandeEDT.information) {
			this._evenementBoutonInfoSondage(
				TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
					.AvecAR,
			);
			return;
		}
		if (aGenreCommande === EGenreCommandeEDT.sondage) {
			this._evenementBoutonInfoSondage(
				TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
					.ChoixUnique,
			);
			return;
		}
		if (aGenreCommande === EGenreCommandeEDT.associerURL) {
			this.ouvrirFenetreSaisieURL(this.cours);
			return;
		}
		if (!aGenreOnglet) {
			this.grilleEDT.selectionnerGrille();
			return;
		}
		if (this.classe && this.classe.existeNumero()) {
			this.etatUtilisateurSco.Navigation.setRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
				this.classe.getLibelle(),
				this.classe.getNumero(),
				this.classe.getGenre(),
			);
		}
		if (this.service && this.service.existeNumero()) {
			this.etatUtilisateurSco.Navigation.setRessource(
				Enumere_Ressource_1.EGenreRessource.Service,
				this.service.getLibelle(),
				this.service.getNumero(),
				null,
			);
		}
		this.etatUtilisateurSco.setNavigationCours(this.cours);
		this.etatUtilisateurSco.setNavigationDate(this.date);
		this.etatUtilisateurSco.setSemaineSelectionnee(
			this.donneesRequete.EDT.numeroSemaine,
		);
		const lPageDestination = { Onglet: aGenreOnglet };
		this.callback.appel(
			this.donnees.genre,
			Enumere_EvenementWidget_1.EGenreEvenementWidget.NavigationVersPage,
			lPageDestination,
		);
	}
	_evenementSurModuleSaisie() {
		this.cours = null;
		this.date = null;
		this.service = null;
		this.classe = null;
		this.executerEvenementActualiser([
			this.donnees.appelNonFait.genre,
			this.donnees.CDTNonSaisi.genre,
		]);
	}
	_menuContextuel(aCours, aDate, aId) {
		Promise.resolve()
			.then(() => {
				if (this.moduleSaisie) {
					return this.moduleSaisie.remplirCoursInfoModifierMatiereCoursPromise(
						aCours,
					);
				}
			})
			.then(() => {
				ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
					pere: this,
					id: aId,
					evenement: this._evenementSurMenuContextuel.bind(this),
					initCommandes: this._initialiserMenuContextuel.bind(
						this,
						aCours,
						aDate,
					),
				});
			});
	}
	_requeteFiche(aCours) {
		if (
			this.paramCours.genre ===
			Enumere_EvenementEDT_1.EGenreEvenementEDT.SurImage
		) {
			if (this.paramCours.genreImage === 1) {
				const lParamsRequeteFicheCDTSurImage = {
					pourCDT: true,
					cours: aCours,
					numeroSemaine: this.donneesRequete.EDT.numeroSemaine,
				};
				this.callback.appel(
					this.donnees.EDT.genre,
					Enumere_EvenementWidget_1.EGenreEvenementWidget.EvenementPersonnalise,
					lParamsRequeteFicheCDTSurImage,
				);
			} else if (this.paramCours.genreImage === 3) {
				UtilitaireVisiosSco_1.UtilitaireVisios.ouvrirLiensVisioCours(
					aCours.listeVisios,
				);
			}
		} else if (
			this.paramCours.genre ===
			Enumere_EvenementEDT_1.EGenreEvenementEDT.SurContenu
		) {
			const lParamsRequeteFicheCDTSurContenu = {
				pourTAF: true,
				cours: aCours,
				numeroSemaine: this.donneesRequete.EDT.numeroSemaine,
			};
			this.callback.appel(
				this.donnees.EDT.genre,
				Enumere_EvenementWidget_1.EGenreEvenementWidget.EvenementPersonnalise,
				lParamsRequeteFicheCDTSurContenu,
			);
		}
	}
}
exports.WidgetEDT = WidgetEDT;
