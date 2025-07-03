exports._ObjetEnteteMobile = exports.EGenreCommandeMobile = void 0;
const Invocateur_1 = require("Invocateur");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDonneesCentraleNotifications_1 = require("ObjetDonneesCentraleNotifications");
const AccessApp_1 = require("AccessApp");
var EGenreCommandeMobile;
(function (EGenreCommandeMobile) {
	EGenreCommandeMobile[(EGenreCommandeMobile["SeDeconnecter"] = 0)] =
		"SeDeconnecter";
	EGenreCommandeMobile[(EGenreCommandeMobile["Valider"] = 1)] = "Valider";
	EGenreCommandeMobile[(EGenreCommandeMobile["Accueil"] = 2)] = "Accueil";
	EGenreCommandeMobile[(EGenreCommandeMobile["MenuOnglets"] = 3)] =
		"MenuOnglets";
})(
	EGenreCommandeMobile ||
		(exports.EGenreCommandeMobile = EGenreCommandeMobile = {}),
);
class _ObjetEnteteMobile extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.idTitre = this.Nom + "_Titre";
		this.idPageAccueil = this.Nom + "_Btn_Accueil";
		this.idMenuOnglets = this.Nom + "_Btn_MenuOnglets";
		this.idLienMenuOnglets = this.Nom + "_Lien_MenuOnglets";
		this.idValider = this.Nom + "_Btn_Valider";
		this.idCtnPhoto = this.Nom + "_CtnPhoto";
		Invocateur_1.Invocateur.abonner(
			Invocateur_1.ObjetInvocateur.events.etatSaisie,
			this._setEtatSaisie.bind(this),
			this,
		);
		Invocateur_1.Invocateur.abonner(
			ObjetDonneesCentraleNotifications_1.ObjetDonneesCentraleNotifications
				.typeNotif.surModification,
			() => {
				$("#" + this.idLienMenuOnglets.escapeJQ())
					.find(".new-badge")
					.remove();
				const lNb = this._getNbNotifs();
				if (lNb > 0) {
					$("#" + this.idLienMenuOnglets.escapeJQ()).append(
						this._getHtmlNotifs(lNb),
					);
				}
			},
			this,
		);
	}
	construireAffichage() {
		const lHTML = [];
		const lClasseCssNoImg = this.getClassNoImg();
		let lBaliseImg = this.getImageUtilisateurOuMembre();
		const lClasses = ["photo-circle"];
		if (!lBaliseImg) {
			lClasses.push(lClasseCssNoImg);
		}
		const lDivPhoto = [];
		lDivPhoto.push(
			'<div id="',
			this.idCtnPhoto,
			'" class="',
			lClasses.join(" "),
			'">',
		);
		if (!!lBaliseImg) {
			lDivPhoto.push(lBaliseImg);
		}
		lDivPhoto.push("</div>");
		lHTML.push(
			"<nav>",
			'<div class="nav-wrapper main-header disable-dark-mode">',
			'<div class="header-gauche" ie-node="getNodeTitre">',
			lDivPhoto.join(""),
			"</div>",
			'<div class="header-droit">',
			IE.jsx.str("div", {
				class: "infos-container",
				tabindex: "0",
				role: "heading",
				"aria-level": "1",
				id: this.idTitre,
			}),
			'<ul class="btn-container disable-dark-mode">',
			IE.jsx.str(
				"li",
				{ id: this.idValider },
				IE.jsx.str("a", {
					class: "btn-menu icon_ok",
					tabindex: "0",
					role: "button",
					"ie-node": this.surClickBouton.bind(
						this,
						EGenreCommandeMobile.Valider,
					),
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"Commande.Validation.Actif",
					),
				}),
			),
		);
		if (GEtatUtilisateur.avecPageAccueil()) {
			lHTML.push(
				IE.jsx.str(
					"li",
					{ id: this.idPageAccueil },
					IE.jsx.str("a", {
						role: "button",
						tabindex: "0",
						"ie-node": this.surClickBouton.bind(
							this,
							EGenreCommandeMobile.Accueil,
						),
						class: "btn-menu icon_home",
						"aria-label": ObjetTraduction_1.GTraductions.getValeur(
							"Commande.Accueil.Actif",
						),
					}),
				),
			);
		}
		if (!!this.idPanel) {
			const libelleBtnMenuOnglets =
				this.nEstPasMobileAppariteurHP() && !!this.idPanel
					? ObjetTraduction_1.GTraductions.getValeur("accueil.menuPrincipal")
					: "";
			const lNbNotifs = this._getNbNotifs();
			lHTML.push(
				IE.jsx.str(
					"li",
					{ id: this.idMenuOnglets },
					IE.jsx.str(
						"a",
						{
							class: "btn-menu icon_menu_burger",
							id: this.idLienMenuOnglets,
							role: "button",
							tabindex: "0",
							"ie-node": this.surClickBouton.bind(
								this,
								EGenreCommandeMobile.MenuOnglets,
							),
							"aria-label": libelleBtnMenuOnglets || "",
						},
						lNbNotifs > 0 ? this._getHtmlNotifs(lNbNotifs) : "",
					),
				),
			);
		}
		lHTML.push("</ul>", "</div>", "</div>", "</nav>");
		return lHTML.join("");
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getNodeTitre: function () {
				$(this.node).on("click", () => {
					Invocateur_1.Invocateur.evenement("ouvrir_selecteurMembre");
				});
			},
		});
	}
	nEstPasMobileAppariteurHP() {
		return true;
	}
	setParametres(aParam) {
		this.idPanel = aParam.idPanel;
	}
	actualiserTitre() {}
	focusTitre() {
		$("#" + this.idTitre.escapeJQ()).focus();
	}
	_setEtatSaisie(aVisible) {
		ObjetHtml_1.GHtml.setDisplay(this.idValider, aVisible);
	}
	setBoutonAccueil(aBoolean) {
		ObjetHtml_1.GHtml.setDisplay(
			this.idPageAccueil,
			aBoolean &&
				GEtatUtilisateur.avecPageAccueil() &&
				!(0, AccessApp_1.getApp)().acces.estConnexionDirect(),
		);
	}
	surClickBouton(i, aNode) {
		$(aNode).eventValidation(() => {
			if ((0, AccessApp_1.getApp)().getCommunication().requeteEnCours()) {
				return;
			}
			this.callback.appel(i);
		});
	}
	composeNotificationsApplicatives() {
		return "";
	}
	_getNbNotifs() {
		const lDonnees = (0,
		AccessApp_1.getApp)().donneesCentraleNotifications.getDonnees();
		return lDonnees.nbNotifs + (lDonnees.nbConversationEnCours || 0);
	}
	_getHtmlNotifs(aNb) {
		return IE.jsx.str("span", { class: "new-badge" }, aNb > 999 ? "999+" : aNb);
	}
	updatePhoto() {
		var _a, _b, _c, _d;
		let lBaliseImg = this.getImageUtilisateurOuMembre();
		if (lBaliseImg.length > 0) {
			(_b =
				(_a = ObjetHtml_1.GHtml.getElement(this.idCtnPhoto)) === null ||
				_a === void 0
					? void 0
					: _a.classList) === null || _b === void 0
				? void 0
				: _b.remove(this.getClassNoImg());
		} else {
			(_d =
				(_c = ObjetHtml_1.GHtml.getElement(this.idCtnPhoto)) === null ||
				_c === void 0
					? void 0
					: _c.classList) === null || _d === void 0
				? void 0
				: _d.add(this.getClassNoImg());
		}
		ObjetHtml_1.GHtml.setHtml(this.idCtnPhoto, lBaliseImg, {
			controleur: this.controleur,
		});
	}
	getImageUtilisateurOuMembre() {
		const lUtilisateurOuMembre = this.estAvecMembre()
			? GEtatUtilisateur.getMembre()
			: GEtatUtilisateur.getUtilisateur();
		let lBaliseImg = "";
		if (
			!!lUtilisateurOuMembre &&
			!!lUtilisateurOuMembre.avecPhoto &&
			lUtilisateurOuMembre.photoBase64
		) {
			const lUrlPhoto =
				"data:image/png;base64," + lUtilisateurOuMembre.photoBase64;
			lBaliseImg =
				'<img id="idPhotoMembre" src="' +
				lUrlPhoto +
				'" onerror="$(this).parent().addClass(\'' +
				this.getClassNoImg() +
				'\'); $(this).hide();" alt="' +
				ObjetTraduction_1.GTraductions.getValeur(
					"PhotoDe_S",
					lUtilisateurOuMembre.getLibelle(),
				) +
				'"/>';
		}
		return lBaliseImg;
	}
	estAvecMembre() {
		return GParametres.avecMembre;
	}
	getClassNoImg() {
		return "no-img";
	}
}
exports._ObjetEnteteMobile = _ObjetEnteteMobile;
