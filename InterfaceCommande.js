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
const ObjetFenetre_ImportFichierProf = require("ObjetFenetre_ImportFichierProf");
const ObjetFenetre_1 = require("ObjetFenetre");
const TypeGenreEchangeDonnees_1 = require("TypeGenreEchangeDonnees");
const MethodesObjet_1 = require("MethodesObjet");
const jsx_1 = require("jsx");
const ObjetRequeteSaisieExportFichierProf = require("ObjetRequeteSaisieExportFichierProf.js");
class ObjetInterfaceCommande extends InterfaceCommandeCP_1.ObjetInterfaceCommandeCP {
	constructor() {
		super(...arguments);
		this.idCommande = this.Nom + "_Commande";
		this.etatUtilisateurPN = GApplication.getEtatUtilisateur();
	}
	construireInstances() {
		Invocateur_1.Invocateur.abonner(
			"maj_boutonImpression",
			this._surChoixImpression,
			this,
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			modeExclusif: {
				afficher: function () {
					return GApplication.getModeExclusif();
				},
				html: function () {
					const H = [];
					H.push(
						'<div class="Texte12 Gras SansMain" style="background-color:#c15353;color:#ffffff;" title="',
						ObjetChaine_1.GChaine.toTitle(
							ObjetTraduction_1.GTraductions.getValeur(
								"ModeExclusif.EntrerModeExclusif",
							),
						),
						'">',
						'<div class="PetitEspace">',
						ObjetChaine_1.GChaine.insecable(
							ObjetTraduction_1.GTraductions.getValeur(
								"ModeExclusif.ConsultationTemporaire",
							),
						),
						"</div>",
						"</div>",
					);
					return H.join("");
				},
			},
			btnCommmande: {
				event(aGenre) {
					aInstance.callback.appel({ genreCmd: aGenre });
				},
				getDisabled(aGenre) {
					switch (aGenre) {
						case Enumere_Commande_1.EGenreCommande.Validation:
							return !aInstance._etatSaisieActif;
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
				},
				getTitle(aGenre, aNode, aData) {
					switch (aGenre) {
						case Enumere_Commande_1.EGenreCommande.Validation:
							return !aData.$disabled
								? ObjetTraduction_1.GTraductions.getValeur(
										"Commande.Validation.Actif",
									)
								: ObjetTraduction_1.GTraductions.getValeur(
										"Commande.Validation.Inactif",
									);
						case Enumere_Commande_1.EGenreCommande.ImpressionHTML:
							return !aData.$disabled
								? ObjetTraduction_1.GTraductions.getValeur(
										"Commande.Impression.Actif",
									)
								: ObjetTraduction_1.GTraductions.getValeur(
										"Commande.Impression.Inactif",
									);
						case Enumere_Commande_1.EGenreCommande.Impression:
							return !aData.$disabled
								? ObjetTraduction_1.GTraductions.getValeur("Commande.PDF.Actif")
								: ObjetTraduction_1.GTraductions.getValeur(
										"Commande.PDF.Inactif",
									);
					}
					return "";
				},
			},
			getIf(aGenre) {
				const lEstPrimaire = GApplication.estPrimaire;
				switch (aGenre) {
					case Enumere_Commande_1.EGenreCommande.Validation:
						return !lEstPrimaire || aInstance._etatSaisieActif;
					case Enumere_Commande_1.EGenreCommande.ImpressionHTML: {
						const lDisabled =
							!GEtatUtilisateur.impressionCourante ||
							GEtatUtilisateur.impressionCourante.etat ===
								Enumere_GenreImpression_1.EGenreImpression.GenerationPDF ||
							GEtatUtilisateur.impressionCourante.etat ===
								Enumere_GenreImpression_1.EGenreImpression.Aucune;
						return (
							aInstance._estOngletImpressionHtml() &&
							(!lDisabled || !lEstPrimaire)
						);
					}
					case Enumere_Commande_1.EGenreCommande.Impression: {
						const lDisabled =
							!GEtatUtilisateur.impressionCourante ||
							GEtatUtilisateur.impressionCourante.etat !==
								Enumere_GenreImpression_1.EGenreImpression.GenerationPDF;
						return (
							!aInstance._estOngletImpressionHtml() &&
							(!lDisabled || !lEstPrimaire)
						);
					}
				}
			},
			afficherBtnImportExport: function () {
				return [
					Enumere_Onglet_1.EGenreOnglet.QCM_Saisie,
					Enumere_Onglet_1.EGenreOnglet.QCM_Collaboratif,
					Enumere_Onglet_1.EGenreOnglet.CahierDeTexte_Progression,
					Enumere_Onglet_1.EGenreOnglet.Affectation_Progression,
					Enumere_Onglet_1.EGenreOnglet.BibliothequeProgression,
					Enumere_Onglet_1.EGenreOnglet.RessourcePedagogique,
					Enumere_Onglet_1.EGenreOnglet.RessourcePedagogique_Partage,
				].includes(aInstance.etatUtilisateurPN.getGenreOnglet());
			},
			btnImport: {
				event: function () {
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
						(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
							ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
								ObjetFenetre_ImportFichierProf,
								{
									pere: aInstance,
									initialiser: (aInstance) => {
										aInstance.setOptionsFenetre({
											titre: ObjetTraduction_1.GTraductions.getValeur(
												"Commande.RecupererFichierDeRessources",
											),
										});
										aInstance.setOptions({
											genreFichier:
												TypeGenreEchangeDonnees_1.TypeGenreEchangeDonnees
													.GED_PAS,
										});
									},
								},
							).setDonnees();
						});
					}
				},
			},
			btnExport: {
				event: function () {
					(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
						if (ObjetRequeteSaisieExportFichierProf) {
							new ObjetRequeteSaisieExportFichierProf({}, (aEchec, aUrl) => {
								if (aEchec || !aUrl) {
									return;
								}
								window.open(ObjetChaine_1.GChaine.encoderUrl(aUrl));
							}).lancerRequete({
								genreFichier:
									TypeGenreEchangeDonnees_1.TypeGenreEchangeDonnees.GED_PAS,
							});
						}
					});
				},
			},
		});
	}
	construireStructureAffichageAutre() {
		const H = [];
		if (
			this.etatUtilisateurPN.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Professeur &&
			!GApplication.getDemo() &&
			this.etatUtilisateurPN.genreConnexion ===
				Enumere_Connexion_1.EGenreConnexion.Normale &&
			!GNavigateur.isIpad &&
			!GNavigateur.isIphone
		) {
			H.push(
				'<div ie-if="afficherBtnImportExport">',
				'<ie-btnimage ie-model="btnImport" class="icon_download_alt btn-bandeau" title="',
				ObjetChaine_1.GChaine.toTitle(
					ObjetTraduction_1.GTraductions.getValeur(
						"Commande.RecupererFichierDeRessources",
					),
				),
				'"></ie-btnimage>',
				"</div>",
			);
			H.push(
				'<div ie-if="afficherBtnImportExport" style="margin-right:10px;">',
				'<ie-btnimage ie-model="btnExport" class="icon_upload_alt btn-bandeau" title="',
				ObjetChaine_1.GChaine.toTitle(
					ObjetTraduction_1.GTraductions.getValeur(
						"Commande.CreerUnFichierDeRessources",
					),
				),
				'"></ie-btnimage>',
				"</div>",
			);
		}
		if (this.etatUtilisateurPN.getAvecSaisie()) {
			H.push(
				IE.jsx.str("ie-btnicon", {
					class: "icon_disquette_pleine btn-bandeau",
					"ie-model": (0, jsx_1.jsxFuncAttr)("btnCommmande", [
						Enumere_Commande_1.EGenreCommande.Validation,
					]),
					"ie-if": (0, jsx_1.jsxFuncAttr)("getIf", [
						Enumere_Commande_1.EGenreCommande.Validation,
					]),
				}),
			);
		}
		H.push(
			IE.jsx.str("ie-btnicon", {
				class: "icon_print btn-bandeau",
				"ie-model": (0, jsx_1.jsxFuncAttr)("btnCommmande", [
					Enumere_Commande_1.EGenreCommande.ImpressionHTML,
				]),
				"ie-if": (0, jsx_1.jsxFuncAttr)("getIf", [
					Enumere_Commande_1.EGenreCommande.ImpressionHTML,
				]),
			}),
		);
		H.push(
			IE.jsx.str("ie-btnicon", {
				class: "icon_pdf btn-bandeau",
				"ie-model": (0, jsx_1.jsxFuncAttr)("btnCommmande", [
					Enumere_Commande_1.EGenreCommande.Impression,
				]),
				"ie-if": (0, jsx_1.jsxFuncAttr)("getIf", [
					Enumere_Commande_1.EGenreCommande.Impression,
				]),
			}),
		);
		H.push(
			'<div ie-display="modeExclusif.afficher" ie-html="modeExclusif.html"></div>',
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
			GNavigateur.isToucheFlecheGauche() ||
			GNavigateur.isToucheFlecheHaut()
		) {
			if (lIndex > 0) {
				let lInstance = lThis.Instances[lThis.instancesActif[lIndex - 1]];
				let lID = lInstance.IdPremierElement;
				$("#" + lID.escapeJQ()).focus();
			}
		} else if (
			GNavigateur.isToucheFlecheDroite() ||
			GNavigateur.isToucheFlecheBas()
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
			Enumere_Onglet_1.EGenreOnglet.Rencontre_Planning_Liste,
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
