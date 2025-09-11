exports.PiedBulletin_AppreciationsAnnuelles = void 0;
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_Mention_1 = require("ObjetFenetre_Mention");
const TypeContexteBulletin_1 = require("TypeContexteBulletin");
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const TypeModeAffichagePiedBulletin_1 = require("TypeModeAffichagePiedBulletin");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const DonneesListe_AppreciationsAnnuellesPdB_1 = require("DonneesListe_AppreciationsAnnuellesPdB");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetElement_1 = require("ObjetElement");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const TypeGenreValidationCompetence_1 = require("TypeGenreValidationCompetence");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetMoteurPiedDeBulletin_1 = require("ObjetMoteurPiedDeBulletin");
const TypePositionnement_1 = require("TypePositionnement");
class PiedBulletin_AppreciationsAnnuelles extends ObjetInterface_1.ObjetInterface {
	constructor() {
		super(...arguments);
		this.moteurPdB =
			new ObjetMoteurPiedDeBulletin_1.ObjetMoteurPiedDeBulletin();
		this.params = {
			modeAffichage:
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Onglets,
			modeSaisie: false,
			avecContenuVide: false,
		};
		this.idModeConsult = this.Nom + "_consult";
	}
	construireInstances() {
		if (
			this.params.typeReleveBulletin ===
				TypeReleveBulletin_1.TypeReleveBulletin.AppreciationsBulletinParEleve &&
			this.params.contexte ===
				TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve &&
			this.params.modeSaisie === true
		) {
			this.identFenetreMentions = this.add(
				ObjetFenetre_Mention_1.ObjetFenetre_Mention,
				this._evntMention.bind(this),
				this._initMentions.bind(this),
			);
		}
		if (this.params.modeSaisie === true) {
			this.identListe = this.add(
				ObjetListe_1.ObjetListe,
				this._evntListe.bind(this),
				this._initListe.bind(this),
			);
		}
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const H = [];
		const lHauteurEntete = 15;
		H.push('<div style="height:100%">');
		if (this.params.modeSaisie === true) {
			H.push(
				'<div style="height: calc(100% - ',
				lHauteurEntete + 3,
				'px);" id="' + this.getInstance(this.identListe).getNom() + '"></div>',
			);
		}
		H.push('<div id="', this.idModeConsult, '"></div>');
		H.push("</div>");
		return H.join("");
	}
	setDonnees(aParam) {
		$.extend(true, this.params, aParam);
		this.listePeriodes = this.params.periodes;
		this.listeColonnes = this.params.colonnes;
		this.listeMentions = this.params.mentions;
	}
	estAffiche() {
		return this.listeColonnes.count() > 0;
	}
	afficher(aParam) {
		$.extend(true, this.params, aParam);
		const lAppr = this.listeColonnes;
		const lAvecSaisie =
			this.params.modeSaisie === true && this.params.avecSaisieAG;
		switch (aParam.modeAffichage) {
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Onglets:
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Lineaire:
				super.afficher();
				break;
		}
		if (lAppr && this.identListe !== null && this.identListe !== undefined) {
			const lParam = {
				global: this.params.global,
				typeReleveBulletin: this.params.typeReleveBulletin,
				avecSaisie: lAvecSaisie,
				initMenuContextuel: this._initMenuContextuelListe.bind(this),
				avecValidationAuto: this.params.avecValidationAuto,
				clbckValidationAutoSurEdition: this.params.avecValidationAuto
					? this.params.clbckValidationAutoSurEdition
					: null,
				instanceListe: this.getInstance(this.identListe),
			};
			this.getInstance(this.identListe).setDonnees(
				new DonneesListe_AppreciationsAnnuellesPdB_1.DonneesListe_AppreciationsAnnuellesPdB(
					this.listePeriodes,
					lParam,
				),
			);
		}
		ObjetHtml_1.GHtml.setHtml(this.idModeConsult, "");
	}
	getDonneesSaisie() {
		const lInstance = this;
		const lListeDonnees = new ObjetListeElements_1.ObjetListeElements();
		lListeDonnees.listeMoyennes = new ObjetListeElements_1.ObjetListeElements();
		lListeDonnees.listeNiveauDAcquitions =
			new ObjetListeElements_1.ObjetListeElements();
		lInstance.listeColonnes.parcourir((D) => {
			const lElement = new ObjetElement_1.ObjetElement();
			lElement.ListeAppreciations =
				new ObjetListeElements_1.ObjetListeElements();
			if (lInstance.params.global) {
				lElement.Numero = D.getNumero();
				lElement.Intitule = D.Intitule.join(", ");
				lElement.Genre = D.getGenre();
			}
			lInstance.listePeriodes.parcourir((periode) => {
				const lPeriode = new ObjetElement_1.ObjetElement();
				lPeriode.Numero = periode.getNumero();
				lPeriode.Libelle = periode.getLibelle();
				const lListeAppr = lInstance.params.global
					? periode.listeAppreciationsGenerales
					: periode.listeAppreciations;
				lListeAppr.parcourir((lAppr) => {
					if (lAppr.getGenre() === D.getGenre()) {
						lAppr.periode = lPeriode;
						lElement.ListeAppreciations.addElement(lAppr);
					}
				});
			});
			lListeDonnees.addElement(lElement);
		});
		lInstance.listePeriodes.parcourir((periode) => {
			const lPeriode = new ObjetElement_1.ObjetElement();
			lPeriode.Numero = periode.getNumero();
			lPeriode.Libelle = periode.getLibelle();
			if (periode.moyenneLSU) {
				const lMoyenne = new ObjetElement_1.ObjetElement();
				lMoyenne.moyenne = periode.moyenneLSU;
				lMoyenne.periode = lPeriode;
				lListeDonnees.listeMoyennes.addElement(lMoyenne);
			}
			if (periode.niveauDAcquisition) {
				const lNiveauDAcquisition = new ObjetElement_1.ObjetElement();
				lNiveauDAcquisition.setEtat(periode.niveauDAcquisition.Etat);
				lNiveauDAcquisition.position = periode.niveauDAcquisition;
				lNiveauDAcquisition.periode = lPeriode;
				lListeDonnees.listeNiveauDAcquitions.addElement(lNiveauDAcquisition);
			}
		});
		return lListeDonnees;
	}
	evenementSurAssistant() {
		this._actualiserListe();
	}
	setParametres(aParam) {
		$.extend(true, this.params, aParam);
	}
	surResizeInterface() {
		this._actualiserListe();
	}
	_evntListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				if (
					aParametres.idColonne ===
					DonneesListe_AppreciationsAnnuellesPdB_1
						.DonneesListe_AppreciationsAnnuellesPdB.colonnes.niveauDAcquisition
				) {
					aParametres.ouvrirMenuContextuel();
				} else if (
					aParametres.idColonne !==
					DonneesListe_AppreciationsAnnuellesPdB_1
						.DonneesListe_AppreciationsAnnuellesPdB.colonnes.moyenneLSU
				) {
					const listeAppreciations = this.params.global
						? aParametres.article.listeAppreciationsGenerales
						: aParametres.article.listeAppreciations;
					const lAppreciation = listeAppreciations.get(
						aParametres.declarationColonne.indice,
					);
					this.objCelluleAppreciation = {
						article: aParametres.article,
						appreciation: lAppreciation,
						idColonne: aParametres.idColonne,
						instanceListe: this.getInstance(this.identListe),
						global: this.params.global,
					};
					if (this.moteurPdB.estMention({ appreciation: lAppreciation })) {
						this.moteurPdB.evenementOuvrirMentions({
							instanceFenetre: this.getInstance(this.identFenetreMentions),
							listeMentions: this.listeMentions,
						});
					} else {
						this.callback.appel(this.objCelluleAppreciation);
					}
				}
				break;
		}
	}
	_initMenuContextuelListe(aParametres) {
		const lSelections = this.getInstance(
			this.identListe,
		).getTableauCellulesSelection();
		if (!lSelections || lSelections.length === 0) {
			return;
		}
		UtilitaireCompetences_1.TUtilitaireCompetences.initMenuContextuelNiveauAcquisition(
			{
				instance: this,
				menuContextuel: aParametres.menuContextuel,
				avecLibelleRaccourci: true,
				evaluationsEditables: true,
				genrePositionnement:
					TypePositionnement_1.TypePositionnementUtil.getGenrePositionnementParDefaut(
						aParametres.article.typePositionnementClasse,
					),
				genreChoixValidationCompetence:
					TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
						.tGVC_Competence,
				callbackNiveau: this._modifierNiveauDeSelectionCourante.bind(this),
			},
		);
	}
	_modifierNiveauDeSelectionCourante(aNiveau) {
		if (!aNiveau) {
			return;
		}
		const lListe = this.getInstance(this.identListe),
			lSelections = lListe.getTableauCellulesSelection();
		if (lSelections.length === 0) {
			return;
		}
		lSelections.forEach((aSelection) => {
			if (
				aSelection.idColonne ===
				DonneesListe_AppreciationsAnnuellesPdB_1
					.DonneesListe_AppreciationsAnnuellesPdB.colonnes.niveauDAcquisition
			) {
				aSelection.article.niveauDAcquisition = aNiveau;
				aSelection.article.niveauDAcquisition.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
			}
		});
		this.setEtatSaisie(true);
		this.getInstance(this.identListe).actualiser(true);
	}
	_initListe(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_AppreciationsAnnuellesPdB_1
				.DonneesListe_AppreciationsAnnuellesPdB.colonnes.periode,
			taille: "65px",
		});
		if (!this.params.global) {
			if (this.params.periodes) {
				const lPremierePeriode = this.params.periodes.get(0);
				if (lPremierePeriode) {
					if (lPremierePeriode.evolution) {
						lColonnes.push({
							id: DonneesListe_AppreciationsAnnuellesPdB_1
								.DonneesListe_AppreciationsAnnuellesPdB.colonnes.evolution,
							taille: "35px",
							titre: {
								libelle: ObjetTraduction_1.GTraductions.getValeur(
									"AppreciationsBulletinEleve.PiedDeBulletin.Evolutions",
								),
							},
						});
					}
				}
				if (lPremierePeriode.niveauDAcquisition) {
					lColonnes.push({
						id: DonneesListe_AppreciationsAnnuellesPdB_1
							.DonneesListe_AppreciationsAnnuellesPdB.colonnes
							.niveauDAcquisition,
						taille: "35px",
						titre: {
							libelle: ObjetTraduction_1.GTraductions.getValeur(
								"AppreciationsBulletinEleve.PiedDeBulletin.Positionnement",
							),
						},
					});
				}
				if (lPremierePeriode.moyenneLSU) {
					lColonnes.push({
						id: DonneesListe_AppreciationsAnnuellesPdB_1
							.DonneesListe_AppreciationsAnnuellesPdB.colonnes.moyenneLSU,
						taille: "35px",
						titre: {
							libelle: ObjetTraduction_1.GTraductions.getValeur(
								"AppreciationsBulletinEleve.PiedDeBulletin.Moyenne",
							),
						},
					});
				}
			}
			if (this.params.options && this.params.options.afficherDevoirsEvalPdB) {
				if (
					this.params.periodes.get(0) &&
					this.params.periodes.get(0).nbrDevoirs !== undefined
				) {
					lColonnes.push({
						id: DonneesListe_AppreciationsAnnuellesPdB_1
							.DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbDevoirs,
						taille: "35px",
						titre: {
							libelle: ObjetTraduction_1.GTraductions.getValeur(
								"AppreciationsBulletinEleve.PiedDeBulletin.Devoirs",
							),
						},
					});
				}
				lColonnes.push({
					id: DonneesListe_AppreciationsAnnuellesPdB_1
						.DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbEvals,
					taille: "35px",
					titre: {
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"AppreciationsBulletinEleve.PiedDeBulletin.Evaluations",
						),
					},
				});
			}
			if (this.params.options && this.params.options.afficherAbsencePdB) {
				lColonnes.push({
					id: DonneesListe_AppreciationsAnnuellesPdB_1
						.DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbAbs,
					taille: "35px",
					titre: {
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"AppreciationsBulletinEleve.PiedDeBulletin.Absences",
						),
					},
				});
			}
			if (this.params.options && this.params.options.afficherRetardPdB) {
				lColonnes.push({
					id: DonneesListe_AppreciationsAnnuellesPdB_1
						.DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbRetard,
					taille: "35px",
					titre: {
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"AppreciationsBulletinEleve.PiedDeBulletin.Retards",
						),
					},
				});
			}
		}
		if (this.listeColonnes) {
			for (
				let lNumAppreciation = 0;
				lNumAppreciation < this.listeColonnes.count();
				lNumAppreciation++
			) {
				lColonnes.push({
					id:
						DonneesListe_AppreciationsAnnuellesPdB_1
							.DonneesListe_AppreciationsAnnuellesPdB.colonnes.appreciation +
						this.listeColonnes.getGenre(lNumAppreciation),
					taille: "20%",
					titre: this.listeColonnes.get(lNumAppreciation).Intitule.join(", "),
					indice: lNumAppreciation,
					genre: this.listeColonnes.getGenre(lNumAppreciation),
				});
			}
		}
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			AvecSuppression: false,
			avecLigneCreation: false,
			colonnesTriables: false,
			hauteurAdapteContenu: true,
			nonEditableSurModeExclusif: true,
			scrollHorizontal:
				DonneesListe_AppreciationsAnnuellesPdB_1
					.DonneesListe_AppreciationsAnnuellesPdB.colonnes.appreciation + "0",
		});
	}
	_initMentions(aInstance) {
		this.moteurPdB.initialiserMentions({ instanceFenetre: aInstance });
	}
	_evntMention(aGenreBouton) {
		const lParam = $.extend(this.objCelluleAppreciation, {
			instanceFenetre: this.getInstance(this.identFenetreMentions),
			avecValidationAuto: this.params.avecValidationAuto,
			clbckValidationAutoSurEdition: this.params.clbckValidationAutoSurEdition,
		});
		this.moteurPdB.evenementMention(aGenreBouton, lParam);
		if (aGenreBouton === 1 && this.params.avecValidationAuto !== true) {
			this.setEtatSaisie(true);
		}
	}
	_actualiserListe() {
		if (this.identListe !== null && this.identListe !== undefined) {
			this.getInstance(this.identListe).actualiser(true);
		}
	}
}
exports.PiedBulletin_AppreciationsAnnuelles =
	PiedBulletin_AppreciationsAnnuelles;
