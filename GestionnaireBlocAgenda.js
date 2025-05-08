const { TypeDroits } = require("ObjetDroitsPN.js");
const { GestionnaireBlocPN } = require("GestionnaireBlocPN.js");
const { ObjetBlocPN } = require("GestionnaireBlocPN.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GHtml } = require("ObjetHtml.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { GPosition } = require("ObjetPosition.js");
const { TypeGenreEvenementAgenda } = require("TypeGenreEvenementAgenda.js");
const { EGenreBloc } = require("Enumere_Bloc.js");
const { GDate } = require("ObjetDate.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { GImage } = require("ObjetImage.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { GChaine } = require("ObjetChaine.js");
const { UtilitaireVisios } = require("UtilitaireVisiosSco.js");
const { tag } = require("tag.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const EGenreEvntMenuAgenda = {
	creerElementAgenda: 1,
	CopierElementAgenda: 2,
	CollerElementAgenda: 3,
	ModifierElementAgenda: 4,
	SupprimerElementAgenda: 5,
	DupliquerElementAgenda: 6,
};
class GestionnaireBlocAgenda extends GestionnaireBlocPN {
	constructor(...aParams) {
		super(...aParams);
		this.setGenreBloc(EGenreBloc.Agenda);
		const lOptions = { modeReduit: false };
		$.extend(this._options, lOptions);
	}
	getParamsBloc(aDataBloc) {
		const lInstanceAgenda = this.getInstanceObjetMetier(
			aDataBloc,
			ObjetBlocAgendaTemporaire,
		);
		const lParamBloc = lInstanceAgenda.getParamsBloc();
		$.extend(lParamBloc, {
			htmlContenu: this.composeZoneInstance(lInstanceAgenda),
		});
		return lParamBloc;
	}
}
class ObjetBlocAgendaTemporaire extends ObjetBlocPN {
	constructor(...aParams) {
		super(...aParams);
		this.avecPublicationPageEtablissement = GApplication.droits.get(
			TypeDroits.communication.avecPublicationPageEtablissement,
		);
	}
	setParametres(aElement, aOptions) {
		super.setParametres(aElement, aOptions);
		this.elementAgenda = aElement;
	}
	construireStructureAffichage() {
		if (!this.donneesRecues) {
			return "";
		}
		const H = [];
		let lWidth = $("#" + this.Nom.escapeJQ()).outerWidth(true);
		if (this.avecMenuContextuel()) {
			lWidth += this.getWidthBtnAction();
		}
		let lMaxWidth;
		if (this._options.estfenetre) {
			lMaxWidth = GNavigateur.ecranL - 100 - 20;
		} else {
			lMaxWidth = lWidth;
		}
		H.push(
			'<div class="PourFenetreBloc_Contenu" style="overflow-x:auto; max-width:',
			lMaxWidth,
			'px;">',
		);
		H.push(_composeElement(this.elementAgenda, this._options));
		H.push("</div>");
		return H.join("");
	}
	construireInstances() {}
	recupererDonnees() {}
	getWidthColDroite() {
		return super.getWidthColDroite(150);
	}
	getWidthBtnAction() {
		return super.getWidthBtnAction(120);
	}
	getGenreRessourceDocuments() {
		return EGenreRessource.DocJointEtablissement;
	}
	getAvecDocuments() {
		return (
			this.elementAgenda.listeDocJoints &&
			this.elementAgenda.listeDocJoints.count() > 0
		);
	}
	getListeDocuments() {
		return this.elementAgenda.listeDocJoints;
	}
	getInfoSsTitre() {
		const lParams = { sansHoraire: this.elementAgenda.sansHoraire };
		const strDate = GDate.strDates(
			this.elementAgenda.DateDebut,
			this.elementAgenda.DateFin,
			lParams,
		);
		return { avecInfo: true, strInfo: strDate };
	}
	getInfoTitre() {
		const lStrInfoTitre = [];
		const eleves = this.elementAgenda.listeEleves
			? this.elementAgenda.listeEleves.join(", ")
			: "";
		if (this.elementAgenda.estPeriodique) {
			lStrInfoTitre.push(
				'<div class="p-bottom"><i ie-hint="<div>',
				GTraductions.getValeur("Agenda.AgendaHintEvtPEriodique"),
				"</div><div class='PetitEspaceHaut Italique'>",
				this.elementAgenda.periodicite.libelleDescription,
				'</div>" class="icon_refresh" style="font-size:1.6rem;"></i></div>',
			);
		}
		if (
			[
				EGenreEspace.Professeur,
				EGenreEspace.PrimProfesseur,
				EGenreEspace.PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace) &&
			(this.elementAgenda.getGenre() ===
				TypeGenreEvenementAgenda.tgea_Standard ||
				this.elementAgenda.getGenre() ===
					TypeGenreEvenementAgenda.tgea_StandardPeriodique)
		) {
			const publication = !!this.elementAgenda.publie
				? GTraductions.getValeur("Agenda.Partage")
				: GTraductions.getValeur("Agenda.NonPartage");
			const classeImage = !!this.elementAgenda.publie
				? "Image_Publie"
				: "Image_NonPublie";
			const lPageEtab =
				this.avecPublicationPageEtablissement &&
				this.elementAgenda.publie &&
				this.elementAgenda.publicationPageEtablissement
					? `<i class="icon_ecole m-right" style="font-size:1.6rem;" role="img" title="${GTraductions.getValeur("Fenetre_SaisieAgenda.partageSurPageEtablissement")}" aria-label="${GTraductions.getValeur("Fenetre_SaisieAgenda.partageSurPageEtablissement")}"></i>`
					: "";
			lStrInfoTitre.push(
				'<div class="inline-flex">' +
					lPageEtab +
					GImage.composeImage(classeImage, 18, false) +
					' <span class="p-left">' +
					publication +
					"</span></div>",
			);
		}
		if (
			GEtatUtilisateur.GenreEspace === EGenreEspace.Parent ||
			GEtatUtilisateur.GenreEspace === EGenreEspace.PrimParent
		) {
			lStrInfoTitre.push(eleves);
		}
		return { avecInfo: true, strInfo: lStrInfoTitre.join("") };
	}
	getCouleurMarqueur() {
		return this.elementAgenda.CouleurCellule;
	}
	getTitre() {
		return this.elementAgenda.getLibelle();
	}
	avecMenuContextuel() {
		const lValeur =
			!!GApplication.droits.get(TypeDroits.agenda.avecSaisieAgenda) &&
			!!this.elementAgenda.proprietaire;
		return super.avecMenuContextuel(lValeur);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnMenuCtx: {
				event: function () {
					const lElt = this.node;
					aInstance.evntMenuCtx({ id: lElt.id });
				},
			},
		});
	}
	evntMenuCtx(aParam) {
		ObjetMenuContextuel.afficher({
			pere: this,
			evenement: this.evntSurMenuContextuel,
			initCommandes: this.initCmdsMenuContextuel,
			id: {
				x: GPosition.getLeft(aParam.id),
				y: GPosition.getTop(aParam.id) + GPosition.getHeight(aParam.id) + 2,
			},
		});
	}
	initCmdsMenuContextuel(aMenu) {
		const lAvecSaisie = GApplication.droits.get(
			TypeDroits.agenda.avecSaisieAgenda,
		);
		const lAgenda = this.elementAgenda;
		this._objGestionFocus_apresFenetreSaisieAgenda = {
			id: GHtml.getElementEnFocus().id,
		};
		const lData = { agenda: lAgenda, jour: this.elementAgenda.jour };
		if (lAvecSaisie) {
			aMenu.addCommande(
				ObjetBlocAgendaTemporaire.genreMenuContextuel.modification,
				GTraductions.getValeur("Modifier"),
				!!lAvecSaisie && !!this.elementAgenda.proprietaire,
				lData,
			);
			aMenu.addCommande(
				ObjetBlocAgendaTemporaire.genreMenuContextuel.dupliquer,
				GTraductions.getValeur("Dupliquer"),
				!!lAvecSaisie &&
					!!this.elementAgenda.proprietaire &&
					!this.elementAgenda.estPeriodique,
				lData,
			);
			aMenu.addCommande(
				ObjetBlocAgendaTemporaire.genreMenuContextuel.suppression,
				GTraductions.getValeur("Supprimer"),
				!!lAvecSaisie && !!this.elementAgenda.proprietaire,
				lData,
			);
		}
	}
	evntSurMenuContextuel(aCmd) {
		switch (aCmd.getNumero()) {
			case ObjetBlocAgendaTemporaire.genreMenuContextuel.modification:
				this.declencherCallback({
					article: this.elementAgenda,
					genreEvenement: EGenreEvenementListe.Edition,
					param: { cmd: aCmd },
				});
				break;
			case ObjetBlocAgendaTemporaire.genreMenuContextuel.suppression:
				this.declencherCallback({
					article: this.elementAgenda,
					genreEvenement: EGenreEvenementListe.Suppression,
					param: { cmd: aCmd },
				});
				break;
			case ObjetBlocAgendaTemporaire.genreMenuContextuel.dupliquer:
				this.declencherCallback({
					article: this.elementAgenda,
					genreEvenement: EGenreEvenementListe.Creation,
					estDuplication: true,
					param: { cmd: aCmd },
				});
				break;
		}
	}
	declencherCallback(aParam) {
		if (this.Pere) {
			this.callback.appel(aParam);
		}
	}
}
ObjetBlocAgendaTemporaire.genreMenuContextuel = {
	creation: 0,
	modification: 1,
	suppression: 2,
	copier: 3,
	coller: 4,
	dupliquer: 5,
};
function _composeElement(aEvenement, aOptionsBloc) {
	const H = [];
	if (!!aEvenement) {
		let lCommentaire =
			!!aEvenement.Commentaire && aEvenement.Commentaire.length > 0
				? aEvenement.Commentaire
				: "";
		if (GChaine.contientAuMoinsUneURL(lCommentaire)) {
			lCommentaire = GChaine.ajouterLiensURL(lCommentaire);
		}
		lCommentaire = GChaine.replaceRCToHTML(lCommentaire);
		const lAuteur =
			!!aEvenement.strAuteur && aEvenement.strAuteur.length > 0
				? aEvenement.strAuteur
				: null;
		const lStyleAlignementAuteur = aOptionsBloc.estfenetre
			? " AlignementDroit"
			: "";
		if (aEvenement.estConseilClasse) {
			H.push(_composeConseilClasse.call(this, aEvenement));
		} else {
			H.push(
				'<div class="Espace">',
				!!lCommentaire
					? lCommentaire
					: GTraductions.getValeur("Agenda.EvenementVide"),
				!!lAuteur
					? '<div class="Italique EspaceHaut' +
							lStyleAlignementAuteur +
							'">' +
							lAuteur +
							"</div>"
					: "",
				"</div>",
			);
		}
		if (aEvenement.listeFichiers && aEvenement.listeFichiers.count()) {
			H.push(
				tag(
					"div",
					{ attr: "value" },
					UtilitaireUrl.construireListeUrls(aEvenement.listeFichiers),
				),
			);
		}
	}
	return H.join("");
}
function _composeConseilClasse(aEvenement) {
	const H = [];
	const lPresidentCC = !!aEvenement.presidentCC
		? GTraductions.getValeur("Agenda.President") +
			" : " +
			aEvenement.presidentCC
		: "";
	let lProfPrincipaux = "";
	if (
		!!aEvenement.listeProfsPrincipaux &&
		aEvenement.listeProfsPrincipaux.count() > 0
	) {
		lProfPrincipaux =
			aEvenement.listeProfsPrincipaux.count() > 1
				? GTraductions.getValeur("Agenda.ProfesseursPrincipaux")
				: GTraductions.getValeur("Agenda.ProfesseurPrincipal");
		lProfPrincipaux +=
			" : " + aEvenement.listeProfsPrincipaux.getTableauLibelles().join(", ");
	}
	let lParentDelegues = "";
	if (
		!!aEvenement.listeDeleguesParents &&
		aEvenement.listeDeleguesParents.count() > 0
	) {
		lParentDelegues = GTraductions.getValeur("Agenda.ParentsDelegues") + " : ";
		lParentDelegues += aEvenement.listeDeleguesParents
			.getTableauLibelles()
			.join(", ");
	}
	let lElevesDelegues = "";
	if (
		!!aEvenement.listeDeleguesEleves &&
		aEvenement.listeDeleguesEleves.count() > 0
	) {
		lElevesDelegues = GTraductions.getValeur("Agenda.ElevesDelegues") + " : ";
		lElevesDelegues += aEvenement.listeDeleguesEleves
			.getTableauLibelles()
			.join(", ");
	}
	H.push(
		'<div class="Espace">',
		'<ul role="list" class="list-as-menu">',
		lPresidentCC ? "<li> " + lPresidentCC + "</li>" : "",
		lProfPrincipaux ? "<li> " + lProfPrincipaux + "</li>" : "",
		lParentDelegues ? "<li> " + lParentDelegues + "</li>" : "",
		lElevesDelegues ? "<li> " + lElevesDelegues + "</li>" : "",
		"</ul>",
		"</div>",
	);
	if (aEvenement.visio && aEvenement.visio.url) {
		H.push(
			tag(
				"div",
				{ class: "agenda-cc-visio" },
				tag(
					"ie-chips",
					{
						class: ["iconic", UtilitaireVisios.getNomIconePresenceVisios()],
						href: GChaine.verifierURLHttp(aEvenement.visio.url),
					},
					aEvenement.visio.libelleLien ||
						GTraductions.getValeur(
							"FenetreSaisieVisiosCours.AccederAuCoursVirtuel",
						),
				),
				aEvenement.visio.commentaire
					? tag("label", GChaine.replaceRCToHTML(aEvenement.visio.commentaire))
					: "",
			),
		);
	}
	return H.join("");
}
module.exports = { GestionnaireBlocAgenda, EGenreEvntMenuAgenda };
