exports.InterfaceFicheLivretScolaire = void 0;
const InterfacePage_1 = require("InterfacePage");
const ObjetListe_1 = require("ObjetListe");
const DonneesListe_FicheLivretScolaire_1 = require("DonneesListe_FicheLivretScolaire");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const ObjetPiedFicheScolaire_1 = require("ObjetPiedFicheScolaire");
const ObjetFicheGraphe_1 = require("ObjetFicheGraphe");
const ObjetRequeteListeCompetencesLivretScolaire_1 = require("ObjetRequeteListeCompetencesLivretScolaire");
const ObjetRequeteLivretScolaire_1 = require("ObjetRequeteLivretScolaire");
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_EvntMenusDeroulants_1 = require("Enumere_EvntMenusDeroulants");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const MultipleObjetAffichagePageAvecMenusDeroulants = require("InterfacePageAvecMenusDeroulants");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_AssistantSaisie_1 = require("ObjetFenetre_AssistantSaisie");
const EBoutonFenetreAssistantSaisie_1 = require("EBoutonFenetreAssistantSaisie");
const ObjetRequeteSaisieLivretScolaire_1 = require("ObjetRequeteSaisieLivretScolaire");
const ObjetRequeteCalculCompetencesLivretScolaire_1 = require("ObjetRequeteCalculCompetencesLivretScolaire");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const Enumere_TypeAppreciation_1 = require("Enumere_TypeAppreciation");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetMoteurAssistantSaisie_1 = require("ObjetMoteurAssistantSaisie");
const TypeOptionMaquetteLivretScolaireStandard_1 = require("TypeOptionMaquetteLivretScolaireStandard");
const ToucheClavier_1 = require("ToucheClavier");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const MultiObjetRequeteSaisieAccuseReceptionDocument = require("ObjetRequeteSaisieAccuseReceptionDocument");
const ObjetFenetre_EditionAppreciationAnnuelleMS_1 = require("ObjetFenetre_EditionAppreciationAnnuelleMS");
const AccessApp_1 = require("AccessApp");
class InterfaceFicheLivretScolaire extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.appScoEspace = (0, AccessApp_1.getApp)();
		this.etatUtilScoEspace = this.appScoEspace.getEtatUtilisateur();
		this.moteur = new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
		this.moteurAssSaisie =
			new ObjetMoteurAssistantSaisie_1.ObjetMoteurAssistantSaisie();
		this.visuJauge = true;
		this.donnees = { libelleBandeau: "", hintLibelleBandeau: "" };
		this.avecGestionAccuseReception =
			this.etatUtilScoEspace.GenreEspace ===
			Enumere_Espace_1.EGenreEspace.Parent;
	}
	construireInstances() {
		this.listeClasseHistorique = null;
		if (
			this.etatUtilScoEspace.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Professeur &&
			(MultipleObjetAffichagePageAvecMenusDeroulants === null ||
			MultipleObjetAffichagePageAvecMenusDeroulants === void 0
				? void 0
				: MultipleObjetAffichagePageAvecMenusDeroulants.ObjetAffichagePageAvecMenusDeroulants)
		) {
			this.identTripleCombo = this.add(
				MultipleObjetAffichagePageAvecMenusDeroulants.ObjetAffichagePageAvecMenusDeroulants,
				this.evenementSurDernierMenuDeroulant,
				this.initialiserTripleCombo,
			);
		}
		if (
			this.identTripleCombo !== null &&
			this.identTripleCombo !== undefined &&
			this.getInstance(this.identTripleCombo) !== null
		) {
			this.IdPremierElement = this.getInstance(
				this.identTripleCombo,
			).getPremierElement();
		}
		if (
			this.etatUtilScoEspace.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche
		) {
			this.IdentPage = this.add(
				ObjetListe_1.ObjetListe,
				this._evntSurListeLivret.bind(this),
				this._initListeLivret.bind(this),
			);
			this.IdentMoyGen = this.add(
				ObjetListe_1.ObjetListe,
				null,
				this._initListeMoyenne.bind(this),
			);
			this.IdentPied = this.add(
				ObjetPiedFicheScolaire_1.ObjetPiedFicheScolaire,
				null,
				null,
			);
		} else {
			if (
				this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Appreciations
			) {
				this.IdentAppreciations = this.add(
					ObjetListe_1.ObjetListe,
					this._evntSurListeLivret.bind(this),
					null,
				);
			}
			if (
				this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Competences
			) {
				this.IdentCompetences = this.add(
					ObjetListe_1.ObjetListe,
					this._evntSurListeCompetences.bind(this),
					null,
				);
			}
			this.IdentResultat = this.add(
				ObjetListe_1.ObjetListe,
				null,
				this._initListeResultat.bind(this),
			);
		}
		if (
			[
				Enumere_Espace_1.EGenreEspace.Eleve,
				Enumere_Espace_1.EGenreEspace.Parent,
			].includes(this.etatUtilScoEspace.GenreEspace)
		) {
			const lEleve = this.etatUtilScoEspace.getMembre();
			const lNrDernierClasse = lEleve.Classe.getNumero();
			if (lEleve && lEleve.listeClasseHistorique) {
				this.listeClasseHistorique =
					lEleve.listeClasseHistorique.getListeElements((aElement) => {
						return (
							(aElement.avecNote && !aElement.avecFiliere) ||
							aElement.getNumero() === lNrDernierClasse
						);
					});
			}
		}
		if (this.listeClasseHistorique && this.listeClasseHistorique.count() > 1) {
			this.identCmbClasseHistorique = this.add(
				ObjetSaisie_1.ObjetSaisie,
				this.evenementClasseHistorique,
				this.initialiserClasseHistorique,
			);
		}
		if (this.avecAssistantSaisie()) {
			this.identFenetreAssistantSaisie = this.add(
				ObjetFenetre_AssistantSaisie_1.ObjetFenetre_AssistantSaisie,
				this._evntSurFenetreAssistantSaisie.bind(this),
				this.moteurAssSaisie.initialiserFenetreAssistantSaisie,
			);
		}
		if (
			this.etatUtilScoEspace.GenreEspace ===
			Enumere_Espace_1.EGenreEspace.Professeur
		) {
			this.construireFicheEleveEtFichePhoto();
		}
		this.avecBoutonGraphe =
			this.etatUtilScoEspace.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche;
		if (this.avecBoutonGraphe) {
			this.identFicheGraphe = this.add(ObjetFicheGraphe_1.ObjetFicheGraphe);
		}
	}
	avecAssistantSaisie() {
		return this.moteurAssSaisie.avecAssistantSaisie({
			typeReleveBulletin:
				TypeReleveBulletin_1.TypeReleveBulletin.LivretScolaire,
		});
	}
	recupererDonnees() {
		var _a, _b;
		if (
			!((_b =
				(_a = this.Pere) === null || _a === void 0
					? void 0
					: _a.getEnConstruction) === null || _b === void 0
				? void 0
				: _b.call(_a))
		) {
			if (
				this.etatUtilScoEspace.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Professeur
			) {
				new ObjetRequeteListeCompetencesLivretScolaire_1.ObjetRequeteListeCompetencesLivretScolaire(
					this,
					this.actionSurListeCompetencesLivretScolaire,
				).lancerRequete();
			} else {
				this.classeSelectionne = this.etatUtilScoEspace.getMembre().Classe;
				if (
					this.listeClasseHistorique &&
					this.listeClasseHistorique.count() > 1
				) {
					const lNumero = this.classeSelectionne.getNumero();
					let lIndice = this.listeClasseHistorique.getIndiceElementParFiltre(
						(aElement) => {
							return aElement.getNumero() === lNumero;
						},
					);
					if (lIndice === -1) {
						lIndice = 0;
					}
					this.getInstance(this.identCmbClasseHistorique).setDonnees(
						this.listeClasseHistorique,
						lIndice,
					);
				} else {
					this.afficherPage();
				}
			}
		}
	}
	initialiserClasseHistorique(aInstance) {
		aInstance.setOptionsObjetSaisie({ longueur: 200 });
	}
	setParametresGeneraux() {
		if (
			this.etatUtilScoEspace.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche
		) {
			this.IdentZoneAlClient = this.IdentPage;
		}
		if (
			this.etatUtilScoEspace.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Appreciations
		) {
			this.IdentZoneAlClient = this.IdentAppreciations;
		}
		if (
			this.etatUtilScoEspace.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Competences
		) {
			this.IdentZoneAlClient = this.IdentCompetences;
		}
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.AddSurZone = [];
		if (MethodesObjet_1.MethodesObjet.isNumber(this.identTripleCombo)) {
			this.AddSurZone.push(this.identTripleCombo);
		}
		if (
			this.etatUtilScoEspace.GenreEspace ===
			Enumere_Espace_1.EGenreEspace.Professeur
		) {
			this.AddSurZone.push({
				html: '<span ie-html="getInformationSorti" class="Italique"></span>',
			});
		}
		this.AddSurZone.push({
			html: '<span ie-if="Bandeau.avecBandeau" class="Gras" ie-html="Bandeau.getLibelle" ie-hint="Bandeau.getHint"></span>',
		});
		if (this.listeClasseHistorique && this.listeClasseHistorique.count() > 1) {
			this.AddSurZone.push(this.identCmbClasseHistorique);
		}
		if (
			this.etatUtilScoEspace.GenreEspace ===
			Enumere_Espace_1.EGenreEspace.Professeur
		) {
			this.AddSurZone.push({
				html: '<span ie-html="getInformationDatePublication"></span>',
			});
		}
		if (
			this.etatUtilScoEspace.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Professeur &&
			this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Competences
		) {
			this.AddSurZone.push({ separateur: true });
			this.AddSurZone.push({
				html:
					'<ie-checkbox class="livretscolaire ls-espace" ie-model="choixJauge" ie-display="choixJauge.visible">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"ficheScolaire.afficherResultatsEvals",
					) +
					"</ie-checkbox>",
			});
			this.AddSurZone.push({
				html:
					'<ie-bouton class="livretscolaire ls-espace small-bt themeBoutonSecondaire" ie-model="calculeAuto" ie-display="calculeAuto.visible">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"ficheScolaire.calculerAutoEval",
					) +
					"</ie-bouton>",
			});
		}
		if (
			this.avecFicheEleve() ||
			this.avecBoutonGraphe ||
			this.avecAssistantSaisie()
		) {
			this.AddSurZone.push({ separateur: true });
			if (this.avecAssistantSaisie()) {
				this.AddSurZone.push({
					html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnAssistantSaisie(
						this.jsxModeleBoutonAssistantSaisie.bind(this),
					),
				});
			}
			this.addSurZoneFicheEleve();
			this.addSurZonePhotoEleve();
			if (this.avecGestionAccuseReception) {
				this.addSurZoneAccuseReception();
			}
			if (this.avecBoutonGraphe) {
				this.AddSurZone.push({ html: this.getHtmlBoutonBandeauGraphe() });
			}
		}
	}
	estAvecBandeau() {
		return (
			this.etatUtilScoEspace.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Professeur ||
			(this.listeClasseHistorique && this.listeClasseHistorique.count() > 1)
		);
	}
	jsxModeleBoutonAssistantSaisie() {
		return {
			event: () => {
				this._evntSurAssistant();
			},
			getTitle: () => {
				return this.moteurAssSaisie.getTitleBoutonAssistantSaisie();
			},
			getSelection: () => {
				return this.etatUtilScoEspace.assistantSaisieActif;
			},
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			Bandeau: {
				avecBandeau: function () {
					return aInstance.estAvecBandeau();
				},
				getLibelle: function () {
					return aInstance.donnees.libelleBandeau;
				},
				getHint: function () {
					return aInstance.donnees.hintLibelleBandeau;
				},
			},
			getInformationSorti: function () {
				return !!aInstance.donnees ? aInstance.donnees.infoSorti || "" : "";
			},
			getInformationDatePublication: function () {
				return !!aInstance.donnees
					? aInstance.donnees.strInfoDatePublication || ""
					: "";
			},
			choixJauge: {
				getValue: function () {
					if (aInstance.visuJauge === undefined) {
						aInstance.visuJauge = true;
					}
					return aInstance.visuJauge;
				},
				setValue: function (aValeur) {
					aInstance.visuJauge = aValeur;
					aInstance._initListeCompetences(
						aInstance.getInstance(aInstance.IdentCompetences),
					);
					aInstance.getInstance(aInstance.IdentCompetences).actualiser();
				},
				visible: function () {
					return aInstance.donnees && aInstance.donnees.avecJauge;
				},
			},
			calculeAuto: {
				event: function () {
					const lmessage = [];
					const lchoixRemplacer = () => {
						return {
							getValue() {
								if (
									aInstance.etatUtilScoEspace.remplacerEvalCompetences ===
									undefined
								) {
									aInstance.etatUtilScoEspace.remplacerEvalCompetences = false;
								}
								return aInstance.etatUtilScoEspace.remplacerEvalCompetences;
							},
							setValue(aValue) {
								aInstance.etatUtilScoEspace.remplacerEvalCompetences = aValue;
							},
						};
					};
					lmessage.push(
						IE.jsx.str(
							"div",
							{ class: "livretscolaire" },
							IE.jsx.str(
								"div",
								{ class: "ls-section-titre" },
								IE.jsx.str(
									"div",
									{ class: "ls-titre" },
									ObjetTraduction_1.GTraductions.getValeur(
										"ficheScolaire.msgAutoEval.titre",
									),
								),
								IE.jsx.str("div", {
									class: "ls-mrfiche",
									"ie-mrfiche": "ficheScolaire.MFicheValidationCompetencesLSL",
								}),
							),
							IE.jsx.str(
								"div",
								{ class: "ls-corps" },
								ObjetTraduction_1.GTraductions.getValeur(
									"ficheScolaire.msgAutoEval.texte",
								),
							),
							IE.jsx.str(
								"div",
								{ class: "ls-choix" },
								IE.jsx.str(
									"ie-checkbox",
									{ "ie-model": lchoixRemplacer },
									ObjetTraduction_1.GTraductions.getValeur(
										"ficheScolaire.msgAutoEval.choix",
									),
								),
							),
						),
					);
					const lThis = aInstance;
					aInstance.appScoEspace.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						width: 450,
						message: lmessage.join(""),
						callback: function (aGenreAction) {
							if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
								lThis.calculCompetencesLivretScolaire(
									aInstance.etatUtilScoEspace.remplacerEvalCompetences,
								);
								aInstance.etatUtilScoEspace.remplacerEvalCompetences = false;
							}
						},
					});
				},
				getDisabled: function () {
					return (
						!aInstance.donnees || !aInstance.donnees.avecCalculeCompetences
					);
				},
				visible: function () {
					return aInstance.donnees && aInstance.donnees.avecJauge;
				},
			},
			cbAccuseReception: {
				getValue: function () {
					const lResponsableAR = aInstance._getResponsableAccuseReception();
					return !!lResponsableAR ? lResponsableAR.aPrisConnaissance : false;
				},
				setValue: function (aValue) {
					const lResponsableAR = aInstance._getResponsableAccuseReception();
					if (!!lResponsableAR) {
						lResponsableAR.aPrisConnaissance = aValue;
						new MultiObjetRequeteSaisieAccuseReceptionDocument.ObjetRequeteSaisieAccuseReceptionDocument(
							aInstance,
						).lancerRequete({
							periode: aInstance.periodeSelectionnee,
							aPrisConnaissance: aValue,
						});
					}
				},
				getDisabled: function () {
					const lResponsableAR = aInstance._getResponsableAccuseReception();
					return !!lResponsableAR ? lResponsableAR.aPrisConnaissance : true;
				},
				estVisible: function () {
					const lResponsableAR = aInstance._getResponsableAccuseReception();
					return (
						!aInstance.avecMessage &&
						aInstance.avecGestionAccuseReception &&
						!!lResponsableAR
					);
				},
			},
		});
	}
	calculCompetencesLivretScolaire(aRemplacer) {
		const lObjet = {
			classe: this.classeSelectionne,
			discipline: this.etatUtilScoEspace.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire,
			),
			nePasRemplacer: !aRemplacer,
		};
		new ObjetRequeteCalculCompetencesLivretScolaire_1.ObjetRequeteCalculCompetencesLivretScolaire(
			this,
			this.actionSurValidation,
		).lancerRequete(lObjet);
	}
	getTitleBoutonGraphe() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"ficheScolaire.boutonGraphe",
		);
	}
	initialiserTripleCombo(aInstance) {
		switch (this.etatUtilScoEspace.getGenreOnglet()) {
			case Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Appreciations:
				aInstance.setParametres([
					Enumere_Ressource_1.EGenreRessource.Classe,
					Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire,
				]);
				break;
			case Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Competences:
				aInstance.setParametres([
					Enumere_Ressource_1.EGenreRessource.Classe,
					Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire,
				]);
				break;
			default:
				aInstance.setParametres([
					Enumere_Ressource_1.EGenreRessource.Classe,
					Enumere_Ressource_1.EGenreRessource.Eleve,
				]);
				break;
		}
		aInstance.setEvenementMenusDeroulants(this.surEvntMenusDeroulants);
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push('<div class="Espace BorderBox" style="height:100%;">');
		if (
			this.etatUtilScoEspace.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche
		) {
			H.push(
				'<div id="',
				this.getInstance(this.IdentPage).getNom(),
				'"></div>',
			);
			H.push(
				'<div id="',
				this.getInstance(this.IdentMoyGen).getNom(),
				'" style="margin-right:5px"></div>',
			);
			H.push(
				'<div id="',
				this.getInstance(this.IdentPied).getNom(),
				'"></div>',
			);
		} else {
			if (
				this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Appreciations
			) {
				H.push(
					'<div id="',
					this.getInstance(this.IdentAppreciations).getNom(),
					'"></div>',
				);
			}
			if (
				this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Competences
			) {
				H.push(
					'<div id="',
					this.getInstance(this.IdentCompetences).getNom(),
					'"></div>',
				);
			}
			H.push(
				'<div class="EspaceHaut" id="',
				this.getInstance(this.IdentResultat).getNom(),
				'"></div>',
			);
		}
		H.push("</div>");
		return H.join("");
	}
	evenementSurDernierMenuDeroulant() {
		if (
			this.etatUtilScoEspace.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche
		) {
			this.surSelectionEleve();
		}
		this.afficherPage();
	}
	evenementClasseHistorique(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection:
				this.classeSelectionne = aParams.element;
				this.afficherPage();
				break;
			case Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
				.deploiement:
				break;
			default:
				break;
		}
	}
	surEvntMenusDeroulants(aParam) {
		super.surEvntMenusDeroulants(aParam);
		const lClasse = this.etatUtilScoEspace.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
		if (
			aParam.genreCombo ===
				Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire &&
			aParam.genreEvenement ===
				Enumere_EvntMenusDeroulants_1.EGenreEvntMenusDeroulants
					.surOuvertureCombo &&
			this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Competences
		) {
			if (
				lClasse &&
				lClasse.getGenre() === Enumere_Ressource_1.EGenreRessource.Classe &&
				!lClasse.avecFiliere
			) {
				this.bloquerDonneesAffichage = true;
			} else {
				this.bloquerDonneesAffichage = false;
			}
		}
		if (
			aParam.genreEvenement ===
				Enumere_EvntMenusDeroulants_1.EGenreEvntMenusDeroulants
					.ressourceNonTrouve &&
			this.getInstance(this.IdentPied)
		) {
			this.getInstance(this.IdentPied).setDonnees(null);
		}
		if (
			aParam.genreEvenement ===
				Enumere_EvntMenusDeroulants_1.EGenreEvntMenusDeroulants
					.ressourceNonTrouve &&
			this.getInstance(this.IdentMoyGen)
		) {
			this.getInstance(this.IdentMoyGen).effacer();
		}
		if (
			aParam.genreEvenement ===
				Enumere_EvntMenusDeroulants_1.EGenreEvntMenusDeroulants
					.ressourceNonTrouve &&
			this.getInstance(this.IdentResultat)
		) {
			this.getInstance(this.IdentResultat).effacer();
		}
		if (
			aParam.genreCombo ===
				Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire &&
			aParam.aucunElement &&
			aParam.genreEvenement ===
				Enumere_EvntMenusDeroulants_1.EGenreEvntMenusDeroulants
					.ressourceNonTrouve
		) {
			if (
				this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Competences
			) {
				if (
					lClasse &&
					lClasse.getGenre() === Enumere_Ressource_1.EGenreRessource.Classe
				) {
					this.evenementAfficherMessage(
						ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.messageClasseSansFiliere",
						),
					);
				} else {
					this.evenementAfficherMessage(
						ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.messageGroupeSansFiliere",
						),
					);
				}
			}
		}
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
	}
	actionSurListeCompetencesLivretScolaire(aDonnees) {
		this.listeSaisie = aDonnees;
	}
	actionSurRecupererDonnees(aDonnees) {
		this.afficherBandeau(true);
		this.donnees = aDonnees;
		this.donnees.listeSaisie = this.listeSaisie;
		this.donnees.classeSelectionne =
			this.etatUtilScoEspace.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			);
		this.listeAccusesReception = aDonnees.listeAccusesReception;
		if (
			this.etatUtilScoEspace.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche
		) {
			this.setGraphe(null);
			const lEleve =
				this.etatUtilScoEspace.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Professeur
					? this.etatUtilScoEspace.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Eleve,
						)
					: this.etatUtilScoEspace.getMembre();
			if (!!this.donnees.graphe) {
				this.setGraphe({
					image: [this.donnees.graphe],
					titre: ObjetChaine_1.GChaine.format(
						ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreGraphe",
						),
						[lEleve.getLibelle()],
					),
					message: ObjetTraduction_1.GTraductions.getValeur(
						"ficheScolaire.pasDAffichageGraphe",
					),
				});
			}
			this.actualiserFicheGraphe();
		}
		if (this.donnees.message) {
			this.evenementAfficherMessage(this.donnees.message);
		} else {
			if (
				this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche
			) {
				if (this.donnees.eleve.listeLivret.count() > 0) {
					this.getInstance(this.IdentPied).setDonnees(
						this.donnees.piedDePage,
						this.donnees.estFilierePro,
						this.donnees.estCasBACPRO,
					);
				} else {
					this.getInstance(this.IdentPied).setDonnees(null);
				}
			}
			let lTailleMax = null;
			if (this.donnees.tailleMaxSaisie) {
				lTailleMax = this.donnees.tailleMaxSaisie;
			}
			this.affichage = {};
			this.affichage.avecRangEleve =
				!this.donnees.options ||
				this.donnees.options.contains(
					TypeOptionMaquetteLivretScolaireStandard_1
						.TypeOptionMaquetteLivretScolaireStandard.OMLST_AvecRangEleve,
				) ||
				this.donnees.estFilierePro;
			this.affichage.avecMoyenneEleve =
				!this.donnees.options ||
				this.donnees.options.contains(
					TypeOptionMaquetteLivretScolaireStandard_1
						.TypeOptionMaquetteLivretScolaireStandard.OMLST_AvecMoyenneEleve,
				) ||
				this.donnees.estFilierePro;
			this.affichage.avecMoyenneClasse =
				this.donnees.genre ===
					Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche &&
				(!this.donnees.options ||
					this.donnees.options.contains(
						TypeOptionMaquetteLivretScolaireStandard_1
							.TypeOptionMaquetteLivretScolaireStandard.OMLST_AvecMoyenneClasse,
					) ||
					this.donnees.estFilierePro);
			this.affichage.avecRepartition =
				this.donnees.genre ===
					Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche &&
				(!this.donnees.options ||
					this.donnees.options.contains(
						TypeOptionMaquetteLivretScolaireStandard_1
							.TypeOptionMaquetteLivretScolaireStandard
							.OMLST_AvecRepartitionMoyenne,
					) ||
					this.donnees.estFilierePro);
			this.affichage.avecCompetences =
				this.donnees.genre ===
					Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche &&
				this.donnees.avecFiliere;
			this.affichage.avecAppreciationsPeriode =
				!this.donnees.options ||
				this.donnees.options.contains(
					TypeOptionMaquetteLivretScolaireStandard_1
						.TypeOptionMaquetteLivretScolaireStandard
						.OMLST_AvecAppreciationsParPeriode,
				);
			this.affichage.avecAppreciations =
				this.affichage.avecAppreciationsPeriode ||
				(this.donnees.options.contains(
					TypeOptionMaquetteLivretScolaireStandard_1
						.TypeOptionMaquetteLivretScolaireStandard.OMLST_AvecAppreciation,
				) &&
					this.donnees.options.contains(
						TypeOptionMaquetteLivretScolaireStandard_1
							.TypeOptionMaquetteLivretScolaireStandard
							.OMLST_AvecMoyenneAnnuelle,
					));
			this.affichage.avecColonneAppreciationsAnnuelles =
				this.donnees.options &&
				(this.donnees.options.contains(
					TypeOptionMaquetteLivretScolaireStandard_1
						.TypeOptionMaquetteLivretScolaireStandard.OMLST_AvecAppreciation,
				) ||
					this.donnees.estFilierePro) &&
				(!this.donnees.options.contains(
					TypeOptionMaquetteLivretScolaireStandard_1
						.TypeOptionMaquetteLivretScolaireStandard.OMLST_AvecMoyenneAnnuelle,
				) ||
					(this.affichage.avecAppreciations &&
						!this.affichage.avecAppreciationsPeriode));
			if (
				this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche
			) {
				this.getInstance(this.IdentPage).setDonnees(
					new DonneesListe_FicheLivretScolaire_1.DonneesListe_FicheLivretScolaire(
						{
							donnees: this.donnees.eleve.listeLivret,
							donneesClasse: this.donnees.classe.listeLivret,
						},
						{
							affichage: this.affichage,
							avecFiliere: this.donnees.avecFiliere,
							initMenuContextuel: this._initMenuContextuel.bind(this),
							instance: this.getInstance(this.IdentPage),
							listeEvaluations: this.listeSaisie,
							tailleMax: lTailleMax,
							eleveRedoublant: this.donnees.eleve.estRedoublant,
						},
					),
				);
				if (!this.donnees.avecFiliere) {
					this.getInstance(this.IdentMoyGen).setDonnees(
						new DonneesListe_FicheLivretScolaire_1.DonneesListe_FicheLivretScolaire(
							{
								donnees: this.donnees.eleve.listeMoyenne,
								donneesClasse: this.donnees.classe.listeMoyenne,
							},
							{
								affichage: this.affichage,
								avecFiliere: this.donnees.avecFiliere,
								initMenuContextuel: null,
								instance: this.getInstance(this.IdentMoyGen),
								listeEvaluations: null,
								tailleMax: null,
							},
						),
					);
				} else {
					this.getInstance(this.IdentMoyGen).effacer();
				}
			} else {
				if (
					this.etatUtilScoEspace.getGenreOnglet() ===
					Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Appreciations
				) {
					this._initListeAppreciations(
						this.getInstance(this.IdentAppreciations),
					);
					this.getInstance(this.IdentAppreciations).setDonnees(
						new DonneesListe_FicheLivretScolaire_1.DonneesListe_FicheLivretScolaire(
							{
								donnees: this.donnees.service.listeLivret,
								donneesClasse: null,
							},
							{
								affichage: this.affichage,
								avecFiliere: null,
								initMenuContextuel: null,
								instance: this.getInstance(this.IdentAppreciations),
								listeEvaluations: null,
								tailleMax: lTailleMax,
							},
						),
					);
				}
				if (
					this.etatUtilScoEspace.getGenreOnglet() ===
					Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Competences
				) {
					this._initListeCompetences(this.getInstance(this.IdentCompetences));
					this.getInstance(this.IdentCompetences).setDonnees(
						new DonneesListe_FicheLivretScolaire_1.DonneesListe_FicheLivretScolaire(
							{
								donnees: this.donnees.service.listeLivret,
								donneesClasse: null,
							},
							{
								affichage: this.affichage,
								avecFiliere: null,
								initMenuContextuel: this._initMenuContextuel.bind(this),
								instance: this.getInstance(this.IdentCompetences),
								listeEvaluations: this.listeSaisie,
								tailleMax: lTailleMax,
							},
						),
					);
				}
				this.getInstance(this.IdentResultat).setDonnees(
					new DonneesListe_FicheLivretScolaire_1.DonneesListe_FicheLivretScolaire(
						{ donnees: this.donnees.service.listeMoyenne, donneesClasse: null },
						{
							affichage: null,
							avecFiliere: null,
							initMenuContextuel: null,
							instance: this.getInstance(this.IdentResultat),
							listeEvaluations: null,
							tailleMax: null,
						},
					),
				);
			}
			if (this.estAvecBandeau()) {
				this.donnees.libelleBandeau = "";
				this.donnees.hintLibelleBandeau = "";
				if (
					(this.donnees.service && this.donnees.service.libelleEnseignement) ||
					(this.donnees.eleve && this.donnees.eleve.libelleEnseignement)
				) {
					this.donnees.libelleBandeau = "&nbsp;";
					const lLibelleEnseignement =
						this.etatUtilScoEspace.getGenreOnglet() ===
						Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche
							? this.donnees.eleve.libelleEnseignement
							: this.donnees.service.libelleEnseignement;
					const lLibelle = ObjetChaine_1.GChaine.getChaine(
						lLibelleEnseignement,
						10,
						true,
						Math.ceil(
							ObjetChaine_1.GChaine.getLongueurChaine(
								lLibelleEnseignement,
								10,
								true,
							),
						),
					);
					this.donnees.libelleBandeau = lLibelle;
					if (lLibelle !== lLibelleEnseignement) {
						this.donnees.hintLibelleBandeau = lLibelleEnseignement;
					}
				}
			}
			this.surResizeInterface();
			if (
				this.etatUtilScoEspace.getGenreOnglet() !==
				Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Competences
			) {
				if (
					!this._estSoumisADroitPourImprimer() ||
					this.appScoEspace.droits.get(
						ObjetDroitsPN_1.TypeDroits.autoriserImpressionBulletinReleveBrevet,
					)
				) {
					Invocateur_1.Invocateur.evenement(
						Invocateur_1.ObjetInvocateur.events.activationImpression,
						this.etatUtilScoEspace.getGenreOnglet() ===
							Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche ||
							this.etatUtilScoEspace.getGenreOnglet() ===
								Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Appreciations
							? Enumere_GenreImpression_1.EGenreImpression.GenerationPDF
							: Enumere_GenreImpression_1.EGenreImpression.Format,
						this,
						() => {
							if (
								this.etatUtilScoEspace.getGenreOnglet() ===
								Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche
							) {
								return {
									genreGenerationPDF:
										TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
											.LivretScolaire,
									eleve:
										this.etatUtilScoEspace.GenreEspace ===
										Enumere_Espace_1.EGenreEspace.Professeur
											? this.etatUtilScoEspace.Navigation.getRessource(
													Enumere_Ressource_1.EGenreRessource.Eleve,
												)
											: this.etatUtilScoEspace.getMembre(),
								};
							}
							const lMetaMatiere =
								this.etatUtilScoEspace.Navigation.getRessource(
									Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire,
								);
							return {
								genreGenerationPDF:
									TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
										.LivretScolaire_Appreciations,
								classe: this.classeSelectionne,
								service: lMetaMatiere.service,
								metaMatiere: lMetaMatiere,
								genreEnseignement:
									lMetaMatiere.typeEnseignement !== null ||
									lMetaMatiere.typeEnseignement !== undefined
										? lMetaMatiere.typeEnseignement
										: undefined,
							};
						},
					);
				}
			}
		}
	}
	getListeTypesAppreciations() {
		this.moteurAssSaisie.getListeTypesAppreciations({
			typeReleveBulletin:
				TypeReleveBulletin_1.TypeReleveBulletin.LivretScolaire,
			clbck: (aListeTypesAppreciations) => {
				this.listeTypesAppreciations = aListeTypesAppreciations;
			},
		});
	}
	traiterValidationAppreciationSelectionnee(aElmtAppreciationSelectionne) {
		const lInstanceListe =
			this.etatUtilScoEspace.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche
				? this.getInstance(this.IdentPage)
				: this.getInstance(this.IdentAppreciations);
		const lCell = lInstanceListe.getDonneesListe().celluleCourante;
		this.setEtatSaisie(true);
		lCell.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		if (
			aElmtAppreciationSelectionne &&
			aElmtAppreciationSelectionne.existeNumero()
		) {
			lCell.appreciationAnnuelle.setEtat(
				Enumere_Etat_1.EGenreEtat.Modification,
			);
			lCell.appreciationAnnuelle.Libelle =
				aElmtAppreciationSelectionne.getLibelle();
			lCell.appreciation = aElmtAppreciationSelectionne.getLibelle();
		}
	}
	getEleve() {
		return this.donnees.eleve;
	}
	valider() {
		this.donnees.genre = this.etatUtilScoEspace.getGenreOnglet();
		this.donnees.listeTypesAppreciations = this.listeTypesAppreciations;
		new ObjetRequeteSaisieLivretScolaire_1.ObjetRequeteSaisieLivretScolaire(
			this,
			this.actionSurValidation,
		).lancerRequete(this.donnees);
	}
	afficherPage() {
		if (
			this.etatUtilScoEspace.GenreEspace ===
			Enumere_Espace_1.EGenreEspace.Professeur
		) {
			this.classeSelectionne = this.etatUtilScoEspace.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			);
			this.getListeTypesAppreciations();
		}
		this.setEtatSaisie(false);
		if (this.bloquerDonneesAffichage) {
			this.getInstance(this.IdentPage).setDonnees(null);
			if (this.getInstance(this.identTripleCombo)) {
				this.getInstance(this.identTripleCombo).afficherCombo(
					Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire,
					false,
				);
			}
			return;
		} else if (
			this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Competences &&
			this.getInstance(this.identTripleCombo)
		) {
			this.getInstance(this.identTripleCombo).afficherCombo(
				Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire,
				true,
			);
		}
		const lObjet = {
			genre: this.etatUtilScoEspace.getGenreOnglet(),
			classe: this.classeSelectionne,
		};
		if (
			this.etatUtilScoEspace.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche
		) {
			lObjet.eleve =
				this.etatUtilScoEspace.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Professeur
					? this.etatUtilScoEspace.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Eleve,
						)
					: this.etatUtilScoEspace.getMembre();
		} else {
			lObjet.discipline = this.etatUtilScoEspace.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire,
			);
		}
		new ObjetRequeteLivretScolaire_1.ObjetRequeteLivretScolaire(
			this,
			this.actionSurRecupererDonnees,
		).lancerRequete(lObjet);
	}
	surResizeInterface() {
		super.surResizeInterface();
	}
	addSurZoneAccuseReception() {
		if (this.avecGestionAccuseReception) {
			this.AddSurZone.push({ separateur: true });
			this.AddSurZone.push({
				html:
					'<ie-checkbox class="AlignementMilieuVertical" ie-model="cbAccuseReception" ie-if="cbAccuseReception.estVisible">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.JAiPrisConnaissanceDuBulletin",
					) +
					"</ie-checkbox>",
			});
			return true;
		}
		return false;
	}
	_getResponsableAccuseReception() {
		let lReponsableAccuseReception = null;
		if (
			!!this.listeAccusesReception &&
			this.listeAccusesReception.count() > 0
		) {
			lReponsableAccuseReception =
				this.listeAccusesReception.getPremierElement();
			if (!!lReponsableAccuseReception) {
			}
		}
		return lReponsableAccuseReception;
	}
	_initMenuContextuel(aParametres) {
		const lThis = this;
		const lInstanceListe = this._getInstanceListeSelonOnglet();
		const lDonneesListe = lInstanceListe.getDonneesListe();
		const lSelections = aParametres.article,
			lMenu = aParametres.menuContextuel,
			lListeEval =
				(lSelections.itemLivretScolaire &&
					lSelections.itemLivretScolaire.estEvaluationLV) ||
				(lSelections.listeCompetences &&
					lSelections.listeCompetences.get(0).estEvaluationLV)
					? lDonneesListe.parametres.listeEvaluations.listeEvaluationsLSLV
					: lDonneesListe.parametres.listeEvaluations.listeEvaluationsLS;
		lListeEval.parcourir((aElement) => {
			aElement.tableauLibelles = [aElement.getLibelle()];
			if (
				aElement.getGenre() === undefined ||
				aElement.getGenre() === null ||
				aElement.getGenre() === -1
			) {
				aElement.raccourci = "0";
			} else if (aElement.getGenre() === 0) {
				aElement.raccourci = "N";
			} else {
				aElement.raccourci = aElement.getGenre().toString();
			}
			aElement.tableauLibelles.push(aElement.raccourci);
		});
		lDonneesListe.listeEval = lListeEval;
		lMenu.setOptions({ largeurColonneGauche: 0 });
		lMenu.addTitre(
			ObjetTraduction_1.GTraductions.getValeur(
				"ficheScolaire.titreSaisieEvaluations",
			),
		);
		for (let i = 0, lNbr = lListeEval.count(); i < lNbr; i++) {
			const lEval = lListeEval.get(i);
			lMenu.add(
				lEval.tableauLibelles || lEval.getLibelle(),
				true,
				function (aLigne) {
					const lParams = Object.assign(aParametres, {
						ligneMenu: aLigne,
						numeroMenu: 0,
						avecActualisation: false,
					});
					lDonneesListe.evenementMenuContextuel(lParams);
					lInstanceListe.setEtatSaisie(true);
					const lElmPage = $("#" + lThis.getNom().escapeJQ());
					const lScroll = lElmPage.scrollTop();
					lInstanceListe.actualiser(true);
					lElmPage.scrollTop(lScroll);
				},
				{ data: i },
			);
		}
	}
	_initListeLivret(aInstance) {
		aInstance.setOptionsListe({
			colonnes: [
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.regroupement,
					titre: {
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColDiscipline",
						),
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColDiscipline",
						),
						estCoche: true,
					},
					taille: 10,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.discipline,
					titre: {
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColDiscipline",
						),
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColDiscipline",
						),
						avecFusionColonne: true,
					},
					taille: 300,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.periode,
					taille: 35,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.anciennesNotes,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.TitreColonneAnneePrecedente",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.HintColonneAnneePrecedente",
						),
					},
					taille: 25,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.rang,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColRang",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColRang",
						),
					},
					taille: 40,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.moyEleve,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColAbbrMoyEleve",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColMoyEleve",
						),
					},
					taille: 40,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.moyClasse,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColAbbrMoyClasse",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColMoyClasse",
						),
					},
					taille: 40,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.inf8,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColInf8",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.Accessible.inf8",
						),
					},
					taille: 40,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.de8a12,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreCol8A12",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.Accessible.de8a12",
						),
					},
					taille: 40,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.sup12,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColSup12",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.Accessible.sup12",
						),
					},
					taille: 40,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.evaluation,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColCompetences",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColCompetences",
						),
					},
					taille: "100%",
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.saisieEval,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColCompetences",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColCompetences",
						),
						avecFusionColonne: true,
					},
					taille: 20,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.appreciation,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColAppreciations",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColAppreciations",
						),
					},
					taille: "100%",
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.apprAnnuelle,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColAppreciationsAnn",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColAppreciationsAnn",
						),
					},
					taille: "100%",
				},
			],
			boutons: [
				{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher },
				{ genre: ObjetListe_1.ObjetListe.typeBouton.deployer },
			],
			hauteurAdapteContenu: Infinity,
		});
	}
	_initListeMoyenne(aInstance) {
		aInstance.setOptionsListe({
			colonnes: [
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.regroupement,
					taille: 10,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.discipline,
					taille: 300,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.periode,
					taille: 35,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.rang,
					taille: 40,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.moyEleve,
					taille: 40,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.moyClasse,
					taille: 40,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.inf8,
					taille: 40,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.de8a12,
					taille: 40,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.sup12,
					taille: 40,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.evaluation,
					taille: "100%",
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.saisieEval,
					taille: 20,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.appreciation,
					taille: "100%",
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.apprAnnuelle,
					taille: "100%",
				},
			],
			avecLigneCreation: false,
			hauteurAdapteContenu: true,
		});
	}
	_initListeAppreciations(aInstance) {
		aInstance.setOptionsListe({
			colonnes: [
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.regroupement,
					titre: {
						title: this.donnees.service.titre,
						libelleHtml: this.donnees.service.titre,
						estCoche: true,
					},
					taille: 5,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.discipline,
					titre: {
						title: this.donnees.service.titre,
						libelleHtml: this.donnees.service.titre,
						avecFusionColonne: true,
					},
					taille: 300,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.periode,
					taille: 35,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.rang,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColRang",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColRang",
						),
					},
					taille: 40,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.moyEleve,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColAbbrMoyEleve",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColMoyEleve",
						),
					},
					taille: 40,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.moyClasse,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColAbbrMoyClasse",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColMoyClasse",
						),
					},
					taille: 40,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.inf8,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColInf8",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.Accessible.inf8",
						),
					},
					taille: 40,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.de8a12,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreCol8A12",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.Accessible.de8a12",
						),
					},
					taille: 40,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.sup12,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColSup12",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.Accessible.sup12",
						),
					},
					taille: 40,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.evaluation,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColCompetences",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColCompetences",
						),
					},
					taille: "100%",
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.saisieEval,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColCompetences",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColCompetences",
						),
						avecFusionColonne: true,
					},
					taille: 20,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.appreciation,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"BulletinEtReleve.Appreciations",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"BulletinEtReleve.Appreciations",
						),
					},
					taille: "100%",
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.apprAnnuelle,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColAppreciationsAnn",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColAppreciationsAnn",
						),
					},
					taille: "100%",
				},
			],
			hauteurAdapteContenu: true,
		});
	}
	_initListeCompetences(aInstance) {
		const lColonnes = [
			{
				id: DonneesListe_FicheLivretScolaire_1.DonneesListe_FicheLivretScolaire
					.colonnes.regroupement,
				titre: {
					title: this.donnees.service.titre,
					libelleHtml: this.donnees.service.titre,
					estCoche: true,
				},
				taille: 5,
			},
			{
				id: DonneesListe_FicheLivretScolaire_1.DonneesListe_FicheLivretScolaire
					.colonnes.discipline,
				titre: {
					title: this.donnees.service.titre,
					libelleHtml: this.donnees.service.titre,
					avecFusionColonne: true,
				},
				taille: 300,
			},
			{
				id: DonneesListe_FicheLivretScolaire_1.DonneesListe_FicheLivretScolaire
					.colonnes.periode,
				taille: 35,
			},
			{
				id: DonneesListe_FicheLivretScolaire_1.DonneesListe_FicheLivretScolaire
					.colonnes.rang,
				titre: {
					libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
						"ficheScolaire.titreColRang",
					),
					nbLignes: 2,
					title: ObjetTraduction_1.GTraductions.getValeur(
						"ficheScolaire.titreColRang",
					),
				},
				taille: 40,
			},
			{
				id: DonneesListe_FicheLivretScolaire_1.DonneesListe_FicheLivretScolaire
					.colonnes.moyEleve,
				titre: {
					libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
						"ficheScolaire.titreColAbbrMoyEleve",
					),
					nbLignes: 2,
					title: ObjetTraduction_1.GTraductions.getValeur(
						"ficheScolaire.titreColMoyEleve",
					),
				},
				taille: 40,
			},
		];
		const lDiscipline = this.donnees.service.listeLivret.get(0);
		const lListeCompetences =
			lDiscipline && lDiscipline.listeCompetences
				? lDiscipline.listeCompetences
				: null;
		if (!!lListeCompetences) {
			for (let i = 0, lNbr = lListeCompetences.count(); i < lNbr; i++) {
				if (this.donnees.avecJauge && this.visuJauge) {
					lColonnes.push({
						id:
							DonneesListe_FicheLivretScolaire_1
								.DonneesListe_FicheLivretScolaire.colonnes.jaugeEval + i,
						rangJauge: i,
						titre: {
							libelleHtml: lListeCompetences.get(i).getLibelle(),
							title: lListeCompetences.get(i).getLibelle(),
							avecFusionColonne: true,
						},
						taille: "80%",
					});
				}
				lColonnes.push({
					id:
						DonneesListe_FicheLivretScolaire_1.DonneesListe_FicheLivretScolaire
							.colonnes.saisieEval + i,
					rangColonne: i,
					titre: {
						libelleHtml: lListeCompetences.get(i).getLibelle(),
						title: lListeCompetences.get(i).getLibelle(),
						avecFusionColonne: true,
					},
					taille: this.donnees.avecJauge && this.visuJauge ? "20%" : "100%",
				});
			}
		} else {
		}
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			hauteurAdapteContenu: Infinity,
		});
	}
	_initListeResultat(aInstance) {
		aInstance.setOptionsListe({
			colonnes: [
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.regroupement,
					taille: 5,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.discipline,
					taille: 300,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.periode,
					taille: 35,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.moyClasse,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColAbbrMoyClasse",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColMoyClasse",
						),
					},
					taille: 40,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.inf8,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColInf8",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.Accessible.inf8",
						),
					},
					taille: 40,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.de8a12,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreCol8A12",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.Accessible.de8a12",
						),
					},
					taille: 40,
				},
				{
					id: DonneesListe_FicheLivretScolaire_1
						.DonneesListe_FicheLivretScolaire.colonnes.sup12,
					titre: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.titreColSup12",
						),
						nbLignes: 2,
						title: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.Accessible.sup12",
						),
					},
					taille: 40,
				},
			],
			avecLigneCreation: false,
			hauteurAdapteContenu: true,
		});
	}
	_evenementFenetreEditionAppr(aParams) {
		if (aParams.numeroBouton === 1) {
			this.elementCourant.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			const lLibelle = [];
			if (aParams.services) {
				for (let index = 0; index < aParams.services.count(); index++) {
					const lService = aParams.services.get(index);
					const lServiceSaisie =
						this.elementCourant.services.getElementParNumero(
							lService.getNumero(),
						);
					if (
						lService.appreciationAnnuelle &&
						lService.appreciationAnnuelle.getEtat() !==
							Enumere_Etat_1.EGenreEtat.Aucun
					) {
						lServiceSaisie.appreciationAnnuelle.setLibelle(
							lService.appreciationAnnuelle.getLibelle(),
						);
						lServiceSaisie.appreciationAnnuelle.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
						lServiceSaisie.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
					lLibelle.push(lService.appreciationAnnuelle.getLibelle());
				}
				const lInstanceListe =
					this.etatUtilScoEspace.getGenreOnglet() ===
					Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche
						? this.getInstance(this.IdentPage)
						: this.getInstance(this.IdentAppreciations);
				const lCell = lInstanceListe.getDonneesListe().celluleCourante;
				this.setEtatSaisie(true);
				lCell.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				lCell.appreciationAnnuelle.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				lCell.appreciationAnnuelle.Libelle = lLibelle.join("\n");
				lCell.appreciation = lLibelle.join("\n");
				lInstanceListe.actualiser(true);
			}
		}
	}
	_evenementSaisieAppreciationMultiService(aParam) {
		if (
			this.etatUtilScoEspace.GenreEspace !==
			Enumere_Espace_1.EGenreEspace.Professeur
		) {
			return;
		}
		this.elementCourant = aParam.article;
		const lAppreciation = aParam.article.appreciation;
		this.objCelluleAppreciation = $.extend(
			{
				article: aParam.article,
				appreciation: lAppreciation,
				idColonne: aParam.idColonne,
			},
			{ ctxPiedBulletin: false },
		);
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_EditionAppreciationAnnuelleMS_1.ObjetFenetre_EditionAppreciationAnnuelleMS,
			{ pere: this, evenement: this._evenementFenetreEditionAppr.bind(this) },
		);
		lFenetre.setDonnees({
			element: this.elementCourant,
			services: this.elementCourant.services,
			tailleMaxSaisie: this.moteur.getTailleMaxAppreciation({
				estCtxPied: false,
				eleve: this.getEleve(),
				typeReleveBulletin:
					TypeReleveBulletin_1.TypeReleveBulletin.LivretScolaire,
				tailleMaxDonneesAffichage: this.donnees.tailleMaxSaisie,
			}),
			moteurAssSaisie: this.moteurAssSaisie,
			listeTypesAppreciations: this.listeTypesAppreciations,
		});
	}
	_evntSurListeLivret(aParam) {
		switch (aParam.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				if (
					aParam.idColonne ===
					DonneesListe_FicheLivretScolaire_1.DonneesListe_FicheLivretScolaire
						.colonnes.saisieEval
				) {
					aParam.ouvrirMenuContextuel();
				} else if (
					aParam.article.services &&
					aParam.article.services.count() > 1
				) {
					this._evenementSaisieAppreciationMultiService(aParam);
				} else {
					if (this.etatUtilScoEspace.assistantSaisieActif) {
						const lAppreciation = aParam.article.appreciation;
						this.moteurAssSaisie.evenementOuvrirAssistantSaisie({
							instanceFenetreAssistantSaisie: this.getInstance(
								this.identFenetreAssistantSaisie,
							),
							listeTypesAppreciations: this.listeTypesAppreciations,
							tabTypeAppreciation:
								Enumere_TypeAppreciation_1.ETypeAppreciationUtil.getTypeAppreciation(
									this.etatUtilScoEspace.getGenreOnglet(),
									lAppreciation,
									false,
								),
							tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
								estCtxPied: false,
								eleve: this.getEleve(),
								typeReleveBulletin:
									TypeReleveBulletin_1.TypeReleveBulletin.LivretScolaire,
								tailleMaxDonneesAffichage: this.donnees.tailleMaxSaisie,
							}),
						});
						this.objCelluleAppreciation = $.extend(
							{
								article: aParam.article,
								appreciation: lAppreciation,
								idColonne: aParam.idColonne,
							},
							{ ctxPiedBulletin: false },
						);
					}
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.KeyPressListe:
				return this._surKeyUpListe(aParam.event, false);
			default:
				break;
		}
	}
	_evntSurListeCompetences(aParam) {
		switch (aParam.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
				let lNouvelleRessource = null;
				const lListeCellulesSelectionnees =
					aParam.instance.getTableauCellulesSelection();
				if (
					!!lListeCellulesSelectionnees &&
					lListeCellulesSelectionnees.length > 0
				) {
					if (
						lListeCellulesSelectionnees.length === 1 &&
						!!lListeCellulesSelectionnees[0]
					) {
						lNouvelleRessource = lListeCellulesSelectionnees[0].article;
					} else {
						for (let i = 0; i < lListeCellulesSelectionnees.length; i++) {
							if (!!lListeCellulesSelectionnees[i]) {
								const lCellule = lListeCellulesSelectionnees[i];
								if (!lNouvelleRessource) {
									lNouvelleRessource = lCellule.article;
								} else if (
									!!lCellule.article &&
									lCellule.article.getNumero() !==
										lNouvelleRessource.getNumero()
								) {
									lNouvelleRessource = null;
									break;
								}
							}
						}
					}
				}
				const lRessourceActuelle =
					this.etatUtilScoEspace.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Eleve,
					);
				if (!!lRessourceActuelle || !!lNouvelleRessource) {
					const lEleve = !!lNouvelleRessource
						? lNouvelleRessource.eleve
						: undefined;
					if (
						(!lRessourceActuelle && !!lEleve) ||
						(!!lRessourceActuelle && !lEleve) ||
						lRessourceActuelle.getNumero() !== lEleve.getNumero()
					) {
						this.etatUtilScoEspace.Navigation.setRessource(
							Enumere_Ressource_1.EGenreRessource.Eleve,
							lEleve,
						);
					}
				}
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				aParam.ouvrirMenuContextuel();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.KeyPressListe:
				return this._surKeyUpListe(aParam.event, true);
			default:
				break;
		}
	}
	_surKeyUpListe(aEvent, aPourCompetences) {
		const lListe = aPourCompetences
			? this.getInstance(this.IdentCompetences)
			: this.getInstance(this.IdentPage);
		const lSelections = lListe.getTableauCellulesSelection();
		let lSelectionCellule = null;
		lSelections.forEach((aSelection) => {
			if (
				DonneesListe_FicheLivretScolaire_1.DonneesListe_FicheLivretScolaire.estUneColonneCompetence(
					aSelection,
				)
			) {
				lSelectionCellule = aSelection;
				return false;
			}
		});
		if (!!lSelectionCellule) {
			let lCompetence = null;
			if (aPourCompetences) {
				lCompetence = lSelectionCellule.article.listeCompetences.get(
					lSelectionCellule.declarationColonne.rangColonne,
				);
			} else {
				lCompetence = lSelectionCellule.article.itemLivretScolaire;
			}
			const lListeEval =
				!!lCompetence && lCompetence.estEvaluationLV
					? this.listeSaisie.listeEvaluationsLSLV
					: this.listeSaisie.listeEvaluationsLS;
			const lCompetenceDEvent = this._getCompetencesDEventClavier(
				aEvent,
				lListeEval,
			);
			if (lCompetenceDEvent) {
				lCompetence.evaluation = lCompetenceDEvent;
				if (lCompetenceDEvent.getGenre() === -1) {
					lCompetence.evaluation.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
				}
				lSelectionCellule.article.setEtat(
					Enumere_Etat_1.EGenreEtat.FilsModification,
				);
				lCompetence.setEtat(Enumere_Etat_1.EGenreEtat.FilsModification);
				this.setEtatSaisie(true);
				const lElmPage = $("#" + this.getNom().escapeJQ());
				const lScroll = lElmPage.scrollTop();
				lListe.actualiser(true);
				lElmPage.scrollTop(lScroll);
				lListe.selectionnerCelluleSuivante({
					orientationVerticale: !aPourCompetences,
					avecCelluleEditable: true,
					entrerEdition: false,
				});
				return true;
			}
		}
	}
	_getCompetencesDEventClavier(aEvent, aListeCompetences) {
		if (!aListeCompetences || !aEvent) {
			return null;
		}
		if (aEvent.ctrlKey || aEvent.altKey) {
			return null;
		}
		let lEventKey =
			!!aEvent.key && !!aEvent.key.toLowerCase ? aEvent.key.toLowerCase() : "";
		const lEstSupprimer =
			aEvent.which === ToucheClavier_1.ToucheClavier.Supprimer ||
			aEvent.which === ToucheClavier_1.ToucheClavier.Backspace ||
			lEventKey === "0";
		let lResult = null;
		if (!!lEventKey || lEstSupprimer) {
			if (lEstSupprimer) {
				lResult = MethodesObjet_1.MethodesObjet.dupliquer(
					aListeCompetences.getElementParGenre(-1),
				);
			} else {
				if (lEventKey === "n") {
					lEventKey = 0;
				}
				const lKeyValue = parseInt(lEventKey);
				if (MethodesObjet_1.MethodesObjet.isNumber(lKeyValue)) {
					aListeCompetences.parcourir((aCompetence) => {
						if (lKeyValue === aCompetence.getGenre()) {
							lResult = aCompetence;
							return false;
						}
					});
				}
			}
		}
		return lResult;
	}
	_getInstanceListeSelonOnglet() {
		let lInstanceListe;
		if (
			this.etatUtilScoEspace.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche
		) {
			lInstanceListe = this.getInstance(this.IdentPage);
		} else if (
			this.etatUtilScoEspace.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Competences
		) {
			lInstanceListe = this.getInstance(this.IdentCompetences);
		} else {
			lInstanceListe = this.getInstance(this.IdentAppreciations);
		}
		return lInstanceListe;
	}
	_evntSurAssistant() {
		const lInstanceListe = this._getInstanceListeSelonOnglet();
		if (
			this.etatUtilScoEspace.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche
		) {
			this.moteurAssSaisie.evntBtnAssistant({
				instanceListe: lInstanceListe,
				instancePied: this.getInstance(this.IdentPied),
			});
		} else if (
			this.etatUtilScoEspace.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Appreciations
		) {
			this.moteurAssSaisie.evntBtnAssistant({
				instanceListe: lInstanceListe,
				instancePied: null,
			});
		}
	}
	_evntSurFenetreAssistantSaisie(aNumeroBouton) {
		const lThis = this;
		const lParam = {
			instanceFenetreAssistantSaisie: this.getInstance(
				this.identFenetreAssistantSaisie,
			),
			eventChangementUtiliserAssSaisie: function () {
				const lInstanceListe = lThis._getInstanceListeSelonOnglet();
				lInstanceListe.actualiser(true);
			},
			evntClbck: this.surEvntAssSaisie.bind(this),
			evntFinallyClbck: this._surEvntFinallyAssSaisie.bind(this),
		};
		this.moteurAssSaisie.evenementAssistantSaisie(aNumeroBouton, lParam);
	}
	_surEvntFinallyAssSaisie(aParam) {
		const lInstanceListe = this._getInstanceListeSelonOnglet();
		if (lInstanceListe !== null && lInstanceListe !== undefined) {
			switch (aParam.cmd) {
				case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
					.Valider: {
					lInstanceListe.actualiser(true);
					lInstanceListe.selectionnerCelluleSuivante({
						orientationVerticale: true,
						avecCelluleEditable: true,
						entrerEdition: true,
						avecSelection: false,
					});
				}
			}
		}
	}
	surEvntAssSaisie(aParam) {
		const lInstanceListe = this._getInstanceListeSelonOnglet();
		if (lInstanceListe !== null && lInstanceListe !== undefined) {
			let lClbck;
			switch (aParam.cmd) {
				case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
					.Valider: {
					lClbck = () => {
						this.traiterValidationAppreciationSelectionnee(
							aParam.eltSelectionne,
						);
					};
					break;
				}
				case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
					.PasserEnSaisie: {
					lClbck = () => {
						const lIdColonneAppreciation = lInstanceListe
							.getOptionsListe()
							.colonnesCachees.includes(
								DonneesListe_FicheLivretScolaire_1
									.DonneesListe_FicheLivretScolaire.colonnes.apprAnnuelle,
							)
							? DonneesListe_FicheLivretScolaire_1
									.DonneesListe_FicheLivretScolaire.colonnes.appreciation
							: DonneesListe_FicheLivretScolaire_1
									.DonneesListe_FicheLivretScolaire.colonnes.apprAnnuelle;
						this.moteurAssSaisie.passerEnSaisie({
							instanceListe: lInstanceListe,
							idColonne: lIdColonneAppreciation,
							ligneCell:
								lInstanceListe.getDonneesListe().celluleCourante.Genre - 1,
						});
					};
					break;
				}
				case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
					.Fermer:
					lClbck = null;
					break;
				default:
			}
			this.moteurAssSaisie.saisirModifAssSaisieAvantTraitement({
				estAssistantModifie: aParam.estAssistantModifie,
				pere: this,
				clbck: lClbck,
			});
		}
	}
	_estSoumisADroitPourImprimer() {
		return (
			this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche &&
			[
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Eleve,
			].includes(this.etatUtilScoEspace.GenreEspace)
		);
	}
}
exports.InterfaceFicheLivretScolaire = InterfaceFicheLivretScolaire;
