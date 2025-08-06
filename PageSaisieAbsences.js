exports.PageSaisieAbsences = void 0;
const ObjetStyle_1 = require("ObjetStyle");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetStyle_2 = require("ObjetStyle");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_Event_1 = require("Enumere_Event");
const ObjetDate_1 = require("ObjetDate");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetScroll_1 = require("ObjetScroll");
const ObjetScroll_2 = require("ObjetScroll");
const ObjetScroll_3 = require("ObjetScroll");
const ObjetTableau_1 = require("ObjetTableau");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ObjetWAI_1 = require("ObjetWAI");
const Enumere_DemiJours_1 = require("Enumere_DemiJours");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_EvenementSaisieAbsences_1 = require("Enumere_EvenementSaisieAbsences");
const EGenreBorne_1 = require("EGenreBorne");
const TypeGenreIndividuAuteur_1 = require("TypeGenreIndividuAuteur");
const tag_1 = require("tag");
const AccessApp_1 = require("AccessApp");
class ObjetDonneeAffichage_Absence_Ligne {
	constructor(aExisteAbsenceOuverte, aDernierePlace) {
		this.ExisteAbsenceOuverte = aExisteAbsenceOuverte;
		this.DernierePlace = aDernierePlace;
	}
}
class ObjetDonneeAffichage_Absence_Cellule {
	constructor() {
		this.AvecAbsence = false;
		this.AvecRetard = false;
		this.AvecExclusion = false;
		this.AvecExclusionDebut = false;
		this.TexteExclusion = "";
		this.TexteRetard = "";
		this.TexteInfirmerie = "";
	}
}
class PageSaisieAbsences extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.appScoEspace = (0, AccessApp_1.getApp)();
		this.etatUtilScoEspace = this.appScoEspace.getEtatUtilisateur();
		this.IdBorne = this.Nom + "_";
		this.IdTrait = this.Nom + "_Trait_";
		this.IdLigneEleve = this.Nom + "_Ligne_";
		this.idGrille = this.Nom + "_Grille";
		this.avecMessageConfirmation = false;
		this.EnAffichage = false;
		this.NbrElevesVisibles = 0;
		this.TexteExclusion = ObjetTraduction_1.GTraductions.getValeur(
			"AbsenceVS.ExclusionAbr",
		);
		this.TexteRetard = "";
		this.TexteInfirmerie = ObjetTraduction_1.GTraductions.getValeur(
			"AbsenceVS.InfirmerieAbr",
		);
		this.ScrollV = new ObjetScroll_1.ObjetScroll(
			this.Nom + ".ScrollV",
			null,
			this,
			this.getScrollTop,
			ObjetScroll_2.EGenreScroll.Vertical,
		);
		this.ScrollH = new ObjetScroll_1.ObjetScroll(
			this.Nom + ".ScrollH",
			null,
			this,
			this.getScrollLeft,
			ObjetScroll_2.EGenreScroll.Horizontal,
		);
		this.ajouterEvenementGlobal(
			Enumere_Event_1.EEvent.SurPreResize,
			this.surPreResize,
		);
		this.ajouterEvenementGlobal(
			Enumere_Event_1.EEvent.SurPostResize,
			this.surPostResize,
		);
		this.ajouterEvenementGlobal(
			Enumere_Event_1.EEvent.SurMouseMove,
			this.evenementMouseMove,
		);
		this.ajouterEvenementGlobal(
			Enumere_Event_1.EEvent.SurMouseUp,
			this.evenementMouseUp,
		);
		this.options = {
			couleurFondEleve: GCouleur.themeNeutre.moyen1,
			couleurTexteEleve: GCouleur.noir,
			heightLigneAjoutEleve: 20,
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			surEventAjoutEleve: function () {
				aInstance.callbackAjoutEleve();
			},
			contexteMenuEleve: function (aLigne, aSurImage) {
				const lEleve = aInstance.ListeElements.get(aLigne);
				if (!!lEleve && !lEleve.estDetache) {
					aInstance.callback.appel(
						Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
							.ClicDroit,
						{
							surImage: aSurImage,
							eleve: aInstance.ListeElements.get(aLigne),
							avecPunition: aInstance.avecSaisiePunition,
						},
					);
				}
			},
			displayCBEleve: function (aLigne) {
				const lEleve = aInstance.ListeElements.get(aLigne);
				if (!lEleve || lEleve.estDetache) {
					return false;
				}
				return _avecSaisieAutoriseSelonEleveEtTypeAbsence(
					lEleve,
					aInstance.TypeAbsence,
					aInstance.cours,
				);
			},
			getStyleLigneEleve: function (aLigne, aPlace) {
				const lEleve = aInstance.ListeElements.get(aLigne),
					lSaisieAutorise = _avecSaisieAutoriseSelonEleveEtTypeAbsence(
						lEleve,
						aInstance.TypeAbsence,
						aInstance.cours,
					),
					LAvecCurseur =
						aInstance.estUneCelluleActive(aPlace) &&
						aInstance.avecSaisieGrille &&
						lSaisieAutorise,
					LCursor = aInstance.determinerCurseur();
				return {
					cursor: LAvecCurseur ? "url(" + LCursor + "), auto;" : "",
					"background-color":
						!aInstance.estUneCelluleGrisee(aPlace) && lSaisieAutorise
							? GCouleur.liste.editable.fond
							: GCouleur.liste.nonEditable.fond,
				};
			},
			getClassLigneEleve: function (aLigne, aPlace) {
				const lEleve = aInstance.ListeElements.get(aLigne),
					lSaisieAutorise = _avecSaisieAutoriseSelonEleveEtTypeAbsence(
						lEleve,
						aInstance.TypeAbsence,
						aInstance.cours,
					),
					LAvecCurseur =
						aInstance.estUneCelluleActive(aPlace) &&
						aInstance.avecSaisieGrille &&
						lSaisieAutorise;
				return LAvecCurseur ? "AvecMain" : "AvecInterdiction";
			},
		});
	}
	setCouleurs(
		ACouleurAbsence,
		ACouleurExclusion,
		ACouleurRetard,
		ACouleurInfirmerie,
	) {
		this.CouleurAbsence = ACouleurAbsence;
		this.CouleurExclusion = ACouleurExclusion;
		this.CouleurRetard = ACouleurRetard;
		this.CouleurInfirmerie = ACouleurInfirmerie;
		this.CouleurFondTransparent = "transparent";
		this.couleurDejaAbsent = "var(--color-red-moyen)";
	}
	setParametres(APlacesParJour, APlacesParHeure, ALibelleHeures) {
		this.PlacesParJour = APlacesParJour;
		this.PlacesParHeure = APlacesParHeure;
		this.ListeHeures = ALibelleHeures;
		this.TypeAbsence = Enumere_Ressource_1.EGenreRessource.Absence;
		this.LargeurMin = 30;
		this.LargeurMax = 75;
		this.LargeurColonneEleve = 180;
		this.LargeurColonneCheckBox = 20;
		this.HauteurCelluleGrille = 21;
		this.HauteurImage = 21;
		this.HauteurImageFermeture = 15;
		this.EpaisseurBorderBorne = 1;
		this.largeurImagePunition = 18;
		this.Deplacement = false;
		this.PositionHorizontaleBornes = [];
	}
	setDonnees(aObjet) {
		this.DonneesRecues = true;
		if (aObjet) {
			this.moteur = aObjet.moteur;
			this.NumeroProfesseur = aObjet.enseignantCourant;
			this.AvecAutorisationSaisieAbsOuverte =
				aObjet.autorisations.saisieAbsenceOuverte;
			this.AvecOptionSaisieAutresProfs = aObjet.autorisations.saisieHorsCours;
			this.ListeElements = aObjet.listeEleves;
			this.PlaceDebut = aObjet.placeGrilleDebut;
			this.PlaceFin = this.PlaceDebut + this.PlacesParJour - 1;
			this.PlaceSaisieDebut = aObjet.placeSaisieDebut;
			this.PlaceSaisieFin = aObjet.placeSaisieFin;
			this.DureeRetard = aObjet.dureeRetard;
			this.Date = aObjet.date;
			this.avecSuppressionAutreAbsence =
				aObjet.autorisations.suppressionAutreAbsence;
			this.avecSuppressionRetardDeVS =
				aObjet.autorisations.suppressionRetardDeVS;
			this.avecSaisieGrille = aObjet.autorisations.saisieGrille;
			this.avecSaisiePunition = aObjet.autorisations.saisiePunition;
			this.nbElevesStage = aObjet.listeElevesStage
				? aObjet.listeElevesStage.count()
				: 0;
			this.message = aObjet.message;
			this.ajoutEleveAutorise = aObjet.autorisations.ajoutEleveAutorise;
			this.callbackAjoutEleve = aObjet.callbackAjoutEleve;
			this.callbackAvecGrille = aObjet.callbackAvecGrille;
			this.cours = aObjet.cours;
		}
		this.ListeElements.trier();
		this.NbrElevesVisibles =
			this.ListeElements.getListeElements((D) => {
				return D.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression;
			}).count() - 1;
		this.avecColonneClasse = false;
		let lStrClasse = "";
		const lSelf = this;
		this.ListeElements.parcourir((aEleve) => {
			if (aEleve.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression) {
				if (aEleve.strClasse && lStrClasse && lStrClasse !== aEleve.strClasse) {
					lSelf.avecColonneClasse = true;
					return false;
				}
				lStrClasse = aEleve.strClasse;
			}
		});
		this.creerTableauCellules();
		this.EnAffichage = true;
		this.rechargerAffichage();
	}
	actualiserPunitionsEleve(aNumeroEleve) {
		if (!this.ListeElements) {
			return;
		}
		const lIndiceEleve =
			this.ListeElements.getIndiceExisteParNumeroEtGenre(aNumeroEleve);
		const lAvecPunition = this.estUneLigneAvecPunition(lIndiceEleve);
		const lEleve = this.ListeElements.get(lIndiceEleve);
		let lTitleEleve = "";
		const lLibelleEleve =
			lEleve.getLibelle() +
			(lEleve.complementInfo ? " " + lEleve.complementInfo : "");
		lTitleEleve +=
			ObjetChaine_1.GChaine.getLongueurChaine(
				lEleve.getLibelle(),
				10,
				true,
				this.LargeurColonneEleve -
					6 -
					(lAvecPunition ? this.largeurImagePunition : 0) -
					(lEleve.anniv ? 17 : 0),
			) !== lEleve.getLibelle()
				? lEleve.getLibelle()
				: "";
		if (lEleve.absentAuDernierCours || lEleve.sortiePeda || lEleve.estDetache) {
			ObjetStyle_2.GStyle.setCouleurTexte(
				this._getIDLigneLibelleEleve(lIndiceEleve),
				this._getCouleurLibelleEleve(lIndiceEleve),
			);
			if (lEleve.absentAuDernierCours) {
				lTitleEleve =
					lLibelleEleve +
					" " +
					ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.EleveAbsentAuDernierCours",
					);
			}
			if (lEleve.sortiePeda) {
				lTitleEleve =
					(lTitleEleve ? lTitleEleve : lLibelleEleve) +
					"\n" +
					lEleve.hintSortiePeda;
			}
			if (lEleve.estDetache) {
				lTitleEleve =
					(lTitleEleve ? lTitleEleve : lLibelleEleve) +
					"\n" +
					lEleve.hintDetache;
			}
		}
		if (lEleve.strStatut) {
			lTitleEleve = (lTitleEleve ? lTitleEleve + "\n" : "") + lEleve.strStatut;
		}
		ObjetHtml_1.GHtml.setHtml(
			this._getIDLigneLibelleEleve(lIndiceEleve),
			lLibelleEleve +
				(lEleve.sortiePeda ? " *" : "") +
				(lEleve.estDetache
					? (0, tag_1.tag)("i", {
							class: [
								this.cours && this.cours.estSortiePedagogique
									? "icon_remove"
									: "icon_eleve_detache",
								"theme-color EspaceGauche",
							],
							title: lEleve.hintDetache,
						})
					: ""),
		);
		ObjetHtml_1.GHtml.setTitle(
			this._getIDLigneLibelleEleve(lIndiceEleve),
			lTitleEleve,
		);
		ObjetStyle_2.GStyle.setDisplay(
			this._getIDLignePunition(lIndiceEleve),
			lAvecPunition,
		);
	}
	setDonneesDureeRetard(ADureeRetard) {
		this.DureeRetard = ADureeRetard;
	}
	setAvecDeplacementBornes(AAvecDeplacementBornes) {
		this.AvecDeplacementBornes = AAvecDeplacementBornes;
	}
	setDonneesPlacesSaisie(APlaceSaisieDebut, APlaceSaisieFin) {
		this.PlaceSaisieDebut = APlaceSaisieDebut;
		this.PlaceSaisieFin = APlaceSaisieFin;
		this.rechargerAffichage();
	}
	setTypeAbsence(ATypeAbsence) {
		this.TypeAbsence = ATypeAbsence;
		const lCursor = this.determinerCurseur();
		$("#" + this.Nom.escapeJQ() + " td[id^=col].AvecMain").css({
			cursor: "url(" + lCursor + "), auto",
		});
		$("#" + this.ScrollV.getIdZone(0).escapeJQ() + " input:checkbox")
			.parent()
			.css({ cursor: "url(" + lCursor + "), auto" });
		if (this.TableauCellules) {
			for (let I = 0; I < this.TableauCellules.length; I++) {
				this.setDonneesCheckBox(I);
			}
		}
		this.$refreshSelf();
	}
	setDonneesCheckBox(I) {
		ObjetHtml_1.GHtml.setCheckBox(this.getIdCheckBoxEleve(I), false);
		if (this.estUneLigneAvecAbsence(I)) {
			ObjetHtml_1.GHtml.setCheckBox(this.getIdCheckBoxEleve(I), true);
		}
	}
	setDonneesLigne(I) {
		this.setDonneesCheckBox(I);
		for (let J = this.PlaceDebut; J <= this.PlaceFin; J++) {
			this.setDonneesCellule(I, J);
		}
	}
	setDonneesCellule(I, J) {
		const LCellule = this.construireCellule(I, J);
		if (LCellule !== ObjetHtml_1.GHtml.getHtml(this.getIdCellule(I, J))) {
			ObjetHtml_1.GHtml.setHtml(this.getIdCellule(I, J), LCellule);
		}
	}
	_getCouleurLibelleEleve(aLigne) {
		const lEleve = this.ListeElements.get(aLigne);
		if (lEleve.sortiePeda) {
			return "var(--theme-neutre-moyen3)";
		}
		if (lEleve.absentAuDernierCours) {
			return this.couleurDejaAbsent;
		}
		return this.options.couleurTexteEleve;
	}
	setStyleLigne(ALigne, aSelection) {
		if (ALigne === null) {
			return;
		}
		if (aSelection) {
			ObjetStyle_2.GStyle.setCouleur(
				this.IdLigneEleve + ALigne,
				GCouleur.selection.fond,
			);
			ObjetStyle_2.GStyle.setCouleur(
				this._getIDLigneLibelleEleve(ALigne),
				null,
				GCouleur.selection.texte,
			);
			ObjetStyle_2.GStyle.setCouleur(
				this._getIDLigneLibelleEleve(ALigne) + "_classe",
				null,
				GCouleur.selection.texte,
			);
			ObjetStyle_2.GStyle.setCouleur(
				this.IdLigneEleve + "_Coche_" + ALigne,
				GCouleur.selection.fond,
				GCouleur.selection.texte,
			);
			ObjetStyle_2.GStyle.setCouleur(
				this._getIDLignePunition(ALigne),
				GCouleur.selection.fond,
				GCouleur.selection.texte,
			);
		} else {
			ObjetStyle_2.GStyle.setCouleur(
				this.IdLigneEleve + ALigne,
				this.options.couleurFondEleve,
			);
			ObjetStyle_2.GStyle.setCouleur(
				this._getIDLigneLibelleEleve(ALigne),
				null,
				this._getCouleurLibelleEleve(ALigne),
			);
			ObjetStyle_2.GStyle.setCouleur(
				this._getIDLigneLibelleEleve(ALigne) + "_classe",
				null,
				this._getCouleurLibelleEleve(ALigne),
			);
			ObjetStyle_2.GStyle.setCouleur(
				this.IdLigneEleve + "_Coche_" + ALigne,
				this.options.couleurFondEleve,
				this.options.couleurTexteEleve,
			);
			ObjetStyle_2.GStyle.setCouleur(
				this._getIDLignePunition(ALigne),
				this.options.couleurFondEleve,
				this.options.couleurTexteEleve,
			);
		}
		for (let J = this.PlaceDebut; J <= this.PlaceFin; J++) {
			if (ALigne - 1 >= 0) {
				ObjetStyle_2.GStyle.setCouleurBordureBas(
					this.getIdCellule(ALigne - 1, J),
					aSelection
						? this.options.couleurTexteEleve
						: GCouleur.liste.editable.getBordure(),
				);
			}
			ObjetStyle_2.GStyle.setCouleurBordureBas(
				this.getIdCellule(ALigne, J),
				aSelection
					? this.options.couleurTexteEleve
					: GCouleur.liste.editable.getBordure(),
			);
		}
	}
	_getIDLignePunition(ALigne) {
		return this.IdLigneEleve + "_P_" + ALigne;
	}
	_getIDLigneLibelleEleve(ALigne) {
		return this.IdLigneEleve + "_LibelleE_" + ALigne;
	}
	_getIDLigneTitreEleve(ALigne) {
		return this.IdLigneEleve + "_LTitre_" + ALigne;
	}
	rechargerAffichage() {
		if (this.ListeElements) {
			this.ListeElements.trier();
			this.afficher();
			for (let i = 0; i < this.NbrElevesVisibles; i++) {
				this.actualiserPunitionsEleve(this.ListeElements.get(i).Numero);
			}
			const lOffsetZone = $(
				"#" + this.getIdZoneBorne(this.PlaceDebut).escapeJQ(),
			).offset();
			if (lOffsetZone) {
				this.PosLeft =
					(lOffsetZone ? lOffsetZone.left : 0) -
					$("#" + this.Nom.escapeJQ()).offset().left;
				this.PosRight = this.PosLeft + this.LargeurPourGrille;
				this.afficherBorne(0);
			}
		}
	}
	initialiserCellule(I, J) {
		const LFondCellule = ObjetTableau_1.GTableau.getCouleurCellule(
			!this.estUneCelluleGrisee(J),
		);
		ObjetStyle_2.GStyle.setCouleurFond(this.getIdCellule(I, J), LFondCellule);
		ObjetStyle_2.GStyle.setCouleurFond(this.getIdZoneCellule(I, J), "");
		ObjetStyle_2.GStyle.setCouleurFond(this.getIdZoneHautDroit(I, J), "");
		ObjetStyle_2.GStyle.setCouleurFond(this.getIdZoneBasDroit(I, J), "");
		ObjetHtml_1.GHtml.setHtml(this.getIdZoneHautGauche(I, J), "");
		ObjetHtml_1.GHtml.setHtml(this.getIdZoneHautCentre(I, J), "");
		ObjetHtml_1.GHtml.setHtml(this.getIdZoneHautGauche(I, J), "");
		ObjetHtml_1.GHtml.setHtml(this.getIdZoneHautDroit(I, J), "");
		ObjetHtml_1.GHtml.setHtml(this.getIdZoneBasGauche(I, J), "");
		ObjetHtml_1.GHtml.setHtml(this.getIdZoneBasDroit(I, J), "");
	}
	actualiserCellule(I, J, LObjetDonneesAffichageCellule) {
		if (LObjetDonneesAffichageCellule) {
			if (!this.TableauCellules[I][J]) {
				ObjetHtml_1.GHtml.setHtml(
					this.getIdCellule(I, J),
					this.construireCelluleVierge(I, J),
				);
			} else {
				this.initialiserCellule(I, J);
			}
			if (LObjetDonneesAffichageCellule.AvecExclusion) {
				ObjetStyle_2.GStyle.setCouleurTexte(
					this.getIdZoneHautCentre(I, J),
					this.CouleurExclusion,
				);
				ObjetStyle_2.GStyle.setCouleurTexte(
					this.getIdZoneHautDroit(I, J),
					this.CouleurExclusion,
				);
				ObjetHtml_1.GHtml.setHtml(
					this.getIdZoneHautDroit(I, J),
					this.dessinerTraitHorizontal(this.CouleurExclusion),
				);
				ObjetHtml_1.GHtml.setHtml(
					this.getIdZoneHautCentre(I, J),
					this._construireDemiCelluleCentre(
						true,
						LObjetDonneesAffichageCellule.AvecExclusionDebut,
					),
				);
				if (LObjetDonneesAffichageCellule.AvecExclusionDebut) {
					ObjetStyle_2.GStyle.setCouleurTexte(
						this.getIdZoneHautGauche(I, J),
						this.CouleurExclusion,
					);
					ObjetHtml_1.GHtml.setHtml(
						this.getIdZoneHautGauche(I, J),
						this.dessinerTraitHorizontal(this.CouleurExclusion),
					);
					if (
						this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Exclusion
					) {
						ObjetHtml_1.GHtml.setTitle(
							this.getIdZoneHautGauche(I, J),
							LObjetDonneesAffichageCellule.libelleMotif,
						);
					}
				}
				if (
					this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Exclusion
				) {
					ObjetHtml_1.GHtml.setTitle(
						this.getIdZoneHautCentre(I, J),
						LObjetDonneesAffichageCellule.libelleMotif,
					);
					ObjetHtml_1.GHtml.setTitle(
						this.getIdZoneHautDroit(I, J),
						LObjetDonneesAffichageCellule.libelleMotif,
					);
				}
			}
			if (LObjetDonneesAffichageCellule.AvecInfirmerie) {
				ObjetStyle_2.GStyle.setCouleurTexte(
					this.getIdZoneBasCentre(I, J),
					this.CouleurInfirmerie,
				);
				ObjetStyle_2.GStyle.setCouleurTexte(
					this.getIdZoneBasDroit(I, J),
					this.CouleurInfirmerie,
				);
				ObjetHtml_1.GHtml.setHtml(
					this.getIdZoneBasDroit(I, J),
					this.dessinerTraitHorizontal(this.CouleurInfirmerie),
				);
				ObjetHtml_1.GHtml.setHtml(
					this.getIdZoneBasCentre(I, J),
					this._construireDemiCelluleCentre(
						false,
						LObjetDonneesAffichageCellule.AvecInfirmerieDebut,
					),
				);
				if (LObjetDonneesAffichageCellule.AvecInfirmerieDebut) {
					ObjetStyle_2.GStyle.setCouleurTexte(
						this.getIdZoneBasGauche(I, J),
						this.CouleurInfirmerie,
					);
					ObjetHtml_1.GHtml.setHtml(
						this.getIdZoneBasGauche(I, J),
						this.dessinerTraitHorizontal(this.CouleurInfirmerie),
					);
					if (
						this.TypeAbsence ===
							Enumere_Ressource_1.EGenreRessource.Infirmerie &&
						this.estUneCelluleActive(J)
					) {
						ObjetHtml_1.GHtml.setTitle(
							this.getIdZoneBasGauche(I, J),
							this.determinerHintInfirmerie(),
						);
					}
				}
				if (
					this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Infirmerie &&
					this.estUneCelluleActive(J)
				) {
					ObjetHtml_1.GHtml.setTitle(
						this.getIdZoneBasCentre(I, J),
						this.determinerHintInfirmerie(),
					);
					ObjetHtml_1.GHtml.setTitle(
						this.getIdZoneBasDroit(I, J),
						this.determinerHintInfirmerie(),
					);
				}
			}
			if (LObjetDonneesAffichageCellule.AvecAbsence) {
				ObjetStyle_2.GStyle.setCouleurFond(
					this.getIdZoneCellule(I, J),
					this.CouleurAbsence,
				);
			}
			if (
				this.determinerSiEstUneCelluleAvecDispense(I, J) ||
				this.determinerSiEstUneCelluleAvecExclusionTemporaire(I, J)
			) {
				ObjetStyle_2.GStyle.setImageFond(
					this.getIdZoneCellule(I, J),
					"images/ObliqueGris.png",
				);
			}
			if (LObjetDonneesAffichageCellule.AvecRetard) {
				ObjetStyle_2.GStyle.setCouleurTexte(
					this.getIdZoneHautGauche(I, J),
					this.CouleurRetard,
				);
				ObjetHtml_1.GHtml.setHtml(
					this.getIdZoneHautGauche(I, J),
					LObjetDonneesAffichageCellule.TexteRetard,
				);
			}
		}
	}
	dessinerTraitHorizontal(LColor, LWidth) {
		LWidth = LWidth !== null && LWidth !== undefined ? LWidth : "100%";
		const T = [];
		T.push(
			'<div style="font-size:1px; width:' +
				LWidth +
				"; height:2px; background-color:" +
				LColor +
				'">&nbsp;</div>',
		);
		return T.join("");
	}
	construireCelluleVierge(I, J) {
		const T = [];
		T.push(
			'<table id="' +
				this.getIdZoneCellule(I, J) +
				'" style="height:' +
				(this.HauteurCelluleGrille - 1) +
				"px;width:" +
				(this.LargeurCellules - 1) +
				'px;">',
		);
		T.push('<tr style="height:50%;">');
		T.push(
			'<td style="width:50%;" id="' +
				this.getIdZoneHautGauche(I, J) +
				'" class="Texte9 Gras"></td>',
		);
		T.push(
			'<td style="width:25%;" id="' +
				this.getIdZoneHautCentre(I, J) +
				'" class="Texte9 Gras"></td>',
		);
		T.push(
			'<td style="width:25%;" id="' + this.getIdZoneHautDroit(I, J) + '"></td>',
		);
		T.push("</tr>");
		T.push('<tr style="height:50%;">');
		T.push(
			'<td style="width:50%;" id="' + this.getIdZoneBasGauche(I, J) + '"></td>',
		);
		T.push(
			'<td style="width:25%;" id="' +
				this.getIdZoneBasCentre(I, J) +
				'" class="Texte9 Gras"></td>',
		);
		T.push(
			'<td style="width:25%;" id="' + this.getIdZoneBasDroit(I, J) + '"></td>',
		);
		T.push("</tr>");
		T.push("</table>");
		return T.join("");
	}
	construireCellule(I, J) {
		const LObjetDonneesAffichageLigne = this.TableauLignes[I];
		const LObjetDonneesAffichageCellule = this.TableauCellules[I][J];
		if (!LObjetDonneesAffichageCellule) {
			return "&nbsp;";
		} else {
			const T = [];
			let LStyleTable = LObjetDonneesAffichageCellule.AvecAbsence
				? " background-color: " + this.CouleurAbsence + "; "
				: "";
			LStyleTable += this.determinerStyleImageFond(I, J);
			const LHintExclusion =
				LObjetDonneesAffichageCellule.AvecExclusion &&
				this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Exclusion
					? 'title="' + LObjetDonneesAffichageCellule.libelleMotif + '"'
					: "";
			const LHintInfirmerie =
				LObjetDonneesAffichageCellule.AvecInfirmerie &&
				this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Infirmerie &&
				this.estUneCelluleActive(J)
					? 'title="' + this.determinerHintInfirmerie() + '"'
					: "";
			const lCurseurInfirmerie =
				LObjetDonneesAffichageCellule.AvecInfirmerie &&
				this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Infirmerie &&
				this.estUneCelluleActive(J)
					? "cursor: url(" + this.determinerCurseur() + "), auto;"
					: "";
			const LAvecOuvertureFermeture =
				LObjetDonneesAffichageCellule.AvecAbsence &&
				LObjetDonneesAffichageCellule.AvecAbsenceFin &&
				LObjetDonneesAffichageLigne.DernierePlace === J &&
				!LObjetDonneesAffichageCellule.AvecDebutAbsencePostPlaceHeureCourante;
			const LCouleurFondSelonOuverture = LAvecOuvertureFermeture
				? "background-color:" +
					(LObjetDonneesAffichageCellule.EstOuverte
						? "#00CC00"
						: "var(--color-red-moyen)") +
					";"
				: "";
			T.push(
				'<table id="' +
					this.getIdZoneCellule(I, J) +
					'" style="' +
					LStyleTable +
					"height:" +
					(this.HauteurCelluleGrille - 1) +
					"px;width:" +
					(this.LargeurCellules - 1) +
					'px;">',
			);
			T.push('<tr style="height:50%;">');
			T.push('<td id="' + this.getIdZoneHautGauche(I, J) + '"');
			T.push(
				' style="width:50%; ' +
					(LObjetDonneesAffichageCellule.AvecRetard
						? "color:" + this.CouleurRetard + ";"
						: "") +
					'" ',
			);
			T.push('class="Texte9 Gras"');
			T.push(LHintExclusion);
			T.push(">");
			T.push(
				LObjetDonneesAffichageCellule.AvecRetard
					? '<div style="position:relative; overflow:hidden; left:2px; top:6px; ' +
							ObjetStyle_2.GStyle.composeHeight(this._getHauteurDemiCellule()) +
							'">' +
							LObjetDonneesAffichageCellule.TexteRetard +
							"</div>"
					: LObjetDonneesAffichageCellule.AvecExclusionDebut
						? this.dessinerTraitHorizontal(this.CouleurExclusion)
						: "",
			);
			T.push("</td>");
			T.push('<td id="' + this.getIdZoneHautCentre(I, J) + '"');
			T.push(
				' style="width:25%; ' +
					(LObjetDonneesAffichageCellule.AvecExclusion
						? "color:" + this.CouleurExclusion + ";"
						: "") +
					'" ',
			);
			T.push('class="Texte9 Gras"');
			T.push(LHintExclusion);
			T.push(">");
			if (LObjetDonneesAffichageCellule.AvecExclusion) {
				T.push(
					this._construireDemiCelluleCentre(
						true,
						LObjetDonneesAffichageCellule.AvecExclusionDebut,
					),
				);
			}
			T.push("</td>");
			T.push('<td id="' + this.getIdZoneHautDroit(I, J) + '"');
			T.push('style="width:25%; ' + LCouleurFondSelonOuverture + '"');
			if (LAvecOuvertureFermeture) {
				T.push(' rowspan="2" ');
				if (this.AvecAutorisationSaisieAbsOuverte) {
					T.push(
						' title="' +
							ObjetChaine_1.GChaine.toTitle(
								LObjetDonneesAffichageCellule.EstOuverte
									? ObjetTraduction_1.GTraductions.getValeur(
											"Absence.HintFermerAbsence",
										)
									: ObjetTraduction_1.GTraductions.getValeur(
											"Absence.HintOuvrirAbsence",
										),
							),
						'"',
					);
				}
			} else {
				T.push(LHintExclusion);
			}
			T.push(
				' onmousedown="' +
					this.Nom +
					".changerEtatAbsence(" +
					I +
					"," +
					J +
					'); GNavigateur.stopperEvenement (event);"',
			);
			T.push(">");
			if (!LAvecOuvertureFermeture) {
				if (LObjetDonneesAffichageCellule.AvecExclusion) {
					T.push(this.dessinerTraitHorizontal(this.CouleurExclusion));
				}
			} else {
				T.push(
					'<div style="width: 100%; height: 100%;" class="' +
						(LObjetDonneesAffichageCellule.EstOuverte
							? "Image_AbsenceOuverte"
							: "Image_AbsenceFermee") +
						'"></div>',
				);
			}
			T.push("</td>");
			T.push("</tr>");
			T.push('<tr style="height:50%;">');
			T.push('<td id="' + this.getIdZoneBasGauche(I, J) + '"');
			T.push(
				' style="width:50%; ' +
					(LObjetDonneesAffichageCellule.AvecInfirmerie
						? "color:" + this.CouleurInfirmerie + ";"
						: "") +
					" " +
					lCurseurInfirmerie +
					'" ',
			);
			T.push(LHintInfirmerie);
			T.push(">");
			T.push(
				LObjetDonneesAffichageCellule.AvecInfirmerieDebut
					? this.dessinerTraitHorizontal(this.CouleurInfirmerie)
					: "",
			);
			T.push("</td>");
			T.push('<td id="' + this.getIdZoneBasCentre(I, J) + '"');
			T.push(
				'style="width:25%; ' +
					(LObjetDonneesAffichageCellule.AvecInfirmerie
						? "color:" + this.CouleurInfirmerie + ";"
						: "") +
					" " +
					lCurseurInfirmerie +
					'" ',
			);
			T.push('class="Texte9 Gras"');
			T.push(LHintInfirmerie);
			T.push(">");
			if (LObjetDonneesAffichageCellule.AvecInfirmerie) {
				T.push(
					this._construireDemiCelluleCentre(
						false,
						LObjetDonneesAffichageCellule.AvecInfirmerieDebut,
					),
				);
			}
			T.push("</td>");
			T.push('<td id="' + this.getIdZoneBasDroit(I, J) + '"');
			if (
				!LAvecOuvertureFermeture &&
				LObjetDonneesAffichageCellule.AvecInfirmerie
			) {
				T.push('style="width:25%; ' + lCurseurInfirmerie + '">');
				T.push(this.dessinerTraitHorizontal(this.CouleurInfirmerie));
			} else {
				T.push('style="width:25%;">');
			}
			T.push("</td>");
			T.push("</tr>");
			T.push("</table>");
			return T.join("");
		}
	}
	_getHauteurDemiCellule() {
		return (this.HauteurCelluleGrille - 1) / 2;
	}
	_construireDemiCelluleCentre(aPourExclusion, aDebut) {
		return aDebut
			? this.dessinerTraitHorizontal(
					aPourExclusion ? this.CouleurExclusion : this.CouleurInfirmerie,
				)
			: '<div class="AlignementMilieu" style="overflow:hidden; ' +
					ObjetStyle_2.GStyle.composeHeight(this._getHauteurDemiCellule()) +
					'">' +
					(aPourExclusion ? this.TexteExclusion : this.TexteInfirmerie) +
					"</div>";
	}
	construireAffichage() {
		if (this.DonneesRecues) {
			if (this.message) {
				this.afficher(this.composeMessage(this.message));
			} else if (this.NbrElevesVisibles < 1 && !this.ajoutEleveAutorise) {
				if (this.nbElevesStage > 0) {
					this.afficher(
						this.composeMessage(
							ObjetTraduction_1.GTraductions.getValeur(
								"Absence.TousLesElevesEnStage",
							),
						),
					);
				} else {
					this.afficher(
						this.composeMessage(
							ObjetTraduction_1.GTraductions.getValeur("Absence.AucunEleve"),
						),
					);
				}
			} else {
				if (this.callbackAvecGrille) {
					this.callbackAvecGrille();
				}
				this.LargeurCellules = this.calculerLargeurCellules();
				this.LargeurPourGrille = this.getScrollLeft(
					ObjetScroll_3.EGenreScrollEvenement.TailleZone,
				);
				this.HauteurPourGrille = this.getScrollTop(
					ObjetScroll_3.EGenreScrollEvenement.TailleZone,
				);
				this.afficher(this.composePage());
				this.LargeurDemiBorne =
					ObjetPosition_1.GPosition.getWidth(
						this.IdBorne + EGenreBorne_1.EGenreBorne.Inferieure,
					) / 2;
				this.ScrollV.setDonnees(0, 1);
				this.ScrollH.setDonnees(1, 2);
				$('[id$="_Appel_Termine"]').width(
					$("#" + this.Nom.escapeJQ() + " table:first").width(),
				);
			}
		}
		return "";
	}
	construireBorne(AGenreBorne) {
		const LClass = this.AvecDeplacementBornes ? "AvecMove" : "AvecInterdiction";
		const LEvent = this.AvecDeplacementBornes
			? ' onmousedown="' + this.Nom + ".enDeplacement (" + AGenreBorne + ')"'
			: "";
		const LAlt = this.AvecDeplacementBornes
			? ObjetTraduction_1.GTraductions.getValeur("Absence.HintBorne")
			: "";
		const H = [];
		H.push(
			'<div id="' +
				this.IdBorne +
				AGenreBorne +
				'" class="Image_Bas ' +
				LClass +
				'" title="' +
				LAlt +
				'" style="position:absolute;z-index:10;" ondragstart="return false"' +
				LEvent +
				">&nbsp;",
		);
		H.push("</div>");
		H.push(
			'<div id="' +
				this.IdTrait +
				AGenreBorne +
				'" style="position:absolute; width:' +
				2 * this.EpaisseurBorderBorne +
				"px; height:" +
				this.HauteurPourGrille +
				"px;" +
				ObjetStyle_2.GStyle.composeCouleurFond(GCouleur.texte) +
				'z-index:10;"></div>',
		);
		return H.join("");
	}
	composePage() {
		const LLargeurGrille = this.PlacesParJour * this.LargeurCellules;
		const LLargeurZoneEleve =
			this.LargeurColonneEleve + this.LargeurColonneCheckBox;
		const H = [];
		H.push(this.construireBorne(EGenreBorne_1.EGenreBorne.Inferieure));
		H.push(this.construireBorne(EGenreBorne_1.EGenreBorne.Superieure));
		H.push(
			'<span tabindex="-1" class="sr-only" id="',
			this.Nom,
			'_infoWAI" ',
			ObjetWAI_1.GObjetWAI.composeAttribut({
				genre: ObjetWAI_1.EGenreAttribut.live,
				valeur: "polite",
			}),
			" ></span>",
		);
		H.push(
			"<table ",
			ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Grid),
			" ",
			ObjetWAI_1.GObjetWAI.composeAttribut({
				genre: ObjetWAI_1.EGenreAttribut.labelledby,
				valeur: this.Nom + "_infoWAI",
			}),
			" ",
			' id="' + this.idGrille + '" tabindex="0" onblur=" if (',
			this.Nom,
			".LigneSelectionnee !== undefined) ",
			this.Nom,
			".setStyleLigne(",
			this.Nom,
			".LigneSelectionnee, false);",
			this.Nom,
			'.LigneSelectionnee =null;" onkeyup="' +
				this.Nom +
				'.surKeyUp();" class="fix-ancienne-feuille-appel TablePrincipaleFeuilleAppel" style="width:' +
				(this.NbrElevesVisibles > 0
					? LLargeurGrille + LLargeurZoneEleve + "px"
					: "100%") +
				';">',
		);
		const lLibelleTitre =
			'<label class="EspaceGauche">' +
			this.NbrElevesVisibles +
			" " +
			ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.Eleves") +
			"</label>";
		H.push("<tr>");
		H.push(
			'<td class="bordure-gauche bordure-haute" style="width:' +
				LLargeurZoneEleve +
				"px; " +
				'">',
			lLibelleTitre + "</td>",
		);
		H.push(
			'<td class="bordure-haute" >' +
				this.composeLibelleHoraires("Texte9", LLargeurGrille) +
				"</td>",
		);
		H.push('<td class="bordure-droite bordure-haute"></td>');
		H.push("</tr>");
		if (this.ajoutEleveAutorise) {
			H.push("<tr>");
			H.push(
				'<td colspan="2" class="bordure-haute bordure-gauche bordure-basse">',
				'<div class="NoWrap AvecMain p-left p-bottom" style="height:',
				this.options.heightLigneAjoutEleve,
				"px; line-height:",
				this.options.heightLigneAjoutEleve,
				"px;",
				ObjetStyle_2.GStyle.composeCouleurFond(GCouleur.blanc),
				'" ie-event="click->surEventAjoutEleve">',
				'<i class="icon_plus_cercle liste-creation" role="presentation"></i>',
				'<div class="Italique PetitEspaceGauche InlineBlock AlignementMilieuVertical" style="',
				ObjetStyle_2.GStyle.composeCouleurTexte(GCouleur.texteListeCreation),
				'">',
				ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.ajouterUnEleve"),
				"</div>",
				"</div>",
				"</td>",
			);
			H.push('<td class="bordure-haute bordure-gauche bordure-basse"></td>');
			H.push("</tr>");
		}
		H.push("<tr>");
		H.push("<td>" + this.composeListeEleves("", LLargeurZoneEleve) + "</td>");
		H.push("<td>" + this.composeGrille("Gras", LLargeurGrille) + "</td>");
		H.push(
			'<td class="bordure-droite" id="' +
				this.ScrollV.getIdScroll() +
				'"></td>',
		);
		H.push("</tr>");
		H.push("<tr>");
		H.push("<td></td>");
		H.push('<td id="' + this.ScrollH.getIdScroll() + '"></td>');
		H.push("<td></td>");
		H.push("</tr>");
		H.push("</table>");
		return H.join("");
	}
	composeLibelleHoraires(LClassTable, LLargeurGrille) {
		const H = [];
		H.push(
			"<div ",
			ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Row),
			' tabindex="-1">',
		);
		for (let J = 0; J < this.PlacesParJour; J++) {
			if (this.ListeHeures.getActif(J)) {
				H.push(
					"<div ",
					ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Columnheader),
					' id="' +
						this._getIdLibelleH(J) +
						'" class="' +
						LClassTable +
						'" style="display:none; position:absolute; z-index:2;">' +
						this.ListeHeures.getLibelle(J) +
						"</div>",
				);
			}
		}
		H.push("</div>");
		H.push(
			'<div tabindex="-1" id="' +
				this.ScrollV.getIdZone(2) +
				'" style="width:1px; overflow:hidden;">',
		);
		H.push(
			'<table id="' +
				this.ScrollV.getIdContenu(2) +
				'" style="width:' +
				LLargeurGrille +
				'px;">',
		);
		H.push('<tr style="height:' + this.HauteurImage + 'px;">');
		for (let J = this.PlaceDebut; J <= this.PlaceFin; J++) {
			H.push(
				'<td style="width:' +
					this.LargeurCellules +
					'px;" id="' +
					this.getIdZoneBorne(J) +
					'">&nbsp;</td>',
			);
		}
		H.push("</tr>");
		H.push("<tr>");
		H.push(
			'<td style="height:20px;" colspan="' + this.PlacesParJour + '"></td>',
		);
		H.push("</tr>");
		H.push("</table>");
		H.push("</div>");
		return H.join("");
	}
	_positionnerHoraire(aDecalage) {
		const lLargeur = ObjetChaine_1.GChaine.getLongueurChaine("99h99", 9, true);
		const lPositionLeft =
			this.LargeurColonneEleve + this.LargeurColonneCheckBox;
		const lPositionVertical =
			this.PositionVerticaleBorne +
			this.HauteurImage +
			20 -
			(ObjetChaine_1.GChaine.getHauteurPolice(10) +
				Math.round(ObjetChaine_1.GChaine.getHauteurPolice(10) / 2)) +
			5;
		for (let J = 0; J < this.PlacesParJour; J++) {
			if (this.ListeHeures.getActif(J)) {
				const lElement = ObjetHtml_1.GHtml.getElement(this._getIdLibelleH(J));
				if (!lElement.style) {
					return;
				}
				ObjetPosition_1.GPosition.setTop(lElement, lPositionVertical);
				const lLeft =
					lPositionLeft +
					J * this.LargeurCellules -
					(MethodesObjet_1.MethodesObjet.isUndefined(aDecalage)
						? 0
						: aDecalage);
				if (
					lLeft <= this.PosRight - Math.round(lLargeur / 2) &&
					lLeft >= this.PosLeft
				) {
					ObjetStyle_2.GStyle.setDisplay(lElement, true);
					ObjetPosition_1.GPosition.setLeft(
						lElement,
						lLeft - Math.round(lLargeur / 2),
					);
				} else {
					ObjetStyle_2.GStyle.setDisplay(lElement, false);
				}
			}
		}
	}
	_getIdLibelleH(aIndice) {
		return this.Nom + "_libelleH_" + aIndice;
	}
	composeListeEleves(LClassTable, LLargeurZoneEleve) {
		const lHtml = [];
		let lEleve;
		const lLargeurClasse = 40;
		lHtml.push(
			'<div tabindex="-1" id="',
			this.ScrollV.getIdZone(0),
			'" style="width:',
			LLargeurZoneEleve + 'px; overflow:hidden;" onscroll="',
			this.Nom,
			'.ScrollV.actualiser(0)">',
			'<table id="',
			this.ScrollV.getIdContenu(0),
			'" class="',
			LClassTable,
			'">',
		);
		for (let I = 0; I < this.NbrElevesVisibles; I++) {
			const lChecked = this.estUneLigneAvecAbsence(I) ? " checked" : "";
			lEleve = this.ListeElements.get(I);
			const lTitleEleve = lEleve.estAttendu
				? ""
				: ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.SortieEtabAutorisee",
					);
			lHtml.push(
				'<tr id="' +
					this._getIDLigneTitreEleve(I) +
					'" class="AvecMain" onmousedown="',
				this.Nom,
				".surSelectionEleve(",
				I,
				')">',
				'<td id="',
				this.IdLigneEleve + I,
				'" class="EspaceGauche" ',
				ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Rowheader),
				' title="',
				lTitleEleve,
				'" style="',
				ObjetStyle_2.GStyle.composeCouleur(
					this.options.couleurFondEleve,
					lEleve.estAttendu ? this.options.couleurTexteEleve : GCouleur.vert,
					GCouleur.bordure,
					1,
					ObjetStyle_1.EGenreBordure.gauche + ObjetStyle_1.EGenreBordure.bas,
				),
				'">',
				'<div style="',
				ObjetStyle_2.GStyle.composeWidth(this.LargeurColonneEleve - 5 - 1),
				ObjetStyle_2.GStyle.composeHeight(this.HauteurCelluleGrille - 1),
				"line-height:",
				this.HauteurCelluleGrille - 1,
				'px;">',
			);
			if (this.avecColonneClasse) {
				lHtml.push(
					'<div ie-ellipsis id="' +
						this._getIDLigneLibelleEleve(I) +
						"_classe" +
						'" style="float:right;margin:0 1px 0 0;',
					ObjetStyle_2.GStyle.composeWidth(lLargeurClasse),
					'">',
					lEleve.strClasse,
					"</div>",
				);
			}
			if (lEleve.anniv) {
				lHtml.push(
					'<div class="InlineBlock" style="float:right;margin:0 1px 0 0;" title="' +
						lEleve.anniv +
						'">',
					'<i class="icon_anniversaire" role="img" aria-label="' +
						lEleve.anniv +
						'"></i>',
					"</div>",
				);
			}
			lHtml.push(
				'<div id="' +
					this._getIDLignePunition(I) +
					'" class="InlineBlock" style="float:right;margin:0 1px 0 0;',
				ObjetStyle_2.GStyle.composeWidth(this.largeurImagePunition),
				'display:none;"',
				' ie-event="contextmenu->contexteMenuEleve(',
				I,
				', true)">',
				'<div class="Image_IconePunition"></div>',
				"</div>",
			);
			lHtml.push(
				'<div id="' +
					this._getIDLigneLibelleEleve(I) +
					'" ie-event="contextmenu->contexteMenuEleve(',
				I,
				', false)"',
				lEleve.eleveAjouteAuCours ? ' class="Italique"' : "",
				lEleve.estSorti ? ' class="Barre"' : "",
				" ie-ellipsis>&nbsp;</div>",
				"</div>",
				"</td>",
				'<td id="',
				this.IdLigneEleve + "_Coche_" + I,
				'" class="AvecMain AlignementMilieuVertical AlignementMilieu" style="',
				ObjetStyle_2.GStyle.composeCouleur(
					this.options.couleurFondEleve,
					this.options.couleurTexteEleve,
					GCouleur.bordure,
					1,
					ObjetStyle_1.EGenreBordure.droite + ObjetStyle_1.EGenreBordure.bas,
				),
				"width:",
				this.LargeurColonneCheckBox,
				'px;" onclick="',
				this.Nom,
				".surSelectionEleve(",
				I,
				')">',
				'<ie-checkbox tabindex="-1" ie-display="displayCBEleve(',
				I,
				')" id="',
				this.getIdCheckBoxEleve(I),
				'"',
				lChecked,
				' style="cursor: url(',
				this.determinerCurseur(),
				'), auto;" onchange="',
				this.Nom,
				".evenementSurCheckBoxEleve(",
				I,
				')" onfocus="',
				this.Nom,
				".surSelectionEleve(",
				I,
				')"></ie-checkbox>',
				"</td>",
				"</tr>",
			);
		}
		lHtml.push("</table>", "</div>");
		return lHtml.join("");
	}
	composeGrille(LClassTable, LLargeurGrille) {
		const H = [];
		H.push(
			'<div tabindex="-1" id="' +
				this.ScrollV.getIdZone(1) +
				'" style="width:100%; overflow:hidden;">',
		);
		H.push(
			'<table  id="' +
				this.ScrollV.getIdContenu(1) +
				'" class="grille-horaire ' +
				LClassTable +
				'" style="table-layout: fixed; width:' +
				LLargeurGrille +
				'px">',
		);
		for (let I = 0; I < this.NbrElevesVisibles; I++) {
			H.push('<tr onclick="' + this.Nom + ".surSelectionEleve(" + I + ')">');
			for (let J = this.PlaceDebut; J <= this.PlaceFin; J++) {
				H.push(
					"<td  ",
					ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Gridcell),
					' id="' + this.getIdCellule(I, J) + '" class="' + LClassTable + '"',
					' style="height:' +
						(this.HauteurCelluleGrille - 1) +
						"px; width:" +
						(this.LargeurCellules - 1) +
						"px;" +
						ObjetStyle_2.GStyle.composeCouleurBordure(
							GCouleur.bordure,
							1,
							ObjetStyle_1.EGenreBordure.droite +
								ObjetStyle_1.EGenreBordure.bas,
						),
					'"',
					' ie-style="getStyleLigneEleve (',
					I,
					",",
					J,
					')"',
					' ie-class="getClassLigneEleve (',
					I,
					",",
					J,
					')"',
					' onmousedown="' +
						this.Nom +
						".evenementMouseDown(event, " +
						I +
						"," +
						J +
						')" onmouseup="' +
						this.Nom +
						"._mouseup(" +
						I +
						"," +
						J +
						')" onmouseover="' +
						this.Nom +
						".evenementMouseOver(" +
						I +
						"," +
						J +
						')">',
				);
				H.push(this.construireCellule(I, J));
				H.push("</td>");
			}
			H.push("</tr>");
		}
		H.push("</table>");
		H.push("</div>");
		return H.join("");
	}
	changerEtatAbsence(ALigne, AColonne) {
		if (
			this.estUneCelluleActive(AColonne) &&
			!this.determinerSiEstUneCelluleAvecDispense(ALigne, AColonne) &&
			!this.determinerSiEstUneCelluleAvecExclusionTemporaire(ALigne, AColonne)
		) {
			const LEleve = this.ListeElements.get(ALigne);
			if (
				!_avecSaisieAutoriseSelonEleveEtTypeAbsence(
					LEleve,
					this.TypeAbsence,
					this.cours,
				)
			) {
				return;
			}
			const N = LEleve.ListeAbsences.count();
			for (let J = 0; J < N; J++) {
				const LAbsence = LEleve.ListeAbsences.get(J);
				if (LAbsence.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression) {
					if (
						LAbsence.getGenre() ===
							Enumere_Ressource_1.EGenreRessource.Absence &&
						AColonne === LAbsence.PlaceFin
					) {
						if (this.AvecAutorisationSaisieAbsOuverte) {
							if (this.autoriseDeChangerLAbsence(LAbsence, LEleve)) {
								const LMessage = LAbsence.EstOuverte
									? ObjetTraduction_1.GTraductions.getValeur(
											"AbsenceVS.msgClotureAbsence",
										)
									: ObjetChaine_1.GChaine.format(
											ObjetTraduction_1.GTraductions.getValeur(
												"AbsenceVS.msgOuvrirAbsence",
											),
											[
												ObjetDate_1.GDate.formatDate(this.Date, "%JJ/%MM"),
												ObjetDate_1.GDate.formatDate(
													ObjetDate_1.GDate.placeAnnuelleEnDate(
														LAbsence.PlaceDebut,
													),
													"%hh%sh%mm ?",
												),
											],
										);
								const lThis = this;
								this.appScoEspace.getMessage().afficher({
									type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
									message: LMessage,
									callback: function (aGenreAction) {
										lThis.surValidationChangerEtatAbsence(
											aGenreAction,
											ALigne,
											AColonne,
										);
									},
								});
							}
							if (
								!this.AvecOptionSaisieAutresProfs &&
								ObjetDate_1.GDate.placeAnnuelleEnDate(
									this.PlaceSaisieFin,
									true,
								) < new Date()
							) {
								this.appScoEspace
									.getMessage()
									.afficher({
										type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
										message: ObjetTraduction_1.GTraductions.getValeur(
											"AbsenceVS.msgImpossibleOuvrirAbsence",
										),
									});
							}
						}
					}
				}
			}
			this.creerTableauCellules();
			this.setDonneesLigne(ALigne);
		}
	}
	autoriseDeChangerLAbsence(aAbsence, aEleve) {
		const lPlaceAnnuelleCourante = ObjetDate_1.GDate.dateEnPlaceAnnuelle(
			new Date(),
		);
		const lAbsencePrecedent = this.absencePrecedentContigu(aAbsence, aEleve);
		const lPlaceDebut = lAbsencePrecedent
			? lAbsencePrecedent.PlaceDebut
			: aAbsence.PlaceDebut;
		const JourMeme = ObjetDate_1.GDate.estJourSemaineEgal(
			this.Date,
			new Date(),
		);
		const HeureActuellePassee = lPlaceDebut <= lPlaceAnnuelleCourante;
		const SurPremierCellule =
			lPlaceAnnuelleCourante > this.PlaceSaisieDebut ||
			this.AvecOptionSaisieAutresProfs;
		const AvantFinPlageSaisie =
			this.AvecOptionSaisieAutresProfs ||
			this.PlaceSaisieFin >= lPlaceAnnuelleCourante;
		const ExisteAbsenceUlterieur = aAbsence.PlaceFin < aEleve.DernierePlace;
		return (
			JourMeme &&
			SurPremierCellule &&
			HeureActuellePassee &&
			AvantFinPlageSaisie &&
			!ExisteAbsenceUlterieur
		);
	}
	absencePrecedentContigu(aAbsence, aEleve) {
		const N = aEleve.ListeAbsences.count();
		for (let J = 0; J < N; J++) {
			const lAbsence = aEleve.ListeAbsences.get(J);
			if (
				lAbsence.getGenre() === aAbsence.getGenre() &&
				lAbsence.getNumero() !== aAbsence.getNumero() &&
				lAbsence.existe()
			) {
				if (lAbsence.PlaceFin === aAbsence.PlaceDebut - 1) {
					return lAbsence;
				}
			}
		}
		return null;
	}
	surValidationChangerEtatAbsence(AAccepte, ALigne, AColonne) {
		if (AAccepte === Enumere_Action_1.EGenreAction.Valider) {
			if (this.estUneCelluleActive(AColonne)) {
				const LEleve = this.ListeElements.get(ALigne);
				LEleve.ExisteAbsenceOuverte = false;
				const N = LEleve.ListeAbsences.count(),
					lPlaceCourante = ObjetDate_1.GDate.dateEnPlaceAnnuelle(new Date());
				for (let J = 0; J < N; J++) {
					let LAbsence = LEleve.ListeAbsences.get(J);
					if (LAbsence.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression) {
						if (
							LAbsence.getGenre() ===
								Enumere_Ressource_1.EGenreRessource.Absence &&
							AColonne === LAbsence.PlaceFin
						) {
							if (this.AvecAutorisationSaisieAbsOuverte) {
								if (
									ObjetDate_1.GDate.estJourSemaineEgal(this.Date, new Date()) &&
									(this.AvecOptionSaisieAutresProfs ||
										ObjetDate_1.GDate.placeAnnuelleEnDate(
											this.PlaceSaisieFin,
											true,
										) > new Date())
								) {
									if (LAbsence.PlaceDebut > lPlaceCourante) {
										LAbsence.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
										LAbsence = this.absencePrecedentContigu(LAbsence, LEleve);
									}
									LAbsence.PlaceFin = lPlaceCourante;
									LAbsence.EstOuverte = !LAbsence.EstOuverte;
									LAbsence.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
								}
							}
						}
					}
				}
				this.callback.appel(
					Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
						.CalculInfoEleve,
					{ eleve: LEleve },
				);
				this.creerTableauCellules();
				this.setDonneesLigne(ALigne);
				this.setEtatSaisie(true);
			}
		}
	}
	surPreResize() {
		if (this.EnAffichage) {
			ObjetHtml_1.GHtml.setHtml(this.Nom, "&nbsp;");
			if (this.FenetreInfirmerie && this.FenetreInfirmerie.estAffiche()) {
				this.FenetreInfirmerie.surValidation(0);
			}
		}
	}
	surPostResize() {
		if (this.EnAffichage) {
			this.rechargerAffichage();
		}
	}
	enDeplacement(AGenreBorne) {
		this.Deplacement = true;
		this.GenreBorneDeplacee = AGenreBorne;
		GNavigateur.debDeplacement(this, this.IdBorne + AGenreBorne);
	}
	surSelectionEleve(I) {
		if (
			this.LigneSelectionnee !== undefined &&
			this.LigneSelectionnee !== null
		) {
			this.setStyleLigne(this.LigneSelectionnee, false);
		}
		this.setStyleLigne(I, true);
		this.LigneSelectionnee = I;
		let lLabelWAI = this.ListeElements.get(I).getLibelle();
		lLabelWAI +=
			this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Absence
				? ObjetTraduction_1.GTraductions.getValeur("Absence.TitreAbsences")
				: this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Retard
					? ObjetTraduction_1.GTraductions.getValeur("Absence.TitreRetards")
					: this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Infirmerie
						? ObjetTraduction_1.GTraductions.getValeur(
								"Absence.TitreInfirmeries",
							)
						: this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Exclusion
							? ObjetTraduction_1.GTraductions.getValeur(
									"Absence.TitreExclusions",
								)
							: "";
		lLabelWAI +=
			" " +
			(document.getElementById(this.getIdCheckBoxEleve(I)).checked
				? ObjetTraduction_1.GTraductions.getValeur("Absence.Coche")
				: ObjetTraduction_1.GTraductions.getValeur("Absence.NonCoche")) +
			" ";
		lLabelWAI += ObjetWAI_1.GObjetWAI.getInfo(
			ObjetWAI_1.EGenreObjet.NavigationVerticalAvecValidation,
		);
		ObjetHtml_1.GHtml.setHtml(this.Nom + "_infoWAI", lLabelWAI);
		this.callback.appel(
			Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.SelectionEleve,
			{ eleve: this.ListeElements.get(I) },
		);
	}
	mouseUpTitre(aLigne, aSurImage) {
		if (!this.avecSaisiePunition) {
			return;
		}
		if (this.LigneSelectionnee !== aLigne) {
			return;
		}
		if (GNavigateur.estSourisBoutonDroit()) {
			this.callback.appel(
				Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
					.ClicDroit,
				{ surImage: aSurImage, eleve: this.ListeElements.get(aLigne) },
			);
		}
	}
	surKeyUp() {
		if (GNavigateur.isToucheFlecheBas()) {
			if (
				this.LigneSelectionnee !== null &&
				this.LigneSelectionnee !== undefined &&
				this.LigneSelectionnee + 1 < this.NbrElevesVisibles
			) {
				this.surSelectionEleve(this.LigneSelectionnee + 1);
			}
		} else if (GNavigateur.isToucheFlecheHaut()) {
			if (
				this.LigneSelectionnee !== null &&
				this.LigneSelectionnee !== undefined &&
				this.LigneSelectionnee - 1 >= 0
			) {
				this.surSelectionEleve(this.LigneSelectionnee - 1);
			}
		} else if (GNavigateur.isToucheSelection()) {
			if (
				this.LigneSelectionnee !== null &&
				this.LigneSelectionnee !== undefined
			) {
				ObjetHtml_1.GHtml.setCheckBox(
					this.getIdCheckBoxEleve(this.LigneSelectionnee),
					!ObjetHtml_1.GHtml.getCheckBox(
						this.getIdCheckBoxEleve(this.LigneSelectionnee),
					),
				);
				this.evenementSurCheckBoxEleve(this.LigneSelectionnee);
				this.surSelectionEleve(this.LigneSelectionnee);
			}
		} else if (GNavigateur.isToucheOnlyTab()) {
			this.surSelectionEleve(0);
		} else if (GNavigateur.isToucheShiftTab()) {
			this.surSelectionEleve(0);
		} else if (this.LigneSelectionnee === undefined) {
			this.setStyleLigne(0, false);
		}
	}
	evenementSurCheckBoxEleve(AIndiceEleve) {
		this.TypeSaisie = ObjetHtml_1.GHtml.getCheckBox(
			this.getIdCheckBoxEleve(AIndiceEleve),
		)
			? Enumere_Etat_1.EGenreEtat.Creation
			: Enumere_Etat_1.EGenreEtat.Suppression;
		let lAvecAbsenceBloquee = false;
		let lEtatSaisieBloquee = 0;
		let LMessage = ObjetTraduction_1.GTraductions.getValeur(
			"AbsenceVS.msgConfimation",
		);
		const lPlaceAnnuelleCourante = ObjetDate_1.GDate.dateEnPlaceAnnuelle(
			new Date(),
		);
		let lGenreIndividuAyantSaisiAbs = null;
		for (let I = this.PlaceSaisieDebut; I <= this.PlaceSaisieFin; I++) {
			if (
				this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Absence &&
				this.TypeSaisie === Enumere_Etat_1.EGenreEtat.Creation &&
				this.TableauLignes[AIndiceEleve].ExisteAbsenceOuverte &&
				I >= lPlaceAnnuelleCourante
			) {
				lAvecAbsenceBloquee = true;
				lEtatSaisieBloquee = 4;
				LMessage = ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.msgEleveAbsenceOuverte",
				);
			}
			if (this.determinerSiSaisieBloquee(AIndiceEleve, I)) {
				lAvecAbsenceBloquee =
					this.etatUtilScoEspace.GenreEspace !==
					Enumere_Espace_1.EGenreEspace.Etablissement;
				const lEtat = !this.getNumeroProfesseurAbsence(AIndiceEleve, I)
					? (this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Absence &&
							this.avecSuppressionAutreAbsence) ||
						(this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Retard &&
							this.avecSuppressionRetardDeVS)
						? 1
						: 2
					: 3;
				if (lEtat === 3 && lGenreIndividuAyantSaisiAbs === null) {
					lGenreIndividuAyantSaisiAbs = this.getGenreProfesseurAbsence(
						AIndiceEleve,
						I,
					);
				}
				if (lEtatSaisieBloquee < lEtat) {
					lEtatSaisieBloquee = lEtat;
				}
			}
			if (
				this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Absence &&
				this.TypeSaisie === Enumere_Etat_1.EGenreEtat.Creation &&
				this.determinerSiEstUneCelluleAvecDispense(AIndiceEleve, I)
			) {
				lAvecAbsenceBloquee =
					!this.determinerSiEstUneCelluleAvecDispensePresenceOblig(
						AIndiceEleve,
						I,
					);
				lEtatSaisieBloquee = 6;
			}
			if (
				this.determinerSiEstUneCelluleAvecExclusionTemporaire(AIndiceEleve, I)
			) {
				lAvecAbsenceBloquee = true;
				lEtatSaisieBloquee = 5;
			}
		}
		if (lAvecAbsenceBloquee) {
			switch (lEtatSaisieBloquee) {
				case 0:
					LMessage = ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.msgDispense",
					);
					break;
				case 1:
					LMessage = ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.msgConfimation",
					);
					break;
				case 2:
					LMessage = ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.msgPasAutorise",
					);
					break;
				case 3:
					LMessage =
						lGenreIndividuAyantSaisiAbs ===
						TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur.GIA_Personnel
							? ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.msgAutrePersonnel",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.msgAutreProf",
								);
					break;
				case 4:
					LMessage = ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.msgEleveAbsenceOuverte",
					);
					break;
				case 5:
					LMessage = ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.msgExclusionTemporaire",
					);
					break;
				case 6:
					LMessage = ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.msgSaisieAbsSurDispenseSansPresence",
					);
					break;
				default:
					break;
			}
			if (lEtatSaisieBloquee < 2) {
				const lThis = this;
				this.appScoEspace.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: LMessage,
					callback: function (aGenreAction) {
						lThis.surConfirmationCheckBox(aGenreAction, AIndiceEleve);
					},
				});
			} else {
				const lIdCB = this.getIdCheckBoxEleve(AIndiceEleve);
				ObjetHtml_1.GHtml.setCheckBox(
					lIdCB,
					!ObjetHtml_1.GHtml.getCheckBox(lIdCB),
				);
				this.appScoEspace
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message: LMessage,
					});
			}
		} else {
			this.evenementSaisieAbsence(
				this.TypeSaisie,
				this.TypeAbsence,
				AIndiceEleve,
				this.PlaceSaisieDebut,
				this.PlaceSaisieFin,
			);
		}
	}
	surConfirmationCheckBox(aAccepte, AIndiceEleve) {
		let lResult = true;
		if (!aAccepte) {
			this.evenementSaisieAbsence(
				this.TypeSaisie,
				this.TypeAbsence,
				AIndiceEleve,
				this.PlaceSaisieDebut,
				this.PlaceSaisieFin,
			);
		} else {
			lResult = false;
		}
		if (!lResult) {
			ObjetHtml_1.GHtml.setCheckBox(
				this.getIdCheckBoxEleve(AIndiceEleve),
				!ObjetHtml_1.GHtml.getCheckBox(this.getIdCheckBoxEleve(AIndiceEleve)),
			);
		}
	}
	evenementMouseDown(aEvent, ALigne, ACol) {
		GNavigateur.BoutonSouris = GNavigateur.getBoutonSouris(aEvent);
		if (this.estUneCelluleActive(ACol) && this.avecSaisieGrille) {
			this.TypeSaisie = this.estUneCelluleAvecAbsence(
				this.TypeAbsence,
				ALigne,
				ACol,
			)
				? Enumere_Etat_1.EGenreEtat.Suppression
				: Enumere_Etat_1.EGenreEtat.Creation;
			this.surSelectionEleve(ALigne);
			if (
				!_avecSaisieAutoriseSelonEleveEtTypeAbsence(
					this.ListeElements.get(ALigne),
					this.TypeAbsence,
					this.cours,
				)
			) {
				return;
			}
			const lThis = this;
			if (this.determinerSiEstUneCelluleAvecExclusionTemporaire(ALigne, ACol)) {
				this.appScoEspace
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.msgExclusionTemporaire",
						),
					});
			} else if (
				this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Absence &&
				this.TypeSaisie === Enumere_Etat_1.EGenreEtat.Creation &&
				this.determinerSiEstUneCelluleAvecDispense(ALigne, ACol)
			) {
				this.avecMessageConfirmation =
					this.determinerSiEstUneCelluleAvecDispensePresenceOblig(ALigne, ACol);
				if (this.avecMessageConfirmation) {
					this.appScoEspace.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.msgDispense",
						),
						callback: function (aGenreAction) {
							lThis.surConfirmationAbsence(aGenreAction, ALigne, ACol);
						},
					});
				} else {
					this.appScoEspace
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.msgSaisieAbsSurDispenseSansPresence",
							),
						});
				}
			} else if (
				this.determinerSiSaisieBloquee(ALigne, ACol) &&
				this.etatUtilScoEspace.GenreEspace !==
					Enumere_Espace_1.EGenreEspace.Etablissement
			) {
				let lGenreIndividuAyantSaisiAbs = this.getGenreProfesseurAbsence(
					ALigne,
					ACol,
				);
				const lMessage = !this.getNumeroProfesseurAbsence(ALigne, ACol)
					? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.msgPasAutorise")
					: lGenreIndividuAyantSaisiAbs ===
							TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur.GIA_Personnel
						? ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.msgAutrePersonnel",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.msgAutreProf",
							);
				if (
					(this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Absence &&
						!this.avecSuppressionAutreAbsence) ||
					(this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Retard &&
						!this.avecSuppressionRetardDeVS) ||
					(this.getNumeroProfesseurAbsence(ALigne, ACol) !==
						this.etatUtilScoEspace.getMembre().getNumero() &&
						!!this.getNumeroProfesseurAbsence(ALigne, ACol))
				) {
					this.appScoEspace
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
							message: lMessage,
						});
				} else {
					this.avecMessageConfirmation = true;
					this.appScoEspace.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.msgConfimation",
						),
						callback: function (aGenreAction) {
							lThis.surConfirmationAbsence(aGenreAction, ALigne, ACol);
						},
					});
				}
			} else {
				this.surConfirmationAbsence(null, ALigne, ACol);
			}
		} else {
			if (
				this.estUneCelluleActive(ACol) &&
				this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Infirmerie &&
				GNavigateur.estSourisBoutonDroit() &&
				this.callback.appel(
					Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
						.RecupererAbsence,
					{
						numeroEleve: this.ListeElements.get(ALigne).getNumero(),
						genreAbsence: this.TypeAbsence,
						place: ACol,
					},
				)
			) {
				this._afficherFenetreInfirmerie = true;
			}
		}
	}
	_mouseup(aLigne, aCol) {
		if (this._afficherFenetreInfirmerie) {
			this.callback.appel(
				Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
					.Infirmerie,
				{
					numeroEleve: this.ListeElements.get(aLigne).getNumero(),
					place: aCol,
				},
			);
			this._afficherFenetreInfirmerie = false;
		}
	}
	surConfirmationAbsence(aAccepte, aLigne, aCol) {
		if (!aAccepte) {
			if (
				this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Absence &&
				this.TypeSaisie === Enumere_Etat_1.EGenreEtat.Creation &&
				this.TableauLignes[aLigne].ExisteAbsenceOuverte &&
				aCol > this.TableauLignes[aLigne].DernierePlace
			) {
				this.appScoEspace
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.msgEleveAbsenceOuverte",
						),
					});
			} else {
				if (
					this.TypeAbsence !== Enumere_Ressource_1.EGenreRessource.Infirmerie ||
					this.TypeSaisie === Enumere_Etat_1.EGenreEtat.Creation ||
					!GNavigateur.estSourisBoutonDroit()
				) {
					const LMessage = new Array("");
					const SaisieValide = this.determinerSiEstUneSaisieValide(
						aLigne,
						aCol,
						LMessage,
					);
					if (SaisieValide) {
						this.SaisieEnCours = true;
						this.LigneSaisie = aLigne;
						this.DebutColonne = aCol;
						this.LigneCourante = aLigne;
						this.ColonneCourante = aCol;
						this.SensCroissant = true;
						if (
							this.TypeAbsence ===
								Enumere_Ressource_1.EGenreRessource.Exclusion &&
							this.TypeSaisie === Enumere_Etat_1.EGenreEtat.Creation
						) {
							return;
						}
						const LObjetDonneesAffichageCellule =
							this.creerObjetDonneeAffichageAbsenceCellule(
								this.determinerSiEstUneCelluleAvecAbsence(
									Enumere_Ressource_1.EGenreRessource.Absence,
									aLigne,
									aCol,
									true,
								),
								this.determinerSiEstUneCelluleAvecAbsence(
									Enumere_Ressource_1.EGenreRessource.Retard,
									aLigne,
									aCol,
								),
								this.determinerSiEstUneCelluleAvecAbsence(
									Enumere_Ressource_1.EGenreRessource.Exclusion,
									aLigne,
									aCol,
								),
								this.determinerSiEstUneCelluleAvecAbsence(
									Enumere_Ressource_1.EGenreRessource.Exclusion,
									aLigne,
									aCol,
								) &&
									this.TableauCellules[aLigne][aCol] &&
									this.TableauCellules[aLigne][aCol].AvecExclusionDebut,
								this.determinerSiEstUneCelluleAvecAbsence(
									Enumere_Ressource_1.EGenreRessource.Infirmerie,
									aLigne,
									aCol,
								),
								this.determinerSiEstUneCelluleAvecAbsence(
									Enumere_Ressource_1.EGenreRessource.Infirmerie,
									aLigne,
									aCol,
								) &&
									this.TableauCellules[aLigne][aCol] &&
									this.TableauCellules[aLigne][aCol].AvecInfirmerieDebut,
							);
						this.actualiserCellule(aLigne, aCol, LObjetDonneesAffichageCellule);
						this.setEtatSaisie(true);
					} else {
						this.appScoEspace
							.getMessage()
							.afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
								message: LMessage[0],
							});
					}
				} else {
					if (GNavigateur.estSourisBoutonDroit()) {
						this._afficherFenetreInfirmerie = true;
					}
				}
			}
		}
		if (this.avecMessageConfirmation) {
			this.avecMessageConfirmation = false;
			this.evenementMouseUp();
		}
	}
	evenementMouseUp() {
		if (!this.avecMessageConfirmation) {
			if (this.Deplacement) {
				let LPlace;
				this.Deplacement = false;
				const X_initiale = ObjetPosition_1.GPosition.getLeft(
					this.getIdZoneBorne(this.PlaceDebut),
				);
				const X_borne = ObjetPosition_1.GPosition.getLeft(
					this.IdBorne + this.GenreBorneDeplacee,
				);
				const Quotient = parseInt(
					(X_borne - X_initiale) / this.LargeurCellules,
				);
				const Reste = (X_borne - X_initiale) % this.LargeurCellules;
				if (
					Reste + this.LargeurDemiBorne <
					parseInt(this.LargeurCellules / 2)
				) {
					LPlace = this.PlaceDebut + Quotient;
				} else {
					if (
						this.GenreBorneDeplacee === EGenreBorne_1.EGenreBorne.Superieure
					) {
						LPlace = this.PlaceDebut + Quotient;
					} else {
						LPlace = this.PlaceDebut + Quotient + 1;
					}
				}
				this.callback.appel(
					Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
						.DeplacementBorne,
					{ genreBorne: this.GenreBorneDeplacee, place: LPlace },
				);
			} else if (this.SaisieEnCours) {
				this.SaisieEnCours = false;
				this.FinColonne = this.estUneCelluleActive(this.ColonneCourante)
					? this.ColonneCourante
					: this.determinerFinColonneActive(this.ColonneCourante);
				if (
					this.FinColonne > this.DebutColonne ||
					(this.DebutColonne === this.FinColonne && this.SensCroissant)
				) {
					if (
						this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Absence ||
						(this.TypeAbsence !== Enumere_Ressource_1.EGenreRessource.Absence &&
							this.FinColonne === this.DebutColonne &&
							this.LigneCourante === this.LigneSaisie)
					) {
						const LFinSaisie =
							this.TypeAbsence ===
								Enumere_Ressource_1.EGenreRessource.Exclusion ||
							this.TypeAbsence ===
								Enumere_Ressource_1.EGenreRessource.Infirmerie
								? this.DebutColonne <= this.PlaceSaisieFin &&
									this.DebutColonne >= this.PlaceSaisieDebut
									? this.PlaceSaisieFin
									: this.DebutColonne
								: this.SensCroissant
									? this.FinColonne
									: this.FinColonne - 1;
						const lParametres = {
							numeroEleve: this.ListeElements.getNumero(this.LigneSaisie),
							placeDebut: this.DebutColonne,
							placeFin: LFinSaisie,
							typeAbsence: this.TypeAbsence,
							typeSaisie: this.TypeSaisie,
						};
						if (
							this.TypeAbsence ===
								Enumere_Ressource_1.EGenreRessource.Exclusion &&
							this.TypeSaisie === Enumere_Etat_1.EGenreEtat.Creation
						) {
							this.callback.appel(
								Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
									.CreerExclusion,
								lParametres,
							);
						} else {
							this.callback.appel(
								Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
									.ActionSurAbsence,
								lParametres,
							);
						}
					} else if (
						this.TypeAbsence !== Enumere_Ressource_1.EGenreRessource.Absence
					) {
						this.setDonneesCellule(this.LigneSaisie, this.DebutColonne);
					}
				} else {
					if (
						this.TypeAbsence !== Enumere_Ressource_1.EGenreRessource.Absence
					) {
						this.setDonneesCellule(this.LigneSaisie, this.DebutColonne);
					} else {
						this.callback.appel(
							Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
								.ActionSurAbsence,
							{
								numeroEleve: this.ListeElements.getNumero(this.LigneSaisie),
								placeDebut: this.DebutColonne,
								placeFin: this.DebutColonne,
								typeAbsence: this.TypeAbsence,
								typeSaisie: this.TypeSaisie,
							},
						);
					}
				}
			}
		}
	}
	evenementMouseMove() {
		if (this.Deplacement) {
			const LIdBorneDeplacee = this.IdBorne + this.GenreBorneDeplacee;
			let lLeftBorneDeplacee = $("#" + LIdBorneDeplacee.escapeJQ()).position()
				.left;
			ObjetPosition_1.GPosition.setTop(LIdBorneDeplacee, this._getTopBornes());
			const LPosMinBorneSuperieure =
				this.PositionHorizontaleBornes[EGenreBorne_1.EGenreBorne.Inferieure] +
				this.LargeurCellules;
			if (
				this.GenreBorneDeplacee === EGenreBorne_1.EGenreBorne.Superieure &&
				lLeftBorneDeplacee < LPosMinBorneSuperieure
			) {
				ObjetPosition_1.GPosition.setLeft(
					LIdBorneDeplacee,
					LPosMinBorneSuperieure,
				);
			} else {
				const LPosMaxBorneInferieure =
					this.PositionHorizontaleBornes[EGenreBorne_1.EGenreBorne.Superieure] -
					this.LargeurCellules;
				if (
					this.GenreBorneDeplacee === EGenreBorne_1.EGenreBorne.Inferieure &&
					lLeftBorneDeplacee > LPosMaxBorneInferieure
				) {
					ObjetPosition_1.GPosition.setLeft(
						LIdBorneDeplacee,
						LPosMaxBorneInferieure,
					);
				}
			}
			lLeftBorneDeplacee = $("#" + LIdBorneDeplacee.escapeJQ()).position().left;
			const LEpaisseurDemiBorne =
				this.LargeurDemiBorne + this.EpaisseurBorderBorne;
			const LPosCentreBorneDeplacee = lLeftBorneDeplacee + LEpaisseurDemiBorne;
			if (LPosCentreBorneDeplacee < this.PosLeft) {
				ObjetPosition_1.GPosition.setLeft(
					LIdBorneDeplacee,
					this.PosLeft - LEpaisseurDemiBorne,
				);
			}
			if (LPosCentreBorneDeplacee > this.PosRight) {
				ObjetPosition_1.GPosition.setLeft(
					LIdBorneDeplacee,
					this.PosRight - LEpaisseurDemiBorne,
				);
			}
			lLeftBorneDeplacee = $("#" + LIdBorneDeplacee.escapeJQ()).position().left;
			ObjetPosition_1.GPosition.setLeft(
				this.IdTrait + this.GenreBorneDeplacee,
				lLeftBorneDeplacee +
					ObjetPosition_1.GPosition.getWidth(LIdBorneDeplacee) / 2,
			);
		}
	}
	evenementMouseOver(ALigne, ACol) {
		if (
			this.SaisieEnCours &&
			ACol >= this.DebutColonne &&
			this.estUneCelluleActive(ACol)
		) {
			if (this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Absence) {
				if (this.ColonneCourante < ACol) {
					this.SensCroissant = true;
					for (let I = this.DebutColonne; I <= ACol; I++) {
						const LObjetDonneesAffichageCellule =
							this.creerObjetDonneeAffichageAbsenceCellule(
								this.determinerSiEstUneCelluleAvecAbsence(
									Enumere_Ressource_1.EGenreRessource.Absence,
									this.LigneSaisie,
									I,
									this.SensCroissant,
								),
								this.determinerSiEstUneCelluleAvecAbsence(
									Enumere_Ressource_1.EGenreRessource.Retard,
									this.LigneSaisie,
									I,
								),
								this.determinerSiEstUneCelluleAvecAbsence(
									Enumere_Ressource_1.EGenreRessource.Exclusion,
									this.LigneSaisie,
									I,
								),
								this.determinerSiEstUneCelluleAvecAbsence(
									Enumere_Ressource_1.EGenreRessource.Exclusion,
									ALigne,
									I,
								) &&
									this.TableauCellules[ALigne][I] &&
									this.TableauCellules[ALigne][I].AvecExclusionDebut,
								this.determinerSiEstUneCelluleAvecAbsence(
									Enumere_Ressource_1.EGenreRessource.Infirmerie,
									this.LigneSaisie,
									I,
								),
								this.determinerSiEstUneCelluleAvecAbsence(
									Enumere_Ressource_1.EGenreRessource.Infirmerie,
									ALigne,
									I,
								) &&
									this.TableauCellules[ALigne][I] &&
									this.TableauCellules[ALigne][I].AvecInfirmerieDebut,
							);
						this.actualiserCellule(
							this.LigneSaisie,
							I,
							LObjetDonneesAffichageCellule,
						);
					}
				} else {
					if (ACol < this.ColonneCourante) {
						this.SensCroissant = false;
						for (let I = this.ColonneCourante; I >= ACol; I--) {
							this.setDonneesCellule(this.LigneSaisie, I);
						}
					}
				}
			}
		}
		this.ColonneCourante = ACol;
		this.LigneCourante = ALigne;
	}
	evenementAbsence(aNumeroEleve, aRessourceAbsence) {
		if (aRessourceAbsence === Enumere_Ressource_1.EGenreRessource.Infirmerie) {
			this._afficherFenetreInfirmerie = false;
		}
		this.creerTableauCellules();
		this.setDonneesLigne(
			this.ListeElements.getIndiceParNumeroEtGenre(aNumeroEleve),
		);
	}
	calculerLargeurCellules() {
		const LLargeur =
			this.PlacesParJour +
			this.LargeurColonneEleve +
			this.LargeurColonneCheckBox;
		const LLargeurBrute = parseInt(
			(ObjetPosition_1.GPosition.getWidth(this.Nom) - LLargeur) /
				this.PlacesParJour,
		);
		return LLargeurBrute < this.LargeurMin
			? this.LargeurMin
			: LLargeurBrute > this.LargeurMax
				? this.LargeurMax
				: LLargeurBrute;
	}
	calculerHauteurTable() {
		return this.NbrElevesVisibles * this.HauteurCelluleGrille;
	}
	calculerPositionHorizontaleBorne(AGenreBorne, APlace) {
		let X =
			this.LargeurColonneEleve +
			this.LargeurColonneCheckBox +
			(APlace - this.PlaceDebut) * this.LargeurCellules -
			this.LargeurDemiBorne -
			this.EpaisseurBorderBorne;
		if (AGenreBorne === EGenreBorne_1.EGenreBorne.Superieure) {
			X += this.LargeurCellules;
		}
		return X;
	}
	afficherBorne(ADecalage) {
		this.placerBorne(
			EGenreBorne_1.EGenreBorne.Inferieure,
			this.PlaceSaisieDebut,
			ADecalage,
		);
		this.placerBorne(
			EGenreBorne_1.EGenreBorne.Superieure,
			this.PlaceSaisieFin,
			ADecalage,
		);
		this._positionnerHoraire(!ADecalage ? 0 : ADecalage);
	}
	placerBorne(AGenreBorne, APlace, ADecalage) {
		this.PositionHorizontaleBornes[AGenreBorne] =
			this.calculerPositionHorizontaleBorne(AGenreBorne, APlace) - ADecalage;
		this.PositionVerticaleBorne = $(
			"#" + this.getIdZoneBorne(APlace).escapeJQ(),
		).position().top;
		if (this.determinerSiBorneDansLesLimites(AGenreBorne)) {
			ObjetHtml_1.GHtml.setDisplay(this.IdBorne + AGenreBorne, true);
			ObjetHtml_1.GHtml.setDisplay(this.IdTrait + AGenreBorne, true);
			ObjetPosition_1.GPosition.setPosition(
				this.IdBorne + AGenreBorne,
				this.PositionHorizontaleBornes[AGenreBorne],
				this._getTopBornes() +
					(this.ajoutEleveAutorise ? -this.options.heightLigneAjoutEleve : 0),
			);
			ObjetPosition_1.GPosition.setPosition(
				this.IdTrait + AGenreBorne,
				this.PositionHorizontaleBornes[AGenreBorne] +
					ObjetPosition_1.GPosition.getWidth(this.IdBorne + AGenreBorne) / 2,
				this._getTopBornes() + this.HauteurImage + 21,
			);
		} else {
			ObjetHtml_1.GHtml.setDisplay(this.IdBorne + AGenreBorne, false);
			ObjetHtml_1.GHtml.setDisplay(this.IdTrait + AGenreBorne, false);
		}
	}
	getIdCellule(ALigne, ACol) {
		return "col" + ACol + "ligne" + ALigne;
	}
	getIdZoneCellule(ALigne, ACol) {
		return this.getIdCellule(ALigne, ACol) + "_All";
	}
	getIdZoneHautGauche(ALigne, ACol) {
		return this.getIdCellule(ALigne, ACol) + "_HG";
	}
	getIdZoneHautCentre(ALigne, ACol) {
		return this.getIdCellule(ALigne, ACol) + "_HC";
	}
	getIdZoneHautDroit(ALigne, ACol) {
		return this.getIdCellule(ALigne, ACol) + "_HD";
	}
	getIdZoneBasGauche(ALigne, ACol) {
		return this.getIdCellule(ALigne, ACol) + "_BG";
	}
	getIdZoneBasCentre(ALigne, ACol) {
		return this.getIdCellule(ALigne, ACol) + "_BC";
	}
	getIdZoneBasDroit(ALigne, ACol) {
		return this.getIdCellule(ALigne, ACol) + "_BD";
	}
	getIdZoneRetardExclusion(ALigne, ACol) {
		return this.getIdCellule(ALigne, ACol) + "RetardExclusion";
	}
	getIdZoneRetardExclusionDeb(ALigne, ACol) {
		return this.getIdZoneRetardExclusion(ALigne, ACol) + "Deb";
	}
	getIdZoneRetardExclusionFin(ALigne, ACol) {
		return this.getIdZoneRetardExclusion(ALigne, ACol) + "Fin";
	}
	getIdCheckBoxEleve(I) {
		return this.Nom + "_CB_" + I;
	}
	getIdZoneBorne(ACol) {
		return "borne" + ACol;
	}
	getScrollTop(AGenre, AScrollTop) {
		if (AGenre === ObjetScroll_3.EGenreScrollEvenement.TailleContenu) {
			return null;
		}
		if (AGenre === ObjetScroll_3.EGenreScrollEvenement.TailleZone) {
			AScrollTop =
				$("#" + this.Nom.escapeJQ())
					.parent()
					.parent()
					.height() -
				41 -
				60 -
				27 -
				($("#" + this.ScrollH.getNom().escapeJQ()).height() || 0);
			if (
				ObjetPosition_1.GPosition.getWidth(this.Nom) <=
				this.LargeurCellules * this.PlacesParJour +
					this.LargeurColonneEleve +
					this.LargeurColonneCheckBox +
					22
			) {
				AScrollTop -= 20;
			}
		}
		return Math.min(
			Math.floor(AScrollTop / this.HauteurCelluleGrille) *
				this.HauteurCelluleGrille,
			this.HauteurCelluleGrille * this.NbrElevesVisibles,
		);
	}
	getScrollLeft(AGenre, AScrollLeft) {
		if (AGenre === ObjetScroll_3.EGenreScrollEvenement.TailleContenu) {
			return null;
		}
		if (AGenre === ObjetScroll_3.EGenreScrollEvenement.TailleZone) {
			const LLargeurZoneEleve =
				this.LargeurColonneEleve + this.LargeurColonneCheckBox;
			AScrollLeft =
				ObjetPosition_1.GPosition.getWidth(this.Nom) -
				(LLargeurZoneEleve + this.ScrollV.getTaille(undefined) + 20);
		}
		const lScrollLeft = Math.min(
			Math.floor(AScrollLeft / this.LargeurCellules) * this.LargeurCellules,
			this.LargeurCellules * this.PlacesParJour,
		);
		if (AGenre === ObjetScroll_3.EGenreScrollEvenement.Deplacement) {
			this.afficherBorne(lScrollLeft);
		}
		return lScrollLeft;
	}
	getNumeroProfesseurAbsence(ALigne, ACol) {
		const LTableauCellule = this.TableauCellules[ALigne][ACol];
		return LTableauCellule !== null &&
			LTableauCellule !== undefined &&
			LTableauCellule.Professeur
			? LTableauCellule.Professeur.getNumero()
			: -1;
	}
	getGenreProfesseurAbsence(ALigne, ACol) {
		const LTableauCellule = this.TableauCellules[ALigne][ACol];
		return LTableauCellule !== null &&
			LTableauCellule !== undefined &&
			LTableauCellule.Professeur
			? LTableauCellule.Professeur.getGenre()
			: -1;
	}
	creerTableauCellules() {
		this.TableauLignes = [];
		this.TableauCellules = [];
		const lPlaceAnnuelleCourante = ObjetDate_1.GDate.dateEnPlaceAnnuelle(
			new Date(),
		);
		for (let I = 0; I < this.NbrElevesVisibles; I++) {
			this.TableauCellules[I] = [];
			const LEleve = this.ListeElements.get(I);
			let J, K, LCellule;
			if (LEleve.Numero !== 0) {
				this.TableauLignes[I] = new ObjetDonneeAffichage_Absence_Ligne(
					LEleve.ExisteAbsenceOuverte,
					LEleve.DernierePlace,
				);
				for (J = 0; J < LEleve.ListeAbsences.count(); J++) {
					if (LEleve.ListeAbsences.existe(J)) {
						const LAbsence = LEleve.ListeAbsences.get(J);
						for (K = LAbsence.PlaceDebut; K <= LAbsence.PlaceFin; K++) {
							if (
								this.TableauCellules[I][K] === null ||
								this.TableauCellules[I][K] === undefined
							) {
								this.TableauCellules[I][K] =
									new ObjetDonneeAffichage_Absence_Cellule();
							}
							LCellule = this.TableauCellules[I][K];
							switch (LAbsence.getGenre()) {
								case Enumere_Ressource_1.EGenreRessource.Absence: {
									LCellule.AvecAbsence = true;
									LCellule.EstOuverte = LAbsence.EstOuverte;
									LCellule.AvecAbsenceFin = K === LAbsence.PlaceFin;
									LCellule.AvecDebutAbsencePostPlaceHeureCourante =
										LAbsence.PlaceDebut > lPlaceAnnuelleCourante;
									LCellule.Professeur = LAbsence.Professeur;
									break;
								}
								case Enumere_Ressource_1.EGenreRessource.Retard: {
									LCellule.AvecRetard = true;
									LCellule.TexteRetard = LAbsence.Duree + "'";
									LCellule.TexteExclusion = null;
									LCellule.Professeur = LAbsence.Professeur;
									break;
								}
								case Enumere_Ressource_1.EGenreRessource.Exclusion: {
									if (K === LAbsence.PlaceDebut) {
										LCellule.TexteExclusion = this.TexteExclusion;
									}
									LCellule.AvecExclusion = true;
									LCellule.AvecExclusionDebut = K !== LAbsence.PlaceDebut;
									LCellule.libelleMotif = "";
									if (LAbsence.listeMotifs) {
										LAbsence.listeMotifs.setTri([
											ObjetTri_1.ObjetTri.init("Libelle"),
										]);
										LAbsence.listeMotifs.trier();
										LCellule.libelleMotif = LAbsence.listeMotifs
											.getTableauLibelles()
											.join(", ");
									}
									break;
								}
								case Enumere_Ressource_1.EGenreRessource.Infirmerie: {
									if (K === LAbsence.PlaceDebut) {
										LCellule.TexteInfirmerie = this.TexteInfirmerie;
									}
									LCellule.AvecInfirmerie = true;
									LCellule.AvecInfirmerieDebut = K !== LAbsence.PlaceDebut;
									LCellule.NumeroEleveAccompagnateur =
										LAbsence.Accompagnateur.getNumero();
									break;
								}
							}
						}
					}
				}
				for (J = 0; J < LEleve.ListeDispenses.count(); J++) {
					if (LEleve.ListeDispenses.existe(J)) {
						const LDispense = LEleve.ListeDispenses.get(J);
						for (K = LDispense.PlaceDebut; K <= LDispense.PlaceFin; K++) {
							if (
								this.TableauCellules[I][K] === null ||
								this.TableauCellules[I][K] === undefined
							) {
								this.TableauCellules[I][K] =
									new ObjetDonneeAffichage_Absence_Cellule();
							}
							LCellule = this.TableauCellules[I][K];
							LCellule.AvecDispense = true;
							LCellule.presenceOblig = LDispense.presenceOblig;
						}
					}
				}
				for (J = 0; J < LEleve.ListeExclusionsTemporaires.count(); J++) {
					if (LEleve.ListeExclusionsTemporaires.existe(J)) {
						const LExclusionTemporaire =
							LEleve.ListeExclusionsTemporaires.get(J);
						for (
							K = LExclusionTemporaire.PlaceDebut;
							K <= LExclusionTemporaire.PlaceFin;
							K++
						) {
							if (
								this.TableauCellules[I][K] === null ||
								this.TableauCellules[I][K] === undefined
							) {
								this.TableauCellules[I][K] =
									new ObjetDonneeAffichage_Absence_Cellule();
							}
							LCellule = this.TableauCellules[I][K];
							LCellule.AvecExclusionTemporaire = true;
						}
					}
				}
			}
		}
	}
	creerObjetDonneeAffichageAbsenceCellule(
		AAvecAbsence,
		AAvecRetard,
		AAvecExclusion,
		AAvecExclusionDebut,
		AAvecInfirmerie,
		AAvecInfirmerieDebut,
	) {
		const LObjetDonneesAffichageCellule =
			new ObjetDonneeAffichage_Absence_Cellule();
		if (AAvecAbsence) {
			LObjetDonneesAffichageCellule.AvecAbsence = AAvecAbsence;
		}
		if (AAvecRetard) {
			LObjetDonneesAffichageCellule.AvecRetard = AAvecRetard;
			LObjetDonneesAffichageCellule.TexteRetard = this.TexteRetard;
		}
		if (AAvecExclusion) {
			LObjetDonneesAffichageCellule.AvecExclusion = AAvecExclusion;
			LObjetDonneesAffichageCellule.TexteExclusion = this.TexteExclusion;
		}
		if (AAvecExclusionDebut) {
			LObjetDonneesAffichageCellule.AvecExclusionDebut = AAvecExclusionDebut;
		}
		if (AAvecInfirmerie) {
			LObjetDonneesAffichageCellule.AvecInfirmerie = AAvecInfirmerie;
			LObjetDonneesAffichageCellule.TexteInfirmerie = this.TexteInfirmerie;
		}
		if (AAvecInfirmerieDebut) {
			LObjetDonneesAffichageCellule.AvecInfirmerieDebut = AAvecInfirmerieDebut;
		}
		return LObjetDonneesAffichageCellule;
	}
	evenementSaisieAbsence(
		ATypeSaisie,
		AGenreAbsence,
		AIndiceEleve,
		APlaceDebut,
		APlaceFin,
	) {
		const LMessage = new Array("");
		let LSaisieValide = true;
		for (let I = APlaceDebut; I <= APlaceFin; I++) {
			if (
				LSaisieValide &&
				!this.determinerSiEstUneSaisieValide(AIndiceEleve, I, LMessage)
			) {
				LSaisieValide = false;
				this.appScoEspace
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message: LMessage[0],
					});
			}
		}
		if (LSaisieValide) {
			if (
				AGenreAbsence === Enumere_Ressource_1.EGenreRessource.Exclusion &&
				ATypeSaisie === Enumere_Etat_1.EGenreEtat.Creation
			) {
				const lIdCB = this.getIdCheckBoxEleve(AIndiceEleve);
				this.callback.appel(
					Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
						.CreerExclusion,
					{
						numeroEleve: this.ListeElements.get(AIndiceEleve).getNumero(),
						placeDebut: this.PlaceSaisieDebut,
						placeFin: this.PlaceSaisieFin,
						typeAbsence: AGenreAbsence,
						typeSaisie: ATypeSaisie,
						callbackAnnulation: function () {
							ObjetHtml_1.GHtml.setCheckBox(
								lIdCB,
								!ObjetHtml_1.GHtml.getCheckBox(lIdCB),
							);
						},
					},
				);
				return;
			}
			this.callback.appel(
				Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
					.ActionSurAbsence,
				{
					numeroEleve: this.ListeElements.get(AIndiceEleve).getNumero(),
					placeDebut: this.PlaceSaisieDebut,
					placeFin: this.PlaceSaisieFin,
					typeAbsence: AGenreAbsence,
					typeSaisie: ATypeSaisie,
				},
			);
		} else {
			this.creerTableauCellules();
			this.setDonneesLigne(AIndiceEleve);
		}
	}
	estUneLigneAvecAbsence(I) {
		for (let K = this.PlaceSaisieDebut; K < this.PlaceSaisieFin + 1; K++) {
			if (
				this.TableauCellules[I][K] &&
				this.estUneCelluleAvecAbsence(this.TypeAbsence, I, K)
			) {
				return true;
			}
		}
		return false;
	}
	estUneLigneAvecPunition(aLigne) {
		if (!this.avecSaisiePunition) {
			return false;
		}
		if (!this.ListeElements || !this.ListeElements.get(aLigne)) {
			return false;
		}
		const lListePunitions = this.ListeElements.get(aLigne).listePunitions;
		if (!lListePunitions) {
			return false;
		}
		if (lListePunitions.count() > 0) {
			for (let i = 0; i < lListePunitions.count(); i++) {
				const lPunition = lListePunitions.get(i);
				if (lPunition.existe()) {
					return true;
				}
			}
		}
		return false;
	}
	estUneCelluleAvecAbsence(ATypeAbsence, ALigne, ACol) {
		const LTableauCellule = this.TableauCellules[ALigne][ACol];
		return ATypeAbsence === Enumere_Ressource_1.EGenreRessource.Absence
			? !!(LTableauCellule && LTableauCellule.AvecAbsence)
			: ATypeAbsence === Enumere_Ressource_1.EGenreRessource.Retard
				? !!(LTableauCellule && LTableauCellule.AvecRetard)
				: ATypeAbsence === Enumere_Ressource_1.EGenreRessource.Exclusion
					? !!(LTableauCellule && LTableauCellule.AvecExclusion)
					: !!(LTableauCellule && LTableauCellule.AvecInfirmerie);
	}
	estUneCelluleAvecTexteAbsence(ATypeAbsence, ALigne, ACol) {
		const LTableauCellule = this.TableauCellules[ALigne][ACol];
		return ATypeAbsence === Enumere_Ressource_1.EGenreRessource.Absence
			? false
			: ATypeAbsence === Enumere_Ressource_1.EGenreRessource.Retard
				? !!(LTableauCellule && LTableauCellule.TexteRetard)
				: ATypeAbsence === Enumere_Ressource_1.EGenreRessource.Exclusion
					? !!(LTableauCellule && LTableauCellule.TexteExclusion)
					: !!(LTableauCellule && LTableauCellule.TexteInfirmerie);
	}
	estUneCelluleGrisee(APlace) {
		return APlace < this.PlaceSaisieDebut || APlace > this.PlaceSaisieFin;
	}
	estUneCelluleActive(APlace) {
		const LIndiceDemiJournee =
			APlace <
			this.PlaceDebut + this.appScoEspace.getObjetParametres().PlaceDemiJournee
				? Enumere_DemiJours_1.EGenreDemiJours.Matin
				: Enumere_DemiJours_1.EGenreDemiJours.ApresMidi;
		if (
			!this.appScoEspace
				.getObjetParametres()
				.DemiJourneesOuvrees[LIndiceDemiJournee].contains(
					ObjetDate_1.GDate.getJourDeDate(this.Date),
				)
		) {
			return false;
		} else if (this.AvecOptionSaisieAutresProfs) {
			return true;
		} else {
			return !this.estUneCelluleGrisee(APlace);
		}
	}
	determinerSiEstUneCelluleAvecAbsence(ATypeAbsence, I, J, ASensCroissant) {
		if (this.TypeAbsence === ATypeAbsence) {
			if (ATypeAbsence === Enumere_Ressource_1.EGenreRessource.Absence) {
				if (
					(this.TypeSaisie === Enumere_Etat_1.EGenreEtat.Creation &&
						ASensCroissant) ||
					(this.TypeSaisie === Enumere_Etat_1.EGenreEtat.Suppression &&
						!ASensCroissant)
				) {
					return true;
				}
			} else if (this.TypeSaisie === Enumere_Etat_1.EGenreEtat.Creation) {
				return true;
			}
		} else {
			if (
				ATypeAbsence === Enumere_Ressource_1.EGenreRessource.Retard &&
				this.TableauCellules[I][J] &&
				this.TableauCellules[I][J].AvecRetard
			) {
				return true;
			} else if (
				ATypeAbsence === Enumere_Ressource_1.EGenreRessource.Exclusion &&
				this.TableauCellules[I][J] &&
				this.TableauCellules[I][J].AvecExclusion
			) {
				return true;
			} else if (
				ATypeAbsence === Enumere_Ressource_1.EGenreRessource.Absence &&
				this.TableauCellules[I][J] &&
				this.TableauCellules[I][J].AvecAbsence
			) {
				return true;
			} else if (
				ATypeAbsence === Enumere_Ressource_1.EGenreRessource.Infirmerie &&
				this.TableauCellules[I][J] &&
				this.TableauCellules[I][J].AvecInfirmerie
			) {
				return true;
			}
		}
		return false;
	}
	determinerSiEstUneCelluleAvecDispense(I, J) {
		return (
			this.TableauCellules[I][J] && this.TableauCellules[I][J].AvecDispense
		);
	}
	determinerSiEstUneCelluleAvecDispensePresenceOblig(I, J) {
		return (
			this.TableauCellules[I][J] &&
			this.TableauCellules[I][J].AvecDispense &&
			this.TableauCellules[I][J].presenceOblig
		);
	}
	determinerSiEstUneCelluleAvecExclusionTemporaire(I, J) {
		return (
			this.TableauCellules[I][J] &&
			this.TableauCellules[I][J].AvecExclusionTemporaire
		);
	}
	determinerStyleImageFond(I, J) {
		if (
			this.determinerSiEstUneCelluleAvecDispense(I, J) ||
			this.determinerSiEstUneCelluleAvecExclusionTemporaire(I, J)
		) {
			return " background-image:url(images/ObliqueGris.png); background-attachment:fixed; ";
		} else {
			return "";
		}
	}
	determinerFinColonneActive(AColCourante) {
		const ATrouve = false;
		for (let I = AColCourante; I > this.DebutColonne; I--) {
			if (!ATrouve && this.estUneCelluleActive(I)) {
				return I;
			}
		}
	}
	determinerSiBorneDansLesLimites(AGenreBorne) {
		const LPosCentreBorne =
			this.PositionHorizontaleBornes[AGenreBorne] +
			this.LargeurDemiBorne +
			this.EpaisseurBorderBorne;
		if (LPosCentreBorne <= this.PosRight && LPosCentreBorne >= this.PosLeft) {
			return true;
		} else {
			return false;
		}
	}
	determinerSiEstUneSaisieValide(ALigne, ACol, AMessage) {
		let LSaisieValide = true;
		if (this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Absence) {
			if (
				this.determinerSiEstUneCelluleAvecAbsence(
					Enumere_Ressource_1.EGenreRessource.Retard,
					ALigne,
					ACol,
				)
			) {
				AMessage[0] = ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.msgEleveRetard",
				);
				LSaisieValide = false;
			}
		} else {
			if (
				this.determinerSiEstUneCelluleAvecAbsence(
					Enumere_Ressource_1.EGenreRessource.Absence,
					ALigne,
					ACol,
					true,
				)
			) {
				if (this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Retard) {
					AMessage[0] = ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.msgEleveAbsenceRetard",
					);
					LSaisieValide = false;
				}
			}
		}
		return LSaisieValide;
	}
	determinerSiSaisieBloquee(ALigne, ACol) {
		return (
			(this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Absence ||
				this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Retard) &&
			this.TypeSaisie === Enumere_Etat_1.EGenreEtat.Suppression &&
			this.getNumeroProfesseurAbsence(ALigne, ACol) !== -1 &&
			(this.getNumeroProfesseurAbsence(ALigne, ACol) === 0 ||
				this.getNumeroProfesseurAbsence(ALigne, ACol) !==
					this.etatUtilScoEspace.getMembre().getNumero())
		);
	}
	determinerCurseur() {
		return this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Retard &&
			(!this.cours || !this.cours.estAppelVerrouille)
			? "images/CurseurRetard.cur"
			: this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Absence &&
					(!this.cours || !this.cours.estAppelVerrouille)
				? "images/CurseurAbsence.cur"
				: this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Exclusion
					? "images/CurseurEclusion.cur"
					: this.TypeAbsence === Enumere_Ressource_1.EGenreRessource.Infirmerie
						? "images/CurseurInfirmerie.cur"
						: this.cours && this.cours.estAppelVerrouille
							? "FichiersRessource/CurseurAppelVerrouille.cur"
							: "";
	}
	determinerHintInfirmerie() {
		return this.avecSaisieGrille === false
			? ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.hintInfirmerieSansSaisieGrille",
				)
			: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.hintInfirmerie");
	}
	_getTopBornes() {
		return (
			this.PositionVerticaleBorne +
			(this.ajoutEleveAutorise ? this.options.heightLigneAjoutEleve + 5 : 0)
		);
	}
}
exports.PageSaisieAbsences = PageSaisieAbsences;
function _avecSaisieAutoriseSelonEleveEtTypeAbsence(
	aEleve,
	aTypeAbsence,
	aCours,
) {
	if (
		aEleve.estSorti ||
		aEleve.estExclu ||
		aEleve.sortiePeda ||
		aEleve.estDetache
	) {
		return false;
	}
	if (aCours) {
		return (
			((aTypeAbsence !== Enumere_Ressource_1.EGenreRessource.Absence &&
				aTypeAbsence !== Enumere_Ressource_1.EGenreRessource.Retard) ||
				!aCours.estAppelVerrouille) &&
			(!aEleve.eleveAjouteAuCours ||
				(aTypeAbsence !== Enumere_Ressource_1.EGenreRessource.Absence &&
					aTypeAbsence !== Enumere_Ressource_1.EGenreRessource.Exclusion))
		);
	} else {
		return (
			!aEleve.eleveAjouteAuCours ||
			aTypeAbsence !== Enumere_Ressource_1.EGenreRessource.Absence
		);
	}
}
