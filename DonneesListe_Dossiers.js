exports.DonneesListe_Dossiers = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_ElementDossier_1 = require("Enumere_ElementDossier");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Media_1 = require("Enumere_Media");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const AccessApp_1 = require("AccessApp");
const GlossaireDossierVieScolaire_1 = require("GlossaireDossierVieScolaire");
class DonneesListe_Dossiers extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.setOptions({
			avecDeploiement: true,
			avecImageSurColonneDeploiement: true,
			avecEventDeploiementSurCellule: false,
			avecEvnt_Creation: true,
			avecEvnt_ApresCreation: true,
			avecEvnt_Suppression: true,
			avecInterruptionSuppression: true,
		});
		if (aParam) {
			this.eventAjouter = aParam.callbackAjouterElement;
			this.callbackVoirDiscussion = aParam.callbackVoirDiscussion;
			this.callbackmodifierDossier = aParam.callbackmodifierDossier;
			this.callbacksupprimerDossier = aParam.callbacksupprimerDossier;
			this.callbackmodifierElement = aParam.callbackmodifierElement;
			this.callbacksupprimerElement = aParam.callbacksupprimerElement;
		}
		this.autorisations = {
			modifier: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.dossierVS.modifierDossiersVS,
			),
			publie: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.dossierVS.publierDossiersVS,
			),
			accesDecrochage: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.decrochageScolaire.acces,
			),
			suiviDecrochage: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.decrochageScolaire.suivi,
			),
		};
	}
	jsxNodeBtnAjouterElement(aArticle, aNode) {
		$(aNode).eventValidation(() => {
			if (this.eventAjouter && aArticle) {
				this.eventAjouter(aArticle);
			}
		});
	}
	getControleur(aDonneesListe, aListe) {
		return $.extend(true, super.getControleur(aDonneesListe, aListe), {
			nodePJ: function (aligne) {
				const lArticle = aDonneesListe.Donnees.get(aligne);
				if (lArticle && lArticle.listePJ) {
					$(this.node).eventValidation(() => {
						ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
							pere: aListe,
							initCommandes: function (aMenu) {
								lArticle.listePJ.parcourir((aDocument) => {
									if (aDocument.existe()) {
										aMenu.add(aDocument.getLibelle(), true, () => {
											aDonneesListe._openDocumentDArticle(aDocument);
										});
									}
								});
							},
						});
					});
				}
			},
		});
	}
	avecDeploiementSurColonne(aParams) {
		return aParams.idColonne === DonneesListe_Dossiers.colonnes.evenement;
	}
	avecSelection() {
		return (
			GEtatUtilisateur.GenreEspace === Enumere_Espace_1.EGenreEspace.Professeur
		);
	}
	avecEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Dossiers.colonnes.publie: {
				if (aParams.article.estUneDiscussion) {
					return false;
				} else {
					return (
						!!this.autorisations.publie &&
						this._estAutoriseAModifier(aParams.article)
					);
				}
			}
		}
		return false;
	}
	avecEvenementSelectionDblClick(aParams) {
		if (!aParams.article.estUneDiscussion) {
			return this._estAutoriseAModifier(aParams.article);
		}
		return false;
	}
	avecSuppression(aParams) {
		return this._estAutoriseAModifier(aParams.article);
	}
	suppressionConfirmation() {
		return false;
	}
	getLibelleDraggable(aParams) {
		return this._getTitrePrincipal(aParams.article);
	}
	getClassCelluleConteneur(aParams) {
		const lClasses = [];
		if (aParams.idColonne === DonneesListe_Dossiers.colonnes.pieceJointe) {
			lClasses.push("AlignementMilieu");
		}
		return lClasses.join(" ");
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Dossiers.colonnes.evenement:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_Dossiers.colonnes.publie:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
			case DonneesListe_Dossiers.colonnes.pieceJointe:
			case DonneesListe_Dossiers.colonnes.interlocuteur:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getCouleurCellule(aParams) {
		if (!aParams.article.pere) {
			if (!this.avecEdition(aParams)) {
				return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule
					.Deploiement;
			}
		}
	}
	getTri() {
		const lTris = [];
		lTris.push(
			ObjetTri_1.ObjetTri.init(
				"date",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
		);
		lTris.push(
			ObjetTri_1.ObjetTri.init(
				"rang",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
		);
		return [ObjetTri_1.ObjetTri.initRecursif("pere", lTris)];
	}
	fusionCelluleAvecColonnePrecedente(aParams) {
		return (
			!!aParams.article && aParams.article.estDossier && aParams.colonne < 5
		);
	}
	surEdition(aParams, V) {
		let lElement;
		switch (aParams.idColonne) {
			case DonneesListe_Dossiers.colonnes.publie:
				aParams.article.publie = V;
				if (aParams.article.estDossier) {
					this.dossierCourant = aParams.article;
					for (let i = 0; i < this.dossierCourant.listeElements.count(); i++) {
						lElement = this.dossierCourant.listeElements.get(i);
						if (lElement.publie !== this.dossierCourant.publie) {
							lElement.publie = this.dossierCourant.publie;
							lElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						}
					}
				} else {
					let nbPublies = 0;
					this.dossierCourant = aParams.article.pere;
					for (let j = 0; j < this.dossierCourant.listeElements.count(); j++) {
						lElement = this.dossierCourant.listeElements.get(j);
						if (lElement.publie) {
							nbPublies++;
						}
					}
					this.dossierCourant.publie = nbPublies > 0;
					this.dossierCourant.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
				break;
		}
	}
	getValeur(aParams) {
		const H = [];
		switch (aParams.idColonne) {
			case DonneesListe_Dossiers.colonnes.evenement:
				if (aParams.article.estDossier) {
					return this.composeElement(aParams);
				} else {
					const lStrMedia = [];
					if (
						aParams.article.getGenre() ===
						Enumere_ElementDossier_1.EGenreElementDossier.Communication
					) {
						lStrMedia.push(
							IE.jsx.str(
								"div",
								{ class: "fix-bloc" },
								IE.jsx.str("i", {
									class: Enumere_Media_1.EGenreMediaUtil.getClassesIconeMedia(
										aParams.article.element.type.Genre,
										aParams.article.avecReponseCourrier,
									),
									role: "img",
									"ie-tooltiplabel": aParams.article.getLibelle(),
								}),
							),
						);
					}
					H.push(
						IE.jsx.str(
							"div",
							{
								class: "flex-contain full-width p-left-l",
								title: aParams.article.titre,
							},
							IE.jsx.str(
								"div",
								{ class: "fluid-bloc" },
								aParams.article.getLibelle(),
							),
							lStrMedia.join(""),
						),
					);
					return H.join("");
				}
			case DonneesListe_Dossiers.colonnes.date:
				return aParams.article.estDossier ? "" : aParams.article.strDate;
			case DonneesListe_Dossiers.colonnes.responsable:
				return aParams.article.estDossier
					? ""
					: aParams.article.element.respAdmin.getLibelle();
			case DonneesListe_Dossiers.colonnes.interlocuteur:
				if (aParams.article.estUneDiscussion) {
					if (aParams.article.listeInterlocuteurs.count() > 1) {
						return '<div class="Image_Messagerie_Groupe"></div>';
					} else {
						return aParams.article.listeInterlocuteurs.get(0).getLibelle();
					}
				} else {
					return aParams.article.estDossier
						? ""
						: aParams.article.interlocuteur;
				}
			case DonneesListe_Dossiers.colonnes.complementInfo:
				return aParams.article.estDossier ? "" : aParams.article.commentaire;
			case DonneesListe_Dossiers.colonnes.pieceJointe:
				if (!!aParams.article.listePJ) {
					const lListePJSansEtat = aParams.article.listePJ.getListeElements(
						(aElement) => {
							return (
								!!aElement &&
								aElement.getEtat() === Enumere_Etat_1.EGenreEtat.Aucun
							);
						},
					);
					if (lListePJSansEtat.count() > 0) {
						const lArrHint = [];
						lListePJSansEtat.parcourir((aPJ) => {
							lArrHint.push(aPJ.getLibelle());
						});
						const lStrHint = lArrHint.join(", ");
						if (lListePJSansEtat.count() === 1) {
							H.push(
								ObjetChaine_1.GChaine.composerUrlLienExterne({
									libelleEcran:
										'<i class="icon_piece_jointe" title="' +
										lStrHint +
										'" role="img"></i>',
									documentJoint: lListePJSansEtat.get(0),
									afficherIconeDocument: false,
									genreRessource:
										Enumere_Ressource_1.EGenreRessource.DocJointEleve,
								}),
							);
						} else {
							H.push(
								'<i class="icon_piece_jointe AvecMain" style="margin-left:auto; margin-right:auto;" title="' +
									lStrHint +
									'" ' +
									ObjetHtml_1.GHtml.composeAttr(
										"ie-node",
										"nodePJ",
										aParams.ligne,
									) +
									' role="img" tabindex="0" aria-haspopup="true"></i>',
							);
						}
					}
				}
				return H.join("");
			case DonneesListe_Dossiers.colonnes.publie:
				return aParams.article.publie;
			default:
		}
		return "";
	}
	getTooltip(aParams) {
		const lHint = [];
		switch (aParams.idColonne) {
			case DonneesListe_Dossiers.colonnes.interlocuteur:
				if (aParams.article.estUneDiscussion) {
					aParams.article.listeInterlocuteurs.parcourir((aInt) => {
						lHint.push(aInt.getLibelle());
					});
				}
				return aParams.article.estUneDiscussion ? lHint.join("<br/> ") : "";
		}
		return "";
	}
	avecMenuContextuel() {
		return (
			GEtatUtilisateur.GenreEspace === Enumere_Espace_1.EGenreEspace.Professeur
		);
	}
	remplirMenuContextuel(aParametres) {
		if (!aParametres.menuContextuel || !aParametres.article) {
			return;
		}
		const lDroitModification = this._estAutoriseAModifier(aParametres.article);
		if (!aParametres.article.estDecrochageScolaire) {
			if (aParametres.article.estDossier) {
				if (this.callbackmodifierDossier) {
					aParametres.menuContextuel.addCommande(
						DonneesListe_Dossiers.genreAction.modifierDossier,
						ObjetTraduction_1.GTraductions.getValeur("Editer"),
						lDroitModification,
					);
				}
				if (this.callbacksupprimerDossier) {
					aParametres.menuContextuel.addCommande(
						DonneesListe_Dossiers.genreAction.supprimerDossier,
						ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
						lDroitModification,
					);
				}
			} else {
				const lDroitEdition =
					lDroitModification &&
					aParametres.article.getGenre() ===
						Enumere_ElementDossier_1.EGenreElementDossier.Communication;
				if (this.callbackmodifierElement) {
					aParametres.menuContextuel.addCommande(
						DonneesListe_Dossiers.genreAction.modifierElement,
						ObjetTraduction_1.GTraductions.getValeur("Editer"),
						lDroitEdition,
					);
				}
				if (this.callbacksupprimerElement) {
					aParametres.menuContextuel.addCommande(
						DonneesListe_Dossiers.genreAction.supprimerElement,
						ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
						lDroitEdition,
					);
				}
			}
		}
		if (aParametres.article.estUneDiscussion && this.callbackVoirDiscussion) {
			aParametres.menuContextuel.add(
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
					.VoirDiscussion,
				true,
				() => {
					this.callbackVoirDiscussion(aParametres.article);
				},
			);
		}
	}
	evenementMenuContextuel(aParametres) {
		switch (aParametres.numeroMenu) {
			case DonneesListe_Dossiers.genreAction.modifierDossier:
				this.callbackmodifierDossier(aParametres.article);
				break;
			case DonneesListe_Dossiers.genreAction.supprimerDossier:
				this.callbacksupprimerDossier(aParametres.article);
				break;
			case DonneesListe_Dossiers.genreAction.modifierElement:
				this.callbackmodifierElement(aParametres.article);
				break;
			case DonneesListe_Dossiers.genreAction.supprimerElement:
				this.callbacksupprimerElement(aParametres.article);
				break;
			default:
		}
	}
	_estAutoriseAModifier(aArticle) {
		let lDroitModification = false;
		if (
			!!aArticle &&
			GEtatUtilisateur.GenreEspace === Enumere_Espace_1.EGenreEspace.Professeur
		) {
			let lDossierCorrespondant = null;
			if (aArticle.estDossier) {
				lDossierCorrespondant = aArticle;
			} else {
				lDossierCorrespondant = aArticle.pere;
			}
			if (
				lDossierCorrespondant &&
				lDossierCorrespondant.estDecrochageScolaire
			) {
				lDroitModification = this.autorisations.suiviDecrochage;
			} else if (!!lDossierCorrespondant) {
				const lEstDossierPerso =
					!!lDossierCorrespondant.respAdmin &&
					lDossierCorrespondant.respAdmin.getNumero() ===
						GEtatUtilisateur.getUtilisateur().getNumero();
				lDroitModification =
					this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.dossierVS.creerDossiersVS,
					) &&
					(lEstDossierPerso || this.autorisations.modifier);
			}
		}
		return lDroitModification;
	}
	_getTitre(aDossier) {
		const H = [];
		const lString = [];
		if (aDossier.lieu.Libelle !== "") {
			lString.push(
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire.Lieu,
				" : ",
				aDossier.lieu.Libelle,
			);
		}
		if (aDossier.victime.Libelle !== "") {
			if (lString.length > 0) {
				lString.push(" - ");
			}
			lString.push(
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire.Victime,
				" : ",
				aDossier.victime.Libelle,
			);
		}
		if (aDossier.temoin.Libelle !== "") {
			if (lString.length > 0) {
				lString.push(" - ");
			}
			lString.push(
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire.Temoin,
				" : ",
				aDossier.temoin.Libelle,
			);
		}
		H.push('<span class="semi-bold">');
		H.push(this._getTitrePrincipal(aDossier));
		H.push("</span>");
		if (lString.length > 0) {
			H.push(" - ", lString.join(""));
		}
		return H.join("");
	}
	_getTitrePrincipal(aDossier) {
		let lStrLibellePrincipal = [];
		if (aDossier.estDecrochageScolaire) {
			lStrLibellePrincipal.push(aDossier.titre);
		} else if (aDossier.listeMotifs) {
			lStrLibellePrincipal.push(
				aDossier.listeMotifs.getTableauLibelles().join(", "),
			);
			lStrLibellePrincipal.push(
				ObjetDate_1.GDate.formatDate(aDossier.date, " - %JJ/%MM/%AA"),
			);
		}
		return lStrLibellePrincipal.join("");
	}
	_openDocumentDArticle(aDocument) {
		window.open(
			ObjetChaine_1.GChaine.creerUrlBruteLienExterne(aDocument, {
				genreRessource: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
			}),
		);
	}
	composeElement(aParams) {
		const H = [];
		H.push(
			`<div class="flex-contain flex-center full-width p-y-s p-x">\n              <div class="${aParams.article.deploye ? ` p-left-l` : ` p-left-xl m-left-s`}">`,
		);
		if (
			GEtatUtilisateur.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Professeur &&
			this._estAutoriseAModifier(aParams.article)
		) {
			H.push(
				IE.jsx.str("ie-btnicon", {
					"ie-node": this.jsxNodeBtnAjouterElement.bind(this, aParams.article),
					class: "icon_plus_cercle icone-m color-neutre m-right-l",
					"aria-label":
						GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
							.AjouterElement,
					title:
						GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
							.AjouterElement,
				}),
			);
		}
		H.push(`</div>`);
		H.push(
			`<div class="fix-bloc ie-line-color static only-color var-height" style="--color-line : ${aParams.article.couleur};--var-height: 1.6rem;"></div>`,
		);
		H.push(`<div class="fluid-bloc flex-contain cols p-all">`);
		H.push(` <p>${this._getTitre(aParams.article)}</p>`);
		H.push(` <p>${aParams.article.commentaire}</p>`);
		H.push(`</div>`);
		H.push(
			`<div class="self-end">${aParams.article && aParams.article.respAdmin ? aParams.article.respAdmin.getLibelle() : ""}</div>`,
		);
		H.push(`</div>`);
		return H.join("");
	}
}
exports.DonneesListe_Dossiers = DonneesListe_Dossiers;
DonneesListe_Dossiers.colonnes = {
	evenement: "evenement",
	date: "date",
	responsable: "responsable",
	interlocuteur: "interlocuteur",
	complementInfo: "complementInfo",
	pieceJointe: "pieceJointe",
	publie: "publie",
	estDossier: "estDossier",
};
DonneesListe_Dossiers.genreAction = {
	modifierDossier: "modifierDossier",
	supprimerDossier: "supprimerDossier",
	modifierElement: "modifierElement",
	supprimerElement: "supprimerElement",
};
