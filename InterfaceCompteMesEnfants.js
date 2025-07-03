exports.InterfaceCompteMesEnfants = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequeteSaisieCompteEnfant_1 = require("ObjetRequeteSaisieCompteEnfant");
const ObjetFenetre_ModificationIdentifiantMDP_1 = require("ObjetFenetre_ModificationIdentifiantMDP");
const InterfaceAutorisationSortie_1 = require("InterfaceAutorisationSortie");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const InterfacePage_1 = require("InterfacePage");
const ObjetRequetePageMesEnfants_1 = require("ObjetRequetePageMesEnfants");
const PageInformationsMedicales_1 = require("PageInformationsMedicales");
const UtilitairePageDonneesPersonnelles_1 = require("UtilitairePageDonneesPersonnelles");
const Enumere_DonneesPersonnelles_1 = require("Enumere_DonneesPersonnelles");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const GUID_1 = require("GUID");
const ObjetFenetre_DetailsPIEleve_1 = require("ObjetFenetre_DetailsPIEleve");
const ObjetRequeteSaisieMotDePasseEleve_1 = require("ObjetRequeteSaisieMotDePasseEleve");
class InterfaceCompteMesEnfants extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.parametres = {
			largeurIdentifiantCompteEnfant: 120,
			maskMDP: "*********",
		};
		this.ids = { divConteneur: GUID_1.GUID.getId(), mdpEnfant: "mdp_enfant" };
		this.idPage = this.ids.divConteneur;
	}
	construireInstances() {
		this.identInformationsMedicales = this.add(
			PageInformationsMedicales_1.PageInformationsMedicales,
			this._evenementInformationsMedicales.bind(this),
		);
		this.identAutorisationSortie = this.add(
			InterfaceAutorisationSortie_1.InterfaceAutorisationSortie,
			this._evenementAutorisationSortie.bind(this),
		);
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{
					class: "ObjetCompte details-contain",
					style: "height: 100%;flex:1 1 auto; overflow:auto;",
				},
				IE.jsx.str("div", {
					id: this.ids.divConteneur,
					class: "compte-contain",
					style: "max-width: 88rem;",
				}),
			),
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
	surReponseRecupererDonnees(aJSON) {
		this.donnees = aJSON;
		this.setEtatSaisie(false);
		if (!!aJSON.message) {
			this.afficherMessage(aJSON.message);
		} else {
			ObjetHtml_1.GHtml.setHtml(this.ids.divConteneur, this._construirePage(), {
				controleur: this.controleur,
			});
			if (!!this.donnees.informationsCompte) {
				const lThis = this;
				$("#" + this.ids.mdpEnfant.escapeJQ()).on({
					mouseup: function () {
						lThis._surModifierMdpEnfant();
					},
					keyup: function () {
						if (GNavigateur.isToucheSelection()) {
							lThis._surModifierMdpEnfant();
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
		new ObjetRequetePageMesEnfants_1.ObjetRequetePageMesEnfants(
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
		new ObjetRequeteSaisieCompteEnfant_1.ObjetRequeteSaisieCompteEnfant(
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
	_evenementInformationsMedicales() {
		this.valider();
	}
	_evenementAutorisationSortie() {
		this.valider();
	}
	_construirePage() {
		const lParams = {
			listeProjets: this.donnees.listeProjets,
			largeurIdentifiantCompteEnfant: null,
			identifiant: null,
			informationsCompteMotDePasse: null,
		};
		const lAvecSaisieMdpEnfant =
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.compte.avecSaisieMotDePasseEleve,
			) && !!this.donnees.informationsCompte;
		if (lAvecSaisieMdpEnfant) {
			lParams.largeurIdentifiantCompteEnfant =
				this.parametres.largeurIdentifiantCompteEnfant;
			lParams.identifiant = this.donnees.informationsCompte.Identifiant;
			lParams.informationsCompteMotDePasse = this.donnees.informationsCompte
				.MotDePasseEnClair
				? this.donnees.informationsCompte.MotDePasse
				: this.parametres.maskMDP;
		}
		const H = [];
		if (lAvecSaisieMdpEnfant) {
			H.push(
				UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
					ObjetTraduction_1.GTraductions.getValeur("PageCompte.CompteEnfant"),
					Enumere_DonneesPersonnelles_1.EGenreTypeContenu.InfosCompteEnfant,
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
				UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
					ObjetTraduction_1.GTraductions.getValeur(
						"PageCompte.ProjetsAccompagnement",
					),
					Enumere_DonneesPersonnelles_1.EGenreTypeContenu.ProjetsAccompagnement,
					lParams,
				),
			);
		}
		if (!!this.donnees.autorisationSortie) {
			H.push(
				UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
					ObjetTraduction_1.GTraductions.getValeur("AutorisationSortie.titre"),
					Enumere_DonneesPersonnelles_1.EGenreTypeContenu.AutorisationSortie,
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
				UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
					ObjetTraduction_1.GTraductions.getValeur(
						"ParametresUtilisateur.DroitALImage",
					),
					Enumere_DonneesPersonnelles_1.EGenreTypeContenu.DroitImage,
					{ avecImage: !this.donnees.droitImage.autoriser },
				),
			);
		}
		H.push(
			UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
				ObjetTraduction_1.GTraductions.getValeur("PageCompte.NumeroINE"),
				Enumere_DonneesPersonnelles_1.EGenreTypeContenu.INE,
				{ numeroINE: this.donnees.numeroINE },
			),
		);
		return H.join("");
	}
	_surModifierMdpEnfant() {
		const lFenetreModifIdentifiantMDP =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_ModificationIdentifiantMDP_1.ObjetFenetre_ModificationIdentifiantMDP,
				{
					pere: this,
					initialiser: (aInstance) => {
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
		lFenetreModifIdentifiantMDP.setDonnees(
			GEtatUtilisateur.reglesSaisieMotDePasse,
		);
	}
	_ouvrirFenetreDetailsPIEleve(aProjet) {
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_DetailsPIEleve_1.ObjetFenetre_DetailsPIEleve,
			{ pere: this },
		).setDonnees({ eleve: GEtatUtilisateur.getMembre(), projet: aProjet });
	}
}
exports.InterfaceCompteMesEnfants = InterfaceCompteMesEnfants;
