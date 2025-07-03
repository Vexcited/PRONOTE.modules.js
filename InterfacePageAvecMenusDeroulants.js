exports.ObjetAffichagePageAvecMenusDeroulants = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Callback_1 = require("Callback");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Saisie_1 = require("Enumere_Saisie");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ObjetWAI_1 = require("ObjetWAI");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_EvntMenusDeroulants_1 = require("Enumere_EvntMenusDeroulants");
const Enumere_Message_1 = require("Enumere_Message");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetRequeteListeServices_1 = require("ObjetRequeteListeServices");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const TypeCategorieCompetence_1 = require("TypeCategorieCompetence");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetRequeteListes_1 = require("ObjetRequeteListes");
const TypeOptionsPublication_1 = require("TypeOptionsPublication");
var EGenreClasse;
(function (EGenreClasse) {
	EGenreClasse[(EGenreClasse["principal"] = 0)] = "principal";
	EGenreClasse[(EGenreClasse["enseigne"] = 1)] = "enseigne";
	EGenreClasse[(EGenreClasse["autre"] = 2)] = "autre";
})(EGenreClasse || (EGenreClasse = {}));
class ObjetAffichagePageAvecMenusDeroulants extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.delaiFermetureCombo = 200;
		this.classDiv = "ObjetAffichagePageAvecMenusDeroulants_divPrimaire";
		this.ControleNavigation = true;
	}
	setEvenementMenusDeroulants(aEvenement) {
		this.callbackMenusDeroulants = new Callback_1.Callback(
			this.Pere,
			aEvenement,
		);
	}
	setParametres(ATabGenreCombo, aAvecGroupe = false) {
		this.TabGenreCombo = ATabGenreCombo;
		this.avecRessource = [];
		this.avecRessource[Enumere_Ressource_1.EGenreRessource.Groupe] =
			aAvecGroupe;
		for (let I = 0; I < this.TabGenreCombo.length; I++) {
			this.avecRessource[this.TabGenreCombo[I]] = true;
		}
		this.genreSuivant = [];
		for (let I = 0; I < this.TabGenreCombo.length - 1; I++) {
			this.genreSuivant[this.TabGenreCombo[I]] = this.TabGenreCombo[I + 1];
		}
		this.avecServiceClasse = ![
			Enumere_Onglet_1.EGenreOnglet.BilanParDomaine,
			Enumere_Onglet_1.EGenreOnglet.CompetencesNumeriques,
		].includes(this.etatUtilisateurSco.getGenreOnglet());
		this.avecServiceProfesseur = !this.etatUtilisateurSco.pourPrimaire();
		this.avecDeLaClasse =
			[
				Enumere_Onglet_1.EGenreOnglet.BulletinCompetences,
				Enumere_Onglet_1.EGenreOnglet.NiveauxDeMaitriseParMatiere,
				Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsClasse,
				Enumere_Onglet_1.EGenreOnglet.PlanningParSemaine_Classe,
				Enumere_Onglet_1.EGenreOnglet.PlanningParRessource_Classe,
				Enumere_Onglet_1.EGenreOnglet.ParcoursEducatif_Bulletin,
				Enumere_Onglet_1.EGenreOnglet.ParcoursEducatif_BullCompetence,
				Enumere_Onglet_1.EGenreOnglet.BilanFinDeCycle,
				Enumere_Onglet_1.EGenreOnglet.RecapitulatifExportLSU,
				Enumere_Onglet_1.EGenreOnglet.CompetencesNumeriques,
				Enumere_Onglet_1.EGenreOnglet.SuiviResultatsCompetences,
			].includes(this.etatUtilisateurSco.getGenreOnglet()) ||
			([Enumere_Onglet_1.EGenreOnglet.Bulletins].includes(
				this.etatUtilisateurSco.getGenreOnglet(),
			) &&
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionBulletinClasse,
				));
		this.avecToutesLesLVE = [
			Enumere_Onglet_1.EGenreOnglet.BilanParDomaine,
			Enumere_Onglet_1.EGenreOnglet.CompetencesNumeriques,
		].includes(this.etatUtilisateurSco.getGenreOnglet());
		this.avecToutesLesMatieres =
			this.etatUtilisateurSco.GenreEspace !==
			Enumere_Espace_1.EGenreEspace.Academie;
		this.avecMesServices =
			[
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
			].includes(this.etatUtilisateurSco.GenreEspace) &&
			[
				Enumere_Onglet_1.EGenreOnglet.SaisieNotes,
				Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsReleve,
				Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsBulletin,
				Enumere_Onglet_1.EGenreOnglet.Evaluation,
				Enumere_Onglet_1.EGenreOnglet.ReleveEvaluationsParService,
				Enumere_Onglet_1.EGenreOnglet.SaisieAvisProfesseur,
				Enumere_Onglet_1.EGenreOnglet.SaisieAvisParcoursup,
			].includes(this.etatUtilisateurSco.getGenreOnglet());
		this.combosAMasquer = [];
		if (
			[
				Enumere_Onglet_1.EGenreOnglet.Competences_GrillesCompetencesNumeriques,
				Enumere_Onglet_1.EGenreOnglet.CompetencesNumeriques,
			].includes(this.etatUtilisateurSco.getGenreOnglet())
		) {
			this.combosAMasquer.push(Enumere_Ressource_1.EGenreRessource.Palier);
		}
		this.afficherHorsLivret = [
			Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche,
			Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Appreciations,
		].includes(this.etatUtilisateurSco.getGenreOnglet());
		const lDonneesRequeteAvecPeriode = [
			Enumere_Onglet_1.EGenreOnglet.Bulletins,
			Enumere_Onglet_1.EGenreOnglet.SaisieNotes,
			Enumere_Onglet_1.EGenreOnglet.Releve,
			Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsBulletin,
			Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsGenerales,
			Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsGenerales_Competences,
			Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsReleve,
			Enumere_Onglet_1.EGenreOnglet.ConseilDeClasse,
			Enumere_Onglet_1.EGenreOnglet.TrombinoscopeClasse,
			Enumere_Onglet_1.EGenreOnglet.ResultatsClasses,
			Enumere_Onglet_1.EGenreOnglet.Dossiers,
			Enumere_Onglet_1.EGenreOnglet.NiveauxDeMaitriseParMatiere,
			Enumere_Onglet_1.EGenreOnglet.ParcoursEducatif_Bulletin,
			Enumere_Onglet_1.EGenreOnglet.ParcoursEducatif_BullCompetence,
			Enumere_Onglet_1.EGenreOnglet.Graphique_Profil,
			Enumere_Onglet_1.EGenreOnglet.RecapitulatifExportLSU,
			Enumere_Onglet_1.EGenreOnglet.ReleveEvaluationsParService,
			Enumere_Onglet_1.EGenreOnglet.Evaluation,
			Enumere_Onglet_1.EGenreOnglet.BulletinCompetences,
			Enumere_Onglet_1.EGenreOnglet.SaisieAvisProfesseur,
			Enumere_Onglet_1.EGenreOnglet.SuiviResultatsCompetences,
			Enumere_Onglet_1.EGenreOnglet.BilanCompetencesParMatiere,
		].includes(this.etatUtilisateurSco.getGenreOnglet());
		const lAvecUniquementStagiaire =
			[Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationDeFinDeStage].includes(
				this.etatUtilisateurSco.getGenreOnglet(),
			) &&
			[Enumere_Espace_1.EGenreEspace.Etablissement].includes(
				this.etatUtilisateurSco.GenreEspace,
			);
		this.donneesRequete = {
			avecProfesseur: true,
			avecPalier: true,
			avecClasse: true,
			avecPeriode: lDonneesRequeteAvecPeriode,
			avecService: true,
			avecEleve: [
				Enumere_Onglet_1.EGenreOnglet.BilanParDomaine,
				Enumere_Onglet_1.EGenreOnglet.CompetencesNumeriques,
			].includes(this.etatUtilisateurSco.getGenreOnglet()),
			avecPilier: [
				Enumere_Onglet_1.EGenreOnglet.BilanParDomaine,
				Enumere_Onglet_1.EGenreOnglet.CompetencesNumeriques,
			].includes(this.etatUtilisateurSco.getGenreOnglet()),
			avecUniquementStagiaire: lAvecUniquementStagiaire,
		};
		this.construireInstancesDynamiques();
		this.IdPremierElement = this.getInstance(
			this.getIdentCombo(this.TabGenreCombo[0]),
		).getPremierElement();
	}
	modifierSelection(aGenreRessource, aListeSelections) {
		const lCombo = this.getInstance(this.getIdentCombo(aGenreRessource));
		if (
			!lCombo &&
			aGenreRessource === Enumere_Ressource_1.EGenreRessource.Groupe
		) {
			return this.modifierSelection(
				Enumere_Ressource_1.EGenreRessource.Classe,
				aListeSelections,
			);
		}
		if (
			lCombo &&
			lCombo.getListeElements() &&
			aListeSelections &&
			aListeSelections.count
		) {
			this.etatUtilisateurSco.Navigation.setRessource(
				aGenreRessource,
				aListeSelections,
			);
			this._remplirCombo(lCombo.getListeElements(), aGenreRessource);
		} else {
		}
	}
	recupererDonnees() {
		if (this.TabGenreCombo) {
			switch (this.TabGenreCombo[0]) {
				case Enumere_Ressource_1.EGenreRessource.Palier:
					this.requeteListePaliers();
					break;
				case Enumere_Ressource_1.EGenreRessource.Classe:
					this.requeteListeClassesEtGroupes();
					break;
				case Enumere_Ressource_1.EGenreRessource.Salle:
					this.requeteListeSalles();
					break;
				case Enumere_Ressource_1.EGenreRessource.Enseignant:
					this.requeteListeProfesseurs();
					break;
				case Enumere_Ressource_1.EGenreRessource.Personnel:
					new ObjetRequeteListes_1.ObjetRequeteListes_ListePersonnels(this)
						.lancerRequete(this.donneesRequete)
						.then((aJSON) => {
							this.actionSurRequeteListePersonnels(aJSON);
						});
					break;
				case Enumere_Ressource_1.EGenreRessource.Materiel:
					new ObjetRequeteListes_1.ObjetRequeteListes_ListeMateriels(this)
						.lancerRequete(this.donneesRequete)
						.then((aJSON) => {
							this._actionSurRequeteListeMateriels(aJSON);
						});
					break;
				case Enumere_Ressource_1.EGenreRessource.Matiere:
					this._requeteListeMatiere();
					break;
				case Enumere_Ressource_1.EGenreRessource.Periode:
					this.requeteListePeriodes();
					break;
			}
			this.getInstance(
				this.getIdentCombo(this.TabGenreCombo[0]),
			).focusSurPremierElement();
		}
	}
	construireInstancesDynamiques() {
		for (let I = 0; I < this.TabGenreCombo.length; I++) {
			switch (this.TabGenreCombo[I]) {
				case Enumere_Ressource_1.EGenreRessource.Classe:
					this.IdentComboClasse = this._creerCombo(
						Enumere_Ressource_1.EGenreRessource.Classe,
						this._getLargeurComboClasse(),
						this._getOptionsComboClasse(),
					);
					break;
				case Enumere_Ressource_1.EGenreRessource.Matiere:
					this.IdentComboMatiere = this._creerCombo(
						Enumere_Ressource_1.EGenreRessource.Matiere,
						this.etatUtilisateurSco.getGenreOnglet() ===
							Enumere_Onglet_1.EGenreOnglet.RessourcePedagogique_Partage
							? 400
							: 150,
						this._getOptionsComboMatiere(),
					);
					break;
				case Enumere_Ressource_1.EGenreRessource.Periode:
					this.IdentComboPeriode = this._creerCombo(
						Enumere_Ressource_1.EGenreRessource.Periode,
						180,
					);
					break;
				case Enumere_Ressource_1.EGenreRessource.Pilier:
					this.identComboPilierDeCompetence = this._creerCombo(
						Enumere_Ressource_1.EGenreRessource.Pilier,
						225,
						this._getOptionsComboPilier(),
					);
					break;
				case Enumere_Ressource_1.EGenreRessource.Service:
					this.IdentComboService = this._creerCombo(
						Enumere_Ressource_1.EGenreRessource.Service,
						this._getLargeurComboService(),
						this._getOptionsComboService(),
					);
					break;
				case Enumere_Ressource_1.EGenreRessource.Eleve:
					this.IdentComboEleve = this._creerCombo(
						Enumere_Ressource_1.EGenreRessource.Eleve,
						200,
						this._getOptionsComboEleve(),
					);
					break;
				case Enumere_Ressource_1.EGenreRessource.Competence:
					this.IdentComboCompetence = this._creerCombo(
						Enumere_Ressource_1.EGenreRessource.Competence,
						300,
						this._getOptionsComboCompetence(),
					);
					break;
				case Enumere_Ressource_1.EGenreRessource.Appreciation:
					this.IdentComboAppreciation = this._creerCombo(
						Enumere_Ressource_1.EGenreRessource.Appreciation,
						250,
						{
							getClassElement: function (aParams) {
								return aParams.element.estUneRubrique
									? "titre-liste liste-fond-cumul"
									: "";
							},
						},
					);
					break;
				case Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire:
					this.IdentComboDisciplineLivret = this._creerCombo(
						Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire,
						500,
					);
					break;
				case Enumere_Ressource_1.EGenreRessource.Palier:
					this.identComboPalier = this._creerCombo(
						Enumere_Ressource_1.EGenreRessource.Palier,
						180,
					);
					break;
				case Enumere_Ressource_1.EGenreRessource.Salle:
					this.identComboSalle = this._creerCombo(
						Enumere_Ressource_1.EGenreRessource.Salle,
						200,
						{
							mode: Enumere_Saisie_1.EGenreSaisie.Combo,
							multiSelection:
								GEtatUtilisateur.getGenreOnglet() ===
								Enumere_Onglet_1.EGenreOnglet.PlanningParRessource_Salle,
							getClassElement: function (aParams) {
								return aParams.element.liste ? "element-distinct" : "";
							},
						},
					);
					break;
				case Enumere_Ressource_1.EGenreRessource.Enseignant:
					this.identComboProfesseur = this._creerCombo(
						Enumere_Ressource_1.EGenreRessource.Enseignant,
						200,
						{
							mode: Enumere_Saisie_1.EGenreSaisie.Combo,
							multiSelection:
								GEtatUtilisateur.getGenreOnglet() ===
								Enumere_Onglet_1.EGenreOnglet.PlanningParRessource_Professeur,
						},
					);
					break;
				case Enumere_Ressource_1.EGenreRessource.Personnel:
					this.identComboPersonnel = this._creerCombo(
						Enumere_Ressource_1.EGenreRessource.Personnel,
						200,
						{
							mode: Enumere_Saisie_1.EGenreSaisie.Combo,
							multiSelection:
								GEtatUtilisateur.getGenreOnglet() ===
								Enumere_Onglet_1.EGenreOnglet
									.PlanningParRessource_PersonnelEtablissement,
						},
					);
					break;
				case Enumere_Ressource_1.EGenreRessource.Materiel:
					this.identComboMateriel = this._creerCombo(
						Enumere_Ressource_1.EGenreRessource.Materiel,
						200,
						{
							mode: Enumere_Saisie_1.EGenreSaisie.Combo,
							multiSelection:
								GEtatUtilisateur.getGenreOnglet() ===
								Enumere_Onglet_1.EGenreOnglet.PlanningParRessource_Materiel,
						},
					);
					break;
			}
		}
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.AvecCadre = false;
	}
	construireStructureAffichageAutre() {
		const H = [];
		let lObjetGraphique;
		H.push(
			'<div class="' + this.classDiv + '" ',
			ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Presentation),
			">",
		);
		for (let I = 0; I < this.NombreGenreAffichage; I++) {
			lObjetGraphique = this.getObjetGraphique(this.GenreAffichage[I]);
			if (lObjetGraphique && !lObjetGraphique.estFenetre) {
				H.push(
					'<div id="',
					this.getZoneId(I),
					'" class="shrink-bloc" style="visibility:hidden;"></div>',
				);
			}
		}
		H.push("</div>");
		return H.join("");
	}
	setVisible() {
		ObjetStyle_1.GStyle.setVisible(
			this.getNomInstance(this.getIdentCombo(this.TabGenreCombo[0])),
			false,
		);
	}
	masquerCombos(AGenreRessource) {
		let LMasquer = false;
		for (let I = 0; I < this.TabGenreCombo.length; I++) {
			if (LMasquer) {
				ObjetStyle_1.GStyle.setVisible(
					this.getNomInstance(this.getIdentCombo(this.TabGenreCombo[I])),
					false,
				);
			}
			if (this.TabGenreCombo[I] === AGenreRessource) {
				LMasquer = true;
			}
		}
	}
	afficherCombo(aGenreRessource, aDisplay) {
		if (this.getIdentCombo(aGenreRessource) !== undefined) {
			ObjetStyle_1.GStyle.setDisplay(
				this.getNomInstance(this.getIdentCombo(aGenreRessource)),
				aDisplay,
			);
		}
	}
	getIdentCombo(AGenreRessource) {
		switch (AGenreRessource) {
			case Enumere_Ressource_1.EGenreRessource.Classe:
				return this.IdentComboClasse;
			case Enumere_Ressource_1.EGenreRessource.Matiere:
				return this.IdentComboMatiere;
			case Enumere_Ressource_1.EGenreRessource.Periode:
				return this.IdentComboPeriode;
			case Enumere_Ressource_1.EGenreRessource.Pilier:
				return this.identComboPilierDeCompetence;
			case Enumere_Ressource_1.EGenreRessource.Service:
				return this.IdentComboService;
			case Enumere_Ressource_1.EGenreRessource.Eleve:
				return this.IdentComboEleve;
			case Enumere_Ressource_1.EGenreRessource.Competence:
				return this.IdentComboCompetence;
			case Enumere_Ressource_1.EGenreRessource.Appreciation:
				return this.IdentComboAppreciation;
			case Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire:
				return this.IdentComboDisciplineLivret;
			case Enumere_Ressource_1.EGenreRessource.Palier:
				return this.identComboPalier;
			case Enumere_Ressource_1.EGenreRessource.Salle:
				return this.identComboSalle;
			case Enumere_Ressource_1.EGenreRessource.Enseignant:
				return this.identComboProfesseur;
			case Enumere_Ressource_1.EGenreRessource.Personnel:
				return this.identComboPersonnel;
			case Enumere_Ressource_1.EGenreRessource.Materiel:
				return this.identComboMateriel;
			default:
				return null;
		}
	}
	getMessageSelection(AGenreRessource) {
		switch (AGenreRessource) {
			case Enumere_Ressource_1.EGenreRessource.Classe:
				return !(this.AvecClasse && this.AvecGroupe)
					? !this.AvecClasse
						? !this.AvecGroupe
							? Enumere_Message_1.EGenreMessage.SelectionClasseOuGroupe
							: Enumere_Message_1.EGenreMessage.SelectionGroupe
						: Enumere_Message_1.EGenreMessage.SelectionClasse
					: Enumere_Message_1.EGenreMessage.SelectionClasseOuGroupe;
			case Enumere_Ressource_1.EGenreRessource.Matiere:
				return Enumere_Message_1.EGenreMessage.SelectionMatiere;
			case Enumere_Ressource_1.EGenreRessource.Periode:
				return Enumere_Message_1.EGenreMessage.SelectionPeriode;
			case Enumere_Ressource_1.EGenreRessource.Pilier:
				return Enumere_Message_1.EGenreMessage.SelectionPilier;
			case Enumere_Ressource_1.EGenreRessource.Service:
				return Enumere_Message_1.EGenreMessage.SelectionService;
			case Enumere_Ressource_1.EGenreRessource.Eleve:
				return Enumere_Message_1.EGenreMessage.SelectionEleve;
			case Enumere_Ressource_1.EGenreRessource.Competence:
				return Enumere_Message_1.EGenreMessage.SelectionPilier;
			case Enumere_Ressource_1.EGenreRessource.Appreciation:
				return Enumere_Message_1.EGenreMessage.SelectionAppreciation;
			case Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire:
				return Enumere_Message_1.EGenreMessage.SelectionDisciplineLivret;
			case Enumere_Ressource_1.EGenreRessource.Palier:
				return Enumere_Message_1.EGenreMessage.SelectionPalier;
			case Enumere_Ressource_1.EGenreRessource.Salle:
				return Enumere_Message_1.EGenreMessage.SelectionSalle;
			case Enumere_Ressource_1.EGenreRessource.Enseignant:
				return Enumere_Message_1.EGenreMessage.SelectionProfesseur;
			case Enumere_Ressource_1.EGenreRessource.Personnel:
				return Enumere_Message_1.EGenreMessage.SelectionPersonnel;
			case Enumere_Ressource_1.EGenreRessource.Materiel:
				return Enumere_Message_1.EGenreMessage.SelectionMateriel;
			default:
				return null;
		}
	}
	getMessageAucunElement(AGenreRessource) {
		switch (AGenreRessource) {
			case Enumere_Ressource_1.EGenreRessource.Classe:
				return Enumere_Message_1.EGenreMessage.AucuneClasseDisponible;
			case Enumere_Ressource_1.EGenreRessource.Matiere:
				return Enumere_Message_1.EGenreMessage.AucunMatiere;
			case Enumere_Ressource_1.EGenreRessource.Periode:
				return Enumere_Message_1.EGenreMessage.AucunePeriodes;
			case Enumere_Ressource_1.EGenreRessource.Pilier:
				return null;
			case Enumere_Ressource_1.EGenreRessource.Service:
				return Enumere_Message_1.EGenreMessage.AucunService;
			case Enumere_Ressource_1.EGenreRessource.Eleve: {
				const lRessource = this.etatUtilisateurSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Classe,
				);
				return lRessource &&
					lRessource.getGenre() === Enumere_Ressource_1.EGenreRessource.Groupe
					? Enumere_Message_1.EGenreMessage.AucunElevePourGroupe
					: Enumere_Message_1.EGenreMessage.AucunElevePourClasse;
			}
			case Enumere_Ressource_1.EGenreRessource.Appreciation:
				return Enumere_Message_1.EGenreMessage.AucunAppreciation;
			case Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire:
				return Enumere_Message_1.EGenreMessage.AucuneDiciplineLivret;
			case Enumere_Ressource_1.EGenreRessource.Palier:
				return Enumere_Message_1.EGenreMessage.AucunPalier;
			case Enumere_Ressource_1.EGenreRessource.Salle:
				return Enumere_Message_1.EGenreMessage.AucuneSalleDisponible;
			case Enumere_Ressource_1.EGenreRessource.Enseignant:
			case Enumere_Ressource_1.EGenreRessource.Personnel:
				return null;
			case Enumere_Ressource_1.EGenreRessource.Materiel:
				return Enumere_Message_1.EGenreMessage.AucunMaterielDisponible;
			default:
				return null;
		}
	}
	getLibelleMenu(AGenreRessource) {
		switch (AGenreRessource) {
			case Enumere_Ressource_1.EGenreRessource.Classe:
				return !(
					this.avecRessource[Enumere_Ressource_1.EGenreRessource.Classe] &&
					this.avecRessource[Enumere_Ressource_1.EGenreRessource.Groupe]
				)
					? !this.avecRessource[Enumere_Ressource_1.EGenreRessource.Groupe]
						? ObjetTraduction_1.GTraductions.getValeur("Classe")
						: ObjetTraduction_1.GTraductions.getValeur("Groupe")
					: ObjetTraduction_1.GTraductions.getValeur(
							"competences.ClasseGroupe",
						);
			case Enumere_Ressource_1.EGenreRessource.Matiere:
				return ObjetTraduction_1.GTraductions.getValeur("Matiere");
			case Enumere_Ressource_1.EGenreRessource.Periode:
				return ObjetTraduction_1.GTraductions.getValeur("Periode");
			case Enumere_Ressource_1.EGenreRessource.Pilier:
				return ObjetTraduction_1.GTraductions.getValeur("Competence");
			case Enumere_Ressource_1.EGenreRessource.Service:
				return ObjetTraduction_1.GTraductions.getValeur("Service");
			case Enumere_Ressource_1.EGenreRessource.Eleve:
				return ObjetTraduction_1.GTraductions.getValeur("Eleve");
			case Enumere_Ressource_1.EGenreRessource.Competence:
				return ObjetTraduction_1.GTraductions.getValeur("Competence");
			case Enumere_Ressource_1.EGenreRessource.Appreciation:
				return ObjetTraduction_1.GTraductions.getValeur("Appreciation");
			case Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire:
				return ObjetTraduction_1.GTraductions.getValeur("Discipline");
			case Enumere_Ressource_1.EGenreRessource.Palier:
				return ObjetTraduction_1.GTraductions.getValeur("competences.palier");
			case Enumere_Ressource_1.EGenreRessource.Salle:
				return ObjetTraduction_1.GTraductions.getValeur("Salle");
			case Enumere_Ressource_1.EGenreRessource.Enseignant:
				return ObjetTraduction_1.GTraductions.getValeur("Professeur");
			case Enumere_Ressource_1.EGenreRessource.Personnel:
				return ObjetTraduction_1.GTraductions.getValeur("Personnel");
			case Enumere_Ressource_1.EGenreRessource.Materiel:
				return ObjetTraduction_1.GTraductions.getValeur("Materiel");
			default:
				return null;
		}
	}
	getInformationWAI(AGenreRessource) {
		switch (AGenreRessource) {
			case Enumere_Ressource_1.EGenreRessource.Classe:
				return !(this.AvecClasse && this.AvecGroupe)
					? !this.AvecClasse
						? ObjetTraduction_1.GTraductions.getValeur("WAI.MenuSelectGroupe")
						: ObjetTraduction_1.GTraductions.getValeur("WAI.MenuSelectClasse")
					: ObjetTraduction_1.GTraductions.getValeur(
							"WAI.MenuSelectClasseGroupe",
						);
			case Enumere_Ressource_1.EGenreRessource.Matiere:
				return ObjetTraduction_1.GTraductions.getValeur("Matiere");
			case Enumere_Ressource_1.EGenreRessource.Periode:
				return ObjetTraduction_1.GTraductions.getValeur("Periode");
			case Enumere_Ressource_1.EGenreRessource.Pilier:
				return ObjetTraduction_1.GTraductions.getValeur("Competence");
			case Enumere_Ressource_1.EGenreRessource.Service:
				return ObjetTraduction_1.GTraductions.getValeur("Service");
			case Enumere_Ressource_1.EGenreRessource.Eleve:
				return ObjetTraduction_1.GTraductions.getValeur("Eleve");
			case Enumere_Ressource_1.EGenreRessource.Competence:
				return ObjetTraduction_1.GTraductions.getValeur("Competence");
			case Enumere_Ressource_1.EGenreRessource.Appreciation:
				return ObjetTraduction_1.GTraductions.getValeur("Appreciation");
			case Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire:
				return ObjetTraduction_1.GTraductions.getValeur("Discipline");
			case Enumere_Ressource_1.EGenreRessource.Palier:
				return ObjetTraduction_1.GTraductions.getValeur("competences.palier");
			case Enumere_Ressource_1.EGenreRessource.Salle:
				return ObjetTraduction_1.GTraductions.getValeur("Salle");
			case Enumere_Ressource_1.EGenreRessource.Enseignant:
				return ObjetTraduction_1.GTraductions.getValeur("Professeur");
			default:
				return null;
		}
	}
	evenementCombo(aParametresCombo, aElementSelectionne, AGenre) {
		ObjetHtml_1.GHtml.setFocus(
			this.getInstance(this.getIdentCombo(AGenre)).IdPremierElement,
		);
		if (this.ControleNavigation) {
			this.setEtatSaisie(false);
		}
		const lParam = {
			genreEvenement:
				Enumere_EvntMenusDeroulants_1.EGenreEvntMenusDeroulants
					.surOuvertureCombo,
			genreCombo: AGenre,
		};
		this._callbackSurMenusDeroulants(lParam);
		this.masquerCombos(AGenre);
		let lListeRessources;
		if (AGenre !== Enumere_Ressource_1.EGenreRessource.Competence) {
			this.afficherCombo(Enumere_Ressource_1.EGenreRessource.Competence, false);
		}
		if (aElementSelectionne || aParametresCombo.estComboMultiSelection) {
			if (
				aParametresCombo.estComboMultiSelection &&
				aParametresCombo.listeSelections
			) {
				lListeRessources = new ObjetListeElements_1.ObjetListeElements();
				aParametresCombo.listeSelections.parcourir((D) => {
					const lRessource = new ObjetElement_1.ObjetElement(
						D.getLibelle(),
						D.getNumero(),
						D.getGenre(),
					);
					lListeRessources.addElement(lRessource);
					if (AGenre === Enumere_Ressource_1.EGenreRessource.Eleve) {
						lRessource.classe = D.classe;
					}
				});
				this.etatUtilisateurSco.Navigation.setRessource(
					AGenre,
					lListeRessources,
				);
				if (lListeRessources.count() === 0) {
					this.executeEvenementAfficherMessage(
						this.getMessageSelection(AGenre),
					);
					return;
				}
			} else if (aElementSelectionne) {
				this.etatUtilisateurSco.Navigation.setRessource(
					AGenre,
					aElementSelectionne,
				);
			}
			switch (AGenre) {
				case Enumere_Ressource_1.EGenreRessource.Palier:
					switch (
						this.genreSuivant[Enumere_Ressource_1.EGenreRessource.Palier]
					) {
						case Enumere_Ressource_1.EGenreRessource.Pilier:
							this.requeteListePiliersDeCompetence();
							break;
						case Enumere_Ressource_1.EGenreRessource.Eleve:
							this.requeteListeEleves();
							break;
						default:
							this._callback();
							break;
					}
					break;
				case Enumere_Ressource_1.EGenreRessource.Pilier:
					switch (
						this.genreSuivant[Enumere_Ressource_1.EGenreRessource.Pilier]
					) {
						case Enumere_Ressource_1.EGenreRessource.Classe:
							this.requeteListeClassesEtGroupes();
							break;
						case Enumere_Ressource_1.EGenreRessource.Service:
							if (
								this.etatUtilisateurSco.Navigation.getRessource(
									Enumere_Ressource_1.EGenreRessource.Pilier,
								).estPilierLVE
							) {
								this.afficherCombo(
									Enumere_Ressource_1.EGenreRessource.Service,
									true,
								);
								this.requeteListeServices();
							} else {
								this._callback();
							}
							break;
						default:
							this._callback();
							break;
					}
					break;
				case Enumere_Ressource_1.EGenreRessource.Classe: {
					this.estUneClasse =
						!!aElementSelectionne &&
						aElementSelectionne.getGenre() ===
							Enumere_Ressource_1.EGenreRessource.Classe;
					switch (
						this.genreSuivant[Enumere_Ressource_1.EGenreRessource.Classe]
					) {
						case Enumere_Ressource_1.EGenreRessource.Eleve: {
							this.requeteListeEleves();
							break;
						}
						case Enumere_Ressource_1.EGenreRessource.Matiere: {
							this._requeteListeMatiere();
							break;
						}
						case Enumere_Ressource_1.EGenreRessource.Periode: {
							this.requeteListePeriodes();
							break;
						}
						case Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire: {
							this.requeteListeDisciplinesLivret();
							break;
						}
						case Enumere_Ressource_1.EGenreRessource.Palier: {
							this.requeteListePaliers();
							break;
						}
						case Enumere_Ressource_1.EGenreRessource.Service: {
							this.requeteListeServices();
							break;
						}
						default:
							this._callback();
							break;
					}
					break;
				}
				case Enumere_Ressource_1.EGenreRessource.Matiere: {
					this._callback(
						this.etatUtilisateurSco.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Classe,
						),
						this.etatUtilisateurSco.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Matiere,
						),
					);
					break;
				}
				case Enumere_Ressource_1.EGenreRessource.Periode:
					switch (
						this.genreSuivant[Enumere_Ressource_1.EGenreRessource.Periode]
					) {
						case Enumere_Ressource_1.EGenreRessource.Service:
							this.requeteListeServices();
							break;
						case Enumere_Ressource_1.EGenreRessource.Eleve:
							this.requeteListeEleves();
							break;
						case Enumere_Ressource_1.EGenreRessource.Appreciation:
							this.requeteListeAppreciations();
							break;
						case Enumere_Ressource_1.EGenreRessource.Palier:
							this.requeteListePaliers();
							break;
						case Enumere_Ressource_1.EGenreRessource.Periode:
							this._callback();
							break;
						default:
							this._callback();
							break;
					}
					break;
				case Enumere_Ressource_1.EGenreRessource.Service:
					if (aElementSelectionne.matiere) {
						this.etatUtilisateurSco.Navigation.setRessource(
							Enumere_Ressource_1.EGenreRessource.Matiere,
							aElementSelectionne.matiere.getLibelle(),
							aElementSelectionne.matiere.getNumero(),
							aElementSelectionne.matiere.getGenre(),
						);
					}
					if (aElementSelectionne.listeProfesseurs) {
						const lProfesseur = aElementSelectionne.listeProfesseurs.get(0);
						if (lProfesseur) {
							this.etatUtilisateurSco.Navigation.setRessource(
								Enumere_Ressource_1.EGenreRessource.Enseignant,
								lProfesseur.getLibelle(),
								lProfesseur.getNumero(),
								lProfesseur.getGenre(),
							);
						}
					}
					switch (
						this.genreSuivant[Enumere_Ressource_1.EGenreRessource.Service]
					) {
						case Enumere_Ressource_1.EGenreRessource.Eleve:
							this.requeteListeEleves();
							break;
						default: {
							this._callback(
								this.etatUtilisateurSco.Navigation.getRessource(
									Enumere_Ressource_1.EGenreRessource.Classe,
								),
								this.avecRessource[Enumere_Ressource_1.EGenreRessource.Periode]
									? this.etatUtilisateurSco.Navigation.getRessource(
											Enumere_Ressource_1.EGenreRessource.Periode,
										)
									: new ObjetElement_1.ObjetElement("", 0, 0),
								this.etatUtilisateurSco.Navigation.getRessource(
									Enumere_Ressource_1.EGenreRessource.Service,
								),
								this.etatUtilisateurSco.Navigation.getRessource(
									Enumere_Ressource_1.EGenreRessource.Matiere,
								),
								this.etatUtilisateurSco.Navigation.getRessource(
									Enumere_Ressource_1.EGenreRessource.Enseignant,
								),
							);
						}
					}
					break;
				case Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire: {
					this._callback(
						this.etatUtilisateurSco.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Classe,
						),
						this.etatUtilisateurSco.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire,
						),
					);
					break;
				}
				case Enumere_Ressource_1.EGenreRessource.Eleve: {
					if (
						this.genreSuivant[Enumere_Ressource_1.EGenreRessource.Eleve] ===
						Enumere_Ressource_1.EGenreRessource.Palier
					) {
						this.requeteListePaliers();
					} else {
						this._callback(
							this.etatUtilisateurSco.Navigation.getRessource(
								Enumere_Ressource_1.EGenreRessource.Classe,
							),
							this.avecRessource[Enumere_Ressource_1.EGenreRessource.Periode]
								? this.etatUtilisateurSco.Navigation.getRessource(
										Enumere_Ressource_1.EGenreRessource.Periode,
									)
								: new ObjetElement_1.ObjetElement("", 0, 0),
							this.etatUtilisateurSco.Navigation.getRessource(
								Enumere_Ressource_1.EGenreRessource.Eleve,
							),
						);
					}
					break;
				}
				case Enumere_Ressource_1.EGenreRessource.Appreciation: {
					this._callback(
						this.etatUtilisateurSco.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Classe,
						),
						this.avecRessource[Enumere_Ressource_1.EGenreRessource.Periode]
							? this.etatUtilisateurSco.Navigation.getRessource(
									Enumere_Ressource_1.EGenreRessource.Periode,
								)
							: new ObjetElement_1.ObjetElement("", 0, 0),
						this.etatUtilisateurSco.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Appreciation,
						),
					);
					break;
				}
				case Enumere_Ressource_1.EGenreRessource.Competence: {
					this._callback(
						this.etatUtilisateurSco.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Classe,
						),
						this.etatUtilisateurSco.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Competence,
						),
					);
					break;
				}
				case Enumere_Ressource_1.EGenreRessource.Enseignant:
					this._callback();
					break;
				case Enumere_Ressource_1.EGenreRessource.Salle:
				case Enumere_Ressource_1.EGenreRessource.Personnel:
				case Enumere_Ressource_1.EGenreRessource.Materiel:
					this._callback();
					break;
			}
		} else {
			this.executeEvenementAfficherMessage(this.getMessageSelection(AGenre));
		}
	}
	async requeteOuBufferListeClassesGroupes() {
		if (
			[
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
				Enumere_Espace_1.EGenreEspace.PrimMairie,
			].includes(this.etatUtilisateurSco.GenreEspace)
		) {
			this.actionSurRequeteListeClassesEtGroupesPourPrimaire();
		} else if (
			[
				Enumere_Espace_1.EGenreEspace.Etablissement,
				Enumere_Espace_1.EGenreEspace.Administrateur,
			].includes(this.etatUtilisateurSco.GenreEspace)
		) {
			this.actionSurRequeteListeClassesEtGroupes();
		} else {
			const lResult =
				await new ObjetRequeteListes_1.ObjetRequeteListes_ListeClassesGroupes(
					this,
				).lancerRequete(this.donneesRequete);
			this.actionSurRequeteListeClassesEtGroupes(lResult);
		}
	}
	async requeteOuBufferListeEleves() {
		const lResult =
			await new ObjetRequeteListes_1.ObjetRequeteListes_ListeEleves(
				this,
			).lancerRequete(this.donneesRequete);
		this.actionSurRequeteListeEleves(lResult);
	}
	async requeteOuBufferListeDisciplinesLivret() {
		this.actionSurRequeteListeDisciplinesLivret(
			await new ObjetRequeteListes_1.ObjetRequeteListes_ListeDisciplinesLivret(
				this,
			).lancerRequete(this.donneesRequete),
		);
	}
	async requeteOuBufferListePeriodes() {
		this._actionSurRequeteListePeriodes(
			await new ObjetRequeteListes_1.ObjetRequeteListes_ListePeriodes(
				this,
			).lancerRequete(this.donneesRequete),
		);
	}
	requeteOuBufferListeServices() {
		new ObjetRequeteListeServices_1.ObjetRequeteListeServices(
			this,
			this._actionSurRequeteListeServices,
		).lancerRequete(
			this.donneesRequete.avecProfesseur
				? this.etatUtilisateurSco.getUtilisateur()
				: null,
			this.donneesRequete.avecClasse
				? this.etatUtilisateurSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Classe,
					)
				: null,
			this.donneesRequete.avecPeriode
				? this.etatUtilisateurSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Periode,
					)
				: null,
			this.donneesRequete.avecEleve
				? this.etatUtilisateurSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Eleve,
					)
				: null,
			this.donneesRequete.avecPilier
				? this.etatUtilisateurSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Pilier,
					)
				: null,
		);
	}
	async requeteOuBufferListePaliers() {
		this._actionSurRequeteListePaliers(
			await new ObjetRequeteListes_1.ObjetRequeteListes_ListePaliers(
				this,
			).lancerRequete(this.donneesRequete),
		);
	}
	async requeteOuBufferListeSalles() {
		this.actionSurRequeteListeSalles(
			await new ObjetRequeteListes_1.ObjetRequeteListes_ListeSalles(
				this,
			).lancerRequete(this.donneesRequete),
		);
	}
	async requeteOuBufferListeProfesseurs() {
		if (
			[
				Enumere_Espace_1.EGenreEspace.Etablissement,
				Enumere_Espace_1.EGenreEspace.Administrateur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
			].includes(this.etatUtilisateurSco.GenreEspace)
		) {
			const lListeProfs = this.etatUtilisateurSco
				.getListeProfesseurs()
				.getListeElements((D) => {
					return D.existeNumero();
				});
			this._remplirCombo(
				lListeProfs,
				Enumere_Ressource_1.EGenreRessource.Enseignant,
			);
		} else {
			this.actionSurRequeteListeProfesseurs(
				await new ObjetRequeteListes_1.ObjetRequeteListes_ListeProfesseurs(
					this,
				).lancerRequete(this.donneesRequete),
			);
		}
	}
	async requeteOuBufferListeAppreciations() {
		this.actionSurRequeteListeAppreciations(
			await new ObjetRequeteListes_1.ObjetRequeteListes_ListeAppreciations(
				this,
			).lancerRequete(this.donneesRequete),
		);
	}
	async requeteListePiliersDeCompetence() {
		this.actionSurRequeteListePiliersDeCompetence(
			await new ObjetRequeteListes_1.ObjetRequeteListes_ListeTousPiliersDeCompetence(
				this,
			).lancerRequete(this.donneesRequete),
		);
	}
	requeteListeDisciplinesLivret() {
		this.requeteOuBufferListeDisciplinesLivret();
	}
	requeteListeClassesEtGroupes() {
		this.requeteOuBufferListeClassesGroupes();
	}
	requeteListePeriodes() {
		this.requeteOuBufferListePeriodes();
	}
	requeteListeServices() {
		this.requeteOuBufferListeServices();
	}
	requeteListeEleves() {
		this.requeteOuBufferListeEleves();
	}
	requeteListeAppreciations() {
		this.requeteOuBufferListeAppreciations();
	}
	requeteListePaliers() {
		this.requeteOuBufferListePaliers();
	}
	requeteListeSalles() {
		this.requeteOuBufferListeSalles();
	}
	requeteListeProfesseurs() {
		this.requeteOuBufferListeProfesseurs();
	}
	actionSurRequeteListeClassesEtGroupes(aJSON) {
		const lListeClasse = [
			Enumere_Espace_1.EGenreEspace.Etablissement,
			Enumere_Espace_1.EGenreEspace.Administrateur,
		].includes(this.etatUtilisateurSco.GenreEspace)
			? this.etatUtilisateurSco.getListeClassesDOnglet()
			: aJSON.listeClassesGroupes;
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		let lGenre;
		this.AvecClasse = false;
		this.AvecGroupe = false;
		for (let I = 0; I < lListeClasse.count(); I++) {
			lGenre = lListeClasse.getGenre(I);
			if (lGenre === Enumere_Ressource_1.EGenreRessource.Classe) {
				this.AvecClasse = true;
			}
			if (lGenre === Enumere_Ressource_1.EGenreRessource.Groupe) {
				this.AvecGroupe = true;
			}
		}
		lListe.add(lListeClasse);
		lListe.parcourir((aElement) => {
			if (aElement.estGAEV) {
				let lClasseIconeGAEV;
				let lTitle = "";
				if (aElement.estGAEVMixte) {
					lClasseIconeGAEV = "icon_gaev_mixte";
					lTitle = ObjetTraduction_1.GTraductions.getValeur(
						"EDT.HintImageGAEVMixte",
					);
				} else {
					lClasseIconeGAEV = "icon_groupes_accompagnement_personnalise";
					lTitle = ObjetTraduction_1.GTraductions.getValeur(
						"EDT.ElevesGAEVChangent",
					);
				}
				aElement.libelleHtml = IE.jsx.str(
					"div",
					{
						style:
							"display:flex; align-items:center; justify-content:space-between;",
					},
					IE.jsx.str("div", null, aElement.Libelle),
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str("i", {
							class: lClasseIconeGAEV,
							role: "img",
							title: lTitle,
							"aria-label": lTitle,
						}),
					),
				);
			}
		});
		if (this.avecMesServices) {
			const lMesServices = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("MesServices"),
				-1,
				Enumere_Ressource_1.EGenreRessource.Aucune,
				null,
			);
			lMesServices.AvecSelection = true;
			lListe.addElement(lMesServices);
		}
		if (this.AvecClasse && this.AvecGroupe) {
			let lElement;
			const lAvecMultiSelection = this._avecMultiSelectionClasseGroupe();
			lElement = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("Classe"),
				-1,
				Enumere_Ressource_1.EGenreRessource.Classe,
				null,
			);
			lElement.AvecSelection = !!lAvecMultiSelection;
			lListe.addElement(lElement);
			lElement = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("Groupe"),
				-1,
				Enumere_Ressource_1.EGenreRessource.Groupe,
				null,
			);
			lElement.AvecSelection = lAvecMultiSelection;
			lListe.addElement(lElement);
		}
		lListe.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				return D.getGenre() !== Enumere_Ressource_1.EGenreRessource.Aucune;
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				return D.getNumero() !== 0;
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				return D.getGenre() !== Enumere_Ressource_1.EGenreRessource.Classe;
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				return D.getNumero() !== -1;
			}),
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		lListe.trier();
		this._remplirCombo(lListe, Enumere_Ressource_1.EGenreRessource.Classe);
	}
	actionSurRequeteListeClassesEtGroupesPourPrimaire() {
		const lOnglet = this.etatUtilisateurSco.getGenreOnglet();
		const lSansClassesDeRegroupement = [
			Enumere_Onglet_1.EGenreOnglet.TableauDeBord,
			Enumere_Onglet_1.EGenreOnglet.ListeEleves,
			Enumere_Onglet_1.EGenreOnglet.TrombinoscopeClasse,
		].includes(lOnglet);
		const lAvecClasseMultiNiveau = [
			Enumere_Onglet_1.EGenreOnglet.TableauDeBord,
			Enumere_Onglet_1.EGenreOnglet.ListeEleves,
			Enumere_Onglet_1.EGenreOnglet.TrombinoscopeClasse,
			Enumere_Onglet_1.EGenreOnglet.PyramideDesAges_Histogramme,
			Enumere_Onglet_1.EGenreOnglet.PyramideDesAges_Repartition,
			Enumere_Onglet_1.EGenreOnglet.EmploiDuTemps_Annuel_Classe,
			Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsClasse,
			Enumere_Onglet_1.EGenreOnglet.SaisieTravailAFaire,
			Enumere_Onglet_1.EGenreOnglet.SaisieCahierJournal,
			Enumere_Onglet_1.EGenreOnglet.Blog_Mediatheque,
			Enumere_Onglet_1.EGenreOnglet.SyntheseAcquis,
			Enumere_Onglet_1.EGenreOnglet.BilanAnnuelApprentissage,
			Enumere_Onglet_1.EGenreOnglet.CarnetDeSuivi,
		].includes(lOnglet);
		const lAvecGroupe = [
			Enumere_Onglet_1.EGenreOnglet.TableauDeBord,
			Enumere_Onglet_1.EGenreOnglet.ListeEleves,
			Enumere_Onglet_1.EGenreOnglet.TrombinoscopeClasse,
			Enumere_Onglet_1.EGenreOnglet.PyramideDesAges_Histogramme,
			Enumere_Onglet_1.EGenreOnglet.PyramideDesAges_Repartition,
			Enumere_Onglet_1.EGenreOnglet.SaisieTravailAFaire,
			Enumere_Onglet_1.EGenreOnglet.SaisieCahierJournal,
			Enumere_Onglet_1.EGenreOnglet.RessourcePedagogique,
			Enumere_Onglet_1.EGenreOnglet.ReleveEvaluationsParService,
			Enumere_Onglet_1.EGenreOnglet.Evaluation,
		].includes(lOnglet);
		const lUniquementLesClassesDontJeSuisResponsable = [
			Enumere_Espace_1.EGenreEspace.PrimMairie,
		].includes(this.etatUtilisateurSco.GenreEspace);
		let lListeClasse = this.etatUtilisateurSco.getListeClasses({
			avecClasse: true,
			avecGroupe: lAvecGroupe,
			avecClasseMultiNiveau: lAvecClasseMultiNiveau,
			sansClasseDeRegroupement: lSansClassesDeRegroupement,
			uniquementClassePrincipal: [
				Enumere_Onglet_1.EGenreOnglet.EmploiDuTemps_Annuel_Classe,
				Enumere_Onglet_1.EGenreOnglet.RecapitulatifExportLSU,
				Enumere_Onglet_1.EGenreOnglet.Blog_Mediatheque,
			].includes(lOnglet),
			uniquementClasseEnseignee:
				[
					Enumere_Onglet_1.EGenreOnglet.SaisieCahierDeTextes,
					Enumere_Onglet_1.EGenreOnglet.SaisieTravailAFaire,
					Enumere_Onglet_1.EGenreOnglet.SaisieCahierJournal,
					Enumere_Onglet_1.EGenreOnglet.BilanAnnuelApprentissage,
					Enumere_Onglet_1.EGenreOnglet.SyntheseAcquis,
					Enumere_Onglet_1.EGenreOnglet.CarnetDeSuivi,
				].includes(lOnglet) || lUniquementLesClassesDontJeSuisResponsable,
		});
		if (
			[
				Enumere_Onglet_1.EGenreOnglet.Evaluation,
				Enumere_Onglet_1.EGenreOnglet.RecapitulatifExportLSU,
				Enumere_Onglet_1.EGenreOnglet.ListeEvaluation,
				Enumere_Onglet_1.EGenreOnglet.ListeEvaluationHistorique,
				Enumere_Onglet_1.EGenreOnglet.ReleveDeCompetences,
				Enumere_Onglet_1.EGenreOnglet.SuiviResultatsCompetences,
				Enumere_Onglet_1.EGenreOnglet.BilanCompetencesParMatiere,
				Enumere_Onglet_1.EGenreOnglet.BulletinCompetences,
				Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsGenerales_Competences,
				Enumere_Onglet_1.EGenreOnglet.ReleveDeCompetences,
				Enumere_Onglet_1.EGenreOnglet.ReleveEvaluationsParService,
				Enumere_Onglet_1.EGenreOnglet.BilanFinDeCycle,
				Enumere_Onglet_1.EGenreOnglet.CompetencesNumeriques,
			].includes(lOnglet)
		) {
			lListeClasse.removeFilter((aClasseGroupe) => {
				return !!aClasseGroupe.estDeNiveauMaternelle;
			});
		}
		if (
			[
				Enumere_Onglet_1.EGenreOnglet.ListeApprentissages,
				Enumere_Onglet_1.EGenreOnglet.CarnetDeSuivi,
				Enumere_Onglet_1.EGenreOnglet.SyntheseAcquis,
				Enumere_Onglet_1.EGenreOnglet.BilanAnnuelApprentissage,
			].includes(lOnglet)
		) {
			lListeClasse.removeFilter((aClasseGroupe) => {
				return !aClasseGroupe.estDeNiveauMaternelle;
			});
		}
		if ([Enumere_Onglet_1.EGenreOnglet.SaisieTravailAFaire].includes(lOnglet)) {
			lListeClasse.removeFilter((aClasseGroupe) => {
				return (
					!!aClasseGroupe.optionsPublication &&
					!aClasseGroupe.optionsPublication.contains(
						TypeOptionsPublication_1.TypeOptionsPublication.OP_CahierDeTexte,
					)
				);
			});
		}
		if (
			[
				Enumere_Onglet_1.EGenreOnglet.Blog_FilActu,
				Enumere_Onglet_1.EGenreOnglet.Blog_Mediatheque,
			].includes(lOnglet)
		) {
			lListeClasse.removeFilter((aClasseGroupe) => {
				return (
					!!aClasseGroupe.optionsPublication &&
					!aClasseGroupe.optionsPublication.contains(
						TypeOptionsPublication_1.TypeOptionsPublication.OP_Blog,
					)
				);
			});
		}
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		let lClasseParDefaut;
		let lPremierClasseParDefaut;
		this.AvecClasse = true;
		this.AvecGroupe = false;
		let lAvecPrincipal = false;
		let lAvecEnseigne = false;
		let lAvecEnseigneGroupe = false;
		let lAvecAutre = false;
		let lAvecAutreGroupe = false;
		const lClassesMN = lListeClasse.getListeElements((aClasse) => {
			return !!aClasse.estClasseMN;
		});
		lListeClasse.parcourir((aElement) => {
			if (
				aElement.estPrincipal ||
				(lUniquementLesClassesDontJeSuisResponsable &&
					aElement.estResponsable &&
					(aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Classe ||
						aElement.estClasseMN))
			) {
				aElement.genreClasse = EGenreClasse.principal;
				lAvecPrincipal = true;
				if (!lPremierClasseParDefaut) {
					lPremierClasseParDefaut = aElement;
				}
				if (!lClasseParDefaut && !aElement.dansRegroupement) {
					lClasseParDefaut = aElement;
				}
			} else if (aElement.enseigne) {
				aElement.genreClasse = EGenreClasse.enseigne;
				if (
					aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Groupe &&
					!aElement.estClasseMN
				) {
					lAvecEnseigneGroupe = true;
					aElement.estGroupe = true;
				} else {
					lAvecEnseigne = true;
				}
			} else {
				aElement.genreClasse = EGenreClasse.autre;
				if (
					aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Classe ||
					aElement.estClasseMN
				) {
					lAvecAutre = true;
				}
				if (
					aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Groupe &&
					!aElement.estClasseMN
				) {
					lAvecAutreGroupe = true;
					aElement.estGroupe = true;
				}
			}
			aElement.ClassAffichage = undefined;
			if (!!aElement.dansRegroupement) {
				lClassesMN.parcourir((aClasseMN) => {
					aClasseMN.listeComposantes.parcourir((aClasseNiveau) => {
						if (
							aClasseNiveau.egalParNumeroEtGenre(
								aElement.getNumero(),
								aElement.getGenre(),
							)
						) {
							aElement.pere = aClasseMN;
							aElement.ClassAffichage = "p-left-l";
							return false;
						}
					});
					if (!!aElement.pere) {
						return false;
					}
				});
			}
		});
		if (!lClasseParDefaut && !!lPremierClasseParDefaut) {
			lClasseParDefaut = lPremierClasseParDefaut;
		}
		if (this.avecMesServices) {
			const lMesServices = ObjetElement_1.ObjetElement.create({
				Libelle: ObjetTraduction_1.GTraductions.getValeur("MesServices"),
				Numero: -1,
				Genre: Enumere_Ressource_1.EGenreRessource.Aucune,
				AvecSelection: true,
			});
			lListe.addElement(lMesServices);
		}
		let lElement;
		if (
			[
				Enumere_Espace_1.EGenreEspace.PrimDirection,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace) &&
			[Enumere_Onglet_1.EGenreOnglet.TableauDeBord].includes(lOnglet)
		) {
			lElement = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("TousLesEleves"),
				0,
				Enumere_Ressource_1.EGenreRessource.Aucune,
				0,
			);
			lElement.genreClasse = -1;
			lElement.AvecSelection = true;
			lListe.addElement(lElement);
		}
		if (lAvecPrincipal) {
			lElement = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("MesClasses"),
				-1,
				-1,
				null,
			);
			lElement.genreClasse = EGenreClasse.principal;
			lElement.AvecSelection = false;
			lListe.addElement(lElement);
		}
		if (lAvecEnseigne) {
			lElement = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("ClassesOuJEnseigne"),
				-1,
				-1,
				null,
			);
			lElement.genreClasse = EGenreClasse.enseigne;
			lElement.AvecSelection = false;
			lListe.addElement(lElement);
		}
		if (lAvecEnseigneGroupe) {
			lElement = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("GroupesOuJEnseigne"),
				-1,
				-1,
				null,
			);
			lElement.genreClasse = EGenreClasse.enseigne;
			lElement.estGroupe = true;
			lElement.AvecSelection = false;
			lListe.addElement(lElement);
		}
		if (lAvecAutre) {
			lElement = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("AutresClasses"),
				-1,
				-1,
				null,
			);
			lElement.genreClasse = EGenreClasse.autre;
			lElement.AvecSelection = false;
			lListe.addElement(lElement);
		}
		if (lAvecAutreGroupe) {
			lElement = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("AutresGroupes"),
				-1,
				-1,
				null,
			);
			lElement.genreClasse = EGenreClasse.autre;
			lElement.estGroupe = true;
			lElement.AvecSelection = false;
			lListe.addElement(lElement);
		}
		lListe.add(lListeClasse);
		lListe.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				return D.genreClasse;
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				return !!D.estGroupe;
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				return D.getNumero() !== -1;
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				return !!D.pere ? D.pere.getLibelle() : D.getLibelle();
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				return !!D.pere;
			}),
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		lListe.trier();
		this._remplirCombo(
			lListe,
			Enumere_Ressource_1.EGenreRessource.Classe,
			lClasseParDefaut,
		);
	}
	actionSurRequeteListePiliersDeCompetence(aJSON) {
		const lListePiliersCpt = aJSON.liste;
		lListePiliersCpt.trier();
		let lAvecSocleCommun = false;
		let lAvecPersonnalise = false;
		let lPilier;
		for (let i = 0; i < lListePiliersCpt.count(); i++) {
			lPilier = lListePiliersCpt.get(i);
			if (
				lPilier.type === TypeCategorieCompetence_1.TypeCategorieCompetence.Socle
			) {
				lAvecSocleCommun = true;
			}
			if (
				lPilier.type ===
				TypeCategorieCompetence_1.TypeCategorieCompetence.HorsSocle
			) {
				lAvecPersonnalise = true;
			}
		}
		if (lAvecSocleCommun && lAvecPersonnalise) {
			lPilier = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("pilier.socleCommun"),
			);
			lPilier.type = TypeCategorieCompetence_1.TypeCategorieCompetence.Socle;
			lPilier.Position = -1;
			lPilier.AvecSelection = false;
			lListePiliersCpt.addElement(lPilier);
			lPilier = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("pilier.personnalise"),
			);
			lPilier.type =
				TypeCategorieCompetence_1.TypeCategorieCompetence.HorsSocle;
			lPilier.Position = -1;
			lPilier.AvecSelection = false;
			lListePiliersCpt.addElement(lPilier);
		}
		lListePiliersCpt.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				return D.type;
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				return D.getPosition();
			}),
		]);
		lListePiliersCpt.trier();
		this._remplirCombo(
			lListePiliersCpt,
			Enumere_Ressource_1.EGenreRessource.Pilier,
		);
	}
	actionSurRequeteListeDisciplinesLivret(aJSON) {
		function _ajouter(aListe, aElement, aAvecFiliere) {
			const lTabClass = [];
			if (aElement.getActif()) {
				lTabClass.push("semi-bold");
			}
			if (aAvecFiliere && aElement.horsLivret) {
				lTabClass.push("color-red-moyen");
			}
			aElement.ClassAffichage = lTabClass.join(" ");
			aListe.addElement(aElement);
		}
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		const lAvecFiliere = aJSON.avecFiliere;
		const lListeDisciplines = aJSON.liste;
		const lClasse = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
		lClasse.avecFiliere = lAvecFiliere;
		for (let I = 0; I < lListeDisciplines.count(); I++) {
			const lDisciplineLivret = lListeDisciplines.get(I);
			if (this.afficherHorsLivret) {
				if (
					lDisciplineLivret.horsLivret ||
					this.etatUtilisateurSco.Navigation.getGenreRessource(
						Enumere_Ressource_1.EGenreRessource.Classe,
					) === Enumere_Ressource_1.EGenreRessource.Classe
				) {
					if (
						!lDisciplineLivret.horsService &&
						!lDisciplineLivret.doublonPourCompetences
					) {
						_ajouter(
							lListe,
							MethodesObjet_1.MethodesObjet.dupliquer(lDisciplineLivret),
							lAvecFiliere,
						);
					}
				}
			} else if (
				!lDisciplineLivret.horsLivret &&
				!lDisciplineLivret.estChefDoeuvre
			) {
				const lElement =
					MethodesObjet_1.MethodesObjet.dupliquer(lDisciplineLivret);
				if (
					lDisciplineLivret.filiere &&
					lDisciplineLivret.filiere.existeNumero()
				) {
					lElement.setLibelle(
						lElement.getLibelle() +
							" - " +
							lDisciplineLivret.filiere.getLibelle(),
					);
				}
				_ajouter(lListe, lElement, lAvecFiliere);
			}
		}
		lListe.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				return !D.horsLivret;
			}),
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		lListe.trier();
		this._remplirCombo(
			lListe,
			Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire,
		);
	}
	_actionSurRequeteListeServices(aListeServices) {
		if (
			[
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
			].includes(this.etatUtilisateurSco.GenreEspace)
		) {
			this.actionSurRequeteListeServicesPourPrimaire(aListeServices);
		} else {
			this.actionSurRequeteListeServices(aListeServices);
		}
	}
	actionSurRequeteListeServicesPourPrimaire(aListeServices) {
		function _dessinerColonne(
			aLibelle,
			aLargeur,
			aEstService,
			aAvecGras,
			aCouleur,
		) {
			const H = [];
			H.push(
				'<div class="InlineBlock AlignementBas" ie-ellipsis style="overflow:hidden;',
				ObjetStyle_1.GStyle.composeWidth(aLargeur),
				aEstService ? "" : "padding-left:10px;",
				'">',
			);
			H.push('<div class="flex-contain flex-center">');
			const lBorder = !aEstService
				? "border-radius:6px;"
				: "border-radius:6px 0 0 6px;";
			const lHeight = !aEstService ? 6 : 25;
			H.push(
				'<div style="',
				ObjetStyle_1.GStyle.composeHeight(lHeight),
				"min-width:6px; margin:2px; margin-right: 3px; " +
					ObjetStyle_1.GStyle.composeCouleurFond(aCouleur),
				lBorder,
				'"></div>',
			);
			const lGras = aAvecGras ? "Gras" : "";
			H.push('<div class="', lGras, '">', aLibelle, "</div>");
			H.push("</div>");
			H.push("</div>");
			return H.join("");
		}
		if (this.avecMesServices) {
			const lClasseGroupeSelectionnee =
				this.etatUtilisateurSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Classe,
				);
			this.avecServiceClasse =
				lClasseGroupeSelectionnee && lClasseGroupeSelectionnee.getGenre() === 0;
		}
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		let lServicePere = null;
		const lAvecServiceClasse = this.avecServiceClasse;
		aListeServices.parcourir((aElement) => {
			const lLibelleClasse = aElement.classe.getLibelle();
			const lLibelleGroupe = aElement.groupe.getLibelle();
			const lLibelleClasseGroupe =
				lLibelleClasse +
				(lLibelleClasse && lLibelleGroupe ? " > " : "") +
				lLibelleGroupe;
			const lService = MethodesObjet_1.MethodesObjet.dupliquer(aElement);
			lService.AvecSelection = aElement.estService;
			lListe.addElement(lService);
			if (lService.estUnService) {
				lServicePere = lService;
			} else {
				lService.pere = lServicePere;
			}
			lService._libelleClasseGroupe = lLibelleClasseGroupe;
			lService._estSurProfesseur = false;
			lService._estServicePartie = lLibelleClasse && lLibelleGroupe;
			const H = [];
			H.push('<div class="flex-contain flex-between flex-center">');
			const lCouleur = aElement.couleur;
			if (aElement.estService) {
				const lEstCumulNiveau1 = !(aElement.cumul > 1);
				H.push(
					_dessinerColonne(
						aElement.matiere.getLibelle(),
						350,
						lEstCumulNiveau1,
						lEstCumulNiveau1,
						lCouleur,
					),
				);
			} else {
				H.push(
					_dessinerColonne(aElement.getLibelle(), 350, true, true, lCouleur),
				);
			}
			if (lAvecServiceClasse) {
				H.push("<div>", lLibelleClasseGroupe, "</div>");
			}
			H.push("</div>");
			lService.libelleHtml = H.join("");
		});
		this._remplirCombo(lListe, Enumere_Ressource_1.EGenreRessource.Service);
		if (
			!this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Service,
			)
		) {
			this.getInstance(
				this.getIdentCombo(Enumere_Ressource_1.EGenreRessource.Service),
			).deroulerListe();
		}
	}
	actionSurRequeteListeServices(aListeServices) {
		function _dessinerColonne(aLibelle, aLargeur, aEstService) {
			const H = [];
			H.push(
				'<div class=" InlineBlock AlignementBas" ie-ellipsis style="overflow:hidden;',
				ObjetStyle_1.GStyle.composeWidth(aLargeur - (aEstService ? 25 : 35)),
				aEstService ? "" : "padding-left:10px;",
				'">',
				aLibelle,
				"</div>",
			);
			return H.join("");
		}
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		let lServicePere = null;
		const lAvecServiceClasse = this.avecServiceClasse;
		const lAvecServiceProfesseur = this.avecServiceProfesseur;
		let lServiceParDefaut = null;
		aListeServices.parcourir((aElement) => {
			const LLibelleClasse = aElement.classe.getLibelle();
			const LLibelleGroupe = aElement.groupe.getLibelle();
			const LLibelleClasseGroupe =
				LLibelleClasse +
				(LLibelleClasse && LLibelleGroupe ? " > " : "") +
				LLibelleGroupe;
			let LLibelleProfesseurs = [];
			let lEstSurProfesseur = false;
			for (
				let I = 0;
				aElement.listeProfesseurs && I < aElement.listeProfesseurs.count();
				I++
			) {
				LLibelleProfesseurs.push(aElement.listeProfesseurs.getLibelle(I));
				if (
					aElement.listeProfesseurs.getNumero(I) ===
					GEtatUtilisateur.getUtilisateur().getNumero()
				) {
					lEstSurProfesseur = true;
				}
			}
			const lService = MethodesObjet_1.MethodesObjet.dupliquer(aElement);
			lListe.addElement(lService);
			if (lService.estUnService) {
				lServicePere = lService;
			} else {
				lService.pere = lServicePere;
			}
			lService._libelleClasseGroupe = LLibelleClasseGroupe;
			lService._libelleProfesseurs = LLibelleProfesseurs.join("<br>");
			lService._estSurProfesseur = lEstSurProfesseur;
			lService._estServicePartie = LLibelleClasse && LLibelleGroupe;
			const H = [];
			H.push('<div class="NoWrap">');
			H.push(
				_dessinerColonne(
					aElement.matiere.getLibelle(),
					!lAvecServiceProfesseur && !lAvecServiceClasse ? 350 : 200,
					lService.estUnService,
				),
			);
			if (lAvecServiceClasse) {
				H.push(
					_dessinerColonne(LLibelleClasseGroupe, 200, lService.estUnService),
				);
			}
			if (lAvecServiceProfesseur) {
				H.push(
					_dessinerColonne(
						lService._libelleProfesseurs,
						150 - 6,
						lService.estUnService,
					),
				);
			}
			H.push("</div>");
			lService.libelleHtml = H.join("");
		});
		if (this.avecToutesLesLVE) {
			const lServiceLVE = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("competences.ToutesLesLVE"),
				0,
				null,
				-1,
			);
			lServiceLVE._estSurProfesseur = true;
			lListe.addElement(lServiceLVE);
		}
		lListe.setTri([
			ObjetTri_1.ObjetTri.initRecursif("pere", [
				ObjetTri_1.ObjetTri.init((D) => {
					return D.matiere && D.matiere.getNumero() ? 1 : 0;
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					return D.matiere ? D.matiere.getLibelle() : "";
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					return D._libelleClasseGroupe;
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					return D._libelleProfesseurs;
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					return !D.estUnService;
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					return D.getNumero();
				}),
			]),
		]);
		lListe.trier();
		const lRessource = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
		if (
			lRessource !== null &&
			lRessource !== undefined &&
			lRessource.getNumero() !== -1 &&
			lRessource.getGenre() !== Enumere_Ressource_1.EGenreRessource.Aucune
		) {
			lListe.parcourir((aElement) => {
				if (aElement._estSurProfesseur) {
					if (!lServiceParDefaut || aElement.estUnService) {
						if (
							!lServiceParDefaut ||
							!(
								lRessource.getGenre() ===
									Enumere_Ressource_1.EGenreRessource.Classe &&
								aElement._estServicePartie
							)
						) {
							lServiceParDefaut = aElement;
						}
					}
				}
			});
		}
		this._remplirCombo(
			lListe,
			Enumere_Ressource_1.EGenreRessource.Service,
			lServiceParDefaut,
			lServiceParDefaut,
		);
	}
	actionSurRequeteListeEleves(aJSON) {
		const lListeEleves = new ObjetListeElements_1.ObjetListeElements();
		let lEleveDefaut = null;
		if (this.avecDeLaClasse) {
			const lDonneeDeLaClasse = new ObjetElement_1.ObjetElement(
				this.estUneClasse
					? "< " + ObjetTraduction_1.GTraductions.getValeur("DeLaClasse") + " >"
					: "< " + ObjetTraduction_1.GTraductions.getValeur("DuGroupe") + " >",
				0,
				null,
				-1,
			);
			lListeEleves.addElement(lDonneeDeLaClasse);
			lEleveDefaut = lDonneeDeLaClasse;
		}
		aJSON.listeEleves.parcourir((D) => {
			const lEleve = MethodesObjet_1.MethodesObjet.dupliquer(D);
			lListeEleves.addElement(lEleve);
			if (!lEleve.getActif()) {
				lEleve.StyleAffichage = ObjetStyle_1.GStyle.composeCouleurTexte(
					GCouleur.rouge,
				);
			}
		});
		lListeEleves.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				return D.getNumero() !== 0;
			}),
			ObjetTri_1.ObjetTri.init("Position"),
		]);
		lListeEleves.trier();
		this._remplirCombo(
			lListeEleves,
			Enumere_Ressource_1.EGenreRessource.Eleve,
			lEleveDefaut,
			lEleveDefaut,
		);
	}
	actionSurRequeteListeMatieres(aJSON) {
		if (aJSON.ListeMatieres) {
			aJSON.ListeMatieres.trier();
		}
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		const lListeEltsMatiere = aJSON.ListeMatieres;
		if (this.avecToutesLesMatieres && lListeEltsMatiere.count() > 1) {
			lListe.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("ToutesLesMatieres"),
					0,
					null,
					-1,
				),
			);
		}
		lListe.add(lListeEltsMatiere);
		this._remplirCombo(lListe, Enumere_Ressource_1.EGenreRessource.Matiere);
	}
	actionSurRequeteListeAppreciations(aJSON) {
		this._remplirCombo(
			aJSON.liste,
			Enumere_Ressource_1.EGenreRessource.Appreciation,
		);
	}
	actionSurRequeteListePaliers(aJSON) {
		if (
			[
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
			].includes(this.etatUtilisateurSco.GenreEspace)
		) {
			this._actionSurRequeteListePaliersPourPrimaire(aJSON);
		} else {
			this._actionSurRequeteListePaliers(aJSON);
		}
	}
	_actionSurRequeteListePaliers(aJSON) {
		aJSON.listePaliers.trier();
		this._construireListePaliers(aJSON.listePaliers);
	}
	_actionSurRequeteListePaliersPourPrimaire(aJSON) {
		const lListe = aJSON.listePaliers;
		lListe.trier();
		let lSelectionParDefaut;
		lListe.parcourir((aElement) => {
			if (aElement.estPrincipal) {
				lSelectionParDefaut = aElement;
			}
		});
		this._remplirCombo(
			lListe,
			Enumere_Ressource_1.EGenreRessource.Palier,
			lSelectionParDefaut,
		);
	}
	actionSurRequeteListeSalles(aJSON) {
		function _ajouterSalle(aListe, aSalle, aProfondeur = 0) {
			const lProfondeur = aProfondeur || 0;
			const lSalle =
				lProfondeur === 0
					? MethodesObjet_1.MethodesObjet.dupliquer(aSalle)
					: aSalle;
			lSalle.profondeur = lProfondeur;
			aListe.addElement(lSalle);
			if (lSalle.liste) {
				lSalle.liste.trier();
				for (let j = 0; j < lSalle.liste.count(); j++) {
					_ajouterSalle(aListe, lSalle.liste.get(j), lProfondeur + 1);
				}
			}
		}
		if (aJSON && aJSON.liste) {
			aJSON.liste.trier();
			this.etatUtilisateurSco.setListeSalles(aJSON.liste);
		}
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		this.etatUtilisateurSco.getListeSalles().parcourir((aSalle) => {
			_ajouterSalle(lListe, aSalle);
		});
		this._remplirCombo(lListe, Enumere_Ressource_1.EGenreRessource.Salle);
	}
	actionSurRequeteListeProfesseurs(aJSON) {
		if (aJSON && aJSON.liste) {
			aJSON.liste.trier();
		}
		this._remplirCombo(
			aJSON.liste,
			Enumere_Ressource_1.EGenreRessource.Enseignant,
		);
	}
	actionSurRequeteListePersonnels(aJSON) {
		let lListePersonnels;
		if (aJSON && aJSON.liste) {
			lListePersonnels = aJSON.liste;
			lListePersonnels.trier();
		}
		this._remplirCombo(
			lListePersonnels,
			Enumere_Ressource_1.EGenreRessource.Personnel,
		);
	}
	_callback(...aParams) {
		setTimeout(
			this._callBackTimeout.bind(this, ...aParams),
			this.delaiFermetureCombo,
		);
	}
	_callBackTimeout(...aParams) {
		if (
			this.callback.pere &&
			this.callback.pere instanceof ObjetIdentite_1.Identite &&
			!this.callback.pere.isDestroyed()
		) {
			this.callback.appel(...aParams);
		}
	}
	_callbackSurMenusDeroulants(aParamCallback) {
		if (this.callbackMenusDeroulants) {
			this.callbackMenusDeroulants.appel(aParamCallback);
		}
	}
	_getOptionsComboCompetence() {
		return { largeurListe: 300 };
	}
	_avecMultiSelectionClasseGroupe() {
		return (
			(this.etatUtilisateurSco.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.RessourcePedagogique &&
				this.etatUtilisateurSco.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Professeur) ||
			this.etatUtilisateurSco.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.PlanningParRessource_Classe ||
			this.etatUtilisateurSco.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.RecapitulatifScolarite
		);
	}
	_getOptionsComboMatiere() {
		const lThis = this;
		const lGetEnteteListe =
			this.etatUtilisateurSco.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.RessourcePedagogique_Partage
				? () => {
						return {
							html: [
								'<div class="csn_entete">',
								'<ie-radio ie-model="radioFiltreMatiere(false)">' +
									ObjetTraduction_1.GTraductions.getValeur(
										"AfficherToutesMatieres",
									) +
									"</ie-radio>" +
									'<ie-radio class="GrandEspaceGauche" ie-model="radioFiltreMatiere(true)">' +
									ObjetTraduction_1.GTraductions.getValeur(
										"UniquementMesMatieres",
									) +
									"</ie-radio>",
								"</div>",
							].join(""),
							controleur: {
								radioFiltreMatiere: {
									getValue(aVal) {
										const lGenreOnglet = GEtatUtilisateur.getGenreOnglet();
										const lLibOnglet =
											GEtatUtilisateur.getLibelleOnglet(lGenreOnglet);
										return (
											GEtatUtilisateur.getInfosSupp(lLibOnglet)
												.uniquementMatieresEnseignees === aVal
										);
									},
									setValue(aValue) {
										const lGenreOnglet = GEtatUtilisateur.getGenreOnglet();
										const lLibOnglet =
											GEtatUtilisateur.getLibelleOnglet(lGenreOnglet);
										GEtatUtilisateur.getInfosSupp(
											lLibOnglet,
										).uniquementMatieresEnseignees = aValue;
										this.instance.setDonneesObjetSaisie({
											liste: lThis._filtrerListeMatiere(),
											deroulerListe: true,
											ignorerSelectionAutomatiqueAvecUnElement: true,
										});
									},
								},
							},
						};
					}
				: null;
		return {
			mode: Enumere_Saisie_1.EGenreSaisie.Combo,
			multiSelection:
				this.etatUtilisateurSco.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.RessourcePedagogique_Partage,
			getClassElement: function (aParams) {
				if (
					aParams &&
					aParams.element &&
					(aParams.element.getNumero() === 0 ||
						(aParams.element.getActif() &&
							GEtatUtilisateur.getGenreOnglet() !==
								Enumere_Onglet_1.EGenreOnglet.RessourcePedagogique_Partage))
				) {
					return "element-distinct";
				}
				return "";
			},
			getInfosElementCB: function (aElement) {
				const lEstCumul = aElement.getNumero() === 0;
				return {
					estCumul: lEstCumul,
					estFilsCumul: function (aFils) {
						return aFils.getNumero() !== 0;
					},
				};
			},
			getEnteteListe: lGetEnteteListe,
		};
	}
	_getOptionsComboClasse() {
		const lOptions = {
			celluleAvecTexteHtml: true,
			estLargeurAuto: true,
			largeurAutoMin: 125,
			largeurAutoMax: 250,
			getEstCumul: (aElement) => {
				return aElement.getNumero() === 0 || aElement.getNumero() === -1;
			},
			getEstFilsDeCumul: (aElementFils, aElementPere) => {
				return aElementFils.getGenre() === aElementPere.getGenre();
			},
		};
		if (this._avecMultiSelectionClasseGroupe()) {
			$.extend(lOptions, {
				mode: Enumere_Saisie_1.EGenreSaisie.Combo,
				multiSelection: true,
				getInfosElementCB: function (aElement) {
					const lEstCumul = aElement.getNumero() === -1;
					return {
						estCumul: lEstCumul,
						estFilsCumul: function (aFils) {
							return aElement.getGenre() === aFils.getGenre();
						},
						setModifierSelection: function (aParametresModifie) {
							if (
								aParametresModifie.elementSourceSelectionne &&
								aElement.getGenre() !==
									aParametresModifie.elementSource.getGenre()
							) {
								return false;
							}
						},
					};
				},
			});
		}
		return lOptions;
	}
	executeEvenementAfficherMessage(aGenreMessage) {
		if (
			this.Pere &&
			"evenementAfficherMessage" in this.Pere &&
			typeof this.Pere.evenementAfficherMessage === "function"
		) {
			this.Pere.evenementAfficherMessage(aGenreMessage);
		}
	}
	_getOptionsComboPilier() {
		const lOptions = {
			largeurListe: 435,
			getClassElement: function (aParams) {
				return aParams.element.Position === -1 ? "element-distinct" : "";
			},
		};
		return lOptions;
	}
	_getLargeurComboClasse() {
		return this.etatUtilisateurSco.pourPrimaire() ? 200 : 150;
	}
	_getLargeurComboService() {
		if (!this.avecServiceClasse && !this.avecServiceProfesseur) {
			return 350;
		} else {
			return (
				200 +
				(this.avecServiceClasse ? 200 : 0) +
				(this.avecServiceProfesseur ? 150 : 0)
			);
		}
	}
	_getOptionsComboService() {
		return {
			largeurListe: this._getLargeurComboService(),
			getClassElement: (aParams) => {
				const T = [];
				if (aParams.element._estSurProfesseur) {
					T.push("element-distinct");
				}
				return T.join(" ");
			},
			getContenuCellule: (aElement) => {
				let lLibelle = aElement.getLibelle();
				if (this.avecServiceClasse && aElement._libelleClasseGroupe) {
					lLibelle += " - " + aElement._libelleClasseGroupe;
				}
				if (this.avecServiceProfesseur && aElement._libelleProfesseurs) {
					lLibelle += " - " + aElement._libelleProfesseurs;
				}
				return lLibelle;
			},
		};
	}
	_getOptionsComboEleve() {
		const lEstMultiSelection = [
			Enumere_Onglet_1.EGenreOnglet.BilanParDomaine,
			Enumere_Onglet_1.EGenreOnglet.PlanningParRessource_Eleve,
			Enumere_Onglet_1.EGenreOnglet.ParcoursEducatif_Bulletin,
			Enumere_Onglet_1.EGenreOnglet.ParcoursEducatif_BullCompetence,
			Enumere_Onglet_1.EGenreOnglet.BilanFinDeCycle,
		].includes(this.etatUtilisateurSco.getGenreOnglet());
		const lOptions = {
			mode: Enumere_Saisie_1.EGenreSaisie.Combo,
			multiSelection: lEstMultiSelection,
			avecBoutonsPrecSuiv: true,
			avecBoutonsPrecSuiv_boucle: true,
		};
		if (lEstMultiSelection && this.avecDeLaClasse) {
			lOptions.getInfosElementCB = function (aElement) {
				return {
					setModifierSelection: function (aParametresModifie) {
						if (
							aParametresModifie.elementSourceSelectionne &&
							aElement.getGenre() !==
								aParametresModifie.elementSource.getGenre()
						) {
							return false;
						}
					},
				};
			};
		}
		return lOptions;
	}
	_getStrMessageSelection(aGenreRessource) {
		let lLabelWAIEdit = "";
		const lGenreMessage = this.getMessageSelection(aGenreRessource);
		if (lGenreMessage >= 0) {
			lLabelWAIEdit =
				ObjetTraduction_1.GTraductions.getValeur("Message")[lGenreMessage];
		}
		return lLabelWAIEdit;
	}
	_creerCombo(aGenreRessource, aLargeur, aOptionsCombo) {
		let lLabelWAIEdit = this._getStrMessageSelection(aGenreRessource);
		const lThis = this;
		return this.add(ObjetSaisiePN_1.ObjetSaisiePN, null, (aInstance) => {
			const lOptions = $.extend(
				{
					longueur: aLargeur - 16,
					initAutoSelectionAvecUnElement: false,
					labelWAICellule: lLabelWAIEdit || "",
					surValidation: function (aParams) {
						if (
							(aParams.element && !aParams.estComboMultiSelection) ||
							(aParams.listeSelections && aParams.estComboMultiSelection)
						) {
							if (
								aParams.listeSelections &&
								aParams.estComboMultiSelection &&
								aParams.listeSelections.count() === 0
							) {
								if (aParams.element) {
									let lLibelle = aParams.element.getLibelle();
									aParams.combo.setContenu(lLibelle);
								} else {
									aParams.combo.setContenu(
										lThis.getLibelleMenu(aGenreRessource),
									);
								}
							}
							lThis.evenementCombo(aParams, aParams.element, aGenreRessource);
						}
					},
				},
				aOptionsCombo,
			);
			aInstance.setOptionsObjetSaisie(lOptions);
			aInstance.setControleNavigation(lThis.ControleNavigation);
		});
	}
	async _requeteListeMatiere() {
		if (
			this.etatUtilisateurSco.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.RessourcePedagogique_Partage
		) {
			const lListe = this._filtrerListeMatiere();
			this._remplirCombo(lListe, Enumere_Ressource_1.EGenreRessource.Matiere);
			return;
		}
		this.actionSurRequeteListeMatieres(
			await new ObjetRequeteListes_1.ObjetRequeteListes_ListeMatieres(
				this,
			).lancerRequete(this.donneesRequete),
		);
	}
	_filtrerListeMatiere() {
		const lGenreOnglet = this.etatUtilisateurSco.getGenreOnglet();
		const lLibOnglet = this.etatUtilisateurSco.getLibelleOnglet(lGenreOnglet);
		const lUniquementMatieresEnseignees =
			this.etatUtilisateurSco.getInfosSupp(
				lLibOnglet,
			).uniquementMatieresEnseignees;
		const lListe = this.etatUtilisateurSco.listeMatieres.getListeElements(
			(D) => {
				return (
					(!!D.estUtilise || !!this.applicationSco.estPrimaire) &&
					(lUniquementMatieresEnseignees ? D.estEnseignee : true)
				);
			},
		);
		lListe.parcourir((D) => {
			D.Genre = Enumere_Ressource_1.EGenreRessource.Matiere;
		});
		const lElement = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur("TousSelectionner"),
			0,
			Enumere_Ressource_1.EGenreRessource.Matiere,
			null,
		);
		lListe.addElement(lElement);
		lListe.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				return D.getNumero() !== 0;
			}),
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		lListe.trier();
		return lListe;
	}
	_remplirCombo(
		aListe,
		aGenreRessource,
		aElementParDefaut = null,
		aElementForceSiNonTrouve = null,
	) {
		let lTrouve = false;
		let lAucunElement = true;
		const lCombo = this.getInstance(this.getIdentCombo(aGenreRessource));
		lCombo.setControleNavigation(this.ControleNavigation);
		lCombo.setDonnees(
			new ObjetListeElements_1.ObjetListeElements().add(aListe),
			null,
			true,
		);
		if (!aListe || aListe.count() === 0) {
			const lGenreMessageAucunElement =
				this.getMessageAucunElement(aGenreRessource);
			this.executeEvenementAfficherMessage(lGenreMessageAucunElement);
			ObjetStyle_1.GStyle.setVisible(lCombo.getNom(), true);
			if (!!lGenreMessageAucunElement) {
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message:
						ObjetTraduction_1.GTraductions.getValeur("Message")[
							lGenreMessageAucunElement
						],
				});
			}
		} else {
			const lRessources =
				this.etatUtilisateurSco.Navigation.getRessources(aGenreRessource);
			lAucunElement = false;
			if (lCombo.estComboMultiSelection()) {
				if (lRessources) {
					lTrouve = lCombo.setListeSelections(lRessources);
				}
			} else {
				const lElm =
					lRessources && lRessources.count() > 0 ? lRessources.get(0) : null;
				const lExisteDansListe = !!lElm && !!aListe.getElementParElement(lElm);
				if (lExisteDansListe) {
					lTrouve = lCombo.setSelectionParNumeroEtGenre(
						lRessources.getNumero(0),
						lRessources.getGenre(0),
					);
				} else if (aElementParDefaut) {
					lTrouve = lCombo.setSelectionParNumeroEtGenre(
						aElementParDefaut.getNumero(),
					);
				}
			}
			if (!lTrouve && aElementForceSiNonTrouve) {
				lTrouve = lCombo.setSelectionParNumeroEtGenre(
					aElementForceSiNonTrouve.getNumero(),
					aElementForceSiNonTrouve.getGenre(),
				);
			}
			if (!lTrouve) {
				if (aListe.count() === 1) {
					lTrouve = lCombo.setSelectionParNumeroEtGenre(
						aListe.getNumero(0),
						aListe.getGenre(0),
					);
				} else {
					lCombo.initSelection(-1);
					this.evenementCombo({}, undefined, aGenreRessource);
				}
			}
			if (this.combosAMasquer.includes(aGenreRessource)) {
				ObjetStyle_1.GStyle.setVisible(lCombo.getNom(), false);
			} else {
				ObjetStyle_1.GStyle.setVisible(lCombo.getNom(), true);
			}
		}
		if (!lTrouve) {
			lCombo.setContenu(this.getLibelleMenu(aGenreRessource));
			const lParam = {
				genreEvenement:
					Enumere_EvntMenusDeroulants_1.EGenreEvntMenusDeroulants
						.ressourceNonTrouve,
				genreCombo: aGenreRessource,
				aucunElement: lAucunElement,
			};
			this._callbackSurMenusDeroulants(lParam);
		}
	}
	_actionSurRequeteListePeriodes(aJSON) {
		this.etatUtilisateurSco.setOngletListePeriodes(aJSON.listePeriodes);
		this.etatUtilisateurSco.setOngletPeriodeParDefaut(aJSON.periodeParDefaut);
		this._remplirCombo(
			aJSON.listePeriodes,
			Enumere_Ressource_1.EGenreRessource.Periode,
			aJSON.periodeParDefaut,
		);
	}
	_construireListePaliers(aListe) {
		this._remplirCombo(aListe, Enumere_Ressource_1.EGenreRessource.Palier);
	}
	_actionSurRequeteListeMateriels(aJSON) {
		let lListeMateriels;
		if (aJSON && aJSON.liste) {
			lListeMateriels = aJSON.liste;
			lListeMateriels.trier();
		}
		this._remplirCombo(
			lListeMateriels,
			Enumere_Ressource_1.EGenreRessource.Materiel,
		);
	}
}
exports.ObjetAffichagePageAvecMenusDeroulants =
	ObjetAffichagePageAvecMenusDeroulants;
