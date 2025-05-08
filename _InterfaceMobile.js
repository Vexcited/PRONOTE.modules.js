exports._InterfaceMobile = void 0;
const GUID_1 = require("GUID");
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetInterface_1 = require("ObjetInterface");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const ObjetSupport_1 = require("ObjetSupport");
const ObjetTraduction_1 = require("ObjetTraduction");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const ObjetFenetre_1 = require("ObjetFenetre");
const c_largeurMenuOnglet = 360;
class _InterfaceMobile extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.applicationPoduit = GApplication;
		this.largeur = "100%";
		this.hauteur = "100%";
		this.idZonePrincipale = this.Nom + "_zonePrincipale";
		if (ObjetSupport_1.Support.supportEventOnPopState) {
			$(window)
				.off("popstate")
				.on("popstate", { instance: this }, this._surPopState);
		}
		Invocateur_1.Invocateur.abonner(
			"OuvrirFenetreLienPDF",
			this._surOuvrirLienPDF.bind(this),
		);
		Invocateur_1.Invocateur.abonner(
			Invocateur_1.ObjetInvocateur.events.navigationOnglet,
			(aOnglet, aParams) => {
				const lParams = Object.assign(
					{
						fermerMenu: false,
						ajouterHistorique: true,
						genreAffichage: undefined,
					},
					aParams,
				);
				this.evenementSurOnglet(
					aOnglet,
					lParams.fermerMenu,
					lParams.ajouterHistorique,
					lParams.genreAffichage,
				);
			},
			this,
		);
		Invocateur_1.Invocateur.abonner(
			Invocateur_1.ObjetInvocateur.events.changerMembre,
			(aMembre) => {
				(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
					this.changementMembre(aMembre);
				});
			},
			this,
		);
	}
	getIdentPageMobile() {
		return this.identPageMobile;
	}
	detruireInstances() {
		$(window).off("popstate");
		$(document).off("touchmove.menuonglet touchend.menuonglet");
	}
	setParametresGeneraux() {
		this.AvecCadre = false;
	}
	_construireInstances(aParam) {
		this.identPageMobile = this.add(
			InterfacePage_Mobile_1.InterfacePage_Mobile,
		);
		if (
			(!aParam || !aParam.sansMenuOnglet) &&
			this.options.InterfacePageMenuOnglets
		) {
			this.idMenuOnglets = this.add(
				this.options.InterfacePageMenuOnglets,
				this.evenementSurOnglet,
				this.initMenuOnglet,
			);
		}
		if (this.options.ObjetEnteteMobile) {
			this.identEnteteMobile = this.add(
				this.options.ObjetEnteteMobile,
				this.evenementEnteteMobile,
				this.initEntete,
			);
		}
		this.IdentBandeauPied = this.ajouterBandeauPied();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getDragMenu() {
				return {
					start(aParamsDrag) {
						const lPos = Math.min(
							c_largeurMenuOnglet,
							Math.max(0, aParamsDrag.offset.x),
						);
						if (lPos > 0) {
							$(aParamsDrag.node).addClass("ie-draggable-handle");
						} else {
							return false;
						}
					},
					drag(aParamsDrag) {
						const lPos = Math.min(
							c_largeurMenuOnglet,
							Math.max(0, aParamsDrag.offset.x),
						);
						aParamsDrag.currentFermeture = lPos / c_largeurMenuOnglet;
						$(aParamsDrag.node).css("right", -lPos);
						$(aInstance._getSelectorOverlayMenu()).css(
							"opacity",
							1 - aParamsDrag.currentFermeture,
						);
					},
					stop(aParamsDrag) {
						$(aParamsDrag.node).removeClass("ie-draggable-handle");
						if (aParamsDrag.currentFermeture > 0.3) {
							aInstance.fermerMenuOnglet(aParamsDrag);
						} else if (aParamsDrag.currentFermeture > 0) {
							aInstance.ouvrirMenuOnglet(aParamsDrag);
						}
					},
					autoriserEventMove: true,
				};
			},
			afficherMasquerFooter() {
				return (
					aInstance.GenreOnglet === null ||
					aInstance.GenreOnglet === aInstance.getGenreOngletAccueil()
				);
			},
		});
	}
	initMenuOnglet(aInstance) {
		aInstance.setParametres({
			avecListeRessources: this.avecChangementRessource(),
		});
	}
	changementMembre(aMembre) {}
	changementRessource(aElement) {}
	avecChangementRessource() {
		return false;
	}
	getListeRessources() {}
	ajouterBandeauPied() {
		return null;
	}
	construireStructureAffichage() {
		const lZones = [];
		if (this.idMenuOnglets !== undefined) {
			lZones.push(
				`<div id="${this.getInstance(this.idMenuOnglets).getNom()}" class="side-menu-mobile disable-dark-mode ie-draggable-x" ie-draggable="getDragMenu"></div>`,
			);
		}
		const lAfficherFooter =
			(!GNavigateur.isAndroid && !GNavigateur.isIOS) ||
			(GNavigateur.isIOS &&
				GNavigateur.versionIOS &&
				(GNavigateur.versionIOS[0] > 10 ||
					(GNavigateur.versionIOS[0] === 10 &&
						GNavigateur.versionIOS[1] > 3))) ||
			(GNavigateur.isAndroid &&
				GNavigateur.versionAndroid &&
				GNavigateur.versionAndroid[0] >= 6);
		lZones.push(
			'<div id="',
			this.getInstance(this.identEnteteMobile).getNom(),
			'" class="navbar-fixed"></div>',
			'<div class="content-mobile-wrapper">',
			'<div id="',
			this.applicationPoduit.idLigneBandeau,
			'" style="display:none;" class="objetInterfaceMobile_zoneSelection"></div>',
			'<div id="',
			this.idZonePrincipale,
			'" role="main" class="objetInterfaceMobile_zonePrincipale">',
			'<div id="',
			this.getInstance(this.identPageMobile).getNom(),
			'" class="objetInterfaceMobile_identPage"></div>',
			"</div>",
			this.IdentBandeauPied >= 0 && lAfficherFooter
				? '<div class="footer-mobile" ie-display="afficherMasquerFooter" id="' +
						this.getInstance(this.IdentBandeauPied).getNom() +
						'" ></div>'
				: "",
		);
		lZones.push("</div>");
		return lZones.join("");
	}
	recupererDonnees() {
		this.actionSurRecupererDonnees();
	}
	getEtatSaisie() {
		return GEtatUtilisateur.EtatSaisie;
	}
	getGenreOnglet() {
		return null;
	}
	getGenreOngletAccueil() {
		return null;
	}
	_ajouterHistorique(aOnglet, aGenreAffichage) {
		if (!!aOnglet && ObjetSupport_1.Support.supportEventOnPopState) {
			try {
				window.history.pushState(
					{
						onglet: aOnglet,
						genreAffichage: aGenreAffichage,
						numeroSession:
							this.applicationPoduit.getCommunication().NumeroDeSession,
					},
					"",
				);
			} catch (e) {}
		}
	}
	evenementPageMobile(aParam) {}
	evenementEnteteMobile(aGenreBoutonMobile, aSens) {}
	getPageCourante() {
		return this.getInstance(this.identPageMobile);
	}
	traiterEvenementConfirmationSortie() {
		if (this.genreOngletSuivant) {
			this.setEtatSaisie(false);
			this.evenementSurOnglet(this.genreOngletSuivant, true, true);
			this.genreOngletSuivant = null;
		}
	}
	initEntete(aInstance) {
		if (this.idMenuOnglets !== undefined) {
			aInstance.setParametres({
				idPanel: this.getInstance(this.idMenuOnglets).getNom(),
			});
		}
	}
	openPanel(aHtml, aParametresHtml) {
		let lAnimationOuverture = true;
		if (this._fenetrePanel) {
			lAnimationOuverture = false;
			this._fenetrePanel.setOptionsFenetre({
				avecAnimationFermeture: lAnimationOuverture,
			});
			this._fenetrePanel.fermer();
			this._fenetrePanel = null;
		}
		const lParametresHtml = Object.assign(
			{ controleur: null, optionsFenetre: null },
			aParametresHtml,
		);
		this._fenetrePanel = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{
				pere: this,
				initialiser: (aFenetre) => {
					Object.assign(aFenetre.controleur, lParametresHtml.controleur);
					aFenetre.setOptionsFenetre(
						Object.assign(
							{
								fermerFenetreSurClicHorsFenetre: true,
								empilerFenetre: false,
								heightMax_mobile: true,
								listeBoutons: [],
								avecCroixFermeture: !!(
									lParametresHtml.optionsFenetre &&
									lParametresHtml.optionsFenetre.titre
								),
								avecAnimationOuverture: lAnimationOuverture,
								callbackApresFermer: () => {
									var _a, _b;
									this._fenetrePanel = null;
									(_b =
										(_a = lParametresHtml.optionsFenetre) === null ||
										_a === void 0
											? void 0
											: _a.callbackApresFermer) === null || _b === void 0
										? void 0
										: _b.call(_a);
								},
							},
							lParametresHtml.optionsFenetre,
						),
					);
				},
			},
		);
		this._fenetrePanel.afficher(aHtml);
	}
	closePanel() {
		if (this._fenetrePanel) {
			this._fenetrePanel.fermer();
			this._fenetrePanel = null;
		}
	}
	evenementSurOnglet(
		aGenreOnglet,
		aFermerMenu,
		aAjouterHistorique,
		aGenreAffichage,
	) {
		if (
			this.getEtatSaisie() === true &&
			!this.applicationPoduit.getModeExclusif()
		) {
			this.genreOngletSuivant = MethodesObjet_1.MethodesObjet.isNumeric(
				aGenreOnglet,
			)
				? parseInt(aGenreOnglet)
				: aGenreOnglet;
			(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(
				this.traiterEvenementConfirmationSortie.bind(this),
			);
		} else {
			this.setEtatSaisie(false);
			const lFermerMenu =
				aFermerMenu !== null && aFermerMenu !== undefined ? aFermerMenu : true;
			const lAjouterHistorique =
				aAjouterHistorique !== null && aAjouterHistorique !== undefined
					? aAjouterHistorique
					: true;
			this.genreOngletSuivant = null;
			this.genreOngletPrecedent = this.GenreOnglet;
			this.GenreOnglet = MethodesObjet_1.MethodesObjet.isNumeric(aGenreOnglet)
				? parseInt(aGenreOnglet)
				: aGenreOnglet;
			if (aGenreAffichage) {
				this.genreAffichage = aGenreAffichage;
			} else {
				this.genreAffichage = null;
			}
			if (GEtatUtilisateur.setGenreAffichage) {
				GEtatUtilisateur.setGenreAffichage(this.genreAffichage);
			}
			if (!!this.idMenuOnglets) {
				this.getInstance(this.idMenuOnglets).setOnglet(aGenreOnglet);
			}
			this.actionSurEvenementOnglet(lFermerMenu);
			if (lAjouterHistorique) {
				this._ajouterHistorique(aGenreOnglet, aGenreAffichage);
			}
		}
	}
	async evenementAvantAffichageOnglet(aGenreOnglet, aGenreOngletPrec) {}
	actionSurEvenementOnglet(aFermerMenu) {
		if (aFermerMenu) {
			this.fermerMenuOnglet();
		}
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.fermerFenetres,
		);
		if (
			this.getInstance(this.identPageMobile) &&
			this.getInstance(this.identPageMobile).free
		) {
			this.getInstance(this.identPageMobile).free();
		}
		this.Instances[this.identPageMobile] = null;
		$("#" + this.applicationPoduit.idLigneBandeau.escapeJQ())
			.html("")
			.hide();
		if (this.applicationPoduit.estAppliMobile) {
			window.messageData.push({ action: "actionOnglet" });
		}
		$('body > [id^="select-options"]').remove();
		let lInstancePage;
		try {
			lInstancePage = this._getConstructeurOnglet(this.GenreOnglet, {
				nomComplet: this.getZoneId(this.identPageMobile),
				pere: this,
				evenement: this.evenementPageMobile,
			});
		} catch (e) {
			return;
		}
		this.Instances[this.identPageMobile] = lInstancePage;
		lInstancePage.setGenreAffichage(this.genreAffichage);
		GEtatUtilisateur.setGenreOnglet(this.GenreOnglet);
		this.evenementAvantAffichageOnglet(
			this.GenreOnglet,
			this.genreOngletPrecedent,
		);
		this.getInstance(this.identEnteteMobile).setBoutonAccueil(true);
		this.getInstance(this.identEnteteMobile).actualiserTitre();
		lInstancePage.initialiser();
		if (this.genreAffichage !== null && this.genreAffichage !== undefined) {
			GEtatUtilisateur.resetPage();
		}
		this.getInstance(this.identEnteteMobile).focusTitre();
		this.$refreshSelf();
	}
	ouvrirMenuOnglet(aParamsDrag) {
		const lThis = this;
		const lInstOnglets = this.getInstance(this.idMenuOnglets);
		if (lInstOnglets) {
			if ($(this._getSelectorOverlayMenu()).length === 0) {
				$("#div").append(`<div class="overlay-side-menu-mobile"></div>`);
			}
			const lJOverlay = $(this._getSelectorOverlayMenu());
			const lCurrentPos = aParamsDrag ? 1 - aParamsDrag.currentFermeture : 0;
			lJOverlay
				.off("pointerdown")
				.one("pointerdown", () => {
					lThis.fermerMenuOnglet();
				})
				.css({ display: "block", opacity: lCurrentPos });
			$(`#${lInstOnglets.getNom().escapeJQ()}`)
				.finish()
				.animate(
					{ right: 0 },
					{
						duration: 250,
						step(aNow, fx) {
							lJOverlay.css({
								opacity: Math.min(1, lCurrentPos + fx.pos * (1 - lCurrentPos)),
							});
						},
						done() {
							lInstOnglets.focusTitre();
						},
					},
				);
		}
	}
	fermerMenuOnglet(aParamsDrag) {
		const lInstOnglets = this.getInstance(this.idMenuOnglets);
		if (lInstOnglets) {
			const lJOverlay = $(this._getSelectorOverlayMenu());
			const lCurrentPos = aParamsDrag ? 1 - aParamsDrag.currentFermeture : 1;
			$(`#${lInstOnglets.getNom().escapeJQ()}`)
				.finish()
				.animate(
					{ right: -c_largeurMenuOnglet - 10 },
					{
						duration: 250,
						step(aNow, fx) {
							lJOverlay.css({
								opacity: Math.max(0, lCurrentPos - fx.pos * lCurrentPos),
							});
						},
						done() {
							lJOverlay.remove();
						},
					},
				);
		}
	}
	actionSurRecupererDonnees() {}
	_surOuvrirLienPDF(aUrl) {
		const T = [];
		const lId = GUID_1.GUID.getId();
		T.push(
			'<a href="' + aUrl + '" id="',
			lId,
			'" class="link" target="_blank">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.Lien.CliquerIci",
				) +
				"</a>",
		);
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{
				pere: this,
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"GenerationPDF.Lien.TitreLienPDF",
						),
					});
				},
			},
		);
		lFenetre.afficher(T.join(""));
		$("#" + lId).click(() => {
			if (!!lFenetre) {
				lFenetre.fermer();
			}
		});
	}
	_getConstructeurOnglet(aOnglet, aParamsConstructeur) {
		return null;
	}
	_surPopState(event) {
		const lEtat = event.originalEvent.state,
			lInstance = event.data.instance;
		if (
			!lEtat ||
			lEtat.onglet === undefined ||
			lEtat.numeroSession !==
				lInstance.applicationPoduit.getCommunication().NumeroDeSession
		) {
			event.stopImmediatePropagation();
			if (!lInstance.applicationPoduit.estAppliMobile) {
				setTimeout(() => {
					lInstance.applicationPoduit
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message:
								ObjetTraduction_1.GTraductions.getValeur("mobile.confirmDeco"),
							callback: this._evenementPrecedentSuivantDeconnexion,
						});
				}, 10);
			} else {
				event.preventDefault();
			}
		} else {
			if (lInstance._surForward) {
				delete lInstance._surForward;
				return;
			}
			(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
				lInstance.evenementSurOnglet(
					lEtat.onglet,
					null,
					false,
					lEtat.genreAffichage,
				);
			});
		}
	}
	_evenementPrecedentSuivantDeconnexion(aAccepte) {
		if (aAccepte === Enumere_Action_1.EGenreAction.Valider) {
			window.location.reload();
		} else {
			this._surForward = true;
			window.history.forward();
		}
	}
	_getSelectorOverlayMenu() {
		return `#${this.applicationPoduit.getIdConteneur()} .overlay-side-menu-mobile`;
	}
}
exports._InterfaceMobile = _InterfaceMobile;
