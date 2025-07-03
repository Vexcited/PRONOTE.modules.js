exports.InterfacePageSaisieCarnetCorrespondance = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetFenetre_EditionObservation_1 = require("ObjetFenetre_EditionObservation");
const ObjetRequetePageSaisieCarnetCorrespondance_1 = require("ObjetRequetePageSaisieCarnetCorrespondance");
const DonneesListe_Observations_1 = require("DonneesListe_Observations");
const DonneesListe_Encouragements_1 = require("DonneesListe_Encouragements");
const DonneesListe_DefautCarnet_1 = require("DonneesListe_DefautCarnet");
const DonneesListe_AutresEvenements_1 = require("DonneesListe_AutresEvenements");
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetDate_1 = require("ObjetDate");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Message_1 = require("Enumere_Message");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const ObjetRequeteSaisieCarnetCorrespondance_1 = require("ObjetRequeteSaisieCarnetCorrespondance");
const TypeGenreObservationVS_1 = require("TypeGenreObservationVS");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const UtilitaireHtml_1 = require("UtilitaireHtml");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Date_1 = require("ObjetFenetre_Date");
class InterfacePageSaisieCarnetCorrespondance extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.idWrapper = this.Nom + "_wrapper";
		this.idMessage = this.Nom + "_message";
		this.eleveSelectionne = null;
		this.obsSelectionnee = {};
		this.publiesUniquement = false;
	}
	construireInstances() {
		this.identTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this.evenementSurDernierMenuDeroulant,
			this.initialiserTripleCombo,
		);
		if (
			this.identTripleCombo !== null &&
			this.identTripleCombo !== undefined &&
			this.getInstance(this.identTripleCombo) !== null
		) {
			this.IdPremierElement = this.getInstance(
				this.identTripleCombo,
			).getPremierElement();
		}
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieObservationsParents,
			)
		) {
			this.idListeObs = this.add(
				ObjetListe_1.ObjetListe,
				this.evenementSurListeObs,
				this.initialiserListeObs,
			);
		}
		if (
			(this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieEncouragements,
			) &&
				GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Professeur) ||
			(this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieEncouragements,
			) &&
				GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Etablissement)
		) {
			this.idListeEnc = this.add(
				ObjetListe_1.ObjetListe,
				this.evenementSurListeEnc,
				this.initialiserListeEnc,
			);
		}
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecConsultationDefautCarnet,
			)
		) {
			this.idListeDefautCarnet = this.add(
				ObjetListe_1.ObjetListe,
				this.evenementSurListeDefautCarnet,
				this.initialiserListeDefautCarnet,
			);
		}
		this.idListeAutres = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this.initialiserListeAutres,
		);
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieEncouragements,
			) ||
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieObservationsParents,
			)
		) {
			this.idFenetreEdition = this.addFenetre(
				ObjetFenetre_EditionObservation_1.ObjetFenetre_EditionObservation,
				this.evenementSurFenetreObs,
				this.initialiserEdition,
			);
		}
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone = [this.identTripleCombo];
	}
	getDefautCarnetAujourdhui() {
		let lDefautCarnetAuj = null;
		if (!!this.listeDefautCarnet) {
			this.listeDefautCarnet.parcourir((D) => {
				if (
					ObjetDate_1.GDate.estJourEgal(
						D.date,
						ObjetDate_1.GDate.getDateCourante(),
					)
				) {
					lDefautCarnetAuj = D;
					return false;
				}
			});
		}
		return lDefautCarnetAuj;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			avecDefautCarnetPublieVisible: function () {
				return aInstance.estPubliable;
			},
			cbAfficherAutresEvtPubliesUniquement: {
				getValue: function () {
					return aInstance.publiesUniquement;
				},
				setValue: function (aValeur) {
					aInstance.publiesUniquement = aValeur;
					aInstance.actualiserlisteEvenements();
				},
			},
		});
	}
	initialiserTripleCombo(aInstance) {
		aInstance.setParametres([
			Enumere_Ressource_1.EGenreRessource.Classe,
			Enumere_Ressource_1.EGenreRessource.Eleve,
		]);
	}
	initialiserListeObs(aInstance) {
		aInstance.setOptionsListe({
			colonnes: [
				{
					id: DonneesListe_Observations_1.DonneesListe_Observations.colonnes
						.date,
					taille: 125,
					titre: { libelle: ObjetTraduction_1.GTraductions.getValeur("Date") },
				},
				{
					id: DonneesListe_Observations_1.DonneesListe_Observations.colonnes
						.saisiePar,
					taille: ObjetListe_1.ObjetListe.initColonne(50, 200, 250),
					titre: {
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"CarnetCorrespondance.Redacteur",
						),
					},
				},
				{
					id: DonneesListe_Observations_1.DonneesListe_Observations.colonnes
						.commentaire,
					taille: ObjetListe_1.ObjetListe.initColonne(80, 280, 840),
					titre: {
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"CarnetCorrespondance.Observation",
						),
					},
				},
				{
					id: DonneesListe_Observations_1.DonneesListe_Observations.colonnes
						.publie,
					taille: 20,
					titre: {
						title: ObjetTraduction_1.GTraductions.getValeur(
							"CarnetCorrespondance.Publie",
						),
						classeCssImage: "Image_Publie",
					},
				},
				{
					id: DonneesListe_Observations_1.DonneesListe_Observations.colonnes
						.vue,
					taille: 60,
					titre: {
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"CarnetCorrespondance.Vue",
						),
					},
				},
			],
			colonnesCachees: [],
			hauteurAdapteContenu: true,
			listeCreations: 0,
			avecLigneCreation: true,
			titreCreation: ObjetTraduction_1.GTraductions.getValeur(
				"CarnetCorrespondance.NouvelleObservation",
			),
			piedDeListe: null,
		});
		GEtatUtilisateur.setTriListe({
			identifiant: "carnet_Obs",
			liste: aInstance,
			tri: [
				{
					id: DonneesListe_Observations_1.DonneesListe_Observations.colonnes
						.date,
					genre: Enumere_TriElement_1.EGenreTriElement.Decroissant,
				},
			],
		});
	}
	initialiserListeAutres(aInstance) {
		aInstance.setOptionsListe(this._initOptionsAutresEvenements(false));
		GEtatUtilisateur.setTriListe({
			identifiant: "carnet_Autres",
			liste: aInstance,
			tri: [
				{
					id: DonneesListe_AutresEvenements_1.DonneesListe_AutresEvenements
						.colonnes.date,
					genre: Enumere_TriElement_1.EGenreTriElement.Decroissant,
				},
			],
		});
	}
	initialiserListeEnc(aInstance) {
		aInstance.setOptionsListe({
			colonnes: [
				{
					id: DonneesListe_Encouragements_1.DonneesListe_Encouragements.colonnes
						.date,
					taille: 125,
					titre: { libelle: ObjetTraduction_1.GTraductions.getValeur("Date") },
				},
				{
					id: DonneesListe_Encouragements_1.DonneesListe_Encouragements.colonnes
						.saisiePar,
					taille: ObjetListe_1.ObjetListe.initColonne(50, 200, 250),
					titre: {
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"CarnetCorrespondance.Redacteur",
						),
					},
				},
				{
					id: DonneesListe_Encouragements_1.DonneesListe_Encouragements.colonnes
						.commentaire,
					taille: ObjetListe_1.ObjetListe.initColonne(80, 280, 840),
					titre: {
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"CarnetCorrespondance.Encouragement",
						),
					},
				},
				{
					id: DonneesListe_Encouragements_1.DonneesListe_Encouragements.colonnes
						.dateFinMiseEnEvidence,
					taille: 90,
					titre: {
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"CarnetCorrespondance.DateDeMiseEnEvidenceTitre",
						),
						nbLignes: 2,
					},
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"CarnetCorrespondance.DateDeMiseEnEvidenceHint",
					),
				},
				{
					id: DonneesListe_Encouragements_1.DonneesListe_Encouragements.colonnes
						.publie,
					taille: 20,
					titre: {
						title: ObjetTraduction_1.GTraductions.getValeur(
							"CarnetCorrespondance.Publie",
						),
						classeCssImage: "Image_Publie",
					},
				},
				{
					id: DonneesListe_Encouragements_1.DonneesListe_Encouragements.colonnes
						.vue,
					taille: 60,
					titre: {
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"CarnetCorrespondance.Vue",
						),
					},
				},
			],
			colonnesCachees: [],
			hauteurAdapteContenu: true,
			listeCreations: 0,
			avecLigneCreation: true,
			titreCreation: ObjetTraduction_1.GTraductions.getValeur(
				"CarnetCorrespondance.NouvelEncouragement",
			),
			piedDeListe: null,
		});
		GEtatUtilisateur.setTriListe({
			identifiant: "carnet_Enc",
			liste: aInstance,
			tri: [
				{
					id: DonneesListe_Encouragements_1.DonneesListe_Encouragements.colonnes
						.date,
					genre: Enumere_TriElement_1.EGenreTriElement.Decroissant,
				},
			],
		});
	}
	initialiserListeDefautCarnet(aInstance) {
		aInstance.setOptionsListe({
			colonnes: _getColonnesDefautCarnet(),
			avecLigneCreation: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieDefautCarnet,
			),
			colonnesCachees: [],
			hauteurAdapteContenu: true,
			listeCreations: 0,
			titreCreation: ObjetTraduction_1.GTraductions.getValeur(
				"CarnetCorrespondance.NouveauDefautCarnet",
			),
			piedDeListe: null,
		});
		GEtatUtilisateur.setTriListe({
			identifiant: "carnet_Enc",
			liste: aInstance,
			tri: [
				{
					id: DonneesListe_DefautCarnet_1.DonneesListe_DefautCarnet.colonnes
						.date,
					genre: Enumere_TriElement_1.EGenreTriElement.Decroissant,
				},
			],
		});
	}
	initialiserEdition(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CarnetCorrespondance.ObservationsParents",
			),
			largeur: 600,
			hauteur: 230,
		});
	}
	evenementSurListeEnc(aParametres, aGenreEvenement, I, J) {
		delete this._observationCree;
		switch (aGenreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this.getInstance(this.idFenetreEdition).setDonnees({
					observation: (this._observationCree = this.creerObservation(
						TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Encouragement,
					)),
					numeroObservation: null,
					genreEtat: null,
					typeObservation:
						TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Encouragement,
					publiable: this.estPubliable,
					avecDate: true,
				});
				this.getInstance(this.idFenetreEdition).afficher();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				this.getInstance(this.idFenetreEdition).setDonnees({
					observation: this.listeEncProfParent.get(J),
					numeroObservation: null,
					genreEtat: null,
					typeObservation:
						TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Encouragement,
					publiable: this.estPubliable,
					avecDate: true,
				});
				this.getInstance(this.idFenetreEdition).afficher();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresCreation:
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				this.getInstance(this.idListeEnc).actualiser(true);
				if (this.listeEncProfParent.existeElementPourValidation()) {
					this.setEtatSaisie(true);
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				break;
			default:
		}
	}
	evenementSurListeDefautCarnet(aParametres, aGenreEvenement) {
		switch (aGenreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				switch (aParametres.idColonne) {
					case DonneesListe_DefautCarnet_1.DonneesListe_DefautCarnet.colonnes
						.date:
						this._editerDate(aParametres.article);
						break;
					default:
						break;
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresCreation:
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				this.getInstance(this.idListeDefautCarnet).actualiser(true);
				if (this.listeDefautCarnet.existeElementPourValidation()) {
					this.setEtatSaisie(true);
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				break;
			default:
		}
	}
	evenementSurListeObs(aParametres, aGenreEvenement, I, J) {
		delete this._observationCree;
		switch (aGenreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this.getInstance(this.idFenetreEdition).setDonnees({
					observation: (this._observationCree = this.creerObservation(
						TypeGenreObservationVS_1.TypeGenreObservationVS
							.OVS_ObservationParent,
					)),
					numeroObservation: null,
					genreEtat: null,
					typeObservation:
						TypeGenreObservationVS_1.TypeGenreObservationVS
							.OVS_ObservationParent,
					publiable: this.estPubliable,
					avecDate: true,
				});
				this.getInstance(this.idFenetreEdition).afficher();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				this.getInstance(this.idFenetreEdition).setDonnees({
					observation: this.listeObsProfParent.get(J),
					numeroObservation: null,
					genreEtat: null,
					typeObservation:
						TypeGenreObservationVS_1.TypeGenreObservationVS
							.OVS_ObservationParent,
					publiable: this.estPubliable,
					avecDate: true,
				});
				this.getInstance(this.idFenetreEdition).afficher();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresCreation:
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				this.getInstance(this.idListeObs).actualiser(true);
				if (this.listeObsProfParent.existeElementPourValidation()) {
					this.setEtatSaisie(true);
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				break;
			default:
		}
	}
	evenementSurFenetreObs(aSaisie) {
		if (aSaisie) {
			if (
				this._observationCree &&
				this._observationCree.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun
			) {
				switch (this._observationCree.Genre) {
					case TypeGenreObservationVS_1.TypeGenreObservationVS
						.OVS_ObservationParent:
						this.listeObsProfParent.addElement(this._observationCree);
						break;
					case TypeGenreObservationVS_1.TypeGenreObservationVS
						.OVS_Encouragement:
						this.listeEncProfParent.addElement(this._observationCree);
						break;
					default:
						break;
				}
			}
			delete this._observationCree;
		}
		if (this.idListeObs) {
			this.evenementSurListeObs(
				null,
				Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition,
			);
		}
		if (this.idListeEnc) {
			this.evenementSurListeEnc(
				null,
				Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition,
			);
		}
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			'<div id="' +
				this.idWrapper +
				'" class="full-size" style="display:none;">',
		);
		H.push('<div class="containerCarnet">');
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieObservationsParents,
			)
		) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "colCarnet itemCarnetTitre Texte10" },
					_titreZone(
						ObjetTraduction_1.GTraductions.getValeur(
							"CarnetCorrespondance.ObservationsParents",
						),
					),
				),
			);
			H.push(
				IE.jsx.str("div", {
					class: "colCarnet m-left m-bottom-l",
					id: this.getInstance(this.idListeObs).getNom(),
				}),
			);
		}
		if (
			(this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieEncouragements,
			) &&
				GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Professeur) ||
			(this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieEncouragements,
			) &&
				GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Etablissement)
		) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "colCarnet itemCarnetTitre Texte10" },
					_titreZone(
						ObjetTraduction_1.GTraductions.getValeur(
							"CarnetCorrespondance.Encouragements",
						),
					),
				),
			);
			H.push(
				IE.jsx.str("div", {
					class: "colCarnet m-left m-bottom-l",
					id: this.getInstance(this.idListeEnc).getNom(),
				}),
			);
		}
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecConsultationDefautCarnet,
			)
		) {
			H.push(
				IE.jsx.str(
					"div",
					{
						class: "colCarnet itemCarnetTitre Texte10",
						style: "color:" + GCouleur.texte + ";",
					},
					_titreZone(
						ObjetTraduction_1.GTraductions.getValeur(
							"CarnetCorrespondance.DefautCarnet",
						),
					),
				),
			);
			H.push(
				IE.jsx.str("div", {
					class: "colCarnet m-left m-bottom-l",
					id: this.getInstance(this.idListeDefautCarnet).getNom(),
				}),
			);
		}
		H.push(
			IE.jsx.str(
				"div",
				{ class: "colCarnet itemCarnetTitre" },
				IE.jsx.str(
					"div",
					{ style: "float:right;", class: "m-bottom-s" },
					IE.jsx.str(
						"ie-checkbox",
						{ "ie-model": "cbAfficherAutresEvtPubliesUniquement" },
						ObjetTraduction_1.GTraductions.getValeur(
							"CarnetCorrespondance.UniquementLesPublies",
						),
					),
				),
				_titreZone(
					ObjetTraduction_1.GTraductions.getValeur(
						"CarnetCorrespondance.AutresEvenements",
					),
				),
			),
		);
		H.push(
			IE.jsx.str("div", {
				class: "colCarnet m-left m-bottom-l",
				id: this.getInstance(this.idListeAutres).getNom(),
			}),
		);
		H.push("</div>");
		H.push("</div>");
		H.push(
			IE.jsx.str(
				"div",
				{ id: this.idMessage },
				this.composeMessage(
					ObjetTraduction_1.GTraductions.getValeur("Message")[
						Enumere_Message_1.EGenreMessage.SelectionEleve
					],
				),
			),
		);
		return H.join("");
	}
	afficherPage() {
		this.setEtatSaisie(false);
		this.evenementSurDernierMenuDeroulant();
	}
	evenementSurDernierMenuDeroulant() {
		this.eleveSelectionne = this.applicationSco
			.getEtatUtilisateur()
			.Navigation.getRessource(Enumere_Ressource_1.EGenreRessource.Eleve);
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
		new ObjetRequetePageSaisieCarnetCorrespondance_1.ObjetRequetePageSaisieCarnetCorrespondance(
			this,
			this._reponseEvenementSurDernierMenuDeroulant,
		).lancerRequete(this.eleveSelectionne);
	}
	evenementAfficherMessage() {
		$("#" + this.idMessage.escapeJQ()).css("display", "");
		$("#" + this.idWrapper.escapeJQ()).css("display", "none");
	}
	_reponseEvenementSurDernierMenuDeroulant(aParam) {
		$("#" + this.idMessage.escapeJQ()).css("display", "none");
		$("#" + this.idWrapper.escapeJQ()).css("display", "");
		$("#" + this.idWrapper.escapeJQ()).css("height", "100%");
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
			this,
			() => {
				return {
					genreGenerationPDF:
						TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
							.CarnetDeCorrespondance,
					eleve: this.eleveSelectionne,
					classe: this.applicationSco
						.getEtatUtilisateur()
						.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Classe,
						),
					uniquementPublies: this.publiesUniquement,
				};
			},
		);
		this.estPubliable = aParam.estPubliable;
		this.listeObservations = aParam.listeObservations;
		this.listeObsProfParent = this.listeObservations.getListeElements(
			(aElement) => {
				return (
					aElement.Genre ===
					TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_ObservationParent
				);
			},
		);
		this.listeEncouragements = aParam.listeEncouragements;
		this.listeEncProfParent = this.listeEncouragements.getListeElements(
			(aElement) => {
				return (
					aElement.Genre ===
					TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Encouragement
				);
			},
		);
		this.listeDefautCarnet = this.listeObservations.getListeElements(
			(aElement) => {
				return (
					aElement.Genre ===
					TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_DefautCarnet
				);
			},
		);
		this.listeAutresEvenements = aParam.listeAutresEvenements;
		this.actualiserlisteEvenements();
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieObservationsParents,
			)
		) {
			this.getInstance(this.idListeObs).setDonnees(
				new DonneesListe_Observations_1.DonneesListe_Observations(
					this.listeObsProfParent,
				),
			);
		}
		if (
			(this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieEncouragements,
			) &&
				GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Professeur) ||
			(this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieEncouragements,
			) &&
				GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Etablissement)
		) {
			this.getInstance(this.idListeEnc).setDonnees(
				new DonneesListe_Encouragements_1.DonneesListe_Encouragements(
					this.listeEncProfParent,
				),
			);
		}
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecConsultationDefautCarnet,
			)
		) {
			this.getInstance(this.idListeDefautCarnet).setDonnees(
				new DonneesListe_DefautCarnet_1.DonneesListe_DefautCarnet(
					this.listeDefautCarnet,
					{
						callbackMenuContextuel:
							this._evenementMenuContextuelDefautDeCarnet.bind(this),
						avecEdition: this.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.absences.avecSaisieDefautCarnet,
						),
					},
				),
			);
		}
	}
	valider() {
		const lListeElement = new ObjetListeElements_1.ObjetListeElements();
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieObservationsParents,
			)
		) {
			lListeElement.add(this.listeObsProfParent);
		}
		if (
			(this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieEncouragements,
			) &&
				GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Professeur) ||
			(this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieEncouragements,
			) &&
				GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Etablissement)
		) {
			lListeElement.add(this.listeEncProfParent);
		}
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecConsultationDefautCarnet,
			)
		) {
			lListeElement.add(this.listeDefautCarnet);
		}
		new ObjetRequeteSaisieCarnetCorrespondance_1.ObjetRequeteSaisieCarnetCorrespondance(
			this,
			this.actionSurValidation,
		).lancerRequete(this.eleveSelectionne, lListeElement);
	}
	creerObservation(aGenre) {
		const lElement = ObjetElement_1.ObjetElement.create({
			Genre: aGenre,
			date: ObjetDate_1.GDate.getDateCourante(),
			demandeur:
				this.applicationSco.getEtatUtilisateur().Identification.ressource,
			visuWeb: false,
			estPubliee: true,
			commentaire: "",
		});
		lElement.date.setHours(0, 0, 0, 0);
		return lElement;
	}
	creerDefautDeCarnet(aDate) {
		const lElement = ObjetElement_1.ObjetElement.create({
			Genre: TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_DefautCarnet,
			date: aDate ? aDate : ObjetDate_1.GDate.getDateCourante(),
			demandeur:
				this.applicationSco.getEtatUtilisateur().Identification.ressource,
			visuWeb: false,
			estPubliee: this.estPubliable,
			commentaire: "",
		});
		lElement.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		lElement.date.setHours(0, 0, 0, 0);
		return lElement;
	}
	formaterlisteEvenements(aListeEvenements) {
		const lListeRubriques = new ObjetListeElements_1.ObjetListeElements();
		const lListeATraiter = aListeEvenements.getListeElements((aElement) => {
			if (!this.publiesUniquement || aElement.estPublie) {
				const lRubrique = MethodesObjet_1.MethodesObjet.dupliquer(
					aElement.rubrique,
				);
				let lRubriqueOrig = lListeRubriques.getElementParNumero(
					lRubrique.getNumero(),
				);
				if (!lRubriqueOrig) {
					lRubrique.count = 0;
					lRubrique.estDeploye = true;
					lRubrique.estUnDeploiement = true;
					lRubriqueOrig = lRubrique;
					lListeRubriques.addElement(lRubriqueOrig);
				}
				aElement.pere = lRubriqueOrig;
				return true;
			} else {
				return false;
			}
		});
		if (lListeATraiter.count() > 1) {
			this.avecCumul = true;
			lListeRubriques.parcourir((aRubrique) => {
				const lIndicePremierElementDeRubrique =
					lListeATraiter.getIndiceElementParFiltre((aElement) => {
						var _a;
						return (
							"rubrique" in aElement &&
							((_a = aElement.rubrique) === null || _a === void 0
								? void 0
								: _a.getNumero()) === aRubrique.getNumero()
						);
					});
				const lListeDeRubrique = lListeATraiter.getListeElements((aElement) => {
					var _a;
					return (
						"rubrique" in aElement &&
						((_a = aElement.rubrique) === null || _a === void 0
							? void 0
							: _a.getNumero()) === aRubrique.getNumero()
					);
				});
				aRubrique.count = lListeDeRubrique.count();
				if (lIndicePremierElementDeRubrique > -1) {
					lListeATraiter.insererElement(
						aRubrique,
						lIndicePremierElementDeRubrique,
					);
				}
			});
		} else {
			this.avecCumul = false;
		}
		return lListeATraiter;
	}
	actualiserlisteEvenements() {
		this.listeEvenements = this.formaterlisteEvenements(
			this.listeAutresEvenements,
		);
		this.getInstance(this.idListeAutres).setOptionsListe(
			this._initOptionsAutresEvenements(this.avecCumul),
		);
		this.getInstance(this.idListeAutres).setDonnees(
			new DonneesListe_AutresEvenements_1.DonneesListe_AutresEvenements(
				this.listeEvenements,
			),
		);
	}
	_evenementMenuContextuelDefautDeCarnet(aAujourdhui, aDate) {
		if (aAujourdhui) {
			const lDefautCarnetAuj = this.getDefautCarnetAujourdhui();
			if (!!lDefautCarnetAuj && lDefautCarnetAuj.existe()) {
				return;
			}
			const lElement = this.creerDefautDeCarnet();
			this.listeDefautCarnet.addElement(lElement);
			if (this.idListeDefautCarnet) {
				this.evenementSurListeDefautCarnet(
					null,
					Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition,
				);
			}
		} else {
			const lElement = this.creerDefautDeCarnet(aDate);
			this.listeDefautCarnet.addElement(lElement);
			if (this.idListeDefautCarnet) {
				this.evenementSurListeDefautCarnet(
					null,
					Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition,
				);
			}
		}
	}
	_editerDate(aArticle) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Date_1.ObjetFenetre_Date,
			{
				pere: this,
				evenement: function (aGenreBouton, aDate) {
					if (aDate) {
						aArticle.date = aDate;
						aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						this.setEtatSaisie(true);
						if (this.idListeDefautCarnet) {
							this.evenementSurListeDefautCarnet(
								null,
								Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition,
							);
						}
					}
				},
			},
		);
		lFenetre.setParametres(
			GParametres.PremierLundi,
			GParametres.PremiereDate,
			ObjetDate_1.GDate.aujourdhui,
			GParametres.JoursOuvres,
			null,
			GParametres.JoursFeries,
		);
		lFenetre.setDonnees(aArticle.date);
	}
	_initOptionsAutresEvenements(aAvecCumul) {
		const lColonnes = [];
		const lWidthCumul = aAvecCumul ? 0 : 60;
		lColonnes.push({
			id: DonneesListe_AutresEvenements_1.DonneesListe_AutresEvenements.colonnes
				.type,
			taille: ObjetListe_1.ObjetListe.initColonne(30, 120, 200),
			titre: {
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"CarnetCorrespondance.TypeDObservation",
				),
			},
		});
		lColonnes.push({
			id: DonneesListe_AutresEvenements_1.DonneesListe_AutresEvenements.colonnes
				.date,
			taille: 125,
			titre: { libelle: ObjetTraduction_1.GTraductions.getValeur("Date") },
		});
		lColonnes.push({
			id: DonneesListe_AutresEvenements_1.DonneesListe_AutresEvenements.colonnes
				.matiereEtProf,
			taille: ObjetListe_1.ObjetListe.initColonne(30, 220 - lWidthCumul, 350),
			titre: {
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"CarnetCorrespondance.MatiereEtProfesseur",
				),
			},
		});
		lColonnes.push({
			id: DonneesListe_AutresEvenements_1.DonneesListe_AutresEvenements.colonnes
				.commentaire,
			taille: ObjetListe_1.ObjetListe.initColonne(70, 220 - lWidthCumul, 720),
			titre: {
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"CarnetCorrespondance.Commentaire",
				),
			},
		});
		lColonnes.push({
			id: DonneesListe_AutresEvenements_1.DonneesListe_AutresEvenements.colonnes
				.publie,
			taille: 20,
			titre: {
				title: ObjetTraduction_1.GTraductions.getValeur(
					"CarnetCorrespondance.Publie",
				),
				classeCssImage: "Image_Publie",
			},
		});
		lColonnes.push({
			id: DonneesListe_AutresEvenements_1.DonneesListe_AutresEvenements.colonnes
				.vu,
			taille: 60,
			titre: {
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"CarnetCorrespondance.Vu",
				),
			},
		});
		return {
			hauteurAdapteContenu: true,
			piedDeListe: null,
			colonnes: lColonnes,
			colonnesCachees: aAvecCumul
				? [
						DonneesListe_AutresEvenements_1.DonneesListe_AutresEvenements
							.colonnes.type,
					]
				: [],
		};
	}
}
exports.InterfacePageSaisieCarnetCorrespondance =
	InterfacePageSaisieCarnetCorrespondance;
