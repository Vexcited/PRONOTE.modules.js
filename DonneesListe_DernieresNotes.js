const { GChaine } = require("ObjetChaine.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { GDate } = require("ObjetDate.js");
const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetElement } = require("ObjetElement.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { TypeFichierExterneHttpSco } = require("TypeFichierExterneHttpSco.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { tag } = require("tag.js");
class DonneesListe_DernieresNotes extends ObjetDonneesListeFlatDesign {
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
		this.moteur = new ObjetMoteurReleveBulletin();
	}
	setParametres(aParams) {
		Object.assign(this.parametres, aParams);
	}
	getControleur(aDonneesListe, aListe) {
		return $.extend(true, super.getControleur(aDonneesListe, aListe), {
			afficherCorrigerQCM: {
				event: function (aNumero, aGenre) {
					if (
						!!aDonneesListe.parametres &&
						!!aDonneesListe.parametres.callbackExecutionQCM
					) {
						if (IE.estMobile) {
							const lDevoir = aDonneesListe.Donnees.getElementParNumeroEtGenre(
								aNumero,
								aGenre,
							);
							if (lDevoir && lDevoir.executionQCM) {
								aDonneesListe.parametres.callbackExecutionQCM(
									lDevoir.executionQCM,
								);
							}
						} else {
							aDonneesListe.parametres.callbackExecutionQCM(aNumero, aGenre);
						}
					}
				},
			},
		});
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
					tag("span", { class: "ie-titre-gros" }, aParams.article.getLibelle()),
				);
			} else {
				if (
					!this.parametres.avecServices &&
					!!aParams.article.service &&
					aParams.article.service.getLibelle() !== ""
				) {
					H.push(
						tag(
							"div",
							{ class: "ie-ellipsis" },
							aParams.article.service.getLibelle(),
						),
					);
				}
				if (aParams.article.commentaire) {
					H.push(
						tag("div", { class: "ie-ellipsis" }, aParams.article.commentaire),
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
				datetime: GDate.formatDate(aParams.article.date, "%MM-%JJ"),
			};
			if (!this.parametres.avecServices) {
				lParams.class.push("ie-line-color bottom");
				lParams.style = `--color-line :${aParams.article.service.couleur};`;
			}
			H.push(
				tag("time", lParams, GDate.formatDate(aParams.article.date, "%J %MMM")),
			);
		} else {
			H.push(
				tag("span", {
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
				H.push(
					tag(
						"span",
						{ class: "ie-sous-titre" },
						`${aParams.article.estEnGroupe ? GTraductions.getValeur("DernieresNotes.Moyenne_groupe") : GTraductions.getValeur("DernieresNotes.Moyenne_classe")} : ${_getLibelleNote({ note: aParams.article.moyenne, barem: aParams.article.bareme, baremParDefaut: aParams.article.baremeParDefaut })}`,
					),
				);
			}
		}
		return H.join("");
	}
	getZoneMessage(aParams) {
		const H = [];
		if (!_estUnService(aParams.article)) {
			H.push(_composePieceJointeDevoir.call(this, aParams.article));
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
						H.push(
							tag(
								"div",
								{ class: lAvecMoyEleve ? "m-right-xl" : "" },
								this.moteur.composeHtmlMoyNR(),
							),
						);
					}
					if (lAvecMoyEleve) {
						H.push(
							tag(
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
					`<i class="icon_comment_vide" ie-hint="${GTraductions.getValeur("Notes.remarque")} : ${aParams.article.commentaireSurNote}" ></i>`,
				);
			}
			H.push(
				tag(
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
			ObjetDonneesListeFlatDesign.ZoneCelluleFlatDesign.zoneComplementaire
		) {
			if (_estUnService(aParams.article)) {
				if (
					this.parametres.afficherMoyenneService &&
					!!aParams.article.moyEleve &&
					!isNaN(aParams.article.moyEleve.getValeur())
				) {
					return `${aParams.article.estMoyNR ? GTraductions.getValeur("Notes.Colonne.HintMoyenneNR") : ""} ${GTraductions.getValeur("DernieresNotes.Detail.MoyenneEtudiant")} : ${_getNoteWAI(aParams.article.moyEleve, aParams.article.baremeMoyEleveParDefaut)}`;
				}
			} else {
				return `${GTraductions.getValeur("DernieresNotes.Detail.NoteEtudiant")} : ${_getNoteWAI(aParams.article.note, aParams.article.bareme, aParams.article.baremeParDefaut)}`;
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
			return { html: this.parametres.htmlTotal, avecEtiquettte: false };
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
				ObjetTri.init((D) => {
					return _estUnService(D)
						? D.ordre || -1
						: D.service && D.service.ordre
							? D.service.ordre
							: -1;
				}, EGenreTriElement.Croissant),
			);
			lTris.push(
				ObjetTri.init((D) => {
					return _estUnService(D)
						? D.getLibelle()
						: D.service
							? D.service.getLibelle()
							: null;
				}, EGenreTriElement.Croissant),
			);
			lTris.push(
				ObjetTri.init((D) => {
					return _estUnService(D)
						? D.getNumero()
						: D.service
							? D.service.getNumero()
							: null;
				}),
			);
			lTris.push(
				ObjetTri.init((D) => {
					return !_estUnService(D);
				}),
			);
		}
		lTris.push(ObjetTri.init("date", EGenreTriElement.Decroissant));
		lTris.push(ObjetTri.init("service.Libelle"));
		return lTris;
	}
}
function _estUnService(D) {
	return D.getGenre() === EGenreRessource.Service;
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
			'<i class="m-right-l icon_star" aria-label="' +
				GTraductions.getValeur("accueil.noteAuDessusBareme") +
				'" title="' +
				GTraductions.getValeur("accueil.noteAuDessusBareme") +
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
function _composePieceJointeDevoir(aDevoir) {
	const H = [];
	let lDocumentJointSujet, lDocumentJointCorrige, lLienSujet, lLienCorrige;
	if (!!aDevoir.elmSujet) {
		lDocumentJointSujet = aDevoir.elmSujet;
	} else if (!!aDevoir.libelleSujet) {
		lDocumentJointSujet = new ObjetElement(
			aDevoir.libelleSujet,
			aDevoir.getNumero(),
			EGenreDocumentJoint.Fichier,
		);
	}
	if (lDocumentJointSujet) {
		lLienSujet = GChaine.composerUrlLienExterne({
			documentJoint: lDocumentJointSujet,
			genreRessource: TypeFichierExterneHttpSco.DevoirSujet,
			libelleEcran: GTraductions.getValeur("AfficherSujet"),
			class: "chips-design-liste",
		});
	}
	if (!!aDevoir.elmCorrige) {
		lDocumentJointCorrige = aDevoir.elmCorrige;
	} else if (!!aDevoir.libelleCorrige) {
		lDocumentJointCorrige = new ObjetElement(
			aDevoir.libelleCorrige,
			aDevoir.getNumero(),
			EGenreDocumentJoint.Fichier,
		);
	}
	if (lDocumentJointCorrige) {
		lLienCorrige = GChaine.composerUrlLienExterne({
			documentJoint: lDocumentJointCorrige,
			genreRessource: TypeFichierExterneHttpSco.DevoirCorrige,
			libelleEcran: GTraductions.getValeur("AfficherCorrige"),
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
			'<ie-bouton class="themeBoutonNeutre small-bt bg-white" ie-model="afficherCorrigerQCM(\'',
			aDevoir.getNumero(),
			"', ",
			aDevoir.getGenre(),
			')">',
			GTraductions.getValeur(
				"ExecutionQCM.presentationCorrige.VisualiserCorrige",
			),
			"</ie-bouton>",
		);
	}
	return H.join("");
}
module.exports = { DonneesListe_DernieresNotes };
