exports.GestionImpression = exports.ObjetFenetre_Impression = void 0;
const GUID_1 = require("GUID");
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetWAI_1 = require("ObjetWAI");
require("IEHtml.Scroll.js");
class ObjetFenetre_Impression extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.IdImpression = this.Nom + "_Impression";
		Invocateur_1.Invocateur.abonner(
			"LargeurZoneImpression",
			this._getLargeurZoneImpression,
			this,
		);
	}
	static getZoneImpression() {
		let lElement = ObjetHtml_1.GHtml.getElement(
			ObjetFenetre_Impression.idZoneImpression,
		);
		if (!lElement) {
			$(document.body)
				.find(":first")
				.before(
					'<div id="' +
						ObjetFenetre_Impression.idZoneImpression +
						'" class="Masquer_Screen FondBlanc full-width"></div>',
				);
			lElement = ObjetHtml_1.GHtml.getElement(
				ObjetFenetre_Impression.idZoneImpression,
			);
		}
		return lElement;
	}
	construireInstances() {
		this.IdentFormat = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this.evenementFormat,
			this.initialiserFormat,
		);
	}
	initialiserFormat(aInstance) {
		aInstance.setOptionsObjetSaisie({ estLargeurAuto: true });
		aInstance.setOptionsObjetSaisie({
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreImpression.FormatDImpression",
			),
		});
	}
	composeContenu() {
		const lWidth = this.optionsFenetre.largeur - 14;
		const T = [];
		T.push(
			'<div id="' + this.Nom + '_Format" class="NePasImprimer EspaceBas">',
		);
		T.push(
			'<span class="EspaceHaut" style="float: left;">' +
				ObjetChaine_1.GChaine.insecable(
					ObjetTraduction_1.GTraductions.getValeur(
						"fenetreImpression.FormatDImpression",
					) + " : ",
				) +
				"</span>",
		);
		T.push(
			'<div class="Inline" id="' +
				this.getNomInstance(this.IdentFormat) +
				'"></div>',
		);
		T.push("</div>");
		T.push(
			"<div ",
			ObjetWAI_1.GObjetWAI.composeAttribut({
				genre: ObjetWAI_1.EGenreAttribut.label,
				valeur: ObjetTraduction_1.GTraductions.getValeur("WAI.ZoneDImpression"),
			}),
			' class="Fenetre_Impression FondBlanc" style="width:' + lWidth + 'px;">',
			'<div id="' +
				this.IdImpression +
				'" style="width:' +
				lWidth +
				'px;"></div>',
			"</div>",
		);
		return T.join("");
	}
	composePage(AFormat) {
		AFormat = MethodesObjet_1.MethodesObjet.isNumber(AFormat) ? AFormat : 100;
		const lInstance = this._parametresImpression.instance;
		const lParams = _construirePageImpression(
			lInstance.getPageImpression(AFormat),
		);
		ObjetHtml_1.GHtml.setHtml(
			this.IdImpression,
			lParams.html.replace(ObjetFenetre_Impression.regexp, ""),
			{ controleur: lParams.controleur },
		);
		ObjetHtml_1.GHtml.setHtml(
			ObjetFenetre_Impression.getZoneImpression(),
			ObjetHtml_1.GHtml.getHtml(this.IdImpression),
		);
	}
	surValidation(ANumeroBouton) {
		if (ANumeroBouton === 1) {
			window.print();
			setTimeout(this.fermer.bind(this), 2000);
			ObjetHtml_1.GHtml.setHtml(
				ObjetFenetre_Impression.getZoneImpression(),
				ObjetTraduction_1.GTraductions.getValeur("MessageImpression"),
			);
		} else {
			this.fermer();
		}
		this.callback.appel(ANumeroBouton);
	}
	async fermer() {
		ObjetHtml_1.GHtml.setHtml(
			ObjetFenetre_Impression.getZoneImpression(),
			ObjetTraduction_1.GTraductions.getValeur("MessageImpression"),
		);
		delete this._parametresImpression;
		super.fermer();
	}
	imprimer(aParametresImpression) {
		this._parametresImpression = {
			etat: Enumere_GenreImpression_1.EGenreImpression.Aucune,
			instance: null,
		};
		$.extend(this._parametresImpression, aParametresImpression);
		const LListeFormats = new ObjetListeElements_1.ObjetListeElements();
		switch (this._parametresImpression.etat) {
			case Enumere_GenreImpression_1.EGenreImpression.Proportion: {
				for (let I = 10; I > 0; I--) {
					LListeFormats.addElement(
						new ObjetElement_1.ObjetElement(I * 10 + "%", null, I * 10),
					);
				}
				break;
			}
			case Enumere_GenreImpression_1.EGenreImpression
				.ProportionTempSaisieNotes: {
				for (let I = 2; I >= 0; I--) {
					LListeFormats.addElement(
						new ObjetElement_1.ObjetElement(
							50 + I * 25 + "%",
							null,
							50 + I * 25,
						),
					);
				}
				break;
			}
			case Enumere_GenreImpression_1.EGenreImpression.Format: {
				LListeFormats.addElement(
					new ObjetElement_1.ObjetElement(
						ObjetTraduction_1.GTraductions.getValeur(
							"fenetreImpression.GrandFormat",
						),
						null,
						0,
					),
				);
				LListeFormats.addElement(
					new ObjetElement_1.ObjetElement(
						ObjetTraduction_1.GTraductions.getValeur(
							"fenetreImpression.MoyenFormat",
						),
						null,
						1,
					),
				);
				LListeFormats.addElement(
					new ObjetElement_1.ObjetElement(
						ObjetTraduction_1.GTraductions.getValeur(
							"fenetreImpression.PetitFormat",
						),
						null,
						2,
					),
				);
				LListeFormats.addElement(
					new ObjetElement_1.ObjetElement(
						ObjetTraduction_1.GTraductions.getValeur(
							"fenetreImpression.TresPetitFormat",
						),
						null,
						3,
					),
				);
				break;
			}
		}
		this.getInstance(this.IdentFormat).setDonnees(LListeFormats, 0);
		ObjetHtml_1.GHtml.setDisplay(this.Nom + "_Format", !!LListeFormats.count());
		if (LListeFormats.count() === 0) {
			this.composePage();
		}
		this.afficher();
	}
	evenementFormat(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.composePage(aParams.element.getGenre());
		}
	}
	_getLargeurZoneImpression(aObjet) {
		if (aObjet) {
			aObjet.width = $("#" + this.IdImpression.escapeJQ()).innerWidth();
		}
	}
}
exports.ObjetFenetre_Impression = ObjetFenetre_Impression;
ObjetFenetre_Impression.idZoneImpression =
	GUID_1.GUID.getId() + "_zoneImpression";
