exports.WidgetCasier = void 0;
const ObjetRequeteSaisieCasier_1 = require("ObjetRequeteSaisieCasier");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_FormatDocJoint_1 = require("Enumere_FormatDocJoint");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
class WidgetCasier extends ObjetWidget_1.Widget.ObjetWidget {
	construire(aParams) {
		this.donnees = aParams.donnees;
		const lWidget = {
			getHtml: this._composeWidgetCasier.bind(this),
			nbrElements: this.donnees.listeDocuments
				? this.donnees.listeDocuments.count()
				: 0,
			afficherMessage:
				!this.donnees.listeDocuments ||
				this.donnees.listeDocuments.count() === 0,
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(aParams.donnees);
	}
	jsxNodeDocumentCasier(aDocumentCasier) {
		return (aNode) => {
			$(aNode).eventValidation(() => {
				this._surDocumentCasier(aDocumentCasier);
			});
		};
	}
	_surDocumentCasier(aDocument) {
		if (aDocument) {
			window.open(ObjetChaine_1.GChaine.creerUrlBruteLienExterne(aDocument));
			new ObjetRequeteSaisieCasier_1.ObjetRequeteSaisieCasier(
				this,
				this._surRequeteSaisieCasier,
			).lancerRequete({
				genreSaisie:
					ObjetRequeteSaisieCasier_1.ObjetRequeteSaisieCasier.EGenreSaisie
						.marquerLectureDocument,
				documentLu: aDocument,
			});
		}
	}
	_surRequeteSaisieCasier() {
		this.callback.appel(
			this.donnees.genre,
			Enumere_EvenementWidget_1.EGenreEvenementWidget.ActualiserWidget,
		);
	}
	_composeWidgetCasier() {
		const H = [];
		if (
			this.donnees &&
			this.donnees.listeDocuments &&
			this.donnees.listeDocuments.count() > 0
		) {
			H.push('<ul class="liste-clickable">');
			for (let i = 0; i < this.donnees.listeDocuments.count(); i++) {
				const lDocument = this.donnees.listeDocuments.get(i);
				const lSuffixe = ObjetChaine_1.GChaine.extraireExtensionFichier(
					lDocument.getLibelle(),
				);
				const lTypefile =
					Enumere_FormatDocJoint_1.EFormatDocJointUtil.getClassIconDeGenre(
						Enumere_FormatDocJoint_1.EFormatDocJointUtil.getGenreDeFichier(
							lSuffixe,
						),
					);
				H.push(
					IE.jsx.str(
						"li",
						null,
						IE.jsx.str(
							"a",
							{
								tabindex: "0",
								"ie-node": this.jsxNodeDocumentCasier(lDocument),
								class: "wrapper-link icon " + lTypefile,
							},
							IE.jsx.str(
								"div",
								{ class: "wrap" },
								IE.jsx.str("h3", null, lDocument.getLibelle()),
								IE.jsx.str(
									"span",
									{
										"aria-label": ObjetDate_1.GDate.formatDate(
											lDocument.date,
											"[" + " %JJJJ %JJ %MMMM" + "]",
										),
									},
									ObjetChaine_1.GChaine.format(
										ObjetTraduction_1.GTraductions.getValeur(
											"accueil.casier.deposePar",
										),
										[lDocument.infoDepositaire],
									) +
										" - " +
										ObjetDate_1.GDate.formatDate(
											lDocument.date,
											"[" + " %JJ %MMM" + "]",
										),
								),
							),
						),
					),
				);
			}
			H.push("</ul>");
		}
		return H.join("");
	}
}
exports.WidgetCasier = WidgetCasier;
