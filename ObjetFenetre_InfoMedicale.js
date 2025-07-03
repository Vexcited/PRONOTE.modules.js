exports.ObjetFenetre_InfoMedicale = void 0;
const DonneesListe_InfoMedicale_1 = require("DonneesListe_InfoMedicale");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetElement_1 = require("ObjetElement");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetTri_1 = require("ObjetTri");
class ObjetFenetre_InfoMedicale extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		this.IdentListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListe.bind(this),
			this._initialiserListe.bind(this),
		);
	}
	_formaterDonneesListeAllergies(aListeAllergies) {
		if (aListeAllergies) {
			const lListeAvecCumul = new ObjetListeElements_1.ObjetListeElements();
			const lElementTitreAlimentaire = ObjetElement_1.ObjetElement.create({
				Libelle: ObjetTraduction_1.GTraductions.getValeur(
					"InfosMedicales.TitreAllergiesAlimentaires",
				),
				estUnDeploiement: true,
				estDeploye: false,
				estAlimentaire: true,
			});
			lElementTitreAlimentaire.estUnDeploiement = true;
			lElementTitreAlimentaire.estDeploye = false;
			lElementTitreAlimentaire.estAlimentaire = true;
			lListeAvecCumul.addElement(lElementTitreAlimentaire);
			aListeAllergies.parcourir((aAllergie) => {
				if (aAllergie.estAlimentaire) {
					aAllergie.pere = lElementTitreAlimentaire;
					aAllergie.estUnDeploiement = false;
					aAllergie.estDeploye = false;
					lListeAvecCumul.addElement(aAllergie);
				}
			});
			const lElementTitreAutres = ObjetElement_1.ObjetElement.create({
				Libelle: ObjetTraduction_1.GTraductions.getValeur(
					"InfosMedicales.TitreAllergiesAutres",
				),
				estUnDeploiement: true,
				estDeploye: false,
				estAlimentaire: false,
			});
			lListeAvecCumul.addElement(lElementTitreAutres);
			aListeAllergies.parcourir((aAllergie) => {
				if (!aAllergie.estAlimentaire) {
					aAllergie.pere = lElementTitreAutres;
					aAllergie.estDeploye = false;
					aAllergie.estUnDeploiement = false;
					lListeAvecCumul.addElement(aAllergie);
				}
			});
			lListeAvecCumul.setTri([
				ObjetTri_1.ObjetTri.init(
					"estAlimentaire",
					Enumere_TriElement_1.EGenreTriElement.Decroissant,
				),
			]);
			lListeAvecCumul.trier();
			return lListeAvecCumul;
		}
		return null;
	}
	setListeAllergenes(aListeAllergenes) {
		this.afficherFenetre(this._formaterDonneesListeAllergies(aListeAllergenes));
	}
	setListeRestrictionsAlimentaires(aListeRestrictionAlimentaire) {
		this.afficherFenetre(aListeRestrictionAlimentaire);
	}
	afficherFenetre(aListeAAfficher) {
		this.afficher();
		this.getInstance(this.IdentListe).setDonnees(
			new DonneesListe_InfoMedicale_1.DonneesListe_InfoMedicale(
				aListeAAfficher,
			),
		);
	}
	_initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			nonEditable: false,
		});
	}
	_evenementListe(aParametres) {
		aParametres.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
	}
	composeContenu() {
		const H = [];
		H.push(
			IE.jsx.str("div", {
				id: this.getNomInstance(this.IdentListe),
				class: "full-size",
			}),
		);
		return H.join("");
	}
}
exports.ObjetFenetre_InfoMedicale = ObjetFenetre_InfoMedicale;
