exports.UtilitairePageDonneesPersonnelles = UtilitairePageDonneesPersonnelles;
const ObjetStyle_1 = require("ObjetStyle");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_DonneesPersonnelles_1 = require("Enumere_DonneesPersonnelles");
const Enumere_DonneesPersonnelles_2 = require("Enumere_DonneesPersonnelles");
const Enumere_DonneesPersonnelles_3 = require("Enumere_DonneesPersonnelles");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetDate_1 = require("ObjetDate");
const Enumere_DonneesPersonnelles_4 = require("Enumere_DonneesPersonnelles");
const Enumere_DonneesPersonnelles_5 = require("Enumere_DonneesPersonnelles");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetTri_1 = require("ObjetTri");
const UtilitaireProjetAccompagnement_1 = require("UtilitaireProjetAccompagnement");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_Saisie_1 = require("Enumere_Saisie");
const ObjetRequeteSecurisationCompte_1 = require("ObjetRequeteSecurisationCompte");
const TypeSecurisationCompte_1 = require("TypeSecurisationCompte");
const ObjetFenetre_ModificationIdentifiantMDP_1 = require("ObjetFenetre_ModificationIdentifiantMDP");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const Enumere_DonneesPersonnelles_6 = require("Enumere_DonneesPersonnelles");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const tag_1 = require("tag");
const UtilitaireChangementLangue_1 = require("UtilitaireChangementLangue");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetListe_1 = require("ObjetListe");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetPreferenceAccessibilite_1 = require("ObjetPreferenceAccessibilite");
const TypeChaineHtml_1 = require("TypeChaineHtml");
const ObjetFenetre_ActionContextuelle_1 = require("ObjetFenetre_ActionContextuelle");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const ObjetFenetreSignatureNumeriqueConteneur = require("ObjetFenetre_SignatureNumerique");
const ObjetPreferenceCahierDeTexte_1 = require("ObjetPreferenceCahierDeTexte");
const TypeThemeCouleur_1 = require("TypeThemeCouleur");
const UtilitaireSyntheseVocale_1 = require("UtilitaireSyntheseVocale");
const GUID_1 = require("GUID");
const jsx_1 = require("jsx");
const TypeGenreEntiteAutorisationDiscussion_1 = require("TypeGenreEntiteAutorisationDiscussion");
const TypeGenreEntiteAutorisationDiscussion_2 = require("TypeGenreEntiteAutorisationDiscussion");
function UtilitairePageDonneesPersonnelles() {}
UtilitairePageDonneesPersonnelles.construireZoneGenerique = function (
	aTitre,
	aTypeContenu,
	aParams,
) {
	const lApp = GApplication;
	const lEtatUtilisateur = lApp.getEtatUtilisateur();
	const H = [];
	switch (aTypeContenu) {
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Notifications:
			H.push(
				_construireNotifications(
					aParams.envoiMail,
					aParams.notificationMail,
					aParams.notificationMailTravaux,
					aParams.gestionMailTravaux,
				),
			);
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.DroitImage:
			H.push(_construireDroitImage());
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Autorisations:
			H.push(_construireAutorisations(aParams));
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.DerniereConnexion:
			H.push(_construireDerniereConnexion());
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.MotDePasse:
			H.push(_construireMotDePasse(aParams));
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Identifiant:
			H.push(_construireIdentifiant(aParams));
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Coordonnees:
			H.push(_construireCoordonnees(aParams));
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.InfosCompteEnfant:
			H.push(_construireInformationsCompteEnfant(aParams));
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.INE:
			H.push(aParams.numeroINE);
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.AutorisationSortie:
			H.push(
				'<div tabindex="0" id="' + aParams.identiteAutorisations + '"></div>',
			);
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu
			.ProjetsAccompagnement: {
			const lAvecControlePublication = ![
				Enumere_Espace_1.EGenreEspace.Parent,
				Enumere_Espace_1.EGenreEspace.Mobile_Parent,
			].includes(lEtatUtilisateur.GenreEspace);
			H.push(
				_construireProjetsAccompagnement(aParams, lAvecControlePublication),
			);
			break;
		}
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Medecin:
			H.push(this.composeMedecin());
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Allergies:
			if (!lEtatUtilisateur.estEspaceMobile()) {
				H.push(
					'<div tabindex="0" id="' +
						aParams.identiteInfosAllergies +
						'"></div>',
				);
			}
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Informations:
			H.push(_construireInformations(aParams));
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.PreferencesContact:
			H.push(_construirePreferencesContact(aParams));
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu
			.AutorisationsSupplementaires:
			H.push(_construireAutorisationsSupp(aParams));
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.AutorisationsMessages:
			H.push(_construireAutorisationsMessages(aParams));
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.CommunicationParents:
			H.push(_construireCommunicationsParents(aParams));
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu
			.ContenuCommunicationParents:
			H.push(_construireContenuCommunicationsParents(aParams));
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.sourcesConnexions:
			H.push('<div tabindex="0" id="', aParams.idSourcesConnexions, '"></div>');
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Signature:
			H.push(_construireSignature(aParams));
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Generalites:
			if (
				[
					Enumere_Espace_1.EGenreEspace.Professeur,
					Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
				].includes(lEtatUtilisateur.GenreEspace)
			) {
				H.push(_construireGeneralitesProfesseur());
			}
			if (
				[
					Enumere_Espace_1.EGenreEspace.Professeur,
					Enumere_Espace_1.EGenreEspace.Etablissement,
				].includes(lEtatUtilisateur.GenreEspace)
			) {
				H.push(
					`<h2>${ObjetTraduction_1.GTraductions.getValeur("infosperso.CouleursDesCours")}</h2>`,
				);
				H.push(_construireEDT());
			}
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.CahierDeTexte:
			if (
				[
					Enumere_Espace_1.EGenreEspace.Professeur,
					Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
				].includes(lEtatUtilisateur.GenreEspace) &&
				lApp.droits.get(ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionCDT)
			) {
				H.push(_construireCDT());
			}
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.messagerieSignature:
			H.push(
				(0, tag_1.tag)("div", {
					"ie-identite": "getIdentiteMessagerieSignature",
				}),
			);
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Deconnexion:
			H.push((0, tag_1.tag)("div", { "ie-identite": "getIdentiteMessagerie" }));
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Accessibilite:
			H.push(_construireAccessibilite());
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Personnalisation:
			H.push(_construirePagePersonnalisation(aParams.controleur));
			break;
		case Enumere_DonneesPersonnelles_1.EGenreTypeContenu.iCal:
			H.push(_construirePageICal());
			break;
	}
	const lContenu = H.join("");
	if (lContenu) {
		return IE.jsx.str(
			"div",
			{
				class: "item-conteneur",
				role: aTitre ? "group" : false,
				"aria-label": aTitre,
			},
			aTitre ? IE.jsx.str("h2", null, aTitre) : "",
			IE.jsx.str("div", { class: "valeur-contain" }, lContenu),
		);
	}
	return "";
};
UtilitairePageDonneesPersonnelles.getControleur = function (aInstance) {
	const lApp = GApplication;
	const lEtatUtilisateur = lApp.getEtatUtilisateur();
	const avecSaisieCoordonnees = lApp.droits.get(
		ObjetDroitsPN_1.TypeDroits.compte.avecSaisieInfosPersoCoordonnees,
	);
	const lControleur = {
		tel: {
			getValue(aChamp) {
				return aInstance.donnees.Informations[aChamp];
			},
			setValue(aChamp, aValue) {
				aInstance.donnees.Informations[aChamp] = aValue;
				if (aChamp === "telephonePortable") {
					aInstance.donnees.Autorisations.SMSAutorise =
						aValue !== "" && aInstance.donnees.Autorisations.SMSAutorise;
				}
			},
			getDisabled() {
				return !lApp.droits.get(
					ObjetDroitsPN_1.TypeDroits.compte.avecSaisieInfosPersoCoordonnees,
				);
			},
		},
		CBDiscussionAvecParents: {
			getValue: function () {
				return aInstance.donnees.Autorisations
					.optionCommunicationActivationdiscussion;
			},
			setValue: function (aValue) {
				aInstance.donnees.Autorisations.optionCommunicationActivationdiscussion =
					aValue;
				lEtatUtilisateur.Identification.ressource.avecDiscussionResponsables =
					aValue;
				aInstance.setEtatSaisie(true);
			},
			getDisabled: function () {
				return false;
			},
		},
		CBCommuniquerMail: {
			getValue: function () {
				return aInstance.donnees.Autorisations
					.optionCommunicationPublicationMail;
			},
			setValue: function (aValue) {
				aInstance.donnees.Autorisations.optionCommunicationPublicationMail =
					aValue;
				aInstance.setEtatSaisie(true);
			},
			getDisabled: function () {
				return false;
			},
		},
		indFixeMedecin: {
			getValue: function () {
				return aInstance.donnees.infosMedicales.medecin["indFixe"];
			},
			setValue: function (aValue) {
				aInstance.donnees.infosMedicales.medecin["indFixe"] = aValue;
				aInstance.setEtatSaisie(true);
			},
		},
		telFixeMedecin: {
			getValue: function () {
				return aInstance.donnees.infosMedicales.medecin["telFixe"];
			},
			setValue: function (aValue) {
				aInstance.donnees.infosMedicales.medecin["telFixe"] = aValue;
				aInstance.setEtatSaisie(true);
			},
		},
		indPortMedecin: {
			getValue: function () {
				return aInstance.donnees.infosMedicales.medecin["indMobile"];
			},
			setValue: function (aValue) {
				aInstance.donnees.infosMedicales.medecin["indMobile"] = aValue;
				aInstance.setEtatSaisie(true);
			},
		},
		telPortMedecin: {
			getValue: function () {
				return aInstance.donnees.infosMedicales.medecin["telMobile"];
			},
			setValue: function (aValue) {
				aInstance.donnees.infosMedicales.medecin["telMobile"] = aValue;
				aInstance.setEtatSaisie(true);
			},
		},
		nomMedecin: {
			getValue: function () {
				return aInstance.donnees.infosMedicales.medecin["nomMedecin"];
			},
			setValue: function (aValue) {
				aInstance.donnees.infosMedicales.medecin["nomMedecin"] = aValue;
				aInstance.setEtatSaisie(true);
			},
		},
		adresseMedecin: {
			getValue(aIndex) {
				return aInstance.donnees.infosMedicales.medecin[`adresse${aIndex}`];
			},
			setValue(aIndex, aValue) {
				aInstance.donnees.infosMedicales.medecin[`adresse${aIndex}`] = aValue;
				aInstance.setEtatSaisie(true);
			},
		},
		CPMedecin: {
			getValue: function () {
				return aInstance.donnees.infosMedicales.medecin["codePostal"];
			},
			setValue: function (aValue) {
				aInstance.donnees.infosMedicales.medecin["codePostal"] = aValue;
				aInstance.setEtatSaisie(true);
			},
		},
		VilleMedecin: {
			getValue: function () {
				return aInstance.donnees.infosMedicales.medecin["libellePostal"];
			},
			setValue: function (aValue) {
				aInstance.donnees.infosMedicales.medecin["libellePostal"] = aValue;
				aInstance.setEtatSaisie(true);
			},
		},
		libellePreferencesContact: {
			getLibelle: function () {
				const libelle = [];
				let lTexteEmail = "";
				if (aInstance.donnees.Autorisations.SMSAutorise) {
					libelle.push(
						ObjetTraduction_1.GTraductions.getValeur("infosperso.SMS"),
					);
				}
				if (aInstance.donnees.Autorisations.emailAutorise) {
					lTexteEmail =
						ObjetTraduction_1.GTraductions.getValeur("infosperso.Email");
				}
				if (
					aInstance.donnees.Autorisations.eMailEtablissementAutorise !== null &&
					aInstance.donnees.Autorisations.eMailParentAutorise !== null &&
					lEtatUtilisateur.GenreEspace !==
						Enumere_Espace_1.EGenreEspace.Parent &&
					lEtatUtilisateur.GenreEspace !==
						Enumere_Espace_1.EGenreEspace.Mobile_Parent
				) {
					const libelleDetails = [];
					if (aInstance.donnees.Autorisations.eMailEtablissementAutorise) {
						libelleDetails.push(
							ObjetTraduction_1.GTraductions.getValeur(
								"infosperso.EmailEtablissement",
							).toLowerCase(),
						);
					}
					if (aInstance.donnees.Autorisations.eMailParentAutorise) {
						libelleDetails.push(
							ObjetTraduction_1.GTraductions.getValeur(
								"infosperso.EMailParents",
							).toLowerCase(),
						);
					}
					if (
						aInstance.donnees.Autorisations.eMailEtablissementAutorise ||
						aInstance.donnees.Autorisations.eMailParentAutorise
					) {
						lTexteEmail += " (" + libelleDetails.join(", ") + ")";
					}
				}
				if (aInstance.donnees.Autorisations.emailAutorise) {
					libelle.push(lTexteEmail);
				}
				if (aInstance.donnees.Autorisations.courrierPapierAutorise) {
					libelle.push(
						ObjetTraduction_1.GTraductions.getValeur("infosperso.Papier"),
					);
				}
				return libelle.join(", ");
			},
		},
		libelleCommunicationParents: {
			getLibelle: function () {
				const libelle = [];
				if (
					aInstance.donnees.Autorisations
						.optionCommunicationActivationdiscussion
				) {
					libelle.push(
						ObjetTraduction_1.GTraductions.getValeur(
							"infosperso.communiquerEmail",
						),
					);
				}
				if (
					aInstance.donnees.Autorisations.optionCommunicationPublicationMail
				) {
					libelle.push(
						ObjetTraduction_1.GTraductions.getValeur(
							"infosperso.discussionsAvecParents",
						),
					);
				}
				return libelle.join(", ");
			},
		},
		libelleInformations: {
			getLibelle: function () {
				const libelle = [];
				if (aInstance.donnees.Autorisations.estDestinataireInfosGenerales) {
					libelle.push(
						ObjetTraduction_1.GTraductions.getValeur(
							"infosperso.titreInfosGen",
						),
					);
				}
				for (
					let i = 0;
					i < aInstance.donnees.Autorisations.listeEleves.count();
					i++
				) {
					const lEleve = aInstance.donnees.Autorisations.listeEleves.get(i);
					const libellesEleve = [];
					libelle.push("<div> ");
					libelle.push(lEleve.getLibelle() + " : ");
					if (lEleve.estDestinataireBulletin) {
						libellesEleve.push(
							ObjetTraduction_1.GTraductions.getValeur(
								"infosperso.titreBulletin",
							),
						);
					}
					if (lEleve.estDestinataireInfosEleve) {
						libellesEleve.push(
							ObjetTraduction_1.GTraductions.getValeur(
								"infosperso.titreInfosEleve",
							),
						);
					}
					if (lEleve.estDestinataireInfosProfesseur) {
						libellesEleve.push(
							ObjetTraduction_1.GTraductions.getValeur(
								"infosperso.titreInfosProf",
							),
						);
					}
					libelle.push(libellesEleve.join(", "));
					libelle.push("</div>");
				}
				return libelle.join("");
			},
		},
		eMail: {
			getValue: function () {
				return aInstance.donnees.Informations.eMail;
			},
			setValue: function (aChamp, aValue) {
				aInstance.donnees.Informations.eMail = aValue.value;
				aInstance.donnees.Autorisations.emailAutorise = aValue.value !== "";
				aInstance.setEtatSaisie(true);
			},
		},
		cbEmailReserveAdministration: {
			getValue: function () {
				return aInstance.donnees.Informations.emailReserveAdmin;
			},
			setValue: function (aValue) {
				aInstance.donnees.Informations.emailReserveAdmin = aValue;
				if (!!aValue) {
					aInstance.donnees.Autorisations.eMailParentAutorise = false;
				}
				aInstance.setEtatSaisie(true);
			},
		},
		cbTelReserveAdministration: {
			getValue: function () {
				return aInstance.donnees.Informations.telReserveAdmin;
			},
			setValue: function (aValue) {
				aInstance.donnees.Informations.telReserveAdmin = aValue;
				aInstance.setEtatSaisie(true);
			},
		},
		switchNotification: {
			getValue: function () {
				return aInstance.donnees.notifications.notificationMail;
			},
			setValue: function (aValue) {
				aInstance.donnees.notifications.notificationMail = aValue;
				aInstance.setEtatSaisie(true);
			},
		},
		switchNotificationTravaux: {
			getValue: function () {
				return aInstance.donnees.notifications.notificationMailTravaux;
			},
			setValue: function (aValue) {
				aInstance.donnees.notifications.notificationMailTravaux = aValue;
				aInstance.setEtatSaisie(true);
			},
		},
		switchAutoriserImage: {
			getValue: function () {
				return !aInstance.donnees.droitImage.autoriser;
			},
			setValue: function (aValue) {
				aInstance.donnees.droitImage.autoriser = !aValue;
				aInstance.setEtatSaisie(true);
			},
		},
		switchAutoriserSignature: {
			getValue: function () {
				return !aInstance.donnees.Signature.autoriser;
			},
			setValue: function (aValue) {
				aInstance.donnees.Signature.autoriser = !aValue;
				aInstance.valider();
			},
			getDisabled: function () {
				return !aInstance.donnees.Signature.logo;
			},
		},
		switchDemandeRdvAutorise: {
			getValue: function () {
				return aInstance.donnees.Autorisations.acceptDemandeRdv;
			},
			setValue: function (aValue) {
				aInstance.donnees.Autorisations.acceptDemandeRdv = aValue;
				aInstance.setEtatSaisie(true);
			},
			getDisabled() {
				return !lApp.droits.get(
					ObjetDroitsPN_1.TypeDroits.compte.avecSaisieInfosPersoAutorisations,
				);
			},
		},
		switchSMSAutorise: {
			getValue: function () {
				return aInstance.donnees.Autorisations.SMSAutorise;
			},
			setValue: function (aValue) {
				aInstance.donnees.Autorisations.SMSAutorise = aValue;
				aInstance.setEtatSaisie(true);
				UtilitairePageDonneesPersonnelles.swapClass(
					Enumere_DonneesPersonnelles_4.EGenreDestinataire.SMS,
					aValue,
				);
			},
			getDisabled: function () {
				return !(
					aInstance.donnees.Informations["telephonePortable"] &&
					avecSaisieCoordonnees
				);
			},
		},
		switchEmailAutorise: {
			getValue: function () {
				return aInstance.donnees.Autorisations.emailAutorise;
			},
			setValue: function (aValue) {
				aInstance.donnees.Autorisations.emailAutorise = aValue;
				if (!aValue) {
					aInstance.donnees.Autorisations.eMailEtablissementAutorise = false;
					aInstance.donnees.Autorisations.eMailParentAutorise = false;
				}
				aInstance.setEtatSaisie(true);
				UtilitairePageDonneesPersonnelles.swapClass(
					Enumere_DonneesPersonnelles_4.EGenreDestinataire.Email,
					aValue,
				);
			},
			getDisabled: function () {
				return !avecSaisieCoordonnees || !aInstance.donnees.Informations.eMail;
			},
		},
		switchEmailEtablissementAutorise: {
			getValue: function () {
				return aInstance.donnees.Autorisations.eMailEtablissementAutorise;
			},
			setValue: function (aValue) {
				aInstance.donnees.Autorisations.eMailEtablissementAutorise = aValue;
				aInstance.setEtatSaisie(true);
			},
			getDisabled: function () {
				return !(
					aInstance.donnees.Autorisations.emailAutorise && avecSaisieCoordonnees
				);
			},
		},
		switchEmailParentAutorise: {
			getValue: function () {
				return aInstance.donnees.Autorisations.eMailParentAutorise;
			},
			setValue: function (aValue) {
				aInstance.donnees.Autorisations.eMailParentAutorise = aValue;
				aInstance.setEtatSaisie(true);
			},
			getDisabled: function () {
				return !(
					aInstance.donnees.Autorisations.emailAutorise &&
					avecSaisieCoordonnees &&
					!aInstance.donnees.Informations.emailReserveAdmin
				);
			},
		},
		switchCourrierPapierAutorise: {
			getValue: function () {
				return aInstance.donnees.Autorisations.courrierPapierAutorise;
			},
			setValue: function (aValue) {
				aInstance.donnees.Autorisations.courrierPapierAutorise = aValue;
				aInstance.setEtatSaisie(true);
				UtilitairePageDonneesPersonnelles.swapClass(
					Enumere_DonneesPersonnelles_4.EGenreDestinataire.Courrier,
					aValue,
				);
			},
			getDisabled: function () {
				return !avecSaisieCoordonnees;
			},
		},
		switchMsg: {
			getValue(aIdent) {
				return aInstance.donnees.Autorisations[aIdent];
			},
			setValue(aIdent, aValue) {
				aInstance.donnees.Autorisations[aIdent] = aValue;
				aInstance.setEtatSaisie(true);
			},
			getDisabled(aIdent) {
				let lDisabled = !avecSaisieCoordonnees;
				if (lApp.estPrimaire && aIdent !== "msgEleve") {
					lDisabled = true;
				}
				return lDisabled;
			},
		},
		btnMsgPublicMsgParents: {
			event() {
				_btnPublicMsg(
					aInstance,
					aInstance.donnees.Autorisations.msgListePublicsParents,
				);
			},
			getDisabled() {
				return !avecSaisieCoordonnees;
			},
		},
		getHtmlBtnMsgPublicMsgParents() {
			let lNbCoches = 0;
			aInstance.donnees.Autorisations.msgListePublicsParents.parcourir(
				(aArticle) => {
					if (aArticle.estCoche) {
						lNbCoches += 1;
					}
				},
			);
			if (
				lNbCoches === 0 ||
				aInstance.donnees.Autorisations.msgListePublicsParents.count() ===
					lNbCoches
			) {
				return ObjetTraduction_1.GTraductions.getValeur("infosperso.Tout");
			}
			return `${lNbCoches}/${aInstance.donnees.Autorisations.msgListePublicsParents.count()}`;
		},
		avecBtnMsgParent: function () {
			return (
				aInstance.donnees.Autorisations.genreEntiteAutorisationResponsable ===
				TypeGenreEntiteAutorisationDiscussion_1
					.TypeGenreEntiteAutorisationDiscussion.AD_Personnalise
			);
		},
		avecChoixParent: function () {
			return !!aInstance.donnees.Autorisations.msgParent;
		},
		btnMsgPublicMsgEleves: {
			event() {
				_btnPublicMsg(
					aInstance,
					aInstance.donnees.Autorisations.msgListePublicsEleves,
				);
			},
			getDisabled() {
				return !avecSaisieCoordonnees;
			},
		},
		getHtmlBtnMsgPublicMsgEleves() {
			let lNbCoches = 0;
			aInstance.donnees.Autorisations.msgListePublicsEleves.parcourir(
				(aArticle) => {
					if (aArticle.estCoche) {
						lNbCoches += 1;
					}
				},
			);
			if (
				lNbCoches === 0 ||
				aInstance.donnees.Autorisations.msgListePublicsEleves.count() ===
					lNbCoches
			) {
				return ObjetTraduction_1.GTraductions.getValeur("infosperso.Tout");
			}
			return `${lNbCoches}/${aInstance.donnees.Autorisations.msgListePublicsEleves.count()}`;
		},
		avecBtnMsgEleve: function () {
			return (
				aInstance.donnees.Autorisations.genreEntiteAutorisationEleve ===
				TypeGenreEntiteAutorisationDiscussion_1
					.TypeGenreEntiteAutorisationDiscussion.AD_Personnalise
			);
		},
		avecChoixEleve: function () {
			return !!aInstance.donnees.Autorisations.msgEleve;
		},
		switchMsgVieScolaire: {
			getValue() {
				return aInstance.donnees.Autorisations.estContactVS;
			},
			setValue(aValue) {
				aInstance.donnees.Autorisations.estContactVS = aValue;
				aInstance.setEtatSaisie(true);
			},
			getDisabled() {
				return !avecSaisieCoordonnees;
			},
		},
		switchBulletin: {
			getValue: function (aIndexEleve) {
				return aInstance.donnees.Autorisations.listeEleves.get(aIndexEleve)
					.estDestinataireBulletin;
			},
			setValue: function (aIndexEleve, aValue) {
				aInstance.donnees.Autorisations.listeEleves.get(
					aIndexEleve,
				).estDestinataireBulletin = aValue;
				aInstance.setEtatSaisie(true);
			},
			getDisabled: function () {
				return (
					!aInstance.donnees.Autorisations.emailAutorise &&
					!aInstance.donnees.Autorisations.courrierPapierAutorise
				);
			},
		},
		switchInfosEleve: {
			getValue: function (aIndexEleve) {
				return aInstance.donnees.Autorisations.listeEleves.get(aIndexEleve)
					.estDestinataireInfosEleve;
			},
			setValue: function (aIndexEleve, aValue) {
				aInstance.donnees.Autorisations.listeEleves.get(
					aIndexEleve,
				).estDestinataireInfosEleve = aValue;
				aInstance.setEtatSaisie(true);
			},
			getDisabled: function () {
				return (
					!aInstance.donnees.Autorisations.emailAutorise &&
					!aInstance.donnees.Autorisations.SMSAutorise &&
					!aInstance.donnees.Autorisations.courrierPapierAutorise
				);
			},
		},
		switchInfosProfs: {
			getValue: function (aIndexEleve) {
				return aInstance.donnees.Autorisations.listeEleves.get(aIndexEleve)
					.estDestinataireInfosProfesseur;
			},
			setValue: function (aIndexEleve, aValue) {
				aInstance.donnees.Autorisations.listeEleves.get(
					aIndexEleve,
				).estDestinataireInfosProfesseur = aValue;
				aInstance.setEtatSaisie(true);
			},
			getDisabled: function () {
				return !aInstance.donnees.Autorisations.emailAutorise;
			},
		},
		switchInfosGen: {
			getValue: function () {
				return aInstance.donnees.Autorisations.estDestinataireInfosGenerales;
			},
			setValue: function (aValue) {
				aInstance.donnees.Autorisations.estDestinataireInfosGenerales = aValue;
				aInstance.setEtatSaisie(true);
			},
			getDisabled: function () {
				return (
					!aInstance.donnees.Autorisations.emailAutorise &&
					!aInstance.donnees.Autorisations.SMSAutorise &&
					!aInstance.donnees.Autorisations.courrierPapierAutorise
				);
			},
		},
		delaiNotif: {
			init: function (aId, aCombo) {
				aCombo.setOptionsObjetSaisie({
					mode: Enumere_Saisie_1.EGenreSaisie.Combo,
					longueur: 40,
					iconeGauche: "icon_time",
					labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
						"PreferencesNotifications.delaiTemporisation",
					),
					describedById: aId,
					deroulerListeSeulementSiPlusieursElements: false,
					initAutoSelectionAvecUnElement: false,
				});
				aInstance.combo = aCombo;
			},
			getDonnees: function () {
				return aInstance.listeDelais;
			},
			getIndiceSelection: function () {
				let indice = 0;
				for (let i = 0; i < aInstance.listeDelais.count(); i++) {
					if (
						aInstance.listeDelais.get(i).Numero ===
						aInstance.donnees.notifications.delaiNotification
					) {
						indice = i;
					}
				}
				return indice;
			},
			event: function (aId, aParametres) {
				if (
					aParametres.genreEvenement ===
					Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
				) {
					const lDelai = aParametres.element.getNumero();
					if (aInstance.donnees.notifications.delaiNotification !== lDelai) {
						aInstance.donnees.notifications.delaiNotification = lDelai;
						aInstance.setEtatSaisie(true);
					}
				}
			},
		},
		estConsultable: {
			getValue: function () {
				return aInstance.donnees.infosMedicales.estConsultable;
			},
			setValue: function (aValue) {
				aInstance.donnees.infosMedicales.estConsultable = aValue;
				aInstance.valider();
			},
		},
		autoriseConsultationAllergies: {
			getValue: function () {
				return aInstance.donnees.allergies.autoriseConsultationAllergies;
			},
			setValue: function (aValue) {
				aInstance.donnees.allergies.autoriseConsultationAllergies = aValue;
				aInstance.valider();
			},
		},
		autoriseHospitalisation: {
			getValue: function () {
				return aInstance.donnees.infosMedicales.autoriseHospitalisation;
			},
			setValue: function (aValue) {
				aInstance.donnees.infosMedicales.autoriseHospitalisation = aValue;
				aInstance.valider();
			},
		},
		delaiNotifTravaux: {
			init: function (aId, aCombo) {
				aCombo.setOptionsObjetSaisie({
					mode: Enumere_Saisie_1.EGenreSaisie.Combo,
					longueur: 40,
					iconeGauche: "icon_time",
					labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
						"PreferencesNotifications.delaiTemporisation",
					),
					describedById: aId,
					deroulerListeSeulementSiPlusieursElements: false,
					initAutoSelectionAvecUnElement: false,
				});
				aInstance.combo = aCombo;
			},
			getDonnees: function () {
				return aInstance.listeDelais;
			},
			getIndiceSelection: function () {
				let indice = 0;
				for (let i = 0; i < aInstance.listeDelais.count(); i++) {
					if (
						aInstance.listeDelais.get(i).Numero ===
						aInstance.donnees.notifications.delaiNotificationTravaux
					) {
						indice = i;
					}
				}
				return indice;
			},
			event: function (aId, aParametres) {
				if (
					aParametres.genreEvenement ===
					Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
				) {
					if (
						aInstance.donnees.notifications.delaiNotificationTravaux !==
						aInstance.listeDelais.get(aParametres.indice).Numero
					) {
						aInstance.setEtatSaisie(true);
					}
					aInstance.donnees.notifications.delaiNotificationTravaux =
						aInstance.listeDelais.get(aParametres.indice).Numero;
				}
			},
		},
		btnAjouterImageSignature: {
			event(aIdBouton) {
				_ouvrirFenetreChoixActionsAjoutSignature.call(aInstance, aIdBouton);
			},
		},
		btnSupprimerImageSignature: {
			async event() {
				const lResult = await lApp
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"infosperso.msgSupprimerSignature",
						),
					});
				if (lResult === 0) {
					aInstance.donnees.Signature.estSupprimee = true;
					aInstance.setEtatSaisie(true);
					aInstance.valider();
				}
			},
			getTitle() {
				return ObjetTraduction_1.GTraductions.getValeur(
					"infosperso.supprimerSignature",
				);
			},
		},
		getIdentiteCahierDeTexte: function () {
			return {
				class: ObjetPreferenceCahierDeTexte_1.ObjetPreferenceCahierDeTexte,
				pere: aInstance,
			};
		},
		getIdentiteAccessibilite: function () {
			return {
				class: ObjetPreferenceAccessibilite_1.ObjetPreferenceAccessibilite,
				pere: aInstance,
			};
		},
		nodePhoto: function () {
			$(this.node).on("error", function () {
				$(this)
					.closest("div")
					.append(
						'<i class="icone-alternative icon_uniF2BD" aria-hidden="true"></i>',
					);
				$(this).remove();
			});
		},
		comboDarkMode: {
			init(aCombo) {
				const lListe = new ObjetListeElements_1.ObjetListeElements();
				lListe.add([
					ObjetElement_1.ObjetElement.create({
						Libelle:
							ObjetTraduction_1.GTraductions.getValeur("modeSombre.claire"),
						Genre: TypeThemeCouleur_1.ChoixDarkMode.clair,
					}),
					ObjetElement_1.ObjetElement.create({
						Libelle:
							ObjetTraduction_1.GTraductions.getValeur("modeSombre.sombre"),
						Genre: TypeThemeCouleur_1.ChoixDarkMode.sombre,
					}),
					ObjetElement_1.ObjetElement.create({
						Libelle:
							ObjetTraduction_1.GTraductions.getValeur("modeSombre.systeme"),
						Genre: TypeThemeCouleur_1.ChoixDarkMode.systeme,
					}),
				]);
				const lChoixDarkMode = lApp.getOptionsEspaceLocal().getChoixDarkMode();
				let lIndice = 0;
				lListe.parcourir((aElement, aIndice) => {
					if (aElement.getGenre() === lChoixDarkMode) {
						lIndice = aIndice;
						return false;
					}
				});
				aCombo.setDonneesObjetSaisie({
					liste: lListe,
					selection: lIndice,
					options: {
						labelWAICellule:
							ObjetTraduction_1.GTraductions.getValeur("modeSombre.theme"),
						getContenuElement: (aParamsLigne) => {
							let lIcon = "";
							switch (aParamsLigne.element.getGenre()) {
								case TypeThemeCouleur_1.ChoixDarkMode.clair: {
									lIcon = "icon_sun";
									break;
								}
								case TypeThemeCouleur_1.ChoixDarkMode.sombre: {
									lIcon = "icon_lune";
									break;
								}
								case TypeThemeCouleur_1.ChoixDarkMode.systeme: {
									lIcon = "icon_mobile_phone";
									break;
								}
								default:
							}
							return IE.jsx.str(
								"span",
								{ class: ["iconic", lIcon] },
								aParamsLigne.element.getLibelle(),
							);
							return IE.jsx.str(
								"div",
								{ class: "icon-container" },
								IE.jsx.str("i", { class: lIcon, role: "presentation" }),
								IE.jsx.str("span", null, aParamsLigne.element.getLibelle()),
							);
						},
					},
				});
			},
			event(aParams) {
				if (aParams.estSelectionManuelle && aParams.element) {
					const lChoix = aParams.element.getGenre();
					lApp.getOptionsEspaceLocal().setChoixDarkMode(lChoix);
					if (GApplication.estAppliMobile) {
						window.messageData.push({ action: "darkMode", data: lChoix });
					}
				}
			},
		},
		radioAutorisationResponsable: {
			getValue: function (aGenre) {
				return (
					aInstance.donnees.Autorisations.genreEntiteAutorisationResponsable ===
					aGenre
				);
			},
			setValue: function (aGenre, aValue) {
				aInstance.donnees.Autorisations.genreEntiteAutorisationResponsable =
					aGenre;
				aInstance.valider();
			},
		},
		radioAutorisationEleve: {
			getValue: function (aGenre) {
				return (
					aInstance.donnees.Autorisations.genreEntiteAutorisationEleve ===
					aGenre
				);
			},
			setValue: function (aGenre, aValue) {
				aInstance.donnees.Autorisations.genreEntiteAutorisationEleve = aGenre;
				aInstance.valider();
			},
		},
	};
	return lControleur;
};
function _ouvrirFenetreChoixActionsAjoutSignature(aIdOrigine) {
	const lApp = GApplication;
	const lEtatUtilisateur = lApp.getEtatUtilisateur();
	const lFnAjouterImage = (aParams) => {
		if (!!aParams.eltFichier) {
			const lSignature = this.donnees.Signature;
			lSignature.estSupprimee = false;
			lSignature.fichier = aParams.eltFichier;
			this.setEtatSaisie(true);
			this.valider();
		}
	};
	const lOptionsCommunesSelecFile = {
		title: "",
		maxFiles: 1,
		maxSize: lApp.droits.get(
			ObjetDroitsPN_1.TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
		),
		avecResizeImage: true,
		largeurMaxImageResize: this.donnees.Signature.largeurMax,
		hauteurMaxImageResize: this.donnees.Signature.hauteurMax,
		genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
		accept: "image/*",
		acceptDragDrop: false,
		capture: "environment",
	};
	const lActions = [];
	lActions.push({
		libelle: ObjetTraduction_1.GTraductions.getValeur(
			"infosperso.SignerEnLigne",
		),
		icon: "icon_signature",
		event: () => {
			if (ObjetFenetreSignatureNumeriqueConteneur) {
				const { ObjetFenetre_SignatureNumerique } =
					ObjetFenetreSignatureNumeriqueConteneur;
				const lFenetreSignatureNumerique =
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_SignatureNumerique,
						{
							pere: this,
							evenement(aGenreBouton, aObjElementSignature) {
								if (aGenreBouton === 1) {
									lFnAjouterImage.call(this, {
										eltFichier: aObjElementSignature,
									});
								}
							},
						},
					);
				lFenetreSignatureNumerique.afficher();
			}
		},
		class: "bg-util-vert-claire",
	});
	if (lEtatUtilisateur.avecGestionAppareilPhoto()) {
		lActions.push({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"blog.billet.prendrePhoto",
			),
			icon: "icon_camera",
			event: (aParams) => {
				lFnAjouterImage.call(this, aParams);
			},
			optionsSelecFile: Object.assign(lOptionsCommunesSelecFile, {
				capture: "environment",
			}),
			selecFile: true,
			class: "bg-util-marron-claire",
		});
	}
	const lAvecCloud = false;
	const lOptionsCommunesSelecFilePourOuvrirMesDocuments =
		MethodesObjet_1.MethodesObjet.dupliquer(lOptionsCommunesSelecFile);
	delete lOptionsCommunesSelecFilePourOuvrirMesDocuments.capture;
	lActions.push({
		libelle: IE.estMobile
			? ObjetTraduction_1.GTraductions.getValeur(
					"blog.billet.ouvrirMesDocuments",
				)
			: ObjetTraduction_1.GTraductions.getValeur("blog.billet.depuisMonPoste"),
		icon: "icon_folder_open",
		event: (aParams) => {
			lFnAjouterImage.call(this, aParams);
		},
		optionsSelecFile: Object.assign(
			lOptionsCommunesSelecFilePourOuvrirMesDocuments,
			{ avecTransformationFlux_versCloud: lAvecCloud },
		),
		selecFile: true,
		class: "bg-util-marron-claire",
	});
	ObjetFenetre_ActionContextuelle_1.ObjetFenetre_ActionContextuelle.ouvrir(
		lActions,
		{
			pere: this,
			optionsFenetre: {
				idPositionnement: aIdOrigine,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"infosperso.btnImporterSignature",
				),
			},
		},
	);
}
function _construireProjetsAccompagnement(aParams, aAvecControlePublication) {
	const H = [];
	H.push('<div class="WhiteSpaceNormal InlineBlock">');
	if (!!aParams.listeProjets) {
		aParams.listeProjets.setTri([
			ObjetTri_1.ObjetTri.init(
				"estActif",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
			ObjetTri_1.ObjetTri.init(
				"dateDebut",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
			ObjetTri_1.ObjetTri.init(
				"Libelle",
				Enumere_TriElement_1.EGenreTriElement.Croissant,
			),
		]);
		aParams.listeProjets.trier();
		H.push(
			UtilitaireProjetAccompagnement_1.UtilitaireProjetAccompagnement.composeListeProjetsAccompagnement(
				aParams.listeProjets,
				{
					avecLibelleConsultationEquipePeda: true,
					avecControlePublication: !!aAvecControlePublication,
				},
			),
		);
	}
	H.push("</div>");
	return H.join("");
}
function _construirePreferencesContact(aParams) {
	const H = [];
	H.push('<div id="', aParams.id, '" class="WhiteSpaceNormal InlineBlock">');
	H.push(
		'<div ie-model="libellePreferencesContact" class="Texte9" ie-html="getLibelle"></div>',
	);
	H.push("</div>");
	return H.join("");
}
function _construireInformations(aParams) {
	const H = [];
	H.push('<div id="', aParams.id, '" class="WhiteSpaceNormal InlineBlock">');
	H.push('<div ie-model="libelleInformations" ie-html="getLibelle"></div>');
	H.push("</div>");
	return H.join("");
}
function _construireContenuCommunicationsParents(aParams) {
	const H = [];
	H.push('<div id="', aParams.id, '" class="WhiteSpaceNormal InlineBlock">');
	H.push(
		'<div ie-model="libelleCommunicationParents" class="Texte9" ie-html="getLibelle"></div>',
	);
	H.push("</div>");
	return H.join("");
}
UtilitairePageDonneesPersonnelles.composeMedecin = function () {
	const lLargeurIndicatif = 36,
		lLargeurTel = 110;
	return IE.jsx.str(
		IE.jsx.fragment,
		null,
		IE.jsx.str(
			"h3",
			{ tabindex: "0" },
			ObjetTraduction_1.GTraductions.getValeur(
				"InfosMedicales.MedecinTraitant",
			),
		),
		IE.jsx.str(
			"div",
			{ class: "item-contain" },
			IE.jsx.str(
				"div",
				{ class: "item-value" },
				IE.jsx.str(
					"label",
					{ for: "idNom", class: "ie-titre-petit flex-contain cols flex-gap" },
					ObjetTraduction_1.GTraductions.getValeur("InfosMedicales.NomMedecin"),
					IE.jsx.str("input", {
						type: "text",
						id: "idNom",
						name: "idNom",
						title: ObjetTraduction_1.GTraductions.getValeur(
							"InfosMedicales.TitreNom",
						),
						placeholder: ObjetTraduction_1.GTraductions.getValeur(
							"InfosMedicales.TitreNom",
						),
						"ie-model": "nomMedecin",
						size: "50",
						maxlength: "50",
						class: "round-style",
						tabindex: "0",
					}),
				),
			),
		),
		IE.jsx.str(
			"div",
			{ class: "item-contain" },
			IE.jsx.str(
				"div",
				{ class: "item-value" },
				IE.jsx.str(
					"label",
					{ class: "ie-titre-petit flex-contain cols flex-gap" },
					ObjetTraduction_1.GTraductions.getValeur("InfosMedicales.adresse1"),
					IE.jsx.str("input", {
						type: "text",
						id: "idAdresse1",
						title: ObjetTraduction_1.GTraductions.getValeur(
							"InfosMedicales.adresse1",
						),
						size: "50",
						maxlength: "50",
						class: "round-style",
						"ie-model": (0, jsx_1.jsxFuncAttr)("adresseMedecin", "1"),
						tabindex: "0",
					}),
					IE.jsx.str("input", {
						type: "text",
						id: "idAdresse2",
						title: ObjetTraduction_1.GTraductions.getValeur(
							"InfosMedicales.adresse1",
						),
						size: "50",
						maxlength: "50",
						class: "round-style",
						"ie-model": (0, jsx_1.jsxFuncAttr)("adresseMedecin", "2"),
						tabindex: "0",
					}),
					IE.jsx.str("input", {
						type: "text",
						id: "idAdresse3",
						title: ObjetTraduction_1.GTraductions.getValeur(
							"InfosMedicales.adresse1",
						),
						size: "50",
						maxlength: "50",
						class: "round-style",
						"ie-model": (0, jsx_1.jsxFuncAttr)("adresseMedecin", "3"),
						tabindex: "0",
					}),
					IE.jsx.str("input", {
						type: "text",
						title: ObjetTraduction_1.GTraductions.getValeur(
							"InfosMedicales.adresse1",
						),
						size: "50",
						maxlength: "50",
						class: "round-style",
						"ie-model": (0, jsx_1.jsxFuncAttr)("adresseMedecin", "4"),
						tabindex: "0",
					}),
				),
			),
		),
		IE.jsx.str(
			"div",
			{ class: "item-contain" },
			IE.jsx.str(
				"div",
				{ class: "item-value" },
				IE.jsx.str(
					"div",
					{ class: "ie-titre-petit flex-contain cols flex-gap" },
					IE.jsx.str(
						"span",
						{ "aria-hidden": "true" },
						ObjetTraduction_1.GTraductions.getValeur("InfosMedicales.cpVille"),
					),
					IE.jsx.str(
						"div",
						{ class: "flex-contain as-input" },
						IE.jsx.str(
							"label",
							{ for: "idCpMedecin", class: "sr-only" },
							ObjetTraduction_1.GTraductions.getValeur(
								"InfosMedicales.CodePostal",
							),
						),
						IE.jsx.str("input", {
							type: "text",
							id: "idCpMedecin",
							maxlength: "8",
							title: ObjetTraduction_1.GTraductions.getValeur(
								"InfosMedicales.CodePostal",
							),
							"ie-model": "CPMedecin",
							tabindex: "0",
							style: "width: 6.5rem; margin-right:.4rem",
						}),
						IE.jsx.str("span", { class: "avec-separateur" }),
						IE.jsx.str(
							"label",
							{ for: "idVilleMedecin", class: "sr-only" },
							ObjetTraduction_1.GTraductions.getValeur("InfosMedicales.Ville"),
						),
						IE.jsx.str("input", {
							id: "idVilleMedecin",
							type: "text",
							title: ObjetTraduction_1.GTraductions.getValeur(
								"InfosMedicales.Ville",
							),
							"ie-model": "VilleMedecin",
							tabindex: "0",
							style: ObjetStyle_1.GStyle.composeWidth(lLargeurTel),
						}),
					),
				),
			),
		),
		IE.jsx.str(
			"div",
			{
				class: "item-contain icon_home",
				title: ObjetTraduction_1.GTraductions.getValeur(
					"InfosMedicales.Telephone",
				),
			},
			IE.jsx.str(
				"div",
				{ class: "flex-contain" },
				IE.jsx.str(
					"label",
					{ for: "idIndFixeMedecin", class: "sr-only" },
					ObjetTraduction_1.GTraductions.getValeur(
						"InfosMedicales.IndicatifTelephone",
					),
				),
				IE.jsx.str("input", {
					id: "idIndFixeMedecin",
					"ie-model": "indFixeMedecin",
					class: "round-style m-right ",
					"ie-indicatiftel": true,
					style:
						ObjetStyle_1.GStyle.composeWidth(lLargeurIndicatif) +
						"; margin-right:.4rem",
					type: "text",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"InfosMedicales.IndicatifTelephone",
					),
					tabindex: "0",
				}),
				IE.jsx.str(
					"label",
					{ for: "idTelFixeMedecin", class: "sr-only" },
					ObjetTraduction_1.GTraductions.getValeur("InfosMedicales.Telephone"),
				),
				IE.jsx.str("input", {
					id: "idTelFixeMedecin",
					"ie-model": "telFixeMedecin",
					class: "round-style",
					"ie-telephone": true,
					style: ObjetStyle_1.GStyle.composeWidth(lLargeurTel),
					type: "text",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"InfosMedicales.TitreTelephone",
					),
					tabindex: "0",
				}),
			),
		),
		IE.jsx.str(
			"div",
			{
				class: "item-contain icon_mobile_phone",
				title: ObjetTraduction_1.GTraductions.getValeur(
					"InfosMedicales.MobileTelephone",
				),
			},
			IE.jsx.str(
				"div",
				{ class: "flex-contain" },
				IE.jsx.str(
					"label",
					{ for: "idIndPortMedecin", class: "sr-only" },
					ObjetTraduction_1.GTraductions.getValeur(
						"InfosMedicales.IndicatifTelephone",
					),
				),
				IE.jsx.str("input", {
					id: "idIndPortMedecin",
					"ie-model": "indPortMedecin",
					class: "round-style m-right",
					"ie-indicatiftel": true,
					style:
						ObjetStyle_1.GStyle.composeWidth(lLargeurIndicatif) +
						"; margin-right:.4rem",
					type: "text",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"InfosMedicales.IndicatifTelephone",
					),
					tabindex: "0",
				}),
				IE.jsx.str(
					"label",
					{ for: "idTelPortMedecin", class: "sr-only" },
					ObjetTraduction_1.GTraductions.getValeur("infosperso.SMS"),
				),
				IE.jsx.str("input", {
					id: "idTelPortMedecin",
					"ie-model": "telPortMedecin",
					class: "round-style",
					"ie-telephone": true,
					style: ObjetStyle_1.GStyle.composeWidth(lLargeurTel),
					type: "text",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"InfosMedicales.MobileTelephone",
					),
					tabindex: "0",
				}),
			),
		),
		IE.jsx.str(
			"div",
			{ class: "switch-contain" },
			UtilitairePageDonneesPersonnelles.composerSwitch(
				Enumere_DonneesPersonnelles_3.EListeIds.cbAutoriserHospitalisation,
				ObjetTraduction_1.GTraductions.getValeur(
					"infosperso.autoriserHospitalisation",
				),
				"autoriseHospitalisation",
			),
		),
	);
};
function _construireCoordonnees(aParams) {
	const lApp = GApplication;
	const lEtatUtilisateur = lApp.getEtatUtilisateur();
	const H = [];
	let lSrcPhoto;
	const lIndividu = lEtatUtilisateur.getUtilisateur();
	if (
		!!lIndividu &&
		lIndividu.photoBase64 &&
		![
			Enumere_Ressource_1.EGenreRessource.Responsable,
			Enumere_Ressource_1.EGenreRessource.ResponsablePostulant,
			Enumere_Ressource_1.EGenreRessource.MaitreDeStage,
			Enumere_Ressource_1.EGenreRessource.InspecteurPedagogique,
		].includes(lIndividu.getGenre())
	) {
		lSrcPhoto = "data:image/png;base64," + lIndividu.photoBase64;
	}
	H.push(`<div class="bloc-identite">`);
	const lInfosNominatives = [];
	if (aParams.civilite) {
		lInfosNominatives.push(aParams.civilite);
	}
	if (aParams.nom) {
		lInfosNominatives.push(aParams.nom);
	}
	if (aParams.prenoms) {
		lInfosNominatives.push(aParams.prenoms);
	}
	const lStrNominatif = lInfosNominatives.join(" ");
	const lHtmlPhoto = [];
	if (lSrcPhoto) {
		lHtmlPhoto.push(
			IE.jsx.str(
				"div",
				{ class: "photo-contain" },
				IE.jsx.str("img", {
					"ie-load-src": lSrcPhoto,
					"ie-imgviewer": true,
					alt: aParams.droitImageAutoriser
						? ""
						: ObjetTraduction_1.GTraductions.getValeur(
								"PhotoNonAutoriseeDe_S",
								[lStrNominatif],
							),
					role: aParams.droitImageAutoriser ? "presentation" : "",
					"ie-node": "nodePhoto()",
				}),
			),
		);
	} else {
		lHtmlPhoto.push(
			'<i class="icone-alternative icon_uniF2BD" aria-hidden="true"></i>',
		);
	}
	H.push(lHtmlPhoto.join(""));
	if (lStrNominatif.length > 0) {
		H.push('<div class="info-principale">', lStrNominatif, "</div>");
	}
	if (aParams.avecInfosEntreprise) {
		if (aParams.entreprise) {
			H.push(
				'<div class="info-principale">',
				aParams.entreprise.getLibelle(),
				"</div>",
				!!aParams.entreprise.nomCommercial
					? '<div class="info-secondaire">' +
							aParams.entreprise.nomCommercial +
							"</div>"
					: "",
			);
		}
		if (aParams.fonction) {
			H.push(
				'<div class="info-secondaire">',
				aParams.fonction.getLibelle(),
				"</div>",
			);
		}
	}
	const lInfosAdresses = [];
	if (aParams.adresse1) {
		lInfosAdresses.push(aParams.adresse1);
	}
	if (aParams.adresse2) {
		lInfosAdresses.push(aParams.adresse2);
	}
	if (aParams.adresse3) {
		lInfosAdresses.push(aParams.adresse3);
	}
	if (aParams.adresse4) {
		lInfosAdresses.push(aParams.adresse4);
	}
	if (aParams.codePostal || aParams.ville) {
		lInfosAdresses.push(aParams.codePostal + " " + aParams.ville);
	}
	if (aParams.province) {
		lInfosAdresses.push(aParams.province);
	}
	if (aParams.pays) {
		lInfosAdresses.push(aParams.pays);
	}
	H.push(
		'<div class="info-secondaire">',
		lInfosAdresses.join("<br/>"),
		"</div>",
	);
	H.push(_composeZoneTelephone.bind(this)(aParams));
	H.push("</div>");
	return H.join("");
}
function _composeZoneTelephone(aParams) {
	const H = [];
	if (aParams.avecTelFixe) {
		H.push(
			_composeTelephone.bind(this)(
				aParams,
				Enumere_DonneesPersonnelles_2.EGenreTelephone.telFixe,
			),
		);
	}
	H.push(
		_composeTelephone.bind(this)(
			aParams,
			Enumere_DonneesPersonnelles_2.EGenreTelephone.telPort,
		),
	);
	if (aParams.avecTelFax) {
		H.push(
			_composeTelephone.bind(this)(
				aParams,
				Enumere_DonneesPersonnelles_2.EGenreTelephone.fax,
			),
		);
	}
	H.push(_composeEmail.bind(this)(aParams));
	return H.join("");
}
function _composeTelephone(aParams, aGenre) {
	const lApp = GApplication;
	const lEtatUtilisateur = lApp.getEtatUtilisateur();
	const H = [];
	let lIndicatif = "";
	let lTel = "";
	let lClassIcone = "";
	let lTitleChamps;
	let lTitleChampsIndicatif;
	let lPlaceholderChamps;
	switch (aGenre) {
		case Enumere_DonneesPersonnelles_2.EGenreTelephone.telFixe:
			lTel = "telephoneFixe";
			lIndicatif = "indicatifFixe";
			lClassIcone = "icon_home";
			lTitleChamps = ObjetTraduction_1.GTraductions.getValeur(
				"infosperso.infoTelephoneFixe",
			);
			lTitleChampsIndicatif = ObjetTraduction_1.GTraductions.getValeur(
				"infosperso.infoTelephoneFixe_indicatif",
			);
			break;
		case Enumere_DonneesPersonnelles_2.EGenreTelephone.telPort:
			lTel = "telephonePortable";
			lIndicatif = "indicatifTel";
			lClassIcone = "icon_mobile_phone";
			lTitleChamps =
				ObjetTraduction_1.GTraductions.getValeur("infosperso.infoSMS");
			lTitleChampsIndicatif = ObjetTraduction_1.GTraductions.getValeur(
				"infosperso.infoSMS_indicatif",
			);
			break;
		case Enumere_DonneesPersonnelles_2.EGenreTelephone.fax:
			lTel = "fax";
			lIndicatif = "indicatifFax";
			lClassIcone = "icon_tel_fax";
			lTitleChamps =
				ObjetTraduction_1.GTraductions.getValeur("infosperso.infoFax");
			lTitleChampsIndicatif = ObjetTraduction_1.GTraductions.getValeur(
				"infosperso.infoFax_indicatif",
			);
			break;
	}
	if (
		!lApp.droits.get(
			ObjetDroitsPN_1.TypeDroits.compte.avecSaisieInfosPersoCoordonnees,
		) &&
		!lIndicatif &&
		!lTel
	) {
		return;
	}
	const lAvecCbReserveAdmin = [
		Enumere_Espace_1.EGenreEspace.Etablissement,
		Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
		Enumere_Espace_1.EGenreEspace.Professeur,
		Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
	].includes(lEtatUtilisateur.GenreEspace);
	const lDroitsModif =
		lApp.droits.get(
			ObjetDroitsPN_1.TypeDroits.compte.avecSaisieInfosPersoCoordonnees,
		) && lAvecCbReserveAdmin;
	H.push(
		`<div class="item-contain ${lClassIcone}" aria-label="${lTitleChamps}" title="${lTitleChamps}">`,
	);
	H.push(
		`<div class="item-value">\n            <div class="flex-contain ">\n              <input ie-model="tel('${lIndicatif}')" class="round-style m-right " ie-indicatiftel ie-etatsaisie  style="${ObjetStyle_1.GStyle.composeWidth(aParams.largeurIndicatif)};margin-right:.4rem" type="text" ${lTitleChampsIndicatif ? `aria-label="${lTitleChampsIndicatif}" title="${lTitleChampsIndicatif}"` : ""} tabindex="0"/>\n              <input ie-model="tel('${lTel}')" class="round-style" ie-telephone ie-etatsaisie style="${ObjetStyle_1.GStyle.composeWidth(aParams.largeurTel)}" type="text" ${lPlaceholderChamps ? ` placeholder="${lPlaceholderChamps}"` : ""} ${lTitleChamps ? `aria-label="${lTitleChamps}" title="${lTitleChamps}" ` : ""} tabindex="0" />\n            </div>`,
	);
	if (lDroitsModif) {
		H.push(
			`<ie-checkbox ie-model="cbTelReserveAdministration">${ObjetTraduction_1.GTraductions.getValeur("infosperso.reserveAdministration")}</ie-checkbox>`,
		);
	}
	H.push(`</div>`);
	H.push(`</div>`);
	return H.join("");
}
function _composeEmail(aParams) {
	const lApp = GApplication;
	const lEtatUtilisateur = lApp.getEtatUtilisateur();
	const H = [];
	if (
		!lApp.droits.get(
			ObjetDroitsPN_1.TypeDroits.compte.avecSaisieInfosPersoCoordonnees,
		) &&
		!aParams.eMail
	) {
		return;
	}
	const lAvecCbReserveAdmin = [
		Enumere_Espace_1.EGenreEspace.Etablissement,
		Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
		Enumere_Espace_1.EGenreEspace.Professeur,
		Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
	].includes(lEtatUtilisateur.GenreEspace);
	const lDroitsModif =
		lApp.droits.get(
			ObjetDroitsPN_1.TypeDroits.compte.avecSaisieInfosPersoCoordonnees,
		) && lAvecCbReserveAdmin;
	H.push(
		`<div class="item-contain icon_arobase ${lDroitsModif ? ` flex-start` : ` flex-center`} " aria-label="${ObjetTraduction_1.GTraductions.getValeur("infosperso.infoEmail")}" title="${ObjetTraduction_1.GTraductions.getValeur("infosperso.infoEmail")}">`,
	);
	if (
		lApp.droits.get(
			ObjetDroitsPN_1.TypeDroits.compte.avecSaisieInfosPersoCoordonnees,
		)
	) {
		H.push(`<div class="item-value">`);
		H.push(
			`<input class="round-style" ${IE.estMobile ? "" : `style="${ObjetStyle_1.GStyle.composeWidth(aParams.largeurEmail)}"`} type="text" ie-model="eMail" maxlength="255" id="${Enumere_DonneesPersonnelles_3.EListeIds.email}" placeholder="${ObjetTraduction_1.GTraductions.getValeur("infosperso.infoEmail")}" value="${aParams.eMail || ""}" aria-label="${ObjetTraduction_1.GTraductions.getValeur("infosperso.infoEmail")}" title="${ObjetTraduction_1.GTraductions.getValeur("infosperso.infoEmail")}" tabindex="0" />`,
		);
		if (lAvecCbReserveAdmin) {
			H.push(
				`<ie-checkbox ie-model="cbEmailReserveAdministration">${ObjetTraduction_1.GTraductions.getValeur("infosperso.reserveAdministration")}</ie-checkbox>`,
			);
		}
		H.push(`</div>`);
	} else {
		if (aParams.eMail) {
			H.push(
				'<div class="item-value"><span>',
				aParams.eMail || "",
				"</span></div>",
			);
		}
	}
	H.push(`</div>`);
	return H.join("");
}
function _construireInformationsCompteEnfant(aParams) {
	const H = [];
	H.push(
		`<div class="texte-contain">\n            <p>${ObjetTraduction_1.GTraductions.getValeur("PageCompte.MsgEnfant1")}</p>\n            <p>${ObjetTraduction_1.GTraductions.getValeur("PageCompte.MsgEnfant2")}</p>\n          </div>`,
	);
	H.push(
		`<div class="item-conteneur-inner">\n            <h2 >${ObjetTraduction_1.GTraductions.getValeur("PageCompte.Identifiant")} :</h2>\n            <div class=valeur-contain">\n              <div class="flex-contain flex-center justify-between">\n                <div class="libelle-identification">${aParams.identifiant}</div>\n              </div>\n            </div>\n          </div>`,
	);
	H.push(
		`<div class="item-conteneur-inner no-line">\n          <h2>${ObjetTraduction_1.GTraductions.getValeur("PageCompte.MotDePasse")} :</h2>\n          <div class=valeur-contain">\n            <div class="flex-contain flex-center justify-between">\n              <div class="libelle-identification mdp">${aParams.informationsCompteMotDePasse}</div>\n              <ie-bouton id="${Enumere_DonneesPersonnelles_3.EListeIds.mdpEnfant}"${aParams.model ? ` ie-model="${aParams.model}"` : ""} tabindex="0">${ObjetTraduction_1.GTraductions.getValeur("PageCompte.Modifier")}</ie-bouton>\n            </div>\n          </div>\n        </div>`,
	);
	return H.join("");
}
function _construireNotifications(
	aMailActif,
	aNotificationMail,
	aNotificationMailTravaux,
	aGestionMailTravaux,
) {
	const lApp = GApplication;
	const lEtatUtilisateur = lApp.getEtatUtilisateur();
	const H = [];
	if (aMailActif) {
		H.push('<div class="notifications-contain">');
		const lGenreEspaceConcernes = [
			Enumere_Espace_1.EGenreEspace.Etablissement,
			Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
			Enumere_Espace_1.EGenreEspace.Administrateur,
			Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
			Enumere_Espace_1.EGenreEspace.PrimDirection,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
			Enumere_Espace_1.EGenreEspace.Professeur,
			Enumere_Espace_1.EGenreEspace.PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.Accompagnant,
			Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
			Enumere_Espace_1.EGenreEspace.Tuteur,
			Enumere_Espace_1.EGenreEspace.Mobile_Tuteur,
			Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
		];
		const lGenreEspacesAccompagnants = [
			Enumere_Espace_1.EGenreEspace.Accompagnant,
			Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
			Enumere_Espace_1.EGenreEspace.Tuteur,
			Enumere_Espace_1.EGenreEspace.Mobile_Tuteur,
			Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
		];
		H.push('<div class="notification-bloc">');
		if (lGenreEspaceConcernes.includes(lEtatUtilisateur.GenreEspace)) {
			const lIdCBNotifEmail = GUID_1.GUID.getId();
			const lIdCBNotifTravaux = GUID_1.GUID.getId();
			H.push(
				UtilitairePageDonneesPersonnelles.composerCheckbox(
					ObjetTraduction_1.GTraductions.getValeur(
						"PreferencesNotifications.etreNotifieParEmail",
					),
					"switchNotification",
					lIdCBNotifEmail,
				),
			);
			if (!lEtatUtilisateur.estEspaceMobile()) {
				H.push(
					IE.jsx.str(
						"div",
						{ class: "temporisation-contain" },
						ObjetTraduction_1.GTraductions.getValeur(
							"PreferencesNotifications.delaiTemporisation",
						),
						IE.jsx.str("ie-combo", {
							"ie-model": (0, jsx_1.jsxFuncAttr)("delaiNotif", lIdCBNotifEmail),
						}),
					),
				);
			}
			H.push("</div>");
			if (
				!lEtatUtilisateur.pourPrimaire() &&
				!lApp.estEDT &&
				!lGenreEspacesAccompagnants.includes(lEtatUtilisateur.GenreEspace) &&
				!!aGestionMailTravaux
			) {
				H.push('<div class="notification-bloc no-line">');
				H.push(
					UtilitairePageDonneesPersonnelles.composerCheckbox(
						ObjetTraduction_1.GTraductions.getValeur(
							"PreferencesNotifications.etreNotifieEmailTravaux",
						),
						"switchNotificationTravaux",
						lIdCBNotifTravaux,
					),
				);
				if (!lEtatUtilisateur.estEspaceMobile()) {
					H.push(
						IE.jsx.str(
							"div",
							{ class: "temporisation-contain" },
							ObjetTraduction_1.GTraductions.getValeur(
								"PreferencesNotifications.delaiTemporisation",
							),
							IE.jsx.str("ie-combo", {
								"ie-model": (0, jsx_1.jsxFuncAttr)(
									"delaiNotifTravaux",
									lIdCBNotifTravaux,
								),
							}),
						),
					);
				}
				H.push("</div>");
			}
		}
		H.push("</div>");
	} else {
		H.push(
			ObjetTraduction_1.GTraductions.getValeur(
				"PreferencesNotifications.serveurNonConfigureNotif",
			),
		);
	}
	return H.join("");
}
function _construireDerniereConnexion() {
	const lApp = GApplication;
	const lEtatUtilisateur = lApp.getEtatUtilisateur();
	const H = [];
	const lMasque =
		"%JJJJ %J %MMMM %AAAA " +
		ObjetTraduction_1.GTraductions.getValeur("infosperso.SeparateurDateHeure") +
		" %hh:%mm";
	H.push(
		'<div class="date">',
		ObjetDate_1.GDate.formatDate(lEtatUtilisateur.derniereConnexion, lMasque),
		"</div>",
	);
	return H.join("");
}
function _construireMotDePasse(aParams) {
	const H = [];
	H.push('<div class="flex-contain flex-center justify-between">');
	H.push(
		'<div class="libelle-identification mdp">',
		'<span tabindex="0">',
		aParams.maskMdp,
		"</span>",
		"</div>",
	);
	H.push(
		'<ie-bouton id="',
		Enumere_DonneesPersonnelles_3.EListeIds.mdp,
		'" tabindex="0">',
		ObjetTraduction_1.GTraductions.getValeur("PageCompte.Modifier"),
		"</ie-bouton>",
	);
	H.push("</div>");
	return H.join("");
}
function _construireIdentifiant(aParams) {
	const lApp = GApplication;
	const lEtatUtilisateur = lApp.getEtatUtilisateur();
	const H = [];
	H.push(`<div class="flex-contain flex-center justify-between">`);
	H.push(
		'<div class="libelle-identification">',
		'<span tabindex="0">',
		lEtatUtilisateur.estEspaceMobile()
			? aParams.chaine
			: ObjetChaine_1.GChaine.ajouterEntites(
					lApp.getCommunication().getChaineDechiffreeAES(aParams.chaine),
				),
		"</span>",
		"</div>",
	);
	if (
		[
			Enumere_Espace_1.EGenreEspace.Professeur,
			Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
			Enumere_Espace_1.EGenreEspace.PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.PrimDirection,
		].includes(lEtatUtilisateur.GenreEspace)
	) {
		H.push(
			'<ie-bouton id="',
			Enumere_DonneesPersonnelles_3.EListeIds.identifiant,
			'" tabindex="0">',
			ObjetTraduction_1.GTraductions.getValeur("PageCompte.Modifier"),
			"</ie-bouton>",
		);
	}
	H.push(`</div>`);
	return H.join("");
}
function _construireDroitImage() {
	const lApp = GApplication;
	const lEtatUtilisateur = lApp.getEtatUtilisateur();
	const H = [];
	H.push('<div class="WhiteSpaceNormal InlineBlock">');
	H.push('<div class="AlignementHaut">');
	let lLibelleCheckboxDroitImage;
	if (
		[
			Enumere_Espace_1.EGenreEspace.Professeur,
			Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
			Enumere_Espace_1.EGenreEspace.PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.Accompagnant,
			Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
			Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
			Enumere_Espace_1.EGenreEspace.Tuteur,
			Enumere_Espace_1.EGenreEspace.Mobile_Tuteur,
			Enumere_Espace_1.EGenreEspace.Etablissement,
			Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
			Enumere_Espace_1.EGenreEspace.Administrateur,
			Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
			Enumere_Espace_1.EGenreEspace.PrimDirection,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
		].includes(lEtatUtilisateur.GenreEspace)
	) {
		lLibelleCheckboxDroitImage = ObjetTraduction_1.GTraductions.getValeur(
			"infosperso.autoriserImage",
			[lApp.nomProduit],
		);
	} else {
		lLibelleCheckboxDroitImage = ObjetTraduction_1.GTraductions.getValeur(
			"infosperso.autoriserImageParents",
			[lEtatUtilisateur.getMembre().getLibelle(), lApp.nomProduit],
		);
	}
	H.push(
		UtilitairePageDonneesPersonnelles.composerCheckbox(
			lLibelleCheckboxDroitImage,
			"switchAutoriserImage",
		),
	);
	H.push("</div>");
	H.push("</div>");
	return H.join("");
}
function _construirePagePersonnalisation(aControleur) {
	const lApp = GApplication;
	const lEtatUtilisateur = lApp.getEtatUtilisateur();
	const H = [];
	if (
		[
			Enumere_Espace_1.EGenreEspace.Professeur,
			Enumere_Espace_1.EGenreEspace.Etablissement,
			Enumere_Espace_1.EGenreEspace.PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.PrimDirection,
		].includes(lEtatUtilisateur.GenreEspace)
	) {
		H.push(
			IE.jsx.str(
				"div",
				{ class: "choice-contain" },
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": "accueil.cbAfficherPageAccueil" },
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.AfficherAccueilDemarrage",
					),
				),
			),
		);
	}
	if (
		!lApp.estAppliMobile &&
		UtilitaireChangementLangue_1.UtilitaireChangementLangue.avecChoixLangues()
	) {
		H.push(
			IE.jsx.str(
				"div",
				{ class: "choice-contain" },
				IE.jsx.str(
					"span",
					{ class: "libelle" },
					ObjetTraduction_1.GTraductions.getValeur(
						"ParametresUtilisateur.Langue",
					) + " : ",
				),
				UtilitaireChangementLangue_1.UtilitaireChangementLangue.construire(
					aControleur,
					{ avecEventFermeture: true },
				),
			),
		);
	}
	if (
		lApp.estPrimaire &&
		(UtilitaireSyntheseVocale_1.SyntheseVocale.supportee || lApp.estAppliMobile)
	) {
		H.push(
			IE.jsx.str(
				"div",
				{ class: "flex-contain cols flex-start p-bottom-l p-top-xl" },
				IE.jsx.str(
					"ie-checkbox",
					{ class: "p-bottom-l", "ie-model": "syntheseVocale.cbActiver" },
					ObjetTraduction_1.GTraductions.getValeur("SyntheseVocale.Activer"),
				),
				IE.jsx.str(
					"div",
					{ class: "flex-contain cols flex-start p-left-xl" },
					IE.jsx.str("ie-combo", {
						class: "p-bottom-l",
						"ie-model": "syntheseVocale.comboChoixVoix",
					}),
					lApp.estDebug() &&
						IE.jsx.str(
							"ie-checkbox",
							{ "ie-model": "syntheseVocale.cbSurLignage" },
							ObjetTraduction_1.GTraductions.getValeur(
								"SyntheseVocale.SurLignage",
							),
						),
				),
			),
		);
	}
	if (IE.estMobile) {
		H.push(
			IE.jsx.str(
				"div",
				{ class: "choice-contain" },
				IE.jsx.str(
					"span",
					{ class: "libelle" },
					ObjetTraduction_1.GTraductions.getValeur("modeSombre.theme") + " : ",
				),
				IE.jsx.str("ie-combo", { "ie-model": "comboDarkMode" }),
			),
		);
	}
	if (H.length > 0) {
		return IE.jsx.str("div", { class: "inner-item-contain" }, H.join(""));
	}
	return "";
}
function _construirePageICal() {
	const H = [];
	const lID = GUID_1.GUID.getId();
	H.push(
		IE.jsx.str(
			"section",
			{ class: "inner-item-contain" },
			IE.jsx.str(
				"div",
				{ class: "iCal-infosupplementaire", id: lID },
				IE.jsx.str(
					"div",
					{ class: "medium" },
					ObjetTraduction_1.GTraductions.getValeur("iCal.ChoixDonnees.Info"),
					" (",
					ObjetTraduction_1.GTraductions.getValeur(
						"iCal.ChoixDonnees.InfoSemaines",
					),
					")",
				),
				IE.jsx.str(
					"div",
					{ class: "light m-left-l" },
					ObjetTraduction_1.GTraductions.getValeur(
						"iCal.ChoixDonnees.InfoSuppl",
					),
				),
			),
			IE.jsx.str(
				"div",
				{ "ie-if": "iCal.avecCombo", class: "m-top-l" },
				IE.jsx.str("ie-combo", { "ie-model": "iCal.choixLien" }),
			),
			IE.jsx.str(
				"fieldset",
				{
					"ie-if": "iCal.avecChoix",
					class: "m-top-l flex-contain cols flex-stretch",
				},
				IE.jsx.str(
					"ie-checkbox",
					{
						class: "m-bottom-l p-all",
						"ie-model": "iCal.cbEDT",
						"ie-if": "iCal.cbEDT.avecEDT",
						"aria-describedby": lID,
					},
					ObjetTraduction_1.GTraductions.getValeur("iCal.ChoixDonnees.edt"),
				),
				IE.jsx.str(
					"ie-checkbox",
					{
						class: "m-bottom-l p-all",
						"ie-model": "iCal.cbAgenda",
						"ie-if": "iCal.cbAgenda.avecAgenda",
						"aria-describedby": lID,
					},
					ObjetTraduction_1.GTraductions.getValeur("iCal.ChoixDonnees.agenda"),
				),
			),
		),
	);
	const lClass = ["m-top-l"];
	if (IE.estMobile) {
		lClass.push("self-end");
	}
	H.push(
		IE.jsx.str(
			"section",
			{ class: "m-top-l flex-contain cols flex-start" },
			IE.jsx.str(
				"div",
				{ class: "iCal-infosupplementaire medium" },
				ObjetTraduction_1.GTraductions.getValeur("iCal.modes.titre"),
			),
			IE.jsx.str(
				"div",
				{ class: "m-top-xl flex-contain cols flex-start" },
				IE.jsx.str(
					"span",
					{ class: "medium" },
					"- ",
					ObjetTraduction_1.GTraductions.getValeur(
						"iCal.modes.ponctuelle.titre",
					),
				),
				IE.jsx.str(
					"span",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"iCal.modes.ponctuelle.info",
					),
				),
			),
			IE.jsx.str(
				"ie-bouton",
				{
					class: lClass,
					"ie-icon": "icon_ical",
					"ie-model": "iCal.exporter",
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"iCal.modes.ponctuelle.boutonAlt",
					),
				},
				ObjetTraduction_1.GTraductions.getValeur(
					"iCal.modes.ponctuelle.bouton",
				),
			),
			IE.jsx.str(
				"div",
				{ class: "m-top-xl flex-contain cols flex-start" },
				IE.jsx.str(
					"span",
					{ class: "medium" },
					"- ",
					ObjetTraduction_1.GTraductions.getValeur("iCal.modes.synchro.titre"),
				),
				IE.jsx.str(
					"span",
					null,
					ObjetTraduction_1.GTraductions.getValeur("iCal.modes.synchro.info"),
				),
			),
			IE.jsx.str("input", {
				"ie-model": "iCal.lienPermanent",
				type: "text",
				class: "m-top self-stretch round-style",
				onclick: "this.select()",
				readonly: "readonly",
				"aria-label": ObjetTraduction_1.GTraductions.getValeur(
					"iCal.modes.synchro.boutonAlt",
				),
			}),
			IE.jsx.str(
				"ie-bouton",
				{
					class: lClass,
					"ie-model": "iCal.copier",
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"iCal.modes.synchro.boutonAlt",
					),
				},
				ObjetTraduction_1.GTraductions.getValeur("iCal.modes.synchro.bouton"),
			),
		),
	);
	if (!IE.estMobile) {
		H.push(
			IE.jsx.str("section", {
				class: "m-top-xl flex-contain cols flex-start",
				"ie-html": "iCal.QRCode",
			}),
		);
	}
	return H.join("");
}
function _construireGeneralitesProfesseur() {
	const lApp = GApplication;
	const H = [];
	if (!IE.estMobile) {
		H.push(`<div class="inner-item-contain flex-contain cols">\n              <ie-checkbox ie-model="generalites.cbMasquerDonneesAutresProfesseurs">\n                ${ObjetTraduction_1.GTraductions.getValeur("infosperso.MasquerDonneesAutresProfesseurs")}
              </ie-checkbox>`);
	}
	H.push(`<ie-checkbox ie-model="generalites.cbAvecGestionDesThemes">\n                ${ObjetTraduction_1.GTraductions.getValeur("infosperso.AvecGestionDesThemes")}
              </ie-checkbox>`);
	if (lApp.getObject("transformationFlux")) {
		H.push(
			(0, tag_1.tag)(
				"ie-checkbox",
				{ "ie-model": "generalites.cbTransformationFlux" },
				ObjetTraduction_1.GTraductions.getValeur("ActiverCompressionAutoPDF"),
			),
		);
	}
	if (!IE.estMobile) {
		H.push(`</div>`);
	}
	return H.join("");
}
function _construireAutorisations(aParams) {
	const lApp = GApplication;
	const lEtatUtilisateur = lApp.getEtatUtilisateur();
	const H = [];
	H.push('<div class="autorisations-contain">');
	const lTitre = aParams.avecSaisie
		? ObjetTraduction_1.GTraductions.getValeur("infosperso.titreDestinataire")
		: ObjetTraduction_1.GTraductions.getValeur(
				"infosperso.titreDestinataireConsultation",
			);
	H.push(IE.jsx.str("p", { tabindex: "0" }, lTitre));
	H.push(
		`<div class="bloc-autorisation" role="group" aria-label="${lTitre.toAttrValue()}">`,
	);
	if (aParams.avecSMS && aParams.SMSAutorise !== undefined) {
		let lElemAvecSMS;
		if (aParams.avecSwitch) {
			lElemAvecSMS = UtilitairePageDonneesPersonnelles.composerSwitch(
				Enumere_DonneesPersonnelles_3.EListeIds.cbSMS,
				ObjetTraduction_1.GTraductions.getValeur("infosperso.SMS"),
				"switchSMSAutorise",
			);
		} else {
			lElemAvecSMS = UtilitairePageDonneesPersonnelles.composerCheckbox(
				ObjetTraduction_1.GTraductions.getValeur("infosperso.SMS"),
				"switchSMSAutorise",
			);
		}
		H.push(lElemAvecSMS);
	}
	if (aParams.emailAutorise !== undefined) {
		let lElemEmailAutorise;
		if (aParams.avecSwitch) {
			lElemEmailAutorise = UtilitairePageDonneesPersonnelles.composerSwitch(
				Enumere_DonneesPersonnelles_3.EListeIds.cbMail,
				ObjetTraduction_1.GTraductions.getValeur("infosperso.Email"),
				"switchEmailAutorise",
			);
		} else {
			lElemEmailAutorise = UtilitairePageDonneesPersonnelles.composerCheckbox(
				ObjetTraduction_1.GTraductions.getValeur("infosperso.Email"),
				"switchEmailAutorise",
			);
		}
		H.push(lElemEmailAutorise);
		if (
			aParams.emailEtablissementAutorise !== undefined &&
			aParams.emailParentAutorise !== undefined &&
			lEtatUtilisateur.GenreEspace !== Enumere_Espace_1.EGenreEspace.Parent &&
			lEtatUtilisateur.GenreEspace !==
				Enumere_Espace_1.EGenreEspace.Mobile_Parent
		) {
			let lElemEmailEtablissementAutorise;
			let lElemEmailParentAutorise;
			if (aParams.avecSwitch) {
				lElemEmailEtablissementAutorise =
					UtilitairePageDonneesPersonnelles.composerSwitch(
						Enumere_DonneesPersonnelles_3.EListeIds.cbMailEtab,
						ObjetTraduction_1.GTraductions.getValeur(
							"infosperso.EmailEtablissement",
						),
						"switchEmailEtablissementAutorise",
					);
				lElemEmailParentAutorise =
					UtilitairePageDonneesPersonnelles.composerSwitch(
						Enumere_DonneesPersonnelles_3.EListeIds.cbParent,
						ObjetTraduction_1.GTraductions.getValeur("infosperso.EMailParents"),
						"switchEmailParentAutorise",
					);
			} else {
				lElemEmailEtablissementAutorise =
					UtilitairePageDonneesPersonnelles.composerCheckbox(
						ObjetTraduction_1.GTraductions.getValeur(
							"infosperso.EmailEtablissement",
						),
						"switchEmailEtablissementAutorise",
					);
				lElemEmailParentAutorise =
					UtilitairePageDonneesPersonnelles.composerCheckbox(
						ObjetTraduction_1.GTraductions.getValeur("infosperso.EMailParents"),
						"switchEmailParentAutorise",
					);
			}
			H.push('<div class="sous-bloc">');
			H.push(lElemEmailEtablissementAutorise, lElemEmailParentAutorise);
			H.push("</div>");
		}
	}
	if (aParams.courrierPapierAutorise !== undefined) {
		let lElemCourrierPapierAutorise;
		if (aParams.avecSwitch) {
			lElemCourrierPapierAutorise =
				UtilitairePageDonneesPersonnelles.composerSwitch(
					Enumere_DonneesPersonnelles_3.EListeIds.cbCourrier,
					ObjetTraduction_1.GTraductions.getValeur("infosperso.Papier"),
					"switchCourrierPapierAutorise",
				);
		} else {
			lElemCourrierPapierAutorise =
				UtilitairePageDonneesPersonnelles.composerCheckbox(
					ObjetTraduction_1.GTraductions.getValeur("infosperso.Papier"),
					"switchCourrierPapierAutorise",
				);
		}
		H.push(lElemCourrierPapierAutorise);
	}
	H.push("</div>");
	if (aParams.msgParent !== null && aParams.msgEleve !== null) {
		H.push(_construireAutorisationsMessages(aParams));
	}
	H.push(_construireAutorisationsRdv(aParams));
	if (aParams.construireAutorisationsSupp) {
		H.push(_construireAutorisationsSupp(aParams));
	}
	H.push("</div>");
	return H.join("");
}
function _construireCommunicationsParents(aParams) {
	const H = [];
	let lTexteAccepte;
	let lTexteDiffuse;
	lTexteAccepte = aParams.estDelegue
		? aParams.nbClasses === 1
			? ObjetTraduction_1.GTraductions.getValeur(
					"infosperso.avecLesResponsablesDeLaClasse",
					[aParams.delegueDesClasses],
				)
			: ObjetTraduction_1.GTraductions.getValeur(
					"infosperso.avecLesResponsablesDesClasses",
					[aParams.delegueDesClasses],
				)
		: aParams.nbClasses === 1
			? ObjetTraduction_1.GTraductions.getValeur(
					"infosperso.avecRespDeleguesClasse",
					[aParams.delegueDesClasses],
				)
			: ObjetTraduction_1.GTraductions.getValeur(
					"infosperso.avecRespDeleguesClasses",
					[aParams.delegueDesClasses],
				);
	lTexteDiffuse = aParams.estMembreCA
		? ObjetTraduction_1.GTraductions.getValeur(
				"infosperso.avecTousResponsables",
				[aParams.delegueDesClasses],
			)
		: aParams.estDelegue
			? lTexteAccepte
			: "";
	H.push('<div class="WhiteSpaceNormal InlineBlock">');
	H.push("<div>");
	H.push(
		UtilitairePageDonneesPersonnelles.composerSwitch(
			Enumere_DonneesPersonnelles_3.EListeIds.cbMsgParent,
			ObjetTraduction_1.GTraductions.getValeur(
				"infosperso.discussionsAvecParents",
			),
			"CBDiscussionAvecParents",
		),
	);
	H.push('<div class="GrandEspaceGauche Italique">', lTexteAccepte, "</div>");
	if (aParams.estDelegue || aParams.estMembreCA) {
		H.push(
			UtilitairePageDonneesPersonnelles.composerSwitch(
				Enumere_DonneesPersonnelles_3.EListeIds.cbMsgProfsPerso,
				ObjetTraduction_1.GTraductions.getValeur("infosperso.communiquerEmail"),
				"CBCommuniquerMail",
			),
		);
		H.push('<div class="GrandEspaceGauche Italique">', lTexteDiffuse, "</div>");
	}
	H.push("</div>");
	H.push("</div>");
	return H.join("");
}
function _construireAutorisationsRdv(aParams) {
	const H = [];
	if (
		aParams.acceptDemandeRdv !== null &&
		aParams.acceptDemandeRdv !== undefined
	) {
		const lApp = GApplication;
		const lEtatUtilisateur = lApp.getEtatUtilisateur();
		let lEstCtxPrimDirection = [
			Enumere_Espace_1.EGenreEspace.PrimDirection,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
		].includes(lEtatUtilisateur.GenreEspace);
		let lEstCtxPrimEnseignant = [
			Enumere_Espace_1.EGenreEspace.PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
		].includes(lEtatUtilisateur.GenreEspace);
		let lEstCtxDirecteurEnseignant =
			(lEstCtxPrimDirection &&
				!!lEtatUtilisateur.getUtilisateur().estEnseignant) ||
			(lEstCtxPrimEnseignant &&
				!!lEtatUtilisateur.getUtilisateur().estDirecteur);
		const lTitre = ObjetTraduction_1.GTraductions.getValeur("infosperso.Rdv");
		H.push("<p>", lTitre, "</p>");
		H.push(
			`<div class="bloc-autorisation" role="group" aria-label="${lTitre.toAttrValue()}">`,
		);
		let lAcceptRdv;
		let lStrAcceptRdv =
			lEstCtxDirecteurEnseignant || lEstCtxPrimDirection
				? ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.AccepteDemandeRdvDirEns",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.AccepteDemandeRdv",
					);
		if (aParams.avecSwitch) {
			lAcceptRdv = UtilitairePageDonneesPersonnelles.composerSwitch(
				Enumere_DonneesPersonnelles_3.EListeIds.cbAcceptDemandeRdv,
				lStrAcceptRdv,
				"switchDemandeRdvAutorise",
			);
		} else {
			lAcceptRdv = UtilitairePageDonneesPersonnelles.composerCheckbox(
				lStrAcceptRdv,
				"switchDemandeRdvAutorise",
			);
		}
		H.push(lAcceptRdv);
		H.push("</div>");
	}
	return H.join("");
}
function _construireAutorisationsMessages(aParams) {
	const H = [];
	if (aParams.msgParent !== null && aParams.msgEleve !== null) {
		const lTitre = ObjetTraduction_1.GTraductions.getValeur(
			"infosperso.AccepteDiscussionAvec",
		);
		H.push(IE.jsx.str("p", null, lTitre));
		let lElemDiscussionProfs;
		let lElemDiscussionPersonnels;
		let lElemDiscussionParents;
		let lElemDiscussionEleves;
		if (aParams.avecSwitch) {
			lElemDiscussionProfs = UtilitairePageDonneesPersonnelles.composerSwitch(
				"",
				ObjetTraduction_1.GTraductions.getValeur("infosperso.DiscussionsProf"),
				`switchMsg('msgProfesseur')`,
			);
			lElemDiscussionPersonnels =
				UtilitairePageDonneesPersonnelles.composerSwitch(
					"",
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.DiscussionsPerso",
					),
					`switchMsg('msgPersonnel')`,
				);
			lElemDiscussionParents = UtilitairePageDonneesPersonnelles.composerSwitch(
				Enumere_DonneesPersonnelles_3.EListeIds.cbMsgParent,
				ObjetTraduction_1.GTraductions.getValeur(
					"infosperso.DiscussionsParents",
				),
				`switchMsg('msgParent')`,
			);
			lElemDiscussionEleves = UtilitairePageDonneesPersonnelles.composerSwitch(
				Enumere_DonneesPersonnelles_3.EListeIds.cbMsgEleve,
				ObjetTraduction_1.GTraductions.getValeur(
					"infosperso.DiscussionsEleves",
				),
				`switchMsg('msgEleve')`,
			);
		} else {
			lElemDiscussionProfs = UtilitairePageDonneesPersonnelles.composerCheckbox(
				ObjetTraduction_1.GTraductions.getValeur("infosperso.DiscussionsProf"),
				`switchMsg('msgProfesseur')`,
			);
			lElemDiscussionPersonnels =
				UtilitairePageDonneesPersonnelles.composerCheckbox(
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.DiscussionsPerso",
					),
					`switchMsg('msgPersonnel')`,
				);
			lElemDiscussionParents =
				UtilitairePageDonneesPersonnelles.composerCheckbox(
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.DiscussionsParents",
					),
					`switchMsg('msgParent')`,
				);
			lElemDiscussionEleves =
				UtilitairePageDonneesPersonnelles.composerCheckbox(
					ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.DiscussionsEleves",
					),
					`switchMsg('msgEleve')`,
				);
		}
		H.push(
			`<div class="bloc-autorisation" role="group" aria-label="${lTitre.toAttrValue()}">`,
		);
		H.push(lElemDiscussionProfs);
		H.push(lElemDiscussionPersonnels);
		H.push('<div class="">', lElemDiscussionParents);
		if (aParams.msgListePublicsParents) {
			H.push(
				_composeChoixDiscussion({
					libelle: ObjetTraduction_1.GTraductions.getValeur("Responsables"),
					model: "btnMsgPublicMsgParents",
					html: "getHtmlBtnMsgPublicMsgParents",
					estPourResponsable: true,
				}),
			);
		}
		H.push("</div>");
		H.push('<div class="">', lElemDiscussionEleves);
		if (aParams.msgListePublicsEleves) {
			H.push(
				_composeChoixDiscussion({
					libelle: ObjetTraduction_1.GTraductions.getValeur("Etudiants"),
					model: "btnMsgPublicMsgEleves",
					html: "getHtmlBtnMsgPublicMsgEleves",
					estPourResponsable: false,
				}),
			);
		}
		H.push("</div>");
		if (aParams.estContactVS !== null && aParams.estContactVS !== undefined) {
			let lElemContactVS;
			if (aParams.avecSwitch) {
				lElemContactVS = UtilitairePageDonneesPersonnelles.composerSwitch(
					Enumere_DonneesPersonnelles_3.EListeIds.cbMsgContactVS,
					ObjetTraduction_1.GTraductions.getValeur("infosperso.EstContactVS"),
					"switchMsgVieScolaire",
				);
			} else {
				lElemContactVS = UtilitairePageDonneesPersonnelles.composerCheckbox(
					ObjetTraduction_1.GTraductions.getValeur("infosperso.EstContactVS"),
					"switchMsgVieScolaire",
				);
			}
			H.push(lElemContactVS);
		}
		H.push("</div>");
	}
	return H.join("");
}
function _getClassImageDeDestinataire(aActif) {
	return aActif ? "actif" : "inactif";
}
function _composeChoixDiscussion(aParams) {
	const lIdCompteur = aParams.model + "_" + GUID_1.GUID.getId();
	return IE.jsx.str(
		IE.jsx.fragment,
		null,
		IE.jsx.str(
			"div",
			{
				class:
					"flex-contain cols m-left-big flex-gap-l m-top-nega-l m-bottom-l",
				"ie-display": aParams.estPourResponsable
					? "avecChoixParent"
					: "avecChoixEleve",
			},
			[
				TypeGenreEntiteAutorisationDiscussion_1
					.TypeGenreEntiteAutorisationDiscussion.AD_Tout,
				TypeGenreEntiteAutorisationDiscussion_1
					.TypeGenreEntiteAutorisationDiscussion.AD_MesClassesGroupes,
				TypeGenreEntiteAutorisationDiscussion_1
					.TypeGenreEntiteAutorisationDiscussion.AD_Personnalise,
			].map((aGenre) => {
				return IE.jsx.str(
					"div",
					{ class: "flex-contain flex-center flex-gap" },
					IE.jsx.str(
						"ie-radio",
						{
							"ie-model": (0, jsx_1.jsxFuncAttr)(
								aParams.estPourResponsable
									? "radioAutorisationResponsable"
									: "radioAutorisationEleve",
								[aGenre],
							),
						},
						TypeGenreEntiteAutorisationDiscussion_2.TypeGenreEntiteAutorisationDiscussionUtil.getLibelle(
							aGenre,
						),
					),
					aGenre ===
						TypeGenreEntiteAutorisationDiscussion_1
							.TypeGenreEntiteAutorisationDiscussion.AD_Personnalise
						? IE.jsx.str(
								IE.jsx.fragment,
								null,
								IE.jsx.str(
									"ie-bouton",
									{
										"aria-label": ObjetTraduction_1.GTraductions.getValeur(
											"infosperso.wai.boutonAccepteDiscussionAvecXPourClasses",
											aParams.libelle.toLowerCase(),
										),
										"aria-describedby": lIdCompteur,
										"ie-model": aParams.model,
										"ie-display": aParams.estPourResponsable
											? "avecBtnMsgParent"
											: "avecBtnMsgEleve",
									},
									"...",
								),
								IE.jsx.str("span", {
									id: lIdCompteur,
									class: "compteur",
									"ie-html": aParams.html,
									"ie-display": aParams.estPourResponsable
										? "avecBtnMsgParent"
										: "avecBtnMsgEleve",
								}),
							)
						: "",
				);
			}),
		),
	);
}
function _construireTitreAvecImages(aTitre, aGenre, aParams) {
	const lArrIcones = [];
	if (
		[
			Enumere_DonneesPersonnelles_5.ETypeSwitch.InfosEleve,
			Enumere_DonneesPersonnelles_5.ETypeSwitch.InfosGenerales,
		].includes(aGenre)
	) {
		lArrIcones.push(
			'<i role="img" class="icon_mobile_phone ',
			_getClassImageDeDestinataire(aParams.SMSAutorise),
			'" aria-label="',
			ObjetChaine_1.GChaine.toTitle(
				ObjetTraduction_1.GTraductions.getValeur("infosperso.SMS"),
			),
			'"></i>',
		);
	}
	lArrIcones.push(
		'<i role="img" class="icon_arobase ',
		_getClassImageDeDestinataire(aParams.emailAutorise),
		'" aria-label="',
		ObjetChaine_1.GChaine.toTitle(
			ObjetTraduction_1.GTraductions.getValeur("infosperso.Email"),
		),
		'"></i>',
	);
	if (
		[
			Enumere_DonneesPersonnelles_5.ETypeSwitch.Bulletin,
			Enumere_DonneesPersonnelles_5.ETypeSwitch.InfosEleve,
			Enumere_DonneesPersonnelles_5.ETypeSwitch.InfosGenerales,
		].includes(aGenre)
	) {
		lArrIcones.push(
			'<i role="img" class="icon_envelope ',
			_getClassImageDeDestinataire(aParams.courrierPapierAutorise),
			'" aria-label="',
			ObjetChaine_1.GChaine.toTitle(
				ObjetTraduction_1.GTraductions.getValeur("infosperso.Papier"),
			),
			'"></i>',
		);
	}
	const lAffichageAccepteRecevoir = [];
	lAffichageAccepteRecevoir.push('<span class="labels-contain">');
	lAffichageAccepteRecevoir.push('<span class="libelle">', aTitre, "</span>");
	lAffichageAccepteRecevoir.push(
		'<span class="icones-contain">',
		lArrIcones.join(""),
		"</span>",
	);
	lAffichageAccepteRecevoir.push("</span>");
	return lAffichageAccepteRecevoir.join("");
}
function _construireAutorisationsSupp(aParams) {
	const lApp = GApplication;
	const lHtml = [];
	if (aParams.listeEleves.count() > 0) {
		lHtml.push(
			'<h2 tabindex="0">',
			ObjetTraduction_1.GTraductions.getValeur("infosperso.titreRecevoir"),
			"</h2>",
		);
		lHtml.push(
			'<div class="',
			!IE.estMobile ? "bloc-decalage-gauche" : "",
			'">',
			UtilitairePageDonneesPersonnelles.composerCheckbox(
				_construireTitreAvecImages(
					ObjetTraduction_1.GTraductions.getValeur("infosperso.titreInfosGen"),
					Enumere_DonneesPersonnelles_5.ETypeSwitch.InfosGenerales,
					aParams,
				),
				"switchInfosGen",
			),
			"</div>",
		);
		for (let i = 0; i < aParams.listeEleves.count(); i++) {
			const lEleve = aParams.listeEleves.get(i);
			lHtml.push('<h3 tabindex="0">', lEleve.getLibelle(), "</h3>");
			lHtml.push(
				`<div class="bloc-decalage-gauche" role="group" aria-label="${lEleve.getLibelle().toAttrValue()}">`,
			);
			if (!lApp.estEDT) {
				lHtml.push(
					UtilitairePageDonneesPersonnelles.composerCheckbox(
						_construireTitreAvecImages(
							ObjetTraduction_1.GTraductions.getValeur(
								"infosperso.titreBulletin",
							),
							Enumere_DonneesPersonnelles_5.ETypeSwitch.Bulletin,
							aParams,
						),
						"switchBulletin(" + i + ")",
					),
				);
			}
			lHtml.push(
				UtilitairePageDonneesPersonnelles.composerCheckbox(
					_construireTitreAvecImages(
						ObjetTraduction_1.GTraductions.getValeur(
							"infosperso.titreInfosEleve",
						),
						Enumere_DonneesPersonnelles_5.ETypeSwitch.InfosEleve,
						aParams,
					),
					"switchInfosEleve(" + i + ")",
				),
			);
			lHtml.push(
				UtilitairePageDonneesPersonnelles.composerCheckbox(
					_construireTitreAvecImages(
						ObjetTraduction_1.GTraductions.getValeur(
							"infosperso.titreInfosProf",
						),
						Enumere_DonneesPersonnelles_5.ETypeSwitch.InfosProfesseur,
						aParams,
					),
					"switchInfosProfs(" + i + ")",
				),
			);
			lHtml.push("</div>");
		}
	}
	return lHtml.join("");
}
UtilitairePageDonneesPersonnelles.composerSwitch = function (
	aID,
	aLibelle,
	aModel,
) {
	const lHtml = [];
	lHtml.push(
		'<div class="choice-contain">',
		`<ie-switch name="${aID}" id="${aID}" ie-model="${aModel}">${aLibelle}</ie-switch>`,
		"</div>",
	);
	return lHtml.join("");
};
function _construireAccessibilite() {
	const H = [];
	H.push(
		(0, tag_1.tag)("div", {
			class: "inner-item-contain flex-contain cols",
			"ie-identite": "getIdentiteAccessibilite",
		}),
	);
	return H.join("");
}
function _construireSignature(aParams) {
	const H = [];
	if (!!aParams.signature && !!aParams.signature.logo) {
		const lImgSignature = "data:image/png;base64," + aParams.signature.logo;
		H.push(
			'<div class="ie-titre-petit flex-contain flex-center justify-between">',
			`<span>${ObjetTraduction_1.GTraductions.getValeur("infosperso.apercu")}</span>`,
			'<ie-btnicon ie-model="btnSupprimerImageSignature" class="bt-activable bt-large icon_trash"></ie-btnicon>',
			"</div>",
			'<div class="bloc-signature-wrapper">',
			'<figure class="signature-contain">',
			`<img src="${lImgSignature}" />`,
			"</figure>",
			"</div>",
		);
	} else {
		H.push(
			'<ie-bouton id="',
			Enumere_DonneesPersonnelles_3.EListeIds.bntAjouterSignature,
			'" ie-model="btnAjouterImageSignature(\'',
			Enumere_DonneesPersonnelles_3.EListeIds.bntAjouterSignature,
			"')\">",
			ObjetTraduction_1.GTraductions.getValeur(
				"infosperso.btnImporterSignature",
			),
			"</ie-bouton>",
		);
	}
	H.push(
		'<div class="switch-contain m-top">',
		UtilitairePageDonneesPersonnelles.composerSwitch(
			Enumere_DonneesPersonnelles_3.EListeIds.autoriserSignature,
			ObjetTraduction_1.GTraductions.getValeur("infosperso.autoriserSignature"),
			"switchAutoriserSignature",
		),
		"</div>",
	);
	return H.join("");
}
function _construireCDT() {
	const H = [];
	H.push(
		(0, tag_1.tag)("div", {
			class: "inner-item-contain flex-contain cols",
			"ie-identite": "getIdentiteCahierDeTexte",
		}),
	);
	return H.join("");
}
function _construireEDT() {
	const H = [];
	H.push(
		'<div class="flex-contain flex-center m-bottom m-top-xl">',
		ObjetTraduction_1.GTraductions.getValeur("infosperso.LabelCouleur"),
		'<ie-combo class="m-left-l" ie-model="EDT.comboCouleur"></ie-combo>',
		"</div>",
	);
	H.push(
		"<em>",
		ObjetTraduction_1.GTraductions.getValeur("infosperso.TipCouleursDesCours"),
		"</em>",
	);
	return H.join("");
}
UtilitairePageDonneesPersonnelles.composerCheckbox = function (
	aLibelle,
	aModel,
	aId,
) {
	return IE.jsx.str(
		"div",
		{ class: "choice-contain" },
		IE.jsx.str(
			"ie-checkbox",
			{ id: !!aId && aId, "ie-model": aModel, tabindex: "0" },
			aLibelle,
		),
	);
};
UtilitairePageDonneesPersonnelles.swapClass = function (aTypeImage, aActif) {
	let lIcone;
	switch (aTypeImage) {
		case Enumere_DonneesPersonnelles_4.EGenreDestinataire.SMS:
			lIcone = "icon_mobile_phone";
			break;
		case Enumere_DonneesPersonnelles_4.EGenreDestinataire.Email:
			lIcone = "icon_arobase";
			break;
		case Enumere_DonneesPersonnelles_4.EGenreDestinataire.Courrier:
			lIcone = "icon_envelope";
			break;
	}
	const lTrue = aActif ? "inactif" : "actif";
	const lFalse = aActif ? "actif" : "inactif";
	const lListeImages = $("." + lIcone + "." + lTrue);
	lListeImages.each(function () {
		this.classList.remove(lTrue);
		this.classList.add(lFalse);
	});
};
UtilitairePageDonneesPersonnelles.fenetreModificationMDP = function (
	aInstancePere,
) {
	const lApp = GApplication;
	const lEtatUtilisateur = lApp.getEtatUtilisateur();
	ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_ModificationIdentifiantMDP_1.ObjetFenetre_ModificationIdentifiantMDP,
		{ pere: aInstancePere },
		{
			optionsMDP: {
				classRequeteSecurisation:
					ObjetRequeteSecurisationCompte_1.ObjetRequeteSecurisationComptePreference,
				actionRequeteSecurisation:
					TypeSecurisationCompte_1.TypeCommandeSecurisationCompteHttp
						.csch_AffecterMotDePassePersonnalise,
			},
		},
	).setDonnees(lEtatUtilisateur.reglesSaisieMotDePasse);
};
UtilitairePageDonneesPersonnelles.fenetreModificationIdentifiant = function (
	aInstancePere,
	aCallbackReussite,
) {
	const lApp = GApplication;
	if (
		!lApp.droits.get(ObjetDroitsPN_1.TypeDroits.compte.avecSaisieIdentifiant)
	) {
		return;
	}
	ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_ModificationIdentifiantMDP_1.ObjetFenetre_ModificationIdentifiantMDP,
		{
			pere: aInstancePere,
			evenement: function (aReussiteModificationIdentification) {
				if (aReussiteModificationIdentification) {
					aCallbackReussite();
				}
			},
			initialiser: function (aInstance) {
				aInstance.changementMDP = false;
			},
		},
		{
			optionsMDP: {
				classRequeteSecurisation:
					ObjetRequeteSecurisationCompte_1.ObjetRequeteSecurisationComptePreference,
				actionRequeteSecurisation:
					TypeSecurisationCompte_1.TypeCommandeSecurisationCompteHttp
						.csch_ModifierLogin,
			},
		},
	).setDonnees();
};
UtilitairePageDonneesPersonnelles.getDonneesDefaut = function () {
	return {
		AvecSMS: true,
		Informations: {
			nom: "",
			prenoms: "",
			civilite: "",
			adresse1: "",
			adresse2: "",
			adresse3: "",
			adresse4: "",
			codePostal: "",
			ville: "",
			pays: "",
			eMail: null,
			telephonePortable: null,
			indicatifTel: null,
			numeroINE: "",
			telephoneFixe: null,
			fax: null,
			entreprise: null,
			fonction: null,
		},
		Autorisations: {
			SMSAutorise: null,
			emailAutorise: null,
			eMailEtablissementAutorise: null,
			eMailParentAutorise: null,
			courrierPapierAutorise: null,
			estDestinataireInfosGenerales: false,
			listeEleves: new ObjetListeElements_1.ObjetListeElements(),
			msgParent: null,
			msgEleve: null,
			estContactVS: null,
			acceptDemandeRdv: null,
		},
	};
};
UtilitairePageDonneesPersonnelles.avecNotifications = function (aDonnes) {
	const lApp = GApplication;
	const lEtatUtilisateur = lApp.getEtatUtilisateur();
	return (
		aDonnes.notifications &&
		[
			Enumere_Espace_1.EGenreEspace.Etablissement,
			Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
			Enumere_Espace_1.EGenreEspace.Administrateur,
			Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
			Enumere_Espace_1.EGenreEspace.PrimDirection,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
			Enumere_Espace_1.EGenreEspace.Professeur,
			Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
			Enumere_Espace_1.EGenreEspace.PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.Accompagnant,
			Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
			Enumere_Espace_1.EGenreEspace.Tuteur,
			Enumere_Espace_1.EGenreEspace.Mobile_Tuteur,
			Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
		].includes(lEtatUtilisateur.GenreEspace)
	);
};
UtilitairePageDonneesPersonnelles.avecSignature = function () {
	const lApp = GApplication;
	const lEtatUtilisateur = lApp.getEtatUtilisateur();
	return (
		[
			Enumere_Espace_1.EGenreEspace.PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
		].includes(lEtatUtilisateur.GenreEspace) ||
		([
			Enumere_Espace_1.EGenreEspace.PrimDirection,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
		].includes(lEtatUtilisateur.GenreEspace) &&
			!!lEtatUtilisateur.getUtilisateur().estEnseignant)
	);
};
UtilitairePageDonneesPersonnelles.getListeFiltresAff = function (
	aDonnes,
	aParametres,
) {
	const lListe = new ObjetListeElements_1.ObjetListeElements();
	const lApp = GApplication;
	const lEtatUtilisateur = lApp.getEtatUtilisateur();
	let lElementTitre = new ObjetElement_1.ObjetElement(
		ObjetTraduction_1.GTraductions.getValeur(
			"ParametresUtilisateur.TitreCompte",
		),
	);
	lElementTitre.nonSelectionnable = true;
	lElementTitre.Genre =
		Enumere_DonneesPersonnelles_6.TypeFiltreAffichage.interTitre;
	lElementTitre.estInterTitre = ObjetListe_1.ObjetListe.typeInterTitre.h5;
	lListe.addElement(lElementTitre);
	if (
		lApp.droits.get(
			ObjetDroitsPN_1.TypeDroits.compte.avecInformationsPersonnelles,
		)
	) {
		lListe.add(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"ParametresUtilisateur.TitreMonProfil",
				),
				0,
				Enumere_DonneesPersonnelles_6.TypeFiltreAffichage.coords,
			),
		);
	}
	if (
		lEtatUtilisateur.derniereConnexion ||
		lApp.droits.get(ObjetDroitsPN_1.TypeDroits.compte.avecSaisieIdentifiant) ||
		lApp.droits.get(ObjetDroitsPN_1.TypeDroits.compte.avecSaisieMotDePasse) ||
		aDonnes.securisation ||
		aParametres.avecNumeroINE
	) {
		lListe.add(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"ParametresUtilisateur.TitreSecurisationCompte",
				),
				0,
				Enumere_DonneesPersonnelles_6.TypeFiltreAffichage.securisation,
			),
		);
	}
	if (
		!!aDonnes.Signature &&
		UtilitairePageDonneesPersonnelles.avecSignature()
	) {
		lListe.add(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("infosperso.Liste_Signature"),
				0,
				Enumere_DonneesPersonnelles_6.TypeFiltreAffichage.signature,
			),
		);
	}
	if (
		aParametres.avecInfosAutorisations ||
		UtilitairePageDonneesPersonnelles.avecNotifications(aDonnes) ||
		lApp.droits.get(
			ObjetDroitsPN_1.TypeDroits.avecDroitDeconnexionMessagerie,
		) ||
		aDonnes.droitImage ||
		(!!aDonnes.Signature && UtilitairePageDonneesPersonnelles.avecSignature())
	) {
		lElementTitre = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur(
				"ParametresUtilisateur.TitreCommunication",
			),
		);
		lElementTitre.nonSelectionnable = true;
		lElementTitre.Genre =
			Enumere_DonneesPersonnelles_6.TypeFiltreAffichage.interTitre;
		lElementTitre.estInterTitre = ObjetListe_1.ObjetListe.typeInterTitre.h5;
		lListe.addElement(lElementTitre);
	}
	if (aParametres.avecInfosAutorisations) {
		lListe.add(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"infosperso.Liste_PreferencesContact",
				),
				0,
				Enumere_DonneesPersonnelles_6.TypeFiltreAffichage.communication,
			),
		);
	}
	if (UtilitairePageDonneesPersonnelles.avecNotifications(aDonnes)) {
		lListe.add(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"ParametresUtilisateur.TitreNotifications",
				),
				0,
				Enumere_DonneesPersonnelles_6.TypeFiltreAffichage.notification,
			),
		);
	}
	if (lEtatUtilisateur.messagerieSignature) {
		lListe.add(
			new ObjetElement_1.ObjetElement({
				Libelle: ObjetTraduction_1.GTraductions.getValeur(
					"infosperso.MessagerieSignature",
				),
				Numero: 0,
				Genre:
					Enumere_DonneesPersonnelles_6.TypeFiltreAffichage.messagerieSignature,
			}),
		);
	}
	if (
		lApp.droits.get(ObjetDroitsPN_1.TypeDroits.avecDroitDeconnexionMessagerie)
	) {
		lListe.add(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"infosperso.Liste_Deconnexion",
				),
				0,
				Enumere_DonneesPersonnelles_6.TypeFiltreAffichage.deconnexion,
			),
		);
	}
	lElementTitre = new ObjetElement_1.ObjetElement(
		ObjetTraduction_1.GTraductions.getValeur(
			"ParametresUtilisateur.TitrePreferences",
		),
	);
	lElementTitre.nonSelectionnable = true;
	lElementTitre.estInterTitre = ObjetListe_1.ObjetListe.typeInterTitre.h5;
	lElementTitre.Genre =
		Enumere_DonneesPersonnelles_6.TypeFiltreAffichage.interTitre;
	lListe.addElement(lElementTitre);
	if (
		[
			Enumere_Espace_1.EGenreEspace.Professeur,
			Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
		].includes(lEtatUtilisateur.GenreEspace)
	) {
		lListe.add(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"infosperso.Liste_Generalites",
				),
				0,
				Enumere_DonneesPersonnelles_6.TypeFiltreAffichage.generalites,
			),
		);
	}
	if (
		[
			Enumere_Espace_1.EGenreEspace.Professeur,
			Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
		].includes(lEtatUtilisateur.GenreEspace) &&
		lApp.droits.get(ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionCDT)
	) {
		lListe.add(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"infosperso.Liste_CahierTexte",
				),
				0,
				Enumere_DonneesPersonnelles_6.TypeFiltreAffichage.cahierDeTexte,
			),
		);
	}
	if (aDonnes.iCal) {
		lListe.add(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("infosperso.iCal.Titre"),
				0,
				Enumere_DonneesPersonnelles_6.TypeFiltreAffichage.iCal,
			),
		);
	}
	lListe.add(
		new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur(
				"ParametresUtilisateur.StyleAccessibilite",
			),
			0,
			Enumere_DonneesPersonnelles_6.TypeFiltreAffichage.style,
		),
	);
	return lListe;
};
UtilitairePageDonneesPersonnelles.getStructurePourValidation = function (
	aDonnees,
	aStructure,
) {
	const lApp = GApplication;
	const lEtatUtilisateur = lApp.getEtatUtilisateur();
	let lValeur;
	if (
		lApp.droits.get(
			ObjetDroitsPN_1.TypeDroits.compte.avecSaisieInfosPersoCoordonnees,
		)
	) {
		aStructure.informations = {};
		if (aDonnees.Informations.eMail !== null) {
			lValeur = aDonnees.Informations.eMail;
			aStructure.informations.eMail = lValeur;
			aStructure.informations.emailReserveAdmin =
				aDonnees.Informations.emailReserveAdmin;
		}
		aStructure.informations.telephoneFixe = aDonnees.Informations.telephoneFixe;
		aStructure.informations.indicatifFixe = aDonnees.Informations.indicatifFixe;
		aStructure.informations.telephonePortable =
			aDonnees.Informations.telephonePortable;
		aStructure.informations.indicatifTel = aDonnees.Informations.indicatifTel;
		aStructure.informations.fax = aDonnees.Informations.fax;
		aStructure.informations.indicatifFax = aDonnees.Informations.indicatifFax;
		aStructure.informations.telReserveAdmin =
			aDonnees.Informations.telReserveAdmin;
	}
	if (
		lApp.droits.get(
			ObjetDroitsPN_1.TypeDroits.compte.avecSaisieInfosPersoAutorisations,
		)
	) {
		aStructure.autorisations = {};
		if (aDonnees.Autorisations.SMSAutorise !== null) {
			aStructure.autorisations.SMSAutorise = aDonnees.Autorisations.SMSAutorise;
		}
		if (aDonnees.Autorisations.emailAutorise !== null) {
			aStructure.autorisations.emailAutorise =
				aDonnees.Autorisations.emailAutorise;
		}
		if (aDonnees.Autorisations.eMailEtablissementAutorise !== null) {
			aStructure.autorisations.eMailEtablissementAutorise =
				aDonnees.Autorisations.eMailEtablissementAutorise;
		}
		if (aDonnees.Autorisations.eMailParentAutorise !== null) {
			aStructure.autorisations.eMailParentAutorise =
				aDonnees.Autorisations.eMailParentAutorise;
		}
		if (aDonnees.Autorisations.courrierPapierAutorise !== null) {
			aStructure.autorisations.courrierPapierAutorise =
				aDonnees.Autorisations.courrierPapierAutorise;
		}
		if (aDonnees.Autorisations.msgParent !== null) {
			aStructure.autorisations.msgParent = aDonnees.Autorisations.msgParent;
		}
		if (aDonnees.Autorisations.msgEleve !== null) {
			aStructure.autorisations.msgEleve = aDonnees.Autorisations.msgEleve;
		}
		if (aDonnees.Autorisations.msgProfesseur !== null) {
			aStructure.autorisations.msgProfesseur =
				aDonnees.Autorisations.msgProfesseur;
		}
		if (aDonnees.Autorisations.msgPersonnel !== null) {
			aStructure.autorisations.msgPersonnel =
				aDonnees.Autorisations.msgPersonnel;
		}
		if (aDonnees.Autorisations.estContactVS !== null) {
			aStructure.autorisations.estContactVS =
				aDonnees.Autorisations.estContactVS;
		}
		if (!!aDonnees.Autorisations.msgListePublicsParents) {
			aStructure.autorisations.msgListePublicsParents =
				aDonnees.Autorisations.msgListePublicsParents.setSerialisateurJSON({
					methodeSerialisation: (aElement) => {
						return !!aElement.estCoche;
					},
				});
		}
		if (!!aDonnees.Autorisations.msgListePublicsEleves) {
			aStructure.autorisations.msgListePublicsEleves =
				aDonnees.Autorisations.msgListePublicsEleves.setSerialisateurJSON({
					methodeSerialisation: (aElement) => {
						return !!aElement.estCoche;
					},
				});
		}
		aStructure.autorisations.discussionResponsables =
			aDonnees.Autorisations.optionCommunicationActivationdiscussion;
		aStructure.autorisations.publicationMail =
			aDonnees.Autorisations.optionCommunicationPublicationMail;
		aStructure.autorisations.genreEntiteAutorisationResponsable =
			aDonnees.Autorisations.genreEntiteAutorisationResponsable;
		aStructure.autorisations.genreEntiteAutorisationEleve =
			aDonnees.Autorisations.genreEntiteAutorisationEleve;
		if (aDonnees.Autorisations.acceptDemandeRdv !== null) {
			aStructure.autorisations.acceptDemandeRdv =
				aDonnees.Autorisations.acceptDemandeRdv;
		}
	}
	if (aDonnees.notifications) {
		aStructure.notifications = {};
		aStructure.notifications.notificationMail =
			aDonnees.notifications.notificationMail;
		aStructure.notifications.delaiNotification =
			aDonnees.notifications.delaiNotification;
		aStructure.notifications.gestionMailTravaux =
			aDonnees.notifications.gestionMailTravaux;
		aStructure.notifications.notificationMailTravaux =
			aDonnees.notifications.notificationMailTravaux;
		aStructure.notifications.delaiNotificationTravaux =
			aDonnees.notifications.delaiNotificationTravaux;
	}
	if (aDonnees.droitImage) {
		aStructure.droitImage = {};
		aStructure.droitImage.avecAutorisation = !aDonnees.droitImage.autoriser;
	}
	if (
		lApp.droits.get(
			ObjetDroitsPN_1.TypeDroits.compte.avecSaisieInfosPersoAutorisations,
		)
	) {
		if (aDonnees.Autorisations.estDestinataireInfosGenerales !== null) {
			aStructure.autorisations.estDestinataireInfosGenerales =
				aDonnees.Autorisations.estDestinataireInfosGenerales;
		}
		if (
			lEtatUtilisateur.GenreEspace ===
			Enumere_Espace_1.EGenreEspace.Mobile_Parent
		) {
			aStructure.autorisations.listeEleves = [];
			for (let i = 0; i < aDonnees.Autorisations.listeEleves.count(); i++) {
				const lEleve = aDonnees.Autorisations.listeEleves.get(i);
				const lJSONEleve = lEleve.toJSON();
				aStructure.autorisations.listeEleves.push(lJSONEleve);
				lJSONEleve.estDestinataireBulletin = lEleve.estDestinataireBulletin;
				lJSONEleve.estDestinataireInfosEleve = lEleve.estDestinataireInfosEleve;
				lJSONEleve.estDestinataireInfosProfesseur =
					lEleve.estDestinataireInfosProfesseur;
			}
		}
	}
	if (!!aDonnees.Signature) {
		aStructure.signature = {};
		aStructure.signature.estSupprimee = aDonnees.Signature.estSupprimee;
		aStructure.signature.autoriser = !aDonnees.Signature.autoriser;
		if (!!aDonnees.Signature.fichier) {
			aStructure.signature.listeFichiers =
				new ObjetListeElements_1.ObjetListeElements();
			aStructure.signature.listeFichiers.add(aDonnees.Signature.fichier);
		}
	}
	if (
		lEtatUtilisateur.messagerieSignature &&
		lEtatUtilisateur.messagerieSignature._signatureModifiee
	) {
		delete lEtatUtilisateur.messagerieSignature._signatureModifiee;
		aStructure.messagerieSignature = {
			signature: new TypeChaineHtml_1.TypeChaineHtml(
				lEtatUtilisateur.messagerieSignature.signature || "",
			),
		};
	}
	return true;
};
function _btnPublicMsg(aInstance, aListePublics) {
	const lListeArticles = new ObjetListeElements_1.ObjetListeElements();
	let lCumulGroupe = null;
	const lListeCumulNiveau = new ObjetListeElements_1.ObjetListeElements();
	aListePublics.parcourir((aArticle) => {
		const lArticle = MethodesObjet_1.MethodesObjet.dupliquer(aArticle);
		if (lArticle.getGenre() === Enumere_Ressource_1.EGenreRessource.Groupe) {
			if (!lCumulGroupe) {
				lCumulGroupe = ObjetElement_1.ObjetElement.create({
					Libelle: ObjetTraduction_1.GTraductions.getValeur("Groupes"),
					estUnDeploiement: true,
					estDeploye: false,
					estCumulGroupe: true,
				});
				lListeArticles.add(lCumulGroupe);
			}
			lArticle.pere = lCumulGroupe;
		} else {
			let lCumul = lListeCumulNiveau.getElementParNumero(
				lArticle.niveau.getNumero(),
			);
			if (!lCumul) {
				lCumul = lArticle.niveau;
				lCumul.estUnDeploiement = true;
				lCumul.estDeploye = false;
				lListeCumulNiveau.add(lCumul);
				lListeArticles.add(lCumul);
			}
			lArticle.pere = lCumul;
		}
		lListeArticles.add(lArticle);
	});
	lListeArticles
		.setTri([
			ObjetTri_1.ObjetTri.initRecursif("pere", [
				ObjetTri_1.ObjetTri.init((aArticle) => !!aArticle.estCumulGroupe),
				ObjetTri_1.ObjetTri.init("Libelle"),
			]),
		])
		.trier();
	const lDonneesListe =
		new ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign(
			lListeArticles,
		).setOptions({
			avecBoutonActionLigne: false,
			avecCB: true,
			avecEvnt_CB: false,
			avecCocheCBSurLigne: true,
			avecSelection: false,
		});
	ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_Liste_1.ObjetFenetre_Liste,
		{
			pere: aInstance,
			evenement: function (aGenreBouton) {
				if (aGenreBouton !== 1) {
					return;
				}
				aInstance.setEtatSaisie(true);
				aListePublics.parcourir((aArticle) => {
					const lArticleTableAff = lDonneesListe.Donnees.getElementParNumero(
						aArticle.getNumero(),
					);
					if (
						lArticleTableAff &&
						lArticleTableAff.estCoche !== aArticle.estCoche
					) {
						aArticle.estCoche = !!lArticleTableAff.estCoche;
					}
				});
			},
			initialiser(aFenetre) {
				aFenetre.setOptionsFenetre({
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"infosperso.PourLesClassesGroupes",
					),
					largeur: 300,
					hauteur: 500,
					listeBoutons: [
						ObjetTraduction_1.GTraductions.getValeur("Annuler"),
						ObjetTraduction_1.GTraductions.getValeur("Valider"),
					],
					modeActivationBtnValider:
						aFenetre.modeActivationBtnValider.toujoursActifs,
				});
				aFenetre.paramsListe = {
					optionsListe: {
						skin: ObjetListe_1.ObjetListe.skin.flatDesign,
						boutons: [
							{ genre: ObjetListe_1.ObjetListe.typeBouton.deployer },
							{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher },
						],
						avecCBToutCocher: true,
					},
				};
			},
		},
	).setDonnees(lDonneesListe);
}
