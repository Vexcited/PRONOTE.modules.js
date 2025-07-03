exports.ObjetPanelMoyennesEleve = void 0;
const ObjetIdentite_Mobile_1 = require("ObjetIdentite_Mobile");
const ObjetTraduction_1 = require("ObjetTraduction");
const GUID_1 = require("GUID");
const MoteurNotesCP_1 = require("MoteurNotesCP");
const MoteurNotes_1 = require("MoteurNotes");
const ObjetDate_1 = require("ObjetDate");
const AccessApp_1 = require("AccessApp");
class ObjetPanelMoyennesEleve extends ObjetIdentite_Mobile_1.ObjetIdentite_Mobile {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationScoMobile = (0, AccessApp_1.getApp)();
		this.interfaceScoMobile = lApplicationScoMobile.getInterfaceMobile();
		this.moteurNotes = new MoteurNotes_1.MoteurNotes();
		this.ids = {
			panel: GUID_1.GUID.getId(),
			bonus: GUID_1.GUID.getId(),
			moyennes: GUID_1.GUID.getId(),
		};
	}
	setDonnees(aDonnees) {
		this.donnees = aDonnees;
		this.afficher();
	}
	afficher() {
		this.interfaceScoMobile.openPanel(this._composeDetailMoyennesEleve(), {
			controleur: this.controleur,
			optionsFenetre: {
				titre: ObjetTraduction_1.GTraductions.getValeur("Notes.MoyenneEleve"),
				avecNavigation: !!(this.donnees && this.donnees.eleve),
				titreNavigation: () => {
					const lEleve = this.donnees.eleve;
					const H = [];
					if (lEleve) {
						H.push(lEleve.getLibelle());
						if ("niveau" in lEleve && !!lEleve.niveau) {
							let lLibelleNiveau = lEleve.niveau.getLibelle();
							if (lLibelleNiveau) {
								H.push(`<div class="niveau">${lLibelleNiveau}</div>`);
							}
						}
					}
					return H.join("");
				},
				callbackNavigation: (aSuivant) => {
					this._getProchainElement(this.donnees.eleve.getNumero(), aSuivant);
				},
			},
		});
	}
	_composeDetailMoyennesEleve() {
		if (this.donnees === null || this.donnees === undefined) {
			return "";
		}
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "ObjetPanelMoyennesEleve p-top-xxl" },
				IE.jsx.str(
					"h4",
					{ class: "ie-sous-titre" },
					ObjetTraduction_1.GTraductions.getValeur("Moyennes"),
				),
				IE.jsx.str(
					"div",
					{
						class: "flex-contain p-x-xl p-y-l cols cols moyennes",
						id: this.ids.moyennes,
					},
					this._composeMoyennes(),
				),
				IE.jsx.str(
					"h4",
					{ class: "ie-sous-titre" },
					ObjetTraduction_1.GTraductions.getValeur("Notes.Devoirs"),
				),
				IE.jsx.str(
					"div",
					{ class: "flex-contain p-x-xl p-y-l cols devoirs" },
					this._composeDevoirs(),
				),
			),
		);
		return H.join("");
	}
	_composeLigneMoyenne(aParams) {
		const H = [];
		const lMoyenne = aParams.moyenne;
		let lStrNote =
			lMoyenne && !lMoyenne.estUneNoteVide() ? lMoyenne.getNote() : "";
		const lClass = ["ligne"];
		if (aParams.avecSeparateur) {
			lClass.push("separateur-top");
		}
		H.push(
			IE.jsx.str(
				"section",
				{ class: lClass.join(" ") },
				IE.jsx.str("article", null, IE.jsx.str("p", null, aParams.titre)),
				IE.jsx.str("article", null, IE.jsx.str("p", null, lStrNote)),
			),
		);
		return H.join("");
	}
	_composeLigneDevoir(aParams) {
		const lNote = this.moteurNotes.getNoteEleveAuDevoirParNumero({
			listeDevoirs: this.donnees.listeDevoirs,
			numeroDevoir: aParams.devoir.getNumero(),
			numeroEleve: this.donnees.eleve.getNumero(),
		});
		const lAvecSsServices = this.donnees.avecSsServices;
		const lCoef = aParams.devoir.coefficient;
		const lAvecCoeff = lCoef && !lCoef.estCoefficientParDefaut();
		const lBareme = aParams.devoir.bareme;
		const lBaremeParDefaut = this.donnees.baremeParDefaut;
		const lAvecBareme =
			lBareme && lBareme.getValeur() !== lBaremeParDefaut.getValeur();
		const lClass = ["ligne"];
		if (!aParams.estDernierElement) {
			lClass.push("separateur-bottom");
		}
		let lStrNote = "";
		if (lNote && !lNote.estUneNoteVide()) {
			lStrNote = lNote.getNote();
			if (lAvecBareme) {
				lStrNote += IE.jsx.str(
					"span",
					{ class: "bareme" },
					lBareme.getBaremeEntier(),
				);
			}
		}
		const H = [];
		H.push(
			IE.jsx.str(
				"section",
				{ class: lClass.join(" ") },
				IE.jsx.str(
					"article",
					{ class: "ctn-gauche" },
					IE.jsx.str(
						"div",
						{ class: "date-contain" },
						ObjetDate_1.GDate.formatDate(aParams.devoir.date, "%J %MMM"),
					),
				),
				IE.jsx.str(
					"article",
					{ class: "ctn-centre" },
					lAvecSsServices
						? `<p>${aParams.devoir.service.matiere.getLibelle()}</p>`
						: "",
					lAvecCoeff
						? `<div class="ie-sous-titre">${ObjetTraduction_1.GTraductions.getValeur("Notes.Coefficient")} ${lCoef.getCoefficientEntier()}</div>`
						: "",
				),
				IE.jsx.str(
					"article",
					{ class: "ctn-droite" },
					IE.jsx.str("p", null, lStrNote),
				),
			),
		);
		return H.join("");
	}
	_composeDevoirs() {
		const H = [];
		this.donnees.listeDevoirs.parcourir((aDevoir, aIndex) => {
			H.push(
				this._composeLigneDevoir({
					estDernierElement: this.donnees.listeDevoirs.count() - 1 === aIndex,
					devoir: aDevoir,
				}),
			);
		});
		return H.join("");
	}
	_composeMoyennes() {
		const H = [];
		const lEleve = this.donnees.eleve;
		H.push(
			this._composeLigneMoyenne({
				titre: this.donnees.service.matiere.getLibelle(),
				moyenne:
					lEleve.moyennes[MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.Moyenne],
			}),
		);
		if (this.donnees.avecSsServices) {
			const lService = this.donnees.service;
			lService.listeServices.parcourir((aService, aIndex) => {
				H.push(
					this._composeLigneMoyenne({
						avecSeparateur: true,
						titre: aService.matiere.getLibelle(),
						moyenne:
							lEleve.moyennes[
								MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.MoyenneSousService -
									aIndex
							],
					}),
				);
			});
		}
		return H.join("");
	}
	_getProchainElement(aNumeroElement, aEstSuivant) {
		const lListeEleves = this.donnees.listeEleves;
		let lIndiceElementActuel, lIndiceProchainElement, lProchainElement;
		lIndiceElementActuel =
			lListeEleves.getIndiceParNumeroEtGenre(aNumeroElement);
		if (!!aEstSuivant) {
			lIndiceProchainElement =
				lIndiceElementActuel + 1 < lListeEleves.count()
					? lIndiceElementActuel + 1
					: 0;
		} else {
			lIndiceProchainElement =
				lIndiceElementActuel === 0
					? lListeEleves.count() - 1
					: lIndiceElementActuel - 1;
		}
		lProchainElement = lListeEleves.get(lIndiceProchainElement);
		this.setDonnees($.extend({}, this.donnees, { eleve: lProchainElement }));
	}
}
exports.ObjetPanelMoyennesEleve = ObjetPanelMoyennesEleve;
