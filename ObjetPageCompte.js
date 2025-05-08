exports.ObjetPageCompte = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Espace_1 = require("Enumere_Espace");
const UtilitairePageDonneesPersonnelles_1 = require("UtilitairePageDonneesPersonnelles");
const ObjetElement_1 = require("ObjetElement");
const Enumere_DonneesPersonnelles_1 = require("Enumere_DonneesPersonnelles");
const Enumere_DonneesPersonnelles_2 = require("Enumere_DonneesPersonnelles");
const Enumere_DonneesPersonnelles_3 = require("Enumere_DonneesPersonnelles");
const InterfaceParamListeSourcesConnexions_1 = require("InterfaceParamListeSourcesConnexions");
const ObjetParamChoixStrategieSecurisation_1 = require("ObjetParamChoixStrategieSecurisation");
const ObjetPreferenceMessagerie_1 = require("ObjetPreferenceMessagerie");
const ObjetMessagerieSignature_1 = require("ObjetMessagerieSignature");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetPreferenceCahierDeTexte_1 = require("ObjetPreferenceCahierDeTexte");
const ObjetFicheAppliMobile_1 = require("ObjetFicheAppliMobile");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetPreferenceAccessibilite_1 = require("ObjetPreferenceAccessibilite");
const MultipleObjetFenetre_InstallPronote = require("ObjetFenetre_InstallPronote");
const ObjetRequeteSaisieInformations = require("ObjetRequeteSaisieInformations");
const UtilitaireSyntheseVocale_1 = require("UtilitaireSyntheseVocale");
const MoteurParametresiCal_1 = require("MoteurParametresiCal");
class ObjetPageCompte extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.objetParametresSco = this.applicationSco.getObjetParametres();
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
			avecNumeroINE:
				this.etatUtilisateurSco.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Eleve,
			avecInfosAutorisations: [
				Enumere_Espace_1.EGenreEspace.Parent,
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
				Enumere_Espace_1.EGenreEspace.PrimMairie,
				Enumere_Espace_1.EGenreEspace.Etablissement,
				Enumere_Espace_1.EGenreEspace.Accompagnant,
				Enumere_Espace_1.EGenreEspace.Tuteur,
				Enumere_Espace_1.EGenreEspace.Administrateur,
				Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
			].includes(this.etatUtilisateurSco.GenreEspace),
		};
		this.listeDelais = new ObjetListeElements_1.ObjetListeElements()
			.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"PreferencesNotifications.15min",
					),
					15,
				),
			)
			.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"PreferencesNotifications.30min",
					),
					30,
				),
			)
			.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"PreferencesNotifications.1h",
					),
					60,
				),
			)
			.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"PreferencesNotifications.4h",
					),
					240,
				),
			)
			.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"PreferencesNotifications.12h",
					),
					720,
				),
			)
			.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"PreferencesNotifications.24h",
					),
					1440,
				),
			);
		this.donnees =
			UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.getDonneesDefaut();
		this.instanceSourcesConnexions = ObjetIdentite_1.Identite.creerInstance(
			InterfaceParamListeSourcesConnexions_1.InterfaceParamListeSourcesConnexions,
			{
				pere: this,
				evenement: (aParam) => {
					if (aParam && aParam.actualiser) {
						this.callback.appel();
					}
				},
			},
		);
		this.instanceChoixStratSecurisation =
			ObjetIdentite_1.Identite.creerInstance(
				ObjetParamChoixStrategieSecurisation_1.ObjetParamChoixStrategieSecurisation,
				{
					pere: this,
					evenement: (aParam) => {
						if (aParam && aParam.actualiser) {
							this.callback.appel();
						}
					},
				},
			);
		this.moteurICal = new MoteurParametresiCal_1.MoteurParametresiCal();
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
					btnAppli: {
						event: function () {
							ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
								ObjetFicheAppliMobile_1.ObjetFicheAppliMobile,
								{ pere: aInstance },
							).afficher(aInstance.objetParametresSco.URLMobile);
						},
					},
					btnClient: {
						event: function () {
							if (
								MultipleObjetFenetre_InstallPronote === null ||
								MultipleObjetFenetre_InstallPronote === void 0
									? void 0
									: MultipleObjetFenetre_InstallPronote.ObjetFenetre_InstallPronote
							) {
								ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
									MultipleObjetFenetre_InstallPronote.ObjetFenetre_InstallPronote,
									{
										pere: aInstance,
										initialiser: function (aFenetre) {
											aFenetre.setOptionsFenetre({
												titre: ObjetTraduction_1.GTraductions.getValeur(
													"InstallPronote.titre",
												),
												largeur: 400,
												hauteur: 120,
												listeBoutons: [
													ObjetTraduction_1.GTraductions.getValeur(
														"principal.fermer",
													),
												],
											});
											aFenetre.setParametres(
												aInstance.etatUtilisateurSco.urlInstallClient,
												aInstance.etatUtilisateurSco.urlParamClient,
												aInstance.etatUtilisateurSco.designationClient,
											);
										},
									},
								).afficher();
							}
						},
					},
					accueil: {
						cbAfficherPageAccueil: {
							getValue: function () {
								return aInstance.applicationSco.parametresUtilisateur.get(
									"demarrerSurPageAccueil",
								);
							},
							setValue: function (aValue) {
								aInstance.applicationSco.parametresUtilisateur.set(
									"demarrerSurPageAccueil",
									aValue,
								);
							},
						},
					},
					notification: {
						cbNotification: {
							getValue: function () {
								return aInstance.applicationSco.parametresUtilisateur.get(
									"utiliserNotification",
								);
							},
							setValue: function (aValue) {
								aInstance.applicationSco.parametresUtilisateur.set(
									"utiliserNotification",
									aValue,
								);
							},
						},
					},
					generalites: {
						cbMasquerDonneesAutresProfesseurs: {
							getValue: function () {
								return aInstance.applicationSco.parametresUtilisateur.get(
									"masquerDonneesAutresProfesseurs",
								);
							},
							setValue: function (aValue) {
								aInstance.applicationSco.parametresUtilisateur.set(
									"masquerDonneesAutresProfesseurs",
									aValue,
								);
							},
						},
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
					EDT: {
						comboCouleur: {
							init(aCombo) {
								aCombo.setOptionsObjetSaisie({
									labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
										"infosperso.LabelCouleur",
									),
								});
							},
							getDonnees: function (aDonnees) {
								if (!aDonnees) {
									const lListeLignes =
										new ObjetListeElements_1.ObjetListeElements();
									let lElement = new ObjetElement_1.ObjetElement(
										ObjetTraduction_1.GTraductions.getValeur(
											"infosperso.CouleurMatieres",
										),
									);
									lElement.couleurClasse = false;
									lListeLignes.addElement(lElement);
									lElement = new ObjetElement_1.ObjetElement(
										ObjetTraduction_1.GTraductions.getValeur(
											"infosperso.CouleurClasses",
										),
									);
									lElement.couleurClasse = true;
									lListeLignes.addElement(lElement);
									aInstance.listeChoixCDTCouleur = lListeLignes;
									return lListeLignes;
								}
							},
							getIndiceSelection: function () {
								const lCouleurClasse =
									aInstance.applicationSco.parametresUtilisateur.get(
										"EDT.couleurClasse",
									);
								let lIndice = 0;
								aInstance.listeChoixCDTCouleur.parcourir((D, index) => {
									if (D.couleurClasse === lCouleurClasse) {
										lIndice = index;
										return false;
									}
								});
								return lIndice;
							},
							event: function (aParametres) {
								if (
									aParametres.genreEvenement ===
									Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
										.selection
								) {
									aInstance.applicationSco.parametresUtilisateur.set(
										"EDT.couleurClasse",
										aParametres.element.couleurClasse,
									);
								}
							},
							getDisabled: function () {
								return aInstance.applicationSco.getModeExclusif();
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
								aInstance.setDonneesObjetSaisie({
									liste: lListe,
									selection: lIndiceSelection,
								});
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
									longueur: 280,
									largeurListe: 280,
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
						QRCode: function () {
							return aInstance.moteurICal.composeQRCode();
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
					getIdentiteMessagerie() {
						return {
							class: ObjetPreferenceMessagerie_1.ObjetPreferenceMessagerie,
							pere: aInstance,
						};
					},
					getIdentiteAccessibilite: function () {
						return {
							class:
								ObjetPreferenceAccessibilite_1.ObjetPreferenceAccessibilite,
							pere: aInstance,
						};
					},
					getIdentiteMessagerieSignature() {
						return {
							class: ObjetMessagerieSignature_1.ObjetMessagerieSignature,
							pere: aInstance,
						};
					},
				},
			),
		);
	}
	getListeFiltresAff() {
		return UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.getListeFiltresAff(
			this.donnees,
			this.parametres,
		);
	}
	setDonneesPageCompte(aParametres) {
		this.donneesParams = aParametres;
		this.donnees.Signature = {};
		$.extend(true, this.donnees, aParametres.donnees);
		if (this.donnees.iCal) {
			this.moteurICal.setDonnees(this.donnees.iCal);
		}
		if (this.donnees.Autorisations && this.donnees.Autorisations.listeEleves) {
			this.donnees.Autorisations.listeEleves.trier();
		}
	}
	afficher(aFiltre) {
		this.filtreAffichage = aFiltre;
		ObjetHtml_1.GHtml.setHtml(this.Nom, this._construirePage(), {
			controleur: this.controleur,
		});
		const lDonneesParams = this.donneesParams;
		$(
			"#" + Enumere_DonneesPersonnelles_3.EListeIds.identifiant.escapeJQ(),
		).eventValidation(() => {
			lDonneesParams.callbackIdentifiant();
		});
		$(
			"#" + Enumere_DonneesPersonnelles_3.EListeIds.mdp.escapeJQ(),
		).eventValidation(() => {
			lDonneesParams.callbackMDP();
		});
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
			new ObjetRequeteSaisieInformations(
				this,
				this.Pere["recupererDonnees"].bind(this.Pere),
			)
				.addUpload({ listeFichiers: lFichiers })
				.lancerRequete(lStructure);
		}
	}
	_construirePage() {
		const H = [];
		if (
			this.filtreAffichage === null ||
			this.filtreAffichage ===
				Enumere_DonneesPersonnelles_2.TypeFiltreAffichage.securisation
		) {
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
				H.push(
					UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
						ObjetTraduction_1.GTraductions.getValeur("PageCompte.Identifiant"),
						Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Identifiant,
						{ chaine: this.donnees.authentifiant },
					),
				);
			}
			if (
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.compte.avecSaisieMotDePasse,
				)
			) {
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
				H.push(
					UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
						ObjetTraduction_1.GTraductions.getValeur(
							"DoubleAuth.SecuriteRenforcee",
						),
						Enumere_DonneesPersonnelles_1.EGenreTypeContenu.sourcesConnexions,
						{
							idSourcesConnexions: this.instanceChoixStratSecurisation.getNom(),
						},
					),
				);
			}
			if (
				InterfaceParamListeSourcesConnexions_1.InterfaceParamListeSourcesConnexions.avecParametrageVisible(
					this.donnees.securisation,
				)
			) {
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
		}
		let lParams;
		if (
			this.filtreAffichage === null ||
			this.filtreAffichage ===
				Enumere_DonneesPersonnelles_2.TypeFiltreAffichage.coords
		) {
			if (
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.compte.avecInformationsPersonnelles,
				)
			) {
				lParams = {
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
					avecSMS: this.donnees.AvecSMS,
					droitImageAutoriser:
						!this.donnees.droitImage ||
						this.donnees.droitImage.autoriser === false,
				};
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
		}
		if (
			this.filtreAffichage === null ||
			this.filtreAffichage ===
				Enumere_DonneesPersonnelles_2.TypeFiltreAffichage.communication
		) {
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
					construireAutorisationsSupp: this.construireAutorisationsSupp,
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
				[Enumere_Espace_1.EGenreEspace.Parent].includes(
					this.etatUtilisateurSco.GenreEspace,
				) &&
				this.donnees.Autorisations.afficherCommunicationParents
			) {
				lParams = {
					estDestinataireInfosGenerales:
						this.donnees.Autorisations.estDestinataireInfosGenerales,
					optionCommunicationActivationdiscussion:
						this.donnees.Autorisations.optionCommunicationActivationdiscussion,
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
		}
		if (
			this.filtreAffichage === null ||
			this.filtreAffichage ===
				Enumere_DonneesPersonnelles_2.TypeFiltreAffichage.notification
		) {
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
							gestionMailTravaux: this.donnees.notifications.gestionMailTravaux,
							notificationMailTravaux:
								this.donnees.notifications.notificationMailTravaux,
						},
					),
				);
			}
		}
		if (
			this.filtreAffichage === null ||
			this.filtreAffichage ===
				Enumere_DonneesPersonnelles_2.TypeFiltreAffichage.signature
		) {
			if (this.donnees.Signature && this.applicationSco.estPrimaire) {
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
		}
		if (
			this.filtreAffichage === null ||
			this.filtreAffichage ===
				Enumere_DonneesPersonnelles_2.TypeFiltreAffichage.generalites
		) {
			H.push(
				UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
					ObjetTraduction_1.GTraductions.getValeur("infosperso.Generalites"),
					Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Generalites,
					{ controleur: this.controleur },
				),
			);
		}
		if (
			this.filtreAffichage === null ||
			this.filtreAffichage ===
				Enumere_DonneesPersonnelles_2.TypeFiltreAffichage.cahierDeTexte
		) {
			H.push(
				UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
					"",
					Enumere_DonneesPersonnelles_1.EGenreTypeContenu.CahierDeTexte,
				),
			);
		}
		if (
			this.filtreAffichage === null ||
			this.filtreAffichage ===
				Enumere_DonneesPersonnelles_2.TypeFiltreAffichage.style
		) {
			H.push(
				UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
					ObjetTraduction_1.GTraductions.getValeur(
						"ParametresUtilisateur.Accessibilite",
					),
					Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Accessibilite,
					{ controleur: this.controleur },
				),
			);
			if (!this.applicationSco.estAppliMobile) {
				H.push(
					UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
						ObjetTraduction_1.GTraductions.getValeur(
							"ParametresUtilisateur.Personnalisation",
						),
						Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Personnalisation,
						{ controleur: this.controleur },
					),
				);
			}
		}
		if (
			this.filtreAffichage === null ||
			this.filtreAffichage ===
				Enumere_DonneesPersonnelles_2.TypeFiltreAffichage.iCal
		) {
			H.push(
				UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
					ObjetTraduction_1.GTraductions.getValeur("infosperso.iCal.Titre"),
					Enumere_DonneesPersonnelles_1.EGenreTypeContenu.iCal,
					{ controleur: this.controleur },
				),
			);
		}
		if (
			this.filtreAffichage === null ||
			this.filtreAffichage ===
				Enumere_DonneesPersonnelles_2.TypeFiltreAffichage.deconnexion
		) {
			H.push(
				UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.Liste_Deconnexion",
					),
					Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Deconnexion,
				),
			);
		}
		if (
			this.filtreAffichage ===
				Enumere_DonneesPersonnelles_2.TypeFiltreAffichage.messagerieSignature &&
			this.etatUtilisateurSco.messagerieSignature
		) {
			H.push(
				UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.MessagerieSignature",
					),
					Enumere_DonneesPersonnelles_1.EGenreTypeContenu.messagerieSignature,
				),
			);
		}
		return H.join("");
	}
}
exports.ObjetPageCompte = ObjetPageCompte;
