exports.DonneesListe_Casier = void 0;
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const UtilitaireDocument_1 = require("UtilitaireDocument");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetElement_1 = require("ObjetElement");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const UtilitaireDocumentATelecharger_1 = require("UtilitaireDocumentATelecharger");
const GUID_1 = require("GUID");
const Enumere_Espace_1 = require("Enumere_Espace");
const UtilitaireDocumentSignature_1 = require("UtilitaireDocumentSignature");
const UtilitaireCasier_1 = require("UtilitaireCasier");
const ObjetFenetre_ResultatsCasier_1 = require("ObjetFenetre_ResultatsCasier");
const ObjetFenetre_1 = require("ObjetFenetre");
const TypeCasier_1 = require("TypeCasier");
class DonneesListe_Casier extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.ids = {
			labelNatures: GUID_1.GUID.getId(),
			labelClasse: GUID_1.GUID.getId(),
		};
		this.params = aParam;
		this.listeCategories = MethodesObjet_1.MethodesObjet.dupliquer(
			aParam.listeCategories,
		);
		this.listeClasses = MethodesObjet_1.MethodesObjet.dupliquer(
			aParam.listeClasses,
		);
		this.avecToutesLesClasses = aParam.avecToutesLesClasses;
		this.classeSelectionne = aParam.classeSelectionne;
		this.rubriqueCasier = aParam.rubriqueCasier;
		this.genreRubrique = this.rubriqueCasier.getGenre();
		this.estRubriqueMonCasier = [
			UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.monCasier,
		].includes(this.genreRubrique);
		this.estRubriqueDepotProfPers = [
			UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.depositaire,
		].includes(this.genreRubrique);
		this.estRubriqueDepotResponsable = [
			UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.responsable,
		].includes(this.genreRubrique);
		this.estRubriqueDocumentsCasier = [
			UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.monCasier,
			UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.depositaire,
			UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.responsable,
		].includes(this.genreRubrique);
		this.estRubriqueCollecteParDocument = [
			UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.collecteParDocument,
		].includes(this.genreRubrique);
		this.estRubriqueCollecteParEleve = [
			UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.collecteParEleve,
		].includes(this.genreRubrique);
		this.avecFonctionnalite = aParam.avecFonctionnaliteArticle;
		this.evenement = aParam.evenement;
		this.getFiltreParDefaut = aParam.getFiltreParDefaut;
		this.setFiltre = aParam.setFiltre;
		this.getfiltre = aParam.getfiltre;
		this.setIndiceCategorie = aParam.setIndiceCategorie;
		this.setCbNonLu = aParam.setCbNonLu;
		this.setCbNonSigne = aParam.setCbNonSigne;
		this.setFiltreCbNonPublie = aParam.setFiltreCbNonPublie;
		this.setFiltreCbPublie = aParam.setFiltreCbPublie;
		if (this.listeClasses) {
			this.listeClasses.trier();
		}
		if (this.listeCategories.count() > 0) {
			this.listeCategories.insererElement(
				ObjetElement_1.ObjetElement.create({
					estTotal: true,
					Libelle: ObjetTraduction_1.GTraductions.getValeur("Casier.toutes"),
					couleur: undefined,
				}),
				0,
			);
		}
		if (this.avecToutesLesClasses && this.listeClasses.count() > 0) {
			this.listeClasses.insererElement(
				ObjetElement_1.ObjetElement.create({
					estTotal: true,
					Libelle: ObjetTraduction_1.GTraductions.getValeur("Casier.toutes"),
				}),
				0,
			);
		}
		const lEstDiffusion =
			this.estRubriqueDepotProfPers || this.estRubriqueDepotResponsable;
		const lEstCollecte =
			this.estRubriqueCollecteParEleve || this.estRubriqueCollecteParDocument;
		this.visu = {
			memo: this.estRubriqueMonCasier,
			date: this.estRubriqueMonCasier,
			destinataire: lEstDiffusion || this.estRubriqueCollecteParDocument,
			iconModifiable: this.estRubriqueMonCasier,
			classes: false,
			echeance: lEstCollecte,
			nbrCollecte: lEstCollecte,
			dateDeNaissance: this.estRubriqueCollecteParEleve,
		};
		this.setOptions({ avecEvnt_SelectionClick: true, avecEvnt_Creation: true });
		this.optionsCasier = {
			avectri: true,
			avecFiltreCategorie: true,
			avecFiltreNonLus: false,
			avecFiltreNonSignes: false,
			avecFiltrePublication: false,
			avecCouleurNature: false,
			avecIconeFormatFoc: true,
			avecFiltreElevesAvecDocADeposer: false,
			estDestinataire: false,
		};
		this.filtre = this.getfiltre();
	}
	setOptionsCasier(aOptionsCasier) {
		$.extend(this.optionsCasier, aOptionsCasier);
	}
	getTitreZonePrincipale(aParams) {
		switch (this.genreRubrique) {
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.monCasier: {
				if (
					UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
						aParams.article,
					)
				) {
					return UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.composeTitreSelonEtat(
						aParams.article,
					);
				}
				if (aParams.article.estUnDeploiement) {
					return this.composeDeploiement(aParams.article);
				}
				break;
			}
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.documentsASigner: {
				if (
					UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
						aParams.article,
					)
				) {
					return UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.composeTitreSelonEtat(
						aParams.article,
					);
				}
				if (aParams.article.estUnDeploiement) {
					return this.composeDeploiement(aParams.article);
				}
				break;
			}
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.collecteParDocument: {
				if (aParams.article.estUnDeploiement) {
					return this.composeDeploiement(aParams.article, {
						avecCompteur: true,
						avecIconeRubrique: false,
					});
				}
				break;
			}
			default: {
				if (aParams.article.estUnDeploiement) {
					return this.composeDeploiement(aParams.article);
				}
				break;
			}
		}
		return aParams.article.getLibelle();
	}
	composeDeploiement(
		aArticle,
		aParams = { avecCompteur: true, avecIconeRubrique: true },
	) {
		return IE.jsx.str(
			"div",
			{ class: ["flex-contain", "flex-gap"] },
			aParams.avecIconeRubrique &&
				UtilitaireDocumentATelecharger_1.UtilitaireDocumentATelecharger.getIconListeRubrique(
					aArticle,
				),
			IE.jsx.str(
				"div",
				{ class: this.getClassDeploiement() },
				aArticle.getLibelle(),
				" ",
				aParams.avecCompteur &&
					IE.jsx.str(
						IE.jsx.fragment,
						null,
						"(",
						this.getCompteurDeploiement(aArticle),
						")",
					),
			),
		);
	}
	getClassDeploiement() {
		return ["ie-titre-couleur-lowercase", "Gras"].join(" ");
	}
	getCompteurDeploiement(aArticle) {
		if (!aArticle.estUnDeploiement) {
			return 0;
		}
		switch (this.genreRubrique) {
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.collecteParDocument: {
				return this.getArrayFilsVisiblesDePere(aArticle).length;
			}
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.documentsASigner: {
				return this.Donnees.getListeElements((aElement) => {
					let lValue = false;
					if (
						UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
							aElement,
						)
					) {
						if (
							"categorie" in aArticle &&
							aElement.categorie.getNumero() ===
								aArticle.categorie.getNumero() &&
							!aElement.estUnDeploiement
						) {
							lValue = true;
							if (
								this.optionsCasier.avecFiltreNonSignes &&
								this.filtre.cbNonSigne &&
								!UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.estASigner(
									aElement,
								) &&
								!UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.enCoursDeSignature(
									aElement,
								)
							) {
								lValue = false;
							}
						}
					}
					return lValue;
				}).count();
			}
			default: {
				return this.Donnees.getListeElements((aElement) => {
					let lValue = false;
					if (
						"categorie" in aElement &&
						"categorie" in aArticle &&
						aElement.categorie.getNumero() === aArticle.categorie.getNumero() &&
						!aElement.estUnDeploiement
					) {
						lValue = true;
						if (
							this.optionsCasier.avecFiltreNonLus &&
							this.filtre.cbNonLu &&
							(!("estNonLu" in aElement) || !aElement.estNonLu)
						) {
							lValue = false;
						}
					}
					return lValue;
				}).count();
			}
		}
	}
	getAriaLabelZoneCellule(aParams, aZone) {
		if (
			aZone ===
			ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign
				.ZoneCelluleFlatDesign.titre
		) {
			if (
				UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
					aParams.article,
				) &&
				[
					UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
						.documentsASigner,
				].includes(this.genreRubrique)
			) {
				if (!aParams.article.estUnElementInformatif) {
					ObjetTraduction_1.GTraductions.getValeur("Casier.aSignerWai") +
						" " +
						aParams.article.getLibelle();
				}
			} else {
				return aParams.article.estUnDeploiement
					? aParams.article.getLibelle()
					: ObjetTraduction_1.GTraductions.getValeur("Casier.Cmd.Telecharger") +
							" " +
							aParams.article.getLibelle();
			}
		}
	}
	avecBoutonActionLigne(aParams) {
		return (
			super.avecBoutonActionLigne(aParams) &&
			!aParams.article.estUnDeploiement &&
			this.getListeCommandeMenuCtx({ article: aParams.article }).length > 0
		);
	}
	avecSelection(aParams) {
		if (
			UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
				aParams.article,
			) &&
			aParams.article.estUnElementInformatif
		) {
			return false;
		} else {
			if (aParams.article.estUnDeploiement) {
				return false;
			}
			return super.avecSelection(aParams);
		}
	}
	estLigneOff(aParams) {
		switch (this.genreRubrique) {
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.monCasier: {
				if (
					UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
						aParams.article,
					) &&
					!UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.documentArchive(
						aParams.article,
					)
				) {
					return true;
				}
				if (
					"estNonLu" in aParams.article &&
					aParams.article.estNonLu === false
				) {
					return true;
				}
				break;
			}
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.documentsASigner: {
				if (
					UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
						aParams.article,
					) &&
					!UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.documentArchive(
						aParams.article,
					)
				) {
					return (
						!UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.estASigner(
							aParams.article,
						) &&
						!UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.enCoursDeSignature(
							aParams.article,
						)
					);
				}
				break;
			}
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.depositaire:
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.responsable: {
				if (
					"plusConsultable" in aParams.article &&
					aParams.article.plusConsultable
				) {
					return true;
				}
				break;
			}
		}
		return false;
	}
	avecSeparateurLigneHautFlatdesign(aParamsCellule, aParamsCellulePrec) {
		return (
			super.avecSeparateurLigneHautFlatdesign(
				aParamsCellule,
				aParamsCellulePrec,
			) && !aParamsCellulePrec.article.estUnDeploiement
		);
	}
	getTooltip(aParams) {
		if (
			"plusConsultable" in aParams.article &&
			aParams.article.plusConsultable
		) {
			return "hintPersonnel" in aParams.article
				? aParams.article.hintPersonnel
				: super.getTooltip(aParams);
		}
		return super.getTooltip(aParams);
	}
	getZoneMessage(aParams) {
		if (aParams.article.estUnDeploiement) {
			return;
		}
		const H = [];
		if (
			UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
				aParams.article,
			)
		) {
			H.push(
				UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.composeHtmlMessagePourListe(
					aParams.article,
					this.params.callbackSetMesDocuments,
				),
			);
		} else {
			if (this.visu.date) {
				if (
					"infoDepositaire" in aParams.article &&
					aParams.article.infoDepositaire
				) {
					H.push(
						IE.jsx.str(
							"div",
							{ class: "ie-sous-titre" },
							ObjetTraduction_1.GTraductions.getValeur(
								"Casier.dateDestinataire",
								[
									ObjetDate_1.GDate.formatDate(aParams.article.date, "%J %MMM"),
									aParams.article.infoDepositaire,
								],
							),
						),
					);
				} else if ("date" in aParams.article) {
					H.push(
						IE.jsx.str(
							"div",
							{ class: "ie-sous-titre" },
							ObjetDate_1.GDate.formatDate(aParams.article.date, "%J %MMM"),
						),
					);
				}
			}
			if (this.visu.classes) {
				if ("classes" in aParams.article && aParams.article.classes) {
					H.push(
						IE.jsx.str(
							"div",
							{ class: "ie-sous-titre" },
							ObjetTraduction_1.GTraductions.getValeur("Casier.classes") +
								" " +
								aParams.article.classes,
						),
					);
				}
			}
			if (this.visu.dateDeNaissance) {
				if (
					"dateDeNaissance" in aParams.article &&
					aParams.article.dateDeNaissance
				) {
					H.push(
						IE.jsx.str(
							"div",
							{ class: "ie-sous-titre" },
							ObjetTraduction_1.GTraductions.getValeur("Casier.neeLe", [
								ObjetDate_1.GDate.formatDate(
									aParams.article.dateDeNaissance,
									"%J %MMM",
								),
							]),
						),
					);
				}
			}
			if (this.visu.echeance) {
				let lString = "";
				if (
					"sansDepotEspace" in aParams.article &&
					aParams.article.sansDepotEspace
				) {
					lString = ObjetTraduction_1.GTraductions.getValeur(
						"Casier.sansDepotEnLigne",
					);
				} else if (
					"sansDateLimite" in aParams.article &&
					aParams.article.sansDateLimite
				) {
					lString = ObjetTraduction_1.GTraductions.getValeur(
						"Casier.depotSansLimite",
					);
				} else if (
					"dateEcheance" in aParams.article &&
					aParams.article.dateEcheance
				) {
					lString = ObjetTraduction_1.GTraductions.getValeur(
						"Casier.depotJusquau",
						[
							ObjetDate_1.GDate.formatDate(
								aParams.article.dateEcheance,
								"%J %MMM",
							),
						],
					);
				}
				if (lString !== "") {
					H.push(IE.jsx.str("div", { class: "ie-sous-titre" }, lString));
				}
			}
			if (this.visu.destinataire) {
				const lDestinataires = [];
				switch (this.genreRubrique) {
					case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
						.depositaire:
						if (
							"infoPersonnel" in aParams.article &&
							aParams.article.infoPersonnel
						) {
							const lCleTrad = IE.estMobile
								? ObjetTraduction_1.GTraductions.getValeur("Casier.pers")
								: ObjetTraduction_1.GTraductions.getValeur("Casier.personnels");
							lDestinataires.push(
								`${lCleTrad} : ${aParams.article.infoPersonnel}`,
							);
						}
						if (
							"infoProfesseur" in aParams.article &&
							aParams.article.infoProfesseur
						) {
							const lCleTrad = IE.estMobile
								? ObjetTraduction_1.GTraductions.getValeur("Casier.profs")
								: ObjetTraduction_1.GTraductions.getValeur(
										"Casier.professeurs",
									);
							lDestinataires.push(
								`${lCleTrad} : ${aParams.article.infoProfesseur}`,
							);
						}
						if (
							"infoMaitreDeStage" in aParams.article &&
							aParams.article.infoMaitreDeStage
						) {
							const lCleTrad = IE.estMobile
								? ObjetTraduction_1.GTraductions.getValeur("Casier.mStage")
								: ObjetTraduction_1.GTraductions.getValeur(
										"Casier.maitresDeStage",
									);
							lDestinataires.push(
								`${lCleTrad} : ${aParams.article.infoMaitreDeStage}`,
							);
						}
						if (
							"infoEquipePedagogique" in aParams.article &&
							aParams.article.infoEquipePedagogique
						) {
							const lCleTrad = IE.estMobile
								? ObjetTraduction_1.GTraductions.getValeur("Casier.peda")
								: ObjetTraduction_1.GTraductions.getValeur(
										"Casier.equipePedagogique",
									);
							lDestinataires.push(
								`${lCleTrad} : ${aParams.article.infoEquipePedagogique}`,
							);
						}
						break;
					case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
						.responsable:
						if (
							"infoResponsable" in aParams.article &&
							aParams.article.infoResponsable
						) {
							lDestinataires.push(
								`${ObjetTraduction_1.GTraductions.getValeur("Casier.responsables")} : ${aParams.article.infoResponsable}`,
							);
						}
						if ("infoEleve" in aParams.article && aParams.article.infoEleve) {
							lDestinataires.push(
								`${ObjetTraduction_1.GTraductions.getValeur("Casier.eleves")} : ${aParams.article.infoEleve}`,
							);
						}
						break;
					case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
						.collecteParDocument:
						if (
							UtilitaireCasier_1.UtilitaireCasier.isObjetElementCollecteParDocument(
								aParams.article,
							)
						) {
							const lLibelle = this.getLibelleDestinatairesCollecteParDoc(
								aParams.article,
							);
							if (lLibelle) {
								lDestinataires.push(lLibelle);
							}
						}
						break;
					default:
						break;
				}
				let lStrPublication = "";
				if ("dateDebut" in aParams.article && aParams.article.dateDebut) {
					const lDate = ObjetDate_1.GDate.formatDate(
						aParams.article.dateDebut,
						"%J %MMM",
					);
					if (aParams.article.dateFin) {
						lStrPublication +=
							ObjetTraduction_1.GTraductions.getValeur("Casier.du") +
							" " +
							lDate;
					} else {
						lStrPublication += ObjetTraduction_1.GTraductions.getValeur(
							"Casier.diffuseLe",
							[lDate],
						);
					}
				}
				if ("dateFin" in aParams.article && aParams.article.dateFin) {
					let lStr =
						ObjetTraduction_1.GTraductions.getValeur("Casier.au") +
						" " +
						ObjetDate_1.GDate.formatDate(aParams.article.dateFin, "%J %MMM");
					if (aParams.article.dateDebut) {
						lStr = lStr.toLowerCase();
					}
					lStrPublication += " " + lStr;
				}
				if (lStrPublication !== "") {
					H.push(
						IE.jsx.str("div", { class: "ie-sous-titre" }, lStrPublication),
					);
				}
				const lAvecDestinataire = lDestinataires.length > 0;
				if (lAvecDestinataire) {
					H.push(
						IE.jsx.str(
							"div",
							{ class: "ie-sous-titre" },
							lDestinataires.join(" - "),
						),
					);
				}
			}
			if (
				"plusConsultable" in aParams.article &&
				aParams.article.plusConsultable &&
				"hintPersonnel" in aParams.article &&
				aParams.article.hintPersonnel &&
				aParams.article.hintPersonnel.length > 0
			) {
				H.push(
					IE.jsx.str(
						"div",
						{ class: ["color-red-foncee", "m-top"] },
						aParams.article.hintPersonnel,
					),
				);
			}
		}
		return H.join("");
	}
	getLibelleDestinatairesCollecteParDoc(aArticle) {
		switch (aArticle.getGenre()) {
			case TypeCasier_1.TypeGenreCumulDocEleve.gcdeEleve:
				if (aArticle.nbrEleves) {
					return ObjetTraduction_1.GTraductions.getValeur(
						aArticle.nbrEleves === 1
							? "Casier.infosEleveCollecte"
							: "Casier.infosElevesCollecte",
						[aArticle.nbrEleves],
					);
				}
				break;
			case TypeCasier_1.TypeGenreCumulDocEleve.gcdeRespEleve:
				if (aArticle.nbrEleves && aArticle.nbrResponsables) {
					let lCle = "Casier.infosResponsablesElevesCollecte";
					if (aArticle.nbrEleves === 1 && aArticle.nbrResponsables === 1) {
						lCle = "Casier.infosResponsableEleveCollecte";
					} else if (aArticle.nbrResponsables === 1) {
						lCle = "Casier.infosResponsableElevesCollecte";
					}
					return ObjetTraduction_1.GTraductions.getValeur(lCle, [
						aArticle.nbrResponsables,
						aArticle.nbrEleves,
					]);
				}
				break;
			case TypeCasier_1.TypeGenreCumulDocEleve.gcdeResp:
				if (aArticle.nbrResponsables) {
					return ObjetTraduction_1.GTraductions.getValeur(
						aArticle.nbrResponsables === 1
							? "Casier.infosResponsableCollecte"
							: "Casier.infosResponsablesCollecte",
						[aArticle.nbrResponsables],
					);
				}
				break;
		}
		return "";
	}
	getZoneComplementaire(aParams) {
		const H = [];
		H.push(`<div class="flex-contain flex-gap flex-center">`);
		switch (this.genreRubrique) {
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.monCasier: {
				H.push(
					IE.jsx.str(
						IE.jsx.fragment,
						null,
						this.getIconeMemo(aParams.article),
						this.visu.iconModifiable &&
							UtilitaireCasier_1.UtilitaireCasier.isObjetElementDestinataire(
								aParams.article,
							) &&
							aParams.article.estModifiableParDestinataires &&
							IE.jsx.str("i", {
								class: "icon_pencil i-small theme_color_moyen1",
								"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
									"Casier.hintDocumentModifiableDestinataire",
								),
								role: "img",
							}),
					),
				);
				break;
			}
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.depositaire:
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.responsable: {
				H.push(
					IE.jsx.str(
						"div",
						{ class: ["flex-contain", "cols", "flex-gap"] },
						this.getIconeMemo(aParams.article),
						(UtilitaireCasier_1.UtilitaireCasier.isObjetElementDepositaireResponsable(
							aParams.article,
						) ||
							UtilitaireCasier_1.UtilitaireCasier.isObjetElementDepositaire(
								aParams.article,
							)) &&
							IE.jsx.str(
								"p",
								{ "ie-tooltiplabel": aParams.article.hintAcuseReception },
								aParams.article.acuseReception,
								" %",
							),
					),
				);
				break;
			}
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.collecteParEleve:
			case UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier
				.collecteParDocument: {
				if (this.visu.nbrCollecte) {
					let lCompteur = "";
					if (
						"listeDocuments" in aParams.article &&
						aParams.article.listeDocuments
					) {
						const lNombreDocTotal = aParams.article.listeDocuments.count();
						if (lNombreDocTotal > 0) {
							const lNombreDocDepose = aParams.article.listeDocuments
								.getListeElements(
									(aDoc) =>
										aDoc.documentsEleve && aDoc.documentsEleve.count() > 0,
								)
								.count();
							lCompteur = `${lNombreDocDepose}/${lNombreDocTotal}`;
						}
					} else if (
						UtilitaireCasier_1.UtilitaireCasier.isObjetElementCollecteParDocument(
							aParams.article,
						) &&
						aParams.article.compteur
					) {
						lCompteur = aParams.article.compteur;
					}
					if (lCompteur) {
						H.push(
							IE.jsx.str("span", { class: "theme_color_moyen1" }, lCompteur),
						);
					}
				}
				break;
			}
		}
		H.push(`</div>`);
		return H.join("");
	}
	getIconeMemo(aArticle) {
		var _a;
		if (
			this.estRubriqueDocumentsCasier &&
			UtilitaireCasier_1.UtilitaireCasier.isObjetElementCasier(aArticle) &&
			((_a = aArticle.memo) === null || _a === void 0 ? void 0 : _a.length) > 0
		) {
			return IE.jsx.str("i", {
				class: "icon_post_it_rempli theme_color_moyen1 i-medium",
				"ie-tooltiplabel":
					ObjetTraduction_1.GTraductions.getValeur("Casier.memo"),
				role: "img",
			});
		}
		return "";
	}
	getZoneGauche(aParams) {
		if (!aParams.article.estUnDeploiement) {
			if (this.optionsCasier.avecIconeFormatFoc) {
				const lAvecIconSignature =
					UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
						aParams.article,
					) &&
					!UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.documentVisualisable(
						aParams.article,
					);
				const lClass = [
					"i-medium",
					lAvecIconSignature
						? "icon_signature"
						: UtilitaireDocument_1.UtilitaireDocument.getIconFromFileName(
								aParams.article.getLibelle(),
							),
				];
				return IE.jsx.str("i", {
					"ie-tooltiplabel":
						UtilitaireDocument_1.UtilitaireDocument.getTitleFromFileName(
							aParams.article.getLibelle(),
						),
					role: "img",
					class: lClass,
				});
			}
		}
		return "";
	}
	avecEvenementSelection(aParams) {
		return !!aParams.article && !aParams.article.estUnDeploiement;
	}
	avecEvenementSelectionClick(aParams) {
		return this.avecEvenementSelection(aParams);
	}
	avecMenuContextuel(aParams) {
		return aParams.ligne >= 0;
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel || aParametres.article.estUnDeploiement) {
			return;
		}
		this.getListeCommandeMenuCtx(aParametres).forEach((aCommande) => {
			if ("callback" in aCommande) {
				aParametres.menuContextuel.add(
					aCommande.libelle,
					aCommande.actif,
					aCommande.callback,
					aCommande.extend,
				);
			} else {
				aParametres.menuContextuel.addSelecFile(
					aCommande.libelle,
					aCommande.extend,
					aCommande.actif,
				);
			}
		});
		aParametres.menuContextuel.setDonnees();
	}
	getListeCommandeMenuCtx(aParametres) {
		const lResult = [];
		const lArticle = aParametres.article;
		if (
			UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.isDocumentSignature(
				lArticle,
			) &&
			!UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.documentArchive(
				lArticle,
			)
		) {
			return [];
		}
		if (
			"memo" in lArticle &&
			lArticle.memo &&
			lArticle.memo.length > 0 &&
			this.avecFonctionnalite(
				UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
					.consulterLeCommentaire,
				aParametres.article,
			)
		) {
			lResult.push({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"Casier.consulterLeCommentaire",
				),
				actif: true,
				callback: () =>
					this.evenement({
						numeroMenu:
							DonneesListe_Casier.EGenreCommande.consulterLeCommentaire,
						article: lArticle,
					}),
				extend: { icon: "icon_post_it_rempli theme_color_moyen1" },
			});
		}
		if (
			this.avecFonctionnalite(
				UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite.telecharger,
				aParametres.article,
			)
		) {
			lResult.push({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"Casier.Cmd.Telecharger",
				),
				actif: true,
				callback: () =>
					this.evenement({
						numeroMenu: DonneesListe_Casier.EGenreCommande.telecharger,
						article: lArticle,
					}),
				extend: { icon: "icon_download_alt" },
			});
		}
		if (
			this.avecFonctionnalite(
				UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
					.remplacerFichier,
				aParametres.article,
			) &&
			"estModifiableParDestinataires" in lArticle &&
			!!lArticle.estModifiableParDestinataires &&
			!!lArticle.estModifiableParUtilisateur
		) {
			const lLibelle = ObjetTraduction_1.GTraductions.getValeur(
				"Casier.remplacerLeDocument",
			);
			const lEstUnDocumentCloud =
				lArticle.documentCasier &&
				lArticle.documentCasier.getGenre() ===
					Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud;
			if (lEstUnDocumentCloud) {
				lResult.push({
					libelle: lLibelle,
					actif: true,
					callback: () =>
						this.evenement({
							numeroMenu:
								DonneesListe_Casier.EGenreCommande.remplacerDocumentCloud,
							article: lArticle,
						}),
					extend: { icon: "icon_pencil" },
				});
			} else {
				lResult.push({
					libelle: lLibelle,
					extend: {
						getOptionsSelecFile: () => {
							return UtilitaireDocument_1.UtilitaireDocument.getOptionsSelecFile();
						},
						addFiles: (aParametresInput) => {
							if (aParametresInput && aParametresInput.eltFichier) {
								this.evenement({
									numeroMenu: DonneesListe_Casier.EGenreCommande.remplacer,
									article: lArticle,
									eltFichier: aParametresInput.eltFichier,
								});
							}
						},
						icon: "icon_pencil",
					},
				});
			}
		}
		if (
			this.avecFonctionnalite(
				UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
					.marquerLectureDocument,
				aParametres.article,
			) &&
			"estNonLu" in lArticle &&
			lArticle.estNonLu
		) {
			lResult.push({
				libelle: ObjetTraduction_1.GTraductions.getValeur("Casier.marquerLus"),
				actif: true,
				callback: () =>
					this.evenement({
						numeroMenu: DonneesListe_Casier.EGenreCommande.marquerLus,
						article: lArticle,
					}),
				extend: { icon: "icon_eye_open" },
			});
		}
		if (
			this.avecFonctionnalite(
				UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
					.marquerLectureDocument,
				aParametres.article,
			) &&
			"estNonLu" in lArticle &&
			lArticle.estNonLu === false
		) {
			lResult.push({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"Casier.marquerNonLus",
				),
				actif: true,
				callback: () =>
					this.evenement({
						numeroMenu: DonneesListe_Casier.EGenreCommande.marquerNonLus,
						article: lArticle,
					}),
				extend: { icon: "icon_eye_close" },
			});
		}
		let lAvecModifier = this.avecFonctionnalite(
			UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite.modifier,
			aParametres.article,
		);
		if (lAvecModifier && !this.estRubriqueCollecteParDocument) {
			lAvecModifier = ![
				Enumere_Espace_1.EGenreEspace.Accompagnant,
				Enumere_Espace_1.EGenreEspace.Tuteur,
			].includes(GEtatUtilisateur.GenreEspace);
		}
		if (lAvecModifier) {
			let lActif = true;
			if (this.estRubriqueCollecteParDocument) {
				lActif =
					"listeChampsEditables" in aParametres.article &&
					aParametres.article.listeChampsEditables.length > 0;
			}
			lResult.push({
				libelle: ObjetTraduction_1.GTraductions.getValeur("Modifier"),
				actif: lActif,
				callback: () =>
					this.evenement({
						numeroMenu: DonneesListe_Casier.EGenreCommande.modifier,
						article: lArticle,
					}),
				extend: { icon: "icon_pencil" },
			});
		}
		if (
			this.avecFonctionnalite(
				UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite.suppressionDoc,
				aParametres.article,
			)
		) {
			let lCleTrad = "";
			let lActif = aParametres && !aParametres.nonEditable;
			if (this.estRubriqueCollecteParDocument) {
				lCleTrad = ObjetTraduction_1.GTraductions.getValeur("Supprimer");
				lActif =
					lActif &&
					"estSupprimable" in aParametres.article &&
					aParametres.article.estSupprimable;
			} else {
				lCleTrad =
					this.genreRubrique ===
					UtilitaireCasier_1.UtilitaireCasier.EGenreRubriqueCasier.monCasier
						? ObjetTraduction_1.GTraductions.getValeur(
								"Casier.supprimerDuCasier",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"Casier.supprimerDeTousLesCasiers",
							);
			}
			lResult.push({
				libelle: lCleTrad,
				actif: lActif,
				callback: () =>
					this.evenement({
						numeroMenu: DonneesListe_Casier.EGenreCommande.suppression,
						article: lArticle,
					}),
				extend: { icon: "icon_trash" },
			});
		}
		if (
			this.avecFonctionnalite(
				UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite.cloturer,
				aParametres.article,
			) &&
			"sansDepotEspace" in lArticle &&
			lArticle.sansDepotEspace
		) {
			lResult.push({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"Casier.cloturerDepot",
				),
				actif: aParametres && !aParametres.nonEditable,
				callback: () =>
					this.evenement({
						numeroMenu: DonneesListe_Casier.EGenreCommande.cloturer,
						article: lArticle,
					}),
				extend: { icon: "icon_fermeture_widget" },
			});
		}
		if (
			this.avecFonctionnalite(
				UtilitaireCasier_1.UtilitaireCasier.EGenrefonctionnalite
					.voirLesReponses,
				aParametres.article,
			) &&
			(UtilitaireCasier_1.UtilitaireCasier.isObjetElementDepositaire(
				aParametres.article,
			) ||
				UtilitaireCasier_1.UtilitaireCasier.isObjetElementDepositaireResponsable(
					aParametres.article,
				))
		) {
			lResult.push({
				libelle: ObjetTraduction_1.GTraductions.getValeur("Casier.tauxLecture"),
				actif: true,
				callback: () => this.ouvrirFenetreReponses(aParametres.article),
				extend: { icon: "icon_percent" },
			});
		}
		return lResult;
	}
	getVisible(aArticle) {
		if (this.optionsCasier.avecFiltreCategorie) {
			const lFiltre = this.listeCategories.get(this.filtre.indiceCategorie);
			if (lFiltre && !lFiltre.estTotal) {
				const lEstLaMemeCategorie =
					"categorie" in aArticle &&
					aArticle.categorie.getNumero() === lFiltre.getNumero();
				if (!lEstLaMemeCategorie) {
					return false;
				}
			}
		}
		if (this.optionsCasier.avecFiltreNonLus && this.filtre.cbNonLu) {
			if (aArticle.estUnDeploiement) {
				const lAvecEnfantNonLu =
					this.Donnees.getListeElements(
						(aElement) =>
							!aElement.estUnDeploiement &&
							"categorie" in aElement.pere &&
							"categorie" in aArticle &&
							aElement.pere.categorie.getNumero() ===
								aArticle.categorie.getNumero() &&
							"estNonLu" in aElement &&
							aElement.estNonLu,
					).count() > 0;
				if (!lAvecEnfantNonLu) {
					return false;
				}
			} else {
				const lEstNonLu = "estNonLu" in aArticle && aArticle.estNonLu;
				if (!lEstNonLu) {
					return false;
				}
			}
		}
		if (this.optionsCasier.avecFiltreNonSignes && this.filtre.cbNonSigne) {
			if (aArticle.estUnDeploiement) {
				const lAvecEnfantNonSigne =
					this.Donnees.getListeElements(
						(aElement) =>
							!aElement.estUnDeploiement &&
							"categorie" in aElement.pere &&
							"categorie" in aArticle &&
							aElement.pere.categorie.getNumero() ===
								aArticle.categorie.getNumero() &&
							(UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.estASigner(
								aElement,
							) ||
								UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.enCoursDeSignature(
									aElement,
								)),
					).count() > 0;
				if (!lAvecEnfantNonSigne) {
					return false;
				}
			} else {
				const lEstNonSigne =
					UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.estASigner(
						aArticle,
					) ||
					UtilitaireDocumentSignature_1.TUtilitaireDocumentSignature.enCoursDeSignature(
						aArticle,
					);
				if (!lEstNonSigne) {
					return false;
				}
			}
		}
		if (this.optionsCasier.avecFiltrePublication) {
			if (!aArticle.estUnDeploiement) {
				if (
					UtilitaireCasier_1.UtilitaireCasier.isObjetElementCollecteParDocument(
						aArticle,
					)
				) {
					if (!this.getVisibleCollecteDatePublication(aArticle)) {
						return false;
					}
				}
			}
		}
		if (this.optionsCasier.avecFiltreElevesAvecDocADeposer) {
			const lAvecDocument =
				"listeDocuments" in aArticle &&
				aArticle.listeDocuments &&
				aArticle.listeDocuments.count() > 0;
			if (!lAvecDocument) {
				return false;
			}
		}
		return true;
	}
	getVisibleCollecteDatePublication(aArticle) {
		const lEstCollectePublie =
			UtilitaireCasier_1.UtilitaireCasier.estCollectePublie(aArticle);
		if (this.filtre.cbNonPublie && !lEstCollectePublie) {
			return true;
		}
		if (this.filtre.cbPublie && lEstCollectePublie) {
			return true;
		}
		return false;
	}
	getTri(aColonne, aGenreTri) {
		if (!this.optionsCasier.avectri) {
			return;
		}
		const lTris = [
			ObjetTri_1.ObjetTri.init((aElement) => {
				return aElement.pere
					? aElement.pere.categorie.getLibelle()
					: aElement.estUnDeploiement && "categorie" in aElement
						? aElement.categorie.getLibelle()
						: "";
			}),
			ObjetTri_1.ObjetTri.init((aElement) => {
				return !!aElement.pere;
			}),
		];
		lTris.push(
			ObjetTri_1.ObjetTri.init((D) => {
				return D.estUnElementInformatif ? 0 : 1;
			}),
		);
		lTris.push(
			ObjetTri_1.ObjetTri.init(
				this.getValeurPourTri.bind(this, aColonne),
				aGenreTri,
			),
		);
		lTris.push(ObjetTri_1.ObjetTri.init("Libelle"));
		return lTris;
	}
	construireFiltres() {
		const H = [];
		if (this.optionsCasier.avecFiltreCategorie) {
			H.push(
				IE.jsx.str(
					"label",
					{ class: ["m-bottom-l"], id: this.ids.labelNatures },
					ObjetTraduction_1.GTraductions.getValeur("Casier.natures"),
				),
				IE.jsx.str("ie-combo", {
					"ie-model": this.jsxComboModelFiltreCategories.bind(this),
					class: "combo-sans-fleche",
				}),
			);
		}
		if (this.optionsCasier.avecFiltreNonLus) {
			H.push(
				IE.jsx.str("div", { class: ["DAT_separateur", "m-y-xl"] }),
				IE.jsx.str(
					"ie-checkbox",
					{
						class: IE.estMobile ? "m-bottom-l" : false,
						"ie-model": this.jsxModeleCheckboxFiltreNonLus.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur("Casier.FiltreNonLus"),
				),
			);
		}
		if (this.optionsCasier.avecFiltreNonSignes) {
			H.push(
				IE.jsx.str(
					"ie-checkbox",
					{
						class: IE.estMobile ? "m-bottom-l" : false,
						"ie-model": this.jsxModeleCheckboxFiltreNonSignes.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur("Casier.FiltreNonSignes"),
				),
			);
		}
		if (this.optionsCasier.avecFiltrePublication) {
			H.push(
				IE.jsx.str(
					"ie-checkbox",
					{
						class: ["m-bottom-l"],
						"ie-model": this.jsxModeleCheckboxPublication.bind(this, false),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"Casier.afficherCollectePublie",
					),
				),
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": this.jsxModeleCheckboxPublication.bind(this, true) },
					ObjetTraduction_1.GTraductions.getValeur(
						"Casier.afficherCollecteNonPublie",
					),
				),
			);
		}
		return IE.jsx.str("div", { class: ["flex-contain", "cols"] }, H.join(""));
	}
	reinitFiltres() {
		this.setFiltre(this.getFiltreParDefaut());
		this.filtre = this.getfiltre();
		this.paramsListe.actualiserListe({ conserverSelection: false });
	}
	estFiltresParDefaut() {
		let lEstParDefaut = true;
		const lValeurFiltreParDefaut = this.getFiltreParDefaut();
		for (const prop in this.filtre) {
			if (this.filtre[prop] !== lValeurFiltreParDefaut[prop]) {
				lEstParDefaut = false;
			}
		}
		return lEstParDefaut;
	}
	jsxModeleCheckboxFiltreNonLus() {
		return {
			getValue: () => {
				return this.filtre.cbNonLu;
			},
			setValue: (aValue) => {
				this.setCbNonLu(!!aValue);
				this.paramsListe.actualiserListe();
			},
		};
	}
	jsxModeleCheckboxFiltreNonSignes() {
		return {
			getValue: () => {
				return this.filtre.cbNonSigne;
			},
			setValue: (aValue) => {
				this.setCbNonSigne(!!aValue);
				this.paramsListe.actualiserListe();
			},
		};
	}
	jsxComboModelFiltreCategories() {
		return {
			init: (aCombo) => {
				aCombo.setOptionsObjetSaisie({
					ariaLabelledBy: this.ids.labelNatures,
					estLargeurAuto: true,
				});
			},
			getDonnees: () => {
				if (this.listeCategories) {
					return this.listeCategories;
				}
			},
			getIndiceSelection: () => {
				return MethodesObjet_1.MethodesObjet.isNumeric(
					this.filtre.indiceCategorie,
				)
					? this.filtre.indiceCategorie
					: -1;
			},
			event: (aParams) => {
				if (
					aParams.genreEvenement ===
						Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
							.selection &&
					aParams.element
				) {
					const lindiceCategorie =
						this.listeCategories.getIndiceElementParFiltre(
							(aCat) => aCat === aParams.element,
						);
					this.setIndiceCategorie(lindiceCategorie);
					this.paramsListe.actualiserListe();
				}
			},
		};
	}
	jsxModeleCheckboxPublication(aPourNonPublie) {
		return {
			getValue: () => {
				var _a, _b;
				return (_b =
					(_a = this.filtre) === null || _a === void 0
						? void 0
						: _a[aPourNonPublie ? "cbNonPublie" : "cbPublie"]) !== null &&
					_b !== void 0
					? _b
					: false;
			},
			setValue: (aValue) => {
				var _a;
				(_a =
					this[
						aPourNonPublie ? "setFiltreCbNonPublie" : "setFiltreCbPublie"
					]) === null || _a === void 0
					? void 0
					: _a.call(this, !!aValue);
				this.paramsListe.actualiserListe();
			},
			getDisabled: () => {
				return false;
			},
		};
	}
	ouvrirFenetreReponses(aArticle) {
		if (
			UtilitaireCasier_1.UtilitaireCasier.isObjetElementDepositaire(aArticle) ||
			UtilitaireCasier_1.UtilitaireCasier.isObjetElementDepositaireResponsable(
				aArticle,
			)
		) {
			const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_ResultatsCasier_1.ObjetFenetre_ResultatsCasier,
				{
					pere: this,
					initialiser(aFenetre) {
						aFenetre.setOptionsFenetre({
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"Casier.tauxLectureS",
								aArticle.getLibelle(),
							),
						});
					},
				},
			);
			lFenetre.setDonnees({ casier: aArticle });
			return;
		}
	}
}
exports.DonneesListe_Casier = DonneesListe_Casier;
(function (DonneesListe_Casier) {
	let EGenreCommande;
	(function (EGenreCommande) {
		EGenreCommande[(EGenreCommande["telecharger"] = 3)] = "telecharger";
		EGenreCommande[(EGenreCommande["consulter"] = 4)] = "consulter";
		EGenreCommande[(EGenreCommande["remplacerDocumentCloud"] = 5)] =
			"remplacerDocumentCloud";
		EGenreCommande[(EGenreCommande["marquerLus"] = 6)] = "marquerLus";
		EGenreCommande[(EGenreCommande["marquerNonLus"] = 7)] = "marquerNonLus";
		EGenreCommande[(EGenreCommande["detail"] = 8)] = "detail";
		EGenreCommande[(EGenreCommande["suppression"] = 9)] = "suppression";
		EGenreCommande[(EGenreCommande["renommer"] = 10)] = "renommer";
		EGenreCommande[(EGenreCommande["remplacer"] = 11)] = "remplacer";
		EGenreCommande[(EGenreCommande["consulterLeCommentaire"] = 12)] =
			"consulterLeCommentaire";
		EGenreCommande[(EGenreCommande["modifier"] = 13)] = "modifier";
		EGenreCommande[(EGenreCommande["cloturer"] = 14)] = "cloturer";
	})(
		(EGenreCommande =
			DonneesListe_Casier.EGenreCommande ||
			(DonneesListe_Casier.EGenreCommande = {})),
	);
})(
	DonneesListe_Casier ||
		(exports.DonneesListe_Casier = DonneesListe_Casier = {}),
);
