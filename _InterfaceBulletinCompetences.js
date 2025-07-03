exports._InterfaceBulletinCompetences = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const TypeFusionTitreListe_1 = require("TypeFusionTitreListe");
const ObjetFenetre_DetailEvaluationsCompetences_1 = require("ObjetFenetre_DetailEvaluationsCompetences");
const ObjetRequeteBulletinCompetences_1 = require("ObjetRequeteBulletinCompetences");
const Invocateur_1 = require("Invocateur");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetListe_1 = require("ObjetListe");
const ObjetTabOnglets_1 = require("ObjetTabOnglets");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_BulletinCompetences_1 = require("DonneesListe_BulletinCompetences");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const UtilitaireDeserialiserPiedBulletin_1 = require("UtilitaireDeserialiserPiedBulletin");
const ObjetRequeteDetailEvaluationsCompetences_1 = require("ObjetRequeteDetailEvaluationsCompetences");
const TypeGenreColonneBulletinCompetence_1 = require("TypeGenreColonneBulletinCompetence");
const TypePositionnement_1 = require("TypePositionnement");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const ObjetMoteurPiedDeBulletin_1 = require("ObjetMoteurPiedDeBulletin");
class _InterfaceBulletinCompetences extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.parametresSco = this.applicationSco.getObjetParametres();
		this.idBulletin = this.Nom + "_bull";
		this.idLegende = this.Nom + "_bull_legende";
		this.donnees = {
			listeAccusesReception: null,
			maquetteBulletin: null,
			listeLignes: null,
			rangAppreciation: { appA: 0, appB: 0, appC: 0 },
			typePositionnement: 0,
			typePositionnementSansNote:
				TypePositionnement_1.TypePositionnement.POS_Echelle,
			listeMentions: null,
			objCelluleAppreciation: null,
		};
		this.moteurPdB =
			new ObjetMoteurPiedDeBulletin_1.ObjetMoteurPiedDeBulletin();
	}
	jsxGetClassConteneurListePrincipale() {
		const lClassesCSS = [];
		if (ObjetHtml_1.GHtml.getDisplay(this.getNomInstance(this.identOnglets))) {
			lClassesCSS.push("tabs-contenu");
		}
		return lClassesCSS.join(" ");
	}
	surEditionListe(aParametres) {}
	surApresEditionListe(aParametres) {}
	validerSaisieBulletin(aCallbackSurValidation) {}
	avecAssistantSaisie() {
		return false;
	}
	getTailleMaxAppreciationBulletin() {
		return 0;
	}
	avecLegendeBulletin() {
		return false;
	}
	evenementFenetreDetailEvaluations(
		aNumeroBouton,
		aElementsCompetenceModifies,
	) {}
	construireInstances() {
		this.identOnglets = this.add(
			ObjetTabOnglets_1.ObjetTabOnglets,
			this._evenementSurOnglets.bind(this),
			this._initialiserOnglets,
		);
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListe,
		);
		this.identFenetreDetailEvaluations = this.addFenetre(
			ObjetFenetre_DetailEvaluationsCompetences_1.ObjetFenetre_DetailEvaluationsCompetences,
			this.evenementFenetreDetailEvaluations,
			this.initFenetreDetailEvaluations,
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.IdentZoneAlClient = this.identListe;
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{
					class: "Espace",
					style: ObjetStyle_1.GStyle.composeHeightCalc(10),
					id: this.idBulletin,
				},
				IE.jsx.str(
					"div",
					{ class: "Table BorderBox" },
					IE.jsx.str("div", {
						id: this.getNomInstance(this.identOnglets),
						class: "conteneur-tabs",
					}),
					IE.jsx.str("div", {
						id: this.getNomInstance(this.identListe),
						class: "EspaceBas",
						"ie-class": this.jsxGetClassConteneurListePrincipale.bind(this),
					}),
					IE.jsx.str("div", { id: this.idLegende }),
					IE.jsx.str("div", { id: this.getNomInstance(this.identPiedPage) }),
				),
			),
		);
		return H.join("");
	}
	getListeTypesAppreciations() {}
	_evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
				if (
					aParametres.idColonne ===
						DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
							.colonnes.jauge &&
					this.estJaugeCliquable()
				) {
					this.surClicJaugeEvaluations(aParametres.article);
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				this.surEditionListe(aParametres);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				this.surApresEditionListe(aParametres);
				break;
		}
	}
	initFenetreDetailEvaluations(aInstance) {
		aInstance.setOptionsFenetre({
			titre: "",
			largeur: 700,
			hauteur: 500,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
	}
	evenementAfficherMessage(aGenreMessage) {
		ObjetHtml_1.GHtml.setDisplay(
			this.getNomInstance(this.identPiedPage),
			false,
		);
		super.evenementAfficherMessage(aGenreMessage);
	}
	_evenementDernierMenuDeroulant() {
		this.afficherBandeau(true);
		this.setEtatSaisie(false);
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
		const lInstance = this.getInstance(this.identPiedPage);
		this.moteurPdB.initPiedPage(
			lInstance,
			this.estPourClasse()
				? this.getParametresPiedPageClasse()
				: this.getParametresPiedPageEleve(),
		);
		lInstance.initialiser(true);
		this._recupererDonnees();
	}
	_reponseRequeteBulletinCompetences(aParams) {
		this.avecMessage = false;
		this.donnees.maquetteBulletin = aParams.maquette;
		if (!this.donnees.maquetteBulletin) {
			this.avecMessage = true;
			this.evenementAfficherMessage(aParams.Message);
			ObjetHtml_1.GHtml.setDisplay(
				this.getNomInstance(this.identOnglets),
				false,
			);
			ObjetHtml_1.GHtml.setDisplay(this.idLegende, false);
		} else {
			let lOngletSelectionne = null;
			if (this.donnees.maquetteBulletin.listeBulletins) {
				if (this.onglet) {
					lOngletSelectionne =
						this.donnees.maquetteBulletin.listeBulletins.getElementParElement(
							this.onglet,
						);
				} else {
					lOngletSelectionne =
						this.donnees.maquetteBulletin.listeBulletins.get(0);
				}
			}
			this.onglet = lOngletSelectionne;
			const lIndiceOngletASelectionner = this.onglet
				? this.onglet.getGenre()
				: 0;
			this.getInstance(this.identOnglets).setDonnees(
				this.donnees.maquetteBulletin.listeBulletins,
				lIndiceOngletASelectionner,
			);
			ObjetHtml_1.GHtml.setDisplay(
				this.getNomInstance(this.identOnglets),
				this.donnees.maquetteBulletin.listeBulletins.count() > 1,
			);
			if (
				this.avecLegendeBulletin() &&
				(this.donnees.maquetteBulletin.avecNiveauxMaitrises === true ||
					this.donnees.maquetteBulletin.avecNiveauxPositionnements === true)
			) {
				ObjetHtml_1.GHtml.setHtml(
					this.idLegende,
					UtilitaireCompetences_1.TUtilitaireCompetences.composeLegende({
						avecListeCompetences:
							this.donnees.maquetteBulletin.avecNiveauxMaitrises,
						avecListePositionnements:
							this.donnees.maquetteBulletin.avecNiveauxPositionnements,
						genrePositionnement:
							TypePositionnement_1.TypePositionnementUtil.getGenrePositionnementParDefaut(
								aParams.positionnementClasse,
							),
						affichageLigneSimple: true,
					}),
				);
				ObjetHtml_1.GHtml.setDisplay(this.idLegende, true);
			} else {
				ObjetHtml_1.GHtml.setDisplay(this.idLegende, false);
			}
			this.donnees.listeAccusesReception = aParams.listeAccusesReception;
			const lAvecLigneTotal = !!this.donnees.maquetteBulletin.avecLigneTotal;
			this.getInstance(this.identListe).setOptionsListe({
				colonnes: this.getListeInfoColonnes(aParams.listeColonnes),
				hauteurAdapteContenu: true,
				avecLigneTotal: lAvecLigneTotal,
				nonEditableSurModeExclusif: true,
				scrollHorizontal: true,
				ariaLabel: () => this.getAriaLabelListe(),
			});
			this.donnees.listeLignes = aParams.listeLignes;
			this.donnees.rangAppreciation = {
				appA: aParams.rangAppA,
				appB: aParams.rangAppB,
				appC: aParams.rangAppC,
			};
			this.donnees.typePositionnement = aParams.positionnementClasse;
			this.donnees.typePositionnementSansNote = aParams.positionnementSansNote;
			this.donnees.strInfoDatePublication = aParams.strInfoDatePublication;
			this.donnees.avecBtnCalculPositionnementClasse =
				aParams.avecBtnCalculPositionnementClasse;
			this.donnees.avecAppreciationsSurRegroupement =
				!!aParams.avecAppreciationsSurRegroupement;
			const lParamsDonneesListe = {
				maquette: this.donnees.maquetteBulletin,
				typePositionnementSansNote: aParams.positionnementSansNote,
				estJaugeEvaluationsCliquable: this.estJaugeCliquable(),
				avecAssistantSaisie: this.avecAssistantSaisie(),
				tailleMaxAppr: this.getTailleMaxAppreciationBulletin(),
				avecAppreciationsSurRegroupement:
					this.donnees.avecAppreciationsSurRegroupement,
				donneesLigneTotal: null,
				estJaugeCliquable: this.estJaugeCliquable.bind(this),
			};
			if (lAvecLigneTotal) {
				lParamsDonneesListe.donneesLigneTotal = {
					moyEleve: aParams.moyenneGeneraleEleve,
					moyClasse: aParams.moyenneGeneraleClasse,
				};
			}
			this.getInstance(this.identListe).setDonnees(
				new DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences(
					aParams.listeLignes,
					lParamsDonneesListe,
				),
			);
			ObjetHtml_1.GHtml.setDisplay(
				this.getNomInstance(this.identPiedPage),
				true,
			);
			const lXmlDonneesPiedDePage =
				new UtilitaireDeserialiserPiedBulletin_1.UtilitaireDeserialiserPiedBulletin().creerPiedDePage(
					aParams,
				);
			this.getInstance(this.identPiedPage).setDonnees({
				absences:
					new UtilitaireDeserialiserPiedBulletin_1.UtilitaireDeserialiserPiedBulletin().creerAbsences(
						aParams,
					),
				donnees: lXmlDonneesPiedDePage,
			});
			this.donnees.listeMentions = aParams.listeMentions;
			if (
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.autoriserImpressionBulletinReleveBrevet,
				)
			) {
				Invocateur_1.Invocateur.evenement(
					Invocateur_1.ObjetInvocateur.events.activationImpression,
					Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
					this,
					this._getParametresPDF.bind(this),
				);
			}
		}
		this.surResizeInterface();
	}
	surResizeInterface() {
		if (!!this.donnees.maquetteBulletin) {
			this.getInstance(this.identListe).actualiser(true);
		}
	}
	_initialiserOnglets(aInstance) {
		aInstance.setOptions({ largeurOnglets: 180 });
	}
	_evenementSurOnglets(aOnglet) {
		this.onglet = aOnglet;
		if (this.getEtatSaisie()) {
			this.validerSaisieBulletin(this._recupererDonnees.bind(this));
		} else {
			this._recupererDonnees();
		}
	}
	_recupererDonnees() {
		new ObjetRequeteBulletinCompetences_1.ObjetRequeteBulletinCompetences(
			this,
			this._reponseRequeteBulletinCompetences,
		).lancerRequete({
			classe: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			),
			periode: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
			),
			eleve: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Eleve,
			),
			bulletin: this.onglet,
		});
		this.getListeTypesAppreciations();
	}
	getListeInfoColonnes(aJSONColonnes) {
		const result = [];
		if (aJSONColonnes) {
			result.push({
				id: DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences
					.colonnes.regroupement,
				taille: 4,
				titre: aJSONColonnes.getLibelle(0),
			});
			let lIndexColonneTransversale = 0;
			let lInfoColonne;
			for (let i = 0; i < aJSONColonnes.count(); i++) {
				lInfoColonne = this._getInfoColonne(aJSONColonnes.get(i));
				if (lInfoColonne) {
					const lColonne = {
						id: lInfoColonne.id,
						taille: lInfoColonne.taille,
						titre: lInfoColonne.titre,
						hint: lInfoColonne.hint,
					};
					if (
						DonneesListe_BulletinCompetences_1.DonneesListe_BulletinCompetences.estUneColonneTransversale(
							lInfoColonne.id,
						)
					) {
						lColonne.id += lIndexColonneTransversale;
						lColonne.indexColonneTransv = lIndexColonneTransversale;
						lIndexColonneTransversale++;
					}
					result.push(lColonne);
				}
			}
		}
		return result;
	}
	_getInfoColonne(aColonne) {
		switch (aColonne.getGenre()) {
			case TypeGenreColonneBulletinCompetence_1
				.TypeGenreColonneBulletinCompetence.tCBdC_Services:
				return {
					titre: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
					id: DonneesListe_BulletinCompetences_1
						.DonneesListe_BulletinCompetences.colonnes.service,
					taille: 180,
				};
			case TypeGenreColonneBulletinCompetence_1
				.TypeGenreColonneBulletinCompetence.tCBdC_EltPilier:
				return {
					titre: aColonne.getLibelle(),
					hint: aColonne.hint,
					id: DonneesListe_BulletinCompetences_1
						.DonneesListe_BulletinCompetences.colonnes.competence,
					taille: ObjetListe_1.ObjetListe.initColonne(100, 100, 300),
				};
			case TypeGenreColonneBulletinCompetence_1
				.TypeGenreColonneBulletinCompetence.tCBdC_EltProg:
				return {
					titre: aColonne.getLibelle(),
					hint: aColonne.hint,
					id: DonneesListe_BulletinCompetences_1
						.DonneesListe_BulletinCompetences.colonnes.elementsProgramme,
					taille: ObjetListe_1.ObjetListe.initColonne(100, 100, 300),
				};
			case TypeGenreColonneBulletinCompetence_1
				.TypeGenreColonneBulletinCompetence.tCBdC_Jauge:
				return {
					titre: aColonne.getLibelle(),
					hint: aColonne.hint,
					id: DonneesListe_BulletinCompetences_1
						.DonneesListe_BulletinCompetences.colonnes.jauge,
					taille: 400,
				};
			case TypeGenreColonneBulletinCompetence_1
				.TypeGenreColonneBulletinCompetence.tCBdC_NivAcqComp:
				return {
					titre: aColonne.getLibelle(),
					hint: aColonne.hint,
					id: DonneesListe_BulletinCompetences_1
						.DonneesListe_BulletinCompetences.colonnes.niveauAcqComp,
					taille: 50,
				};
			case TypeGenreColonneBulletinCompetence_1
				.TypeGenreColonneBulletinCompetence.tCBdC_Pourcentage:
				return {
					titre: aColonne.getLibelle(),
					hint: aColonne.hint,
					id: DonneesListe_BulletinCompetences_1
						.DonneesListe_BulletinCompetences.colonnes.pourcentage,
					taille: 60,
				};
			case TypeGenreColonneBulletinCompetence_1
				.TypeGenreColonneBulletinCompetence.tCBdC_PosLSUP1:
				return {
					titre: aColonne.getLibelle(),
					hint: aColonne.hint,
					id: DonneesListe_BulletinCompetences_1
						.DonneesListe_BulletinCompetences.colonnes.posLSUP1,
					taille: 50,
				};
			case TypeGenreColonneBulletinCompetence_1
				.TypeGenreColonneBulletinCompetence.tCBdC_PosLSUP2:
				return {
					titre: aColonne.getLibelle(),
					hint: aColonne.hint,
					id: DonneesListe_BulletinCompetences_1
						.DonneesListe_BulletinCompetences.colonnes.posLSUP2,
					taille: 50,
				};
			case TypeGenreColonneBulletinCompetence_1
				.TypeGenreColonneBulletinCompetence.tCBdC_PosLSU:
				return {
					titre: aColonne.getLibelle(),
					hint: aColonne.hint,
					id: DonneesListe_BulletinCompetences_1
						.DonneesListe_BulletinCompetences.colonnes.posLSU,
					taille: 50,
				};
			case TypeGenreColonneBulletinCompetence_1
				.TypeGenreColonneBulletinCompetence.tCBdC_Note:
				return {
					titre: aColonne.getLibelle(),
					hint: aColonne.hint,
					id: DonneesListe_BulletinCompetences_1
						.DonneesListe_BulletinCompetences.colonnes.note,
					taille: 50,
				};
			case TypeGenreColonneBulletinCompetence_1
				.TypeGenreColonneBulletinCompetence.tCBdC_MoyenneClasse:
				return {
					titre: aColonne.getLibelle(),
					hint: aColonne.hint,
					id: DonneesListe_BulletinCompetences_1
						.DonneesListe_BulletinCompetences.colonnes.moyenneClasse,
					taille: 50,
				};
			case TypeGenreColonneBulletinCompetence_1
				.TypeGenreColonneBulletinCompetence.tCBdC_MoyenneInf:
				return {
					titre: aColonne.getLibelle(),
					hint: aColonne.hint,
					id: DonneesListe_BulletinCompetences_1
						.DonneesListe_BulletinCompetences.colonnes.moyenneInf,
					taille: 50,
				};
			case TypeGenreColonneBulletinCompetence_1
				.TypeGenreColonneBulletinCompetence.tCBdC_MoyenneSup:
				return {
					titre: aColonne.getLibelle(),
					hint: aColonne.hint,
					id: DonneesListe_BulletinCompetences_1
						.DonneesListe_BulletinCompetences.colonnes.moyenneSup,
					taille: 50,
				};
			case TypeGenreColonneBulletinCompetence_1
				.TypeGenreColonneBulletinCompetence.tCBdC_AppreciationA:
				return {
					titre: aColonne.getLibelle(),
					hint: aColonne.hint,
					id: DonneesListe_BulletinCompetences_1
						.DonneesListe_BulletinCompetences.colonnes.appreciationA,
					taille: ObjetListe_1.ObjetListe.initColonne(100, 100, 300),
				};
			case TypeGenreColonneBulletinCompetence_1
				.TypeGenreColonneBulletinCompetence.tCBdC_AppreciationB:
				return {
					titre: aColonne.getLibelle(),
					hint: aColonne.hint,
					id: DonneesListe_BulletinCompetences_1
						.DonneesListe_BulletinCompetences.colonnes.appreciationB,
					taille: ObjetListe_1.ObjetListe.initColonne(100, 100, 300),
				};
			case TypeGenreColonneBulletinCompetence_1
				.TypeGenreColonneBulletinCompetence.tCBdC_AppreciationC:
				return {
					titre: aColonne.getLibelle(),
					hint: aColonne.hint,
					id: DonneesListe_BulletinCompetences_1
						.DonneesListe_BulletinCompetences.colonnes.appreciationC,
					taille: ObjetListe_1.ObjetListe.initColonne(100, 100, 300),
				};
			default:
				return {
					titre: aColonne.getLibelle(),
					hint: aColonne.hint,
					id: DonneesListe_BulletinCompetences_1
						.DonneesListe_BulletinCompetences.colonnes.prefixe_col_transv,
					taille: 50,
				};
		}
	}
	surClicJaugeEvaluations(aLigne) {
		if (aLigne.relationsESI && aLigne.relationsESI.length) {
			new ObjetRequeteDetailEvaluationsCompetences_1.ObjetRequeteDetailEvaluationsCompetences(
				this,
				this._reponseRequeteDetailEvaluations.bind(this, aLigne),
			).lancerRequete({
				eleve: this.etatUtilisateurSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Eleve,
				),
				pilier: null,
				periode: this.etatUtilisateurSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Periode,
				),
				numRelESI: aLigne.relationsESI,
			});
		}
	}
	_reponseRequeteDetailEvaluations(aLigne, aJSON) {
		const lFenetre = this.getInstance(this.identFenetreDetailEvaluations);
		const lTitreParDefaut = lFenetre.getTitreFenetreParDefaut(
			this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Eleve,
			),
			aLigne,
		);
		lFenetre.setDonnees(aLigne, aJSON, { titreFenetre: lTitreParDefaut });
	}
}
exports._InterfaceBulletinCompetences = _InterfaceBulletinCompetences;