function _titreZone(aLibelle) {
	return UtilitaireHtml_1.UtilitaireHtml.composeTitreAvecPuce(aLibelle, {
		avecFondClair: true,
		avecSouligne: false,
	});
}
function _getColonnesDefautCarnet() {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_DefautCarnet_1.DonneesListe_DefautCarnet.colonnes.date,
		taille: 125,
		titre: { libelle: ObjetTraduction_1.GTraductions.getValeur("Date") },
	});
	lColonnes.push({
		id: DonneesListe_DefautCarnet_1.DonneesListe_DefautCarnet.colonnes
			.saisiePar,
		taille: ObjetListe_1.ObjetListe.initColonne(50, 200, 250),
		titre: {
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"CarnetCorrespondance.Redacteur",
			),
		},
	});
	lColonnes.push({
		id: DonneesListe_DefautCarnet_1.DonneesListe_DefautCarnet.colonnes
			.commentaire,
		taille: ObjetListe_1.ObjetListe.initColonne(80, 280, 840),
		titre: {
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"CarnetCorrespondance.Commentaire",
			),
		},
	});
	lColonnes.push({
		id: DonneesListe_DefautCarnet_1.DonneesListe_DefautCarnet.colonnes.publie,
		taille: 20,
		titre: {
			title: ObjetTraduction_1.GTraductions.getValeur(
				"CarnetCorrespondance.Publie",
			),
			classeCssImage: "Image_Publie",
		},
	});
	lColonnes.push({
		id: DonneesListe_DefautCarnet_1.DonneesListe_DefautCarnet.colonnes.vue,
		taille: 60,
		titre: {
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"CarnetCorrespondance.Vue",
			),
		},
	});
	return lColonnes;
}
