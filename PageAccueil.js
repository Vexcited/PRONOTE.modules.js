exports.ObjetAccueil = void 0;
const ObjetIdentite_Mobile_1 = require("ObjetIdentite_Mobile");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const ObjetUtilitaireAbsence_1 = require("ObjetUtilitaireAbsence");
const Enumere_Widget_1 = require("Enumere_Widget");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetIdentite_1 = require("ObjetIdentite");
const UtilitaireWidget_1 = require("UtilitaireWidget");
const ObjetMoteurAccueilPN_1 = require("ObjetMoteurAccueilPN");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetDiscussion_Mobile_1 = require("ObjetDiscussion_Mobile");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const ObjetFenetre_Message_1 = require("ObjetFenetre_Message");
const TypeCollectivite_1 = require("TypeCollectivite");
const ThemesCouleurs_1 = require("ThemesCouleurs");
const Enumere_Widget_2 = require("Enumere_Widget");
const AccessApp_1 = require("AccessApp");
const MethodesObjet_1 = require("MethodesObjet");
class ObjetAccueil extends ObjetIdentite_Mobile_1.ObjetIdentite_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.appMobile = (0, AccessApp_1.getApp)();
		this.parametresScoMobile = this.appMobile.getObjetParametres();
		this.etatUtilMobile = this.appMobile.getEtatUtilisateur();
		this.moteur = new ObjetMoteurAccueilPN_1.ObjetMoteurAccueil();
		this.donneesRecues = false;
		this.utilitaireAbsence =
			new ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence();
		this.premierChargement = true;
		this.idEcranPrincipal = this.Nom + "_ecranPrincipal";
		this.idEcranSecondaire = this.Nom + "_ecranSecondaire";
		if (this.etatUtilMobile.pourPrimaire()) {
			this.listeGenreWidgets = this.getListeWidgetsMobilePourPrimaire(
				this.etatUtilMobile.GenreEspace,
			);
		} else {
			this.listeGenreWidgets = this.getListeWidgetsMobile(
				this.etatUtilMobile.GenreEspace,
			);
		}
		this.construireDeclarationsWidgets();
		this.instancesWidgets = {};
	}
	construireDeclarationsWidgets() {
		this.donnees = {};
		for (let i = 0; i < this.listeGenreWidgets.length; i++) {
			const lObjDeclarationWidget = this.getDeclarationWidget(
				this.listeGenreWidgets[i],
			);
			if (!!lObjDeclarationWidget) {
				this.donnees[lObjDeclarationWidget.nomDonnees] = lObjDeclarationWidget;
			}
		}
	}
	getDonneesDeWidget(aGenre) {
		const lDeclarationWidget = this.getDeclarationWidget(aGenre);
		if (!!lDeclarationWidget && !!lDeclarationWidget.nomDonnees) {
			return this.donnees[lDeclarationWidget.nomDonnees];
		}
		return null;
	}
	surActualiser(aGenreWidget) {
		this.surEvenementWidget(
			aGenreWidget,
			Enumere_EvenementWidget_1.EGenreEvenementWidget.ActualiserWidget,
		);
	}
	setDonnees(
		aDonnees,
		aNumeroSemaineParDefaut,
		aDonneesRequete,
		aDateParDefaut,
	) {
		$.extend(true, this.donnees, aDonnees);
		this.donneesRecues = true;
		this.moteur.setSemaineSelectionnee(aNumeroSemaineParDefaut);
		this.moteur.setDateParDefaut(aDateParDefaut);
		this.donneesRequete = aDonneesRequete;
		this.numeroSemaineParDefaut = aNumeroSemaineParDefaut;
		const lScroll = $("#div").get(0).scrollTop;
		this.afficher();
		UtilitaireWidget_1.UtilitaireWidget.setParametres({
			avecFermer: false,
			avecToutVoir: true,
			avecCompteur: [
				Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
				Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
				Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
			].includes(this.etatUtilMobile.GenreEspace),
		});
		Object.keys(this.donnees).forEach((aKey) => {
			const lWidget = this.donnees[aKey];
			if (
				lWidget &&
				lWidget.construireInstance &&
				!!lWidget.existeWidget &&
				lWidget.existeWidget.call(this)
			) {
				lWidget.construireInstance(lWidget);
			}
		});
		this.etatUtilMobile.premierChargement = false;
		$("#div").get(0).scrollTop = lScroll;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnMessagePrimEleve: {
				event() {
					ObjetDiscussion_Mobile_1.ObjetDiscussion_Mobile.creerDiscussionEnFenetre();
				},
			},
			btnEcrireMairie: {
				getNode: function () {
					$(this.node).eventValidation(() => {
						UtilitaireMessagerie_1.UtilitaireMessagerie.creerDiscussionAvecMairie(
							ObjetFenetre_Message_1.ObjetFenetre_Message,
							aInstance,
						);
					});
				},
			},
			styleCollectivite() {
				const lEstDarkMode = ThemesCouleurs_1.ThemesCouleurs.getDarkMode();
				const lUrl =
					lEstDarkMode &&
					aInstance.parametresScoMobile.collectivite.logo.siteMobile.sombre
						? aInstance.parametresScoMobile.collectivite.logo.siteMobile.sombre
						: aInstance.parametresScoMobile.collectivite.logo.siteMobile.clair;
				return {
					"background-image": `url("./${lUrl}")`,
					"background-position": "center",
					"background-color": "transparent",
					"background-size": "contain",
					"background-repeat": "no-repeat",
					height: "10rem",
				};
			},
			nodeCollectivite: function () {
				if (
					aInstance.parametresScoMobile.collectivite &&
					aInstance.parametresScoMobile.collectivite.urlCollectivite
				) {
					$(this.node).eventValidation(() => {
						window.open(
							aInstance.parametresScoMobile.collectivite.urlCollectivite,
						);
					});
				}
			},
		});
	}
	construireAffichage() {
		if (!this.donneesRecues) {
			return "";
		}
		const lHtml = [];
		lHtml.push(
			'<div id="',
			this.idEcranPrincipal,
			'" class="global-mobile-container">',
		);
		switch (this.etatUtilMobile.GenreEspace) {
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimParent: {
				lHtml.push('<div class="bandeau-boutons">');
				if (
					this.appMobile.droits.get(
						ObjetDroitsPN_1.TypeDroits.absences.avecDeclarerUneAbsence,
					)
				) {
					lHtml.push(
						'<ie-bouton  ie-icon="icon_absences_prevue" class="theme-bt-accueil-primaire" onclick="',
						this.Nom,
						'.ajouterAbsence()">',
						ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.SaisirAbsenceParentPrim",
						),
						"</ie-bouton>",
					);
				}
				if (
					this.etatUtilMobile.Identification.ListeRessources &&
					this.etatUtilMobile.Identification.ListeRessources.count() > 0 &&
					this.appMobile.droits.get(
						ObjetDroitsPN_1.TypeDroits.communication.avecDiscussion,
					)
				) {
					lHtml.push(
						'<ie-bouton ie-icon="icon_carnet_liaison" class="theme-bt-accueil-primaire" onclick="',
						this.Nom,
						'.btnMessageCarnet()">',
						ObjetTraduction_1.GTraductions.getValeur(
							"fenetreCommunication.ecrireEnseignant",
						),
						"</ie-bouton>",
					);
					if (
						this.etatUtilMobile.Identification.ressource
							.destinatairePersonnelsMairie &&
						this.etatUtilMobile.Identification.ressource.destinatairePersonnelsMairie.count()
					) {
						lHtml.push(
							'  <ie-bouton ie-node="btnEcrireMairie.getNode" ie-icon="icon_mairie" class="theme-bt-accueil-primaire" title="',
							ObjetTraduction_1.GTraductions.getValeur(
								"fenetreCommunication.nouveauMessageMairie",
							),
							'">',
							ObjetTraduction_1.GTraductions.getValeur(
								"fenetreCommunication.ecrireMairie",
							),
							"</ie-bouton>",
						);
					}
				}
				lHtml.push("</div>");
				break;
			}
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve: {
				const lLibelleRaccourci =
					UtilitaireMessagerie_1.UtilitaireMessagerie.getLibelleRaccourciMessPrimEleve();
				if (lLibelleRaccourci) {
					lHtml.push(
						IE.jsx.str(
							"div",
							{ class: "bandeau-boutons messagerie" },
							IE.jsx.str(
								"ie-bouton",
								{
									"ie-model": "btnMessagePrimEleve",
									"ie-icon": "icon_discussion_cours",
									class: "theme-bt-accueil-primaire",
									"aria-haspopup": "dialog",
								},
								lLibelleRaccourci,
							),
						),
					);
				}
				break;
			}
		}
		const lAvecImageCollectivite =
			!this.appMobile.estPrimaire &&
			this.parametresScoMobile.collectivite &&
			"genreCollectivite" in this.parametresScoMobile.collectivite &&
			this.parametresScoMobile.collectivite.genreCollectivite !==
				TypeCollectivite_1.TypeCollectivite.TCL_Aucune &&
			this.parametresScoMobile.collectivite.logo &&
			this.parametresScoMobile.collectivite.logo.siteMobile;
		if (lAvecImageCollectivite) {
			lHtml.push(
				`<div class="p-top-l"><div ie-style="styleCollectivite" ie-node="nodeCollectivite" class="m-bottom-xl m-top-l"></div></div>`,
			);
		}
		for (let i = 0; i < this.listeGenreWidgets.length; i++) {
			const lDonnees = this.getDonneesDeWidget(this.listeGenreWidgets[i]);
			if (lDonnees) {
				lHtml.push(this.composeSection(lDonnees));
			}
		}
		lHtml.push("</div>");
		return lHtml.join("");
	}
	ajouterAbsence() {
		this.etatUtilMobile.setPage({
			Onglet: Enumere_Onglet_1.EGenreOnglet.VieScolaire_Recapitulatif,
			executerSaisieAbsenceParent: true,
			retourAccueil: true,
		});
		if (this.etatUtilMobile.getGenreOnglet()) {
			const lGenreOnglet = this.etatUtilMobile.getGenreOnglet();
			if (
				this.etatUtilMobile.listeOngletsInvisibles.indexOf(lGenreOnglet) === -1
			) {
				this.surEvenementWidget(
					null,
					Enumere_EvenementWidget_1.EGenreEvenementWidget.NavigationVersPage,
					{ genreOngletDest: lGenreOnglet },
				);
			}
		}
	}
	btnMessageCarnet() {
		ObjetDiscussion_Mobile_1.ObjetDiscussion_Mobile.creerCarnetDeLiaisonPrimParent();
	}
	composeSection(aWidget) {
		const lHtml = [];
		function _composeCorps(aAvecDonnees) {
			const lNomClasseWidget =
				Enumere_Widget_2.EGenreWidgetUtil.getNomClasseWidget(aWidget.genre);
			const liResult = [];
			liResult.push(
				'<article role="region" aria-labelledby="' +
					aWidget.id +
					'_TitreText" class="widget ' +
					" " +
					lNomClasseWidget +
					'">',
			);
			liResult.push(
				'<div id="' + aWidget.id + '_contenu" class="',
				"card-container",
				!aAvecDonnees ? " card-nodata" : "",
				'" tabindex="0">',
				"</div>",
				"</article>",
			);
			return liResult.join("");
		}
		if (
			!!aWidget &&
			!!aWidget.existeWidget &&
			aWidget.existeWidget.call(this)
		) {
			const lEstAvecDonnees = true;
			lHtml.push(_composeCorps(lEstAvecDonnees));
		}
		return lHtml.join("");
	}
	surToutVoir(aGenreWidget) {
		const lWidget = this.getDonneesDeWidget(aGenreWidget);
		const lPage = lWidget.getPage ? lWidget.getPage() : lWidget.page;
		if (!!lWidget.dateSelectionnee) {
			const lDateSelectionnee = lWidget.dateSelectionnee.call(this);
			if (!!lDateSelectionnee) {
				this.etatUtilMobile.setDerniereDate(lDateSelectionnee);
			}
		}
		if (!!lWidget.jourSelectionne) {
			this.etatUtilMobile.setNavigationDate(lWidget.jourSelectionne);
		}
		if (
			this.etatUtilMobile.listeOngletsInvisibles.indexOf(lPage.Onglet) === -1
		) {
			this.surEvenementWidget(
				aGenreWidget,
				Enumere_EvenementWidget_1.EGenreEvenementWidget.NavigationVersPage,
				{ genreOngletDest: lPage.Onglet, page: lPage },
			);
		}
	}
	surLienExterne(aGenreWidget) {
		const lWidget = this.getDonneesDeWidget(aGenreWidget);
		const lInfos = lWidget.infosURLExterne();
		if (lInfos !== undefined) {
			lInfos.callbackLien();
		}
	}
	surEvenementWidget(aGenreWidgetSource, aGenreEvenement, aDonnees) {
		switch (aGenreEvenement) {
			case Enumere_EvenementWidget_1.EGenreEvenementWidget.NavigationVersPage:
				this.callback.appel(aGenreWidgetSource, aGenreEvenement, aDonnees);
				break;
			case Enumere_EvenementWidget_1.EGenreEvenementWidget.SaisieWidget:
				this.callback.appel(aGenreWidgetSource, aGenreEvenement, aDonnees);
				break;
			case Enumere_EvenementWidget_1.EGenreEvenementWidget.AfficherExecutionQCM:
				this.callback.appel(aGenreWidgetSource, aGenreEvenement, aDonnees);
				break;
			case Enumere_EvenementWidget_1.EGenreEvenementWidget.ActualiserWidget:
				this.callback.appel(aGenreWidgetSource, aGenreEvenement, aDonnees);
				break;
		}
	}
	composeAucuneDonnees(aMessage) {
		return '<div class="no-events"><p>' + aMessage + "</p></div>";
	}
	getListeWidgetsMobilePourPrimaire(aGenreUtilisateur) {
		const result = [];
		switch (aGenreUtilisateur) {
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur:
				result.push(
					Enumere_Widget_1.EGenreWidget.penseBete,
					Enumere_Widget_1.EGenreWidget.RetourEspace,
					Enumere_Widget_1.EGenreWidget.voteElecMembreBureau,
					Enumere_Widget_1.EGenreWidget.documentsASigner,
					Enumere_Widget_1.EGenreWidget.lienUtile,
				);
				result.push(Enumere_Widget_1.EGenreWidget.TAFEtActivites);
				if (this.parametresScoMobile.activerBlog) {
					result.push(Enumere_Widget_1.EGenreWidget.blogFilActu);
				}
				result.push(
					Enumere_Widget_1.EGenreWidget.actualites,
					Enumere_Widget_1.EGenreWidget.agenda,
					Enumere_Widget_1.EGenreWidget.kiosque,
				);
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection:
				result.push(
					Enumere_Widget_1.EGenreWidget.penseBete,
					Enumere_Widget_1.EGenreWidget.RetourEspace,
					Enumere_Widget_1.EGenreWidget.voteElecMembreBureau,
					Enumere_Widget_1.EGenreWidget.documentsASigner,
					Enumere_Widget_1.EGenreWidget.lienUtile,
				);
				if (this.parametresScoMobile.activerBlog) {
					result.push(Enumere_Widget_1.EGenreWidget.blogFilActu);
				}
				result.push(
					Enumere_Widget_1.EGenreWidget.agenda,
					Enumere_Widget_1.EGenreWidget.incidents,
					Enumere_Widget_1.EGenreWidget.donneesVS,
					Enumere_Widget_1.EGenreWidget.registreAppel,
					Enumere_Widget_1.EGenreWidget.previsionnelAbsServiceAnnexe,
					Enumere_Widget_1.EGenreWidget.IntendanceExecute,
					Enumere_Widget_1.EGenreWidget.tachesSecretariatExecute,
				);
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimParent:
				result.push(
					Enumere_Widget_1.EGenreWidget.RetourEspace,
					Enumere_Widget_1.EGenreWidget.voteElecMembreBureau,
					Enumere_Widget_1.EGenreWidget.voteElecElecteur,
					Enumere_Widget_1.EGenreWidget.documentsASigner,
					Enumere_Widget_1.EGenreWidget.QCM,
					Enumere_Widget_1.EGenreWidget.evenementRappel,
					Enumere_Widget_1.EGenreWidget.TAFPrimaire,
					Enumere_Widget_1.EGenreWidget.vieScolaire,
					Enumere_Widget_1.EGenreWidget.competences,
					Enumere_Widget_1.EGenreWidget.actualites,
				);
				if (this.parametresScoMobile.activerBlog) {
					result.push(Enumere_Widget_1.EGenreWidget.blogFilActu);
				}
				result.push(
					Enumere_Widget_1.EGenreWidget.agenda,
					Enumere_Widget_1.EGenreWidget.activite,
					Enumere_Widget_1.EGenreWidget.lienUtile,
					Enumere_Widget_1.EGenreWidget.menuDeLaCantine,
					Enumere_Widget_1.EGenreWidget.partenaireFAST,
					Enumere_Widget_1.EGenreWidget.partenaireAgate,
				);
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve:
				result.push(
					Enumere_Widget_1.EGenreWidget.RetourEspace,
					Enumere_Widget_1.EGenreWidget.documentsASigner,
					Enumere_Widget_1.EGenreWidget.QCM,
					Enumere_Widget_1.EGenreWidget.TAFPrimaire,
					Enumere_Widget_1.EGenreWidget.competences,
				);
				if (this.parametresScoMobile.activerBlog) {
					result.push(Enumere_Widget_1.EGenreWidget.blogFilActu);
				}
				result.push(
					Enumere_Widget_1.EGenreWidget.kiosque,
					Enumere_Widget_1.EGenreWidget.activite,
					Enumere_Widget_1.EGenreWidget.lienUtile,
					Enumere_Widget_1.EGenreWidget.menuDeLaCantine,
				);
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant:
				result.push(
					Enumere_Widget_1.EGenreWidget.RetourEspace,
					Enumere_Widget_1.EGenreWidget.voteElecMembreBureau,
					Enumere_Widget_1.EGenreWidget.documentsASigner,
					Enumere_Widget_1.EGenreWidget.lienUtile,
					Enumere_Widget_1.EGenreWidget.TAFPrimaire,
				);
				if (this.parametresScoMobile.activerBlog) {
					result.push(Enumere_Widget_1.EGenreWidget.blogFilActu);
				}
				result.push(
					Enumere_Widget_1.EGenreWidget.competences,
					Enumere_Widget_1.EGenreWidget.vieScolaire,
					Enumere_Widget_1.EGenreWidget.EDT,
					Enumere_Widget_1.EGenreWidget.kiosque,
					Enumere_Widget_1.EGenreWidget.menuDeLaCantine,
				);
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimPeriscolaire:
				result.push(
					Enumere_Widget_1.EGenreWidget.RetourEspace,
					Enumere_Widget_1.EGenreWidget.lienUtile,
					Enumere_Widget_1.EGenreWidget.actualites,
					Enumere_Widget_1.EGenreWidget.agenda,
				);
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_PrimMairie:
				result.push(
					Enumere_Widget_1.EGenreWidget.RetourEspace,
					Enumere_Widget_1.EGenreWidget.documentsASigner,
					Enumere_Widget_1.EGenreWidget.lienUtile,
					Enumere_Widget_1.EGenreWidget.previsionnelAbsServiceAnnexe,
					Enumere_Widget_1.EGenreWidget.actualites,
					Enumere_Widget_1.EGenreWidget.agenda,
				);
				break;
			default:
				break;
		}
		return result;
	}
	getListeWidgetsMobile(aGenreUtilisateur) {
		const result = [];
		switch (aGenreUtilisateur) {
			case Enumere_Espace_1.EGenreEspace.Mobile_Eleve:
				result.push(
					Enumere_Widget_1.EGenreWidget.RetourEspace,
					Enumere_Widget_1.EGenreWidget.elections,
					Enumere_Widget_1.EGenreWidget.documentsASigner,
					Enumere_Widget_1.EGenreWidget.lienUtile,
					Enumere_Widget_1.EGenreWidget.partenaireCDI,
					Enumere_Widget_1.EGenreWidget.partenaireARD,
					Enumere_Widget_1.EGenreWidget.DS,
					Enumere_Widget_1.EGenreWidget.DSEvaluation,
					Enumere_Widget_1.EGenreWidget.QCM,
					Enumere_Widget_1.EGenreWidget.travailAFaire,
					Enumere_Widget_1.EGenreWidget.enseignementADistance,
					Enumere_Widget_1.EGenreWidget.EDT,
					Enumere_Widget_1.EGenreWidget.notes,
					Enumere_Widget_1.EGenreWidget.competences,
					Enumere_Widget_1.EGenreWidget.vieScolaire,
					Enumere_Widget_1.EGenreWidget.agenda,
					Enumere_Widget_1.EGenreWidget.kiosque,
				);
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Parent:
				result.push(
					Enumere_Widget_1.EGenreWidget.RetourEspace,
					Enumere_Widget_1.EGenreWidget.voteElecMembreBureau,
					Enumere_Widget_1.EGenreWidget.voteElecElecteur,
					Enumere_Widget_1.EGenreWidget.documentsASigner,
					Enumere_Widget_1.EGenreWidget.elections,
					Enumere_Widget_1.EGenreWidget.lienUtile,
					Enumere_Widget_1.EGenreWidget.partenaireCDI,
					Enumere_Widget_1.EGenreWidget.partenaireARD,
					Enumere_Widget_1.EGenreWidget.partenaireAgate,
					Enumere_Widget_1.EGenreWidget.DS,
					Enumere_Widget_1.EGenreWidget.DSEvaluation,
					Enumere_Widget_1.EGenreWidget.travailAFaire,
					Enumere_Widget_1.EGenreWidget.enseignementADistance,
					Enumere_Widget_1.EGenreWidget.vieScolaire,
					Enumere_Widget_1.EGenreWidget.EDT,
					Enumere_Widget_1.EGenreWidget.notes,
					Enumere_Widget_1.EGenreWidget.competences,
					Enumere_Widget_1.EGenreWidget.agenda,
					Enumere_Widget_1.EGenreWidget.kiosque,
				);
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Professeur:
				result.push(
					Enumere_Widget_1.EGenreWidget.penseBete,
					Enumere_Widget_1.EGenreWidget.RetourEspace,
					Enumere_Widget_1.EGenreWidget.voteElecMembreBureau,
					Enumere_Widget_1.EGenreWidget.documentsASigner,
					Enumere_Widget_1.EGenreWidget.elections,
					Enumere_Widget_1.EGenreWidget.lienUtile,
					Enumere_Widget_1.EGenreWidget.partenaireCDI,
					Enumere_Widget_1.EGenreWidget.partenaireARD,
					Enumere_Widget_1.EGenreWidget.partenaireAgate,
					Enumere_Widget_1.EGenreWidget.EDT,
					Enumere_Widget_1.EGenreWidget.RemplacementsEnseignants,
					Enumere_Widget_1.EGenreWidget.coursNonAssures,
					Enumere_Widget_1.EGenreWidget.personnelsAbsents,
					Enumere_Widget_1.EGenreWidget.appelNonFait,
					Enumere_Widget_1.EGenreWidget.CDTNonSaisi,
					Enumere_Widget_1.EGenreWidget.IntendanceExecute,
					Enumere_Widget_1.EGenreWidget.maintenanceInfoExecute,
					Enumere_Widget_1.EGenreWidget.agenda,
					Enumere_Widget_1.EGenreWidget.kiosque,
					Enumere_Widget_1.EGenreWidget.exclusions,
				);
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Administrateur:
				result.push(
					Enumere_Widget_1.EGenreWidget.penseBete,
					Enumere_Widget_1.EGenreWidget.RetourEspace,
					Enumere_Widget_1.EGenreWidget.voteElecMembreBureau,
					Enumere_Widget_1.EGenreWidget.documentsASigner,
					Enumere_Widget_1.EGenreWidget.elections,
					Enumere_Widget_1.EGenreWidget.lienUtile,
					Enumere_Widget_1.EGenreWidget.partenaireCDI,
					Enumere_Widget_1.EGenreWidget.partenaireARD,
					Enumere_Widget_1.EGenreWidget.partenaireAgate,
					Enumere_Widget_1.EGenreWidget.agenda,
					Enumere_Widget_1.EGenreWidget.incidents,
					Enumere_Widget_1.EGenreWidget.donneesVS,
					Enumere_Widget_1.EGenreWidget.donneesProfs,
					Enumere_Widget_1.EGenreWidget.modificationEDT,
					Enumere_Widget_1.EGenreWidget.coursNonAssures,
					Enumere_Widget_1.EGenreWidget.personnelsAbsents,
					Enumere_Widget_1.EGenreWidget.connexionsEnCours,
					Enumere_Widget_1.EGenreWidget.IntendanceExecute,
					Enumere_Widget_1.EGenreWidget.tachesSecretariatExecute,
					Enumere_Widget_1.EGenreWidget.maintenanceInfoExecute,
					Enumere_Widget_1.EGenreWidget.exclusions,
				);
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Etablissement:
				result.push(
					Enumere_Widget_1.EGenreWidget.penseBete,
					Enumere_Widget_1.EGenreWidget.RetourEspace,
					Enumere_Widget_1.EGenreWidget.voteElecMembreBureau,
					Enumere_Widget_1.EGenreWidget.documentsASigner,
					Enumere_Widget_1.EGenreWidget.elections,
					Enumere_Widget_1.EGenreWidget.EDT,
					Enumere_Widget_1.EGenreWidget.lienUtile,
					Enumere_Widget_1.EGenreWidget.partenaireCDI,
					Enumere_Widget_1.EGenreWidget.partenaireARD,
					Enumere_Widget_1.EGenreWidget.partenaireAgate,
					Enumere_Widget_1.EGenreWidget.incidents,
					Enumere_Widget_1.EGenreWidget.coursNonAssures,
					Enumere_Widget_1.EGenreWidget.personnelsAbsents,
					Enumere_Widget_1.EGenreWidget.appelNonFait,
					Enumere_Widget_1.EGenreWidget.IntendanceExecute,
					Enumere_Widget_1.EGenreWidget.tachesSecretariatExecute,
					Enumere_Widget_1.EGenreWidget.maintenanceInfoExecute,
					Enumere_Widget_1.EGenreWidget.agenda,
				);
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant:
				result.push(
					Enumere_Widget_1.EGenreWidget.RetourEspace,
					Enumere_Widget_1.EGenreWidget.voteElecMembreBureau,
					Enumere_Widget_1.EGenreWidget.elections,
					Enumere_Widget_1.EGenreWidget.documentsASigner,
					Enumere_Widget_1.EGenreWidget.lienUtile,
					Enumere_Widget_1.EGenreWidget.partenaireARD,
					Enumere_Widget_1.EGenreWidget.partenaireAgate,
					Enumere_Widget_1.EGenreWidget.DS,
					Enumere_Widget_1.EGenreWidget.DSEvaluation,
					Enumere_Widget_1.EGenreWidget.travailAFaire,
					Enumere_Widget_1.EGenreWidget.enseignementADistance,
					Enumere_Widget_1.EGenreWidget.vieScolaire,
					Enumere_Widget_1.EGenreWidget.EDT,
					Enumere_Widget_1.EGenreWidget.notes,
					Enumere_Widget_1.EGenreWidget.competences,
					Enumere_Widget_1.EGenreWidget.agenda,
					Enumere_Widget_1.EGenreWidget.kiosque,
				);
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Entreprise:
				result.push(
					Enumere_Widget_1.EGenreWidget.RetourEspace,
					Enumere_Widget_1.EGenreWidget.documentsASigner,
					Enumere_Widget_1.EGenreWidget.actualites,
					Enumere_Widget_1.EGenreWidget.agenda,
				);
				break;
			case Enumere_Espace_1.EGenreEspace.Mobile_Tuteur:
				break;
			default:
				break;
		}
		return result;
	}
	getDeclarationWidget(aGenreWidget) {
		this.moteur.setDonnees(this.donnees);
		let result;
		switch (aGenreWidget) {
			case Enumere_Widget_1.EGenreWidget.EDT:
			case Enumere_Widget_1.EGenreWidget.activite:
			case Enumere_Widget_1.EGenreWidget.actualites:
			case Enumere_Widget_1.EGenreWidget.aide:
			case Enumere_Widget_1.EGenreWidget.agenda:
			case Enumere_Widget_1.EGenreWidget.appelNonFait:
			case Enumere_Widget_1.EGenreWidget.carnetDeCorrespondance:
			case Enumere_Widget_1.EGenreWidget.casier:
			case Enumere_Widget_1.EGenreWidget.CDTNonSaisi:
			case Enumere_Widget_1.EGenreWidget.conseilDeClasse:
			case Enumere_Widget_1.EGenreWidget.competences:
			case Enumere_Widget_1.EGenreWidget.connexionsEnCours:
			case Enumere_Widget_1.EGenreWidget.coursNonAssures:
			case Enumere_Widget_1.EGenreWidget.DS:
			case Enumere_Widget_1.EGenreWidget.DSEvaluation:
			case Enumere_Widget_1.EGenreWidget.donneesProfs:
			case Enumere_Widget_1.EGenreWidget.donneesVS:
			case Enumere_Widget_1.EGenreWidget.registreAppel:
			case Enumere_Widget_1.EGenreWidget.previsionnelAbsServiceAnnexe:
			case Enumere_Widget_1.EGenreWidget.elections:
			case Enumere_Widget_1.EGenreWidget.enseignementADistance:
			case Enumere_Widget_1.EGenreWidget.exclusions:
			case Enumere_Widget_1.EGenreWidget.incidents:
			case Enumere_Widget_1.EGenreWidget.IntendanceExecute:
			case Enumere_Widget_1.EGenreWidget.maintenanceInfoExecute:
			case Enumere_Widget_1.EGenreWidget.kiosque:
			case Enumere_Widget_1.EGenreWidget.lienUtile:
			case Enumere_Widget_1.EGenreWidget.menuDeLaCantine:
			case Enumere_Widget_1.EGenreWidget.notes:
			case Enumere_Widget_1.EGenreWidget.partenaireCDI:
			case Enumere_Widget_1.EGenreWidget.partenaireAgate:
			case Enumere_Widget_1.EGenreWidget.partenaireARD:
			case Enumere_Widget_1.EGenreWidget.partenaireFAST:
			case Enumere_Widget_1.EGenreWidget.penseBete:
			case Enumere_Widget_1.EGenreWidget.personnelsAbsents:
			case Enumere_Widget_1.EGenreWidget.QCM:
			case Enumere_Widget_1.EGenreWidget.ressources:
			case Enumere_Widget_1.EGenreWidget.ressourcePedagogique:
			case Enumere_Widget_1.EGenreWidget.RetourEspace:
			case Enumere_Widget_1.EGenreWidget.tableauDeBord:
			case Enumere_Widget_1.EGenreWidget.tachesSecretariatExecute:
			case Enumere_Widget_1.EGenreWidget.travailAFaire:
			case Enumere_Widget_1.EGenreWidget.TAFARendre:
			case Enumere_Widget_1.EGenreWidget.TAFPrimaire:
			case Enumere_Widget_1.EGenreWidget.vieScolaire:
			case Enumere_Widget_1.EGenreWidget.blogFilActu:
			case Enumere_Widget_1.EGenreWidget.evenementRappel:
			case Enumere_Widget_1.EGenreWidget.TAFEtActivites:
			case Enumere_Widget_1.EGenreWidget.modificationEDT:
			case Enumere_Widget_1.EGenreWidget.RemplacementsEnseignants:
			case Enumere_Widget_1.EGenreWidget.voteElecMembreBureau:
			case Enumere_Widget_1.EGenreWidget.voteElecElecteur:
			case Enumere_Widget_1.EGenreWidget.documentsASigner:
				result = this.moteur.getDeclarationWidget(aGenreWidget);
				break;
			default:
				break;
		}
		if (result) {
			if (!result.construire) {
				result.construire = function () {
					return "";
				};
			}
			if (result.classWidget !== undefined) {
				result.construireInstance = this._construireInstanceWidget.bind(this);
				const lFonctionExisteeWidget = result.existeWidget;
				result.existeWidget = () => {
					return (
						!!result.classWidget &&
						(!lFonctionExisteeWidget || lFonctionExisteeWidget.call(this))
					);
				};
			}
		}
		return result;
	}
	_construireInstanceWidget(aDonneesWidget) {
		if (this.instancesWidgets[aDonneesWidget.genre]) {
			this.instancesWidgets[aDonneesWidget.genre].free();
		}
		try {
			this.instancesWidgets[aDonneesWidget.genre] =
				ObjetIdentite_1.Identite.creerInstance(aDonneesWidget.classWidget, {
					pere: this,
					evenement: this.surEvenementWidget,
				});
		} catch (e) {
			this.instancesWidgets[aDonneesWidget.genre] = null;
			console.error(e);
			return;
		}
		Object.assign(this.instancesWidgets[aDonneesWidget.genre], {
			donneesRequete: this.donneesRequete,
			numeroSemaineParDefaut: this.numeroSemaineParDefaut,
		});
		try {
			this.instancesWidgets[aDonneesWidget.genre].construire({
				instance: this,
				donnees: aDonneesWidget,
				construireWidget: this._construireWidget.bind(this),
			});
		} catch (e) {
			console.error(e);
		}
	}
	_construireWidget(aParams) {
		const lThis = this;
		const lInstanceWidget = this.instancesWidgets[aParams.genre];
		lInstanceWidget.controleur.boutons = {
			surToutVoir(aGenreWidget) {
				$(this.node).eventValidation(() => {
					lThis.surToutVoir(aGenreWidget);
				});
			},
			surLienExterne(aGenreWidget) {
				$(this.node).eventValidation(() => {
					lThis.surLienExterne(aGenreWidget);
				});
			},
			surActualiser(aGenreWidget) {
				$(this.node).eventValidation(() => {
					lThis.surActualiser(aGenreWidget);
				});
			},
		};
		ObjetHtml_1.GHtml.setHtml(
			aParams.id + "_contenu",
			UtilitaireWidget_1.UtilitaireWidget.composeWidget(aParams),
			{ instance: lInstanceWidget || this },
		);
		UtilitaireWidget_1.UtilitaireWidget.actualiserFooter(aParams);
		UtilitaireWidget_1.UtilitaireWidget.afficherMasquerListe(aParams);
	}
}
exports.ObjetAccueil = ObjetAccueil;
