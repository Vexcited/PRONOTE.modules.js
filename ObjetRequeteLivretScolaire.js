exports.ObjetRequeteLivretScolaire = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const Cache_1 = require("Cache");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
class ObjetRequeteLivretScolaire extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
		if (
			GEtatUtilisateur.GenreEspace === Enumere_Espace_1.EGenreEspace.Professeur
		) {
			this.cache = Cache_1.GCache.livretScolaire;
		}
	}
	lancerRequete(aObjet) {
		this.donnees = aObjet;
		const lAvecDonneesClasse = true;
		this.JSON = {
			Classe: aObjet.classe,
			AvecDonneesClasse: lAvecDonneesClasse,
		};
		if (!!aObjet.eleve) {
			this.JSON.Eleve = aObjet.eleve;
		}
		if (!!aObjet.discipline) {
			this.JSON.Discipline = aObjet.discipline.toJSON();
			if (!!aObjet.discipline.service) {
				this.JSON.Discipline.Service = aObjet.discipline.service;
			}
			if (!!aObjet.discipline.filiere) {
				this.JSON.Discipline.filiere = aObjet.discipline.filiere;
			}
			if (!!aObjet.discipline.typeEnseignement) {
				this.JSON.Discipline.TypeEnseignement =
					aObjet.discipline.typeEnseignement;
			}
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lResult = {};
		const lJSON = this.JSONReponse;
		lResult.options = lJSON.options;
		lResult.strInfoDatePublication = lJSON.strInfoDatePublication;
		lResult.graphe = lJSON.graphe;
		lResult.infoSorti = lJSON.infoSorti;
		lResult.avecJauge = lJSON.avecJauge;
		lResult.avecCalculeCompetences = lJSON.avecCalculeCompetences;
		lResult.avecFiliere = lJSON.avecFiliere;
		lResult.estFilierePro = lJSON.estFilierePro;
		lResult.estCasBACPRO = lResult.estFilierePro ? lJSON.estCasBACPro : false;
		lResult.listeAccusesReception = lJSON.listeAccusesReception;
		lResult.estFiliereNew = lJSON.estFiliereNew;
		if (lJSON.tailleMaxSaisie) {
			lResult.tailleMaxSaisie = lJSON.tailleMaxSaisie;
		}
		lResult.genre = this.donnees.genre;
		if (lJSON.message) {
			lResult.message = lJSON.message;
		} else {
			if (lJSON.classe) {
				lResult.classe = new ObjetElement_1.ObjetElement().fromJSON(
					lJSON.classe,
				);
				lResult.classe.nombrePeriodes = lJSON.classe.nombrePeriodes;
				lResult.classe.listeLivret =
					new ObjetListeElements_1.ObjetListeElements();
				this.recupererDonnees(
					lJSON.classe.listeLivret,
					lResult.classe.listeLivret,
				);
				lResult.classe.listeMoyenne =
					new ObjetListeElements_1.ObjetListeElements();
				this.recupererDonnees(
					lJSON.classe.listeMoyenne,
					lResult.classe.listeMoyenne,
				);
				if (this.cache) {
					this.cache.setDonnee(
						this.donnees.genre +
							this.donnees.classe.getCle() +
							this.donnees.eleve.getCle(),
						lResult.classe,
					);
					this.cache.setDonnee(
						this.donnees.genre +
							this.donnees.classe.getCle() +
							this.donnees.eleve.getCle() +
							"_graphe",
						lResult.graphe,
					);
				}
			} else {
				if (
					this.cache &&
					this.donnees.genre ===
						Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche
				) {
					lResult.classe = this.cache.getDonnee(
						this.donnees.genre +
							this.donnees.classe.getCle() +
							this.donnees.eleve.getCle(),
					);
					lResult.graphe = this.cache.getDonnee(
						this.donnees.genre +
							this.donnees.classe.getCle() +
							this.donnees.eleve.getCle() +
							"_graphe",
					);
				}
			}
			if (lJSON.eleve) {
				lResult.eleve = new ObjetElement_1.ObjetElement().fromJSON(lJSON.eleve);
				lResult.eleve.estRedoublant = !!lJSON.eleve.estRedoublant;
				lResult.eleve.libelleEnseignement = lJSON.eleve.libelleEnseignement;
				lResult.eleve.listeLivret =
					new ObjetListeElements_1.ObjetListeElements();
				if (lJSON.eleve.listeLivret) {
					this.recupererDonnees(
						lJSON.eleve.listeLivret,
						lResult.eleve.listeLivret,
					);
				}
				lResult.eleve.listeMoyenne =
					new ObjetListeElements_1.ObjetListeElements();
				if (lJSON.eleve.listeMoyenne) {
					this.recupererDonnees(
						lJSON.eleve.listeMoyenne,
						lResult.eleve.listeMoyenne,
					);
				}
			}
			if (lJSON.service) {
				lResult.service = new ObjetElement_1.ObjetElement().fromJSON(
					lJSON.service,
				);
				lResult.service.titre = lJSON.service.titre;
				lResult.service.libelleEnseignement = lJSON.service.libelleEnseignement;
				lResult.service.listeLivret =
					new ObjetListeElements_1.ObjetListeElements();
				if (lJSON.service.listeLivret) {
					this.recupererDonnees(
						lJSON.service.listeLivret,
						lResult.service.listeLivret,
					);
				}
				lResult.service.listeMoyenne =
					new ObjetListeElements_1.ObjetListeElements();
				const lIDCache =
					this.donnees.genre +
					this.donnees.classe.getCle() +
					this.donnees.discipline.getCle() +
					this.donnees.discipline.service.getCle();
				if (lJSON.service.listeMoyenne) {
					this.recupererDonnees(
						lJSON.service.listeMoyenne,
						lResult.service.listeMoyenne,
					);
					if (this.cache) {
						this.cache.setDonnee(lIDCache, lResult.service.listeMoyenne);
					}
				} else {
					if (
						this.cache &&
						this.donnees.genre !==
							Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche &&
						this.cache.existeDonnee(lIDCache)
					) {
						lResult.service.listeMoyenne = this.cache.getDonnee(lIDCache);
					}
				}
			}
			this.recupererPiedDePage(lJSON, lResult);
		}
		this.callbackReussite.appel(lResult);
	}
	recupererDonnees(aTabJSON, aDonnees) {
		this.elmPere = null;
		if (aTabJSON) {
			for (const i in aTabJSON) {
				this._ajouterItemLivret(aTabJSON[i], aDonnees);
			}
		} else {
			aDonnees = null;
		}
	}
	recupererPiedDePage(aJSON, aDonnees) {
		if (aJSON.piedDePage) {
			const lJSON = aJSON.piedDePage;
			aDonnees.piedDePage = {
				avecAvisCE: lJSON.avecAvisCE,
				estIssueDUnBOLycee: lJSON.estIssueDUnBOLycee,
				avecEngagements: lJSON.avecEngagements,
				avecInvestissement: lJSON.avecInvestissement,
				editable: lJSON.editable,
				editablePourAvisCE: lJSON.editablePourAvisCE,
				listeEngagements: aJSON.listeEngagements,
				avecPFMP: !!lJSON.pfmp,
				avecParcoursDifferencie: lJSON.avecParcoursDifferencie,
				parcoursDifferencie: lJSON.parcoursDifferencie,
			};
			if (lJSON.avecAvisCE && lJSON.avisCE) {
				aDonnees.piedDePage.avisCE = lJSON.avisCE;
				if (!lJSON.avisCE.infosLivret) {
					aDonnees.piedDePage.avisCE.infosLivret =
						new ObjetElement_1.ObjetElement();
					aDonnees.piedDePage.avisCE.infosLivret.avis = null;
					aDonnees.piedDePage.avisCE.infosLivret.commentaire = "";
					aDonnees.piedDePage.avisCE.infosLivret.auteur =
						new ObjetElement_1.ObjetElement();
					aDonnees.piedDePage.avisCE.infosLivret.date = null;
				}
			}
			if (lJSON.avecEngagements && lJSON.engagements) {
				aDonnees.piedDePage.engagements = lJSON.engagements;
				if (!lJSON.engagements.infosLivret) {
					aDonnees.piedDePage.engagements.infosLivret =
						new ObjetElement_1.ObjetElement();
					aDonnees.piedDePage.engagements.infosLivret.commentaire = "";
					aDonnees.piedDePage.engagements.infosLivret.auteur =
						new ObjetElement_1.ObjetElement();
					aDonnees.piedDePage.engagements.infosLivret.date = null;
				}
			}
			if (lJSON.avecInvestissement && lJSON.investissement) {
				aDonnees.piedDePage.investissement = lJSON.investissement;
				if (!lJSON.investissement.infosLivret) {
					aDonnees.piedDePage.investissement.infosLivret =
						new ObjetElement_1.ObjetElement();
					aDonnees.piedDePage.investissement.infosLivret.commentaire = "";
					aDonnees.piedDePage.investissement.infosLivret.auteur =
						new ObjetElement_1.ObjetElement();
					aDonnees.piedDePage.investissement.infosLivret.date = null;
				}
			}
			if (lJSON.pfmp) {
				aDonnees.piedDePage.pfmp = lJSON.pfmp;
				aDonnees.piedDePage.pfmp.editable = lJSON.pfmp.editable;
				if (!lJSON.pfmp.liste) {
					aDonnees.piedDePage.pfmp.liste =
						new ObjetListeElements_1.ObjetListeElements();
				}
				if (!lJSON.pfmp.infosLSEleve) {
					aDonnees.piedDePage.pfmp.infosLSEleve =
						new ObjetElement_1.ObjetElement();
					aDonnees.piedDePage.pfmp.infosLSEleve.nombreSemaines = 0;
					aDonnees.piedDePage.pfmp.infosLSEleve.aLEtranger = false;
					aDonnees.piedDePage.pfmp.infosLSEleve.estExportSynthese = false;
					aDonnees.piedDePage.pfmp.infosLSEleve.appreciation = "";
					aDonnees.piedDePage.pfmp.infosLSEleve.auteur =
						new ObjetElement_1.ObjetElement();
				}
			}
		} else {
			aDonnees.piedDePage = null;
		}
	}
	_ajouterItemLivret(aJSON, aParametre) {
		const lElement = new ObjetElement_1.ObjetElement().fromJSON(aJSON);
		lElement.titreEnseignement = aJSON.titreEnseignement
			? aJSON.titreEnseignement
			: false;
		if (lElement.titreEnseignement) {
			this.elmPere = lElement;
		} else {
			if (aJSON.avecRegroupement) {
				lElement.pere = this.elmPere;
			} else {
				this.elmPere = null;
			}
		}
		lElement.titreDiscipline = aJSON.titreDiscipline
			? aJSON.titreDiscipline
			: false;
		lElement.estSansObligationDeNotation = aJSON.estSansObligationDeNotation
			? aJSON.estSansObligationDeNotation
			: false;
		lElement.titreService = aJSON.titreService ? aJSON.titreService : false;
		lElement.avecServices = aJSON.avecServices ? aJSON.avecServices : false;
		lElement.titreEnseignant = aJSON.titreEnseignant
			? aJSON.titreEnseignant
			: false;
		lElement.avecRegroupement = aJSON.avecRegroupement
			? aJSON.avecRegroupement
			: false;
		lElement.derniereligne = aJSON.derniereligne ? aJSON.derniereligne : false;
		lElement.dernierDuService = aJSON.dernierDuService
			? aJSON.dernierDuService
			: false;
		lElement.livretEditable = aJSON.livretEditable
			? aJSON.livretEditable
			: false;
		lElement.conserveAnciennesNotes = aJSON.conserveAnciennesNotes
			? aJSON.conserveAnciennesNotes
			: false;
		lElement.hintAnciennesNotes = aJSON.hintAnciennesNotes
			? aJSON.hintAnciennesNotes
			: "";
		if (aJSON.metaMatiere) {
			lElement.metaMatiere = new ObjetElement_1.ObjetElement().fromJSON(
				aJSON.metaMatiere,
			);
		}
		if (aJSON.service) {
			lElement.service = new ObjetElement_1.ObjetElement().fromJSON(
				aJSON.service,
			);
		}
		if (aJSON.services) {
			lElement.services = aJSON.services;
		}
		if (aJSON.nombreLignes) {
			lElement.nombreLignes = aJSON.nombreLignes;
		}
		if (aJSON.estChefDOeuvre) {
			lElement.estChefDOeuvre = aJSON.estChefDOeuvre;
		}
		if (aJSON.eleve) {
			lElement.eleve = new ObjetElement_1.ObjetElement().fromJSON(aJSON.eleve);
		}
		if (aJSON.periode) {
			lElement.periode = new ObjetElement_1.ObjetElement().fromJSON(
				aJSON.periode,
			);
		}
		if (aJSON.rangEleve) {
			lElement.rangEleve = aJSON.rangEleve;
		}
		if (aJSON.rangTotal) {
			lElement.rangTotal = aJSON.rangTotal;
		}
		if (aJSON.moyEleve) {
			lElement.moyEleve = aJSON.moyEleve;
		}
		if (aJSON.estMoyNR !== null && aJSON.estMoyNR !== undefined) {
			lElement.estMoyNR = aJSON.estMoyNR;
		}
		if (aJSON.moyClasse) {
			lElement.moyClasse = aJSON.moyClasse;
		}
		if (aJSON.tabMoyennes) {
			lElement.tabMoyennes = aJSON.tabMoyennes;
		}
		if (aJSON.inf8) {
			lElement.inf8 = aJSON.inf8;
		}
		if (aJSON.de8a12) {
			lElement.de8a12 = aJSON.de8a12;
		}
		if (aJSON.sup12) {
			lElement.sup12 = aJSON.sup12;
		}
		if (aJSON.itemLS) {
			lElement.itemLivretScolaire = new ObjetElement_1.ObjetElement().fromJSON(
				aJSON.itemLS,
			);
			this._ajouterCompetence(aJSON.itemLS, lElement.itemLivretScolaire);
		}
		if (aJSON.listeCompetences) {
			lElement.listeCompetences =
				new ObjetListeElements_1.ObjetListeElements().fromJSON(
					aJSON.listeCompetences,
					this._ajouterCompetence,
				);
		}
		if (aJSON.appr) {
			lElement.appreciation = aJSON.appr;
		}
		if (aJSON.apprAnnuelle) {
			lElement.appreciationAnnuelle =
				new ObjetElement_1.ObjetElement().fromJSON(aJSON.apprAnnuelle);
			if (aJSON.apprAnnuelle.editable) {
				lElement.appreciationAnnuelle.editable = aJSON.apprAnnuelle.editable;
			}
			if (aJSON.apprAnnuelle.estRattache) {
				lElement.appreciationAnnuelle.estRattache =
					aJSON.apprAnnuelle.estRattache;
			}
			if (aJSON.apprAnnuelle.tailleMaxSaisie) {
				lElement.appreciationAnnuelle.tailleMaxSaisie =
					aJSON.apprAnnuelle.tailleMaxSaisie;
			}
		}
		lElement.rowspan = aJSON.rowspan ? aJSON.rowspan : 0;
		aParametre.addElement(lElement);
	}
	_ajouterService(aJSON, aElement) {
		if (aJSON.apprAnnuelle) {
			aElement.appreciationAnnuelle =
				new ObjetElement_1.ObjetElement().fromJSON(aJSON.apprAnnuelle);
			if (aJSON.apprAnnuelle.editable) {
				aElement.appreciationAnnuelle.editable = aJSON.apprAnnuelle.editable;
			}
			if (aJSON.apprAnnuelle.estRattache) {
				aElement.appreciationAnnuelle.estRattache =
					aJSON.apprAnnuelle.estRattache;
			}
			if (aJSON.apprAnnuelle.tailleMaxSaisie) {
				aElement.appreciationAnnuelle.tailleMaxSaisie =
					aJSON.apprAnnuelle.tailleMaxSaisie;
			}
		}
	}
	_ajouterCompetence(aJSON, aElement) {
		aElement.estEvaluationLV = aJSON.estEvaluationLV;
		if (aJSON.evaluation) {
			aElement.evaluation = new ObjetElement_1.ObjetElement().fromJSON(
				aJSON.evaluation,
			);
			aElement.evaluation.abbreviation = aJSON.evaluation.abbreviation;
		} else {
			aElement.evaluation = new ObjetElement_1.ObjetElement("", null, 0);
			aElement.evaluation.abbreviation = "";
		}
		aElement.listeNiveaux = aJSON.listeNiveaux;
		aElement.hintNiveaux = aJSON.hintNiveaux;
	}
}
exports.ObjetRequeteLivretScolaire = ObjetRequeteLivretScolaire;
CollectionRequetes_1.Requetes.inscrire(
	"LivretScolaire",
	ObjetRequeteLivretScolaire,
);
