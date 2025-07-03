exports.WidgetPartenaireApplicam = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitairePartenaire_1 = require("UtilitairePartenaire");
const ObjetFenetre_Consentement_1 = require("ObjetFenetre_Consentement");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetRequeteSaisieConsentement_1 = require("ObjetRequeteSaisieConsentement");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
class WidgetPartenaireApplicam extends ObjetWidget_1.Widget.ObjetWidget {
	jsxNodeSurPartenaireApplicam(aNode) {
		$(aNode).eventValidation((aEvent) => {
			aEvent.stopImmediatePropagation();
			this.surPartenaireApplicam();
		});
	}
	jsxModelBoutonConsentement() {
		return {
			event: () => {
				const lLibellePartenaire =
					!!this.donnees && this.donnees.libellePartenaire
						? this.donnees.libellePartenaire
						: "";
				const lDonneesTransmises =
					!!this.donnees && this.donnees.donneesTransmises
						? this.donnees.donneesTransmises
						: {};
				const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_Consentement_1.ObjetFenetre_Consentement,
					{
						pere: this,
						evenement: function (aGenreBouton, aParam) {
							switch (aParam.bouton.action) {
								case ObjetFenetre_Consentement_1.EGenreActionConsentement
									.Fermer:
									lFenetre.fermer();
									break;
								case ObjetFenetre_Consentement_1.EGenreActionConsentement
									.Valider:
									new ObjetRequeteSaisieConsentement_1.ObjetRequeteSaisieConsentement(
										this,
									).lancerRequete();
									lFenetre.fermer();
									this.callback.appel(
										this.donnees.genre,
										Enumere_EvenementWidget_1.EGenreEvenementWidget
											.ActualiserWidget,
									);
									break;
							}
						},
					},
				);
				lFenetre.setDonnees(lLibellePartenaire, lDonneesTransmises);
				lFenetre.afficher();
			},
			getDisabled: () => {
				return !(this.donnees && this.donnees.afficherConsentement);
			},
		};
	}
	construire(aParams) {
		this.donnees = aParams.donnees;
		const lWidget = {
			getHtml: this.composeWidgetPartenaireApplicam.bind(this),
			nbrElements: null,
			titre: ObjetTraduction_1.GTraductions.getValeur("accueil.culture.titre"),
			avecActualisation: !!this.donnees.avecActualisation,
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	composeWidgetPartenaireApplicam() {
		const H = [];
		if (this.donnees && this.donnees.afficherConsentement) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "AlignementMilieu" },
					IE.jsx.str(
						"div",
						{ class: "Espace" },
						ObjetTraduction_1.GTraductions.getValeur(
							"accueil.applicam.message",
						),
					),
					IE.jsx.str(
						"div",
						{ class: "GrandEspace" },
						IE.jsx.str(
							"ie-bouton",
							{
								"ie-model": this.jsxModelBoutonConsentement.bind(this),
								class: "themeBoutonSecondaire",
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.applicam.btnConsentement",
								[this.donnees.libellePartenaire],
							),
						),
					),
				),
			);
		} else if (this.donnees.SSO && this.donnees.SSO.intituleLien) {
			H.push(
				IE.jsx.str(
					"ul",
					{ class: "liste-clickable one-line" },
					IE.jsx.str(
						"li",
						{ class: "has-sso" },
						IE.jsx.str(
							"a",
							{
								class: "wrapper-link",
								tabindex: "0",
								"ie-node": this.jsxNodeSurPartenaireApplicam.bind(this),
							},
							IE.jsx.str(
								"div",
								{ class: "wrap" },
								IE.jsx.str("div", null, this.donnees.SSO.intituleLien),
								IE.jsx.str("p", null, this.donnees.SSO.description),
							),
						),
					),
				),
			);
		}
		return H.join("");
	}
	surPartenaireApplicam() {
		UtilitairePartenaire_1.TUtilitairePartenaire.ouvrirURLPartenaire(
			this.donnees,
		);
	}
}
exports.WidgetPartenaireApplicam = WidgetPartenaireApplicam;
