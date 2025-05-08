exports.ObjetFenetre_SaisieSousService = void 0;
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetRequeteDetailService_1 = require("ObjetRequeteDetailService");
const ObjetRequeteSaisieSousServices = require("ObjetRequeteSaisieSousServices");
class ObjetFenetre_SaisieSousService extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.service = null;
		this.sousServiceModifie = false;
		this.donnees = {
			matiere: "",
			classe: "",
			estUnGroupe: false,
			professeurs: "",
			listeSousMatieres: new ObjetListeElements_1.ObjetListeElements(),
			listeSousServices: new ObjetListeElements_1.ObjetListeElements(),
		};
	}
	construireInstances() {
		this.identListeSousMatieres = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListeSousMatiere,
			this._initialiserListeSousMatiere,
		);
		this.identListeSousServices = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this._initialiserListeSousServices,
		);
	}
	requeteDetailService(aService) {
		this.service = aService;
		new ObjetRequeteDetailService_1.ObjetRequeteDetailService(
			this,
			this._actionSurRequeteDetailService,
		).lancerRequete(aService);
	}
	_setDonnees(aListeSousMatieres, aListeSousServices) {
		if (this.service) {
			this.service.listeSousMatieres = aListeSousMatieres;
			this.service.services = aListeSousServices;
			const lListeProfesseurs = [];
			if (this.service.services && this.service.services.count() > 0) {
				this.service.services.parcourir((D) => {
					if (D.listeProfesseurs && D.listeProfesseurs.getPremierElement()) {
						const lLibelle = D.listeProfesseurs
							.getPremierElement()
							.getLibelle();
						if (!lListeProfesseurs.includes(lLibelle)) {
							lListeProfesseurs.push(lLibelle);
						}
					}
				});
			} else if (
				this.service.listeProfesseurs &&
				this.service.listeProfesseurs.getPremierElement()
			) {
				lListeProfesseurs.push(
					this.service.listeProfesseurs.getPremierElement().getLibelle(),
				);
			}
			let lEstUnGroupe = false;
			let lClasseOuGroupe = this.service.classe
				? this.service.classe.getLibelle()
				: "";
			if (!lClasseOuGroupe) {
				lClasseOuGroupe = this.service.groupe
					? this.service.groupe.getLibelle()
					: "";
				lEstUnGroupe = true;
			}
			$.extend(this.donnees, {
				matiere: !!this.service.matiere
					? this.service.matiere.getLibelle()
					: "",
				classe: !!lClasseOuGroupe ? lClasseOuGroupe : "",
				estUnGroupe: lEstUnGroupe,
				professeurs: lListeProfesseurs.join(", "),
				listeSousMatieres: this.service.listeSousMatieres,
				listeSousServices: this.service.services,
			});
		}
		this.afficher(this.composeContenu());
		this.getInstance(this.identListeSousMatieres).setDonnees(
			new DonneesListeSousMatieres(this.donnees.listeSousMatieres),
		);
		this.getInstance(this.identListeSousServices).setDonnees(
			new DonneesListeSousServices(this.donnees.listeSousServices),
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			boutonCreationSousService: {
				event: function () {
					const lSousMatieresSelectionnees = aInstance
						.getInstance(aInstance.identListeSousMatieres)
						.getListeElementsSelection();
					if (
						lSousMatieresSelectionnees &&
						lSousMatieresSelectionnees.count() > 0
					) {
						const lService = aInstance.service;
						let leServiceADesDevoirs = false;
						let leServiceADejaDesSousServices = false;
						if (!!lService.nbrDevoirsTotal) {
							leServiceADesDevoirs = lService.nbrDevoirsTotal > 0;
						}
						if (!!aInstance.donnees.listeSousServices) {
							leServiceADejaDesSousServices =
								aInstance.donnees.listeSousServices.count() > 0;
						}
						if (leServiceADesDevoirs && !leServiceADejaDesSousServices) {
							GApplication.getMessage().afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"servicesProfesseur.CreerSousService.MsgConfirmationTransfertDevoirs",
								),
								callback: function (aGenreAction) {
									if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
										aInstance._creerSousService(
											lSousMatieresSelectionnees,
											lService,
										);
									}
								},
							});
						} else {
							aInstance._creerSousService(lSousMatieresSelectionnees, lService);
						}
					}
				},
				getDisabled: function () {
					return (
						aInstance
							.getInstance(aInstance.identListeSousMatieres)
							.getListeElementsSelection()
							.count() === 0
					);
				},
			},
		});
	}
	composeContenu() {
		const H = [];
		H.push('<div class="flex-contain cols p-all-l">');
		H.push('<ul class="m-bottom-xl">');
		H.push(
			'  <li class="flex-contain flex-center flex-gap">',
			'<span class="fix-bloc" style="width:7rem;">',
			ObjetTraduction_1.GTraductions.getValeur(
				"servicesProfesseur.CreerSousService.Matiere",
			),
			"</span>",
			'<span class="semi-bold">',
			this.donnees.matiere,
			"</span>",
			"<li>",
		);
		H.push(
			'  <li class="flex-contain flex-center flex-gap">',
			'<span class="fix-bloc" style="width:7rem;">',
			this.donnees.estUnGroupe
				? ObjetTraduction_1.GTraductions.getValeur(
						"servicesProfesseur.CreerSousService.Groupe",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"servicesProfesseur.CreerSousService.Classe",
					),
			"</span>",
			'<span class=semi-bold">',
			this.donnees.classe,
			"</span>",
			"<li>",
		);
		H.push(
			'  <li class="flex-contain flex-center flex-gap">',
			'<span class="fix-bloc" style="width:7rem;">',
			ObjetTraduction_1.GTraductions.getValeur(
				"servicesProfesseur.CreerSousService.Professeur",
			),
			"</span>",
			'<span class="semi-bold">',
			this.donnees.professeurs,
			"</span>",
			"<li>",
		);
		H.push("</ul>");
		H.push(
			'<div id="' +
				this.getNomInstance(this.identListeSousMatieres) +
				'" class="m-y-l"></div>',
		);
		H.push(
			'<ie-bouton class="m-bottom-l" ie-model="boutonCreationSousService">',
			ObjetTraduction_1.GTraductions.getValeur(
				"servicesProfesseur.CreerSousService.CreerUnSousService",
			),
			"</ie-bouton>",
		);
		H.push(
			'<h2 class="m-y-l ie-titre-petit Gras">',
			ObjetTraduction_1.GTraductions.getValeur(
				"servicesProfesseur.CreerSousService.SousServicesExistants",
			),
			"</h2>",
		);
		H.push(
			'<div id="' +
				this.getNomInstance(this.identListeSousServices) +
				'"></div>',
		);
		H.push("</div>");
		return H.join("");
	}
	surValidation() {
		this.callback.appel({
			rafraichissementNecessaire: !!this.sousServiceModifie,
		});
		this.fermer();
	}
	_actionSurRequeteDetailService(aParametres) {
		this._setDonnees(
			aParametres.ListeSousMatieres,
			aParametres.ListeSousServices,
		);
	}
	_creerSousService(aListeSousMatieresSelectionnees, aService) {
		for (let i = 0; i < aListeSousMatieresSelectionnees.count(); i++) {
			const lNewSousService = new ObjetElement_1.ObjetElement();
			lNewSousService.sousMatiere = aListeSousMatieresSelectionnees.get(i);
			lNewSousService.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			aService.services.addElement(lNewSousService);
		}
		this.sousServiceModifie = true;
		aService.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		new ObjetRequeteSaisieSousServices(
			this,
			this._actionSurSaisieDonnees,
		).lancerRequete({
			service: aService,
			listeSousServices: aService.services,
		});
	}
	_initialiserListeSousMatiere(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListeSousMatieres.colonnes.libelle,
			taille: "100%",
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"servicesProfesseur.CreerSousService.SousMatieres",
			),
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			titreCreation: ObjetTraduction_1.GTraductions.getValeur(
				"servicesProfesseur.CreerSousService.CreerSousMatiere",
			),
			avecLigneCreation: true,
			listeCreations: 0,
			hauteurAdapteContenu: true,
			hauteurMaxAdapteContenu: 120,
		});
	}
	_evenementListeSousMatiere(aParametres, aGenreEvenement) {
		switch (aGenreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
				this.$refreshSelf();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresCreation:
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				this.sousServiceModifie =
					aGenreEvenement ===
					Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition;
				this.service.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				new ObjetRequeteSaisieSousServices(
					this,
					this._actionSurSaisieDonnees,
				).lancerRequete({
					service: this.service,
					listeSousMatieres: this.service.listeSousMatieres,
				});
				break;
		}
	}
	_initialiserListeSousServices(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListeSousServices.colonnes.libelle,
			taille: "50%",
		});
		lColonnes.push({
			id: DonneesListeSousServices.colonnes.enseignant,
			taille: "50%",
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			hauteurAdapteContenu: true,
			hauteurMaxAdapteContenu: 120,
		});
	}
	_actionSurSaisieDonnees() {
		this.requeteDetailService(this.service);
	}
}
exports.ObjetFenetre_SaisieSousService = ObjetFenetre_SaisieSousService;
class DonneesListeSousMatieres extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.creerIndexUnique("Libelle");
		this.setOptions({
			avecSuppression: false,
			avecEvnt_Selection: true,
			avecEvnt_ApresCreation: true,
			avecEvnt_ApresEdition: true,
			avecMultiSelection: true,
			avecEtatSaisie: false,
		});
	}
	getValeur(aParams) {
		return aParams.article.getLibelle();
	}
	avecMenuContextuel() {
		return false;
	}
	surCreation(D, V) {
		D.Libelle = V[0];
	}
	surEdition(aParams, V) {
		aParams.article.setLibelle(V);
	}
}
DonneesListeSousMatieres.colonnes = { libelle: "sousmatieres_libelle" };
class DonneesListeSousServices extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecSelection: false,
			avecEdition: false,
			avecSuppression: false,
		});
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListeSousServices.colonnes.libelle:
				return aParams.article.getLibelle();
			case DonneesListeSousServices.colonnes.enseignant: {
				let lResult = "";
				if (!!aParams.article.listeProfesseurs) {
					const lProfesseur =
						aParams.article.listeProfesseurs.getPremierElement();
					if (!!lProfesseur) {
						lResult = lProfesseur.getLibelle();
					}
				}
				return lResult;
			}
		}
		return "";
	}
}
DonneesListeSousServices.colonnes = {
	libelle: "sousservices_libelle",
	enseignant: "sousservices_enseignant",
};
