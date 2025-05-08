exports.ObjetParametrageGenerationPdf_ReleveDeNotes =
	exports.ObjetParametrageGenerationPdf_Bulletin =
	exports.ObjetParametrageGenerationPdf_BulletinReleve =
	exports.ObjetParametrageGenerationPdf_EDT =
	exports.ObjetParametrageGenerationPdf_SansPolice =
	exports.ObjetParametrageGenerationPdf =
	exports.ObjetFenetre_GenerationPdf =
		void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_Saisie_1 = require("Enumere_Saisie");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const TypeGestionRenvoisImp_1 = require("TypeGestionRenvoisImp");
const OptionsPDF_1 = require("OptionsPDF");
class ObjetFenetre_GenerationPdf extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: "",
			largeur: 200,
			modale: true,
			avecTailleSelonContenu: true,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
					theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
				},
			],
		});
	}
	composeContenu() {
		const T = [];
		T.push(
			'<div id="',
			this.getNom() + "_zonepdf",
			'" style="',
			ObjetStyle_1.GStyle.composeCouleurTexte(GCouleur.noir),
			'"></div>',
		);
		return T.join("");
	}
	afficher(aParametres) {
		if (!aParametres) {
			return;
		}
		this._parametresAffichage = aParametres;
		this.instance = this.creerInstanceFenetrePDF(
			aParametres,
			this.getNom() + "_zonepdf",
		);
		if (!this.instance) {
			return;
		}
		this.setOptionsFenetre({ titre: this.instance.getOptions().titreFenetre });
		return super.afficher();
	}
	surValidation(aGenreBouton) {
		const lParametres = {};
		this.instance.serialiserParametres(lParametres);
		this.fermer();
		delete this._parametresAffichage.PARAMETRE_FENETRE;
		this.callback.appel(aGenreBouton, this._parametresAffichage, lParametres);
	}
}
exports.ObjetFenetre_GenerationPdf = ObjetFenetre_GenerationPdf;
class ObjetParametrageGenerationPdf extends ObjetIdentite_1.Identite {
	constructor(aNom, aPere) {
		super(aNom, null, aPere, null);
		this.ecartCombo = 90;
		this._parametres = {};
		this._optionsPDF = OptionsPDF_1._OptionsPDF.defaut;
		this.options = {
			titreFenetre: ObjetChaine_1.GChaine.insecable(
				ObjetTraduction_1.GTraductions.getValeur("GenerationPDF.Titre"),
			),
			avecOrientation: true,
			avecPolice: false,
			libelleGroupePolice: ObjetTraduction_1.GTraductions.getValeur(
				"GenerationPDF.TaillePolice",
			),
			avecPolices: true,
			libelleGroupePolices: ObjetTraduction_1.GTraductions.getValeur(
				"GenerationPDF.EDT.TaillePoliceCours",
			),
		};
	}
	getOptions() {
		return this.options;
	}
	setOptionsPdf(aOptionsPDF) {
		Object.assign(this._optionsPDF, aOptionsPDF);
		return this;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			rbPortrait: {
				getValue(aPortrait) {
					return aInstance._optionsPDF.portrait === aPortrait;
				},
				setValue(aPortrait) {
					aInstance._optionsPDF.portrait = aPortrait;
				},
			},
			comboPolice: {
				init(aPoliceSouhait, aInstanceCombo) {
					aInstanceCombo.setOptionsObjetSaisie(
						$.extend(aInstance.getOptionsDefautCombo(), {
							labelWAICellule:
								(aInstance.options.avecPolice
									? aInstance.options.libelleGroupePolice
									: aInstance.options.libelleGroupePolices) +
								" " +
								(aPoliceSouhait
									? ObjetTraduction_1.GTraductions.getValeur(
											"GenerationPDF.TaillePoliceSouhaitee",
										)
									: ObjetTraduction_1.GTraductions.getValeur(
											"GenerationPDF.TaillePoliceMinAutorisee",
										)),
						}),
					);
				},
				getDonnees(aPoliceSouhait, aDonnees) {
					if (!aDonnees) {
						return aInstance.getListePolice();
					}
				},
				getIndiceSelection(aPoliceSouhait, aInstanceCombo) {
					return aInstance.getIndiceDansListe(
						aInstanceCombo.getListeElements(),
						aPoliceSouhait
							? aInstance._optionsPDF.taillePolice
							: aInstance._optionsPDF.taillePoliceMin,
					);
				},
				event(aPoliceSouhait, aParams) {
					aInstance._evenementSurComboTaillePolice(
						aPoliceSouhait,
						aParams.genreEvenement,
						aParams.element,
					);
				},
			},
		});
	}
	initialiser(aId) {
		const T = [];
		this.composePage(T);
		ObjetHtml_1.GHtml.setHtml(aId, T.join(""), { controleur: this.controleur });
		if (this.initialiserInstances) {
			this.initialiserInstances();
		}
	}
	setParametres(aParametres, aOptionsPDF) {
		$.extend(this._parametres, aParametres);
		$.extend(this._optionsPDF, aOptionsPDF);
		$.extend(aOptionsPDF, this._optionsPDF);
		this._optionsPDF = aOptionsPDF;
	}
	serialiserParametres(aParametres) {
		$.extend(aParametres, {
			portrait: this._optionsPDF.portrait,
			taillePolice: this._optionsPDF.taillePolice,
			taillePoliceMin: this._optionsPDF.taillePoliceMin,
		});
	}
	composePage(aHtml) {
		this.composePageProtected(aHtml);
	}
	composePageProtected(aHtml) {
		if (this.options.avecOrientation) {
			aHtml.push(
				this.composeGroupe(
					ObjetTraduction_1.GTraductions.getValeur("GenerationPDF.Orientation"),
					this._composeChoixOrientation(),
					true,
				),
			);
		}
		if (this.options.avecPolices) {
			aHtml.push(
				this.composeGroupe(
					this.options.libelleGroupePolices,
					this._composeChoixTaillesPolice(),
				),
			);
		}
		if (this.options.avecPolice) {
			aHtml.push(
				this.composeGroupe(
					this.options.libelleGroupePolice,
					this._composeChoixTailleUniquePolice(),
				),
			);
		}
	}
	getListePolice() {
		const lListePolice = new ObjetListeElements_1.ObjetListeElements();
		let lElement;
		for (let i = 1; i <= 20; i++) {
			lElement = new ObjetElement_1.ObjetElement("" + i);
			lElement.valeur = i;
			lListePolice.addElement(lElement);
		}
		return lListePolice;
	}
	getOptionsDefautCombo() {
		return { mode: Enumere_Saisie_1.EGenreSaisie.Combo, longueur: 25 };
	}
	initialiserCombo(aInstance) {
		aInstance.setOptionsObjetSaisie({ longueur: 25 });
	}
	getIndiceDansListe(aListe, aValeur) {
		for (let i = 0; i < aListe.count(); i++) {
			if (aListe.get(i).valeur === aValeur) {
				return i;
			}
		}
		return null;
	}
	composeGroupe(aTitre, aContenu, aPremier) {
		const T = [];
		const lMargin = aPremier ? "margin:0px;" : "margin:3px 0 0 0;";
		T.push(
			IE.jsx.str(
				"fieldset",
				{
					class: "AlignementGauche",
					style: `padding:0px 3px 3px 5px;${lMargin}${ObjetStyle_1.GStyle.composeCouleurBordure(GCouleur.fenetre.bordure)}`,
				},
				IE.jsx.str(
					"legend",
					{
						class: "Texte10 Gras Insecable",
						style: ", GStyle.composeCouleurTexte(GCouleur.fenetre.texte), ",
					},
					aTitre,
				),
				aContenu,
			),
		);
		return T.join("");
	}
	_composeChoixOrientation() {
		const T = [];
		T.push('<div class="MargeHaut">');
		T.push(
			'<ie-radio ie-model="rbPortrait(true)" class="Texte10" style="margin:2px;">',
			ObjetTraduction_1.GTraductions.getValeur("GenerationPDF.Portrait"),
			"</ie-radio>",
		);
		T.push("<br />");
		T.push(
			'<ie-radio ie-model="rbPortrait(false)" class="Texte10" style="margin:2px;">',
			ObjetTraduction_1.GTraductions.getValeur("GenerationPDF.Paysage"),
			"</ie-radio>",
		);
		T.push("</div>");
		return T.join("");
	}
	_composeChoixTailleUniquePolice() {
		const T = [];
		T.push('<div class="NoWrap MargeHaut" style="position:relative;">');
		T.push("<div>");
		T.push(
			'<ie-combo class="Combo_GenerationPDF" ie-model="comboPolice(true)"></ie-combo>',
		);
		T.push("</div>");
		T.push("</div>");
		return T.join("");
	}
	_composeChoixTaillesPolice() {
		const T = [];
		T.push('<div class="NoWrap MargeHaut" style="position:relative;">');
		T.push("<div>");
		T.push(
			'<div class="Texte9 Insecable">',
			ObjetTraduction_1.GTraductions.getValeur(
				"GenerationPDF.TaillePoliceSouhaitee",
			) + " :",
			"</div>",
		);
		T.push(
			'<ie-combo class="Combo_GenerationPDF" ie-model="comboPolice(true)"></ie-combo>',
		);
		T.push("</div>");
		T.push(
			'<div style="position:absolute; top:0px; left:',
			this.ecartCombo,
			'px;">',
		);
		T.push(
			'<div class="Texte9 Insecable">',
			ObjetTraduction_1.GTraductions.getValeur(
				"GenerationPDF.TaillePoliceMinAutorisee",
			) + " :",
			"</div>",
		);
		T.push(
			'<ie-combo class="Combo_GenerationPDF" ie-model="comboPolice(false)"></ie-combo>',
		);
		T.push("</div>");
		T.push("</div>");
		return T.join("");
	}
	_evenementSurComboTaillePolice(aSurTaillePolice, aGenreEvenement, aElement) {
		switch (aGenreEvenement) {
			case Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection:
				if (!aElement) {
					return;
				}
				if (aSurTaillePolice) {
					this._optionsPDF.taillePolice = aElement.valeur;
					if (
						this._optionsPDF.taillePolice < this._optionsPDF.taillePoliceMin
					) {
						this._optionsPDF.taillePoliceMin = this._optionsPDF.taillePolice;
					}
				} else {
					this._optionsPDF.taillePoliceMin = aElement.valeur;
					if (
						this._optionsPDF.taillePoliceMin > this._optionsPDF.taillePolice
					) {
						this._optionsPDF.taillePolice = this._optionsPDF.taillePoliceMin;
					}
				}
				break;
		}
	}
	getStrTitreFenetre() {
		return "";
	}
}
exports.ObjetParametrageGenerationPdf = ObjetParametrageGenerationPdf;
class ObjetParametrageGenerationPdf_SansPolice extends ObjetParametrageGenerationPdf {
	constructor(...aParams) {
		super(...aParams);
		this.setOptions({ avecPolices: false });
	}
}
exports.ObjetParametrageGenerationPdf_SansPolice =
	ObjetParametrageGenerationPdf_SansPolice;
