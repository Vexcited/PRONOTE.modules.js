exports.InterfaceContenuCahierDeTextes = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const TinyInit_1 = require("TinyInit");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetPosition_1 = require("ObjetPosition");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const _InterfaceContenuEtTAFCahierDeTextes_1 = require("_InterfaceContenuEtTAFCahierDeTextes");
const Enumere_ElementCDT_1 = require("Enumere_ElementCDT");
const TypeOrigineCreationCategorieCahierDeTexte_1 = require("TypeOrigineCreationCategorieCahierDeTexte");
const EGenreEvenementContenuCahierDeTextes_1 = require("EGenreEvenementContenuCahierDeTextes");
const UtilitaireSaisieCDT_1 = require("UtilitaireSaisieCDT");
const ObjetCelluleMultiSelectionThemes_1 = require("ObjetCelluleMultiSelectionThemes");
const ObjetListeElements_1 = require("ObjetListeElements");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_ParamExecutionQCM_1 = require("ObjetFenetre_ParamExecutionQCM");
class InterfaceContenuCahierDeTextes extends _InterfaceContenuEtTAFCahierDeTextes_1._InterfaceContenuEtTAFCahierDeTextes {
	constructor(...aParams) {
		super(...aParams);
		this.idZone = this.Nom + "_Zone";
		this.genre = Enumere_ElementCDT_1.EGenreElementCDT.Contenu;
		this.paramsAffichage = {
			pourProgression: false,
			avecBoutonEditeurHtml: true,
			height: ["75", "250"],
			position: [false, undefined],
			min_height: [75, 250],
			max_height: [200, 400],
		};
	}
	getTAFContenu() {
		return this.contenu;
	}
	estAvecAffichageComboParcoursEducatif() {
		return this.avecParcoursEducatifs && !this.paramsAffichage.pourProgression;
	}
	construireInstances() {
		super.construireInstances();
		this.identCombo = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this.evenementCombo,
			this.initialiserCombo,
		);
		if (this.estAvecAffichageComboParcoursEducatif()) {
			this.identCmbParcoursEducatifs = this.add(
				ObjetSaisie_1.ObjetSaisie,
				this.evenementCmbParcoursEducatifs,
				this.initialiserCmbParcoursEducatifs,
			);
		}
		if (this.applicationSco.parametresUtilisateur.get("avecGestionDesThemes")) {
			this.identMultiSelectionTheme = this.add(
				ObjetCelluleMultiSelectionThemes_1.ObjetCelluleMultiSelectionThemes,
				this._evtCellMultiSelectionTheme.bind(this),
			);
		}
		if (this.avecBoutonQCM()) {
			this.identMenuContextExoQCM = this.add(
				ObjetMenuContextuel_1.ObjetMenuContextuel,
				this.evntMenuContextExoQCM,
				this.initMenuContextExoQCM,
			);
		}
	}
	avecBoutonEditeurHTML() {
		return (
			this.paramsAffichage.avecBoutonEditeurHtml &&
			!this.paramsAffichage.pourProgression
		);
	}
	evenementSurBoutonHTML() {
		this.callback.appel(
			EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.fenetreEditeurHTML,
			this.contenu,
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnMagique: {
				event() {
					ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
						pere: aInstance,
						evenement: function (aLigne) {
							if (aLigne) {
								aInstance.callback.appel(aLigne.getNumero(), aInstance.contenu);
							}
						},
						initCommandes: function (aInstanceMenu) {
							if (aInstance.cahierDeTexteVerrouille) {
								return;
							}
							if (aInstance.contenu.estVide) {
								if (
									!aInstance.optionsMenuMagique
										.uniquementSupprimerSurContenuVide
								) {
									aInstanceMenu.addCommande(
										EGenreEvenementContenuCahierDeTextes_1
											.EGenreEvenementContenuCahierDeTextes
											.poursuivreCoursPrecedent,
										ObjetTraduction_1.GTraductions.getValeur(
											"CahierDeTexte.PoursuivreCoursPrecedent",
										),
										!!aInstance.optionsMenuMagique.avecContenuPrecedent,
									);
									aInstanceMenu.addCommande(
										EGenreEvenementContenuCahierDeTextes_1
											.EGenreEvenementContenuCahierDeTextes
											.poursuivreProgression,
										ObjetTraduction_1.GTraductions.getValeur(
											"CahierDeTexte.PoursuivreProgression",
										),
										!!aInstance.optionsMenuMagique.avecPoursuireProgression,
									);
									aInstanceMenu.addCommande(
										EGenreEvenementContenuCahierDeTextes_1
											.EGenreEvenementContenuCahierDeTextes
											.affecterProgressionAuCdT,
										ObjetTraduction_1.GTraductions.getValeur(
											"CahierDeTexte.AffecterContenuProgression",
										),
									);
									if (
										!aInstance.optionsMenuMagique.existeDevoirEtEvalDansCDT[
											TypeOrigineCreationCategorieCahierDeTexte_1
												.TypeOrigineCreationCategorieCahierDeTexte
												.OCCCDT_Pre_Devoir
										]
									) {
										aInstanceMenu.addCommande(
											EGenreEvenementContenuCahierDeTextes_1
												.EGenreEvenementContenuCahierDeTextes.saisieDS,
											ObjetTraduction_1.GTraductions.getValeur(
												"CahierDeTexte.ProgrammerDS",
											),
										).image =
											TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexteUtil.getImage(
												TypeOrigineCreationCategorieCahierDeTexte_1
													.TypeOrigineCreationCategorieCahierDeTexte
													.OCCCDT_Pre_Devoir,
											);
									}
									if (
										!aInstance.optionsMenuMagique.existeDevoirEtEvalDansCDT[
											TypeOrigineCreationCategorieCahierDeTexte_1
												.TypeOrigineCreationCategorieCahierDeTexte
												.OCCCDT_Pre_Evaluation
										]
									) {
										aInstanceMenu.addCommande(
											EGenreEvenementContenuCahierDeTextes_1
												.EGenreEvenementContenuCahierDeTextes.saisieEval,
											ObjetTraduction_1.GTraductions.getValeur(
												"CahierDeTexte.ProgrammerEval",
											),
										).image =
											TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexteUtil.getImage(
												TypeOrigineCreationCategorieCahierDeTexte_1
													.TypeOrigineCreationCategorieCahierDeTexte
													.OCCCDT_Pre_Evaluation,
											);
									}
								}
								if (
									(!aInstance.paramsAffichage.pourProgression &&
										!aInstance.cahierDeTexteVerrouille &&
										aInstance.contenu &&
										!aInstance.contenu.estVide) ||
									aInstance.optionsMenuMagique.uniquementSupprimerSurContenuVide
								) {
									aInstanceMenu.addSeparateur();
									aInstanceMenu.addCommande(
										EGenreEvenementContenuCahierDeTextes_1
											.EGenreEvenementContenuCahierDeTextes.supprimer,
										ObjetTraduction_1.GTraductions.getValeur(
											"CahierDeTexte.commands.supprimerContenu",
										),
									);
								}
							} else {
								const lEstDevoir =
										aInstance.contenu &&
										!aInstance.contenu.estVide &&
										aInstance.contenu.categorie.getGenre() ===
											TypeOrigineCreationCategorieCahierDeTexte_1
												.TypeOrigineCreationCategorieCahierDeTexte
												.OCCCDT_Pre_Devoir,
									lEstEvaluation =
										aInstance.contenu &&
										!aInstance.contenu.estVide &&
										aInstance.contenu.categorie.getGenre() ===
											TypeOrigineCreationCategorieCahierDeTexte_1
												.TypeOrigineCreationCategorieCahierDeTexte
												.OCCCDT_Pre_Evaluation;
								if (lEstDevoir) {
									aInstanceMenu.addCommande(
										EGenreEvenementContenuCahierDeTextes_1
											.EGenreEvenementContenuCahierDeTextes.saisieDS,
										ObjetTraduction_1.GTraductions.getValeur(
											"CahierDeTexte.ModifierDS",
										),
									);
								}
								if (lEstEvaluation) {
									aInstanceMenu.addCommande(
										EGenreEvenementContenuCahierDeTextes_1
											.EGenreEvenementContenuCahierDeTextes.saisieEval,
										ObjetTraduction_1.GTraductions.getValeur(
											"CahierDeTexte.ModifierEval",
										),
									);
								}
								let lLibelleCommandeSupprimer =
									ObjetTraduction_1.GTraductions.getValeur(
										"CahierDeTexte.commands.supprimerContenu",
									);
								if (lEstDevoir) {
									lLibelleCommandeSupprimer =
										ObjetTraduction_1.GTraductions.getValeur(
											"CahierDeTexte.SupprimerDS",
										);
								} else if (lEstEvaluation) {
									lLibelleCommandeSupprimer =
										ObjetTraduction_1.GTraductions.getValeur(
											"CahierDeTexte.SupprimerEval",
										);
								}
								aInstanceMenu.addCommande(
									EGenreEvenementContenuCahierDeTextes_1
										.EGenreEvenementContenuCahierDeTextes.supprimer,
									lLibelleCommandeSupprimer,
								);
							}
						},
					});
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.HintBtnCrayonMagique",
					);
				},
				getDisabled() {
					return aInstance.cahierDeTexteVerrouille;
				},
			},
			btnCategorie: {
				event() {
					aInstance.callback.appel(
						EGenreEvenementContenuCahierDeTextes_1
							.EGenreEvenementContenuCahierDeTextes.fenetreCategorie,
						aInstance.contenu,
					);
				},
				getDisplayBtnCategorie() {
					return (
						!aInstance.cahierDeTexteVerrouille &&
						aInstance.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.cahierDeTexte
								.creerCategoriesDeCahierDeTexte,
						)
					);
				},
			},
			btnSupprimerContenu: {
				event() {
					aInstance.callback.appel(
						EGenreEvenementContenuCahierDeTextes_1
							.EGenreEvenementContenuCahierDeTextes.supprimer,
						aInstance.contenu,
					);
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.commands.supprimerContenu",
					);
				},
				getDisabled() {
					return !!aInstance.cahierDeTexteVerrouille;
				},
				getDisplay() {
					return !aInstance.paramsAffichage.pourProgression;
				},
			},
			btnParametrerQCM: {
				event(aNumeroExecutionQCM) {
					let lExecutionQCMConcerne;
					if (aInstance.contenu && aInstance.contenu.listeExecutionQCM) {
						lExecutionQCMConcerne =
							aInstance.contenu.listeExecutionQCM.getElementParNumero(
								aNumeroExecutionQCM,
							);
					}
					if (lExecutionQCMConcerne) {
						aInstance.indiceExecQCMDeContenu =
							aInstance.contenu.listeExecutionQCM.getIndiceParElement(
								lExecutionQCMConcerne,
							);
						if (
							lExecutionQCMConcerne.getEtat() ===
							Enumere_Etat_1.EGenreEtat.Creation
						) {
							lExecutionQCMConcerne.cours = aInstance.cours;
							lExecutionQCMConcerne.numeroSemaine = aInstance.numeroSemaine;
						}
						aInstance.ouvrirFenetreParamExecutionQCM(
							aInstance,
							(aNumeroBouton, aExecutionQCM) => {
								aInstance.contenu.listeExecutionQCM.addElement(
									aExecutionQCM,
									aInstance.indiceExecQCMDeContenu,
								);
								if (aNumeroBouton > 0) {
									$(
										"#" +
											aInstance
												.getIdResumeModalite(aInstance.indiceExecQCMDeContenu)
												.escapeJQ(),
									).text(
										UtilitaireQCM_1.UtilitaireQCM.getStrResumeModalites(
											aExecutionQCM,
										),
									);
									aInstance.contenu.listeExecutionQCM
										.get(aInstance.indiceExecQCMDeContenu)
										.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
									aInstance.contenu.setEtat(
										Enumere_Etat_1.EGenreEtat.Modification,
									);
									aInstance.setEtatSaisie(true);
								}
							},
							{
								titre: ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.ParametresExeQCMTAF",
								),
							},
							{
								afficherModeQuestionnaire: false,
								afficherRessentiEleve: false,
								autoriserSansCorrige: false,
								autoriserCorrigerALaDate: false,
								executionQCM: lExecutionQCMConcerne,
								avecConsigne: true,
								avecPersonnalisationProjetAccompagnement: true,
								avecModeCorrigeALaDate: true,
								avecMultipleExecutions: true,
							},
						);
					}
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.ParametresExeQCMTAF",
					);
				},
				getDisabled() {
					return !!aInstance.cahierDeTexteVerrouille;
				},
			},
		});
	}
	ouvrirFenetreParamExecutionQCM(aPere, aEvenement, aOptionsFenetre, aDonnees) {
		const lOptionsFenetre = $.extend(
			{
				listeBoutons: [
					ObjetTraduction_1.GTraductions.getValeur("Annuler"),
					ObjetTraduction_1.GTraductions.getValeur("Valider"),
				],
			},
			aOptionsFenetre,
		);
		if (!IE.estMobile) {
			lOptionsFenetre.largeur = 540;
		}
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_ParamExecutionQCM_1.ObjetFenetre_ParamExecutionQCM,
			{ pere: aPere, evenement: aEvenement },
			lOptionsFenetre,
		);
		lFenetre.setDonnees(
			$.extend(aDonnees, { afficherEnModeForm: IE.estMobile }),
		);
	}
	initMenuContextExoQCM(aInstance) {
		aInstance.addCommande(
			EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.suppressionQCM,
			ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
		);
	}
	initialiserCombo(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 160,
			hauteur: 19,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.comboCategorie",
			),
			nbrLignes: 5,
			celluleAvecTexteHtml: true,
		});
	}
	initialiserCmbParcoursEducatifs(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 140,
			hauteur: 19,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.ParcoursEducatifs",
			),
			nbrLignes: 5,
			celluleAvecTexteHtml: true,
		});
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(`<div class="edition-edt-conteneur" id="${this.idZone}">`);
		H.push('<div class="flex-contain">');
		if (!this.paramsAffichage.pourProgression) {
			H.push(
				'<div class="select-contain fix-bloc progression">',
				UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnCrayonMagique(
					"btnMagique",
				),
				"</div>",
			);
		}
		H.push(
			`<div class="select-contain fluid-bloc">\n            <div class="field-contain titre">\n              <label class="m-bottom" for="${this.IdPremierElement}">${ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.titre")}</label>\n              <input class="round-style" style="width:100%;" id="${this.IdPremierElement}" onkeyup="${this.Nom}.evenementSurTitre (this)" onchange="${this.Nom}.evenementSurTitre (this)" />\n            </div>\n\n            <div class="field-contain">\n              <label class="m-bottom">${ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.categorie")}</label>\n              <div class="flex-contain flex-center">\n                <div id="${this.getInstance(this.identCombo).getNom()}" oncontextmenu="GNavigateur.stopperEvenement (event); return false;" class="m-right"></div>\n                <ie-bouton ie-model="btnCategorie" ie-display="getDisplayBtnCategorie" title="${ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.infoCategorie")}" oncontextmenu="GNavigateur.stopperEvenement (event); return false;">...</ie-bouton>\n              </div>\n            </div>`,
		);
		if (this.identMultiSelectionTheme) {
			H.push(
				`<div class="field-contain themes">\n                <label class="m-bottom">${ObjetTraduction_1.GTraductions.getValeur("Themes")}</label>\n                <div id="${this.getInstance(this.identMultiSelectionTheme).getNom()}"></div>\n              </div>`,
			);
		}
		if (this.estAvecAffichageComboParcoursEducatif()) {
			H.push(
				`<div class="field-contain">\n                <label class="m-bottom">${ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.ParcoursEducatifs")}</label>\n                <div id="${this.getInstance(this.identCmbParcoursEducatifs).getNom()}" oncontextmenu="GNavigateur.stopperEvenement (event); return false;"></div>\n              </div>`,
			);
		}
		H.push(
			'<div class="field-contain only-icon" ie-if="btnSupprimerContenu.getDisplay">',
			UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnSupprimer(
				"btnSupprimerContenu",
			),
			"</div>",
		);
		H.push("</div>", "</div>");
		H.push(
			`<div class="tiny-contain">\n             <div class="bt-link-contain">${this.construireBoutonsLiens()}</div>\n             <div class="editeur-contain">${this.construireEditeur()}</div>\n           </div>`,
		);
		H.push(`<div class="btn-contain m-y-l m-left-xxl">\n            <div class="p-left" id="${this.idDocsJoints}"></div>\n            ${this.paramsAffichage.avecExosQCM ? `<div class="p-left p-top" id="${this.Nom}_QCM"></div> ` : ""}
          </div>`);
		H.push("</div>");
		return H.join("");
	}
	parcoursEducatifNonAttribue() {
		const lContenu = this.contenu;
		return (
			lContenu.parcoursEducatif === undefined ||
			lContenu.parcoursEducatif === null ||
			lContenu.parcoursEducatif === -1
		);
	}
	evenementSurTitre(aInput) {
		const lTitre = ObjetHtml_1.GHtml.getValue(aInput);
		if (lTitre === this.contenu.getLibelle()) {
			return;
		}
		if (
			!lTitre &&
			(this.paramsAffichage.pourProgression ||
				!this.parcoursEducatifNonAttribue())
		) {
			let lMessageTitre, lMessageContent;
			if (this.parcoursEducatifNonAttribue()) {
				lMessageTitre = null;
				lMessageContent = ObjetTraduction_1.GTraductions.getValeur(
					"progression.LibelleNonVide",
				);
			} else {
				lMessageTitre = ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.message.ParcoursEducatifsImpossible",
				);
				lMessageContent = ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.message.TitreContenuObligatoire",
				);
				ObjetHtml_1.GHtml.setValue(aInput, this.contenu.getLibelle());
			}
			const lThis = this;
			GApplication.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				titre: lMessageTitre,
				message: lMessageContent,
				callback: function () {
					lThis._surEditionTitreApresConfirmation(
						aInput,
						lThis.contenu.getLibelle(),
					);
				},
			});
		} else {
			this._surEditionTitreApresConfirmation(aInput, lTitre);
		}
	}
	_surEditionTitreApresConfirmation(aInput, aTitre) {
		this.contenu.setLibelle(aTitre);
		if (aTitre !== ObjetHtml_1.GHtml.getValue(aInput)) {
			ObjetHtml_1.GHtml.setValue(aInput, aTitre);
			ObjetHtml_1.GHtml.setFocusEdit(aInput);
		}
		if (this.contenu.Numero === null || this.contenu.Numero === undefined) {
			this.contenu.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		} else {
			this.contenu.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
		this.callback.appel(
			EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.editionTitre,
			this.contenu,
		);
	}
	evenementCombo(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection:
				if (
					this.contenu.categorie.getNumero() !== aParams.element.getNumero()
				) {
					this.contenu.categorie.setNumero(aParams.element.getNumero());
					this.contenu.categorie.setLibelle(aParams.element.getLibelle());
					this.contenu.categorie.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
					this.contenu.categorie.genreLienDS = aParams.element.genreLienDS;
					if (
						this.contenu.Numero === null ||
						this.contenu.Numero === undefined
					) {
						this.contenu.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
					} else {
						this.contenu.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
					this.callback.appel(
						EGenreEvenementContenuCahierDeTextes_1
							.EGenreEvenementContenuCahierDeTextes.editionCategorie,
						this.contenu,
					);
				}
				break;
			case Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
				.deploiement: {
				const lParent = ObjetHtml_1.GHtml.getElement(
					this.Pere.getNom() + "_Contenus",
				);
				if (lParent) {
					const lElement = ObjetHtml_1.GHtml.getElement(this.Nom);
					const scroll =
						lElement.offsetTop +
						lElement.clientHeight / 2 -
						(lParent.clientHeight - 45) / 2;
					lParent.scrollTop = scroll;
				}
				break;
			}
		}
	}
	evenementCmbParcoursEducatifs(aParams) {
		const lContenu = this.contenu;
		switch (aParams.genreEvenement) {
			case Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection:
				if (lContenu.parcoursEducatif !== aParams.element.getGenre()) {
					if (
						lContenu.getLibelle() === "" &&
						aParams.element.getGenre() !== -1
					) {
						GApplication.getMessage().afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.message.ParcoursEducatifsImpossible",
							),
							message: ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.message.TitreContenuObligatoire",
							),
						});
						this.getInstance(
							this.identCmbParcoursEducatifs,
						).initSelectionParNumeroEtGenre(0, lContenu.parcoursEducatif);
					} else if (
						!this.etatUtilisateur.estEligibleParcours &&
						this.getInstance(
							this.identCmbParcoursEducatifs,
						).estUneInteractionUtilisateur()
					) {
						GApplication.getMessage().afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.message.ParcoursEducatifsImpossible",
							),
							message: ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.message.TitrePublicObligatoire",
							),
						});
						this.getInstance(
							this.identCmbParcoursEducatifs,
						).initSelectionParNumeroEtGenre(0, lContenu.parcoursEducatif);
					} else {
						lContenu.parcoursEducatif = aParams.element.getGenre();
						if (lContenu.Numero === null || lContenu.Numero === undefined) {
							lContenu.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
						} else {
							lContenu.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						}
						if (
							this.getInstance(
								this.identCmbParcoursEducatifs,
							).estUneInteractionUtilisateur()
						) {
							this.callback.appel(
								EGenreEvenementContenuCahierDeTextes_1
									.EGenreEvenementContenuCahierDeTextes.editionParcoursEducatif,
								lContenu,
							);
						}
					}
				}
				break;
		}
	}
	evntMenuContextExoQCM() {
		const lContenu = this.contenu;
		const lElt = lContenu.listeExecutionQCM.get(this.indiceExecQCMDeContenu);
		lElt.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
		lContenu.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		if (
			lContenu.getLibelle() === "" &&
			lContenu.descriptif === "" &&
			lContenu.categorie.getLibelle() === "" &&
			!lContenu.ListeThemes.getNbrElementsExistes() &&
			lContenu.ListePieceJointe.getNbrElementsExistes() &&
			lContenu.listeExecutionQCM.getNbrElementsExistes()
		) {
			lContenu.estVide = true;
		}
		this.setEtatSaisie(true);
		this._actualiserTrainingQCM();
	}
	avecBoutonQCM() {
		return !this.paramsAffichage.pourProgression;
	}
	evntSurBtnQCM() {
		this.callback.appel(
			EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.ajoutQCM,
			this.contenu,
		);
	}
	actualiserContenu(
		aContenu,
		aVerrouille,
		aAvecDocJoint,
		aPleinEcran,
		aOptionsMenuMagique,
	) {
		this.contenu = aContenu;
		this.cahierDeTexteVerrouille = aVerrouille || false;
		this.optionsMenuMagique = aOptionsMenuMagique || {};
		this.avecDocumentJoint = aAvecDocJoint;
		if (this.pleinEcran !== aPleinEcran) {
			this.pleinEcran = aPleinEcran;
			this.recupererDonnees();
		}
		const lListeCategories = MethodesObjet_1.MethodesObjet.dupliquer(
			this.Pere.listeCategories,
		);
		lListeCategories.trier();
		lListeCategories.parcourir((D) => {
			const lImage =
				TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexteUtil.getImage(
					D.getGenre(),
				);
			if (lImage) {
				D.libelleHtml =
					'<div class="flex-contain flex-center full-width">' +
					'<div class="fluid-bloc" ie-ellipsis>' +
					ObjetChaine_1.GChaine.insecable(D.getLibelle()) +
					"</div>" +
					'<div class="fix-bloc m-x ' +
					lImage +
					'"></div>' +
					"</div>";
			}
			if (D.getNumero() === 0) {
				D.setLibelle(ObjetTraduction_1.GTraductions.getValeur("Aucune"));
			}
		});
		this.getInstance(this.identCombo).setDonnees(lListeCategories);
		if (this.estAvecAffichageComboParcoursEducatif()) {
			const lIndiceParcoursEducatif =
				this.listeParcoursEducatifs.getIndiceElementParFiltre((aElement) => {
					return aElement.getGenre() === this.contenu.parcoursEducatif;
				});
			this.getInstance(this.identCmbParcoursEducatifs).setDonnees(
				this.listeParcoursEducatifs,
				lIndiceParcoursEducatif,
			);
		}
		this._actualiserCahierDeTextesContenu();
		this._actualiserDocumentsJoints();
		this._actualiserTrainingQCM();
	}
	_setDescriptif(aHtml, aAvecCallBack) {
		if (
			this.contenu &&
			!ObjetChaine_1.GChaine.estChaineHTMLEgal(
				aHtml,
				this.contenu.descriptif,
			) &&
			!this.cahierDeTexteVerrouille
		) {
			if (this.contenu.Numero === null || this.contenu.Numero === undefined) {
				this.contenu.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			} else {
				this.contenu.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			}
			const lDescriptif = aHtml;
			if (GNavigateur.withContentEditable) {
				this.contenu.descriptif = TinyInit_1.TinyInit.estContenuVide(
					lDescriptif,
				)
					? ""
					: lDescriptif;
			} else {
				this.contenu.descriptif = lDescriptif;
			}
			this.contenu.estVide =
				UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.estContenuVide(this.contenu);
			if (aAvecCallBack) {
				this.callback.appel(
					EGenreEvenementContenuCahierDeTextes_1
						.EGenreEvenementContenuCahierDeTextes.editionDescriptif,
					this.contenu,
				);
			} else {
				this.Pere.setEtatSaisie(true);
			}
		}
	}
	_actualiserCahierDeTextesContenu() {
		this.getInstance(this.identCombo).setSelectionParNumeroEtGenre(
			this.contenu.categorie.getNumero() || 0,
		);
		if (this.estAvecAffichageComboParcoursEducatif()) {
			this.getInstance(
				this.identCmbParcoursEducatifs,
			).setSelectionParNumeroEtGenre(0, this.contenu.parcoursEducatif);
		}
		const lListeThemeOriginaux = new ObjetListeElements_1.ObjetListeElements();
		if (!!this.contenu.ListeThemes && this.contenu.ListeThemes.count()) {
			this.contenu.ListeThemes.parcourir((aTheme) => {
				aTheme.cmsActif = true;
				lListeThemeOriginaux.add(
					MethodesObjet_1.MethodesObjet.dupliquer(aTheme),
				);
			});
		}
		if (this.identMultiSelectionTheme) {
			this.getInstance(this.identMultiSelectionTheme).setDonnees(
				lListeThemeOriginaux,
				this.Pere.Cours
					? this.Pere.Cours.matiere
					: this.Pere.donnees && this.Pere.donnees.cours
						? this.Pere.donnees.cours.Matiere
						: this.contenu.matiere,
				this.contenu.libelleCBTheme,
			);
		}
		ObjetHtml_1.GHtml.setValue(this.Nom + "_Titre", this.contenu.getLibelle());
		ObjetHtml_1.GHtml.setCursorAtEnd(this.Nom + "_Titre");
		ObjetHtml_1.GHtml.setHtml(this.idDescriptif, this.contenu.descriptif);
		if (GNavigateur.withContentEditable) {
			const lEditor = TinyInit_1.TinyInit.get(this.idDescriptif);
			if (lEditor) {
				this._affecterContenuTiny(lEditor, this.contenu.descriptif);
			}
		} else {
			ObjetHtml_1.GHtml.setValue(this.idDescriptif, this.contenu.descriptif);
		}
		this.getInstance(this.identCombo).setActif(!this.cahierDeTexteVerrouille);
		ObjetHtml_1.GHtml.setDisabled(
			this.IdPremierElement,
			this.cahierDeTexteVerrouille,
		);
		if (
			ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
				this.contenu.getLibelle(),
				10,
				false,
			) +
				6 >
			ObjetPosition_1.GPosition.getWidth(this.IdPremierElement)
		) {
			ObjetHtml_1.GHtml.setTitle(
				this.IdPremierElement,
				this.contenu.getLibelle(),
			);
		}
	}
	_actualiserTrainingQCM() {
		function _surContextMenu(aEvent) {
			GNavigateur.stopperEvenement(aEvent);
			const lThis = aEvent.data.aObjet;
			lThis.ouvrirMenuContextQCM(aEvent.data.aIndice);
			return false;
		}
		function _surClick(aEvent) {
			const lThis = aEvent.data.aObjet;
			lThis.selectionnerLigneExecQCM(aEvent.data.aIndice);
		}
		if (this.contenu) {
			ObjetHtml_1.GHtml.setHtml(
				this.Nom + "_QCM",
				this.construireListeQCMTraining(),
				{ controleur: this.controleur },
			);
		}
		if (this.contenu.listeExecutionQCM) {
			for (let i = 0; i < this.contenu.listeExecutionQCM.count(); i++) {
				$("#" + this.getIdLigneExoQCM(i).escapeJQ())
					.on("contextmenu", { aObjet: this, aIndice: i }, _surContextMenu)
					.on("click", { aObjet: this, aIndice: i }, _surClick);
			}
		}
	}
	selectionnerLigneExecQCM(aIndiceExec) {
		if (this.indiceExecQCMDeContenu !== null) {
			$("#" + this.getIdLigneExoQCM(this.indiceExecQCMDeContenu).escapeJQ())
				.css("background-color", "transparent")
				.css("color", "black");
		}
		this.indiceExecQCMDeContenu = aIndiceExec;
		this.applicationSco
			.getCouleur()
			.setCouleurSelection(this.getIdLigneExoQCM(aIndiceExec));
	}
	ouvrirMenuContextQCM(aIndiceExec) {
		this.selectionnerLigneExecQCM(aIndiceExec);
		this.indiceExecQCMDeContenu = aIndiceExec;
		if (
			!this.cahierDeTexteVerrouille &&
			this.getInstance(this.identMenuContextExoQCM)
		) {
			this.getInstance(this.identMenuContextExoQCM).setDonnees();
		}
	}
	getIdLigneExoQCM(aIndice) {
		return this.Nom + "_ligneExoQCM_" + aIndice;
	}
	getIdResumeModalite(aIndice) {
		return this.Nom + "_resumeModalite_" + aIndice;
	}
	construireListeQCMTraining() {
		const H = [];
		if (this.contenu && this.contenu.listeExecutionQCM) {
			const lNbr = this.contenu.listeExecutionQCM.count();
			if (lNbr > 0) {
				H.push("<table>");
				for (let i = 0; i < lNbr; i++) {
					if (this.contenu.listeExecutionQCM.existe(i)) {
						const lExecutionQCM = this.contenu.listeExecutionQCM.get(i);
						H.push('<tr id="', this.getIdLigneExoQCM(i), '">');
						H.push("<td>", lExecutionQCM.QCM.getLibelle(), "</td>");
						H.push(
							'<td id="',
							this.getIdResumeModalite(i),
							'" class="Espace">',
							UtilitaireQCM_1.UtilitaireQCM.getStrResumeModalites(
								lExecutionQCM,
							),
							"</td>",
						);
						H.push(
							"<td><ie-btnicon ie-model=\"btnParametrerQCM('",
							lExecutionQCM.getNumero(),
							'\')" class="icon_cog"></ie-btnicon></td>',
						);
						H.push("</tr>");
					}
				}
				H.push("</table>");
			}
		}
		return H.join("");
	}
	_evtCellMultiSelectionTheme(aGenreBouton, aListeSelections) {
		if (aGenreBouton === 1) {
			let lAvecChangement = false;
			if (!!this.contenu.ListeThemes) {
				this.contenu.ListeThemes.parcourir((aThemeOrigine) => {
					let lTheme = aListeSelections.getElementParNumero(
						aThemeOrigine.getNumero(),
					);
					if (!lTheme) {
						lAvecChangement = true;
					}
				});
			}
			if (
				lAvecChangement ||
				(!this.contenu.ListeThemes && aListeSelections.count()) ||
				(!!this.contenu.ListeThemes &&
					this.contenu.ListeThemes.count() !== aListeSelections.count())
			) {
				this.contenu.ListeThemes = aListeSelections;
				this.contenu.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.callback.appel(
					EGenreEvenementContenuCahierDeTextes_1
						.EGenreEvenementContenuCahierDeTextes.editionTheme,
					this.contenu,
				);
			}
		}
	}
}
exports.InterfaceContenuCahierDeTextes = InterfaceContenuCahierDeTextes;
