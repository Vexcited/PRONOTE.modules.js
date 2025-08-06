exports.ObjetWrapperCentraleNotifications_Espace = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const Invocateur_1 = require("Invocateur");
const ObjetCentraleNotifications_1 = require("ObjetCentraleNotifications");
const IEZoneFenetre_1 = require("IEZoneFenetre");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetDonneesCentraleNotifications_1 = require("ObjetDonneesCentraleNotifications");
const GestionnaireModale_1 = require("GestionnaireModale");
const AccessApp_1 = require("AccessApp");
class ObjetWrapperCentraleNotifications_Espace extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.idConteneur = this.Nom + "_conteneurNotifs";
		this.donneesCentraleNotifications = (0,
		AccessApp_1.getApp)().donneesCentraleNotifications;
		this.options = { modeBtnEntete: false, actionneur: null };
		Invocateur_1.Invocateur.abonner(
			ObjetDonneesCentraleNotifications_1.ObjetDonneesCentraleNotifications
				.typeNotif.surModification,
			(aParams) => {
				const lBoutonNotif = $(".bcne_btn_entete");
				if (!aParams.masquerNbNotifs) {
					aParams.nbNotifs > 0
						? lBoutonNotif.removeClass("bcne_btn_entete_vide")
						: lBoutonNotif.addClass("bcne_btn_entete_vide");
				} else if (aParams.nbNotifs === 0) {
					lBoutonNotif.addClass("bcne_btn_entete_vide");
				}
			},
			this,
		);
		Invocateur_1.Invocateur.abonner(
			Invocateur_1.ObjetInvocateur.events.fermerFenetres,
			() => {
				if (this.instanceNotif) {
					this.instanceNotif.fermer();
				}
			},
			this,
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			eventOut: function () {
				const lNodesExclus = [aInstance.nodeBtn];
				return {
					nodesExclus: lNodesExclus,
					callback: function () {
						if (aInstance.instanceNotif) {
							aInstance.instanceNotif.fermer();
						}
					},
				};
			},
			btn: {
				event: function () {
					aInstance._eventBtn(this.node);
				},
				getTitle() {
					return ObjetCentraleNotifications_1.ObjetCentraleNotifications.getMessageNotifications(
						aInstance.donneesCentraleNotifications,
					);
				},
			},
			getNodeBtn: function () {
				$(this.node).eventValidation(function () {
					aInstance._eventBtn(this);
				});
			},
			getClassBtnEntete: function () {
				return aInstance.donneesCentraleNotifications.nbNotifs === 0
					? "bcne_btn_entete_vide"
					: "";
			},
			compteur: {
				getHtml: function () {
					return aInstance.donneesCentraleNotifications.nbNotifs > 99
						? "99+"
						: aInstance.donneesCentraleNotifications.nbNotifs;
				},
				afficher: function () {
					return aInstance.donneesCentraleNotifications.nbNotifs > 0;
				},
			},
			getHtmlWAINotif() {
				return ObjetCentraleNotifications_1.ObjetCentraleNotifications.getMessageNotifications(
					aInstance.donneesCentraleNotifications,
				);
			},
		});
	}
	construireAffichage() {
		return IE.jsx.str(
			"div",
			{ class: "ObjetWrapperCentraleNotifications_Espace" },
			this.options.modeBtnEntete
				? IE.jsx.str("button", {
						"ie-node": "getNodeBtn",
						"ie-title": "btn.getTitle",
						"aria-haspopup": "menu",
						class: "bcne_btn_entete",
						"ie-class": "getClassBtnEntete",
					})
				: IE.jsx.str("ie-btnimage", {
						class: "image_centrale_notification btnImageIcon",
						"ie-model": "btn",
						"aria-haspopup": "dialog",
					}),
			IE.jsx.str("div", {
				"ie-html": "compteur.getHtml",
				"ie-if": "compteur.afficher",
				class: "bcne_compteur_notif",
				"aria-hidden": "true",
			}),
			IE.jsx.str("p", {
				"ie-html": "getHtmlWAINotif",
				class: "sr-only",
				role: "alert",
				style: "color:var(--color-text-light)",
			}),
		);
	}
	_eventBtn(aNodeBtn) {
		this.nodeBtn = aNodeBtn;
		clearTimeout(this._timerFermeture);
		const lBoutonNotif = $("#" + this.Nom.escapeJQ() + " .bcne_btn_entete");
		lBoutonNotif.addClass("bcne_btn_entete_vide");
		if (!this.instanceNotif) {
			const c_timer_ouverture = 500;
			this.instanceNotif =
				new ObjetCentraleNotifications_1.ObjetCentraleNotifications({
					pere: this,
					evenement: () => {
						$(".bcne_conteneur_notif").removeClass("bcne_open");
						clearTimeout(this._timerFermeture);
						GestionnaireModale_1.GestionnaireModale.abonnementPremierPlan(
							false,
							this.instanceNotif.getNom(),
						);
						GestionnaireModale_1.GestionnaireModale.abonnementBlocageInterface(
							false,
							this.instanceNotif.getNom(),
						);
						this._timerFermeture = setTimeout(() => {
							this.instanceNotif.free();
							this.instanceNotif = null;
						}, c_timer_ouverture);
					},
				});
			ObjetHtml_1.GHtml.addHtml(
				IEZoneFenetre_1.ZoneFenetre.getElementZoneFenetre(),
				'<div style="z-index:1100;" class="bcne_conteneur_notif' +
					(this.options.modeBtnEntete ? " bcne_conteneur_entete" : "") +
					'" id="' +
					this.instanceNotif.getNom() +
					'" ie-eventout="eventOut"></div>',
				{ controleur: this.controleur },
			);
			GestionnaireModale_1.GestionnaireModale.abonnementBlocageInterface(
				true,
				this.instanceNotif.getNom(),
			);
			GestionnaireModale_1.GestionnaireModale.abonnementPremierPlan(
				true,
				this.instanceNotif.getNom(),
			);
			GestionnaireModale_1.GestionnaireModale.enPremierPlan(
				this.instanceNotif.getNom(),
			);
			this.instanceNotif.setOptions({
				actionneur: this.options.actionneur,
				timerOuverture: c_timer_ouverture,
				simulerFenetre: true,
			});
			this.instanceNotif.initialiser();
			$(".bcne_conteneur_notif").addClass("bcne_open");
		} else {
			this.instanceNotif.fermer();
		}
	}
}
exports.ObjetWrapperCentraleNotifications_Espace =
	ObjetWrapperCentraleNotifications_Espace;