class ObjetParametrageGenerationPdf_EDT extends ObjetParametrageGenerationPdf {
	constructor(...aParams) {
		super(...aParams);
		this._optionsPDF = OptionsPDF_1._OptionsPDF.EDT;
		this.setOptions({ avecPolices: true });
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			rbGrilleAImprimer: {
				getValue(aUneGrilleParSemaine) {
					return (
						aInstance._optionsPDF.uneGrilleParSemaine === aUneGrilleParSemaine
					);
				},
				setValue(aUneGrilleParSemaine) {
					aInstance._optionsPDF.uneGrilleParSemaine = aUneGrilleParSemaine;
				},
			},
			cbGrilleIgnorerLesPlagesSansCours: {
				getValue() {
					return aInstance._optionsPDF.ignorerLesPlagesSansCours === true;
				},
				setValue(aValue) {
					aInstance._optionsPDF.ignorerLesPlagesSansCours = aValue;
				},
			},
			btnInversionAxe: {
				event() {
					aInstance._optionsPDF.inversionGrille =
						!aInstance._optionsPDF.inversionGrille;
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"GenerationPDF.EDT.HintAxes",
					);
				},
			},
			htmlAxe(aHorizontale) {
				const lDefinitionAxes =
					aInstance._parametres.PARAMETRE_FENETRE.definitionAxes;
				return aHorizontale
					? !aInstance._optionsPDF.inversionGrille
						? lDefinitionAxes.v
						: lDefinitionAxes.h
					: !aInstance._optionsPDF.inversionGrille
						? lDefinitionAxes.h
						: lDefinitionAxes.v;
			},
			surInversionAxe() {
				aInstance._optionsPDF.inversionGrille =
					!aInstance._optionsPDF.inversionGrille;
				this.controleur.$refreshSelf();
			},
			rbCouleur: {
				getValue(aGenreCouleurTexte) {
					return aInstance._optionsPDF.couleur === aGenreCouleurTexte;
				},
				setValue(aGenreCouleurTexte) {
					aInstance._optionsPDF.couleur = aGenreCouleurTexte;
				},
			},
			rbRenvois: {
				getValue(aGenreRenvoi) {
					return aInstance._optionsPDF.renvoi === aGenreRenvoi;
				},
				setValue(aGenreRenvoi) {
					aInstance._optionsPDF.renvoi = aGenreRenvoi;
				},
			},
		});
	}
	serialiserParametres(aParametres) {
		super.serialiserParametres(aParametres);
		$.extend(aParametres, {
			couleur: this._optionsPDF.couleur,
			renvoi: this._optionsPDF.renvoi,
			uneGrilleParSemaine: this._optionsPDF.uneGrilleParSemaine,
			inversionGrille: this._optionsPDF.inversionGrille || undefined,
			ignorerLesPlagesSansCours: this._optionsPDF.ignorerLesPlagesSansCours,
		});
	}
	composePage(aHtml) {
		super.composePage(aHtml);
		if (!this._parametres.PARAMETRE_FENETRE) {
			this._parametres.PARAMETRE_FENETRE = {};
		}
		const lParamsAff = this._parametres.PARAMETRE_FENETRE;
		if (lParamsAff.definitionAxes) {
			aHtml.push(
				this.composeGroupe(
					ObjetTraduction_1.GTraductions.getValeur(
						"GenerationPDF.EDT.DefinitionDesAxes",
					),
					_composeInversionAxes.call(this),
				),
			);
		}
		if (lParamsAff.avecChoixGrilleAImprimer) {
			aHtml.push(
				this.composeGroupe(
					ObjetTraduction_1.GTraductions.getValeur(
						"GenerationPDF.EDT.Agencement",
					),
					'<ie-radio ie-model="rbGrilleAImprimer(false)" class="Texte10" style="margin:2px;">' +
						ObjetTraduction_1.GTraductions.getValeur(
							"GenerationPDF.EDT.GrilleDomaine",
						) +
						"</ie-radio>" +
						"<br />" +
						'<ie-radio ie-model="rbGrilleAImprimer(true)" class="Texte10" style="margin:2px;">' +
						ObjetTraduction_1.GTraductions.getValeur(
							"GenerationPDF.EDT.GrilleParSemaine",
						) +
						"</ie-radio>",
				),
			);
		}
		if (lParamsAff.avecChoixDefinitionDesPlages) {
			aHtml.push(
				this.composeGroupe(
					ObjetTraduction_1.GTraductions.getValeur(
						"GenerationPDF.EDT.DefinitionDesPlages",
					),
					'<ie-checkbox ie-model="cbGrilleIgnorerLesPlagesSansCours" style="margin:2px;">' +
						ObjetTraduction_1.GTraductions.getValeur(
							"GenerationPDF.EDT.IgnorerLesPlagesSansCours",
						) +
						"</ie-checkbox>",
				),
			);
		}
		if (lParamsAff.avecChoixCouleurCours) {
			aHtml.push(
				this.composeGroupe(
					ObjetTraduction_1.GTraductions.getValeur(
						"GenerationPDF.EDT.CouleurCours",
					),
					'<ie-radio ie-model="rbCouleur(' +
						OptionsPDF_1.EGenreCouleurTexte_EDT.aucune +
						')" class="Texte10" style="margin:2px;">' +
						ObjetTraduction_1.GTraductions.getValeur(
							"GenerationPDF.EDT.Aucune",
						) +
						"</ie-radio>" +
						"<br />" +
						'<ie-radio ie-model="rbCouleur(' +
						OptionsPDF_1.EGenreCouleurTexte_EDT.fond +
						')" class="Texte10" style="margin:2px;">' +
						ObjetTraduction_1.GTraductions.getValeur(
							"GenerationPDF.EDT.FondCouleur",
						) +
						"</ie-radio>" +
						"<br />" +
						'<ie-radio ie-model="rbCouleur(' +
						OptionsPDF_1.EGenreCouleurTexte_EDT.texte +
						')" class="Texte10" style="margin:2px;">' +
						ObjetTraduction_1.GTraductions.getValeur(
							"GenerationPDF.EDT.TexteCouleur",
						) +
						"</ie-radio>",
				),
			);
		}
		if (!!lParamsAff.choixRenvois) {
			const lHtml = [];
			if (
				lParamsAff.choixRenvois.includes(
					TypeGestionRenvoisImp_1.TypeGestionRenvoisImp.impRenvoisAucun,
				)
			) {
				lHtml.push(
					'<ie-radio ie-model="rbRenvois(' +
						TypeGestionRenvoisImp_1.TypeGestionRenvoisImp.impRenvoisAucun +
						')" class="Texte10" style="margin:2px;">' +
						ObjetTraduction_1.GTraductions.getValeur(
							"GenerationPDF.EDT.AucunRenvoi",
						) +
						"</ie-radio>",
				);
			}
			if (
				lParamsAff.choixRenvois.includes(
					TypeGestionRenvoisImp_1.TypeGestionRenvoisImp.impRenvoisSousBloc,
				)
			) {
				lHtml.push(
					'<ie-radio ie-model="rbRenvois(' +
						TypeGestionRenvoisImp_1.TypeGestionRenvoisImp.impRenvoisSousBloc +
						')" class="Texte10" style="margin:2px;">' +
						ObjetTraduction_1.GTraductions.getValeur(
							"GenerationPDF.EDT.RenvoiSousChaqueGrille",
						) +
						"</ie-radio>",
				);
			}
			if (
				lParamsAff.choixRenvois.includes(
					TypeGestionRenvoisImp_1.TypeGestionRenvoisImp.impRenvoisApresPage,
				)
			) {
				lHtml.push(
					'<ie-radio ie-model="rbRenvois(' +
						TypeGestionRenvoisImp_1.TypeGestionRenvoisImp.impRenvoisApresPage +
						')" class="Texte10" style="margin:2px;">' +
						ObjetTraduction_1.GTraductions.getValeur(
							"GenerationPDF.EDT.RenvoiApresChaquePage",
						) +
						"</ie-radio>",
				);
			}
			if (
				lParamsAff.choixRenvois.includes(
					TypeGestionRenvoisImp_1.TypeGestionRenvoisImp.impRenvoisCumulesALaFin,
				)
			) {
				lHtml.push(
					'<ie-radio ie-model="rbRenvois(' +
						TypeGestionRenvoisImp_1.TypeGestionRenvoisImp
							.impRenvoisCumulesALaFin +
						')" class="Texte10" style="margin:2px;">' +
						ObjetTraduction_1.GTraductions.getValeur(
							"GenerationPDF.EDT.RenvoiRegroupeFin",
						) +
						"</ie-radio>",
				);
			}
			aHtml.push(
				this.composeGroupe(
					ObjetTraduction_1.GTraductions.getValeur("GenerationPDF.EDT.Renvois"),
					lHtml.join("<br />"),
				),
			);
		}
	}
}
exports.ObjetParametrageGenerationPdf_EDT = ObjetParametrageGenerationPdf_EDT;
function _composeInversionAxes() {
	const T = [],
		lHeightLigne = 17,
		lWidthLibelle = 80;
	T.push('<div class="NoWrap">');
	T.push(
		'<div class="InlineBlock">',
		'<div style="',
		ObjetStyle_1.GStyle.composeHeight(lHeightLigne),
		'">',
		ObjetTraduction_1.GTraductions.getValeur("GenerationPDF.EDT.Horizontal") +
			" :",
		"</div>",
		'<div style="',
		ObjetStyle_1.GStyle.composeHeight(lHeightLigne),
		'">',
		ObjetTraduction_1.GTraductions.getValeur("GenerationPDF.EDT.Vertical") +
			" :",
		"</div>",
		"</div>",
	);
	T.push(
		'<div class="InlineBlock EspaceGauche">',
		'<ie-btnimage ie-model="btnInversionAxe" class="Image_IntervertirLigneDevant" style="width:10px"></ie-btnimage>',
		"</div>",
	);
	T.push(
		'<div class="InlineBlock PetitEspaceGauche">',
		'<div style="',
		ObjetStyle_1.GStyle.composeHeight(lHeightLigne),
		'">',
		'<div ie-html="htmlAxe(true)" ie-event="click->surInversionAxe" class="AvecMain"',
		' style="padding:1px;',
		ObjetStyle_1.GStyle.composeCouleurBordure(GCouleur.fenetre.bordure),
		ObjetStyle_1.GStyle.composeWidth(lWidthLibelle),
		'"></div>',
		"</div>",
		'<div style="',
		ObjetStyle_1.GStyle.composeHeight(lHeightLigne),
		'">',
		'<div ie-html="htmlAxe(false)" ie-event="click->surInversionAxe" class="AvecMain"',
		' style="padding:1px;',
		ObjetStyle_1.GStyle.composeCouleurBordure(GCouleur.fenetre.bordure),
		ObjetStyle_1.GStyle.composeWidth(lWidthLibelle),
		'"></div>',
		"</div>",
		"</div>",
	);
	T.push(
		'<div class="InlineBlock PetitEspaceGauche">',
		'<ie-btnimage ie-model="btnInversionAxe" class="Image_IntervertirLigneDerriere" style="width:10px"></ie-btnimage>',
		"</div>",
	);
	T.push("</div>");
	return T.join("");
}
class ObjetParametrageGenerationPdf_BulletinReleve extends ObjetParametrageGenerationPdf {
	constructor(...aParams) {
		super(...aParams);
		this._optionsPDF = OptionsPDF_1._OptionsPDF.BulletinReleve;
		this.setOptions({
			avecPolices: true,
			libelleGroupePolices: ObjetTraduction_1.GTraductions.getValeur(
				"GenerationPDF.ReleveNotes.TaillePoliceNotes",
			),
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbPolicePied: {
				init(aPoliceSouhait, aInstanceComboPolicePied) {
					aInstanceComboPolicePied.setOptionsObjetSaisie(
						$.extend(aInstance.getOptionsDefautCombo(), {
							labelWAICellule:
								ObjetTraduction_1.GTraductions.getValeur(
									"GenerationPDF.ReleveNotes.TaillePolicePied",
								) +
								" " +
								(aPoliceSouhait
									? ObjetTraduction_1.GTraductions.getValeur(
											"GenerationPDF.TaillePoliceSouhaitee",
										)
									: ObjetTraduction_1.GTraductions.getValeur(
											"GenerationPDF.TaillePoliceMinAutorisee",
										)),
						}),
					);
					if (aPoliceSouhait) {
						aInstance.cbPolicePied = aInstanceComboPolicePied;
					} else {
						aInstance.cbPolicePiedMin = aInstanceComboPolicePied;
					}
				},
				getDonnees(aPoliceSouhait, aDonnees) {
					if (!aDonnees) {
						return aInstance.getListePolice();
					}
				},
				getIndiceSelection(aPoliceSouhait, aInstanceComboPolicePied) {
					return aInstance.getIndiceDansListe(
						aInstanceComboPolicePied.getListeElements(),
						aPoliceSouhait
							? aInstance._optionsPDF.taillePolicePied
							: aInstance._optionsPDF.taillePolicePiedMin,
					);
				},
				event(aPoliceSouhait, aParams) {
					aInstance._evenementSurComboTaillePolicePied(
						aPoliceSouhait,
						aParams,
						aParams.element,
					);
				},
			},
			cbHautService: {
				init(aMini, aInstanceCbHautService) {
					aInstanceCbHautService.setOptionsObjetSaisie(
						$.extend(aInstance.getOptionsDefautCombo(), {
							labelWAICellule:
								ObjetTraduction_1.GTraductions.getValeur(
									"GenerationPDF.ReleveNotes.HauteurService",
								) +
								" " +
								(aMini
									? ObjetTraduction_1.GTraductions.getValeur(
											"GenerationPDF.ReleveNotes.Minimum",
										)
									: ObjetTraduction_1.GTraductions.getValeur(
											"GenerationPDF.ReleveNotes.Maximum",
										)) +
								"(mm)",
						}),
					);
					if (aMini) {
						aInstance.cbHautServiceMin = aInstanceCbHautService;
					} else {
						aInstance.cbHautServiceMax = aInstanceCbHautService;
					}
				},
				getDonnees(aMini, aDonnees) {
					if (!aDonnees) {
						const lListeHauteursMin =
							new ObjetListeElements_1.ObjetListeElements();
						for (let i = 6; i <= 40; i++) {
							const lElement = new ObjetElement_1.ObjetElement("" + i);
							lElement.valeur = i;
							lListeHauteursMin.addElement(lElement);
						}
						return lListeHauteursMin;
					}
				},
				getIndiceSelection(aMini, aInstanceComboHautService) {
					return aInstance.getIndiceDansListe(
						aInstanceComboHautService.getListeElements(),
						aMini
							? aInstance._optionsPDF.hauteurServiceMin
							: aInstance._optionsPDF.hauteurServiceMax,
					);
				},
				event(aMini, aParams) {
					aInstance._evenementSurcbHautService(aMini, aParams, aParams.element);
				},
			},
		});
	}
	serialiserParametres(aParametres) {
		super.serialiserParametres(aParametres);
		$.extend(aParametres, {
			taillePolicePied: this._optionsPDF.taillePolicePied,
			taillePolicePiedMin: this._optionsPDF.taillePolicePiedMin,
		});
		if (this.afficherGroupeHauteurService()) {
			$.extend(aParametres, {
				hauteurServiceMin: this._optionsPDF.hauteurServiceMin,
				hauteurServiceMax: this._optionsPDF.hauteurServiceMax,
			});
		}
	}
	afficherGroupeHauteurService() {
		return true;
	}
	composePage(aHtml) {
		super.composePage(aHtml);
		aHtml.push(
			this.composeGroupe(
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.ReleveNotes.TaillePolicePied",
				),
				this._composeChoixPolicePied(),
			),
		);
		if (this.afficherGroupeHauteurService()) {
			aHtml.push(
				this.composeGroupe(
					ObjetTraduction_1.GTraductions.getValeur(
						"GenerationPDF.ReleveNotes.HauteurService",
					),
					this.composeChoixHauteurService(),
				),
			);
		}
	}
	getListePolice() {
		const lListePolice = new ObjetListeElements_1.ObjetListeElements();
		let lElement,
			lValeur,
			lTailleMax = 12;
		for (let i = 1; i <= lTailleMax; i++) {
			lValeur = i;
			lElement = new ObjetElement_1.ObjetElement("" + lValeur);
			lElement.valeur = lValeur;
			lListePolice.addElement(lElement);
			if (i < lTailleMax) {
				lValeur = i + 0.5;
				lElement = new ObjetElement_1.ObjetElement("" + lValeur);
				lElement.valeur = lValeur;
				lListePolice.addElement(lElement);
			}
		}
		return lListePolice;
	}
	_composeChoixPolicePied() {
		const T = [];
		T.push('<div class="NoWrap MargeHaut" style="position:relative;">');
		T.push("<div>");
		T.push(
			'<div class="Texte9 Insecable">',
			ObjetTraduction_1.GTraductions.getValeur(
				"GenerationPDF.TaillePoliceSouhaitee",
			) + " :",
			"</div>",
		);
		T.push(
			'<ie-combo class="Combo_GenerationPDF" ie-model="cbPolicePied(true)"></ie-combo>',
		);
		T.push("</div>");
		T.push(
			'<div style="position:absolute; top:0px; left:',
			this.ecartCombo,
			'px;">',
		);
		T.push(
			'<div class="Texte9 Insecable">',
			ObjetTraduction_1.GTraductions.getValeur(
				"GenerationPDF.TaillePoliceMinAutorisee",
			) + " :",
			"</div>",
		);
		T.push(
			'<ie-combo class="Combo_GenerationPDF" ie-model="cbPolicePied(false)"></ie-combo>',
		);
		T.push("</div>");
		T.push("</div>");
		return T.join("");
	}
	composeChoixHauteurService() {
		const T = [];
		T.push('<div class="NoWrap MargeHaut" style="position:relative;">');
		T.push("<div>");
		T.push(
			'<div class="Texte9 Insecable">',
			ObjetTraduction_1.GTraductions.getValeur(
				"GenerationPDF.ReleveNotes.Minimum",
			) + " :",
			"</div>",
		);
		T.push(
			"<div>",
			'<ie-combo ie-model="cbHautService(true)" class="Combo_GenerationPDF InlineBlock"></ie-combo>',
			'<div class="InlineBlock Insecable Texte9 m-left">',
			"(mm)",
			"</div>",
			"</div>",
		);
		T.push("</div>");
		T.push(
			'<div style="position:absolute; top:0px; left:',
			this.ecartCombo,
			'px;">',
		);
		T.push(
			'<div class="Texte9 Insecable">',
			ObjetTraduction_1.GTraductions.getValeur(
				"GenerationPDF.ReleveNotes.Maximum",
			) + " :",
			"</div>",
		);
		T.push(
			"<div>",
			'<ie-combo ie-model="cbHautService(false)" class="Combo_GenerationPDF InlineBlock"></ie-combo>',
			'<div class="InlineBlock Insecable Texte9 m-left">',
			"(mm)",
			"</div>",
			"</div>",
		);
		T.push("</div>");
		T.push("</div>");
		return T.join("");
	}
	_evenementSurComboTaillePolicePied(aSurTaillePolice, aParamsCombo, aElement) {
		switch (aParamsCombo.genreEvenement) {
			case Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection:
				if (!aElement) {
					return;
				}
				if (aSurTaillePolice) {
					this._optionsPDF.taillePolicePied = aElement.valeur;
					if (
						this._optionsPDF.taillePolicePied <
						this._optionsPDF.taillePolicePiedMin
					) {
						this._optionsPDF.taillePolicePiedMin =
							this._optionsPDF.taillePolicePied;
						this.cbPolicePiedMin.setSelection(
							this.getIndiceDansListe(
								this.cbPolicePiedMin.getListeElements(),
								this._optionsPDF.taillePolicePiedMin,
							),
						);
					}
				} else {
					this._optionsPDF.taillePolicePiedMin = aElement.valeur;
					if (
						this._optionsPDF.taillePolicePiedMin >
						this._optionsPDF.taillePolicePied
					) {
						this._optionsPDF.taillePolicePied =
							this._optionsPDF.taillePolicePiedMin;
						this.cbPolicePied.setSelection(
							this.getIndiceDansListe(
								this.cbPolicePied.getListeElements(),
								this._optionsPDF.taillePolicePied,
							),
						);
					}
				}
				break;
		}
	}
	_evenementSurcbHautService(aSurMin, aParamsCombo, aElement) {
		if (
			aParamsCombo.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			if (!aElement) {
				return;
			}
			let lInstance;
			if (aSurMin) {
				this._optionsPDF.hauteurServiceMin = aElement.valeur;
				if (
					this._optionsPDF.hauteurServiceMin >
					this._optionsPDF.hauteurServiceMax
				) {
					this._optionsPDF.hauteurServiceMax =
						this._optionsPDF.hauteurServiceMin;
					lInstance = this.cbHautServiceMax;
					lInstance.setSelection(
						this.getIndiceDansListe(
							lInstance.getListeElements(),
							this._optionsPDF.hauteurServiceMax,
						),
					);
				}
			} else {
				this._optionsPDF.hauteurServiceMax = aElement.valeur;
				if (
					this._optionsPDF.hauteurServiceMin >
					this._optionsPDF.hauteurServiceMax
				) {
					this._optionsPDF.hauteurServiceMin =
						this._optionsPDF.hauteurServiceMax;
					lInstance = this.cbHautServiceMin;
					lInstance.setSelection(
						this.getIndiceDansListe(
							lInstance.getListeElements(),
							this._optionsPDF.hauteurServiceMin,
						),
					);
				}
			}
		}
	}
}
exports.ObjetParametrageGenerationPdf_BulletinReleve =
	ObjetParametrageGenerationPdf_BulletinReleve;
