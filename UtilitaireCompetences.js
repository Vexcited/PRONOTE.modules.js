exports.TUtilitaireCompetences = TUtilitaireCompetences;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetHint_1 = require("ObjetHint");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const TypeNote_1 = require("TypeNote");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetRequeteCalculAutoNotesSelonCompetences_1 = require("ObjetRequeteCalculAutoNotesSelonCompetences");
const TypeGenreValidationCompetence_1 = require("TypeGenreValidationCompetence");
const TypeModeValidationAuto_1 = require("TypeModeValidationAuto");
const TypePositionnement_1 = require("TypePositionnement");
const TypeNiveauEquivalenceCE_1 = require("TypeNiveauEquivalenceCE");
const ObjetFenetre_ValidationAutoCompetence_1 = require("ObjetFenetre_ValidationAutoCompetence");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_PreferencesCalculPositionnement_1 = require("ObjetFenetre_PreferencesCalculPositionnement");
const ObjetFenetre_CalculAutoPositionnement_1 = require("ObjetFenetre_CalculAutoPositionnement");
const ObjetJSON_1 = require("ObjetJSON");
const AccessApp_1 = require("AccessApp");
function TUtilitaireCompetences() {}
TUtilitaireCompetences.ClasseIconeJaugeChronologique = "icon_time";
TUtilitaireCompetences.ClasseIconeJaugeParNiveau = "icon_diagramme";
TUtilitaireCompetences.construitInfoActiviteLangagiere = function (
	aParams = {},
) {
	const lAvecLibelle = aParams.avecLibelle || false;
	const lAvecHint = !!aParams.avecHint;
	const lStr = ObjetTraduction_1.GTraductions.getValeur(
		"competences.LegendeCompetenceLangagiere",
	);
	const H = [];
	H.push(
		'<i style="color: ',
		(0, AccessApp_1.getApp)().getObjetParametres().general
			.couleurActiviteLangagiere,
		';" class="icon_star" role="presentation"',
	);
	if (lAvecHint) {
		H.push(' title="', ObjetChaine_1.GChaine.toTitle(lStr), '"');
	}
	H.push("></i>");
	if (lAvecLibelle) {
		H.push('<span class="MargeGauche">', lStr, "</span>");
	}
	return H.join("");
};
TUtilitaireCompetences.getListeNiveauxDAcquisitionsPourMenu = function (
	aParams,
) {
	const lListeEvaluations = new ObjetListeElements_1.ObjetListeElements();
	const lObjetParametres = (0, AccessApp_1.getApp)().getObjetParametres();
	const lPourPositionnement =
		aParams.genrePositionnement !== undefined &&
		aParams.genrePositionnement !== null;
	for (let I = 0; I < lObjetParametres.listeNiveauxDAcquisitions.count(); I++) {
		let lEvaluation = MethodesObjet_1.MethodesObjet.dupliquer(
			lObjetParametres.listeNiveauxDAcquisitions.get(I),
		);
		lEvaluation.Position =
			Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.ordre().indexOf(
				lEvaluation.getGenre(),
			);
		if (
			lEvaluation.actifPour.contains(aParams.genreChoixValidationCompetence)
		) {
			if (
				aParams.avecDispense ||
				lEvaluation.getGenre() !==
					Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Dispense
			) {
				if (lPourPositionnement) {
					lEvaluation.Libelle =
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getLibellePositionnement(
							{
								niveauDAcquisition: lEvaluation,
								genrePositionnement: aParams.genrePositionnement,
							},
						);
					lEvaluation.image =
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImagePositionnement(
							{
								niveauDAcquisition: lEvaluation,
								genrePositionnement: aParams.genrePositionnement,
							},
						);
				} else {
					lEvaluation.Libelle =
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getLibelle(
							lEvaluation,
						);
					lEvaluation.image =
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
							lEvaluation,
						);
				}
				let lRaccourci = "";
				if (aParams.avecLibelleRaccourci && !!lEvaluation) {
					let lRaccourciTemp;
					if (!lPourPositionnement && !!lEvaluation.raccourci) {
						lRaccourciTemp = lEvaluation.raccourci;
					} else if (
						lPourPositionnement &&
						!!lEvaluation.raccourciPositionnement
					) {
						lRaccourciTemp = lEvaluation.raccourciPositionnement;
					}
					if (lRaccourciTemp && lRaccourciTemp.toUpperCase) {
						lRaccourci = lRaccourciTemp.toUpperCase();
					}
				}
				if (lRaccourci) {
					lEvaluation.tableauLibelles = [lEvaluation.Libelle, lRaccourci];
				}
				lListeEvaluations.addElement(lEvaluation);
			}
		}
	}
	lListeEvaluations.trier();
	if (aParams.avecSelecteurNiveauCalcule) {
		const lSelecteurNivCalcule = new ObjetElement_1.ObjetElement();
		lSelecteurNivCalcule.Libelle = ObjetTraduction_1.GTraductions.getValeur(
			"competences.niveauCalculeEvals",
		);
		lListeEvaluations.insererElement(lSelecteurNivCalcule, 0);
	}
	return lListeEvaluations;
};
TUtilitaireCompetences.getListeNiveauxDAcquisitionsPourCombo = function (
	aParams,
) {
	const lListeEvaluations = new ObjetListeElements_1.ObjetListeElements();
	(0, AccessApp_1.getApp)()
		.getObjetParametres()
		.listeNiveauxDAcquisitions.parcourir((aNiveauGlobal) => {
			let lEvaluation = MethodesObjet_1.MethodesObjet.dupliquer(aNiveauGlobal);
			lEvaluation.Position =
				Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.ordre().indexOf(
					lEvaluation.getGenre(),
				);
			if (!lEvaluation.existeNumero() && aParams.sansLibelleAucun) {
				lEvaluation.Position = 0;
				lEvaluation.Libelle = "";
			}
			if (
				lEvaluation.actifPour.contains(
					aParams.genreChoixValidationCompetence,
				) &&
				(!!aParams.avecDispense ||
					lEvaluation.getGenre() !==
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Dispense)
			) {
				if (lEvaluation.existeNumero()) {
					lEvaluation.libelleHtml =
						'<span style="margin: 0 3px; width:20px; text-align: center; display: inline-block;" >' +
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
							lEvaluation,
						) +
						"</span><span>" +
						lEvaluation.getLibelle() +
						"</span>";
				}
				lListeEvaluations.addElement(lEvaluation);
			}
		});
	lListeEvaluations.trier();
	return lListeEvaluations;
};
TUtilitaireCompetences.getNombrePointsBrevet = function (aNiveauDAcquisition) {
	const lNiveauDAcquisition = (0, AccessApp_1.getApp)()
		.getObjetParametres()
		.listeNiveauxDAcquisitions.getElementParElement(aNiveauDAcquisition);
	if (lNiveauDAcquisition) {
		return Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getNombrePointsBrevet(
			lNiveauDAcquisition,
		);
	}
	return 0;
};
TUtilitaireCompetences.composeJaugeChronologique = function (aParams) {
	const lObjParam = (0, AccessApp_1.getApp)().getObjetParametres();
	let result = "";
	if (aParams.listeNiveaux) {
		const H = [];
		let lSeparateur = "";
		let lNiveau;
		const lEstModeAccessible =
			GParametres.afficherAbbreviationNiveauDAcquisition ||
			GEtatUtilisateur.estAvecCodeCompetences();
		if (lEstModeAccessible) {
			lSeparateur = ", ";
			aParams.listeNiveaux.parcourir((aNiveau) => {
				lNiveau = lObjParam.listeNiveauxDAcquisitions.getElementParGenre(
					aNiveau.getGenre(),
				);
				if (lNiveau.abbreviation) {
					H.push('<div class="InlineBlock">' + lNiveau.abbreviation + "</div>");
				}
			});
		} else {
			let lCouleur;
			let lContenuPastille;
			aParams.listeNiveaux.parcourir((aNiveau) => {
				lNiveau = lObjParam.listeNiveauxDAcquisitions.getElementParGenre(
					aNiveau.getGenre(),
				);
				lCouleur =
					Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getCouleur(
						lNiveau,
					);
				lContenuPastille = "&nbsp;";
				if (aParams.afficherValeurPourNonRempli && !lNiveau.existeNumero()) {
					lContenuPastille =
						!!lNiveau.abbreviation && lNiveau.abbreviation.length > 0
							? lNiveau.abbreviation.charAt(0)
							: "&nbsp;";
				}
				H.push(
					'<div class="InlineBlock AlignementMilieu"',
					' style="width: 6px;',
					"border: ",
					aParams.pourImpression
						? "3px solid " + lCouleur + ";"
						: "1px solid black;",
					"background-color:",
					lCouleur,
					";",
					"color: black;",
					'"',
					">",
					aParams.pourImpression ? "" : lContenuPastille,
					"</div>",
				);
			});
		}
		result = H.join(lSeparateur);
	}
	if (result.length > 0 && !!aParams.hint) {
		result = IE.jsx.str(
			"div",
			{ "ie-tooltiplabel": aParams.hint, style: { display: "inline-flex" } },
			result,
		);
	}
	return result;
};
function _composeJaugeParNiveauxOuPastilles(aParams, aEstJaugeParPastilles) {
	const H = [];
	const lSeparateur = "";
	if (aParams.listeNiveaux) {
		const lEstModeAccessible =
			GParametres.afficherAbbreviationNiveauDAcquisition ||
			GEtatUtilisateur.estAvecCodeCompetences();
		let lTotalNiveaux = 0;
		const lInfosNiveauParNiveaux = [];
		let lCouleur, lImage, lNombre, lNiveauParam;
		const lListeGlobaleNiveaux = MethodesObjet_1.MethodesObjet.dupliquer(
			(0, AccessApp_1.getApp)().getObjetParametres().listeNiveauxDAcquisitions,
		);
		lListeGlobaleNiveaux.setTri([ObjetTri_1.ObjetTri.init("positionJauge")]);
		lListeGlobaleNiveaux.trier();
		const _acceptNiveau = function (aNiveau) {
			let result = false;
			if (aNiveau.existeNumero()) {
				result =
					!aParams.listeGenreNiveauxIgnores ||
					aParams.listeGenreNiveauxIgnores.indexOf(aNiveau.getGenre()) === -1;
			}
			return result;
		};
		lListeGlobaleNiveaux.parcourir((aNiveauGlobal) => {
			if (_acceptNiveau(aNiveauGlobal)) {
				lCouleur =
					Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getCouleur(
						aNiveauGlobal,
					);
				lImage =
					Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
						aNiveauGlobal,
						{ avecTitle: !aParams.hint },
					);
				lNombre = 0;
				lNiveauParam = aParams.listeNiveaux.getElementParGenre(
					aNiveauGlobal.getGenre(),
				);
				if (!!lNiveauParam && lNiveauParam.nbr) {
					lNombre += lNiveauParam.nbr;
				}
				lTotalNiveaux += lNombre;
				lInfosNiveauParNiveaux.push({
					nombre: lNombre,
					couleur: lCouleur,
					image: lImage,
				});
			}
		});
		if (lTotalNiveaux > 0) {
			H.push(
				IE.jsx.str(
					"table",
					{
						class: "full-width",
						"ie-tooltiplabel": aParams.hint,
						role: aParams.hint ? "img" : "presentation",
						"aria-hidden": aParams.hint ? false : "true",
					},
					IE.jsx.str("tr", null, (aTab) => {
						let lInfoNiveau, lWidthCellule;
						for (let i = 0; i < lInfosNiveauParNiveaux.length; i++) {
							lInfoNiveau = lInfosNiveauParNiveaux[i];
							if (lEstModeAccessible || aEstJaugeParPastilles) {
								lWidthCellule = 100 / lInfosNiveauParNiveaux.length;
								aTab.push(
									'<td class="AlignementDroit EspaceDroit" style=width:',
									lWidthCellule,
									'%;">',
								);
								if (lInfoNiveau.nombre) {
									aTab.push(
										'<div class="InlineBlock" style="margin-right: 5px;">',
										lInfoNiveau.nombre,
										'</div><div class="InlineBlock">',
										lInfoNiveau.image,
										"</div></div>",
									);
								} else {
									aTab.push("&nbsp;");
								}
								aTab.push("</td>");
							} else {
								if (lInfoNiveau.nombre > 0) {
									lWidthCellule = (lInfoNiveau.nombre * 100) / lTotalNiveaux;
									aTab.push(
										'<td style="border:',
										aParams.pourImpression
											? "3px solid " + lInfoNiveau.couleur + ";"
											: "1px solid black;",
										"background-color:",
										lInfoNiveau.couleur,
										";",
										"width:",
										lWidthCellule,
										'%;"',
										">",
										aParams.pourImpression ? "" : "&nbsp;",
										"</td>",
									);
								}
							}
						}
					}),
				),
			);
		}
	}
	return H.join(lSeparateur);
}
TUtilitaireCompetences.composeJaugeParNiveaux = function (aParams) {
	return _composeJaugeParNiveauxOuPastilles(aParams, false);
};
TUtilitaireCompetences.composeJaugeParPastilles = function (aParams) {
	return _composeJaugeParNiveauxOuPastilles(aParams, true);
};
TUtilitaireCompetences.existeBarreNiveauxDAcquisitionsDePiliers = function (
	aListePiliers,
) {
	if (!!aListePiliers) {
		for (let i = 0; i < aListePiliers.count(); i++) {
			let lPilier = aListePiliers.get(i);
			if (lPilier) {
				if (
					this.existeBarreNiveauxDAcquisitionsDeNiveaux(lPilier.listeNiveaux)
				) {
					return true;
				}
			}
		}
	}
	return false;
};
TUtilitaireCompetences.existeBarreNiveauxDAcquisitionsDeNiveaux = function (
	aListeNiveaux,
	aPourChronologique,
) {
	if (aListeNiveaux) {
		if (aPourChronologique === true) {
			return aListeNiveaux.count() > 0;
		}
		for (let i = 0; i < aListeNiveaux.count(); i++) {
			let lNiveau = aListeNiveaux.get(i);
			if (lNiveau.nbr > 0) {
				return true;
			}
		}
	}
	return false;
};
TUtilitaireCompetences.regroupeNiveauxDAcquisitions = function (
	aListeNiveauxDAcquisition,
) {
	const result = new ObjetListeElements_1.ObjetListeElements();
	if (aListeNiveauxDAcquisition) {
		aListeNiveauxDAcquisition.parcourir((aNiveau) => {
			if (
				aNiveau.getGenre() >=
				Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Expert
			) {
				const lValeurDuNiveau =
					aNiveau.coeff !== undefined && aNiveau.coeff !== null
						? aNiveau.coeff
						: 1;
				if (lValeurDuNiveau > 0) {
					let lNiveauDeListeRegroupee = result.getElementParGenre(
						aNiveau.getGenre(),
					);
					if (lNiveauDeListeRegroupee === undefined) {
						lNiveauDeListeRegroupee =
							MethodesObjet_1.MethodesObjet.dupliquer(aNiveau);
						lNiveauDeListeRegroupee.nbr = lValeurDuNiveau;
						result.addElement(lNiveauDeListeRegroupee);
					} else {
						lNiveauDeListeRegroupee.nbr += lValeurDuNiveau;
					}
				}
			}
		});
	}
	return result;
};
TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionParNiveauOuPastille =
	function (aListeNiveauxDAcquisitionRegroupes) {
		const result = [];
		if (aListeNiveauxDAcquisitionRegroupes) {
			const lListeGlobalNiveauxDAcquisitions =
				MethodesObjet_1.MethodesObjet.dupliquer(
					(0, AccessApp_1.getApp)().getObjetParametres()
						.listeNiveauxDAcquisitions,
				);
			lListeGlobalNiveauxDAcquisitions.setTri([
				ObjetTri_1.ObjetTri.init("positionJauge"),
			]);
			lListeGlobalNiveauxDAcquisitions.trier();
			let niveau = null;
			lListeGlobalNiveauxDAcquisitions.parcourir((D) => {
				niveau = aListeNiveauxDAcquisitionRegroupes.getElementParGenre(
					D.getGenre(),
				);
				if (!!niveau) {
					result.push(niveau.nbr + " " + niveau.getLibelle());
				}
			});
		}
		return result.length > 0 ? result.join("\n") : "";
	};
TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionChronologique =
	function (aListeNiveauxDAcquisition, aAvecAffichageZero) {
		const result = [];
		if (aListeNiveauxDAcquisition) {
			const lListeGlobalNiveauxDAcquisitions =
				MethodesObjet_1.MethodesObjet.dupliquer(
					(0, AccessApp_1.getApp)().getObjetParametres()
						.listeNiveauxDAcquisitions,
				);
			lListeGlobalNiveauxDAcquisitions.setTri([
				ObjetTri_1.ObjetTri.init("positionJauge"),
			]);
			lListeGlobalNiveauxDAcquisitions.trier();
			lListeGlobalNiveauxDAcquisitions.parcourir((D) => {
				const lListe = aListeNiveauxDAcquisition.getListeElements((D2) => {
					return D2.getGenre() === D.getGenre();
				});
				if (aAvecAffichageZero || lListe.count() > 0) {
					result.push(lListe.count() + " " + D.getLibelle());
				}
			});
		}
		return result.length > 0 ? result.join("\n") : "";
	};
TUtilitaireCompetences.getMoyenneBarreNiveauDAcquisition = function (
	aListeNiveauxDAcquisitionRegroupes,
) {
	let lTotalNotesSynthese = 0,
		lNbDEvaluationsNotees = 0,
		lTypeNotePonderation = null;
	if (aListeNiveauxDAcquisitionRegroupes) {
		aListeNiveauxDAcquisitionRegroupes.parcourir((D) => {
			lTypeNotePonderation =
				Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getPonderation(
					D,
				);
			if (!!lTypeNotePonderation && lTypeNotePonderation.estUneValeur()) {
				lTotalNotesSynthese += D.nbr * lTypeNotePonderation.getValeur();
				lNbDEvaluationsNotees += D.nbr;
			}
		});
	}
	return new TypeNote_1.TypeNote(
		lNbDEvaluationsNotees > 0 ? lTotalNotesSynthese / lNbDEvaluationsNotees : 0,
	);
};
TUtilitaireCompetences.surBoutonValidationAuto = function (aParams) {
	if (GEtatUtilisateur.EtatSaisie) {
		GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"interface.SaisieNonValidee",
			),
			message: ObjetTraduction_1.GTraductions.getValeur(
				"interface.SaisieAValider",
			),
		});
	} else {
		const lInstancePage = aParams.instance;
		const lFenetreValidationAutoCompetences =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_ValidationAutoCompetence_1.ObjetFenetre_ValidationAutoCompetence,
				{
					pere: lInstancePage,
					evenement(aTypeSaisie) {
						if (
							aTypeSaisie ===
							ObjetFenetre_ValidationAutoCompetence_1
								.TypeEvenementValidationAutoCompetences.Saisie
						) {
							if (lInstancePage && lInstancePage.afficherPage) {
								lInstancePage.afficherPage();
							}
						} else if (
							aTypeSaisie ===
							ObjetFenetre_ValidationAutoCompetence_1
								.TypeEvenementValidationAutoCompetences
								.AfficherPreferencesCalcul
						) {
							TUtilitaireCompetences.ouvrirFenetrePreferencesCalculPositionnement(
								false,
								{
									callbackSurChangement: () => {
										lFenetreValidationAutoCompetences.mettreAJourValeursDonneesCalcul();
									},
								},
							);
						}
					},
					initialiser(aInstance) {
						aInstance.setOptions({
							estCompetenceNumerique: !!aParams.estCompetenceNumerique,
							estPourLaClasse: !!aParams.estPourLaClasse,
							estValidationCECRLDomaine: !!aParams.estValidationCECRLDomaine,
							estValidationCECRLLV: !!aParams.estValidationCECRLLV,
							avecChoixCalcul: !!aParams.avecChoixCalcul,
							mrFiche: aParams.mrFiche,
						});
						aInstance.setDonnees({
							palier: aParams.palier,
							listePiliers: aParams.listePiliers,
							periode: aParams.periode,
							service: aParams.service,
							listeEleves: aParams.listeEleves,
						});
					},
				},
			);
		lFenetreValidationAutoCompetences.afficher();
	}
};
TUtilitaireCompetences.surBoutonValidationAutoPositionnement = function (
	aParams,
) {
	if (GEtatUtilisateur.EtatSaisie) {
		GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"interface.SaisieNonValidee",
			),
			message: ObjetTraduction_1.GTraductions.getValeur(
				"interface.SaisieAValider",
			),
		});
	} else {
		let lTitre;
		if (!!aParams.titre) {
			lTitre = aParams.titre;
		} else {
			if (
				aParams.modeValidationAuto ===
				TypeModeValidationAuto_1.TypeModeValidationAuto
					.tmva_PosAvecNoteSelonEvaluation
			) {
				lTitre = ObjetTraduction_1.GTraductions.getValeur(
					"competences.fenetreValidationAutoPositionnement.titrePositionnementNote",
				);
			} else {
				lTitre = ObjetTraduction_1.GTraductions.getValeur(
					"competences.fenetreValidationAutoPositionnement.titre",
				);
			}
		}
		const lFenetreCalculAutoPositionnement =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_CalculAutoPositionnement_1.ObjetFenetre_CalculAutoPositionnement,
				{
					pere: this,
					evenement(aTypeSaisie) {
						if (
							aTypeSaisie ===
							ObjetFenetre_CalculAutoPositionnement_1
								.TypeEvenementValidationAutoPositionnement.Saisie
						) {
							const lCallbackReussite =
								!!aParams.callback &&
								MethodesObjet_1.MethodesObjet.isFunction(aParams.callback)
									? aParams.callback
									: aParams.instance.afficherPage;
							if (lCallbackReussite) {
								lCallbackReussite.call(aParams.instance);
							}
						} else if (
							aTypeSaisie ===
							ObjetFenetre_CalculAutoPositionnement_1
								.TypeEvenementValidationAutoPositionnement
								.AfficherPreferencesCalcul
						) {
							TUtilitaireCompetences.ouvrirFenetrePreferencesCalculPositionnement(
								true,
								{
									callbackSurChangement: () => {
										lFenetreCalculAutoPositionnement.mettreAJourValeursDonneesCalcul();
									},
								},
							);
						}
					},
					initialiser(aInstance) {
						aInstance.setDonneesAffichage({
							messageRestrictionsSurCalculAuto:
								aParams.messageRestrictionsSurCalculAuto,
							message: aParams.message,
							avecChoixCalcul: aParams.avecChoixCalcul,
							avecChoixPreferencesCalcul: aParams.avecChoixPreferencesCalcul,
							mrFiche: aParams.mrFiche,
						});
						aInstance.setDonnees({
							borneDateDebut: aParams.borneDateDebut,
							borneDateFin: aParams.borneDateFin,
							calculMultiServices: aParams.calculMultiServices,
							modeCalculPositionnement: aParams.modeCalculPositionnement,
							modeValidationAuto: aParams.modeValidationAuto,
							listeEleves: aParams.listeEleves,
						});
						aInstance.setOptionsFenetre({ titre: lTitre });
					},
				},
			);
		lFenetreCalculAutoPositionnement.afficher();
	}
};
TUtilitaireCompetences.ouvrirFenetrePreferencesCalculPositionnement = function (
	aEstContexteParService,
	aParams,
) {
	const lApp = (0, AccessApp_1.getApp)();
	let lPrefixeParametresUtilisateur;
	if (aEstContexteParService) {
		lPrefixeParametresUtilisateur = "CalculPositionnementEleveParService";
	} else {
		lPrefixeParametresUtilisateur = "CalculPositionnementEleveParClasse";
	}
	const lDonneesModeCalcul = {
		dernieresEvaluations: {
			utiliserNb: lApp.parametresUtilisateur.get(
				lPrefixeParametresUtilisateur + ".NDernieresEvaluations.utiliserNb",
			),
			nb: lApp.parametresUtilisateur.get(
				lPrefixeParametresUtilisateur + ".NDernieresEvaluations.nb",
			),
			pourcent: lApp.parametresUtilisateur.get(
				lPrefixeParametresUtilisateur + ".NDernieresEvaluations.pourcent",
			),
		},
		meilleuresEvals: {
			utiliserNb: lApp.parametresUtilisateur.get(
				lPrefixeParametresUtilisateur + ".NMeilleuresEvaluations.utiliserNb",
			),
			nb: lApp.parametresUtilisateur.get(
				lPrefixeParametresUtilisateur + ".NMeilleuresEvaluations.nb",
			),
			pourcent: lApp.parametresUtilisateur.get(
				lPrefixeParametresUtilisateur + ".NMeilleuresEvaluations.pourcent",
			),
		},
	};
	const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_PreferencesCalculPositionnement_1.ObjetFenetre_PreferencesCalculPositionnement,
		{
			pere: this,
			evenement(aDonneesModeCalculModifiees) {
				lApp.parametresUtilisateur.set(
					lPrefixeParametresUtilisateur + ".NDernieresEvaluations.utiliserNb",
					aDonneesModeCalculModifiees.dernieresEvaluations.utiliserNb,
				);
				lApp.parametresUtilisateur.set(
					lPrefixeParametresUtilisateur + ".NDernieresEvaluations.nb",
					aDonneesModeCalculModifiees.dernieresEvaluations.nb,
				);
				lApp.parametresUtilisateur.set(
					lPrefixeParametresUtilisateur + ".NDernieresEvaluations.pourcent",
					aDonneesModeCalculModifiees.dernieresEvaluations.pourcent,
				);
				lApp.parametresUtilisateur.set(
					lPrefixeParametresUtilisateur + ".NMeilleuresEvaluations.utiliserNb",
					aDonneesModeCalculModifiees.meilleuresEvals.utiliserNb,
				);
				lApp.parametresUtilisateur.set(
					lPrefixeParametresUtilisateur + ".NMeilleuresEvaluations.nb",
					aDonneesModeCalculModifiees.meilleuresEvals.nb,
				);
				lApp.parametresUtilisateur.set(
					lPrefixeParametresUtilisateur + ".NMeilleuresEvaluations.pourcent",
					aDonneesModeCalculModifiees.meilleuresEvals.pourcent,
				);
				if (aParams.callbackSurChangement) {
					aParams.callbackSurChangement();
				}
			},
		},
	);
	lFenetre.setDonneesModeCalcul(lDonneesModeCalcul);
	lFenetre.setLectureSeule(!!aParams.enLectureSeule);
	lFenetre.afficher();
};
TUtilitaireCompetences.surBoutonCalculNotesDevoir = function (aParams) {
	if (GEtatUtilisateur.EtatSaisie) {
		GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"interface.SaisieNonValidee",
			),
			message: ObjetTraduction_1.GTraductions.getValeur(
				"interface.SaisieAValider",
			),
		});
	} else {
		const lMrFiche = ObjetTraduction_1.GTraductions.getValeur(
			"evaluations.MFicheCalculNote",
		);
		const lJsonMrFiche = ObjetJSON_1.ObjetJSON.parse(lMrFiche);
		const lsurAfficherMrFiche = () => {
			return {
				event() {
					ObjetHint_1.ObjetHint.start(lJsonMrFiche.html, { sansDelai: true });
				},
			};
		};
		const lMessageHTML = IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				null,
				ObjetTraduction_1.GTraductions.getValeur(
					"evaluations.confirmationAffectationNotes",
				),
			),
			IE.jsx.str(
				"div",
				{ class: "EspaceHaut10 flex-contain flex-center" },
				IE.jsx.str("span", null, lJsonMrFiche.titre),
				IE.jsx.str("ie-btnicon", {
					class: "MargeGauche icon_question bt-activable",
					"ie-model": lsurAfficherMrFiche,
					title: lJsonMrFiche.titre,
				}),
			),
		);
		GApplication.getMessage()
			.afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				titre: aParams.titre,
				message: lMessageHTML,
			})
			.then((aGenre) => {
				if (aGenre === 0) {
					const lParamsSaisie = { evaluation: aParams.evaluation };
					new ObjetRequeteCalculAutoNotesSelonCompetences_1.ObjetRequeteCalculAutoNotesSelonCompetences(
						aParams.instance,
						aParams.callback,
					).lancerRequete(lParamsSaisie);
				}
			});
	}
};
TUtilitaireCompetences.getNiveauAcqusitionDEventClavier = function (
	aEvent,
	aListeNiveaux,
	aPourPositionnement = false,
) {
	if (!aListeNiveaux || !aEvent) {
		return null;
	}
	if (aEvent.ctrlKey || aEvent.altKey) {
		return null;
	}
	const lEventKey =
		!!aEvent.key && !!aEvent.key.toLowerCase ? aEvent.key.toLowerCase() : "";
	let lGenre = -1;
	if (!!lEventKey) {
		(0, AccessApp_1.getApp)()
			.getObjetParametres()
			.listeNiveauxDAcquisitions.parcourir((D) => {
				if (
					(!aPourPositionnement && D.raccourci === lEventKey) ||
					(aPourPositionnement && D.raccourciPositionnement === lEventKey)
				) {
					lGenre = D.getGenre();
					return false;
				}
			});
	}
	if (lGenre >= 0) {
		return aListeNiveaux.getElementParNumeroEtGenre(null, lGenre);
	}
	return null;
};
function _initMenuContextuelNiveauEquivalence(aPourCN, aParametres) {
	const lParametres = Object.assign(
		{
			instance: null,
			menuContextuel: null,
			evaluationsEditables: true,
			callbackNiveau: null,
		},
		aParametres,
	);
	lParametres.menuContextuel.setOptions({ largeurMin: 120 });
	if (MethodesObjet_1.MethodesObjet.isFunction(lParametres.callbackNiveau)) {
		let lListe;
		if (aPourCN) {
			lListe =
				TypeNiveauEquivalenceCE_1.TypeNiveauEquivalenceCEUtil.getListeNiveauxEquivalenceCN(
					true,
				);
		} else {
			lListe =
				TypeNiveauEquivalenceCE_1.TypeNiveauEquivalenceCEUtil.getListeNiveauxEquivalenceLVE(
					true,
				);
		}
		if (!!lListe) {
			lListe.parcourir((aElement) => {
				if (aElement.existe()) {
					lParametres.menuContextuel.add(
						aElement.getLibelle(),
						lParametres.evaluationsEditables,
						() => {
							lParametres.callbackNiveau.call(lParametres.instance, aElement);
						},
					);
				}
			});
		}
	}
}
TUtilitaireCompetences.initMenuContextuelNiveauEquivalenceLVE = function (
	aParametres,
) {
	_initMenuContextuelNiveauEquivalence(false, aParametres);
};
TUtilitaireCompetences.initMenuContextuelNiveauEquivalenceCN = function (
	aParametres,
) {
	_initMenuContextuelNiveauEquivalence(true, aParametres);
};
TUtilitaireCompetences.initMenuContextuelNiveauAcquisition = function (
	aParametres,
) {
	const lParametres = Object.assign(
		{
			instance: null,
			menuContextuel: null,
			genreChoixValidationCompetence: -1,
			genrePositionnement: undefined,
			avecDispense: true,
			avecSupprimerLesEvaluations: false,
			evaluationsEditables: true,
			estObservationEditable: false,
			estDateEditable: false,
			callbackNiveau: null,
			callbackCommentaire: null,
			callbackDate: null,
			avecLibelleRaccourci: false,
			avecSousMenu: false,
			avecSelecteurNiveauCalcule: false,
		},
		aParametres,
	);
	lParametres.menuContextuel.setOptions({
		largeurMin: 150,
		largeurColonneGauche: 30,
	});
	let lListe = null;
	if (MethodesObjet_1.MethodesObjet.isFunction(lParametres.callbackNiveau)) {
		lListe = TUtilitaireCompetences.getListeNiveauxDAcquisitionsPourMenu({
			genreChoixValidationCompetence:
				lParametres.genreChoixValidationCompetence,
			avecDispense: lParametres.avecDispense,
			avecLibelleRaccourci: lParametres.avecLibelleRaccourci,
			genrePositionnement: lParametres.genrePositionnement,
			avecSelecteurNiveauCalcule: lParametres.avecSelecteurNiveauCalcule,
		});
		if (lParametres.avecSousMenu) {
			lParametres.menuContextuel.addSousMenu(
				ObjetTraduction_1.GTraductions.getValeur(
					"competences.ModifierNiveauAcquisition",
				),
				(aInstanceSousMenu) => {
					lListe.parcourir((aElement) => {
						if (aElement.existe()) {
							aInstanceSousMenu.add(
								aElement.tableauLibelles || aElement.getLibelle(),
								aElement.actif !== false && lParametres.evaluationsEditables,
								() => {
									lParametres.callbackNiveau.call(
										lParametres.instance,
										aElement,
									);
								},
								{
									image: aElement.image,
									imageFormate: true,
									largeurImage: aElement.largeurImage,
								},
							);
						}
					});
				},
			);
		} else {
			lListe.parcourir((aElement) => {
				if (aElement.existe()) {
					lParametres.menuContextuel.add(
						aElement.tableauLibelles || aElement.getLibelle(),
						aElement.actif !== false && lParametres.evaluationsEditables,
						() => {
							lParametres.callbackNiveau.call(lParametres.instance, aElement);
						},
						{
							image: aElement.image,
							imageFormate: true,
							largeurImage: aElement.largeurImage,
						},
					);
				}
			});
		}
	}
	if (
		MethodesObjet_1.MethodesObjet.isFunction(lParametres.callbackCommentaire)
	) {
		lParametres.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur(
				"competences.AjouterCommentaire",
			),
			lParametres.estObservationEditable,
			() => {
				lParametres.callbackCommentaire.call(lParametres.instance);
			},
		);
	}
	if (MethodesObjet_1.MethodesObjet.isFunction(lParametres.callbackDate)) {
		lParametres.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("competences.ModifierDate"),
			lParametres.estDateEditable,
			() => {
				lParametres.callbackDate.call(lParametres.instance);
			},
		);
	}
	if (
		lParametres.avecSupprimerLesEvaluations &&
		MethodesObjet_1.MethodesObjet.isFunction(lParametres.callbackNiveau)
	) {
		const lNiveauSuppression = lListe
			? lListe.getElementParNumeroEtGenre(
					null,
					Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Utilisateur,
				)
			: null;
		if (!!lNiveauSuppression) {
			lParametres.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur(
					"competences.SupprimerEvaluations",
				),
				lNiveauSuppression.actif !== false && lParametres.evaluationsEditables,
				() => {
					lParametres.callbackNiveau.call(
						lParametres.instance,
						lNiveauSuppression,
					);
				},
			);
		}
	}
};
TUtilitaireCompetences.getLibellePositionnement = function (aParams) {
	aParams.niveauDAcquisition = (0, AccessApp_1.getApp)()
		.getObjetParametres()
		.listeNiveauxDAcquisitions.getElementParElement(aParams.niveauDAcquisition);
	if (aParams.niveauDAcquisition) {
		return Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getLibellePositionnement(
			aParams,
		);
	}
};
TUtilitaireCompetences.getImagePositionnement = function (aParams) {
	aParams.niveauDAcquisition = (0, AccessApp_1.getApp)()
		.getObjetParametres()
		.listeNiveauxDAcquisitions.getElementParElement(aParams.niveauDAcquisition);
	if (aParams.niveauDAcquisition) {
		return Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImagePositionnement(
			aParams,
		);
	}
};
TUtilitaireCompetences.composeLegende = function (aParams) {
	const lParams = Object.assign(
		{
			avecTitreLegende: true,
			titreLegende: ObjetTraduction_1.GTraductions.getValeur(
				"competences.Legende",
			),
			avecListeCompetences: true,
			avecListePositionnements: false,
			genrePositionnement: TypePositionnement_1.TypePositionnement.POS_Echelle,
			affichageLigneSimple: false,
		},
		aParams,
	);
	const _composeLigneSimpleLegende = function (aParams) {
		const H = [];
		let lLibelleNiveau, lImageNiveau;
		H.push(
			"<div",
			aParams.avecEspaceHaut === true ? ' class="EspaceHaut"' : "",
			">",
		);
		(0, AccessApp_1.getApp)()
			.getObjetParametres()
			.listeNiveauxDAcquisitions.parcourir((D) => {
				if (
					D.existeNumero() &&
					D.actifPour.contains(aParams.typeGenreValidation)
				) {
					lLibelleNiveau = aParams.estPourPositionnement
						? Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getLibellePositionnement(
								{
									niveauDAcquisition: D,
									genrePositionnement: lParams.genrePositionnement,
								},
							)
						: D.getLibelle();
					lImageNiveau = aParams.estPourPositionnement
						? Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImagePositionnement(
								{
									niveauDAcquisition: D,
									genrePositionnement: lParams.genrePositionnement,
								},
							)
						: Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
								D,
							);
					H.push(
						'<div class="',
						aParams.avecInline ? "InlineBlock " : "",
						'm-bottom-l p-left-xl">',
						lImageNiveau,
						'<span class="m-left">',
						lLibelleNiveau,
						"</span></div>",
					);
				}
			});
		H.push("</div>");
		return H.join("");
	};
	const result = [];
	if (lParams.avecListeCompetences || lParams.avecListePositionnements) {
		result.push('<div class="EspaceHaut EspaceBas">');
		if (lParams.avecTitreLegende) {
			result.push(
				'<div class="Espace" style="',
				ObjetStyle_1.GStyle.composeCouleurBordure(GCouleur.bordure),
				ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.fond),
				'" role="group" aria-label="' +
					lParams.titreLegende.toAttrValue() +
					'">',
				'<div class="AlignementHaut Gras EspaceBas">',
				lParams.titreLegende,
				"</div>",
			);
		}
		if (
			lParams.avecListeCompetences &&
			lParams.avecListePositionnements &&
			(lParams.genrePositionnement ===
				TypePositionnement_1.TypePositionnement.POS_Echelle ||
				lParams.genrePositionnement ===
					TypePositionnement_1.TypePositionnement.POS_Moyenne)
		) {
			let lOnAfficheLesDeuxImages, lImageCompetence, lImagePositionnement;
			result.push(
				IE.jsx.str(
					"ul",
					{
						class: [
							Divers_css_1.StylesDivers.flexContain,
							Divers_css_1.StylesDivers.flexGapXl,
							Divers_css_1.StylesDivers.flexWrap,
						],
					},
					(H) => {
						(0, AccessApp_1.getApp)()
							.getObjetParametres()
							.listeNiveauxDAcquisitions.parcourir((D) => {
								if (
									D.existeNumero() &&
									(D.actifPour.contains(
										TypeGenreValidationCompetence_1
											.TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
									) ||
										D.actifPour.contains(
											TypeGenreValidationCompetence_1
												.TypeGenreValidationCompetence.tGVC_Competence,
										))
								) {
									lImageCompetence =
										Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
											D,
										);
									lImagePositionnement =
										Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImagePositionnement(
											{
												niveauDAcquisition: D,
												genrePositionnement: lParams.genrePositionnement,
											},
										);
									lOnAfficheLesDeuxImages =
										D.actifPour.contains(
											TypeGenreValidationCompetence_1
												.TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
										) &&
										D.actifPour.contains(
											TypeGenreValidationCompetence_1
												.TypeGenreValidationCompetence.tGVC_Competence,
										) &&
										D.getGenre() <=
											Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition
												.NonAcquis;
									H.push(
										IE.jsx.str(
											"li",
											{
												class: [
													Divers_css_1.StylesDivers.flexContain,
													Divers_css_1.StylesDivers.flexCenter,
												],
											},
											lOnAfficheLesDeuxImages
												? IE.jsx.str(
														IE.jsx.fragment,
														null,
														IE.jsx.str(
															"div",
															{ class: "PetitEspaceDroit" },
															lImageCompetence,
														),
														IE.jsx.str(
															"div",
															{ class: "PetitEspaceDroit" },
															lImagePositionnement,
														),
													)
												: IE.jsx.str(
														"div",
														{ class: "PetitEspaceDroit" },
														D.actifPour.contains(
															TypeGenreValidationCompetence_1
																.TypeGenreValidationCompetence
																.tGVC_EvaluationEtItem,
														)
															? lImageCompetence
															: lImagePositionnement,
													),
											IE.jsx.str("p", null, D.getLibelle()),
										),
									);
								}
							});
					},
				),
			);
		} else {
			if (lParams.avecListeCompetences) {
				result.push(
					_composeLigneSimpleLegende({
						typeGenreValidation:
							TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
								.tGVC_EvaluationEtItem,
						estPourPositionnement: false,
						avecInline: lParams.affichageLigneSimple,
					}),
				);
			}
			if (lParams.avecListePositionnements) {
				result.push(
					_composeLigneSimpleLegende({
						typeGenreValidation:
							TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
								.tGVC_Competence,
						estPourPositionnement: true,
						avecEspaceHaut: !!lParams.avecListeCompetences,
						avecInline: lParams.affichageLigneSimple,
					}),
				);
			}
		}
		if (lParams.avecTitreLegende) {
			result.push("</div>");
		}
		result.push("</div>");
	}
	return result.join("");
};
TUtilitaireCompetences.composeTitleEvaluation = function (aCompetence) {
	const lTitleEvaluation = [];
	if (!!aCompetence) {
		if (aCompetence.pilier) {
			lTitleEvaluation.push("<b>", aCompetence.pilier.getLibelle(), "</b>");
			if (aCompetence.palier) {
				const lLibellePalier = aCompetence.palier.getLibelle();
				if (lLibellePalier) {
					lTitleEvaluation.push(" (", lLibellePalier, ")");
				}
			}
			lTitleEvaluation.push("<br/>");
		}
		if (!!aCompetence.coefficient || aCompetence.coefficient === 0) {
			lTitleEvaluation.push(
				ObjetTraduction_1.GTraductions.getValeur("competences.coefficient"),
				" <b>",
				aCompetence.coefficient,
				"</b>",
				"<br/><br/>",
			);
		}
		if (!!aCompetence.nivEquivCELong) {
			lTitleEvaluation.push("[", aCompetence.nivEquivCELong, "] ");
		}
		lTitleEvaluation.push(aCompetence.getLibelle());
	}
	return lTitleEvaluation.join("");
};
TUtilitaireCompetences.composeHintEvaluationEleve = function (aParams) {
	const lHintEvaluationEleve = [];
	if (!!aParams.libelleEleve) {
		lHintEvaluationEleve.push("<b>", aParams.libelleEleve, "</b>");
		lHintEvaluationEleve.push("<br/><br/>");
	}
	if (aParams.estSaisieClotureePourEleve) {
		lHintEvaluationEleve.push(
			ObjetTraduction_1.GTraductions.getValeur(
				"competences.EvaluationClotureePourLaClasse",
			),
			'<i class="icon_lock m-left"></i><br/><br/>',
		);
	}
	lHintEvaluationEleve.push(aParams.hintCompetence);
	if (!!aParams.niveauDAcquisition) {
		if (
			(0, AccessApp_1.getApp)().getObjetParametres().listeNiveauxDAcquisitions
		) {
			const lNiveauDAcquisition = (0, AccessApp_1.getApp)()
				.getObjetParametres()
				.listeNiveauxDAcquisitions.getElementParNumero(
					aParams.niveauDAcquisition.getNumero(),
				);
			if (lNiveauDAcquisition) {
				const lLibelleNivAcqui =
					Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getLibelle(
						lNiveauDAcquisition,
					);
				lHintEvaluationEleve.push("<br/><br/>");
				lHintEvaluationEleve.push(
					"<b><u>",
					ObjetTraduction_1.GTraductions.getValeur("competences.evaluation"),
					"</u></b> : ",
					lLibelleNivAcqui,
				);
			}
		}
	}
	if (!!aParams.observation) {
		lHintEvaluationEleve.push("<br/>", aParams.observation);
	}
	return ObjetChaine_1.GChaine.toTitle(lHintEvaluationEleve.join(""));
};
TUtilitaireCompetences.afficherAideSaisieNiveauMaitrise = function (aParams) {
	let lListeNiveauxRaccourcis;
	const lListeGlobaleNiveaux = MethodesObjet_1.MethodesObjet.dupliquer(
		(0, AccessApp_1.getApp)().getObjetParametres().listeNiveauxDAcquisitions,
	);
	if (!!lListeGlobaleNiveaux && lListeGlobaleNiveaux.count() > 0) {
		lListeGlobaleNiveaux.setTri([
			ObjetTri_1.ObjetTri.init(
				"positionJauge",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
		]);
		lListeGlobaleNiveaux.trier();
		lListeNiveauxRaccourcis = [];
		lListeGlobaleNiveaux.parcourir((D) => {
			if (
				aParams.genreChoixValidationCompetence === undefined ||
				D.actifPour.contains(aParams.genreChoixValidationCompetence)
			) {
				const lRaccourci =
					!!D.raccourci && D.raccourci.toUpperCase
						? D.raccourci.toUpperCase()
						: "";
				const lImage =
					Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(D);
				lListeNiveauxRaccourcis.push(
					'<div class="PetitEspaceBas">',
					'<span class="InlineBlock AlignementMilieu" style="',
					ObjetStyle_1.GStyle.composeWidth(30),
					'">',
					lRaccourci,
					" : </span>",
					'<span class="InlineBlock AlignementMilieu" style="',
					ObjetStyle_1.GStyle.composeWidth(30),
					'" aria-hidden="true">',
					lImage || "",
					"</span>",
					"<span>",
					D.getLibelle(),
					"</span>",
					"</div>",
				);
			}
		});
	}
	const lMessageHtml = [];
	lMessageHtml.push(
		"<p>",
		ObjetTraduction_1.GTraductions.getValeur(
			"competences.MessageAideSaisieNivMaitrise",
		),
		"</p>",
	);
	if (!!lListeNiveauxRaccourcis) {
		lMessageHtml.push(
			'<div class="MargeGauche GrandEspaceHaut">',
			lListeNiveauxRaccourcis.join(""),
			"</div>",
		);
	}
	GApplication.getMessage()
		.afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.MrFiche,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"competences.TitreAideSaisieNivMaitrise",
			),
			width: 420,
			message: lMessageHtml.join(""),
		})
		.then(() => {
			if (!!aParams.callback) {
				aParams.callback();
			}
		});
};
TUtilitaireCompetences.getListeNiveauxAcquis = function () {
	const lListeNiveauxAcquis = new ObjetListeElements_1.ObjetListeElements();
	(0, AccessApp_1.getApp)()
		.getObjetParametres()
		.listeNiveauxDAcquisitions.parcourir((aNiveau) => {
			if (TUtilitaireCompetences.estNiveauAcqui(aNiveau)) {
				lListeNiveauxAcquis.add(aNiveau);
			}
		});
	return lListeNiveauxAcquis;
};
TUtilitaireCompetences.getListeNiveauxNonAcquis = function () {
	const lListeNiveauxAcquis = new ObjetListeElements_1.ObjetListeElements();
	(0, AccessApp_1.getApp)()
		.getObjetParametres()
		.listeNiveauxDAcquisitions.parcourir((aNiveau) => {
			if (TUtilitaireCompetences.estNiveauNonAcqui(aNiveau)) {
				lListeNiveauxAcquis.add(aNiveau);
			}
		});
	return lListeNiveauxAcquis;
};
TUtilitaireCompetences.estNiveauAcqui = function (aNiveauAcquisition) {
	let lEstUnNiveauAcquis = false;
	if (!!aNiveauAcquisition) {
		const lNiveauGlobal = (0, AccessApp_1.getApp)()
			.getObjetParametres()
			.listeNiveauxDAcquisitions.getElementParGenre(
				aNiveauAcquisition.getGenre(),
			);
		lEstUnNiveauAcquis = !!lNiveauGlobal && !!lNiveauGlobal.estAcqui;
	}
	return lEstUnNiveauAcquis;
};
TUtilitaireCompetences.estNiveauNonAcqui = function (aNiveauAcquisition) {
	let lEstUnNiveauAcquis = false;
	if (!!aNiveauAcquisition) {
		const lNiveauGlobal = (0, AccessApp_1.getApp)()
			.getObjetParametres()
			.listeNiveauxDAcquisitions.getElementParGenre(
				aNiveauAcquisition.getGenre(),
			);
		lEstUnNiveauAcquis = !!lNiveauGlobal && !!lNiveauGlobal.estNonAcqui;
	}
	return lEstUnNiveauAcquis;
};
TUtilitaireCompetences.estNotantPourTxReussiteEvaluation = function (
	aNiveauAcquisition,
) {
	let lEstUnNiveauAcquisNotant = false;
	if (!!aNiveauAcquisition) {
		const lNiveauGlobal = (0, AccessApp_1.getApp)()
			.getObjetParametres()
			.listeNiveauxDAcquisitions.getElementParGenre(
				aNiveauAcquisition.getGenre(),
			);
		lEstUnNiveauAcquisNotant =
			!!lNiveauGlobal && !!lNiveauGlobal.estNotantPourTxReussite;
	}
	return lEstUnNiveauAcquisNotant;
};
