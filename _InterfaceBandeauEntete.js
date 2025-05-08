exports._ObjetAffichageBandeauEntete = void 0;
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const Enumere_Event_1 = require("Enumere_Event");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetMenuPrincipal_1 = require("ObjetMenuPrincipal");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetWAI_1 = require("ObjetWAI");
const ToucheClavier_1 = require("ToucheClavier");
const ObjetBandeauEspace_1 = require("ObjetBandeauEspace");
const UtilitaireDeconnexion_1 = require("UtilitaireDeconnexion");
const ObjetWrapperCentraleNotifications_Espace_1 = require("ObjetWrapperCentraleNotifications_Espace");
const ObjetWrapperAideContextuelle_Espace_1 = require("ObjetWrapperAideContextuelle_Espace");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
var GenreCommande;
(function (GenreCommande) {
	GenreCommande[(GenreCommande["accessibilite"] = 0)] = "accessibilite";
	GenreCommande[(GenreCommande["qrCode"] = 1)] = "qrCode";
	GenreCommande[(GenreCommande["twitter"] = 2)] = "twitter";
	GenreCommande[(GenreCommande["dlClient"] = 3)] = "dlClient";
	GenreCommande[(GenreCommande["changerOnglet"] = 4)] = "changerOnglet";
	GenreCommande[(GenreCommande["accueil"] = 5)] = "accueil";
	GenreCommande[(GenreCommande["aide"] = 6)] = "aide";
	GenreCommande[(GenreCommande["forum"] = 7)] = "forum";
	GenreCommande[(GenreCommande["videos"] = 8)] = "videos";
	GenreCommande[(GenreCommande["profil"] = 9)] = "profil";
	GenreCommande[(GenreCommande["communication"] = 10)] = "communication";
	GenreCommande[(GenreCommande["cloudIndex"] = 11)] = "cloudIndex";
	GenreCommande[(GenreCommande["changerMembre"] = 12)] = "changerMembre";
})(GenreCommande || (GenreCommande = {}));
var GenreCommandePersonnel;
(function (GenreCommandePersonnel) {
	GenreCommandePersonnel[(GenreCommandePersonnel["deconnexion"] = -1)] =
		"deconnexion";
	GenreCommandePersonnel[(GenreCommandePersonnel["onglet"] = -2)] = "onglet";
	GenreCommandePersonnel[(GenreCommandePersonnel["CommandeBouton"] = -3)] =
		"CommandeBouton";
})(GenreCommandePersonnel || (GenreCommandePersonnel = {}));
class _ObjetAffichageBandeauEntete extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.applicationProduit = GApplication;
		this.idSecondMenu = this.Nom + "_secondMenu";
		this.NomWrapperSecondMenu = this.Nom + "_WrapperSecondMenu";
		this.NomBtnCommunication = this.Nom + "_btncommunication";
		this.hauteur = 45;
		this.genreCommande = GenreCommande;
		this.genreCommandePersonnel = GenreCommandePersonnel;
		Invocateur_1.Invocateur.abonner(
			"modification_Membre",
			this._modificationMembre.bind(this),
			this,
		);
		Invocateur_1.Invocateur.abonner(
			"focus.menu_navigation",
			() => {
				this.evenementRaccourcisClavier(0);
			},
			this,
		);
		if (this.surPreResize) {
			this.ajouterEvenementGlobal(
				Enumere_Event_1.EEvent.SurPreResize,
				this.surPreResize,
			);
		}
		if (this.surResize) {
			this.ajouterEvenementGlobal(
				Enumere_Event_1.EEvent.SurFinResize,
				this.surResize,
			);
		}
		$(window).on("resize", () => {
			this._setMenuResponsive();
		});
	}
	construireInstances() {
		this.identBandeauEspace = this.add(ObjetBandeauEspace_1.ObjetBandeauEspace);
		if (!this.estConnexionEDT()) {
			if (this.avecClassMenuOngletLudique()) {
				this.creerMenuOngletLudique();
			} else {
				this.identMenuOnglets = this.add(
					ObjetMenuPrincipal_1.ObjetMenuPrincipal,
					this.evenementSurMenuOnglets,
					this.initialiserMenuOnglets,
				);
				this.identMenuMembres = this.add(
					ObjetMenuPrincipal_1.ObjetMenuPrincipal,
					this.evenementSurMenuMembres,
					this.initialiserMenuMembres,
				);
				if (this.avecPageAccueil()) {
					this.identMenuAccueil = this.add(
						ObjetMenuPrincipal_1.ObjetMenuPrincipal,
						this.evenementSurMenuAccueil,
						this.initialiserMenuAccueil,
					);
				}
			}
			this.identCommande = this.add(
				this.getObjetCommande(),
				this.evenementBouton,
			);
			if (
				this.options.actionneurCentraleNotif &&
				!this.avecClassMenuOngletLudique()
			) {
				this.identBoutonNotif = this.add(
					ObjetWrapperCentraleNotifications_Espace_1.ObjetWrapperCentraleNotifications_Espace,
					null,
					(aInstance) => {
						aInstance.setOptions({
							actionneur: this.options.actionneurCentraleNotif,
						});
					},
				);
			}
			if (
				!!GParametres.aideContextuelle &&
				!!GParametres.aideContextuelle.url_accueil &&
				!this.avecClassMenuOngletLudique()
			) {
				this.identBoutonAide = this.add(
					ObjetWrapperAideContextuelle_Espace_1.ObjetWrapperAideContextuelle_Espace,
					null,
					(aInstance) => {
						aInstance.setOptions({
							modeBtnEntete: false,
							listeOnglets: this.getObjetEtatUtilisateur().listeOnglets,
						});
					},
				);
			}
		} else {
			this.identCommande = this.add(
				this.getObjetCommande(),
				this.evenementBouton,
			);
			this.identMenuMembres = this.add(
				ObjetMenuPrincipal_1.ObjetMenuPrincipal,
				this.evenementSurMenuMembres,
				this.initialiserMenuMembres,
			);
		}
	}
	creerMenuOngletLudique() {}
	avecAide() {
		return false;
	}
	avecClassMenuOngletLudique() {
		return false;
	}
	getUrlLogoEtablissement() {
		return GParametres.urlLogo;
	}
	estEspaceInscription() {
		return false;
	}
	getObjetsGraphiqueMembre(aMembre) {
		return null;
	}
	composeObjetsGraphiqueMembre(aMembre) {
		const H = [];
		const lObjGraphiqueMembre = this.getObjetsGraphiqueMembre(aMembre);
		if (lObjGraphiqueMembre && lObjGraphiqueMembre.length) {
			lObjGraphiqueMembre.forEach((D) => {
				if (!!D.html) {
					H.push('<div class="objetGraphique-membre">', D.html, "</div>");
				}
			});
		}
		return H.join("");
	}
	getLibelleOngletPersonnel() {
		return "";
	}
	getMenuWidth() {
		return $(".menu-container").outerWidth();
	}
	getInstanceMenuOnglet() {
		return this.getInstance(this.identMenuOnglets);
	}
	getInstanceMenuMembres() {
		return this.getInstance(this.identMenuMembres);
	}
	getInstanceMenuAccueil() {
		return this.getInstance(this.identMenuAccueil);
	}
	getCallbackBandeauEtablissement() {
		return null;
	}
	actionsSurPlanSite() {
		return;
	}
	composeCreationAlertePPMS() {
		return "";
	}
	composeConversation() {
		return "";
	}
	composeAlertePPMS() {
		return "";
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getNodeEtab() {},
			nodeSecondMenuContainer() {
				$(this.node).eventValidation((aEvent) => {
					const lTarget = $(aEvent.target).closest("li");
					if (aEvent.pointerType === "touch") {
						if (lTarget.hasClass("has-submenu")) {
							aEvent.stopImmediatePropagation();
							return;
						}
					}
					aInstance
						.getInstanceMenuOnglet()
						.selectionnerSousOnglet(lTarget.attr("data-genre"));
				});
			},
			btnDroite: {
				event(aGenre) {
					aInstance.evenementBouton({ genreCmd: aGenre });
				},
			},
			nodeBoutonAfficherMasquerMenuLateral() {
				$(this.node).eventValidation(() => {
					ObjetMenuPrincipal_1.ObjetMenuPrincipal.afficherMasquerMenuResponsive();
					this.controleur.$refreshSelf();
				});
			},
			getAttrBoutonAfficherMasquerMenuLateral() {
				return {
					title: $(".objetBandeauEntete_menu").hasClass("show-menu")
						? ObjetTraduction_1.GTraductions.getValeur("Navigation.MasquerMenu")
						: ObjetTraduction_1.GTraductions.getValeur(
								"Navigation.AfficherMenu",
							),
				};
			},
		});
	}
	initialiserMenuOnglets(aInstance) {
		aInstance.setParametres({
			avecSousMenu: true,
			avecPlusieursNiveau: true,
			avecGroupeCliquable: true,
			niveauMaximum: this.niveauMaxMenuOnglet(),
			masquerLibelleOnglet: this.masquerLibelleMenuOnglet(),
			avecCompteur: true,
		});
	}
	initialiserMenuMembres(aInstance) {
		aInstance.setParametres({
			avecSousMenu: true,
			avecPlusieursNiveau: false,
			libelleCentre: false,
			sansClicPrincipal: true,
			avecSousMenuVisible: true,
			minHauteur: this.estConnexionEDT() ? 20 : null,
		});
	}
	initialiserMenuAccueil(aInstance) {
		aInstance.setParametres({
			avecPlusieursNiveau: false,
			actionSurClickSiSeul: true,
		});
	}
	setDonnees(ALibelle, AListeEleves) {
		this.listeMembres = AListeEleves;
		this.setVisibiliteIntegrationSite();
		if (this.getInstance(this.identMenuOnglets)) {
			this.getInstance(this.identMenuOnglets).setDonnees(
				this.getObjetEtatUtilisateur().listeOnglets,
			);
		}
		if (this.identMenuMembres !== undefined) {
			this.setDonneesMenuMembres();
		}
		if (this.identMenuAccueil !== undefined) {
			this.setDonneesMenuAccueil();
		}
		this._modificationMembre();
		this.$refreshSelf();
		this.initialMenuWidth = this.getMenuWidth();
		this._setMenuResponsive();
	}
	actualiserLibelleOnglet() {
		if (!this.getInstanceMenuOnglet()) {
			return;
		}
		const lGenreOnglet = this.getObjetEtatUtilisateur().getGenreOnglet();
		let lGenreOngletPere = this.getObjetEtatUtilisateur().getGenreOnglet();
		let lOngletPere =
			this.getInstanceMenuOnglet().ListeElements.getElementParNumeroEtGenre(
				null,
				lGenreOngletPere,
			);
		while (lOngletPere && lOngletPere.onglet && lOngletPere.onglet.onglet) {
			lGenreOngletPere = lOngletPere.onglet.getGenre();
			lOngletPere =
				this.getInstanceMenuOnglet().ListeElements.getElementParNumeroEtGenre(
					null,
					lGenreOngletPere,
				);
		}
		let lLibelleOnglet = "",
			lLibelleOngletPere = "";
		if (lGenreOnglet !== this.getGenreOngletAccueil() && !!lOngletPere) {
			if (!!lOngletPere.onglet) {
				lLibelleOngletPere = lOngletPere.onglet
					.getLibelle()
					.replace("<br />", " ");
			}
			lLibelleOnglet = lOngletPere.getLibelle();
		}
		if (
			GEtatUtilisateur.estEspaceAvecMembre() &&
			GEtatUtilisateur.getMembre()
		) {
			const lDivMembre = [];
			lDivMembre.push(
				'<span class="label-membre">',
				GEtatUtilisateur.getMembre().libelleLong,
				"</span>",
			);
			lLibelleOngletPere =
				lDivMembre.join("") + (!!lLibelleOngletPere ? lLibelleOngletPere : "");
		}
		$(".fil-ariane.pere").html(lLibelleOngletPere);
		$(".fil-ariane.fils").html(lLibelleOnglet);
		$(
			`#${this.getInstance(this.identMenuOnglets).getNom().escapeJQ()} li[aria-current="page"]`,
		).attr("aria-current", null);
		$(
			`#${this.getInstance(this.identMenuOnglets).getNom().escapeJQ()} li[data-genre="${lGenreOnglet}"]`,
		).attr("aria-current", "page");
		$("#" + this.idSecondMenu.escapeJQ() + " >div:first")
			.html(
				this.getInstanceMenuOnglet().getListeDeGenreOnglet(lGenreOnglet, [
					this.getGenreOngletAccueil(),
				]),
			)
			.find('li[data-genre="' + lGenreOngletPere + '"]')
			.addClass("selected")
			.attr("aria-current", "page")
			.end()
			.find(">ul")
			.attr("role", "group")
			.end()
			.find(">ul >li")
			.attr("tabindex", "-1")
			.end()
			.off("keyup")
			.on("keyup", "li", { aObjet: this }, function (aEvent) {
				if (
					aEvent.type === "keyup" &&
					aEvent.which !== ToucheClavier_1.ToucheClavier.RetourChariot
				) {
					return;
				}
				aEvent.data.aObjet
					.getInstanceMenuOnglet()
					.selectionnerSousOnglet($(this).attr("data-genre"));
				aEvent.stopImmediatePropagation();
			});
	}
	setVisibiliteIntegrationSite() {
		if (this.estConnexionEDT()) {
			$(".objetBandeauEntete_boutonmenu").hide();
		}
	}
	setDonneesMenuMembres() {
		if (this.getObjetEtatUtilisateur().estEspaceAvecMembre()) {
			this.listeElementsMenuMembres =
				new ObjetListeElements_1.ObjetListeElements();
			for (
				let i = 0;
				!!this.listeMembres && i < this.listeMembres.count();
				i++
			) {
				const lMembre = this.listeMembres.get(i);
				const lElement = MethodesObjet_1.MethodesObjet.dupliquer(lMembre, true);
				lElement.Visible = true;
				lElement.estUnOnglet = true;
				lElement.profondeur = lMembre.pere ? 1 : 0;
				lElement.avecClic = !lMembre.estGroupeDeRessource;
				lElement.onglet = lMembre.pere;
				lElement.genreCommande = this.genreCommandePersonnel.CommandeBouton;
				lElement.libelleHtml = this._composeMembre({
					membre: lElement,
					libelle: lElement.libelleLong || lElement.getLibelle(),
				});
				this.listeElementsMenuMembres.addElement(lElement);
			}
			$("#" + this.getInstance(this.identMenuMembres).getNom()).show();
			this.getInstance(this.identMenuMembres).setDonnees(
				this.listeElementsMenuMembres,
			);
		} else {
			$("#" + this.getInstance(this.identMenuMembres).getNom()).hide();
		}
	}
	setDonneesMenuAccueil() {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		const lOnglet =
			this.getObjetEtatUtilisateur().listeOnglets.getElementParNumeroEtGenre(
				null,
				this.getGenreOngletAccueil(),
			);
		if (lOnglet) {
			const lElement = new ObjetElement_1.ObjetElement(
				lOnglet.getLibelle(),
				0,
				this.getGenreOngletAccueil(),
				null,
				true,
			);
			lElement.Visible = true;
			lElement.estUnOnglet = true;
			lElement.profondeur = 0;
			lElement.avecClic = true;
			lElement.genreCommande = this.genreCommandePersonnel.onglet;
			lListe.addElement(lElement);
		}
		this.getInstance(this.identMenuAccueil).setDonnees(lListe);
		this.getInstance(this.identMenuAccueil).setLibelleOnglet(
			new ObjetElement_1.ObjetElement(this.getLibelleMenuAccueil()),
		);
	}
	avecCloudIndex() {
		return false;
	}
	construireStructureAffichageAutre() {
		const lHtml = [];
		const lClassNomEspace = this.getClassNomEspace();
		const lInscriptions = this.estEspaceInscription();
		const lRoleMenuBar = ObjetWAI_1.GObjetWAI.composeRole(
			ObjetWAI_1.EGenreRole.Menubar,
		);
		const lRoleNavigation = ObjetWAI_1.GObjetWAI.composeRole(
			ObjetWAI_1.EGenreRole.Navigation,
		);
		this.getInstance(this.identBandeauEspace).setParametres(
			this._getParametresBandeauEspace(),
		);
		lHtml.push(
			"<div",
			this.getInstance(this.identMenuOngletsLudique)
				? ">"
				: ' class="objetbandeauentete_global">',
			'<div id="' + this.getInstance(this.identBandeauEspace).getNom() + '">',
			"</div>",
			'<div id="' + this.NomWrapperSecondMenu + '" style="display:none;">',
			"</div>",
		);
		if (!this.estConnexionEDT()) {
			lHtml.push(
				'<div class="objetBandeauEntete_menu',
				lInscriptions ? " e-inscriptions " : "",
				this.getInstance(this.identMenuOngletsLudique) ? " ongletLudique" : "",
				'" ' +
					lRoleNavigation +
					' aria-label="' +
					ObjetTraduction_1.GTraductions.getValeur("Navigation.MenuPrincipal") +
					'">',
				IE.jsx.str("i", {
					class: "icon_reorder navbar-toggler",
					"ie-node": "nodeBoutonAfficherMasquerMenuLateral",
					"ie-attr": "getAttrBoutonAfficherMasquerMenuLateral",
					role: "button",
					tabindex: "0",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"Navigation.AfficherMenu",
					),
				}),
				'<p class="fil-ariane pere"></p>',
				this.getInstance(this.identMenuOngletsLudique)
					? '<div id="' +
							this.getInstance(this.identMenuOngletsLudique).getNom() +
							'" ' +
							lRoleMenuBar +
							"></div>"
					: [
							'<div class="menu-container ',
							this.getObjetEtatUtilisateur().estEspaceAvecMembre()
								? "with-members "
								: "",
							lClassNomEspace,
							'" ',
							lRoleMenuBar,
							">",
							this.getInstanceMenuMembres() && !this.estConnexionEDT()
								? '<div id="' +
									this.getInstance(this.identMenuMembres).getNom() +
									'" class="objetBandeauEntete_membres"></div>'
								: "",
							this.getInstanceMenuAccueil()
								? '<div class="home" id="' +
									this.getInstance(this.identMenuAccueil).getNom() +
									'"></div>'
								: "",
							this.getInstanceMenuOnglet()
								? '<div class="onglets-wrapper" id="' +
									this.getInstance(this.identMenuOnglets).getNom() +
									'"></div>'
								: "",
							"</div>",
							this._composeBoutonsDroite(),
						].join(""),
				"</div>",
			);
		}
		if (!this.getInstance(this.identMenuOngletsLudique)) {
			lHtml.push(
				'<div id="',
				this.idSecondMenu,
				'" class="objetBandeauEntete_secondmenu',
				lInscriptions ? " e-inscriptions " : "",
				'" ' +
					lRoleNavigation +
					' aria-label="' +
					ObjetTraduction_1.GTraductions.getValeur(
						"Navigation.MenuSecondaire",
					) +
					'">',
				'<p class="fil-ariane fils"></p>',
				'<div ie-node="nodeSecondMenuContainer" class="secondmenu-container" ' +
					lRoleMenuBar +
					"></div>",
				this.getInstanceMenuMembres() && this.estConnexionEDT()
					? '<div id="' +
							this.getInstance(this.identMenuMembres).getNom() +
							'" class="objetBandeauEntete_membres"></div>'
					: "",
				'<div class="objetBandeauEntete_fullsize"></div>',
				this.getInstance(this.identCommande)
					? '<div class="menu-commandes" id="' +
							this.getInstance(this.identCommande).getNom() +
							'"></div>'
					: "",
				"</div>",
			);
		}
		if (this.getInstance(this.identMenuOngletsLudique)) {
			lHtml.push(
				'<div class="objetBandeauEntete_thirdmenu_ludique" ' +
					lRoleNavigation +
					' aria-label="' +
					ObjetTraduction_1.GTraductions.getValeur(
						"Navigation.MenuDeTroisiemeNiveau",
					) +
					'">',
			);
		}
		lHtml.push(
			'<div id="',
			this.applicationProduit.idLigneBandeau,
			'" class="objetBandeauEntete_thirdmenu" style="display:none;" ' +
				lRoleNavigation +
				' aria-label="' +
				ObjetTraduction_1.GTraductions.getValeur(
					"Navigation.MenuDeTroisiemeNiveau",
				) +
				'">',
			this.composeBaseLigneBandeau(),
			"</div>",
		);
		if (this.getInstance(this.identMenuOngletsLudique)) {
			lHtml.push(
				this.getInstance(this.identCommande)
					? '<div class="menu-commandes" id="' +
							this.getInstance(this.identCommande).getNom() +
							'"></div>'
					: "",
				"</div>",
			);
		}
		lHtml.push("</div>", "</div>");
		return lHtml.join("");
	}
	composeBaseLigneBandeau() {
		return (
			'<h1 id="' +
			this.applicationProduit.idBreadcrumb +
			'" class="titre-onglet" tabindex="0"></h1>'
		);
	}
	actualiserListeMembres(AListeRessources) {
		let lElementCourant;
		const lGetElementCourant = (aElement, aElementSource) => {
			const lResult = MethodesObjet_1.MethodesObjet.dupliquer(aElement);
			lResult.libelleLong = this._composeMembre({
				membre: lResult,
				membreSource: aElementSource,
				libelle: lResult.libelleLong || lResult.getLibelle(),
				ajoutControleur: true,
				avecObjetsGraphiqueMembre: true,
				avecFlecheDeploiement: AListeRessources.count() > 1,
			});
			return lResult;
		};
		if (this.getObjetEtatUtilisateur().estEspaceAvecMembre()) {
			if (AListeRessources.count()) {
				if (AListeRessources.count() > 1) {
					let lIndiceMembre = 0;
					const lMembre = this.getObjetEtatUtilisateur().getMembre();
					if (lMembre) {
						lIndiceMembre = AListeRessources.getIndiceParElement(lMembre);
						if (!lIndiceMembre) {
							lIndiceMembre = 0;
						}
					}
					const lListeRessources =
						new ObjetListeElements_1.ObjetListeElements();
					for (let i = 0; i < AListeRessources.count(); i++) {
						const lElementSource = AListeRessources.get(i);
						const lElement = MethodesObjet_1.MethodesObjet.dupliquer(
							lElementSource,
							true,
						);
						if (lElement.Classe) {
							lElement.libelleCourt = lElement.Libelle;
							lElement.Libelle = lElement.libelleLong;
						}
						if (i === lIndiceMembre) {
							lElementCourant = lGetElementCourant(lElement, lElementSource);
						}
						lListeRessources.addElement(lElement);
					}
				} else {
					lElementCourant = lGetElementCourant(
						AListeRessources.get(0),
						AListeRessources.get(0),
					);
					this.getObjetEtatUtilisateur().setNumeroEleve(
						lElementCourant.getNumero(),
					);
				}
				if (this.getInstance(this.identMenuMembres)) {
					this.getInstance(this.identMenuMembres).setLibelleOnglet(
						lElementCourant,
						null,
						lElementCourant.controleur,
					);
				}
			}
		}
	}
	actualiserBreadcrumb(aGenreOnglet) {
		if (aGenreOnglet === this.getGenreOngletAccueil()) {
			if (!this.getInstance(this.identMenuOngletsLudique)) {
				this.setLibelleMenuOnglet(
					this.getObjetEtatUtilisateur().listeOnglets.getElementParGenre(
						this.getGenreOngletAccueil(),
					),
				);
			}
		} else {
			const lListeOnglet =
				this.getObjetEtatUtilisateur().listeOnglets.getListeElements((aEle) => {
					return aEle.getGenre() === aGenreOnglet;
				});
			const lOnglet = lListeOnglet.get(0);
			this.setLibelleMenuOnglet(lOnglet);
		}
	}
	setLibelleMenuOnglet(aOnglet) {
		const lLibelle = aOnglet
			? aOnglet.libelleLong
				? aOnglet.libelleLong
				: aOnglet.getLibelle()
					? aOnglet.getLibelle()
					: ""
			: "";
		$("#" + this.applicationProduit.idBreadcrumb.escapeJQ()).html(lLibelle);
		$("#" + this.applicationProduit.idBreadcrumbPerso.escapeJQ()).html(
			lLibelle,
		);
		$(
			"#" +
				this.applicationProduit.idBreadcrumb.escapeJQ() +
				", #" +
				this.applicationProduit.idBreadcrumbPerso.escapeJQ(),
		).attr(
			ObjetWAI_1.GObjetWAI.getAttribut(ObjetWAI_1.EGenreAttribut.label),
			lLibelle,
		);
		if (lLibelle) {
			$("#" + this.applicationProduit.idBreadcrumb.escapeJQ()).show();
		} else {
			$("#" + this.applicationProduit.idBreadcrumb.escapeJQ()).hide();
		}
	}
	evenementSurMenuOnglets(aSousOnglet, aIgnorerHistorique) {
		const lSousOnglet = (this.sousOnglet =
			aSousOnglet === null || aSousOnglet === undefined
				? this.sousOnglet
				: aSousOnglet);
		const lListeSousOnglet =
			this.getObjetEtatUtilisateur().listeOnglets.getListeElements((aEle) => {
				return aEle.Actif && aEle.onglet && lSousOnglet
					? aEle.onglet.getGenre() === lSousOnglet.getGenre()
					: false;
			});
		if (lListeSousOnglet.count() > 0) {
			this.sousOnglet = lListeSousOnglet.get(0);
		}
		if (this.sousOnglet) {
			$("#" + this.Nom.escapeJQ())
				.find(".objetBandeauEntete_menu")
				.removeClass("objetBandeauEntete_menuResponsiveVisible");
			this.callback.appel({
				genreCmd: this.getCommande(this.genreCommande.changerOnglet),
				onglet: this.sousOnglet,
				ignorerHistorique: aIgnorerHistorique,
			});
		}
		this._widthSsMenu =
			$(".objetBandeauEntete_secondmenu>.secondmenu-container").outerWidth() ||
			0;
		const lJMenu = $(".objetBandeauEntete_secondmenu>.menu-commandes");
		if (lJMenu.length > 0) {
			lJMenu.addClass("menu-commandes-calcul");
			this._widthSsMenu += lJMenu.outerWidth();
			lJMenu.removeClass("menu-commandes-calcul");
		}
		this._setMenuResponsive();
	}
	changerMembre(aElement) {
		this.evenementSurMenuMembres(aElement);
	}
	evenementSurMenuMembres(aElement) {
		(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
			this.setEtatSaisie(false);
			this.getObjetEtatUtilisateur().setNumeroEleve(aElement.getNumero());
			Invocateur_1.Invocateur.evenement("modification_Membre", aElement);
			Invocateur_1.Invocateur.evenement(
				"modification_Membre_FenetreKiosque",
				aElement,
			);
			this.evenementSurMenuOnglets();
			this.getInstance(this.identBandeauEspace).setParametres(
				this._getParametresBandeauEspace(),
			);
			this.getInstance(this.identBandeauEspace).initialiser();
		});
	}
	evenementSurMenuAccueil(aElement) {
		if (!aElement) {
			return;
		}
		if (aElement.getGenre() !== null && aElement.getGenre() !== undefined) {
			if (this.getInstance(this.identMenuOnglets)) {
				this.getInstance(this.identMenuOnglets).setCouleurOnglet();
			}
		}
		switch (aElement.genreCommande) {
			case this.genreCommandePersonnel.onglet:
				if (this.getInstance(this.identMenuOnglets)) {
					this.getInstance(this.identMenuOnglets).setCouleurOnglet();
				}
				Invocateur_1.Invocateur.evenement(
					Invocateur_1.ObjetInvocateur.events.navigationOnglet,
					aElement.getGenre(),
				);
				break;
		}
	}
	_evenementBouton(aParam) {
		if (!aParam) {
			return;
		}
		switch (aParam.genreCommande) {
			case this.genreCommandePersonnel.deconnexion:
				UtilitaireDeconnexion_1.UtilitaireDeconnexion.confirmationDeconnexion();
				return;
			case this.genreCommandePersonnel.onglet: {
				const lOnglet =
					this.getObjetEtatUtilisateur().listeOnglets.getElementParGenre(
						aParam.genreOnglet,
					);
				if (lOnglet && lOnglet.Actif) {
					Invocateur_1.Invocateur.evenement(
						Invocateur_1.ObjetInvocateur.events.navigationOnglet,
						aParam.genreOnglet,
					);
				}
				return;
			}
		}
	}
	_modificationMembre() {
		this.actualiserListeMembres(this.listeMembres);
	}
	focusAuDebut() {
		this.getInstance(this.identBandeauEspace).focusSurPremierElement();
	}
	evenementBouton(aParam, aGenreBouton) {
		if (aGenreBouton !== 1) {
			if (aParam.genreCmd === this.getCommande(this.genreCommande.accueil)) {
				if (this.getInstance(this.identMenuOnglets)) {
					this.getInstance(this.identMenuOnglets).setCouleurOnglet();
				}
				this.sousOnglet =
					this.getObjetEtatUtilisateur().listeOnglets.getElementParGenre(
						this.getGenreOngletAccueil(),
					);
			}
			this.callback.appel(aParam);
		}
	}
	evenementRaccourcisClavier(aNumeroTouche) {
		switch (aNumeroTouche) {
			case 0:
				if (this.getInstance(this.identMenuOnglets)) {
					if (
						ObjetMenuPrincipal_1.ObjetMenuPrincipal.estMenuEnModeResponsive()
					) {
						ObjetMenuPrincipal_1.ObjetMenuPrincipal.afficherMasquerMenuResponsive(
							true,
						);
						setTimeout(() => {
							$(".item-menu_niveau0:first").focus();
							this.$refreshSelf();
						}, 100);
					} else {
						$("#" + this.getInstance(this.identMenuOnglets).getNom().escapeJQ())
							.find("li:first")
							.focus();
					}
				}
				break;
			case 2:
				if (this.getInstance(this.identMenuOngletsLudique)) {
					return;
				}
				$("#" + this.idSecondMenu.escapeJQ())
					.find("li.selected")
					.focus();
				break;
			case 9: {
				this._evenementBouton({
					genreCommande: this.genreCommandePersonnel.deconnexion,
				});
				break;
			}
		}
	}
	selectionnerSousOnglet(aGenreSousOnglet) {
		if (this.getInstance(this.identMenuOnglets)) {
			this.getInstance(this.identMenuOnglets).selectionnerSousOnglet(
				aGenreSousOnglet,
			);
		}
	}
	_getParametresBandeauEspace() {
		return {
			labelConteneur: GNavigateur.isMacOs
				? ObjetTraduction_1.GTraductions.getValeur(
						"Navigation.AideRaccourcisClavierMacOs",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"Navigation.AideRaccourcisClavier",
					) +
					ObjetTraduction_1.GTraductions.getValeur(
						"Navigation.AideRaccourcisClavierDetails",
					),
			nomEtab: this.getLibelleEtablissement(),
			urlLogoEtab: this.getUrlLogoEtablissement(),
			logoDepartementImage: GParametres.logoDepartementImage || "",
			logoDepartementLien: GParametres.logoDepartementLien || "",
			getNomUtil: () => {
				const T = [];
				const lLibelle = this.getLibelleUtilisateur();
				const lNomEspace = GParametres.getNomEspace();
				if (lNomEspace) {
					T.push(lNomEspace);
				}
				if (lLibelle) {
					T.push(lLibelle);
				}
				return T.join(" - ");
			},
			clickUtilisateur: (aEvent, aNode) => {
				ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
					pere: this,
					initCommandes: (aMenu) => {
						this.addCommandesMenuContextuelBandeau(aMenu);
					},
					id: aEvent.type === "keyup" ? aNode : null,
				});
			},
			attrUtil:
				ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Button) +
				" " +
				ObjetWAI_1.GObjetWAI.composeAttribut({
					genre: ObjetWAI_1.EGenreAttribut.haspopup,
					valeur: "true",
				}),
			ariaLabelUtil: this.getLibelleOngletPersonnel(),
			photo: {
				getUrlPhoto: () => {
					return this.getUrlPhoto();
				},
			},
			clickAccesMobile: this.getCallbackBandeauAccesMobile(),
			clickDeconnexion: () => {
				this._evenementBouton({
					genreCommande: this.genreCommandePersonnel.deconnexion,
				});
			},
			isEDT: !!this.estConnexionEDT(),
			clickEtablissement: this.getCallbackBandeauEtablissement(),
			avecFicheEtablissement: GEtatUtilisateur.avecFicheEtablissement(),
			avecLiensEvitement: true,
			liensEvitement: {
				menuOnglet:
					!!this.getInstance(this.identMenuOnglets) ||
					!!this.getInstance(this.identMenuOngletsLudique),
				urlDeclarationAccessibilite: GParametres.urlDeclarationAccessibilite,
				clickPlanSite: this.actionsSurPlanSite.bind(this),
			},
			avecLangue: false,
		};
	}
	surPreResize() {}
	surResize() {
		$("#" + this.idSecondMenu.escapeJQ())
			.children("div:first")
			.show();
	}
	_composeBoutonsDroite() {
		var _a;
		return [
			'<div class="objetBandeauEntete_boutons">',
			this.avecCloudIndex()
				? "<span>" +
					'<ie-btnimage ie-model="btnDroite(' +
					this.getCommande(this.genreCommande.cloudIndex) +
					')" class="icon_cloud_pronote btnImageIcon" title="' +
					ObjetTraduction_1.GTraductions.getValeur(
						"cloudIndex.utilisationCloud",
					) +
					'">' +
					"</ie-btnimage></span>"
				: "",
			(_a =
				this === null || this === void 0
					? void 0
					: this.composeBoutonHarcelement) === null || _a === void 0
				? void 0
				: _a.call(this),
			this.composeBtnCommunication(this.NomBtnCommunication),
			this.composeCreationAlertePPMS(),
			this.composeConversation(),
			this.getInstance(this.identBoutonNotif) || this.composeAlertePPMS()
				? '<hr class="objetBandeauEntete_sep_boutons"></hr>'
				: "",
			this.getInstance(this.identBoutonNotif)
				? '<div id="' +
					this.getInstance(this.identBoutonNotif).getNom() +
					'" class="objetBandeauEntete_boutons_ifc"></div>'
				: "",
			this.getInstance(this.identBoutonAide)
				? '<div id="' +
					this.getInstance(this.identBoutonAide).getNom() +
					'" class="objetBandeauEntete_boutons_ifc"></div>'
				: "",
			this.composeAlertePPMS(),
			"</div>",
		].join("");
	}
	_composeMembre(aParams) {
		const lUrl = this.getUrlPhotoMembre(aParams.membre);
		if (lUrl === "") {
			return aParams.libelle;
		}
		if (lUrl && aParams.ajoutControleur && aParams.membreSource) {
			aParams.membre.controleur = {
				node: function () {
					$(this.node).on("error", () => {
						aParams.membreSource._erreurChargementPhoto_ = true;
					});
				},
			};
		}
		const H = [];
		H.push(
			'<div class="membre-photo_container">',
			'<div class="membre-photo">',
		);
		if (
			lUrl &&
			(!aParams.membreSource || !aParams.membreSource._erreurChargementPhoto_)
		) {
			H.push(
				IE.jsx.str("img", {
					src: lUrl,
					style: "width:100%;",
					"ie-node":
						aParams.ajoutControleur && aParams.membreSource ? "node" : "",
					onerror: `$(this).next('div').show();$(this).remove();`,
					alt: ObjetTraduction_1.GTraductions.getValeur("PhotoDe_S", [
						aParams.libelle,
					]),
				}),
			);
		}
		H.push(
			'<div style="',
			!lUrl ||
				(aParams.membreSource && aParams.membreSource._erreurChargementPhoto_)
				? ""
				: "display:none;",
			'">',
			IE.jsx.str("i", { class: "icon_utilisateur", role: "presentation" }),
			"</div>",
			"</div>",
		);
		H.push(
			'<span class="label-membre ie-ellipsis">',
			aParams.libelle,
			"</span>",
		);
		if (aParams.avecFlecheDeploiement) {
			H.push(
				'<i role="img" aria-hidden="true" class="icon_fleche_num_bas i-small m-left-l"></i>',
			);
		}
		if (aParams.avecObjetsGraphiqueMembre) {
			H.push(this.composeObjetsGraphiqueMembre(aParams.membre));
		}
		H.push("</div>");
		return H.join("");
	}
	_setMenuResponsive() {
		const lMenuSize = this.initialMenuWidth || 0;
		const lMenuWrapper = $(".objetbandeauentete_global");
		const lWidth_wrapper = lMenuWrapper.outerWidth() || 0;
		const lGlobaMenusSize =
			lWidth_wrapper - ($(".objetBandeauEntete_boutons").outerWidth() || 0);
		if (
			(lGlobaMenusSize > 0 && lMenuSize > lGlobaMenusSize) ||
			(lWidth_wrapper > 0 && this._widthSsMenu > lWidth_wrapper)
		) {
			!lMenuWrapper.hasClass("as-responsive")
				? lMenuWrapper.addClass("as-responsive")
				: "";
		} else {
			lMenuWrapper.hasClass("as-responsive")
				? lMenuWrapper.removeClass("as-responsive")
				: "";
		}
		if (this.getInstance(this.identMenuOnglets)) {
			this.getInstance(this.identMenuOnglets).changeResponsive();
		}
		if (this.getInstance(this.identMenuMembres)) {
			this.getInstance(this.identMenuMembres).changeResponsive();
		}
	}
}
exports._ObjetAffichageBandeauEntete = _ObjetAffichageBandeauEntete;
