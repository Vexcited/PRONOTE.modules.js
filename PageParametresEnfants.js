const { ObjetIdentite_Mobile } = require("ObjetIdentite_Mobile.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	UtilitairePageDonneesPersonnelles,
} = require("UtilitairePageDonneesPersonnelles.js");
const { EGenreTypeContenu } = require("Enumere_DonneesPersonnelles.js");
const { GHtml } = require("ObjetHtml.js");
const { EListeIds } = require("Enumere_DonneesPersonnelles.js");
const { ObjetRequetePageMesEnfants } = require("ObjetRequetePageMesEnfants.js");
const {
	ObjetFenetre_ModificationIdentifiantMDP,
} = require("ObjetFenetre_ModificationIdentifiantMDP.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const {
	ObjetFenetre_DetailsPIEleve,
} = require("ObjetFenetre_DetailsPIEleve.js");
const {
	ObjetRequeteSaisieMotDePasseEleve,
} = require("ObjetRequeteSaisieMotDePasseEleve.js");
class PageParametresEnfants extends ObjetIdentite_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.parametres = { maskMDP: "*********" };
	}
	construirePage() {
		const lParams = { listeProjets: this.donnees.listeProjets };
		const lHtml = [];
		if (GApplication.droits.get(TypeDroits.compte.avecSaisieMotDePasseEleve)) {
			lHtml.push(
				UtilitairePageDonneesPersonnelles.construireZoneGenerique(
					GTraductions.getValeur("PageCompte.Identifiant"),
					EGenreTypeContenu.Identifiant,
					{ chaine: this.donnees.informationsCompte.Identifiant },
				),
			);
			lHtml.push(
				UtilitairePageDonneesPersonnelles.construireZoneGenerique(
					GTraductions.getValeur("PageCompte.MotDePasse"),
					EGenreTypeContenu.MotDePasse,
					{ maskMdp: this.parametres.maskMDP },
				),
			);
		}
		lHtml.push(
			'<div class="border-bottom" id="',
			this.getInstancePageInformationsMedicales().getNom(),
			'"></div>',
		);
		if (!!this.donnees.listeProjets && this.donnees.listeProjets.count() > 0) {
			lHtml.push(
				UtilitairePageDonneesPersonnelles.construireZoneGenerique(
					GTraductions.getValeur("PageCompte.ProjetsAccompagnement"),
					EGenreTypeContenu.ProjetsAccompagnement,
					lParams,
				),
			);
		}
		lHtml.push(
			UtilitairePageDonneesPersonnelles.construireZoneGenerique(
				GTraductions.getValeur("PageCompte.autorisationsSortie"),
				EGenreTypeContenu.AutorisationSortie,
				{
					identiteAutorisations:
						this.getInstancePageAutorisationsSortie().getNom(),
				},
			),
		);
		lHtml.push(
			UtilitairePageDonneesPersonnelles.construireZoneGenerique(
				GTraductions.getValeur("ParametresUtilisateur.DroitALImage"),
				EGenreTypeContenu.DroitImage,
				{},
			),
		);
		lHtml.push(
			UtilitairePageDonneesPersonnelles.construireZoneGenerique(
				GTraductions.getValeur("PageCompte.NumeroINE"),
				EGenreTypeContenu.INE,
				{ numeroINE: this.donnees.numeroINE },
			),
		);
		return lHtml.join("");
	}
	getControleur(aInstance) {
		const lControleur = $.extend(true, super.getControleur(aInstance), {
			afficherFenetreDetailsPIEleve: {
				event(aNumero) {
					if (aInstance.donnees && aInstance.donnees.listeProjets) {
						const lProjet =
							aInstance.donnees.listeProjets.getElementParNumero(aNumero);
						_ouvrirFenetreDetailsPIEleve.call(aInstance, lProjet);
					}
				},
			},
		});
		return $.extend(
			true,
			lControleur,
			UtilitairePageDonneesPersonnelles.getControleur(aInstance),
		);
	}
	getInstancePageInformationsMedicales() {
		return this.Pere.getInstance(this.Pere.identInformationsMedicales);
	}
	getInstancePageAutorisationsSortie() {
		return this.Pere.getInstance(this.Pere.identAutorisationSortie);
	}
	recupererDonnees() {
		new ObjetRequetePageMesEnfants(
			this,
			_surReponseRequetePageInfosPerso,
		).lancerRequete();
	}
	getStructurePourValidation(aStructure) {
		aStructure.informationsMedicales =
			this.getInstancePageInformationsMedicales().donnees.infosMedicales;
		aStructure.allergies =
			this.getInstancePageInformationsMedicales().donnees.allergies;
		aStructure.restrictionsAlimentaires =
			this.getInstancePageInformationsMedicales().donnees.listeRestrictionsAlimentaires;
		aStructure.autorisationSortie =
			this.getInstancePageAutorisationsSortie().getAutorisationSortieModifiee();
		if (this.donnees.droitImage) {
			aStructure.autorisationImage = !this.donnees.droitImage.autoriser;
		}
		return true;
	}
}
function _afficherPopUp() {
	const lFenetreModificationMdp = ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_ModificationIdentifiantMDP,
		{
			pere: this,
			initialiser: function (aInstance) {
				aInstance.changementMDP = true;
				aInstance.changementMDPEleve = true;
				aInstance.setOptionsFenetre({
					optionsMDP: { classRequeteSaisie: ObjetRequeteSaisieMotDePasseEleve },
				});
			},
		},
	);
	lFenetreModificationMdp.setDonnees(GEtatUtilisateur.reglesSaisieMotDePasse);
}
function _surReponseRequetePageInfosPerso(aDonnees) {
	this.donnees = aDonnees;
	if (!!aDonnees.message) {
		GHtml.setHtml(this.Nom, this.composeAucuneDonnee(aDonnees.message));
	} else {
		GHtml.setHtml(this.Nom, this.construirePage(), {
			controleur: this.controleur,
		});
		$("#" + EListeIds.mdp.escapeJQ()).on({
			mouseup: function () {
				_afficherPopUp.call(this);
			},
			keyup: function () {
				if (GNavigateur.isToucheSelection()) {
					_afficherPopUp.call(this);
				}
			},
		});
		const lParams = {
			infosMedicales: this.donnees.infosMedicales,
			restrictionsAlimentaires: this.donnees.restrictionsAlimentaires,
			mangeALaCantine: this.donnees.mangeALaCantine,
			allergies: this.donnees.allergies,
			allergiesModifiables: this.donnees.allergiesModifiables,
			regimesAlimentairesModifiables:
				this.donnees.regimesAlimentairesModifiables,
		};
		this.getInstancePageInformationsMedicales().setDonnees(lParams);
		this.getInstancePageAutorisationsSortie().setDonnees(
			this.donnees.autorisationSortie,
		);
	}
}
function _ouvrirFenetreDetailsPIEleve(aProjet) {
	ObjetFenetre.creerInstanceFenetre(ObjetFenetre_DetailsPIEleve, {
		pere: this,
	}).setDonnees({ eleve: GEtatUtilisateur.getMembre(), projet: aProjet });
}
module.exports = { PageParametresEnfants };
