exports.WidgetDiscussions = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const Invocateur_1 = require("Invocateur");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const ObjetWidget_1 = require("ObjetWidget");
const jsx_1 = require("jsx");
class WidgetDiscussions extends ObjetWidget_1.Widget.ObjetWidget {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = GApplication;
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
	}
	construire(aParams) {
		this.donnees = aParams.donnees;
		const lWidget = {
			html: this.composeWidgetDiscussions(),
			nbrElements: this.donnees.listeMessagerie
				? this.donnees.listeMessagerie.count()
				: 0,
			afficherMessage:
				!this.donnees.listeMessagerie ||
				this.donnees.listeMessagerie.count() === 0,
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	composeWidgetDiscussions() {
		const H = [];
		if (
			this.donnees.listeMessagerie &&
			this.donnees.listeMessagerie.count() > 0
		) {
			H.push('<ul class="liste-clickable">');
			for (let I = 0; I < this.donnees.listeMessagerie.count(); I++) {
				H.push(
					this._composeItemDiscussion(this.donnees.listeMessagerie.get(I), I),
				);
			}
			H.push("</ul>");
		}
		return H.join("");
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			btnPublic: {
				event(aNumeroMessage, aEvent) {
					aEvent.stopPropagation();
					UtilitaireMessagerie_1.UtilitaireMessagerie.afficherFenetreDestinatairesDeMessage(
						aNumeroMessage,
						true,
						false,
					);
				},
				getHintPublic(aNumeroMessage) {
					return UtilitaireMessagerie_1.UtilitaireMessagerie.getStrHintPublicMessagePromise(
						aInstance,
						aNumeroMessage,
						true,
						false,
						this.node,
					);
				},
			},
			surDiscussion(i) {
				$(this.node).eventValidation(() => {
					aInstance._surDiscussion(i);
				});
			},
		});
	}
	_surDiscussion(i) {
		const lDiscussion = this.donnees.listeMessagerie.get(i);
		if (lDiscussion) {
			lDiscussion.__marquerLu__ = true;
			this.etatUtilisateurSco.message = lDiscussion;
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.navigationOnglet,
				Enumere_Onglet_1.EGenreOnglet.Messagerie,
			);
		}
	}
	_composeItemDiscussion(aDiscussion, i) {
		if (!aDiscussion) {
			return IE.jsx.str("li", null);
		}
		const lId = `${this.Nom}_itm_disc${i}`;
		let lBouton = "";
		if (aDiscussion.nbPublic > 0 && aDiscussion.messagePourParticipants) {
			lBouton = IE.jsx.str(
				"div",
				{
					class: "type-chat",
					style: "position: absolute; right:5.5rem; top:1.5rem;",
				},
				IE.jsx.str("ie-btnicon", {
					class: "icon icon_group",
					"ie-model": (0, jsx_1.jsxFuncAttr)("btnPublic", [
						aDiscussion.messagePourParticipants.getNumero(),
					]),
					"ie-hint": !IE.estMobile
						? (0, jsx_1.jsxFuncAttr)("getHintPublic", [
								aDiscussion.messagePourParticipants.getNumero(),
							])
						: false,
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.WAI_AfficherPart",
					),
					"aria-describedby": lId,
					"aria-haspopup": "dialog",
				}),
			);
		}
		return IE.jsx.str(
			"li",
			null,
			IE.jsx.str(
				"div",
				{ class: "like-wrapper-link", style: "position: relative" },
				IE.jsx.str(
					"a",
					{
						tabindex: "0",
						"ie-node": (0, jsx_1.jsxFuncAttr)("surDiscussion", i),
						id: lId,
						class: "wrapper-link",
						title: ObjetTraduction_1.GTraductions.getValeur(
							"accueil.discussions.hintLien",
						),
					},
					IE.jsx.str(
						"div",
						{ class: "wrap" },
						IE.jsx.str(
							"h3",
							null,
							aDiscussion.objet ? aDiscussion.objet : "Sans objet",
						),
						IE.jsx.str(
							"span",
							null,
							IE.jsx.str("span", { class: "date" }, aDiscussion.libelleDate),
							aDiscussion.public ? " - " + aDiscussion.public : "",
						),
					),
					IE.jsx.str(
						"div",
						{ class: "type-chat" },
						aDiscussion.documentsJoints
							? IE.jsx.str("i", {
									role: "img",
									"aria-label": ObjetTraduction_1.GTraductions.getValeur(
										"accueil.discussions.labelPJ",
									),
									class: "icon icon_paper_clip",
								})
							: "",
						!lBouton && aDiscussion.nbPublic > 0
							? IE.jsx.str("i", {
									class: "icon icon_group",
									role: "presentation",
								})
							: "",
						IE.jsx.str(
							"div",
							{
								class: "compteur-message",
								style: lBouton ? "margin-left: 3.8rem;" : "",
							},
							IE.jsx.str("span", null, aDiscussion.nombreMessages),
						),
					),
				),
				lBouton,
			),
		);
	}
}
exports.WidgetDiscussions = WidgetDiscussions;
