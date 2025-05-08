exports._ObjetFenetre_DetailElementVS = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const MethodesObjet_1 = require("MethodesObjet");
const _ObjetDetailElementVS_1 = require("_ObjetDetailElementVS");
class _ObjetFenetre_DetailElementVS extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.donnees = { elementVS: null };
		this.setOptionsFenetre({
			largeur: 350,
			hauteur: null,
			avecTailleSelonContenu: true,
		});
	}
	construireInstances() {
		this.identDetailElementVS = this.add(
			this.getClasseObjetDetailElementVS(),
			this.surEvenementDetailElementVS,
		);
	}
	composeContenu() {
		const H = [];
		H.push(
			'<div class="theme-cat-viescolaire">',
			'<div id="',
			this.getInstance(this.identDetailElementVS).getNom(),
			'"></div>',
			"</div>",
		);
		return H.join("");
	}
	setDonnees(aElementVS) {
		const lCopieElementVS = MethodesObjet_1.MethodesObjet.dupliquer(aElementVS);
		this.donnees.elementVS = lCopieElementVS;
		this.getInstance(this.identDetailElementVS).setDonnees(lCopieElementVS);
		this.afficher();
	}
	surEvenementDetailElementVS(aTypeEvenement, aDonnees) {
		this.fermer();
		if (
			aTypeEvenement !==
			_ObjetDetailElementVS_1.TypeBoutonFenetreDetailElementVS.Annuler
		) {
			this.callback.appel(aTypeEvenement, {
				element: aDonnees.element,
				documents: aDonnees.listeDocuments,
			});
		}
	}
}
exports._ObjetFenetre_DetailElementVS = _ObjetFenetre_DetailElementVS;
