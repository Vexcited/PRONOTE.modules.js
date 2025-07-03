exports.WidgetEnseignementADistance = void 0;
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_DemiJours_1 = require("Enumere_DemiJours");
const UtilitaireVisiosSco_1 = require("UtilitaireVisiosSco");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetTri_1 = require("ObjetTri");
const ObjetWidget_1 = require("ObjetWidget");
class WidgetEnseignementADistance extends ObjetWidget_1.Widget.ObjetWidget {
	construire(aParams) {
		this.donnees = aParams.donnees;
		const lWidget = {
			getHtml: this.composeWidgetEnseignementADistance.bind(this),
			nbrElements: this.compterNombreLignesWidget(this.donnees),
			afficherMessage: false,
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	composeLigneEnseignement(aEnseignement) {
		const H = [];
		if (!!aEnseignement) {
			let lLibelleEnseignement;
			let lClassEnseignement;
			if (!aEnseignement.estALaMaison) {
				lLibelleEnseignement = ObjetTraduction_1.GTraductions.getValeur(
					"accueil.enseignementADistance.enEtablissement",
				);
				lClassEnseignement = "at-school";
			} else {
				lLibelleEnseignement = ObjetTraduction_1.GTraductions.getValeur(
					"accueil.enseignementADistance.aLaMaison",
				);
				lClassEnseignement = "at-home";
			}
			H.push("<li>", '<div class="wrap-as-column">');
			H.push(
				'<div class="wrap">',
				'<div class="date">',
				aEnseignement.libelleDate,
				"</div>",
				'<div class="infos-presence ',
				lClassEnseignement,
				'">',
				lLibelleEnseignement.toUpperCase(),
				"</div>",
				"</div>",
			);
			if (
				!!aEnseignement.listeLiensVisio &&
				aEnseignement.listeLiensVisio.count() > 0
			) {
				aEnseignement.listeLiensVisio
					.setTri([ObjetTri_1.ObjetTri.init("dateDebutCours")])
					.trier();
				H.push('<div class="liste-visios">');
				aEnseignement.listeLiensVisio.parcourir((aLienVisio) => {
					if (
						(aLienVisio.estMatin && !!aEnseignement.estEnseignementMatin) ||
						(!aLienVisio.estMatin && !!aEnseignement.estEnseignementAprem)
					) {
						H.push(this.composeLienVisio(aLienVisio));
					}
				});
				H.push("</div>");
			}
			H.push("</div>", "</li>");
		}
		return H.join("");
	}
	composeWidgetEnseignementADistance() {
		const H = [];
		H.push('<ul class="one-line">');
		if (this.donnees && this.donnees.jours && this.donnees.jours.count() > 0) {
			for (let lIdx = 0; lIdx < this.donnees.jours.count(); lIdx++) {
				const lJour = this.donnees.jours.get(lIdx);
				const lLibelleDate = ObjetDate_1.GDate.formatDate(
					lJour.date,
					"[" + "%JJJ %J %MMM" + "]",
				);
				let lEstALaMaison = false;
				if (lJour.jourEntier) {
					if (lJour.enEtablissement) {
						lEstALaMaison = false;
					} else if (lJour.aDistance) {
						lEstALaMaison = true;
					} else {
					}
					H.push(
						this.composeLigneEnseignement({
							libelleDate: lLibelleDate,
							estALaMaison: lEstALaMaison,
							listeLiensVisio: lJour.listeVisios,
							estEnseignementMatin: true,
							estEnseignementAprem: true,
						}),
					);
				} else {
					if (lJour.enEtablissement && lJour.aDistance) {
						if (
							lJour.setOfDJTravaille &&
							lJour.setOfDJTravaille.contains &&
							lJour.setOfDJTravaille.contains(
								Enumere_DemiJours_1.EGenreDemiJours.Matin,
							)
						) {
							lEstALaMaison = false;
						} else if (
							lJour.setOfDJADistance &&
							lJour.setOfDJADistance.contains &&
							lJour.setOfDJADistance.contains(
								Enumere_DemiJours_1.EGenreDemiJours.Matin,
							)
						) {
							lEstALaMaison = true;
						} else {
						}
						H.push(
							this.composeLigneEnseignement({
								libelleDate:
									lLibelleDate +
									" " +
									ObjetTraduction_1.GTraductions.getValeur(
										"accueil.enseignementADistance.matin",
									),
								estALaMaison: lEstALaMaison,
								listeLiensVisio: lJour.listeVisios,
								estEnseignementMatin: true,
							}),
						);
						if (
							lJour.setOfDJTravaille &&
							lJour.setOfDJTravaille.contains &&
							lJour.setOfDJTravaille.contains(
								Enumere_DemiJours_1.EGenreDemiJours.ApresMidi,
							)
						) {
							lEstALaMaison = false;
						} else if (
							lJour.setOfDJADistance &&
							lJour.setOfDJADistance.contains &&
							lJour.setOfDJADistance.contains(
								Enumere_DemiJours_1.EGenreDemiJours.ApresMidi,
							)
						) {
							lEstALaMaison = true;
						} else {
						}
						H.push(
							this.composeLigneEnseignement({
								libelleDate:
									lLibelleDate +
									" " +
									ObjetTraduction_1.GTraductions.getValeur(
										"accueil.enseignementADistance.aprem",
									),
								estALaMaison: lEstALaMaison,
								listeLiensVisio: lJour.listeVisios,
								estEnseignementAprem: true,
							}),
						);
					} else {
						if (lJour.enEtablissement) {
							lEstALaMaison = false;
						} else if (lJour.aDistance) {
							lEstALaMaison = true;
						} else {
						}
						const lEstCoursMatin =
							lJour.setOfDJCours &&
							lJour.setOfDJCours.contains &&
							lJour.setOfDJCours.contains(
								Enumere_DemiJours_1.EGenreDemiJours.Matin,
							);
						H.push(
							this.composeLigneEnseignement({
								libelleDate:
									lLibelleDate +
									" " +
									(lEstCoursMatin
										? ObjetTraduction_1.GTraductions.getValeur(
												"accueil.enseignementADistance.matin",
											)
										: ObjetTraduction_1.GTraductions.getValeur(
												"accueil.enseignementADistance.aprem",
											)),
								estALaMaison: lEstALaMaison,
								listeLiensVisio: lJour.listeVisios,
								estEnseignementMatin: lEstCoursMatin,
								estEnseignementAprem: !lEstCoursMatin,
							}),
						);
					}
				}
			}
		}
		H.push("</ul>");
		return H.join("");
	}
	compterNombreLignesWidget(aDonnees) {
		let lNbLignes = 0;
		if (aDonnees && aDonnees.jours) {
			aDonnees.jours.parcourir((aJourEnseignements) => {
				if (aJourEnseignements.jourEntier) {
					lNbLignes++;
				} else {
					if (
						aJourEnseignements.enEtablissement &&
						aJourEnseignements.aDistance
					) {
						lNbLignes++;
						lNbLignes++;
					} else {
						lNbLignes++;
					}
				}
			});
		}
		return lNbLignes;
	}
	composeLienVisio(aLienVisio) {
		const H = [];
		if (!!aLienVisio && !!aLienVisio.url) {
			let lLibelleLien;
			if (!!aLienVisio.libelleLien) {
				lLibelleLien = aLienVisio.libelleLien;
			}
			if (!lLibelleLien) {
				lLibelleLien = ObjetTraduction_1.GTraductions.getValeur(
					"FenetreSaisieVisiosCours.AccederAuCoursVirtuel",
				);
			}
			H.push(
				'<div class="lien-visio"',
				aLienVisio.commentaire ? ' title="' + aLienVisio.commentaire + '"' : "",
				">",
				'<div class="heure-matiere-conteneur">',
				'<span class="horaires">',
				ObjetTraduction_1.GTraductions.getValeur(
					"Dates.DeHeureDebutAHeureFin",
					[
						ObjetDate_1.GDate.formatDate(
							aLienVisio.dateDebutCours,
							"%xh%sh%mm",
						),
						ObjetDate_1.GDate.formatDate(aLienVisio.dateFinCours, "%xh%sh%mm"),
					],
				),
				"</span>",
				aLienVisio.matiere
					? '<span class="matiere">' +
							aLienVisio.matiere.getLibelle() +
							"</span>"
					: "",
				"</div>",
				'<a class="',
				UtilitaireVisiosSco_1.UtilitaireVisios.getNomIconePresenceVisios(),
				'" href="',
				ObjetChaine_1.GChaine.verifierURLHttp(aLienVisio.url),
				'" target="_blank">',
				lLibelleLien,
				"</a>",
				"</div>",
			);
		}
		return H.join("");
	}
}
exports.WidgetEnseignementADistance = WidgetEnseignementADistance;
