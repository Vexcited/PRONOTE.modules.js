exports.genreEcran = exports.InterfaceCompteInfosEnfantPrim = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const InterfacePage_1 = require("InterfacePage");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetCompte_AutorisationSortie_1 = require("ObjetCompte_AutorisationSortie");
const ObjetCompte_AutorisationImage_1 = require("ObjetCompte_AutorisationImage");
const ObjetCompte_AutresContacts_1 = require("ObjetCompte_AutresContacts");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetRequeteSaisieCompteEnfant_1 = require("ObjetRequeteSaisieCompteEnfant");
const DonneesListe_FiltreCompte_1 = require("DonneesListe_FiltreCompte");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const Enumere_DonneesPersonnelles_1 = require("Enumere_DonneesPersonnelles");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_DonneesPersonnelles_2 = require("Enumere_DonneesPersonnelles");
const UtilitairePageDonneesPersonnelles_1 = require("UtilitairePageDonneesPersonnelles");
const PageInformationsMedicales_1 = require("PageInformationsMedicales");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_DetailsPIEleve_1 = require("ObjetFenetre_DetailsPIEleve");
const ObjetFenetre_ModificationIdentifiantMDP_1 = require("ObjetFenetre_ModificationIdentifiantMDP");
const ObjetRequeteSaisieMotDePasseEleve_1 = require("ObjetRequeteSaisieMotDePasseEleve");
const AccessApp_1 = require("AccessApp");
const ObjetRequeteInfosEnfant_1 = require("ObjetRequeteInfosEnfant");
class ObjetRequeteSaisieAutorisationSortie extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
CollectionRequetes_1.Requetes.inscrire(
	"SaisieAutorisationSortie",
	ObjetRequeteSaisieAutorisationSortie,
);
class ObjetRequeteSaisieAutorisationImage extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
CollectionRequetes_1.Requetes.inscrire(
	"SaisieAutorisationImage",
	ObjetRequeteSaisieAutorisationImage,
);
class ObjetRequeteSaisieAutresContacts extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
CollectionRequetes_1.Requetes.inscrire(
	"SaisieAutresContacts",
	ObjetRequeteSaisieAutresContacts,
);
class InterfaceCompteInfosEnfantPrim extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.appSco = (0, AccessApp_1.getApp)();
		this.idMainPage = GUID_1.GUID.getId();
		this.idContenu = GUID_1.GUID.getId();
		this.idSecurisation = `${this.Nom}_secur`;
		this.parametres = {
			largeurIdentifiantCompteEnfant: 120,
			maskMDP: "*********",
		};
		this.ids = { mdpEnfant: `${this.Nom}_mdp_enfant` };
		this.setOptionsEcrans({ nbNiveaux: 2, avecBascule: IE.estMobile });
		this.contexte = {
			guidRef: `${this.Nom}_contexte`,
			niveauCourant: 0,
			ecran: [genreEcran.principal, genreEcran.detail],
			selection: [],
		};
	}
	getControleur(aInstance) {
		return $.extend(
			true,
			super.getControleur(aInstance),
			UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.getControleur(
				aInstance,
			),
			{
				avecListeProjAcc() {
					return !!(
						aInstance.donnees &&
						aInstance.donnees.listeProjets &&
						aInstance.donnees.listeProjets.count()
					);
				},
				modifierMdpEnfant: {
					event() {
						aInstance._surModifierMdpEnfant();
					},
				},
				getHtmlSecurisation() {
					if (aInstance.saisieMdpEnfant) {
						const lParams = {
							model: "modifierMdpEnfant",
							largeurIdentifiantCompteEnfant:
								aInstance.parametres.largeurIdentifiantCompteEnfant,
							identifiant: aInstance.donnees.informationsCompte.Identifiant,
							informationsCompteMotDePasse: aInstance.donnees
								.informationsCompteMotDePasseEnClair
								? aInstance.donnees.informationsCompteMotDePasse
								: aInstance.parametres.maskMDP,
						};
						return UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
							ObjetTraduction_1.GTraductions.getValeur(
								"PageCompte.CompteEnfant",
							),
							Enumere_DonneesPersonnelles_2.EGenreTypeContenu.InfosCompteEnfant,
							lParams,
						);
					}
					return "";
				},
				getHtmlListeProjAcc() {
					if (aInstance.donnees) {
						return UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.construireZoneGenerique(
							ObjetTraduction_1.GTraductions.getValeur(
								"PageCompte.ProjetsAccompagnement",
							),
							Enumere_DonneesPersonnelles_2.EGenreTypeContenu
								.ProjetsAccompagnement,
							{ listeProjets: aInstance.donnees.listeProjets },
						);
					}
					return "";
				},
				afficherFenetreDetailsPIEleve: {
					event(aNumero) {
						if (aInstance.donnees && aInstance.donnees.listeProjets) {
							const lProjet =
								aInstance.donnees.listeProjets.getElementParNumero(aNumero);
							aInstance._ouvrirFenetreDetailsPIEleve(lProjet);
						}
					},
				},
			},
		);
	}
	construireInstances() {
		this.identAutoriseSortie = this.add(
			ObjetCompte_AutorisationSortie_1.ObjetCompte_AutorisationSortie,
			this._evntAutorisationSaisie.bind(this),
		);
		this.identAutoriseImage = this.add(
			ObjetCompte_AutorisationImage_1.ObjetCompte_AutorisationImage,
			this._evntAutorisationImageSaisie.bind(this),
		);
		this.identInformationsMedicales = this.add(
			PageInformationsMedicales_1.PageInformationsMedicales,
			this._evenementInformationsMedicales.bind(this),
		);
		this.identAutresContacts = this.add(
			ObjetCompte_AutresContacts_1.ObjetCompte_AutresContacts,
			this._evntSaisieAutresContacts.bind(this),
		);
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListe.bind(this),
			this._initListe,
		);
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	recupererDonnees() {
		new ObjetRequeteInfosEnfant_1.ObjetRequeteInfosEnfant(
			this,
			this._actionApresRequete.bind(this),
		).lancerRequete();
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push('<div class="ObjetCompte">');
		H.push(
			'  <div id="',
			this.getIdDeNiveau({ niveauEcran: 0 }),
			'" ',
			'class="menu-contain">',
		);
		H.push(
			'    <div id="' +
				this.getInstance(this.identListe).getNom() +
				'" class="liste-contain"></div>',
		);
		H.push("  </div>");
		H.push(
			'  <div id="',
			this.getIdDeNiveau({ niveauEcran: 1 }),
			'" ',
			IE.estMobile ? 'style="display: none;"' : "",
			'class="details-contain">',
		);
		H.push(
			`<div style="display: none;" class="compte-contain" id="${this.idSecurisation}">`,
		);
		H.push(`<div ie-html="getHtmlSecurisation"></div>`);
		H.push("</div>");
		H.push(
			'    <div style="display: none;" class="compte-contain" id="',
			this.idMainPage,
			'">',
		);
		H.push(`      <div>`);
		H.push(`<div class="item-conteneur">`);
		H.push(
			`<h2>${ObjetTraduction_1.GTraductions.getValeur("InfosEnfantPrim.autoriseSortie.titreRubrique")}</h2>`,
		);
		H.push(
			`<div  class="valeur-contain" id="${this.getInstance(this.identAutoriseSortie).getNom()}"></div>`,
		);
		H.push("</div>");
		H.push(`<div class="item-conteneur">`);
		H.push(
			`<h2>${ObjetTraduction_1.GTraductions.getValeur("infosperso.Liste_DroitImage")}</h2>`,
		);
		H.push(
			`<div  class="valeur-contain" id="${this.getInstance(this.identAutoriseImage).getNom()}"></div>`,
		);
		H.push("</div>");
		H.push(
			`<div class="border-bottom" ie-if="avecListeProjAcc" ie-html="getHtmlListeProjAcc"></div>`,
		);
		H.push(
			'<div class="item-conteneur" id="',
			this.getNomInstance(this.identInformationsMedicales),
			'"></div>',
		);
		H.push(`<div class="item-conteneur">`);
		H.push(
			`<h2>${ObjetTraduction_1.GTraductions.getValeur("InfosEnfantPrim.autresContacts.titreRubrique")}</h2>`,
		);
		H.push(
			`<div class="valeur-contain" id="${this.getInstance(this.identAutresContacts).getNom()}"></div>`,
		);
		H.push("</div>");
		H.push("      </div>");
		H.push("    </div>");
		H.push("  </div>");
		H.push("</div>");
		return H.join("");
	}
	construireEcran(aEcran) {
		switch (aEcran.genreEcran) {
			case genreEcran.principal:
				if (this.optionsEcrans.avecBascule) {
					this.setHtmlStructureAffichageBandeau("");
				}
				break;
			case genreEcran.detail:
				this.setHtmlStructureAffichageBandeau(this.construireBandeauEcran());
				this._actualiserAffichageDetails();
				break;
			default:
		}
	}
	construireBandeauEcran() {
		const lHtml = [];
		return super.construireBandeauEcran(lHtml.join(""), { bgWhite: true });
	}
	valider() {
		const lInformationsMedicales = this.getInstance(
			this.identInformationsMedicales,
		).getDossierMedicalModifie();
		const lInformationsAllergies = this.getInstance(
			this.identInformationsMedicales,
		).getAllergiesModifie();
		this.setEtatSaisie(false);
		new ObjetRequeteSaisieCompteEnfant_1.ObjetRequeteSaisieCompteEnfant(
			this,
			this.actionSurValidation,
		).lancerRequete({
			informationsMedicales: lInformationsMedicales,
			allergies: lInformationsAllergies,
			restrictionsAlimentaires: this.donnees.restrictionsAlimentaires,
		});
	}
	_evenementInformationsMedicales() {
		this.valider();
	}
	_actionApresRequete(aJSON) {
		if (aJSON) {
			this.donneesRecues = true;
			this.donnees = aJSON;
			if (!!this.donnees.informationsCompte) {
				const lAvecMotDePasseEnClair =
					!!this.donnees.informationsCompte.MotDePasse;
				this.donnees.informationsCompte.MotDePasse = lAvecMotDePasseEnClair
					? ObjetChaine_1.GChaine.ajouterEntites(
							this.appSco
								.getCommunication()
								.getChaineDechiffreeAES(
									this.donnees.informationsCompte.MotDePasse,
								),
						)
					: "*****";
				this.donnees.informationsCompte.Identifiant =
					ObjetChaine_1.GChaine.ajouterEntites(
						ObjetChaine_1.GChaine.ajouterEntites(
							this.appSco
								.getCommunication()
								.getChaineDechiffreeAES(
									this.donnees.informationsCompte.Identifiant,
								),
						),
					);
				this.donnees.informationsCompte.MotDePasseEnClair =
					lAvecMotDePasseEnClair;
			}
			this.getInstance(this.identAutoriseSortie).setDonnees({
				sortieAutorisee: aJSON.Informations.sortieAutorise,
			});
			const lParams = {
				infosMedicales: aJSON.infosMedicales,
				restrictionsAlimentaires: aJSON.restrictionsAlimentaires,
				mangeALaCantine: aJSON.mangeALaCantine,
				allergies: aJSON.allergies,
				allergiesModifiables: aJSON.allergiesModifiables,
				regimesAlimentairesModifiables: aJSON.regimesAlimentairesModifiables,
			};
			this.getInstance(this.identInformationsMedicales).setDonnees(lParams);
			this.getInstance(this.identAutoriseImage).setDonnees({
				autoriserImage: aJSON.Informations.autoriserImage,
			});
			this.getInstance(this.identAutresContacts).setDonnees({
				listeAutresContacts: aJSON.Informations.listeAutresContacts,
				listeLiensParente: aJSON.Informations.listeLiensParente,
				listeContactsAutresEnfants:
					aJSON.Informations.listeContactsAutresEnfants,
			});
			let lListe = new ObjetListeElements_1.ObjetListeElements();
			let lElementTitre = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"InfosEnfantPrim.compte.titre",
				),
			);
			lElementTitre.nonSelectionnable = true;
			lElementTitre.estInterTitre = ObjetListe_1.ObjetListe.typeInterTitre.h5;
			lListe.addElement(lElementTitre);
			this.saisieMdpEnfant =
				this.appSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.compte.avecSaisieMotDePasseEleve,
				) && !!this.donnees.informationsCompte;
			lListe.add(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"InfosEnfantPrim.compte.profil",
					),
					0,
					Enumere_DonneesPersonnelles_1.TypeFiltreAffichage.profilPrimEnfant,
				),
			);
			if (this.saisieMdpEnfant) {
				lListe.add(
					new ObjetElement_1.ObjetElement(
						ObjetTraduction_1.GTraductions.getValeur(
							"ParametresUtilisateur.TitreSecurisationCompte",
						),
						0,
						Enumere_DonneesPersonnelles_1.TypeFiltreAffichage.securisation,
					),
				);
			}
			this.getInstance(this.identListe).setDonnees(
				new DonneesListe_FiltreCompte_1.DonneesListe_FiltreCompte(
					lListe,
				).setOptions({ flatDesignMinimal: !IE.estMobile }),
				0,
			);
			if (!IE.estMobile) {
				this.getInstance(this.identListe).selectionnerLigne({ ligne: 1 });
			}
		}
	}
	_surModifierMdpEnfant() {
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
		).setDonnees(GEtatUtilisateur.reglesSaisieMotDePasse);
	}
	_initListe(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			hauteurAdapteContenu: true,
			colonnesSansBordureDroit: [true],
		});
	}
	_evenementListe(aParametres) {
		const lCellulesSelections = this.getInstance(
			this.identListe,
		).getTableauCellulesSelection();
		this.ongletSelectionne = lCellulesSelections[0].article.getGenre();
		let lEcranSrc, lEcranDest;
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
			case Enumere_EvenementListe_1.EGenreEvenementListe.ModificationSelection:
				if (this.optionsEcrans.avecBascule) {
					lEcranSrc = {
						niveauEcran: 0,
						genreEcran: this.getCtxEcran({ niveauEcran: 0 }),
					};
					lEcranDest = {
						niveauEcran: 1,
						genreEcran: this.getCtxEcran({ niveauEcran: 1 }),
					};
					this.basculerEcran(lEcranSrc, lEcranDest);
				}
				break;
		}
		this._actualiserAffichageDetails();
	}
	_actualiserAffichageDetails() {
		const lSelection = this.getInstance(this.identListe).getElementSelection();
		switch (lSelection.getGenre()) {
			case Enumere_DonneesPersonnelles_1.TypeFiltreAffichage.profilPrimEnfant:
				ObjetHtml_1.GHtml.setDisplay(this.idSecurisation, false);
				ObjetHtml_1.GHtml.setDisplay(this.idMainPage, true);
				break;
			case Enumere_DonneesPersonnelles_1.TypeFiltreAffichage.securisation:
				ObjetHtml_1.GHtml.setDisplay(this.idMainPage, false);
				ObjetHtml_1.GHtml.setDisplay(this.idSecurisation, true);
				break;
			default:
				break;
		}
	}
	_evntAutorisationSaisie(aParam) {
		const lObjetSaisie = { estAutorise: aParam.estAutorise };
		new ObjetRequeteSaisieAutorisationSortie(
			this,
			this._actionSurSaisie.bind(this),
		).lancerRequete(lObjetSaisie);
	}
	_evntAutorisationImageSaisie(aParam) {
		const lObjetSaisie = { avecImage: !aParam.estAutorise };
		new ObjetRequeteSaisieAutorisationImage(
			this,
			this._actionSurSaisie.bind(this),
		).lancerRequete(lObjetSaisie);
	}
	_evntSaisieAutresContacts(aParam) {
		aParam.listeSaisie.setSerialisateurJSON({
			methodeSerialisation: this._serialisationListeAutresContacts.bind(this),
		});
		new ObjetRequeteSaisieAutresContacts(
			this,
			this.actionSurValidation,
		).lancerRequete(aParam);
	}
	_serialisationListeAutresContacts(aElement, aJSON) {
		aJSON.nom = aElement.nom;
		aJSON.prenom = aElement.prenom;
		aJSON.indMobile = aElement.indMobile;
		aJSON.indDomicile = aElement.indDomicile;
		aJSON.indTravail = aElement.indTravail;
		aJSON.telMobile = aElement.telMobile;
		aJSON.telDomicile = aElement.telDomicile;
		aJSON.telTravail = aElement.telTravail;
		aJSON.appelSiUrgent = aElement.appelSiUrgent;
		aJSON.autoriseARecuperer = aElement.autoriseARecuperer;
		if (aElement.lienParente && aElement.lienParente.getNumero() !== 0) {
			aJSON.lienParente = aElement.lienParente.toJSON();
		}
	}
	_actionSurSaisie() {
		this.recupererDonnees();
	}
	_ouvrirFenetreDetailsPIEleve(aProjet) {
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_DetailsPIEleve_1.ObjetFenetre_DetailsPIEleve,
			{ pere: this },
		).setDonnees({ eleve: GEtatUtilisateur.getMembre(), projet: aProjet });
	}
}
exports.InterfaceCompteInfosEnfantPrim = InterfaceCompteInfosEnfantPrim;
var genreEcran;
(function (genreEcran) {
	genreEcran["principal"] = "principal";
	genreEcran["detail"] = "detail";
})(genreEcran || (exports.genreEcran = genreEcran = {}));
