exports.ObjetFenetre_SaisieSuivisAbsenceRetard = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_Media_1 = require("DonneesListe_Media");
class ObjetFenetre_SaisieSuivisAbsenceRetard extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur("SuivisAR.CreationSuivi"),
			largeur: 300,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			null,
			_initialiserListe,
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			fenetreBtn: {
				getDisabled: function (aBoutonRepeat) {
					if (aBoutonRepeat.element.index === 0) {
						return false;
					}
					return (
						aInstance
							.getInstance(aInstance.identListe)
							.getListeElementsSelection()
							.count() === 0
					);
				},
			},
		});
	}
	jsxModeleCheckboxSensCorrespondance(aAfficherMediasTypeEnvoi) {
		return {
			getValue: () => {
				return this.afficherMediasTypeEnvoi === aAfficherMediasTypeEnvoi;
			},
			setValue: (aValue) => {
				this.afficherMediasTypeEnvoi = aAfficherMediasTypeEnvoi;
				const lInstanceListe = this.getInstance(this.identListe);
				lInstanceListe
					.getDonneesListe()
					.setEstReponse(!this.afficherMediasTypeEnvoi);
				lInstanceListe.actualiser();
			},
			getName: () => {
				return `${this.Nom}_SensCorrespondance`;
			},
		};
	}
	composeContenu() {
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "PetitEspace" },
					IE.jsx.str(
						"div",
						{ class: "PetitEspaceBas" },
						IE.jsx.str(
							"ie-radio",
							{
								"ie-model": this.jsxModeleCheckboxSensCorrespondance.bind(
									this,
									true,
								),
							},
							ObjetTraduction_1.GTraductions.getValeur("SuivisAR.Envoi"),
						),
					),
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str(
							"ie-radio",
							{
								"ie-model": this.jsxModeleCheckboxSensCorrespondance.bind(
									this,
									false,
								),
							},
							ObjetTraduction_1.GTraductions.getValeur("SuivisAR.Reception"),
						),
					),
				),
				IE.jsx.str("div", {
					class: "PetitEspace",
					id: this.getNomInstance(this.identListe),
				}),
			),
		);
		return T.join("");
	}
	setDonnees(aSurEnvoi, aListeMedias, aListeSuivisAbsenceRetard) {
		this.afficherMediasTypeEnvoi = aSurEnvoi;
		this.listeMedias = aListeMedias;
		this.listeSuivisAbsenceRetard = aListeSuivisAbsenceRetard;
		this.afficher();
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_Media_1.DonneesListe_Media(
				this.listeMedias,
				!aSurEnvoi,
				this.listeSuivisAbsenceRetard,
			),
		);
	}
	surValidation(ANumeroBouton) {
		const lListe = this.getInstance(
			this.identListe,
		).getListeElementsSelection();
		this.fermer();
		this.callback.appel(ANumeroBouton === 1, lListe.get(0));
	}
}
exports.ObjetFenetre_SaisieSuivisAbsenceRetard =
	ObjetFenetre_SaisieSuivisAbsenceRetard;
function _initialiserListe(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_Media_1.DonneesListe_Media.colonnes.code,
		titre: ObjetTraduction_1.GTraductions.getValeur("Code"),
		taille: 40,
	});
	lColonnes.push({
		id: DonneesListe_Media_1.DonneesListe_Media.colonnes.libelle,
		titre: ObjetTraduction_1.GTraductions.getValeur("SuivisAR.Intitule"),
		taille: "100%",
	});
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		hauteurAdapteContenu: true,
		hauteurMaxAdapteContenu: 450,
		listeCreations: [0, 1],
		avecLigneCreation: true,
	});
}
