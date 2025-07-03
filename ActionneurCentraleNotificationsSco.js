exports.ActionneurCentraleNotificationsSco =
	exports.TypeIdNotificationSessionHttp = void 0;
const Enumere_Onglet_1 = require("Enumere_Onglet");
const MethodesObjet_1 = require("MethodesObjet");
const Invocateur_1 = require("Invocateur");
const ObjetListeElements_1 = require("ObjetListeElements");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const ActionneurCentraleNotificationsCP_1 = require("ActionneurCentraleNotificationsCP");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const UtilitairePartenaire_1 = require("UtilitairePartenaire");
const DocumentsATelecharger_1 = require("DocumentsATelecharger");
const Enumere_Espace_1 = require("Enumere_Espace");
const UtilitaireCasier_1 = require("UtilitaireCasier");
var TypeIdNotificationSessionHttp;
(function (TypeIdNotificationSessionHttp) {
	TypeIdNotificationSessionHttp["insh_IdDiscussions"] = "insh_IdDiscussions";
	TypeIdNotificationSessionHttp["insh_IdCasiers"] = "insh_IdCasiers";
	TypeIdNotificationSessionHttp["insh_IdInformations"] = "insh_IdInformations";
	TypeIdNotificationSessionHttp["insh_IdSujetsForum"] = "insh_IdSujetsForum";
	TypeIdNotificationSessionHttp["insh_IdDemandeRemplacements"] =
		"insh_IdDemandeRemplacements";
	TypeIdNotificationSessionHttp["insh_IdDocumentASigner"] =
		"insh_IdDocumentASigner";
})(
	TypeIdNotificationSessionHttp ||
		(exports.TypeIdNotificationSessionHttp = TypeIdNotificationSessionHttp =
			{}),
);
class ActionneurCentraleNotificationsSco extends ActionneurCentraleNotificationsCP_1.ActionneurCentraleNotificationsCP {
	constructor() {
		super(...arguments);
		this.etatUtilisateurPN = GApplication.getEtatUtilisateur();
	}
	actionSurRequeteURLSignataire(aJSON) {
		if (aJSON.message) {
			UtilitairePartenaire_1.TUtilitairePartenaire.fermerPatience();
			GApplication.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				titre: "",
				message: aJSON.message,
			});
		} else if (aJSON.url) {
			UtilitairePartenaire_1.TUtilitairePartenaire.ouvrirUrl(aJSON.url);
		} else {
			UtilitairePartenaire_1.TUtilitairePartenaire.fermerPatience();
		}
	}
	actionNotification(aNotification) {
		let lOnglet = null;
		let lChangerMembre = null;
		if (aNotification.ouvrirFicheEtab) {
			if (
				global.GEtatUtilisateur &&
				this.etatUtilisateurPN.listeInformationsEtablissements &&
				this.etatUtilisateurPN.listeInformationsEtablissements.parcourir &&
				aNotification.etabNotif &&
				aNotification.etabNotif.getNumero
			) {
				this.etatUtilisateurPN.listeInformationsEtablissements.parcourir(
					(aEtab) => {
						if (aNotification.etabNotif.getNumero() === aEtab.getNumero()) {
							aEtab.relancerNotif = false;
						}
					},
				);
			}
			Invocateur_1.Invocateur.evenement("ouvrir_ficheEtab");
			return;
		}
		if (
			Array.isArray(aNotification.navOnglets) &&
			aNotification.navOnglets.length > 0
		) {
			aNotification.navOnglets.every((aOnglet) => {
				if (this._estOngletVisible(aOnglet)) {
					lOnglet = aOnglet;
					return false;
				}
				return true;
			});
		}
		if (aNotification.detailMessage && aNotification.detailPossession) {
			this.etatUtilisateurPN.message = MethodesObjet_1.MethodesObjet.dupliquer(
				aNotification.detailMessage,
			);
			this.etatUtilisateurPN.message.listePossessionsMessages =
				new ObjetListeElements_1.ObjetListeElements().addElement(
					aNotification.detailPossession,
				);
			this.etatUtilisateurPN.message.estUneDiscussion = true;
			this.etatUtilisateurPN.message.__marquerLu__ = true;
		}
		if (aNotification.estDetailActu) {
			this.etatUtilisateurPN.jeton_OngletInformation_dateNotification =
				aNotification.date;
		}
		if (aNotification.notifRencontre) {
			this.etatUtilisateurPN.jeton_notifRencontre =
				aNotification.notifRencontre;
		}
		if (aNotification.notifBillet) {
			this.etatUtilisateurPN.setContexteBilletBlog(aNotification.notifBillet);
		}
		if (!MethodesObjet_1.MethodesObjet.isNumber(lOnglet)) {
			switch (aNotification.id) {
				case TypeIdNotificationSessionHttp.insh_IdDiscussions:
					lOnglet = Enumere_Onglet_1.EGenreOnglet.Messagerie;
					break;
				case TypeIdNotificationSessionHttp.insh_IdCasiers:
					lOnglet = Enumere_Onglet_1.EGenreOnglet.Casier_MonCasier;
					break;
				case TypeIdNotificationSessionHttp.insh_IdInformations:
					lOnglet = Enumere_Onglet_1.EGenreOnglet.Informations;
					break;
				case TypeIdNotificationSessionHttp.insh_IdSujetsForum:
					lOnglet = Enumere_Onglet_1.EGenreOnglet.ForumPedagogique;
					break;
				case TypeIdNotificationSessionHttp.insh_IdDocumentASigner:
					lOnglet = Enumere_Onglet_1.EGenreOnglet.RemplacementsEnseignants;
					break;
				case TypeIdNotificationSessionHttp.insh_IdDemandeRemplacements: {
					if (
						[
							Enumere_Espace_1.EGenreEspace.Parent,
							Enumere_Espace_1.EGenreEspace.Mobile_Parent,
							Enumere_Espace_1.EGenreEspace.Eleve,
							Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
						].includes(this.etatUtilisateurPN.GenreEspace)
					) {
						lOnglet = Enumere_Onglet_1.EGenreOnglet.DocumentsATelecharger;
					} else {
						lOnglet = Enumere_Onglet_1.EGenreOnglet.Casier_MonCasier;
					}
					break;
				}
				default:
			}
		}
		if (
			aNotification.id === TypeIdNotificationSessionHttp.insh_IdDocumentASigner
		) {
			let lGenreRubrique;
			if (lOnglet === Enumere_Onglet_1.EGenreOnglet.Casier_MonCasier) {
				lGenreRubrique =
					UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
						.documentsASigner;
			} else {
				lGenreRubrique =
					DocumentsATelecharger_1.DocumentsATelecharger.GenreRubriqueDAT
						.documentsASigner;
			}
			this.etatUtilisateurPN.setPage({
				Onglet: lOnglet,
				genreRubrique: lGenreRubrique,
			});
		}
		if (aNotification.id === TypeIdNotificationSessionHttp.insh_IdCasiers) {
			let lGenreRubrique;
			if (lOnglet === Enumere_Onglet_1.EGenreOnglet.Casier_MonCasier) {
				lGenreRubrique =
					UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.monCasier;
			} else {
				lGenreRubrique =
					DocumentsATelecharger_1.DocumentsATelecharger.GenreRubriqueDAT
						.documents;
			}
			this.etatUtilisateurPN.setPage({
				Onglet: lOnglet,
				genreRubrique: lGenreRubrique,
			});
		}
		if (
			aNotification.id ===
				TypeIdNotificationSessionHttp.insh_IdDemandeRemplacements &&
			aNotification.genreAffichage !== undefined
		) {
			this.etatUtilisateurPN.setContexteRemplacementsEnseignant({
				genreAffichage: aNotification.genreAffichage,
				debut: aNotification.debut,
				fin: aNotification.fin,
			});
		}
		let lCallbackAvantNavigation = null;
		if (aNotification.estNotifCours) {
			lCallbackAvantNavigation = () => {
				if (!this.options.estMobile) {
					if (
						!aNotification.domaine ||
						!aNotification.domaine.getSemaines ||
						aNotification.domaine.getSemaines().length === 0
					) {
						return;
					}
					this.etatUtilisateurPN.setDomaineSelectionne(aNotification.domaine);
					this.etatUtilisateurPN._coursASelectionner = aNotification.cours;
				} else {
					if (!aNotification.dateCours) {
						return;
					}
					this.etatUtilisateurPN.setDerniereDate(aNotification.dateCours);
				}
			};
		}
		if (
			aNotification.collecteDocument ||
			(aNotification.modeleDocument &&
				MethodesObjet_1.MethodesObjet.isNumeric(lOnglet))
		) {
			const lGenreRubrique = aNotification.collecteDocument
				? DocumentsATelecharger_1.DocumentsATelecharger.GenreRubriqueDAT
						.documentsAFournir
				: DocumentsATelecharger_1.DocumentsATelecharger.GenreRubriqueDAT
						.documents;
			this.etatUtilisateurPN.setPage({
				Onglet: lOnglet,
				genreRubrique: lGenreRubrique,
			});
		}
		if (this._estOngletVisible(lOnglet)) {
			(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
				if (lCallbackAvantNavigation) {
					if (lCallbackAvantNavigation() === false) {
						return;
					}
				}
				Invocateur_1.Invocateur.evenement(
					Invocateur_1.ObjetInvocateur.events.navigationOnglet,
					lOnglet,
				);
				if (lChangerMembre) {
					Invocateur_1.Invocateur.evenement(
						Invocateur_1.ObjetInvocateur.events.changerMembre,
						lChangerMembre,
					);
				}
			});
		} else {
		}
	}
	_estOngletVisible(aOnglet) {
		if (aOnglet === Enumere_Onglet_1.EGenreOnglet.Accueil) {
			const lOngletAccueil = GEtatUtilisateur.listeOnglets.getElementParGenre(
				Enumere_Onglet_1.EGenreOnglet.Accueil,
			);
			if (lOngletAccueil && lOngletAccueil.Actif) {
				return true;
			}
			return false;
		}
		return this.etatUtilisateurPN.ongletEstVisible(aOnglet);
	}
}
exports.ActionneurCentraleNotificationsSco = ActionneurCentraleNotificationsSco;
