exports.ObjetUtilitaireCahierDeTexte = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Callback_1 = require("Callback");
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_Bloc_1 = require("Enumere_Bloc");
const ObjetDate_1 = require("ObjetDate");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_AffichageCahierDeTextes_1 = require("Enumere_AffichageCahierDeTextes");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetRequeteSaisieTAFARendreEleve_1 = require("ObjetRequeteSaisieTAFARendreEleve");
const TypeGenreRenduTAF_1 = require("TypeGenreRenduTAF");
const TypeNiveauDifficulte_1 = require("TypeNiveauDifficulte");
const TypeOrigineCreationCategorieCahierDeTexte_1 = require("TypeOrigineCreationCategorieCahierDeTexte");
const UtilitaireCDT_1 = require("UtilitaireCDT");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const TypeFichierExterneHttpSco_1 = require("TypeFichierExterneHttpSco");
const ObjetFenetre_1 = require("ObjetFenetre");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetFenetre_UploadFichiers_1 = require("ObjetFenetre_UploadFichiers");
const ObjetFenetre_EnregistrementAudioPN_1 = require("ObjetFenetre_EnregistrementAudioPN");
const ObjetFenetre_CorrectionTaf_1 = require("ObjetFenetre_CorrectionTaf");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const UtilitaireAudio_1 = require("UtilitaireAudio");
const TypeGenreTravailAFaire_1 = require("TypeGenreTravailAFaire");
const ObjetFenetre_ActionContextuelle_1 = require("ObjetFenetre_ActionContextuelle");
const AccessApp_1 = require("AccessApp");
class ObjetUtilitaireCahierDeTexte {
	constructor(aNom, aPere, aEvenement) {
		this.Nom = aNom;
		this.pere = aPere;
		this.evenement = aEvenement;
		this.callback = new Callback_1.Callback(this.pere, aEvenement);
		this.peuFaireTAF = [Enumere_Espace_1.EGenreEspace.Eleve].includes(
			GEtatUtilisateur.GenreEspace,
		);
		this.idTAFARendre = GUID_1.GUID.getId();
	}
	composeCDC(aElement, aParam) {
		const lHtml = [];
		const LCouleur = (0, AccessApp_1.getApp)().getCouleur();
		for (let i = 0; i < aElement.listeContenus.count(); i++) {
			const lContenu = aElement.listeContenus.get(i);
			lHtml.push(
				'<div class="Espace">',
				'<div class="Espace" style="',
				ObjetStyle_1.GStyle.composeCouleur(
					LCouleur.blanc,
					LCouleur.noir,
					LCouleur.themeNeutre.claire,
				),
				'">',
			);
			if (
				[
					TypeOrigineCreationCategorieCahierDeTexte_1
						.TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir,
					TypeOrigineCreationCategorieCahierDeTexte_1
						.TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation,
				].includes(lContenu.categorie.getGenre())
			) {
				lHtml.push(
					'<div style="float: right">',
					this._composeSymboleCategorie(lContenu.categorie.getGenre()),
					"</div>",
				);
			}
			lHtml.push(
				"<div>",
				lContenu.Libelle,
				lContenu.categorie.Libelle
					? (lContenu.Libelle ? " - " : "") + lContenu.categorie.Libelle
					: "",
				"</div>",
			);
			lHtml.push("<div>", lContenu.descriptif, "</div>");
			if (lContenu.ListePieceJointe.count() > 0) {
				lHtml.push(
					'<div class="fluid-bloc" style="max-width:100%;">',
					this.composePiecesJointes(lContenu.ListePieceJointe),
					"</div>",
				);
			}
			if (lContenu.listeExecutionQCM.count() > 0) {
				const nbExecutionQCM = lContenu.listeExecutionQCM.count();
				for (let j = 0; j < nbExecutionQCM; j++) {
					const lExecutionQCM = lContenu.listeExecutionQCM.get(j);
					lHtml.push(
						"<div>",
						this.getTitreExecutionQCMContenu(
							aElement.getNumero() + "_" + lContenu.getNumero() + "_" + j,
							lExecutionQCM,
							aParam.nom,
						),
						"</div>",
					);
				}
			}
			lHtml.push("</div>", "</div>");
		}
		let lElementProgrammeCDT;
		if (
			aElement.listeElementsProgrammeCDT &&
			aElement.listeElementsProgrammeCDT.count()
		) {
			lHtml.push(
				'<div class="Espace">',
				'<div class="Espace" style="',
				ObjetStyle_1.GStyle.composeCouleur(
					LCouleur.blanc,
					LCouleur.noir,
					LCouleur.themeNeutre.claire,
				),
				'">',
				'<div class="semi-bold">',
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.ElementsProgramme",
				),
				" :",
				"</div>",
				"<ul>",
			);
			for (let i = 0; i < aElement.listeElementsProgrammeCDT.count(); i++) {
				lElementProgrammeCDT = aElement.listeElementsProgrammeCDT.get(i);
				lHtml.push("<li>", lElementProgrammeCDT.getLibelle(), "</li>");
			}
			lHtml.push("</ul>", "</div>", "</div>");
		}
		if (aElement.ListeTravailAFaire.count()) {
			lHtml.push(this.composeTAF(aElement, aElement.ListeTravailAFaire, true));
		}
		return lHtml.join("");
	}
	getTitreExecutionQCM(I, aExecutionQCM, aNom) {
		const H = [];
		const lAvecAction =
			aNom && UtilitaireQCM_1.UtilitaireQCM.estCliquable(aExecutionQCM);
		const lAction = lAvecAction
			? ' class="AvecMain Souligne" onclick="' +
				aNom +
				".surExecutionQCM (event, '" +
				I +
				"')\""
			: "";
		H.push(
			"<div>",
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
			"<span",
			lAction,
			">",
			aExecutionQCM.QCM.getLibelle(),
			"</span>",
			"</div>",
		);
		return H.join("");
	}
	getTitreExecutionQCMContenu(I, aExecutionQCM, aNom) {
		const H = [];
		const lAvecAction =
			aNom && UtilitaireQCM_1.UtilitaireQCM.estCliquable(aExecutionQCM);
		const lAction = lAvecAction
			? ' class="AvecMain Souligne" onclick="' +
				aNom +
				".surExecutionQCMContenu (event, '" +
				I +
				"')\""
			: "";
		H.push(
			"<div>",
			ObjetTraduction_1.GTraductions.getValeur(
				"ExecutionQCM.RepondreQCMContenu",
			),
			" : ",
			"<span",
			lAction,
			">",
			aExecutionQCM.QCM.getLibelle(),
			"</span>",
			"</div>",
		);
		return H.join("");
	}
	composePiecesJointes(aListePiecesJointes) {
		const lHtml = [];
		if (!!aListePiecesJointes) {
			const nbPiecesJointes = aListePiecesJointes.count();
			lHtml.push('<div class="items-contain flex-wrap m-top">');
			for (let I = 0; I < nbPiecesJointes; I++) {
				const lPieceJointe = aListePiecesJointes.get(I);
				lHtml.push(
					ObjetChaine_1.GChaine.composerUrlLienExterne({
						documentJoint: lPieceJointe,
					}),
				);
			}
			lHtml.push("</div>");
		}
		return lHtml.join("");
	}
	composeTAF(aElement, aListeTAF, aParam, aPourLe = false) {
		const T = [];
		const lNbrElements = aElement.ressources
			? aElement.ressources.count()
			: aListeTAF.count();
		let lElement, lRessource;
		let lDonneLe, lNewDonneLe;
		let lPourLe, lNewPourLe;
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
				if (lElement.estDevoir) {
					T.push(
						'<div class="date-taf-contain items-contain justify-between p-right">',
						"<span>",
						lElement.getLibelle(),
						"</span>",
						this._composeSymboleCategorie(
							TypeOrigineCreationCategorieCahierDeTexte_1
								.TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir,
						),
						"</div>",
					);
				}
				if (lElement.estEval) {
					T.push(
						'<div class="date-taf-contain items-contain justify-between p-right">',
						"<span>",
						lElement.getLibelle(),
						"</span>",
						this._composeSymboleCategorie(
							TypeOrigineCreationCategorieCahierDeTexte_1
								.TypeOrigineCreationCategorieCahierDeTexte
								.OCCCDT_Pre_Evaluation,
						),
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
				lNewDonneLe =
					ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.donneLe") +
					ObjetDate_1.GDate.formatDate(lElement.DonneLe, " %JJ/%MM");
				lNewPourLe =
					ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.pourLe") +
					ObjetDate_1.GDate.formatDate(lElement.PourLe, " %JJ/%MM");
				if (aPourLe) {
					if (!lPourLe || lPourLe !== lNewPourLe) {
						T.push(
							'<div class="date-taf-contain">',
							'<span class="semi-bold">' + lNewPourLe + "</span>",
							"</div>",
						);
					}
				} else {
					if (!lDonneLe || lDonneLe !== lNewDonneLe) {
						T.push(
							'<div class="date-taf-contain">',
							'<span class="semi-bold">' +
								lNewDonneLe +
								"</span><span>" +
								" [" +
								lNbJours +
								" " +
								lStrJours +
								"]</span>",
							"</div>",
						);
					}
				}
				T.push(this.composeInformationsTAF(lElement, aParam));
				T.push('<div class="info-taf-contain">');
				const lEstQCM =
					lElement.executionQCM && lElement.executionQCM.existeNumero();
				T.push(
					this._composeCBTAFFait(lElement),
					'<div class="fluid-bloc" style="max-width:100%; ',
					this._estAvecCocheTAFFait(lElement)
						? ObjetStyle_1.GStyle.composeWidthCalc(14)
						: "",
					'">',
					lEstQCM
						? this.getTitreExecutionQCM(
								lElement.getNumero(),
								lElement.executionQCM,
								aParam.nom,
							)
						: lElement.descriptif,
					lElement.ListePieceJointe.count() > 0
						? this.composePiecesJointes(lElement.ListePieceJointe)
						: "",
					"</div>",
					this._composeLabelTAFFait(lElement),
					"</div>",
				);
				if (!aParam.listeTAF) {
					aParam.listeTAF = aListeTAF;
				}
				lDonneLe = lNewDonneLe;
				lPourLe = lNewPourLe;
			}
		}
		return T.join("");
	}
	composeInformationsTAF(aTaf, aParam) {
		if (
			!(
				aTaf.duree ||
				aTaf.niveauDifficulte ||
				(!!aTaf.ListeThemes && aTaf.ListeThemes.count())
			)
		) {
			return "";
		}
		const T = [];
		T.push('<div class="info-taf-contain detailles flex-wrap">');
		if (aParam && aParam.avecDetailTAF) {
			if (aTaf.nomPublic) {
				T.push(
					'<div class="items-contain">',
					'<span class="fix-bloc Image_TAF_Public" aria-hidden="true"></span>',
					'<span class="fluid-bloc">',
					aTaf.pourTousLesEleves
						? aTaf.nomPublic
						: ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.TAFARendre.eleves",
								[aTaf.nbrEleves],
							),
					"</span>",
					"</div>",
				);
			}
			if (aTaf.avecRendu) {
				T.push(this.getInfoTAFRendu(aTaf.getNumero(), aTaf, aParam.nom));
			}
		}
		if (aTaf.duree) {
			const lFormatMin = aTaf.duree > 60 ? "%mm" : "%xm";
			const lStrDuree = ObjetDate_1.GDate.formatDureeEnMillisecondes(
				aTaf.duree * 60 * 1000,
				aTaf.duree > 60 ? "%xh%sh" + lFormatMin : lFormatMin + "mn",
			);
			T.push(
				'<div class="items-contain" title="',
				ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.DureeEstimee"),
				'">',
				'<span class="fix-bloc Image_TAF_Duree" aria-hidden="true"></span>',
				'<span class="fluid-bloc">',
				lStrDuree,
				"</span>",
				"</div>",
			);
		}
		if (aTaf.niveauDifficulte) {
			T.push(
				'<div class="items-contain" title="',
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.NiveauDifficulte",
				),
				'">',
				'<span class="fix-bloc Image_TAF_Niveau" aria-hidden="true"></span>',
				'<span class="fluid-bloc">',
				TypeNiveauDifficulte_1.TypeNiveauDifficulteUtil.typeToStr(
					aTaf.niveauDifficulte,
				),
				"</span>",
				"</div>",
			);
		}
		T.push("</div>");
		if (!!aTaf.ListeThemes && aTaf.ListeThemes.count()) {
			T.push(
				'<div class="theme-contain">',
				ObjetTraduction_1.GTraductions.getValeur("Themes"),
				" : <span>",
				aTaf.ListeThemes.getTableauLibelles().join(", "),
				"</span></div>",
			);
		}
		return T.join("");
	}
	surSupprimer(aNumeroTAF) {
		const lFichier = ObjetElement_1.ObjetElement.create();
		const lListeFichiers = new ObjetListeElements_1.ObjetListeElements();
		lListeFichiers.addElement(lFichier, 0);
		lFichier.TAF = new ObjetElement_1.ObjetElement("", aNumeroTAF);
		lFichier.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
		new ObjetRequeteSaisieTAFARendreEleve_1.ObjetRequeteSaisieTAFARendreEleve(
			this,
			this.actionSurRequeteSaisieTAFARendreEleve,
		).lancerRequete(lListeFichiers);
	}
	actionSurRequeteSaisieTAFARendreEleve() {
		this.callback.appel();
	}
	surSurvol(aElement, aSurSurvol, aAvecSouligne) {
		if (aSurSurvol) {
			ObjetHtml_1.GHtml.setClass(
				aElement,
				"InlineBlock AlignementMilieuVertical LienAccueil AvecMain Souligne",
			);
		} else {
			ObjetHtml_1.GHtml.setClass(
				aElement,
				"InlineBlock AlignementMilieuVertical LienAccueil AvecMain" +
					(aAvecSouligne ? " Souligne" : ""),
			);
		}
	}
	execFicheSelecFile(aTaf) {
		this._executerDepotFichierPourTAF(aTaf);
	}
	_executerDepotFichierPourTAF(aTaf) {
		if (
			TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduMedia(aTaf.genreRendu)
		) {
			this.ouvrirFenetreCreation(aTaf);
		} else {
			this._executerDepotFichier(aTaf);
		}
	}
	ouvrirFenetreCreation(aTaf) {
		const lTabActions = [];
		lTabActions.push({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"EnregistrementAudio.record",
			),
			icon: "icon_microphone",
			event() {
				this._executerDepotMedia(aTaf);
			},
			class: "bg-orange-claire",
		});
		lTabActions.push({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"EnregistrementAudio.deposerExistant",
			),
			icon: "icon_folder_open",
			selecFile: true,
			optionsSelecFile: this._getOptionsSelecFile(),
			event(aParamsInput) {
				if (!!aParamsInput && !!aParamsInput.eltFichier) {
					UtilitaireAudio_1.UtilitaireAudio.estFichierAudioValide(
						aParamsInput.eltFichier,
					).then((aResult) => {
						if (aResult) {
							const lParametres = { numero: aTaf.getNumero() };
							this._evenementInputFile(aParamsInput, lParametres);
						} else {
							UtilitaireAudio_1.UtilitaireAudio.messageErreurFormat(
								aParamsInput.eltFichier,
							);
						}
					});
				}
			},
			class: "bg-orange-claire",
		});
		ObjetFenetre_ActionContextuelle_1.ObjetFenetre_ActionContextuelle.ouvrir(
			lTabActions,
			{ pere: this },
		);
	}
	_executerDepotFichier(aTaf) {
		let lLibelle = "";
		if (aTaf && aTaf.matiere) {
			lLibelle = aTaf.matiere.getLibelle();
		} else if (aTaf && aTaf.Matiere) {
			lLibelle = aTaf.Matiere.getLibelle();
		}
		if (aTaf && aTaf.pourLe) {
			lLibelle +=
				" - " +
				(ObjetDate_1.GDate.estDateParticulier(aTaf.pourLe)
					? ObjetTraduction_1.GTraductions.getValeur("accueil.pour").ucfirst()
					: ObjetTraduction_1.GTraductions.getValeur(
							"accueil.pourle",
						).ucfirst()) +
				" " +
				ObjetDate_1.GDate.formatDate(aTaf.pourLe, "[" + "%JJJJ %J %MMM" + "]");
		}
		const lThis = this;
		const lNumeroTAF = aTaf.getNumero();
		const lObjetFenetreAjoutMultiple =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_UploadFichiers_1.ObjetFenetre_UploadFichiers,
				{
					pere: this,
					evenement: function (aGenreBouton, aListeFichiers) {
						if (aGenreBouton === Enumere_Action_1.EGenreAction.Valider) {
							if (!!aListeFichiers && aListeFichiers.count() > 0) {
								const lSeulFichier = aListeFichiers.getPremierElement();
								lSeulFichier.TAF = new ObjetElement_1.ObjetElement(
									"",
									lNumeroTAF,
								);
								new ObjetRequeteSaisieTAFARendreEleve_1.ObjetRequeteSaisieTAFARendreEleve(
									lThis,
									lThis.actionSurRequeteSaisieTAFARendreEleve,
								)
									.addUpload({ listeFichiers: aListeFichiers })
									.lancerRequete(aListeFichiers);
							}
						}
						lObjetFenetreAjoutMultiple.fermer();
					},
				},
			);
		lObjetFenetreAjoutMultiple.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.TAFARendre.Eleve.DeposerCopie",
			),
		});
		lObjetFenetreAjoutMultiple.setDonnees(
			Enumere_Ressource_1.EGenreRessource.DocumentJoint,
			{
				tailleMaxUploadFichier: (0, AccessApp_1.getApp)().droits.get(
					ObjetDroitsPN_1.TypeDroits.tailleMaxRenduTafEleve,
				),
				libelleContexteFenetre: lLibelle,
				functionGetNomPdfGenere: function () {
					const lLibelleUtilisateur = GEtatUtilisateur.getMembre().getLibelle();
					return (
						lLibelleUtilisateur +
						"_" +
						ObjetDate_1.GDate.formatDate(
							ObjetDate_1.GDate.getDateHeureCourante(),
							"%JJ%MM%AAAA_%hh%mm%ss",
						) +
						".pdf"
					);
				},
			},
		);
		lObjetFenetreAjoutMultiple.afficher();
	}
	utilFicheFileTAF(aInstance, aNumero, aTaf, aParam) {
		let lTaf = aTaf;
		let lListeTaf = aParam.listeTAF;
		if (!lListeTaf && aInstance.donnees) {
			lListeTaf =
				aInstance.donnees.listeTAF ||
				(!!aInstance.donnees.travailAFaire
					? aInstance.donnees.travailAFaire.listeTAF
					: undefined);
		}
		if (lListeTaf) {
			lTaf = lListeTaf.getElementParNumero(aNumero);
		}
		$(aInstance.node).eventValidation(
			function (aTaf, aEvent) {
				aEvent.stopPropagation();
				aInstance._executerDepotFichierPourTAF(aTaf);
			}.bind(aInstance, lTaf),
		);
	}
	composeTAFARendrePourWidget(aTaf, aParam) {
		const H = [];
		if (
			[
				Enumere_Espace_1.EGenreEspace.Eleve,
				Enumere_Espace_1.EGenreEspace.Parent,
				Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
				Enumere_Espace_1.EGenreEspace.Mobile_Parent,
				Enumere_Espace_1.EGenreEspace.PrimEleve,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve,
				Enumere_Espace_1.EGenreEspace.PrimParent,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
				Enumere_Espace_1.EGenreEspace.Accompagnant,
				Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
				Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
				Enumere_Espace_1.EGenreEspace.Tuteur,
				Enumere_Espace_1.EGenreEspace.Mobile_Tuteur,
			].includes(GEtatUtilisateur.GenreEspace) &&
			aTaf.avecRendu
		) {
			const lPeutFaireTAF = [
				Enumere_Espace_1.EGenreEspace.Eleve,
				Enumere_Espace_1.EGenreEspace.PrimEleve,
				Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve,
				Enumere_Espace_1.EGenreEspace.PrimParent,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
			].includes(GEtatUtilisateur.GenreEspace);
			const lPeutFaireActivite = [
				Enumere_Espace_1.EGenreEspace.Eleve,
				Enumere_Espace_1.EGenreEspace.PrimEleve,
				Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve,
			].includes(GEtatUtilisateur.GenreEspace);
			const lEstActivite =
				aTaf.getGenre() ===
				TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Activite;
			const lPeutFaire =
				(lPeutFaireTAF && !lEstActivite) ||
				(lPeutFaireActivite && lEstActivite);
			H.push('<div class="taf-btn-conteneur flex-center">');
			switch (aTaf.genreRendu) {
				case TypeGenreRenduTAF_1.TypeGenreRenduTAF.GRTAF_RenduPapier:
					H.push(
						'<span class="as-info-light',
						aTaf.TAFFait ? " done" : "",
						'">',
						TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.getLibelleDeposer(
							aTaf.genreRendu,
						),
						"</span>",
					);
					break;
				case TypeGenreRenduTAF_1.TypeGenreRenduTAF.GRTAF_RenduPronote:
				case TypeGenreRenduTAF_1.TypeGenreRenduTAF
					.GRTAF_RenduPronoteEnregistrementAudio: {
					if (aTaf.peuRendre && aTaf.dateReport) {
						const lClass = ["m-right-l", "taille-s"];
						H.push(
							`<span class="${lClass.join(" ")}">${ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.TAFARendre.Eleve.ProlongeJusquAu", [ObjetDate_1.GDate.formatDate(aTaf.dateReport, "%JJJ %JJ/%MM")])}</span>`,
						);
					}
					if (
						!aTaf.peuRendre &&
						aTaf.documentRendu &&
						aTaf.dateRendu &&
						ObjetDate_1.GDate.estDateJourAvant(aTaf.PourLe, aTaf.dateRendu)
					) {
						H.push(
							`<span class="m-right-l taille-s">${ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.TAFARendre.Eleve.DepotEnRetard")}</span>`,
						);
					}
					if (aTaf.peuRendre && !aTaf.documentRendu) {
						const lLibelle =
							TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.getLibelleDeposer(
								aTaf.genreRendu,
								lPeutFaire,
							);
						if (lPeutFaire) {
							const lIconEnregistrer =
								TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduMedia(
									aTaf.genreRendu,
								)
									? '<i class="icon_microphone EspaceDroit" role="presentation"></i>'
									: "";
							H.push(
								IE.jsx.str(
									"a",
									{
										role: "button",
										tabindex: "0",
										id: this.getIdTAFARendre(aTaf),
										"ie-node": this.jsxNodeUtilFicheFileTaf.bind(this, aTaf),
										class: ["as-cta", "rendu-pn", "fix-bloc"],
									},
									lIconEnregistrer,
									" ",
									lLibelle,
								),
							);
						} else {
							H.push(
								'<span class="as-info-light',
								aTaf.TAFFait ? " done" : "",
								'">',
								lLibelle,
								"</span>",
							);
						}
					}
					if (aTaf.documentRendu) {
						let lIEModelChips = null;
						if (aTaf.peuRendre && lPeutFaire) {
							lIEModelChips = this._getIEModelChipsCopieDeposeeEleve(
								aTaf,
								aParam,
							);
						}
						if (
							TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduMedia(
								aTaf.genreRendu,
							)
						) {
							const lIEModelAudio = this._getIEModelChipsCopieJouerSon(
								aTaf,
								aParam,
							);
							const lUrl = ObjetChaine_1.GChaine.creerUrlBruteLienExterne(
								aTaf.documentRendu,
							);
							H.push(
								UtilitaireAudio_1.UtilitaireAudio.construitChipsAudio({
									libelle:
										TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.getLibelleConsultation(
											aTaf.genreRendu,
										),
									url: lUrl,
									ieModel: lIEModelAudio,
									argsIEModel: [aTaf.getNumero(), aTaf.peuRendre && lPeutFaire],
									idAudio: aTaf.getNumero(),
									estLien: true,
								}),
							);
						} else {
							H.push(
								ObjetChaine_1.GChaine.composerUrlLienExterne({
									documentJoint: aTaf.documentRendu,
									genreRessource:
										TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
											.TAFRenduEleve,
									libelleEcran:
										TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.getLibelleConsultation(
											aTaf.genreRendu,
										),
									ieModelChips: lIEModelChips,
									argsIEModel: [aTaf.getNumero()],
								}),
							);
						}
					}
					const lEstAvecUneCorrection =
						!!aTaf.documentCorrige || !!aTaf.commentaireCorrige;
					if (lEstAvecUneCorrection) {
						H.push('<div style="padding-left:0.4rem">');
						const lContientQueLaCopieCorrigee =
							!!aTaf.documentCorrige && !aTaf.commentaireCorrige;
						if (lContientQueLaCopieCorrigee) {
							H.push(
								ObjetChaine_1.GChaine.composerUrlLienExterne({
									documentJoint: aTaf.documentCorrige,
									genreRessource:
										TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
											.TAFCorrigeRenduEleve,
									libelleEcran: ObjetTraduction_1.GTraductions.getValeur(
										"CahierDeTexte.TAFARendre.Eleve.CorrectionDeLEnseignant",
									),
								}),
							);
						} else {
							H.push(
								"<ie-chips ",
								this._composeIEModelChipsOuvrirFenetreCorrectionTAF(
									aTaf,
									aParam,
								),
								">",
								ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.TAFARendre.Eleve.CorrectionDeLEnseignant",
								),
								"</ie-chips>",
							);
						}
						H.push("</div>");
					}
					break;
				}
				case TypeGenreRenduTAF_1.TypeGenreRenduTAF.GRTAF_RenduKiosque:
					if (aTaf.peuRendre && !aTaf.documentRendu) {
						if (
							aTaf.avecUrlAppliMobile &&
							[
								Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve,
								Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
								Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
							].includes(GEtatUtilisateur.GenreEspace)
						) {
							H.push(
								"<div>",
								ObjetChaine_1.GChaine.composerUrlLienExterne({
									documentJoint: aTaf,
									iconeOverride: "icon_th_large",
									infoSupp: { universalLink: true },
									libelleEcran: ObjetTraduction_1.GTraductions.getValeur(
										"CahierDeTexte.TAFARendre.ACompleterEditeurAppli",
									),
									title: aTaf.titreKiosque || "",
								}),
								"</div>",
							);
						}
						const lTrad =
							TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.getLibelleDeposer(
								aTaf.genreRendu,
								[
									Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve,
									Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
									Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
									Enumere_Espace_1.EGenreEspace.PrimParent,
								].includes(GEtatUtilisateur.GenreEspace),
							);
						H.push(
							"<div>",
							ObjetChaine_1.GChaine.composerUrlLienExterne({
								documentJoint: aTaf,
								iconeOverride: "icon_book",
								libelleEcran: lTrad,
								title: aTaf.titreKiosque || "",
							}),
							"</div>",
						);
					}
					if (aTaf.documentRendu) {
						let lIEModelChipsKiosque = null;
						if (aTaf.peuRendre && lPeutFaire) {
							lIEModelChipsKiosque = this._getIEModelChipsCopieDeposeeEleve(
								aTaf,
								aParam,
							);
						}
						H.push(
							'<div class="InlineBlock AlignementMilieuVertical">',
							ObjetChaine_1.GChaine.composerUrlLienExterne({
								documentJoint: aTaf.documentRendu,
								genreRessource:
									TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
										.TAFRenduEleve,
								libelle:
									TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.getLibelleConsultation(
										aTaf.genreRendu,
										lPeutFaire,
									),
								ieModelChips: lIEModelChipsKiosque,
								argsIEModel: [aTaf.getNumero()],
							}),
							"</div>",
						);
					}
					if (aTaf.peuRendre && aTaf.documentRendu) {
						if (lPeutFaire) {
							H.push(
								'<div class="p-left">',
								ObjetChaine_1.GChaine.composerUrlLienExterne({
									documentJoint: aTaf,
									libelleEcran: ObjetTraduction_1.GTraductions.getValeur(
										"CahierDeTexte.TAFARendre.Eleve.RepondreANouveau",
									),
									title: aTaf.titreKiosque || "",
								}),
								"</div>",
							);
						}
					}
					break;
			}
			H.push("</div>");
		}
		return H.join("");
	}
	getListeDonneesBrute(aParam) {
		if (
			aParam.modeAffichage ===
			Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
				.TravailAFaire
		) {
			if (aParam.avecDS && aParam.listeDS) {
				aParam.listeDS.parcourir((D) => {
					D.estUnDS = true;
					return true;
				});
				if (aParam.avecTAF) {
					return new ObjetListeElements_1.ObjetListeElements()
						.add(aParam.listeTAF)
						.add(aParam.listeDS);
				} else {
					return aParam.listeDS;
				}
			} else {
				return aParam.avecTAF
					? aParam.listeTAF
					: new ObjetListeElements_1.ObjetListeElements();
			}
		} else {
			return aParam.listeCDT;
		}
	}
	_getListeFusionnee(aMatieres, aDonnees, aAvecMatieresVides) {
		let lMatiere;
		let lDateCourante = null;
		function _filtrerParMatiereEtDate(aElt) {
			let lResult = false;
			if (
				aElt.getNumero() === lMatiere &&
				ObjetDate_1.GDate.estJourEgal(aElt.Date, lDateCourante)
			) {
				aElt.estTraite = true;
				lResult = true;
			}
			return lResult;
		}
		function _filtrerDonneesParDateNonTraite(aElt) {
			return (
				!aElt.estTraite &&
				ObjetDate_1.GDate.estJourEgal(aElt.Date, lDateCourante)
			);
		}
		let lMatiereCourante;
		let lListeMatieresDuJour = [];
		let lDonneesNonTraitees;
		const lResult = new ObjetListeElements_1.ObjetListeElements();
		for (let i = 0, lNbr = aMatieres.count(); i < lNbr; i++) {
			let lElt = aMatieres.get(i);
			const lDate = lElt.date;
			lMatiere = lElt.Matiere.getNumero();
			if (!ObjetDate_1.GDate.estJourEgal(lDate, lDateCourante)) {
				let n = 0;
				while (
					ObjetDate_1.GDate.estDateJourAvant(lDateCourante, lDate) &&
					!!lDateCourante &&
					n < 7
				) {
					lDonneesNonTraitees = aDonnees.getListeElements(
						_filtrerDonneesParDateNonTraite,
					);
					if (lDonneesNonTraitees.count() > 0) {
						lResult.add(lDonneesNonTraitees);
					}
					lDateCourante = ObjetDate_1.GDate.getJourSuivant(lDateCourante);
					n++;
				}
				lDateCourante = lDate;
				lMatiereCourante = null;
				lListeMatieresDuJour = [];
			}
			if (lMatiere !== lMatiereCourante) {
				lMatiereCourante = lMatiere;
				if (!lListeMatieresDuJour.includes(lMatiere)) {
					lListeMatieresDuJour.push(lMatiere);
					const lDonneeFiltre = aDonnees.getListeElements(
						_filtrerParMatiereEtDate,
					);
					if (lDonneeFiltre.count() === 1) {
						lResult.addElement(lDonneeFiltre.get(0));
					} else {
						if (aAvecMatieresVides) {
							lResult.addElement(
								ObjetElement_1.ObjetElement.create({
									Libelle: lElt.Matiere.Libelle,
									Numero: lElt.Matiere.Numero,
									Genre: lElt.Matiere.Genre,
									Actif: lElt.Matiere.Actif,
									Date: lDateCourante,
									couleurBordure: GCouleur.liste.bordure,
									estUneSuite: false,
									aUneSuite: false,
									CouleurFond: lElt.CouleurFond,
									ressources: new ObjetListeElements_1.ObjetListeElements(),
								}),
							);
						}
					}
				}
			}
		}
		if (!!lDateCourante && !!aDonnees) {
			lDonneesNonTraitees = aDonnees.getListeElements(
				_filtrerDonneesParDateNonTraite,
			);
			if (!!lDonneesNonTraitees && lDonneesNonTraitees.count() > 0) {
				lResult.add(lDonneesNonTraitees);
			}
		}
		return lResult;
	}
	formatDonnees(aParam) {
		let I, lElt, elementRessource, newElement;
		const lModeTAF =
			aParam.modeAffichage ===
			Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
				.TravailAFaire;
		const lListeDonnees = this.getListeDonneesBrute(aParam);
		let lResult = new ObjetListeElements_1.ObjetListeElements();
		let lDate = null;
		let lMatiere = null;
		let lElementPrecedent = null;
		lListeDonnees.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				if (lModeTAF) {
					return D.PourLe;
				}
				return D.Date;
			}),
			ObjetTri_1.ObjetTri.init("Matiere.Libelle"),
			ObjetTri_1.ObjetTri.init((D) => {
				if (lModeTAF && !D.estUnDS) {
					return ObjetDate_1.GDate.getJour(D.DonneLe);
				}
				return null;
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				if (lModeTAF && !D.estUnDS) {
					return D.getGenre();
				}
				return null;
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				if (lModeTAF && !D.estUnDS) {
					return D.getLibelle();
				}
				return null;
			}),
		]);
		lListeDonnees.trier();
		for (I = 0; I < lListeDonnees.count(); I++) {
			lElt = lListeDonnees.get(I);
			if (lModeTAF || (lElt.listeContenus && lElt.listeContenus.count() > 0)) {
				if (
					aParam.estChargeTAF &&
					lElementPrecedent &&
					ObjetDate_1.GDate.estJourEgal(lElementPrecedent.Date, lElt.PourLe) &&
					lElementPrecedent.Libelle === lElt.Matiere.Libelle
				) {
					newElement = lElementPrecedent;
				} else {
					newElement = new ObjetElement_1.ObjetElement(
						lElt.Matiere.Libelle,
						lElt.Matiere.Numero,
						lElt.Matiere.Genre,
						lElt.Matiere.Position,
						lElt.Matiere.Actif,
					);
					newElement.genreBloc = lModeTAF
						? Enumere_Bloc_1.EGenreBloc.TravailAFaire
						: Enumere_Bloc_1.EGenreBloc.ContenuDeCours;
					newElement.Date = lModeTAF ? lElt.PourLe : lElt.Date;
					newElement.DateDebut = newElement.Date;
					newElement.couleurBordure = GCouleur.liste.bordure;
					newElement.estUneSuite = false;
					newElement.aUneSuite = false;
					newElement.CouleurFond = lElt.CouleurFond;
					if (lModeTAF) {
						newElement.listeGroupes = MethodesObjet_1.MethodesObjet.dupliquer(
							lElt.listeGroupes,
						);
					}
				}
				elementRessource = new ObjetElement_1.ObjetElement(
					lModeTAF
						? lElt.estUnDS
							? lElt.horaires
							: lElt.Libelle
						: lElt.listeContenus.getLibelle(0),
					lElt.Numero,
					lElt.Genre,
					lElt.Position,
					lElt.Actif,
				);
				elementRessource.genreMatiere = lElt.Matiere.Genre;
				elementRessource.elementOriginal = lElt;
				if (lModeTAF) {
					elementRessource.estUnDS = lElt.estUnDS;
					if (lElt.estUnDS) {
						elementRessource.estDevoir = lElt.estDevoir;
						elementRessource.estEval = lElt.estEval;
					}
					elementRessource.DonneLe = lElt.DonneLe;
					elementRessource.nomPublic = lElt.nomPublic;
				} else {
					for (let j = 0, lNbr = lElt.listeContenus.count(); j < lNbr; j++) {
						let lContenu = lElt.listeContenus.get(j);
						if (
							lContenu.categorie &&
							lContenu.categorie.getGenre() ===
								TypeOrigineCreationCategorieCahierDeTexte_1
									.TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir
						) {
							elementRessource.estUnDS = true;
						}
					}
				}
				if (
					lModeTAF &&
					!aParam.sansRegroupementTAF &&
					lDate &&
					ObjetDate_1.GDate.estJourEgal(lDate, newElement.Date) &&
					lMatiere === newElement.Libelle
				) {
					lElementPrecedent.ressources.addElement(elementRessource);
					lElementPrecedent.ressources.setTri([
						ObjetTri_1.ObjetTri.init((D) => {
							return !D.estUnDS;
						}),
						ObjetTri_1.ObjetTri.init("DonneLe"),
						ObjetTri_1.ObjetTri.init("genreMatiere"),
					]);
					lElementPrecedent.ressources.trier();
				} else {
					newElement.ressources = new ObjetListeElements_1.ObjetListeElements();
					newElement.ressources.addElement(elementRessource);
					lResult.addElement(
						MethodesObjet_1.MethodesObjet.dupliquer(newElement),
					);
					lElementPrecedent = lResult.get(lResult.count() - 1);
				}
				if (elementRessource.estUnDS) {
					lElementPrecedent.estAvecDS = true;
					lElementPrecedent.estDevoir = lElt.estDevoir;
					lElementPrecedent.estEval = lElt.estEval;
				}
				lDate = newElement.Date;
				lMatiere = newElement.Libelle;
			}
		}
		lResult.setTri([
			ObjetTri_1.ObjetTri.init("Date"),
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		lResult.trier();
		if (lModeTAF && aParam.listeMatieres) {
			const lTri = [
				ObjetTri_1.ObjetTri.init("place"),
				ObjetTri_1.ObjetTri.init((D) => {
					return D.Matiere.getLibelle();
				}),
			];
			aParam.listeMatieres.setTri(lTri);
			aParam.listeMatieres.trier();
			lResult = this._getListeFusionnee(
				aParam.listeMatieres,
				lResult,
				aParam.avecMatieres,
			);
		}
		$.extend(aParam, { listeElements: lResult });
		if (aParam.estChargeTAF) {
			this._apresFormatterDonneesPourAffichage(aParam);
		}
		return lResult;
	}
	composeTitreTAF(aElement, aPourGrille) {
		const T = [];
		T.push(
			'<div class="matiere-contain ',
			!aPourGrille ? "AvecMove" : "",
			'">',
			UtilitaireCDT_1.TUtilitaireCDT.strtMatiere(
				aElement,
				aElement.groupe,
				false,
			),
			"</div>",
		);
		return T.join("");
	}
	composeTitreCDC(aElement, aListeCDT) {
		const T = [];
		const lEtatUtilisateur = (0, AccessApp_1.getApp)().getEtatUtilisateur();
		const lElt = aListeCDT.getElementParNumero(
			aElement.ressources.getNumero(0),
		);
		let lClasseSelectionnee = lEtatUtilisateur.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
		if (!lClasseSelectionnee && lEtatUtilisateur.getMembre()) {
			lClasseSelectionnee = lEtatUtilisateur.getMembre().Classe;
		}
		const lAvecGroupe =
			!!lElt.listeGroupes &&
			lElt.listeGroupes.count() > 0 &&
			!!lElt.listeGroupes.get(0) &&
			lClasseSelectionnee &&
			lClasseSelectionnee.getNumero() !== lElt.listeGroupes.get(0).getNumero();
		T.push(
			'<div class="matiere-contain AvecMove">',
			UtilitaireCDT_1.TUtilitaireCDT.strtMatiere(
				aElement,
				lAvecGroupe ? lElt.listeGroupes : false,
				false,
			),
			"</div>",
			"<div>",
			UtilitaireCDT_1.TUtilitaireCDT.strtDate(aElement.Date),
			"</div>",
		);
		return T.join("");
	}
	_composeSymboleCategorie(aGenre) {
		const T = [];
		T.push(
			'<i class="',
			TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexteUtil.getIcone(
				aGenre,
			),
			'" role="presentation" aria-hidden="true"></i>',
		);
		return T.join("");
	}
	_estAvecCocheTAFFait(aElement) {
		const lAvecERendu =
			TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
				aElement.genreRendu,
			);
		const lEstQCM =
			aElement.executionQCM && aElement.executionQCM.existeNumero();
		if (!this.peuFaireTAF || lEstQCM || lAvecERendu) {
			return false;
		}
		return true;
	}
	_composeCBTAFFait(aElement) {
		if (!this._estAvecCocheTAFFait(aElement)) {
			return "";
		}
		const H = [];
		H.push(
			'<ie-checkbox ie-hint="getHint" ie-model="cbxTAFFait (\'',
			aElement.getNumero(),
			"')\">",
		);
		H.push("</ie-checkbox>");
		return H.join("");
	}
	_composeLabelTAFFait(lElement) {
		const H = [];
		const lTitle =
			!this.peuFaireTAF && lElement.TAFFait
				? ' title="' +
					ObjetTraduction_1.GTraductions.getValeur(
						"accueil.hintParentTravailFait",
						[GEtatUtilisateur.getMembre().getLibelle()],
					) +
					'"'
				: "";
		H.push(
			"<div ",
			lTitle,
			" ie-html=\"labelTAFFait ('",
			lElement.getNumero(),
			"')\"></div>",
		);
		return H.join("");
	}
	getInfoTAFRendu(I, aTaf, aNom) {
		const H = [];
		const lAvecAction = aNom && aTaf && aTaf.avecRendu;
		const lFoncExist = MethodesObjet_1.MethodesObjet.isFunction(
			aNom.surDetailRendu,
		);
		const lAction =
			lAvecAction && lFoncExist
				? ' class="AvecMain LienAccueil" role="link" onclick="' +
					aNom +
					".surDetailRendu (event, '" +
					I +
					"')\""
				: "";
		H.push(
			'<div class="items-contain">',
			"<span>",
			"-",
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.TAFARendre.RenduPar",
			),
			"</span>",
			"<span",
			lAction,
			" >",
			aTaf.nbrRendus + "/" + aTaf.nbrEleves,
			"</span>",
			"</div>",
		);
		return H.join("");
	}
	_getOptionsSelecFile() {
		return {
			maxSize: (0, AccessApp_1.getApp)().droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleMaxRenduTafEleve,
			),
			accept: UtilitaireAudio_1.UtilitaireAudio.getTypeMimeAudio(),
			avecTransformationFlux: false,
		};
	}
	_evenementInputFile(aParamUpload, aParametres) {
		if (
			aParamUpload.eltFichier.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
		) {
			const lListeFichier = new ObjetListeElements_1.ObjetListeElements();
			lListeFichier.addElement(aParamUpload.eltFichier);
			aParamUpload.eltFichier.TAF = new ObjetElement_1.ObjetElement(
				"",
				aParametres.numero,
			);
			new ObjetRequeteSaisieTAFARendreEleve_1.ObjetRequeteSaisieTAFARendreEleve(
				this,
				this.actionSurRequeteSaisieTAFARendreEleve,
			)
				.addUpload({ listeFichiers: lListeFichier })
				.lancerRequete(lListeFichier);
		}
	}
	_executerDepotMedia(aTaf) {
		let lContexte = "";
		const lThis = this;
		const lNumeroTAF = aTaf.getNumero();
		const lFenetreAudio = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_EnregistrementAudioPN_1.ObjetFenetre_EnregistrementAudioPN,
			{
				pere: this,
				evenement: function (aGenreBouton, aParametres) {
					if (
						!!aParametres &&
						!!aParametres.bouton &&
						aParametres.bouton.valider
					) {
						if (
							!!aParametres.listeFichiers &&
							aParametres.listeFichiers.count() > 0
						) {
							const lSeulFichier =
								aParametres.listeFichiers.getPremierElement();
							lSeulFichier.TAF = new ObjetElement_1.ObjetElement(
								"",
								lNumeroTAF,
							);
							new ObjetRequeteSaisieTAFARendreEleve_1.ObjetRequeteSaisieTAFARendreEleve(
								lThis,
								lThis.actionSurRequeteSaisieTAFARendreEleve,
							)
								.addUpload({ listeFichiers: aParametres.listeFichiers })
								.lancerRequete(aParametres.listeFichiers);
						}
					}
				},
			},
		);
		lFenetreAudio.setOptions({
			contexte: lContexte,
			maxLengthAudio:
				TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.getDureeMaxEnregistrementAudio(),
		});
		lFenetreAudio.setDonnees(Enumere_Ressource_1.EGenreRessource.DocumentJoint);
		lFenetreAudio.afficher();
	}
	_getFicheSelecFile(aTaf, aParam) {
		const lThis = this;
		if (aTaf && aTaf.avecRendu) {
			if (!aParam.controleur) {
				return "";
			}
			aParam.controleur.utilFicheFileTAF = function (aNumero) {
				lThis.utilFicheFileTAF.call(this, lThis, aNumero, aTaf, aParam);
			};
			return ObjetHtml_1.GHtml.composeAttr("ie-node", "utilFicheFileTAF", [
				aTaf.getNumero(),
			]);
		}
		return "";
	}
	jsxNodeUtilFicheFileTaf(aTaf, aNode) {
		if (!aTaf.avecRendu) {
			return null;
		}
		$(aNode).eventValidation((aEvent) => {
			aEvent.stopPropagation();
			this._executerDepotFichierPourTAF(aTaf);
		});
	}
	_supprimerFichier(aTaf, aParam) {
		if (aTaf && aTaf.avecRendu) {
			if (!aParam.controleur) {
				return "";
			}
			if (!aParam.controleur.supprimerFichier) {
				aParam.controleur.supprimerFichier = function (aNumero) {
					$(this.node)
						.eventValidation((aNumero) => {
							this.surSupprimer(aNumero);
						})
						.bind(this, aNumero);
				};
			}
			return ObjetHtml_1.GHtml.composeAttr("ie-node", "supprimerFichier", [
				aTaf.getNumero(),
			]);
		}
		return "";
	}
	_composeIEModelChipsOuvrirFenetreCorrectionTAF(aTaf, aParam) {
		const H = [];
		if (!!aTaf && (!!aTaf.documentCorrige || !!aTaf.commentaireCorrige)) {
			if (!aParam.controleur) {
				return "";
			}
			if (!aParam.listeTAF) {
				return "";
			}
			if (!aParam.controleur.chipsOuvrirFenetreCorrectionTAF) {
				const lThis = this;
				aParam.controleur.chipsOuvrirFenetreCorrectionTAF = {
					event: function (aNumeroTaf) {
						const lListeTaf = aParam.listeTAF;
						const lTaf = lListeTaf.getElementParNumero(aNumeroTaf);
						if (!!lTaf) {
							const lFenetreCorrectionTaf =
								ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
									ObjetFenetre_CorrectionTaf_1.ObjetFenetre_CorrectionTaf,
									{ pere: lThis },
								);
							lFenetreCorrectionTaf.setTAF(lTaf);
							lFenetreCorrectionTaf.afficher();
						}
					},
				};
			}
			H.push(
				ObjetHtml_1.GHtml.composeAttr(
					"ie-model",
					"chipsOuvrirFenetreCorrectionTAF",
					[aTaf.getNumero()],
				),
			);
		}
		return H.join("");
	}
	_getIEModelChipsCopieDeposeeEleve(aTaf, aParam) {
		let lNomIEModel = null;
		if (!!aTaf) {
			if (!aParam.controleur) {
				return "";
			}
			if (!aParam.listeTAF) {
				return "";
			}
			if (!aParam.controleur.chipsCopieDeposeeEleve) {
				const lThis = this;
				aParam.controleur.chipsCopieDeposeeEleve = {
					eventBtn: function (aNumeroTaf) {
						(0, AccessApp_1.getApp)()
							.getMessage()
							.afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"TAFEtContenu.suppressionCopieEleve",
								),
								callback: function (aGenreAction) {
									if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
										lThis.surSupprimer(aNumeroTaf);
									}
								},
							});
					},
				};
			}
			lNomIEModel = "chipsCopieDeposeeEleve";
		}
		return lNomIEModel;
	}
	_getIEModelChipsCopieJouerSon(aTaf, aParam) {
		let lNomIEModel = null;
		if (!!aTaf) {
			if (!aParam.controleur) {
				return "";
			}
			if (!aParam.listeTAF) {
				return "";
			}
			const lStrCtrlAudio = "chipsAudio";
			if (!(lStrCtrlAudio in aParam.controleur)) {
				const lThis = this;
				aParam.controleur[lStrCtrlAudio] = {
					event: function () {
						UtilitaireAudio_1.UtilitaireAudio.executeClicChipsParDefaut(
							this.node,
						);
					},
					eventBtn: function (aNumeroTaf) {
						(0, AccessApp_1.getApp)()
							.getMessage()
							.afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"TAFEtContenu.suppressionCopieEleve",
								),
								callback: function (aGenreAction) {
									if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
										lThis.surSupprimer(aNumeroTaf);
									}
								},
							});
					},
					node: function () {
						const $chips = $(this.node);
						const $audio = $chips.find("audio");
						$audio.on("play", () => {
							$chips
								.removeClass(UtilitaireAudio_1.UtilitaireAudio.IconeLecture)
								.addClass(UtilitaireAudio_1.UtilitaireAudio.IconeStop);
						});
						$audio.on("pause", () => {
							$chips
								.removeClass(UtilitaireAudio_1.UtilitaireAudio.IconeStop)
								.addClass(UtilitaireAudio_1.UtilitaireAudio.IconeLecture);
						});
					},
					getOptions: function (aNumeroTaf, aAvecBtnSuppr) {
						return { avecBtn: aAvecBtnSuppr };
					},
				};
			}
			lNomIEModel = lStrCtrlAudio;
		}
		return lNomIEModel;
	}
	getIdTAFARendre(aTaf) {
		return this.idTAFARendre + "_" + aTaf.getNumero();
	}
	_apresFormatterDonneesPourAffichage(aParam) {
		let lElt;
		let T = [];
		for (let i = 0, lNbr = aParam.listeElements.count(); i < lNbr; i++) {
			lElt = aParam.listeElements.get(i);
			T = [];
			T.push('<div class="titre-matiere-contain">');
			T.push(
				'<div class="matiere-contain fluid-bloc">',
				UtilitaireCDT_1.TUtilitaireCDT.strtMatiere(lElt, null, false),
				"</div>",
			);
			T.push(
				`${lElt.estDevoir ? `<div class="icon-contain" aria-label="${ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.hintEstDS")}">${this._composeSymboleCategorie(TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir)}</div>` : lElt.estEval ? `<div  class="icon-contain" aria-label="${ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.hintEstEvaluation")}">${this._composeSymboleCategorie(TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation)}</div>` : ""}`,
			);
			T.push("</div>");
			if (aParam.avecDonneeLe) {
				let lRessource;
				let lDonneeLeCourant = null;
				for (let j = 0, lNbr2 = lElt.ressources.count(); j < lNbr2; j++) {
					lRessource = lElt.ressources.get(j);
					if (!lRessource.estUnDS && lRessource.DonneLe !== lDonneeLeCourant) {
						lDonneeLeCourant = lRessource.DonneLe;
						const lNbJours = ObjetDate_1.GDate.getDifferenceJours(
							lElt.Date,
							lDonneeLeCourant,
						);
						const lStrJours = (
							lNbJours > 1
								? ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.jours")
								: ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.jour")
						).toLowerCase();
						T.push("<ul><li>");
						T.push(
							"<span>" +
								ObjetTraduction_1.GTraductions.getValeur(
									"TAFEtContenu.donneLe",
								) +
								ObjetDate_1.GDate.formatDate(lDonneeLeCourant, " %JJ/%MM") +
								"</span>",
						);
						T.push("<span>" + " [" + lNbJours + " " + lStrJours + "]</span>");
						T.push("</li></ul>");
					}
				}
			}
			lElt.html = [];
			lElt.html[0] = T.join("");
			const lAffTAF =
				aParam.modeAffichage ===
				Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
					.TravailAFaire;
			T = [];
			T.push('<div class="fluid-bloc p-y">');
			T.push(
				lAffTAF
					? this.composeTitreTAF(lElt, true)
					: this.composeTitreCDC(lElt, aParam.listeCDT),
			);
			T.push(
				lAffTAF
					? this.composeTAF(lElt, aParam.listeTAF, {
							avecDetailTAF: aParam.avecDetailTAF,
							nom: aParam.nom,
							listeDS: aParam.listeDS,
							controleur: aParam.controleur,
						})
					: this.composeCDC(
							aParam.listeCDT.getElementParNumero(lElt.ressources.getNumero(0)),
							aParam,
						),
			);
			T.push("</div>");
			lElt.html[1] = T.join("");
		}
	}
	jsxSyntheseVocaleActivite(aActivite) {
		var _a;
		const H = [];
		H.push(
			(_a =
				aActivite === null || aActivite === void 0
					? void 0
					: aActivite.matiere) === null || _a === void 0
				? void 0
				: _a.getLibelle(),
		);
		if (aActivite.DonneLe) {
			H.push(
				ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.donneLe"),
				ObjetDate_1.GDate.formatDate(aActivite.donneLe, " %J %MMM"),
			);
		}
		if (aActivite.consigne) {
			H.push(
				ObjetChaine_1.GChaine.supprimerBalisesHtml(
					aActivite.consigne.toString(),
				),
			);
		}
		return { text: H.join(" ") };
	}
}
exports.ObjetUtilitaireCahierDeTexte = ObjetUtilitaireCahierDeTexte;
