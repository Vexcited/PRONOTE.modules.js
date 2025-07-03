exports.GestionnaireBlocTAF = exports.EGenreBtnActionBlocTAF = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireDuree_1 = require("UtilitaireDuree");
const GestionnaireBlocPN_1 = require("GestionnaireBlocPN");
const GestionnaireBlocPN_2 = require("GestionnaireBlocPN");
const Enumere_Bloc_1 = require("Enumere_Bloc");
const Enumere_ModeAffichageTimeline_1 = require("Enumere_ModeAffichageTimeline");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetChaine_1 = require("ObjetChaine");
const TypeNiveauDifficulte_1 = require("TypeNiveauDifficulte");
const TypeGenreRenduTAF_1 = require("TypeGenreRenduTAF");
const UtilitaireBloc_1 = require("UtilitaireBloc");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetRequeteSaisieTAFFaitEleve_1 = require("ObjetRequeteSaisieTAFFaitEleve");
const MultiObjetRequeteSaisieTAFARendreEleve = require("ObjetRequeteSaisieTAFARendreEleve");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const TypeFichierExterneHttpSco_1 = require("TypeFichierExterneHttpSco");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_CorrectionTaf_1 = require("ObjetFenetre_CorrectionTaf");
const ObjetUtilitaireCahierDeTexte_1 = require("ObjetUtilitaireCahierDeTexte");
const AccessApp_1 = require("AccessApp");
var EGenreBtnActionBlocTAF;
(function (EGenreBtnActionBlocTAF) {
	EGenreBtnActionBlocTAF[(EGenreBtnActionBlocTAF["documentRendu"] = 1)] =
		"documentRendu";
	EGenreBtnActionBlocTAF[(EGenreBtnActionBlocTAF["executionQCM"] = 2)] =
		"executionQCM";
	EGenreBtnActionBlocTAF[(EGenreBtnActionBlocTAF["consulter"] = 3)] =
		"consulter";
	EGenreBtnActionBlocTAF[(EGenreBtnActionBlocTAF["tafFait"] = 4)] = "tafFait";
	EGenreBtnActionBlocTAF[(EGenreBtnActionBlocTAF["executionKiosque"] = 5)] =
		"executionKiosque";
	EGenreBtnActionBlocTAF[(EGenreBtnActionBlocTAF["voirQCM"] = 6)] = "voirQCM";
	EGenreBtnActionBlocTAF[(EGenreBtnActionBlocTAF["voirContenu"] = 7)] =
		"voirContenu";
	EGenreBtnActionBlocTAF[(EGenreBtnActionBlocTAF["detailTAF"] = 8)] =
		"detailTAF";
	EGenreBtnActionBlocTAF[(EGenreBtnActionBlocTAF["consulterCorrige"] = 9)] =
		"consulterCorrige";
})(
	EGenreBtnActionBlocTAF ||
		(exports.EGenreBtnActionBlocTAF = EGenreBtnActionBlocTAF = {}),
);
class GestionnaireBlocTAF extends GestionnaireBlocPN_1.GestionnaireBlocPN {
	constructor(...aParams) {
		super(...aParams);
		this.setGenreBloc(Enumere_Bloc_1.EGenreBloc.TravailAFaire);
		const lOptions = {
			modeAffichage:
				Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.classique,
			initPlie: false,
			callBackTitre: undefined,
		};
		$.extend(this._options, lOptions);
	}
	getParamsBloc(aDataBloc) {
		const lInstanceMetier = this.getInstanceObjetMetier(
			aDataBloc,
			ObjetBlocTAF,
		);
		const lParamBloc = lInstanceMetier.getParamsBloc();
		$.extend(lParamBloc, {
			htmlContenu: this.composeZoneInstance(lInstanceMetier),
		});
		return lParamBloc;
	}
}
exports.GestionnaireBlocTAF = GestionnaireBlocTAF;
class ObjetBlocTAF extends GestionnaireBlocPN_2.ObjetBlocPN {
	constructor() {
		super(...arguments);
		this.peuFaireTAF = [
			Enumere_Espace_1.EGenreEspace.Eleve,
			Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
		].includes(GEtatUtilisateur.GenreEspace);
		this.pourEleve = [
			Enumere_Espace_1.EGenreEspace.Eleve,
			Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
			Enumere_Espace_1.EGenreEspace.Parent,
			Enumere_Espace_1.EGenreEspace.Mobile_Parent,
			Enumere_Espace_1.EGenreEspace.Accompagnant,
			Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
			Enumere_Espace_1.EGenreEspace.Tuteur,
			Enumere_Espace_1.EGenreEspace.Mobile_Tuteur,
		].includes(GEtatUtilisateur.GenreEspace);
		this.avecDetailTAF =
			GEtatUtilisateur.GenreEspace === Enumere_Espace_1.EGenreEspace.Professeur;
		this.utilitaireCDT =
			new ObjetUtilitaireCahierDeTexte_1.ObjetUtilitaireCahierDeTexte(
				this.Nom + ".utilitaireCDT",
				this,
			);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnAction: {
				event: function (aIndice, aEvent) {
					const lDonnee = aInstance.getDonnee();
					switch (aIndice) {
						case EGenreBtnActionBlocTAF.documentRendu:
							aInstance.utilitaireCDT.execFicheSelecFile.call(
								aInstance,
								lDonnee,
							);
							break;
						case EGenreBtnActionBlocTAF.voirQCM:
						case EGenreBtnActionBlocTAF.executionQCM:
						case EGenreBtnActionBlocTAF.voirContenu:
						case EGenreBtnActionBlocTAF.detailTAF:
							aInstance.declencherCallback({
								donnee: lDonnee,
								genreEvnt: aIndice,
								param: { event: aEvent },
							});
							break;
						case EGenreBtnActionBlocTAF.executionKiosque:
							if (!!lDonnee) {
								aInstance.declencherCallback({
									donnee: lDonnee,
									genreEvnt: aIndice,
									param: {},
								});
							}
							break;
					}
				},
			},
			chipsAction: {
				event: function (aGenreActionChips) {
					const lDonnee = aInstance.getDonnee();
					switch (aGenreActionChips) {
						case EGenreBtnActionBlocTAF.consulter:
							window.open(
								ObjetChaine_1.GChaine.creerUrlBruteLienExterne(
									lDonnee.documentRendu,
									{
										genreRessource:
											TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
												.TAFRenduEleve,
									},
								),
							);
							break;
						case EGenreBtnActionBlocTAF.consulterCorrige:
							if (!!lDonnee.documentCorrige || !!lDonnee.commentaireCorrige) {
								if (!lDonnee.commentaireCorrige) {
									window.open(
										ObjetChaine_1.GChaine.creerUrlBruteLienExterne(
											lDonnee.documentCorrige,
											{
												genreRessource:
													TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
														.TAFCorrigeRenduEleve,
											},
										),
									);
								} else {
									const lFenetreCorrectionTaf =
										ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
											ObjetFenetre_CorrectionTaf_1.ObjetFenetre_CorrectionTaf,
											{ pere: aInstance },
										);
									lFenetreCorrectionTaf.setTAF(lDonnee);
									lFenetreCorrectionTaf.afficher();
								}
							}
							break;
					}
				},
				eventBtn: function (aGenreActionChips) {
					const lDonnee = aInstance.getDonnee();
					switch (aGenreActionChips) {
						case EGenreBtnActionBlocTAF.consulter:
							aInstance.surSupprimer(lDonnee.getNumero());
							break;
					}
				},
				getOptions: function (aGenreActionChips) {
					let lPeutSupprimer = false;
					switch (aGenreActionChips) {
						case EGenreBtnActionBlocTAF.consulter: {
							const lDonnee = aInstance.getDonnee();
							lPeutSupprimer = aInstance.peuFaireTAF && lDonnee.peuRendre;
							break;
						}
					}
					const lOptions = {};
					if (!lPeutSupprimer) {
						lOptions.avecBtn = false;
					}
					return lOptions;
				},
			},
			cbFait: {
				getValue: function () {
					const lTAF = aInstance.getDonnee();
					return lTAF.TAFFait || lTAF.QCMFait;
				},
				getHint: function () {
					const lTAF = aInstance.getDonnee();
					return lTAF.TAFFait || lTAF.QCMFait
						? ObjetTraduction_1.GTraductions.getValeur(
								"accueil.hintTravailFait",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"accueil.hintTravailAFaire",
							);
				},
				setValue: function (aValue) {
					const lTAF = aInstance.getDonnee();
					lTAF.TAFFait = aValue;
					lTAF.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					const lListe = new ObjetListeElements_1.ObjetListeElements();
					lListe.addElement(lTAF);
					new ObjetRequeteSaisieTAFFaitEleve_1.ObjetRequeteSaisieTAFFaitEleve(
						aInstance,
						aInstance._actionSurRequeteSaisieTAFFaitEleve.bind(aInstance),
					).lancerRequete({ listeTAF: lListe });
				},
				getDisabled: function () {
					const lTAF = aInstance.getDonnee();
					return !aInstance._estAvecCocheTAFFait(lTAF);
				},
				node: function () {
					$(this.node).on({
						click: function (event) {
							event.stopPropagation();
						},
					});
				},
			},
			btnSelecFile: {
				getOptionsSelecFile: function () {
					return {
						maxSize: (0, AccessApp_1.getApp)().droits.get(
							ObjetDroitsPN_1.TypeDroits.tailleMaxRenduTafEleve,
						),
					};
				},
				addFiles: this.evenementSurSelecFile.bind(this),
			},
		});
	}
	_actionSurRequeteSaisieTAFFaitEleve() {
		this.declencherCallback({
			donnee: this.getDonnee(),
			genreEvnt: EGenreBtnActionBlocTAF.tafFait,
			param: {},
		});
	}
	construireStructureAffichage() {
		const H = [];
		if (this.donneesRecues && this.donnee) {
			const lDonnee = this.getDonnee();
			if (lDonnee) {
				let lStyle =
					' style="overflow:auto; max-width:' +
					($("#" + this.Nom.escapeJQ()).outerWidth(true) - 10) +
					'px;"';
				if (this._options.estfenetre) {
					lStyle =
						' style="overflow:auto; max-width:' +
						(GNavigateur.ecranL - 100 - 20 - 10 - this.getWidthBtnAction()) +
						'px;"';
				}
				H.push("<div>");
				if (lDonnee.titreKiosque) {
					H.push(
						'<div class="Image_Kiosque_ListeCahierTexte InlineBlock AlignementMilieuVertical MargeGauche"></div>',
					);
				}
				if (lDonnee.executionQCM) {
					H.push(
						'<i role="presentation" class="icon_qcm ThemeCat-pedagogie AlignementMilieuVertical"></i>',
					);
				}
				H.push(
					'<div class="EspaceGauche EspaceDroit AlignementMilieuVertical PourFenetreBloc_Contenu AvecSelectionTexte"',
					lStyle,
					">",
					lDonnee.descriptif,
					"</div>",
				);
				H.push("</div>");
			}
		}
		return H.join("");
	}
	getDonnee() {
		const lRessource =
			this.donnee &&
			this.donnee.ressources &&
			this.donnee.ressources.getPremierElement()
				? this.donnee.ressources.getPremierElement()
				: null;
		return lRessource ? lRessource.elementOriginal : undefined;
	}
	estBlocFerme() {
		return this._options.initPlie;
	}
	eventPropagationTitre(event) {
		if (
			this._options.modeAffichage ===
				Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.grille &&
			event.target &&
			!event.target.className.includes("celluleMarqueur")
		) {
			if (this._options.callBackTitre) {
				this.callbackTitre();
			}
			event.stopPropagation();
		}
	}
	getCouleurMarqueur() {
		return this.donnee.CouleurFond;
	}
	getTitre() {
		const lHtml = [];
		const lColor =
			this._options.modeAffichage ===
			Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.grille
				? GCouleur.themeNeutre.foncee
				: "#FFCC00";
		const lDonnee = this.getDonnee();
		if (lDonnee && lDonnee.niveauDifficulte) {
			lHtml.push(
				'<div style="float:right;" class="AlignementMilieuVertical SansMain" title="',
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.NiveauDifficulte",
				),
				'">',
				TypeNiveauDifficulte_1.TypeNiveauDifficulteUtil.getImage(
					lDonnee.niveauDifficulte,
					{ color: lColor, avecTitle: true },
				),
				"</div>",
			);
		}
		if (
			this._options.modeAffichage !==
			Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.compact
		) {
			lHtml.push(
				'<div class="AlignementMilieuVertical">',
				this.donnee ? this.donnee.getLibelle() : "",
				"</div>",
			);
		}
		return lHtml.join("");
	}
	callbackTitre() {
		if (this._options.callBackTitre) {
			this._options.callBackTitre(this.donnee);
		}
	}
	getInfoSsTitre() {
		const T = [];
		const lDonnee = this.getDonnee();
		if (lDonnee) {
			const lDonneeLe = lDonnee ? lDonnee.DonneLe : null;
			const lPourLe = this.donnee.Date;
			const lNbJours = ObjetDate_1.GDate.getDifferenceJours(lPourLe, lDonneeLe);
			const lStrJours = (
				lNbJours > 1
					? ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.jours")
					: ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.jour")
			).toLowerCase();
			if (
				lDonnee &&
				(lDonnee.duree ||
					(lDonnee.executionQCM && lDonnee.executionQCM.dureeMaxQCM))
			) {
				let lDuree = lDonnee.duree;
				if (lDonnee.executionQCM && lDonnee.executionQCM.dureeMaxQCM) {
					const lMinutes = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(
						lDonnee.executionQCM.dureeMaxQCM,
					);
					const lMinutesSupplementaire =
						lDonnee.executionQCM.dureeSupplementaire > 0
							? UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(
									lDonnee.executionQCM.dureeSupplementaire,
								)
							: 0;
					lDuree = lMinutes + lMinutesSupplementaire;
				}
				const lFormatMin = lDuree > 60 ? "%mm" : "%xm";
				const lStrDuree = ObjetDate_1.GDate.formatDureeEnMillisecondes(
					lDuree * 60 * 1000,
					lDuree > 60 ? "%xh%sh" + lFormatMin : lFormatMin + "mn",
				);
				T.push(
					'<div style="float:right;" class="AlignementMilieuVertical SansMain" title="',
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.DureeEstimee",
					),
					'">',
					lStrDuree,
					"</div>",
				);
			}
			let lSpanDonneeLe =
				"<span>" +
				ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.donneLe") +
				ObjetDate_1.GDate.formatDate(lDonneeLe, " %JJ/%MM") +
				"</span>";
			const lLibelleSousTitre = [];
			if (this._options.pourLe) {
				if (lDonnee.PourLe) {
					lLibelleSousTitre.push(
						"<span>",
						ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.pourLe"),
						ObjetDate_1.GDate.formatDate(lDonnee.PourLe, " %JJ/%MM"),
						"</span>",
					);
				}
				if (this._options.avecPourLeEtDonneeLe) {
					if (lLibelleSousTitre.length > 0) {
						lLibelleSousTitre.push(", ");
						lSpanDonneeLe = lSpanDonneeLe.toLowerCase();
					}
					lLibelleSousTitre.push(lSpanDonneeLe);
				}
			} else {
				lLibelleSousTitre.push(lSpanDonneeLe);
			}
			lLibelleSousTitre.push("<span> [", lNbJours, " ", lStrJours, "]</span>");
			T.push(
				'<div class="AlignementMilieuVertical">',
				lLibelleSousTitre.join(""),
				"</div>",
			);
		}
		return { avecInfo: true, strInfo: T.join("") };
	}
	avecOmbre() {
		return (
			this._options.modeAffichage !==
				Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.grille &&
			this._options.avecOmbre !== false
		);
	}
	cacherBoutonContenu() {
		return this._options.cacherBoutonContenu;
	}
	avecBordure() {
		return (
			this._options.modeAffichage ===
				Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.grille &&
			this._options.avecBordure
		);
	}
	getWidthColDroite() {
		return super.getWidthColDroite(190);
	}
	getWidthBtnAction() {
		return super.getWidthBtnAction(165);
	}
	getAvecDocuments() {
		const lDonnee = this.getDonnee();
		return (
			lDonnee &&
			lDonnee.ListePieceJointe !== undefined &&
			lDonnee.ListePieceJointe.count() > 0
		);
	}
	getListeDocuments() {
		const lDonnee = this.getDonnee();
		return lDonnee && lDonnee.ListePieceJointe
			? lDonnee.ListePieceJointe
			: new ObjetListeElements_1.ObjetListeElements();
	}
	getDocument(I) {
		const lDonnee = this.getDonnee();
		return lDonnee.ListePieceJointe.get(I);
	}
	getInfoTitre() {
		const lStrInfoTitre = [];
		lStrInfoTitre.push(this._composeSliderTAFFait(this.getDonnee()));
		return {
			avecInfo:
				this.pourEleve &&
				this._options.modeAffichage !==
					Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.grille,
			strInfo: lStrInfoTitre.join(""),
		};
	}
	getTabBtnActions() {
		if (
			this._options.modeAffichage ===
			Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.grille
		) {
			return [];
		}
		const lResult = [];
		const lDonnee = this.getDonnee();
		const lAvecERendu =
			TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
				lDonnee.genreRendu,
			);
		const lAvecERenduPronote =
			lAvecERendu &&
			TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
				lDonnee.genreRendu,
				false,
			);
		const lAvecPRendu =
			TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduPapier(
				lDonnee.genreRendu,
			);
		const lSansRendu = TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estSansRendu(
			lDonnee.genreRendu,
		);
		let lLibelle, lGenre;
		if (lAvecERendu) {
			if (!!lDonnee.documentRendu) {
				lLibelle =
					TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.getLibelleConsultation(
						lDonnee.genreRendu,
					);
				lGenre = EGenreBtnActionBlocTAF.consulter;
				lResult.push({
					libelle: this._composeLibelleBouton(lDonnee.genreRendu, lLibelle),
					genreBtn: lGenre,
					genreAffichage: UtilitaireBloc_1.EGenreBoutonBloc.chips,
				});
			}
			if (!!lDonnee.documentCorrige || !!lDonnee.commentaireCorrige) {
				if (!lDonnee.documentCorrige) {
					lLibelle = ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.TAFARendre.Eleve.CorrectionDeLEnseignant",
					);
				} else {
					lLibelle = ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.TAFARendre.Eleve.CopieCorrigeeParEnseignant",
					);
				}
				lGenre = EGenreBtnActionBlocTAF.consulterCorrige;
				lResult.push({
					libelle: this._composeLibelleBouton(lDonnee.genreRendu, lLibelle),
					genreBtn: lGenre,
					genreAffichage: UtilitaireBloc_1.EGenreBoutonBloc.chips,
				});
			}
		}
		if (
			lAvecERendu &&
			((lDonnee.peuRendre && !lDonnee.documentRendu) || !this.pourEleve)
		) {
			if (this.avecDetailTAF && lDonnee.avecRendu) {
				lLibelle =
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.TAFARendre.RenduPar",
					) +
					" " +
					lDonnee.nbrRendus +
					"/" +
					lDonnee.nbrEleves;
				lGenre = EGenreBtnActionBlocTAF.detailTAF;
				lResult.push({
					libelle: this._composeLibelleBouton(lDonnee.genreRendu, lLibelle),
					genreBtn: lGenre,
					genreAffichage: lDonnee.estProfDuCours
						? UtilitaireBloc_1.EGenreBoutonBloc.bouton
						: UtilitaireBloc_1.EGenreBoutonBloc.texte,
				});
			} else {
				lLibelle = TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.getLibelleDeposer(
					lDonnee.genreRendu,
					this.peuFaireTAF,
				);
				if (this.peuFaireTAF) {
					lGenre = lAvecERenduPronote
						? EGenreBtnActionBlocTAF.documentRendu
						: EGenreBtnActionBlocTAF.executionKiosque;
					lResult.push({
						libelle: this._composeLibelleBouton(lDonnee.genreRendu, lLibelle),
						genreBtn: lGenre,
						genreAffichage: UtilitaireBloc_1.EGenreBoutonBloc.bouton,
					});
				} else {
					lResult.push({
						libelle: this._composeLibelleBouton(
							lDonnee.genreRendu,
							lLibelle,
							true,
						),
						genreAffichage: UtilitaireBloc_1.EGenreBoutonBloc.texte,
					});
				}
			}
		}
		if (lAvecPRendu) {
			if (this.avecDetailTAF && lDonnee.avecRendu) {
				lLibelle =
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.TAFARendre.RenduPar",
					) +
					" " +
					lDonnee.nbrRendus +
					"/" +
					lDonnee.nbrEleves;
				lGenre = EGenreBtnActionBlocTAF.detailTAF;
				lResult.push({
					libelle: this._composeLibelleBouton(lDonnee.genreRendu, lLibelle),
					genreBtn: lGenre,
					genreAffichage: lDonnee.estProfDuCours
						? UtilitaireBloc_1.EGenreBoutonBloc.bouton
						: UtilitaireBloc_1.EGenreBoutonBloc.texte,
				});
			} else {
				lResult.push({
					libelle: this._composeLibelleBouton(
						lDonnee.genreRendu,
						TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.getLibelleDeposer(
							lDonnee.genreRendu,
						),
						true,
					),
					genreAffichage: UtilitaireBloc_1.EGenreBoutonBloc.texte,
				});
			}
		}
		if (lSansRendu) {
			if (this.avecDetailTAF) {
				lLibelle =
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.TAFARendre.FaitPar",
					) +
					" " +
					lDonnee.nbrFaitsSelonEleve +
					"/" +
					lDonnee.nbrEleves;
				lGenre = EGenreBtnActionBlocTAF.detailTAF;
				lResult.push({
					libelle: this._composeLibelleBouton(lDonnee.genreRendu, lLibelle),
					genreBtn: lGenre,
					genreAffichage: lDonnee.estProfDuCours
						? UtilitaireBloc_1.EGenreBoutonBloc.bouton
						: UtilitaireBloc_1.EGenreBoutonBloc.texte,
				});
			}
		}
		if (
			this.pourEleve &&
			lDonnee.executionQCM &&
			UtilitaireQCM_1.UtilitaireQCM.estCliquable(lDonnee.executionQCM)
		) {
			if (
				!lDonnee.QCMFait ||
				(GEtatUtilisateur.estEspacePourEleve() &&
					UtilitaireQCM_1.UtilitaireQCM.estJouable(lDonnee.executionQCM))
			) {
				if (lDonnee.executionQCM.estEnPublication) {
					lResult.push({
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"TAFEtContenu.executerQCM",
						),
						genreBtn: EGenreBtnActionBlocTAF.executionQCM,
					});
				}
			} else {
				lResult.push({
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"TAFEtContenu.voirQCM",
					),
					genreBtn: EGenreBtnActionBlocTAF.voirQCM,
				});
			}
		}
		const lOngletPublie = GEtatUtilisateur.listeOnglets.getElementParGenre(
			Enumere_Onglet_1.EGenreOnglet.CDT_Contenu,
		);
		if (
			lDonnee &&
			lDonnee.cahierDeTextes &&
			lDonnee.cahierDeTextes.existeNumero() &&
			!this._options.cacherBoutonContenu &&
			!!lOngletPublie &&
			!!lOngletPublie.Actif
		) {
			lResult.push({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.TAFARendre.VoirContenu",
				),
				genreBtn: EGenreBtnActionBlocTAF.voirContenu,
			});
		}
		return lResult;
	}
	declencherCallback(aParam) {
		if (this.Pere && this.Evenement) {
			this.callback.appel(aParam.donnee, aParam.genreEvnt, aParam.param);
		}
	}
	surSupprimer(aNumeroTAF) {
		const lFichier = new ObjetElement_1.ObjetElement(),
			lListeFichiers = new ObjetListeElements_1.ObjetListeElements();
		lListeFichiers.addElement(lFichier, 0);
		lFichier.TAF = new ObjetElement_1.ObjetElement("", aNumeroTAF);
		lFichier.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
		new MultiObjetRequeteSaisieTAFARendreEleve.ObjetRequeteSaisieTAFARendreEleve(
			this,
			this.actionSurRequeteSaisieTAFARendreEleve,
		).lancerRequete(lListeFichiers);
	}
	evenementSurSelecFile(aParams, aParamsInput) {
		const lFichier = aParamsInput
			? aParamsInput.eltFichier
			: new ObjetElement_1.ObjetElement();
		const lListeFichiers = new ObjetListeElements_1.ObjetListeElements();
		const lTAF = this.getDonnee();
		if (lFichier) {
			lListeFichiers.addElement(lFichier, 0);
			lFichier.TAF = new ObjetElement_1.ObjetElement("", lTAF.getNumero());
			lFichier.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
		new MultiObjetRequeteSaisieTAFARendreEleve.ObjetRequeteSaisieTAFARendreEleve(
			this,
			this.actionSurRequeteSaisieTAFARendreEleve,
		)
			.addUpload({ listeFichiers: lListeFichiers })
			.lancerRequete(lListeFichiers);
	}
	evenementSurSelecFilePhoto(aParams, aParamsInput) {
		const lListeFichiers = new ObjetListeElements_1.ObjetListeElements();
		const lFichiers = aParamsInput.listeFichiers;
		const lTAF = this.getDonnee();
		if (!!lFichiers && lFichiers.count() > 0) {
			for (let x = 0; x < lFichiers.count(); x++) {
				const lFichier = lFichiers.get(x);
				lFichier.TAF = new ObjetElement_1.ObjetElement("", lTAF.getNumero());
				lFichier.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				lListeFichiers.addElement(lFichier);
			}
		}
	}
	actionSurRequeteSaisieTAFARendreEleve() {
		this.declencherCallback({
			donnee: this.getDonnee(),
			genreEvnt: EGenreBtnActionBlocTAF.documentRendu,
			param: {},
		});
	}
	_composeLibelleBouton(aGenre, aLibelle, aAvecIcone) {
		const T = [];
		T.push('<div class="NoWrap m-x-auto">');
		if (aAvecIcone) {
			T.push('<i class="icon_punition" role="presentation"></i>');
		}
		T.push(
			'<div class="InlineBlock AlignementMilieuVertical PetitEspaceGauche" style="line-height: 0.95em; max-width: ',
			this.getWidthBtnAction() - 3 - 13,
			'px;">',
			aLibelle,
			"</div>",
		);
		T.push("</div>");
		return T.join("");
	}
	_estAvecCocheTAFFait(aElement) {
		const lAvecRenduKiosque =
			!!aElement.genreRendu &&
			TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduKiosque(
				aElement.genreRendu,
			);
		const lEstRendu =
			!!aElement.genreRendu &&
			TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
				aElement.genreRendu,
				false,
			) &&
			!!aElement.documentRendu;
		const lEstQCM =
			aElement.executionQCM && aElement.executionQCM.existeNumero();
		if (!this.peuFaireTAF || lEstQCM || lAvecRenduKiosque || lEstRendu) {
			return false;
		}
		return true;
	}
	_composeSliderTAFFait(aElement) {
		const lHtml = [];
		if (!this._estAvecCocheTAFFait(aElement)) {
			const lEstFait = aElement.TAFFait || aElement.QCMFait;
			const lEstRendu =
				!!aElement.genreRendu &&
				TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
					aElement.genreRendu,
					false,
				) &&
				!!aElement.documentRendu;
			if (lEstFait || this.peuFaireTAF) {
				if (!lEstFait || !lEstRendu) {
					lHtml.push('<div style="display:flex; justify-content: flex-end;">');
					lHtml.push(
						'<div class="AlignementMilieu BorderBox SansMain" style="border-radius: 0.4rem; flex: 0 0 auto; margin: 0rem 0rem 0.4rem 0.8rem; padding: 0.4rem 0.8rem; color: ',
						GCouleur.themeCouleur.sombre,
						"; background: ",
						GCouleur.themeCouleur.claire,
						';">',
						lEstFait
							? ObjetTraduction_1.GTraductions.getValeur(
									"accueil.hintTravailFait",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"accueil.hintTravailNonFait",
								),
						"</div>",
					);
					lHtml.push("</div>");
				}
			}
		} else {
			const lAvecERendu =
				!!aElement.genreRendu &&
				TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
					aElement.genreRendu,
					false,
				);
			if (!lAvecERendu) {
				lHtml.push(
					'<div class="Espace AlignementDroit">',
					'<ie-switch ie-model="cbFait" onclick="event.stopPropagation();" ie-hint="cbFait.getHint">',
					ObjetTraduction_1.GTraductions.getValeur("accueil.hintTravailFait"),
					"</ie-switch>",
					"</div>",
				);
			}
		}
		return lHtml.join("");
	}
}
