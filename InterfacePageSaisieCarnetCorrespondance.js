const { TypeDroits } = require("ObjetDroitsPN.js");
const {
	ObjetFenetre_EditionObservation,
} = require("ObjetFenetre_EditionObservation.js");
const {
	ObjetRequetePageSaisieCarnetCorrespondance,
} = require("ObjetRequetePageSaisieCarnetCorrespondance.js");
const { DonneesListe_Observations } = require("DonneesListe_Observations.js");
const {
	DonneesListe_Encouragements,
} = require("DonneesListe_Encouragements.js");
const { DonneesListe_DefautCarnet } = require("DonneesListe_DefautCarnet.js");
const {
	DonneesListe_AutresEvenements,
} = require("DonneesListe_AutresEvenements.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { GDate } = require("ObjetDate.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreMessage } = require("Enumere_Message.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const {
	ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const ObjetRequeteSaisieCarnetCorrespondance = require("ObjetRequeteSaisieCarnetCorrespondance.js");
const { TypeGenreObservationVS } = require("TypeGenreObservationVS.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const { UtilitaireHtml } = require("UtilitaireHtml.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_Date } = require("ObjetFenetre_Date.js");
class InterfacePageSaisieCarnetCorrespondance extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.idWrapper = this.Nom + "_wrapper";
		this.idMessage = this.Nom + "_message";
		this.eleveSelectionne = null;
		this.obsSelectionnee = {};
		this.publiesUniquement = false;
	}
	construireInstances() {
		this.identTripleCombo = this.add(
			ObjetAffichagePageAvecMenusDeroulants,
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
			GApplication.droits.get(TypeDroits.absences.avecSaisieObservationsParents)
		) {
			this.idListeObs = this.add(
				ObjetListe,
				this.evenementSurListeObs,
				this.initialiserListeObs,
			);
		}
		if (
			(GApplication.droits.get(TypeDroits.absences.avecSaisieEncouragements) &&
				GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur) ||
			(GApplication.droits.get(TypeDroits.absences.avecSaisieEncouragements) &&
				GEtatUtilisateur.GenreEspace === EGenreEspace.Etablissement)
		) {
			this.idListeEnc = this.add(
				ObjetListe,
				this.evenementSurListeEnc,
				this.initialiserListeEnc,
			);
		}
		if (
			GApplication.droits.get(TypeDroits.absences.avecConsultationDefautCarnet)
		) {
			this.idListeDefautCarnet = this.add(
				ObjetListe,
				this.evenementSurListeDefautCarnet,
				this.initialiserListeDefautCarnet,
			);
		}
		if (
			GApplication.droits.get(
				TypeDroits.absences.avecAccesAuxEvenementsAutresCours,
			)
		) {
			this.idListeAutres = this.add(
				ObjetListe,
				null,
				this.initialiserListeAutres,
			);
		}
		if (
			GApplication.droits.get(TypeDroits.absences.avecSaisieEncouragements) ||
			GApplication.droits.get(TypeDroits.absences.avecSaisieObservationsParents)
		) {
			this.idFenetreEdition = this.addFenetre(
				ObjetFenetre_EditionObservation,
				this.evenementSurFenetreObs,
				this.initialiserEdition,
			);
		}
	}
	setParametresGeneraux() {
		this.GenreStructure = EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone = [this.identTripleCombo];
	}
	getDefautCarnetAujourdhui() {
		let lDefautCarnetAuj = null;
		if (!!this.listeDefautCarnet) {
			this.listeDefautCarnet.parcourir((D) => {
				if (GDate.estJourEgal(D.date, GDate.getDateCourante())) {
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
					actualiserlisteEvenements.call(aInstance);
				},
			},
		});
	}
	initialiserTripleCombo(aInstance) {
		aInstance.setParametres([EGenreRessource.Classe, EGenreRessource.Eleve]);
	}
	initialiserListeObs(aInstance) {
		aInstance.setOptionsListe(DonneesListe_Observations.options);
		GEtatUtilisateur.setTriListe({
			identifiant: "carnet_Obs",
			liste: aInstance,
			tri: {
				id: DonneesListe_Observations.colonnes.date,
				genre: EGenreTriElement.Decroissant,
			},
		});
	}
	initialiserListeAutres(aInstance) {
		aInstance.setOptionsListe(DonneesListe_AutresEvenements.getOptions(false));
		GEtatUtilisateur.setTriListe({
			identifiant: "carnet_Autres",
			liste: aInstance,
			tri: {
				id: DonneesListe_AutresEvenements.colonnes.date,
				genre: EGenreTriElement.Decroissant,
			},
		});
	}
	initialiserListeEnc(aInstance) {
		aInstance.setOptionsListe(DonneesListe_Encouragements.options);
		GEtatUtilisateur.setTriListe({
			identifiant: "carnet_Enc",
			liste: aInstance,
			tri: {
				id: DonneesListe_Encouragements.colonnes.date,
				genre: EGenreTriElement.Decroissant,
			},
		});
	}
	initialiserListeDefautCarnet(aInstance) {
		aInstance.setOptionsListe({
			colonnes: _getColonnesDefautCarnet(),
			avecLigneCreation: GApplication.droits.get(
				TypeDroits.absences.avecSaisieDefautCarnet,
			),
			liste: aInstance,
			colonnesCachees: [],
			hauteurAdapteContenu: true,
			listeCreations: 0,
			titreCreation: GTraductions.getValeur(
				"CarnetCorrespondance.NouveauDefautCarnet",
			),
			piedDeListe: null,
		});
		GEtatUtilisateur.setTriListe({
			identifiant: "carnet_Enc",
			liste: aInstance,
			tri: {
				id: DonneesListe_DefautCarnet.colonnes.date,
				genre: EGenreTriElement.Decroissant,
			},
		});
	}
	initialiserEdition(aInstance) {
		aInstance.setOptionsFenetre({
			titre: GTraductions.getValeur("CarnetCorrespondance.ObservationsParents"),
			largeur: 600,
			hauteur: 230,
		});
	}
	initialiserBoutonCal(aInstance) {
		aInstance.setOptionsBouton({ Libelles: ["..."] });
	}
	initialiserFenetreCal(aInstance) {
		aInstance.setOptionsFenetre({
			titre: GTraductions.getValeur("CarnetCorrespondance.DefautCarnet"),
			largeur: 650,
			hauteur: null,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
			],
		});
	}
	evenementSurListeEnc(aParametres, aGenreEvenement, I, J) {
		delete this._observationCree;
		switch (aGenreEvenement) {
			case EGenreEvenementListe.Selection:
				break;
			case EGenreEvenementListe.Creation:
				this.getInstance(this.idFenetreEdition).setDonnees({
					observation: (this._observationCree = this.creerObservation(
						TypeGenreObservationVS.OVS_Encouragement,
					)),
					numeroObservation: null,
					genreEtat: null,
					typeObservation: TypeGenreObservationVS.OVS_Encouragement,
					publiable: this.estPubliable,
					avecDate: true,
				});
				this.getInstance(this.idFenetreEdition).afficher();
				break;
			case EGenreEvenementListe.Edition:
				this.getInstance(this.idFenetreEdition).setDonnees({
					observation: this.listeEncProfParent.get(J),
					numeroObservation: null,
					genreEtat: null,
					typeObservation: TypeGenreObservationVS.OVS_Encouragement,
					publiable: this.estPubliable,
					avecDate: true,
				});
				this.getInstance(this.idFenetreEdition).afficher();
				break;
			case EGenreEvenementListe.ApresCreation:
			case EGenreEvenementListe.ApresEdition:
				this.getInstance(this.idListeEnc).actualiser(true);
				if (this.listeEncProfParent.existeElementPourValidation()) {
					this.setEtatSaisie(EGenreEtat.Modification);
				}
				break;
			case EGenreEvenementListe.Suppression:
				break;
			default:
		}
		return true;
	}
	evenementSurListeDefautCarnet(aParametres, aGenreEvenement) {
		switch (aGenreEvenement) {
			case EGenreEvenementListe.Selection:
				break;
			case EGenreEvenementListe.Creation:
				break;
			case EGenreEvenementListe.Edition:
				switch (aParametres.idColonne) {
					case DonneesListe_DefautCarnet.colonnes.date:
						_editerDate.call(this, aParametres.article);
						break;
					default:
						break;
				}
				break;
			case EGenreEvenementListe.ApresCreation:
			case EGenreEvenementListe.ApresEdition:
				this.getInstance(this.idListeDefautCarnet).actualiser(true);
				if (this.listeDefautCarnet.existeElementPourValidation()) {
					this.setEtatSaisie(EGenreEtat.Modification);
				}
				break;
			case EGenreEvenementListe.Suppression:
				break;
			default:
		}
		return true;
	}
	evenementSurListeObs(aParametres, aGenreEvenement, I, J) {
		delete this._observationCree;
		switch (aGenreEvenement) {
			case EGenreEvenementListe.Selection:
				break;
			case EGenreEvenementListe.Creation:
				this.getInstance(this.idFenetreEdition).setDonnees({
					observation: (this._observationCree = this.creerObservation(
						TypeGenreObservationVS.OVS_ObservationParent,
					)),
					numeroObservation: null,
					genreEtat: null,
					typeObservation: TypeGenreObservationVS.OVS_ObservationParent,
					publiable: this.estPubliable,
					avecDate: true,
				});
				this.getInstance(this.idFenetreEdition).afficher();
				break;
			case EGenreEvenementListe.Edition:
				this.getInstance(this.idFenetreEdition).setDonnees({
					observation: this.listeObsProfParent.get(J),
					numeroObservation: null,
					genreEtat: null,
					typeObservation: TypeGenreObservationVS.OVS_ObservationParent,
					publiable: this.estPubliable,
					avecDate: true,
				});
				this.getInstance(this.idFenetreEdition).afficher();
				break;
			case EGenreEvenementListe.ApresCreation:
			case EGenreEvenementListe.ApresEdition:
				this.getInstance(this.idListeObs).actualiser(true);
				if (this.listeObsProfParent.existeElementPourValidation()) {
					this.setEtatSaisie(EGenreEtat.Modification);
				}
				break;
			case EGenreEvenementListe.Suppression:
				break;
			default:
		}
		return true;
	}
	evenementSurFenetreObs(aSaisie) {
		if (aSaisie) {
			if (
				this._observationCree &&
				this._observationCree.getEtat() !== EGenreEtat.Aucun
			) {
				switch (this._observationCree.Genre) {
					case TypeGenreObservationVS.OVS_ObservationParent:
						this.listeObsProfParent.addElement(this._observationCree);
						break;
					case TypeGenreObservationVS.OVS_Encouragement:
						this.listeEncProfParent.addElement(this._observationCree);
						break;
					default:
						break;
				}
			}
			delete this._observationCree;
		}
		if (this.idListeObs) {
			this.evenementSurListeObs({}, EGenreEvenementListe.ApresEdition);
		}
		if (this.idListeEnc) {
			this.evenementSurListeEnc({}, EGenreEvenementListe.ApresEdition);
		}
	}
	evenementSurFenetreCal(aNumeroBouton, aEstModif) {
		if (aNumeroBouton === 1) {
			this.actualiserDefautCarnet();
			if (aEstModif) {
				this.setEtatSaisie(EGenreEtat.Modification);
			}
			this.valider();
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
			GApplication.droits.get(TypeDroits.absences.avecSaisieObservationsParents)
		) {
			H.push(
				'<div class="colCarnet itemCarnetTitre Texte10">' +
					_titreZone(
						GTraductions.getValeur("CarnetCorrespondance.ObservationsParents"),
					) +
					"</div>",
			);
			H.push(
				'<div class="colCarnet m-left m-bottom-l" id="' +
					this.getInstance(this.idListeObs).getNom() +
					'"></div>',
			);
		}
		if (
			(GApplication.droits.get(TypeDroits.absences.avecSaisieEncouragements) &&
				GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur) ||
			(GApplication.droits.get(TypeDroits.absences.avecSaisieEncouragements) &&
				GEtatUtilisateur.GenreEspace === EGenreEspace.Etablissement)
		) {
			H.push(
				'<div class="colCarnet itemCarnetTitre Texte10">' +
					_titreZone(
						GTraductions.getValeur("CarnetCorrespondance.Encouragements"),
					) +
					"</div>",
			);
			H.push(
				'<div class="colCarnet m-left m-bottom-l" id="' +
					this.getInstance(this.idListeEnc).getNom() +
					'"></div>',
			);
		}
		if (
			GApplication.droits.get(TypeDroits.absences.avecConsultationDefautCarnet)
		) {
			H.push(
				'<div class="colCarnet itemCarnetTitre Texte10" style="color:' +
					GCouleur.texte +
					'; ">' +
					_titreZone(
						GTraductions.getValeur("CarnetCorrespondance.DefautCarnet"),
					) +
					"</div>",
			);
			H.push(
				'<div class="colCarnet m-left m-bottom-l" id="' +
					this.getInstance(this.idListeDefautCarnet).getNom() +
					'"></div>',
			);
		}
		if (
			GApplication.droits.get(
				TypeDroits.absences.avecAccesAuxEvenementsAutresCours,
			)
		) {
			H.push(
				'<div class="colCarnet itemCarnetTitre">',
				'<div style="float:right;" class="m-bottom-s">',
				'<ie-checkbox ie-model="cbAfficherAutresEvtPubliesUniquement">',
				GTraductions.getValeur("CarnetCorrespondance.UniquementLesPublies"),
				"</ie-checkbox>",
				"</div>",
				_titreZone(
					GTraductions.getValeur("CarnetCorrespondance.AutresEvenements"),
				),
				"</div>",
			);
			H.push(
				'<div class="colCarnet m-left m-bottom-l" id="' +
					this.getInstance(this.idListeAutres).getNom() +
					'"></div>',
			);
		}
		H.push("</div>");
		H.push("</div>");
		H.push('<div id="' + this.idMessage + '">');
		H.push(
			this.composeMessage(
				GTraductions.getValeur("Message")[EGenreMessage.SelectionEleve],
			),
		);
		H.push("</div>");
		return H.join("");
	}
	recupererDonnees() {}
	afficherPage() {
		this.setEtatSaisie(false);
		this.evenementSurDernierMenuDeroulant();
	}
	evenementSurDernierMenuDeroulant() {
		this.eleveSelectionne = GEtatUtilisateur.Navigation.getRessource(
			EGenreRessource.Eleve,
		);
		Invocateur.evenement(
			ObjetInvocateur.events.activationImpression,
			EGenreImpression.Aucune,
		);
		new ObjetRequetePageSaisieCarnetCorrespondance(
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
		Invocateur.evenement(
			ObjetInvocateur.events.activationImpression,
			EGenreImpression.GenerationPDF,
			this,
			() => {
				return {
					genreGenerationPDF: TypeHttpGenerationPDFSco.CarnetDeCorrespondance,
					eleve: this.eleveSelectionne,
					classe: GEtatUtilisateur.Navigation.getRessource(
						EGenreRessource.Classe,
					),
					uniquementPublies: this.publiesUniquement,
				};
			},
		);
		this.estPubliable = aParam.estPubliable;
		this.listeObservations = aParam.listeObservations;
		this.listeObsProfParent = this.listeObservations.getListeElements(
			(aElement) => {
				return aElement.Genre === TypeGenreObservationVS.OVS_ObservationParent;
			},
		);
		this.listeEncouragements = aParam.listeEncouragements;
		this.listeEncProfParent = this.listeEncouragements.getListeElements(
			(aElement) => {
				return aElement.Genre === TypeGenreObservationVS.OVS_Encouragement;
			},
		);
		this.listeDefautCarnet = this.listeObservations.getListeElements(
			(aElement) => {
				return aElement.Genre === TypeGenreObservationVS.OVS_DefautCarnet;
			},
		);
		this.listeAutresEvenements = aParam.listeAutresEvenements;
		if (
			GApplication.droits.get(
				TypeDroits.absences.avecAccesAuxEvenementsAutresCours,
			)
		) {
			actualiserlisteEvenements.call(this);
		}
		if (
			GApplication.droits.get(TypeDroits.absences.avecSaisieObservationsParents)
		) {
			this.getInstance(this.idListeObs).setDonnees(
				new DonneesListe_Observations(this.listeObsProfParent),
			);
		}
		if (
			(GApplication.droits.get(TypeDroits.absences.avecSaisieEncouragements) &&
				GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur) ||
			(GApplication.droits.get(TypeDroits.absences.avecSaisieEncouragements) &&
				GEtatUtilisateur.GenreEspace === EGenreEspace.Etablissement)
		) {
			this.getInstance(this.idListeEnc).setDonnees(
				new DonneesListe_Encouragements(this.listeEncProfParent),
			);
		}
		if (
			GApplication.droits.get(TypeDroits.absences.avecConsultationDefautCarnet)
		) {
			this.getInstance(this.idListeDefautCarnet).setDonnees(
				new DonneesListe_DefautCarnet(this.listeDefautCarnet, {
					callbackMenuContextuel:
						_evenementMenuContextuelDefautDeCarnet.bind(this),
					avecEdition: GApplication.droits.get(
						TypeDroits.absences.avecSaisieDefautCarnet,
					),
				}),
			);
		}
	}
	actualiserDefautCarnet() {
		this.listeDefautCarnet.setTri([ObjetTri.init("date")]);
		this.listeDefautCarnet.trier();
	}
	valider() {
		const lListeElement = new ObjetListeElements();
		if (
			GApplication.droits.get(TypeDroits.absences.avecSaisieObservationsParents)
		) {
			lListeElement.add(this.listeObsProfParent);
		}
		if (
			(GApplication.droits.get(TypeDroits.absences.avecSaisieEncouragements) &&
				GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur) ||
			(GApplication.droits.get(TypeDroits.absences.avecSaisieEncouragements) &&
				GEtatUtilisateur.GenreEspace === EGenreEspace.Etablissement)
		) {
			lListeElement.add(this.listeEncProfParent);
		}
		if (
			GApplication.droits.get(TypeDroits.absences.avecConsultationDefautCarnet)
		) {
			lListeElement.add(this.listeDefautCarnet);
		}
		new ObjetRequeteSaisieCarnetCorrespondance(
			this,
			this.actionSurValidation,
		).lancerRequete(this.eleveSelectionne, lListeElement);
	}
	creerObservation(aGenre) {
		const lElement = new ObjetElement();
		lElement.Genre = aGenre;
		lElement.date = GDate.getDateCourante();
		lElement.date.setHours(0, 0, 0, 0);
		lElement.demandeur = GEtatUtilisateur.Identification.ressource;
		lElement.visuWeb = false;
		lElement.estPubliee = true;
		lElement.commentaire = "";
		return lElement;
	}
	creerDefautDeCarnet(aDate) {
		const lElement = new ObjetElement();
		lElement.Genre = TypeGenreObservationVS.OVS_DefautCarnet;
		lElement.date = aDate ? aDate : GDate.getDateCourante();
		lElement.date.setHours(0, 0, 0, 0);
		lElement.demandeur = GEtatUtilisateur.Identification.ressource;
		lElement.setEtat(EGenreEtat.Creation);
		lElement.visuWeb = false;
		lElement.estPubliee = this.estPubliable;
		lElement.commentaire = "";
		return lElement;
	}
}
function _titreZone(aLibelle) {
	return UtilitaireHtml.composeTitreAvecPuce(aLibelle, {
		avecFondClair: true,
		avecSouligne: false,
	});
}
function formaterlisteEvenements(aListeEvenements) {
	const lListeRubriques = new ObjetListeElements();
	const lListeATraiter = aListeEvenements.getListeElements((aElement) => {
		if (!this.publiesUniquement || aElement.estPublie) {
			const lRubrique = MethodesObjet.dupliquer(aElement.rubrique);
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
					return (
						aElement.rubrique &&
						aElement.rubrique.getNumero() === aRubrique.getNumero()
					);
				});
			const lListeDeRubrique = lListeATraiter.getListeElements((aElement) => {
				return (
					aElement.rubrique &&
					aElement.rubrique.getNumero() === aRubrique.getNumero()
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
function actualiserlisteEvenements() {
	if (
		GApplication.droits.get(
			TypeDroits.absences.avecAccesAuxEvenementsAutresCours,
		)
	) {
		this.listeEvenements = formaterlisteEvenements.call(
			this,
			this.listeAutresEvenements,
		);
		this.getInstance(this.idListeAutres).setOptionsListe(
			DonneesListe_AutresEvenements.getOptions(this.avecCumul),
		);
		this.getInstance(this.idListeAutres).setDonnees(
			new DonneesListe_AutresEvenements(this.listeEvenements),
		);
	}
}
function _evenementMenuContextuelDefautDeCarnet(aAujourdhui, aDate) {
	if (aAujourdhui) {
		const lDefautCarnetAuj = this.getDefautCarnetAujourdhui();
		if (!!lDefautCarnetAuj && lDefautCarnetAuj.existe()) {
			return;
		}
		const lElement = this.creerDefautDeCarnet();
		this.listeDefautCarnet.addElement(lElement);
		if (this.idListeDefautCarnet) {
			this.evenementSurListeDefautCarnet({}, EGenreEvenementListe.ApresEdition);
		}
	} else {
		const lElement = this.creerDefautDeCarnet(aDate);
		this.listeDefautCarnet.addElement(lElement);
		if (this.idListeDefautCarnet) {
			this.evenementSurListeDefautCarnet({}, EGenreEvenementListe.ApresEdition);
		}
	}
}
function _getColonnesDefautCarnet() {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_DefautCarnet.colonnes.date,
		taille: 125,
		titre: { libelle: GTraductions.getValeur("Date") },
	});
	lColonnes.push({
		id: DonneesListe_DefautCarnet.colonnes.saisiePar,
		taille: ObjetListe.initColonne(50, 200, 250),
		titre: {
			libelle: GTraductions.getValeur("CarnetCorrespondance.Redacteur"),
		},
	});
	lColonnes.push({
		id: DonneesListe_DefautCarnet.colonnes.commentaire,
		taille: ObjetListe.initColonne(80, 280, 840),
		titre: {
			libelle: GTraductions.getValeur("CarnetCorrespondance.Commentaire"),
		},
	});
	lColonnes.push({
		id: DonneesListe_DefautCarnet.colonnes.publie,
		taille: 20,
		titre: {
			title: GTraductions.getValeur("CarnetCorrespondance.Publie"),
			classeCssImage: "Image_Publie",
		},
	});
	lColonnes.push({
		id: DonneesListe_DefautCarnet.colonnes.vue,
		taille: 60,
		titre: { libelle: GTraductions.getValeur("CarnetCorrespondance.Vue") },
	});
	return lColonnes;
}
function _editerDate(aArticle) {
	const lFenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre_Date, {
		pere: this,
		evenement: function (aGenreBouton, aDate) {
			if (aDate) {
				aArticle.date = aDate;
				aArticle.setEtat(EGenreEtat.Modification);
				this.setEtatSaisie(true);
				if (this.idListeDefautCarnet) {
					this.evenementSurListeDefautCarnet(
						{},
						EGenreEvenementListe.ApresEdition,
					);
				}
			}
		},
	});
	lFenetre.setParametres(
		GParametres.PremierLundi,
		GParametres.PremiereDate,
		GDate.aujourdhui,
		GParametres.JoursOuvres,
		null,
		GParametres.JoursFeries,
	);
	lFenetre.setDonnees(aArticle.date);
}
module.exports = { InterfacePageSaisieCarnetCorrespondance };
