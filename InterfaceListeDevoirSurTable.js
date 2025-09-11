exports.InterfaceListeDevoirSurTable = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetFenetre_DevoirSurTable_1 = require("ObjetFenetre_DevoirSurTable");
const DonneesListe_DevoirsSurTable_1 = require("DonneesListe_DevoirsSurTable");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetCalendrier_1 = require("ObjetCalendrier");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeDomaine_1 = require("TypeDomaine");
const InterfacePage_1 = require("InterfacePage");
const ObjetDeserialiser_1 = require("ObjetDeserialiser");
const ObjetFenetre_SelectionClasseGroupe_1 = require("ObjetFenetre_SelectionClasseGroupe");
const ObjetRequeteSaisieCahierDeTextes_1 = require("ObjetRequeteSaisieCahierDeTextes");
const UtilitaireInitCalendrier_1 = require("UtilitaireInitCalendrier");
const UtilitaireListePeriodes_1 = require("UtilitaireListePeriodes");
const AccessApp_1 = require("AccessApp");
class ObjetRequeteListeDevoirSurTable extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
CollectionRequetes_1.Requetes.inscrire(
	"ListeDevoirSurTable",
	ObjetRequeteListeDevoirSurTable,
);
class InterfaceListeDevoirSurTable extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.applicationScoEspace = (0, AccessApp_1.getApp)();
		this.etatUtil = this.applicationScoEspace.getEtatUtilisateur();
		this.objetParamsSco = this.applicationScoEspace.getObjetParametres();
		const lListe = this.etatUtil.getListeClasses({
				avecClasse: true,
				uniquementClasseEnseignee: true,
			}),
			lDomaine = this.etatUtil.getDomaineSelectionne();
		if (!this.etatUtil.getOnglet().params) {
			this.etatUtil.getOnglet().params = {
				mesDonnees: true,
				listeClassesSelectionne:
					MethodesObjet_1.MethodesObjet.dupliquer(lListe),
			};
		}
		this.parametres = {
			init: false,
			listeClasses: lListe,
			dateDebut: ObjetDate_1.GDate.getDateBornee(
				IE.Cycles.dateDebutCycle(lDomaine.getPremierePosition()),
			),
			dateFin: ObjetDate_1.GDate.getDateBornee(
				IE.Cycles.dateFinCycle(lDomaine.getDernierePosition()),
			),
		};
	}
	construireInstances() {
		this.identCalendrier = this.add(
			ObjetCalendrier_1.ObjetCalendrier,
			this._evenementSurCalendrier,
			this._initialiserCalendrier,
		);
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListe,
			this._initListe,
		);
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
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = true;
		this.AddSurZone.push(
			{
				html: IE.jsx.str(
					"div",
					{ class: "GrandEspaceGauche" },
					IE.jsx.str(
						"ie-bouton",
						{
							"ie-model": "btnClasse",
							"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
								"fenetreSelectionClasseGroupe.titre",
							),
							"aria-haspopup": "dialog",
						},
						"...",
					),
				),
			},
			{
				html: IE.jsx.str("div", {
					class: "PetitEspaceGauche NoWrap",
					"ie-html": "libelleClasse",
				}),
			},
			{
				html: IE.jsx.str(
					"div",
					{ class: "GrandEspaceGauche" },
					IE.jsx.str(
						"ie-checkbox",
						{ "ie-model": "cbMesDonnees", class: "NoWrap" },
						ObjetChaine_1.GChaine.insecable(
							ObjetTraduction_1.GTraductions.getValeur(
								"ListeDevoirSurTable.UniquementMesDonnees",
							),
						),
					),
				),
			},
			{ separateur: true },
			{
				html: IE.jsx.str(
					"div",
					{ class: "EspaceGauche NoWrap" },
					ObjetTraduction_1.GTraductions.getValeur("Periode") + " : ",
					" ",
				),
			},
			{ html: IE.jsx.str("ie-combo", { "ie-model": "comboPeriodes" }) },
			{ html: ObjetTraduction_1.GTraductions.getValeur("Du") },
			{ ident: this.identDateDebut },
			{ html: ObjetTraduction_1.GTraductions.getValeur("Au") },
			{ ident: this.identDateFin },
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnClasse: {
				event: function () {
					const lInstance = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_SelectionClasseGroupe_1.ObjetFenetre_SelectionClasseGroupe,
						{
							pere: aInstance,
							evenement: aInstance._surEvenementFenetreClasses,
						},
					);
					lInstance.setAvecCumul(true);
					lInstance.setDonnees({
						listeRessources: aInstance.parametres.listeClasses,
						listeRessourcesSelectionnees:
							aInstance.etatUtil.getOnglet().params.listeClassesSelectionne,
					});
				},
			},
			libelleClasse: function () {
				const lNb = aInstance.parametres.listeClasses.count(),
					lNbSelec = aInstance.etatUtil
						.getOnglet()
						.params.listeClassesSelectionne.count();
				return (
					ObjetTraduction_1.GTraductions.getValeur("Classes") +
					" (" +
					(lNb === lNbSelec
						? ObjetTraduction_1.GTraductions.getValeur("toutes")
						: lNbSelec + "/" + lNb) +
					")"
				);
			},
			cbMesDonnees: {
				getValue: function () {
					return aInstance.etatUtil.getOnglet().params.mesDonnees;
				},
				setValue: function (aValue) {
					aInstance.etatUtil.getOnglet().params.mesDonnees = aValue;
					aInstance._actualiser();
				},
			},
			comboPeriodes: {
				init: function (aInstance) {
					aInstance.setOptionsObjetSaisie({
						longueur: 150,
						labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
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
							UtilitaireListePeriodes_1.TUtilitaireListePeriodes.construireListePeriodes(
								[
									UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix
										.aujourdhui,
									UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix
										.semainePrecedente,
									UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix
										.semaineCourante,
									UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix
										.semaineSuivante,
									UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix
										.moisCourant,
									UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix
										.annee,
									UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix
										.periodes,
									UtilitaireListePeriodes_1.TUtilitaireListePeriodes.choix.mois,
								],
							);
					}
					return aInstance.parametres.listePeriodes;
				},
				getIndiceSelection: function (aInstanceCombo) {
					aInstance.parametres.indiceComboPeriode =
						aInstance._getIndiceListePeriodeSelonDates();
					if (aInstance.parametres.indiceComboPeriode < 0) {
						aInstanceCombo.setContenu("");
					}
					return aInstance.parametres.indiceComboPeriode;
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.element
					) {
						aInstance.parametres.dateDebut = aParametres.element.dates.debut;
						aInstance.parametres.dateFin = aParametres.element.dates.fin;
						aInstance.parametres.indiceComboPeriode = aParametres.indice;
						if (aParametres.interactionUtilisateur) {
							aInstance._actualiser();
						}
					}
				},
			},
		});
	}
	recupererDonnees() {
		this.parametres.init = true;
		const lCalendrier = this.getInstance(this.identCalendrier);
		lCalendrier.setFrequences(this.objetParamsSco.frequences, true);
		lCalendrier.setDomaine(this.etatUtil.getDomaineSelectionne());
		this._actualiser();
	}
	_initialiserCalendrier(aInstance) {
		UtilitaireInitCalendrier_1.UtilitaireInitCalendrier.init(aInstance, {
			avecMultiSemainesContinues: true,
		});
	}
	_evenementSurCalendrier(aNumeroSemaine, aDomaine) {
		this.etatUtil.setDomaineSelectionne(aDomaine);
		if (this.getInstance(this.identCalendrier).InteractionUtilisateur) {
			this.parametres.dateDebut = ObjetDate_1.GDate.getDateBornee(
				IE.Cycles.dateDebutCycle(aDomaine.getPremierePosition()),
			);
			this.parametres.dateFin = ObjetDate_1.GDate.getDateBornee(
				IE.Cycles.dateFinCycle(aDomaine.getDernierePosition()),
			);
			this._actualiser();
		}
	}
	_initListe(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_DevoirsSurTable_1.DonneesListe_DevoirsSurTable.colonnes
				.date,
			titre: ObjetTraduction_1.GTraductions.getValeur("Date"),
			taille: 170,
		});
		lColonnes.push({
			id: DonneesListe_DevoirsSurTable_1.DonneesListe_DevoirsSurTable.colonnes
				.prof,
			titre: ObjetTraduction_1.GTraductions.getValeur("Professeur"),
			taille: ObjetListe_1.ObjetListe.initColonne(100, 50),
		});
		lColonnes.push({
			id: DonneesListe_DevoirsSurTable_1.DonneesListe_DevoirsSurTable.colonnes
				.public,
			titre:
				ObjetTraduction_1.GTraductions.getValeur("Classe") +
				"/" +
				ObjetTraduction_1.GTraductions.getValeur("Groupe"),
			taille: ObjetListe_1.ObjetListe.initColonne(100, 50),
		});
		lColonnes.push({
			id: DonneesListe_DevoirsSurTable_1.DonneesListe_DevoirsSurTable.colonnes
				.matiere,
			titre: ObjetTraduction_1.GTraductions.getValeur("Matiere"),
			taille: ObjetListe_1.ObjetListe.initColonne(100, 50),
		});
		lColonnes.push({
			id: DonneesListe_DevoirsSurTable_1.DonneesListe_DevoirsSurTable.colonnes
				.salle,
			titre: ObjetTraduction_1.GTraductions.getValeur("Salle"),
			taille: ObjetListe_1.ObjetListe.initColonne(70, 50),
		});
		lColonnes.push({
			id: DonneesListe_DevoirsSurTable_1.DonneesListe_DevoirsSurTable.colonnes
				.info,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"ListeDevoirSurTable.InfosLien",
			),
			taille: ObjetListe_1.ObjetListe.initColonne(100, 50),
		});
		aInstance.setOptionsListe({ colonnes: lColonnes });
		this.etatUtil.setTriListe({
			liste: aInstance,
			tri: [
				DonneesListe_DevoirsSurTable_1.DonneesListe_DevoirsSurTable.colonnes
					.date,
				DonneesListe_DevoirsSurTable_1.DonneesListe_DevoirsSurTable.colonnes
					.prof,
			],
		});
	}
	_saisieCDT(aListeCDTs, aContenu) {
		this.setEtatSaisie(false);
		new ObjetRequeteSaisieCahierDeTextes_1.ObjetRequeteSaisieCahierDeTextes(
			this,
			this._actualiser.bind(this),
		).lancerRequete(
			aContenu.cours.Numero,
			aContenu.numeroCycle,
			undefined,
			undefined,
			undefined,
			aListeCDTs,
		);
	}
	_evenementListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				if (!!aParametres.article && !!aParametres.article.listeContenus) {
					const lCahiers = this._creerStructureCDTsPourSaisieContenu(
							aParametres.article,
						),
						lCahier = lCahiers.get(0);
					aParametres.article.listeContenus.parcourir((aContenu) => {
						aContenu.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
						lCahier.listeContenus.addElement(aContenu);
					});
					this._saisieCDT(lCahiers, aParametres.article);
				}
				break;
		}
	}
	_initSurDate(aInstance) {
		aInstance.setParametresFenetre(
			this.objetParamsSco.PremierLundi,
			this.objetParamsSco.PremiereDate,
			this.objetParamsSco.DerniereDate,
		);
	}
	_eventSurDate(aEstDateDebut, aDate) {
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
		this._actualiser();
	}
	_surEvenementFenetreClasses(
		aGenreRessource,
		aListeRessources,
		aNumeroBouton,
	) {
		if (aNumeroBouton === 1) {
			this._actualiser();
		}
	}
	_getIndiceListePeriodeSelonDates() {
		let lIndice = -1;
		const lDateDebut = this.parametres.dateDebut;
		const lDateFin = this.parametres.dateFin;
		this.parametres.listePeriodes.parcourir((D, aIndice) => {
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
	_creerStructureCDTsPourSaisieContenu(aElement) {
		const lCahiers = new ObjetListeElements_1.ObjetListeElements();
		const lCahier = new ObjetElement_1.ObjetElement("", aElement.getNumero());
		lCahiers.addElement(lCahier);
		lCahier.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		lCahier.listeContenus = new ObjetListeElements_1.ObjetListeElements();
		lCahier.listeContenus.verifierAvantValidation =
			ObjetDeserialiser_1.ObjetDeserialiser._verifierAvantValidation;
		return lCahiers;
	}
	_evenementSurFenetreDevoirSurTable(
		aElement,
		aValider,
		aParametres,
		aAvecLien,
	) {
		if (!aValider) {
			return;
		}
		const lCahiers = this._creerStructureCDTsPourSaisieContenu(aElement);
		const lCahier = lCahiers.get(0);
		const lContenu = new ObjetElement_1.ObjetElement(
			"",
			aElement.listeContenus.getNumero(0),
		);
		lCahier.listeContenus.addElement(lContenu);
		lContenu.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		lContenu.Libelle = aParametres.contenu.getLibelle();
		lContenu.descriptif = aParametres.contenu.descriptif;
		lContenu.genreLienDS = aParametres.genreLienDS;
		if (aParametres.surModification_suppression) {
			lContenu.suppressionLien = true;
		} else if (aAvecLien) {
			lContenu.infosDS = $.extend({}, aParametres);
		}
		this._saisieCDT(lCahiers, aElement);
	}
	_callbackSaisieSalle(aInstanceFenetre, aElement, aCours, aParamFenetre) {
		aInstanceFenetre.fermer();
		this._ouvertureFenetreDevoirSurTable(aElement, aParamFenetre);
	}
	_ouvertureFenetreDevoirSurTable(aElement, aParamFenetre) {
		const lInstance = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_DevoirSurTable_1.ObjetFenetre_DevoirSurTable,
			{
				pere: this,
				evenement: this._evenementSurFenetreDevoirSurTable.bind(this, aElement),
			},
		);
		lInstance.setDonnees({
			cours: aElement.cours,
			numeroCycle: aElement.numeroCycle,
			contenu: aElement.listeContenus.get(0),
			contenuPourDescription: aParamFenetre
				? null
				: aElement.listeContenus.get(0),
			genreLienDS: aElement.getGenre(),
			callbackSaisieSalle: this._callbackSaisieSalle.bind(
				this,
				lInstance,
				aElement,
			),
			paramsFenetreOrigine: aParamFenetre,
		});
	}
	_callbackModifierLigne(aElement) {
		this._ouvertureFenetreDevoirSurTable(aElement, null);
	}
	async _actualiser() {
		if (!this.parametres.init) {
			return;
		}
		this.getInstance(this.identDateDebut).setDonnees(this.parametres.dateDebut);
		this.getInstance(this.identDateFin).setDonnees(this.parametres.dateFin);
		const lDomaine = new TypeDomaine_1.TypeDomaine();
		lDomaine.setValeur(
			true,
			IE.Cycles.cycleDeLaDate(this.parametres.dateDebut),
			IE.Cycles.cycleDeLaDate(this.parametres.dateFin),
		);
		this.etatUtil.setDomaineSelectionne(lDomaine);
		this.getInstance(this.identCalendrier).setDomaine(lDomaine);
		this.etatUtil
			.getOnglet()
			.params.listeClassesSelectionne.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
		const lReponse = await new ObjetRequeteListeDevoirSurTable(
			this,
		).lancerRequete({
			dateDebut: this.parametres.dateDebut,
			dateFin: this.parametres.dateFin,
			listeClasses: this.etatUtil.getOnglet().params.listeClassesSelectionne,
			mesDonnees: this.etatUtil.getOnglet().params.mesDonnees,
		});
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_DevoirsSurTable_1.DonneesListe_DevoirsSurTable(
				lReponse.liste,
				{ callbackModifier: this._callbackModifierLigne.bind(this) },
			),
		);
	}
}
exports.InterfaceListeDevoirSurTable = InterfaceListeDevoirSurTable;
