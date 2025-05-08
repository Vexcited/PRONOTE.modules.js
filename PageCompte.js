exports.PageCompteMobile = void 0;
const ObjetIdentite_Mobile_1 = require("ObjetIdentite_Mobile");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetRequeteSaisieNotifications_1 = require("ObjetRequeteSaisieNotifications");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetRequetePageInfosPerso_1 = require("ObjetRequetePageInfosPerso");
const UtilitairePageDonneesPersonnelles_1 = require("UtilitairePageDonneesPersonnelles");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_DonneesPersonnelles_1 = require("Enumere_DonneesPersonnelles");
const Enumere_DonneesPersonnelles_2 = require("Enumere_DonneesPersonnelles");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetChaine_1 = require("ObjetChaine");
const GUID_1 = require("GUID");
const InterfaceParamListeSourcesConnexions_1 = require("InterfaceParamListeSourcesConnexions");
const ObjetParamChoixStrategieSecurisation_1 = require("ObjetParamChoixStrategieSecurisation");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetListe_1 = require("ObjetListe");
const DonneesListe_FiltreCompte_1 = require("DonneesListe_FiltreCompte");
const Enumere_DonneesPersonnelles_3 = require("Enumere_DonneesPersonnelles");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetPreferenceAccessibilite_1 = require("ObjetPreferenceAccessibilite");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetPreferenceMessagerie_1 = require("ObjetPreferenceMessagerie");
const ObjetRequeteSaisieInformations = require("ObjetRequeteSaisieInformations");
const ObjetMessagerieSignature_1 = require("ObjetMessagerieSignature");
const ObjetPreferenceCahierDeTexte_1 = require("ObjetPreferenceCahierDeTexte");
const UtilitaireSyntheseVocale_1 = require("UtilitaireSyntheseVocale");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const MoteurParametresiCal_1 = require("MoteurParametresiCal");
class PageCompteMobile extends ObjetIdentite_Mobile_1.ObjetIdentite_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.IdZoneChk = "_zoneChk";
		this.idIntersticial = GUID_1.GUID.getId();
		this.idMainPage = GUID_1.GUID.getId();
		this.parametres = {
			largeurLibelleInput: 30,
			hauteurInput: 20,
			largeurEmail: 220,
			largeurIndicatif: 45,
			largeurTel: 115,
			maskMDP: "*********",
			avecInfosEntreprise:
				this.etatUtilisateurSco.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Entreprise,
			avecTelFixe:
				this.etatUtilisateurSco.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Entreprise,
			avecTelFax:
				this.etatUtilisateurSco.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Entreprise,
			avecNumeroINE: [
				Enumere_Espace_1.EGenreEspace.Eleve,
				Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
			].includes(this.etatUtilisateurSco.GenreEspace),
			avecInfosAutorisations: [
				Enumere_Espace_1.EGenreEspace.Mobile_Parent,
				Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
				Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
				Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
				Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
			].includes(this.etatUtilisateurSco.GenreEspace),
		};
		const notificationPush =
			this.etatUtilisateurSco.Identification.ressource.notificationsPush;
		this.avecPush = notificationPush;
		this.donnees =
			UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.getDonneesDefaut();
		this.instanceListeFiltre = ObjetIdentite_1.Identite.creerInstance(
			ObjetListe_1.ObjetListe,
			{
				pere: this,
				evenement: (aParametres) => {
					switch (aParametres.genreEvenement) {
						case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
							if (aParametres.article) {
								this._genrePageCourante = aParametres.article.getGenre();
								this._selectionnerFiltre(this._genrePageCourante);
							}
							break;
					}
				},
			},
		);
		this.instanceSourcesConnexions = ObjetIdentite_1.Identite.creerInstance(
			InterfaceParamListeSourcesConnexions_1.InterfaceParamListeSourcesConnexions,
			{
				pere: this,
				evenement: (aParam) => {
					this._evenementSecurisation(aParam);
				},
			},
		);
		this.instanceChoixStratSecurisation =
			ObjetIdentite_1.Identite.creerInstance(
				ObjetParamChoixStrategieSecurisation_1.ObjetParamChoixStrategieSecurisation,
				{
					pere: this,
					evenement: (aParam) => {
						this._evenementSecurisation(aParam);
					},
				},
			);
		this.moteurICal = new MoteurParametresiCal_1.MoteurParametresiCal();
	}
	toggleNotifs(aCoche) {
		this.avecPush = !aCoche;
		new ObjetRequeteSaisieNotifications_1.ObjetRequeteSaisieNotifications(
			this,
			this._evenementSurSaisieNotification,
		).lancerRequete({ avecPush: this.avecPush });
	}
	_evenementSurSaisieNotification() {
		this.etatUtilisateurSco.Identification.ressource.notificationsPush =
			this.avecPush;
	}
	getControleur(aInstance) {
		return $.extend(
			true,
			super.getControleur(aInstance),
			Object.assign(
				UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.getControleur(
					aInstance,
				),
				{
					getIdentiteAccessibilite: function () {
						return {
							class:
								ObjetPreferenceAccessibilite_1.ObjetPreferenceAccessibilite,
							pere: aInstance,
						};
					},
					getIdentiteMessagerie: function () {
						return {
							class: ObjetPreferenceMessagerie_1.ObjetPreferenceMessagerie,
							pere: aInstance,
						};
					},
					getIdentiteMessagerieSignature() {
						return {
							class: ObjetMessagerieSignature_1.ObjetMessagerieSignature,
							pere: aInstance,
						};
					},
					generalites: {
						cbAvecGestionDesThemes: {
							getValue: function () {
								return aInstance.applicationSco.parametresUtilisateur.get(
									"avecGestionDesThemes",
								);
							},
							setValue: function (aValue) {
								aInstance.applicationSco.parametresUtilisateur.set(
									"avecGestionDesThemes",
									aValue,
								);
							},
						},
						cbTransformationFlux: {
							getValue() {
								return aInstance.applicationSco
									.getObject("transformationFlux")
									.getActif();
							},
							setValue(aValue) {
								aInstance.applicationSco
									.getObject("transformationFlux")
									.setActif(aValue);
							},
						},
					},
					syntheseVocale: {
						cbActiver: {
							getValue: function () {
								return UtilitaireSyntheseVocale_1.SyntheseVocale.getActif();
							},
							setValue: function (aValue) {
								UtilitaireSyntheseVocale_1.SyntheseVocale.saisieActive(aValue);
							},
						},
						comboChoixVoix: {
							init: function (aInstance) {
								const lListe =
									UtilitaireSyntheseVocale_1.SyntheseVocale.getListeVoix();
								const lIndiceSelection = lListe.getIndiceElementParFiltre(
									function (aElement) {
										const lVoix =
											UtilitaireSyntheseVocale_1.SyntheseVocale.getVoix();
										return aElement.voix === lVoix;
									},
								);
								aInstance.setOptionsObjetSaisie({
									iconeGauche: "",
									longueur: 280,
									largeurListe: 280,
									avecBouton: true,
									texteEdit: ObjetTraduction_1.GTraductions.getValeur(
										"SyntheseVocale.ChoixVoix",
									),
									optionsBouton: {
										avecBordures: false,
										avecFocusVisibleTexte: false,
										classeZone: "",
									},
								});
								aInstance.setDonnees(lListe, lIndiceSelection);
							},
							event: function (aParametres, aCombo) {
								if (
									aParametres.genreEvenement ===
										Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
											.selection &&
									aCombo.InteractionUtilisateur
								) {
									const lElement = aParametres.element;
									UtilitaireSyntheseVocale_1.SyntheseVocale.modifierVoix(
										lElement.voix,
									);
								}
							},
							getDisabled: function () {
								return !UtilitaireSyntheseVocale_1.SyntheseVocale.getActif();
							},
						},
						cbSurLignage: {
							getValue: function () {
								return UtilitaireSyntheseVocale_1.SyntheseVocale.getAvecSurLignage();
							},
							setValue: function (aValue) {
								UtilitaireSyntheseVocale_1.SyntheseVocale.saisieAvecSurlignage(
									aValue,
								);
							},
							getDisabled: function () {
								return !UtilitaireSyntheseVocale_1.SyntheseVocale.getActif();
							},
						},
					},
					iCal: {
						avecCombo: function () {
							return aInstance.moteurICal.avecListeChoixDonnees();
						},
						choixLien: {
							init: function (aInstanceSaisie) {
								aInstanceSaisie.setOptionsObjetSaisie({
									libelleHaut:
										ObjetTraduction_1.GTraductions.getValeur("iCal.choixLien"),
								});
								aInstanceSaisie.setDonneesObjetSaisie({
									liste: aInstance.moteurICal.getListe(),
									selection: 0,
								});
							},
							event: function (aParametres, aCombo) {
								if (
									aParametres.genreEvenement ===
										Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
											.selection &&
									aCombo.InteractionUtilisateur
								) {
									aInstance.moteurICal.setArticle(aParametres.element);
								}
							},
							getDisabled: function () {
								return false;
							},
						},
						avecChoix: function () {
							return aInstance.moteurICal.avecChoixDonneesExport();
						},
						cbEDT: {
							getValue: function () {
								return aInstance.moteurICal.getExportEDT();
							},
							setValue: function (aValue) {
								aInstance.moteurICal.setExportEDT(aValue);
							},
							getDisabled: function () {
								return !aInstance.moteurICal.avecChoixEDT();
							},
							avecEDT: function () {
								return aInstance.moteurICal.avecChoixEDT();
							},
						},
						cbAgenda: {
							getValue: function () {
								return aInstance.moteurICal.getExportAgenda();
							},
							setValue: function (aValue) {
								aInstance.moteurICal.setExportAgenda(aValue);
							},
							getDisabled: function () {
								return !aInstance.moteurICal.avecChoixAgenda();
							},
							avecAgenda: function () {
								return aInstance.moteurICal.avecChoixAgenda();
							},
						},
						exporter: {
							event() {
								aInstance.moteurICal.exportCalendrier();
							},
							getDisabled() {
								return !aInstance.moteurICal.avecLienPermanent();
							},
						},
						copier: {
							event() {
								aInstance.moteurICal.copierLienCalendrier();
							},
							getDisabled() {
								return !aInstance.moteurICal.avecLienPermanent();
							},
						},
						lienPermanent: {
							getValue: function () {
								return aInstance.moteurICal.getLienPermanent();
							},
							setValue: function () {},
						},
					},
					getIdentiteCahierDeTexte: function () {
						return {
							class:
								ObjetPreferenceCahierDeTexte_1.ObjetPreferenceCahierDeTexte,
							pere: aInstance,
						};
					},
					getNodeHeader: function () {
						$(this.node).on("click", () => {
							aInstance.closeNav();
						});
					},
				},
			),
		);
	}
	closeNav() {
		ObjetHtml_1.GHtml.setDisplay(this.idIntersticial, false);
		ObjetHtml_1.GHtml.setDisplay(this.idMainPage, true);
	}
	recupererDonnees() {
		this._envoiRequetePage();
	}
	getStructurePourValidation(aStructure) {
		return UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.getStructurePourValidation(
			this.donnees,
			aStructure,
		);
	}
	valider() {
		const lStructure = {};
		if (this.getStructurePourValidation(lStructure)) {
			this.setEtatSaisie(false);
			const lFichiers =
				!!lStructure.signature && !!lStructure.signature.listeFichiers
					? lStructure.signature.listeFichiers
					: new ObjetListeElements_1.ObjetListeElements();
			new ObjetRequeteSaisieInformations(this, this.recupererDonnees)
				.addUpload({ listeFichiers: lFichiers })
				.lancerRequete(lStructure);
		}
	}
	_evenementSecurisation(aParam) {
		if (aParam && aParam.actualiser) {
			const lElementScroll = ObjetHtml_1.GHtml.getElement(
				this.applicationSco.getIdConteneur(),
			);
			const lScrollTop = lElementScroll.scrollTop;
			this._envoiRequetePage()
				.then(
					this._selectionnerFiltre.bind(
						this,
						Enumere_DonneesPersonnelles_3.TypeFiltreAffichage.securisation,
					),
				)
				.then(() => {
					if (lScrollTop > 0) {
						lElementScroll.scrollTop = lScrollTop;
					}
				});
		}
	}
	_getLibelleParGenreAffichage(aGenreAffichageCourant) {
		const lListe =
			UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.getListeFiltresAff(
				this.donnees,
				this.parametres,
			);
		let lLibelleAffichage = "";
		lListe.parcourir((D) => {
			if (D.getGenre() === aGenreAffichageCourant) {
				lLibelleAffichage = D.getLibelle();
				return false;
			}
		});
		return lLibelleAffichage;
	}
	_selectionnerFiltre(aGenreAffichageCourant) {
		const H = [];
		let lAvecContenu = true;
		H.push('<div class="navheader">');
		H.push(
			'  <ie-btnimage ie-node="getNodeHeader" class="fleche-nav btnImageIcon icon_retour_mobile"></ie-btnimage>',
		);
		H.push(
			"  <h3>",
			this._getLibelleParGenreAffichage(aGenreAffichageCourant),
			"</h3>",
		);
		H.push("</div>");
		switch (aGenreAffichageCourant) {
			case Enumere_DonneesPersonnelles_3.TypeFiltreAffichage.securisation: {
				if (this.etatUtilisateurSco.derniereConnexion) {
					H.push(
						UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
							ObjetTraduction_1.GTraductions.getValeur(
								"PageCompte.DerniereConnexion",
							),
							Enumere_DonneesPersonnelles_1.EGenreTypeContenu.DerniereConnexion,
						),
					);
				}
				if (
					this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.compte.avecSaisieIdentifiant,
					)
				) {
					H.push('<div class="pc_traitSeparation"></div>');
					const lAuthentifiant = ObjetChaine_1.GChaine.ajouterEntites(
						this.applicationSco
							.getCommunication()
							.getChaineDechiffreeAES(this.donnees.authentifiant),
					);
					H.push(
						UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
							ObjetTraduction_1.GTraductions.getValeur(
								"PageCompte.Identifiant",
							),
							Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Identifiant,
							{ chaine: lAuthentifiant },
						),
					);
				}
				if (
					this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.compte.avecSaisieMotDePasse,
					)
				) {
					H.push('<div class="pc_traitSeparation"></div>');
					H.push(
						UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
							ObjetTraduction_1.GTraductions.getValeur("PageCompte.MotDePasse"),
							Enumere_DonneesPersonnelles_1.EGenreTypeContenu.MotDePasse,
							{ maskMdp: this.parametres.maskMDP },
						),
					);
				}
				if (
					ObjetParamChoixStrategieSecurisation_1.ObjetParamChoixStrategieSecurisation.avecParametrageVisible(
						this.donnees.securisation,
					)
				) {
					H.push('<div class="pc_traitSeparation"></div>');
					H.push(
						UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
							ObjetTraduction_1.GTraductions.getValeur(
								"DoubleAuth.SecuriteRenforcee",
							),
							Enumere_DonneesPersonnelles_1.EGenreTypeContenu.sourcesConnexions,
							{
								idSourcesConnexions:
									this.instanceChoixStratSecurisation.getNom(),
							},
						),
					);
				}
				if (
					InterfaceParamListeSourcesConnexions_1.InterfaceParamListeSourcesConnexions.avecParametrageVisible(
						this.donnees.securisation,
					)
				) {
					H.push('<div class="pc_traitSeparation"></div>');
					H.push(
						UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
							ObjetTraduction_1.GTraductions.getValeur(
								"DoubleAuth.AppareilsIdentifies",
							),
							Enumere_DonneesPersonnelles_1.EGenreTypeContenu.sourcesConnexions,
							{ idSourcesConnexions: this.instanceSourcesConnexions.getNom() },
						),
					);
				}
				break;
			}
			case Enumere_DonneesPersonnelles_3.TypeFiltreAffichage.coords:
				if (
					this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.compte.avecInformationsPersonnelles,
					)
				) {
					const lParams = {
						civilite: this.donnees.Informations.civilite,
						nom: this.donnees.Informations.nom,
						prenom: this.donnees.Informations.prenoms,
						avecInfosEntreprise: this.parametres.avecInfosEntreprise,
						entreprise: this.donnees.Informations.entreprise,
						fonction: this.donnees.Informations.fonction,
						adresse1: this.donnees.Informations.adresse1,
						adresse2: this.donnees.Informations.adresse2,
						adresse3: this.donnees.Informations.adresse3,
						adresse4: this.donnees.Informations.adresse4,
						codePostal: this.donnees.Informations.codePostal,
						ville: this.donnees.Informations.ville,
						province: this.donnees.Informations.province,
						pays: this.donnees.Informations.pays,
						eMail: this.donnees.Informations.eMail,
						largeurLibelleInput: this.parametres.largeurLibelleInput,
						largeurEmail: this.parametres.largeurEmail,
						hauteurInput: this.parametres.hauteurInput,
						largeurIndicatif: this.parametres.largeurIndicatif,
						avecTelFixe: this.parametres.avecTelFixe,
						avecTelFax: this.parametres.avecTelFax,
						largeurTel: this.parametres.largeurTel,
						droitImageAutoriser:
							!this.donnees.droitImage ||
							this.donnees.droitImage.autoriser === false,
					};
					if (
						![
							Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
							Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
							Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
							Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
						].includes(this.etatUtilisateurSco.GenreEspace)
					) {
						const lParamsHorsEleve = {
							avecSMS: this.donnees.Autorisations.SMSAutorise,
						};
						$.extend(lParams, lParamsHorsEleve);
					}
					H.push(
						UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
							ObjetTraduction_1.GTraductions.getValeur(
								"ParametresUtilisateur.Coordonnees",
							),
							Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Coordonnees,
							lParams,
						),
					);
				}
				if (this.donnees.droitImage) {
					H.push(
						UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
							ObjetTraduction_1.GTraductions.getValeur(
								"ParametresUtilisateur.DroitALImage",
							),
							Enumere_DonneesPersonnelles_1.EGenreTypeContenu.DroitImage,
							{ droitImage: !this.donnees.droitImage.autoriser },
						),
					);
				}
				if (this.parametres.avecNumeroINE) {
					H.push(
						UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
							ObjetTraduction_1.GTraductions.getValeur("PageCompte.NumeroINE"),
							Enumere_DonneesPersonnelles_1.EGenreTypeContenu.INE,
							{ numeroINE: this.donnees.Informations.numeroINE },
						),
					);
				}
				break;
			case Enumere_DonneesPersonnelles_3.TypeFiltreAffichage.communication:
				if (this.parametres.avecInfosAutorisations) {
					const lAvecSaisie = this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.compte.avecSaisieInfosPersoAutorisations,
					);
					const lParams = {
						avecSaisie: lAvecSaisie,
						avecSMS: this.donnees.AvecSMS,
						SMSAutorise: this.donnees.Autorisations.SMSAutorise,
						SMSAutoriseDisabled:
							!lAvecSaisie || !this.donnees.Informations.telephonePortable,
						emailAutorise: this.donnees.Autorisations.emailAutorise,
						emailAutoriseDisabled:
							!lAvecSaisie || !this.donnees.Informations.eMail,
						emailEtablissementAutorise:
							this.donnees.Autorisations.eMailEtablissementAutorise,
						emailParentAutorise: this.donnees.Autorisations.eMailParentAutorise,
						courrierPapierAutorise:
							this.donnees.Autorisations.courrierPapierAutorise,
						msgParent: this.donnees.Autorisations.msgParent,
						msgEleve: this.donnees.Autorisations.msgEleve,
						msgProfesseur: this.donnees.Autorisations.msgProfesseur,
						msgPersonnel: this.donnees.Autorisations.msgPersonnel,
						msgListePublicsEleves:
							this.donnees.Autorisations.msgListePublicsEleves,
						msgListePublicsParents:
							this.donnees.Autorisations.msgListePublicsParents,
						acceptDemandeRdv: this.donnees.Autorisations.acceptDemandeRdv,
						estContactVS: this.donnees.Autorisations.estContactVS,
						listeEleves: this.donnees.Autorisations.listeEleves,
						estDestinataireInfosGenerales:
							this.donnees.Autorisations.estDestinataireInfosGenerales,
						construireAutorisationsSupp: [
							Enumere_Espace_1.EGenreEspace.Mobile_Parent,
						].includes(this.etatUtilisateurSco.GenreEspace)
							? this._construireAutorisationsSupp.bind(this)
							: null,
						avecSwitch: false,
						genreEntiteAutorisationResponsable:
							this.donnees.Autorisations.genreEntiteAutorisationResponsable,
						genreEntiteAutorisationEleve:
							this.donnees.Autorisations.genreEntiteAutorisationEleve,
					};
					H.push(
						UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
							ObjetTraduction_1.GTraductions.getValeur(
								"PageCompte.Autorisations",
							),
							Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Autorisations,
							lParams,
						),
					);
				}
				if (
					[Enumere_Espace_1.EGenreEspace.Mobile_Parent].includes(
						this.etatUtilisateurSco.GenreEspace,
					) &&
					this.donnees.Autorisations.afficherCommunicationParents
				) {
					const lParams = {
						estDestinataireInfosGenerales:
							this.donnees.Autorisations.estDestinataireInfosGenerales,
						optionCommunicationActivationdiscussion:
							this.donnees.Autorisations
								.optionCommunicationActivationdiscussion,
						optionCommunicationPublicationMail:
							this.donnees.Autorisations.optionCommunicationPublicationMail,
						afficherOptionCommunicationPublicationEmail:
							this.donnees.Autorisations
								.afficherOptionCommunicationPublicationEmail,
						delegueDesClasses: this.donnees.Autorisations.delegueDesClasses,
						nbClasses: this.donnees.Autorisations.nbClasses,
						estDelegue: this.donnees.Autorisations.estDelegue,
						estMembreCA: this.donnees.Autorisations.estMembreCA,
					};
					H.push(
						UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
							ObjetTraduction_1.GTraductions.getValeur(
								"infosperso.communicationsParents",
							),
							Enumere_DonneesPersonnelles_1.EGenreTypeContenu
								.CommunicationParents,
							lParams,
						),
					);
				}
				break;
			case Enumere_DonneesPersonnelles_3.TypeFiltreAffichage.notification:
				if (
					UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.avecNotifications(
						this.donnees,
					)
				) {
					H.push(
						UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
							ObjetTraduction_1.GTraductions.getValeur(
								"PreferencesNotifications.titreNotifications",
							),
							Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Notifications,
							{
								envoiMail: this.donnees.envoiMailActif,
								notificationMail: this.donnees.notifications.notificationMail,
								gestionMailTravaux:
									this.donnees.notifications.gestionMailTravaux,
								notificationMailTravaux:
									this.donnees.notifications.notificationMailTravaux,
							},
						),
					);
				}
				break;
			case Enumere_DonneesPersonnelles_3.TypeFiltreAffichage.signature:
				if (this.donnees.Signature) {
					H.push(
						UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
							ObjetTraduction_1.GTraductions.getValeur(
								"infosperso.importerImageSignature",
							),
							Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Signature,
							{ signature: this.donnees.Signature },
						),
					);
				}
				break;
			case Enumere_DonneesPersonnelles_3.TypeFiltreAffichage
				.messagerieSignature:
				if (this.donnees.messagerieSignature) {
					H.push(
						UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
							ObjetTraduction_1.GTraductions.getValeur(
								"infosperso.MessagerieSignature",
							),
							Enumere_DonneesPersonnelles_1.EGenreTypeContenu
								.messagerieSignature,
						),
					);
				}
				break;
			case Enumere_DonneesPersonnelles_3.TypeFiltreAffichage.deconnexion:
				H.push(
					UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
						ObjetTraduction_1.GTraductions.getValeur(
							"infosperso.Liste_Deconnexion",
						),
						Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Deconnexion,
					),
				);
				break;
			case Enumere_DonneesPersonnelles_3.TypeFiltreAffichage.style:
				H.push(
					UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
						ObjetTraduction_1.GTraductions.getValeur(
							"ParametresUtilisateur.Accessibilite",
						),
						Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Accessibilite,
						{ controleur: this.controleur },
					),
				);
				H.push(
					UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
						ObjetTraduction_1.GTraductions.getValeur(
							"ParametresUtilisateur.Personnalisation",
						),
						Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Personnalisation,
						{ controleur: this.controleur },
					),
				);
				break;
			case Enumere_DonneesPersonnelles_3.TypeFiltreAffichage.generalites:
				H.push(
					UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
						ObjetTraduction_1.GTraductions.getValeur("infosperso.Generalites"),
						Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Generalites,
						{ controleur: this.controleur },
					),
				);
				break;
			case Enumere_DonneesPersonnelles_3.TypeFiltreAffichage.cahierDeTexte:
				H.push(
					UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
						"",
						Enumere_DonneesPersonnelles_1.EGenreTypeContenu.CahierDeTexte,
					),
				);
				break;
			case Enumere_DonneesPersonnelles_3.TypeFiltreAffichage.interTitre:
				lAvecContenu = false;
				break;
			case Enumere_DonneesPersonnelles_3.TypeFiltreAffichage.iCal:
				H.push(
					UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
						"",
						Enumere_DonneesPersonnelles_1.EGenreTypeContenu.iCal,
						{ controleur: this.controleur },
					),
				);
				break;
			default:
		}
		if (lAvecContenu) {
			ObjetHtml_1.GHtml.setDisplay(this.idMainPage, false);
			ObjetHtml_1.GHtml.setDisplay(this.idIntersticial, true);
			ObjetHtml_1.GHtml.setHtml(this.idIntersticial, H.join(""), {
				controleur: this.controleur,
			});
		}
		switch (aGenreAffichageCourant) {
			case Enumere_DonneesPersonnelles_3.TypeFiltreAffichage.securisation:
				if (this.donnees.securisation) {
					this.instanceChoixStratSecurisation.setDonnees(
						this.donnees.securisation,
						() =>
							this.applicationSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.estEnConsultation,
							),
					);
				}
				if (
					this.donnees.securisation &&
					this.donnees.securisation.listeSourcesConnexions
				) {
					this.instanceSourcesConnexions.setDonnees(
						this.donnees.securisation.listeSourcesConnexions,
					);
				}
				break;
		}
		const lThis = this;
		$("#" + Enumere_DonneesPersonnelles_2.EListeIds.identifiant.escapeJQ()).on({
			mouseup: function () {
				lThis._callbackIdentifiant();
			},
		});
		$("#" + Enumere_DonneesPersonnelles_2.EListeIds.mdp.escapeJQ()).on({
			mouseup: function () {
				lThis._callbackMDP();
			},
		});
	}
	_construireAutorisationsSupp() {
		const lHtml = [];
		if (this.donnees.Autorisations.listeEleves.count() > 0) {
			lHtml.push(
				'<div class="Gras EspaceHaut" style="clear:both;">',
				ObjetTraduction_1.GTraductions.getValeur("infosperso.titreRecevoir"),
				"</div>",
			);
		}
		return lHtml.join("");
	}
	_construirePage() {
		const lHtml = [];
		lHtml.push('<div class="ObjetCompte">');
		lHtml.push(
			'<div class="compte-contain" id="',
			this.idIntersticial,
			'" style="display:none;"></div>',
		);
		lHtml.push('<div id="', this.idMainPage, '" style="display:block;">');
		lHtml.push('<div id="', this.instanceListeFiltre.getNom(), '"></div>');
		lHtml.push("</div>");
		lHtml.push("</div>");
		return lHtml.join("");
	}
	_callbackMDP() {
		UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.fenetreModificationMDP(
			this,
		);
	}
	_callbackIdentifiant() {
		UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.fenetreModificationIdentifiant(
			this,
			this.recupererDonnees.bind(this),
		);
	}
	_surReponseRequetePageInfosPerso(aDonnees) {
		$.extend(true, this.donnees, aDonnees);
		this.moteurICal.setDonnees(this.donnees.iCal);
		this.donnees.Signature = aDonnees.Signature;
		ObjetHtml_1.GHtml.setHtml(this.Nom, this._construirePage(), {
			controleur: this.controleur,
		});
		const lListe =
			UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.getListeFiltresAff(
				this.donnees,
				this.parametres,
			);
		if (
			!this._genrePageCourante &&
			this.etatUtilisateurSco.getGenreAffichageCompteSelectionne()
		) {
			this._genrePageCourante =
				this.etatUtilisateurSco.getGenreAffichageCompteSelectionne();
			this.etatUtilisateurSco.setGenreAffichageCompteSelectionne(null);
		}
		this.instanceListeFiltre.initialiser();
		this.instanceListeFiltre
			.setOptionsListe({ skin: ObjetListe_1.ObjetListe.skin.flatDesign })
			.setDonnees(
				new DonneesListe_FiltreCompte_1.DonneesListe_FiltreCompte(
					lListe,
				).setOptions({ avecSelection: false }),
			);
		if (this._genrePageCourante) {
			this._selectionnerFiltre(this._genrePageCourante);
		}
	}
	_envoiRequetePage() {
		return new ObjetRequetePageInfosPerso_1.ObjetRequetePageInfosPerso(this)
			.lancerRequete()
			.then(this._surReponseRequetePageInfosPerso.bind(this));
	}
}
exports.PageCompteMobile = PageCompteMobile;
