exports.DonneesListe_Evaluations = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const TypeNote_1 = require("TypeNote");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const ObjetUtilitaireEvaluation_1 = require("ObjetUtilitaireEvaluation");
const TypeModeAssociationDevoirEvaluation_1 = require("TypeModeAssociationDevoirEvaluation");
const AccessApp_1 = require("AccessApp");
class DonneesListe_Evaluations extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParams) {
		super(aDonnees);
		this.etatUtil = (0, AccessApp_1.getApp)().getEtatUtilisateur();
		this.parametres = Object.assign(
			{
				estOngletHistorique: false,
				periode: null,
				ClasseGroupeNiveau: null,
				avecGestionNotation: true,
				avecMenuContextuelCreer: false,
				avecMenuContextuelDupliquer: false,
				callbackMenuContextuel: null,
				afficheUniquementMesEvaluations: false,
				msgCreationEvalImpossible: "",
			},
			aParams,
		);
	}
	setUniquementMesEvaluations(aUniquementMesEvaluations) {
		this.parametres.afficheUniquementMesEvaluations = aUniquementMesEvaluations;
	}
	getTri(aColonneDeTri, aGenreTri) {
		if (aColonneDeTri === null || aColonneDeTri === undefined) {
			return [];
		}
		const lTableau = [];
		switch (this.getId(aColonneDeTri)) {
			case DonneesListe_Evaluations.colonne.periode:
				lTableau.push(
					ObjetTri_1.ObjetTri.init((D) => {
						return D.periode ? D.periode.getLibelle() : "";
					}, aGenreTri),
				);
				break;
			case DonneesListe_Evaluations.colonne.periodeSecondaire:
				lTableau.push(
					ObjetTri_1.ObjetTri.init((D) => {
						return D.periode ? D.periodeSecondaire.getLibelle() : "";
					}, aGenreTri),
				);
				break;
			case DonneesListe_Evaluations.colonne.devoir:
				lTableau.push(
					ObjetTri_1.ObjetTri.init(
						(D) => {
							return !!D.devoir;
						},
						aGenreTri === Enumere_TriElement_1.EGenreTriElement.Croissant
							? Enumere_TriElement_1.EGenreTriElement.Decroissant
							: Enumere_TriElement_1.EGenreTriElement.Croissant,
					),
				);
				break;
			case DonneesListe_Evaluations.colonne.QCM:
				lTableau.push(
					ObjetTri_1.ObjetTri.init(
						(D) => {
							return !!D.executionQCM;
						},
						aGenreTri === Enumere_TriElement_1.EGenreTriElement.Croissant
							? Enumere_TriElement_1.EGenreTriElement.Decroissant
							: Enumere_TriElement_1.EGenreTriElement.Croissant,
					),
				);
				break;
			case DonneesListe_Evaluations.colonne.sujet:
				lTableau.push(
					ObjetTri_1.ObjetTri.init(
						(D) => {
							return !!D.libelleSujet;
						},
						aGenreTri === Enumere_TriElement_1.EGenreTriElement.Croissant
							? Enumere_TriElement_1.EGenreTriElement.Decroissant
							: Enumere_TriElement_1.EGenreTriElement.Croissant,
					),
				);
				break;
			case DonneesListe_Evaluations.colonne.corrige:
				lTableau.push(
					ObjetTri_1.ObjetTri.init(
						(D) => {
							return !!D.libelleCorrige;
						},
						aGenreTri === Enumere_TriElement_1.EGenreTriElement.Croissant
							? Enumere_TriElement_1.EGenreTriElement.Decroissant
							: Enumere_TriElement_1.EGenreTriElement.Croissant,
					),
				);
				break;
			case DonneesListe_Evaluations.colonne.resultats:
				lTableau.push(
					ObjetTri_1.ObjetTri.init(
						(D) => {
							return D.moyenneResultats && D.moyenneResultats.estUneValeur()
								? D.moyenneResultats.getValeur()
								: 0;
						},
						aGenreTri === Enumere_TriElement_1.EGenreTriElement.Croissant
							? Enumere_TriElement_1.EGenreTriElement.Decroissant
							: Enumere_TriElement_1.EGenreTriElement.Croissant,
					),
				);
				break;
			case DonneesListe_Evaluations.colonne.nbSaisi:
				lTableau.push(
					ObjetTri_1.ObjetTri.init(
						(D) => {
							return D.nbSaisiCompetences;
						},
						aGenreTri === Enumere_TriElement_1.EGenreTriElement.Croissant
							? Enumere_TriElement_1.EGenreTriElement.Decroissant
							: Enumere_TriElement_1.EGenreTriElement.Croissant,
					),
				);
				break;
			default:
				lTableau.push(
					ObjetTri_1.ObjetTri.init(
						this.getValeurPourTri.bind(this, aColonneDeTri),
						aGenreTri,
					),
				);
				break;
		}
		lTableau.push(
			ObjetTri_1.ObjetTri.init(
				this.getValeurPourTri.bind(
					this,
					this.getNumeroColonneDId(DonneesListe_Evaluations.colonne.intitule),
				),
			),
		);
		lTableau.push(
			ObjetTri_1.ObjetTri.init(
				this.getValeurPourTri.bind(
					this,
					this.getNumeroColonneDId(DonneesListe_Evaluations.colonne.date),
				),
			),
		);
		lTableau.push(
			ObjetTri_1.ObjetTri.init(
				this.getValeurPourTri.bind(
					this,
					this.getNumeroColonneDId(DonneesListe_Evaluations.colonne.classe),
				),
			),
		);
		lTableau.push(
			ObjetTri_1.ObjetTri.init(
				this.getValeurPourTri.bind(
					this,
					this.getNumeroColonneDId(DonneesListe_Evaluations.colonne.infos),
				),
			),
		);
		lTableau.push(
			ObjetTri_1.ObjetTri.init(
				this.getValeurPourTri.bind(
					this,
					this.getNumeroColonneDId(DonneesListe_Evaluations.colonne.nbSaisi),
				),
			),
		);
		lTableau.push(
			ObjetTri_1.ObjetTri.init((A) => {
				return A.getNumero();
			}),
		);
		return lTableau;
	}
	surCreation(D, V) {
		D.Libelle = V[DonneesListe_Evaluations.colonne.intitule];
		D.dateValidation = V[DonneesListe_Evaluations.colonne.date];
		D.descriptif = V[DonneesListe_Evaluations.colonne.periode];
	}
	surEdition(aParams, V) {
		if (this.parametres.estOngletHistorique) {
			switch (aParams.idColonne) {
				case DonneesListe_Evaluations.colonne.coefficient:
					if (!V.estUneNoteVide()) {
						aParams.article.coefficient = V.getValeur();
						aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
					break;
			}
		}
	}
	avecEditionApresSelection() {
		return true;
	}
	autoriserChaineVideSurEdition(aParams) {
		return aParams.idColonne === DonneesListe_Evaluations.colonne.descriptif;
	}
	avecEdition(aParams) {
		let result = false;
		if (this.parametres.estOngletHistorique) {
			result =
				!!aParams.article &&
				aParams.article.avecSaisie &&
				[DonneesListe_Evaluations.colonne.coefficient].includes(
					aParams.idColonne,
				);
		} else {
			result =
				!!aParams.article &&
				aParams.article.avecSaisie &&
				!ObjetUtilitaireEvaluation_1.ObjetUtilitaireEvaluation.estSurPeriodeClotureePourSaisieCompetences(
					aParams.article,
				) &&
				![
					DonneesListe_Evaluations.colonne.nombre,
					DonneesListe_Evaluations.colonne.devoir,
					DonneesListe_Evaluations.colonne.QCM,
					DonneesListe_Evaluations.colonne.classe,
					DonneesListe_Evaluations.colonne.palier,
					DonneesListe_Evaluations.colonne.resultats,
					DonneesListe_Evaluations.colonne.nbSaisi,
				].includes(aParams.idColonne);
			if (
				result &&
				aParams.idColonne === DonneesListe_Evaluations.colonne.infos
			) {
				result = [
					Enumere_Espace_1.EGenreEspace.Professeur,
					Enumere_Espace_1.EGenreEspace.PrimProfesseur,
					Enumere_Espace_1.EGenreEspace.PrimDirection,
				].includes(this.etatUtil.GenreEspace);
			}
		}
		return result;
	}
	avecSuppression(aParams) {
		return (
			!!aParams.article &&
			aParams.article.avecSaisie &&
			!ObjetUtilitaireEvaluation_1.ObjetUtilitaireEvaluation.estSurPeriodeClotureePourSaisieCompetences(
				aParams.article,
			) &&
			!this.parametres.estOngletHistorique
		);
	}
	avecEtatSaisie() {
		return this.parametres.estOngletHistorique;
	}
	avecContenuTronque() {
		return true;
	}
	avecEvenementCreation() {
		return true;
	}
	avecEvenementEdition(aParams) {
		let result = false;
		if (!this.parametres.estOngletHistorique) {
			result =
				!!aParams.article &&
				aParams.article.avecSaisie &&
				!ObjetUtilitaireEvaluation_1.ObjetUtilitaireEvaluation.estSurPeriodeClotureePourSaisieCompetences(
					aParams.article,
				);
		}
		return result;
	}
	avecEvenementApresEdition() {
		return false;
	}
	avecEvenementSelection() {
		return true;
	}
	avecEvenementSuppression() {
		return !this.parametres.estOngletHistorique;
	}
	avecEvenementApresSuppression() {
		return this.avecEvenementSuppression();
	}
	getVisible(D) {
		if (this.parametres.estOngletHistorique) {
			if (
				D.getGenre() !==
				Enumere_Ressource_1.EGenreRessource.EvaluationHistorique
			) {
				return false;
			}
			return (
				!!this.parametres.periode &&
				!!this.parametres.periode.dateDebut &&
				D.dateValidation >= this.parametres.periode.dateDebut &&
				!!this.parametres.periode.dateFin &&
				D.dateValidation <= this.parametres.periode.dateFin
			);
		}
		const lPeriodeNotation = !!this.parametres.periode
			? this.parametres.periode.periodeNotation
			: this.etatUtil.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Periode,
				);
		if (!!lPeriodeNotation) {
			if (
				!DonneesListe_Evaluations.estDansMaPeriodeNotation(lPeriodeNotation, D)
			) {
				return false;
			}
		}
		if (
			this.parametres.ClasseGroupeNiveau &&
			D.listeClasseGroupeNivPourFiltre
		) {
			const lEstDansMonFiltre =
				D.listeClasseGroupeNivPourFiltre.getElementParElement(
					this.parametres.ClasseGroupeNiveau,
				);
			if (!lEstDansMonFiltre) {
				return false;
			}
		}
		return true;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Evaluations.colonne.intitule:
				return aParams.article.getLibelle();
			case DonneesListe_Evaluations.colonne.nombre:
				return aParams.article.listeCompetences
					? aParams.article.listeCompetences.getNbrElementsExistes()
					: "";
			case DonneesListe_Evaluations.colonne.themes:
				return aParams.article.ListeThemes &&
					aParams.article.ListeThemes.count()
					? aParams.article.ListeThemes.getTableauLibelles().join(", ")
					: "";
			case DonneesListe_Evaluations.colonne.devoir:
				return !!aParams.article.devoir &&
					(!!aParams.article.executionQCM ||
						[
							TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE
								.tMIADE_Creation,
							TypeModeAssociationDevoirEvaluation_1.TypeModeInfosADE
								.tMIADE_Modification,
						].includes(aParams.article.devoir.modeAssociation))
					? aParams.article.devoir.estVerrouille ||
						aParams.article.devoir.estCloture
						? "Image_VerrouFait"
						: "Image_CocheVerte as-icon"
					: "";
			case DonneesListe_Evaluations.colonne.QCM:
				return !!aParams.article.executionQCM;
			case DonneesListe_Evaluations.colonne.classe:
				return this.parametres.estOngletHistorique
					? aParams.article.niveau
						? aParams.article.niveau.getLibelle()
						: ""
					: aParams.article.classe
						? aParams.article.classe.getLibelle()
						: "";
			case DonneesListe_Evaluations.colonne.infos:
				return aParams.article.informations ? aParams.article.informations : "";
			case DonneesListe_Evaluations.colonne.palier:
				return aParams.article.listePaliers
					? aParams.article.listePaliers.getTableauLibelles().join(", ")
					: "";
			case DonneesListe_Evaluations.colonne.date:
				return aParams.article.dateValidation;
			case DonneesListe_Evaluations.colonne.periode:
				return aParams.article.periode
					? !aParams.article.periodeCloturee
						? aParams.article.periode.getLibelle()
						: '<div class="NoWrap"><div class="InlineBlock Image_Dll_VerrouPetit" style="margin-right:2px;"></div><label>' +
							aParams.article.periode.getLibelle() +
							"</label></div>"
					: "";
			case DonneesListe_Evaluations.colonne.periodeSecondaire:
				return aParams.article.periodeSecondaire
					? !aParams.article.periodeSecondaireCloturee
						? aParams.article.periodeSecondaire.getLibelle()
						: '<div class="NoWrap"><div class="InlineBlock Image_Dll_VerrouPetit" style="margin-right:2px;"></div><label>' +
							aParams.article.periodeSecondaire.getLibelle() +
							"</label></div>"
					: "";
			case DonneesListe_Evaluations.colonne.publie:
				return aParams.article.datePublication;
			case DonneesListe_Evaluations.colonne.coefficient:
				return aParams.article.coefficient !== undefined &&
					aParams.article.coefficient !== null
					? new TypeNote_1.TypeNote(aParams.article.coefficient)
					: null;
			case DonneesListe_Evaluations.colonne.descriptif:
				return aParams.article.descriptif;
			case DonneesListe_Evaluations.colonne.sujet:
				return aParams.article.libelleSujet
					? '<div class="Image_Trombone" title="' +
							aParams.article.libelleSujet +
							'" style="margin:0 auto;"></div>'
					: "";
			case DonneesListe_Evaluations.colonne.corrige:
				return aParams.article.libelleCorrige
					? '<div class="Image_Trombone" title="' +
							aParams.article.libelleCorrige +
							'" style="margin:0 auto;"></div>'
					: "";
			case DonneesListe_Evaluations.colonne.resultats:
				return UtilitaireCompetences_1.TUtilitaireCompetences.composeJaugeParNiveaux(
					{
						listeNiveaux: aParams.article.resultats,
						hint: aParams.article.hintResultats,
					},
				);
			case DonneesListe_Evaluations.colonne.nbSaisi:
				return (
					aParams.article.nbSaisiCompetences +
					" / " +
					aParams.article.nbTotalCompetencesASaisir
				);
			case DonneesListe_Evaluations.colonne.estDansBilan:
				return aParams.article.priseEnCompteDansBilan;
		}
		return "";
	}
	getTooltip(aParams) {
		if (aParams.idColonne === DonneesListe_Evaluations.colonne.nombre) {
			return aParams.article.nombreHint
				? ObjetChaine_1.GChaine.replaceRCToHTML(aParams.article.nombreHint)
				: "";
		} else if (aParams.idColonne === DonneesListe_Evaluations.colonne.devoir) {
			return !!aParams.article.devoir
				? aParams.article.devoir.hintDevoir || ""
				: "";
		}
	}
	getValeurPourAffichage(aParams) {
		if (aParams.idColonne === DonneesListe_Evaluations.colonne.descriptif) {
			return aParams.article.descriptif.replace(/\n/g, " ");
		}
		return this.getValeur(aParams);
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Evaluations.colonne.nombre:
			case DonneesListe_Evaluations.colonne.themes:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
			case DonneesListe_Evaluations.colonne.devoir:
			case DonneesListe_Evaluations.colonne.QCM:
			case DonneesListe_Evaluations.colonne.estDansBilan:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
			case DonneesListe_Evaluations.colonne.date:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule
					.DateCalendrier;
			case DonneesListe_Evaluations.colonne.intitule:
			case DonneesListe_Evaluations.colonne.descriptif:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.ZoneTexte;
			case DonneesListe_Evaluations.colonne.periode:
			case DonneesListe_Evaluations.colonne.periodeSecondaire:
			case DonneesListe_Evaluations.colonne.resultats:
			case DonneesListe_Evaluations.colonne.sujet:
			case DonneesListe_Evaluations.colonne.corrige:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_Evaluations.colonne.publie:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Date;
			case DonneesListe_Evaluations.colonne.coefficient:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Note;
			default:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
		}
	}
	getClass(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Evaluations.colonne.nombre:
			case DonneesListe_Evaluations.colonne.coefficient:
				return "AlignementDroit";
			default:
				return "";
		}
	}
	getMessageSuppressionConfirmation(D) {
		return D.avecEvaluation
			? ObjetTraduction_1.GTraductions.getValeur(
					"competences.message.ConfirmationSuppression",
				)
			: ObjetTraduction_1.GTraductions.getValeur("liste.suppressionSelection");
	}
	avecMenuContextuel(aParametres) {
		const lAvecCreer = this.parametres.avecMenuContextuelCreer;
		const lAvecModifier =
			this.avecEdition(aParametres) && !aParametres.nonEditable;
		const lAvecDupliquer =
			!!aParametres.article && !!this.parametres.avecMenuContextuelDupliquer;
		const lAvecSupprimer =
			this.avecSuppression(aParametres) && !aParametres.nonEditable;
		return lAvecCreer || lAvecModifier || lAvecDupliquer || lAvecSupprimer;
	}
	remplirMenuContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		if (this.parametres.avecMenuContextuelCreer) {
			aParametres.menuContextuel.addCommande(
				DonneesListe_Evaluations.commandeMenuContextuel.creer,
				ObjetTraduction_1.GTraductions.getValeur("liste.creer"),
			);
		}
		const lAvecModifier =
			this.avecEdition(aParametres) && !aParametres.nonEditable;
		aParametres.menuContextuel.addCommande(
			DonneesListe_Evaluations.commandeMenuContextuel.modifier,
			ObjetTraduction_1.GTraductions.getValeur("liste.modifier"),
			lAvecModifier,
		);
		if (!!this.parametres.avecMenuContextuelDupliquer) {
			let lLibelleCommandeDupliquer = ObjetTraduction_1.GTraductions.getValeur(
				"competences.Dupliquer",
			);
			if (this.parametres.estOngletHistorique) {
				lLibelleCommandeDupliquer = ObjetTraduction_1.GTraductions.getValeur(
					"evaluations.DupliquerSurLAnneeEnCours",
				);
			} else if (this.etatUtil.pourPrimaire()) {
				lLibelleCommandeDupliquer = ObjetTraduction_1.GTraductions.getValeur(
					"competences.DupliquerSurMaClasse",
				);
			}
			aParametres.menuContextuel.addCommande(
				DonneesListe_Evaluations.commandeMenuContextuel.dupliquer,
				lLibelleCommandeDupliquer,
				!!aParametres.article,
			);
		}
		const lAvecSupprimer =
			this.avecSuppression(aParametres) && !aParametres.nonEditable;
		aParametres.menuContextuel.addCommande(
			DonneesListe_Evaluations.commandeMenuContextuel.supprimer,
			ObjetTraduction_1.GTraductions.getValeur("liste.supprimer"),
			lAvecSupprimer,
		);
	}
	evenementMenuContextuel(aParametres) {
		if (!!this.parametres.callbackMenuContextuel) {
			this.parametres.callbackMenuContextuel(
				aParametres.numeroMenu,
				aParametres.article,
			);
		}
		return false;
	}
	initialiserObjetGraphique(aParams, aInstance) {
		aInstance.setParametres(
			GParametres.PremierLundi,
			GParametres.PremiereDate,
			GParametres.DerniereDate,
			GParametres.JoursOuvres,
			null,
			GParametres.JoursFeries,
		);
	}
	setDonneesObjetGraphique(aParams, aInstance) {
		aInstance.setDonnees(aParams.article.dateValidation);
	}
	getOptionsNote() {
		return {
			avecVirgule: false,
			afficherAvecVirgule: false,
			listeAnnotations: [],
			sansNotePossible: false,
		};
	}
}
exports.DonneesListe_Evaluations = DonneesListe_Evaluations;
DonneesListe_Evaluations.estDansMaPeriodeNotation = (aPeriode, aElement) => {
	return [
		aElement.periode.getNumero(),
		aElement.periodeSecondaire.getNumero(),
	].includes(aPeriode.getNumero());
};
(function (DonneesListe_Evaluations) {
	let colonne;
	(function (colonne) {
		colonne["intitule"] = "col_Intitule";
		colonne["palier"] = "col_Palier";
		colonne["themes"] = "col_Themes";
		colonne["nombre"] = "col_Nombre";
		colonne["devoir"] = "col_Devoir";
		colonne["QCM"] = "col_QCM";
		colonne["date"] = "col_Date";
		colonne["classe"] = "col_Classe";
		colonne["infos"] = "col_Infos";
		colonne["periode"] = "col_Periode";
		colonne["periodeSecondaire"] = "col_PeriodeSecondaire";
		colonne["publie"] = "col_Publie";
		colonne["descriptif"] = "col_Descriptif";
		colonne["sujet"] = "col_Sujet";
		colonne["corrige"] = "col_corrige";
		colonne["coefficient"] = "col_coefficient";
		colonne["resultats"] = "col_resultats";
		colonne["nbSaisi"] = "col_nbSaisi";
		colonne["estDansBilan"] = "col_estDansBilan";
	})(
		(colonne =
			DonneesListe_Evaluations.colonne ||
			(DonneesListe_Evaluations.colonne = {})),
	);
	let commandeMenuContextuel;
	(function (commandeMenuContextuel) {
		commandeMenuContextuel["creer"] = "cmdMenu_creation";
		commandeMenuContextuel["modifier"] = "cmdMenu_edition";
		commandeMenuContextuel["dupliquer"] = "cmd_MenuContextuel_Dupliquer";
		commandeMenuContextuel["supprimer"] = "cmdMenu_suppression";
	})(
		(commandeMenuContextuel =
			DonneesListe_Evaluations.commandeMenuContextuel ||
			(DonneesListe_Evaluations.commandeMenuContextuel = {})),
	);
})(
	DonneesListe_Evaluations ||
		(exports.DonneesListe_Evaluations = DonneesListe_Evaluations = {}),
);
