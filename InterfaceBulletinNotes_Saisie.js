exports.InterfaceBulletinNotes_Saisie = void 0;
const _InterfaceBulletinNotes_1 = require("_InterfaceBulletinNotes");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePiedBulletin_1 = require("InterfacePiedBulletin");
const ObjetListe_1 = require("ObjetListe");
const Enumere_TypeAppreciation_1 = require("Enumere_TypeAppreciation");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_BulletinNotes_1 = require("DonneesListe_BulletinNotes");
const ObjetFenetre_ElementsProgramme_1 = require("ObjetFenetre_ElementsProgramme");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const DonneesListe_Simple_1 = require("DonneesListe_Simple");
const ObjetFenetre_AssistantSaisie_1 = require("ObjetFenetre_AssistantSaisie");
const EBoutonFenetreAssistantSaisie_1 = require("EBoutonFenetreAssistantSaisie");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetMoteurAssistantSaisie_1 = require("ObjetMoteurAssistantSaisie");
const ObjetMoteurGrilleSaisie_1 = require("ObjetMoteurGrilleSaisie");
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
class InterfaceBulletinNotes_Saisie extends _InterfaceBulletinNotes_1._InterfaceBulletinNotes {
	constructor(aParams) {
		const lParams = Object.assign(aParams, {
			params: {
				avecSaisie: true,
				avecInfosEleve: true,
				avecDocsATelecharger: false,
				avecGraphe: true,
			},
		});
		super(lParams);
		this.moteurAssSaisie =
			new ObjetMoteurAssistantSaisie_1.ObjetMoteurAssistantSaisie();
		this.moteurGrille = new ObjetMoteurGrilleSaisie_1.ObjetMoteurGrilleSaisie();
		this.palierElementTravailleSelectionne = null;
	}
	addSurZoneFichesEleve() {
		this.addSurZoneFicheEleve();
		this.addSurZonePhotoEleve();
	}
	addSurZoneDatePublicationBulletin() {
		const lgetInformationDatePublication = () => {
			return this.aCopier.strInfoDatePublication || "";
		};
		this.AddSurZone.push({
			html: IE.jsx.str("span", { "ie-html": lgetInformationDatePublication }),
		});
	}
	afficherPage() {
		if (this.param.avecSaisie) {
			this.getListeTypesAppreciations();
		}
		const lEstContexteEleve = this.estCtxEleve();
		const lTypeCtxBull = this.moteurPdB.getContexteBulletin({
			estCtxEleve: lEstContexteEleve,
			typeReleveBulletin: TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes,
		});
		this.initPiedPage({ typeContexteBulletin: lTypeCtxBull });
		const lParam = {
			eleve: this.getEleve(),
			classe: this.getClasse(),
			periode: this.getPeriode(),
		};
		this.envoyerRequeteBulletin(lParam);
	}
	instancierCombos() {
		return this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this._evntSurDernierMenuDeroulant.bind(this),
			this._initTripleCombo.bind(this),
		);
	}
	instancierBulletin() {
		return this.add(
			ObjetListe_1.ObjetListe,
			this._evntSurListe.bind(this),
			(aListe) => {
				aListe.setOptionsListe({
					ariaLabel: () => {
						var _a, _b, _c;
						return `${this.etatUtilScoEspace.getLibelleLongOnglet()} ${((_a = this.getClasse()) === null || _a === void 0 ? void 0 : _a.getLibelle()) || ""} ${((_b = this.getPeriode()) === null || _b === void 0 ? void 0 : _b.getLibelle()) || ""} ${((_c = this.getEleve()) === null || _c === void 0 ? void 0 : _c.getLibelle()) || ""}`.trim();
					},
				});
			},
		);
	}
	getListeTypesAppreciations() {
		this.moteurAssSaisie.getListeTypesAppreciations({
			typeReleveBulletin: TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes,
			clbck: (aListeTypesAppreciations) => {
				this.listeTypesAppreciations = aListeTypesAppreciations;
			},
		});
	}
	saisieAppreciation(aParam, aParamRequete) {
		const lParam = {
			instanceListe: aParam.instanceListe,
			paramRequete: aParamRequete,
			paramCellSuivante:
				aParam.suivante !== null && aParam.suivante !== undefined
					? aParam.suivante
					: { orientationVerticale: true },
			clbckEchec: (aPromiseMsg) => {
				this._actualiserSurErreurSaisie({
					liste: aParam.instanceListe,
					promiseMsg: aPromiseMsg,
				});
			},
			clbckSucces: () => {},
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
					const lService = this.listeElementsLineaire.getElementParNumero(
						aParamSucces.numeroService,
					);
					this.moteur.majAppreciationService(
						$.extend(aParamSucces, { service: lService }),
					);
				},
			});
		}
		return this.moteur.saisieAppreciation(lParam);
	}
	avecAssistantSaisie() {
		return this.moteurAssSaisie.avecAssistantSaisie({
			typeReleveBulletin: TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes,
		});
	}
	instancierAssistantSaisie() {
		if (this.avecAssistantSaisie()) {
			this.identFenetreAssistantSaisie = this.add(
				ObjetFenetre_AssistantSaisie_1.ObjetFenetre_AssistantSaisie,
				this._evntSurFenetreAssistantSaisie.bind(this),
				this.moteurAssSaisie.initialiserFenetreAssistantSaisie,
			);
		}
	}
	addSurZoneAssistantSaisie() {
		if (this.avecAssistantSaisie()) {
			const lbtnAssistantSaisie = () => {
				return {
					event: () => {
						this._evntSurAssistant();
					},
					getTitle: () => {
						return this.moteurAssSaisie.getTitleBoutonAssistantSaisie();
					},
					getSelection: () => {
						return this.etatUtilScoEspace.assistantSaisieActif;
					},
				};
			};
			this.AddSurZone.push({
				html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnAssistantSaisie(
					lbtnAssistantSaisie,
				),
			});
		}
	}
	instancierPiedBulletin() {
		return this.add(
			InterfacePiedBulletin_1.InterfacePiedBulletin,
			this._evntSurPied.bind(this),
			this.initPied.bind(this),
		);
	}
	initPied(aInstance) {
		aInstance.setOptions({ hauteurContenu: 300 });
	}
	getListeAnnotationsPourAvisReligion() {
		if (this.listeAnnotations === null || this.listeAnnotations === undefined) {
			this.listeAnnotations = new ObjetListeElements_1.ObjetListeElements();
		}
		const lEltAucun = new ObjetElement_1.ObjetElement("", 0, null, 0);
		lEltAucun.description = ObjetTraduction_1.GTraductions.getValeur("Aucun");
		this.listeAnnotations.insererElement(lEltAucun, 0);
	}
	_initTripleCombo(aInstance) {
		aInstance.setParametres([
			Enumere_Ressource_1.EGenreRessource.Classe,
			Enumere_Ressource_1.EGenreRessource.Periode,
			Enumere_Ressource_1.EGenreRessource.Eleve,
		]);
	}
	_evntSurDernierMenuDeroulant() {
		if (this.param.avecInfosEleve) {
			this.surSelectionEleve();
		}
		this.afficherPage();
		const lExisteEleve = this.estCtxEleve();
		if (this.param.avecInfosEleve) {
			this.activerFichesEleve(lExisteEleve);
		}
	}
	_evntSurListe(aParametres) {
		const lArticle = aParametres.article;
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				if (lArticle.Cloture) {
					this.appScoEspace
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
							titre:
								ObjetTraduction_1.GTraductions.getValeur("SaisieImpossible"),
							message:
								ObjetTraduction_1.GTraductions.getValeur("PeriodeCloturee"),
						});
					return;
				}
				switch (aParametres.idColonne) {
					case DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
						.elmtPgm:
						if (lArticle.elementsCloture === true) {
							this.appScoEspace
								.getMessage()
								.afficher({
									type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
									titre:
										ObjetTraduction_1.GTraductions.getValeur(
											"SaisieImpossible",
										),
									message:
										ObjetTraduction_1.GTraductions.getValeur("PeriodeCloturee"),
								});
							return;
						} else {
							this.surEditionElementProgramme(lArticle);
						}
						break;
					case DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
						.moyProposee:
					case DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
						.moyDeliberee: {
						const lAvisReligion =
							aParametres.idColonne ===
							DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
								.moyProposee
								? lArticle.avisReligionPropose
								: lArticle.avisReligionDelibere;
						this.surEditionAvisReligion({
							article: lArticle,
							idColonne: aParametres.idColonne,
							avisReligion: lAvisReligion,
							listeAvis: this.listeAnnotations,
						});
						break;
					}
					default:
						if (
							this.moteurGrille.estColVariable(
								aParametres.idColonne,
								DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
									.appreciation,
							)
						) {
							const lAppreciation = lArticle.ListeAppreciations.get(
								aParametres.declarationColonne.indice,
							);
							this.moteurAssSaisie.evenementOuvrirAssistantSaisie({
								instanceFenetreAssistantSaisie: this.getInstance(
									this.identFenetreAssistantSaisie,
								),
								listeTypesAppreciations: this.listeTypesAppreciations,
								tabTypeAppreciation:
									Enumere_TypeAppreciation_1.ETypeAppreciationUtil.getTypeAppreciation(
										this.etatUtilScoEspace.getGenreOnglet(),
										lAppreciation,
										false,
									),
								avecEtatSaisie: false,
								tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
									estCtxPied: false,
									eleve: this.getEleve(),
									typeReleveBulletin:
										TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes,
								}),
							});
							this.objCelluleAppreciation = $.extend(
								{
									article: lArticle,
									appreciation: lAppreciation,
									idColonne: aParametres.idColonne,
								},
								{ ctxPiedBulletin: false },
							);
						}
						break;
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				switch (aParametres.idColonne) {
					case DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
						.ects: {
						const lValeur = lArticle.ectsModifie;
						if (lValeur !== null) {
							this._surValiderEditionDonnee({
								avecModification: aParametres.avecModification,
								article: lArticle,
								idColonne: aParametres.idColonne,
								selection: lValeur,
								navigation: { suivante: { orientationVerticale: true } },
							});
						}
						break;
					}
					case DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
						.moyProposee:
						if (
							lArticle.moyProposeeModifie &&
							lArticle.moyProposeeModifie.getNote() !==
								lArticle.moyenneProposee.getNote()
						) {
							this._surValiderEditionDonnee({
								article: lArticle,
								idColonne: aParametres.idColonne,
								selection: lArticle.moyProposeeModifie,
								ctxAvisReligion: false,
								navigation: { suivante: { orientationVerticale: true } },
							});
						} else {
							this.moteurGrille.selectionCelluleSuivante({
								instanceListe: this.getInstance(this.identListe),
								suivante: { orientationVerticale: true },
							});
						}
						break;
					case DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
						.moyDeliberee:
						if (
							lArticle.moyDelibereeModifie &&
							lArticle.moyDelibereeModifie.getNote() !==
								lArticle.moyenneDeliberee.getNote()
						) {
							this._surValiderEditionDonnee({
								article: lArticle,
								idColonne: aParametres.idColonne,
								selection: lArticle.moyDelibereeModifie,
								ctxAvisReligion: false,
								navigation: { suivante: { orientationVerticale: true } },
							});
						} else {
							this.moteurGrille.selectionCelluleSuivante({
								instanceListe: this.getInstance(this.identListe),
								suivante: { orientationVerticale: true },
							});
						}
						break;
					default:
						if (
							this.moteurGrille.estColVariable(
								aParametres.idColonne,
								DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
									.appreciation,
							)
						) {
							this._surValiderEditionDonnee({
								article: lArticle,
								idColonne: aParametres.idColonne,
								selection: null,
								navigation: { suivante: { orientationVerticale: true } },
							});
						}
						break;
				}
				break;
		}
	}
	_surValiderEditionDonnee(aParam) {
		const lArticle = aParam.article;
		const lListe = aParam.instanceListe
			? aParam.instanceListe
			: this.getInstance(this.identListe);
		let lPromise = null;
		if (aParam.avecModification !== false) {
			switch (aParam.idColonne) {
				case DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
					.elmtPgm:
					lArticle.ElementsProgrammeBulletin = aParam.selection;
					lArticle.ElementsProgrammeBulletin.trier();
					break;
				case DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
					.moyProposee:
					if (aParam.ctxAvisReligion === true) {
						lArticle.avisReligionPropose = aParam.selection;
						lArticle.avisReligionPropose.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					} else {
						lArticle.moyenneProposee = aParam.selection;
					}
					break;
				case DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
					.moyDeliberee:
					if (aParam.ctxAvisReligion === true) {
						lArticle.avisReligionDelibere = aParam.selection;
						lArticle.avisReligionDelibere.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					} else {
						lArticle.moyenneDeliberee = aParam.selection;
					}
					break;
				case DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
					.ects:
					lArticle.ECTS = aParam.selection;
					break;
				default:
					if (
						this.moteurGrille.estColVariable(
							aParam.idColonne,
							DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
								.appreciation,
						)
					) {
						if (
							this.moteurAssSaisie.avecAssistantSaisieActif({
								typeReleveBulletin:
									TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes,
							})
						) {
							this.moteurAssSaisie.validerDonneesSurValider({
								article: lArticle,
								appreciation: aParam.appreciation,
								eltSelectionne: aParam.selection,
							});
						}
					}
					break;
			}
			lArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			switch (aParam.idColonne) {
				case DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
					.elmtPgm:
					this.moteur.saisieEltsPgme({
						paramRequete: {
							classeGroupe: this.getClasse(),
							periode: this.getPeriode(),
							service: lArticle,
							listeEltsPgme: lArticle.ElementsProgrammeBulletin,
						},
						instanceListe: lListe,
						clbckSucces: (aParamSucces) => {
							const lService = this.listeElementsLineaire.getElementParNumero(
								aParamSucces.numeroService,
							);
							if (lService !== null) {
								lService.ElementsProgrammeBulletin = aParamSucces.listeEltsPgme;
							}
						},
						paramCellSuivante: aParam.navigation.suivante,
						clbckEchec: (aPromiseMsg) => {
							this._actualiserSurErreurSaisie({
								liste: lListe,
								promiseMsg: aPromiseMsg,
							});
						},
					});
					break;
				case DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
					.ects:
					this.moteur.saisieECTS({
						paramRequete: {
							estCalculAuto: false,
							classe: this.getClasse(),
							periode: this.getPeriode(),
							eleve: this.getEleve(),
							service: lArticle,
							ECTS: lArticle.ECTS,
						},
						instanceListe: lListe,
						clbckSucces: (aParamSucces) => {
							const lService = this.listeElementsLineaire.getElementParNumero(
								aParamSucces.numeroService,
							);
							if (lService !== null) {
								lService.ECTS = aParamSucces.ECTSSaisie;
							}
						},
						paramCellSuivante: aParam.navigation.suivante,
						clbckEchec: (aPromiseMsg) => {
							this._actualiserSurErreurSaisie({
								liste: lListe,
								promiseMsg: aPromiseMsg,
							});
						},
					});
					break;
				case DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
					.moyProposee:
				case DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
					.moyDeliberee: {
					const lParamRequete = {
						classe: this.getClasse(),
						periode: this.getPeriode(),
						eleve: this.getEleve(),
						service: lArticle,
						estAvisReligion: aParam.ctxAvisReligion === true,
						estProposee:
							aParam.idColonne ===
							DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
								.moyProposee,
					};
					if (
						aParam.idColonne ===
						DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
							.moyProposee
					) {
						if (aParam.ctxAvisReligion === true) {
							$.extend(lParamRequete, {
								avisReligionPropose: lArticle.avisReligionPropose,
							});
						} else {
							$.extend(lParamRequete, {
								moyenneProposee: lArticle.moyenneProposee,
							});
						}
					} else {
						if (aParam.ctxAvisReligion === true) {
							$.extend(lParamRequete, {
								avisReligionDelibere: lArticle.avisReligionDelibere,
							});
						} else {
							$.extend(lParamRequete, {
								moyenneProposee: lArticle.moyenneProposee,
								moyenneDeliberee: lArticle.moyenneDeliberee,
							});
						}
					}
					this.moteur.saisieMoyPropDelib({
						paramRequete: lParamRequete,
						instanceListe: lListe,
						clbckSucces: (aParamSucces) => {
							const lService = this.listeElementsLineaire.getElementParNumero(
								aParamSucces.numeroService,
							);
							if (lService !== null) {
								if (aParamSucces.estProposee) {
									if (aParamSucces.estAvisReligion) {
										lService.avisReligionPropose =
											aParamSucces.avisReligionPropose;
									} else {
										lService.moyenneProposee = aParamSucces.moyenneProposee;
									}
								} else {
									if (aParamSucces.estAvisReligion) {
										lService.avisReligionDelibere =
											aParamSucces.avisReligionDelibere;
									} else {
										lService.moyenneDeliberee = aParamSucces.moyenneDeliberee;
									}
								}
							}
						},
						paramCellSuivante: aParam.navigation.suivante,
						clbckEchec: (aPromiseMsg) => {
							this._actualiserSurErreurSaisie({
								liste: lListe,
								promiseMsg: aPromiseMsg,
							});
						},
					});
					break;
				}
				default:
					if (
						this.moteurGrille.estColVariable(
							aParam.idColonne,
							DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
								.appreciation,
						)
					) {
						const lIndCol = this.moteurGrille.getIndiceColVariable(
							aParam.idColonne,
						);
						const lAppr =
							aParam.appreciation !== null && aParam.appreciation !== undefined
								? aParam.appreciation
								: lArticle.ListeAppreciations.get(lIndCol);
						lPromise = this.saisieAppreciation(
							{
								instanceListe: lListe,
								estCtxPied: aParam.estCtxPied === true,
								suivante: aParam.navigation.suivante,
							},
							{
								classe: this.getClasse(),
								periode: this.getPeriode(),
								eleve: this.getEleve(),
								service: lArticle,
								appreciation: lAppr,
								typeGenreAppreciation: this.moteur.getTypeGenreAppreciation({
									estCtxPied: aParam.estCtxPied === true,
									eleve: this.getEleve(),
									typeReleveBulletin:
										TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes,
									appreciation: lAppr,
								}),
							},
						);
					} else {
					}
					break;
			}
		}
		if (
			!this.moteurGrille.estColVariable(
				aParam.idColonne,
				DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
					.appreciation,
			) &&
			!(
				aParam.idColonne ===
				DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes.ects
			) &&
			!(
				aParam.idColonne ===
				DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
					.moyProposee
			) &&
			!(
				aParam.idColonne ===
				DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
					.moyDeliberee
			) &&
			!(
				aParam.idColonne ===
				DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes.elmtPgm
			)
		) {
			if (
				aParam.navigation !== null &&
				aParam.navigation !== undefined &&
				aParam.navigation.suivante !== null &&
				aParam.navigation.suivante !== undefined
			) {
				this.moteurGrille.selectionCelluleSuivante({
					instanceListe: lListe,
					suivante: aParam.navigation.suivante,
				});
			}
		}
		return lPromise;
	}
	_actualiserSurErreurSaisie(aParam) {
		const lSelection = aParam.liste.getSelectionCellule();
		this.afficherPage();
		if (aParam.promiseMsg !== null && aParam.promiseMsg !== undefined) {
			aParam.promiseMsg.then(() => {
				aParam.liste.selectionnerCellule({
					ligne: lSelection.ligne,
					colonne: lSelection.colonne,
					avecScroll: true,
				});
			});
		}
	}
	_evntSurAssistant() {
		this.moteurAssSaisie.evntBtnAssistant({
			instanceListe: this.getInstance(this.identListe),
			instancePied: this.getInstance(this.identPiedPage),
		});
	}
	_evntSurFenetreAssistantSaisie(aNumeroBouton) {
		const lThis = this;
		const lParam = {
			instanceFenetreAssistantSaisie: this.getInstance(
				this.identFenetreAssistantSaisie,
			),
			eventChangementUtiliserAssSaisie() {
				lThis.getInstance(lThis.identListe).actualiser(true);
				const lInstancePied = lThis.getInstance(lThis.identPiedPage);
				if (lInstancePied && lInstancePied.evenementSurAssistant) {
					lInstancePied.evenementSurAssistant();
				}
			},
			evntClbck: this.surEvntAssSaisie.bind(this),
		};
		this.moteurAssSaisie.evenementAssistantSaisie(aNumeroBouton, lParam);
	}
	surEvntAssSaisie(aParam) {
		const lContexte = this.objCelluleAppreciation;
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
						const lParamSuivante = { orientationVerticale: true };
						this._surValiderEditionDonnee({
							article: lContexte.article,
							idColonne: lContexte.idColonne,
							selection: aParam.eltSelectionne,
							appreciation: lContexte.appreciation,
							instanceListe: lListe,
							estCtxPied: lEstCtxPiedBulletin,
							navigation: { suivante: lParamSuivante },
						});
					};
					break;
				case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
					.PasserEnSaisie:
					lClbck = () => {
						this.moteurAssSaisie.passerEnSaisie({
							instanceListe: lListe,
							idColonne: lContexte.idColonne,
						});
					};
					break;
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
	surEditionElementProgramme(aService) {
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_ElementsProgramme_1.ObjetFenetre_ElementsProgramme,
			{
				pere: this,
				evenement: function (aValider, aDonnees) {
					this.palierElementTravailleSelectionne = aDonnees.palierActif;
					if (aValider) {
						this._surValiderEditionDonnee({
							article: aService,
							idColonne:
								DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes.colonnes
									.elmtPgm,
							selection: aDonnees.listeElementsProgramme,
							navigation: { suivante: { orientationVerticale: true } },
						});
					} else {
						this.getInstance(this.identListe).actualiser(true);
					}
				},
			},
		).setDonnees({
			service: aService,
			periode: this.etatUtilScoEspace.getPeriode(),
			listeElementsProgramme: aService.ElementsProgrammeBulletin,
			palier: this.palierElementTravailleSelectionne,
		});
	}
	surEditionAvisReligion(aContexte) {
		const lDonneesListe = new DonneesListe_Simple_1.DonneesListe_Simple(
			aContexte.listeAvis,
			{ avecTri: false },
		).setOptions({ avecEvnt_SelectionClick: true, avecEvnt_Selection: false });
		lDonneesListe.getValeur = function (aParams) {
			if (aParams.colonne === 0) {
				return aParams.article.description !== null &&
					aParams.article.description !== undefined
					? aParams.article.getLibelle() !== ""
						? aParams.article.getLibelle() +
							" (" +
							aParams.article.description +
							")"
						: aParams.article.description
					: aParams.article.getLibelle();
			}
			return aParams.article.getLibelle();
		};
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			{
				pere: this,
				evenement: this._evntFenetreAvisReligion.bind(this, aContexte),
				initialiser: this.moteur.initFenetreAvisReligion,
			},
		).setDonnees(lDonneesListe, true);
	}
	_evntFenetreAvisReligion(aContexte, aNumeroBouton, aIndiceSelection) {
		switch (aNumeroBouton) {
			case 1: {
				const lEltSelection = aContexte.listeAvis.get(aIndiceSelection);
				if (
					lEltSelection &&
					lEltSelection.getNumero() !== aContexte.avisReligion.getNumero()
				) {
					this._surValiderEditionDonnee({
						article: aContexte.article,
						idColonne: aContexte.idColonne,
						selection: lEltSelection,
						ctxAvisReligion: true,
						navigation: { suivante: { orientationVerticale: true } },
					});
				}
				break;
			}
		}
	}
	_evntSurPied(aParam) {
		this.objCelluleAppreciation = $.extend(aParam, { ctxPiedBulletin: true });
		this.moteurAssSaisie.evenementOuvrirAssistantSaisie({
			instanceFenetreAssistantSaisie: this.getInstance(
				this.identFenetreAssistantSaisie,
			),
			listeTypesAppreciations: this.listeTypesAppreciations,
			tabTypeAppreciation:
				Enumere_TypeAppreciation_1.ETypeAppreciationUtil.getTypeAppreciation(
					this.etatUtilScoEspace.getGenreOnglet(),
					aParam.appreciation,
					true,
				),
			tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
				estCtxPied: true,
				appreciation: aParam.appreciation,
				typeReleveBulletin:
					TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes,
			}),
			avecEtatSaisie: false,
		});
	}
}
exports.InterfaceBulletinNotes_Saisie = InterfaceBulletinNotes_Saisie;
