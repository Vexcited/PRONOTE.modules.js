exports.ObjetRequeteSaisieAgenda = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetChaine_1 = require("ObjetChaine");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
class ObjetRequeteSaisieAgenda extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParametres) {
		const lParam = { listeEvenements: null, listePiecesJointes: null };
		$.extend(lParam, aParametres);
		aParametres.listeEvenements.setSerialisateurJSON({
			methodeSerialisation: this.serialiserEvenement.bind(this),
		});
		this.JSON.listeEvenements = aParametres.listeEvenements;
		if (aParametres.listePiecesJointes) {
			aParametres.listePiecesJointes.setSerialisateurJSON({
				methodeSerialisation: _serialiser_Document.bind(this),
			});
			this.JSON.listePiecesJointes = aParametres.listePiecesJointes;
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONRapportSaisie);
		if (this.JSONRapportSaisie.messageCorps) {
			GApplication.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				message:
					(this.JSONRapportSaisie.messageTitre
						? '<div class="Gras EspaceBas">' +
							this.JSONRapportSaisie.messageTitre +
							"</div>"
						: "") +
					"<div>" +
					this.JSONRapportSaisie.messageCorps +
					"</div>",
			});
		}
	}
	serialiserEvenement(aEvenement, aJSON) {
		aJSON.commentaire = aEvenement.Commentaire;
		aJSON.dateDebut = aEvenement.DateDebut;
		aJSON.dateFin = aEvenement.DateFin;
		aJSON.publie = aEvenement.publie;
		if (aEvenement.sansHoraire) {
			aJSON.sansHoraire = true;
		}
		aJSON.estPeriodique = aEvenement.estPeriodique;
		if (aEvenement.estPeriodique) {
			_serialiser_Periodicite.bind(this)(aEvenement, aJSON);
		}
		aJSON.famille = aEvenement.famille;
		aJSON.avecElevesRattaches = aEvenement.avecElevesRattaches;
		aJSON.genresPublicEntite = aEvenement.genresPublicEntite;
		aJSON.avecDirecteur = aEvenement.avecDirecteur;
		aJSON.publicationPageEtablissement =
			aEvenement.publicationPageEtablissement;
		if (!!aEvenement.listePublicEntite) {
			aEvenement.listePublicEntite.setSerialisateurJSON({
				methodeSerialisation: null,
				ignorerEtatsElements: true,
			});
			aJSON.listePublicEntite = aEvenement.listePublicEntite;
		}
		if (!!aEvenement.listePublicIndividu) {
			aEvenement.listePublicIndividu.setSerialisateurJSON({
				methodeSerialisation: null,
				ignorerEtatsElements: true,
			});
			aJSON.listePublicIndividu = aEvenement.listePublicIndividu;
		}
		if (!!aEvenement.listeDocJoints) {
			aEvenement.listeDocJoints.setSerialisateurJSON({
				methodeSerialisation: _serialiser_Document.bind(this),
				ignorerEtatsElements: false,
			});
			aJSON.listeDocumentsJoints = aEvenement.listeDocJoints;
		}
	}
}
exports.ObjetRequeteSaisieAgenda = ObjetRequeteSaisieAgenda;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieAgenda",
	ObjetRequeteSaisieAgenda,
);
function _serialiser_Document(aDocument, aJSON) {
	const lIdFichier =
		aDocument.idFichier !== undefined
			? aDocument.idFichier
			: aDocument.Fichier !== undefined
				? aDocument.Fichier.idFichier
				: null;
	if (lIdFichier !== null) {
		aJSON.idFichier = ObjetChaine_1.GChaine.cardinalToStr(lIdFichier);
	}
	aJSON.nomFichier = aDocument.nomFichier;
	aJSON.url = aDocument.url;
}
function _serialiser_Periodicite(aEvenement, aJSON) {
	aJSON.DateDebutP = aEvenement.periodicite.DateDebut;
	aJSON.DateFinP = aEvenement.periodicite.DateFin;
	aJSON.heureDebut = aEvenement.periodicite.heureDebut;
	aJSON.heureFin = aEvenement.periodicite.heureFin;
	aJSON.sansHoraireP = aEvenement.periodicite.sansHoraire;
	aJSON.avecJourOuvres = aEvenement.periodicite.avecJourOuvres;
	aJSON.estEvtPerso = aEvenement.periodicite.estEvtPerso;
	aJSON.indexJour = aEvenement.periodicite.indexJour;
	aJSON.jourDansSemaine = aEvenement.periodicite.jourDansSemaine;
	aJSON.intervalle = aEvenement.periodicite.intervalle;
	aJSON.jourDuMois = aEvenement.periodicite.jourDuMois;
	aJSON.joursDeLaSemaine = aEvenement.periodicite.joursDeLaSemaine;
	aJSON.type = aEvenement.periodicite.type;
	aJSON.DateEvenement = aEvenement.periodicite.DateEvenement;
}
