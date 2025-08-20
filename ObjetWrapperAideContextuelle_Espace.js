exports.ObjetWrapperAideContextuelle_Espace = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const Invocateur_1 = require("Invocateur");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetAideContextuelle_1 = require("ObjetAideContextuelle");
const IEZoneFenetre_1 = require("IEZoneFenetre");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetChaine_1 = require("ObjetChaine");
const GestionnaireModale_1 = require("GestionnaireModale");
const IEHtml_1 = require("IEHtml");
class ObjetWrapperAideContextuelle_Espace extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.idConteneur = this.Nom + "_conteneurAideContextuelle";
		this.nombre = 0;
		this.options = { modeBtnEntete: false, listeOnglets: null };
		Invocateur_1.Invocateur.abonner(
			Invocateur_1.ObjetInvocateur.events.fermerFenetres,
			() => {
				if (this.instanceAide) {
					this.instanceAide.fermer();
				}
			},
			this,
		);
		Invocateur_1.Invocateur.abonner(
			"surNavigationOnglet",
			(aGenreOnglet) => {
				if (this.instanceAide) {
					this.instanceAide.fermer();
				}
				this.onglet = null;
				this.nombre = 0;
				if (aGenreOnglet) {
					this.onglet =
						this.options.listeOnglets.getElementParGenre(aGenreOnglet);
					this.nombre =
						GParametres.aideContextuelle && this.onglet
							? GParametres.aideContextuelle.getNombreDeGenreOnglet(
									this.onglet.getGenre(),
								)
							: 0;
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
						if (aInstance.instanceAide) {
							aInstance.instanceAide.fermer();
						}
					},
				};
			},
			btn: {
				event: function () {
					aInstance._eventBtn(this.node);
				},
				getTitle: function () {
					return (
						ObjetTraduction_1.GTraductions.getValeur("Commande.Aide.Actif") +
						" - " +
						ObjetAideContextuelle_1.ObjetAideContextuelle.getLibelleNbAides(
							aInstance.nombre,
						)
					);
				},
			},
			getNodeBtn: function () {
				$(this.node).eventValidation(function () {
					aInstance._eventBtn(this);
				});
			},
			getClassBtnEntete: function () {
				return aInstance.nombre === 0 ? "bcne_btn_entete_vide" : "";
			},
			compteur: {
				getHtml: function () {
					return aInstance.nombre > 99 ? "99+" : aInstance.nombre;
				},
				afficher: function () {
					return aInstance.nombre > 0;
				},
			},
		});
	}
	setInfoDOnglet(aOnglet) {
		this.onglet = aOnglet;
		this.nombre = GParametres.aideContextuelle
			? GParametres.aideContextuelle.getNombreDeGenreOnglet(
					this.onglet.getGenre(),
				)
			: 0;
	}
	construireAffichage() {
		const H = [];
		const lGetAttr = () => {
			return { "aria-expanded": this.instanceAide ? "true" : "false" };
		};
		H.push('<div class="ObjetWrapperAideContextuelle_Espace">');
		if (this.options.modeBtnEntete) {
			H.push(
				IE.jsx.str("button", {
					"ie-node": "getNodeBtn",
					"ie-title": "btn.getTitle",
					"aria-haspopup": "dialog",
					class: "bcne_btn_entete",
					"ie-class": "getClassBtnEntete",
					"ie-attr": lGetAttr,
				}),
			);
		} else {
			H.push(
				IE.jsx.str("ie-btnimage", {
					class: "icon_base_connaissance btnImageIcon",
					"ie-model": "btn",
					"aria-haspopup": "dialog",
					"ie-attr": lGetAttr,
				}),
			);
		}
		H.push(
			'<div ie-html="compteur.getHtml" ie-if="compteur.afficher" class="bcne_compteur_aide"></div>',
		);
		H.push("</div>");
		return H.join("");
	}
	_eventBtn(aNodeBtn) {
		this.nodeBtn = aNodeBtn;
		clearTimeout(this._timerFermeture);
		const lBouton = $("#" + this.Nom.escapeJQ() + " .bcne_btn_entete");
		lBouton.addClass("bcne_btn_entete_vide");
		if (this.nombre === 0) {
			let lUrl = "";
			if (
				GParametres.aideContextuelle &&
				GParametres.aideContextuelle.url_accueil
			) {
				lUrl = GParametres.aideContextuelle.url_accueil;
			} else if (GParametres.urlAide) {
				lUrl = ObjetChaine_1.GChaine.format(GParametres.urlAide, [
					GEtatUtilisateur.getGenreOnglet(),
					GEtatUtilisateur.getLibelleLongOnglet(),
				]);
			} else {
			}
			if (lUrl) {
				window.open(lUrl);
			}
			return;
		}
		if (!this.instanceAide) {
			const c_timer_ouverture = 500;
			this.instanceAide = new ObjetAideContextuelle_1.ObjetAideContextuelle({
				pere: this,
				evenement: () => {
					$(".bcne_conteneur_aide").removeClass("bcne_open");
					clearTimeout(this._timerFermeture);
					GestionnaireModale_1.GestionnaireModale.abonnementPremierPlan(
						false,
						this.instanceAide.getNom(),
					);
					GestionnaireModale_1.GestionnaireModale.abonnementBlocageInterface(
						false,
						this.instanceAide.getNom(),
					);
					this._timerFermeture = setTimeout(() => {
						this.instanceAide.free();
						this.instanceAide = null;
						IEHtml_1.default.refresh();
					}, c_timer_ouverture);
				},
			});
			ObjetHtml_1.GHtml.addHtml(
				IEZoneFenetre_1.ZoneFenetre.getElementZoneFenetre(),
				'<div style="z-index:1100;" class="bcne_conteneur_aide' +
					(this.options.modeBtnEntete ? " bcne_conteneur_entete" : "") +
					'" id="' +
					this.instanceAide.getNom() +
					'" ie-eventout="eventOut"></div>',
				{ controleur: this.controleur },
			);
			GestionnaireModale_1.GestionnaireModale.abonnementBlocageInterface(
				true,
				this.instanceAide.getNom(),
			);
			GestionnaireModale_1.GestionnaireModale.abonnementPremierPlan(
				true,
				this.instanceAide.getNom(),
			);
			GestionnaireModale_1.GestionnaireModale.enPremierPlan(
				this.instanceAide.getNom(),
			);
			this.instanceAide.setOptionsAideContextuelle({
				timerOuverture: c_timer_ouverture,
				onglet: this.onglet,
				nombre: this.nombre,
				simulerFenetre: true,
			});
			this.instanceAide.initialiser();
			$(".bcne_conteneur_aide").addClass("bcne_open");
		} else {
			this.instanceAide.fermer();
		}
	}
}
exports.ObjetWrapperAideContextuelle_Espace =
	ObjetWrapperAideContextuelle_Espace;
