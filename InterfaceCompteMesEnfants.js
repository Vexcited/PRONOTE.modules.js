const { TypeDroits } = require("ObjetDroitsPN.js");
const {
	ObjetRequeteSaisieCompteEnfant,
} = require("ObjetRequeteSaisieCompteEnfant.js");
const {
	ObjetFenetre_ModificationIdentifiantMDP,
} = require("ObjetFenetre_ModificationIdentifiantMDP.js");
const {
	InterfaceAutorisationSortie,
} = require("InterfaceAutorisationSortie.js");
const { GHtml } = require("ObjetHtml.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { InterfacePage } = require("InterfacePage.js");
const { ObjetRequetePageMesEnfants } = require("ObjetRequetePageMesEnfants.js");
const { PageInformationsMedicales } = require("PageInformationsMedicales.js");
const {
	UtilitairePageDonneesPersonnelles,
} = require("UtilitairePageDonneesPersonnelles.js");
const { EGenreTypeContenu } = require("Enumere_DonneesPersonnelles.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { GUID } = require("GUID.js");
const {
	ObjetFenetre_DetailsPIEleve,
} = require("ObjetFenetre_DetailsPIEleve.js");
const {
	ObjetRequeteSaisieMotDePasseEleve,
} = require("ObjetRequeteSaisieMotDePasseEleve.js");
class InterfaceCompteMesEnfants extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.donnees = {
			mangeALaCantine: false,
			informationsCompte: null,
			numeroINE: "",
			autorisationSortie: null,
			infosMedicales: null,
			restrictionsAlimentaires: null,
		};
		this.parametres = {
			largeurIdentifiantCompteEnfant: 120,
			maskMDP: "*********",
		};
		this.ids = {
			divConteneur: GUID.getId(),
			mdpEnfant: "mdp_enfant",
			cbDroitImage: "CB_DroitImage",
		};
		this.idPage = this.ids.divConteneur;
	}
	construireInstances() {
		this.identInformationsMedicales = this.add(
			PageInformationsMedicales,
			_evenementInformationsMedicales,
		);
		this.identAutorisationSortie = this.add(
			InterfaceAutorisationSortie,
			_evenementAutorisationSortie,
		);
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		this.GenreStructure = EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			'<div class="ObjetCompte details-contain" style="height: 100%;flex:1 1 auto; overflow:auto;">',
			'<div id="',
			this.ids.divConteneur,
			'" class="compte-contain" style="max-width: 88rem;"></div>',
			"</div>",
		);
		return H.join("");
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
	surReponseRecupererDonnees(aJSON) {
		Object.assign(this.donnees, aJSON);
		this.setEtatSaisie(false);
		if (!!aJSON.message) {
			this.afficherMessage(aJSON.message);
		} else {
			GHtml.setHtml(this.ids.divConteneur, _construirePage.call(this), {
				controleur: this.controleur,
			});
			if (!!this.donnees.informationsCompte) {
				const lThis = this;
				$("#" + this.ids.mdpEnfant.escapeJQ()).on({
					mouseup: function () {
						_surModifierMdpEnfant.call(lThis);
					},
					keyup: function () {
						if (GNavigateur.isToucheSelection()) {
							_surModifierMdpEnfant.call(lThis);
						}
					},
					mouseenter: function () {
						$(this).toggleClass("Gras");
					},
					mouseleave: function () {
						$(this).toggleClass("Gras");
					},
				});
			}
			if (!!this.donnees.autorisationSortie) {
				this.getInstance(this.identAutorisationSortie).setDonnees(
					this.donnees.autorisationSortie,
				);
			}
			const lParams = {
				infosMedicales: aJSON.infosMedicales,
				restrictionsAlimentaires: aJSON.restrictionsAlimentaires,
				mangeALaCantine: aJSON.mangeALaCantine,
				allergies: aJSON.allergies,
				allergiesModifiables: aJSON.allergiesModifiables,
				regimesAlimentairesModifiables: aJSON.regimesAlimentairesModifiables,
			};
			this.getInstance(this.identInformationsMedicales).setDonnees(lParams);
		}
	}
	recupererDonnees() {
		new ObjetRequetePageMesEnfants(
			this,
			this.surReponseRecupererDonnees,
		).lancerRequete();
	}
	valider() {
		const lAutorisationSortie = this.getInstance(
			this.identAutorisationSortie,
		).getAutorisationSortieModifiee();
		const lInformationsMedicales = this.getInstance(
			this.identInformationsMedicales,
		).getDossierMedicalModifie();
		const lInformationsAllergies = this.getInstance(
			this.identInformationsMedicales,
		).getAllergiesModifie();
		const lRestrictionsAlimentaires = this.getInstance(
			this.identInformationsMedicales,
		).getAlimentationModifie();
		new ObjetRequeteSaisieCompteEnfant(
			this,
			this.actionSurValidation,
		).lancerRequete({
			autorisationSortie: lAutorisationSortie,
			informationsMedicales: lInformationsMedicales,
			allergies: lInformationsAllergies,
			restrictionsAlimentaires: lRestrictionsAlimentaires,
			autorisationImage: !this.donnees.droitImage.autoriser,
		});
	}
}
function _evenementInformationsMedicales() {
	this.valider();
}
function _evenementAutorisationSortie() {
	this.valider();
}
function _construirePage() {
	const lParams = { listeProjets: this.donnees.listeProjets };
	const lAvecSaisieMdpEnfant =
		GApplication.droits.get(TypeDroits.compte.avecSaisieMotDePasseEleve) &&
		this.donnees.informationsCompte;
	if (lAvecSaisieMdpEnfant) {
		lParams.largeurIdentifiantCompteEnfant =
			this.parametres.largeurIdentifiantCompteEnfant;
		lParams.identifiant = this.donnees.informationsCompte.Identifiant;
		lParams.informationsCompteMotDePasse = this.donnees
			.informationsCompteMotDePasseEnClair
			? this.donnees.informationsCompteMotDePasse
			: this.parametres.maskMDP;
	}
	const H = [];
	if (lAvecSaisieMdpEnfant) {
		H.push(
			UtilitairePageDonneesPersonnelles.construireZoneGenerique(
				GTraductions.getValeur("PageCompte.CompteEnfant"),
				EGenreTypeContenu.InfosCompteEnfant,
				lParams,
			),
		);
	}
	H.push(
		'<div class="bord-bas" id="',
		this.getNomInstance(this.identInformationsMedicales),
		'"></div>',
	);
	if (!!this.donnees.listeProjets && this.donnees.listeProjets.count() > 0) {
		H.push(
			UtilitairePageDonneesPersonnelles.construireZoneGenerique(
				GTraductions.getValeur("PageCompte.ProjetsAccompagnement"),
				EGenreTypeContenu.ProjetsAccompagnement,
				lParams,
			),
		);
	}
	if (!!this.donnees.autorisationSortie) {
		H.push(
			UtilitairePageDonneesPersonnelles.construireZoneGenerique(
				GTraductions.getValeur("AutorisationSortie.titre"),
				EGenreTypeContenu.AutorisationSortie,
				{
					identiteAutorisations: this.getInstance(
						this.identAutorisationSortie,
					).getNom(),
				},
			),
		);
	}
	if (!!this.donnees.droitImage) {
		H.push(
			UtilitairePageDonneesPersonnelles.construireZoneGenerique(
				GTraductions.getValeur("ParametresUtilisateur.DroitALImage"),
				EGenreTypeContenu.DroitImage,
				{ avecImage: !this.donnees.droitImage.autoriser },
			),
		);
	}
	H.push(
		UtilitairePageDonneesPersonnelles.construireZoneGenerique(
			GTraductions.getValeur("PageCompte.NumeroINE"),
			EGenreTypeContenu.INE,
			{ numeroINE: this.donnees.numeroINE },
		),
	);
	return H.join("");
}
function _surModifierMdpEnfant() {
	ObjetFenetre.creerInstanceFenetre(ObjetFenetre_ModificationIdentifiantMDP, {
		pere: this,
		initialiser: function (aInstance) {
			aInstance.changementMDP = true;
			aInstance.changementMDPEleve = true;
			aInstance.setOptionsFenetre({
				optionsMDP: { classRequeteSaisie: ObjetRequeteSaisieMotDePasseEleve },
			});
		},
	}).setDonnees(GEtatUtilisateur.reglesSaisieMotDePasse);
}
function _ouvrirFenetreDetailsPIEleve(aProjet) {
	ObjetFenetre.creerInstanceFenetre(ObjetFenetre_DetailsPIEleve, {
		pere: this,
	}).setDonnees({ eleve: GEtatUtilisateur.getMembre(), projet: aProjet });
}
module.exports = { InterfaceCompteMesEnfants };
