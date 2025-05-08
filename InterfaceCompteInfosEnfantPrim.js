const { TypeDroits } = require("ObjetDroitsPN.js");
const { InterfacePage } = require("InterfacePage.js");
const { Requetes } = require("CollectionRequetes.js");
const { GChaine } = require("ObjetChaine.js");
const {
	ObjetRequeteConsultation,
	ObjetRequeteSaisie,
} = require("ObjetRequeteJSON.js");
const {
	ObjetCompte_AutorisationSortie,
} = require("ObjetCompte_AutorisationSortie.js");
const {
	ObjetCompte_AutorisationImage,
} = require("ObjetCompte_AutorisationImage.js");
const { ObjetCompte_AutresContacts } = require("ObjetCompte_AutresContacts.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const {
	ObjetRequeteSaisieCompteEnfant,
} = require("ObjetRequeteSaisieCompteEnfant.js");
const { DonneesListe_FiltreCompte } = require("DonneesListe_FiltreCompte.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { TypeFiltreAffichage } = require("Enumere_DonneesPersonnelles.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { GUID } = require("GUID.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreTypeContenu } = require("Enumere_DonneesPersonnelles.js");
const {
	UtilitairePageDonneesPersonnelles,
} = require("UtilitairePageDonneesPersonnelles.js");
const { PageInformationsMedicales } = require("PageInformationsMedicales.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
	ObjetFenetre_DetailsPIEleve,
} = require("ObjetFenetre_DetailsPIEleve.js");
const {
	ObjetFenetre_ModificationIdentifiantMDP,
} = require("ObjetFenetre_ModificationIdentifiantMDP.js");
const {
	ObjetRequeteSaisieMotDePasseEleve,
} = require("ObjetRequeteSaisieMotDePasseEleve.js");
Requetes.inscrire("InfosEnfant", ObjetRequeteConsultation);
Requetes.inscrire("SaisieAutorisationSortie", ObjetRequeteSaisie);
Requetes.inscrire("SaisieAutorisationImage", ObjetRequeteSaisie);
Requetes.inscrire("SaisieAutresContacts", ObjetRequeteSaisie);
class InterfaceCompteInfosEnfantPrim extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.idMainPage = GUID.getId();
		this.idContenu = GUID.getId();
		this.idSecurisation = `${this.Nom}_secur`;
		this.setOptionsEcrans({ nbNiveaux: 2, avecBascule: IE.estMobile });
		this.parametres = {
			largeurIdentifiantCompteEnfant: 120,
			maskMDP: "*********",
		};
		this.ids = { mdpEnfant: `${this.Nom}_mdp_enfant` };
		this.contexte = {
			guidRef: `${this.Nom}_contexte`,
			niveauCourant: 0,
			ecran: [
				InterfaceCompteInfosEnfantPrim.genreEcran.principal,
				InterfaceCompteInfosEnfantPrim.genreEcran.detail,
			],
			selection: [],
		};
	}
	getControleur(aInstance) {
		return $.extend(
			true,
			super.getControleur(aInstance),
			UtilitairePageDonneesPersonnelles.getControleur(aInstance),
			{
				btnRetourEcranPrec: {
					event() {
						aInstance.revenirSurEcranPrecedent();
					},
				},
				avecListeProjAcc() {
					return (
						aInstance.donnees &&
						aInstance.donnees.listeProjets &&
						aInstance.donnees.listeProjets.count()
					);
				},
				modifierMdpEnfant: {
					event() {
						_surModifierMdpEnfant.call(aInstance);
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
						return UtilitairePageDonneesPersonnelles.construireZoneGenerique(
							GTraductions.getValeur("PageCompte.CompteEnfant"),
							EGenreTypeContenu.InfosCompteEnfant,
							lParams,
						);
					}
					return "";
				},
				getHtmlListeProjAcc() {
					return UtilitairePageDonneesPersonnelles.construireZoneGenerique(
						GTraductions.getValeur("PageCompte.ProjetsAccompagnement"),
						EGenreTypeContenu.ProjetsAccompagnement,
						{ listeProjets: aInstance.donnees.listeProjets },
					);
				},
				afficherFenetreDetailsPIEleve: {
					event(aNumero) {
						if (aInstance.donnees && aInstance.donnees.listeProjets) {
							const lProjet =
								aInstance.donnees.listeProjets.getElementParNumero(aNumero);
							_ouvrirFenetreDetailsPIEleve.call(aInstance, lProjet);
						}
					},
				},
			},
		);
	}
	construireInstances() {
		this.identAutoriseSortie = this.add(
			ObjetCompte_AutorisationSortie,
			_evntAutorisationSaisie.bind(this),
		);
		this.identAutoriseImage = this.add(
			ObjetCompte_AutorisationImage,
			_evntAutorisationImageSaisie.bind(this),
		);
		this.identInformationsMedicales = this.add(
			PageInformationsMedicales,
			_evenementInformationsMedicales.bind(this),
		);
		this.identAutresContacts = this.add(
			ObjetCompte_AutresContacts,
			_evntSaisieAutresContacts.bind(this),
		);
		this.identListe = this.add(
			ObjetListe,
			_evenementListe.bind(this),
			_initListe,
		);
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		this.GenreStructure = EStructureAffichage.Autre;
	}
	recupererDonnees() {
		Requetes(
			"InfosEnfant",
			this,
			_actionApresRequete.bind(this),
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
		H.push(`<div tabindex="0" ie-html="getHtmlSecurisation"></div>`);
		H.push("</div>");
		H.push(
			'    <div style="display: none;" class="compte-contain" id="',
			this.idMainPage,
			'">',
		);
		H.push(`      <div tabindex="0">`);
		H.push(`<div class="item-conteneur">`);
		H.push(
			`<h4>${GTraductions.getValeur("InfosEnfantPrim.autoriseSortie.titreRubrique")}</h4>`,
		);
		H.push(
			`<div  class="valeur-contain" id="${this.getInstance(this.identAutoriseSortie).getNom()}"></div>`,
		);
		H.push("</div>");
		H.push(`<div class="item-conteneur">`);
		H.push(`<h4>${GTraductions.getValeur("infosperso.Liste_DroitImage")}</h4>`);
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
			`<h4>${GTraductions.getValeur("InfosEnfantPrim.autresContacts.titreRubrique")}</h4>`,
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
		const lElement = this.getCtxSelection({ niveauEcran: 0 });
		switch (aEcran.genreEcran) {
			case InterfaceCompteInfosEnfantPrim.genreEcran.principal:
				if (this.optionsEcrans.avecBascule) {
					this.setHtmlStructureAffichageBandeau("");
				}
				break;
			case InterfaceCompteInfosEnfantPrim.genreEcran.detail:
				this.setHtmlStructureAffichageBandeau(
					this.construireBandeauEcran(lElement),
				);
				_actualiserAffichageDetails.call(this);
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
		new ObjetRequeteSaisieCompteEnfant(
			this,
			this.actionSurValidation,
		).lancerRequete({
			informationsMedicales: lInformationsMedicales,
			allergies: lInformationsAllergies,
			restrictionsAlimentaires: this.donnees.restrictionsAlimentaires,
		});
	}
}
InterfaceCompteInfosEnfantPrim.genreEcran = {
	principal: "principal",
	detail: "detail",
};
function _evenementInformationsMedicales() {
	this.valider();
}
function _actionApresRequete(aJSON) {
	if (aJSON) {
		this.donneesRecues = true;
		this.donnees = aJSON;
		if (!!this.donnees.informationsCompte) {
			const lAvecMotDePasseEnClair =
				!!this.donnees.informationsCompte.MotDePasse;
			this.donnees.informationsCompte.MotDePasse = lAvecMotDePasseEnClair
				? GChaine.ajouterEntites(
						GApplication.getCommunication().getChaineDechiffreeAES(
							this.donnees.informationsCompte.MotDePasse,
						),
					)
				: "*****";
			this.donnees.informationsCompte.Identifiant = GChaine.ajouterEntites(
				GChaine.ajouterEntites(
					GApplication.getCommunication().getChaineDechiffreeAES(
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
			listeContactsAutresEnfants: aJSON.Informations.listeContactsAutresEnfants,
		});
		let lListe = new ObjetListeElements();
		let lElementTitre = new ObjetElement(
			GTraductions.getValeur("InfosEnfantPrim.compte.titre"),
		);
		lElementTitre.nonSelectionnable = true;
		lElementTitre.estInterTitre = ObjetListe.typeInterTitre.h5;
		lListe.addElement(lElementTitre);
		this.saisieMdpEnfant =
			GApplication.droits.get(TypeDroits.compte.avecSaisieMotDePasseEleve) &&
			this.donnees.informationsCompte;
		lListe.add(
			new ObjetElement(
				GTraductions.getValeur("InfosEnfantPrim.compte.profil"),
				0,
				TypeFiltreAffichage.profilPrimEnfant,
			),
		);
		if (this.saisieMdpEnfant) {
			lListe.add(
				new ObjetElement(
					GTraductions.getValeur(
						"ParametresUtilisateur.TitreSecurisationCompte",
					),
					0,
					TypeFiltreAffichage.securisation,
				),
			);
		}
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_FiltreCompte(lListe).setOptions({
				flatDesignMinimal: !IE.estMobile,
			}),
			0,
		);
		if (!IE.estMobile) {
			this.getInstance(this.identListe).selectionnerLigne({ ligne: 1 });
		}
	}
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
function _initListe(aInstance) {
	aInstance.setOptionsListe({
		skin: ObjetListe.skin.flatDesign,
		hauteurAdapteContenu: true,
		colonnesSansBordureDroit: [true],
	});
}
function _evenementListe(aParametres) {
	const lCellulesSelections = this.getInstance(
		this.identListe,
	).getTableauCellulesSelection();
	this.ongletSelectionne = lCellulesSelections[0].article.getGenre();
	let lEcranSrc, lEcranDest;
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.SelectionClick:
		case EGenreEvenementListe.ModificationSelection:
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
	_actualiserAffichageDetails.call(this);
}
function _actualiserAffichageDetails() {
	const lSelection = this.getInstance(this.identListe).getElementSelection();
	switch (lSelection.getGenre()) {
		case TypeFiltreAffichage.profilPrimEnfant:
			GHtml.setDisplay(this.idSecurisation, false);
			GHtml.setDisplay(this.idMainPage, true);
			break;
		case TypeFiltreAffichage.securisation:
			GHtml.setDisplay(this.idMainPage, false);
			GHtml.setDisplay(this.idSecurisation, true);
			break;
		default:
			break;
	}
}
function _evntAutorisationSaisie(aParam) {
	const lObjetSaisie = { estAutorise: aParam.estAutorise };
	Requetes(
		"SaisieAutorisationSortie",
		this,
		_actionSurSaisie.bind(this),
	).lancerRequete(lObjetSaisie);
}
function _evntAutorisationImageSaisie(aParam) {
	const lObjetSaisie = { avecImage: !aParam.estAutorise };
	Requetes(
		"SaisieAutorisationImage",
		this,
		_actionSurSaisie.bind(this),
	).lancerRequete(lObjetSaisie);
}
function _evntSaisieAutresContacts(aParam) {
	aParam.listeSaisie.setSerialisateurJSON({
		methodeSerialisation: _serialisationListeAutresContacts.bind(this),
	});
	Requetes(
		"SaisieAutresContacts",
		this,
		this.actionSurValidation,
	).lancerRequete(aParam);
}
function _serialisationListeAutresContacts(aElement, aJSON) {
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
function _actionSurSaisie() {
	this.recupererDonnees();
}
function _ouvrirFenetreDetailsPIEleve(aProjet) {
	ObjetFenetre.creerInstanceFenetre(ObjetFenetre_DetailsPIEleve, {
		pere: this,
	}).setDonnees({ eleve: GEtatUtilisateur.getMembre(), projet: aProjet });
}
module.exports = { InterfaceCompteInfosEnfantPrim };
