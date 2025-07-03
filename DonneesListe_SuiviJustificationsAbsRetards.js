exports.DonneesListe_SuiviJustificationsAbsRetards = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeRessourceAbsence_1 = require("TypeRessourceAbsence");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const TypeNote_1 = require("TypeNote");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Media_1 = require("Enumere_Media");
const ObjetDate_1 = require("ObjetDate");
const AccessApp_1 = require("AccessApp");
class DonneesListe_SuiviJustificationsAbsRetards extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParametres) {
		super(aDonnees);
		this.callbackAjoutDocumentJoint = aParametres.callbackAjoutDocumentJoint;
		this.callbackRemplacerDocumentJoint =
			aParametres.callbackRemplacerDocumentJoint;
		this.callbackSuppressionDocumentJoint =
			aParametres.callbackSuppressionDocumentJoint;
		this.listeFiltreTypeRessAbsences = aParametres.listeFiltreTypeRessAbsences;
		this.setOptions({
			avecEvnt_Selection: true,
			avecSuppression: false,
			editionApresSelection: false,
			avecEtatSaisie: false,
		});
	}
	avecMenuContextuel() {
		return false;
	}
	avecContenuTronque(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.regime:
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.commentaireParents:
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.matieresAffectee:
				return true;
		}
		return false;
	}
	getClass(aParams) {
		const lClasses = [];
		switch (aParams.idColonne) {
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.eleve:
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.classe:
				lClasses.push("Gras");
				break;
		}
		switch (aParams.idColonne) {
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.genre:
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.documentsParents:
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.documentsVieScolaire:
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.acceptationEtablissement:
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.estMotifRecevable:
				lClasses.push("AlignementMilieu");
				break;
		}
		return lClasses.join(" ");
	}
	getCouleurCellule(aParams) {
		if (
			aParams.idColonne ===
			DonneesListe_SuiviJustificationsAbsRetards.colonnes.documentsVieScolaire
		) {
			if (
				aParams.article.getGenre() ===
				TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Absence
			) {
				return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
			}
		}
	}
	avecSelecFile(aParams) {
		if (
			aParams.idColonne ===
			DonneesListe_SuiviJustificationsAbsRetards.colonnes.documentsVieScolaire
		) {
			if (
				aParams.article.getGenre() ===
				TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Absence
			) {
				let lDocJointActuel = null;
				if (!!aParams.article.listeDocJointsVS) {
					lDocJointActuel = aParams.article.listeDocJointsVS.get(0);
				}
				return lDocJointActuel === null;
			}
		}
		return false;
	}
	getOptionsSelecFile() {
		return {
			maxSize: (0, AccessApp_1.getApp)().droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
			),
		};
	}
	evenementSurSelecFile(aParams, aParamsInput) {
		if (!!this.callbackAjoutDocumentJoint) {
			this.callbackAjoutDocumentJoint(aParams.article, aParamsInput.eltFichier);
		}
	}
	avecEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.motif:
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.acceptationEtablissement:
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.estMotifRecevable:
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.estRegleAdministrativement:
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.suivi:
				return true;
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.demiJourneesBulletin:
				return !!aParams.article.nbDemiJourneeBulletinEditable;
		}
		return false;
	}
	avecEvenementEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.demiJourneesBulletin:
				return false;
		}
		return this.avecEdition(aParams);
	}
	avecEvenementApresEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.demiJourneesBulletin:
				return true;
		}
		return false;
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.demiJourneesBulletin:
				aParams.article.nbDemiJourneeBulletin =
					V === null ? null : V.getValeur();
				break;
		}
	}
	getOptionsNote() {
		return {
			avecAnnotation: false,
			sansNotePossible: false,
			min: 0,
			max: 100,
			afficherAvecVirgule: true,
		};
	}
	jsxModelPJVieScolaire(aArticle) {
		return {
			event: () => {
				const lDocumentJoint = aArticle.listeDocJointsVS.get(0);
				ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
					pere: this,
					initCommandes: (aMenu) => {
						aMenu.add(
							ObjetTraduction_1.GTraductions.getValeur(
								"SuiviJustificationAbsRet.PieceJointeConsulter",
							),
							true,
							() => {
								_ouvrirDocumentJoint(lDocumentJoint);
							},
						);
						if (!!this.callbackRemplacerDocumentJoint) {
							aMenu.addSelecFile(
								ObjetTraduction_1.GTraductions.getValeur(
									"SuiviJustificationAbsRet.PieceJointeRemplacer",
								),
								{
									getOptionsSelecFile: () => {
										return this.getOptionsSelecFile();
									},
									addFiles: (aParamsInput) => {
										this.callbackRemplacerDocumentJoint(
											aArticle,
											aParamsInput.eltFichier,
										);
									},
								},
							);
						}
						aMenu.add(
							ObjetTraduction_1.GTraductions.getValeur(
								"SuiviJustificationAbsRet.PieceJointeSupprimer",
							),
							true,
							() => {
								if (!!this.callbackSuppressionDocumentJoint) {
									_afficherConfirmationSuppressionDocJoint(
										lDocumentJoint,
										() => {
											this.callbackSuppressionDocumentJoint(aArticle);
										},
									);
								}
							},
						);
					},
				});
			},
		};
	}
	jsxModelPJParent(aArticle) {
		return {
			event: () => {
				const lDocumentJointParent = aArticle.listeDocJointsParent.get(0);
				if (lDocumentJointParent) {
					_ouvrirDocumentJoint(lDocumentJointParent);
				}
			},
		};
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.genre: {
				const lStrImageGenre = [];
				lStrImageGenre.push(
					IE.jsx.str("i", {
						role: "img",
						class: Enumere_Ressource_1.EGenreRessourceUtil.getNomImageAbsence(
							TypeRessourceAbsence_1.TypeRessourceAbsenceUtil.toGenreRessource(
								aParams.article.getGenre(),
							),
						),
						"aria-label": this.getTooltip(aParams),
					}),
				);
				return lStrImageGenre.join("");
			}
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.eleve:
				return aParams.article.eleve ? aParams.article.eleve.getLibelle() : "";
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.classe:
				return aParams.article.listeClasses
					? aParams.article.listeClasses.getTableauLibelles().join(" / ")
					: "";
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.regime:
				return aParams.article.regime || "";
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.dureeRetard:
				return aParams.article.strDuree || "";
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.date:
				return aParams.article.strDate || "";
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.motif:
				return _getHtmlMotif(aParams.article.motif, true);
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.documentsParents: {
				const H = [];
				const lListeDJParent = aParams.article.listeDocJointsParent;
				if (!!lListeDJParent && lListeDJParent.count() > 0) {
					H.push(
						IE.jsx.str("ie-btnicon", {
							class: "icon_piece_jointe InlineBlock",
							"ie-model": this.jsxModelPJParent.bind(this, aParams.article),
							"aria-haspopup": "true",
							title: aParams.article.strDocJointsParent || "",
						}),
					);
				}
				return H.join("");
			}
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.raisonDonneeParents:
				return _getHtmlMotif(aParams.article.motifParent);
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.dateJustificationParents: {
				let lStrDateJustification;
				if (!!aParams.article.dateJustificationParents) {
					lStrDateJustification = ObjetDate_1.GDate.formatDate(
						aParams.article.dateJustificationParents,
						"%JJ/%MM/%AAAA",
					);
				}
				return lStrDateJustification || "";
			}
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.commentaireParents:
				return aParams.article.strCommentaireParent || "";
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.justifieParParents:
				return aParams.article.justifiePar;
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.acceptationEtablissement: {
				const lStyles = ["padding: 0.2rem 0.5rem; border: solid 1px #888;"];
				if (!!aParams.article.estMotifParentAccepte) {
					lStyles.push("background-color: ", GCouleur.vert, ";");
					lStyles.push("color: ", GCouleur.blanc, ";");
				} else {
					lStyles.push("background-color: #EEE;");
				}
				const lAcceptationEtab = [];
				lAcceptationEtab.push(
					IE.jsx.str(
						"span",
						{ class: "InlineBlock", style: lStyles.join("") },
						ObjetTraduction_1.GTraductions.getValeur(
							"SuiviJustificationAbsRet.JustificationAcceptee",
						),
					),
				);
				return lAcceptationEtab.join("");
			}
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.dureeAbsenceCours:
				return aParams.article.strDureeAbsenceCours || "";
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.documentsVieScolaire: {
				const H = [];
				const lListeDJVieScolaire = aParams.article.listeDocJointsVS;
				if (!!lListeDJVieScolaire && lListeDJVieScolaire.count() > 0) {
					H.push(
						IE.jsx.str("ie-btnicon", {
							class: "icon_piece_jointe InlineBlock",
							"ie-model": this.jsxModelPJVieScolaire.bind(
								this,
								aParams.article,
							),
							"aria-haspopup": "true",
							title: aParams.article.strDocJointsVS || "",
						}),
					);
				}
				return H.join("");
			}
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.matieresAffectee:
				return aParams.article.strMatieresAffectees || "";
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.estOuvert:
				return !!aParams.article.estOuvert;
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.demiJourneesBulletin: {
				let lNoteDJBulletin = null;
				if (!!aParams.article.strNbDemiJourneeBulletin && !aParams.surEdition) {
					lNoteDJBulletin = new TypeNote_1.TypeNote(
						aParams.article.strNbDemiJourneeBulletin,
					);
				} else if (
					!!aParams.article.nbDemiJourneeBulletin ||
					aParams.article.nbDemiJourneeBulletin === 0
				) {
					lNoteDJBulletin = new TypeNote_1.TypeNote(
						aParams.article.nbDemiJourneeBulletin,
					);
				}
				return lNoteDJBulletin;
			}
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.estMotifRecevable:
				return !!aParams.article.estMotifRecevable
					? ObjetTraduction_1.GTraductions.getValeur(
							"SuiviJustificationAbsRet.Oui",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"SuiviJustificationAbsRet.Non",
						);
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.estRegleAdministrativement:
				return !!aParams.article.estRA;
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.suivi: {
				const lHtmlSuivi = [];
				if (!!aParams.article.suivi && !!aParams.article.suivi.nombre) {
					lHtmlSuivi.push('<div class="flex-contain flex-center">');
					const lObjSuivi = aParams.article.suivi;
					lHtmlSuivi.push(IE.jsx.str("span", null, lObjSuivi.nombre));
					let lIcone = "";
					if (lObjSuivi.dernierSuiviEstJustificationParent) {
						lIcone = "icon_parents mix-icon_ok i-green";
					} else if (lObjSuivi.dernierSuiviEstConvocation) {
						lIcone = "icon_convocation mix-icon_vs i-red";
					} else if (lObjSuivi.genreMedia > 0) {
						lIcone = Enumere_Media_1.EGenreMediaUtil.getClassesIconeMedia(
							lObjSuivi.genreMedia,
							!lObjSuivi.estEnvoi,
						);
					}
					if (lIcone) {
						lHtmlSuivi.push(
							IE.jsx.str("i", {
								class: "MargeGauche " + lIcone,
								role: "presentation",
							}),
						);
					} else if (
						lObjSuivi.genreMedia ===
						Enumere_Media_1.TypeOrigineCreationMedia.OCM_Utilisateur
					) {
						if (!!lObjSuivi.code) {
							lHtmlSuivi.push(
								IE.jsx.str("span", { class: "MargeGauche" }, lObjSuivi.code),
							);
						}
					}
					lHtmlSuivi.push("</div>");
				}
				return lHtmlSuivi.join("");
			}
		}
		return "";
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.estOuvert:
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.estRegleAdministrativement:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.motif:
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.raisonDonneeParents:
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.acceptationEtablissement:
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.suivi:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.demiJourneesBulletin:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Note;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.genre: {
				let lGenre = null;
				if (
					aParams.article.getGenre() ===
					TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Absence
				) {
					lGenre = TypeRessourceAbsence_1.TypeRessourceAbsenceUtil.getLibelle(
						TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Absence,
					);
				} else if (
					aParams.article.getGenre() ===
					TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Retard
				) {
					lGenre = TypeRessourceAbsence_1.TypeRessourceAbsenceUtil.getLibelle(
						TypeRessourceAbsence_1.TypeRessourceAbsence.TR_Retard,
					);
				}
				return lGenre || "";
			}
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.documentsParents:
				return aParams.article.strDocJointsParent || "";
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.documentsVieScolaire:
				return aParams.article.strDocJointsVS || "";
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes.estOuvert:
				return !!aParams.article.estOuvert
					? ObjetTraduction_1.GTraductions.getValeur(
							"SuiviJustificationAbsRet.HintAbsenceOuverte",
						)
					: "";
			case DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.estRegleAdministrativement:
				return !!aParams.article.estRA
					? ObjetTraduction_1.GTraductions.getValeur(
							"SuiviJustificationAbsRet.HintRegleAdministrativement",
						)
					: "";
		}
		return "";
	}
	getVisible(D) {
		if (!!D && !!this.listeFiltreTypeRessAbsences) {
			const lGenreFiltre = this.listeFiltreTypeRessAbsences.getElementParGenre(
				D.getGenre(),
			);
			return !!lGenreFiltre && !!lGenreFiltre.selectionne;
		}
		return true;
	}
	getValeurPourTri(aColonne, aArticle) {
		const lIdColonne = this.getId(aColonne);
		if (
			lIdColonne === DonneesListe_SuiviJustificationsAbsRetards.colonnes.date
		) {
			return aArticle.date;
		} else if (
			lIdColonne ===
			DonneesListe_SuiviJustificationsAbsRetards.colonnes
				.dateJustificationParents
		) {
			return aArticle.dateJustificationParents;
		}
		return super.getValeurPourTri(aColonne, aArticle);
	}
	getTri(aColonneTri, aGenreTri) {
		const lTris = [];
		lTris.push(
			ObjetTri_1.ObjetTri.init(
				this.getValeurPourTri.bind(this, aColonneTri),
				aGenreTri,
			),
		);
		lTris.push(
			ObjetTri_1.ObjetTri.init((D) => {
				return !!D.eleve ? D.eleve.getLibelle() : "";
			}, aGenreTri),
		);
		return lTris;
	}
}
exports.DonneesListe_SuiviJustificationsAbsRetards =
	DonneesListe_SuiviJustificationsAbsRetards;
