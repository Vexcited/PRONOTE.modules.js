exports.DonneesListe_TAFsCDT = void 0;
const Enumere_CommandeMenu_1 = require("Enumere_CommandeMenu");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const UtilitaireDuree_1 = require("UtilitaireDuree");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const TypeGenreRenduTAF_1 = require("TypeGenreRenduTAF");
const TypeNiveauDifficulte_1 = require("TypeNiveauDifficulte");
const ObjetChaine_1 = require("ObjetChaine");
const GUID_1 = require("GUID");
const AccessApp_1 = require("AccessApp");
class DonneesListe_TAFsCDT extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aParams) {
		super(aParams.listeTAFs);
		this.appSco = (0, AccessApp_1.getApp)();
		this.parametres = aParams;
		this.idBtnPJ = GUID_1.GUID.getId() + "_btnPJ_";
		this.setOptions({
			avecTrimSurEdition: true,
			avecMultiSelection: true,
			avecEvnt_Creation: true,
		});
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_TAFsCDT.colonnes.description: {
				if (aParams.surEdition && !aParams.article.avecMiseEnForme) {
					return ObjetChaine_1.GChaine.supprimerBalisesHtml(
						aParams.article.descriptif,
					);
				}
				const lStrDescription = [];
				if (!!aParams.article.executionQCM) {
					lStrDescription.push(
						getDescriptionExecutionQCM(
							aParams.article.executionQCM,
							aParams.article.descriptif,
						),
					);
					lStrDescription.push("<br />");
					const lnodeParametresExecQCM = (aNode) => {
						$(aNode).eventValidation(() => {
							this.parametres.evenementMenuContextuelListeTAF(
								{
									genre:
										DonneesListe_TAFsCDT.menuContextuelListeTAFs.ParametrageQCM,
									element: aParams.article,
								},
								null,
							);
						});
					};
					const lHtml = IE.jsx.str(
						"span",
						{
							role: "link",
							"aria-haspopup": "dialog",
							tabindex: "0",
							class: "AvecMain Lien",
							"ie-node": lnodeParametresExecQCM,
						},
						ObjetDate_1.GDate.formatDate(
							aParams.article.executionQCM.dateDebutPublication,
							"%JJ/%MM - %hh%sh%mm",
						),
					);
					lStrDescription.push(
						ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.taf.DisponibleAPartirDuNet",
							[lHtml],
						),
					);
					if (!this.parametres.CDTPublie) {
						lStrDescription.push(
							"(",
							ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.taf.SousReserveQueCDTSoitPublie",
							),
							")",
						);
					}
					if (
						!!aParams.article.executionQCM.estLieADevoir ||
						!!aParams.article.executionQCM.estLieAEvaluation
					) {
						lStrDescription.push("<br/>");
						lStrDescription.push(
							ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.taf.AssocieA",
							),
							" ",
						);
						const lAvecElementAssocieCliquable = false;
						const lLibelleAssociation = aParams.article.executionQCM
							.estLieADevoir
							? ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.taf.unDevoir",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.taf.uneEvaluation",
								);
						if (lAvecElementAssocieCliquable) {
							const lJSXNode = aParams.article.executionQCM.estLieADevoir
								? null
								: (aNode) => {
										$(aNode).eventValidation(() => {
											this.parametres.evenementMenuContextuelListeTAF(
												{
													genre:
														DonneesListe_TAFsCDT.menuContextuelListeTAFs
															.DevoirAssocieQCM,
													element: aParams.article,
												},
												null,
											);
										});
									};
							lStrDescription.push(
								IE.jsx.str(
									"span",
									{
										role: "link",
										"aria-haspopup": "dialog",
										tabindex: "0",
										class: "AvecMain Lien",
										"ie-node": lJSXNode,
									},
									lLibelleAssociation,
								),
							);
						} else {
							lStrDescription.push(lLibelleAssociation);
						}
					}
				} else {
					lStrDescription.push(
						IE.jsx.str(
							"div",
							{ class: Divers_css_1.StylesDivers.tinyView },
							aParams.article.descriptif,
						),
					);
				}
				return lStrDescription.join("");
			}
			case DonneesListe_TAFsCDT.colonnes.pourLe:
				return ObjetDate_1.GDate.formatDate(
					aParams.article.PourLe,
					"%JJJ %J %MMM",
				);
			case DonneesListe_TAFsCDT.colonnes.aRendre:
				return aParams.article.executionQCM
					? ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.TAFARendre.ACompleterEditeur",
						)
					: TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.getLibelle(
							aParams.article.genreRendu,
						);
			case DonneesListe_TAFsCDT.colonnes.themes:
				return aParams.article.ListeThemes &&
					aParams.article.ListeThemes.count()
					? aParams.article.ListeThemes.getTableauLibelles().join(", ")
					: "";
			case DonneesListe_TAFsCDT.colonnes.eleves:
				if (aParams.article.estPourTous) {
					return this.parametres.listeElevesDetaches &&
						this.parametres.listeElevesDetaches.count() > 0
						? ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.TAF.attendus",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.TAF.tousEleves",
							);
				} else if (
					this.parametres.listeElevesDetaches &&
					this.parametres.listeElevesDetaches.count() > 0
				) {
					const lNbrElevesTaf = aParams.article.listeEleves.count();
					const lNbrElevesTotalAttendus =
						this.parametres.listeTousEleves.count() -
						this.parametres.listeElevesDetaches.count();
					const lListeElevesAttendus =
						aParams.article.listeEleves.getListeElements((aElement) => {
							return !this.parametres.listeElevesDetaches.getElementParNumero(
								aElement.getNumero(),
							);
						});
					const lPourTousElevesAttendus =
						lListeElevesAttendus.count() === lNbrElevesTotalAttendus;
					const lNbrElevesTafDetaches =
						lNbrElevesTaf - lListeElevesAttendus.count();
					const lChaineEleves = [];
					if (lPourTousElevesAttendus) {
						lChaineEleves.push(
							ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.TAF.attendus",
							),
						);
					} else if (lListeElevesAttendus.count() > 0) {
						lChaineEleves.push(
							ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.TAF.nbElevesAttendus",
								[lListeElevesAttendus.count()],
							),
						);
					}
					if (lNbrElevesTafDetaches > 0) {
						if (lNbrElevesTafDetaches === 1) {
							lChaineEleves.push(
								ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.TAF.1EleveDetache",
								),
							);
						} else {
							lChaineEleves.push(
								ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.TAF.nbElevesDetaches",
									[lNbrElevesTafDetaches],
								),
							);
						}
					}
					return lChaineEleves.join(" + ");
				} else {
					return (
						aParams.article.listeEleves.count() +
						"/" +
						this.parametres.listeTousEleves.count()
					);
				}
			case DonneesListe_TAFsCDT.colonnes.docsJoints:
				if (aParams.article.executionQCM) {
					return "";
				}
				return this._construireDocsJoints(aParams.article, aParams.ligne);
			case DonneesListe_TAFsCDT.colonnes.duree: {
				if (aParams.surEdition) {
					return aParams.article.duree;
				}
				const lDuree = aParams.article.executionQCM
						? UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(
								aParams.article.executionQCM.dureeMaxQCM,
							)
						: aParams.article.duree,
					lFormatMin = lDuree > 60 ? "%mm" : "%xm";
				return lDuree > 0
					? ObjetDate_1.GDate.formatDureeEnMillisecondes(
							lDuree * 60 * 1000,
							lDuree > 60 ? "%xh%sh" + lFormatMin : lFormatMin + "mn",
						)
					: "";
			}
			case DonneesListe_TAFsCDT.colonnes.niveau:
				return TypeNiveauDifficulte_1.TypeNiveauDifficulteUtil.typeToStr(
					aParams.article.niveauDifficulte,
				);
		}
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_TAFsCDT.colonnes.description:
				return aParams.surEdition
					? ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.ZoneTexte
					: ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_TAFsCDT.colonnes.docsJoints:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getTooltip(aParams) {
		return this.getTitleHint(aParams, true);
	}
	getTitleHint(aParams, aAvecHtml) {
		let lListe;
		const lResult = [];
		switch (aParams.idColonne) {
			case DonneesListe_TAFsCDT.colonnes.eleves:
				if (aParams.article.estPourTous) {
					if (
						this.parametres.listeElevesDetaches &&
						this.parametres.listeElevesDetaches.count()
					) {
						lListe = this.parametres.listeTousEleves.getListeElements(
							(aElement) => {
								return !aElement.estElevesDetachesDuCours;
							},
						);
					} else {
						lListe = this.parametres.listeTousEleves;
					}
				} else {
					lListe = aParams.article.listeEleves;
				}
				lListe.trier();
				lListe.parcourir((aElement) => {
					let lLibelle = aElement.getLibelle();
					if (
						this.parametres.listeElevesDetaches.getElementParNumero(
							aElement.getNumero(),
						)
					) {
						lLibelle += aAvecHtml
							? '<i class="m-left icon_eleve_detache" role="img" aria-label="' +
								ObjetTraduction_1.GTraductions.getValeur(
									"Fenetre_SelectionPublic.EleveDetache",
								) +
								'"></i>'
							: ` (${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SelectionPublic.EleveDetache")})`;
					}
					lResult.push(aAvecHtml ? `<div>${lLibelle}</div>` : lLibelle);
				});
				return lResult.join(aAvecHtml ? "" : ", ");
		}
		return "";
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_TAFsCDT.colonnes.description:
				aParams.article.descriptif = _textAreaToDescription(V);
				break;
			case DonneesListe_TAFsCDT.colonnes.duree:
				aParams.article.duree = parseInt(V, 10);
				break;
		}
	}
	getControleCaracteresInput(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_TAFsCDT.colonnes.description:
				return { tailleMax: 10000 };
			case DonneesListe_TAFsCDT.colonnes.duree:
				return { mask: /^0-9/i, tailleMax: 10 };
		}
		return null;
	}
	avecEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_TAFsCDT.colonnes.docsJoints:
				return false;
			case DonneesListe_TAFsCDT.colonnes.description:
			case DonneesListe_TAFsCDT.colonnes.duree:
				return !aParams.article.executionQCM;
			case DonneesListe_TAFsCDT.colonnes.aRendre:
				return (
					!aParams.article.executionQCM &&
					!TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduKiosque(
						aParams.article.genreRendu,
					)
				);
		}
		return true;
	}
	avecEvenementEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_TAFsCDT.colonnes.aRendre:
				return (
					!aParams.article.executionQCM &&
					!TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduKiosque(
						aParams.article.genreRendu,
					)
				);
			case DonneesListe_TAFsCDT.colonnes.pourLe:
			case DonneesListe_TAFsCDT.colonnes.themes:
			case DonneesListe_TAFsCDT.colonnes.eleves:
			case DonneesListe_TAFsCDT.colonnes.niveau:
				return true;
			case DonneesListe_TAFsCDT.colonnes.description:
				return (
					!aParams.article.executionQCM &&
					(aParams.article.avecMiseEnForme ||
						this.appSco.parametresUtilisateur.get("CDT.TAF.ActiverMiseEnForme"))
				);
		}
		return false;
	}
	getCouleurCellule(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_TAFsCDT.colonnes.docsJoints:
				if (!aParams.article.executionQCM && !this.parametres.CDTVerrouille) {
					return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
				}
				break;
		}
		return;
	}
	getClass(aParams) {
		if (aParams.idColonne === DonneesListe_TAFsCDT.colonnes.duree) {
			return "AlignementDroit";
		}
	}
	getLibelleDraggable(aParams) {
		if (!!aParams.article.executionQCM) {
			return getDescriptionExecutionQCM(
				aParams.article.executionQCM,
				aParams.article.descriptif,
			);
		}
	}
	getTri(aColonneDeTri, aGenreTri) {
		const T = [];
		const lThis = this;
		switch (this.getId(aColonneDeTri)) {
			case DonneesListe_TAFsCDT.colonnes.description:
				T.push(
					ObjetTri_1.ObjetTri.init((aElement) => {
						return ObjetChaine_1.GChaine.supprimerBalisesHtml(
							aElement.descriptif,
						);
					}, aGenreTri),
				);
				break;
			case DonneesListe_TAFsCDT.colonnes.pourLe:
				T.push(ObjetTri_1.ObjetTri.init("PourLe", aGenreTri));
				break;
			case DonneesListe_TAFsCDT.colonnes.aRendre:
				T.push(ObjetTri_1.ObjetTri.init("genreRendu", aGenreTri));
				break;
			case DonneesListe_TAFsCDT.colonnes.themes:
				T.push(
					ObjetTri_1.ObjetTri.init((aElement) => {
						return aElement.ListeThemes.getTableauLibelles().join("");
					}, aGenreTri),
				);
				break;
			case DonneesListe_TAFsCDT.colonnes.eleves:
				T.push(
					ObjetTri_1.ObjetTri.init((aElement) => {
						let lNb = 0;
						if (aElement.estPourTous) {
							lNb = !!lThis.parametres.listeTousEleves
								? lThis.parametres.listeTousEleves.count()
								: 0;
						} else if (!!aElement.listeEleves) {
							lNb = aElement.listeEleves.count();
						}
						if (lNb === 0) {
							return Number.MAX_VALUE;
						}
						return lNb;
					}, aGenreTri),
				);
				break;
			case DonneesListe_TAFsCDT.colonnes.docsJoints:
				T.push(
					ObjetTri_1.ObjetTri.init((aElement) => {
						return aElement.ListePieceJointe.getTableauLibelles().join("");
					}, aGenreTri),
				);
				break;
			case DonneesListe_TAFsCDT.colonnes.duree:
				T.push(ObjetTri_1.ObjetTri.init("duree", aGenreTri));
				break;
			case DonneesListe_TAFsCDT.colonnes.niveau:
				T.push(ObjetTri_1.ObjetTri.init("niveauDifficulte", aGenreTri));
				break;
		}
		T.push(
			ObjetTri_1.ObjetTri.init((aElement) => {
				return ObjetChaine_1.GChaine.supprimerBalisesHtml(aElement.descriptif);
			}),
		);
		return T;
	}
	remplirMenuContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		aParametres.menuContextuel.addCommande(
			Enumere_CommandeMenu_1.EGenreCommandeMenu.Edition,
			ObjetTraduction_1.GTraductions.getValeur("liste.modifier"),
			!aParametres.nonEditable &&
				(!aParametres.listeSelection ||
					aParametres.listeSelection.count() <= 1) &&
				this.avecEdition(aParametres),
		);
		aParametres.menuContextuel.addCommande(
			DonneesListe_TAFsCDT.menuContextuelListeTAFs.ParametrageQCM,
			ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.ModifierQCMTAF"),
			!aParametres.nonEditable &&
				(!aParametres.listeSelection ||
					aParametres.listeSelection.count() <= 1) &&
				aParametres.article &&
				!!aParametres.article.executionQCM,
		);
		const lListeDJs = _getListeDJs(aParametres.article);
		lListeDJs.trier();
		if (lListeDJs.count() > 0 && !this.parametres.CDTVerrouille) {
			aParametres.menuContextuel.avecSeparateurSurSuivant();
			aParametres.menuContextuel.addSousMenu(
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.taf.supprimerDJ",
				),
				(aInstanceSousMenu) => {
					lListeDJs.parcourir((aDJ) => {
						let lLibelleDoc = aDJ.getLibelle();
						if (!lLibelleDoc) {
							if (
								aDJ.getGenre() ===
								Enumere_DocumentJoint_1.EGenreDocumentJoint.Url
							) {
								lLibelleDoc = aDJ.url || "";
							}
						}
						const lElement = aInstanceSousMenu.addCommande(
							DonneesListe_TAFsCDT.menuContextuelListeTAFs.SupprimerDJ,
							lLibelleDoc,
							true,
							aDJ,
						);
						switch (aDJ.getGenre()) {
							case Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier:
								lElement.icon = "icon_piece_jointe";
								break;
							case Enumere_DocumentJoint_1.EGenreDocumentJoint.Url:
								lElement.icon = "icon_globe";
								break;
							case Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud:
								lElement.icon = "icon_cloud";
								break;
							case Enumere_DocumentJoint_1.EGenreDocumentJoint.LienKiosque:
								lElement.icon = "icon_exercice_numerique";
								break;
							default:
						}
					});
				},
			);
		}
		aParametres.menuContextuel.avecSeparateurSurSuivant();
		aParametres.menuContextuel.addCommande(
			Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression,
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.taf.SupprimerTAFsSelect",
			),
			!aParametres.nonEditable && this._avecSuppression(aParametres),
		);
	}
	evenementMenuContextuel(aParametres) {
		this.parametres.evenementMenuContextuelListeTAF(
			{
				genre: aParametres.ligneMenu.getNumero(),
				element: aParametres.article,
				data: aParametres.ligneMenu.data,
			},
			aParametres,
		);
	}
	getMessageSuppressionConfirmation(aArticle, aListeSelections) {
		const lMessage = [
			ObjetTraduction_1.GTraductions.getValeur("liste.suppressionSelection"),
		];
		let lAvecRendusEleves = false;
		if (aListeSelections && aListeSelections.count() > 1) {
			aListeSelections.parcourir((aTAF) => {
				if (
					aTAF &&
					TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
						aTAF.genreRendu,
						false,
					) &&
					!lAvecRendusEleves
				) {
					lAvecRendusEleves = aTAF.nbrRendus > 0;
				}
			});
		} else {
			if (
				aArticle &&
				TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
					aArticle.genreRendu,
					false,
				)
			) {
				lAvecRendusEleves = aArticle.nbrRendus > 0;
			}
		}
		if (lAvecRendusEleves) {
			lMessage.push(
				"<br>",
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.existeCopieRenduParEleve",
				),
			);
		}
		return lMessage.join("");
	}
	_construireDocsJoints(aArticle, aLigne) {
		const lFuncConstruitLigne = (aIcone) => {
			const lLargeurMaxChips = 275;
			const lListeDocJointDuGenre = _getListeDJs(aArticle);
			lListeDocJointDuGenre.trier();
			const lModelbtnPJ = () => {
				return {
					event: () => {
						this.parametres.callbackPJ(aArticle, this.idBtnPJ + aLigne);
					},
					getTitle() {
						return ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.docJoints",
						);
					},
					getDisabled: () => {
						let lAvecDocumentJoint =
							this.parametres.avecDocumentJoint[
								Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier
							];
						lAvecDocumentJoint =
							lAvecDocumentJoint ||
							this.parametres.avecDocumentJoint[
								Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud
							];
						lAvecDocumentJoint =
							lAvecDocumentJoint ||
							this.parametres.avecDocumentJoint[
								Enumere_DocumentJoint_1.EGenreDocumentJoint.Url
							];
						lAvecDocumentJoint =
							lAvecDocumentJoint ||
							this.parametres.avecDocumentJoint[
								Enumere_DocumentJoint_1.EGenreDocumentJoint.LienKiosque
							];
						return !lAvecDocumentJoint || this.parametres.CDTVerrouille;
					},
				};
			};
			const lLigne = [];
			lLigne.push('<div class="flex-contain flex-center" style="gap:0.4rem;">');
			lLigne.push(
				IE.jsx.str("ie-btnicon", {
					id: this.idBtnPJ + { aLigne },
					"ie-model": lModelbtnPJ,
					class: ["p-all-s", aIcone, "color-neutre"],
					style: "font-size:1.6rem;",
				}),
			);
			lLigne.push(
				UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
					lListeDocJointDuGenre,
					{ maxWidth: lLargeurMaxChips, class: "AlignementMilieuVertical" },
				),
			);
			lLigne.push("</div>");
			return lLigne.join("");
		};
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "flex-contain flex-cols", style: "gap: 0.5rem;" },
				lFuncConstruitLigne("icon_piece_jointe"),
			),
		);
		return H.join("");
	}
}
exports.DonneesListe_TAFsCDT = DonneesListe_TAFsCDT;
(function (DonneesListe_TAFsCDT) {
	let colonnes;
	(function (colonnes) {
		colonnes["description"] = "description";
		colonnes["pourLe"] = "pourLe";
		colonnes["aRendre"] = "aRendre";
		colonnes["themes"] = "themes";
		colonnes["eleves"] = "eleves";
		colonnes["docsJoints"] = "docsJoints";
		colonnes["duree"] = "duree";
		colonnes["niveau"] = "niveau";
	})(
		(colonnes =
			DonneesListe_TAFsCDT.colonnes || (DonneesListe_TAFsCDT.colonnes = {})),
	);
	let menuContextuelListeTAFs;
	(function (menuContextuelListeTAFs) {
		menuContextuelListeTAFs[(menuContextuelListeTAFs["ParametrageQCM"] = 6)] =
			"ParametrageQCM";
		menuContextuelListeTAFs[(menuContextuelListeTAFs["SupprimerDJ"] = 7)] =
			"SupprimerDJ";
		menuContextuelListeTAFs[(menuContextuelListeTAFs["DevoirAssocieQCM"] = 9)] =
			"DevoirAssocieQCM";
		menuContextuelListeTAFs[
			(menuContextuelListeTAFs["EvaluationAssocieeQCM"] = 10)
		] = "EvaluationAssocieeQCM";
	})(
		(menuContextuelListeTAFs =
			DonneesListe_TAFsCDT.menuContextuelListeTAFs ||
			(DonneesListe_TAFsCDT.menuContextuelListeTAFs = {})),
	);
})(
	DonneesListe_TAFsCDT ||
		(exports.DonneesListe_TAFsCDT = DonneesListe_TAFsCDT = {}),
);
function _textAreaToDescription(aValeur) {
	return "<div>" + aValeur.replace(/\n/g, "<br>\n") + "</div>";
}
function _getListeDJs(aElement, ...aGenresDocJoint) {
	if (!aElement.ListePieceJointe) {
		return new ObjetListeElements_1.ObjetListeElements();
	}
	return aElement.ListePieceJointe.getListeElements((aPieceJointeDArticle) => {
		return (
			aPieceJointeDArticle.getEtat() !==
				Enumere_Etat_1.EGenreEtat.Suppression &&
			(aGenresDocJoint.length === 0 ||
				aGenresDocJoint.includes(aPieceJointeDArticle.getGenre()))
		);
	});
}
function getDescriptionExecutionQCM(aExecutionQCM, aDescriptif) {
	return (
		ObjetChaine_1.GChaine.supprimerBalisesHtml(aDescriptif) +
		" (" +
		UtilitaireQCM_1.UtilitaireQCM.getStrResumeModalites(aExecutionQCM, true) +
		")"
	);
}
