const { TypeDroits } = require("ObjetDroitsPN.js");
const { TypeFusionTitreListe } = require("TypeFusionTitreListe.js");
const {
	ObjetFenetre_DetailEvaluationsCompetences,
} = require("ObjetFenetre_DetailEvaluationsCompetences.js");
const { ObjetFicheGraphe } = require("ObjetFicheGraphe.js");
const {
	ObjetRequeteBulletinCompetences,
} = require("ObjetRequeteBulletinCompetences.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { GHtml } = require("ObjetHtml.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetTabOnglets } = require("ObjetTabOnglets.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	DonneesListe_BulletinCompetences,
} = require("DonneesListe_BulletinCompetences.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const {
	UtilitaireDeserialiserPiedBulletin,
} = require("UtilitaireDeserialiserPiedBulletin.js");
const {
	ObjetRequeteDetailEvaluationsCompetences,
} = require("ObjetRequeteDetailEvaluationsCompetences.js");
const {
	TypeGenreColonneBulletinCompetence,
} = require("TypeGenreColonneBulletinCompetence.js");
const {
	TypePositionnement,
	TypePositionnementUtil,
} = require("TypePositionnement.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const { ObjetMoteurPiedDeBulletin } = require("ObjetMoteurPiedDeBulletin.js");
class _InterfaceBulletinCompetences extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.idBulletin = this.Nom + "_bull";
		this.idLegende = this.Nom + "_bull_legende";
		this.hauteurs = { max_PiedDeBulletin: 400, min_ConteneurListe: 300 };
		this.donnees = {
			listeAccusesReception: null,
			maquetteBulletin: null,
			listeLignes: null,
			rangAppreciation: { appA: 0, appB: 0, appC: 0 },
			typePositionnement: 0,
			typePositionnementSansNote: TypePositionnement.POS_Echelle,
			listeMentions: null,
			objCelluleAppreciation: null,
		};
		this.moteurPdB = new ObjetMoteurPiedDeBulletin();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getClasseCSSConteneurListePrincipale() {
				const lClassesCSS = [];
				if (
					GHtml.getDisplay(
						aInstance.getInstance(aInstance.identOnglets).getNom(),
					)
				) {
					lClassesCSS.push("tabs-contenu");
				}
				return lClassesCSS.join(" ");
			},
		});
	}
	_getParametresPDF() {}
	estPourClasse() {}
	estJaugeCliquable() {
		return false;
	}
	surEditionListe() {}
	surApresEditionListe() {}
	getParametresPiedPageEleve() {}
	getParametresPiedPageClasse() {}
	validerSaisieBulletin() {}
	avecAssistantSaisie() {
		return false;
	}
	getTailleMaxAppreciationBulletin() {
		return 0;
	}
	avecLegendeBulletin() {
		return false;
	}
	evenementFenetreDetailEvaluations() {}
	construireInstances() {
		this.identOnglets = this.add(
			ObjetTabOnglets,
			_evenementSurOnglets.bind(this),
			_initialiserOnglets,
		);
		this.identListe = this.add(ObjetListe, this._evenementSurListe);
		this.identFenetreDetailEvaluations = this.addFenetre(
			ObjetFenetre_DetailEvaluationsCompetences,
			this.evenementFenetreDetailEvaluations,
			this.initFenetreDetailEvaluations,
		);
		this.identFicheGraphe = this.add(ObjetFicheGraphe);
	}
	setParametresGeneraux() {
		this.GenreStructure = EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.IdentZoneAlClient = this.identListe;
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			'<div class="Espace" style="height:100%" _tyle="',
			GNavigateur.isLayoutTactile ? "" : GStyle.composeHeightCalc(10),
			'" id="',
			this.idBulletin,
			'">',
		);
		H.push('  <div class="Table BorderBox">');
		H.push(
			'    <div id="',
			this.getInstance(this.identOnglets).getNom(),
			'" class="conteneur-tabs"></div>',
		);
		H.push(
			'    <div id="',
			this.getInstance(this.identListe).getNom(),
			'" class="EspaceBas" ie-class="getClasseCSSConteneurListePrincipale"></div>',
		);
		H.push('    <div id="', this.idLegende, '"></div>');
		H.push(
			'    <div id="',
			this.getInstance(this.identPiedPage).getNom(),
			'"></div>',
		);
		H.push("  </div>");
		H.push("</div>");
		return H.join("");
	}
	getTitleBoutonGraphe() {
		return GTraductions.getValeur("competences.titreGraphePositionnement");
	}
	getListeTypesAppreciations() {}
	_evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case EGenreEvenementListe.SelectionClick:
				if (
					aParametres.idColonne ===
						DonneesListe_BulletinCompetences.colonnes.jauge &&
					this.estJaugeCliquable()
				) {
					surClicJaugeEvaluations.call(this, aParametres.article);
				}
				break;
			case EGenreEvenementListe.Edition:
				this.surEditionListe(aParametres);
				break;
			case EGenreEvenementListe.ApresEdition:
				this.surApresEditionListe(aParametres);
				break;
		}
	}
	initFenetreDetailEvaluations(aInstance) {
		aInstance.setOptionsFenetre({
			titre: "",
			largeur: 700,
			hauteur: 500,
			listeBoutons: [GTraductions.getValeur("Fermer")],
		});
	}
	evenementAfficherMessage(aGenreMessage) {
		GHtml.setDisplay(this.getInstance(this.identPiedPage).getNom(), false);
		super.evenementAfficherMessage(aGenreMessage);
	}
	_evenementDernierMenuDeroulant() {
		this.afficherBandeau(true);
		this.setEtatSaisie(false);
		Invocateur.evenement(
			ObjetInvocateur.events.activationImpression,
			EGenreImpression.Aucune,
		);
		const lInstance = this.getInstance(this.identPiedPage);
		this.moteurPdB.initPiedPage(
			lInstance,
			this.estPourClasse()
				? this.getParametresPiedPageClasse()
				: this.getParametresPiedPageEleve(),
		);
		lInstance.initialiser(true);
		_recupererDonnees.call(this);
	}
	_reponseRequeteBulletinCompetences(aParams) {
		this.donnees.maquetteBulletin = aParams.maquette;
		if (!this.donnees.maquetteBulletin) {
			this.evenementAfficherMessage(aParams.Message);
			GHtml.setDisplay(this.getInstance(this.identOnglets).getNom(), false);
			GHtml.setDisplay(this.idLegende, false);
			this.getInstance(this.identFicheGraphe).fermer();
		} else {
			let lOngletSelectionne = null;
			if (this.onglet && this.donnees.maquetteBulletin.listeBulletins) {
				lOngletSelectionne =
					this.donnees.maquetteBulletin.listeBulletins.getElementParElement(
						this.onglet,
					);
			}
			this.onglet = lOngletSelectionne;
			const lIndiceOngletASelectionner = this.onglet
				? this.onglet.getGenre()
				: 0;
			this.getInstance(this.identOnglets).setDonnees(
				this.donnees.maquetteBulletin.listeBulletins,
				lIndiceOngletASelectionner,
			);
			GHtml.setDisplay(
				this.getInstance(this.identOnglets).getNom(),
				this.donnees.maquetteBulletin.listeBulletins.count() > 1,
			);
			if (
				this.avecLegendeBulletin() &&
				(this.donnees.maquetteBulletin.avecNiveauxMaitrises === true ||
					this.donnees.maquetteBulletin.avecNiveauxPositionnements === true)
			) {
				GHtml.setHtml(
					this.idLegende,
					TUtilitaireCompetences.composeLegende({
						avecListeCompetences:
							this.donnees.maquetteBulletin.avecNiveauxMaitrises,
						avecListePositionnements:
							this.donnees.maquetteBulletin.avecNiveauxPositionnements,
						genrePositionnement:
							TypePositionnementUtil.getGenrePositionnementParDefaut(
								aParams.positionnementClasse,
							),
						affichageLigneSimple: true,
					}),
				);
				GHtml.setDisplay(this.idLegende, true);
			} else {
				GHtml.setDisplay(this.idLegende, false);
			}
			this.donnees.listeAccusesReception = aParams.listeAccusesReception;
			const lAvecLigneTotal = !!this.donnees.maquetteBulletin.avecLigneTotal;
			this.getInstance(this.identListe).setOptionsListe({
				colonnes: getListeInfoColonnes(aParams.listeColonnes),
				hauteurAdapteContenu: true,
				avecLigneTotal: lAvecLigneTotal,
				nonEditableSurModeExclusif: true,
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
			};
			if (lAvecLigneTotal) {
				lParamsDonneesListe.donneesLigneTotal = {
					moyEleve: aParams.moyenneGeneraleEleve,
					moyClasse: aParams.moyenneGeneraleClasse,
				};
			}
			this.getInstance(this.identListe).setDonnees(
				new DonneesListe_BulletinCompetences(
					aParams.listeLignes,
					lParamsDonneesListe,
				),
			);
			GHtml.setDisplay(this.getInstance(this.identPiedPage).getNom(), true);
			const lXmlDonneesPiedDePage =
				new UtilitaireDeserialiserPiedBulletin().creerPiedDePage(aParams);
			this.getInstance(this.identPiedPage).setDonnees({
				absences: new UtilitaireDeserialiserPiedBulletin().creerAbsences(
					aParams,
				),
				donnees: lXmlDonneesPiedDePage,
			});
			this.donnees.listeMentions = aParams.listeMentions;
			const lAvecGraphe = !!aParams.grapheCalculAuto || !!aParams.grapheSaisie;
			this.setGraphe(null);
			if (lAvecGraphe) {
				const lListeImages = [];
				if (!!aParams.grapheCalculAuto) {
					lListeImages.push(aParams.grapheCalculAuto);
				}
				if (aParams.grapheSaisie) {
					lListeImages.push(aParams.grapheSaisie);
				}
				const lParamsGraphe = {
					image: lListeImages,
					titre: GTraductions.getValeur(
						"competences.titreGraphePositionnement",
					),
					message: GTraductions.getValeur("competences.pasDAffichageGraphe"),
				};
				if (!!aParams.grapheCalculAuto && !!aParams.grapheSaisie) {
					lParamsGraphe.titreChoixGraphe = GTraductions.getValeur(
						"competences.titreChoixGraphePositionnement",
					);
					lParamsGraphe.libelleChoixGraphe = [
						GTraductions.getValeur("competences.graphe.CalculeAutomatiquement"),
						GTraductions.getValeur("competences.graphe.SaisieParEnseignant"),
					];
				}
				this.setGraphe(lParamsGraphe);
				this.actualiserFicheGraphe();
			} else {
				this.getInstance(this.identFicheGraphe).fermer();
			}
			if (
				GApplication.droits.get(
					TypeDroits.autoriserImpressionBulletinReleveBrevet,
				)
			) {
				Invocateur.evenement(
					ObjetInvocateur.events.activationImpression,
					EGenreImpression.GenerationPDF,
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
}
function _initialiserOnglets(aInstance) {
	aInstance.setOptions({ largeurOnglets: 180 });
}
function _evenementSurOnglets(aOnglet) {
	this.onglet = aOnglet;
	if (this.getEtatSaisie()) {
		this.validerSaisieBulletin(_recupererDonnees);
	} else {
		_recupererDonnees.call(this);
	}
}
function _recupererDonnees() {
	new ObjetRequeteBulletinCompetences(
		this,
		this._reponseRequeteBulletinCompetences,
	).lancerRequete({
		classe: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe),
		periode: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Periode),
		eleve: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
		bulletin: this.onglet,
	});
	this.getListeTypesAppreciations();
}
function getListeInfoColonnes(aJSONColonnes) {
	const result = [];
	if (aJSONColonnes) {
		result.push({
			id: DonneesListe_BulletinCompetences.colonnes.regroupement,
			taille: 4,
			titre: aJSONColonnes.getLibelle(0),
		});
		let lIndexColonneTransversale = 0;
		let lInfoColonne;
		for (let i = 0; i < aJSONColonnes.count(); i++) {
			lInfoColonne = _getInfoColonne(aJSONColonnes.get(i));
			if (lInfoColonne) {
				const lColonne = {
					id: lInfoColonne.id,
					taille: lInfoColonne.taille,
					titre: lInfoColonne.titre,
					hint: lInfoColonne.hint,
				};
				if (
					DonneesListe_BulletinCompetences.estUneColonneTransversale(
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
function _getInfoColonne(aColonne) {
	switch (aColonne.getGenre()) {
		case TypeGenreColonneBulletinCompetence.tCBdC_Services:
			return {
				titre: TypeFusionTitreListe.FusionGauche,
				id: DonneesListe_BulletinCompetences.colonnes.service,
				taille: 180,
			};
		case TypeGenreColonneBulletinCompetence.tCBdC_EltPilier:
			return {
				titre: aColonne.getLibelle(),
				hint: aColonne.hint,
				id: DonneesListe_BulletinCompetences.colonnes.competence,
				taille: ObjetListe.initColonne(100, 100, 300),
			};
		case TypeGenreColonneBulletinCompetence.tCBdC_EltProg:
			return {
				titre: aColonne.getLibelle(),
				hint: aColonne.hint,
				id: DonneesListe_BulletinCompetences.colonnes.elementsProgramme,
				taille: ObjetListe.initColonne(100, 100, 300),
			};
		case TypeGenreColonneBulletinCompetence.tCBdC_Jauge:
			return {
				titre: aColonne.getLibelle(),
				hint: aColonne.hint,
				id: DonneesListe_BulletinCompetences.colonnes.jauge,
				taille: 400,
			};
		case TypeGenreColonneBulletinCompetence.tCBdC_NivAcqComp:
			return {
				titre: aColonne.getLibelle(),
				hint: aColonne.hint,
				id: DonneesListe_BulletinCompetences.colonnes.niveauAcqComp,
				taille: 50,
			};
		case TypeGenreColonneBulletinCompetence.tCBdC_Pourcentage:
			return {
				titre: aColonne.getLibelle(),
				hint: aColonne.hint,
				id: DonneesListe_BulletinCompetences.colonnes.pourcentage,
				taille: 60,
			};
		case TypeGenreColonneBulletinCompetence.tCBdC_PosLSUP1:
			return {
				titre: aColonne.getLibelle(),
				hint: aColonne.hint,
				id: DonneesListe_BulletinCompetences.colonnes.posLSUP1,
				taille: 50,
			};
		case TypeGenreColonneBulletinCompetence.tCBdC_PosLSUP2:
			return {
				titre: aColonne.getLibelle(),
				hint: aColonne.hint,
				id: DonneesListe_BulletinCompetences.colonnes.posLSUP2,
				taille: 50,
			};
		case TypeGenreColonneBulletinCompetence.tCBdC_PosLSU:
			return {
				titre: aColonne.getLibelle(),
				hint: aColonne.hint,
				id: DonneesListe_BulletinCompetences.colonnes.posLSU,
				taille: 50,
			};
		case TypeGenreColonneBulletinCompetence.tCBdC_Note:
			return {
				titre: aColonne.getLibelle(),
				hint: aColonne.hint,
				id: DonneesListe_BulletinCompetences.colonnes.note,
				taille: 50,
			};
		case TypeGenreColonneBulletinCompetence.tCBdC_MoyenneClasse:
			return {
				titre: aColonne.getLibelle(),
				hint: aColonne.hint,
				id: DonneesListe_BulletinCompetences.colonnes.moyenneClasse,
				taille: 50,
			};
		case TypeGenreColonneBulletinCompetence.tCBdC_MoyenneInf:
			return {
				titre: aColonne.getLibelle(),
				hint: aColonne.hint,
				id: DonneesListe_BulletinCompetences.colonnes.moyenneInf,
				taille: 50,
			};
		case TypeGenreColonneBulletinCompetence.tCBdC_MoyenneSup:
			return {
				titre: aColonne.getLibelle(),
				hint: aColonne.hint,
				id: DonneesListe_BulletinCompetences.colonnes.moyenneSup,
				taille: 50,
			};
		case TypeGenreColonneBulletinCompetence.tCBdC_AppreciationA:
			return {
				titre: aColonne.getLibelle(),
				hint: aColonne.hint,
				id: DonneesListe_BulletinCompetences.colonnes.appreciationA,
				taille: ObjetListe.initColonne(100, 100, 300),
			};
		case TypeGenreColonneBulletinCompetence.tCBdC_AppreciationB:
			return {
				titre: aColonne.getLibelle(),
				hint: aColonne.hint,
				id: DonneesListe_BulletinCompetences.colonnes.appreciationB,
				taille: ObjetListe.initColonne(100, 100, 300),
			};
		case TypeGenreColonneBulletinCompetence.tCBdC_AppreciationC:
			return {
				titre: aColonne.getLibelle(),
				hint: aColonne.hint,
				id: DonneesListe_BulletinCompetences.colonnes.appreciationC,
				taille: ObjetListe.initColonne(100, 100, 300),
			};
		default:
			return {
				titre: aColonne.getLibelle(),
				hint: aColonne.hint,
				id: DonneesListe_BulletinCompetences.colonnes.prefixe_col_transv,
				taille: 50,
			};
	}
}
function surClicJaugeEvaluations(aLigne) {
	if (aLigne.relationsESI && aLigne.relationsESI.length) {
		new ObjetRequeteDetailEvaluationsCompetences(
			this,
			_reponseRequeteDetailEvaluations.bind(this, aLigne),
		).lancerRequete({
			eleve: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
			pilier: null,
			periode: GEtatUtilisateur.Navigation.getRessource(
				EGenreRessource.Periode,
			),
			numRelESI: aLigne.relationsESI,
		});
	}
}
function _reponseRequeteDetailEvaluations(aLigne, aJSON) {
	const lFenetre = this.getInstance(this.identFenetreDetailEvaluations);
	const lTitreParDefaut = lFenetre.getTitreFenetreParDefaut(
		GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
		aLigne,
	);
	lFenetre.setDonnees(aLigne, aJSON, { titreFenetre: lTitreParDefaut });
}
module.exports = { _InterfaceBulletinCompetences };
