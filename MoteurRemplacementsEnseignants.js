exports.RemplacementsEnseignants = exports.MoteurRemplacementsEnseignants =
	void 0;
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetDate_1 = require("ObjetDate");
const ObjetElement_1 = require("ObjetElement");
const MethodesObjet_1 = require("MethodesObjet");
const TypeAffichageRemplacements_1 = require("TypeAffichageRemplacements");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const TypeGenreCoursRemplacable_1 = require("TypeGenreCoursRemplacable");
const ObjetRequeteListePublics_1 = require("ObjetRequeteListePublics");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetTri_1 = require("ObjetTri");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetTraduction_1 = require("ObjetTraduction");
const jsx_1 = require("jsx");
class MoteurRemplacementsEnseignants {
	constructor(aTypeAffichage) {
		this.applicationSco = GApplication;
		this.actualiserDonnees = false;
		this.choixUniquementMesModifie = false;
		const lObjEtatUtilisateur = GEtatUtilisateur;
		const lListeMat = lObjEtatUtilisateur.listeMatieres.getListeElements(
			(aMatiere) => {
				return aMatiere.estUtilise;
			},
		);
		const lListeClasses = lObjEtatUtilisateur.getListeClasses({
			avecClasse: true,
			avecGroupe: false,
			uniquementClasseEnseignee: false,
		});
		const lMatieresEns = lListeMat.getListeElements((aMatiere) => {
			return aMatiere.estEnseignee;
		});
		const lMesClasses = lListeClasses.getListeElements((aClasse) => {
			return aClasse.enseigne;
		});
		this.listes = {
			matieres: lListeMat,
			classes: lListeClasses,
			mesMatieres: lMatieresEns,
			mesClasses: lMesClasses,
		};
		this.listeAff = this.construireListeRubriques();
		this.affichageCourant = this.getArticleAffichageDeType(aTypeAffichage);
		this.affichageHisto = this.affichageCourant;
	}
	getArticleAffichageDeType(aTypeAffichage) {
		return this.listeAff.getElementParGenre(aTypeAffichage);
	}
	setAffichageCourant(aTypeAffichage) {
		this.affichageHisto = this.affichageCourant;
		this.affichageCourant = this.getArticleAffichageDeType(aTypeAffichage);
		if (this.affichageHisto.getGenre() !== aTypeAffichage) {
			this.actualiserDonnees = true;
		}
	}
	avecActualiserDonnees() {
		if (this.actualiserDonnees) {
			this.actualiserDonnees = false;
			return true;
		}
	}
	getListeRubriques() {
		return this.listeAff;
	}
	construireListeRubriques() {
		const lResult = new ObjetListeElements_1.ObjetListeElements();
		let lPos = 1;
		for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
			TypeAffichageRemplacements_1.TypeAffichageRemplacements,
		)) {
			const lValue =
				TypeAffichageRemplacements_1.TypeAffichageRemplacements[lKey];
			if (
				[
					TypeAffichageRemplacements_1.TypeAffichageRemplacements
						.tarPropositions,
					TypeAffichageRemplacements_1.TypeAffichageRemplacements
						.tarMesRemplacementsAVenir,
					TypeAffichageRemplacements_1.TypeAffichageRemplacements
						.tarMesRemplacementsPasses,
				].includes(lValue) ||
				(lValue ===
					TypeAffichageRemplacements_1.TypeAffichageRemplacements
						.tarVolontaire &&
					this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.sePorterVolontaireRemplacement,
					))
			) {
				const lFiltreDefault = this.getFiltreDefaultDeType(lValue);
				const lElement = ObjetElement_1.ObjetElement.create({
					Libelle:
						TypeAffichageRemplacements_1.TypeAffichageRemplacementsUtil.getLibelle(
							lValue,
						),
					Genre: lValue,
					Position: lPos,
					icon: TypeAffichageRemplacements_1.TypeAffichageRemplacementsUtil.getClassIcone(
						lValue,
					),
					filtre: lFiltreDefault,
					paramRequete: {
						de: lFiltreDefault.de,
						a: lFiltreDefault.a,
						type: lFiltreDefault.type,
						uniquementMesMatieresClasses:
							lFiltreDefault.uniquementMesMatieresClasses,
					},
				});
				lPos++;
				lResult.addElement(lElement);
			}
		}
		return lResult;
	}
	initFiltre(aArticleAffichage) {
		aArticleAffichage.filtre = this.getFiltreDefaultDeType(
			aArticleAffichage.getGenre(),
		);
	}
	estFiltreParDefault() {
		const lFiltreDefault = this.getFiltreDefaultDeType(
			this.affichageCourant.getGenre(),
		);
		const lEstMemePeriode =
			ObjetDate_1.GDate.estDateEgale(
				lFiltreDefault.a,
				this.affichageCourant.filtre.a,
			) &&
			ObjetDate_1.GDate.estDateEgale(
				lFiltreDefault.de,
				this.affichageCourant.filtre.de,
			);
		const lEstFiltreProfDefault =
			this.affichageCourant.filtre.profs.count() === 0 ||
			(this.listes &&
				this.listes.profs &&
				this.listes.profs.listePublic.count() ===
					this.affichageCourant.filtre.profs.count());
		const lEstFiltreMatDefault =
			this.affichageCourant.filtre.matieres.count() === 0 ||
			(this.listes &&
				this.listes.matieres &&
				this.listes.matieres.count() ===
					this.affichageCourant.filtre.matieres.count());
		const lEstFiltreClassesDefault =
			this.affichageCourant.filtre.classes.count() === 0 ||
			(this.listes &&
				this.listes.classes &&
				this.listes.classes.count() ===
					this.affichageCourant.filtre.classes.count());
		let lTestAutre = true;
		switch (this.affichageCourant.getGenre()) {
			case TypeAffichageRemplacements_1.TypeAffichageRemplacements
				.tarVolontaire: {
				lTestAutre = this.affichageCourant.filtre.uniquementMesMatieresClasses;
				break;
			}
		}
		return (
			lEstMemePeriode &&
			lEstFiltreProfDefault &&
			lEstFiltreMatDefault &&
			lEstFiltreClassesDefault &&
			lTestAutre
		);
	}
	getFiltreDefaultDeType(aTypeAffichage) {
		const lDate = ObjetDate_1.GDate.getDateCourante(true);
		const lDateN28 = ObjetDate_1.GDate.getJourSuivant(lDate, 28);
		switch (aTypeAffichage) {
			case TypeAffichageRemplacements_1.TypeAffichageRemplacements
				.tarPropositions:
			case TypeAffichageRemplacements_1.TypeAffichageRemplacements
				.tarAutresRemplacements: {
				return {
					type: aTypeAffichage,
					de: lDate,
					a: ObjetDate_1.GDate.getDateBornee(lDateN28),
					profs: new ObjetListeElements_1.ObjetListeElements(),
					matieres: new ObjetListeElements_1.ObjetListeElements(),
					classes: new ObjetListeElements_1.ObjetListeElements(),
					uniquementMesMatieresClasses: false,
				};
				break;
			}
			case TypeAffichageRemplacements_1.TypeAffichageRemplacements
				.tarVolontaire: {
				return {
					type: aTypeAffichage,
					de: lDate,
					a: ObjetDate_1.GDate.getDateBornee(lDateN28),
					profs: new ObjetListeElements_1.ObjetListeElements(),
					matieres: new ObjetListeElements_1.ObjetListeElements(),
					classes: new ObjetListeElements_1.ObjetListeElements(),
					uniquementMesMatieresClasses: true,
				};
				break;
			}
			case TypeAffichageRemplacements_1.TypeAffichageRemplacements
				.tarMesRemplacementsAVenir: {
				return {
					type: aTypeAffichage,
					de: lDate,
					a: ObjetDate_1.GDate.derniereDate,
					profs: new ObjetListeElements_1.ObjetListeElements(),
					matieres: new ObjetListeElements_1.ObjetListeElements(),
					classes: new ObjetListeElements_1.ObjetListeElements(),
					uniquementMesMatieresClasses: false,
				};
				break;
			}
			case TypeAffichageRemplacements_1.TypeAffichageRemplacements
				.tarMesRemplacementsPasses: {
				const lA = ObjetDate_1.GDate.getDateBornee(ObjetDate_1.GDate.hier);
				return {
					type: aTypeAffichage,
					de: ObjetDate_1.GDate.getDateBornee(
						ObjetDate_1.GDate.getJourSuivant(lA, -28),
					),
					a: lA,
					profs: new ObjetListeElements_1.ObjetListeElements(),
					matieres: new ObjetListeElements_1.ObjetListeElements(),
					classes: new ObjetListeElements_1.ObjetListeElements(),
					uniquementMesMatieresClasses: false,
				};
				break;
			}
			default:
				break;
		}
		return {};
	}
	setDateFiltreCourant(aDate, aEstDebut) {
		if (aEstDebut) {
			if (
				ObjetDate_1.GDate.estAvantJour(
					aDate,
					this.affichageCourant.paramRequete.de,
				)
			) {
				this.affichageCourant.paramRequete.de = aDate;
				this.actualiserDonnees = true;
			}
			this.affichageCourant.filtre.de = aDate;
		} else {
			if (
				ObjetDate_1.GDate.estAvantJour(
					this.affichageCourant.paramRequete.a,
					aDate,
				)
			) {
				this.affichageCourant.paramRequete.a = aDate;
				this.actualiserDonnees = true;
			}
			this.affichageCourant.filtre.a = aDate;
		}
	}
	actualiserDonneesSelonFiltre(aDonnees) {
		aDonnees.liste.setTri([
			ObjetTri_1.ObjetTri.init("Genre"),
			ObjetTri_1.ObjetTri.init("date"),
			ObjetTri_1.ObjetTri.init("place"),
		]);
		aDonnees.liste.trier();
		aDonnees.listeFiltre = new ObjetListeElements_1.ObjetListeElements();
		aDonnees.listeFiltre = aDonnees.liste.getListeElements(
			(aArticleRemplacement) => {
				let lResult;
				switch (this.affichageCourant.getGenre()) {
					case TypeAffichageRemplacements_1.TypeAffichageRemplacements
						.tarPropositions:
						lResult =
							aArticleRemplacement.getGenre() ===
							TypeGenreCoursRemplacable_1.TypeGenreCoursRemplacable
								.cr_suggestion;
						break;
					case TypeAffichageRemplacements_1.TypeAffichageRemplacements
						.tarVolontaire:
						lResult =
							aArticleRemplacement.getGenre() ===
							TypeGenreCoursRemplacable_1.TypeGenreCoursRemplacable.cr_absence;
						break;
					case TypeAffichageRemplacements_1.TypeAffichageRemplacements
						.tarMesRemplacementsAVenir:
					case TypeAffichageRemplacements_1.TypeAffichageRemplacements
						.tarMesRemplacementsPasses:
						lResult =
							aArticleRemplacement.getGenre() ===
							TypeGenreCoursRemplacable_1.TypeGenreCoursRemplacable
								.cr_remplacement;
						if (lResult) {
							const lIndice =
								aArticleRemplacement.remplacants.getIndiceElementParFiltre(
									(aElement) => {
										return aElement.egalParNumeroEtGenre(
											GEtatUtilisateur.getUtilisateur().getNumero(),
										);
									},
								);
							lResult = lIndice > -1;
						}
						break;
					case TypeAffichageRemplacements_1.TypeAffichageRemplacements
						.tarAutresRemplacements:
						lResult =
							aArticleRemplacement.getGenre() ===
							TypeGenreCoursRemplacable_1.TypeGenreCoursRemplacable
								.cr_remplacement;
						if (lResult) {
							const lIndice =
								aArticleRemplacement.remplacants.getIndiceElementParFiltre(
									(aElement) => {
										return aElement.egalParNumeroEtGenre(
											GEtatUtilisateur.getUtilisateur().getNumero(),
										);
									},
								);
							lResult = lIndice === -1;
						}
						break;
				}
				if (lResult) {
					lResult = ObjetDate_1.GDate.dateEntreLesDates(
						aArticleRemplacement.date,
						this.affichageCourant.filtre.de,
						this.affichageCourant.filtre.a,
					);
				}
				if (
					this.affichageCourant.getGenre() ===
					TypeAffichageRemplacements_1.TypeAffichageRemplacements.tarVolontaire
				) {
				} else {
					if (lResult) {
						let lAttribueSelonFiltreProf = false;
						aArticleRemplacement.profs.parcourir((aElement) => {
							lAttribueSelonFiltreProf =
								this.affichageCourant.filtre.profs.count() === 0 ||
								this.affichageCourant.filtre.profs
									.getTableauNumeros()
									.includes(aElement.getNumero());
							if (lAttribueSelonFiltreProf) {
								return false;
							}
						});
						lResult = lAttribueSelonFiltreProf;
					}
					if (lResult) {
						lResult =
							this.affichageCourant.filtre.matieres.count() === 0 ||
							this.affichageCourant.filtre.matieres
								.getTableauNumeros()
								.includes(aArticleRemplacement.matiere.getNumero());
					}
					if (lResult) {
						let lSelonFiltreClasses =
							this.affichageCourant.filtre.classes.count() === 0 ||
							(this.listes &&
								this.listes.classes &&
								this.listes.classes.count() ===
									this.affichageCourant.filtre.classes.count());
						if (!lSelonFiltreClasses) {
							aArticleRemplacement.classes.parcourir((aElement) => {
								lSelonFiltreClasses = this.affichageCourant.filtre.classes
									.getTableauNumeros()
									.includes(aElement.getNumero());
								if (lSelonFiltreClasses) {
									return false;
								}
							});
						}
						if (!lSelonFiltreClasses) {
							aArticleRemplacement.groupes.parcourir((aGroupe) => {
								aGroupe.classes.parcourir((aElement) => {
									lSelonFiltreClasses = this.affichageCourant.filtre.classes
										.getTableauNumeros()
										.includes(aElement.getNumero());
									if (lSelonFiltreClasses) {
										return false;
									}
								});
							});
						}
						lResult = lSelonFiltreClasses;
					}
				}
				return lResult;
			},
		);
		aDonnees.listeFiltre.setTri([
			ObjetTri_1.ObjetTri.init("Genre"),
			ObjetTri_1.ObjetTri.init(
				"estUnDeploiement",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
			ObjetTri_1.ObjetTri.init("date"),
			ObjetTri_1.ObjetTri.init("place"),
		]);
		aDonnees.listeFiltre.trier();
	}
	construireDate(aArticle) {
		return aArticle.date
			? IE.jsx.str(
					"time",
					{
						class: "date-contain",
						datetime: ObjetDate_1.GDate.formatDate(aArticle.date, "%MM-%JJ"),
					},
					ObjetDate_1.GDate.formatDate(aArticle.date, "%JJ %MMM"),
				)
			: "";
	}
	construireTitre(aArticle) {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				null,
				IE.jsx.str("span", null, aArticle.strHDebut, " - ", aArticle.strHFin),
				IE.jsx.str("span", { class: "regular" }, " (", aArticle.strDuree, ")"),
			),
		);
	}
	construireSousTitre(aArticle) {
		return IE.jsx.str(
			"div",
			null,
			aArticle.getLibelle(),
			" - ",
			aArticle.salles.getTableauLibelles().join(", "),
		);
	}
	construireMessage(aArticle) {
		return IE.jsx.str(
			"div",
			null,
			aArticle.matiere.getLibelle(),
			" (",
			aArticle.profs.getTableauLibelles().join(", "),
			")",
		);
	}
	getZoneReponse(aArticle, aLigne) {
		switch (aArticle.getGenre()) {
			case TypeGenreCoursRemplacable_1.TypeGenreCoursRemplacable.cr_suggestion:
				return IE.jsx.str(
					"div",
					{
						class: "remplacementsboutons",
						role: "group",
						"ie-attr": (0, jsx_1.jsxFuncAttr)("getAriaLabel", [aLigne]),
					},
					IE.jsx.str(
						"ie-checkbox",
						{
							class: ["as-chips", "oui"],
							"ie-model": (0, jsx_1.jsxFuncAttr)("CheckProposition", [
								aLigne,
								true,
							]),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"RemplacementsEnseignants.proposition.oui",
						),
					),
					" ",
					IE.jsx.str(
						"ie-checkbox",
						{
							class: ["as-chips", "non"],
							"ie-model": (0, jsx_1.jsxFuncAttr)("CheckProposition", [
								aLigne,
								false,
							]),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"RemplacementsEnseignants.proposition.non",
						),
					),
				);
			case TypeGenreCoursRemplacable_1.TypeGenreCoursRemplacable.cr_absence:
				return IE.jsx.str(
					"div",
					{ class: "remplacementsboutons" },
					IE.jsx.str("ie-bouton", {
						class: ["volontaire"],
						"ie-model": (0, jsx_1.jsxFuncAttr)("btnVolontaire", [aLigne]),
						"ie-class": (0, jsx_1.jsxFuncAttr)("getClassVolontaire", [aLigne]),
					}),
				);
			case TypeGenreCoursRemplacable_1.TypeGenreCoursRemplacable
				.cr_remplacement:
				if (
					this.affichageCourant.getGenre() ===
					TypeAffichageRemplacements_1.TypeAffichageRemplacements
						.tarAutresRemplacements
				) {
					return IE.jsx.str(
						"ie-chips",
						{ class: "tag-style" },
						IE.jsx.str(
							"div",
							{ class: "flex-contain flex-cols flex-center m-all" },
							IE.jsx.str(
								"span",
								null,
								ObjetTraduction_1.GTraductions.getValeur(
									"RemplacementsEnseignants.RemplacePar",
								),
							),
							aArticle.remplacants.getTableau((aElement) => {
								return IE.jsx.str("span", null, aElement.getLibelle());
							}),
						),
					);
				} else {
					return "";
				}
			default:
				return "";
		}
	}
	async requeteDonnees() {
		const lparam = this.affichageCourant.paramRequete;
		const lReponse =
			await new ObjetRequeteRemplacementsEnseignants().lancerRequete(lparam);
		this.actualiserDonneesSelonFiltre(lReponse);
		return lReponse;
	}
	async requeteSaisieRemplacements(aParam) {
		const lReponse =
			await new ObjetRequeteSaisieRemplacementsEnseignants().lancerRequete(
				aParam,
			);
		return lReponse;
	}
	async requetePublic(aParam) {
		let lReponse = {
			genres: [],
			listePublic: new ObjetListeElements_1.ObjetListeElements(),
			listeFamilles: new ObjetListeElements_1.ObjetListeElements(),
		};
		if (
			aParam.genres.includes(Enumere_Ressource_1.EGenreRessource.Enseignant) &&
			this.listes.profs
		) {
			lReponse = this.listes.profs;
		} else {
			lReponse =
				await new ObjetRequeteListePublics_1.ObjetRequeteListePublics().lancerRequete(
					aParam,
				);
			if (
				lReponse.genres.includes(
					Enumere_Ressource_1.EGenreRessource.Enseignant,
				) &&
				this.listes
			) {
				this.listes.profs = lReponse;
			}
		}
		return lReponse;
	}
}
exports.MoteurRemplacementsEnseignants = MoteurRemplacementsEnseignants;
var RemplacementsEnseignants;
(function (RemplacementsEnseignants) {
	let genreEcran;
	(function (genreEcran) {
		genreEcran["selecteur"] = "RemplacementsEnseignants.selecteur";
		genreEcran["liste"] = "RemplacementsEnseignants.liste";
	})(
		(genreEcran =
			RemplacementsEnseignants.genreEcran ||
			(RemplacementsEnseignants.genreEcran = {})),
	);
	let action;
	(function (action) {
		action["filtre"] = "actionRE.filtre";
		action["saisie"] = "actionRE.saisie";
		action["choixMes"] = "actionRE.choixMes";
	})(
		(action =
			RemplacementsEnseignants.action ||
			(RemplacementsEnseignants.action = {})),
	);
})(
	RemplacementsEnseignants ||
		(exports.RemplacementsEnseignants = RemplacementsEnseignants = {}),
);
class ObjetRequeteRemplacementsEnseignants extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
CollectionRequetes_1.Requetes.inscrire(
	"RemplacementsEnseignants",
	ObjetRequeteRemplacementsEnseignants,
);
class ObjetRequeteSaisieRemplacementsEnseignants extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
CollectionRequetes_1.Requetes.inscrire(
	"SaisieRemplacementsEnseignants",
	ObjetRequeteSaisieRemplacementsEnseignants,
);
