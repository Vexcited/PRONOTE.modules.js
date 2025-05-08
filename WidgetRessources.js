exports.WidgetRessources = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_PossessionRessource_1 = require("Enumere_PossessionRessource");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
class WidgetRessources extends ObjetWidget_1.Widget.ObjetWidget {
	construire(aParams) {
		this.donnees = aParams.donnees;
		const lWidget = {
			html: this.composeWidgetRessources(),
			nbrElements: null,
			afficherMessage: false,
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			nodeRessource(aGenrePossessionRessource, aIndex) {
				$(this.node).eventValidation((e) => {
					aInstance._surRessources(aGenrePossessionRessource, aIndex);
				});
			},
		});
	}
	composeWidgetRessources() {
		if (!this.donnees.listeMatieres) {
			return "";
		}
		this.donnees.listeMatieres.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
		this.donnees.listeMatieres.trier();
		const H = [];
		H.push('<ul class="liste-ressources">');
		for (let j = 0; j < this.donnees.listeMatieres.count(); j++) {
			const lMatiere = this.donnees.listeMatieres.get(j);
			const lNbRessourcesMesQCM =
				lMatiere.nbrRessources[
					Enumere_PossessionRessource_1.EGenrePossessionRessource.mesQCM
				];
			const lNbRessourcesQCMEtablissement =
				lMatiere.nbrRessources[
					Enumere_PossessionRessource_1.EGenrePossessionRessource.etabQCM
				];
			const lNbRessourcesQCMNathan =
				lMatiere.nbrRessources[
					Enumere_PossessionRessource_1.EGenrePossessionRessource.nathanQCM
				];
			if (
				lNbRessourcesMesQCM > 0 ||
				lNbRessourcesQCMEtablissement + lNbRessourcesQCMNathan > 0 ||
				(lMatiere.nbrRessources[
					Enumere_PossessionRessource_1.EGenrePossessionRessource.mesProg
				] > 0 &&
					GEtatUtilisateur.existeGenreOnglet(
						Enumere_Onglet_1.EGenreOnglet.CahierDeTexte_Progression,
					)) ||
				(lMatiere.nbrRessources[
					Enumere_PossessionRessource_1.EGenrePossessionRessource.etabProg
				] > 0 &&
					GEtatUtilisateur.existeGenreOnglet(
						Enumere_Onglet_1.EGenreOnglet.BibliothequeProgression,
					)) ||
				(GEtatUtilisateur.existeGenreOnglet(
					Enumere_Onglet_1.EGenreOnglet.ProgrammesBO,
				) &&
					lMatiere.nbrRessources[
						Enumere_PossessionRessource_1.EGenrePossessionRessource.BOProg
					] > 0)
			) {
				H.push("<li>", "<h3>", lMatiere.getLibelle(), "</h3>");
				if (
					lNbRessourcesMesQCM > 0 ||
					lNbRessourcesQCMEtablissement + lNbRessourcesQCMNathan > 0
				) {
					H.push(
						'<div class="row-contain">',
						"<h4>",
						ObjetTraduction_1.GTraductions.getValeur("accueil.ressources.QCM"),
						"</h4>",
					);
					H.push(
						'<div class="item-contain data-icon',
						lNbRessourcesMesQCM > 0 ? " AvecMain" : "",
						'" title="',
						ObjetTraduction_1.GTraductions.getValeur(
							"accueil.ressources.hint.MesQCM",
						),
						'"',
					);
					if (lNbRessourcesMesQCM > 0) {
						H.push(
							'tabindex="0" ie-node="nodeRessource(',
							Enumere_PossessionRessource_1.EGenrePossessionRessource.mesQCM,
							", ",
							j,
							')">',
							"<span>",
							lNbRessourcesMesQCM,
							"</span>",
						);
					} else {
						H.push("><span>0</span>");
					}
					H.push(
						IE.jsx.str(
							"span",
							{ class: "sr-only" },
							"&nbsp",
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.hint.MesQCM",
							),
						),
					);
					H.push("</div>");
					H.push(
						'<div class="item-contain library-icon ',
						lNbRessourcesQCMEtablissement + lNbRessourcesQCMNathan > 0
							? " AvecMain"
							: "",
						'" title="',
						ObjetTraduction_1.GTraductions.getValeur(
							"accueil.ressources.hint.QCMPartages",
						),
						'"',
					);
					if (lNbRessourcesQCMEtablissement + lNbRessourcesQCMNathan > 0) {
						H.push(
							' tabindex="0" ie-node="nodeRessource(',
							Enumere_PossessionRessource_1.EGenrePossessionRessource.etabQCM >
								0
								? Enumere_PossessionRessource_1.EGenrePossessionRessource
										.etabQCM
								: Enumere_PossessionRessource_1.EGenrePossessionRessource
										.nathanQCM,
							", ",
							j,
							')">',
							"<span>",
							lNbRessourcesQCMEtablissement + lNbRessourcesQCMNathan,
							"</span>",
						);
					} else {
						H.push("><span>0</span>");
					}
					H.push(
						IE.jsx.str(
							"span",
							{ class: "sr-only" },
							"&nbsp",
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.hint.QCMPartages",
							),
						),
					);
					H.push("</div>");
					H.push("</div>");
				}
				if (
					(lMatiere.nbrRessources[
						Enumere_PossessionRessource_1.EGenrePossessionRessource.mesProg
					] > 0 &&
						GEtatUtilisateur.existeGenreOnglet(
							Enumere_Onglet_1.EGenreOnglet.CahierDeTexte_Progression,
						)) ||
					(lMatiere.nbrRessources[
						Enumere_PossessionRessource_1.EGenrePossessionRessource.etabProg
					] > 0 &&
						GEtatUtilisateur.existeGenreOnglet(
							Enumere_Onglet_1.EGenreOnglet.BibliothequeProgression,
						))
				) {
					H.push(
						'<div class="row-contain">',
						"<h4>",
						ObjetTraduction_1.GTraductions.getValeur(
							"accueil.ressources.Progressions",
						),
						"</h4>",
					);
					H.push(
						'<div class="item-contain data-icon',
						lMatiere.nbrRessources[
							Enumere_PossessionRessource_1.EGenrePossessionRessource.mesProg
						] > 0
							? " AvecMain"
							: "",
						'" title="',
						ObjetTraduction_1.GTraductions.getValeur(
							"accueil.ressources.hint.MesProgressions",
						),
						'"',
					);
					if (
						lMatiere.nbrRessources[
							Enumere_PossessionRessource_1.EGenrePossessionRessource.mesProg
						] > 0 &&
						GEtatUtilisateur.existeGenreOnglet(
							Enumere_Onglet_1.EGenreOnglet.CahierDeTexte_Progression,
						)
					) {
						H.push(
							' tabindex="0" ie-node="nodeRessource(',
							Enumere_PossessionRessource_1.EGenrePossessionRessource.mesProg,
							", ",
							j,
							')"><span>',
							lMatiere.nbrRessources[
								Enumere_PossessionRessource_1.EGenrePossessionRessource.mesProg
							],
							"</span>",
						);
					} else {
						H.push("><span>0</span>");
					}
					H.push(
						IE.jsx.str(
							"span",
							{ class: "sr-only" },
							"&nbsp",
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.hint.MesProgressions",
							),
						),
					);
					H.push("</div>");
					H.push(
						'<div class="item-contain library-icon',
						lMatiere.nbrRessources[
							Enumere_PossessionRessource_1.EGenrePossessionRessource.etabProg
						] > 0
							? " AvecMain"
							: "",
						'" title="',
						ObjetTraduction_1.GTraductions.getValeur(
							"accueil.ressources.hint.QCMPartages",
						),
						'"',
					);
					if (
						lMatiere.nbrRessources[
							Enumere_PossessionRessource_1.EGenrePossessionRessource.etabProg
						] > 0 &&
						GEtatUtilisateur.existeGenreOnglet(
							Enumere_Onglet_1.EGenreOnglet.BibliothequeProgression,
						)
					) {
						H.push(
							' tabindex="0" ie-node="nodeRessource(',
							Enumere_PossessionRessource_1.EGenrePossessionRessource.etabProg,
							", ",
							j,
							')"><span>',
							lMatiere.nbrRessources[
								Enumere_PossessionRessource_1.EGenrePossessionRessource.etabProg
							],
							"</span>",
						);
					} else {
						H.push("><span>0</span>");
					}
					H.push(
						IE.jsx.str(
							"span",
							{ class: "sr-only" },
							"&nbsp",
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.hint.QCMPartages",
							),
						),
					);
					H.push("</div>");
					H.push("</div>");
				}
				if (
					GEtatUtilisateur.existeGenreOnglet(
						Enumere_Onglet_1.EGenreOnglet.ProgrammesBO,
					) &&
					lMatiere.nbrRessources[
						Enumere_PossessionRessource_1.EGenrePossessionRessource.BOProg
					] > 0
				) {
					H.push(
						'<div class="row-contain">',
						"<h4>",
						ObjetTraduction_1.GTraductions.getValeur(
							"accueil.ressources.ProgrammesBO",
						),
						"</h4>",
						'<div class="item-contain pgm-bo AvecMain" title="',
						ObjetTraduction_1.GTraductions.getValeur(
							"accueil.ressources.hint.ProgrammesBO",
						),
						'" tabindex="0" ie-node="nodeRessource(',
						Enumere_PossessionRessource_1.EGenrePossessionRessource.BOProg,
						", ",
						j,
						')"><span>',
						lMatiere.nbrRessources[
							Enumere_PossessionRessource_1.EGenrePossessionRessource.BOProg
						],
						"</span>",
						'<span class="sr-only">&nbsp',
						ObjetTraduction_1.GTraductions.getValeur(
							"accueil.ressources.hint.ProgrammesBO",
						),
						"</span>",
						"</div>",
						"</div>",
					);
				}
				H.push("</li>");
			}
		}
		H.push("</ul>");
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "legende" },
					IE.jsx.str(
						"span",
						{
							class: "data-icon",
							title: ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.MesDonnees",
							),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"accueil.ressources.MesDonnees",
						),
					),
					IE.jsx.str(
						"span",
						{
							class: "library-icon",
							title: ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.DonneesBibliotheque",
							),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"accueil.ressources.DonneesBibliotheque",
						),
					),
				),
			),
		);
		return H.join("");
	}
	_surRessources(aGenre, j) {
		const lOnglet = this.getOnglet(aGenre);
		const lPage = { Onglet: lOnglet, indiceCumul: 0, matiere: null };
		if (lOnglet === Enumere_Onglet_1.EGenreOnglet.ProgrammesBO) {
			lPage.indiceCumul = 1;
			lPage.matiere = this.donnees.listeMatieres.get(j);
		}
		this.callback.appel(
			this.donnees.genre,
			Enumere_EvenementWidget_1.EGenreEvenementWidget.NavigationVersPage,
			lPage,
		);
	}
	getOnglet(aGenre) {
		return [
			Enumere_Onglet_1.EGenreOnglet.QCM_Saisie,
			Enumere_Onglet_1.EGenreOnglet.QCM_Bibliotheque,
			Enumere_Onglet_1.EGenreOnglet.QCM_BibliothequeNathan,
			Enumere_Onglet_1.EGenreOnglet.CahierDeTexte_Progression,
			Enumere_Onglet_1.EGenreOnglet.BibliothequeProgression,
			Enumere_Onglet_1.EGenreOnglet.ProgrammesBO,
		][aGenre];
	}
}
exports.WidgetRessources = WidgetRessources;
