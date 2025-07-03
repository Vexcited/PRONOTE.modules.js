exports.DonneesListe_FicheLivretScolaire = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTri_1 = require("ObjetTri");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const AccessApp_1 = require("AccessApp");
class DonneesListe_FicheLivretScolaire extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		aDonnees.donnees.parcourir((D) => {
			if ((D.avecRegroupement || D.titreEnseignement) && !D.periode) {
				D.estUnDeploiement = true;
				D.estDeploye = true;
			}
		});
		super(aDonnees.donnees);
		this.etatUtil = (0, AccessApp_1.getApp)().getEtatUtilisateur();
		this.donneesClasse = aDonnees.donneesClasse;
		this.parametres = Object.assign(
			{
				affichage: aParam.affichage,
				avecFiliere: aParam.avecFiliere,
				initMenuContextuel: aParam.initMenuContextuel,
				instance: aParam.instance,
				listeEvaluations: aParam.listeEvaluations,
				tailleMax: aParam.tailleMax,
				eleveRedoublant: false,
			},
			aParam,
		);
		this.parametres.instance.setOptionsListe({
			colonnesCachees: this._getContexteColonnes(
				this.parametres.affichage,
				this.parametres.eleveRedoublant,
			),
		});
		this.setOptions({
			avecEvnt_Selection: true,
			avecSuppression: false,
			avecDeploiement: true,
			avecCelluleSuivanteSurFinEdition: true,
			editionApresSelection: false,
			avecEvnt_KeyPressListe: true,
			avecEvnt_KeyUpListe: false,
			selectionParCellule: true,
			avecSelectionSurNavigationClavier: true,
		});
		this.moteur = new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
	}
	avecSelection(aParams) {
		if (
			aParams.idColonne &&
			aParams.idColonne.startsWith(
				DonneesListe_FicheLivretScolaire.colonnes.saisieEval,
			)
		) {
			return aParams.article.livretEditable;
		}
		return false;
	}
	avecEdition(aParams) {
		return (
			this._avecEditionAppreciation(aParams) ||
			this._avecEditionConserverAnciennesNotes(aParams)
		);
	}
	getTooltip(aParams) {
		const lAriaLabel = this.getAriaLabel(aParams);
		if (lAriaLabel) {
			return lAriaLabel;
		}
		switch (aParams.idColonne) {
			case DonneesListe_FicheLivretScolaire.colonnes.anciennesNotes:
				return aParams.article.conserveAnciennesNotes
					? ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.HintCocheAnneePrecedente",
							[aParams.article.hintAnciennesNotes],
						)
					: "";
		}
		return "";
	}
	getAriaHasPopup(aParams) {
		if (this._avecEvaluationCompetenceLS(aParams.article, aParams)) {
			return "dialog";
		}
		return false;
	}
	getAriaLabel(aParams) {
		var _a, _b, _c, _d;
		if (this._avecEvaluationCompetenceLS(aParams.article, aParams)) {
			if (_estCelluleCompetence(aParams)) {
				return (_b =
					(_a = aParams.article.listeCompetences.get(
						aParams.declarationColonne.rangColonne,
					)) === null || _a === void 0
						? void 0
						: _a.evaluation) === null || _b === void 0
					? void 0
					: _b.getLibelle();
			}
			switch (aParams.idColonne) {
				case DonneesListe_FicheLivretScolaire.colonnes.saisieEval:
					return (_d =
						(_c = aParams.article.itemLivretScolaire) === null || _c === void 0
							? void 0
							: _c.evaluation) === null || _d === void 0
						? void 0
						: _d.getLibelle();
			}
		}
		return "";
	}
	_avecEditionConserverAnciennesNotes(aParams) {
		return (
			aParams.idColonne ===
				DonneesListe_FicheLivretScolaire.colonnes.anciennesNotes &&
			this.etatUtil.getUtilisateur().getGenre() ===
				Enumere_Ressource_1.EGenreRessource.Enseignant &&
			this.parametres.eleveRedoublant &&
			((!!aParams.article.services && aParams.article.services.count() > 0) ||
				(!!aParams.article.service && aParams.article.service.existeNumero()))
		);
	}
	_avecEditionAppreciation(aParams) {
		return (
			aParams.article.appreciationAnnuelle &&
			aParams.article.appreciationAnnuelle.editable &&
			((aParams.idColonne ===
				DonneesListe_FicheLivretScolaire.colonnes.appreciation &&
				!this.parametres.affichage.avecColonneAppreciationsAnnuelles) ||
				aParams.idColonne ===
					DonneesListe_FicheLivretScolaire.colonnes.apprAnnuelle)
		);
	}
	avecEvenementSelection(aParams) {
		this.celluleCourante = aParams.article;
		return true;
	}
	_avecEvaluationCompetenceLS(aArticle, aParams) {
		return (
			((aParams.idColonne ===
				DonneesListe_FicheLivretScolaire.colonnes.saisieEval &&
				(aArticle.avecServices || aArticle.estSansObligationDeNotation)) ||
				_estCelluleCompetence(aParams)) &&
			aArticle.livretEditable
		);
	}
	avecEvenementEdition(aParams) {
		this.celluleCourante = aParams.article;
		return (
			(this._avecEditionAppreciation(aParams) &&
				(this.etatUtil.assistantSaisieActif ||
					(aParams.article.services &&
						aParams.article.services.count() > 1))) ||
			this._avecEvaluationCompetenceLS(aParams.article, aParams)
		);
	}
	autoriserChaineVideSurEdition() {
		return true;
	}
	avecDeploiementSurColonne(aParams) {
		return (
			aParams.idColonne ===
			DonneesListe_FicheLivretScolaire.colonnes.regroupement
		);
	}
	avecImageSurColonneDeploiement(aParams) {
		return (
			aParams.idColonne ===
			DonneesListe_FicheLivretScolaire.colonnes.regroupement
		);
	}
	avecContenuTronque(aParams) {
		return (
			aParams.idColonne !==
				DonneesListe_FicheLivretScolaire.colonnes.appreciation &&
			aParams.idColonne !==
				DonneesListe_FicheLivretScolaire.colonnes.apprAnnuelle
		);
	}
	getTri() {
		return [
			ObjetTri_1.ObjetTri.initRecursif("pere", [
				ObjetTri_1.ObjetTri.init("Genre"),
				ObjetTri_1.ObjetTri.init((D) => {
					return D.Libelle;
				}),
			]),
		];
	}
	surDeploiement(I, J, D) {
		D.estDeploye = !D.estDeploye;
		for (
			let index = J + 1, lFlag = true, lNbr = this.Donnees.count();
			index < lNbr && lFlag;
			index++
		) {
			const lLigne = this.Donnees.get(index);
			lFlag =
				(lLigne.avecRegroupement || this.parametres.avecFiliere) &&
				!lLigne.estUnDeploiement;
			if (lFlag) {
				lLigne.estDeploye = !lLigne.estDeploye;
			}
		}
	}
	getValeur(aParams) {
		if (_estCelluleCompetence(aParams)) {
			return aParams.article.listeCompetences.get(
				aParams.declarationColonne.rangColonne,
			).evaluation.abbreviation;
		} else if (
			aParams.idColonne.startsWith(
				DonneesListe_FicheLivretScolaire.colonnes.jaugeEval,
			)
		) {
			if (aParams.article.listeCompetences) {
				const lCompetence = aParams.article.listeCompetences.get(
					aParams.declarationColonne.rangJauge,
				);
				if (!!lCompetence && !!lCompetence.listeNiveaux) {
					const lOptionsJauge = {
						listeNiveaux: lCompetence.listeNiveaux,
						hint: lCompetence.hintNiveaux || "",
						listeGenreNiveauxIgnores: [],
					};
					return UtilitaireCompetences_1.TUtilitaireCompetences.composeJaugeParNiveaux(
						lOptionsJauge,
					);
				}
			}
			return "";
		}
		switch (aParams.idColonne) {
			case DonneesListe_FicheLivretScolaire.colonnes.discipline:
				return aParams.article.getLibelle();
			case DonneesListe_FicheLivretScolaire.colonnes.periode:
				return aParams.article.periode
					? '<span class="Texte9">' +
							aParams.article.periode.getLibelle() +
							"</span>"
					: "";
			case DonneesListe_FicheLivretScolaire.colonnes.rang: {
				const H = [];
				const lInfoClasse = this.donneesClasse
					? this.donneesClasse.get(aParams.ligne).rangTotal
					: aParams.article.rangTotal;
				if (!isNaN(aParams.article.rangEleve) && !isNaN(lInfoClasse)) {
					H.push(aParams.article.rangEleve);
					H.push(`<span class="Texte9">/${lInfoClasse}</span>`);
				}
				return H.join("");
			}
			case DonneesListe_FicheLivretScolaire.colonnes.moyEleve: {
				const T = [];
				if (aParams.article.estMoyNR === true) {
					T.push(this.moteur.composeHtmlMoyNR());
				} else if (
					aParams.article.moyEleve !== null &&
					aParams.article.moyEleve !== undefined
				) {
					T.push(aParams.article.moyEleve.getNote());
				}
				return T.join("");
			}
			case DonneesListe_FicheLivretScolaire.colonnes.moyClasse:
				return this.donneesClasse
					? this.donneesClasse.get(aParams.ligne).moyClasse
						? this.donneesClasse.get(aParams.ligne).moyClasse.getNote()
						: ""
					: aParams.article.moyClasse
						? aParams.article.moyClasse.getNote()
						: "";
			case DonneesListe_FicheLivretScolaire.colonnes.inf8:
				return this.donneesClasse
					? this.donneesClasse.get(aParams.ligne).inf8 !== undefined
						? this.donneesClasse.get(aParams.ligne).inf8 + " %"
						: ""
					: aParams.article.inf8 !== undefined
						? aParams.article.inf8 + " %"
						: "";
			case DonneesListe_FicheLivretScolaire.colonnes.de8a12:
				return this.donneesClasse
					? this.donneesClasse.get(aParams.ligne).de8a12 !== undefined
						? this.donneesClasse.get(aParams.ligne).de8a12 + " %"
						: ""
					: aParams.article.de8a12 !== undefined
						? aParams.article.de8a12 + " %"
						: "";
			case DonneesListe_FicheLivretScolaire.colonnes.sup12:
				return this.donneesClasse
					? this.donneesClasse.get(aParams.ligne).sup12 !== undefined
						? this.donneesClasse.get(aParams.ligne).sup12 + " %"
						: ""
					: aParams.article.sup12 !== undefined
						? aParams.article.sup12 + " %"
						: "";
			case DonneesListe_FicheLivretScolaire.colonnes.evaluation:
				return aParams.article.itemLivretScolaire
					? aParams.article.itemLivretScolaire.getLibelle()
					: "";
			case DonneesListe_FicheLivretScolaire.colonnes.saisieEval:
				return aParams.article.itemLivretScolaire
					? aParams.article.itemLivretScolaire.evaluation.abbreviation
					: "";
			case DonneesListe_FicheLivretScolaire.colonnes.appreciation: {
				if (aParams.article.appreciation) {
					return aParams.article.appreciation;
				} else if (aParams.article.appreciationAnnuelle) {
					if (!!aParams.article.appreciationAnnuelle.estRattache) {
						return ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.messageServiceRattache",
						);
					} else {
						return aParams.article.appreciationAnnuelle.getLibelle();
					}
				} else {
					return "";
				}
			}
			case DonneesListe_FicheLivretScolaire.colonnes.apprAnnuelle:
				return aParams.article.appreciationAnnuelle
					? aParams.article.appreciationAnnuelle.getLibelle()
					: "";
			case DonneesListe_FicheLivretScolaire.colonnes.anciennesNotes:
				return aParams.article && this.parametres.eleveRedoublant
					? aParams.article.conserveAnciennesNotes
					: false;
			default:
				return "";
		}
	}
	getTypeValeur(aParams) {
		if (
			_estCelluleCompetence(aParams) ||
			aParams.idColonne.startsWith(
				DonneesListe_FicheLivretScolaire.colonnes.jaugeEval,
			)
		) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		switch (aParams.idColonne) {
			case DonneesListe_FicheLivretScolaire.colonnes.regroupement:
				return aParams.article.estUnDeploiement === true
					? ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.CocheDeploiement
					: ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_FicheLivretScolaire.colonnes.moyEleve:
			case DonneesListe_FicheLivretScolaire.colonnes.periode:
			case DonneesListe_FicheLivretScolaire.colonnes.rang:
			case DonneesListe_FicheLivretScolaire.colonnes.inf8:
			case DonneesListe_FicheLivretScolaire.colonnes.de8a12:
			case DonneesListe_FicheLivretScolaire.colonnes.sup12:
			case DonneesListe_FicheLivretScolaire.colonnes.saisieEval:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_FicheLivretScolaire.colonnes.discipline:
			case DonneesListe_FicheLivretScolaire.colonnes.moyClasse:
			case DonneesListe_FicheLivretScolaire.colonnes.evaluation:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
			case DonneesListe_FicheLivretScolaire.colonnes.appreciation:
			case DonneesListe_FicheLivretScolaire.colonnes.apprAnnuelle:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.ZoneTexte;
			case DonneesListe_FicheLivretScolaire.colonnes.anciennesNotes:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
			default:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
		}
	}
	surEdition(aParams, aValeur) {
		if (
			aParams.idColonne ===
				DonneesListe_FicheLivretScolaire.colonnes.appreciation ||
			aParams.idColonne ===
				DonneesListe_FicheLivretScolaire.colonnes.apprAnnuelle
		) {
			aParams.article.appreciationAnnuelle.setEtat(
				Enumere_Etat_1.EGenreEtat.Modification,
			);
			aParams.article.appreciation = aValeur;
			aParams.article.appreciationAnnuelle.setLibelle(aValeur);
			aParams.article.appreciationAnnuelle.setValidationSaisie(true);
		}
		if (
			aParams.idColonne ===
			DonneesListe_FicheLivretScolaire.colonnes.anciennesNotes
		) {
			aParams.article.modifConserveAnciennesNotes = true;
			aParams.article.conserveAnciennesNotes = aValeur;
		}
	}
	getControleCaracteresInput(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_FicheLivretScolaire.colonnes.appreciation:
			case DonneesListe_FicheLivretScolaire.colonnes.apprAnnuelle:
				if (this.parametres.tailleMax) {
					return { tailleMax: this.parametres.tailleMax };
				} else {
					return {
						tailleMax: aParams.article.appreciationAnnuelle.tailleMaxSaisie,
					};
				}
			default:
				return null;
		}
	}
	remplirMenuContextuel(aParametres) {
		this.parametres.initMenuContextuel(aParametres);
	}
	evenementMenuContextuel(aParametres) {
		const lSelection = aParametres.ligneMenu.data,
			lEval = MethodesObjet_1.MethodesObjet.dupliquer(
				this.listeEval.get(lSelection),
			),
			lCelluleCourante = aParametres.article;
		if (!lSelection) {
			lEval.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
		} else {
			lEval.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
		if (_estCelluleCompetence(aParametres)) {
			lCelluleCourante.listeCompetences.get(
				aParametres.declarationColonne.rangColonne,
			).evaluation = lEval;
			lCelluleCourante.setEtat(Enumere_Etat_1.EGenreEtat.FilsModification);
			lCelluleCourante.listeCompetences
				.get(aParametres.declarationColonne.rangColonne)
				.setEtat(Enumere_Etat_1.EGenreEtat.FilsModification);
		} else {
			lCelluleCourante.itemLivretScolaire.evaluation = lEval;
			lCelluleCourante.setEtat(Enumere_Etat_1.EGenreEtat.FilsModification);
			lCelluleCourante.itemLivretScolaire.setEtat(
				Enumere_Etat_1.EGenreEtat.FilsModification,
			);
		}
	}
	getClass(aParams) {
		const T = [];
		if (
			aParams.idColonne ===
				DonneesListe_FicheLivretScolaire.colonnes.moyEleve ||
			(aParams.idColonne ===
				DonneesListe_FicheLivretScolaire.colonnes.discipline &&
				aParams.article.titreDiscipline)
		) {
			T.push("Gras");
		}
		if (
			aParams.idColonne ===
				DonneesListe_FicheLivretScolaire.colonnes.discipline &&
			(aParams.article.titreEnseignant || aParams.article.titreService)
		) {
			T.push("Italique");
		}
		if (
			[
				DonneesListe_FicheLivretScolaire.colonnes.periode,
				DonneesListe_FicheLivretScolaire.colonnes.rang,
				DonneesListe_FicheLivretScolaire.colonnes.moyEleve,
				DonneesListe_FicheLivretScolaire.colonnes.moyClasse,
				DonneesListe_FicheLivretScolaire.colonnes.inf8,
				DonneesListe_FicheLivretScolaire.colonnes.de8a12,
				DonneesListe_FicheLivretScolaire.colonnes.sup12,
			].includes(aParams.idColonne)
		) {
			T.push("AlignementDroit");
		}
		if (
			aParams.idColonne === DonneesListe_FicheLivretScolaire.colonnes.saisieEval
		) {
			T.push("AlignementMilieu");
		}
		if (
			((aParams.idColonne ===
				DonneesListe_FicheLivretScolaire.colonnes.appreciation &&
				!this.parametres.affichage.avecColonneAppreciationsAnnuelles) ||
				aParams.idColonne ===
					DonneesListe_FicheLivretScolaire.colonnes.apprAnnuelle) &&
			this.etatUtil.assistantSaisieActif &&
			aParams.article.appreciationAnnuelle &&
			aParams.article.appreciationAnnuelle.editable
		) {
			T.push("Curseur_AssistantSaisieActif");
		}
		return T.join(" ");
	}
	getClassCelluleConteneur(aParams) {
		const T = [];
		if (
			aParams.idColonne.startsWith(
				DonneesListe_FicheLivretScolaire.colonnes.jaugeEval,
			)
		) {
			T.push("dl_fls_Jauge");
		}
		if (
			((aParams.idColonne ===
				DonneesListe_FicheLivretScolaire.colonnes.appreciation &&
				!this.parametres.affichage.avecColonneAppreciationsAnnuelles) ||
				aParams.idColonne ===
					DonneesListe_FicheLivretScolaire.colonnes.apprAnnuelle) &&
			this.etatUtil.assistantSaisieActif &&
			aParams.article.appreciationAnnuelle &&
			aParams.article.appreciationAnnuelle.editable
		) {
			T.push("Curseur_AssistantSaisieActif");
		}
		if (_estCelluleCompetence(aParams)) {
			T.push("Gras AlignementMilieu");
		}
		return T.join(" ");
	}
	alignVCenter(aParams) {
		return (
			_estCelluleCompetence(aParams) ||
			aParams.idColonne ===
				DonneesListe_FicheLivretScolaire.colonnes.anciennesNotes
		);
	}
	getCouleurCellule(aParams) {
		let lColor = ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Fixe;
		if (
			aParams.idColonne !==
				DonneesListe_FicheLivretScolaire.colonnes.discipline &&
			aParams.idColonne !== DonneesListe_FicheLivretScolaire.colonnes.periode
		) {
			lColor = ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Gris;
		}
		if (
			aParams.idColonne ===
				DonneesListe_FicheLivretScolaire.colonnes.moyEleve ||
			aParams.idColonne === DonneesListe_FicheLivretScolaire.colonnes.moyClasse
		) {
			lColor = ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Total;
		}
		if (_estCelluleDeploiement(aParams)) {
			lColor =
				ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Deploiement;
			return lColor;
		}
		if (
			aParams.idColonne ===
			DonneesListe_FicheLivretScolaire.colonnes.regroupement
		) {
			lColor = aParams.article.avecRegroupement
				? ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Deploiement
				: ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Fixe;
		}
		if (
			(((aParams.idColonne ===
				DonneesListe_FicheLivretScolaire.colonnes.appreciation &&
				!this.parametres.affichage.avecColonneAppreciationsAnnuelles) ||
				aParams.idColonne ===
					DonneesListe_FicheLivretScolaire.colonnes.apprAnnuelle) &&
				aParams.article.appreciationAnnuelle &&
				aParams.article.appreciationAnnuelle.editable) ||
			(((aParams.idColonne ===
				DonneesListe_FicheLivretScolaire.colonnes.saisieEval &&
				(aParams.article.avecServices ||
					aParams.article.estSansObligationDeNotation)) ||
				_estCelluleCompetence(aParams)) &&
				aParams.article.livretEditable)
		) {
			lColor = ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
		}
		if (this._avecEditionConserverAnciennesNotes(aParams)) {
			lColor = ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
		}
		return lColor;
	}
	getStyle(aParams) {
		if (
			aParams.idColonne ===
				DonneesListe_FicheLivretScolaire.colonnes.discipline &&
			!aParams.article.avecServices &&
			!aParams.article.estSansObligationDeNotation &&
			aParams.article.metaMatiere
		) {
			return "color:" + GCouleur.rouge + ";";
		}
	}
	avecBordureBas(aParamsLigne) {
		let lResultat = true;
		if (
			!aParamsLigne.article.derniereligne &&
			aParamsLigne.idColonne ===
				DonneesListe_FicheLivretScolaire.colonnes.regroupement &&
			aParamsLigne.article.avecRegroupement
		) {
			lResultat = false;
		}
		if (
			(aParamsLigne.idColonne ===
				DonneesListe_FicheLivretScolaire.colonnes.discipline ||
				aParamsLigne.idColonne ===
					DonneesListe_FicheLivretScolaire.colonnes.regroupement) &&
			!aParamsLigne.article.derniereligne &&
			!_estCelluleDeploiement(aParamsLigne)
		) {
			lResultat = false;
		}
		if (
			aParamsLigne.article.derniereligne &&
			aParamsLigne.idColonne ===
				DonneesListe_FicheLivretScolaire.colonnes.regroupement &&
			aParamsLigne.article.avecRegroupement &&
			aParamsLigne.celluleLigneSuivante.article.avecRegroupement &&
			!_estCelluleDeploiement(aParamsLigne.celluleLigneSuivante)
		) {
			lResultat = false;
		}
		if (
			!aParamsLigne.article.derniereligne &&
			aParamsLigne.article.estChefDOeuvre &&
			!_estCelluleDeploiement(aParamsLigne.celluleLigneSuivante)
		) {
			lResultat = false;
		}
		return lResultat;
	}
	rechercheTexteForcerLignePrecSuivVisible(
		aParamsLigneVisible,
		aParamsLignePrecSuivCachee,
	) {
		if (aParamsLigneVisible.ligne < aParamsLignePrecSuivCachee.ligne) {
			return !aParamsLigneVisible.article.derniereligne;
		} else {
			return !aParamsLignePrecSuivCachee.article.derniereligne;
		}
	}
	avecBordureDroite(aParamsLigne) {
		const lEstColDiscipline =
			aParamsLigne.idColonne ===
				DonneesListe_FicheLivretScolaire.colonnes.discipline ||
			(aParamsLigne.idColonne ===
				DonneesListe_FicheLivretScolaire.colonnes.regroupement &&
				!aParamsLigne.article.avecRegroupement) ||
			_estCelluleDeploiement(aParamsLigne);
		if (lEstColDiscipline) {
			return false;
		}
		return true;
	}
	fusionCelluleAvecColonnePrecedente(aParams) {
		if (
			_estCelluleDeploiement(aParams) &&
			aParams.idColonne !== DonneesListe_FicheLivretScolaire.colonnes.discipline
		) {
			return true;
		}
		if (
			aParams.idColonne === DonneesListe_FicheLivretScolaire.colonnes.saisieEval
		) {
			return !aParams.article.itemLivretScolaire;
		}
		return false;
	}
	fusionCelluleAvecLignePrecedente(aParamsCellule) {
		if (
			aParamsCellule.idColonne ===
			DonneesListe_FicheLivretScolaire.colonnes.apprAnnuelle
		) {
			return (
				!aParamsCellule.celluleLignePrecedente.article.derniereligne &&
				!aParamsCellule.article.titreDiscipline
			);
		}
		if (
			_estCelluleCompetence(aParamsCellule) ||
			aParamsCellule.idColonne.startsWith(
				DonneesListe_FicheLivretScolaire.colonnes.jaugeEval,
			)
		) {
			return !aParamsCellule.celluleLignePrecedente.article.derniereligne;
		}
		if (this.parametres.avecFiliere) {
			switch (aParamsCellule.idColonne) {
				case DonneesListe_FicheLivretScolaire.colonnes.anciennesNotes:
					return (
						!aParamsCellule.celluleLignePrecedente.article.derniereligne &&
						!aParamsCellule.article.titreDiscipline
					);
				case DonneesListe_FicheLivretScolaire.colonnes.appreciation:
					return (
						!aParamsCellule.celluleLignePrecedente.article.derniereligne &&
						!aParamsCellule.article.titreDiscipline
					);
				case DonneesListe_FicheLivretScolaire.colonnes.regroupement:
				case DonneesListe_FicheLivretScolaire.colonnes.discipline:
					return false;
				case DonneesListe_FicheLivretScolaire.colonnes.evaluation:
				case DonneesListe_FicheLivretScolaire.colonnes.saisieEval:
					return (
						!aParamsCellule.article.titreDiscipline &&
						!aParamsCellule.article.titreEnseignement &&
						!!aParamsCellule.article.metaMatiere &&
							!!aParamsCellule.celluleLignePrecedente.article.metaMatiere &&
						aParamsCellule.article.metaMatiere.getNumero() ===
							aParamsCellule.celluleLignePrecedente.article.metaMatiere.getNumero() &&
						!aParamsCellule.article.itemLivretScolaire &&
						!aParamsCellule.celluleLignePrecedente.article.itemLivretScolaire
					);
				default:
					return (
						(aParamsCellule.celluleLignePrecedente.article.periode ||
							(!aParamsCellule.celluleLignePrecedente.article.periode &&
								!aParamsCellule.celluleLignePrecedente.article.derniereligne &&
								!_estCelluleDeploiement(
									aParamsCellule.celluleLignePrecedente,
								))) &&
						!aParamsCellule.article.periode &&
						!_estCelluleDeploiement(aParamsCellule)
					);
			}
		}
	}
	_getContexteColonnes(aParam, aEstRedoublant) {
		const T = [];
		if (!aEstRedoublant) {
			T.push(DonneesListe_FicheLivretScolaire.colonnes.anciennesNotes);
		}
		if (aParam) {
			if (!aParam.avecCompetences) {
				T.push(DonneesListe_FicheLivretScolaire.colonnes.evaluation);
				T.push(DonneesListe_FicheLivretScolaire.colonnes.saisieEval);
			}
			if (!aParam.avecRangEleve) {
				T.push(DonneesListe_FicheLivretScolaire.colonnes.rang);
			}
			if (!aParam.avecMoyenneEleve) {
				T.push(DonneesListe_FicheLivretScolaire.colonnes.moyEleve);
			}
			if (!aParam.avecMoyenneClasse) {
				T.push(DonneesListe_FicheLivretScolaire.colonnes.moyClasse);
			}
			if (!aParam.avecRepartition) {
				T.push(DonneesListe_FicheLivretScolaire.colonnes.inf8);
				T.push(DonneesListe_FicheLivretScolaire.colonnes.de8a12);
				T.push(DonneesListe_FicheLivretScolaire.colonnes.sup12);
			}
			if (!aParam.avecAppreciationsPeriode) {
				T.push(DonneesListe_FicheLivretScolaire.colonnes.appreciation);
			}
			if (!aParam.avecColonneAppreciationsAnnuelles) {
				T.push(DonneesListe_FicheLivretScolaire.colonnes.apprAnnuelle);
			}
		}
		return T;
	}
	static estUneColonneCompetence(aParams) {
		return (
			!!aParams &&
			aParams.idColonne &&
			aParams.idColonne.startsWith(
				DonneesListe_FicheLivretScolaire.colonnes.saisieEval,
			)
		);
	}
}
exports.DonneesListe_FicheLivretScolaire = DonneesListe_FicheLivretScolaire;
(function (DonneesListe_FicheLivretScolaire) {
	let colonnes;
	(function (colonnes) {
		colonnes["regroupement"] = "livretScolaire_regroupement";
		colonnes["discipline"] = "livretScolaire_discipline";
		colonnes["periode"] = "livretScolaire_periode";
		colonnes["anciennesNotes"] = "livretScolaire_anciennesNotes";
		colonnes["rang"] = "livretScolaire_rang";
		colonnes["moyEleve"] = "livretScolaire_moyEleve";
		colonnes["moyClasse"] = "livretScolaire_moyClasse";
		colonnes["inf8"] = "livretScolaire_inf8";
		colonnes["de8a12"] = "livretScolaire_de8a12";
		colonnes["sup12"] = "livretScolaire_sup12";
		colonnes["evaluation"] = "livretScolaire_evaluation";
		colonnes["saisieEval"] = "livretScolaire_saisieEval";
		colonnes["appreciation"] = "livretScolaire_appreciation";
		colonnes["apprAnnuelle"] = "livretScolaire_apprAnnuelle";
		colonnes["jaugeEval"] = "livretScolaire_jaugeEval";
	})(
		(colonnes =
			DonneesListe_FicheLivretScolaire.colonnes ||
			(DonneesListe_FicheLivretScolaire.colonnes = {})),
	);
})(
	DonneesListe_FicheLivretScolaire ||
		(exports.DonneesListe_FicheLivretScolaire =
			DonneesListe_FicheLivretScolaire =
				{}),
);
function _estCelluleDeploiement(aParams) {
	return (
		(aParams.article.avecRegroupement || aParams.article.titreEnseignement) &&
		!aParams.article.periode
	);
}
function _estCelluleCompetence(aParams) {
	if (aParams.declarationColonne.rangColonne !== undefined) {
		return true;
	} else {
		return false;
	}
}
