exports.InterfaceMediatheque = void 0;
const ObjetInterface_1 = require("ObjetInterface");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetTraduction_1 = require("ObjetTraduction");
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetIdentite_1 = require("ObjetIdentite");
const GestionnaireBlocVignettesMediatheque_1 = require("GestionnaireBlocVignettesMediatheque");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetRequeteSaisieBlogMediatheque_1 = require("ObjetRequeteSaisieBlogMediatheque");
const ObjetFenetre_ListeMediatheques_1 = require("ObjetFenetre_ListeMediatheques");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetBoutonFlottant_1 = require("ObjetBoutonFlottant");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetVignette_1 = require("ObjetVignette");
const MethodesObjet_1 = require("MethodesObjet");
class InterfaceMediatheque extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.idPage = GUID_1.GUID.getId();
		this.idPageMediatheque = GUID_1.GUID.getId();
		this.idListeDocuments = GUID_1.GUID.getId();
		this.optionsMediatheque = { avecEdition: false };
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			avecZoneDropNouveauxFichiers() {
				return aInstance.optionsMediatheque.avecEdition;
			},
			getRessourceDraggable(aNumeroDoc) {
				const lDoc = aInstance.listeDocuments.getElementParNumero(aNumeroDoc);
				const lMaxWidthLibelle = 200;
				const lMaxHeightLibelle = 25;
				return {
					start(aParams) {
						const lApercuDraggable = [];
						lApercuDraggable.push(
							'<div ie-ellipsis style="max-width:' +
								lMaxWidthLibelle +
								"px; max-height:" +
								lMaxHeightLibelle +
								'px;">' +
								lDoc.libelle +
								"</div>",
						);
						Object.assign(aParams.data, {
							libelle: lApercuDraggable.join(""),
							documentMediatheque: lDoc,
						});
					},
				};
			},
			selecFile: {
				getOptionsSelecFile() {
					return {
						title: "",
						maxFiles: 0,
						maxSize: aInstance.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
						),
						multiple: true,
						acceptDragDrop: true,
						eventClick: false,
						avecTransformationFlux_versCloud:
							GEtatUtilisateur.listeCloud.count() > 0,
						eventSurDrag: function () {},
					};
				},
				addFiles(aParams) {
					aInstance.callback.appel(
						InterfaceMediatheque.GenreCallback.DropNouveauFichier,
						{ parametresSelecFile: aParams },
					);
				},
				getDisabled() {
					return false;
				},
			},
			btnSupprSelectionDocs: {
				event() {
					const lListeDocumentsSelectionnes =
						aInstance.getDocumentsSelectionnes();
					if (
						lListeDocumentsSelectionnes &&
						lListeDocumentsSelectionnes.count() > 0
					) {
						GApplication.getMessage().afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message:
								lListeDocumentsSelectionnes.count() === 1
									? ObjetTraduction_1.GTraductions.getValeur(
											"blog.msgConfirmSupprDocsMediatheque",
										)
									: ObjetTraduction_1.GTraductions.getValeur(
											"blog.msgConfirmSupprDocsMediatheque_S",
										),
							callback: function (aGenreAction) {
								if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
									aInstance.supprimerDocuments(lListeDocumentsSelectionnes);
								}
							},
						});
					}
				},
				getDisabled() {
					const lListeDocumentsSelectionnes =
						aInstance.getDocumentsSelectionnes();
					return (
						!lListeDocumentsSelectionnes ||
						lListeDocumentsSelectionnes.count() === 0
					);
				},
			},
			btnToutCocher: {
				event() {
					if (aInstance.listeDocuments) {
						let lEstTousDocumentsSelectionnes = true;
						for (const lDocument of aInstance.listeDocuments) {
							if (!lDocument.estSelectionne) {
								lEstTousDocumentsSelectionnes = false;
								break;
							}
						}
						let lNouvelleValeurAffichageTousDocuments = true;
						if (lEstTousDocumentsSelectionnes) {
							lNouvelleValeurAffichageTousDocuments = false;
						}
						for (const lDocument of aInstance.listeDocuments) {
							lDocument.estSelectionne = lNouvelleValeurAffichageTousDocuments;
						}
						aInstance.$refresh();
					}
				},
			},
			htmlBoutonToutCocher() {
				const H = [];
				if (aInstance.listeDocuments) {
					const lNbElementsCoches = aInstance._getNbrDocumentsSelectionnes();
					const lNbElementsTotal = aInstance.listeDocuments.count();
					let lClasseIcon;
					if (lNbElementsCoches === 0) {
						lClasseIcon = "icon_check_empty";
					} else if (lNbElementsCoches === lNbElementsTotal) {
						lClasseIcon = "icon_check";
					} else {
						lClasseIcon = "icon_case_indetermine";
					}
					H.push(
						IE.jsx.str(
							IE.jsx.fragment,
							null,
							IE.jsx.str("i", { class: lClasseIcon }),
							IE.jsx.str(
								"span",
								{ class: "m-left-l" },
								ObjetTraduction_1.GTraductions.getValeur("TousSelectionner"),
							),
						),
					);
				}
				return H.join("");
			},
			afficherCocherTout() {
				return aInstance.listeDocuments && aInstance.listeDocuments.count() > 0;
			},
			btnDeplacer: {
				event() {
					aInstance._evntBtnDeplacer();
				},
				getDisabled() {
					const lListeDocumentsSelectionnes =
						aInstance.getDocumentsSelectionnes();
					return (
						!lListeDocumentsSelectionnes ||
						lListeDocumentsSelectionnes.count() === 0
					);
				},
			},
			avecBoutonDeplacer() {
				return aInstance.optionsMediatheque.avecDeplacementDocuments;
			},
			btnNewDoc: {
				event() {
					aInstance.surClicNouveau();
				},
			},
			getIdentiteBouton() {
				return {
					class: ObjetBoutonFlottant_1.ObjetBoutonFlottant,
					pere: this,
					init: function (aBtn) {
						aInstance.btnFlottant = aBtn;
						const lParam = {
							listeBoutons: [
								{
									primaire: true,
									icone: "icon_plus_fin",
									callback: aInstance.surClicNouveau.bind(aInstance),
								},
							],
						};
						aBtn.setOptionsBouton(lParam);
					},
				};
			},
		});
	}
	construireInstances() {
		this.gestionnaireBlocsVignettes = ObjetIdentite_1.Identite.creerInstance(
			GestionnaireBlocVignettesMediatheque_1.GestionnaireBlocVignettesMediatheque,
			{ pere: this, evenement: this._surEvntGestionnaireVignettes },
		);
		this._initialiserVignetteMediatheque(this.gestionnaireBlocsVignettes);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	setOptions(aOptions) {
		$.extend(this.optionsMediatheque, aOptions);
		return this;
	}
	setDonnees(aParam) {
		this.listeMediatheques = aParam.listeMediatheques;
		this.listeDocuments = aParam.listeDocuments;
		this._actualiserPageMediatheque();
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			'<div id="',
			this.idPageMediatheque,
			'" class="page-mediatheque',
			!IE.estMobile && this.optionsMediatheque.avecEdition
				? " flex-contain"
				: "",
			'">',
		);
		H.push('<div class="conteneur-central">');
		if (this.optionsMediatheque.avecEdition) {
			H.push(this._composeBandeauMedia());
		}
		H.push('<section id="main-conteneur-central">');
		if (!IE.estMobile) {
			H.push(this._composeZoneDrop());
		}
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str("div", { id: this.idPage, class: "page-message" }),
				IE.jsx.str(
					"div",
					{ class: "media-wrapper" },
					this._composeHtmlCocherTout(),
					IE.jsx.str("div", {
						class: "conteneur-listeMedia",
						id: this.idListeDocuments,
					}),
				),
			),
		);
		H.push("</section>");
		H.push("</div>");
		H.push("</div>");
		if (IE.estMobile && !this.btnFlottant) {
			$("#" + GInterface.idZonePrincipale).ieHtmlAppend(
				'<div class="is-sticky" ie-identite="getIdentiteBouton" ></div>',
				{ controleur: this.controleur, avecCommentaireConstructeur: false },
			);
		}
		return H.join("");
	}
	composeVignettePJ(aPJ) {
		const H = [];
		const lBloc = this.gestionnaireBlocsVignettes.composeBloc(aPJ);
		H.push(
			'<div class="pj-vignette"',
			this.optionsMediatheque.avecDragDrop === true
				? ObjetHtml_1.GHtml.composeAttr(
						"ie-draggable-fantome",
						"getRessourceDraggable",
						[aPJ.getNumero()],
					)
				: "",
			">",
		);
		H.push(lBloc.html);
		H.push(
			'<div class="cartouche_information_vignette">',
			aPJ.libelle || "",
			"</div>",
		);
		H.push("</div>");
		return { html: H.join(""), controleur: lBloc.controleur };
	}
	composePiecesJointes(aListeDocuments) {
		const H = [];
		aListeDocuments.parcourir((D) => {
			H.push(this.composeVignettePJ(D).html);
		});
		return H.join("");
	}
	surResizeInterface() {
		this._actualiserPageMediatheque();
	}
	_surEvntGestionnaireVignettes(aParametresGestionnaireVignettes) {
		switch (aParametresGestionnaireVignettes.evnt) {
			case ObjetVignette_1.ETypeEvntVignette.selectionVignette:
				this.$refresh();
				this.callback.appel(
					InterfaceMediatheque.GenreCallback.SelectionVignettes,
				);
				break;
		}
	}
	_saisie(aListeFichiers, aListeCloud) {
		const lParamUpload = { listeFichiers: null, listeDJCloud: null };
		if (
			aListeFichiers !== null &&
			aListeFichiers !== undefined &&
			aListeFichiers.count() > 0
		) {
			$.extend(lParamUpload, { listeFichiers: aListeFichiers });
		}
		if (
			aListeCloud !== null &&
			aListeCloud !== undefined &&
			aListeCloud.count() > 0
		) {
			$.extend(lParamUpload, { listeDJCloud: aListeCloud });
		}
		new ObjetRequeteSaisieBlogMediatheque_1.ObjetRequeteSaisieBlogMediatheque(
			this,
		)
			.addUpload(lParamUpload)
			.lancerRequete(
				ObjetRequeteSaisieBlogMediatheque_1.TypeSaisieMediatheque
					.AjouterDocuments,
				{},
			)
			.catch(() => {
				IE.log.addLog("Erreur saisie médiathèque blog");
			})
			.then(() => {
				this.callback.appel(InterfaceMediatheque.GenreCallback.apresSaisie);
			});
	}
	free() {
		super.free();
		if (this.btnFlottant) {
			$("#" + this.btnFlottant.getNom().escapeJQ()).remove();
		}
	}
	_afficherMessage(aMessage) {
		ObjetHtml_1.GHtml.setDisplay(this.idListeDocuments, false);
		ObjetHtml_1.GHtml.setDisplay(this.idPage, true);
		ObjetHtml_1.GHtml.setHtml(this.idPage, this.composeMessage(aMessage));
	}
	_afficherPageMediatheque() {
		ObjetHtml_1.GHtml.setDisplay(this.idListeDocuments, true);
		ObjetHtml_1.GHtml.setDisplay(this.idPage, false);
		this._actualiserListeDocuments(this.listeDocuments);
	}
	_actualiserPageMediatheque() {
		if (!this.listeDocuments || this.listeDocuments.count() === 0) {
			this._afficherMessage(this.optionsMediatheque.msgMediathequeVide);
		} else {
			this._afficherPageMediatheque();
		}
	}
	_initialiserVignetteMediatheque(aInstance) {
		aInstance.setOptions({
			petitFormat: this.optionsMediatheque.avecVignettesPetitFormat,
		});
	}
	_actualiserListeDocuments(aListeDocuments) {
		if (aListeDocuments && aListeDocuments.count() > 0) {
			ObjetHtml_1.GHtml.setDisplay(this.idListeDocuments, true);
			ObjetHtml_1.GHtml.setDisplay(this.idPage, false);
			ObjetHtml_1.GHtml.setHtml(
				this.idListeDocuments,
				this.composePiecesJointes(aListeDocuments),
				{ controleur: this.controleur },
			);
		} else {
			ObjetHtml_1.GHtml.setDisplay(this.idListeDocuments, false);
			ObjetHtml_1.GHtml.setDisplay(this.idPage, true);
			ObjetHtml_1.GHtml.setHtml(
				this.idPage,
				this.composeMessage(
					ObjetTraduction_1.GTraductions.getValeur(
						"blog.aucunDocDansCategorie",
					),
				),
			);
		}
		this.gestionnaireBlocsVignettes.refresh();
	}
	_composeHtmlBtnNewDoc() {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "media-btn" },
					IE.jsx.str(
						"ie-bouton",
						{
							"ie-model": "btnNewDoc",
							"ie-icon": "icon_plus_fin",
							class: "themeBoutonPrimaire",
						},
						ObjetTraduction_1.GTraductions.getValeur("blog.ajouter"),
					),
				),
			),
		);
		return H.join("");
	}
	_composeHtmlBtnSupprimer() {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "media-btn" },
					IE.jsx.str("ie-btnicon", {
						"ie-model": "btnSupprSelectionDocs",
						class: "icon_trash avecFond",
						title: ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
					}),
				),
			),
		);
		return H.join("");
	}
	_composeHtmlBtnDeplacer() {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "media-btn" },
					IE.jsx.str("ie-btnicon", {
						"ie-if": "avecBoutonDeplacer",
						"ie-model": "btnDeplacer",
						class: "icon_reply avecFond",
						title: ObjetTraduction_1.GTraductions.getValeur(
							"blog.deplacerCategorie",
						),
					}),
				),
			),
		);
		return H.join("");
	}
	_composeHtmlCocherTout() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ "ie-if": "afficherCocherTout" },
				IE.jsx.str("ie-bouton", {
					class: "themeBoutonNeutre flex-contain flex-center",
					"ie-model": "btnToutCocher",
					"ie-html": "htmlBoutonToutCocher",
				}),
			),
		);
	}
	_composeBandeauMedia() {
		const H = [];
		H.push('<header class="media-bandeau-btn">');
		H.push('<div class="zone-media-gauche">');
		if (!IE.estMobile) {
			H.push(this._composeHtmlBtnNewDoc());
		}
		H.push("</div>");
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "zone-media-droite flex-contain flex-center" },
					this._composeHtmlBtnDeplacer(),
					this._composeHtmlBtnSupprimer(),
				),
			),
		);
		H.push("</header>");
		return H.join("");
	}
	_composeZoneDrop() {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{
						"ie-if": "avecZoneDropNouveauxFichiers",
						"ie-model": "selecFile",
						"ie-selecFile": true,
						class: "conteneur-selecFile ie-sous-titre",
					},
					ObjetTraduction_1.GTraductions.getValeur("blog.dropRessources"),
				),
			),
		);
		return H.join("");
	}
	surClicNouveau() {
		this.callback.appel(
			InterfaceMediatheque.GenreCallback.SurClicBoutonNouveau,
		);
	}
	_evntBtnDeplacer() {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_ListeMediatheques_1.ObjetFenetre_ListeMediatheques,
			{
				pere: this,
				evenement(aNumeroBouton, aParam) {
					if (aNumeroBouton === 1) {
						const lListeDocsSelectionnes = this.getDocumentsSelectionnes();
						if (lListeDocsSelectionnes) {
						}
					}
				},
			},
		);
		const lListeMediathequesCopie = MethodesObjet_1.MethodesObjet.dupliquer(
			this.listeMediatheques,
		);
		if (lListeMediathequesCopie) {
			for (const lMediatheque of lListeMediathequesCopie) {
				lMediatheque.estUnDeploiement = false;
			}
		}
		lFenetre.setDonnees(lListeMediathequesCopie);
	}
	supprimerDocuments(aListeDocuments) {
		if (aListeDocuments && aListeDocuments.count() > 0) {
			for (const lDocument of aListeDocuments) {
				lDocument.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			}
			this.callback.appel(
				InterfaceMediatheque.GenreCallback.SuppressionDocuments,
				{ listeDocuments: aListeDocuments },
			);
		}
	}
	getDocumentsSelectionnes() {
		let lListeSelectionnes = null;
		if (this.listeDocuments) {
			lListeSelectionnes = this.listeDocuments.getListeElements((aDoc) => {
				return aDoc.estSelectionne;
			});
		}
		return lListeSelectionnes;
	}
	_getNbrDocumentsSelectionnes() {
		const lListeDocsSelectionnes = this.getDocumentsSelectionnes();
		return lListeDocsSelectionnes ? lListeDocsSelectionnes.count() : 0;
	}
}
exports.InterfaceMediatheque = InterfaceMediatheque;
(function (InterfaceMediatheque) {
	let GenreCallback;
	(function (GenreCallback) {
		GenreCallback["SurClicBoutonNouveau"] = "SurClicBoutonNouveau";
		GenreCallback["DropNouveauFichier"] = "DropNouveauFichier";
		GenreCallback["SuppressionDocuments"] = "SuppressionDocuments";
		GenreCallback["SelectionVignettes"] = "SelectionVignettes";
		GenreCallback["dropDeDocSurDossier"] = "dropDeDocSurDossier";
		GenreCallback["apresSaisie"] = "apresSaisie";
	})(
		(GenreCallback =
			InterfaceMediatheque.GenreCallback ||
			(InterfaceMediatheque.GenreCallback = {})),
	);
})(
	InterfaceMediatheque ||
		(exports.InterfaceMediatheque = InterfaceMediatheque = {}),
);
