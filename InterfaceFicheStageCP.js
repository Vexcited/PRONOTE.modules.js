exports.DonneesListe_SelectionOngletStage = exports.ObjetInterfaceFicheStageCP =
	void 0;
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const _InterfacePage_1 = require("_InterfacePage");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetListe_1 = require("ObjetListe");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetFenetre_js_1 = require("ObjetFenetre.js");
class ObjetInterfaceFicheStageCP extends _InterfacePage_1._InterfacePage {
	construireInstances() {
		if (this.parametres.avecSelectionEtudiant) {
			this.identCmbEtudiant = this.add(
				ObjetSaisie_1.ObjetSaisie,
				this.evntCmbEtudiant,
				this.initCmbEtudiant,
			);
		}
		this.identCmbStage = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this.evntCmbStage,
			this._initCmbStage,
		);
		this.identListeOnglet = this.add(
			ObjetListe_1.ObjetListe,
			this.eventModeAffStage,
			this._initialiserListeOnglet,
		);
		this.identPageStage = this.creerInstancePage();
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.IdentZoneAlClient = this.identPageStage;
		this.AddSurZone = [];
		if (this.identCmbEtudiant !== undefined) {
			this.AddSurZone.push(this.identCmbEtudiant);
		}
		if (this.IdentTripleCombo !== undefined) {
			this.AddSurZone.push(this.IdentTripleCombo);
		}
		this.AddSurZone.push(this.identCmbStage);
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push('<div class="InterfaceFicheStage">');
		H.push(
			'<div id="',
			this.getNomInstance(this.identListeOnglet),
			'" class="conteneur-listeOnglet"></div>',
		);
		H.push(
			'<div id="',
			this.getNomInstance(this.identPageStage),
			'" class="conteneur-PageFicheStage"></div>',
		);
		H.push("</div>");
		return H.join("");
	}
	evenementFenetreSuiviStage(aNumeroBouton, aSuiviModifie, aListePJ) {
		if (aNumeroBouton === Enumere_Action_1.EGenreAction.Valider) {
			let lSuiviDuStage = this.stage.listeSuivis.getElementParNumero(
				aSuiviModifie.getNumero(),
			);
			if (
				aSuiviModifie.getEtat() === Enumere_Etat_1.EGenreEtat.Creation &&
				!lSuiviDuStage
			) {
				this.stage.listeSuivis.addElement(aSuiviModifie);
				lSuiviDuStage = aSuiviModifie;
			} else if (lSuiviDuStage) {
				const lIndiceSuiviConcerne =
					this.stage.listeSuivis.getIndiceParNumeroEtGenre(
						aSuiviModifie.getNumero(),
					);
				this.stage.listeSuivis.addElement(aSuiviModifie, lIndiceSuiviConcerne);
			}
			if (!!lSuiviDuStage) {
				if (!!aListePJ) {
					this.listePJSuivis = aListePJ;
				}
				this.setEtatSaisie(true);
				const lInstancePageStage = this.getInstance(this.identPageStage);
				if (lInstancePageStage.actualiserListeSuivis) {
					lInstancePageStage.actualiserListeSuivis(lSuiviDuStage);
				}
			}
		}
	}
	evenementAfficherMessage(aMessage) {
		const lMessage =
			typeof aMessage === "number"
				? ObjetTraduction_1.GTraductions.getValeur("Message")[aMessage]
				: aMessage;
		$("#" + this.getNomInstance(this.identPageStage).escapeJQ())
			.html(this.composeMessage(lMessage))
			.show();
	}
	creerInstancePage() {
		return -1;
	}
	_initialiserListeOnglet(aInstance) {
		const lColonnes = [
			{ id: "ObjetInterfaceFicheStageCP_ListeOnglet", taille: "100%" },
		];
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			hauteurZoneContenuListeMin: 100,
			ariaLabel: GEtatUtilisateur.getLibelleLongOnglet(),
		});
	}
	_initCmbStage(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 265,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreSuiviStage.TypeDeStage",
			),
		});
		aInstance.setVisible(false);
	}
}
exports.ObjetInterfaceFicheStageCP = ObjetInterfaceFicheStageCP;
class DonneesListe_SelectionOngletStage extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aStage) {
		super(aDonnees);
		this.stage = aStage;
		this.setOptions({
			avecEvnt_Selection: true,
			avecTri: false,
			flatDesignMinimal: true,
			avecBoutonActionLigne: false,
		});
	}
	getControleur(aDonneesListe, aListe) {
		return $.extend(true, super.getControleur(aDonneesListe, aListe), {
			getInfoConvention: {
				event: function () {
					const T = [];
					let lIcon = "";
					let lInfoAcc = "";
					let lConventionSigneeElectroniquement = null;
					if (aDonneesListe.stage.listeDocumentsSignes) {
						aDonneesListe.stage.listeDocumentsSignes.parcourir((aDoc) => {
							if (aDoc.estConventionParDefaut) {
								lConventionSigneeElectroniquement = aDoc;
							}
						});
					}
					if (lConventionSigneeElectroniquement) {
						lConventionSigneeElectroniquement.roles.parcourir((aRole) => {
							if (aRole.aSignee) {
								lIcon = "icon_ok";
								lInfoAcc = ObjetTraduction_1.GTraductions.getValeur(
									"FicheStageCP.SigneePar",
								);
							} else {
								lInfoAcc = ObjetTraduction_1.GTraductions.getValeur(
									"FicheStageCP.NonSigneePar",
								);
								lIcon = "icon_remove";
							}
							let lLibelle = aRole.getLibelle();
							if (!aRole.signatureObligatoire) {
								lLibelle += ` (${ObjetTraduction_1.GTraductions.getValeur("FicheStageCP.Optionnel")})`;
							}
							T.push(
								IE.jsx.str(
									IE.jsx.fragment,
									null,
									IE.jsx.str(
										"div",
										{ class: "item-hint" },
										IE.jsx.str("i", {
											class: lIcon,
											"ie-tooltiplabel": lInfoAcc,
											role: "img",
										}),
										lLibelle,
									),
								),
							);
						});
					} else {
						if (aDonneesListe.stage.conventionSigneeEleve) {
							lIcon = "icon_ok";
							lInfoAcc = ObjetTraduction_1.GTraductions.getValeur(
								"FicheStageCP.SigneePar",
							);
						} else {
							lIcon = "icon_remove";
							lInfoAcc = ObjetTraduction_1.GTraductions.getValeur(
								"FicheStageCP.NonSigneePar",
							);
						}
						T.push(
							IE.jsx.str(
								IE.jsx.fragment,
								null,
								IE.jsx.str(
									"div",
									{ class: "item-hint" },
									IE.jsx.str("i", {
										class: lIcon,
										"ie-tooltiplabel": lInfoAcc,
										role: "img",
									}),
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheStage.parEleve",
									),
								),
							),
						);
						if (aDonneesListe.stage.conventionSigneeEntreprise) {
							lIcon = "icon_ok";
							lInfoAcc = ObjetTraduction_1.GTraductions.getValeur(
								"FicheStageCP.SigneePar",
							);
						} else {
							lIcon = "icon_remove";
							lInfoAcc = ObjetTraduction_1.GTraductions.getValeur(
								"FicheStageCP.NonSigneePar",
							);
						}
						T.push(
							IE.jsx.str(
								IE.jsx.fragment,
								null,
								IE.jsx.str(
									"div",
									{ class: "item-hint" },
									IE.jsx.str("i", {
										class: lIcon,
										"ie-tooltiplabel": lInfoAcc,
										role: "img",
									}),
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheStage.parEntreprise",
									),
								),
							),
						);
						if (aDonneesListe.stage.conventionSigneeEtablissement) {
							lIcon = "icon_ok";
							lInfoAcc = ObjetTraduction_1.GTraductions.getValeur(
								"FicheStageCP.SigneePar",
							);
						} else {
							lIcon = "icon_remove";
							lInfoAcc = ObjetTraduction_1.GTraductions.getValeur(
								"FicheStageCP.NonSigneePar",
							);
						}
						T.push(
							IE.jsx.str(
								IE.jsx.fragment,
								null,
								IE.jsx.str(
									"div",
									{ class: "item-hint" },
									IE.jsx.str("i", {
										class: lIcon,
										"ie-tooltiplabel": lInfoAcc,
										role: "img",
									}),
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheStage.parEtablissement",
									),
								),
							),
						);
					}
					aDonneesListe.getInfoConvention(
						IE.jsx.str("div", { class: "hint-convention" }, T.join("")),
					);
				},
			},
		});
	}
	getInfoConvention(aHtml) {
		const lFenetre = ObjetFenetre_js_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_js_1.ObjetFenetre,
			{
				pere: this,
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"FicheStage.conventionSignee",
						),
						largeurMin: 250,
						avecTailleSelonContenu: true,
					});
				},
			},
		);
		lFenetre.afficher(aHtml);
	}
	getIconeGaucheContenuFormate(aParams) {
		return aParams.article.icone;
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.getLibelle();
	}
	getClassCelluleConteneur(aParams) {
		return aParams.article.icone ? "AvecMain" : "";
	}
	avecEvenementSelection(aParams) {
		return !!aParams.article.icone;
	}
}
exports.DonneesListe_SelectionOngletStage = DonneesListe_SelectionOngletStage;
