exports.ObjetFenetre_SaisieSujetForumPedagogique = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetCelluleMultiSelectionThemes_1 = require("ObjetCelluleMultiSelectionThemes");
const TypesForumPedagogique_1 = require("TypesForumPedagogique");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetRequeteListePublics_1 = require("ObjetRequeteListePublics");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetDate_1 = require("ObjetDate");
const ObjetSelecteurPJ_1 = require("ObjetSelecteurPJ");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const MethodesObjet_1 = require("MethodesObjet");
const TypeHttpNotificationDonnes_1 = require("TypeHttpNotificationDonnes");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const ObjetMoteurFormSaisieMobile_1 = require("ObjetMoteurFormSaisieMobile");
const ObjetFenetre_SelectionPublic_1 = require("ObjetFenetre_SelectionPublic");
const UtilitaireFenetreSelectionPublic_1 = require("UtilitaireFenetreSelectionPublic");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetChaine_1 = require("ObjetChaine");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
class ObjetFenetre_SaisieSujetForumPedagogique extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.idLibellePJ = `${this.Nom}_pjs`;
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur("ForumPeda.CreerSujet"),
			largeur: 770,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Annuler"),
				{
					libelle:
						ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Valider"),
					estValider: true,
				},
			],
			addParametresValidation: (aParametres) => {
				if (aParametres.bouton && aParametres.bouton.estValider) {
					aParametres.sujet = this.sujet;
				}
			},
			eventSaisieCloudCallbackParFichier: null,
			eventSaisieCloudCallbackFinal: null,
			estContenuSujetVide: null,
		});
		this.moteurFormSaisie =
			new ObjetMoteurFormSaisieMobile_1.ObjetMoteurFormSaisieMobile();
		this.sujet = {};
		this.listePJs = this.etatUtilisateurSco.listeDonnees
			? MethodesObjet_1.MethodesObjet.dupliquer(
					this.etatUtilisateurSco.listeDonnees[
						TypeHttpNotificationDonnes_1.TypeHttpNotificationDonnes
							.THND_ListeDocJointEtablissement
					],
				)
			: new ObjetListeElements_1.ObjetListeElements();
	}
	getSujet() {
		return this.sujet;
	}
	setSujet(aSujet, aSurCreation) {
		this.sujet = aSujet;
		if (!aSurCreation) {
			this.setOptionsFenetre({
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"ForumPeda.ModifierSujet",
				),
			});
		}
	}
	addPJSujet(aPJ) {
		this.sujet.listeFichiers.addElement(aPJ);
		this.listePJs.addElement(aPJ);
	}
	jsxModeleBoutonDest(aPourMembre, aGenreRessource) {
		return {
			event: () => {
				this._requetePublic(aPourMembre, aGenreRessource);
			},
		};
	}
	jsxGetHtmlBoutonDest(aPourMembre, aGenreRessource) {
		return this._compteurRessources(aPourMembre, aGenreRessource);
	}
	jsxGetHtmlNbDest(aPourMembre) {
		return "(" + this._compteurRessources(aPourMembre, null) + ")";
	}
	jsxNodeDestMobile(aPourMembre, aNode) {
		$(aNode).eventValidation(() => {
			this._ouvrirFenetreDestMobile(aPourMembre);
		});
	}
	jsxComboModelMatiere() {
		return {
			init: (aCombo) => {
				const lListeMatieres = new ObjetListeElements_1.ObjetListeElements()
					.add(ObjetElement_1.ObjetElement.create({ Libelle: "", vide: true }))
					.add(this.sujet.listeMatieresDispo);
				const lMatiereSujet = this.sujet.matiere;
				if (
					lMatiereSujet &&
					!lListeMatieres.getElementParNumeroEtGenre(lMatiereSujet.getNumero())
				) {
					lListeMatieres.add(lMatiereSujet);
				}
				lListeMatieres.trier();
				let lIndiceSelection = 0;
				if (lMatiereSujet) {
					lIndiceSelection = lListeMatieres.getIndiceParNumeroEtGenre(
						lMatiereSujet.getNumero(),
					);
				}
				aCombo
					.setOptionsObjetSaisie({
						longueur: "100%",
						labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
							"ForumPeda.ChoisirMatiere",
						),
						placeHolder: ObjetTraduction_1.GTraductions.getValeur(
							"ForumPeda.ChoisirMatiere",
						),
					})
					.setDonneesObjetSaisie({
						liste: lListeMatieres,
						selection: lIndiceSelection || 0,
					});
			},
			event: (aParams) => {
				if (aParams.estSelectionManuelle && aParams.element) {
					this.sujet.matiere = aParams.element.vide ? null : aParams.element;
					this._actualiserSelectThemes();
				}
			},
		};
	}
	jsxGetHtmlChipsFichier() {
		return UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
			this.sujet.listeFichiers || new ObjetListeElements_1.ObjetListeElements(),
			{
				separateur: " ",
				IEModelChips: "chipsFichier",
				maxWidth: IE.estMobile ? 0 : 300,
			},
		);
	}
	jsxModeleInputTime(aEstHoraireAvant) {
		return {
			getValueInit: () => {
				return ObjetDate_1.GDate.formatDate(
					aEstHoraireAvant ? this.sujet.heureAvant : this.sujet.heureApres,
					"%hh:%mm",
				);
			},
			exitChange: (aValue, aParamsSetter) => {
				const lDate = aEstHoraireAvant
					? this.sujet.heureAvant
					: this.sujet.heureApres;
				lDate.setHours(aParamsSetter.time.heure);
				lDate.setMinutes(aParamsSetter.time.minute);
				if (
					this.sujet.heureAvant.getTime() <= this.sujet.heureApres.getTime()
				) {
					if (aEstHoraireAvant) {
						if (aParamsSetter.time.heure <= 1) {
							this.sujet.heureApres.setHours(0);
							this.sujet.heureApres.setMinutes(1);
						} else {
							this.sujet.heureApres.setHours(aParamsSetter.time.heure - 1);
							this.sujet.heureApres.setMinutes(aParamsSetter.time.minute);
						}
					} else {
						if (aParamsSetter.time.heure >= 23) {
							this.sujet.heureAvant.setHours(23);
							this.sujet.heureAvant.setMinutes(59);
						} else {
							this.sujet.heureAvant.setHours(aParamsSetter.time.heure + 1);
							this.sujet.heureAvant.setMinutes(aParamsSetter.time.minute);
						}
					}
				}
			},
			getDisabled: () => {
				return !this.sujet.avecHoraires;
			},
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			inputTitre: {
				getValue() {
					return aInstance.sujet.titre;
				},
				setValue(aValue) {
					aInstance.sujet.titre = aValue;
				},
			},
			chipsFichier: {
				eventBtn: function (aIndice) {
					const lPJ = aInstance.sujet.listeFichiers.get(aIndice);
					if (lPJ) {
						aInstance.getInstance(aInstance.identSelecteurPJ).supprimerPJ(lPJ);
					}
				},
			},
			identiteEditeurHTML() {
				return aInstance.optionsFenetre.getIdentiteEditeurHtml(aInstance);
			},
			modelEditeurNonTiny: {
				getValue: function () {
					return aInstance.sujet.htmlPost;
				},
				setValue: function (aEstHtml, aValue) {
					aInstance.sujet.htmlPost = aValue;
				},
				fromDisplay(aEstHtml, aValue) {
					let lValue = aValue;
					if (aEstHtml) {
						const lJNode = $("<div>" + aValue + "</div>");
						const lAvec = ObjetHtml_1.GHtml.nettoyerEditeurRiche(lJNode);
						if (lAvec) {
							lValue = lJNode.get(0).innerHTML;
							aInstance.applicationSco
								.getMessage()
								.afficher({
									message: ObjetTraduction_1.GTraductions.getValeur(
										"CahierDeTexte.MessageSuppressionImage",
									),
								});
						}
						lValue = ObjetChaine_1.GChaine.htmlDOMPurify(lValue);
					}
					return lValue;
				},
			},
		});
	}
	jsxModeleCheckboxVisiteur(aEstPourSPR) {
		return {
			getValue: () => {
				let lIncl = [TypesForumPedagogique_1.TypeGenreVisiteurForum.GVF_SPR];
				if (!aEstPourSPR) {
					lIncl = [
						TypesForumPedagogique_1.TypeGenreVisiteurForum.GVF_Responsable,
						TypesForumPedagogique_1.TypeGenreVisiteurForum.GVF_Accompagnant,
					];
				}
				return this.sujet.visiteurs.contains(lIncl);
			},
			setValue: (aValue) => {
				let lIncl = [TypesForumPedagogique_1.TypeGenreVisiteurForum.GVF_SPR];
				if (!aEstPourSPR) {
					lIncl = [
						TypesForumPedagogique_1.TypeGenreVisiteurForum.GVF_Responsable,
						TypesForumPedagogique_1.TypeGenreVisiteurForum.GVF_Accompagnant,
					];
				}
				if (aValue) {
					this.sujet.visiteurs.add(lIncl);
				} else {
					this.sujet.visiteurs.remove(lIncl);
				}
			},
			getDisabled: () => {
				return aEstPourSPR;
			},
		};
	}
	jsxModeleRadioModeration(aGenreModeration) {
		return {
			getValue: () => {
				return this.sujet.genreModeration === aGenreModeration;
			},
			setValue: (aValue) => {
				this.sujet.genreModeration = aGenreModeration;
			},
			getDisabled: () => {
				return !this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.forum.avecModificationForumAPosteriori,
				);
			},
			getName: () => {
				return `${this.Nom}_Moderation`;
			},
		};
	}
	jsxModeleCheckboxActiverHoraires() {
		return {
			getValue: () => {
				return this.sujet.avecHoraires;
			},
			setValue: (aValue) => {
				this.sujet.avecHoraires = aValue;
			},
			getDisabled: () => {
				return (
					this._compteurRessources(
						true,
						Enumere_Ressource_1.EGenreRessource.Eleve,
					) === 0
				);
			},
		};
	}
	construireInstances() {
		const lThis = this;
		this.identSelecteurPJ = this.add(
			ObjetSelecteurPJ_1.ObjetSelecteurPJ,
			() => {
				this.$refreshSelf();
			},
			(aInstance) => {
				aInstance.setOptions({
					genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
					title: ObjetTraduction_1.GTraductions.getValeur("Messagerie.HintPJ"),
					maxFiles: 0,
					multiple: true,
					maxSize: this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
					),
					ouvrirFenetreChoixTypesAjout: true,
					optionsCloud: {
						avecCloud: !!(
							lThis.optionsFenetre.eventSaisieCloudCallbackParFichier &&
							lThis.optionsFenetre.eventSaisieCloudCallbackFinal
						),
						callbackChoixFichierParFichier: lThis.optionsFenetre
							.eventSaisieCloudCallbackParFichier
							? lThis.optionsFenetre.eventSaisieCloudCallbackParFichier.bind(
									this,
								)
							: null,
						callbackChoixFichierFinal: lThis.optionsFenetre
							.eventSaisieCloudCallbackFinal
							? lThis.optionsFenetre.eventSaisieCloudCallbackFinal.bind(this)
							: null,
					},
					avecMenuContextuel: false,
					masquerListeChips: true,
					avecAjoutExistante: true,
					avecEtatSaisie: false,
					libelleSelecteur: IE.estMobile
						? ObjetTraduction_1.GTraductions.getValeur("Messagerie.HintPJ")
						: "",
				});
			},
		);
		if (this.optionsFenetre.moteurForum.avecGestionThemes()) {
			this.identSelecTheme = this.add(
				ObjetCelluleMultiSelectionThemes_1.ObjetCelluleMultiSelectionThemes,
				(aGenreBouton, aListeSelections) => {
					if (aGenreBouton === 1) {
						this.sujet.listeThemes = aListeSelections;
					}
				},
				(aInstance) => {
					aInstance.setOptions({
						fullWidth: true,
						placeHolder: ObjetTraduction_1.GTraductions.getValeur(
							"infosperso.ChoisirTheme",
						),
					});
				},
			);
		}
	}
	afficher() {
		this._actualiserSelectThemes();
		const lPromise = super.afficher();
		this._actualiserSelecteurPJ();
		return lPromise;
	}
	composeContenu() {
		if (IE.estMobile) {
			return this._composeContenuMobile();
		} else {
			return this._composeContenuDesktop();
		}
	}
	surValidation(ANumeroBouton) {
		const lParams = this.getParametresValidation(ANumeroBouton);
		if (lParams.bouton && lParams.bouton.estValider) {
			if (!this.sujet.titre) {
				this.applicationSco
					.getMessage()
					.afficher({
						message: ObjetTraduction_1.GTraductions.getValeur(
							"ForumPeda.SaisirUnTitre",
						),
					});
				return;
			}
			if (
				(this.optionsFenetre.estContenuSujetVide &&
					this.optionsFenetre.estContenuSujetVide(this.sujet)) ||
				!this.sujet.htmlPost
			) {
				this.applicationSco
					.getMessage()
					.afficher({
						message: ObjetTraduction_1.GTraductions.getValeur(
							"ForumPeda.SaisirUnContenu",
						),
					});
				return;
			}
			if (this.sujet.listeMembres.count() === 0) {
				this.applicationSco
					.getMessage()
					.afficher({
						message: ObjetTraduction_1.GTraductions.getValeur(
							"ForumPeda.SaisirUnMembre",
						),
					});
				return;
			}
		}
		super.surValidation(ANumeroBouton);
	}
	_actualiserSelectThemes() {
		if (this.getInstance(this.identSelecTheme)) {
			this.getInstance(this.identSelecTheme).setDonnees(
				this.sujet.listeThemes,
				this.sujet.matiere,
				ObjetTraduction_1.GTraductions.getValeur("Theme.libelleCB.forum"),
			);
		}
	}
	_composeContenuDesktop() {
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				{ class: "dest" },
				this._construireDestinatairesDesktop(),
			),
		);
		T.push(
			IE.jsx.str(
				"div",
				{ class: "visiteurs" },
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": this.jsxModeleCheckboxVisiteur.bind(this, false) },
					ObjetTraduction_1.GTraductions.getValeur("ForumPeda.VisiteurRespAcc"),
				),
				IE.jsx.str("br", null),
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": this.jsxModeleCheckboxVisiteur.bind(this, true) },
					ObjetTraduction_1.GTraductions.getValeur("ForumPeda.VisiteurSPR"),
				),
			),
		);
		const lIdTitre = `${this.Nom}_inputTitre`;
		T.push(
			IE.jsx.str(
				"div",
				{ class: "titre-theme" },
				IE.jsx.str(
					"label",
					{ for: lIdTitre },
					ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Titre"),
				),
				IE.jsx.str("input", { "ie-model": "inputTitre", id: lIdTitre }),
				IE.jsx.str("ie-combo", {
					"ie-model": this.jsxComboModelMatiere.bind(this),
				}),
				this.getInstance(this.identSelecTheme)
					? IE.jsx.str(
							IE.jsx.fragment,
							null,
							IE.jsx.str(
								"label",
								null,
								ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Theme"),
							),
							IE.jsx.str("div", {
								class: "selec-theme",
								id: this.getNomInstance(this.identSelecTheme),
							}),
						)
					: "",
			),
		);
		T.push(
			IE.jsx.str(
				"div",
				{ class: "flex-contain p-left-l" },
				IE.jsx.str(
					"div",
					{ class: "fix-bloc flex-contain cols" },
					this._composeChampPJDesktop(),
				),
				IE.jsx.str(
					"div",
					{ class: "fluid-bloc" },
					IE.jsx.str("div", {
						class: "editeur",
						"ie-identite": "identiteEditeurHTML",
					}),
				),
			),
		);
		T.push(
			IE.jsx.str("div", {
				"ie-html": this.jsxGetHtmlChipsFichier.bind(this),
				class: "m-top m-bottom-l m-left-big p-left-lb",
			}),
		);
		T.push(
			IE.jsx.str(
				"div",
				{ class: "options" },
				IE.jsx.str(
					"fieldset",
					{
						class: [
							"fs-moderation",
							this.applicationSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.forum
									.avecModificationForumAPosteriori,
							)
								? ""
								: "disabled",
						],
					},
					IE.jsx.str(
						"legend",
						null,
						ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Moderation"),
					),
					IE.jsx.str(
						"ie-radio",
						{
							"ie-model": this.jsxModeleRadioModeration.bind(
								this,
								TypesForumPedagogique_1.TypeGenreModerationForum.GMF_APriori,
							),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"ForumPeda.AvantPublication",
						),
					),
					IE.jsx.str(
						"label",
						{ class: "legendeCB" },
						ObjetTraduction_1.GTraductions.getValeur(
							"ForumPeda.AvantPublicationExplication",
						),
					),
					IE.jsx.str(
						"ie-radio",
						{
							"ie-model": this.jsxModeleRadioModeration.bind(
								this,
								TypesForumPedagogique_1.TypeGenreModerationForum
									.GMF_APosteriori,
							),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"ForumPeda.ApresPublication",
						),
					),
					IE.jsx.str(
						"label",
						{ class: "legendeCB last" },
						ObjetTraduction_1.GTraductions.getValeur(
							"ForumPeda.ApresPublicationExplication",
						),
					),
				),
				IE.jsx.str(
					"fieldset",
					null,
					IE.jsx.str(
						"legend",
						null,
						ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Horaires"),
					),
					IE.jsx.str(
						"ie-checkbox",
						{ "ie-model": this.jsxModeleCheckboxActiverHoraires.bind(this) },
						ObjetTraduction_1.GTraductions.getValeur(
							"ForumPeda.ActiverHoraires",
						),
					),
					IE.jsx.str(
						"div",
						{ class: "horaires" },
						IE.jsx.str(
							"label",
							{ for: "labelFrom" },
							ObjetTraduction_1.GTraductions.getValeur(
								"ForumPeda.HorairesApres",
							),
						),
						IE.jsx.str("input", {
							id: "labelFrom",
							type: "time",
							"ie-model": this.jsxModeleInputTime.bind(this, false),
						}),
						IE.jsx.str(
							"label",
							{ for: "labelTo" },
							ObjetTraduction_1.GTraductions.getValeur(
								"ForumPeda.HorairesAvant",
							),
						),
						IE.jsx.str("input", {
							id: "labelTo",
							type: "time",
							"ie-model": this.jsxModeleInputTime.bind(this, true),
						}),
					),
				),
			),
		);
		return T.join("");
	}
	_getTitreDestDeGenre(aGenre) {
		switch (aGenre) {
			case Enumere_Ressource_1.EGenreRessource.Eleve:
				return ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Eleves");
			case Enumere_Ressource_1.EGenreRessource.Personnel:
				return ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Personnels");
			case Enumere_Ressource_1.EGenreRessource.Enseignant:
				return ObjetTraduction_1.GTraductions.getValeur(
					"ForumPeda.Professeurs",
				);
		}
		return "";
	}
	_getTabRessourcesDest(aPourMembre) {
		if (aPourMembre) {
			return [
				Enumere_Ressource_1.EGenreRessource.Eleve,
				Enumere_Ressource_1.EGenreRessource.Enseignant,
				Enumere_Ressource_1.EGenreRessource.Personnel,
			];
		} else {
			return [
				Enumere_Ressource_1.EGenreRessource.Enseignant,
				Enumere_Ressource_1.EGenreRessource.Personnel,
			];
		}
	}
	_construireDestinatairesDesktop() {
		const lListeMembres = [];
		for (const lGenre of this._getTabRessourcesDest(true)) {
			lListeMembres.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str("label", null, this._getTitreDestDeGenre(lGenre)),
					IE.jsx.str(
						"ie-bouton",
						{
							"ie-model": this.jsxModeleBoutonDest.bind(this, true, lGenre),
							"ie-tooltiplabel":
								Enumere_Ressource_1.EGenreRessourceUtil.getTitreFenetreSelectionRessource(
									lGenre,
								),
							"aria-haspopup": "dialog",
						},
						"...",
					),
					IE.jsx.str("div", {
						"ie-html": this.jsxGetHtmlBoutonDest.bind(this, true, lGenre),
					}),
				),
			);
		}
		const lListeModerateurs = [];
		for (const lGenre of this._getTabRessourcesDest(false)) {
			lListeModerateurs.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str("label", null, this._getTitreDestDeGenre(lGenre)),
					IE.jsx.str(
						"ie-bouton",
						{
							"ie-model": this.jsxModeleBoutonDest.bind(this, false, lGenre),
							"ie-tooltiplabel":
								Enumere_Ressource_1.EGenreRessourceUtil.getTitreFenetreSelectionRessource(
									lGenre,
								),
							"aria-haspopup": "dialog",
						},
						"...",
					),
					IE.jsx.str("div", {
						"ie-html": this.jsxGetHtmlBoutonDest.bind(this, false, lGenre),
					}),
				),
			);
		}
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"fieldset",
					null,
					IE.jsx.str(
						"legend",
						null,
						ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Membres"),
					),
					IE.jsx.str("div", null, lListeMembres.join("")),
				),
				IE.jsx.str(
					"fieldset",
					null,
					IE.jsx.str(
						"legend",
						null,
						ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Moderateurs"),
					),
					IE.jsx.str("div", null, lListeModerateurs.join("")),
				),
			),
		);
		return H.join("");
	}
	_composeChampPJDesktop() {
		const T = [];
		T.push(
			IE.jsx.str("div", {
				class: "pj-global-conteneur",
				id: this.getNomInstance(this.identSelecteurPJ),
				style: "height:2.4rem;",
			}),
		);
		return T.join("");
	}
	_composeContenuMobile() {
		const T = [];
		T.push(
			IE.jsx.str(
				"fieldset",
				null,
				IE.jsx.str(
					"div",
					{
						class: "selec-dest m-all-l",
						"ie-node": this.jsxNodeDestMobile.bind(this, true),
						tabindex: "0",
						role: "button",
					},
					IE.jsx.str(
						"span",
						null,
						ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Membres"),
						IE.jsx.str("span", {
							class: "compteur",
							"ie-html": this.jsxGetHtmlNbDest.bind(this, true),
						}),
					),
				),
				IE.jsx.str(
					"div",
					{
						class: "selec-dest m-all-l",
						"ie-node": this.jsxNodeDestMobile.bind(this, false),
						tabindex: "0",
						role: "button",
					},
					IE.jsx.str(
						"span",
						null,
						ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Moderateurs"),
						IE.jsx.str("span", {
							class: "compteur",
							"ie-html": this.jsxGetHtmlNbDest.bind(this, false),
						}),
					),
				),
				IE.jsx.str(
					"ie-checkbox",
					{
						"ie-model": this.jsxModeleCheckboxVisiteur.bind(this, false),
						class: "long-text m-all-l",
					},
					ObjetTraduction_1.GTraductions.getValeur("ForumPeda.VisiteurRespAcc"),
				),
				IE.jsx.str(
					"ie-checkbox",
					{
						class: "long-text m-x-l m-bottom-l",
						"ie-model": this.jsxModeleCheckboxVisiteur.bind(this, true),
					},
					ObjetTraduction_1.GTraductions.getValeur("ForumPeda.VisiteurSPR"),
				),
			),
		);
		T.push(`<fieldset>`);
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "field-contain" },
					IE.jsx.str(
						"label",
						{ class: "active ie-titre-petit" },
						ObjetTraduction_1.GTraductions.getValeur("Matiere"),
					),
					IE.jsx.str("ie-combo", {
						"ie-model": this.jsxComboModelMatiere.bind(this),
					}),
				),
			),
		);
		if (this.getInstance(this.identSelecTheme)) {
			let lId = this.getNomInstance(this.identSelecTheme);
			T.push(
				IE.jsx.str(
					"div",
					{ class: "field-contain" },
					IE.jsx.str(
						"label",
						{ for: lId, class: "active ie-titre-petit" },
						ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Theme"),
					),
					IE.jsx.str("div", { class: "selec-theme", id: lId }),
				),
			);
		}
		T.push(
			this.moteurFormSaisie.composeFormText({
				label: ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Titre"),
				model: "inputTitre",
				id: `${this.Nom}_input_titre`,
			}),
		);
		T.push(
			this.moteurFormSaisie.composeFormContenuEditable({
				label: ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Contenu"),
				model: "modelEditeurNonTiny(true)",
				id: `${this.Nom}_input_contenu`,
			}),
		);
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "pj-global-conteneur p-all-l p-bottom-xl m-bottom-l" },
					IE.jsx.str("div", { id: this.getNomInstance(this.identSelecteurPJ) }),
					IE.jsx.str("div", {
						"ie-html": this.jsxGetHtmlChipsFichier.bind(this),
						class: "docs-joints",
					}),
				),
			),
		);
		T.push(`</fieldset>`);
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"fieldset",
					null,
					IE.jsx.str(
						"div",
						{ class: "champ-conteneur m-x-l" },
						IE.jsx.str(
							"label",
							{ class: "active" },
							ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Moderation"),
						),
						IE.jsx.str(
							"ie-radio",
							{
								class: "long-text m-bottom",
								"ie-model": this.jsxModeleRadioModeration.bind(
									this,
									TypesForumPedagogique_1.TypeGenreModerationForum.GMF_APriori,
								),
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"ForumPeda.AvantPublication",
							),
							IE.jsx.str(
								"span",
								{ class: "legendeCB" },
								" (",
								ObjetTraduction_1.GTraductions.getValeur(
									"ForumPeda.AvantPublicationExplication",
								),
								")",
							),
						),
						IE.jsx.str(
							"ie-radio",
							{
								class: "long-text",
								"ie-model": this.jsxModeleRadioModeration.bind(
									this,
									TypesForumPedagogique_1.TypeGenreModerationForum
										.GMF_APosteriori,
								),
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"ForumPeda.ApresPublication",
							),
							IE.jsx.str(
								"span",
								{ class: "legendeCB" },
								" (",
								ObjetTraduction_1.GTraductions.getValeur(
									"ForumPeda.ApresPublicationExplication",
								),
								")",
							),
						),
					),
				),
			),
		);
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"fieldset",
					null,
					IE.jsx.str(
						"div",
						{ class: "champ-conteneur m-x-l" },
						IE.jsx.str(
							"label",
							{ class: "active" },
							ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Horaires"),
						),
						IE.jsx.str(
							"ie-checkbox",
							{ "ie-model": this.jsxModeleCheckboxActiverHoraires.bind(this) },
							ObjetTraduction_1.GTraductions.getValeur(
								"ForumPeda.ActiverHoraires",
							),
						),
						IE.jsx.str(
							"div",
							{ class: "flex-contain flex-gap-xl justify-between" },
							IE.jsx.str(
								"div",
								{ class: "horaire" },
								IE.jsx.str(
									"label",
									{ for: "id_Fp_apres" },
									ObjetTraduction_1.GTraductions.getValeur(
										"ForumPeda.HorairesApres",
									),
								),
								IE.jsx.str("input", {
									id: "id_Fp_apres",
									type: "time",
									"ie-model": this.jsxModeleInputTime.bind(this, false),
									"aria-label": ObjetTraduction_1.GTraductions.getValeur(
										"ForumPeda.HorairesApres",
									),
								}),
							),
							IE.jsx.str(
								"div",
								{ class: "horaire" },
								IE.jsx.str(
									"label",
									{ for: "id_Fp_avant" },
									ObjetTraduction_1.GTraductions.getValeur(
										"ForumPeda.HorairesAvant",
									),
								),
								IE.jsx.str("input", {
									id: "id_Fp_avant",
									type: "time",
									"ie-model": this.jsxModeleInputTime.bind(this, true),
									"aria-label": ObjetTraduction_1.GTraductions.getValeur(
										"ForumPeda.HorairesAvant",
									),
								}),
							),
						),
					),
				),
			),
		);
		return T.join("");
	}
	_requetePublic(aPourMembre, aGenreRessource) {
		new ObjetRequeteListePublics_1.ObjetRequeteListePublics(this)
			.lancerRequete({
				genres: [aGenreRessource],
				sansFiltreSurEleve: this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.communication.toutesClasses,
				),
				avecFonctionPersonnel: true,
			})
			.then((aDonnees) => {
				const lListeRessources = aDonnees.listePublic;
				const lNomPropListe = aPourMembre ? "listeMembres" : "listeModerateurs";
				const lListeRessourcesSelec = this.sujet[
					lNomPropListe
				].getListeElements((aRess) => {
					return aRess.getGenre() === aGenreRessource;
				});
				const lInstance = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_SelectionPublic_1.ObjetFenetre_SelectionPublic,
					{
						pere: this,
						evenement: function (aGenre, aListe, aNumeroBouton) {
							if (aNumeroBouton === 1) {
								this.sujet[lNomPropListe] = this.sujet[lNomPropListe]
									.getListeElements((aRess) => {
										return aRess.getGenre() !== aGenreRessource;
									})
									.add(lListeRessourcesSelec);
								if (
									this.sujet.avecHoraires &&
									aPourMembre &&
									aGenreRessource ===
										Enumere_Ressource_1.EGenreRessource.Eleve &&
									this._compteurRessources(aPourMembre, aGenreRessource) === 0
								) {
									this.sujet.avecHoraires = false;
								} else if (
									aPourMembre &&
									aGenreRessource ===
										Enumere_Ressource_1.EGenreRessource.Eleve &&
									this._compteurRessources(aPourMembre, aGenreRessource) > 0
								) {
									this.sujet.avecHoraires = true;
								}
							}
						},
					},
				);
				lInstance.setOptionsFenetreSelectionRessource({
					avecCocheRessources: true,
				});
				const lGenreCumul = (0,
				UtilitaireFenetreSelectionPublic_1.getCumulPourFenetrePublic)(
					aGenreRessource,
					false,
					lListeRessources.count(),
				);
				if (
					[
						Enumere_Ressource_1.EGenreRessource.Eleve,
						Enumere_Ressource_1.EGenreRessource.Responsable,
					].includes(aGenreRessource)
				) {
					const lListeCumuls = new ObjetListeElements_1.ObjetListeElements();
					lListeCumuls.addElement(
						new ObjetElement_1.ObjetElement(
							ObjetTraduction_1.GTraductions.getValeur(
								"actualites.Cumul.Classe",
							),
							0,
							ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic
								.classe,
							0,
						),
					);
					lListeCumuls.addElement(
						new ObjetElement_1.ObjetElement(
							ObjetTraduction_1.GTraductions.getValeur(
								"actualites.Cumul.Groupe",
							),
							0,
							ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic
								.groupe,
							1,
						),
					);
					lListeCumuls.addElement(
						new ObjetElement_1.ObjetElement(
							ObjetTraduction_1.GTraductions.getValeur(
								"actualites.Cumul.Alphabetique",
							),
							0,
							ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic
								.initial,
							2,
						),
					);
					if (aDonnees.listeFamilles) {
						aDonnees.listeFamilles.parcourir((aFamille) => {
							const lFiltreFamille = new ObjetElement_1.ObjetElement(
								aFamille.getLibelle(),
								0,
								ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic
									.famille,
							);
							lFiltreFamille.famille = aFamille;
							lListeCumuls.addElement(lFiltreFamille);
						});
					}
					lInstance.setListeCumuls(lListeCumuls);
				}
				if (aGenreRessource === Enumere_Ressource_1.EGenreRessource.Personnel) {
					const lListeCumuls = new ObjetListeElements_1.ObjetListeElements();
					lListeCumuls.add(
						new ObjetElement_1.ObjetElement(
							ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_SelectionPublic.Cumul.Aucun",
							),
							0,
							ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.sans,
							0,
						),
					);
					lListeCumuls.add(
						new ObjetElement_1.ObjetElement(
							ObjetTraduction_1.GTraductions.getValeur(
								"actualites.Cumul.Fonction",
							),
							0,
							ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic
								.fonction,
							1,
						),
					);
					lInstance.setListeCumuls(lListeCumuls);
					lInstance.setOptions({
						getInfosSuppZonePrincipale(aParams) {
							return lInstance.getGenreCumul() !==
								ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic
									.fonction
								? UtilitaireMessagerie_1.UtilitaireMessagerie.getLibelleSuppListePublics(
										aParams.article,
									)
								: "";
						},
					});
				}
				lInstance.setGenreCumulActif(lGenreCumul);
				lInstance.setSelectionObligatoire(false);
				lInstance.setDonnees({
					listeRessources: lListeRessources,
					listeRessourcesSelectionnees: lListeRessourcesSelec,
					genreRessource: aGenreRessource,
					avecIndicationDiscussionInterdit: false,
					titre:
						Enumere_Ressource_1.EGenreRessourceUtil.getTitreFenetreSelectionRessource(
							aGenreRessource,
						),
					listeNiveauxResponsabilite: aDonnees.listeNiveauxResponsabilite,
				});
			});
	}
	_ouvrirFenetreDestMobile(aPourMembre) {
		let lFenetre;
		const lJsxNodeDestGenre = (aGenreRessource, aNode) => {
			$(aNode).eventValidation(() => {
				lFenetre.fermer();
				this._requetePublic(aPourMembre, aGenreRessource);
			});
		};
		const lJsxGetHtmlNbDest = (aGenreRessource) => {
			return "(" + this._compteurRessources(aPourMembre, aGenreRessource) + ")";
		};
		const T = [];
		T.push('<div class="field-contain">');
		for (const lGenre of this._getTabRessourcesDest(aPourMembre)) {
			T.push(
				IE.jsx.str(
					"div",
					{
						class: "selec-dest m-y-l",
						"ie-node": lJsxNodeDestGenre.bind(this, lGenre),
						tabindex: "0",
						role: "button",
					},
					IE.jsx.str(
						"span",
						null,
						IE.jsx.str("span", null, this._getTitreDestDeGenre(lGenre)),
						IE.jsx.str("span", {
							class: "compteur",
							"ie-html": lJsxGetHtmlNbDest.bind(this, lGenre),
						}),
					),
				),
			);
		}
		T.push("</div>");
		lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{
				pere: this,
				initialiser(aFenetre) {
					aFenetre.setOptionsFenetre({
						titre: aPourMembre
							? ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Membres")
							: ObjetTraduction_1.GTraductions.getValeur(
									"ForumPeda.Moderateurs",
								),
						listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
						cssFenetre: "ObjetFenetre_SaisieSujetForumPedagogique_racine",
					});
				},
			},
		);
		lFenetre.afficher(T.join(""));
	}
	_actualiserSelecteurPJ() {
		this.getInstance(this.identSelecteurPJ).setDonnees({
			listePJ:
				this.sujet.listeFichiers ||
				new ObjetListeElements_1.ObjetListeElements(),
			listeTotale: this.listePJs,
			idContextFocus: this.Nom,
		});
	}
	_compteurRessources(aPourMembre, aGenreRessource) {
		let lListe = aPourMembre
			? this.sujet.listeMembres
			: this.sujet.listeModerateurs;
		if (MethodesObjet_1.MethodesObjet.isNumber(aGenreRessource)) {
			lListe = lListe.getListeElements((aRess) => {
				return aRess.getGenre() === aGenreRessource;
			});
		}
		return lListe.count();
	}
}
exports.ObjetFenetre_SaisieSujetForumPedagogique =
	ObjetFenetre_SaisieSujetForumPedagogique;
