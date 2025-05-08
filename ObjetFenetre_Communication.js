const { TypeDroits } = require("ObjetDroitsPN.js");
const { DonneesListe_Communication } = require("DonneesListe_Communication.js");
const { ObjetRequeteSaisieCasier } = require("ObjetRequeteSaisieCasier.js");
const { GUID } = require("GUID.js");
const { Invocateur } = require("Invocateur.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetTabOnglets } = require("ObjetTabOnglets.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetFenetre_Discussion } = require("ObjetFenetre_Discussion.js");
const {
	ObjetRequeteListeRessourcesPourCommunication,
} = require("ObjetRequeteListeRessourcesPourCommunication.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const {
	TypeGenreReponseInternetActualite,
} = require("TypeGenreReponseInternetActualite.js");
const { UtilitaireMessagerie } = require("UtilitaireMessagerie.js");
const { UtilitaireDocument } = require("UtilitaireDocument.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const {
	ObjetFenetre_EditionActualite,
} = require("ObjetFenetre_EditionActualite.js");
const { ObjetFenetre_Message } = require("ObjetFenetre_Message.js");
const { jsxFuncAttr } = require("jsx.js");
const EGenreRequete = {
	MembresConseilAdministration: 1,
	ParentsDeLaClasseX: 2,
	ParentsDeleguesDeLaClasseX: 3,
	TousLesParentsDelegues: 4,
};
class ObjetFenetre_Communication extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({ avecTailleSelonContenu: true });
		this.genreBoutons = {
			email: 0,
			demarrerDiscussion: 1,
			discussionsCommunes: 2,
			information: 3,
			sondage: 4,
			casier: 5,
		};
		this.ordreBoutons = [
			this.genreBoutons.email,
			this.genreBoutons.demarrerDiscussion,
			this.genreBoutons.discussionsCommunes,
			this.genreBoutons.information,
			this.genreBoutons.sondage,
			this.genreBoutons.casier,
		];
		this.avecInformations = [
			EGenreEspace.Professeur,
			EGenreEspace.PrimProfesseur,
			EGenreEspace.Etablissement,
			EGenreEspace.Administrateur,
			EGenreEspace.PrimDirection,
		].includes(GEtatUtilisateur.GenreEspace);
		this.idDivEnvoyerEMail = GUID.getId();
		this.idUnSeulDestinataire = GUID.getId();
		this.idBoutons = GUID.getId();
		this.idMessage = GUID.getId();
		this.hauteurTabOnglets = 40;
		this.membreSelectionne = null;
		this.modeAffichage = { modeDiscussion: false, affichageAllege: false };
		this.btnCommandesActifs = undefined;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getVisibleBouton(aGenreBouton) {
				return aInstance._estBoutonVisible(aInstance.genre, aGenreBouton);
			},
			btnCommande: {
				event(aGenreBouton) {
					_evenementSurBtnEdition.call(aInstance, aGenreBouton);
				},
				getDisabled(aGenreBouton) {
					return aInstance._getBtnInactif(aGenreBouton);
				},
				getAttr(aGenreBouton) {
					return {
						title: aInstance._getHintBouton(
							aGenreBouton,
							!aInstance._getBtnInactif(aGenreBouton),
						),
					};
				},
			},
		});
	}
	setModeAffichage(aModeDiscussion, aAffichageAllege) {
		this.modeAffichage.modeDiscussion = aModeDiscussion;
		this.modeAffichage.affichageAllege = aAffichageAllege;
	}
	construireInstances() {
		this.identCombo = this.add(
			ObjetSaisiePN,
			this.evenementSurCombo,
			this.initialiserCombo.bind(this),
		);
		this.identComboClasseGroupe = this.add(
			ObjetSaisiePN,
			this.evenementSurComboClasseGroupe,
			_initialiserComboClasseGroupe,
		);
		this.identComboMembres = this.add(
			ObjetSaisiePN,
			this.evenementSurComboMembre,
			this.initialiserCombo.bind(this),
		);
		this.identComboDelegues = this.add(
			ObjetSaisiePN,
			this.evenementSurComboDelegue,
			this.initialiserCombo.bind(this),
		);
		this.identTabs = this.add(
			ObjetTabOnglets,
			this.evenementSurTab,
			this.initialiserTabs,
		);
		this.identListe = this.add(
			ObjetListe,
			this.evenementSurListe,
			this.initialiserListe,
		);
		if (this.avecInformations) {
			this.identEditionActu = this.addFenetre(
				ObjetFenetre_EditionActualite,
				_evenementEditionActu.bind(this),
				_initialiserEditionActu,
			);
		}
		this.avecInputFile = [
			EGenreEspace.Professeur,
			EGenreEspace.PrimProfesseur,
			EGenreEspace.Etablissement,
			EGenreEspace.Administrateur,
			EGenreEspace.PrimDirection,
		].includes(GEtatUtilisateur.GenreEspace);
		if (
			!GApplication.droits.get(TypeDroits.communication.discussionInterdit) &&
			[
				EGenreEspace.Professeur,
				EGenreEspace.PrimProfesseur,
				EGenreEspace.Etablissement,
				EGenreEspace.Administrateur,
				EGenreEspace.Eleve,
				EGenreEspace.Parent,
				EGenreEspace.PrimParent,
				EGenreEspace.PrimEleve,
				EGenreEspace.Accompagnant,
				EGenreEspace.PrimAccompagnant,
				EGenreEspace.Tuteur,
				EGenreEspace.PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace)
		) {
			this.identFenetreDiscussion = this.add(
				ObjetFenetre_Message,
				_evntFenetreDiscussion.bind(this),
			);
		}
	}
	actionSurSaisieMessage(aFermerFenetre) {
		if (aFermerFenetre) {
			Invocateur.evenement("notification_creationDiscussion");
			this.fermer();
		}
	}
	_getLibelleBouton(aGenreBouton) {
		switch (aGenreBouton) {
			case this.genreBoutons.email:
				return GTraductions.getValeur("fenetreCommunication.bouton.email");
			case this.genreBoutons.demarrerDiscussion:
				return GTraductions.getValeur(
					"fenetreCommunication.bouton.demarrerDiscussion",
				);
			case this.genreBoutons.discussionsCommunes:
				return GTraductions.getValeur(
					"fenetreCommunication.bouton.discussionsCommunes",
				);
			case this.genreBoutons.information:
				return GTraductions.getValeur(
					"fenetreCommunication.bouton.information",
				);
			case this.genreBoutons.sondage:
				return GTraductions.getValeur("fenetreCommunication.bouton.sondage");
			case this.genreBoutons.casier:
				return GTraductions.getValeur("fenetreCommunication.bouton.casier");
		}
	}
	_getHintBouton(aGenreBouton, aActif) {
		switch (aGenreBouton) {
			case this.genreBoutons.email:
				return "";
			case this.genreBoutons.demarrerDiscussion:
				if (!aActif) {
					switch (this.genre) {
						case EGenreRessource.Eleve:
							return GTraductions.getValeur(
								"Messagerie.CommParentEleveInactif",
							);
						case EGenreRessource.Responsable:
							return GTraductions.getValeur("Messagerie.CommParentInactif");
					}
				}
				return "";
			case this.genreBoutons.discussionsCommunes:
				return "";
			case this.genreBoutons.information:
				return "";
			case this.genreBoutons.sondage:
				return "";
			case this.genreBoutons.casier:
				return "";
		}
	}
	_getClassBouton(aGenreBouton) {
		switch (aGenreBouton) {
			case this.genreBoutons.email:
				return "icon_email_participant";
			case this.genreBoutons.demarrerDiscussion:
				return "icon_nouvelle_conversation";
			case this.genreBoutons.discussionsCommunes:
				return "icon_intervenants";
			case this.genreBoutons.information:
				return "icon_diffuser_information";
			case this.genreBoutons.sondage:
				return "icon_diffuser_sondage";
			case this.genreBoutons.casier:
				return "icon_casier";
		}
	}
	_getHauteurBouton() {
		return 18;
	}
	_getIdBouton(aGenreBouton) {
		return this.Nom + "_bouton_" + aGenreBouton;
	}
	_estBoutonVisible(aGenreRessource, aGenreBouton) {
		if (this.modeAffichage.modeDiscussion) {
			return aGenreBouton === this.genreBoutons.demarrerDiscussion;
		}
		switch (aGenreBouton) {
			case this.genreBoutons.email:
				if (!avecDroitGlobalDiscussion()) {
					return false;
				}
				switch (GEtatUtilisateur.GenreEspace) {
					case EGenreEspace.PrimProfesseur:
						return [
							EGenreRessource.Eleve,
							EGenreRessource.Responsable,
							EGenreRessource.Enseignant,
							EGenreRessource.Periode,
						].includes(aGenreRessource);
					case EGenreEspace.Professeur:
						return [
							EGenreRessource.Eleve,
							EGenreRessource.Responsable,
							EGenreRessource.Enseignant,
							EGenreRessource.Personnel,
							EGenreRessource.MaitreDeStage,
							EGenreRessource.Periode,
						].includes(aGenreRessource);
					case EGenreEspace.Etablissement:
						return [
							EGenreRessource.Eleve,
							EGenreRessource.Responsable,
							EGenreRessource.Enseignant,
							EGenreRessource.Personnel,
						].includes(aGenreRessource);
					case EGenreEspace.Administrateur:
						return [
							EGenreRessource.Eleve,
							EGenreRessource.Responsable,
							EGenreRessource.Enseignant,
							EGenreRessource.Personnel,
						].includes(aGenreRessource);
					case EGenreEspace.PrimDirection:
						return [
							EGenreRessource.Eleve,
							EGenreRessource.Responsable,
							EGenreRessource.Enseignant,
							EGenreRessource.Personnel,
						].includes(aGenreRessource);
					case EGenreEspace.Parent:
						return [
							EGenreRessource.Responsable,
							EGenreRessource.Enseignant,
							EGenreRessource.Personnel,
						].includes(aGenreRessource);
					case EGenreEspace.Accompagnant:
						return [
							EGenreRessource.Responsable,
							EGenreRessource.Enseignant,
							EGenreRessource.Personnel,
						].includes(aGenreRessource);
					case EGenreEspace.PrimParent:
						return [EGenreRessource.Enseignant].includes(aGenreRessource);
					case EGenreEspace.PrimAccompagnant:
						return [EGenreRessource.Enseignant].includes(aGenreRessource);
					case EGenreEspace.Tuteur:
						return [
							EGenreRessource.Responsable,
							EGenreRessource.Enseignant,
							EGenreRessource.Personnel,
						].includes(aGenreRessource);
					default:
						return false;
				}
			case this.genreBoutons.demarrerDiscussion:
				return (
					avecDroitGlobalDiscussion() &&
					!GApplication.droits.get(
						TypeDroits.communication.discussionInterdit,
					) &&
					[
						EGenreEspace.Professeur,
						EGenreEspace.PrimProfesseur,
						EGenreEspace.Etablissement,
						EGenreEspace.Administrateur,
						EGenreEspace.PrimDirection,
						EGenreEspace.Eleve,
						EGenreEspace.Parent,
						EGenreEspace.PrimParent,
						EGenreEspace.Accompagnant,
						EGenreEspace.PrimAccompagnant,
						EGenreEspace.Tuteur,
					].includes(GEtatUtilisateur.GenreEspace)
				);
			case this.genreBoutons.discussionsCommunes:
				return (
					avecDroitGlobalDiscussion() &&
					!GApplication.droits.get(
						TypeDroits.communication.discussionInterdit,
					) &&
					[
						EGenreRessource.Enseignant,
						EGenreRessource.Personnel,
						EGenreRessource.Eleve,
						EGenreRessource.Responsable,
					].includes(aGenreRessource)
				);
			case this.genreBoutons.information:
				return (
					[
						EGenreEspace.Professeur,
						EGenreEspace.PrimProfesseur,
						EGenreEspace.Etablissement,
						EGenreEspace.Administrateur,
						EGenreEspace.PrimDirection,
					].includes(GEtatUtilisateur.GenreEspace) &&
					GApplication.droits.get(TypeDroits.actualite.avecSaisieActualite)
				);
			case this.genreBoutons.sondage:
				return (
					[
						EGenreEspace.Professeur,
						EGenreEspace.PrimProfesseur,
						EGenreEspace.Etablissement,
						EGenreEspace.Administrateur,
						EGenreEspace.PrimDirection,
					].includes(GEtatUtilisateur.GenreEspace) &&
					GApplication.droits.get(TypeDroits.actualite.avecSaisieActualite)
				);
			case this.genreBoutons.casier:
				return (
					[
						EGenreEspace.Professeur,
						EGenreEspace.Etablissement,
						EGenreEspace.Administrateur,
					].includes(GEtatUtilisateur.GenreEspace) &&
					[
						EGenreRessource.Enseignant,
						EGenreRessource.Personnel,
						EGenreRessource.MaitreDeStage,
					].includes(aGenreRessource) &&
					GApplication.droits.get(
						TypeDroits.casierNumerique.avecSaisieDocumentsCasiersIntervenant,
					)
				);
		}
	}
	_existeAuMoinsUnBoutonVisible(aGenreRessource) {
		for (let I = 0; I < this.ordreBoutons.length; I++) {
			const lGenreBouton = this.ordreBoutons[I];
			if (this._estBoutonVisible(aGenreRessource, lGenreBouton)) {
				return true;
			}
		}
		return false;
	}
	_actualiserBoutonsCommunication(aActif) {
		this.btnCommandesActifs = aActif;
	}
	_getBtnInactif(aGenreBouton) {
		if (!this.ListeRessources) {
			return true;
		}
		return this.btnCommandesActifs === undefined
			? !this._estBoutonActif(aGenreBouton)
			: !this.btnCommandesActifs;
	}
	_estBoutonActif(aGenreBouton) {
		const lListeSelectionnee = this._getListeSelectionnee();
		const lNbSelectionnes = lListeSelectionnee.count();
		switch (aGenreBouton) {
			case this.genreBoutons.email:
				return this._estBoutonEmailActif();
			case this.genreBoutons.discussionsCommunes:
				return lNbSelectionnes === 1;
			case this.genreBoutons.demarrerDiscussion:
				return this._estBoutonDemarrerDiscussionActif();
			case this.genreBoutons.information:
				return lNbSelectionnes > 0;
			case this.genreBoutons.sondage:
				return lNbSelectionnes > 0;
			case this.genreBoutons.casier:
				return lNbSelectionnes > 0 && this.avecInputFile;
		}
		return false;
	}
	_estBoutonEmailActif() {
		let lBoutonActif = false;
		const lListeSelectionnee = this._getListeSelectionnee();
		if (lListeSelectionnee) {
			lListeSelectionnee.parcourir((D) => {
				if (!!D && !!D.email) {
					lBoutonActif = true;
					return true;
				}
			});
		}
		return lBoutonActif;
	}
	_estBoutonDemarrerDiscussionActif() {
		const lListeSelectionnee = this._getListeSelectionnee();
		if (lListeSelectionnee.count() === 0) {
			return false;
		}
		let lEltAvecDiscussion = false;
		for (let i = 0; i < lListeSelectionnee.count(); i++) {
			const lElement = lListeSelectionnee.get(i);
			if (lElement.avecDiscussion) {
				lEltAvecDiscussion = true;
			} else {
				lEltAvecDiscussion = false;
				break;
			}
		}
		switch (this.genre) {
			case EGenreRessource.Classe:
				return lListeSelectionnee.count() === 1;
			case EGenreRessource.Eleve:
				return (
					lEltAvecDiscussion &&
					(UtilitaireMessagerie.estGenreDestinataireAutorise(
						EGenreRessource.Eleve,
					) ||
						UtilitaireMessagerie.estGenreDestinataireAutorise(
							EGenreRessource.Responsable,
						))
				);
			case EGenreRessource.Responsable: {
				const lGenreRequeteDelegue = getGenreRequeteDelegue.call(this);
				if (
					!!lGenreRequeteDelegue &&
					lGenreRequeteDelegue === EGenreRequete.MembresConseilAdministration
				) {
					return false;
				}
				return (
					lEltAvecDiscussion &&
					UtilitaireMessagerie.estGenreDestinataireAutorise(
						EGenreRessource.Responsable,
					)
				);
			}
			case EGenreRessource.Enseignant:
				return (
					lEltAvecDiscussion &&
					UtilitaireMessagerie.estGenreDestinataireAutorise(
						EGenreRessource.Enseignant,
					)
				);
			case EGenreRessource.Personnel:
				return (
					lEltAvecDiscussion &&
					UtilitaireMessagerie.estGenreDestinataireAutorise(
						EGenreRessource.Personnel,
					)
				);
		}
	}
	initialiserListeClasse() {
		this.listeClasses = new ObjetListeElements();
		if (
			[
				EGenreEspace.Professeur,
				EGenreEspace.PrimProfesseur,
				EGenreEspace.Etablissement,
				EGenreEspace.Administrateur,
				EGenreEspace.PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace)
		) {
			const lGenreRessourcesAvecTous = [];
			this.listeClasses = GEtatUtilisateur.getListeClasses({
				avecClasse: true,
				avecGroupe:
					this.genre !== EGenreRessource.Personnel &&
					GEtatUtilisateur.GenreEspace !== EGenreEspace.Etablissement,
				uniquementClasseEnseignee: true,
			});
			if (this.genre === EGenreRessource.Enseignant) {
				lGenreRessourcesAvecTous.push(EGenreRessource.Enseignant);
				this.listeClasses.addElement(
					new ObjetElement(
						GTraductions.getValeur(
							"fenetreEnvoiEmail.combo_item_TousLesProfesseurs",
						),
						0,
						EGenreRessource.Enseignant,
					),
				);
			}
			if (this.genre === EGenreRessource.Personnel) {
				lGenreRessourcesAvecTous.push(EGenreRessource.Personnel);
				this.listeClasses.addElement(
					new ObjetElement(
						GTraductions.getValeur(
							"fenetreEnvoiEmail.combo_item_TousLesPersonnels",
						),
						0,
						EGenreRessource.Personnel,
					),
				);
			}
			if (this.genre === EGenreRessource.Eleve) {
				if (
					[
						EGenreEspace.Professeur,
						EGenreEspace.PrimProfesseur,
						EGenreEspace.PrimDirection,
					].includes(GEtatUtilisateur.GenreEspace)
				) {
					lGenreRessourcesAvecTous.push(EGenreRessource.Eleve);
					this.listeClasses.addElement(
						new ObjetElement(
							GTraductions.getValeur(
								"fenetreEnvoiEmail.combo_item_MesElevesTutores",
							),
							0,
							EGenreRessource.Eleve,
						),
					);
				}
			}
			if (
				this.listeClasses.getElementParNumeroEtGenre(
					null,
					EGenreRessource.Classe,
				)
			) {
				this.listeClasses.addElement(
					new ObjetElement(
						GTraductions.getValeur("fenetreEnvoiEmail.combo_item_classe"),
						0,
						EGenreRessource.Classe,
					),
				);
			}
			if (
				this.listeClasses.getElementParNumeroEtGenre(
					null,
					EGenreRessource.Groupe,
				)
			) {
				this.listeClasses.addElement(
					new ObjetElement(
						GTraductions.getValeur("fenetreEnvoiEmail.combo_item_groupe"),
						0,
						EGenreRessource.Groupe,
					),
				);
			}
			for (let I = 0; I < this.listeClasses.count(); I++) {
				const LElement = this.listeClasses.get(I);
				LElement.ClassAffichage = LElement.existeNumero()
					? "PetitEspaceGauche"
					: "Gras";
				LElement.AvecSelection =
					LElement.existeNumero() ||
					lGenreRessourcesAvecTous.includes(LElement.getGenre());
			}
			this.listeClasses.setTri([
				ObjetTri.init((D) => {
					return ![
						EGenreRessource.Enseignant,
						EGenreRessource.Personnel,
						EGenreRessource.Eleve,
					].includes(D.getGenre());
				}),
				ObjetTri.init("Genre"),
				ObjetTri.init((D) => {
					return D.existeNumero();
				}),
				ObjetTri.init("Libelle"),
			]);
			this.listeClasses.trier();
		}
	}
	initialiserTabs(aInstance) {
		const lListeGenreRessources = new ObjetListeElements();
		if (
			this._existeAuMoinsUnBoutonVisible(EGenreRessource.Classe) &&
			[
				EGenreEspace.Professeur,
				EGenreEspace.PrimProfesseur,
				EGenreEspace.Etablissement,
				EGenreEspace.Administrateur,
				EGenreEspace.PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace) &&
			GEtatUtilisateur.getListeClasses({
				avecClasse: true,
				uniquementClasseEnseignee: true,
			}).count() > 0
		) {
			const lAvecAccesSeulementClasse = [
				EGenreEspace.Etablissement,
				EGenreEspace.Administrateur,
				EGenreEspace.PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace);
			const lLibelleOngletClasseGroupe = lAvecAccesSeulementClasse
				? GTraductions.getValeur("fenetreCommunication.onglet.classe")
				: GTraductions.getValeur("fenetreCommunication.onglet.classeGroupe");
			lListeGenreRessources.addElement(
				new ObjetElement(lLibelleOngletClasseGroupe, 0, EGenreRessource.Classe),
			);
		}
		if (
			this._existeAuMoinsUnBoutonVisible(EGenreRessource.Eleve) &&
			[
				EGenreEspace.Professeur,
				EGenreEspace.PrimProfesseur,
				EGenreEspace.Etablissement,
				EGenreEspace.Administrateur,
				EGenreEspace.PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace)
		) {
			lListeGenreRessources.addElement(
				new ObjetElement(
					GTraductions.getValeur("fenetreCommunication.onglet.eleve"),
					0,
					EGenreRessource.Eleve,
				),
			);
		}
		if (
			this._existeAuMoinsUnBoutonVisible(EGenreRessource.Enseignant) &&
			[
				EGenreEspace.Professeur,
				EGenreEspace.PrimProfesseur,
				EGenreEspace.Etablissement,
				EGenreEspace.Administrateur,
				EGenreEspace.PrimDirection,
				EGenreEspace.PrimParent,
				EGenreEspace.PrimEleve,
				EGenreEspace.Parent,
				EGenreEspace.Eleve,
				EGenreEspace.Accompagnant,
				EGenreEspace.PrimAccompagnant,
				EGenreEspace.Tuteur,
			].includes(GEtatUtilisateur.GenreEspace)
		) {
			lListeGenreRessources.addElement(
				new ObjetElement(
					GTraductions.getValeur("fenetreCommunication.onglet.professeur"),
					0,
					EGenreRessource.Enseignant,
				),
			);
		}
		if (
			this._existeAuMoinsUnBoutonVisible(EGenreRessource.Personnel) &&
			[
				EGenreEspace.Professeur,
				EGenreEspace.Etablissement,
				EGenreEspace.Administrateur,
				EGenreEspace.Parent,
				EGenreEspace.Eleve,
			].includes(GEtatUtilisateur.GenreEspace)
		) {
			lListeGenreRessources.addElement(
				new ObjetElement(
					GTraductions.getValeur("fenetreCommunication.onglet.personnel"),
					0,
					EGenreRessource.Personnel,
				),
			);
		}
		if (
			this._existeAuMoinsUnBoutonVisible(EGenreRessource.Responsable) &&
			([
				EGenreEspace.Professeur,
				EGenreEspace.PrimProfesseur,
				EGenreEspace.Etablissement,
				EGenreEspace.Administrateur,
				EGenreEspace.PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace) ||
				(GEtatUtilisateur.GenreEspace === EGenreEspace.Parent &&
					GParametres.ActivationMessagerieEntreParents &&
					GEtatUtilisateur.Identification.ressource.avecDiscussionResponsables))
		) {
			lListeGenreRessources.addElement(
				new ObjetElement(
					GTraductions.getValeur("fenetreCommunication.onglet.parent"),
					0,
					EGenreRessource.Responsable,
				),
			);
		}
		aInstance.setListeOnglets(lListeGenreRessources);
		aInstance.setOptions({
			largeur: this.optionsFenetre.largeur - 10,
			hauteur: this.hauteurTabOnglets,
		});
	}
	initialiserCombo(aInstance) {
		aInstance.setOptionsObjetSaisie({
			labelWAICellule: GTraductions.getValeur("AbsenceVS.comboRessource"),
			avecTriListeElements: false,
			longueur: 145,
			hauteur: 16,
		});
	}
	avecCombo() {
		if (!this.listeClasses || this.listeClasses.count() === 0) {
			return false;
		}
		if (
			[
				EGenreEspace.Professeur,
				EGenreEspace.PrimProfesseur,
				EGenreEspace.Etablissement,
				EGenreEspace.Administrateur,
				EGenreEspace.PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace)
		) {
			return [
				EGenreRessource.Enseignant,
				EGenreRessource.Responsable,
				EGenreRessource.Eleve,
				EGenreRessource.Personnel,
			].includes(this.genre);
		}
		return false;
	}
	avecComboClasseGroupe() {
		return (
			[
				EGenreEspace.Professeur,
				EGenreEspace.PrimProfesseur,
				EGenreEspace.PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace) &&
			[EGenreRessource.Classe, EGenreRessource.Groupe].includes(this.genre)
		);
	}
	avecComboMembres() {
		return (
			!this.avecComboDelegues() &&
			GEtatUtilisateur.Identification.ListeRessources.count() > 1 &&
			[
				EGenreEspace.Parent,
				EGenreEspace.PrimParent,
				EGenreEspace.Accompagnant,
				EGenreEspace.PrimAccompagnant,
				EGenreEspace.Tuteur,
			].includes(GEtatUtilisateur.GenreEspace)
		);
	}
	avecComboDelegues() {
		const lEstOngletResponsable = [EGenreRessource.Responsable].includes(
			this.genre,
		);
		return (
			[
				EGenreEspace.Parent,
				EGenreEspace.PrimParent,
				EGenreEspace.Accompagnant,
				EGenreEspace.PrimAccompagnant,
				EGenreEspace.Tuteur,
			].includes(GEtatUtilisateur.GenreEspace) && lEstOngletResponsable
		);
	}
	avecMail() {
		return (
			!this.modeAffichage.modeDiscussion &&
			[EGenreRessource.Personnel].includes(this.genre)
		);
	}
	initialiserListe(aInstance, aActualiser) {
		const lAfficherAvecDiscussion = _afficherAvecDiscussionDansTitre.call(this);
		const lAfficherAvecEmail =
			avecDroitGlobalDiscussion() &&
			GEtatUtilisateur.GenreEspace !== EGenreEspace.Eleve;
		const lColonnesCachees = [];
		if (
			[
				EGenreRessource.Classe,
				EGenreRessource.Groupe,
				EGenreRessource.Eleve,
			].includes(this.genre)
		) {
			lColonnesCachees.push(DonneesListe_Communication.colonnes.autre);
		}
		if (
			GEtatUtilisateur.GenreEspace === EGenreEspace.Parent &&
			this.genre === EGenreRessource.Responsable
		) {
			lColonnesCachees.push(DonneesListe_Communication.colonnes.autre);
		}
		if (
			this.modeAffichage.modeDiscussion ||
			[EGenreRessource.Classe, EGenreRessource.Groupe].includes(this.genre) ||
			GEtatUtilisateur.GenreEspace === EGenreEspace.Eleve
		) {
			lColonnesCachees.push(DonneesListe_Communication.colonnes.image);
		} else if (!lAfficherAvecDiscussion && !lAfficherAvecEmail) {
			lColonnesCachees.push(DonneesListe_Communication.colonnes.image);
		}
		const lTitreColonneNom =
			this.avecCombo() ||
			this.avecComboClasseGroupe() ||
			this.avecComboMembres() ||
			this.avecComboDelegues()
				? ""
				: this.genre === EGenreRessource.Classe
					? GTraductions.getValeur("fenetreCommunication.colonne.classe")
					: GTraductions.getValeur("fenetreCommunication.colonne.nom");
		const lTitreImage =
			"{" +
			(lAfficherAvecDiscussion
				? '<div style="float:left;" class="Image_Destinataire_Message_Actif" title="' +
					GTraductions.getValeur(
						"fenetreCommunication.colonne.discussionAutorisee",
					) +
					'"></div>'
				: "") +
			(lAfficherAvecEmail
				? '<div style="float:left;" class="Image_Destinataire_Email_Actif" title="' +
					GTraductions.getValeur("fenetreCommunication.colonne.emailAutorise") +
					'"></div>'
				: "") +
			"}";
		let lTitreColonneAutre = "";
		if (this.genre === EGenreRessource.Enseignant) {
			lTitreColonneAutre = GTraductions.getValeur(
				"fenetreCommunication.colonne.matiere",
			);
		} else if (this.genre === EGenreRessource.Responsable) {
			lTitreColonneAutre = GTraductions.getValeur(
				"fenetreCommunication.colonne.eleve",
			);
		} else if (this.genre === EGenreRessource.Personnel) {
			lTitreColonneAutre = GTraductions.getValeur(
				"fenetreCommunication.colonne.fonction",
			);
		}
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_Communication.colonnes.coche,
			titre: { estCoche: !this.unSeulDestinataire, libelle: "" },
			taille: 20,
		});
		lColonnes.push({
			id: DonneesListe_Communication.colonnes.nom,
			titre: lTitreColonneNom,
			taille: "100%",
			sansBordureDroite: true,
			libelleWai: GTraductions.getValeur("Nom"),
		});
		lColonnes.push({
			id: DonneesListe_Communication.colonnes.image,
			titre: lTitreImage,
			taille: lAfficherAvecDiscussion && lAfficherAvecEmail ? 40 : 20,
		});
		lColonnes.push({
			id: DonneesListe_Communication.colonnes.autre,
			titre: lTitreColonneAutre,
			taille: 170,
		});
		aInstance.setOptionsListe(
			{
				colonnes: lColonnes,
				colonnesCachees: lColonnesCachees,
				boutons: [{ genre: ObjetListe.typeBouton.rechercher }],
			},
			aActualiser,
		);
	}
	composeContenu() {
		const T = [];
		const lHauteur =
			this.optionsFenetre.hauteur - this.hauteurTabOnglets - 30 - 25;
		T.push(
			`<div class="menu-tabs-wrapper" id="${this.getNomInstance(this.identTabs)}"></div>`,
		);
		T.push(
			`<div class="content-wrapper">\n              <div id="${this.idMessage}" class="AlignementMilieu GrandEspaceHaut" style="display:none"></div>\n              <div class="combos-wrapper">\n                <div class="combo-field" id="${this.getNomInstance(this.identCombo)}"></div>\n                <div class="combo-field" id="${this.getNomInstance(this.identComboClasseGroupe)}"></div>\n                <div class="combo-field" id="${this.getNomInstance(this.identComboMembres)}"></div>\n                <div class="combo-field" id="${this.getNomInstance(this.identComboDelegues)}"></div>\n              </div>\n              <div class="ClassCommunicationBordure ${this.modeAffichage.modeDiscussion ? ` as-column` : ""}">\n                <div class="liste-classes" id="${this.getNomInstance(this.identListe)}" style="${this.modeAffichage.modeDiscussion ? `${_getHeight(lHauteur - 27)}` : `${_getHeight(lHauteur)} display: none;"`}></div>`,
		);
		T.push('<div class="liste-boutons" id="', this.idBoutons, '">');
		for (let I = 0; I < this.ordreBoutons.length; I++) {
			const lGenreBouton = this.ordreBoutons[I];
			T.push(
				`<div id="${this._getIdBouton(lGenreBouton)}"  ie-if="${jsxFuncAttr("getVisibleBouton", lGenreBouton)}" class="bt-contain${this.modeAffichage.modeDiscussion ? "" : " mb-xl"}">`,
				`<ie-bouton ie-model="${jsxFuncAttr("btnCommande", lGenreBouton)}" ie-attr="${jsxFuncAttr("btnCommande.getAttr", lGenreBouton)}" class="full-width">${this._getLibelleBouton(lGenreBouton)}</ie-bouton>`,
				"</div>",
			);
		}
		T.push("</div>");
		T.push(
			'<div id="',
			this.idUnSeulDestinataire,
			'" style="display: none;">',
			GTraductions.getValeur("fenetreEnvoiEmail.unSeulDestinataire"),
			"</div>",
		);
		T.push("</div>");
		T.push('<div id="', this.idDivEnvoyerEMail, '" class="sr-only"></div>');
		T.push("</div>");
		return T.join("");
	}
	evenementSurTab(aElement) {
		const lGenre = !!aElement
			? aElement.getGenre()
			: this.modeAffichage.affichageAllege
				? EGenreRessource.Personnel
				: 0;
		if (
			lGenre !== this.genre ||
			(lGenre === EGenreRessource.Responsable &&
				GEtatUtilisateur.GenreEspace === EGenreEspace.Parent)
		) {
			this.genre = lGenre;
			this._actualiserBoutonsCommunication(false);
			if (
				this.modeAffichage.modeDiscussion &&
				[
					EGenreEspace.Professeur,
					EGenreEspace.PrimProfesseur,
					EGenreEspace.Etablissement,
					EGenreEspace.Administrateur,
					EGenreEspace.PrimDirection,
				].includes(GEtatUtilisateur.GenreEspace) &&
				((lGenre === EGenreRessource.Eleve &&
					!UtilitaireMessagerie.estGenreDestinataireAutorise(
						EGenreRessource.Eleve,
					) &&
					!UtilitaireMessagerie.estGenreDestinataireAutorise(
						EGenreRessource.Responsable,
					)) ||
					(lGenre === EGenreRessource.Responsable &&
						!UtilitaireMessagerie.estGenreDestinataireAutorise(
							EGenreRessource.Responsable,
						)))
			) {
				this.actionSurEvenementCombo({ avecMessage: true });
				return;
			}
			this.unSeulDestinataire = false;
			this.initialiserListeClasse();
			if (this.avecCombo()) {
				const lClasseNavigation = GEtatUtilisateur.Navigation.getRessource(
					EGenreRessource.Classe,
				);
				let lIndiceClasse =
					this.listeClasses.getIndiceParElement(lClasseNavigation);
				if (lIndiceClasse === null || lIndiceClasse === undefined) {
					if (this.genre === EGenreRessource.Eleve) {
						lIndiceClasse = this.listeClasses.getIndiceElementParFiltre((D) => {
							return D.getGenre() === EGenreRessource.Classe;
						});
						if (lIndiceClasse === -1) {
							lIndiceClasse = this.listeClasses.getIndiceElementParFiltre(
								(D) => {
									return D.getGenre() === EGenreRessource.Groupe;
								},
							);
						}
						if (lIndiceClasse === -1) {
							lIndiceClasse = 0;
						}
					} else {
						lIndiceClasse = 0;
					}
				}
				this.getInstance(this.identCombo).setDonnees(
					this.listeClasses,
					lIndiceClasse,
				);
			} else if (this.avecComboClasseGroupe()) {
				const lListeClasseGroupe = new ObjetListeElements();
				lListeClasseGroupe.addElement(
					new ObjetElement(
						GTraductions.getValeur("fenetreEnvoiEmail.combo_item_classe"),
						0,
						EGenreRessource.Classe,
					),
				);
				lListeClasseGroupe.addElement(
					new ObjetElement(
						GTraductions.getValeur("fenetreEnvoiEmail.combo_item_groupe"),
						0,
						EGenreRessource.Groupe,
					),
				);
				this.getInstance(this.identComboClasseGroupe).setDonnees(
					lListeClasseGroupe,
					0,
				);
			} else if (this.avecComboDelegues()) {
				const lListeComboDelegues = new ObjetListeElements();
				if (GEtatUtilisateur.Identification.ressource.estDelegue) {
					GEtatUtilisateur.Identification.ressource.listeClassesDelegue.parcourir(
						(D) => {
							const lLibelle = GTraductions.getValeur(
								"fenetreEnvoiEmail.parentsDeLaClasse",
								[D.getLibelle()],
							);
							lListeComboDelegues.addElement(
								new ObjetElement(
									lLibelle,
									D.getNumero(),
									EGenreRequete.ParentsDeLaClasseX,
								),
							);
						},
					);
					if (GEtatUtilisateur.Identification.ListeRessources.count() > 1) {
						GEtatUtilisateur.Identification.ListeRessources.parcourir((D) => {
							const lLibelle = GTraductions.getValeur(
								"fenetreEnvoiEmail.parentsDelegues",
								[D.Classe.getLibelle()],
							);
							lListeComboDelegues.addElement(
								new ObjetElement(
									lLibelle,
									D.Classe.getNumero(),
									EGenreRequete.ParentsDeleguesDeLaClasseX,
								),
							);
						});
					}
					lListeComboDelegues.addElement(
						new ObjetElement(
							GTraductions.getValeur("fenetreEnvoiEmail.tousDelegues"),
							0,
							EGenreRequete.TousLesParentsDelegues,
						),
					);
				} else {
					GEtatUtilisateur.Identification.ListeRessources.parcourir((D) => {
						const lLibelle = GTraductions.getValeur(
							"fenetreEnvoiEmail.parentsDelegues",
							[D.Classe.getLibelle()],
						);
						lListeComboDelegues.addElement(
							new ObjetElement(
								lLibelle,
								D.Classe.getNumero(),
								EGenreRequete.ParentsDeleguesDeLaClasseX,
							),
						);
					});
				}
				if (!this.modeAffichage.modeDiscussion) {
					lListeComboDelegues.addElement(
						new ObjetElement(
							GTraductions.getValeur("fenetreEnvoiEmail.membresCA"),
							0,
							EGenreRequete.MembresConseilAdministration,
						),
					);
				}
				this.getInstance(this.identComboDelegues).setDonnees(
					lListeComboDelegues,
					0,
				);
			} else if (this.avecComboMembres()) {
				const lListeMembres = new ObjetListeElements();
				GEtatUtilisateur.Identification.ListeRessources.parcourir((D) => {
					lListeMembres.addElement(
						new ObjetElement(
							D.libelleLong,
							D.getNumero(),
							EGenreRessource.Eleve,
						),
					);
				});
				let lIndice =
					GEtatUtilisateur.Identification.ListeRessources.getIndiceParElement(
						this.membreSelectionne || GEtatUtilisateur.getMembre(),
					);
				lIndice = !!lIndice ? lIndice : 0;
				this.getInstance(this.identComboMembres).setDonnees(
					lListeMembres,
					lIndice,
				);
			} else {
				this.lancerRequeteListeRessourcesPourCommunication(
					new ObjetElement("", 0, EGenreRessource.Classe),
				);
			}
		}
	}
	lancerRequeteListeRessourcesPourCommunication(
		aFiltre,
		aParametresSupplementaires,
	) {
		const lOngletSelectionne = this.getInstance(
			this.identTabs,
		).getOngletSelectionne();
		const lParametresRequete = {
			onglet: lOngletSelectionne,
			filtreElement: aFiltre,
		};
		if (!!aParametresSupplementaires) {
			Object.assign(lParametresRequete, aParametresSupplementaires);
		}
		new ObjetRequeteListeRessourcesPourCommunication(
			this,
			this.actionSurEvenementCombo,
		).lancerRequete(lParametresRequete);
	}
	evenementSurCombo(aParams) {
		if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
			if (aParams.element && aParams.element.existeNumero()) {
				GEtatUtilisateur.Navigation.setRessource(
					EGenreRessource.Classe,
					aParams.element,
				);
			}
			this.lancerRequeteListeRessourcesPourCommunication(aParams.element);
		}
	}
	evenementSurComboClasseGroupe(aParams) {
		if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
			this.lancerRequeteListeRessourcesPourCommunication(aParams.element);
		}
	}
	evenementSurComboMembre(aParams) {
		if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
			this.membreSelectionne = aParams.element;
			this.lancerRequeteListeRessourcesPourCommunication(aParams.element);
		}
	}
	evenementSurComboDelegue(aParams) {
		if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
			const lElementASerialiser = MethodesObjet.dupliquer(aParams.element);
			lElementASerialiser.Numero = 0;
			const lParamsSupplementaires = {};
			if (
				aParams.element.getGenre() ===
					EGenreRequete.ParentsDeleguesDeLaClasseX ||
				aParams.element.getGenre() === EGenreRequete.ParentsDeLaClasseX
			) {
				lParamsSupplementaires.classe = new ObjetElement(
					"",
					aParams.element.getNumero(),
					EGenreRessource.Classe,
				);
			}
			this.lancerRequeteListeRessourcesPourCommunication(
				lElementASerialiser,
				lParamsSupplementaires,
			);
		}
	}
	evenementSurListe(aParametres, aGenreEvenementListe) {
		switch (aGenreEvenementListe) {
			case EGenreEvenementListe.ApresEdition:
				this._actualiserBoutonsCommunication();
				break;
			case EGenreEvenementListe.Selection:
				if (this.unSeulDestinataire) {
					this.ListeRessources.getListeElements((aElement) => {
						if (aElement !== aParametres.article) {
							aElement.selection = false;
						}
					});
				}
				break;
		}
	}
	_getListeSelectionnee() {
		const lListeSelectionnee = this.ListeRessources.getListeElements(
			(aElement) => {
				return aElement.selection;
			},
		);
		return lListeSelectionnee;
	}
	actionSurEvenementCombo(aParam) {
		GHtml.setDisplay(
			this.getNomInstance(this.identCombo),
			this.avecCombo() && !aParam.avecMessage,
		);
		GHtml.setDisplay(
			this.getNomInstance(this.identComboClasseGroupe),
			this.avecComboClasseGroupe() && !aParam.avecMessage,
		);
		GHtml.setDisplay(
			this.getNomInstance(this.identComboMembres),
			this.avecComboMembres() && !aParam.avecMessage,
		);
		GHtml.setDisplay(
			this.getNomInstance(this.identComboDelegues),
			this.avecComboDelegues() && !aParam.avecMessage,
		);
		GHtml.setDisplay(this.idUnSeulDestinataire, this.unSeulDestinataire);
		this.ListeRessources = aParam.listeRessourcesPourCommunication;
		this.listeDelegues = aParam.listeDelegues;
		if (!this.ListeRessources) {
			this.ListeRessources = new ObjetListeElements();
		}
		this._actualiserBoutonsCommunication();
		if (
			!aParam.avecMessage &&
			(this.existeRessource() ||
				([
					EGenreRessource.Responsable,
					EGenreRessource.Enseignant,
					EGenreRessource.Personnel,
				].includes(this.genre) &&
					(this.avecComboMembres() || this.avecComboDelegues())))
		) {
			GHtml.setDisplay(this.idMessage, false);
			GHtml.setDisplay(
				this.getNomInstance(this.identListe),
				!this.modeAffichage.affichageAllege,
			);
			GHtml.setDisplay(this.idBoutons, true);
			let lAvecCumul = false;
			if (this.genre === EGenreRessource.Classe) {
				const lGenreComboClasseGroupe =
					getGenreChoixEquipePedagogique.call(this);
				if (lGenreComboClasseGroupe === EGenreRessource.Eleve) {
					lAvecCumul = true;
				}
			}
			this.initialiserListe(this.getInstance(this.identListe), false);
			this.getInstance(this.identListe).setDonnees(
				new DonneesListe_Communication(this.ListeRessources, {
					masquerDonneesInutiles: [
						EGenreEspace.Parent,
						EGenreEspace.PrimParent,
						EGenreEspace.Eleve,
						EGenreEspace.Accompagnant,
						EGenreEspace.PrimAccompagnant,
						EGenreEspace.Tuteur,
					].includes(GEtatUtilisateur.GenreEspace),
					afficherAvecDiscussion: avecDroitGlobalDiscussion(),
					modeDiscussion: this.modeAffichage.modeDiscussion,
					afficherInformationDelegue:
						getGenreRequeteDelegue.call(this) !==
						EGenreRequete.ParentsDeleguesDeLaClasseX,
					avecCumul: lAvecCumul,
				}),
			);
		} else {
			GHtml.setDisplay(this.getNomInstance(this.identListe), false);
			GHtml.setDisplay(this.idBoutons, false);
			GHtml.setDisplay(this.idMessage, true);
			GHtml.setHtml(this.idMessage, this.getMessageAucuneRessource());
		}
		this.actualiserTaille();
	}
	existeRessource() {
		if (
			![
				EGenreEspace.Parent,
				EGenreEspace.PrimParent,
				EGenreEspace.Eleve,
			].includes(GEtatUtilisateur.GenreEspace)
		) {
			return true;
		} else {
			for (let I = 0; I < this.ListeRessources.count(); I++) {
				const lRessource = this.ListeRessources.get(I);
				if (lRessource.avecDiscussion || !!lRessource.email) {
					return true;
				}
			}
			return false;
		}
	}
	getMessageAucuneRessource() {
		switch (this.genre) {
			case EGenreRessource.Enseignant:
				return GEtatUtilisateur.GenreEspace === EGenreEspace.Eleve
					? GTraductions.getValeur("Messagerie.AucunProfesseurPourEleve")
					: GTraductions.getValeur("Messagerie.AucunProfesseur");
			case EGenreRessource.Personnel:
				return GEtatUtilisateur.GenreEspace === EGenreEspace.Eleve
					? GTraductions.getValeur("Messagerie.AucunPersonnelPourEleve")
					: GTraductions.getValeur("Messagerie.AucunPersonnel");
			case EGenreRessource.Eleve:
			case EGenreRessource.Responsable:
				return (
					(this.genre === EGenreRessource.Eleve
						? GTraductions.getValeur("Messagerie.InactiveParentsEleves")
						: GTraductions.getValeur("Messagerie.InactiveParents")) +
					" (" +
					GTraductions.getValeur("Onglet.LibelleLong")[
						EGenreOnglet.InfosPerso
					] +
					")"
				);
		}
		return "";
	}
	surAfficher() {
		if (this.getInstance(this.identTabs)) {
			this.getInstance(this.identTabs).selectOnglet(0);
		}
	}
	surFermer() {
		if (this.avecCombo() && this.getInstance(this.identCombo)) {
			this.getInstance(this.identCombo).reset();
		}
		if (
			this.avecComboClasseGroupe() &&
			this.getInstance(this.identComboClasseGroupe)
		) {
			this.getInstance(this.identComboClasseGroupe).reset();
		}
		if (this.avecComboMembres() && this.getInstance(this.identComboMembres)) {
			this.getInstance(this.identComboMembres).reset();
		}
		if (this.avecComboDelegues() && this.getInstance(this.identComboDelegues)) {
			this.getInstance(this.identComboDelegues).reset();
		}
		if (this.getInstance(this.identListe)) {
			this.getInstance(this.identListe).reset();
		}
	}
	envoyerEMail(aDestinataires) {
		$("#" + this.idDivEnvoyerEMail.escapeJQ()).html(
			GChaine.composerEmail(aDestinataires),
		);
		$("#" + this.idDivEnvoyerEMail.escapeJQ())
			.find("a")
			.get(0)
			.click();
	}
	actualiserTaille() {
		if (GNavigateur.isLayoutTactile) {
			$(".ClassCommunicationBordure").css("min-height", "1px");
			const lElement = GHtml.getElement(this.Nom + "_Res");
			const lHauteur = $(lElement).height() - this.hauteurTabOnglets - 5;
			$(".ClassCommunicationBordure").css("min-height", lHauteur + "px");
		}
	}
}
function _evenementSurBtnEdition(aGenre) {
	let lListeSelectionnee;
	switch (aGenre) {
		case this.genreBoutons.demarrerDiscussion: {
			let lAfficherInclureDelegue = false;
			if (this.avecComboDelegues()) {
				const lValeurComboDelegue = getGenreRequeteDelegue.call(this);
				if (!!lValeurComboDelegue) {
					lAfficherInclureDelegue =
						lValeurComboDelegue === EGenreRequete.ParentsDeLaClasseX;
				}
			}
			lListeSelectionnee = this._getListeSelectionnee();
			this.getInstance(this.identFenetreDiscussion).setDonnees({
				ListeRessources: this.ListeRessources,
				listeSelectionnee: lListeSelectionnee,
				listeDelegues: this.listeDelegues,
				avecCBInclureDelegues: lAfficherInclureDelegue,
				genreRessource: this.genre,
			});
			break;
		}
		case this.genreBoutons.discussionsCommunes:
			_ouvrirFenetreDiscussionsCommunes.call(this);
			break;
		case this.genreBoutons.information:
		case this.genreBoutons.sondage: {
			const lGenreOnglet = this.genre;
			let lAvecChoixAnonyme = lGenreOnglet === EGenreRessource.Classe;
			let lListeDestinatairesInfosSondages;
			const lGenres = [];
			if (lGenreOnglet === EGenreRessource.Classe) {
				const lGenreComboClasseGroupe =
					getGenreChoixEquipePedagogique.call(this);
				if (lGenreComboClasseGroupe === EGenreRessource.Eleve) {
					lAvecChoixAnonyme = false;
					lGenres.push(EGenreRessource.Enseignant);
					lGenres.push(EGenreRessource.Personnel);
					lListeSelectionnee = this._getListeSelectionnee();
					if (!!lListeSelectionnee && lListeSelectionnee.count() > 0) {
						lListeDestinatairesInfosSondages = new ObjetListeElements();
						lListeSelectionnee.parcourir((aEleve) => {
							if (!!aEleve && !!aEleve.listeRessources) {
								aEleve.listeRessources.parcourir((aRessourceEleve) => {
									if (
										!lListeDestinatairesInfosSondages.getElementParElement(
											aRessourceEleve,
										)
									) {
										lListeDestinatairesInfosSondages.addElement(
											aRessourceEleve,
										);
									}
								});
							}
						});
					}
				} else {
					lGenres.push(lGenreComboClasseGroupe);
				}
			} else {
				lGenres.push(lGenreOnglet);
				if (lGenreOnglet !== EGenreRessource.Enseignant) {
					lGenres.push(EGenreRessource.Enseignant);
				}
				if (lGenreOnglet !== EGenreRessource.Personnel) {
					lGenres.push(EGenreRessource.Personnel);
				}
			}
			if (!lListeDestinatairesInfosSondages) {
				lListeDestinatairesInfosSondages = this._getListeSelectionnee();
			}
			this.getInstance(this.identEditionActu).setOptionsFenetre({
				titre: GTraductions.getValeur(
					aGenre === this.genreBoutons.information
						? "actualites.creerInfo"
						: "actualites.creerSondage",
				),
			});
			this.getInstance(this.identEditionActu).setDonnees({
				donnee: null,
				creation: true,
				genresPublic: lGenres,
				avecChoixAnonyme:
					lAvecChoixAnonyme &&
					GApplication.droits.get(
						TypeDroits.fonctionnalites.gestionSondageAnonyme,
					),
				forcerAR: GApplication.droits.get(
					TypeDroits.fonctionnalites.forcerARInfos,
				),
				listePublic: lListeDestinatairesInfosSondages,
				genreReponse:
					aGenre === this.genreBoutons.information
						? TypeGenreReponseInternetActualite.AvecAR
						: TypeGenreReponseInternetActualite.ChoixUnique,
			});
			break;
		}
		case this.genreBoutons.email: {
			lListeSelectionnee = this._getListeSelectionnee();
			const lDestinataires = [];
			lListeSelectionnee.parcourir((D) => {
				if (!!D && !!D.email) {
					lDestinataires.push(D.email);
				}
			});
			this.envoyerEMail(lDestinataires.join(";"));
			break;
		}
		case this.genreBoutons.casier:
			UtilitaireDocument.ouvrirFenetreChoixTypeDeFichierADeposer.call(
				this,
				_ajouterNouveauFichierCasier.bind(this),
				{ idCtn: this.getNomInstance(this.identCombo) },
			);
			break;
		default:
			break;
	}
}
function _ouvrirFenetreDiscussionsCommunes() {
	const lListeSelectionnee = this._getListeSelectionnee();
	const lFenetreDiscussionCommune = ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_Discussion,
		{
			pere: this,
			initialiser: function (aInstance) {
				aInstance.setOptions({
					avecListeDiscussions: true,
					estDiscussionCommune: true,
				});
				aInstance.setOptionsFenetre({
					modale: true,
					largeur: 550 + 400,
					hauteur: 600,
				});
			},
		},
	);
	lFenetreDiscussionCommune.setDonnees({
		listeRessources: lListeSelectionnee,
		callBackApresDonneesMessagerie: function (aSansDiscussion) {
			if (aSansDiscussion) {
				lFenetreDiscussionCommune.fermer();
				let lLibelleRessources = "";
				if (!!lListeSelectionnee && lListeSelectionnee.count() > 0) {
					lLibelleRessources = lListeSelectionnee
						.getTableauLibelles()
						.join(" / ");
				}
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Information,
					message: GTraductions.getValeur("Messagerie.AucuneDiscussionAvec", [
						lLibelleRessources,
					]),
				});
			}
		},
		avecSelectionPremiereDiscussion: true,
	});
}
function _ajouterNouveauFichierCasier(aParams) {
	if (aParams.eltFichier) {
		const lListeFichiers = new ObjetListeElements();
		const lListeFichiersCloud = new ObjetListeElements();
		if (aParams.eltFichier.Genre === EGenreDocumentJoint.Cloud) {
			lListeFichiersCloud.addElement(aParams.eltFichier);
		} else {
			lListeFichiers.addElement(aParams.eltFichier);
		}
		const lListeLignes = new ObjetListeElements();
		const lDocCasier = new ObjetElement();
		lDocCasier.Numero = ObjetElement.getNumeroCreation();
		lDocCasier.Libelle = aParams.eltFichier.Libelle;
		lDocCasier.documentCasier = aParams.eltFichier;
		lDocCasier.memo = "";
		lDocCasier.listePersonnels = new ObjetListeElements();
		lDocCasier.listeProfesseurs = new ObjetListeElements();
		lDocCasier.listeMaitreStage = new ObjetListeElements();
		const lListeSelectionnee = this._getListeSelectionnee();
		const lListeDestinatairesCasier = new ObjetListeElements();
		let lCopie;
		lListeSelectionnee.parcourir((D) => {
			lCopie = new ObjetElement(D.getLibelle(), D.getNumero(), D.getGenre());
			lCopie.setEtat(EGenreEtat.Creation);
			lListeDestinatairesCasier.addElement(lCopie);
		});
		switch (this.genre) {
			case EGenreRessource.Enseignant:
				lDocCasier.listeProfesseurs = lListeDestinatairesCasier;
				break;
			case EGenreRessource.Personnel:
				lDocCasier.listePersonnels = lListeDestinatairesCasier;
				break;
			default:
				break;
		}
		lDocCasier.setEtat(EGenreEtat.Creation);
		lListeLignes.addElement(lDocCasier);
		new ObjetRequeteSaisieCasier(this, this.recupererDonnees)
			.addUpload({
				listeFichiers: lListeFichiers,
				listeDJCloud: lListeFichiersCloud,
			})
			.lancerRequete({
				genreSaisie: ObjetRequeteSaisieCasier.genreSaisie.saisieCasier,
				listeLignes: lListeLignes,
			});
	}
}
function _evenementEditionActu(aGenreBouton) {
	if (aGenreBouton === 1) {
		this.fermer();
	}
}
function getGenreRequeteDelegue() {
	let lGenreRequeteDelegue = null;
	if (this.avecComboDelegues()) {
		const lValeurSelectionnee = this.getInstance(
			this.identComboDelegues,
		).getSelection();
		if (!!lValeurSelectionnee) {
			lGenreRequeteDelegue = lValeurSelectionnee.getGenre();
		}
	}
	return lGenreRequeteDelegue;
}
function getGenreChoixEquipePedagogique() {
	let lGenreChoix = null;
	if (this.avecComboClasseGroupe()) {
		const lValeurSelectionnee = this.getInstance(
			this.identComboClasseGroupe,
		).getSelection();
		if (!!lValeurSelectionnee) {
			lGenreChoix = lValeurSelectionnee.getGenre();
		}
	}
	return lGenreChoix;
}
function _initialiserEditionActu(aInstance) {
	aInstance.setOptionsFenetre({
		modale: true,
		largeur: 800,
		hauteur: 660,
		listeBoutons: [
			GTraductions.getValeur("Annuler"),
			GTraductions.getValeur("Valider"),
		],
	});
}
function _evntFenetreDiscussion(aNumeroBouton, aParam) {
	if (aNumeroBouton === 1) {
		this.actionSurSaisieMessage(aParam.estMsgInitial);
	}
}
function _initialiserComboClasseGroupe(aInstance) {
	aInstance.setOptionsObjetSaisie({
		labelWAICellule: GTraductions.getValeur("AbsenceVS.comboRessource"),
		avecTriListeElements: false,
		hauteur: 16,
	});
}
function avecDroitGlobalDiscussion() {
	return !!GApplication.droits.get(TypeDroits.communication.avecDiscussion);
}
function _afficherAvecDiscussionDansTitre() {
	return (
		avecDroitGlobalDiscussion() &&
		[
			EGenreRessource.Enseignant,
			EGenreRessource.Personnel,
			EGenreRessource.Responsable,
			EGenreRessource.Eleve,
		].includes(this.genre)
	);
}
function _getHeight(aHauteur) {
	if (GNavigateur.isLayoutTactile) {
		return "height: 100%; min-height: " + aHauteur + "px; ";
	} else {
		return "height: " + aHauteur + "px; ";
	}
}
module.exports = ObjetFenetre_Communication;
