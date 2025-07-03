exports.GestionnaireBlocCDC = exports.EGenreBtnActionBlocCDC = void 0;
const ObjetStyle_1 = require("ObjetStyle");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const GestionnaireBlocPN_1 = require("GestionnaireBlocPN");
const GestionnaireBlocPN_2 = require("GestionnaireBlocPN");
const Enumere_Bloc_1 = require("Enumere_Bloc");
const Enumere_ModeAffichageTimeline_1 = require("Enumere_ModeAffichageTimeline");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Espace_1 = require("Enumere_Espace");
const TypeOrigineCreationCategorieCahierDeTexte_1 = require("TypeOrigineCreationCategorieCahierDeTexte");
const UtilitaireUrl_1 = require("UtilitaireUrl");
var EGenreBtnActionBlocCDC;
(function (EGenreBtnActionBlocCDC) {
	EGenreBtnActionBlocCDC[(EGenreBtnActionBlocCDC["executionQCM"] = 1)] =
		"executionQCM";
	EGenreBtnActionBlocCDC[(EGenreBtnActionBlocCDC["navigationTAF"] = 2)] =
		"navigationTAF";
})(
	EGenreBtnActionBlocCDC ||
		(exports.EGenreBtnActionBlocCDC = EGenreBtnActionBlocCDC = {}),
);
class GestionnaireBlocCDC extends GestionnaireBlocPN_1.GestionnaireBlocPN {
	constructor(...aParams) {
		super(...aParams);
		this.setGenreBloc(Enumere_Bloc_1.EGenreBloc.ContenuDeCours);
		const lOptions = {
			modeAffichage:
				Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.classique,
			initPlie: false,
			callBackTitre: undefined,
			avecNomProfDansTitre: true,
			avecTitrePremierContenuDansTitre: false,
		};
		$.extend(this._options, lOptions);
	}
	getParamsBloc(aDataBloc) {
		const lInstanceMetier = this.getInstanceObjetMetier(
			aDataBloc,
			ObjetBlocCDC,
		);
		const lParamBloc = lInstanceMetier.getParamsBloc();
		$.extend(lParamBloc, {
			htmlContenu: this.composeZoneInstance(lInstanceMetier),
		});
		return lParamBloc;
	}
}
exports.GestionnaireBlocCDC = GestionnaireBlocCDC;
class ObjetBlocCDC extends GestionnaireBlocPN_2.ObjetBlocPN {
	constructor() {
		super(...arguments);
		this.peuFaireTAF = [
			Enumere_Espace_1.EGenreEspace.Eleve,
			Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
		].includes(GEtatUtilisateur.GenreEspace);
		this.pourEleve = [
			Enumere_Espace_1.EGenreEspace.Eleve,
			Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
			Enumere_Espace_1.EGenreEspace.Parent,
			Enumere_Espace_1.EGenreEspace.Mobile_Parent,
			Enumere_Espace_1.EGenreEspace.Accompagnant,
			Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
			Enumere_Espace_1.EGenreEspace.Tuteur,
			Enumere_Espace_1.EGenreEspace.Mobile_Tuteur,
		].includes(GEtatUtilisateur.GenreEspace);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			executerQCM: function (aIndiceContenu, aIndiceQCM) {
				$(this.node).on("click", (aEvent) => {
					const lQCM = aInstance.getQCM(aIndiceContenu, aIndiceQCM);
					aInstance.declencherCallback({
						donnee: lQCM,
						genreEvnt: EGenreBtnActionBlocCDC.executionQCM,
						param: { event: aEvent },
					});
				});
			},
			navigationTAF: {
				event: function (aEvent) {
					const lDonnee = aInstance.getDonnee();
					aInstance.declencherCallback({
						donnee: lDonnee,
						genreEvnt: EGenreBtnActionBlocCDC.navigationTAF,
						param: { event: aEvent },
					});
				},
			},
		});
	}
	declencherCallback(aParam) {
		if (this.Pere && this.Evenement) {
			this.callback.appel(aParam.donnee, aParam.genreEvnt, aParam.param);
		}
	}
	construireStructureAffichage() {
		const H = [];
		if (this.donneesRecues && this.donnee) {
			const lDonnee = this.getDonnee();
			let lStyle =
				' style="overflow-x:auto; max-width:' +
				($("#" + this.Nom.escapeJQ()).outerWidth(true) - 10) +
				'px;"';
			if (this._options.estfenetre) {
				lStyle =
					' style="overflow-x:auto; max-width:' +
					(GNavigateur.ecranL - 100 - 20) +
					'px;"';
			}
			H.push('<div class="PourFenetreBloc_Contenu"', lStyle, ">");
			if (lDonnee && "listeContenus" in lDonnee && lDonnee.listeContenus) {
				for (let i = 0; i < lDonnee.listeContenus.count(); i++) {
					const lContenu = lDonnee.listeContenus.get(i);
					H.push(this._composeContenu(lContenu, i));
				}
			}
			const lOngletPublie = GEtatUtilisateur.listeOnglets.getElementParGenre(
				Enumere_Onglet_1.EGenreOnglet.CDT_TAF,
			);
			if (
				lDonnee &&
				"dateTAF" in lDonnee &&
				lDonnee.dateTAF &&
				(this._options.modeAffichage ===
					Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.classique ||
					this._options.modeAffichage ===
						Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.compact) &&
				!this._options.cacherBoutonTAF &&
				!!lOngletPublie &&
				!!lOngletPublie.Actif
			) {
				H.push(
					'<div class="EspaceGauche EspaceBas"><ie-bouton ie-model="navigationTAF" class="',
					Type_ThemeBouton_1.TypeThemeBouton.secondaire,
					'" style="width:',
					150,
					'px; white-space: normal; height: auto; padding: 3px 0; margin-top: 5px;">',
					ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.voirTAF"),
					"</ie-bouton></div>",
				);
			}
			if (
				lDonnee &&
				"listeElementsProgrammeCDT" in lDonnee &&
				lDonnee.listeElementsProgrammeCDT &&
				lDonnee.listeElementsProgrammeCDT.count()
			) {
				if (
					lDonnee &&
					lDonnee.listeContenus &&
					lDonnee.listeContenus.count() > 0
				) {
					H.push(_composeSeparateur(GCouleur.themeCouleur.claire, 90));
				}
				H.push(_composeElementsProgramme.call(this, lDonnee));
			}
			H.push("</div>");
		}
		return H.join("");
	}
	getDonnee() {
		const lRessource =
			this.donnee.ressources && this.donnee.ressources.getPremierElement()
				? this.donnee.ressources.getPremierElement()
				: null;
		return lRessource ? lRessource.elementOriginal : this.donnee;
	}
	estBlocFerme() {
		return this._options.initPlie;
	}
	eventPropagationTitre(event) {
		if (
			this._options.modeAffichage ===
				Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.grille &&
			event.target &&
			!event.target.className.includes("celluleMarqueur")
		) {
			if (this._options.callBackTitre) {
				this.callbackTitre();
			}
			event.stopPropagation();
		}
	}
	getCouleurMarqueur() {
		return this.donnee.CouleurFond;
	}
	getCouleurFondTitre() {
		let lResult = "#ffffff";
		if (this.getPremierCategorieDSouEva().length > 0) {
			lResult = GCouleur.themeCouleur.claire;
		}
		return lResult;
	}
	getPremierCategorieDSouEva() {
		const lResult = [];
		const lGenreDejaAjoutes = [];
		const lDonnee = this.getDonnee();
		if (lDonnee && "listeContenus" in lDonnee && lDonnee.listeContenus) {
			for (let i = 0; i < lDonnee.listeContenus.count(); i++) {
				const lContenu = lDonnee.listeContenus.get(i);
				if (
					[
						TypeOrigineCreationCategorieCahierDeTexte_1
							.TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir,
						TypeOrigineCreationCategorieCahierDeTexte_1
							.TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation,
					].includes(lContenu.categorie.getGenre()) &&
					!lGenreDejaAjoutes.includes(lContenu.categorie.getGenre())
				) {
					lResult.push(lContenu.categorie);
					lGenreDejaAjoutes.push(lContenu.categorie.getGenre());
				}
			}
		}
		return lResult;
	}
	getTitre() {
		const lHtml = [];
		if (
			this._options.modeAffichage !==
			Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.compact
		) {
			lHtml.push(
				"<div>",
				this.donnee
					? this.donnee.getLibelle() || this.donnee.Matiere.getLibelle()
					: "",
				"</div>",
			);
		} else {
			let lTitreContenuDeCours = "";
			const lDonneeCDC = this.getDonnee();
			if (
				!!lDonneeCDC &&
				"listeContenus" in lDonneeCDC &&
				!!lDonneeCDC.listeContenus &&
				lDonneeCDC.listeContenus.count() > 0
			) {
				const lPremierContenu = lDonneeCDC.listeContenus.getPremierElement();
				if (!!lPremierContenu && lPremierContenu.getLibelle()) {
					lTitreContenuDeCours = lPremierContenu.getLibelle();
				}
			}
			lHtml.push(lTitreContenuDeCours);
		}
		return lHtml.join("");
	}
	callbackTitre() {
		if (this._options.callBackTitre) {
			this._options.callBackTitre(this.donnee);
		}
	}
	getInfoSsTitre() {
		const T = [];
		const lDonnee = this.getDonnee();
		const lCategories = this.getPremierCategorieDSouEva();
		if (
			this._options.modeAffichage ===
				Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.grille &&
			lCategories.length > 0
		) {
			T.push('<div class="NoWrap" style="float:right;">');
			for (const lCategorie of lCategories) {
				T.push(
					`<i class="${TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexteUtil.getIcone(lCategorie.getGenre())}" role="presentation">${lCategorie.libelleIcone || ""}</i>`,
				);
			}
			T.push("</div>");
		}
		if (this._options.avecNomProfDansTitre) {
			if ("listeProfesseurs" in lDonnee && lDonnee.listeProfesseurs) {
				T.push(lDonnee.listeProfesseurs.getTableauLibelles().join(", "));
			}
		}
		if (
			this._options.avecTitrePremierContenuDansTitre &&
			"listeContenus" in lDonnee &&
			lDonnee.listeContenus &&
			lDonnee.listeContenus.count() > 0
		) {
			T.push(lDonnee.listeContenus.getLibelle(0));
		}
		return {
			avecInfo:
				this._options.modeAffichage !==
				Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.compact,
			strInfo: T.join(""),
		};
	}
	getInfoTitre() {
		const lHtml = [];
		const lDonnee = this.getDonnee();
		if (lDonnee && lDonnee.Date) {
			const lDonneeHoraire = [];
			if (
				this._options.modeAffichage !==
				Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.compact
			) {
				lDonneeHoraire.push(
					"<div>",
					ObjetDate_1.GDate.formatDate(
						lDonnee.Date,
						ObjetTraduction_1.GTraductions.getValeur("De").ucfirst() +
							" %hh%sh%mm",
					),
					"DateFin" in lDonnee && lDonnee.DateFin
						? ObjetDate_1.GDate.formatDate(
								lDonnee.DateFin,
								" " +
									ObjetTraduction_1.GTraductions.getValeur("A") +
									" %hh%sh%mm",
							)
						: "",
					"</div>",
				);
			}
			const lStyleSpan = [];
			if (
				this._options.modeAffichage ===
				Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.compact
			) {
				lStyleSpan.push("font-weight: 500;");
				lStyleSpan.push("font-size: 1.3em;");
			}
			lHtml.push(
				'<div class="Espace">',
				'<span style="',
				lStyleSpan.join(""),
				'">',
				this._options.formatDate
					? ObjetDate_1.GDate.formatDate(lDonnee.Date, this._options.formatDate)
					: "",
				"</span>",
				lDonneeHoraire.join(""),
				"</div>",
			);
		}
		return {
			avecInfo:
				this._options.modeAffichage !==
				Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.grille,
			strInfo: lHtml.join(""),
			alignement: "AlignementDroit AlignementHaut",
		};
	}
	avecOmbre() {
		return (
			this._options.modeAffichage ===
				Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.classique &&
			this._options.avecOmbre !== false
		);
	}
	avecBordure() {
		return (
			this._options.modeAffichage ===
				Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.grille &&
			this._options.avecBordure
		);
	}
	cacherBoutonTAF() {
		return this._options.cacherBoutonTAF;
	}
	getWidthColDroite() {
		return super.getWidthColDroite(0);
	}
	getAvecDocuments() {
		return false;
	}
	getContenu(aIndiceContenu) {
		let lContenu;
		const lDonnee = this.getDonnee();
		if (lDonnee && "listeContenus" in lDonnee && lDonnee.listeContenus) {
			lContenu = lDonnee.listeContenus.get(aIndiceContenu);
		}
		return lContenu;
	}
	getDocument(aIndiceContenu, aIndiceDocument) {
		let lDocument;
		const lContenu = this.getContenu(aIndiceContenu);
		if (lContenu && lContenu.ListePieceJointe) {
			lDocument = lContenu.ListePieceJointe.get(aIndiceDocument);
		}
		return lDocument;
	}
	getQCM(aIndiceContenu, aIndiceQCM) {
		let lQCM;
		const lContenu = this.getContenu(aIndiceContenu);
		if (lContenu && lContenu.listeExecutionQCM) {
			lQCM = lContenu.listeExecutionQCM.get(aIndiceQCM);
		}
		return lQCM;
	}
	getTabBtnActions() {
		return;
	}
	avecMenuContextuel() {
		return false;
	}
	_composeContenu(aContenu, aIndice) {
		const lHtml = [];
		if (aIndice > 0) {
			lHtml.push(
				'<div class="EspaceHaut">',
				_composeSeparateur(GCouleur.themeNeutre.moyen1),
				"</div>",
			);
		}
		const lTestImage =
			aContenu.categorie &&
			aContenu.categorie.getGenre() &&
			TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexteUtil.estTypeAvecIcone(
				aContenu.categorie.getGenre(),
			);
		lHtml.push(
			'<div class="EspaceGauche EspaceHaut PetitEspaceBas AvecSelectionTexte">',
		);
		if (lTestImage || aContenu.categorie.Libelle || aContenu.getLibelle()) {
			let lAfficheCommeBlocTitre = false;
			let lTitreContenu = "";
			if (
				this._options.modeAffichage !==
					Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.compact ||
				aIndice > 0
			) {
				lTitreContenu = aContenu.getLibelle();
				if (
					this._options.modeAffichage ===
					Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.compact
				) {
					lAfficheCommeBlocTitre = true;
				}
			}
			lHtml.push(
				'<div class="flex-contain">',
				'<div class="',
				lAfficheCommeBlocTitre ? " Bloc_Titre" : "",
				' fluid-bloc">',
				lTitreContenu,
				"</div>",
				aContenu.categorie.Libelle
					? '<div class="fix-bloc p-left-s">' +
							aContenu.categorie.Libelle +
							"</div>"
					: "",
				!lTestImage
					? ""
					: `<i class="${TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexteUtil.getIcone(aContenu.categorie.getGenre())}" role="presentation">${aContenu.categorie.libelleIcone || ""}</i>`,
				"</div>",
			);
		}
		lHtml.push("<div>", aContenu.descriptif, "</div>");
		lHtml.push("</div>");
		if (
			(aContenu.ListePieceJointe && aContenu.ListePieceJointe.count() > 0) ||
			(aContenu.listeExecutionQCM && aContenu.listeExecutionQCM.count() > 0)
		) {
			lHtml.push(_composeEspaceDocuments.call(this, aContenu, aIndice));
		}
		return lHtml.join("");
	}
}
function _composeElementsProgramme(aDonnee) {
	const lHtml = [];
	lHtml.push(
		'<div class="Espace">',
		'<div class="Gras">',
		ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.ElementsProgramme"),
		" :",
		"</div>",
		"<ul>",
	);
	aDonnee.listeElementsProgrammeCDT.parcourir((aElementProgrammeCDT) => {
		lHtml.push("<li>", aElementProgrammeCDT.getLibelle(), "</li>");
	});
	lHtml.push("</ul>", "</div>");
	return lHtml.join("");
}
function _composeSeparateur(aCouleur, aLargeurEnPourcentage) {
	const lWidth = !!aLargeurEnPourcentage
		? "width: " + aLargeurEnPourcentage + "%;"
		: "";
	return (
		'<hr style="' + lWidth + "border: solid 1px; color: " + aCouleur + '" />'
	);
}
function _composeEspaceDocuments(aContenu, aIndiceContenu) {
	const H = [];
	let lListeDocuments = "";
	const lListeQCM = [];
	if (aContenu.ListePieceJointe) {
		lListeDocuments = UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
			aContenu.ListePieceJointe,
		);
	}
	if (aContenu.listeExecutionQCM) {
		for (let j = 0; j < aContenu.listeExecutionQCM.count(); j++) {
			const lExecutionQCM = aContenu.listeExecutionQCM.get(j);
			const lIENode =
				' ie-node="executerQCM(' + aIndiceContenu + ", " + j + ')"';
			lListeQCM.push(
				'<div class="AvecMain Lien"',
				lIENode,
				">",
				lExecutionQCM.QCM.getLibelle(),
				"</div>",
			);
		}
	}
	H.push(
		'<div class="Espace" style="',
		ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.fond),
		'margin:10px 5px;">',
	);
	H.push(
		'<div style="',
		ObjetStyle_1.GStyle.composeCouleurTexte(GCouleur.grisTresFonce),
		'">',
		ObjetTraduction_1.GTraductions.getValeur("Agenda.Documents"),
		"</div>",
	);
	H.push("<div>", lListeDocuments, "</div>");
	if (aContenu.listeExecutionQCM && aContenu.listeExecutionQCM.count()) {
		H.push(
			'<i role="presentation" class="icon_qcm ThemeCat-pedagogie AlignementMilieuVertical"></i><div class="InlineBlock">',
			ObjetTraduction_1.GTraductions.getValeur(
				"ExecutionQCM.RepondreQCMContenu",
			),
			" : </div>",
			'<div class="InlineBlock">',
			lListeQCM.join(""),
			" </div>",
		);
	}
	H.push("</div>");
	return H.join("");
}
