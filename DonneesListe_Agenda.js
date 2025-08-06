exports.DonneesListe_Agenda = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const UtilitaireVisiosSco_1 = require("UtilitaireVisiosSco");
const TypeGenreEvenementAgenda_1 = require("TypeGenreEvenementAgenda");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const AccessApp_1 = require("AccessApp");
const UtilitaireAgenda_1 = require("UtilitaireAgenda");
class DonneesListe_Agenda extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParametres) {
		super(aDonnees);
		if (!!aParametres) {
			this.parametres = aParametres;
		}
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.avecPublicationPageEtablissement = lApplicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.communication.avecPublicationPageEtablissement,
		);
		this.avecDroitSaisie = lApplicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.agenda.avecSaisieAgenda,
		);
		this.setOptions({
			avecBoutonActionLigne: true,
			avecSelection: !!IE.estMobile,
			avecEvnt_SelectionClick: !!IE.estMobile,
			avecEllipsis: !IE.estMobile,
			avecEvnt_Creation: true,
		});
	}
	jsxModeleCheckboxFiltreAvecEventsPasses() {
		return {
			getValue: () => {
				return UtilitaireAgenda_1.UtilitaireAgenda.getInfosOnglet()
					.avecEventsPasses;
			},
			setValue: (aValue) => {
				UtilitaireAgenda_1.UtilitaireAgenda.setAvecEventsPasses(aValue);
				this.parametres.callbackCBEventsPasses();
			},
		};
	}
	getFiltreParDefaut() {
		return { avecEventsPasses: false };
	}
	reinitFiltres() {
		UtilitaireAgenda_1.UtilitaireAgenda.setAvecEventsPasses(
			this.getFiltreParDefaut().avecEventsPasses,
		);
		this.parametres.callbackCBEventsPasses();
	}
	estFiltresParDefaut() {
		return (
			UtilitaireAgenda_1.UtilitaireAgenda.getInfosOnglet().avecEventsPasses ===
			this.getFiltreParDefaut().avecEventsPasses
		);
	}
	construireFiltres() {
		return IE.jsx.str(
			"ie-checkbox",
			{ "ie-model": this.jsxModeleCheckboxFiltreAvecEventsPasses.bind(this) },
			ObjetTraduction_1.GTraductions.getValeur(
				"Agenda.afficherEvenementsPasses",
			),
		);
	}
	getZoneGauche(aParams) {
		const lArticle = aParams.article;
		const lDate = ObjetDate_1.GDate.formatDate(lArticle.DateDebut, "%J %MMM");
		const H = [];
		H.push(
			IE.jsx.str(
				"time",
				{
					class: "date-contain ie-line-color",
					style: `--color-line :${lArticle.CouleurCellule}`,
					datetime: ObjetDate_1.GDate.formatDate(lArticle.DateDebut, "%MM-%JJ"),
				},
				lDate,
			),
		);
		return H.join("");
	}
	getTitreZonePrincipale(aParams) {
		return `<h2 ${!IE.estMobile ? `ie-ellipsis` : ""} class="ie-titre">${aParams.article.getLibelle()}</h2>`;
	}
	getInfosSuppZonePrincipale(aParams) {
		const lArticle = aParams.article;
		const lGenreEspaceProf = [
			Enumere_Espace_1.EGenreEspace.Professeur,
			Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
			Enumere_Espace_1.EGenreEspace.PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
		].includes(GEtatUtilisateur.GenreEspace);
		let H = [];
		if (!!lArticle.DateDebut) {
			let lChaine = ObjetDate_1.GDate.strDates(
				lArticle.DateDebut,
				lArticle.DateFin,
				{ sansHoraire: lArticle.sansHoraire },
			).trim();
			H.push('<div class="ie-sous-titre capitalize">');
			if (lArticle.estPeriodique && !IE.estMobile) {
				if (lArticle.periodicite.estEvtPerso) {
					H.push(
						IE.jsx.str(
							IE.jsx.fragment,
							null,
							lChaine,
							" - ",
							IE.jsx.str("i", {
								class: "icons icon_refresh",
								role: "presentation",
							}),
							" ",
							ObjetTraduction_1.GTraductions.getValeur(
								"Agenda.EvenementModifie",
							),
						),
					);
				} else {
					H.push(
						IE.jsx.str("i", {
							class: "icons icon icon_refresh",
							role: "img",
							title: ObjetTraduction_1.GTraductions.getValeur(
								"Agenda.AgendaHintEvtPEriodique",
							),
						}),
					);
					H.push(lArticle.periodicite.libelleDescription);
				}
			} else {
				H.push(lChaine);
			}
			H.push("</div>");
		}
		if (
			!IE.estMobile &&
			this.avecPublicationPageEtablissement &&
			lArticle.publie &&
			lArticle.publicationPageEtablissement &&
			lGenreEspaceProf &&
			(lArticle.getGenre() ===
				TypeGenreEvenementAgenda_1.TypeGenreEvenementAgenda.tgea_Standard ||
				lArticle.getGenre() ===
					TypeGenreEvenementAgenda_1.TypeGenreEvenementAgenda
						.tgea_StandardPeriodique)
		) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "ie-sous-titre capitalize" },
					IE.jsx.str("i", {
						class: "icons icon icon_ecole",
						title: ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_SaisieAgenda.partageSurPageEtablissement",
						),
						role: "presentation",
					}),
					ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_SaisieAgenda.partageSurPageEtablissement",
					),
				),
			);
		}
		if (!!lArticle.listeEleves) {
			H.push(`<div class="ie-sous-titre">`);
			lArticle.listeEleves.map((eleve) => {
				const lIndex = lArticle.listeEleves.indexOf(eleve);
				H.push(
					`${eleve}${lIndex === lArticle.listeEleves.length - 1 ? "" : ", "} `,
				);
			});
			H.push(`</div>`);
		}
		const lAuteur =
			!IE.estMobile && !!lArticle.strAuteur
				? `<div class="ie-sous-titre">${lArticle.strAuteur}</div>`
				: "";
		H.push(lAuteur);
		if (
			lArticle.Genre ===
			TypeGenreEvenementAgenda_1.TypeGenreEvenementAgenda.tgea_JourFerie
		) {
			H.push(
				`<div class="ie-sous-titre">${ObjetTraduction_1.GTraductions.getValeur("Agenda.evtTypeVacanceFerie")}</div>`,
			);
		}
		return H.join("");
	}
	getZoneMessage(aParams) {
		const lArticle = aParams.article;
		const lAvecCommentaire =
			!!lArticle.Commentaire && lArticle.Commentaire.length > 0;
		const lAvecPJ =
			(!!lArticle.listeDocJoints && lArticle.listeDocJoints.count()) ||
			(!!lArticle.listeFichiers && lArticle.listeFichiers.count());
		const H = [];
		if (!IE.estMobile) {
			if (lArticle.estConseilClasse) {
				H.push(this._composeConseilClasse(lArticle));
			} else {
				let lDescription = !!lAvecCommentaire ? lArticle.Commentaire : "";
				if (ObjetChaine_1.GChaine.contientAuMoinsUneURL(lDescription)) {
					lDescription = ObjetChaine_1.GChaine.ajouterLiensURL(lDescription);
				}
				H.push(
					`<div class="m-top-xl ctn-message">${ObjetChaine_1.GChaine.replaceRCToHTML(lDescription)}</div>`,
				);
			}
			if (lAvecPJ) {
				H.push('<section class="ctnListeDocJoints m-top-xl">');
				lArticle.listeDocJoints.parcourir((aDocumentJoint) => {
					H.push(
						ObjetChaine_1.GChaine.composerUrlLienExterne({
							documentJoint: aDocumentJoint,
							genreRessource:
								Enumere_Ressource_1.EGenreRessource.DocJointEtablissement,
						}),
					);
				});
				if (lArticle.listeFichiers) {
					H.push(
						UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
							lArticle.listeFichiers,
						),
					);
				}
				H.push("</section>");
			}
		}
		return H.join("");
	}
	avecBoutonActionLigne(aParams) {
		return !!this.avecDroitSaisie && !!aParams.article.proprietaire;
	}
	getZoneComplementaire(aParams) {
		const lDecalageGauche = !IE.estMobile ? 12 : "calc(1.6rem + 16px)";
		const lEstPeriodique = aParams.article.estPeriodique;
		const lEstPublie = aParams.article.publie;
		const lListeDocJoints = aParams.article.listeDocJoints;
		const lNbrDocJoints = aParams.article.listeDocJoints
			? aParams.article.listeDocJoints.count()
			: 0;
		const lEstProprietaire =
			!!this.avecDroitSaisie && !!aParams.article.proprietaire;
		const lHIcones = [];
		if (
			this.avecPublicationPageEtablissement &&
			aParams.article.publicationPageEtablissement &&
			lEstPublie &&
			IE.estMobile &&
			this.avecDroitSaisie
		) {
			lHIcones.push(
				IE.jsx.str("i", {
					class: "icon icon_ecole",
					role: "img",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_SaisieAgenda.partageSurPageEtablissement",
					),
				}),
			);
		}
		if (lEstPeriodique && IE.estMobile) {
			lHIcones.push(
				IE.jsx.str("i", {
					class: "icon icon_refresh",
					role: "img",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"Agenda.AgendaHintEvtPEriodique",
					),
				}),
			);
		}
		if (lNbrDocJoints > 0 && lListeDocJoints && IE.estMobile) {
			lHIcones.push(
				IE.jsx.str("i", {
					class: "icon icon_piece_jointe",
					role: "img",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"Agenda.AgendaHintPieceJointes",
					),
				}),
			);
		}
		if (lEstPublie && IE.estMobile && this.avecDroitSaisie) {
			lHIcones.push(
				IE.jsx.str("i", {
					class: "icon icon_fiche_cours_partage",
					role: "img",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"Agenda.EvenementPartage",
					),
				}),
			);
		}
		if (IE.estMobile) {
			return lHIcones.length > 0
				? IE.jsx.str(
						"div",
						{
							class: "ctn-icon",
							style: `margin-right : ${!lEstProprietaire ? lDecalageGauche : ""}`,
						},
						lHIcones.join(""),
					)
				: "";
		} else {
			if (aParams.article.publie && this.avecDroitSaisie) {
				return IE.jsx.str(
					"ie-chips",
					{
						tabindex: "0",
						class:
							"tag-style iconic icon_fiche_cours_partage etiquette m-right",
						"ie-hint": ObjetTraduction_1.GTraductions.getValeur(
							"Agenda.EvenementPartage",
						),
						style: !lEstProprietaire
							? `margin-right:${lDecalageGauche}px;`
							: "",
					},
					ObjetTraduction_1.GTraductions.getValeur("Agenda.Partage"),
				);
			}
		}
	}
	avecSeparateurLigneHautFlatdesign(aParamsCellule, aParamsCellulePrec) {
		const lDate = ObjetDate_1.GDate.formatDate(
			aParamsCellule.article.DateDebut,
			"[" + "%J %MMM" + "]",
		);
		const lDatePrec = ObjetDate_1.GDate.formatDate(
			aParamsCellulePrec.article.DateDebut,
			"[" + "%J %MMM" + "]",
		);
		if (lDate === lDatePrec) {
			return false;
		}
		return true;
	}
	initialisationObjetContextuel(aParams) {
		if (!aParams.menuContextuel) {
			return;
		}
		if (!!this.avecDroitSaisie && !!aParams.article.proprietaire) {
			aParams.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur("Modifier"),
				true,
				() => {
					this.parametres.callbackMenuCtx({
						article: aParams.article,
						genreEvenement:
							Enumere_EvenementListe_1.EGenreEvenementListe.Edition,
					});
				},
				{ icon: "icon_pencil" },
			);
			aParams.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur("Dupliquer"),
				!aParams.article.estPeriodique,
				() => {
					this.parametres.eventDupliquer(aParams.article);
				},
				{ icon: "icon_dupliquer" },
			);
			aParams.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
				true,
				() => {
					this.parametres.callbackMenuCtx({
						article: aParams.article,
						genreEvenement:
							Enumere_EvenementListe_1.EGenreEvenementListe.Suppression,
					});
				},
				{ icon: "icon_trash" },
			);
		}
		aParams.menuContextuel.setDonnees();
	}
	_composeConseilClasse(aEvenement) {
		const H = [];
		const lPresidentCC = !!aEvenement.presidentCC
			? ObjetTraduction_1.GTraductions.getValeur("Agenda.President") +
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
					? ObjetTraduction_1.GTraductions.getValeur(
							"Agenda.ProfesseursPrincipaux",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"Agenda.ProfesseurPrincipal",
						);
			lProfPrincipaux +=
				" : " + aEvenement.listeProfsPrincipaux.getTableauLibelles().join(", ");
		}
		let lParentDelegues = "";
		if (
			!!aEvenement.listeDeleguesParents &&
			aEvenement.listeDeleguesParents.count() > 0
		) {
			lParentDelegues =
				ObjetTraduction_1.GTraductions.getValeur("Agenda.ParentsDelegues") +
				" : ";
			lParentDelegues += aEvenement.listeDeleguesParents
				.getTableauLibelles()
				.join(", ");
		}
		let lElevesDelegues = "";
		if (
			!!aEvenement.listeDeleguesEleves &&
			aEvenement.listeDeleguesEleves.count() > 0
		) {
			lElevesDelegues =
				ObjetTraduction_1.GTraductions.getValeur("Agenda.ElevesDelegues") +
				" : ";
			lElevesDelegues += aEvenement.listeDeleguesEleves
				.getTableauLibelles()
				.join(", ");
		}
		H.push(
			'<div class="Espace">',
			'<ul class="list-as-menu">',
			lPresidentCC ? "<li> " + lPresidentCC + "</li>" : "",
			lProfPrincipaux ? "<li> " + lProfPrincipaux + "</li>" : "",
			lParentDelegues ? "<li> " + lParentDelegues + "</li>" : "",
			lElevesDelegues ? "<li> " + lElevesDelegues + "</li>" : "",
			"</ul>",
			"</div>",
		);
		if (aEvenement.visio && aEvenement.visio.url) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "agenda-cc-visio" },
					IE.jsx.str(
						"ie-chips",
						{
							class: [
								"iconic",
								UtilitaireVisiosSco_1.UtilitaireVisios.getNomIconePresenceVisios(),
							],
							href: ObjetChaine_1.GChaine.verifierURLHttp(aEvenement.visio.url),
						},
						aEvenement.visio.libelleLien ||
							ObjetTraduction_1.GTraductions.getValeur(
								"FenetreSaisieVisiosCours.AccederAuCoursVirtuel",
							),
					),
					aEvenement.visio.commentaire &&
						IE.jsx.str(
							"label",
							null,
							ObjetChaine_1.GChaine.replaceRCToHTML(
								aEvenement.visio.commentaire,
							),
						),
				),
			);
		}
		return H.join("");
	}
}
exports.DonneesListe_Agenda = DonneesListe_Agenda;
