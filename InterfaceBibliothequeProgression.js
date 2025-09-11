exports.InterfaceBibliothequeProgression = void 0;
const DonneesListe_BibliothequeProgression_1 = require("DonneesListe_BibliothequeProgression");
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_Event_1 = require("Enumere_Event");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetWAI_1 = require("ObjetWAI");
const InterfacePage_1 = require("InterfacePage");
const ObjetFenetre_Progression_1 = require("ObjetFenetre_Progression");
const ObjetRequeteListeCDTProgressions_1 = require("ObjetRequeteListeCDTProgressions");
const ObjetRequeteSaisieCDTProgressions_1 = require("ObjetRequeteSaisieCDTProgressions");
const UtilitaireVisuProgression_1 = require("UtilitaireVisuProgression");
class InterfaceBibliothequeProgression extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		const lId = GUID_1.GUID.getId();
		this.idProgression = lId + "_prog";
		this.idProgressionConteneur = lId + "_progCont";
		this.ajouterEvenementGlobal(
			Enumere_Event_1.EEvent.SurPreResize,
			this._surPreResize,
		);
		this.ajouterEvenementGlobal(
			Enumere_Event_1.EEvent.SurPostResize,
			this._surPostResize,
		);
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListe,
			this._initialiserListe,
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnAjouter: {
				event: function () {
					aInstance._ouvrirFenetreAjouterProgression();
				},
			},
		});
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.AddSurZone = [
			{
				html:
					'<div class="EspaceGauche"><ie-bouton ie-model="btnAjouter" class="small-bt" title="' +
					ObjetChaine_1.GChaine.toTitle(
						ObjetTraduction_1.GTraductions.getValeur(
							"progression.AjouterVosProgressions",
						),
					) +
					'" aria-haspopup="dialog">' +
					ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.Ajouter") +
					"</ie-bouton></div>",
			},
		];
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(`<div class="flex-contain full-size flex-gap-l p-all-l">`);
		H.push(
			`<div class="fix-bloc" id="${this.getNomInstance(this.identListe)}" style="width: 500px;"></div>`,
		);
		H.push(
			`<div class="fluid-bloc flex-contain" id="${this.idProgressionConteneur}" ${ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Document)} tabindex="0">`,
		);
		H.push(
			`<div  class="fluid-bloc" id="${this.idProgression}" style="overflow-y:auto;"></div>`,
		);
		H.push(`</div>`);
		H.push(`</div>`);
		return H.join("");
	}
	recupererDonnees() {
		new ObjetRequeteListeCDTProgressions_1.ObjetRequeteListeCDTProgressions(
			this,
			this._actionSurRecupererDonnees.bind(this),
		).lancerRequete({
			AvecMatiereNiveau: true,
			avecListeCategorieEtDocJoints: false,
			avecListeProgrammesNiveaux: true,
			toutesLesProgressionsPublics: true,
			avecDossierProgression: false,
		});
	}
	afficherPage() {
		this._viderProgramme();
		this.recupererDonnees();
	}
	_surPreResize() {
		this._viderProgramme();
	}
	_surPostResize() {
		this._remplirProgramme();
	}
	_getProgressionsPersonnels() {
		const lListeProgressions = new ObjetListeElements_1.ObjetListeElements();
		this.donnees.listeProgressions.parcourir((D) => {
			if (!D.nonPersonnel) {
				lListeProgressions.addElement(D);
			}
		});
		return lListeProgressions;
	}
	_surEvenementFenetreAjouterProgression(
		aBackupListeProgression,
		aNumeroBouton,
	) {
		this.setEtatSaisie(false);
		if (aNumeroBouton !== 1) {
			this.donnees.listeProgressions = aBackupListeProgression;
			return;
		}
		new ObjetRequeteSaisieCDTProgressions_1.ObjetRequeteSaisieCDTProgressions(
			this,
			this.afficherPage,
		).lancerRequete(this.donnees.listeProgressions);
	}
	_ouvrirFenetreAjouterProgression() {
		const lListeProgressions = this._getProgressionsPersonnels(),
			lBackup = MethodesObjet_1.MethodesObjet.dupliquer(
				this.donnees.listeProgressions,
			);
		const lInstance = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			{
				pere: this,
				evenement: this._surEvenementFenetreAjouterProgression.bind(
					this,
					lBackup,
				),
				initialiser: function (aInstance) {
					const lColonnesFenetreAjoutProgressions = [];
					lColonnesFenetreAjoutProgressions.push({
						id: DonneesColonnes.coche,
						titre: { estCoche: true },
						taille: 20,
					});
					lColonnesFenetreAjoutProgressions.push({
						id: DonneesColonnes.libelle,
						titre: ObjetTraduction_1.GTraductions.getValeur("Nom"),
						taille: "100%",
					});
					lColonnesFenetreAjoutProgressions.push({
						id: DonneesColonnes.niveau,
						titre: ObjetTraduction_1.GTraductions.getValeur("Niveau"),
						taille: 150,
					});
					lColonnesFenetreAjoutProgressions.push({
						id: DonneesColonnes.matiere,
						titre: ObjetTraduction_1.GTraductions.getValeur("Matiere"),
						taille: 150,
					});
					const lParamsListe = {
						optionsListe: { colonnes: lColonnesFenetreAjoutProgressions },
					};
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"progression.AjouterVosProgressions",
						),
						largeur: 620,
						hauteur: 250,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
						modeActivationBtnValider:
							aInstance.modeActivationBtnValider.toujoursActifs,
					});
					aInstance.paramsListe = lParamsListe;
				},
			},
		);
		lInstance.setDonnees(
			new DonneesListe_Progression_AjoutBibliotheque(lListeProgressions),
		);
	}
	_surEvenementFenetreProgression(
		aProgressionSelectionnee,
		aBackupListeProgression,
		aListeProgressionsFenetre,
		aNumeroBouton,
		aIndiceSelection,
	) {
		this.setEtatSaisie(false);
		if (aNumeroBouton !== 1) {
			this.donnees.listeProgressions = aBackupListeProgression;
			return;
		}
		const lProgressionCible = aListeProgressionsFenetre.get(aIndiceSelection);
		if (lProgressionCible) {
			lProgressionCible.creationAutomatique = true;
			lProgressionCible.copieReference = aProgressionSelectionnee;
			lProgressionCible.avecOptionsProgression = true;
			new ObjetRequeteSaisieCDTProgressions_1.ObjetRequeteSaisieCDTProgressions(
				this,
				this.afficherPage,
			).lancerRequete(this.donnees.listeProgressions);
		}
	}
	_callbackCreationProgression(aIndice, aProgression) {
		this.setEtatSaisie(false);
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		lListe.addElement(aProgression);
		new ObjetRequeteSaisieCDTProgressions_1.ObjetRequeteSaisieCDTProgressions(
			this,
			this.afficherPage,
		).lancerRequete(lListe);
	}
	_callbackMenuContextuelListe(aMenu, aProgressionAffichage) {
		const lListeProgressions = this._getProgressionsPersonnels(),
			lBackup = MethodesObjet_1.MethodesObjet.dupliquer(
				this.donnees.listeProgressions,
			);
		const lInstance = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Progression_1.ObjetFenetre_Progression,
			{
				pere: this,
				evenement: this._surEvenementFenetreProgression.bind(
					this,
					aProgressionAffichage.source,
					lBackup,
					lListeProgressions,
				),
			},
			{
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"progression.CopierLaProgressionVers",
				),
			},
		);
		lInstance.setDonnees({
			progressionSource: null,
			listeProgressions: lListeProgressions,
			listeProgressionsPublicPourCopie:
				this.donnees.listeProgressionsPublicPourCopie,
			listeNiveaux: this.donnees.listeNiveaux,
			avecCreation: true,
			callbackFinCreation: this._callbackCreationProgression.bind(this),
		});
	}
	_actionSurRecupererDonnees(
		aListeProgressions,
		aListeNiveaux,
		aListeCategories,
		aListeDocumentsJoints,
		aListeProgressionsPublicPourCopie,
	) {
		this.donnees = {
			listeProgressions: aListeProgressions,
			listeProgressionsPublicPourCopie: aListeProgressionsPublicPourCopie,
			listeNiveaux: aListeNiveaux,
		};
		const lListe = this.getInstance(this.identListe);
		lListe.setDonnees(
			new DonneesListe_BibliothequeProgression_1.DonneesListe_BibliothequeProgression(
				{
					donnees: aListeProgressions,
					callbackMenuContextuel: this._callbackMenuContextuelListe.bind(this),
				},
			),
		);
		let lIndice = -1;
		if (this._ligneCourante) {
			lIndice = lListe
				.getListeArticles()
				.getIndiceParElement(this._ligneCourante);
			if (lIndice >= 0) {
				lListe.selectionnerLigne({
					ligne: lIndice,
					avecScroll: true,
					avecEvenement: true,
				});
			}
		}
	}
	_initialiserListe(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_BibliothequeProgression_1
				.DonneesListe_BibliothequeProgression.colonnes.libelle,
			taille: 480,
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.deployer }],
		});
	}
	_evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
				const lLigne = this.getInstance(this.identListe)
					.getListeArticles()
					.get(aParametres.ligne);
				this._ligneCourante = lLigne;
				this._viderProgramme();
				if (lLigne.estUnDeploiement) {
					return;
				}
				if (lLigne.htmlProgression) {
					this._remplirProgramme();
					return;
				}
				new ObjetRequeteListeCDTProgressions_1.ObjetRequeteListeCDTProgressions(
					this,
					(aListeProgressions) => {
						if (aListeProgressions && aListeProgressions.get(0)) {
							lLigne.htmlProgression =
								UtilitaireVisuProgression_1.UtilitaireVisuProgression.composeProgression(
									aListeProgressions.get(0),
								);
							this._remplirProgramme();
						}
					},
				).lancerRequete({
					AvecMatiereNiveau: false,
					avecListeCategorieEtDocJoints: false,
					avecListeProgrammesNiveaux: false,
					toutesLesProgressionsPublics: false,
					avecDossierProgression: true,
					avecContenuDossier: true,
					progressionDemande: lLigne,
				});
				break;
			}
		}
	}
	_viderProgramme() {
		ObjetHtml_1.GHtml.setHtml(this.idProgression, "");
		$("#" + this.idProgression.escapeJQ()).height(0);
	}
	_remplirProgramme() {
		if (this._ligneCourante && this._ligneCourante.htmlProgression) {
			const lJqProgramme = $("#" + this.idProgression.escapeJQ());
			const lHeight = $("#" + this.idProgressionConteneur.escapeJQ()).height();
			lJqProgramme.height(lHeight);
			ObjetHtml_1.GHtml.setHtml(
				this.idProgression.escapeJQ(),
				this._ligneCourante.htmlProgression || "",
				{ controleur: this.controleur },
			);
		}
	}
}
exports.InterfaceBibliothequeProgression = InterfaceBibliothequeProgression;
class DonneesListe_Progression_AjoutBibliotheque extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecSelection: false,
			avecSuppression: false,
			avecEtatSaisie: false,
		});
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesColonnes.coche:
				return !!aParams.article.estPublic;
			case DonneesColonnes.libelle:
				return aParams.article.getLibelle();
			case DonneesColonnes.niveau:
				return !!aParams.article.niveau
					? aParams.article.niveau.getLibelle()
					: "";
			case DonneesColonnes.matiere:
				return !!aParams.article.matiere
					? aParams.article.matiere.getLibelle()
					: "";
		}
		return "";
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesColonnes.coche:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	avecEdition(aParams) {
		return aParams.idColonne === DonneesColonnes.coche;
	}
	getColonneTransfertEdition() {
		return DonneesColonnes.coche;
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesColonnes.coche:
				aParams.article.estPublic = V;
				break;
			default:
		}
	}
}
var DonneesColonnes;
(function (DonneesColonnes) {
	DonneesColonnes["coche"] = "DL_AjoutBibliotheque_coche";
	DonneesColonnes["libelle"] = "DL_AjoutBibliotheque_libelle";
	DonneesColonnes["niveau"] = "DL_AjoutBibliotheque_niveau";
	DonneesColonnes["matiere"] = "DL_AjoutBibliotheque_matiere";
})(DonneesColonnes || (DonneesColonnes = {}));
