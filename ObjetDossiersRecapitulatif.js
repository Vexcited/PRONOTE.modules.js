const { TypeDroits } = require("ObjetDroitsPN.js");
const { Identite } = require("ObjetIdentite.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	EGenreElementDossier,
	EGenreElementDossierUtil,
} = require("Enumere_ElementDossier.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
class ObjetDossiersRecapitulatif extends Identite {
	constructor(...aParams) {
		super(...aParams);
		this.donnees = {
			listeGenresEvenements: null,
			afficherAnneesPrecedentes: false,
		};
	}
	setDonnees(aListeGenres, aAfficherAnneesPrecedentes) {
		this.donnees.listeGenresEvenements = aListeGenres;
		this.donnees.afficherAnneesPrecedentes = aAfficherAnneesPrecedentes;
		this.afficher(_construireAffichage(this.donnees.listeGenresEvenements));
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbAfficherAnneesPrecedentes: {
				estVisible: function () {
					const lPeriodeSelectionnee = GEtatUtilisateur.Navigation.getRessource(
						EGenreRessource.Periode,
					);
					return !!lPeriodeSelectionnee && !lPeriodeSelectionnee.existeNumero();
				},
				comboModele: {
					getValue: function () {
						return aInstance.donnees.afficherAnneesPrecedentes;
					},
					setValue: function (aValue) {
						aInstance.donnees.afficherAnneesPrecedentes = aValue;
						aInstance.callback.appel(aValue);
					},
				},
			},
		});
	}
}
function _construireAffichage(aListeGenreEvenements) {
	const lHTML = [];
	lHTML.push('<div class="DossiersRecapitulatif">');
	if (!!aListeGenreEvenements && aListeGenreEvenements.count() > 0) {
		lHTML.push(composeRecapitulatifEvenements(aListeGenreEvenements));
		lHTML.push(
			'<div class="GrandEspaceHaut" style="display: flex; justify-content: space-between;">',
			'<span class="Gras">',
			GTraductions.getValeur("dossierVieScolaire.titreDossiers"),
			"</span>",
			'<span ie-display="cbAfficherAnneesPrecedentes.estVisible">',
			'<ie-checkbox ie-model="cbAfficherAnneesPrecedentes.comboModele">',
			GTraductions.getValeur("dossierVieScolaire.AfficherAnneesPrecedentes"),
			"</ie-checkbox>",
			"</span>",
			"</div>",
		);
	}
	lHTML.push("</div>");
	return lHTML.join("");
}
function composeRecapitulatifEvenements(aListeGenreEvenements) {
	const H = [];
	H.push(
		'<div class="Gras ">',
		GTraductions.getValeur("dossierVieScolaire.titreRecapitulatif"),
		"</div>",
	);
	H.push(
		'<div class="EspaceHaut liste-icons" style="display:flex; align-items: center;">',
	);
	if (!!aListeGenreEvenements) {
		aListeGenreEvenements.parcourir((aGenreEvenement) => {
			if (
				aGenreEvenement.getGenre() !== EGenreElementDossier.Punition ||
				GApplication.droits.get(TypeDroits.fonctionnalites.gestionPunitions)
			) {
				H.push(
					'<div style="display: flex;align-items: center;" title="',
					aGenreEvenement.libelleDetail,
					'">',
				);
				H.push(
					'<span class="InlineBlock iconic ',
					EGenreElementDossierUtil.getIconePolice(aGenreEvenement.getGenre()),
					'">',
					"</span>",
				);
				H.push(
					'<span class="EspaceGauche10" style="width: 30px;">',
					aGenreEvenement.nombre,
					"</span>",
				);
				H.push("</div>");
			}
		});
	}
	H.push("</div>");
	return H.join("");
}
module.exports = { ObjetDossiersRecapitulatif };
