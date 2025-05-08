const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GChaine } = require("ObjetChaine.js");
const { Requetes } = require("CollectionRequetes.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
	ObjetFenetre_SelectionRessource,
} = require("ObjetFenetre_SelectionRessource.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeDomaine } = require("TypeDomaine.js");
const DonneesListe_CoursNonAssures = require("DonneesListe_CoursNonAssures.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const { TUtilitaireListePeriodes } = require("UtilitaireListePeriodes.js");
const { EGenreEspace } = require("Enumere_Espace.js");
Requetes.inscrire("CoursNonAssures", ObjetRequeteConsultation);
class InterfaceCoursNonAssures extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.donnees = {
			dateDebut: null,
			dateFin: null,
			listeProfsSelec: null,
			listeProfs: null,
			total: "",
			listePeriodes: null,
			indiceComboPeriode: 0,
			avecCumulProfesseur: true,
		};
	}
	getControleur() {
		return $.extend(true, super.getControleur(this), {
			btnProfs: {
				event: function () {
					_ouvrirFenetreSelectionProfs(this.instance);
				},
			},
			getLibelleBtnProfs: function () {
				let lLibelle = GTraductions.getValeur("Professeurs") + " (%s)";
				if (
					!this.instance.donnees.listeProfsSelec ||
					!this.instance.donnees.listeProfs ||
					this.instance.donnees.listeProfs.count() ===
						this.instance.donnees.listeProfsSelec.count()
				) {
					lLibelle = GChaine.format(lLibelle, [GTraductions.getValeur("tous")]);
				} else {
					lLibelle = GChaine.format(lLibelle, [
						this.instance.donnees.listeProfsSelec.count() +
							" / " +
							this.instance.donnees.listeProfs.count(),
					]);
				}
				return '<span class="NoWrap">' + lLibelle + "</span>";
			},
			comboPeriodes: {
				init: function (aInstance) {
					aInstance.setOptionsObjetSaisie({
						labelWAICellule: GTraductions.getValeur(
							"WAI.ListeSelectionPeriode",
						),
					});
				},
				getDonnees: function (aDonnees) {
					if (aDonnees) {
						return;
					}
					if (!this.instance.donnees.listePeriodes) {
						let TListePeriode;
						const lEstEspaceDirection = [
							EGenreEspace.Administrateur,
							EGenreEspace.Mobile_Administrateur,
							EGenreEspace.PrimDirection,
							EGenreEspace.Mobile_PrimDirection,
						].includes(GEtatUtilisateur.GenreEspace);
						if (lEstEspaceDirection) {
							TListePeriode = [
								TUtilitaireListePeriodes.choix.aujourdhui,
								TUtilitaireListePeriodes.choix.demain,
								TUtilitaireListePeriodes.choix.semaineCourante,
								TUtilitaireListePeriodes.choix.annee,
								TUtilitaireListePeriodes.choix.mois,
							];
						} else {
							TListePeriode = [
								TUtilitaireListePeriodes.choix.aujourdhui,
								TUtilitaireListePeriodes.choix.demain,
								TUtilitaireListePeriodes.choix.semaineCourante,
								TUtilitaireListePeriodes.choix.mois,
							];
						}
						this.instance.donnees.listePeriodes =
							TUtilitaireListePeriodes.construireListePeriodes(TListePeriode, {
								dateDebut: GApplication.getDateDemo()
									? GApplication.getDateDemo()
									: lEstEspaceDirection
										? GDate.premiereDate
										: GDate.getDateCourante(),
							});
					}
					return this.instance.donnees.listePeriodes;
				},
				getIndiceSelection: function (aInstanceCombo) {
					this.instance.donnees.indiceComboPeriode =
						_getIndiceListePeriodeSelonDates.call(this.instance);
					if (this.instance.donnees.indiceComboPeriode < 0) {
						aInstanceCombo.setContenu("");
					}
					return this.instance.donnees.indiceComboPeriode;
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							EGenreEvenementObjetSaisie.selection &&
						aParametres.element
					) {
						this.instance.donnees.dateDebut = aParametres.element.dates.debut;
						this.instance.donnees.dateFin = aParametres.element.dates.fin;
						this.instance.donnees.indiceComboPeriode = aParametres.indice;
						_requete.call(this.instance);
					}
				},
			},
			cbAvecCumulProfesseur: {
				getValue: function () {
					return this.instance.donnees.avecCumulProfesseur;
				},
				setValue: function (aValue) {
					const lThis = this.instance;
					lThis.donnees.avecCumulProfesseur = aValue;
					_actualiser.call(lThis);
				},
			},
		});
	}
	construireInstances() {
		this.identListe = this.add(ObjetListe, null, _initialiserListe.bind(this));
		this.IdentZoneAlClient = this.identListe;
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
		this.avecBandeau = true;
		const lDates = _getDatesSemaineEnCours();
		this.donnees.dateDebut = lDates.dateDebut;
		this.donnees.dateFin = lDates.dateFin;
		this.AddSurZone.push(
			{
				html: '<div class="EspaceGauche"><ie-bouton ie-model="btnProfs">...</ie-bouton></div>',
			},
			{ html: '<div class="EspaceGauche" ie-html="getLibelleBtnProfs"></div>' },
		);
		if (_afficherComboPeriode()) {
			this.AddSurZone.push(
				{
					html:
						'<div class="EspaceGauche EspaceDroite>-</div><div class="NoWrap">' +
						GTraductions.getValeur("Periode") +
						" : " +
						"</div>",
				},
				{ html: '<ie-combo ie-model="comboPeriodes"></ie-combo>' },
			);
		}
		this.AddSurZone.push(
			{ html: GTraductions.getValeur("Du") },
			this.identDateDebut,
			{ html: GTraductions.getValeur("Au") },
			this.identDateFin,
		);
		this.AddSurZone.push({
			html:
				'<div class="EspaceGauche NoWrap"><ie-checkbox ie-model="cbAvecCumulProfesseur">' +
				GTraductions.getValeur("CoursNonAssures.CumulParProfesseur") +
				"</ie-checkbox></div>",
		});
	}
	recupererDonnees() {
		_requete.call(this);
	}
}
function _ouvrirFenetreSelectionProfs(aInstance) {
	const lFenetre = ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_SelectionRessource,
		{
			pere: aInstance,
			evenement: function (
				aGenreRessource,
				aListeRessourcesSelectionnees,
				ANumeroBouton,
			) {
				if (ANumeroBouton === 0) {
					aInstance.donnees.listeProfsSelec = aListeRessourcesSelectionnees;
					_requete.call(aInstance);
				}
			},
		},
		{ titre: GTraductions.getValeur("CoursNonAssures.SelectionProfesseurs") },
	);
	lFenetre.setDonnees({
		listeRessources: aInstance.donnees.listeProfs,
		listeRessourcesSelectionnees: aInstance.donnees.listeProfsSelec,
		genreRessource: EGenreRessource.Enseignant,
	});
}
function _getIndiceListePeriodeSelonDates() {
	let lIndice = -1;
	const lDateDebut = this.donnees.dateDebut;
	const lDateFin = this.donnees.dateFin;
	this.donnees.listePeriodes.parcourir((D, aIndice) => {
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
function _getBornesDates() {
	const lDomaineConsultation = GApplication.droits.get(
		TypeDroits.cours.domaineConsultationEDT,
	);
	let lDateDebut = IE.Cycles.dateDebutCycle(
		lDomaineConsultation.getPremierePosition(),
	);
	let lDateFin = IE.Cycles.dateFinCycle(
		lDomaineConsultation.getDernierePosition(),
	);
	if (
		![EGenreEspace.Administrateur, EGenreEspace.Mobile_Administrateur].includes(
			GEtatUtilisateur.GenreEspace,
		)
	) {
		const lDateRef = GApplication.getDateDemo()
			? GDate.getDateDemiJour(GApplication.getDateDemo())
			: new Date();
		if (lDateDebut < lDateRef) {
			lDateDebut = new Date(lDateRef.getTime());
		}
		if (lDateDebut > lDateRef) {
			lDateDebut = new Date(lDateRef.getTime());
		}
		if (lDateFin < lDateRef) {
			lDateFin = new Date(lDateRef.getTime());
		}
	}
	return { dateDebut: lDateDebut, dateFin: lDateFin };
}
function _getDatesSemaineEnCours() {
	const lBornes = _getBornesDates();
	let lCycleCourant, lDateDebut, lDateFin;
	lCycleCourant = GEtatUtilisateur.getSemaineSelectionnee();
	if (IE.Cycles.dateFinCycle(lCycleCourant + 1) < lBornes.dateDebut) {
		lCycleCourant = IE.Cycles.cycleCourant();
	}
	lDateDebut = IE.Cycles.dateDebutCycle(lCycleCourant);
	lDateFin = IE.Cycles.dateFinCycle(lCycleCourant + 1);
	return {
		dateDebut: lDateDebut < lBornes.dateDebut ? lBornes.dateDebut : lDateDebut,
		dateFin: lDateFin > lBornes.dateFin ? lBornes.dateFin : lDateFin,
	};
}
function _initSurDate(aInstance) {
	const lBornes = _getBornesDates();
	aInstance.setParametresFenetre(
		GParametres.PremierLundi,
		GDate.getDateBornee(lBornes.dateDebut),
		GDate.getDateBornee(lBornes.dateFin),
	);
}
function _eventSurDate(aEstDateDebut, aDate) {
	if (aEstDateDebut) {
		this.donnees.dateDebut = aDate;
		if (this.donnees.dateDebut > this.donnees.dateFin) {
			this.donnees.dateFin = aDate;
			this.getInstance(this.identDateFin).setDonnees(this.donnees.dateFin);
		}
	} else {
		this.donnees.dateFin = aDate;
		if (this.donnees.dateFin < this.donnees.dateDebut) {
			this.donnees.dateDebut = aDate;
			this.getInstance(this.identDateDebut).setDonnees(this.donnees.dateDebut);
		}
	}
	_requete.call(this);
}
function _initialiserListe(aInstance) {
	const lColonnes = [];
	const lThis = this;
	aInstance.controleur.getTitreColonneProfesseur = function () {
		const lTitre = [GTraductions.getValeur("Professeur")];
		if (lThis.donnees.avecCumulProfesseur) {
			lTitre.push(" > ", GTraductions.getValeur("Matiere"));
		}
		return lTitre.join("");
	};
	lColonnes.push({
		id: DonneesListe_CoursNonAssures.colonnes.professeur,
		taille: 200,
		titre: { libelleHtml: '<span ie-html="getTitreColonneProfesseur"></span>' },
	});
	lColonnes.push({
		id: DonneesListe_CoursNonAssures.colonnes.matiere,
		taille: 200,
		titre: GTraductions.getValeur("Matiere"),
	});
	lColonnes.push({
		id: DonneesListe_CoursNonAssures.colonnes.classe,
		taille: 150,
		titre: GTraductions.getValeur("Classe"),
	});
	lColonnes.push({
		id: DonneesListe_CoursNonAssures.colonnes.duree,
		taille: 50,
		titre: GTraductions.getValeur("Duree"),
	});
	lColonnes.push({
		id: DonneesListe_CoursNonAssures.colonnes.date,
		taille: 80,
		titre: GTraductions.getValeur("Date"),
	});
	lColonnes.push({
		id: DonneesListe_CoursNonAssures.colonnes.debut,
		taille: 50,
		titre: GTraductions.getValeur("CoursNonAssures.Debut"),
	});
	lColonnes.push({
		id: DonneesListe_CoursNonAssures.colonnes.aDonneLieu,
		taille: 200,
		titre: GTraductions.getValeur("CoursNonAssures.ADonneeLieu"),
	});
	aInstance.setOptionsListe({ colonnes: lColonnes, avecLigneTotal: true });
}
function _afficherComboPeriode() {
	const lDomaineConsultation = GApplication.droits.get(
			TypeDroits.cours.domaineConsultationEDT,
		),
		lDomainePlein = new TypeDomaine();
	lDomainePlein.setValeur(
		true,
		IE.Cycles.cycleDeLaDate(GParametres.PremiereDate),
		IE.Cycles.cycleDeLaDate(GParametres.DerniereDate),
	);
	return lDomainePlein.getDomaineSoustraction(lDomaineConsultation).estVide();
}
function _actualiser() {
	const lBoutonsListe = [];
	if (this.donnees.avecCumulProfesseur) {
		lBoutonsListe.push({ genre: ObjetListe.typeBouton.deployer });
	}
	const lColonnesCachees = [];
	if (this.donnees.avecCumulProfesseur) {
		lColonnesCachees.push(DonneesListe_CoursNonAssures.colonnes.matiere);
	}
	const lListe = this.getInstance(this.identListe);
	lListe.setOptionsListe({
		boutons: lBoutonsListe,
		colonnesCachees: lColonnesCachees,
	});
	lListe.setDonnees(
		new DonneesListe_CoursNonAssures(this.donnees.listeCoursNonAssures, {
			avecCumulProfesseur: this.donnees.avecCumulProfesseur,
		}),
	);
	this.getInstance(this.identDateDebut).setDonnees(this.donnees.dateDebut);
	this.getInstance(this.identDateFin).setDonnees(this.donnees.dateFin);
}
function _reponseRequete(aDonnees) {
	$.extend(this.donnees, aDonnees);
	if (aDonnees.listeProfs) {
		this.donnees.listeProfs = aDonnees.listeProfs;
		this.donnees.listeProfsSelec = MethodesObjet.dupliquer(aDonnees.listeProfs);
		if (aDonnees.listeProfsSelec) {
			this.donnees.listeProfsSelec = aDonnees.listeProfsSelec;
		}
	}
	if (this.donnees.listeCoursNonAssures) {
		this.donnees.listeCoursNonAssures.total = this.donnees.total;
	}
	_actualiser.call(this);
}
function _requete() {
	if (this.donnees.listeProfsSelec) {
		this.donnees.listeProfsSelec.setSerialisateurJSON({
			ignorerEtatsElements: true,
		});
	}
	Requetes("CoursNonAssures", this, _reponseRequete.bind(this)).lancerRequete({
		dateDebut: this.donnees.dateDebut,
		dateFin: this.donnees.dateFin,
		listeProfs: this.donnees.listeProfsSelec,
	});
}
module.exports = { InterfaceCoursNonAssures };
