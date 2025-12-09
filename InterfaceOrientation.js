exports.InterfaceOrientation = exports.EGenreEcranOrientation = void 0;
const ObjetInterfacePageCP_1 = require("ObjetInterfacePageCP");
const PageOrientation_1 = require("PageOrientation");
const ObjetRequetePageOrientations_1 = require("ObjetRequetePageOrientations");
const ObjetSelection_1 = require("ObjetSelection");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetTraduction_1 = require("ObjetTraduction");
const MoteurSelectionContexte_1 = require("MoteurSelectionContexte");
const ObjetListe_1 = require("ObjetListe");
const ObjetIdentite_1 = require("ObjetIdentite");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const GUID_1 = require("GUID");
const DonneesListe_RubriqueOrientation_1 = require("DonneesListe_RubriqueOrientation");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const AccessApp_1 = require("AccessApp");
const ObjetListeElements_1 = require("ObjetListeElements");
var EGenreEcranOrientation;
(function (EGenreEcranOrientation) {
	EGenreEcranOrientation["filtre"] = "filtre";
	EGenreEcranOrientation["saisie"] = "saisie";
})(
	EGenreEcranOrientation ||
		(exports.EGenreEcranOrientation = EGenreEcranOrientation = {}),
);
class InterfaceOrientation extends ObjetInterfacePageCP_1.InterfacePageCP {
	constructor(...aParams) {
		super(...aParams);
		this.moteurSelectionContexte =
			new MoteurSelectionContexte_1.MoteurSelectionContexte();
		this.setOptionsEcrans({ nbNiveaux: 2, avecBascule: !!IE.estMobile });
		this.contexte = Object.assign(this.contexte, {
			ecran: [EGenreEcranOrientation.filtre, EGenreEcranOrientation.saisie],
			niveauCourant: 0,
		});
		this.ids = {
			message: GUID_1.GUID.getId(),
			zoneRubrique: GUID_1.GUID.getId(),
			zoneSaisie: GUID_1.GUID.getId(),
		};
		this.estProfesseur = [
			Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
			Enumere_Espace_1.EGenreEspace.Professeur,
		].includes(GEtatUtilisateur.GenreEspace);
		this.indiceRubrique = 0;
	}
	construireInstances() {
		this.instanceListeRubrique = ObjetIdentite_1.Identite.creerInstance(
			ObjetListe_1.ObjetListe,
			{
				pere: this,
				evenement: (aParametres) => {
					switch (aParametres.genreEvenement) {
						case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
							if (aParametres.article) {
								this.indiceRubrique = aParametres.ligne;
								this.rubriqueSelectionne = aParametres.article;
								this.changerEcran({
									src: this.getNiveauDeGenreEcran({
										genreEcran: EGenreEcranOrientation.filtre,
									}),
									dest: this.getNiveauDeGenreEcran({
										genreEcran: EGenreEcranOrientation.saisie,
									}),
								});
							}
							break;
					}
				},
			},
		);
		if (this.estProfesseur) {
			this.identComboClasse = this.add(
				ObjetSelection_1.ObjetSelection,
				this._evntSelecteur.bind(this, {
					genreSelecteur: Enumere_Ressource_1.EGenreRessource.Classe,
					genreSelecteurSuivant: Enumere_Ressource_1.EGenreRessource.Eleve,
					estDernierSelecteur: false,
				}),
				this._initSelecteur.bind(
					this,
					Enumere_Ressource_1.EGenreRessource.Classe,
				),
			);
			this.identComboEleve = this.add(
				ObjetSelection_1.ObjetSelection,
				this._evntSelecteur.bind(this, {
					genreSelecteur: Enumere_Ressource_1.EGenreRessource.Eleve,
					genreSelecteurSuivant: null,
					estDernierSelecteur: true,
				}),
				this._initSelecteur.bind(
					this,
					Enumere_Ressource_1.EGenreRessource.Eleve,
				),
			);
			this.AddSurZone.push(this.identComboClasse);
			this.AddSurZone.push(this.identComboEleve);
		}
		this.identPage = this.add(
			PageOrientation_1.PageOrientation,
			() => {
				this.requeteOrientation();
			},
			null,
		);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identPage;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const lClassBascule = this.optionsEcrans.avecBascule ? "mono" : "multi";
		const lStyleEcran = this.optionsEcrans.avecBascule && { display: "none" };
		const lJSXBtnTexteInfo = () => {
			var _a, _b;
			return (_b =
				(_a = this.donnees) === null || _a === void 0
					? void 0
					: _a.texteNiveau) === null || _b === void 0
				? void 0
				: _b.LibelleBouton;
		};
		const lJSXTexteInfoDisplay = () => {
			var _a, _b, _c, _d;
			return (
				((_b =
					(_a = this.donnees) === null || _a === void 0
						? void 0
						: _a.texteNiveau) === null || _b === void 0
					? void 0
					: _b.LibelleBouton) !== "" &&
				((_d =
					(_c = this.donnees) === null || _c === void 0
						? void 0
						: _c.texteNiveau) === null || _d === void 0
					? void 0
					: _d.TexteInformatif) !== ""
			);
		};
		return IE.jsx.str(
			"div",
			{ class: ["InterfaceOrientation", "full-height", lClassBascule] },
			IE.jsx.str(
				"div",
				{
					id: this.getIdDeNiveau({
						niveauEcran: this.getNiveauDeGenreEcran({
							genreEcran: EGenreEcranOrientation.filtre,
						}),
					}),
					style: lStyleEcran,
					class: [
						"ctn-gauche",
						lClassBascule,
						Divers_css_1.StylesDivers.fullHeight,
						Divers_css_1.StylesDivers.flexContain,
						Divers_css_1.StylesDivers.flexCols,
					],
				},
				IE.jsx.str(
					"div",
					{
						class: [
							Divers_css_1.StylesDivers.mAllXl,
							Divers_css_1.StylesDivers.fixBloc,
						],
					},
					IE.jsx.str("ie-bouton", {
						"ie-model": this.jsxModelBoutonTexteNiveau.bind(this),
						"ie-html": lJSXBtnTexteInfo,
						"ie-display": lJSXTexteInfoDisplay,
						"aria-haspopup": "dialog",
					}),
				),
				IE.jsx.str("div", {
					id: this.instanceListeRubrique.getNom(),
					class: [Divers_css_1.StylesDivers.fluidBloc],
				}),
			),
			IE.jsx.str(
				"div",
				{
					id: this.getIdDeNiveau({
						niveauEcran: this.getNiveauDeGenreEcran({
							genreEcran: EGenreEcranOrientation.saisie,
						}),
					}),
					style: lStyleEcran,
					class: ["ctn-centre", lClassBascule],
				},
				this.composeContenuePageProfonde(
					this.getNiveauDeGenreEcran({
						genreEcran: EGenreEcranOrientation.saisie,
					}),
					IE.jsx.str("div", {
						id: this.getNomInstance(this.identPage),
						class: [Divers_css_1.StylesDivers.fullHeight],
					}),
				),
			),
			IE.jsx.str("div", { style: { display: "none" }, id: this.ids.message }),
		);
	}
	async requeteOrientation() {
		var _a, _b, _c;
		let lReponse;
		this.setEtatSaisie(false);
		if (this.estProfesseur) {
			if (this.numeroClasse && this.eleve) {
				lReponse =
					await new ObjetRequetePageOrientations_1.ObjetRequetePageOrientations(
						this,
					).lancerRequete({ eleve: this.eleve, classe: this.numeroClasse });
			} else {
				this.moteurSelectionContexte.getListeClasses({
					pere: this,
					clbck: (aParam) => {
						this.moteurSelectionContexte.remplirSelecteur(
							$.extend({}, aParam, {
								instance: this.getInstance(this.identComboClasse),
								genreRessource: Enumere_Ressource_1.EGenreRessource.Classe,
								pere: this,
								clbck: this.afficher.bind(this),
							}),
						);
					},
				});
			}
		} else {
			this.eleve = GEtatUtilisateur.getMembre()
				? GEtatUtilisateur.getMembre()
				: undefined;
			lReponse =
				await new ObjetRequetePageOrientations_1.ObjetRequetePageOrientations(
					this,
				).lancerRequete();
		}
		this.donnees = lReponse;
		if (
			(_a = this.donnees) === null || _a === void 0
				? void 0
				: _a.listeOrientations
		) {
			this.formatListeOrientations();
		}
		if (
			(_b = this.donnees) === null || _b === void 0 ? void 0 : _b.listeRubriques
		) {
			this.afficherEcranFiltre();
			if (this.rubriqueSelectionne) {
				this.rubriqueSelectionne = this.donnees.listeRubriques.get(
					this.indiceRubrique,
				);
				this.afficherEcranSaisie();
			} else {
				this.changerEcran({
					src: null,
					dest: this.getNiveauDeGenreEcran({
						genreEcran: EGenreEcranOrientation.filtre,
					}),
				});
			}
		} else if (
			(_c = this.donnees) === null || _c === void 0 ? void 0 : _c.Message
		) {
			this.afficher(this.composeAucuneDonnee(lReponse.Message));
		}
	}
	_initSelecteur(aGenre, aInstance) {
		let lLabel = "";
		switch (aGenre) {
			case Enumere_Ressource_1.EGenreRessource.Classe:
				lLabel = ObjetTraduction_1.GTraductions.getValeur(
					"WAI.ListeSelectionClasse",
				);
				break;
			case Enumere_Ressource_1.EGenreRessource.Eleve:
				lLabel = ObjetTraduction_1.GTraductions.getValeur(
					"WAI.ListeSelectionEleve",
				);
				break;
			case Enumere_Ressource_1.EGenreRessource.Aucune:
				lLabel = ObjetTraduction_1.GTraductions.getValeur(
					"WAI.SelectionRubrique",
				);
				break;
		}
		aInstance.setParametres({
			avecBoutonsPrecedentSuivant: true,
			icone: null,
			labelWAICellule: lLabel,
			controleNavigation: true,
		});
	}
	_evntSelecteur(aContexte, aParam) {
		if (!aContexte.estDernierSelecteur) {
			this.numeroClasse = !!aParam.element ? aParam.element : 0;
			this.moteurSelectionContexte.getListeEleves({
				classe: aParam.element,
				pere: this,
				clbck: (aParam) => {
					this.moteurSelectionContexte.remplirSelecteur(
						$.extend({}, aParam, {
							instance: this.getInstance(this.identComboEleve),
							genreRessource: Enumere_Ressource_1.EGenreRessource.Eleve,
							pere: this,
							clbck: this.afficher.bind(this),
						}),
					);
				},
			});
		} else {
			this.eleve = !!aParam.element ? aParam.element : undefined;
			this.requeteOrientation();
		}
	}
	recupererDonnees() {
		this.requeteOrientation();
	}
	changerEcran(aParams) {
		const lEcranSrc = {
			niveauEcran: aParams.src,
			genreEcran: this.getCtxEcran({ niveauEcran: aParams.src }),
		};
		const lEcranDest = {
			niveauEcran: aParams.dest,
			genreEcran: this.getCtxEcran({ niveauEcran: aParams.dest }),
		};
		super.basculerEcran(lEcranSrc, lEcranDest);
	}
	construireEcran(aEcran) {
		switch (aEcran.genreEcran) {
			case EGenreEcranOrientation.filtre: {
				this.afficherEcranFiltre();
				break;
			}
			case EGenreEcranOrientation.saisie:
				this.afficherEcranSaisie();
				break;
			default:
		}
	}
	getIdBandeauEcran(aNiveauEcran) {
		return `${this.Nom}_idBandeau_${this.getCtxEcran({ niveauEcran: aNiveauEcran })}_${aNiveauEcran}`;
	}
	composeContenuePageProfonde(aNiveauEcran, aHtml) {
		const lGetLibelleHtml = () => {
			var _a;
			return (_a =
				this === null || this === void 0
					? void 0
					: this.rubriqueSelectionne) === null || _a === void 0
				? void 0
				: _a.titre;
		};
		return IE.jsx.str(
			"div",
			{
				class: [
					"ctn-ecran-bandeau",
					Divers_css_1.StylesDivers.flexContain,
					Divers_css_1.StylesDivers.cols,
				],
			},
			this.optionsEcrans.avecBascule &&
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					this.optionsEcrans.avecBascule &&
						this.construireBandeauEcran(
							IE.jsx.str("p", {
								class: "titre-ecran",
								id: this.getIdBandeauEcran(aNiveauEcran),
								"ie-html": lGetLibelleHtml,
							}),
						),
				),
			IE.jsx.str(
				"div",
				{ class: [Divers_css_1.StylesDivers.fluidBloc] },
				aHtml,
			),
		);
	}
	afficherEcranFiltre() {
		this.instanceListeRubrique
			.setOptionsListe({
				skin: ObjetListe_1.ObjetListe.skin.flatDesign,
				ariaLabel: () =>
					(0, AccessApp_1.getApp)().getEtatUtilisateur().getLibelleLongOnglet(),
			})
			.setDonnees(
				new DonneesListe_RubriqueOrientation_1.DonneesListe_RubriqueOrientation(
					this.donnees.listeRubriques,
				),
			);
	}
	afficherEcranSaisie() {
		this.getInstance(this.identPage).setDonnees({
			rubrique: this.rubriqueSelectionne,
			listeOrientations: this.donnees.listeOrientations,
			eleve: this.eleve,
		});
	}
	jsxModelBoutonTexteNiveau() {
		return {
			event: () => {
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						titre: this.donnees.texteNiveau.LibelleBouton,
						message: this.donnees.texteNiveau.TexteInformatif,
					});
			},
		};
	}
	formatListeOrientations() {
		const lDonneesAcRegroup = new ObjetListeElements_1.ObjetListeElements();
		let lLigne, lPere;
		this.donnees.listeOrientations.parcourir((aLigne) => {
			lLigne = aLigne;
			if (aLigne.getGenre() === undefined) {
				lLigne.estUnDeploiement = true;
				lLigne.estDeploye = true;
				lPere = lLigne;
			} else {
				lLigne.pere = lPere;
			}
			lDonneesAcRegroup.addElement(lLigne);
		});
		this.donnees.listeOrientations = lDonneesAcRegroup;
	}
	valider() {
		this.getInstance(this.identPage).surValidation();
	}
}
exports.InterfaceOrientation = InterfaceOrientation;
