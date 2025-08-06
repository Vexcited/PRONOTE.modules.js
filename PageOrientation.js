exports.PageOrientation = void 0;
const GUID_1 = require("GUID");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_RessourceOrientation_1 = require("ObjetFenetre_RessourceOrientation");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetRequetePageOrientations_1 = require("ObjetRequetePageOrientations");
const Toast_1 = require("Toast");
const TypeRubriqueOrientation_1 = require("TypeRubriqueOrientation");
const ObjetRequeteSaisieOrientations_1 = require("ObjetRequeteSaisieOrientations");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_Action_1 = require("Enumere_Action");
const AccessApp_1 = require("AccessApp");
const TypeAvisConseil_1 = require("TypeAvisConseil");
const ObjetElement_1 = require("ObjetElement");
const ObjetRequeteVerificationOrientations_1 = require("ObjetRequeteVerificationOrientations");
const Enumere_Espace_1 = require("Enumere_Espace");
const Type3Etats_1 = require("Type3Etats");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const GlossaireOrientation_1 = require("GlossaireOrientation");
const ObjetTraduction_1 = require("ObjetTraduction");
const MethodesObjet_1 = require("MethodesObjet");
class PageOrientation extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.estProfesseur = [
			Enumere_Espace_1.EGenreEspace.Professeur,
			Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
		].includes(GEtatUtilisateur.GenreEspace);
	}
	setDonnees(aParams) {
		this.eleve = aParams.eleve;
		if (this.isRubriqueLV(aParams.rubrique)) {
			this.rubriqueLV = aParams.rubrique;
			this.rubriqueSelectionne = undefined;
			this.estDecisionRetenue = false;
		} else {
			this.rubriqueLV = undefined;
			this.rubriqueSelectionne = aParams.rubrique;
		}
		if (this.rubriqueSelectionne) {
			this.voeuxSupprimes = new ObjetListeElements_1.ObjetListeElements();
			this.estDecisionRetenue =
				this.rubriqueSelectionne.getGenre() ===
				TypeRubriqueOrientation_1.TypeRubriqueOrientation.RO_DecisionRetenue;
			this.listeOrientations = aParams.listeOrientations;
			if (!this.estDecisionRetenue) {
				this.estIntentionProvisoire =
					this.rubriqueSelectionne.getGenre() ===
					TypeRubriqueOrientation_1.TypeRubriqueOrientation.RO_IntentionFamille;
				this.rubriqueSelectionne.listeVoeux.parcourir((aVoeux) => {
					var _a;
					if (
						(_a =
							aVoeux === null || aVoeux === void 0
								? void 0
								: aVoeux.orientation) === null || _a === void 0
							? void 0
							: _a.existeNumero()
					) {
						const lOrientationBibliotheque =
							this.listeOrientations.getElementParNumero(
								aVoeux.orientation.getNumero(),
							);
						aVoeux.orientation.listeSpecialites =
							lOrientationBibliotheque.listeSpecialites;
						aVoeux.orientation.listeOptions =
							lOrientationBibliotheque.listeOptions;
					}
				});
			}
		}
		this.afficher();
	}
	construireAffichage() {
		if (this.rubriqueSelectionne) {
			if (this.estDecisionRetenue) {
				return this.construireDecisionRetenue();
			} else {
				return this.rubriqueSelectionne.estPublie
					? this.construireRubrique()
					: this.rubriqueSelectionne.dateDebutRubrique
						? this.composeMessage(
								GlossaireOrientation_1.TradGlossaireOrientation.Ressources.MessageSaisieIndisponible.format(
									[
										ObjetDate_1.GDate.formatDate(
											this.rubriqueSelectionne.dateDebutRubrique,
											"%JJ %MMMM",
										),
									],
								),
							)
						: "";
			}
		} else if (this.rubriqueLV) {
			return this.constuireRubriqueLV();
		}
	}
	construireRubrique() {
		return IE.jsx.str(
			"div",
			null,
			IE.jsx.str(
				"ul",
				null,
				this.rubriqueSelectionne.listeVoeux
					.getTableauNumeros()
					.map((aNumero, aIndice) => {
						var _a;
						return (
							(_a = this.rubriqueSelectionne) === null || _a === void 0
								? void 0
								: _a.avecSaisie
						)
							? this.constuireVoeuxSaisie(aIndice)
							: this.constuireVoeuxConsultation(aIndice);
					}),
			),
			this.rubriqueSelectionne.avecAccuseReception
				? this.estIntentionProvisoire
					? this.construireARIntention()
					: this._construireARVoeuxDefinitifs()
				: "",
			IE.jsx.str(
				"ie-bouton",
				{
					"ie-display": () => {
						var _a;
						return (_a = this.rubriqueSelectionne) === null || _a === void 0
							? void 0
							: _a.avecSaisie;
					},
					class: "btn-valider m-all-xl",
					"ie-model": this.jsxModelBoutonValider.bind(this),
				},
				this.estIntentionProvisoire
					? GlossaireOrientation_1.TradGlossaireOrientation.Bouton
							.IntentionsOrientation
					: GlossaireOrientation_1.TradGlossaireOrientation.Bouton
							.ChoixDefinitifs,
			),
			IE.jsx.str(
				"div",
				{
					"ie-if": () => {
						var _a, _b;
						return (
							!((_a = this.rubriqueSelectionne) === null || _a === void 0
								? void 0
								: _a.avecSaisie) &&
							!((_b = this.rubriqueSelectionne) === null || _b === void 0
								? void 0
								: _b.listeVoeux
										.getListeElements((aVoeux) => {
											return aVoeux.existeNumero();
										})
										.count())
						);
					},
				},
				this.composeMessage(
					GlossaireOrientation_1.TradGlossaireOrientation.AucuneOrientation,
				),
			),
		);
	}
	construireDecisionRetenue() {
		var _a, _b, _c;
		if (!this.rubriqueSelectionne.estPublie) {
			return this.composeMessage(
				GlossaireOrientation_1.TradGlossaireOrientation.Ressources.MsgDecisionRetenue.format(
					[
						ObjetDate_1.GDate.formatDate(
							this.rubriqueSelectionne.dateDebutRubrique,
							"%JJ %MMMM",
						),
					],
				),
			);
		}
		const lVoeux =
			(_a = this.rubriqueSelectionne) === null || _a === void 0
				? void 0
				: _a.listeVoeux.get(0);
		if (
			!(lVoeux === null || lVoeux === void 0 ? void 0 : lVoeux.existe()) ||
			!((_b =
				lVoeux === null || lVoeux === void 0 ? void 0 : lVoeux.orientation) ===
				null || _b === void 0
				? void 0
				: _b.existeNumero())
		) {
			return this.composeMessage(
				GlossaireOrientation_1.TradGlossaireOrientation.AucuneOrientation,
			);
		}
		return IE.jsx.str(
			"fieldset",
			{ class: "'m-all-xl" },
			IE.jsx.str(
				"legend",
				{ class: ["ie-titre", "m-all", "fluid-bloc"] },
				" ",
				this.rubriqueSelectionne.titre,
			),
			!this.estDecisionRetenue && this.construireAvisVoeux(lVoeux),
			IE.jsx.str(
				"div",
				{ class: "m-bottom-xl" },
				IE.jsx.str(
					"p",
					{ class: ["ie-titre-petit", "p-bottom"] },
					GlossaireOrientation_1.TradGlossaireOrientation.Orientation,
					" :",
				),
				IE.jsx.str("p", null, lVoeux.orientation.getLibelle()),
				((_c =
					lVoeux === null || lVoeux === void 0
						? void 0
						: lVoeux.orientation) === null || _c === void 0
					? void 0
					: _c.avecStageFamille) &&
					IE.jsx.str(
						"p",
						{ class: ["m-top"] },
						GlossaireOrientation_1.TradGlossaireOrientation.Ressources
							.DemandeStagePasserelle,
					),
			),
			IE.jsx.str(
				"div",
				{
					class: "m-bottom-xl",
					"ie-display": () => {
						return (
							(lVoeux === null || lVoeux === void 0
								? void 0
								: lVoeux.specialites.count()) > 0
						);
					},
				},
				IE.jsx.str(
					"p",
					{ class: ["ie-titre-petit", "p-bottom"] },
					GlossaireOrientation_1.TradGlossaireOrientation.Specialite,
					" :",
				),
				IE.jsx.str(
					"ul",
					null,
					lVoeux === null || lVoeux === void 0
						? void 0
						: lVoeux.specialites
								.getTableauLibelles()
								.map((aLibelle) => IE.jsx.str("li", null, aLibelle)),
				),
			),
			IE.jsx.str(
				"div",
				{
					class: "m-bottom-xl",
					"ie-display": () => {
						return (
							(lVoeux === null || lVoeux === void 0
								? void 0
								: lVoeux.options.count()) > 0
						);
					},
				},
				IE.jsx.str(
					"p",
					{ class: ["ie-titre-petit", "p-bottom"] },
					GlossaireOrientation_1.TradGlossaireOrientation.Option,
					" :",
				),
				IE.jsx.str(
					"ul",
					null,
					lVoeux === null || lVoeux === void 0
						? void 0
						: lVoeux.options
								.getTableauLibelles()
								.map((aLibelle) => IE.jsx.str("li", null, aLibelle)),
				),
			),
			IE.jsx.str(
				"div",
				{
					class: "m-bottom-xl",
					"ie-display": () => {
						return (
							lVoeux.publicationParent &&
							(lVoeux === null || lVoeux === void 0
								? void 0
								: lVoeux.commentaire) !== ""
						);
					},
				},
				IE.jsx.str(
					"p",
					{ class: ["ie-titre-petit", "p-bottom"] },
					GlossaireOrientation_1.TradGlossaireOrientation.Ressources
						.Commentaire,
					" :",
				),
				IE.jsx.str("p", null, lVoeux.commentaire),
			),
		);
	}
	constuireRubriqueLV() {
		var _a, _b;
		const lIdLV1 = GUID_1.GUID.getId();
		const lIdLV2 = GUID_1.GUID.getId();
		const lIdOption = GUID_1.GUID.getId();
		return IE.jsx.str(
			"div",
			null,
			IE.jsx.str(
				"div",
				{ class: ["m-all-xl"] },
				IE.jsx.str(
					"div",
					{
						"ie-display": () => {
							var _a, _b;
							return (_b =
								(_a =
									this === null || this === void 0
										? void 0
										: this.rubriqueLV) === null || _a === void 0
									? void 0
									: _a.maquette) === null || _b === void 0
								? void 0
								: _b.avecLV1;
						},
					},
					IE.jsx.str(
						"label",
						{ for: lIdLV1 },
						GlossaireOrientation_1.TradGlossaireOrientation.LanguesOptions.LV1,
					),
					IE.jsx.str("ie-btnselecteur", {
						id: lIdLV1,
						"ie-model": this.jsxModelBtnSelecteurLangue.bind(
							this,
							ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.lv1,
						),
						class: "fluid-bloc m-bottom-xl",
						"aria-label":
							GlossaireOrientation_1.TradGlossaireOrientation.LanguesOptions
								.TitreListeLV1,
					}),
				),
				IE.jsx.str(
					"div",
					{
						"ie-display": () => {
							var _a, _b;
							return (_b =
								(_a =
									this === null || this === void 0
										? void 0
										: this.rubriqueLV) === null || _a === void 0
									? void 0
									: _a.maquette) === null || _b === void 0
								? void 0
								: _b.avecLV2;
						},
					},
					IE.jsx.str(
						"label",
						{ for: lIdLV2 },
						GlossaireOrientation_1.TradGlossaireOrientation.LanguesOptions.LV2,
					),
					IE.jsx.str("ie-btnselecteur", {
						id: lIdLV2,
						"ie-model": this.jsxModelBtnSelecteurLangue.bind(
							this,
							ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.lv2,
						),
						class: "fluid-bloc m-bottom-xl",
						"aria-label":
							GlossaireOrientation_1.TradGlossaireOrientation.LanguesOptions
								.TitreListeLV2,
					}),
				),
				IE.jsx.str(
					"div",
					{
						"ie-display": () => {
							var _a, _b, _c;
							return (
								((_b =
									(_a =
										this === null || this === void 0
											? void 0
											: this.rubriqueLV) === null || _a === void 0
										? void 0
										: _a.maquette) === null || _b === void 0
									? void 0
									: _b.nombreEnseignementOptionnel) > 0 &&
								((_c = this.rubriqueLV.listeLVAutres) === null || _c === void 0
									? void 0
									: _c.count()) > 0
							);
						},
					},
					IE.jsx.str(
						"label",
						{ for: lIdOption },
						GlossaireOrientation_1.TradGlossaireOrientation.LanguesOptions.Options.format(
							[
								(_b =
									(_a =
										this === null || this === void 0
											? void 0
											: this.rubriqueLV) === null || _a === void 0
										? void 0
										: _a.maquette) === null || _b === void 0
									? void 0
									: _b.nombreEnseignementOptionnel,
							],
						),
					),
					IE.jsx.str("ie-btnselecteur", {
						id: lIdOption,
						"ie-model": this.jsxModelBtnSelecteurLangue.bind(
							this,
							ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
								.lvAutre,
						),
						class: "fluid-bloc m-bottom-xl",
						"aria-label":
							GlossaireOrientation_1.TradGlossaireOrientation.Options
								.TitreListe,
					}),
				),
			),
			IE.jsx.str(
				"ie-bouton",
				{
					"ie-display": () => {
						var _a;
						return (_a =
							this === null || this === void 0 ? void 0 : this.rubriqueLV) ===
							null || _a === void 0
							? void 0
							: _a.avecSaisie;
					},
					class: "btn-valider m-all-xl",
					"ie-model": this.jsxModelBoutonValider.bind(this),
				},
				GlossaireOrientation_1.TradGlossaireOrientation.LanguesOptions.bouton,
			),
		);
	}
	constuireVoeuxConsultation(aIndiceVoeux) {
		var _a;
		const lVoeux = this.rubriqueSelectionne.listeVoeux.get(aIndiceVoeux);
		if (
			!(lVoeux === null || lVoeux === void 0 ? void 0 : lVoeux.existe()) ||
			!(lVoeux === null || lVoeux === void 0
				? void 0
				: lVoeux.orientation.existeNumero())
		) {
			return "";
		}
		const lTitre = lVoeux.propositionCC
			? this.estIntentionProvisoire
				? GlossaireOrientation_1.TradGlossaireOrientation.Ressources
						.RecommandationSurVoieNonDemandee
				: GlossaireOrientation_1.TradGlossaireOrientation.Ressources
						.PropositionSurVoieNonDemandee
			: GlossaireOrientation_1.TradGlossaireOrientation.Voeux.format([
					aIndiceVoeux + 1,
				]);
		return IE.jsx.str(
			"li",
			{ class: ["m-all-xl"] },
			IE.jsx.str(
				"fieldset",
				null,
				IE.jsx.str(
					"legend",
					{ class: ["ie-titre", "m-all", "fluid-bloc"] },
					lTitre,
				),
				!this.estDecisionRetenue && this.construireAvisVoeux(lVoeux),
				IE.jsx.str(
					"div",
					{ class: "m-bottom-xl" },
					IE.jsx.str(
						"p",
						{ class: ["ie-titre-petit", "p-bottom"] },
						GlossaireOrientation_1.TradGlossaireOrientation.OrientationDemandee,
						" :",
					),
					IE.jsx.str("p", null, lVoeux.orientation.getLibelle()),
					((_a =
						lVoeux === null || lVoeux === void 0
							? void 0
							: lVoeux.orientation) === null || _a === void 0
						? void 0
						: _a.avecStageFamille) &&
						IE.jsx.str(
							"p",
							{ class: ["m-top"] },
							GlossaireOrientation_1.TradGlossaireOrientation.Ressources
								.DemandeStagePasserelle,
						),
				),
				IE.jsx.str(
					"div",
					{
						class: "m-bottom-xl",
						"ie-display": () => {
							return (
								(lVoeux === null || lVoeux === void 0
									? void 0
									: lVoeux.specialites.count()) > 0
							);
						},
					},
					IE.jsx.str(
						"p",
						{ class: ["ie-titre-petit", "p-bottom"] },
						GlossaireOrientation_1.TradGlossaireOrientation.SpecialiteDemandee,
						" :",
					),
					IE.jsx.str(
						"ul",
						null,
						lVoeux === null || lVoeux === void 0
							? void 0
							: lVoeux.specialites
									.getTableauLibelles()
									.map((aLibelle) => IE.jsx.str("li", null, aLibelle)),
					),
				),
				IE.jsx.str(
					"div",
					{
						class: "m-bottom-xl",
						"ie-display": () => {
							return (
								(lVoeux === null || lVoeux === void 0
									? void 0
									: lVoeux.options.count()) > 0
							);
						},
					},
					IE.jsx.str(
						"p",
						{ class: ["ie-titre-petit", "p-bottom"] },
						GlossaireOrientation_1.TradGlossaireOrientation.OptionDemandee,
						" :",
					),
					IE.jsx.str(
						"ul",
						null,
						lVoeux === null || lVoeux === void 0
							? void 0
							: lVoeux.options
									.getTableauLibelles()
									.map((aLibelle) => IE.jsx.str("li", null, aLibelle)),
					),
				),
				IE.jsx.str(
					"div",
					{
						class: "m-bottom-xl",
						"ie-display": () => {
							return !!lVoeux.commentaire;
						},
					},
					IE.jsx.str(
						"p",
						{ class: ["ie-titre-petit", "p-bottom"] },
						GlossaireOrientation_1.TradGlossaireOrientation.Ressources
							.Commentaire,
						" :",
					),
					IE.jsx.str("p", null, lVoeux.commentaire),
				),
			),
		);
	}
	constuireVoeuxSaisie(aIndiceVoeux) {
		const lVoeux =
			this.rubriqueSelectionne.listeVoeux.get(aIndiceVoeux) ||
			ObjetElement_1.ObjetElement.create({
				orientation: new ObjetElement_1.ObjetElement(),
				specialites: new ObjetListeElements_1.ObjetListeElements(),
				options: new ObjetListeElements_1.ObjetListeElements(),
			});
		lVoeux.Genre = this.estIntentionProvisoire
			? TypeRubriqueOrientation_1.TypeRubriqueOrientation.RO_IntentionFamille
			: TypeRubriqueOrientation_1.TypeRubriqueOrientation.RO_VoeuDefinitif;
		if (lVoeux.avecAvisSaisie || lVoeux.propositionCC) {
			return this.constuireVoeuxConsultation(aIndiceVoeux);
		}
		lVoeux.rang = aIndiceVoeux + 1;
		const lJSXSpecialiteDisplay = () => {
			var _a, _b;
			return (
				lVoeux.existe() &&
				((_b =
					(_a =
						lVoeux === null || lVoeux === void 0
							? void 0
							: lVoeux.orientation) === null || _a === void 0
						? void 0
						: _a.listeSpecialites) === null || _b === void 0
					? void 0
					: _b.count()) > 0
			);
		};
		const lJSXOptionDisplay = () => {
			var _a, _b, _c, _d;
			return (
				((_b =
					(_a = this.rubriqueSelectionne) === null || _a === void 0
						? void 0
						: _a.maquette) === null || _b === void 0
					? void 0
					: _b.nombreOptions) > 0 &&
				lVoeux.existe() &&
				((_d =
					(_c =
						lVoeux === null || lVoeux === void 0
							? void 0
							: lVoeux.orientation) === null || _c === void 0
						? void 0
						: _c.listeOptions) === null || _d === void 0
					? void 0
					: _d.count()) > 0
			);
		};
		const lJSXCommentaireDisplay = () => {
			var _a, _b, _c;
			return (
				((_b =
					(_a = this.rubriqueSelectionne) === null || _a === void 0
						? void 0
						: _a.maquette) === null || _b === void 0
					? void 0
					: _b.avecCommentaireFamille) &&
				lVoeux.existe() &&
				((_c =
					lVoeux === null || lVoeux === void 0
						? void 0
						: lVoeux.orientation) === null || _c === void 0
					? void 0
					: _c.existeNumero())
			);
		};
		const lJSXBtnSupprimerDisplay = () => {
			var _a;
			return (
				lVoeux.existe() &&
				((_a =
					lVoeux === null || lVoeux === void 0
						? void 0
						: lVoeux.orientation) === null || _a === void 0
					? void 0
					: _a.existeNumero())
			);
		};
		const lJSXCbStagePasserelle = () => {
			var _a, _b, _c;
			return (
				((_b =
					(_a = this.rubriqueSelectionne) === null || _a === void 0
						? void 0
						: _a.maquette) === null || _b === void 0
					? void 0
					: _b.avecStagePasserelleFamille) &&
				lVoeux.existe() &&
				((_c =
					lVoeux === null || lVoeux === void 0
						? void 0
						: lVoeux.orientation) === null || _c === void 0
					? void 0
					: _c.existeNumero()) &&
				lVoeux.orientation.estVoiePro
			);
		};
		const lIdOrientation = GUID_1.GUID.getId();
		const lIdSpecialite = GUID_1.GUID.getId();
		const lIdOption = GUID_1.GUID.getId();
		const lIdCommentaire = GUID_1.GUID.getId();
		return IE.jsx.str(
			"li",
			{ class: ["m-all-xl", "flex-contain", "cols"] },
			IE.jsx.str(
				"fieldset",
				null,
				IE.jsx.str(
					"legend",
					{ class: ["ie-titre", "m-all", "fluid-bloc"] },
					" ",
					GlossaireOrientation_1.TradGlossaireOrientation.Voeux.format([
						aIndiceVoeux + 1,
					]),
					" ",
				),
				IE.jsx.str(
					"label",
					{ id: lIdOrientation },
					GlossaireOrientation_1.TradGlossaireOrientation.Orientation,
				),
				IE.jsx.str("ie-btnselecteur", {
					"aria-labelledby": lIdOrientation,
					"ie-model": this.jsxModelBtnSelecteurOrientationSaisie.bind(
						this,
						lVoeux,
					),
					class: "fluid-bloc m-bottom-xl",
				}),
				IE.jsx.str(
					"div",
					{ class: ["full-width"] },
					IE.jsx.str(
						"ie-checkbox",
						{
							"ie-model": this.jsxModelCheckboxStagePasserelle.bind(
								this,
								lVoeux,
							),
							"ie-display": lJSXCbStagePasserelle,
							class: "fluid-bloc m-bottom-xl",
						},
						GlossaireOrientation_1.TradGlossaireOrientation.Ressources
							.DemandeStagePasserelle,
					),
				),
				IE.jsx.str(
					"label",
					{ id: lIdSpecialite, "ie-display": lJSXSpecialiteDisplay },
					GlossaireOrientation_1.TradGlossaireOrientation.Specialite,
				),
				IE.jsx.str("ie-btnselecteur", {
					"aria-labelledby": lIdSpecialite,
					"ie-model": this.jsxModelBtnSelecteurSpecialites.bind(this, lVoeux),
					"ie-display": lJSXSpecialiteDisplay,
					class: "fluid-bloc chips-inside m-bottom-xl",
				}),
				IE.jsx.str(
					"label",
					{ id: lIdOption, "ie-display": lJSXOptionDisplay },
					GlossaireOrientation_1.TradGlossaireOrientation.Option,
				),
				IE.jsx.str("ie-btnselecteur", {
					"aria-labelledby": lIdOption,
					"ie-model": this.jsxModelBtnSelecteurOptions.bind(this, lVoeux),
					"ie-display": lJSXOptionDisplay,
					class: "fluid-bloc chips-inside m-bottom-xl",
				}),
				IE.jsx.str(
					"label",
					{ for: lIdCommentaire, "ie-display": lJSXCommentaireDisplay },
					GlossaireOrientation_1.TradGlossaireOrientation.Ressources
						.Commentaire,
				),
				IE.jsx.str("ie-textareamax", {
					id: lIdCommentaire,
					"ie-model": this.jsxModelCommentaire.bind(this, lVoeux),
					maxlength: 255,
					"ie-display": lJSXCommentaireDisplay,
				}),
				IE.jsx.str(
					"div",
					{ class: "m-y-l btn-supprimer" },
					IE.jsx.str("ie-btnicon", {
						"ie-model": this.jsxModeleBoutonSupprimer.bind(this, lVoeux),
						"ie-display": lJSXBtnSupprimerDisplay,
						class: ["icon_trash", "avecFond"],
						title:
							GlossaireOrientation_1.TradGlossaireOrientation.SupprimerLeVoeux,
					}),
				),
			),
		);
	}
	construireAvisVoeux(aVoeux) {
		var _a, _b;
		const lVoeuxPublie =
			(aVoeux === null || aVoeux === void 0 ? void 0 : aVoeux.avis) &&
			this.rubriqueSelectionne.estConseilPublie &&
			aVoeux.avecAvisSaisie;
		return (
			lVoeuxPublie &&
			IE.jsx.str(
				"div",
				{ class: "m-y-l" },
				IE.jsx.str(
					"div",
					{ class: "flex-contain cols flex-gap" },
					IE.jsx.str(
						"p",
						null,
						this.estIntentionProvisoire
							? GlossaireOrientation_1.TradGlossaireOrientation.Ressources
									.AvisProvisoireCC
							: GlossaireOrientation_1.TradGlossaireOrientation.Ressources
									.PropositionCC,
						" : ",
					),
					IE.jsx.str(
						"p",
						{ class: ["bold"] },
						" ",
						IE.jsx.str("i", {
							class: [
								TypeAvisConseil_1.TypeAvisConseilUtil.getIcone(
									aVoeux.avis.getGenre(),
								),
								"m-right",
							],
							style: {
								color: TypeAvisConseil_1.TypeAvisConseilUtil.getCouleurIcone(
									aVoeux.avis.getGenre(),
								),
							},
							role: "presentation",
						}),
						((_a =
							aVoeux === null || aVoeux === void 0 ? void 0 : aVoeux.avis) ===
							null || _a === void 0
							? void 0
							: _a.getLibelle()) || "",
					),
					((_b =
						aVoeux === null || aVoeux === void 0 ? void 0 : aVoeux.avis) ===
						null || _b === void 0
						? void 0
						: _b.motivation) && IE.jsx.str("p", null, aVoeux.avis.motivation),
					(aVoeux === null || aVoeux === void 0
						? void 0
						: aVoeux.orientation.avecStageConseil) &&
						IE.jsx.str(
							"p",
							null,
							GlossaireOrientation_1.TradGlossaireOrientation.Ressources
								.StagePasserellePropose,
						),
				),
			)
		);
	}
	construireARIntention() {
		if (this.rubriqueSelectionne.donneesAR === undefined) {
			return "";
		}
		const lTitre = this.rubriqueSelectionne.donneesAR.estEditable
			? GlossaireOrientation_1.TradGlossaireOrientation.RetourAvisConseilClasse
			: GlossaireOrientation_1.TradGlossaireOrientation.AR.RetourFamille;
		return IE.jsx.str(
			"div",
			{ class: "m-all-xl" },
			IE.jsx.str(
				"p",
				{ class: ["ie-titre", "m-bottom-l"] },
				IE.jsx.str("i", {
					class: ["icon_bullhorn", "m-right"],
					role: "presentation",
				}),
				lTitre,
			),
			IE.jsx.str(
				"div",
				null,
				IE.jsx.str(
					"ie-checkbox",
					{
						"ie-model":
							this.jsxModeleCheckboxAccuseReceptionAvisConseil.bind(this),
					},
					this.estProfesseur
						? GlossaireOrientation_1.TradGlossaireOrientation.AR
								.FamillePrisConnaissance
						: GlossaireOrientation_1.TradGlossaireOrientation.AR
								.PrisConnaissance,
				),
				IE.jsx.str(
					"div",
					{
						"ie-if": () => {
							return (
								this.rubriqueSelectionne.donneesAR.avecARStage &&
								this.rubriqueSelectionne.donneesAR.estAccuse ===
									Type3Etats_1.Type3Etats.TE_Oui
							);
						},
					},
					IE.jsx.str(
						"div",
						{ class: ["m-y-xl"] },
						IE.jsx.str(
							"p",
							null,
							GlossaireOrientation_1.TradGlossaireOrientation.AR
								.PropositionCCStageAR,
							":",
						),
						IE.jsx.str(
							"div",
							{ class: ["flex-contain", "cols", "flex-gap-l", "m-top-l"] },
							IE.jsx.str(
								"ie-radio",
								{
									"ie-model": this.jsxModelRadioChoixPropCCStageAR.bind(
										this,
										Type3Etats_1.Type3Etats.TE_Oui,
									),
								},
								GlossaireOrientation_1.TradGlossaireOrientation.AR.Jaccepte,
							),
							IE.jsx.str(
								"ie-radio",
								{
									"ie-model": this.jsxModelRadioChoixPropCCStageAR.bind(
										this,
										Type3Etats_1.Type3Etats.TE_Non,
									),
								},
								GlossaireOrientation_1.TradGlossaireOrientation.AR.JeRefuse,
							),
						),
					),
				),
			),
		);
	}
	_construireARVoeuxDefinitifs() {
		const lJSXCombo = () => {
			return {
				init: (aCombo) => {
					var _a, _b;
					let lIndiceDecision = 0;
					if (
						this.rubriqueSelectionne.donneesAR.estAccuse ===
						Type3Etats_1.Type3Etats.TE_Oui
					) {
						lIndiceDecision = (
							(_b =
								(_a = this.rubriqueSelectionne.donneesAR) === null ||
								_a === void 0
									? void 0
									: _a.decisionRetenue) === null || _b === void 0
								? void 0
								: _b.existeNumero()
						)
							? this.rubriqueSelectionne.donneesAR.listeOrientations.getIndiceParLibelle(
									this.rubriqueSelectionne.donneesAR.decisionRetenue.getLibelle(),
								)
							: 0;
					}
					aCombo.setDonneesObjetSaisie({
						liste: this.rubriqueSelectionne.donneesAR.listeOrientations,
						selection: lIndiceDecision,
					});
					const lActif =
						this.rubriqueSelectionne.donneesAR.estEditable &&
						this.rubriqueSelectionne.donneesAR.estAccuse !==
							Type3Etats_1.Type3Etats.TE_Non;
					aCombo.setActif(lActif);
				},
				event: (aParams) => {
					var _a, _b, _c;
					if (aParams.interactionUtilisateur) {
						if (
							aParams.genreEvenement ===
								Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
									.selection &&
							aParams.element
						) {
							if (
								((_b =
									(_a = this.rubriqueSelectionne) === null || _a === void 0
										? void 0
										: _a.donneesAR) === null || _b === void 0
									? void 0
									: _b.decisionRetenue.getNumero()) ===
								aParams.element.getNumero()
							) {
								return;
							}
							this.rubriqueSelectionne.donneesAR.decisionRetenue =
								aParams.element;
							if (
								((_c = this.rubriqueSelectionne) === null || _c === void 0
									? void 0
									: _c.donneesAR.estAccuse) === Type3Etats_1.Type3Etats.TE_Oui
							) {
								this.saisie(true);
							}
						}
					}
				},
				getDisabled: () => {
					var _a;
					return (
						!this.rubriqueSelectionne.donneesAR.estEditable ||
						((_a = this.rubriqueSelectionne) === null || _a === void 0
							? void 0
							: _a.donneesAR.estAccuse) !== Type3Etats_1.Type3Etats.TE_Oui
					);
				},
			};
		};
		const lTitre = this.rubriqueSelectionne.donneesAR.estEditable
			? GlossaireOrientation_1.TradGlossaireOrientation.ReponseDeLaFamille
			: GlossaireOrientation_1.TradGlossaireOrientation.AR.ReponseFamilleSaisiePar.format(
					[
						this.rubriqueSelectionne.donneesAR.accusePar,
						ObjetDate_1.GDate.formatDate(
							this.rubriqueSelectionne.donneesAR.accuseLe,
							"%JJ %MMMM",
						),
					],
				);
		const lStrAccepte = this.estProfesseur
			? GlossaireOrientation_1.TradGlossaireOrientation.AR
					.LaFamilleAccepteLaPropositionDuConseilDeClasse
			: `${GlossaireOrientation_1.TradGlossaireOrientation.AR.NousAcceptons} ${GlossaireOrientation_1.TradGlossaireOrientation.AR.NousAcceptonsSuite}`;
		const lStrNAcceptePas = this.estProfesseur
			? GlossaireOrientation_1.TradGlossaireOrientation.AR
					.LaFamilleNAcceptePasLaPropositionEtDemandeUnRDV
			: `${GlossaireOrientation_1.TradGlossaireOrientation.AR.NousAcceptonsAucune} ${GlossaireOrientation_1.TradGlossaireOrientation.AR.NousAcceptonsAucuneSuite}`;
		return IE.jsx.str(
			"div",
			{ class: "max-width-vw" },
			IE.jsx.str(
				"p",
				{ class: ["ie-titre", "m-all-xl"] },
				IE.jsx.str("i", {
					class: ["icon_bullhorn", "m-right"],
					role: "presentation",
				}),
				lTitre,
			),
			IE.jsx.str(
				"div",
				{ class: ["m-all-xl"] },
				IE.jsx.str(
					"ie-radio",
					{
						class: "long-text",
						"ie-model": this.jsxRadioAccReceptionProposition.bind(
							this,
							Type3Etats_1.Type3Etats.TE_Oui,
						),
					},
					lStrAccepte,
				),
				IE.jsx.str(
					"div",
					{ class: ["m-left-xxl"] },
					IE.jsx.str("ie-combo", {
						class: ["m-y-l", "full-width"],
						style: "max-width: calc(100% - 3.2rem);",
						"ie-model": lJSXCombo,
						"aria-label":
							GlossaireOrientation_1.TradGlossaireOrientation.TitreListe,
					}),
					IE.jsx.str(
						"p",
						{ "ie-if": () => !this.estProfesseur },
						GlossaireOrientation_1.TradGlossaireOrientation.AR.MsgARProposition,
					),
				),
			),
			IE.jsx.str(
				"ie-radio",
				{
					class: ["m-all-xl", "long-text"],
					"ie-model": this.jsxRadioAccReceptionProposition.bind(
						this,
						Type3Etats_1.Type3Etats.TE_Non,
					),
				},
				lStrNAcceptePas,
			),
		);
	}
	jsxModelBoutonValider(aDonneesAR) {
		return {
			event: () => {
				this.saisie(false);
			},
			getDisabled: () => {
				return false;
			},
		};
	}
	jsxModelCommentaire(aVoeux) {
		return {
			getValue: () => {
				return (
					(aVoeux.existe() &&
						(aVoeux === null || aVoeux === void 0
							? void 0
							: aVoeux.commentaire)) ||
					""
				);
			},
			setValue: (aValue) => {
				aVoeux.commentaire = aValue;
				aVoeux.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			},
		};
	}
	jsxModelBtnSelecteurOrientationSaisie(aVoeux) {
		return {
			event: () => {
				this.ouvrirFenetreRessource({
					genre:
						ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
							.orientation,
					listeRessources: this.listeOrientations,
					voeux: aVoeux,
				});
			},
			getLibelle: () => {
				var _a;
				return (
					aVoeux.existe() &&
					((_a =
						aVoeux === null || aVoeux === void 0
							? void 0
							: aVoeux.orientation) === null || _a === void 0
						? void 0
						: _a.getLibelle())
				);
			},
			getDisabled: () => {
				if (aVoeux.rang === 1) {
					return false;
				}
				const lVoeuxPrecedent = this.rubriqueSelectionne.listeVoeux.get(
					aVoeux.rang - 2,
				);
				return !(
					(lVoeuxPrecedent === null || lVoeuxPrecedent === void 0
						? void 0
						: lVoeuxPrecedent.existe()) &&
					lVoeuxPrecedent.orientation.existeNumero()
				);
			},
		};
	}
	jsxModelBtnSelecteurSpecialites(aVoeux) {
		const jsxModeleChips = (aSpecialite) => {
			return {
				eventBtn: (aEvent) => {
					if (aVoeux && aSpecialite) {
						aVoeux.specialites.removeFilter((aElement) => {
							return aElement.getNumero() === aSpecialite.getNumero();
						});
						aVoeux.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
					aEvent.stopPropagation();
				},
			};
		};
		return {
			event: () => {
				var _a;
				if (
					aVoeux.specialites.count() >=
					aVoeux.orientation.listeSpecialites.count()
				) {
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message:
							GlossaireOrientation_1.TradGlossaireOrientation.Specialites
								.AucuneSpecialiteDisponible,
					});
				} else if (
					aVoeux.specialites.count() >=
					((_a = this.rubriqueSelectionne.maquette) === null || _a === void 0
						? void 0
						: _a.nombreSpecialites)
				) {
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message:
							GlossaireOrientation_1.TradGlossaireOrientation.Specialites
								.AjoutImpossible,
					});
				} else {
					this.ouvrirFenetreRessource({
						genre:
							ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
								.specialite,
						voeux: aVoeux,
						listeRessources: this.filtrerSpecialiteOption(
							aVoeux,
							ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
								.specialite,
						),
					});
				}
			},
			getLibelle: () => {
				const H = [];
				if (aVoeux.existe()) {
					aVoeux === null || aVoeux === void 0
						? void 0
						: aVoeux.specialites.parcourir((aSpecialite) => {
								H.push(
									IE.jsx.str(
										"ie-chips",
										{ "ie-model": jsxModeleChips.bind(this, aSpecialite) },
										aSpecialite.getLibelle(),
									),
								);
							});
				}
				return H.join("");
			},
		};
	}
	jsxModelBtnSelecteurOptions(aVoeux) {
		const jsxModeleChips = (aOption) => {
			return {
				eventBtn: (aEvent) => {
					if (aVoeux && aOption) {
						aVoeux.options.removeFilter((aElement) => {
							return aElement.getNumero() === aOption.getNumero();
						});
					}
					aVoeux.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aEvent.stopPropagation();
				},
			};
		};
		return {
			event: () => {
				var _a, _b;
				if (
					(aVoeux === null || aVoeux === void 0
						? void 0
						: aVoeux.options.count()) >=
					((_a =
						aVoeux === null || aVoeux === void 0
							? void 0
							: aVoeux.orientation) === null || _a === void 0
						? void 0
						: _a.listeOptions.count())
				) {
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message:
							GlossaireOrientation_1.TradGlossaireOrientation.Options
								.AucuneOptionDisponible,
					});
				} else if (
					(aVoeux === null || aVoeux === void 0
						? void 0
						: aVoeux.options.count()) >=
					((_b = this.rubriqueSelectionne.maquette) === null || _b === void 0
						? void 0
						: _b.nombreOptions)
				) {
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message:
							GlossaireOrientation_1.TradGlossaireOrientation.Options
								.AjoutImpossible,
					});
				} else {
					this.ouvrirFenetreRessource({
						genre:
							ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
								.option,
						voeux: aVoeux,
						listeRessources: this.filtrerSpecialiteOption(
							aVoeux,
							ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
								.option,
						),
					});
				}
			},
			getLibelle: () => {
				const H = [];
				if (aVoeux.existe()) {
					aVoeux === null || aVoeux === void 0
						? void 0
						: aVoeux.options.parcourir((aOption) => {
								H.push(
									IE.jsx.str(
										"ie-chips",
										{ "ie-model": jsxModeleChips.bind(this, aOption) },
										aOption.getLibelle(),
									),
								);
							});
				}
				return H.join("");
			},
		};
	}
	jsxModelBtnSelecteurLangue(aGenreLangue) {
		const jsxModeleChips = (aChips, aGenreLangue) => {
			return {
				eventBtn: (aEvent) => {
					var _a;
					if (this.rubriqueLV && aChips) {
						switch (aGenreLangue) {
							case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
								.lv1:
								this.rubriqueLV.LV1 = null;
								break;
							case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
								.lv2:
								(_a = this.rubriqueLV) === null || _a === void 0
									? void 0
									: _a.LV2.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
								break;
							case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
								.lvAutre:
								this.rubriqueLV.LVAutres.removeFilter((aElement) => {
									return aElement.getNumero() === aChips.getNumero();
								});
								break;
							default:
								break;
						}
					}
					this.rubriqueLV.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aEvent.stopPropagation();
				},
			};
		};
		return {
			event: () => {
				var _a, _b, _c;
				let lRessource = new ObjetListeElements_1.ObjetListeElements();
				switch (aGenreLangue) {
					case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.lv1:
						lRessource =
							(this === null || this === void 0
								? void 0
								: this.rubriqueLV.listeLV1) ||
							new ObjetListeElements_1.ObjetListeElements();
						break;
					case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.lv2:
						lRessource =
							(this === null || this === void 0
								? void 0
								: this.rubriqueLV.listeLV2) ||
							new ObjetListeElements_1.ObjetListeElements();
						break;
					case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
						.lvAutre:
						if (
							((_b =
								(_a = this.rubriqueLV) === null || _a === void 0
									? void 0
									: _a.LVAutres) === null || _b === void 0
								? void 0
								: _b.count()) >=
							((_c = this.rubriqueLV.maquette) === null || _c === void 0
								? void 0
								: _c.nombreEnseignementOptionnel)
						) {
							GApplication.getMessage().afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
								message:
									GlossaireOrientation_1.TradGlossaireOrientation.Options
										.AjoutImpossible,
							});
							return;
						}
						lRessource = this.filtrerOptionLangue();
						break;
					default:
						break;
				}
				if (lRessource.count() > 0) {
					this.ouvrirFenetreRessource({
						genre: aGenreLangue,
						listeRessources: lRessource,
					});
				} else {
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message:
							GlossaireOrientation_1.TradGlossaireOrientation.Options
								.AucuneOptionDisponible,
					});
				}
			},
			getLibelle: () => {
				var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
				switch (aGenreLangue) {
					case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.lv1:
						return (
							((_b =
								(_a = this.rubriqueLV) === null || _a === void 0
									? void 0
									: _a.LV1) === null || _b === void 0
								? void 0
								: _b.existe()) &&
							IE.jsx.str(
								"ie-chips",
								{
									"ie-model": jsxModeleChips.bind(
										this,
										(_c = this.rubriqueLV) === null || _c === void 0
											? void 0
											: _c.LV1,
										aGenreLangue,
									),
								},
								((_e =
									(_d = this.rubriqueLV) === null || _d === void 0
										? void 0
										: _d.LV1) === null || _e === void 0
									? void 0
									: _e.getLibelle()) || "",
							)
						);
					case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.lv2:
						return (
							((_g =
								(_f = this.rubriqueLV) === null || _f === void 0
									? void 0
									: _f.LV2) === null || _g === void 0
								? void 0
								: _g.existe()) &&
							IE.jsx.str(
								"ie-chips",
								{
									"ie-model": jsxModeleChips.bind(
										this,
										(_h = this.rubriqueLV) === null || _h === void 0
											? void 0
											: _h.LV2,
										aGenreLangue,
									),
								},
								((_k =
									(_j = this.rubriqueLV) === null || _j === void 0
										? void 0
										: _j.LV2) === null || _k === void 0
									? void 0
									: _k.getLibelle()) || "",
							)
						);
					case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
						.lvAutre: {
						const H = [];
						if (
							(_l = this.rubriqueLV) === null || _l === void 0
								? void 0
								: _l.LVAutres
						) {
							(_m = this.rubriqueLV) === null || _m === void 0
								? void 0
								: _m.LVAutres.parcourir((aOption) => {
										H.push(
											IE.jsx.str(
												"ie-chips",
												{
													"ie-model": jsxModeleChips.bind(
														this,
														aOption,
														aGenreLangue,
													),
												},
												aOption.getLibelle() || "",
											),
										);
									});
						}
						return H.join("");
					}
					default:
						break;
				}
			},
		};
	}
	jsxModeleBoutonSupprimer(aVoeux) {
		return {
			event: () => {
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: GlossaireOrientation_1.TradGlossaireOrientation.Supprimer,
						callback: (aAccepte) => {
							if (aAccepte === Enumere_Action_1.EGenreAction.Valider) {
								this.rubriqueSelectionne.listeVoeux.removeFilter((aElement) => {
									return (
										aElement.rang === aVoeux.rang &&
										aElement.getNumero() === aVoeux.getNumero()
									);
								});
								this.voeuxSupprimes.add(
									MethodesObjet_1.MethodesObjet.dupliquer(aVoeux),
								);
								aVoeux.setNumero(0);
								aVoeux.orientation = new ObjetElement_1.ObjetElement();
								aVoeux.specialites =
									new ObjetListeElements_1.ObjetListeElements();
								aVoeux.options = new ObjetListeElements_1.ObjetListeElements();
								aVoeux.commentaire = "";
								this.rubriqueSelectionne.listeVoeux.add(aVoeux);
								this.afficher();
							}
						},
					});
			},
		};
	}
	jsxModelCheckboxStagePasserelle(aVoeux) {
		return {
			getValue: () => {
				return aVoeux === null || aVoeux === void 0
					? void 0
					: aVoeux.orientation.avecStageFamille;
			},
			setValue: (aValue) => {
				aVoeux.orientation.avecStageFamille = aValue;
				aVoeux.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			},
		};
	}
	jsxModeleCheckboxAccuseReceptionAvisConseil() {
		return {
			getValue: () => {
				var _a, _b;
				return (
					((_b =
						(_a = this.rubriqueSelectionne) === null || _a === void 0
							? void 0
							: _a.donneesAR) === null || _b === void 0
						? void 0
						: _b.estAccuse) === Type3Etats_1.Type3Etats.TE_Oui
				);
			},
			setValue: (aValue) => {
				this.rubriqueSelectionne.donneesAR.estAccuse =
					Type3Etats_1.Type3Etats.TE_Oui;
				this.rubriqueSelectionne.donneesAR.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				this.saisie(true);
			},
			getDisabled: () => {
				var _a;
				return (
					((_a = this.rubriqueSelectionne) === null || _a === void 0
						? void 0
						: _a.donneesAR.estAccuse) === Type3Etats_1.Type3Etats.TE_Oui ||
					!this.rubriqueSelectionne.donneesAR.estEditable
				);
			},
		};
	}
	jsxModelRadioChoixPropCCStageAR(aGenreChoix) {
		return {
			getValue: () => {
				var _a, _b;
				return (
					((_b =
						(_a = this.rubriqueSelectionne) === null || _a === void 0
							? void 0
							: _a.donneesAR) === null || _b === void 0
						? void 0
						: _b.reponseStagePasserelle) === aGenreChoix
				);
			},
			setValue: (aValue) => {
				this.rubriqueSelectionne.donneesAR.reponseStagePasserelle = aGenreChoix;
				this.rubriqueSelectionne.donneesAR.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				this.saisie(true);
			},
			getName: () => {
				return `${this.Nom}_ChoixPropCCStageA`;
			},
			getDisabled: () => {
				var _a;
				return !((_a = this.rubriqueSelectionne) === null || _a === void 0
					? void 0
					: _a.donneesAR.estEditable);
			},
		};
	}
	jsxRadioAccReceptionProposition(aGenreChoix) {
		return {
			getValue: () => {
				var _a, _b;
				return (
					((_b =
						(_a = this.rubriqueSelectionne) === null || _a === void 0
							? void 0
							: _a.donneesAR) === null || _b === void 0
						? void 0
						: _b.estAccuse) === aGenreChoix
				);
			},
			setValue: (aValue) => {
				this.rubriqueSelectionne.donneesAR.estAccuse = aGenreChoix;
				this.rubriqueSelectionne.donneesAR.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				this.saisie(true);
			},
			getName: () => {
				return `${this.Nom}_AccReceptionPropositio`;
			},
			getDisabled: () => {
				var _a;
				return !((_a = this.rubriqueSelectionne) === null || _a === void 0
					? void 0
					: _a.donneesAR.estEditable);
			},
		};
	}
	filtrerSpecialiteOption(aVoeux, aGenre) {
		const lListeFiltre = new ObjetListeElements_1.ObjetListeElements();
		let lListeDonneesSelectionne =
			new ObjetListeElements_1.ObjetListeElements();
		let lListeRessource = new ObjetListeElements_1.ObjetListeElements();
		switch (aGenre) {
			case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
				.specialite:
				lListeDonneesSelectionne = aVoeux.specialites;
				lListeRessource = aVoeux.orientation.listeSpecialites;
				break;
			case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.option:
				lListeDonneesSelectionne = aVoeux.options;
				lListeRessource = aVoeux.orientation.listeOptions;
				break;
			default:
				break;
		}
		const lTableauNumero =
			lListeDonneesSelectionne && lListeDonneesSelectionne.count() > 0
				? lListeDonneesSelectionne.getTableauNumeros()
				: [];
		lListeRessource.parcourir((aLigne) => {
			if (!lTableauNumero.includes(aLigne.getNumero())) {
				lListeFiltre.addElement(aLigne);
			}
		});
		return lListeFiltre;
	}
	filtrerOptionLangue() {
		var _a, _b, _c;
		const lListeFiltre = new ObjetListeElements_1.ObjetListeElements();
		if (
			(_a = this.rubriqueLV) === null || _a === void 0
				? void 0
				: _a.listeLVAutres
		) {
			let lListeDonneesSelectionne =
				((_b = this.rubriqueLV) === null || _b === void 0
					? void 0
					: _b.LVAutres) || new ObjetListeElements_1.ObjetListeElements();
			const lTableauNumero = lListeDonneesSelectionne.getTableauNumeros();
			(_c = this.rubriqueLV) === null || _c === void 0
				? void 0
				: _c.listeLVAutres.parcourir((aLigne) => {
						if (!lTableauNumero.includes(aLigne.getNumero())) {
							lListeFiltre.addElement(aLigne);
						}
					});
		}
		return lListeFiltre;
	}
	ouvrirFenetreRessource(aParam) {
		let lTitre;
		switch (aParam.genre) {
			case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
				.orientation:
				lTitre = GlossaireOrientation_1.TradGlossaireOrientation.TitreListe;
				break;
			case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
				.specialite:
				lTitre =
					GlossaireOrientation_1.TradGlossaireOrientation.Specialites
						.TitreListe;
				break;
			case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.option:
				lTitre =
					GlossaireOrientation_1.TradGlossaireOrientation.Options.TitreListe;
				break;
			case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.lv1:
				lTitre =
					GlossaireOrientation_1.TradGlossaireOrientation.LanguesOptions
						.TitreListeLV1;
				break;
			case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.lv2:
				lTitre =
					GlossaireOrientation_1.TradGlossaireOrientation.LanguesOptions
						.TitreListeLV2;
				break;
			case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.lvAutre:
				lTitre =
					GlossaireOrientation_1.TradGlossaireOrientation.Options.TitreListe;
				break;
			default:
				break;
		}
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_RessourceOrientation_1.ObjetFenetre_RessourceOrientation,
			{
				pere: this,
				evenement: function (aParams) {
					var _a;
					var _b;
					if (this.rubriqueLV) {
						if (
							aParams.genre ===
							ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
								.lvAutre
						) {
							(_a = (_b = this.rubriqueLV).LVAutres) !== null && _a !== void 0
								? _a
								: (_b.LVAutres = new ObjetListeElements_1.ObjetListeElements());
							this.rubriqueLV.LVAutres.add(aParams.element);
						} else {
							const lLV1 =
								aParams.genre ===
								ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.lv1
									? aParams.element
									: this.rubriqueLV.LV1;
							const lLV2 =
								aParams.genre ===
								ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.lv2
									? aParams.element
									: this.rubriqueLV.LV2;
							this.verificationDonnees({ lv1: lLV1, lv2: lLV2 });
						}
					}
				},
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: lTitre,
						listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
					});
				},
			},
		).setDonnees(aParam);
	}
	isRubriqueLV(aRubriqe) {
		return aRubriqe.getGenre() === undefined;
	}
	async verificationDonnees(aDonnees) {
		if (
			aDonnees &&
			aDonnees.lv1 &&
			aDonnees.lv1.existeNumero() &&
			aDonnees.lv2 &&
			aDonnees.lv2.existeNumero()
		) {
			const lReponse =
				await new ObjetRequeteVerificationOrientations_1.ObjetRequeteVerificationOrientations(
					this,
				).lancerRequete({ LV1: aDonnees.lv1, LV2: aDonnees.lv2 });
			if (lReponse.message) {
				await GApplication.getMessage().afficher({
					titre:
						GlossaireOrientation_1.TradGlossaireOrientation.LanguesOptions
							.titreMsgErreur,
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: lReponse.message,
				});
				return;
			}
		}
		this.rubriqueLV.LV1 = aDonnees.lv1;
		this.rubriqueLV.LV2 = aDonnees.lv2;
		this.rubriqueLV.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
	}
	saisie(aSaisieAccuseAR) {
		let lListeVoeux = new ObjetListeElements_1.ObjetListeElements();
		let lDonneesAR = null;
		let lRubriqueLV;
		if (!!aSaisieAccuseAR) {
			lDonneesAR = this.rubriqueSelectionne.donneesAR;
		} else if (this.rubriqueSelectionne) {
			lListeVoeux = MethodesObjet_1.MethodesObjet.dupliquer(
				this === null || this === void 0
					? void 0
					: this.rubriqueSelectionne.listeVoeux,
			);
			this.voeuxSupprimes.parcourir((aVoeu) => {
				if (aVoeu.existeNumero()) {
					aVoeu.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					lListeVoeux.add(aVoeu);
				}
			});
		} else {
			lRubriqueLV = this.rubriqueLV;
		}
		new ObjetRequeteSaisieOrientations_1.ObjetRequeteSaisieOrientations(this)
			.lancerRequete({
				eleve: this.eleve,
				listeVoeux: lListeVoeux,
				donneesAR: lDonneesAR,
				rubriqueLV: lRubriqueLV,
			})
			.then((aReponse) => {
				if (
					aReponse.genreReponse !==
					ObjetRequeteJSON_1.EGenreReponseSaisie.succes
				) {
					return "";
				}
				Toast_1.Toast.afficher({
					msg: GlossaireOrientation_1.TradGlossaireOrientation
						.SaisiePriseEnCompte,
					type: Toast_1.ETypeToast.succes,
				});
				this.callback.appel();
			});
	}
}
exports.PageOrientation = PageOrientation;
