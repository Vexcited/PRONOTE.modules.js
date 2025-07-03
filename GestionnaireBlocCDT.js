exports.GestionnaireBlocCDT = exports.EGenreBtnActionBlocCDT = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetChaine_1 = require("ObjetChaine");
const UtilitaireDuree_1 = require("UtilitaireDuree");
const GestionnaireBlocPN_1 = require("GestionnaireBlocPN");
const GestionnaireBlocPN_2 = require("GestionnaireBlocPN");
const Enumere_Bloc_1 = require("Enumere_Bloc");
const Enumere_ModeAffichageTimeline_1 = require("Enumere_ModeAffichageTimeline");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Etat_1 = require("Enumere_Etat");
const TypeNiveauDifficulte_1 = require("TypeNiveauDifficulte");
const Enumere_AffichageCahierDeTextes_1 = require("Enumere_AffichageCahierDeTextes");
const TypeGenreRenduTAF_1 = require("TypeGenreRenduTAF");
const UtilitaireBloc_1 = require("UtilitaireBloc");
const ObjetImage_1 = require("ObjetImage");
const ObjetTri_1 = require("ObjetTri");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetRequeteSaisieTAFFaitEleve_1 = require("ObjetRequeteSaisieTAFFaitEleve");
const MultiObjetRequeteSaisieTAFARendreEleve = require("ObjetRequeteSaisieTAFARendreEleve");
const TypeOrigineCreationCategorieCahierDeTexte_1 = require("TypeOrigineCreationCategorieCahierDeTexte");
const UtilitaireBloc_2 = require("UtilitaireBloc");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const TypeFichierExterneHttpSco_1 = require("TypeFichierExterneHttpSco");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_CorrectionTaf_1 = require("ObjetFenetre_CorrectionTaf");
const ObjetUtilitaireCahierDeTexte_1 = require("ObjetUtilitaireCahierDeTexte");
const AccessApp_1 = require("AccessApp");
var EGenreBtnActionBlocCDT;
(function (EGenreBtnActionBlocCDT) {
	EGenreBtnActionBlocCDT[(EGenreBtnActionBlocCDT["documentRendu"] = 1)] =
		"documentRendu";
	EGenreBtnActionBlocCDT[(EGenreBtnActionBlocCDT["executionQCM"] = 2)] =
		"executionQCM";
	EGenreBtnActionBlocCDT[(EGenreBtnActionBlocCDT["consulter"] = 3)] =
		"consulter";
	EGenreBtnActionBlocCDT[(EGenreBtnActionBlocCDT["supprimer"] = 4)] =
		"supprimer";
	EGenreBtnActionBlocCDT[(EGenreBtnActionBlocCDT["tafFait"] = 5)] = "tafFait";
	EGenreBtnActionBlocCDT[(EGenreBtnActionBlocCDT["executionKiosque"] = 6)] =
		"executionKiosque";
	EGenreBtnActionBlocCDT[(EGenreBtnActionBlocCDT["voirQCM"] = 7)] = "voirQCM";
	EGenreBtnActionBlocCDT[(EGenreBtnActionBlocCDT["voirContenu"] = 8)] =
		"voirContenu";
	EGenreBtnActionBlocCDT[(EGenreBtnActionBlocCDT["detailTAF"] = 9)] =
		"detailTAF";
	EGenreBtnActionBlocCDT[(EGenreBtnActionBlocCDT["consulterCorrige"] = 10)] =
		"consulterCorrige";
})(
	EGenreBtnActionBlocCDT ||
		(exports.EGenreBtnActionBlocCDT = EGenreBtnActionBlocCDT = {}),
);
class GestionnaireBlocCDT extends GestionnaireBlocPN_1.GestionnaireBlocPN {
	constructor(...aParams) {
		super(...aParams);
		this.setGenreBloc(Enumere_Bloc_1.EGenreBloc.CahiersDeTexte);
		const lOptions = {
			modeAffichage:
				Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.classique,
			initPlie: false,
			callBackTitre: undefined,
			sansLienQCM: false,
		};
		$.extend(this._options, lOptions);
	}
	getParamsBloc(aDataBloc) {
		const lInstanceMetier = this.getInstanceObjetMetier(
			aDataBloc,
			ObjetBlocCDT,
		);
		const lParamBloc = lInstanceMetier.getParamsBloc();
		$.extend(lParamBloc, {
			htmlContenu: this.composeZoneInstance(lInstanceMetier),
		});
		return lParamBloc;
	}
}
exports.GestionnaireBlocCDT = GestionnaireBlocCDT;
class ObjetBlocCDT extends GestionnaireBlocPN_2.ObjetBlocPN {
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
				event: function (aIndice, aNumeroArticle, aEvent) {
					const lDonnee = aInstance.getTAF(aNumeroArticle);
					switch (aIndice) {
						case EGenreBtnActionBlocCDT.documentRendu:
							aInstance.utilitaireCDT.execFicheSelecFile.call(
								aInstance,
								lDonnee,
							);
							break;
						case EGenreBtnActionBlocCDT.voirQCM:
						case EGenreBtnActionBlocCDT.executionQCM:
						case EGenreBtnActionBlocCDT.voirContenu:
						case EGenreBtnActionBlocCDT.detailTAF:
							aInstance.declencherCallback({
								donnee: lDonnee,
								genreEvnt: aIndice,
								param: { event: aEvent },
							});
							break;
						case EGenreBtnActionBlocCDT.executionKiosque:
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
			executerQCM: function (aIndiceContenu, aIndiceQCM) {
				$(this.node).eventValidation((aEvent) => {
					const lQCM = aInstance.getQCM(aIndiceContenu, aIndiceQCM);
					aInstance.declencherCallback({
						donnee: lQCM,
						genreEvnt: EGenreBtnActionBlocCDT.executionQCM,
						param: { event: aEvent, estQCM: true },
					});
				});
			},
			executerQCMTAF: function (aNumeroTAF) {
				$(this.node).eventValidation((aEvent) => {
					const lQCM = aInstance.getQCMTAF(aNumeroTAF);
					aInstance.declencherCallback({
						donnee: lQCM,
						genreEvnt: EGenreBtnActionBlocCDT.executionQCM,
						param: { event: aEvent, estQCM: true },
					});
				});
			},
			renduTAF: function (aNumeroTAF) {
				$(this.node).on("click", (aEvent) => {
					const lTAF = aInstance.getTAF(aNumeroTAF);
					aInstance.declencherCallback({
						donnee: lTAF,
						genreEvnt: EGenreBtnActionBlocCDT.detailTAF,
						param: { event: aEvent },
					});
				});
			},
			cbFait: {
				getValue: function (aNumeroTAF) {
					const lTAF = aInstance.getTAF(aNumeroTAF);
					return lTAF.TAFFait || lTAF.QCMFait;
				},
				getHint: function (aNumeroTAF) {
					const lTAF = aInstance.getTAF(aNumeroTAF);
					return lTAF.TAFFait || lTAF.QCMFait
						? ObjetTraduction_1.GTraductions.getValeur(
								"accueil.hintTravailFait",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"accueil.hintTravailAFaire",
							);
				},
				setValue: function (aNumeroTAF, aValue) {
					const lTAF = aInstance.getTAF(aNumeroTAF);
					lTAF.TAFFait = aValue;
					lTAF.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					const lListe = new ObjetListeElements_1.ObjetListeElements();
					lListe.addElement(lTAF);
					new ObjetRequeteSaisieTAFFaitEleve_1.ObjetRequeteSaisieTAFFaitEleve(
						aInstance,
						aInstance._actionSurRequeteSaisieTAFFaitEleve.bind(
							aInstance,
							aNumeroTAF,
						),
					).lancerRequete({ listeTAF: lListe });
				},
				getDisabled: function (aNumeroTAF) {
					const lTAF = aInstance.getTAF(aNumeroTAF);
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
			chipsDocumentRenduTAF: {
				eventBtn: function (aNumeroTaf) {
					aInstance.surSupprimer(aNumeroTaf);
				},
			},
			chipsCorrectionTAFEleve: {
				event: function (aNumeroTaf) {
					const lTaf = aInstance.getTAF(aNumeroTaf);
					if (!!lTaf) {
						const lFenetreCorrectionTaf =
							ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
								ObjetFenetre_CorrectionTaf_1.ObjetFenetre_CorrectionTaf,
								{ pere: aInstance },
							);
						lFenetreCorrectionTaf.setTAF(lTaf);
						lFenetreCorrectionTaf.afficher();
					}
				},
			},
		});
	}
	getDocument(aIndiceContenu, aIndiceDocument) {
		let lDocument;
		const lContenu = this.getContenu(aIndiceContenu);
		if (lContenu && lContenu.ListePieceJointe) {
			lDocument = lContenu.ListePieceJointe.get(aIndiceDocument);
		}
		return lDocument;
	}
	getTAF(aNumeroTAF) {
		let lElement;
		const lDonnee = this.getDonnee();
		lElement = lDonnee.Matiere.ressources
			? lDonnee.ListeTravailAFaire.getElementParNumero(
					lDonnee.Matiere.ressources
						.getElementParNumero(aNumeroTAF)
						.getNumero(),
				)
			: lDonnee.ListeTravailAFaire.getElementParNumero(aNumeroTAF);
		return lElement;
	}
	getDocumentTAF(aNumeroTAF, aIndiceDocument) {
		let lDocument;
		const lElement = this.getTAF(aNumeroTAF);
		if (lElement && lElement.ListePieceJointe) {
			lDocument = lElement.ListePieceJointe.get(aIndiceDocument);
		}
		return lDocument;
	}
	getContenu(aIndiceContenu) {
		let lContenu;
		const lDonnee = this.getDonnee();
		if (lDonnee && lDonnee.listeContenus) {
			lContenu = lDonnee.listeContenus.get(aIndiceContenu);
		}
		return lContenu;
	}
	getQCM(aIndiceContenu, aIndiceQCM) {
		let lQCM;
		const lContenu = this.getContenu(aIndiceContenu);
		if (lContenu && lContenu.listeExecutionQCM) {
			lQCM = lContenu.listeExecutionQCM.get(aIndiceQCM);
		}
		return lQCM;
	}
	getQCMTAF(aNumeroTAF) {
		let lQCM;
		const lTAF = this.getTAF(aNumeroTAF);
		if (lTAF && lTAF.executionQCM) {
			lQCM = lTAF.executionQCM;
		}
		return lQCM;
	}
	_actionSurRequeteSaisieTAFFaitEleve(aNumeroTaf) {
		const lTAF = this.getTAF(aNumeroTaf);
		this.declencherCallback({
			donnee: lTAF,
			genreEvnt: EGenreBtnActionBlocCDT.tafFait,
			param: {},
		});
	}
	construireStructureAffichage() {
		const H = [];
		if (this.donneesRecues && this.donnee) {
			const lDonnee = this.getDonnee();
			if (lDonnee) {
				H.push(
					'<div style="padding : 3px 6px 0px 6px;"><div class="InlineBlock AlignementMilieuVertical PourFenetreBloc_Contenu" style="width:100%">',
					this.getGenreAffichage() ===
						Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
							.TravailAFaire
						? this.composePourTAF(lDonnee)
						: this.composePourCours(lDonnee),
					"</div></div>",
				);
			}
		}
		return H.join("");
	}
	composePiecesJointes(aElement) {
		const lHtml = [];
		const lListeDocuments = UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
			aElement.ListePieceJointe,
		);
		lHtml.push(
			'<div class="Espace" style="',
			ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.fond),
			'margin:5px 5px 1px 5px;">',
		);
		lHtml.push(
			'<div style="',
			ObjetStyle_1.GStyle.composeCouleurTexte(GCouleur.grisTresFonce),
			'">',
			ObjetTraduction_1.GTraductions.getValeur("Agenda.Documents"),
			"</div>",
		);
		lHtml.push("<div>", lListeDocuments, " </div>");
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeTAF(aElement, aListeTAF, aPourLe) {
		const T = [];
		let lCount = 0;
		const lNbrElements = aElement.ressources
			? aElement.ressources.count()
			: aListeTAF.count();
		let lElement, lRessource;
		let lBandeauDS;
		let lDonneLe, lNewDonneLe;
		let lPourLe, lNewPourLe;
		T.push(
			'<div style="margin-top: 3px; ',
			ObjetStyle_1.GStyle.composeCouleur(
				GCouleur.themeNeutre.claire,
				GCouleur.noir,
				GCouleur.themeNeutre.claire,
			),
			'">',
		);
		for (let I = 0; I < lNbrElements; I++) {
			if (aElement.ressources) {
				lRessource = aElement.ressources.get(I);
				lElement = lRessource.estUnDS
					? lRessource
					: aListeTAF.getElementParNumero(lRessource.getNumero());
			} else {
				lElement = aListeTAF.get(I);
			}
			if (lElement.estUnDS) {
				if (!lBandeauDS) {
					T.push(
						'<div style="height:4px; ',
						ObjetStyle_1.GStyle.composeCouleur(
							GCouleur.themeNeutre.legere,
							GCouleur.noir,
						),
						'">&nbsp;</div>',
					);
					lBandeauDS = true;
				}
				if (lElement.estDevoir) {
					T.push(
						'<div class="NoWrap PetitEspace EspaceGauche">',
						'<div class="InlineBlock GrandEspaceDroit AlignementMilieuVertical" >',
						lElement.getLibelle(),
						"</div>",
						'<i class="',
						TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexteUtil.getIcone(
							TypeOrigineCreationCategorieCahierDeTexte_1
								.TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir,
						),
						'" role="presentation">',
						ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.iconeDS"),
						"</i>",
						"</div>",
					);
				}
				if (lElement.estEval) {
					T.push(
						'<div class="NoWrap PetitEspace EspaceGauche">',
						'<div class="InlineBlock GrandEspaceDroit AlignementMilieuVertical" >',
						lElement.getLibelle(),
						"</div>",
						'<i class="',
						TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexteUtil.getIcone(
							TypeOrigineCreationCategorieCahierDeTexte_1
								.TypeOrigineCreationCategorieCahierDeTexte
								.OCCCDT_Pre_Evaluation,
						),
						'" role="presentation">',
						ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.iconeEval"),
						"</i>",
						"</div>",
					);
				}
			} else {
				const lNbJours = lElement.DonneLe
					? ObjetDate_1.GDate.getDifferenceJours(
							lElement.PourLe,
							lElement.DonneLe,
						)
					: 0;
				const lStrJours = (
					lNbJours > 1
						? ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.jours")
						: ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.jour")
				).toLowerCase();
				lNewDonneLe = lElement.DonneLe
					? ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.donneLe") +
						ObjetDate_1.GDate.formatDate(lElement.DonneLe, " %JJ/%MM")
					: "";
				lNewPourLe = lElement.PourLe
					? ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.pourLe") +
						ObjetDate_1.GDate.formatDate(lElement.PourLe, " %JJ/%MM")
					: "";
				T.push("<div>");
				if (aPourLe) {
					if (!lPourLe || lPourLe !== lNewPourLe) {
						T.push(
							'<div class="PetitEspaceHaut PetitEspaceBas" style="',
							ObjetStyle_1.GStyle.composeCouleur(
								GCouleur.themeNeutre.claire,
								GCouleur.noir,
								GCouleur.themeNeutre.claire,
							),
							'">',
							'<span class="Gras">' + lNewPourLe + "</span><span>",
							"</div>",
						);
						lCount = 0;
					}
				} else {
					if (!lDonneLe || lDonneLe !== lNewDonneLe) {
						T.push(
							'<div class="PetitEspaceHaut PetitEspaceBas" style="',
							ObjetStyle_1.GStyle.composeCouleur(
								GCouleur.themeNeutre.claire,
								GCouleur.noir,
								GCouleur.themeNeutre.claire,
							),
							'">',
							'<span class="Gras">' +
								lNewDonneLe +
								"</span><span>" +
								" [" +
								lNbJours +
								" " +
								lStrJours +
								"]</span>",
							"</div>",
						);
						lCount = 0;
					}
				}
				T.push(
					'<div class="PetitEspace" style="',
					ObjetStyle_1.GStyle.composeWidthCalc(6),
					ObjetStyle_1.GStyle.composeCouleur(GCouleur.blanc, GCouleur.noir),
					'">',
				);
				if (lCount > 0) {
					T.push(
						'<hr style="border-color: ' +
							GCouleur.themeNeutre.claire +
							"; background-color: " +
							GCouleur.themeNeutre.claire +
							';" />',
					);
				}
				T.push(
					'<div class="InlineBlock AlignementHaut" style="min-width: 340px; margin-right: 5px;',
					this.pourEleve
						? ObjetStyle_1.GStyle.composeWidthCalc(
								this.getWidthActionsTAF() + 5,
							)
						: "width:100%;",
					'">',
				);
				T.push(
					'<div class="InlineBlock AlignementHaut" style="min-height: 18px; ',
					this._avecInfosTAF(lElement)
						? ObjetStyle_1.GStyle.composeWidthCalc(36)
						: "width:100%;",
					'">',
				);
				T.push(this.composePublicTAF(lElement, I));
				const lEstQCM =
					lElement.executionQCM && lElement.executionQCM.existeNumero();
				T.push('<div class="NoWrap">');
				if (lEstQCM) {
					T.push(
						'<i role="presentation" class="icon_qcm ThemeCat-pedagogie AlignementMilieuVertical" role="presentation"></i>',
					);
				}
				const lPourQCM =
					lEstQCM && !this.pourEleve && !this._options.sansLienQCM;
				T.push(
					'<div class="InlineBlock AlignementMilieuVertical',
					lPourQCM ? "" : " tiny-view",
					'">',
					lPourQCM
						? this.getTitreExecutionQCM(
								lElement.getNumero(),
								lElement.executionQCM,
							)
						: lElement.descriptif,
					"</div>",
				);
				T.push("</div>");
				T.push("</div>");
				T.push(this._composeInformationsTAF(lElement));
				if (
					!!lElement.ListePieceJointe &&
					lElement.ListePieceJointe.count() > 0
				) {
					T.push(this.composePiecesJointes(lElement));
				}
				T.push("</div>");
				if (this.pourEleve) {
					T.push(
						'<div class="InlineBlock AlignementHaut" style="width: ',
						this.getWidthActionsTAF(),
						'px;">',
						this.composeActionsTAF(lElement),
						"</div>",
					);
				}
				T.push("</div>");
				T.push("</div>");
				lDonneLe = lNewDonneLe;
				lPourLe = lNewPourLe;
				lCount++;
			}
		}
		T.push("</div>");
		return T.join("");
	}
	getTitreExecutionQCM(aNumeroTAF, aExecutionQCM) {
		const H = [];
		const lIENode = " ie-node=\"executerQCMTAF('" + aNumeroTAF + "')\"";
		H.push(
			'<div class="Insecable">',
			aExecutionQCM.estEnPublication === true
				? ObjetTraduction_1.GTraductions.getValeur("ExecutionQCM.RepondreQCM")
				: ObjetDate_1.GDate.formatDate(
						aExecutionQCM.dateDebutPublication,
						"" +
							ObjetTraduction_1.GTraductions.getValeur(
								"ExecutionQCM.QCMPublieLe",
							) +
							" %J %MMMM",
					),
			" : ",
			'<span aria-haspopup="dialog" tabindex="0" class="AvecMain Lien"',
			lIENode,
			">",
			aExecutionQCM.QCM.getLibelle(),
			"</span>",
			"</div>",
		);
		return H.join("");
	}
	composeActionsTAF(aTaf) {
		const T = [];
		T.push(this._composeSliderTAFFait(aTaf));
		if (!!aTaf.documentRendu) {
			T.push("<div>");
			const lLibelleConsultation =
				TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.getLibelleConsultation(
					aTaf.genreRendu,
				);
			let lIEModelChipsDocumentRendu = null;
			if (this.peuFaireTAF && aTaf.peuRendre) {
				lIEModelChipsDocumentRendu = "chipsDocumentRenduTAF";
			}
			T.push(
				ObjetChaine_1.GChaine.composerUrlLienExterne({
					documentJoint: aTaf.documentRendu,
					genreRessource:
						TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.TAFRenduEleve,
					libelleEcran: lLibelleConsultation,
					ieModelChips: lIEModelChipsDocumentRendu,
					argsIEModel: [aTaf.getNumero()],
				}),
			);
			const lEstAvecUneCorrection =
				!!aTaf.documentCorrige || !!aTaf.commentaireCorrige;
			if (lEstAvecUneCorrection) {
				const lContientQueLaCopieCorrigee =
					!!aTaf.documentCorrige && !aTaf.commentaireCorrige;
				if (lContientQueLaCopieCorrigee) {
					T.push(
						ObjetChaine_1.GChaine.composerUrlLienExterne({
							documentJoint: aTaf.documentCorrige,
							genreRessource:
								TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
									.TAFCorrigeRenduEleve,
							libelleEcran: ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.TAFARendre.Eleve.CopieCorrigeeParEnseignant",
							),
						}),
					);
				} else {
					T.push(
						"<ie-chips ie-model=\"chipsCorrectionTAFEleve('",
						aTaf.getNumero(),
						"')\">",
						ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.TAFARendre.Eleve.CorrectionDeLEnseignant",
						),
						"</ie-chips>",
					);
				}
			}
			T.push("</div>");
		}
		const lBoutons = this.getBtnActionsDeTaf(aTaf);
		if (!!lBoutons && lBoutons.length > 0) {
			T.push("<div>");
			lBoutons.forEach((aBouton) => {
				T.push(
					UtilitaireBloc_2.TUtilitaireBloc.composeBtnAction(
						aBouton,
						aTaf.getNumero(),
					),
				);
			});
			T.push("</div>");
		}
		return T.join("");
	}
	getBtnActionsDeTaf(lDonnee) {
		const lResult = [];
		const lAvecERendu =
			TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
				lDonnee.genreRendu,
			);
		const lEstRenduPronote =
			TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
				lDonnee.genreRendu,
				false,
			);
		const lAvecPRendu =
			TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduPapier(
				lDonnee.genreRendu,
			);
		let lLibelle, lGenre;
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
				lGenre = EGenreBtnActionBlocCDT.detailTAF;
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
					lGenre = lEstRenduPronote
						? EGenreBtnActionBlocCDT.documentRendu
						: EGenreBtnActionBlocCDT.executionKiosque;
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
				lGenre = EGenreBtnActionBlocCDT.detailTAF;
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
						genreBtn: EGenreBtnActionBlocCDT.executionQCM,
					});
				}
			} else {
				lResult.push({
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"TAFEtContenu.voirQCM",
					),
					genreBtn: EGenreBtnActionBlocCDT.voirQCM,
				});
			}
		}
		if (
			lDonnee &&
			lDonnee.cahierDeTextes &&
			lDonnee.cahierDeTextes.existeNumero() &&
			!this._options.cacherBoutonContenu
		) {
			lResult.push({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.TAFARendre.VoirContenu",
				),
				genreBtn: EGenreBtnActionBlocCDT.voirContenu,
			});
		}
		return lResult;
	}
	getDonnee() {
		return this.donnee && this.donnee.cahiersDeTextes
			? this.donnee.cahiersDeTextes
			: undefined;
	}
	getGenreAffichage() {
		const lGenreAffichage =
			this.donnee.genreAffichage !== null &&
			this.donnee.genreAffichage !== undefined
				? this.donnee.genreAffichage
				: GEtatUtilisateur.getGenreOnglet() ===
						Enumere_Onglet_1.EGenreOnglet.CDT_TAF
					? Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
							.TravailAFaire
					: Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
							.ContenuDeCours;
		return lGenreAffichage;
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
		const lDonnee = this.getDonnee();
		return lDonnee.CouleurFond;
	}
	getTitre() {
		const lHtml = [];
		const lDonnee = this.getDonnee();
		lHtml.push(
			"<div>",
			lDonnee && lDonnee.Matiere ? lDonnee.Matiere.getLibelle() : "",
			"</div>",
		);
		return lHtml.join("");
	}
	callbackTitre() {
		if (this._options.callBackTitre) {
			const lDonnee = this.getDonnee();
			this._options.callBackTitre(lDonnee);
		}
	}
	getInfoSsTitre() {
		const T = [];
		const lDonnee = this.getDonnee();
		if (lDonnee.listeProfesseurs) {
			T.push(lDonnee.listeProfesseurs.getTableauLibelles().join(", "));
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
	getWidthActionsTAF() {
		return 165;
	}
	getAvecDocuments() {
		return false;
	}
	getInfoTitre() {
		const lHtml = [];
		const lDonnee = this.getDonnee();
		if (lDonnee && lDonnee.Date) {
			lHtml.push(
				'<div class="Espace">',
				this._options.formatDate
					? ObjetDate_1.GDate.formatDate(lDonnee.Date, this._options.formatDate)
					: "",
				"<div>",
				ObjetDate_1.GDate.formatDate(
					lDonnee.Date,
					ObjetTraduction_1.GTraductions.getValeur("De").ucfirst() +
						" %hh%sh%mm",
				),
				lDonnee.DateFin
					? ObjetDate_1.GDate.formatDate(
							lDonnee.DateFin,
							" " +
								ObjetTraduction_1.GTraductions.getValeur("A") +
								" %hh%sh%mm",
						)
					: "",
				"</div>",
				"</div>",
			);
		}
		return {
			avecInfo: true,
			strInfo: lHtml.join(""),
			alignement: "AlignementDroit AlignementHaut",
		};
	}
	avecMenuContextuel() {
		return false;
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
			this.actionSurRequeteSaisieTAFARendreEleve.bind(this, aNumeroTAF, true),
		).lancerRequete(lListeFichiers);
	}
	evenementSurSelecFile(aParams, aNumeroArticle, aParamsInput) {
		const lFichier = aParamsInput
			? aParamsInput.eltFichier
			: new ObjetElement_1.ObjetElement();
		const lListeFichiers = new ObjetListeElements_1.ObjetListeElements();
		const lTAF = this.getTAF(aNumeroArticle);
		if (lFichier) {
			lListeFichiers.addElement(lFichier, 0);
			lFichier.TAF = new ObjetElement_1.ObjetElement("", lTAF.getNumero());
			lFichier.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
		new MultiObjetRequeteSaisieTAFARendreEleve.ObjetRequeteSaisieTAFARendreEleve(
			this,
			this.actionSurRequeteSaisieTAFARendreEleve.bind(
				this,
				aNumeroArticle,
				false,
			),
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
	actionSurRequeteSaisieTAFARendreEleve(aNumeroArticle, aEstSuppression) {
		this.declencherCallback({
			donnee: this.getTAF(aNumeroArticle),
			genreEvnt:
				aEstSuppression === true
					? EGenreBtnActionBlocCDT.supprimer
					: EGenreBtnActionBlocCDT.documentRendu,
			param: {},
		});
	}
	composePourTAF(aDonnee) {
		if (!aDonnee.Matiere.ressources) {
			aDonnee.ListeTravailAFaire.setTri([
				ObjetTri_1.ObjetTri.init("PourLe"),
				ObjetTri_1.ObjetTri.init("Matiere.Libelle"),
				ObjetTri_1.ObjetTri.init((D) => {
					return ObjetDate_1.GDate.getJour(D.DonneLe);
				}),
				ObjetTri_1.ObjetTri.init("Genre"),
				ObjetTri_1.ObjetTri.init("Libelle"),
			]);
			aDonnee.ListeTravailAFaire.trier();
		}
		return this.composeTAF(
			aDonnee.Matiere,
			aDonnee.ListeTravailAFaire,
			undefined,
		);
	}
	composePourCours(aDonnee) {
		const lHtml = [];
		for (let i = 0; i < aDonnee.listeContenus.count(); i++) {
			const lContenu = aDonnee.listeContenus.get(i);
			lHtml.push(this._composeContenu(lContenu, i));
		}
		if (
			aDonnee &&
			aDonnee.listeElementsProgrammeCDT &&
			aDonnee.listeElementsProgrammeCDT.count()
		) {
			lHtml.push(this._composeElementsProgramme(aDonnee));
		}
		if (aDonnee.ListeTravailAFaire.count()) {
			lHtml.push(
				"<div>",
				this.composeTAF(aDonnee.Matiere, aDonnee.ListeTravailAFaire, true),
				"</div>",
			);
		}
		return lHtml.join("");
	}
	_composeElementsProgramme(aDonnee) {
		let lElementProgrammeCDT;
		const lHtml = [];
		if (aDonnee && aDonnee.listeContenus && aDonnee.listeContenus.count()) {
			lHtml.push("<div><hr></div>");
		}
		lHtml.push(
			'<div class="Espace">',
			'<div class="Gras">',
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.ElementsProgramme",
			),
			" :",
			"</div>",
			"<ul>",
		);
		for (let i = 0; i < aDonnee.listeElementsProgrammeCDT.count(); i++) {
			lElementProgrammeCDT = aDonnee.listeElementsProgrammeCDT.get(i);
			lHtml.push("<li>", lElementProgrammeCDT.getLibelle(), "</li>");
		}
		lHtml.push("</ul>", "</div>");
		return lHtml.join("");
	}
	_composeContenu(aContenu, aIndice) {
		const lHtml = [];
		if (aIndice > 0) {
			lHtml.push("<div><hr></div>");
		}
		lHtml.push('<div class="flex-contain">');
		lHtml.push(
			'<div class="fluid-bloc">',
			"<div>",
			aContenu.Libelle,
			aContenu.categorie.Libelle
				? (aContenu.Libelle ? " - " : "") + aContenu.categorie.Libelle
				: "",
			"</div>",
			'<div class="tiny-view">',
			aContenu.descriptif,
			"</div>",
			"</div>",
		);
		if (
			aContenu.categorie &&
			aContenu.categorie.getGenre() &&
			TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexteUtil.estTypeAvecIcone(
				aContenu.categorie.getGenre(),
			)
		) {
			lHtml.push(
				`<span><i class="${TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexteUtil.getIcone(aContenu.categorie.getGenre())}" role="presentation">${aContenu.categorie.libelleIcone || ""}</i></span>`,
			);
		}
		lHtml.push("</div>");
		if (
			(aContenu.ListePieceJointe && aContenu.ListePieceJointe.count() > 0) ||
			(aContenu.listeExecutionQCM && aContenu.listeExecutionQCM.count() > 0)
		) {
			lHtml.push(this._composeEspaceDocuments(aContenu, aIndice));
		}
		return lHtml.join("");
	}
	_composeEspaceDocuments(aContenu, aIndiceContenu) {
		const H = [];
		let lListeDocuments = "";
		const lListeQCM = [];
		let lIENode;
		if (aContenu.ListePieceJointe) {
			lListeDocuments = UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
				aContenu.ListePieceJointe,
			);
		}
		if (aContenu.listeExecutionQCM) {
			for (let j = 0; j < aContenu.listeExecutionQCM.count(); j++) {
				const lExecutionQCM = aContenu.listeExecutionQCM.get(j);
				lIENode = ' ie-node="executerQCM(' + aIndiceContenu + ", " + j + ')"';
				lListeQCM.push(
					'<div aria-haspopup="dialog" tabindex="0" class="AvecMain Lien"',
					lIENode,
					">",
					lExecutionQCM.QCM.getLibelle(),
					"</div>",
				);
			}
		}
		H.push(
			'<div class="Espace" style="',
			ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.fond),
			'margin:10px 5px;">',
		);
		H.push(
			'<div style="',
			ObjetStyle_1.GStyle.composeCouleurTexte(GCouleur.grisTresFonce),
			'">',
			ObjetTraduction_1.GTraductions.getValeur("Agenda.Documents"),
			"</div>",
		);
		H.push("<div>", lListeDocuments, " </div>");
		if (aContenu.listeExecutionQCM && aContenu.listeExecutionQCM.count()) {
			H.push(
				'<i role="presentation" class="icon_qcm ThemeCat-pedagogie AlignementMilieuVertical"></i><div class="InlineBlock">',
				ObjetTraduction_1.GTraductions.getValeur(
					"ExecutionQCM.RepondreQCMContenu",
				),
				" : </div>",
				'<div class="InlineBlock">',
				lListeQCM.join(""),
				" </div>",
			);
		}
		H.push("</div>");
		return H.join("");
	}
	_avecInfosTAF(aTaf) {
		return (
			aTaf.duree > 0 ||
			(aTaf.executionQCM && aTaf.executionQCM.dureeMaxQCM) ||
			aTaf.niveauDifficulte !==
				TypeNiveauDifficulte_1.TypeNiveauDifficulte.ND_NonPrecise
		);
	}
	_composeInformationsTAF(aTaf) {
		const T = [];
		if (this._avecInfosTAF(aTaf)) {
			T.push(
				'<div class="InlineBlock AlignementHaut SansMain" style="width:36px;">',
				this._getNiveauDifficulte(this._options.modeAffichage, aTaf),
				this._getDuree(aTaf),
				"</div>",
			);
		}
		return T.join("");
	}
	composePublicTAF(aTaf, aIndice) {
		const T = [];
		if (this.avecDetailTAF) {
			if (aTaf.nomPublic) {
				T.push(
					'<div class="InlineBlock">',
					ObjetImage_1.GImage.composeImage("Image_TAF_Public"),
					"</div>",
					'<span class="PetitEspaceGauche InlineBlock" style="',
					ObjetStyle_1.GStyle.composeCouleurTexte(GCouleur.themeNeutre.foncee),
					'">',
					aTaf.pourTousLesEleves
						? aTaf.nomPublic
						: ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.TAFARendre.eleves",
								[aTaf.nbrEleves],
							),
					"</span>",
				);
			}
			let lLienRendus;
			if (aTaf.avecRendu) {
				lLienRendus = this.getLienTAFRendu(aTaf, aIndice);
			} else {
				lLienRendus = this.getLienTafFaitSelonEleve(aTaf, aIndice);
			}
			if (!!lLienRendus) {
				T.push("&nbsp;-&nbsp;");
				T.push(
					'<span style="line-height: 14px;',
					ObjetStyle_1.GStyle.composeCouleurTexte(GCouleur.themeNeutre.foncee),
					'">',
				);
				T.push(lLienRendus);
				T.push("</span>");
			}
		}
		return T.join("");
	}
	getLienTafFaitSelonEleve(aTaf, aIndice) {
		const H = [];
		H.push(
			'<span aria-haspopup="dialog" tabindex="0" class="AvecMain LienAccueil" ie-node="renduTAF(\'' +
				aTaf.getNumero() +
				"', " +
				aIndice +
				')">',
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.TAFARendre.FaitPar",
			),
			" ",
			aTaf.nbrFaitsSelonEleve,
			"/",
			aTaf.nbrEleves,
			"</span>",
		);
		return H.join("");
	}
	getLienTAFRendu(aTaf, aIndice) {
		const H = [];
		const lAvecAction = aTaf && aTaf.avecRendu;
		const lIENode =
			" ie-node=\"renduTAF('" + aTaf.getNumero() + "', " + aIndice + ')"';
		const lAction = lAvecAction
			? 'aria-haspopup="dialog" tabindex="0" class="AvecMain LienAccueil" ' +
				lIENode
			: "";
		H.push(
			"<span ",
			lAction,
			">",
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.TAFARendre.RenduPar",
			),
			" ",
			aTaf.nbrRendus,
			"/",
			aTaf.nbrEleves,
			"</span>",
		);
		return H.join("");
	}
	_getNiveauDifficulte(aModeAffichage, aTAF) {
		const H = [];
		const lColor =
			aModeAffichage ===
			Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.grille
				? GCouleur.themeNeutre.foncee
				: "#FFCC00";
		if (aTAF && aTAF.niveauDifficulte) {
			H.push(
				'<div class="SansMain AlignementDroit" title="',
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.NiveauDifficulte",
				),
				'">',
				TypeNiveauDifficulte_1.TypeNiveauDifficulteUtil.getImage(
					aTAF.niveauDifficulte,
					{ color: lColor, avecTitle: true },
				),
				"</div>",
			);
		}
		return H.join("");
	}
	_getDuree(lDonnee) {
		const T = [];
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
				'<div class="SansMain AlignementDroit" title="',
				ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.DureeEstimee"),
				'">',
				lStrDuree,
				"</div>",
			);
		}
		return T.join("");
	}
	_composeLibelleBouton(aGenre, aLibelle, aAvecIcone) {
		const T = [];
		T.push('<div class="NoWrap" style="margin-left:auto; margin-right:auto;">');
		if (aAvecIcone) {
			T.push('<i class="icon_punition" role="presentation"></i>');
		}
		T.push(
			'<div class="InlineBlock AlignementMilieuVertical PetitEspaceGauche" style="line-height: 0.95em; max-width: ',
			this.getWidthActionsTAF() - 3 - 13,
			'px;">',
			aLibelle,
			"</div>",
		);
		T.push("</div>");
		return T.join("");
	}
	_estAvecCocheTAFFait(aElement) {
		const lEstRenduKiosque =
			TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduKiosque(
				aElement.genreRendu,
			);
		const lEstRendu =
			TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
				aElement.genreRendu,
				false,
			) && !!aElement.documentRendu;
		const lEstQCM =
			aElement.executionQCM && aElement.executionQCM.existeNumero();
		if (!this.peuFaireTAF || lEstQCM || lEstRenduKiosque || lEstRendu) {
			return false;
		}
		return true;
	}
	_composeSliderTAFFait(aElement) {
		const lHtml = [];
		if (!this._estAvecCocheTAFFait(aElement)) {
			const lEstFait = aElement.TAFFait || aElement.QCMFait;
			const lEstRendu =
				TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
					aElement.genreRendu,
					false,
				) && !!aElement.documentRendu;
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
				TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
					aElement.genreRendu,
					false,
				);
			if (!lAvecERendu) {
				lHtml.push(
					'<div class="Espace AlignementDroit">',
					"<ie-switch ie-model=\"cbFait('",
					aElement.getNumero(),
					"')\" ie-hint=\"cbFait.getHint('",
					aElement.getNumero(),
					"')\">",
					ObjetTraduction_1.GTraductions.getValeur("accueil.hintTravailFait"),
					"</ie-switch>",
					"</div>",
				);
			}
		}
		return lHtml.join("");
	}
}
