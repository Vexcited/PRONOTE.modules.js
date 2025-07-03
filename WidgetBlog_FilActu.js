exports.WidgetBlog_FilActu = void 0;
const ObjetTri_1 = require("ObjetTri");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDate_1 = require("ObjetDate");
const ObjetMoteurBlog_1 = require("ObjetMoteurBlog");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
const AccessApp_1 = require("AccessApp");
class WidgetBlog_FilActu extends ObjetWidget_1.Widget.ObjetWidget {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
		this.moteur = new ObjetMoteurBlog_1.ObjetMoteurBlog();
	}
	construire(aParams) {
		this.donnees = aParams.donnees;
		const lListeBillets = this.donnees ? this.donnees.listeBillets : null;
		let lNbElements = 0;
		if (lListeBillets) {
			lNbElements = lListeBillets.count();
			lListeBillets.setTri([
				ObjetTri_1.ObjetTri.init((D) => {
					return D.dateDerniereModification;
				}, Enumere_TriElement_1.EGenreTriElement.Decroissant),
				ObjetTri_1.ObjetTri.init(
					"dateCreation",
					Enumere_TriElement_1.EGenreTriElement.Decroissant,
				),
			]);
			lListeBillets.trier();
		}
		const lWidget = {
			getHtml: this.composeWidgetBlogFilActu.bind(this, lListeBillets),
			nbrElements: lNbElements,
			liste: lListeBillets,
			afficherMessage: lNbElements === 0,
		};
		$.extend(true, aParams.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	jsxNodeBilletBlog(aBilletBlog) {
		return (aNode) => {
			$(aNode).eventValidation(() => {
				this._surClickBillet(aBilletBlog);
			});
		};
	}
	composeWidgetBlogFilActu(aListeBillets) {
		const H = [];
		if (aListeBillets && aListeBillets.count() > 0) {
			H.push('<ul class="liste-clickable">');
			for (const lBillet of aListeBillets) {
				H.push(
					IE.jsx.str(
						"li",
						null,
						IE.jsx.str(
							"a",
							{
								class: "wrapper-link",
								tabindex: "0",
								"ie-node": this.jsxNodeBilletBlog(lBillet),
							},
							this._composeLigneBillet(lBillet),
						),
					),
				);
			}
			H.push("</ul>");
		}
		return H.join("");
	}
	_surClickBillet(aBillet) {
		if (aBillet) {
			this.etatUtilisateurSco.setContexteBilletBlog(aBillet);
			const lGenreOnglet = Enumere_Onglet_1.EGenreOnglet.Blog_FilActu;
			let lPageDestination;
			if (this.etatUtilisateurSco.estEspaceMobile()) {
				lPageDestination = { genreOngletDest: lGenreOnglet };
			} else {
				lPageDestination = { Onglet: lGenreOnglet };
			}
			this.callback.appel(
				this.donnees.genre,
				Enumere_EvenementWidget_1.EGenreEvenementWidget.NavigationVersPage,
				lPageDestination,
			);
		}
	}
	_composeLigneBillet(aBillet) {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "wrap" },
				IE.jsx.str("h3", null, aBillet.getLibelle()),
				IE.jsx.str(
					"div",
					{ class: "infos-conteneur" },
					IE.jsx.str(
						"span",
						null,
						ObjetDate_1.GDate.formatDate(
							aBillet.dateDerniereModification,
							"%JJ/%MM/%AA",
						),
						" - ",
						aBillet.auteur.getLibelle(),
					),
				),
			),
		);
		H.push('<div class="conteneur-icones">');
		if (this.moteur.estBilletCommentable(aBillet)) {
			const lNbComment = aBillet.nbCommentairesPublies;
			if (lNbComment > 0) {
				const lClassesLabelNbCommentaire = ["is-label"];
				if (lNbComment > 9999) {
					lClassesLabelNbCommentaire.push("is-xs");
				} else if (lNbComment > 999) {
					lClassesLabelNbCommentaire.push("is-s");
				}
				H.push(
					IE.jsx.str(
						"i",
						{ class: "icon_comment with-label", role: "presentation" },
						IE.jsx.str(
							"span",
							{ class: lClassesLabelNbCommentaire },
							lNbComment,
						),
					),
				);
			}
		} else {
			if (
				[
					Enumere_Espace_1.EGenreEspace.PrimProfesseur,
					Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
					Enumere_Espace_1.EGenreEspace.PrimDirection,
					Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
				].includes(GEtatUtilisateur.GenreEspace)
			) {
				H.push(
					IE.jsx.str("i", {
						class: "icon_comment off with-label",
						role: "presentation",
					}),
				);
			}
		}
		H.push("</div>");
		return H.join("");
	}
}
exports.WidgetBlog_FilActu = WidgetBlog_FilActu;
