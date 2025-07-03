exports.ObjetFenetre_DocumentsEleve = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const DonneesListe_DocumentsEleve_1 = require("DonneesListe_DocumentsEleve");
const ObjetRequeteDocumentsEleve_1 = require("ObjetRequeteDocumentsEleve");
class ObjetFenetre_DocumentsEleve extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreDocumentsEleve.titre",
			),
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this.initialiserListe,
		);
	}
	setDonnees(aEleve) {
		new ObjetRequeteDocumentsEleve_1.ObjetRequeteDocumentsEleve(
			this,
			this._reponseRequeteDocumentsEleve,
		).lancerRequete(aEleve);
	}
	_reponseRequeteDocumentsEleve(aParams) {
		this.afficher();
		const lListeDonnees = aParams.listeDocumentsEleve;
		this.formatDonnees(lListeDonnees);
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_DocumentsEleve_1.DonneesListe_DocumentsEleve(
				lListeDonnees,
			),
		);
	}
	formatDonnees(aListe) {
		aListe.setTri([ObjetTri_1.ObjetTri.init("Genre")]);
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
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_DocumentsEleve_1.DonneesListe_DocumentsEleve.colonnes
				.document,
			taille: "250",
		});
		lColonnes.push({
			id: DonneesListe_DocumentsEleve_1.DonneesListe_DocumentsEleve.colonnes
				.date,
			taille: "80",
		});
		lColonnes.push({
			id: DonneesListe_DocumentsEleve_1.DonneesListe_DocumentsEleve.colonnes
				.nature,
			taille: "150",
		});
		lColonnes.push({
			id: DonneesListe_DocumentsEleve_1.DonneesListe_DocumentsEleve.colonnes
				.proprietaire,
			taille: "150",
		});
		aInstance.setOptionsListe({ colonnes: lColonnes });
	}
	composeContenu() {
		return IE.jsx.str("div", {
			id: this.getNomInstance(this.identListe),
			style: "height: 200px;",
		});
	}
}
exports.ObjetFenetre_DocumentsEleve = ObjetFenetre_DocumentsEleve;
