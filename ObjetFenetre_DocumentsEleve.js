const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const {
	DonneesListe_DocumentsEleve,
} = require("DonneesListe_DocumentsEleve.js");
const { ObjetRequeteDocumentsEleve } = require("ObjetRequeteDocumentsEleve.js");
class ObjetFenetre_DocumentsEleve extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: GTraductions.getValeur("FenetreDocumentsEleve.titre"),
			listeBoutons: [GTraductions.getValeur("Fermer")],
		});
	}
	construireInstances() {
		this.identListe = this.add(ObjetListe, null, this.initialiserListe);
	}
	setDonnees(aEleve) {
		new ObjetRequeteDocumentsEleve(
			this,
			this._reponseRequeteDocumentsEleve,
		).lancerRequete({ eleve: aEleve });
	}
	_reponseRequeteDocumentsEleve(aParams) {
		this.afficher();
		const lListeDonnees = aParams.listeDocumentsEleve;
		this.formatDonnees(lListeDonnees);
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_DocumentsEleve(lListeDonnees),
		);
	}
	formatDonnees(aListe) {
		aListe.setTri([ObjetTri.init("Genre")]);
		aListe.trier();
		aListe.parcourir((aElement, aIndex, aListeElementsCourant) => {
			if (!aElement.estPere) {
				const lRangPere = aElement.rangPere;
				const lIndicePere = aListeElementsCourant.getIndiceElementParFiltre(
					(aElement) => {
						return aElement.Genre === lRangPere;
					},
				);
				const lPere = aListeElementsCourant.get(lIndicePere);
				if (!lPere.nbrFils) {
					lPere.nbrFils = 1;
				} else {
					lPere.nbrFils++;
				}
				aElement.pere = lPere;
			} else {
				aElement.estUnDeploiement = true;
				aElement.estDeploye = true;
			}
		});
	}
	initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			colonnes: [
				{ id: DonneesListe_DocumentsEleve.colonnes.document, taille: "250" },
				{ id: DonneesListe_DocumentsEleve.colonnes.date, taille: "80" },
				{ id: DonneesListe_DocumentsEleve.colonnes.nature, taille: "150" },
				{
					id: DonneesListe_DocumentsEleve.colonnes.proprietaire,
					taille: "150",
				},
			],
		});
	}
	composeContenu() {
		return `<div id="${this.getNomInstance(this.identListe)}" style="height: 200px;"></div>`;
	}
}
module.exports = { ObjetFenetre_DocumentsEleve };
