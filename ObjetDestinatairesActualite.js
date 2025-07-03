exports.ObjetDestinatairesActualite = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Cache_1 = require("Cache");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetFenetre_SelectionPublic_1 = require("ObjetFenetre_SelectionPublic");
const ObjetFenetre_SelectionPublic_PN_1 = require("ObjetFenetre_SelectionPublic_PN");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTabOnglets_1 = require("ObjetTabOnglets");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_SelectionDiffusion_1 = require("DonneesListe_SelectionDiffusion");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetFenetre_SelectionClasseGroupe_1 = require("ObjetFenetre_SelectionClasseGroupe");
const ObjetRequeteListePublics_1 = require("ObjetRequeteListePublics");
const TypeGenreInternetIndividu_1 = require("TypeGenreInternetIndividu");
const UtilitaireFenetreSelectionPublic_1 = require("UtilitaireFenetreSelectionPublic");
const ObjetRequeteDonneesEditionInformation_1 = require("ObjetRequeteDonneesEditionInformation");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const ObjetFenetre_SelectionListeDiffusion_1 = require("ObjetFenetre_SelectionListeDiffusion");
const ObjetRequeteListeDiffusion_1 = require("ObjetRequeteListeDiffusion");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const UtilitaireListePublics_1 = require("UtilitaireListePublics");
const AccessApp_1 = require("AccessApp");
class ObjetDestinatairesActualite extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.appSco = (0, AccessApp_1.getApp)();
		this.etatUtilSco = this.appSco.getEtatUtilisateur();
		this.TypeOnglet = { entite: 1, individuel: 2, entreResponsables: 4 };
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
				this.Nom + "_Panel_" + this.TypeOnglet.entreResponsables,
			panelDestinatairePrimaire: this.Nom + "_Panel_Primaire",
			labelEntite: this.Nom + "_Label_Entite",
			labelEleve:
				this.Nom + "_Label_" + Enumere_Ressource_1.EGenreRessource.Eleve,
			labelProfesseur:
				this.Nom + "_Label_" + Enumere_Ressource_1.EGenreRessource.Enseignant,
			labelResponsable:
				this.Nom + "_Label_" + Enumere_Ressource_1.EGenreRessource.Responsable,
			labelResponsableAResponsable:
				this.Nom +
				"_Label_" +
				Enumere_Ressource_1.EGenreRessource.Responsable +
				"_AResp",
			labelPersonnel:
				this.Nom + "_Label_" + Enumere_Ressource_1.EGenreRessource.Personnel,
			labelMaitreDeStage:
				this.Nom +
				"_Label_" +
				Enumere_Ressource_1.EGenreRessource.MaitreDeStage,
			labelInspecteur:
				this.Nom +
				"_Label_" +
				Enumere_Ressource_1.EGenreRessource.InspecteurPedagogique,
			countEntite: this.Nom + "_Count_Entite",
			countEleve:
				this.Nom + "_Count_" + Enumere_Ressource_1.EGenreRessource.Eleve,
			countProfesseur:
				this.Nom + "_Count_" + Enumere_Ressource_1.EGenreRessource.Enseignant,
			countResponsable:
				this.Nom + "_Count_" + Enumere_Ressource_1.EGenreRessource.Responsable,
			countResponsableAResponsable:
				this.Nom +
				"_Count_" +
				Enumere_Ressource_1.EGenreRessource.Responsable +
				"_AResp",
			countPersonnel:
				this.Nom + "_Count_" + Enumere_Ressource_1.EGenreRessource.Personnel,
			countMaitreDeStage:
				this.Nom +
				"_Count_" +
				Enumere_Ressource_1.EGenreRessource.MaitreDeStage,
			countInspecteur:
				this.Nom +
				"_Count_" +
				Enumere_Ressource_1.EGenreRessource.InspecteurPedagogique,
		};
		this.setOptions({});
		this.listeOngletsDestinataires =
			new ObjetListeElements_1.ObjetListeElements();
		this.listeOngletsDestinataires.addElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"actualites.Edition.OngletEntite",
					[0, 0],
				),
				0,
				this.TypeOnglet.entite,
			),
		);
		this.listeOngletsDestinataires.addElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"actualites.Edition.OngletIndividu",
					[0],
				),
				0,
				this.TypeOnglet.individuel,
			),
		);
		this.listeOngletsDestinataires.addElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"actualites.Edition.Destinataires",
					[0],
				),
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
		return this;
	}
	setChoixResponsableParEntite(aChoixParEntite) {
		this.choixResponsableParEntite = aChoixParEntite;
	}
	setGenresRessourceAffDestinataire(aGenresRessourceAffDest) {
		this.genresRessourceAffDestinataire = aGenresRessourceAffDest;
		if (this.genresRessourceAffDestinataire.length > 0) {
			this._resetDestinataires();
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
			ObjetTabOnglets_1.ObjetTabOnglets,
			this._evenementSurTab.bind(this),
			this._initialiserTabs.bind(this),
		);
		this.identFenetreClasses = this.addFenetre(
			ObjetFenetre_SelectionClasseGroupe_1.ObjetFenetre_SelectionClasseGroupe,
			this._evenementFenetreClasses.bind(this),
		);
		this.identFenetreSelectPublic = this.addFenetre(
			ObjetFenetre_SelectionPublic_PN_1.ObjetFenetre_SelectionPublic_PN,
			this._evenementFenetreIndividu.bind(this),
		);
		this.identFenetreSelectListeDiffusion = this.addFenetre(
			ObjetFenetre_SelectionListeDiffusion_1.ObjetFenetre_SelectionListeDiffusion,
			this._evenementFenetreListeDiffusion.bind(this),
		);
	}
	setDonnees(aInfo, aDonnees) {
		this.information = aInfo;
		this.afficher();
		if (aDonnees) {
			this.donneesEleve = aDonnees;
			this._initPublic(aDonnees);
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
						ObjetTraduction_1.GTraductions.getValeur(
							"actualites.Edition.OngletIndividu",
							[0],
						),
					);
				}
				if (this._estResponsableAResponsable()) {
					this.listeOngletsDestinataires.get(0).invisible = true;
					this.listeOngletsDestinataires.get(1).invisible = true;
				} else {
					this.listeOngletsDestinataires.get(2).invisible = true;
				}
			}
			this._setDonneesTabs({
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
					aInstance._evenementSurBoutonListeDiffusion();
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"actualites.public.chargerListeDiffusion",
					);
				},
			},
			btnSupprimerDestinataires: {
				event() {
					aInstance._viderPublic();
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"actualites.public.supprimer",
					);
				},
				getDisabled() {
					return (
						!aInstance.information ||
						!aInstance._existesDestinataires(aInstance.information)
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
									TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
										.InternetIndividu_ParentEleve,
								) ||
								aInstance.information.genresPublicEntite.contains(
									TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
										.InternetIndividu_Parent,
								)
							);
						case "professeurs":
							return aInstance.information.genresPublicEntite.contains(
								TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
									.InternetIndividu_Professeur,
							);
						case "personnels":
							return aInstance.information.genresPublicEntite.contains(
								TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
									.InternetIndividu_Personnel,
							);
						case "maitreDeStage":
							return aInstance.information.genresPublicEntite.contains(
								TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
									.InternetIndividu_MaitreDeStageEleve,
							);
						case "enfants":
							return aInstance.information.genresPublicEntite.contains(
								TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
									.InternetIndividu_ParentEleve,
							);
						case "eleves":
							return aInstance.information.genresPublicEntite.contains(
								TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
									.InternetIndividu_Eleve,
							);
						case "legaux":
							return aInstance.information.genresPublicEntite.contains(
								TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
									.InternetIndividu_Parent,
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
								aInstance._modifierGenrePublicEntite(
									TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
										.InternetIndividu_ParentEleve,
									aChecked,
								);
								aInstance._modifierGenrePublicEntite(
									TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
										.InternetIndividu_Parent,
									aChecked,
								);
							} else {
								let lType =
									TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
										.InternetIndividu_ParentEleve;
								if (aInstance.information.estInformation) {
									lType =
										TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
											.InternetIndividu_Parent;
								}
								aInstance._modifierGenrePublicEntite(lType, aChecked);
							}
							break;
						case "professeurs":
							aInstance._modifierGenrePublicEntite(
								TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
									.InternetIndividu_Professeur,
								aChecked,
							);
							break;
						case "personnels":
							aInstance._modifierGenrePublicEntite(
								TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
									.InternetIndividu_Personnel,
								aChecked,
							);
							break;
						case "maitreDeStage":
							aInstance._modifierGenrePublicEntite(
								TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
									.InternetIndividu_MaitreDeStageEleve,
								aChecked,
							);
							break;
						case "eleves":
							aInstance._modifierGenrePublicEntite(
								TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
									.InternetIndividu_Eleve,
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
								TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
									.InternetIndividu_ParentEleve,
							);
						case "legaux":
							return aInstance.information.genresPublicEntite.contains(
								TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
									.InternetIndividu_Parent,
							);
						default:
							break;
					}
				},
				setValue(aValeur) {
					switch (aValeur) {
						case "enfants":
							aInstance._modifierGenrePublicEntite(
								TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
									.InternetIndividu_ParentEleve,
								true,
							);
							aInstance._modifierGenrePublicEntite(
								TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
									.InternetIndividu_Parent,
								false,
							);
							break;
						case "legaux":
							aInstance._modifierGenrePublicEntite(
								TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
									.InternetIndividu_ParentEleve,
								false,
							);
							aInstance._modifierGenrePublicEntite(
								TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
									.InternetIndividu_Parent,
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
									TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
										.InternetIndividu_ParentEleve,
								) ||
								aInstance.information.genresPublicEntite.contains(
									TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
										.InternetIndividu_Parent,
								)
							);
						default:
							return false;
					}
				},
			},
		});
	}
	surModificationDest() {
		if (this.avecCallbckSurModification === true) {
			this.callback.appel();
		} else {
			this.information.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
	}
	surSaisieGenreResp(aValeur) {
		switch (aValeur) {
			case "enfants":
				this._modifierGenrePublicEntite(
					TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
						.InternetIndividu_ParentEleve,
					true,
				);
				this._modifierGenrePublicEntite(
					TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
						.InternetIndividu_Parent,
					false,
				);
				break;
			case "legaux":
				this._modifierGenrePublicEntite(
					TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
						.InternetIndividu_ParentEleve,
					false,
				);
				this._modifierGenrePublicEntite(
					TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
						.InternetIndividu_Parent,
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
			this.information.listePublicIndividu =
				new ObjetListeElements_1.ObjetListeElements();
			this.setCountIndividus();
		}
	}
	setCountIndividus(aParam) {
		const lSansFiltre =
			!aParam || aParam.avecFiltreGenresRessourceAffDestinataire !== true;
		const lTab = [
			Enumere_Ressource_1.EGenreRessource.Enseignant,
			Enumere_Ressource_1.EGenreRessource.Eleve,
			Enumere_Ressource_1.EGenreRessource.Responsable,
			Enumere_Ressource_1.EGenreRessource.Personnel,
			Enumere_Ressource_1.EGenreRessource.MaitreDeStage,
			Enumere_Ressource_1.EGenreRessource.InspecteurPedagogique,
			Enumere_Ressource_1.EGenreRessource.Classe,
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
					lGenreRessource === Enumere_Ressource_1.EGenreRessource.Eleve
						? aParam &&
							aParam.donneesEleve !== null &&
							aParam.donneesEleve !== undefined
							? aParam.donneesEleve
							: null
						: null;
				this._setCountDeGenreRessource(lCnt, lGenreRessource, lDonneesEleve);
			}
			lCntTot += lCnt;
		}
		return lCntTot;
	}
	getHeightZoneDestinataires() {
		return this.height.zoneDestinataires;
	}
	construireAffichage() {
		return this._compose();
	}
	construitBtnRessourceEntite() {
		const lAvecCountEntite =
			!this.appSco.estPrimaire &&
			this.genresRessourceAffDestinataire.length !== 0 &&
			(this.estGenreInGenresRessourceAffDestinataire(
				Enumere_Ressource_1.EGenreRessource.Classe,
			) ||
				this.estGenreInGenresRessourceAffDestinataire(
					Enumere_Ressource_1.EGenreRessource.Groupe,
				));
		const lAriaLabel =
			this.genresRessourceAffDestinataire.length > 0 &&
			!this.appSco.estPrimaire &&
			this.estGenreInGenresRessourceAffDestinataire(
				Enumere_Ressource_1.EGenreRessource.Groupe,
			)
				? ObjetTraduction_1.GTraductions.getValeur(
						"fenetreSelectionClasseGroupe.titreGroupes",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"fenetreSelectionClasseGroupe.titreClasses",
					);
		const lAriaDescribedby =
			this.appSco.estPrimaire && this.choixResponsableParEntite
				? [this.id.labelEntite, this.id.countEntite].join(" ")
				: lAvecCountEntite
					? this.id.countEntite
					: this.id.labelEntite;
		return IE.jsx.str(
			"ie-bouton",
			{
				"ie-model": this.jsxModelBtnRessource.bind(
					this,
					Enumere_Ressource_1.EGenreRessource.Aucune,
				),
				class: Type_ThemeBouton_1.TypeThemeBouton.neutre,
				"ie-tooltiplabel": lAriaLabel,
				"aria-describedby": lAriaDescribedby,
			},
			"...",
		);
	}
	construitBtnRessourceResponsableAResponsable() {
		return IE.jsx.str(
			"ie-bouton",
			{
				"ie-model": this.jsxModelBtnRessource.bind(
					this,
					Enumere_Ressource_1.EGenreRessource.Classe,
				),
				class: Type_ThemeBouton_1.TypeThemeBouton.neutre,
				"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
					"Fenetre_SelectionRessource.SelectionnerClasses",
				),
				"aria-describedby": [
					this.id.labelResponsableAResponsable,
					this.id.countResponsableAResponsable,
				].join(" "),
			},
			"...",
		);
	}
	construitBtnRessourceEleve() {
		return IE.jsx.str(
			"ie-bouton",
			{
				"ie-model": this.jsxModelBtnRessource.bind(
					this,
					Enumere_Ressource_1.EGenreRessource.Eleve,
				),
				class: Type_ThemeBouton_1.TypeThemeBouton.neutre,
				"ie-tooltiplabel":
					Enumere_Ressource_1.EGenreRessourceUtil.getTitreFenetreSelectionRessource(
						Enumere_Ressource_1.EGenreRessource.Eleve,
					),
				"aria-describedby": [this.id.labelEleve, this.id.countEleve].join(" "),
			},
			"...",
		);
	}
	construitBtnRessourceEnseignant() {
		return IE.jsx.str(
			"ie-bouton",
			{
				"ie-model": this.jsxModelBtnRessource.bind(
					this,
					Enumere_Ressource_1.EGenreRessource.Enseignant,
				),
				class: Type_ThemeBouton_1.TypeThemeBouton.neutre,
				"ie-tooltiplabel":
					Enumere_Ressource_1.EGenreRessourceUtil.getTitreFenetreSelectionRessource(
						Enumere_Ressource_1.EGenreRessource.Enseignant,
					),
				"aria-describedby": [
					this.id.labelProfesseur,
					this.id.countProfesseur,
				].join(" "),
			},
			"...",
		);
	}
	construitBtnRessourceResponsable() {
		return IE.jsx.str(
			"ie-bouton",
			{
				"ie-model": this.jsxModelBtnRessource.bind(
					this,
					Enumere_Ressource_1.EGenreRessource.Responsable,
				),
				class: Type_ThemeBouton_1.TypeThemeBouton.neutre,
				"ie-tooltiplabel":
					Enumere_Ressource_1.EGenreRessourceUtil.getTitreFenetreSelectionRessource(
						Enumere_Ressource_1.EGenreRessource.Responsable,
					),
				"aria-describedby": [
					this.id.labelResponsable,
					this.id.countResponsable,
				].join(" "),
			},
			"...",
		);
	}
	construitBtnRessourcePersonnel() {
		return IE.jsx.str(
			"ie-bouton",
			{
				"ie-model": this.jsxModelBtnRessource.bind(
					this,
					Enumere_Ressource_1.EGenreRessource.Personnel,
				),
				class: Type_ThemeBouton_1.TypeThemeBouton.neutre,
				"ie-tooltiplabel":
					Enumere_Ressource_1.EGenreRessourceUtil.getTitreFenetreSelectionRessource(
						Enumere_Ressource_1.EGenreRessource.Personnel,
					),
				"aria-describedby": [
					this.id.labelPersonnel,
					this.id.countPersonnel,
				].join(" "),
			},
			"...",
		);
	}
	construitBtnRessourceMaitreDeStage() {
		return IE.jsx.str(
			"ie-bouton",
			{
				"ie-model": this.jsxModelBtnRessource.bind(
					this,
					Enumere_Ressource_1.EGenreRessource.MaitreDeStage,
				),
				class: Type_ThemeBouton_1.TypeThemeBouton.neutre,
				"ie-tooltiplabel":
					Enumere_Ressource_1.EGenreRessourceUtil.getTitreFenetreSelectionRessource(
						Enumere_Ressource_1.EGenreRessource.MaitreDeStage,
					),
				"aria-describedby": [
					this.id.labelMaitreDeStage,
					this.id.countMaitreDeStage,
				].join(" "),
			},
			"...",
		);
	}
	construitBtnRessourceInspecteurPedagogique() {
		return IE.jsx.str(
			"ie-bouton",
			{
				"ie-model": this.jsxModelBtnRessource.bind(
					this,
					Enumere_Ressource_1.EGenreRessource.InspecteurPedagogique,
				),
				class: Type_ThemeBouton_1.TypeThemeBouton.neutre,
				"ie-tooltiplabel":
					Enumere_Ressource_1.EGenreRessourceUtil.getTitreFenetreSelectionRessource(
						Enumere_Ressource_1.EGenreRessource.InspecteurPedagogique,
					),
				"aria-describedby": [
					this.id.labelInspecteur,
					this.id.countInspecteur,
				].join(" "),
			},
			"...",
		);
	}
	_initialiserTabs(aInstance) {
		aInstance.setOptions({
			hauteur: this.hauteurTabOnglets,
			largeur: this.largeur - 10,
		});
	}
	_getTraducCount(aGenreRessource, aSingulier) {
		switch (aGenreRessource) {
			case Enumere_Ressource_1.EGenreRessource.Classe:
				return aSingulier === true
					? ObjetTraduction_1.GTraductions.getValeur("actualites.Classe")
					: ObjetTraduction_1.GTraductions.getValeur("actualites.Classes");
			case Enumere_Ressource_1.EGenreRessource.Groupe:
				return aSingulier === true
					? ObjetTraduction_1.GTraductions.getValeur("actualites.Groupe")
					: ObjetTraduction_1.GTraductions.getValeur("actualites.Groupes");
			case Enumere_Ressource_1.EGenreRessource.Responsable:
				if (this._estResponsableAResponsable()) {
					return ObjetTraduction_1.GTraductions.getValeur("actualites.Classes");
				} else {
					return "";
				}
			default:
				return "";
		}
	}
	_getIdCountRessource(aGenreRessource) {
		switch (aGenreRessource) {
			case Enumere_Ressource_1.EGenreRessource.Enseignant:
				return this.id.countProfesseur;
			case Enumere_Ressource_1.EGenreRessource.Responsable:
				return this.id.countResponsable;
			case Enumere_Ressource_1.EGenreRessource.Eleve:
				return this.id.countEleve;
			case Enumere_Ressource_1.EGenreRessource.Personnel:
				return this.id.countPersonnel;
			case Enumere_Ressource_1.EGenreRessource.MaitreDeStage:
				return this.id.countMaitreDeStage;
			case Enumere_Ressource_1.EGenreRessource.InspecteurPedagogique:
				return this.id.countInspecteur;
			case Enumere_Ressource_1.EGenreRessource.Classe:
			case Enumere_Ressource_1.EGenreRessource.Groupe:
				if (this._estResponsableAResponsable()) {
					return this.id.countResponsableAResponsable;
				} else {
					return this.id.countEntite;
				}
			default:
				return "";
		}
	}
	_getStrCount(aCnt, aGenreRessource, aParam) {
		if (
			[
				Enumere_Ressource_1.EGenreRessource.Classe,
				Enumere_Ressource_1.EGenreRessource.Groupe,
			].includes(aGenreRessource)
		) {
			const lOnlyOne = aCnt === 1;
			const lTraduc = this._getTraducCount(aGenreRessource, lOnlyOne);
			const lDetail = lOnlyOne
				? this.information.listePublicEntite.getLibelle(0) || aCnt
				: aCnt;
			return lTraduc + " (" + lDetail + ")";
		} else if (
			[Enumere_Ressource_1.EGenreRessource.Responsable].includes(
				aGenreRessource,
			) &&
			this._estResponsableAResponsable()
		) {
			const lTraduc = this._getTraducCount(aGenreRessource);
			const lDetail =
				aCnt +
				" " +
				ObjetTraduction_1.GTraductions.getValeur(
					"actualites.public.responsables",
				);
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
	_setCountRessource(aCnt, aGenreRessource) {
		const lId = this._getIdCountRessource(aGenreRessource);
		const lForcerCompteur =
			aGenreRessource === Enumere_Ressource_1.EGenreRessource.Eleve;
		const lStr = this._getStrCount(aCnt, aGenreRessource, {
			forcerCmp: lForcerCompteur,
			avecParentheses: true,
		});
		ObjetHtml_1.GHtml.setHtml(lId, lStr);
	}
	_setCountCBRespEleve(aIdCB, aEstVisible, aStr) {
		const lJq = $("span[id='" + aIdCB.escapeJQ() + "']");
		if (aEstVisible) {
			lJq.html(aStr).parent().show();
		} else {
			lJq.parent().hide();
		}
	}
	_setCountDeGenreRessource(aCnt, aGenreRessource, aParam) {
		if (aGenreRessource === Enumere_Ressource_1.EGenreRessource.Eleve) {
			this._setCountEleve(aCnt, aParam);
		} else {
			this._setCountRessource(aCnt, aGenreRessource);
		}
	}
	_setCountEleve(aCnt, aDonnees) {
		this._setCountRessource(aCnt, Enumere_Ressource_1.EGenreRessource.Eleve);
		if (
			this.genresRessourceAffDestinataire &&
			this.genresRessourceAffDestinataire.length !== 0 &&
			this.estGenreInGenresRessourceAffDestinataire(
				Enumere_Ressource_1.EGenreRessource.Eleve,
			) &&
			aDonnees
		) {
			const lOnlyOne = aCnt === 1;
			let lStr, lEstVisible;
			lStr = lOnlyOne
				? this._getStrCount(aCnt, Enumere_Ressource_1.EGenreRessource.Eleve, {
						forcerCmp: false,
						avecParentheses: false,
					})
				: ObjetTraduction_1.GTraductions.getValeur("actualites.Eleves") +
					" (" +
					aCnt +
					")";
			this._setCountCBRespEleve(this.id.cbEleve, true, lStr);
			lEstVisible = true;
			lStr =
				ObjetTraduction_1.GTraductions.getValeur(
					"actualites.ResponsablePreferentiel",
				) +
				" (" +
				(aDonnees.nombreResponsablesPreferentiel || 0) +
				")";
			this._setCountCBRespEleve(this.id.cbEleveResponsable1, lEstVisible, lStr);
			lEstVisible = true;
			lStr =
				ObjetTraduction_1.GTraductions.getValeur(
					"actualites.ResponsableNonPreferentiel",
				) +
				" (" +
				(aDonnees.nombreResponsablesSecondaires || 0) +
				")";
			this._setCountCBRespEleve(this.id.cbEleveResponsable2, lEstVisible, lStr);
			lEstVisible = true;
			lStr =
				ObjetTraduction_1.GTraductions.getValeur("actualites.ProfsPrincipaux") +
				" (" +
				(aDonnees.nombreProfsPrincipaux || 0) +
				")";
			this._setCountCBRespEleve(
				this.id.cbEleveProfsPrincipaux,
				lEstVisible,
				lStr,
			);
			lEstVisible = true;
			lStr =
				ObjetTraduction_1.GTraductions.getValeur("actualites.Tuteurs") +
				" (" +
				(aDonnees.nombreTuteurs || 0) +
				")";
			this._setCountCBRespEleve(this.id.cbEleveTuteurs, lEstVisible, lStr);
		}
	}
	_initPublic(aDonnees) {
		if (this.etatUtilSco.pourPrimaire()) {
			if (this.choixResponsableParEntite) {
				this.information.genresPublicEntite.add(
					TypeGenreInternetIndividu_1.TypeGenreInternetIndividu
						.InternetIndividu_Parent,
				);
			}
		} else if (this._estResponsableAResponsable()) {
			this._evntListePublic(Enumere_Ressource_1.EGenreRessource.Classe, true);
		} else {
			if (!this.appSco.getObjetParametres().avecElevesRattaches) {
				$("#" + (this.id.cbPublicElevesRattaches + "_pere").escapeJQ()).hide();
			}
		}
		this._actualiserCountDestinataires(aDonnees);
	}
	_actualiserCountDestinataires(aDonneesEleve) {
		this._setCountDestinataires({
			avecIndividus: !this.estGenreInGenresRessourceAffDestinataire(
				Enumere_Ressource_1.EGenreRessource.Classe,
			),
			donneesEleve: aDonneesEleve,
			avecFiltreGenresRessourceAffDestinataire: true,
			estInit: true,
		});
	}
	_setCountDestinataires(aParam) {
		if (this.etatUtilSco.pourPrimaire()) {
			if (this.choixResponsableParEntite) {
				const lNbPublicEntite =
					this.information.listePublicEntite.getNbrElementsExistes();
				this._setCountDeGenreRessource(
					lNbPublicEntite,
					Enumere_Ressource_1.EGenreRessource.Classe,
				);
			}
		} else {
			let lIndice, lNbr, lGenreRessource;
			const lTabEntites = [
				Enumere_Ressource_1.EGenreRessource.Classe,
				Enumere_Ressource_1.EGenreRessource.Groupe,
			];
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
				ObjetTraduction_1.GTraductions.getValeur(
					"actualites.Edition.OngletEntite",
					[
						lCountRessource[Enumere_Ressource_1.EGenreRessource.Classe],
						lCountRessource[Enumere_Ressource_1.EGenreRessource.Groupe],
					],
				),
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
				for (
					lIndice = 0, lNbr = lTabEntites.length;
					lIndice < lNbr;
					lIndice++
				) {
					lGenreRessource = lTabEntites[lIndice];
					if (this.estGenreInGenresRessourceAffDestinataire(lGenreRessource)) {
						this._setCountDeGenreRessource(
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
					ObjetTraduction_1.GTraductions.getValeur(
						"actualites.Edition.OngletIndividu",
						[lTotal],
					),
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
				this._setDonneesTabs();
			}
		}
	}
	_getHeightDest(aGenreRessource) {
		let lHeight = 0;
		if (this.estGenreInGenresRessourceAffDestinataire(aGenreRessource)) {
			const lHauteurParDefaut = 29;
			const lHauteurPourLaCocheDirecteur = 19;
			switch (aGenreRessource) {
				case Enumere_Ressource_1.EGenreRessource.Eleve:
					lHeight = 46 + lHauteurParDefaut;
					break;
				case Enumere_Ressource_1.EGenreRessource.Personnel:
					lHeight = this.etatUtilSco.pourPrimaire()
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
	_resetDestinataires() {
		const lTailleInit = 21;
		let lHeight = lTailleInit;
		const lTab = [
			Enumere_Ressource_1.EGenreRessource.Eleve,
			Enumere_Ressource_1.EGenreRessource.Enseignant,
			Enumere_Ressource_1.EGenreRessource.Responsable,
			Enumere_Ressource_1.EGenreRessource.Personnel,
			Enumere_Ressource_1.EGenreRessource.MaitreDeStage,
			Enumere_Ressource_1.EGenreRessource.InspecteurPedagogique,
		];
		const lNbr = lTab.length;
		for (let i = 0; i < lNbr; i++) {
			const lGenreRessource = lTab[i];
			lHeight += this._getHeightDest(lGenreRessource);
		}
		if (lHeight > lTailleInit) {
			this.height.zoneDestinataires = lHeight;
		}
		if (this.getInstance(this.identTabs)) {
			this.getInstance(this.identTabs).free();
		}
		ObjetHtml_1.GHtml.setHtml(
			this.id.destinataires,
			this._composeDestinataires(),
		);
	}
	jsxModelBtnRessource(aGenre) {
		return {
			event: () => {
				if (aGenre === Enumere_Ressource_1.EGenreRessource.Aucune) {
					this._evntEntite();
				} else {
					this._evntListePublic(aGenre, false);
				}
			},
		};
	}
	_evntEntite() {
		const lInstance = this.getInstance(this.identFenetreClasses);
		const lEstPrimaire = this.appSco.estPrimaire;
		if (!this.listeClassesGroupes) {
			let lParam = {
				avecClasse: true,
				avecGroupe: true,
				uniquementClasseEnseignee:
					this.etatUtilSco.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Professeur
						? !this.appSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.communication.toutesClasses,
							)
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
						this.etatUtilSco.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.Professeur
							? !this.appSco.droits.get(
									ObjetDroitsPN_1.TypeDroits.communication.toutesClasses,
								)
							: false,
				};
			}
			this.listeClassesGroupes = this.etatUtilSco.getListeClasses(lParam);
		}
		let lAvecCumul = !lEstPrimaire;
		let lTitre = lEstPrimaire
			? ObjetTraduction_1.GTraductions.getValeur(
					"fenetreSelectionClasseGroupe.titreClasses",
				)
			: null;
		if (this.genresRessourceAffDestinataire.length > 0 && !lEstPrimaire) {
			if (
				this.estGenreInGenresRessourceAffDestinataire(
					Enumere_Ressource_1.EGenreRessource.Classe,
				)
			) {
				this.listeClassesGroupes = this.listeClassesGroupes.getListeElements(
					(aElement) => {
						return (
							aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Classe
						);
					},
				);
				if (lTitre === null) {
					lTitre = ObjetTraduction_1.GTraductions.getValeur(
						"fenetreSelectionClasseGroupe.titreClasses",
					);
				}
			} else if (
				this.estGenreInGenresRessourceAffDestinataire(
					Enumere_Ressource_1.EGenreRessource.Groupe,
				)
			) {
				this.listeClassesGroupes = this.listeClassesGroupes.getListeElements(
					(aElement) => {
						return (
							aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Groupe
						);
					},
				);
				lAvecCumul = false;
				if (lTitre === null) {
					lTitre = ObjetTraduction_1.GTraductions.getValeur(
						"fenetreSelectionClasseGroupe.titreGroupes",
					);
				}
			}
		}
		lInstance.setSelectionObligatoire(false);
		lInstance.setAvecCumul(lAvecCumul);
		lInstance.setDonnees({
			listeRessources: this.listeClassesGroupes,
			listeRessourcesSelectionnees: MethodesObjet_1.MethodesObjet.dupliquer(
				this.information.listePublicEntite,
			),
			titre: lTitre,
		});
	}
	_estResponsableAResponsable() {
		return (
			this.etatUtilSco.GenreEspace === Enumere_Espace_1.EGenreEspace.Parent
		);
	}
	_evntListePublic(aGenre, aBloquerOuvertureFenetre) {
		const lEstResponsableAResponsable = this._estResponsableAResponsable();
		const lParams = {
			genres: [aGenre],
			sansFiltreSurEleve: this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.toutesClasses,
			),
			entreResponsables: lEstResponsableAResponsable,
			avecFonctionPersonnel: true,
		};
		if (lEstResponsableAResponsable) {
			lParams.avecFiltreDelegues = true;
		}
		new ObjetRequeteListePublics_1.ObjetRequeteListePublics(
			this,
			this._evntListePublicApresRequete.bind(this, aBloquerOuvertureFenetre),
		).lancerRequete(lParams);
	}
	_evntListePublicApresRequete(aBloquerOuvertureFenetre, aDonnees) {
		const lListeComplet = aDonnees.listePublic;
		const lGenre = aDonnees.genres[0];
		let lListeSelection = this._getListeDonneesSelectionnees(lGenre);
		if (aBloquerOuvertureFenetre === true) {
			if (
				this._estResponsableAResponsable() &&
				lListeSelection &&
				lListeSelection.count() === 0 &&
				this.information.listePublicIndividu.count() === 0
			) {
				if (lListeComplet.count() === 1) {
					lListeSelection = lListeComplet.getListeElements();
					this.information.listePublicIndividu = lListeSelection;
					this._evenementApresFenetreIndividu(
						Enumere_Ressource_1.EGenreRessource.Classe,
						this.information.listePublicIndividu,
						1,
					);
				}
			}
			return;
		}
		this._evntDeclencherFenetreRessource({
			listeComplet: lListeComplet,
			listeSelectionnee: lListeSelection,
			genre: lGenre,
			genreCumul: (0,
			UtilitaireFenetreSelectionPublic_1.getCumulPourFenetrePublic)(
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
	_getListeDonneesSelectionnees(aGenre) {
		return this.information.listePublicIndividu.getListeElements((aElement) => {
			return aElement.getGenre() === aGenre;
		});
	}
	_evntDeclencherFenetreRessource(aDonnees) {
		const lInstance = this.getInstance(this.identFenetreSelectPublic);
		if (
			aDonnees.genre === Enumere_Ressource_1.EGenreRessource.Eleve ||
			aDonnees.genre === Enumere_Ressource_1.EGenreRessource.Responsable
		) {
			const lListeCumuls = new ObjetListeElements_1.ObjetListeElements();
			lListeCumuls.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("actualites.Cumul.Classe"),
					0,
					ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.classe,
					0,
				),
			);
			lListeCumuls.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("actualites.Cumul.Groupe"),
					0,
					ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.groupe,
					1,
				),
			);
			lListeCumuls.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"actualites.Cumul.Alphabetique",
					),
					0,
					ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.initial,
					2,
				),
			);
			if (aDonnees.genre === Enumere_Ressource_1.EGenreRessource.Responsable) {
				lListeCumuls.addElement(
					new ObjetElement_1.ObjetElement(
						ObjetTraduction_1.GTraductions.getValeur(
							"actualites.Cumul.NomDesEleves",
						),
						0,
						ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic
							.nomEleves,
					),
				);
			}
			if (aDonnees.listeServicesPeriscolaire) {
				lListeCumuls.addElement(
					new ObjetElement_1.ObjetElement(
						ObjetTraduction_1.GTraductions.getValeur(
							"actualites.Cumul.ServicesPeriscolaire",
						),
						0,
						ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic
							.servicesPeriscolaire,
					),
				);
				if (
					[
						Enumere_Espace_1.EGenreEspace.PrimPeriscolaire,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimPeriscolaire,
					].includes(this.etatUtilSco.GenreEspace)
				) {
					aDonnees.genreCumul =
						ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.servicesPeriscolaire;
				}
			}
			if (aDonnees.listeProjetsAcc) {
				lListeCumuls.addElement(
					new ObjetElement_1.ObjetElement(
						ObjetTraduction_1.GTraductions.getValeur(
							"actualites.Cumul.ProjetsAccompagnement",
						),
						0,
						ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic
							.projetsAccompagnement,
					),
				);
			}
			if (aDonnees.listeFamilles) {
				aDonnees.listeFamilles.parcourir((aFamille) => {
					const lFiltreFamille = new ObjetElement_1.ObjetElement(
						aFamille.getLibelle(),
						0,
						ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic
							.famille,
					);
					lFiltreFamille.famille = aFamille;
					lListeCumuls.addElement(lFiltreFamille);
				});
			}
			lInstance.setListeCumuls(lListeCumuls);
			lInstance.setOptionsFenetreSelectionRessource({
				avecBarreTitre: true,
				avecFiltreDelegues: this._estResponsableAResponsable(),
			});
		}
		if (aDonnees.genre === Enumere_Ressource_1.EGenreRessource.Personnel) {
			const lListeCumuls = new ObjetListeElements_1.ObjetListeElements();
			lListeCumuls.add(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_SelectionPublic.Cumul.Aucun",
					),
					0,
					ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.sans,
					0,
				),
			);
			lListeCumuls.add(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("actualites.Cumul.Fonction"),
					0,
					ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.fonction,
					1,
				),
			);
			lInstance.setListeCumuls(lListeCumuls);
			lInstance.setOptions({
				getInfosSuppZonePrincipale(aParams) {
					return lInstance.getGenreCumul() !==
						ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic
							.fonction
						? UtilitaireMessagerie_1.UtilitaireMessagerie.getLibelleSuppListePublics(
								aParams.article,
							)
						: "";
				},
			});
		}
		if (
			[
				Enumere_Ressource_1.EGenreRessource.Enseignant,
				Enumere_Ressource_1.EGenreRessource.Responsable,
				Enumere_Ressource_1.EGenreRessource.Eleve,
			].includes(aDonnees.genre)
		) {
			lInstance.setOptions({
				getInfosSuppZonePrincipale(aParams) {
					return UtilitaireListePublics_1.UtilitaireListePublics.getLibelleSuppListePublics(
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
		if (
			lListePartiel &&
			aDonnees.genre === Enumere_Ressource_1.EGenreRessource.Enseignant
		) {
			aDonnees.listeComplet.parcourir((aElement) => {
				const lNumero = aElement.getNumero();
				aElement.estMembreEquipe =
					lListePartiel.getIndiceElementParFiltre((aElement) => {
						return aElement.getNumero() === lNumero;
					}) > -1;
			});
			lFiltres.push({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"actualites.filtre.equipePedagogique",
				),
				filtre: function (aElement, aChecked) {
					return aChecked ? aElement.estMembreEquipe : true;
				},
				checked: false,
			});
		}
		lInstance.setOptions({
			filtres: lFiltres,
			avecCocheRessources: true,
			avecBoutonRechercher: !this._estResponsableAResponsable(),
		});
		lInstance.setDonnees({
			listeRessources: aDonnees.listeComplet,
			listeRessourcesSelectionnees: MethodesObjet_1.MethodesObjet.dupliquer(
				aDonnees.listeSelectionnee,
			),
			genreRessource: aDonnees.genre,
			titre: this._estResponsableAResponsable()
				? ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_SelectionRessource.SelectionnerClasses",
					)
				: Enumere_Ressource_1.EGenreRessourceUtil.getTitreFenetreSelectionRessource(
						aDonnees.genre,
					),
			estGenreRessourceDUtilisateurConnecte:
				Enumere_Ressource_1.EGenreRessourceUtil.correspondAuGenreUtilisateurEspaceCourant(
					aDonnees.genre,
				),
			listeNiveauxResponsabilite: aDonnees.listeNiveauxResponsabilite,
		});
	}
	_evenementSurBoutonListeDiffusion() {
		if (
			!this.listesDiffusion &&
			Cache_1.GCache &&
			Cache_1.GCache.general.existeDonnee("listeDiffusion")
		) {
			this.listesDiffusion = Cache_1.GCache.general.getDonnee("listeDiffusion");
		}
		if (!this.listesDiffusion) {
			new ObjetRequeteListeDiffusion_1.ObjetRequeteListeDiffusion(
				this,
				this._actionApresRequeteListeDiffusion,
			).lancerRequete();
		} else {
			this._ouvrirSelecteurListeDiffusion();
		}
	}
	_actionApresRequeteListeDiffusion(aJSON) {
		if (aJSON && aJSON.liste) {
			this.listesDiffusion = aJSON.liste;
			if (Cache_1.GCache) {
				Cache_1.GCache.general.setDonnee("listeDiffusion", aJSON.liste);
			}
			this._ouvrirSelecteurListeDiffusion();
		}
	}
	_ouvrirSelecteurListeDiffusion() {
		this.listesDiffusion.parcourir((aElement) => {
			aElement.cmsActif = false;
		});
		this.getInstance(this.identFenetreSelectListeDiffusion).setDonnees(
			new DonneesListe_SelectionDiffusion_1.DonneesListe_SelectionDiffusion(
				this.listesDiffusion,
			),
		);
	}
	_viderPublic() {
		this.information.genresPublicEntite.clear();
		this.information.listePublicEntite =
			new ObjetListeElements_1.ObjetListeElements();
		this.information.listePublicIndividu =
			new ObjetListeElements_1.ObjetListeElements();
		this._actualiserPublic();
	}
	_actualiserPublic() {
		this._setCountDestinataires({ avecIndividus: true });
		this.information.avecModificationPublic = true;
		this.surModificationDest();
	}
	_evenementSurTab(aElement) {
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
	_existesDestinataires(aInformation) {
		let lResult = false;
		lResult =
			aInformation.genresPublicEntite.count() > 0 ||
			aInformation.listePublicEntite.getNbrElementsExistes() > 0 ||
			aInformation.listePublicIndividu.getNbrElementsExistes() > 0;
		return lResult;
	}
	_evenementFenetreClasses(
		aGenreRessource,
		aListeRessourcesSelectionnees,
		aNumeroBouton,
	) {
		if (aNumeroBouton === 1) {
			this.information.listePublicEntite = aListeRessourcesSelectionnees;
			this._setCountDestinataires({ avecIndividus: false });
			this.information.avecModificationPublic = true;
			this.surModificationDest();
		}
	}
	_evenementFenetreIndividu(
		aGenreRessource,
		aListeRessourcesSelectionnees,
		aNumeroBouton,
	) {
		if (aGenreRessource === Enumere_Ressource_1.EGenreRessource.Eleve) {
			new ObjetRequeteDonneesEditionInformation_1.ObjetRequeteDonneesEditionInformation(
				this,
				this._evenementApresFenetreIndividu.bind(
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
			this._evenementApresFenetreIndividu(
				aGenreRessource,
				aListeRessourcesSelectionnees,
				aNumeroBouton,
			);
		}
	}
	_evenementApresFenetreIndividu(
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
				MethodesObjet_1.MethodesObjet.dupliquer(aListeRessourcesSelectionnees),
			);
			const lTotal = this.setCountIndividus({ donneesEleve: aDonnees });
			if (
				!this.genresRessourceAffDestinataire ||
				this.genresRessourceAffDestinataire.length === 0
			) {
				this.listeOngletsDestinataires.setLibelle(
					1,
					ObjetTraduction_1.GTraductions.getValeur(
						"actualites.Edition.OngletIndividu",
						[lTotal],
					),
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
	_evenementFenetreListeDiffusion(aGenreBouton) {
		if (aGenreBouton === 1) {
			const lDiffusions = this.listesDiffusion.getListeElements((aElement) => {
				return !!aElement.cmsActif;
			});
			if (lDiffusions.count() > 0) {
				const lListe = MethodesObjet_1.MethodesObjet.dupliquer(
					this.information.listePublicIndividu,
				);
				for (let i = 0; i < lDiffusions.count(); i++) {
					const lDiffusion = lDiffusions.get(i);
					lDiffusion.listePublicIndividu.parcourir((aElement) => {
						const lIndice = lListe.getIndiceParElement(aElement);
						if (lIndice === null || lIndice === undefined) {
							lListe.addElement(
								MethodesObjet_1.MethodesObjet.dupliquer(aElement),
							);
						}
					});
				}
				this.information.listePublicIndividu = lListe;
				this._actualiserPublic();
			}
		}
	}
	_setDonneesTabs(aParam) {
		const lTabs = this.getInstance(this.identTabs);
		const lIndicePrec = lTabs.getIndiceOngletSelectionne();
		lTabs.setDonnees(this.listeOngletsDestinataires);
		let lIndiceSelect = this._estResponsableAResponsable() ? 2 : 0;
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
	_modifierGenrePublicEntite(aGenre, aChecked) {
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
	_composePanelDestinatairesPrimaire() {
		const T = [];
		const lWidthLibelle = 180;
		const lAvecTousLesBtns = this.genresRessourceAffDestinataire.length === 0;
		if (
			lAvecTousLesBtns ||
			this.genresRessourceAffDestinataire.includes(
				Enumere_Ressource_1.EGenreRessource.Responsable,
			)
		) {
			if (this.choixResponsableParEntite) {
				T.push(
					"<div>",
					'<span class="InlineBlock AlignementDroit" style="width:',
					lWidthLibelle,
					'px;" id="',
					this.id.labelEntite,
					'">',
					ObjetTraduction_1.GTraductions.getValeur(
						"actualites.ResponsablesPrimaire",
					),
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
					ObjetTraduction_1.GTraductions.getValeur("actualites.Responsables"),
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
			this.genresRessourceAffDestinataire.includes(
				Enumere_Ressource_1.EGenreRessource.Enseignant,
			)
		) {
			T.push(
				'<div class="EspaceHaut">',
				'<span class="InlineBlock AlignementDroit" style="width:',
				lWidthLibelle,
				'px;" id="',
				this.id.labelProfesseur,
				'">',
				ObjetTraduction_1.GTraductions.getValeur("actualites.Professeurs"),
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
			this.genresRessourceAffDestinataire.includes(
				Enumere_Ressource_1.EGenreRessource.Personnel,
			)
		) {
			T.push(
				'<div class="EspaceHaut">',
				'<div class="InlineBlock AlignementDroit" style="',
				ObjetStyle_1.GStyle.composeWidth(lWidthLibelle),
				'" id="',
				this.id.labelPersonnel,
				'">',
				ObjetTraduction_1.GTraductions.getValeur("actualites.Personnels"),
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
				ObjetTraduction_1.GTraductions.getValeur("actualites.Directeur"),
				"</ie-checkbox>",
				"</div>",
				"</div>",
			);
		}
		return T.join("");
	}
	_composePanelEntite() {
		const T = [];
		T.push(
			'<div class="NoWrap">',
			'<div class="InlineBlock AlignementMilieuVertical EspaceGauche" id="',
			this.id.labelEntite,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("actualites.Classes"),
			" ",
			ObjetTraduction_1.GTraductions.getValeur("actualites.Groupes"),
			"</div>",
			'<div class="InlineBlock AlignementMilieuVertical EspaceGauche EspaceDroit">',
			this.construitBtnRessourceEntite(),
			"</div>",
			'<div class="InlineBlock AlignementMilieuVertical EspaceGauche" id="',
			this.id.cbPublicElevesRattaches,
			'_pere"><div style="display:flex; align-items:center">',
			"<ie-checkbox ie-model=\"surSaisiePublic('rattaches')\">",
			ObjetTraduction_1.GTraductions.getValeur(
				"actualites.public.elevesRattaches",
			),
			"</ie-checkbox>",
			"</div></div>",
			"</div>",
		);
		T.push('<div class="flex-contain">');
		T.push('<div class="flex-contain cols GrandEspaceGauche">');
		T.push(
			'<div class="Texte10 EspaceHaut" style="display:flex; align-items:center">',
			"<ie-checkbox ie-model=\"surSaisiePublic('responsables')\">",
			ObjetTraduction_1.GTraductions.getValeur(
				"actualites.public.responsables",
			),
			"</ie-checkbox>",
			"</div>",
			'<div class="Texte10 PetitEspaceGauche p-top" title="',
			ObjetTraduction_1.GTraductions.getValeur(
				"actualites.public.hintrelatifAuxEnfants",
			),
			'" style="display:flex; align-items:center">',
			"<ie-radio ie-model=\"surSaisieGenreResp('enfants')\">",
			ObjetTraduction_1.GTraductions.getValeur(
				"actualites.public.relatifAuxEnfants",
			),
			"</ie-radio>",
			"</div>",
			'<div class="Texte10 PetitEspaceGauche p-top-s" title="',
			ObjetTraduction_1.GTraductions.getValeur(
				"actualites.public.hintresponsablesLegaux",
			),
			'" style="display:flex; align-items:center">',
			"<ie-radio ie-model=\"surSaisieGenreResp('legaux')\">",
			ObjetTraduction_1.GTraductions.getValeur(
				"actualites.public.responsablesLegaux",
			),
			"</ie-radio>",
			"</div>",
		);
		T.push("</div>");
		T.push('<div class="InlineBlock AlignementHaut GrandEspaceGauche">');
		T.push(
			this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionEleves,
			)
				? '<div class="Texte10 EspaceHaut" style="display:flex; align-items:center"><ie-checkbox ie-model="surSaisiePublic(\'eleves\')">' +
						ObjetTraduction_1.GTraductions.getValeur(
							"actualites.public.eleves",
						) +
						"</ie-checkbox></div>"
				: "",
		);
		T.push(
			'<div class="Texte10 EspaceHaut" style="display:flex; align-items:center"><ie-checkbox ie-model="surSaisiePublic(\'professeurs\')">',
			ObjetTraduction_1.GTraductions.getValeur("actualites.public.professeurs"),
			"</ie-checkbox></div>",
		);
		T.push("</div>");
		T.push('<div class="InlineBlock AlignementHaut GrandEspaceGauche">');
		T.push(
			this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionPersonnels,
			)
				? '<div class="Texte10 EspaceHaut" style="display:flex; align-items:center"><ie-checkbox ie-model="surSaisiePublic(\'personnels\')">' +
						ObjetTraduction_1.GTraductions.getValeur(
							"actualites.public.personnels",
						) +
						"</ie-checkbox></div>"
				: "",
		);
		T.push(
			this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionStages,
			)
				? '<div class="Texte10 EspaceHaut" style="display:flex; align-items:center"><ie-checkbox ie-model="surSaisiePublic(\'maitreDeStage\')">' +
						ObjetTraduction_1.GTraductions.getValeur(
							"actualites.public.maitreDeStage",
						) +
						"</ie-checkbox></div>"
				: "",
		);
		T.push("</div>");
		T.push("</div>");
		return T.join("");
	}
	_composePanelResponsables() {
		const T = [];
		const lStrLabel = ObjetTraduction_1.GTraductions.getValeur(
			"actualites.ResponsablesPrimaire",
		);
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
	_composePanelClasseGroupe() {
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
			ObjetTraduction_1.GTraductions.getValeur(
				"actualites.public.elevesRattaches",
			),
			"</ie-checkbox>",
			"</div>",
			"</div>",
		);
		T.push('<div class="PetitEspaceHaut NoWrap">');
		T.push('<div class="InlineBlock AlignementHaut EspaceGauche10">');
		T.push(
			'<div class="EspaceHaut">',
			"<ie-checkbox ie-model=\"surSaisiePublic('responsables')\">",
			ObjetTraduction_1.GTraductions.getValeur(
				"actualites.public.responsables",
			),
			"</ie-checkbox>",
			"</div>",
		);
		if (
			this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionEleves,
			)
		) {
			T.push(
				'<div class="EspaceHaut"><ie-checkbox ie-model="surSaisiePublic(\'eleves\')">',
				ObjetTraduction_1.GTraductions.getValeur("actualites.public.eleves"),
				"</ie-checkbox></div>",
			);
		}
		T.push("</div>");
		T.push('<div class="InlineBlock AlignementHaut GrandEspaceGauche">');
		T.push(
			'<div class="EspaceHaut"><ie-checkbox ie-model="surSaisiePublic(\'professeurs\')">',
			ObjetTraduction_1.GTraductions.getValeur("actualites.public.professeurs"),
			"</ie-checkbox></div>",
		);
		if (
			this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionPersonnels,
			)
		) {
			T.push(
				'<div class="EspaceHaut"><ie-checkbox ie-model="surSaisiePublic(\'personnels\')">',
				ObjetTraduction_1.GTraductions.getValeur(
					"actualites.public.personnels",
				),
				"</ie-checkbox></div>",
			);
		}
		T.push("</div>");
		if (
			this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionStages,
			)
		) {
			T.push(
				'<div class="InlineBlock AlignementHaut GrandEspaceGauche">',
				'<div class="EspaceHaut"><ie-checkbox ie-model="surSaisiePublic(\'maitreDeStage\')">',
				ObjetTraduction_1.GTraductions.getValeur(
					"actualites.public.maitreDeStage",
				),
				"</ie-checkbox></div>",
				"</div>",
			);
		}
		T.push("</div>");
		return T.join("");
	}
	_composePanelIndividu() {
		const T = [];
		const lEleve =
			ObjetTraduction_1.GTraductions.getValeur("actualites.Eleves");
		const lProf = ObjetTraduction_1.GTraductions.getValeur(
			"actualites.Professeurs",
		);
		let lWidthA = ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
			lEleve,
			10,
			false,
		);
		let lWidthB = ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
			lProf,
			10,
			false,
		);
		const lWidth1 = lWidthA > lWidthB ? lWidthA + 5 : lWidthB + 5;
		const lResp = ObjetTraduction_1.GTraductions.getValeur(
			"actualites.Responsables",
		);
		const lPers = ObjetTraduction_1.GTraductions.getValeur(
			"actualites.Personnels",
		);
		lWidthA = ObjetChaine_1.GChaine.getLongueurChaineDansDiv(lResp, 10, false);
		lWidthB = ObjetChaine_1.GChaine.getLongueurChaineDansDiv(lPers, 10, false);
		const lWidth2 = lWidthA > lWidthB ? lWidthA + 5 : lWidthB + 5;
		const lMDS = ObjetTraduction_1.GTraductions.getValeur(
			"actualites.MaitresDeStage",
		);
		const lInsp = ObjetTraduction_1.GTraductions.getValeur(
			"actualites.Inspecteurs",
		);
		lWidthA = ObjetChaine_1.GChaine.getLongueurChaineDansDiv(lMDS, 10, false);
		lWidthB = ObjetChaine_1.GChaine.getLongueurChaineDansDiv(lInsp, 10, false);
		const lWidth3 = lWidthA > lWidthB ? lWidthA + 5 : lWidthB + 5;
		T.push('<div class="NoWrap p-all-s">');
		T.push(
			'<div class="InlineBlock AlignementHaut EspaceGauche GrandEspaceDroit">',
		);
		if (
			this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionEleves,
			)
		) {
			T.push(
				'<div class="NoWrap EspaceBas">',
				'<div class="InlineBlock AlignementMilieuVertical AlignementDroit" style="',
				ObjetStyle_1.GStyle.composeWidth(lWidth1),
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
			ObjetStyle_1.GStyle.composeWidth(lWidth1),
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
			ObjetStyle_1.GStyle.composeWidth(lWidth2),
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
		if (
			this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionPersonnels,
			)
		) {
			T.push(
				'<div class="NoWrap">',
				'<div class="InlineBlock AlignementMilieuVertical AlignementDroit" style="',
				ObjetStyle_1.GStyle.composeWidth(lWidth2),
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
		if (
			this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionStages,
			)
		) {
			T.push(
				'<div class="NoWrap EspaceBas">',
				'<div class="InlineBlock AlignementMilieuVertical AlignementDroit" style="',
				ObjetStyle_1.GStyle.composeWidth(lWidth3),
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
		if (
			this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionIPR,
			)
		) {
			T.push(
				'<div class="NoWrap">',
				'<div class="InlineBlock AlignementMilieuVertical AlignementDroit" style="',
				ObjetStyle_1.GStyle.composeWidth(lWidth3),
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
	_composePanelIndividuSimple(aGenres) {
		const T = [];
		let lAvecDroitFonctionnel = true;
		let lTraduction, lIDLabel, lStrBouton, lIDCount;
		const lTailleLibelle = 90;
		for (const i in aGenres) {
			const lGenre = aGenres[i];
			switch (lGenre) {
				case Enumere_Ressource_1.EGenreRessource.Enseignant:
					lAvecDroitFonctionnel = true;
					lTraduction = ObjetTraduction_1.GTraductions.getValeur(
						"actualites.Professeurs",
					);
					lIDLabel = this.id.labelProfesseur;
					lStrBouton = this.construitBtnRessourceEnseignant();
					lIDCount = this.id.countProfesseur;
					break;
				case Enumere_Ressource_1.EGenreRessource.Eleve:
					lAvecDroitFonctionnel = this.appSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionEleves,
					);
					lTraduction =
						ObjetTraduction_1.GTraductions.getValeur("actualites.Eleves");
					lIDLabel = this.id.labelEleve;
					lStrBouton = this.construitBtnRessourceEleve();
					lIDCount = this.id.countEleve;
					break;
				case Enumere_Ressource_1.EGenreRessource.Responsable:
					lAvecDroitFonctionnel = true;
					lTraduction = ObjetTraduction_1.GTraductions.getValeur(
						"actualites.Responsables",
					);
					lIDLabel = this.id.labelResponsable;
					lStrBouton = this.construitBtnRessourceResponsable();
					lIDCount = this.id.countResponsable;
					break;
				case Enumere_Ressource_1.EGenreRessource.Personnel:
					lAvecDroitFonctionnel = this.appSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionPersonnels,
					);
					lTraduction = ObjetTraduction_1.GTraductions.getValeur(
						"actualites.Personnels",
					);
					lIDLabel = this.id.labelPersonnel;
					lStrBouton = this.construitBtnRessourcePersonnel();
					lIDCount = this.id.countPersonnel;
					break;
				case Enumere_Ressource_1.EGenreRessource.MaitreDeStage:
					lAvecDroitFonctionnel = this.appSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionStages,
					);
					lTraduction = ObjetTraduction_1.GTraductions.getValeur(
						"actualites.MaitresDeStage",
					);
					lIDLabel = this.id.labelMaitreDeStage;
					lStrBouton = this.construitBtnRessourceMaitreDeStage();
					lIDCount = this.id.countMaitreDeStage;
					break;
				case Enumere_Ressource_1.EGenreRessource.InspecteurPedagogique:
					lAvecDroitFonctionnel = this.appSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionIPR,
					);
					lTraduction = ObjetTraduction_1.GTraductions.getValeur(
						"actualites.Inspecteurs",
					);
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
				if (lGenre === Enumere_Ressource_1.EGenreRessource.Eleve) {
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
	avecListeDiffusionSelonEspace() {
		return (
			[
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.Etablissement,
				Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
				Enumere_Espace_1.EGenreEspace.Administrateur,
				Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
				Enumere_Espace_1.EGenreEspace.PrimMairie,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimMairie,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
			].indexOf(this.etatUtilSco.GenreEspace) >= 0
		);
	}
	_composeDestinataires() {
		const lHauteurPanelSeul = this.height.zoneDestinataires - 15;
		const lAvecListeDiffusion = this.avecListeDiffusionSelonEspace();
		const T = [];
		if (this.etatUtilSco.pourPrimaire()) {
			T.push(
				'<div class="flex-contain">',
				'<div class="fix-bloc p-top-l p-right-l flex-contain cols" style="width: 36px;">',
			);
			if (lAvecListeDiffusion) {
				T.push(
					`<div class="EspaceBas">${UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnListesDiffusion("btnAfficherListesDiffusion")}</div>`,
				);
			}
			T.push(
				`<div>${UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnSupprimer("btnSupprimerDestinataires")}</div>`,
			);
			T.push(
				"</div>",
				'<div class="fluid-bloc flex-contain cols">',
				"<fieldset>",
				`<legend>${ObjetTraduction_1.GTraductions.getValeur("actualites.Edition.Destinataires")}</legend>`,
				`<div class="content-wrapper" style="height: ${lHauteurPanelSeul}px;" id="${this.id.panelDestinatairePrimaire}">${this._composePanelDestinatairesPrimaire()}</div>`,
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
					`<div class="EspaceBas">${UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnListesDiffusion("btnAfficherListesDiffusion")}</div>`,
				);
			}
			T.push(
				`<div>${UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnSupprimer("btnSupprimerDestinataires")}</div>`,
			);
			T.push(
				"</div>",
				'<div class="fluid-bloc flex-contain cols">',
				`<div class="conteneur-tabs" id="${this.getNomInstance(this.identTabs)}"></div>`,
				`<div class="fluid-bloc tabs-contenu with-border">`,
				`<div id="${this.id.panelDestinataireEntite}">${this._composePanelEntite()}</div>`,
				`<div id="${this.id.panelDestinataireIndividuel}">${this._composePanelIndividu()}</div>`,
				`<div id="${this.id.panelDestinataireResponsables}">${this._composePanelResponsables()}</div>`,
				"</div>",
				"</div>",
				"</div>",
			);
		} else {
			if (
				this.estGenreInGenresRessourceAffDestinataire(
					Enumere_Ressource_1.EGenreRessource.Classe,
				) ||
				this.estGenreInGenresRessourceAffDestinataire(
					Enumere_Ressource_1.EGenreRessource.Groupe,
				)
			) {
				T.push(
					"<fieldset>",
					"<legend>",
					ObjetTraduction_1.GTraductions.getValeur(
						"actualites.Edition.Destinataires",
					),
					"</legend>",
					'<div class="content-wrapper" style="height: ',
					lHauteurPanelSeul,
					'px;" id="',
					this.id.panelDestinataireEntite,
					'">',
					this._composePanelClasseGroupe(),
					"</div>",
					"</fieldset>",
				);
			} else {
				T.push(
					"<fieldset>",
					"<legend>",
					ObjetTraduction_1.GTraductions.getValeur(
						"actualites.Edition.Destinataires",
					),
					"</legend>",
					'<div class="content-wrapper" style="height: ',
					lHauteurPanelSeul,
					'px;" id="',
					this.id.panelDestinataireIndividuel,
					'">',
					this._composePanelIndividuSimple(this.genresRessourceAffDestinataire),
					"</div>",
					"</fieldset>",
				);
			}
		}
		return T.join("");
	}
	_compose() {
		if (!this.information) {
			return "";
		}
		return IE.jsx.str(
			"div",
			{ id: this.id.destinataires, class: "full-height" },
			this._composeDestinataires(),
		);
	}
}
exports.ObjetDestinatairesActualite = ObjetDestinatairesActualite;
