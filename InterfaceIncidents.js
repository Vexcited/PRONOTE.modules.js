exports.InterfaceIncidents = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_Espace_1 = require("Enumere_Espace");
const DonneesListe_Actions_1 = require("DonneesListe_Actions");
const DonneesListe_Incidents_1 = require("DonneesListe_Incidents");
const DonneesListe_Protagonistes_1 = require("DonneesListe_Protagonistes");
const ObjetRequeteSaisieIncidents_1 = require("ObjetRequeteSaisieIncidents");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_SignalementIncident_1 = require("ObjetFenetre_SignalementIncident");
const ObjetFenetre_MesureIncident_1 = require("ObjetFenetre_MesureIncident");
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const MethodesTableau_1 = require("MethodesTableau");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_Event_1 = require("Enumere_Event");
const Enumere_Saisie_1 = require("Enumere_Saisie");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetSelecteurClasseGpe_1 = require("ObjetSelecteurClasseGpe");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetFenetre_SelectionPublic_1 = require("ObjetFenetre_SelectionPublic");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSelecteurPJCP_1 = require("ObjetSelecteurPJCP");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const ObjetCelluleMultiSelectionMotif_1 = require("ObjetCelluleMultiSelectionMotif");
const ObjetSelecteurPJ_1 = require("ObjetSelecteurPJ");
const TypeGenreIndividuAuteur_1 = require("TypeGenreIndividuAuteur");
const TypeGenrePunition_1 = require("TypeGenrePunition");
const TypeGenreStatutProtagonisteIncident_1 = require("TypeGenreStatutProtagonisteIncident");
const ObjetRequeteListePublics_1 = require("ObjetRequeteListePublics");
const TypeGenreReponseInternetActualite_1 = require("TypeGenreReponseInternetActualite");
const UtilitaireDuree_1 = require("UtilitaireDuree");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const ObjetFenetre_EditionActualite_1 = require("ObjetFenetre_EditionActualite");
const ObjetFenetre_SelectionSalleLieu_1 = require("ObjetFenetre_SelectionSalleLieu");
const ObjetRequeteListesSaisiesPourIncidents_1 = require("ObjetRequeteListesSaisiesPourIncidents");
const ObjetRequeteIncidentDonneesSaisieMesure_1 = require("ObjetRequeteIncidentDonneesSaisieMesure");
const ObjetRequeteIncidents_1 = require("ObjetRequeteIncidents");
class InterfaceIncidents extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.etatUtilSco = this.applicationSco.getEtatUtilisateur();
		this._autorisations = {
			acces: false,
			saisie: false,
			publier: false,
			publierDossierVS: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.dossierVS.publierDossiersVS,
			),
			saisiePunitions: {
				acces: this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.punition.acces,
				),
				saisie: this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.punition.saisie,
				),
				avecPublicationPunitions:
					this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.punition.avecPublicationPunitions,
					) &&
					!this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.estEnConsultation,
					),
				creerMotifIncidentPunitionSanction: this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.creerMotifIncidentPunitionSanction,
				),
			},
			uniquementMesIncidentsSignales: undefined,
		};
		this.donneesSaisie = {
			tailleTravailAFaire: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleTravailAFaire,
			),
			tailleCirconstance: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleCirconstance,
			),
			tailleCommentaire: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleCommentaire,
			),
		};
		this.saisieVise = [
			Enumere_Espace_1.EGenreEspace.Administrateur,
			Enumere_Espace_1.EGenreEspace.PrimDirection,
		].includes(this.etatUtilSco.GenreEspace);
		this.uniquementMesIncidents = this.saisieVise
			? false
			: this.etatUtilSco.getUniquementMesIncidents();
		this.uniquementNonRegle = this.etatUtilSco.getUniquementNonRegle();
		this.idInterfaceIncidents = `${this.Nom}_InterfaceIncidents`;
		this.idReponse = `${this.Nom}idReponse`;
		this.idBandeauDroite = `${this.Nom}idBandeauDroite`;
		this.idLabelMotifs = `${this.Nom}idLabelMotifs`;
		this.listeToutesClassesDisponibles = this.etatUtilSco.getListeClasses({
			avecClasse: true,
			uniquementClasseEnseignee: true,
		});
		this.nrIncidentSelectionne = undefined;
		this.etatUtilSco.setNrIncidentSelectionne(this.nrIncidentSelectionne);
		$.extend(true, this._autorisations, {
			acces: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.incidents.acces,
			),
			uniquementMesIncidentsSignales: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.incidents.uniquementMesIncidentsSignales,
			),
			saisie: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.incidents.saisie,
			),
			publier: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.incidents.publier,
			),
		});
		this.donnees = { classes: this.listeToutesClassesDisponibles };
		this.listePJ = new ObjetListeElements_1.ObjetListeElements();
		this._initColonnes();
	}
	construireInstances() {
		this.identSelecteurClasses = this.add(
			ObjetSelecteurClasseGpe_1.ObjetSelecteurClasseGpe,
			this.surEvenementSelecteurFiltreClasse,
			this._initialiserSelecteurFiltreClasse,
		);
		this.identIncidents = this.add(
			ObjetListe_1.ObjetListe,
			this._evntListe.bind(this),
			this._initListe.bind(this),
		);
		this.identProtagonistes = this.add(
			ObjetListe_1.ObjetListe,
			this._evntProtagonistes.bind(this),
			this._initProtagonistes.bind(this),
		);
		this.identDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._evntSurDate.bind(this),
			this._initDate.bind(this),
		);
		this.identCMS_Motifs = this.add(
			ObjetCelluleMultiSelectionMotif_1.ObjetCelluleMultiSelectionMotif,
			this._evnCMSMotifs.bind(this),
			this._initCMSMotifs.bind(this),
		);
		this.identSelecteurPJ = this.add(
			ObjetSelecteurPJ_1.ObjetSelecteurPJ,
			this._evntSelecteurPJ.bind(this),
			this._initSelecteurPJ.bind(this),
		);
		this.identFenetreSelectActions = this.addFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			this._evntFenetreSelectActions.bind(this),
			this._initFenetreActions.bind(this),
		);
		this.identFenetreLieux = this.addFenetre(
			ObjetFenetre_SelectionSalleLieu_1.ObjetFenetre_SelectionSalleLieu,
			this._evntFenetreLieux.bind(this),
			this._initFenetreLieux.bind(this),
		);
		this.identFenetreSignalement = this.addFenetre(
			ObjetFenetre_SignalementIncident_1.ObjetFenetre_SignalementIncident,
			this._evntFenetreSignalement.bind(this),
			this._initFenetreSignalement.bind(this),
		);
		this.identFenetreSelectPublic = this.addFenetre(
			ObjetFenetre_SelectionPublic_1.ObjetFenetre_SelectionPublic,
			this._evenementFenetreIndividu.bind(this),
			this._initFenetreSelectPublic,
		);
		this.identFenetreSelectPunition = this.addFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			this._evntFenetreSelectPunition.bind(this),
			this._initFenetreSelectPunition.bind(this),
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone = [
			this.identSelecteurClasses,
			{
				html:
					'<ie-checkbox class="GrandEspaceDroit" ie-model="filtres.checkboxNonReglesAdm">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"incidents.uniquementNonRA",
					) +
					"</ie-checkbox>",
			},
			{
				html:
					'<ie-checkbox ie-model="filtres.checkboxMesIncidents" ie-display="filtres.estVisibleCheckboxMesIncidents">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"incidents.uniquementMesIncidents",
					) +
					"</ie-checkbox>",
			},
		];
	}
	_initColonnes() {
		const lTabColonnesParDefaut = [
			{ id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.id },
			{ id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.date },
			{ id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.heure },
			{ id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.motifs },
			{ id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.lieu },
			{ id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.details },
			{
				id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.gravite,
				visible: false,
			},
			{
				id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.rapporteur,
				visible: false,
			},
			{
				id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.auteurs,
				visible: false,
			},
			{
				id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.victimes,
				visible: false,
			},
			{
				id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.temoins,
				visible: false,
			},
			{ id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.vise },
			{ id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.regle },
			{
				id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes
					.faitDeViolence,
				visible: false,
			},
			{
				id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes
					.actionsEnvisagees,
				visible: false,
			},
			{
				id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes
					.suitesDonnees,
			},
		];
		this.paramColonnes =
			this.applicationSco.parametresUtilisateur.get("Incidents.Cols");
		if (!this.paramColonnes) {
			this.paramColonnes = lTabColonnesParDefaut;
			this.applicationSco.parametresUtilisateur.set(
				"Incidents.Cols",
				this.paramColonnes,
			);
		} else if (lTabColonnesParDefaut.length > this.paramColonnes.length) {
			lTabColonnesParDefaut.forEach((aColonneParDefaut, aIndex) => {
				let lEstPresente = false;
				this.paramColonnes.forEach((aColonne) => {
					if (aColonneParDefaut.id === aColonne.id) {
						lEstPresente = true;
					}
				});
				if (!lEstPresente) {
					this.paramColonnes.splice(aIndex, 0, aColonneParDefaut);
				}
			});
			this.applicationSco.parametresUtilisateur.set(
				"Incidents.Cols",
				this.paramColonnes,
			);
		}
	}
	construireStructureAffichageAutre() {
		const H = [];
		const lWidth = this._getWidthDeListe();
		const lHeight = 28;
		H.push(
			`<div id="${this.idInterfaceIncidents}" style="width:100%;height:100%;max-height:calc(100% - 0.8rem)">`,
		);
		H.push(`  <div class="ly-cols-2">`);
		H.push(
			`    <div id="${this.getNomInstance(this.identIncidents)}" class="aside-content p-right" style="${ObjetStyle_1.GStyle.composeWidth(lWidth)};max-width:50%;">`,
		);
		H.push(`    </div>`);
		H.push(
			`    <div id="${this.idReponse}'_section" class="main-content cols">`,
		);
		H.push(
			`      <div class="fix-bloc m-bottom flex-contain" style="height:${lHeight}px;">${this.composeBandeauDroite()}</div>`,
		);
		H.push(
			`      <div class="fluid-bloc full-height">${this._composeDetail()}</div>`,
		);
		H.push(`    </div>`);
		H.push(`  </div>`);
		H.push(`</div>`);
		return H.join("");
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			filtres: {
				checkboxNonReglesAdm: {
					getValue: function () {
						return aInstance.uniquementNonRegle;
					},
					setValue: function () {
						aInstance.uniquementNonRegle = !aInstance.uniquementNonRegle;
						const lInstanceListeIncidents = aInstance.getInstance(
							aInstance.identIncidents,
						);
						lInstanceListeIncidents
							.getDonneesListe()
							.setUniquementNonRegle(aInstance.uniquementNonRegle);
						aInstance.etatUtilSco.setUniquementNonRegle(
							aInstance.uniquementNonRegle,
						);
						let lGarderSelection = false;
						if (
							!aInstance.uniquementNonRegle ||
							!aInstance.incident ||
							aInstance.incident.estRA
						) {
							lGarderSelection = true;
						} else {
							aInstance.incident = undefined;
							aInstance._actualiserIncident();
						}
						lInstanceListeIncidents.actualiser(lGarderSelection);
					},
				},
				estVisibleCheckboxMesIncidents: function () {
					return (
						!aInstance.saisieVise &&
						!aInstance._autorisations.uniquementMesIncidentsSignales
					);
				},
				checkboxMesIncidents: {
					getValue: function () {
						return aInstance.uniquementMesIncidents;
					},
					setValue: function () {
						aInstance.uniquementMesIncidents =
							!aInstance.uniquementMesIncidents;
						const lInstanceListeIncidents = aInstance.getInstance(
							aInstance.identIncidents,
						);
						lInstanceListeIncidents
							.getDonneesListe()
							.setUniquementMesIncidents(aInstance.uniquementMesIncidents);
						aInstance.etatUtilSco.setUniquementMesIncidents(
							aInstance.uniquementMesIncidents,
						);
						let lGarderSelection = false;
						if (
							!aInstance.uniquementMesIncidents ||
							!aInstance.incident ||
							aInstance.incident.estRapporteur
						) {
							lGarderSelection = true;
						} else {
							aInstance.incident = undefined;
							aInstance._actualiserIncident();
						}
						lInstanceListeIncidents.actualiser(lGarderSelection);
					},
				},
			},
			auteur: {
				getValue: function () {
					return aInstance.incident && aInstance.incident.rapporteur
						? aInstance.incident.rapporteur.Libelle
						: "";
				},
				getDisabled: function () {
					return true;
				},
			},
			gravite: {
				getValue: function () {
					return aInstance.incident ? aInstance.incident.gravite : 1;
				},
				setValue: function (aValue) {
					if (aValue) {
						try {
							const lValue = parseInt(aValue);
							if (lValue > 0 && lValue < 6) {
								aInstance.incident.gravite = lValue;
								aInstance.incident.setEtat(
									Enumere_Etat_1.EGenreEtat.Modification,
								);
								aInstance.setEtatSaisie(true);
							}
						} catch (e) {}
					} else if (aValue === "") {
						aInstance.incident.gravite = "";
					}
				},
				exitChange: function () {
					if (aInstance.incident.gravite === "") {
						aInstance.incident.gravite = 1;
						aInstance.incident.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.setEtatSaisie(true);
					}
				},
				getDisabled: function () {
					return (
						!aInstance._autorisations.saisie ||
						!aInstance.incident ||
						!aInstance.incident.estEditable
					);
				},
			},
			getFaitDeViolence: {
				getValue: function () {
					return aInstance.incident ? aInstance.incident.faitDeViolence : false;
				},
				setValue: function (aValue) {
					if (!!aInstance.incident) {
						aInstance.incident.faitDeViolence = aValue;
						aInstance.incident.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.setEtatSaisie(true);
						aInstance.getInstance(aInstance.identIncidents).actualiser(true);
					}
				},
				getDisabled: function () {
					return (
						!aInstance._autorisations.saisie ||
						!aInstance.incident ||
						!aInstance.incident.avecEditFaitDeViolence
					);
				},
			},
			heure: {
				getValue: function () {
					return aInstance.incident
						? ObjetDate_1.GDate.formatDate(
								aInstance.incident.dateheure,
								"%hh:%mm",
							)
						: "";
				},
				setValue: function (aValue, aParamsSetter) {
					const lDate = new Date(
						aInstance.incident.dateheure.getFullYear(),
						aInstance.incident.dateheure.getMonth(),
						aInstance.incident.dateheure.getDate(),
						aParamsSetter.time.heure,
						aParamsSetter.time.minute,
					);
					aInstance.incident.dateheure = lDate;
					aInstance.incident.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aInstance.setEtatSaisie(true);
				},
				exitChange: function () {
					aInstance.getInstance(aInstance.identIncidents).actualiser(true);
				},
				getDisabled: function () {
					return (
						!aInstance._autorisations.saisie ||
						!aInstance.incident ||
						!aInstance.incident.estEditable
					);
				},
			},
			lieu: {
				init: function (aCombo) {
					const lOptions = {
						mode: Enumere_Saisie_1.EGenreSaisie.Combo,
						celluleAvecTexteHtml: true,
						longueur: 133,
						classTexte: "",
						hauteur: 17,
						deroulerListeSeulementSiPlusieursElements: false,
						initAutoSelectionAvecUnElement: false,
						labelWAICellule:
							ObjetTraduction_1.GTraductions.getValeur("WAI.SelectionLieu"),
						getClassElement: function (aParams) {
							return aParams.element.getNumero() === 0 ||
								aParams.element.getNumero() === -1
								? "titre-liste"
								: "";
						},
					};
					aCombo.setOptionsObjetSaisie(lOptions);
					aInstance.combo = aCombo;
				},
				getDonnees: function () {
					if (aInstance.donneesSaisie && aInstance.donneesSaisie.lieux) {
						return aInstance.donneesSaisie.lieux;
					}
				},
				getIndiceSelection: function () {
					return aInstance._indiceLieu;
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aInstance.incident &&
						aInstance._autorisations.saisie &&
						aInstance.incident.estEditable
					) {
						aInstance._indiceLieu = aParametres.indice;
						if (
							!aInstance.incident.lieu ||
							aParametres.element.getNumero() !==
								aInstance.incident.lieu.getNumero()
						) {
							aInstance.incident.lieu = aParametres.element;
							aInstance.getInstance(aInstance.identIncidents).actualiser(true);
							aInstance.incident.setEtat(
								Enumere_Etat_1.EGenreEtat.Modification,
							);
							aInstance.setEtatSaisie(true);
						}
					}
				},
				getDisabled: function () {
					return (
						!aInstance._autorisations.saisie ||
						!aInstance.incident ||
						!aInstance.incident.estEditable
					);
				},
			},
			details: {
				getValue: function () {
					return aInstance.incident ? aInstance.incident.Libelle : "";
				},
				setValue: function (aValue) {
					aInstance.incident.Libelle = aValue;
					aInstance.incident.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aInstance.setEtatSaisie(true);
				},
				eventChange: function () {
					aInstance.getInstance(aInstance.identIncidents).actualiser(true);
				},
				getDisabled: function () {
					return (
						!aInstance._autorisations.saisie ||
						!aInstance.incident ||
						!aInstance.incident.estEditable
					);
				},
			},
			detailActionEnvisagee: {
				getValue: function () {
					return aInstance.incident
						? aInstance.incident.detailActionEnvisagee
						: "";
				},
				setValue: function (aValue) {
					aInstance.incident.detailActionEnvisagee = aValue;
					aInstance.incident.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aInstance.setEtatSaisie(true);
				},
				eventChange: function () {
					aInstance.getInstance(aInstance.identIncidents).actualiser(true);
				},
				getDisabled: function () {
					return (
						!aInstance._autorisations.saisie ||
						!aInstance.incident ||
						!aInstance.incident.estEditable
					);
				},
			},
			boutonInformation: {
				event: function () {
					aInstance.gestionFenetreEditionInformation();
				},
				getDisabled() {
					return !aInstance.incident || !aInstance.incident.estEditable;
				},
			},
			messageEnvoye: function () {
				return aInstance.incident && aInstance.incident.messageEnvoye;
			},
		});
	}
	gestionFenetreEditionInformation() {
		if (this.etatUtilSco.EtatSaisie) {
			this.demandeOuvertureFenetreEditionInformation = true;
			this.valider();
		} else {
			this.ouvrirFenetreEditionInformation();
		}
	}
	ouvrirFenetreEditionInformation() {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_EditionActualite_1.ObjetFenetre_EditionActualite,
			{
				pere: this,
				evenement: function (aGenreBouton, aParam) {
					if (aGenreBouton === 1 && aParam.creation && aParam.incident) {
						aParam.incident.messageEnvoye = true;
					}
				},
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"actualites.creerInfo",
						),
						largeur: 750,
						hauteur: 700,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
					});
				},
			},
		);
		lFenetre.setDonnees({
			donnee: null,
			creation: true,
			genreReponse:
				TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
					.AvecAR,
			forcerAR: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.forcerARInfos,
			),
			genresPublic: [
				Enumere_Ressource_1.EGenreRessource.Enseignant,
				Enumere_Ressource_1.EGenreRessource.Personnel,
			],
			incident: this.incident,
		});
	}
	recupererDonnees() {
		this.setEtatSaisie(false);
		this.getInstance(this.identSelecteurClasses).setDonnees({
			listeSelection: this.donnees.classes,
			listeTotale: this.listeToutesClassesDisponibles,
		});
		this.getInstance(this.identSelecteurClasses).actualiserLibelle();
		$("#" + this.idReponse.escapeJQ() + "_detail").hide();
		this._setTexteBandeau(
			ObjetTraduction_1.GTraductions.getValeur("incidents.selectionnez"),
		);
		this.nrIncidentSelectionnee = this.etatUtilSco.getNrIncidentSelectionne();
		if (!this.nrIncidentSelectionnee) {
			new ObjetRequeteListesSaisiesPourIncidents_1.ObjetRequeteListesSaisiesPourIncidents(
				this,
				this._actionApresRequeteListesSaisiesPourIncidents,
			).lancerRequete({
				avecLieux: true,
				avecSalles: true,
				avecInternat: true,
				avecMotifs: true,
				avecActions: true,
				avecSousCategorieDossier: this._autorisations.saisie,
				avecPunitions: this._autorisations.saisie,
				avecSanctions: false,
				avecProtagonistes: this._autorisations.saisie,
			});
		} else {
			new ObjetRequeteIncidents_1.ObjetRequeteIncidents(
				this,
				this._actionApresRequeteIncidents,
			).lancerRequete(this.getParametresRequetesIncidents());
		}
	}
	valider() {
		const lObjetSaisie = {
			incidents: this.incidents,
			listeFichiers: this.listePJ,
		};
		this.actionValidationIncidents = true;
		new ObjetRequeteSaisieIncidents_1.ObjetRequeteSaisieIncidents(
			this,
			this.actionSurValidation,
		)
			.addUpload({ listeFichiers: this.listePJ })
			.lancerRequete(lObjetSaisie);
	}
	_initialiserSelecteurFiltreClasse(aInstance) {
		aInstance.setOptions({ avecSelectionObligatoire: true });
	}
	surEvenementSelecteurFiltreClasse(aParam) {
		this.donnees.classes = aParam.listeSelection;
		this.recupererDonnees();
	}
	_setTexteBandeau(aMessage) {
		ObjetHtml_1.GHtml.setHtml(this.idBandeauDroite + "_Texte", aMessage);
	}
	_getWidthDeColonne(aColonne) {
		switch (aColonne) {
			case DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.id:
				return 30;
			case DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.date:
				return 62;
			case DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.heure:
				return 42;
			case DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.motifs:
				return 150;
			case DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.lieu:
				return 120;
			case DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.details:
				return 150;
			case DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.auteurs:
				return 120;
			case DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.victimes:
				return 120;
			case DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.temoins:
				return 120;
			case DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.vise:
				return 30;
			case DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.regle:
				return 28;
			case DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes
				.faitDeViolence:
				return 28;
			case DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes
				.actionsEnvisagees:
				return 100;
			case DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.rapporteur:
				return 120;
			case DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.gravite:
				return 40;
			case DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes
				.suitesDonnees:
				return 170;
			default:
				return 0;
		}
	}
	_initListe(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.id,
			taille: this._getWidthDeColonne(
				DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.id,
			),
			titre: ObjetTraduction_1.GTraductions.getValeur("incidents.ID"),
			hint: ObjetTraduction_1.GTraductions.getValeur("incidents.hintID"),
			nonDeplacable: true,
			nonSupprimable: true,
		});
		lColonnes.push({
			id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.date,
			taille: this._getWidthDeColonne(
				DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.date,
			),
			titre: ObjetTraduction_1.GTraductions.getValeur("incidents.date"),
			nonDeplacable: true,
			nonSupprimable: true,
		});
		lColonnes.push({
			id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.heure,
			taille: this._getWidthDeColonne(
				DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.heure,
			),
			titre: ObjetTraduction_1.GTraductions.getValeur("incidents.heure"),
			nonDeplacable: true,
			nonSupprimable: true,
		});
		lColonnes.push({
			id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.motifs,
			taille: this._getWidthDeColonne(
				DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.motifs,
			),
			titre: ObjetTraduction_1.GTraductions.getValeur("incidents.motifs"),
			nonDeplacable: true,
			nonSupprimable: true,
		});
		lColonnes.push({
			id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.lieu,
			taille: this._getWidthDeColonne(
				DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.lieu,
			),
			titre: ObjetTraduction_1.GTraductions.getValeur("incidents.lieu"),
		});
		lColonnes.push({
			id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.details,
			taille: this._getWidthDeColonne(
				DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.details,
			),
			titre: ObjetTraduction_1.GTraductions.getValeur("incidents.details"),
		});
		lColonnes.push({
			id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.gravite,
			taille: this._getWidthDeColonne(
				DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.gravite,
			),
			titre: ObjetTraduction_1.GTraductions.getValeur("incidents.gravite"),
		});
		lColonnes.push({
			id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.rapporteur,
			taille: this._getWidthDeColonne(
				DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.rapporteur,
			),
			titre: ObjetTraduction_1.GTraductions.getValeur("incidents.rapporteur"),
		});
		lColonnes.push({
			id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.auteurs,
			taille: this._getWidthDeColonne(
				DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.auteurs,
			),
			titre: ObjetTraduction_1.GTraductions.getValeur("incidents.auteurs"),
		});
		lColonnes.push({
			id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.victimes,
			taille: this._getWidthDeColonne(
				DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.victimes,
			),
			titre: ObjetTraduction_1.GTraductions.getValeur("incidents.victimes"),
		});
		lColonnes.push({
			id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.temoins,
			taille: this._getWidthDeColonne(
				DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.temoins,
			),
			titre: ObjetTraduction_1.GTraductions.getValeur("incidents.temoins"),
		});
		lColonnes.push({
			id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.vise,
			taille: this._getWidthDeColonne(
				DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.vise,
			),
			titre: ObjetTraduction_1.GTraductions.getValeur("incidents.vise"),
		});
		lColonnes.push({
			id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.regle,
			taille: this._getWidthDeColonne(
				DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.regle,
			),
			titre: ObjetTraduction_1.GTraductions.getValeur("incidents.regle"),
		});
		lColonnes.push({
			id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes
				.faitDeViolence,
			taille: this._getWidthDeColonne(
				DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.faitDeViolence,
			),
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"incidents.faitDeViolence",
			),
		});
		lColonnes.push({
			id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes
				.actionsEnvisagees,
			taille: this._getWidthDeColonne(
				DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes
					.actionsEnvisagees,
			),
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"incidents.actionsEnvisagees",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"incidents.hintActionsEnvisagees",
			),
		});
		lColonnes.push({
			id: DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes
				.suitesDonnees,
			taille: this._getWidthDeColonne(
				DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.suitesDonnees,
			),
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"incidents.suitesDonnees",
			),
		});
		const lOptions = {
			colonnes: lColonnes,
			gestionModificationColonnes: {
				getColonnes: () => {
					return this.applicationSco.parametresUtilisateur.get(
						"Incidents.Cols",
					);
				},
				setColonnes: (aColonnes) => {
					this.paramColonnes = aColonnes;
					const lWidth = this._getWidthDeListe();
					ObjetPosition_1.GPosition.setWidth(
						this.getNomInstance(this.identIncidents),
						lWidth,
					);
					this.applicationSco.parametresUtilisateur.set(
						"Incidents.Cols",
						aColonnes,
					);
				},
			},
			scrollHorizontal: true,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.parametrer }],
		};
		if (this._autorisations.saisie) {
			$.extend(lOptions, {
				titreCreation:
					ObjetTraduction_1.GTraductions.getValeur("incidents.creation"),
				listeCreations: 1,
				avecLigneCreation: true,
			});
		}
		aInstance.setOptionsListe(lOptions, true);
		const lThis = this;
		aInstance.controleur.inputTime = {
			getValueInit: function (aNumero, aEtat) {
				const lNumero =
					aEtat === Enumere_Etat_1.EGenreEtat.Creation
						? parseInt(aNumero)
						: aNumero;
				const lElement = aInstance
					.getListeArticles()
					.getElementParNumero(lNumero);
				return lElement
					? ObjetDate_1.GDate.formatDate(lElement.dateheure, "%hh:%mm")
					: "";
			},
			exitChange: function (aNumero, aEtat, aValue, aParams) {
				if (!aParams.time.ok) {
					return;
				}
				const lNumero =
					aEtat === Enumere_Etat_1.EGenreEtat.Creation
						? parseInt(aNumero)
						: aNumero;
				const lElement = aInstance
					.getListeArticles()
					.getElementParNumero(lNumero);
				const lDate = new Date(
					lElement.dateheure.getFullYear(),
					lElement.dateheure.getMonth(),
					lElement.dateheure.getDate(),
					aParams.time.heure,
					aParams.time.minute,
				);
				lElement.dateheure = lDate;
				lElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				lThis.setEtatSaisie(true);
			},
		};
	}
	_initProtagonistes(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.colonnes
				.identite,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"incidents.protagonistes.identite",
			),
			taille: 200,
		});
		lColonnes.push({
			id: DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.colonnes
				.implication,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"incidents.protagonistes.implication",
			),
			taille: 80,
		});
		lColonnes.push({
			id: DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.colonnes
				.avecSanction,
			titre: [
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"incidents.protagonistes.suiteADonner",
					),
					avecFusionColonne: true,
				},
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"incidents.protagonistes.oui",
					),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"incidents.protagonistes.hintOui",
					),
				},
			],
			taille: 20,
		});
		lColonnes.push({
			id: DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.colonnes
				.sansSanction,
			titre: [
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"incidents.protagonistes.suiteADonner",
					),
					avecFusionColonne: true,
				},
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"incidents.protagonistes.non",
					),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"incidents.protagonistes.hintNon",
					),
				},
			],
			taille: 20,
		});
		lColonnes.push({
			id: DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.colonnes
				.mesure,
			titre: [
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"incidents.protagonistes.suiteADonner",
					),
					avecFusionColonne: true,
				},
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"incidents.protagonistes.mesures",
					),
				},
			],
			taille: 170,
		});
		lColonnes.push({
			id: DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.colonnes.date,
			titre: [
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"incidents.protagonistes.suiteADonner",
					),
					avecFusionColonne: true,
				},
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"incidents.protagonistes.date",
					),
				},
			],
			taille: 70,
		});
		if (!!this._autorisations.publierDossierVS) {
			lColonnes.push({
				id: DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.colonnes
					.pubDossier,
				titre: {
					libelleHtml: `<i class="icon_folder_close mix-icon_ok i-green" aria-label="${ObjetTraduction_1.GTraductions.getValeur("liste.DossierObligatoire")}" role="img"></i>`,
				},
				hint: ObjetTraduction_1.GTraductions.getValeur(
					"incidents.protagonistes.pubDossier",
				),
				taille: 20,
			});
		}
		if (!!this._autorisations.publier) {
			lColonnes.push({
				id: DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.colonnes
					.publication,
				titre: {
					libelleHtml:
						'<i class="icon_info_sondage_publier mix-icon_ok i-green" role="presentation"></i>',
				},
				hint: ObjetTraduction_1.GTraductions.getValeur(
					"incidents.protagonistes.publier",
				),
				taille: 20,
			});
			lColonnes.push({
				id: DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.colonnes
					.vuLe,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"incidents.protagonistes.vuLe",
				),
				taille: 70,
			});
		}
		const lOptions = { colonnes: lColonnes };
		if (this._autorisations.saisie) {
			$.extend(lOptions, {
				titreCreation: ObjetTraduction_1.GTraductions.getValeur(
					"incidents.protagonistes.ajouter",
				),
				listeCreations: 1,
				avecLigneCreation: true,
				hauteurAdapteContenu: true,
				getHauteurMaxAdapteListe: function () {
					return 242;
				},
			});
		}
		aInstance.setOptionsListe(lOptions);
	}
	_initCMSMotifs(aInstance) {
		aInstance.setOptions({
			largeurBouton: 302,
			classTexte: "",
			gestionnaireMotifs: { avecAuMoinsUnEltSelectionne: true },
			ariaLabelledBy: this.idLabelMotifs,
		});
	}
	_initDate(aInstance) {
		aInstance.setOptionsObjetCelluleDate({ classeCSSTexte: " " });
		aInstance.setControleNavigation(false);
	}
	_initSelecteurPJ(aInstance) {
		aInstance.setOptions({
			genrePJ: null,
			genreRessourcePJ:
				Enumere_Ressource_1.EGenreRessource.RelationIncidentFichierExterne,
			title: ObjetTraduction_1.GTraductions.getValeur(
				"AjouterDesPiecesJointes",
			),
			maxFiles: 0,
			libelleSelecteur: ObjetTraduction_1.GTraductions.getValeur(
				"AjouterDesPiecesJointes",
			),
			avecBoutonSupp: true,
			avecCmdAjoutNouvelle: false,
			avecMenuSuppressionPJ: false,
			maxSize: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
			),
		});
		aInstance.setActif(this._autorisations.saisie);
	}
	_initFenetreLieux(aInstance) {
		const lParamsListe = {
			tailles: ["100%"],
			editable: false,
			optionsListe: {
				skin: ObjetListe_1.ObjetListe.skin.flatDesign,
				boutons: [
					{ genre: ObjetListe_1.ObjetListe.typeBouton.deployer },
					{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher },
				],
			},
		};
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur("incidents.selectLieux"),
			largeur: 450,
			hauteur: 450,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		aInstance.paramsListe = lParamsListe;
	}
	_initFenetreSignalement(aInstance) {
		const lAvecCreationMotifs = this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.creerMotifIncidentPunitionSanction,
		);
		const lParamsListe = {
			avecLigneCreation: !!lAvecCreationMotifs,
			editable: true,
		};
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"incidents.signalement.titre",
			),
			largeur: 500,
			hauteur: 700,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			modeActivationBtnValider:
				aInstance.modeActivationBtnValider.auMoinsUnEltSelectionne,
		});
		aInstance.paramsListe = lParamsListe;
	}
	_initFenetreSelectPublic(aInstance) {
		aInstance.setOptions({ selectionCumul: false });
	}
	_initFenetreSelectPunition(aInstance) {
		const lParamsListe = {
			tailles: ["100%"],
			editable: false,
			optionsListe: { skin: ObjetListe_1.ObjetListe.skin.flatDesign },
		};
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"incidents.selectMesuresDisciplinaire",
			),
			largeur: 350,
			hauteur: 275,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		aInstance.paramsListe = lParamsListe;
	}
	_initFenetreActions(aInstance) {
		const lParamsListe = {
			editable: false,
			optionsListe: { skin: ObjetListe_1.ObjetListe.skin.flatDesign },
		};
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur("fenetreActions.titre"),
			largeur: 350,
			hauteur: 650,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			modeActivationBtnValider:
				aInstance.modeActivationBtnValider.toujoursActifs,
		});
		aInstance.paramsListe = lParamsListe;
	}
	_evntListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				if (
					!this.incident ||
					!this.nrIncidentSelectionne ||
					this.nrIncidentSelectionne !==
						this.incidents.getNumero(aParametres.ligne) ||
					this.actionValidationIncidents
				) {
					this.actionValidationIncidents = false;
					this.incident = this.incidents.get(aParametres.ligne);
					this._protagoniste = undefined;
					this._actualiserIncident();
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this.incidentEnCreation = this._initNouveauIncident();
				if (!this.tempMotifs) {
					this.tempMotifs = MethodesObjet_1.MethodesObjet.dupliquer(
						this.donneesSaisie.motifs,
					);
				}
				if (!!this.tempMotifs) {
					this.tempMotifs.parcourir((D) => {
						if (!!D.cmsActif) {
							D.cmsActif = false;
						}
					});
				}
				this.getInstance(this.identFenetreSignalement).setDonneesSignalement({
					motifs: this.tempMotifs,
					incident: this.incidentEnCreation,
					avecValidation: false,
					incidents: MethodesObjet_1.MethodesObjet.dupliquer(this.incidents),
					listePJ: this.listePJ,
					listeSousCategorieDossier: MethodesObjet_1.MethodesObjet.dupliquer(
						this.donneesSaisie.listeSousCategorieDossier,
					),
				});
				return Enumere_EvenementListe_1.EGenreEvenementListe.Creation;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				if (!this.incident) {
					break;
				}
				switch (aParametres.idColonne) {
					case DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.motifs:
						this.getInstance(this.identCMS_Motifs).surCellule(
							Enumere_Event_1.EEvent.SurClick,
						);
						break;
					case DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.lieu:
						this.getInstance(this.identFenetreLieux).setDonnees({
							avecMonoSelection: true,
							listeRessources: this.donneesSaisie.lieux,
						});
						break;
					default:
						break;
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				if (
					aParametres.idColonne !==
					DonneesListe_Incidents_1.DonneesListe_Incidents.colonnes.motifs
				) {
					this.incident = this.incidents.get(aParametres.ligne);
					this._actualiserIncident();
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresSuppression:
				this.incident = undefined;
				this._actualiserIncident();
				break;
			default:
				break;
		}
	}
	_actualiserIncident() {
		if (this.incident) {
			this.nrIncidentSelectionne = this.incident.getNumero();
			if (this.nrIncidentSelectionne) {
				this.etatUtilSco.setNrIncidentSelectionne(this.nrIncidentSelectionne);
			}
			const lLibelle = ObjetTraduction_1.GTraductions.getValeur(
				"incidents.declaration",
				[
					ObjetDate_1.GDate.formatDate(
						this.incident.dateheure,
						"%JJ/%MM/%AAAA",
					),
				],
			);
			this._setTexteBandeau(lLibelle);
			if (this.incident && this.incident.lieu) {
				this._indiceLieu = this.donneesSaisie.lieux.getIndiceParElement(
					this.incident.lieu,
				);
			} else {
				this._indiceLieu = -1;
			}
			$("#" + this.idReponse.escapeJQ() + "_detail").show();
			const lAvecSaisie =
				this._autorisations.saisie &&
				this.incident &&
				this.incident.estEditable;
			if (lAvecSaisie) {
				this.getInstance(this.identProtagonistes).setOptionsListe({
					listeCreations: 1,
					avecLigneCreation: true,
				});
			} else {
				this.getInstance(this.identProtagonistes).setOptionsListe({
					listeCreations: null,
					avecLigneCreation: false,
				});
			}
			this.getInstance(this.identProtagonistes).setDonnees(
				new DonneesListe_Protagonistes_1.DonneesListe_Protagonistes(
					this.incident.protagonistes,
					{
						avecSaisie: lAvecSaisie,
						typesProtagonistes: this.donneesSaisie.typesProtagonistes,
						evenementMenuContextuel:
							this._evenementSurMenuContextuelListe.bind(this),
						saisiePunition: this._autorisations.saisiePunitions.saisie,
					},
				),
			);
			this.getInstance(this.identDate).setDonnees(this.incident.dateheure);
			this.getInstance(this.identDate).setActif(lAvecSaisie);
			this.getInstance(this.identCMS_Motifs).setActif(lAvecSaisie);
			this.getInstance(this.identCMS_Motifs).setDonnees(
				this.incident.listeMotifs,
				true,
			);
			const lListePJ = this.incident.documents
				? this.incident.documents
				: new ObjetListeElements_1.ObjetListeElements();
			this.getInstance(this.identSelecteurPJ).setActif(lAvecSaisie);
			this.getInstance(this.identSelecteurPJ).setDonnees({
				listePJ: lListePJ,
				listeTotale: new ObjetListeElements_1.ObjetListeElements(),
				idContextFocus: this.Nom,
			});
		} else {
			this.nrIncidentSelectionne = null;
			this.etatUtilSco.setNrIncidentSelectionne(null);
			$("#" + this.idReponse.escapeJQ() + "_detail").hide();
			this._setTexteBandeau(
				ObjetTraduction_1.GTraductions.getValeur("incidents.selectionnez"),
			);
		}
	}
	_evntProtagonistes(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				if (this.incident) {
					this._protagoniste = aParametres.article;
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				switch (aParametres.idColonne) {
					case DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.colonnes
						.avecSanction:
						if (aParametres.article.avecSanction) {
							this.applicationSco.getMessage().afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"incidents.protagonistes.msgConfSuppr",
								),
								callback: (aGenreAction) => {
									if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
										aParametres.article.avecSanction = false;
										this._evntFenetreSelectPunition(1, 0, true);
										this.getInstance(this.identProtagonistes).actualiser();
									}
								},
							});
						} else {
							this._afficherFenetreSelectionPunition();
						}
						break;
					case DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.colonnes
						.sansSanction:
						if (aParametres.article.avecSanction) {
							this.applicationSco.getMessage().afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"incidents.protagonistes.msgConfSuppr",
								),
								callback: (aGenreAction) => {
									if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
										aParametres.article.sansSanction = true;
										aParametres.article.avecSanction = false;
										this._evntFenetreSelectPunition(1, 0, true);
										this.getInstance(this.identProtagonistes).actualiser();
									}
								},
							});
						} else {
							aParametres.article.sansSanction =
								!aParametres.article.sansSanction;
							aParametres.article.avecSanction = false;
							this._evntFenetreSelectPunition(1, 0, true);
							this.getInstance(this.identProtagonistes).actualiser();
						}
						break;
					case DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.colonnes
						.mesure: {
						this._afficherFenetreSelectionPunition();
						break;
					}
					case DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.colonnes
						.date:
						if (this._protagoniste && this._protagoniste.mesure) {
							if (
								this._protagoniste.mesure &&
								this._protagoniste.mesure.nature.getGenre() ===
									TypeGenrePunition_1.TypeGenrePunition.GP_ExclusionCours &&
								!this._protagoniste.mesure.donneesSaisie
							) {
								this._requeteDonneesSaisieMesure();
							} else {
								this._evenementOuvertureMesureIncident();
							}
						}
						break;
					default:
						break;
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				if (
					aParametres.idColonne ===
						DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.colonnes
							.pubDossier ||
					aParametres.idColonne ===
						DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.colonnes
							.publication
				) {
					this.incident.setEtat(Enumere_Etat_1.EGenreEtat.FilsModification);
					this.setEtatSaisie(true);
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresSuppression:
				if (this.incident) {
					this.actualiserSuiteDonnees(false);
					this.getInstance(this.identIncidents).actualiser(true);
					this.incident.setEtat(Enumere_Etat_1.EGenreEtat.FilsModification);
					this.setEtatSaisie(true);
				}
				break;
			default:
				break;
		}
	}
	_requeteDonneesSaisieMesure() {
		new ObjetRequeteIncidentDonneesSaisieMesure_1.ObjetRequeteIncidentDonneesSaisieMesure(
			this,
			this._actionApresRequeteDonneesSaisieMesure,
		).lancerRequete({
			incident: this.incident,
			protagoniste: this._protagoniste.protagoniste,
		});
	}
	_actionApresRequeteDonneesSaisieMesure(aJSON) {
		if (aJSON.durees) {
			this._protagoniste.mesure.donneesSaisie = { durees: aJSON.durees };
			this._protagoniste.mesure.donneesSaisie.accompagnateurs =
				new ObjetListeElements_1.ObjetListeElements();
			this._protagoniste.mesure.donneesSaisie.accompagnateurs.addElement(
				new ObjetElement_1.ObjetElement("", undefined, -1),
			);
			this._protagoniste.mesure.donneesSaisie.accompagnateurs.add(
				aJSON.accompagnateurs,
			);
		}
		this._evenementOuvertureMesureIncident();
	}
	_evenementOuvertureMesureIncident() {
		let lTitre = "";
		if (this._protagoniste && this._protagoniste.mesure) {
			lTitre =
				this._protagoniste.mesure.nature.getLibelle() +
				" " +
				ObjetTraduction_1.GTraductions.getValeur("De").toLowerCase() +
				" " +
				this._protagoniste.protagoniste.getLibelle();
		}
		const lFenetreMesureIncident =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_MesureIncident_1.ObjetFenetre_MesureIncident,
				{
					pere: this,
					evenement: this._evntFenetreMesureIncident,
					initialiser: (aInstanceFenetre) => {
						aInstanceFenetre.setOptionsFenetre({
							titre: lTitre,
							largeur: 620,
							hauteur: 270,
							listeBoutons: [
								ObjetTraduction_1.GTraductions.getValeur("Fermer"),
							],
						});
					},
				},
			);
		lFenetreMesureIncident.setDonnees({
			mesure: this._protagoniste.mesure,
			listePJ: this.listePJ,
			avecDossier:
				this._protagoniste.dossier !== null &&
				this._protagoniste.dossier !== undefined,
		});
	}
	_evenementSurMenuContextuelListe(aItemMenuContextuel) {
		this._typeProtagoniste = aItemMenuContextuel.data;
		let lGenre = Enumere_Ressource_1.EGenreRessource.Aucune;
		switch (aItemMenuContextuel.getNumero()) {
			case DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.genreAction
				.ajout_Auteur:
				lGenre = Enumere_Ressource_1.EGenreRessource.Eleve;
				break;
			case DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.genreAction
				.ajout_Victime_Eleve:
				lGenre = Enumere_Ressource_1.EGenreRessource.Eleve;
				break;
			case DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.genreAction
				.ajout_Victime_Professeur:
				lGenre = Enumere_Ressource_1.EGenreRessource.Enseignant;
				break;
			case DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.genreAction
				.ajout_Victime_Personnel:
				lGenre = Enumere_Ressource_1.EGenreRessource.Personnel;
				break;
			case DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.genreAction
				.ajout_Temoin_Eleve:
				lGenre = Enumere_Ressource_1.EGenreRessource.Eleve;
				break;
			case DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.genreAction
				.ajout_Temoin_Professeur:
				lGenre = Enumere_Ressource_1.EGenreRessource.Enseignant;
				break;
			case DonneesListe_Protagonistes_1.DonneesListe_Protagonistes.genreAction
				.ajout_Temoin_Personnel:
				lGenre = Enumere_Ressource_1.EGenreRessource.Personnel;
				break;
			default:
				this._typeProtagoniste = null;
				break;
		}
		if (this._typeProtagoniste) {
			new ObjetRequeteListePublics_1.ObjetRequeteListePublics(
				this,
				this._evntListePublicApresRequete.bind(this),
			).lancerRequete({
				genres: [lGenre],
				sansFiltreSurEleve: true,
				avecFonctionPersonnel: true,
			});
		}
	}
	_evnCMSMotifs(aNumeroBouton, aListeDonnees, aListeTot) {
		if (aNumeroBouton === 1) {
			const lArrInitial = this.incident.listeMotifs.getTableauNumeros();
			const lArrNew = aListeDonnees.getTableauNumeros();
			let lLibelleAChange = false;
			for (let i = 0; i < aListeDonnees.count(); i++) {
				const lMotif = aListeDonnees.get(i);
				const lMotifIncident = this.incident.listeMotifs.getElementParNumero(
					lMotif.getNumero(),
				);
				if (
					lMotifIncident &&
					lMotifIncident.getLibelle() !== lMotif.getLibelle()
				) {
					lLibelleAChange = true;
				}
			}
			if (
				!MethodesTableau_1.MethodesTableau.inclus(lArrInitial, lArrNew) ||
				!MethodesTableau_1.MethodesTableau.inclus(lArrNew, lArrInitial) ||
				lLibelleAChange
			) {
				const lAvecMotifFaitDeViolenceAvant =
					this.incident.listeMotifs.getIndiceElementParFiltre((aElement) => {
						return aElement.estFaitDeViolence;
					}) > -1;
				const lAvecMotifDossierObligatoireInitial =
					this.incident.listeMotifs.getIndiceElementParFiltre((aElement) => {
						return aElement.dossierObligatoire;
					}) > -1;
				this.incident.listeMotifs = aListeDonnees;
				const lAvecMotifDossierObligatoire =
					this.incident.listeMotifs.getIndiceElementParFiltre((aElement) => {
						return aElement.dossierObligatoire;
					}) > -1;
				const lAvecMotifFaitDeViolenceApres =
					this.incident.listeMotifs.getIndiceElementParFiltre((aElement) => {
						return aElement.estFaitDeViolence;
					}) > -1;
				if (lAvecMotifFaitDeViolenceAvant !== lAvecMotifFaitDeViolenceApres) {
					if (lAvecMotifFaitDeViolenceAvant === this.incident.faitDeViolence) {
						this.incident.faitDeViolence = lAvecMotifFaitDeViolenceApres;
					}
				}
				const lAvecMotifPublicationDefaut =
					this.incident.listeMotifs.getIndiceElementParFiltre((aElement) => {
						return aElement.publication;
					}) > -1;
				this.incident.protagonistes.parcourir((aElement) => {
					if (!lAvecMotifDossierObligatoire) {
						aElement.dossier = null;
					} else if (
						lAvecMotifDossierObligatoireInitial !== lAvecMotifDossierObligatoire
					) {
						aElement.dossier = new ObjetElement_1.ObjetElement("");
						aElement.dossier.publication = false;
						aElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
					if (!aElement.publication && lAvecMotifPublicationDefaut) {
						aElement.publication = lAvecMotifPublicationDefaut;
						aElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				});
				this.incident.avecModifMotif = true;
				this.incident.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.setEtatSaisie(true);
				this.getInstance(this.identIncidents).actualiser(true);
				this.getInstance(this.identProtagonistes).actualiser(true);
			}
			if (!!aListeTot) {
				this.donneesSaisie.motifs = aListeTot;
				this.donneesSaisie.motifs.parcourir((aElement) => {
					aElement.cmsActif = false;
				});
			}
		} else {
			this.getInstance(this.identCMS_Motifs).setDonnees(
				this.incident.listeMotifs,
			);
		}
	}
	_evntSurDate(aDate) {
		const lDate = new Date(
			aDate.getFullYear(),
			aDate.getMonth(),
			aDate.getDate(),
			this.incident.dateheure.getHours(),
			this.incident.dateheure.getMinutes(),
		);
		this.incident.dateheure = lDate;
		this.incident.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.setEtatSaisie(true);
		this.getInstance(this.identIncidents).actualiser(true);
	}
	_evntSelecteurPJ(aParam) {
		switch (aParam.evnt) {
			case ObjetSelecteurPJCP_1.ObjetSelecteurPJCP.genreEvnt.selectionPJ:
				if (this.incident) {
					this.listePJ.addElement(aParam.fichier);
					this.incident.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					this.setEtatSaisie(true);
				}
				break;
			case ObjetSelecteurPJCP_1.ObjetSelecteurPJCP.genreEvnt.suppressionPJ:
				if (this.incident) {
					this.incident.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					this.setEtatSaisie(true);
				}
				break;
			default:
				break;
		}
	}
	_evntFenetreLieux(aGenreBouton, aListeSelection) {
		if (
			aGenreBouton === 1 &&
			this.incident &&
			aListeSelection &&
			aListeSelection.count() > 0
		) {
			const lLieux = aListeSelection.get(0);
			this._indiceLieu = this.donneesSaisie.lieux.getIndiceParElement(lLieux);
			if (
				lLieux.getNumero() !== this.incident.lieu.getNumero() &&
				lLieux.AvecSelection !== false
			) {
				this.incident.lieu = lLieux;
				this.incident.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.setEtatSaisie(true);
				this.getInstance(this.identIncidents).actualiser(true);
				this._actualiserIncident();
				this.$refreshSelf();
			}
		}
	}
	_evntFenetreSelectActions(aGenreBouton) {
		if (aGenreBouton === 1) {
			let actionsValidees = new ObjetListeElements_1.ObjetListeElements();
			this.tempActions.parcourir((aElement) => {
				if (aElement.cmsActif === true) {
					actionsValidees.add(aElement);
				}
			});
			this.incident.actionsEnvisagees = actionsValidees;
			this.incident.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.setEtatSaisie(true);
		}
	}
	_evntFenetreSignalement(aGenreBouton, aSelection, aAvecChangementListe) {
		if (aGenreBouton === 1) {
			if (aAvecChangementListe) {
				this.donneesSaisie.motifs = MethodesObjet_1.MethodesObjet.dupliquer(
					this.tempMotifs,
				);
				this.donneesSaisie.motifs.parcourir((aElement) => {
					aElement.cmsActif = false;
				});
				this.getInstance(this.identIncidents).actualiser(true);
			}
			this.recupererDonnees();
		} else {
			if (!!this.nrIncidentSelectionne) {
				const lIndiceEff = this.incidents.getIndiceParNumeroEtGenre(
					this.nrIncidentSelectionnee,
				);
				if (lIndiceEff > -1) {
					this.incident = this.incidents.get(lIndiceEff);
					this._actualiserIncident();
				}
			}
		}
	}
	_genreRessourceToGenreIndividuAuteur(aGenreRessource) {
		switch (aGenreRessource) {
			case Enumere_Ressource_1.EGenreRessource.Eleve:
				return TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur.GIA_Eleve;
			case Enumere_Ressource_1.EGenreRessource.Enseignant:
				return TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur.GIA_Professeur;
			case Enumere_Ressource_1.EGenreRessource.Personnel:
				return TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur.GIA_Personnel;
			default:
				break;
		}
	}
	_evntListePublicApresRequete(aDonnees) {
		this._evntDeclencherFenetreRessource({
			listeComplet: aDonnees.listePublic,
			listeSelectionnee: new ObjetListeElements_1.ObjetListeElements(),
			genre: aDonnees.genres[0],
		});
	}
	_evntDeclencherFenetreRessource(aDonnees) {
		const lInstance = this.getInstance(this.identFenetreSelectPublic);
		if (
			aDonnees.genre === Enumere_Ressource_1.EGenreRessource.Eleve ||
			aDonnees.genre === Enumere_Ressource_1.EGenreRessource.Responsable
		) {
			const lListeCumuls = new ObjetListeElements_1.ObjetListeElements();
			lListeCumuls.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("actualites.Cumul.Classe"),
					0,
					ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.classe,
					0,
				),
			);
			lListeCumuls.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("actualites.Cumul.Groupe"),
					0,
					ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.groupe,
					1,
				),
			);
			lListeCumuls.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"actualites.Cumul.Alphabetique",
					),
					0,
					ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.initial,
					2,
				),
			);
			lInstance.setListeCumuls(lListeCumuls);
		}
		if (aDonnees.genre === Enumere_Ressource_1.EGenreRessource.Personnel) {
			const lListeCumuls = new ObjetListeElements_1.ObjetListeElements();
			lListeCumuls.add(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_SelectionPublic.Cumul.Aucun",
					),
					0,
					ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.sans,
					0,
				),
			);
			lListeCumuls.add(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("actualites.Cumul.Fonction"),
					0,
					ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.fonction,
					1,
				),
			);
			lInstance.setListeCumuls(lListeCumuls);
			lInstance.setOptions({
				getInfosSuppZonePrincipale(aParams) {
					return lInstance.getGenreCumul() !==
						ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic
							.fonction
						? UtilitaireMessagerie_1.UtilitaireMessagerie.getLibelleSuppListePublics(
								aParams.article,
							)
						: "";
				},
			});
		}
		if (aDonnees.genreCumul) {
			lInstance.setGenreCumulActif(aDonnees.genreCumul);
		}
		lInstance.setSelectionObligatoire(false);
		lInstance.setDonnees({
			listeRessources: aDonnees.listeComplet,
			listeRessourcesSelectionnees: MethodesObjet_1.MethodesObjet.dupliquer(
				aDonnees.listeSelectionnee,
			),
			genreRessource: aDonnees.genre,
			titre:
				Enumere_Ressource_1.EGenreRessourceUtil.getTitreFenetreSelectionRessource(
					aDonnees.genre,
				),
			estGenreRessourceDUtilisateurConnecte:
				Enumere_Ressource_1.EGenreRessourceUtil.correspondAuGenreUtilisateurEspaceCourant(
					aDonnees.genre,
				),
		});
	}
	_evenementFenetreIndividu(aGenreRessource, aListeRessourcesSelectionnees) {
		let lAvecChangement = false;
		let lExisteDeja = false;
		const lArrExistant = [];
		if (
			this.incident &&
			aListeRessourcesSelectionnees &&
			aListeRessourcesSelectionnees.count() > 0
		) {
			for (
				let i = 0, max = aListeRessourcesSelectionnees.count();
				i < max;
				i++
			) {
				let lRessource = aListeRessourcesSelectionnees.get(i);
				const lNrRessource = lRessource.getNumero();
				const lGenreRessource = this._genreRessourceToGenreIndividuAuteur(
					lRessource.getGenre(),
				);
				const lIndice = this.incident.protagonistes.getIndiceElementParFiltre(
					(aElement) => {
						const lNumeroEgal =
							aElement.protagoniste.getNumero() === lNrRessource;
						const lGenreEgal =
							aElement.protagoniste.getGenre() === lGenreRessource;
						return lNumeroEgal && lGenreEgal && aElement.existe();
					},
				);
				if (lIndice === -1) {
					let lProtagoniste = this._initNouveauProtagoniste(
						this._typeProtagoniste,
						lRessource,
					);
					lProtagoniste.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
					this.incident.protagonistes.addElement(lProtagoniste);
					lAvecChangement = true;
				} else {
					lExisteDeja = true;
					lArrExistant.push(lRessource.getLibelle());
				}
			}
			if (lExisteDeja) {
				this.applicationSco
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message:
							ObjetTraduction_1.GTraductions.getValeur(
								"incidents.protagonistes.existent",
							) +
							"<br>" +
							lArrExistant.join(", "),
					});
			}
		}
		if (lAvecChangement) {
			this.actualiserSuiteDonnees(false);
			this.incident.setEtat(Enumere_Etat_1.EGenreEtat.FilsModification);
			this.getInstance(this.identIncidents).actualiser(true);
			this.getInstance(this.identProtagonistes).actualiser();
			this.setEtatSaisie(true);
		}
	}
	_evntFenetreSelectPunition(aGenreBouton, aSelection, aSansModifCoche) {
		if (aGenreBouton === 1 && this.incident && this._protagoniste) {
			const lNature = this.donneesSaisie.mesuresDisciplinaires.get(aSelection);
			if (
				!this.incident.mesure ||
				lNature.getNumero() !== this.incident.mesure.nature.getNumero()
			) {
				if (!aSansModifCoche) {
					this._protagoniste.avecSanction = true;
					this._protagoniste.sansSanction = false;
				}
				this._protagoniste.mesure = this._initNouveauMesure(lNature);
				if (
					lNature.getGenre() ===
					TypeGenrePunition_1.TypeGenrePunition.GP_ExclusionCours
				) {
					this._protagoniste.strDate = ObjetDate_1.GDate.formatDate(
						this.incident.dateheure,
						"%JJ/%MM/%AAAA",
					);
				} else {
					this._protagoniste.strDate = "";
				}
				if (lNature.getGenre() === -1) {
					this._protagoniste.avecEditionDate = false;
					this._protagoniste.mesure.setEtat(
						Enumere_Etat_1.EGenreEtat.Suppression,
					);
				} else {
					this._protagoniste.avecEditionDate = true;
					this._protagoniste.mesure.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				}
				this._protagoniste.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.incident.setEtat(Enumere_Etat_1.EGenreEtat.FilsModification);
				this.setEtatSaisie(true);
				this.actualiserSuiteDonnees();
				this.getInstance(this.identProtagonistes).actualiser(true);
			}
		}
	}
	actualiserSuiteDonnees(aAvecActualisationListe = true) {
		var _a, _b;
		const lListeProtaAuteur =
			(_b =
				(_a = this.incident) === null || _a === void 0
					? void 0
					: _a.protagonistes) === null || _b === void 0
				? void 0
				: _b.getListeElements(
						(aProtagoniste) =>
							aProtagoniste.getGenre() ===
								TypeGenreStatutProtagonisteIncident_1
									.TypeGenreStatutProtagonisteIncident.GSP_Auteur &&
							aProtagoniste.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression,
					);
		const lSuiteDonnees =
			lListeProtaAuteur === null || lListeProtaAuteur === void 0
				? void 0
				: lListeProtaAuteur
						.getTableau((aProtagoniste) => {
							var _a, _b;
							return (
								((_b =
									(_a = aProtagoniste.mesure) === null || _a === void 0
										? void 0
										: _a.nature) === null || _b === void 0
									? void 0
									: _b.getLibelle()) ||
								ObjetTraduction_1.GTraductions.getValeur(
									"incidents.sansDecision",
								)
							);
						})
						.filter((a) => a)
						.join(", ");
		if (lSuiteDonnees) {
			this.incident.suitesDonnees = lSuiteDonnees;
		}
		const lHintReponseApprotes =
			lListeProtaAuteur === null || lListeProtaAuteur === void 0
				? void 0
				: lListeProtaAuteur
						.getTableau((aProtagoniste) => {
							var _a, _b;
							return `${aProtagoniste.nom}: ${((_b = (_a = aProtagoniste.mesure) === null || _a === void 0 ? void 0 : _a.nature) === null || _b === void 0 ? void 0 : _b.getLibelle()) || ObjetTraduction_1.GTraductions.getValeur("incidents.sansDecision")}`;
						})
						.join("\n");
		if (lHintReponseApprotes) {
			this.incident.hintReponsesApportes = lHintReponseApprotes;
		}
		if (aAvecActualisationListe) {
			this.getInstance(this.identIncidents).actualiser(true);
		}
	}
	_evntFenetreMesureIncident(aGenreBouton, aParam) {
		if (aParam.mesure.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun) {
			this._protagoniste.mesure.duree = aParam.mesure.duree;
			this._protagoniste.mesure.accompagnateur = aParam.mesure.accompagnateur;
			this._protagoniste.mesure.travailAFaire = aParam.mesure.travailAFaire;
			this._protagoniste.mesure.documentsTAF = aParam.mesure.documentsTAF;
			this._protagoniste.mesure.publierTafApresDebutRetenue =
				aParam.mesure.publierTafApresDebutRetenue;
			if (
				aParam.mesure.getGenre() ===
				Enumere_Ressource_1.EGenreRessource.Punition
			) {
				this._protagoniste.mesure.datePublication =
					aParam.mesure.datePublication;
			} else {
				this._protagoniste.mesure.publication = aParam.mesure.publication;
			}
			this._protagoniste.mesure.publicationDossierVS =
				aParam.mesure.publicationDossierVS;
			this._protagoniste.mesure.dateProgrammation =
				aParam.mesure.dateProgrammation;
			if (
				this._protagoniste.mesure.nature.getGenre() ===
					TypeGenrePunition_1.TypeGenrePunition.GP_Devoir &&
				this._protagoniste.mesure.dateProgrammation
			) {
				this._protagoniste.strDate = ObjetDate_1.GDate.formatDate(
					this._protagoniste.mesure.dateProgrammation,
					"%JJ/%MM/%AAAA",
				);
			}
			this._protagoniste.mesure.setEtat(aParam.mesure.Etat);
			this._protagoniste.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.incident.setEtat(Enumere_Etat_1.EGenreEtat.FilsModification);
			this.setEtatSaisie(true);
			this.getInstance(this.identProtagonistes).actualiser(true);
		}
	}
	_getWidthDeListe() {
		let lWidth = 0;
		for (const i in this.paramColonnes) {
			const lColonne = this.paramColonnes[i];
			if (lColonne.visible !== false) {
				lWidth += this._getWidthDeColonne(lColonne.id) + 17;
			}
		}
		lWidth += 25;
		return lWidth;
	}
	composeBandeauDroite() {
		const T = [];
		T.push(`<div class="div-header fluid-bloc">`);
		T.push(`<h2 id="${this.idBandeauDroite}_Texte"></h2>`);
		T.push(`</div>`);
		return T.join("");
	}
	_composeTitreSection(aMessage, aAvecMargeHaut) {
		const T = [];
		T.push(
			`<div class="as-header-bullet m-right-l m-bottom-l${aAvecMargeHaut ? ` m-top-l` : ``}">`,
		);
		T.push(`  <h3>${aMessage}</h3>`);
		T.push(`</div>`);
		return T.join("");
	}
	_composeDetail() {
		const H = [];
		H.push(`<div id="${this.idReponse}_detail">`);
		H.push(
			this._composeTitreSection(
				ObjetTraduction_1.GTraductions.getValeur(
					"incidents.protagonistes.titre",
				),
			),
		);
		H.push(
			`<div class="p-top-l" id="${this.getNomInstance(this.identProtagonistes)}"></div>`,
		);
		H.push(
			this._composeTitreSection(
				ObjetTraduction_1.GTraductions.getValeur("incidents.circonstances"),
				true,
			),
		);
		H.push('<div id="ZoneCirconstancesIncident" class="p-bottom-l">');
		H.push(
			'<div id="ZoneAuteurGravite" class="flex-contain flex-center p-y-l">',
		);
		const lIdAuteurSignalement = GUID_1.GUID.getId();
		H.push(
			' <div class="m-right-l">',
			'<label for="',
			lIdAuteurSignalement,
			'" class="m-right m-bottom">',
			ObjetTraduction_1.GTraductions.getValeur("incidents.auteurDuSignalement"),
			"</label>",
			'<input id="',
			lIdAuteurSignalement,
			'" ie-model="auteur" type="text" ie-etatsaisie style="',
			ObjetStyle_1.GStyle.composeWidth(280),
			'" spellcheck="false" tabindex="0" />',
			"</div>",
		);
		const lIdGravite = GUID_1.GUID.getId();
		H.push(
			' <div class="m-right-l">',
			'<label for="',
			lIdGravite,
			'" class="m-right m-bottom">',
			ObjetTraduction_1.GTraductions.getValeur("incidents.gravite"),
			"</label>",
			'<input id="',
			lIdGravite,
			'" ie-model="gravite" type="text" ie-etatsaisie ie-mask="/[^1-5]/i" maxlength="1"  style="',
			ObjetStyle_1.GStyle.composeWidth(20),
			'" spellcheck="false" tabindex="0" />',
			" </div>",
		);
		H.push(
			' <ie-checkbox ie-model="getFaitDeViolence">',
			ObjetTraduction_1.GTraductions.getValeur("incidents.faitDeViolence"),
			"</ie-checkbox>",
		);
		H.push("</div>");
		H.push('<div id="ZoneDateLieu" class="flex-contain flex-center p-y-l">');
		H.push(
			'  <div class="m-right-l m-bottom">',
			'<label class="m-right m-bottom bloc-contain">',
			ObjetTraduction_1.GTraductions.getValeur("incidents.date"),
			"</label>",
			'<div id="',
			this.getNomInstance(this.identDate),
			'"></div>',
			"</div>",
		);
		const lIdLabelInput = GUID_1.GUID.getId();
		H.push(
			'  <div class="m-right-l">',
			'<label for="',
			lIdLabelInput,
			'" class="m-right m-bottom bloc-contain">',
			ObjetTraduction_1.GTraductions.getValeur("incidents.heure"),
			"</label>",
			'<input id="',
			lIdLabelInput,
			'" type="time" ie-model="heure" />',
			"</div>",
		);
		H.push(
			'  <div class="m-right-l">',
			'<label class="m-right m-bottom bloc-contain">',
			ObjetTraduction_1.GTraductions.getValeur("incidents.lieu"),
			"</label>",
			'<ie-combo ie-model="lieu"></ie-combo>',
			"</div>",
		);
		H.push("</div>");
		H.push(
			'<div id="ZoneMotifs" class="p-y-l">',
			'  <label id="',
			this.idLabelMotifs,
			'" class="bloc-contain m-bottom">',
			ObjetTraduction_1.GTraductions.getValeur("incidents.motifs"),
			"</label>",
			'  <div id="',
			this.getNomInstance(this.identCMS_Motifs),
			'"></div>',
			"</div>",
		);
		const lIdTextareaDetail = GUID_1.GUID.getId();
		H.push(
			'<div class="p-top-l">',
			'  <label for="',
			lIdTextareaDetail,
			'" class="bloc-contain m-bottom">',
			ObjetTraduction_1.GTraductions.getValeur("incidents.details"),
			"</label>",
			`<ie-textareamax id="${lIdTextareaDetail}" ie-model="details" ie-event="change->eventChange"  maxlength="${this.donneesSaisie.tailleCirconstance}" style="${ObjetStyle_1.GStyle.composeWidth(810)} ${ObjetStyle_1.GStyle.composeHeight(120)}"></ie-textareamax>`,
			"</div>",
		);
		H.push(
			'<div id="ZonePJ" class="p-y-l">',
			'<div class="pj-global-conteneur',
			!this._autorisations.saisie ? " is-disabled" : "",
			'" id="',
			this.getNomInstance(this.identSelecteurPJ),
			'"></div>',
			"</div>",
		);
		H.push(
			IE.jsx.str(
				"div",
				{ class: "p-y-l" },
				IE.jsx.str(
					"label",
					{ class: "m-y-l" },
					ObjetTraduction_1.GTraductions.getValeur("incidents.actions"),
				),
				IE.jsx.str("ie-btnselecteur", {
					"ie-model": this.jsxselectionActions.bind(this),
					class: "",
					placeholder:
						ObjetTraduction_1.GTraductions.getValeur("incidents.actions"),
					"aria-label":
						ObjetTraduction_1.GTraductions.getValeur("incidents.actions"),
					style: ObjetStyle_1.GStyle.composeWidth(320),
				}),
			),
		);
		const lIdTextareaCommentaire = GUID_1.GUID.getId();
		H.push(
			'<div class="p-y-l">',
			'  <label for="',
			lIdTextareaCommentaire,
			'" class="bloc-contain m-bottom">',
			ObjetTraduction_1.GTraductions.getValeur("incidents.commentaire"),
			"</label>",
			`<ie-textareamax id="${lIdTextareaCommentaire}" ie-model="detailActionEnvisagee" ie-event="change->eventChange"  maxlength="${this.donneesSaisie.tailleCirconstance}" style="${ObjetStyle_1.GStyle.composeWidth(810)} ${ObjetStyle_1.GStyle.composeHeight(120)}"></ie-textareamax>`,
			"</div>",
		);
		H.push("</div>");
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.actualite.avecSaisieActualite,
			)
		) {
			H.push(
				this._composeTitreSection(
					ObjetTraduction_1.GTraductions.getValeur(
						"incidents.diffuserInfoTitre",
					),
					true,
				),
			);
			H.push(
				IE.jsx.str(
					"div",
					{ class: "flex-contain flex-center p-y-l" },
					IE.jsx.str(
						"label",
						{ class: "m-right" },
						ObjetTraduction_1.GTraductions.getValeur(
							"incidents.diffuserEquipesPedagogiques",
						),
					),
					UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnDiffuserInformation(
						"boutonInformation",
						ObjetTraduction_1.GTraductions.getValeur(
							"incidents.diffuserEquipesPedagogiques",
						),
					),
					IE.jsx.str(
						"div",
						{
							class: "flex-contain flex-center p-x-l",
							"ie-display": "messageEnvoye",
						},
						IE.jsx.str(
							"label",
							{ class: "m-right" },
							ObjetTraduction_1.GTraductions.getValeur(
								"incidents.messageEnvoye",
							),
						),
						IE.jsx.str("div", {
							class: "Image_DestinataireCourrier",
							"aria-hidden": "true",
						}),
					),
				),
			);
		}
		H.push(`</div>`);
		H.push(`</div>`);
		return H.join("");
	}
	jsxselectionActions() {
		return {
			event: () => {
				this.ouvrirFenetreActions();
			},
			getLibelle: () => {
				var _a;
				let H = [];
				(_a = this.incident) === null || _a === void 0
					? void 0
					: _a.actionsEnvisagees.parcourir((D) => {
							H.push(D.getLibelle());
						});
				return H.join(", ");
			},
			getDisabled: () => {
				return (
					!this._autorisations.saisie ||
					!this.incident ||
					!this.incident.estEditable
				);
			},
		};
	}
	ouvrirFenetreActions() {
		this.tempActions = MethodesObjet_1.MethodesObjet.dupliquer(
			this.donneesSaisie.actions,
		);
		const lActionsEnvisagees = this.incident.actionsEnvisagees;
		this.tempActions.parcourir((D) => {
			lActionsEnvisagees.parcourir((lActions) => {
				if (D.getNumero() === lActions.getNumero()) {
					D.cmsActif = true;
				}
			});
		});
		const lDonneesListe = new DonneesListe_Actions_1.DonneesListe_Actions_Fd(
			this.tempActions,
		);
		this.getInstance(this.identFenetreSelectActions).setDonnees(lDonneesListe);
	}
	getParametresRequetesIncidents() {
		if (!!this.donnees.classes) {
			this.donnees.classes.setSerialisateurJSON({ ignorerEtatsElements: true });
		}
		return { classes: this.donnees.classes };
	}
	_actionApresRequeteListesSaisiesPourIncidents(aJSON) {
		if (aJSON.lieux) {
			this.donneesSaisie.lieux = aJSON.lieux;
			this.donneesSaisie.lieux.insererElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("Aucune"),
					undefined,
					Enumere_Ressource_1.EGenreRessource.Aucune,
				),
				0,
			);
		}
		if (aJSON.motifs) {
			this.donneesSaisie.motifs = aJSON.motifs;
		}
		if (aJSON.listeSousCategorieDossier) {
			this.donneesSaisie.listeSousCategorieDossier =
				aJSON.listeSousCategorieDossier;
		}
		if (aJSON.actions) {
			this.donneesSaisie.actions = aJSON.actions;
		}
		if (aJSON.typesProtagonistes) {
			this.donneesSaisie.typesProtagonistes = aJSON.typesProtagonistes;
		}
		if (aJSON.punitions) {
			aJSON.punitions.trier();
			this.donneesSaisie.mesuresDisciplinaires = aJSON.punitions;
			this.donneesSaisie.mesuresDisciplinaires.insererElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"incidents.protagonistes.enAttente",
					),
					null,
					-1,
				),
				0,
			);
		}
		new ObjetRequeteIncidents_1.ObjetRequeteIncidents(
			this,
			this._actionApresRequeteIncidents,
		).lancerRequete(this.getParametresRequetesIncidents());
	}
	_actionApresRequeteIncidents(aJSON) {
		this.incidents = aJSON.incidents;
		this.incidents.setTri([
			ObjetTri_1.ObjetTri.init(
				"dateheure",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
		]);
		this.incidents.trier();
		const lIndiceEff = this.incidents.getIndiceParNumeroEtGenre(
			this.nrIncidentSelectionnee,
		);
		if (!!this.nrIncidentSelectionne && lIndiceEff > -1) {
			this.incident = this.incidents.get(lIndiceEff);
		}
		this.getInstance(this.identIncidents).setDonnees(
			new DonneesListe_Incidents_1.DonneesListe_Incidents(
				this.incidents,
				this.uniquementMesIncidents,
				this._autorisations.saisie,
				this.uniquementNonRegle,
			),
			lIndiceEff,
		);
		if (this.incident) {
			this._actualiserIncident();
			if (this.demandeOuvertureFenetreEditionInformation) {
				this.demandeOuvertureFenetreEditionInformation = false;
				this.ouvrirFenetreEditionInformation();
			}
		}
	}
	_initNouveauIncident() {
		const lIncident = new ObjetElement_1.ObjetElement(
			"",
			null,
			Enumere_Ressource_1.EGenreRessource.Incident,
		);
		lIncident.estRapporteur = true;
		lIncident.estEditable = true;
		lIncident.avecEditDate = true;
		lIncident.avecEditHeure = true;
		lIncident.avecEditMotifs = true;
		lIncident.avecEditLieu = true;
		lIncident.avecEditDescription = true;
		lIncident.rapporteur = this.etatUtilSco.getUtilisateur();
		lIncident.protagonistes = new ObjetListeElements_1.ObjetListeElements();
		lIncident.lieu = new ObjetElement_1.ObjetElement("");
		lIncident.gravite = 1;
		lIncident.dateheure = ObjetDate_1.GDate.getDateHeureCourante();
		const lDate = new Date();
		lIncident.dateheure.setHours(lDate.getHours(), lDate.getMinutes());
		lIncident.messageEnvoye = false;
		lIncident.actionsEnvisagees = new ObjetListeElements_1.ObjetListeElements();
		lIncident.listeMotifs = new ObjetListeElements_1.ObjetListeElements();
		lIncident.documents = new ObjetListeElements_1.ObjetListeElements();
		return lIncident;
	}
	_initNouveauProtagoniste(aElementTypeProtagoniste, aRessource) {
		if (!this.incident) {
			return null;
		}
		const lProtagoniste = new ObjetElement_1.ObjetElement(
			aElementTypeProtagoniste.getLibelle(),
			null,
			aElementTypeProtagoniste.getGenre(),
		);
		const lEstTypeAuteur =
			lProtagoniste.getGenre() ===
			TypeGenreStatutProtagonisteIncident_1.TypeGenreStatutProtagonisteIncident
				.GSP_Auteur;
		lProtagoniste.protagoniste = new ObjetElement_1.ObjetElement(
			aRessource.getLibelle(),
			aRessource.getNumero(),
			this._genreRessourceToGenreIndividuAuteur(aRessource.getGenre()),
		);
		lProtagoniste.nom = aRessource.getLibelle();
		switch (aRessource.getGenre()) {
			case Enumere_Ressource_1.EGenreRessource.Eleve:
				if (aRessource.classes) {
					lProtagoniste.nom +=
						" (" + aRessource.classes.getTableauLibelles().join(", ") + ")";
				}
				break;
			case Enumere_Ressource_1.EGenreRessource.Enseignant:
				lProtagoniste.nom +=
					" (" +
					ObjetTraduction_1.GTraductions.getValeur("incidents.professeur") +
					")";
				break;
			case Enumere_Ressource_1.EGenreRessource.Personnel:
				lProtagoniste.nom +=
					" (" +
					ObjetTraduction_1.GTraductions.getValeur("incidents.personnel") +
					")";
				break;
			default:
				break;
		}
		lProtagoniste.hintDate = "";
		lProtagoniste.strDate = "";
		lProtagoniste.avecEditionMesure = lEstTypeAuteur;
		lProtagoniste.avecEditionDate = false;
		lProtagoniste.avecEditionPublication =
			this._autorisations.publier && lEstTypeAuteur;
		const lAvecMotifDossierObligatoire =
			this.incident.listeMotifs.getIndiceElementParFiltre((aElement) => {
				return aElement.dossierObligatoire;
			}) > -1;
		const lAvecMotifPublicationDefaut =
			this.incident.listeMotifs.getIndiceElementParFiltre((aElement) => {
				return aElement.publication;
			}) > -1;
		lProtagoniste.publication = lEstTypeAuteur && lAvecMotifPublicationDefaut;
		lProtagoniste.avecEditionPublicationDossier =
			this._autorisations.publierDossierVS &&
			lAvecMotifDossierObligatoire &&
			lEstTypeAuteur;
		if (lAvecMotifDossierObligatoire && lEstTypeAuteur) {
			lProtagoniste.dossier = new ObjetElement_1.ObjetElement("");
			lProtagoniste.dossier.publication = false;
		}
		return lProtagoniste;
	}
	_initNouveauMesure(aNature) {
		if (!this.incident || !this._protagoniste || !aNature) {
			return null;
		}
		const lMesure = new ObjetElement_1.ObjetElement(
			"",
			null,
			Enumere_Ressource_1.EGenreRessource.Punition,
		);
		if (aNature.getGenre() === -1) {
			let lLibelle = "";
			if (this._protagoniste.avecSanction && !this._protagoniste.sansSanction) {
				lLibelle = ObjetTraduction_1.GTraductions.getValeur(
					"incidents.protagonistes.enAttente",
				);
			} else if (
				this._protagoniste.sansSanction &&
				!this._protagoniste.avecSanction
			) {
				lLibelle = ObjetTraduction_1.GTraductions.getValeur(
					"incidents.protagonistes.aucuneMesure",
				);
			}
			lMesure.nature = new ObjetElement_1.ObjetElement(lLibelle);
		} else {
			lMesure.nature = aNature;
		}
		lMesure.travailAFaire = "";
		lMesure.duree = 0;
		if (!!aNature.dureeParDefaut) {
			lMesure.duree = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(
				aNature.dureeParDefaut,
			);
		}
		lMesure.documentsTAF = new ObjetListeElements_1.ObjetListeElements();
		lMesure.estProgrammable = aNature.programmable;
		return lMesure;
	}
	_afficherFenetreSelectionPunition() {
		const lDonneesListe =
			new ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign(
				this.donneesSaisie.mesuresDisciplinaires,
			);
		lDonneesListe.setOptions({
			avecTri: false,
			avecBoutonActionLigne: false,
			flatDesignMinimal: true,
			avecEvnt_Selection: true,
		});
		this.getInstance(this.identFenetreSelectPunition).setDonnees(lDonneesListe);
	}
}
exports.InterfaceIncidents = InterfaceIncidents;
