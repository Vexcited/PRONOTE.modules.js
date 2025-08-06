exports.WidgetDocumentsASigner = void 0;
const AccessApp_1 = require("AccessApp");
const GUID_1 = require("GUID");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetWidget_1 = require("ObjetWidget");
const UtilitaireDocumentSignature_1 = require("UtilitaireDocumentSignature");
class WidgetDocumentsASigner extends ObjetWidget_1.Widget.ObjetWidget {
	constructor() {
		super(...arguments);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
	}
	construire(aParams) {
		this.donnees = aParams.donnees;
		const lWidget = { getHtml: this.getHtml.bind(this) };
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	jsxModelBoutonRedirection() {
		return {
			event: () => {
				let lPageDestination;
				const lUtilitaire =
					new UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature();
				const lGenreRubrique = lUtilitaire.getRubriqueDocumentASigner();
				const lOnglet = lUtilitaire.getOnglet();
				if (this.etatUtilisateurSco.estEspaceMobile()) {
					lPageDestination = {
						genreOngletDest: lOnglet,
						page: { genreRubrique: lGenreRubrique },
					};
				} else {
					lPageDestination = { Onglet: lOnglet, genreRubrique: lGenreRubrique };
				}
				this.callback.appel(
					this.donnees.genre,
					Enumere_EvenementWidget_1.EGenreEvenementWidget.NavigationVersPage,
					lPageDestination,
				);
			},
			getDisabled: () => {
				return false;
			},
		};
	}
	getHtml() {
		var _a;
		const lId = GUID_1.GUID.getId();
		return IE.jsx.str(
			"div",
			{ class: ["no-events", "justify-start"] },
			IE.jsx.str(
				"div",
				{
					class: [
						"flex-contain",
						"flex-gap",
						"flex-center",
						"full-width",
						"justify-between",
					],
				},
				IE.jsx.str(
					"p",
					{ id: lId },
					ObjetTraduction_1.GTraductions.getValeur(
						"accueil.documentsASigner.xDocASigner",
						[
							(_a = this.donnees.nombreDocumentsDocumentsSignatures) !== null &&
							_a !== void 0
								? _a
								: 0,
						],
					),
				),
				IE.jsx.str(
					"ie-bouton",
					{
						class: ["themeBoutonPrimaire"],
						role: "link",
						"aria-describedby": lId,
						"ie-model": this.jsxModelBoutonRedirection.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"accueil.documentsASigner.acceder",
					),
				),
			),
		);
	}
}
exports.WidgetDocumentsASigner = WidgetDocumentsASigner;