DonneesListe_SuiviJustificationsAbsRetards.colonnes = {
	genre: "DL_JustifAbsRet_genre",
	eleve: "DL_JustifAbsRet_eleve",
	classe: "DL_JustifAbsRet_classe",
	regime: "DL_JustifAbsRet_regime",
	dureeRetard: "DL_JustifAbsRet_dureeRetard",
	date: "DL_JustifAbsRet_date",
	motif: "DL_JustifAbsRet_motif",
	documentsParents: "DL_JustifAbsRet_pjParent",
	raisonDonneeParents: "DL_JustifAbsRet_raisonParent",
	dateJustificationParents: "DL_JustifAbsRet_dateJustifParent",
	commentaireParents: "DL_JustifAbsRet_commParent",
	justifieParParents: "DL_JustifAbsRet_justifieParParent",
	acceptationEtablissement: "DL_JustifAbsRet_acceptationEtab",
	dureeAbsenceCours: "DL_JustifAbsRet_dureeAbsCours",
	documentsVieScolaire: "DL_JustifAbsRet_pjVieScolaire",
	matieresAffectee: "DL_JustifAbsRet_matieres",
	estOuvert: "DL_JustifAbsRet_estOuvert",
	demiJourneesBulletin: "DL_JustifAbsRet_DJBulletin",
	estMotifRecevable: "DL_JustifAbsRet_estMotifRece",
	estRegleAdministrativement: "DL_JustifAbsRet_estRA",
	suivi: "DL_JustifAbsRet_suivi",
};
function _afficherConfirmationSuppressionDocJoint(aDocJoint, aSuccessCallback) {
	GApplication.getMessage()
		.afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			message: ObjetChaine_1.GChaine.format(
				ObjetTraduction_1.GTraductions.getValeur("selecteurPJ.msgConfirmPJ"),
				[aDocJoint.getLibelle()],
			),
		})
		.then((aGenreAction) => {
			if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
				aSuccessCallback();
			}
		});
}
function _ouvrirDocumentJoint(aDocJoint) {
	window.open(
		ObjetChaine_1.GChaine.creerUrlBruteLienExterne(aDocJoint, {
			genreRessource: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
		}),
	);
}
function _getHtmlMotif(aMotif, aAvecCouleur) {
	const H = [];
	if (!!aMotif) {
		if (aAvecCouleur) {
			const lStylesCouleurMotif = [];
			if (!!aMotif.couleur) {
				lStylesCouleurMotif.push(
					ObjetStyle_1.GStyle.composeCouleurBordure("black"),
				);
				lStylesCouleurMotif.push(
					ObjetStyle_1.GStyle.composeCouleurFond(aMotif.couleur),
				);
			}
			H.push(
				'<span class="InlineBlock AlignementMilieuVertical MargeDroit" style="width: 12px; height: 12px; ',
				lStylesCouleurMotif.join(" "),
				'">',
				"&nbsp;",
				"</span>",
			);
		}
		H.push(
			'<span class="AlignementMilieuVertical">',
			aMotif.getLibelle(),
			"</span>",
		);
	}
	return H.join("");
}
