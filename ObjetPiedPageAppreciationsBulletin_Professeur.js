exports.ObjetPiedPageAppreciationsBulletin_Professeur = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_OrdonnerElementsProgramme_1 = require("ObjetFenetre_OrdonnerElementsProgramme");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_ElementsProgramme_1 = require("ObjetFenetre_ElementsProgramme");
const TypeGenreAppreciation_1 = require("TypeGenreAppreciation");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const AccessApp_1 = require("AccessApp");
CollectionRequetes_1.Requetes.inscrire(
	"AffectationAutomatiqueElementsProgrammes",
	ObjetRequeteJSON_1.ObjetRequeteSaisie,
);
class ObjetPiedPageAppreciationsBulletin_Professeur extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
		this.parametresSco = lApplicationSco.getObjetParametres();
		this.param = { validationAuto: false };
		this.donnees = {
			heightContenu: 70,
			palierElementTravailleSelectionne: null,
			pied: null,
			periode: null,
			service: null,
			appreciation: null,
			appreciation_sauvegarde: null,
			strMatiere: "",
			strClasse: "",
			strGpeSeul: "",
			strMoySup: "",
			strMoyInf: "",
			strMoyClasse: "",
		};
		this.moteur = new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
	}
	setParametres(aParam) {
		$.extend(this.param, aParam);
	}
	setDonnees(aDonnees) {
		$.extend(this.donnees, aDonnees);
		this.afficher();
	}
	getDonnees() {
		return this.donnees;
	}
	jsxNodeElementsProgramme(aNode) {
		if (this.donnees.pied.elementsEditable) {
			$(aNode).eventValidation(() => {
				this._ouvrirFenetreElementsProgramme();
			});
		}
	}
	jsxGetHtmlContenuElements() {
		return this._composeContenusElements();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			btnEditionElements: {
				event: function () {
					ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
						pere: this,
						initCommandes: function (aInstanceMenu) {
							if (aInstance._avecMenuAffectationAutomatiqueElements()) {
								aInstanceMenu.add(
									ObjetTraduction_1.GTraductions.getValeur(
										"BulletinEtReleve.MenuAffectationAutoElmProg",
									),
									true,
									() => {
										if (!!aInstance.donnees.pied.elementsMessCalculAutoImposs) {
											GApplication.getMessage().afficher({
												message:
													aInstance.donnees.pied.elementsMessCalculAutoImposs,
											});
										} else {
											const lMessageConfirmation = [];
											lMessageConfirmation.push(
												IE.jsx.str(
													IE.jsx.fragment,
													null,
													IE.jsx.str(
														"div",
														null,
														ObjetTraduction_1.GTraductions.getValeur(
															"BulletinEtReleve.MessageAffectationAutoElmProg",
														),
													),
													IE.jsx.str(
														"div",
														{ class: "GrandEspaceHaut" },
														ObjetTraduction_1.GTraductions.getValeur(
															"BulletinEtReleve.ConfirmationAffectationAutoElmProg",
														),
													),
												),
											);
											let lInclureServicesMemeProfMemeMatiere = false;
											const lNbServicesMemeProfMemeMatiere = !!aInstance.donnees
												.pied.servicesMemeProfMemeMatiere
												? aInstance.donnees.pied.servicesMemeProfMemeMatiere.count()
												: 0;
											if (lNbServicesMemeProfMemeMatiere > 0) {
												const lJsxModelCheckboxInclureServicesMemeProfMemeMatiere =
													() => {
														return {
															getValue: () => {
																return lInclureServicesMemeProfMemeMatiere;
															},
															setValue: (aValue) => {
																lInclureServicesMemeProfMemeMatiere = aValue;
															},
														};
													};
												const lStrMatiere =
													aInstance.donnees.pied.strMatiere || "";
												lMessageConfirmation.push(
													IE.jsx.str(
														"div",
														{ class: "GrandEspaceHaut" },
														IE.jsx.str(
															"ie-checkbox",
															{
																class: "GrandEspaceGauche",
																"ie-model":
																	lJsxModelCheckboxInclureServicesMemeProfMemeMatiere,
															},
															ObjetTraduction_1.GTraductions.getValeur(
																"BulletinEtReleve.InclureTousMesServicesDeMatiere",
																[lNbServicesMemeProfMemeMatiere, lStrMatiere],
															),
														),
													),
												);
											}
											GApplication.getMessage().afficher({
												type: Enumere_BoiteMessage_1.EGenreBoiteMessage
													.Confirmation,
												message: lMessageConfirmation.join(""),
												callback: function (aGenreAction) {
													if (
														aGenreAction ===
														Enumere_Action_1.EGenreAction.Valider
													) {
														const lParamsSaisie = {
															service: aInstance.donnees.service,
															periode: aInstance.donnees.periode,
															listeServicesPourAffectation: null,
														};
														if (
															!!lInclureServicesMemeProfMemeMatiere &&
															!!aInstance.donnees.pied
																.servicesMemeProfMemeMatiere
														) {
															aInstance.donnees.pied.servicesMemeProfMemeMatiere.setSerialisateurJSON(
																{ ignorerEtatsElements: true },
															);
															lParamsSaisie.listeServicesPourAffectation =
																aInstance.donnees.pied.servicesMemeProfMemeMatiere;
														}
														(0, CollectionRequetes_1.Requetes)(
															"AffectationAutomatiqueElementsProgrammes",
															this,
															(aDonnees) => {
																if (
																	!!aDonnees &&
																	!!aDonnees.JSONRapportSaisie
																) {
																	let lNouvelleListeElementsProgramme =
																		aDonnees.JSONRapportSaisie
																			.listeElementsProgramme;
																	if (!lNouvelleListeElementsProgramme) {
																		lNouvelleListeElementsProgramme =
																			new ObjetListeElements_1.ObjetListeElements();
																	}
																	aInstance._affecterElementsProgramme(
																		false,
																		lNouvelleListeElementsProgramme,
																	);
																}
															},
														).lancerRequete(lParamsSaisie);
													}
												},
											});
										}
									},
								);
							}
							aInstanceMenu.add(
								ObjetTraduction_1.GTraductions.getValeur(
									"BulletinEtReleve.MenuAffectationManuelleElmProg",
								),
								true,
								() => {
									aInstance._ouvrirFenetreElementsProgramme();
								},
							);
							aInstanceMenu.add(
								ObjetTraduction_1.GTraductions.getValeur(
									"BulletinEtReleve.MenuSuppressionElmProg",
								),
								true,
								() => {
									aInstance.donnees.pied.avecSaisieListeElementsProgramme = true;
									const lListeVide =
										new ObjetListeElements_1.ObjetListeElements();
									aInstance._affecterElementsProgramme(true, lListeVide);
									aInstance.$refreshSelf();
								},
							);
						},
					});
				},
			},
			btnOrdonnerElements: {
				event: function () {
					aInstance._ouvrirFenetreOrdonnerElementsProgramme();
				},
				getTitle: function () {
					return ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_OrdonnerElementsProgramme.HintBoutonOuvertureFenetre",
					);
				},
				getDisabled: function () {
					let result = true;
					if (
						!!aInstance.donnees.pied &&
						!!aInstance.donnees.pied.elementsEditable &&
						!!aInstance.donnees.pied.listeElementsProgramme
					) {
						result =
							aInstance.donnees.pied.listeElementsProgramme.getNbrElementsExistes() <=
							1;
					}
					return result;
				},
			},
			btnParamApp: {
				event: function () {
					aInstance._ouvrirFenetreParamAppreciation();
				},
				getTitle: function () {
					var _a;
					return (
						(_a = aInstance.donnees.appreciation) === null || _a === void 0
							? void 0
							: _a.strHintParamApp
					)
						? ObjetChaine_1.GChaine.enleverEntites(
								aInstance.donnees.appreciation.strHintParamApp,
							)
						: "";
				},
				getDisabled: function () {
					return aInstance.donnees.appreciation
						? !aInstance.donnees.appreciation.estParamAppActif
						: true;
				},
			},
			textarea: {
				getValue: function () {
					return aInstance.donnees.appreciation
						? aInstance.donnees.appreciation.appreciation
						: "";
				},
				setValue: function (ACloture, aValue) {
					if (ACloture) {
						return;
					}
					aInstance.donnees.appreciation.appreciation = aValue;
					if (aInstance.param.validationAuto === true) {
						aInstance.donnees.appreciation.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					} else {
						aInstance.setEtatSaisie(true);
					}
				},
				node: function (ACloture) {
					if (ACloture) {
						$(this.node).on({
							focusin: function () {
								GApplication.getMessage().afficher({
									titre:
										ObjetTraduction_1.GTraductions.getValeur(
											"SaisieImpossible",
										),
									message:
										ObjetTraduction_1.GTraductions.getValeur("PeriodeCloturee"),
									restaurerFocusSurFermeture: false,
								});
							},
						});
					} else if (aInstance.param.validationAuto === true) {
						$(this.node).on({
							focusout_TextareaMax: function () {
								aInstance.donnees.appreciation.setLibelle(
									aInstance.donnees.appreciation.appreciation,
								);
								aInstance.callback.appel(aInstance.donnees, false);
							},
						});
					}
				},
			},
		});
	}
	construireAffichage() {
		return this._compose();
	}
	_composeContenusElements() {
		const lDonnees = this.donnees;
		if (
			!lDonnees.pied.listeElementsProgramme &&
			!lDonnees.pied.listeElementsProgrammeRatt
		) {
			return "";
		}
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		if (lDonnees.pied.listeElementsProgramme) {
			lDonnees.pied.listeElementsProgramme.trier();
			lListe.add(lDonnees.pied.listeElementsProgramme);
		}
		if (lDonnees.pied.listeElementsProgrammeRatt) {
			lDonnees.pied.listeElementsProgrammeRatt.trier();
			lListe.add(lDonnees.pied.listeElementsProgrammeRatt);
		}
		const H = [];
		H.push(
			'<div ie-scrollv style="' +
				ObjetStyle_1.GStyle.composeHeight(lDonnees.heightContenu) +
				'">',
			"<div>",
		);
		H.push('<ul class="PetitEspace">');
		lListe.parcourir((D) => {
			if (D.existe()) {
				H.push("<li>", D.getLibelle(), "</li>");
			}
		});
		H.push("</ul>");
		H.push("</div></div>");
		return H.join("");
	}
	_avecMenuAffectationAutomatiqueElements() {
		return !this.etatUtilisateurSco.pourPrimaire();
	}
	lesElementsProgrammeSontEditables() {
		let lEditable = !!this.donnees.pied.elementsEditable;
		if (lEditable && !!this.donnees.appreciation) {
			lEditable = !this.donnees.appreciation.cloture;
		}
		return lEditable;
	}
	_affecterElementsProgramme(aValider, aListeElementsProgramme, aPalierActif) {
		this.donnees.pied.listeElementsProgramme = aListeElementsProgramme;
		this.donnees.pied.listeElementsProgramme.trier();
		this.donnees.palierElementTravailleSelectionne = aPalierActif;
		if (aValider) {
			if (this.param.validationAuto === true) {
				this.callback.appel(this.donnees, true);
			} else {
				this.setEtatSaisie(true);
			}
		}
	}
	_ouvrirFenetreElementsProgramme() {
		if (this.donnees.pied.elementsCloture) {
			GApplication.getMessage().afficher({
				titre: ObjetTraduction_1.GTraductions.getValeur("SaisieImpossible"),
				message: ObjetTraduction_1.GTraductions.getValeur("PeriodeCloturee"),
			});
			return;
		}
		const lFenetreElmtsProgramme =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_ElementsProgramme_1.ObjetFenetre_ElementsProgramme,
				{
					pere: this,
					evenement: (aValider, aDonnees) => {
						this._affecterElementsProgramme(
							aValider,
							aDonnees.listeElementsProgramme,
							aDonnees.palierActif,
						);
					},
				},
			);
		lFenetreElmtsProgramme.setDonnees({
			service: this.donnees.service,
			periode: this.donnees.periode,
			listeElementsProgramme: this.donnees.pied.listeElementsProgramme,
			palier: this.donnees.palierElementTravailleSelectionne,
		});
	}
	_ouvrirFenetreOrdonnerElementsProgramme() {
		const lFenetreOrdonnerElementsProgramme =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_OrdonnerElementsProgramme_1.ObjetFenetre_OrdonnerElementsProgramme,
				{
					pere: this,
					initialiser: function (aInstance) {
						aInstance.initialiserFenetre();
					},
					evenement: (aAvecSaisie) => {
						if (aAvecSaisie) {
							if (this.param.validationAuto === true) {
								this.callback.appel(this.donnees, true);
							} else {
								this.setEtatSaisie(true);
							}
						}
					},
				},
			);
		lFenetreOrdonnerElementsProgramme.setDonneesFenetreOrdonnerElementProgramme(
			{
				service: this.donnees.service,
				periode: this.donnees.periode,
				listeElementsProgramme: this.donnees.pied.listeElementsProgramme,
			},
		);
	}
	_composeSaisieAppreciation() {
		const T = [];
		const lAppreciationEditable = this.donnees.appreciation.editable;
		if (!lAppreciationEditable) {
			T.push(
				'<div ie-scrollv style="' +
					ObjetStyle_1.GStyle.composeHeight(this.donnees.heightContenu) +
					'"><div>',
			);
			T.push('<div class="PetitEspace">');
			T.push(
				'<div class="PetitEspace">',
				ObjetChaine_1.GChaine.replaceRCToHTML(
					this.donnees.appreciation.appreciation,
				),
				"</div>",
			);
			T.push("</div>");
			T.push("</div></div>");
		} else {
			const lTailleMax = this.parametresSco.getTailleMaxAppreciationParEnumere(
					TypeGenreAppreciation_1.TypeGenreAppreciation.GA_Bulletin_Professeur,
				),
				lSansControleTaille =
					this.donnees.appreciation.cloture || lTailleMax >= 1000000;
			T.push('<div style="position:relative;" class="full-size">');
			T.push(
				'<ie-textareamax ie-model="textarea(',
				this.donnees.appreciation.cloture,
				')"',
				lSansControleTaille ? "" : ' maxlength="' + lTailleMax + '"',
				this.donnees.appreciation.cloture ? " readonly" : "",
				' class="browser-default full-size',
				this.donnees.appreciation.cloture ? " AvecInterdiction" : "",
				'" aria-labelledby="',
				`${this.Nom}_peid_titre_appr`,
				'"></ie-textareamax>',
			);
			T.push("</div>");
		}
		return T.join("");
	}
	_compose() {
		if (!this.donnees.pied) {
			return "";
		}
		const T = [],
			lStyleTitre = ObjetStyle_1.GStyle.composeCouleur(
				GCouleur.titre.fond,
				GCouleur.titre.texte,
				GCouleur.titre.bordure,
			),
			lCelluleNonEditable = ObjetStyle_1.GStyle.composeCouleur(
				GCouleur.liste.nonEditable.fond,
				GCouleur.liste.nonEditable.texte,
				GCouleur.liste.nonEditable.bordure,
			),
			lStyleNonEditable = lCelluleNonEditable,
			lHeightContenu = ObjetStyle_1.GStyle.composeHeight(
				this.donnees.heightContenu,
			),
			lMinHeightContenu = "min-height: " + this.donnees.heightContenu + "px;",
			lClassTitre = "Titre",
			lAvecElementsProgrammes =
				!!this.donnees.pied.listeElementsProgramme ||
				!!this.donnees.pied.listeElementsProgrammeRatt,
			lAvecAppreciation = !!this.donnees.appreciation,
			lTailleColonneMatiere = 200;
		T.push('<table class="full-size p-bottom">');
		T.push(
			IE.jsx.str(
				"caption",
				{ class: "sr-only" },
				ObjetTraduction_1.GTraductions.getValeur(
					"BulletinEtReleve.PiedBulletin",
				),
			),
		);
		T.push("<tr>");
		T.push(
			'<th style="',
			lStyleTitre,
			'" class="',
			lClassTitre,
			' AlignementMilieu Cellule">',
			'<div style="',
			ObjetStyle_1.GStyle.composeWidth(lTailleColonneMatiere),
			'">',
			ObjetTraduction_1.GTraductions.getValeur("Matieres"),
			"</div>",
			"</th>",
		);
		if (lAvecElementsProgrammes) {
			T.push(
				'<th style="width:',
				this.donnees.appreciation ? 50 : 100,
				"%;",
				lStyleTitre,
				'" class="',
				lClassTitre,
				' AlignementMilieu Cellule NoWrap" title="',
				ObjetChaine_1.GChaine.toTitle(
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.AideSaisieElementsPgm",
					),
				),
				'">',
				'<div style="position:relative">',
				this.lesElementsProgrammeSontEditables()
					? IE.jsx.str(
							"div",
							{ style: "position:absolute; right:0; top:0;" },
							IE.jsx.str("ie-btnimage", {
								class: "Image_OrdonnerElmtProgrammes",
								style: "width:16px;",
								"ie-model": "btnOrdonnerElements",
								"aria-haspopup": "dialog",
							}),
						)
					: "",
				this.lesElementsProgrammeSontEditables()
					? IE.jsx.str(
							"span",
							{ class: "PetitEspaceDroit AlignementMilieuVertical" },
							IE.jsx.str("ie-btnicon", {
								"aria-label": ObjetTraduction_1.GTraductions.getValeur(
									"BulletinEtReleve.ElementsTravailles",
								),
								class: "icon_pencil",
								style: "font-size:1.4rem;",
								"ie-model": "btnEditionElements",
								"aria-haspopup": "menu",
							}),
						)
					: "",
				'<span class="AlignementMilieuVertical">',
				ObjetTraduction_1.GTraductions.getValeur(
					"BulletinEtReleve.ElementsTravailles",
				),
				"</span>",
				"</div>",
				"</th>",
			);
		}
		if (lAvecAppreciation) {
			const lAvecParam = this.donnees.appreciation.estParamAppVisible === true;
			T.push(
				'<th style="width:',
				this.donnees.pied.listeElementsProgramme ||
					this.donnees.pied.listeElementsProgrammeRatt
					? 50
					: 100,
				"%;",
				lStyleTitre,
				'" class="',
				lClassTitre,
				' AlignementMilieu Cellule">',
				`<span id="${this.Nom}_peid_titre_appr">${ObjetChaine_1.GChaine.format(this.donnees.appreciation.titre, [this.donnees.strClasse, this.donnees.strMatiere])}</span>`,
			);
			if (lAvecParam) {
				T.push(
					'<ie-btnicon class="icon_cog EspaceGauche" ie-model="btnParamApp" style="font-size:1.6rem;"></ie-btnicon>',
				);
			}
			T.push("</th>");
		}
		T.push("</tr>");
		T.push("<tr>");
		T.push(
			'<td class="AlignementHaut" style="',
			lStyleNonEditable,
			lMinHeightContenu,
			'">',
			'<div class="p-all-s full-height">',
		);
		T.push(
			'<label class="Gras m-bottom">',
			this.donnees.pied.strMatiere,
			this.donnees.pied.strSousMatiere
				? '<div class="m-top">' + this.donnees.pied.strSousMatiere + "</div>"
				: "",
			"</label>",
		);
		T.push('<ul class="flex-contain cols flex-gap-s">');
		if (this.donnees.pied && this.donnees.pied.profs) {
			this.donnees.pied.profs.sort();
			T.push("<li>", this.donnees.pied.profs.join("<br/>"), "</li>");
		}
		if (
			this.donnees.strMoyClasse !== null &&
			this.donnees.strMoyClasse !== undefined &&
			this.donnees.strMoyClasse !== ""
		) {
			T.push(
				"<li>",
				ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.MoyClasse", [
					this.donnees.strMoyClasse,
				]),
				"</li>",
			);
		}
		if (
			this.donnees.strMoyInf !== null &&
			this.donnees.strMoyInf !== undefined &&
			this.donnees.strMoyInf !== ""
		) {
			T.push(
				"<li>",
				ObjetTraduction_1.GTraductions.getValeur(
					"BulletinEtReleve.MoyLaPlusBasse",
					[this.donnees.strMoyInf],
				),
				"</li>",
			);
		}
		if (
			this.donnees.strMoySup !== null &&
			this.donnees.strMoySup !== undefined &&
			this.donnees.strMoySup !== ""
		) {
			T.push(
				"<li>",
				ObjetTraduction_1.GTraductions.getValeur(
					"BulletinEtReleve.MoyLaPlusHaute",
					[this.donnees.strMoySup],
				),
				"</li>",
			);
		}
		T.push("</ul></div>", "</td>");
		if (lAvecElementsProgrammes) {
			const lEstEditable = this.lesElementsProgrammeSontEditables();
			const lClasses = [];
			if (lEstEditable || lAvecAppreciation) {
				lClasses.push("p-all");
				if (lEstEditable) {
					lClasses.push("AvecMain");
				} else {
					lClasses.push("AvecInterdiction");
				}
			}
			T.push(
				IE.jsx.str("td", {
					style: lEstEditable
						? ObjetStyle_1.GStyle.composeCouleur(
								GCouleur.liste.editable.fond,
								GCouleur.liste.editable.texte,
								GCouleur.liste.editable.bordure,
							)
						: lCelluleNonEditable,
					class: lClasses.join(" "),
					"ie-node": this.jsxNodeElementsProgramme.bind(this),
					"ie-html": this.jsxGetHtmlContenuElements.bind(this),
				}),
			);
		}
		if (lAvecAppreciation) {
			T.push(
				'<td style="',
				ObjetStyle_1.GStyle.composeCouleurBordure(
					GCouleur.liste.nonEditable.bordure,
				),
				ObjetStyle_1.GStyle.composeCouleurFond(
					!this.donnees.appreciation.editable
						? GCouleur.liste.nonEditable.fond
						: GCouleur.liste.editable.fond,
				),
				lHeightContenu,
				'" class="AlignementHaut">',
				this._composeSaisieAppreciation(),
				"</td>",
			);
		}
		T.push("</tr>");
		T.push("</table>");
		return T.join("");
	}
	_ouvrirFenetreParamAppreciation() {
		let lEstSynchroniseCourant = this.donnees.appreciation.estSynchronisee;
		const lJsxModelRadioParamSynchroAppr = (aEstSynchro) => {
			return {
				getValue: () => {
					return aEstSynchro === lEstSynchroniseCourant;
				},
				setValue: () => {
					lEstSynchroniseCourant = aEstSynchro;
				},
				getName: () => {
					return `${this.Nom}_ParamSynchroAppr `;
				},
			};
		};
		const lMsgParamAppreciation = [];
		lMsgParamAppreciation.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ style: "margin-bottom: 1.5rem;" },
					ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.strIntroParamAppr",
						[this.donnees.strMatiere, this.donnees.strClasse],
					),
				),
				IE.jsx.str(
					"ie-radio",
					{
						"ie-model": lJsxModelRadioParamSynchroAppr.bind(this, true),
						style: "margin-bottom: 1.5rem;",
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.chxSynchroParamAppr",
					),
				),
				IE.jsx.str(
					"ie-radio",
					{
						"ie-model": lJsxModelRadioParamSynchroAppr.bind(this, false),
						style: "margin-bottom: 1.5rem;",
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.chxDeSynchroParamAppr",
					),
				),
			),
		);
		GApplication.getMessage().afficher({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"BulletinEtReleve.titreParamAppr",
			),
			message: lMsgParamAppreciation.join(""),
			width: 500,
			listeBoutons: [
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("Annuler"),
					theme: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
				},
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
					theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
					genreAction: Enumere_Action_1.EGenreAction.Valider,
				},
			],
			callback: (aGenreAction) => {
				if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
					if (
						lEstSynchroniseCourant === this.donnees.appreciation.estSynchronisee
					) {
						return;
					}
					if (
						lEstSynchroniseCourant === true &&
						this.donnees.appreciation.apprsIdentiques === false
					) {
						this._afficherMsgConfirmModifParam(lEstSynchroniseCourant);
					} else {
						this._modifierParamAppr(lEstSynchroniseCourant);
					}
				}
			},
		});
	}
	_afficherMsgConfirmModifParam(aEstSynchroniseCourant) {
		GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			message: ObjetTraduction_1.GTraductions.getValeur(
				"BulletinEtReleve.msgConfirmParamAppr",
				[this.donnees.strGpeSeul],
			),
			callback: (aGenreAction) => {
				if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
					this._modifierParamAppr(aEstSynchroniseCourant);
				}
			},
		});
	}
	_modifierParamAppr(aEstSynchroniseCourant) {
		this.moteur.saisieParamSynchroAppClasse({
			paramRequete: {
				periode: this.donnees.periode,
				service: this.donnees.service,
				paramSynchroAppClasse: aEstSynchroniseCourant,
			},
			clbckSucces: (aParamSucces) => {
				this.callback.appel(aParamSucces, false, true);
			},
		});
	}
}
exports.ObjetPiedPageAppreciationsBulletin_Professeur =
	ObjetPiedPageAppreciationsBulletin_Professeur;
