const { TypeDroits } = require("ObjetDroitsPN.js");
const { GDate } = require("ObjetDate.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TUtilitaireDuree } = require("UtilitaireDuree.js");
const { GestionnaireBlocPN } = require("GestionnaireBlocPN.js");
const { ObjetBlocPN } = require("GestionnaireBlocPN.js");
const { EGenreBloc } = require("Enumere_Bloc.js");
const { EModeAffichageTimeline } = require("Enumere_ModeAffichageTimeline.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GChaine } = require("ObjetChaine.js");
const { TypeNiveauDifficulteUtil } = require("TypeNiveauDifficulte.js");
const { TypeGenreRenduTAFUtil } = require("TypeGenreRenduTAF.js");
const { EGenreBoutonBloc } = require("UtilitaireBloc.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const {
	ObjetRequeteSaisieTAFFaitEleve,
} = require("ObjetRequeteSaisieTAFFaitEleve.js");
const ObjetRequeteSaisieTAFARendreEleve = require("ObjetRequeteSaisieTAFARendreEleve.js");
const { UtilitaireQCM } = require("UtilitaireQCM.js");
const { TypeFichierExterneHttpSco } = require("TypeFichierExterneHttpSco.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_CorrectionTaf } = require("ObjetFenetre_CorrectionTaf.js");
const {
	ObjetUtilitaireCahierDeTexte,
} = require("ObjetUtilitaireCahierDeTexte.js");
const EGenreBtnActionBlocTAF = {
	documentRendu: 1,
	executionQCM: 2,
	consulter: 3,
	tafFait: 4,
	executionKiosque: 5,
	voirQCM: 6,
	voirContenu: 7,
	detailTAF: 8,
	consulterCorrige: 9,
};
class GestionnaireBlocTAF extends GestionnaireBlocPN {
	constructor(...aParams) {
		super(...aParams);
		this.setGenreBloc(EGenreBloc.TravailAFaire);
		const lOptions = {
			modeAffichage: EModeAffichageTimeline.classique,
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
class ObjetBlocTAF extends ObjetBlocPN {
	constructor(...aParams) {
		super(...aParams);
		this.peuFaireTAF = [EGenreEspace.Eleve, EGenreEspace.Mobile_Eleve].includes(
			GEtatUtilisateur.GenreEspace,
		);
		this.pourEleve = [
			EGenreEspace.Eleve,
			EGenreEspace.Mobile_Eleve,
			EGenreEspace.Parent,
			EGenreEspace.Mobile_Parent,
			EGenreEspace.Accompagnant,
			EGenreEspace.Mobile_Accompagnant,
			EGenreEspace.Tuteur,
			EGenreEspace.Mobile_Tuteur,
		].includes(GEtatUtilisateur.GenreEspace);
		this.avecDetailTAF =
			GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur;
		this.utilitaireCDT = new ObjetUtilitaireCahierDeTexte(
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
								GChaine.creerUrlBruteLienExterne(lDonnee.documentRendu, {
									genreRessource: TypeFichierExterneHttpSco.TAFRenduEleve,
								}),
							);
							break;
						case EGenreBtnActionBlocTAF.consulterCorrige:
							if (!!lDonnee.documentCorrige || !!lDonnee.commentaireCorrige) {
								if (!lDonnee.commentaireCorrige) {
									window.open(
										GChaine.creerUrlBruteLienExterne(lDonnee.documentCorrige, {
											genreRessource:
												TypeFichierExterneHttpSco.TAFCorrigeRenduEleve,
										}),
									);
								} else {
									const lFenetreCorrectionTaf =
										ObjetFenetre.creerInstanceFenetre(
											ObjetFenetre_CorrectionTaf,
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
						? GTraductions.getValeur("accueil.hintTravailFait")
						: GTraductions.getValeur("accueil.hintTravailAFaire");
				},
				setValue: function (aValue) {
					const lTAF = aInstance.getDonnee();
					lTAF.TAFFait = aValue;
					lTAF.setEtat(EGenreEtat.Modification);
					const lListe = new ObjetListeElements();
					lListe.addElement(lTAF);
					new ObjetRequeteSaisieTAFFaitEleve(
						aInstance,
						aInstance._actionSurRequeteSaisieTAFFaitEleve.bind(aInstance),
					).lancerRequete({ listeTAF: lListe });
				},
				getDisabled: function () {
					const lTAF = aInstance.getDonnee();
					return !_estAvecCocheTAFFait.call(aInstance, lTAF);
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
						maxSize: GApplication.droits.get(TypeDroits.tailleMaxRenduTafEleve),
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
						'<i class="icon_qcm ThemeCat-pedagogie AlignementMilieuVertical"></i>',
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
			this._options.modeAffichage === EModeAffichageTimeline.grille &&
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
			this._options.modeAffichage === EModeAffichageTimeline.grille
				? GCouleur.themeNeutre.foncee
				: "#FFCC00";
		const lDonnee = this.getDonnee();
		if (lDonnee && lDonnee.niveauDifficulte) {
			lHtml.push(
				'<div style="float:right;" class="AlignementMilieuVertical SansMain" title="',
				GTraductions.getValeur("CahierDeTexte.NiveauDifficulte"),
				'">',
				TypeNiveauDifficulteUtil.getImage(lDonnee.niveauDifficulte, {
					color: lColor,
					avecTitle: true,
				}),
				"</div>",
			);
		}
		if (this._options.modeAffichage !== EModeAffichageTimeline.compact) {
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
			const lNbJours = GDate.getDifferenceJours(lPourLe, lDonneeLe);
			const lStrJours = (
				lNbJours > 1
					? GTraductions.getValeur("TAFEtContenu.jours")
					: GTraductions.getValeur("TAFEtContenu.jour")
			).toLowerCase();
			if (
				lDonnee &&
				(lDonnee.duree ||
					(lDonnee.executionQCM && lDonnee.executionQCM.dureeMaxQCM))
			) {
				let lDuree = lDonnee.duree;
				if (lDonnee.executionQCM && lDonnee.executionQCM.dureeMaxQCM) {
					const lMinutes = TUtilitaireDuree.dureeEnMin(
						lDonnee.executionQCM.dureeMaxQCM,
					);
					const lMinutesSupplementaire =
						lDonnee.executionQCM.dureeSupplementaire > 0
							? TUtilitaireDuree.dureeEnMin(
									lDonnee.executionQCM.dureeSupplementaire,
								)
							: 0;
					lDuree = lMinutes + lMinutesSupplementaire;
				}
				const lFormatMin = lDuree > 60 ? "%mm" : "%xm";
				const lStrDuree = GDate.formatDureeEnMillisecondes(
					lDuree * 60 * 1000,
					lDuree > 60 ? "%xh%sh" + lFormatMin : lFormatMin + "mn",
				);
				T.push(
					'<div style="float:right;" class="AlignementMilieuVertical SansMain" title="',
					GTraductions.getValeur("CahierDeTexte.DureeEstimee"),
					'">',
					lStrDuree,
					"</div>",
				);
			}
			let lSpanDonneeLe =
				"<span>" +
				GTraductions.getValeur("TAFEtContenu.donneLe") +
				GDate.formatDate(lDonneeLe, " %JJ/%MM") +
				"</span>";
			const lLibelleSousTitre = [];
			if (this._options.pourLe) {
				if (lDonnee.PourLe) {
					lLibelleSousTitre.push(
						"<span>",
						GTraductions.getValeur("CahierDeTexte.pourLe"),
						GDate.formatDate(lDonnee.PourLe, " %JJ/%MM"),
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
			this._options.modeAffichage !== EModeAffichageTimeline.grille &&
			this._options.avecOmbre !== false
		);
	}
	cacherBoutonContenu() {
		return this._options.cacherBoutonContenu;
	}
	avecBordure() {
		return (
			this._options.modeAffichage === EModeAffichageTimeline.grille &&
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
			: new ObjetListeElements();
	}
	getDocument(I) {
		const lDonnee = this.getDonnee();
		return lDonnee.ListePieceJointe.get(I);
	}
	getInfoTitre() {
		const lStrInfoTitre = [];
		lStrInfoTitre.push(_composeSliderTAFFait.call(this, this.getDonnee()));
		return {
			avecInfo:
				this.pourEleve &&
				this._options.modeAffichage !== EModeAffichageTimeline.grille,
			strInfo: lStrInfoTitre.join(""),
		};
	}
	getTabBtnActions() {
		if (this._options.modeAffichage === EModeAffichageTimeline.grille) {
			return [];
		}
		const lResult = [];
		const lDonnee = this.getDonnee();
		const lAvecERendu = TypeGenreRenduTAFUtil.estUnRenduEnligne(
			lDonnee.genreRendu,
		);
		const lAvecERenduPronote =
			lAvecERendu &&
			TypeGenreRenduTAFUtil.estUnRenduEnligne(lDonnee.genreRendu, false);
		const lAvecPRendu = TypeGenreRenduTAFUtil.estUnRenduPapier(
			lDonnee.genreRendu,
		);
		const lSansRendu = TypeGenreRenduTAFUtil.estSansRendu(lDonnee.genreRendu);
		let lLibelle, lGenre;
		if (lAvecERendu) {
			if (!!lDonnee.documentRendu) {
				lLibelle = TypeGenreRenduTAFUtil.getLibelleConsultation(
					lDonnee.genreRendu,
				);
				lGenre = EGenreBtnActionBlocTAF.consulter;
				lResult.push({
					libelle: _composeLibelleBouton.call(
						this,
						lDonnee.genreRendu,
						lLibelle,
					),
					genreBtn: lGenre,
					genreAffichage: EGenreBoutonBloc.chips,
				});
			}
			if (!!lDonnee.documentCorrige || !!lDonnee.commentaireCorrige) {
				if (!lDonnee.documentCorrige) {
					lLibelle = GTraductions.getValeur(
						"CahierDeTexte.TAFARendre.Eleve.CorrectionDeLEnseignant",
					);
				} else {
					lLibelle = GTraductions.getValeur(
						"CahierDeTexte.TAFARendre.Eleve.CopieCorrigeeParEnseignant",
					);
				}
				lGenre = EGenreBtnActionBlocTAF.consulterCorrige;
				lResult.push({
					libelle: _composeLibelleBouton.call(
						this,
						lDonnee.genreRendu,
						lLibelle,
					),
					genreBtn: lGenre,
					genreAffichage: EGenreBoutonBloc.chips,
				});
			}
		}
		if (
			lAvecERendu &&
			((lDonnee.peuRendre && !lDonnee.documentRendu) || !this.pourEleve)
		) {
			if (this.avecDetailTAF && lDonnee.avecRendu) {
				lLibelle =
					GTraductions.getValeur("CahierDeTexte.TAFARendre.RenduPar") +
					" " +
					lDonnee.nbrRendus +
					"/" +
					lDonnee.nbrEleves;
				lGenre = EGenreBtnActionBlocTAF.detailTAF;
				lResult.push({
					libelle: _composeLibelleBouton.call(
						this,
						lDonnee.genreRendu,
						lLibelle,
					),
					genreBtn: lGenre,
					genreAffichage: lDonnee.estProfDuCours
						? EGenreBoutonBloc.bouton
						: EGenreBoutonBloc.texte,
				});
			} else {
				lLibelle = TypeGenreRenduTAFUtil.getLibelleDeposer(
					lDonnee.genreRendu,
					this.peuFaireTAF,
				);
				if (this.peuFaireTAF) {
					lGenre = lAvecERenduPronote
						? EGenreBtnActionBlocTAF.documentRendu
						: EGenreBtnActionBlocTAF.executionKiosque;
					lResult.push({
						libelle: _composeLibelleBouton.call(
							this,
							lDonnee.genreRendu,
							lLibelle,
						),
						genreBtn: lGenre,
						genreAffichage: EGenreBoutonBloc.bouton,
					});
				} else {
					lResult.push({
						libelle: _composeLibelleBouton.call(
							this,
							lDonnee.genreRendu,
							lLibelle,
							true,
						),
						genreAffichage: EGenreBoutonBloc.texte,
					});
				}
			}
		}
		if (lAvecPRendu) {
			if (this.avecDetailTAF && lDonnee.avecRendu) {
				lLibelle =
					GTraductions.getValeur("CahierDeTexte.TAFARendre.RenduPar") +
					" " +
					lDonnee.nbrRendus +
					"/" +
					lDonnee.nbrEleves;
				lGenre = EGenreBtnActionBlocTAF.detailTAF;
				lResult.push({
					libelle: _composeLibelleBouton.call(
						this,
						lDonnee.genreRendu,
						lLibelle,
					),
					genreBtn: lGenre,
					genreAffichage: lDonnee.estProfDuCours
						? EGenreBoutonBloc.bouton
						: EGenreBoutonBloc.texte,
				});
			} else {
				lResult.push({
					libelle: _composeLibelleBouton.call(
						this,
						lDonnee.genreRendu,
						TypeGenreRenduTAFUtil.getLibelleDeposer(lDonnee.genreRendu),
						true,
					),
					genreAffichage: EGenreBoutonBloc.texte,
				});
			}
		}
		if (lSansRendu) {
			if (this.avecDetailTAF) {
				lLibelle =
					GTraductions.getValeur("CahierDeTexte.TAFARendre.FaitPar") +
					" " +
					lDonnee.nbrFaitsSelonEleve +
					"/" +
					lDonnee.nbrEleves;
				lGenre = EGenreBtnActionBlocTAF.detailTAF;
				lResult.push({
					libelle: _composeLibelleBouton.call(
						this,
						lDonnee.genreRendu,
						lLibelle,
					),
					genreBtn: lGenre,
					genreAffichage: lDonnee.estProfDuCours
						? EGenreBoutonBloc.bouton
						: EGenreBoutonBloc.texte,
				});
			}
		}
		if (
			this.pourEleve &&
			lDonnee.executionQCM &&
			UtilitaireQCM.estCliquable(lDonnee.executionQCM)
		) {
			if (
				!lDonnee.QCMFait ||
				(GEtatUtilisateur.estEspacePourEleve() &&
					UtilitaireQCM.estJouable(lDonnee.executionQCM))
			) {
				if (lDonnee.executionQCM.estEnPublication) {
					lResult.push({
						libelle: GTraductions.getValeur("TAFEtContenu.executerQCM"),
						genreBtn: EGenreBtnActionBlocTAF.executionQCM,
					});
				}
			} else {
				lResult.push({
					libelle: GTraductions.getValeur("TAFEtContenu.voirQCM"),
					genreBtn: EGenreBtnActionBlocTAF.voirQCM,
				});
			}
		}
		const lOngletPublie = GEtatUtilisateur.listeOnglets.getElementParGenre(
			EGenreOnglet.CDT_Contenu,
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
				libelle: GTraductions.getValeur("CahierDeTexte.TAFARendre.VoirContenu"),
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
		const lFichier = new ObjetElement(),
			lListeFichiers = new ObjetListeElements();
		lListeFichiers.addElement(lFichier, 0);
		lFichier.TAF = new ObjetElement("", aNumeroTAF);
		lFichier.setEtat(EGenreEtat.Suppression);
		new ObjetRequeteSaisieTAFARendreEleve(
			this,
			this.actionSurRequeteSaisieTAFARendreEleve,
		).lancerRequete(lListeFichiers);
	}
	evenementSurSelecFile(aParams, aParamsInput) {
		const lFichier = aParamsInput
				? aParamsInput.eltFichier
				: new ObjetElement(),
			lListeFichiers = new ObjetListeElements();
		const lTAF = this.getDonnee();
		if (lFichier) {
			lListeFichiers.addElement(lFichier, 0);
			lFichier.TAF = new ObjetElement("", lTAF.getNumero());
			lFichier.setEtat(EGenreEtat.Modification);
		}
		new ObjetRequeteSaisieTAFARendreEleve(
			this,
			this.actionSurRequeteSaisieTAFARendreEleve,
		)
			.addUpload({ listeFichiers: lListeFichiers })
			.lancerRequete(lListeFichiers);
	}
	evenementSurSelecFilePhoto(aParams, aParamsInput) {
		const lListeFichiers = new ObjetListeElements();
		const lFichiers = aParamsInput.listeFichiers;
		const lTAF = this.getDonnee();
		if (!!lFichiers && lFichiers.count() > 0) {
			for (let x = 0; x < lFichiers.count(); x++) {
				const lFichier = lFichiers.get(x);
				lFichier.TAF = new ObjetElement("", lTAF.getNumero());
				lFichier.setEtat(EGenreEtat.Creation);
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
}
function _composeLibelleBouton(aGenre, aLibelle, aAvecIcone) {
	const T = [];
	T.push('<div class="NoWrap m-x-auto">');
	if (aAvecIcone) {
		T.push('<i class="icon_punition" aria-hidden="true"></i>');
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
function _estAvecCocheTAFFait(aElement) {
	const lAvecRenduKiosque =
		!!aElement.genreRendu &&
		TypeGenreRenduTAFUtil.estUnRenduKiosque(aElement.genreRendu);
	const lEstRendu =
		!!aElement.genreRendu &&
		TypeGenreRenduTAFUtil.estUnRenduEnligne(aElement.genreRendu, false) &&
		!!aElement.documentRendu;
	const lEstQCM = aElement.executionQCM && aElement.executionQCM.existeNumero();
	if (!this.peuFaireTAF || lEstQCM || lAvecRenduKiosque || lEstRendu) {
		return false;
	}
	return true;
}
function _composeSliderTAFFait(aElement) {
	const lHtml = [];
	if (!_estAvecCocheTAFFait.call(this, aElement)) {
		const lEstFait = aElement.TAFFait || aElement.QCMFait;
		const lEstRendu =
			!!aElement.genreRendu &&
			TypeGenreRenduTAFUtil.estUnRenduEnligne(aElement.genreRendu, false) &&
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
						? GTraductions.getValeur("accueil.hintTravailFait")
						: GTraductions.getValeur("accueil.hintTravailNonFait"),
					"</div>",
				);
				lHtml.push("</div>");
			}
		}
	} else {
		const lAvecERendu =
			!!aElement.genreRendu &&
			TypeGenreRenduTAFUtil.estUnRenduEnligne(aElement.genreRendu, false);
		if (!lAvecERendu) {
			lHtml.push(
				'<div class="Espace AlignementDroit">',
				'<ie-switch ie-model="cbFait" onclick="event.stopPropagation();" ie-hint="cbFait.getHint">',
				"<span>",
				GTraductions.getValeur("accueil.hintTravailNonFait"),
				"</span>",
				"<span>",
				GTraductions.getValeur("accueil.hintTravailFait"),
				"</span>",
				"</ie-switch>",
				"</div>",
			);
		}
	}
	return lHtml.join("");
}
module.exports = { GestionnaireBlocTAF, EGenreBtnActionBlocTAF };
