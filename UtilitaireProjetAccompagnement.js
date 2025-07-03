exports.UtilitaireProjetAccompagnement = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireProjetAccompagnement = {
	composeProjetAccompagnement(aProjetAccompagnement, aParams) {
		const H = [];
		H.push(
			`<div class="flex-contain flex-start">\n              <div class="libelle-contain no-wrap">\n              <span class="libelle has-text iconic icon_projet_accompagnement ${aProjetAccompagnement.estPAMedical ? `  mix-icon_rond i-green` : ``}">${aProjetAccompagnement.getLibelle()} ${aProjetAccompagnement.motifs && aProjetAccompagnement.motifs.length > 0 ? `(${aProjetAccompagnement.motifs})` : ""}</span>`,
		);
		if (!!aProjetAccompagnement.dateDebut || !!aProjetAccompagnement.dateFin) {
			let lLibelleDate;
			if (
				!!aProjetAccompagnement.dateDebut &&
				!!aProjetAccompagnement.dateFin
			) {
				lLibelleDate =
					ObjetTraduction_1.GTraductions.getValeur("Du") +
					" " +
					aProjetAccompagnement.dateDebut +
					" " +
					ObjetTraduction_1.GTraductions.getValeur("Au") +
					" " +
					aProjetAccompagnement.dateFin;
			} else {
				lLibelleDate = !!aProjetAccompagnement.dateDebut
					? ObjetTraduction_1.GTraductions.getValeur("aPartirDu") +
						" " +
						aProjetAccompagnement.dateDebut
					: ObjetTraduction_1.GTraductions.getValeur("jusquAu") +
						" " +
						aProjetAccompagnement.dateFin;
			}
			H.push(`<span class="dates">${lLibelleDate}</span>`);
		}
		if (
			aProjetAccompagnement.commentaire &&
			aProjetAccompagnement.commentaire.length > 0
		) {
			H.push(
				`<span class="commentaires">${aProjetAccompagnement.commentaire}</span>`,
			);
		}
		if (
			aProjetAccompagnement.estCompatibleAmenagements &&
			aProjetAccompagnement.details.count()
		) {
			const lNbrDetails = aProjetAccompagnement.details
				.getListeElements((aElement) => {
					return !aElement.estPere;
				})
				.count();
			H.push(
				`<span class="m-top"><ie-bouton class="small-bt" ie-model="afficherFenetreDetailsPIEleve('${aProjetAccompagnement.getNumero()}')">${lNbrDetails} ${aProjetAccompagnement.estAvecActions ? ObjetTraduction_1.GTraductions.getValeur("FicheEleve.actions").toLowerCase() : ObjetTraduction_1.GTraductions.getValeur("FicheEleve.amenagements").toLowerCase()}</ie-bouton></span>`,
			);
		}
		H.push(`</div>`);
		if (aParams.avecEdition) {
			H.push(
				`<ie-btnicon class="icon icon_edit avecFond" role="button" title="${ObjetTraduction_1.GTraductions.getValeur("Modifier")}" ie-model="btnEditProjetAccompagnement('${aProjetAccompagnement.getNumero()}')"></ie-btnicon>`,
			);
		}
		H.push(`</div>`);
		if (
			aProjetAccompagnement.documents &&
			aProjetAccompagnement.documents.count() > 0
		) {
			const lListeDocJoints = [];
			aProjetAccompagnement.documents.parcourir((D) => {
				const lLienDocJoint = ObjetChaine_1.GChaine.composerUrlLienExterne({
					documentJoint: D,
				});
				lListeDocJoints.push(lLienDocJoint);
			});
			H.push(`<div class="pj-contain">${lListeDocJoints.join("")}</div>`);
		}
		if (aParams.avecLibelleConsultationEquipePeda) {
			H.push(
				'<div class="m-top">',
				aProjetAccompagnement.consultableEquipePeda
					? ObjetTraduction_1.GTraductions.getValeur(
							"PageCompte.ProjetConsultable",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"PageCompte.ProjetNonConsultable",
						),
				"</div>",
			);
		}
		return H.join("");
	},
	composeListeProjetsAccompagnement(
		aListeProjets,
		aParams = {
			avecEdition: false,
			avecLibelleConsultationEquipePeda: false,
			avecControlePublication: false,
		},
	) {
		const lHtml = [];
		if (!!aListeProjets && aListeProjets.count() > 0) {
			const lParamsComposeProjAcc = {
				avecEdition: aParams.avecEdition,
				avecLibelleConsultationEquipePeda:
					aParams.avecLibelleConsultationEquipePeda,
			};
			let lAvecControlePublication = true;
			if (aParams.avecEdition) {
				lAvecControlePublication = false;
			} else if (aParams.avecControlePublication === false) {
				lAvecControlePublication = false;
			}
			aListeProjets.parcourir((aProjetAcc) => {
				if (aProjetAcc.existe()) {
					if (!lAvecControlePublication || aProjetAcc.consultableEquipePeda) {
						lHtml.push(
							`<div class="projet-item">${UtilitaireProjetAccompagnement.composeProjetAccompagnement(aProjetAcc, lParamsComposeProjAcc)}</div>`,
						);
					}
				}
			});
		} else {
			lHtml.push(
				ObjetTraduction_1.GTraductions.getValeur("FicheEleve.aucunProjet"),
			);
		}
		return lHtml.join("");
	},
};
exports.UtilitaireProjetAccompagnement = UtilitaireProjetAccompagnement;
