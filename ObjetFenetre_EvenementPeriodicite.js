exports.ObjetFenetre_EvenementPeriodicite = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Saisie_1 = require("Enumere_Saisie");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const EGenreEvtAgenda_1 = require("EGenreEvtAgenda");
const ObjetDate_1 = require("ObjetDate");
const GUID_1 = require("GUID");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const Enumere_Etat_1 = require("Enumere_Etat");
class ObjetFenetre_EvenementPeriodicite extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.SaisieAgenda = null;
		this.periodicite = {
			type: ObjetFenetre_EvenementPeriodicite.radioPeriodicite.hebdomadaire,
			avecJourOuvres: false,
			intervalle: 1,
			jourDuMois: 0,
			indexJour: 0,
			jourDansSemaine: 0,
			DateDebut: null,
			DateFin: null,
			heureDebut: null,
			heureFin: null,
			sansHoraire: false,
			joursDeLaSemaine: [],
			avecEvtPersoDansSerie: false,
		};
		this.setOptionsFenetre({
			avecComposeBasInFooter: !!IE.estMobile,
			modale: true,
			largeur: 450,
			hauteur: 250,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_SaisieAgenda.TitreFenetrePeriodicite",
			),
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		this.id = {
			inputHeureDebut: GUID_1.GUID.getId(),
			inputHeureFin: GUID_1.GUID.getId(),
			ctnHeure: GUID_1.GUID.getId(),
		};
	}
	construireInstances() {
		this.identDateDebut = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this.evenementSurDate.bind(this, true),
		);
		this.getInstance(this.identDateDebut).setOptionsObjetCelluleDate({
			ariaDescription: ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_SaisieAgenda.DescDateDebutPeriodique",
			),
		});
		this.getInstance(this.identDateDebut).setParametresFenetre(
			GParametres.PremierLundi,
			this.SaisieAgenda.dateDebutAgenda || GParametres.PremiereDate,
			this.SaisieAgenda.dateFinAgenda,
		);
		this.identDateFin = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this.evenementSurDate.bind(this, false),
		);
		this.getInstance(this.identDateFin).setOptionsObjetCelluleDate({
			ariaDescription: ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_SaisieAgenda.DescDateFinPeriodique",
			),
		});
		this.getInstance(this.identDateFin).setParametresFenetre(
			GParametres.PremierLundi,
			this.SaisieAgenda.dateDebutAgenda || GParametres.PremiereDate,
			this.SaisieAgenda.dateFinAgenda,
		);
	}
	setDonnees(aParametres) {
		this.SaisieAgenda = aParametres;
		this.periodicite.DateDebut = this.SaisieAgenda.evenement.DateDebut;
		this.periodicite.DateFin = !!this.Pere.dateFinAgenda
			? this.Pere.dateFinAgenda
			: GParametres.DerniereDate;
		this.periodicite.heureDebut = new Date(this.periodicite.DateDebut);
		this.periodicite.heureFin = new Date(this.SaisieAgenda.evenement.DateFin);
		this.periodicite.sansHoraire = this.SaisieAgenda.evenement.sansHoraire;
		this.periodicite = this.SaisieAgenda.evenement.estPeriodique
			? MethodesObjet_1.MethodesObjet.dupliquer(
					this.SaisieAgenda.evenement.periodicite,
				)
			: this.periodicite;
		if (
			this.periodicite.type !==
			ObjetFenetre_EvenementPeriodicite.radioPeriodicite.mensuelRelatif
		) {
			this.periodicite.indexJour =
				Math.floor((this.periodicite.DateDebut.getDate() - 1) / 7) + 1;
			this.periodicite.jourDansSemaine =
				this.periodicite.DateDebut.getDay() === 0
					? 6
					: this.periodicite.DateDebut.getDay() - 1;
		}
		if (this.periodicite.jourDuMois === 0) {
			this.periodicite.jourDuMois = this.periodicite.DateDebut.getDate();
		}
		if (this.periodicite.joursDeLaSemaine.length === 0) {
			this.periodicite.joursDeLaSemaine.push(
				this.SaisieAgenda.evenement.DateDebut.getDay() === 0
					? 6
					: this.SaisieAgenda.evenement.DateDebut.getDay() - 1,
			);
		}
		this._initListePeriodicite();
		this._initInputsParDefault();
		this.construireInstances();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			CBJoursOuvres: {
				getValue: function () {
					return aInstance.periodicite.avecJourOuvres;
				},
				setValue: function (aValue) {
					aInstance.periodicite.avecJourOuvres = aValue;
				},
			},
			CBHebdomadaire: {
				getValue: function (aIndice) {
					return aInstance.periodicite.joursDeLaSemaine.includes(aIndice);
				},
				setValue: function (aIndice) {
					if (aInstance.periodicite.joursDeLaSemaine.includes(aIndice)) {
						aInstance.periodicite.joursDeLaSemaine.splice(
							aInstance.periodicite.joursDeLaSemaine.indexOf(aIndice),
							1,
						);
					} else {
						aInstance.periodicite.joursDeLaSemaine.push(aIndice);
					}
				},
			},
			ComboMensuelle: {
				init: function (aIndice, aCombo) {
					aCombo.setOptionsObjetSaisie({
						labelWAICellule:
							aIndice === 1
								? ObjetTraduction_1.GTraductions.getValeur(
										"Fenetre_SaisieAgenda.WAI.position",
									)
								: ObjetTraduction_1.GTraductions.getValeur(
										"Fenetre_SaisieAgenda.WAI.jour",
									),
						iconeGauche: "icon_reorder",
						mode: Enumere_Saisie_1.EGenreSaisie.Combo,
						longueur: 80,
						hauteur: 17,
					});
				},
				getDonnees: function (aIndice) {
					if (aIndice === 1) {
						return aInstance.SaisieAgenda.listeJourDansMois;
					} else {
						return aInstance.SaisieAgenda.listeJoursDeLaSemaine;
					}
				},
				getIndiceSelection: function (aIndice, aCombo) {
					if (aIndice === 1) {
						return aCombo.Selection !== -1
							? aCombo.Selection
							: aInstance.periodicite.indexJour - 1;
					} else {
						return aCombo.Selection !== -1
							? aCombo.Selection
							: aInstance.periodicite.jourDansSemaine;
					}
				},
				event: function (aIndice, aCombo) {
					if (aCombo.interactionUtilisateur) {
						if (aIndice === 1) {
							aInstance.periodicite.indexJour = aCombo.indice + 1;
						} else {
							aInstance.periodicite.jourDansSemaine = aCombo.indice;
						}
					}
				},
			},
			blocQuotidienne: function () {
				return (
					aInstance.periodicite.type ===
					ObjetFenetre_EvenementPeriodicite.radioPeriodicite.quotidienne
				);
			},
			blocHebdomadaire: function () {
				return (
					aInstance.periodicite.type ===
					ObjetFenetre_EvenementPeriodicite.radioPeriodicite.hebdomadaire
				);
			},
			blocMensuelle: function () {
				return (
					aInstance.periodicite.type ===
						ObjetFenetre_EvenementPeriodicite.radioPeriodicite.mensuelAbsolue ||
					aInstance.periodicite.type ===
						ObjetFenetre_EvenementPeriodicite.radioPeriodicite.mensuelRelatif
				);
			},
			supprimerPeriodicite: {
				event: function () {
					aInstance.SaisieAgenda.evenement.estPeriodique = false;
					aInstance.SaisieAgenda.evenement.DateDebut.setHours(
						aInstance.periodicite.heureDebut.getHours(),
						aInstance.periodicite.heureDebut.getMinutes(),
					);
					aInstance.SaisieAgenda.evenement.DateFin.setHours(
						aInstance.periodicite.heureFin.getHours(),
						aInstance.periodicite.heureFin.getMinutes(),
					);
					aInstance.SaisieAgenda.evenement.sansHoraire =
						aInstance.periodicite.sansHoraire;
					delete aInstance.SaisieAgenda.evenement.periodicite;
					aInstance.SaisieAgenda.genreEvt =
						EGenreEvtAgenda_1.EGenreEvtAgenda.nonPeriodique;
					aInstance.SaisieAgenda._actualiserBlocHoraire();
					aInstance.SaisieAgenda._actualiserBlocPeriodicite();
					aInstance.fermer();
				},
			},
			fenetreBtn: {
				getDisabled: function (aBoutonRepeat) {
					if (
						aInstance.periodicite.joursDeLaSemaine.length === 0 &&
						aInstance.periodicite.type ===
							ObjetFenetre_EvenementPeriodicite.radioPeriodicite.hebdomadaire &&
						aBoutonRepeat.element.index === 1
					) {
						return true;
					}
					return (
						aInstance.optionsFenetre.listeBoutonsInactifs &&
						aInstance.optionsFenetre.listeBoutonsInactifs[
							aBoutonRepeat.element.index
						] === true
					);
				},
			},
			switchHoraire: {
				getValue() {
					return !aInstance.periodicite.sansHoraire;
				},
				setValue(aValue) {
					aInstance.periodicite.sansHoraire = !aValue;
					if (IE.estMobile && !!aInstance.periodicite) {
						if (aInstance.periodicite.sansHoraire) {
							$("#" + aInstance.id.ctnHeure).addClass("opacity-low");
						} else {
							$("#" + aInstance.id.ctnHeure).removeClass("opacity-low");
						}
					}
				},
			},
			inputTimeHoraire: {
				heureDebut: {
					getValue() {
						return aInstance.valueInputHeureDebut;
					},
					setValue(aValue) {
						aInstance.valueInputHeureDebut = aValue;
					},
					getDisabled() {
						return aInstance.periodicite
							? aInstance.periodicite.sansHoraire
							: true;
					},
					exitChange() {
						aInstance.verifValueTime(true);
					},
				},
				heureFin: {
					getValue() {
						return aInstance.valueInputHeureFin;
					},
					setValue(aValue) {
						aInstance.valueInputHeureFin = aValue;
					},
					getDisabled() {
						return aInstance.periodicite
							? aInstance.periodicite.sansHoraire
							: true;
					},
					exitChange() {
						aInstance.verifValueTime(false);
					},
				},
			},
			comboSelectTypePeriodicite: {
				init(aCombo) {
					aCombo.setOptionsObjetSaisie({
						mode: Enumere_Saisie_1.EGenreSaisie.Combo,
						longueur: 150,
						iconeGauche: IE.estMobile ? "icon_reorder" : "",
						labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
							"WAI.SelectionPeriodicite",
						),
					});
					aCombo.setDonneesObjetSaisie({
						liste: aInstance.listeTypePeriodicite,
						selection: aInstance.periodicite.type,
					});
				},
				getIndiceSelection() {
					return Math.max(aInstance.periodicite.type, 0);
				},
				event(aParam) {
					if (!!aParam.element) {
						aInstance.periodicite.type = aParam.indice;
						if (
							aInstance.periodicite.type ===
							ObjetFenetre_EvenementPeriodicite.radioPeriodicite.quotidienne
						) {
							aInstance.periodicite.intervalle = parseInt(
								ObjetHtml_1.GHtml.getValue(aInstance.Nom + "_editJ_" + 0),
							);
						}
						if (
							aInstance.periodicite.type ===
							ObjetFenetre_EvenementPeriodicite.radioPeriodicite.hebdomadaire
						) {
							aInstance.periodicite.intervalle = parseInt(
								ObjetHtml_1.GHtml.getValue(aInstance.Nom + "_editS_" + 0),
							);
						}
						if (
							aInstance.periodicite.type ===
							ObjetFenetre_EvenementPeriodicite.radioPeriodicite.mensuelAbsolue
						) {
							aInstance.periodicite.intervalle = parseInt(
								ObjetHtml_1.GHtml.getValue(aInstance.Nom + "_editM_" + 0),
							);
						}
						if (
							aInstance.periodicite.type ===
							ObjetFenetre_EvenementPeriodicite.radioPeriodicite.mensuelRelatif
						) {
							aInstance.periodicite.intervalle = parseInt(
								ObjetHtml_1.GHtml.getValue(aInstance.Nom + "_editM_" + 1),
							);
						}
					}
				},
				getAttr() {
					return {
						"aria-description": ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_SaisieAgenda.DescComboTypePeriodicite",
						),
					};
				},
			},
			blocMensuelleAbsolue: function () {
				return (
					aInstance.periodicite.type ===
					ObjetFenetre_EvenementPeriodicite.radioPeriodicite.mensuelAbsolue
				);
			},
			blocMensuelleRelatif: function () {
				return (
					aInstance.periodicite.type ===
					ObjetFenetre_EvenementPeriodicite.radioPeriodicite.mensuelRelatif
				);
			},
			inputMois: {
				getValue(aIndice) {
					if (aIndice === 0) {
						if (!!aInstance.inputMoisMensuelAbsolue) {
							return aInstance.inputMoisMensuelAbsolue;
						}
					} else {
						if (!!aInstance.inputMoisMensuelRelatif) {
							return aInstance.inputMoisMensuelRelatif;
						}
					}
				},
				setValue(aIndice, aValue) {
					if (aIndice === 0) {
						aInstance.inputMoisMensuelAbsolue = aValue;
					} else {
						aInstance.inputMoisMensuelRelatif = aValue;
					}
					aInstance.periodicite.intervalle = parseInt(aValue);
				},
				exitChange(aIndice) {
					let lValue;
					if (aIndice === 0) {
						lValue = aInstance._verifValueRangeInput(
							aInstance.inputMoisMensuelAbsolue,
							12,
						);
						aInstance.inputMoisMensuelAbsolue = lValue;
					} else {
						lValue = aInstance._verifValueRangeInput(
							aInstance.inputMoisMensuelRelatif,
							12,
						);
						aInstance.inputMoisMensuelRelatif = lValue;
					}
					aInstance.periodicite.intervalle = lValue;
				},
				getAttr(aIndice) {
					let lResult;
					if (aIndice === 0 && !!aInstance.inputMoisMensuelAbsolue) {
						lResult = {
							"aria-label": `${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.FenetrePeriodiciteToutesLes")} ${aInstance.inputMoisMensuelAbsolue}  ${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.FenetrePeriodiciteMois")}`,
						};
					} else if (!!aInstance.inputMoisMensuelRelatif) {
						lResult = {
							"aria-label": `${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.FenetrePeriodiciteToutesLes")} ${aInstance.inputMoisMensuelRelatif}  ${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.FenetrePeriodiciteMois")}`,
						};
					}
					return lResult;
				},
			},
			inputJours: {
				getValue() {
					if (!!aInstance.inputJourQuotidien) {
						return aInstance.inputJourQuotidien;
					}
				},
				setValue(aValue) {
					aInstance.inputJourQuotidien = aValue;
					aInstance.periodicite.intervalle = parseInt(aValue);
				},
				exitChange() {
					const lValue = aInstance._verifValueRangeInput(
						aInstance.inputJourQuotidien,
						365,
					);
					aInstance.inputJourQuotidien = lValue;
					aInstance.periodicite.intervalle = lValue;
				},
				getAttr() {
					if (!!aInstance.inputJourQuotidien) {
						const lResult = {
							"aria-label": `${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.FenetrePeriodiciteToutesLes")} ${aInstance.inputJourQuotidien}  ${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.FenetrePeriodiciteJours")}`,
						};
						return lResult;
					} else {
						return {};
					}
				},
			},
			inputSemaines: {
				getValue() {
					if (!!aInstance.inputSemaineHebdomadaire) {
						return aInstance.inputSemaineHebdomadaire;
					}
				},
				setValue(aValue) {
					aInstance.inputSemaineHebdomadaire = aValue;
					aInstance.periodicite.intervalle = parseInt(aValue);
				},
				exitChange() {
					const lValue = aInstance._verifValueRangeInput(
						aInstance.inputSemaineHebdomadaire,
						53,
					);
					aInstance.inputSemaineHebdomadaire = lValue;
					aInstance.periodicite.intervalle = lValue;
				},
				getAttr() {
					if (!!aInstance.inputSemaineHebdomadaire) {
						const lResult = {
							"aria-label": `${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.FenetrePeriodiciteToutesLes")} ${aInstance.inputSemaineHebdomadaire}  ${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.FenetrePeriodiciteSemaines")}`,
						};
						return lResult;
					} else {
						return {};
					}
				},
			},
			inputDate: {
				getValue() {
					if (!!aInstance.inputDateMensuelAbsolue) {
						return aInstance.inputDateMensuelAbsolue;
					}
				},
				setValue(aValue) {
					aInstance.inputDateMensuelAbsolue = aValue;
					aInstance.periodicite.jourDuMois = parseInt(aValue);
				},
				exitChange() {
					const lValue = aInstance._verifValueRangeInput(
						aInstance.inputDateMensuelAbsolue,
						31,
					);
					aInstance.inputDateMensuelAbsolue = lValue;
					aInstance.periodicite.jourDuMois = lValue;
				},
				getAttr() {
					if (!!aInstance.inputDateMensuelAbsolue) {
						const lResult = {
							"aria-label": `${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.FenetrePeriodiciteLe")} ${aInstance.inputDateMensuelAbsolue}`,
						};
						return lResult;
					} else {
						return {};
					}
				},
			},
		});
	}
	composeContenu() {
		const T = [];
		T.push('<div class="flex-contain cols FenetreEvenement">');
		T.push(
			`\n        <section class="field-contain">\n            <section class=" bloc-horaire">\n                <article class="ctn-switch">\n                    <ie-switch ie-textleft ie-model="switchHoraire"><span class="def-txt">${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.AvecHoraire")}</span></ie-switch>\n                </article>\n                <article class="ctn-time ${IE.estMobile && this.periodicite.sansHoraire ? "opacity-low" : ""}" id="${this.id.ctnHeure}">\n                    <article>\n                        <input type="time" aria-label="${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.WAI.heureDebut")}" ie-model="inputTimeHoraire.heureDebut" ></input>\n                    </article>\n                    <article>\n                        <input type="time" aria-label="${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.WAI.heureFin")}" ie-model="inputTimeHoraire.heureFin" ></input>\n                    </article>\n                </article>\n            </section>\n        </section>\n    `,
		);
		T.push(
			'<section class="field-contain">',
			'<article class="bloc-date">',
			'<span class="label-gauche">',
			ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_SaisieAgenda.FenetrePeriodiciteDu",
			),
			"</span>",
			'<article id="',
			this.getNomInstance(this.identDateDebut),
			'"></article>',
			'<span class="label-gauche">',
			ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_SaisieAgenda.FenetrePeriodiciteAu",
			).toLowerCase(),
			"</span>",
			'<article id="',
			this.getNomInstance(this.identDateFin),
			'"></article>',
			"</article>",
			"</section>",
		);
		T.push(
			'<section class="field-contain">',
			'<article class="bloc-ouvre">',
			'<ie-checkbox ie-model="CBJoursOuvres">',
			'<span class="PetitEspaceGauche def-txt">',
			ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_SaisieAgenda.FenetrePeriodiciteJoursOuvres",
			),
			"</span>",
			"</ie-checkbox>",
			"</article>",
			"</section>",
		);
		if (!IE.estMobile) {
			T.push('<div class="divider"></div>');
		}
		T.push(
			`\n        <section class="field-contain">\n            <article  class="bloc-selecteur-periodicite">\n                <ie-combo ie-model="comboSelectTypePeriodicite" class="combo-selecteur" ie-attr="comboSelectTypePeriodicite.getAttr" ></ie-combo>\n            </article>\n        </section>\n    `,
		);
		T.push(`<section class="field-contain">`);
		T.push(`\n              <section ie-display="blocQuotidienne" class="bloc-quotidienne flex-between">\n                  <span class="m-right-l def-txt">${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.FenetrePeriodiciteTousLes")}</span>\n                  <article>\n                      ${this._composeSaisieJour(0)}
                      <p class="m-left-l def-txt like-span">${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.FenetrePeriodiciteJours")}</p>\n                  </article>\n              </section>\n    `);
		T.push(`\n              <section ie-display="blocHebdomadaire" class="bloc-hebdomadaire">\n                  <article class="ctn-haut flex-center">\n                      <span  class="m-right-l def-txt">${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.FenetrePeriodiciteToutesLes")}</span>\n                      <article>\n                          ${this._composeSaisieSemaine(0)}
                          <p class="m-left-l def-txt like-span">${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.FenetrePeriodiciteSemaines")}</p>\n                      </article>\n                  </article>\n                  <article class="ctn-liste-jours">\n    `);
		for (
			let i = 0, lNbr = this.SaisieAgenda.listeJoursDeLaSemaine.count();
			i < lNbr;
			i++
		) {
			T.push(
				`        <ie-checkbox class="as-chips" ie-icon="icon_check_fin" ie-model="CBHebdomadaire(${i})">\n                          <span>${this.SaisieAgenda.listeJoursDeLaSemaine.get(i).getLibelle()}</span>\n                      </ie-checkbox>`,
			);
		}
		T.push(`\n                  </article>\n              </section>\n    `);
		T.push(`\n              <section ie-display="blocMensuelleAbsolue" class="bloc-mensuelle-absolue">\n                  <article class="ctn-haut">\n                      <span class="m-right-l def-txt">${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.FenetrePeriodiciteLe")}</span>\n                      ${this._composeSaisieDate(0)}\n                  </article>\n                  <article class="ctn-bas">\n                      <span class="m-right-l def-txt">${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.FenetrePeriodiciteTousLes")}</span>\n                      <article>\n                          ${this._composeSaisieMois(0)}
                          <p class="m-left-l def-txt like-span">${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.FenetrePeriodiciteMois")}</p>\n                      </article>\n                  </article>\n              </section>\n    `);
		T.push(`\n              <section ie-display="blocMensuelleRelatif" class="bloc-mensuelle-relatif">\n                  <article>\n                      <ie-combo class="combo-selecteur" ie-model="ComboMensuelle(1)"></ie-combo>\n                  </article>\n                  <article>\n                      <ie-combo class="combo-selecteur" ie-model="ComboMensuelle(2)"></ie-combo>\n                  </article>\n                  <article class="ctn">\n                      <span  class="m-left-l m-right-l def-txt">${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.FenetrePeriodiciteTousLes")}</span>\n                      <article>\n                        ${this._composeSaisieMois(1)}
                        <p class="m-left-l def-txt like-span">${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.FenetrePeriodiciteMois")}</p>\n                      </article>\n                  </article>\n              </section>\n    `);
		T.push(`</section>`);
		return T.join("");
	}
	composeBas() {
		const T = [];
		if (this.SaisieAgenda.evenement.estPeriodique) {
			if (IE.estMobile) {
				T.push(
					`<div class="compose-bas">\n                    <ie-btnicon class="icon_trash avecFond i-medium" title="${ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.FenetrePeriodiciteSupprimerPeriodicite")}" ie-model="supprimerPeriodicite"></ie-btnicon>\n                </div>`,
				);
			} else {
				T.push(
					'<ie-bouton ie-model="supprimerPeriodicite">',
					ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_SaisieAgenda.FenetrePeriodiciteSupprimerPeriodicite",
					),
					"</ie-bouton>",
				);
			}
		}
		return T.join("");
	}
	_composeSaisieJour(aGenreEdit) {
		const T = [];
		const lStyle = ObjetStyle_1.GStyle.composeWidth(IE.estMobile ? 20 : 35);
		T.push(
			'<input id="',
			this.Nom + "_editJ_" + aGenreEdit,
			'" type="text" ',
			'style="',
			lStyle,
			'" ',
			'class="input-nbr"',
			'maxlength="3" ',
			'ie-model="inputJours"',
			`ie-attr="inputJours.getAttr(${aGenreEdit})"`,
			'ie-mask="/[^0-9 ]+/g"',
			" />",
		);
		return T.join("");
	}
	_composeSaisieSemaine(aGenreEdit) {
		const T = [];
		const lStyle = ObjetStyle_1.GStyle.composeWidth(IE.estMobile ? 17 : 35);
		T.push(
			'<input id="',
			this.Nom + "_editS_" + aGenreEdit,
			'" type="text" ',
			'style="',
			lStyle,
			'" ',
			'class="input-nbr m-right-l"',
			'maxlength="2" ',
			'ie-model="inputSemaines"',
			`ie-attr="inputSemaines.getAttr(${aGenreEdit})"`,
			'ie-mask="/[^0-9 ]+/g"',
			'aria-label=""',
			" />",
		);
		return T.join("");
	}
	_composeSaisieDate(aGenreEdit) {
		const T = [];
		const lStyle = ObjetStyle_1.GStyle.composeWidth(IE.estMobile ? 17 : 35);
		T.push(
			'<input id="',
			this.Nom + "_editD_" + aGenreEdit,
			'" type="text" ',
			'style="',
			lStyle,
			'" ',
			'maxlength="2" ',
			'class="input-nbr"',
			`ie-model="inputDate"`,
			`ie-attr="inputDate.getAttr(${aGenreEdit})"`,
			'ie-mask="/[^0-9 ]+/g"',
			" />",
		);
		return T.join("");
	}
	_composeSaisieMois(aGenreEdit) {
		const T = [];
		const lStyle = ObjetStyle_1.GStyle.composeWidth(IE.estMobile ? 17 : 35);
		T.push(
			'<input id="',
			this.Nom + "_editM_" + aGenreEdit,
			'" ',
			'style="',
			lStyle,
			'" ',
			'maxlength="2" ',
			'class="input-nbr"',
			`ie-model="inputMois(${aGenreEdit})"`,
			`ie-attr="inputMois.getAttr(${aGenreEdit})"`,
			'ie-mask="/[^0-9 ]+/g"',
			" />",
		);
		return T.join("");
	}
	evenementSurDate(aEstDateDebut, aDate) {
		if (aEstDateDebut) {
			this.periodicite.DateDebut = aDate;
			if (this.periodicite.DateDebut > this.periodicite.DateFin) {
				this.getInstance(this.identDateFin).setDonnees(
					this.periodicite.DateDebut,
				);
			}
		} else {
			this.periodicite.DateFin = aDate;
			if (this.periodicite.DateFin < this.periodicite.DateDebut) {
				this.getInstance(this.identDateDebut).setDonnees(
					this.periodicite.DateFin,
				);
			}
		}
	}
	surValidation(aGenreBouton) {
		if (aGenreBouton === 1) {
			if (this._avecSuppressionEvtPersoDeLaSerie()) {
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_SaisieAgenda.FenetrePeriodiciteMessConfirmSuppEvtPErso",
					),
					callback: (aGenreAction) => {
						if (aGenreAction === 0) {
							this._surValidation();
						}
					},
				});
			} else {
				this._surValidation();
			}
		} else {
			this.fermer();
		}
	}
	verifValueTime(aEstDebut) {
		let lDebut = this.valueInputHeureDebut;
		let lDebutHours = parseInt(lDebut.substring(0, 2));
		let lDebutMin = parseInt(lDebut.substring(3, 5));
		let lFin = this.valueInputHeureFin;
		let lFinHours = parseInt(lFin.substring(0, 2));
		let lFinMin = parseInt(lFin.substring(3, 5));
		if (aEstDebut) {
			if (lDebutHours > lFinHours) {
				this.valueInputHeureFin = lDebut;
			}
			if (lDebutMin > lFinMin && lDebutHours === lFinHours) {
				this.valueInputHeureFin = lDebut;
			}
		} else {
			if (lFinHours < lDebutHours) {
				this.valueInputHeureDebut = lFin;
			}
			if (lFinMin < lDebutMin && lDebutHours === lFinHours) {
				this.valueInputHeureDebut = lFin;
			}
		}
	}
	_initListePeriodicite() {
		const lArr = [
			"Fenetre_SaisieAgenda.FenetrePeriodiciteQuotidienne",
			"Fenetre_SaisieAgenda.FenetrePeriodiciteHebdomadaire",
			"Fenetre_SaisieAgenda.FenetrePeriodiciteMensuelleFixe",
			"Fenetre_SaisieAgenda.FenetrePeriodiciteMensuellePersonalise",
		];
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		lArr.map((aIndex) => {
			lListe.add(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(aIndex),
				),
			);
		});
		this.listeTypePeriodicite = lListe;
	}
	_composeLibelleDescription() {
		const lHtml = [];
		switch (this.periodicite.type) {
			case ObjetFenetre_EvenementPeriodicite.radioPeriodicite.quotidienne:
				if (this.periodicite.intervalle > 1) {
					lHtml.push(
						'<div class="InlineBlock PetitEspaceDroit">',
						ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_SaisieAgenda.ALieuTousLesNJours",
							[this.periodicite.intervalle],
						),
						"</div>",
					);
				} else {
					lHtml.push(
						'<div class="InlineBlock PetitEspaceDroit">',
						ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_SaisieAgenda.ALieuTousLesJours",
						),
						"</div>",
					);
				}
				break;
			case ObjetFenetre_EvenementPeriodicite.radioPeriodicite.hebdomadaire:
				if (this.periodicite.intervalle > 1) {
					lHtml.push(
						'<div class="InlineBlock PetitEspaceDroit">',
						ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_SaisieAgenda.ALieuToutesLesNSemaines",
							[this.periodicite.intervalle],
						),
						"</div>",
					);
				} else {
					lHtml.push(
						'<div class="InlineBlock PetitEspaceDroit">',
						ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_SaisieAgenda.ALieuToutesLesSemaines",
						),
						"</div>",
					);
				}
				if (this.periodicite.joursDeLaSemaine.length > 0) {
					this.periodicite.joursDeLaSemaine.sort();
					lHtml.push('<div class="InlineBlock PetitEspaceDroit">');
					lHtml.push(
						'<div class="InlineBlock">',
						ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_SaisieAgenda.LeJourSem",
							[
								this.SaisieAgenda.listeJoursDeLaSemaine
									.get(this.periodicite.joursDeLaSemaine[0])
									.getLibelle(),
							],
						),
						"</div>",
					);
					for (
						let i = 1, lNbr = this.periodicite.joursDeLaSemaine.length;
						i < lNbr;
						i++
					) {
						lHtml.push(
							'<div class="InlineBlock">',
							ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_SaisieAgenda.JourSemSuite",
								[
									this.SaisieAgenda.listeJoursDeLaSemaine
										.get(this.periodicite.joursDeLaSemaine[i])
										.getLibelle(),
								],
							),
							"</div>",
						);
					}
					lHtml.push("</div>");
				}
				break;
			case ObjetFenetre_EvenementPeriodicite.radioPeriodicite.mensuelAbsolue:
				if (this.periodicite.intervalle > 1) {
					lHtml.push(
						'<div class="InlineBlock PetitEspaceDroit">',
						ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_SaisieAgenda.ALieuTousLesNMois",
							[this.periodicite.intervalle],
						),
						"</div>",
					);
				} else {
					lHtml.push(
						'<div class="InlineBlock PetitEspaceDroit">',
						ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_SaisieAgenda.ALieuTousLesMois",
						),
						"</div>",
					);
				}
				lHtml.push(
					'<div class="InlineBlock PetitEspaceDroit">',
					ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_SaisieAgenda.LeJourDuMois",
						[this.periodicite.jourDuMois],
					),
					"</div>",
				);
				break;
			case ObjetFenetre_EvenementPeriodicite.radioPeriodicite.mensuelRelatif:
				lHtml.push(
					'<div class="InlineBlock PetitEspaceDroit">',
					ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_SaisieAgenda.LeMoisRelatif",
						[
							this.SaisieAgenda.listeJourDansMois
								.get(this.periodicite.indexJour - 1)
								.getLibelle(),
						],
					),
					"</div>",
				);
				lHtml.push(
					'<div class="InlineBlock PetitEspaceDroit">',
					this.SaisieAgenda.listeJoursDeLaSemaine
						.get(this.periodicite.jourDansSemaine)
						.getLibelle(),
					"</div>",
				);
				if (this.periodicite.intervalle > 1) {
					lHtml.push(
						'<div class="InlineBlock PetitEspaceDroit">',
						ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_SaisieAgenda.tousLesNMoisRelatif",
							[this.periodicite.intervalle],
						),
						"</div>",
					);
				} else {
					lHtml.push(
						'<div class="InlineBlock PetitEspaceDroit">',
						ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_SaisieAgenda.tousLesMoisRelatif",
						),
						"</div>",
					);
				}
				break;
			default:
				break;
		}
		lHtml.push(
			'<div class="InlineBlock PetitEspaceDroit">',
			ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_SaisieAgenda.ACompterDU",
				[
					ObjetDate_1.GDate.formatDate(
						this.periodicite.DateDebut,
						"%JJ/%MM/%AA",
					),
				],
			),
			"</div>",
		);
		lHtml.push(
			'<div class="InlineBlock PetitEspaceDroit">',
			ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.Jusquau", [
				ObjetDate_1.GDate.formatDate(this.periodicite.DateFin, "%JJ/%MM/%AA"),
			]),
			"</div>",
		);
		if (!this.periodicite.sansHoraire) {
			lHtml.push(
				'<div class="InlineBlock PetitEspaceDroit">',
				ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.DeH"),
				"</div>",
			);
			lHtml.push(
				'<div class="InlineBlock PetitEspaceDroit">',
				ObjetDate_1.GDate.formatDate(this.periodicite.heureDebut, "%hh%sh%mm"),
				"</div>",
			);
			lHtml.push(
				'<div class="InlineBlock PetitEspaceDroit">',
				ObjetTraduction_1.GTraductions.getValeur("Fenetre_SaisieAgenda.AH"),
				"</div>",
			);
			lHtml.push(
				'<div class="InlineBlock PetitEspaceDroit">',
				ObjetDate_1.GDate.formatDate(this.periodicite.heureFin, "%hh%sh%mm"),
				"</div>",
			);
		}
		if (this.periodicite.avecJourOuvres) {
			lHtml.push(
				'<div class="InlineBlock">',
				ObjetTraduction_1.GTraductions.getValeur(
					"Fenetre_SaisieAgenda.DescriptionUniquementLesJoursOuvres",
				),
				"</div>",
			);
		}
		return lHtml.join("");
	}
	_initValueInputHeure() {
		const lEvenement = this.periodicite;
		const lHoursDeb =
			lEvenement.heureDebut.getHours().toString().length === 1
				? "0" + lEvenement.heureDebut.getHours()
				: lEvenement.heureDebut.getHours();
		const lMinutesDeb =
			lEvenement.heureDebut.getMinutes().toString().length === 1
				? "0" + lEvenement.heureDebut.getMinutes()
				: lEvenement.heureDebut.getMinutes();
		const lHoursFin =
			lEvenement.heureFin.getHours().toString().length === 1
				? "0" + lEvenement.heureFin.getHours()
				: lEvenement.heureFin.getHours();
		const lMinutesFin =
			lEvenement.heureFin.getMinutes().toString().length === 1
				? "0" + lEvenement.heureFin.getMinutes()
				: lEvenement.heureFin.getMinutes();
		this.valueInputHeureDebut = lHoursDeb + ":" + lMinutesDeb;
		this.valueInputHeureFin = lHoursFin + ":" + lMinutesFin;
	}
	_initInputsParDefault() {
		let lValue, lValueJourDuMois, lValueDate;
		const lInterval = this.periodicite.intervalle;
		this._initValueInputHeure();
		if (this.SaisieAgenda.etat === Enumere_Etat_1.EGenreEtat.Creation) {
			this._initValeurInputParType();
		} else {
			switch (this.periodicite.type) {
				case ObjetFenetre_EvenementPeriodicite.radioPeriodicite.quotidienne:
					lValue = lInterval > 365 ? 365 : this.periodicite.intervalle;
					this._initValeurInputParType({
						quotidien: lInterval,
						hebdomadaire: 1,
						absolueMois: 1,
						absolueDate: 1,
						relatif: 1,
					});
					break;
				case ObjetFenetre_EvenementPeriodicite.radioPeriodicite.hebdomadaire:
					lValue = lInterval > 53 ? 53 : this.periodicite.intervalle;
					this._initValeurInputParType({
						quotidien: 1,
						hebdomadaire: lValue,
						absolueMois: 1,
						absolueDate: 1,
						relatif: 1,
					});
					break;
				case ObjetFenetre_EvenementPeriodicite.radioPeriodicite.mensuelAbsolue:
					lValueJourDuMois = this.periodicite.jourDuMois;
					lValueDate = lInterval > 12 ? 12 : this.periodicite.intervalle;
					this._initValeurInputParType({
						quotidien: 1,
						hebdomadaire: 1,
						absolueMois: lValueDate,
						absolueDate: lValueJourDuMois,
						relatif: 1,
					});
					break;
				case ObjetFenetre_EvenementPeriodicite.radioPeriodicite.mensuelRelatif:
					lValue = lInterval > 12 ? 12 : this.periodicite.intervalle;
					this._initValeurInputParType({
						quotidien: 1,
						hebdomadaire: 1,
						absolueMois: 1,
						absolueDate: 1,
						relatif: lValue,
					});
					break;
			}
		}
	}
	_initValeurInputParType(aParams) {
		if (!!aParams) {
			this.inputJourQuotidien = aParams.quotidien;
			this.inputSemaineHebdomadaire = aParams.hebdomadaire;
			this.inputMoisMensuelAbsolue = aParams.absolueMois;
			this.inputDateMensuelAbsolue = aParams.absolueDate;
			this.inputMoisMensuelRelatif = aParams.relatif;
		} else {
			this.inputJourQuotidien = 1;
			this.inputSemaineHebdomadaire = 1;
			this.inputMoisMensuelAbsolue = 1;
			this.inputDateMensuelAbsolue = this.periodicite.DateDebut.getDate();
			this.inputMoisMensuelRelatif = 1;
		}
	}
	_verifValueRangeInput(aValue, aMax) {
		let lValue = parseInt(aValue);
		if (aValue === "") {
			lValue = 1;
		}
		if (lValue < 1 || lValue > aMax) {
			lValue = 1;
			GApplication.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				message: ObjetTraduction_1.GTraductions.getValeur(
					"Fenetre_SaisieAgenda.FenetrePeriodiciteBadRangeValue",
					[1, aMax],
				),
			});
		}
		return lValue;
	}
	_surValidation() {
		this._setHeureEvent();
		this.SaisieAgenda.evenement.estPeriodique = true;
		this.periodicite.libelleDescription = this._composeLibelleDescription();
		this.SaisieAgenda.evenement.periodicite = this.periodicite;
		this.SaisieAgenda.evenement.avecModificationPublic = true;
		this.SaisieAgenda.genreEvt =
			this.SaisieAgenda.genreEvt ===
			EGenreEvtAgenda_1.EGenreEvtAgenda.nonPeriodique
				? EGenreEvtAgenda_1.EGenreEvtAgenda.surNouvelleSerie
				: this.SaisieAgenda.genreEvt;
		this.SaisieAgenda._actualiserBlocPeriodicite();
		this.fermer();
	}
	_setHeureEvent() {
		const lHeureDebutHeure = parseInt(
			this.valueInputHeureDebut.substring(0, 2),
		);
		const lHeureDebutMin = parseInt(this.valueInputHeureDebut.substring(3, 5));
		const lHeureFinHeure = parseInt(this.valueInputHeureFin.substring(0, 2));
		const lHeureFinMin = parseInt(this.valueInputHeureFin.substring(3, 5));
		this.periodicite.heureDebut = new Date(this.periodicite.DateDebut);
		this.periodicite.heureFin = new Date(this.periodicite.DateDebut);
		this.periodicite.heureDebut.setHours(lHeureDebutHeure);
		this.periodicite.heureDebut.setMinutes(lHeureDebutMin);
		this.periodicite.heureFin.setHours(lHeureFinHeure);
		this.periodicite.heureFin.setMinutes(lHeureFinMin);
	}
	_avecSuppressionEvtPersoDeLaSerie() {
		if (
			this.SaisieAgenda.evenementOrigine &&
			this.SaisieAgenda.evenementOrigine.estPeriodique
		) {
			const lPeriodiciteAvant = this.SaisieAgenda.evenementOrigine.periodicite;
			const lPeriodiciteApres = this.periodicite;
			if (lPeriodiciteApres.avecEvtPersoDansSerie) {
				if (
					lPeriodiciteAvant.type === lPeriodiciteApres.type &&
					lPeriodiciteAvant.avecJourOuvres ===
						lPeriodiciteApres.avecJourOuvres &&
					lPeriodiciteAvant.DateDebut.getTime() ===
						lPeriodiciteApres.DateDebut.getTime() &&
					lPeriodiciteAvant.DateFin.getTime() ===
						lPeriodiciteApres.DateFin.getTime()
				) {
					switch (lPeriodiciteAvant.type) {
						case ObjetFenetre_EvenementPeriodicite.radioPeriodicite.quotidienne:
							if (
								lPeriodiciteAvant.intervalle === lPeriodiciteApres.intervalle
							) {
								return false;
							}
							return true;
						case ObjetFenetre_EvenementPeriodicite.radioPeriodicite
							.hebdomadaire:
							if (
								lPeriodiciteAvant.intervalle === lPeriodiciteApres.intervalle &&
								this.estMemeJoursDeLaSemaine(
									lPeriodiciteAvant.joursDeLaSemaine,
									lPeriodiciteApres.joursDeLaSemaine,
								)
							) {
								return false;
							}
							return true;
						case ObjetFenetre_EvenementPeriodicite.radioPeriodicite
							.mensuelAbsolue:
							if (
								lPeriodiciteAvant.intervalle === lPeriodiciteApres.intervalle &&
								lPeriodiciteAvant.jourDuMois === lPeriodiciteApres.jourDuMois
							) {
								return false;
							}
							return true;
						case ObjetFenetre_EvenementPeriodicite.radioPeriodicite
							.mensuelRelatif:
							if (
								lPeriodiciteAvant.intervalle === lPeriodiciteApres.intervalle &&
								lPeriodiciteAvant.indexJour === lPeriodiciteApres.indexJour &&
								lPeriodiciteAvant.jourDansSemaine ===
									lPeriodiciteApres.jourDansSemaine
							) {
								return false;
							}
							return true;
						default:
							return true;
					}
				} else {
					return true;
				}
			}
		}
		return false;
	}
	estMemeJoursDeLaSemaine(aAvant, aApres) {
		if (aAvant === aApres) {
			return true;
		}
		if (aAvant === null || aApres === null) {
			return false;
		}
		if (aAvant.length !== aApres.length) {
			return false;
		}
		for (let i = 0; i < aAvant.length; ++i) {
			if (aAvant[i] !== aApres[i]) {
				return false;
			}
		}
		return true;
	}
}
exports.ObjetFenetre_EvenementPeriodicite = ObjetFenetre_EvenementPeriodicite;
(function (ObjetFenetre_EvenementPeriodicite) {
	let radioPeriodicite;
	(function (radioPeriodicite) {
		radioPeriodicite[(radioPeriodicite["quotidienne"] = 0)] = "quotidienne";
		radioPeriodicite[(radioPeriodicite["hebdomadaire"] = 1)] = "hebdomadaire";
		radioPeriodicite[(radioPeriodicite["mensuelAbsolue"] = 2)] =
			"mensuelAbsolue";
		radioPeriodicite[(radioPeriodicite["mensuelRelatif"] = 3)] =
			"mensuelRelatif";
	})(
		(radioPeriodicite =
			ObjetFenetre_EvenementPeriodicite.radioPeriodicite ||
			(ObjetFenetre_EvenementPeriodicite.radioPeriodicite = {})),
	);
})(
	ObjetFenetre_EvenementPeriodicite ||
		(exports.ObjetFenetre_EvenementPeriodicite =
			ObjetFenetre_EvenementPeriodicite =
				{}),
);
