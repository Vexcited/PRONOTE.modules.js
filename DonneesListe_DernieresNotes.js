exports.DonneesListe_DernieresNotes = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetElement_1 = require("ObjetElement");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const TypeFichierExterneHttpSco_1 = require("TypeFichierExterneHttpSco");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
class DonneesListe_DernieresNotes extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParamsAffichage) {
		super(aDonnees);
		this.setOptions({ avecBoutonActionLigne: false, avecDeploiement: false });
		this.parametres = {
			avecServices: false,
			afficherMoyenneService: false,
			afficherMoyenneDevoir: false,
			avecDetailService: false,
			avecDetailDevoir: false,
			callbackExecutionQCM: null,
			htmlTotal: "",
		};
		this.setParametres(aParamsAffichage);
		this.moteur = new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
	}
	setParametres(aParams) {
		Object.assign(this.parametres, aParams);
	}
	avecSelection(aParams) {
		if (_estUnService(aParams.article)) {
			return this.parametres.avecDetailService && !!aParams.article.moyEleve;
		}
		return this.parametres.avecDetailDevoir;
	}
	avecEvenementSelectionClick(aParams) {
		return this.avecSelection(aParams);
	}
	avecEvenementSelection(aParams) {
		return this.avecSelection(aParams);
	}
	getVisible(D) {
		return this.parametres.avecServices || !_estUnService(D);
	}
	getTitreZonePrincipale(aParams) {
		const H = [];
		if (!!aParams.article) {
			if (_estUnService(aParams.article)) {
				H.push(
					IE.jsx.str(
						"span",
						{ class: "ie-titre-gros" },
						aParams.article.getLibelle(),
					),
				);
			} else {
				if (
					!this.parametres.avecServices &&
					!!aParams.article.service &&
					aParams.article.service.getLibelle() !== ""
				) {
					H.push(
						IE.jsx.str(
							"div",
							{ class: "ie-ellipsis" },
							aParams.article.service.getLibelle(),
						),
					);
				}
				if (aParams.article.commentaire) {
					H.push(
						IE.jsx.str(
							"div",
							{ class: "ie-ellipsis" },
							aParams.article.commentaire,
						),
					);
				}
			}
		}
		return H.join("");
	}
	getZoneGauche(aParams) {
		const H = [];
		if (!_estUnService(aParams.article)) {
			const lParams = {
				class: ["date-contain"],
				datetime: ObjetDate_1.GDate.formatDate(aParams.article.date, "%MM-%JJ"),
			};
			if (!this.parametres.avecServices) {
				lParams.class.push("ie-line-color left");
				lParams.style = `--color-line :${aParams.article.service.couleur};`;
			}
			H.push(
				IE.jsx.str(
					"time",
					Object.assign({}, lParams),
					ObjetDate_1.GDate.formatDate(aParams.article.date, "%J %MMM"),
				),
			);
		} else {
			H.push(
				IE.jsx.str("span", {
					class: "ie-line-color static only-color var-height",
					style: `--color-line :${aParams.article.couleur}; --var-height:2.2rem;`,
				}),
			);
		}
		return H.join("");
	}
	getInfosSuppZonePrincipale(aParams) {
		const H = [];
		if (!_estUnService(aParams.article)) {
			if (this.parametres.afficherMoyenneDevoir && !!aParams.article.moyenne) {
				let lStrSousTitre = "";
				if (aParams.article.estEnGroupe) {
					lStrSousTitre += ObjetTraduction_1.GTraductions.getValeur(
						"DernieresNotes.Moyenne_groupe",
					);
				} else {
					lStrSousTitre += ObjetTraduction_1.GTraductions.getValeur(
						"DernieresNotes.Moyenne_classe",
					);
				}
				lStrSousTitre += " : ";
				lStrSousTitre += _getLibelleNote({
					note: aParams.article.moyenne,
					bareme: aParams.article.bareme,
					baremeParDefaut: aParams.article.baremeParDefaut,
				});
				H.push(IE.jsx.str("span", { class: "ie-sous-titre" }, lStrSousTitre));
			}
		}
		return H.join("");
	}
	getZoneMessage(aParams) {
		const H = [];
		if (!_estUnService(aParams.article)) {
			H.push(this._composePieceJointeDevoir(aParams.article));
		}
		return H.join("");
	}
	getZoneComplementaire(aParams) {
		const H = [];
		if (_estUnService(aParams.article)) {
			if (
				this.parametres.afficherMoyenneService &&
				(!!aParams.article.moyEleve || aParams.article.estMoyNR === true)
			) {
				const lAvecMoyEleve = !!aParams.article.moyEleve;
				if (lAvecMoyEleve || aParams.article.estMoyNR) {
					H.push('<div class="flex-contain">');
					if (aParams.article.estMoyNR) {
						const lClassMoyNR = [];
						if (lAvecMoyEleve) {
							lClassMoyNR.push("m-right-xl");
						}
						H.push(
							IE.jsx.str(
								"div",
								{ class: lClassMoyNR.join(" ") },
								this.moteur.composeHtmlMoyNR(),
							),
						);
					}
					if (lAvecMoyEleve) {
						H.push(
							IE.jsx.str(
								"div",
								{ class: "ie-titre-gros" },
								_getLibelleNote({
									note: aParams.article.moyEleve,
									baremeParDefaut: aParams.article.baremeMoyEleveParDefaut,
								}),
							),
						);
					}
					H.push("</div>");
				}
			}
		} else {
			H.push('<div class="flex-contain flex-gap flex-center">');
			if (aParams.article.commentaireSurNote) {
				H.push(
					`<i class="icon_comment_vide" ie-tooltiplabel="${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.CommentaireProf")} : ${aParams.article.commentaireSurNote}" role="img"></i>`,
				);
			}
			H.push(
				IE.jsx.str(
					"span",
					{ class: "note-devoir" },
					_getLibelleNote({
						note: aParams.article.note,
						bareme: aParams.article.bareme,
						baremeParDefaut: aParams.article.baremeParDefaut,
						avecIconEtoile: true,
					}),
				),
			);
			H.push("</div>");
		}
		return H.join("");
	}
	getAriaLabelZoneCellule(aParams, aZone) {
		if (
			aZone ===
			ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign
				.ZoneCelluleFlatDesign.zoneComplementaire
		) {
			if (_estUnService(aParams.article)) {
				if (
					this.parametres.afficherMoyenneService &&
					!!aParams.article.moyEleve &&
					!isNaN(aParams.article.moyEleve.getValeur())
				) {
					return `${aParams.article.estMoyNR ? ObjetTraduction_1.GTraductions.getValeur("Notes.Colonne.HintMoyenneNR") : ""} ${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.MoyenneEtudiant")} : ${_getNoteWAI(aParams.article.moyEleve, aParams.article.baremeMoyEleveParDefaut)}`;
				}
			} else {
				return `${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.NoteEtudiant")} : ${_getNoteWAI(aParams.article.note, aParams.article.bareme, aParams.article.baremeParDefaut)}`;
			}
			return "";
		}
	}
	getTotal(aEstHeader) {
		if (
			!aEstHeader &&
			this.parametres.avecServices &&
			this.parametres.htmlTotal
		) {
			return { getHtml: () => this.parametres.htmlTotal, avecEtiquette: false };
		}
	}
	avecSeparateurLigneHautFlatdesign(aParams) {
		return !_estUnService(aParams.article);
	}
	desactiverIndentationParente() {
		return true;
	}
	getTri() {
		const lTris = [];
		if (this.parametres.avecServices) {
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					return _estUnService(D)
						? D.ordre || -1
						: D.service && D.service.ordre
							? D.service.ordre
							: -1;
				}, Enumere_TriElement_1.EGenreTriElement.Croissant),
			);
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					return _estUnService(D)
						? D.getLibelle()
						: D.service
							? D.service.getLibelle()
							: null;
				}, Enumere_TriElement_1.EGenreTriElement.Croissant),
			);
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					return _estUnService(D)
						? D.getNumero()
						: D.service
							? D.service.getNumero()
							: null;
				}),
			);
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					return !_estUnService(D);
				}),
			);
		}
		lTris.push(
			ObjetTri_1.ObjetTri.init(
				"date",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
		);
		lTris.push(ObjetTri_1.ObjetTri.init("service.Libelle"));
		return lTris;
	}
	jsxAfficherCorrigerQCM(aDevoir) {
		return {
			event: () => {
				if (!!this.parametres && !!this.parametres.callbackExecutionQCM) {
					if (IE.estMobile) {
						if (aDevoir && aDevoir.executionQCM) {
							this.parametres.callbackExecutionQCM(aDevoir.executionQCM);
						}
					} else {
						this.parametres.callbackExecutionQCM(aDevoir.executionQCM);
					}
				}
			},
		};
	}
	_composePieceJointeDevoir(aDevoir) {
		const H = [];
		let lDocumentJointSujet, lDocumentJointCorrige, lLienSujet, lLienCorrige;
		if (!!aDevoir.elmSujet) {
			lDocumentJointSujet = aDevoir.elmSujet;
		} else if (!!aDevoir.libelleSujet) {
			lDocumentJointSujet = new ObjetElement_1.ObjetElement(
				aDevoir.libelleSujet,
				aDevoir.getNumero(),
				Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
			);
		}
		if (lDocumentJointSujet) {
			lLienSujet = ObjetChaine_1.GChaine.composerUrlLienExterne({
				documentJoint: lDocumentJointSujet,
				genreRessource:
					TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirSujet,
				libelleEcran: ObjetTraduction_1.GTraductions.getValeur("AfficherSujet"),
				class: "chips-design-liste",
			});
		}
		if (!!aDevoir.elmCorrige) {
			lDocumentJointCorrige = aDevoir.elmCorrige;
		} else if (!!aDevoir.libelleCorrige) {
			lDocumentJointCorrige = new ObjetElement_1.ObjetElement(
				aDevoir.libelleCorrige,
				aDevoir.getNumero(),
				Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
			);
		}
		if (lDocumentJointCorrige) {
			lLienCorrige = ObjetChaine_1.GChaine.composerUrlLienExterne({
				documentJoint: lDocumentJointCorrige,
				genreRessource:
					TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirCorrige,
				libelleEcran:
					ObjetTraduction_1.GTraductions.getValeur("AfficherCorrige"),
				class: "chips-design-liste",
			});
		}
		if (lLienSujet || lLienCorrige) {
			H.push(
				`<div class="flex-contain flex-center flex-gap m-top m-bottom">${lLienSujet || ""} ${lLienCorrige || ""}</div>`,
			);
		}
		if (
			!!aDevoir.executionQCM &&
			!!aDevoir.executionQCM.fichierDispo &&
			!!aDevoir.executionQCM.publierCorrige &&
			this.parametres.callbackExecutionQCM
		) {
			H.push(
				IE.jsx.str(
					"ie-bouton",
					{
						class: "themeBoutonNeutre small-bt bg-white",
						"ie-model": this.jsxAfficherCorrigerQCM.bind(this, aDevoir),
						"aria-haspopup": "dialog",
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"ExecutionQCM.presentationCorrige.VisualiserCorrige",
					),
				),
			);
		}
		return H.join("");
	}
}
exports.DonneesListe_DernieresNotes = DonneesListe_DernieresNotes;
function _estUnService(D) {
	return D.getGenre() === Enumere_Ressource_1.EGenreRessource.Service;
}
function _getLibelleNote(aParams) {
	const lEstBaremeParDefaut =
		!aParams.bareme ||
		!aParams.baremeParDefaut ||
		(aParams.bareme &&
			aParams.baremeParDefaut &&
			aParams.bareme.getValeur() === aParams.baremeParDefaut.getValeur());
	const lNoteAuDessusBareme =
		aParams.note &&
		aParams.bareme &&
		aParams.note.getValeur() > aParams.bareme.getValeur();
	const H = [];
	if (lNoteAuDessusBareme && aParams.avecIconEtoile) {
		H.push(
			'<i class="m-right-l icon_star" role="img" aria-label="' +
				ObjetTraduction_1.GTraductions.getValeur("accueil.noteAuDessusBareme") +
				'" title="' +
				ObjetTraduction_1.GTraductions.getValeur("accueil.noteAuDessusBareme") +
				'"></i>',
		);
	}
	if (aParams.note && aParams.note.getNote()) {
		H.push(aParams.note.getNote());
	}
	if (!lEstBaremeParDefaut || lNoteAuDessusBareme) {
		H.push("<span>" + aParams.bareme.getBaremeEntier() + "</span>");
	}
	return H.join("");
}
function _getNoteWAI(aNote, aBareme, aBaremeParDefaut) {
	const lEstBaremeParDefaut =
		!aBareme ||
		!aBaremeParDefaut ||
		(aBareme &&
			aBaremeParDefaut &&
			aBareme.getValeur() === aBaremeParDefaut.getValeur());
	const lNoteAuDessusBareme =
		aNote && aBareme && aNote.getValeur() > aBareme.getValeur();
	const H = [];
	if (aNote && aNote.getNote()) {
		H.push(aNote.getNote());
	}
	if (!lEstBaremeParDefaut || lNoteAuDessusBareme) {
		H.push(aBareme.getBaremeEntier());
	}
	return H.join("");
}
