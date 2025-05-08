const { GHtml } = require("ObjetHtml.js");
const { EGenreCommandeMenu } = require("Enumere_CommandeMenu.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GDate } = require("ObjetDate.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { TUtilitaireDuree } = require("UtilitaireDuree.js");
const { UtilitaireQCM } = require("UtilitaireQCM.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const { TypeGenreRenduTAFUtil } = require("TypeGenreRenduTAF.js");
const { TypeNiveauDifficulteUtil } = require("TypeNiveauDifficulte.js");
const { GChaine } = require("ObjetChaine.js");
const { GUID } = require("GUID.js");
class DonneesListe_TAFsCDT extends ObjetDonneesListe {
	constructor(aParams) {
		super(aParams.listeTAFs);
		this.parametres = aParams;
		this.idBtnPJ = GUID.getId() + "_btnPJ_";
		this.setOptions({ avecTrimSurEdition: true, avecMultiSelection: true });
	}
	getControleur(aDonneesListe, aListe) {
		return $.extend(true, super.getControleur(aDonneesListe, aListe), {
			btnPJ: {
				event(aLigne) {
					const lArticle = aListe.getArticleDeLigne(aLigne);
					aDonneesListe.parametres.callbackPJ(
						lArticle,
						aDonneesListe.idBtnPJ + aLigne,
					);
				},
				getTitle() {
					return GTraductions.getValeur("CahierDeTexte.docJoints");
				},
				getDisabled() {
					let lAvecDocumentJoint =
						aDonneesListe.parametres.avecDocumentJoint[
							EGenreDocumentJoint.Fichier
						];
					lAvecDocumentJoint =
						lAvecDocumentJoint ||
						aDonneesListe.parametres.avecDocumentJoint[
							EGenreDocumentJoint.Cloud
						];
					lAvecDocumentJoint =
						lAvecDocumentJoint ||
						aDonneesListe.parametres.avecDocumentJoint[EGenreDocumentJoint.Url];
					lAvecDocumentJoint =
						lAvecDocumentJoint ||
						aDonneesListe.parametres.avecDocumentJoint[
							EGenreDocumentJoint.LienKiosque
						];
					return !lAvecDocumentJoint || aDonneesListe.parametres.CDTVerrouille;
				},
			},
			nodeParametresExecQCM: function (aLigne) {
				$(this.node).eventValidation(() => {
					const lArticle = aListe.getArticleDeLigne(aLigne);
					aDonneesListe.parametres.evenementMenuContextuelListeTAF(
						{
							genre:
								DonneesListe_TAFsCDT.menuContextuelListeTAFs.ParametrageQCM,
							element: lArticle,
						},
						null,
					);
				});
			},
			nodeDevoirAssocieQCM: function (aLigne) {
				$(this.node).eventValidation(() => {
					const lArticle = aListe.getArticleDeLigne(aLigne);
					aDonneesListe.parametres.evenementMenuContextuelListeTAF(
						{
							genre:
								DonneesListe_TAFsCDT.menuContextuelListeTAFs.DevoirAssocieQCM,
							element: lArticle,
						},
						null,
					);
				});
			},
			nodeEvaluationAssocieeQCM: function () {},
		});
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_TAFsCDT.colonnes.description: {
				if (aParams.surEdition && !aParams.article.avecMiseEnForme) {
					return GChaine.supprimerBalisesHtml(aParams.article.descriptif);
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
					const lHtml =
						'<span role="link" aria-haspopup="dialog" tabindex="0" class="AvecMain Lien" ' +
						GHtml.composeAttr("ie-node", "nodeParametresExecQCM", [
							aParams.ligne,
						]) +
						">" +
						GDate.formatDate(
							aParams.article.executionQCM.dateDebutPublication,
							"%JJ/%MM - %hh%sh%mm",
						) +
						"</span> ";
					lStrDescription.push(
						GTraductions.getValeur("CahierDeTexte.taf.DisponibleAPartirDuNet", [
							lHtml,
						]),
					);
					if (!this.parametres.CDTPublie) {
						lStrDescription.push(
							"(",
							GTraductions.getValeur(
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
							GTraductions.getValeur("CahierDeTexte.taf.AssocieA"),
							" ",
						);
						const lAvecElementAssocieCliquable = false;
						const lLibelleAssociation = aParams.article.executionQCM
							.estLieADevoir
							? GTraductions.getValeur("CahierDeTexte.taf.unDevoir")
							: GTraductions.getValeur("CahierDeTexte.taf.uneEvaluation");
						if (lAvecElementAssocieCliquable) {
							const lNomIENode = !!aParams.article.executionQCM.estLieADevoir
								? "nodeDevoirAssocieQCM"
								: "nodeEvaluationAssocieeQCM";
							lStrDescription.push(
								'<span role="link" aria-haspopup="dialog" tabindex="0" class="AvecMain Lien" ',
								GHtml.composeAttr("ie-node", lNomIENode, [aParams.ligne]),
								">",
								lLibelleAssociation,
								"</span>",
							);
						} else {
							lStrDescription.push(lLibelleAssociation);
						}
					}
				} else {
					lStrDescription.push(
						`<div class="tiny-view">${aParams.article.descriptif}</div>`,
					);
				}
				return lStrDescription.join("");
			}
			case DonneesListe_TAFsCDT.colonnes.pourLe:
				return GDate.formatDate(aParams.article.PourLe, "%JJJ %J %MMM");
			case DonneesListe_TAFsCDT.colonnes.aRendre:
				return aParams.article.executionQCM
					? GTraductions.getValeur("CahierDeTexte.TAFARendre.ACompleterEditeur")
					: TypeGenreRenduTAFUtil.getLibelle(aParams.article.genreRendu);
			case DonneesListe_TAFsCDT.colonnes.themes:
				return aParams.article.ListeThemes &&
					aParams.article.ListeThemes.count()
					? aParams.article.ListeThemes.getTableauLibelles().join(", ")
					: "";
			case DonneesListe_TAFsCDT.colonnes.eleves:
				if (aParams.article.estPourTous) {
					return this.parametres.listeElevesDetaches &&
						this.parametres.listeElevesDetaches.count() > 0
						? GTraductions.getValeur("CahierDeTexte.TAF.attendus")
						: GTraductions.getValeur("CahierDeTexte.TAF.tousEleves");
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
							GTraductions.getValeur("CahierDeTexte.TAF.attendus"),
						);
					} else if (lListeElevesAttendus.count() > 0) {
						lChaineEleves.push(
							GTraductions.getValeur("CahierDeTexte.TAF.nbElevesAttendus", [
								lListeElevesAttendus.count(),
							]),
						);
					}
					if (lNbrElevesTafDetaches > 0) {
						if (lNbrElevesTafDetaches === 1) {
							lChaineEleves.push(
								GTraductions.getValeur("CahierDeTexte.TAF.1EleveDetache"),
							);
						} else {
							lChaineEleves.push(
								GTraductions.getValeur("CahierDeTexte.TAF.nbElevesDetaches", [
									lNbrElevesTafDetaches,
								]),
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
				return _construireDocsJoints.call(this, aParams.article, aParams.ligne);
			case DonneesListe_TAFsCDT.colonnes.duree: {
				if (aParams.surEdition) {
					return aParams.article.duree;
				}
				const lDuree = aParams.article.executionQCM
						? TUtilitaireDuree.dureeEnMin(
								aParams.article.executionQCM.dureeMaxQCM,
							)
						: aParams.article.duree,
					lFormatMin = lDuree > 60 ? "%mm" : "%xm";
				return lDuree > 0
					? GDate.formatDureeEnMillisecondes(
							lDuree * 60 * 1000,
							lDuree > 60 ? "%xh%sh" + lFormatMin : lFormatMin + "mn",
						)
					: "";
			}
			case DonneesListe_TAFsCDT.colonnes.niveau:
				return TypeNiveauDifficulteUtil.typeToStr(
					aParams.article.niveauDifficulte,
				);
		}
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_TAFsCDT.colonnes.description:
				return aParams.surEdition
					? ObjetDonneesListe.ETypeCellule.ZoneTexte
					: ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_TAFsCDT.colonnes.docsJoints:
				return ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe.ETypeCellule.Texte;
	}
	getHintHtmlForce(aParams) {
		let lListe;
		const lHtml = [];
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
						lLibelle += '<i class="icon_eleve_detache"></i>';
					}
					lHtml.push("<div>", lLibelle, "</div>");
				});
				return lHtml.join("");
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
			default:
		}
	}
	getControleCaracteresInput(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_TAFsCDT.colonnes.duree:
				return { mask: /^0-9/i, tailleMax: 10 };
		}
		return null;
	}
	surCreation(aArticle, V) {
		this.parametres.completerTAFEnCreation(aArticle);
		aArticle.descriptif = _textAreaToDescription(V[0]);
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
					!TypeGenreRenduTAFUtil.estUnRenduKiosque(aParams.article.genreRendu)
				);
		}
		return true;
	}
	avecEvenementEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_TAFsCDT.colonnes.aRendre:
				return (
					!aParams.article.executionQCM &&
					!TypeGenreRenduTAFUtil.estUnRenduKiosque(aParams.article.genreRendu)
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
						GApplication.parametresUtilisateur.get(
							"CDT.TAF.ActiverMiseEnForme",
						))
				);
		}
		return false;
	}
	getCouleurCellule(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_TAFsCDT.colonnes.docsJoints:
				if (!aParams.article.executionQCM && !this.parametres.CDTVerrouille) {
					return ObjetDonneesListe.ECouleurCellule.Blanc;
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
					ObjetTri.init((aElement) => {
						return GChaine.supprimerBalisesHtml(aElement.descriptif);
					}, aGenreTri),
				);
				break;
			case DonneesListe_TAFsCDT.colonnes.pourLe:
				T.push(ObjetTri.init("PourLe", aGenreTri));
				break;
			case DonneesListe_TAFsCDT.colonnes.aRendre:
				T.push(ObjetTri.init("genreRendu", aGenreTri));
				break;
			case DonneesListe_TAFsCDT.colonnes.themes:
				T.push(
					ObjetTri.init((aElement) => {
						return aElement.ListeThemes.getTableauLibelles().join("");
					}, aGenreTri),
				);
				break;
			case DonneesListe_TAFsCDT.colonnes.eleves:
				T.push(
					ObjetTri.init((aElement) => {
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
					ObjetTri.init((aElement) => {
						return aElement.ListePieceJointe.getTableauLibelles().join("");
					}, aGenreTri),
				);
				break;
			case DonneesListe_TAFsCDT.colonnes.duree:
				T.push(ObjetTri.init("duree", aGenreTri));
				break;
			case DonneesListe_TAFsCDT.colonnes.niveau:
				T.push(ObjetTri.init("niveauDifficulte", aGenreTri));
				break;
		}
		T.push(
			ObjetTri.init((aElement) => {
				return GChaine.supprimerBalisesHtml(aElement.descriptif);
			}),
		);
		return T;
	}
	avecMenuContextuel(aParams) {
		if (aParams.ligne === -1) {
			return true;
		}
		return super.avecMenuContextuel(aParams);
	}
	remplirMenuContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		if (aParametres.ligne === -1 && aParametres.avecCreation) {
			aParametres.menuContextuel.addCommande(
				GApplication.parametresUtilisateur.get("CDT.TAF.ActiverMiseEnForme")
					? DonneesListe_TAFsCDT.menuContextuelListeTAFs.SaisirTravail
					: EGenreCommandeMenu.Creation,
				GTraductions.getValeur("CahierDeTexte.TAF_SaisirUnTravail"),
			);
			aParametres.menuContextuel.addSeparateur();
			this.parametres.listeModeles.parcourir((aElement) => {
				aParametres.menuContextuel.addCommande(
					DonneesListe_TAFsCDT.menuContextuelListeTAFs.ListeModeles,
					aElement.getLibelle(),
					true,
					{ modele: aElement },
				);
			});
			aParametres.menuContextuel.addCommande(
				DonneesListe_TAFsCDT.menuContextuelListeTAFs.EnrichirListe,
				GTraductions.getValeur("CahierDeTexte.TAF_EnrichirLaListe"),
			);
			aParametres.menuContextuel.addSeparateur();
			aParametres.menuContextuel.addCommande(
				DonneesListe_TAFsCDT.menuContextuelListeTAFs.QCM,
				GTraductions.getValeur("CahierDeTexte.TAF_QCM"),
			);
			if (this.parametres.avecGestionNotation) {
				aParametres.menuContextuel.addCommande(
					DonneesListe_TAFsCDT.menuContextuelListeTAFs.QCMAvecDevoir,
					GTraductions.getValeur("CahierDeTexte.TAF_QCMAvecDevoir"),
					this.parametres.avecQCMDevoir,
				);
			}
			aParametres.menuContextuel.addCommande(
				DonneesListe_TAFsCDT.menuContextuelListeTAFs.QCMAvecEvaluation,
				GTraductions.getValeur("CahierDeTexte.TAF_QCMAvecEvaluation"),
				this.parametres.avecQCMEvaluation,
			);
			if (
				this.parametres.avecRessourcesGranulaire &&
				GEtatUtilisateur.activerKiosqueRenduTAF &&
				GEtatUtilisateur.avecRessourcesRenduTAF
			) {
				aParametres.menuContextuel.addCommande(
					DonneesListe_TAFsCDT.menuContextuelListeTAFs.DevoirKiosque,
					GTraductions.getValeur("CahierDeTexte.TAF_RenduKiosque"),
				);
			}
		} else {
			aParametres.menuContextuel.addCommande(
				EGenreCommandeMenu.Edition,
				GTraductions.getValeur("liste.modifier"),
				!aParametres.nonEditable &&
					(!aParametres.listeSelection ||
						aParametres.listeSelection.count() <= 1) &&
					this.avecEdition(aParametres),
			);
			aParametres.menuContextuel.addCommande(
				DonneesListe_TAFsCDT.menuContextuelListeTAFs.ParametrageQCM,
				GTraductions.getValeur("CahierDeTexte.ModifierQCMTAF"),
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
					GTraductions.getValeur("CahierDeTexte.taf.supprimerDJ"),
					(aInstanceSousMenu) => {
						lListeDJs.parcourir((aDJ) => {
							let lLibelleDoc = aDJ.getLibelle();
							if (!lLibelleDoc) {
								if (aDJ.getGenre() === EGenreDocumentJoint.Url) {
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
								case EGenreDocumentJoint.Fichier:
									lElement.icon = "icon_piece_jointe";
									break;
								case EGenreDocumentJoint.Url:
									lElement.icon = "icon_globe";
									break;
								case EGenreDocumentJoint.Cloud:
									lElement.icon = "icon_cloud";
									break;
								case EGenreDocumentJoint.LienKiosque:
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
				EGenreCommandeMenu.Suppression,
				GTraductions.getValeur("CahierDeTexte.taf.SupprimerTAFsSelect"),
				!aParametres.nonEditable && this._avecSuppression(aParametres),
			);
		}
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
		const lMessage = [GTraductions.getValeur("liste.suppressionSelection")];
		let lAvecRendusEleves = false;
		if (aListeSelections && aListeSelections.count() > 1) {
			aListeSelections.parcourir((aTAF) => {
				if (
					aTAF &&
					TypeGenreRenduTAFUtil.estUnRenduEnligne(aTAF.genreRendu, false) &&
					!lAvecRendusEleves
				) {
					lAvecRendusEleves = aTAF.nbrRendus > 0;
				}
			});
		} else {
			if (
				aArticle &&
				TypeGenreRenduTAFUtil.estUnRenduEnligne(aArticle.genreRendu, false)
			) {
				lAvecRendusEleves = aArticle.nbrRendus > 0;
			}
		}
		if (lAvecRendusEleves) {
			lMessage.push(
				"<br>",
				GTraductions.getValeur("CahierDeTexte.existeCopieRenduParEleve"),
			);
		}
		return lMessage.join("");
	}
}
DonneesListe_TAFsCDT.colonnes = {
	description: "description",
	pourLe: "pourLe",
	aRendre: "aRendre",
	themes: "themes",
	eleves: "eleves",
	docsJoints: "docsJoints",
	duree: "duree",
	niveau: "niveau",
};
DonneesListe_TAFsCDT.menuContextuelListeTAFs = {
	SaisirTravail: 0,
	EnrichirListe: 1,
	ListeModeles: 2,
	QCM: 3,
	QCMAvecDevoir: 4,
	QCMAvecEvaluation: 5,
	ParametrageQCM: 6,
	SupprimerDJ: 7,
	DevoirKiosque: 8,
	DevoirAssocieQCM: 9,
	EvaluationAssocieeQCM: 10,
};
function _textAreaToDescription(aValeur) {
	return "<div>" + aValeur.replace(/\n/g, "<br>\n") + "</div>";
}
function _getListeDJs(aElement, ...aGenresDocJoint) {
	if (!aElement.ListePieceJointe) {
		return new ObjetListeElements();
	}
	return aElement.ListePieceJointe.getListeElements((aPieceJointeDArticle) => {
		return (
			aPieceJointeDArticle.getEtat() !== EGenreEtat.Suppression &&
			(aGenresDocJoint.length === 0 ||
				aGenresDocJoint.includes(aPieceJointeDArticle.getGenre()))
		);
	});
}
function _construireDocsJoints(aArticle, aLigne) {
	const lFuncConstruitLigne = function (aIcone) {
		const lLargeurMaxChips = 275;
		const lListeDocJointDuGenre = _getListeDJs(aArticle);
		lListeDocJointDuGenre.trier();
		const lLigne = [];
		lLigne.push('<div class="flex-contain flex-center" style="gap:0.4rem;">');
		lLigne.push(
			`<ie-btnicon id="${this.idBtnPJ + aLigne}" ${GHtml.composeAttr("ie-model", "btnPJ", [aLigne])} class="p-all-s ${aIcone} color-neutre" style="font-size:1.6rem;"></ie-btnicon>`,
		);
		lLigne.push(
			UtilitaireUrl.construireListeUrls(lListeDocJointDuGenre, {
				maxWidth: lLargeurMaxChips,
				class: "AlignementMilieuVertical",
			}),
		);
		lLigne.push("</div>");
		return lLigne.join("");
	};
	const H = [];
	H.push('<div class="flex-contain flex-cols" style="gap: 0.5rem;">');
	H.push(lFuncConstruitLigne.call(this, "icon_piece_jointe"));
	H.push("</div>");
	return H.join("");
}
function getDescriptionExecutionQCM(aExecutionQCM, aDescriptif) {
	return (
		GChaine.supprimerBalisesHtml(aDescriptif) +
		" (" +
		UtilitaireQCM.getStrResumeModalites(aExecutionQCM, true) +
		")"
	);
}
module.exports = DonneesListe_TAFsCDT;
