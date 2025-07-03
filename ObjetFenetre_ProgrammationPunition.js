exports.ObjetFenetre_ProgrammationPunition = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const DetailProgrammationPunition_tsxModele_js_1 = require("DetailProgrammationPunition.tsxModele.js");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_ProgrammationPunition extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			modale: false,
			largeurMin: 500,
			avecScroll: true,
			hauteurMaxContenu: 500,
			callback: (aNumeroBouton, aParams) => {
				if (aParams.bouton && aParams.bouton.navigation) {
					aParams.bouton.navigation();
				}
			},
		});
	}
	setDonnees(aParametres) {
		const lParametres = Object.assign({ titre: "", liste: null }, aParametres);
		const lApp = (0, AccessApp_1.getApp)();
		const lListeBoutons = [
			{
				libelle: ObjetTraduction_1.GTraductions.getValeur("Fermer"),
				fermer: true,
			},
		];
		const lOnglet = GEtatUtilisateur.listeOnglets.getElementParGenre(
			Enumere_Onglet_1.EGenreOnglet.Saisie_Punitions,
		);
		if (lOnglet && lOnglet.Actif && lParametres.punition) {
			lListeBoutons.push({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"ObjetFenetre_ProgrammationPunition.VoirLeDetail",
				),
				navigation: function () {
					lApp
						.getEtatUtilisateur()
						.setNrPunitionSelectionnee(lParametres.punition.getNumero());
					lApp
						.getInterfaceEspace()
						.changementManuelOnglet(
							Enumere_Onglet_1.EGenreOnglet.Saisie_Punitions,
						);
				},
			});
		}
		this.setOptionsFenetre({
			titre: lParametres.titre,
			listeBoutons: lListeBoutons,
		});
		const H = [];
		if (lParametres.liste && lParametres.liste.length > 0) {
			lParametres.liste.forEach((aProgrammation, aIndex) => {
				if (lParametres.liste.length > 1 && aProgrammation.nom) {
					H.push(
						IE.jsx.str(
							"div",
							{
								class: ["p-all m-all", aIndex >= 1 ? "m-top-l" : ""],
								style: "background-color:var(--theme-neutre-moyen1);",
							},
							aProgrammation.nom,
						),
					);
				}
				H.push(
					DetailProgrammationPunition_tsxModele_js_1.ModeleDetailProgrammationPunition.getHtml(
						{
							details: aProgrammation,
							circonstances: ObjetChaine_1.GChaine.replaceRCToHTML(
								aProgrammation.circonstances,
							),
							commentaire: aProgrammation.commentaire
								? ObjetChaine_1.GChaine.replaceRCToHTML(
										aProgrammation.commentaire,
									)
								: "",
							styleMaxTaille: "max-width : 600px;max-height : 200px;",
						},
					),
				);
			});
		}
		this.afficher(H.join(""));
		return this;
	}
}
exports.ObjetFenetre_ProgrammationPunition = ObjetFenetre_ProgrammationPunition;
