exports.ObjetResultatsActualite = exports.TypeEvenementCallback = void 0;
const DonneesListe_ResultatsActualite_1 = require("DonneesListe_ResultatsActualite");
const DonneesListe_ResultatsActualite_Mobile_1 = require("DonneesListe_ResultatsActualite_Mobile");
const ObjetHtml_1 = require("ObjetHtml");
const GUID_1 = require("GUID");
const DonneesListe_Simple_1 = require("DonneesListe_Simple");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetHint_1 = require("ObjetHint");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListeElements_1 = require("ObjetListeElements");
const MoteurInfoSondage_1 = require("MoteurInfoSondage");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetDate_1 = require("ObjetDate");
const ObjetNavigateur_1 = require("ObjetNavigateur");
var TypeEvenementCallback;
(function (TypeEvenementCallback) {
	TypeEvenementCallback["RenvoyerNotification"] = "RenvoyerNotification";
	TypeEvenementCallback["ChangerCumulClasse"] = "ChangerCumulClasse";
})(
	TypeEvenementCallback ||
		(exports.TypeEvenementCallback = TypeEvenementCallback = {}),
);
class ObjetResultatsActualite extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.idLibelleAnonyme = this.Nom + "_libelleAnonyme";
		this.idVisuQuestion = this.Nom + ".visuQuestion";
		this.classVisuQuestion = GUID_1.GUID.getClassCss();
		this.objetListeQuestions = new ObjetListe_1.ObjetListe({
			pere: this,
			evenement: this._eventListeQuestions,
		});
		this.listeResultats = new ObjetListe_1.ObjetListe({ pere: this });
		this.filtreRepondu =
			DonneesListe_ResultatsActualite_1.ETypeFiltreRepondus.tous;
		this.avecNombreReponses = false;
		this._options = {
			avecBarreTitre: true,
			avecNotificationRelance: false,
			avecSeparationNomPrenom: true,
		};
		this.donneesAffichage = { avecAffichageCumulClasses: true };
		this.objetListeQuestions.setOptionsListe({
			colonnes: [
				{
					taille: 100,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"actualites.Question",
					),
				},
			],
			hauteurAdapteContenu: false,
		});
		this.construireInstanceListeFlat();
	}
	construireInstanceListeFlat() {
		this.identListe = ObjetIdentite_1.Identite.creerInstance(
			ObjetListe_1.ObjetListe,
			{ pere: this, evenement: this.evenementListe },
		);
		this.initOptions(this.identListe);
	}
	initOptions(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			nonEditable: true,
			scrollHorizontal: false,
			avecModeAccessible: true,
		});
	}
	evenementListe() {}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			comboFiltreSelonRepondus: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						longueur: 350,
						hauteur: 16,
						hauteurLigneDefault: 16,
						labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
							"infoSond.Edition.LabelFiltreDestinataire",
						),
					});
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees && aInstance) {
						aInstance.listeChoixFiltres =
							new ObjetListeElements_1.ObjetListeElements();
						aInstance.listeChoixFiltres.addElement(
							new ObjetElement_1.ObjetElement(
								ObjetTraduction_1.GTraductions.getValeur(
									"infoSond.Edition.FiltreTous",
								),
								0,
								DonneesListe_ResultatsActualite_1.ETypeFiltreRepondus.tous,
							),
						);
						aInstance.listeChoixFiltres.addElement(
							new ObjetElement_1.ObjetElement(
								ObjetTraduction_1.GTraductions.getValeur(
									"infoSond.Edition.FiltreRepondu",
								),
								0,
								DonneesListe_ResultatsActualite_1.ETypeFiltreRepondus.repondus,
							),
						);
						aInstance.listeChoixFiltres.addElement(
							new ObjetElement_1.ObjetElement(
								ObjetTraduction_1.GTraductions.getValeur(
									"infoSond.Edition.FiltreNonRepondu",
								),
								0,
								DonneesListe_ResultatsActualite_1.ETypeFiltreRepondus
									.nonRepondus,
							),
						);
						return aInstance.listeChoixFiltres;
					}
				},
				getIndiceSelection: function () {
					let lIndice = 0;
					if (aInstance && aInstance.listeChoixFiltres) {
						lIndice = aInstance.listeChoixFiltres.getIndiceElementParFiltre(
							(D) => {
								return D.Genre === aInstance.filtreRepondu;
							},
						);
					}
					return Math.max(lIndice, 0);
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						!!aParametres.element &&
						!!aInstance.filtreRepondu !== aParametres.element.Genre
					) {
						aInstance.filtreRepondu = aParametres.element.Genre;
						aInstance.actualiserListe();
					}
				},
			},
			cbAfficherNbReponses: {
				getValue: function () {
					return !!aInstance.avecNombreReponses;
				},
				setValue: function (aValeur) {
					aInstance.avecNombreReponses = aValeur;
					aInstance.actualiserListe();
				},
			},
			cbAvecCumulParClasses: {
				getValue() {
					return aInstance.donneesAffichage.avecAffichageCumulClasses;
				},
				setValue(aValeur) {
					aInstance.donneesAffichage.avecAffichageCumulClasses = aValeur;
					aInstance.callback.appel(TypeEvenementCallback.ChangerCumulClasse, {
						actualite: aInstance.actualite,
					});
				},
				getLibelle() {
					const H = [
						ObjetTraduction_1.GTraductions.getValeur(
							"actualites.Edition.AfficherCumulParClasses",
						),
					];
					if (aInstance.estUnSondageAnonyme()) {
						H.push(
							" (",
							ObjetTraduction_1.GTraductions.getValeur(
								"actualites.Edition.NonActifSurSondageAnonyme",
							),
							")",
						);
					}
					return H.join("");
				},
				getDisabled() {
					return aInstance.estUnSondageAnonyme();
				},
			},
		});
	}
	estAvecCumulParClasse() {
		return this.donneesAffichage.avecAffichageCumulClasses;
	}
	estUnSondage() {
		return !!(this.actualite && this.actualite.estSondage);
	}
	estUnSondageAnonyme() {
		return (
			this.estUnSondage() && !!(this.actualite && this.actualite.reponseAnonyme)
		);
	}
	setOptions(aOptions) {
		$.extend(this._options, aOptions);
		return this;
	}
	setUtilitaires(aUtilitaires) {
		this.utilitaires = aUtilitaires;
		this.moteur = new MoteurInfoSondage_1.MoteurInfoSondage(aUtilitaires);
	}
	setDonnees(aActualite) {
		let lEstMemeActualite = false;
		if (
			aActualite &&
			this.actualite &&
			aActualite.getNumero() === this.actualite.getNumero()
		) {
			lEstMemeActualite = true;
		}
		this.actualite = aActualite;
		if (this.estUnSondageAnonyme()) {
			this.donneesAffichage.avecAffichageCumulClasses = false;
		}
		this._miseAJourLibelleAnonyme();
		if (this.actualite.avecResultats) {
			$("#" + this.Nom.escapeJQ() + " > table").show();
			this.objetListeQuestions.setDonnees(
				new DonneesListe_Simple_1.DonneesListe_Simple(
					this._getListeQuestionsConcernees(this.actualite),
					{ avecMultiSelection: true },
				),
			);
			let lIndiceLigneASelectionner = 0;
			if (lEstMemeActualite) {
				if (
					this.actualite.listeQuestions &&
					this.questionsSelectionnees &&
					this.questionsSelectionnees.length > 0
				) {
					for (const lQuestionSelectionnee of this.questionsSelectionnees) {
						const lQuestionConcernee = lQuestionSelectionnee.article;
						if (lQuestionConcernee) {
							let lIndiceRetrouvee = this._getIndiceDeQuestionsConcernees(
								this.actualite,
								lQuestionConcernee,
							);
							if (lIndiceRetrouvee || lIndiceRetrouvee === 0) {
								lIndiceLigneASelectionner = lIndiceRetrouvee;
								break;
							}
						}
					}
				}
			}
			this.objetListeQuestions.selectionnerLigne({
				ligne: lIndiceLigneASelectionner,
				avecEvenement: true,
			});
		} else {
			$("#" + this.Nom.escapeJQ() + " > table").hide();
		}
	}
	initialiserListeReponses(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_ResultatsActualite_1.DonneesListe_ResultatsActualite
				.colonnes.destinataires,
			genreColonne:
				DonneesListe_ResultatsActualite_1.DonneesListe_ResultatsActualite
					.colonnes.destinataires,
			taille: IE.estMobile
				? "100%"
				: this.avecSeparationNomPrenom
					? "16rem"
					: "25rem",
			titre: this._options.avecBarreTitre
				? this.avecSeparationNomPrenom
					? ObjetTraduction_1.GTraductions.getValeur(
							"actualites.Edition.ColonneNom",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"actualites.Edition.ColonneDest",
						)
				: null,
		});
		let lIdPremiereColonneScrollable = null;
		if (this.avecSeparationNomPrenom) {
			lColonnes.push({
				id: DonneesListe_ResultatsActualite_1.DonneesListe_ResultatsActualite
					.colonnes.prenom,
				genreColonne:
					DonneesListe_ResultatsActualite_1.DonneesListe_ResultatsActualite
						.colonnes.prenom,
				taille: IE.estMobile ? "100%" : "14rem",
				titre: this._options.avecBarreTitre
					? ObjetTraduction_1.GTraductions.getValeur(
							"actualites.Edition.ColonnePrenom",
						)
					: null,
			});
		}
		if (!IE.estMobile && this._avecColonneClasse()) {
			lColonnes.push({
				id: DonneesListe_ResultatsActualite_1.DonneesListe_ResultatsActualite
					.colonnes.classe,
				genreColonne:
					DonneesListe_ResultatsActualite_1.DonneesListe_ResultatsActualite
						.colonnes.classe,
				taille: "10rem",
				titre: this._options.avecBarreTitre
					? ObjetTraduction_1.GTraductions.getValeur("actualites.Classe")
					: null,
			});
		}
		const lAvecGenreReponse =
			this.question.genreReponse !== undefined &&
			this.question.genreReponse !== null;
		let lTitre = "";
		if (this.questionsSelectionnees.length > 0) {
			const lAvecMultiSelection = this.questionsSelectionnees.length > 1;
			for (let i = 0; i < this.questionsSelectionnees.length; i++) {
				const lQuestion = this.questionsSelectionnees[i].article;
				if (lQuestion) {
					const lFusionColonne = lAvecMultiSelection
						? {
								libelle: lQuestion.getLibelle(),
								titleHtml: lQuestion.texte,
								avecFusionColonne: true,
							}
						: "";
					if (
						(lAvecGenreReponse &&
							this.utilitaires.genreReponse.estGenreAvecAR(
								lQuestion.genreReponse,
							)) ||
						lQuestion.avecAR
					) {
						lTitre = ObjetTraduction_1.GTraductions.getValeur(
							"actualites.Edition.ColonneARRecu",
						);
					} else if (
						lAvecGenreReponse &&
						this.utilitaires.genreReponse.estGenreTextuelle(
							lQuestion.genreReponse,
						)
					) {
						lTitre = ObjetTraduction_1.GTraductions.getValeur(
							"actualites.Edition.ColonneReponse",
						);
					} else if (
						lAvecGenreReponse &&
						(this.utilitaires.genreReponse.estGenreChoixUnique(
							lQuestion.genreReponse,
						) ||
							this.utilitaires.genreReponse.estGenreChoixMultiple(
								lQuestion.genreReponse,
							))
					) {
						lTitre = ObjetTraduction_1.GTraductions.getValeur(
							"actualites.Edition.ColonneRepondu",
						);
					} else {
					}
					const lIdColonne =
						DonneesListe_ResultatsActualite_1.DonneesListe_ResultatsActualite
							.colonnes.reponse +
						"_" +
						i;
					let lColonneTitre = lAvecMultiSelection
						? [lFusionColonne, lTitre]
						: lTitre;
					lColonnes.push({
						id: lIdColonne,
						genreColonne:
							DonneesListe_ResultatsActualite_1.DonneesListe_ResultatsActualite
								.colonnes.reponse,
						numeroQuestion: lQuestion.getNumero(),
						taille: "5rem",
						titre: this._options.avecBarreTitre ? lColonneTitre : null,
					});
					if (lIdPremiereColonneScrollable === null) {
						lIdPremiereColonneScrollable = lIdColonne;
					}
					if (
						lAvecGenreReponse &&
						(this.utilitaires.genreReponse.estGenreChoixUnique(
							lQuestion.genreReponse,
						) ||
							this.utilitaires.genreReponse.estGenreChoixMultiple(
								lQuestion.genreReponse,
							))
					) {
						let j = 0;
						const lInstance = this;
						lQuestion.listeChoix.parcourir((aChoix) => {
							lColonneTitre = lAvecMultiSelection
								? [lFusionColonne, aChoix.getLibelle()]
								: aChoix.getLibelle();
							lColonnes.push({
								id:
									DonneesListe_ResultatsActualite_1
										.DonneesListe_ResultatsActualite.colonnes.choix +
									"_" +
									aChoix.getNumero(),
								numeroChoix: j,
								genreColonne:
									DonneesListe_ResultatsActualite_1
										.DonneesListe_ResultatsActualite.colonnes.choix,
								estChoixAutre: !!aChoix.estReponseLibre,
								numeroQuestion: lQuestion.getNumero(),
								taille: "5rem",
								titre: lInstance._options.avecBarreTitre ? lColonneTitre : null,
							});
							j++;
						});
					}
				}
			}
		}
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.deployer }],
			nonEditable: false,
			avecCelluleEditableTriangle: false,
			scrollHorizontal:
				lIdPremiereColonneScrollable ||
				DonneesListe_ResultatsActualite_1.DonneesListe_ResultatsActualite
					.colonnes.destinataires,
		});
	}
	recupererDonnees() {}
	construireAffichage() {
		const lHtmlFiltres = [];
		if (!IE.estMobile) {
			lHtmlFiltres.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ class: ["flex-contain", "flex-gap-l"] },
						IE.jsx.str("ie-combo", { "ie-model": "comboFiltreSelonRepondus" }),
						IE.jsx.str(
							"ie-checkbox",
							{ "ie-model": "cbAfficherNbReponses" },
							ObjetTraduction_1.GTraductions.getValeur(
								"actualites.Edition.AvecNombreRepondu",
							),
						),
					),
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str("ie-checkbox", { "ie-model": "cbAvecCumulParClasses" }),
					),
					IE.jsx.str("div", { class: "Texte10", id: this.idLibelleAnonyme }),
				),
			);
		}
		if (IE.estMobile) {
			return IE.jsx.str(
				"div",
				null,
				IE.jsx.str("div", {
					id: this.identListe.getNom(),
					class: "full-height",
				}),
			);
		} else {
			return IE.jsx.str(
				"div",
				{
					class: ["flex-contain", "flex-cols", "flex-gap"],
					style: "height:100%;",
				},
				lHtmlFiltres.join(""),
				IE.jsx.str(
					"div",
					{ class: ["flex-contain", "fluid-bloc"] },
					IE.jsx.str("div", { id: this.objetListeQuestions.getNom() }),
					IE.jsx.str(
						"div",
						{ class: "fluid-bloc" },
						IE.jsx.str(
							"table",
							{ class: "full-size" },
							IE.jsx.str(
								"tr",
								{ class: this.classVisuQuestion },
								IE.jsx.str(
									"td",
									{ class: "full-width" },
									IE.jsx.str("div", {
										id: this.idVisuQuestion,
										class: "Bordure MargeBas",
										style:
											"margin-right:" +
											(ObjetNavigateur_1.Navigateur.getLargeurBarreDeScroll
												? ObjetNavigateur_1.Navigateur.getLargeurBarreDeScroll()
												: 10) +
											"px; box-sizing: border-box;",
									}),
								),
							),
							IE.jsx.str(
								"tr",
								null,
								IE.jsx.str(
									"td",
									{ class: "full-size" },
									IE.jsx.str("div", {
										id: this.listeResultats.getNom(),
										class: "full-size",
									}),
								),
							),
						),
					),
				),
			);
		}
	}
	actualiserListe() {
		if (this.actualite === null || this.actualite === undefined) {
			return;
		}
		if (this.estUnSondage() && this.questionsSelectionnees.length === 1) {
			$("." + this.classVisuQuestion.escapeJQ()).show();
		} else {
			$("." + this.classVisuQuestion.escapeJQ()).hide();
		}
		this.avecSeparationNomPrenom = this._options.avecSeparationNomPrenom;
		if (
			this._options.avecSeparationNomPrenom &&
			this.actualite &&
			!!this.actualite.reponseAnonyme
		) {
			this.avecSeparationNomPrenom = false;
		}
		this.initialiserListeReponses(this.listeResultats);
		if (this.estUnSondage()) {
			const lHtml = [];
			lHtml.push(
				'<div ie-scrollv ie-scrollreservation style="max-height: 250px;"><div class="Espace">',
			);
			lHtml.push(
				this.moteur.composeComposanteInfoSondage({
					instance: this,
					actu: this.actualite,
					composante: this.question,
					indice: 0,
					avecLibelleQuestion: false,
					estAffEditionActualite: true,
				}),
			);
			lHtml.push("</div></div>");
			ObjetHtml_1.GHtml.setHtml(this.idVisuQuestion, lHtml.join(""), {
				controleur: this.controleur,
			});
		}
		this._visibiliteQuestions();
		if (!this.estUnSondage() && IE.estMobile) {
			const lListe = this._formatDonnees();
			const flatDonneesListe =
				new DonneesListe_ResultatsActualite_Mobile_1.DonneesListe_ResultatsActualite_Mobile(
					lListe,
				);
			this.identListe.setDonnees(flatDonneesListe);
		} else {
			this.listeResultats.setDonnees(
				new DonneesListe_ResultatsActualite_1.DonneesListe_ResultatsActualite(
					{
						donnees: this._formatDonnees(),
						pere: this,
						evenement: this.evenementMenuContextuelListe,
						genre: this.question.genreReponse,
						niveauMaxCumul: this.question.niveauMaxCumul,
						filtreRepondu: this.filtreRepondu,
						avecNombreReponses: this.avecNombreReponses,
						avecCommandeRenvoyerNotfication:
							this._avecCommandeRenvoyerNotfication(this.actualite),
						avecSeparationNomPrenom: this.avecSeparationNomPrenom,
					},
					{ genreReponse: this.utilitaires.genreReponse },
				),
			);
		}
	}
	_eventListeQuestions(aParametres) {
		if (
			aParametres.genreEvenement ===
			Enumere_EvenementListe_1.EGenreEvenementListe.Selection
		) {
			this.questionsSelectionnees =
				aParametres.instance.getTableauCellulesSelection();
			this.question = this.actualite.listeQuestions.getElementParNumero(
				aParametres.article.getNumero(),
			);
			this.actualiserListe();
		}
	}
	evenementMenuContextuelListe(aCommande, aElement) {
		var _a;
		if (
			aCommande ===
				DonneesListe_ResultatsActualite_1.DonneesListe_ResultatsActualite
					.genreCommande.graphique ||
			aCommande ===
				DonneesListe_ResultatsActualite_1.DonneesListe_ResultatsActualite
					.genreCommande.graphiqueTotal
		) {
			let lElement;
			if (
				aCommande ===
				DonneesListe_ResultatsActualite_1.DonneesListe_ResultatsActualite
					.genreCommande.graphique
			) {
				lElement = aElement;
			} else {
				lElement = new ObjetElement_1.ObjetElement();
				lElement.valeurCumul = [];
				lElement.nbRecue = 0;
				lElement.nbAttendue = 0;
				for (
					let i = 0;
					i < this.question.resultats.listeRepondant.count();
					i++
				) {
					const lEle = this.question.resultats.listeRepondant.get(i);
					if (lEle.estCumul && !lEle.pere) {
						lElement.nbAttendue += lEle.nbAttendue;
						lElement.nbRecue += lEle.nbRecue;
						for (let j = 0; j < lEle.valeurCumul.length; j++) {
							if (lElement.valeurCumul[j]) {
								lElement.valeurCumul[j] += lEle.valeurCumul[j];
							} else {
								lElement.valeurCumul[j] = lEle.valeurCumul[j];
							}
						}
					}
				}
			}
			const lNbColonnes =
				(this.utilitaires.genreReponse.estGenreChoixUnique(
					this.question.genreReponse,
				) ||
				this.utilitaires.genreReponse.estGenreChoixMultiple(
					this.question.genreReponse,
				)
					? this.question.listeChoix.count()
					: 1) + 1;
			const lLargeurColonne = Math.floor(100 / lNbColonnes) + "%";
			let lMaxAbscisse = lElement.nbAttendue;
			while (lMaxAbscisse % 5 !== 0 && (lMaxAbscisse / 5) % 5 !== 0) {
				lMaxAbscisse += 1;
			}
			const lHtmlBarres = [],
				lHtmlAbscisses = [];
			if (
				this.utilitaires.genreReponse.estGenreChoixUnique(
					this.question.genreReponse,
				) ||
				this.utilitaires.genreReponse.estGenreChoixMultiple(
					this.question.genreReponse,
				)
			) {
				for (let i = 0; i < this.question.listeChoix.count(); i++) {
					lHtmlAbscisses.push(
						'<div style="width:' +
							lLargeurColonne +
							';overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align:center;" class="Texte10 InlineBlock">' +
							this.question.listeChoix.get(i).getLibelle() +
							"</div>",
					);
					lHtmlBarres.push(
						'<div style="width:' +
							lLargeurColonne +
							';height:100%;position:relative;" class="Texte10 InlineBlock">',
						'<div class="objetResultatsActualiteBarreGraph" data-libelle="',
						this.question.listeChoix.get(i).getLibelle(),
						'" data-valeur="',
						lElement.valeurCumul[i + 1],
						'" data-hauteur="',
						Math.round((100 * lElement.valeurCumul[i + 1]) / lMaxAbscisse),
						'" style="position:absolute;left:10%;right:10%;bottom:0;height:',
						Math.round((100 * lElement.valeurCumul[i + 1]) / lMaxAbscisse),
						'%;background-color:#c8c8c8;"></div>',
						'<div style="position:absolute;left:10%;right:10%;bottom:',
						Math.round((100 * lElement.valeurCumul[i + 1]) / lMaxAbscisse) + 1,
						'%;text-align:center;">',
						lElement.valeurCumul[i + 1],
						"</div>",
						"</div>",
					);
				}
			} else {
				lHtmlAbscisses.push(
					'<div style="width:' +
						lLargeurColonne +
						';overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align:center;" class="Texte10 InlineBlock">' +
						ObjetTraduction_1.GTraductions.getValeur(
							"actualites.Edition.ColonneRepondu",
						) +
						"</div>",
				);
				lHtmlBarres.push(
					'<div style="width:' +
						lLargeurColonne +
						';height:100%;position:relative;" class="Texte10 InlineBlock">',
					'<div class="objetResultatsActualiteBarreGraph" data-libelle="',
					ObjetTraduction_1.GTraductions.getValeur(
						"actualites.Edition.ColonneRepondu",
					),
					'" data-valeur="',
					lElement.nbRecue,
					'" data-hauteur="',
					Math.round((100 * lElement.nbRecue) / lMaxAbscisse),
					'" style="position:absolute;left:10%;right:10%;bottom:0;height:',
					Math.round((100 * lElement.nbRecue) / lMaxAbscisse),
					'%;background-color:#c8c8c8;"></div>',
					'<div style="position:absolute;left:10%;right:10%;bottom:',
					Math.round((100 * lElement.nbRecue) / lMaxAbscisse) + 1,
					'%;text-align:center;">',
					lElement.nbRecue,
					"</div>",
					"</div>",
				);
			}
			lHtmlAbscisses.push(
				'<div style="width:' +
					lLargeurColonne +
					';overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align:center;" class="Texte10 InlineBlock">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"actualites.Edition.ColonneNonRepondu",
					) +
					"</div>",
			);
			lHtmlBarres.push(
				'<div style="width:' +
					lLargeurColonne +
					';height:100%;position:relative;" class="Texte10 InlineBlock">',
				'<div class="objetResultatsActualiteBarreGraph" data-libelle="',
				ObjetTraduction_1.GTraductions.getValeur(
					"actualites.Edition.ColonneNonRepondu",
				),
				'" data-valeur="',
				lElement.nbAttendue - lElement.nbRecue,
				'" data-hauteur="',
				Math.round(
					(100 * (lElement.nbAttendue - lElement.nbRecue)) / lMaxAbscisse,
				),
				'" style="position:absolute;left:10%;right:10%;bottom:0;height:',
				Math.round(
					(100 * (lElement.nbAttendue - lElement.nbRecue)) / lMaxAbscisse,
				),
				'%;background-color:#c8c8c8;"></div>',
				'<div style="position:absolute;left:10%;right:10%;bottom:',
				Math.round(
					(100 * (lElement.nbAttendue - lElement.nbRecue)) / lMaxAbscisse,
				) + 1,
				'%;text-align:center;">',
				lElement.nbAttendue - lElement.nbRecue,
				"</div>",
				"</div>",
			);
			const lHtml = [
				'<div style="position:relative;width:100%;height:95%;margin-top:5%;">',
				'<div style="position:absolute;top:0;left:20px;right:0;bottom:20px;background-color:#fff;">',
				'<div style="position:absolute;top:0;left:0;right:0;height:20%;border-top:#000 1px dashed;"></div>',
				'<div style="position:absolute;top:20%;left:0;right:0;height:20%;border-top:#000 1px dashed;"></div>',
				'<div style="position:absolute;top:40%;left:0;right:0;height:20%;border-top:#000 1px dashed;"></div>',
				'<div style="position:absolute;top:60%;left:0;right:0;height:20%;border-top:#000 1px dashed;"></div>',
				'<div style="position:absolute;top:80%;left:0;right:0;height:20%;border-top:#000 1px dashed;"></div>',
				lHtmlBarres.join(""),
				"</div>",
				'<div class="Texte10" style="position:absolute;top:0;left:0;width:19px;border-right:#000 1px solid;bottom:20px;">',
				'<div style="position:absolute;top:0;right:1px;text-align:right;"><div style="position:relative;top:-5px;">',
				lMaxAbscisse,
				"</div></div>",
				'<div style="position:absolute;top:20%;right:1px;text-align:right;"><div style="position:relative;top:-5px;">',
				lMaxAbscisse * 0.8,
				"</div></div>",
				'<div style="position:absolute;top:40%;right:1px;text-align:right;"><div style="position:relative;top:-5px;">',
				lMaxAbscisse * 0.6,
				"</div></div>",
				'<div style="position:absolute;top:60%;right:1px;text-align:right;"><div style="position:relative;top:-5px;">',
				lMaxAbscisse * 0.4,
				"</div></div>",
				'<div style="position:absolute;top:80%;right:1px;text-align:right;"><div style="position:relative;top:-5px;">',
				lMaxAbscisse * 0.2,
				"</div></div>",
				'<div style="position:absolute;top:100%;right:1px;text-align:right;"><div style="position:relative;top:-5px;">',
				lMaxAbscisse * 0,
				"</div></div>",
				"</div>",
				'<div style="position:absolute;height:19px;border-top:#000 1px solid;left:20px;right:0;bottom:0;">',
				lHtmlAbscisses.join(""),
				"</div>",
				"</div>",
			];
			if (
				(_a = this.objetFenetreGraph) === null || _a === void 0
					? void 0
					: _a.EnAffichage
			) {
				this.objetFenetreGraph.fermer();
			}
			this.objetFenetreGraph = new ObjetFenetre_1.ObjetFenetre({
				pere: this,
			}).initAfficher({
				options: {
					modale: true,
					hauteur: 400,
					hauteurMin: 400,
					largeur: 400,
					largeurMin: 400,
					listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
					avecRetaillage: true,
				},
				surFermeture: () => {
					delete this.objetFenetreGraph;
				},
			});
			this.objetFenetreGraph.afficher(lHtml.join(""));
			$(".objetResultatsActualiteBarreGraph")
				.height("0%")
				.on("mousemove", function () {
					ObjetHint_1.ObjetHint.start(
						"<strong>" +
							$(this).attr("data-libelle") +
							"</strong><br />" +
							$(this).attr("data-valeur"),
						{ sansDelai: true },
					);
					$(this).css({ border: "#000 1px solid", borderBottom: "0px" });
				})
				.on("mouseleave", function () {
					ObjetHint_1.ObjetHint.stop();
					$(this).css({ border: "0px" });
				})
				.each(function () {
					$(this)
						.delay(250)
						.animate({ height: $(this).attr("data-hauteur") + "%" }, 250);
				});
			let lTitreFenetre;
			if (
				aCommande ===
				DonneesListe_ResultatsActualite_1.DonneesListe_ResultatsActualite
					.genreCommande.graphique
			) {
				lTitreFenetre = ObjetTraduction_1.GTraductions.getValeur(
					"actualites.Edition.TitreGrapheCumul",
					[lElement.getLibelle()],
				);
			} else {
				lTitreFenetre = ObjetTraduction_1.GTraductions.getValeur(
					"actualites.Edition.TitreGrapheTotal",
				);
			}
			this.objetFenetreGraph.setOptionsFenetre({ titre: lTitreFenetre });
		} else if (
			aCommande ===
			DonneesListe_ResultatsActualite_1.DonneesListe_ResultatsActualite
				.genreCommande.renvoyerNotification
		) {
			this.callback.appel(TypeEvenementCallback.RenvoyerNotification, {
				actualite: this.actualite,
				participantSelectionne: aElement,
			});
		}
	}
	_getIndiceDeQuestionsConcernees(aActualite, aQuestionRecherchee) {
		let lIndiceTrouve = -1;
		const lListeQuestionsConcernees =
			this._getListeQuestionsConcernees(aActualite);
		if (lListeQuestionsConcernees) {
			lIndiceTrouve =
				lListeQuestionsConcernees.getIndiceParElement(aQuestionRecherchee);
		}
		return lIndiceTrouve;
	}
	_getListeQuestionsConcernees(aActualite) {
		let lListeQuestions = new ObjetListeElements_1.ObjetListeElements();
		if (!!aActualite && !!aActualite.listeQuestions) {
			lListeQuestions = aActualite.listeQuestions.getListeElements((D) => {
				if (this.utilitaires.genreReponse.estGenreSansReponse(D.genreReponse)) {
					return false;
				}
				return true;
			});
		}
		return lListeQuestions;
	}
	_visibiliteQuestions() {
		const lListeQuestionsActu = this._getListeQuestionsConcernees(
			this.actualite,
		);
		if (lListeQuestionsActu.getNbrElementsExistes() > 1) {
			$("#" + this.objetListeQuestions.getNom().escapeJQ()).show();
			this.objetListeQuestions.actualiser(true);
		} else {
			$("#" + this.objetListeQuestions.getNom().escapeJQ()).hide();
		}
	}
	_miseAJourLibelleAnonyme() {
		let lLibelle = "";
		if (this.estUnSondage()) {
			lLibelle = this.actualite.reponseAnonyme
				? ObjetTraduction_1.GTraductions.getValeur("actualites.InfoAnonyme")
				: ObjetTraduction_1.GTraductions.getValeur("actualites.InfoNominatif");
		}
		ObjetHtml_1.GHtml.setHtml(this.idLibelleAnonyme, lLibelle);
		if (this.estUnSondage()) {
			$("#" + this.idLibelleAnonyme.escapeJQ()).show();
		} else {
			$("#" + this.idLibelleAnonyme.escapeJQ()).hide();
		}
	}
	_avecColonneClasse() {
		let lAvecClasse = false;
		if (!this.estUnSondageAnonyme()) {
			if (
				this.questionsSelectionnees &&
				this.questionsSelectionnees.length > 0
			) {
				for (let i = 0; i < this.questionsSelectionnees.length; i++) {
					const lQuestion = this.questionsSelectionnees[i];
					if (
						!!lQuestion.article &&
						!!lQuestion.article.resultats &&
						!!lQuestion.article.resultats.listeRepondant
					) {
						lQuestion.article.resultats.listeRepondant.parcourir(
							(aRepondant) => {
								if (
									!!aRepondant.libelleClasse &&
									aRepondant.libelleClasse !== ""
								) {
									lAvecClasse = true;
								}
							},
						);
					}
				}
			}
		}
		return lAvecClasse;
	}
	_formatDonnees() {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		if (this.questionsSelectionnees.length === 0) {
			return lListe;
		}
		for (let i = 0; i < this.questionsSelectionnees.length; i++) {
			const lQuestion = this.questionsSelectionnees[i];
			if (!!lQuestion && !!lQuestion.article.resultats) {
				lQuestion.article.resultats.listeRepondant.parcourir((aRepondant) => {
					const lReponse = new ObjetElement_1.ObjetElement(
						lQuestion.article.getLibelle(),
						lQuestion.article.getNumero(),
						lQuestion.article.genreReponse,
					);
					lReponse.nbRecue = aRepondant.nbRecue;
					lReponse.nbAttendue = aRepondant.nbAttendue;
					lReponse.pourcentageRecue = aRepondant.pourcentageRecue;
					lReponse.texteReponse = aRepondant.texteReponse;
					lReponse.repondu = aRepondant.repondu;
					lReponse.domaineReponse = aRepondant.domaineReponse;
					lReponse.valeurCumul = aRepondant.valeurCumul;
					lReponse.percentCumul = aRepondant.percentCumul;
					const lElement = lListe.get(
						lListe.getIndiceElementParFiltre((aElement) => {
							return (
								aElement.NumeroArticleLigne === aRepondant.NumeroArticleLigne
							);
						}),
					);
					if (!!lElement) {
						lElement.listeReponses.add(lReponse);
					} else {
						aRepondant.listeReponses =
							new ObjetListeElements_1.ObjetListeElements();
						aRepondant.listeReponses.add(lReponse);
						lListe.add(aRepondant);
					}
				});
			}
		}
		return lListe;
	}
	_avecCommandeRenvoyerNotfication(aActualite) {
		return (
			!IE.estMobile &&
			this._options.avecNotificationRelance &&
			aActualite.nbIndividusSansReponses > 0 &&
			aActualite.pourcentRepondu < 100 &&
			aActualite.publie &&
			(ObjetDate_1.GDate.estAvantJourCourant(aActualite.dateDebut) ||
				ObjetDate_1.GDate.estJourCourant(aActualite.dateDebut)) &&
			!ObjetDate_1.GDate.estAvantJourCourant(aActualite.dateFin)
		);
	}
}
exports.ObjetResultatsActualite = ObjetResultatsActualite;
