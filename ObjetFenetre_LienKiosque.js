exports.ObjetFenetre_LienKiosque = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetClass_1 = require("ObjetClass");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeGenreApiKiosque_1 = require("TypeGenreApiKiosque");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_LienKiosque extends ObjetFenetre_1.ObjetFenetre {
	constructor() {
		super(...arguments);
		this.listeRessources = new ObjetListeElements_1.ObjetListeElements();
	}
	composeContenu() {
		const T = [];
		T.push('<div style="padding: 5px;">');
		if (!this.pouriDevoir && !this.pourExerciceNum) {
			T.push(
				'<div class="PetitEspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePanierKiosque.creerL.text0",
				),
				"</div>",
			);
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePanierKiosque.creerL.text1",
				),
				"</div>",
			);
		} else if (this.pouriDevoir) {
			T.push(
				'<div class="EspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePanierKiosque.info.iDevoir",
					[
						'<span class="Image_Kiosque_ListeDevoir InlineBlock AlignementMilieuVertical"></span>',
					],
				),
				"</div>",
			);
			T.push(
				'<div class="PetitEspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePanierKiosque.creerD.text0",
				),
				"</div>",
			);
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePanierKiosque.creerD.text1",
				),
				"</div>",
			);
		} else if (this.pourExerciceNum) {
			T.push(
				'<div class="EspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePanierKiosque.info.TAF",
					[
						'<span class="Image_Kiosque_ListeCahierTexte InlineBlock AlignementMilieuVertical"></span>',
					],
				),
				"</div>",
			);
			T.push(
				'<div class="PetitEspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePanierKiosque.creerT.text0",
				),
				"</div>",
			);
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePanierKiosque.creerT.text1",
				),
				"</div>",
			);
		}
		T.push("</div>");
		T.push(
			'<fieldset class="Bordure FondBlanc" style="margin:0; padding:0;">',
			'<legend class="',
			ObjetClass_1.GClass.getLegende(),
			'">',
			ObjetTraduction_1.GTraductions.getValeur(
				"FenetrePanierKiosque.creer.manuels",
			),
			"</legend>",
		);
		T.push('<div style="padding: 8px;">');
		for (let i = 0; i < this.listeRessources.count(); i++) {
			const lRessource = this.listeRessources.get(i);
			T.push('<div class="PetitEspaceBas" style="display:flex">');
			T.push(
				'<div class="NoWrap EspaceDroit10">',
				lRessource.editeur || "",
				"</div>",
			);
			const lnodeLien = (aNode) => {
				$(aNode).eventValidation(() => {
					if (!!lRessource) {
						this.callback.appel(
							0,
							lRessource.getGenre() ||
								Enumere_Ressource_1.EGenreRessource.RessourceNumeriqueKiosque,
						);
					}
				});
			};
			T.push(
				IE.jsx.str(
					"span",
					{ "ie-node": lnodeLien },
					ObjetChaine_1.GChaine.composerUrlLienExterne({
						documentJoint: lRessource,
						title: lRessource.description,
						libelleEcran: lRessource.titre,
					}),
				),
			);
			T.push("</div>");
		}
		T.push("</div>");
		T.push("</fieldset>");
		T.push('<div style="padding: 5px;">');
		if (!this.pouriDevoir && !this.pourExerciceNum) {
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePanierKiosque.creerL.text2",
					['<i class="icon_exercice_numerique" role="presentation"></i>'],
				),
				"</div>",
			);
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePanierKiosque.creerL.text3",
				),
				"</div>",
			);
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePanierKiosque.creerL.text4",
				),
				"</div>",
			);
		} else if (this.pouriDevoir) {
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePanierKiosque.creerD.text2",
					[
						'<span class="Image_Kiosque_ListeDevoir InlineBlock AlignementMilieuVertical"></span>',
					],
				),
				"</div>",
			);
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePanierKiosque.creerD.text3",
				),
				"</div>",
			);
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePanierKiosque.creerD.text4",
					[
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetrePanierKiosque.creerD.text4b",
						),
					],
				),
				"</div>",
			);
		} else if (this.pourExerciceNum) {
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePanierKiosque.creerT.text2",
					[
						'<span class="Image_Kiosque_ListeCahierTexte InlineBlock AlignementMilieuVertical"></span>',
					],
				),
				"</div>",
			);
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePanierKiosque.creerT.text3",
				),
				"</div>",
			);
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePanierKiosque.creerT.text4",
					[
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetrePanierKiosque.creerT.text4b",
						),
					],
				),
				"</div>",
			);
		}
		T.push("</div>");
		return T.join("");
	}
	setDonnees(aListeRessources, aGenresApiKiosque) {
		const lEtatUtil = (0, AccessApp_1.getApp)().getEtatUtilisateur();
		this.listeRessources = aListeRessources;
		this.genresApiKiosque = aGenresApiKiosque;
		this.pouriDevoir =
			this.genresApiKiosque.contains(
				TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_EnvoiNote,
			) && lEtatUtil.activerKiosqueRenduTAF;
		this.pourExerciceNum =
			this.genresApiKiosque.contains(
				TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_RenduPJTAF,
			) && lEtatUtil.activerKiosqueRenduTAF;
		this.actualiser();
		this.afficher();
		this.setBoutonActif(1, false);
	}
	surValidation(aGenreBouton) {
		this.fermer();
		this.callback.appel(aGenreBouton);
	}
}
exports.ObjetFenetre_LienKiosque = ObjetFenetre_LienKiosque;
