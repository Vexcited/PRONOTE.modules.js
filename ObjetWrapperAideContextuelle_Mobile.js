exports.ObjetWrapperAideContextuelle_Mobile = void 0;
const ObjetAideContextuelle_1 = require("ObjetAideContextuelle");
const ObjetFenetre_1 = require("ObjetFenetre");
class ObjetWrapperAideContextuelle_Mobile {
	constructor(aDonnees) {
		this.donnees = aDonnees;
	}
	ouvrir(aOnglet, aNombre) {
		this.onglet = aOnglet;
		this.nombre = aNombre;
		if (!this.instanceAide) {
			this.instanceAide = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				_ObjetFenetreAideContextuelle_Mobile,
				{ pere: this.donnees.pere },
				{
					options: { onglet: this.onglet, nombre: this.nombre },
					callbackApresFermer: () => {
						this.instanceAide = null;
					},
				},
			);
			this.instanceAide.afficher();
		} else {
			this.instanceAide.fermer();
			this.instanceAide = null;
		}
	}
}
exports.ObjetWrapperAideContextuelle_Mobile =
	ObjetWrapperAideContextuelle_Mobile;
class _ObjetFenetreAideContextuelle_Mobile extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			fermerFenetreSurClicHorsFenetre: true,
			listeBoutons: [],
			avecCroixFermeture: false,
			themeMenuDark: true,
		});
	}
	construireInstances() {
		this.identAide = this.add(
			ObjetAideContextuelle_1.ObjetAideContextuelle,
			() => {
				this.fermer();
			},
			(aInstance) => {
				aInstance.setOptionsAideContextuelle(this.optionsFenetre.options);
			},
		);
	}
	composeContenu() {
		return IE.jsx.str("div", {
			id: this.getNomInstance(this.identAide),
			style: "height:100%;",
		});
	}
}
