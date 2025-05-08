exports.ObjetComposeHtml = void 0;
const ObjetStyle_1 = require("ObjetStyle");
class ObjetComposeHtml {
	static bandeauConsole(aContenu, aTabBtnIcones) {
		const H = [];
		H.push(
			'<table style="',
			ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.bandeau.fond),
			ObjetStyle_1.GStyle.composeCouleurTexte(GCouleur.bandeau.texte),
			ObjetStyle_1.GStyle.composeCouleurBordure(GCouleur.bandeau.fond),
			'" class="Table cellspacing-1">',
			"<tr>",
			'<td class="Texte10 Gras PetitEspace">' + aContenu + "</td>",
		);
		if (aTabBtnIcones) {
			for (let I = 0; I < aTabBtnIcones.length; I++) {
				const lHtmlBtnIcone = aTabBtnIcones[I];
				H.push(
					IE.jsx.str(
						"td",
						{
							style: "width:10px;",
							class: "AlignementDroit EspaceDroit Texte10",
						},
						lHtmlBtnIcone,
					),
				);
			}
		}
		H.push("</tr>", "</table>");
		return H.join("");
	}
	static message(aMessage) {
		const H = [];
		H.push(
			'<table class="Table" style="',
			ObjetStyle_1.GStyle.composeCouleurFond("white"),
			ObjetStyle_1.GStyle.composeCouleurTexte(GCouleur.texte),
			'">',
			'<tr><td class="Texte10 AlignementHaut AlignementMilieu GrandEspaceHaut Gras">',
			aMessage,
			"</td></tr>",
			"</table>",
		);
		return H.join("");
	}
	static deployer(aIdContenu, aDeploye) {
		if (aIdContenu) {
			const lEstDeploye =
				aDeploye !== null && aDeploye !== undefined
					? aDeploye
					: !ObjetStyle_1.GStyle.getDisplay(aIdContenu);
			ObjetStyle_1.GStyle.setDisplay(aIdContenu, lEstDeploye);
		}
	}
}
exports.ObjetComposeHtml = ObjetComposeHtml;
