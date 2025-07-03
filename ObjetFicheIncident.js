exports.ObjetFicheIncident = void 0;
const GUID_1 = require("GUID");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetFiche_1 = require("ObjetFiche");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Espace_1 = require("Enumere_Espace");
class ObjetFicheIncident extends ObjetFiche_1.ObjetFiche {
	constructor(...aParams) {
		super(...aParams);
		this.idEstVise = GUID_1.GUID.getId();
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur("fiche.incident.titre"),
		});
	}
	getIncident() {
		return this.incident;
	}
	setDonnees(aIncident) {
		this.incident = aIncident;
		this.afficher();
	}
	jsxModeleCheckboxEstVise() {
		return {
			getValue: () => {
				return this.incident.estVise;
			},
			setValue: (aValue) => {
				this.surSelectionEstVise();
			},
		};
	}
	surSelectionEstVise() {
		this.incident.estVise = true;
		this.incident.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.callback.appel();
		this.fermer();
	}
	composeContenu() {
		const H = [];
		H.push('<div class="PetitEspace">');
		H.push(
			'<div class="Espace Gras" style="',
			ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.themeNeutre.claire),
			'">',
			this.incident.strDate,
			" ",
			this.incident.strSignale,
			"</div>",
		);
		H.push('<div class="EspaceHaut">');
		const lDatasIncident = [
			[
				ObjetTraduction_1.GTraductions.getValeur("fiche.incident.motifs"),
				this.incident.strMotifs,
			],
			[
				ObjetTraduction_1.GTraductions.getValeur("fiche.incident.gravite"),
				this.incident.strGravite,
			],
			[
				ObjetTraduction_1.GTraductions.getValeur("fiche.incident.auteur"),
				this.incident.strAuteur,
			],
			[
				ObjetTraduction_1.GTraductions.getValeur("fiche.incident.victime"),
				this.incident.strVictime,
			],
			[
				ObjetTraduction_1.GTraductions.getValeur("fiche.incident.temoin"),
				this.incident.strTemoin,
			],
			[
				ObjetTraduction_1.GTraductions.getValeur(
					"fiche.incident.actionsEnvisagees",
				),
				this.incident.strActionsEnvisagees,
			],
		];
		H.push('<table class="full-width cellpadding-5">');
		const lNbr = lDatasIncident.length;
		for (let i = 0; i < lNbr; i++) {
			const lData = lDatasIncident[i];
			H.push(
				"<tr>",
				'<td style="' + ObjetStyle_1.GStyle.composeWidth(90) + '">',
				lData[0],
				"</td>",
				"<td>" + lData[1],
				"</td>",
				"</tr>",
			);
		}
		H.push("</table>");
		H.push("</div>");
		if (this.incident.listePJ && this.incident.listePJ.count() > 0) {
			for (let i = 0; i < this.incident.listePJ.count(); i++) {
				const lLien = ObjetChaine_1.GChaine.composerUrlLienExterne({
					documentJoint: this.incident.listePJ.get(i),
				});
				H.push('<div class="Espace InlineBlock">', lLien, "</div>");
			}
		}
		if (this.incident.getLibelle() !== "") {
			H.push(
				'<div class="Espace" style="border: 1px solid #CCCCCC;">',
				'<span class="PetitEspaceGauche PetitEspaceDroit">' +
					this.incident.getLibelle(),
				"</span>",
				"</div>",
			);
		}
		if (
			[
				Enumere_Espace_1.EGenreEspace.Administrateur,
				Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
			].includes(GEtatUtilisateur.getNumeroGenreEspace())
		) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "AvecMain GrandEspaceHaut" },
					IE.jsx.str(
						"ie-checkbox",
						{
							"ie-model": this.jsxModeleCheckboxEstVise.bind(this),
							id: this.idEstVise,
						},
						"\u00A0",
						ObjetTraduction_1.GTraductions.getValeur(
							"fiche.incident.labelCocheVise",
						),
					),
				),
			);
		}
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
}
exports.ObjetFicheIncident = ObjetFicheIncident;
