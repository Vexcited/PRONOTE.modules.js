exports.ObjetRequeteSaisieCasier = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetChaine_1 = require("ObjetChaine");
const CollectionRequetes_1 = require("CollectionRequetes");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_Etat_1 = require("Enumere_Etat");
const UtilitaireCasier_1 = require("UtilitaireCasier");
class ObjetRequeteSaisieCasier extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		var _a, _b;
		const lParam = {
			genreSaisie: ObjetRequeteSaisieCasier.EGenreSaisie.saisieCasier,
		};
		$.extend(lParam, aParam);
		this.JSON.genreSaisie = aParam.genreSaisie;
		this.JSON.typeConsultation = aParam.typeConsultation;
		if (lParam.listeLignes) {
			lParam.listeLignes.setSerialisateurJSON({
				methodeSerialisation: this._serialisation.bind(this),
			});
			this.JSON.listeLignes = lParam.listeLignes;
		}
		switch (aParam.genreSaisie) {
			case ObjetRequeteSaisieCasier.EGenreSaisie.marquerLus:
			case ObjetRequeteSaisieCasier.EGenreSaisie.marquerNonLus:
				if (lParam.documents) {
					lParam.documents.setSerialisateurJSON({ ignorerEtatsElements: true });
					this.JSON.documents = aParam.documents;
				} else if (lParam.document) {
					this.JSON.document = aParam.document;
				} else {
				}
				break;
			case ObjetRequeteSaisieCasier.EGenreSaisie.marquerLectureDocument:
				this.JSON.documentLu = aParam.documentLu;
				break;
			case ObjetRequeteSaisieCasier.EGenreSaisie.saisieCollecte:
				(_a = lParam.collectes) === null || _a === void 0
					? void 0
					: _a.setSerialisateurJSON({
							methodeSerialisation: this.serialiserCollecte.bind(this),
							ignorerEtatsElements: true,
						});
				this.JSON.collectes = lParam.collectes;
				break;
			case ObjetRequeteSaisieCasier.EGenreSaisie.saisieDocumentEleve:
				this.JSON.documentsEleve =
					(_b = lParam.documentsEleve) === null || _b === void 0
						? void 0
						: _b.setSerialisateurJSON({
								methodeSerialisation: this.serialiserDocumentEleve.bind(this),
							});
				break;
		}
		return this.appelAsynchrone();
	}
	serialiserDocumentEleve(aElement, aJSON) {
		if (aElement.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression) {
			if ("collecte" in aElement) {
				aJSON.collecte = aElement.collecte;
			}
			if ("cible" in aElement) {
				aJSON.cible = aElement.cible;
			}
			if ("idFichier" in aElement) {
				aJSON.idFichier = aElement.idFichier;
			}
		}
	}
	serialiserCollecte(aElement, aJSON) {
		var _a;
		if ("genreDestinataireCollecte" in aElement) {
			aJSON.genreDestinataireCollecte = aElement.genreDestinataireCollecte;
		}
		if ("sansDepotEspace" in aElement) {
			aJSON.sansDepotEspace = aElement.sansDepotEspace;
		}
		if ("sansDateLimite" in aElement) {
			aJSON.sansDateLimite = aElement.sansDateLimite;
		}
		if ("dateEcheance" in aElement) {
			aJSON.dateEcheance = aElement.dateEcheance;
		}
		if ("notification" in aElement) {
			aJSON.notification = aElement.notification;
		}
		if (
			"listeIndividuAccesAutorise" in aElement &&
			aElement.listeIndividuAccesAutorise
		) {
			(_a = aElement.listeIndividuAccesAutorise) === null || _a === void 0
				? void 0
				: _a.setSerialisateurJSON({ ignorerEtatsElements: true });
			aJSON.listeIndividuAccesAutorise = aElement.listeIndividuAccesAutorise;
		}
		if ("destinataires" in aElement && aElement.destinataires) {
			aJSON.destinataires = this.serialiserDestinataire(aElement.destinataires);
		}
	}
	serialiserDestinataire(aDestinataire) {
		var _a;
		const lJson = {};
		if ("genreIndivAssocieAuCriteresSelectionne" in aDestinataire) {
			lJson.genreIndivAssocieAuCriteresSelectionne =
				aDestinataire.genreIndivAssocieAuCriteresSelectionne;
		}
		if ("listeDestinataires" in aDestinataire) {
			(_a = aDestinataire.listeDestinataires) === null || _a === void 0
				? void 0
				: _a.setSerialisateurJSON({ ignorerEtatsElements: true });
			lJson.listeDestinataires = aDestinataire.listeDestinataires;
		}
		if ("typeChoixTelechargement" in aDestinataire) {
			lJson.typeChoixTelechargement = aDestinataire.typeChoixTelechargement;
		}
		if ("listeCriteres" in aDestinataire) {
			aDestinataire.listeCriteres.forEach((aCriteres) => {
				var _a;
				(_a = aCriteres.listeElements) === null || _a === void 0
					? void 0
					: _a.setSerialisateurJSON({ ignorerEtatsElements: true });
			});
			lJson.listeCriteres = aDestinataire.listeCriteres;
		}
		return lJson;
	}
	_serialisation(aElement, aJSON) {
		aJSON.memo = aElement.memo;
		if (
			UtilitaireCasier_1.UtilitaireCasier.isObjetElementDepositaire(aElement)
		) {
			const lPropsListe = [
				"listePersonnels",
				"listeProfesseurs",
				"listeMaitreStage",
				"listeEquipesPedagogique",
			];
			lPropsListe.forEach((aProps) => {
				if (aElement[aProps]) {
					aElement[aProps].setSerialisateurJSON({ ignorerEtatsElements: true });
					aJSON[aProps] = aElement[aProps].toJSON();
				}
			});
		}
		if ("dateDebut" in aElement && aElement.dateDebut) {
			aJSON.dateDebut = aElement.dateDebut;
		}
		if ("dateFin" in aElement && aElement.dateFin) {
			aJSON.dateFin = aElement.dateFin;
		}
		if ("avecEnvoiGroupePersonnel" in aElement) {
			aJSON.avecEnvoiGroupePersonnel = aElement.avecEnvoiGroupePersonnel;
		}
		if ("avecEnvoiGroupeProfesseur" in aElement) {
			aJSON.avecEnvoiGroupeProfesseur = aElement.avecEnvoiGroupeProfesseur;
		}
		if ("avecEnvoiGroupeMaitreDeStage" in aElement) {
			aJSON.avecEnvoiGroupeMaitreDeStage =
				aElement.avecEnvoiGroupeMaitreDeStage;
		}
		if ("avecEnvoiGroupeResponsable" in aElement) {
			aJSON.avecEnvoiGroupeResponsable = aElement.avecEnvoiGroupeResponsable;
		}
		if ("avecEnvoiGroupeEleve" in aElement) {
			aJSON.avecEnvoiGroupeEleve = aElement.avecEnvoiGroupeEleve;
		}
		if (aElement.documentCasier) {
			aJSON.documentCasier = aElement.documentCasier;
			aJSON.idFichier = MethodesObjet_1.MethodesObjet.isNumber(
				aElement.documentCasier.idFichier,
			)
				? ObjetChaine_1.GChaine.cardinalToStr(aElement.documentCasier.idFichier)
				: aElement.documentCasier.idFichier;
			if (aElement.documentCasier.url) {
				aJSON.url = aElement.documentCasier.url;
			}
		}
		if (aElement.categorie) {
			aJSON.categorie = aElement.categorie;
		}
		if ("avecEnvoiDirecteur" in aElement) {
			aJSON.avecEnvoiDirecteur = aElement.avecEnvoiDirecteur;
		}
		aJSON.estModifiableParDestinataires =
			!!aElement.estModifiableParDestinataires;
		if ("destinataires" in aElement) {
			aJSON.destinataires = {};
			if ("responsables" in aElement.destinataires) {
				aJSON.destinataires.responsables = this.serialiserDestinataire(
					aElement.destinataires.responsables,
				);
			}
			if ("eleves" in aElement.destinataires) {
				aJSON.destinataires.eleves = this.serialiserDestinataire(
					aElement.destinataires.eleves,
				);
			}
		}
	}
}
exports.ObjetRequeteSaisieCasier = ObjetRequeteSaisieCasier;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieCasier",
	ObjetRequeteSaisieCasier,
);
(function (ObjetRequeteSaisieCasier) {
	let EGenreSaisie;
	(function (EGenreSaisie) {
		EGenreSaisie[(EGenreSaisie["saisieCasier"] = 0)] = "saisieCasier";
		EGenreSaisie[(EGenreSaisie["marquerLectureDocument"] = 1)] =
			"marquerLectureDocument";
		EGenreSaisie[(EGenreSaisie["marquerLus"] = 2)] = "marquerLus";
		EGenreSaisie[(EGenreSaisie["marquerNonLus"] = 3)] = "marquerNonLus";
		EGenreSaisie[(EGenreSaisie["saisieCollecte"] = 4)] = "saisieCollecte";
		EGenreSaisie[(EGenreSaisie["saisieDocumentEleve"] = 5)] =
			"saisieDocumentEleve";
	})(
		(EGenreSaisie =
			ObjetRequeteSaisieCasier.EGenreSaisie ||
			(ObjetRequeteSaisieCasier.EGenreSaisie = {})),
	);
})(
	ObjetRequeteSaisieCasier ||
		(exports.ObjetRequeteSaisieCasier = ObjetRequeteSaisieCasier = {}),
);
