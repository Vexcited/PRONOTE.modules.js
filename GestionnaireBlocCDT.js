const { TypeDroits } = require("ObjetDroitsPN.js");
const { GStyle } = require("ObjetStyle.js");
const { GDate } = require("ObjetDate.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GChaine } = require("ObjetChaine.js");
const { TUtilitaireDuree } = require("UtilitaireDuree.js");
const { GestionnaireBlocPN } = require("GestionnaireBlocPN.js");
const { ObjetBlocPN } = require("GestionnaireBlocPN.js");
const { EGenreBloc } = require("Enumere_Bloc.js");
const { EModeAffichageTimeline } = require("Enumere_ModeAffichageTimeline.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const {
	TypeNiveauDifficulte,
	TypeNiveauDifficulteUtil,
} = require("TypeNiveauDifficulte.js");
const {
	EGenreAffichageCahierDeTextes,
} = require("Enumere_AffichageCahierDeTextes.js");
const { TypeGenreRenduTAFUtil } = require("TypeGenreRenduTAF.js");
const { EGenreBoutonBloc } = require("UtilitaireBloc.js");
const { GImage } = require("ObjetImage.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const {
	ObjetRequeteSaisieTAFFaitEleve,
} = require("ObjetRequeteSaisieTAFFaitEleve.js");
const ObjetRequeteSaisieTAFARendreEleve = require("ObjetRequeteSaisieTAFARendreEleve.js");
const {
	TypeOrigineCreationCategorieCahierDeTexte,
	TypeOrigineCreationCategorieCahierDeTexteUtil,
} = require("TypeOrigineCreationCategorieCahierDeTexte.js");
const { TUtilitaireBloc } = require("UtilitaireBloc.js");
const { UtilitaireQCM } = require("UtilitaireQCM.js");
const { TypeFichierExterneHttpSco } = require("TypeFichierExterneHttpSco.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_CorrectionTaf } = require("ObjetFenetre_CorrectionTaf.js");
const {
	ObjetUtilitaireCahierDeTexte,
} = require("ObjetUtilitaireCahierDeTexte.js");
const EGenreBtnActionBlocCDT = {
	documentRendu: 1,
	executionQCM: 2,
	consulter: 3,
	supprimer: 4,
	tafFait: 5,
	executionKiosque: 6,
	voirQCM: 7,
	voirContenu: 8,
	detailTAF: 9,
	consulterCorrige: 10,
};
class GestionnaireBlocCDT extends GestionnaireBlocPN {
	constructor(...aParams) {
		super(...aParams);
		this.setGenreBloc(EGenreBloc.CahiersDeTexte);
		const lOptions = {
			modeAffichage: EModeAffichageTimeline.classique,
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
class ObjetBlocCDT extends ObjetBlocPN {
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
						? GTraductions.getValeur("accueil.hintTravailFait")
						: GTraductions.getValeur("accueil.hintTravailAFaire");
				},
				setValue: function (aNumeroTAF, aValue) {
					const lTAF = aInstance.getTAF(aNumeroTAF);
					lTAF.TAFFait = aValue;
					lTAF.setEtat(EGenreEtat.Modification);
					const lListe = new ObjetListeElements();
					lListe.addElement(lTAF);
					new ObjetRequeteSaisieTAFFaitEleve(
						aInstance,
						aInstance._actionSurRequeteSaisieTAFFaitEleve.bind(
							aInstance,
							aNumeroTAF,
						),
					).lancerRequete({ listeTAF: lListe });
				},
				getDisabled: function (aNumeroTAF) {
					const lTAF = aInstance.getTAF(aNumeroTAF);
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
			chipsDocumentRenduTAF: {
				eventBtn: function (aNumeroTaf) {
					aInstance.surSupprimer(aNumeroTaf);
				},
			},
			chipsCorrectionTAFEleve: {
				event: function (aNumeroTaf) {
					const lTaf = aInstance.getTAF(aNumeroTaf);
					if (!!lTaf) {
						const lFenetreCorrectionTaf = ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_CorrectionTaf,
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
	_actionSurRequeteSaisieTAFFaitEleve(aNumeroTaf, aEvent) {
		const lTAF = this.getTAF(aNumeroTaf);
		this.declencherCallback({
			donnee: lTAF,
			genreEvnt: EGenreBtnActionBlocCDT.tafFait,
			param: { event: aEvent },
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
						EGenreAffichageCahierDeTextes.TravailAFaire
						? composePourTAF.call(this, lDonnee)
						: composePourCours.call(this, lDonnee),
					"</div></div>",
				);
			}
		}
		return H.join("");
	}
	composePiecesJointes(aElement) {
		const lHtml = [];
		const lListeDocuments = UtilitaireUrl.construireListeUrls(
			aElement.ListePieceJointe,
		);
		lHtml.push(
			'<div class="Espace" style="',
			GStyle.composeCouleurFond(GCouleur.fond),
			'margin:5px 5px 1px 5px;">',
		);
		lHtml.push(
			'<div style="',
			GStyle.composeCouleurTexte(GCouleur.grisTresFonce),
			'">',
			GTraductions.getValeur("Agenda.Documents"),
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
			GStyle.composeCouleur(
				GCouleur.themeNeutre.claire,
				GCouleur.noire,
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
						GStyle.composeCouleur(GCouleur.themeNeutre.legere, GCouleur.noire),
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
						_composeSymboleCategorie(
							TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir,
						),
						"</div>",
					);
				}
				if (lElement.estEval) {
					T.push(
						'<div class="NoWrap PetitEspace EspaceGauche">',
						'<div class="InlineBlock GrandEspaceDroit AlignementMilieuVertical" >',
						lElement.getLibelle(),
						"</div>",
						_composeSymboleCategorie(
							TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation,
						),
						"</div>",
					);
				}
			} else {
				const lNbJours = lElement.DonneLe
					? GDate.getDifferenceJours(lElement.PourLe, lElement.DonneLe)
					: 0;
				const lStrJours = (
					lNbJours > 1
						? GTraductions.getValeur("TAFEtContenu.jours")
						: GTraductions.getValeur("TAFEtContenu.jour")
				).toLowerCase();
				lNewDonneLe = lElement.DonneLe
					? GTraductions.getValeur("TAFEtContenu.donneLe") +
						GDate.formatDate(lElement.DonneLe, " %JJ/%MM")
					: "";
				lNewPourLe = lElement.PourLe
					? GTraductions.getValeur("CahierDeTexte.pourLe") +
						GDate.formatDate(lElement.PourLe, " %JJ/%MM")
					: "";
				T.push("<div>");
				if (aPourLe) {
					if (!lPourLe || lPourLe !== lNewPourLe) {
						T.push(
							'<div class="PetitEspaceHaut PetitEspaceBas" style="',
							GStyle.composeCouleur(
								GCouleur.themeNeutre.claire,
								GCouleur.noire,
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
							GStyle.composeCouleur(
								GCouleur.themeNeutre.claire,
								GCouleur.noire,
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
					GStyle.composeWidthCalc(6),
					GStyle.composeCouleur(GCouleur.blanc, GCouleur.noire),
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
						? GStyle.composeWidthCalc(this.getWidthActionsTAF() + 5)
						: "width:100%;",
					'">',
				);
				T.push(
					'<div class="InlineBlock AlignementHaut" style="min-height: 18px; ',
					_avecInfosTAF(lElement) ? GStyle.composeWidthCalc(36) : "width:100%;",
					'">',
				);
				T.push(composePublicTAF.call(this, lElement, I));
				const lEstQCM =
					lElement.executionQCM && lElement.executionQCM.existeNumero();
				T.push('<div class="NoWrap">');
				if (lEstQCM) {
					T.push(
						'<i class="icon_qcm ThemeCat-pedagogie AlignementMilieuVertical" role="presentation"></i>',
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
				T.push(_composeInformationsTAF.call(this, lElement));
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
				? GTraductions.getValeur("ExecutionQCM.RepondreQCM")
				: GDate.formatDate(
						aExecutionQCM.dateDebutPublication,
						"" +
							GTraductions.getValeur("ExecutionQCM.QCMPublieLe") +
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
		T.push(_composeSliderTAFFait.call(this, aTaf));
		if (!!aTaf.documentRendu) {
			T.push("<div>");
			const lLibelleConsultation = TypeGenreRenduTAFUtil.getLibelleConsultation(
				aTaf.genreRendu,
			);
			let lIEModelChipsDocumentRendu = null;
			if (this.peuFaireTAF && aTaf.peuRendre) {
				lIEModelChipsDocumentRendu = "chipsDocumentRenduTAF";
			}
			T.push(
				GChaine.composerUrlLienExterne({
					documentJoint: aTaf.documentRendu,
					genreRessource: TypeFichierExterneHttpSco.TAFRenduEleve,
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
						GChaine.composerUrlLienExterne({
							documentJoint: aTaf.documentCorrige,
							genreRessource: TypeFichierExterneHttpSco.TAFCorrigeRenduEleve,
							libelleEcran: GTraductions.getValeur(
								"CahierDeTexte.TAFARendre.Eleve.CopieCorrigeeParEnseignant",
							),
						}),
					);
				} else {
					T.push(
						"<ie-chips ie-model=\"chipsCorrectionTAFEleve('",
						aTaf.getNumero(),
						"')\">",
						GTraductions.getValeur(
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
				T.push(TUtilitaireBloc.composeBtnAction(aBouton, aTaf.getNumero()));
			});
			T.push("</div>");
		}
		return T.join("");
	}
	getBtnActionsDeTaf(lDonnee) {
		const lResult = [];
		const lAvecERendu = TypeGenreRenduTAFUtil.estUnRenduEnligne(
			lDonnee.genreRendu,
		);
		const lEstRenduPronote = TypeGenreRenduTAFUtil.estUnRenduEnligne(
			lDonnee.genreRendu,
			false,
		);
		const lAvecPRendu = TypeGenreRenduTAFUtil.estUnRenduPapier(
			lDonnee.genreRendu,
		);
		let lLibelle, lGenre;
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
				lGenre = EGenreBtnActionBlocCDT.detailTAF;
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
					lGenre = lEstRenduPronote
						? EGenreBtnActionBlocCDT.documentRendu
						: EGenreBtnActionBlocCDT.executionKiosque;
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
				lGenre = EGenreBtnActionBlocCDT.detailTAF;
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
						genreBtn: EGenreBtnActionBlocCDT.executionQCM,
					});
				}
			} else {
				lResult.push({
					libelle: GTraductions.getValeur("TAFEtContenu.voirQCM"),
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
				libelle: GTraductions.getValeur("CahierDeTexte.TAFARendre.VoirContenu"),
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
				: GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.CDT_TAF
					? EGenreAffichageCahierDeTextes.TravailAFaire
					: EGenreAffichageCahierDeTextes.ContenuDeCours;
		return lGenreAffichage;
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
			this._options.modeAffichage !== EModeAffichageTimeline.grille &&
			this._options.avecOmbre !== false
		);
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
					? GDate.formatDate(lDonnee.Date, this._options.formatDate)
					: "",
				"<div>",
				GDate.formatDate(
					lDonnee.Date,
					GTraductions.getValeur("De").ucfirst() + " %hh%sh%mm",
				),
				lDonnee.DateFin
					? GDate.formatDate(
							lDonnee.DateFin,
							" " + GTraductions.getValeur("A") + " %hh%sh%mm",
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
		const lFichier = new ObjetElement(),
			lListeFichiers = new ObjetListeElements();
		lListeFichiers.addElement(lFichier, 0);
		lFichier.TAF = new ObjetElement("", aNumeroTAF);
		lFichier.setEtat(EGenreEtat.Suppression);
		new ObjetRequeteSaisieTAFARendreEleve(
			this,
			this.actionSurRequeteSaisieTAFARendreEleve.bind(this, aNumeroTAF, true),
		).lancerRequete(lListeFichiers);
	}
	evenementSurSelecFile(aParams, aNumeroArticle, aParamsInput) {
		const lFichier = aParamsInput
				? aParamsInput.eltFichier
				: new ObjetElement(),
			lListeFichiers = new ObjetListeElements();
		const lTAF = this.getTAF(aNumeroArticle);
		if (lFichier) {
			lListeFichiers.addElement(lFichier, 0);
			lFichier.TAF = new ObjetElement("", lTAF.getNumero());
			lFichier.setEtat(EGenreEtat.Modification);
		}
		new ObjetRequeteSaisieTAFARendreEleve(
			this,
			this.actionSurRequeteSaisieTAFARendreEleve.bind(this, aNumeroArticle),
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
}
function composePourTAF(aDonnee) {
	if (!aDonnee.Matiere.ressources) {
		aDonnee.ListeTravailAFaire.setTri([
			ObjetTri.init("PourLe"),
			ObjetTri.init("Matiere.Libelle"),
			ObjetTri.init((D) => {
				return GDate.getJour(D.DonneLe);
			}),
			ObjetTri.init("Genre"),
			ObjetTri.init("Libelle"),
		]);
		aDonnee.ListeTravailAFaire.trier();
	}
	return this.composeTAF(
		aDonnee.Matiere,
		aDonnee.ListeTravailAFaire,
		undefined,
	);
}
function _composeSymboleCategorie(aGenre) {
	const T = [];
	T.push(
		'<div class="',
		TypeOrigineCreationCategorieCahierDeTexteUtil.getImage(aGenre),
		' AlignementHaut" style="width:17px"></div>',
	);
	return T.join("");
}
function composePourCours(aDonnee) {
	const lHtml = [];
	for (let i = 0; i < aDonnee.listeContenus.count(); i++) {
		const lContenu = aDonnee.listeContenus.get(i);
		lHtml.push(_composeContenu.call(this, lContenu, i));
	}
	if (
		aDonnee &&
		aDonnee.listeElementsProgrammeCDT &&
		aDonnee.listeElementsProgrammeCDT.count()
	) {
		lHtml.push(_composeElementsProgramme.call(this, aDonnee));
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
function _composeElementsProgramme(aDonnee) {
	let lElementProgrammeCDT;
	const lHtml = [];
	if (aDonnee && aDonnee.listeContenus && aDonnee.listeContenus.count()) {
		lHtml.push("<div><hr></div>");
	}
	lHtml.push(
		'<div class="Espace">',
		'<div class="Gras">',
		GTraductions.getValeur("CahierDeTexte.ElementsProgramme"),
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
function _composeContenu(aContenu, aIndice) {
	const lHtml = [];
	if (aIndice > 0) {
		lHtml.push("<div><hr></div>");
	}
	lHtml.push('<div class="NoWrap">');
	if (
		aContenu.categorie &&
		aContenu.categorie.getGenre() &&
		TypeOrigineCreationCategorieCahierDeTexteUtil.estTypeAvecImage(
			aContenu.categorie.getGenre(),
		)
	) {
		lHtml.push(
			'<div style="float:right;" class="EspaceDroit AlignementHaut" >',
			_composeSymboleCategorie(aContenu.categorie.getGenre()),
			"</div>",
		);
	}
	lHtml.push(
		'<div class="InlineBlock AlignementHaut">',
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
	lHtml.push("</div>");
	if (
		(aContenu.ListePieceJointe && aContenu.ListePieceJointe.count() > 0) ||
		(aContenu.listeExecutionQCM && aContenu.listeExecutionQCM.count() > 0)
	) {
		lHtml.push(_composeEspaceDocuments.call(this, aContenu, aIndice));
	}
	return lHtml.join("");
}
function _composeEspaceDocuments(aContenu, aIndiceContenu) {
	const H = [];
	let lListeDocuments = "";
	const lListeQCM = [];
	let lIENode;
	if (aContenu.ListePieceJointe) {
		lListeDocuments = UtilitaireUrl.construireListeUrls(
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
		GStyle.composeCouleurFond(GCouleur.fond),
		'margin:10px 5px;">',
	);
	H.push(
		'<div style="',
		GStyle.composeCouleurTexte(GCouleur.grisTresFonce),
		'">',
		GTraductions.getValeur("Agenda.Documents"),
		"</div>",
	);
	H.push("<div>", lListeDocuments, " </div>");
	if (aContenu.listeExecutionQCM && aContenu.listeExecutionQCM.count()) {
		H.push(
			'<i class="icon_qcm ThemeCat-pedagogie AlignementMilieuVertical"></i><div class="InlineBlock">',
			GTraductions.getValeur("ExecutionQCM.RepondreQCMContenu"),
			" : </div>",
			'<div class="InlineBlock">',
			lListeQCM.join(""),
			" </div>",
		);
	}
	H.push("</div>");
	return H.join("");
}
function _avecInfosTAF(aTaf) {
	return (
		aTaf.duree > 0 ||
		(aTaf.executionQCM && aTaf.executionQCM.dureeMaxQCM) ||
		aTaf.niveauDifficulte !== TypeNiveauDifficulte.ND_NonPrecise
	);
}
function _composeInformationsTAF(aTaf) {
	const T = [];
	if (_avecInfosTAF(aTaf)) {
		T.push(
			'<div class="InlineBlock AlignementHaut SansMain" style="width:36px;">',
			_getNiveauDifficulte(this._options.modeAffichage, aTaf),
			_getDuree(aTaf),
			"</div>",
		);
	}
	return T.join("");
}
function composePublicTAF(aTaf, aIndice) {
	const T = [];
	if (this.avecDetailTAF) {
		if (aTaf.nomPublic) {
			T.push(
				'<div class="InlineBlock">',
				GImage.composeImage("Image_TAF_Public"),
				"</div>",
				'<span class="PetitEspaceGauche InlineBlock" style="',
				GStyle.composeCouleurTexte(GCouleur.themeNeutre.foncee),
				'">',
				aTaf.pourTousLesEleves
					? aTaf.nomPublic
					: GTraductions.getValeur("CahierDeTexte.TAFARendre.eleves", [
							aTaf.nbrEleves,
						]),
				"</span>",
			);
		}
		let lLienRendus;
		if (aTaf.avecRendu) {
			lLienRendus = getLienTAFRendu(aTaf, aIndice);
		} else {
			lLienRendus = getLienTafFaitSelonEleve(aTaf, aIndice);
		}
		if (!!lLienRendus) {
			T.push("&nbsp;-&nbsp;");
			T.push(
				'<span style="line-height: 14px;',
				GStyle.composeCouleurTexte(GCouleur.themeNeutre.foncee),
				'">',
			);
			T.push(lLienRendus);
			T.push("</span>");
		}
	}
	return T.join("");
}
function getLienTafFaitSelonEleve(aTaf, aIndice) {
	const H = [];
	H.push(
		'<span aria-haspopup="dialog" tabindex="0" class="AvecMain LienAccueil" ie-node="renduTAF(\'' +
			aTaf.getNumero() +
			"', " +
			aIndice +
			')">',
		GTraductions.getValeur("CahierDeTexte.TAFARendre.FaitPar"),
		" ",
		aTaf.nbrFaitsSelonEleve,
		"/",
		aTaf.nbrEleves,
		"</span>",
	);
	return H.join("");
}
function getLienTAFRendu(aTaf, aIndice) {
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
		GTraductions.getValeur("CahierDeTexte.TAFARendre.RenduPar"),
		" ",
		aTaf.nbrRendus,
		"/",
		aTaf.nbrEleves,
		"</span>",
	);
	return H.join("");
}
function _getNiveauDifficulte(aModeAffichage, aTAF) {
	const H = [];
	const lColor =
		aModeAffichage === EModeAffichageTimeline.grille
			? GCouleur.themeNeutre.foncee
			: "#FFCC00";
	if (aTAF && aTAF.niveauDifficulte) {
		H.push(
			'<div class="SansMain AlignementDroit" title="',
			GTraductions.getValeur("CahierDeTexte.NiveauDifficulte"),
			'">',
			TypeNiveauDifficulteUtil.getImage(aTAF.niveauDifficulte, {
				color: lColor,
				avecTitle: true,
			}),
			"</div>",
		);
	}
	return H.join("");
}
function _getDuree(lDonnee) {
	const T = [];
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
			'<div class="SansMain AlignementDroit" title="',
			GTraductions.getValeur("CahierDeTexte.DureeEstimee"),
			'">',
			lStrDuree,
			"</div>",
		);
	}
	return T.join("");
}
function _composeLibelleBouton(aGenre, aLibelle, aAvecIcone) {
	const T = [];
	T.push('<div class="NoWrap" style="margin-left:auto; margin-right:auto;">');
	if (aAvecIcone) {
		T.push('<i class="icon_punition"></i>');
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
function _estAvecCocheTAFFait(aElement) {
	const lEstRenduKiosque = TypeGenreRenduTAFUtil.estUnRenduKiosque(
		aElement.genreRendu,
	);
	const lEstRendu =
		TypeGenreRenduTAFUtil.estUnRenduEnligne(aElement.genreRendu, false) &&
		!!aElement.documentRendu;
	const lEstQCM = aElement.executionQCM && aElement.executionQCM.existeNumero();
	if (!this.peuFaireTAF || lEstQCM || lEstRenduKiosque || lEstRendu) {
		return false;
	}
	return true;
}
function _composeSliderTAFFait(aElement) {
	const lHtml = [];
	if (!_estAvecCocheTAFFait.call(this, aElement)) {
		const lEstFait = aElement.TAFFait || aElement.QCMFait;
		const lEstRendu =
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
		const lAvecERendu = TypeGenreRenduTAFUtil.estUnRenduEnligne(
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
module.exports = { GestionnaireBlocCDT, EGenreBtnActionBlocCDT };
