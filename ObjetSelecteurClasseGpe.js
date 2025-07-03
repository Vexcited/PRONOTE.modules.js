exports.ObjetSelecteurClasseGpe = void 0;
const _ObjetSelecteur_1 = require("_ObjetSelecteur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetFenetre_SelectionClasseGroupe_1 = require("ObjetFenetre_SelectionClasseGroupe");
class ObjetSelecteurClasseGpe extends _ObjetSelecteur_1._ObjetSelecteur {
	constructor(...aParams) {
		super(...aParams);
		this.setOptions({
			tooltip: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreSelectionClasseGroupe.titre",
			),
			avecSelectionObligatoire: false,
		});
	}
	construireInstanceFenetreSelection() {
		this.identFenetreSelection = this.addFenetre(
			ObjetFenetre_SelectionClasseGroupe_1.ObjetFenetre_SelectionClasseGroupe,
			this.evntFenetreSelection,
		);
	}
	construitChaineLibelleNbSelections() {
		const H = [];
		const lNombresRessource = this._getNbClassesEtGroupesDuPublic(
			this.listeSelection,
			this.listeTotale,
		);
		const lLibelleClassesToutes = this.param
			? this.param.libelleClassesToutes
			: "";
		const lLibelleClassesParam = this.param ? this.param.libelleClasses : "";
		const lLibelleGroupesTous = this.param
			? this.param.libelleGroupesToutes
			: "";
		const lLibelleGroupesParam = this.param ? this.param.libelleGroupes : "";
		let lDetail;
		if (lNombresRessource.nbClasses >= 0) {
			if (
				lNombresRessource.nbClasses === lNombresRessource.nbTotalClasses &&
				lLibelleClassesToutes
			) {
				H.push(lLibelleClassesToutes);
			} else {
				const lLibelleClasses = lLibelleClassesParam
					? lLibelleClassesParam
					: ObjetTraduction_1.GTraductions.getValeur("Classes");
				lDetail =
					lNombresRessource.nbClasses === lNombresRessource.nbTotalClasses
						? ObjetTraduction_1.GTraductions.getValeur("toutes")
						: lNombresRessource.nbClasses +
							"/" +
							lNombresRessource.nbTotalClasses;
				H.push(lLibelleClasses + " (" + lDetail + ")");
			}
		}
		if (lNombresRessource.nbGroupes > 0) {
			if (
				lNombresRessource.nbGroupes === lNombresRessource.nbTotalGroupes &&
				lLibelleGroupesTous
			) {
				H.push(lLibelleGroupesTous);
			} else {
				const lLibelleGroupes = lLibelleGroupesParam
					? lLibelleGroupesParam
					: ObjetTraduction_1.GTraductions.getValeur("Groupes");
				lDetail =
					lNombresRessource.nbGroupes === lNombresRessource.nbTotalGroupes
						? ObjetTraduction_1.GTraductions.getValeur("tous")
						: lNombresRessource.nbGroupes +
							"/" +
							lNombresRessource.nbTotalGroupes;
				H.push(lLibelleGroupes + " (" + lDetail + ")");
			}
		}
		return ObjetChaine_1.GChaine.insecable(H.join(" "));
	}
	evntBtnSelection() {
		const lInstance = this.getInstance(this.identFenetreSelection);
		lInstance.setSelectionObligatoire(this._options.avecSelectionObligatoire);
		lInstance.setAvecCumul(true);
		lInstance.setDonnees({
			listeRessources: this.listeTotale,
			listeRessourcesSelectionnees: MethodesObjet_1.MethodesObjet.dupliquer(
				this.listeSelection,
			),
			titre: this.param.titre,
		});
	}
	_getNbClassesEtGroupesDuPublic(
		aListeClassesGroupesSelection,
		aListeClassesGroupes,
	) {
		const lResult = {
			nbClasses: 0,
			nbGroupes: 0,
			nbTotalClasses: 0,
			nbTotalGroupes: 0,
		};
		if (aListeClassesGroupesSelection) {
			for (
				let i = 0, lNbr = aListeClassesGroupesSelection.count();
				i < lNbr;
				i++
			) {
				if (
					aListeClassesGroupesSelection.get(i).getGenre() ===
					Enumere_Ressource_1.EGenreRessource.Groupe
				) {
					lResult.nbGroupes++;
				} else {
					lResult.nbClasses++;
				}
			}
		}
		if (aListeClassesGroupes) {
			for (let i = 0, lNbr = aListeClassesGroupes.count(); i < lNbr; i++) {
				if (
					aListeClassesGroupes.get(i).getGenre() ===
					Enumere_Ressource_1.EGenreRessource.Groupe
				) {
					lResult.nbTotalGroupes++;
				} else {
					lResult.nbTotalClasses++;
				}
			}
		}
		return lResult;
	}
}
exports.ObjetSelecteurClasseGpe = ObjetSelecteurClasseGpe;
