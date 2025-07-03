exports._ObjetDetailElementVS = exports.TypeBoutonFenetreDetailElementVS =
	void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDate_1 = require("ObjetDate");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const GUID_1 = require("GUID");
const UtilitaireUrl_1 = require("UtilitaireUrl");
var TypeBoutonFenetreDetailElementVS;
(function (TypeBoutonFenetreDetailElementVS) {
	TypeBoutonFenetreDetailElementVS["Valider"] = "valider";
	TypeBoutonFenetreDetailElementVS["Annuler"] = "annuler";
	TypeBoutonFenetreDetailElementVS["Supprimer"] = "supprimer";
})(
	TypeBoutonFenetreDetailElementVS ||
		(exports.TypeBoutonFenetreDetailElementVS =
			TypeBoutonFenetreDetailElementVS =
				{}),
);
class _ObjetDetailElementVS extends ObjetIdentite_1.Identite {
	constructor() {
		super(...arguments);
		this.idCommentaire = GUID_1.GUID.getId();
		this.elementVS = null;
		this.listeNouveauxDocuments = new ObjetListeElements_1.ObjetListeElements();
		this.ids = {
			labelMotif: GUID_1.GUID.getId(),
			labelCommentaire: GUID_1.GUID.getId(),
		};
		this.optionsAffichage = {
			avecBoutonsValidationDonnees: true,
			afficherNew: false,
			avecCommentaireObligatoire: false,
		};
	}
	getTailleMaxDocJointEtablissement() {
		return 1 * 1024 * 1024;
	}
	setDonnees(aElementVS, aOptionsAffichage) {
		this.elementVS = aElementVS;
		this.listeNouveauxDocuments.vider();
		if (!!aOptionsAffichage) {
			this.setOptionsAffichage(aOptionsAffichage);
		}
		this.afficher();
	}
	getListeNouveauxDocuments() {
		return this.listeNouveauxDocuments;
	}
	setOptionsAffichage(aOptions) {
		Object.assign(this.optionsAffichage, aOptions);
		return this;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			comboMotif: {
				init(aInstanceCombo) {
					if (!!aInstance.optionsAffichage.afficherNew) {
						aInstanceCombo.setOptionsObjetSaisie({
							longueur: 250,
							required: true,
							forcerBoutonDeploiement: true,
							placeHolder: ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.aPreciser",
							),
							ariaLabelledBy: aInstance.ids.labelMotif,
						});
					} else {
						aInstanceCombo.setOptionsObjetSaisie({
							longueur: "100%",
							required: true,
							iconeGauche: "icon_ul",
							largeurListe: 300,
							placeHolder: {
								libelleHtml: aInstance._getContenuCombo(
									ObjetTraduction_1.GTraductions.getValeur(
										"AbsenceVS.aPreciser",
									),
								),
							},
							initAutoSelectionAvecUnElement: false,
							getContenuCellule(aElement) {
								return {
									libelleHtml: aInstance._getContenuCombo(
										aElement.getLibelle() || "",
									),
								};
							},
							getContenuElement(aParams) {
								const T = [];
								if (!!aParams.element) {
									T.push(
										'<div style="width:100%; text-align: center;">',
										aParams.element.getLibelle(),
										"</div>",
									);
								}
								return T.join("");
							},
						});
					}
				},
				getDonnees(aDonnees) {
					if (!aDonnees) {
						return aInstance.getListeMotifs(aInstance.elementVS.getGenre());
					}
				},
				getIndiceSelection() {
					let lIndice = -1;
					if (aInstance.elementVS) {
						const lListeMotifs = aInstance.getListeMotifs(
							aInstance.elementVS.getGenre(),
						);
						if (
							lListeMotifs &&
							aInstance.elementVS.motifParent &&
							aInstance.elementVS.motifParent.existeNumero()
						) {
							const lMotifParent = aInstance.elementVS.motifParent;
							if (lMotifParent && lMotifParent.existeNumero()) {
								lIndice = lListeMotifs.getIndiceParNumeroEtGenre(
									lMotifParent.getNumero(),
								);
							}
						}
					}
					return lIndice;
				},
				event(aParametres) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aInstance.elementVS &&
						aParametres.element &&
						(!aInstance.elementVS.motifParent ||
							aInstance.elementVS.motifParent.getNumero() !==
								aParametres.element.getNumero())
					) {
						aInstance.elementVS.motifParent = aParametres.element;
						aInstance.elementVS.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
			},
			btnUploadDocument: {
				getOptionsSelecFile() {
					return {
						genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
						genreRessourcePJ: aInstance.getGenreRessourceDocumentJointEleve(),
						maxFiles: 1,
						maxSize: aInstance.getTailleMaxDocJointEtablissement(),
					};
				},
				addFiles(aParams) {
					aInstance.listeNouveauxDocuments.addElement(aParams.eltFichier);
					if (!aInstance.elementVS.documents) {
						aInstance.elementVS.documents =
							new ObjetListeElements_1.ObjetListeElements();
					}
					aInstance.elementVS.documents.addElement(aParams.eltFichier);
					aInstance.elementVS.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				},
				getDisabled() {
					return (
						!aInstance.elementVS ||
						(aInstance.elementVS.documents &&
							aInstance.elementVS.documents.getNbrElementsExistes() > 0)
					);
				},
				getIcone() {
					return "icon_piece_jointe";
				},
				getLibelle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.TelechargerUnJustifcatif",
					);
				},
			},
			getLibelleDocumentUploade() {
				let lStrLibelle;
				if (
					aInstance.elementVS &&
					aInstance.elementVS.documents &&
					aInstance.elementVS.documents.getNbrElementsExistes()
				) {
					const lStrDocuments = [];
					aInstance.elementVS.documents.parcourir((aDocument) => {
						if (aDocument.existe()) {
							lStrDocuments.push(
								ObjetChaine_1.GChaine.composerUrlLienExterne({
									documentJoint: aDocument,
									genreDocumentJoint:
										aInstance.getGenreRessourceDocumentJoint(),
									genreRessource:
										aInstance.getGenreRessourceDocumentJointEleve(),
									avecLien: true,
									afficherIconeDocument: false,
									ieChipsMinimal: true,
								}),
							);
						}
					});
					lStrLibelle = lStrDocuments.join(", ");
				} else {
					lStrLibelle = ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.TelechargerUnJustifcatif",
					);
				}
				return lStrLibelle || "";
			},
			getLibellePJ: function () {
				if (
					aInstance.elementVS &&
					aInstance.elementVS.documents &&
					aInstance.elementVS.documents.getNbrElementsExistes()
				) {
					return [
						UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
							aInstance.elementVS.documents,
							{ IEModelChips: "chipsDocument" },
						),
					].join("");
				}
			},
			chipsDocument: {
				eventBtn: function (aIndice) {
					if (
						aInstance.elementVS &&
						aInstance.elementVS.documents &&
						aInstance.elementVS.documents.getNbrElementsExistes()
					) {
						const lDoc = aInstance.elementVS.documents.get(aIndice);
						if (lDoc) {
							lDoc.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
							aInstance.elementVS.setEtat(
								Enumere_Etat_1.EGenreEtat.Modification,
							);
						}
					}
				},
			},
			btnSupprDocumentJoint: {
				event() {
					if (
						aInstance.elementVS &&
						aInstance.elementVS.documents &&
						aInstance.elementVS.documents.getNbrElementsExistes()
					) {
						aInstance.elementVS.documents.parcourir((aDocument) => {
							if (aDocument.existe()) {
								aDocument.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
								aInstance.elementVS.setEtat(
									Enumere_Etat_1.EGenreEtat.Modification,
								);
							}
						});
					}
				},
				estVisible() {
					return (
						aInstance.elementVS &&
						aInstance.elementVS.documents &&
						aInstance.elementVS.documents.count() > 0
					);
				},
			},
			txtCommentaire: {
				getValue() {
					return aInstance.elementVS
						? aInstance.elementVS.justification || ""
						: "";
				},
				setValue(aValue) {
					if (
						aInstance.elementVS &&
						aInstance.elementVS.justification !== aValue
					) {
						aInstance.elementVS.justification = aValue;
						aInstance.elementVS.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
				getDisabled() {
					return !aInstance.elementVS;
				},
			},
			getClassCommentaire: function () {
				return !aInstance.elementVS.justification ? "sansCommentaire" : "";
			},
			btnSupprimerElementVS: {
				event() {
					if (aInstance.elementVS) {
						aInstance.elementVS.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
						aInstance.callback.appel(
							TypeBoutonFenetreDetailElementVS.Supprimer,
							{ element: aInstance.elementVS },
						);
					}
				},
				estVisible() {
					return (
						aInstance.elementVS &&
						aInstance.elementVS.estUneCreationParent &&
						aInstance.elementVS.enAttente
					);
				},
			},
			btnAnnuler: {
				event() {
					aInstance.callback.appel(TypeBoutonFenetreDetailElementVS.Annuler, {
						element: aInstance.elementVS,
					});
				},
			},
			btnValider: {
				event() {
					aInstance.eventCallBackValider();
				},
				getDisabled: function () {
					var _a, _b;
					return (
						!aInstance.elementVS ||
						(aInstance.optionsAffichage.avecCommentaireObligatoire &&
							((_b =
								(_a = aInstance.elementVS.justification) === null ||
								_a === void 0
									? void 0
									: _a.trim()) === null || _b === void 0
								? void 0
								: _b.length) === 0) ||
						aInstance.elementVS.getEtat() === Enumere_Etat_1.EGenreEtat.Aucun ||
						!(
							(aInstance.elementVS.motifParent &&
								aInstance.elementVS.motifParent.existeNumero()) ||
							aInstance.elementVS.estMotifNonEncoreConnu === false
						)
					);
				},
				estVisible() {
					return true;
				},
			},
		});
	}
	eventCallBackValider() {
		this.callback.appel(TypeBoutonFenetreDetailElementVS.Valider, {
			element: this.elementVS,
			listeDocuments: this.listeNouveauxDocuments,
		});
	}
	construireAffichage() {
		const H = [];
		if (this.elementVS) {
			H.push(
				'<div class="ObjetDetailElementVS ObjetFenetre_Edition',
				this.optionsAffichage.afficherNew ? " ovs-saisie-absence" : "",
				'">',
			);
			if (this.optionsAffichage.afficherNew) {
				const lClass = ["field-contain", "border-bottom"];
				if (
					!!this.elementVS.html.nbrHeures ||
					!!this.elementVS.html.nbrHeures ||
					!IE.estMobile
				) {
					lClass.push("p-bottom-xl");
				}
				H.push(IE.jsx.str("div", { class: lClass }, this._construireHeader()));
			} else {
				H.push(this._construireHeader());
			}
			if (this.elementVS.html.avecSaisie) {
				if (this.optionsAffichage.afficherNew) {
					H.push(this._construireSuiteAffichageAvecSaisieNew());
				} else {
					H.push(this._construireSuiteAffichageAvecSaisie());
				}
			} else {
				H.push(this._construireSuiteAffichageSansSaisie());
			}
			H.push("</div>");
		}
		return H.join("");
	}
	_construireHeader() {
		const H = [];
		H.push("<h4>", this.elementVS.infosDate.strDate(), "</h4>");
		if (!!this.elementVS.html.nbrHeures) {
			H.push(
				'<div class="LigneDetailDuree">',
				this.elementVS.html.nbrHeures,
				"</div>",
			);
		}
		if (!!this.elementVS.html.duree) {
			H.push(
				'<div class="LigneDetailDuree">',
				this.elementVS.html.duree,
				"</div>",
			);
		}
		return H.join("");
	}
	_construireSuiteAffichageAvecSaisieNew() {
		return IE.jsx.str(
			"div",
			{ class: ["ObjetFenetre_Edition_Contenu"] },
			this._composeMotif(),
			this._composeUploadDocuments(),
			this._composeCommentaire(),
			this._composeMessage(),
			this._composeBoutons(),
		);
	}
	_construireSuiteAffichageAvecSaisie() {
		const H = [];
		H.push('<div class="ObjetFenetre_Edition_Contenu">');
		H.push('<div class="LigneDetailMotif">');
		if (
			this.elementVS.aJustifierParParents &&
			!this.elementVS.estMotifNonEncoreConnu
		) {
			if (this.elementVS.infosMotif.texte) {
				H.push(
					'<div class="MotifNonSaisissable">',
					this.elementVS.infosMotif.texte,
					"</div>",
				);
			}
		} else {
			H.push(
				'<ie-combo class="rounded separateur-haut" ie-model="comboMotif"></ie-combo>',
			);
		}
		H.push("</div>");
		if (this.estGenreElementAvecUploadDocuments(this.elementVS.getGenre())) {
			H.push('<div class="LigneSaisieDocumentJoint m-top">');
			H.push(
				'<div class="bt-pj-unique flex-contain icon_piece_jointe" ie-model="btnUploadDocument" ie-selecfile>',
				'<div class="libelle-pj fluid-bloc" ie-html="getLibelleDocumentUploade"></div>',
				'<ie-btnimage class="icon_supprimer_pj btnImageIcon" ie-model="btnSupprDocumentJoint" ie-display="btnSupprDocumentJoint.estVisible" title="',
				ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
				'"></ie-btnimage>',
				"</div>",
			);
			H.push("</div>");
		}
		H.push(
			`<div class="p-top-l rounded separateur-haut"><label class="Gras" for="${this.idCommentaire}">${this._getLibelleLabelCommentaire()}</label>`,
			`<ie-textareamax ie-autoresize ie-model="txtCommentaire" maxlength="200" class="txt-comment fluid-bloc" placeholder="${ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.AjouterUnCommentaire")}" ${!IE.estMobile ? 'style="min-height:6rem;"' : ""} ie-class="getClassCommentaire" id="${this.idCommentaire}"></ie-textareamax>`,
			"</div>",
		);
		if (this.elementVS.infosMotif.message) {
			H.push(
				'<div class="LigneMessageInfosMotif">',
				this.elementVS.infosMotif.message,
				"</div>",
			);
		}
		if (this.optionsAffichage.avecBoutonsValidationDonnees) {
			H.push('<div class="flex-contain m-top-xl">');
			H.push(
				'<ie-btnicon ie-model="btnSupprimerElementVS" title="',
				ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.SupprimerDeclaration",
				),
				'" ie-if="btnSupprimerElementVS.estVisible" class="icon_trash bt-activable bt-large ',
				Type_ThemeBouton_1.TypeThemeBouton.secondaire,
				'"></ie-btnicon>',
			);
			H.push(
				'<div class="fluid-bloc AlignementDroit">',
				'<ie-bouton ie-model="btnAnnuler" class="m-right ',
				Type_ThemeBouton_1.TypeThemeBouton.secondaire,
				'">',
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				"</ie-bouton>",
				'<ie-bouton ie-model="btnValider" ie-display="btnValider.estVisible" class="',
				Type_ThemeBouton_1.TypeThemeBouton.primaire,
				'">',
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
				"</ie-bouton>",
				"</div>",
			);
			H.push("</div>");
		}
		H.push("</div>");
		return H.join("");
	}
	_construireSuiteAffichageSansSaisie() {
		const H = [];
		const lDocs = [];
		if (this.elementVS.documents) {
			for (const lDocument of this.elementVS.documents) {
				if (lDocument.existe()) {
					lDocs.push(
						ObjetChaine_1.GChaine.composerUrlLienExterne({
							documentJoint: lDocument,
							genreRessource: this.getGenreRessourceDocumentJoint(),
							avecLien: this.estEspaceParent(),
							afficherIconeDocument: false,
						}),
					);
				}
			}
		}
		H.push(
			'<div class="LigneDetailMotif">',
			this.elementVS.html.motif,
			"</div>",
		);
		if (this.elementVS.html.avecDocuments) {
			H.push(
				'<div class="LigneDetailDocuments">',
				'<i role="presentation" class="icon_piece_jointe"></i>',
				'<div class="Inline">',
				lDocs.join(""),
				"</div>",
				"</div>",
			);
		}
		if (!!this.elementVS.html.commentaire) {
			H.push(
				'<div class="LigneDetailCommentaire">',
				"<span>",
				ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.titres.commentaire",
				).ucfirst(),
				" : </span>",
				'<span class="colorTexte">',
				this.elementVS.html.commentaire,
				"</span>",
				"</div>",
			);
		}
		if (!!this.elementVS.infosMotif.message) {
			H.push(
				'<div class="LigneMessageInfosMotif">',
				this.elementVS.infosMotif.message,
				"</div>",
			);
		}
		const lStrJustification = [];
		if (!!this.elementVS.dateAccepte) {
			const lStrAccepte =
				'<span class="colorTexte">' +
				ObjetDate_1.GDate.formatDate(
					this.elementVS.dateAccepte,
					"%JJJ %J %MMM",
				) +
				"</span>";
			let lStrAffichee;
			if (this.elementVS.estUneCreationParent) {
				lStrAffichee = this.elementVS.refusee
					? ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.absenceRefuseeLe",
							[lStrAccepte],
						).ucfirst()
					: ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.absenceConfirmeeLe",
							[lStrAccepte],
						).ucfirst();
			} else {
				lStrAffichee = ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.justificationAccepteLe",
					[lStrAccepte],
				).ucfirst();
			}
			lStrJustification.push(lStrAffichee);
		} else if (this.elementVS.justifie && this.elementVS.html.justifie) {
			lStrJustification.push(this.elementVS.html.justifie);
		}
		if (lStrJustification.length > 0) {
			H.push(
				'<div class="LigneDetailleeJustification">',
				this.elementVS.html.icon
					? '<span class="colorVS">' + this.elementVS.html.icon + "</span>"
					: "",
				lStrJustification.join(""),
				"</div>",
			);
		}
		return H.join("");
	}
	_composeMotif() {
		if (
			this.elementVS.aJustifierParParents &&
			!this.elementVS.estMotifNonEncoreConnu
		) {
			if (this.elementVS.infosMotif.texte) {
				return IE.jsx.str(
					"div",
					{
						class: [
							"LigneDetailMotif",
							"m-top-l",
							"field-contain",
							"border-bottom",
							"p-bottom-xl",
						],
					},
					IE.jsx.str(
						"div",
						{ class: ["MotifNonSaisissable"] },
						this.elementVS.infosMotif.texte,
					),
				);
			}
		} else {
			return IE.jsx.str(
				"div",
				{ class: ["m-top-l", "field-contain", "border-bottom", "p-bottom-xl"] },
				IE.jsx.str(
					"label",
					{ id: this.ids.labelMotif, class: ["m-bottom"] },
					ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.Raison"),
				),
				IE.jsx.str("ie-combo", {
					"ie-model": "comboMotif",
					class: "full-width",
				}),
			);
		}
		return "";
	}
	_composeUploadDocuments() {
		if (this.estGenreElementAvecUploadDocuments(this.elementVS.getGenre())) {
			return IE.jsx.str(
				"div",
				{ class: ["field-contain", "border-bottom", "p-bottom-xl"] },
				IE.jsx.str(
					"div",
					{ class: ["pj-global-conteneur"] },
					IE.jsx.str("ie-btnselecteur", {
						"ie-model": "btnUploadDocument",
						"ie-selecfile": true,
						"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.TelechargerUnJustifcatif",
						),
						class: "pj",
						role: "button",
					}),
					IE.jsx.str("div", {
						class: ["pj-liste-conteneur"],
						"ie-html": "getLibellePJ",
					}),
				),
			);
		}
		return "";
	}
	_composeCommentaire() {
		const lClass = ["txt-comment fluid-bloc"];
		const lClassSect = ["field-contain"];
		if (this.elementVS.infosMotif.message) {
			lClassSect.push("border-bottom", "p-bottom-xl");
		}
		if (!IE.estMobile) {
			lClass.push("min-height-commentaire");
		}
		return IE.jsx.str(
			"div",
			{ class: lClassSect },
			IE.jsx.str(
				"label",
				{ for: this.ids.labelCommentaire, class: ["m-bottom"] },
				this._getLibelleLabelCommentaire(),
			),
			IE.jsx.str("ie-textareamax", {
				id: this.ids.labelCommentaire,
				"ie-model": "txtCommentaire",
				"ie-autoresize": true,
				maxlength: "200",
				class: lClass,
				placeholder: ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.AjouterUnCommentaire",
				),
			}),
		);
	}
	_getLibelleLabelCommentaire() {
		return this.optionsAffichage.avecCommentaireObligatoire
			? ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.commentaireObligatoire",
				)
			: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.commentaire");
	}
	_composeMessage() {
		if (this.elementVS.infosMotif.message) {
			return IE.jsx.str(
				"div",
				{ class: ["field-contain", "messageInfosMotif"] },
				this.elementVS.infosMotif.message,
			);
		}
		return "";
	}
	_composeBoutons() {
		if (this.optionsAffichage.avecBoutonsValidationDonnees) {
			return IE.jsx.str(
				"div",
				{ class: ["flex-contain", "m-top-xl"] },
				IE.jsx.str("ie-btnicon", {
					class: ["icon_trash", "bt-activable", "bt-large"],
					"ie-model": "btnSupprimerElementVS",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.SupprimerDeclaration",
					),
					"ie-if": "btnSupprimerElementVS.estVisible",
				}),
				IE.jsx.str(
					"div",
					{ class: ["fluid-bloc", "AlignementDroit"] },
					IE.jsx.str(
						"ie-bouton",
						{
							class: ["m-right", Type_ThemeBouton_1.TypeThemeBouton.secondaire],
							"ie-model": "btnAnnuler",
						},
						ObjetTraduction_1.GTraductions.getValeur("Annuler"),
					),
					IE.jsx.str(
						"ie-bouton",
						{
							class: [Type_ThemeBouton_1.TypeThemeBouton.primaire],
							"ie-model": "btnValider",
							"ie-display": "btnValider.estVisible",
						},
						ObjetTraduction_1.GTraductions.getValeur("Valider"),
					),
				),
			);
		}
		return "";
	}
	_getContenuCombo(aLibelle) {
		const T = [
			'<div class="libelle-contain" style="font-size:var(--taille-m)">',
		];
		if (!!aLibelle) {
			if (IE.estMobile) {
				T.push(aLibelle);
			} else {
				T.push("<span>", aLibelle, "</span>");
			}
		}
		T.push("</div>");
		return T.join("");
	}
}
exports._ObjetDetailElementVS = _ObjetDetailElementVS;
