exports.ObjetInterfaceMobile = void 0;
require("ObjetEntete.js");
require("UtilitaireQCM.js");
require("IEHtml.SelecFile.js");
require("IEHtml.SyntheseVocale.js");
const ObjetTraduction_1 = require("ObjetTraduction");
const _InterfaceMobile_1 = require("_InterfaceMobile");
const _ObjetEntete_1 = require("_ObjetEntete");
const ObjetDate_1 = require("ObjetDate");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const UtilitaireContactVieScolaire_Mobile_1 = require("UtilitaireContactVieScolaire_Mobile");
const ThemesPrimaire_1 = require("ThemesPrimaire");
const DeclarationOngletsMobile_1 = require("DeclarationOngletsMobile");
const TypeEtatExecutionQCMPourRepondant_1 = require("TypeEtatExecutionQCMPourRepondant");
const InterfaceBandeauPied = require("InterfaceBandeauPied");
const Enumere_Commande_1 = require("Enumere_Commande");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const UtilitairePartenaire_1 = require("UtilitairePartenaire");
const InterfacePageMenuOnglets = require("InterfacePageMenuOnglets");
const ObjetEntete_1 = require("ObjetEntete");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetRequeteAccesSecurisePageProfil_1 = require("ObjetRequeteAccesSecurisePageProfil");
const ObjetRequeteNavigation_1 = require("ObjetRequeteNavigation");
class ObjetInterfaceMobile extends _InterfaceMobile_1._InterfaceMobile {
	constructor(...aParams) {
		super(...aParams);
		this.application = GApplication;
		this.GenreOnglet = Enumere_Onglet_1.EGenreOnglet.Accueil;
		this.genreOngletPrecedent = null;
		this.OngletsAvecRessourceParent = [
			Enumere_Onglet_1.EGenreOnglet.Accueil,
			Enumere_Onglet_1.EGenreOnglet.EmploiDuTemps,
			Enumere_Onglet_1.EGenreOnglet.ListeEleves,
			Enumere_Onglet_1.EGenreOnglet.CDT_Contenu,
			Enumere_Onglet_1.EGenreOnglet.CDT_TAF,
			Enumere_Onglet_1.EGenreOnglet.Releve,
			Enumere_Onglet_1.EGenreOnglet.Rencontre,
			Enumere_Onglet_1.EGenreOnglet.Messagerie,
			Enumere_Onglet_1.EGenreOnglet.Bulletins,
			Enumere_Onglet_1.EGenreOnglet.EquipePedagogique,
			Enumere_Onglet_1.EGenreOnglet.DernieresNotes,
			Enumere_Onglet_1.EGenreOnglet.VieScolaire_Recapitulatif,
			Enumere_Onglet_1.EGenreOnglet.DocumentsATelecharger,
			Enumere_Onglet_1.EGenreOnglet.BulletinCompetences,
			Enumere_Onglet_1.EGenreOnglet.ReleveDeCompetences,
			Enumere_Onglet_1.EGenreOnglet.BulletinAnneesPrec_Note,
			Enumere_Onglet_1.EGenreOnglet.BulletinAnneesPrec_Competence,
			Enumere_Onglet_1.EGenreOnglet.DernieresEvaluations,
			Enumere_Onglet_1.EGenreOnglet.SaisieOrientation,
			Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsEleve,
		];
		this.OngletsAvecRessourceEtablissement = [
			Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsClasse,
			Enumere_Onglet_1.EGenreOnglet.ListeEleves,
		];
		this.setOptions({
			InterfacePageMenuOnglets: InterfacePageMenuOnglets,
			ObjetEnteteMobile: ObjetEntete_1.ObjetEnteteMobile,
		});
	}
	getGenrePremierOngletPublie() {
		const LTabGenresActifs = [];
		for (
			let i = 0;
			i < this.application.getEtatUtilisateur().listeOnglets.count();
			i++
		) {
			let lOngletTest = this.application
				.getEtatUtilisateur()
				.listeOnglets.get(i);
			if (
				!this.application
					.getEtatUtilisateur()
					.listeOngletsInvisibles.includes(lOngletTest.getGenre()) &&
				lOngletTest.getGenre() !== Enumere_Onglet_1.EGenreOnglet.Accueil
			) {
				LTabGenresActifs.push(lOngletTest.getGenre());
				if (
					lOngletTest.onglet &&
					MethodesObjet_1.MethodesObjet.isNumeric(
						lOngletTest.onglet.getGenre(),
					) &&
					LTabGenresActifs.includes(lOngletTest.onglet.getGenre())
				) {
					LTabGenresActifs.splice(
						$.inArray(lOngletTest.onglet.getGenre(), LTabGenresActifs),
						1,
					);
				}
			}
		}
		let lPremierOngletPublie = null;
		for (let i = 0; i < LTabGenresActifs.length; i++) {
			if (
				!this.application
					.getEtatUtilisateur()
					.listeOngletsInvisibles.includes(LTabGenresActifs[i]) &&
				LTabGenresActifs[i] !== Enumere_Onglet_1.EGenreOnglet.Accueil
			) {
				lPremierOngletPublie = this.application
					.getEtatUtilisateur()
					.listeOnglets.getElementParGenre(LTabGenresActifs[i]);
				break;
			}
		}
		let lGenrePremierOngletPublie = -1;
		if (lPremierOngletPublie !== null && lPremierOngletPublie !== undefined) {
			lGenrePremierOngletPublie = lPremierOngletPublie.getGenre();
		}
		return lGenrePremierOngletPublie;
	}
	setDonnees() {
		if (
			UtilitaireContactVieScolaire_Mobile_1.UtilitaireContactVieScolaire_Mobile
		) {
			UtilitaireContactVieScolaire_Mobile_1.UtilitaireContactVieScolaire_Mobile.declarer();
		}
		this.application.donneesCentraleNotifications.initSurInterfaceDisponible();
		if (!!this.IdentBandeauPied) {
			this.getInstance(this.IdentBandeauPied).setDonnees();
		}
	}
	construireInstances() {
		this._construireInstances();
	}
	changementMembre(aMembre) {
		const lIndex = this.getListeRessources().getIndiceParNumeroEtGenre(
			aMembre.getNumero(),
		);
		if (lIndex !== undefined) {
			this.changementRessource(lIndex);
		}
	}
	changementRessource(aIndex) {
		const lElement = this.getListeRessources().get(aIndex);
		if (
			this.application.getEtatUtilisateur().GenreEspace ===
			Enumere_Espace_1.EGenreEspace.Mobile_Etablissement
		) {
			this.application.getEtatUtilisateur().setClasse(lElement);
		} else if (
			[
				Enumere_Espace_1.EGenreEspace.Mobile_Parent,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
				Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
				Enumere_Espace_1.EGenreEspace.Mobile_Tuteur,
			].includes(this.application.getEtatUtilisateur().GenreEspace)
		) {
			this.application
				.getEtatUtilisateur()
				.setNumeroEleve(lElement.getNumero());
			this.getInstance(this.identEnteteMobile).updatePhoto();
			if (this.getInstance(this.idMenuOnglets)) {
				this.getInstance(this.idMenuOnglets).initialiser();
			}
		}
		this.evenementSurOnglet(
			this.application.getEtatUtilisateur().getGenreOnglet(),
			true,
			false,
			this.application.getEtatUtilisateur().getGenreAffichage(),
		);
	}
	avecChangementRessource() {
		return (
			[
				Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
				Enumere_Espace_1.EGenreEspace.Mobile_Parent,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
				Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
				Enumere_Espace_1.EGenreEspace.Mobile_Tuteur,
			].includes(this.application.getEtatUtilisateur().GenreEspace) &&
			this.application
				.getEtatUtilisateur()
				.Identification.ListeRessources.count() > 1
		);
	}
	getListeRessources() {
		let result;
		if (
			this.application.getEtatUtilisateur().GenreEspace ===
			Enumere_Espace_1.EGenreEspace.Mobile_Etablissement
		) {
			result = this.application
				.getEtatUtilisateur()
				.getListeClasses({ avecClasse: true, uniquementClasseEnseignee: true });
		} else if (
			[
				Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
			].includes(this.application.getEtatUtilisateur().GenreEspace)
		) {
			result = this.application
				.getEtatUtilisateur()
				.getListeClasses({
					avecClasse: true,
					avecGroupe: true,
					sansClasseDeRegroupement: true,
				});
		} else if (
			[
				Enumere_Espace_1.EGenreEspace.Mobile_Parent,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
				Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
				Enumere_Espace_1.EGenreEspace.Mobile_Tuteur,
			].includes(this.application.getEtatUtilisateur().GenreEspace)
		) {
			result =
				this.application.getEtatUtilisateur().Identification.ListeRessources;
		} else {
			result = new ObjetListeElements_1.ObjetListeElements();
		}
		return result;
	}
	getGenreOnglet() {
		return Enumere_Onglet_1.EGenreOnglet;
	}
	getGenreOngletAccueil() {
		return Enumere_Onglet_1.EGenreOnglet.Accueil;
	}
	evenementPageMobile(aParam) {
		let lQCMRevision;
		let lEspaceQCMConsult;
		let lEstQCMExecutable;
		switch (aParam.genreOnglet) {
			case Enumere_Onglet_1.EGenreOnglet.Accueil:
			case Enumere_Onglet_1.EGenreOnglet.CDT_TAF:
			case Enumere_Onglet_1.EGenreOnglet.CDT_Contenu:
			case Enumere_Onglet_1.EGenreOnglet.EmploiDuTemps:
			case Enumere_Onglet_1.EGenreOnglet.DernieresNotes:
			case Enumere_Onglet_1.EGenreOnglet.DernieresEvaluations:
			case Enumere_Onglet_1.EGenreOnglet.RessourcePedagogique:
				if (aParam.executionQCM) {
					lQCMRevision =
						!aParam.executionQCM.estLieADevoir &&
						!aParam.executionQCM.estLieAEvaluation &&
						!aParam.executionQCM.estUnTAF;
					lEstQCMExecutable =
						(aParam.executionQCM.etatCloture === undefined ||
							aParam.executionQCM.etatCloture ===
								TypeEtatExecutionQCMPourRepondant_1
									.TypeEtatExecutionQCMPourRepondant.EQR_EnCours) &&
						!lQCMRevision;
					lEspaceQCMConsult =
						[
							Enumere_Espace_1.EGenreEspace.Mobile_Parent,
							Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
							Enumere_Espace_1.EGenreEspace.Mobile_Tuteur,
						].includes(this.application.getEtatUtilisateur().GenreEspace) ||
						(aParam.executionQCM.estUneActivite &&
							[
								Enumere_Espace_1.EGenreEspace.PrimParent,
								Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
							].includes(this.application.getEtatUtilisateur().GenreEspace));
					if (lEspaceQCMConsult && lEstQCMExecutable) {
						this.application
							.getMessage()
							.afficher({
								message: ObjetTraduction_1.GTraductions.getValeur(
									"ExecutionQCM.DepuisEspaceEleve",
								),
							});
					} else {
						if (
							[Enumere_Espace_1.EGenreEspace.Mobile_PrimParent].includes(
								this.application.getEtatUtilisateur().GenreEspace,
							) &&
							lEstQCMExecutable
						) {
							this.application.getMessage().afficher({
								message: ObjetTraduction_1.GTraductions.getValeur(
									"ExecutionQCM.DepuisEspaceParent",
								),
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								callback: (aGenreAction) => {
									if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
										this.evenementSurOnglet(
											Enumere_Onglet_1.EGenreOnglet.QCM_Reponse,
										);
										this.Instances[this.identPageMobile].setDonnees(
											aParam,
											aParam.genreOnglet,
										);
									}
								},
							});
						} else {
							this.evenementSurOnglet(
								Enumere_Onglet_1.EGenreOnglet.QCM_Reponse,
							);
							this.Instances[this.identPageMobile].setDonnees(
								aParam,
								aParam.genreOnglet,
							);
						}
					}
				} else if (
					aParam.genreOnglet === Enumere_Onglet_1.EGenreOnglet.Accueil
				) {
					this.evenementSurOnglet(aParam.genreOngletDest);
				}
				break;
			case Enumere_Onglet_1.EGenreOnglet.QCM_Reponse:
				this.evenementSurOnglet(aParam.genreOngletPrec, true, false);
				break;
		}
	}
	evenementEnteteMobile(aGenreBoutonMobile) {
		switch (aGenreBoutonMobile) {
			case _ObjetEntete_1.EGenreCommandeMobile.SeDeconnecter: {
				break;
			}
			case _ObjetEntete_1.EGenreCommandeMobile.Valider: {
				const lInstanceAffichage = this.getInstance(this.identPageMobile);
				if (lInstanceAffichage && lInstanceAffichage.valider) {
					lInstanceAffichage.valider(true);
				}
				break;
			}
			case _ObjetEntete_1.EGenreCommandeMobile.Accueil:
				if (this.application.getEtatUtilisateur().avecPageAccueil()) {
					this.getInstance(this.idMenuOnglets).surClickAccueil();
				}
				break;
			case _ObjetEntete_1.EGenreCommandeMobile.MenuOnglets:
				this.ouvrirMenuOnglet();
				break;
			default:
				break;
		}
	}
	async evenementAvantAffichageOnglet(aGenreOnglet, aGenreOngletPrec) {
		if (this.application.getEtatUtilisateur().pourThemePrimaire()) {
			if (aGenreOnglet === Enumere_Onglet_1.EGenreOnglet.Accueil) {
				$("#" + this.application.getIdConteneur()).addClass(
					ThemesPrimaire_1.GThemesPrimaire.getTheme(),
				);
			} else {
				$("#" + this.application.getIdConteneur()).removeClass(
					ThemesPrimaire_1.GThemesPrimaire.getTheme(),
				);
			}
		}
		await new ObjetRequeteNavigation_1.ObjetRequeteNavigation(
			this,
		).lancerRequete(aGenreOnglet, aGenreOngletPrec);
	}
	rafraichirOnglet() {
		if (
			!this.getEtatSaisie() &&
			[Enumere_Onglet_1.EGenreOnglet.Accueil].includes(this.GenreOnglet)
		) {
			this.actionSurEvenementOnglet();
		}
	}
	actionSurRecupererDonnees() {
		this.setEtatSaisie(false);
		this.application
			.getEtatUtilisateur()
			.setDerniereDate(
				this.application.getDateDemo()
					? this.application.getDateDemo()
					: ObjetDate_1.GDate.getDateCourante(),
			);
		this.GenreOnglet = this.application.getEtatUtilisateur().getGenreOnglet();
		if (this.GenreOnglet === null) {
			if (this.application.getEtatUtilisateur().avecPageAccueil()) {
				this.GenreOnglet = this.getGenreOngletAccueil();
			} else {
				this.GenreOnglet = this.getGenrePremierOngletPublie();
			}
		}
		if (this.GenreOnglet === this.getGenreOngletAccueil()) {
			this.getInstance(this.idMenuOnglets).surClickAccueil();
		} else {
			this.evenementSurOnglet(this.GenreOnglet, true, true);
		}
	}
	_getConstructeurOnglet(aGenreOnglet, aParamsConstructeur) {
		return DeclarationOngletsMobile_1.DeclarationOngletsMobile.creerOnglet(
			aGenreOnglet,
			aParamsConstructeur,
		);
	}
	ajouterBandeauPied() {
		return this.add(InterfaceBandeauPied, this.evenementCommande);
	}
	evenementCommande(aParam) {
		switch (aParam.genreCmd) {
			case Enumere_Commande_1.EGenreCommande.Profil: {
				this.evenementSurAccesProfil();
				break;
			}
		}
	}
	evenementSurAccesProfil() {
		UtilitairePartenaire_1.TUtilitairePartenaire.ouvrirPatience();
		if (
			ObjetRequeteAccesSecurisePageProfil_1.ObjetRequeteAccesSecurisePageProfil
		) {
			new ObjetRequeteAccesSecurisePageProfil_1.ObjetRequeteAccesSecurisePageProfil(
				this,
				this.actionSurRequetePageProfil,
			).lancerRequete();
		}
	}
	actionSurRequetePageProfil(aTitre, aMessage, aUrl) {
		if (aMessage) {
			UtilitairePartenaire_1.TUtilitairePartenaire.fermerPatience();
			this.application
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					titre: aTitre,
					message: aMessage,
				});
		} else if (aUrl) {
			UtilitairePartenaire_1.TUtilitairePartenaire.ouvrirUrl(aUrl);
		} else {
			UtilitairePartenaire_1.TUtilitairePartenaire.fermerPatience();
		}
	}
}
exports.ObjetInterfaceMobile = ObjetInterfaceMobile;
