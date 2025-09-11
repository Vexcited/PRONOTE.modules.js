exports.ObjetInterfaceCommande = void 0;
const Invocateur_1 = require("Invocateur");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const ObjetFenetre_Impression_1 = require("ObjetFenetre_Impression");
const InterfaceCommandeCP_1 = require("InterfaceCommandeCP");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Commande_1 = require("Enumere_Commande");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Connexion_1 = require("Enumere_Connexion");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const MultipleObjetFenetre_ImportFichierProf = require("ObjetFenetre_ImportFichierProf");
const ObjetFenetre_1 = require("ObjetFenetre");
const TypeGenreEchangeDonnees_1 = require("TypeGenreEchangeDonnees");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetRequeteSaisieExportFichierProf_js_1 = require("ObjetRequeteSaisieExportFichierProf.js");
const ObjetNavigateur_1 = require("ObjetNavigateur");
const AccessApp_1 = require("AccessApp");
class ObjetInterfaceCommande extends InterfaceCommandeCP_1.ObjetInterfaceCommandeCP {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationScoEspace = (0, AccessApp_1.getApp)();
		this.etatUtilisateurPN = lApplicationScoEspace.getEtatUtilisateur();
	}
	construireInstances() {
		Invocateur_1.Invocateur.abonner(
			"maj_boutonImpression",
			this._surChoixImpression,
			this,
		);
	}
	jsxIfPresenceBouton(aGenreCommande) {
		const lEstPrimaire = GApplication.estPrimaire;
		switch (aGenreCommande) {
			case Enumere_Commande_1.EGenreCommande.Validation:
				return !lEstPrimaire || this._etatSaisieActif;
			case Enumere_Commande_1.EGenreCommande.ImpressionHTML: {
				const lDisabled =
					!GEtatUtilisateur.impressionCourante ||
					GEtatUtilisateur.impressionCourante.etat ===
						Enumere_GenreImpression_1.EGenreImpression.GenerationPDF ||
					GEtatUtilisateur.impressionCourante.etat ===
						Enumere_GenreImpression_1.EGenreImpression.Aucune;
				return this._estOngletImpressionHtml() && (!lDisabled || !lEstPrimaire);
			}
			case Enumere_Commande_1.EGenreCommande.Impression: {
				const lDisabled =
					!GEtatUtilisateur.impressionCourante ||
					GEtatUtilisateur.impressionCourante.etat !==
						Enumere_GenreImpression_1.EGenreImpression.GenerationPDF;
				return (
					!this._estOngletImpressionHtml() && (!lDisabled || !lEstPrimaire)
				);
			}
		}
		return false;
	}
	estBoutonCommandeDisabled(aGenreCommande) {
		switch (aGenreCommande) {
			case Enumere_Commande_1.EGenreCommande.Validation:
				return !this._etatSaisieActif;
			case Enumere_Commande_1.EGenreCommande.ImpressionHTML: {
				const lDisabled =
					!GEtatUtilisateur.impressionCourante ||
					GEtatUtilisateur.impressionCourante.etat ===
						Enumere_GenreImpression_1.EGenreImpression.GenerationPDF ||
					GEtatUtilisateur.impressionCourante.etat ===
						Enumere_GenreImpression_1.EGenreImpression.Aucune;
				return lDisabled;
			}
			case Enumere_Commande_1.EGenreCommande.Impression: {
				const lDisabled =
					!GEtatUtilisateur.impressionCourante ||
					GEtatUtilisateur.impressionCourante.etat !==
						Enumere_GenreImpression_1.EGenreImpression.GenerationPDF;
				return lDisabled;
			}
		}
		return true;
	}
	jsxModeleBoutonCommande(aGenreCommande) {
		return {
			event: () => {
				this.callback.appel({ genreCmd: aGenreCommande });
			},
			getDisabled: () => {
				return this.estBoutonCommandeDisabled(aGenreCommande);
			},
			getTitle: () => {
				switch (aGenreCommande) {
					case Enumere_Commande_1.EGenreCommande.Validation:
						return !this.estBoutonCommandeDisabled(aGenreCommande)
							? ObjetTraduction_1.GTraductions.getValeur(
									"Commande.Validation.Actif",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"Commande.Validation.Inactif",
								);
					case Enumere_Commande_1.EGenreCommande.ImpressionHTML:
						return !this.estBoutonCommandeDisabled(aGenreCommande)
							? ObjetTraduction_1.GTraductions.getValeur(
									"Commande.Impression.Actif",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"Commande.Impression.Inactif",
								);
					case Enumere_Commande_1.EGenreCommande.Impression:
						return !this.estBoutonCommandeDisabled(aGenreCommande)
							? ObjetTraduction_1.GTraductions.getValeur("Commande.PDF.Actif")
							: ObjetTraduction_1.GTraductions.getValeur(
									"Commande.PDF.Inactif",
								);
				}
				return "";
			},
		};
	}
	jsxIfAfficherBoutonImportExport() {
		return [
			Enumere_Onglet_1.EGenreOnglet.QCM_Saisie,
			Enumere_Onglet_1.EGenreOnglet.QCM_Collaboratif,
			Enumere_Onglet_1.EGenreOnglet.CahierDeTexte_Progression,
			Enumere_Onglet_1.EGenreOnglet.Affectation_Progression,
			Enumere_Onglet_1.EGenreOnglet.BibliothequeProgression,
			Enumere_Onglet_1.EGenreOnglet.RessourcePedagogique,
			Enumere_Onglet_1.EGenreOnglet.RessourcePedagogique_Partage,
		].includes(this.etatUtilisateurPN.getGenreOnglet());
	}
	jsxModeleBoutonImport() {
		return {
			event: () => {
				if (GApplication.getModeExclusif()) {
					GApplication.getMessage().afficher({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"ModeExclusif.UsageExclusif",
						),
						message: ObjetTraduction_1.GTraductions.getValeur(
							"ModeExclusif.SaisieImpossibleConsultation",
						),
					});
				} else {
					if (
						MultipleObjetFenetre_ImportFichierProf &&
						MultipleObjetFenetre_ImportFichierProf.ObjetFenetre_ImportFichierProf
					) {
						(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
							const lFenetreImportFichierProf =
								ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
									MultipleObjetFenetre_ImportFichierProf.ObjetFenetre_ImportFichierProf,
									{
										pere: this,
										initialiser: (aInstanceFenetre) => {
											aInstanceFenetre.setOptionsFenetre({
												titre: ObjetTraduction_1.GTraductions.getValeur(
													"Commande.RecupererFichierDeRessources",
												),
											});
											aInstanceFenetre.setOptions({
												genreFichier:
													TypeGenreEchangeDonnees_1.TypeGenreEchangeDonnees
														.GED_PAS,
											});
										},
									},
								);
							lFenetreImportFichierProf.setDonnees();
						});
					}
				}
			},
		};
	}
	jsxModeleBoutonExport() {
		return {
			event: () => {
				if (
					ObjetRequeteSaisieExportFichierProf_js_1.ObjetRequeteSaisieExportFichierProf
				) {
					(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
						new ObjetRequeteSaisieExportFichierProf_js_1.ObjetRequeteSaisieExportFichierProf(
							{},
						)
							.lancerRequete({
								genreFichier:
									TypeGenreEchangeDonnees_1.TypeGenreEchangeDonnees.GED_PAS,
							})
							.then((aReponse) => {
								var _a;
								if (
									(_a = aReponse.JSONReponse) === null || _a === void 0
										? void 0
										: _a.url
								) {
									window.open(
										ObjetChaine_1.GChaine.encoderUrl(aReponse.JSONReponse.url),
									);
								}
							});
					});
				}
			},
		};
	}
	jsxDisplayModeExclusif() {
		return GApplication.getModeExclusif();
	}
	construireStructureAffichageAutre() {
		const H = [];
		if (
			this.etatUtilisateurPN.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Professeur &&
			!GApplication.getDemo() &&
			this.etatUtilisateurPN.genreConnexion ===
				Enumere_Connexion_1.EGenreConnexion.Normale &&
			!ObjetNavigateur_1.Navigateur.isIpad &&
			!ObjetNavigateur_1.Navigateur.isIphone
		) {
			H.push(
				IE.jsx.str(
					"li",
					{ "ie-if": this.jsxIfAfficherBoutonImportExport.bind(this) },
					IE.jsx.str("ie-btnimage", {
						"ie-model": this.jsxModeleBoutonImport.bind(this),
						class: "icon_download_alt btn-bandeau",
						title: ObjetChaine_1.GChaine.toTitle(
							ObjetTraduction_1.GTraductions.getValeur(
								"Commande.RecupererFichierDeRessources",
							),
						),
						"aria-haspopup": "dialog",
					}),
				),
			);
			H.push(
				IE.jsx.str(
					"li",
					{
						"ie-if": this.jsxIfAfficherBoutonImportExport.bind(this),
						style: "margin-right:10px;",
					},
					IE.jsx.str("ie-btnimage", {
						"ie-model": this.jsxModeleBoutonExport.bind(this),
						class: "icon_upload_alt btn-bandeau",
						title: ObjetChaine_1.GChaine.toTitle(
							ObjetTraduction_1.GTraductions.getValeur(
								"Commande.CreerUnFichierDeRessources",
							),
						),
						"aria-haspopup": "dialog",
					}),
				),
			);
		}
		if (this.etatUtilisateurPN.getAvecSaisie()) {
			H.push(
				IE.jsx.str(
					"li",
					{
						"ie-if": this.jsxIfPresenceBouton.bind(
							this,
							Enumere_Commande_1.EGenreCommande.Validation,
						),
					},
					IE.jsx.str("ie-btnicon", {
						class: "icon_disquette_pleine btn-bandeau",
						"ie-model": this.jsxModeleBoutonCommande.bind(
							this,
							Enumere_Commande_1.EGenreCommande.Validation,
						),
					}),
				),
			);
		}
		H.push(
			IE.jsx.str(
				"li",
				{
					"ie-if": this.jsxIfPresenceBouton.bind(
						this,
						Enumere_Commande_1.EGenreCommande.ImpressionHTML,
					),
				},
				IE.jsx.str("ie-btnicon", {
					class: "icon_print btn-bandeau",
					"ie-model": this.jsxModeleBoutonCommande.bind(
						this,
						Enumere_Commande_1.EGenreCommande.ImpressionHTML,
					),
					"aria-haspopup": "dialog",
				}),
			),
		);
		H.push(
			IE.jsx.str(
				"li",
				{
					"ie-if": this.jsxIfPresenceBouton.bind(
						this,
						Enumere_Commande_1.EGenreCommande.Impression,
					),
				},
				IE.jsx.str("ie-btnicon", {
					class: "icon_pdf btn-bandeau",
					"ie-model": this.jsxModeleBoutonCommande.bind(
						this,
						Enumere_Commande_1.EGenreCommande.Impression,
					),
					"aria-haspopup": "dialog",
				}),
			),
		);
		H.push(
			IE.jsx.str(
				"li",
				{ "ie-display": this.jsxDisplayModeExclusif.bind(this) },
				IE.jsx.str(
					"div",
					{
						class: "Texte12 Gras SansMain",
						style: "background-color:#c15353;color:#ffffff;",
						"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
							"ModeExclusif.EntrerModeExclusif",
						),
						role: "note",
					},
					IE.jsx.str(
						"div",
						{ class: "PetitEspace" },
						ObjetChaine_1.GChaine.insecable(
							ObjetTraduction_1.GTraductions.getValeur(
								"ModeExclusif.ConsultationTemporaire",
							),
						),
					),
				),
			),
		);
		return H.join("");
	}
	actualiserInformationEtatCommande() {
		if (this.instancesActif && this.instancesActif.length > 0) {
			for (let j = 0; j < this.instancesActif.length; j++) {
				let lID = this.Instances[this.instancesActif[j]].IdPremierElement;
				$("#" + lID.escapeJQ()).off("keyup", this.navigationCommandesActif);
			}
		}
		this.instancesActif = [];
		for (let i = 0; i < this.Instances.length; i++) {
			const lInstance = this.Instances[i];
			if (
				lInstance &&
				lInstance.constructor &&
				"_options" in lInstance &&
				lInstance._options.actif
			) {
				this.instancesActif.push(i);
			}
		}
		if (this.instancesActif.length > 0) {
			let lID = this.Instances[this.instancesActif[0]].IdPremierElement;
			if (this.instancesActif.length > 1) {
				for (let j = 0; j < this.instancesActif.length; j++) {
					lID = this.Instances[this.instancesActif[j]].IdPremierElement;
					$("#" + lID.escapeJQ()).on(
						"keyup",
						null,
						{ aObjet: this, index: j },
						this.navigationCommandesActif,
					);
				}
			}
		}
	}
	navigationCommandesActif(event) {
		const lThis = event.data.aObjet;
		const lIndex = event.data.index;
		if (
			ObjetNavigateur_1.Navigateur.isToucheFlecheGauche() ||
			ObjetNavigateur_1.Navigateur.isToucheFlecheHaut()
		) {
			if (lIndex > 0) {
				let lInstance = lThis.Instances[lThis.instancesActif[lIndex - 1]];
				let lID = lInstance.IdPremierElement;
				$("#" + lID.escapeJQ()).focus();
			}
		} else if (
			ObjetNavigateur_1.Navigateur.isToucheFlecheDroite() ||
			ObjetNavigateur_1.Navigateur.isToucheFlecheBas()
		) {
			if (lIndex < lThis.instancesActif.length - 1) {
				let lInstance = lThis.Instances[lThis.instancesActif[lIndex + 1]];
				let lID = lInstance.IdPremierElement;
				$("#" + lID.escapeJQ()).focus();
			}
		}
	}
	_setEtatSaisie(aActif) {
		this._etatSaisieActif = aActif;
		const lPageCourante = GEtatUtilisateur.getPageCourante();
		if (this._etatSaisieActif && (!lPageCourante || !lPageCourante.valider)) {
			this._etatSaisieActif = false;
		}
		this.actualiserInformationEtatCommande();
		this.$refreshSelf();
	}
	_estOngletImpressionHtml() {
		if (
			[
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
			].includes(this.etatUtilisateurPN.GenreEspace) &&
			GEtatUtilisateur.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.SaisieCahierDeTextes
		) {
			return true;
		}
		return [
			Enumere_Onglet_1.EGenreOnglet.Agenda,
			Enumere_Onglet_1.EGenreOnglet.CDT_TAF,
			Enumere_Onglet_1.EGenreOnglet.CDT_Contenu,
			Enumere_Onglet_1.EGenreOnglet.CahierDeTexte,
			Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Competences,
			Enumere_Onglet_1.EGenreOnglet.SaisieNotes,
			Enumere_Onglet_1.EGenreOnglet.Remplacements_Grille,
			Enumere_Onglet_1.EGenreOnglet.Remplacements_Tableau,
			Enumere_Onglet_1.EGenreOnglet.TrombinoscopeClasse,
			Enumere_Onglet_1.EGenreOnglet.Trombinoscope_Professeur,
			Enumere_Onglet_1.EGenreOnglet.Trombinoscope_Personnel,
			Enumere_Onglet_1.EGenreOnglet.Trombinoscope_EquipePedagogique,
		].includes(this.etatUtilisateurPN.getGenreOnglet());
	}
	_surChoixImpression() {
		let lEstImpressionHtml = this._estOngletImpressionHtml();
		ObjetHtml_1.GHtml.setHtml(
			ObjetFenetre_Impression_1.ObjetFenetre_Impression.getZoneImpression(),
			ObjetTraduction_1.GTraductions.getValeur(
				!lEstImpressionHtml ? "MessagePDF" : "MessageImpression",
			),
		);
		this.$refreshSelf();
	}
}
exports.ObjetInterfaceCommande = ObjetInterfaceCommande;
