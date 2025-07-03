exports.InterfaceCompetencesParEvaluation =
	exports.EGenreEvenementCompetencesParEvaluation = void 0;
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_SaisieMessage_1 = require("ObjetFenetre_SaisieMessage");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_Competences_ElevesEvaluation_1 = require("DonneesListe_Competences_ElevesEvaluation");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const ObjetRequetePageCompetencesParEvaluation_1 = require("ObjetRequetePageCompetencesParEvaluation");
const ObjetUtilitaireEvaluation_1 = require("ObjetUtilitaireEvaluation");
const TypeGenreValidationCompetence_1 = require("TypeGenreValidationCompetence");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const TypeModeAssociationDevoirEvaluation_1 = require("TypeModeAssociationDevoirEvaluation");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetFenetre_ParamListeEvaluations_1 = require("ObjetFenetre_ParamListeEvaluations");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const MethodesObjet_1 = require("MethodesObjet");
const AccessApp_1 = require("AccessApp");
var EGenreEvenementCompetencesParEvaluation;
(function (EGenreEvenementCompetencesParEvaluation) {
	EGenreEvenementCompetencesParEvaluation[
		(EGenreEvenementCompetencesParEvaluation["recupererDonnees"] = 0)
	] = "recupererDonnees";
	EGenreEvenementCompetencesParEvaluation[
		(EGenreEvenementCompetencesParEvaluation["editerCompetence"] = 1)
	] = "editerCompetence";
	EGenreEvenementCompetencesParEvaluation[
		(EGenreEvenementCompetencesParEvaluation["selectionEleve"] = 2)
	] = "selectionEleve";
	EGenreEvenementCompetencesParEvaluation[
		(EGenreEvenementCompetencesParEvaluation["editionNote"] = 3)
	] = "editionNote";
	EGenreEvenementCompetencesParEvaluation[
		(EGenreEvenementCompetencesParEvaluation["editionCommentaireSurNote"] = 4)
	] = "editionCommentaireSurNote";
})(
	EGenreEvenementCompetencesParEvaluation ||
		(exports.EGenreEvenementCompetencesParEvaluation =
			EGenreEvenementCompetencesParEvaluation =
				{}),
);
class InterfaceCompetencesParEvaluation extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.appSco = (0, AccessApp_1.getApp)();
		this.etatUtilSco = this.appSco.getEtatUtilisateur();
		this.droitSaisieNotes = false;
		this.afficherCommentaireSurNote = false;
		this.parametres = {};
		if (
			InterfaceCompetencesParEvaluation.optionsAffCompetenceParEval ===
			undefined
		) {
			InterfaceCompetencesParEvaluation.optionsAffCompetenceParEval = {
				avecOptionAfficherProjetsAcc: true,
				afficherProjetsAccompagnement: false,
				afficherPourcentageReussite: false,
				typeAffichageTitreColonneCompetence:
					ObjetFenetre_ParamListeEvaluations_1
						.TypeAffichageTitreColonneCompetence.AffichageLibelle,
			};
		}
	}
	construireInstances() {
		this.identListeElevesEvaluation = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListeElevesEvaluation,
		);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListeElevesEvaluation;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	setAfficherCommentaireSurNote(aValeur) {
		this.afficherCommentaireSurNote = aValeur;
	}
	avecAffichageCommentaireSurNote() {
		return this.afficherCommentaireSurNote;
	}
	setOptionsAffichageListe(aOptionsAffichage) {
		Object.assign(
			InterfaceCompetencesParEvaluation.optionsAffCompetenceParEval,
			aOptionsAffichage,
		);
	}
	getOptionsAffichageListe() {
		return InterfaceCompetencesParEvaluation.optionsAffCompetenceParEval;
	}
	_initListeElevesEvaluation(aEvaluation, aListeCompetences) {
		const lThis = this;
		const lListe = this.getInstance(this.identListeElevesEvaluation);
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_Competences_ElevesEvaluation_1
				.DonneesListe_Competences_ElevesEvaluation.colonnes.eleve,
			taille: 150,
			titre:
				aEvaluation.listeEleves.count() +
				" " +
				ObjetTraduction_1.GTraductions.getValeur("competences.eleve")[
					aEvaluation.listeEleves.count() ? 1 : 0
				],
		});
		if (this.estPourGroupe) {
			lColonnes.push({
				id: DonneesListe_Competences_ElevesEvaluation_1
					.DonneesListe_Competences_ElevesEvaluation.colonnes.classe,
				taille: 65,
				titre: ObjetTraduction_1.GTraductions.getValeur("Classe"),
			});
		}
		if (
			!!aEvaluation.devoir &&
			(!!aEvaluation.executionQCM ||
				[
					TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE
						.tMIADE_Creation,
					TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE
						.tMIADE_Modification,
				].includes(aEvaluation.devoir.modeAssociation))
		) {
			const lgetDisabled = () => {
				return (
					!this.droitSaisieNotes ||
					!aEvaluation.avecSaisie ||
					(!!aEvaluation.devoir && aEvaluation.devoir.estVerrouille)
				);
			};
			const lbtnCalculNoteAuto = () => {
				return {
					event: () => {
						UtilitaireCompetences_1.TUtilitaireCompetences.surBoutonCalculNotesDevoir(
							{
								instance: this,
								evaluation: aEvaluation,
								callback: () => {
									aEvaluation.enCache = false;
									this.setDonnees({
										evaluation: aEvaluation,
										droitSaisieNotes: lThis.droitSaisieNotes,
										classe: this.etatUtilSco.Navigation.getRessource(
											Enumere_Ressource_1.EGenreRessource.Classe,
										),
									});
								},
							},
						);
					},
					getTitle() {
						return ObjetTraduction_1.GTraductions.getValeur(
							"evaluations.calculAutoNotes",
						);
					},
					getDisabled: lgetDisabled,
				};
			};
			const lgetClasseBouton = () => {
				return lgetDisabled()
					? ""
					: ObjetListe_1.ObjetListe.StyleElementInteractifTitreSansTri;
			};
			lColonnes.push({
				id: DonneesListe_Competences_ElevesEvaluation_1
					.DonneesListe_Competences_ElevesEvaluation.colonnes.notes,
				taille: 70,
				titre: {
					getLibelleHtml: () => {
						return IE.jsx.str(
							"div",
							{ class: "flex-contain flex-center justify-center" },
							IE.jsx.str("ie-btnicon", {
								"ie-display": () => !aEvaluation.executionQCM,
								"ie-model": lbtnCalculNoteAuto,
								"ie-class": lgetClasseBouton,
								class: "icon_sigma color-neutre m-right",
							}),
							IE.jsx.str(
								"span",
								{ "ie-hint": () => aEvaluation.devoir.hintDevoir || "" },
								ObjetTraduction_1.GTraductions.getValeur("evaluations.notes"),
							),
						);
					},
				},
			});
			if (this.afficherCommentaireSurNote) {
				lColonnes.push(
					this.getColonne(
						DonneesListe_Competences_ElevesEvaluation_1
							.DonneesListe_Competences_ElevesEvaluation.colonnes
							.commentaireSurNote,
					).colonne,
				);
			}
		}
		const lTypeAffichageColonneCompetence =
			InterfaceCompetencesParEvaluation.optionsAffCompetenceParEval
				.typeAffichageTitreColonneCompetence;
		const lAvecPourcentageReussite =
			InterfaceCompetencesParEvaluation.optionsAffCompetenceParEval
				.afficherPourcentageReussite;
		let lIdPremiereColonne = null;
		aListeCompetences.parcourir((aCompetence, aIndex) => {
			let lLibelleCompetence;
			if (
				lTypeAffichageColonneCompetence ===
				ObjetFenetre_ParamListeEvaluations_1.TypeAffichageTitreColonneCompetence
					.AffichageLibelle
			) {
				lLibelleCompetence = aCompetence.getLibelle();
			} else {
				lLibelleCompetence =
					(aCompetence.pilier && aCompetence.pilier.code
						? aCompetence.pilier.code + " - "
						: "") + (aCompetence.code || "");
			}
			const lgetHintColonneCompetence = () => {
				const lCompetence = aListeCompetences.get(aIndex);
				const lPourcentageReussite = lListe
					.getDonneesListe()
					.getPourcentageReussite(aIndex);
				const lHint = [];
				lHint.push(
					UtilitaireCompetences_1.TUtilitaireCompetences.composeTitleEvaluation(
						lCompetence,
					),
				);
				if (
					lPourcentageReussite !== null &&
					lPourcentageReussite !== undefined
				) {
					lHint.push("<br/><br/>");
					lHint.push(
						"<b>",
						ObjetTraduction_1.GTraductions.getValeur(
							"competences.PourcentageDeReussite",
						),
						"</b> ",
						lPourcentageReussite,
						" %",
					);
				}
				if (
					!!lCompetence.informationQCM &&
					!!lCompetence.informationQCM.listeQuestions &&
					lCompetence.informationQCM.listeQuestions.count() > 0
				) {
					const lTypeNumerotationQCM =
						lCompetence.informationQCM.typeNumerotation;
					lHint.push("<br/><br/>");
					lCompetence.informationQCM.listeQuestions.parcourir(
						(aQuestionQCM) => {
							const lHtmlQuestion =
								UtilitaireQCM_1.UtilitaireQCM.composeHintDeQuestionQCM(
									lThis,
									aQuestionQCM.getPosition(),
									aQuestionQCM,
									{
										avecAffichageInfosCompetences: false,
										avecAffichageBareme: !this.etatUtilSco.pourPrimaire(),
										typeNumerotationQCM: lTypeNumerotationQCM,
									},
								);
							lHint.push(lHtmlQuestion);
						},
					);
				}
				return lHint.join("");
			};
			const lIdColonne =
				DonneesListe_Competences_ElevesEvaluation_1
					.DonneesListe_Competences_ElevesEvaluation.colonnes
					.prefixe_competence + aIndex;
			lColonnes.push({
				id: lIdColonne,
				taille: 70,
				titre: {
					getLibelleHtml: () => {
						return IE.jsx.str(
							"div",
							{ class: "ie-ellipsis", "ie-hint": lgetHintColonneCompetence },
							lLibelleCompetence,
							() => {
								if (lAvecPourcentageReussite) {
									const lgetPourcentageReussiteCompetence = () => {
										const lValeurPourcentage = lListe
											.getDonneesListe()
											.getPourcentageReussite(aIndex);
										if (
											lValeurPourcentage === null ||
											lValeurPourcentage === undefined
										) {
											return "-";
										}
										return lValeurPourcentage + " %";
									};
									return IE.jsx.str(
										IE.jsx.fragment,
										null,
										IE.jsx.str("br", null),
										IE.jsx.str("span", {
											"ie-html": lgetPourcentageReussiteCompetence,
										}),
									);
								}
								return "";
							},
						);
					},
				},
			});
			if (!lIdPremiereColonne) {
				lIdPremiereColonne = lIdColonne;
			}
		});
		let lHauteurTitre = 30;
		if (lAvecPourcentageReussite) {
			lHauteurTitre += 10;
		}
		lListe.setOptionsListe({
			colonnes: lColonnes,
			scrollHorizontal: lIdPremiereColonne || false,
			alternanceCouleurLigneContenu: true,
			hauteurCelluleTitreStandard: lHauteurTitre,
			avecLigneTotal: !!aEvaluation.devoir,
			hauteurAdapteContenu: this.parametres.hauteurAdapteContenu,
			hauteurMaxAdapteContenu: this.parametres.hauteurAdapteContenu
				? GNavigateur.ecranH - 300
				: null,
		});
		this.etatUtilSco.setTriListe({
			liste: lListe,
			tri: DonneesListe_Competences_ElevesEvaluation_1
				.DonneesListe_Competences_ElevesEvaluation.colonnes.eleve,
			identifiant: "elevesEvaluation",
		});
		const lParamsDonneesListe = {
			eleves: aEvaluation.listeEleves,
			competences: aListeCompetences,
			initMenuContextuel: this._initMenuContextuelListe.bind(this),
			avecSaisie: aEvaluation.avecSaisie,
			dateEvaluation: aEvaluation.dateValidation,
			genreEvaluation: aEvaluation.getGenre(),
			evaluation: aEvaluation,
		};
		if (!!aEvaluation.devoir) {
			lParamsDonneesListe.droitSaisieNotes = this.droitSaisieNotes;
			lParamsDonneesListe.baremeDevoirParDefaut =
				aEvaluation.baremeDevoirParDefaut;
			lParamsDonneesListe.devoir = {
				bareme: aEvaluation.devoir.bareme,
				estUnBonus: aEvaluation.devoir.commeUnBonus,
				ramenerSur20: aEvaluation.devoir.ramenerSur20,
				estVerrouille:
					aEvaluation.devoir.estVerrouille || aEvaluation.devoir.verrouille,
				estCloture: aEvaluation.devoir.estCloture,
				hintDevoir: aEvaluation.devoir.hintDevoir || "",
				avecCommentaireSurNoteEleve:
					aEvaluation.devoir.avecCommentaireSurNoteEleve,
			};
			if (this.afficherCommentaireSurNote && !!aEvaluation.devoir.listeEleves) {
				lParamsDonneesListe.eleves.parcourir((aEleve) => {
					const lEleve = aEvaluation.devoir.listeEleves.getElementParNumero(
						aEleve.getNumero(),
					);
					if (lEleve && lEleve.commentaire) {
						aEleve.commentaire = lEleve.commentaire;
					}
				});
			}
		}
		const lOptionsAffichage = Object.assign(
			MethodesObjet_1.MethodesObjet.dupliquer(
				InterfaceCompetencesParEvaluation.optionsAffCompetenceParEval,
			),
			{ afficherCommentaireSurNote: this.afficherCommentaireSurNote },
		);
		lListe.setDonnees(
			new DonneesListe_Competences_ElevesEvaluation_1.DonneesListe_Competences_ElevesEvaluation(
				lParamsDonneesListe,
				lOptionsAffichage,
			),
		);
	}
	construireStructureAffichageAutre() {
		const lHTML = [];
		lHTML.push(
			'<div id="',
			this.getInstance(this.identListeElevesEvaluation).getNom(),
			'" style="height: 100%" class="AlignementHaut SansSelectionTexte"></div>',
		);
		return lHTML.join("");
	}
	setParametres(aParametres) {
		this.parametres = aParametres;
	}
	setDonnees(aParams) {
		this.droitSaisieNotes = aParams.droitSaisieNotes;
		this.estPourGroupe =
			aParams && aParams.classe
				? aParams.classe.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.Groupe
				: false;
		const lEvaluation = !!aParams.devoir
			? aParams.devoir.evaluation
			: aParams.evaluation;
		if (!!lEvaluation) {
			if (!lEvaluation.enCache) {
				new ObjetRequetePageCompetencesParEvaluation_1.ObjetRequetePageCompetencesParEvaluation(
					this,
					this.actualisationListeElevesCompetences,
				).lancerRequete(aParams);
			} else {
				this.actualisationListeElevesCompetences(lEvaluation);
			}
		} else {
			this.devoir = aParams.devoir;
			this.afficherListeElevesSansCompetences(aParams);
		}
	}
	_evenementSurListeElevesEvaluation(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
				let lNouvelleRessource = null;
				const lListeCellulesSelectionnees =
					aParametres.instance.getTableauCellulesSelection();
				if (
					!!lListeCellulesSelectionnees &&
					lListeCellulesSelectionnees.length > 0
				) {
					if (
						lListeCellulesSelectionnees.length === 1 &&
						!!lListeCellulesSelectionnees[0]
					) {
						lNouvelleRessource = lListeCellulesSelectionnees[0].article;
					} else {
						for (let i = 0; i < lListeCellulesSelectionnees.length; i++) {
							if (!!lListeCellulesSelectionnees[i]) {
								const lCellule = lListeCellulesSelectionnees[i];
								if (!lNouvelleRessource) {
									lNouvelleRessource = lCellule.article;
								} else if (
									!!lCellule.article &&
									lCellule.article.getNumero() !==
										lNouvelleRessource.getNumero()
								) {
									lNouvelleRessource = null;
									break;
								}
							}
						}
					}
				}
				const lRessourceActuelle = this.etatUtilSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Eleve,
				);
				if (!!lRessourceActuelle || !!lNouvelleRessource) {
					if (
						(!lRessourceActuelle && !!lNouvelleRessource) ||
						(!!lRessourceActuelle && !lNouvelleRessource) ||
						lRessourceActuelle.getNumero() !== lNouvelleRessource.getNumero()
					) {
						this.etatUtilSco.Navigation.setRessource(
							Enumere_Ressource_1.EGenreRessource.Eleve,
							lNouvelleRessource,
						);
						this.callback.appel(
							EGenreEvenementCompetencesParEvaluation.selectionEleve,
						);
					}
				}
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				aParametres.ouvrirMenuContextuel();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition: {
				const lParams = {
					devoir: this.devoir,
					eleve: aParametres.article.eleve,
					note:
						aParametres.article.eleve.note || aParametres.article.eleve.Note,
				};
				switch (aParametres.idColonne) {
					case DonneesListe_Competences_ElevesEvaluation_1
						.DonneesListe_Competences_ElevesEvaluation.colonnes
						.commentaireSurNote:
						this.callback.appel(
							EGenreEvenementCompetencesParEvaluation.editionCommentaireSurNote,
							lParams,
						);
						break;
					case DonneesListe_Competences_ElevesEvaluation_1
						.DonneesListe_Competences_ElevesEvaluation.colonnes.notes:
						this.callback.appel(
							EGenreEvenementCompetencesParEvaluation.editionNote,
							lParams,
						);
						break;
				}
				this._selectionnerCelluleSuivante(
					this.getInstance(this.identListeElevesEvaluation),
					true,
				);
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.KeyPressListe:
				return this._surKeyUpListe(aParametres.event);
		}
	}
	afficherListeElevesSansCompetences(aParams) {
		const lDevoir = aParams.devoir;
		const lListe = this.getInstance(this.identListeElevesEvaluation);
		const lColonnes = [];
		const lParams = { devoir: lDevoir };
		const lColonneEleve = this.getColonne(
			DonneesListe_Competences_ElevesEvaluation_1
				.DonneesListe_Competences_ElevesEvaluation.colonnes.eleve,
			lParams,
		);
		lColonnes.push(lColonneEleve.colonne);
		if (this.estPourGroupe) {
			const lColonneClasse = this.getColonne(
				DonneesListe_Competences_ElevesEvaluation_1
					.DonneesListe_Competences_ElevesEvaluation.colonnes.classe,
				lParams,
			);
			lColonnes.push(lColonneClasse.colonne);
		}
		if (lDevoir) {
			const lColonneNotes = this.getColonne(
				DonneesListe_Competences_ElevesEvaluation_1
					.DonneesListe_Competences_ElevesEvaluation.colonnes.notes,
				lParams,
			);
			lColonnes.push(lColonneNotes.colonne);
		}
		if (this.afficherCommentaireSurNote) {
			const lColonneCommentaire = this.getColonne(
				DonneesListe_Competences_ElevesEvaluation_1
					.DonneesListe_Competences_ElevesEvaluation.colonnes
					.commentaireSurNote,
				lParams,
			);
			lColonnes.push(lColonneCommentaire.colonne);
		}
		lListe.setOptionsListe({
			colonnes: lColonnes,
			alternanceCouleurLigneContenu: true,
			hauteurCelluleTitreStandard: 30,
			avecLigneTotal: !!lDevoir,
			hauteurAdapteContenu: this.parametres.hauteurAdapteContenu,
			hauteurMaxAdapteContenu: this.parametres.hauteurAdapteContenu
				? GNavigateur.ecranH - 300
				: null,
		});
		this.etatUtilSco.setTriListe({
			liste: lListe,
			tri: DonneesListe_Competences_ElevesEvaluation_1
				.DonneesListe_Competences_ElevesEvaluation.colonnes.eleve,
			identifiant: "elevesEvaluation",
		});
		const lParamsDonneesListe = {
			eleves: lDevoir.listeEleves,
			competences: new ObjetListeElements_1.ObjetListeElements(),
			initMenuContextuel: () => {},
		};
		lParamsDonneesListe.droitSaisieNotes = this.droitSaisieNotes;
		lParamsDonneesListe.avecSaisie = this.droitSaisieNotes;
		lParamsDonneesListe.baremeDevoirParDefaut = aParams.baremeParDefaut;
		lParamsDonneesListe.devoir = {
			bareme: lDevoir.bareme,
			estUnBonus: lDevoir.commeUnBonus,
			ramenerSur20: lDevoir.ramenerSur20,
			estVerrouille: lDevoir.estVerrouille || lDevoir.verrouille,
			estCloture: lDevoir.estCloture,
			hintDevoir: lDevoir.hintDevoir || "",
			avecCommentaireSurNoteEleve: lDevoir.avecCommentaireSurNoteEleve,
		};
		if (this.afficherCommentaireSurNote && !!lDevoir.listeEleves) {
			lParamsDonneesListe.afficherCommentaireSurNote = true;
			lParamsDonneesListe.eleves.parcourir((aEleve) => {
				const lEleve = lDevoir.listeEleves.getElementParNumero(
					aEleve.getNumero(),
				);
				if (lEleve && lEleve.commentaire) {
					aEleve.commentaire = lEleve.commentaire;
				}
			});
		}
		lListe.setDonnees(
			new DonneesListe_Competences_ElevesEvaluation_1.DonneesListe_Competences_ElevesEvaluation(
				lParamsDonneesListe,
			),
		);
		this.callback.appel(
			EGenreEvenementCompetencesParEvaluation.recupererDonnees,
		);
	}
	actualisationListeElevesCompetences(aEvaluation) {
		if (!aEvaluation) {
			return;
		}
		ObjetUtilitaireEvaluation_1.ObjetUtilitaireEvaluation.calculerAvecEvaluation(
			aEvaluation,
		);
		const lListeCompetences = new ObjetListeElements_1.ObjetListeElements();
		for (let i = 0; i < aEvaluation.listeCompetences.count(); i++) {
			if (aEvaluation.listeCompetences.get(i).existe()) {
				lListeCompetences.addElement(aEvaluation.listeCompetences.get(i));
			}
		}
		this._initListeElevesEvaluation(aEvaluation, lListeCompetences);
		this.callback.appel(
			EGenreEvenementCompetencesParEvaluation.recupererDonnees,
		);
	}
	afficherMessageSelectionnerEvaluation() {
		if (this.getInstance(this.identListeElevesEvaluation)) {
			this.getInstance(this.identListeElevesEvaluation).effacer(
				'<div class="Gras AlignementMilieu GrandEspaceHaut">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"competences.SelectionnezEvaluation",
					) +
					"</div>",
			);
		}
	}
	getColonne(aId, aParams = {}) {
		const lResult = { colonne: null };
		switch (aId) {
			case DonneesListe_Competences_ElevesEvaluation_1
				.DonneesListe_Competences_ElevesEvaluation.colonnes.eleve: {
				let lTitre = "";
				if (aParams.evaluation) {
					lTitre =
						aParams.evaluation.listeEleves.count() +
						" " +
						ObjetTraduction_1.GTraductions.getValeur("competences.eleve")[
							aParams.evaluation.listeEleves.count() ? 1 : 0
						];
				} else if (aParams.devoir) {
					lTitre =
						aParams.devoir.listeEleves &&
						aParams.devoir.listeEleves.count() +
							" " +
							ObjetTraduction_1.GTraductions.getValeur("competences.eleve")[
								aParams.devoir.listeEleves.count() ? 1 : 0
							];
				}
				lResult.colonne = { id: aId, taille: 150, titre: lTitre };
				break;
			}
			case DonneesListe_Competences_ElevesEvaluation_1
				.DonneesListe_Competences_ElevesEvaluation.colonnes.classe:
				lResult.colonne = {
					id: aId,
					taille: 65,
					titre: ObjetTraduction_1.GTraductions.getValeur("Classe"),
				};
				break;
			case DonneesListe_Competences_ElevesEvaluation_1
				.DonneesListe_Competences_ElevesEvaluation.colonnes.notes: {
				const lGetHtml = () => {
					const lhintColonneNote = () => {
						return (
							(aParams.evaluation
								? aParams.evaluation.devoir.hintDevoir
								: aParams.devoir.hintDevoir) || ""
						);
					};
					if (aParams.evaluation) {
						const lgetDisabled = () => {
							if (aParams.evaluation) {
								return (
									!this.droitSaisieNotes ||
									!aParams.evaluation.avecSaisie ||
									(!!aParams.evaluation.devoir &&
										aParams.evaluation.devoir.estVerrouille)
								);
							}
							if (aParams.devoir) {
								return !this.droitSaisieNotes || aParams.devoir.estVerrouille;
							}
							return true;
						};
						const lbtnCalculNoteAuto = () => {
							return {
								event: () => {
									UtilitaireCompetences_1.TUtilitaireCompetences.surBoutonCalculNotesDevoir(
										{
											instance: this,
											evaluation: aParams.evaluation,
											callback: () => {
												aParams.evaluation.enCache = false;
												this.setDonnees({
													evaluation: aParams.evaluation,
													droitSaisieNotes: this.droitSaisieNotes,
													classe: this.etatUtilSco.Navigation.getRessource(
														Enumere_Ressource_1.EGenreRessource.Classe,
													),
												});
											},
										},
									);
								},
								getTitle() {
									return ObjetTraduction_1.GTraductions.getValeur(
										"evaluations.calculAutoNotes",
									);
								},
								getDisabled: lgetDisabled,
							};
						};
						const lgetDisplayBouton = () => {
							return !aParams.evaluation.executionQCM;
						};
						const getClasseBouton = () => {
							return lgetDisabled()
								? ""
								: ObjetListe_1.ObjetListe.StyleElementInteractifTitreSansTri;
						};
						return IE.jsx.str(
							"div",
							{ class: "flex-contain flex-center justify-center" },
							IE.jsx.str("ie-btnicon", {
								"ie-display": lgetDisplayBouton,
								"ie-model": lbtnCalculNoteAuto,
								"ie-class": getClasseBouton,
								class: "icon_sigma color-neutre m-right",
							}),
							IE.jsx.str(
								"span",
								{ "ie-hint": lhintColonneNote },
								ObjetTraduction_1.GTraductions.getValeur("evaluations.notes"),
							),
						);
					} else if (aParams.devoir) {
						return IE.jsx.str(
							"span",
							{ "ie-hint": lhintColonneNote },
							ObjetTraduction_1.GTraductions.getValeur("evaluations.notes"),
						);
					}
				};
				lResult.colonne = {
					id: aId,
					taille: 70,
					titre: { getLibelleHtml: lGetHtml },
				};
				break;
			}
			case DonneesListe_Competences_ElevesEvaluation_1
				.DonneesListe_Competences_ElevesEvaluation.colonnes.commentaireSurNote:
				lResult.colonne = {
					id: DonneesListe_Competences_ElevesEvaluation_1
						.DonneesListe_Competences_ElevesEvaluation.colonnes
						.commentaireSurNote,
					taille: 200,
					titre: {
						libelle:
							ObjetTraduction_1.GTraductions.getValeur("Notes.remarques"),
					},
				};
				break;
		}
		return lResult;
	}
	_initMenuContextuelListe(aParametres) {
		const lSelections = this.getInstance(
			this.identListeElevesEvaluation,
		).getTableauCellulesSelection();
		let lEvalEditable = false;
		let lObservationEditable = false;
		if (!lSelections || lSelections.length === 0) {
			return;
		}
		if (!aParametres.nonEditable) {
			lSelections.forEach((aSelection) => {
				if (
					DonneesListe_Competences_ElevesEvaluation_1.DonneesListe_Competences_ElevesEvaluation.estUneColonneCompetence(
						aSelection.idColonne,
					)
				) {
					const lColonne =
						aSelection.article.colonnesCompetences[aSelection.idColonne];
					if (lColonne.editable) {
						lEvalEditable = true;
						if (
							lColonne.competence &&
							lColonne.competence.niveauDAcquisition.getNumero()
						) {
							lObservationEditable = true;
						}
					}
				}
			});
		}
		UtilitaireCompetences_1.TUtilitaireCompetences.initMenuContextuelNiveauAcquisition(
			{
				instance: this,
				menuContextuel: aParametres.menuContextuel,
				avecLibelleRaccourci: true,
				genreChoixValidationCompetence:
					TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
						.tGVC_EvaluationEtItem,
				evaluationsEditables: lEvalEditable,
				estObservationEditable: lObservationEditable,
				callbackNiveau: this._modifierNiveauDeSelectionCourante.bind(
					this,
					true,
				),
				callbackCommentaire: this._editionCommentaireAcquisitions.bind(
					this,
					lSelections,
				),
			},
		);
	}
	_surKeyUpListe(aEvent) {
		const lListe = this.getInstance(this.identListeElevesEvaluation),
			lSelections = lListe.getTableauCellulesSelection();
		let lSelectionsContientUneColonneCompetence = false;
		lSelections.forEach((aSelection) => {
			if (
				DonneesListe_Competences_ElevesEvaluation_1.DonneesListe_Competences_ElevesEvaluation.estUneColonneCompetence(
					aSelection.idColonne,
				)
			) {
				lSelectionsContientUneColonneCompetence = true;
				return false;
			}
		});
		if (lSelectionsContientUneColonneCompetence) {
			let lNiveaux;
			if (this.appSco.getObjetParametres().listeNiveauxDAcquisitions) {
				lNiveaux = this.appSco
					.getObjetParametres()
					.listeNiveauxDAcquisitions.getListeElements((aEle) => {
						return aEle.actifPour.contains(
							TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
								.tGVC_EvaluationEtItem,
						);
					});
			}
			if (!!lNiveaux) {
				const lNiveau =
					UtilitaireCompetences_1.TUtilitaireCompetences.getNiveauAcqusitionDEventClavier(
						aEvent,
						lNiveaux,
					);
				if (lNiveau) {
					this._modifierNiveauDeSelectionCourante(false, lNiveau);
					return true;
				}
			}
		}
	}
	_editionCommentaireAcquisitions(aSelections) {
		let lCommentaireCommun = null;
		let lEstPublieeCommun = null;
		let lCommentaireEstIdentique = true;
		let lPublicationEstIdentique = true;
		aSelections.every((aSelection) => {
			const lColonnesCompetences =
				aSelection.article.colonnesCompetences[aSelection.idColonne];
			const lCompetence =
				lColonnesCompetences && lColonnesCompetences.competence;
			if (lCompetence) {
				if (lCommentaireCommun === null) {
					lCommentaireCommun = lCompetence.observation || "";
				} else if (
					lCommentaireEstIdentique &&
					lCommentaireCommun !== lCompetence.observation
				) {
					lCommentaireCommun = null;
					lCommentaireEstIdentique = false;
				}
				if (lEstPublieeCommun === null) {
					lEstPublieeCommun = !!lCompetence.observationPubliee;
				} else if (
					lPublicationEstIdentique &&
					lEstPublieeCommun !== lCompetence.observationPubliee
				) {
					lEstPublieeCommun = null;
					lPublicationEstIdentique = false;
				}
				if (!lCommentaireEstIdentique && !lPublicationEstIdentique) {
					return false;
				}
			}
			return true;
		});
		const lFenetreEditionObservation =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_SaisieMessage_1.ObjetFenetre_SaisieMessage,
				{
					pere: this,
					evenement: function (aNumeroBouton, aDonnees) {
						if (aNumeroBouton === 1) {
							const lObservationSaisie = aDonnees.message;
							const lEstPublieeSaisie = aDonnees.estPublie;
							if (
								lObservationSaisie !== undefined ||
								lEstPublieeSaisie !== undefined
							) {
								this._editionSelectionsCellulesListe(
									aSelections,
									(aCompetence, aSelection) => {
										if (
											aSelection.article.colonnesCompetences[
												aSelection.idColonne
											].editable &&
											aCompetence
										) {
											let lCompetenceModifiee = false;
											if (
												lObservationSaisie !== undefined &&
												aCompetence.observation !== lObservationSaisie
											) {
												aCompetence.observation = lObservationSaisie;
												lCompetenceModifiee = true;
											}
											if (
												lEstPublieeSaisie !== undefined &&
												aCompetence.observationPubliee !== lEstPublieeSaisie
											) {
												aCompetence.observationPubliee = lEstPublieeSaisie;
												lCompetenceModifiee = true;
											}
											if (!!lCompetenceModifiee) {
												return true;
											}
										}
									},
								);
							}
						}
					},
					initialiser: function (aInstance) {
						aInstance.setOptionsFenetre({
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"competences.AjouterCommentaire",
							),
						});
						aInstance.setParametresFenetreSaisieMessage({
							maxLengthSaisie: 1000,
							avecControlePublication: true,
						});
					},
				},
			);
		lFenetreEditionObservation.setDonnees(
			lCommentaireCommun,
			lEstPublieeCommun,
		);
	}
	_editionSelectionsCellulesListe(aSelections, aMethodeEdition) {
		if (!aSelections || aSelections.length === 0) {
			return;
		}
		let lAvecModif = false;
		aSelections.forEach((aSelection) => {
			if (
				DonneesListe_Competences_ElevesEvaluation_1.DonneesListe_Competences_ElevesEvaluation.estUneColonneCompetence(
					aSelection.idColonne,
				)
			) {
				const lCompetenceEleve =
					aSelection.article.colonnesCompetences[aSelection.idColonne]
						.competence;
				if (aMethodeEdition.call(this, lCompetenceEleve, aSelection)) {
					lCompetenceEleve.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aSelection.article.eleve.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
					lAvecModif = true;
				}
			}
		});
		if (lAvecModif) {
			this.callback.appel(
				EGenreEvenementCompetencesParEvaluation.editerCompetence,
			);
			this.getInstance(this.identListeElevesEvaluation).actualiser(true);
		}
	}
	_modifierNiveauDeSelectionCourante(aAvecReouvertureMenuContextuel, aNiveau) {
		if (!aNiveau) {
			return;
		}
		const lListe = this.getInstance(this.identListeElevesEvaluation),
			lSelections = lListe.getTableauCellulesSelection();
		if (lSelections.length === 0) {
			return;
		}
		this._editionSelectionsCellulesListe(
			lSelections,
			(aCompetence, aSelection) => {
				if (
					aSelection.article.colonnesCompetences[aSelection.idColonne]
						.editable &&
					aCompetence &&
					aNiveau &&
					aCompetence.getNumero() !== aNiveau.getNumero()
				) {
					aCompetence.niveauDAcquisition = aNiveau;
					return true;
				}
			},
		);
		if (lSelections.length === 1) {
			this._selectionnerCelluleSuivante(lListe, aAvecReouvertureMenuContextuel);
		}
	}
	_selectionnerCelluleSuivante(aListe, aAvecEntreeEnEdition) {
		aListe.selectionnerCelluleSuivante({
			entrerEdition: function (aParams) {
				return (
					aAvecEntreeEnEdition ||
					(aParams &&
						aParams.idColonne ===
							DonneesListe_Competences_ElevesEvaluation_1
								.DonneesListe_Competences_ElevesEvaluation.colonnes.notes)
				);
			},
			orientationVerticale:
				this.etatUtilSco.competences_modeSaisieClavierVertical,
		});
	}
}
exports.InterfaceCompetencesParEvaluation = InterfaceCompetencesParEvaluation;
