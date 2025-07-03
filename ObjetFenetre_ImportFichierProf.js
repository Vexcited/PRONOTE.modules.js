exports.ObjetFenetre_ImportFichierProf = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetRequeteSaisieImportFichierProf_1 = require("ObjetRequeteSaisieImportFichierProf");
const TypeGenreEchangeDonnees_1 = require("TypeGenreEchangeDonnees");
const ObjetTraduction_2 = require("ObjetTraduction");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const TradObjetFenetre_ImportFichierProf =
	ObjetTraduction_2.TraductionsModule.getModule(
		"ObjetFenetre_ImportFichierProf",
		{
			ChoisirLeFichier: "",
			ReussiteImport: "",
			TexteExplicatif: "",
			TexteExplicatifModelesSond: "",
		},
	);
class ObjetFenetre_ImportFichierProf extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			largeur: 380,
			titre: "",
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Annuler")],
			avecTailleSelonContenu: true,
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnUpload: {
				getOptionsSelecFile: function () {
					return {
						maxSize: 500 * 1024 * 1024,
						accept: "application/zip",
						extensions: ["zip"],
						avecTransformationFlux: false,
					};
				},
				addFiles: (aParametres) => {
					aInstance.fermer();
					new ObjetRequeteSaisieImportFichierProf_1.ObjetRequeteSaisieImportFichierProf(
						{},
					)
						.addUpload({
							listeFichiers: aParametres.listeFichiers,
							maxChunkSize: 1 * 1024 * 1024,
							annulerSurErreurUpload: true,
						})
						.lancerRequete({ genreFichier: aInstance.options.genreFichier })
						.then((aReponse) => {
							if (
								aReponse.genreReponse ===
								ObjetRequeteJSON_1.EGenreReponseSaisie.succes
							) {
								return GApplication.getMessage().afficher({
									message: TradObjetFenetre_ImportFichierProf.ReussiteImport,
									callback: () => {
										this.callback.appel();
									},
								});
							}
						});
				},
			},
		});
	}
	setDonnees() {
		this.afficher();
	}
	composeBoutons() {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				super.composeBoutons(),
				IE.jsx.str(
					"div",
					{ class: "btn-conteneur", style: "flex: none; padding-left: 0" },
					IE.jsx.str(
						"ie-bouton",
						{
							"ie-model": "btnUpload",
							class: "themeBoutonPrimaire",
							"ie-selecfile": true,
						},
						TradObjetFenetre_ImportFichierProf.ChoisirLeFichier,
					),
				),
			),
		);
		return H.join("");
	}
	composeContenu() {
		let lMsg = "";
		switch (this.options.genreFichier) {
			case TypeGenreEchangeDonnees_1.TypeGenreEchangeDonnees.GED_PAS:
				lMsg = TradObjetFenetre_ImportFichierProf.TexteExplicatif;
				break;
			case TypeGenreEchangeDonnees_1.TypeGenreEchangeDonnees.GED_ModelesSondage:
				lMsg = TradObjetFenetre_ImportFichierProf.TexteExplicatifModelesSond;
				break;
		}
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				{ class: "Table Texte10" },
				ObjetChaine_1.GChaine.replaceRCToHTML(lMsg),
			),
		);
		return T.join("");
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		this.callback.appel(aNumeroBouton);
	}
}
exports.ObjetFenetre_ImportFichierProf = ObjetFenetre_ImportFichierProf;
