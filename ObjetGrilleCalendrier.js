const { MethodesObjet } = require("MethodesObjet.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { GPosition } = require("ObjetPosition.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreBordure } = require("ObjetStyle.js");
const { EEvent } = require("Enumere_Event.js");
require("IEHtml.Scroll.js");
const { GDate } = require("ObjetDate.js");
const { Identite } = require("ObjetIdentite.js");
const { GTableau } = require("ObjetTableau.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GObjetWAI, EGenreRole } = require("ObjetWAI.js");
const { ToucheClavier } = require("ToucheClavier.js");
const EGenreGrilleCalendrier = { Jour: 0, Midi: 1, Soir: 2, MidiEtSoir: 3 };
class ObjetGrilleCalendrier extends Identite {
	constructor(...aParams) {
		super(...aParams);
		this.idBarSelecteur = this.Nom + "_BarSelecteur";
		this.idGrille = this.Nom + "_GrilleCalendrier";
		this.IdPremierElement = this.idBarSelecteur;
		this.nombreDeGenreAffichage = 2;
		this.genrePartiJour = { midi: 0, soir: 1 };
		this.cycles = IE.Cycles;
		this.genreGrille = EGenreGrilleCalendrier.Jour;
		this.ajouterEvenementGlobal(EEvent.SurPreResize, this.surPreResize);
		this.ajouterEvenementGlobal(EEvent.SurPostResize, this.surPostResize);
		this.elementCourant = null;
		this.modeAffichage = ObjetGrilleCalendrier.genreAffichage.fermer;
		this._initialiserOptions();
		this.avecEvenement = MethodesObjet.isFunction(this.callback.evenement);
		this.avecSelecteur = false;
		this.avecTitreSemaine = false;
		this.avecJourCourant = false;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getScroll: function (aApi) {
				aApi.surRefresh = function () {
					$(aApi.zone).css("margin-bottom", aApi.scrollsVisible.h ? "11px" : 0);
				};
			},
		});
	}
	_initialiserOptions() {
		this._options = {
			avecDeploiement: false,
			avecSelection: false,
			avecCouleurSelection: true,
		};
	}
	getModeAffichage() {
		return this.modeAffichage;
	}
	changeModeAffichage() {
		this.modeAffichage = (this.modeAffichage + 1) % this.nombreDeGenreAffichage;
	}
	setGenreGrille(aGenreGrille) {
		this.genreGrille = aGenreGrille;
		if (this.genreGrille === EGenreGrilleCalendrier.MidiEtSoir) {
			this.avecTitreSemaine = false;
		}
	}
	surPreResize() {
		if (!this.avecDonnees) {
			return;
		}
		GHtml.setHtml(this.Nom, "&nbsp;");
	}
	surPostResize() {
		if (!this.avecDonnees) {
			return;
		}
		this.afficher();
		this.composeDonnees();
	}
	setCycles(aInstanceCycles) {
		if (aInstanceCycles) {
			this.cycles = aInstanceCycles;
		}
	}
	setParametresGrilleCalendrier(aParams) {
		this.premiereDate = aParams.premiereDate;
		this.derniereDate = aParams.derniereDate;
		this.joursOuvres = aParams.joursOuvres;
		this.griseJoursAvant = !!aParams.griseJourAvant;
		this.IdPremierElement = this.idGrille;
		this.avecScrollSurCellules = false;
		this.donneesAvecFondBlanc = !!aParams.avecDonneesAvecFondBlanc;
	}
	setOptions(aOptions) {
		$.extend(this._options, aOptions);
	}
	setJoursOuvres(aJoursOuvres) {
		this.joursOuvres = aJoursOuvres;
	}
	setDonnees(
		aDateDebut,
		aDateFin,
		aListeDonnees,
		aAvecDeploiement,
		aControleur,
	) {
		let lID;
		this.dateDebut = aDateDebut;
		this.dateFin = aDateFin;
		this.nombreSemaines =
			this.cycles.cycleDeLaDate(this.dateFin) -
			this.cycles.cycleDeLaDate(this.dateDebut) +
			1;
		this.listeDonnees = aListeDonnees;
		this._options.avecDeploiement = aAvecDeploiement;
		Object.assign(this.controleur, aControleur);
		this.avecDonnees = true;
		this.afficher();
		$("#" + this.idGrille.escapeJQ())
			.find(".Tableau_Titre")
			.on("focusin", function () {
				$(this).css("text-decoration", "underline");
			})
			.on("focusout", function () {
				$(this).css("text-decoration", "none");
			})
			.attr("tabindex", "-1")
			.first()
			.attr("tabindex", "0");
		$("#" + this.idGrille.escapeJQ())
			.find(".Tableau_Titre")
			.on("keyup", { aObjet: this }, function (event) {
				let lJQArrayTitres, lIndex;
				if (event.which === ToucheClavier.FlecheDroite) {
					lJQArrayTitres = $(this)
						.parent()
						.parent()
						.find(".Tableau_Titre[tabindex]");
					lIndex = lJQArrayTitres.index(this);
					if (lIndex < lJQArrayTitres.length) {
						lJQArrayTitres.eq(lIndex + 1).focus();
					}
				} else if (event.which === ToucheClavier.FlecheGauche) {
					lJQArrayTitres = $(this)
						.parent()
						.parent()
						.find(".Tableau_Titre[tabindex]");
					lIndex = lJQArrayTitres.index(this);
					if (lIndex > 0) {
						lJQArrayTitres.eq(lIndex - 1).focus();
					}
				} else if (event.which === ToucheClavier.FlecheBas) {
					const lDate = event.data.aObjet.getDateID($(this).get(0).id);
					const lGenrePartiJour =
						event.data.aObjet.genreGrille === EGenreGrilleCalendrier.Soir
							? event.data.aObjet.genrePartiJour.soir
							: event.data.aObjet.genrePartiJour.midi;
					lID = event.data.aObjet.getIdCellule(
						lDate,
						event.data.aObjet.genreGrille !== EGenreGrilleCalendrier.Jour
							? lGenrePartiJour
							: null,
						false,
					);
					if (event.data.aObjet.nbrElementsParDate(lDate) > 0) {
						const lJQFirst = $("#" + lID.escapeJQ()).find(
							".ElementPourNavigation:first",
						);
						lJQFirst.focus();
						event.data.aObjet.evenementSurGrille(
							lJQFirst.get(0).id,
							null,
							true,
						);
					}
				}
				event.stopPropagation();
			});
		for (let I = 0; I < this.listeDonnees.count(); I++) {
			const lElement = this.listeDonnees.get(I);
			lID = this.getIdCellule(
				lElement.Date,
				this.genreGrille !== EGenreGrilleCalendrier.Jour
					? lElement.Genre
					: null,
				false,
			);
		}
		this.composeDonnees();
		$("#" + this.idGrille.escapeJQ())
			.find(".ElementPourNavigation")
			.on("keyup", { aObjet: this }, function (event) {
				let lDate, lGenrePartiJour, lID, lJQTitre, lJQArrayTitres, lIndex, lJQ;
				if (event.which === ToucheClavier.FlecheDroite) {
					lDate = event.data.aObjet.getDateID($(this).get(0).id);
					lGenrePartiJour =
						event.data.aObjet.genreGrille === EGenreGrilleCalendrier.Soir
							? event.data.aObjet.genrePartiJour.soir
							: event.data.aObjet.genrePartiJour.midi;
					lID =
						event.data.aObjet.getIdCellule(
							lDate,
							event.data.aObjet.genreGrille !== EGenreGrilleCalendrier.Jour
								? lGenrePartiJour
								: null,
							false,
						) + "_titre";
					lJQTitre = $("#" + lID.escapeJQ());
					lJQArrayTitres = lJQTitre
						.parent()
						.parent()
						.find(".Tableau_Titre[tabindex]");
					lIndex = lJQArrayTitres.index(lJQTitre);
					if (lIndex < lJQArrayTitres.length) {
						lJQArrayTitres.eq(lIndex + 1).focus();
						if (event.data.aObjet.elementCourant) {
							event.data.aObjet.activerElement(
								event.data.aObjet.elementCourant,
								false,
							);
						}
					}
				} else if (event.which === ToucheClavier.FlecheGauche) {
					lDate = event.data.aObjet.getDateID($(this).get(0).id);
					lGenrePartiJour =
						event.data.aObjet.genreGrille === EGenreGrilleCalendrier.Soir
							? event.data.aObjet.genrePartiJour.soir
							: event.data.aObjet.genrePartiJour.midi;
					lID =
						event.data.aObjet.getIdCellule(
							lDate,
							event.data.aObjet.genreGrille !== EGenreGrilleCalendrier.Jour
								? lGenrePartiJour
								: null,
							false,
						) + "_titre";
					lJQTitre = $("#" + lID.escapeJQ());
					lJQArrayTitres = lJQTitre
						.parent()
						.parent()
						.find(".Tableau_Titre[tabindex]");
					lIndex = lJQArrayTitres.index(lJQTitre);
					if (lIndex > 0) {
						lJQArrayTitres.eq(lIndex - 1).focus();
						if (event.data.aObjet.elementCourant) {
							event.data.aObjet.activerElement(
								event.data.aObjet.elementCourant,
								false,
							);
						}
					}
				} else if (
					event.which === ToucheClavier.FlecheBas &&
					$(this).nextAll(".ElementPourNavigation").length > 0
				) {
					lJQ = $(this).nextAll(".ElementPourNavigation:first");
					lJQ.focus();
					event.data.aObjet.evenementSurGrille(lJQ.get(0).id, null, true);
				} else if (
					event.which === ToucheClavier.FlecheHaut &&
					$(this).prevAll(".ElementPourNavigation").length > 0
				) {
					lJQ = $(this).prevAll(".ElementPourNavigation:first");
					lJQ.focus();
					event.data.aObjet.evenementSurGrille(lJQ.get(0).id, null, true);
				} else if (
					event.which === ToucheClavier.RetourChariot ||
					event.which === ToucheClavier.Espace
				) {
					lID = $(this).get(0).id;
					if (lID) {
						lDate = event.data.aObjet.getDateID(lID);
						lIndex = event.data.aObjet.getIndexID(lID);
						if (lIndex > -1) {
							event.data.aObjet.evenementSurGrille(lID, lIndex, false, true);
						}
					}
				}
				event.stopPropagation();
			});
	}
	construireAffichage() {
		return this.composePage();
	}
	composePage(aPourImpression) {
		const html = [];
		this.hauteurGrille = GPosition.getHeight(this.Nom) - 7;
		if (this.avecDonnees) {
			if (this.avecSelecteur) {
				html.push(
					'<div id="',
					this.idBarSelecteur,
					'" style="height:30px;">',
					this.composeBarSelecteur(),
					"</div>",
				);
				this.hauteurGrille -= 30;
			}
			html.push(
				'<div id="',
				this.idGrille,
				'" style="width:100%;height:',
				this.hauteurGrille,
				'px;overflow:auto; position:relative;">',
				this.composeGrille(aPourImpression),
				"</div>",
			);
		}
		return html.join("");
	}
	composeBarSelecteur() {
		const html = [];
		html.push(
			'<table class="Tableau Table"><tr>',
			"<td>|xx|<td>",
			"<td>|x|</td>",
			'<td style="width:100%">Titre</td>',
			"<td>|y|<td>",
			"<td>|yy|</td>",
			"</tr></table>",
		);
		return html.join("");
	}
	composeGrille(aPourImpression) {
		const html = [];
		let I;
		html.push(
			'<table class="Tableau Table" ',
			GObjetWAI.composeRole(EGenreRole.Grid),
			' style="' + GTableau.styleTableau(aPourImpression, true) + '">',
		);
		if (this.avecTitreSemaine) {
			html.push("<tr>");
			html.push(
				'<td class="Tableau_Titre Titre" ',
				GObjetWAI.composeRole(EGenreRole.Gridcell),
				' style="width:70px; height:20px; ',
				GTableau.styleTitre(aPourImpression),
				'">&nbsp;</td>',
			);
			for (let N = 0; N < this.cycles.nombreJoursOuvresParCycle(); N++) {
				html.push(
					'<td class="Tableau_Titre Titre" ',
					GObjetWAI.composeRole(EGenreRole.Gridcell),
					' style="',
					GTableau.styleTitre(aPourImpression),
					'">',
					I,
					"</td>",
				);
			}
			html.push("</tr>");
		}
		const lLargeurObjet =
			(this.avecTitreSemaine
				? GPosition.getWidth(this.Nom) - 78
				: GPosition.getWidth(this.Nom) - 8) -
			GNavigateur.getLargeurBarreDeScroll();
		let lLargeurColonne =
			Math.floor(lLargeurObjet / this.cycles.nombreJoursOuvresParCycle()) -
			0 +
			"px";
		let lLargeurColonneDiv = lLargeurColonne;
		if (aPourImpression) {
			lLargeurColonne =
				Math.floor(100 / this.cycles.nombreJoursOuvresParCycle()) + "%";
			lLargeurColonneDiv = "100%";
		}
		const lHauteurObjet = this.hauteurGrille - (this.avecTitreSemaine ? 22 : 2);
		const lHauteur =
			Math.floor(lHauteurObjet / this.nombreSemaines) -
			8 -
			(this.nombreSemaines === 1 ? 1 : 0) -
			(this.avecTitreSemaine ? 15 : 22);
		const lClassScroll =
			this.avecScrollSurCellules && !aPourImpression
				? "AvecScrollVerticalAuto"
				: "";
		const lStyleHauteur =
			this.avecScrollSurCellules && !aPourImpression
				? "height: " + lHauteur + "px;"
				: "";
		let lGenrePartiJour =
			this.genreGrille === EGenreGrilleCalendrier.Soir
				? this.genrePartiJour.soir
				: this.genrePartiJour.midi;
		const lCycleDebut = this.cycles.cycleDeLaDate(this.dateDebut);
		let lClass;
		for (
			let lCycle = lCycleDebut;
			lCycle < lCycleDebut + this.nombreSemaines;
			lCycle++
		) {
			const lID = this.getIdCellule(
				this.cycles.dateDebutCycle(lCycle),
				this.genreGrille !== EGenreGrilleCalendrier.Jour
					? lGenrePartiJour
					: null,
				aPourImpression,
			);
			html.push("<tr>");
			if (this.avecTitreSemaine) {
				html.push(
					'<td id="',
					lID,
					'_titre" class="Tableau_Titre Titre" ',
					GObjetWAI.composeRole(EGenreRole.Gridcell),
					' tabindex="-1" style="',
					GTableau.styleTitre(aPourImpression),
					'">',
					GDate.formatDate(this.cycles.dateDebutCycle(lCycle), "%J %MMM"),
					"<br>-<br>",
					GDate.formatDate(this.cycles.dateFinCycle(lCycle), "%J %MMM"),
					"</td>",
				);
			} else {
				for (let N = 0; N < this.cycles.nombreJoursOuvresParCycle(); N++) {
					let lDate = this.cycles.jourCycleEnDate(N, lCycle);
					let lStyleJour =
						GDate.estJourCourant(lDate) && this.avecJourCourant
							? GTableau.styleTitre(aPourImpression)
							: GTableau.styleCellule(
									aPourImpression,
									true,
									EGenreBordure.gauche +
										EGenreBordure.haut +
										EGenreBordure.droite,
								);
					lStyleJour =
						GDate.estAvantJourCourant(lDate) && this.griseJoursAvant
							? GStyle.composeCouleur(
									aPourImpression ? GCouleur.blanc : GCouleur.nonEditable.fond,
									GCouleur.liste.nonEditable.texte,
									GCouleur.liste.editable.getBordure(aPourImpression),
								)
							: lStyleJour;
					lClass = GDate.estJourCourant(lDate) ? " Gras" : "";
					let lID = this.getIdCellule(
						lDate,
						this.genreGrille !== EGenreGrilleCalendrier.Jour
							? lGenrePartiJour
							: null,
						aPourImpression,
					);
					const lNrJour = GDate.formatDate(lDate, "%J ");
					const lJour = GDate.formatDate(lDate, "%JJJJ");
					let lTitre =
						'<div class="Espace' +
						lClass +
						'">' +
						'<span class="Texte16">' +
						lNrJour +
						"</span>" +
						'<span class="Texte12">' +
						lJour.ucfirst() +
						"</span>" +
						"</div>";
					if (this.genreGrille !== EGenreGrilleCalendrier.Jour) {
						if (lGenrePartiJour === 0) {
							lTitre +=
								'<div class="EspaceBas">' +
								GTraductions.getValeur("GrilleCalendrier.midi") +
								"</div>";
						} else {
							if (this.genreGrille === EGenreGrilleCalendrier.Soir) {
								lTitre +=
									'<div class="EspaceBas">' +
									GTraductions.getValeur("GrilleCalendrier.soir") +
									"</div>";
							} else {
								lTitre =
									'<div class="Espace">' +
									GTraductions.getValeur("GrilleCalendrier.soir") +
									"</div>";
							}
						}
					}
					html.push(
						'<td id="',
						lID,
						'_titre" ',
						GObjetWAI.composeRole(EGenreRole.Gridcell),
						' tabindex="-1" style="padding: 0px 3px; height:21px;',
						lStyleJour,
						'">',
						lTitre,
						"</td>",
					);
				}
				html.push("</tr><tr>");
			}
			for (let N = 0; N < this.cycles.nombreJoursOuvresParCycle(); N++) {
				let lDate = this.cycles.jourCycleEnDate(N, lCycle);
				const lStrDate = this.avecTitreSemaine
					? GDate.formatDate(lDate, "%J")
					: GDate.formatDate(lDate, "%JJJJ %JJ %MMMM");
				let lStyleJour =
					GDate.estJourCourant(lDate) && this.avecJourCourant
						? GTableau.styleTitre(aPourImpression)
						: GTableau.styleCellule(
								aPourImpression,
								true,
								EGenreBordure.gauche + EGenreBordure.bas + EGenreBordure.droite,
							);
				lStyleJour =
					GDate.estAvantJourCourant(lDate) && this.griseJoursAvant
						? GStyle.composeCouleur(
								aPourImpression ? GCouleur.blanc : GCouleur.nonEditable.fond,
								GCouleur.liste.nonEditable.texte,
								GCouleur.liste.editable.getBordure(aPourImpression),
							)
						: lStyleJour;
				lClass =
					GDate.estJourCourant(lDate) && this.avecJourCourant ? " Gras" : "";
				if (this.avecTitreSemaine) {
					html.push(
						'<td class="AlignementDroit AlignementHaut" style="width:',
						lLargeurColonne,
						";",
						lStyleJour,
						'">',
						'<div class="PetitEspaceBas ',
						lClass,
						'" style="width:',
						lLargeurColonneDiv,
						'; height:12px;">',
						lStrDate,
						"</div>",
						'<div id="',
						this.getIdCellule(
							lDate,
							this.genreGrille !== EGenreGrilleCalendrier.Jour
								? lGenrePartiJour
								: null,
							aPourImpression,
						),
						'" class="',
						lClassScroll,
						'" style="width:',
						lLargeurColonneDiv,
						"; min-height: 100px; ",
						lStyleHauteur,
						'">',
						"</div>",
						"</td>",
					);
				} else {
					html.push(
						'<td class="AlignementDroit AlignementHaut" style="width:',
						lLargeurColonne,
						";",
						lStyleJour,
						'">',
						'<div id="',
						this.getIdCellule(
							lDate,
							this.genreGrille !== EGenreGrilleCalendrier.Jour
								? lGenrePartiJour
								: null,
							aPourImpression,
						),
						'" class="',
						lClassScroll,
						'" style="width:',
						lLargeurColonneDiv,
						"; min-height: 100px; ",
						lStyleHauteur,
						'">',
						"</div>",
						"</td>",
					);
				}
			}
			html.push("</tr>");
			if (this.genreGrille === EGenreGrilleCalendrier.MidiEtSoir) {
				if (lGenrePartiJour === this.genrePartiJour.midi) {
					lGenrePartiJour = this.genrePartiJour.soir;
					lCycle = lCycle - 1;
				} else {
					if (lCycle < lCycleDebut + this.nombreSemaines) {
						lGenrePartiJour = this.genrePartiJour.midi;
					}
				}
			}
		}
		html.push("</table>");
		return html.join("");
	}
	composeDonnees(aPourImpression) {
		let lHtml = "";
		let lID = "";
		let lLargeur = 0;
		let lLargeurDiv = 0;
		let lMaxElements = 0;
		let lNbrElements = 0;
		let lMarge = "";
		let lContent = "";
		const lStyle = "";
		for (let I = 0; I < this.listeDonnees.count(); I++) {
			const lElement = this.listeDonnees.get(I);
			lID = this.getIdCellule(
				lElement.Date,
				this.genreGrille !== EGenreGrilleCalendrier.Jour
					? lElement.Genre
					: null,
				aPourImpression,
			);
			lNbrElements = this.nbrElementsParDate(lElement.Date);
			const lMonID = lID + "/Matiere" + I;
			lHtml = GHtml.getHtml(lID);
			lMaxElements = Math.floor(GPosition.getHeight(lID) / 23);
			lLargeur =
				GPosition.getWidth(lID) -
				10 -
				16 -
				6 -
				2 -
				(lNbrElements > lMaxElements ? 19 : 0);
			const lLibelle = GChaine.getLongueurChaine(
				lElement.Libelle,
				10,
				true,
				lLargeur,
			);
			const lTitle =
				lElement.Libelle === lLibelle ? "" : 'title="' + lElement.Libelle + '"';
			lMarge = GStyle.composeMarge(
				lHtml === "" ? 3 : 2,
				1,
				lElement.estUneSuite ? 0 : 3,
				lElement.aUneSuite ? 0 : 3,
			);
			lLargeurDiv =
				GPosition.getWidth(lID) -
				(lElement.estUneSuite ? 0 : 3) -
				(lElement.aUneSuite ? 0 : 3);
			lContent = lElement.html[this.modeAffichage];
			const lEvenement = aPourImpression
				? ""
				: 'onclick="' +
					this.Nom +
					".evenementSurGrille(id," +
					I +
					');" role="button" aria-haspopup="dialog" tabindex="0" ';
			let lHtml2 =
				'<div ie-scrollh="getScroll" id="' +
				lMonID +
				'" ' +
				lEvenement +
				'class="ElementPourNavigation AlignementGauche' +
				(this.avecEvenement ? " AvecMain" : "") +
				(this.donneesAvecFondBlanc ? " FondBlanc" : "") +
				'" style="' +
				GStyle.composeWidth(lLargeurDiv) +
				lMarge +
				lStyle +
				'" ' +
				lTitle +
				">";
			lHtml2 += "<div>" + lContent + "</div>";
			lHtml2 += "</div>";
			GHtml.addHtml(lID, lHtml2, { controleur: this.controleur });
			if (lElement.gestionnaireBloc) {
				lElement.gestionnaireBloc.refresh();
			}
		}
	}
	selectionneElement(aDate, aMatiere) {
		let lID = "";
		for (let I = 0; I < this.listeDonnees.count(); I++) {
			const lElement = this.listeDonnees.get(I);
			if (
				GDate.estJourEgal(lElement.Date, aDate) &&
				lElement.getNumero() === aMatiere.getNumero()
			) {
				lID = this.getIdCellule(
					lElement.Date,
					this.genreGrille !== EGenreGrilleCalendrier.Jour
						? lElement.Genre
						: null,
					false,
				);
				const lMonID = lID + "/Matiere" + I;
				this.evenementSurGrille(lMonID, I);
			}
		}
	}
	nbrElementsParDate(aDate) {
		let lCount = 0;
		for (let I = 0; I < this.listeDonnees.count(); I++) {
			if (GDate.estJourEgal(aDate, this.listeDonnees.get(I).Date)) {
				lCount++;
			}
		}
		return lCount;
	}
	getIdCellule(aDate, aGenre, aPourImpression) {
		return (
			this.Nom +
			"_sD" +
			GDate.formatDate(aDate, "%JJ/%MM/%AA") +
			"eD_" +
			(aGenre === null || aGenre === undefined ? "" : aGenre) +
			(aPourImpression ? "_imp" : "")
		);
	}
	evenementSurGrille(aID, aNumero, aSansEvenement, aEvenementClavier) {
		if (
			this._options.avecSelection &&
			this.modeAffichage === ObjetGrilleCalendrier.genreAffichage.fermer
		) {
			if (this.elementCourant) {
				this.activerElement(this.elementCourant, false);
			}
			this.activerElement(aID, true);
			this.elementCourant = aID;
		}
		if (!aSansEvenement) {
			const lElement = this.listeDonnees.get(aNumero);
			this.callback.appel(aID, lElement, aEvenementClavier);
		}
	}
	activerElement(aID, aActive) {
		if (aID) {
			const lDate = this.getDateID(aID);
			const lCouleur =
				!aActive || !this.avecCouleurSelection
					? GDate.estAvantJourCourant(lDate) && this.griseJoursAvant
						? GCouleur.liste.editable
						: GCouleur.liste.editable
					: GCouleur.selection;
			GStyle.setCouleur(aID, lCouleur.fond, lCouleur.texte);
		}
	}
	resetElement() {
		this.activerElement(this.elementCourant, false);
		this.elementCourant = null;
	}
	getDateID(aID) {
		const patt1 = /(?:_sD)([\d/]{8,10})(?=eD_)/i;
		return GDate.getDateDeChaine(aID.match(patt1)[1]);
	}
	getIndexID(aID) {
		let lResult = -1;
		const patt1 = /Matiere([0-9]+)/i;
		let lMatch;
		if (patt1) {
			lMatch = aID.match(patt1);
			if (lMatch && lMatch[1]) {
				lResult = parseInt(lMatch[1]);
			}
		}
		return lResult;
	}
}
ObjetGrilleCalendrier.genreAffichage = { fermer: 0, deployer: 1 };
module.exports = { ObjetGrilleCalendrier, EGenreGrilleCalendrier };