class ObjetParametrageGenerationPdf_Bulletin extends ObjetParametrageGenerationPdf_BulletinReleve {
	constructor(...aParams) {
		super(...aParams);
		this._optionsPDF = OptionsPDF_1._OptionsPDF.Bulletin;
	}
	serialiserParametres(aParametres) {
		super.serialiserParametres(aParametres);
		$.extend(aParametres, {
			adapterHauteurService: this._optionsPDF.adapterHauteurService,
		});
	}
	_getTradAdapterHauteur() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"GenerationPDF.ReleveNotes.AdapterHauteurApp",
		);
	}
	composeChoixHauteurService() {
		const T = [];
		T.push(super.composeChoixHauteurService());
		T.push(
			'<ie-checkbox ie-model="_optionsPDF.adapterHauteurService" class="MargeHaut">',
			this._getTradAdapterHauteur(),
			"</ie-checkbox>",
		);
		return T.join("");
	}
}
exports.ObjetParametrageGenerationPdf_Bulletin =
	ObjetParametrageGenerationPdf_Bulletin;
class ObjetParametrageGenerationPdf_ReleveDeNotes extends ObjetParametrageGenerationPdf_BulletinReleve {}
exports.ObjetParametrageGenerationPdf_ReleveDeNotes =
	ObjetParametrageGenerationPdf_ReleveDeNotes;
