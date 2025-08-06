exports.InterfacePageSaisieAbsences_Cours = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const GUID_1 = require("GUID");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_Event_1 = require("Enumere_Event");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetDate_1 = require("ObjetDate");
const ObjetHint_1 = require("ObjetHint");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetScroll_1 = require("ObjetScroll");
const ObjetScroll_2 = require("ObjetScroll");
const ObjetScroll_3 = require("ObjetScroll");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetWAI_1 = require("ObjetWAI");
const ObjetWAI_2 = require("ObjetWAI");
const ObjetWAI_3 = require("ObjetWAI");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetFenetre_DetailsPIEleve_1 = require("ObjetFenetre_DetailsPIEleve");
const TTypePreparerRepas_1 = require("TTypePreparerRepas");
const TypeGenreIndividuAuteur_1 = require("TypeGenreIndividuAuteur");
const TypeGenreObservationVS_1 = require("TypeGenreObservationVS");
const TypeGenreRepasEleve_1 = require("TypeGenreRepasEleve");
const Enumere_EvenementSaisieAbsences_1 = require("Enumere_EvenementSaisieAbsences");
const TypeIconeFeuilleDAppel_1 = require("TypeIconeFeuilleDAppel");
const MethodesObjet_1 = require("MethodesObjet");
const AccessApp_1 = require("AccessApp");
const ObjetRequetePageSaisieAbsences_1 = require("ObjetRequetePageSaisieAbsences");
const lRegexNumEleveNumColAbs = new RegExp(
	`_${ObjetElement_1.ObjetElement.regexCaptureNumero}_([0-9]+)(?=_abs)`,
);
const lRegexNumEleveLib = new RegExp(
	`_${ObjetElement_1.ObjetElement.regexCaptureNumero}(?=_lib$)`,
);
class InterfacePageSaisieAbsences_Cours extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.appScoEspace = (0, AccessApp_1.getApp)();
		this.etatUtilScoEspace = this.appScoEspace.getEtatUtilisateur();
		this.largeurColonneEleve = 230;
		this.largeurColonneClasse = 50;
		this.hauteurLigne = 24;
		this.minLargeurColonne = 45;
		this.largeurColonne = this.minLargeurColonne;
		this.largeurColonneObsParent = 3 * (this.minLargeurColonne + 1) - 1;
		this.nbColonnesActives = 0;
		this.nbElevesVisibles = 0;
		this.commentaireWidth = 150;
		this.commentaireHeight = 150;
		this.numeroEleveSelectionne = null;
		this.enAffichage = false;
		this.classAbsencesConvoc = GUID_1.GUID.getClassCss();
		this.classAbsencesProjetsAccompagnement = GUID_1.GUID.getClassCss();
		this.listeEleves = new ObjetListeElements_1.ObjetListeElements();
		this.listeColonnes = new ObjetListeElements_1.ObjetListeElements();
		this.options = { avecSaisieExclusion: false };
		this.ScrollV = new ObjetScroll_1.ObjetScroll(
			this.Nom + ".ScrollV",
			null,
			this,
			this.getScrollTop,
			ObjetScroll_2.EGenreScroll.Vertical,
		);
		this.ScrollH = new ObjetScroll_1.ObjetScroll(
			this.Nom + ".ScrollH",
			null,
			this,
			this.getScrollLeft,
			ObjetScroll_2.EGenreScroll.Horizontal,
		);
		this.ajouterEvenementGlobal(
			Enumere_Event_1.EEvent.SurPreResize,
			this.surPreResize,
		);
		this.ajouterEvenementGlobal(
			Enumere_Event_1.EEvent.SurPostResize,
			this.surPostResize,
		);
	}
	construireInstances() {
		this.identFenetreDocs = this.addFenetre(
			ObjetFenetre_DetailsPIEleve_1.ObjetFenetre_DetailsPIEleve,
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	composeMessage(aMessage) {
		const H = [];
		H.push(
			'<p class="semi-bold text-center p-y-xl" id="',
			this.idMessageActionRequise,
			'" tabindex="0">',
			aMessage,
			"</p>",
		);
		return H.join("");
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push('<div id="PageSaisieAbsenceCours">');
		if (this.nbElevesVisibles < 1 && !this.ajoutEleveAutorise) {
			if (this.listeElevesEnStage && this.listeElevesEnStage.count() > 0) {
				H.push(
					this.composeMessage(
						ObjetTraduction_1.GTraductions.getValeur(
							"Absence.TousLesElevesEnStage",
						),
					),
				);
			} else {
				H.push(
					this.composeMessage(
						this.message ||
							ObjetTraduction_1.GTraductions.getValeur("Absence.AucunEleve"),
					),
				);
			}
		} else {
			H.push(
				"<table ",
				ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_2.EGenreRole.Grid),
				' class="tableAbsenceGlobal TablePrincipaleFeuilleAppel">',
			);
			H.push("<tr>");
			H.push(
				'<td class="tableAbsenceTitreNbEleves" style="',
				this.avecColonneClasse ? "border-right-width: 0" : "",
				'">',
				"<div>",
				this.nbElevesVisibles + " ",
				this.nbElevesVisibles > 1
					? ObjetTraduction_1.GTraductions.getValeur("resultatsClasses.eleves")
					: ObjetTraduction_1.GTraductions.getValeur("resultatsClasses.eleve"),
				"</div>",
				"</td>",
			);
			if (this.avecColonneClasse) {
				H.push(
					'<td class="tableAbsenceTitreClasses">',
					"<div>",
					ObjetTraduction_1.GTraductions.getValeur("Classe"),
					"</div>",
					"</td>",
				);
			}
			H.push(
				"<td  ",
				ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_2.EGenreRole.Presentation),
				">",
				'<div id="' +
					this.ScrollV.getIdZone(2) +
					'" style="overflow:hidden;" onscroll="',
				this.Nom,
				'.ScrollV.actualiser(2)">' + this.composeTitres() + "</div>",
				"</td>",
			);
			H.push(
				"<td  ",
				ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_2.EGenreRole.Presentation),
				"></td>",
			);
			H.push("</tr>");
			if (this.ajoutEleveAutorise) {
				H.push('<tr class="trAbsenceAjoutEleve">');
				H.push(
					'<td colspan="',
					this.avecColonneClasse ? 3 : 2,
					'">',
					'<div class="NoWrap AvecMain" style="margin-right:1px;',
					this.nbElevesVisibles > 0 ? "" : "border-bottom-width:1px;",
					'" ie-event="click->surEventAjoutEleve">',
					'<i class="icon_plus_cercle liste-creation" role="presentation"></i>',
					'<div class="Italique PetitEspaceGauche InlineBlock AlignementMilieuVertical" style="',
					ObjetStyle_1.GStyle.composeCouleurTexte(GCouleur.texteListeCreation),
					'">',
					ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.ajouterUnEleve"),
					"</div>",
					"</div>",
					"</td>",
				);
				H.push(
					"<td  ",
					ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_2.EGenreRole.Presentation),
					"></td>",
				);
				H.push("</tr>");
			}
			H.push("<tr >");
			H.push(
				"<td  ",
				ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_2.EGenreRole.Presentation),
				'><div id="' +
					this.ScrollV.getIdZone(0) +
					'" style="overflow:hidden;height:1px;" onscroll="',
				this.Nom,
				'.ScrollV.actualiser(0)">',
			);
			H.push(
				'<div class="tableAbsenceLigneSelectionne"><div class="ligneHaut"></div><div class="ligneBas"></div><div class="ligneCote"></div></div>',
			);
			H.push(this.composeListeEleves(), "</div></td>");
			if (this.avecColonneClasse) {
				H.push(
					"<td  ",
					ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_2.EGenreRole.Presentation),
					">",
					'<div id="' +
						this.ScrollV.getIdZone(4) +
						'" style="overflow:hidden;height:1px;" onscroll="',
					this.Nom,
					'.ScrollV.actualiser(4)">',
				);
				H.push(
					'<div class="tableAbsenceLigneSelectionne">',
					'<div class="ligneHaut"></div>',
					'<div class="ligneBas"></div>',
					"</div>",
				);
				H.push(this._composeListeClasses(), "</div></td>");
			}
			H.push(
				"<td   ",
				ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_2.EGenreRole.Presentation),
				'><div id="' +
					this.ScrollV.getIdZone(1) +
					'" style="height:1px;overflow:hidden;" onscroll="',
				this.Nom,
				'.ScrollV.actualiser(1)">',
			);
			H.push(
				'<div class="tableAbsenceLigneSelectionne"><div class="ligneHaut"></div><div class="ligneBas"></div><div class="ligneCote"></div></div>',
			);
			H.push(this.composeCorps(), "</div></td>");
			H.push('<td id="' + this.ScrollV.getIdScroll() + '"></td>');
			H.push("</tr>");
			H.push("<tr>");
			H.push("<td></td>");
			if (this.avecColonneClasse) {
				H.push("<td></td>");
			}
			H.push('<td id="' + this.ScrollH.getIdScroll() + '"></td>');
			H.push("<td></td>");
			H.push("</tr>");
			H.push("</table>");
		}
		H.push("</div>");
		return H.join("");
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			surEventAjoutEleve() {
				aInstance.callbackAjoutEleve();
			},
		});
	}
	setEnAffichage() {
		this.enAffichage = false;
	}
	setDonnees(aOptions) {
		$.extend(this.options, aOptions);
	}
	setDonneesBandeauAbsences(ADureeRetard, AListeMotifsExclusion) {
		this.dureeRetard = ADureeRetard;
		if (this.options.avecSaisieExclusion) {
			this.listeMotifs = AListeMotifsExclusion;
		}
	}
	setPlacesSaisie(APlaceSaisieDebut, APlaceSaisieFin) {
		this.placeSaisieDebut = APlaceSaisieDebut;
		this.placeSaisieFin = APlaceSaisieFin;
	}
	setDonneesAbsences(aObjet) {
		let lEleve, lColonne;
		if (arguments.length > 0) {
			this.moteur = aObjet.moteur;
			this.numeroProf = aObjet.enseignantCourant;
			this.listeEleves = aObjet.listeEleves;
			this.placeGrilleDebut = aObjet.placeGrilleDebut;
			this.placeSaisieDebut = aObjet.placeSaisieDebut;
			this.placeSaisieFin = aObjet.placeSaisieFin;
			this.dureeRetard = aObjet.dureeRetard;
			this.genreRepas = aObjet.genreRepas;
			this.date = aObjet.date;
			this.dateDecompte = aObjet.dateDecompte;
			this.avecSaisieDefautCarnet = aObjet.autorisations.saisieDefautCarnet;
			this.ajoutEleveAutorise = aObjet.autorisations.ajoutEleveAutorise;
			this.options.suppressionAbsenceDeVS =
				aObjet.autorisations.suppressionAbsenceDeVS;
			this.options.suppressionRetardDeVS =
				aObjet.autorisations.suppressionRetardDeVS;
			this.listeElevesEnStage = aObjet.listeElevesStage;
			this.message = aObjet.message;
			this.listeColonnes = aObjet.listeColonnes;
			this.callbackAjoutEleve = aObjet.callbackAjoutEleve;
			this.nbColonnesActives = 0;
			let lStrClasse = "";
			this.avecColonneClasse = false;
			for (let i = 0; i < this.listeEleves.count(); i++) {
				lEleve = this.listeEleves.get(i);
				if (lEleve.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression) {
					for (let j = 0; j < this.listeColonnes.count(); j++) {
						lColonne = this.listeColonnes.get(j);
						if (i === 0 && lColonne.Actif) {
							this.nbColonnesActives++;
						}
						if (
							(lColonne.Genre !==
								Enumere_Ressource_1.EGenreRessource.Punition &&
								this.moteur.aUneAbsence(
									lEleve.Numero,
									lColonne.Genre,
									lColonne.Numero,
								) >= 0) ||
							(lColonne.Genre ===
								Enumere_Ressource_1.EGenreRessource.Punition &&
								this.moteur.aUnePunition(lEleve.Numero) >= 0)
						) {
							lEleve.listeColonnes.getElementParNumeroEtGenre(
								lColonne.Numero,
								lColonne.Genre,
							).nombre--;
						}
					}
					if (
						lEleve.strClasse &&
						lStrClasse &&
						lStrClasse !== lEleve.strClasse
					) {
						this.avecColonneClasse = true;
					}
					lStrClasse = lEleve.strClasse;
				}
			}
		}
		this.nbElevesVisibles =
			this.listeEleves
				.getListeElements((D) => {
					return D.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression;
				})
				.count() - 1;
		$("#" + this.Nom.escapeJQ()).ieHtml(
			this.construireStructureAffichageAutre(),
			{ controleur: this.controleur },
		);
		for (let i = 0; i < this.listeEleves.count() - 1; i++) {
			lEleve = this.listeEleves.get(i);
			if (lEleve.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression) {
				for (let j = 0; j < this.listeColonnes.count(); j++) {
					lColonne = this.listeColonnes.get(j);
					let lClassSup = "";
					if (!lColonne.Actif) {
						continue;
					}
					let lContenu = this.moteur.getAffichageGenre(
						lEleve.Numero,
						lColonne.Genre,
						lColonne.Genre === Enumere_Ressource_1.EGenreRessource.Observation
							? lColonne.Numero
							: null,
						lColonne.Genre === Enumere_Ressource_1.EGenreRessource.Observation
							? lColonne.genreObservation
							: null,
					);
					if (
						lContenu !== "" &&
						lColonne.Genre === Enumere_Ressource_1.EGenreRessource.Absence &&
						!lEleve.estDetache
					) {
						lClassSup =
							lEleve.ListeAbsences.get(
								this.moteur.aUneAbsence(
									lEleve.Numero,
									lColonne.Genre,
									lColonne.Genre ===
										Enumere_Ressource_1.EGenreRessource.Observation
										? lColonne.Numero
										: null,
								),
							).Professeur.Numero !== 0
								? ""
								: "tableAbsenceCorpsCelluleInactiveVieSco";
					} else if (
						lContenu === "" &&
						lEleve.hintDispense &&
						lColonne.Genre === Enumere_Ressource_1.EGenreRessource.Absence
					) {
						lContenu =
							'<span class="InlineBlock Texte10" title="' +
							lEleve.hintDispense +
							'">' +
							ObjetTraduction_1.GTraductions.getValeur("Absence.DispenseAbbr") +
							"</span>";
					}
					$(
						"#" +
							this.Nom.escapeJQ() +
							' table.tableAbsenceCorps div[id*="_' +
							lEleve.Numero +
							"_" +
							lColonne.Genre +
							"_abs" +
							(lColonne.Genre ===
							Enumere_Ressource_1.EGenreRessource.Observation
								? "_" + lColonne.Numero
								: "") +
							'"]',
					)
						.html(lContenu)
						.parent()
						.addClass(lClassSup);
				}
				this.setCellulesInactives(lEleve.getNumero());
			}
		}
		this.largeurColonne = this.minLargeurColonne;
		const lIdScrollZero = this.ScrollV.getIdZone(0);
		$("#" + this.Nom.escapeJQ() + " div.tableAbsenceLigneSelectionne")
			.find("div.ligneHaut, div.ligneBas")
			.width(function () {
				return $(this).parent().parent().width();
			})
			.end()
			.find("div.ligneBas")
			.css("top", this.hauteurLigne)
			.end()
			.find("div.ligneCote")
			.css("height", this.hauteurLigne)
			.css("left", function () {
				return $(this).parent().parent().attr("id") === lIdScrollZero
					? "0"
					: $(this).parent().parent().width() - 2;
			});
		this.ScrollH.setDonnees(1, 2);
		if (this.avecColonneClasse) {
			this.ScrollV.setDonnees(0, 1, 4);
		} else {
			this.ScrollV.setDonnees(0, 1);
		}
		$('[id$="_Appel_Termine"]').width(
			$("#" + this.Nom.escapeJQ() + " table:first").width(),
		);
		this.ajoutEvenement();
		if (this.numeroEleveSelectionne) {
			$(
				"#" +
					this.Nom.escapeJQ() +
					' table.tableAbsenceEleve td[id$="' +
					this.numeroEleveSelectionne +
					'_lib"]',
			).click();
		}
		this.enAffichage = true;
	}
	ajoutEvenement() {
		$(".tableAbsenceGlobal")
			.on(
				"mouseenter",
				"td.tableAbsenceTitreNbEleves",
				{ aObjet: this },
				this.survolInfoEleve,
			)
			.on("mouseleave", "td.tableAbsenceTitreNbEleves", this.fermerHint);
		$(".tableAbsenceEleve")
			.on("click", "td", { aObjet: this }, this.selectionEleve)
			.on(
				"click",
				"td > div > i.tableAbsenceEleveDevARendre.tableAbsenceEleveDevARendreInteractif",
				{ aObjet: this },
				this.clicDevoirARendre,
			)
			.on(
				"click",
				"td > div > i.tableAbsenceEleveMemo",
				{ aObjet: this },
				this.clicMemo,
			)
			.on(
				"click",
				"td > div > i." + this.classAbsencesConvoc,
				{ aObjet: this },
				this.clicAbsencesNonReglees,
			)
			.on(
				"click",
				"td > div > i." + this.classAbsencesProjetsAccompagnement,
				{ aObjet: this },
				this.clicProjetsAccompagnement,
			)
			.on(
				"mouseenter",
				"td > div > span",
				{ aObjet: this },
				this.survolInfoEleve,
			)
			.on("mouseleave", "td > div > span", this.fermerHint)
			.on(
				"contextmenu",
				"td > div > span",
				{ aObjet: this },
				this.clicDroitEleve,
			);
		$(".tableAbsenceCorps")
			.on("click", "td.tableAbsenceRecap", { aObjet: this }, this.clicRecap)
			.on(
				"contextmenu",
				"td.tableAbsenceRecap",
				{ aObjet: this },
				this.clicDroitRecap,
			)
			.on(
				"click",
				"td.tableAbsenceCorpsCellule",
				{ aObjet: this },
				this.moteur.clicCellule,
			)
			.on(
				"contextmenu",
				"td.tableAbsenceCorpsCellule",
				{ aObjet: this },
				this.clicDroitCellule,
			)
			.on("mouseenter", "td", { aObjet: this }, this.survolCellule)
			.on("mouseleave", "td", this.fermerHint)
			.on("focus", "div", { aObjet: this }, this.focusCellule)
			.on("blur", "div", { aObjet: this }, this.blurCellule);
	}
	clicAbsencesNonReglees(event) {
		const lNumEleve = $(this)
				.parent("div")
				.parent("td")
				.attr("id")
				.match(
					new RegExp(`_${ObjetElement_1.ObjetElement.regexCaptureNumero}_lib$`),
				)[1],
			lEleve = event.data.aObjet.listeEleves.getElementParNumero(lNumEleve);
		event.data.aObjet.callback.appel(
			Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.SelectionEleve,
			{ eleve: lEleve },
		);
		event.data.aObjet.callback.appel(
			Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.AbsencesNonReglees,
			{ eleve: lEleve },
		);
	}
	clicProjetsAccompagnement(event) {
		const lNumEleve = $(this)
			.parent("div")
			.parent("td")
			.attr("id")
			.match(
				new RegExp(`_${ObjetElement_1.ObjetElement.regexCaptureNumero}_lib$`),
			)[1];
		event.data.aObjet.ouvrirDocumentsEleve(lNumEleve);
	}
	ouvrirDocumentsEleve(aNumeroEleve) {
		const lEleve = this.listeEleves.getElementParNumero(aNumeroEleve);
		const lMatiere = this.cours.matiere;
		if (!!lEleve) {
			this.getInstance(this.identFenetreDocs).setDonnees({
				eleve: lEleve,
				matiere: lMatiere,
			});
		} else {
		}
	}
	selectionEleve(event) {
		const lNumEleve = this.id.match(
			new RegExp(`_${ObjetElement_1.ObjetElement.regexCaptureNumero}_lib$`),
		)[1];
		const lEleve = event.data.aObjet.listeEleves.getElementParNumero(lNumEleve);
		event.data.aObjet.placerCadreSelectionEleve(this);
		event.data.aObjet.numeroEleveSelectionne = lNumEleve;
		event.data.aObjet.callback.appel(
			Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.SelectionEleve,
			{ eleve: lEleve },
		);
	}
	placerCadreSelectionEleve(aDomElement) {
		if (
			$("#" + this.Nom.escapeJQ() + " div.tableAbsenceLigneSelectionne").css(
				"display",
			) === "none"
		) {
			$("#" + this.Nom.escapeJQ() + " div.tableAbsenceLigneSelectionne").css({
				display: "block",
				top: $(aDomElement).position().top - 1,
			});
		} else {
			$(
				"#" + this.Nom.escapeJQ() + " div.tableAbsenceLigneSelectionne",
			).animate({ top: $(aDomElement).position().top - 1 }, 100);
		}
		$(aDomElement).focus();
	}
	clicRecap(event) {
		const lRegExp = new RegExp(
			`_${ObjetElement_1.ObjetElement.regexCaptureNumero}_([0-9]+)(?=_recap)`,
		);
		const lNumEleve = $(this)
			.children("div:first-child")
			.attr("id")
			.match(lRegExp)[1];
		const lGenreCol = parseInt(
			$(this).children("div:first-child").attr("id").match(lRegExp)[2],
		);
		event.data.aObjet._gestionFocus_apresFenetreRecapId = $(this)
			.children("div:first-child")
			.attr("id");
		let lNumObs = null;
		if (lGenreCol === Enumere_Ressource_1.EGenreRessource.Observation) {
			lNumObs = $(this)
				.children("div:first-child")
				.attr("id")
				.match(
					new RegExp(
						`recap_${ObjetElement_1.ObjetElement.regexCaptureNumero}$`,
					),
				)[1];
		}
		event.data.aObjet.placerCadreSelectionEleve(
			$(
				"#" +
					event.data.aObjet.Nom.escapeJQ() +
					' table.tableAbsenceEleve td[id$="_' +
					lNumEleve +
					'_lib"]',
			),
		);
		if ($(this).hasClass("tableAbsenceAvecRecap")) {
			event.data.aObjet.callback.appel(
				Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
					.RecapitulatifEleve,
				{
					numeroEleve: lNumEleve,
					genreAbsence: lGenreCol,
					numeroObservation: lNumObs,
					_gestionFocus_apresFenetreRecapId:
						event.data.aObjet._gestionFocus_apresFenetreRecapId,
				},
			);
		}
	}
	clicDroitRecap(event) {
		const lRegExp = new RegExp(
			`_${ObjetElement_1.ObjetElement.regexCaptureNumero}_([0-9]+)(?=_recap)`,
		);
		const lNumEleve = $(this)
			.children("div:first-child")
			.attr("id")
			.match(lRegExp)[1];
		$(
			"#" +
				event.data.aObjet.Nom.escapeJQ() +
				' table.tableAbsenceEleve td[id$="_' +
				lNumEleve +
				'_lib"]',
		).click();
		return false;
	}
	gestionAccessibiliteClicCellule(aEle, aGenreCol) {
		this._gestionFocus_apresFenetreCelluleId = $(aEle)
			.children("div:first-child")
			.attr("id");
	}
	getClassCelluleInactive() {
		return "tableAbsenceCorpsCelluleInactive";
	}
	getClassCelluleInactiveVS() {
		return "tableAbsenceCorpsCelluleInactiveVieSco";
	}
	getClassCelluleDispense() {
		return "Hachure";
	}
	getSelecteurLibelle(aNumEleve) {
		return (
			this.Nom.escapeJQ() +
			' table.tableAbsenceEleve td[id$="_' +
			aNumEleve +
			'_lib"]'
		);
	}
	fermerHint() {
		ObjetHint_1.ObjetHint.stop();
	}
	survolCellule(event) {
		const lStrRegExp = `_${ObjetElement_1.ObjetElement.regexCaptureNumero}_([0-9]+)`;
		const lNumEleve = $(this)
			.children("div:first-child")
			.attr("id")
			.match(new RegExp(`${lStrRegExp}(?=_abs|_recap)`))[1];
		let lTexte, lGenreCol, lNumObs, lEleve, lNumAbs, lAbsence, lAbs, lMotif;
		if (/_recap/.test($(this).children("div:first-child").attr("id"))) {
			lTexte = "";
			lEleve = event.data.aObjet.listeEleves.getElementParNumero(lNumEleve);
			if (lEleve.estExclu) {
				lTexte = lEleve.messageExclu;
			} else if ($(this).children("div").html() === "") {
				return false;
			}
			const lNbRecap = parseInt($(this).text());
			lGenreCol = parseInt(
				$(this)
					.children("div:first-child")
					.attr("id")
					.match(new RegExp(`${lStrRegExp}(?=_recap)`))[2],
			);
			if (lNbRecap) {
				lNumObs = false;
				const aData = [];
				if (lNbRecap > 1) {
					aData.push(lNbRecap);
				}
				if (lGenreCol === Enumere_Ressource_1.EGenreRessource.Observation) {
					lNumObs = $(this)
						.children("div:first-child")
						.attr("id")
						.match(
							new RegExp(
								`recap_${ObjetElement_1.ObjetElement.regexCaptureNumero}$`,
							),
						)[1];
					aData.push(
						$(
							'table.tableAbsenceTitre div[id*="col_' +
								lGenreCol +
								"_" +
								lNumObs +
								'"]',
						).text(),
					);
				}
				if (
					!lNumObs ||
					event.data.aObjet.listeColonnes.getElementParNumero(lNumObs)
						.genreObservation !==
						TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_DefautCarnet
				) {
					aData.push(
						event.data.aObjet.cours &&
							event.data.aObjet.cours.matiere &&
							event.data.aObjet.cours.matiere.getLibelle()
							? event.data.aObjet.cours.matiere.getLibelle()
							: "",
					);
				}
				aData.push(
					ObjetDate_1.GDate.formatDate(
						event.data.aObjet.dateDecompte,
						"%JJ/%MM/%AAAA",
					),
				);
				const lEstSortiePeda = event.data.aObjet.cours.estSortiePedagogique;
				if (
					!lNumObs ||
					event.data.aObjet.listeColonnes.getElementParNumero(lNumObs)
						.genreObservation !==
						TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_DefautCarnet
				) {
					const lCleTraduction = _construitCleTraduction(
						lGenreCol,
						lNbRecap > 1,
					);
					if (lEstSortiePeda) {
						lTexte = ObjetTraduction_1.GTraductions.getValeur(
							"Absence.CoursManques",
						);
					} else if (lCleTraduction) {
						lTexte += ObjetTraduction_1.GTraductions.getValeur(
							lCleTraduction,
							aData,
						);
					}
				} else {
					if (lNbRecap === 1) {
						aData.unshift("1");
					}
					lTexte += ObjetTraduction_1.GTraductions.getValeur(
						"Absence.DefautDeCarnetCours",
						aData,
					);
				}
			}
		} else {
			lTexte = "";
			lGenreCol = parseInt(
				$(this)
					.children("div:first-child")
					.attr("id")
					.match(new RegExp(`${lStrRegExp}(?=_abs)`))[2],
			);
			lNumObs = null;
			if (lGenreCol === Enumere_Ressource_1.EGenreRessource.Observation) {
				lNumObs = $(this)
					.children("div:first-child")
					.attr("id")
					.match(
						new RegExp(`abs_${ObjetElement_1.ObjetElement.regexCaptureNumero}`),
					)[1];
			}
			lEleve = event.data.aObjet.listeEleves.getElementParNumero(lNumEleve);
			if (lEleve.estExclu) {
				lTexte = lEleve.messageExclu;
			} else if (
				![
					Enumere_Ressource_1.EGenreRessource.RepasAPreparer,
					Enumere_Ressource_1.EGenreRessource.Absence,
					Enumere_Ressource_1.EGenreRessource.Retard,
				].includes(lGenreCol) &&
				$(this).children("div").html() === ""
			) {
				return false;
			} else {
				switch (lGenreCol) {
					case Enumere_Ressource_1.EGenreRessource.Observation: {
						lNumAbs = event.data.aObjet.moteur.aUneAbsence(
							lNumEleve,
							lGenreCol,
							lNumObs,
						);
						lAbsence = event.data.aObjet.listeEleves
							.getElementParNumero(lNumEleve)
							.ListeAbsences.get(lNumAbs);
						if (lAbsence.commentaire) {
							lTexte += lAbsence.commentaire;
						}
						const lColonne =
							event.data.aObjet.listeColonnes.getElementParNumero(lNumObs);
						if (
							lColonne.genreObservation !==
							TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_DefautCarnet
						) {
							if (
								lAbsence.Professeur.Genre !==
									event.data.aObjet.etatUtilScoEspace.Identification.getMembre()
										.Genre ||
								lAbsence.Professeur.Numero !==
									event.data.aObjet.etatUtilScoEspace.Identification.getMembre()
										.Numero
							) {
								lTexte +=
									(lTexte !== "" ? "<br />" : "") + lAbsence.Professeur.Libelle;
							}
						} else {
							if (lAbsence.commentaire) {
								lTexte += "<br />";
							}
							if (
								lAbsence.Professeur.Genre ===
									Enumere_Ressource_1.EGenreRessource.Enseignant &&
								lAbsence.Professeur.Libelle
							) {
								lTexte += ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.EvtSaisiParProfesseur",
									[lColonne.getLibelle(), lAbsence.Professeur.Libelle],
								);
							} else if (
								lAbsence.Professeur.Genre !==
								Enumere_Ressource_1.EGenreRessource.Enseignant
							) {
								lTexte += ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.EvtSaisiParVieScolaire",
									[lColonne.getLibelle()],
								);
							}
						}
						if (lTexte === "") {
							return false;
						}
						break;
					}
					case Enumere_Ressource_1.EGenreRessource.Dispense: {
						const lIndiceDemandeDispense =
							event.data.aObjet.moteur.aUneDemandeDeDispense(lNumEleve);
						const lDemandeDispense = lEleve.listeDemandesDispense.get(
							lIndiceDemandeDispense,
						);
						if (lDemandeDispense) {
							if (lDemandeDispense.hint) {
								lTexte = ObjetChaine_1.GChaine.replaceRCToHTML(
									lDemandeDispense.hint,
								);
								break;
							} else {
								return false;
							}
						}
						lNumAbs = event.data.aObjet.moteur.aUneAbsence(
							lNumEleve,
							lGenreCol,
							lNumObs,
							true,
						);
						lAbsence = lEleve.ListeDispenses.get(lNumAbs);
						if (!lAbsence) {
							return false;
						}
						lTexte += event.data.aObjet.formatTradAbs(lAbsence, lGenreCol);
						if (!lAbsence.estEnseignementALaMaison) {
							lTexte +=
								event.data.aObjet.etatUtilScoEspace.GenreEspace ===
									Enumere_Espace_1.EGenreEspace.Professeur &&
								lAbsence.estSurCours
									? lAbsence.Professeur.existeNumero()
										? lAbsence.Professeur.Numero ===
											event.data.aObjet.etatUtilScoEspace.Identification.getMembre()
												.Numero
											? ""
											: "<br />" + lAbsence.Professeur.Libelle
										: "<br />" +
											ObjetTraduction_1.GTraductions.getValeur(
												"AbsenceVS.DispenseSaisieParVS",
											)
									: !lAbsence.estSurCours
										? "<br />" +
											ObjetTraduction_1.GTraductions.getValeur(
												"AbsenceVS.DispenseLongue",
											)
										: "";
						}
						if (lAbsence.presenceOblig && !lAbsence.estEnseignementALaMaison) {
							lTexte +=
								"<br />" +
								ObjetTraduction_1.GTraductions.getValeur(
									"Absence.DispensePresenceEnCoursObligatoire",
								);
						}
						if (lAbsence.commentaire) {
							lTexte += "<br />" + lAbsence.commentaire;
						}
						if (lTexte === "") {
							return false;
						}
						break;
					}
					case Enumere_Ressource_1.EGenreRessource.Absence:
						if (
							event.data.aObjet.cours &&
							event.data.aObjet.cours.estAppelVerrouille
						) {
							lTexte +=
								ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.HintVerrouille",
								) + "<br />";
						}
						lNumAbs = event.data.aObjet.moteur.aUneAbsence(
							lNumEleve,
							lGenreCol,
						);
						if (lNumAbs > -1) {
							lAbs = event.data.aObjet.listeEleves
								.getElementParNumero(lNumEleve)
								.ListeAbsences.get(lNumAbs);
							if (!lAbs.EstOuverte) {
								lTexte += event.data.aObjet.formatTradAbs(lAbs, lGenreCol);
							} else {
								lTexte += ObjetTraduction_1.GTraductions.getValeur(
									"Absence.AbsenceOuverte",
									[
										ObjetDate_1.GDate.formatDate(
											ObjetDate_1.GDate.placeAnnuelleEnDate(lAbs.PlaceDebut),
											"%JJ/%MM/%AAAA %hh" +
												ObjetTraduction_1.GTraductions.getValeur(
													"Absence.TimeSep",
												) +
												"%mm",
										),
									],
								);
							}
							if (lAbs.listeMotifs.count() > 0) {
								lMotif = lAbs.listeMotifs.get(0);
								if (lMotif.getLibelle() && !lMotif.nonConnu) {
									lTexte += "<br />" + lMotif.getLibelle();
								}
							}
							lTexte +=
								"<br />" +
								(lAbs.reglee
									? ObjetTraduction_1.GTraductions.getValeur(
											"AbsenceVS.RegleeAdmin",
										)
									: ObjetTraduction_1.GTraductions.getValeur(
											"AbsenceVS.NonRegleeAdmin",
										));
							lTexte +=
								event.data.aObjet.etatUtilScoEspace.GenreEspace ===
								Enumere_Espace_1.EGenreEspace.Professeur
									? lAbs.Professeur.existeNumero()
										? lAbs.Professeur.Numero ===
											event.data.aObjet.etatUtilScoEspace.Identification.getMembre()
												.Numero
											? ""
											: "<br />" +
												ObjetTraduction_1.GTraductions.getValeur(
													lAbs.Professeur.getGenre() ===
														TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur
															.GIA_Professeur
														? "AbsenceVS.AbsenceSaisieParProf"
														: "AbsenceVS.AbsenceSaisieParPers",
													[lAbs.Professeur.Libelle],
												)
										: "<br />" +
											ObjetTraduction_1.GTraductions.getValeur(
												"AbsenceVS.AbsenceSaisieParVS",
											)
									: "";
						}
						break;
					case Enumere_Ressource_1.EGenreRessource.Infirmerie:
						lNumAbs = event.data.aObjet.moteur.aUneAbsence(
							lNumEleve,
							lGenreCol,
						);
						lAbs = event.data.aObjet.listeEleves
							.getElementParNumero(lNumEleve)
							.ListeAbsences.get(lNumAbs);
						lTexte += ObjetTraduction_1.GTraductions.getValeur(
							"Absence.PsgInfirmerie",
							[
								ObjetDate_1.GDate.formatDate(
									lAbs.DateDebut,
									"%hh" +
										ObjetTraduction_1.GTraductions.getValeur(
											"Absence.TimeSep",
										) +
										"%mm",
								),
								ObjetDate_1.GDate.formatDate(
									lAbs.DateFin,
									"%hh" +
										ObjetTraduction_1.GTraductions.getValeur(
											"Absence.TimeSep",
										) +
										"%mm",
								),
							],
						);
						if (!!lAbs.Accompagnateur && lAbs.Accompagnateur.existeNumero()) {
							lTexte +=
								"<br />" +
								ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.AccompagnePar",
								) +
								" " +
								event.data.aObjet.listeEleves
									.getElementParNumero(lAbs.Accompagnateur.getNumero())
									.getLibelle();
						}
						break;
					case Enumere_Ressource_1.EGenreRessource.Punition:
						lNumAbs = event.data.aObjet.moteur.aUnePunition(lNumEleve);
						lAbs = event.data.aObjet.listeEleves
							.getElementParNumero(lNumEleve)
							.listePunitions.get(lNumAbs);
						lTexte +=
							(lAbs.naturePunition ? lAbs.naturePunition.Libelle : "") +
							(lAbs.duree && lAbs.duree > 0
								? " - " +
									ObjetDate_1.GDate.formatDate(
										new Date(0, 0, 0, 0, lAbs.duree),
										"%hh" +
											ObjetTraduction_1.GTraductions.getValeur(
												"Absence.TimeSep",
											) +
											"%mm",
									)
								: "");
						lTexte += lAbs.dateProgrammation
							? "<br />" +
								ObjetTraduction_1.GTraductions.getValeur(
									"Absence.PunitionProgrammeeLe",
									[
										ObjetDate_1.GDate.formatDate(
											lAbs.dateProgrammation,
											"%JJ/%MM/%AAAA",
										),
									],
								)
							: "";
						lTexte += lAbs.listeMotifs.count()
							? "<br />" + lAbs.listeMotifs.getTableauLibelles().join("<br />")
							: "";
						break;
					case Enumere_Ressource_1.EGenreRessource.Exclusion:
						lNumAbs = event.data.aObjet.moteur.aUneAbsence(
							lNumEleve,
							lGenreCol,
						);
						lAbs = event.data.aObjet.listeEleves
							.getElementParNumero(lNumEleve)
							.ListeAbsences.get(lNumAbs);
						lTexte += lAbs.listeMotifs.count()
							? lAbs.listeMotifs.getTableauLibelles().join("<br />")
							: ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.MotifNonPrecise",
								);
						if (!!lAbs.Accompagnateur && lAbs.Accompagnateur.existeNumero()) {
							lTexte +=
								"<br />" +
								ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.AccompagnePar",
								) +
								" " +
								event.data.aObjet.listeEleves
									.getElementParNumero(lAbs.Accompagnateur.getNumero())
									.getLibelle();
						}
						break;
					case Enumere_Ressource_1.EGenreRessource.Retard:
						if (
							event.data.aObjet.cours &&
							event.data.aObjet.cours.estAppelVerrouille
						) {
							lTexte +=
								ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.HintVerrouille",
								) + "<br />";
						}
						lNumAbs = event.data.aObjet.moteur.aUneAbsence(
							lNumEleve,
							lGenreCol,
						);
						if (lNumAbs > -1) {
							lAbs = event.data.aObjet.listeEleves
								.getElementParNumero(lNumEleve)
								.ListeAbsences.get(lNumAbs);
							lTexte += ObjetTraduction_1.GTraductions.getValeur(
								"Absence.RetardDe",
								[$(this).text().replace("'", "")],
							);
							lTexte +=
								event.data.aObjet.etatUtilScoEspace.GenreEspace ===
								Enumere_Espace_1.EGenreEspace.Professeur
									? lAbs.Professeur.existeNumero()
										? lAbs.Professeur.Numero ===
											event.data.aObjet.etatUtilScoEspace.Identification.getMembre()
												.Numero
											? ""
											: "<br />" + lAbs.Professeur.Libelle
										: "<br />" +
											ObjetTraduction_1.GTraductions.getValeur(
												"AbsenceVS.RetardSaisiParVS",
											)
									: "";
							if (
								event.data.aObjet.appScoEspace.droits.get(
									ObjetDroitsPN_1.TypeDroits.absences.avecSaisieMotifRetard,
								) &&
								lAbs.listeMotifs.count() > 0
							) {
								lMotif = lAbs.listeMotifs.get(0);
								if (lMotif.getLibelle() && !lMotif.nonConnu) {
									lTexte += "<br />" + lMotif.getLibelle();
								}
							}
						}
						break;
					case Enumere_Ressource_1.EGenreRessource.RepasAPreparer:
						lNumAbs = event.data.aObjet.moteur.aUneAbsence(
							lNumEleve,
							lGenreCol,
						);
						lAbs = event.data.aObjet.listeEleves
							.getElementParNumero(lNumEleve)
							.ListeAbsences.get(lNumAbs);
						if (lAbs.type === TTypePreparerRepas_1.TTypePreparerRepas.prNonDP) {
							lTexte += ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.HintEleveNonDP",
							);
						}
						break;
					default:
						break;
				}
			}
		}
		ObjetHint_1.ObjetHint.start(lTexte);
		if (GNavigateur.isTactile) {
			setTimeout(event.data.aObjet.fermerHint.bind(event.data.aObjet), 4000);
		}
	}
	focusCellule() {
		$(this)
			.parent()
			.css({ "box-shadow": "0 -1px 3px 1px " + GCouleur.bordure + " inset" });
	}
	blurCellule() {
		$(this).parent().css({ "box-shadow": "" });
	}
	clicDroitCellule(event) {
		if (
			event.data &&
			event.data.aObjet &&
			event.data.aObjet.moteur &&
			event.data.aObjet.moteur.autorisations &&
			!!event.data.aObjet.moteur.autorisations.jourConsultUniquement
		) {
			return false;
		}
		const lNumEleve = $(this)
			.children("div:first-child")
			.attr("id")
			.match(lRegexNumEleveNumColAbs)[1];
		const lGenreCol = parseInt(
			$(this)
				.children("div:first-child")
				.attr("id")
				.match(lRegexNumEleveNumColAbs)[2],
		);
		const lDispense =
			lGenreCol === Enumere_Ressource_1.EGenreRessource.Dispense
				? event.data.aObjet.moteur.getDispense(lNumEleve, true)
				: null;
		const lCelluleInactive = $(this).hasClass(
			"tableAbsenceCorpsCelluleInactive",
		);
		const lDemandeDispense = Enumere_Ressource_1.EGenreRessource.Dispense
			? event.data.aObjet.moteur.getDemandeDeDispense(lNumEleve)
			: false;
		if (!!lDispense) {
			lDispense.celluleInactive = lCelluleInactive;
		}
		$(
			"#" +
				event.data.aObjet.Nom.escapeJQ() +
				' table.tableAbsenceEleve td[id$="_' +
				lNumEleve +
				'_lib"]',
		).click();
		if (
			(lCelluleInactive &&
				(!lDispense || !lDispense.publierPJFeuilleDAppel) &&
				!$(this).hasClass("tableAbsenceCorpsCelluleAvecMenu")) ||
			($(this).hasClass("tableAbsenceCorpsCelluleInactiveVieSco") &&
				((lGenreCol === Enumere_Ressource_1.EGenreRessource.Retard &&
					!event.data.aObjet.options.suppressionRetardDeVS) ||
					!event.data.aObjet.options.suppressionAbsenceDeVS)) ||
			lGenreCol === Enumere_Ressource_1.EGenreRessource.RepasAPreparer ||
			lDemandeDispense
		) {
			return false;
		}
		if ($(this).children("div:first-child").html() !== "") {
			let lObservation = null,
				lPunitionExclusion = null,
				lElementObservation = null;
			if (lGenreCol === Enumere_Ressource_1.EGenreRessource.Observation) {
				lObservation = $(this)
					.children("div:first-child")
					.attr("id")
					.match(
						new RegExp(`abs_${ObjetElement_1.ObjetElement.regexCaptureNumero}`),
					)[1];
				const lNumeroAbsence = event.data.aObjet.moteur.aUneAbsence(
					lNumEleve,
					lGenreCol,
					lObservation,
				);
				if (lNumeroAbsence >= 0) {
					lElementObservation = event.data.aObjet.listeEleves
						.getElementParNumero(lNumEleve)
						.ListeAbsences.get(lNumeroAbsence);
				}
			} else if (
				lGenreCol === Enumere_Ressource_1.EGenreRessource.Punition ||
				lGenreCol === Enumere_Ressource_1.EGenreRessource.Exclusion
			) {
				const lNumeroPunition = event.data.aObjet.moteur.aUneAbsence(
					lNumEleve,
					lGenreCol,
				);
				if (lGenreCol === Enumere_Ressource_1.EGenreRessource.Punition) {
					lPunitionExclusion = event.data.aObjet.listeEleves
						.getElementParNumero(lNumEleve)
						.listePunitions.get(lNumeroPunition);
				} else {
					lPunitionExclusion = event.data.aObjet.listeEleves
						.getElementParNumero(lNumEleve)
						.ListeAbsences.get(lNumeroPunition);
				}
			}
			GNavigateur.positionnerMenuContextuelSurId(
				$(this).children("div:first-child").attr("id"),
				$(this).children("div:first-child").width() / 2,
				0,
			);
			event.data.aObjet.callback.appel(
				Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
					.ClicDroit,
				{
					genreAbsence: lGenreCol,
					numeroObservation: lObservation,
					observation: lElementObservation,
					punitionExclusion: lPunitionExclusion,
					dispense: lDispense,
				},
			);
		}
		return false;
	}
	survolInfoEleve() {
		if ($(this).data("title") && $(this).data("title") === false) {
			return false;
		}
		if ($(this).data("title") && $(this).data("title") !== "") {
			$.noop();
		} else if (
			$(this).hasClass("tableAbsenceEleveLibelle") &&
			$(this).attr("title") === ""
		) {
			if ($(this).width() < $(this).prop("scrollWidth")) {
				$(this).data("title", $(this).html());
			} else {
				$(this).data("title", false);
			}
		} else if ($(this).attr("title") !== "" || $(this).data("title") !== "") {
			if ($(this).attr("title") && $(this).attr("title") !== "") {
				$(this)
					.data("title", $(this).attr("title").replace(/\n/g, "<br />"))
					.attr("title", "");
			}
		} else {
			$(this).data("title", false);
			return false;
		}
		ObjetHint_1.ObjetHint.start($(this).data("title"));
		return false;
	}
	clicDevoirARendre(event) {
		if ($(this).is(".icon_nouveau_document, .icon_filigrane_idevoir_rendu")) {
			const lNumEleve = $(this)
				.parent("div")
				.parent("td")
				.attr("id")
				.match(lRegexNumEleveLib)[1];
			event.data.aObjet.callback.appel(
				Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
					.ChangerEtatDevoir,
				{ numeroEleve: lNumEleve },
			);
		}
	}
	clicMemo(event) {
		const lNumEleve = $(this)
			.parent("div")
			.parent("td")
			.attr("id")
			.match(lRegexNumEleveLib)[1];
		event.data.aObjet.callback.appel(
			Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.MemosEleves,
			{ numeroEleve: lNumEleve },
		);
	}
	clicValorisation(event) {
		const lNumEleve = $(this)
			.parent("div")
			.parent("td")
			.attr("id")
			.match(lRegexNumEleveLib)[1];
		event.data.aObjet.callback.appel(
			Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.ValorisationsEleve,
			{ numeroEleve: lNumEleve },
		);
	}
	clicDroitEleve(event) {
		const lNumEleve = $(this)
			.parent("div")
			.parent("td")
			.attr("id")
			.match(lRegexNumEleveLib)[1];
		$(
			"#" +
				event.data.aObjet.Nom.escapeJQ() +
				' table.tableAbsenceEleve td[id$="_' +
				lNumEleve +
				'_lib"]',
		).click();
		event.data.aObjet.callback.appel(
			Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.ContextMenuEleve,
			{ numeroEleve: lNumEleve },
		);
	}
	retourChangementDevoir(aNumEleve) {
		const lEleve = this.listeEleves.getElementParNumero(aNumEleve);
		const lJqCelluleEleve = $(
			"#" +
				this.Nom.escapeJQ() +
				' table.tableAbsenceEleve td[id$="_' +
				aNumEleve +
				'_lib"]',
		);
		let lClassDevARendre = "";
		if (lEleve.devoirARendre.Numero !== null) {
			if (lEleve.devoirARendre.programmation.Genre === 1) {
				lClassDevARendre = "icon_filigrane_idevoir_rendu";
			} else {
				lClassDevARendre = "icon_nouveau_document";
			}
		}
		lJqCelluleEleve
			.children("div")
			.children("div.tableAbsenceEleveDevARendre")
			.removeClass("icon_filigrane_idevoir_rendu icon_nouveau_document")
			.addClass(lClassDevARendre);
	}
	retourAbsence(aNumEleve, aGenreAbs, aNumObs) {
		const lEleve = this.listeEleves.getElementParNumero(aNumEleve);
		let lColonne = lEleve.listeColonnes.getElementParNumeroEtGenre(
			aNumObs,
			aGenreAbs,
		);
		const lJqCellAbs = $(
			"#" +
				this.Nom.escapeJQ() +
				' table.tableAbsenceCorps div[id*="_' +
				aNumEleve +
				"_" +
				aGenreAbs +
				"_abs" +
				(aNumObs ? "_" + aNumObs : "") +
				'"]',
		);
		if (!lColonne) {
			lEleve.listeColonnes.addElement(
				new ObjetElement_1.ObjetElement("", aNumObs, aGenreAbs),
			);
			lColonne = lEleve.listeColonnes.getElementParNumeroEtGenre(
				aNumObs,
				aGenreAbs,
			);
			lColonne.nombre = 0;
			if (aGenreAbs === Enumere_Ressource_1.EGenreRessource.Observation) {
				lColonne.genreObservation = lJqCellAbs
					.attr("id")
					.match(/_([0-9a-z]+)$/)[1];
			}
		}
		lJqCellAbs.html(
			this.moteur.getAffichageGenre(
				aNumEleve,
				aGenreAbs,
				aNumObs,
				lColonne.Genre === Enumere_Ressource_1.EGenreRessource.Observation
					? lColonne.genreObservation
					: null,
			),
		);
		const lChecked =
			this.moteur.aUneAbsence(aNumEleve, aGenreAbs, aNumObs) >= 0
				? "true"
				: "false";
		lJqCellAbs.attr("aria-checked", lChecked);
		this.setCellulesInactives(aNumEleve);
		if (
			aGenreAbs === Enumere_Ressource_1.EGenreRessource.Retard &&
			this.moteur.avecSaisieMotif(aGenreAbs) &&
			this.moteur.aUneAbsence(aNumEleve, aGenreAbs, aNumObs) >= 0
		) {
			this.ouvrirZoneTexte(aNumEleve, aGenreAbs, aNumObs);
		}
	}
	retourDemandeDispense(aNumEleve, aGenreAbs) {
		const lJqCellAbs = $(
			"#" +
				this.Nom.escapeJQ() +
				' table.tableAbsenceCorps div[id*="_' +
				aNumEleve +
				"_" +
				aGenreAbs +
				"_abs" +
				'"]',
		);
		lJqCellAbs.html(
			this.moteur.getAffichageGenre(aNumEleve, aGenreAbs, null, null),
		);
	}
	ouvrirZoneTexte(aNumEleve, aGenreAbs, aNumObs, aTypeObs, aGenreEtat) {
		const lJqContainer = $(
			"#" +
				this.Nom.escapeJQ() +
				' table.tableAbsenceCorps div[id*="_' +
				aNumEleve +
				"_" +
				aGenreAbs +
				"_abs" +
				(aNumObs ? "_" + aNumObs : "") +
				'"]',
		).parent();
		if (lJqContainer.children("input, textarea").length > 0) {
			return false;
		}
		let lJqZoneTexte;
		const lAbsence = this.callback.appel(
			Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.RecupererAbsence,
			{
				genreAbsence: aGenreAbs,
				genreObservation: aNumObs,
				place: this.placeSaisieDebut,
			},
		);
		if (aGenreAbs === Enumere_Ressource_1.EGenreRessource.Retard) {
			lJqZoneTexte = $('<input type="text" />');
			lJqZoneTexte
				.val(lAbsence.Duree)
				.css({
					border: "0",
					padding: "0",
					margin: "0",
					width: lJqContainer.width(),
					height: lJqContainer.height(),
				});
		} else if (
			aGenreAbs === Enumere_Ressource_1.EGenreRessource.Observation ||
			aGenreAbs === Enumere_Ressource_1.EGenreRessource.Dispense
		) {
			this.callback.appel(
				Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
					.OuvrirEditionObservation,
				{
					absence: lAbsence,
					genreObservation: aNumObs,
					genreEtat: aGenreEtat,
					typeObs: aTypeObs,
				},
			);
			return false;
		} else {
			return false;
		}
		lJqContainer.children("div").hide();
		lJqContainer.append(lJqZoneTexte);
		lJqZoneTexte.focus().each(function () {
			if (typeof this.setSelectionRange !== "undefined") {
				this.setSelectionRange(0, this.value.length);
			} else if (typeof this.createTextRange !== "undefined") {
				const range = this.createTextRange();
				range.collapse(true);
				range.moveEnd("character", this.value.length);
				range.moveStart("character", 0);
				range.select();
			}
		});
		lJqZoneTexte
			.keyup({ aObjet: this }, this.keydownZoneTexte)
			.blur({ aObjet: this }, this.blurZoneTexte)
			.click(() => {
				return false;
			})
			.on("contextmenu", () => {
				return false;
			});
		return false;
	}
	ouvrirFenetreAbsencesParPas(aNumEleve, aGenreAbs) {
		const lAbsence = this.moteur.aUneAbsence(aNumEleve, aGenreAbs);
		if (lAbsence > -1) {
			this.callback.appel(
				Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
					.OuvrirAbsenceParPas,
				{
					absence: this.listeEleves
						.getElementParNumero(aNumEleve)
						.ListeAbsences.get(lAbsence),
				},
			);
		}
		return false;
	}
	keydownZoneTexte(event) {
		const lGenreCol = parseInt(
			$(this)
				.parent()
				.children("div:first-child")
				.attr("id")
				.match(lRegexNumEleveNumColAbs)[2],
		);
		if (lGenreCol === Enumere_Ressource_1.EGenreRessource.Retard) {
			$(this)
				.delay(1)
				.queue(function () {
					const lDuree = parseInt(
						$(this)
							.val()
							.replace(/[^0-9]/g, "")
							.substring(0, 3),
					);
					$(this)
						.val(lDuree > 0 ? lDuree : "")
						.dequeue();
				});
		}
		if (GNavigateur.isToucheRetourChariot() || GNavigateur.isToucheEchap()) {
			$(this).blur();
		}
	}
	blurZoneTexte(event) {
		const lNumEleve = $(this)
			.parent()
			.children("div:first-child")
			.attr("id")
			.match(lRegexNumEleveNumColAbs)[1];
		const lGenreCol = parseInt(
			$(this)
				.parent()
				.children("div:first-child")
				.attr("id")
				.match(lRegexNumEleveNumColAbs)[2],
		);
		let lNumObs = null;
		if (lGenreCol === Enumere_Ressource_1.EGenreRessource.Observation) {
			lNumObs = $(this)
				.parent()
				.children("div:first-child")
				.attr("id")
				.match(
					new RegExp(
						`abs_${ObjetElement_1.ObjetElement.regexCaptureNumero}_([0-9]+)$`,
					),
				)[1];
		}
		if ($(this).val().trim() === "") {
			event.data.aObjet.callback.appel(
				Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
					.ActionSurAbsence,
				{
					typeSaisie: Enumere_Etat_1.EGenreEtat.Suppression,
					typeAbsence: lGenreCol,
					typeObservation: lNumObs,
					numeroEleve: event.data.aObjet.numeroEleveSelectionne,
					placeDebut: event.data.aObjet.placeSaisieDebut,
					placeFin: event.data.aObjet.placeSaisieFin,
				},
			);
		} else {
			const lAbsence = event.data.aObjet.callback.appel(
				Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
					.RecupererAbsence,
				{
					genreAbsence: lGenreCol,
					genreObservation: lNumObs,
					place: event.data.aObjet.placeSaisieDebut,
				},
			);
			if (
				lGenreCol === Enumere_Ressource_1.EGenreRessource.Retard &&
				ObjetRequetePageSaisieAbsences_1.ObjetRequetePageSaisieAbsences.isObjetElementRetard(
					lAbsence,
				)
			) {
				const lDuree = parseInt(
					$(this)
						.val()
						.replace(/[^0-9]/g, "")
						.substring(0, 3),
				);
				if (lAbsence.Duree !== lDuree && lDuree <= 240) {
					lAbsence.Duree = lDuree;
					$(this).val(lDuree > 0 ? lDuree : "");
					lAbsence.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					event.data.aObjet.setEtatSaisie(true);
				}
			} else if (
				lGenreCol === Enumere_Ressource_1.EGenreRessource.Observation &&
				ObjetRequetePageSaisieAbsences_1.ObjetRequetePageSaisieAbsences.isObjetElementObservationIndividuEleve(
					lAbsence,
				) &&
				lAbsence.commentaire !== $(this).val()
			) {
				lAbsence.commentaire = $(this).val().trim();
				lAbsence.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				event.data.aObjet.setEtatSaisie(true);
			}
		}
		$(this).parent().children("div").show();
		event.data.aObjet.retourAbsence(lNumEleve, lGenreCol, lNumObs);
		$(this).remove();
		if (event.data.aObjet._gestionFocus_apresFenetreCelluleId) {
			ObjetHtml_1.GHtml.setFocus(
				event.data.aObjet._gestionFocus_apresFenetreCelluleId,
				true,
				true,
			);
		}
		return false;
	}
	actualiserPunitionsEleve(aNumEleve, aGenreRessource) {
		this.retourAbsence(aNumEleve, aGenreRessource);
	}
	setActif(aEstActif) {
		this.actif = aEstActif;
	}
	setDeplacementBornes() {
		return false;
	}
	composeTitres() {
		const H = [];
		H.push(
			"<table  ",
			ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_2.EGenreRole.Presentation),
			' class="tableAbsenceTitre" id="',
			this.ScrollV.getIdContenu(2),
			'">',
		);
		H.push(
			"<tr ",
			ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_2.EGenreRole.Row),
			">",
		);
		for (let i = 0; i < this.listeColonnes.count(); i++) {
			const lColonne = this.listeColonnes.get(i);
			if (!lColonne.Actif) {
				continue;
			}
			const lIdColonne =
				this.Nom +
				"_col_" +
				lColonne.Genre +
				(lColonne.Genre === Enumere_Ressource_1.EGenreRessource.Observation
					? "_" + lColonne.Numero
					: "");
			let lStyleWidthColonne = null;
			if (lColonne.Genre === Enumere_Ressource_1.EGenreRessource.Observation) {
				if (
					lColonne.genreObservation ===
						TypeGenreObservationVS_1.TypeGenreObservationVS
							.OVS_ObservationParent ||
					lColonne.genreObservation ===
						TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Encouragement
				) {
					lStyleWidthColonne =
						this.largeurColonneObsParent + this.largeurColonne + 1 + "px";
				}
			} else if (
				lColonne.Genre === Enumere_Ressource_1.EGenreRessource.RepasAPreparer
			) {
				lStyleWidthColonne = this.largeurColonne + "px";
			}
			H.push(
				`<th ${ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_2.EGenreRole.Presentation)}>`,
				`<div ${ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_2.EGenreRole.Columnheader)} title="${this.getTitleColonne(lColonne)}" id="${lIdColonne}" ${lStyleWidthColonne ? `style="width:${lStyleWidthColonne};"` : ""}>`,
				`<span>${lColonne.Libelle}</span>`,
				`<i role="presentation" class="${this.getImageColonne(lColonne)}"></i>`,
				"</div>",
				"</th>",
			);
		}
		H.push("</tr>");
		H.push("</table>");
		return H.join("");
	}
	getImageColonne(aColonne) {
		switch (aColonne.Genre) {
			case Enumere_Ressource_1.EGenreRessource.Infirmerie:
				return "icon_info_sondage_publier mix-icon_question i-blue i-small";
			case Enumere_Ressource_1.EGenreRessource.Punition:
			case Enumere_Ressource_1.EGenreRessource.Exclusion:
				return this.appScoEspace.droits.get(
					ObjetDroitsPN_1.TypeDroits.punition.avecPublicationPunitions,
				)
					? "icon_info_sondage_publier mix-icon_question i-blue i-small"
					: "icon_info_sondage_publier mix-icon_remove i-red i-small";
			case Enumere_Ressource_1.EGenreRessource.RepasAPreparer:
				return "icon_info_sondage_publier mix-icon_remove i-red i-small";
			case Enumere_Ressource_1.EGenreRessource.Observation:
				return aColonne.publiable
					? "icon_info_sondage_publier mix-icon_question i-blue i-small"
					: "icon_info_sondage_publier mix-icon_remove i-red i-small";
			default:
				return "icon_info_sondage_publier mix-icon_ok i-green i-small";
		}
	}
	getTitleColonne(aColonne) {
		switch (aColonne.Genre) {
			case Enumere_Ressource_1.EGenreRessource.Infirmerie:
				return ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.Hint.PublieParentsElevesParInfirmerie",
				);
			case Enumere_Ressource_1.EGenreRessource.Observation:
				if (!aColonne.publiable) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.Hint.NonPublie",
					);
				}
				switch (aColonne.genreObservation) {
					case TypeGenreObservationVS_1.TypeGenreObservationVS
						.OVS_ObservationParent:
					case TypeGenreObservationVS_1.TypeGenreObservationVS
						.OVS_Encouragement:
					case TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_DefautCarnet:
					case TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Autres:
						return ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.Hint.PublieParentsElevesParProfesseur",
						);
				}
				return "";
			case Enumere_Ressource_1.EGenreRessource.Exclusion:
			case Enumere_Ressource_1.EGenreRessource.Punition:
				return this.appScoEspace.droits.get(
					ObjetDroitsPN_1.TypeDroits.punition.avecPublicationPunitions,
				)
					? ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.Hint.PublieParentsParProfesseur",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.Hint.NonPublie",
						);
			case Enumere_Ressource_1.EGenreRessource.RepasAPreparer:
				if (
					this.genreRepas ===
					TypeGenreRepasEleve_1.TypeGenreRepasEleve.RepasMidi
				) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.InscrireDesinscrireRepasMidi",
					);
				} else {
					return (
						ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.InscrireDesinscrireRepasSoir",
						) +
						" " +
						"(" +
						ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.Hint.NonPublie",
						) +
						")"
					);
				}
		}
		return ObjetTraduction_1.GTraductions.getValeur(
			"AbsenceVS.Hint.PublieParentsEleves",
		);
	}
	composeListeEleves() {
		const H = [];
		this.enseignantCourant = this.callback.appel(
			Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.RecupererInfo,
			{ enseignantCourant: true },
		);
		this.cours = this.callback.appel(
			Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.RecupererInfo,
			{ cours: true },
		);
		H.push(
			'<table class="tableAbsenceEleve" id="',
			this.ScrollV.getIdContenu(0),
			'">',
		);
		for (let i = 0; i < this.listeEleves.count() - 1; i++) {
			if (
				this.listeEleves.get(i).getEtat() !==
				Enumere_Etat_1.EGenreEtat.Suppression
			) {
				let lEleve = this.listeEleves.get(i);
				let lClassEleve = "",
					lTitleEleve = "";
				let lLibelleEleve =
					lEleve.Libelle +
					(lEleve.complementInfo ? " " + lEleve.complementInfo : "");
				if (lEleve.absentAuDernierCours) {
					lClassEleve = "tableAbsenceEleveAbsentDernierCours";
					lTitleEleve = lEleve.hintAbsentAuDernierCours;
				}
				if (!lEleve.estAttendu) {
					lClassEleve = "tableAbsenceEleveEstAttendu";
					lTitleEleve = ObjetChaine_1.GChaine.format(
						ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.AutoriseSortirEtab",
						),
						[lLibelleEleve],
					);
				}
				if (lEleve.sortiePeda) {
					lClassEleve = "tableAbsenceEleveSortiePeda";
					lTitleEleve =
						(lTitleEleve ? lTitleEleve : lLibelleEleve) +
						"\n" +
						lEleve.hintSortiePeda;
				}
				if (!lTitleEleve && lEleve.strStatut) {
					lTitleEleve =
						(lTitleEleve ? lTitleEleve + "\n" : "") + lEleve.strStatut;
				}
				H.push(
					`<tr ${ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_2.EGenreRole.Row)}>`,
				);
				H.push(
					`<td ${ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_2.EGenreRole.Rowheader)} id="${this.Nom}_${lEleve.Numero}_lib" tabindex="${i === 0 ? 0 : -1}" onkeyup="${this.Nom}.surKeyUp(id,${i},-1,1);" ${lClassEleve ? `class="${lClassEleve}"` : ""}>`,
				);
				H.push(
					`<div class="as-th-wrapper moteurAbsences" style="${ObjetStyle_1.GStyle.composeWidth(this.largeurColonneEleve - 10)}">`,
				);
				H.push(
					`<span class="libelle ${lEleve.estSorti ? ` Barre ` : ""}  ${lEleve.eleveAjouteAuCours ? ` Italique` : ""}" ie-ellipsis title="${lTitleEleve}">${lLibelleEleve} ${lEleve.sortiePeda ? `*` : ""}</span>`,
				);
				const lListeIcones =
					this.moteur.getListeIconesElevePourFeuilleDAppel(lEleve);
				lListeIcones.parcourir((aElement) => {
					if (aElement.actif) {
						let lMaClass = aElement.class;
						if (
							aElement.getGenre() ===
							TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel.devoir
						) {
							lMaClass += " tableAbsenceEleveDevARendre";
							if (
								lEleve.devoirARendre.demandeur.getNumero() === 0 ||
								(lEleve.devoirARendre.demandeur.getGenre() ===
									this.enseignantCourant.getGenre() &&
									lEleve.devoirARendre.demandeur.getNumero() ===
										this.enseignantCourant.getNumero())
							) {
								lMaClass += " tableAbsenceEleveDevARendreInteractif";
							}
						} else if (
							aElement.getGenre() ===
							TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel
								.absenceConvocationAuto
						) {
							if (
								aElement.avecEvenement &&
								this.appScoEspace.droits.get(
									ObjetDroitsPN_1.TypeDroits.fonctionnalites
										.saisieEtendueAbsenceDepuisAppel,
								)
							) {
								lMaClass += ` AvecMain ${this.classAbsencesConvoc}`;
							} else {
								lMaClass += " SansMain";
							}
						} else if (
							aElement.getGenre() ===
							TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel
								.projetAccompagnement
						) {
							if (aElement.avecEvenement) {
								lMaClass += ` AvecMain ${this.classAbsencesProjetsAccompagnement}`;
							} else {
								lMaClass += " SansMain";
							}
						} else if (
							aElement.getGenre() ===
							TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel.memo
						) {
							lMaClass += " tableAbsenceEleveMemo";
						} else if (
							aElement.getGenre() ===
							TypeIconeFeuilleDAppel_1.TypeIconeFeuilleDAppel.valorisation
						) {
							lMaClass += " tableAbsenceEleveValorisation";
						} else {
							lMaClass += " SansMain";
						}
						H.push(
							IE.jsx.str("i", {
								role: "img",
								class: "icon-feuilledappel " + lMaClass,
								"ie-tooltiplabel": aElement.getLibelle(),
							}),
						);
					}
				});
				H.push("</div></td></tr>");
			}
		}
		H.push("</table>");
		return H.join("");
	}
	composeCorps() {
		const H = [];
		H.push(
			"<table ",
			ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_2.EGenreRole.Presentation),
			' class="tableAbsenceCorps" id="',
			this.ScrollV.getIdContenu(1),
			'">',
		);
		for (let i = 0; i < this.listeEleves.count() - 1; i++) {
			if (
				this.listeEleves.get(i).getEtat() !==
				Enumere_Etat_1.EGenreEtat.Suppression
			) {
				const lEleve = this.listeEleves.get(i);
				H.push("<tr>");
				for (let j = 0; j < this.listeColonnes.count(); j++) {
					const lColonne = this.listeColonnes.get(j);
					if (!lColonne.Actif) {
						continue;
					}
					const lContenuRecap = this.getNombreGenre(
						lEleve.Numero,
						lColonne.Genre,
						lColonne.Genre === Enumere_Ressource_1.EGenreRessource.Observation
							? lColonne.Numero
							: null,
					);
					const lPourParents =
						lColonne.Genre !==
							Enumere_Ressource_1.EGenreRessource.Observation ||
						(lColonne.Genre ===
							Enumere_Ressource_1.EGenreRessource.Observation &&
							(lColonne.genreObservation ===
								TypeGenreObservationVS_1.TypeGenreObservationVS
									.OVS_ObservationParent ||
								lColonne.genreObservation ===
									TypeGenreObservationVS_1.TypeGenreObservationVS
										.OVS_Encouragement));
					const lCocheAbs =
						this.moteur.aUneAbsence(
							lEleve.Numero,
							Enumere_Ressource_1.EGenreRessource.Absence,
						) >= 0
							? "true"
							: "false";
					let lTitle;
					if (
						lColonne.Genre === Enumere_Ressource_1.EGenreRessource.Absence &&
						lEleve.estDetache
					) {
						lTitle = ObjetChaine_1.GChaine.toTitle(lEleve.hintDetache);
					}
					H.push(
						'<td  class="tableAbsenceCorpsCellule">',
						"<div ",
						ObjetWAI_1.GObjetWAI.composeAttribut({
							genre: ObjetWAI_3.EGenreAttribut.live,
							valeur: "assertive",
						}),
						" ",
						lColonne.Genre === Enumere_Ressource_1.EGenreRessource.Retard
							? ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_2.EGenreRole.Textbox)
							: ObjetWAI_1.GObjetWAI.composeRole(
									ObjetWAI_2.EGenreRole.Checkbox,
								),
						' id="',
						this.moteur.composeIdCell(
							this.Nom,
							lEleve.getNumero(),
							lColonne.getGenre(),
							lColonne.getNumero(),
							lColonne.genreObservation,
						),
						'"',
						' class="',
						lColonne.Genre !== Enumere_Ressource_1.EGenreRessource.Retard &&
							lColonne.genreObservation !==
								TypeGenreObservationVS_1.TypeGenreObservationVS
									.OVS_ObservationParent &&
							lColonne.genreObservation !==
								TypeGenreObservationVS_1.TypeGenreObservationVS
									.OVS_Encouragement
							? "tableAbsenceCorpsCelluleCoche"
							: lColonne.Genre === Enumere_Ressource_1.EGenreRessource.Retard
								? "tableAbsenceCorpsCelluleRetard"
								: "tableAbsenceCorpsCelluleTexte",
						'"',
						lColonne.Genre ===
							Enumere_Ressource_1.EGenreRessource.Observation &&
							(lColonne.genreObservation ===
								TypeGenreObservationVS_1.TypeGenreObservationVS
									.OVS_ObservationParent ||
								lColonne.genreObservation ===
									TypeGenreObservationVS_1.TypeGenreObservationVS
										.OVS_Encouragement)
							? ' style="width:' + this.largeurColonneObsParent + 'px;"'
							: "",
						' tabindex="-1" ',
						!!lTitle ? `title="${lTitle}"` : "",
						ObjetWAI_1.GObjetWAI.composeAttribut({
							genre: ObjetWAI_3.EGenreAttribut.label,
							valeur:
								lColonne.Libelle +
								" " +
								lEleve.Libelle +
								(lPourParents ? " " + this.getTitleColonne(lColonne) : ""),
						}),
						" ",
						ObjetWAI_1.GObjetWAI.composeAttribut({
							genre: ObjetWAI_3.EGenreAttribut.checked,
							valeur: lCocheAbs,
						}),
						' onkeyup="',
						this.Nom,
						".surKeyUp(id,",
						i,
						",",
						j,
						",",
						lColonne.genreObservation !==
							TypeGenreObservationVS_1.TypeGenreObservationVS
								.OVS_ObservationParent &&
							lColonne.genreObservation !==
								TypeGenreObservationVS_1.TypeGenreObservationVS
									.OVS_Encouragement
							? 2
							: 0,
						');"',
						"></div>",
						"</td>",
					);
					if (
						lColonne.Genre !==
						Enumere_Ressource_1.EGenreRessource.RepasAPreparer
					) {
						H.push(
							'<td  class="tableAbsenceRecap',
							this.appScoEspace.droits.get(
								ObjetDroitsPN_1.TypeDroits.absences
									.avecAccesAuxEvenementsAutresCours,
							) || lContenuRecap !== ""
								? " tableAbsenceAvecRecap"
								: "",
							lEleve.aDesObservationsNonLues &&
								lColonne.Genre ===
									Enumere_Ressource_1.EGenreRessource.Observation &&
								(lColonne.genreObservation ===
									TypeGenreObservationVS_1.TypeGenreObservationVS
										.OVS_ObservationParent ||
									lColonne.genreObservation ===
										TypeGenreObservationVS_1.TypeGenreObservationVS
											.OVS_Encouragement)
								? " tableAbsenceObsNonLue"
								: "",
							'">',
							"<div ",
							ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_2.EGenreRole.Button),
							' id="',
							this.Nom,
							"_cel_",
							lEleve.Numero,
							"_",
							lColonne.Genre,
							"_recap",
							lColonne.Genre === Enumere_Ressource_1.EGenreRessource.Observation
								? "_" + lColonne.Numero
								: "",
							'" tabindex="-1"',
							' onkeyup="',
							this.Nom,
							".surKeyUp(id,",
							i,
							",",
							j,
							',1);" ',
							ObjetWAI_1.GObjetWAI.composeAttribut({
								genre: ObjetWAI_3.EGenreAttribut.label,
								valeur:
									ObjetTraduction_1.GTraductions.getValeur(
										"AbsenceVS.Recapitulatif",
									) +
									" " +
									lColonne.Libelle +
									" " +
									lEleve.Libelle +
									" " +
									(lPourParents ? this.getTitleColonne(lColonne) : "") +
									" " +
									lContenuRecap,
							}),
							">",
							lContenuRecap,
							"</div></td>",
						);
					}
				}
				H.push("</tr>");
			}
		}
		H.push("</table>");
		return H.join("");
	}
	surKeyUp(aId, aI, aJ, aGenre) {
		let lEleve = null,
			lId = "",
			lColonne = null;
		if (GNavigateur.isToucheMenuContextuel()) {
			if (aJ >= 0 && aJ < this.listeColonnes.count()) {
				lEleve = this.listeEleves.get(aI);
				lColonne = this.listeColonnes.get(aJ);
				if (aGenre === 0) {
					lId =
						this.Nom +
						"_cel_" +
						lEleve.Numero +
						"_" +
						lColonne.Genre +
						"_abs" +
						(lColonne.Genre === Enumere_Ressource_1.EGenreRessource.Observation
							? "_" + lColonne.Numero + "_" + lColonne.genreObservation
							: "");
				} else if (aGenre === 1) {
					lId =
						this.Nom +
						"_cel_" +
						lEleve.Numero +
						"_" +
						lColonne.Genre +
						"_recap" +
						(lColonne.Genre === Enumere_Ressource_1.EGenreRessource.Observation
							? "_" + lColonne.Numero
							: "");
				}
				if (lId) {
					$("#" + lId.escapeJQ()).contextmenu();
				}
			}
		} else if (GNavigateur.isToucheOnlyTab()) {
			lEleve = this.listeEleves.get(aI);
			lId = this.Nom + "_" + lEleve.Numero + "_lib";
			if (lId) {
				$("#" + lId.escapeJQ()).click();
			}
		} else if (GNavigateur.isToucheFlecheBas()) {
			if (aI < this.listeEleves.count() - 2) {
				lEleve = this.listeEleves.get(aI + 1);
				lId = this.Nom + "_" + lEleve.Numero + "_lib";
				if (lId) {
					$("#" + lId.escapeJQ()).click();
				}
			}
		} else if (GNavigateur.isToucheFlecheHaut()) {
			if (aI > 0) {
				lEleve = this.listeEleves.get(aI - 1);
				lId = this.Nom + "_" + lEleve.Numero + "_lib";
				if (lId) {
					$("#" + lId.escapeJQ()).click();
				}
			}
		} else if (GNavigateur.isToucheFlecheDroite()) {
			if (aJ < this.listeColonnes.count()) {
				lEleve = this.listeEleves.get(aI);
				do {
					lColonne = this.listeColonnes.get(aGenre === 1 ? ++aJ : aJ);
				} while (aJ < this.listeColonnes.count() && !lColonne.Actif);
				if (lColonne.Actif) {
					if (aGenre === 1) {
						lId =
							this.Nom +
							"_cel_" +
							lEleve.Numero +
							"_" +
							lColonne.Genre +
							"_abs" +
							(lColonne.Genre ===
							Enumere_Ressource_1.EGenreRessource.Observation
								? "_" + lColonne.Numero + "_" + lColonne.genreObservation
								: "");
					} else {
						lId =
							this.Nom +
							"_cel_" +
							lEleve.Numero +
							"_" +
							lColonne.Genre +
							"_recap" +
							(lColonne.Genre ===
							Enumere_Ressource_1.EGenreRessource.Observation
								? "_" + lColonne.Numero
								: "");
					}
					if (lId) {
						$("#" + lId.escapeJQ()).focus();
					}
				}
			}
		} else if (GNavigateur.isToucheFlecheGauche()) {
			if (aJ > 0 || (aJ === 0 && aGenre === 1)) {
				lEleve = this.listeEleves.get(aI);
				do {
					lColonne = this.listeColonnes.get(aGenre === 1 ? aJ : --aJ);
				} while (aJ > 0 && !lColonne.Actif);
				if (lColonne.Actif) {
					if (aGenre === 1) {
						lId =
							this.Nom +
							"_cel_" +
							lEleve.Numero +
							"_" +
							lColonne.Genre +
							"_abs" +
							(lColonne.Genre ===
							Enumere_Ressource_1.EGenreRessource.Observation
								? "_" + lColonne.Numero + "_" + lColonne.genreObservation
								: "");
					} else {
						lId =
							this.Nom +
							"_cel_" +
							lEleve.Numero +
							"_" +
							lColonne.Genre +
							"_recap" +
							(lColonne.Genre ===
							Enumere_Ressource_1.EGenreRessource.Observation
								? "_" + lColonne.Numero
								: "");
					}
					if (lId) {
						$("#" + lId.escapeJQ()).focus();
					}
				}
			}
		} else if (GNavigateur.isToucheSelection()) {
			if (aJ >= 0 && aJ < this.listeColonnes.count()) {
				lEleve = this.listeEleves.get(aI);
				lColonne = this.listeColonnes.get(aJ);
				if (aGenre === 0) {
					lId =
						this.Nom +
						"_cel_" +
						lEleve.Numero +
						"_" +
						lColonne.Genre +
						"_abs" +
						(lColonne.Genre === Enumere_Ressource_1.EGenreRessource.Observation
							? "_" + lColonne.Numero + "_" + lColonne.genreObservation
							: "");
					this._gestionFocus_apresFenetreCelluleId = lId;
				} else if (aGenre === 1) {
					lId =
						this.Nom +
						"_cel_" +
						lEleve.Numero +
						"_" +
						lColonne.Genre +
						"_recap" +
						(lColonne.Genre === Enumere_Ressource_1.EGenreRessource.Observation
							? "_" + lColonne.Numero
							: "");
					this._gestionFocus_apresFenetreRecapId = lId;
				} else {
					lId = aId;
				}
				if (lId) {
					if (aGenre === 2) {
						$("#" + lId.escapeJQ()).focus();
					}
					$("#" + lId.escapeJQ()).click();
				}
			}
		}
	}
	setCellulesInactives(aNumEleve) {
		const lJqCelsEleve = $(
			"#" +
				this.Nom.escapeJQ() +
				' table.tableAbsenceCorps div[id*="cel_' +
				aNumEleve +
				'_"]',
		);
		const lEleve = this.listeEleves.getElementParNumero(aNumEleve);
		let lTabInactif = [];
		lJqCelsEleve
			.parent()
			.removeClass(
				"tableAbsenceCorpsCelluleInactive tableAbsenceCorpsCelluleVerrouille",
			);
		lTabInactif = this.moteur.calculTableauColonnesInactives(aNumEleve);
		for (const x in lTabInactif) {
			const lObjX = lTabInactif[x];
			let lGenreColonne, lNumeroColonne;
			if (MethodesObjet_1.MethodesObjet.isNumber(lObjX)) {
				lGenreColonne = lObjX;
			} else {
				lGenreColonne = lObjX.genre || lObjX;
				lNumeroColonne = lObjX.numero || undefined;
			}
			if (!lNumeroColonne) {
				$(
					"#" +
						this.Nom.escapeJQ() +
						' table.tableAbsenceCorps div[id*="_' +
						aNumEleve +
						"_" +
						lGenreColonne +
						'_abs"]',
				)
					.not(
						'div[id$="_' +
							TypeGenreObservationVS_1.TypeGenreObservationVS
								.OVS_ObservationParent +
							'"]',
					)
					.not(
						'div[id$="_' +
							TypeGenreObservationVS_1.TypeGenreObservationVS
								.OVS_Encouragement +
							'"]',
					)
					.parent()
					.addClass("tableAbsenceCorpsCelluleInactive");
			} else {
				$(
					"#" +
						this.Nom.escapeJQ() +
						' table.tableAbsenceCorps div[id*="_' +
						aNumEleve +
						"_" +
						lGenreColonne +
						"_abs_" +
						lNumeroColonne +
						'"]',
				)
					.parent()
					.addClass(
						"tableAbsenceCorpsCelluleInactive tableAbsenceCorpsCelluleAvecMenu",
					);
			}
		}
		if (this.cours && this.cours.estAppelVerrouille) {
			$(
				"#" +
					this.Nom.escapeJQ() +
					' table.tableAbsenceCorps div[id*="_' +
					aNumEleve +
					"_" +
					Enumere_Ressource_1.EGenreRessource.Absence +
					'_abs"]',
			)
				.parent()
				.addClass("tableAbsenceCorpsCelluleVerrouille");
			$(
				"#" +
					this.Nom.escapeJQ() +
					' table.tableAbsenceCorps div[id*="_' +
					aNumEleve +
					"_" +
					Enumere_Ressource_1.EGenreRessource.Retard +
					'_abs"]',
			)
				.parent()
				.addClass("tableAbsenceCorpsCelluleVerrouille");
		}
		if (this.avecSaisieDefautCarnet !== true) {
			$(
				"#" +
					this.Nom.escapeJQ() +
					' table.tableAbsenceCorps div[id*="_' +
					aNumEleve +
					"_" +
					Enumere_Ressource_1.EGenreRessource.Observation +
					'_abs"]',
			)
				.filter(
					'div[id$="_' +
						TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_DefautCarnet +
						'"]',
				)
				.parent()
				.addClass("tableAbsenceCorpsCelluleInactive");
		}
		if (lEleve.estExclu || lEleve.estSorti || lEleve.sortiePeda) {
			lJqCelsEleve
				.parent()
				.not(".tableAbsenceRecap")
				.addClass("tableAbsenceCorpsCelluleInactive");
		}
	}
	getNombreGenre(aNumEleve, aGenreAbs, aNumAbs) {
		function _getEtatDifferentDeCreation(aElement) {
			return aElement.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation;
		}
		function _getListeObsDifferentDeCreation(aElement) {
			return (
				aElement.existe() &&
				aElement.Genre ===
					Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve &&
				aElement.observation.Numero === aNumAbs &&
				aElement.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation
			);
		}
		function _getNombreDeListe(aParam) {
			let lNombre = MethodesObjet_1.MethodesObjet.isNan(aParam.absence.nombre)
				? 0
				: aParam.absence.nombre;
			if (
				lNombre > 0 &&
				aParam.absence.Genre === Enumere_Ressource_1.EGenreRessource.Dispense &&
				aParam.eleve.estEnseignementALaMaison
			) {
				lNombre--;
			}
			const lListe = aParam.liste.getListeElements(aParam.filtre);
			const lNbrListe = aParam.tousLesElements
				? lListe.count()
				: lListe.getNbrElementsExistes(aParam.genreRecherche);
			return lNombre + lNbrListe;
		}
		const lEleve = this.listeEleves.getElementParNumero(aNumEleve);
		let lNbAbs = 0;
		for (let i = 0; i < lEleve.listeColonnes.count(); i++) {
			const lAbsence = lEleve.listeColonnes.get(i);
			if (
				(aGenreAbs === Enumere_Ressource_1.EGenreRessource.Observation &&
					lAbsence.Numero === aNumAbs) ||
				(aGenreAbs !== Enumere_Ressource_1.EGenreRessource.Observation &&
					lAbsence.Genre === aGenreAbs)
			) {
				if (
					aGenreAbs !== Enumere_Ressource_1.EGenreRessource.Observation &&
					aGenreAbs !== Enumere_Ressource_1.EGenreRessource.Punition &&
					aGenreAbs !== Enumere_Ressource_1.EGenreRessource.Dispense
				) {
					lNbAbs = _getNombreDeListe({
						liste: lEleve.ListeAbsences,
						absence: lAbsence,
						eleve: lEleve,
						filtre: _getEtatDifferentDeCreation,
						genreRecherche: aGenreAbs,
					});
				} else if (aGenreAbs === Enumere_Ressource_1.EGenreRessource.Punition) {
					lNbAbs = _getNombreDeListe({
						liste: lEleve.listePunitions,
						absence: lAbsence,
						eleve: lEleve,
						filtre: _getEtatDifferentDeCreation,
					});
				} else if (
					aGenreAbs === Enumere_Ressource_1.EGenreRessource.Observation
				) {
					lNbAbs = _getNombreDeListe({
						liste: lEleve.ListeAbsences,
						absence: lAbsence,
						eleve: lEleve,
						filtre: _getListeObsDifferentDeCreation,
						tousLesElements: true,
					});
				} else if (aGenreAbs === Enumere_Ressource_1.EGenreRessource.Dispense) {
					lNbAbs = _getNombreDeListe({
						liste: lEleve.ListeDispenses,
						absence: lAbsence,
						eleve: lEleve,
						filtre: _getEtatDifferentDeCreation,
					});
				}
			}
		}
		return lNbAbs !== 0 ? lNbAbs : "";
	}
	getScrollTop(AGenre, AScrollTop) {
		if (AGenre === ObjetScroll_3.EGenreScrollEvenement.TailleContenu) {
			return null;
		}
		if (AGenre === ObjetScroll_3.EGenreScrollEvenement.TailleZone) {
			const lTailleZoneMax =
				$("#" + this.Nom.escapeJQ())
					.parent()
					.parent()
					.parent()
					.height() -
				41 -
				27 -
				($("#" + this.ScrollH.getNom().escapeJQ()).height() || 0) -
				(this.ajoutEleveAutorise ? 22 : 0);
			return lTailleZoneMax - (lTailleZoneMax % this.hauteurLigne) + 1;
		}
		if (AGenre === ObjetScroll_3.EGenreScrollEvenement.Deplacement) {
			return (
				this.hauteurLigne *
				Math.min(
					Math.round(AScrollTop / this.hauteurLigne),
					this.nbElevesVisibles,
				)
			);
		}
	}
	getScrollLeft(AGenre, AScrollLeft) {
		if (AGenre === ObjetScroll_3.EGenreScrollEvenement.TailleContenu) {
			return null;
		}
		if (AGenre === ObjetScroll_3.EGenreScrollEvenement.TailleZone) {
			const lTailleZoneMax =
				$("#" + this.Nom.escapeJQ()).width() -
				this.largeurColonneEleve -
				(this.avecColonneClasse ? this.largeurColonneClasse + 1 : 0) -
				19;
			let lTailleColonnesVisibles = 0,
				lAvecColonneNonVisible;
			for (let i = 0; i < this.listeColonnes.count(); i++) {
				const lColonne = this.listeColonnes.get(i);
				if (lColonne.Actif !== false) {
					if (
						lColonne.Genre ===
							Enumere_Ressource_1.EGenreRessource.Observation &&
						(lColonne.genreObservation ===
							TypeGenreObservationVS_1.TypeGenreObservationVS
								.OVS_ObservationParent ||
							lColonne.genreObservation ===
								TypeGenreObservationVS_1.TypeGenreObservationVS
									.OVS_Encouragement)
					) {
						if (
							lTailleZoneMax >=
							lTailleColonnesVisibles +
								this.largeurColonneObsParent +
								1 +
								this.largeurColonne +
								1
						) {
							lTailleColonnesVisibles +=
								this.largeurColonneObsParent + 1 + this.largeurColonne + 1;
						} else {
							lAvecColonneNonVisible = true;
							break;
						}
					} else if (
						lColonne.Genre ===
						Enumere_Ressource_1.EGenreRessource.RepasAPreparer
					) {
						if (
							lTailleZoneMax >=
							lTailleColonnesVisibles + (this.largeurColonne + 1)
						) {
							lTailleColonnesVisibles += this.largeurColonne + 1;
						} else {
							lAvecColonneNonVisible = true;
							break;
						}
					} else {
						if (
							lTailleZoneMax >=
							lTailleColonnesVisibles + 2 * (this.largeurColonne + 1)
						) {
							lTailleColonnesVisibles += 2 * (this.largeurColonne + 1);
						} else {
							lAvecColonneNonVisible = true;
							break;
						}
					}
				}
			}
			return lTailleColonnesVisibles + (lAvecColonneNonVisible ? 0 : 1);
		}
		if (AGenre === ObjetScroll_3.EGenreScrollEvenement.Deplacement) {
			return AScrollLeft - (AScrollLeft % (this.largeurColonne + 1));
		}
	}
	surPreResize() {
		if (this.enAffichage) {
			ObjetHtml_1.GHtml.setHtml(this.Nom, "&nbsp;");
		}
	}
	surPostResize() {
		if (this.enAffichage) {
			this.setDonneesAbsences();
		}
	}
	formatTradAbs(aAbs, aGenre) {
		return this.moteur.formatTradAbs(aAbs, aGenre);
	}
	_composeListeClasses() {
		let H = [];
		H.push(
			'<table class="Texte10 tableAbsenceEleve AlignementDroit" id="',
			this.ScrollV.getIdContenu(4),
			'">',
		);
		for (let i = 0; i < this.listeEleves.count() - 1; i++) {
			if (
				this.listeEleves.get(i).getEtat() !==
				Enumere_Etat_1.EGenreEtat.Suppression
			) {
				const lEleve = this.listeEleves.get(i);
				H.push(
					"<tr ",
					ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_2.EGenreRole.Row),
					">",
				);
				H.push(
					"<td ",
					ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_2.EGenreRole.Rowheader),
					' id="',
					this.Nom,
					"_classe_",
					lEleve.Numero,
					'_lib" tabindex="',
					i === 0 ? 0 : -1,
					'" ',
					' onkeyup="',
					this.Nom,
					".surKeyUp(id,",
					i,
					',-1,1);"',
					' style="border-left-width:0px;padding-left:3px;">',
					'<div style="',
					ObjetStyle_1.GStyle.composeWidth(this.largeurColonneClasse - 7),
					'">',
					'<div class="tableAbsenceEleveLibelle" ie-ellipsis>' +
						lEleve.strClasse +
						"</div>",
					"</div>",
					"</td>",
				);
				H.push("</tr>");
			}
		}
		H.push("</table>");
		return H.join("");
	}
}
exports.InterfacePageSaisieAbsences_Cours = InterfacePageSaisieAbsences_Cours;
function _construitCleTraduction(aGenreColonne, aAuPluriel) {
	let lCleTraduction;
	switch (aGenreColonne) {
		case Enumere_Ressource_1.EGenreRessource.Absence:
			if (aAuPluriel) {
				lCleTraduction = "Absence.CoursManquesCours";
			} else {
				lCleTraduction = "Absence.CoursManqueCours";
			}
			break;
		case Enumere_Ressource_1.EGenreRessource.Retard:
			if (aAuPluriel) {
				lCleTraduction = "Absence.RetardsCours";
			} else {
				lCleTraduction = "Absence.RetardCours";
			}
			break;
		case Enumere_Ressource_1.EGenreRessource.Exclusion:
			if (aAuPluriel) {
				lCleTraduction = "Absence.ExclusionsCours";
			} else {
				lCleTraduction = "Absence.ExclusionCours";
			}
			break;
		case Enumere_Ressource_1.EGenreRessource.Infirmerie:
			if (aAuPluriel) {
				lCleTraduction = "Absence.InfirmeriesCours";
			} else {
				lCleTraduction = "Absence.InfirmerieCours";
			}
			break;
		case Enumere_Ressource_1.EGenreRessource.Punition:
			if (aAuPluriel) {
				lCleTraduction = "Absence.PunitionsCours";
			} else {
				lCleTraduction = "Absence.PunitionCours";
			}
			break;
		case Enumere_Ressource_1.EGenreRessource.Observation:
			if (aAuPluriel) {
				lCleTraduction = "Absence.ObservationsCours";
			} else {
				lCleTraduction = "Absence.ObservationCours";
			}
			break;
		case Enumere_Ressource_1.EGenreRessource.Dispense:
			if (aAuPluriel) {
				lCleTraduction = "Absence.DispensesCours";
			} else {
				lCleTraduction = "Absence.DispenseCours";
			}
			break;
		default:
			break;
	}
	return lCleTraduction;
}
