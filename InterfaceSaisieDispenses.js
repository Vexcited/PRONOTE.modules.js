const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { ObjetRequetePageDispenses } = require("ObjetRequetePageDispenses.js");
const { DonneesListe_Dispenses } = require("DonneesListe_Dispenses.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { Requetes } = require("CollectionRequetes.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { ObjetCalendrierAnnuel } = require("ObjetCalendrierAnnuel.js");
const { GDate } = require("ObjetDate.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const {
	ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const { TUtilitaireDispenses } = require("UtilitaireDispenses.js");
Requetes.inscrire("SaisieDispenses", ObjetRequeteSaisie);
class InterfaceSaisieDispenses extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this._autorisations = {
			saisie: GApplication.droits.get(TypeDroits.dispenses.saisie),
		};
		this.listePartieJournee = this.initPartiesJournees();
		this.avecGestionDemiJournee = !!GParametres.PlaceDemiJournee;
		this.partieJourneeSelectionnee = this.listePartieJournee.getElementParGenre(
			InterfaceSaisieDispenses.genrePartieJournee.entiere,
		);
	}
	initPartiesJournees() {
		const lResult = new ObjetListeElements();
		let lElement = new ObjetElement(
			GTraductions.getValeur("dispenses.journee"),
			null,
			InterfaceSaisieDispenses.genrePartieJournee.entiere,
		);
		lElement.debut = 0;
		lElement.fin = GParametres.PlacesParJour - 1;
		lResult.addElement(lElement);
		lElement = new ObjetElement(
			GTraductions.getValeur("dispenses.matinee"),
			null,
			InterfaceSaisieDispenses.genrePartieJournee.matinee,
		);
		lElement.debut = 0;
		lElement.fin = GParametres.PlaceDemiJournee - 1;
		lResult.addElement(lElement);
		lElement = new ObjetElement(
			GTraductions.getValeur("dispenses.aprem"),
			null,
			InterfaceSaisieDispenses.genrePartieJournee.apresMidi,
		);
		lElement.debut = GParametres.PlaceDemiJournee;
		lElement.fin = GParametres.PlacesParJour - 1;
		lResult.addElement(lElement);
		return lResult;
	}
	construireInstances() {
		this.identTripleCombo = this.add(
			ObjetAffichagePageAvecMenusDeroulants,
			_eventSurDernierMenuDeroulant.bind(this),
			_initTripleCombo.bind(this),
		);
		this.identCalendrier = this.add(
			ObjetCalendrierAnnuel,
			_eventCalendrier.bind(this),
			_initCalendrier.bind(this),
		);
		this.identListe = this.add(
			ObjetListe,
			_eventSurListe.bind(this),
			_initListe.bind(this),
		);
		this.identMatieres = this.add(
			ObjetSaisie,
			_eventMatieres.bind(this),
			_initMatieres.bind(this),
		);
		this.identJournee = this.add(
			ObjetSaisie,
			_eventJournee.bind(this),
			_initJournee.bind(this),
		);
	}
	setParametresGeneraux() {
		this.GenreStructure = EStructureAffichage.Autre;
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
			GStyle.composeWidth(850),
			GStyle.composeHeight(400),
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
		if (aParam.genreCombo === EGenreRessource.Classe) {
			this.listeDates = new ObjetListeElements();
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
		new ObjetRequetePageDispenses(
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
			new DonneesListe_Dispenses({
				donnees: this.listeDispenses,
				autorisations: this._autorisations,
			}).setOptions({ saisie: TUtilitaireDispenses.saisieDocument.bind(this) }),
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
				TUtilitaireDispenses.serialisationDonnees.bind(this),
		});
		Requetes("SaisieDispenses", this, this.actionSurValidation)
			.addUpload({ listeFichiers: this.listeFichiersUpload })
			.lancerRequete({ listeDispenses: this.listeDispenses });
	}
	afficherPage() {
		this.requetePage();
	}
}
InterfaceSaisieDispenses.genrePartieJournee = {
	entiere: 0,
	matinee: 1,
	apresMidi: 2,
};
function _eventSurDernierMenuDeroulant(
	aLigneClasse,
	aLignePeriode,
	aLigneEleve,
) {
	this.classe = aLigneClasse;
	this.eleve = aLigneEleve;
	this.requetePage();
}
function _initPeriode(aElement) {
	const lResult = new ObjetElement();
	lResult.placeDebutDeJour =
		aElement.placeDebut !== undefined
			? aElement.placeDebut
			: this.partieJourneeSelectionnee.debut;
	lResult.placeFinDeJour =
		aElement.placeFin !== undefined
			? aElement.placeFin
			: this.partieJourneeSelectionnee.fin;
	const lPlaceAnnuelleDeJour = GDate.dateEnPlaceAnnuelle(aElement.date);
	lResult.placeDebut = lPlaceAnnuelleDeJour + lResult.placeDebutDeJour;
	lResult.placeFin = lPlaceAnnuelleDeJour + lResult.placeFinDeJour;
	lResult.dateDebut = GDate.placeAnnuelleEnDate(lResult.placeDebut);
	lResult.dateFin = GDate.placeAnnuelleEnDate(lResult.placeFin, true);
	return lResult;
}
function _correctionsDesPlacesDeJourSelonPartieJourneeSelectionnee(aDate) {
	if (!aDate) {
		return;
	}
	const lIdx = this.listeDates.getIndiceElementParFiltre((aElement) => {
		return GDate.estJourEgal(aElement.date, aDate);
	});
	const lElmDate = this.listeDates.get(lIdx);
	if (lElmDate.genreJournee === undefined) {
		if (lElmDate.existe()) {
			lElmDate.placeDebut = this.partieJourneeSelectionnee.debut;
			lElmDate.placeFin = this.partieJourneeSelectionnee.fin;
			lElmDate.genreJournee = this.partieJourneeSelectionnee.getGenre();
			lElmDate.couleur = _getCouleurGenreJournee(lElmDate.genreJournee);
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
						lElmDate.placeDebut = GParametres.PlaceDemiJournee;
						lElmDate.genreJournee =
							InterfaceSaisieDispenses.genrePartieJournee.apresMidi;
					} else {
						lElmDate.placeFin = GParametres.PlaceDemiJournee - 1;
						lElmDate.genreJournee =
							InterfaceSaisieDispenses.genrePartieJournee.matinee;
					}
					lElmDate.nePasSupprimer = true;
				} else {
					lElmDate.placeDebut = 0;
					lElmDate.placeFin = GParametres.PlacesParJour - 1;
					lElmDate.genreJournee =
						InterfaceSaisieDispenses.genrePartieJournee.entiere;
					lElmDate.nePasSupprimer = true;
				}
			}
		}
		lElmDate.couleur = _getCouleurGenreJournee(lElmDate.genreJournee);
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
function _construirePeriodesContinuAPartirDesDatesSelectionnees() {
	const lResult = new ObjetListeElements();
	let lElmPeriode;
	this.listeDates.parcourir((aElement) => {
		if (aElement.nePasSupprimer) {
			aElement.setEtat(EGenreEtat.Aucun);
			aElement.nePasSupprimer = undefined;
		}
	});
	this.listeDates.setTri([ObjetTri.init("date", EGenreTriElement.Croissant)]);
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
				lElmPeriode = _initPeriode.call(this, aElement);
			} else {
				if (
					GDate.estJourEgal(
						aElement.date,
						GDate.getJourSuivant(lElmPeriode.dateFin),
					) &&
					lElmPeriode.placeFinDeJour === GParametres.PlacesParJour - 1 &&
					aElement.placeDebut === 0
				) {
					lElmPeriode.placeFinDeJour = aElement.placeFin;
					lElmPeriode.placeFin =
						GDate.dateEnPlaceAnnuelle(aElement.date) +
						lElmPeriode.placeFinDeJour;
					lElmPeriode.dateFin = GDate.placeAnnuelleEnDate(
						lElmPeriode.placeFin,
						true,
					);
				} else {
					lResult.addElement(MethodesObjet.dupliquer(lElmPeriode));
					lElmPeriode = _initPeriode.call(this, aElement);
				}
			}
		}
	});
	if (lElmPeriode) {
		lResult.addElement(MethodesObjet.dupliquer(lElmPeriode));
	}
	return lResult;
}
function _eventCalendrier(aParam) {
	if (aParam.genre === ObjetCalendrierAnnuel.genreEvent.mouseUp) {
		if (this.avecEventClick) {
			_actualiserAffichage.call(this);
		} else {
			this.avecMAJAFaire = true;
		}
	}
	if (aParam.genre !== ObjetCalendrierAnnuel.genreEvent.click) {
		return;
	}
	const lModif = this.getInstance(this.identCalendrier).updateDonnees();
	if (!lModif) {
		return;
	}
	this.avecEventClick = true;
	_correctionsDesPlacesDeJourSelonPartieJourneeSelectionnee.call(
		this,
		aParam.date,
	);
	if (this.avecMAJAFaire) {
		_actualiserAffichage.call(this);
		this.avecMAJAFaire = undefined;
	}
}
function _actualiserDispenses() {
	const lListePeriode =
		_construirePeriodesContinuAPartirDesDatesSelectionnees.call(this);
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
					(GDate.dateEntreLesDates(
						aDispense.dateDebut,
						aPeriode.dateDebut,
						aPeriode.dateFin,
					) ||
						GDate.dateEntreLesDates(
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
				lDispense.dateDebut = GDate.placeAnnuelleEnDate(lDispense.placeDebut);
				lDispense.dateFin = GDate.placeAnnuelleEnDate(lDispense.placeFin, true);
				lDispense.date = lDispense.dateDebut;
				lDispense.setEtat(EGenreEtat.Modification);
			}
			if (lListeDispencesCriteria.count() > 1) {
				for (let i = 1; i < lListeDispencesCriteria.count(); i++) {
					const lDoublon = lListeDispencesCriteria.get(i);
					lDoublon.setEtat(EGenreEtat.Suppression);
				}
			}
		} else {
			lDispense = new ObjetElement();
			lDispense.eleve = MethodesObjet.dupliquer(this.eleve);
			lDispense.classe = MethodesObjet.dupliquer(this.classe);
			lDispense.matiere = MethodesObjet.dupliquer(this.matiereSelectionnee);
			lDispense.placeDebut = aPeriode.placeDebut;
			lDispense.placeFin = aPeriode.placeFin;
			lDispense.dateDebut = GDate.placeAnnuelleEnDate(lDispense.placeDebut);
			lDispense.dateFin = GDate.placeAnnuelleEnDate(lDispense.placeFin, true);
			lDispense.date = lDispense.dateDebut;
			lDispense.commentaire = "";
			lDispense.presenceOblig = this.valeurDefautPresenceDispense;
			lDispense.heuresPerdues = "";
			lDispense.heuresPerduesTotales = "";
			lDispense.documents = new ObjetListeElements();
			this.listeDispenses.addElement(lDispense);
			lDispense.setEtat(EGenreEtat.Creation);
		}
	});
	this.listeDispenses.parcourir((aDispense) => {
		if (!!aDispense._pourTraitementEventuelSuppression) {
			aDispense.setEtat(EGenreEtat.Suppression);
		}
	});
}
function _actualiserAffichage() {
	_actualiserDispenses.call(this);
	this.setEtatSaisie(this.listeDispenses.existeElementPourValidation());
	this.actualiserListe();
	const lDonnees = _formatDonnees.call(this);
	this.getInstance(this.identCalendrier).setDonnees(lDonnees);
	this.avecEventClick = undefined;
}
function _eventSurListe(aParam, aGenreEvenementListe) {
	switch (aGenreEvenementListe) {
		case EGenreEvenementListe.Edition:
			switch (aParam.idColonne) {
				case DonneesListe_Dispenses.colonnes.presenceObligatoire: {
					aParam.article.presenceOblig = !aParam.article.presenceOblig;
					_actualiserApresSaisie.call(this, aParam.article);
					break;
				}
				case DonneesListe_Dispenses.colonnes.heuresPerdues: {
					break;
				}
			}
			break;
		case EGenreEvenementListe.ApresSuppression: {
			const lDonnees = _formatDonnees.call(this);
			this.getInstance(this.identCalendrier).setDonnees(lDonnees);
			break;
		}
	}
}
function _getGenreJournee(aElement) {
	let lResult = InterfaceSaisieDispenses.genrePartieJournee.entiere;
	const lPlaceJDebut = aElement.placeDebut % GParametres.PlacesParJour;
	const lPlaceJFin = aElement.placeFin % GParametres.PlacesParJour;
	if (lPlaceJDebut >= 0 && lPlaceJFin <= GParametres.PlaceDemiJournee - 1) {
		lResult = InterfaceSaisieDispenses.genrePartieJournee.matinee;
	} else if (
		lPlaceJDebut >= GParametres.PlaceDemiJournee &&
		lPlaceJFin <= GParametres.PlacesParJour - 1
	) {
		lResult = InterfaceSaisieDispenses.genrePartieJournee.apresMidi;
	}
	return lResult;
}
function _getCouleurGenreJournee(aGenre) {
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
function _formatDonnees() {
	this.listeDates = new ObjetListeElements();
	this.listeDispenses.parcourir((aElement) => {
		if (aElement.existe()) {
			let lElement;
			const lPlaceJDebut = aElement.placeDebut % GParametres.PlacesParJour;
			const lPlaceJFin = aElement.placeFin % GParametres.PlacesParJour;
			let lDate;
			if (
				aElement.matiere.getNumero() === this.matiereSelectionnee.getNumero()
			) {
				lElement = new ObjetElement();
				lDate = GDate.getDateJour(aElement.dateDebut);
				lElement.date = lDate;
				lElement.placeDebut = lPlaceJDebut;
				if (GDate.estJourEgal(aElement.dateDebut, aElement.dateFin)) {
					lElement.placeFin = lPlaceJFin;
				} else {
					lElement.placeFin = GParametres.PlacesParJour - 1;
				}
				lElement.genreJournee = _getGenreJournee(lElement);
				lElement.couleur = _getCouleurGenreJournee(lElement.genreJournee);
				if (
					lElement.genreJournee !==
					InterfaceSaisieDispenses.genrePartieJournee.entiere
				) {
					lElement.couleurTexte = GCouleur.noir;
				}
				this.listeDates.addElement(lElement);
				const lNbr = GDate.getNbrJoursEntreDeuxDates(
					aElement.dateDebut,
					aElement.dateFin,
				);
				if (lNbr > 0) {
					for (let i = 0; i < lNbr; i++) {
						lDate = GDate.getJourSuivant(lDate);
						lElement = new ObjetElement();
						lElement.date = lDate;
						lElement.placeDebut = 0;
						if (i === lNbr - 1) {
							lElement.placeFin = lPlaceJFin;
						} else {
							lElement.placeFin = GParametres.PlacesParJour - 1;
						}
						lElement.genreJournee = _getGenreJournee(lElement);
						lElement.couleur = _getCouleurGenreJournee(lElement.genreJournee);
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
	this.listeDates.setTri([ObjetTri.init("date", EGenreTriElement.Croissant)]);
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
function _eventMatieres(aParams) {
	if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
		this.matiereSelectionnee = this.listeMatieres.getElementParNumero(
			aParams.element.getNumero(),
		);
		const lDonnees = _formatDonnees.call(this);
		this.getInstance(this.identCalendrier).setVisible(true);
		this.getInstance(this.identCalendrier).setDonnees(lDonnees);
	}
}
function _eventJournee(aParams) {
	if (
		aParams.genreEvenement === EGenreEvenementObjetSaisie.selection &&
		(!this.partieJourneeSelectionnee ||
			aParams.element.getGenre() !== this.partieJourneeSelectionnee.getGenre())
	) {
		this.partieJourneeSelectionnee = this.listePartieJournee.getElementParGenre(
			aParams.element.getGenre(),
		);
	}
}
function _actualiserApresSaisie(aDonnee) {
	aDonnee.setEtat(EGenreEtat.Modification);
	this.setEtatSaisie(true);
	this.actualiserListe();
}
function _initTripleCombo(aInstance) {
	aInstance.setParametres(
		[EGenreRessource.Classe, EGenreRessource.Eleve],
		true,
	);
	aInstance.setEvenementMenusDeroulants(this.surEvntMenusDeroulants);
}
function _initCalendrier(aInstance) {
	aInstance.setParametres({
		premiereDate: GDate.premiereDate,
		derniereDate: GDate.derniereDate,
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
function _initListe(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_Dispenses.colonnes.eleve,
		taille: 200,
		titre: GTraductions.getValeur("Eleve"),
	});
	lColonnes.push({
		id: DonneesListe_Dispenses.colonnes.classe,
		taille: 100,
		titre: GTraductions.getValeur("Classe"),
	});
	lColonnes.push({
		id: DonneesListe_Dispenses.colonnes.matiere,
		taille: 210,
		titre: GTraductions.getValeur("Matiere"),
	});
	lColonnes.push({
		id: DonneesListe_Dispenses.colonnes.date,
		taille: 190,
		titre: GTraductions.getValeur("Date"),
	});
	lColonnes.push({
		id: DonneesListe_Dispenses.colonnes.presenceObligatoire,
		taille: 70,
		titre: {
			libelle: GTraductions.getValeur("dispenses.presenceObligatoire"),
			nbLignes: 2,
		},
	});
	lColonnes.push({
		id: DonneesListe_Dispenses.colonnes.heuresPerdues,
		taille: 55,
		titre: { libelle: GTraductions.getValeur("HeuresPerdues"), nbLignes: 2 },
	});
	lColonnes.push({
		id: DonneesListe_Dispenses.colonnes.commentaire,
		taille: 240,
		titre: GTraductions.getValeur("Commentaire"),
	});
	lColonnes.push({
		id: DonneesListe_Dispenses.colonnes.fichierJoint,
		taille: 25,
		titre: [
			{
				libelle: GTraductions.getValeur("dispenses.pj"),
				title: GTraductions.getValeur("dispenses.piecesjointes"),
				avecFusionColonne: true,
			},
			{ classeCssImage: "Image_Trombone" },
		],
	});
	lColonnes.push({
		id: DonneesListe_Dispenses.colonnes.publierPJFeuilleDA,
		taille: 25,
		titre: [
			{
				libelle: GTraductions.getValeur("dispenses.pj"),
				title: GTraductions.getValeur("dispenses.piecesjointes"),
				avecFusionColonne: true,
			},
			{
				classeCssImage: "Image_Publie",
				title: GTraductions.getValeur("dispenses.publicationPJFeuilleDAppel"),
			},
		],
	});
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		hauteurAdapteContenu: true,
		hauteurZoneContenuListeMin: 60,
		colonnesCachees: [
			DonneesListe_Dispenses.colonnes.eleve,
			DonneesListe_Dispenses.colonnes.classe,
		],
	});
}
function _initMatieres(aInstance) {
	aInstance.setOptionsObjetSaisie({
		longueur: 200,
		labelWAICellule: GTraductions.getValeur("WAI.ListeSelectionMatiere"),
		deroulerListeSeulementSiPlusieursElements: false,
		initAutoSelectionAvecUnElement: false,
		classTexte: "Gras",
		texteEdit: GTraductions.getValeur("dispenses.saisieDesDispenses"),
	});
}
function _initJournee(aInstance) {
	aInstance.setOptionsObjetSaisie({
		longueur: 100,
		labelWAICellule: GTraductions.getValeur("WAI.ListeSelectionPartieJournee"),
		deroulerListeSeulementSiPlusieursElements: false,
		initAutoSelectionAvecUnElement: false,
		classTexte: "Gras",
		texteEdit: GTraductions.getValeur("dispenses.par"),
	});
}
module.exports = { InterfaceSaisieDispenses };
