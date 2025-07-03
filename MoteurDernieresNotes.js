exports.MoteurDernieresNotes = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDate_1 = require("ObjetDate");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const MethodesObjet_1 = require("MethodesObjet");
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
		aParams = Object.assign({ avecFlechePrevSuiv: true }, aParams);
		const H = [];
		if (!!aDevoir) {
			const lStrService = aDevoir.service.matiere
				? aDevoir.service.matiere.getLibelle()
				: aDevoir.service.getLibelle();
			if (!IE.estMobile) {
				H.push(
					`<header class="infos-note flex-contain">`,
					`<!-- <i class="header-icon ${aDevoir.estDS ? "icon_DS" : "icon_saisie_note"}" ${aDevoir.estDS ? `aria-label="${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.DevoirSurveille")}"` : `aria-hidden="true"`}></i> -->`,
					`<div class="m-top-l">`,
					`<div class="ie-titre">${lStrService}</div>`,
					aDevoir.commentaire && aParams.commentaireEnTitre
						? `<div class="ie-titre">${aDevoir.commentaire}</div>`
						: "",
					aParams.libelleSessionRattrapage || aDevoir.estDS
						? `<div class="ie-titre">${aParams.libelleSessionRattrapage ? aParams.libelleSessionRattrapage + (aDevoir.estDS ? " - " : "") : ""}${aDevoir.estDS ? ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.DevoirSurveille") : ""}</div>`
						: "",
					aDevoir.commentaire && !aParams.commentaireEnTitre
						? `<div class="ie-texte">${aDevoir.commentaire}</div>`
						: "",
					`<div class="ie-texte">${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.NoteDu", [ObjetDate_1.GDate.formatDate(aDevoir.date, "%JJ %MMMM %AAAA")])}</div>`,
					aDevoir.ListeThemes && aDevoir.ListeThemes.count()
						? `<div class="ie-texte">${ObjetTraduction_1.GTraductions.getValeur("Themes")} : ${aDevoir.ListeThemes.getTableauLibelles().join(", ")}</div>`
						: "",
					`</div>`,
					`</header>`,
				);
			} else {
				H.push(
					`<header class="${aParams.avecFlechePrevSuiv ? "nav-prec-suiv" : "flex-contain justify-center"}">`,
					aParams.avecFlechePrevSuiv
						? `<ie-btnicon ie-model="surClicPrecSuiv('${aDevoir.getNumero()}',${aDevoir.getGenre()}, false)" class="icon_angle_left" aria-label="${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.SelectionneDevPrec")}"></ie-btnicon>`
						: "",
					`<div class="text-center ie-titre">`,
					`<div>${lStrService}</div>`,
					`<div>${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.NoteDu", [ObjetDate_1.GDate.formatDate(aDevoir.date, "%JJ %MMMM %AAAA")])}</div>`,
					`</div>`,
					aParams.avecFlechePrevSuiv
						? `<ie-btnicon ie-model="surClicPrecSuiv('${aDevoir.getNumero()}',${aDevoir.getGenre()}, true)" class="icon_angle_right" aria-label="${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.SelectionneDevSuiv")}"></ie-btnicon>`
						: "",
					`</header>`,
				);
				if (
					aParams.libelleSessionRattrapage ||
					aDevoir.estDS ||
					aDevoir.commentaire
				) {
					H.push(
						`<article class="infos-note flex-contain">`,
						`<!-- <i class="header-icon ${aDevoir.estDS ? "icon_DS" : "icon_saisie_note"}" ${aDevoir.estDS ? `aria-label="${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.DevoirSurveille")}"` : `aria-hidden="true"`}></i> -->`,
						`<div>`,
						aDevoir.commentaire && aParams.commentaireEnTitre
							? `<div class="ie-titre">${aDevoir.commentaire}</div>`
							: "",
						aParams.libelleSessionRattrapage || aDevoir.estDS
							? `<div class="ie-titre">${aParams.libelleSessionRattrapage ? aParams.libelleSessionRattrapage + (aDevoir.estDS ? " - " : "") : ""}${aDevoir.estDS ? ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.DevoirSurveille") : ""}</div>`
							: "",
						aDevoir.commentaire && !aParams.commentaireEnTitre
							? `<div class="ie-texte">${aDevoir.commentaire}</div>`
							: "",
						aDevoir.ListeThemes && aDevoir.ListeThemes.count()
							? `<div class="ie-texte">${ObjetTraduction_1.GTraductions.getValeur("Themes")} : ${aDevoir.ListeThemes.getTableauLibelles().join(", ")}</div>`
							: "",
						`</div>`,
						`</article>`,
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
				`<article class="details m-y-xl">`,
				`<div class="details-notes">`,
				`<div class="ie-titre-couleur-lowercase"><span>${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.NoteEtudiant")} : </span><span>${this.composeNote(aDevoir.note, { bareme: aDevoir.bareme, baremeParDefaut: aDevoir.baremeParDefaut })}${lAvecQCMRejouePlusieursFois ? " *" : ""}&nbsp;</span></div>`,
				aDevoir.moyenne
					? `<div class="ie-texte"><span>${aParams.libelleMoyenneDuPublicDevoir} :</span><span>${this.composeNote(aDevoir.moyenne, { bareme: aDevoir.bareme, baremeParDefaut: aDevoir.baremeParDefaut })}&nbsp;</span></div>`
					: "",
				`<div class="ie-texte"><span>${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.NoteMax")} :</span><span>${this.composeNote(aDevoir.noteMax, { bareme: aDevoir.bareme, baremeParDefaut: aDevoir.baremeParDefaut })}&nbsp;</span></div>`,
				`<div class="ie-texte"><span>${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.NoteMin")} :</span><span>${this.composeNote(aDevoir.noteMin, { bareme: aDevoir.bareme, baremeParDefaut: aDevoir.baremeParDefaut })}&nbsp;</span></div>`,
				`<div class="ie-texte"><span>${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.Coefficient")} :</span><span>${aDevoir.coefficient}&nbsp;</span></div>`,
				"</div>",
				lAvecCommentaireSurNote
					? IE.jsx.str(
							"div",
							{ class: ["comment-note"] },
							IE.jsx.str(
								"div",
								{ class: "ie-titre" },
								ObjetTraduction_1.GTraductions.getValeur(
									"DernieresNotes.Detail.CommentaireProf",
								),
							),
							IE.jsx.str(
								"div",
								{ class: "commentaire" },
								aDevoir.commentaireSurNote,
							),
						)
					: "",
				"</article>",
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
					lLienKiosque
						? `<div class="m-left-l details-pj">${lLienKiosque}</div>`
						: "",
					aParams.libelleInfoSessionRattrapage
						? `<div class="m-left-l ie-titre-petit">${aParams.libelleInfoSessionRattrapage}</div>`
						: "",
					lStrQCMDejaRealise
						? `<div class="m-left-l ie-titre-petit">${lStrQCMDejaRealise}</div>`
						: "",
					lStrDevFacultatif
						? `<div class="m-left-l ie-titre-petit">${lStrDevFacultatif}</div>`
						: "",
					aDevoir.estRamenerSur20 ||
						(aDevoir.devoirInitial && aDevoir.devoirInitial.estRamenerSur20)
						? `<div class="m-left-l ie-titre-petit">${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.NoteRameneeSur", [(aDevoir.baremeParDefaut ? aDevoir.baremeParDefaut : aDevoir.service ? aDevoir.service.baremeService : GParametres.baremeNotation).getValeur()])}</div>`
						: "",
					`</article>`,
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
					`<header class="infos-note flex-contain flex-center justify-between">`,
					`<!--<i class="header-icon icon_saisie_note" aria-hidden="true"></i>-->`,
					`<div class="ie-titre fluid-bloc m-right-l">${lStrService}</div>`,
					`<ie-bouton ie-model="btnCalculMoyenne('${aService.getNumero()}')" class="small-bt fix-bloc">${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.DetailsMethodeCalcMoy")}</ie-bouton>`,
					`</header>`,
				);
			} else {
				H.push(
					'<header class="nav-prec-suiv">',
					`<ie-btnicon ie-model="surClicPrecSuiv('${aService.getNumero()}',${aService.getGenre()}, false)" class="icon_angle_left" aria-label="${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.SelectionneMatPrec")}"></ie-btnicon>`,
					`<h4 class="ie-titre text-center">${lStrService}</h4>`,
					`<ie-btnicon ie-model="surClicPrecSuiv('${aService.getNumero()}',${aService.getGenre()}, true)" class="icon_angle_right" aria-label="${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.SelectionneMatSuiv")}"></ie-btnicon>`,
					"</header>",
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
					'<article class="details m-y-xl">',
					'<div class="details-notes">',
					lMoyEtudiant
						? `<div class="ie-titre-couleur-lowercase"><span>${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.MoyenneEtudiant")} :</span><span>${lMoyEtudiant}&nbsp;</span></div>`
						: "",
					lMoyClasse
						? `<div class="ie-texte"><span>${aParams.libelleMoyenneDuPublicService} :</span><span>${lMoyClasse}&nbsp;</span></div>`
						: "",
					lMoyMax
						? `<div class="ie-texte"><span>${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.MoyenneMax")} :</span><span>${lMoyMax}&nbsp;</span></div>`
						: "",
					lMoyMin
						? `<div class="ie-texte"><span>${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.MoyenneMin")} :</span><span>${lMoyMin}&nbsp;</span></div>`
						: "",
					lNbrNotes !== null
						? `<div class="ie-texte"><span>${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.NombreDeNotes")} :</span><span>${lNbrNotes}&nbsp;</span></div>`
						: "",
					"</div>",
					"</article>",
				);
			}
			if (aService.estMoyNR) {
				H.push(
					"<article>",
					`<div class="m-left-l ie-titre-petit"><span class="notation_pastille_moy_NR m-right">${ObjetTraduction_1.GTraductions.getValeur("Notes.Colonne.TitreMoyNR")}</span>${ObjetTraduction_1.GTraductions.getValeur("Notes.Colonne.HintMoyenneNR")}</div>`,
					"</article>",
				);
			}
			if (!!aService.avecDetailDevoirsNonPublie) {
				H.push(
					'<article class="m-left-l">',
					ObjetTraduction_1.GTraductions.getValeur(
						"DernieresNotes.Detail.NoteDuServiceNonPubliees",
					),
					"</article>",
				);
			}
			if (IE.estMobile) {
				H.push(
					`<article class="btnMethodeCalcul"><ie-bouton ie-model="btnCalculMoyenne('${aService.getNumero()}')" class="small-bt">${ObjetTraduction_1.GTraductions.getValeur("DernieresNotes.Detail.DetailsMethodeCalcMoy")}</ie-bouton></article>`,
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
