exports.InterfaceFicheEleve = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequeteFicheEleve_1 = require("ObjetRequeteFicheEleve");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTabOnglets_1 = require("ObjetTabOnglets");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetInterface_1 = require("ObjetInterface");
const GUID_1 = require("GUID");
const UtilitaireProjetAccompagnement_1 = require("UtilitaireProjetAccompagnement");
const DonneesListe_MemosEleves_1 = require("DonneesListe_MemosEleves");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetFenetre_Attestation_1 = require("ObjetFenetre_Attestation");
const ObjetFenetre_ProjetAccompagnement_1 = require("ObjetFenetre_ProjetAccompagnement");
const ObjetFenetre_MemoEleve_1 = require("ObjetFenetre_MemoEleve");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetRequeteSaisieMemoEleve_1 = require("ObjetRequeteSaisieMemoEleve");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetFenetre_DetailsPIEleve_1 = require("ObjetFenetre_DetailsPIEleve");
const ObjetFenetre_Discussion_1 = require("ObjetFenetre_Discussion");
const AccessApp_1 = require("AccessApp");
const Enumere_Connexion_1 = require("Enumere_Connexion");
const ObjetFenetre_Message_1 = require("ObjetFenetre_Message");
const ObjetDiscussion_Mobile_1 = require("ObjetDiscussion_Mobile");
const MoteurMessagerie_1 = require("MoteurMessagerie");
const ObjetFenetre_DepotDocument_1 = require("ObjetFenetre_DepotDocument");
const TypeCasier_1 = require("TypeCasier");
class InterfaceFicheEleve extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.sansFocusPolling = null;
		this.idIdentite = GUID_1.GUID.getId();
		this.idScolarite = GUID_1.GUID.getId();
		this.idResponsables = GUID_1.GUID.getId();
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.aut = {
			identiteEleve: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.consulterIdentiteEleve,
			),
			saisieAttestations: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.avecSaisieAttestations,
			),
			ficheResponsables: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.consulterFichesResponsables,
			),
			photoEleve: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.consulterPhotosEleves,
			),
			memos:
				[
					Enumere_Espace_1.EGenreEspace.PrimProfesseur,
					Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
					Enumere_Espace_1.EGenreEspace.Professeur,
					Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
					Enumere_Espace_1.EGenreEspace.Etablissement,
					Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
					Enumere_Espace_1.EGenreEspace.PrimDirection,
					Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
				].includes(this.etatUtilisateurSco.GenreEspace) &&
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.dossierVS.consulterMemosEleve,
				),
			attestationEtendue: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.attestationEtendue,
			),
			estPeriscolaire:
				this.etatUtilisateurSco.pourPrimaire() &&
				[
					Enumere_Espace_1.EGenreEspace.PrimPeriscolaire,
					Enumere_Espace_1.EGenreEspace.Mobile_PrimPeriscolaire,
				].includes(this.etatUtilisateurSco.GenreEspace),
			afficherDiscussionCommuneResp:
				[
					Enumere_Espace_1.EGenreEspace.Professeur,
					Enumere_Espace_1.EGenreEspace.Etablissement,
				].includes(this.etatUtilisateurSco.GenreEspace) &&
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.communication.avecDiscussion,
				) &&
				!this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.communication.discussionInterdit,
				),
		};
		this.ongletActif = [this.aut.identiteEleve, this.aut.ficheResponsables];
		const lNom = GUID_1.GUID.getId();
		this.idContenuOnglet = lNom + "_contenuOnglets";
		this.idDivScrollResp = lNom + "_divScrollResp_";
	}
	construireInstances() {
		this.identTabs = this.add(
			ObjetTabOnglets_1.ObjetTabOnglets,
			this.evenementSurTab,
			this.initialiserTabs,
		);
		this.identListeMemosEleves = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListeMemo,
			this.initialiserListeMemos,
		);
	}
	initialiserListeMemos(aInstance) {
		aInstance.setOptionsListe({
			ariaLabel: this.etatUtilisateurSco.pourPrimaire()
				? ObjetTraduction_1.GTraductions.getValeur("FicheEleve.memoInterne")
				: ObjetTraduction_1.GTraductions.getValeur("FicheEleve.memoVS"),
			avecLigneCreation: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.dossierVS.saisirMemos,
			),
			titreCreation: ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.CreerUnMemo",
			),
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			forcerOmbreScrollBottom: true,
			nonEditableSurModeExclusif: true,
			messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.aucunMemo",
			),
		});
	}
	setOptions(aParam) {
		this.ongletsAffiches = {
			identite: true,
			responsables: true,
			memos: true,
			attestations: true,
			projets: true,
		};
		$.extend(this.ongletsAffiches, aParam);
		return this;
	}
	verifierExistence(aElement) {
		let existe = false;
		for (let i = 0; i < this.scolariteEleve.listeProjets.count(); i++) {
			const elt = this.scolariteEleve.listeProjets.get(i);
			if (
				elt.projetIndividuel.getLibelle() ===
				this.listeTypes.get(aElement).getLibelle()
			) {
				existe = !!elt.debut
					? ObjetDate_1.GDate.estDateEgale(
							elt.debut,
							ObjetDate_1.GDate.premiereDate,
						)
					: true;
				break;
			}
		}
		return existe;
	}
	composeBoutonsCommunication() {
		return IE.jsx.str(
			"div",
			{
				"ie-if": this.jsxIfBontonsCommunication.bind(this),
				class: [
					"flex-contain",
					"flex-wrap",
					"flex-gap-l",
					"flex-center",
					"justify-end",
				],
			},
			IE.jsx.str(
				"ie-bouton",
				{
					"ie-if": this.jsxIfAvecBtnDiscussion.bind(this),
					"ie-model": this.jsxGetModelBtnDiscussion.bind(this),
					class: "small-bt themeBoutonNeutre",
					"aria-haspopup": "dialog",
				},
				ObjetTraduction_1.GTraductions.getValeur(
					"fenetreCommunication.bouton.demarrerDiscussion",
				),
			),
			IE.jsx.str(
				"ie-bouton",
				{
					"ie-if": this.jsxIfAvecBtnDocument.bind(this),
					"ie-model": this.jsxGetModelBtnDocument.bind(this),
					class: "small-bt themeBoutonNeutre",
					"aria-haspopup": "dialog",
				},
				ObjetTraduction_1.GTraductions.getValeur("Casier.diffuserDocument"),
			),
		);
	}
	setDonnees(aParams) {
		if (
			!MethodesObjet_1.MethodesObjet.isNumeric(aParams.onglet) &&
			MethodesObjet_1.MethodesObjet.isNumeric(
				this.etatUtilisateurSco.ongletSelectionneFicheEleve,
			)
		) {
			aParams.onglet = this.etatUtilisateurSco.ongletSelectionneFicheEleve;
		}
		if (aParams.onglet !== undefined && aParams.onglet !== null) {
			this.getInstance(this.identTabs).ongletSelectionne = aParams.onglet;
		}
		this.sansFocusPolling = aParams.sansFocusPolling;
		this.eleve = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Eleve,
		);
		this.eleve.avecPhoto = true;
		if (!this.eleve || !this.eleve.existeNumero()) {
			if (this.Pere.fermer) {
				this.Pere.fermer();
			}
			return;
		}
		this.actualiser();
	}
	actualiser() {
		const lParam = {
			Eleve: this.eleve,
			AvecEleve: this.aut.identiteEleve,
			AvecResponsables: this.aut.ficheResponsables,
		};
		new ObjetRequeteFicheEleve_1.ObjetRequeteFicheEleve(
			this,
			this.actionSurReponseRequete,
		)
			.setOptions({ sansBlocageInterface: this.sansFocusPolling })
			.lancerRequete(lParam);
	}
	actionSurReponseRequete(
		aIdentite,
		aScolarite,
		aListeTypes,
		aListeMotifs,
		aListeAttestations,
		aListeResponsables,
		aListeMemos,
	) {
		this.scolariteEleve = aScolarite;
		this.identiteEleve = aIdentite;
		this.listeTypes = aListeTypes;
		this.listeAttestations = aListeAttestations;
		this.listeMotifs = aListeMotifs;
		this.listeResponsables = aListeResponsables;
		this.listeMemosEleves = aListeMemos;
		this.estValorisation = false;
		this.initialiserTabs(this.getInstance(this.identTabs));
		const ancienOnglet = this.getInstance(this.identTabs).ongletSelectionne;
		this.getInstance(this.identTabs).ongletSelectionne = 0;
		const lSelect = ancienOnglet;
		let positionOnglet = 0;
		for (let i = 0; i < this.listeOnglets.count(); i++) {
			if (this.listeOnglets.get(i).Genre === lSelect) {
				positionOnglet = i;
			}
		}
		this.getInstance(this.identTabs).selectOnglet(positionOnglet);
		if (!!this.Pere.setOptionsFenetre) {
			let lParams = {};
			if (IE.estMobile) {
				lParams = {
					titreNavigation: this.composeTitreFenetre(),
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"FicheEleve.titrePanelMobile",
					),
				};
			} else {
				lParams = { titre: this.composeTitreFenetre() };
			}
			this.Pere.setOptionsFenetre(lParams);
		}
	}
	initialiserTabs(aInstance) {
		this.ongletsAffiches = {
			identite: true,
			scolarite: true,
			responsables: true,
			memos: true,
			attestations: true,
			projets: true,
		};
		if ("listeOnglets" in this.Pere) {
			$.extend(this.ongletsAffiches, this.Pere.listeOnglets);
		}
		this.listeOnglets = new ObjetListeElements_1.ObjetListeElements();
		if (this.aut.identiteEleve && this.ongletsAffiches.identite) {
			this.listeOnglets.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("FicheEleve.identite"),
					0,
					InterfaceFicheEleve.genreOnglet.Identite,
				),
			);
		}
		if (this.aut.identiteEleve && this.ongletsAffiches.scolarite) {
			this.listeOnglets.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("FicheEleve.scolarite"),
					0,
					InterfaceFicheEleve.genreOnglet.Scolarite,
				),
			);
		}
		if (this.aut.ficheResponsables && this.ongletsAffiches.responsables) {
			this.listeOnglets.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("FicheEleve.responsables"),
					0,
					InterfaceFicheEleve.genreOnglet.Responsables,
				),
			);
		}
		if (this.aut.memos && this.ongletsAffiches.memos) {
			let lLibelleTabMemo = this.etatUtilisateurSco.pourPrimaire()
				? ObjetTraduction_1.GTraductions.getValeur("FicheEleve.memoInterne")
				: ObjetTraduction_1.GTraductions.getValeur("FicheEleve.memoVS");
			this.listeOnglets.addElement(
				new ObjetElement_1.ObjetElement(
					lLibelleTabMemo,
					0,
					InterfaceFicheEleve.genreOnglet.Memos,
				),
			);
		}
		aInstance.setOptionsTabOnglets({ idSwipe: this.idContenuOnglet });
		aInstance.setDonnees(this.listeOnglets);
	}
	construireStructureAffichage() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str("div", {
				class: "menu-tabs-wrapper",
				id: this.getNomInstance(this.identTabs),
			}),
			IE.jsx.str(
				"div",
				{
					id: this.idContenuOnglet,
					class: "content-wrapper full-height",
					style: "overflow:auto;",
				},
				IE.jsx.str("div", { id: this.idIdentite }),
				IE.jsx.str("div", { id: this.idScolarite }),
				IE.jsx.str("div", { id: this.idResponsables }),
				IE.jsx.str("div", {
					id: this.getNomInstance(this.identListeMemosEleves),
					style: "height:100%",
				}),
			),
		);
	}
	composeTitreFenetre() {
		return (
			this.identiteEleve.prenom +
			" " +
			this.identiteEleve.nom +
			"<br/>" +
			this.scolariteEleve.classe
		);
	}
	composeOnglet(aGenreOnglet) {
		const lGenreOnglet = aGenreOnglet
			? aGenreOnglet
			: this.getGenreOngletSelectionne();
		switch (lGenreOnglet) {
			case InterfaceFicheEleve.genreOnglet.Identite:
				$("#" + this.idIdentite.escapeJQ())
					.show()
					.siblings()
					.hide();
				ObjetHtml_1.GHtml.setHtml(
					this.idIdentite,
					this.composeIdentiteEleve(),
					{ controleur: this.controleur },
				);
				break;
			case InterfaceFicheEleve.genreOnglet.Scolarite:
				$("#" + this.idScolarite.escapeJQ())
					.show()
					.siblings()
					.hide();
				ObjetHtml_1.GHtml.setHtml(this.idScolarite, this.composeScolarite(), {
					controleur: this.controleur,
				});
				break;
			case InterfaceFicheEleve.genreOnglet.Responsables:
				$("#" + this.idResponsables.escapeJQ())
					.show()
					.siblings()
					.hide();
				ObjetHtml_1.GHtml.setHtml(
					this.idResponsables,
					this.composeResponsablesEleve(
						InterfaceFicheEleve.genreOnglet.Responsables,
					),
					{ controleur: this.controleur },
				);
				break;
			case InterfaceFicheEleve.genreOnglet.Memos:
				$("#" + this.getNomInstance(this.identListeMemosEleves).escapeJQ())
					.show()
					.siblings()
					.hide();
				this._actualiserListeMemo();
				break;
			default:
				break;
		}
	}
	avecInfosCoordonnees() {
		const t = this.identiteEleve;
		this.avecInfosAdresse = !!(
			t.adresse1 ||
			t.adresse2 ||
			t.adresse3 ||
			t.adresse4 ||
			t.CP ||
			t.ville ||
			t.pays
		);
		this.avecInfosMedia = !!(t.telPort || t.email);
		return this.avecInfosAdresse || this.avecInfosMedia;
	}
	evenementSurTab(aElement) {
		if (aElement) {
			this.tabSelectionne = aElement;
			this.etatUtilisateurSco.ongletSelectionneFicheEleve =
				this.tabSelectionne.getGenre();
		}
		this.composeOnglet();
	}
	surValidation(aNumeroBouton) {
		this.Pere.fermer();
		this.scolariteEleve.listeTypes = this.listeTypes;
		this.Pere.callback.appel(aNumeroBouton, this.eleve, this.scolariteEleve);
	}
	setOngletActif(aGenreOnglet) {
		if (MethodesObjet_1.MethodesObjet.isNumeric(aGenreOnglet)) {
			this.ongletActif[aGenreOnglet] = true;
		}
	}
	getGenreOngletSelectionne() {
		return this.tabSelectionne ? this.tabSelectionne.getGenre() : null;
	}
	jsxModeleBoutonEditerAttestation(aAttestation) {
		return {
			event: () => {
				if (aAttestation) {
					this._ouvrirFenetreAttestation(aAttestation);
				}
			},
		};
	}
	jsxModeleBoutonAfficherDiscussionsCommunes(aResp) {
		return {
			event: () => {
				if (aResp) {
					ObjetFenetre_Discussion_1.ObjetFenetre_Discussion.afficherDiscussionsCommunes(
						new ObjetListeElements_1.ObjetListeElements().add(aResp),
					);
				}
			},
		};
	}
	jsxModeleBoutonCreerAttestation() {
		return {
			event: () => {
				this._ouvrirFenetreAttestation();
			},
			getDisabled: () => {
				return (
					this.scolariteEleve.listeAttestations &&
					this.listeAttestations &&
					this.scolariteEleve.listeAttestations.getNbrElementsExistes() ===
						this.listeAttestations.getNbrElementsExistes()
				);
			},
		};
	}
	jsxModeleBoutonCreerProjetAccompagnement() {
		return {
			event: () => {
				this._ouvrirFenetreProjetAccompagnement();
			},
		};
	}
	jsxGetHtmlAttestation() {
		return this.composeAttestations();
	}
	jsxGetHtmlProjetAccompagnement() {
		return this._composeProjetsAccompagnement();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnEditProjetAccompagnement: {
				event: function (aNumero) {
					let lProjet;
					if (
						aInstance.scolariteEleve &&
						aInstance.scolariteEleve.listeProjets
					) {
						lProjet =
							aInstance.scolariteEleve.listeProjets.getElementParNumero(
								aNumero,
							);
					}
					aInstance._ouvrirFenetreProjetAccompagnement(lProjet);
				},
			},
			afficherFenetreDetailsPIEleve: {
				event(aNumero) {
					if (
						aInstance.scolariteEleve &&
						aInstance.scolariteEleve.listeProjets
					) {
						const lProjet =
							aInstance.scolariteEleve.listeProjets.getElementParNumero(
								aNumero,
							);
						aInstance._ouvrirFenetreDetailsPIEleve(lProjet);
					}
				},
			},
		});
	}
	jsxIfBontonsCommunication() {
		const lEstConnexionEnClasse =
			this.etatUtilisateurSco.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Professeur &&
			this.etatUtilisateurSco.genreConnexion ===
				Enumere_Connexion_1.EGenreConnexion.Allegee;
		const lAvecDiscussion = this.jsxIfAvecBtnDiscussion();
		const lAvecDiffusionDocument = this.jsxIfAvecBtnDocument();
		return (
			!this.etatUtilisateurSco.pourPrimaire() &&
			!lEstConnexionEnClasse &&
			(lAvecDiscussion || lAvecDiffusionDocument)
		);
	}
	jsxIfAvecBtnDiscussion() {
		var _a;
		return (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.avecDiscussion,
			) &&
			!this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.discussionInterdit,
			) &&
			((_a = this.identiteEleve) === null || _a === void 0
				? void 0
				: _a.avecDiscussion)
		);
	}
	jsxIfAvecBtnDocument() {
		return ObjetFenetre_DepotDocument_1.ObjetFenetre_DepotDocument.avecDroitSaisieResponsable();
	}
	jsxGetModelBtnDiscussion() {
		return {
			event: () => {
				if (IE.estMobile) {
					const lFenetre = new ObjetDiscussion_Mobile_1.ObjetDiscussion_Mobile({
						pere: this,
						moteurMessagerie:
							new MoteurMessagerie_1.MoteurMessagerie().setOptions({
								instance: this,
							}),
					});
					lFenetre
						.setOptions({
							estDiscussionEnFenetre: true,
							genreRessource: Enumere_Ressource_1.EGenreRessource.Eleve,
							avecDestinatairesListeDiffusion: false,
							avecChoixDestinataires: false,
							callbackEnvoyer: () => {
								lFenetre.masquer();
							},
							callbackFermeture: () => {
								lFenetre.free();
							},
						})
						.setDonnees({
							creationDiscussion: true,
							destinataires: {
								listeDestinataires: new ObjetListeElements_1.ObjetListeElements(
									this.identiteEleve,
								),
							},
						});
				} else {
					ObjetFenetre_Message_1.ObjetFenetre_Message.creerFenetreDiscussion(
						this,
						{
							genreRessource: Enumere_Ressource_1.EGenreRessource.Eleve,
							ListeRessources: new ObjetListeElements_1.ObjetListeElements(
								this.identiteEleve,
							),
							listeSelectionnee: new ObjetListeElements_1.ObjetListeElements(
								this.identiteEleve,
							),
						},
						{ avecChoixDestinataires: false },
					);
				}
			},
		};
	}
	jsxGetModelBtnDocument() {
		return {
			event: () => {
				ObjetFenetre_DepotDocument_1.ObjetFenetre_DepotDocument.ouvrirCreation(
					TypeCasier_1.TypeConsultationDocumentCasier.CoDC_DepResponsable,
					new Map().set(
						Enumere_Ressource_1.EGenreRessource.Eleve,
						new ObjetListeElements_1.ObjetListeElements(this.identiteEleve),
					),
				);
			},
		};
	}
	composeIdentiteEleve() {
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				{ class: "identite-wrapper" },
				this.aut.photoEleve ? this.composePhoto() : "",
				IE.jsx.str(
					"div",
					{ class: "identite-contain" },
					this.composeNoms(),
					this.composeAutorisationSortie(),
					this.scolariteEleve.useTransport
						? this.composeUsagerTransports()
						: "",
				),
			),
		);
		T.push(
			IE.jsx.str(
				"div",
				{ class: "infos-contain" },
				this.identiteEleve.ine ? this.composeInformationINE() : "",
				this.composeNaissance(),
				this.avecInfosCoordonnees()
					? (this.avecInfosAdresse
							? this.composeAdresse(this.identiteEleve)
							: "") +
							(this.avecInfosMedia
								? this.composeTelephonesMail(this.identiteEleve)
								: "")
					: "",
				this.identiteEleve.listeAllergiesAlimentaire &&
					this.identiteEleve.listeAllergiesAlimentaire.count()
					? this.composeAllergies(
							this.identiteEleve.listeAllergiesAlimentaire,
							true,
						)
					: "",
				this.identiteEleve.listeAutresAllergies &&
					this.identiteEleve.listeAutresAllergies.count()
					? this.composeAllergies(
							this.identiteEleve.listeAutresAllergies,
							false,
						)
					: "",
				this.composeAutorisationsCommunications(this.identiteEleve),
			),
		);
		return T.join("");
	}
	composePhoto() {
		const T = [];
		let lSrcPhoto = "";
		if (this.eleve.avecPhoto) {
			lSrcPhoto = ObjetChaine_1.GChaine.composeUrlImgPhotoIndividu(this.eleve);
		}
		T.push(
			IE.jsx.str(
				"div",
				{ class: "photo-contain" },
				IE.jsx.str("img", {
					"ie-load-src": lSrcPhoto,
					class: "img-portrait",
					"ie-imgviewer": true,
					alt: this.eleve.getLibelle(),
					"data-libelle": this.eleve.getLibelle(),
				}),
			),
		);
		return T.join("");
	}
	composeNoms() {
		const T = [];
		const lGenre =
			this.identiteEleve.sexe === 0
				? ObjetTraduction_1.GTraductions.getValeur("FicheEleve.sexeMasculin")
				: this.identiteEleve.sexe === 1
					? ObjetTraduction_1.GTraductions.getValeur("FicheEleve.sexeFeminin")
					: ObjetTraduction_1.GTraductions.getValeur("FicheEleve.sexeNeutre");
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "nom-prenom" },
					" ",
					this.identiteEleve.nom,
					" ",
					this.identiteEleve.prenom ? this.identiteEleve.prenom : "",
				),
				IE.jsx.str(
					"div",
					{ class: "item" },
					IE.jsx.str(
						"label",
						null,
						ObjetTraduction_1.GTraductions.getValeur("FicheEleve.sexe"),
						" :",
					),
					IE.jsx.str("p", null, lGenre),
				),
			),
		);
		return T.join("");
	}
	composeAutorisationSortie() {
		const T = [];
		if (this.etatUtilisateurSco.pourPrimaire()) {
			if (this.scolariteEleve.autoriseSortirSeul) {
				T.push(
					IE.jsx.str(
						"div",
						{ class: "item" },
						IE.jsx.str("i", {
							role: "img",
							class: "icon_user mix-icon_ok i-top theme-foncee m-right",
							title: ObjetTraduction_1.GTraductions.getValeur(
								"FicheEleve.autorisationSortie",
							),
						}),
						IE.jsx.str(
							"p",
							null,
							ObjetTraduction_1.GTraductions.getValeur(
								"FicheEleve.lEleveEstAutoriseASortirSeul",
							),
						),
					),
				);
			}
		} else {
			if (!!this.scolariteEleve.autorisationSortie) {
				T.push(
					IE.jsx.str(
						"div",
						{ class: "item" },
						IE.jsx.str(
							"label",
							{ class: "multi-lignes" },
							ObjetTraduction_1.GTraductions.getValeur(
								"FicheEleve.autorisationSortie",
							),
							" :",
						),
						IE.jsx.str(
							"p",
							null,
							this.scolariteEleve.autorisationSortie.getLibelle(),
						),
					),
				);
			}
		}
		return T.join("");
	}
	composeUsagerTransports() {
		const T = [];
		if (this.etatUtilisateurSco.pourPrimaire()) {
			T.push(
				IE.jsx.str(
					"div",
					{ class: "item flex-center" },
					IE.jsx.str("i", {
						class: "icon_bus m-right-l theme-foncee",
						role: "presentation",
					}),
					IE.jsx.str(
						"p",
						null,
						ObjetTraduction_1.GTraductions.getValeur(
							"FicheEleve.utiliseTransportPrim",
						),
					),
				),
			);
		} else {
			T.push(
				IE.jsx.str(
					"div",
					{ class: "item flex-center" },
					IE.jsx.str("i", {
						class: "icon_bus m-right theme-foncee",
						role: "presentation",
					}),
					IE.jsx.str(
						"p",
						null,
						ObjetTraduction_1.GTraductions.getValeur(
							"FicheEleve.utiliseTransport",
						),
					),
				),
			);
		}
		return T.join("");
	}
	composeInformationINE() {
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				{ class: "item" },
				IE.jsx.str(
					"label",
					null,
					ObjetTraduction_1.GTraductions.getValeur("FicheEleve.INELong"),
					":",
				),
				IE.jsx.str("p", null, " ", this.identiteEleve.ine),
			),
		);
		return T.join("");
	}
	composeNaissance() {
		const T = [];
		T.push(`<div class="item">`);
		if (
			!this.aut.estPeriscolaire &&
			(this.identiteEleve.dateNaiss || this.identiteEleve.villeNaiss)
		) {
			T.push(
				IE.jsx.str(
					"label",
					null,
					ObjetTraduction_1.GTraductions.getValeur("FicheEleve.ne"),
					":",
				),
			);
			T.push(
				this.identiteEleve.dateNaiss
					? IE.jsx.str(
							"p",
							null,
							ObjetTraduction_1.GTraductions.getValeur("FicheEleve.le"),
							" ",
							this.identiteEleve.dateNaiss,
						)
					: "",
			);
			T.push(
				this.identiteEleve.villeNaiss
					? IE.jsx.str(
							"p",
							{ class: "p-left" },
							ObjetTraduction_1.GTraductions.getValeur("FicheEleve.a"),
							" ",
							this.identiteEleve.villeNaiss,
						)
					: "",
			);
			T.push(
				this.identiteEleve.estMajeur
					? IE.jsx.str(
							"p",
							{ class: "gris p-left" },
							"(",
							ObjetTraduction_1.GTraductions.getValeur("FicheEleve.majeur"),
							")",
						)
					: "",
			);
		} else {
			T.push(
				this.identiteEleve.age
					? IE.jsx.str(
							IE.jsx.fragment,
							null,
							IE.jsx.str(
								"p",
								{ class: "libelle" },
								ObjetTraduction_1.GTraductions.getValeur("FicheEleve.AgeDe"),
								":",
							),
							IE.jsx.str("p", null, this.identiteEleve.age),
						)
					: "",
			);
		}
		T.push(`</div>`);
		return T.join("");
	}
	composeAdresse(aPersonne) {
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				{ class: "item" },
				IE.jsx.str(
					"label",
					null,
					ObjetTraduction_1.GTraductions.getValeur("FicheEleve.adresse"),
					":",
				),
				IE.jsx.str(
					"p",
					null,
					aPersonne.adresse2 ? aPersonne.adresse2 : "",
					" ",
					aPersonne.adresse3 ? aPersonne.adresse3 : "",
					" ",
					aPersonne.adresse1 ? aPersonne.adresse1 : "",
					" ",
					aPersonne.adresse4 ? aPersonne.adresse4 : "",
					" ",
					IE.jsx.str("br", null),
					" ",
					aPersonne.CP,
					" ",
					aPersonne.ville,
					" ",
					aPersonne.pays ? ` - ${aPersonne.pays}` : ``,
				),
			),
		);
		return T.join("");
	}
	composeTelephonesMail(aPersonne) {
		const T = [];
		T.push(`<div class="item coordonnees">`);
		if (aPersonne.telPort) {
			const lIndicatif = aPersonne.indPort ? `(+${aPersonne.indPort})` : "";
			T.push(
				IE.jsx.str(
					"div",
					{ class: "lien-communication tel-mobile" },
					IE.jsx.str(
						"a",
						{
							href:
								"tel:" +
								ObjetChaine_1.GChaine.formatTelephoneAvecIndicatif(
									aPersonne.indPort,
									aPersonne.telPort,
								),
							title:
								ObjetTraduction_1.GTraductions.getValeur("FicheEleve.TelPort"),
						},
						" ",
						lIndicatif,
						" ",
						ObjetChaine_1.GChaine.getStrTelephoneAvecEspaces(aPersonne.telPort),
					),
				),
			);
		}
		if (aPersonne.telFixe) {
			T.push(
				IE.jsx.str(
					"div",
					{ class: "lien-communication" },
					IE.jsx.str(
						"a",
						{
							href: "tel:" + aPersonne.telFixe,
							title:
								ObjetTraduction_1.GTraductions.getValeur("FicheEleve.TelFixe"),
						},
						" ",
						ObjetChaine_1.GChaine.getStrTelephoneAvecEspaces(aPersonne.telFixe),
					),
				),
			);
		}
		if (aPersonne.telAutre) {
			T.push(
				IE.jsx.str(
					"div",
					{ class: "lien-communication tel-autre" },
					IE.jsx.str(
						"a",
						{
							href: "tel:" + aPersonne.telAutre,
							title:
								ObjetTraduction_1.GTraductions.getValeur("FicheEleve.TelFixe"),
						},
						" ",
						ObjetChaine_1.GChaine.getStrTelephoneAvecEspaces(
							aPersonne.telAutre,
						),
					),
				),
			);
		}
		if (aPersonne.email) {
			T.push(
				IE.jsx.str(
					"div",
					{ class: "lien-communication" },
					ObjetChaine_1.GChaine.composerEmail(aPersonne.email),
				),
			);
		}
		T.push("</div>");
		return T.join("");
	}
	composeScolarite() {
		const T = [];
		if (this.scolariteEleve.profPrincipal || this.scolariteEleve.tuteur) {
			T.push(
				IE.jsx.str(
					"div",
					{ class: "infos-wrapper profs" },
					this.composeIdentiteProfs(),
				),
			);
		}
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "infos-wrapper" },
					this.composeRegime(),
					this.scolariteEleve.engagements ? this.composeEngagements() : "",
					this.scolariteEleve.options ? this.composeOptions() : "",
					!this.aut.estPeriscolaire && this.identiteEleve.accompagnant
						? this.composeAccompagnant()
						: "",
				),
				IE.jsx.str(
					"div",
					{ class: "infos-wrapper" },
					IE.jsx.str("div", {
						"ie-html": this.jsxGetHtmlProjetAccompagnement.bind(this),
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "infos-wrapper" },
					IE.jsx.str("div", {
						"ie-html": this.jsxGetHtmlAttestation.bind(this),
					}),
					this.composeServicePeriscolaire(),
				),
			),
		);
		return T.join("");
	}
	composeIdentiteProfs() {
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "item" },
					IE.jsx.str(
						"label",
						{ class: "multi-lignes" },
						!this.aut.estPeriscolaire
							? ObjetTraduction_1.GTraductions.getValeur(
									"FicheEleve.profPrincipal",
								)
							: ObjetTraduction_1.GTraductions.getValeur("Profs"),
					),
					IE.jsx.str("p", null, this.scolariteEleve.profPrincipal),
				),
				!this.aut.estPeriscolaire && this.scolariteEleve.tuteur
					? IE.jsx.str(
							"div",
							{ class: "item" },
							IE.jsx.str(
								"label",
								null,
								ObjetTraduction_1.GTraductions.getValeur("FicheEleve.tuteur"),
							),
							IE.jsx.str("p", null, this.scolariteEleve.tuteur),
						)
					: "",
			),
		);
		return T.join("");
	}
	composeRegime() {
		const T = [];
		if (
			this.scolariteEleve.midi ||
			this.scolariteEleve.soir ||
			this.scolariteEleve.internat
		) {
			T.push(
				IE.jsx.str(
					"div",
					{ class: "item regime" },
					IE.jsx.str("label", {
						class: "icon_food multi-lignes",
						"aria-hidden": "true",
					}),
					IE.jsx.str(
						"div",
						{ class: "m-left" },
						IE.jsx.str(
							"label",
							{ class: "gris" },
							ObjetTraduction_1.GTraductions.getValeur("FicheEleve.regime"),
							" : ",
							this.scolariteEleve.regime,
						),
						IE.jsx.str(
							"ul",
							null,
							this.scolariteEleve.midi
								? IE.jsx.str(
										"li",
										null,
										IE.jsx.str(
											"span",
											{ class: "wrapper" },
											ObjetTraduction_1.GTraductions.getValeur(
												"FicheEleve.midi",
											),
											" (",
											this.scolariteEleve.nombreSelectionnesMidi,
											"/",
											this.scolariteEleve.nombreJoursSelectionnables,
											"): ",
											this.scolariteEleve.midi,
										),
									)
								: "",
							this.scolariteEleve.soir
								? IE.jsx.str(
										"li",
										null,
										IE.jsx.str(
											"span",
											{ class: "wrapper" },
											ObjetTraduction_1.GTraductions.getValeur(
												"FicheEleve.soir",
											),
											" (",
											this.scolariteEleve.nombreSelectionnesSoir,
											"/",
											this.scolariteEleve.nombreJoursSelectionnables,
											"): ",
											this.scolariteEleve.soir,
										),
									)
								: "",
							this.scolariteEleve.internat
								? IE.jsx.str(
										IE.jsx.fragment,
										null,
										IE.jsx.str(
											"li",
											{ class: "m-bottom" },
											IE.jsx.str(
												"span",
												{ class: "wrapper" },
												ObjetTraduction_1.GTraductions.getValeur(
													"FicheEleve.internat",
												),
												" (",
												this.scolariteEleve.nombreSelectionnesInternat,
												"/",
												this.scolariteEleve.nombreJoursSelectionnables,
												"): ",
												this.scolariteEleve.internat,
											),
										),
										this.scolariteEleve.numeroChambre
											? IE.jsx.str(
													"li",
													null,
													IE.jsx.str(
														"span",
														{ class: "gris" },
														ObjetTraduction_1.GTraductions.getValeur(
															"FicheEleve.numeroChambre",
														),
														" :",
													),
													" ",
													this.scolariteEleve.numeroChambre,
												)
											: "",
										this.scolariteEleve.dortoir
											? IE.jsx.str(
													"li",
													null,
													IE.jsx.str(
														"span",
														{ class: "gris" },
														ObjetTraduction_1.GTraductions.getValeur(
															"FicheEleve.dortoir",
														),
														" :",
													),
													" ",
													this.scolariteEleve.dortoir,
												)
											: "",
									)
								: "",
							this.scolariteEleve.numeroSelf
								? IE.jsx.str(
										"li",
										null,
										IE.jsx.str(
											"span",
											{ class: "gris" },
											ObjetTraduction_1.GTraductions.getValeur(
												"FicheEleve.numeroSelf",
											),
											" :",
										),
										" ",
										this.scolariteEleve.numeroSelf,
									)
								: "",
							this.scolariteEleve.numeroCasier
								? IE.jsx.str(
										"li",
										null,
										IE.jsx.str(
											"span",
											{ class: "gris" },
											ObjetTraduction_1.GTraductions.getValeur(
												"FicheEleve.numeroCasier",
											),
											" :",
										),
										" ",
										this.scolariteEleve.numeroCasier,
									)
								: "",
						),
					),
				),
			);
		}
		return T.join("");
	}
	composeEngagements() {
		const T = [];
		const lClassesIcone = [];
		const lEstDelegueClasse =
			!!this.scolariteEleve.delegue &&
			!!this.scolariteEleve.delegue.estDelegueClasse;
		const lEstDelegueEco =
			!!this.scolariteEleve.delegue &&
			!!this.scolariteEleve.delegue.estDelegueEco;
		const lEstDelegueAutre =
			!!this.scolariteEleve.delegue &&
			!!this.scolariteEleve.delegue.estDelegueAutre;
		const lEstPlusieursCategories =
			(lEstDelegueClasse && (lEstDelegueEco || lEstDelegueAutre)) ||
			(lEstDelegueEco && lEstDelegueAutre);
		if (lEstPlusieursCategories) {
			lClassesIcone.push("mix-icon_plus");
		} else if (lEstDelegueClasse) {
			lClassesIcone.push("mix-icon_rond i-orange");
		} else if (lEstDelegueEco) {
			lClassesIcone.push("mix-icon_rond i-green");
		}
		lClassesIcone.join(" ");
		T.push(
			IE.jsx.str(
				"div",
				{ class: "item flex-center" },
				IE.jsx.str(
					"label",
					{ class: "has-text flex-contain flex-center" },
					IE.jsx.str("i", {
						class: ["icon_engagement", lClassesIcone.join(" ")],
						role: "presentation",
					}),
					ObjetTraduction_1.GTraductions.getValeur("FicheEleve.engagements"),
					" : ",
				),
				IE.jsx.str("p", null, this.scolariteEleve.engagements),
			),
		);
		return T.join("");
	}
	composeOptions() {
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				{ class: "item flex-center" },
				IE.jsx.str(
					"label",
					{ class: "flex-contain flex-center" },
					IE.jsx.str("i", { class: "icon_list", role: "presentation" }),
					ObjetTraduction_1.GTraductions.getValeur("FicheEleve.options"),
					" : ",
				),
				IE.jsx.str("p", null, this.scolariteEleve.options),
			),
		);
		return T.join("");
	}
	composeAccompagnant() {
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				{ class: "item flex-center" },
				IE.jsx.str(
					"label",
					{ class: "flex-contain flex-center" },
					IE.jsx.str("i", { class: "icon_accompagnant", role: "presentation" }),
					ObjetTraduction_1.GTraductions.getValeur("FicheEleve.accompagnant"),
					" : ",
				),
				IE.jsx.str("p", null, this.identiteEleve.accompagnant),
			),
		);
		return T.join("");
	}
	composeAttestations() {
		const T = [];
		if (this.scolariteEleve.listeAttestations === undefined) {
			return "";
		}
		const lAttestations = [];
		if (
			this.scolariteEleve.listeAttestations &&
			this.listeAttestations &&
			this.scolariteEleve.listeAttestations.count() ===
				this.listeAttestations.count()
		) {
			lAttestations.push(
				IE.jsx.str(
					"div",
					{ class: "item-wrapper" },
					ObjetTraduction_1.GTraductions.getValeur(
						"Attestation.aucuneAttestationDisponible",
					),
				),
			);
		}
		if (this.scolariteEleve.listeAttestations.count() === 0) {
			lAttestations.push(
				IE.jsx.str(
					"div",
					{ class: "item-wrapper" },
					ObjetTraduction_1.GTraductions.getValeur(
						"Attestation.aucuneAttestationRenseignee",
					),
				),
			);
		}
		this.scolariteEleve.listeAttestations.parcourir((aAttestation) => {
			if (aAttestation.existe()) {
				const lDelivree = aAttestation.delivree
					? ObjetTraduction_1.GTraductions.getValeur("FicheEleve.DelivreLe") +
						" " +
						ObjetDate_1.GDate.formatDate(
							aAttestation.date,
							"%JJJJ %JJ %MMMM %AAAA",
						)
					: ObjetTraduction_1.GTraductions.getValeur("Attestation.nonDelivree");
				const lBoutonEditer = this.aut.saisieAttestations
					? IE.jsx.str("ie-btnicon", {
							class: "icon icon_edit avecFond",
							title: ObjetTraduction_1.GTraductions.getValeur("Modifier"),
							"ie-model": this.jsxModeleBoutonEditerAttestation.bind(
								this,
								aAttestation,
							),
							"aria-haspopup": "dialog",
						})
					: "";
				lAttestations.push(
					IE.jsx.str(
						"div",
						{ class: "item-wrapper" },
						IE.jsx.str(
							"label",
							{ title: aAttestation.getLibelle() },
							aAttestation.abbreviation,
						),
						IE.jsx.str("span", { class: "p-right" }, lDelivree),
						lBoutonEditer,
					),
				);
			}
		});
		const lBoutonCreer = this.aut.saisieAttestations
			? IE.jsx.str("ie-btnicon", {
					class: "icon_plus_fin avecFond m-right",
					"ie-model": this.jsxModeleBoutonCreerAttestation.bind(this),
					title: ObjetTraduction_1.GTraductions.getValeur("Attestation.titre"),
					"aria-haspopup": "dialog",
				})
			: "";
		T.push(
			IE.jsx.str(
				"div",
				{ class: "item attestations" },
				IE.jsx.str(
					"div",
					{ class: "head-contain" },
					IE.jsx.str(
						"h2",
						null,
						ObjetTraduction_1.GTraductions.getValeur("FicheEleve.Attestations"),
					),
					lBoutonCreer,
				),
				lAttestations.join(""),
			),
		);
		return T.join("");
	}
	composeServicePeriscolaire() {
		const T = [];
		if (
			this.scolariteEleve.listeServicesAnnexes &&
			this.scolariteEleve.listeServicesAnnexes.count() > 0
		) {
			T.push(
				IE.jsx.str(
					"div",
					{ class: "item" },
					IE.jsx.str(
						"label",
						null,
						ObjetTraduction_1.GTraductions.getValeur(
							"FicheEleve.servicePeriscolaire",
						),
						" :",
					),
					IE.jsx.str(
						"span",
						null,
						this.scolariteEleve.listeServicesAnnexes
							.getTableauLibelles()
							.join(", "),
					),
				),
			);
		}
		return T.join("");
	}
	composeAllergies(aListeAllergies, aEstAlimentaire) {
		const T = [];
		T.push('<div class="item allergies">');
		T.push(
			IE.jsx.str(
				"h2",
				null,
				aEstAlimentaire
					? ObjetTraduction_1.GTraductions.getValeur(
							"FicheEleve.AllergiesAlimentaires",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"FicheEleve.AutresAllergies",
						),
				" :",
			),
		);
		T.push("<ul>");
		aListeAllergies.parcourir((aAllergie) => {
			T.push(IE.jsx.str("li", null, aAllergie.getLibelle()));
		});
		T.push("</ul>");
		T.push("</div>");
		return T.join("");
	}
	composeAutorisationsCommunications(aPersonne) {
		const T = [];
		const AutorisationCommunicationExiste =
			aPersonne.autoriseEmail ||
			aPersonne.autoriseSMS ||
			aPersonne.autoriseCourrier ||
			aPersonne.autoriseDiscussion;
		if (AutorisationCommunicationExiste) {
			T.push(
				IE.jsx.str(
					"div",
					{ class: "item autorisations" },
					IE.jsx.str(
						"h2",
						null,
						ObjetTraduction_1.GTraductions.getValeur(
							"FicheEleve.AutorisationCommunication",
						),
						" :",
					),
					IE.jsx.str(
						"ul",
						null,
						aPersonne.telPort === ""
							? IE.jsx.str(
									"li",
									{ class: "com-ko" },
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheEleve.SMSImpossible",
									),
								)
							: aPersonne.autoriseSMS
								? IE.jsx.str(
										"li",
										{ class: "com-ok" },
										ObjetTraduction_1.GTraductions.getValeur(
											"FicheEleve.SMSOK",
										),
									)
								: IE.jsx.str(
										"li",
										{ class: "com-ko" },
										ObjetTraduction_1.GTraductions.getValeur(
											"FicheEleve.SMSKO",
										),
									),
						aPersonne.email && aPersonne.autoriseEmail
							? IE.jsx.str(
									"li",
									{ class: "com-ok" },
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheEleve.EmailOK",
									),
								)
							: IE.jsx.str(
									"li",
									{ class: "com-ko" },
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheEleve.EmailKO",
									),
								),
						aPersonne.adresse1 === "" &&
							aPersonne.adresse2 === "" &&
							aPersonne.adresse3 === "" &&
							aPersonne.adresse4 === ""
							? IE.jsx.str(
									"li",
									{ class: "com-ko" },
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheEleve.CourrierImpossible",
									),
								)
							: aPersonne.autoriseCourrier
								? IE.jsx.str(
										"li",
										{ class: "com-ok" },
										ObjetTraduction_1.GTraductions.getValeur(
											"FicheEleve.CourrierOK",
										),
									)
								: IE.jsx.str(
										"li",
										{ class: "com-ko" },
										ObjetTraduction_1.GTraductions.getValeur(
											"FicheEleve.CourrierKO",
										),
									),
						aPersonne.autoriseDiscussion
							? IE.jsx.str(
									"li",
									{ class: "com-ok" },
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheEleve.DiscussionsOK",
									),
								)
							: IE.jsx.str(
									"li",
									{ class: "com-ko" },
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheEleve.DiscussionsKO",
									),
								),
					),
				),
			);
		}
		return T.join("");
	}
	composeResponsablesEleve(aGenreOnglet) {
		const lListeResponsables = this.listeResponsables;
		const T = [];
		if (this.aut.ficheResponsables) {
			const lNbrResp = lListeResponsables.count();
			if (lNbrResp > 0) {
				T.push(
					`<div class="liste-individus" id="${this.idDivScrollResp + aGenreOnglet}">`,
				);
				for (let i = 0; i < lNbrResp; i++) {
					T.push(this.composeResponsable(lListeResponsables.get(i)));
				}
				T.push("</div>");
			} else {
				T.push(
					ObjetTraduction_1.GTraductions.getValeur(
						"FicheEleve.aucunAutreContact",
					),
				);
			}
		}
		return T.join("");
	}
	composeResponsable(aResp) {
		const T = [];
		const InfosAdresse =
			aResp.adresse1 ||
			aResp.adresse2 ||
			aResp.adresse3 ||
			aResp.adresse4 ||
			aResp.CP ||
			aResp.ville ||
			aResp.pays;
		if (this.aut.ficheResponsables) {
			T.push(
				IE.jsx.str(
					"div",
					{ class: "infos-wrapper individu" },
					IE.jsx.str(
						"div",
						{ class: "infos-contain" },
						IE.jsx.str(
							"div",
							{ class: "item responsabilite-contain" },
							IE.jsx.str(
								"div",
								{ class: "nom-prenom" },
								" ",
								aResp.nom,
								aResp.lienParente
									? IE.jsx.str(
											"span",
											{ class: "gris m-left" },
											" (",
											aResp.lienParente,
											")",
										)
									: "",
							),
							aResp.niveauResponsabilite
								? IE.jsx.str(
										"ie-chips",
										{ class: "tag-style" },
										aResp.niveauResponsabilite,
									)
								: "",
						),
						aResp.profession
							? IE.jsx.str(
									"div",
									{ class: "item" },
									IE.jsx.str(
										"label",
										null,
										ObjetTraduction_1.GTraductions.getValeur(
											"FicheEleve.Profession",
										),
										" :",
									),
									IE.jsx.str("p", null, aResp.profession),
								)
							: "",
						aResp.situation
							? IE.jsx.str(
									"div",
									{ class: "item" },
									IE.jsx.str(
										"label",
										null,
										ObjetTraduction_1.GTraductions.getValeur(
											"FicheEleve.SituationProfessionnelle",
										),
										" :",
									),
									IE.jsx.str("p", null, aResp.situation),
								)
							: "",
						InfosAdresse ? this.composeAdresse(aResp) : "",
						this.composeTelephonesMail(aResp),
						this.composeContact(aResp),
						this.composeAutorisationsCommunications(aResp),
						aResp.delegueClasse
							? IE.jsx.str(
									"div",
									{ class: "item" },
									IE.jsx.str(
										"label",
										null,
										ObjetTraduction_1.GTraductions.getValeur(
											"FicheEleve.deleguePE",
										),
										" : ",
									),
									IE.jsx.str("p", null, " ", aResp.delegueClasse),
								)
							: "",
						aResp.membreCA
							? IE.jsx.str(
									"div",
									{ class: "item" },
									IE.jsx.str(
										"p",
										null,
										ObjetTraduction_1.GTraductions.getValeur(
											"FicheEleve.membreConseilAdmin",
										),
									),
								)
							: "",
						this.aut.afficherDiscussionCommuneResp
							? IE.jsx.str(
									"div",
									{ class: "item" },
									IE.jsx.str(
										"ie-bouton",
										{
											class: "m-x small-bt themeBoutonNeutre",
											"ie-model":
												this.jsxModeleBoutonAfficherDiscussionsCommunes.bind(
													this,
													aResp,
												),
											"aria-haspopup": "dialog",
										},
										ObjetTraduction_1.GTraductions.getValeur(
											"fenetreCommunication.bouton.discussionsCommunes",
										),
									),
								)
							: "",
					),
				),
			);
		}
		return T.join("");
	}
	composeContact(aResp) {
		const T = [];
		if (
			[
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
			].includes(this.etatUtilisateurSco.GenreEspace)
		) {
			if (aResp.contactUrgence) {
				T.push(
					IE.jsx.str(
						"div",
						{ class: "item" },
						IE.jsx.str("i", {
							class: "icon_tel_urgence  m-right",
							role: "presentation",
						}),
						IE.jsx.str(
							"p",
							null,
							ObjetTraduction_1.GTraductions.getValeur(
								"FicheEleve.contactUrgence",
							),
						),
					),
				);
			}
			if (aResp.autoriseRecupererEnfant) {
				T.push(
					IE.jsx.str(
						"div",
						{ class: "item" },
						IE.jsx.str("i", {
							class: "icon_tel_personne_autorise  m-right",
							role: "presentation",
						}),
						IE.jsx.str(
							"p",
							null,
							ObjetTraduction_1.GTraductions.getValeur(
								"FicheEleve.autoriseRecuperer",
							),
						),
					),
				);
			}
		}
		return T.join("");
	}
	_ouvrirFenetreAttestation(aAttestation) {
		const lListeAttestation = this.listeAttestations.parcourir((aElement) => {
			aElement.setActif(
				!(
					this.scolariteEleve.listeAttestations &&
					!!this.scolariteEleve.listeAttestations.getElementParElement(
						aElement,
						true,
					)
				),
			);
		});
		const lTitre = aAttestation
			? "Attestation.titreModifier"
			: "Attestation.titre";
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Attestation_1.ObjetFenetre_Attestation,
			{
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(lTitre),
					});
				},
				pere: this,
				evenement: function (aNumeroBouton, aAttest) {
					if (aNumeroBouton === 1) {
						if (this.scolariteEleve && this.scolariteEleve.listeAttestations) {
							const lIndiceAncien =
								this.scolariteEleve.listeAttestations.getIndiceParElement(
									aAttest,
									false,
								);
							if (lIndiceAncien > -1) {
								this.scolariteEleve.listeAttestations.addElement(
									aAttest,
									lIndiceAncien,
								);
							} else {
								this.scolariteEleve.listeAttestations.add(aAttest);
							}
						}
					}
				},
			},
		).setDonnees({
			listeTypes: lListeAttestation,
			eleve: this.eleve,
			attestation: aAttestation,
		});
	}
	_evenementListeMemo(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this._ouvrirFenetreMemo();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				this._ouvrirFenetreMemo(aParametres.article);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression: {
				const lListeMemo = new ObjetListeElements_1.ObjetListeElements();
				lListeMemo.add(aParametres.article);
				new ObjetRequeteSaisieMemoEleve_1.ObjetRequeteSaisieMemoEleve(
					this,
				).lancerRequete({
					eleve: this.eleve,
					listeMemos: lListeMemo,
					estValorisation: this.estValorisation,
				});
				this._actualiserListeMemo();
				break;
			}
		}
	}
	_ouvrirFenetreProjetAccompagnement(aProjetAcc) {
		this.scolariteEleve.listeProjets.parcourir((aProjet) => {
			const lType = this.listeTypes.getElementParElement(
				aProjet.projetIndividuel,
			);
			if (lType && !(!!aProjet.dateDebut || !!aProjet.dateFin)) {
				lType.setActif(false);
			}
		});
		const lTitre = aProjetAcc
			? "FicheEleve.modifierProjetAccompagnement"
			: "FicheEleve.nouveauProjetAccompagnement";
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_ProjetAccompagnement_1.ObjetFenetre_ProjetAccompagnement,
			{
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(lTitre),
					});
				},
				pere: this,
				evenement: function (aNumeroBouton) {
					if (aNumeroBouton === 1) {
						if (this.scolariteEleve && this.scolariteEleve.listeProjets) {
							this.actualiser();
						}
					}
				},
			},
		).setDonnees({
			listeTypes: this.listeTypes,
			listeMotifs: this.listeMotifs,
			eleve: this.eleve,
			projetAccompagnement: aProjetAcc,
		});
	}
	_composeProjetsAccompagnement() {
		const T = [];
		const lAvecSaisie =
			![
				Enumere_Espace_1.EGenreEspace.PrimPeriscolaire,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimPeriscolaire,
			].includes(this.etatUtilisateurSco.GenreEspace) &&
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.avecSaisieProjetIndividuel,
			);
		const lBoutonCreer = lAvecSaisie
			? IE.jsx.str("ie-btnicon", {
					class: "icon_plus_fin avecFond m-right",
					"ie-model": this.jsxModeleBoutonCreerProjetAccompagnement.bind(this),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"FicheEleve.nouveauProjetAccompagnement",
					),
					"aria-haspopup": "dialog",
				})
			: "";
		T.push(
			IE.jsx.str(
				"div",
				{ class: "item projets" },
				IE.jsx.str(
					"div",
					{ class: "head-contain" },
					IE.jsx.str(
						"h2",
						null,
						ObjetTraduction_1.GTraductions.getValeur(
							"PageCompte.ProjetsAccompagnement",
						),
					),
					lBoutonCreer,
				),
				IE.jsx.str(
					"div",
					{ class: "projets-wrapper" },
					UtilitaireProjetAccompagnement_1.UtilitaireProjetAccompagnement.composeListeProjetsAccompagnement(
						this.scolariteEleve.listeProjets,
						{
							avecEdition: lAvecSaisie,
							avecControlePublication: false,
							avecLibelleConsultationEquipePeda: false,
						},
					),
				),
			),
		);
		return T.join("");
	}
	_actualiserListeMemo() {
		this.getInstance(this.identListeMemosEleves).setDonnees(
			new DonneesListe_MemosEleves_1.DonneesListe_MemosEleves(
				this.listeMemosEleves,
				{ estValorisation: false, forcerConsultation: false },
			),
		);
	}
	_ouvrirFenetreMemo(aMemo) {
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_MemoEleve_1.ObjetFenetre_MemoEleve,
			{
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.memo"),
					});
				},
				pere: this,
				evenement: function (aGenreBouton, aMemoEleve) {
					if (aGenreBouton === 1) {
						if (aMemoEleve.getEtat() === Enumere_Etat_1.EGenreEtat.Creation) {
							this.listeMemosEleves.add(aMemoEleve);
						}
						this.actualiser();
					}
				},
			},
		).setDonnees({ memo: aMemo, eleve: this.eleve, estValorisation: false });
	}
	_ouvrirFenetreDetailsPIEleve(aProjet) {
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_DetailsPIEleve_1.ObjetFenetre_DetailsPIEleve,
			{ pere: this },
		).setDonnees({ eleve: this.eleve, projet: aProjet });
	}
}
exports.InterfaceFicheEleve = InterfaceFicheEleve;
(function (InterfaceFicheEleve) {
	let genreOnglet;
	(function (genreOnglet) {
		genreOnglet[(genreOnglet["Identite"] = 0)] = "Identite";
		genreOnglet[(genreOnglet["Scolarite"] = 1)] = "Scolarite";
		genreOnglet[(genreOnglet["Responsables"] = 2)] = "Responsables";
		genreOnglet[(genreOnglet["Memos"] = 3)] = "Memos";
	})(
		(genreOnglet =
			InterfaceFicheEleve.genreOnglet ||
			(InterfaceFicheEleve.genreOnglet = {})),
	);
})(
	InterfaceFicheEleve ||
		(exports.InterfaceFicheEleve = InterfaceFicheEleve = {}),
);
