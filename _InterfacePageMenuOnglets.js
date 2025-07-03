exports._InterfacePagePageMenuOnglets = void 0;
const Callback_1 = require("Callback");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetChaine_1 = require("ObjetChaine");
const IEHtml_1 = require("IEHtml");
const UtilitaireDeconnexion_1 = require("UtilitaireDeconnexion");
const ObjetWrapperCentraleNotifications_Mobile_1 = require("ObjetWrapperCentraleNotifications_Mobile");
const ObjetWrapperAideContextuelle_Mobile_1 = require("ObjetWrapperAideContextuelle_Mobile");
const Invocateur_1 = require("Invocateur");
const UtilitaireSyntheseVocale_1 = require("UtilitaireSyntheseVocale");
const ObjetCentraleNotifications_1 = require("ObjetCentraleNotifications");
const TraductionsAppliMobile_1 = require("TraductionsAppliMobile");
const AccessApp_1 = require("AccessApp");
class _InterfacePagePageMenuOnglets extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.idTitre = this.Nom + "_titre";
		this.idDerniereConnexion = this.Nom + "_derniereConnexion";
		this.idSeDeconnecter = this.Nom + "_Bouton_0";
		this.idDropDownContentRessources = this.Nom + "_dropdownContentRessources";
		this.listeOnglets = new ObjetListeElements_1.ObjetListeElements();
		this.listeOngletsTraitee = new ObjetListeElements_1.ObjetListeElements();
		this.listeRessources = new ObjetListeElements_1.ObjetListeElements();
		this.avecListeRessources = false;
		this.interfaceMobileCP = GInterface;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		const lActionneur = this.getActionneurCentraleNotification();
		if (lActionneur) {
			this.wrapperNotifs =
				new ObjetWrapperCentraleNotifications_Mobile_1.ObjetWrapperCentraleNotifications_Mobile(
					{ pere: this, actionneur: lActionneur },
				);
		}
		if (!!GParametres.urlAide || !!GParametres.aideContextuelle) {
			this.wrapperAide =
				new ObjetWrapperAideContextuelle_Mobile_1.ObjetWrapperAideContextuelle_Mobile(
					{ pere: this },
				);
		}
	}
	construireInstances() {}
	setParametres(aParam) {
		this.avecListeRessources = !!aParam.avecListeRessources;
		if (this.avecListeRessources) {
			this.traiterListeRessource();
		}
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			nodeMembre: function () {
				$(this.node).eventValidation(() => {
					aInstance.interfaceMobileCP.fermerMenuOnglet();
					Invocateur_1.Invocateur.evenement("ouvrir_selecteurMembre");
				});
			},
			nodeClosePanel: function () {
				$(this.node).eventValidation(() => {
					aInstance.interfaceMobileCP.fermerMenuOnglet();
				});
			},
			getNodeAccueil: function () {
				$(this.node).eventValidation(() => {
					UtilitaireSyntheseVocale_1.SyntheseVocale.forcerArretLecture();
					aInstance.evenementListeOnglets(aInstance.getGenreOngletAccueil());
				});
			},
			btnNotifications: {
				event: function () {
					aInstance.interfaceMobileCP.fermerMenuOnglet();
					aInstance.wrapperNotifs.ouvrir();
				},
				getHtmlBtnNotif: function () {
					return aInstance.composeBadgeBtn(
						(0, AccessApp_1.getApp)().donneesCentraleNotifications.nbNotifs,
					);
				},
			},
			aideContextuelle: {
				bouton: {
					event: function () {
						const lGenreOnglet = GEtatUtilisateur.getGenreOnglet();
						const lNombre = GParametres.aideContextuelle
							? GParametres.aideContextuelle.getNombreDeGenreOnglet(
									lGenreOnglet,
								)
							: 0;
						if (lNombre === 0 && GParametres.urlAide) {
							window.open(
								ObjetChaine_1.GChaine.format(GParametres.urlAide, [
									lGenreOnglet,
									"",
								]),
							);
							return;
						}
						aInstance.interfaceMobileCP.fermerMenuOnglet();
						const lOnglet =
							GEtatUtilisateur.listeOnglets.getElementParGenre(lGenreOnglet);
						aInstance.wrapperAide.ouvrir(lOnglet, lNombre);
					},
				},
				html: function () {
					const lGenreOnglet = GEtatUtilisateur.getGenreOnglet();
					const lNombre = GParametres.aideContextuelle
						? GParametres.aideContextuelle.getNombreDeGenreOnglet(lGenreOnglet)
						: "";
					return aInstance.composeBadgeBtn(lNombre);
				},
				affiche: function () {
					const lGenreOnglet = GEtatUtilisateur.getGenreOnglet();
					return (
						GParametres.aideContextuelle &&
						GParametres.aideContextuelle.getNombreDeGenreOnglet(lGenreOnglet) >
							0
					);
				},
			},
			nodeSeDeconnecter: function () {
				$(this.node).eventValidation(() => {
					aInstance.seDeconnecter();
				});
			},
			getNodeChangerProfil() {
				$(this.node).eventValidation(() => {
					window.messageData.push({ action: "changerProfil" });
				});
			},
		});
	}
	getLibelleEtablissement() {
		return undefined;
	}
	construireStructureAffichageAutre() {
		const lHtml = [];
		lHtml.push('<section class="global-menu-container ">');
		const lNomEtav = this.getLibelleEtablissement();
		lHtml.push(
			IE.jsx.str(
				"header",
				{ class: ["user-container", !!lNomEtav && "avec-nom-etab"] },
				IE.jsx.str(
					"div",
					{ class: "user-container-profil" },
					this.avecListeRessources
						? IE.jsx.str(
								"div",
								{
									"ie-node": "nodeMembre",
									tabindex: "0",
									class: "membre-combo",
								},
								this._construireEnteteRessource(GEtatUtilisateur.getMembre()),
							)
						: this._construireEnteteRessource(GEtatUtilisateur.getMembre()),
				),
				!!lNomEtav && IE.jsx.str("p", { class: "m-bottom-l" }, lNomEtav),
				IE.jsx.str("span", {
					id: this.idDerniereConnexion,
					class: "user-container-derniere-connexion",
				}),
			),
		);
		lHtml.push(
			'<div class="menu-container flex-contain cols justify-between">',
			'<ul class="menu-liste collection collapsible" role="menu">',
		);
		lHtml.push(this.composeOngletMobileApp());
		lHtml.push("</ul>");
		if (this.avecLogoDepartement()) {
			lHtml.push(
				IE.jsx.str(
					"div",
					{ class: "ibe_image_dep" },
					IE.jsx.str(
						"a",
						{
							href: GParametres.logoDepartementLien
								? GParametres.logoDepartementLien
								: "",
							target: "_blank",
							title: GParametres.logoDepartementLien
								? ObjetTraduction_1.GTraductions.getValeur(
										"BandeauEspace.AccederSiteDepartement",
									)
								: false,
						},
						IE.jsx.str("img", {
							src: GParametres.logoDepartementImage,
							alt: ObjetTraduction_1.GTraductions.getValeur(
								"BandeauEspace.LogoDepartement",
							),
							onerror: "$(this).parent().remove(",
						}),
					),
				),
			);
		}
		lHtml.push("</div>");
		lHtml.push(
			"</section>",
			'<section class="btn-commands-container">',
			this._composeBoutonMenu(),
			"</section>",
		);
		return lHtml.join("");
	}
	afficherListe() {
		const $ulParent = $("#" + this.Nom.escapeJQ()).find(
			"ul.menu-liste.collapsible",
		);
		$ulParent.find("li:not(.collection-static-item)").remove();
		IEHtml_1.default.injectHTMLParams({
			element: $ulParent.get(0),
			insererAvantLeNode: $ulParent.find("li").get(0),
			html: this.composeOnglets(),
			controleur: this.controleur,
		});
	}
	avecLogoDepartement() {
		return !!GParametres.logoDepartementImage;
	}
	composeOnglets() {
		const H = [];
		this.traiterListeOnglets();
		this.listeOngletsTraitee.parcourir((aEle) => {
			if (aEle.Actif && aEle.Visible !== false) {
				if (aEle.children && aEle.children.count() > 0) {
					H.push(
						'<li class="is-collapse collapsible-item" role="presentation">',
						"<span",
						aEle.idNotif ? ' id="' + aEle.idNotif + '"' : "",
						' class="as-header collapsible-header" role="menuitem" aria-expanded="false" tabindex="0">',
						aEle.getLibelle(),
						"</span>",
						'<div role="presentation" class="collapsible-body">',
						'<ul role="menu" class="collection sub-liste">',
					);
					aEle.children.parcourir((aChild) => {
						H.push(this.composeOnglet(aChild, 2));
					});
					H.push("</ul>", "</div>", "</li>");
				} else {
					aEle.getGenre() !== this.getGenreOngletAccueil()
						? H.push(this.composeOnglet(aEle, 1))
						: "";
				}
			}
		});
		return H.join("");
	}
	jsxGetNodeOnglet(aGenreOnglet, aNode) {
		$(aNode).eventValidation(() => {
			UtilitaireSyntheseVocale_1.SyntheseVocale.forcerArretLecture();
			this.evenementListeOnglets(aGenreOnglet);
		});
	}
	composeOnglet(aEle, aNiveau) {
		const lClasses = ["collection-item", "with-action"];
		if (aEle.imagePerso) {
			lClasses.push(aEle.imagePerso);
		}
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"li",
					{
						id: aEle.idNotif || "",
						class: lClasses.join(" "),
						"ie-node": this.jsxGetNodeOnglet.bind(this, aEle.getGenre()),
						tabindex: "0",
						role: "menuitem",
					},
					IE.jsx.str("span", null, aEle.getLibelle()),
				),
			),
		);
		return H.join("");
	}
	focusTitre() {
		$("#" + this.idTitre.escapeJQ()).focus();
	}
	setOnglet(aGenreOnglet) {
		this.actualiserTitre(aGenreOnglet);
	}
	evenementListeOnglets(aGenre) {
		this.callback.appel(aGenre, true, true);
	}
	recupererDonnees() {
		this.actionSurRecupererDonnees();
	}
	traiterListeOnglets() {
		const lThis = this;
		lThis.listeOnglets.parcourir((aElePere) => {
			if (!aElePere.onglet) {
				const lElePere = MethodesObjet_1.MethodesObjet.dupliquer(aElePere);
				lThis.listeOngletsTraitee.addElement(lElePere);
				lElePere.children = new ObjetListeElements_1.ObjetListeElements();
				lThis.listeOnglets.parcourir((aEleFils) => {
					if (
						aEleFils.onglet &&
						aEleFils.onglet.getGenre() === aElePere.getGenre()
					) {
						const lEleFils = MethodesObjet_1.MethodesObjet.dupliquer(aEleFils);
						lElePere.children.addElement(lEleFils);
					}
				});
			}
		});
	}
	traiterListeRessource() {}
	actionSurRecupererDonnees() {}
	actualiserTitre(aParam) {}
	getEspaceIcone() {
		return "";
	}
	getGenreOngletAccueil() {
		return false;
	}
	avecBtnSeDeconnecter() {
		return (
			!(0, AccessApp_1.getApp)().estAppliMobile ||
			(0, AccessApp_1.getApp)().infoAppliMobile.avecExitApp
		);
	}
	seDeconnecter() {
		if (GEtatUtilisateur.EtatSaisie) {
			this.callback.appel(
				GEtatUtilisateur.getGenreOnglet(),
				null,
				null,
				null,
				new Callback_1.Callback(this, this.actionSeDeconnecter),
			);
		} else {
			this.actionSeDeconnecter();
		}
	}
	actionSeDeconnecter() {
		if ((0, AccessApp_1.getApp)().estAppliMobile) {
			UtilitaireDeconnexion_1.UtilitaireDeconnexion.deconnexion().then(() => {
				this.seDeconnecterAppliMobile();
			});
		} else {
			UtilitaireDeconnexion_1.UtilitaireDeconnexion.deconnexion();
		}
	}
	surClickAccueil() {
		UtilitaireSyntheseVocale_1.SyntheseVocale.forcerArretLecture();
		this.evenementListeOnglets(this.getGenreOngletAccueil());
	}
	seDeconnecterAppliMobile() {
		if ((0, AccessApp_1.getApp)().estAppliMobile) {
			window.messageData.push({ action: "exitApp" });
		}
	}
	composeOngletMobileApp() {
		if ((0, AccessApp_1.getApp)().estAppliMobile) {
			return IE.jsx.str(
				"li",
				{
					"ie-node": "getNodeChangerProfil",
					role: "menuitem",
					tabindex: "0",
					class: "collection-item with-action collection-static-item",
				},
				IE.jsx.str(
					"span",
					null,
					TraductionsAppliMobile_1.TradAppliMobile.ChangerCompte,
				),
			);
		}
		return "";
	}
	composeBoutonCentraleNotif() {
		if (this.wrapperNotifs) {
			return [
				'<ie-btnimage class="image_centrale_notification btnImageIcon badged-btn icon-title" ie-model="btnNotifications" ie-html="getHtmlBtnNotif" title="',
				ObjetTraduction_1.GTraductions.getValeur("Mobile.Menu.Notifs"),
				'" aria-label="',
				ObjetCentraleNotifications_1.TradObjetCentraleNotifications
					.TitreNotifications,
				'"><span style="color:red;">Notif</span></ie-btnimage>',
			].join("");
		}
		return "";
	}
	composeBoutonAideContextuelle() {
		if (this.wrapperAide) {
			return [
				'<ie-btnicon class="icon_base_connaissance btnImageIcon badged-btn icon-title" ie-model="aideContextuelle.bouton" ie-html="aideContextuelle.html" title="',
				ObjetTraduction_1.GTraductions.getValeur("Commande.Aide.Actif"),
				'" aria-label="',
				ObjetTraduction_1.GTraductions.getValeur("Commande.Aide.Actif"),
				'" ie-if="aideContextuelle.affiche"><span style="color:red;"></span></ie-btnicon>',
			].join("");
		}
		return "";
	}
	composeBadgeBtn(aNb, aWAI) {
		return [
			'<span class="sr-only">',
			aWAI,
			"</span>",
			aNb > 0
				? ['<span class="as-tag">', aNb > 99 ? "99+" : aNb, "</span>"].join("")
				: "",
		].join("");
	}
	getActionneurCentraleNotification() {
		return null;
	}
	composeBoutonMenuSupp() {
		return "";
	}
	getInfosComboMembre(aMembre) {
		return null;
	}
	_construireEnteteRessource(aRessource) {
		const lInfos = this.getInfosComboMembre(aRessource);
		const lClass = ["label-membre"];
		if (this.avecListeRessources) {
			lClass.push("avec-membre");
		}
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ class: "membre-photo_container" },
				IE.jsx.str(
					"div",
					{
						class: ["membre-photo", this.getEspaceIcone()],
						role: "presentation",
					},
					" ",
					lInfos.photo || "",
				),
				IE.jsx.str(
					"span",
					{
						class: lClass,
						id: this.idTitre,
						tabindex: "0",
						role: "heading",
						"aria-level": "2",
					},
					lInfos.libelle,
					this.avecListeRessources &&
						IE.jsx.str("i", {
							"aria-hidden": "true",
							class: "icon_angle_down p-left",
						}),
				),
			),
		);
	}
	_composeBoutonMenu() {
		const H = [];
		H.push(
			'<div class="home-action-conteneur">',
			IE.jsx.str(
				"div",
				{ class: "toggler-btn", "ie-node": "nodeClosePanel", tabindex: "0" },
				IE.jsx.str("i", {
					class: "icon_menu_burger",
					role: "img",
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"accueil.menuPrincipal",
					),
				}),
			),
		);
		H.push("</div>");
		H.push('<div class="notifs-conteneur">');
		H.push("<hr />");
		H.push(this.composeBoutonMenuSupp());
		H.push("</div>", '<div class="cta-mobile-conteneur">');
		H.push("<hr />");
		if (this.avecBtnSeDeconnecter()) {
			H.push(
				'<ie-btnimage class="icon_off btnImageIcon badged-btn" ie-node="nodeSeDeconnecter" ie-hint="',
				ObjetTraduction_1.GTraductions.getValeur("connexion.SeDeconnecter"),
				'" aria-label="',
				ObjetTraduction_1.GTraductions.getValeur("connexion.SeDeconnecter"),
				'"></ie-btnimage>',
			);
		}
		H.push("</div>");
		return H.join("");
	}
}
exports._InterfacePagePageMenuOnglets = _InterfacePagePageMenuOnglets;
