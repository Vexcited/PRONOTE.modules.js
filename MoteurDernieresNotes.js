exports.MoteurDernieresNotes = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDate_1 = require("ObjetDate");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const MethodesObjet_1 = require("MethodesObjet");
const jsx_1 = require("jsx");
class MoteurDernieresNotes {
	constructor() {}
	composeNote(aNote, aParams = {}) {
		const lBaremeParDefaut =
			aParams.baremeParDefaut || GParametres.baremeNotation;
		const lEstBaremeParDefaut =
			!aParams.bareme ||
			!lBaremeParDefaut ||
			(aParams.bareme &&
				lBaremeParDefaut &&
				aParams.bareme.getValeur() === lBaremeParDefaut.getValeur());
		const lNoteAuDessusBareme =
			aNote && aParams.bareme && aNote.getValeur() > aParams.bareme.getValeur();
		return !aNote || !aNote.getNote()
			? ""
			: aNote.getNote() +
					(lEstBaremeParDefaut && !lNoteAuDessusBareme
						? ""
						: " " +
							(!!aParams.classeCssBareme
								? `<span class="${aParams.classeCssBareme}">${aParams.bareme.getBaremeEntier()}</span>`
								: aParams.bareme.getBaremeEntier()));
	}
	composeDetailsDevoir(aDevoir, aParams) {
		var _a;
		aParams = Object.assign({ avecFlechePrevSuiv: true }, aParams);
		const H = [];
		if (!!aDevoir) {
			const lStrService = aDevoir.service.matiere
				? aDevoir.service.matiere.getLibelle()
				: aDevoir.service.getLibelle();
			if (!IE.estMobile) {
				H.push(
					IE.jsx.str(
						"header",
						{ class: "infos-note flex-contain" },
						IE.jsx.str(
							"div",
							{ class: "m-top-l" },
							IE.jsx.str("h2", { class: "ie-titre" }, lStrService),
							aDevoir.commentaire && aParams.commentaireEnTitre
								? IE.jsx.str("p", { class: "ie-titre" }, aDevoir.commentaire)
								: "",
							aParams.libelleSessionRattrapage || aDevoir.estDS
								? IE.jsx.str(
										"p",
										{ class: "ie-titre" },
										aParams.libelleSessionRattrapage
											? aParams.libelleSessionRattrapage +
													(aDevoir.estDS ? " - " : "")
											: "",
										aDevoir.estDS
											? ObjetTraduction_1.GTraductions.getValeur(
													"DernieresNotes.DevoirSurveille",
												)
											: "",
									)
								: "",
							aDevoir.commentaire && !aParams.commentaireEnTitre
								? IE.jsx.str("p", { class: "ie-texte" }, aDevoir.commentaire)
								: "",
							IE.jsx.str(
								"p",
								{ class: "ie-texte" },
								ObjetTraduction_1.GTraductions.getValeur(
									"DernieresNotes.Detail.NoteDu",
									[
										ObjetDate_1.GDate.formatDate(
											aDevoir.date,
											"%JJ %MMMM %AAAA",
										),
									],
								),
							),
							aDevoir.ListeThemes && aDevoir.ListeThemes.count()
								? IE.jsx.str(
										"p",
										{ class: "ie-texte" },
										ObjetTraduction_1.GTraductions.getValeur("Themes"),
										": ",
										aDevoir.ListeThemes.getTableauLibelles().join(", "),
									)
								: "",
						),
					),
				);
			} else {
				H.push(
					IE.jsx.str(
						"header",
						{
							class: aParams.avecFlechePrevSuiv
								? "nav-prec-suiv"
								: "flex-contain justify-center",
						},
						aParams.avecFlechePrevSuiv &&
							IE.jsx.str("ie-btnicon", {
								"ie-model": (0, jsx_1.jsxFuncAttr)("surClicPrecSuiv", [
									aDevoir.getNumero(),
									aDevoir.getGenre(),
									false,
								]),
								class: "icon_angle_left",
								"aria-label": ObjetTraduction_1.GTraductions.getValeur(
									"DernieresNotes.Detail.SelectionneDevPrec",
								),
							}),
						IE.jsx.str(
							"div",
							{ class: "text-center" },
							IE.jsx.str("h2", { class: "ie-titre" }, lStrService),
							IE.jsx.str(
								"p",
								{ class: "ie-texte" },
								ObjetTraduction_1.GTraductions.getValeur(
									"DernieresNotes.Detail.NoteDu",
									[
										ObjetDate_1.GDate.formatDate(
											aDevoir.date,
											"%JJ %MMMM %AAAA",
										),
									],
								),
							),
						),
						aParams.avecFlechePrevSuiv &&
							IE.jsx.str("ie-btnicon", {
								"ie-model": (0, jsx_1.jsxFuncAttr)("surClicPrecSuiv", [
									aDevoir.getNumero(),
									aDevoir.getGenre(),
									true,
								]),
								class: "icon_angle_right",
								"aria-label": ObjetTraduction_1.GTraductions.getValeur(
									"DernieresNotes.Detail.SelectionneDevSuiv",
								),
							}),
					),
				);
				if (
					aParams.libelleSessionRattrapage ||
					aDevoir.estDS ||
					aDevoir.commentaire ||
					((_a = aDevoir.ListeThemes) === null || _a === void 0
						? void 0
						: _a.count())
				) {
					H.push(
						IE.jsx.str(
							"article",
							{ class: "infos-note flex-contain" },
							IE.jsx.str(
								"div",
								null,
								aDevoir.commentaire && aParams.commentaireEnTitre
									? IE.jsx.str("p", { class: "ie-titre" }, aDevoir.commentaire)
									: "",
								aParams.libelleSessionRattrapage || aDevoir.estDS
									? IE.jsx.str(
											"p",
											{ class: "ie-titre" },
											aParams.libelleSessionRattrapage
												? aParams.libelleSessionRattrapage +
														(aDevoir.estDS ? " - " : "")
												: "",
											aDevoir.estDS
												? ObjetTraduction_1.GTraductions.getValeur(
														"DernieresNotes.DevoirSurveille",
													)
												: "",
										)
									: "",
								aDevoir.commentaire && !aParams.commentaireEnTitre
									? IE.jsx.str("p", { class: "ie-texte" }, aDevoir.commentaire)
									: "",
								aDevoir.ListeThemes && aDevoir.ListeThemes.count()
									? IE.jsx.str(
											"p",
											{ class: "ie-texte" },
											ObjetTraduction_1.GTraductions.getValeur("Themes"),
											": ",
											aDevoir.ListeThemes.getTableauLibelles().join(", "),
										)
									: "",
							),
						),
					);
				}
			}
			const lAvecQCMRejouePlusieursFois =
				!!aDevoir.executionQCM && !!aDevoir.executionQCM.dateExecCopieCachee;
			const lAvecCommentaireSurNote =
				"commentaireSurNote" in aDevoir &&
				MethodesObjet_1.MethodesObjet.isString(aDevoir.commentaireSurNote) &&
				aDevoir.commentaireSurNote.length > 0;
			H.push(
				IE.jsx.str(
					"article",
					{ class: "details m-y-xl" },
					IE.jsx.str(
						"dl",
						{ class: "details-notes" },
						IE.jsx.str(
							"div",
							{ class: "ie-titre-couleur-lowercase" },
							IE.jsx.str(
								"dt",
								null,
								ObjetTraduction_1.GTraductions.getValeur(
									"DernieresNotes.Detail.NoteEtudiant",
								),
								" : ",
							),
							IE.jsx.str(
								"dd",
								null,
								this.composeNote(aDevoir.note, {
									bareme: aDevoir.bareme,
									baremeParDefaut: aDevoir.baremeParDefaut,
								}),
								lAvecQCMRejouePlusieursFois ? " *" : "",
							),
						),
						aDevoir.moyenne
							? IE.jsx.str(
									"div",
									{ class: "ie-texte" },
									IE.jsx.str(
										"dt",
										null,
										aParams.libelleMoyenneDuPublicDevoir,
										" :",
									),
									IE.jsx.str(
										"dd",
										null,
										this.composeNote(aDevoir.moyenne, {
											bareme: aDevoir.bareme,
											baremeParDefaut: aDevoir.baremeParDefaut,
										}),
									),
								)
							: "",
						IE.jsx.str(
							"div",
							{ class: "ie-texte" },
							IE.jsx.str(
								"dt",
								null,
								ObjetTraduction_1.GTraductions.getValeur(
									"DernieresNotes.Detail.NoteMax",
								),
								" :",
							),
							IE.jsx.str(
								"dd",
								null,
								this.composeNote(aDevoir.noteMax, {
									bareme: aDevoir.bareme,
									baremeParDefaut: aDevoir.baremeParDefaut,
								}),
							),
						),
						IE.jsx.str(
							"div",
							{ class: "ie-texte" },
							IE.jsx.str(
								"dt",
								null,
								ObjetTraduction_1.GTraductions.getValeur(
									"DernieresNotes.Detail.NoteMin",
								),
								" :",
							),
							IE.jsx.str(
								"dd",
								null,
								this.composeNote(aDevoir.noteMin, {
									bareme: aDevoir.bareme,
									baremeParDefaut: aDevoir.baremeParDefaut,
								}),
							),
						),
						IE.jsx.str(
							"div",
							{ class: "ie-texte" },
							IE.jsx.str(
								"dt",
								null,
								ObjetTraduction_1.GTraductions.getValeur(
									"DernieresNotes.Detail.Coefficient",
								),
								" :",
							),
							IE.jsx.str("dd", null, aDevoir.coefficient),
						),
					),
					lAvecCommentaireSurNote
						? IE.jsx.str(
								"div",
								{ class: ["comment-note"] },
								IE.jsx.str(
									"h3",
									{ class: "ie-titre" },
									ObjetTraduction_1.GTraductions.getValeur(
										"DernieresNotes.Detail.CommentaireProf",
									),
								),
								IE.jsx.str(
									"p",
									{ class: "commentaire" },
									aDevoir.commentaireSurNote,
								),
							)
						: "",
				),
			);
			let lLienKiosque;
			if (!!aDevoir.execKiosque) {
				lLienKiosque = ObjetChaine_1.GChaine.composerUrlLienExterne({
					documentJoint: aDevoir.execKiosque,
					title: ObjetTraduction_1.GTraductions.getValeur("AfficherCopieEleve"),
					libelleEcran:
						ObjetTraduction_1.GTraductions.getValeur("AfficherCopieEleve"),
				});
			}
			let lStrQCMDejaRealise;
			if (lAvecQCMRejouePlusieursFois) {
				let lStrTypeQCMGarde;
				if (!!aDevoir.executionQCM.garderMeilleureNote) {
					lStrTypeQCMGarde = ObjetTraduction_1.GTraductions.getValeur(
						"ExecutionQCM.presentationCorrige.MeilleurResultat",
					);
				} else {
					lStrTypeQCMGarde = ObjetTraduction_1.GTraductions.getValeur(
						"ExecutionQCM.presentationCorrige.DernierResultat",
					);
				}
				lStrQCMDejaRealise = `* ${ObjetTraduction_1.GTraductions.getValeur("ExecutionQCM.presentationCorrige.QCMDejaRealise", [lStrTypeQCMGarde])}`;
			}
			let lStrDevFacultatif;
			if (
				aDevoir.estBonus ||
				aDevoir.estFacultatifBonus ||
				(aDevoir.devoirInitial && aDevoir.devoirInitial.estFacultatifBonus)
			) {
				lStrDevFacultatif = ObjetTraduction_1.GTraductions.getValeur(
					"DernieresNotes.Detail.DevFacultatifBonus",
				);
			} else if (
				aDevoir.estFacultatif ||
				aDevoir.estFacultatifNote ||
				(aDevoir.devoirInitial && aDevoir.devoirInitial.estFacultatifNote)
			) {
				lStrDevFacultatif = ObjetTraduction_1.GTraductions.getValeur(
					"DernieresNotes.Detail.DevFacultatifNote",
				);
			} else if (
				aDevoir.estFacultatifSeuil ||
				(aDevoir.devoirInitial && aDevoir.devoirInitial.estFacultatifSeuil)
			) {
				lStrDevFacultatif = ObjetTraduction_1.GTraductions.getValeur(
					"DernieresNotes.Detail.DevFacultatifSeuil",
				);
			}
			if (
				(aParams.piecesJointes &&
					(aParams.piecesJointes.sujet ||
						aParams.piecesJointes.corrige ||
						aParams.piecesJointes.qcm)) ||
				!!lLienKiosque ||
				!!aParams.libelleInfoSessionRattrapage ||
				!!lStrQCMDejaRealise ||
				lStrDevFacultatif ||
				aDevoir.estRamenerSur20 ||
				(aDevoir.devoirInitial && aDevoir.devoirInitial.estRamenerSur20)
			) {
				H.push(
					IE.jsx.str(
						"article",
						null,
						aParams.piecesJointes &&
							(aParams.piecesJointes.sujet ||
								aParams.piecesJointes.corrige ||
								(aParams.piecesJointes.qcm && !aParams.piecesJointes.estQCMBtn))
							? IE.jsx.str(
									"div",
									{ class: "m-left-l details-pj" },
									aParams.piecesJointes.sujet || "",
									aParams.piecesJointes.corrige || "",
									aParams.piecesJointes.qcm && !aParams.piecesJointes.estQCMBtn
										? aParams.piecesJointes.qcm
										: "",
								)
							: "",
						aParams.piecesJointes &&
							aParams.piecesJointes.qcm &&
							aParams.piecesJointes.estQCMBtn
							? IE.jsx.str(
									"div",
									{ class: "m-left-l details-pj" },
									aParams.piecesJointes.qcm,
								)
							: "",
						lLienKiosque &&
							IE.jsx.str("div", { class: "m-left-l details-pj" }, lLienKiosque),
						aParams.libelleInfoSessionRattrapage &&
							IE.jsx.str(
								"p",
								{ class: "m-left-l ie-titre-petit" },
								aParams.libelleInfoSessionRattrapage,
							),
						lStrQCMDejaRealise &&
							IE.jsx.str(
								"p",
								{ class: "m-left-l ie-titre-petit" },
								lStrQCMDejaRealise,
							),
						lStrDevFacultatif &&
							IE.jsx.str(
								"p",
								{ class: "m-left-l ie-titre-petit" },
								lStrDevFacultatif,
							),
						aDevoir.estRamenerSur20 ||
							(aDevoir.devoirInitial && aDevoir.devoirInitial.estRamenerSur20)
							? IE.jsx.str(
									"p",
									{ class: "m-left-l ie-titre-petit" },
									ObjetTraduction_1.GTraductions.getValeur(
										"DernieresNotes.Detail.NoteRameneeSur",
										[
											(aDevoir.baremeParDefaut
												? aDevoir.baremeParDefaut
												: aDevoir.service
													? aDevoir.service.baremeService
													: GParametres.baremeNotation
											).getValeur(),
										],
									),
								)
							: "",
					),
				);
			}
		}
		return H.join("");
	}
	composeDetailsService(aService, aParams) {
		const H = [];
		if (!!aService) {
			const lStrService = aService.matiere
				? aService.matiere.getLibelle()
				: aService.getLibelle();
			if (!IE.estMobile) {
				H.push(
					IE.jsx.str(
						"header",
						{ class: "infos-note flex-contain flex-center justify-between" },
						IE.jsx.str(
							"h2",
							{ class: "ie-titre fluid-bloc m-right-l" },
							lStrService,
						),
						IE.jsx.str(
							"ie-bouton",
							{
								"ie-model": (0, jsx_1.jsxFuncAttr)("btnCalculMoyenne", [
									aService.getNumero(),
								]),
								"aria-haspopup": "dialog",
								class: "small-bt fix-bloc",
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"DernieresNotes.Detail.DetailsMethodeCalcMoy",
							),
						),
					),
				);
			} else {
				H.push(
					IE.jsx.str(
						"header",
						{ class: "nav-prec-suiv" },
						IE.jsx.str("ie-btnicon", {
							"ie-model": (0, jsx_1.jsxFuncAttr)("surClicPrecSuiv", [
								aService.getNumero(),
								aService.getGenre(),
								false,
							]),
							class: "icon_angle_left",
							"aria-label": ObjetTraduction_1.GTraductions.getValeur(
								"DernieresNotes.Detail.SelectionneMatPrec",
							),
						}),
						IE.jsx.str("h2", { class: "ie-titre text-center" }, lStrService),
						IE.jsx.str("ie-btnicon", {
							"ie-model": (0, jsx_1.jsxFuncAttr)("surClicPrecSuiv", [
								aService.getNumero(),
								aService.getGenre(),
								true,
							]),
							class: "icon_angle_right",
							"aria-label": ObjetTraduction_1.GTraductions.getValeur(
								"DernieresNotes.Detail.SelectionneMatSuiv",
							),
						}),
					),
				);
			}
			if (!!aParams.avecAffichageComplet) {
				const lMoyEtudiant =
					aService.matiere && aService.matiere.moyenneEtudiant
						? this.composeNote(aService.matiere.moyenneEtudiant, {
								bareme: aService.baremeService,
							})
						: aService.moyEleve && !isNaN(aService.moyEleve.getValeur())
							? this.composeNote(aService.moyEleve, {
									bareme: aService.baremeMoyEleve,
									baremeParDefaut: aService.baremeMoyEleveParDefaut,
								})
							: null;
				const lMoyClasse =
					aService.matiere && aService.matiere.moyenneClasse
						? this.composeNote(aService.matiere.moyenneClasse, {
								bareme: aService.baremeService,
							})
						: aService.moyClasse && !isNaN(aService.moyClasse.getValeur())
							? this.composeNote(aService.moyClasse, {
									bareme: aService.baremeMoyEleveParDefaut,
								})
							: null;
				const lMoyMax =
					aService.matiere && aService.matiere.moyenneMax
						? this.composeNote(aService.matiere.moyenneMax, {
								bareme: aService.baremeService,
							})
						: aService.moyMax && !isNaN(aService.moyMax.getValeur())
							? this.composeNote(aService.moyMax, {
									bareme: aService.baremeMoyEleveParDefaut,
								})
							: null;
				const lMoyMin =
					aService.matiere && aService.matiere.moyenneMin
						? this.composeNote(aService.matiere.moyenneMin, {
								bareme: aService.baremeService,
							})
						: aService.moyMin && !isNaN(aService.moyMin.getValeur())
							? this.composeNote(aService.moyMin, {
									bareme: aService.baremeMoyEleveParDefaut,
								})
							: null;
				let lNbrNotes = null;
				if (!aService.avecDetailDevoirsNonPublie) {
					lNbrNotes =
						aService.matiere &&
						(aService.matiere.nbNotesEleve ||
							aService.matiere.nbNotesEleve === 0)
							? aService.matiere.nbNotesEleve
							: aService.nbNotesEleve || 0;
				}
				H.push(
					IE.jsx.str(
						"article",
						{ class: "details m-y-xl" },
						IE.jsx.str(
							"dl",
							{ class: "details-notes" },
							lMoyEtudiant &&
								IE.jsx.str(
									"div",
									{ class: "ie-titre-couleur-lowercase" },
									IE.jsx.str(
										"dt",
										null,
										ObjetTraduction_1.GTraductions.getValeur(
											"DernieresNotes.Detail.MoyenneEtudiant",
										),
										" :",
									),
									IE.jsx.str("dd", null, lMoyEtudiant),
								),
							lMoyClasse &&
								IE.jsx.str(
									"div",
									{ class: "ie-texte" },
									IE.jsx.str(
										"dt",
										null,
										aParams.libelleMoyenneDuPublicService,
										" :",
									),
									IE.jsx.str("dd", null, lMoyClasse),
								),
							lMoyMax &&
								IE.jsx.str(
									"div",
									{ class: "ie-texte" },
									IE.jsx.str(
										"dt",
										null,
										ObjetTraduction_1.GTraductions.getValeur(
											"DernieresNotes.Detail.MoyenneMax",
										),
										" :",
									),
									IE.jsx.str("dd", null, lMoyMax),
								),
							lMoyMin &&
								IE.jsx.str(
									"div",
									{ class: "ie-texte" },
									IE.jsx.str(
										"dt",
										null,
										ObjetTraduction_1.GTraductions.getValeur(
											"DernieresNotes.Detail.MoyenneMin",
										),
										" :",
									),
									IE.jsx.str("dd", null, lMoyMin),
								),
							lNbrNotes !== null &&
								IE.jsx.str(
									"div",
									{ class: "ie-texte" },
									IE.jsx.str(
										"dt",
										null,
										ObjetTraduction_1.GTraductions.getValeur(
											"DernieresNotes.Detail.NombreDeNotes",
										),
										" :",
									),
									IE.jsx.str("dd", null, lNbrNotes),
								),
						),
					),
				);
			}
			if (aService.estMoyNR) {
				H.push(
					IE.jsx.str(
						"article",
						null,
						IE.jsx.str(
							"p",
							{ class: "m-left-l ie-titre-petit" },
							IE.jsx.str(
								"span",
								{ class: "notation_pastille_moy_NR m-right" },
								ObjetTraduction_1.GTraductions.getValeur(
									"Notes.Colonne.TitreMoyNR",
								),
							),
							ObjetTraduction_1.GTraductions.getValeur(
								"Notes.Colonne.HintMoyenneNR",
							),
						),
					),
				);
			}
			if (!!aService.avecDetailDevoirsNonPublie) {
				H.push(
					IE.jsx.str(
						"p",
						{ class: "m-left-l" },
						ObjetTraduction_1.GTraductions.getValeur(
							"DernieresNotes.Detail.NoteDuServiceNonPubliees",
						),
					),
				);
			}
			if (IE.estMobile) {
				H.push(
					IE.jsx.str(
						"article",
						{ class: "btnMethodeCalcul" },
						IE.jsx.str(
							"ie-bouton",
							{
								"ie-model": (0, jsx_1.jsxFuncAttr)("btnCalculMoyenne", [
									aService.getNumero(),
								]),
								"aria-haspopup": "dialog",
								class: "small-bt",
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"DernieresNotes.Detail.DetailsMethodeCalcMoy",
							),
						),
					),
				);
			}
		}
		return H.join("");
	}
	composeDetailsEvaluation(aEvaluation, aParams) {
		const H = [];
		if (!IE.estMobile) {
			H.push(
				`<header class="infos-note flex-contain">`,
				`<!--<i class="header-icon icon_saisie_evaluation" aria-hidden="true"></i>-->`,
				`<div>`,
				`<div class="ie-titre">${aEvaluation.matiere.getLibelle()}</div>`,
				aEvaluation.getLibelle() !== ""
					? `<div class="ie-titre">${aEvaluation.getLibelle()}</div>`
					: "",
				`<div class="ie-texte">${ObjetTraduction_1.GTraductions.getValeur("evaluations.EvaluationDuDate", [ObjetDate_1.GDate.formatDate(aEvaluation.date, "%JJ/%MM")])}</div>`,
				aEvaluation.ListeThemes && aEvaluation.ListeThemes.count()
					? `<div class="ie-texte">${ObjetTraduction_1.GTraductions.getValeur("Themes")} : ${aEvaluation.ListeThemes.getTableauLibelles().join(", ")}</div>`
					: "",
				`</div>`,
				`</header>`,
			);
		} else {
			H.push(
				'<header class="nav-prec-suiv">',
				`<ie-btnicon ie-model="surClicPrecSuiv('${aEvaluation.getNumero()}',${aEvaluation.getGenre()}, false)" class="icon_angle_left" aria-label="${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.SelectionneDevPrec")}"></ie-btnicon>`,
				`<div class="text-center ie-titre">`,
				`<div>${aEvaluation.matiere.getLibelle()}</div>`,
				`<div>${ObjetTraduction_1.GTraductions.getValeur("evaluations.EvaluationDuDate", [ObjetDate_1.GDate.formatDate(aEvaluation.date, "%JJ/%MM")])}</div>`,
				`</div>`,
				`<ie-btnicon ie-model="surClicPrecSuiv('${aEvaluation.getNumero()}',${aEvaluation.getGenre()}, true)" class="icon_angle_right" aria-label="${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.SelectionneDevSuiv")}"></ie-btnicon>`,
				`</header>`,
			);
			if (
				aEvaluation.getLibelle() !== "" ||
				(aEvaluation.ListeThemes && aEvaluation.ListeThemes.count())
			) {
				H.push(
					`<article class="infos-note flex-contain">`,
					`<!--<i class="header-icon icon_saisie_evaluation" aria-hidden="true"></i>-->`,
					`<div>`,
					aEvaluation.getLibelle() !== ""
						? `<div class="ie-titre">${aEvaluation.getLibelle()}</div>`
						: "",
					aEvaluation.ListeThemes && aEvaluation.ListeThemes.count()
						? `<div class="ie-texte">${ObjetTraduction_1.GTraductions.getValeur("Themes")} : ${aEvaluation.ListeThemes.getTableauLibelles().join(", ")}</div>`
						: "",
					`</div>`,
					`</article>`,
				);
			}
		}
		const lHtmlCompetence = [];
		if (
			aEvaluation.listeNiveauxDAcquisitions &&
			aEvaluation.listeNiveauxDAcquisitions.count()
		) {
			aEvaluation.listeNiveauxDAcquisitions.parcourir((aNiveauDAcquisition) => {
				lHtmlCompetence.push("<div>");
				let lLibelleDomaineOuItem = "";
				if (!!aNiveauDAcquisition.sousItem) {
					lLibelleDomaineOuItem = aNiveauDAcquisition.sousItem.getLibelle();
				} else if (!!aNiveauDAcquisition.item) {
					lLibelleDomaineOuItem = aNiveauDAcquisition.item.getLibelle();
				} else {
					lLibelleDomaineOuItem = aNiveauDAcquisition.domaine.getLibelle();
				}
				lHtmlCompetence.push(
					"<span>",
					Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
						GParametres.listeNiveauxDAcquisitions.getElementParGenre(
							aNiveauDAcquisition.getGenre(),
						),
					),
					lLibelleDomaineOuItem
						? '<span class="ie-texte m-left">' +
								lLibelleDomaineOuItem +
								"</span>"
						: "",
					"</span>",
				);
				if (
					!!aNiveauDAcquisition.pilier &&
					!!aNiveauDAcquisition.pilier.strPrefixes
				) {
					lHtmlCompetence.push(
						'<span class="ie-titre-couleur-lowercase m-left text-right">&nbsp;',
						aNiveauDAcquisition.pilier.strPrefixes,
						"</span>",
					);
				}
				lHtmlCompetence.push("</div>");
				if (!!aNiveauDAcquisition.observation) {
					const lObs = aNiveauDAcquisition.observation.replace(/\n/g, "<br/>");
					lHtmlCompetence.push(
						'<span class="m-left-xxl"><i class="icon_comment"></i><span class="m-left-l">' +
							lObs +
							"</span></span>",
					);
				}
			});
		}
		H.push(
			`<article class="details eval m-y-xl">`,
			`<div class="details-notes">`,
			`<div><span>${aEvaluation.descriptif}</span><span class="ie-titre-couleur-lowercase">${ObjetTraduction_1.GTraductions.getValeur("evaluations.CoefficientAbrege") + " : " + aEvaluation.coefficient}</span></div>`,
			lHtmlCompetence.join(""),
			`</div>`,
			`</article>`,
		);
		let lStrInfoQCM;
		if (
			!!aEvaluation.executionQCM &&
			!!aEvaluation.executionQCM.dateExecCopieCachee
		) {
			let lStrTypeQCMGarde;
			if (!!aEvaluation.executionQCM.garderMeilleureNote) {
				lStrTypeQCMGarde = ObjetTraduction_1.GTraductions.getValeur(
					"ExecutionQCM.presentationCorrige.MeilleurResultat",
				);
			} else {
				lStrTypeQCMGarde = ObjetTraduction_1.GTraductions.getValeur(
					"ExecutionQCM.presentationCorrige.DernierResultat",
				);
			}
			lStrInfoQCM = ObjetTraduction_1.GTraductions.getValeur(
				"ExecutionQCM.presentationCorrige.QCMDejaRealise",
				[lStrTypeQCMGarde],
			);
		}
		if (
			(aParams.piecesJointes &&
				(aParams.piecesJointes.sujet ||
					aParams.piecesJointes.corrige ||
					aParams.piecesJointes.qcm)) ||
			lStrInfoQCM
		) {
			H.push(
				`<article>`,
				aParams.piecesJointes &&
					(aParams.piecesJointes.sujet ||
						aParams.piecesJointes.corrige ||
						(aParams.piecesJointes.qcm && !aParams.piecesJointes.estQCMBtn))
					? `<div class="m-left-l details-pj">${aParams.piecesJointes.sujet || ""}${aParams.piecesJointes.corrige || ""}${aParams.piecesJointes.qcm && !aParams.piecesJointes.estQCMBtn ? aParams.piecesJointes.qcm : ""}</div>`
					: "",
				aParams.piecesJointes &&
					aParams.piecesJointes.qcm &&
					aParams.piecesJointes.estQCMBtn
					? `<div class="m-left-l details-pj">${aParams.piecesJointes.qcm}</div>`
					: "",
				lStrInfoQCM
					? `<div class="m-left-l ie-titre-petit">${lStrInfoQCM}</div>`
					: "",
				`</article>`,
			);
		}
		return H.join("");
	}
	composeLigneTotaleDernieresNotes(aMoyenneGenerale, aBaremeParDefaut) {
		const H = [];
		if (
			!!aMoyenneGenerale &&
			(!!aMoyenneGenerale.note ||
				!!aMoyenneGenerale.noteClasse ||
				!!aMoyenneGenerale.etudiant ||
				!!aMoyenneGenerale.promo)
		) {
			if (!!aMoyenneGenerale.note || !!aMoyenneGenerale.etudiant) {
				const lNote = !!aMoyenneGenerale.note
					? this.composeNote(aMoyenneGenerale.note, {
							bareme: aMoyenneGenerale.bareme,
							baremeParDefaut: aBaremeParDefaut,
						})
					: this.composeNote(aMoyenneGenerale.etudiant);
				H.push(
					`<article class="flex-contain m-all-xl justify-between"><span class="ie-titre-gros">${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.MoyenneGeneraleEtudiant")} : </span><span class="ie-titre-gros m-left">${lNote}</span></article>`,
				);
			}
			if (!!aMoyenneGenerale.noteClasse || !!aMoyenneGenerale.promo) {
				const lNote = !!aMoyenneGenerale.noteClasse
					? this.composeNote(aMoyenneGenerale.noteClasse, {
							bareme: aMoyenneGenerale.bareme,
							baremeParDefaut: aBaremeParDefaut,
						})
					: this.composeNote(aMoyenneGenerale.promo);
				H.push(
					`<article class="flex-contain m-all-xl justify-between moyenne-promo"><span>${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.MoyenneGeneralePromo")} : </span><span>${lNote}</span></article>`,
				);
			}
		}
		return H.join("");
	}
}
exports.MoteurDernieresNotes = MoteurDernieresNotes;
