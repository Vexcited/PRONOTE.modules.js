exports.InterfaceCoursNonAssures = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_SelectionRessource_1 = require("ObjetFenetre_SelectionRessource");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeDomaine_1 = require("TypeDomaine");
const DonneesListe_CoursNonAssures_1 = require("DonneesListe_CoursNonAssures");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const UtilitaireListePeriodes_1 = require("UtilitaireListePeriodes");
const Enumere_Espace_1 = require("Enumere_Espace");
const AccessApp_1 = require("AccessApp");
const ObjetRequeteCoursNonAssures_1 = require("ObjetRequeteCoursNonAssures");
class InterfaceCoursNonAssures extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.appScoEspace = (0, AccessApp_1.getApp)();
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
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnProfs: {
				event: function () {
					aInstance._ouvrirFenetreSelectionProfs();
				},
			},
			getLibelleBtnProfs: function () {
				let lLibelle =
					ObjetTraduction_1.GTraductions.getValeur("Professeurs") + " (%s)";
				if (
					!aInstance.donnees.listeProfsSelec ||
					!aInstance.donnees.listeProfs ||
					aInstance.donnees.listeProfs.count() ===
						aInstance.donnees.listeProfsSelec.count()
				) {
					lLibelle = ObjetChaine_1.GChaine.format(lLibelle, [
						ObjetTraduction_1.GTraductions.getValeur("tous"),
					]);
				} else {
					lLibelle = ObjetChaine_1.GChaine.format(lLibelle, [
						aInstance.donnees.listeProfsSelec.count() +
							" / " +
							aInstance.donnees.listeProfs.count(),
					]);
				}
				return '<span class="NoWrap">' + lLibelle + "</span>";
			},
			comboPeriodes: {
				init: function (aInstance) {
					aInstance.setOptionsObjetSaisie({
						labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
							"WAI.ListeSelectionPeriode",
						),
					});
				},
				getDonnees: function (aDonnees) {
					if (aDonnees) {
						return;
					}
					if (!aInstance.donnees.listePeriodes) {
						let TListePeriode;
						const lEstEspaceDirection = [
							Enumere_Espace_1.EGenreEspace.Administrateur,
							Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
							Enumere_Espace_1.EGenreEspace.PrimDirection,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
						].includes(GEtatUtilisateur.GenreEspace);
						if (lEstEspaceDirection) {
							TListePeriode = [
								UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix
									.aujourdhui,
								UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix.demain,
								UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix
									.semaineCourante,
								UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix.annee,
								UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix.mois,
							];
						} else {
							TListePeriode = [
								UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix
									.aujourdhui,
								UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix.demain,
								UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix
									.semaineCourante,
								UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix.mois,
							];
						}
						aInstance.donnees.listePeriodes =
							UtilitaireListePeriodes_1.TUtilitaireListePeriodes.construireListePeriodes(
								TListePeriode,
								{
									dateDebut: aInstance.appScoEspace.getDateDemo()
										? aInstance.appScoEspace.getDateDemo()
										: lEstEspaceDirection
											? ObjetDate_1.GDate.premiereDate
											: ObjetDate_1.GDate.getDateCourante(),
								},
							);
					}
					return aInstance.donnees.listePeriodes;
				},
				getIndiceSelection: function (aInstanceCombo) {
					aInstance.donnees.indiceComboPeriode =
						aInstance._getIndiceListePeriodeSelonDates();
					if (aInstance.donnees.indiceComboPeriode < 0) {
						aInstanceCombo.setContenu("");
					}
					return aInstance.donnees.indiceComboPeriode;
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.element
					) {
						aInstance.donnees.dateDebut = aParametres.element.dates.debut;
						aInstance.donnees.dateFin = aParametres.element.dates.fin;
						aInstance.donnees.indiceComboPeriode = aParametres.indice;
						aInstance._requete();
					}
				},
			},
			cbAvecCumulProfesseur: {
				getValue: function () {
					return aInstance.donnees.avecCumulProfesseur;
				},
				setValue: function (aValue) {
					aInstance.donnees.avecCumulProfesseur = aValue;
					aInstance._requete();
				},
			},
		});
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this._initialiserListe.bind(this),
		);
		this.IdentZoneAlClient = this.identListe;
		this.identDateDebut = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._eventSurDate.bind(this, true),
			this._initSurDate.bind(this),
		);
		this.identDateFin = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._eventSurDate.bind(this, false),
			this._initSurDate.bind(this),
		);
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		const lDates = this._getDatesSemaineEnCours();
		this.donnees.dateDebut = lDates.dateDebut;
		this.donnees.dateFin = lDates.dateFin;
		this.AddSurZone.push(
			{
				html: IE.jsx.str(
					"div",
					{ class: "EspaceGauche" },
					IE.jsx.str(
						"ie-bouton",
						{
							"ie-model": "btnProfs",
							"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
								"CoursNonAssures.SelectionProfesseurs",
							),
						},
						"...",
					),
				),
			},
			{ html: IE.jsx.str("div", { "ie-html": "getLibelleBtnProfs" }) },
		);
		if (this._afficherComboPeriode()) {
			this.AddSurZone.push(
				{ html: IE.jsx.str("div", null, "-") },
				{
					html: IE.jsx.str(
						"div",
						{ class: "NoWrap" },
						ObjetTraduction_1.GTraductions.getValeur("Periode"),
						" : ",
					),
				},
				{ html: IE.jsx.str("ie-combo", { "ie-model": "comboPeriodes" }) },
			);
		}
		this.AddSurZone.push(
			{ html: ObjetTraduction_1.GTraductions.getValeur("Du") },
			this.identDateDebut,
			{ html: ObjetTraduction_1.GTraductions.getValeur("Au") },
			this.identDateFin,
		);
		this.AddSurZone.push({
			html:
				'<div class="EspaceGauche NoWrap"><ie-checkbox ie-model="cbAvecCumulProfesseur">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"CoursNonAssures.CumulParProfesseur",
				) +
				"</ie-checkbox></div>",
		});
	}
	recupererDonnees() {
		this._requete();
	}
	_ouvrirFenetreSelectionProfs() {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource,
			{
				pere: this,
				evenement: (
					aGenreRessource,
					aListeRessourcesSelectionnees,
					ANumeroBouton,
				) => {
					if (ANumeroBouton === 0) {
						this.donnees.listeProfsSelec = aListeRessourcesSelectionnees;
						this._requete();
					}
				},
			},
			{
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"CoursNonAssures.SelectionProfesseurs",
				),
			},
		);
		lFenetre.setDonnees({
			listeRessources: this.donnees.listeProfs,
			listeRessourcesSelectionnees: this.donnees.listeProfsSelec,
			genreRessource: Enumere_Ressource_1.EGenreRessource.Enseignant,
		});
	}
	_getIndiceListePeriodeSelonDates() {
		let lIndice = -1;
		const lDateDebut = this.donnees.dateDebut;
		const lDateFin = this.donnees.dateFin;
		this.donnees.listePeriodes.parcourir((D, aIndice) => {
			if (
				ObjetDate_1.GDate.estJourEgal(lDateDebut, D.dates.debut) &&
				ObjetDate_1.GDate.estJourEgal(lDateFin, D.dates.fin)
			) {
				lIndice = aIndice;
				return false;
			}
		});
		return lIndice;
	}
	_getBornesDates() {
		const lDomaineConsultation = this.appScoEspace.droits.get(
			ObjetDroitsPN_1.TypeDroits.cours.domaineConsultationEDT,
		);
		let lDateDebut = IE.Cycles.dateDebutCycle(
			lDomaineConsultation.getPremierePosition(),
		);
		let lDateFin = IE.Cycles.dateFinCycle(
			lDomaineConsultation.getDernierePosition(),
		);
		if (
			![
				Enumere_Espace_1.EGenreEspace.Administrateur,
				Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
			].includes(GEtatUtilisateur.GenreEspace)
		) {
			const lDateRef = this.appScoEspace.getDateDemo()
				? ObjetDate_1.GDate.getDateDemiJour(this.appScoEspace.getDateDemo())
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
	_getDatesSemaineEnCours() {
		const lBornes = this._getBornesDates();
		let lCycleCourant, lDateDebut, lDateFin;
		lCycleCourant = this.appScoEspace
			.getEtatUtilisateur()
			.getSemaineSelectionnee();
		if (IE.Cycles.dateFinCycle(lCycleCourant + 1) < lBornes.dateDebut) {
			lCycleCourant = IE.Cycles.cycleCourant();
		}
		lDateDebut = IE.Cycles.dateDebutCycle(lCycleCourant);
		lDateFin = IE.Cycles.dateFinCycle(lCycleCourant + 1);
		return {
			dateDebut:
				lDateDebut < lBornes.dateDebut ? lBornes.dateDebut : lDateDebut,
			dateFin: lDateFin > lBornes.dateFin ? lBornes.dateFin : lDateFin,
		};
	}
	_initSurDate(aInstance) {
		const lBornes = this._getBornesDates();
		aInstance.setParametresFenetre(
			GParametres.PremierLundi,
			ObjetDate_1.GDate.getDateBornee(lBornes.dateDebut),
			ObjetDate_1.GDate.getDateBornee(lBornes.dateFin),
		);
	}
	_eventSurDate(aEstDateDebut, aDate) {
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
				this.getInstance(this.identDateDebut).setDonnees(
					this.donnees.dateDebut,
				);
			}
		}
		this._requete();
	}
	_initialiserListe(aInstance) {
		const lColonnes = [];
		const lThis = this;
		const lgetTitreColonneProfesseur = () => {
			const lTitre = [ObjetTraduction_1.GTraductions.getValeur("Professeur")];
			if (lThis.donnees.avecCumulProfesseur) {
				lTitre.push(" > ", ObjetTraduction_1.GTraductions.getValeur("Matiere"));
			}
			return lTitre.join("");
		};
		lColonnes.push({
			id: DonneesListe_CoursNonAssures_1.DonneesListe_CoursNonAssures.colonnes
				.professeur,
			taille: 200,
			titre: {
				getLibelleHtml: () =>
					IE.jsx.str("span", { "ie-html": lgetTitreColonneProfesseur }),
			},
		});
		lColonnes.push({
			id: DonneesListe_CoursNonAssures_1.DonneesListe_CoursNonAssures.colonnes
				.matiere,
			taille: 200,
			titre: ObjetTraduction_1.GTraductions.getValeur("Matiere"),
		});
		lColonnes.push({
			id: DonneesListe_CoursNonAssures_1.DonneesListe_CoursNonAssures.colonnes
				.classe,
			taille: 150,
			titre: ObjetTraduction_1.GTraductions.getValeur("Classe"),
		});
		lColonnes.push({
			id: DonneesListe_CoursNonAssures_1.DonneesListe_CoursNonAssures.colonnes
				.duree,
			taille: 50,
			titre: ObjetTraduction_1.GTraductions.getValeur("Duree"),
		});
		lColonnes.push({
			id: DonneesListe_CoursNonAssures_1.DonneesListe_CoursNonAssures.colonnes
				.date,
			taille: 80,
			titre: ObjetTraduction_1.GTraductions.getValeur("Date"),
		});
		lColonnes.push({
			id: DonneesListe_CoursNonAssures_1.DonneesListe_CoursNonAssures.colonnes
				.debut,
			taille: 50,
			titre: ObjetTraduction_1.GTraductions.getValeur("CoursNonAssures.Debut"),
		});
		lColonnes.push({
			id: DonneesListe_CoursNonAssures_1.DonneesListe_CoursNonAssures.colonnes
				.aDonneLieu,
			taille: 200,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CoursNonAssures.ADonneeLieu",
			),
		});
		aInstance.setOptionsListe({ colonnes: lColonnes, avecLigneTotal: true });
	}
	_afficherComboPeriode() {
		const lDomaineConsultation = this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.domaineConsultationEDT,
			),
			lDomainePlein = new TypeDomaine_1.TypeDomaine();
		lDomainePlein.setValeur(
			true,
			IE.Cycles.cycleDeLaDate(GParametres.PremiereDate),
			IE.Cycles.cycleDeLaDate(GParametres.DerniereDate),
		);
		return lDomainePlein.getDomaineSoustraction(lDomaineConsultation).estVide();
	}
	_actualiser() {
		const lBoutonsListe = [];
		if (this.donnees.avecCumulProfesseur) {
			lBoutonsListe.push({
				genre: ObjetListe_1.ObjetListe.typeBouton.deployer,
			});
		}
		const lColonnesCachees = [];
		if (this.donnees.avecCumulProfesseur) {
			lColonnesCachees.push(
				DonneesListe_CoursNonAssures_1.DonneesListe_CoursNonAssures.colonnes
					.matiere,
			);
		}
		const lListe = this.getInstance(this.identListe);
		lListe.setOptionsListe({
			boutons: lBoutonsListe,
			colonnesCachees: lColonnesCachees,
		});
		lListe.setDonnees(
			new DonneesListe_CoursNonAssures_1.DonneesListe_CoursNonAssures(
				this.donnees.listeCoursNonAssures,
				{ avecCumulProfesseur: this.donnees.avecCumulProfesseur },
			),
		);
		this.getInstance(this.identDateDebut).setDonnees(this.donnees.dateDebut);
		this.getInstance(this.identDateFin).setDonnees(this.donnees.dateFin);
	}
	_reponseRequete(aDonnees) {
		$.extend(this.donnees, aDonnees);
		if (aDonnees.listeProfs) {
			this.donnees.listeProfs = aDonnees.listeProfs;
			this.donnees.listeProfsSelec = MethodesObjet_1.MethodesObjet.dupliquer(
				aDonnees.listeProfs,
			);
			if (aDonnees.listeProfsSelec) {
				this.donnees.listeProfsSelec = aDonnees.listeProfsSelec;
			}
		}
		if (this.donnees.listeCoursNonAssures) {
			this.donnees.listeCoursNonAssures.total = this.donnees.total;
		}
		this._actualiser();
	}
	_requete() {
		if (this.donnees.listeProfsSelec) {
			this.donnees.listeProfsSelec.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
		}
		new ObjetRequeteCoursNonAssures_1.ObjetRequeteCoursNonAssures(this)
			.lancerRequete({
				dateDebut: this.donnees.dateDebut,
				dateFin: this.donnees.dateFin,
				listeProfs: this.donnees.listeProfsSelec,
			})
			.then((aReponse) => {
				this._reponseRequete(aReponse);
			});
	}
}
exports.InterfaceCoursNonAssures = InterfaceCoursNonAssures;
