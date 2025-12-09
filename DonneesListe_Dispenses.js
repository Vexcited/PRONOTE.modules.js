exports.DonneesListe_Dispenses = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const AccessApp_1 = require("AccessApp");
class DonneesListe_Dispenses extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aParams) {
		super(aParams.donnees);
		this.appSco = (0, AccessApp_1.getApp)();
		this._autorisations = aParams.autorisations;
		const lDroitSaisie = this.appSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.dispenses.saisie,
		);
		this.setOptions({
			avecSuppression: lDroitSaisie,
			avecEvnt_ApresSuppression: lDroitSaisie,
		});
	}
	getLibelleDraggable(aParams) {
		const lDate =
			ObjetTraduction_1.GTraductions.getValeur("Du") +
			" " +
			ObjetDate_1.GDate.formatDate(
				aParams.article.dateDebut,
				"%JJ/%MM/%AA %hh:%mm",
			) +
			" " +
			ObjetTraduction_1.GTraductions.getValeur("Au") +
			" " +
			ObjetDate_1.GDate.formatDate(
				aParams.article.dateFin,
				"%JJ/%MM/%AA %hh:%mm",
			);
		return ObjetTraduction_1.GTraductions.getValeur(
			"dispenses.suppressionDispense",
			[aParams.article.eleve.getLibelle(), lDate],
		);
	}
	getMessageSuppressionConfirmation() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"dispenses.confirmerSuppression",
		);
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Dispenses.colonnes.commentaire:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.ZoneTexte;
			case DonneesListe_Dispenses.colonnes.fichierJoint:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_Dispenses.colonnes.publierPJFeuilleDA:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
			default:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
		}
	}
	avecSelecFile(aParams) {
		return (
			this._autorisations.saisie &&
			aParams.idColonne === DonneesListe_Dispenses.colonnes.fichierJoint &&
			aParams.article &&
			(!aParams.article.documents ||
				aParams.article.documents.getNbrElementsExistes() === 0) &&
			!this.appSco.droits.get(ObjetDroitsPN_1.TypeDroits.estEnConsultation)
		);
	}
	getOptionsSelecFile() {
		return {
			maxSize: this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
			),
		};
	}
	evenementSurSelecFile(aParams, aParamsInput) {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		lListe.addElement(aParamsInput.eltFichier);
		this.options.saisie(
			{
				genreSaisie: DonneesListe_Dispenses.genreAction.AjouterDocument,
				article: aParams.article,
				Libelle: aParamsInput.eltFichier.getLibelle(),
				idFichier: aParamsInput.eltFichier.idFichier,
			},
			null,
			null,
			lListe,
		);
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Dispenses.colonnes.eleve:
				return aParams.article.eleve.getLibelle();
			case DonneesListe_Dispenses.colonnes.classe:
				return aParams.article.classe.getLibelle();
			case DonneesListe_Dispenses.colonnes.matiere:
				return aParams.article.matiere.getLibelle();
			case DonneesListe_Dispenses.colonnes.date:
				return (
					ObjetTraduction_1.GTraductions.getValeur("Du") +
					" " +
					ObjetDate_1.GDate.formatDate(
						aParams.article.dateDebut,
						"%JJ/%MM/%AA %hh:%mm",
					) +
					" " +
					ObjetTraduction_1.GTraductions.getValeur("Au") +
					" " +
					ObjetDate_1.GDate.formatDate(
						aParams.article.dateFin,
						"%JJ/%MM/%AA %hh:%mm",
					)
				);
			case DonneesListe_Dispenses.colonnes.presenceObligatoire:
				return aParams.article.presenceOblig
					? ObjetTraduction_1.GTraductions.getValeur("Oui")
					: ObjetTraduction_1.GTraductions.getValeur("Non");
			case DonneesListe_Dispenses.colonnes.heuresPerdues:
				return aParams.article.presenceOblig
					? "-"
					: aParams.article.heuresPerduesTotales;
			case DonneesListe_Dispenses.colonnes.commentaire:
				return aParams.article.commentaire;
			case DonneesListe_Dispenses.colonnes.fichierJoint:
				if (
					!!aParams.article.documents &&
					aParams.article.documents.getNbrElementsExistes() > 0
				) {
					const lListeDocs = aParams.article.documents.getListeElements(
						(aElement) => {
							return aElement.existe();
						},
					);
					const lTitle = aParams.article.documents
						.trier()
						.getTableauLibelles()
						.join("\n");
					if (lListeDocs.count() === 1) {
						return ObjetChaine_1.GChaine.composerUrlLienExterne({
							libelleEcran: IE.jsx.str("i", {
								class: fonts_css_1.StylesFonts.icon_piece_jointe,
								style: "margin-left:auto; margin-right:auto;",
								role: "presentation",
							}),
							documentJoint: lListeDocs.get(0),
							genreRessource: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
							afficherIconeDocument: false,
							ariaLabel: lTitle,
						});
					}
					return IE.jsx.str("ie-btnicon", {
						class: fonts_css_1.StylesFonts.icon_piece_jointe,
						style: "margin-left:auto; margin-right:auto;",
						"ie-model": this.jsxModeleBoutonPJCertificat.bind(
							this,
							aParams.article,
						),
						title: lTitle,
						"aria-haspopup": "menu",
					});
				}
				return "";
			case DonneesListe_Dispenses.colonnes.publierPJFeuilleDA:
				if (
					!!aParams.article.documents &&
					aParams.article.documents.getNbrElementsExistes() > 0
				) {
					return aParams.article.publierPJFeuilleDAppel;
				}
				return false;
			default:
				return false;
		}
	}
	jsxModeleBoutonPJCertificat(aArticle) {
		return {
			event: () => {
				ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
					pere: this.paramsListe.liste,
					initCommandes: function (aMenu) {
						aArticle.documents.parcourir((aDocument) => {
							if (aDocument.existe()) {
								aMenu.add(aDocument.getLibelle(), true, () => {
									_openDocumentDArticle(aDocument);
								});
							}
						});
					},
				});
			},
		};
	}
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Dispenses.colonnes.fichierJoint:
				return aParams.article.documents &&
					aParams.article.documents.count() > 0
					? aParams.article.documents.trier().getTableauLibelles().join("\n")
					: "";
			case DonneesListe_Dispenses.colonnes.commentaire:
				return ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.dispense.commentaireDeLaDispense",
				);
		}
		return "";
	}
	avecEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Dispenses.colonnes.matiere:
				return false;
			case DonneesListe_Dispenses.colonnes.date:
				return false;
			case DonneesListe_Dispenses.colonnes.presenceObligatoire:
				return this._autorisations.saisie;
			case DonneesListe_Dispenses.colonnes.heuresPerdues:
				return false;
			case DonneesListe_Dispenses.colonnes.commentaire:
				return this._autorisations.saisie;
			case DonneesListe_Dispenses.colonnes.fichierJoint:
				return this.avecSelecFile(aParams);
			case DonneesListe_Dispenses.colonnes.publierPJFeuilleDA:
				return (
					this._autorisations.saisie &&
					aParams.idColonne ===
						DonneesListe_Dispenses.colonnes.publierPJFeuilleDA &&
					aParams.article &&
					!!aParams.article.documents &&
					aParams.article.documents.getNbrElementsExistes() > 0 &&
					!this.appSco.droits.get(ObjetDroitsPN_1.TypeDroits.estEnConsultation)
				);
		}
		return false;
	}
	autoriserChaineVideSurEdition(aParams) {
		return aParams.idColonne === DonneesListe_Dispenses.colonnes.commentaire;
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_Dispenses.colonnes.presenceObligatoire:
				aParams.article.presenceOblig = !aParams.article.presenceOblig;
				break;
			case DonneesListe_Dispenses.colonnes.commentaire:
				aParams.article.commentaire = V;
				break;
			case DonneesListe_Dispenses.colonnes.fichierJoint:
				break;
			case DonneesListe_Dispenses.colonnes.publierPJFeuilleDA:
				aParams.article.publierPJFeuilleDAppel = V;
				break;
		}
	}
	avecEvenementEdition(aParams) {
		return (
			this._autorisations.saisie &&
			aParams.idColonne === DonneesListe_Dispenses.colonnes.presenceObligatoire
		);
	}
	getClass(aParams) {
		const lClasses = [];
		switch (aParams.idColonne) {
			case DonneesListe_Dispenses.colonnes.heuresPerdues:
				if (aParams.article.presenceObligatoire) {
					lClasses.push("AlignementMilieu");
				}
				break;
			case DonneesListe_Dispenses.colonnes.fichierJoint:
				lClasses.push("AlignementMilieu");
				break;
		}
		return lClasses.join("");
	}
	getCouleurCellule(aParams) {
		if (
			this._autorisations.saisie &&
			aParams.idColonne === DonneesListe_Dispenses.colonnes.fichierJoint &&
			!this.appSco.droits.get(ObjetDroitsPN_1.TypeDroits.estEnConsultation)
		) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
		}
	}
	getTri(aColonneDeTri, aGenreTri) {
		function _triDate(aGenreTri) {
			return [
				ObjetTri_1.ObjetTri.init("dateDebut", aGenreTri),
				ObjetTri_1.ObjetTri.init("dateFin", aGenreTri),
			];
		}
		let lTris = [];
		if (aColonneDeTri === null || aColonneDeTri === undefined) {
			return lTris;
		}
		const lTriDate = _triDate(aGenreTri);
		if (this.getId(aColonneDeTri) === DonneesListe_Dispenses.colonnes.date) {
			lTris = lTriDate;
		} else {
			lTris = [
				ObjetTri_1.ObjetTri.init(
					this.getValeurPourTri.bind(this, aColonneDeTri),
					aGenreTri,
				),
			];
		}
		let lTriDefaut = [
			ObjetTri_1.ObjetTri.init(
				this.getValeurPourTri.bind(
					this,
					this.getNumeroColonneDId(DonneesListe_Dispenses.colonnes.eleve),
				),
			),
			ObjetTri_1.ObjetTri.init(
				this.getValeurPourTri.bind(
					this,
					this.getNumeroColonneDId(DonneesListe_Dispenses.colonnes.classe),
				),
			),
			ObjetTri_1.ObjetTri.init(
				this.getValeurPourTri.bind(
					this,
					this.getNumeroColonneDId(DonneesListe_Dispenses.colonnes.matiere),
				),
			),
		];
		lTriDefaut = lTriDefaut.concat(lTriDate);
		return lTris.concat(lTriDefaut);
	}
	remplirMenuContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		if (aParametres.surFondListe) {
			return;
		}
		let lAvecCommandeActive = false;
		if (
			aParametres.article &&
			this._autorisations.saisie &&
			aParametres.listeSelection &&
			aParametres.listeSelection.count() === 1
		) {
			const lAvecDocuments =
					aParametres.article.documents &&
					aParametres.article.documents.getNbrElementsExistes() > 0,
				lEstConsultation = this.appSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.estEnConsultation,
				);
			if (lAvecDocuments) {
				if (!lEstConsultation) {
					aParametres.menuContextuel.addSelecFile(
						ObjetTraduction_1.GTraductions.getValeur(
							"dispenses.menu.addDocument",
						),
						{
							getOptionsSelecFile: () => {
								return {
									maxSize: this.appSco.droits.get(
										ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
									),
								};
							},
							addFiles: this.evenementSurSelecFile.bind(this, aParametres),
						},
					);
				}
				_addSousMenuListe({
					menu: aParametres.menuContextuel,
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"dispenses.menu.consulter",
					),
					liste: aParametres.article.documents,
					callback: function (aDocument) {
						_openDocumentDArticle(aDocument);
					},
					pourConsultation: true,
				});
				if (!lEstConsultation && !aParametres.nonEditable) {
					_addSousMenuListe({
						menu: aParametres.menuContextuel,
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"dispenses.menu.supprimer",
						),
						liste: aParametres.article.documents,
						callback: (aDocument) => {
							this.appSco
								.getMessage()
								.afficher({
									type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
									message: ObjetChaine_1.GChaine.format(
										ObjetTraduction_1.GTraductions.getValeur(
											"selecteurPJ.msgConfirmPJ",
										),
										[aDocument.getLibelle()],
									),
								})
								.then((aGenreAction) => {
									if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
										this.options.saisie({
											genreSaisie:
												DonneesListe_Dispenses.genreAction.SupprimerDocument,
											article: aParametres.article,
											document: aDocument,
										});
									}
								});
						},
					});
				}
				lAvecCommandeActive = true;
			}
		}
		return lAvecCommandeActive;
	}
}
exports.DonneesListe_Dispenses = DonneesListe_Dispenses;
(function (DonneesListe_Dispenses) {
	let colonnes;
	(function (colonnes) {
		colonnes["eleve"] = "dispensesEleve";
		colonnes["classe"] = "dispensesClasse";
		colonnes["matiere"] = "dispensesMatiere";
		colonnes["date"] = "dispensesDate ";
		colonnes["presenceObligatoire"] = "dispensesPresenceObligatoire";
		colonnes["heuresPerdues"] = "dispensesHeuresPerdues";
		colonnes["commentaire"] = "dispensesCommentaire";
		colonnes["fichierJoint"] = "dispensesFichierJoint";
		colonnes["publierPJFeuilleDA"] = "dispensesPublierPJFeuilleDA";
	})(
		(colonnes =
			DonneesListe_Dispenses.colonnes ||
			(DonneesListe_Dispenses.colonnes = {})),
	);
	let genreAction;
	(function (genreAction) {
		genreAction[(genreAction["AjouterDocument"] = 0)] = "AjouterDocument";
		genreAction[(genreAction["SupprimerDocument"] = 1)] = "SupprimerDocument";
	})(
		(genreAction =
			DonneesListe_Dispenses.genreAction ||
			(DonneesListe_Dispenses.genreAction = {})),
	);
})(
	DonneesListe_Dispenses ||
		(exports.DonneesListe_Dispenses = DonneesListe_Dispenses = {}),
);
function _openDocumentDArticle(aDocument) {
	window.open(
		ObjetChaine_1.GChaine.creerUrlBruteLienExterne(aDocument, {
			genreRessource: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
		}),
	);
}
function _addSousMenuListe(aParam) {
	if (!aParam.liste || !aParam.liste.count || aParam.liste.count() === 0) {
		return false;
	}
	aParam.menu.addSousMenu(aParam.libelle, (aSousMenu) => {
		aParam.liste.parcourir((aElement) => {
			if (
				aElement.existe() &&
				(!aParam.pourConsultation ||
					aElement.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation)
			) {
				aSousMenu.add(aElement.getLibelle(), true, () => {
					aParam.callback(aElement);
				});
			}
		});
	});
	return true;
}
