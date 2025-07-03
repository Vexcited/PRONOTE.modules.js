exports.WidgetNotes = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const ObjetElement_1 = require("ObjetElement");
const TypeFichierExterneHttpSco_1 = require("TypeFichierExterneHttpSco");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
const MethodesObjet_1 = require("MethodesObjet");
const AccessApp_1 = require("AccessApp");
class WidgetNotes extends ObjetWidget_1.Widget.ObjetWidget {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			nodeDernieresNoteMatiere(aIndex) {
				$(this.node).eventValidation((aEvent) => {
					if (
						$(aEvent.target)
							.parentsUntil(aEvent.currentTarget)
							.addBack()
							.filter("a[target=_blank]").length === 0
					) {
						const lDevoir = aInstance.donnees.listeDevoirs.get(aIndex);
						aInstance.etatUtilisateurSco.Navigation.setRessource(
							Enumere_Ressource_1.EGenreRessource.Devoir,
							lDevoir,
						);
						aInstance.donnees.page.periode = lDevoir.periode;
						let lPageDestination;
						if (aInstance.etatUtilisateurSco.estEspaceMobile()) {
							lPageDestination = {
								genreOngletDest: aInstance.donnees.page.Onglet,
								page: aInstance.donnees.page,
							};
							aInstance.setDevoirWidgetSelectionne(lDevoir);
						} else {
							lPageDestination = aInstance.donnees.page;
						}
						aInstance.callback.appel(
							aInstance.donnees.genre,
							Enumere_EvenementWidget_1.EGenreEvenementWidget
								.NavigationVersPage,
							lPageDestination,
						);
					}
				});
			},
			afficherCorrigerQCM: {
				event() {
					if (
						MethodesObjet_1.MethodesObjet.isNumeric(
							aInstance.indiceDevoirDansFenetre,
						)
					) {
						aInstance.surQCM(aInstance.indiceDevoirDansFenetre);
					}
				},
			},
		});
	}
	construire(aParams) {
		this.donnees = aParams.donnees;
		const lWidget = {
			getHtml: this.composeWidgetNotes.bind(this),
			nbrElements: this.donnees.listeDevoirs.count(),
			afficherMessage: this.donnees.listeDevoirs.count() === 0,
			getPage: () => {
				if (this.donnees.listeDevoirs.count()) {
					this.donnees.page.periode =
						this.donnees.listeDevoirs.getPremierElement().periode;
				}
				return this.donnees.page;
			},
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	composeWidgetNotes() {
		const H = [];
		if (this.donnees.listeDevoirs.count() > 0) {
			this.donnees.listeDevoirs.setTri([
				ObjetTri_1.ObjetTri.init(
					"date",
					Enumere_TriElement_1.EGenreTriElement.Decroissant,
				),
				ObjetTri_1.ObjetTri.init("service.Libelle"),
			]);
			this.donnees.listeDevoirs.trier();
			const lAvecLien = this.donnees.avecDetailDevoir;
			H.push('<ul class="liste-clickable">');
			for (let I = 0; I < this.donnees.listeDevoirs.count(); I++) {
				H.push(
					this.composeNote(this.donnees.listeDevoirs.get(I), I, lAvecLien),
				);
			}
			H.push("</ul>");
		}
		return H.join("");
	}
	composeNote(aDevoir, aIndex, aAvecLienDetail) {
		const lNoteAuDessusBareme =
			aDevoir.note &&
			aDevoir.bareme &&
			aDevoir.note.getValeur() > aDevoir.bareme.getValeur();
		const lEstBaremeParDefaut =
			aDevoir.bareme.getValeur() === aDevoir.baremeParDefaut.getValeur() &&
			!lNoteAuDessusBareme;
		const lStrDate = ObjetDate_1.GDate.formatDate(
			aDevoir.date,
			"[" +
				ObjetTraduction_1.GTraductions.getValeur("Le") +
				" " +
				"%J %MMM" +
				"]",
		);
		const lStrClasse = "";
		const lStrClasseAria = "";
		const lStrEtoile = lNoteAuDessusBareme
			? '<i role="img" class="m-right icon icon_star" aria-label="' +
				ObjetTraduction_1.GTraductions.getValeur("accueil.noteAuDessusBareme") +
				'" title="' +
				ObjetTraduction_1.GTraductions.getValeur("accueil.noteAuDessusBareme") +
				'"></i>'
			: "";
		const lStrNote =
			aDevoir.note.getNote() +
			(lEstBaremeParDefaut || isNaN(parseFloat(aDevoir.note.getNote()))
				? ""
				: '<span class="bareme"> ' +
					aDevoir.bareme.getBaremeEntier() +
					"</span>");
		const lStrNoteAria =
			aDevoir.note.getNote() +
			(lEstBaremeParDefaut || isNaN(parseFloat(aDevoir.note.getNote()))
				? ""
				: " " +
					ObjetTraduction_1.GTraductions.getValeur("Notes.NoteSur", [
						aDevoir.bareme.getBaremeEntierSansSlash(),
					]));
		const lStrCommentaireSurNote = aDevoir.commentaireSurNote
			? IE.jsx.str("i", {
					role: "img",
					class: "m-right icon icon_comment_vide",
					title:
						ObjetTraduction_1.GTraductions.getValeur(
							"DernieresNotes.Detail.CommentaireProf",
						) +
						" : " +
						aDevoir.commentaireSurNote,
				})
			: "";
		const lWAI =
			ObjetTraduction_1.GTraductions.getValeur("Matiere") +
			" : " +
			aDevoir.service.getLibelle() +
			" ; " +
			ObjetTraduction_1.GTraductions.getValeur("Notes.Note") +
			" : " +
			lStrNoteAria +
			" ; " +
			ObjetTraduction_1.GTraductions.getValeur("Date") +
			" : " +
			lStrDate +
			(lStrClasseAria ? " ; " + lStrClasseAria : "") +
			(aDevoir.commentaireSurNote
				? " ; " +
					ObjetTraduction_1.GTraductions.getValeur("Notes.remarque") +
					" : " +
					aDevoir.commentaireSurNote
				: "");
		const lArrayLiensSujetCorrige = [];
		if (!!aDevoir.libelleSujet) {
			const lDocumentJointSujet = new ObjetElement_1.ObjetElement(
				aDevoir.libelleSujet,
				aDevoir.getNumero(),
				Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
			);
			lArrayLiensSujetCorrige.push(
				ObjetChaine_1.GChaine.composerUrlLienExterne({
					documentJoint: lDocumentJointSujet,
					genreRessource:
						TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirSujet,
					libelleEcran:
						ObjetTraduction_1.GTraductions.getValeur("AfficherSujet"),
				}),
			);
		}
		if (!!aDevoir.libelleCorrige) {
			const lDocumentJointCorrige = new ObjetElement_1.ObjetElement(
				aDevoir.libelleCorrige,
				aDevoir.getNumero(),
				Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
			);
			lArrayLiensSujetCorrige.push(
				ObjetChaine_1.GChaine.composerUrlLienExterne({
					documentJoint: lDocumentJointCorrige,
					genreRessource:
						TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirCorrige,
					libelleEcran:
						ObjetTraduction_1.GTraductions.getValeur("AfficherCorrige"),
				}),
			);
		}
		return IE.jsx.str(
			"li",
			{ id: this.Nom + "_notes_" + aIndex },
			aAvecLienDetail
				? `<a class="justify-between wrapper-link" tabindex="0" aria-label="${lWAI.toAttrValue()}" ie-node="nodeDernieresNoteMatiere(${aIndex})">`
				: `<div class="justify-between wrapper-nolink" tabindex="0" aria-label="${lWAI.toAttrValue()}">`,
			IE.jsx.str(
				"div",
				{ class: "wrap" },
				IE.jsx.str(
					"h3",
					null,
					IE.jsx.str("span", null, aDevoir.service.getLibelle()),
				),
				IE.jsx.str(
					"div",
					{ class: "infos-conteneur" },
					IE.jsx.str("span", { class: "date" }, lStrDate),
					lStrClasse
						? IE.jsx.str("span", { class: "as-link" }, lStrClasse)
						: "",
					lArrayLiensSujetCorrige.length > 0
						? IE.jsx.str(
								"div",
								{
									class: "flex-contain flex-center full-width flex-gap-l m-top",
								},
								lArrayLiensSujetCorrige.join(" "),
							)
						: "",
				),
			),
			lStrCommentaireSurNote &&
				IE.jsx.str(
					"div",
					{ class: ["p-top", IE.estMobile ? "fixed-mobile" : "fixed"] },
					lStrCommentaireSurNote,
				),
			lStrEtoile &&
				IE.jsx.str(
					"div",
					{
						class: IE.estMobile
							? ["p-top", "fixed-mobile"]
							: ["p-top", "fixed"],
					},
					lStrEtoile,
				),
			IE.jsx.str(
				"div",
				{
					class: ["as-info", "fixed"],
					"aria-label": lStrNoteAria.toAttrValue(),
				},
				lStrNote,
			),
			aAvecLienDetail ? "</a>" : "</div>",
		);
	}
	surQCM(I) {
		const lDevoir = this.donnees.listeDevoirs.get(I);
		if (
			lDevoir === null || lDevoir === void 0 ? void 0 : lDevoir.executionQCM
		) {
			this.callback.appel(
				this.donnees.genre,
				Enumere_EvenementWidget_1.EGenreEvenementWidget.AfficherExecutionQCM,
				lDevoir.executionQCM,
			);
		}
	}
	setDevoirWidgetSelectionne(aDevoir) {
		if (!this.etatUtilisateurSco.infosSupp) {
			this.etatUtilisateurSco.infosSupp = {};
		}
		if (!this.etatUtilisateurSco.infosSupp.DernieresNotesMobile) {
			this.etatUtilisateurSco.infosSupp.DernieresNotesMobile = {};
		}
		this.etatUtilisateurSco.infosSupp.DernieresNotesMobile.devoirWidgetSelectionne =
			aDevoir;
	}
}
exports.WidgetNotes = WidgetNotes;
