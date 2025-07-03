exports.ObjetFenetre_MesureIncident = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetStyle_1 = require("ObjetStyle");
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetStyle_2 = require("ObjetStyle");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_Saisie_1 = require("Enumere_Saisie");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeGenrePunition_1 = require("TypeGenrePunition");
const ObjetSelecteurPJ_1 = require("ObjetSelecteurPJ");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetSelecteurPJCP_1 = require("ObjetSelecteurPJCP");
const ObjetUtilitaireAbsence_1 = require("ObjetUtilitaireAbsence");
const ObjetFenetre_ChoixDatePublicationPunition_1 = require("ObjetFenetre_ChoixDatePublicationPunition");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_MesureIncident extends ObjetFenetre_1.ObjetFenetre {
	constructor() {
		super(...arguments);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.idLabelDate = GUID_1.GUID.getId();
	}
	construireInstances() {
		this.identDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._evntSurDate.bind(this),
			this._initSelecteurDate.bind(this),
		);
		this.identSelecteurPJ = this.add(
			ObjetSelecteurPJ_1.ObjetSelecteurPJ,
			this._evntSelecteurPJ.bind(this),
			this._initSelecteurPJ.bind(this),
		);
	}
	setDonnees(aParam) {
		this.param = MethodesObjet_1.MethodesObjet.dupliquer(aParam);
		if (this.param && this.param.mesure) {
			this.listeDuree = new ObjetListeElements_1.ObjetListeElements();
			for (let i = 0; i <= 10; i++) {
				const lLibelle =
					i === 0
						? "&nbsp;"
						: ObjetDate_1.GDate.formatDureeEnMillisecondes(
								30 * i * 60 * 1000,
								"%xh%sh%mm",
							);
				this.listeDuree.addElement(
					new ObjetElement_1.ObjetElement(lLibelle, null, i * 30),
				);
			}
			this._indiceDuree = 0;
			if (this.param.mesure.duree > 0) {
				const lListe =
					this.param.mesure.nature.getGenre() ===
					TypeGenrePunition_1.TypeGenrePunition.GP_ExclusionCours
						? this.param.mesure.donneesSaisie.durees
						: this.listeDuree;
				for (let i = 0; i < lListe.count(); i++) {
					if (lListe.getGenre(i) === this.param.mesure.duree) {
						this._indiceDuree = i;
						break;
					}
				}
			}
			this._indiceAccompagnateur = 0;
			if (!!this.param.mesure.accompagnateur) {
				this._indiceAccompagnateur =
					this.param.mesure.donneesSaisie.accompagnateurs.getIndiceParNumeroEtGenre(
						this.param.mesure.accompagnateur.getNumero(),
					);
			}
			this.afficher();
			const lListePJ = this.param.mesure.documentsTAF
				? this.param.mesure.documentsTAF
				: new ObjetListeElements_1.ObjetListeElements();
			this.getInstance(this.identSelecteurPJ).setActif(true);
			this.getInstance(this.identSelecteurPJ).setOptions({
				genreRessourcePJ: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
			});
			this.getInstance(this.identSelecteurPJ).setDonnees({
				listePJ: lListePJ,
				listeTotale: new ObjetListeElements_1.ObjetListeElements(),
				idContextFocus: this.Nom,
			});
			if (
				this.param.mesure.nature &&
				this.param.mesure.nature.getGenre() ===
					TypeGenrePunition_1.TypeGenrePunition.GP_Devoir
			) {
				this.getInstance(this.identDate).setDonnees(
					this.param.mesure.dateProgrammation,
				);
				this.getInstance(this.identDate).setVisible(true);
			} else {
				this.getInstance(this.identDate).setVisible(false);
			}
			this.$refreshSelf();
		}
	}
	surValidation(aGenreBouton) {
		this.fermer();
		this.callback.appel(aGenreBouton, this.param);
	}
	composeContenu() {
		const lIdLblTravailAFaire = GUID_1.GUID.getId();
		const H = [];
		H.push(
			this._composeTitreSection(
				ObjetTraduction_1.GTraductions.getValeur(
					"fenetreSaisiePunition.suiteDonnee",
				),
			),
		);
		H.push(
			IE.jsx.str(
				"div",
				{ class: "NoWrap EspaceGauche" },
				IE.jsx.str(
					"div",
					{ class: "InlineBlock AlignementMilieuVertical" },
					IE.jsx.str("label", {
						class: "Texte10",
						id: this.idLabelDate,
						"ie-if": "avecLabel",
						"ie-html": "getLabel",
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "InlineBlock AlignementMilieuVertical EspaceDroit" },
					IE.jsx.str("div", { id: this.getNomInstance(this.identDate) }),
				),
				IE.jsx.str(
					"div",
					{
						"ie-if": "avecComboDuree",
						class: "InlineBlock AlignementMilieuVertical EspaceDroit",
					},
					IE.jsx.str("ie-combo", {
						"aria-label":
							ObjetTraduction_1.GTraductions.getValeur("incidents.duree"),
						"ie-model": "duree",
					}),
				),
				IE.jsx.str(
					"div",
					{
						"ie-if": "avecComboAccompagnateur",
						class: "InlineBlock AlignementMilieuVertical EspaceDroit",
					},
					IE.jsx.str(
						"label",
						{ class: "Texte10" },
						ObjetTraduction_1.GTraductions.getValeur(
							"incidents.accompagnateur",
						),
					),
				),
				IE.jsx.str(
					"div",
					{
						"ie-if": "avecComboAccompagnateur",
						class: "InlineBlock AlignementMilieuVertical",
					},
					IE.jsx.str("ie-combo", {
						"aria-label": ObjetTraduction_1.GTraductions.getValeur(
							"incidents.accompagnateur",
						),
						"ie-model": "accompagnateur",
					}),
				),
			),
		);
		H.push(
			IE.jsx.str(
				"div",
				{ class: "EspaceHaut EspaceGauche" },
				IE.jsx.str(
					"label",
					{ id: lIdLblTravailAFaire },
					ObjetTraduction_1.GTraductions.getValeur("fenetreSaisiePunition.taf"),
				),
				IE.jsx.str("br", null),
				IE.jsx.str("textarea", {
					"aria-labelledby": lIdLblTravailAFaire,
					"ie-model": "travailAFaire",
					class: "CelluleTexte FondBlanc",
					style:
						ObjetStyle_2.GStyle.composeWidth(380) +
						ObjetStyle_2.GStyle.composeHeight(70),
				}),
			),
		);
		H.push(
			'<div class="m-top m-left" id="' +
				this.getNomInstance(this.identSelecteurPJ) +
				'"></div>',
		);
		H.push(
			'<div><ie-checkbox class="m-top m-left" ie-model="cbTafPublierDebutSeance" ie-display="cbTafPublierDebutSeance.getDisplay">',
			ObjetTraduction_1.GTraductions.getValeur(
				"punition.publierUniquementDebutRetenue",
			),
			"</ie-checkbox>",
		);
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.punition.avecPublicationPunitions,
			) ||
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.dossierVS.publierDossiersVS,
			)
		) {
			H.push(
				this._composeTitreSection(
					ObjetTraduction_1.GTraductions.getValeur(
						"fenetreSaisiePunition.prevenirResponsables",
					),
					true,
					null,
					"avecDossierOrPublie",
				),
			);
			H.push('<div class="EspaceGauche">');
			H.push(
				IE.jsx.str(
					"div",
					{
						"ie-if": "avecDossier",
						class: "EspaceHaut flex-contain flex-gap-l",
						style: "min-width: 435px;",
					},
					IE.jsx.str(
						"ie-checkbox",
						{ "ie-model": "publicationDossierVS" },
						ObjetTraduction_1.GTraductions.getValeur(
							"fenetreSaisiePunition.publierElementPunitionDossier",
						),
					),
					IE.jsx.str("i", { "ie-class": "imageDossier", role: "presentation" }),
				),
			);
			H.push(
				'<div ie-if="avecDroitPublicationPunition" class="EspaceHaut NoWrap">',
			);
			H.push(
				IE.jsx.str(
					"div",
					{ "ie-if": "estUneMesureSanction", style: "min-width: 435px;" },
					IE.jsx.str(
						"div",
						{ class: "InlineBlock" },
						IE.jsx.str(
							"ie-checkbox",
							{ "ie-model": "cbPublicationSanction" },
							ObjetTraduction_1.GTraductions.getValeur(
								"fenetreSaisiePunition.publierPunition",
							),
						),
					),
					IE.jsx.str(
						"div",
						{ class: "InlineBlock AlignementMilieuVertical" },
						IE.jsx.str("i", {
							"ie-class": "imagePublie",
							"aria-label": ObjetTraduction_1.GTraductions.getValeur(
								"fenetreSaisiePunition.publierPunition",
							),
							role: "presentation",
						}),
					),
				),
			);
			H.push(
				IE.jsx.str(
					"div",
					{ "ie-if": "estUneMesurePunition", style: "min-width: 435px;" },
					IE.jsx.str(
						"div",
						{ class: "flex-contain flex-gap-l" },
						IE.jsx.str(
							"ie-checkbox",
							{ "ie-model": "cbPublicationPunition" },
							ObjetTraduction_1.GTraductions.getValeur(
								"fenetreSaisiePunition.publierPunition",
							),
						),
						IE.jsx.str("i", {
							"ie-class": "getClasseCssImagePublication",
							"ie-hint": "getHintImagePublication",
							role: "presentation",
						}),
					),
					IE.jsx.str(
						"div",
						{ class: "p-top-l m-left-xl flex-contain flex-center" },
						ObjetTraduction_1.GTraductions.getValeur("Le_Maj"),
						IE.jsx.str(
							"div",
							{ class: "InlineBlock m-left", style: "width: 10rem;" },
							IE.jsx.str("ie-btnselecteur", {
								"aria-label": ObjetTraduction_1.GTraductions.getValeur(
									"punition.fenetreDatePub.Titre",
								),
								"ie-model": "modelSelecteurDatePublication",
							}),
						),
					),
				),
			);
			H.push("</div>");
			H.push("</div>");
		}
		return H.join("");
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			avecComboDuree: function () {
				return (
					aInstance.param &&
					aInstance.param.mesure &&
					aInstance.param.mesure.nature &&
					([
						TypeGenrePunition_1.TypeGenrePunition.GP_Retenues,
						TypeGenrePunition_1.TypeGenrePunition.GP_ExclusionCours,
					].includes(aInstance.param.mesure.nature.getGenre()) ||
						(aInstance.param.mesure.nature.Genre ===
							TypeGenrePunition_1.TypeGenrePunition.GP_Autre &&
							aInstance.param.mesure.nature.estProgrammable))
				);
			},
			avecComboAccompagnateur: function () {
				return (
					aInstance.param &&
					aInstance.param.mesure &&
					aInstance.param.mesure.nature &&
					aInstance.param.mesure.nature.Genre ===
						TypeGenrePunition_1.TypeGenrePunition.GP_ExclusionCours
				);
			},
			avecDossierOrPublie: function () {
				return (
					(aInstance.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.dossierVS.publierDossiersVS,
					) &&
						aInstance.param &&
						aInstance.param.mesure &&
						aInstance.param.avecDossier) ||
					aInstance.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.punition.avecPublicationPunitions,
					)
				);
			},
			avecDossier: function () {
				return (
					aInstance.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.dossierVS.publierDossiersVS,
					) &&
					aInstance.param &&
					aInstance.param.mesure &&
					aInstance.param.avecDossier
				);
			},
			avecDroitPublicationPunition() {
				return aInstance.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.punition.avecPublicationPunitions,
				);
			},
			avecLabel() {
				return aInstance.getLabelDate() !== "";
			},
			getLabel: function () {
				return aInstance.getLabelDate();
			},
			travailAFaire: {
				getValue: function () {
					return aInstance.param && aInstance.param.mesure
						? aInstance.param.mesure.travailAFaire
						: "";
				},
				setValue: function (aValue) {
					aInstance.param.mesure.travailAFaire = aValue;
					aInstance.param.mesure.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
				},
			},
			duree: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						mode: Enumere_Saisie_1.EGenreSaisie.Combo,
						longueur: 50,
						hauteur: 17,
						classTexte: "",
						deroulerListeSeulementSiPlusieursElements: false,
						initAutoSelectionAvecUnElement: false,
					});
				},
				getDonnees: function () {
					if (
						aInstance.param &&
						aInstance.param.mesure &&
						aInstance.param.mesure.nature &&
						aInstance.param.mesure.nature.Genre ===
							TypeGenrePunition_1.TypeGenrePunition.GP_ExclusionCours
					) {
						return aInstance.param.mesure.donneesSaisie.durees;
					} else {
						return aInstance.listeDuree;
					}
				},
				getIndiceSelection: function () {
					return aInstance._indiceDuree;
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aInstance.param.mesure
					) {
						aInstance._indiceDuree = aParametres.indice;
						aInstance.param.mesure.duree = aParametres.element.getGenre();
						aInstance.param.mesure.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					}
				},
				getDisabled: function () {
					return false;
				},
			},
			accompagnateur: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						mode: Enumere_Saisie_1.EGenreSaisie.Combo,
						longueur: 150,
						hauteur: 17,
						classTexte: "",
						deroulerListeSeulementSiPlusieursElements: false,
						initAutoSelectionAvecUnElement: false,
					});
				},
				getDonnees: function () {
					if (
						aInstance.param &&
						aInstance.param.mesure &&
						aInstance.param.mesure.nature &&
						aInstance.param.mesure.nature.Genre ===
							TypeGenrePunition_1.TypeGenrePunition.GP_ExclusionCours
					) {
						return aInstance.param.mesure.donneesSaisie.accompagnateurs;
					}
					return null;
				},
				getIndiceSelection: function () {
					return aInstance._indiceAccompagnateur;
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aInstance.param.mesure
					) {
						aInstance._indiceAccompagnateur = aParametres.indice;
						aInstance.param.mesure.accompagnateur = aParametres.element;
						aInstance.param.mesure.accompagnateur.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
						aInstance.param.mesure.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					}
				},
				getDisabled: function () {
					return false;
				},
			},
			estUneMesureSanction() {
				return (
					aInstance.param &&
					aInstance.param.mesure &&
					aInstance.param.mesure.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.Sanction
				);
			},
			estUneMesurePunition() {
				return (
					aInstance.param &&
					aInstance.param.mesure &&
					aInstance.param.mesure.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.Punition
				);
			},
			imageDossier: function () {
				const lClasses = ["icon_folder_close"];
				if (
					aInstance.param &&
					aInstance.param.mesure &&
					aInstance.param.mesure.publicationDossierVS
				) {
					lClasses.push("mix-icon_ok");
					lClasses.push("i-green");
				} else {
					lClasses.push("mix-icon_remove");
					lClasses.push("i-red");
				}
				return lClasses.join(" ");
			},
			imagePublie: function () {
				const lClasses = ["icon_info_sondage_publier"];
				if (
					aInstance.param &&
					aInstance.param.mesure &&
					aInstance.param.mesure.publication
				) {
					lClasses.push("mix-icon_ok");
					lClasses.push("i-green");
				} else {
					lClasses.push("mix-icon_remove");
					lClasses.push("i-red");
				}
				return lClasses.join(" ");
			},
			publicationDossierVS: {
				getValue: function () {
					return aInstance.param && aInstance.param.mesure
						? aInstance.param.mesure.publicationDossierVS
						: false;
				},
				setValue: function (aValue) {
					aInstance.param.mesure.publicationDossierVS = aValue;
					aInstance.param.mesure.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
				},
				getDisabled: function () {
					return (
						!aInstance.param ||
						!aInstance.param.mesure ||
						!aInstance.param.avecDossier
					);
				},
			},
			cbPublicationSanction: {
				getValue() {
					return aInstance.param && aInstance.param.mesure
						? aInstance.param.mesure.publication
						: false;
				},
				setValue(aValue) {
					aInstance.param.mesure.publication = aValue;
					aInstance.param.mesure.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
				},
			},
			cbPublicationPunition: {
				getValue() {
					const lPunition = aInstance.param ? aInstance.param.mesure : null;
					return aInstance.estPunitionPubliee(lPunition);
				},
				setValue(aValue) {
					const lPunition = aInstance.param ? aInstance.param.mesure : null;
					if (lPunition) {
						let lNouvelleDatePublication = null;
						if (aValue) {
							lNouvelleDatePublication =
								ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.getDatePublicationPunitionParDefaut(
									lPunition.nature,
								);
						}
						aInstance.setDatePublicationPunition(
							lPunition,
							lNouvelleDatePublication,
						);
					}
				},
			},
			getClasseCssImagePublication() {
				const lPunition = aInstance.param ? aInstance.param.mesure : null;
				return ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.getClassesIconePublicationPunition(
					lPunition ? lPunition.datePublication : null,
				);
			},
			getHintImagePublication() {
				const lPunition = aInstance.param ? aInstance.param.mesure : null;
				return ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.getHintPublicationPunition(
					lPunition ? lPunition.datePublication : null,
				);
			},
			modelSelecteurDatePublication: {
				getLibelle() {
					const lStrLibelle = [];
					const lPunition = aInstance.param ? aInstance.param.mesure : null;
					if (aInstance.estPunitionPubliee(lPunition)) {
						lStrLibelle.push(
							ObjetDate_1.GDate.formatDate(
								lPunition.datePublication,
								"%JJ/%MM/%AAAA",
							),
						);
					}
					return lStrLibelle.join("");
				},
				getIcone() {
					return "icon_calendar_empty";
				},
				event() {
					const lPunition = aInstance.param ? aInstance.param.mesure : null;
					if (lPunition) {
						const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_ChoixDatePublicationPunition_1.ObjetFenetre_ChoixDatePublicationPunition,
							{
								pere: aInstance,
								evenement(aNumeroBouton, aDateChoisie) {
									if (aNumeroBouton) {
										aInstance.setDatePublicationPunition(
											lPunition,
											aDateChoisie,
										);
									}
								},
							},
						);
						lFenetre.setDonnees(lPunition.datePublication);
					}
				},
				getDisabled() {
					const lPunition = aInstance.param ? aInstance.param.mesure : null;
					return !aInstance.estPunitionPubliee(lPunition);
				},
			},
			cbTafPublierDebutSeance: {
				getValue() {
					const lPunition = aInstance.param ? aInstance.param.mesure : null;
					return lPunition && lPunition.publierTafApresDebutRetenue;
				},
				setValue(aValue) {
					const lPunition = aInstance.param ? aInstance.param.mesure : null;
					if (lPunition) {
						lPunition.publierTafApresDebutRetenue = aValue;
						aInstance.param.mesure.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					}
				},
				getDisplay() {
					const lPunition = aInstance.param ? aInstance.param.mesure : null;
					return (
						lPunition &&
						lPunition.nature &&
						lPunition.nature.getGenre() ===
							TypeGenrePunition_1.TypeGenrePunition.GP_Retenues
					);
				},
			},
		});
	}
	getLabelDate() {
		let lLibelle = "";
		if (this.param && this.param.mesure && this.param.mesure.nature) {
			lLibelle = this.param.mesure.nature.getLibelle() + "&nbsp;";
			switch (this.param.mesure.nature.getGenre()) {
				case TypeGenrePunition_1.TypeGenrePunition.GP_Devoir:
					lLibelle =
						lLibelle +
						ObjetTraduction_1.GTraductions.getValeur(
							"fenetreSaisiePunition.aRendreMin",
						) +
						"&nbsp;";
					break;
				case TypeGenrePunition_1.TypeGenrePunition.GP_ExclusionCours:
				case TypeGenrePunition_1.TypeGenrePunition.GP_Retenues:
					lLibelle =
						lLibelle +
						ObjetTraduction_1.GTraductions.getValeur("De").toLowerCase() +
						"&nbsp;";
					break;
				case TypeGenrePunition_1.TypeGenrePunition.GP_Autre:
					if (this.param.mesure.nature.estProgrammable) {
						lLibelle =
							lLibelle +
							ObjetTraduction_1.GTraductions.getValeur("De").toLowerCase() +
							"&nbsp;";
					} else {
						return "";
					}
					break;
			}
		}
		return lLibelle;
	}
	estPunitionPubliee(aPunition) {
		return !!(aPunition === null || aPunition === void 0
			? void 0
			: aPunition.datePublication);
	}
	setDatePublicationPunition(aPunition, aDatePublication) {
		aPunition.datePublication = aDatePublication;
		aPunition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
	}
	_initSelecteurDate(aInstance) {
		aInstance.setOptionsObjetCelluleDate({
			classeCSSTexte: " ",
			ariaLabelledBy: this.idLabelDate,
		});
		aInstance.setControleNavigation(false);
		aInstance.setVisible(false);
	}
	_evntSurDate(aDate) {
		this.param.mesure.dateProgrammation = aDate;
		this.param.mesure.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
	}
	_initSelecteurPJ(aInstance) {
		aInstance.setOptions({
			genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
			genreRessourcePJ: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
			interdireDoublonsLibelle: false,
			maxFiles: 0,
			maxSize: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
			),
		});
	}
	_evntSelecteurPJ(aParam) {
		switch (aParam.evnt) {
			case ObjetSelecteurPJCP_1.ObjetSelecteurPJCP.genreEvnt.selectionPJ:
				this.param.listePJ.addElement(aParam.fichier);
				this.setEtatSaisie(true);
				break;
			case ObjetSelecteurPJCP_1.ObjetSelecteurPJCP.genreEvnt.suppressionPJ:
				aParam.fichier.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.setEtatSaisie(true);
				break;
		}
	}
	_composeTitreSection(aMessage, aAvecMargeHaut = false, aIETexte, aIEDisplay) {
		const T = [];
		const lIEDisplay = aIEDisplay ? 'ie-display="' + aIEDisplay + '" ' : "";
		T.push(
			"<div ",
			lIEDisplay,
			'class="NoWrap',
			aAvecMargeHaut ? " EspaceHaut" : "",
			'" style="',
			ObjetStyle_2.GStyle.composeWidth("100%"),
			'">',
		);
		T.push(
			'<div class="InlineBlock AlignementHaut Texte10 Gras PetitEspaceBas"',
			!!aIETexte ? ' ie-texte="' + aIETexte + '"' : "",
			' style="width : calc(100% - 7px); padding-top: 2px;',
			ObjetStyle_2.GStyle.composeCouleurBordure(
				GCouleur.bordure,
				1,
				ObjetStyle_1.EGenreBordure.bas,
			),
			'">',
			aMessage,
			"</div>",
		);
		T.push("</div>");
		return T.join("");
	}
}
exports.ObjetFenetre_MesureIncident = ObjetFenetre_MesureIncident;
