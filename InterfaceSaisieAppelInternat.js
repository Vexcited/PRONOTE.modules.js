exports.InterfaceSaisieAppelInternat = void 0;
const ObjetInterfacePageCP_1 = require("ObjetInterfacePageCP");
const ObjetListe_1 = require("ObjetListe");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetRequeteCreneauxAppelsInternat_1 = require("ObjetRequeteCreneauxAppelsInternat");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetChaine_1 = require("ObjetChaine");
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetRequeteSaisieAppelInternat_1 = require("ObjetRequeteSaisieAppelInternat");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetTri_1 = require("ObjetTri");
class InterfaceSaisieAppelInternat extends ObjetInterfacePageCP_1.InterfacePageCP {
	constructor(...aParams) {
		super(...aParams);
		this.idBandeauAppel = this.Nom + "_BandeauAppel_" + GUID_1.GUID.getId();
		this.idBandeauAppelTitre =
			this.Nom + "_BandeauAppel_Titre_" + GUID_1.GUID.getId();
		this.date = GApplication.getDemo()
			? GApplication.getDateDemo()
			: ObjetDate_1.GDate.getDateCourante(true);
		this.setOptionsEcrans({ nbNiveaux: 2, avecBascule: IE.estMobile });
		this.contexte = $.extend(this.contexte, {
			ecran: [
				InterfaceSaisieAppelInternat.genreEcran.listeCreneaux,
				InterfaceSaisieAppelInternat.genreEcran.listeAppel,
			],
		});
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone = [this.identDate];
		if (this.optionsEcrans.avecBascule) {
			this.AddSurZone.push({
				html: IE.jsx.str(
					"div",
					{ id: this.idBandeauAppel },
					this.construireBandeauEcran(
						IE.jsx.str(
							"div",
							{ class: "titres-contain" },
							IE.jsx.str("h3", {
								class: "text-center m-right-xxl",
								id: this.idBandeauAppelTitre,
							}),
						),
						{ bgWhite: true },
					),
				),
			});
		}
	}
	construireInstances() {
		this.identDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			(aDate) => {
				if (aDate) {
					this.date = aDate;
					this.requeteAppelInternat();
					if (this.optionsEcrans.avecBascule) {
						ObjetHtml_1.GHtml.setDisplay(
							this.getIdDeNiveau({ niveauEcran: 1 }),
							false,
						);
					}
				}
			},
			(aInstance) => {
				aInstance.setOptionsObjetCelluleDate({
					formatDate: "[%JJJJ %JJ %MMM]",
					avecBoutonsPrecedentSuivant: true,
					largeurComposant: 120,
				});
			},
		);
		this.identListeCreneaux = this.add(
			ObjetListe_1.ObjetListe,
			(aParametres) => {
				switch (aParametres.genreEvenement) {
					case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
						this.setCtxSelection({
							niveauEcran: 0,
							dataEcran: aParametres.article,
						});
						this.basculerEcran(
							{ niveauEcran: 0, dataEcran: aParametres.article },
							{
								niveauEcran: 1,
								genreEcran: this.getCtxEcran({ niveauEcran: 1 }),
							},
						);
						break;
					}
				}
			},
			(aListe) => {
				aListe.setOptionsListe({
					skin: ObjetListe_1.ObjetListe.skin.flatDesign,
					avecOmbreDroite: true,
				});
			},
		);
		this.identListeAppel = this.add(ObjetListe_1.ObjetListe, null, (aListe) => {
			aListe.setOptionsListe({
				skin: ObjetListe_1.ObjetListe.skin.flatDesign,
				messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
					"AppelInternat.messageAucunEleveInscrit",
				),
			});
		});
	}
	async construireEcran(aParams) {
		switch (aParams.genreEcran) {
			case InterfaceSaisieAppelInternat.genreEcran.listeCreneaux:
				if (this.optionsEcrans.avecBascule) {
					this.initialiser(true);
					this.getInstance(this.identListeCreneaux).selectionnerLigne({
						deselectionnerTout: true,
					});
				}
				break;
			case InterfaceSaisieAppelInternat.genreEcran.listeAppel: {
				const lCreneau = this.getCtxSelection({ niveauEcran: 0 });
				if (this.optionsEcrans.avecBascule) {
					ObjetHtml_1.GHtml.setDisplay(this.idBandeauAppel, true);
					ObjetHtml_1.GHtml.setHtml(
						this.idBandeauAppelTitre,
						lCreneau.getLibelle(),
					);
				}
				const lIdInfosAppel = this.Nom + "infosAppel";
				const lBoutons = [];
				lBoutons.push({
					controleur: {
						getInfoAppel: () => {
							return IE.jsx.str(
								IE.jsx.fragment,
								null,
								IE.jsx.str(
									"div",
									null,
									lCreneau.estAppelTermine
										? ObjetTraduction_1.GTraductions.getValeur(
												"AbsenceVS.AppelFait",
											)
										: ObjetTraduction_1.GTraductions.getValeur(
												"AppelInternat.appelEnCours",
											),
								),
								IE.jsx.str(
									"div",
									null,
									ObjetTraduction_1.GTraductions.getValeur(
										"AppelInternat.nbElevesAbsent",
										[lCreneau.nbAbsences],
									),
									" / ",
									lCreneau.nbElevesAttendus,
								),
							);
						},
					},
					html: IE.jsx.str("div", {
						id: lIdInfosAppel,
						"ie-html": "getInfoAppel",
					}),
				});
				lBoutons.push({ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher });
				lBoutons.push({ genre: ObjetListe_1.ObjetListe.typeBouton.deployer });
				this.getInstance(this.identListeAppel)
					.setOptionsListe({
						ariaDescribedBy: lIdInfosAppel,
						boutons: lBoutons,
					})
					.setDonnees(
						new DonneesListe_RessourcesAppelsInternat(
							lCreneau.listeRessources,
							this.requeteSaisieInternat.bind(this),
						),
					);
				break;
			}
		}
	}
	_evntRetourEcranPrec() {
		switch (this.getCtxEcran({ niveauEcran: this.contexte.niveauCourant })) {
			case InterfaceSaisieAppelInternat.genreEcran.listeAppel:
				this.setCtxSelection({ niveauEcran: 0, dataEcran: null });
				this.revenirSurEcranPrecedent();
				break;
		}
	}
	construireStructureAffichageAutre() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ class: "InterfaceSaisieAppelInternat" },
				IE.jsx.str(
					"section",
					{
						id: this.getIdDeNiveau({ niveauEcran: 0 }),
						class: "liste-creneaux",
					},
					IE.jsx.str("div", {
						id: this.getNomInstance(this.identListeCreneaux),
						class: ["full-height"],
					}),
				),
				IE.jsx.str(
					"section",
					{
						id: this.getIdDeNiveau({ niveauEcran: 1 }),
						class: "appel-internat",
					},
					IE.jsx.str("div", {
						id: this.getNomInstance(this.identListeAppel),
						class: ["full-height"],
					}),
				),
			),
		);
	}
	recupererDonnees() {
		this.getInstance(this.identDate).setDonnees(this.date, true);
		ObjetHtml_1.GHtml.setDisplay(this.idBandeauAppel, false);
	}
	requeteAppelInternat() {
		new ObjetRequeteCreneauxAppelsInternat_1.ObjetRequeteCreneauxAppelsInternat(
			this,
			(aJSON) => {
				this.listeCreneaux = aJSON.listeCreneaux;
				const lCreneau = this.getCtxSelection({ niveauEcran: 0 });
				let lIndice = -1;
				if (lCreneau) {
					lIndice = this.listeCreneaux.getIndiceParElement(lCreneau);
				}
				this.getInstance(this.identListeCreneaux).setDonnees(
					new DonneesListe_CreneauxAppelsInternat(this.listeCreneaux),
					lIndice,
				);
				if (lIndice === undefined) {
					ObjetHtml_1.GHtml.setHtml(
						this.getNomInstance(this.identListeAppel),
						"",
					);
				}
			},
		).lancerRequete({ date: this.date });
	}
	requeteSaisieInternat(aRessource) {
		const lCreneau = this.getCtxSelection({ niveauEcran: 0 });
		const lParam = {
			creneau: this.getCtxSelection({ niveauEcran: 0 }),
			date: this.date,
			ressource: aRessource,
		};
		new ObjetRequeteSaisieAppelInternat_1.ObjetRequeteSaisieAppelInternat(
			this,
			() => {
				let lNbAbsences = 0;
				let lNbRetards = 0;
				lCreneau.listeRessources.parcourir((aRessource) => {
					if (aRessource.estCumul) {
						lNbAbsences += aRessource.nbAbsences;
						lNbRetards += aRessource.nbRetards;
					}
				});
				lCreneau.estAppelTermine =
					!lCreneau.listeRessourcesCumul.getElementParFiltre((aRessource) => {
						return !aRessource.estAppelFait;
					});
				lCreneau.nbAbsences = lNbAbsences;
				lCreneau.nbRetards = lNbRetards;
			},
		).lancerRequete(lParam);
	}
}
exports.InterfaceSaisieAppelInternat = InterfaceSaisieAppelInternat;
(function (InterfaceSaisieAppelInternat) {
	let genreEcran;
	(function (genreEcran) {
		genreEcran["listeCreneaux"] = "listeCreneaux";
		genreEcran["listeAppel"] = "listeAppel";
	})(
		(genreEcran =
			InterfaceSaisieAppelInternat.genreEcran ||
			(InterfaceSaisieAppelInternat.genreEcran = {})),
	);
})(
	InterfaceSaisieAppelInternat ||
		(exports.InterfaceSaisieAppelInternat = InterfaceSaisieAppelInternat = {}),
);
class DonneesListe_CreneauxAppelsInternat extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(...aParams) {
		super(...aParams);
		this.setOptions({ avecBoutonActionLigne: false, avecEvnt_Selection: true });
	}
	jsxIfAvecIcone(aCreneau) {
		if (aCreneau && aCreneau.listeRessourcesCumul) {
			return aCreneau.listeRessourcesCumul.count() > 0;
		}
		return false;
	}
	jsxFuncAttrIcone(aCreneau) {
		const lTexte =
			aCreneau && aCreneau.estAppelTermine
				? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.AppelFait")
				: ObjetTraduction_1.GTraductions.getValeur(
						"AppelInternat.appelNonFait",
					);
		return {
			"aria-label": lTexte,
			title: lTexte,
			class:
				(aCreneau && aCreneau.estAppelTermine
					? "Image_AppelFait"
					: "Image_AppelNonFait") + " m-left",
		};
	}
	getTitreZonePrincipale(aParams) {
		return IE.jsx.str(
			"div",
			{ class: "flex-contain" },
			aParams.article.getLibelle(),
			IE.jsx.str("div", {
				role: "img",
				"ie-if": this.jsxIfAvecIcone.bind(this, aParams.article),
				"ie-attr": this.jsxFuncAttrIcone.bind(this, aParams.article),
				"aria-label": ObjetTraduction_1.GTraductions.getValeur(
					"AppelInternat.appelNonFait",
				),
			}),
		);
	}
	getInfosSuppZonePrincipale(aParams) {
		const lStrLibellesRessources = aParams.article.listeRessourcesCumul
			.getTableauLibelles()
			.join(", ");
		const lLibelle =
			aParams.article.heure +
			(lStrLibellesRessources ? " - " + lStrLibellesRessources : "");
		return IE.jsx.str(
			"div",
			{ title: ObjetChaine_1.GChaine.toTitle(lLibelle) },
			lLibelle,
		);
	}
	jsxGetHtmlInfosCreneau(aCreneau) {
		let lHtml = "";
		if (
			aCreneau &&
			aCreneau.listeRessourcesCumul &&
			aCreneau.listeRessourcesCumul.count() > 0
		) {
			if (aCreneau.estAppelTermine) {
				lHtml = ObjetTraduction_1.GTraductions.getValeur(
					"AppelInternat.nbAbsencesSurCreneau",
					[aCreneau.nbAbsences, aCreneau.nbElevesAttendus],
				);
			} else {
				lHtml = ObjetTraduction_1.GTraductions.getValeur(
					"AppelInternat.nbPrevusSurCreneau",
					[aCreneau.nbElevesAttendus],
				);
			}
		}
		return lHtml;
	}
	getZoneComplementaire(aParams) {
		return IE.jsx.str("div", {
			"ie-html": this.jsxGetHtmlInfosCreneau.bind(this, aParams.article),
		});
	}
}
class DonneesListe_RessourcesAppelsInternat extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aListeDonnees, aCallback) {
		super(aListeDonnees);
		this.callback = aCallback;
		this.setOptions({ avecBoutonActionLigne: false, avecSelection: false });
	}
	getTri() {
		return [
			ObjetTri_1.ObjetTri.initRecursif("pere", [
				ObjetTri_1.ObjetTri.init((D) => {
					return D.getLibelle();
				}),
			]),
		];
	}
	surCBAbsence(aEleve, aValeur) {
		aEleve.estAbsent = aValeur;
		if (aEleve.estEnRetard) {
			aEleve.pere.nbRetards -= 1;
		}
		aEleve.estEnRetard = false;
		aEleve.pere.nbAbsences += aValeur ? 1 : -1;
		this.callback(aEleve);
	}
	surCBRetard(aEleve, aValeur) {
		aEleve.estEnRetard = aValeur;
		if (aEleve.estAbsent) {
			aEleve.pere.nbAbsences -= 1;
		}
		aEleve.estAbsent = false;
		aEleve.pere.nbRetards += aValeur ? 1 : -1;
		this.callback(aEleve);
	}
	getZoneGauche(aParams) {
		if (!aParams.article.estCumul) {
			const lEleve = aParams.article;
			const lAvecPhoto = GApplication.droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.consulterPhotosEleves,
			);
			const lLibelle = (lEleve && lEleve.getLibelle()) || "";
			return IE.jsx.str("img", {
				"ie-load-src": lAvecPhoto
					? ObjetChaine_1.GChaine.creerUrlBruteLienExterne(lEleve, {
							libelle: "photo.jpg",
						})
					: false,
				class: "img-portrait",
				"ie-imgviewer": true,
				style: "width: 3.5rem;height: 4rem;",
				alt: lLibelle,
				"data-libelle": lLibelle,
			});
		}
	}
	getTitreZonePrincipale(aParams) {
		if (aParams.article.estCumul) {
			const lRessource = aParams.article;
			return IE.jsx.str(
				"div",
				{ class: "theme_color_foncee" },
				lRessource.getLibelle(),
				" (",
				lRessource.nbElevesAttendus,
				")",
			);
		} else {
			const lEleve = aParams.article;
			return IE.jsx.str(
				"div",
				null,
				lEleve.getLibelle(),
				lEleve.estExclu
					? " [" +
							ObjetTraduction_1.GTraductions.getValeur("AppelInternat.exclu") +
							"]"
					: "",
				lEleve.enMesureConservatoire
					? " [" +
							ObjetTraduction_1.GTraductions.getValeur("AppelInternat.MC") +
							"]"
					: "",
				lEleve.enStage
					? " [" +
							ObjetTraduction_1.GTraductions.getValeur(
								"AppelInternat.enStage",
							) +
							"]"
					: "",
			);
		}
	}
	getInfosSuppZonePrincipale(aParams) {
		if (!aParams.article.estCumul) {
			const lEleve = aParams.article;
			return IE.jsx.str("div", null, lEleve.strClasse);
		}
	}
	jsxGetHtmlInfosAbsenceRessource(aRessource) {
		const lNbAbsences = ObjetTraduction_1.GTraductions.getValeur(
			"AppelInternat.nbElevesAbsent",
			[aRessource.nbAbsences],
		);
		const lNbRetards = ObjetTraduction_1.GTraductions.getValeur(
			"AppelInternat.nbElevesRetard",
			[aRessource.nbRetards],
		);
		const lStrNbAbsence =
			aRessource.nbAbsences && aRessource.nbRetards
				? lNbAbsences + ", " + lNbRetards
				: aRessource.nbAbsences
					? lNbAbsences
					: aRessource.nbRetards
						? lNbRetards
						: ObjetTraduction_1.GTraductions.getValeur(
								"AppelInternat.aucunEleveAbsent",
							);
		return lStrNbAbsence;
	}
	jsxModeleSwitchAppelFait(aRessource) {
		return {
			getValue: () => {
				return aRessource ? aRessource.estAppelFait : false;
			},
			setValue: (aValue) => {
				if (aRessource) {
					aRessource.estAppelFait = aValue;
					this.callback(aRessource);
				}
			},
		};
	}
	jsxFuncAttrBlocCheckbox(aEleve) {
		let lAriaLabel = "";
		if (aEleve) {
			if (aEleve.estAbsent) {
				lAriaLabel = ObjetTraduction_1.GTraductions.getValeur(
					"AppelInternat.boutonAbsent",
				);
			} else if (aEleve.estEnRetard) {
				lAriaLabel = ObjetTraduction_1.GTraductions.getValeur(
					"AppelInternat.boutonRetard",
				);
			} else {
				lAriaLabel = ObjetTraduction_1.GTraductions.getValeur(
					"AppelInternat.wai.present",
				);
			}
		}
		return { "aria-label": lAriaLabel };
	}
	jsxModeleCheckboxAbsence(aEleve) {
		return {
			getValue: () => {
				return aEleve && aEleve.estAbsent;
			},
			setValue: (aValue) => {
				const lFunc = (aFnEleve) => {
					if (aFnEleve.pere.estAppelFait) {
						GApplication.getMessage().afficher({
							message: ObjetTraduction_1.GTraductions.getValeur(
								"AppelInternat.messConfirmezModifFeuilleAppel",
							),
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							callback: (aAccepte) => {
								if (aAccepte === Enumere_Action_1.EGenreAction.Valider) {
									aFnEleve.pere.estAppelFait = false;
									this.callback(aFnEleve.pere);
									this.surCBAbsence(aFnEleve, aValue);
								}
							},
						});
					} else {
						this.surCBAbsence(aFnEleve, aValue);
					}
				};
				if (
					aEleve &&
					aEleve.enStage &&
					aEleve.avecConfirmationEnStage &&
					aValue
				) {
					GApplication.getMessage().afficher({
						message: ObjetTraduction_1.GTraductions.getValeur(
							"AppelInternat.messConfirmezSaisieAbsenceInternatSurStage",
						),
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						callback: (aAccepte) => {
							if (aAccepte === Enumere_Action_1.EGenreAction.Valider) {
								lFunc(aEleve);
							}
						},
					});
				} else {
					lFunc(aEleve);
				}
			},
			getDisabled: () => {
				return !aEleve || aEleve.estExclu || aEleve.enMesureConservatoire;
			},
		};
	}
	jsxModeleCheckboxRetard(aEleve) {
		return {
			getValue: () => {
				return aEleve && aEleve.estEnRetard;
			},
			setValue: (aValue) => {
				const lFunc = (aFnEleve) => {
					if (aFnEleve.pere.estAppelFait) {
						GApplication.getMessage().afficher({
							message: ObjetTraduction_1.GTraductions.getValeur(
								"AppelInternat.messConfirmezModifFeuilleAppel",
							),
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							callback: (aAccepte) => {
								if (aAccepte === Enumere_Action_1.EGenreAction.Valider) {
									aFnEleve.pere.estAppelFait = false;
									this.callback(aFnEleve.pere);
									this.surCBRetard(aFnEleve, aValue);
								}
							},
						});
					} else {
						this.surCBRetard(aFnEleve, aValue);
					}
				};
				if (
					aEleve &&
					aEleve.enStage &&
					aEleve.avecConfirmationEnStage &&
					aValue
				) {
					GApplication.getMessage().afficher({
						message: ObjetTraduction_1.GTraductions.getValeur(
							"AppelInternat.messConfirmezSaisieRetardInternatSurStage",
						),
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						callback: (aAccepte) => {
							if (aAccepte === Enumere_Action_1.EGenreAction.Valider) {
								lFunc(aEleve);
							}
						},
					});
				} else {
					lFunc(aEleve);
				}
			},
			getDisabled: () => {
				return !aEleve || aEleve.estExclu || aEleve.enMesureConservatoire;
			},
		};
	}
	getZoneMessageLarge(aParams) {
		const H = [];
		if (aParams.article.estCumul) {
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str("div", {
						"ie-html": this.jsxGetHtmlInfosAbsenceRessource.bind(
							this,
							aParams.article,
						),
					}),
					IE.jsx.str(
						"div",
						{ class: "flex-contain" },
						IE.jsx.str(
							"ie-switch",
							{
								class: "m-left-auto",
								"ie-model": this.jsxModeleSwitchAppelFait.bind(
									this,
									aParams.article,
								),
							},
							ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.AppelFait"),
						),
					),
				),
			);
		} else {
			H.push(
				IE.jsx.str(
					"div",
					{
						role: "group",
						class: "flex-contain justify-end",
						"ie-attr": this.jsxFuncAttrBlocCheckbox.bind(this, aParams.article),
					},
					IE.jsx.str(
						"ie-checkbox",
						{
							"ie-model": this.jsxModeleCheckboxAbsence.bind(
								this,
								aParams.article,
							),
							class: "as-chips rouge avecCouleur-is-disabled m-all",
							title: aParams.article.motifAbsent,
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"AppelInternat.boutonAbsent",
						),
					),
					IE.jsx.str(
						"ie-checkbox",
						{
							"ie-model": this.jsxModeleCheckboxRetard.bind(
								this,
								aParams.article,
							),
							class: "as-chips light-jaune avecCouleur-is-disabled m-all",
							title: aParams.article.motifRetard,
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"AppelInternat.boutonRetard",
						),
					),
				),
			);
		}
		return H.join("");
	}
}
