exports.ObjetCalendrierAnnuel = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDate_1 = require("ObjetDate");
const ObjetHint_1 = require("ObjetHint");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTri_1 = require("ObjetTri");
const AccessApp_1 = require("AccessApp");
var GenreEditionPeriode;
(function (GenreEditionPeriode) {
	GenreEditionPeriode[(GenreEditionPeriode["Ajout"] = 0)] = "Ajout";
	GenreEditionPeriode[(GenreEditionPeriode["Suppression"] = 1)] = "Suppression";
})(GenreEditionPeriode || (GenreEditionPeriode = {}));
class ObjetCalendrierAnnuel extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.options = {
			premiereDate: GParametres.PremiereDate,
			derniereDate: GParametres.DerniereDate,
			avecJourCourant: true,
			avecFrequences: false,
			ligneDate: true,
			numeroJour: false,
			initialeJour: false,
			hauteurLigne: false,
			minHauteur: false,
			nbrContainers: 0,
			cadreTotal: false,
			joursOuvres: {
				fond: { couleur: (0, AccessApp_1.getApp)().getCouleur().cumul },
				texte: {
					couleur: (0, AccessApp_1.getApp)().getCouleur().blanc,
					alignement: "center",
					poid: "bold",
				},
				domaine: GParametres.JoursOuvres,
				symbolImpression: "-",
				editable: false,
				editablePeriode: false,
			},
			joursFeries: {
				fond: { couleur: (0, AccessApp_1.getApp)().getCouleur().cumul },
				texte: {
					couleur: (0, AccessApp_1.getApp)().getCouleur().blanc,
					alignement: "center",
					poid: "bold",
				},
				domaine: GParametres.JoursFeries,
				symbolImpression: "-",
				editable: false,
				editablePeriode: false,
			},
			getCouleurDeDate: function () {
				return "white";
			},
			style: null,
		};
		this.idTable = this.Nom + "_calannuel";
		this.idNumDay = this.Nom + "_numday_";
		this.idDays = this.Nom + "_day_";
		this.idMonths = this.Nom + "_month_";
		this.idJourCourantHov = this.Nom + "_currentdayhov";
		this.idMonthHov = this.Nom + "_monthhov";
		this.idDayHov = this.Nom + "_dayhov";
		this.classJourFerie = "ObjetCalendrierAnnuel_jourferie";
		this.classJourNonOuvre = "ObjetCalendrierAnnuel_journonouvre";
		this.classNomJour = "ObjetCalendrierAnnuel_nomjour";
		this.classNumeroJour = "ObjetCalendrierAnnuel_numerojour";
		this.donnees = {};
		this.listeDonneesEditable = [];
		this.listeDonneesEditablePeriode = [];
		this.donneesEditionPeriode = null;
		this.setParametres();
	}
	afficher() {
		super.afficher();
		if (!$.isEmptyObject(this.donnees)) {
			this.afficherDonnees();
		}
		this.ajouterEvenement();
	}
	setParametres(aOptions) {
		const lStyle = {
			defaut: {
				bordure: {
					couleur: (0, AccessApp_1.getApp)().getCouleur().bordure,
					taille: "1px",
					style: "solid",
				},
				fond: { couleur: (0, AccessApp_1.getApp)().getCouleur().blanc },
				texte: {
					couleur: (0, AccessApp_1.getApp)().getCouleur().noir,
					alignement: "center",
					poid: "bold",
				},
			},
			surbrillance: {
				bordure: {
					couleur: (0, AccessApp_1.getApp)().getCouleur().themeCouleur.sombre,
					taille: "2px",
					style: "solid",
				},
			},
			jourCourant: {
				bordure: {
					couleur: (0, AccessApp_1.getApp)().getCouleur().themeCouleur.sombre,
					taille: "2px",
					style: "solid",
				},
			},
			titre: {
				bordure: {
					couleur: (0, AccessApp_1.getApp)().getCouleur().titre.bordure,
					taille: "1px",
					style: "solid",
				},
				fond: { couleur: (0, AccessApp_1.getApp)().getCouleur().titre.fond },
				texte: {
					couleur: (0, AccessApp_1.getApp)().getCouleur().titre.texte,
					alignement: "center",
					poid: "bold",
				},
			},
			nomJour: {
				fond: {
					couleur: (0, AccessApp_1.getApp)().getCouleur().themeNeutre.legere,
				},
				texte: {
					couleur: (0, AccessApp_1.getApp)().getCouleur().themeNeutre.sombre,
					alignement: "center",
					poid: "normal",
				},
				hauteur: 0.35,
			},
			editionPeriode: {
				ajout: { fond: { couleur: "green" }, texte: { couleur: "black" } },
				suppression: { fond: { couleur: "red" }, texte: { couleur: "white" } },
			},
		};
		const lOptionsTemp = {
			style: lStyle,
			joursOuvres: {
				fond: {
					couleur: (0, AccessApp_1.getApp)().getCouleur().themeNeutre.claire,
				},
				texte: {
					couleur: (0, AccessApp_1.getApp)().getCouleur().themeNeutre.sombre,
				},
			},
			joursFeries: {
				fond: {
					couleur: (0, AccessApp_1.getApp)().getCouleur().themeNeutre.sombre,
				},
				texte: { couleur: (0, AccessApp_1.getApp)().getCouleur().blanc },
			},
		};
		$.extend(true, this.options, lOptionsTemp, aOptions);
		this.param = {
			styleCelluleDefaut:
				"border: " +
				this.options.style.defaut.bordure.couleur +
				" " +
				this.options.style.defaut.bordure.taille +
				" " +
				this.options.style.defaut.bordure.style +
				";background:" +
				this.options.style.defaut.fond.couleur +
				";color:" +
				this.options.style.defaut.texte.couleur +
				";text-align:" +
				this.options.style.defaut.texte.alignement +
				";font-weight:" +
				this.options.style.defaut.texte.poid +
				";padding:0;",
			styleCelluleNonOuvre:
				"border: " +
				this.options.style.defaut.bordure.couleur +
				" " +
				this.options.style.defaut.bordure.taille +
				" " +
				this.options.style.defaut.bordure.style +
				";background:" +
				this.options.joursOuvres.fond.couleur +
				";color:" +
				this.options.joursOuvres.texte.couleur +
				";text-align:" +
				this.options.joursOuvres.texte.alignement +
				";font-weight:" +
				this.options.joursOuvres.texte.poid +
				";padding:0;",
			styleCelluleFerie:
				"border: " +
				this.options.style.defaut.bordure.couleur +
				" " +
				this.options.style.defaut.bordure.taille +
				" " +
				this.options.style.defaut.bordure.style +
				";background:" +
				this.options.joursFeries.fond.couleur +
				";color:" +
				this.options.joursFeries.texte.couleur +
				";text-align:" +
				this.options.joursFeries.texte.alignement +
				";font-weight:" +
				this.options.joursFeries.texte.poid +
				";padding:0;",
			styleCelluleSurbrillance:
				":" +
				this.options.style.surbrillance.bordure.couleur +
				" " +
				this.options.style.surbrillance.bordure.taille +
				" " +
				this.options.style.surbrillance.bordure.style +
				";",
			styleCelluleJourCourant:
				":" +
				this.options.style.jourCourant.bordure.couleur +
				" " +
				this.options.style.jourCourant.bordure.taille +
				" " +
				this.options.style.jourCourant.bordure.style +
				";",
			styleCelluleTitre:
				"border: " +
				this.options.style.titre.bordure.couleur +
				" " +
				this.options.style.titre.bordure.taille +
				" " +
				this.options.style.titre.bordure.style +
				";background:" +
				this.options.style.titre.fond.couleur +
				";color:" +
				this.options.style.titre.texte.couleur +
				";text-align:" +
				this.options.style.titre.texte.alignement +
				";font-weight:" +
				this.options.style.titre.texte.poid +
				";padding:0;",
			styleNomJour:
				(this.options.style.nomJour.fond.couleur
					? "background:" + this.options.style.nomJour.fond.couleur + ";"
					: "") +
				(this.options.style.nomJour.texte.couleur
					? "color:" + this.options.style.nomJour.texte.couleur + ";"
					: "") +
				(this.options.style.nomJour.texte.vAlignement
					? "vertical-align:" +
						this.options.style.nomJour.texte.vAlignement +
						";"
					: "") +
				"text-align:" +
				this.options.style.nomJour.texte.alignement +
				";font-weight:" +
				this.options.style.nomJour.texte.poid +
				";" +
				(this.options.nbrContainers === 0
					? "height:" + this.options.style.nomJour.hauteur * 100 + "%;"
					: "height:12px;") +
				(!!this.options.style.nomJour.noFontSize
					? ""
					: "font-size:" + this.options.style.nomJour.hauteur * 200 + "%;"),
			largeurColonne: Math.floor(100 / (31 + 3)),
		};
		this.afficher();
	}
	setDonnees(aDonnees) {
		let lDate, lElement;
		if ($.isEmptyObject(this.options)) {
			this.setParametres();
		}
		if (this.options.avecFrequences) {
			this.donnees.frequences = {
				donnees: new ObjetListeElements_1.ObjetListeElements(),
				variables: ["date"],
				couleur: this.options.joursOuvres.fond.couleur,
				texte: { couleur: this.options.joursOuvres.texte.couleur },
				symbolImpression: this.options.joursOuvres.symbolImpression,
				editable: false,
				editablePeriode: false,
				nonEditable: true,
			};
			for (
				lDate = new Date(this.options.premiereDate.getTime());
				lDate <= this.options.derniereDate;
				lDate.setDate(lDate.getDate() + 1)
			) {
				lElement = new ObjetElement_1.ObjetElement();
				lElement.date = new Date(lDate.getTime());
				lElement.couleur = this.options.getCouleurDeDate(lDate);
				this.donnees.frequences.donnees.addElement(lElement);
			}
		}
		if (!this.options.joursOuvres.editable) {
			this.donnees.joursOuvres = {
				donnees: new ObjetListeElements_1.ObjetListeElements(),
				variables: ["date"],
				couleur: this.options.joursOuvres.fond.couleur,
				texte: { couleur: this.options.joursOuvres.texte.couleur },
				symbolImpression: this.options.joursOuvres.symbolImpression,
				editable: false,
				editablePeriode: false,
				nonEditable: true,
			};
			for (
				lDate = new Date(this.options.premiereDate.getTime());
				lDate <= this.options.derniereDate;
				lDate.setDate(lDate.getDate() + 1)
			) {
				if (
					this.options.joursOuvres.domaine.getValeur(
						ObjetDate_1.GDate.getJourDeDate(lDate) + 1,
					)
				) {
					continue;
				}
				lElement = new ObjetElement_1.ObjetElement();
				lElement.date = new Date(lDate.getTime());
				this.donnees.joursOuvres.donnees.addElement(lElement);
			}
		}
		if (!this.options.joursFeries.editable) {
			this.donnees.joursFeries = {
				donnees: new ObjetListeElements_1.ObjetListeElements(),
				variables: ["date"],
				couleur: this.options.joursFeries.fond.couleur,
				texte: { couleur: this.options.joursFeries.texte.couleur },
				symbolImpression: this.options.joursFeries.symbolImpression,
				editable: false,
				editablePeriode: false,
				nonEditable: true,
			};
			for (
				lDate = new Date(this.options.premiereDate.getTime());
				lDate <= this.options.derniereDate;
				lDate.setDate(lDate.getDate() + 1)
			) {
				if (
					!this.options.joursFeries.domaine.getValeur(
						ObjetDate_1.GDate.getNbrJoursDepuisPremiereLundi(lDate) + 1,
					)
				) {
					continue;
				}
				lElement = new ObjetElement_1.ObjetElement();
				lElement.date = new Date(lDate.getTime());
				this.donnees.joursFeries.donnees.addElement(lElement);
			}
		}
		if (aDonnees) {
			$.extend(true, this.donnees, aDonnees);
			this.afficherDonnees();
			this.ajouterEvenement();
		}
	}
	construireAffichage() {
		const H = [];
		H.push('<div style="position:relative;width:100%;height:100%;">');
		if (this.options.avecJourCourant) {
			H.push(
				'<div id="' +
					this.idJourCourantHov +
					'" style="position:absolute;width:0;height:0;">',
			);
			H.push(
				'<div id="' +
					this.idJourCourantHov +
					'_top" style="position:absolute;border-top' +
					this.param.styleCelluleJourCourant +
					'"></div>',
			);
			H.push(
				'<div id="' +
					this.idJourCourantHov +
					'_left" style="position:absolute;border-left' +
					this.param.styleCelluleJourCourant +
					'"></div>',
			);
			H.push(
				'<div id="' +
					this.idJourCourantHov +
					'_bottom" style="position:absolute;border-top' +
					this.param.styleCelluleJourCourant +
					'"></div>',
			);
			H.push(
				'<div id="' +
					this.idJourCourantHov +
					'_right" style="position:absolute;border-left' +
					this.param.styleCelluleJourCourant +
					'"></div>',
			);
			H.push("</div>");
		}
		H.push(
			'<div id="' +
				this.idMonthHov +
				'" style="position:absolute;display:none;border' +
				this.param.styleCelluleSurbrillance +
				'"></div>',
		);
		H.push(
			'<div id="' +
				this.idDayHov +
				'" style="position:absolute;display:none;border' +
				this.param.styleCelluleSurbrillance +
				'"></div>',
		);
		H.push(
			'<table id="' +
				this.idTable +
				'" class="Tableau full-width" style="' +
				(this.options.minHauteur
					? "min-height:" + this.options.minHauteur + "px;"
					: "") +
				(this.options.hauteurLigne ? "" : "height:100%;") +
				(this.options.cadreTotal
					? "border: " +
						this.options.style.defaut.bordure.couleur +
						" " +
						this.options.style.defaut.bordure.taille +
						" " +
						this.options.style.defaut.bordure.style +
						";"
					: "") +
				'">',
		);
		if (this.options.ligneDate) {
			H.push("<tr>");
			H.push('<td style="width:' + 3 * this.param.largeurColonne + '%;"></td>');
			for (let i = 1; i <= 31; i++) {
				H.push(
					'<td id="' +
						this.idNumDay +
						i +
						'_num" class="Titre" style="' +
						this.param.styleCelluleTitre +
						"width:" +
						this.param.largeurColonne +
						"%;" +
						(this.options.hauteurLigne
							? "height:" + this.options.hauteurLigne + ";"
							: "") +
						'">' +
						i +
						"</td>",
				);
			}
			H.push("</tr>");
		}
		let lMoisActuel = this.options.premiereDate.getMonth();
		let lAnneeActuel = this.options.premiereDate.getFullYear();
		while (
			new Date(lAnneeActuel, lMoisActuel, 1) <= this.options.derniereDate
		) {
			H.push("<tr>");
			H.push(
				'<td id="' +
					this.idMonths +
					lMoisActuel +
					"_" +
					lAnneeActuel +
					'_lib" style="' +
					this.param.styleCelluleTitre +
					"width:" +
					3 * this.param.largeurColonne +
					"%;" +
					(this.options.hauteurLigne
						? "height:" + this.options.hauteurLigne + ";"
						: "") +
					'">' +
					ObjetDate_1.GDate.strMoisCourt(lAnneeActuel, lMoisActuel, true) +
					"</td>",
			);
			for (let i = 1; i <= 31; i++) {
				const lDate = new Date(lAnneeActuel, lMoisActuel, i);
				const lExisteDansPeriode =
					lDate <=
						ObjetDate_1.GDate.getDernierJourDuMois(lAnneeActuel, lMoisActuel) &&
					lDate <= this.options.derniereDate &&
					lDate >= this.options.premiereDate;
				const lEstNonOuvre = !this.options.joursOuvres.domaine.getValeur(
					ObjetDate_1.GDate.getJourDeDate(lDate) + 1,
				);
				const lEstFerie = this.options.joursFeries.domaine.getValeur(
					ObjetDate_1.GDate.getNbrJoursDepuisPremiereLundi(lDate) + 1,
				);
				if (lExisteDansPeriode) {
					H.push(
						'<td class="' +
							(lEstFerie
								? this.classJourFerie + " "
								: lEstNonOuvre
									? this.classJourNonOuvre + " "
									: "") +
							'AlignementHaut" id="' +
							this.idDays +
							i +
							"_" +
							lMoisActuel +
							"_" +
							lAnneeActuel +
							'_cel" style="' +
							(!lEstNonOuvre
								? this.param.styleCelluleDefaut
								: this.param.styleCelluleNonOuvre) +
							"width:" +
							this.param.largeurColonne +
							"%;" +
							(this.options.hauteurLigne
								? "height:" + this.options.hauteurLigne + ";"
								: "") +
							'">',
					);
					if (
						this.options.initialeJour ||
						this.options.numeroJour ||
						this.options.nbrContainers > 0
					) {
						H.push(
							'<table  style="margin:0;padding:0;" class="Table AlignementMilieu AlignementCentre">',
						);
						if (this.options.initialeJour) {
							H.push(
								'<tr><td class="' +
									this.classNomJour +
									'" style="' +
									this.param.styleNomJour +
									'">' +
									ObjetDate_1.GDate.formatDate(lDate, "%JJJ")
										.substring(0, 1)
										.toUpperCase() +
									"</td></tr>",
							);
						}
						if (this.options.numeroJour) {
							H.push(
								'<tr><td class="' +
									this.classNumeroJour +
									'">' +
									i +
									"</td></tr>",
							);
						}
						if (this.options.nbrContainers > 0) {
							for (
								let iCont = 1;
								iCont <= this.options.nbrContainers;
								iCont++
							) {
								H.push(
									'<tr><td id="' +
										this.idDays +
										i +
										"_" +
										lMoisActuel +
										"_" +
										lAnneeActuel +
										"_cont_" +
										iCont +
										'"><div id="' +
										this.idDays +
										i +
										"_" +
										lMoisActuel +
										"_" +
										lAnneeActuel +
										"_contDiv_" +
										iCont +
										'" style="width:100%;"></div></td></tr>',
								);
							}
						}
						H.push("</table>");
					}
					H.push("</td>");
				} else {
					H.push(
						'<td style="',
						"width:" + this.param.largeurColonne + "%;",
						'"></td>',
					);
				}
			}
			H.push("</tr>");
			const lDateTemp = new Date(lAnneeActuel, lMoisActuel + 1);
			lMoisActuel = lDateTemp.getMonth();
			lAnneeActuel = lDateTemp.getFullYear();
		}
		H.push("</table>");
		H.push("</div>");
		return H.join("");
	}
	ajouterEvenement() {
		$("#" + this.idTable.escapeJQ())
			.off("mouseenter mouseleave")
			.on(
				"mouseenter mouseleave",
				'td[id$="_cel"]',
				{ aObjet: this },
				this.celluleActive,
			);
		if (this.options.avecJourCourant) {
			const lDateCourante = ObjetDate_1.GDate.getDateCourante();
			const lJqCellJourCourant = $(
				"#" +
					this.idDays.escapeJQ() +
					lDateCourante.getDate() +
					"_" +
					lDateCourante.getMonth() +
					"_" +
					lDateCourante.getFullYear() +
					"_cel",
			);
			if (lJqCellJourCourant.length === 1) {
				$("#" + this.idJourCourantHov.escapeJQ()).css({
					top: lJqCellJourCourant.position().top,
					left: lJqCellJourCourant.position().left,
				});
				$("#" + this.idJourCourantHov.escapeJQ() + "_top").css({
					width: lJqCellJourCourant.width() + 1,
					height: 0,
					top: -1,
					left: -1,
				});
				$("#" + this.idJourCourantHov.escapeJQ() + "_left").css({
					width: 0,
					height: lJqCellJourCourant.height() + 1,
					top: 0,
					left: -1,
				});
				$("#" + this.idJourCourantHov.escapeJQ() + "_bottom").css({
					width: lJqCellJourCourant.width() + 2,
					height: 0,
					top: lJqCellJourCourant.height(),
					left: 0,
				});
				$("#" + this.idJourCourantHov.escapeJQ() + "_right").css({
					width: 0,
					height: lJqCellJourCourant.height() + 1,
					top: -1,
					left: lJqCellJourCourant.width(),
				});
			}
		}
	}
	formaterPourImpression(aNoeudDom) {
		$(aNoeudDom)
			.find("." + this.classJourNonOuvre)
			.text(this.options.joursOuvres.symbolImpression);
		$(aNoeudDom)
			.find("." + this.classJourFerie)
			.text(this.options.joursFeries.symbolImpression);
		$(aNoeudDom)
			.find("#" + this.idJourCourantHov.escapeJQ())
			.remove();
		let prop;
		for (prop in this.donnees) {
			if (!MethodesObjet_1.MethodesObjet.isFunction(this.donnees[prop])) {
				const lDonneesProp = this.donnees[prop];
				const lDonnees = MethodesObjet_1.MethodesObjet.isFunction(
					lDonneesProp.filtre,
				)
					? lDonneesProp.donnees.getListeElements(lDonneesProp.filtre)
					: lDonneesProp.donnees;
				for (let i = 0; i < lDonnees.count(); i++) {
					const lElement = lDonnees.get(i);
					if (!lElement.existe()) {
						continue;
					}
					const lStart = lElement[lDonneesProp.variables[0]];
					const lStop = lDonneesProp.variables[1]
						? lElement[lDonneesProp.variables[1]]
						: lStart;
					for (
						let j = lStart;
						j <= lStop;
						j = new Date(j.getFullYear(), j.getMonth(), j.getDate() + 1)
					) {
						const lJqCel = $(aNoeudDom).find(
							"#" +
								this.idDays.escapeJQ() +
								j.getDate() +
								"_" +
								j.getMonth() +
								"_" +
								j.getFullYear() +
								"_cel",
						);
						lJqCel.text(lDonneesProp.symbolImpression || "");
					}
				}
			}
		}
	}
	afficherDonnees() {
		function _onclick(event, aFromMouseUp) {
			if (this.id.endsWith("_lib")) {
				return;
			}
			const lThis = event.data.aThis;
			if (
				$(this).data("nonedit") !== true &&
				(!event.data.aPeriodeUnique || !!aFromMouseUp)
			) {
				if ($(this).data("etatedit") === event.data.aValeur) {
					const lEventCouleur =
						event.data.aSuivant === -1 && $(this).data("couleurOrigine")
							? $(this).data("couleurOrigine")
							: event.data.aCouleur;
					const lEventCouleurTexte =
						event.data.aSuivant === -1 && $(this).data("couleurOrigineTexte")
							? $(this).data("couleurOrigineTexte")
							: event.data.aCouleurTexte;
					$(this)
						.css({ backgroundColor: lEventCouleur, color: lEventCouleurTexte })
						.data("etatedit", event.data.aSuivant);
					event.stopImmediatePropagation();
					const lArrDate = this.id.match(
						/([0-9]{1,2})_([0-9]{1,2})_([0-9]{4})_cel$/,
					);
					let lDateElm;
					if (Array.isArray(lArrDate) && lArrDate.length > 3) {
						lDateElm = new Date(
							parseInt(lArrDate[3]),
							parseInt(lArrDate[2]),
							parseInt(lArrDate[1]),
						);
					}
					if (lThis && lThis.callback) {
						lThis.callback.appel({
							event: event,
							genre: ObjetCalendrierAnnuel.genreEvent.click,
							date: lDateElm,
						});
					}
				}
			}
			return false;
		}
		const lClassJourNonOuvre = this.classJourNonOuvre;
		const lCouleurNonOuvre = this.options.joursOuvres.fond.couleur;
		const lCouleurTexteNonOuvre = this.options.joursOuvres.texte.couleur;
		const lClassJourFerie = this.classJourFerie;
		const lCouleurFerie = this.options.joursFeries.fond.couleur;
		const lCouleurTexteFerie = this.options.joursFeries.texte.couleur;
		const lCouleurTexteOuvre = this.options.style.defaut.texte.couleur;
		const lCouleurDefaut = this.options.style.defaut.fond.couleur;
		let prop, i, j, lJqCel, lPeriodeUnique;
		let lHeight = 0;
		$("#" + this.Nom.escapeJQ() + ' td[id$="_cel"]').each(function () {
			$(this)
				.find("td")
				.each(function () {
					$(this).css({
						background: function () {
							return "";
						},
						backgroundColor: function () {
							return "";
						},
						color: function () {
							return "";
						},
					});
					$(this).children().css("min-height", "").prop("title", "");
				});
			$(this)
				.css({
					background: function () {
						return "";
					},
					backgroundColor: function () {
						return $(this).hasClass(lClassJourFerie) ||
							$(this).hasClass(lClassJourNonOuvre)
							? $(this).hasClass(lClassJourNonOuvre)
								? lCouleurNonOuvre
								: lCouleurFerie
							: lCouleurDefaut;
					},
					color: function () {
						return $(this).hasClass(lClassJourFerie) ||
							$(this).hasClass(lClassJourNonOuvre)
							? $(this).hasClass(lClassJourNonOuvre)
								? lCouleurTexteNonOuvre
								: lCouleurTexteFerie
							: lCouleurTexteOuvre;
					},
				})
				.data("etatedit", -1);
		});
		this.listeDonneesEditable = [];
		this.listeDonneesEditablePeriode = [];
		$("." + lClassJourNonOuvre)
			.css({ color: lCouleurTexteNonOuvre })
			.data("couleurOrigine", lCouleurNonOuvre)
			.data("couleurOrigineTexte", lCouleurTexteNonOuvre);
		$("." + lClassJourFerie)
			.css({ color: lCouleurTexteFerie })
			.data("couleurOrigine", lCouleurFerie)
			.data("couleurOrigineTexte", lCouleurTexteFerie);
		for (prop in this.donnees) {
			if (!MethodesObjet_1.MethodesObjet.isFunction(this.donnees[prop])) {
				const lDonneesProp = this.donnees[prop];
				const lDonnees = MethodesObjet_1.MethodesObjet.isFunction(
					lDonneesProp.filtre,
				)
					? lDonneesProp.donnees.getListeElements(lDonneesProp.filtre)
					: lDonneesProp.donnees;
				const lCouleur = lDonneesProp.couleur;
				const lNoContainer =
					this.options.nbrContainers > 0 && lDonneesProp.index !== undefined
						? lDonneesProp.index
						: undefined;
				const lContainerActif = lDonneesProp.actif;
				const lCouleurTexte =
					lDonneesProp.texte && lDonneesProp.texte.couleur
						? lDonneesProp.texte.couleur
						: this.options.style.defaut.texte.couleur;
				const lEstNonEditable = !!lDonneesProp.nonEditable;
				let lEstEditable = false;
				if (lDonneesProp.editable) {
					this.listeDonneesEditable.push(prop);
					lEstEditable = true;
					if (lDonneesProp.editablePeriode) {
						this.listeDonneesEditablePeriode.push(
							this.listeDonneesEditable.length - 1,
						);
					}
				}
				for (i = 0; i < lDonnees.count(); i++) {
					const lElement = lDonnees.get(i);
					if (!lElement.existe()) {
						continue;
					}
					const lStart = lElement[lDonneesProp.variables[0]];
					const lStop = lDonneesProp.variables[1]
						? lElement[lDonneesProp.variables[1]]
						: lStart;
					for (
						j = lStart;
						j <= lStop;
						j = new Date(j.getFullYear(), j.getMonth(), j.getDate() + 1)
					) {
						let lJqCelC;
						lJqCel = $(
							"#" +
								this.idDays.escapeJQ() +
								j.getDate() +
								"_" +
								j.getMonth() +
								"_" +
								j.getFullYear() +
								"_cel",
						);
						if (!lNoContainer) {
							lJqCel.css({
								background: lElement.couleur || lCouleur,
								color: lElement.couleurTexte || lCouleurTexte,
							});
						} else {
							lJqCelC = $(
								"#" +
									this.idDays.escapeJQ() +
									j.getDate() +
									"_" +
									j.getMonth() +
									"_" +
									j.getFullYear() +
									"_cont_" +
									lNoContainer,
							);
							lJqCelC.css({
								background: lElement.couleur || lCouleur,
								color: lElement.couleurTexte || lCouleurTexte,
							});
							if (lElement.Libelle !== "") {
								lJqCelC.children().prop("title", lElement.Libelle);
							}
						}
						if (lElement.Libelle !== "" && !lJqCelC) {
							lJqCel.data("title", lElement.Libelle);
						}
						if (lEstNonEditable) {
							lJqCel.data("nonedit", true);
						}
						if (lEstEditable) {
							lJqCel.data("etatedit", this.listeDonneesEditable.length - 1);
						} else {
							lJqCel.data("couleurOrigine", lCouleur);
							lJqCel.data("couleurOrigineTexte", lCouleurTexte);
						}
					}
				}
				if (!!lNoContainer && !!lContainerActif) {
					lHeight = lJqCel.height() - (this.options.initialeJour ? 12 : 0);
					const lSize =
						lHeight > 0
							? Math.floor(
									lHeight /
										(this.donnees.nbrContainersActif
											? this.donnees.nbrContainersActif()
											: this.options.nbrContainers),
								) + "px"
							: "5px";
					$(
						"#" +
							this.Nom.escapeJQ() +
							' [id$="_contDiv_' +
							lNoContainer +
							'"]',
					).each(function () {
						$(this).css("min-height", lSize);
					});
				}
			}
		}
		const lJqThis = $("#" + this.Nom.escapeJQ());
		lJqThis.off("click", 'td[id$="_cel"]');
		if (this.listeDonneesEditable.length > 0) {
			const lThis = this;
			lJqThis.find('td[id$="_cel"]').each(function () {
				if (
					$(this).data("nonedit") !== true &&
					$(this).data("etatedit") === undefined
				) {
					$(this).data("etatedit", -1);
					$(this).data(
						"couleurOrigine",
						lThis.options.style.defaut.fond.couleur,
					);
					$(this).data(
						"couleurOrigineTexte",
						lThis.options.style.defaut.texte.couleur,
					);
				}
			});
			for (i = -1; i < this.listeDonneesEditable.length; i++) {
				let lValeurNext, lCouleurEvent, lCouleurTexteEvent;
				lPeriodeUnique =
					!!this.listeDonneesEditablePeriode.length &&
					!!this.donnees[
						this.listeDonneesEditable[this.listeDonneesEditablePeriode[0]]
					].periodeUnique &&
					this.donnees[
						this.listeDonneesEditable[this.listeDonneesEditablePeriode[0]]
					].variables.length === 2 &&
					this.donnees[
						this.listeDonneesEditable[this.listeDonneesEditablePeriode[0]]
					].donnees.count() === 1;
				if (i === this.listeDonneesEditable.length - 1) {
					lValeurNext = -1;
					lCouleurEvent = this.options.style.defaut.fond.couleur;
					lCouleurTexteEvent = this.options.style.defaut.texte.couleur;
				} else {
					lValeurNext = i + 1;
					lCouleurEvent =
						this.donnees[this.listeDonneesEditable[i + 1]].couleur;
					lCouleurTexteEvent =
						this.donnees[this.listeDonneesEditable[i + 1]].texte &&
						this.donnees[this.listeDonneesEditable[i + 1]].texte.couleur
							? this.donnees[this.listeDonneesEditable[i + 1]].texte.couleur
							: this.options.style.defaut.texte.couleur;
				}
				lJqThis.on(
					"click",
					'td[id$="_cel"]',
					{
						aThis: this,
						aValeur: i,
						aCouleur: lCouleurEvent,
						aCouleurTexte: lCouleurTexteEvent,
						aSuivant: lValeurNext,
						aPeriodeUnique: lPeriodeUnique,
					},
					_onclick,
				);
			}
			if (this.listeDonneesEditablePeriode.length === 1) {
				lPeriodeUnique =
					!!this.donnees[
						this.listeDonneesEditable[this.listeDonneesEditablePeriode[0]]
					].periodeUnique &&
					this.donnees[
						this.listeDonneesEditable[this.listeDonneesEditablePeriode[0]]
					].variables.length === 2 &&
					this.donnees[
						this.listeDonneesEditable[this.listeDonneesEditablePeriode[0]]
					].donnees.count() === 1;
				lJqThis.on(
					"mousedown",
					'td[id$="_cel"]',
					{
						aThis: this,
						aValeur: this.listeDonneesEditablePeriode[0],
						aPeriodeUnique: lPeriodeUnique,
					},
					function (event) {
						const lThis = event.data.aThis;
						if (
							$(this).data("nonedit") !== true &&
							lThis.donneesEditionPeriode === null
						) {
							if (
								$(this).data("etatedit") === event.data.aValeur ||
								$(this).data("etatedit") === -1
							) {
								const lDate = this.id.match(
									/([0-9]{1,2})_([0-9]{1,2})_([0-9]{4})_cel$/,
								);
								if (!!lDate) {
									lThis.donneesEditionPeriode = {
										mode:
											$(this).data("etatedit") === event.data.aValeur
												? GenreEditionPeriode.Suppression
												: GenreEditionPeriode.Ajout,
										start: new Date(lDate[3], lDate[2], lDate[1]),
										periodeUnique: event.data.aPeriodeUnique,
									};
								}
								event.stopImmediatePropagation();
							}
						} else {
							lThis.donneesEditionPeriode = null;
						}
						if (lThis && lThis.callback) {
							lThis.callback.appel({
								event: event,
								genre: ObjetCalendrierAnnuel.genreEvent.mouseDown,
							});
						}
						return false;
					},
				);
				lJqThis.on(
					"mouseenter",
					'td[id$="_cel"]',
					{ aThis: this, aValeur: this.listeDonneesEditablePeriode[0] },
					function (event) {
						const lThis = event.data.aThis;
						if (lThis.donneesEditionPeriode !== null) {
							const lDate = this.id.match(
								/([0-9]{1,2})_([0-9]{1,2})_([0-9]{4})_cel$/,
							);
							let lDateStart = lThis.donneesEditionPeriode.start;
							let lDateStop = lThis.donneesEditionPeriode.stop;
							let lStart, lStop;
							if (lDateStart <= lDateStop || lDateStop === undefined) {
								lStart = lDateStart;
								lStop = lDateStop;
							} else {
								lStart = lDateStop;
								lStop = lDateStart;
							}
							if (lDateStop !== undefined) {
								for (
									j = lStart;
									j <= lStop;
									j = new Date(j.getFullYear(), j.getMonth(), j.getDate() + 1)
								) {
									lJqCel = $(
										"#" +
											lThis.idDays.escapeJQ() +
											j.getDate() +
											"_" +
											j.getMonth() +
											"_" +
											j.getFullYear() +
											"_cel",
									);
									lJqCel
										.find("td.ObjetCalendrierAnnuel_numerojour")
										.css({ backgroundColor: "", color: "" });
								}
							}
							lThis.donneesEditionPeriode.stop = lDateStop = new Date(
								lDate[3],
								lDate[2],
								lDate[1],
							);
							if (!lStop) {
								lStop = lDateStop;
							}
							if (lThis.donneesEditionPeriode.periodeUnique) {
								let lStartAct, lStopAct;
								$(this)
									.parents("table:first")
									.find('td[id$="_cel"]')
									.each(function () {
										if ($(this).data("etatedit") === event.data.aValeur) {
											const lDonneeDate = this.id.match(
													/([0-9]{1,2})_([0-9]{1,2})_([0-9]{4})_cel$/,
												),
												lDateCel = new Date(
													parseInt(lDonneeDate[3]),
													parseInt(lDonneeDate[2]),
													parseInt(lDonneeDate[1]),
												);
											if (!lStartAct || lDateCel < lStartAct) {
												lStartAct = lDateCel;
											}
											if (!lStopAct || lDateCel > lStopAct) {
												lStopAct = lDateCel;
											}
										}
									});
								if (
									lStartAct < lStart &&
									lStartAct < lStop &&
									lStart < lStopAct &&
									lStop < lStopAct
								) {
									lStart = 0;
									lStop = -1;
								} else {
									if (lDateStart > lDateStop) {
										const lTemp = lDateStart;
										lDateStart = lDateStop;
										lDateStop = lTemp;
									}
									if (
										lStartAct <= lDateStart &&
										lThis.donneesEditionPeriode.mode !==
											GenreEditionPeriode.Suppression
									) {
										lStart = lStartAct;
									} else {
										lStart = lDateStart;
									}
									if (
										lStopAct >= lDateStop &&
										lThis.donneesEditionPeriode.mode !==
											GenreEditionPeriode.Suppression
									) {
										lStop = lStopAct;
									} else {
										lStop = lDateStop;
									}
								}
							} else {
								if (lDateStart <= lDateStop) {
									lStart = lDateStart;
									lStop = lDateStop;
								} else {
									lStart = lDateStop;
									lStop = lDateStart;
								}
							}
							for (
								j = lStart;
								j <= lStop;
								j = new Date(j.getFullYear(), j.getMonth(), j.getDate() + 1)
							) {
								lJqCel = $(
									"#" +
										lThis.idDays.escapeJQ() +
										j.getDate() +
										"_" +
										j.getMonth() +
										"_" +
										j.getFullYear() +
										"_cel",
								);
								if (
									lJqCel.data("etatedit") === -1 ||
									lJqCel.data("etatedit") === event.data.aValeur
								) {
									lJqCel
										.find("td.ObjetCalendrierAnnuel_numerojour")
										.css({
											backgroundColor:
												lThis.donneesEditionPeriode.mode ===
												GenreEditionPeriode.Suppression
													? lThis.options.style.editionPeriode.suppression.fond
															.couleur
													: lThis.options.style.editionPeriode.ajout.fond
															.couleur,
											color:
												lThis.donneesEditionPeriode.mode ===
												GenreEditionPeriode.Suppression
													? lThis.options.style.editionPeriode.suppression.texte
															.couleur
													: lThis.options.style.editionPeriode.ajout.texte
															.couleur,
										});
								}
							}
							event.stopImmediatePropagation();
							if (lThis && lThis.callback) {
								lThis.callback.appel({
									event: event,
									genre: ObjetCalendrierAnnuel.genreEvent.mouseEnter,
								});
							}
							return false;
						}
					},
				);
				lJqThis.on(
					"mouseup",
					'td[id$="_cel"]',
					{ aThis: this, aValeur: this.listeDonneesEditablePeriode[0] },
					function (event) {
						const lThis = event.data.aThis;
						if (lThis.donneesEditionPeriode !== null) {
							let lDateStart = lThis.donneesEditionPeriode.start;
							let lDateStop = lThis.donneesEditionPeriode.stop;
							let lStart, lStop;
							if (lThis.donneesEditionPeriode.periodeUnique) {
								let lStartAct, lStopAct;
								$(this)
									.parents("table:first")
									.find('td[id$="_cel"]')
									.each(function () {
										if ($(this).data("etatedit") === event.data.aValeur) {
											const lDonneeDate = this.id.match(
													/([0-9]{1,2})_([0-9]{1,2})_([0-9]{4})_cel$/,
												),
												lDateCel = new Date(
													parseInt(lDonneeDate[3]),
													parseInt(lDonneeDate[2]),
													parseInt(lDonneeDate[1]),
												);
											if (!lStartAct || lDateCel < lStartAct) {
												lStartAct = lDateCel;
											}
											if (!lStopAct || lDateCel > lStopAct) {
												lStopAct = lDateCel;
											}
										}
									});
								if (
									lStartAct < lDateStart &&
									lStartAct < lDateStop &&
									lDateStart < lStopAct &&
									lDateStop < lStopAct
								) {
									lStart = 0;
									lStop = -1;
								} else {
									if (lDateStart > lDateStop) {
										const lTemp = lDateStart;
										lDateStart = lDateStop;
										lDateStop = lTemp;
									}
									if (
										lStartAct <= lDateStart &&
										lThis.donneesEditionPeriode.mode !==
											GenreEditionPeriode.Suppression
									) {
										lStart = lStartAct;
									} else {
										lStart = lDateStart;
									}
									if (
										lStopAct >= lDateStop &&
										lThis.donneesEditionPeriode.mode !==
											GenreEditionPeriode.Suppression
									) {
										lStop = lStopAct;
									} else {
										lStop = lDateStop;
									}
								}
							} else {
								if (lDateStart <= lDateStop) {
									lStart = lDateStart;
									lStop = lDateStop;
								} else {
									lStart = lDateStop;
									lStop = lDateStart;
								}
							}
							for (
								j = lStart;
								j <= lStop;
								j = new Date(j.getFullYear(), j.getMonth(), j.getDate() + 1)
							) {
								lJqCel = $(
									"#" +
										lThis.idDays.escapeJQ() +
										j.getDate() +
										"_" +
										j.getMonth() +
										"_" +
										j.getFullYear() +
										"_cel",
								);
								lJqCel
									.find("td.ObjetCalendrierAnnuel_numerojour")
									.css({ backgroundColor: "", color: "" });
							}
							for (
								j = lStart;
								j <= lStop && lStart.getTime() !== lStop.getTime();
								j = new Date(j.getFullYear(), j.getMonth(), j.getDate() + 1)
							) {
								lJqCel = $(
									"#" +
										lThis.idDays.escapeJQ() +
										j.getDate() +
										"_" +
										j.getMonth() +
										"_" +
										j.getFullYear() +
										"_cel",
								);
								if (
									lJqCel.data("nonedit") !== true &&
									(lJqCel.data("etatedit") === -1 ||
										lJqCel.data("etatedit") === event.data.aValeur)
								) {
									const lValeurVoulue =
										lThis.donneesEditionPeriode.mode ===
										GenreEditionPeriode.Suppression
											? -1
											: event.data.aValeur;
									const lGardeFou = 10;
									let lCompteur = 0;
									while (
										lJqCel.data("etatedit") !== lValeurVoulue &&
										lCompteur < lGardeFou
									) {
										lJqCel.trigger("click", [true]);
										lCompteur += 1;
									}
								}
							}
						}
						lThis.donneesEditionPeriode = null;
						event.stopImmediatePropagation();
						if (lThis && lThis.callback) {
							lThis.callback.appel({
								event: event,
								genre: ObjetCalendrierAnnuel.genreEvent.mouseUp,
							});
						}
						return false;
					},
				);
			}
		}
	}
	updateDonnees() {
		let lModif = false;
		let i;
		function _sort(a, b) {
			return a - b;
		}
		function _mapDonnees(index, element) {
			if ($(element).data("etatedit") === parseInt(i)) {
				const lDate = element.id.match(/_([0-9]+)_([0-9]+)_([0-9]+)_cel$/i);
				return lDate ? new Date(lDate[3], lDate[2], lDate[1]) : null;
			}
		}
		for (i in this.listeDonneesEditable) {
			const lDonneesEditees = $("#" + this.Nom.escapeJQ())
				.find('td[id$="_cel"]')
				.map(_mapDonnees)
				.get()
				.sort(_sort);
			const lDateDebut =
				this.donnees[this.listeDonneesEditable[i]].variables[0];
			const lDateFin = this.donnees[this.listeDonneesEditable[i]].variables[1];
			const lDonneesOrigine =
				this.donnees[this.listeDonneesEditable[i]].donnees;
			lDonneesOrigine.setTri([
				ObjetTri_1.ObjetTri.init(
					lDateDebut,
					Enumere_TriElement_1.EGenreTriElement.Croissant,
				),
			]);
			lDonneesOrigine.trier();
			let lIndiceOrigine = 0;
			const lTailleOrigine = lDonneesOrigine.getNbrElementsExistes();
			const lTravailSurPeriodes =
				this.donnees[this.listeDonneesEditable[i]].variables.length === 2;
			if (!lTravailSurPeriodes) {
				for (let j in lDonneesEditees) {
					while (
						lIndiceOrigine < lTailleOrigine &&
						lDonneesOrigine
							.get(lIndiceOrigine)
							[lDateDebut].setHours(0, 0, 0, 0) < lDonneesEditees[j].getTime()
					) {
						lDonneesOrigine
							.get(lIndiceOrigine)
							.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
						if (!lModif) {
							lModif = true;
						}
						lIndiceOrigine++;
					}
					if (
						lIndiceOrigine < lTailleOrigine &&
						lDonneesOrigine
							.get(lIndiceOrigine)
							[lDateDebut].setHours(0, 0, 0, 0) === lDonneesEditees[j].getTime()
					) {
						lIndiceOrigine++;
					} else if (
						lIndiceOrigine >= lTailleOrigine ||
						lDonneesOrigine
							.get(lIndiceOrigine)
							[lDateDebut].setHours(0, 0, 0, 0) > lDonneesEditees[j].getTime()
					) {
						const lElement = new ObjetElement_1.ObjetElement();
						lElement[lDateDebut] = lDonneesEditees[j];
						lElement.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
						lDonneesOrigine.addElement(lElement);
						if (!lModif) {
							lModif = true;
						}
					}
				}
				while (lIndiceOrigine < lTailleOrigine) {
					lDonneesOrigine
						.get(lIndiceOrigine)
						.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					if (!lModif) {
						lModif = true;
					}
					lIndiceOrigine++;
				}
			} else {
				const lDonneesEditeesGroupees =
					new ObjetListeElements_1.ObjetListeElements();
				let lGroupe = new ObjetElement_1.ObjetElement();
				for (const j in lDonneesEditees) {
					if (
						!lGroupe[lDateFin] ||
						new Date(
							new Date(lGroupe[lDateFin]).setDate(
								lGroupe[lDateFin].getDate() + 1,
							),
						) < lDonneesEditees[j]
					) {
						if (lGroupe[lDateFin]) {
							lDonneesEditeesGroupees.addElement(
								MethodesObjet_1.MethodesObjet.dupliquer(lGroupe),
							);
						}
						lGroupe = new ObjetElement_1.ObjetElement();
						lGroupe.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
						lGroupe[lDateDebut] = lDonneesEditees[j];
						lGroupe[lDateFin] = lDonneesEditees[j];
					} else {
						lGroupe[lDateFin] = lDonneesEditees[j];
					}
				}
				lDonneesEditeesGroupees.addElement(
					MethodesObjet_1.MethodesObjet.dupliquer(lGroupe),
				);
				lDonneesOrigine.parcourir((aEleOrig) => {
					aEleOrig.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
				});
				lDonneesOrigine.parcourir((aEleOrig) => {
					lDonneesEditeesGroupees.parcourir((aEleEdit) => {
						if (
							aEleOrig[lDateDebut] === aEleEdit[lDateDebut] &&
							aEleOrig[lDateFin] === aEleEdit[lDateFin]
						) {
							aEleOrig.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
							aEleEdit.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
							return false;
						}
					});
				});
				if (lDonneesEditeesGroupees.getNbrElementsExistes() > 0) {
					lDonneesEditeesGroupees.parcourir((aEleEdit) => {
						if (aEleEdit.getEtat() === Enumere_Etat_1.EGenreEtat.Creation) {
							lDonneesOrigine.addElement(aEleEdit);
						}
					});
				}
				lModif =
					lDonneesOrigine
						.getListeElements((aEle) => {
							return aEle.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun;
						})
						.count() > 0;
				if (lDonneesOrigine.getNbrElementsExistes() === 0) {
					lGroupe = new ObjetElement_1.ObjetElement();
					lGroupe[lDateDebut] = new Date(0);
					lGroupe[lDateFin] = new Date(0);
					lGroupe.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
					lDonneesOrigine.addElement(lGroupe);
				}
			}
		}
		return lModif;
	}
	composeImpression() {
		const lJqReturn = $("#" + this.idTable.escapeJQ())
			.parent()
			.clone();
		this.formaterPourImpression(lJqReturn);
		return lJqReturn.html();
	}
	celluleActive(event) {
		const lThis = event.data.aObjet;
		const lDate = this.id.match(/_([0-9]+)_([0-9]+_[0-9]+)_/i);
		const lJour = lDate[1];
		const lMoisAnnee = lDate[2];
		const lJqMonth = $(
			"#" + lThis.Nom.escapeJQ() + ' td[id$="' + lMoisAnnee + '_lib"]',
		);
		const lJqDay = $(
			"#" + lThis.Nom.escapeJQ() + ' td[id$="' + lJour + '_num"]',
		);
		if (event.type === "mouseenter") {
			const lBorderBaseSize = parseInt(
				lThis.options.style.defaut.bordure.taille,
				10,
			);
			const lBorderHovSize = parseInt(
				lThis.options.style.surbrillance.bordure.taille,
				10,
			);
			let lPosition;
			let lWidth;
			let lHeight;
			if (lThis.options.ligneDate) {
				lPosition = lJqDay.position();
				lWidth = lJqDay.outerWidth() + lBorderHovSize;
				lHeight = lJqDay.outerHeight() + lBorderHovSize;
				$("#" + lThis.idDayHov.escapeJQ()).css({
					display: "",
					top: lPosition.top - lBorderBaseSize,
					left: lPosition.left - lBorderBaseSize,
					width: lWidth,
					height: lHeight,
				});
			}
			lPosition = lJqMonth.position();
			lWidth = lJqMonth.outerWidth() + lBorderHovSize;
			lHeight = lJqMonth.outerHeight() + lBorderHovSize;
			$("#" + lThis.idMonthHov.escapeJQ()).css({
				display: "",
				top: lPosition.top - lBorderBaseSize,
				left: lPosition.left - lBorderBaseSize,
				width: lWidth,
				height: lHeight,
			});
			if ($(this).data("title") && $(this).data("title") !== "") {
				ObjetHint_1.ObjetHint.start($(this).data("title"));
			}
		} else {
			$("#" + lThis.Nom.escapeJQ())
				.find(
					"#" + lThis.idDayHov.escapeJQ() + ", #" + lThis.idMonthHov.escapeJQ(),
				)
				.css({ display: "none" });
			ObjetHint_1.ObjetHint.stop();
		}
	}
}
exports.ObjetCalendrierAnnuel = ObjetCalendrierAnnuel;
(function (ObjetCalendrierAnnuel) {
	let genreEvent;
	(function (genreEvent) {
		genreEvent[(genreEvent["mouseDown"] = 0)] = "mouseDown";
		genreEvent[(genreEvent["mouseEnter"] = 1)] = "mouseEnter";
		genreEvent[(genreEvent["mouseUp"] = 2)] = "mouseUp";
		genreEvent[(genreEvent["click"] = 3)] = "click";
	})(
		(genreEvent =
			ObjetCalendrierAnnuel.genreEvent ||
			(ObjetCalendrierAnnuel.genreEvent = {})),
	);
})(
	ObjetCalendrierAnnuel ||
		(exports.ObjetCalendrierAnnuel = ObjetCalendrierAnnuel = {}),
);
