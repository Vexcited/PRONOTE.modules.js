exports.PageParametresEnfants = void 0;
const ObjetIdentite_Mobile_1 = require("ObjetIdentite_Mobile");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitairePageDonneesPersonnelles_1 = require("UtilitairePageDonneesPersonnelles");
const Enumere_DonneesPersonnelles_1 = require("Enumere_DonneesPersonnelles");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_DonneesPersonnelles_2 = require("Enumere_DonneesPersonnelles");
const ObjetRequetePageMesEnfants_1 = require("ObjetRequetePageMesEnfants");
const ObjetFenetre_ModificationIdentifiantMDP_1 = require("ObjetFenetre_ModificationIdentifiantMDP");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetFenetre_DetailsPIEleve_1 = require("ObjetFenetre_DetailsPIEleve");
const ObjetRequeteSaisieMotDePasseEleve_1 = require("ObjetRequeteSaisieMotDePasseEleve");
const AccessApp_1 = require("AccessApp");
class PageParametresEnfants extends ObjetIdentite_Mobile_1.ObjetIdentite_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.parametres = { maskMDP: "*********" };
	}
	construirePage() {
		const lParams = { listeProjets: this.donnees.listeProjets };
		const lHtml = [];
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.compte.avecSaisieMotDePasseEleve,
			)
		) {
			lHtml.push(
				UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
					ObjetTraduction_1.GTraductions.getValeur("PageCompte.Identifiant"),
					Enumere_DonneesPersonnelles_1.EGenreTypeContenu.Identifiant,
					{ chaine: this.donnees.informationsCompte.Identifiant },
				),
			);
			lHtml.push(
				UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
					ObjetTraduction_1.GTraductions.getValeur("PageCompte.MotDePasse"),
					Enumere_DonneesPersonnelles_1.EGenreTypeContenu.MotDePasse,
					{ maskMdp: this.parametres.maskMDP },
				),
			);
		}
		lHtml.push(
			'<div class="border-bottom" id="',
			this.Pere.getInstancePageInformationsMedicales().getNom(),
			'"></div>',
		);
		if (!!this.donnees.listeProjets && this.donnees.listeProjets.count() > 0) {
			lHtml.push(
				UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
					ObjetTraduction_1.GTraductions.getValeur(
						"PageCompte.ProjetsAccompagnement",
					),
					Enumere_DonneesPersonnelles_1.EGenreTypeContenu.ProjetsAccompagnement,
					lParams,
				),
			);
		}
		lHtml.push(
			UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
				ObjetTraduction_1.GTraductions.getValeur(
					"PageCompte.autorisationsSortie",
				),
				Enumere_DonneesPersonnelles_1.EGenreTypeContenu.AutorisationSortie,
				{
					identiteAutorisations:
						this.Pere.getInstancePageAutorisationsSortie().getNom(),
				},
			),
		);
		lHtml.push(
			UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
				ObjetTraduction_1.GTraductions.getValeur(
					"ParametresUtilisateur.DroitALImage",
				),
				Enumere_DonneesPersonnelles_1.EGenreTypeContenu.DroitImage,
				{},
			),
		);
		lHtml.push(
			UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
				ObjetTraduction_1.GTraductions.getValeur("PageCompte.NumeroINE"),
				Enumere_DonneesPersonnelles_1.EGenreTypeContenu.INE,
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
						aInstance._ouvrirFenetreDetailsPIEleve(lProjet);
					}
				},
			},
		});
		return $.extend(
			true,
			lControleur,
			UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.getControleur(
				aInstance,
			),
		);
	}
	recupererDonnees() {
		new ObjetRequetePageMesEnfants_1.ObjetRequetePageMesEnfants(
			this,
			this._surReponseRequetePageInfosPerso.bind(this),
		).lancerRequete();
	}
	_surReponseRequetePageInfosPerso(aDonnees) {
		this.donnees = aDonnees;
		if (!!aDonnees.message) {
			ObjetHtml_1.GHtml.setHtml(
				this.Nom,
				this.composeAucuneDonnee(aDonnees.message),
			);
		} else {
			ObjetHtml_1.GHtml.setHtml(this.Nom, this.construirePage(), {
				controleur: this.controleur,
			});
			$("#" + Enumere_DonneesPersonnelles_2.EListeIds.mdp.escapeJQ()).on({
				mouseup: () => {
					this.afficherFenetreModificationIdentifiantMDP();
				},
				keyup: () => {
					if (GNavigateur.isToucheSelection()) {
						this.afficherFenetreModificationIdentifiantMDP();
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
			this.Pere.getInstancePageInformationsMedicales().setDonnees(lParams);
			this.Pere.getInstancePageAutorisationsSortie().setDonnees(
				this.donnees.autorisationSortie,
			);
		}
	}
	getStructurePourValidation(aStructure) {
		aStructure.informationsMedicales =
			this.Pere.getInstancePageInformationsMedicales().getDossierMedicalModifie();
		aStructure.allergies =
			this.Pere.getInstancePageInformationsMedicales().getAllergiesModifie();
		aStructure.restrictionsAlimentaires =
			this.Pere.getInstancePageInformationsMedicales().getAlimentationModifie();
		aStructure.autorisationSortie =
			this.Pere.getInstancePageAutorisationsSortie().getAutorisationSortieModifiee();
		if (this.donnees.droitImage) {
			aStructure.autorisationImage = !this.donnees.droitImage.autoriser;
		}
		return true;
	}
	afficherFenetreModificationIdentifiantMDP() {
		const lFenetreModificationMdp =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_ModificationIdentifiantMDP_1.ObjetFenetre_ModificationIdentifiantMDP,
				{
					pere: this,
					initialiser: function (aInstance) {
						aInstance.changementMDP = true;
						aInstance.changementMDPEleve = true;
						aInstance.setOptionsFenetre({
							optionsMDP: {
								classRequeteSaisie:
									ObjetRequeteSaisieMotDePasseEleve_1.ObjetRequeteSaisieMotDePasseEleve,
							},
						});
					},
				},
			);
		lFenetreModificationMdp.setDonnees(GEtatUtilisateur.reglesSaisieMotDePasse);
	}
	_ouvrirFenetreDetailsPIEleve(aProjet) {
		const lFenetreDetailsPIEleve =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_DetailsPIEleve_1.ObjetFenetre_DetailsPIEleve,
				{ pere: this },
			);
		lFenetreDetailsPIEleve.setDonnees({
			eleve: GEtatUtilisateur.getMembre(),
			projet: aProjet,
		});
	}
}
exports.PageParametresEnfants = PageParametresEnfants;
