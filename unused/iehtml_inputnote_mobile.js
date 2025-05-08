const IEHtml = require("IEHtml");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetIdentite_1 = require("ObjetIdentite");
const Clavier_SaisieNote_1 = require("Clavier_SaisieNote");
const UtilsInputNote_EspaceMobile_1 = require("UtilsInputNote_EspaceMobile");
IEHtml.addBalise("ie-inputnote", (aContexteCourant, aOutils) => {
	let lRacine,
		lNomModele = aOutils.getModel(aContexteCourant),
		lOptions = (0, UtilsInputNote_EspaceMobile_1.UtilsInputNoteInitOptions)();
	const lJInput = $(IE.jsx.str("div", null));
	lRacine = lJInput.get(0);
	const lSetHtmlNote = function (aNote) {
		let lVal = "";
		if (aNote) {
			if (!lOptions.avecVirgule || !lOptions.afficherAvecVirgule) {
				lVal = aNote.getNoteSansDecimaleForcee();
			} else {
				lVal = aNote.getNote();
			}
		}
		ObjetHtml_1.GHtml.setHtml(lRacine, lVal || "&nbsp;");
	};
	aOutils.copyAttributs(aContexteCourant.node, lRacine);
	lRacine.classList.add("ie-inputnote");
	aOutils.replaceNode(aContexteCourant.node, lRacine);
	aOutils.addCommentaireDebug(lRacine, "ie-inputnote");
	if (lNomModele) {
		aOutils.surNodeEtNodeAfter(aContexteCourant);
		const lGetOptions = aOutils.getAccesParametresModel(
				"getOptionsNote",
				aContexteCourant,
			),
			lGetNote = aOutils.getAccesParametresModel("getNote", aContexteCourant),
			lSetNote = aOutils.getAccesParametresModel("setNote", aContexteCourant),
			lGetDisabled = aOutils.getAccesParametresModel(
				"getDisabled",
				aContexteCourant,
			);
		if (lGetOptions.estFonction) {
			Object.assign(lOptions, lGetOptions.callback());
		}
		if (lOptions.textAlign) {
			lJInput.css("text-align", lOptions.textAlign);
		}
		if (lGetNote.estFonction && lSetNote.estFonction) {
			let lNote = lGetNote.callback();
			lSetHtmlNote(lNote);
			let lDisabled = false;
			if (lGetDisabled.estFonction) {
				lDisabled = !!lGetDisabled.callback();
				if (lDisabled) {
					lRacine.classList.add("disabled");
				}
			}
			lJInput.on({
				click: function () {
					if (lDisabled) {
						return;
					}
					lRacine.classList.add("active");
					const lClavierSaisieNote = ObjetIdentite_1.Identite.creerInstance(
						Clavier_SaisieNote_1.Clavier_SaisieNote,
						{
							pere: {},
							evenement: function (aValeurSaisie) {
								lSetNote.callback([aValeurSaisie]);
								const lNote = lGetNote.callback();
								lSetHtmlNote(lNote);
								lRacine.classList.remove("active");
								aContexteCourant.contexte.refresh();
							},
						},
					);
					const lNote = lGetNote.callback();
					lClavierSaisieNote.setOptions({
						valeurInit: lNote.getNote(),
						metier: {
							avecAnnotations: lOptions.avecAnnotation,
							avecSeparateurDecimal: lOptions.avecVirgule,
							avecSigneMoins: lOptions.avecSigneMoins,
							sansNotePossible: lOptions.sansNotePossible,
							min: lOptions.min,
							max: lOptions.max,
							htmlContexte: lOptions.htmlContexte,
						},
						grille: { nbLignes: 4 },
					});
					lClavierSaisieNote.afficher();
				}.bind(aContexteCourant.instance),
			});
			aOutils.abonnerRefresh(
				() => {
					const lNewNote = lGetNote.callback();
					if (
						(lNewNote && !lNote) ||
						(!lNewNote && lNote) ||
						(lNewNote.egal && !lNewNote.egal(lNote))
					) {
						lNote = lNewNote;
						lSetHtmlNote(lNote);
					}
					if (lGetDisabled.estFonction) {
						const lNewDisabled = !!lGetDisabled.callback();
						if (lDisabled !== lNewDisabled) {
							lDisabled = lNewDisabled;
							if (lDisabled) {
								lRacine.classList.add("disabled");
							} else {
								lRacine.classList.remove("disabled");
							}
						}
					}
				},
				lRacine,
				aContexteCourant,
			);
		} else {
		}
	} else {
	}
	return { node: aContexteCourant.node };
});
