exports.ObjetFenetre_ParametrageEDT = void 0;
const ObjetStyle_1 = require("ObjetStyle");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetStyle_2 = require("ObjetStyle");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetHint_1 = require("ObjetHint");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDate_1 = require("ObjetDate");
const TypeGranulariteGrille_1 = require("TypeGranulariteGrille");
const TypeHoraireGrillePlanning_1 = require("TypeHoraireGrillePlanning");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const UtilitaireConvertisseurPositionGrille_1 = require("UtilitaireConvertisseurPositionGrille");
const UtilitairePrefsGrilleStructure_1 = require("UtilitairePrefsGrilleStructure");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetTri_1 = require("ObjetTri");
class ObjetFenetre_ParametrageEDT extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.objetParametres = this.applicationSco.getObjetParametres();
		this.etatUtilisateur = this.applicationSco.getEtatUtilisateur();
		this.setOptionsFenetre({
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
			largeurMin: 550,
			estEDT: false,
			avecStructure:
				[
					Enumere_Espace_1.EGenreEspace.Professeur,
					Enumere_Espace_1.EGenreEspace.PrimProfesseur,
					Enumere_Espace_1.EGenreEspace.Etablissement,
					Enumere_Espace_1.EGenreEspace.Administrateur,
					Enumere_Espace_1.EGenreEspace.PrimDirection,
				].indexOf(this.etatUtilisateur.GenreEspace) >= 0,
			avecGranularite: false,
			choixGenreRessource: null,
		});
		let lNb = IE.Cycles.nombreJoursOuvresParCycle();
		this.listeNbJours = new ObjetListeElements_1.ObjetListeElements();
		for (let i = 1; i <= lNb; i++) {
			const lElement = new ObjetElement_1.ObjetElement(i + "", null, i);
			if (i === lNb) {
				lElement.Genre = 0;
			}
			this.listeNbJours.addElement(lElement);
		}
		this.listeNbSequences = new ObjetListeElements_1.ObjetListeElements();
		lNb = Math.floor(
			this.objetParametres.PlacesParJour / this.objetParametres.PlacesParHeure,
		);
		for (let i = 1; i <= lNb; i++) {
			const lElement = new ObjetElement_1.ObjetElement(i + "", null, i);
			if (i === lNb) {
				lElement.Genre = 0;
			}
			this.listeNbSequences.addElement(lElement);
		}
		this._initListeGranularites();
		this.listeRessources = null;
		this.listeHeuresDebut = new ObjetListeElements_1.ObjetListeElements();
		for (let i = 0; i < this.objetParametres.PlacesParJour; i++) {
			this.listeHeuresDebut.addElement(
				new ObjetElement_1.ObjetElement(
					this.objetParametres.LibellesHeures.getLibelle(i),
					i,
				),
			);
		}
		this.listeHeuresFin = new ObjetListeElements_1.ObjetListeElements();
		for (let i = 1; i <= this.objetParametres.PlacesParJour; i++) {
			this.listeHeuresFin.addElement(
				new ObjetElement_1.ObjetElement(
					this.objetParametres.LibellesHeures.getLibelle(i),
					i - 1,
				),
			);
		}
		this.rbPersoSelectionne =
			this.applicationSco.parametresUtilisateur.get("EDT.nbRessources") > 0;
		this.avecModif = false;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnInversionAxe: {
				event: function (aTypePlanning) {
					aInstance.applicationSco.parametresUtilisateur.set(
						aInstance._accesseurAxeParam(aTypePlanning),
						!aInstance.applicationSco.parametresUtilisateur.get(
							aInstance._accesseurAxeParam(aTypePlanning),
						),
					);
					aInstance.avecModif = true;
				},
				getTitle: function () {
					return ObjetTraduction_1.GTraductions.getValeur(
						"GenerationPDF.EDT.HintAxes",
					);
				},
			},
			htmlAxe: function (aTypePlanning, aHorizontale) {
				const lDefinitionAxes = {
					v: aInstance.optionsFenetre.estEDT
						? ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_ParametrageEDT.Horaires",
							)
						: aTypePlanning ===
								TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parSemaine
							? ObjetTraduction_1.GTraductions.getValeur(
									"Fenetre_ParametrageEDT.Jours",
								) +
								" / " +
								ObjetTraduction_1.GTraductions.getValeur(
									"Fenetre_ParametrageEDT.Horaires",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"Fenetre_ParametrageEDT.Horaires",
								),
					h: aInstance.optionsFenetre.estEDT
						? ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_ParametrageEDT.Jours",
							)
						: aTypePlanning ===
								TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parJour
							? ObjetTraduction_1.GTraductions.getValeur(
									"Fenetre_ParametrageEDT.JoursRessourcesOuSemaines",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"Fenetre_ParametrageEDT.RessourcesOuSemaines",
								),
				};
				return aHorizontale
					? aInstance.applicationSco.parametresUtilisateur.get(
							aInstance._accesseurAxeParam(aTypePlanning),
						)
						? lDefinitionAxes.v
						: lDefinitionAxes.h
					: aInstance.applicationSco.parametresUtilisateur.get(
								aInstance._accesseurAxeParam(aTypePlanning),
							)
						? lDefinitionAxes.h
						: lDefinitionAxes.v;
			},
			surInversionAxe: function (aTypePlanning) {
				aInstance.applicationSco.parametresUtilisateur.set(
					aInstance._accesseurAxeParam(aTypePlanning),
					!aInstance.applicationSco.parametresUtilisateur.get(
						aInstance._accesseurAxeParam(aTypePlanning),
					),
				);
				aInstance.controleur.$refreshSelf();
				aInstance.avecModif = true;
			},
			comboJours: {
				init: function (aEstEDT, aInstanceCombo) {
					aInstanceCombo.setOptionsObjetSaisie({
						longueur: 30,
						labelledById: `${aInstance.Nom}_lab_combojours`,
					});
				},
				getDonnees: function (aEstEDT, aDonnees) {
					if (!aDonnees) {
						return aInstance.listeNbJours;
					}
				},
				getIndiceSelection: function (aEstEDT) {
					const lVal =
						aInstance.applicationSco.parametresUtilisateur.get(
							aEstEDT ? "EDT.nbJoursEDT" : "EDT.nbJours",
						) || 0;
					let lIndice = aInstance.listeNbJours.count() - 1;
					aInstance.listeNbJours.parcourir((D, aIndice) => {
						if (D.getGenre() === lVal) {
							lIndice = aIndice;
							return false;
						}
					});
					return lIndice;
				},
				event: function (aEstEDT, aParametres, aCombo) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.element &&
						aCombo.estUneInteractionUtilisateur()
					) {
						aInstance.applicationSco.parametresUtilisateur.set(
							aEstEDT ? "EDT.nbJoursEDT" : "EDT.nbJours",
							aParametres.element.getGenre(),
						);
						aInstance.avecModif = true;
					}
				},
			},
			comboSequences: {
				init: function (aInstanceCombo) {
					aInstanceCombo.setOptionsObjetSaisie({
						longueur: 30,
						labelledById: `${aInstance.Nom}_lab_comboseq`,
					});
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees) {
						return aInstance.listeNbSequences;
					}
				},
				getIndiceSelection: function () {
					const lVal =
						aInstance.applicationSco.parametresUtilisateur.get(
							"EDT.nbSequences",
						) || 0;
					let lIndice = aInstance.listeNbSequences.count() - 1;
					aInstance.listeNbSequences.parcourir((D, aIndice) => {
						if (D.getGenre() === lVal) {
							lIndice = aIndice;
							return false;
						}
					});
					return lIndice;
				},
				event: function (aParametres, aCombo) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.element &&
						aCombo.estUneInteractionUtilisateur()
					) {
						aInstance.applicationSco.parametresUtilisateur.set(
							"EDT.nbSequences",
							aParametres.element.getGenre(),
						);
						aInstance.avecModif = true;
					}
				},
			},
			rbRessources: {
				getValue: function (aToutes) {
					return aInstance.rbPersoSelectionne !== aToutes;
				},
				setValue: function (aToutes) {
					aInstance.rbPersoSelectionne = !aToutes;
					if (aToutes) {
						aInstance.applicationSco.parametresUtilisateur.set(
							"EDT.nbRessources",
							0,
						);
						aInstance.avecModif = true;
					}
				},
			},
			inputNbRessources: {
				getValueInit: function () {
					return (
						aInstance.applicationSco.parametresUtilisateur.get(
							"EDT.nbRessources",
						) || ""
					);
				},
				exitChange: function (aValue) {
					let lValue = parseInt(aValue);
					if (!MethodesObjet_1.MethodesObjet.isNumber(lValue)) {
						lValue = 1;
					}
					if (lValue < 1 || lValue > 40) {
						ObjetHint_1.ObjetHint.start(
							ObjetChaine_1.GChaine.format(
								ObjetTraduction_1.GTraductions.getValeur("ErreurMinMaxEntier"),
								[1, 40],
							),
							{
								sansDelai: true,
								position: {
									x:
										ObjetPosition_1.GPosition.getLeft(this.node) +
										ObjetPosition_1.GPosition.getWidth(this.node) +
										10,
									y: ObjetPosition_1.GPosition.getTop(this.node),
								},
							},
						);
						lValue = Math.max(1, Math.min(40, lValue));
					}
					aInstance.applicationSco.parametresUtilisateur.set(
						"EDT.nbRessources",
						lValue,
					);
					aInstance.avecModif = true;
				},
				getDisabled: function () {
					return !aInstance.rbPersoSelectionne;
				},
			},
			getDisplayStructure: function () {
				return (
					aInstance.listeRessources &&
					aInstance.listeRessources.count() >= 1 &&
					aInstance.listeModelesGrille &&
					aInstance.listeModelesGrille.count() > 1
				);
			},
			comboRessStructure: {
				init: function (aInstanceCombo) {
					aInstanceCombo.setOptionsObjetSaisie({
						longueur: 100,
						labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_ParametrageEDT.PuceStructure",
						),
					});
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees) {
						aInstance._construireListeRessources();
						return aInstance.listeRessources;
					}
				},
				getIndiceSelection: function () {
					const lGenre =
						aInstance.optionsFenetre.choixGenreRessource ||
						Enumere_Ressource_1.EGenreRessource.Enseignant;
					let lIndice = 0;
					aInstance.listeRessources.parcourir((D, aIndice) => {
						if (D.getNumero() === lGenre) {
							lIndice = aIndice;
							return false;
						}
					});
					return lIndice;
				},
				event: function (aParametres, aCombo) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.element &&
						aCombo.estUneInteractionUtilisateur()
					) {
						aInstance.optionsFenetre.choixGenreRessource =
							aParametres.element.getNumero();
					}
				},
				getDisplayCombo: function () {
					return (
						!!aInstance.listeRessources && aInstance.listeRessources.count() > 1
					);
				},
			},
			getDisplayModeleGrille: function () {
				return (
					aInstance.listeModelesGrille &&
					aInstance.listeModelesGrille.count() > 1
				);
			},
			comboRessStructureModele: {
				init: function (aInstanceCombo) {
					aInstanceCombo.setOptionsObjetSaisie({
						longueur: 300,
						labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_ParametrageEDT.LabelModele",
						),
					});
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees) {
						aInstance.listeModelesGrille =
							new ObjetListeElements_1.ObjetListeElements();
						let lElement = new ObjetElement_1.ObjetElement(
							ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_ParametrageEDT.ModeleDefaut",
							),
							null,
							UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure
								.modeles.defaut,
						);
						aInstance.listeModelesGrille.addElement(lElement);
						if (
							aInstance.applicationSco.parametresUtilisateur.get(
								aInstance._getClePrefsGrilleCourante(),
							)
						) {
							lElement = new ObjetElement_1.ObjetElement(
								ObjetTraduction_1.GTraductions.getValeur(
									"Fenetre_ParametrageEDT.ModelePerso",
								),
								null,
								UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure
									.modeles.perso,
							);
							aInstance.listeModelesGrille.addElement(lElement);
						}
						if (aInstance.etatUtilisateur.tabEtablissementsModeleGrille) {
							ObjetTri_1.ObjetTri.trierTableau(
								aInstance.etatUtilisateur.tabEtablissementsModeleGrille,
								[ObjetTri_1.ObjetTri.init("nom")],
							);
							aInstance.etatUtilisateur.tabEtablissementsModeleGrille.forEach(
								(aEtab) => {
									aInstance.listeModelesGrille.addElement(
										new ObjetElement_1.ObjetElement(
											aEtab.nom,
											null,
											aEtab.numero,
										),
									);
								},
							);
						}
						return aInstance.listeModelesGrille;
					}
				},
				getIndiceSelection: function () {
					let lIndice = -1;
					const lNumeroModele = aInstance._getNumeroModeleGrille();
					aInstance.listeModelesGrille.parcourir((D, aIndice) => {
						if (D.getGenre() === lNumeroModele) {
							lIndice = aIndice;
							return false;
						}
					});
					if (lIndice === -1) {
						lIndice = 0;
						aInstance.applicationSco.parametresUtilisateur.set(
							aInstance._getClePrefsGrilleCourante() + ".modele",
							UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure
								.modeles.defaut,
						);
						aInstance.avecModif = true;
					}
					return lIndice;
				},
				event: function (aParametres, aCombo) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.element &&
						aCombo.estUneInteractionUtilisateur()
					) {
						aInstance.applicationSco.parametresUtilisateur.set(
							aInstance._getClePrefsGrilleCourante() + ".modele",
							aParametres.element.getGenre(),
						);
						aInstance.avecModif = true;
					}
				},
			},
			getClassStructureDetails: function () {
				const lNumeroModele = aInstance._getNumeroModeleGrille();
				if (
					lNumeroModele ===
						UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure
							.modeles.defaut &&
					aInstance.etatUtilisateur.tabEtablissementsModeleGrille &&
					aInstance.etatUtilisateur.tabEtablissementsModeleGrille.length > 0 &&
					[
						Enumere_Ressource_1.EGenreRessource.Classe,
						Enumere_Ressource_1.EGenreRessource.Groupe,
						Enumere_Ressource_1.EGenreRessource.Eleve,
						Enumere_Ressource_1.EGenreRessource.Enseignant,
					].indexOf(aInstance.optionsFenetre.choixGenreRessource) >= 0
				) {
					return "structureDefautMessage";
				}
				return lNumeroModele !==
					UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure
						.modeles.perso
					? "structureDisabled"
					: "";
			},
			cbJour: {
				getValue: function (aIndiceJour) {
					const lEns = aInstance._getModeleGrille().joursOuvres;
					return lEns ? lEns.contains(aIndiceJour) : false;
				},
				setValue: function (aIndiceJour, aValue) {
					const lCle = aInstance._getClePrefsGrilleCourante() + ".joursOuvres";
					const lEns = aInstance.applicationSco.parametresUtilisateur.get(lCle);
					if (lEns) {
						if (aValue && aIndiceJour < IE.Cycles.indicesJoursOuvres().length) {
							lEns.add(aIndiceJour);
						} else {
							lEns.remove(aIndiceJour);
						}
						if (lEns.count() === 0) {
							lEns.add(0);
						}
						aInstance.applicationSco.parametresUtilisateur.set(lCle, lEns);
						aInstance.avecModif = true;
					}
				},
				getDisabled: function () {
					return (
						aInstance._getNumeroModeleGrille() !==
							UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure
								.modeles.perso || !aInstance._getModeleGrille().joursOuvres
					);
				},
			},
			comboHeures: {
				init: function (aHeureDebut, aInstanceCombo) {
					aInstanceCombo.setOptionsObjetSaisie({
						longueur: 60,
						labelWAICellule: aHeureDebut
							? ObjetTraduction_1.GTraductions.getValeur("Debut")
							: ObjetTraduction_1.GTraductions.getValeur("Fin"),
					});
				},
				getDonnees: function (aHeureDebut, aDonnees) {
					if (!aDonnees) {
						return aHeureDebut
							? aInstance.listeHeuresDebut
							: aInstance.listeHeuresFin;
					}
				},
				getIndiceSelection: function (aHeureDebut) {
					const lModele = aInstance._getModeleGrille();
					return aHeureDebut ? lModele.placeDebut : lModele.placeFin;
				},
				event: function (aHeureDebut, aParametres, aCombo) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.element &&
						aCombo.estUneInteractionUtilisateur()
					) {
						const lIndice = aParametres.element.getNumero();
						let lIndiceAutre =
							aInstance.applicationSco.parametresUtilisateur.get(
								aInstance._getClePrefsGrilleCourante() +
									"." +
									(!aHeureDebut ? "placeDebut" : "placeFin"),
							);
						if (aHeureDebut && lIndice > lIndiceAutre) {
							lIndiceAutre = lIndice;
							aInstance.applicationSco.parametresUtilisateur.set(
								aInstance._getClePrefsGrilleCourante() + ".placeFin",
								lIndiceAutre,
							);
						} else if (!aHeureDebut && lIndice < lIndiceAutre) {
							lIndiceAutre = lIndice;
							aInstance.applicationSco.parametresUtilisateur.set(
								aInstance._getClePrefsGrilleCourante() + ".placeDebut",
								lIndiceAutre,
							);
						}
						aInstance.applicationSco.parametresUtilisateur.set(
							aInstance._getClePrefsGrilleCourante() +
								"." +
								(aHeureDebut ? "placeDebut" : "placeFin"),
							lIndice,
						);
						aInstance.avecModif = true;
					}
				},
				getDisabled: function () {
					return (
						aInstance._getNumeroModeleGrille() !==
						UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure
							.modeles.perso
					);
				},
			},
			comboGranularite: {
				init: function (aInstanceCombo) {
					aInstanceCombo.setOptionsObjetSaisie({
						longueur: 150,
						labelledById: `${aInstance.getNom()}_lab_combogran`,
					});
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees) {
						return aInstance.listeGranularites;
					}
				},
				getIndiceSelection: function () {
					const lModele = aInstance._getModeleGrille();
					const lVal = lModele.nbPas || 0;
					let lIndicePasUn = -1;
					let lIndice = -1;
					aInstance.listeGranularites.parcourir((D, aIndice) => {
						if (D.getGenre() === 1) {
							lIndicePasUn = aIndice;
						}
						if (D.getGenre() === lVal) {
							lIndice = aIndice;
							return false;
						}
					});
					if (lIndice < 0) {
						lIndice = lIndicePasUn;
					}
					return lIndice;
				},
				event: function (aParametres, aCombo) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.element &&
						aCombo.estUneInteractionUtilisateur()
					) {
						aInstance.applicationSco.parametresUtilisateur.set(
							aInstance._getClePrefsGrilleCourante() + ".nbPas",
							aParametres.element.getGenre(),
						);
						aInstance.avecModif = true;
					}
				},
				getDisabled: function () {
					return (
						aInstance._getNumeroModeleGrille() !==
						UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure
							.modeles.perso
					);
				},
			},
		});
	}
	surAfficher() {
		this.setOptionsFenetre({
			titre: this.optionsFenetre.estEDT
				? ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_ParametrageEDT.PersonnalisationEDTs",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_ParametrageEDT.PersonnalisationPlannings",
					),
		});
	}
	composeContenu() {
		const T = [];
		T.push('<div class="ObjetFenetre_ParametrageEDT">');
		T.push(
			this._titreZone(
				ObjetTraduction_1.GTraductions.getValeur(
					"Fenetre_ParametrageEDT.PucePresentation",
				),
			),
		);
		T.push(
			'<div class="sousTitre EspaceHaut">',
			"<div>",
			ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_ParametrageEDT.NombreMaxDeDonnees",
			),
			"</div>",
		);
		T.push('<div class="NoWrap">');
		T.push('<div class="flex-contain flex-center p-top-s">');
		T.push(`<div class="EspaceDroit" id="${this.Nom}_lab_combojours">`);
		T.push(
			this.optionsFenetre.estEDT
				? ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_ParametrageEDT.Jours",
					) + " :"
				: ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_ParametrageEDT.LabelNbJoursMax",
					),
		);
		T.push("</div>");
		T.push(
			'<ie-combo ie-model="comboJours(',
			!!this.optionsFenetre.estEDT,
			')"></ie-combo>',
		);
		T.push("</div>");
		T.push('<div class="flex-contain flex-center EspaceHaut">');
		T.push(`<div class="EspaceDroit" id="${this.Nom}_lab_comboseq">`);
		T.push(
			this.optionsFenetre.estEDT
				? ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_ParametrageEDT.NombreSequencesHoraires",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_ParametrageEDT.RessourcesOuSemaines",
					) + " :",
		);
		T.push("</div>");
		if (this.optionsFenetre.estEDT) {
			T.push('<ie-combo ie-model="comboSequences"></ie-combo>');
		} else {
			T.push(
				'<ie-radio ie-model="rbRessources(true)">',
				ObjetTraduction_1.GTraductions.getValeur("toutes"),
				"</ie-radio>",
			);
			T.push(
				'<ie-radio ie-model="rbRessources(false)" class="GrandEspaceGauche">',
				ObjetTraduction_1.GTraductions.getValeur(
					"Fenetre_ParametrageEDT.Personnalise",
				),
				"</ie-radio>",
			);
			T.push(
				'<div class="EspaceGauche">',
				'<input ie-model="inputNbRessources" ie-mask="/[^0-9]/i" maxlength="2" style="',
				ObjetStyle_2.GStyle.composeWidth(25),
				ObjetStyle_2.GStyle.composeCouleurBordure(GCouleur.fenetre.bordure),
				'" />',
				"</div>",
			);
			T.push(
				'<div class="EspaceGauche">',
				ObjetTraduction_1.GTraductions.getValeur(
					"Fenetre_ParametrageEDT.JourMaxNonApplicable",
				),
				"</div>",
			);
		}
		T.push("</div>");
		T.push("</div>");
		T.push("</div>");
		T.push(
			'<div class="sousTitre EspaceHaut">',
			"<div>",
			ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_ParametrageEDT.DefinitionAxes",
			),
			"</div>",
		);
		T.push('<div  class="NoWrap">');
		T.push('<div class="InlineBlock">');
		T.push(
			this._composeInversionAxe(
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parJour,
			),
		);
		T.push("</div>");
		if (!this.optionsFenetre.estEDT) {
			T.push('<div class="InlineBlock" style="padding-left:10px;">');
			T.push(
				this._composeInversionAxe(
					TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.ongletParJour,
				),
			);
			T.push("</div>");
			T.push(
				'<div class="InlineBlock GrandEspaceDroit" style="padding-left:10px;">',
			);
			T.push(
				this._composeInversionAxe(
					TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parSemaine,
				),
			);
			T.push("</div>");
		}
		T.push("</div>");
		T.push("</div>");
		if (this.optionsFenetre.avecStructure) {
			T.push('<div ie-display="getDisplayStructure">');
			T.push(this._composeStructure());
			T.push("</div>");
		}
		T.push("</div>");
		return T.join("");
	}
	surValidation() {
		this.fermer();
		this.callback.appel(this.avecModif);
	}
	_initListeGranularites() {
		this.listeGranularites = new ObjetListeElements_1.ObjetListeElements();
		this.listeGranularites.addElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"Fenetre_ParametrageEDT.PasAAfficherDefaut",
					[ObjetDate_1.GDate.formatDureeEnPlaces(1, "%xh%sh%mm")],
				),
				null,
				1,
			),
		);
		let lElement = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_ParametrageEDT.PasAAfficherSequence",
				[
					ObjetDate_1.GDate.formatDureeEnPlaces(
						this.objetParametres.PlacesParHeure,
						"%xh%sh%mm",
					),
				],
			),
			null,
			TypeGranulariteGrille_1.TypeGranulariteGrille.sequence,
		);
		this.listeGranularites.addElement(lElement);
		if (
			this.objetParametres.debutDemiPension > 0 &&
			this.objetParametres.debutDemiPension < this.objetParametres.PlacesParJour
		) {
			if (
				this.objetParametres.debutDemiPension >=
				this.objetParametres.finDemiPension
			) {
				lElement = new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_ParametrageEDT.PasAAfficherMatinApresMidi",
					),
					null,
					TypeGranulariteGrille_1.TypeGranulariteGrille.demiPensionMatin,
				);
				this.listeGranularites.addElement(lElement);
			} else {
				lElement = new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_ParametrageEDT.PasAAfficherMatinPauseApresMidi",
					),
					null,
					TypeGranulariteGrille_1.TypeGranulariteGrille
						.demiPensionMatinApresMidi,
				);
				this.listeGranularites.addElement(lElement);
			}
		}
		const lMax = Math.floor(this.objetParametres.PlacesParJour / 2);
		for (let i = 2; i <= lMax; i++) {
			this.listeGranularites.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetDate_1.GDate.formatDureeEnPlaces(i, "%xh%sh%mm"),
					null,
					i,
				),
			);
		}
	}
	_accesseurAxeParam(aTypePlanning) {
		return this.optionsFenetre.estEDT
			? "EDT.axeInverseEDT"
			: aTypePlanning ===
					TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parSemaine
				? "EDT.axeInversePlanningHebdo"
				: aTypePlanning ===
						TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parJour
					? "EDT.axeInversePlanningJour"
					: "EDT.axeInversePlanningOngletParJour";
	}
	_construireListeRessources() {
		this.listeRessources = new ObjetListeElements_1.ObjetListeElements();
		[
			Enumere_Ressource_1.EGenreRessource.Enseignant,
			Enumere_Ressource_1.EGenreRessource.Groupe,
			Enumere_Ressource_1.EGenreRessource.Classe,
			Enumere_Ressource_1.EGenreRessource.Salle,
			Enumere_Ressource_1.EGenreRessource.Eleve,
			Enumere_Ressource_1.EGenreRessource.Personnel,
			Enumere_Ressource_1.EGenreRessource.Materiel,
		].forEach((aGenre) => {
			if (
				!this.applicationSco.parametresUtilisateur.get(
					this._getClePrefsGrilleCourante(aGenre),
				)
			) {
				return;
			}
			let lLibelle = "";
			switch (aGenre) {
				case Enumere_Ressource_1.EGenreRessource.Enseignant:
					if (
						!(
							this.etatUtilisateur.GenreEspace ===
								Enumere_Espace_1.EGenreEspace.Professeur &&
							this.etatUtilisateur.ongletEstVisible(
								Enumere_Onglet_1.EGenreOnglet.EmploiDuTemps,
							)
						) &&
						!this.etatUtilisateur.ongletEstVisible(
							Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsProfesseur,
						)
					) {
						return;
					}
					lLibelle = ObjetTraduction_1.GTraductions.getValeur("Professeurs");
					break;
				case Enumere_Ressource_1.EGenreRessource.Groupe:
					if (
						!this.etatUtilisateur.ongletEstVisible(
							Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsClasse,
						)
					) {
						return;
					}
					lLibelle = ObjetTraduction_1.GTraductions.getValeur("Groupes");
					break;
				case Enumere_Ressource_1.EGenreRessource.Classe:
					if (
						!this.etatUtilisateur.ongletEstVisible(
							Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsClasse,
						)
					) {
						return;
					}
					lLibelle = ObjetTraduction_1.GTraductions.getValeur("Classes");
					break;
				case Enumere_Ressource_1.EGenreRessource.Salle:
					if (
						!this.etatUtilisateur.ongletEstVisible(
							Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsSalle,
						)
					) {
						return;
					}
					lLibelle = ObjetTraduction_1.GTraductions.getValeur("Salles");
					break;
				case Enumere_Ressource_1.EGenreRessource.Eleve:
					if (
						!this.etatUtilisateur.ongletEstVisible(
							Enumere_Onglet_1.EGenreOnglet.EmploiDuTemps,
						) &&
						!this.etatUtilisateur.ongletEstVisible(
							Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsEleve,
						)
					) {
						return;
					}
					lLibelle = ObjetTraduction_1.GTraductions.getValeur("Eleves");
					break;
				case Enumere_Ressource_1.EGenreRessource.Materiel:
					if (
						!this.etatUtilisateur.ongletEstVisible(
							Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsMateriel,
						)
					) {
						return;
					}
					lLibelle = ObjetTraduction_1.GTraductions.getValeur("Materiels");
					break;
				case Enumere_Ressource_1.EGenreRessource.Personnel:
					if (
						!(
							(this.etatUtilisateur.GenreEspace ===
								Enumere_Espace_1.EGenreEspace.Etablissement ||
								this.etatUtilisateur.GenreEspace ===
									Enumere_Espace_1.EGenreEspace.Administrateur) &&
							this.etatUtilisateur.ongletEstVisible(
								Enumere_Onglet_1.EGenreOnglet.EmploiDuTemps,
							)
						) &&
						!this.etatUtilisateur.ongletEstVisible(
							Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsPersonnelEtablissement,
						)
					) {
						return;
					}
					lLibelle = ObjetTraduction_1.GTraductions.getValeur("Personnels");
					break;
				default:
			}
			this.listeRessources.addElement(
				new ObjetElement_1.ObjetElement(lLibelle, aGenre),
			);
		});
	}
	_getNumeroModeleGrille() {
		return this.applicationSco.parametresUtilisateur.get(
			this._getClePrefsGrilleCourante() + ".modele",
		);
	}
	_getModeleGrille() {
		return UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure.getPrefsGrille(
			this.optionsFenetre.choixGenreRessource ||
				Enumere_Ressource_1.EGenreRessource.Enseignant,
			!this.optionsFenetre.estEDT,
		);
	}
	_getClePrefsGrilleCourante(aGenreRessource) {
		return UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure.getCleModelePrefsGrille(
			aGenreRessource || this.optionsFenetre.choixGenreRessource,
			!this.optionsFenetre.estEDT,
		);
	}
	_composeInversionAxe(aTypePlanning) {
		const T = [],
			lHeightTitre = 15,
			lHeightLigne = 19,
			lWidthLibelle = this.optionsFenetre.estEDT ? 80 : 150;
		const lEcartHeightTitre = this.optionsFenetre.estEDT ? 0 : lHeightTitre;
		T.push('<div class="NoWrap">');
		if (
			aTypePlanning ===
			TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parJour
		) {
			T.push(
				'<div class="InlineBlock AlignementMilieuVertical" style="margin-top:',
				lEcartHeightTitre,
				'px;">',
				'<div style="',
				ObjetStyle_2.GStyle.composeHeight(lHeightLigne),
				'">',
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.EDT.Horizontal",
				) + " :",
				"</div>",
				'<div style="',
				ObjetStyle_2.GStyle.composeHeight(lHeightLigne),
				'">',
				ObjetTraduction_1.GTraductions.getValeur("GenerationPDF.EDT.Vertical") +
					" :",
				"</div>",
				"</div>",
			);
		}
		T.push(
			'<div class="InlineBlock EspaceGauche AlignementMilieuVertical" style="margin-top:',
			lEcartHeightTitre,
			'px;">',
			"<ie-btnimage ",
			ObjetHtml_1.GHtml.composeAttr(
				"ie-model",
				"btnInversionAxe",
				aTypePlanning,
			),
			' class="Image_IntervertirLigneDevant" style="width:10px"></ie-btnimage>',
			"</div>",
		);
		T.push(
			'<div class="InlineBlock PetitEspaceGauche AlignementMilieuVertical">',
		);
		if (!this.optionsFenetre.estEDT) {
			T.push(
				'<div style="',
				ObjetStyle_2.GStyle.composeHeight(lHeightTitre),
				ObjetStyle_2.GStyle.composeWidth(lWidthLibelle),
				'" class="AlignementMilieu">',
				aTypePlanning ===
					TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parJour
					? ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_ParametrageEDT.Titre_ParJour",
						)
					: aTypePlanning ===
							TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning
								.ongletParJour
						? ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_ParametrageEDT.Titre_OngletParJour",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_ParametrageEDT.Titre_ParSemaine",
							),
				"</div>",
			);
		}
		T.push(
			'<div class="m-bottom-s" style="',
			ObjetStyle_2.GStyle.composeHeight(lHeightLigne),
			'">',
			"<div ",
			ObjetHtml_1.GHtml.composeAttr("ie-html", "htmlAxe", [
				aTypePlanning,
				true,
			]),
			ObjetHtml_1.GHtml.composeAttr(
				"ie-event",
				"click->surInversionAxe",
				aTypePlanning,
			),
			' class="AvecMain AlignementMilieu p-all-s"',
			' style="',
			ObjetStyle_2.GStyle.composeCouleurBordure(GCouleur.fenetre.bordure),
			ObjetStyle_2.GStyle.composeWidth(lWidthLibelle),
			'" ie-ellipsis></div>',
			"</div>",
			'<div style="',
			ObjetStyle_2.GStyle.composeHeight(lHeightLigne),
			'">',
			"<div ",
			ObjetHtml_1.GHtml.composeAttr("ie-html", "htmlAxe", [
				aTypePlanning,
				false,
			]),
			ObjetHtml_1.GHtml.composeAttr(
				"ie-event",
				"click->surInversionAxe",
				aTypePlanning,
			),
			' class="AvecMain AlignementMilieu p-all-s"',
			' style="',
			ObjetStyle_2.GStyle.composeCouleurBordure(GCouleur.fenetre.bordure),
			ObjetStyle_2.GStyle.composeWidth(lWidthLibelle),
			'" ie-ellipsis></div>',
			"</div>",
			"</div>",
		);
		T.push(
			'<div class="InlineBlock PetitEspaceGauche AlignementMilieuVertical" style="margin-top:',
			lEcartHeightTitre,
			'px;">',
			"<ie-btnimage ",
			ObjetHtml_1.GHtml.composeAttr(
				"ie-model",
				"btnInversionAxe",
				aTypePlanning,
			),
			' class="Image_IntervertirLigneDerriere" style="width:10px"></ie-btnimage>',
			"</div>",
		);
		T.push("</div>");
		return T.join("");
	}
	_titreZone(aLibelle, aClass) {
		const T = [];
		T.push("<ul><li>");
		T.push(
			'<div class="titreZone ',
			aClass ? aClass : "",
			'">',
			aLibelle,
			"</div>",
		);
		T.push("</li></ul>");
		T.push(
			'<div style="',
			ObjetStyle_2.GStyle.composeCouleurBordure(
				GCouleur.fenetre.bordure,
				1,
				ObjetStyle_1.EGenreBordure.bas,
			),
			'"></div>',
		);
		return T.join("");
	}
	_composeStructure() {
		const T = [];
		const lTitre = [
			'<div class="flexHoriz">',
			'<div style="padding-right:10px;">',
			ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_ParametrageEDT.PuceStructure",
			),
			"</div>",
			'<ie-combo ie-model="comboRessStructure" ie-display="getDisplayCombo"></ie-combo>',
		].join("");
		T.push(this._titreZone(lTitre, "GrandEspaceHaut EspaceBas"));
		T.push(
			'<div class="flexHoriz EspaceHaut EspaceBas" ie-display="getDisplayModeleGrille">',
			'<div style="padding-right:5px;" class="Insecable">',
			ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_ParametrageEDT.LabelModele",
			),
			"</div>",
			'<ie-combo ie-model="comboRessStructureModele"></ie-combo>',
			"</div>",
		);
		T.push('<div class="structure" ie-class="getClassStructureDetails">');
		T.push(
			'<div class="structureMessage">',
			ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_ParametrageEDT.PrefsDependDesRessources",
			),
			"</div>",
		);
		T.push('<div  class="structureDetails">');
		T.push(
			'<div class="sousTitre">',
			"<div>",
			this.optionsFenetre.estEDT
				? ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_ParametrageEDT.PuceJoursEtHeuresEdt",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_ParametrageEDT.PuceJoursEtHeuresPlanning",
					),
			"</div>",
		);
		T.push("<div>");
		T.push('<div class="flexHoriz EspaceHaut">');
		IE.Cycles.indicesJoursOuvres().forEach((aJour, aIndice) => {
			T.push(
				'<ie-checkbox ie-model="cbJour(' +
					aIndice +
					')" style="margin-right:8px;">',
				UtilitaireConvertisseurPositionGrille_1.TUtilitaireConvertisseurPosition_Grille.getLibelleJourCycle(
					aIndice,
				),
				"</ie-checkbox>",
			);
		});
		T.push("</div>");
		T.push('<div class="flexHoriz EspaceHaut">');
		T.push(
			ObjetTraduction_1.GTraductions.getValeur("Dates.DeHeureDebutAHeureFin", [
				'<ie-combo ie-model="comboHeures(true)" style="padding-left: 5px; padding-right:8px;"></ie-combo>',
				'<ie-combo ie-model="comboHeures(false)" style="padding-left: 5px;"></ie-combo>',
			]).ucfirst(),
		);
		T.push("</div>");
		T.push("</div>");
		T.push("</div>");
		if (this.optionsFenetre.avecGranularite) {
			T.push(
				'<div class="sousTitre">',
				"<div>",
				ObjetTraduction_1.GTraductions.getValeur(
					"Fenetre_ParametrageEDT.PucePasHoraireAAfficher",
				),
				"</div>",
			);
			T.push("<div>");
			T.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"Fenetre_ParametrageEDT.ExplicationPasHoraireAAfficher",
					[ObjetDate_1.GDate.formatDureeEnPlaces(1, "%xh%sh%mm")],
				),
			);
			T.push('<div class="flexHoriz EspaceHaut">');
			T.push(
				IE.jsx.str(
					"div",
					{ id: `${this.Nom}_lab_combogran` },
					this.optionsFenetre.estEDT
						? ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_ParametrageEDT.DureePasHoraireAAfficher",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_ParametrageEDT.DureePasHoraireAAfficherPlanning",
							),
				),
			);
			T.push(
				'<div class="EspaceGauche"><ie-combo ie-model="comboGranularite"></ie-combo></div>',
			);
			T.push("</div>");
			T.push("</div>");
		}
		T.push("</div>");
		T.push("</div>");
		return T.join("");
	}
}
exports.ObjetFenetre_ParametrageEDT = ObjetFenetre_ParametrageEDT;
