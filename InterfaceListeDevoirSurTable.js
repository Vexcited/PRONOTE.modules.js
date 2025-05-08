const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const {
	ObjetFenetre_DevoirSurTable,
} = require("ObjetFenetre_DevoirSurTable.js");
const {
	DonneesListe_DevoirsSurTable,
} = require("DonneesListe_DevoirsSurTable.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GChaine } = require("ObjetChaine.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetCalendrier } = require("ObjetCalendrier.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeDomaine } = require("TypeDomaine.js");
const { InterfacePage } = require("InterfacePage.js");
const { ObjetDeserialiser } = require("ObjetDeserialiser.js");
const {
	ObjetFenetre_SelectionClasseGroupe,
} = require("ObjetFenetre_SelectionClasseGroupe.js");
const {
	ObjetRequeteSaisieCahierDeTextes,
} = require("ObjetRequeteSaisieCahierDeTextes.js");
const { UtilitaireInitCalendrier } = require("UtilitaireInitCalendrier.js");
const { TUtilitaireListePeriodes } = require("UtilitaireListePeriodes.js");
Requetes.inscrire("ListeDevoirSurTable", ObjetRequeteConsultation);
class InterfaceListeDevoirSurTable extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		const lListe = GEtatUtilisateur.getListeClasses({
				avecClasse: true,
				uniquementClasseEnseignee: true,
			}),
			lDomaine = GEtatUtilisateur.getDomaineSelectionne();
		if (!GEtatUtilisateur.getOnglet().params) {
			GEtatUtilisateur.getOnglet().params = {
				mesDonnees: true,
				listeClassesSelectionne: MethodesObjet.dupliquer(lListe),
			};
		}
		this.parametres = {
			init: false,
			listeClasses: lListe,
			dateDebut: GDate.getDateBornee(
				IE.Cycles.dateDebutCycle(lDomaine.getPremierePosition()),
			),
			dateFin: GDate.getDateBornee(
				IE.Cycles.dateFinCycle(lDomaine.getDernierePosition()),
			),
		};
	}
	construireInstances() {
		this.identCalendrier = this.add(
			ObjetCalendrier,
			_evenementSurCalendrier,
			_initialiserCalendrier,
		);
		this.identListe = this.add(ObjetListe, _evenementListe, _initListe);
		this.identDateDebut = this.add(
			ObjetCelluleDate,
			_eventSurDate.bind(this, true),
			_initSurDate.bind(this),
		);
		this.identDateFin = this.add(
			ObjetCelluleDate,
			_eventSurDate.bind(this, false),
			_initSurDate.bind(this),
		);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = true;
		this.AddSurZone.push(
			{
				html: '<div class="GrandEspaceGauche"><ie-bouton ie-model="btnClasse">...</ie-bouton></div>',
			},
			{
				html: '<div class="PetitEspaceGauche NoWrap" ie-html="libelleClasse"></div>',
			},
			{
				html:
					'<div class="GrandEspaceGauche"><ie-checkbox ie-model="cbMesDonnees" class="NoWrap">' +
					GChaine.insecable(
						GTraductions.getValeur("ListeDevoirSurTable.UniquementMesDonnees"),
					) +
					"</ie-checkbox></div>",
			},
			{ separateur: true },
			{
				html:
					'<div class="EspaceGauche NoWrap">' +
					GTraductions.getValeur("Periode") +
					" : " +
					"</div>",
			},
			{ html: '<ie-combo ie-model="comboPeriodes"></ie-combo>' },
			{ html: GTraductions.getValeur("Du") },
			{ ident: this.identDateDebut },
			{ html: GTraductions.getValeur("Au") },
			{ ident: this.identDateFin },
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnClasse: {
				event: function () {
					const lInstance = ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_SelectionClasseGroupe,
						{ pere: aInstance, evenement: _surEvenementFenetreClasses },
					);
					lInstance.setAvecCumul(true);
					lInstance.setDonnees({
						listeRessources: aInstance.parametres.listeClasses,
						listeRessourcesSelectionnees:
							GEtatUtilisateur.getOnglet().params.listeClassesSelectionne,
					});
				},
			},
			libelleClasse: function () {
				const lNb = aInstance.parametres.listeClasses.count(),
					lNbSelec =
						GEtatUtilisateur.getOnglet().params.listeClassesSelectionne.count();
				return (
					GTraductions.getValeur("Classes") +
					" (" +
					(lNb === lNbSelec
						? GTraductions.getValeur("toutes")
						: lNbSelec + "/" + lNb) +
					")"
				);
			},
			cbMesDonnees: {
				getValue: function () {
					return GEtatUtilisateur.getOnglet().params.mesDonnees;
				},
				setValue: function (aValue) {
					GEtatUtilisateur.getOnglet().params.mesDonnees = aValue;
					_actualiser.call(aInstance);
				},
			},
			comboPeriodes: {
				init: function (aInstance) {
					aInstance.setOptionsObjetSaisie({
						longueur: 150,
						labelWAICellule: GTraductions.getValeur(
							"WAI.ListeSelectionPeriode",
						),
					});
				},
				getDonnees: function (aDonnees) {
					if (aDonnees) {
						return;
					}
					if (!aInstance.parametres.listePeriodes) {
						aInstance.parametres.listePeriodes =
							TUtilitaireListePeriodes.construireListePeriodes([
								TUtilitaireListePeriodes.choix.aujourdhui,
								TUtilitaireListePeriodes.choix.semainePrecedente,
								TUtilitaireListePeriodes.choix.semaineCourante,
								TUtilitaireListePeriodes.choix.semaineSuivante,
								TUtilitaireListePeriodes.choix.moisCourant,
								TUtilitaireListePeriodes.choix.annee,
								TUtilitaireListePeriodes.choix.periodes,
								TUtilitaireListePeriodes.choix.mois,
							]);
					}
					return aInstance.parametres.listePeriodes;
				},
				getIndiceSelection: function (aInstanceCombo) {
					aInstance.parametres.indiceComboPeriode =
						_getIndiceListePeriodeSelonDates.call(aInstance);
					if (aInstance.parametres.indiceComboPeriode < 0) {
						aInstanceCombo.setContenu("");
					}
					return aInstance.parametres.indiceComboPeriode;
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							EGenreEvenementObjetSaisie.selection &&
						aParametres.element
					) {
						aInstance.parametres.dateDebut = aParametres.element.dates.debut;
						aInstance.parametres.dateFin = aParametres.element.dates.fin;
						aInstance.parametres.indiceComboPeriode = aParametres.indice;
						if (aParametres.interactionUtilisateur) {
							_actualiser.call(aInstance);
						}
					}
				},
			},
		});
	}
	recupererDonnees() {
		this.parametres.init = true;
		const lCalendrier = this.getInstance(this.identCalendrier);
		lCalendrier.setFrequences(GParametres.frequences, true);
		lCalendrier.setDomaine(GEtatUtilisateur.getDomaineSelectionne());
		_actualiser.call(this);
	}
}
function _initialiserCalendrier(aInstance) {
	UtilitaireInitCalendrier.init(aInstance, {
		avecMultiSemainesContinues: true,
	});
}
function _evenementSurCalendrier(aNumeroSemaine, aDomaine) {
	GEtatUtilisateur.setDomaineSelectionne(aDomaine);
	if (this.getInstance(this.identCalendrier).InteractionUtilisateur) {
		this.parametres.dateDebut = GDate.getDateBornee(
			IE.Cycles.dateDebutCycle(aDomaine.getPremierePosition()),
		);
		this.parametres.dateFin = GDate.getDateBornee(
			IE.Cycles.dateFinCycle(aDomaine.getDernierePosition()),
		);
		_actualiser.call(this, true);
	}
}
function _initListe(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_DevoirsSurTable.colonnes.date,
		titre: GTraductions.getValeur("Date"),
		taille: 170,
	});
	lColonnes.push({
		id: DonneesListe_DevoirsSurTable.colonnes.prof,
		titre: GTraductions.getValeur("Professeur"),
		taille: ObjetListe.initColonne(100, 50),
	});
	lColonnes.push({
		id: DonneesListe_DevoirsSurTable.colonnes.public,
		titre:
			GTraductions.getValeur("Classe") + "/" + GTraductions.getValeur("Groupe"),
		taille: ObjetListe.initColonne(100, 50),
	});
	lColonnes.push({
		id: DonneesListe_DevoirsSurTable.colonnes.matiere,
		titre: GTraductions.getValeur("Matiere"),
		taille: ObjetListe.initColonne(100, 50),
	});
	lColonnes.push({
		id: DonneesListe_DevoirsSurTable.colonnes.salle,
		titre: GTraductions.getValeur("Salle"),
		taille: ObjetListe.initColonne(70, 50),
	});
	lColonnes.push({
		id: DonneesListe_DevoirsSurTable.colonnes.info,
		titre: GTraductions.getValeur("ListeDevoirSurTable.InfosLien"),
		taille: ObjetListe.initColonne(100, 50),
	});
	aInstance.setOptionsListe({ colonnes: lColonnes });
	GEtatUtilisateur.setTriListe({
		liste: aInstance,
		tri: [
			DonneesListe_DevoirsSurTable.colonnes.date,
			DonneesListe_DevoirsSurTable.colonnes.prof,
		],
	});
}
function _saisieCDT(aListeCDTs, aContenu) {
	this.setEtatSaisie(false);
	new ObjetRequeteSaisieCahierDeTextes(
		this,
		_actualiser.bind(this),
	).lancerRequete(
		aContenu.cours.Numero,
		aContenu.numeroCycle,
		undefined,
		undefined,
		undefined,
		aListeCDTs,
	);
}
function _evenementListe(aParametres) {
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.Suppression:
			if (!!aParametres.article && !!aParametres.article.listeContenus) {
				const lCahiers = _creerStructureCDTsPourSaisieContenu(
						aParametres.article,
					),
					lCahier = lCahiers.get(0);
				aParametres.article.listeContenus.parcourir((aContenu) => {
					aContenu.setEtat(EGenreEtat.Suppression);
					lCahier.listeContenus.addElement(aContenu);
				});
				_saisieCDT.call(this, lCahiers, aParametres.article);
			}
			break;
	}
}
function _initSurDate(aInstance) {
	aInstance.setParametresFenetre(
		GParametres.PremierLundi,
		GParametres.PremiereDate,
		GParametres.DerniereDate,
	);
}
function _eventSurDate(aEstDateDebut, aDate) {
	if (aEstDateDebut) {
		this.parametres.dateDebut = aDate;
		if (this.parametres.dateDebut > this.parametres.dateFin) {
			this.parametres.dateFin = aDate;
			this.getInstance(this.identDateFin).setDonnees(this.parametres.dateFin);
		}
	} else {
		this.parametres.dateFin = aDate;
		if (this.parametres.dateFin < this.parametres.dateDebut) {
			this.parametres.dateDebut = aDate;
			this.getInstance(this.identDateDebut).setDonnees(
				this.parametres.dateDebut,
			);
		}
	}
	_actualiser.call(this);
}
function _surEvenementFenetreClasses(
	aGenreRessource,
	aListeRessources,
	aNumeroBouton,
) {
	if (aNumeroBouton === 1) {
		_actualiser.call(this);
	}
}
function _getIndiceListePeriodeSelonDates() {
	let lIndice = -1;
	const lDateDebut = this.parametres.dateDebut;
	const lDateFin = this.parametres.dateFin;
	this.parametres.listePeriodes.parcourir((D, aIndice) => {
		if (
			GDate.estJourEgal(lDateDebut, D.dates.debut) &&
			GDate.estJourEgal(lDateFin, D.dates.fin)
		) {
			lIndice = aIndice;
			return false;
		}
	});
	return lIndice;
}
function _creerStructureCDTsPourSaisieContenu(aElement) {
	const lCahiers = new ObjetListeElements();
	const lCahier = new ObjetElement("", aElement.getNumero());
	lCahiers.addElement(lCahier);
	lCahier.setEtat(EGenreEtat.Modification);
	lCahier.listeContenus = new ObjetListeElements();
	lCahier.listeContenus.verifierAvantValidation =
		ObjetDeserialiser._verifierAvantValidation;
	return lCahiers;
}
function _evenementSurFenetreDevoirSurTable(
	aElement,
	aValider,
	aParametres,
	aAvecLien,
) {
	if (!aValider) {
		return;
	}
	const lCahiers = _creerStructureCDTsPourSaisieContenu(aElement);
	const lCahier = lCahiers.get(0);
	const lContenu = new ObjetElement("", aElement.listeContenus.getNumero(0));
	lCahier.listeContenus.addElement(lContenu);
	lContenu.setEtat(EGenreEtat.Modification);
	lContenu.Libelle = aParametres.contenu.getLibelle();
	lContenu.descriptif = aParametres.contenu.descriptif;
	lContenu.genreLienDS = aParametres.genreLienDS;
	if (aParametres.surModification_suppression) {
		lContenu.suppressionLien = true;
	} else if (aAvecLien) {
		lContenu.infosDS = $.extend({}, aParametres);
	}
	_saisieCDT.call(this, lCahiers, aElement);
}
function _callbackSaisieSalle(
	aInstanceFenetre,
	aElement,
	aCours,
	aParamFenetre,
) {
	aInstanceFenetre.fermer();
	_ouvertureFenetreDevoirSurTable.call(this, aElement, aParamFenetre);
}
function _ouvertureFenetreDevoirSurTable(aElement, aParamFenetre) {
	const lInstance = ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_DevoirSurTable,
		{
			pere: this,
			evenement: _evenementSurFenetreDevoirSurTable.bind(this, aElement),
		},
	);
	lInstance.setDonnees({
		cours: aElement.cours,
		date: aElement.date,
		numeroCycle: aElement.numeroCycle,
		contenu: aElement.listeContenus.get(0),
		contenuPourDescription: aParamFenetre
			? null
			: aElement.listeContenus.get(0),
		genreLienDS: aElement.getGenre(),
		callbackSaisieSalle: _callbackSaisieSalle.bind(this, lInstance, aElement),
		paramsFenetreOrigine: aParamFenetre,
	});
}
function _callbackModifierLigne(aElement) {
	_ouvertureFenetreDevoirSurTable.call(this, aElement, null);
}
function _apresRequete(aJSON) {
	this.getInstance(this.identListe).setDonnees(
		new DonneesListe_DevoirsSurTable(aJSON.liste, {
			callbackModifier: _callbackModifierLigne.bind(this),
		}),
	);
}
function _actualiser() {
	if (!this.parametres.init) {
		return;
	}
	this.getInstance(this.identDateDebut).setDonnees(this.parametres.dateDebut);
	this.getInstance(this.identDateFin).setDonnees(this.parametres.dateFin);
	const lDomaine = new TypeDomaine();
	lDomaine.setValeur(
		true,
		IE.Cycles.cycleDeLaDate(this.parametres.dateDebut),
		IE.Cycles.cycleDeLaDate(this.parametres.dateFin),
	);
	GEtatUtilisateur.setDomaineSelectionne(lDomaine);
	this.getInstance(this.identCalendrier).setDomaine(lDomaine);
	GEtatUtilisateur.getOnglet().params.listeClassesSelectionne.setSerialisateurJSON(
		{ ignorerEtatsElements: true },
	);
	Requetes("ListeDevoirSurTable", this, _apresRequete).lancerRequete({
		dateDebut: this.parametres.dateDebut,
		dateFin: this.parametres.dateFin,
		listeClasses: GEtatUtilisateur.getOnglet().params.listeClassesSelectionne,
		mesDonnees: GEtatUtilisateur.getOnglet().params.mesDonnees,
	});
}
module.exports = { InterfaceListeDevoirSurTable };
