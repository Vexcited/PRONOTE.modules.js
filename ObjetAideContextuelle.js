exports.ObjetAideContextuelle = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ToucheClavier_1 = require("ToucheClavier");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const tag_1 = require("tag");
CollectionRequetes_1.Requetes.inscrire(
	"AideContextuelleDyn",
	ObjetRequeteJSON_1.ObjetRequeteConsultation,
);
class ObjetAideContextuelle extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.idContenu = this.Nom + "_contenu";
		this.optionsAideContextuelle = {
			timerOuverture: null,
			onglet: null,
			nombre: 0,
		};
	}
	setOptionsAideContextuelle(aOptions) {
		$.extend(this.optionsAideContextuelle, aOptions);
	}
	free() {
		super.free();
		$("#" + this.Nom.escapeJQ()).remove();
	}
	recupererDonnees() {
		this.ecran = "";
		if (!!this.optionsAideContextuelle.onglet) {
			const lGenre = this.optionsAideContextuelle.onglet.getGenre();
			if (MethodesObjet_1.MethodesObjet.isNumber(lGenre)) {
				this.ecran = lGenre.toString();
			} else if (MethodesObjet_1.MethodesObjet.isString(lGenre)) {
				this.ecran = lGenre;
			}
			if (this.optionsAideContextuelle.onglet.aides) {
				this._actualiser(true);
				$("#" + this.Nom.escapeJQ() + " .ObjetAideContextuelle>header").focus();
			} else {
				this._lancerRequeteRecuperationAideContextuelle(true);
			}
		}
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getNodeRacine() {
				$(this.node).on({
					keyup: function (aEvent) {
						if (aEvent.which === ToucheClavier_1.ToucheClavier.Echap) {
							aInstance.fermer();
						}
					},
				});
			},
			btnFermer: {
				event: function () {
					aInstance.fermer();
				},
			},
			nodeFicheAide: function (aIndexFicheAide, aType) {
				const lTypeAide =
					!!aInstance.optionsAideContextuelle.onglet &&
					!!aInstance.optionsAideContextuelle.onglet.aides
						? aInstance.optionsAideContextuelle.onglet.aides.getElementParGenre(
								aType,
							)
						: null;
				null;
				const lFicheAide =
					lTypeAide && lTypeAide.fiches
						? lTypeAide.fiches.get(aIndexFicheAide)
						: null;
				$(this.node).eventValidation(() => {
					if (lFicheAide) {
						window.open(lFicheAide.url);
					}
				});
			},
			nodeVoirPlus: function () {
				$(this.node).eventValidation(() => {
					if (GParametres.aideContextuelle) {
						window.open(GParametres.aideContextuelle.url_accueil);
					}
				});
			},
			afficherAucuneAide: function () {
				return aInstance.optionsAideContextuelle.nombre === 0;
			},
		});
	}
	fermer() {
		$("#" + this.Nom.escapeJQ() + " .cn_scroll").addClass("cn_scroll_inactif");
		this.callback.appel();
	}
	construireAffichage() {
		const H = [];
		H.push(
			'<div ie-node="getNodeRacine" class="ObjetAideContextuelle disable-dark-mode">',
		);
		H.push(
			(0, tag_1.tag)(
				"header",
				{ tabindex: "0" },
				(0, tag_1.tag)("div", { class: "Image_BaseDeConnaissance" }),
				(0, tag_1.tag)(
					"div",
					{ class: "cn_titre_aide justify-between" },
					(0, tag_1.tag)(
						"div",
						{ class: "flex-contain justify-between" },
						(0, tag_1.tag)(
							"h3",
							ObjetTraduction_1.GTraductions.getValeur(
								"AideContextuelle.Titre",
							),
						),
						(0, tag_1.tag)("ie-btnimage", {
							"ie-model": "btnFermer",
							class: "icon_fermeture_widget btnImageIcon",
							title: ObjetTraduction_1.GTraductions.getValeur("Fermer"),
						}),
					),
					(0, tag_1.tag)(
						"div",
						{ class: "flex-contain cn_support" },
						(0, tag_1.tag)(
							"a",
							{ "ie-node": "nodeVoirPlus" },
							ObjetTraduction_1.GTraductions.getValeur(
								"AideContextuelle.VoirPlus",
							),
						),
						(0, tag_1.tag)("i", { class: "icon_external_link m-left" }),
					),
				),
			),
		);
		H.push(
			'<div ie-if="afficherAucuneAide" class="cn_imgAucuneAide">',
			"<div></div>",
			ObjetTraduction_1.GTraductions.getValeur("AideContextuelle.AucuneAide"),
			"</div>",
			'<div class="cn_liste_aide" id="',
			this.idContenu,
			'">',
			"</div>",
			"</div>",
		);
		return H.join("");
	}
	getClasseCssSelonGenre(aGenre) {
		switch (aGenre) {
			case 1:
				return "aide-tutoriel";
			case 2:
				return "aide-mode-emploi";
			case 3:
				return "aide-faq";
		}
		return "";
	}
	_lancerRequeteRecuperationAideContextuelle(aSurDemarrage) {
		if (this._requeteEnCours) {
			return;
		}
		this._requeteEnCours = true;
		const lDemarrageAnimation =
			aSurDemarrage && this.optionsAideContextuelle.timerOuverture > 0;
		const lPromises = [
			(0, CollectionRequetes_1.Requetes)("AideContextuelleDyn", this)
				.lancerRequete({ ecran: this.ecran })
				.then((aJSON) => {
					this.optionsAideContextuelle.onglet.aides =
						new ObjetListeElements_1.ObjetListeElements();
					if (aJSON && aJSON.typesupport) {
						aJSON.typesupport.forEach((aObjet) => {
							const lElement = new ObjetElement_1.ObjetElement().copieJSON(
								aObjet,
							);
							lElement.Genre = lElement.id;
							lElement.Libelle = lElement.libelle;
							lElement.fiches = new ObjetListeElements_1.ObjetListeElements();
							lElement.icone = aObjet.educFont
								? aObjet.educFont.startsWith("C_")
									? aObjet.educFont.slice(2)
									: aObjet.educFont
								: "";
							if (aObjet.fiches) {
								aObjet.fiches.forEach((aFiche, index) => {
									const lFiche = new ObjetElement_1.ObjetElement().copieJSON(
										aFiche,
									);
									lFiche.Genre = index;
									lFiche.Libelle = lElement.titre;
									if (aFiche.duree) {
										const lMin = Math.floor(aFiche.duree / 60);
										const lSec = aFiche.duree % 60;
										lFiche.duree = lMin + "'" + lSec;
									}
									lElement.fiches.addElement(lFiche);
								});
							}
							this.optionsAideContextuelle.onglet.aides.addElement(lElement);
						});
					}
					if (!this.isDestroyed()) {
						this._actualiser(aSurDemarrage);
						$(
							"#" + this.Nom.escapeJQ() + " .ObjetAideContextuelle>header",
						).focus();
					}
				}),
		];
		if (lDemarrageAnimation) {
			lPromises.push(
				new Promise((aResolve) => {
					setTimeout(() => {
						aResolve();
					}, this.optionsAideContextuelle.timerOuverture);
				}),
			);
		}
		Promise.all(lPromises)
			.then(() => {
				$("#" + this.Nom.escapeJQ() + " .cn_scroll").removeClass(
					"cn_scroll_inactif",
				);
			})
			.finally(() => {
				this._requeteEnCours = false;
			});
	}
	_actualiser(aSurDemarrage) {
		const H = [];
		let lScrollTop = 0;
		if (!aSurDemarrage) {
			const lElement = $("#" + this.idContenu.escapeJQ() + " .cn_scroll").get(
				0,
			);
			if (lElement && lElement.scrollTop > 0) {
				lScrollTop = lElement.scrollTop;
			}
		}
		H.push(
			'<div class="cn_scroll',
			aSurDemarrage ? " cn_scroll_inactif" : "",
			'">',
		);
		H.push('<div class="cb_contenu_scroll">');
		if (
			this.optionsAideContextuelle.onglet &&
			this.optionsAideContextuelle.onglet.aides
		) {
			this.optionsAideContextuelle.onglet.aides.parcourir((aType) => {
				const lStyleHeader = `style="color:${aType.couleurFoncee}; background-color:${aType.couleurClaire}"`;
				H.push(
					'<section class="cn_section cn_section_',
					aType.getGenre(),
					'">',
					"<header>",
					`<div class="cn_section_titre ${this.getClasseCssSelonGenre(aType.getGenre())}" ${lStyleHeader}>`,
					'<div class="sc_header_contenu" tabindex="0">',
					aType.getLibelle(),
					"</div>",
					"</div>",
					"</header>",
					'<div class="sc_contenu">',
				);
				aType.fiches.parcourir((aFiche, aIndex) => {
					H.push(
						`<article tabindex="0" ${ObjetHtml_1.GHtml.composeAttr("ie-node", "nodeFicheAide", [aIndex, aType.getGenre()])}>`,
						`<div class="sc_article_gauche ${this.getClasseCssSelonGenre(aType.getGenre())}"><i class="${aType.icone}" style="color:${aType.couleurFoncee};"></i></div>`,
						`<div class="sc_article_contenu" title="${aFiche.description}">${aFiche.titre}</div>`,
						aFiche.duree
							? `<div class="sc_article_duree iconic icon_time" style="color:${aType.couleurFoncee};">${aFiche.duree}</div>`
							: "",
						"</article>",
					);
				});
				H.push("</div>");
				H.push("</section>");
			});
		}
		H.push("</div>");
		H.push("</div>");
		ObjetHtml_1.GHtml.setHtml(this.idContenu, H.join(""), { instance: this });
		if (lScrollTop > 0) {
			let lElement = $("#" + this.idContenu.escapeJQ() + " .cn_scroll").get(0);
			if (lElement) {
				lElement.scrollTop = lScrollTop;
			}
		}
		const lDemarrageAnimation =
			aSurDemarrage && this.optionsAideContextuelle.timerOuverture > 0;
		const lPromises = [];
		if (lDemarrageAnimation) {
			lPromises.push(
				new Promise((aResolve) => {
					setTimeout(() => {
						aResolve();
					}, this.optionsAideContextuelle.timerOuverture);
				}),
			);
		}
		Promise.all(lPromises)
			.then(() => {
				$("#" + this.Nom.escapeJQ() + " .cn_scroll").removeClass(
					"cn_scroll_inactif",
				);
			})
			.finally(() => {
				this._requeteEnCours = false;
			});
	}
}
exports.ObjetAideContextuelle = ObjetAideContextuelle;
