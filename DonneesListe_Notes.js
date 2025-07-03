exports.DonneesListe_Notes = exports.EGenreCommandeMenuCtxNote = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const MoteurNotesCP_1 = require("MoteurNotesCP");
const MoteurNotes_1 = require("MoteurNotes");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetTraduction_1 = require("ObjetTraduction");
const MethodesObjet_1 = require("MethodesObjet");
var EGenreCommandeMenuCtxNote;
(function (EGenreCommandeMenuCtxNote) {
	EGenreCommandeMenuCtxNote["saisieNote"] = "saisieNote";
	EGenreCommandeMenuCtxNote["afficherMoyenneAnciennesNotes"] =
		"afficherMoyenneAnciennesNotes";
	EGenreCommandeMenuCtxNote["ouvrirFicheEleve"] = "ouvrirFicheEleve";
	EGenreCommandeMenuCtxNote["afficherCalculMoyenne"] = "afficherCalculMoyenne";
})(
	EGenreCommandeMenuCtxNote ||
		(exports.EGenreCommandeMenuCtxNote = EGenreCommandeMenuCtxNote = {}),
);
class DonneesListe_Notes extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.param = $.extend(
			{
				instanceListe: null,
				listeDevoirs: new ObjetListeElements_1.ObjetListeElements(),
				listeEleves: new ObjetListeElements_1.ObjetListeElements(),
				service: new ObjetElement_1.ObjetElement(),
				periode: new ObjetElement_1.ObjetElement(),
				callbackMenuCtx: () => {},
			},
			aParam,
		);
		this.moteurNotes = new MoteurNotes_1.MoteurNotes({
			periodeParDefaut: this.param.periode,
		});
		this.moteurNotesCP = new MoteurNotesCP_1.MoteurNotesCP(this.moteurNotes);
		this.setOptions({
			avecSelection: true,
			avecEvnt_SelectionClick: true,
			avecEllipsis: true,
		});
	}
	getTotal(aEstHeader) {
		if (aEstHeader) {
			return null;
		}
		let lDevoir = this.moteurNotes.getDevoir(
			{
				article: new ObjetElement_1.ObjetElement(
					"",
					DonneesListe_Notes.genreLigneTotal.generale,
				),
				numeroDevoir: this.param.devoirSelectionne.getNumero(),
			},
			{ listeDevoirs: this.param.listeDevoirs },
		);
		let lNote = "";
		if (lDevoir && lDevoir.Moyenne) {
			lNote = lDevoir.Moyenne.getNote();
		}
		let lMoyenneDeLaClasse =
			this.param.moyGenerales[
				MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.Moyenne
			];
		let lStrNote = "";
		if (lMoyenneDeLaClasse) {
			lStrNote = lMoyenneDeLaClasse.getNote();
		}
		const lStrNbrEleve = this.moteurNotesCP.strTitreEleves(
			this.Donnees.count(),
		);
		return {
			getHtml: () => {
				return IE.jsx.str(
					"section",
					{ class: "flex-contain justify-between flex-center" },
					IE.jsx.str(
						"article",
						null,
						IE.jsx.str("p", { class: "ie-titre" }, lStrNbrEleve || ""),
						IE.jsx.str(
							"p",
							{ class: "ie-sous-titre" },
							ObjetTraduction_1.GTraductions.getValeur("Notes.MoyClasse"),
							": ",
							lStrNote || "",
						),
					),
					IE.jsx.str(
						"article",
						null,
						IE.jsx.str(
							"p",
							{ class: "ie-titre" },
							ObjetTraduction_1.GTraductions.getValeur("Notes.MoyDevoir"),
							": ",
							lNote,
						),
					),
				);
			},
			wai: "",
		};
	}
	getInfosSuppZonePrincipale(aParams) {
		const lNote =
			aParams.article.moyennes[
				MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.Moyenne
			];
		if (!lNote) {
			return "";
		}
		const lMoyenne = this.moteurNotesCP.composeHtmlNote({
			facultatif:
				this.param.service.facultatif === true &&
				lNote.getValeur() <= this.param.baremeParDefaut.getValeur() / 2,
			note: lNote,
		});
		return `<p class="ie-sous-titre">${ObjetTraduction_1.GTraductions.getValeur("Notes.Moy")} : ${lMoyenne}</p>`;
	}
	getZoneComplementaire(aParams) {
		const lInfo = this.getInfos(aParams.article);
		const lAvecCommentaireSurNote =
			lInfo.eleveDevoir &&
			MethodesObjet_1.MethodesObjet.isString(lInfo.eleveDevoir.commentaire) &&
			lInfo.eleveDevoir.commentaire.length > 0;
		const lLabel =
			lInfo && lInfo.devoir.avecCommentaireSurNoteEleve
				? ObjetTraduction_1.GTraductions.getValeur(
						"Notes.saisirLaNoteEtRemarque",
					)
				: ObjetTraduction_1.GTraductions.getValeur("Notes.saisirLaNote");
		let lNote = "X";
		if (lInfo.estNoteExistante) {
			lNote =
				lInfo.estNoteExistante && lInfo.note && !lInfo.note.estUneNoteVide()
					? lInfo.note.getNote()
					: "...";
		}
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				null,
				lAvecCommentaireSurNote
					? IE.jsx.str("i", {
							role: "img",
							"aria-label": ObjetTraduction_1.GTraductions.getValeur(
								"DernieresNotes.Detail.CommentaireProf",
							),
							title: ObjetTraduction_1.GTraductions.getValeur(
								"DernieresNotes.Detail.CommentaireProf",
							),
							class: "icon_comment_vide theme_color_moyen1 m-right-xl",
						})
					: "",
				IE.jsx.str(
					"ie-bouton",
					{
						"ie-model": this.jsxbtnModel.bind(this, aParams),
						class: "themeBoutonNeutre fixed-mobile",
					},
					IE.jsx.str("span", null, lNote),
					IE.jsx.str("span", { class: "sr-only" }, "\u00A0", lLabel),
				),
			),
		);
		return H.join("");
	}
	jsxbtnModel(aParams) {
		return {
			getDisabled: () => {
				if (!aParams.article) {
					return true;
				}
				const lInfo = this.getInfos(aParams.article);
				if (!lInfo.estNoteExistante) {
					return false;
				}
				return !this._estCellEditable(aParams.article);
			},
			event: () => {
				if (!aParams.article) {
					return true;
				}
				const lInfo = this.getInfos(aParams.article);
				if (!lInfo.estNoteExistante) {
					const lParametres = {
						article: aParams.article,
						numeroDevoir: this.param.devoirSelectionne.getNumero(),
					};
					const lMsgInfo = this.moteurNotesCP.getMsgNoteNonEditable({
						actif: this.param.service.getActif(),
						devoir: this.moteurNotes.getDevoir(lParametres, {
							listeDevoirs: this.param.listeDevoirs,
						}),
						eleve: this.moteurNotes.getEleve(lParametres, {
							listeEleves: this.param.listeEleves,
						}),
						eleveDevoir: this.moteurNotes.getEleveDevoir(lParametres, {
							listeDevoirs: this.param.listeDevoirs,
						}),
						devoirDansPeriode: this.moteurNotes.devoirDansPeriode.bind(
							this.moteurNotes,
						),
					});
					if (lMsgInfo !== "") {
						GApplication.getMessage().afficher({ message: lMsgInfo });
					}
					return true;
				}
				this.param.callbackMenuCtx(
					Object.assign(
						{
							article: aParams.article,
							genreCommande: EGenreCommandeMenuCtxNote.saisieNote,
						},
						this.getInfos(aParams.article),
					),
				);
			},
		};
	}
	initialisationObjetContextuel(aParams) {
		if (!aParams.menuContextuel) {
			return;
		}
		const lEstEditable = this._estCellEditable(aParams.article);
		const lInfo = this.getInfos(aParams.article);
		const lNote =
			aParams.article.moyennes[
				MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.Moyenne
			];
		const lExisteMoyenne = lNote.getNote() !== "";
		aParams.menuContextuel.add(
			lInfo && lInfo.devoir.avecCommentaireSurNoteEleve
				? ObjetTraduction_1.GTraductions.getValeur(
						"Notes.saisirLaNoteEtRemarque",
					)
				: ObjetTraduction_1.GTraductions.getValeur("Notes.saisirLaNote"),
			lEstEditable,
			() => {
				this.param.callbackMenuCtx(
					Object.assign(
						{
							article: aParams.article,
							genreCommande: EGenreCommandeMenuCtxNote.saisieNote,
						},
						lInfo,
					),
				);
			},
		);
		aParams.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("Notes.voirMoyenne"),
			true,
			() => {
				this.param.callbackMenuCtx(
					Object.assign(
						{
							article: aParams.article,
							genreCommande:
								EGenreCommandeMenuCtxNote.afficherMoyenneAnciennesNotes,
						},
						lInfo,
					),
				);
			},
		);
		aParams.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur(
				"BulletinEtReleve.TitreFenetreCalculMoyenne",
			),
			lExisteMoyenne,
			() => {
				this.param.callbackMenuCtx(
					Object.assign(
						{
							article: aParams.article,
							genreCommande: EGenreCommandeMenuCtxNote.afficherCalculMoyenne,
						},
						lInfo,
					),
				);
			},
		);
		aParams.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("Notes.voirFicheEleve"),
			true,
			() => {
				this.param.callbackMenuCtx(
					Object.assign(
						{
							article: aParams.article,
							genreCommande: EGenreCommandeMenuCtxNote.ouvrirFicheEleve,
						},
						lInfo,
					),
				);
			},
		);
		aParams.menuContextuel.setDonnees();
	}
	getInfoArticle(aArticle) {
		const lInfo = this.getInfos(aArticle);
		return Object.assign({ article: aArticle }, lInfo);
	}
	getInfoArticleSuivant(aArticle) {
		const lArticleLigneSuivante = this.getArticleSuivant(aArticle);
		if (lArticleLigneSuivante) {
			const lInfo = this.getInfos(lArticleLigneSuivante);
			return Object.assign({ article: lArticleLigneSuivante }, lInfo);
		}
		return null;
	}
	getArticleSuivant(aArticle) {
		const lIndiceEleveSelectionne = this.Donnees.getIndiceParElement(aArticle);
		const lArticleLigneSuivante = this.Donnees.get(lIndiceEleveSelectionne + 1);
		const maxIndice = this.Donnees.count() - 1;
		if (lArticleLigneSuivante) {
			const lInfo = this.getInfos(lArticleLigneSuivante);
			if (lInfo.estNoteEditable) {
				return lArticleLigneSuivante;
			} else if (lIndiceEleveSelectionne + 1 < maxIndice) {
				return this.getArticleSuivant(lArticleLigneSuivante);
			}
		}
	}
	_estDonneeEditable(aParams) {
		const lInfo = this.getInfos(aParams);
		return this.moteurNotesCP.estNoteEditable({
			actif: this.param.service.getActif(),
			devoir: lInfo.devoir,
			eleve: lInfo.eleve,
			eleveDevoir: lInfo.eleveDevoir,
			devoirDansPeriode: this.moteurNotes.devoirDansPeriode.bind(
				this.moteurNotes,
			),
		});
	}
	_estDonneeCloture() {
		return false;
	}
	_estCellEditable(aParams) {
		const lEditable = this._estDonneeEditable(aParams);
		const lCloture = this._estDonneeCloture();
		return lEditable && !lCloture;
	}
	getInfos(aArticle) {
		const lResult = {
			note: null,
			eleveDevoir: null,
			estNoteExistante: false,
			estNoteEditable: false,
			devoir: null,
			eleve: null,
		};
		const lParamsAuFormatDuMoteur = {
			article: aArticle,
			numeroDevoir: this.param.devoirSelectionne.getNumero(),
		};
		lResult.eleve = this.moteurNotes.getEleve(lParamsAuFormatDuMoteur, {
			listeEleves: this.param.listeEleves,
		});
		lResult.devoir = this.moteurNotes.getDevoir(lParamsAuFormatDuMoteur, {
			listeDevoirs: this.param.listeDevoirs,
		});
		lResult.eleveDevoir = this.moteurNotes.getEleveDevoirParNumero({
			listeDevoirs: this.param.listeDevoirs,
			numeroDevoir: this.param.devoirSelectionne.getNumero(),
			numeroEleve: aArticle.getNumero(),
		});
		lResult.estNoteExistante = this.moteurNotesCP.estNoteExistante({
			eleveDevoir: lResult.eleveDevoir,
			devoir: this.param.devoirSelectionne,
			eleve: lResult.eleve,
			devoirDansPeriode: this.moteurNotes.devoirDansPeriode.bind(
				this.moteurNotes,
			),
		});
		if (lResult.estNoteExistante) {
			lResult.note = this.moteurNotes.getNoteEleveAuDevoirParNumero({
				listeDevoirs: this.param.listeDevoirs,
				numeroDevoir: this.param.devoirSelectionne.getNumero(),
				numeroEleve: aArticle.getNumero(),
			});
		}
		lResult.estNoteEditable = this.moteurNotesCP.estNoteEditable({
			actif: this.param.service.getActif(),
			devoir: lResult.devoir,
			eleve: lResult.eleve,
			eleveDevoir: lResult.eleveDevoir,
			devoirDansPeriode: this.moteurNotes.devoirDansPeriode.bind(
				this.moteurNotes,
			),
		});
		return lResult;
	}
}
exports.DonneesListe_Notes = DonneesListe_Notes;
(function (DonneesListe_Notes) {
	let colonnes;
	(function (colonnes) {
		colonnes["eleve"] = "eleve";
		colonnes["devoir"] = "devoir";
		colonnes["moyenne"] = "moyenne";
	})(
		(colonnes =
			DonneesListe_Notes.colonnes || (DonneesListe_Notes.colonnes = {})),
	);
	let dimensions;
	(function (dimensions) {
		dimensions[(dimensions["largeurNote"] = 45)] = "largeurNote";
	})(
		(dimensions =
			DonneesListe_Notes.dimensions || (DonneesListe_Notes.dimensions = {})),
	);
	let genreLigneTotal;
	(function (genreLigneTotal) {
		genreLigneTotal[(genreLigneTotal["generale"] = 1)] = "generale";
	})(
		(genreLigneTotal =
			DonneesListe_Notes.genreLigneTotal ||
			(DonneesListe_Notes.genreLigneTotal = {})),
	);
})(
	DonneesListe_Notes || (exports.DonneesListe_Notes = DonneesListe_Notes = {}),
);
