exports.DonneesListe_Eleves = void 0;
const Enumere_CommandeMenu_1 = require("Enumere_CommandeMenu");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetChaine_1 = require("ObjetChaine");
const TypeDispenseEleveDeCours_1 = require("TypeDispenseEleveDeCours");
class DonneesListe_Eleves extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aEditionSurGroupeGAEV, aAvecPhotos) {
		super(aDonnees);
		this.editionSurGroupeGAEV = aEditionSurGroupeGAEV;
		this.setOptions({
			avecEdition: false,
			avecEvnt_Creation: true,
			avecEvnt_Suppression: true,
			avecInterruptionSuppression: true,
		});
		let lAvecPhotos = aAvecPhotos;
		if (aAvecPhotos === null || aAvecPhotos === undefined) {
			lAvecPhotos = true;
		}
		this.optionsAffichage = { avecPhotos: lAvecPhotos };
	}
	avecSuppression(aParams) {
		return (
			aParams.article &&
			(this.editionSurGroupeGAEV || aParams.article.historiqueGroupes)
		);
	}
	suppressionConfirmation() {
		return false;
	}
	setOptionsAffichage(aOptions) {
		Object.assign(this.optionsAffichage, aOptions);
	}
	getTypeValeur() {
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Eleves.colonnes.Eleve: {
				const H = [];
				H.push('<div style="display: flex; flex-wrap:nowrap;">');
				if (this.optionsAffichage.avecPhotos) {
					H.push(
						IE.jsx.str(
							"div",
							{ style: "height: 100%; width:39px; flex:none;" },
							IE.jsx.str("img", {
								"ie-load-src": ObjetChaine_1.GChaine.composeUrlImgPhotoIndividu(
									aParams.article,
								),
								class: "img-portrait",
								"ie-imgviewer": true,
								style:
									"height: 50px; width: auto; max-height: 100%; max-width: 100%;",
								alt: aParams.article.getLibelle(),
								"data-libelle": aParams.article.getLibelle(),
							}),
						),
					);
				}
				H.push(
					'<div style="flex:1 1 auto; display:flex; flex-wrap:nowrap; justify-content:space-between; padding-top:0.4rem">',
				);
				H.push(
					'<div class="PetitEspaceGauche" >',
					aParams.article.getLibelle(),
					"</div>",
				);
				H.push("</div>");
				if (
					!!aParams.article.dispensesEleveDeCours &&
					aParams.article.dispensesEleveDeCours.count() > 0
				) {
					H.push(
						TypeDispenseEleveDeCours_1.TypeDispenseEleveDeCoursUtil.construirePictos(
							aParams.article.dispensesEleveDeCours,
						),
					);
				}
				H.push("</div>");
				return H.join("");
			}
			case DonneesListe_Eleves.colonnes.Classe:
				return !!aParams.article.classe
					? aParams.article.classe.getLibelle()
					: "";
		}
		return "";
	}
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Eleves.colonnes.Eleve: {
				return aParams.article.hint
					? `${aParams.article.getLibelle()}\n${aParams.article.hint}`
					: "";
			}
		}
	}
	avecMenuContextuel(aParams) {
		return aParams.article && this.avecSuppression(aParams);
	}
	remplirMenuContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		aParametres.menuContextuel.addCommande(
			Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression,
			ObjetTraduction_1.GTraductions.getValeur("liste.supprimer"),
			!aParametres.nonEditable && this._avecSuppression(aParametres),
		);
	}
}
exports.DonneesListe_Eleves = DonneesListe_Eleves;
(function (DonneesListe_Eleves) {
	let colonnes;
	(function (colonnes) {
		colonnes["Eleve"] = "DL_Eleves_eleve";
		colonnes["Classe"] = "DL_Eleves_classe";
	})(
		(colonnes =
			DonneesListe_Eleves.colonnes || (DonneesListe_Eleves.colonnes = {})),
	);
})(
	DonneesListe_Eleves ||
		(exports.DonneesListe_Eleves = DonneesListe_Eleves = {}),
);
