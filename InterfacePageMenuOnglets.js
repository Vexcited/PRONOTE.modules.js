const Invocateur_1 = require("Invocateur");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const _InterfacePageMenuOnglets_1 = require("_InterfacePageMenuOnglets");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const UtilitaireContactVieScolaire_Mobile_1 = require("UtilitaireContactVieScolaire_Mobile");
const ActionneurCentraleNotificationsSco_1 = require("ActionneurCentraleNotificationsSco");
const ObjetDonneesCentraleNotifications_1 = require("ObjetDonneesCentraleNotifications");
const ObjetFicheEtablissement_1 = require("ObjetFicheEtablissement");
const ObjetDate_1 = require("ObjetDate");
const ObjetDiscussion_Mobile_1 = require("ObjetDiscussion_Mobile");
const tag_1 = require("tag");
const TypeStatutConnexion_1 = require("TypeStatutConnexion");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_FicheEleve = require("ObjetFenetre_FicheEleve");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const ObjetFenetre_Message_1 = require("ObjetFenetre_Message");
const UtilitaireHarcelement_1 = require("UtilitaireHarcelement");
const ObjetFenetreHarcelement_1 = require("ObjetFenetreHarcelement");
const TypeCollectivite_1 = require("TypeCollectivite");
const ObjetFenetre_SelecteurMembre_1 = require("ObjetFenetre_SelecteurMembre");
const UtilitaireContactReferents_1 = require("UtilitaireContactReferents");
class ObjetAffichagePageMenuOnglets extends _InterfacePageMenuOnglets_1._InterfacePagePageMenuOnglets {
	constructor(...aParams) {
		super(...aParams);
		this.applicationScoMobile = GApplication;
		this.etatutilisateurScoMobile =
			this.applicationScoMobile.getEtatUtilisateur();
		this.idNotifInfo = this.Nom + "_NotifInfo";
		this.idNotifComm = this.Nom + "_NotifComm";
		this.logoDepartementImage = GParametres.logoDepartementImage;
		this.logoDepartementLien = GParametres.logoDepartementLien;
		this.donneesCentraleNotifications =
			this.applicationScoMobile.donneesCentraleNotifications;
		this.avecBoutonHarcelement =
			UtilitaireHarcelement_1.UtilitaireHarcelement.avecBoutonHarcelement();
		Invocateur_1.Invocateur.abonner(
			ObjetDonneesCentraleNotifications_1.ObjetDonneesCentraleNotifications
				.typeNotif.surModification,
			(aDonnees) => {
				this._actualiserBadge(aDonnees);
			},
			this,
		);
		Invocateur_1.Invocateur.abonner(
			"ouvrir_ficheEtab",
			() => {
				const lFicheEtablissement =
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFicheEtablissement_1.ObjetFicheEtablissement,
						{ pere: this },
					);
				lFicheEtablissement.setDonnees({
					listeInformationsEtablissements:
						this.etatutilisateurScoMobile.listeInformationsEtablissements,
					avecReferentsHarcelement: true,
					avecReferentsVieScolaire:
						UtilitaireContactReferents_1.UtilitaireContactReferents.avecAffichageContactReferentsVieScolaire(
							this.etatutilisateurScoMobile.GenreEspace,
						),
				});
			},
			this,
		);
		Invocateur_1.Invocateur.abonner(
			"ouvrir_selecteurMembre",
			() => {
				if (GParametres.avecMembre) {
					ObjetFenetre_SelecteurMembre_1.ObjetFenetre_SelecteurMembre.ouvrir();
				}
			},
			this,
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnAlertesPPMSEnCours: {
				event: function () {
					aInstance.interfaceMobileCP.fermerMenuOnglet();
					UtilitaireContactVieScolaire_Mobile_1.UtilitaireContactVieScolaire_Mobile.afficherAlertePPMS();
				},
				getHtml: function () {
					return aInstance.composeBadgeBtn(
						UtilitaireContactVieScolaire_Mobile_1.UtilitaireContactVieScolaire_Mobile.getListeAlertePPMSEnCours().count(),
						ObjetTraduction_1.GTraductions.getValeur(
							"Messagerie.AlerteEnseignantsPersonnels",
						),
					);
				},
				afficher: function () {
					return (
						UtilitaireContactVieScolaire_Mobile_1.UtilitaireContactVieScolaire_Mobile.getListeAlertePPMSEnCours() &&
						UtilitaireContactVieScolaire_Mobile_1.UtilitaireContactVieScolaire_Mobile.getListeAlertePPMSEnCours().count() >
							0
					);
				},
			},
			btnAlertesPPMSCreation: {
				event: function () {
					aInstance.interfaceMobileCP.fermerMenuOnglet();
					UtilitaireContactVieScolaire_Mobile_1.UtilitaireContactVieScolaire_Mobile.creerAlertePPMS();
				},
				afficher: function () {
					return aInstance.applicationScoMobile.droits.get(
						ObjetDroitsPN_1.TypeDroits.communication.lancerAlertesPPMS,
					);
				},
			},
			btnMessageInstant: {
				event: function () {
					aInstance.interfaceMobileCP.fermerMenuOnglet();
					UtilitaireContactVieScolaire_Mobile_1.UtilitaireContactVieScolaire_Mobile.demarrerMessageInstantane();
				},
				getHtmlBtnMessageInstant: function () {
					let lHtml = aInstance.composeBadgeBtn(
						aInstance.donneesCentraleNotifications.nbConversationEnCours,
						ObjetTraduction_1.GTraductions.getValeur(
							"Messagerie.EnvoiMessageInstantane",
						),
					);
					if (
						aInstance.applicationScoMobile.donneesCentraleNotifications
							.nbConversationEnCours === 0
					) {
						lHtml += (0, tag_1.tag)("i", {
							class: [
								"as-tag",
								"TypeGenreStatutConnexion-double-icone",
								TypeStatutConnexion_1.TypeGenreStatutConnexionUtil.getClassIcon(
									aInstance.applicationScoMobile.donneesCentraleNotifications
										.statutConnexionCommunication,
								),
							],
						});
					}
					return lHtml;
				},
				afficher: function () {
					return aInstance.applicationScoMobile.droits.get(
						ObjetDroitsPN_1.TypeDroits.communication.avecMessageInstantane,
					);
				},
			},
			ajouterAbsence: {
				event: function () {
					aInstance.etatutilisateurScoMobile.setPage({
						Onglet: Enumere_Onglet_1.EGenreOnglet.VieScolaire_Recapitulatif,
						executerSaisieAbsenceParent: true,
						retourAccueil:
							aInstance.etatutilisateurScoMobile.getGenreOnglet() ===
							Enumere_Onglet_1.EGenreOnglet.Accueil,
					});
					if (aInstance.etatutilisateurScoMobile.getGenreOnglet()) {
						aInstance.interfaceMobileCP.evenementPageMobile({
							genreOnglet: Enumere_Onglet_1.EGenreOnglet.Accueil,
							genreOngletDest:
								Enumere_Onglet_1.EGenreOnglet.VieScolaire_Recapitulatif,
						});
					}
				},
			},
			btnMessageCarnet: {
				event() {
					aInstance.interfaceMobileCP.fermerMenuOnglet();
					ObjetDiscussion_Mobile_1.ObjetDiscussion_Mobile.creerCarnetDeLiaisonPrimParent();
				},
			},
			btnMessagePrimEleve: {
				event() {
					aInstance.interfaceMobileCP.fermerMenuOnglet();
					ObjetDiscussion_Mobile_1.ObjetDiscussion_Mobile.creerDiscussionEnFenetre();
				},
			},
			btnMessageMairie: {
				event() {
					UtilitaireMessagerie_1.UtilitaireMessagerie.creerDiscussionAvecMairie(
						ObjetFenetre_Message_1.ObjetFenetre_Message,
						aInstance,
					);
				},
			},
			btnFicheEleve: {
				event() {
					ObjetFenetre_FicheEleve.ouvrir({
						instance: aInstance,
						avecRequeteDonnees: true,
						donnees: { eleve: aInstance.etatutilisateurScoMobile.getMembre() },
					});
				},
			},
			nodeFicheEtablissement: function () {
				$(this.node).on("click", () => {
					aInstance.interfaceMobileCP.fermerMenuOnglet();
					Invocateur_1.Invocateur.evenement("ouvrir_ficheEtab");
				});
			},
			afficherSeparateur: function () {
				return (
					aInstance.applicationScoMobile.droits.get(
						ObjetDroitsPN_1.TypeDroits.communication.avecMessageInstantane,
					) ||
					aInstance.applicationScoMobile.droits.get(
						ObjetDroitsPN_1.TypeDroits.communication.lancerAlertesPPMS,
					) ||
					aInstance.avecBoutonHarcelement
				);
			},
			btnStopHarcelement: {
				event() {
					const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetreHarcelement_1.ObjetFenetreHarcelement,
						{ pere: aInstance },
					);
					lFenetre.setDonnees();
				},
			},
		});
	}
	traiterListeRessource() {
		this.listeRessources = this.applicationScoMobile
			.getInterfaceMobile()
			.getListeRessources();
		if (this.listeRessources.count() > 1) {
			for (let i = 0; i < this.listeRessources.count(); i++) {
				const lRessource = this.listeRessources.get(i);
				let lClasse = lRessource.Classe.getLibelle();
				if (lRessource.listeClasseHistorique) {
					if (!lRessource.estClasseRattachementduJour) {
						lRessource.listeClasseHistorique.parcourir((aClasse) => {
							if (aClasse.courant) {
								lClasse = aClasse.getLibelle();
								return false;
							}
						});
					}
				}
				this.listeRessources.get(i).sousTitre = lClasse;
			}
		}
	}
	avecLogoDepartement() {
		var _a, _b;
		const lAvecCollectivite =
			((_b =
				(_a = this.applicationScoMobile.getObjetParametres()) === null ||
				_a === void 0
					? void 0
					: _a.collectivite) === null || _b === void 0
				? void 0
				: _b.genreCollectivite) !==
			TypeCollectivite_1.TypeCollectivite.TCL_Aucune;
		return Boolean(!lAvecCollectivite && GParametres.logoDepartementImage);
	}
	actionSurRecupererDonnees() {
		this.listeOnglets = new ObjetListeElements_1.ObjetListeElements();
		this.listeOngletsTraitee = new ObjetListeElements_1.ObjetListeElements();
		if (this.etatutilisateurScoMobile.listeOnglets.count() > 0) {
			for (
				let i = 0;
				i < this.etatutilisateurScoMobile.listeOngletsOriginal.count();
				i++
			) {
				const lElement =
					this.etatutilisateurScoMobile.listeOngletsOriginal.get(i);
				if (lElement.Actif) {
					this.listeOnglets.addElement(lElement);
					if (lElement.getLibelle().search(/<br\s?\/?>/gi) > -1) {
						lElement.setLibelle(
							lElement.getLibelle().replace(/<br\s?\/?>/gi, " "),
						);
					}
					lElement.sousTitre = "";
					lElement.imagePosition = "left";
					switch (lElement.getGenre()) {
						case Enumere_Onglet_1.EGenreOnglet.EmploiDuTemps:
							lElement.imagePerso = "icon_calendar";
							break;
						case Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsClasse:
							lElement.imagePerso = "icon_calendar";
							break;
						case Enumere_Onglet_1.EGenreOnglet.CDT_TAF:
							lElement.imagePerso = "icon_taf";
							break;
						case Enumere_Onglet_1.EGenreOnglet.CDT_Contenu:
							lElement.imagePerso = "icon_contenu_cours";
							break;
						case Enumere_Onglet_1.EGenreOnglet.ManuelsNumeriques:
							lElement.imagePerso = "icon_book";
							break;
						case Enumere_Onglet_1.EGenreOnglet.ReleveDeCompetences:
						case Enumere_Onglet_1.EGenreOnglet.Bulletins:
						case Enumere_Onglet_1.EGenreOnglet.ConseilDeClasse:
						case Enumere_Onglet_1.EGenreOnglet.BulletinCompetences:
						case Enumere_Onglet_1.EGenreOnglet.BulletinAnneesPrec_Note:
						case Enumere_Onglet_1.EGenreOnglet.BulletinAnneesPrec_Competence:
							lElement.imagePerso = "icon_bulletin";
							break;
						case Enumere_Onglet_1.EGenreOnglet.EquipePedagogique:
							lElement.imagePerso = "icon_groupes_accompagnement_personnalise";
							break;
						case Enumere_Onglet_1.EGenreOnglet.Releve:
							lElement.imagePerso = "icon_releve_notes";
							break;
						case Enumere_Onglet_1.EGenreOnglet.Menus:
							lElement.imagePerso = "icon_food";
							break;
						case Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_AppelEtSuivi:
							lElement.imagePerso = "icon_feuille_appel";
							break;
						case Enumere_Onglet_1.EGenreOnglet.GeneralVieEtablissement:
							break;
						case Enumere_Onglet_1.EGenreOnglet.Informations:
							lElement.imagePerso = "icon_infos_sondages";
							lElement.idNotif = this.idNotifInfo;
							break;
						case Enumere_Onglet_1.EGenreOnglet.Messagerie:
							lElement.imagePerso = "icon_comments";
							lElement.idNotif = this.idNotifComm;
							break;
						case Enumere_Onglet_1.EGenreOnglet.Incidents:
							lElement.imagePerso = "icon_bolt";
							break;
						case Enumere_Onglet_1.EGenreOnglet.ListeEleves:
							lElement.imagePerso = "icon_uniF2BC";
							break;
						case Enumere_Onglet_1.EGenreOnglet.Agenda:
							lElement.imagePerso = "icon_calendar_empty";
							break;
						case Enumere_Onglet_1.EGenreOnglet.Rencontre:
							lElement.imagePerso = "icon_projet_accompagnement";
							break;
						case Enumere_Onglet_1.EGenreOnglet.DernieresNotes:
							lElement.imagePerso = "icon_notes_etoile";
							break;
						case Enumere_Onglet_1.EGenreOnglet.DernieresEvaluations:
							lElement.imagePerso = "icon_dernieres_evals";
							break;
						case Enumere_Onglet_1.EGenreOnglet.VieScolaire_Recapitulatif:
							lElement.imagePerso = "icon_vs";
							break;
						case Enumere_Onglet_1.EGenreOnglet.TableauDeBord:
							lElement.imagePerso = "icon_th_large";
							break;
						case Enumere_Onglet_1.EGenreOnglet.SaisieNotes:
							lElement.imagePerso = "icon_releve_notes";
							break;
						case Enumere_Onglet_1.EGenreOnglet.SaisieCahierDeTextes:
							lElement.imagePerso = "icon_saisie_cahier_texte";
							break;
						case Enumere_Onglet_1.EGenreOnglet.InfosPerso:
							lElement.imagePerso = "icon_th_large";
							break;
						case Enumere_Onglet_1.EGenreOnglet.ParametresUtilisateur:
							lElement.imagePerso = "icon_th_large";
							break;
						case Enumere_Onglet_1.EGenreOnglet.CompteEleve:
							lElement.imagePerso = "icon_th_large";
							break;
						case Enumere_Onglet_1.EGenreOnglet.DocumentsATelecharger:
							lElement.imagePerso = "icon_th_large";
							break;
						case Enumere_Onglet_1.EGenreOnglet.SaisieOrientation:
							lElement.imagePerso = "icon_th_large";
							break;
						default:
					}
				}
			}
			this.afficherListe();
		}
	}
	getInfosComboMembre(aMembre) {
		const lHtmlPhoto = [];
		if (aMembre && aMembre.avecPhoto) {
			const lUrlPhoto = ObjetChaine_1.GChaine.creerUrlBruteLienExterne(
				aMembre,
				{ libelle: "photo.jpg" },
			);
			lHtmlPhoto.push(
				'<img src="',
				lUrlPhoto,
				'" style="width:100%;" onerror="$(this).remove();" alt="',
				aMembre.getLibelle(),
				'"/>',
			);
		}
		return {
			libelle: aMembre.libelleLong || aMembre.getLibelle(),
			photo: lHtmlPhoto.join(""),
		};
	}
	actualiserTitre() {
		if (this.etatutilisateurScoMobile.derniereConnexion) {
			const lDerniereConnexion = ObjetTraduction_1.GTraductions.getValeur(
				"accueil.PrecedenteConnection",
				[
					ObjetDate_1.GDate.formatDate(
						this.etatutilisateurScoMobile.derniereConnexion,
						"%JJJ %JJ %MMM",
					),
					ObjetDate_1.GDate.formatDate(
						this.etatutilisateurScoMobile.derniereConnexion,
						"%hh%sh%mm",
					),
				],
			);
			ObjetHtml_1.GHtml.setHtml(this.idDerniereConnexion, lDerniereConnexion);
		}
	}
	getEspaceIcone() {
		let lEspaceIcone = "";
		switch (this.applicationScoMobile.acces.genreEspace) {
			case Enumere_Espace_1.EGenreEspace.Mobile_Eleve:
				lEspaceIcone = "photoEspaceEtudiant";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Professeur:
				lEspaceIcone = "photoEspaceEnseignant";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur:
				lEspaceIcone = "photoEspaceEnseignant";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Parent:
				lEspaceIcone = "photoEspaceParent";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimParent:
				lEspaceIcone = "photoEspaceParent";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Etablissement:
				lEspaceIcone = "photoEspaceVS";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Administrateur:
				lEspaceIcone = "photoEspaceDirection";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant:
				lEspaceIcone = "photoEspaceVS";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant:
				lEspaceIcone = "photoEspaceVS";
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Tuteur:
				lEspaceIcone = "photoEspaceVS";
				break;
		}
		return lEspaceIcone;
	}
	getGenreOngletAccueil() {
		return Enumere_Onglet_1.EGenreOnglet.Accueil;
	}
	changementRessource() {
		this.evenementListeOnglets(false);
	}
	composeBoutonMenuSupp() {
		const H = [];
		let lAvecSep = false;
		let lSetSep = () => {
			if (!lAvecSep) {
				H.push("<hr />");
				lAvecSep = true;
			}
		};
		if (
			this.applicationScoMobile.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.estDestinataireChat,
			)
		) {
			H.push(
				'<ie-btnimage class="icon_alerte_ppms btnImageIcon badged-btn icon-title" title="',
				ObjetTraduction_1.GTraductions.getValeur("Mobile.Menu.Alertes"),
				'" ie-model="btnAlertesPPMSEnCours" ie-html="getHtml" ie-if="afficher"></ie-btnimage>',
			);
		}
		if (
			[
				Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
			].includes(this.etatutilisateurScoMobile.GenreEspace)
		) {
			const lMembre = this.etatutilisateurScoMobile.getMembre();
			if (
				lMembre &&
				lMembre.getGenre() === Enumere_Ressource_1.EGenreRessource.Eleve
			) {
				H.push(
					'<ie-btnimage class="icon_fiche_eleve btnImageIcon badged-btn icon-title" title="',
					ObjetTraduction_1.GTraductions.getValeur("Mobile.Menu.FicheEleve"),
					'" ie-model="btnFicheEleve"></ie-btnimage>',
				);
				lSetSep();
			}
		}
		H.push(this.composeBoutonCentraleNotif());
		H.push(this.composeBoutonAideContextuelle());
		if (
			this.applicationScoMobile.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.estDestinataireChat,
			)
		) {
			if (this.wrapperNotifs) {
				lAvecSep = false;
			}
			if (!lAvecSep) {
				H.push('<hr ie-if="afficherSeparateur" />');
				lAvecSep = true;
			}
			H.push(
				'<ie-btnimage class="icon_conversation_cours btnImageIcon badged-btn icon-title" title="',
				ObjetTraduction_1.GTraductions.getValeur("Mobile.Menu.Chatter"),
				'" ie-model="btnMessageInstant" ie-if="afficher" ie-html="getHtmlBtnMessageInstant"></ie-btnimage>',
			);
			H.push(
				'<ie-btnimage class="icon_alerte_ppms btnImageIcon badged-btn icon-title" ie-model="btnAlertesPPMSCreation" title="',
				ObjetTraduction_1.GTraductions.getValeur("Mobile.Menu.Alerter"),
				'" ie-if="afficher" aria-label="',
				ObjetTraduction_1.GTraductions.getValeur(
					"Messagerie.AlerteEnseignantsPersonnels",
				),
				'"></ie-btnimage>',
			);
		}
		if (
			this.etatutilisateurScoMobile.pourPrimaire() &&
			this.applicationScoMobile.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecDeclarerUneAbsence,
			)
		) {
			lSetSep();
			H.push(
				'<ie-btnimage class="icon_absences_prevue btnImageIcon badged-btn icon-title" title="',
				ObjetTraduction_1.GTraductions.getValeur("Mobile.Menu.Absence"),
				'" ie-model="ajouterAbsence"></ie-btnimage>',
			);
		}
		if (
			this.etatutilisateurScoMobile.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Mobile_PrimParent &&
			this.applicationScoMobile.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.avecDiscussion,
			) &&
			this.etatutilisateurScoMobile.Identification.ListeRessources &&
			this.etatutilisateurScoMobile.Identification.ListeRessources.count() > 0
		) {
			lSetSep();
			H.push(
				'<ie-btnimage class="icon_carnet_liaison i-large btnImageIcon badged-btn" title="',
				ObjetTraduction_1.GTraductions.getValeur("Mobile.Menu.Carnet"),
				'" ie-model="btnMessageCarnet"></ie-btnimage><span aria-hidden="true" class="titre-btn">',
				ObjetTraduction_1.GTraductions.getValeur("Mobile.Menu.Carnet"),
				"</span>",
			);
		}
		const lLibelleRaccourci =
			UtilitaireMessagerie_1.UtilitaireMessagerie.getLibelleRaccourciMessPrimEleve();
		if (lLibelleRaccourci) {
			lSetSep();
			H.push(
				'<ie-btnimage class="icon_discussion_cours i-large btnImageIcon badged-btn" title="',
				lLibelleRaccourci.toAttrValue(),
				'" ie-model="btnMessagePrimEleve" aria-haspopup="dialog"></ie-btnimage><span aria-hidden="true" class="titre-btn">',
				lLibelleRaccourci,
				"</span>",
			);
		}
		if (
			this.etatutilisateurScoMobile.Identification.ressource
				.destinatairePersonnelsMairie &&
			this.etatutilisateurScoMobile.Identification.ressource.destinatairePersonnelsMairie.count()
		) {
			lSetSep();
			H.push(
				'<ie-btnimage class="icon_mairie btnImageIcon badged-btn icon-title" title="',
				ObjetTraduction_1.GTraductions.getValeur("Mobile.Menu.Mairie"),
				'" ie-model="btnMessageMairie"></ie-btnimage>',
			);
		}
		lAvecSep = false;
		if (this.etatutilisateurScoMobile.avecFicheEtablissement()) {
			lSetSep();
			H.push(
				'<ie-btnimage class="icon_uniF2C3 btnImageIcon badged-btn icon-title" ie-node="nodeFicheEtablissement" title="',
				ObjetTraduction_1.GTraductions.getValeur("Mobile.Menu.Contact"),
				'" aria-label="',
				ObjetTraduction_1.GTraductions.getValeur(
					"FicheEtablissement.ContacterEtablissement",
				),
				'"></ie-btnimage>',
			);
		}
		if (this.avecBoutonHarcelement) {
			lAvecSep = false;
			lSetSep();
			H.push(
				`<ie-btnimage class="icon_stop_harcelement btnImageIcon badged-btn icon-title" ie-model="btnStopHarcelement" title="${ObjetTraduction_1.GTraductions.getValeur("Mobile.Menu.Harcelement")}" aria-label="${ObjetTraduction_1.GTraductions.getValeur("Mobile.Menu.Harcelement")}" ></ie-btnimage>`,
			);
		}
		return H.join("");
	}
	getActionneurCentraleNotification() {
		return new ActionneurCentraleNotificationsSco_1.ActionneurCentraleNotificationsSco(
			{ estMobile: true },
		);
	}
	_actualiserBadge(aDonnees) {
		[
			Enumere_Onglet_1.EGenreOnglet.Messagerie,
			Enumere_Onglet_1.EGenreOnglet.Informations,
		].forEach((aGenreOnglet) => {
			let lSelecteur = "";
			switch (aGenreOnglet) {
				case Enumere_Onglet_1.EGenreOnglet.Messagerie:
					lSelecteur = "#" + this.idNotifComm.escapeJQ();
					break;
				case Enumere_Onglet_1.EGenreOnglet.Informations:
					lSelecteur = "#" + this.idNotifInfo.escapeJQ();
					break;
				default:
					return;
			}
			const lNombre = aDonnees.compteurNotifsParOnglet
				? aDonnees.compteurNotifsParOnglet[aGenreOnglet].nb || 0
				: 0;
			$(lSelecteur).find(".as-tag").remove();
			if (lNombre > 0) {
				$(lSelecteur).append(
					'<span class="as-tag">' +
						(lNombre > 999 ? "999+" : lNombre) +
						"</span>",
				);
			}
		});
	}
}
module.exports = ObjetAffichagePageMenuOnglets;
