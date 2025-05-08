const { GChaine } = require("ObjetChaine.js");
const { GStyle } = require("ObjetStyle.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
	ObjetFenetre_OrdonnerElementsProgramme,
} = require("ObjetFenetre_OrdonnerElementsProgramme.js");
const { Identite } = require("ObjetIdentite.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	ObjetFenetre_ElementsProgramme,
} = require("ObjetFenetre_ElementsProgramme.js");
const { TypeGenreAppreciation } = require("TypeGenreAppreciation.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
Requetes.inscrire(
	"AffectationAutomatiqueElementsProgrammes",
	ObjetRequeteSaisie,
);
class ObjetPiedPageAppreciationsBulletin_Professeur extends Identite {
	constructor(...aParams) {
		super(...aParams);
		this.param = { validationAuto: false };
		this.donnees = {
			heightContenu: 70,
			palierElementTravailleSelectionne: null,
		};
		this.moteur = new ObjetMoteurReleveBulletin();
	}
	setParametres(aParam) {
		$.extend(this.param, aParam);
	}
	setDonnees(aDonnees) {
		$.extend(this.donnees, aDonnees);
		this.afficher();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			btnEditionElements: {
				event: function () {
					ObjetMenuContextuel.afficher({
						pere: this,
						initCommandes: function (aInstanceMenu) {
							if (_avecMenuAffectationAutomatiqueElements()) {
								aInstanceMenu.add(
									GTraductions.getValeur(
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
												"<div>",
												GTraductions.getValeur(
													"BulletinEtReleve.MessageAffectationAutoElmProg",
												),
												"</div>",
											);
											lMessageConfirmation.push(
												'<div class="GrandEspaceHaut">',
												GTraductions.getValeur(
													"BulletinEtReleve.ConfirmationAffectationAutoElmProg",
												),
												"</div>",
											);
											const lNbServicesMemeProfMemeMatiere = !!aInstance.donnees
												.pied.servicesMemeProfMemeMatiere
												? aInstance.donnees.pied.servicesMemeProfMemeMatiere.count()
												: 0;
											if (lNbServicesMemeProfMemeMatiere > 0) {
												const lStrMatiere =
													aInstance.donnees.pied.strMatiere || "";
												lMessageConfirmation.push(
													'<div class="GrandEspaceHaut">',
													'<ie-checkbox class="GrandEspaceGauche" ie-model="cbInclureServicesMemeProfMemeMatiere">',
													GTraductions.getValeur(
														"BulletinEtReleve.InclureTousMesServicesDeMatiere",
														[lNbServicesMemeProfMemeMatiere, lStrMatiere],
													),
													"</ie-checkbox>",
													"</div>",
												);
											}
											let lInclureServicesMemeProfMemeMatiere = false;
											GApplication.getMessage().afficher({
												type: EGenreBoiteMessage.Confirmation,
												message: lMessageConfirmation.join(""),
												controleur: {
													cbInclureServicesMemeProfMemeMatiere: {
														getValue: function () {
															return lInclureServicesMemeProfMemeMatiere;
														},
														setValue: function (aValue) {
															lInclureServicesMemeProfMemeMatiere = aValue;
														},
													},
												},
												callback: function (aGenreAction) {
													if (aGenreAction === EGenreAction.Valider) {
														const lParamsSaisie = {
															service: aInstance.donnees.service,
															periode: aInstance.donnees.periode,
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
														Requetes(
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
																			new ObjetListeElements();
																	}
																	_affecterElementsProgramme.call(
																		aInstance,
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
								GTraductions.getValeur(
									"BulletinEtReleve.MenuAffectationManuelleElmProg",
								),
								true,
								() => {
									_ouvrirFenetreElementsProgramme.call(aInstance);
								},
							);
							aInstanceMenu.add(
								GTraductions.getValeur(
									"BulletinEtReleve.MenuSuppressionElmProg",
								),
								true,
								() => {
									const lListeVide = new ObjetListeElements();
									lListeVide.avecSaisie = true;
									_affecterElementsProgramme.call(aInstance, true, lListeVide);
									aInstance.$refreshSelf();
								},
							);
						},
					});
				},
			},
			btnOrdonnerElements: {
				event: function () {
					_ouvrirFenetreOrdonnerElementsProgramme.call(aInstance);
				},
				getTitle: function () {
					return GTraductions.getValeur(
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
			getNodeElementsProg: function () {
				const lInstance = aInstance;
				if (lInstance.donnees.pied.elementsEditable) {
					$(this.node).on("click", () => {
						_ouvrirFenetreElementsProgramme.call(lInstance);
					});
				}
			},
			getContenuElements: function () {
				return _composeContenusElements.call(aInstance, false);
			},
			btnParamApp: {
				event: function () {
					_ouvrirFenetreParamAppreciation.call(this);
				}.bind(aInstance),
				getTitle: function () {
					return this.donnees.appreciation
						? GChaine.enleverEntites(this.donnees.appreciation.strHintParamApp)
						: "";
				}.bind(aInstance),
				getDisabled: function () {
					return this.donnees.appreciation
						? !this.donnees.appreciation.estParamAppActif
						: true;
				}.bind(aInstance),
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
						aInstance.donnees.appreciation.setEtat(EGenreEtat.Modification);
					} else {
						aInstance.setEtatSaisie(true);
					}
				},
				node: function (ACloture) {
					if (ACloture) {
						$(this.node).on({
							focusin: function () {
								GApplication.getMessage().afficher({
									titre: GTraductions.getValeur("SaisieImpossible"),
									message: GTraductions.getValeur("PeriodeCloturee"),
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
		return _compose.call(this, false);
	}
	composeImpression(aFormat) {
		return _compose.call(this, true, aFormat);
	}
}
function _composeContenusElements(aPourImpression) {
	const H = [],
		lDonnees = this.donnees;
	if (
		!lDonnees.pied.listeElementsProgramme &&
		!lDonnees.pied.listeElementsProgrammeRatt
	) {
		return "";
	}
	const lListe = new ObjetListeElements();
	if (lDonnees.pied.listeElementsProgramme) {
		lDonnees.pied.listeElementsProgramme.trier();
		lListe.add(lDonnees.pied.listeElementsProgramme);
	}
	if (lDonnees.pied.listeElementsProgrammeRatt) {
		lDonnees.pied.listeElementsProgrammeRatt.trier();
		lListe.add(lDonnees.pied.listeElementsProgrammeRatt);
	}
	H.push(
		!aPourImpression
			? '<div ie-scrollv style="' +
					GStyle.composeHeight(lDonnees.heightContenu) +
					'">'
			: "<div>",
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
function _avecMenuAffectationAutomatiqueElements() {
	return !GEtatUtilisateur.pourPrimaire();
}
function lesElementsProgrammeSontEditables() {
	let lEditable = !!this.donnees.pied.elementsEditable;
	if (lEditable && !!this.donnees.appreciation) {
		lEditable = !this.donnees.appreciation.cloture;
	}
	return lEditable;
}
function _affecterElementsProgramme(
	aValider,
	aListeElementsProgramme,
	aPalierActif,
) {
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
function _ouvrirFenetreElementsProgramme() {
	if (this.donnees.pied.elementsCloture) {
		GApplication.getMessage().afficher({
			titre: GTraductions.getValeur("SaisieImpossible"),
			message: GTraductions.getValeur("PeriodeCloturee"),
		});
		return;
	}
	ObjetFenetre.creerInstanceFenetre(ObjetFenetre_ElementsProgramme, {
		pere: this,
		evenement: function (aValider, aDonnees) {
			_affecterElementsProgramme.call(
				this,
				aValider,
				aDonnees.listeElementsProgramme,
				aDonnees.palierActif,
			);
		}.bind(this),
	}).setDonnees({
		service: this.donnees.service,
		periode: this.donnees.periode,
		listeElementsProgramme: this.donnees.pied.listeElementsProgramme,
		palier: this.donnees.palierElementTravailleSelectionne,
	});
}
function _ouvrirFenetreOrdonnerElementsProgramme() {
	ObjetFenetre.creerInstanceFenetre(ObjetFenetre_OrdonnerElementsProgramme, {
		pere: this,
		initialiser: function (aInstance) {
			aInstance.initialiserFenetre();
		},
		evenement: function (aAvecSaisie) {
			if (aAvecSaisie) {
				if (this.param.validationAuto === true) {
					this.callback.appel(this.donnees, true);
				} else {
					this.setEtatSaisie(true);
				}
			}
		}.bind(this),
	}).setDonneesFenetreOrdonnerElementProgramme({
		service: this.donnees.service,
		periode: this.donnees.periode,
		listeElementsProgramme: this.donnees.pied.listeElementsProgramme,
	});
}
function _composeSaisieAppreciation(aPourImpression) {
	const T = [];
	const lAppreciationEditable =
		!aPourImpression && this.donnees.appreciation.editable;
	if (!lAppreciationEditable) {
		if (aPourImpression) {
			T.push("<div><div>");
		} else {
			T.push(
				'<div ie-scrollv style="' +
					GStyle.composeHeight(this.donnees.heightContenu) +
					'"><div>',
			);
		}
		T.push('<div class="PetitEspace">');
		T.push(
			'<div class="PetitEspace">',
			GChaine.replaceRCToHTML(this.donnees.appreciation.appreciation),
			"</div>",
		);
		T.push("</div>");
		T.push("</div></div>");
	} else {
		const lTailleMax = GParametres.getTailleMaxAppreciationParEnumere(
				TypeGenreAppreciation.GA_Bulletin_Professeur,
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
function _compose(aPourImpression, aFormat) {
	if (!this.donnees.pied) {
		return "";
	}
	const T = [],
		lStyleTitre = !aPourImpression
			? GStyle.composeCouleur(
					GCouleur.titre.fond,
					GCouleur.titre.texte,
					GCouleur.titre.bordure,
				)
			: GStyle.composeCouleurBordure("black"),
		lCelluleNonEditable = GStyle.composeCouleur(
			GCouleur.liste.nonEditable.fond,
			GCouleur.liste.nonEditable.texte,
			GCouleur.liste.nonEditable.bordure,
		),
		lStyleNonEditable = !aPourImpression
			? lCelluleNonEditable
			: GStyle.composeCouleurBordure("black"),
		lHeightContenu = !aPourImpression
			? GStyle.composeHeight(this.donnees.heightContenu)
			: "height:auto;",
		lMinHeightContenu = !aPourImpression
			? "min-height: " + this.donnees.heightContenu + "px;"
			: "",
		lClassTitre = !aPourImpression ? "Titre" : "",
		lAvecElementsProgrammes =
			!!this.donnees.pied.listeElementsProgramme ||
			!!this.donnees.pied.listeElementsProgrammeRatt,
		lAvecAppreciation = !!this.donnees.appreciation,
		lTailleColonneMatiere = 200;
	T.push(
		'<table class="full-size p-bottom ',
		aPourImpression ? this.donnees.taillePolice[aFormat] : "",
		'">',
	);
	T.push("<tr>");
	T.push(
		'<th style="',
		lStyleTitre,
		'" class="',
		lClassTitre,
		' AlignementMilieu Cellule">',
		'<div style="',
		GStyle.composeWidth(lTailleColonneMatiere),
		'">',
		GTraductions.getValeur("Matieres"),
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
			GChaine.toTitle(
				GTraductions.getValeur("CahierDeTexte.AideSaisieElementsPgm"),
			),
			'">',
			'<div style="position:relative">',
			lesElementsProgrammeSontEditables.call(this) && !aPourImpression
				? '<div style="position:absolute; right:0; top:0;"><ie-btnimage class="Image_OrdonnerElmtProgrammes" style="width:16px;" ie-model="btnOrdonnerElements"></ie-btnimage></div>'
				: "",
			lesElementsProgrammeSontEditables.call(this) && !aPourImpression
				? '<span class="PetitEspaceDroit AlignementMilieuVertical"><ie-btnicon aria-label="' +
						GTraductions.getValeur("BulletinEtReleve.ElementsTravailles") +
						'" class="icon_pencil" style="font-size:1.4rem;" ie-model="btnEditionElements"></ie-btnicon></span>'
				: "",
			'<span class="AlignementMilieuVertical">',
			GTraductions.getValeur("BulletinEtReleve.ElementsTravailles"),
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
			`<span id="${this.Nom}_peid_titre_appr">${GChaine.format(this.donnees.appreciation.titre, [this.donnees.strClasse, this.donnees.strMatiere])}</span>`,
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
		T.push("<li>", this.donnees.pied.profs.join(""), "</li>");
	}
	if (
		this.donnees.strMoyClasse !== null &&
		this.donnees.strMoyClasse !== undefined &&
		this.donnees.strMoyClasse !== ""
	) {
		T.push(
			"<li>",
			GTraductions.getValeur("BulletinEtReleve.MoyClasse", [
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
			GTraductions.getValeur("BulletinEtReleve.MoyLaPlusBasse", [
				this.donnees.strMoyInf,
			]),
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
			GTraductions.getValeur("BulletinEtReleve.MoyLaPlusHaute", [
				this.donnees.strMoySup,
			]),
			"</li>",
		);
	}
	T.push("</ul></div>", "</td>");
	if (lAvecElementsProgrammes) {
		if (!aPourImpression) {
			const lEstEditable = lesElementsProgrammeSontEditables.call(this);
			let lClass = "";
			if (lEstEditable) {
				lClass = "AvecMain";
			} else if (!!lAvecAppreciation) {
				lClass = "AvecInterdiction";
			}
			T.push(
				'<td style="',
				lEstEditable
					? GStyle.composeCouleur(
							GCouleur.liste.editable.fond,
							GCouleur.liste.editable.texte,
							GCouleur.liste.editable.bordure,
						)
					: lCelluleNonEditable,
				'"',
				' ie-node="getNodeElementsProg" ie-html="getContenuElements"',
				lClass ? ' class="p-all ' + lClass + '"' : "",
				"></td>",
			);
		} else {
			T.push(
				'<td style="',
				lStyleNonEditable,
				'" class="AlignementHaut p-all">',
				_composeContenusElements.call(this, true),
				"</td>",
			);
		}
	}
	if (lAvecAppreciation) {
		T.push(
			'<td style="',
			GStyle.composeCouleurBordure(
				aPourImpression ? "black" : GCouleur.liste.nonEditable.bordure,
			),
			GStyle.composeCouleurFond(
				!aPourImpression && !this.donnees.appreciation.editable
					? GCouleur.liste.nonEditable.fond
					: GCouleur.liste.editable.fond,
			),
			lHeightContenu,
			'" class="AlignementHaut">',
			_composeSaisieAppreciation.call(this, aPourImpression),
			"</td>",
		);
	}
	T.push("</tr>");
	T.push("</table>");
	return T.join("");
}
function _composeMsgParamAppreciation() {
	const H = [];
	H.push(
		'<div style="margin-bottom : 1.5rem;">',
		GTraductions.getValeur("BulletinEtReleve.strIntroParamAppr", [
			this.donnees.strMatiere,
			this.donnees.strClasse,
		]),
		"</div>",
	);
	H.push(
		'<ie-radio ie-model="rbParamSynchroAppr(true)" style="margin-bottom : 1.5rem;">',
		GTraductions.getValeur("BulletinEtReleve.chxSynchroParamAppr"),
		"</ie-radio>",
	);
	H.push(
		'<ie-radio ie-model="rbParamSynchroAppr(false)" style="margin-bottom : 1.5rem;">',
		GTraductions.getValeur("BulletinEtReleve.chxDeSynchroParamAppr"),
		"</ie-radio>",
	);
	return H.join("");
}
function _ouvrirFenetreParamAppreciation() {
	this.estSynchroniseCourant = this.donnees.appreciation.estSynchronisee;
	GApplication.getMessage().afficher({
		titre: GTraductions.getValeur("BulletinEtReleve.titreParamAppr"),
		message: _composeMsgParamAppreciation.call(this),
		controleur: {
			rbParamSynchroAppr: {
				getValue: function (aEstRBSynchro) {
					return aEstRBSynchro === this.estSynchroniseCourant;
				}.bind(this),
				setValue: function (aEstCasSynchro) {
					this.estSynchroniseCourant = aEstCasSynchro;
				}.bind(this),
			},
		},
		width: 500,
		listeBoutons: [
			{
				libelle: GTraductions.getValeur("Annuler"),
				theme: TypeThemeBouton.secondaire,
			},
			{
				libelle: GTraductions.getValeur("Valider"),
				theme: TypeThemeBouton.primaire,
				genreAction: EGenreAction.Valider,
			},
		],
		callback: function (aGenreAction) {
			if (aGenreAction === EGenreAction.Valider) {
				if (
					this.estSynchroniseCourant ===
					this.donnees.appreciation.estSynchronisee
				) {
					return;
				}
				if (
					this.estSynchroniseCourant === true &&
					this.donnees.appreciation.apprsIdentiques === false
				) {
					_afficherMsgConfirmModifParam.call(this);
				} else {
					_modifierParamAppr.call(this);
				}
			}
		}.bind(this),
	});
}
function _afficherMsgConfirmModifParam() {
	GApplication.getMessage().afficher({
		type: EGenreBoiteMessage.Confirmation,
		message: GTraductions.getValeur("BulletinEtReleve.msgConfirmParamAppr", [
			this.donnees.strGpeSeul,
		]),
		callback: function (aGenreAction) {
			if (aGenreAction === EGenreAction.Valider) {
				_modifierParamAppr.call(this);
			}
		}.bind(this),
	});
}
function _modifierParamAppr() {
	this.moteur.saisieParamSynchroAppClasse({
		paramRequete: {
			periode: this.donnees.periode,
			service: this.donnees.service,
			paramSynchroAppClasse: this.estSynchroniseCourant,
		},
		clbckSucces: function (aParamSucces) {
			this.callback.appel(aParamSucces, false, true);
		}.bind(this),
	});
}
module.exports = { ObjetPiedPageAppreciationsBulletin_Professeur };