ObjetFenetre_Impression.regexp =
	/(id|onkeyup|onkeydown|onclick|onmouseup|onmousedown|tabindex|ie-hint|ie-title|ie-event)=".*?"/gi;
function _construirePageImpression(aParametres) {
	const lParams = $.extend(
		{
			titre1: "",
			titre2: "",
			contenu: "",
			legende: "",
			proportion: 100,
			controleur: null,
			html: "",
		},
		aParametres,
	);
	const lHTML = [];
	lHTML.push('<table class="FondBlanc Table">');
	if (lParams.titre1) {
		lHTML.push(
			'<tr><td style="height: 10px;" class="Texte12 Gras AlignementMilieu"><div style="font-size:',
			lParams.proportion,
			'%" >',
			lParams.titre1,
			"<br>",
			lParams.titre2 ? "" : "<br>",
			"</font></td></tr>",
		);
	}
	if (lParams.titre2) {
		lHTML.push(
			'<tr><td style="height: 10px;" class="Gras AlignementMilieu EspaceHaut"><div style="font-size:',
			lParams.proportion,
			'%" >',
			lParams.titre2,
			"<br><br></font></td></tr>",
		);
	}
	lHTML.push('<tr><td valign="top">', lParams.contenu, "</td></tr>");
	if (!!lParams.legende) {
		lHTML.push('<tr><td valign="top">', lParams.legende, "</td></tr>");
	}
	lParams.html = lHTML.join("");
	return lParams;
}
const GestionImpression = {
	surActivationImpression: function (aEtatImpression, aInstance, aCallback) {
		if (aEtatImpression !== Enumere_GenreImpression_1.EGenreImpression.Aucune) {
			if (!aInstance) {
				aEtatImpression = Enumere_GenreImpression_1.EGenreImpression.Aucune;
			}
			if (
				aEtatImpression ===
				Enumere_GenreImpression_1.EGenreImpression.GenerationPDF
			) {
				if (!aCallback) {
					aEtatImpression = Enumere_GenreImpression_1.EGenreImpression.Aucune;
				}
			} else {
				if (!aInstance.getPageImpression) {
					aEtatImpression = Enumere_GenreImpression_1.EGenreImpression.Aucune;
				}
			}
		}
		if (aEtatImpression !== Enumere_GenreImpression_1.EGenreImpression.Aucune) {
			GEtatUtilisateur.impressionCourante = {
				etat: aEtatImpression,
				instance: aInstance,
				callback: aCallback,
			};
		} else {
			delete GEtatUtilisateur.impressionCourante;
		}
	},
};
exports.GestionImpression = GestionImpression;
