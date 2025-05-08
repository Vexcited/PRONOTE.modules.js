const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { DonneesListe_Media } = require("DonneesListe_Media.js");
class ObjetFenetre_SaisieSuivisAbsenceRetard extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: GTraductions.getValeur("SuivisAR.CreationSuivi"),
			largeur: 300,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
			],
		});
	}
	construireInstances() {
		this.identListe = this.add(ObjetListe, null, _initialiserListe);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
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
			radioSensCorrespondance: {
				getValue: function (aAfficherMediasTypeEnvoi) {
					return aInstance.afficherMediasTypeEnvoi === aAfficherMediasTypeEnvoi;
				},
				setValue: function (aAfficherMediasTypeEnvoi) {
					aInstance.afficherMediasTypeEnvoi = aAfficherMediasTypeEnvoi;
					const lInstanceListe = aInstance.getInstance(aInstance.identListe);
					lInstanceListe
						.getDonneesListe()
						.setEstReponse(!aInstance.afficherMediasTypeEnvoi);
					lInstanceListe.actualiser();
				},
			},
		});
	}
	composeContenu() {
		const T = [];
		T.push(
			'<div class="PetitEspace">',
			'<div class="PetitEspaceBas"><ie-radio ie-model="radioSensCorrespondance(true)">',
			GTraductions.getValeur("SuivisAR.Envoi"),
			"</ie-radio></div>",
			'<div><ie-radio ie-model="radioSensCorrespondance(false)">',
			GTraductions.getValeur("SuivisAR.Reception"),
			"</ie-radio></div>",
			"</div>",
		);
		T.push(
			'<div class="PetitEspace" id="',
			this.getInstance(this.identListe).getNom(),
			'">',
		);
		T.push("</div>");
		return T.join("");
	}
	setDonnees(aSurEnvoi, aListeMedias, aListeSuivisAbsenceRetard) {
		this.afficherMediasTypeEnvoi = aSurEnvoi;
		this.listeMedias = aListeMedias;
		this.listeSuivisAbsenceRetard = aListeSuivisAbsenceRetard;
		this.afficher();
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_Media(
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
function _initialiserListe(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_Media.colonnes.code,
		titre: GTraductions.getValeur("Code"),
		taille: 40,
	});
	lColonnes.push({
		id: DonneesListe_Media.colonnes.libelle,
		titre: GTraductions.getValeur("SuivisAR.Intitule"),
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
module.exports = { ObjetFenetre_SaisieSuivisAbsenceRetard };
