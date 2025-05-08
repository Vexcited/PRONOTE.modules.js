exports.FicheCours = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetStyle_1 = require("ObjetStyle");
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_2 = require("ObjetStyle");
const ObjetDate_1 = require("ObjetDate");
const ObjetFiche_1 = require("ObjetFiche");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const TypeDomaine_1 = require("TypeDomaine");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeStatutCours_1 = require("TypeStatutCours");
const InterfaceSelectionRessourceCours_1 = require("InterfaceSelectionRessourceCours");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const ObjetFenetre_1 = require("ObjetFenetre");
const GestionnaireModale_1 = require("GestionnaireModale");
const UtilitaireVisiosSco_1 = require("UtilitaireVisiosSco");
const tag_1 = require("tag");
const jsx_1 = require("jsx");
class FicheCours extends ObjetFiche_1.ObjetFiche {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this._options = {
			hauteurDecroche: GNavigateur.isTactile ? 20 : 15,
			largeurContenu: 220,
			largeurContenuConseil: 270,
			largeurContenuAvecDiagnostic: 250,
			hauteurMemo: 46,
			nbFicheScroll: 4,
		};
		const lId = GUID_1.GUID.getId();
		this.idContenu = lId + "_contenu";
		this.IdPremierElement = this.idContenu;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			nodeSpanFocus() {
				$(this.node).on("focus", function () {
					aInstance.focusSurPremierElement();
				});
			},
			btnInfo: {
				event: function () {
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_1.ObjetFenetre,
						{ pere: aInstance },
						{
							largeur: 400,
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"SaisieCours.ContraintesPrisesEnCompte",
							),
							listeBoutons: [
								ObjetTraduction_1.GTraductions.getValeur("Fermer"),
							],
						},
					).afficher(
						ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.LegendeDiagnostic",
						),
					);
				},
			},
			btnCroixFermeture: {
				event: function () {
					aInstance.fermer();
				},
			},
			getNodeContenu: function () {
				$(this.node).on({
					mousedown: function () {
						GestionnaireModale_1.GestionnaireModale.enPremierPlan(
							aInstance.Nom,
						);
					},
					keyup: function () {
						if (GNavigateur.isToucheEchap()) {
							aInstance.fermer();
						}
					},
				});
			},
			getNodeEntete: function (aIndiceCours) {
				$(this.node).eventValidation(() => {
					if (aInstance._fenetreEnDeplacement) {
						return;
					}
					const lCours = aInstance._parametres.listeCours.get(aIndiceCours);
					if (aInstance._parametres.callbackEntete) {
						aInstance._parametres.callbackEntete(lCours);
					}
				});
			},
			btnRemplacementSalle: {
				event: function (aIndice) {
					const lCours = aInstance._parametres.listeCours.get(aIndice);
					aInstance._surModificationRessourceCours(
						lCours,
						Enumere_Ressource_1.EGenreRessource.Salle,
						aInstance
							._getListeContenusDeGenre(
								lCours,
								Enumere_Ressource_1.EGenreRessource.Salle,
							)
							.get(0),
					);
				},
				getDisabled: function (aIndice) {
					const lCours = aInstance._parametres.listeCours.get(aIndice);
					const lListe = aInstance._getListeContenusDeGenre(
						lCours,
						Enumere_Ressource_1.EGenreRessource.Salle,
					);
					return lListe.count() !== 1;
				},
			},
			btnDeplacerAutreSemaine: {
				event: function (aIndice) {
					const lCours = aInstance._parametres.listeCours.get(aIndice);
					aInstance._parametres.callbackDeplacerCoursAutreSemaine(lCours);
				},
				getDisabled: function (aIndice) {
					const lCours = aInstance._parametres.listeCours.get(aIndice);
					return (
						!lCours ||
						(aIndice === 0 && aInstance._parametres.listeCours.count() > 1) ||
						!aInstance._parametres.rechercheCreneauLibreActif ||
						!aInstance._parametres.rechercheCreneauLibreActif(lCours)
					);
				},
			},
			btnSuppression: {
				event: function (aIndice) {
					const lCours = aInstance._parametres.listeCours.get(aIndice);
					aInstance._parametres.callbackSuppressionCours(
						lCours,
						lCours.numeroSemaine,
					);
				},
				getDisabled: function (aIndice) {
					const lCours = aInstance._parametres.listeCours.get(aIndice);
					return (
						!lCours ||
						!aInstance._parametres.suppressionCoursActif ||
						!aInstance._parametres.suppressionCoursActif(lCours)
					);
				},
			},
			btnCDT: {
				event: function (aIndice) {
					const lCours = aInstance._parametres.listeCours.get(aIndice);
					if (lCours && aInstance._parametres.callbackCDT) {
						aInstance._parametres.callbackCDT(lCours, lCours.numeroSemaine);
					}
				},
			},
			btnListeVisiosCours: {
				event: function (aIndice) {
					const lCours = aInstance._parametres.listeCours.get(aIndice);
					UtilitaireVisiosSco_1.UtilitaireVisios.ouvrirFenetreEditionVisiosCours(
						lCours,
						aInstance._parametres.callbackSaisieVisios,
					);
				},
				getDisabled: function () {
					return aInstance.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.estEnConsultation,
					);
				},
			},
			btnMemo: {
				event: function (aIndice) {
					const lCours = aInstance._parametres.listeCours.get(aIndice);
					if (aInstance._parametres.ouvrirFenetreMemo) {
						aInstance._parametres.ouvrirFenetreMemo({
							cours: lCours,
							nonEditable: !aInstance._editionMemoPossible(lCours),
						});
					}
				},
				getDisabled: function () {
					return !aInstance._parametres.ouvrirFenetreMemo;
				},
			},
			memo: {
				getValue: function (aIndice) {
					const lCours = aInstance._parametres.listeCours.get(aIndice);
					return lCours.memo;
				},
				setValue: function (aIndice, aValue) {
					const lCours = aInstance._parametres.listeCours.get(aIndice);
					lCours.memo = aValue;
					lCours.editionMemoEnCours = true;
					ControleSaisieEvenement_1.ControleSaisieEvenement.addSaisieEnCours(
						aInstance._parametres.callbackSaisieMemo.bind(
							aInstance,
							lCours,
							lCours.memo,
						),
					);
				},
				exitChange: function (aIndice) {
					const lCours = aInstance._parametres.listeCours.get(aIndice);
					ControleSaisieEvenement_1.ControleSaisieEvenement.saisieEnCours();
				},
				getDisabled: function (aIndice) {
					const lCours = aInstance._parametres.listeCours.get(aIndice);
					return (
						!aInstance._parametres.callbackSaisieMemo ||
						!aInstance._editionMemoPossible(lCours)
					);
				},
				node: function (aIndice) {
					$(this.node).on("destroyed", () => {
						const lCours = aInstance._parametres.listeCours.get(aIndice);
						if (lCours && lCours.editionMemoEnCours) {
							lCours.editionMemoEnCours = false;
							ControleSaisieEvenement_1.ControleSaisieEvenement.saisieEnCours();
						}
					});
				},
			},
			memoPrive: {
				getValue: function (aIndice) {
					return aInstance._parametres.listeCours.get(aIndice).memoPrive;
				},
				getDisabled() {
					return true;
				},
			},
		});
	}
	setDonneesFicheCours(aParametres) {
		this._parametres = Object.assign(
			{
				id: "",
				listeCours: new ObjetListeElements_1.ObjetListeElements(),
				coursSelectionne: null,
				afficherCDT: true,
				diagnosticPlace: null,
				estEDTAnnuel: false,
				domaine: new TypeDomaine_1.TypeDomaine(),
				nonEditable: true,
				avecLibelleCours: false,
				afficherMemo: true,
				avecEditionMemo: false,
				avecModificationCoursPossible: null,
				avecModificationMemoPossible: null,
				suppressionCoursVisible: null,
				suppressionCoursActif: null,
				callbackSuppressionCours: null,
				callbackSuppressionRessource: null,
				callbackModificationRessource: null,
				ouvrirFenetreMemo: null,
				callbackSaisieMemo: null,
				callbackCDT: null,
				callbackSaisieVisios: null,
				callbackEntete: null,
				rechercheCreneauLibrePossible: null,
				rechercheCreneauLibreActif: null,
				callbackDeplacerCoursAutreSemaine: null,
				avecDiagnosticRessource: false,
				listeCoursDiagnostic: null,
				positionCours: null,
			},
			aParametres,
		);
		this._afficher();
	}
	actualiserFicheCours(aParametres) {
		this._detruireInstances();
		Object.assign(this._parametres, aParametres);
		this._afficher();
	}
	async actualiser(aParametres) {
		this.actualiserFicheCours(aParametres);
		return null;
	}
	fermer(aSurInteractionUtilisateur) {
		const lResult = super.fermer(aSurInteractionUtilisateur);
		this._detruireInstances();
		return lResult;
	}
	focusSurPremierElement() {
		ObjetHtml_1.GHtml.setFocus(this.idContenu);
	}
	compose() {
		this.selec = [];
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str("span", {
				class: "sr-only",
				tabindex: "0",
				"ie-node": "nodeSpanFocus",
			}),
			IE.jsx.str(
				"div",
				{
					class: "FicheCours",
					"ie-node": "getNodeContenu",
					id: this.idContenu,
					tabindex: "-1",
					role: "dialog",
					"aria-label":
						ObjetTraduction_1.GTraductions.getValeur("WAI.FicheCours"),
				},
				this._composeDecrocheTop(),
				IE.jsx.str(
					"div",
					{
						class: "Fenetre_Bordure ConteneurFiches ombre-cadre",
						role: "list",
					},
					(H) => {
						const lNombre = this._parametres.listeCours.count();
						const lAvecScrollH = lNombre > this._options.nbFicheScroll;
						const lEtatListeCours = {
							htmlBarreOutil: [],
							avecBarreOutilPied: false,
							avecStatut: false,
						};
						this._parametres.listeCours.parcourir((aCours, aIndex) => {
							lEtatListeCours.htmlBarreOutil[aIndex] =
								this._composeBoutonsBarreOutils(aCours, aIndex);
							if (lEtatListeCours.htmlBarreOutil[aIndex]) {
								lEtatListeCours.avecBarreOutilPied = true;
							}
							if (aCours.Statut) {
								lEtatListeCours.avecStatut = true;
							}
						});
						for (let I = 0; I < lNombre; I++) {
							H.push(this._composeCours(I, lAvecScrollH, lEtatListeCours));
							if (lNombre > 1 && I === 0) {
								H.push(
									IE.jsx.str("div", {
										class: "SeparateurPremiereFiche",
										role: "presentation",
										style: ObjetStyle_2.GStyle.composeCouleurFond(
											GCouleur.fenetre.bordure,
										),
									}),
								);
							}
							if (lAvecScrollH && I === 0) {
								let lLargeurScroll = 0;
								for (
									let lICours = 1;
									lICours < this._options.nbFicheScroll;
									lICours++
								) {
									lLargeurScroll +=
										this._getLargeurContenu(
											this._parametres.listeCours.get(lICours),
										) +
										2 +
										5 * 2;
								}
								H.push(
									'<div ie-scrollh role="presentation" style="',
									ObjetStyle_2.GStyle.composeWidth(lLargeurScroll),
									'">',
									'<div class="ConteneurFiches" role="presentation">',
								);
							}
						}
						if (lAvecScrollH) {
							H.push("</div></div>");
						}
					},
				),
			),
			IE.jsx.str("span", {
				class: "sr-only",
				tabindex: "0",
				"ie-node": "nodeSpanFocus",
			}),
		);
	}
	surPreAffichage() {
		for (let i = 0; i < this._parametres.listeCours.count(); i++) {
			this.selec[i].initialiser();
			const lCours = this._parametres.listeCours.get(i);
			if (
				lCours.getGenre() === TypeStatutCours_1.TypeStatutCours.ConseilDeClasse
			) {
				this._initInterfaceSelectionRessourcesConseil(i, lCours);
			} else {
				this._initInterfaceSelectionRessources(i, lCours);
			}
		}
	}
	_afficher() {
		if (
			!this.EnAffichage &&
			!ObjetHtml_1.GHtml.elementExiste(this._parametres.id)
		) {
			IE.log.addLog("FicheCours : afficher sans avoir d'id d'ancrage");
			return;
		}
		if (
			!this._parametres.listeCours ||
			this._parametres.listeCours.count() === 0
		) {
			this.fermer(false);
			return;
		}
		this._parametres.listeCours.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				return !D.estAnnule;
			}),
			ObjetTri_1.ObjetTri.init("numeroSemaine"),
			ObjetTri_1.ObjetTri.init("place"),
			ObjetTri_1.ObjetTri.init("duree"),
		]);
		this._parametres.listeCours.trier();
		this.afficherFiche({ id: this._parametres.id });
	}
	_detruireInstances() {
		this.detruireInstancesFils();
		this.selec = [];
	}
	_composeDecrocheTop() {
		const H = [];
		const lLargeurSVG = 10;
		const lHauteurSVG = this._options.hauteurDecroche + 2;
		const lCouleurBordure = "#B3B3B3";
		H.push(
			'<div class="EnteteDecroche" style="top:-',
			this._options.hauteurDecroche,
			"px;",
			ObjetStyle_2.GStyle.composeHeight(this._options.hauteurDecroche),
			'">',
		);
		H.push(
			"<div>",
			'<svg height="',
			lHauteurSVG,
			'px" width="',
			lLargeurSVG,
			'px" xmlns="http://www.w3.org/2000/svg">',
			'<polygon  points="',
			ObjetChaine_1.GChaine.format("%1:s 0, 0 %0:s, %1:s %0:s", [
				lHauteurSVG,
				lLargeurSVG,
			]),
			'"',
			' style="fill:',
			GCouleur.fenetre.fond,
			';" />',
			'<line x1="',
			lLargeurSVG,
			'" x2="0" y1="0" y2="',
			lHauteurSVG - 1,
			'" stroke="',
			lCouleurBordure,
			'"/>',
			"</svg>",
			"</div>",
		);
		H.push(
			'<div style="',
			ObjetStyle_2.GStyle.composeCouleurBordure(
				lCouleurBordure,
				1,
				ObjetStyle_1.EGenreBordure.haut + ObjetStyle_1.EGenreBordure.droite,
			),
			ObjetStyle_2.GStyle.composeCouleurFond(GCouleur.fenetre.fond),
			ObjetStyle_2.GStyle.composeHeight(this._options.hauteurDecroche + 1),
			'">',
		);
		H.push('<div class="EnteteDecrocheIcones">');
		const lFontSizeIcon = Math.floor(
			this._options.hauteurDecroche - this._options.hauteurDecroche / 5,
		);
		if (
			this._parametres.avecDiagnosticRessource &&
			!this._parametres.estEDTAnnuel
		) {
			H.push(
				'<ie-btnimage class="btnImageIcon icon_info_sign" ie-model="btnInfo" style="position:relative; top:-1px; font-size:',
				lFontSizeIcon,
				'px;margin-right:5px;" title="',
				ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.HintRubriMontrerLegende",
				),
				'">',
				"</ie-btnimage>",
			);
		}
		H.push(
			'<ie-btnimage class="btnImageIcon icon_remove" ie-model="btnCroixFermeture" style="position:relative; top:0px; font-size:',
			lFontSizeIcon + 1,
			'px;" title="',
			ObjetTraduction_1.GTraductions.getValeur("WAI.FermerFiche"),
			'">',
			"</ie-btnimage>",
		);
		H.push("</div>");
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
	_composeCours(aIndiceCours, aAvecScrollH, aEtatListeCours) {
		const lCours = this._parametres.listeCours.get(aIndiceCours);
		const llargeur = this._getLargeurContenu(lCours) + 2;
		const H = [];
		H.push(
			'<div id="',
			this.idContenu,
			"_",
			aIndiceCours,
			'" class="ConteneurCours" role="listitem">',
		);
		H.push(
			this._construireBlocEntete(
				lCours,
				aIndiceCours,
				llargeur,
				aEtatListeCours,
			),
		);
		this.selec[aIndiceCours] =
			new InterfaceSelectionRessourceCours_1.InterfaceSelectionRessourceCours(
				this.getNom() + ".selec[" + aIndiceCours + "]",
				null,
				this,
			);
		H.push(
			'<div id="' +
				this.selec[aIndiceCours].getNom() +
				'" style="flex-grow:2;"></div>',
		);
		const lAvecEditionMemo = this._editionMemoPossible(lCours);
		if (this._parametres.afficherMemo) {
			if (lAvecEditionMemo || lCours.memo) {
				H.push((0, tag_1.tag)("div", this._construireMemo(aIndiceCours, true)));
			}
			if (lCours.memoPrive) {
				H.push(
					(0, tag_1.tag)(
						"div",
						{ class: "p-top" },
						this._construireMemo(aIndiceCours, false),
					),
				);
			}
		}
		if (aEtatListeCours.avecBarreOutilPied) {
			H.push(
				'<div class="BarreOutils">' +
					aEtatListeCours.htmlBarreOutil[aIndiceCours] +
					"</div>",
			);
		}
		if (aAvecScrollH) {
			H.push('<div style="height:11px;"></div>');
		}
		H.push("</div>");
		return H.join("");
	}
	_construireMemo(aIndiceCours, aMemoPublic) {
		const H = [];
		H.push('<div style="display:flex; align-items: center;">');
		const lId = `${this.Nom}_memo_${aIndiceCours}_${aMemoPublic}`;
		H.push(
			IE.jsx.str(
				"div",
				{ style: "flex-grow:2", id: lId },
				aMemoPublic
					? ObjetTraduction_1.GTraductions.getValeur("EDT.MemoPublic")
					: ObjetTraduction_1.GTraductions.getValeur("EDT.MemoAdministratif"),
			),
		);
		if (aMemoPublic) {
			H.push(
				'<div class="cont-memo">',
				"<ie-btnicon ",
				ObjetHtml_1.GHtml.composeAttr("ie-model", "btnMemo", aIndiceCours),
				' class="icon_post_it_rempli color-neutre"',
				' title="',
				ObjetTraduction_1.GTraductions.getValeur("EDT.AfficherMemo"),
				'"></ie-btnimage>',
				"</div>",
			);
		}
		H.push("</div>");
		H.push(
			IE.jsx.str("ie-textareamax", {
				"ie-model": (0, jsx_1.jsxFuncAttr)(
					aMemoPublic ? "memo" : "memoPrive",
					aIndiceCours,
				),
				"aria-labelledby": lId,
				style:
					ObjetStyle_2.GStyle.composeHeight(this._options.hauteurMemo) +
					ObjetStyle_2.GStyle.composeCouleurBordure(GCouleur.bordure),
				maxlength: "255",
				class: "browser-default",
			}),
		);
		return H.join("");
	}
	_auMoinsUnAutreCoursEnteteCliquable(aCours) {
		if (this._parametres.listeCours.count() > 1) {
			let lResult = false;
			this._parametres.listeCours.parcourir((D) => {
				if (
					D !== aCours &&
					(this._parametres.estEDTAnnuel ||
						this._parametres.domaine.getValeur(D.numeroSemaine)) &&
					D.ressourcePresente
				) {
					lResult = true;
					return false;
				}
			});
			return lResult;
		}
		return false;
	}
	_composeBoutonsBarreOutils(aCours, aIndiceCours) {
		const HGauche = [];
		const HDroit = [];
		const lEstConseilDeClasse =
			aCours.getGenre() === TypeStatutCours_1.TypeStatutCours.ConseilDeClasse;
		if (
			this._estEspaceAvecSaisieLiensVisio() &&
			!!aCours &&
			!!aCours.urlCoursModifiable &&
			!this._parametres.nonEditable
		) {
			let lHintBouton = "";
			if (
				!!aCours.listeVisios &&
				aCours.listeVisios.getNbrElementsExistes() > 0
			) {
				lHintBouton =
					UtilitaireVisiosSco_1.UtilitaireVisios.getHintListeVisiosCours(
						aCours.listeVisios,
					);
			} else {
				lHintBouton = ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.AssocierURL",
				);
			}
			const lId = `${this.getNom()}_${aIndiceCours}_btnvisio`;
			HGauche.push(
				IE.jsx.str(
					"div",
					{ class: "BoutonOutils" },
					IE.jsx.str("ie-btnimage", {
						"ie-model": (0, jsx_1.jsxFuncAttr)(
							"btnListeVisiosCours",
							aIndiceCours,
						),
						class: [
							"btnImageIcon ",
							UtilitaireVisiosSco_1.UtilitaireVisios.getNomIconePresenceVisios(),
						],
						"ie-hint": lHintBouton,
						"aria-labelledby": lId,
						style: "font-size:1.5rem; color: white;",
					}),
					IE.jsx.str("div", { class: "sr-only", id: lId }, lHintBouton),
				),
			);
		}
		if (this._parametres.afficherCDT && aCours.avecCDT) {
			HGauche.push(
				'<div class="BoutonOutils">',
				'<ie-btnimage ie-model="btnCDT(',
				aIndiceCours,
				')"',
				' class="Image_CahierDeTexte6Etats" style="width:19px;"',
				' title="',
				ObjetTraduction_1.GTraductions.getValeur("EDT.AfficherCDT"),
				'"></ie-btnimage>',
				"</div>",
			);
		}
		if (
			!this._parametres.nonEditable &&
			!lEstConseilDeClasse &&
			this._parametres.rechercheCreneauLibrePossible &&
			this._parametres.callbackDeplacerCoursAutreSemaine &&
			this._parametres.rechercheCreneauLibrePossible(aCours)
		) {
			HDroit.push(
				'<div class="BoutonOutils">',
				'<ie-btnimage class="Image_FicheCoursBtnDeplacerFiche" style="width:18px;"',
				ObjetHtml_1.GHtml.composeAttr(
					"ie-model",
					"btnDeplacerAutreSemaine",
					aIndiceCours,
				),
				ObjetHtml_1.GHtml.composeAttr(
					"title",
					ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.HintDeplacerCours",
					),
				),
				"></ie-btnimage>",
				"</div>",
			);
		}
		if (
			!this._parametres.nonEditable &&
			!lEstConseilDeClasse &&
			this._parametres.callbackSuppressionCours &&
			this._parametres.suppressionCoursVisible &&
			this._parametres.suppressionCoursVisible(aCours)
		) {
			const lAnnulation =
				!aCours.supprimable && this._parametres.listeCours.count() > 1;
			HDroit.push(
				'<div class="BoutonOutils">',
				'<ie-btnimage class="',
				!lAnnulation
					? "Image_FicheCoursBtnSupprimerFiche"
					: "Image_FicheCoursBtnAnnulerFiche",
				'" style="width:18px;"',
				ObjetHtml_1.GHtml.composeAttr(
					"ie-model",
					"btnSuppression",
					aIndiceCours,
				),
				ObjetHtml_1.GHtml.composeAttr(
					"title",
					!lAnnulation
						? ObjetTraduction_1.GTraductions.getValeur(
								"SaisieCours.SupprimerCours",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"SaisieCours.AnnulerModification",
							),
				),
				"></ie-btnimage>",
				"</div>",
			);
		}
		const lHtml = [HGauche.join("")];
		if (HDroit.length > 0) {
			lHtml.push('<div style="flex:2 0 auto;"></div>');
		}
		lHtml.push(HDroit.join(""));
		return lHtml.join("");
	}
	_construireBlocEntete(aCours, aIndiceCours, alargeur, aEtatListeCours) {
		const lAfficherBlocSelection =
			this._parametres.listeCours.count() > 1 &&
			this._estCoursSelectionne(aCours);
		const H = [];
		const lEstConseilDeClasse =
			aCours.getGenre() === TypeStatutCours_1.TypeStatutCours.ConseilDeClasse;
		const lAvecClickEntete =
			this._parametres.callbackEntete &&
			(this._parametres.estEDTAnnuel ||
				this._parametres.domaine.getValeur(aCours.numeroSemaine)) &&
			!lEstConseilDeClasse &&
			aCours.ressourcePresente &&
			(this._auMoinsUnAutreCoursEnteteCliquable(aCours) ||
				(this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.cours.deplacerCours,
				) &&
					this._modificationCoursPossible(aCours)));
		H.push(
			'<div class="EnteteCours',
			lAvecClickEntete ? " AvecMain" : "",
			'"',
			lAvecClickEntete ? ' ie-node="getNodeEntete(' + aIndiceCours + ')"' : "",
			' tabindex="' + (lAvecClickEntete ? "0" : "-1") + '"',
			' ie-draggable="getDragFenetre"',
			!aCours.estAnnule && !lEstConseilDeClasse
				? ' style="' +
						ObjetStyle_2.GStyle.composeCouleur(
							GCouleur.getCouleurTransformationCours(
								aCours.matiere.CouleurFond,
							),
							"black",
						) +
						'"'
				: "",
			">",
		);
		if (lAfficherBlocSelection) {
			H.push(
				'<div class="CadreSelection" style="border-color:',
				(this._parametres.avecDiagnosticRessource
					? GCouleur.grille.gabarit
					: GCouleur.grille.selectionCours) + '"></div>',
			);
		}
		H.push('<div style="position:relative;">');
		if ((aCours.Statut || aEtatListeCours.avecStatut) && !lEstConseilDeClasse) {
			if (!aCours.Statut) {
				H.push('<div class="EnteteCoursStatutSansStatut">&nbsp;</div>');
			} else {
				H.push(
					'<div class="EnteteCoursStatut" style="',
					ObjetStyle_2.GStyle.composeWidth(alargeur - 6 - 8 - 2),
					ObjetStyle_2.GStyle.composeCouleurBordure(
						GCouleur.themeNeutre.sombre,
					),
					ObjetStyle_2.GStyle.composeCouleurTexte(
						TypeStatutCours_1.TypeStatutCoursUtil.getCouleur(aCours),
					),
					'" ie-ellipsis>',
					aCours.Statut,
					"</div>",
				);
			}
		}
		let lLibelleEnteteLigne2 = "";
		let lAvecLigneEntete2 = false;
		if (
			aCours.getGenre() === TypeStatutCours_1.TypeStatutCours.ConseilDeClasse
		) {
			let lNb = 0;
			let lNbObli = 0;
			aCours.ListeContenus.parcourir((D) => {
				if (
					[
						Enumere_Ressource_1.EGenreRessource.Classe,
						Enumere_Ressource_1.EGenreRessource.Salle,
					].indexOf(D.getGenre()) < 0
				) {
					lNb += 1;
					if (D.obli) {
						lNbObli += 1;
					}
				}
			});
			lLibelleEnteteLigne2 = ObjetTraduction_1.GTraductions.getValeur(
				"EDT.ParticipantsDontIndipensable_DD",
				[lNb, lNbObli],
			);
			lAvecLigneEntete2 = true;
		} else {
			if (aCours.strSite) {
				lLibelleEnteteLigne2 =
					aCours.strSite +
					(lLibelleEnteteLigne2 ? " - " + lLibelleEnteteLigne2 : "");
				lAvecLigneEntete2 = true;
			}
			if (aCours.strNbEleves) {
				lLibelleEnteteLigne2 +=
					(lLibelleEnteteLigne2 ? " - " : "") + aCours.strNbEleves;
				lAvecLigneEntete2 = true;
			}
			if (!lAvecLigneEntete2) {
				this._parametres.listeCours.parcourir((D) => {
					if (D.strNbEleves || D.strSite) {
						lAvecLigneEntete2 = true;
						lLibelleEnteteLigne2 = "&nbsp;";
						return false;
					}
				});
			}
		}
		const HImagesLigne = [];
		if (aCours.estGAEV) {
			let lClasseIconeGAEV;
			let lTitle;
			if (aCours.estGAEVMixte) {
				lClasseIconeGAEV = "icon_gaev_mixte";
				lTitle = ObjetTraduction_1.GTraductions.getValeur(
					"EDT.ElevesGAEVMixteChangent",
				);
			} else {
				lClasseIconeGAEV = "icon_groupes_accompagnement_personnalise";
				lTitle = ObjetTraduction_1.GTraductions.getValeur(
					"EDT.ElevesGAEVChangent",
				);
			}
			HImagesLigne.push(
				'<div style="margin-left:3px; font-size: 1.6rem;" title="',
				lTitle,
				'">',
				'<i class="',
				lClasseIconeGAEV,
				'"></i>',
				"</div>",
			);
		}
		if (aCours.estCoEnseignement) {
			HImagesLigne.push(
				'<div class="m-left-l" title="',
				ObjetTraduction_1.GTraductions.getValeur("EDT.HintImageCoEnseignement"),
				'">',
				'<i class="icon_co_enseignement i-medium" aria-hidden="true"></i>',
				"</div>",
			);
		}
		if (aCours.strPeriodes) {
			H.push(
				'<div class="EnteteCoursPeriode" ie-ellipsis style="',
				ObjetStyle_2.GStyle.composeWidth(alargeur - 6),
				'">',
				aCours.strPeriodes,
				"</div>",
			);
		}
		H.push('<div class="EnteteCoursLibelle">');
		if (aCours.verrouDeplacement) {
			H.push(
				'<div class="VerrouBleu">',
				'<i class="icon_lock" ',
				ObjetHtml_1.GHtml.composeAttr(
					"title",
					ObjetTraduction_1.GTraductions.getValeur("EDT.CoursVerrouille"),
				),
				' aria-hidden="true" ></i>',
				"</div>",
			);
		}
		if (
			aCours.libelleCours &&
			aCours.libelleCours.abbr &&
			aCours.libelleCours.couleur
		) {
			const lColor = GCouleur.getCouleurCorrespondance(
				aCours.libelleCours.couleur,
			);
			H.push(
				(0, tag_1.tag)(
					"span",
					{
						class: "libelle-cours-icone",
						style: [
							tag_1.tag.styleToStr(
								"--color-background-edt-libellecours",
								aCours.libelleCours.couleur,
							),
							tag_1.tag.styleToStr("--color-text-edt-libellecours", lColor),
						],
						title: aCours.libelleCours.getLibelle(),
					},
					aCours.libelleCours.abbr,
				),
			);
		}
		H.push(this._getTitre(aCours));
		if (!lAvecLigneEntete2) {
			H.push(HImagesLigne.join(""));
		}
		H.push("</div>");
		if (lAvecLigneEntete2) {
			H.push(
				IE.jsx.str(
					"div",
					{
						class: "EnteteCoursLibelle",
						style: ObjetStyle_2.GStyle.composeWidth(alargeur - 8),
					},
					lLibelleEnteteLigne2,
					HImagesLigne.join(""),
				),
			);
		}
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
	_modificationCoursPossible(aCours) {
		return (
			!this._parametres.nonEditable &&
			!!this._parametres.avecModificationCoursPossible &&
			this._parametres.avecModificationCoursPossible(aCours)
		);
	}
	_autoriserModificationCours(aCours) {
		return (
			aCours && aCours.modifiable && this._modificationCoursPossible(aCours)
		);
	}
	_editionMemoPossible(aCours) {
		return (
			!this._parametres.nonEditable &&
			!!this._parametres.avecModificationMemoPossible &&
			this._parametres.avecModificationMemoPossible(aCours)
		);
	}
	_estEspaceAvecSaisieLiensVisio() {
		return [
			Enumere_Espace_1.EGenreEspace.Professeur,
			Enumere_Espace_1.EGenreEspace.Etablissement,
		].includes(GEtatUtilisateur.GenreEspace);
	}
	avecDroitModificationSalle(aCours) {
		return (
			this._modificationCoursPossible(aCours) &&
			aCours.ressourcesModifiables &&
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.modifierSalles,
			)
		);
	}
	_modificationSallePossible(aCours) {
		return (
			this._modificationCoursPossible(aCours) &&
			(this.avecDroitModificationSalle(aCours) ||
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.cours.estGestionnaireSalle,
				))
		);
	}
	_getListeContenusDeGenre(aCours, aGenre) {
		return aCours.ListeContenus.getListeElements((D) => {
			return D.getGenre() === aGenre;
		});
	}
	_initInterfaceSelectionRessources(aIndice, aCours) {
		const lAutoriserModificationCours =
				this._autoriserModificationCours(aCours) &&
				aCours.ressourcesModifiables,
			lAvecModificationSalle = this._modificationSallePossible(aCours),
			lAvecModificationClasse =
				lAutoriserModificationCours &&
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.cours.modifierClasses,
				),
			lAvecModificationProf =
				lAutoriserModificationCours &&
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.cours.modifierProfesseurs,
				),
			lAvecDroitModificationMateriel =
				lAutoriserModificationCours &&
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.cours.modifierMateriels,
				),
			lAvecModificationMateriel =
				this._autoriserModificationCours(aCours) &&
				(lAvecDroitModificationMateriel ||
					this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.cours.estGestionnaireMateriel,
					)),
			lAvecModificationMatiere =
				lAutoriserModificationCours &&
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.cours.modifierMatieres,
				),
			lEstCoursSelectionne = this._estCoursSelectionne(aCours);
		let lCoursDiagnostic = null,
			lDiagnosticRessource = null;
		let lListe;
		if (
			this._parametres.avecDiagnosticRessource &&
			this._parametres.listeCoursDiagnostic &&
			lEstCoursSelectionne
		) {
			lCoursDiagnostic =
				this._parametres.listeCoursDiagnostic.getElementParNumero(
					aCours.getNumero(),
				);
			lDiagnosticRessource =
				lCoursDiagnostic && lCoursDiagnostic.diagnosticRessource
					? lCoursDiagnostic.diagnosticRessource
					: null;
		}
		const lParametres = {
			nonEditable: this._parametres.nonEditable,
			largeur: this._getLargeurContenu(aCours),
			ordreRessources: [
				Enumere_Ressource_1.EGenreRessource.Matiere,
				Enumere_Ressource_1.EGenreRessource.LibelleCours,
				Enumere_Ressource_1.EGenreRessource.Enseignant,
				Enumere_Ressource_1.EGenreRessource.Personnel,
				Enumere_Ressource_1.EGenreRessource.Groupe,
				Enumere_Ressource_1.EGenreRessource.Classe,
				Enumere_Ressource_1.EGenreRessource.PartieDeClasse,
				Enumere_Ressource_1.EGenreRessource.Eleve,
				Enumere_Ressource_1.EGenreRessource.Salle,
				Enumere_Ressource_1.EGenreRessource.Materiel,
			],
			ressources: {},
			avecDiagnostic:
				this._parametres.avecDiagnosticRessource && lEstCoursSelectionne,
			diagnostic: lDiagnosticRessource,
			diagnosticPlace: this._parametres.diagnosticPlace,
			callbackAjoutRessource:
				lAvecModificationSalle ||
				lAvecModificationClasse ||
				lAvecModificationProf ||
				lAvecModificationMateriel ||
				lAvecModificationMatiere
					? this._surModificationRessourceCours.bind(this, aCours)
					: null,
			callbackSuppressionRessource:
				lAvecModificationSalle ||
				lAvecModificationClasse ||
				lAvecModificationProf ||
				lAvecModificationMateriel
					? this._surSuppressionRessourceCours.bind(this, aCours)
					: null,
		};
		const lListeMatieres = new ObjetListeElements_1.ObjetListeElements();
		lListeMatieres.addElement(aCours.matiere);
		const lTailleCarreCouleur = 10;
		lParametres.ressources[Enumere_Ressource_1.EGenreRessource.Matiere] = {
			libelle: ObjetTraduction_1.GTraductions.getValeur("Matiere"),
			liste: lListeMatieres,
			htmlPastilleEntete: function (aRessource) {
				return (
					'<div style="' +
					ObjetStyle_2.GStyle.composeCouleurFond(
						aRessource.CouleurFond || aRessource.couleur,
					) +
					ObjetStyle_2.GStyle.composeWidth(lTailleCarreCouleur) +
					ObjetStyle_2.GStyle.composeHeight(lTailleCarreCouleur) +
					"margin-right:3px" +
					'"></div>'
				);
			},
			avecAjout: false,
			avecEdition: !!lAvecModificationMatiere,
			avecSuppression: false,
		};
		if (this._parametres.avecLibelleCours) {
			const lListeLibelleCours = new ObjetListeElements_1.ObjetListeElements();
			if (aCours.libelleCours) {
				lListeLibelleCours.addElement(aCours.libelleCours);
			}
			lParametres.ressources[Enumere_Ressource_1.EGenreRessource.LibelleCours] =
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.Activite",
					),
					liste: lListeLibelleCours,
					avecAjout: true,
					avecAjoutSeulementSiVide: true,
					avecEdition: true,
				};
		}
		lListe = this._getListeContenusDeGenre(
			aCours,
			Enumere_Ressource_1.EGenreRessource.Enseignant,
		);
		if (
			lAvecModificationProf &&
			[Enumere_Espace_1.EGenreEspace.Professeur].includes(
				GEtatUtilisateur.GenreEspace,
			)
		) {
			const lProfesseurCourant = lListe.getElementParNumero(
				GEtatUtilisateur.getMembre().getNumero(),
			);
			if (lProfesseurCourant) {
				lProfesseurCourant.nonEditable = true;
			}
		}
		lParametres.ressources[Enumere_Ressource_1.EGenreRessource.Enseignant] = {
			libelle: ObjetTraduction_1.GTraductions.getValeur("Professeurs"),
			liste: lListe,
			avecAjout: !!lAvecModificationProf,
			avecEdition: !!lAvecModificationProf,
		};
		lParametres.ressources[Enumere_Ressource_1.EGenreRessource.Groupe] = {
			libelle: ObjetTraduction_1.GTraductions.getValeur("Groupes"),
			liste: this._getListeContenusDeGenre(
				aCours,
				Enumere_Ressource_1.EGenreRessource.Groupe,
			),
			avecAjout: false,
			avecEdition: false,
		};
		lParametres.ressources[Enumere_Ressource_1.EGenreRessource.Classe] = {
			libelle: ObjetTraduction_1.GTraductions.getValeur("Classes"),
			liste: this._getListeContenusDeGenre(
				aCours,
				Enumere_Ressource_1.EGenreRessource.Classe,
			),
			avecAjout: !!lAvecModificationClasse,
			avecEdition: !!lAvecModificationClasse,
		};
		if (
			!this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.masquerPartiesDeClasse,
			)
		) {
			lParametres.ressources[
				Enumere_Ressource_1.EGenreRessource.PartieDeClasse
			] = {
				libelle: ObjetTraduction_1.GTraductions.getValeur("Parties"),
				liste: this._getListeContenusDeGenre(
					aCours,
					Enumere_Ressource_1.EGenreRessource.PartieDeClasse,
				),
				avecAjout: false,
				avecEdition: false,
			};
		}
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.afficherElevesDetachesDansCours,
			)
		) {
			lParametres.ressources[Enumere_Ressource_1.EGenreRessource.Eleve] = {
				libelle: ObjetTraduction_1.GTraductions.getValeur("EDT.ElevesDetaches"),
				liste: this._getListeContenusDeGenre(
					aCours,
					Enumere_Ressource_1.EGenreRessource.Eleve,
				),
				avecAjout: false,
				avecEdition: false,
			};
		}
		lListe = this._getListeContenusDeGenre(
			aCours,
			Enumere_Ressource_1.EGenreRessource.Salle,
		);
		if (
			lAvecModificationSalle &&
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.estGestionnaireSalle,
			) &&
			!this.avecDroitModificationSalle(aCours)
		) {
			lListe.parcourir((aSalle) => {
				if (!aSalle.gestionnaire) {
					aSalle.nonEditable = true;
				}
			});
		}
		lParametres.ressources[Enumere_Ressource_1.EGenreRessource.Salle] = {
			libelle: ObjetTraduction_1.GTraductions.getValeur("Salles"),
			liste: lListe,
			avecAjout: !!lAvecModificationSalle,
			avecEdition: !!lAvecModificationSalle,
		};
		lParametres.ressources[Enumere_Ressource_1.EGenreRessource.Personnel] = {
			libelle: ObjetTraduction_1.GTraductions.getValeur("Personnels"),
			liste: this._getListeContenusDeGenre(
				aCours,
				Enumere_Ressource_1.EGenreRessource.Personnel,
			),
			avecAjout: false,
			avecEdition: false,
		};
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.avecMateriel,
			)
		) {
			lListe = this._getListeContenusDeGenre(
				aCours,
				Enumere_Ressource_1.EGenreRessource.Materiel,
			);
			if (
				lAvecModificationMateriel &&
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.cours.estGestionnaireMateriel,
				) &&
				!lAvecDroitModificationMateriel
			) {
				lListe.parcourir((aMateriel) => {
					if (!aMateriel.gestionnaire) {
						aMateriel.nonEditable = true;
					}
				});
			}
			lParametres.ressources[Enumere_Ressource_1.EGenreRessource.Materiel] = {
				libelle: ObjetTraduction_1.GTraductions.getValeur("Materiels"),
				liste: lListe,
				avecAjout: !!lAvecModificationMateriel,
				avecEdition: !!lAvecModificationMateriel,
			};
		}
		this.selec[aIndice].setDonneesSelectionRessourceCours(lParametres);
	}
	_initInterfaceSelectionRessourcesConseil(aIndice, aCours) {
		const lParametres = {
			nonEditable: true,
			largeur: this._getLargeurContenu(aCours),
			ordreRessources: [
				Enumere_Ressource_1.EGenreRessource.Matiere,
				Enumere_Ressource_1.EGenreRessource.PartieDeClasse,
				Enumere_Ressource_1.EGenreRessource.Enseignant,
				Enumere_Ressource_1.EGenreRessource.Classe,
				Enumere_Ressource_1.EGenreRessource.Eleve,
				Enumere_Ressource_1.EGenreRessource.Responsable,
				Enumere_Ressource_1.EGenreRessource.Personnel,
				Enumere_Ressource_1.EGenreRessource.Salle,
			],
			ressources: {},
			avecDiagnostic: false,
		};
		lParametres.ordreRessources.forEach((aGenreRessource) => {
			let lLibelle = "";
			switch (aGenreRessource) {
				case Enumere_Ressource_1.EGenreRessource.Matiere:
					lLibelle = ObjetTraduction_1.GTraductions.getValeur(
						"EDT.PresidentConseil",
					);
					break;
				case Enumere_Ressource_1.EGenreRessource.PartieDeClasse:
					lLibelle = ObjetTraduction_1.GTraductions.getValeur(
						"EDT.ProfPrincipalConseil",
					);
					break;
				case Enumere_Ressource_1.EGenreRessource.Enseignant:
					lLibelle = ObjetTraduction_1.GTraductions.getValeur("Professeurs");
					break;
				case Enumere_Ressource_1.EGenreRessource.Classe:
					lLibelle = ObjetTraduction_1.GTraductions.getValeur("Classes");
					break;
				case Enumere_Ressource_1.EGenreRessource.Eleve:
					lLibelle =
						ObjetTraduction_1.GTraductions.getValeur("EDT.ElevesConseil");
					break;
				case Enumere_Ressource_1.EGenreRessource.Responsable:
					lLibelle = ObjetTraduction_1.GTraductions.getValeur(
						"EDT.ResponsablesConseil",
					);
					break;
				case Enumere_Ressource_1.EGenreRessource.Personnel:
					lLibelle = ObjetTraduction_1.GTraductions.getValeur(
						"EDT.PersonnelsConseil",
					);
					break;
				case Enumere_Ressource_1.EGenreRessource.Salle:
					lLibelle = ObjetTraduction_1.GTraductions.getValeur("Salles");
					break;
				default:
			}
			lParametres.ressources[aGenreRessource] = {
				libelle: lLibelle,
				liste: this._getListeContenusDeGenre(aCours, aGenreRessource),
				htmlPastilleEntete: function (aRessource) {
					if (aRessource.obli) {
						return (
							'<div class="Image_PointBleuEnRelief" title="' +
							ObjetTraduction_1.GTraductions.getValeur(
								"EDT.ParticipantIndispensable",
							) +
							'"></div>'
						);
					}
					return "";
				},
			};
		});
		this.selec[aIndice].setDonneesSelectionRessourceCours(lParametres);
	}
	_estCoursSelectionne(aCours) {
		return (
			this._parametres.coursSelectionne &&
			this._parametres.coursSelectionne.getNumero() === aCours.getNumero()
		);
	}
	_getLargeurContenu(aCours) {
		return aCours &&
			aCours.getGenre() === TypeStatutCours_1.TypeStatutCours.ConseilDeClasse
			? this._options.largeurContenuConseil
			: this._parametres.avecDiagnosticRessource &&
					this._estCoursSelectionne(aCours)
				? this._options.largeurContenuAvecDiagnostic
				: this._options.largeurContenu;
	}
	_surModificationRessourceCours(aCours, aGenre, aRessource) {
		if (aRessource && aRessource.nonEditable) {
			return;
		}
		let lRessourceRemplacee = null;
		if (aRessource) {
			lRessourceRemplacee = MethodesObjet_1.MethodesObjet.dupliquer(aRessource);
			lRessourceRemplacee.Genre = aGenre;
		}
		if (this._parametres.callbackModificationRessource) {
			this._parametres.callbackModificationRessource({
				cours: aCours,
				numeroSemaine: aCours.numeroSemaine,
				genreRessource: aGenre,
				ressourceRemplacee: lRessourceRemplacee,
			});
		}
	}
	_surSuppressionRessourceCours(aCours, aGenre, aIndice, aRessource) {
		let lRessourceRemplacee;
		if (aGenre === Enumere_Ressource_1.EGenreRessource.LibelleCours) {
			lRessourceRemplacee = aCours.libelleCours;
		} else {
			lRessourceRemplacee = aCours.ListeContenus.getElementParNumero(
				aRessource.getNumero(),
			);
		}
		if (this._parametres.callbackSuppressionRessource && lRessourceRemplacee) {
			lRessourceRemplacee =
				MethodesObjet_1.MethodesObjet.dupliquer(lRessourceRemplacee);
			lRessourceRemplacee.Genre = aGenre;
			this._parametres.callbackSuppressionRessource({
				cours: aCours,
				numeroSemaine: aCours.numeroSemaine,
				genreRessource: aGenre,
				listeRessources: new ObjetListeElements_1.ObjetListeElements(),
				ressourceRemplacee: lRessourceRemplacee,
			});
		}
	}
	_getTitre(aCours) {
		const lEstCoursSelectionne = this._estCoursSelectionne(aCours);
		const lPlace =
			this._parametres.positionCours && lEstCoursSelectionne
				? this._parametres.positionCours.place
				: aCours.place;
		const lDuree =
			this._parametres.positionCours && lEstCoursSelectionne
				? this._parametres.positionCours.duree
				: aCours.duree;
		let lNumeroSemaine = 1;
		let lEstVraiDateCours = false;
		if (
			!this._parametres.estEDTAnnuel &&
			this._parametres.positionCours &&
			lEstCoursSelectionne
		) {
			lNumeroSemaine = this._parametres.positionCours.numeroSemaine;
			lEstVraiDateCours = true;
		} else if (!this._parametres.estEDTAnnuel && aCours.numeroSemaine) {
			lNumeroSemaine = aCours.numeroSemaine;
			lEstVraiDateCours = true;
		}
		const lDateDebut = ObjetDate_1.GDate.placeEnDate(lNumeroSemaine, lPlace);
		return ObjetChaine_1.GChaine.format("%s - %s %s %s", [
			ObjetDate_1.GDate.formatDureeEnMillisecondes(
				ObjetDate_1.GDate.nombrePlacesEnMillisecondes(lDuree),
				"%xh%sh%mm",
			),
			ObjetDate_1.GDate.formatDate(
				lDateDebut,
				lEstVraiDateCours ? "%JJJJ %JJ/%MM" : "%JJJJ",
			),
			ObjetTraduction_1.GTraductions.getValeur("A"),
			ObjetDate_1.GDate.formatDate(lDateDebut, "%hh%sh%mm"),
		]);
	}
}
exports.FicheCours = FicheCours;
