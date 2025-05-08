exports.ObjetFenetre_SelectionMateriel = void 0;
const DonneesListe_SelectionRessource_1 = require("DonneesListe_SelectionRessource");
const ObjetFenetre_SelectionRessource_1 = require("ObjetFenetre_SelectionRessource");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListe_1 = require("ObjetListe");
class ObjetFenetre_SelectionMateriel extends ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource {
	_creerObjetDonneesListe() {
		return new DonneesListe_SelectionMateriel(this.listeRessources);
	}
	_initialiserListe(aInstance) {
		const lOptions = {
			colonnes: [
				{ id: DonneesListe_SelectionMateriel.colonnes.coche, taille: 20 },
				{
					id: DonneesListe_SelectionMateriel.colonnes.libelle,
					taille: ObjetListe_1.ObjetListe.initColonne(100, 150),
					titre: ObjetTraduction_1.GTraductions.getValeur("Nom"),
				},
				{
					id: DonneesListe_SelectionMateriel.colonnes.nombre,
					taille: 40,
					titre: ObjetTraduction_1.GTraductions.getValeur("Nb"),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.HintMaterielNbAReserver",
					),
				},
				{
					id: DonneesListe_SelectionMateriel.colonnes.informations,
					taille: 100,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.titre.Infos",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.titreHint.InformationsHint",
					),
				},
			],
		};
		if (this._options.optionsListe) {
			$.extend(lOptions, this._options.optionsListe);
		}
		aInstance.setOptionsListe(lOptions);
	}
	construireListeRessource(aListeRessources, aListeRessourcesSelectionnees) {
		super.construireListeRessource(
			aListeRessources,
			aListeRessourcesSelectionnees,
		);
		const lListeRessources = this.listeRessources;
		if (
			aListeRessourcesSelectionnees &&
			aListeRessourcesSelectionnees.count() > 0
		) {
			aListeRessourcesSelectionnees.parcourir((aElement) => {
				const lElementTrouve = lListeRessources.getElementParElement(aElement);
				if (lElementTrouve && aElement.nombre) {
					lElementTrouve.nombre = aElement.nombre;
				}
			});
		}
	}
}
exports.ObjetFenetre_SelectionMateriel = ObjetFenetre_SelectionMateriel;
class DonneesListe_SelectionMateriel extends DonneesListe_SelectionRessource_1.DonneesListe_SelectionRessource {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ editionApresSelection: false });
	}
	avecEdition(aParams) {
		if (!aParams.article.nonEditable) {
			switch (aParams.idColonne) {
				case DonneesListe_SelectionMateriel.colonnes.coche:
					return true;
				case DonneesListe_SelectionMateriel.colonnes.nombre:
					return aParams.article.occurrences > 1;
			}
		}
		return false;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SelectionMateriel.colonnes.nombre: {
				const lNombre = aParams.article.nombre ? aParams.article.nombre : 1;
				return aParams.surEdition
					? lNombre
					: lNombre + "/" + aParams.article.occurrences;
			}
			case DonneesListe_SelectionMateriel.colonnes.informations:
				return aParams.article.infos || "";
		}
		return super.getValeur(aParams);
	}
	getClass(aParams) {
		const lClasses = [super.getClass(aParams)];
		if (aParams.idColonne === DonneesListe_SelectionMateriel.colonnes.nombre) {
			lClasses.push("AlignementDroit");
		}
		return lClasses.join(" ");
	}
	getControleCaracteresInput(aParams) {
		if (aParams.idColonne === DonneesListe_SelectionMateriel.colonnes.nombre) {
			return {
				mask: /^0-9/i,
				tailleMax: aParams.article.occurrences.toString().length,
			};
		}
		return null;
	}
	surEdition(aParams, V) {
		if (aParams.idColonne === DonneesListe_SelectionMateriel.colonnes.nombre) {
			const lValeur = parseInt(V, 10);
			if (lValeur < 1 || lValeur > aParams.article.occurrences) {
				return ObjetTraduction_1.GTraductions.getValeur("ErreurMinMaxEntier", [
					1,
					aParams.article.occurrences,
				]);
			}
			aParams.article.nombre = lValeur;
			return;
		}
		return super.surEdition(aParams, V);
	}
	getMessageEditionImpossible(aParams, aErreur) {
		if (aErreur) {
			return aErreur;
		}
		return super.getMessageEditionImpossible(aParams, aErreur);
	}
}
DonneesListe_SelectionMateriel.colonnes = {
	coche: "DL_SelectMat_coche",
	libelle: "DL_SelectMat_lib",
	nombre: "DL_SelectMat_nb",
	informations: "DL_SelectMat_infos",
};
