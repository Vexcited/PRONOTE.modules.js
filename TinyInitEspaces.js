const TinyInit_1 = require("TinyInit");
const ObjetTraduction_1 = require("ObjetTraduction");
const Invocateur_1 = require("Invocateur");
const ToucheClavier_1 = require("ToucheClavier");
TinyInit_1.TinyInit.setOptionsInitTiny({
	setupParDefaut(editor) {
		editor.on("keydown", (aEvent) => {
			if (
				aEvent.which === ToucheClavier_1.ToucheClavier._0 &&
				aEvent.altKey &&
				!aEvent.shiftKey &&
				!aEvent.ctrlKey
			) {
				aEvent.stopPropagation();
				return;
			}
			Invocateur_1.Invocateur.evenement("controleTouche", $.Event(aEvent));
		});
		editor.on("MouseDown", () => {
			$(document).trigger("mousedown");
		});
	},
	afficherMessage() {
		GApplication.getMessage().afficher({
			message: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.MessageSuppressionImage",
			),
		});
	},
});
