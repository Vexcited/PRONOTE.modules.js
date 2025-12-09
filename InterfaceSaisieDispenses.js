exports.InterfaceSaisieDispenses = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequetePageDispenses_1 = require("ObjetRequetePageDispenses");
const DonneesListe_Dispenses_1 = require("DonneesListe_Dispenses");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetCalendrierAnnuel_1 = require("ObjetCalendrierAnnuel");
const ObjetDate_1 = require("ObjetDate");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const ObjetRequeteSaisieDispenses_1 = require("ObjetRequeteSaisieDispenses");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const UtilitaireDispenses_1 = require("UtilitaireDispenses");
const AccessApp_1 = require("AccessApp");
const GlossaireCP_1 = require("GlossaireCP");
class InterfaceSaisieDispenses extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.appSco = (0, AccessApp_1.getApp)();
		this.parametresSco = this.appSco.getObjetParametres();
		this._autorisations = {
			saisie: this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.dispenses.saisie,
			),
		};
		this.listePartieJournee = this.initPartiesJournees();
		this.avecGestionDemiJournee = !!this.parametresSco.PlaceDemiJournee;
		this.partieJourneeSelectionnee = this.listePartieJournee.getElementParGenre(
			InterfaceSaisieDispenses.genrePartieJournee.entiere,
		);
	}
	initPartiesJournees() {
		const lResult = new ObjetListeElements_1.ObjetListeElements();
		let lElement = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur("dispenses.journee"),
			null,
			InterfaceSaisieDispenses.genrePartieJournee.entiere,
		);
		lElement.debut = 0;
		lElement.fin = this.parametresSco.PlacesParJour - 1;
		lResult.addElement(lElement);
		lElement = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur("dispenses.matinee"),
			null,
			InterfaceSaisieDispenses.genrePartieJournee.matinee,
		);
		lElement.debut = 0;
		lElement.fin = this.parametresSco.PlaceDemiJournee - 1;
		lResult.addElement(lElement);
		lElement = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur("dispenses.aprem"),
			null,
			InterfaceSaisieDispenses.genrePartieJournee.apresMidi,
		);
		lElement.debut = this.parametresSco.PlaceDemiJournee;
		lElement.fin = this.parametresSco.PlacesParJour - 1;
		lResult.addElement(lElement);
		return lResult;
	}
	construireInstances() {
		this.identTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this._eventSurDernierMenuDeroulant.bind(this),
			this._initTripleCombo.bind(this),
		);
		this.identCalendrier = this.add(
			ObjetCalendrierAnnuel_1.ObjetCalendrierAnnuel,
			this._eventCalendrier.bind(this),
			this._initCalendrier.bind(this),
		);
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._eventSurListe.bind(this),
			this._initListe.bind(this),
		);
		this.identMatieres = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._eventMatieres.bind(this),
			this._initMatieres.bind(this),
		);
		this.identJournee = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._eventJournee.bind(this),
			this._initJournee.bind(this),
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone = [
			{ ident: this.identTripleCombo },
			{ separateur: true },
			{ ident: this.identMatieres },
			{ ident: this.identJournee },
		];
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push('<div class="flex-contain cols flex-gap-l">');
		H.push(
			'<div id="',
			this.getInstance(this.identCalendrier).getNom(),
			'" class="p-all fluid-bloc" style="min-height: 400px; ',
			ObjetStyle_1.GStyle.composeWidth(850),
			ObjetStyle_1.GStyle.composeHeight(400),
			'" tabindex="-1"></div>',
		);
		H.push(
			'<div id="',
			this.getInstance(this.identListe).getNom(),
			'" class="p-all full-height" tabindex="-1"></div>',
		);
		H.push("</div>");
		return H.join("");
	}
	surEvntMenusDeroulants(aParam) {
		super.surEvntMenusDeroulants(aParam);
		if (aParam.genreCombo === Enumere_Ressource_1.EGenreRessource.Classe) {
			this.listeDates = new ObjetListeElements_1.ObjetListeElements();
			const lDonnees = {
				dispense: {
					donnees: this.listeDates,
					variables: ["date"],
					couleur: GCouleur.rouge,
					texte: { couleur: GCouleur.blanc },
					symbolImpression: "X",
					editable: true,
					editablePeriode: true,
				},
			};
			this.matiereSelectionnee = undefined;
			this.getInstance(this.identCalendrier).setDonnees(lDonnees);
			this.getInstance(this.identCalendrier).setVisible(false);
			this.getInstance(this.identListe).effacer();
		}
	}
	requetePage() {
		new ObjetRequetePageDispenses_1.ObjetRequetePageDispenses(
			this,
			this._reponseRequetePageDispenses,
		).lancerRequete({ eleve: this.eleve });
	}
	_reponseRequetePageDispenses(aJSON) {
		this.afficherBandeau(true);
		this.setEtatSaisie(false);
		this.valeurDefautPresenceDispense =
			aJSON.valeurDefautPresenceDispense || false;
		this.listeDispenses = aJSON.listeDispenses;
		this.tousDocuments = aJSON.tousDocuments;
		this.listeDispenses.parcourir((aDispense) => {
			aDispense.tousDocuments = this.tousDocuments;
		});
		this.listeMatieres = aJSON.matieres;
		if (this.avecGestionDemiJournee) {
			let lIdxGenreJournee = 0;
			if (!!this.partieJourneeSelectionnee) {
				lIdxGenreJournee = this.listePartieJournee.getIndiceElementParFiltre(
					(aElement) => {
						return aElement.egalParNumeroEtGenre(
							null,
							this.partieJourneeSelectionnee.getGenre(),
						);
					},
				);
			}
			this.getInstance(this.identJournee).setDonnees(
				this.listePartieJournee,
				lIdxGenreJournee,
			);
		}
		let lIdxMatiere = 0;
		if (!!this.matiereSelectionnee) {
			lIdxMatiere = this.listeMatieres.getIndiceElementParFiltre((aElement) => {
				return aElement.egalParNumeroEtGenre(
					this.matiereSelectionnee.getNumero(),
				);
			});
			if (lIdxMatiere === -1) {
				lIdxMatiere = 0;
			}
		}
		this.getInstance(this.identMatieres).setDonnees(
			this.listeMatieres,
			lIdxMatiere,
		);
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_Dispenses_1.DonneesListe_Dispenses({
				donnees: this.listeDispenses,
				autorisations: this._autorisations,
			}).setOptions({
				saisie: UtilitaireDispenses_1.TUtilitaireDispenses.saisieDocument.bind(
					this,
					this,
				),
			}),
		);
		$(window).trigger("resize");
	}
	actualiserListe() {
		this.getInstance(this.identListe).actualiser();
		$(window).trigger("resize");
	}
	actionApresSaisieDocument() {
		this.actualiserListe();
	}
	valider() {
		this.listeDispenses.setSerialisateurJSON({
			methodeSerialisation:
				UtilitaireDispenses_1.TUtilitaireDispenses.serialisationDonnees.bind(
					this,
				),
		});
		new ObjetRequeteSaisieDispenses_1.ObjetRequeteSaisieDispenses(
			this,
			this.actionSurValidation,
		)
			.addUpload({ listeFichiers: this.listeFichiersUpload })
			.lancerRequete({ listeDispenses: this.listeDispenses });
	}
	afficherPage() {
		this.requetePage();
	}
	_eventSurDernierMenuDeroulant(aLigneClasse, aLignePeriode, aLigneEleve) {
		this.classe = aLigneClasse;
		this.eleve = aLigneEleve;
		this.requetePage();
	}
	_initPeriode(aElement) {
		const lResult = new ObjetElement_1.ObjetElement();
		lResult.placeDebutDeJour =
			aElement.placeDebut !== undefined
				? aElement.placeDebut
				: this.partieJourneeSelectionnee.debut;
		lResult.placeFinDeJour =
			aElement.placeFin !== undefined
				? aElement.placeFin
				: this.partieJourneeSelectionnee.fin;
		const lPlaceAnnuelleDeJour = ObjetDate_1.GDate.dateEnPlaceAnnuelle(
			aElement.date,
		);
		lResult.placeDebut = lPlaceAnnuelleDeJour + lResult.placeDebutDeJour;
		lResult.placeFin = lPlaceAnnuelleDeJour + lResult.placeFinDeJour;
		lResult.dateDebut = ObjetDate_1.GDate.placeAnnuelleEnDate(
			lResult.placeDebut,
		);
		lResult.dateFin = ObjetDate_1.GDate.placeAnnuelleEnDate(
			lResult.placeFin,
			true,
		);
		return lResult;
	}
	_correctionsDesPlacesDeJourSelonPartieJourneeSelectionnee(aDate) {
		if (!aDate) {
			return;
		}
		const lIdx = this.listeDates.getIndiceElementParFiltre((aElement) => {
			return ObjetDate_1.GDate.estJourEgal(aElement.date, aDate);
		});
		const lElmDate = this.listeDates.get(lIdx);
		if (lElmDate.genreJournee === undefined) {
			if (lElmDate.existe()) {
				lElmDate.placeDebut = this.partieJourneeSelectionnee.debut;
				lElmDate.placeFin = this.partieJourneeSelectionnee.fin;
				lElmDate.genreJournee = this.partieJourneeSelectionnee.getGenre();
				lElmDate.couleur = this._getCouleurGenreJournee(lElmDate.genreJournee);
				if (
					lElmDate.genreJournee !==
					InterfaceSaisieDispenses.genrePartieJournee.entiere
				) {
					lElmDate.couleurTexte = GCouleur.noir;
				} else {
					lElmDate.couleurTexte = undefined;
				}
			}
		} else {
			if (lElmDate.genreJournee !== this.partieJourneeSelectionnee.getGenre()) {
				if (lElmDate.existe()) {
					lElmDate.placeDebut = this.partieJourneeSelectionnee.debut;
					lElmDate.placeFin = this.partieJourneeSelectionnee.fin;
					lElmDate.genreJournee = this.partieJourneeSelectionnee.getGenre();
				} else {
					if (
						lElmDate.genreJournee ===
						InterfaceSaisieDispenses.genrePartieJournee.entiere
					) {
						if (
							this.partieJourneeSelectionnee.getGenre() ===
							InterfaceSaisieDispenses.genrePartieJournee.matinee
						) {
							lElmDate.placeDebut = this.parametresSco.PlaceDemiJournee;
							lElmDate.genreJournee =
								InterfaceSaisieDispenses.genrePartieJournee.apresMidi;
						} else {
							lElmDate.placeFin = this.parametresSco.PlaceDemiJournee - 1;
							lElmDate.genreJournee =
								InterfaceSaisieDispenses.genrePartieJournee.matinee;
						}
						lElmDate.nePasSupprimer = true;
					} else {
						lElmDate.placeDebut = 0;
						lElmDate.placeFin = this.parametresSco.PlacesParJour - 1;
						lElmDate.genreJournee =
							InterfaceSaisieDispenses.genrePartieJournee.entiere;
						lElmDate.nePasSupprimer = true;
					}
				}
			}
			lElmDate.couleur = this._getCouleurGenreJournee(lElmDate.genreJournee);
			if (
				lElmDate.genreJournee !==
				InterfaceSaisieDispenses.genrePartieJournee.entiere
			) {
				lElmDate.couleurTexte = GCouleur.noir;
			} else {
				lElmDate.couleurTexte = undefined;
			}
		}
	}
	_construirePeriodesContinuAPartirDesDatesSelectionnees() {
		const lResult = new ObjetListeElements_1.ObjetListeElements();
		let lElmPeriode;
		this.listeDates.parcourir((aElement) => {
			if (aElement.nePasSupprimer) {
				aElement.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
				aElement.nePasSupprimer = undefined;
			}
		});
		this.listeDates.setTri([
			ObjetTri_1.ObjetTri.init(
				"date",
				Enumere_TriElement_1.EGenreTriElement.Croissant,
			),
		]);
		this.listeDates.trier();
		this.listeDates.parcourir((aElement) => {
			if (aElement.existe()) {
				if (aElement.placeDebut === undefined) {
					aElement.placeDebut = this.partieJourneeSelectionnee.debut;
				}
				if (aElement.placeFin === undefined) {
					aElement.placeFin = this.partieJourneeSelectionnee.fin;
				}
				if (!lElmPeriode) {
					lElmPeriode = this._initPeriode(aElement);
				} else {
					if (
						ObjetDate_1.GDate.estJourEgal(
							aElement.date,
							ObjetDate_1.GDate.getJourSuivant(lElmPeriode.dateFin),
						) &&
						lElmPeriode.placeFinDeJour ===
							this.parametresSco.PlacesParJour - 1 &&
						aElement.placeDebut === 0
					) {
						lElmPeriode.placeFinDeJour = aElement.placeFin;
						lElmPeriode.placeFin =
							ObjetDate_1.GDate.dateEnPlaceAnnuelle(aElement.date) +
							lElmPeriode.placeFinDeJour;
						lElmPeriode.dateFin = ObjetDate_1.GDate.placeAnnuelleEnDate(
							lElmPeriode.placeFin,
							true,
						);
					} else {
						lResult.addElement(
							MethodesObjet_1.MethodesObjet.dupliquer(lElmPeriode),
						);
						lElmPeriode = this._initPeriode(aElement);
					}
				}
			}
		});
		if (lElmPeriode) {
			lResult.addElement(MethodesObjet_1.MethodesObjet.dupliquer(lElmPeriode));
		}
		return lResult;
	}
	_eventCalendrier(aParam) {
		if (
			aParam.genre ===
			ObjetCalendrierAnnuel_1.ObjetCalendrierAnnuel.genreEvent.mouseUp
		) {
			if (this.avecEventClick) {
				this._actualiserAffichage();
			} else {
				this.avecMAJAFaire = true;
			}
		}
		if (
			aParam.genre !==
			ObjetCalendrierAnnuel_1.ObjetCalendrierAnnuel.genreEvent.click
		) {
			return;
		}
		const lModif = this.getInstance(this.identCalendrier).updateDonnees();
		if (!lModif) {
			return;
		}
		this.avecEventClick = true;
		this._correctionsDesPlacesDeJourSelonPartieJourneeSelectionnee(aParam.date);
		if (this.avecMAJAFaire) {
			this._actualiserAffichage();
			this.avecMAJAFaire = undefined;
		}
	}
	_actualiserDispenses() {
		const lListePeriode =
			this._construirePeriodesContinuAPartirDesDatesSelectionnees();
		this.listeDispenses.parcourir((aDispense) => {
			aDispense._pourTraitementEventuelSuppression =
				aDispense.matiere.getNumero() === this.matiereSelectionnee.getNumero();
		});
		lListePeriode.parcourir((aPeriode) => {
			const lListeDispencesCriteria = this.listeDispenses.getListeElements(
				(aDispense) => {
					if (!aDispense.existe()) {
						return false;
					}
					return (
						aDispense.matiere.getNumero() ===
							this.matiereSelectionnee.getNumero() &&
						(ObjetDate_1.GDate.dateEntreLesDates(
							aDispense.dateDebut,
							aPeriode.dateDebut,
							aPeriode.dateFin,
						) ||
							ObjetDate_1.GDate.dateEntreLesDates(
								aDispense.dateFin,
								aPeriode.dateDebut,
								aPeriode.dateFin,
							))
					);
				},
			);
			let lDispense;
			if (lListeDispencesCriteria.count() > 0) {
				lDispense = lListeDispencesCriteria.get(0);
				lDispense._pourTraitementEventuelSuppression = false;
				if (
					lDispense.dateDebut !== aPeriode.dateDebut ||
					lDispense.dateFin !== aPeriode.dateFin
				) {
					lDispense.placeDebut = aPeriode.placeDebut;
					lDispense.placeFin = aPeriode.placeFin;
					lDispense.dateDebut = ObjetDate_1.GDate.placeAnnuelleEnDate(
						lDispense.placeDebut,
					);
					lDispense.dateFin = ObjetDate_1.GDate.placeAnnuelleEnDate(
						lDispense.placeFin,
						true,
					);
					lDispense.date = lDispense.dateDebut;
					lDispense.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
				if (lListeDispencesCriteria.count() > 1) {
					for (let i = 1; i < lListeDispencesCriteria.count(); i++) {
						const lDoublon = lListeDispencesCriteria.get(i);
						lDoublon.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					}
				}
			} else {
				lDispense = new ObjetElement_1.ObjetElement();
				lDispense.eleve = MethodesObjet_1.MethodesObjet.dupliquer(this.eleve);
				lDispense.classe = MethodesObjet_1.MethodesObjet.dupliquer(this.classe);
				lDispense.matiere = MethodesObjet_1.MethodesObjet.dupliquer(
					this.matiereSelectionnee,
				);
				lDispense.placeDebut = aPeriode.placeDebut;
				lDispense.placeFin = aPeriode.placeFin;
				lDispense.dateDebut = ObjetDate_1.GDate.placeAnnuelleEnDate(
					lDispense.placeDebut,
				);
				lDispense.dateFin = ObjetDate_1.GDate.placeAnnuelleEnDate(
					lDispense.placeFin,
					true,
				);
				lDispense.date = lDispense.dateDebut;
				lDispense.commentaire = "";
				lDispense.presenceOblig = this.valeurDefautPresenceDispense;
				lDispense.heuresPerdues = "";
				lDispense.heuresPerduesTotales = "";
				lDispense.documents = new ObjetListeElements_1.ObjetListeElements();
				this.listeDispenses.addElement(lDispense);
				lDispense.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			}
		});
		this.listeDispenses.parcourir((aDispense) => {
			if (!!aDispense._pourTraitementEventuelSuppression) {
				aDispense.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			}
		});
	}
	_actualiserAffichage() {
		this._actualiserDispenses();
		this.setEtatSaisie(this.listeDispenses.existeElementPourValidation());
		this.actualiserListe();
		const lDonnees = this._formatDonnees();
		this.getInstance(this.identCalendrier).setDonnees(lDonnees);
		this.avecEventClick = undefined;
	}
	_eventSurListe(aParam) {
		switch (aParam.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				switch (aParam.idColonne) {
					case DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes
						.presenceObligatoire: {
						aParam.article.presenceOblig = !aParam.article.presenceOblig;
						this._actualiserApresSaisie(aParam.article);
						break;
					}
					case DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes
						.heuresPerdues: {
						break;
					}
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresSuppression: {
				const lDonnees = this._formatDonnees();
				this.getInstance(this.identCalendrier).setDonnees(lDonnees);
				break;
			}
		}
	}
	_getGenreJournee(aElement) {
		let lResult = InterfaceSaisieDispenses.genrePartieJournee.entiere;
		const lPlaceJDebut = aElement.placeDebut % this.parametresSco.PlacesParJour;
		const lPlaceJFin = aElement.placeFin % this.parametresSco.PlacesParJour;
		if (
			lPlaceJDebut >= 0 &&
			lPlaceJFin <= this.parametresSco.PlaceDemiJournee - 1
		) {
			lResult = InterfaceSaisieDispenses.genrePartieJournee.matinee;
		} else if (
			lPlaceJDebut >= this.parametresSco.PlaceDemiJournee &&
			lPlaceJFin <= this.parametresSco.PlacesParJour - 1
		) {
			lResult = InterfaceSaisieDispenses.genrePartieJournee.apresMidi;
		}
		return lResult;
	}
	_getCouleurGenreJournee(aGenre) {
		switch (aGenre) {
			case InterfaceSaisieDispenses.genrePartieJournee.entiere:
				return undefined;
			case InterfaceSaisieDispenses.genrePartieJournee.matinee:
				return (
					"linear-gradient(to bottom, " + GCouleur.rouge + " 65%,#ffffff 65%)"
				);
			case InterfaceSaisieDispenses.genrePartieJournee.apresMidi:
				return (
					"linear-gradient(to bottom, #ffffff 65%," + GCouleur.rouge + " 65%)"
				);
		}
	}
	_formatDonnees() {
		this.listeDates = new ObjetListeElements_1.ObjetListeElements();
		this.listeDispenses.parcourir((aElement) => {
			if (aElement.existe()) {
				let lElement;
				const lPlaceJDebut =
					aElement.placeDebut % this.parametresSco.PlacesParJour;
				const lPlaceJFin = aElement.placeFin % this.parametresSco.PlacesParJour;
				let lDate;
				if (
					aElement.matiere.getNumero() === this.matiereSelectionnee.getNumero()
				) {
					lElement = new ObjetElement_1.ObjetElement();
					lDate = ObjetDate_1.GDate.getDateJour(aElement.dateDebut);
					lElement.date = lDate;
					lElement.placeDebut = lPlaceJDebut;
					if (
						ObjetDate_1.GDate.estJourEgal(aElement.dateDebut, aElement.dateFin)
					) {
						lElement.placeFin = lPlaceJFin;
					} else {
						lElement.placeFin = this.parametresSco.PlacesParJour - 1;
					}
					lElement.genreJournee = this._getGenreJournee(lElement);
					lElement.couleur = this._getCouleurGenreJournee(
						lElement.genreJournee,
					);
					if (
						lElement.genreJournee !==
						InterfaceSaisieDispenses.genrePartieJournee.entiere
					) {
						lElement.couleurTexte = GCouleur.noir;
					}
					this.listeDates.addElement(lElement);
					const lNbr = ObjetDate_1.GDate.getNbrJoursEntreDeuxDates(
						aElement.dateDebut,
						aElement.dateFin,
					);
					if (lNbr > 0) {
						for (let i = 0; i < lNbr; i++) {
							lDate = ObjetDate_1.GDate.getJourSuivant(lDate);
							lElement = new ObjetElement_1.ObjetElement();
							lElement.date = lDate;
							lElement.placeDebut = 0;
							if (i === lNbr - 1) {
								lElement.placeFin = lPlaceJFin;
							} else {
								lElement.placeFin = this.parametresSco.PlacesParJour - 1;
							}
							lElement.genreJournee = this._getGenreJournee(lElement);
							lElement.couleur = this._getCouleurGenreJournee(
								lElement.genreJournee,
							);
							if (
								lElement.genreJournee !==
								InterfaceSaisieDispenses.genrePartieJournee.entiere
							) {
								lElement.couleurTexte = GCouleur.noir;
							}
							this.listeDates.addElement(lElement);
						}
					}
				}
			}
		});
		this.listeDates.setTri([
			ObjetTri_1.ObjetTri.init(
				"date",
				Enumere_TriElement_1.EGenreTriElement.Croissant,
			),
		]);
		this.listeDates.trier();
		const lDonnees = {
			dispense: {
				donnees: this.listeDates,
				variables: ["date"],
				couleur: GCouleur.rouge,
				texte: { couleur: GCouleur.blanc },
				symbolImpression: "X",
				editable: true,
				editablePeriode: true,
			},
		};
		return lDonnees;
	}
	_eventMatieres(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.matiereSelectionnee = this.listeMatieres.getElementParNumero(
				aParams.element.getNumero(),
			);
			const lDonnees = this._formatDonnees();
			this.getInstance(this.identCalendrier).setVisible(true);
			this.getInstance(this.identCalendrier).setDonnees(lDonnees);
		}
	}
	_eventJournee(aParams) {
		if (
			aParams.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection &&
			(!this.partieJourneeSelectionnee ||
				aParams.element.getGenre() !==
					this.partieJourneeSelectionnee.getGenre())
		) {
			this.partieJourneeSelectionnee =
				this.listePartieJournee.getElementParGenre(aParams.element.getGenre());
		}
	}
	_actualiserApresSaisie(aDonnee) {
		aDonnee.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.setEtatSaisie(true);
		this.actualiserListe();
	}
	_initTripleCombo(aInstance) {
		aInstance.setParametres(
			[
				Enumere_Ressource_1.EGenreRessource.Classe,
				Enumere_Ressource_1.EGenreRessource.Eleve,
			],
			true,
		);
		aInstance.setEvenementMenusDeroulants(this.surEvntMenusDeroulants);
	}
	_initCalendrier(aInstance) {
		aInstance.setParametres({
			premiereDate: ObjetDate_1.GDate.premiereDate,
			derniereDate: ObjetDate_1.GDate.derniereDate,
			ligneDate: false,
			numeroJour: true,
			initialeJour: true,
			joursOuvres: { editable: true, editablePeriode: true },
			joursFeries: {
				fond: { couleur: GCouleur.themeNeutre.claire },
				texte: { couleur: GCouleur.blanc },
				editable: true,
				editablePeriode: true,
			},
		});
		aInstance.setVisible(false);
	}
	_initListe(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes.eleve,
			taille: 200,
			titre: ObjetTraduction_1.GTraductions.getValeur("Eleve"),
		});
		lColonnes.push({
			id: DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes.classe,
			taille: 100,
			titre: ObjetTraduction_1.GTraductions.getValeur("Classe"),
		});
		lColonnes.push({
			id: DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes.matiere,
			taille: 210,
			titre: ObjetTraduction_1.GTraductions.getValeur("Matiere"),
		});
		lColonnes.push({
			id: DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes.date,
			taille: 190,
			titre: ObjetTraduction_1.GTraductions.getValeur("Date"),
		});
		lColonnes.push({
			id: DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes
				.presenceObligatoire,
			taille: 70,
			titre: {
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"dispenses.presenceObligatoire",
				),
				nbLignes: 2,
			},
		});
		lColonnes.push({
			id: DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes
				.heuresPerdues,
			taille: 55,
			titre: {
				libelle: ObjetTraduction_1.GTraductions.getValeur("HeuresPerdues"),
				nbLignes: 2,
			},
		});
		lColonnes.push({
			id: DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes.commentaire,
			taille: 240,
			titre: ObjetTraduction_1.GTraductions.getValeur("Commentaire"),
		});
		lColonnes.push({
			id: DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes.fichierJoint,
			taille: 25,
			titre: [
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("dispenses.pj"),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"dispenses.piecesjointes",
					),
					avecFusionColonne: true,
				},
				{
					getLibelleHtml: () =>
						IE.jsx.str("i", {
							class: fonts_css_1.StylesFonts.icon_piece_jointe,
							role: "presentation",
						}),
					title: GlossaireCP_1.TradGlossaireCP.PiecesJointes,
				},
			],
		});
		lColonnes.push({
			id: DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes
				.publierPJFeuilleDA,
			taille: 25,
			titre: [
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("dispenses.pj"),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"dispenses.piecesjointes",
					),
					avecFusionColonne: true,
				},
				{
					classeCssImage: "Image_Publie",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"dispenses.publicationPJFeuilleDAppel",
					),
				},
			],
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			hauteurAdapteContenu: true,
			hauteurZoneContenuListeMin: 60,
			colonnesCachees: [
				DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes.eleve,
				DonneesListe_Dispenses_1.DonneesListe_Dispenses.colonnes.classe,
			],
		});
	}
	_initMatieres(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 200,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionMatiere",
			),
			deroulerListeSeulementSiPlusieursElements: false,
			initAutoSelectionAvecUnElement: false,
			classTexte: "Gras",
			texteEdit: ObjetTraduction_1.GTraductions.getValeur(
				"dispenses.saisieDesDispenses",
			),
		});
	}
	_initJournee(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 100,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionPartieJournee",
			),
			deroulerListeSeulementSiPlusieursElements: false,
			initAutoSelectionAvecUnElement: false,
			classTexte: "Gras",
			texteEdit: ObjetTraduction_1.GTraductions.getValeur("dispenses.par"),
		});
	}
}
exports.InterfaceSaisieDispenses = InterfaceSaisieDispenses;
(function (InterfaceSaisieDispenses) {
	let genrePartieJournee;
	(function (genrePartieJournee) {
		genrePartieJournee[(genrePartieJournee["entiere"] = 0)] = "entiere";
		genrePartieJournee[(genrePartieJournee["matinee"] = 1)] = "matinee";
		genrePartieJournee[(genrePartieJournee["apresMidi"] = 2)] = "apresMidi";
	})(
		(genrePartieJournee =
			InterfaceSaisieDispenses.genrePartieJournee ||
			(InterfaceSaisieDispenses.genrePartieJournee = {})),
	);
})(
	InterfaceSaisieDispenses ||
		(exports.InterfaceSaisieDispenses = InterfaceSaisieDispenses = {}),
);
