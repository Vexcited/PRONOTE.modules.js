const { TypeDroits } = require("ObjetDroitsPN.js");
const { GCache } = require("Cache.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const {
	TypeGenreCumulSelectionPublic,
} = require("ObjetFenetre_SelectionPublic.js");
const {
	ObjetFenetre_SelectionPublic_PN,
} = require("ObjetFenetre_SelectionPublic_PN.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetTabOnglets } = require("ObjetTabOnglets.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	DonneesListe_SelectionDiffusion,
} = require("DonneesListe_SelectionDiffusion.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const {
	EGenreRessource,
	EGenreRessourceUtil,
} = require("Enumere_Ressource.js");
const { ObjetInterface } = require("ObjetInterface.js");
const {
	ObjetFenetre_SelectionClasseGroupe,
} = require("ObjetFenetre_SelectionClasseGroupe.js");
const { ObjetRequeteListePublics } = require("ObjetRequeteListePublics.js");
const { TypeGenreInternetIndividu } = require("TypeGenreInternetIndividu.js");
const {
	getCumulPourFenetrePublic,
} = require("UtilitaireFenetreSelectionPublic.js");
const {
	ObjetRequeteDonneesEditionInformation,
} = require("ObjetRequeteDonneesEditionInformation.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const {
	ObjetFenetre_SelectionListeDiffusion,
} = require("ObjetFenetre_SelectionListeDiffusion.js");
const { ObjetRequeteListeDiffusion } = require("ObjetRequeteListeDiffusion.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const { UtilitaireMessagerie } = require("UtilitaireMessagerie.js");
const { UtilitaireListePublics } = require("UtilitaireListePublics.js");
class ObjetDestinatairesActualite extends ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.TypeOnglet = { entite: 1, individuel: 2, responsables: 3 };
		this.genresRessourceAffDestinataire = [];
		this.choixResponsableParEntite = false;
		this.id = {
			destinataires: this.Nom + "_Destinataires",
			cbPublicElevesRattaches: this.Nom + "_ElevesRattaches",
			cbEleve: this.Nom + "_Eleve_Eleve",
			cbEleveResponsable1: this.Nom + "_Eleve_Resp1",
			cbEleveResponsable2: this.Nom + "_Eleve_Resp2",
			cbEleveProfsPrincipaux: this.Nom + "_Eleve_PPs",
			cbEleveTuteurs: this.Nom + "_Eleve_Tuteurs",
			panelDestinataireEntite: this.Nom + "_Panel_" + this.TypeOnglet.entite,
			panelDestinataireIndividuel:
				this.Nom + "_Panel_" + this.TypeOnglet.individuel,
			panelDestinataireResponsables:
				this.Nom + "_Panel_" + this.TypeOnglet.responsables,
			panelDestinatairePrimaire: this.Nom + "_Panel_Primaire",
			labelEntite: this.Nom + "_Label_Entite",
			labelEleve: this.Nom + "_Label_" + EGenreRessource.Eleve,
			labelProfesseur: this.Nom + "_Label_" + EGenreRessource.Enseignant,
			labelResponsable: this.Nom + "_Label_" + EGenreRessource.Responsable,
			labelResponsableAResponsable:
				this.Nom + "_Label_" + EGenreRessource.Responsable + "_AResp",
			labelPersonnel: this.Nom + "_Label_" + EGenreRessource.Personnel,
			labelMaitreDeStage: this.Nom + "_Label_" + EGenreRessource.MaitreDeStage,
			labelInspecteur:
				this.Nom + "_Label_" + EGenreRessource.InspecteurPedagogique,
			countEntite: this.Nom + "_Count_Entite",
			countEleve: this.Nom + "_Count_" + EGenreRessource.Eleve,
			countProfesseur: this.Nom + "_Count_" + EGenreRessource.Enseignant,
			countResponsable: this.Nom + "_Count_" + EGenreRessource.Responsable,
			countResponsableAResponsable:
				this.Nom + "_Count_" + EGenreRessource.Responsable + "_AResp",
			countPersonnel: this.Nom + "_Count_" + EGenreRessource.Personnel,
			countMaitreDeStage: this.Nom + "_Count_" + EGenreRessource.MaitreDeStage,
			countInspecteur:
				this.Nom + "_Count_" + EGenreRessource.InspecteurPedagogique,
		};
		this.setOptions({});
		this.listeOngletsDestinataires = new ObjetListeElements();
		this.listeOngletsDestinataires.addElement(
			new ObjetElement(
				GTraductions.getValeur("actualites.Edition.OngletEntite", [0, 0]),
				0,
				this.TypeOnglet.entite,
			),
		);
		this.listeOngletsDestinataires.addElement(
			new ObjetElement(
				GTraductions.getValeur("actualites.Edition.OngletIndividu", [0]),
				0,
				this.TypeOnglet.individuel,
			),
		);
		this.listeOngletsDestinataires.addElement(
			new ObjetElement(
				GTraductions.getValeur("actualites.Edition.Destinataires", [0]),
				0,
				this.TypeOnglet.entreResponsables,
			),
		);
	}
	setOptions(aOptions) {
		this.height = { zoneDestinataires: 122 };
		this.hauteurTabOnglets = 31;
		this.largeur =
			aOptions && aOptions.largeur !== null && aOptions.largeur !== undefined
				? aOptions.largeur
				: 600;
		this.avecCallbckSurModification = !!(
			aOptions &&
			aOptions.avecCallbckSurModification !== null &&
			aOptions.avecCallbckSurModification !== undefined
		);
	}
	setChoixResponsableParEntite(aChoixParEntite) {
		this.choixResponsableParEntite = aChoixParEntite;
	}
	setGenresRessourceAffDestinataire(aGenresRessourceAffDest) {
		this.genresRessourceAffDestinataire = aGenresRessourceAffDest;
		if (this.genresRessourceAffDestinataire.length > 0) {
			_resetDestinataires.call(this);
		}
	}
	getGenresRessourceAffDestinataire() {
		return this.genresRessourceAffDestinataire;
	}
	estGenreInGenresRessourceAffDestinataire(aGenreRessource) {
		return (
			this.genresRessourceAffDestinataire &&
			this.genresRessourceAffDestinataire.includes(aGenreRessource)
		);
	}
	construireInstances() {
		this.identTabs = this.add(
			ObjetTabOnglets,
			_evenementSurTab.bind(this),
			_initialiserTabs.bind(this),
		);
		this.identFenetreClasses = this.addFenetre(
			ObjetFenetre_SelectionClasseGroupe,
			_evenementFenetreClasses.bind(this),
		);
		this.identFenetreSelectPublic = this.addFenetre(
			ObjetFenetre_SelectionPublic_PN,
			_evenementFenetreIndividu.bind(this),
		);
		this.identFenetreSelectListeDiffusion = this.addFenetre(
			ObjetFenetre_SelectionListeDiffusion,
			_evenementFenetreListeDiffusion.bind(this),
		);
	}
	setDonnees(aInfo, aDonnees) {
		this.information = aInfo;
		this.afficher();
		if (aDonnees) {
			this.donneesEleve = aDonnees;
			_initPublic.call(this, aDonnees);
		}
	}
	actualiserTabs(aParam) {
		if (this.getInstance(this.identTabs)) {
			if (!!aParam && this.listeOngletsDestinataires.count() > 1) {
				this.listeOngletsDestinataires.get(1).invisible =
					aParam.avecIndividuelInvisible;
				if (aParam.avecIndividuelInvisible === true) {
					this.listeOngletsDestinataires.setLibelle(
						1,
						GTraductions.getValeur("actualites.Edition.OngletIndividu", [0]),
					);
				}
				if (_estResponsableAResponsable.call(this)) {
					this.listeOngletsDestinataires.get(0).invisible = true;
					this.listeOngletsDestinataires.get(1).invisible = true;
				} else {
					this.listeOngletsDestinataires.get(2).invisible = true;
				}
			}
			_setDonneesTabs.call(this, {
				conserverSelection:
					aParam !== null && aParam !== undefined
						? aParam.conserverSelection
						: false,
			});
		}
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnAfficherListesDiffusion: {
				event() {
					_evenementSurBoutonListeDiffusion.call(aInstance);
				},
				getTitle() {
					return GTraductions.getValeur(
						"actualites.public.chargerListeDiffusion",
					);
				},
			},
			btnSupprimerDestinataires: {
				event() {
					_viderPublic.call(aInstance);
				},
				getTitle() {
					return GTraductions.getValeur("actualites.public.supprimer");
				},
				getDisabled() {
					return (
						!aInstance.information ||
						!_existesDestinataires(aInstance.information)
					);
				},
			},
			surSaisiePublic: {
				getValue(aValeur) {
					switch (aValeur) {
						case "rattaches":
							return aInstance.information.avecElevesRattaches;
						case "responsables":
							return (
								aInstance.information.genresPublicEntite.contains(
									TypeGenreInternetIndividu.InternetIndividu_ParentEleve,
								) ||
								aInstance.information.genresPublicEntite.contains(
									TypeGenreInternetIndividu.InternetIndividu_Parent,
								)
							);
						case "professeurs":
							return aInstance.information.genresPublicEntite.contains(
								TypeGenreInternetIndividu.InternetIndividu_Professeur,
							);
						case "personnels":
							return aInstance.information.genresPublicEntite.contains(
								TypeGenreInternetIndividu.InternetIndividu_Personnel,
							);
						case "maitreDeStage":
							return aInstance.information.genresPublicEntite.contains(
								TypeGenreInternetIndividu.InternetIndividu_MaitreDeStageEleve,
							);
						case "enfants":
							return aInstance.information.genresPublicEntite.contains(
								TypeGenreInternetIndividu.InternetIndividu_ParentEleve,
							);
						case "eleves":
							return aInstance.information.genresPublicEntite.contains(
								TypeGenreInternetIndividu.InternetIndividu_Eleve,
							);
						case "legaux":
							return aInstance.information.genresPublicEntite.contains(
								TypeGenreInternetIndividu.InternetIndividu_Parent,
							);
						case "eleve_eleve":
							return aInstance.information.avecEleve;
						case "eleve_resp1":
							return aInstance.information.avecResp1;
						case "eleve_resp2":
							return aInstance.information.avecResp2;
						case "eleve_pp":
							return aInstance.information.avecProfsPrincipaux;
						case "eleve_tuteurs":
							return aInstance.information.avecTuteurs;
						case "directeur":
							return aInstance.information.avecDirecteur;
						default:
							break;
					}
				},
				setValue(aValeur, aChecked) {
					switch (aValeur) {
						case "rattaches":
							aInstance.information.avecElevesRattaches = aChecked;
							break;
						case "responsables":
							if (!aChecked) {
								_modifierGenrePublicEntite.call(
									aInstance,
									TypeGenreInternetIndividu.InternetIndividu_ParentEleve,
									aChecked,
								);
								_modifierGenrePublicEntite.call(
									aInstance,
									TypeGenreInternetIndividu.InternetIndividu_Parent,
									aChecked,
								);
							} else {
								let lType =
									TypeGenreInternetIndividu.InternetIndividu_ParentEleve;
								if (aInstance.information.estInformation) {
									lType = TypeGenreInternetIndividu.InternetIndividu_Parent;
								}
								_modifierGenrePublicEntite.call(aInstance, lType, aChecked);
							}
							break;
						case "professeurs":
							_modifierGenrePublicEntite.call(
								aInstance,
								TypeGenreInternetIndividu.InternetIndividu_Professeur,
								aChecked,
							);
							break;
						case "personnels":
							_modifierGenrePublicEntite.call(
								aInstance,
								TypeGenreInternetIndividu.InternetIndividu_Personnel,
								aChecked,
							);
							break;
						case "maitreDeStage":
							_modifierGenrePublicEntite.call(
								aInstance,
								TypeGenreInternetIndividu.InternetIndividu_MaitreDeStageEleve,
								aChecked,
							);
							break;
						case "eleves":
							_modifierGenrePublicEntite.call(
								aInstance,
								TypeGenreInternetIndividu.InternetIndividu_Eleve,
								aChecked,
							);
							break;
						case "eleve_eleve":
							aInstance.information.avecEleve = aChecked;
							break;
						case "eleve_resp1":
							aInstance.information.avecResp1 = aChecked;
							break;
						case "eleve_resp2":
							aInstance.information.avecResp2 = aChecked;
							break;
						case "eleve_pp":
							aInstance.information.avecProfsPrincipaux = aChecked;
							break;
						case "eleve_tuteurs":
							aInstance.information.avecTuteurs = aChecked;
							break;
						case "directeur":
							aInstance.information.avecDirecteur = aChecked;
							break;
						default:
							break;
					}
					aInstance.information.avecModificationPublic = true;
					aInstance.surModificationDest();
				},
				getDisabled(aValeur) {
					switch (aValeur) {
						case "eleve_resp1":
							return (
								!aInstance.donneesEleve ||
								!aInstance.donneesEleve.nombreResponsablesPreferentiel
							);
						case "eleve_resp2":
							return (
								!aInstance.donneesEleve ||
								!aInstance.donneesEleve.nombreResponsablesSecondaires
							);
						case "eleve_pp":
							return (
								!aInstance.donneesEleve ||
								!aInstance.donneesEleve.nombreProfsPrincipaux
							);
						case "eleve_tuteurs":
							return (
								!aInstance.donneesEleve || !aInstance.donneesEleve.nombreTuteurs
							);
						default:
							return false;
					}
				},
			},
			surSaisieGenreResp: {
				getValue(aValeur) {
					switch (aValeur) {
						case "enfants":
							return aInstance.information.genresPublicEntite.contains(
								TypeGenreInternetIndividu.InternetIndividu_ParentEleve,
							);
						case "legaux":
							return aInstance.information.genresPublicEntite.contains(
								TypeGenreInternetIndividu.InternetIndividu_Parent,
							);
						default:
							break;
					}
				},
				setValue(aValeur) {
					switch (aValeur) {
						case "enfants":
							_modifierGenrePublicEntite.call(
								aInstance,
								TypeGenreInternetIndividu.InternetIndividu_ParentEleve,
								true,
							);
							_modifierGenrePublicEntite.call(
								aInstance,
								TypeGenreInternetIndividu.InternetIndividu_Parent,
								false,
							);
							break;
						case "legaux":
							_modifierGenrePublicEntite.call(
								aInstance,
								TypeGenreInternetIndividu.InternetIndividu_ParentEleve,
								false,
							);
							_modifierGenrePublicEntite.call(
								aInstance,
								TypeGenreInternetIndividu.InternetIndividu_Parent,
								true,
							);
							break;
						default:
							break;
					}
					aInstance.information.avecModificationPublic = true;
					aInstance.surModificationDest();
				},
				getDisabled(aValeur) {
					switch (aValeur) {
						case "enfants":
						case "legaux":
							return !(
								aInstance.information.genresPublicEntite.contains(
									TypeGenreInternetIndividu.InternetIndividu_ParentEleve,
								) ||
								aInstance.information.genresPublicEntite.contains(
									TypeGenreInternetIndividu.InternetIndividu_Parent,
								)
							);
						default:
							return false;
					}
				},
			},
			btnRessource: {
				event(aGenreRessouce) {
					_evntBouton.call(aInstance, aGenreRessouce);
				},
			},
		});
	}
	surModificationDest() {
		if (this.avecCallbckSurModification === true) {
			this.callback.appel();
		} else {
			this.information.setEtat(EGenreEtat.Modification);
		}
	}
	surSaisieGenreResp(aValeur) {
		switch (aValeur) {
			case "enfants":
				_modifierGenrePublicEntite.call(
					this,
					TypeGenreInternetIndividu.InternetIndividu_ParentEleve,
					true,
				);
				_modifierGenrePublicEntite.call(
					this,
					TypeGenreInternetIndividu.InternetIndividu_Parent,
					false,
				);
				break;
			case "legaux":
				_modifierGenrePublicEntite.call(
					this,
					TypeGenreInternetIndividu.InternetIndividu_ParentEleve,
					false,
				);
				_modifierGenrePublicEntite.call(
					this,
					TypeGenreInternetIndividu.InternetIndividu_Parent,
					true,
				);
				break;
			default:
				break;
		}
		this.information.avecModificationPublic = true;
		this.surModificationDest();
	}
	resetIndividus() {
		if (this.information) {
			this.information.listePublicIndividu = new ObjetListeElements();
			this.setCountIndividus();
		}
	}
	setCountIndividus(aParam) {
		const lSansFiltre =
			!aParam || aParam.avecFiltreGenresRessourceAffDestinataire !== true;
		const lTab = [
			EGenreRessource.Enseignant,
			EGenreRessource.Eleve,
			EGenreRessource.Responsable,
			EGenreRessource.Personnel,
			EGenreRessource.MaitreDeStage,
			EGenreRessource.InspecteurPedagogique,
		];
		let lCntTot = 0;
		const lNbr = lTab.length;
		for (let i = 0; i < lNbr; i++) {
			const lGenreRessource = lTab[i];
			const lCnt =
				this.information.listePublicIndividu.getNbrElementsExistes(
					lGenreRessource,
				);
			if (
				lSansFiltre ||
				this.estGenreInGenresRessourceAffDestinataire(lGenreRessource)
			) {
				const lDonneesEleve =
					lGenreRessource === EGenreRessource.Eleve
						? aParam &&
							aParam.donneesEleve !== null &&
							aParam.donneesEleve !== undefined
							? aParam.donneesEleve
							: null
						: null;
				_setCountDeGenreRessource.call(
					this,
					lCnt,
					lGenreRessource,
					lDonneesEleve,
				);
			}
			lCntTot += lCnt;
		}
		return lCntTot;
	}
	getHeightZoneDestinataires() {
		return this.height.zoneDestinataires;
	}
	construireAffichage() {
		return _compose.call(this);
	}
	construitBtnRessourceEntite() {
		const H = [];
		H.push(
			'<ie-bouton ie-model="btnRessource(',
			EGenreRessource.Aucune,
			')" class="',
			TypeThemeBouton.neutre,
			'" aria-labelledby="',
			this.id.labelEntite,
			'" aria-describedby="',
			this.id.countEntite,
			'">...</ie-bouton>',
		);
		return H.join("");
	}
	construitBtnRessourceResponsableAResponsable() {
		const H = [];
		H.push(
			'<ie-bouton ie-model="btnRessource(',
			EGenreRessource.Responsable,
			')" class="',
			TypeThemeBouton.neutre,
			'" aria-labelledby="',
			this.id.labelResponsableAResponsable,
			'" aria-describedby="',
			this.id.countResponsableAResponsable,
			'">...</ie-bouton>',
		);
		return H.join("");
	}
	construitBtnRessourceEleve() {
		const H = [];
		H.push(
			'<ie-bouton ie-model="btnRessource(',
			EGenreRessource.Eleve,
			')" class="',
			TypeThemeBouton.neutre,
			'" aria-labelledby="',
			this.id.labelEleve,
			'" aria-describedby="',
			this.id.countEleve,
			'">...</ie-bouton>',
		);
		return H.join("");
	}
	construitBtnRessourceEnseignant() {
		const H = [];
		H.push(
			'<ie-bouton ie-model="btnRessource(',
			EGenreRessource.Enseignant,
			')" class="',
			TypeThemeBouton.neutre,
			'" aria-labelledby="',
			this.id.labelProfesseur,
			'" aria-describedby="',
			this.id.countProfesseur,
			'">...</ie-bouton>',
		);
		return H.join("");
	}
	construitBtnRessourceResponsable() {
		const H = [];
		H.push(
			'<ie-bouton ie-model="btnRessource(',
			EGenreRessource.Responsable,
			')" class="',
			TypeThemeBouton.neutre,
			'" aria-labelledby="',
			this.id.labelResponsable,
			'" aria-describedby="',
			this.id.countResponsable,
			'">...</ie-bouton>',
		);
		return H.join("");
	}
	construitBtnRessourcePersonnel() {
		const H = [];
		H.push(
			'<ie-bouton ie-model="btnRessource(',
			EGenreRessource.Personnel,
			')" class="',
			TypeThemeBouton.neutre,
			'" aria-labelledby="',
			this.id.labelPersonnel,
			'" aria-describedby="',
			this.id.countPersonnel,
			'">...</ie-bouton>',
		);
		return H.join("");
	}
	construitBtnRessourceMaitreDeStage() {
		const H = [];
		H.push(
			'<ie-bouton ie-model="btnRessource(',
			EGenreRessource.MaitreDeStage,
			')" class="',
			TypeThemeBouton.neutre,
			'" aria-labelledby="',
			this.id.labelMaitreDeStage,
			'" aria-describedby="',
			this.id.countMaitreDeStage,
			'">...</ie-bouton>',
		);
		return H.join("");
	}
	construitBtnRessourceInspecteurPedagogique() {
		const H = [];
		H.push(
			'<ie-bouton ie-model="btnRessource(',
			EGenreRessource.InspecteurPedagogique,
			')" class="',
			TypeThemeBouton.neutre,
			'" aria-labelledby="',
			this.id.labelInspecteur,
			'" aria-describedby="',
			this.id.countInspecteur,
			'">...</ie-bouton>',
		);
		return H.join("");
	}
}
function _initialiserTabs(aInstance) {
	aInstance.setOptions({
		hauteur: this.hauteurTabOnglets,
		largeur: this.largeur - 10,
	});
}
function _getTraducCount(aGenreRessource, aSingulier) {
	switch (aGenreRessource) {
		case EGenreRessource.Classe:
			return aSingulier === true
				? GTraductions.getValeur("actualites.Classe")
				: GTraductions.getValeur("actualites.Classes");
		case EGenreRessource.Groupe:
			return aSingulier === true
				? GTraductions.getValeur("actualites.Groupe")
				: GTraductions.getValeur("actualites.Groupes");
		case EGenreRessource.Responsable:
			if (_estResponsableAResponsable.call(this)) {
				return GTraductions.getValeur("actualites.Classes");
			} else {
				return "";
			}
		default:
			return "";
	}
}
function _getIdCountRessource(aGenreRessource) {
	switch (aGenreRessource) {
		case EGenreRessource.Enseignant:
			return this.id.countProfesseur;
		case EGenreRessource.Responsable:
			if (_estResponsableAResponsable.call(this)) {
				return this.id.countResponsableAResponsable;
			} else {
				return this.id.countResponsable;
			}
		case EGenreRessource.Eleve:
			return this.id.countEleve;
		case EGenreRessource.Personnel:
			return this.id.countPersonnel;
		case EGenreRessource.MaitreDeStage:
			return this.id.countMaitreDeStage;
		case EGenreRessource.InspecteurPedagogique:
			return this.id.countInspecteur;
		case EGenreRessource.Classe:
		case EGenreRessource.Groupe:
			return this.id.countEntite;
		default:
			return "";
	}
}
function _getStrCount(aCnt, aGenreRessource, aParam) {
	if (
		[EGenreRessource.Classe, EGenreRessource.Groupe].includes(aGenreRessource)
	) {
		const lOnlyOne = aCnt === 1;
		const lTraduc = _getTraducCount.call(this, aGenreRessource, lOnlyOne);
		const lDetail = lOnlyOne
			? this.information.listePublicEntite.getLibelle(0) || aCnt
			: aCnt;
		return lTraduc + " (" + lDetail + ")";
	} else if (
		[EGenreRessource.Responsable].includes(aGenreRessource) &&
		_estResponsableAResponsable.call(this)
	) {
		const lTraduc = _getTraducCount.call(this, aGenreRessource);
		const lDetail =
			aCnt + " " + GTraductions.getValeur("actualites.public.responsables");
		return lTraduc + " (" + lDetail + ")";
	} else {
		if (
			!this.genresRessourceAffDestinataire ||
			this.genresRessourceAffDestinataire.length === 0
		) {
			return aCnt;
		} else {
			let lStr;
			if (aParam.forcerCmp === false && aCnt === 1) {
				const lIndice =
					this.information.listePublicIndividu.getIndiceElementParFiltre(
						(aElement) => {
							return aElement.getGenre() === aGenreRessource;
						},
					);
				lStr = this.information.listePublicIndividu.getLibelle(lIndice);
			} else {
				lStr = aCnt;
			}
			return aParam.avecParentheses === true ? " (" + lStr + ")" : lStr;
		}
	}
}
function _setCountRessource(aCnt, aGenreRessource) {
	const lId = _getIdCountRessource.call(this, aGenreRessource);
	const lForcerCompteur = aGenreRessource === EGenreRessource.Eleve;
	const lStr = _getStrCount.call(this, aCnt, aGenreRessource, {
		forcerCmp: lForcerCompteur,
		avecParentheses: true,
	});
	GHtml.setHtml(lId, lStr);
}
function _setCountCBRespEleve(aIdCB, aEstVisible, aStr) {
	const lJq = $("span[id='" + aIdCB.escapeJQ() + "']");
	if (aEstVisible) {
		lJq.html(aStr).parent().show();
	} else {
		lJq.parent().hide();
	}
}
function _setCountDeGenreRessource(aCnt, aGenreRessource, aParam) {
	if (aGenreRessource === EGenreRessource.Eleve) {
		_setCountEleve.call(this, aCnt, aParam);
	} else {
		_setCountRessource.call(this, aCnt, aGenreRessource);
	}
}
function _setCountEleve(aCnt, aDonnees) {
	_setCountRessource.call(this, aCnt, EGenreRessource.Eleve);
	if (
		this.genresRessourceAffDestinataire &&
		this.genresRessourceAffDestinataire.length !== 0 &&
		this.estGenreInGenresRessourceAffDestinataire(EGenreRessource.Eleve) &&
		aDonnees
	) {
		const lOnlyOne = aCnt === 1;
		let lStr, lEstVisible;
		lStr = lOnlyOne
			? _getStrCount.call(this, aCnt, EGenreRessource.Eleve, {
					forcerCmp: false,
					avecParentheses: false,
				})
			: GTraductions.getValeur("actualites.Eleves") + " (" + aCnt + ")";
		_setCountCBRespEleve.call(this, this.id.cbEleve, true, lStr);
		lEstVisible = true;
		lStr =
			GTraductions.getValeur("actualites.ResponsablePreferentiel") +
			" (" +
			(aDonnees.nombreResponsablesPreferentiel || 0) +
			")";
		_setCountCBRespEleve.call(
			this,
			this.id.cbEleveResponsable1,
			lEstVisible,
			lStr,
		);
		lEstVisible = true;
		lStr =
			GTraductions.getValeur("actualites.ResponsableNonPreferentiel") +
			" (" +
			(aDonnees.nombreResponsablesSecondaires || 0) +
			")";
		_setCountCBRespEleve.call(
			this,
			this.id.cbEleveResponsable2,
			lEstVisible,
			lStr,
		);
		lEstVisible = true;
		lStr =
			GTraductions.getValeur("actualites.ProfsPrincipaux") +
			" (" +
			(aDonnees.nombreProfsPrincipaux || 0) +
			")";
		_setCountCBRespEleve.call(
			this,
			this.id.cbEleveProfsPrincipaux,
			lEstVisible,
			lStr,
		);
		lEstVisible = true;
		lStr =
			GTraductions.getValeur("actualites.Tuteurs") +
			" (" +
			(aDonnees.nombreTuteurs || 0) +
			")";
		_setCountCBRespEleve.call(this, this.id.cbEleveTuteurs, lEstVisible, lStr);
	}
}
function _initPublic(aDonnees) {
	if (GEtatUtilisateur.pourPrimaire()) {
		if (this.choixResponsableParEntite) {
			this.information.genresPublicEntite.add(
				TypeGenreInternetIndividu.InternetIndividu_Parent,
			);
		}
	} else if (_estResponsableAResponsable.call(this)) {
		_evntListePublic.call(this, EGenreRessource.Responsable, true);
	} else {
		if (!GParametres.avecElevesRattaches) {
			$("#" + (this.id.cbPublicElevesRattaches + "_pere").escapeJQ()).hide();
		}
	}
	_actualiserCountDestinataires.call(this, aDonnees);
}
function _actualiserCountDestinataires(aDonneesEleve) {
	_setCountDestinataires.call(this, {
		avecIndividus: true,
		donneesEleve: aDonneesEleve,
		avecFiltreGenresRessourceAffDestinataire: true,
		estInit: true,
	});
}
function _setCountDestinataires(aParam) {
	if (GEtatUtilisateur.pourPrimaire()) {
		if (this.choixResponsableParEntite) {
			const lNbPublicEntite =
				this.information.listePublicEntite.getNbrElementsExistes();
			_setCountDeGenreRessource.call(
				this,
				lNbPublicEntite,
				EGenreRessource.Classe,
			);
		}
	} else {
		let lIndice, lNbr, lGenreRessource;
		const lTabEntites = [EGenreRessource.Classe, EGenreRessource.Groupe];
		const lCountRessource = [];
		for (lIndice = 0, lNbr = lTabEntites.length; lIndice < lNbr; lIndice++) {
			lGenreRessource = lTabEntites[lIndice];
			lCountRessource[lGenreRessource] =
				this.information.listePublicEntite.getNbrElementsExistes(
					lGenreRessource,
				);
		}
		this.listeOngletsDestinataires.setLibelle(
			0,
			GTraductions.getValeur("actualites.Edition.OngletEntite", [
				lCountRessource[EGenreRessource.Classe],
				lCountRessource[EGenreRessource.Groupe],
			]),
		);
		if (
			!this.genresRessourceAffDestinataire ||
			this.genresRessourceAffDestinataire.length === 0
		) {
			if (this.getInstance(this.identTabs) && !aParam.estInit) {
				this.getInstance(this.identTabs).setLibelleOngletDIndice(
					0,
					this.listeOngletsDestinataires.getLibelle(0),
				);
			}
		} else {
			for (lIndice = 0, lNbr = lTabEntites.length; lIndice < lNbr; lIndice++) {
				lGenreRessource = lTabEntites[lIndice];
				if (this.estGenreInGenresRessourceAffDestinataire(lGenreRessource)) {
					_setCountDeGenreRessource.call(
						this,
						lCountRessource[lGenreRessource],
						lGenreRessource,
					);
				}
			}
		}
	}
	if (aParam.avecIndividus === true) {
		let lParamIndividus;
		if (
			this.genresRessourceAffDestinataire.length !== 0 &&
			aParam.donneesEleve &&
			aParam.avecFiltreGenresRessourceAffDestinataire === true
		) {
			lParamIndividus = {
				donneesEleve: aParam.donneesEleve,
				avecFiltreGenresRessourceAffDestinataire:
					aParam.avecFiltreGenresRessourceAffDestinataire,
			};
		}
		const lTotal = this.setCountIndividus(lParamIndividus);
		if (
			!this.genresRessourceAffDestinataire ||
			this.genresRessourceAffDestinataire.length === 0
		) {
			this.listeOngletsDestinataires.setLibelle(
				1,
				GTraductions.getValeur("actualites.Edition.OngletIndividu", [lTotal]),
			);
			if (this.getInstance(this.identTabs) && !aParam.estInit) {
				this.getInstance(this.identTabs).setLibelleOngletDIndice(
					1,
					this.listeOngletsDestinataires.getLibelle(1),
				);
			}
		}
	}
	if (
		this.genresRessourceAffDestinataire.length === 0 &&
		aParam.estInit === true
	) {
		if (this.getInstance(this.identTabs)) {
			_setDonneesTabs.call(this);
		}
	}
}
function _getHeightDest(aGenreRessource) {
	let lHeight = 0;
	if (this.estGenreInGenresRessourceAffDestinataire(aGenreRessource)) {
		const lHauteurParDefaut = 29;
		const lHauteurPourLaCocheDirecteur = 19;
		switch (aGenreRessource) {
			case EGenreRessource.Eleve:
				lHeight = 46 + lHauteurParDefaut;
				break;
			case EGenreRessource.Personnel:
				lHeight = GEtatUtilisateur.pourPrimaire()
					? lHauteurParDefaut + lHauteurPourLaCocheDirecteur
					: lHauteurParDefaut;
				break;
			default:
				lHeight = lHauteurParDefaut;
				break;
		}
	}
	return lHeight;
}
function _resetDestinataires() {
	const lTailleInit = 21;
	let lHeight = lTailleInit;
	const lTab = [
		EGenreRessource.Eleve,
		EGenreRessource.Enseignant,
		EGenreRessource.Responsable,
		EGenreRessource.Personnel,
		EGenreRessource.MaitreDeStage,
		EGenreRessource.InspecteurPedagogique,
	];
	const lNbr = lTab.length;
	for (let i = 0; i < lNbr; i++) {
		const lGenreRessource = lTab[i];
		lHeight += _getHeightDest.call(this, lGenreRessource);
	}
	if (lHeight > lTailleInit) {
		this.height.zoneDestinataires = lHeight;
	}
	if (this.getInstance(this.identTabs)) {
		this.getInstance(this.identTabs).free();
	}
	GHtml.setHtml(this.id.destinataires, _composeDestinataires.call(this));
}
function _evntBouton(aGenre) {
	if (aGenre === EGenreRessource.Aucune) {
		_evntEntite.call(this);
	} else {
		_evntListePublic.call(this, aGenre, false);
	}
}
function _evntEntite() {
	const lInstance = this.getInstance(this.identFenetreClasses);
	const lEstPrimaire = GApplication.estPrimaire;
	if (!this.listeClassesGroupes) {
		let lParam = {
			avecClasse: true,
			avecGroupe: true,
			uniquementClasseEnseignee:
				GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur
					? !GApplication.droits.get(TypeDroits.communication.toutesClasses)
					: false,
		};
		if (lEstPrimaire) {
			lParam = {
				avecClasse: true,
				avecGroupe: true,
				avecClasseMultiNiveau: true,
				sansClasseDeRegroupement: true,
				uniquementClassePrincipal: false,
				uniquementClasseEnseignee:
					GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur
						? !GApplication.droits.get(TypeDroits.communication.toutesClasses)
						: false,
			};
		}
		this.listeClassesGroupes = GEtatUtilisateur.getListeClasses(lParam);
	}
	let lAvecCumul = !lEstPrimaire;
	let lTitre = lEstPrimaire
		? GTraductions.getValeur("fenetreSelectionClasseGroupe.titreClasses")
		: null;
	if (this.genresRessourceAffDestinataire.length > 0 && !lEstPrimaire) {
		if (this.estGenreInGenresRessourceAffDestinataire(EGenreRessource.Classe)) {
			this.listeClassesGroupes = this.listeClassesGroupes.getListeElements(
				(aElement) => {
					return aElement.getGenre() === EGenreRessource.Classe;
				},
			);
			if (lTitre === null) {
				lTitre = GTraductions.getValeur(
					"fenetreSelectionClasseGroupe.titreClasses",
				);
			}
		} else if (
			this.estGenreInGenresRessourceAffDestinataire(EGenreRessource.Groupe)
		) {
			this.listeClassesGroupes = this.listeClassesGroupes.getListeElements(
				(aElement) => {
					return aElement.getGenre() === EGenreRessource.Groupe;
				},
			);
			lAvecCumul = false;
			if (lTitre === null) {
				lTitre = GTraductions.getValeur(
					"fenetreSelectionClasseGroupe.titreGroupes",
				);
			}
		}
	}
	lInstance.setSelectionObligatoire(false);
	lInstance.setAvecCumul(lAvecCumul);
	lInstance.setDonnees({
		listeRessources: this.listeClassesGroupes,
		listeRessourcesSelectionnees: MethodesObjet.dupliquer(
			this.information.listePublicEntite,
		),
		titre: lTitre,
	});
}
function _estResponsableAResponsable() {
	return GEtatUtilisateur.GenreEspace === EGenreEspace.Parent;
}
function _evntListePublic(aGenre, aBloquerOuvertureFenetre) {
	const lEstResponsableAResponsable = _estResponsableAResponsable.call(this);
	const lParams = {
		genres: [aGenre],
		sansFiltreSurEleve: GApplication.droits.get(
			TypeDroits.communication.toutesClasses,
		),
		entreResponsables: lEstResponsableAResponsable,
		avecFonctionPersonnel: true,
	};
	if (lEstResponsableAResponsable) {
		lParams["avecFiltreDelegues"] = true;
	}
	new ObjetRequeteListePublics(
		this,
		_evntListePublicApresRequete.bind(this, aBloquerOuvertureFenetre),
	).lancerRequete(lParams);
}
function _evntListePublicApresRequete(aBloquerOuvertureFenetre, aDonnees) {
	const lListeComplet = aDonnees.listePublic;
	const lGenre = aDonnees.genres[0];
	let lListeSelection = _getListeDonneesSelectionnees.call(this, lGenre);
	if (aBloquerOuvertureFenetre === true) {
		if (
			_estResponsableAResponsable.call(this) &&
			lListeSelection &&
			lListeSelection.count() === 0 &&
			this.information.listePublicIndividu.count() === 0
		) {
			let lClasse = null;
			let lClasseUnique = true;
			lListeComplet.parcourir((aElt) => {
				if (aElt.classes && aElt.classes.count() === 1) {
					const lClasseCourante = aElt.classes.get(0);
					if (lClasse === null) {
						lClasse = lClasseCourante;
					} else {
						if (lClasse.getNumero() !== lClasseCourante.getNumero()) {
							lClasseUnique = false;
						}
					}
				} else {
					lClasseUnique = false;
				}
			});
			if (lClasseUnique === true) {
				lListeSelection = lListeComplet.getListeElements();
				this.information.listePublicIndividu = lListeSelection;
				_evenementApresFenetreIndividu.call(
					this,
					EGenreRessource.Responsable,
					this.information.listePublicIndividu,
					1,
				);
			}
		}
		return;
	}
	_evntDeclencherFenetreRessource.call(this, {
		listeComplet: lListeComplet,
		listeSelectionnee: lListeSelection,
		genre: lGenre,
		genreCumul: getCumulPourFenetrePublic(
			lGenre,
			aDonnees.checked,
			aDonnees.listePublic.count(),
		),
		listePartiel: this.listePartiel,
		listeServicesPeriscolaire: aDonnees.listeServicesPeriscolaire,
		listeFamilles: aDonnees.listeFamilles,
		listeProjetsAcc: aDonnees.listeProjetsAcc,
		listeNiveauxResponsabilite: aDonnees.listeNiveauxResponsabilite,
	});
}
function _getListeDonneesSelectionnees(aGenre) {
	return this.information.listePublicIndividu.getListeElements((aElement) => {
		return aElement.getGenre() === aGenre;
	});
}
function _evntDeclencherFenetreRessource(aDonnees) {
	const lInstance = this.getInstance(this.identFenetreSelectPublic);
	if (
		aDonnees.genre === EGenreRessource.Eleve ||
		aDonnees.genre === EGenreRessource.Responsable
	) {
		const lListeCumuls = new ObjetListeElements();
		lListeCumuls.addElement(
			new ObjetElement(
				GTraductions.getValeur("actualites.Cumul.Classe"),
				0,
				TypeGenreCumulSelectionPublic.classe,
				0,
			),
		);
		lListeCumuls.addElement(
			new ObjetElement(
				GTraductions.getValeur("actualites.Cumul.Groupe"),
				0,
				TypeGenreCumulSelectionPublic.groupe,
				1,
			),
		);
		lListeCumuls.addElement(
			new ObjetElement(
				GTraductions.getValeur("actualites.Cumul.Alphabetique"),
				0,
				TypeGenreCumulSelectionPublic.initial,
				2,
			),
		);
		if (aDonnees.genre === EGenreRessource.Responsable) {
			lListeCumuls.addElement(
				new ObjetElement(
					GTraductions.getValeur("actualites.Cumul.NomDesEleves"),
					0,
					TypeGenreCumulSelectionPublic.nomEleves,
				),
			);
		}
		if (aDonnees.listeServicesPeriscolaire) {
			lListeCumuls.addElement(
				new ObjetElement(
					GTraductions.getValeur("actualites.Cumul.ServicesPeriscolaire"),
					0,
					TypeGenreCumulSelectionPublic.servicesPeriscolaire,
				),
			);
			if (
				[
					EGenreEspace.PrimPeriscolaire,
					EGenreEspace.Mobile_PrimPeriscolaire,
				].includes(GEtatUtilisateur.GenreEspace)
			) {
				aDonnees.genreCumul =
					TypeGenreCumulSelectionPublic.servicesPeriscolaire;
			}
		}
		if (aDonnees.listeProjetsAcc) {
			lListeCumuls.addElement(
				new ObjetElement(
					GTraductions.getValeur("actualites.Cumul.ProjetsAccompagnement"),
					0,
					TypeGenreCumulSelectionPublic.projetsAccompagnement,
				),
			);
		}
		if (aDonnees.listeFamilles) {
			aDonnees.listeFamilles.parcourir((aFamille) => {
				const lFiltreFamille = new ObjetElement(
					aFamille.getLibelle(),
					0,
					TypeGenreCumulSelectionPublic.famille,
				);
				lFiltreFamille.famille = aFamille;
				lListeCumuls.addElement(lFiltreFamille);
			});
		}
		lInstance.setListeCumuls(lListeCumuls);
		lInstance.setOptionsFenetreSelectionRessource({
			avecBarreTitre: true,
			avecFiltreDelegues: _estResponsableAResponsable.call(this),
		});
	}
	if (aDonnees.genre === EGenreRessource.Personnel) {
		const lListeCumuls = new ObjetListeElements();
		lListeCumuls.add(
			new ObjetElement(
				GTraductions.getValeur("Fenetre_SelectionPublic.Cumul.Aucun"),
				0,
				TypeGenreCumulSelectionPublic.sans,
				0,
			),
		);
		lListeCumuls.add(
			new ObjetElement(
				GTraductions.getValeur("actualites.Cumul.Fonction"),
				0,
				TypeGenreCumulSelectionPublic.fonction,
				1,
			),
		);
		lInstance.setListeCumuls(lListeCumuls);
		lInstance.setOptions({
			getInfosSuppZonePrincipale(aParams) {
				return lInstance.getGenreCumul() !==
					TypeGenreCumulSelectionPublic.fonction
					? UtilitaireMessagerie.getLibelleSuppListePublics(aParams.article)
					: "";
			},
		});
	}
	if (
		[
			EGenreRessource.Enseignant,
			EGenreRessource.Responsable,
			EGenreRessource.Eleve,
		].includes(aDonnees.genre)
	) {
		lInstance.setOptions({
			getInfosSuppZonePrincipale(aParams) {
				return UtilitaireListePublics.getLibelleSuppListePublics(
					aParams.article,
				);
			},
		});
	}
	lInstance.setSelectionObligatoire(false);
	if (aDonnees.genreCumul) {
		lInstance.setGenreCumulActif(aDonnees.genreCumul);
	}
	const lListePartiel = aDonnees.listePartiel;
	const lFiltres = [];
	if (lListePartiel && aDonnees.genre === EGenreRessource.Enseignant) {
		aDonnees.listeComplet.parcourir((aElement) => {
			const lNumero = aElement.getNumero();
			aElement.estMembreEquipe =
				lListePartiel.getIndiceElementParFiltre((aElement) => {
					return aElement.getNumero() === lNumero;
				}) > -1;
		});
		lFiltres.push({
			libelle: GTraductions.getValeur("actualites.filtre.equipePedagogique"),
			filtre: function (aElement, aChecked) {
				return aChecked ? aElement.estMembreEquipe : true;
			},
			checked: false,
		});
	}
	lInstance.setOptions({
		filtres: lFiltres,
		avecCocheRessources: true,
		avecBoutonRechercher: !_estResponsableAResponsable.call(this),
	});
	lInstance.setDonnees({
		listeRessources: aDonnees.listeComplet,
		listeRessourcesSelectionnees: MethodesObjet.dupliquer(
			aDonnees.listeSelectionnee,
		),
		genreRessource: aDonnees.genre,
		titre: _estResponsableAResponsable.call(this)
			? GTraductions.getValeur("Fenetre_SelectionRessource.CocherClasses")
			: EGenreRessourceUtil.getTitreFenetreSelectionRessource(aDonnees.genre),
		estGenreRessourceDUtilisateurConnecte:
			EGenreRessourceUtil.correspondAuGenreUtilisateurEspaceCourant(
				aDonnees.genre,
			),
		listeNiveauxResponsabilite: aDonnees.listeNiveauxResponsabilite,
	});
}
function _evenementSurBoutonListeDiffusion() {
	if (
		!this.listesDiffusion &&
		GCache &&
		GCache.general.existeDonnee("listeDiffusion")
	) {
		this.listesDiffusion = GCache.general.getDonnee("listeDiffusion");
	}
	if (!this.listesDiffusion) {
		new ObjetRequeteListeDiffusion(
			this,
			_actionApresRequeteListeDiffusion,
		).lancerRequete();
	} else {
		_ouvrirSelecteurListeDiffusion.call(this);
	}
}
function _actionApresRequeteListeDiffusion(aJSON) {
	if (aJSON && aJSON.liste) {
		this.listesDiffusion = aJSON.liste;
		if (GCache) {
			GCache.general.setDonnee("listeDiffusion", aJSON.liste);
		}
		_ouvrirSelecteurListeDiffusion.call(this);
	}
}
function _ouvrirSelecteurListeDiffusion() {
	this.listesDiffusion.parcourir((aElement) => {
		aElement.cmsActif = false;
	});
	this.getInstance(this.identFenetreSelectListeDiffusion).setDonnees(
		new DonneesListe_SelectionDiffusion(this.listesDiffusion),
	);
}
function _viderPublic() {
	this.information.genresPublicEntite.clear();
	this.information.listePublicEntite = new ObjetListeElements();
	this.information.listePublicIndividu = new ObjetListeElements();
	_actualiserPublic.call(this);
}
function _actualiserPublic() {
	_setCountDestinataires.call(this, { avecIndividus: true });
	this.information.avecModificationPublic = true;
	this.surModificationDest();
}
function _evenementSurTab(aElement) {
	$("#" + this.id.panelDestinataireEntite.escapeJQ()).hide();
	$("#" + this.id.panelDestinataireIndividuel.escapeJQ()).hide();
	$("#" + this.id.panelDestinataireResponsables.escapeJQ()).hide();
	switch (aElement.getGenre()) {
		case this.TypeOnglet.entite:
			$("#" + this.id.panelDestinataireEntite.escapeJQ()).show();
			break;
		case this.TypeOnglet.individuel:
			$("#" + this.id.panelDestinataireIndividuel.escapeJQ()).show();
			break;
		case this.TypeOnglet.entreResponsables:
			$("#" + this.id.panelDestinataireResponsables.escapeJQ()).show();
			break;
	}
}
function _existesDestinataires(aInformation) {
	let lResult = false;
	lResult =
		aInformation.genresPublicEntite.count() > 0 ||
		aInformation.listePublicEntite.getNbrElementsExistes() > 0 ||
		aInformation.listePublicIndividu.getNbrElementsExistes() > 0;
	return lResult;
}
function _evenementFenetreClasses(
	aGenreRessource,
	aListeRessourcesSelectionnees,
	aNumeroBouton,
) {
	if (aNumeroBouton === 1) {
		this.information.listePublicEntite = aListeRessourcesSelectionnees;
		_setCountDestinataires.call(this, { avecIndividus: false });
		this.information.avecModificationPublic = true;
		this.surModificationDest();
	}
}
function _evenementFenetreIndividu(
	aGenreRessource,
	aListeRessourcesSelectionnees,
	aNumeroBouton,
) {
	if (aGenreRessource === EGenreRessource.Eleve) {
		new ObjetRequeteDonneesEditionInformation(
			this,
			_evenementApresFenetreIndividu.bind(
				this,
				aGenreRessource,
				aListeRessourcesSelectionnees,
				aNumeroBouton,
			),
		).lancerRequete({
			avecPublic: true,
			listePublic: aListeRessourcesSelectionnees,
		});
	} else {
		_evenementApresFenetreIndividu.call(
			this,
			aGenreRessource,
			aListeRessourcesSelectionnees,
			aNumeroBouton,
		);
	}
}
function _evenementApresFenetreIndividu(
	aGenreRessource,
	aListeRessourcesSelectionnees,
	aNumeroBouton,
	aDonnees,
) {
	const lAutrePublicIndividu =
		this.information.listePublicIndividu.getListeElements((aElement) => {
			return aElement.getGenre() !== aGenreRessource;
		});
	if (aNumeroBouton === 1) {
		this.information.listePublicIndividu = lAutrePublicIndividu;
		this.information.listePublicIndividu.add(
			MethodesObjet.dupliquer(aListeRessourcesSelectionnees),
		);
		const lTotal = this.setCountIndividus({ donneesEleve: aDonnees });
		if (
			!this.genresRessourceAffDestinataire ||
			this.genresRessourceAffDestinataire.length === 0
		) {
			this.listeOngletsDestinataires.setLibelle(
				1,
				GTraductions.getValeur("actualites.Edition.OngletIndividu", [lTotal]),
			);
			if (this.getInstance(this.identTabs)) {
				this.getInstance(this.identTabs).setLibelleOngletDIndice(
					1,
					this.listeOngletsDestinataires.getLibelle(1),
				);
			}
		}
		this.information.avecModificationPublic = true;
		this.surModificationDest();
	}
}
function _evenementFenetreListeDiffusion(aGenreBouton) {
	if (aGenreBouton === 1) {
		const lDiffusions = this.listesDiffusion.getListeElements((aElement) => {
			return !!aElement.cmsActif;
		});
		if (lDiffusions.count() > 0) {
			const lListe = MethodesObjet.dupliquer(
				this.information.listePublicIndividu,
			);
			for (let i = 0; i < lDiffusions.count(); i++) {
				const lDiffusion = lDiffusions.get(i);
				lDiffusion.listePublicIndividu.parcourir((aElement) => {
					const lIndice = lListe.getIndiceParElement(aElement);
					if (lIndice === null || lIndice === undefined) {
						lListe.addElement(MethodesObjet.dupliquer(aElement));
					}
				});
			}
			this.information.listePublicIndividu = lListe;
			_actualiserPublic.call(this);
		}
	}
}
function _setDonneesTabs(aParam) {
	const lTabs = this.getInstance(this.identTabs);
	const lIndicePrec = lTabs.getIndiceOngletSelectionne();
	lTabs.setDonnees(this.listeOngletsDestinataires);
	let lIndiceSelect = _estResponsableAResponsable.call(this) ? 2 : 0;
	if (
		aParam !== null &&
		aParam !== undefined &&
		aParam.conserverSelection === true
	) {
		if (
			lIndicePrec !== lIndiceSelect &&
			lTabs.estOngletDIndiceVisible(lIndicePrec)
		) {
			lIndiceSelect = lIndicePrec;
		}
	}
	lTabs.selectOnglet(lIndiceSelect);
}
function _modifierGenrePublicEntite(aGenre, aChecked) {
	const lExists = this.information.genresPublicEntite.contains(aGenre);
	if (aChecked) {
		if (!lExists) {
			this.information.genresPublicEntite.add(aGenre);
		}
	} else {
		if (lExists) {
			this.information.genresPublicEntite.remove(aGenre);
		}
	}
	this.information.avecModificationPublic = true;
}
function _composePanelDestinatairesPrimaire() {
	const T = [];
	const lWidthLibelle = 180;
	const lAvecTousLesBtns = this.genresRessourceAffDestinataire.length === 0;
	if (
		lAvecTousLesBtns ||
		this.genresRessourceAffDestinataire.includes(EGenreRessource.Responsable)
	) {
		if (this.choixResponsableParEntite) {
			T.push(
				"<div>",
				'<span class="InlineBlock AlignementDroit" style="width:',
				lWidthLibelle,
				'px;" id="',
				this.id.labelEntite,
				'">',
				GTraductions.getValeur("actualites.ResponsablesPrimaire"),
				"</span>",
				'<div class="InlineBlock Texte10 EspaceGauche EspaceDroit">',
				this.construitBtnRessourceEntite(),
				"</div>",
				'<div class="InlineBlock Texte10 EspaceGauche PetitEspaceHaut" id="',
				this.id.countEntite,
				'"></div>',
				"</div>",
			);
		} else {
			T.push(
				"<div>",
				'<span class="InlineBlock AlignementDroit" style="width:',
				lWidthLibelle,
				'px;" id="',
				this.id.labelResponsable,
				'">',
				GTraductions.getValeur("actualites.Responsables"),
				"</span>",
				'<div class="InlineBlock Texte10 EspaceGauche EspaceDroit">',
				this.construitBtnRessourceResponsable(),
				"</div>",
				'<div class="InlineBlock Texte10 EspaceGauche PetitEspaceHaut" id="',
				this.id.countResponsable,
				'"></div>',
				"</div>",
			);
		}
	}
	if (
		lAvecTousLesBtns ||
		this.genresRessourceAffDestinataire.includes(EGenreRessource.Enseignant)
	) {
		T.push(
			'<div class="EspaceHaut">',
			'<span class="InlineBlock AlignementDroit" style="width:',
			lWidthLibelle,
			'px;" id="',
			this.id.labelProfesseur,
			'">',
			GTraductions.getValeur("actualites.Professeurs"),
			"</span>",
			'<div class="InlineBlock Texte10 EspaceGauche EspaceDroit">',
			this.construitBtnRessourceEnseignant(),
			"</div>",
			'<div class="InlineBlock Texte10 EspaceGauche PetitEspaceHaut" id="',
			this.id.countProfesseur,
			'"></div>',
			"</div>",
		);
	}
	if (
		lAvecTousLesBtns ||
		this.genresRessourceAffDestinataire.includes(EGenreRessource.Personnel)
	) {
		T.push(
			'<div class="EspaceHaut">',
			'<div class="InlineBlock AlignementDroit" style="',
			GStyle.composeWidth(lWidthLibelle),
			'" id="',
			this.id.labelPersonnel,
			'">',
			GTraductions.getValeur("actualites.Personnels"),
			"</div>",
			'<div class="InlineBlock EspaceGauche EspaceDroit">',
			this.construitBtnRessourcePersonnel(),
			"</div>",
			'<div class="InlineBlock EspaceGauche PetitEspaceHaut" style="min-width : 20px;" id="',
			this.id.countPersonnel,
			'">0</div>',
			"</div>",
		);
		T.push(
			'<div class="EspaceHaut">',
			'<div class="InlineBlock AlignementDroit" style="width:',
			lWidthLibelle,
			'px;">',
			"<ie-checkbox ie-model=\"surSaisiePublic('directeur')\">",
			GTraductions.getValeur("actualites.Directeur"),
			"</ie-checkbox>",
			"</div>",
			"</div>",
		);
	}
	return T.join("");
}
function _composePanelEntite() {
	const T = [];
	T.push(
		'<div class="NoWrap">',
		'<div class="InlineBlock AlignementMilieuVertical EspaceGauche" id="',
		this.id.labelEntite,
		'">',
		GTraductions.getValeur("actualites.Classes"),
		" ",
		GTraductions.getValeur("actualites.Groupes"),
		"</div>",
		'<div class="InlineBlock AlignementMilieuVertical EspaceGauche EspaceDroit">',
		this.construitBtnRessourceEntite(),
		"</div>",
		'<div class="InlineBlock AlignementMilieuVertical EspaceGauche" id="',
		this.id.cbPublicElevesRattaches,
		'_pere"><div style="display:flex; align-items:center">',
		"<ie-checkbox ie-model=\"surSaisiePublic('rattaches')\">",
		GTraductions.getValeur("actualites.public.elevesRattaches"),
		"</ie-checkbox>",
		"</div></div>",
		"</div>",
	);
	T.push('<div class="flex-contain">');
	T.push('<div class="flex-contain cols GrandEspaceGauche">');
	T.push(
		'<div class="Texte10 EspaceHaut" style="display:flex; align-items:center">',
		"<ie-checkbox ie-model=\"surSaisiePublic('responsables')\">",
		GTraductions.getValeur("actualites.public.responsables"),
		"</ie-checkbox>",
		"</div>",
		'<div class="Texte10 PetitEspaceGauche p-top" title="',
		GTraductions.getValeur("actualites.public.hintrelatifAuxEnfants"),
		'" style="display:flex; align-items:center">',
		"<ie-radio ie-model=\"surSaisieGenreResp('enfants')\">",
		GTraductions.getValeur("actualites.public.relatifAuxEnfants"),
		"</ie-radio>",
		"</div>",
		'<div class="Texte10 PetitEspaceGauche p-top-s" title="',
		GTraductions.getValeur("actualites.public.hintresponsablesLegaux"),
		'" style="display:flex; align-items:center">',
		"<ie-radio ie-model=\"surSaisieGenreResp('legaux')\">",
		GTraductions.getValeur("actualites.public.responsablesLegaux"),
		"</ie-radio>",
		"</div>",
	);
	T.push("</div>");
	T.push('<div class="InlineBlock AlignementHaut GrandEspaceGauche">');
	T.push(
		GApplication.droits.get(TypeDroits.fonctionnalites.gestionEleves)
			? '<div class="Texte10 EspaceHaut" style="display:flex; align-items:center"><ie-checkbox ie-model="surSaisiePublic(\'eleves\')">' +
					GTraductions.getValeur("actualites.public.eleves") +
					"</ie-checkbox></div>"
			: "",
	);
	T.push(
		'<div class="Texte10 EspaceHaut" style="display:flex; align-items:center"><ie-checkbox ie-model="surSaisiePublic(\'professeurs\')">',
		GTraductions.getValeur("actualites.public.professeurs"),
		"</ie-checkbox></div>",
	);
	T.push("</div>");
	T.push('<div class="InlineBlock AlignementHaut GrandEspaceGauche">');
	T.push(
		GApplication.droits.get(TypeDroits.fonctionnalites.gestionPersonnels)
			? '<div class="Texte10 EspaceHaut" style="display:flex; align-items:center"><ie-checkbox ie-model="surSaisiePublic(\'personnels\')">' +
					GTraductions.getValeur("actualites.public.personnels") +
					"</ie-checkbox></div>"
			: "",
	);
	T.push(
		GApplication.droits.get(TypeDroits.fonctionnalites.gestionStages)
			? '<div class="Texte10 EspaceHaut" style="display:flex; align-items:center"><ie-checkbox ie-model="surSaisiePublic(\'maitreDeStage\')">' +
					GTraductions.getValeur("actualites.public.maitreDeStage") +
					"</ie-checkbox></div>"
			: "",
	);
	T.push("</div>");
	T.push("</div>");
	return T.join("");
}
function _composePanelResponsables() {
	const T = [];
	const lStrLabel = GTraductions.getValeur("actualites.ResponsablesPrimaire");
	T.push(
		'<div class="EspaceHaut NoWrap">',
		'<div class="InlineBlock AlignementMilieuVertical" id="',
		this.id.labelResponsableAResponsable,
		'">',
		lStrLabel,
		"</div>",
		'<div class="InlineBlock AlignementMilieuVertical EspaceGauche EspaceDroit">',
		this.construitBtnRessourceResponsableAResponsable(),
		"</div>",
		'<div class="InlineBlock AlignementMilieuVertical" id="',
		this.id.countResponsableAResponsable,
		'"></div>',
		"</div>",
	);
	return T.join("");
}
function _composePanelClasseGroupe() {
	const T = [];
	T.push(
		'<div class="NoWrap">',
		'<div class="InlineBlock AlignementMilieuVertical EspaceGauche10">',
		this.construitBtnRessourceEntite(),
		"</div>",
		'<div class="InlineBlock AlignementMilieuVertical EspaceGauche" id="',
		this.id.countEntite,
		'"></div>',
		'<div class="InlineBlock AlignementMilieuVertical EspaceGauche" id="',
		this.id.cbPublicElevesRattaches,
		'_pere">',
		"<ie-checkbox ie-model=\"surSaisiePublic('rattaches')\">",
		GTraductions.getValeur("actualites.public.elevesRattaches"),
		"</ie-checkbox>",
		"</div>",
		"</div>",
	);
	T.push('<div class="PetitEspaceHaut NoWrap">');
	T.push('<div class="InlineBlock AlignementHaut EspaceGauche10">');
	T.push(
		'<div class="EspaceHaut">',
		"<ie-checkbox ie-model=\"surSaisiePublic('responsables')\">",
		GTraductions.getValeur("actualites.public.responsables"),
		"</ie-checkbox>",
		"</div>",
	);
	if (GApplication.droits.get(TypeDroits.fonctionnalites.gestionEleves)) {
		T.push(
			'<div class="EspaceHaut"><ie-checkbox ie-model="surSaisiePublic(\'eleves\')">',
			GTraductions.getValeur("actualites.public.eleves"),
			"</ie-checkbox></div>",
		);
	}
	T.push("</div>");
	T.push('<div class="InlineBlock AlignementHaut GrandEspaceGauche">');
	T.push(
		'<div class="EspaceHaut"><ie-checkbox ie-model="surSaisiePublic(\'professeurs\')">',
		GTraductions.getValeur("actualites.public.professeurs"),
		"</ie-checkbox></div>",
	);
	if (GApplication.droits.get(TypeDroits.fonctionnalites.gestionPersonnels)) {
		T.push(
			'<div class="EspaceHaut"><ie-checkbox ie-model="surSaisiePublic(\'personnels\')">',
			GTraductions.getValeur("actualites.public.personnels"),
			"</ie-checkbox></div>",
		);
	}
	T.push("</div>");
	if (GApplication.droits.get(TypeDroits.fonctionnalites.gestionStages)) {
		T.push(
			'<div class="InlineBlock AlignementHaut GrandEspaceGauche">',
			'<div class="EspaceHaut"><ie-checkbox ie-model="surSaisiePublic(\'maitreDeStage\')">',
			GTraductions.getValeur("actualites.public.maitreDeStage"),
			"</ie-checkbox></div>",
			"</div>",
		);
	}
	T.push("</div>");
	return T.join("");
}
function _composePanelIndividu() {
	const T = [];
	const lEleve = GTraductions.getValeur("actualites.Eleves");
	const lProf = GTraductions.getValeur("actualites.Professeurs");
	let lWidthA = GChaine.getLongueurChaineDansDiv(lEleve, 10, false);
	let lWidthB = GChaine.getLongueurChaineDansDiv(lProf, 10, false);
	const lWidth1 = lWidthA > lWidthB ? lWidthA + 5 : lWidthB + 5;
	const lResp = GTraductions.getValeur("actualites.Responsables");
	const lPers = GTraductions.getValeur("actualites.Personnels");
	lWidthA = GChaine.getLongueurChaineDansDiv(lResp, 10, false);
	lWidthB = GChaine.getLongueurChaineDansDiv(lPers, 10, false);
	const lWidth2 = lWidthA > lWidthB ? lWidthA + 5 : lWidthB + 5;
	const lMDS = GTraductions.getValeur("actualites.MaitresDeStage");
	const lInsp = GTraductions.getValeur("actualites.Inspecteurs");
	lWidthA = GChaine.getLongueurChaineDansDiv(lMDS, 10, false);
	lWidthB = GChaine.getLongueurChaineDansDiv(lInsp, 10, false);
	const lWidth3 = lWidthA > lWidthB ? lWidthA + 5 : lWidthB + 5;
	T.push('<div class="NoWrap p-all-s">');
	T.push(
		'<div class="InlineBlock AlignementHaut EspaceGauche GrandEspaceDroit">',
	);
	if (GApplication.droits.get(TypeDroits.fonctionnalites.gestionEleves)) {
		T.push(
			'<div class="NoWrap EspaceBas">',
			'<div class="InlineBlock AlignementMilieuVertical AlignementDroit" style="',
			GStyle.composeWidth(lWidth1),
			'" id="',
			this.id.labelEleve,
			'">',
			lEleve,
			"</div>",
			'<div class="InlineBlock AlignementMilieuVertical EspaceGauche">',
			this.construitBtnRessourceEleve(),
			"</div>",
			'<div class="InlineBlock AlignementMilieuVertical EspaceGauche" style="min-width: 20px;" id="',
			this.id.countEleve,
			'">0</div>',
			"</div>",
		);
	}
	T.push(
		'<div class="NoWrap">',
		'<div class="InlineBlock AlignementMilieuVertical AlignementDroit" style="',
		GStyle.composeWidth(lWidth1),
		'" id="',
		this.id.labelProfesseur,
		'">',
		lProf,
		"</div>",
		'<div class="InlineBlock AlignementMilieuVertical EspaceGauche">',
		this.construitBtnRessourceEnseignant(),
		"</div>",
		'<div class="InlineBlock AlignementMilieuVertical EspaceGauche" style="min-width: 20px;" id="',
		this.id.countProfesseur,
		'">0</div>',
		"</div>",
	);
	T.push("</div>");
	T.push(
		'<div class="InlineBlock AlignementHaut GrandEspaceGauche GrandEspaceDroit">',
	);
	T.push(
		'<div class="NoWrap EspaceBas">',
		'<div class="InlineBlock AlignementMilieuVertical AlignementDroit" style="',
		GStyle.composeWidth(lWidth2),
		'" id="',
		this.id.labelResponsable,
		'">',
		lResp,
		"</div>",
		'<div class="InlineBlock AlignementMilieuVertical EspaceGauche">',
		this.construitBtnRessourceResponsable(),
		"</div>",
		'<div class="InlineBlock AlignementMilieuVertical EspaceGauche" style="min-width: 20px;" id="',
		this.id.countResponsable,
		'">0</div>',
		"</div>",
	);
	if (GApplication.droits.get(TypeDroits.fonctionnalites.gestionPersonnels)) {
		T.push(
			'<div class="NoWrap">',
			'<div class="InlineBlock AlignementMilieuVertical AlignementDroit" style="',
			GStyle.composeWidth(lWidth2),
			'" id="',
			this.id.labelPersonnel,
			'">',
			lPers,
			"</div>",
			'<div class="InlineBlock AlignementMilieuVertical EspaceGauche">',
			this.construitBtnRessourcePersonnel(),
			"</div>",
			'<div class="InlineBlock AlignementMilieuVertical EspaceGauche" style="min-width: 20px;" id="',
			this.id.countPersonnel,
			'">0</div>',
			"</div>",
		);
	}
	T.push("</div>");
	T.push('<div class="InlineBlock AlignementHaut GrandEspaceGauche">');
	if (GApplication.droits.get(TypeDroits.fonctionnalites.gestionStages)) {
		T.push(
			'<div class="NoWrap EspaceBas">',
			'<div class="InlineBlock AlignementMilieuVertical AlignementDroit" style="',
			GStyle.composeWidth(lWidth3),
			'" id="',
			this.id.labelMaitreDeStage,
			'">',
			lMDS,
			"</div>",
			'<div class="InlineBlock AlignementMilieuVertical EspaceGauche">',
			this.construitBtnRessourceMaitreDeStage(),
			"</div>",
			'<div class="InlineBlock AlignementMilieuVertical EspaceGauche" style="min-width: 20px;" id="',
			this.id.countMaitreDeStage,
			'">0</div>',
			"</div>",
		);
	}
	if (GApplication.droits.get(TypeDroits.fonctionnalites.gestionIPR)) {
		T.push(
			'<div class="NoWrap">',
			'<div class="InlineBlock AlignementMilieuVertical AlignementDroit" style="',
			GStyle.composeWidth(lWidth3),
			'" id="',
			this.id.labelInspecteur,
			'">',
			lInsp,
			"</div>",
			'<div class="InlineBlock AlignementMilieuVertical EspaceGauche">',
			this.construitBtnRessourceInspecteurPedagogique(),
			"</div>",
			'<div class="InlineBlock AlignementMilieuVertical EspaceGauche" style="min-width: 20px;" id="',
			this.id.countInspecteur,
			'">0</div>',
			"</div>",
		);
	}
	T.push("</div>", "</div>");
	return T.join("");
}
function _composePanelIndividuSimple(aGenres) {
	const T = [];
	let lAvecDroitFonctionnel = true;
	let lTraduction, lIDLabel, lStrBouton, lIDCount;
	const lTailleLibelle = 90;
	for (const i in aGenres) {
		const lGenre = aGenres[i];
		switch (lGenre) {
			case EGenreRessource.Enseignant:
				lAvecDroitFonctionnel = true;
				lTraduction = GTraductions.getValeur("actualites.Professeurs");
				lIDLabel = this.id.labelProfesseur;
				lStrBouton = this.construitBtnRessourceEnseignant();
				lIDCount = this.id.countProfesseur;
				break;
			case EGenreRessource.Eleve:
				lAvecDroitFonctionnel = GApplication.droits.get(
					TypeDroits.fonctionnalites.gestionEleves,
				);
				lTraduction = GTraductions.getValeur("actualites.Eleves");
				lIDLabel = this.id.labelEleve;
				lStrBouton = this.construitBtnRessourceEleve();
				lIDCount = this.id.countEleve;
				break;
			case EGenreRessource.Responsable:
				lAvecDroitFonctionnel = true;
				lTraduction = GTraductions.getValeur("actualites.Responsables");
				lIDLabel = this.id.labelResponsable;
				lStrBouton = this.construitBtnRessourceResponsable();
				lIDCount = this.id.countResponsable;
				break;
			case EGenreRessource.Personnel:
				lAvecDroitFonctionnel = GApplication.droits.get(
					TypeDroits.fonctionnalites.gestionPersonnels,
				);
				lTraduction = GTraductions.getValeur("actualites.Personnels");
				lIDLabel = this.id.labelPersonnel;
				lStrBouton = this.construitBtnRessourcePersonnel();
				lIDCount = this.id.countPersonnel;
				break;
			case EGenreRessource.MaitreDeStage:
				lAvecDroitFonctionnel = GApplication.droits.get(
					TypeDroits.fonctionnalites.gestionStages,
				);
				lTraduction = GTraductions.getValeur("actualites.MaitresDeStage");
				lIDLabel = this.id.labelMaitreDeStage;
				lStrBouton = this.construitBtnRessourceMaitreDeStage();
				lIDCount = this.id.countMaitreDeStage;
				break;
			case EGenreRessource.InspecteurPedagogique:
				lAvecDroitFonctionnel = GApplication.droits.get(
					TypeDroits.fonctionnalites.gestionIPR,
				);
				lTraduction = GTraductions.getValeur("actualites.Inspecteurs");
				lIDLabel = this.id.labelInspecteur;
				lStrBouton = this.construitBtnRessourceInspecteurPedagogique();
				lIDCount = this.id.countInspecteur;
				break;
			default:
				break;
		}
		if (lAvecDroitFonctionnel) {
			T.push(
				'<div class="flex-contain flex-center p-all-s">',
				'<label id="',
				lIDLabel,
				'" class="m-left-xl text-right" style="width:',
				lTailleLibelle,
				'px;">',
				lTraduction,
				"</label>",
				'<div class="m-left-l">',
				lStrBouton,
				"</div>",
				'<div class="m-left-l" id="',
				lIDCount,
				'">',
				"</div>",
				"</div>",
			);
			if (lGenre === EGenreRessource.Eleve) {
				T.push(
					'<div class="flex-contain p-top flex-start m-left-xl" style="padding-left:',
					lTailleLibelle + 12,
					'px;">',
					'<div class="flex-contain flex-center">',
					'<ie-checkbox ie-model="surSaisiePublic(\'eleve_eleve\')"><span id="',
					this.id.cbEleve,
					'"></span></ie-checkbox>',
					"</div>",
					'<div class="flex-contain">',
					'<div class="flex-contain cols m-left-l">',
					'<div class="flex-contain flex-center">',
					'<ie-checkbox ie-model="surSaisiePublic(\'eleve_resp1\')"><span id="',
					this.id.cbEleveResponsable1,
					'"></span></ie-checkbox>',
					"</div>",
					'<div class="flex-contain flex-center m-top-l">',
					'<ie-checkbox ie-model="surSaisiePublic(\'eleve_pp\')"><span id="',
					this.id.cbEleveProfsPrincipaux,
					'"></span></ie-checkbox>',
					"</div>",
					"</div>",
					'<div class="flex-contain cols flex-start m-left-l">',
					'   <div class="flex-contain flex-center">',
					'   <ie-checkbox ie-model="surSaisiePublic(\'eleve_resp2\')"><span id="',
					this.id.cbEleveResponsable2,
					'"></span></ie-checkbox>',
					"     </div>",
					'<div class="flex-contain flex-center m-top-l">',
					'<ie-checkbox ie-model="surSaisiePublic(\'eleve_tuteurs\')"><span id="',
					this.id.cbEleveTuteurs,
					'"></span></ie-checkbox>',
					"</div>",
					"</div>",
					"</div>",
					"</div>",
				);
			}
		}
	}
	return T.join("");
}
function avecListeDiffusionSelonEspace() {
	return (
		[
			EGenreEspace.Professeur,
			EGenreEspace.Mobile_Professeur,
			EGenreEspace.PrimProfesseur,
			EGenreEspace.Mobile_PrimProfesseur,
			EGenreEspace.Etablissement,
			EGenreEspace.Mobile_Etablissement,
			EGenreEspace.Administrateur,
			EGenreEspace.Mobile_Administrateur,
			EGenreEspace.PrimMairie,
			EGenreEspace.Mobile_PrimMairie,
			EGenreEspace.PrimDirection,
			EGenreEspace.Mobile_PrimDirection,
		].indexOf(GEtatUtilisateur.GenreEspace) >= 0
	);
}
function _composeDestinataires() {
	const lHauteurPanelSeul = this.height.zoneDestinataires - 15;
	const lAvecListeDiffusion = avecListeDiffusionSelonEspace.call(this);
	const T = [];
	if (GEtatUtilisateur.pourPrimaire()) {
		T.push(
			'<div class="flex-contain">',
			'<div class="fix-bloc p-top-l p-right-l flex-contain cols" style="width: 36px;">',
		);
		if (lAvecListeDiffusion) {
			T.push(
				`<div class="EspaceBas">${UtilitaireBoutonBandeau.getHtmlBtnListesDiffusion("btnAfficherListesDiffusion")}</div>`,
			);
		}
		T.push(
			`<div>${UtilitaireBoutonBandeau.getHtmlBtnSupprimer("btnSupprimerDestinataires")}</div>`,
		);
		T.push(
			"</div>",
			'<div class="fluid-bloc flex-contain cols">',
			'<fieldset class="fieldset-round-style">',
			`<legend>${GTraductions.getValeur("actualites.Edition.Destinataires")}</legend>`,
			`<div class="content-wrapper" style="height: ${lHauteurPanelSeul}px;" id="${this.id.panelDestinatairePrimaire}">${_composePanelDestinatairesPrimaire.call(this)}</div>`,
			"</fieldset>",
			"</div>",
			"</div>",
		);
	} else if (this.genresRessourceAffDestinataire.length === 0) {
		T.push(
			'<div class="flex-contain full-height">',
			'<div class="fix-bloc p-top-l p-right-l flex-contain cols">',
		);
		if (lAvecListeDiffusion) {
			T.push(
				`<div class="EspaceBas">${UtilitaireBoutonBandeau.getHtmlBtnListesDiffusion("btnAfficherListesDiffusion")}</div>`,
			);
		}
		T.push(
			`<div>${UtilitaireBoutonBandeau.getHtmlBtnSupprimer("btnSupprimerDestinataires")}</div>`,
		);
		T.push(
			"</div>",
			'<div class="fluid-bloc flex-contain cols">',
			`<div class="conteneur-tabs" id="${this.getNomInstance(this.identTabs)}"></div>`,
			`<div class="fluid-bloc tabs-contenu with-border">`,
			`<div id="${this.id.panelDestinataireEntite}">${_composePanelEntite.call(this)}</div>`,
			`<div id="${this.id.panelDestinataireIndividuel}">${_composePanelIndividu.call(this)}</div>`,
			`<div id="${this.id.panelDestinataireResponsables}">${_composePanelResponsables.call(this)}</div>`,
			"</div>",
			"</div>",
			"</div>",
		);
	} else {
		if (
			this.estGenreInGenresRessourceAffDestinataire(EGenreRessource.Classe) ||
			this.estGenreInGenresRessourceAffDestinataire(EGenreRessource.Groupe)
		) {
			T.push(
				'<fieldset class="fieldset-round-style">',
				"<legend>",
				GTraductions.getValeur("actualites.Edition.Destinataires"),
				"</legend>",
				'<div class="content-wrapper" style="height: ',
				lHauteurPanelSeul,
				'px;" id="',
				this.id.panelDestinataireEntite,
				'">',
				_composePanelClasseGroupe.call(this),
				"</div>",
				"</fieldset>",
			);
		} else {
			T.push(
				'<fieldset class="fieldset-round-style">',
				"<legend>",
				GTraductions.getValeur("actualites.Edition.Destinataires"),
				"</legend>",
				'<div class="content-wrapper" style="height: ',
				lHauteurPanelSeul,
				'px;" id="',
				this.id.panelDestinataireIndividuel,
				'">',
				_composePanelIndividuSimple.call(
					this,
					this.genresRessourceAffDestinataire,
				),
				"</div>",
				"</fieldset>",
			);
		}
	}
	return T.join("");
}
function _compose() {
	const H = [];
	H.push(
		`<div id="${this.id.destinataires}" class="full-height">${_composeDestinataires.call(this)}</div>`,
	);
	return H.join("");
}
module.exports = { ObjetDestinatairesActualite };
