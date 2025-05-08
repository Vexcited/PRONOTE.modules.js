const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreBordure } = require("ObjetStyle.js");
const { GUID } = require("GUID.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EGenreSaisie } = require("Enumere_Saisie.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeGenrePunition } = require("TypeGenrePunition.js");
const { ObjetSelecteurPJ } = require("ObjetSelecteurPJ.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetSelecteurPJCP } = require("ObjetSelecteurPJCP.js");
const { ObjetUtilitaireAbsence } = require("ObjetUtilitaireAbsence.js");
const {
	ObjetFenetre_ChoixDatePublicationPunition,
} = require("ObjetFenetre_ChoixDatePublicationPunition.js");
class ObjetFenetre_MesureIncident extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.idSectionDate = GUID.getId();
		this._options = {};
		this.listePJ = new ObjetListeElements();
	}
	setOptions(aOptions) {
		$.extend(this._options, aOptions);
	}
	construireInstances() {
		this.identDate = this.add(
			ObjetCelluleDate,
			_evntSurDate.bind(this),
			_initDate.bind(this),
		);
		this.identSelecteurPJ = this.add(
			ObjetSelecteurPJ,
			_evntSelecteurPJ.bind(this),
			_initSelecteurPJ.bind(this),
		);
	}
	setDonnees(aParam) {
		this.paramOriginel = aParam;
		this.param = MethodesObjet.dupliquer(aParam);
		if (this.param && this.param.mesure) {
			this.listeDuree = new ObjetListeElements();
			for (let i = 0; i <= 10; i++) {
				const lLibelle =
					i === 0
						? "&nbsp;"
						: GDate.formatDureeEnMillisecondes(30 * i * 60 * 1000, "%xh%sh%mm");
				this.listeDuree.addElement(new ObjetElement(lLibelle, null, i * 30));
			}
			this._indiceDuree = 0;
			if (this.param.mesure.duree > 0) {
				const lListe =
					this.param.mesure.nature.getGenre() ===
					TypeGenrePunition.GP_ExclusionCours
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
			this.setOptionsFenetre({ titre: this.param.titre });
			const lListePJ = this.param.mesure.documentsTAF
				? this.param.mesure.documentsTAF
				: new ObjetListeElements();
			this.getInstance(this.identSelecteurPJ).setActif(true);
			this.getInstance(this.identSelecteurPJ).setOptions({
				genreRessourcePJ: EGenreRessource.DocJointEleve,
			});
			this.getInstance(this.identSelecteurPJ).setDonnees({
				listePJ: lListePJ,
				listeTotale: new ObjetListeElements(),
				idContextFocus: this.Nom,
			});
			if (
				this.param.mesure.nature &&
				this.param.mesure.nature.getGenre() === TypeGenrePunition.GP_Devoir
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
	fermer(aParam) {
		super.fermer(aParam);
	}
	surValidation(aGenreBouton) {
		this.fermer();
		this.callback.appel(aGenreBouton, this.param);
	}
	composeContenu() {
		const H = [];
		H.push(
			_composeTitreSection(
				GTraductions.getValeur("fenetreSaisiePunition.suiteDonnee"),
			),
		);
		H.push('<div class="NoWrap EspaceGauche">');
		H.push(
			'<div class="InlineBlock AlignementMilieuVertical"><label class="Texte10" ie-html="getLabel"></label></div>',
		);
		H.push(
			'<div id="',
			this.idSectionDate,
			'" class="InlineBlock AlignementMilieuVertical EspaceDroit"><div id="',
			this.getNomInstance(this.identDate),
			'"></div></div>',
		);
		H.push(
			'<div ie-if="avecComboDuree" class="InlineBlock AlignementMilieuVertical EspaceDroit"><ie-combo ie-model="duree"></ie-combo></div>',
		);
		H.push(
			'<div ie-if="avecComboAccompagnateur" class="InlineBlock AlignementMilieuVertical EspaceDroit"><label class="Texte10">',
			GTraductions.getValeur("incidents.accompagnateur"),
			"</label></div>",
		);
		H.push(
			'<div ie-if="avecComboAccompagnateur" class="InlineBlock AlignementMilieuVertical"><ie-combo ie-model="accompagnateur"></ie-combo></div>',
		);
		H.push("</div>");
		H.push(
			'<div class="EspaceHaut EspaceGauche"><label>',
			GTraductions.getValeur("fenetreSaisiePunition.taf"),
			"</label><br>",
			'<textarea ie-model="travailAFaire" class="Texte10 CelluleTexte FondBlanc round-style" style="',
			GStyle.composeWidth(380),
			GStyle.composeHeight(70),
			'"></textarea></div>',
		);
		H.push(
			'<div class="m-top m-left" id="' +
				this.getInstance(this.identSelecteurPJ).getNom() +
				'"></div>',
		);
		H.push(
			'<div><ie-checkbox class="m-top m-left" ie-model="cbTafPublierDebutSeance" ie-display="cbTafPublierDebutSeance.getDisplay">',
			GTraductions.getValeur("punition.publierUniquementDebutRetenue"),
			"</ie-checkbox>",
		);
		if (
			GApplication.droits.get(TypeDroits.punition.avecPublicationPunitions) ||
			GApplication.droits.get(TypeDroits.dossierVS.publierDossiersVS)
		) {
			H.push(
				_composeTitreSection(
					GTraductions.getValeur("fenetreSaisiePunition.prevenirResponsables"),
					true,
					null,
					"avecDossierOrPublie",
				),
			);
			H.push('<div class="EspaceGauche">');
			H.push(
				'<div ie-if="avecDossier" class="EspaceHaut NoWrap"><div class="InlineBlock AlignementMilieuVertical EspaceDroit" style="min-width: 435px;"><ie-checkbox ie-model="publicationDossierVS">',
				GTraductions.getValeur(
					"fenetreSaisiePunition.publierElementPunitionDossier",
				),
				'</ie-checkbox></div><i ie-class="imageDossier"></i></div>',
			);
			H.push(
				'<div ie-if="avecDroitPublicationPunition" class="EspaceHaut NoWrap">',
			);
			H.push(
				'<div ie-if="estUneMesureSanction" style="min-width: 435px;">',
				'<div class="InlineBlock"><ie-checkbox ie-model="cbPublicationSanction">',
				GTraductions.getValeur("fenetreSaisiePunition.publierPunition"),
				"</ie-checkbox></div>",
				'<div class="InlineBlock AlignementMilieuVertical"><i ie-class="imagePublie"></i></div>',
				"</div>",
			);
			H.push(
				'<div ie-if="estUneMesurePunition" style="min-width: 435px;">',
				'<div class="flex-contain flex-gap-l">',
				'<ie-checkbox ie-model="cbPublicationPunition">',
				GTraductions.getValeur("fenetreSaisiePunition.publierPunition"),
				"</ie-checkbox>",
				'<i ie-class="getClasseCssImagePublication" ie-hint="getHintImagePublication"></i>',
				"</div>",
				'<div class="p-top-l m-left-xl">',
				GTraductions.getValeur("Le_Maj"),
				'<div class="InlineBlock m-left" style="width: 10rem;">',
				'<ie-btnselecteur ie-model="modelSelecteurDatePublication"></ie-btnselecteur>',
				"</div>",
				"</div>",
				"</div>",
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
						TypeGenrePunition.GP_Retenues,
						TypeGenrePunition.GP_ExclusionCours,
					].includes(aInstance.param.mesure.nature.Genre) ||
						(aInstance.param.mesure.nature.Genre ===
							TypeGenrePunition.GP_Autre &&
							aInstance.param.mesure.nature.estProgrammable))
				);
			},
			avecComboAccompagnateur: function () {
				return (
					aInstance.param &&
					aInstance.param.mesure &&
					aInstance.param.mesure.nature &&
					aInstance.param.mesure.nature.Genre ===
						TypeGenrePunition.GP_ExclusionCours
				);
			},
			avecDossierOrPublie: function () {
				return (
					(GApplication.droits.get(TypeDroits.dossierVS.publierDossiersVS) &&
						aInstance.param &&
						aInstance.param.mesure &&
						aInstance.param.avecDossier) ||
					GApplication.droits.get(TypeDroits.punition.avecPublicationPunitions)
				);
			},
			avecDossier: function () {
				return (
					GApplication.droits.get(TypeDroits.dossierVS.publierDossiersVS) &&
					aInstance.param &&
					aInstance.param.mesure &&
					aInstance.param.avecDossier
				);
			},
			avecDroitPublicationPunition() {
				return GApplication.droits.get(
					TypeDroits.punition.avecPublicationPunitions,
				);
			},
			getLabel: function () {
				let lLibelle = "";
				if (
					aInstance.param &&
					aInstance.param.mesure &&
					aInstance.param.mesure.nature
				) {
					lLibelle = aInstance.param.mesure.nature.getLibelle() + "&nbsp;";
					switch (aInstance.param.mesure.nature.getGenre()) {
						case TypeGenrePunition.GP_Devoir:
							lLibelle =
								lLibelle +
								GTraductions.getValeur("fenetreSaisiePunition.aRendreMin") +
								"&nbsp;";
							break;
						case TypeGenrePunition.GP_ExclusionCours:
						case TypeGenrePunition.GP_Retenues:
							lLibelle =
								lLibelle +
								GTraductions.getValeur("De").toLowerCase() +
								"&nbsp;";
							break;
						case TypeGenrePunition.GP_Autre:
							if (aInstance.param.mesure.nature.estProgrammable) {
								lLibelle =
									lLibelle +
									GTraductions.getValeur("De").toLowerCase() +
									"&nbsp;";
							} else {
								return "";
							}
							break;
						default:
							break;
					}
				}
				return lLibelle;
			},
			travailAFaire: {
				getValue: function () {
					return aInstance.param && aInstance.param.mesure
						? aInstance.param.mesure.travailAFaire
						: "";
				},
				setValue: function (aValue) {
					aInstance.param.mesure.travailAFaire = aValue;
					aInstance.param.mesure.setEtat(EGenreEtat.Modification);
				},
			},
			duree: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						mode: EGenreSaisie.Combo,
						longueur: 50,
						hauteur: 17,
						classTexte: "",
						deroulerListeSeulementSiPlusieursElements: false,
						initAutoSelectionAvecUnElement: false,
					});
					aInstance.combo = aCombo;
				},
				getDonnees: function () {
					if (
						aInstance.param &&
						aInstance.param.mesure &&
						aInstance.param.mesure.nature &&
						aInstance.param.mesure.nature.Genre ===
							TypeGenrePunition.GP_ExclusionCours
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
							EGenreEvenementObjetSaisie.selection &&
						aInstance.param.mesure
					) {
						aInstance._indiceDuree = aParametres.indice;
						aInstance.param.mesure.duree = aParametres.element.getGenre();
						aInstance.param.mesure.setEtat(EGenreEtat.Modification);
					}
				},
				getDisabled: function () {
					return false;
				},
			},
			accompagnateur: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						mode: EGenreSaisie.Combo,
						longueur: 150,
						hauteur: 17,
						classTexte: "",
						deroulerListeSeulementSiPlusieursElements: false,
						initAutoSelectionAvecUnElement: false,
					});
					aInstance.comboAcc = aCombo;
				},
				getDonnees: function () {
					return aInstance.param.mesure.donneesSaisie.accompagnateurs;
				},
				getIndiceSelection: function () {
					return aInstance._indiceAccompagnateur;
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							EGenreEvenementObjetSaisie.selection &&
						aInstance.param.mesure
					) {
						aInstance._indiceAccompagnateur = aParametres.indice;
						aInstance.param.mesure.accompagnateur = aParametres.element;
						aInstance.param.mesure.accompagnateur.setEtat(
							EGenreEtat.Modification,
						);
						aInstance.param.mesure.setEtat(EGenreEtat.Modification);
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
					aInstance.param.mesure.getGenre() === EGenreRessource.Sanction
				);
			},
			estUneMesurePunition() {
				return (
					aInstance.param &&
					aInstance.param.mesure &&
					aInstance.param.mesure.getGenre() === EGenreRessource.Punition
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
					aInstance.param.mesure.setEtat(EGenreEtat.Modification);
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
					aInstance.param.mesure.setEtat(EGenreEtat.Modification);
				},
			},
			cbPublicationPunition: {
				getValue() {
					const lPunition = aInstance.param ? aInstance.param.mesure : null;
					return estPunitionPubliee(lPunition);
				},
				setValue(aValue) {
					const lPunition = aInstance.param ? aInstance.param.mesure : null;
					if (lPunition) {
						let lNouvelleDatePublication = null;
						if (aValue) {
							lNouvelleDatePublication =
								ObjetUtilitaireAbsence.getDatePublicationPunitionParDefaut(
									lPunition.nature,
								);
						}
						setDatePublicationPunition.call(
							aInstance,
							lPunition,
							lNouvelleDatePublication,
						);
					}
				},
			},
			getClasseCssImagePublication() {
				const lPunition = aInstance.param ? aInstance.param.mesure : null;
				return ObjetUtilitaireAbsence.getClassesIconePublicationPunition(
					lPunition ? lPunition.datePublication : null,
				);
			},
			getHintImagePublication() {
				const lPunition = aInstance.param ? aInstance.param.mesure : null;
				return ObjetUtilitaireAbsence.getHintPublicationPunition(
					lPunition ? lPunition.datePublication : null,
				);
			},
			modelSelecteurDatePublication: {
				getLibelle() {
					const lStrLibelle = [];
					const lPunition = aInstance.param ? aInstance.param.mesure : null;
					if (estPunitionPubliee(lPunition)) {
						lStrLibelle.push(
							GDate.formatDate(lPunition.datePublication, "%JJ/%MM/%AAAA"),
						);
					}
					return lStrLibelle.join("");
				},
				getIcone() {
					return '<i class="icon_calendar_empty"></i>';
				},
				event() {
					const lPunition = aInstance.param ? aInstance.param.mesure : null;
					if (lPunition) {
						const lFenetre = ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_ChoixDatePublicationPunition,
							{
								pere: aInstance,
								evenement(aNumeroBouton, aDateChoisie) {
									if (aNumeroBouton) {
										setDatePublicationPunition.call(
											aInstance,
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
					return !estPunitionPubliee(lPunition);
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
						aInstance.param.mesure.setEtat(EGenreEtat.Modification);
					}
				},
				getDisplay() {
					const lPunition = aInstance.param ? aInstance.param.mesure : null;
					return (
						lPunition &&
						lPunition.nature &&
						lPunition.nature.getGenre() === TypeGenrePunition.GP_Retenues
					);
				},
			},
		});
	}
}
function estPunitionPubliee(aPunition) {
	return aPunition && aPunition.datePublication;
}
function setDatePublicationPunition(aPunition, aDatePublication) {
	aPunition.datePublication = aDatePublication;
	aPunition.setEtat(EGenreEtat.Modification);
}
function _initDate(aInstance) {
	aInstance.setOptionsObjetCelluleDate({ classeCSSTexte: " " });
	aInstance.setControleNavigation(false);
	aInstance.setVisible(false);
}
function _evntSurDate(aDate) {
	this.param.mesure.dateProgrammation = aDate;
	this.param.mesure.setEtat(EGenreEtat.Modification);
}
function _initSelecteurPJ(aInstance) {
	aInstance.setOptions({
		genrePJ: EGenreDocumentJoint.Fichier,
		genreRessourcePJ: EGenreRessource.DocJointEleve,
		interdireDoublonsLibelle: false,
		maxFiles: 0,
		maxSize: GApplication.droits.get(TypeDroits.tailleMaxDocJointEtablissement),
	});
}
function _evntSelecteurPJ(aParam) {
	switch (aParam.evnt) {
		case ObjetSelecteurPJCP.genreEvnt.selectionPJ:
			this.Pere.listePJ.addElement(aParam.fichier);
			this.setEtatSaisie(true);
			break;
		case ObjetSelecteurPJCP.genreEvnt.suppressionPJ:
			aParam.fichier.setEtat(EGenreEtat.Modification);
			this.setEtatSaisie(true);
			break;
		default:
			break;
	}
}
function _composeTitreSection(aMessage, aAvecMargeHaut, aIETexte, aIEDisplay) {
	const T = [];
	const lIEDisplay = aIEDisplay ? 'ie-display="' + aIEDisplay + '" ' : "";
	T.push(
		"<div ",
		lIEDisplay,
		'class="NoWrap',
		aAvecMargeHaut ? " EspaceHaut" : "",
		'" style="',
		GStyle.composeWidth("100%"),
		'">',
	);
	T.push(
		'<div class="InlineBlock AlignementHaut" style="',
		GStyle.composeWidth(7),
		'"><ul style="padding: 0px; margin: 0px;"><li style="list-style-position: inside; padding: 0px 0px 0px 0px;">&nbsp',
		"</li></ul></div>",
	);
	T.push(
		'<div class="InlineBlock AlignementHaut Texte10 Gras PetitEspaceBas"',
		!!aIETexte ? ' ie-texte="' + aIETexte + '"' : "",
		' style="width : calc(100% - 7px); padding-top: 2px;',
		GStyle.composeCouleurBordure(GCouleur.bordure, 1, EGenreBordure.bas),
		'">',
		aMessage,
		"</div>",
	);
	T.push("</div>");
	return T.join("");
}
module.exports = { ObjetFenetre_MesureIncident };
