exports.ObjetGestionnaireMotifs = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const DonneesListe_CategoriesMotif_1 = require("DonneesListe_CategoriesMotif");
const ObjetRequeteSaisieMotifs_1 = require("ObjetRequeteSaisieMotifs");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const DonneesListe_SelectionMotifs_1 = require("DonneesListe_SelectionMotifs");
const ObjetRequeteListesSaisiesPourIncidents_1 = require("ObjetRequeteListesSaisiesPourIncidents");
const AccessApp_1 = require("AccessApp");
class ObjetGestionnaireMotifs extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.droits = {
			avecCreationMotifs: (0, AccessApp_1.getApp)().droits.get(
				ObjetDroitsPN_1.TypeDroits.creerMotifIncidentPunitionSanction,
			),
		};
		this.initOptions();
		this.listeSelectionneOrigin = new ObjetListeElements_1.ObjetListeElements();
	}
	initOptions() {
		this._options = {
			titreFenetre: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreMotifs.titre",
			),
			titresColonnes: [
				null,
				ObjetTraduction_1.GTraductions.getValeur("fenetreMotifs.motif"),
				"",
				ObjetTraduction_1.GTraductions.getValeur("fenetreMotifs.genre"),
			],
			taillesColonnes: ["20", "100%", "15", "150"],
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			paramListe: {
				avecCreation: this.droits.avecCreationMotifs,
				avecEdition: this.droits.avecCreationMotifs,
				avecSuppression: this.droits.avecCreationMotifs,
			},
			avecLigneCreation: !!this.droits.avecCreationMotifs,
			creations: this.droits.avecCreationMotifs
				? [
						DonneesListe_SelectionMotifs_1.DonneesListe_SelectionMotifs.colonnes
							.motif,
						DonneesListe_SelectionMotifs_1.DonneesListe_SelectionMotifs.colonnes
							.incident,
					]
				: null,
			callbckCreation: this._eventSurCreationMotif.bind(this),
			callbckEdition: this._eventSurEditionMotif.bind(this),
			colonnesCachees: null,
			largeurFenetre: 500,
			hauteurFenetre: 400,
			avecAuMoinsUnEltSelectionne: false,
		};
	}
	setOptions(aOptions) {
		$.extend(this._options, aOptions);
		if (!!this._options.droits) {
			$.extend(this.droits, this._options.droits);
		}
		return this;
	}
	detruireInstances() {
		this._fermerFenetre();
	}
	setDonnees(aParam) {
		const lParam = {
			listeSelectionne: new ObjetListeElements_1.ObjetListeElements(),
			avecOuvertureFenetre: false,
			reinitialiserlisteMotifs: false,
		};
		$.extend(lParam, aParam);
		if (!!lParam && !!lParam.listeSelectionne) {
			this.listeSelectionneOrigin = lParam.listeSelectionne;
		}
		if (!this.listMotifsOrigin || lParam.reinitialiserlisteMotifs) {
			new ObjetRequeteListesSaisiesPourIncidents_1.ObjetRequeteListesSaisiesPourIncidents(
				this,
				this._apresRequeteDonneesMotifs.bind(this, lParam.avecOuvertureFenetre),
			).lancerRequete({
				avecLieux: false,
				avecSalles: false,
				avecInternat: false,
				avecMotifs: true,
				avecAucunMotif: false,
				avecInfoSupprimable: true,
				avecActions: false,
				avecSousCategorieDossier: this.droits.avecCreationMotifs,
				avecPunitions: false,
				avecSanctions: false,
				avecProtagonistes: false,
			});
		} else {
			this._chargerDonnees({
				listeSelectionne: this.listeSelectionneOrigin,
				listeComplet: this.listMotifsOrigin,
			});
			if (aParam.avecOuvertureFenetre) {
				this._ouvrirFenetre();
			}
		}
	}
	getDonnees() {
		return this.donnees;
	}
	ouvrirFenetre(aParam) {
		const lParam = {
			listeSelectionne: new ObjetListeElements_1.ObjetListeElements(),
			avecSetDonnees: false,
		};
		$.extend(lParam, aParam);
		if (lParam.avecSetDonnees) {
			this.setDonnees({
				listeSelectionne: lParam.listeSelectionne,
				avecOuvertureFenetre: true,
			});
		} else {
			this._ouvrirFenetre();
		}
	}
	_initDonnees(aListeSelectionnee, aListeOrigin) {
		const lResult = MethodesObjet_1.MethodesObjet.dupliquer(aListeOrigin);
		for (let i = 0; i < aListeSelectionnee.count(); i++) {
			const lElm = lResult.getElementParNumero(aListeSelectionnee.getNumero(i));
			if (!!lElm) {
				lElm.cmsActif = true;
			}
		}
		return lResult;
	}
	surFenetre(aGenreBouton, aSelection, aAvecChangementListe) {
		this.genreBouton = aGenreBouton;
		const lListeActif = this.donnees.getListeElements((aElement) => {
			return aElement.cmsActif;
		});
		if (aGenreBouton === 1) {
			if (aAvecChangementListe) {
				this.requeteSaisieMotifs(lListeActif, this.donnees);
			} else {
				this._finSurFenetre(aAvecChangementListe);
			}
		} else {
			this._chargerDonnees({
				listeSelectionne: this.listeSelectionneOrigin,
				listeComplet: this.listMotifsOrigin,
			});
			this._finSurFenetre(aAvecChangementListe);
		}
	}
	_ouvrirFenetre() {
		if (this.fenetre) {
			this._fermerFenetre();
		}
		this.fenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			{ pere: this, evenement: this.surFenetre, initialiser: false },
		);
		const lSelf = this;
		this.fenetre.ajouterCallbackSurDestruction(() => {
			lSelf.fenetre = null;
		});
		const lParam = {
			titres: this._options.titresColonnes
				? this._options.titresColonnes
				: [
						{ estCoche: true },
						ObjetTraduction_1.GTraductions.getValeur("Libelle"),
					],
			tailles: this._options.taillesColonnes
				? this._options.taillesColonnes
				: [20, "100%"],
			avecLigneCreation: this._options.avecLigneCreation,
			creations: this._options.creations,
			callbckCreation: this._options.callbckCreation,
			callbckEdition: this._options.callbckEdition,
			colonnesCachees: this._options.colonnesCachees,
			optionsListe: this._options.optionsListe,
			editable: true,
		};
		const lOptionsFenetre = {
			titre: this._options.titreFenetre,
			largeur: this._options.largeurFenetre,
			hauteur: this._options.hauteurFenetre,
			listeBoutons: this._options.listeBoutons
				? this._options.listeBoutons
				: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		};
		if (this._options.avecAuMoinsUnEltSelectionne) {
			lOptionsFenetre.modeActivationBtnValider =
				this.fenetre.modeActivationBtnValider.auMoinsUnEltSelectionne;
		}
		this.fenetre.setOptionsFenetre(lOptionsFenetre);
		this.fenetre.paramsListe = lParam;
		this.fenetre.initialiser();
		this.donneesListe =
			new DonneesListe_SelectionMotifs_1.DonneesListe_SelectionMotifs(
				this.donnees,
				this._options.paramListe,
			);
		this.fenetre.setDonnees(this.donneesListe, false);
		this.fenetre.positionnerSousId(this.Nom);
	}
	_eventSurCreationMotif(aCol) {
		switch (aCol) {
			case DonneesListe_SelectionMotifs_1.DonneesListe_SelectionMotifs.colonnes
				.incident:
				this._ouvrirFenetreSCDossier(this._evntFenetreSousCategorieDossier);
				return true;
			default:
				break;
		}
	}
	_eventSurEditionMotif(aParametres) {
		switch (aParametres.colonne) {
			case DonneesListe_SelectionMotifs_1.DonneesListe_SelectionMotifs.colonnes
				.incident:
				this.motifSelectionne = this.donnees.get(aParametres.ligne);
				this.elmSelectionne = aParametres.article;
				this._ouvrirFenetreSCDossier(this._evntEditionSousCategorieDossier);
				return true;
			default:
				break;
		}
	}
	_ouvrirFenetreSCDossier(aEvenement) {
		if (this.fenetreSCD) {
			this._fermerFenetreSCD();
		}
		const lSelf = this;
		this.fenetreSCD = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			{ pere: this, evenement: aEvenement.bind(lSelf), initialiser: false },
		);
		this.fenetreSCD.ajouterCallbackSurDestruction(() => {
			lSelf.fenetreSCD = null;
		});
		const lParamsListe = { tailles: ["100%"], editable: false };
		this.fenetreSCD.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur("GenreDIncident"),
			largeur: 300,
			hauteurMin: 160,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		this.fenetreSCD.paramsListe = lParamsListe;
		this.fenetreSCD.initialiser();
		this.fenetreSCD.setDonnees(
			new DonneesListe_CategoriesMotif_1.DonneesListe_CategoriesMotif(
				this.listeSousCategorieDossier,
			),
		);
		this.fenetreSCD.positionnerSousId(this.Nom);
	}
	_evntFenetreSousCategorieDossier(aGenreBouton, aSelection) {
		if (aGenreBouton === 1) {
			const lIncident = this.listeSousCategorieDossier.get(aSelection);
			this.fenetre.getListe().ajouterElementCreation(lIncident);
		} else {
			this.fenetre.getListe().annulerCreation();
		}
	}
	_evntEditionSousCategorieDossier(aGenreBouton, aSelection) {
		if (aGenreBouton === 1) {
			const lIncident = this.listeSousCategorieDossier.get(aSelection);
			if (
				!this.elmSelectionne.sousCategorieDossier ||
				lIncident.getNumero() !==
					this.elmSelectionne.sousCategorieDossier.getNumero()
			) {
				this.elmSelectionne.sousCategorieDossier = lIncident;
				this.elmSelectionne.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.fenetre.actualiserListe(true, true);
			}
		}
	}
	_apresRequeteDonneesMotifs(aAvecOuvertureFenetre, aJSON) {
		this.listMotifsOrigin = aJSON.motifs;
		this.listeSousCategorieDossier = aJSON.listeSousCategorieDossier;
		this._chargerDonnees({
			listeSelectionne: this.listeSelectionneOrigin,
			listeComplet: this.listMotifsOrigin,
		});
		if (aAvecOuvertureFenetre) {
			this._ouvrirFenetre();
		}
	}
	_chargerDonnees(aParam) {
		if (aParam.listeComplet) {
			if (aParam.listeSelectionne) {
				this.donnees = this._initDonnees(
					aParam.listeSelectionne,
					aParam.listeComplet,
				);
			} else {
				this.donnees = MethodesObjet_1.MethodesObjet.dupliquer(
					aParam.listeComplet,
				);
			}
			this.donnees.setTri([
				ObjetTri_1.ObjetTri.init((D) => {
					return !D.ssMotif;
				}),
				ObjetTri_1.ObjetTri.init("Libelle"),
			]);
			this.donnees.trier();
			this.callback.appel({
				event: ObjetGestionnaireMotifs.genreEvent.actualiserCellule,
			});
		}
	}
	_fermerFenetreSCD() {
		if (!this.fenetreSCD) {
			return;
		}
		this.fenetreSCD.fermer();
	}
	_finSurFenetre(aAvecChangementListe) {
		this._fermerFenetre();
		const lListeActif = this.donnees.getListeElements((aElement) => {
			return aElement.cmsActif;
		});
		this.callback.appel({
			genreBouton: this.genreBouton,
			liste: lListeActif,
			event: ObjetGestionnaireMotifs.genreEvent.actualiserDonnees,
			listeComplet: aAvecChangementListe ? this.listMotifsOrigin : null,
		});
	}
	requeteSaisieMotifs(aListeDonnees, aListeTot) {
		new ObjetRequeteSaisieMotifs_1.ObjetRequeteSaisieMotifs(this)
			.lancerRequete({
				motifs: aListeTot,
				selection: aListeDonnees,
				avecAucunMotif: false,
			})
			.then((aTabDonnees) => {
				if (
					aTabDonnees === null || aTabDonnees === void 0
						? void 0
						: aTabDonnees[1]
				) {
					this.listMotifsOrigin = aTabDonnees[1];
				}
				if (
					aTabDonnees === null || aTabDonnees === void 0
						? void 0
						: aTabDonnees[0]
				) {
					this.listeSelectionneOrigin = aTabDonnees[0];
				}
				this._chargerDonnees({
					listeSelectionne: this.listeSelectionneOrigin,
					listeComplet: this.listMotifsOrigin,
				});
				this._finSurFenetre(true);
			});
	}
	_fermerFenetre() {
		if (!this.fenetre) {
			return;
		}
		this.fenetre.fermer();
	}
}
exports.ObjetGestionnaireMotifs = ObjetGestionnaireMotifs;
(function (ObjetGestionnaireMotifs) {
	let genreEvent;
	(function (genreEvent) {
		genreEvent[(genreEvent["actualiserCellule"] = 0)] = "actualiserCellule";
		genreEvent[(genreEvent["actualiserDonnees"] = 1)] = "actualiserDonnees";
	})(
		(genreEvent =
			ObjetGestionnaireMotifs.genreEvent ||
			(ObjetGestionnaireMotifs.genreEvent = {})),
	);
})(
	ObjetGestionnaireMotifs ||
		(exports.ObjetGestionnaireMotifs = ObjetGestionnaireMotifs = {}),
);
