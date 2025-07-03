const IEHtml_1 = require("IEHtml");
const Clavier_SaisieNote_1 = require("Clavier_SaisieNote");
const UtilsInputNote_EspaceMobile_1 = require("UtilsInputNote_EspaceMobile");
IEHtml_1.default.addBalise("ie-inputnote", (aContexteCourant, aOutils) => {
	let lRacine,
		lNomModele = aOutils.getModel(aContexteCourant),
		lOptions = (0, UtilsInputNote_EspaceMobile_1.UtilsInputNoteInitOptions)();
	let lJInput;
	let lModeleInputInterne;
	const lGetOptions = aOutils.getAccesParametresModel(
		"getOptionsNote",
		aContexteCourant,
	);
	if (lGetOptions.estFonction) {
		Object.assign(lOptions, lGetOptions.callback([aContexteCourant.node]));
		if (!lOptions.avecVirgule) {
			lOptions.afficherAvecVirgule = false;
		}
	}
	if (lNomModele) {
		aOutils.surNodeEtNodeAfter(aContexteCourant);
		const lGetNote = aOutils.getAccesParametresModel(
				"getNote",
				aContexteCourant,
			),
			lSetNote = aOutils.getAccesParametresModel("setNote", aContexteCourant),
			lGetDisabled = aOutils.getAccesParametresModel(
				"getDisabled",
				aContexteCourant,
			);
		if (lGetNote.estFonction && lSetNote.estFonction) {
			const lGetNoteFormat = function (aNote) {
				let lVal = "";
				if (aNote) {
					if (!lOptions.avecVirgule || !lOptions.afficherAvecVirgule) {
						lVal = aNote.getNoteSansDecimaleForcee();
					} else {
						lVal = aNote.getNote();
					}
				}
				return lVal;
			};
			const lFuncGetDisabled = () => {
				return lGetDisabled.estFonction
					? lGetDisabled.callback([aContexteCourant.node])
					: false;
			};
			let lNoteFormat = lGetNoteFormat(
				lGetNote.callback([aContexteCourant.node]),
			);
			lModeleInputInterne = () => {
				return {
					getValue() {
						return lNoteFormat;
					},
					setValue() {},
					getDisabled() {
						return lFuncGetDisabled();
					},
					node(aNode) {
						$(aNode).eventValidation(() => {
							if (lFuncGetDisabled()) {
								return;
							}
							lRacine.classList.add("active");
							const lClavierSaisieNote =
								new Clavier_SaisieNote_1.Clavier_SaisieNote({
									evenement(aValeurSaisie) {
										lSetNote.callback([aValeurSaisie, aContexteCourant.node]);
										const lNote = lGetNote.callback([aContexteCourant.node]);
										lNoteFormat = lGetNoteFormat(lNote);
										lRacine.classList.remove("active");
										IEHtml_1.default.refresh(true);
									},
								});
							const lNote = lGetNote.callback([aContexteCourant.node]);
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
						});
					},
				};
			};
		} else {
		}
	} else {
	}
	lJInput = $(
		IE.jsx.str("input", {
			readonly: true,
			type: "text",
			"aria-haspopup": "dialog",
			"ie-model": lModeleInputInterne || false,
		}),
	);
	lRacine = lJInput.get(0);
	lJInput.ieData(aContexteCourant.data);
	aOutils.copyAttributs(aContexteCourant.node, lRacine, (aName) => {
		return aName !== "type";
	});
	aOutils.replaceNode(aContexteCourant.node, lRacine);
	lRacine.classList.add("ie-inputnote");
	aOutils.addCommentaireDebug(lRacine, "ie-inputnote");
	if (lNomModele) {
		aOutils.surNodeEtNodeAfter(aContexteCourant);
		aContexteCourant.node = lRacine;
		if (lOptions.textAlign) {
			$(lRacine).css("text-align", lOptions.textAlign);
		}
		aOutils.gererInputText(aContexteCourant, "text");
	}
	return { node: aContexteCourant.node, ignorerInputText: true };
});
