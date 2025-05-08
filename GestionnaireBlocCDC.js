const { GStyle } = require("ObjetStyle.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { GDate } = require("ObjetDate.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GestionnaireBlocPN } = require("GestionnaireBlocPN.js");
const { ObjetBlocPN } = require("GestionnaireBlocPN.js");
const { EGenreBloc } = require("Enumere_Bloc.js");
const { EModeAffichageTimeline } = require("Enumere_ModeAffichageTimeline.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const {
	TypeOrigineCreationCategorieCahierDeTexte,
	TypeOrigineCreationCategorieCahierDeTexteUtil,
} = require("TypeOrigineCreationCategorieCahierDeTexte.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const EGenreBtnActionBlocCDC = { executionQCM: 1, navigationTAF: 2 };
class GestionnaireBlocCDC extends GestionnaireBlocPN {
	constructor(...aParams) {
		super(...aParams);
		this.setGenreBloc(EGenreBloc.ContenuDeCours);
		const lOptions = {
			modeAffichage: EModeAffichageTimeline.classique,
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
class ObjetBlocCDC extends ObjetBlocPN {
	constructor(...aParams) {
		super(...aParams);
		this.peuFaireTAF = [EGenreEspace.Eleve, EGenreEspace.Mobile_Eleve].includes(
			GEtatUtilisateur.GenreEspace,
		);
		this.pourEleve = [
			EGenreEspace.Eleve,
			EGenreEspace.Mobile_Eleve,
			EGenreEspace.Parent,
			EGenreEspace.Mobile_Parent,
			EGenreEspace.Accompagnant,
			EGenreEspace.Mobile_Accompagnant,
			EGenreEspace.Tuteur,
			EGenreEspace.Mobile_Tuteur,
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
			if (lDonnee && lDonnee.listeContenus) {
				for (let i = 0; i < lDonnee.listeContenus.count(); i++) {
					const lContenu = lDonnee.listeContenus.get(i);
					H.push(_composeContenu.call(this, lContenu, i));
				}
			}
			const lOngletPublie = GEtatUtilisateur.listeOnglets.getElementParGenre(
				EGenreOnglet.CDT_TAF,
			);
			if (
				lDonnee.dateTAF &&
				(this._options.modeAffichage === EModeAffichageTimeline.classique ||
					this._options.modeAffichage === EModeAffichageTimeline.compact) &&
				!this._options.cacherBoutonTAF &&
				!!lOngletPublie &&
				!!lOngletPublie.Actif
			) {
				H.push(
					'<div class="EspaceGauche EspaceBas"><ie-bouton ie-model="navigationTAF" class="',
					TypeThemeBouton.secondaire,
					'" style="width:',
					150,
					'px; white-space: normal; height: auto; padding: 3px 0; margin-top: 5px;">',
					GTraductions.getValeur("CahierDeTexte.voirTAF"),
					"</ie-bouton></div>",
				);
			}
			if (
				lDonnee &&
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
			this._options.modeAffichage === EModeAffichageTimeline.grille &&
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
		const lDonnee = this.getDonnee();
		if (lDonnee && lDonnee.listeContenus) {
			for (let i = 0; i < lDonnee.listeContenus.count(); i++) {
				const lContenu = lDonnee.listeContenus.get(i);
				if (
					[
						TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir,
						TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation,
					].includes(lContenu.categorie.getGenre()) &&
					!lResult.includes(lContenu.categorie.getGenre())
				) {
					lResult.push(lContenu.categorie.getGenre());
				}
			}
		}
		return lResult;
	}
	getTitre() {
		const lHtml = [];
		if (this._options.modeAffichage !== EModeAffichageTimeline.compact) {
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
		const lGenres = this.getPremierCategorieDSouEva();
		if (
			this._options.modeAffichage === EModeAffichageTimeline.grille &&
			lGenres.length > 0
		) {
			T.push('<div class="NoWrap" style="float:right;">');
			for (const item in lGenres) {
				T.push(
					'<div class="InlineBlock PetitEspaceGauche AlignementMilieuVertical">',
					_composeSymboleCategorie(lGenres[item]),
					"</div>",
				);
			}
			T.push("</div>");
		}
		if (this._options.avecNomProfDansTitre) {
			if (lDonnee.listeProfesseurs) {
				T.push(lDonnee.listeProfesseurs.getTableauLibelles().join(", "));
			}
		}
		if (
			this._options.avecTitrePremierContenuDansTitre &&
			lDonnee.listeContenus &&
			lDonnee.listeContenus.count() > 0
		) {
			T.push(lDonnee.listeContenus.getLibelle(0));
		}
		return {
			avecInfo: this._options.modeAffichage !== EModeAffichageTimeline.compact,
			strInfo: T.join(""),
		};
	}
	getInfoTitre() {
		const lHtml = [];
		const lDonnee = this.getDonnee();
		if (lDonnee && lDonnee.Date) {
			const lDonneeHoraire = [];
			if (this._options.modeAffichage !== EModeAffichageTimeline.compact) {
				lDonneeHoraire.push(
					"<div>",
					GDate.formatDate(
						lDonnee.Date,
						GTraductions.getValeur("De").ucfirst() + " %hh%sh%mm",
					),
					lDonnee.DateFin
						? GDate.formatDate(
								lDonnee.DateFin,
								" " + GTraductions.getValeur("A") + " %hh%sh%mm",
							)
						: "",
					"</div>",
				);
			}
			const lStyleSpan = [];
			if (this._options.modeAffichage === EModeAffichageTimeline.compact) {
				lStyleSpan.push("font-weight: 500;");
				lStyleSpan.push("font-size: 1.3em;");
			}
			lHtml.push(
				'<div class="Espace">',
				'<span style="',
				lStyleSpan.join(""),
				'">',
				this._options.formatDate
					? GDate.formatDate(lDonnee.Date, this._options.formatDate)
					: "",
				"</span>",
				lDonneeHoraire.join(""),
				"</div>",
			);
		}
		return {
			avecInfo: this._options.modeAffichage !== EModeAffichageTimeline.grille,
			strInfo: lHtml.join(""),
			alignement: "AlignementDroit AlignementHaut",
		};
	}
	avecOmbre() {
		return (
			this._options.modeAffichage === EModeAffichageTimeline.classique &&
			this._options.avecOmbre !== false
		);
	}
	avecBordure() {
		return (
			this._options.modeAffichage === EModeAffichageTimeline.grille &&
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
		if (lDonnee && lDonnee.listeContenus) {
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
	getTabBtnActions() {}
	avecMenuContextuel() {
		return false;
	}
}
function _composeSymboleCategorie(aGenre) {
	const T = [];
	T.push(
		'<div class="',
		TypeOrigineCreationCategorieCahierDeTexteUtil.getImage(aGenre),
		' AlignementHaut" style="width:17px"></div>',
	);
	return T.join("");
}
function _composeElementsProgramme(aDonnee) {
	const lHtml = [];
	lHtml.push(
		'<div class="Espace">',
		'<div class="Gras">',
		GTraductions.getValeur("CahierDeTexte.ElementsProgramme"),
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
function _composeContenu(aContenu, aIndice) {
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
		TypeOrigineCreationCategorieCahierDeTexteUtil.estTypeAvecImage(
			aContenu.categorie.getGenre(),
		);
	lHtml.push(
		'<div class="EspaceGauche EspaceHaut PetitEspaceBas AvecSelectionTexte">',
	);
	if (lTestImage || aContenu.categorie.Libelle || aContenu.getLibelle()) {
		let lAfficheCommeBlocTitre = false;
		let lTitreContenu = "";
		if (
			this._options.modeAffichage !== EModeAffichageTimeline.compact ||
			aIndice > 0
		) {
			lTitreContenu = aContenu.getLibelle();
			if (this._options.modeAffichage === EModeAffichageTimeline.compact) {
				lAfficheCommeBlocTitre = true;
			}
		}
		lHtml.push(
			'<div class="NoWrap AlignementGauche" style="display:flex; align-items: flex-start;">',
			'<div class="',
			lAfficheCommeBlocTitre ? " Bloc_Titre" : "",
			'" style="flex: 1 1 auto;">',
			lTitreContenu,
			"</div>",
			aContenu.categorie.Libelle
				? '<div style="flex: none; padding-left: 3px;">' +
						aContenu.categorie.Libelle +
						"</div>"
				: "",
			!lTestImage
				? ""
				: '<div style="flex: none; padding-left: 5px;">' +
						_composeSymboleCategorie(aContenu.categorie.getGenre()) +
						"</div>",
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
function _composeEspaceDocuments(aContenu, aIndiceContenu) {
	const H = [];
	let lListeDocuments = "";
	const lListeQCM = [];
	if (aContenu.ListePieceJointe) {
		lListeDocuments = UtilitaireUrl.construireListeUrls(
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
		GStyle.composeCouleurFond(GCouleur.fond),
		'margin:10px 5px;">',
	);
	H.push(
		'<div style="',
		GStyle.composeCouleurTexte(GCouleur.grisTresFonce),
		'">',
		GTraductions.getValeur("Agenda.Documents"),
		"</div>",
	);
	H.push("<div>", lListeDocuments, "</div>");
	if (aContenu.listeExecutionQCM && aContenu.listeExecutionQCM.count()) {
		H.push(
			'<i class="icon_qcm ThemeCat-pedagogie AlignementMilieuVertical"></i><div class="InlineBlock">',
			GTraductions.getValeur("ExecutionQCM.RepondreQCMContenu"),
			" : </div>",
			'<div class="InlineBlock">',
			lListeQCM.join(""),
			" </div>",
		);
	}
	H.push("</div>");
	return H.join("");
}
module.exports = { GestionnaireBlocCDC, EGenreBtnActionBlocCDC };
