exports.PageOffresStages = void 0;
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetDate_1 = require("ObjetDate");
const ObjetDetailOffreStage_1 = require("ObjetDetailOffreStage");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ToucheClavier_1 = require("ToucheClavier");
const ObjetFenetre_FiltrePeriodeOffresStages_1 = require("ObjetFenetre_FiltrePeriodeOffresStages");
const DonneesListe_ListeEntreprises_1 = require("DonneesListe_ListeEntreprises");
const ObjetSaisie_1 = require("ObjetSaisie");
const Enumere_Saisie_1 = require("Enumere_Saisie");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const RechercheTexte_1 = require("RechercheTexte");
const AccessApp_1 = require("AccessApp");
class PageOffresStages extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.idFiltre = GUID_1.GUID.getId();
		this.idFiltreSujetTextfield = GUID_1.GUID.getId();
		this.idFiltreNbSemaines = GUID_1.GUID.getId();
		this.idFiltreRechercheTextfield = GUID_1.GUID.getId();
		this.sujet = "";
		this.recherche = "";
		this.options = {
			avecPeriode: false,
			avecFiltrePeriode: false,
			avecPeriodeUnique: true,
			avecGestionPJ: false,
			genreRessourcePJ: -1,
		};
		this.periode = new ObjetElement_1.ObjetElement("");
		this.periode.dateDebut = ObjetDate_1.GDate.aujourdhui;
		this.periode.dateFin = ObjetDate_1.GDate.aujourdhui;
	}
	construireInstances() {
		this.identListeEntreprises = this.add(
			ObjetListe_1.ObjetListe,
			this._evnSelectListeEntreprise.bind(this),
			this._initListe.bind(this),
		);
		this.identDetailOffreDeStage = this.add(
			ObjetDetailOffreStage_1.ObjetDetailOffreStage,
			null,
			this._initDetail.bind(this),
		);
		this.identFiltreActivite = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._evnFiltreActivite.bind(this),
			(aInstance) => {
				aInstance.setOptionsObjetSaisie({
					mode: Enumere_Saisie_1.EGenreSaisie.Combo,
					multiSelection: true,
					longueur: 220,
					labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
						"OffreStage.titre.Activite",
					),
					getInfosElementCB(aElement) {
						const lEstCumul = aElement.getNumero() === -1;
						return {
							estCumul: lEstCumul,
							estFilsCumul(aFils) {
								return (
									aElement.getGenre() === -1 &&
									aElement.getGenre() !== aFils.getGenre()
								);
							},
							setModifierSelection(aParametresModifie) {
								if (
									aParametresModifie.elementSourceSelectionne &&
									aElement.getGenre() === -1 &&
									aElement.getGenre() !==
										aParametresModifie.elementSource.getGenre()
								) {
									return true;
								}
							},
						};
					},
				});
			},
		);
		if (this.options.avecPeriode && this.options.avecFiltrePeriode) {
			this.idFenetrePeriode = this.addFenetre(
				ObjetFenetre_FiltrePeriodeOffresStages_1.ObjetFenetre_FiltrePeriodeOffresStages,
				this._evntFenetrePeriode.bind(this),
				this._initFenetrePeriode,
			);
		}
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			nbSemaines: {
				getValue: function () {
					return aInstance.filtreNbrSemaines || "";
				},
				setValue: function (aValue) {
					aInstance.filtreNbrSemaines = parseInt(aValue);
					if (
						!MethodesObjet_1.MethodesObjet.isNumber(aInstance.filtreNbrSemaines)
					) {
						aInstance.filtreNbrSemaines = 0;
					}
					aInstance._evnFiltre();
				},
			},
			cbFiltreSeulementAvecOffres: {
				getValue: function () {
					return aInstance.filtreSeulementAvecOffres;
				},
				setValue: function (aValue) {
					aInstance.filtreSeulementAvecOffres = aValue;
					aInstance._evnFiltre();
				},
			},
			recherche: {
				getValue: function () {
					return aInstance ? aInstance.recherche : "";
				},
				setValue: function (aValue) {
					if (aInstance) {
						aInstance.recherche = aValue;
						aInstance._evnFiltre();
					}
				},
			},
			sujet: {
				getValue: function () {
					return aInstance ? aInstance.sujet : "";
				},
				setValue: function (aValue) {
					if (aInstance) {
						aInstance.sujet = aValue;
						aInstance._evnFiltre();
					}
				},
			},
		});
	}
	evntOuvertureFenetrePeriode() {
		if (!this.periode) {
			this.periode = new ObjetElement_1.ObjetElement("");
			this.periode.dateDebut = null;
			this.periode.dateFin = null;
		}
		this.getInstance(this.idFenetrePeriode).setDonnees(this.periode);
		this.getInstance(this.idFenetrePeriode).afficher();
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			'<div class="PageOffreStage-conteneur interface_affV">',
			`<div class="conteneur-gauche">`,
			`<div id="${this.idFiltre}_div" class="filtre-conteneur">${this._composeFiltre()}</div>`,
			`<div id="${this.getInstance(this.identListeEntreprises).getNom()}" class="liste-offres" tabindex="-1"></div>`,
			"</div>",
			'<div class="interface_affV_client overflow-auto">',
			`<div id="${this.getInstance(this.identDetailOffreDeStage).getNom()}" class="detail-offre" tabindex="-1"></div>`,
			"</div>",
			"</div>",
		);
		return H.join("");
	}
	setDonnees(aListeEntreprise) {
		this.listeEntreprises = aListeEntreprise;
		if (this.listeEntreprises) {
			let lEntreprise;
			this.filtreActivite = new ObjetListeElements_1.ObjetListeElements();
			this.filtreSeulementAvecOffres = false;
			this.filtreNbrSemaines = 0;
			this.listeActivites = new ObjetListeElements_1.ObjetListeElements();
			let LActiviteAjoute = false;
			for (
				let i = 0, nbEntreprises = this.listeEntreprises.count();
				i < nbEntreprises;
				i++
			) {
				lEntreprise = this.listeEntreprises.get(i);
				if (lEntreprise.activite) {
					const lActivite = MethodesObjet_1.MethodesObjet.dupliquer(
						lEntreprise.activite,
					);
					if (
						this.listeActivites.getIndiceParNumeroEtGenre(
							lActivite.getNumero(),
						) === undefined
					) {
						lActivite.Position = 2;
						this.listeActivites.addElement(lActivite);
					}
				} else {
					if (!LActiviteAjoute) {
						const lAucuneActivite = new ObjetElement_1.ObjetElement(
							ObjetTraduction_1.GTraductions.getValeur(
								"OffreStage.ActiviteNonDefini",
							),
							null,
							0,
							1,
						);
						lAucuneActivite.filtreAucun = true;
						this.listeActivites.addElement(lAucuneActivite);
						LActiviteAjoute = true;
					}
				}
				lEntreprise.visible = true;
			}
			this.listeActivites.add(
				new ObjetElement_1.ObjetElement(
					'<div class="Gras">' +
						ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.touteLesActivites",
						) +
						"</div>",
					-1,
					-1,
					0,
				),
			);
			this.listeActivites.trier();
			this._trierListe(this.listeEntreprises);
			this.getInstance(this.identFiltreActivite).setDonnees(
				this.listeActivites,
			);
		}
		this.getInstance(this.identListeEntreprises).setDonnees(
			new DonneesListe_ListeEntreprises_1.DonneesListe_ListeEntreprises(
				this.listeEntreprises,
			),
		);
		$("#" + this.idFiltreNbSemaines.escapeJQ()).on(
			"keyup",
			null,
			{ aObjet: this },
			(event) => {
				if (event.which === ToucheClavier_1.ToucheClavier.RetourChariot) {
					event.data.aObjet._setFocusListeOffres();
				}
				event.stopPropagation();
			},
		);
		$("#" + this.idFiltreRechercheTextfield.escapeJQ()).on(
			"keyup",
			null,
			{ aObjet: this },
			(event) => {
				if (event.which === ToucheClavier_1.ToucheClavier.RetourChariot) {
					event.data.aObjet._setFocusListeOffres();
				}
				event.stopPropagation();
			},
		);
		$("#" + this.idFiltreSujetTextfield.escapeJQ()).on(
			"keyup",
			null,
			{ aObjet: this },
			(event) => {
				if (event.which === ToucheClavier_1.ToucheClavier.RetourChariot) {
					event.data.aObjet._setFocusListeOffres();
				}
				event.stopPropagation();
			},
		);
	}
	_setFocusListeOffres() {
		$(
			"#" + this.getInstance(this.identListeEntreprises).getNom().escapeJQ(),
		).focus();
	}
	_initListe(aInstance) {
		const lObjOptionsListe = {
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			colonnes: [{ taille: "100%" }],
			messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
				"OffreStage.aucuneEntreprise",
			),
			forcerOmbreScrollTop: true,
			ariaLabel: (0, AccessApp_1.getApp)()
				.getEtatUtilisateur()
				.getLibelleLongOnglet(),
		};
		if (this.options.largeurImage !== undefined) {
			lObjOptionsListe.largeurImage = this.options.largeurImage;
		}
		aInstance.setOptionsListe(lObjOptionsListe);
	}
	_initDetail(aInstance) {
		aInstance.setOptions({
			avecPeriode: this.options.avecPeriode,
			avecPeriodeUnique: this.options.avecPeriodeUnique,
			avecGestionPJ: this.options.avecGestionPJ,
			genreRessourcePJ: this.options.genreRessourcePJ,
		});
	}
	_initFenetrePeriode(aInstance) {
		aInstance.setOptionsFenetre({ largeur: 350 });
	}
	_evnSelectListeEntreprise(aParametres) {
		this.entrepriseSelectionnee = this.listeEntreprises.get(aParametres.ligne);
		this.getInstance(this.identDetailOffreDeStage).setDonnees({
			entreprise: this.entrepriseSelectionnee,
		});
	}
	_evnFiltreActivite(aParams) {
		if (
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection ===
				aParams.genreEvenement &&
			aParams.listeSelections
		) {
			this.filtreActivite = aParams.listeSelections;
			this._evnFiltre();
		}
	}
	_evnFiltre() {
		const lArrActivites = this.filtreActivite.getTableauNumeros();
		const lEstActiviteVide =
			this.filtreActivite.getIndiceElementParFiltre((aElement) => {
				return aElement.filtreAucun;
			}) > -1;
		this.listeEntreprises.parcourir((aEntreprise) => {
			var _a;
			let lFiltreRecherche = true;
			if (this.recherche && this.recherche.length > 1) {
				lFiltreRecherche = false;
				RechercheTexte_1.RechercheTexte.getTabRechercheTexteNormalize(
					this.recherche,
				).forEach((aSearch, aIndex) => {
					const lRegex = new RegExp(aSearch, "i");
					if (
						((aEntreprise.ville && lRegex.test(aEntreprise.ville)) ||
							(aEntreprise.getLibelle() &&
								lRegex.test(aEntreprise.getLibelle())) ||
							(aEntreprise.nomCommercial &&
								lRegex.test(aEntreprise.nomCommercial)) ||
							(aEntreprise.codePostal &&
								lRegex.test(aEntreprise.codePostal))) &&
						(aIndex === 0 || lFiltreRecherche)
					) {
						lFiltreRecherche = true;
					} else {
						lFiltreRecherche = false;
					}
				});
			}
			const lFiltreActivite =
				lArrActivites.length === 0 ||
				(aEntreprise &&
					aEntreprise.activite &&
					$.inArray(aEntreprise.activite.getNumero(), lArrActivites) > -1) ||
				(lEstActiviteVide &&
					aEntreprise &&
					(!aEntreprise.activite || !aEntreprise.activite.existeNumero()));
			const lFiltreSeulementAvecOffres =
				!this.filtreSeulementAvecOffres ||
				(aEntreprise.listeOffresStages &&
					aEntreprise.listeOffresStages.count() > 0);
			const lNbOffresStages = aEntreprise.listeOffresStages
				? aEntreprise.listeOffresStages.count()
				: 0;
			let lOffre = null;
			let lFiltreSujet = true;
			if (this.sujet && this.sujet.length > 1) {
				lFiltreSujet = false;
				RechercheTexte_1.RechercheTexte.getTabRechercheTexteNormalize(
					this.sujet,
				).forEach((aSearch, aIndex) => {
					const lRegex = new RegExp(aSearch, "i");
					lOffre = null;
					let lEstRechercheBonne = false;
					for (let k = 0; k < lNbOffresStages; k++) {
						lOffre = aEntreprise.listeOffresStages.get(k);
						lEstRechercheBonne =
							lOffre.sujet && lRegex.test(lOffre.sujet.getLibelle());
						if (lEstRechercheBonne && (aIndex === 0 || lFiltreSujet)) {
							lFiltreSujet = true;
							break;
						}
					}
					if (lFiltreSujet && !lEstRechercheBonne) {
						lFiltreSujet = false;
					}
				});
			}
			let lFiltreNbSemaines = true;
			if (this.filtreNbrSemaines > 0) {
				lFiltreNbSemaines = false;
				lOffre = null;
				for (let m = 0; m < lNbOffresStages; m++) {
					lOffre = aEntreprise.listeOffresStages.get(m);
					if (
						lOffre.dureeEnJours &&
						lOffre.dureeEnJours >= this.filtreNbrSemaines * 7
					) {
						lFiltreNbSemaines = true;
						break;
					}
				}
			}
			let lFiltrePeriode = true;
			if (
				this.options.avecPeriode &&
				this.options.avecFiltrePeriode &&
				this.periode &&
				this.periode.dateDebut &&
				this.periode.dateDebut.getTime() > 0 &&
				this.periode.dateFin
			) {
				lFiltrePeriode = false;
				lOffre = null;
				for (let n = 0; n < lNbOffresStages; n++) {
					lOffre = aEntreprise.listeOffresStages.get(n);
					const lPeriode =
						((_a = lOffre.periodes) === null || _a === void 0
							? void 0
							: _a.count()) === 1 && lOffre.periodes.get(0);
					if (!lPeriode || (!lPeriode.dateDebut && !lPeriode.dateFin)) {
						lFiltrePeriode = true;
						break;
					} else if (lPeriode.dateDebut && lPeriode.dateFin) {
						if (
							lPeriode.dateDebut <= this.periode.dateDebut &&
							lPeriode.dateFin >= this.periode.dateFin
						) {
							lFiltrePeriode = true;
							break;
						}
					}
				}
			}
			aEntreprise.visible =
				lFiltreRecherche &&
				lFiltreActivite &&
				lFiltreSeulementAvecOffres &&
				lFiltreSujet &&
				lFiltreNbSemaines &&
				lFiltrePeriode;
			if (
				this.entrepriseSelectionnee &&
				this.entrepriseSelectionnee === aEntreprise &&
				!aEntreprise.visible
			) {
				this.entrepriseSelectionnee = null;
				this.getInstance(this.identListeEntreprises).selectionnerLigne({
					deselectionnerTout: true,
					ligne: -1,
				});
			}
		});
		this.getInstance(this.identListeEntreprises).actualiser(true);
		this.getInstance(this.identDetailOffreDeStage).setDonnees({
			entreprise: this.entrepriseSelectionnee,
		});
	}
	_evntFenetrePeriode(aNumeroBouton, aEstModif) {
		let lLibelle = "";
		if (aEstModif) {
			if (!!this.periode.dateDebut) {
				if (
					ObjetDate_1.GDate.estDateEgale(
						this.periode.dateDebut,
						this.periode.dateFin,
					)
				) {
					lLibelle =
						ObjetTraduction_1.GTraductions.getValeur("Le") +
						" " +
						ObjetDate_1.GDate.formatDate(this.periode.dateDebut, "%JJ/%MM/%AA");
				} else {
					lLibelle =
						ObjetTraduction_1.GTraductions.getValeur("Du") +
						" " +
						ObjetDate_1.GDate.formatDate(this.periode.dateDebut, "%JJ/%MM/%AA");
					lLibelle +=
						" " +
						ObjetTraduction_1.GTraductions.getValeur("Au") +
						" " +
						ObjetDate_1.GDate.formatDate(this.periode.dateFin, "%JJ/%MM/%AA");
				}
			}
			this.periode.setLibelle(lLibelle);
			this._evnFiltre();
		}
	}
	_composeFiltre() {
		const H = [];
		const lIdPeriode = GUID_1.GUID.getId();
		H.push(
			`<div class="fields-wrapper">\n              <div class="input-field">\n                <input type="text" id="${this.idFiltreRechercheTextfield}" ie-model="recherche" class="recherche" aria-label="${ObjetTraduction_1.GTraductions.getValeur("OffreStage.titre.Recherche")}" placeholder="${ObjetTraduction_1.GTraductions.getValeur("OffreStage.titre.Recherche")}"/>\n              </div>\n              <div class="input-field">\n                <input type="text" id="${this.idFiltreSujetTextfield}" ie-model="sujet" class="sujet" aria-label="${ObjetTraduction_1.GTraductions.getValeur("OffreStage.titre.Sujet")}" placeholder="${ObjetTraduction_1.GTraductions.getValeur("OffreStage.titre.Sujet")}"/>\n              </div>\n              <div class="input-field">\n                <label>${ObjetTraduction_1.GTraductions.getValeur("OffreStage.titre.Activite")}</label>\n                <div id="${this.getInstance(this.identFiltreActivite).getNom()}"></div>\n              </div>\n            </div>`,
		);
		H.push(`<div class="fields-wrapper">`);
		if (this.options.avecPeriode && this.options.avecFiltrePeriode) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "input-field" },
					IE.jsx.str(
						"label",
						{ id: lIdPeriode },
						ObjetTraduction_1.GTraductions.getValeur(
							"OffreStage.titre.Periode",
						),
					),
					IE.jsx.str("ie-btnselecteur", {
						class: "periode",
						"aria-labelledby": lIdPeriode,
						"ie-model": this.jsxModelBtnSelecteurRecherchePeriodes.bind(this),
					}),
				),
			);
		}
		H.push(
			IE.jsx.str(
				"div",
				{ class: "input-field" },
				IE.jsx.str(
					"label",
					{ for: this.idFiltreNbSemaines },
					ObjetTraduction_1.GTraductions.getValeur("OffreStage.dureeMinimale"),
				),
				IE.jsx.str("input", {
					type: "text",
					"ie-model": "nbSemaines",
					"ie-mask": "/[^0-9]/i",
					id: this.idFiltreNbSemaines,
					style: { width: "4.3rem" },
					maxlength: "2",
				}),
			),
			`</div>`,
		);
		H.push(`<div class="fields-wrapper input-field">\n              <ie-checkbox ie-textleft ie-model="cbFiltreSeulementAvecOffres">${ObjetTraduction_1.GTraductions.getValeur("OffreStage.titre.FiltreSeulementAvecOffre")}
            </div>`);
		return H.join("");
	}
	jsxModelBtnSelecteurRecherchePeriodes() {
		return {
			event: () => {
				if (this.options.avecPeriode && this.options.avecFiltrePeriode) {
					this.evntOuvertureFenetrePeriode();
				}
			},
			getLibelle: () => {
				return this.periode ? this.periode.getLibelle().ucfirst() : " ";
			},
			getIcone: () => {
				return "icon_calendar_empty";
			},
		};
	}
	_trierListe(aListe) {
		aListe.setTri([
			ObjetTri_1.ObjetTri.init("Position"),
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		aListe.trier();
	}
}
exports.PageOffresStages = PageOffresStages;
