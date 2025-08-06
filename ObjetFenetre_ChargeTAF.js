exports.ObjetFenetre_ChargeTAF = void 0;
const Enumere_DomaineInformation_1 = require("Enumere_DomaineInformation");
const ObjetGrilleCalendrier_1 = require("ObjetGrilleCalendrier");
const GUID_1 = require("GUID");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetFenetreVisuEleveQCM_1 = require("ObjetFenetreVisuEleveQCM");
const ObjetCalendrier_1 = require("ObjetCalendrier");
const ObjetClass_1 = require("ObjetClass");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_AffichageCahierDeTextes_1 = require("Enumere_AffichageCahierDeTextes");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetRequetePageCahierDeTexte_1 = require("ObjetRequetePageCahierDeTexte");
const ObjetUtilitaireCahierDeTexte_1 = require("ObjetUtilitaireCahierDeTexte");
const UtilitaireCDT_1 = require("UtilitaireCDT");
const UtilitaireInitCalendrier_1 = require("UtilitaireInitCalendrier");
const ObjetElement_1 = require("ObjetElement");
const GestionnaireBlocCDT_1 = require("GestionnaireBlocCDT");
const ObjetFenetre_ListeTAFFaits_1 = require("ObjetFenetre_ListeTAFFaits");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const AccessApp_1 = require("AccessApp");
var GenreParam;
(function (GenreParam) {
	GenreParam[(GenreParam["cbDS"] = 2)] = "cbDS";
	GenreParam[(GenreParam["cbTAF"] = 3)] = "cbTAF";
	GenreParam[(GenreParam["cbMatieres"] = 4)] = "cbMatieres";
	GenreParam[(GenreParam["cbDetail"] = 5)] = "cbDetail";
})(GenreParam || (GenreParam = {}));
class ObjetFenetre_ChargeTAF extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.selection = {
			afficherDS: true,
			afficherTAF: true,
			afficherMatieres: false,
			afficherDetail: false,
		};
		this.utilitaireCDT =
			new ObjetUtilitaireCahierDeTexte_1.ObjetUtilitaireCahierDeTexte();
		const lGuid = GUID_1.GUID.getId();
		this.idGrille = lGuid + "_aff";
		this.idFieldset = lGuid + "_field";
		this.setOptionsFenetre({
			modale: false,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("principal.fermer"),
			],
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.titreFenetreChargeTAF",
				[""],
			),
			largeur: 1100,
			hauteur: 600,
			avecRetaillage: true,
			largeurMin: 600,
			hauteurMin: 400,
		});
	}
	jsxIfAffichageChoixClasse() {
		return this.listeClasses && this.listeClasses.count() > 1;
	}
	jsxGetHtmlChoixClasse() {
		const H = [];
		if (this.listeClasses) {
			this.listeClasses.parcourir((aClasse) => {
				H.push(
					IE.jsx.str(
						"ie-radio",
						{
							"ie-model": this.jsxModelRadioChoixClasse.bind(
								this,
								aClasse.getNumero(),
							),
							class: "as-chips m-right",
						},
						aClasse.getLibelle(),
					),
				);
			});
		}
		return H.join("");
	}
	jsxModelRadioChoixClasse(aNumeroClasse) {
		return {
			getValue: () => {
				return this.classeGpe && this.classeGpe.getNumero() === aNumeroClasse;
			},
			setValue: (aValue) => {
				if (this.listeClasses) {
					this.classeGpe = this.listeClasses.getElementParNumero(aNumeroClasse);
					this.executerRequete();
				}
			},
			getName: () => {
				return `${this.Nom}_ChoixClasse`;
			},
		};
	}
	construireInstances() {
		this.identCalendrier = this.add(
			ObjetCalendrier_1.ObjetCalendrier,
			this._evntSurCalendrier.bind(this),
			this._initCalendrier.bind(this),
		);
		this.identCahierDeTexte = this.add(
			ObjetGrilleCalendrier_1.ObjetGrilleCalendrier,
			this._evntSurGrille.bind(this),
			this._initGrilleCalendrier.bind(this),
		);
		this.identFenetreVisuQCM = this.addFenetre(
			ObjetFenetreVisuEleveQCM_1.ObjetFenetreVisuEleveQCM,
		);
	}
	setDonnees(aCours, aListeClasses, aEleve, aNumeroSemaine) {
		this.cours = aCours;
		this.listeClasses = aListeClasses;
		this.eleve = aEleve;
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.titreFenetreChargeTAF",
				[this._getTitre()],
			),
		});
		this.classeGpe = this.listeClasses.get(0);
		this.afficher();
		this.surResizeInterface();
		this.getInstance(this.identCalendrier).setSelection(
			aNumeroSemaine || this.etatUtilisateurSco.getSemaineSelectionnee(),
		);
	}
	filtrerDonnees() {
		this.getInstance(this.identCahierDeTexte).setModeAffichage(
			this.selection.afficherDetail
				? ObjetGrilleCalendrier_1.ObjetGrilleCalendrier.genreAffichage.deployer
				: ObjetGrilleCalendrier_1.ObjetGrilleCalendrier.genreAffichage.fermer,
		);
		this.actualiser();
	}
	jsxModelCheckboxChoixAffichage(aGenre) {
		return {
			getValue: () => {
				const lSelection = this.selection;
				switch (aGenre) {
					case GenreParam.cbDS:
						return lSelection.afficherDS;
					case GenreParam.cbTAF:
						return lSelection.afficherTAF;
					case GenreParam.cbMatieres:
						return lSelection.afficherMatieres;
					case GenreParam.cbDetail:
						return lSelection.afficherDetail;
				}
			},
			setValue: (aValue) => {
				const lSelection = this.selection;
				switch (aGenre) {
					case GenreParam.cbDS:
						lSelection.afficherDS = aValue;
						break;
					case GenreParam.cbTAF:
						lSelection.afficherTAF = aValue;
						break;
					case GenreParam.cbMatieres:
						lSelection.afficherMatieres = aValue;
						break;
					case GenreParam.cbDetail:
						lSelection.afficherDetail = aValue;
						break;
				}
				this.filtrerDonnees();
			},
		};
	}
	composeContenu() {
		const H = [];
		H.push('<div class="flex-contain cols full-height">');
		H.push(
			'<div class="fix-bloc m-bottom-l" id="' +
				this.getNomInstance(this.identCalendrier) +
				'" style="width: 100%;"></div>',
		);
		const lAvecGestionNotation = this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionNotation,
		);
		H.push(
			IE.jsx.str(
				"fieldset",
				{
					id: this.idFieldset,
					class: "fix-bloc Bordure",
					style: "margin: 0 0 0.8rem 0;",
				},
				IE.jsx.str(
					"legend",
					{ class: ObjetClass_1.GClass.getLegende() },
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.afficherOption",
					),
				),
				IE.jsx.str(
					"div",
					{ class: "NoWrap" },
					IE.jsx.str(
						"div",
						{ class: "EspaceBas InlineBlock" },
						IE.jsx.str(
							"ie-checkbox",
							{
								"ie-model": this.jsxModelCheckboxChoixAffichage.bind(
									this,
									GenreParam.cbDS,
								),
								class: "Espace NoWrap",
							},
							lAvecGestionNotation
								? ObjetTraduction_1.GTraductions.getValeur(
										"CahierDeTexte.optionDSEval",
									)
								: ObjetTraduction_1.GTraductions.getValeur(
										"CahierDeTexte.optionEval",
									),
						),
					),
					IE.jsx.str(
						"div",
						{ class: "EspaceBas InlineBlock" },
						IE.jsx.str(
							"ie-checkbox",
							{
								"ie-model": this.jsxModelCheckboxChoixAffichage.bind(
									this,
									GenreParam.cbTAF,
								),
								class: "Espace NoWrap",
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.optionAvecTAF",
							),
						),
					),
					IE.jsx.str(
						"div",
						{ class: "EspaceBas InlineBlock" },
						IE.jsx.str(
							"ie-checkbox",
							{
								"ie-model": this.jsxModelCheckboxChoixAffichage.bind(
									this,
									GenreParam.cbMatieres,
								),
								class: "Espace NoWrap",
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.optionToutesMatieres",
							),
						),
					),
					IE.jsx.str(
						"div",
						{ class: "EspaceBas InlineBlock" },
						IE.jsx.str(
							"ie-checkbox",
							{
								"ie-model": this.jsxModelCheckboxChoixAffichage.bind(
									this,
									GenreParam.cbDetail,
								),
								class: "Espace NoWrap",
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.optionDeployerDetail",
							),
						),
					),
				),
			),
		);
		H.push(
			IE.jsx.str("div", {
				"ie-if": this.jsxIfAffichageChoixClasse.bind(this),
				"ie-html": this.jsxGetHtmlChoixClasse.bind(this),
				class: "fix-bloc m-bottom-l",
			}),
		);
		H.push(
			'<div class="fluid-bloc" id="',
			this.getNomInstance(this.identCahierDeTexte),
			'"></div>',
		);
		H.push("</div>");
		return H.join("");
	}
	evenementSurBlocCDT(aObjet, aElement, aGenreEvnt, aParam) {
		switch (aGenreEvnt) {
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.executionQCM:
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.voirQCM: {
				const lExecQCM =
					aParam && !!aParam.estQCM ? aElement : aElement.executionQCM;
				this.surExecutionQCM(aParam.event, lExecQCM);
				break;
			}
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.detailTAF:
				ObjetFenetre_ListeTAFFaits_1.ObjetFenetre_ListeTAFFaits.ouvrir(
					{ pere: this, evenement: this._evenementFenetreTAFFaits },
					aElement,
				);
				break;
		}
	}
	_evenementFenetreTAFFaits(aGenreBouton) {
		if (
			aGenreBouton ===
			ObjetFenetre_ListeTAFFaits_1.TypeBoutonFenetreTAFFaits.Fermer
		) {
			this.callback.appel({ surModifTAFARendre: true });
			if (this.fenetreCDT) {
				this.fenetreCDT.fermer();
			}
			this.executerRequete();
		}
	}
	actionSurEvntSurCalendrier(aParametres) {
		this.ListeTravailAFaire = aParametres.listeTAF;
		this.ListeCahierDeTextes = aParametres.listeCDT;
		this.listeDS = aParametres.listeDS;
		this.listeMatieres = aParametres.listeMatieres;
		this.actualiser();
	}
	actualiser() {
		const lDonnees = this.formatDonnees();
		this.getInstance(this.identCahierDeTexte).setDonnees(
			IE.Cycles.dateDebutCycle(this.domaine.getPremierePosition(true)),
			IE.Cycles.dateFinCycle(this.domaine.getDernierePosition(true)),
			lDonnees,
			true,
		);
	}
	formatDonnees() {
		return this.utilitaireCDT.formatDonnees({
			modeAffichage:
				Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
					.TravailAFaire,
			listeCDT: this.ListeCahierDeTextes,
			listeTAF: this.ListeTravailAFaire,
			listeDS: this.listeDS,
			listeMatieres: this.listeMatieres,
			avecDS: this.selection.afficherDS,
			avecTAF: this.selection.afficherTAF,
			avecMatieres: this.selection.afficherMatieres,
			avecDetailTAF:
				GEtatUtilisateur.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Professeur,
			nom: this.Nom,
			avecDonneeLe: true,
			estChargeTAF: true,
		});
	}
	surExecutionQCM(aEvent, aElement) {
		if (aEvent) {
			aEvent.stopImmediatePropagation();
		}
		this._evntFiche({ executionQCM: aElement });
	}
	surResizeInterface() {
		super.surResizeInterface();
		this.getInstance(this.identCahierDeTexte).surPostResize();
	}
	surFixerTaille() {
		super.surFixerTaille();
		this.getInstance(this.identCalendrier).surPostResize();
	}
	debutRetaillage() {
		super.debutRetaillage();
		ObjetPosition_1.GPosition.setHeight(
			this.getInstance(this.identCahierDeTexte).getNom(),
			0,
		);
		this.getInstance(this.identCahierDeTexte).surPreResize();
	}
	finRetaillage() {
		super.finRetaillage();
		this.surResizeInterface();
	}
	_initCalendrier(aInstance) {
		UtilitaireInitCalendrier_1.UtilitaireInitCalendrier.init(aInstance);
		aInstance.setDomaineInformation(
			IE.Cycles.getDomaineFerie(),
			Enumere_DomaineInformation_1.EGenreDomaineInformation.Feriee,
		);
	}
	_evntSurCalendrier(aSelection, aDomaine) {
		this.domaine = aDomaine;
		if (this.fenetreCDT) {
			this.fenetreCDT.fermer();
		}
		this.executerRequete();
	}
	_initGrilleCalendrier(aInstance) {
		aInstance.setParametresGrilleCalendrier({
			griseJourAvant: false,
			avecDonneesAvecFondBlanc: true,
		});
		aInstance.setOptions({
			avecDeploiement: false,
			avecSelection: true,
			avecCouleurSelection: false,
		});
	}
	_evntSurGrille(aID, aMatiere) {
		if (aMatiere.ressources.count() > 0) {
			const lCdt = ObjetElement_1.ObjetElement.create({
				Matiere: aMatiere,
				ListeTravailAFaire: this.ListeTravailAFaire,
			});
			UtilitaireCDT_1.TUtilitaireCDT.afficheFenetreDetail(
				this,
				{
					cahiersDeTextes: lCdt,
					genreAffichage:
						Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
							.TravailAFaire,
					gestionnaire: GestionnaireBlocCDT_1.GestionnaireBlocCDT,
				},
				{ evenementSurBlocCDT: this.evenementSurBlocCDT },
			);
		}
	}
	_evntFiche(aParam) {
		if (aParam && aParam.executionQCM) {
			this.getInstance(this.identFenetreVisuQCM).setParametres(
				aParam.executionQCM.getNumero(),
				true,
			);
			this.getInstance(this.identFenetreVisuQCM).setDonnees(
				aParam.executionQCM,
			);
		}
		if (aParam && aParam.surModifTAFARendre) {
			this.callback.appel(aParam);
		}
	}
	_getTitre() {
		if (this.eleve) {
			return this.eleve.getLibelle();
		}
		const lPublics = [];
		if (this.cours && this.cours.ListeContenus) {
			this.cours.ListeContenus.parcourir((aElement) => {
				if (
					aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Groupe
				) {
					lPublics.push(aElement.getLibelle());
				}
			});
			this.cours.ListeContenus.parcourir((aElement) => {
				if (
					aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Classe
				) {
					lPublics.push(aElement.getLibelle());
				}
			});
			this.cours.ListeContenus.parcourir((aElement) => {
				if (
					aElement.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.PartieDeClasse
				) {
					lPublics.push(aElement.getLibelle());
				}
			});
		}
		if (lPublics.length > 0) {
			return lPublics.join(", ");
		}
		if (this.listeClasses && this.listeClasses.count() > 0) {
			return this.listeClasses.getLibelle(0);
		}
	}
	executerRequete() {
		new ObjetRequetePageCahierDeTexte_1.ObjetRequetePageCahierDeTexte(
			this,
			this.actionSurEvntSurCalendrier,
		).lancerRequete({
			domaine: this.domaine,
			ressource: this.eleve ? undefined : this.classeGpe,
			eleve: this.eleve,
		});
	}
}
exports.ObjetFenetre_ChargeTAF = ObjetFenetre_ChargeTAF;
