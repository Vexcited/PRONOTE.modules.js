exports.DonneesListe_ElevesGAEV = void 0;
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetChaine_1 = require("ObjetChaine");
const TypeAbsencePartieGAEV_1 = require("TypeAbsencePartieGAEV");
class DonneesListe_ElevesGAEV extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aFiltres, aTriCourant) {
		super(aDonnees);
		this.setOptions({
			avecSuppression: false,
			avecEvnt_ApresEdition: true,
			avecEtatSaisie: false,
			avecTri: false,
		});
		this.filtres = aFiltres;
		this.maTriDonnees = aTriCourant;
	}
	getEtatSurEdition() {
		return Enumere_Etat_1.EGenreEtat.Aucun;
	}
	avecEdition(aParams) {
		if (aParams.idColonne === DonneesListe_ElevesGAEV.colonnes.coche) {
			return !!aParams.article && !aParams.article.estFixe;
		}
		return false;
	}
	avecDeploiement() {
		return this.maTriDonnees === 1;
	}
	avecDeploiementSurColonne(aParams) {
		return aParams.idColonne === DonneesListe_ElevesGAEV.colonnes.nom;
	}
	avecImageSurColonneDeploiement(aParams) {
		return aParams.idColonne === DonneesListe_ElevesGAEV.colonnes.nom;
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ElevesGAEV.colonnes.coche:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
			case DonneesListe_ElevesGAEV.colonnes.diagnostic:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ElevesGAEV.colonnes.coche:
				if (aParams.article.estUneClasse) {
					return aParams.article.estTotalementDesGroupes;
				} else {
					if (aParams.article.estTotalementDesGroupes) {
						return ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Verte;
					} else if (aParams.article.estPartiellementDesGroupes) {
						return ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Grise;
					}
				}
				return false;
			case DonneesListe_ElevesGAEV.colonnes.nom:
				return aParams.article.getLibelle();
			case DonneesListe_ElevesGAEV.colonnes.diagnostic: {
				const H = [];
				H.push(
					'<div style="display:flex; align-items: center; flex-wrap:wrap;">',
				);
				if (aParams.article.messageOccupe) {
					H.push(
						'<div class="Image_DiagAffEleTGris Gras" title="',
						aParams.article.messageOccupe,
						'" style="flex: 2 1 auto;">&nbsp;</div>',
					);
				}
				if (aParams.article.diagsAbs) {
					aParams.article.diagsAbs.parcourir((aDiag) => {
						H.push(
							'<div class="',
							TypeAbsencePartieGAEV_1.TypeAbsencePartieGAEVUtil.getImageAbsent(
								aDiag.genre,
							),
							'" title="',
							ObjetChaine_1.GChaine.toTitle(aDiag.message),
							'" style="flex:none; padding-top: 3px; margin-right: 1px; text-align: center;">',
							TypeAbsencePartieGAEV_1.TypeAbsencePartieGAEVUtil.getLettreAbsent(
								aDiag.genre,
							),
							"</div>",
						);
					});
				}
				H.push("</div>");
				return H.join("");
			}
			case DonneesListe_ElevesGAEV.colonnes.classe:
				return aParams.article.estUneClasse ? "" : aParams.article.classe;
			case DonneesListe_ElevesGAEV.colonnes.options:
				return aParams.article.options || "";
		}
	}
	getColonneDeFusion(aParams) {
		if (
			aParams.article.estUneClasse &&
			aParams.idColonne !== DonneesListe_ElevesGAEV.colonnes.coche
		) {
			return DonneesListe_ElevesGAEV.colonnes.nom;
		}
	}
	avecContenuTronque(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ElevesGAEV.colonnes.nom:
			case DonneesListe_ElevesGAEV.colonnes.classe:
			case DonneesListe_ElevesGAEV.colonnes.options:
				return true;
		}
		return false;
	}
	getVisible(D) {
		return (
			(D.visible &&
				(this.filtres.dansLeGroupe ||
					!(D.estTotalementDesGroupes || D.estPartiellementDesGroupes)) &&
				(this.filtres.dansAutreGroupe || !D.estOccupe) &&
				(this.filtres.aucunGroupe || !D.estLibre) &&
				(!this.filtres.presents || !D.estAbsent)) ||
			!!D.modifEnCours
		);
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_ElevesGAEV.colonnes.coche:
				if (
					aParams.article.estPartiellementDesGroupes &&
					!aParams.article.estTotalementDesGroupes
				) {
					aParams.article.estTotalementDesGroupes = true;
				} else {
					aParams.article.estTotalementDesGroupes = V;
				}
				aParams.article.estPartiellementDesGroupes = false;
				aParams.article.modifEnCours = true;
				if (this.maTriDonnees === 1) {
					if (aParams.article.pere) {
						const lNbrEleves = this.getNbrEleves(aParams.article.pere);
						aParams.article.pere.estTotalementDesGroupes =
							lNbrEleves[1] > 0
								? lNbrEleves[1] === lNbrEleves[0]
									? ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Verte
									: ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Grise
								: ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Aucune;
					} else {
						this.changerActifsEleves(aParams.article);
					}
				}
				break;
		}
	}
	getNbrEleves(aClasse) {
		const N = [0, 0];
		for (let I = 0, lNbr = this.Donnees.count(); I < lNbr; I++) {
			const lEleve = this.Donnees.get(I);
			if (lEleve.pere && lEleve.classe === aClasse.getLibelle()) {
				N[0]++;
				if (
					lEleve.estTotalementDesGroupes ||
					lEleve.estPartiellementDesGroupes
				) {
					N[1]++;
				}
			}
		}
		return N;
	}
	changerActifsEleves(aClasse) {
		for (let I = 0, lNbr = this.Donnees.count(); I < lNbr; I++) {
			const lEleve = this.Donnees.get(I);
			if (
				lEleve.pere &&
				lEleve.classe === aClasse.getLibelle() &&
				!lEleve.estFixe
			) {
				if (
					lEleve.estTotalementDesGroupes !== aClasse.estTotalementDesGroupes
				) {
					lEleve.estTotalementDesGroupes = aClasse.estTotalementDesGroupes;
					lEleve.estPartiellementDesGroupes = false;
				}
			}
		}
	}
}
exports.DonneesListe_ElevesGAEV = DonneesListe_ElevesGAEV;
DonneesListe_ElevesGAEV.colonnes = {
	coche: "DLElevesGAEV_coche",
	nom: "DLElevesGAEV_nom",
	diagnostic: "DLElevesGAEV_diagn",
	classe: "DLElevesGAEV_classe",
	options: "DLElevesGAEV_options",
};
