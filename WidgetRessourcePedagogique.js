exports.WidgetRessourcePedagogique = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_RessourcePedagogique_1 = require("Enumere_RessourcePedagogique");
const Enumere_FormatDocJoint_1 = require("Enumere_FormatDocJoint");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const TypeFichierExterneHttpSco_1 = require("TypeFichierExterneHttpSco");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
class WidgetRessourcePedagogique extends ObjetWidget_1.Widget.ObjetWidget {
	construire(aParams) {
		this.donnees = aParams.donnees;
		const lWidget = {
			html: this.composeWidgetRessourcePedagogique(),
			nbrElements: this.donnees.listeRessources.count(),
			afficherMessage: this.donnees.listeRessources.count() === 0,
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			modelChipsQCM: {
				event(aIndex) {
					aInstance._surRessourceQCM(aIndex);
				},
			},
		});
	}
	composeWidgetRessourcePedagogique() {
		for (let i = 0; i < this.donnees.listeRessources.count(); i++) {
			const lRessource = this.donnees.listeRessources.get(i);
			const lMatiere = this.donnees.listeMatieres.getElementParNumero(
				lRessource.matiere.getNumero(),
			);
			if (lMatiere && (!lMatiere.date || lRessource.date > lMatiere.date)) {
				lMatiere.date = lRessource.date;
			}
		}
		this.donnees.listeMatieres.setTri([
			ObjetTri_1.ObjetTri.init(
				"date",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
		]);
		this.donnees.listeMatieres.trier();
		this.donnees.listeRessources.setTri([
			ObjetTri_1.ObjetTri.init(
				"date",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
		]);
		this.donnees.listeRessources.trier();
		const H = [];
		H.push(this.composeWidgetRessourcePedagogiqueMatiere());
		return H.join("");
	}
	composeWidgetRessourcePedagogiqueMatiere() {
		const H = [];
		H.push('<ul class="one-line">');
		for (let i = 0; i < this.donnees.listeRessources.count(); i++) {
			const lRessource = this.donnees.listeRessources.get(i);
			H.push(this.composeWidgetRessourcePedagogiqueRessource(i, lRessource));
		}
		H.push("</ul>");
		return H.join("");
	}
	composeWidgetRessourcePedagogiqueRessource(i, aDocument) {
		const lMatiere = this.donnees.listeMatieres.getElementParNumero(
			aDocument.matiere.getNumero(),
		);
		const H = [];
		const lSuffixe = ObjetChaine_1.GChaine.extraireExtensionFichier(
			aDocument.ressource.getLibelle(),
		);
		const lTypefile =
			Enumere_FormatDocJoint_1.EFormatDocJointUtil.getClassIconDeGenre(
				Enumere_FormatDocJoint_1.EFormatDocJointUtil.getGenreDeFichier(
					lSuffixe,
				),
			);
		const lAriaLabel =
			(lMatiere ? lMatiere.getLibelle() : "") +
			" " +
			ObjetChaine_1.GChaine.format(
				ObjetTraduction_1.GTraductions.getValeur(
					"accueil.ressourcePedagogique.deposeLe",
				),
				[ObjetDate_1.GDate.formatDate(aDocument.date, "%J %MMMM")],
			) +
			" ";
		H.push(`<li tabindex="0" aria-label="${lAriaLabel}">\n    <div class="wrap">\n      ${lMatiere ? `<h3 class="ie-line-color static left" style="--color-line: ${lMatiere.couleur};">${lMatiere.getLibelle()}</h3>` : ``}
      <div class="pj-date-contain">`);
		if (
			aDocument.getGenre() ===
			Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.QCM
		) {
			H.push(
				`  <ie-chips class="iconic avec-event icon_qcm" ${UtilitaireQCM_1.UtilitaireQCM.estCliquable(aDocument.ressource) ? `ie-model="modelChipsQCM(${i})"` : ``}>${aDocument.ressource.QCM.getLibelle()} (${UtilitaireQCM_1.UtilitaireQCM.getStrResumeModalites(aDocument.ressource)})</ie-chips>`,
			);
		} else {
			let lLien = null;
			if (
				aDocument.getGenre() ===
					Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
						.travailRendu &&
				!!aDocument.ressource.documentCorrige
			) {
				lLien = ObjetChaine_1.GChaine.creerUrlBruteLienExterne(
					aDocument.ressource.documentCorrige,
					{
						genreRessource:
							TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
								.TAFCorrigeRenduEleve,
					},
				);
			} else {
				lLien =
					Enumere_RessourcePedagogique_1.EGenreRessourcePedagogiqueUtil.composerURL(
						aDocument.getGenre(),
						aDocument.ressource,
						aDocument.ressource.getLibelle &&
							aDocument.ressource.getLibelle() !== ""
							? aDocument.ressource.getLibelle()
							: !!aDocument.ressource.url
								? aDocument.ressource.url
								: aDocument.ressource,
						true,
					);
			}
			H.push(
				`  <ie-chips style="max-width:35rem;" class="iconic avec-event ${lTypefile}" href="${lLien}">${aDocument.ressource.getLibelle && aDocument.ressource.getLibelle() !== "" ? aDocument.ressource.getLibelle() : (!!aDocument.ressource.url ? aDocument.ressource.url : aDocument.ressource)}</ie-chips>`,
			);
		}
		H.push(
			" </div>",
			`<div class="date m-left-l m-top p-left">${ObjetChaine_1.GChaine.format(ObjetTraduction_1.GTraductions.getValeur("accueil.ressourcePedagogique.deposeLe"), [ObjetDate_1.GDate.formatDate(aDocument.date, "%J %MMMM")])}</div>`,
			"</div>",
			"</li>",
		);
		return H.join("");
	}
	_surRessourceQCM(i) {
		const lRessource = this.donnees.listeRessources.get(i);
		this.callback.appel(
			this.donnees.genre,
			Enumere_EvenementWidget_1.EGenreEvenementWidget.AfficherExecutionQCM,
			lRessource.ressource,
		);
	}
}
exports.WidgetRessourcePedagogique = WidgetRessourcePedagogique;
