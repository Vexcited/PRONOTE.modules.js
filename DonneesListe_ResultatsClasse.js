exports.DonneesListe_ResultatsClasse = exports.TypeColonneDyn = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const Enumere_ResultatsClasse_1 = require("Enumere_ResultatsClasse");
const ObjetDate_1 = require("ObjetDate");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const ObjetStyle_1 = require("ObjetStyle");
const TypePositionnement_1 = require("TypePositionnement");
const ObjetRequetePageResultatsClasses_1 = require("ObjetRequetePageResultatsClasses");
const ObjetFenetre_MoyenneTableauResultats_1 = require("ObjetFenetre_MoyenneTableauResultats");
const TypeSexe_1 = require("TypeSexe");
var TypeColonneDyn;
(function (TypeColonneDyn) {
	TypeColonneDyn[(TypeColonneDyn["Moyenne"] = 0)] = "Moyenne";
	TypeColonneDyn[(TypeColonneDyn["Positionnement"] = 1)] = "Positionnement";
	TypeColonneDyn[(TypeColonneDyn["Absence"] = 2)] = "Absence";
})(TypeColonneDyn || (exports.TypeColonneDyn = TypeColonneDyn = {}));
class DonneesListe_ResultatsClasse extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParams) {
		super(aDonnees);
		this.moyennes = aParams.moyennes;
		this.moyenneClasse = aParams.moyenneClasse;
		this.anneeComplete = aParams.anneeComplete;
		this.avecGestionNotation = aParams.avecGestionNotation;
		this.avecDonneesItalie = aParams.avecDonneesItalie;
		this.genrePositonnementClasse = aParams.genrePositonnementClasse;
		this.avecNom = true;
		this.listeTotaux = aParams.listeTotaux
			? aParams.listeTotaux
			: [
					Enumere_ResultatsClasse_1.EGenreTotalAffiche.moyenneClasse,
					Enumere_ResultatsClasse_1.EGenreTotalAffiche.moyenneGroupe,
					Enumere_ResultatsClasse_1.EGenreTotalAffiche.noteMediane,
					Enumere_ResultatsClasse_1.EGenreTotalAffiche.noteHaute,
					Enumere_ResultatsClasse_1.EGenreTotalAffiche.noteBasse,
				];
		this.setOptions({
			avecSelection: false,
			avecEdition: false,
			avecSuppression: false,
			avecDeploiement: this.anneeComplete,
			avecImageSurColonneDeploiement: true,
		});
	}
	afficherNom(aAfficher) {
		this.avecNom = aAfficher;
	}
	setTypeMoyenne(aTypeMoyenne) {
		this.typeMoyenneAffichee = aTypeMoyenne;
	}
	estUneColonneDynamique(aIdColonne) {
		return (
			aIdColonne &&
			aIdColonne.startsWith(DonneesListe_ResultatsClasse.colonnes.prefixeColDyn)
		);
	}
	avecEvenementSelectionClick(aParams) {
		return (
			aParams.idColonne ===
				DonneesListe_ResultatsClasse.colonnes.moyenneGenerale ||
			aParams.declarationColonne.estMoyenneRegroupement
		);
	}
	avecDeploiementSurColonne(aParams) {
		return (
			aParams.idColonne === DonneesListe_ResultatsClasse.colonnes.nom &&
			this.anneeComplete
		);
	}
	estUnDeploiement(aParams) {
		return aParams && aParams.article && aParams.article.lignePere === 0;
	}
	getCouleurCellule(aParams) {
		if (!aParams.article.pere && this.anneeComplete) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Deploiement;
		}
	}
	getTri(aColonneDeTri, aGenreTri) {
		if (aColonneDeTri === null || aColonneDeTri === undefined) {
			return [];
		}
		const lIdColonne = this.getId(aColonneDeTri);
		const lTri = [];
		if (this.estUneColonneDynamique(lIdColonne)) {
			const lParams = this.paramsListe.getParams(aColonneDeTri, -1);
			const lDeclarationColonne = lParams.declarationColonne;
			switch (lDeclarationColonne.typeColonne) {
				case TypeColonneDyn.Moyenne:
					lTri.push(
						ObjetTri_1.ObjetTri.init((D) => {
							const lNotes = D.notesEleve
								? D.notesEleve.get(lDeclarationColonne.rangColonne)
								: null;
							if (lNotes && lNotes.ColMoy) {
								if (lNotes.ColMoy) {
									if (lNotes.ColMoy.avecAnnotation) {
										switch (this.typeMoyenneAffichee) {
											case ObjetRequetePageResultatsClasses_1
												.ObjetRequetePageResultatsClasses.TypeMoyenneAffichee
												.Calculee:
											case ObjetRequetePageResultatsClasses_1
												.ObjetRequetePageResultatsClasses.TypeMoyenneAffichee
												.Proposee:
												return lNotes.ColMoy.abrProposee;
											case ObjetRequetePageResultatsClasses_1
												.ObjetRequetePageResultatsClasses.TypeMoyenneAffichee
												.Deliberee:
												return lNotes.ColMoy.abrDeliberee;
										}
									} else {
										return lNotes.ColMoy.moyenne
											? lNotes.ColMoy.moyenne.getValeur()
											: -1;
									}
								}
							}
							return -1;
						}, aGenreTri),
					);
					break;
				case TypeColonneDyn.Absence:
					lTri.push(
						ObjetTri_1.ObjetTri.init((D) => {
							const lNotes = D.notesEleve
								? D.notesEleve.get(lDeclarationColonne.rangColonne)
								: null;
							if (lNotes && lNotes.ColAbs) {
								return lNotes.ColAbs.detailAbsence;
							}
							return -1;
						}, aGenreTri),
					);
			}
		} else {
			switch (lIdColonne) {
				case DonneesListe_ResultatsClasse.colonnes.moyenneGenerale:
					lTri.push(
						ObjetTri_1.ObjetTri.init((D) => {
							return !isNaN(D.moyenneGenerale.getValeur())
								? D.moyenneGenerale.getValeur()
								: D.moyenneGenerale.getGenre() - 100;
						}, aGenreTri),
					);
					break;
			}
		}
		lTri.push(
			ObjetTri_1.ObjetTri.init(
				this.getValeurPourTri.bind(this, aColonneDeTri),
				aGenreTri,
			),
		);
		return lTri;
	}
	getTooltip(aParams) {
		var _a;
		if (this.avecClickCalculMoyenneGenerale(aParams)) {
			return ObjetFenetre_MoyenneTableauResultats_1
				.TradObjetFenetre_MoyenneTableauResultats.OuvrirFenetre;
		}
		if (this.estUneColonneDynamique(aParams.idColonne)) {
			switch (aParams.declarationColonne.typeColonne) {
				case TypeColonneDyn.Moyenne: {
					let lToolTip = "";
					const lNote =
						(_a = aParams.article.notesEleve) === null || _a === void 0
							? void 0
							: _a.get(aParams.declarationColonne.rangColonne);
					if (lNote) {
						lToolTip += lNote.ColMoy.estMoyFacultative
							? IE.jsx.str(
									"p",
									null,
									ObjetTraduction_1.GTraductions.getValeur(
										"resultatsClasses.tooltip.estServiceFacultatif",
									),
								)
							: "";
						lToolTip += lNote.ColMoy.estMoyInfBareme
							? IE.jsx.str(
									"p",
									null,
									this.avecDonneesItalie
										? ObjetTraduction_1.GTraductions.getValeur(
												"resultatsClasses.tooltip.estInferieureTroisCinquieme",
											)
										: ObjetTraduction_1.GTraductions.getValeur(
												"resultatsClasses.tooltip.estInferieurMoyenne",
											),
								)
							: "";
					}
					return lToolTip;
				}
			}
		}
		switch (aParams.idColonne) {
			case DonneesListe_ResultatsClasse.colonnes.validite:
				return aParams.article.hintValiditeAnnee;
			case DonneesListe_ResultatsClasse.colonnes.sexe:
				return TypeSexe_1.TypeSexeUtil.getLibelle(aParams.article.sexe);
		}
		return "";
	}
	getValeur(aParams) {
		if (this.estUneColonneDynamique(aParams.idColonne)) {
			return this.getValeurDynamique(aParams);
		} else {
			switch (aParams.idColonne) {
				case DonneesListe_ResultatsClasse.colonnes.ressource:
					return aParams.article.ressource;
				case DonneesListe_ResultatsClasse.colonnes.lignePere:
					return aParams.article.lignePere;
				case DonneesListe_ResultatsClasse.colonnes.deploye:
					return aParams.article.estDeploye;
				case DonneesListe_ResultatsClasse.colonnes.nom:
					return aParams.article.periode === ""
						? this.avecNom
							? aParams.article.nom
							: aParams.article.numeroNational
						: aParams.article.periode;
				case DonneesListe_ResultatsClasse.colonnes.redoublant:
					return aParams.article.redoublant;
				case DonneesListe_ResultatsClasse.colonnes.projetsAccompagnement:
					return aParams.article.projetsAccompagnement;
				case DonneesListe_ResultatsClasse.colonnes.dernierEtablissement:
					return aParams.article.dernierEtablissement;
				case DonneesListe_ResultatsClasse.colonnes.rang:
					return aParams.surTri
						? aParams.article.rang
						: aParams.article.rang !== 0
							? aParams.article.rang
							: "-";
				case DonneesListe_ResultatsClasse.colonnes.absences:
					return aParams.surTri
						? aParams.article.demiJourneesAbs
						: aParams.article.demiJourneesAbs > 0
							? aParams.article.demiJourneesAbs
							: "-";
				case DonneesListe_ResultatsClasse.colonnes.moyenneGenerale:
					return aParams.article.moyenneGenerale;
				case DonneesListe_ResultatsClasse.colonnes.mention:
					return aParams.article.libelleMention;
				case DonneesListe_ResultatsClasse.colonnes.mentionV:
					return aParams.article.mentionCode;
				case DonneesListe_ResultatsClasse.colonnes.credits:
					return aParams.article.chaineCreditsScolaires
						? parseInt(aParams.article.chaineCreditsScolaires)
						: "";
				case DonneesListe_ResultatsClasse.colonnes.creditsV:
					return aParams.article.creditsCode;
				case DonneesListe_ResultatsClasse.colonnes.validite:
					return aParams.article.validiteAnnee;
				case DonneesListe_ResultatsClasse.colonnes.creditsTotaux:
					return aParams.surTri
						? aParams.article.chaineCreditsScolairesTotal
						: aParams.article.chaineCreditsScolairesTotal === ""
							? "-"
							: parseInt(aParams.article.chaineCreditsScolairesTotal);
				case DonneesListe_ResultatsClasse.colonnes.neLe:
					return aParams.surTri
						? aParams.article.dateNaissance || 0
						: aParams.article.dateNaissance
							? ObjetDate_1.GDate.formatDate(
									aParams.article.dateNaissance,
									"%JJ/%MM/%AAAA",
								)
							: "";
				case DonneesListe_ResultatsClasse.colonnes.nombreRetards:
					return aParams.article.nbRetard > 0 ? aParams.article.nbRetard : "";
				case DonneesListe_ResultatsClasse.colonnes.sexe:
					return "sexe" in aParams.article
						? IE.jsx.str("i", {
								class: [
									"i-medium",
									TypeSexe_1.TypeSexeUtil.getClasse(
										aParams.article.sexe,
										false,
									),
								],
								role: "presentation",
							})
						: "";
			}
		}
		return "";
	}
	getTypeValeur(aParams) {
		if (this.estUneColonneDynamique(aParams.idColonne)) {
			return this.getTypeContenuDynamique(aParams);
		} else {
			switch (aParams.idColonne) {
				case DonneesListe_ResultatsClasse.colonnes.ressource:
					return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule
						.CocheDeploiement;
				case DonneesListe_ResultatsClasse.colonnes.lignePere:
				case DonneesListe_ResultatsClasse.colonnes.deploye:
				case DonneesListe_ResultatsClasse.colonnes.redoublant:
					return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
				case DonneesListe_ResultatsClasse.colonnes.sexe:
					return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			}
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getAriaHasPopup(aParams) {
		if (this.avecClickCalculMoyenneGenerale(aParams)) {
			return "dialog";
		}
		return false;
	}
	getClassCelluleConteneur(aParams) {
		const T = [];
		if (this.avecClickCalculMoyenneGenerale(aParams)) {
			T.push("Curseur_MethodeCalculMoyenneActif");
		}
		return T.join("");
	}
	avecClickCalculMoyenneGenerale(aParams) {
		if (
			aParams.idColonne ===
				DonneesListe_ResultatsClasse.colonnes.moyenneGenerale ||
			aParams.declarationColonne.estMoyenneRegroupement
		) {
			const lSource = aParams.declarationColonne.estMoyenneRegroupement
				? aParams.article.notesEleve.get(aParams.declarationColonne.rangColonne)
				: aParams.article;
			return !!lSource.resultatAffiche;
		}
	}
	estCelluleWAIRowHeader(aParams) {
		return aParams.idColonne === DonneesListe_ResultatsClasse.colonnes.nom;
	}
	getStyle(aParams) {
		const lStyles = [];
		if (this.estUneColonneDynamique(aParams.idColonne)) {
			lStyles.push(this.getStyleDynamique(aParams));
		}
		return lStyles.join("");
	}
	getClass(aParams) {
		const lClasses = [];
		if (this.estUneColonneDynamique(aParams.idColonne)) {
			lClasses.push(this.getClassDynamique(aParams));
		} else {
			switch (aParams.idColonne) {
				case DonneesListe_ResultatsClasse.colonnes.ressource:
				case DonneesListe_ResultatsClasse.colonnes.lignePere:
				case DonneesListe_ResultatsClasse.colonnes.deploye:
				case DonneesListe_ResultatsClasse.colonnes.redoublant:
				case DonneesListe_ResultatsClasse.colonnes.projetsAccompagnement:
				case DonneesListe_ResultatsClasse.colonnes.dernierEtablissement:
				case DonneesListe_ResultatsClasse.colonnes.rang:
				case DonneesListe_ResultatsClasse.colonnes.absences:
				case DonneesListe_ResultatsClasse.colonnes.moyenneGenerale:
				case DonneesListe_ResultatsClasse.colonnes.mention:
				case DonneesListe_ResultatsClasse.colonnes.credits:
				case DonneesListe_ResultatsClasse.colonnes.creditsTotaux:
				case DonneesListe_ResultatsClasse.colonnes.neLe:
				case DonneesListe_ResultatsClasse.colonnes.nombreRetards:
					lClasses.push("AlignementDroit");
					break;
				case DonneesListe_ResultatsClasse.colonnes.mentionV:
				case DonneesListe_ResultatsClasse.colonnes.creditsV:
				case DonneesListe_ResultatsClasse.colonnes.validite:
				case DonneesListe_ResultatsClasse.colonnes.sexe:
					lClasses.push("AlignementMilieu");
					break;
			}
			if (
				aParams.idColonne ===
				DonneesListe_ResultatsClasse.colonnes.moyenneGenerale
			) {
				lClasses.push("Gras");
			}
		}
		return lClasses.join(" ");
	}
	getClassTotal(aParams) {
		return this.getClass(aParams);
	}
	getListeLignesTotal() {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		if (this.avecGestionNotation) {
			this.listeTotaux.forEach((element) => {
				switch (element) {
					case Enumere_ResultatsClasse_1.EGenreTotalAffiche.moyenneClasse:
						lListe.addElement(
							new ObjetElement_1.ObjetElement(
								ObjetTraduction_1.GTraductions.getValeur(
									"resultatsClasses.total.moyenneService",
								),
								Enumere_ResultatsClasse_1.EGenreTotalAffiche.moyenneClasse,
							),
						);
						break;
					case Enumere_ResultatsClasse_1.EGenreTotalAffiche.moyenneGroupe:
						lListe.addElement(
							new ObjetElement_1.ObjetElement(
								ObjetTraduction_1.GTraductions.getValeur(
									"resultatsClasses.total.moyenneGroupe",
								),
								Enumere_ResultatsClasse_1.EGenreTotalAffiche.moyenneGroupe,
							),
						);
						break;
					case Enumere_ResultatsClasse_1.EGenreTotalAffiche.noteBasse:
						lListe.addElement(
							new ObjetElement_1.ObjetElement(
								ObjetTraduction_1.GTraductions.getValeur(
									"resultatsClasses.total.noteBasse",
								),
								Enumere_ResultatsClasse_1.EGenreTotalAffiche.noteBasse,
							),
						);
						break;
					case Enumere_ResultatsClasse_1.EGenreTotalAffiche.noteMediane:
						lListe.addElement(
							new ObjetElement_1.ObjetElement(
								ObjetTraduction_1.GTraductions.getValeur(
									"resultatsClasses.total.noteMediane",
								),
								Enumere_ResultatsClasse_1.EGenreTotalAffiche.noteMediane,
							),
						);
						break;
					case Enumere_ResultatsClasse_1.EGenreTotalAffiche.noteHaute:
						lListe.addElement(
							new ObjetElement_1.ObjetElement(
								ObjetTraduction_1.GTraductions.getValeur(
									"resultatsClasses.total.noteHaute",
								),
								Enumere_ResultatsClasse_1.EGenreTotalAffiche.noteHaute,
							),
						);
						break;
				}
			});
		}
		return lListe;
	}
	getContenuTotal(aParams) {
		if (
			aParams.idColonne ===
			DonneesListe_ResultatsClasse.colonnes.moyenneGenerale
		) {
			switch (aParams.article.getNumero()) {
				case Enumere_ResultatsClasse_1.EGenreTotalAffiche.moyenneClasse:
					return this.moyenneClasse.generale;
				case Enumere_ResultatsClasse_1.EGenreTotalAffiche.noteBasse:
					return this.moyenneClasse.basse;
				case Enumere_ResultatsClasse_1.EGenreTotalAffiche.noteMediane:
					return this.moyenneClasse.mediane;
				case Enumere_ResultatsClasse_1.EGenreTotalAffiche.noteHaute:
					return this.moyenneClasse.haute;
			}
		}
		if (aParams.idColonne === DonneesListe_ResultatsClasse.colonnes.nom) {
			return aParams.article.getLibelle();
		}
		const i = aParams.declarationColonne.rangColonne;
		if (i >= 0) {
			if (aParams.declarationColonne.typeColonne === TypeColonneDyn.Absence) {
				return aParams.article.getNumero() ===
					Enumere_ResultatsClasse_1.EGenreTotalAffiche.moyenneClasse
					? this.moyennes.get(aParams.declarationColonne.rangColonne)
							.totalAbsenceColonne
					: "&nbsp;";
			}
			if (
				aParams.declarationColonne.typeColonne === TypeColonneDyn.Positionnement
			) {
				return "";
			}
			switch (aParams.article.getNumero()) {
				case Enumere_ResultatsClasse_1.EGenreTotalAffiche.moyenneClasse:
					return this.moyennes.get(i).moyenneService.getChaine() !== ""
						? this.moyennes.get(i).moyenneService
						: "&nbsp;";
				case Enumere_ResultatsClasse_1.EGenreTotalAffiche.moyenneGroupe:
					return this.moyennes.get(i).moyenneGroupeService.getChaine() !== ""
						? this.moyennes.get(i).moyenneGroupeService
						: "&nbsp;";
				case Enumere_ResultatsClasse_1.EGenreTotalAffiche.noteBasse:
					return this.moyennes.get(i).noteBasse &&
						this.moyennes.get(i).noteBasse.getChaine() !== ""
						? this.moyennes.get(i).noteBasse
						: "&nbsp;";
				case Enumere_ResultatsClasse_1.EGenreTotalAffiche.noteMediane:
					return this.moyennes.get(i).noteMediane &&
						this.moyennes.get(i).noteMediane.getChaine() !== ""
						? this.moyennes.get(i).noteMediane
						: "&nbsp;";
				case Enumere_ResultatsClasse_1.EGenreTotalAffiche.noteHaute:
					return this.moyennes.get(i).noteHaute &&
						this.moyennes.get(i).noteHaute.getChaine() !== ""
						? this.moyennes.get(i).noteHaute
						: "&nbsp;";
			}
		}
		return "";
	}
	getClassDynamique(aParams) {
		const lClasses = [];
		if (aParams.declarationColonne.estPere) {
			lClasses.push("Gras");
		}
		if (aParams.declarationColonne.estPere) {
			lClasses.push("AlignementDroit");
		} else if (
			aParams.declarationColonne.typeColonne === TypeColonneDyn.Absence
		) {
			lClasses.push("AlignementDroit");
		} else if (
			aParams.declarationColonne.typeColonne === TypeColonneDyn.Positionnement
		) {
			lClasses.push("AlignementMilieu");
		} else {
			lClasses.push("AlignementDroit");
		}
		return lClasses.join(" ");
	}
	getStyleDynamique(aParams) {
		const lStyle = [];
		if (aParams.declarationColonne.estPere) {
			lStyle.push("font-weight:bold;");
		}
		const lRangColonne = aParams.article.notesEleve.get(
			aParams.declarationColonne.rangColonne,
		);
		if (
			aParams.declarationColonne.typeColonne === TypeColonneDyn.Moyenne &&
			lRangColonne.ColMoy
		) {
			lStyle.push(
				ObjetStyle_1.GStyle.composeCouleurTexte(
					lRangColonne.ColMoy.couleurNote,
				),
			);
		}
		return lStyle.join("");
	}
	getValeurDynamique(aParams) {
		const lSurExportCSV = aParams && aParams.surExportCSV;
		const notes = aParams.article
			? aParams.article.notesEleve.get(aParams.declarationColonne.rangColonne)
			: null;
		if (notes) {
			let lAbr = "";
			if (notes.ColMoy.avecAnnotation) {
				switch (this.typeMoyenneAffichee) {
					case ObjetRequetePageResultatsClasses_1
						.ObjetRequetePageResultatsClasses.TypeMoyenneAffichee.Calculee:
					case ObjetRequetePageResultatsClasses_1
						.ObjetRequetePageResultatsClasses.TypeMoyenneAffichee.Proposee:
						lAbr = notes.ColMoy.abrProposee;
						break;
					case ObjetRequetePageResultatsClasses_1
						.ObjetRequetePageResultatsClasses.TypeMoyenneAffichee.Deliberee:
						lAbr = notes.ColMoy.abrDeliberee;
						break;
				}
			}
			let lNote = notes.ColMoy.estMoyFacultative
				? "(" + notes.ColMoy.moyenne + ")"
				: notes.ColMoy.moyenne;
			lNote = notes.ColMoy.estMoyInfBareme ? lNote + " *" : lNote;
			switch (aParams.declarationColonne.typeColonne) {
				case TypeColonneDyn.Moyenne:
					return notes.ColMoy.avecAnnotation
						? lAbr
						: !!notes.ColMoy.moyenne
							? lNote
							: "";
				case TypeColonneDyn.Positionnement: {
					const lElement =
						GParametres.listeNiveauxDAcquisitions.getElementParGenre(
							notes.ColPos.niveauDAcquisition
								? notes.ColPos.niveauDAcquisition.getGenre()
								: 0,
						);
					const lImage =
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImagePositionnement(
							{
								niveauDAcquisition: lElement,
								genrePositionnement:
									TypePositionnement_1.TypePositionnementUtil.getGenrePositionnementParDefaut(
										this.genrePositonnementClasse,
									),
							},
						);
					return lSurExportCSV
						? Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getAbbreviation(
								lElement,
							)
						: lImage;
				}
				case TypeColonneDyn.Absence:
					return notes.ColAbs.contenuCellule;
			}
		}
	}
	getTypeContenuDynamique(aParams) {
		switch (aParams.declarationColonne.typeColonne) {
			case TypeColonneDyn.Moyenne: {
				const lNotes = aParams.article
					? aParams.article.notesEleve.get(
							aParams.declarationColonne.rangColonne,
						)
					: null;
				if (
					lNotes &&
					!lNotes.ColMoy.avecAnnotation &&
					!lNotes.ColMoy.estMoyFacultative &&
					!lNotes.ColMoy.estMoyInfBareme
				) {
					return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Note;
				}
				break;
			}
			case TypeColonneDyn.Positionnement:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
}
exports.DonneesListe_ResultatsClasse = DonneesListe_ResultatsClasse;
DonneesListe_ResultatsClasse.colonnes = {
	ressource: "ressource",
	nom: "nom",
	redoublant: "redoublant",
	projetsAccompagnement: "projetAccompagnement",
	dernierEtablissement: "dernierEtablissement",
	rang: "rang",
	absences: "demiJourneesAbs",
	moyenneGenerale: "moyenneGenerale",
	lignePere: "lignePere",
	deploye: "deploye",
	mention: "libelleMention",
	mentionV: "mentionCode",
	credits: "chaineCreditsScolaires",
	creditsV: "creditsCode",
	validite: "validiteAnnee",
	creditsTotaux: "chaineCreditsScolairesTotal",
	neLe: "dateNaissance",
	nombreRetards: "nbRetard",
	prefixeColDyn: "prefixe_colDyn",
	sexe: "sexe",
};
