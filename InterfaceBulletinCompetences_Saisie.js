exports.InterfaceBulletinCompetences_Saisie = void 0;
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const _InterfaceBulletinCompetences_1 = require("_InterfaceBulletinCompetences");
const DonneesListe_BulletinCompetences_1 = require("DonneesListe_BulletinCompetences");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_TypeAppreciation_1 = require("Enumere_TypeAppreciation");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const ObjetFenetre_AssistantSaisie_1 = require("ObjetFenetre_AssistantSaisie");
const EBoutonFenetreAssistantSaisie_1 = require("EBoutonFenetreAssistantSaisie");
const ObjetFenetre_ElementsProgramme_1 = require("ObjetFenetre_ElementsProgramme");
const ObjetFenetre_Mention_1 = require("ObjetFenetre_Mention");
const ObjetRequeteSaisieBulletinCompetences_1 = require("ObjetRequeteSaisieBulletinCompetences");
const TypeContexteBulletin_1 = require("TypeContexteBulletin");
const TypeGenreAppreciation_1 = require("TypeGenreAppreciation");
const TypeGenreValidationCompetence_1 = require("TypeGenreValidationCompetence");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const ObjetRequeteSaisieDetailEvalCompetences_1 = require("ObjetRequeteSaisieDetailEvalCompetences");
const InterfacePiedBulletin_1 = require("InterfacePiedBulletin");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const TypeModeValidationAuto_1 = require("TypeModeValidationAuto");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const UtilitaireBulletin_1 = require("UtilitaireBulletin");
const ObjetMoteurAssistantSaisie_1 = require("ObjetMoteurAssistantSaisie");
const ObjetMoteurGrilleSaisie_1 = require("ObjetMoteurGrilleSaisie");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
class InterfaceBulletinCompetences_Saisie extends _InterfaceBulletinCompetences_1._InterfaceBulletinCompetences {
	constructor(...aParams) {
		super(...aParams);
		this.moteur = new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
		this.moteurGrille = new ObjetMoteurGrilleSaisie_1.ObjetMoteurGrilleSaisie();
		this.moteurAssSaisie =
			new ObjetMoteurAssistantSaisie_1.ObjetMoteurAssistantSaisie();
		this.palierElementTravailleSelectionne = null;
	}
	construireInstances() {
		super.construireInstances();
		this.identTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this._evenementTripleCombo,
			this._initialiserTripleCombo,
		);
		this.identFenetreMentions = this.add(
			ObjetFenetre_Mention_1.ObjetFenetre_Mention,
			this._evenementMentions.bind(this),
			this._initialiserMentions,
		);
		this.identFenetreAssistantSaisie = this.add(
			ObjetFenetre_AssistantSaisie_1.ObjetFenetre_AssistantSaisie,
			this._evntSurFenetreAssistantSaisie.bind(this),
			this.moteurAssSaisie.initialiserFenetreAssistantSaisie,
		);
		this.identPiedPage = this.add(
			InterfacePiedBulletin_1.InterfacePiedBulletin,
			this._evntSurPied.bind(this),
			this.initPied.bind(this),
		);
		this.construireFicheEleveEtFichePhoto();
	}
	initPied(aInstance) {
		aInstance.setOptions({ hauteurContenu: 300 });
	}
	getAriaLabelListe() {
		var _a, _b, _c, _d;
		return `${this.etatUtilisateurSco.getLibelleLongOnglet()} ${((_a = this.etatUtilisateurSco.Navigation.getRessource(Enumere_Ressource_1.EGenreRessource.Classe)) === null || _a === void 0 ? void 0 : _a.getLibelle()) || ""} ${((_b = this.etatUtilisateurSco.Navigation.getRessource(Enumere_Ressource_1.EGenreRessource.Periode)) === null || _b === void 0 ? void 0 : _b.getLibelle()) || ""} ${((_c = this.etatUtilisateurSco.Navigation.getRessource(Enumere_Ressource_1.EGenreRessource.Eleve)) === null || _c === void 0 ? void 0 : _c.getLibelle()) || ""} ${((_d = this.onglet) === null || _d === void 0 ? void 0 : _d.getLibelle()) || ""}`.trim();
	}
	setParametresGeneraux() {
		super.setParametresGeneraux();
		this.AddSurZone = [
			this.identTripleCombo,
			{
				html: IE.jsx.str("span", {
					"ie-html": this.jsxGetHtmlInformationDatePublication.bind(this),
				}),
			},
		];
		if (this.etatUtilisateurSco.pourPrimaire()) {
			this.AddSurZone.push({
				html: IE.jsx.str("span", {
					"ie-html": this.jsxGetHtmlAccusesReception.bind(this),
					"ie-hint": this.jsxGetHintAccusesReception.bind(this),
					class: "flex-contain flex-center",
				}),
			});
		}
		this.AddSurZone.push({
			html: IE.jsx.str(
				"span",
				{
					"ie-if":
						this.jsxIfAffichageBoutonCalculerTousLesPositionnements.bind(this),
				},
				IE.jsx.str(
					"ie-bouton",
					{
						"ie-model":
							this.jsxModeleBoutonCalculerTousLesPositionnements.bind(this),
						class:
							Type_ThemeBouton_1.TypeThemeBouton.primaire +
							" MargeGauche small-bt",
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"competences.CalculerLesPositionnementsDeMaClasse",
					),
				),
			),
		});
		this.AddSurZone.push({ blocGauche: true });
		this.addSurZonePhotoEleve();
		if (this.avecAssistantSaisie()) {
			this.AddSurZone.push({
				html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnAssistantSaisie(
					this.jsxModeleBoutonAssistantSaisie.bind(this),
				),
			});
		}
		this.AddSurZone.push({ blocDroit: true });
	}
	jsxGetHtmlInformationDatePublication() {
		return this.donnees.strInfoDatePublication || "";
	}
	jsxModeleBoutonAssistantSaisie() {
		return {
			event: () => {
				this._evntSurAssistant();
			},
			getTitle: () => {
				return this.moteurAssSaisie.getTitleBoutonAssistantSaisie();
			},
			getSelection: () => {
				return this.etatUtilisateurSco.assistantSaisieActif;
			},
		};
	}
	jsxGetHintAccusesReception() {
		let lStrHint = "";
		if (
			!!this.donnees.listeAccusesReception &&
			this.donnees.listeAccusesReception.count() > 1
		) {
			const lArrHint = [];
			this.donnees.listeAccusesReception.parcourir((aResponsable) => {
				if (!!aResponsable && aResponsable.aPrisConnaissance) {
					lArrHint.push(" - " + aResponsable.getLibelle());
				}
			});
			lStrHint = lArrHint.join("<br/>");
		}
		return lStrHint;
	}
	jsxGetHtmlAccusesReception() {
		const lStrAccusesReception = [];
		if (!this.estPourClasse()) {
			const lInfosAR =
				UtilitaireBulletin_1.UtilitaireBulletin.getInfosTypeAccuseReceptionBulletinEleve(
					this.donnees.listeAccusesReception,
				);
			lStrAccusesReception.push(
				'<i style="color: ',
				lInfosAR.couleurIcone,
				';" class="',
				lInfosAR.nomIcone,
				'" role="presentation"></i><span class="m-left">',
				lInfosAR.libelle,
				"</span>",
			);
		}
		return lStrAccusesReception.join("");
	}
	jsxIfAffichageBoutonCalculerTousLesPositionnements() {
		return (
			this.estPourClasse() && !!this.donnees.avecBtnCalculPositionnementClasse
		);
	}
	jsxModeleBoutonCalculerTousLesPositionnements() {
		return {
			event: () => {
				const lParamsCalculAuto = {
					instance: this,
					modeValidationAuto:
						TypeModeValidationAuto_1.TypeModeValidationAuto
							.tmva_PosSansNoteSelonEvaluation,
					avecChoixCalcul: true,
					messageRestrictionsSurCalculAuto: null,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"competences.fenetreValidationAutoPositionnement.titreTousLesPositionnements",
					),
					calculMultiServices: true,
					avecChoixPreferencesCalcul: true,
				};
				UtilitaireCompetences_1.TUtilitaireCompetences.surBoutonValidationAutoPositionnement(
					lParamsCalculAuto,
				);
			},
		};
	}
	estPourClasse() {
		const lEleve = this.getEleve();
		return !lEleve || !lEleve.existeNumero();
	}
	_getParametresPDF() {
		return {
			genreGenerationPDF:
				TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
					.BulletinDeCompetences,
			classe: this.getClasse(),
			periode: this.getPeriode(),
			eleve: this.getEleve(),
			avecChoixGraphe: true,
			avecCodeCompetences: GEtatUtilisateur.estAvecCodeCompetences(),
		};
	}
	estJaugeCliquable() {
		const lEleve = this.getEleve();
		return !!lEleve && lEleve.existeNumero();
	}
	surApresEditionListe(aParametres) {
		const lArticle = aParametres.article;
		switch (aParametres.idColonne) {
			case DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.note:
				this.moteur.saisieNoteLSU({
					paramRequete: {
						classe: this.getClasse(),
						periode: this.getPeriode(),
						eleve: this.getEleve(),
						service: lArticle,
						posLSUNote: lArticle.posLSUNote,
					},
					instanceListe: this.getInstance(this.identListe),
					clbckSucces: (aParamSucces) => {
						const lDonneesListe = this.getInstance(
							this.identListe,
						).getListeArticles();
						const lLignes = lDonneesListe.getListeElements((aLigne) => {
							return aLigne.getNumero() === aParamSucces.numeroService;
						});
						const lLigne = lLignes.get(0);
						lLigne.posLSUNote = aParamSucces.noteLSUSaisie;
					},
					paramCellSuivante: { orientationVerticale: true },
					clbckEchec: (aPromiseMsg) => {
						this._actualiserSurErreurSaisie({
							liste: this.getInstance(this.identListe),
							promiseMsg: aPromiseMsg,
						});
					},
				});
				break;
			case DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.appreciationA:
			case DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.appreciationB:
			case DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.appreciationC:
				this._surEvntSaisieAppreciation({
					estCtxPiedBulletin: false,
					article: lArticle,
					idColonne: aParametres.idColonne,
					instanceListe: this.getInstance(this.identListe),
					suivante: { orientationVerticale: true },
				});
				break;
		}
	}
	surEditionListe(aParametres) {
		switch (aParametres.idColonne) {
			case DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.niveauAcqComp: {
				const lLigne = aParametres.article;
				const lInstanceListe = this.getInstance(this.identListe);
				this.moteur.ouvrirMenuPositionnement({
					id: lInstanceListe.getIdCellule(
						aParametres.colonne,
						aParametres.ligne,
					),
					instance: this,
					genreChoixValidationCompetence:
						TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
							.tGVC_EvaluationEtItem,
					clbackMenuPositionnement: (aNiveauDAcquisition) => {
						if (
							aNiveauDAcquisition &&
							(!lLigne.niveauAcqComp ||
								lLigne.niveauAcqComp.getNumero() !==
									aNiveauDAcquisition.getNumero())
						) {
							this.moteur.saisiePositionnement({
								paramRequete: {
									estPourElementCompetence: true,
									eltCompetence: lLigne.elementCompetence,
									positionnement: aNiveauDAcquisition,
									classe: this.getClasse(),
									periode: this.getPeriode(),
									eleve: this.getEleve(),
									service: lLigne,
								},
								instanceListe: lInstanceListe,
								clbckSucces: function () {
									lLigne.niveauAcqComp = aNiveauDAcquisition;
								},
								clbckEchec: (aPromiseMsg) => {
									this._actualiserSurErreurSaisie({
										liste: lInstanceListe,
										promiseMsg: aPromiseMsg,
									});
								},
							});
						}
					},
				});
				break;
			}
			case DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.posLSU: {
				const lLigne = aParametres.article;
				const lInstanceListe = this.getInstance(this.identListe);
				this.moteur.ouvrirMenuPositionnement({
					id: lInstanceListe.getIdCellule(
						aParametres.colonne,
						aParametres.ligne,
					),
					instance: this,
					genreChoixValidationCompetence:
						TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
							.tGVC_Competence,
					genrePositionnement: this.donnees.typePositionnementSansNote,
					clbackMenuPositionnement: (aNiveauDAcquisition) => {
						if (
							aNiveauDAcquisition &&
							(!lLigne.posLSUNiveau ||
								lLigne.posLSUNiveau.getNumero() !==
									aNiveauDAcquisition.getNumero())
						) {
							this.moteur.saisiePositionnement({
								paramRequete: {
									estPourElementCompetence: false,
									positionnement: aNiveauDAcquisition,
									classe: this.getClasse(),
									periode: this.getPeriode(),
									eleve: this.getEleve(),
									service: lLigne,
								},
								instanceListe: lInstanceListe,
								clbckSucces: (aParamSucces) => {
									lLigne.posLSUNiveau = aParamSucces.niveauAcquSaisi;
									if (!!lLigne.posLSUNiveau) {
										const posLSUNiveauGlobal =
											GParametres.listeNiveauxDAcquisitions.getElementParGenre(
												lLigne.posLSUNiveau.getGenre(),
											);
										Object.assign(lLigne.posLSUNiveau, posLSUNiveauGlobal);
									}
								},
								paramCellSuivante: { orientationVerticale: true },
								clbckEchec: (aPromiseMsg) => {
									this._actualiserSurErreurSaisie({
										liste: lInstanceListe,
										promiseMsg: aPromiseMsg,
									});
								},
							});
						}
					},
				});
				break;
			}
			case DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.elementsProgramme:
				this.surEditionElementsProgramme(aParametres.article);
				break;
			case DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.appreciationA:
			case DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.appreciationB:
			case DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.appreciationC: {
				const lRang = this.estPourClasse()
					? this.donnees.rangAppreciation.appA
					: this._getRangDIdColonne(aParametres.idColonne);
				this.donnees.objCelluleAppreciation = $.extend(
					{
						article: aParametres.article,
						genreAppr: lRang,
						idColonne: aParametres.idColonne,
					},
					{ ctxPiedBulletin: false },
				);
				let lTabTypeAppreciation;
				let lRangAppreciationSaisie;
				if (this.estPourClasse()) {
					lTabTypeAppreciation =
						Enumere_TypeAppreciation_1.ETypeAppreciationUtil.getTypeAppreciation(
							this.etatUtilisateurSco.getGenreOnglet(),
							null,
							false,
						);
					lRangAppreciationSaisie = lRang;
				} else {
					lTabTypeAppreciation = [lRang - 1];
					lRangAppreciationSaisie = lRang;
				}
				this._ouvreFenetreAssistantSaisie({
					tabTypeAppreciation: lTabTypeAppreciation,
					rangAppreciationSaisie: lRangAppreciationSaisie,
					tailleMaxAppreciation: this.getTailleMaxAppreciationBulletin(),
				});
				break;
			}
			default:
				if (
					DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences.estUneColonneTransversale(
						aParametres.idColonne,
					)
				) {
					const lObjElementColonne =
						DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences.getObjetElementColonneTransversale(
							aParametres.article,
							aParametres,
						);
					this.surEditionColonneTransversale({
						service: aParametres.article,
						eltCol: lObjElementColonne,
						col: aParametres.colonne,
						ligne: aParametres.ligne,
					});
				}
				break;
		}
	}
	getParametresPiedPageEleve() {
		return {
			typeReleveBulletin:
				TypeReleveBulletin_1.TypeReleveBulletin.BulletinCompetences,
			typeContexteBulletin:
				TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve,
			avecSaisie: true,
			avecValidationAuto: true,
			clbckValidationAutoSurEdition:
				this._clbckValidationAutoSurEdition.bind(this),
		};
	}
	getEleve() {
		return this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Eleve,
		);
	}
	getClasse() {
		return this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
	}
	getPeriode() {
		return this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Periode,
		);
	}
	saisieAppreciation(aParam, aParamRequete) {
		const lParam = {
			instanceListe: aParam.instanceListe,
			paramRequete: aParamRequete,
			paramCellSuivante:
				aParam.suivante !== null && aParam.suivante !== undefined
					? aParam.suivante
					: { orientationVerticale: true },
			clbckSucces: null,
			clbckEchec: (aPromiseMsg) => {
				this._actualiserSurErreurSaisie({
					liste: aParam.instanceListe,
					promiseMsg: aPromiseMsg,
				});
			},
		};
		if (aParam.estCtxPied) {
			$.extend(lParam, {
				clbckSucces: (aParamSucces) => {
					this.moteurPdB.majAppreciationPdB(
						$.extend(aParamSucces, { instanceListe: lParam.instanceListe }),
					);
				},
			});
		} else {
			$.extend(lParam, {
				clbckSucces: (aParamSucces) => {
					const lService = this.donnees.listeLignes.getElementParNumero(
						aParamSucces.numeroService,
					);
					const lCol = this._getIdColonneDeRang(aParamSucces.rangAppr);
					this._setStrApprDeCol(
						lService,
						lCol,
						aParamSucces.apprSaisie.getLibelle(),
					);
				},
			});
		}
		this.moteur.saisieAppreciation(lParam);
	}
	getParametresPiedPageClasse() {
		return {
			typeReleveBulletin:
				TypeReleveBulletin_1.TypeReleveBulletin.BulletinCompetences,
			typeContexteBulletin:
				TypeContexteBulletin_1.TypeContexteBulletin.CB_Classe,
			avecSaisie: true,
			avecValidationAuto: true,
			clbckValidationAutoSurEdition:
				this._clbckValidationAutoSurEdition.bind(this),
		};
	}
	validerSaisieBulletin(aCallbackSurValidation) {
		const lPiedPage = this.getInstance(this.identPiedPage).getDonneesSaisie();
		if (!aCallbackSurValidation) {
			aCallbackSurValidation = this.actionSurValidation;
		}
		const lParamsSaisie = {
			listeServices: this.donnees.listeLignes,
			rangAppreciation: this.donnees.rangAppreciation,
			listeAppreciationsAssistSaisie: this.listeTypesAppreciations,
			listeConseils: null,
			listeCommentaires: null,
			listeCpe: null,
			parcoursEducatif: null,
			competences: null,
			listeAttestations: null,
		};
		if (!!lPiedPage) {
			lParamsSaisie.listeConseils =
				lPiedPage.appreciations.listeConseilDeClasse;
			lParamsSaisie.listeCommentaires =
				lPiedPage.appreciations.listeCommentaires;
			lParamsSaisie.listeCpe = lPiedPage.appreciations.listeCPE;
			lParamsSaisie.parcoursEducatif = lPiedPage.parcoursEducatif;
			lParamsSaisie.competences = lPiedPage.competences;
			lParamsSaisie.listeAttestations = lPiedPage.certificats
				? lPiedPage.certificats.listeAttestationsEleve
				: null;
		}
		new ObjetRequeteSaisieBulletinCompetences_1.ObjetRequeteSaisieBulletinCompetences(
			this,
			aCallbackSurValidation,
		).lancerRequete(lParamsSaisie);
	}
	avecAssistantSaisie() {
		return this.moteurAssSaisie.avecAssistantSaisie({
			typeReleveBulletin:
				TypeReleveBulletin_1.TypeReleveBulletin.BulletinCompetences,
		});
	}
	getTailleMaxAppreciationBulletin() {
		let typeGenreAppreciation;
		if (this.estPourClasse()) {
			typeGenreAppreciation =
				TypeGenreAppreciation_1.TypeGenreAppreciation.GA_Bulletin_Professeur;
		} else {
			typeGenreAppreciation =
				TypeGenreAppreciation_1.TypeGenreAppreciation.GA_Bulletin_Professeur;
		}
		return this.parametresSco.getTailleMaxAppreciationParEnumere(
			typeGenreAppreciation,
		);
	}
	evenementFenetreDetailEvaluations(
		aNumeroBouton,
		aElementsCompetenceModifies,
	) {
		if (
			!!aElementsCompetenceModifies &&
			aElementsCompetenceModifies.count() > 0
		) {
			const lParamsRequetes = {
				eleve: this.getEleve(),
				listeElementsCompetences: aElementsCompetenceModifies,
			};
			new ObjetRequeteSaisieDetailEvalCompetences_1.ObjetRequeteSaisieDetailEvaluationsCompetences(
				this,
				() => {
					if (this.getEtatSaisie()) {
						this.validerSaisieBulletin();
					} else {
						this.actionSurValidation();
					}
				},
			).lancerRequete(lParamsRequetes);
		}
	}
	_initialiserTripleCombo(aInstance) {
		aInstance.setParametres(
			[
				Enumere_Ressource_1.EGenreRessource.Classe,
				Enumere_Ressource_1.EGenreRessource.Periode,
				Enumere_Ressource_1.EGenreRessource.Eleve,
			],
			false,
		);
	}
	_evenementTripleCombo() {
		this._evenementDernierMenuDeroulant();
		this.surSelectionEleve();
	}
	_evenementDernierMenuDeroulant() {
		super._evenementDernierMenuDeroulant();
	}
	getListeTypesAppreciations() {
		this.moteurAssSaisie.getListeTypesAppreciations({
			typeReleveBulletin:
				TypeReleveBulletin_1.TypeReleveBulletin.BulletinCompetences,
			clbck: (aListeTypesAppreciations) => {
				this.listeTypesAppreciations = aListeTypesAppreciations;
			},
		});
	}
	afficherPage() {
		this._evenementDernierMenuDeroulant();
	}
	valider() {
		this.validerSaisieBulletin();
	}
	_clbckValidationAutoSurEdition(aParam) {
		this._surEvntSaisieAppreciation({
			estCtxPiedBulletin: true,
			appreciation: aParam.appreciation,
			instanceListe: aParam.instanceListe,
		});
	}
	surEditionElementsProgramme(aService) {
		const lFenetreElmtsProgramme =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_ElementsProgramme_1.ObjetFenetre_ElementsProgramme,
				{
					pere: this,
					evenement: (aValider, aDonnees) => {
						this.palierElementTravailleSelectionne = aDonnees.palierActif;
						if (aValider) {
							this._evenementFenetreElementsProgramme(
								aService,
								aDonnees.listeElementsProgramme,
							);
						}
					},
				},
			);
		lFenetreElmtsProgramme.setDonnees({
			service: aService,
			periode: this.getPeriode(),
			listeElementsProgramme:
				aService.listeEltProgramme ||
				new ObjetListeElements_1.ObjetListeElements(),
			palier: this.palierElementTravailleSelectionne,
		});
	}
	_evenementFenetreElementsProgramme(aService, aListeSelection) {
		aService.listeEltProgramme = aListeSelection;
		aService.listeEltProgramme.trier();
		this.moteur.saisieEltsPgme({
			paramRequete: {
				classeGroupe: this.getClasse(),
				periode: this.getPeriode(),
				service: aService,
				listeEltsPgme: aService.listeEltProgramme,
			},
			instanceListe: this.getInstance(this.identListe),
			clbckSucces: (aParamSucces) => {
				const lDonneesListe = this.getInstance(
					this.identListe,
				).getListeArticles();
				const lLignes = lDonneesListe.getListeElements((aLigne) => {
					return aLigne.getNumero() === aParamSucces.numeroService;
				});
				const lService = lLignes.get(0);
				if (lService !== null) {
					lService.listeEltProgramme = aParamSucces.listeEltsPgme;
				}
				this.majStrEltPgme({ service: lService });
			},
			paramCellSuivante: { orientationVerticale: true },
			clbckEchec: (aPromiseMsg) => {
				this._actualiserSurErreurSaisie({
					liste: this.getInstance(this.identListe),
					promiseMsg: aPromiseMsg,
				});
			},
		});
	}
	majStrEltPgme(aParam) {
		const lService = aParam.service;
		lService.strEltProg = "";
		const lHintEltProgramme = [];
		if (lService.listeEltProgramme.count() > 0) {
			lHintEltProgramme.push("<ul>");
			lService.listeEltProgramme.parcourir((D) => {
				lHintEltProgramme.push("<li>", D.getLibelle(), "</li>");
			});
			lHintEltProgramme.push("</ul>");
		}
		lService.hintEltProg = lHintEltProgramme.join("");
		let lStrEltProgramme = "";
		if (lService.listeEltProgramme.count() > 2) {
			lStrEltProgramme =
				'<div style="padding-left:8px;">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"BulletinEtReleve.ElementsProgramme",
					[lService.listeEltProgramme.count()],
				) +
				"</div>";
		} else {
			lStrEltProgramme = lService.hintEltProg;
		}
		lService.strEltProg = lStrEltProgramme;
	}
	surEditionColonneTransversale(aParam) {
		const lInstanceListe = this.getInstance(this.identListe);
		this.moteur.ouvrirMenuPositionnement({
			id: lInstanceListe.getIdCellule(aParam.col, aParam.ligne),
			instance: this,
			genreChoixValidationCompetence:
				TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
					.tGVC_EvaluationEtItem,
			avecSelecteurNiveauCalcule: true,
			clbackMenuPositionnement: (aNiveauDAcquisition) => {
				if (aNiveauDAcquisition) {
					const lEstCasNiveauCalcule =
						aNiveauDAcquisition.getGenre() === undefined;
					aParam.eltCol.niveauAcqui = lEstCasNiveauCalcule
						? undefined
						: aNiveauDAcquisition;
					this.moteur.saisiePositionnement({
						paramRequete: {
							estPourElementCompetence: true,
							eltCompetence: aParam.eltCol,
							estCalcule: lEstCasNiveauCalcule,
							positionnement: aParam.eltCol.niveauAcqui,
							classe: this.getClasse(),
							periode: this.getPeriode(),
							eleve: this.getEleve(),
							service: aParam.service,
						},
						instanceListe: lInstanceListe,
						clbckSucces: (aParamSucces) => {
							const lDonneesListe = lInstanceListe.getListeArticles();
							const lLignes = lDonneesListe.getListeElements((aLigne) => {
								return aLigne.getNumero() === aParamSucces.numeroService;
							});
							const lLigne = lLignes.get(0);
							const lElt = lLigne.listeColonnesTransv.getElementParNumero(
								aParamSucces.numeroEltCompetence,
							);
							lElt.niveauAcqui = aParamSucces.niveauAcquSaisi;
							if (lElt.niveauAcqui !== null && lElt.niveauAcqui !== undefined) {
								const posLSUNiveauGlobal =
									GParametres.listeNiveauxDAcquisitions.getElementParGenre(
										lElt.niveauAcqui.getGenre(),
									);
								Object.assign(lElt.niveauAcqui, posLSUNiveauGlobal);
							}
							this.calculerPourcentageAcquis({ service: lLigne });
						},
						paramCellSuivante: { orientationVerticale: false },
						clbckEchec: (aPromiseMsg) => {
							this._actualiserSurErreurSaisie({
								liste: lInstanceListe,
								promiseMsg: aPromiseMsg,
							});
						},
					});
				}
			},
		});
	}
	calculerPourcentageAcquis(aParam) {
		const lService = aParam.service;
		let lNbNiveauxAcquis = 0,
			lNbNiveauxTotal = 0;
		lService.listeColonnesTransv.parcourir((D) => {
			let lNiveauATester;
			if (!!D.niveauAcqui) {
				lNiveauATester = D.niveauAcqui;
			} else if (!!D.niveauAcquiCalc) {
				lNiveauATester = D.niveauAcquiCalc;
			}
			if (
				!!lNiveauATester &&
				UtilitaireCompetences_1.TUtilitaireCompetences.estNotantPourTxReussiteEvaluation(
					lNiveauATester,
				)
			) {
				lNbNiveauxTotal++;
				if (
					UtilitaireCompetences_1.TUtilitaireCompetences.estNiveauAcqui(
						lNiveauATester,
					)
				) {
					lNbNiveauxAcquis++;
				}
			}
		});
		lService.pourcentage =
			lNbNiveauxTotal === 0
				? ""
				: (Math.round(((lNbNiveauxAcquis * 100) / lNbNiveauxTotal) * 10) / 10)
						.toString()
						.replace(".", ",");
	}
	_initialiserMentions(aInstance) {
		aInstance.setParametresMention(
			ObjetTraduction_1.GTraductions.getValeur("Appreciations.Mentions"),
		);
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Appreciations.SaisieMentions",
			),
			largeur: 300,
			hauteur: 300,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	_evenementMentions(aGenreBouton) {
		var _a;
		if (!!this.donnees.objCelluleAppreciation) {
			if (
				aGenreBouton === 1 &&
				!!this.donnees.objCelluleAppreciation.appreciation
			) {
				const lObjElementMention = this.getInstance(
					this.identFenetreMentions,
				).getMentionSelectionnee();
				if (!!lObjElementMention) {
					if (lObjElementMention.existeNumero()) {
						this.donnees.objCelluleAppreciation.appreciation.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
						this.donnees.objCelluleAppreciation.appreciation.Libelle =
							lObjElementMention.getLibelle();
					} else {
						this.donnees.objCelluleAppreciation.appreciation.setEtat(
							Enumere_Etat_1.EGenreEtat.Suppression,
						);
						this.donnees.objCelluleAppreciation.appreciation.Libelle = "";
					}
					this.donnees.objCelluleAppreciation.appreciation.setNumero(
						lObjElementMention.getNumero(),
					);
					this.setEtatSaisie(true);
				}
			}
			(_a = this.donnees.objCelluleAppreciation.instance) === null ||
			_a === void 0
				? void 0
				: _a.deselectionnerLigne();
			this.donnees.objCelluleAppreciation = undefined;
		}
	}
	_ouvreFenetreAssistantSaisie(aParametres) {
		this.moteurAssSaisie.evenementOuvrirAssistantSaisie({
			instanceFenetreAssistantSaisie: this.getInstance(
				this.identFenetreAssistantSaisie,
			),
			listeTypesAppreciations: this.listeTypesAppreciations,
			tabTypeAppreciation: aParametres.tabTypeAppreciation,
			tailleMaxAppreciation: aParametres.tailleMaxAppreciation,
			rangAppreciations: aParametres.rangAppreciationSaisie,
			avecEtatSaisie: false,
		});
	}
	_evntSurAssistant() {
		this.moteurAssSaisie.evntBtnAssistant({
			instanceListe: this.getInstance(this.identListe),
			instancePied: this.getInstance(this.identPiedPage),
		});
	}
	_evntSurFenetreAssistantSaisie(aNumeroBouton) {
		const lParam = {
			instanceFenetreAssistantSaisie: this.getInstance(
				this.identFenetreAssistantSaisie,
			),
			eventChangementUtiliserAssSaisie: () => {
				this.getInstance(this.identListe).actualiser(true);
				const lInstancePied = this.getInstance(this.identPiedPage);
				if (lInstancePied && lInstancePied.evenementSurAssistant) {
					lInstancePied.evenementSurAssistant();
				}
			},
			evntClbck: this.surEvntAssSaisie.bind(this),
		};
		this.moteurAssSaisie.evenementAssistantSaisie(aNumeroBouton, lParam);
	}
	_validerAppreciation(aParam, aParamSaisie) {
		const lContexte = aParamSaisie.contexte;
		const lEstCtxPiedBulletin = aParamSaisie.estCtxPiedBulletin;
		const lListe = aParamSaisie.liste;
		const lParamSuivante = { orientationVerticale: true };
		const lArticle = lContexte.article;
		if (aParam.eltSelectionne && aParam.eltSelectionne.existeNumero()) {
			if (lEstCtxPiedBulletin) {
				this.moteurAssSaisie.validerDonneesSurValider({
					article: lArticle,
					appreciation: lContexte.appreciation,
					eltSelectionne: aParam.eltSelectionne,
				});
			} else {
				this._setStrApprDeCol(
					lArticle,
					lContexte.idColonne,
					aParam.eltSelectionne.getLibelle(),
				);
			}
		}
		const lParamSaisie = {
			estCtxPiedBulletin: lEstCtxPiedBulletin,
			instanceListe: lListe,
			suivante: lParamSuivante,
		};
		if (lEstCtxPiedBulletin) {
			$.extend(lParamSaisie, { appreciation: lContexte.appreciation });
		} else {
			$.extend(lParamSaisie, {
				article: lArticle,
				idColonne: lContexte.idColonne,
			});
		}
		this._surEvntSaisieAppreciation(lParamSaisie);
	}
	surEvntAssSaisie(aParam) {
		const lContexte = this.donnees.objCelluleAppreciation;
		const lEstCtxPiedBulletin =
			lContexte !== null &&
			lContexte !== undefined &&
			lContexte.ctxPiedBulletin;
		const lListe = lEstCtxPiedBulletin
			? lContexte.instanceListe
			: this.getInstance(this.identListe);
		if (lListe !== null && lListe !== undefined) {
			let lClbck;
			switch (aParam.cmd) {
				case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
					.Valider:
					lClbck = () => {
						this._validerAppreciation(aParam, {
							contexte: lContexte,
							estCtxPiedBulletin: lEstCtxPiedBulletin,
							liste: lListe,
						});
					};
					break;
				case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
					.PasserEnSaisie: {
					lClbck = () => {
						const lParam = {
							instanceListe: lListe,
							idColonne: lContexte.idColonne,
						};
						this.moteurAssSaisie.passerEnSaisie(lParam);
					};
					break;
				}
				case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
					.Fermer:
					lClbck = null;
					break;
				default:
			}
			this.moteurAssSaisie.saisirModifAssSaisieAvantTraitement({
				estAssistantModifie: aParam.estAssistantModifie,
				pere: this,
				clbck: lClbck,
			});
		}
	}
	_surEvntSaisieAppreciation(aParam) {
		const lEstCtxPiedBulletin = aParam.estCtxPiedBulletin;
		const lArticle = aParam.article;
		const lService = lEstCtxPiedBulletin ? null : lArticle;
		const lParamSaisie = {
			classe: this.getClasse(),
			periode: this.getPeriode(),
			eleve: this.getEleve(),
			service: lService,
			saisieSurRegroupement: this.donnees.avecAppreciationsSurRegroupement,
		};
		if (lEstCtxPiedBulletin) {
			const lAppr = aParam.appreciation;
			$.extend(lParamSaisie, {
				appreciation: lAppr,
				typeGenreAppreciation: this.moteur.getTypeGenreAppreciation({
					estCtxPied: lEstCtxPiedBulletin,
					eleve: this.getEleve(),
					typeReleveBulletin:
						TypeReleveBulletin_1.TypeReleveBulletin.BulletinCompetences,
					appreciation: lAppr,
				}),
			});
		} else {
			const lStrAppr = this._getStrApprDeCol(lArticle, aParam.idColonne);
			const lRangAppr = this._getRangDIdColonne(aParam.idColonne);
			$.extend(lParamSaisie, {
				genreAppr: lRangAppr,
				strAppr: lStrAppr,
				typeGenreAppreciation: this.moteur.getTypeGenreAppreciation({
					estCtxPied: lEstCtxPiedBulletin,
					eleve: this.getEleve(),
					typeReleveBulletin:
						TypeReleveBulletin_1.TypeReleveBulletin.BulletinCompetences,
					genreAppr: lRangAppr,
				}),
			});
		}
		this.saisieAppreciation(
			{
				instanceListe: aParam.instanceListe,
				estCtxPied: lEstCtxPiedBulletin,
				suivante: aParam.suivante,
			},
			lParamSaisie,
		);
	}
	_getStrApprDeCol(D, aCol) {
		switch (aCol) {
			case DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.appreciationA:
				return D.appreciationA;
			case DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.appreciationB:
				return D.appreciationB;
			case DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.appreciationC:
				return D.appreciationC;
		}
		return null;
	}
	_setStrApprDeCol(D, aCol, aStr) {
		switch (aCol) {
			case DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.appreciationA:
				D.appreciationA = aStr;
				break;
			case DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.appreciationB:
				D.appreciationB = aStr;
				break;
			case DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.appreciationC:
				D.appreciationC = aStr;
				break;
		}
	}
	_getRangDIdColonne(aIdCol) {
		switch (aIdCol) {
			case DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.appreciationA:
				return this.donnees.rangAppreciation.appA;
			case DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.appreciationB:
				return this.donnees.rangAppreciation.appB;
			case DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.appreciationC:
				return this.donnees.rangAppreciation.appC;
			default:
				return null;
		}
	}
	_getIdColonneDeRang(aRangAppreciation) {
		if (aRangAppreciation === this.donnees.rangAppreciation.appA) {
			return DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.appreciationA;
		} else if (aRangAppreciation === this.donnees.rangAppreciation.appB) {
			return DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.appreciationB;
		} else if (aRangAppreciation === this.donnees.rangAppreciation.appC) {
			return DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
				.colonnes.appreciationC;
		}
		return null;
	}
	_evntSurPied(aParam) {
		this.donnees.objCelluleAppreciation = $.extend(aParam, {
			ctxPiedBulletin: true,
		});
		this._ouvreFenetreAssistantSaisie({
			tabTypeAppreciation:
				Enumere_TypeAppreciation_1.ETypeAppreciationUtil.getTypeAppreciation(
					this.etatUtilisateurSco.getGenreOnglet(),
					aParam.appreciation,
					true,
				),
			tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
				estCtxPied: true,
				appreciation: aParam.appreciation,
				typeReleveBulletin:
					TypeReleveBulletin_1.TypeReleveBulletin.BulletinCompetences,
			}),
		});
	}
	_actualiserSurErreurSaisie(aParam) {
		const lSelection = aParam.liste.getSelectionCellule();
		this.afficherPage();
		if (aParam.promiseMsg !== null && aParam.promiseMsg !== undefined) {
			aParam.promiseMsg.then(() => {
				if (lSelection !== null && lSelection !== undefined) {
					aParam.liste.selectionnerCellule({
						ligne: lSelection.ligne,
						colonne: lSelection.colonne,
						avecScroll: true,
					});
				}
			});
		}
	}
}
exports.InterfaceBulletinCompetences_Saisie =
	InterfaceBulletinCompetences_Saisie;
