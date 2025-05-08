const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { tag } = require("tag.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { GUID } = require("GUID.js");
const { UtilitaireDocument } = require("UtilitaireDocument.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const {
	TypeConsultationDocumentCasier,
} = require("TypeConsultationDocumentCasier.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GDate } = require("ObjetDate.js");
const EGenreEvenementDepotDoc = {
	surSelectionRessource: "surSelectionRessource",
	ajoutDocument: "ajoutDocument",
	editionDocument: "editionDocument",
	renommerDocument: "renommerDocument",
	supprimerDocument: "supprimerDocument",
	apresDepotDocument: "apresDepotDocument",
};
class ObjetFenetre_DepotDocument extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.id = {
			ctnPieceJointe: GUID.getId(),
			selecteurPJ: GUID.getId(),
			champsObligatoire: GUID.getId(),
			labelComboCategories: GUID.getId(),
		};
		this.setOptionsFenetre({
			avecTailleSelonContenu: true,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
			],
			titre: GTraductions.getValeur("Casier.diffuserDocument"),
		});
		this.optionsDepot = {
			callbackApresDepot: false,
			genreSaisie: EGenreEtat.Modification,
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			selecteurPJ: {
				event() {
					aInstance.surDeposerNouveau();
				},
				getOptionsSelecFile() {
					return UtilitaireDocument.getOptionsSelecFile();
				},
				addFiles: function (aParams) {
					if (aParams.eltFichier) {
						aInstance.evenementSurDeposerNouveau(aParams);
					}
				},
				getIcone() {
					return `<i class="icon_piece_jointe"></i>`;
				},
				getLibelle() {
					return (
						GTraductions.getValeur("FenetreSuiviStage.AjouterPieceJointe") +
						" *"
					);
				},
				getClass() {
					return _isDisabledPJ.call(aInstance) ? "is-disabled" : "AvecMain";
				},
				getAttr() {
					return { "aria-disabled": _isDisabledPJ.call(aInstance) };
				},
				getDisabled() {
					return _isDisabledPJ.call(aInstance);
				},
			},
			documentCasier() {
				if (
					aInstance &&
					aInstance.document &&
					aInstance.document.getLibelle().length > 0
				) {
					return tag(
						"div",
						{ id: aInstance.id.ctnPieceJointe },
						UtilitaireUrl.construireListeUrls(
							new ObjetListeElements().add(aInstance.document),
							{ IEModelChips: "chipsPJ", class: "ie-ellipsis" },
						),
					);
				}
				return "";
			},
			chipsPJ: {
				eventBtn: function () {
					aInstance.documentJoint = null;
					aInstance.document.documentCasier = null;
					aInstance.document.Libelle = "";
				}.bind(aInstance),
			},
			btnRename: {
				event() {
					aInstance.callback.appel({
						genreEvenement: EGenreEvenementDepotDoc.renommerDocument,
						article: aInstance.document,
					});
				},
				getDisabled() {
					return !_isDisabledPJ.call(aInstance);
				},
				if() {
					const lEstPasUnDocumentCloud =
						aInstance.document &&
						aInstance.document.documentCasier &&
						aInstance.document.documentCasier.Genre !==
							EGenreDocumentJoint.Cloud;
					return _isDisabledPJ.call(aInstance) && lEstPasUnDocumentCloud;
				},
			},
			comboCategories: {
				init(aCombo) {
					aCombo.setOptionsObjetSaisie({
						labelledById: aInstance.id.labelComboCategories,
						required: true,
						getContenuElement: function (aParams) {
							const T = [];
							T.push(
								`<div class="libelle ie-line-color left" style="--color-line:${aParams.element.couleur}">${aParams.element.getLibelle()}</div>`,
							);
							return T.join("");
						},
					});
					aCombo.setDonneesObjetSaisie({
						options: {
							largeur: 120,
							placeHolder: GTraductions.getValeur("Casier.choisirUneCategorie"),
						},
					});
				},
				getDonnees() {
					if (aInstance.listeCategories) {
						return aInstance.listeCategories;
					}
				},
				event(aParam) {
					if (
						aParam.genreEvenement === EGenreEvenementObjetSaisie.selection &&
						aParam.element
					) {
						aInstance.document.categorie = aParam.element;
					}
				},
				getIndiceSelection() {
					let lIndice = -1;
					if (aInstance && aInstance.document && aInstance.document.categorie) {
						const lResult = aInstance.listeCategories.getIndiceElementParFiltre(
							(aElement) =>
								aElement.getNumero() ===
								aInstance.document.categorie.getNumero(),
						);
						if (lResult >= 0) {
							lIndice = lResult;
						}
					}
					return lIndice;
				},
			},
			inputMemo: {
				getValue() {
					return aInstance.document ? aInstance.document.memo : "";
				},
				setValue(aValue) {
					aInstance.document.memo = aValue;
				},
			},
			selecteurPersonnels: {
				getIcone() {
					if (aInstance.document.avecEnvoiGroupePersonnel) {
						return tag("i", {
							class: "icon_group",
							"ie-hint": GTraductions.getValeur(
								"Casier.deposeNouveauPersonnel",
							),
						});
					} else {
						return tag("i", { class: "icon_ul" });
					}
				},
				event() {
					aInstance.callback.appel({
						genreEvenement: EGenreEvenementDepotDoc.surSelectionRessource,
						genreRessource: EGenreRessource.Personnel,
						article: aInstance.document,
						avecDepotGroupe: aInstance.document.avecEnvoiGroupePersonnel,
					});
				},
				getLibelle() {
					if (
						aInstance &&
						aInstance.document &&
						aInstance.document.infoPersonnel > 0
					) {
						return `${GTraductions.getValeur("Casier.personnels")} (${aInstance.document.infoPersonnel})`;
					}
					return "";
				},
			},
			selecteurProfesseurs: {
				getIcone() {
					if (aInstance.document.avecEnvoiGroupeProfesseur) {
						return tag("i", {
							class: "icon_group",
							"ie-hint": GTraductions.getValeur(
								"Casier.deposeNouveauProfesseur",
							),
						});
					} else {
						return tag("i", { class: "icon_ul" });
					}
				},
				event() {
					aInstance.callback.appel({
						genreEvenement: EGenreEvenementDepotDoc.surSelectionRessource,
						genreRessource: EGenreRessource.Enseignant,
						article: aInstance.document,
						avecDepotGroupe: aInstance.document.avecEnvoiGroupeProfesseur,
					});
				},
				getLibelle() {
					if (
						aInstance &&
						aInstance.document &&
						aInstance.document.infoProfesseur > 0
					) {
						return `${GTraductions.getValeur("Casier.professeurs")} (${aInstance.document.infoProfesseur})`;
					}
					return "";
				},
			},
			selecteurMaitreDeStage: {
				getIcone() {
					return tag("i", { class: ["icon_ul"] });
				},
				event() {
					aInstance.callback.appel({
						genreEvenement: EGenreEvenementDepotDoc.surSelectionRessource,
						genreRessource: EGenreRessource.MaitreDeStage,
						article: aInstance.document,
						avecDepotGroupe: aInstance.document.avecEnvoiGroupeMaitreDeStage,
					});
				},
				getLibelle() {
					if (
						aInstance &&
						aInstance.document &&
						aInstance.document.infoMaitreDeStage > 0
					) {
						return `${GTraductions.getValeur("Casier.maitresDeStage")} (${aInstance.document.infoMaitreDeStage})`;
					}
					return "";
				},
				avecSelecteur() {
					return !GEtatUtilisateur.pourPrimaire() && aInstance.estIntervenant();
				},
			},
			selecteurEquipePedagogique: {
				getIcone() {
					return tag("i", { class: ["icon_ul"] });
				},
				event() {
					aInstance.callback.appel({
						genreEvenement: EGenreEvenementDepotDoc.surSelectionRessource,
						genreRessource: EGenreRessource.Classe,
						article: aInstance.document,
						avecDepotGroupe: aInstance.document.avecEnvoiGroupeClasse,
					});
				},
				getLibelle() {
					if (
						aInstance &&
						aInstance.document &&
						aInstance.document.infoEquipePedagogique > 0
					) {
						return `${GTraductions.getValeur("Casier.equipePedagogique")} (${aInstance.document.infoEquipePedagogique})`;
					}
					return "";
				},
			},
			selecteurResponsables: {
				getIcone() {
					if (aInstance.document.avecEnvoiGroupeResponsable) {
						return tag("i", {
							class: "icon_group",
							"ie-hint": GTraductions.getValeur(
								"Casier.deposeNouveauResponsable",
							),
						});
					} else {
						return tag("i", { class: "icon_ul" });
					}
				},
				event() {
					aInstance.callback.appel({
						genreEvenement: EGenreEvenementDepotDoc.surSelectionRessource,
						genreRessource: EGenreRessource.Responsable,
						article: aInstance.document,
						avecDepotGroupe: aInstance.document.avecEnvoiGroupeResponsable,
					});
				},
				getLibelle() {
					if (
						aInstance &&
						aInstance.document &&
						aInstance.document.infoResponsable > 0
					) {
						return `${GTraductions.getValeur("Casier.responsables")} (${aInstance.document.infoResponsable})`;
					}
					return "";
				},
			},
			autorisationModifCB: {
				getValue: function () {
					return (
						aInstance &&
						aInstance.document &&
						aInstance.document.estModifiableParDestinataires
					);
				},
				setValue: function () {
					aInstance.document.estModifiableParDestinataires =
						!aInstance.document.estModifiableParDestinataires;
				},
			},
			estResponsable() {
				return aInstance.estResponsable();
			},
			estIntervenant() {
				return aInstance.estIntervenant();
			},
			supprimer: {
				event() {
					aInstance.callback.appel({
						genreEvenement: EGenreEvenementDepotDoc.supprimerDocument,
						article: aInstance.document,
					});
					aInstance.fermer();
				},
				avecBtn() {
					return (
						aInstance.avecFct &&
						aInstance.avecFct.suppressionDoc &&
						aInstance.optionsDepot.genreSaisie === EGenreEtat.Modification
					);
				},
			},
			selecteurDate: {
				dateDebut() {
					return {
						class: ObjetCelluleDate,
						pere: aInstance,
						start(aInstanceDate) {
							if (aInstanceDate && aInstance.document.dateDebut) {
								aInstanceDate.setDonnees(aInstance.document.dateDebut);
							}
						},
						init(aInstanceDate) {
							aInstance.identDateDebut = aInstanceDate;
							aInstanceDate.setOptionsObjetCelluleDate({
								placeHolder: GTraductions.getValeur("Casier.dateDeDebut"),
								largeurComposant: IE.estMobile ? "" : 100,
							});
							aInstance.initDate(aInstanceDate);
						},
						evenement: aInstance.evenementDateDebut.bind(aInstance),
					};
				},
				dateFin() {
					return {
						class: ObjetCelluleDate,
						pere: aInstance,
						start(aInstanceDate) {
							if (aInstanceDate && aInstance.document.dateFin) {
								aInstanceDate.setDonnees(aInstance.document.dateFin);
							}
						},
						init(aInstanceDate) {
							aInstance.identDateFin = aInstanceDate;
							aInstanceDate.setOptionsObjetCelluleDate({
								placeHolder: GTraductions.getValeur("Casier.dateDeFin"),
								largeurComposant: IE.estMobile ? "" : 100,
							});
							aInstance.initDate(aInstanceDate);
						},
						evenement: aInstance.evenementDateFin.bind(aInstance),
					};
				},
			},
			pourDirecteurCB: {
				avecCB() {
					return GEtatUtilisateur.pourPrimaire() && aInstance.estIntervenant();
				},
				getValue() {
					let lValue = false;
					if (
						aInstance &&
						aInstance.document &&
						"avecEnvoiDirecteur" in aInstance.document
					) {
						lValue = aInstance.document.avecEnvoiDirecteur;
					}
					return lValue;
				},
				setValue() {
					if (
						aInstance &&
						aInstance.document &&
						"avecEnvoiDirecteur" in aInstance.document
					) {
						aInstance.document.avecEnvoiDirecteur =
							!aInstance.document.avecEnvoiDirecteur;
					}
				},
			},
		});
	}
	setDonnees(aParams) {
		this.avecFct = aParams.avecFct;
		this.typeConsultation = aParams.typeConsultation;
		this.documentOriginal = aParams.document;
		this.document = MethodesObjet.dupliquer(aParams.document);
		this.document.setEtat(this.optionsDepot.genreSaisie);
		this.documentJoint = aParams.documentJoint || null;
		this.listeCategories = aParams.listeCategories
			? aParams.listeCategories
			: new ObjetListeElements();
		if (this.optionsDepot.genreSaisie === EGenreEtat.Creation) {
			this.setOptionsFenetre({
				titre: GTraductions.getValeur("Casier.titreFenetreSaisieCreation"),
			});
		}
		if (this.optionsDepot.genreSaisie === EGenreEtat.Modification) {
			this.setOptionsFenetre({
				titre: GTraductions.getValeur("Casier.titreFenetreSaisieEdition"),
			});
		}
		return this;
	}
	surDeposerNouveau(aId) {
		const lOptions = { idCtn: aId };
		const lOptionsFichierCloud = { avecMonoSelection: true };
		if (this.optionsDepot.genreSaisie === EGenreEtat.Modification) {
			const lEstCloud =
				this.documentOriginal.documentCasier.Genre ===
				EGenreDocumentJoint.Cloud;
			const lEstFichier =
				this.documentOriginal.documentCasier.Genre ===
				EGenreDocumentJoint.Fichier;
			lOptions.avecFichierDepuisCloud = lEstCloud;
			lOptions.avecFichierDepuisDocument = lEstFichier;
			if (lEstCloud) {
				lOptions.fenetreFichierCloud = lOptionsFichierCloud;
			}
		} else {
			lOptions.fenetreFichierCloud = lOptionsFichierCloud;
		}
		lOptions.avecFichierDepuisCloud = GEtatUtilisateur.avecCloudDisponibles();
		UtilitaireDocument.ouvrirFenetreChoixTypeDeFichierADeposer.call(
			this,
			this.evenementSurDeposerNouveau.bind(this),
			lOptions,
		);
	}
	setLibelleDocumentCasier(aValue) {
		this.document.documentCasier.setLibelle(aValue);
	}
	setOptionsDepot(aOptionsDepot) {
		Object.assign(this.optionsDepot, aOptionsDepot);
	}
	composeContenu() {
		const H = [];
		H.push(
			`<section class='avec-bordure'>`,
			`<article class="field-contain flex-contain cols">`,
			`<div class="full-width m-bottom">`,
			`<ie-btnselecteur ie-model="selecteurPJ" role="button" class="pj" id="${this.id.selecteurPJ}"`,
			`aria-labelledby="${this.id.champsObligatoire}"`,
			`ie-class="selecteurPJ.getClass" `,
			`tabindex="0" `,
			`ie-attr="selecteurPJ.getAttr" >`,
			`</ie-btnselecteur>`,
			`<div class="pj-liste-conteneur" ie-html="documentCasier"></div>`,
			`</div>`,
			`<div class="flex-contain full-width ${IE.estMobile ? "justify-end" : "justify-start m-top-l"}" ><ie-bouton ie-if="btnRename.if" ie-model="btnRename" class="small-bt themeBoutonNeutre">${GTraductions.getValeur("Casier.renommerLeFichier")}</ie-bouton></div>`,
			`</article>`,
			`<article class="field-contain label-up">`,
			`<label class="fix-bloc only-mobile" id="${this.id.labelComboCategories}">${GTraductions.getValeur("Casier.nature")} * : </label>`,
			`<ie-combo ie-model="comboCategories" class="combo-sans-fleche  ${IE.estMobile ? "full-width" : ""}"></ie-combo>`,
			`</article>`,
			`<article class="field-contain label-up">`,
			`<label class="fix-bloc only-mobile">${GTraductions.getValeur("Casier.Colonne.Memo")} : </label>`,
			`<ie-textareamax ie-model="inputMemo" ${IE.estMobile ? "" : 'style="min-height: 7rem;"'} class="round-style" placeholder="${GTraductions.getValeur("Casier.ajouterUnMemo")}" maxlength="10000" ></ie-textareamax>`,
			`</article>`,
			`<article class="field-contain flex-contain cols label-up">`,
			`<label class="ie-titre-petit" >${GTraductions.getValeur("Casier.destinataires")} : </label>`,
			`<div class="flex-contain cols flex-gap-l">`,
			`<ie-btnselecteur aria-label="${GTraductions.getValeur("Casier.WAI.listeProfesseurs")}" ie-model="selecteurProfesseurs" placeholder="${GTraductions.getValeur("Casier.professeurs")}" ie-if="estIntervenant"></ie-btnselecteur>`,
			`<ie-btnselecteur aria-label="${GTraductions.getValeur("Casier.WAI.listePersonnels")}" ie-model="selecteurPersonnels" placeholder="${GTraductions.getValeur("Casier.personnels")}" ie-if="estIntervenant"></ie-btnselecteur>`,
			`<ie-btnselecteur aria-label="${GTraductions.getValeur("Casier.WAI.listeEquipePedagogique")}" ie-model="selecteurEquipePedagogique" placeholder="${GTraductions.getValeur("Casier.equipePedagogique")}" ie-if="estIntervenant"></ie-btnselecteur>`,
			`<ie-btnselecteur aria-label="${GTraductions.getValeur("Casier.WAI.listeMaitreDeStage")}" ie-model="selecteurMaitreDeStage" placeholder="${GTraductions.getValeur("Casier.maitresDeStage")}" ie-if="selecteurMaitreDeStage.avecSelecteur"></ie-btnselecteur>`,
			`<ie-btnselecteur aria-label="${GTraductions.getValeur("Casier.WAI.listeResponsables")} "ie-model="selecteurResponsables"  placeholder="${GTraductions.getValeur("Casier.responsables")}" ie-if="estResponsable"></ie-btnselecteur>`,
			`<ie-checkbox ie-model="pourDirecteurCB" ie-if="pourDirecteurCB.avecCB" >${GTraductions.getValeur("Casier.ajouterDirecteurDeLEcole")}</ie-checkbox>`,
			`</div>`,
			`</article>`,
			`<article class="field-contain flex-contain cols label-up" ie-if="estResponsable">`,
			`<label class="ie-titre-petit" >${GTraductions.getValeur("Casier.dateDePublication")} : </label>`,
			`<div class="periode-contain ctn-date">`,
			`<div ie-identite="selecteurDate.dateDebut"></div>`,
			`<div ie-identite="selecteurDate.dateFin"></div>`,
			`</div>`,
			`</article>`,
			`<article class="field-contain flex-contain cols label-up">`,
			`<div class="flex-contain m-top-l" ie-if="estIntervenant">`,
			`${IE.estMobile ? '<i class="iconic i-medium icon_pencil theme_color_moyen1 m-right"></i>' : ""}`,
			`<ie-checkbox ie-model="autorisationModifCB" >${GTraductions.getValeur("Casier.AutorisationModification")}</ie-checkbox>`,
			`</div>`,
			`<p class="ie-titre-petit m-top-xl" id="${this.id.champsObligatoire}">* ${GTraductions.getValeur("Casier.champsObligatoire")}</p>`,
			`</article>`,
			`</section>`,
		);
		return H.join("");
	}
	composeBas() {
		const T = [];
		T.push(
			`<div class="compose-bas">`,
			`<ie-btnicon class="icon_trash avecFond i-medium" title="${GTraductions.getValeur("Supprimer")}" ie-if="supprimer.avecBtn" ie-model="supprimer"></ie-btnicon>`,
			`</div>`,
		);
		return T.join("");
	}
	evenementSurDeposerNouveau(aParams) {
		this.document.setLibelle(aParams.eltFichier.getLibelle());
		this.document.documentCasier = aParams.eltFichier;
		this.documentJoint = aParams.eltFichier;
		if (this.optionsDepot.callbackApresDepot) {
			this.callback.appel({
				genreEvenement: EGenreEvenementDepotDoc.apresDepotDocument,
			});
		}
	}
	evenementDateDebut(aDate) {
		_evenementDate.call(this, true, aDate);
	}
	evenementDateFin(aDate) {
		_evenementDate.call(this, false, aDate);
	}
	initDate(aInstanceDate) {
		aInstanceDate.setParametresFenetre(
			window.GParametres.PremierLundi,
			GDate.getJourSuivant(window.GParametres.PremiereDate, -100),
			GDate.getJourSuivant(window.GParametres.DerniereDate, 100),
		);
	}
	surValidation(aGenreBouton) {
		if (aGenreBouton === 1) {
			if (!this.document.categorie || !this.document.documentCasier) {
				let lMessage = "";
				if (!this.document.documentCasier) {
					lMessage = GTraductions.getValeur("Casier.pjObligatoire");
				}
				if (!this.document.categorie) {
					lMessage = GTraductions.getValeur("Casier.categorieObligatoire");
				}
				if (!this.document.categorie && !this.document.documentCasier) {
					lMessage = GTraductions.getValeur("Casier.champsMinimumRequis");
				}
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Information,
					message: lMessage,
				});
				return;
			}
			if (this.optionsDepot.genreSaisie === EGenreEtat.Creation) {
				this.document.setEtat(EGenreEtat.Creation);
				this.callback.appel({
					genreEvenement: EGenreEvenementDepotDoc.ajoutDocument,
					article: this.document,
					documentJoint: this.documentJoint,
					typeConsultation: this.typeConsultation,
				});
			} else if (this.optionsDepot.genreSaisie === EGenreEtat.Modification) {
				this.document.setEtat(EGenreEtat.Modification);
				this.callback.appel({
					genreEvenement: EGenreEvenementDepotDoc.editionDocument,
					articleExistant: this.documentOriginal,
					documentModifie: this.document,
					documentJoint: this.documentJoint,
					typeConsultation: this.typeConsultation,
				});
			}
		}
		this.fermer();
	}
	estResponsable() {
		return (
			this.typeConsultation ===
			TypeConsultationDocumentCasier.CoDC_DepResponsable
		);
	}
	estIntervenant() {
		return (
			this.typeConsultation === TypeConsultationDocumentCasier.CoDC_Depositaire
		);
	}
}
function _isDisabledPJ() {
	return this && this.document && this.document.getLibelle().length > 0;
}
function _evenementDate(aEstDateDebut, aDate) {
	if (aEstDateDebut) {
		this.document.dateDebut = aDate;
		if (
			this.document.dateFin &&
			this.document.dateDebut > this.document.dateFin
		) {
			this.document.dateFin = new Date(this.document.dateDebut);
		}
	} else {
		this.document.dateFin = aDate;
		if (
			this.document.dateDebut &&
			this.document.dateDebut > this.document.dateFin
		) {
			this.document.dateDebut = new Date(this.document.dateFin);
		}
	}
	if (this.document.dateDebut) {
		this.identDateDebut.setDonnees(this.document.dateDebut);
	}
	if (this.document.dateFin) {
		this.identDateFin.setDonnees(this.document.dateFin);
	}
}
module.exports = { ObjetFenetre_DepotDocument, EGenreEvenementDepotDoc };
