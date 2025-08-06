exports.InterfaceSaisieApprGenerale = void 0;
const InterfacePage_1 = require("InterfacePage");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const ObjetFenetre_AssistantSaisie_1 = require("ObjetFenetre_AssistantSaisie");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const ObjetRequetePageAppreciationsGenerales_1 = require("ObjetRequetePageAppreciationsGenerales");
const ObjetListe_1 = require("ObjetListe");
const DonneesListe_ApprGenerale_1 = require("DonneesListe_ApprGenerale");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const ObjetMoteurPiedDeBulletin_1 = require("ObjetMoteurPiedDeBulletin");
const ObjetMoteurAssistantSaisie_1 = require("ObjetMoteurAssistantSaisie");
const EBoutonFenetreAssistantSaisie_1 = require("EBoutonFenetreAssistantSaisie");
const Enumere_TypeAppreciation_1 = require("Enumere_TypeAppreciation");
const Enumere_Etat_1 = require("Enumere_Etat");
const Invocateur_1 = require("Invocateur");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const Invocateur_2 = require("Invocateur");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const ObjetFenetre_Mention_1 = require("ObjetFenetre_Mention");
const Enumere_AppreciationGenerale_1 = require("Enumere_AppreciationGenerale");
class InterfaceSaisieApprGenerale extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		switch (GEtatUtilisateur.getGenreOnglet()) {
			case Enumere_Onglet_1.EGenreOnglet.SaisieApprGeneralesReleve:
				this.typeReleveBulletin =
					TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes;
				break;
			case Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsGenerales:
				this.typeReleveBulletin =
					TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes;
				break;
			case Enumere_Onglet_1.EGenreOnglet
				.SaisieAppreciationsGenerales_Competences:
				this.typeReleveBulletin =
					TypeReleveBulletin_1.TypeReleveBulletin.BulletinCompetences;
				break;
		}
		this.moteur = new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
		this.moteurAssSaisie =
			new ObjetMoteurAssistantSaisie_1.ObjetMoteurAssistantSaisie();
		this.moteurPdB =
			new ObjetMoteurPiedDeBulletin_1.ObjetMoteurPiedDeBulletin();
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
			getDisabled: () => {
				return this.donnees === null;
			},
		};
	}
	jsxGetHtmlInfoCloture() {
		return this.strInfoCloture ? this.strInfoCloture : "";
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
	getAppreciation() {
		return this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Appreciation,
		);
	}
	envoyerRequete(aParam) {
		new ObjetRequetePageAppreciationsGenerales_1.ObjetRequetePageAppreciationsGenerales(
			this,
			this._actionSurRecupererDonnees.bind(this),
		).lancerRequete(aParam);
	}
	getListeTypesAppreciations() {
		this.moteurAssSaisie.getListeTypesAppreciations({
			typeReleveBulletin: this.typeReleveBulletin,
			estCtxApprGenerale: true,
			clbck: (aListeTypesAppreciations) => {
				this.listeTypesAppreciations = aListeTypesAppreciations;
			},
		});
	}
	saisieAppreciation(aParam, aParamRequete) {
		const lParam = {
			instanceListe: aParam.instanceListe,
			paramRequete: aParamRequete,
			paramCellSuivante: aParam.suivante,
			clbckEchec: (aPromiseMsg) => {
				this._actualiserSurErreurSaisie({
					liste: aParam.instanceListe,
					promiseMsg: aPromiseMsg,
				});
			},
			clbckSucces: (aParamSucces) => {
				const lDonneesListe = this.getInstance(
					this.identListe,
				).getListeArticles();
				const lLignes = lDonneesListe.getListeElements((aLigne) => {
					return (
						aLigne.eleve.getNumero() === aParamSucces.numeroEleve &&
						!aLigne.estPere &&
						aLigne.appreciationGle.getGenre() ===
							aParamSucces.apprSaisie.getGenre()
					);
				});
				const lLigne = lLignes.get(0);
				let lApp = lLigne.appreciationGle;
				if (lApp) {
					lApp.setNumero(aParamSucces.apprSaisie.getNumero());
					lApp.setLibelle(aParamSucces.apprSaisie.getLibelle());
					lApp.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
				}
			},
		};
		this.moteur.saisieAppreciation(lParam);
	}
	construireInstances() {
		this.identTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this._evntSurDernierMenuDeroulant.bind(this),
			this._initTripleCombo.bind(this),
		);
		if (
			this.identTripleCombo !== null &&
			this.identTripleCombo !== undefined &&
			this.getInstance(this.identTripleCombo) !== null
		) {
			this.IdPremierElement = this.getInstance(
				this.identTripleCombo,
			).getPremierElement();
		}
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evntSurListe.bind(this),
		);
		if (
			this.typeReleveBulletin !==
			TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes
		) {
			this.identFenetreMentions = this.add(
				ObjetFenetre_Mention_1.ObjetFenetre_Mention,
				this._evntMention.bind(this),
				this._initMentions.bind(this),
			);
		}
		this.instancierAssistantSaisie();
		this.construireFicheEleveEtFichePhoto();
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = true;
		this.AddSurZone = [this.identTripleCombo];
		this.AddSurZone.push({
			html: IE.jsx.str("span", {
				"ie-html": this.jsxGetHtmlInfoCloture.bind(this),
			}),
		});
		this.AddSurZone.push({ separateur: true });
		if (this.avecAssistantSaisie()) {
			this.AddSurZone.push({
				html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnAssistantSaisie(
					this.jsxModeleBoutonAssistantSaisie.bind(this),
				),
			});
		}
		this.addSurZoneFicheEleve();
	}
	evenementAfficherMessage(aMessage) {
		this._evenementAfficherMessage(aMessage);
	}
	desactiverImpression() {
		Invocateur_1.Invocateur.evenement(
			Invocateur_2.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
	}
	selectionneEleveAutoDansPage() {
		const lTrouve = this.selectionnerEleveCourant();
		this.activerFichesEleve(lTrouve);
	}
	selectionnerEleveCourant() {
		let lTrouve = false;
		const lEleve = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Eleve,
		);
		if (lEleve && !lEleve.multiSelection) {
			const lDonneesListe = this.getInstance(
				this.identListe,
			).getListeArticles();
			for (let i = 0, lNbr = lDonneesListe.count(); i < lNbr; i++) {
				if (!lTrouve) {
					const lElement = lDonneesListe.get(i);
					if (lElement.eleve.getNumero() === lEleve.getNumero()) {
						lTrouve = true;
						this.getInstance(this.identListe).selectionnerLigne({
							ligne: i,
							avecScroll: true,
						});
						break;
					}
				}
			}
		}
		return lTrouve;
	}
	avecAssistantSaisie() {
		return this.moteurAssSaisie.avecAssistantSaisie({
			typeReleveBulletin: this.typeReleveBulletin,
			estCtxApprGenerale: true,
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
	ouvrirFenetreAssistantSaisiePourLignesSelectionnees() {
		this.viderListeContextesCelluleAppreciation();
		const lSelections = this.getInstance(
			this.identListe,
		).getListeElementsSelection();
		if (!!lSelections && lSelections.count() > 0) {
			for (const lArticleLigneSelectionnee of lSelections) {
				this.sauverContexteCelluleAppreciation(
					lArticleLigneSelectionnee.appreciationGle,
					lArticleLigneSelectionnee,
					DonneesListe_ApprGenerale_1.DonneesListe_ApprGenerale.colonnes
						.appreciationGenerale,
				);
			}
			const lPremiereAppreciation = lSelections.get(0).appreciationGle;
			this.ouvrirFenetreAssistantSaisie(lPremiereAppreciation);
		}
	}
	ouvrirFenetreAssistantSaisie(aObjAppreciation) {
		const lEstEnMultiSelection =
			this.contexteCellulesAppreciationEstMultiCellules();
		this.getInstance(this.identFenetreAssistantSaisie).setParametres({
			avecBoutonPasserEnSaisie: !lEstEnMultiSelection,
		});
		let lGenreAppr = this._estCtxCPE()
			? Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale.AG_CPE
			: null;
		const lTailleMaxAppr = this.moteur.getTailleMaxAppreciation({
			estCtxApprGenerale: true,
			estCtxPied: false,
			typeReleveBulletin: this.typeReleveBulletin,
			genreAppr: lGenreAppr,
		});
		this.moteurAssSaisie.evenementOuvrirAssistantSaisie({
			instanceFenetreAssistantSaisie: this.getInstance(
				this.identFenetreAssistantSaisie,
			),
			listeTypesAppreciations: this.listeTypesAppreciations,
			tabTypeAppreciation:
				Enumere_TypeAppreciation_1.ETypeAppreciationUtil.getTypeAppreciation(
					this.etatUtilisateurSco.getGenreOnglet(),
					aObjAppreciation,
					false,
				),
			tailleMaxAppreciation: lTailleMaxAppr,
			avecEtatSaisie: false,
		});
	}
	ouvrirFenetreChoixMentions() {
		this.moteurPdB.evenementOuvrirMentions({
			instanceFenetre: this.getInstance(this.identFenetreMentions),
			listeMentions: this.donnees.listeMentions,
		});
	}
	viderListeContextesCelluleAppreciation() {
		this.listeContextesCellulesAppreciation = [];
	}
	sauverContexteCelluleAppreciation(aObjAppreciation, aArticle, aIdColonne) {
		const lContexteCelluleAppreciation = {
			article: aArticle,
			appreciation: aObjAppreciation,
			idColonne: aIdColonne,
			ctxPiedBulletin: false,
		};
		this.listeContextesCellulesAppreciation.push(lContexteCelluleAppreciation);
	}
	contexteCellulesAppreciationEstMultiCellules() {
		return this.listeContextesCellulesAppreciation.length > 1;
	}
	_initTripleCombo(aInstance) {
		const lCombos = [Enumere_Ressource_1.EGenreRessource.Classe];
		lCombos.push(Enumere_Ressource_1.EGenreRessource.Periode);
		if (
			this.typeReleveBulletin !==
			TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes
		) {
			lCombos.push(Enumere_Ressource_1.EGenreRessource.Appreciation);
		}
		aInstance.setParametres(lCombos, false);
	}
	_evntSurDernierMenuDeroulant() {
		this._actualiserDonnees();
	}
	_actualiserDonnees() {
		this.getListeTypesAppreciations();
		const lParam = {
			classe: this.getClasse(),
			periode: this.getPeriode(),
			appreciation: null,
			estUneRubrique: false,
		};
		if (
			this.typeReleveBulletin !==
			TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes
		) {
			const lAppreciation = this.getAppreciation();
			lParam.appreciation = lAppreciation;
			lParam.estUneRubrique = lAppreciation && !!lAppreciation.estUneRubrique;
		}
		this.envoyerRequete(lParam);
	}
	_evntSurListe(aParametres) {
		const lLigne = aParametres.article;
		const lClasse = this._getInfoClasseEleve(lLigne);
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.etatUtilisateurSco.Navigation.setRessource(
					Enumere_Ressource_1.EGenreRessource.Eleve,
					aParametres.article.eleve,
				);
				this.surSelectionEleve();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				switch (aParametres.idColonne) {
					case DonneesListe_ApprGenerale_1.DonneesListe_ApprGenerale.colonnes
						.evolution:
						this.moteur.ouvrirMenuEvolution({
							id: this.getInstance(this.identListe).getIdCellule(
								aParametres.colonne,
								aParametres.ligne,
							),
							instance: this,
							clbackMenuEvolution: (aEvolution) => {
								if (aEvolution) {
									this.moteur.saisieEvolution({
										paramRequete: {
											evolution: aEvolution.getGenre(),
											classe: lClasse,
											periode: this.getPeriode(),
											eleve: lLigne.eleve,
										},
										instanceListe: this.getInstance(this.identListe),
										clbckSucces: (aParamSucces) => {
											const lObjListe = this.getInstance(this.identListe);
											const lDonneesDeLaListe = lObjListe.getListeArticles();
											const lEstCasRubrique =
												lObjListe.getDonneesListe().param.estCtxRubrique;
											const lLignes = lDonneesDeLaListe.getListeElements(
												(aLigne) => {
													return (
														aLigne.eleve.getNumero() ===
															aParamSucces.numeroEleve &&
														(!lEstCasRubrique || aLigne.estPere)
													);
												},
											);
											const lLigne = lLignes.get(0);
											if (aParamSucces.evolutionSaisie) {
												lLigne.listePeriodesPrec.parcourir(
													(aEltPeriodePrec) => {
														aEltPeriodePrec.evolution =
															aParamSucces.evolutionSaisie;
													},
												);
											}
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
							},
						});
						break;
					case DonneesListe_ApprGenerale_1.DonneesListe_ApprGenerale.colonnes
						.appreciationGenerale: {
						this.viderListeContextesCelluleAppreciation();
						const lObjetAppreciation =
							DonneesListe_ApprGenerale_1.DonneesListe_ApprGenerale.getAppreciationDeColonne(
								aParametres,
							);
						if (
							this.moteurPdB.estMention({ appreciation: lObjetAppreciation })
						) {
							if (
								this.typeReleveBulletin ===
								TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes
							) {
								return;
							}
							this.sauverContexteCelluleAppreciation(
								lObjetAppreciation,
								aParametres.article,
								aParametres.idColonne,
							);
							this.ouvrirFenetreChoixMentions();
						} else {
							this.sauverContexteCelluleAppreciation(
								lObjetAppreciation,
								aParametres.article,
								aParametres.idColonne,
							);
							this.ouvrirFenetreAssistantSaisie(lObjetAppreciation);
						}
						break;
					}
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				switch (aParametres.idColonne) {
					case DonneesListe_ApprGenerale_1.DonneesListe_ApprGenerale.colonnes
						.appreciationGenerale:
						this._saisirAppreciation({
							appr: lLigne.appreciationGle,
							eleve: lLigne.eleve,
							classe: lClasse,
							avecSaisieSurCelluleSuivante: true,
						});
						break;
				}
				break;
		}
	}
	_getInfoClasse() {
		let lClasse = this.getClasse();
		if (
			lClasse !== null &&
			lClasse !== undefined &&
			lClasse.getNumero() !== -1 &&
			lClasse.getGenre() !== Enumere_Ressource_1.EGenreRessource.Aucune
		) {
			return lClasse;
		} else {
		}
	}
	_getInfoClasseEleve(aLigne) {
		if (aLigne && aLigne.classe) {
			return aLigne.classe;
		} else {
			return this._getInfoClasse();
		}
	}
	_actualiserSurErreurSaisie(aParam) {
		const lSelection = aParam.liste.getSelectionCellule();
		this._actualiserDonnees();
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
	_saisirAppreciation(aParam) {
		let lSuivante = null;
		if (aParam.avecSaisieSurCelluleSuivante) {
			const lNumColonneAppreciation = this.getInstance(
				this.identListe,
			).getNumeroColonneDIdColonne(
				DonneesListe_ApprGenerale_1.DonneesListe_ApprGenerale.colonnes
					.appreciationGenerale,
			);
			lSuivante = {
				orientationVerticale: true,
				colonne: lNumColonneAppreciation,
			};
		}
		this.saisieAppreciation(
			{ instanceListe: this.getInstance(this.identListe), suivante: lSuivante },
			{
				classe: aParam.classe,
				periode: this.getPeriode(),
				eleve: aParam.eleve,
				appreciation: aParam.appr,
				typeGenreAppreciation: this.moteur.getTypeGenreAppreciation({
					estCtxApprGenerale: true,
					estCtxPied: false,
					eleve: aParam.eleve,
					typeReleveBulletin: this.typeReleveBulletin,
					appreciation: aParam.appr,
				}),
			},
		);
	}
	_actionSurRecupererDonnees(aParam) {
		this.desactiverImpression();
		if (aParam.message !== null && aParam.message !== undefined) {
			this.donnees = null;
			this.evenementAfficherMessage(aParam.message);
		} else {
			this.donnees = aParam;
			this._afficherBulletin(aParam);
			this._activerImpression();
		}
		this.afficherBandeau(true);
	}
	_activerImpression() {
		const lGenreImpression = this.moteur.getGenreImpression({
			typeReleveBulletin: this.typeReleveBulletin,
			estCtxApprGenerale: true,
		});
		Invocateur_1.Invocateur.evenement(
			Invocateur_2.ObjetInvocateur.events.activationImpression,
			lGenreImpression,
			this,
			lGenreImpression ===
				Enumere_GenreImpression_1.EGenreImpression.GenerationPDF
				? this.getParametresPDF.bind(this)
				: null,
		);
	}
	getParametresPDF() {
		let lClasse = this._getInfoClasse();
		const lParam = {
			genreGenerationPDF: this.moteur.getGenreGenerationPdf({
				typeReleveBulletin: this.typeReleveBulletin,
				estCtxApprGenerale: true,
			}),
			periode: this.getPeriode(),
			ressource: lClasse,
		};
		if (
			this.typeReleveBulletin !==
			TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes
		) {
			const lAppreciation = this.getAppreciation();
			$.extend(lParam, {
				appreciation: lAppreciation,
				estUneRubrique:
					lAppreciation.estUneRubrique !== null &&
					lAppreciation.estUneRubrique !== undefined
						? lAppreciation.estUneRubrique
						: false,
			});
		}
		const lDonneesListe = this.getInstance(this.identListe).getDonneesListe();
		if (lDonneesListe.param.avecSelectionPeriodePrec === true) {
			$.extend(lParam, {
				periodePrec: lDonneesListe.param.periodePrecCourante,
			});
		} else if (
			lDonneesListe.param.listePeriodesPrec &&
			lDonneesListe.param.listePeriodesPrec.count() > 0
		) {
			$.extend(lParam, {
				periodePrec: lDonneesListe.param.listePeriodesPrec.get(0),
			});
		}
		return lParam;
	}
	_estCtxCPE() {
		if (
			this.typeReleveBulletin !==
			TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes
		) {
			let lApprDuCombo = this.getAppreciation();
			if (lApprDuCombo !== null && lApprDuCombo !== undefined) {
				if (lApprDuCombo.estUneRubrique) {
					return lApprDuCombo.Genre === 3;
				} else {
					return (
						lApprDuCombo.Genre ===
						Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale.AG_CPE - 1
					);
				}
			}
			return false;
		}
		return false;
	}
	_afficherBulletin(aParam) {
		this.strInfoCloture = aParam.strInfoCloture || "";
		let lGenreAppr = this._estCtxCPE()
			? Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale.AG_CPE
			: null;
		let lEstCtxRubrique = false;
		if (
			this.typeReleveBulletin !==
			TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes
		) {
			let lAppreciation = this.getAppreciation();
			lEstCtxRubrique =
				lAppreciation !== null && lAppreciation !== undefined
					? lAppreciation.estUneRubrique
					: false;
		}
		const lParamDonneesListe = {
			instanceListe: this.getInstance(this.identListe),
			typeReleveBulletin: this.typeReleveBulletin,
			avecMultiSelectionLignes: this.applicationSco.estPrimaire,
			tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
				estCtxApprGenerale: true,
				estCtxPied: false,
				typeReleveBulletin: this.typeReleveBulletin,
				genreAppr: lGenreAppr,
			}),
			estCtxRubrique: lEstCtxRubrique,
			listeColVisibles: aParam.listeColonnes,
			callbackOuvrirAssSaisie:
				this.ouvrirFenetreAssistantSaisiePourLignesSelectionnees.bind(this),
		};
		const lInfosCol = this.moteur.getInfosCol(
			aParam.listeColonnes,
			DonneesListe_ApprGenerale_1.DonneesListe_ApprGenerale.colonnes
				.periodePrec,
		);
		if (lInfosCol) {
			const lAvecComboSelectionPeriode =
				aParam.listePeriodesPrec !== null &&
				aParam.listePeriodesPrec !== undefined &&
				aParam.listePeriodesPrec.count() > 1;
			$.extend(lParamDonneesListe, {
				avecSelectionPeriodePrec: lAvecComboSelectionPeriode,
				listePeriodesPrec: aParam.listePeriodesPrec,
				clbckSelectionPeriode: () => {
					this.getInstance(this.identListe).actualiser(true);
				},
			});
		}
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_ApprGenerale_1.DonneesListe_ApprGenerale(
				aParam.listeLignes,
				lParamDonneesListe,
			),
		);
		this.selectionneEleveAutoDansPage();
	}
	_initMentions(aInstance) {
		this.moteurPdB.initialiserMentions({ instanceFenetre: aInstance });
	}
	_evntMention(aGenreBouton) {
		let lObjCelluleAppreciation = null;
		if (
			this.listeContextesCellulesAppreciation &&
			this.listeContextesCellulesAppreciation.length > 0
		) {
			lObjCelluleAppreciation = this.listeContextesCellulesAppreciation[0];
		}
		if (lObjCelluleAppreciation) {
			const lContexte = {
				classe: this._getInfoClasseEleve(lObjCelluleAppreciation.article),
				periode: this.getPeriode(),
				eleve: lObjCelluleAppreciation.article.eleve,
				service: null,
				typeReleveBulletin: this.typeReleveBulletin,
			};
			const lParam = $.extend(lObjCelluleAppreciation, {
				instanceListe: this.getInstance(this.identListe),
				instanceFenetre: this.getInstance(this.identFenetreMentions),
				avecValidationAuto: true,
				clbckValidationAutoSurEdition: this._clbckValidationAutoSurEdition.bind(
					this,
					lContexte,
				),
			});
			this.moteurPdB.evenementMention(aGenreBouton, lParam);
		}
	}
	_clbckValidationAutoSurEdition(aCtx, aParam) {
		const lParametres = $.extend(aParam, {
			suivante: {
				orientationVerticale: true,
				entrerEdition: true,
				avecCelluleEditable: true,
			},
		});
		this.moteurPdB.clbckValidationAutoSurEditionPdB(
			$.extend(aCtx, {
				clbckSaisieAppreciation: this.saisieAppreciation.bind(this),
			}),
			lParametres,
		);
	}
	_evntSurAssistant() {
		this.moteurAssSaisie.evntBtnAssistant({
			instanceListe: this.getInstance(this.identListe),
			instancePied: null,
		});
	}
	_evntSurFenetreAssistantSaisie(aNumeroBouton) {
		const lParam = {
			instanceFenetreAssistantSaisie: this.getInstance(
				this.identFenetreAssistantSaisie,
			),
			eventcall: () => {
				this.getInstance(this.identListe).actualiser(true);
			},
			evntClbck: this.surEvntAssSaisie.bind(this),
		};
		this.moteurAssSaisie.evenementAssistantSaisie(aNumeroBouton, lParam);
	}
	_validerAppreciation(aParam, aParamSaisie) {
		const lListeContextes = aParamSaisie.listeContextes;
		if (lListeContextes && lListeContextes.length > 0) {
			const lAvecPassageCelluleSuivante = lListeContextes.length === 1;
			for (const lContexte of lListeContextes) {
				if (
					this.moteurAssSaisie.avecAssistantSaisieActif({
						typeReleveBulletin: this.typeReleveBulletin,
					})
				) {
					this.moteurAssSaisie.validerDonneesSurValider({
						article: lContexte.article,
						appreciation: lContexte.appreciation,
						eltSelectionne: aParam.eltSelectionne,
					});
				}
				this._saisirAppreciation({
					eleve: lContexte.article.eleve,
					classe: this._getInfoClasseEleve(lContexte.article),
					appr: lContexte.appreciation,
					avecSaisieSurCelluleSuivante: lAvecPassageCelluleSuivante,
				});
			}
		}
	}
	surEvntAssSaisie(aParam) {
		const lInstanceListe = this.getInstance(this.identListe);
		if (lInstanceListe !== null && lInstanceListe !== undefined) {
			let lClbck;
			switch (aParam.cmd) {
				case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
					.Valider:
					lClbck = () => {
						this._validerAppreciation(aParam, {
							listeContextes: this.listeContextesCellulesAppreciation,
						});
					};
					break;
				case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
					.PasserEnSaisie:
					lClbck = () => {
						const lContexteUnique = this.listeContextesCellulesAppreciation[0];
						this.moteurAssSaisie.passerEnSaisie({
							instanceListe: lInstanceListe,
							idColonne: lContexteUnique.idColonne,
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
}
exports.InterfaceSaisieApprGenerale = InterfaceSaisieApprGenerale;
