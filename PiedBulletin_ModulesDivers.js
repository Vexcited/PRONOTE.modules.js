exports.PiedBulletin_Engagements =
	exports.PiedBulletin_Credits =
	exports.PiedBulletin_Projets =
	exports.PiedBulletin_Legende =
	exports.PiedBulletin_Mentions =
	exports.PiedBulletin_Stages =
	exports.PiedBulletin_VieScolaire =
		void 0;
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeModeAffichagePiedBulletin_1 = require("TypeModeAffichagePiedBulletin");
const ObjetDate_1 = require("ObjetDate");
class PiedBulletin_VieScolaire extends ObjetIdentite_1.Identite {
	constructor() {
		super(...arguments);
		this.params = {
			modeAffichage:
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Onglets,
		};
	}
	setDonnees(aParam) {
		$.extend(true, this.params, aParam);
	}
	estAffiche() {
		return true;
	}
	afficher(aParam) {
		$.extend(true, this.params, aParam);
		switch (aParam.modeAffichage) {
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Onglets:
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Lineaire:
				ObjetHtml_1.GHtml.setHtml(
					this.Nom,
					this._construireAbsences(this.params.absences),
				);
				break;
		}
	}
	_construireAbsences(aParam) {
		const T = [];
		for (const lAbs in aParam) {
			if (aParam[lAbs]) {
				T.push(aParam[lAbs]);
			}
		}
		const H = [];
		if (T.length > 0) {
			H.push(
				IE.jsx.str(
					"h2",
					{
						class: "p-y ie-titre-petit Gras",
						style: ObjetStyle_1.GStyle.composeCouleurTexte(
							GCouleur.themeCouleur.foncee,
						),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"PiedDeBulletin.VieScolaire",
					),
				),
			);
			H.push(IE.jsx.str("p", null, T.join(" - ")));
		}
		return H.join("");
	}
}
exports.PiedBulletin_VieScolaire = PiedBulletin_VieScolaire;
class PiedBulletin_Stages extends ObjetIdentite_1.Identite {
	constructor() {
		super(...arguments);
		this.params = {
			modeAffichage:
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Onglets,
		};
	}
	setDonnees(aParam) {
		$.extend(true, this.params, aParam);
	}
	estAffiche() {
		return !!(this.params.listeStages && this.params.listeStages.count());
	}
	afficher(aParam) {
		$.extend(true, this.params, aParam);
		switch (aParam.modeAffichage) {
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Onglets:
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Lineaire:
				ObjetHtml_1.GHtml.setHtml(
					this.Nom,
					this._construireStages(this.params.listeStages),
				);
				break;
		}
	}
	_construireStages(aListeStages) {
		const T = [];
		if (!!aListeStages) {
			T.push('<div class="Espace">');
			aListeStages.parcourir((aStage) => {
				T.push('<div class="EspaceBas">');
				if (!!aStage.session) {
					T.push("<p>", aStage.session, "</p>");
				}
				const lLibelleStage = [aStage.getLibelle()];
				if (!!aStage.dateInterruption) {
					lLibelleStage.push(
						" - ",
						ObjetTraduction_1.GTraductions.getValeur("stage.InterrompuLe"),
						" ",
						ObjetDate_1.GDate.formatDate(
							aStage.dateInterruption,
							"%JJ/%MM/%AAAA",
						),
					);
				}
				T.push("<p>", lLibelleStage.join(""), "</p>");
				if (!!aStage.listeMaitresDeStage) {
					aStage.listeMaitresDeStage.parcourir((D) => {
						T.push(
							'<p class="EspaceGauche">',
							"<span>",
							D.getLibelle(),
							"  : ",
							"</span>",
							'<span class="Gras">',
							D.appreciation || "",
							"</span>",
							"</p>",
						);
					});
				}
				if (!!aStage.listeProfesseurs) {
					aStage.listeProfesseurs.parcourir((D) => {
						T.push(
							'<p class="EspaceGauche">',
							"<span>",
							D.getLibelle(),
							"  : ",
							"</span>",
							'<span class="Gras">',
							D.appreciation || "",
							"</span>",
							"</p>",
						);
					});
				}
				T.push("</div>");
			});
			T.push("</div>");
		}
		return T.join("");
	}
}
exports.PiedBulletin_Stages = PiedBulletin_Stages;
class PiedBulletin_Mentions extends ObjetIdentite_1.Identite {
	constructor() {
		super(...arguments);
		this.params = {
			modeAffichage:
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Onglets,
		};
	}
	setDonnees(aParam) {
		$.extend(true, this.params, aParam);
	}
	estAffiche() {
		return !!(
			this.params.listeMentionsClasse && this.params.listeMentionsClasse.count()
		);
	}
	afficher(aParam) {
		$.extend(true, this.params, aParam);
		switch (aParam.modeAffichage) {
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Onglets:
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Lineaire:
				ObjetHtml_1.GHtml.setHtml(
					this.Nom,
					this._construireMentions(this.params.listeMentionsClasse),
				);
				break;
		}
	}
	setParametres(aParam) {
		$.extend(true, this.params, aParam);
	}
	_construireMentions(aParam) {
		const T = [];
		if (aParam && aParam.count()) {
			const lClass =
				this.params.modeAffichage ===
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Onglets
					? "Espace"
					: "";
			T.push('<div class="', lClass, '" >');
			T.push(
				IE.jsx.str(
					"h2",
					{ style: "display: inline;" },
					ObjetTraduction_1.GTraductions.getValeur(
						"PiedDeConseilDeClasse.Mentions",
					),
					" :",
				),
			);
			const H = [];
			for (let i = 0, lNbr = aParam.count(); i < lNbr; i++) {
				const lElt = aParam.get(i);
				H.push(lElt.Nombre + "&nbsp;" + lElt.getLibelle());
			}
			T.push(
				'<p style="display: inline;" class="Gras">',
				H.join(" - "),
				"</p>",
			);
			T.push("</div>");
		}
		return T.join("");
	}
}
exports.PiedBulletin_Mentions = PiedBulletin_Mentions;
class PiedBulletin_Legende extends ObjetIdentite_1.Identite {
	constructor() {
		super(...arguments);
		this.params = {
			modeAffichage:
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Lineaire,
		};
	}
	setDonnees(aParam) {
		$.extend(true, this.params, aParam);
	}
	estAffiche() {
		return this.params.legende && this.params.legende.length > 0;
	}
	afficher(aParam) {
		$.extend(true, this.params, aParam);
		switch (aParam.modeAffichage) {
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Onglets:
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Lineaire:
				ObjetHtml_1.GHtml.setHtml(
					this.Nom,
					this._construireLegende(this.params.legende),
				);
				break;
		}
	}
	_construireLegende(aParam) {
		const T = [];
		if (aParam) {
			T.push(IE.jsx.str("p", { class: "Italique" }, aParam));
		}
		return T.join("");
	}
}
exports.PiedBulletin_Legende = PiedBulletin_Legende;
class PiedBulletin_Projets extends ObjetIdentite_1.Identite {
	constructor() {
		super(...arguments);
		this.params = {
			modeAffichage:
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Lineaire,
		};
	}
	setDonnees(aParam) {
		$.extend(true, this.params, aParam);
	}
	estAffiche() {
		return true;
	}
	afficher(aParam) {
		$.extend(true, this.params, aParam);
		switch (aParam.modeAffichage) {
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Onglets:
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Lineaire:
				ObjetHtml_1.GHtml.setHtml(
					this.Nom,
					this._construireProjets(this.params.listeProjets),
				);
				break;
		}
	}
	_construireProjets(aParam) {
		if (aParam) {
			if (aParam.count()) {
				return ObjetTraduction_1.GTraductions.getValeur(
					"BulletinEtReleve.Projets.Detail",
					[aParam.getTableauLibelles().join(", ")],
				);
			} else {
				return ObjetTraduction_1.GTraductions.getValeur(
					"BulletinEtReleve.Projets.Aucun",
				);
			}
		}
		return "";
	}
}
exports.PiedBulletin_Projets = PiedBulletin_Projets;
class PiedBulletin_Credits extends ObjetIdentite_1.Identite {
	constructor() {
		super(...arguments);
		this.params = {
			modeAffichage:
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Lineaire,
		};
	}
	setDonnees(aParam) {
		$.extend(true, this.params, aParam);
	}
	estAffiche() {
		return !!(this.params && this.params.listeCredits);
	}
	afficher(aParam) {
		$.extend(true, this.params, aParam);
		switch (aParam.modeAffichage) {
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Onglets:
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Lineaire:
				ObjetHtml_1.GHtml.setHtml(
					this.Nom,
					this._construireCredits(this.params.listeCredits),
				);
				break;
		}
	}
	_construireCredits(aListeCredits) {
		const H = [];
		const titres = [];
		const donnees = [];
		for (let i = 0; i < aListeCredits.count(); i++) {
			const elt = aListeCredits.get(i);
			titres.push('<td style="width:100px;">', elt.getLibelle(), "</td>");
			donnees.push(
				'<td style="border:solid 1px',
				GCouleur.bordure,
				';">',
				elt.credits,
				"</td>",
			);
		}
		H.push('<table style="border-collapse:collapse;">');
		H.push(
			'<tr style="text-align:center;border:solid 1px',
			GCouleur.bordure,
			";",
			ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.grisClair),
			'">',
		);
		H.push('<td style="width:100px;">&nbsp;</td>');
		H.push(titres.join(""));
		H.push("</tr>");
		H.push(
			'<tr style="text-align:center;border:solid 1px',
			GCouleur.bordure,
			';">',
		);
		H.push(
			'<td style="border:solid 1px',
			GCouleur.bordure,
			';">',
			ObjetTraduction_1.GTraductions.getValeur("PiedDeBulletin.Credits"),
			"</td>",
		);
		H.push(donnees.join(""));
		H.push("</tr>");
		H.push("</table>");
		return H.join("");
	}
}
exports.PiedBulletin_Credits = PiedBulletin_Credits;
class PiedBulletin_Engagements extends ObjetIdentite_1.Identite {
	constructor() {
		super(...arguments);
		this.params = {
			modeAffichage:
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Lineaire,
		};
	}
	setDonnees(aParam) {
		$.extend(true, this.params, aParam);
	}
	estAffiche() {
		return !!(this.params && this.params.listeEngagements);
	}
	afficher(aParam) {
		$.extend(true, this.params, aParam);
		ObjetHtml_1.GHtml.setHtml(
			this.Nom,
			this._construireEngagements(
				this.params.listeEngagements,
				aParam.modeAffichage,
			),
		);
	}
	_construireEngagements(aListeEngagements, aModeAffichage) {
		const H = [];
		let lLibelle = ObjetTraduction_1.GTraductions.getValeur(
			"PiedDeBulletin.AucunEngagement",
		);
		if (aListeEngagements.count()) {
			lLibelle = aListeEngagements.getTableauLibelles().join(", ");
		}
		switch (aModeAffichage) {
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Onglets:
				H.push(`<p class="m-all">${lLibelle}</p>`);
				break;
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Lineaire:
				H.push(
					`<h2 class="p-y ie-titre-petit theme_color_foncee Gras">${ObjetTraduction_1.GTraductions.getValeur("PiedDeBulletin.Engagements")} :</h2><p>${lLibelle}</p>`,
				);
				break;
		}
		return H.join("");
	}
}
exports.PiedBulletin_Engagements = PiedBulletin_Engagements;
