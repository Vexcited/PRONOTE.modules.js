exports.InterfaceConnexion_Mobile = void 0;
const _InterfaceConnexion_1 = require("_InterfaceConnexion");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const ObjetChaine_1 = require("ObjetChaine");
const UtilitaireChangementLangue_1 = require("UtilitaireChangementLangue");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetCryptage_1 = require("ObjetCryptage");
const Enumere_Cryptage_1 = require("Enumere_Cryptage");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_MentionsLegales_1 = require("ObjetFenetre_MentionsLegales");
const ObjetRequeteMentionsLegales_1 = require("ObjetRequeteMentionsLegales");
const LocalStorage_1 = require("LocalStorage");
const MethodesObjet_1 = require("MethodesObjet");
const ModeleInterfaceConnexion = require("InterfaceConnexionMobile.tsxModele");
const MultiObjetFenetreRecupIdMDP = require("ObjetFenetre_RecupIdMDP");
const ObjetRequeteParametresUtilisateur_1 = require("ObjetRequeteParametresUtilisateur");
const UtilitaireSecurisationCompte_1 = require("UtilitaireSecurisationCompte");
const ObjetRequeteIdentification_1 = require("ObjetRequeteIdentification");
const ObjetRequeteAuthentificationPN_1 = require("ObjetRequeteAuthentificationPN");
const Enumere_ErreurAcces_1 = require("Enumere_ErreurAcces");
const lCookieLocalStorage = "etatAffichageCookiesInfo";
class InterfaceConnexion_Mobile extends _InterfaceConnexion_1._InterfaceConnexion {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.parametresSco = this.applicationSco.getObjetParametres();
		this.setOptions({
			genreImageConnexion: this.parametresSco.genreImageConnexion,
			urlImageConnexion: this.parametresSco.urlImageConnexion,
			avecChoixConnexion: this.parametresSco.avecChoixConnexion,
			stockageMDPActive: true,
			avecRecupIdMdp: this.parametresSco.avecRecuperationInfosConnexion,
			parentAutoriseChangerMDP: this.parametresSco.parentAutoriseChangerMDP,
			requetes: {
				getRequeteIdent: (aPere) =>
					new ObjetRequeteIdentification_1.ObjetRequeteIdentification(aPere),
				getRequeteAuth: (aPere) =>
					new ObjetRequeteAuthentificationPN_1.ObjetRequeteAuthentificationPN(
						aPere,
					),
			},
			utilitaireChangementLangue:
				UtilitaireChangementLangue_1.UtilitaireChangementLangue,
		});
	}
	evenementRecupIdMDP() {
		if (this.applicationSco.getModeExclusif()) {
			return this.applicationSco
				.getMessage()
				.afficher({
					message: ObjetTraduction_1.GTraductions.getValeur(
						"fenetreRecupIdMDP.RecupModeConsultation",
					),
				});
		}
		if (
			MultiObjetFenetreRecupIdMDP === null ||
			MultiObjetFenetreRecupIdMDP === void 0
				? void 0
				: MultiObjetFenetreRecupIdMDP.ObjetFenetreRecupIdMDP
		) {
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				MultiObjetFenetreRecupIdMDP.ObjetFenetreRecupIdMDP,
				{
					pere: this,
					initialiser(aInstance) {
						aInstance.setOptions({
							avecRecupParParent: this.options.parentAutoriseChangerMDP,
						});
					},
				},
			).afficher();
		}
	}
	construirePage() {
		const lEstEDT = this.applicationSco.estEDT;
		const lNomApp = lEstEDT
			? "EDT"
			: this.etatUtilisateurSco.pourPrimaire()
				? "PRONOTE PRIMAIRE"
				: "PRONOTE";
		this.id.Form = this.Nom + "form";
		this.id.BandeauLogin = this.Nom + "idBandeauLogin";
		let lCleIdentifiant;
		let lCleMotDePasse;
		let lCleIdentifiantTitre;
		let lCleMdpTitre;
		let lCleMdpMessage;
		if (this.applicationSco.getDemo()) {
			lCleIdentifiant = "connexion.identifiantInfoDemo";
			lCleMotDePasse = "connexion.motDePasseInfoDemo";
			lCleIdentifiantTitre = "connexion.identifiantTitreDemo";
			lCleMdpTitre = "connexion.motDePasseTitreDemo";
			lCleMdpMessage = "connexion.motDePasseMessageDemo";
		} else {
			lCleIdentifiant = "connexion.identifiantInfo";
			lCleMotDePasse = "connexion.motDePasseInfo";
			lCleIdentifiantTitre = "connexion.identifiantTitre";
			lCleMdpTitre = "connexion.motDePasseTitre";
			lCleMdpMessage = "connexion.motDePasseMessage";
		}
		const lParamHtml = {
			id: this.id,
			traductions: {
				texteBouton: ObjetTraduction_1.GTraductions.getValeur(
					"connexion.seConnecter",
				),
				texteIdentifiant: ObjetTraduction_1.GTraductions.getValeur(
					"connexion.identifiant",
				),
				texteTitleIdentifiant: ObjetChaine_1.GChaine.toTitle(
					ObjetTraduction_1.GTraductions.getValeur(lCleIdentifiantTitre) +
						" " +
						ObjetTraduction_1.GTraductions.getValeur(
							"connexion.identifiantMessage",
						),
				),
				texteTitleMotdepasse: ObjetChaine_1.GChaine.toTitle(
					ObjetTraduction_1.GTraductions.getValeur(lCleMdpTitre, [
						this.parametresSco.getNomEspace(),
					]) +
						" " +
						ObjetTraduction_1.GTraductions.getValeur(lCleMdpMessage, [
							ObjetTraduction_1.GTraductions.getValeur("Onglet.Libelle")[
								Enumere_Onglet_1.EGenreOnglet.InfosPerso
							],
						]),
				),
				textePlaceholderIdentifiant: ObjetChaine_1.GChaine.toTitle(
					ObjetTraduction_1.GTraductions.getValeur(lCleIdentifiant),
				),
				textePlaceholderMotdepasse: ObjetChaine_1.GChaine.toTitle(
					ObjetTraduction_1.GTraductions.getValeur(lCleMotDePasse),
				),
				texteMotdepasse: ObjetTraduction_1.GTraductions.getValeur(
					"connexion.motDePasse",
				),
				texteRecupIdMdp: this.options.avecRecupIdMdp
					? ObjetTraduction_1.GTraductions.getValeur(
							"connexion.RecuperationMDP.texte",
						)
					: "",
				ariaDescrRecupIdMdp: this.options.avecRecupIdMdp
					? ObjetChaine_1.GChaine.toTitle(
							ObjetTraduction_1.GTraductions.getValeur(
								"connexion.RecuperationMDP.titre",
							),
						)
					: "",
				mentionsLegales:
					ObjetTraduction_1.GTraductions.getValeur("mentionsLegales"),
				cookiesMessage1: ObjetTraduction_1.GTraductions.getValeur(
					"PiedPage.CookieInfo_Message_1",
				),
				cookiesMessage2: ObjetTraduction_1.GTraductions.getValeur(
					"PiedPage.CookieInfo_Message_2",
				),
				politiqueConfidentialite: ObjetTraduction_1.GTraductions.getValeur(
					"PiedPage.PolitiqueConfidentialite",
				),
				politiqueConfidentialiteMaj: ObjetTraduction_1.GTraductions.getValeur(
					"PiedPage.PolitiqueConfidentialiteMaj",
				),
				confidentialite: ObjetTraduction_1.GTraductions.getValeur(
					"PiedPage.Confidentialite",
				),
				fermer: ObjetTraduction_1.GTraductions.getValeur("Fermer"),
				seSouvenirLabel: ObjetTraduction_1.GTraductions.getValeur(
					"connexion.SeSouvenir",
				),
				seSouvenirInfo: ObjetTraduction_1.GTraductions.getValeur(
					"connexion.SeSouvenirInfo",
				),
				redirigeMobile: ObjetTraduction_1.GTraductions.getValeur(
					"mobile.redirigeVersionMobile",
				),
				retourEspace: ObjetTraduction_1.GTraductions.getValeur(
					"mobile.accederVersionClassique",
				),
			},
			options: {
				titreEtablissement: ObjetChaine_1.GChaine.avecEspaceSiVide(
					this.parametresSco.NomEtablissementConnexion,
				),
				titreLien: this.parametresSco.version,
				nomApplication: lNomApp,
				texteLien: lNomApp + " &copy; " + this.parametresSco.millesime,
				classApplication: "mobile-" + lNomApp.toLowerCase(),
				classLogoName: "logo_" + lNomApp.toLowerCase(),
				nomEspace: this.parametresSco.getNomEspace(),
				publierMentions: this.parametresSco.publierMentions,
				urlSiteIndexEducation: this.parametresSco.urlSiteIndexEducation || "",
				mentionsPagesPubliques: this.parametresSco.mentionsPagesPubliques,
				afficherCookieInfo: !this.applicationSco.getDemo()
					? this.afficherCookieInfo()
					: false,
				urlPolitiqueConfidentialite:
					this.parametresSco.urlConfidentialite || "",
			},
			jsx: {
				jsxNodeOuvrirMentionsLegales:
					this.jsxNodeOuvrirMentionsLegales.bind(this),
				jsxNodeFermerBandeauCoookie:
					this.jsxNodeFermerBandeauCoookie.bind(this),
			},
		};
		const H = [];
		H.push(ModeleInterfaceConnexion.getHtml(lParamHtml));
		return H.join("");
	}
	actionSurMentionsLegales(aParams) {
		let lFenetreMentionsLegales =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_MentionsLegales_1.ObjetFenetre_MentionsLegales,
				{ pere: this, initialiser: function () {} },
			);
		lFenetreMentionsLegales.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"PiedPage.mentionsLegales",
			),
		});
		lFenetreMentionsLegales.setDonnees(aParams);
	}
	jsxNodeOuvrirMentionsLegales(aNode) {
		$(aNode).eventValidation(() => {
			new ObjetRequeteMentionsLegales_1.ObjetRequeteMentionsLegales(
				this,
				this.actionSurMentionsLegales,
			).lancerRequete();
		});
	}
	jsxNodeFermerBandeauCoookie(aNode) {
		$(aNode).eventValidation(() => {
			let lGenreEspace =
				this.etatUtilisateurSco !== undefined
					? "_" + this.etatUtilisateurSco.GenreEspace
					: "";
			LocalStorage_1.IELocalStorage.setItem(
				lCookieLocalStorage + lGenreEspace,
				"false",
			);
			$(aNode).parent().hide();
		});
	}
	callbackInitSecurisationCompte() {
		if (this.estConnexionSansInterface()) {
			const lJPage = $("#" + this.id.pageConnexionAuto.escapeJQ());
			const lJParent = lJPage.parent();
			lJPage.remove();
			lJParent.ieHtmlAppend(this.construirePage(), {
				controleur: this.controleur,
			});
		}
		ObjetHtml_1.GHtml.setDisplay(this.id.Form, false);
	}
	callbackPersonnalisationMDPPromise(aParam) {
		ObjetHtml_1.GHtml.setDisplay(this.id.Form, false);
		return UtilitaireSecurisationCompte_1.UtilitaireSecurisationCompte.demarrerPersonnalisationMDP(
			aParam,
		);
	}
	callbackSecurisationDoubleAuthPromise(aParam) {
		ObjetHtml_1.GHtml.setDisplay(this.id.Form, false);
		return UtilitaireSecurisationCompte_1.UtilitaireSecurisationCompte.demarrerDoubleAut(
			aParam,
		);
	}
	async _reussiteAuthentification(aParamsAuthentification) {
		if (GApplication.estAppliMobile) {
			this.mettreAJourInfoCollectiviteAppliMobile();
			this.mettreAJourInfoAppliMobile();
		}
		const lReponse =
			await new ObjetRequeteParametresUtilisateur_1.ObjetRequeteParametresUtilisateur(
				this,
			).lancerRequete({
				motDePasseInvalide:
					aParamsAuthentification.motDePasseInvalide || undefined,
			});
		const lParams = Object.assign(aParamsAuthentification, lReponse);
		this.applicationSco.initAuthentification(lParams);
		this.etatUtilisateurSco.initAuthentification(lParams);
		this.parametresSco.initAuthentification(lParams);
		const lOnglet = this._getOngletDemarrage();
		if (lOnglet !== null) {
			this.etatUtilisateurSco.setGenreOnglet(lOnglet);
		}
		const lParametres = {
			libelle: this.etatUtilisateurSco.Identification.ressource.getLibelle(),
			listeRessource: this.etatUtilisateurSco.Identification.ListeRessources,
		};
		if (lParams.messageAucuneEleve) {
			lParametres.message = lParams.messageAucuneEleve;
		}
		this.applicationSco.afficherEspaceApresAuthentification(lParametres);
	}
	_echecAuthentification() {
		const lMessageErreur = this.moteurConnexion.erreur
			? this.moteurConnexion.erreur.message || ""
			: "";
		if (this.moteurConnexion.modeValidationAppliMobile) {
			window.loginState = { status: 1, message: lMessageErreur };
		} else if (this.applicationSco.estAppliMobile) {
			if (
				this.moteurConnexion.erreurCode ===
				Enumere_ErreurAcces_1.EGenreErreurAcces.Identification
			) {
				window.messageData.push({
					action: "surNonAuth",
					message: lMessageErreur,
				});
			} else {
				window.messageData.push({
					action: "erreurAuth",
					message: lMessageErreur,
				});
			}
		}
	}
	passerEnModeValidationAppliMobile(
		aLogin,
		aUuid,
		aJeton,
		aCode,
		aJsonInfoDevice,
	) {
		var _a, _b;
		this.moteurConnexion.modeValidationAppliMobile = true;
		this.moteurConnexion.uuidAppliMobile = aUuid;
		this.moteurConnexion.modeValidationAppliMobileJeton =
			!!aLogin && !!aUuid && !!aJeton && !!aCode;
		if (!!aJsonInfoDevice && aJsonInfoDevice.length > 0) {
			const lInfo = JSON.parse(aJsonInfoDevice);
			this.moteurConnexion.informationsAppareil = {
				modele: (_a = lInfo.model) !== null && _a !== void 0 ? _a : "",
				platforme: (_b = lInfo.platform) !== null && _b !== void 0 ? _b : "",
			};
		}
		$("#" + this.id.checkSouvenir)
			.closest("div.check-field")
			.hide();
		$("#" + this.id.btnConnexion).text(
			ObjetTraduction_1.GTraductions.getValeur("Valider"),
		);
		if (this.moteurConnexion.modeValidationAppliMobileJeton) {
			const lLoginDecode = ObjetCryptage_1.GCryptage.decrypter({
				genreCryptage: Enumere_Cryptage_1.EGenreCryptage.AES,
				chaine: aLogin,
				cle: ObjetCryptage_1.GCryptage.getBuffer(aCode),
				iv: ObjetCryptage_1.GCryptage.getBuffer(""),
			});
			const lJetonDecode = ObjetCryptage_1.GCryptage.decrypter({
				genreCryptage: Enumere_Cryptage_1.EGenreCryptage.AES,
				chaine: aJeton,
				cle: ObjetCryptage_1.GCryptage.getBuffer(aCode),
				iv: ObjetCryptage_1.GCryptage.getBuffer(""),
			});
			setTimeout(
				this.traiterEvenementValidation.bind(
					this,
					lLoginDecode,
					lJetonDecode,
					null,
					aUuid,
				),
				250,
			);
		} else if (aLogin) {
			this.moteurConnexion.setLogin(aLogin);
			$("#" + this.id.identification)
				.focus()
				.blur();
		}
	}
	afficherCookieInfo() {
		let lGenreEspace = this.etatUtilisateurSco
			? "_" + this.etatUtilisateurSco.GenreEspace
			: "";
		if (
			LocalStorage_1.IELocalStorage.getItem(
				lCookieLocalStorage + lGenreEspace,
			) === null
		) {
			LocalStorage_1.IELocalStorage.setItem(
				lCookieLocalStorage + lGenreEspace,
				"true",
			);
		}
		return (
			LocalStorage_1.IELocalStorage.getItem(
				lCookieLocalStorage + lGenreEspace,
			) === "true"
		);
	}
	mettreAJourInfoAppliMobile() {
		if (!GApplication.estAppliMobile || !window.messageData) {
			return;
		}
		const lInfos = {
			genreEspace: GEtatUtilisateur.getNumeroGenreEspace(),
			version: this.parametresSco.tableauVersion,
		};
		window.messageData.push({
			action: "infoApresAuthentificationReussite",
			data: JSON.stringify(lInfos),
		});
	}
	mettreAJourInfoCollectiviteAppliMobile() {
		if (!GApplication.estAppliMobile || !window.messageData) {
			return;
		}
		if (!this.parametresSco.collectivite) {
			return;
		}
		window.messageData.push({
			action: "infoCollectivite",
			data: JSON.stringify(this.parametresSco.collectivite),
		});
	}
	_getOngletDemarrage() {
		if (
			MethodesObjet_1.MethodesObjet.isNumeric(
				this.etatUtilisateurSco.getGenreOnglet(),
			)
		) {
			return null;
		}
		let lOnglet = null;
		if (
			this.etatUtilisateurSco.avecPageAccueil() &&
			this.etatUtilisateurSco.estOngletAutorise(
				Enumere_Onglet_1.EGenreOnglet.Accueil,
			) &&
			((this.applicationSco.parametresUtilisateur.has(
				"demarrerSurPageAccueil",
			) &&
				this.applicationSco.parametresUtilisateur.get(
					"demarrerSurPageAccueil",
				)) ||
				lOnglet === null)
		) {
			lOnglet = Enumere_Onglet_1.EGenreOnglet.Accueil;
		}
		return lOnglet;
	}
}
exports.InterfaceConnexion_Mobile = InterfaceConnexion_Mobile;
