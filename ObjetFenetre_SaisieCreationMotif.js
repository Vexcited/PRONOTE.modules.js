exports.ObjetFenetre_SaisieCreationMotif = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const GUID_js_1 = require("GUID.js");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetListe_1 = require("ObjetListe");
const DonneesListe_CategoriesMotifFd_js_1 = require("DonneesListe_CategoriesMotifFd.js");
const ObjetElement_1 = require("ObjetElement");
const Enumere_Etat_1 = require("Enumere_Etat");
class ObjetFenetre_SaisieCreationMotif extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.idZoneGenreIncident = GUID_js_1.GUID.getId();
		this.setOptionsFenetre({
			largeur: 400,
			hauteur: 250,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			avecComposeBasInFooter: true,
		});
	}
	setDonnees(aParams) {
		this.listeSousCategorieDossier = aParams.listeSousCategorieDossier;
		this.titreNouveauMotif;
		this.nouveauMotif = this.creerNouveauMotif();
		this.afficher();
	}
	creerNouveauMotif() {
		const lMotif = ObjetElement_1.ObjetElement.create();
		lMotif.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		lMotif.setLibelle(this.titreNouveauMotif);
		lMotif.sousCategorieDossier = this.categorie;
		return lMotif;
	}
	composeContenu() {
		const idLabelGenreIncident = GUID_js_1.GUID.getId();
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				null,
				IE.jsx.str(
					"div",
					{ class: "field-contain label-up p-top-l no-line" },
					IE.jsx.str(
						"label",
						{ class: "ie-titre-petit" },
						ObjetTraduction_1.GTraductions.getValeur("fenetreMotifs.motif"),
					),
					IE.jsx.str("ie-textareamax", {
						"ie-model": "inputCreationMotif",
						class: "ie-autoresize m-bottom-l",
						"aria-label": ObjetTraduction_1.GTraductions.getValeur(
							"fenetreMotifs.motif",
						),
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "field-contain label-up chips-contain" },
					IE.jsx.str(
						"label",
						{ class: "ie-titre-petit", id: idLabelGenreIncident },
						ObjetTraduction_1.GTraductions.getValeur("fenetreMotifs.genre"),
					),
					IE.jsx.str("ie-btnselecteur", {
						id: this.idZoneGenreIncident,
						"ie-model": "typeIncident",
						"aria-labelledby": idLabelGenreIncident,
					}),
				),
			),
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			inputCreationMotif: {
				getValue: function () {
					return aInstance.titreNouveauMotif ? aInstance.titreNouveauMotif : "";
				},
				setValue: function (aValue) {
					aInstance.titreNouveauMotif = aValue;
					aInstance.creerNouveauMotif();
				},
				getDisabled: function () {
					return false;
				},
			},
			typeIncident: {
				event() {
					aInstance.lFenetretypeIncident =
						ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_Liste_1.ObjetFenetre_Liste,
							{
								pere: aInstance,
								evenement: (aGenreBouton, aSelection) => {
									if (aGenreBouton !== 1) {
										return;
									}
									aInstance.categorie =
										aInstance.listeSousCategorieDossier.get(aSelection);
									aInstance.creerNouveauMotif();
								},
								initialiser: (aInstance) => {
									const lparamsListe = {
										optionsListe: {
											skin: ObjetListe_1.ObjetListe.skin.flatDesign,
										},
									};
									aInstance.paramsListe = lparamsListe;
									aInstance.setOptionsFenetre({
										titre: ObjetTraduction_1.GTraductions.getValeur(
											"fenetreMotifs.SelectionnerGenre",
										),
										largeur: 450,
										hauteur: 450,
										hauteurMaxContenu: 720,
										avecScroll: true,
										listeBoutons: [
											ObjetTraduction_1.GTraductions.getValeur("Annuler"),
											ObjetTraduction_1.GTraductions.getValeur("Valider"),
										],
									});
								},
							},
						);
					aInstance.lFenetretypeIncident.setDonnees(
						new DonneesListe_CategoriesMotifFd_js_1.DonneesListe_CategoriesMotifFd(
							aInstance.listeSousCategorieDossier,
						),
						true,
					);
				},
				getLibelle() {
					return aInstance.categorie ? aInstance.categorie.getLibelle() : "";
				},
				getDisabled: function () {
					return false;
				},
			},
		});
	}
	surValidation(aGenreBouton) {
		if (aGenreBouton === 1) {
			this.motif = this.creerNouveauMotif();
			this.callback.appel(aGenreBouton, this.motif);
			this.fermer();
		} else {
			this.fermer();
		}
	}
}
exports.ObjetFenetre_SaisieCreationMotif = ObjetFenetre_SaisieCreationMotif;
