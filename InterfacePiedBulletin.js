exports.InterfacePiedBulletin = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTabOnglets_1 = require("ObjetTabOnglets");
const PiedBulletin_Appreciations_1 = require("PiedBulletin_Appreciations");
const PiedBulletin_AppreciationsAnnuelles_1 = require("PiedBulletin_AppreciationsAnnuelles");
const PiedBulletin_Certificats_1 = require("PiedBulletin_Certificats");
const PiedBulletin_Competences_1 = require("PiedBulletin_Competences");
const PiedBulletin_Orientations_1 = require("PiedBulletin_Orientations");
const PiedBulletin_ModulesDivers_1 = require("PiedBulletin_ModulesDivers");
const PiedBulletin_ModulesDivers_2 = require("PiedBulletin_ModulesDivers");
const PiedBulletin_ModulesDivers_3 = require("PiedBulletin_ModulesDivers");
const PiedBulletin_ModulesDivers_4 = require("PiedBulletin_ModulesDivers");
const PiedBulletin_ModulesDivers_5 = require("PiedBulletin_ModulesDivers");
const PiedBulletin_ModulesDivers_6 = require("PiedBulletin_ModulesDivers");
const PiedBulletin_ModulesDivers_7 = require("PiedBulletin_ModulesDivers");
const PiedBulletin_ParcoursEducatif_1 = require("PiedBulletin_ParcoursEducatif");
const TypeContexteBulletin_1 = require("TypeContexteBulletin");
const TypeModeAffichagePiedBulletin_1 = require("TypeModeAffichagePiedBulletin");
const TypeModuleFonctionnelPiedBulletin_1 = require("TypeModuleFonctionnelPiedBulletin");
const AccessApp_1 = require("AccessApp");
class InterfacePiedBulletin extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.hauteurTabOnglets = 20;
		this.hauteurContenuTabOnglets = 200;
		this.idPiedBulletin = this.Nom + "_PiedBull";
		this.idContenu = this.Nom + "_Contenu";
		this.initParams();
	}
	setOptions(aOptions) {
		if (aOptions && aOptions.hauteurContenu) {
			this.hauteurContenuTabOnglets = aOptions.hauteurContenu;
		}
		return this;
	}
	initParams() {
		this.params = {
			modeAffichage:
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Onglets,
			modulesParDefaut: [
				TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
					.MFPB_Appreciations,
			],
			typeReleveBulletin: null,
			modeSaisie: false,
			contexte: TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve,
			avecContenuVide: false,
			avecValidationAuto: false,
			clbckValidationAutoSurEdition: null,
		};
		this.horsOnglets = [];
		this.onglets = [];
	}
	estModeAffichage(aMode) {
		return this.params.modeAffichage === aMode;
	}
	resetIdentInstances() {
		this.identOnglets = null;
		this.identVieScolaire = null;
		this.identCertificats = null;
		this.identOrientations = null;
		this.identAppreciations = null;
		this.identAppreciationsGeneralesAnnuelles = null;
		this.identAppreciationsAnnuelles = null;
		this.identParcoursEducatif = null;
		this.identStages = null;
		this.identCompetences = null;
		this.identMentions = null;
		this.identLegende = null;
		this.identProjets = null;
		this.identCredits = null;
		this.identEngagements = null;
	}
	construireInstances() {
		this.resetIdentInstances();
		if (
			this.estModeAffichage(
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Onglets,
			)
		) {
			this.identOnglets = this.add(
				ObjetTabOnglets_1.ObjetTabOnglets,
				this._evntSurTabOnglets.bind(this),
				this._initTabOnglets.bind(this),
			);
		}
		const lModules =
			TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletinUtil.getTabTousLesModules();
		const lNbr = lModules.length;
		for (let i = 0; i < lNbr; i++) {
			const lModule = lModules[i];
			if (this._avecMFPB(lModule)) {
				this._instancierMFPB(lModule);
			}
		}
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = false;
	}
	construireStructureAffichageAutre() {
		const T = [];
		T.push('<div id="', this.idPiedBulletin, '" style="display:none;">');
		T.push(
			this._construireContenuModules({
				tabModules: this.horsOnglets,
				style: "EspaceBas",
			}),
		);
		switch (this.params.modeAffichage) {
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Onglets:
				T.push(this._construireModeTabOnglets());
				break;
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Lineaire:
				T.push(this._construireModeLineaire());
				break;
			default:
				break;
		}
		T.push("</div>");
		return T.join("");
	}
	setDonnees(aParam) {
		var _a;
		$.extend(true, this.params, aParam);
		this.donneesRecues = true;
		this._setDonneesModulesFonctionnels(aParam);
		if (this.idPiedBulletin) {
			$("#" + this.idPiedBulletin.escapeJQ()).css({ display: "block" });
		}
		this.construireAffichage();
		this._afficherModules({ tabModules: this.horsOnglets });
		if (
			this.estModeAffichage(
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Onglets,
			)
		) {
			const lNbr = this.listeOnglets.count();
			for (let i = 0; i < lNbr; i++) {
				const lElt = this.listeOnglets.get(i);
				const lGenreModule = lElt.Genre;
				const lIdent = this._getIdentDeMFPB(lGenreModule);
				if (lIdent !== null && lIdent !== undefined) {
					const lInstance = this.getInstance(lIdent);
					lElt.invisible = !lInstance.estAffiche();
				}
			}
			let lExisteOngletVisible = false;
			this.params.modulesParDefaut.every((aModuleGenre) => {
				for (let i = 0; i < lNbr; i++) {
					const lElt = this.listeOnglets.get(i);
					if (!lElt.invisible) {
						lExisteOngletVisible = true;
						if (lElt.getGenre() === aModuleGenre) {
							this.ongletSelectionne = i;
							return false;
						}
					}
				}
				return true;
			});
			if (!lExisteOngletVisible) {
				this.ongletSelectionne = 0;
			}
			const lOnglet = this.listeOnglets.get(this.ongletSelectionne);
			if (lOnglet === null || lOnglet === void 0 ? void 0 : lOnglet.invisible) {
				this.ongletSelectionne =
					(_a = this.listeOnglets.getIndiceElementParFiltre(
						(aOnglet) => !aOnglet.invisible,
					)) !== null && _a !== void 0
						? _a
						: 0;
			}
			this.getInstance(this.identOnglets).setDonnees(this.listeOnglets);
			if (lExisteOngletVisible) {
				$("#" + this.getInstance(this.identOnglets).getNom().escapeJQ()).css({
					display: "block",
				});
				$("#" + this.idContenu.escapeJQ()).css({ display: "block" });
				this._afficherModules({ tabModules: this.onglets });
				this.getInstance(this.identOnglets).selectOnglet(
					this.ongletSelectionne,
				);
			} else {
				$("#" + this.getInstance(this.identOnglets).getNom().escapeJQ()).css({
					display: "none",
				});
				$("#" + this.idContenu.escapeJQ()).css({ display: "none" });
			}
		} else {
			this._afficherModules({ tabModules: this.onglets });
		}
	}
	construireAffichage() {
		if (this.donneesRecues) {
			if (
				[
					TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
						.MAPB_Onglets,
					TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
						.MAPB_Lineaire,
				].includes(this.params.modeAffichage)
			) {
				const lModules = [
					TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
						.MFPB_ParcoursEducatif,
					TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
						.MFPB_Competences,
					TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
						.MFPB_Certificats,
					TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
						.MFPB_Appreciations,
					TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
						.MFPB_Appreciations_Annuelles,
					TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
						.MFPB_Appreciations_Generales_Annuelles,
				];
				const lNbr = lModules.length;
				for (let i = 0; i < lNbr; i++) {
					const lInstance = this._getInstanceDeMFPB(lModules[i]);
					if (lInstance !== null) {
						lInstance.reinitialiser();
					}
				}
			}
			super.construireAffichage();
		}
		return "";
	}
	_setDonneesModulesFonctionnels(aParam) {
		const lModules =
			TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletinUtil.getTabTousLesModules();
		const lNbr = lModules.length;
		for (let i = 0; i < lNbr; i++) {
			const lModule = lModules[i];
			const lInstance = this._getInstanceDeMFPB(lModule);
			if (lInstance !== null) {
				const lPiedDePage = aParam.donnees;
				switch (lModule) {
					case TypeModuleFonctionnelPiedBulletin_1
						.TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire:
						lInstance.setDonnees({ absences: aParam.absences });
						break;
					case TypeModuleFonctionnelPiedBulletin_1
						.TypeModuleFonctionnelPiedBulletin.MFPB_Certificats:
						lInstance.setDonnees({
							listeAttestations: lPiedDePage.ListeAttestations,
							listeAttestationsEleve: lPiedDePage.ListeAttestationsEleve,
							eleve: lPiedDePage.eleve,
						});
						break;
					case TypeModuleFonctionnelPiedBulletin_1
						.TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations:
						lInstance.setDonnees({
							appreciations: lPiedDePage.ListeAppreciations,
							mentions: lPiedDePage.listeMentions,
							avecSaisieAG: lPiedDePage.avecSaisieAG,
						});
						break;
					case TypeModuleFonctionnelPiedBulletin_1
						.TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations_Annuelles:
						lInstance.setDonnees({
							colonnes: lPiedDePage.ListeAppreciations.appreciationAnnuelle,
							periodes: lPiedDePage.ListeAppreciations.periodes,
							mentions: lPiedDePage.listeMentions,
							options: aParam.options,
						});
						break;
					case TypeModuleFonctionnelPiedBulletin_1
						.TypeModuleFonctionnelPiedBulletin
						.MFPB_Appreciations_Generales_Annuelles:
						lInstance.setDonnees({
							colonnes: lPiedDePage.ListeAppreciations.generalAnnuelle,
							periodes: lPiedDePage.ListeAppreciations.periodes,
							mentions: lPiedDePage.listeMentions,
						});
						break;
					case TypeModuleFonctionnelPiedBulletin_1
						.TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif:
						lInstance.setDonnees({
							contexte: this.params.contexte,
							libelleUtilisateur: lPiedDePage.libelleUtilisateur,
							listeGenreParcours: lPiedDePage.listeGenreParcours,
							listeEvntsParcoursPeda: lPiedDePage.listeEvntsParcoursPeda,
							periodeCloture: lPiedDePage.periodeCloture,
							droits: {
								avecSaisie:
									this.params.modeSaisie &&
									(0, AccessApp_1.getApp)().droits.get(
										ObjetDroitsPN_1.TypeDroits.eleves
											.avecSaisieParcoursPedagogique,
									),
							},
						});
						break;
					case TypeModuleFonctionnelPiedBulletin_1
						.TypeModuleFonctionnelPiedBulletin.MFPB_Competences:
						lInstance.setDonnees({
							listePiliers: lPiedDePage.listePiliers,
							avecValidationAuto: lPiedDePage.avecValidationAuto,
						});
						break;
					case TypeModuleFonctionnelPiedBulletin_1
						.TypeModuleFonctionnelPiedBulletin.MFPB_Stages:
						lInstance.setDonnees({ listeStages: lPiedDePage.listeStages });
						break;
					case TypeModuleFonctionnelPiedBulletin_1
						.TypeModuleFonctionnelPiedBulletin.MFPB_Orientations:
						lInstance.setDonnees({ objetOrientation: lPiedDePage.Orientation });
						break;
					case TypeModuleFonctionnelPiedBulletin_1
						.TypeModuleFonctionnelPiedBulletin.MFPB_Mentions:
						lInstance.setDonnees({
							listeMentionsClasse: lPiedDePage.ListeMentionsClasse,
						});
						break;
					case TypeModuleFonctionnelPiedBulletin_1
						.TypeModuleFonctionnelPiedBulletin.MFPB_Legende:
						lInstance.setDonnees({ legende: lPiedDePage.legende });
						break;
					case TypeModuleFonctionnelPiedBulletin_1
						.TypeModuleFonctionnelPiedBulletin.MFPB_Projets:
						lInstance.setDonnees({ listeProjets: lPiedDePage.ListeProjets });
						break;
					case TypeModuleFonctionnelPiedBulletin_1
						.TypeModuleFonctionnelPiedBulletin.MFPB_Credits:
						lInstance.setDonnees({ listeCredits: lPiedDePage.listeCredits });
						break;
					case TypeModuleFonctionnelPiedBulletin_1
						.TypeModuleFonctionnelPiedBulletin.MFPB_Engagements:
						lInstance.setDonnees({
							listeEngagements: lPiedDePage.listeEngagements,
						});
						break;
				}
			}
		}
	}
	_construireContenuModules(aParam) {
		const T = [];
		const lNbr = aParam.tabModules.length;
		for (let i = 0; i < lNbr; i++) {
			const lInstance = this._getInstanceDeMFPB(aParam.tabModules[i]);
			if (lInstance !== null) {
				const lClass = aParam.style ? 'class="' + aParam.style + '"' : "";
				T.push(
					"<div ",
					lClass,
					' id="',
					lInstance.getNom(),
					'" style="height:100%; overflow:auto">',
					"</div>",
				);
			}
		}
		return T.join("");
	}
	_afficherModules(aParam) {
		const lNbr = aParam.tabModules.length;
		for (let i = 0; i < lNbr; i++) {
			const lInstance = this._getInstanceDeMFPB(aParam.tabModules[i]);
			if (lInstance !== null) {
				if (lInstance.estAffiche()) {
					lInstance.afficher({ modeAffichage: this.params.modeAffichage });
				} else {
					$("#" + lInstance.getNom().escapeJQ()).css({ display: "none" });
				}
			}
		}
	}
	_surSelectionModule(aParam) {
		const lInstance = this._getInstanceDeMFPB(aParam.module);
		if (lInstance !== null) {
			$("#" + lInstance.getNom().escapeJQ())
				.show()
				.siblings()
				.hide();
			if ("surResizeInterface" in lInstance && lInstance.surResizeInterface) {
				lInstance.surResizeInterface();
			}
			if (
				"actualiserSurChangementTabOnglet" in lInstance &&
				lInstance.actualiserSurChangementTabOnglet
			) {
				lInstance.actualiserSurChangementTabOnglet();
			}
		}
	}
	setParametres(aParam) {
		this.initParams();
		$.extend(true, this.params, aParam);
		this.horsOnglets = this.params.modulesHorsOnglets;
		this.onglets = this.params.modulesOnglets;
	}
	getDonneesSaisie() {
		if (
			[
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Onglets,
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Lineaire,
			].includes(this.params.modeAffichage)
		) {
			const lResult = {};
			const lModules = [
				TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
					.MFPB_Appreciations,
				TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
					.MFPB_Appreciations_Generales_Annuelles,
				TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
					.MFPB_Appreciations_Annuelles,
				TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
					.MFPB_ParcoursEducatif,
				TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
					.MFPB_Certificats,
				TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
					.MFPB_Competences,
			];
			const lNbr = lModules.length;
			for (let i = 0; i < lNbr; i++) {
				const lModule = lModules[i];
				const lInstance = this._getInstanceDeMFPB(lModule);
				if (lInstance !== null) {
					$.extend(lResult, this._getDonneesSaisieDeMFPB(lModule, lInstance));
				}
			}
			return lResult;
		}
	}
	evenementSurAssistant() {
		const lInstance = this._getInstanceDeMFPB(
			TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Appreciations,
		);
		if (lInstance !== null) {
			lInstance.evenementSurAssistant();
		}
	}
	_construireModeTabOnglets() {
		const T = [];
		T.push(
			`<div class="conteneur-tabs" id="${this.getInstance(this.identOnglets).getNom()}"></div>`,
		);
		T.push(
			'<div id="',
			this.idContenu,
			'" class="tabs-contenu" style="height:',
			this.hauteurContenuTabOnglets,
			'px;">',
		);
		T.push(this._construireContenuModules({ tabModules: this.onglets }));
		T.push("</div>");
		return T.join("");
	}
	_construireModeLineaire() {
		const T = [];
		T.push(
			this._construireContenuModules({
				tabModules: this.onglets,
				style: "EspaceBas",
			}),
		);
		return T.join("");
	}
	_instancierMFPB(aModule) {
		switch (aModule) {
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_VieScolaire:
				this.identVieScolaire = this.add(
					PiedBulletin_ModulesDivers_1.PiedBulletin_VieScolaire,
				);
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Certificats:
				this.identCertificats = this.add(
					PiedBulletin_Certificats_1.PiedBulletin_Certificats,
					null,
					this._initPBCertificats.bind(this),
				);
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Appreciations:
				this.identAppreciations = this.add(
					PiedBulletin_Appreciations_1.PiedBulletin_Appreciations,
					this._evntPBAppr.bind(this),
					this._initPBAppr.bind(this),
				);
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Appreciations_Generales_Annuelles:
				this.identAppreciationsGeneralesAnnuelles = this.add(
					PiedBulletin_AppreciationsAnnuelles_1.PiedBulletin_AppreciationsAnnuelles,
					this._evntPBAppr.bind(this),
					this._initPBAppreciationsAnnuelles.bind(this, true),
				);
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Appreciations_Annuelles:
				this.identAppreciationsAnnuelles = this.add(
					PiedBulletin_AppreciationsAnnuelles_1.PiedBulletin_AppreciationsAnnuelles,
					this._evntPBAppr.bind(this),
					this._initPBAppreciationsAnnuelles.bind(this, false),
				);
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_ParcoursEducatif:
				this.identParcoursEducatif = this.add(
					PiedBulletin_ParcoursEducatif_1.PiedBulletin_ParcoursEducatif,
					null,
					this._initPBParcoursEduc.bind(this),
				);
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Competences:
				this.identCompetences = this.add(
					PiedBulletin_Competences_1.PiedBulletin_Competences,
					null,
					this._initPBCompetences.bind(this),
				);
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Stages:
				this.identStages = this.add(
					PiedBulletin_ModulesDivers_2.PiedBulletin_Stages,
				);
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Orientations:
				this.identOrientations = this.add(
					PiedBulletin_Orientations_1.PiedBulletin_Orientations,
					null,
					this._initPBOrientations.bind(this),
				);
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Mentions:
				this.identMentions = this.add(
					PiedBulletin_ModulesDivers_3.PiedBulletin_Mentions,
					null,
					this._initPBMentions.bind(this),
				);
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Legende:
				this.identLegende = this.add(
					PiedBulletin_ModulesDivers_4.PiedBulletin_Legende,
				);
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Projets:
				this.identProjets = this.add(
					PiedBulletin_ModulesDivers_5.PiedBulletin_Projets,
				);
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Credits:
				this.identCredits = this.add(
					PiedBulletin_ModulesDivers_6.PiedBulletin_Credits,
				);
				break;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Engagements:
				this.identEngagements = this.add(
					PiedBulletin_ModulesDivers_7.PiedBulletin_Engagements,
				);
				break;
		}
	}
	_avecMFPB(aModule) {
		return this.horsOnglets.includes(aModule) || this.onglets.includes(aModule);
	}
	_getIdentDeMFPB(aModule) {
		switch (aModule) {
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_VieScolaire:
				return this.identVieScolaire;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Projets:
				return this.identProjets;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Certificats:
				return this.identCertificats;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_ParcoursEducatif:
				return this.identParcoursEducatif;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Stages:
				return this.identStages;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Competences:
				return this.identCompetences;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Orientations:
				return this.identOrientations;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Appreciations:
				return this.identAppreciations;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Appreciations_Annuelles:
				return this.identAppreciationsAnnuelles;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Appreciations_Generales_Annuelles:
				return this.identAppreciationsGeneralesAnnuelles;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Mentions:
				return this.identMentions;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Legende:
				return this.identLegende;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Credits:
				return this.identCredits;
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Engagements:
				return this.identEngagements;
			default:
				break;
		}
	}
	_getInstanceDeMFPB(aModule) {
		const lIdent = this._getIdentDeMFPB(aModule);
		if (
			lIdent !== null &&
			lIdent !== undefined &&
			this.getInstance(lIdent) !== null &&
			this.getInstance(lIdent) !== undefined
		) {
			return this.getInstance(lIdent);
		}
		return null;
	}
	_getDonneesSaisieDeMFPB(aModule, aInstance) {
		switch (aModule) {
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Appreciations:
				return { appreciations: aInstance.getDonneesSaisie() };
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Appreciations_Annuelles:
				return { appreciations: aInstance.getDonneesSaisie() };
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Appreciations_Generales_Annuelles:
				return { appreciationsGenerales: aInstance.getDonneesSaisie() };
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_ParcoursEducatif:
				return { parcoursEducatif: aInstance.getDonneesSaisie() };
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Certificats:
				return { certificats: aInstance.getDonneesSaisie() };
			case TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
				.MFPB_Competences:
				return { competences: aInstance.getDonneesSaisie() };
		}
	}
	_initPBAppr(aInstance) {
		aInstance.setParametres({
			modeAffichage: this.params.modeAffichage,
			modeSaisie: this.params.modeSaisie,
			avecContenuVide: this.params.avecContenuVide,
			contexte: this.params.contexte,
			typeReleveBulletin: this.params.typeReleveBulletin,
			avecValidationAuto: this.params.avecValidationAuto,
			clbckValidationAutoSurEdition: this.params.clbckValidationAutoSurEdition,
		});
	}
	_initPBAppreciationsAnnuelles(aGlobal, aInstance) {
		aInstance.setParametres({
			modeAffichage: this.params.modeAffichage,
			modeSaisie: this.params.modeSaisie,
			avecContenuVide: this.params.avecContenuVide,
			contexte: this.params.contexte,
			typeReleveBulletin: this.params.typeReleveBulletin,
			global: aGlobal,
			avecValidationAuto: this.params.avecValidationAuto,
			clbckValidationAutoSurEdition: this.params.clbckValidationAutoSurEdition,
		});
	}
	_evntPBAppr(aParam) {
		if (this.callback !== null && this.callback !== undefined) {
			this.callback.appel(aParam);
		}
	}
	_initPBOrientations(aInstance) {
		aInstance.setParametres({
			contexte: this.params.contexte,
			modeAffichage: this.params.modeAffichage,
			avecContenuVide: this.params.avecContenuVide,
		});
	}
	_initPBParcoursEduc(aInstance) {
		aInstance.setParametres({
			avecContenuVide: this.params.avecContenuVide,
			avecTitreModule: this.horsOnglets.includes(
				TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
					.MFPB_ParcoursEducatif,
			),
		});
	}
	_initPBCertificats(aInstance) {
		aInstance.setParametres({
			avecContenuVide: this.params.avecContenuVide,
			avecTitreModule: this.horsOnglets.includes(
				TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
					.MFPB_Certificats,
			),
		});
	}
	_initPBCompetences(aInstance) {
		aInstance.setParametres({
			avecTitreModule: this.horsOnglets.includes(
				TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
					.MFPB_Competences,
			),
		});
	}
	_initPBMentions(aInstance) {
		aInstance.setParametres({ modeAffichage: this.params.modeAffichage });
	}
	_getListeTabOnglets() {
		const lListeOnglets = new ObjetListeElements_1.ObjetListeElements();
		const lNbr = this.onglets.length;
		for (let i = 0; i < lNbr; i++) {
			const lGenre = this.onglets[i];
			lListeOnglets.addElement(
				new ObjetElement_1.ObjetElement(
					TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletinUtil.getLibelle(
						lGenre,
					),
					0,
					lGenre,
				),
			);
		}
		return lListeOnglets;
	}
	_initTabOnglets(aInstance) {
		this.listeOnglets = this._getListeTabOnglets();
		aInstance.setParametres(this.listeOnglets);
		aInstance.setOptions({ hauteur: this.hauteurTabOnglets });
		this.ongletSelectionne = 0;
		aInstance.ongletSelectionne = this.ongletSelectionne;
	}
	_evntSurTabOnglets(aElement) {
		this.ongletSelectionne = aElement.Numero;
		this._surSelectionModule({ module: aElement.Genre });
	}
}
exports.InterfacePiedBulletin = InterfacePiedBulletin;
