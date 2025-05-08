exports.InterfaceTAFProgression = void 0;
const TinyInit_1 = require("TinyInit");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_Etat_1 = require("Enumere_Etat");
const _InterfaceContenuEtTAFCahierDeTextes_1 = require("_InterfaceContenuEtTAFCahierDeTextes");
const Enumere_ElementCDT_1 = require("Enumere_ElementCDT");
const EGenreEvenementContenuCahierDeTextes_1 = require("EGenreEvenementContenuCahierDeTextes");
class InterfaceTAFProgression extends _InterfaceContenuEtTAFCahierDeTextes_1._InterfaceContenuEtTAFCahierDeTextes {
	constructor(...aParams) {
		super(...aParams);
		this.genre = Enumere_ElementCDT_1.EGenreElementCDT.TravailAFaire;
		this.paramsAffichage = {
			pourProgression: false,
			height: ["50", "125"],
			position: [false, undefined],
			min_height: [50, 125],
			max_height: [150, 300],
		};
	}
	getTAFContenu() {
		return this.taf;
	}
	construireStructureAffichageAutre() {
		const T = [];
		T.push('<div class="flex-contain full-width flex-gap-l p-top-l">');
		T.push(
			'<div class="fix-bloc flex-contain flex-gap flex-start m-bottom-l">',
			this.construireBoutonsLiens(),
			"</div>",
			'<div class="fluid-bloc">',
			this.construireEditeur(),
			"</div>",
			"</div>",
		);
		T.push(
			'<div class="fix-bloc flex-contain m-left-xxl p-left" id="',
			this.idDocsJoints,
			'">',
			"</div>",
		);
		T.push("</div>");
		return T.join("");
	}
	focusSurPremierObjet() {
		if (GNavigateur.withContentEditable) {
			const lEditor = TinyInit_1.TinyInit.get(this.idDescriptif);
			if (lEditor && lEditor.initialized) {
				try {
					lEditor.focus();
				} catch (e) {
					IE.log.addLog("mceFocus> " + e, null, IE.log.genre.Erreur);
				}
			} else {
				ObjetHtml_1.GHtml.setFocus(this.idPremierObjet);
			}
		} else {
			ObjetHtml_1.GHtml.setFocus(this.idPremierObjet);
		}
	}
	_setDescriptif(aHtml, aAvecCallBack) {
		if (
			this.taf &&
			!ObjetChaine_1.GChaine.estChaineHTMLEgal(aHtml, this.taf.descriptif)
		) {
			if (this.taf.Numero === null || this.taf.Numero === undefined) {
				this.taf.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			} else {
				this.taf.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			}
			const lDescriptif = aHtml;
			if (GNavigateur.withContentEditable) {
				this.taf.descriptif = TinyInit_1.TinyInit.estContenuVide(lDescriptif)
					? ""
					: lDescriptif;
			} else {
				this.taf.descriptif = lDescriptif;
			}
			this.taf.estVide =
				this.taf.descriptif === "" &&
				this.taf.ListePieceJointe.getNbrElementsExistes() === 0;
			if (aAvecCallBack) {
				this.callback.appel(
					EGenreEvenementContenuCahierDeTextes_1
						.EGenreEvenementContenuCahierDeTextes.editionDescriptif,
					this.taf,
				);
			} else {
				this.Pere.setEtatSaisie(true);
			}
		}
	}
	actualiserTAF(aTAF, aVerrouille, aAvecDocJoint, aPleinEcran) {
		this.taf = aTAF;
		this.cahierDeTexteVerrouille = aVerrouille;
		if (this.pleinEcran !== aPleinEcran) {
			this.pleinEcran = aPleinEcran;
			this.recupererDonnees();
		}
		ObjetHtml_1.GHtml.setHtml(this.idDescriptif, this.taf.descriptif);
		if (GNavigateur.withContentEditable) {
			const lEditor = TinyInit_1.TinyInit.get(this.idDescriptif);
			if (lEditor) {
				this._affecterContenuTiny(lEditor, this.taf.descriptif);
			}
		} else {
			ObjetHtml_1.GHtml.setValue(this.idDescriptif, this.taf.descriptif);
		}
		this.avecDocumentJoint = aAvecDocJoint;
		this._actualiserDocumentsJoints();
	}
}
exports.InterfaceTAFProgression = InterfaceTAFProgression;
