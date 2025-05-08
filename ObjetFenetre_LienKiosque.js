const { GChaine } = require("ObjetChaine.js");
const { GClass } = require("ObjetClass.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TypeGenreApiKiosque } = require("TypeGenreApiKiosque.js");
const { GHtml } = require("ObjetHtml.js");
class ObjetFenetre_LienKiosque extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.listeRessources = new ObjetListeElements();
	}
	construireInstances() {}
	composeContenu() {
		const T = [];
		T.push('<div style="padding: 5px;">');
		if (!this.pouriDevoir && !this.pourExerciceNum) {
			T.push(
				'<div class="PetitEspaceBas">',
				GTraductions.getValeur("FenetrePanierKiosque.creerL.text0"),
				"</div>",
			);
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				GTraductions.getValeur("FenetrePanierKiosque.creerL.text1"),
				"</div>",
			);
		} else if (this.pouriDevoir) {
			T.push(
				'<div class="EspaceBas">',
				GTraductions.getValeur("FenetrePanierKiosque.info.iDevoir", [
					'<span class="Image_Kiosque_ListeDevoir InlineBlock AlignementMilieuVertical"></span>',
				]),
				"</div>",
			);
			T.push(
				'<div class="PetitEspaceBas">',
				GTraductions.getValeur("FenetrePanierKiosque.creerD.text0"),
				"</div>",
			);
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				GTraductions.getValeur("FenetrePanierKiosque.creerD.text1"),
				"</div>",
			);
		} else if (this.pourExerciceNum) {
			T.push(
				'<div class="EspaceBas">',
				GTraductions.getValeur("FenetrePanierKiosque.info.TAF", [
					'<span class="Image_Kiosque_ListeCahierTexte InlineBlock AlignementMilieuVertical"></span>',
				]),
				"</div>",
			);
			T.push(
				'<div class="PetitEspaceBas">',
				GTraductions.getValeur("FenetrePanierKiosque.creerT.text0"),
				"</div>",
			);
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				GTraductions.getValeur("FenetrePanierKiosque.creerT.text1"),
				"</div>",
			);
		}
		T.push("</div>");
		T.push(
			'<fieldset class="Bordure FondBlanc" style="margin:0; padding:0;">',
			'<legend class="',
			GClass.getLegende(),
			'">',
			GTraductions.getValeur("FenetrePanierKiosque.creer.manuels"),
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
			T.push(
				"<span ",
				GHtml.composeAttr("ie-node", "nodeLien", [
					lRessource.getNumero(),
					lRessource.getGenre(),
				]),
				">",
			);
			T.push(
				GChaine.composerUrlLienExterne({
					documentJoint: lRessource,
					title: lRessource.description,
					libelleEcran: lRessource.titre,
				}),
			);
			T.push("</span>");
			T.push("</div>");
		}
		T.push("</div>");
		T.push("</fieldset>");
		T.push('<div style="padding: 5px;">');
		if (!this.pouriDevoir && !this.pourExerciceNum) {
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				GTraductions.getValeur("FenetrePanierKiosque.creerL.text2", [
					'<i class="icon_exercice_numerique"></i>',
				]),
				"</div>",
			);
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				GTraductions.getValeur("FenetrePanierKiosque.creerL.text3"),
				"</div>",
			);
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				GTraductions.getValeur("FenetrePanierKiosque.creerL.text4"),
				"</div>",
			);
		} else if (this.pouriDevoir) {
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				GTraductions.getValeur("FenetrePanierKiosque.creerD.text2", [
					'<span class="Image_Kiosque_ListeDevoir InlineBlock AlignementMilieuVertical"></span>',
				]),
				"</div>",
			);
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				GTraductions.getValeur("FenetrePanierKiosque.creerD.text3"),
				"</div>",
			);
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				GTraductions.getValeur("FenetrePanierKiosque.creerD.text4", [
					GTraductions.getValeur("FenetrePanierKiosque.creerD.text4b"),
				]),
				"</div>",
			);
		} else if (this.pourExerciceNum) {
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				GTraductions.getValeur("FenetrePanierKiosque.creerT.text2", [
					'<span class="Image_Kiosque_ListeCahierTexte InlineBlock AlignementMilieuVertical"></span>',
				]),
				"</div>",
			);
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				GTraductions.getValeur("FenetrePanierKiosque.creerT.text3"),
				"</div>",
			);
			T.push(
				'<div class="EspaceGauche PetitEspaceBas">',
				GTraductions.getValeur("FenetrePanierKiosque.creerT.text4", [
					GTraductions.getValeur("FenetrePanierKiosque.creerT.text4b"),
				]),
				"</div>",
			);
		}
		T.push("</div>");
		return T.join("");
	}
	setDonnees(aListeRessources, aGenresApiKiosque) {
		this.listeRessources = aListeRessources;
		this.genresApiKiosque = aGenresApiKiosque;
		this.pouriDevoir =
			this.genresApiKiosque.contains(TypeGenreApiKiosque.Api_EnvoiNote) &&
			GEtatUtilisateur.activerKiosqueRenduTAF;
		this.pourExerciceNum =
			this.genresApiKiosque.contains(TypeGenreApiKiosque.Api_RenduPJTAF) &&
			GEtatUtilisateur.activerKiosqueRenduTAF;
		this.actualiser();
		this.afficher();
		this.setBoutonActif(1, false);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			nodeLien: function (aNumero, aGenre) {
				$(this.node).eventValidation(() => {
					const lRessource =
						aInstance.listeRessources.getElementParNumeroEtGenre(
							aNumero,
							aGenre,
						);
					if (!!lRessource) {
						aInstance.callback.appel(
							0,
							lRessource.getGenre() ||
								EGenreRessource.RessourceNumeriqueKiosque,
						);
					}
				});
			},
		});
	}
	surValidation(aGenreBouton) {
		this.fermer();
		this.callback.appel(aGenreBouton);
	}
}
module.exports = ObjetFenetre_LienKiosque;
