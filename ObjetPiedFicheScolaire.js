exports.ObjetPiedFicheScolaire = void 0;
const ObjetRequeteListeAuteurCommentaireLivret_1 = require("ObjetRequeteListeAuteurCommentaireLivret");
const DonneesListe_SelectionSignatairesAvis_1 = require("DonneesListe_SelectionSignatairesAvis");
const GUID_1 = require("GUID");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetCelluleMultiSelection_1 = require("ObjetCelluleMultiSelection");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTabOnglets_1 = require("ObjetTabOnglets");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeAvisCommentaire_1 = require("TypeAvisCommentaire");
const TypeGenreAppreciation_1 = require("TypeGenreAppreciation");
const TypeGenreIndividuAuteur_1 = require("TypeGenreIndividuAuteur");
const ObjetListe_1 = require("ObjetListe");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const DonneesListe_SelectionEngagements_Fd_1 = require("DonneesListe_SelectionEngagements_Fd");
const AccessApp_1 = require("AccessApp");
const TypeModeDAffichagePFMP_1 = require("TypeModeDAffichagePFMP");
const C_ParcoursDifferencie = 99;
class ObjetPiedFicheScolaire extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.appScoEspace = (0, AccessApp_1.getApp)();
		this.etatUtilScoEspace = this.appScoEspace.getEtatUtilisateur();
		this.parametresScoEspace = this.appScoEspace.getObjetParametres();
		this.idRepartition = GUID_1.GUID.getId();
		this.idAvisCE = GUID_1.GUID.getId();
		this.idEngagements = GUID_1.GUID.getId();
		this.idLabelEngagements = GUID_1.GUID.getId();
		this.idAvisInvestissement = GUID_1.GUID.getId();
		this.idPFMP = GUID_1.GUID.getId();
		this.idTitrePfmp = GUID_1.GUID.getId();
		this.idParcoursDiff = GUID_1.GUID.getId();
		this.combo = new ObjetSaisie_1.ObjetSaisie(
			this.Nom + ".combo",
			null,
			this,
			this._evenementSurCombo,
		);
		this.celluleDate = [];
		this.tabOnglets = new ObjetTabOnglets_1.ObjetTabOnglets(
			this.Nom + ".tabOnglets",
			null,
			this,
			this._evenementSurTab,
		);
		this.selectEngagements =
			new ObjetCelluleMultiSelection_1.ObjetCelluleMultiSelection(
				this.Nom + ".selectEngagements",
				null,
				this,
				this._evnSelectEngagements,
			);
		this.listePFMP = new ObjetListe_1.ObjetListe({ pere: this });
		this.hauteurZone = 150;
		this.listePFMP.setOptionsListe(DonneesListe_PFMPOptions);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnMrFiche: {
				event() {
					aInstance.appScoEspace
						.getMessage()
						.afficher({ idRessource: "ficheScolaire.pfmp.MFicheSynthesePFMP" });
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getTitreMFiche(
						"ficheScolaire.pfmp.MFicheSynthesePFMP",
					);
				},
			},
			btnCopie: {
				event() {
					if (aInstance._donnees.pfmp.infosLSEleve.appreciation !== "") {
						aInstance.appScoEspace.getMessage().afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"ficheScolaire.pfmp.confirmationCopierAppreciations",
							),
							callback: function (aGenreAction) {
								if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
									aInstance._remplacerAppreciationPourExport(
										aInstance._donnees.pfmp.appreciationStage,
									);
									aInstance._donnees.pfmp.infosLSEleve.estExportSynthese = true;
								}
							},
						});
					} else {
						aInstance._remplacerAppreciationPourExport(
							aInstance._donnees.pfmp.appreciationStage,
						);
						aInstance._donnees.pfmp.infosLSEleve.estExportSynthese = true;
					}
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"ficheScolaire.pfmp.copierAppreciationsReferents",
					);
				},
				getDisabled: function () {
					return (
						!aInstance._donnees ||
						!aInstance._donnees.pfmp ||
						!aInstance._donnees.pfmp.infosLSEleve ||
						!aInstance._donnees.pfmp.editable ||
						aInstance._donnees.pfmp.infosLSEleve.appreciation ===
							aInstance._donnees.pfmp.appreciationStage
					);
				},
				visible: function () {
					return (
						!!aInstance._donnees &&
						!!aInstance._donnees.pfmp &&
						!!aInstance._donnees.pfmp.editable &&
						!!aInstance._donnees.pfmp.appreciationStage
					);
				},
			},
			nombreSemaines: {
				getValue: function () {
					return aInstance._getNombreSemaines();
				},
				setValue: function (aValue) {
					if (aValue) {
						try {
							const lValue = parseInt(aValue);
							if (lValue > 0) {
								aInstance._donnees.pfmp.infosLSEleve.nombreSemaines = lValue;
								aInstance._donnees.pfmp.infosLSEleve.setEtat(
									Enumere_Etat_1.EGenreEtat.Modification,
								);
								aInstance.setEtatSaisie(true);
							}
						} catch (e) {}
					} else if (aValue === "") {
						aInstance._donnees.pfmp.infosLSEleve.nombreSemaines = "";
					}
				},
				exitChange: function () {
					if (aInstance._donnees.pfmp.infosLSEleve.nombreSemaines === "") {
						aInstance._donnees.pfmp.infosLSEleve.nombreSemaines = 0;
						aInstance._donnees.pfmp.infosLSEleve.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
						aInstance.setEtatSaisie(true);
					}
				},
				getDisabled: function () {
					return (
						!aInstance._donnees ||
						!aInstance._donnees.pfmp ||
						!aInstance._donnees.pfmp.infosLSEleve ||
						!aInstance._donnees.pfmp.editable
					);
				},
				visible: function () {
					return aInstance._avecNombreSemainesVisible();
				},
			},
			aLEtranger: {
				getValue: function () {
					return aInstance._getALEtranger();
				},
				setValue: function (aValeur) {
					aInstance._donnees.pfmp.infosLSEleve.aLEtranger = !!aValeur;
					aInstance._donnees.pfmp.infosLSEleve.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
					aInstance.setEtatSaisie(true);
				},
				getDisabled: function () {
					return (
						!aInstance._donnees ||
						!aInstance._donnees.pfmp ||
						!aInstance._donnees.pfmp.infosLSEleve ||
						!aInstance._donnees.pfmp.editable
					);
				},
			},
			radioExpAppr: {
				getValue: function (aSynthese) {
					if (
						!!aInstance._donnees &&
						!!aInstance._donnees.pfmp &&
						!!aInstance._donnees.pfmp.infosLSEleve
					) {
						return aSynthese
							? aInstance._donnees.pfmp.infosLSEleve.estExportSynthese
							: !aInstance._donnees.pfmp.infosLSEleve.estExportSynthese;
					}
				},
				setValue: function (aSynthese) {
					if (
						aSynthese ||
						aInstance._donnees.pfmp.infosLSEleve.appreciation === ""
					) {
						aInstance._donnees.pfmp.infosLSEleve.estExportSynthese = aSynthese;
						aInstance.donneesStages.setExportSynthese(
							aInstance._donnees.pfmp.infosLSEleve.estExportSynthese,
						);
						aInstance.listePFMP.actualiser(true);
					}
				},
				getDisabled: function (aSynthese) {
					const lDisabled =
						!aInstance._donnees ||
						!aInstance._donnees.pfmp ||
						!aInstance._donnees.pfmp.infosLSEleve ||
						!aInstance._donnees.pfmp.editable;
					if (aSynthese) {
						return lDisabled;
					} else {
						return (
							lDisabled ||
							aInstance._donnees.pfmp.infosLSEleve.appreciation !== ""
						);
					}
				},
			},
			synthese: {
				getValue: function () {
					if (
						!!aInstance._donnees &&
						!!aInstance._donnees.pfmp &&
						!!aInstance._donnees.pfmp.infosLSEleve
					) {
						return aInstance._donnees.pfmp.infosLSEleve.appreciation;
					}
					return "";
				},
				setValue: function (aValue) {
					aInstance._remplacerAppreciationPourExport(aValue);
				},
				getDisabled: function () {
					return !aInstance._estSyntheseEditable();
				},
			},
			getAuteur: function () {
				if (aInstance._estSyntheseEditable()) {
					return aInstance._donnees.pfmp.infosLSEleve.auteur.getLibelle();
				}
				return "";
			},
			btnNomSignature: {
				event(aGenre) {
					aInstance._evnNomSignature(aGenre);
				},
				getLibelle(aGenre) {
					let lDonnees;
					switch (aGenre) {
						case TypeAvisCommentaire_1.TypeAvisCommentaire
							.tac_ChefEtablissement:
							lDonnees = aInstance._donnees.avisCE;
							break;
						case TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Engagement:
							lDonnees = aInstance._donnees.engagements;
							break;
						case TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Investissement:
							lDonnees = aInstance._donnees.investissement;
							break;
						case C_ParcoursDifferencie:
							lDonnees = aInstance._donnees.parcoursDifferencie;
							break;
						default:
							break;
					}
					return (
						(lDonnees &&
							lDonnees.infosLivret &&
							lDonnees.infosLivret.auteur &&
							lDonnees.infosLivret.auteur.getLibelle()) ||
						""
					);
				},
				getDisabled(aGenre) {
					let lDonnees;
					switch (aGenre) {
						case TypeAvisCommentaire_1.TypeAvisCommentaire
							.tac_ChefEtablissement:
							lDonnees = aInstance._donnees.avisCE;
							break;
						case TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Engagement:
							lDonnees = aInstance._donnees.engagements;
							break;
						case TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Investissement:
							lDonnees = aInstance._donnees.investissement;
							break;
						case C_ParcoursDifferencie:
							lDonnees = aInstance._donnees.parcoursDifferencie;
							break;
						default:
							break;
					}
					return (
						aInstance.estNonEditable ||
						!lDonnees ||
						!lDonnees.infosLivret ||
						!lDonnees.infosLivret.date
					);
				},
			},
		});
	}
	setDonnees(aDonnees, aEstFilierePro, aEstCasBACPro) {
		if (!aDonnees) {
			this._donnees = null;
			ObjetHtml_1.GHtml.setHtml(this.Nom, '<div style="height:175px"></div>');
			return;
		}
		let lEventMapTextArea, lJTextArea;
		this._donnees = aDonnees;
		this.estNonEditable = !this._donnees.editable;
		this.estNonEditableAvisCE = !this._donnees.editablePourAvisCE;
		this._donnees.estFilierePro = aEstFilierePro;
		this._donnees.estCasBACPro = aEstCasBACPro;
		ObjetHtml_1.GHtml.setHtml(
			this.Nom,
			this.construireAffichage(),
			this.controleur,
		);
		const lListeOnglets = new ObjetListeElements_1.ObjetListeElements();
		if (this._donnees.avecAvisCE) {
			lListeOnglets.addElement(
				new ObjetElement_1.ObjetElement(
					this._donnees.estIssueDUnBOLycee
						? ObjetTraduction_1.GTraductions.getValeur(
								"ficheScolaire.AvisEnVueDuBac",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"ficheScolaire.AvisDuChefDetablissement",
							),
					null,
					TypeAvisCommentaire_1.TypeAvisCommentaire.tac_ChefEtablissement,
				),
			);
		}
		if (this._donnees.avecEngagements) {
			lListeOnglets.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("ficheScolaire.Engagements"),
					null,
					TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Engagement,
				),
			);
		}
		if (this._donnees.avecInvestissement) {
			lListeOnglets.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"ficheScolaire.Investissement",
					),
					null,
					TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Investissement,
				),
			);
		}
		if (this._donnees.avecPFMP) {
			lListeOnglets.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("ficheScolaire.pfmp.onglet"),
					null,
					-2,
				),
			);
		}
		if (this._donnees.avecParcoursDifferencie) {
			lListeOnglets.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"ficheScolaire.ParcoursDifferencie",
					),
					null,
					C_ParcoursDifferencie,
				),
			);
		}
		this.tabOnglets.setParametres(lListeOnglets);
		this.tabOnglets.afficher();
		this.tabOnglets.selectOnglet(0);
		if (this._donnees.avecPFMP) {
			this.listePFMP.initialiser();
		}
		if (this._donnees.avecAvisCE) {
			this.combo.setOptionsObjetSaisie({
				longueur: 200,
				labelWAICellule: this._donnees.estIssueDUnBOLycee
					? ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.AvisEnVueDuBac",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.AvisDuChefDetablissement",
						),
			});
			this.combo.initialiser();
			if (this._donnees.estIssueDUnBOLycee && !this.estNonEditableAvisCE) {
				this.celluleDate[
					TypeAvisCommentaire_1.TypeAvisCommentaire.tac_ChefEtablissement
				].initialiser();
			}
			const lListeAvisCombo = new ObjetListeElements_1.ObjetListeElements();
			lListeAvisCombo.add(this._donnees.avisCE.listeAvis);
			lListeAvisCombo.insererElement(new ObjetElement_1.ObjetElement(""), 0);
			let lIndiceCombo = 0;
			if (this._donnees.avisCE.infosLivret.avis) {
				lIndiceCombo = lListeAvisCombo.getIndiceParElement(
					this._donnees.avisCE.infosLivret.avis,
				);
				this._donnees.avisCE.infosLivret.avis =
					lListeAvisCombo.get(lIndiceCombo);
			}
			this._initialisationCombo = true;
			this.combo.setDonnees(lListeAvisCombo, lIndiceCombo);
			if (this._donnees.estIssueDUnBOLycee && !this.estNonEditableAvisCE) {
				if (this._donnees.avisCE.infosLivret.date) {
					this.celluleDate[
						TypeAvisCommentaire_1.TypeAvisCommentaire.tac_ChefEtablissement
					].setDonnees(this._donnees.avisCE.infosLivret.date);
				} else {
					this.celluleDate[
						TypeAvisCommentaire_1.TypeAvisCommentaire.tac_ChefEtablissement
					].setActif(false);
				}
			}
			delete this._initialisationCombo;
			lJTextArea = $("#" + this.idAvisCE.escapeJQ() + " textarea");
			ObjetHtml_1.GHtml.setValue(
				lJTextArea.get(0),
				this._donnees.avisCE.infosLivret.commentaire,
			);
			lEventMapTextArea = {
				change: this._surChangeTextArea,
				keyup: this._surChangeTextArea,
			};
			if (this.estNonEditableAvisCE) {
				lJTextArea.inputDisabled(true);
				this.combo.setActif(false);
				lJTextArea.off(lEventMapTextArea);
			} else {
				lJTextArea.inputDisabled(false);
				this.combo.setActif(true);
				lJTextArea.on(lEventMapTextArea, { instance: this });
			}
		}
		if (this._donnees.avecEngagements) {
			this.selectEngagements.setOptions({
				largeurBouton: 400,
				titreFenetre: ObjetTraduction_1.GTraductions.getValeur(
					"ficheScolaire.Engagements",
				),
				listeBoutons: [
					ObjetTraduction_1.GTraductions.getValeur("Annuler"),
					ObjetTraduction_1.GTraductions.getValeur("Valider"),
				],
				optionsListe: {
					skin: ObjetListe_1.ObjetListe.skin.flatDesign,
					colonnes: [{ taille: "100%" }],
					avecCBToutCocher: true,
					boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher }],
				},
				donneesListe:
					DonneesListe_SelectionEngagements_Fd_1.DonneesListe_SelectionEngagements_Fd,
				largeurFenetre: 400,
				hauteurFenetre: 650,
				ariaLabelledBy: this.idLabelEngagements,
				positionnerFenetreSousId: false,
			});
			this.selectEngagements.initialiser();
			if (!this.estNonEditable) {
				this.celluleDate[
					TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Engagement
				].initialiser();
			}
			this.selectEngagements.setDonnees(
				this._donnees.listeEngagements,
				this._donnees.engagements.listeEngagements,
			);
			if (!this.estNonEditable) {
				if (this._donnees.engagements.infosLivret.date) {
					this.celluleDate[
						TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Engagement
					].setDonnees(this._donnees.engagements.infosLivret.date);
				} else {
					this.celluleDate[
						TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Engagement
					].setActif(false);
				}
			}
			lJTextArea = $("#" + this.idEngagements.escapeJQ() + " textarea");
			ObjetHtml_1.GHtml.setValue(
				lJTextArea.get(0),
				this._donnees.engagements.infosLivret.commentaire,
			);
			lEventMapTextArea = {
				change: this._surChangeCommentaireEngagements,
				keyup: this._surChangeCommentaireEngagements,
			};
			if (this.estNonEditable) {
				lJTextArea.inputDisabled(true);
				lJTextArea.off(lEventMapTextArea);
			} else {
				lJTextArea.inputDisabled(false);
				lJTextArea.on(lEventMapTextArea, { instance: this });
			}
		}
		if (this._donnees.avecInvestissement) {
			if (!this.estNonEditable) {
				this.celluleDate[
					TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Investissement
				].initialiser();
			}
			if (!this.estNonEditable) {
				if (this._donnees.investissement.infosLivret.date) {
					this.celluleDate[
						TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Investissement
					].setDonnees(this._donnees.investissement.infosLivret.date);
				} else {
					this.celluleDate[
						TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Investissement
					].setActif(false);
				}
			}
			lJTextArea = $("#" + this.idAvisInvestissement.escapeJQ() + " textarea");
			ObjetHtml_1.GHtml.setValue(
				lJTextArea.get(0),
				this._donnees.investissement.infosLivret.commentaire,
			);
			lEventMapTextArea = {
				change: this._surChangeCommentaireInvestissement,
				keyup: this._surChangeCommentaireInvestissement,
			};
			if (this.estNonEditable) {
				lJTextArea.inputDisabled(true);
				lJTextArea.off(lEventMapTextArea);
			} else {
				lJTextArea.inputDisabled(false);
				lJTextArea.on(lEventMapTextArea, { instance: this });
			}
		}
		if (this._donnees.avecParcoursDifferencie) {
			const lAvecDonneesParcoursDiff =
				this._donnees &&
				this._donnees.parcoursDifferencie &&
				this._donnees.parcoursDifferencie.infosLivret;
			if (!lAvecDonneesParcoursDiff && !this.estNonEditable) {
				if (this._donnees.parcoursDifferencie) {
					this._donnees.parcoursDifferencie.infosLivret =
						new ObjetElement_1.ObjetElement("");
					this._donnees.parcoursDifferencie.infosLivret.commentaire = "";
				}
			}
			if (!this.estNonEditable) {
				this.celluleDate[C_ParcoursDifferencie].initialiser();
				if (
					lAvecDonneesParcoursDiff &&
					this._donnees.parcoursDifferencie.infosLivret.date
				) {
					this.celluleDate[C_ParcoursDifferencie].setDonnees(
						this._donnees.parcoursDifferencie.infosLivret.date,
					);
				} else {
					this.celluleDate[C_ParcoursDifferencie].setActif(false);
				}
			}
			lJTextArea = $("#" + this.idParcoursDiff.escapeJQ() + " textarea");
			const lCommentaire =
				lAvecDonneesParcoursDiff &&
				this._donnees.parcoursDifferencie.infosLivret.commentaire
					? this._donnees.parcoursDifferencie.infosLivret.commentaire
					: "";
			ObjetHtml_1.GHtml.setValue(lJTextArea.get(0), lCommentaire);
			lEventMapTextArea = {
				change: this._surChangeCommentaireParcoursDifferencie,
				keyup: this._surChangeCommentaireParcoursDifferencie,
			};
			if (this.estNonEditable) {
				lJTextArea.inputDisabled(true);
				lJTextArea.off(lEventMapTextArea);
			} else {
				lJTextArea.inputDisabled(false);
				lJTextArea.on(lEventMapTextArea, { instance: this });
			}
		}
	}
	construireAffichage() {
		if (!this._donnees) {
			return "";
		}
		if (this._donnees.avecPFMP) {
			this.hauteurZone = 175;
		}
		const T = [];
		T.push(
			`<div class="PetitEspaceHaut">\n              <div  class="conteneur-tabs compact" id="${this.tabOnglets.getNom()}" style="width: 100%;"></div>\n            </div>`,
		);
		T.push(
			'<div class="tabs-contenu" style="',
			ObjetStyle_1.GStyle.composeHeight(this.hauteurZone),
			'">',
		);
		if (this._donnees.avecAvisCE) {
			T.push(this._composeAvisCE());
		}
		if (this._donnees.avecEngagements) {
			T.push(this._composeEngagementsEleve());
		}
		if (this._donnees.avecInvestissement) {
			T.push(this._composeInvestissement());
		}
		if (this._donnees.avecPFMP) {
			T.push(this._composePFMP());
		}
		if (this._donnees.avecParcoursDifferencie) {
			T.push(this._composeParcoursDifferencie());
		}
		T.push("</div>");
		return T.join("");
	}
	_evenementSurTab(aElement) {
		switch (aElement.getGenre()) {
			case 0:
				$("#" + this.idAvisInvestissement.escapeJQ()).hide();
				$("#" + this.idEngagements.escapeJQ()).hide();
				$("#" + this.idPFMP.escapeJQ()).hide();
				$("#" + this.idParcoursDiff.escapeJQ()).hide();
				$("#" + this.idAvisCE.escapeJQ()).show();
				break;
			case 1:
				$("#" + this.idAvisInvestissement.escapeJQ()).hide();
				$("#" + this.idAvisCE.escapeJQ()).hide();
				$("#" + this.idPFMP.escapeJQ()).hide();
				$("#" + this.idParcoursDiff.escapeJQ()).hide();
				$("#" + this.idEngagements.escapeJQ()).show();
				break;
			case 2:
				$("#" + this.idAvisCE.escapeJQ()).hide();
				$("#" + this.idEngagements.escapeJQ()).hide();
				$("#" + this.idPFMP.escapeJQ()).hide();
				$("#" + this.idParcoursDiff.escapeJQ()).hide();
				$("#" + this.idAvisInvestissement.escapeJQ()).show();
				break;
			case -2:
				$("#" + this.idAvisCE.escapeJQ()).hide();
				$("#" + this.idEngagements.escapeJQ()).hide();
				$("#" + this.idAvisInvestissement.escapeJQ()).hide();
				$("#" + this.idParcoursDiff.escapeJQ()).hide();
				$("#" + this.idPFMP.escapeJQ()).show();
				this.donneesStages = new DonneesListe_PFMP(this._donnees.pfmp.liste, {
					tailleMax: this._donnees.pfmp.tailleMax,
					estExportSynthese: this._donnees.pfmp.infosLSEleve.estExportSynthese,
					modeAff: this._donnees.pfmp.modeAff,
				});
				this.listePFMP.setDonnees(this.donneesStages);
				break;
			case C_ParcoursDifferencie:
				$("#" + this.idAvisCE.escapeJQ()).hide();
				$("#" + this.idEngagements.escapeJQ()).hide();
				$("#" + this.idAvisInvestissement.escapeJQ()).hide();
				$("#" + this.idPFMP.escapeJQ()).hide();
				$("#" + this.idParcoursDiff.escapeJQ()).show();
				break;
			default:
				break;
		}
	}
	_evenementFenetreIndividu(aGenreBouton, aSelection) {
		let lDonnees = null,
			lIndividu;
		if (aGenreBouton === 1) {
			lIndividu = this.listeSignataires.get(aSelection);
			switch (this.genreAvisCommentaire) {
				case TypeAvisCommentaire_1.TypeAvisCommentaire.tac_ChefEtablissement:
					lDonnees = this._donnees.avisCE;
					break;
				case TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Engagement:
					lDonnees = this._donnees.engagements;
					break;
				case TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Investissement:
					lDonnees = this._donnees.investissement;
					break;
				case C_ParcoursDifferencie:
					lDonnees = this._donnees.parcoursDifferencie;
					break;
				default:
					break;
			}
		}
		if (lDonnees) {
			if (lIndividu.getGenre() !== -1) {
				lDonnees.infosLivret.auteur = lIndividu;
			} else {
				lDonnees.infosLivret.auteur = null;
			}
			lDonnees.infosLivret.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			lDonnees.estModifie = true;
			this.setEtatSaisie(true);
		}
		this.genreAvisCommentaire = undefined;
	}
	_evnNomSignature(aGenre) {
		this.genreAvisCommentaire = aGenre;
		const lClasse = this.etatUtilScoEspace.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
		new ObjetRequeteListeAuteurCommentaireLivret_1.ObjetRequeteListeAuteurCommentaireLivret(
			this,
			this._evntDeclencherFenetreRessource.bind(this),
		).lancerRequete({
			genre: this.genreAvisCommentaire,
			classe: lClasse,
			estParcoursDifferencie:
				this.genreAvisCommentaire === C_ParcoursDifferencie,
		});
	}
	_evenementSurCombo(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			if (
				!this._initialisationCombo &&
				aParams.element !== this._donnees.avisCE.infosLivret.avis
			) {
				const lAncienAvis = this._donnees.avisCE.infosLivret.avis;
				if (lAncienAvis) {
					lAncienAvis.nbEleves--;
				}
				if (aParams.element.existeNumero()) {
					this._donnees.avisCE.infosLivret.avis = aParams.element;
					this._donnees.avisCE.infosLivret.avis.nbEleves++;
				} else {
					this._donnees.avisCE.infosLivret.avis = null;
				}
				ObjetHtml_1.GHtml.setHtml(
					this.idRepartition,
					this._construireRepartition(),
				);
				this._donnees.avisCE.infosLivret.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				this.setEtatSaisie(true);
			}
		}
	}
	_evnSelectEngagements(aGenreBouton, aListeDonnees) {
		if (aGenreBouton === 1) {
			this._donnees.engagements.listeEngagements = aListeDonnees;
			this._donnees.engagements.estModifie = true;
			this.setEtatSaisie(true);
		}
	}
	_remplacerAppreciationPourExport(aValue) {
		this._donnees.pfmp.infosLSEleve.appreciation = aValue;
		if (
			!this._donnees.pfmp.infosLSEleve.auteur ||
			!this._donnees.pfmp.infosLSEleve.auteur.existeNumero()
		) {
			this._donnees.pfmp.infosLSEleve.auteur =
				this.etatUtilScoEspace.getUtilisateur();
		}
		this._donnees.pfmp.infosLSEleve.setEtat(
			Enumere_Etat_1.EGenreEtat.Modification,
		);
		this.setEtatSaisie(true);
	}
	_surCelluleDate(aGenre, aDate) {
		switch (aGenre) {
			case TypeAvisCommentaire_1.TypeAvisCommentaire.tac_ChefEtablissement:
				this._donnees.avisCE.infosLivret.date = aDate;
				this._donnees.avisCE.infosLivret.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				this.setEtatSaisie(true);
				break;
			case TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Engagement:
				this._donnees.engagements.infosLivret.date = aDate;
				this._donnees.engagements.infosLivret.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				this._donnees.engagements.estModifie = true;
				this.setEtatSaisie(true);
				break;
			case TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Investissement:
				this._donnees.investissement.infosLivret.date = aDate;
				this._donnees.investissement.infosLivret.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				this._donnees.investissement.estModifie = true;
				this.setEtatSaisie(true);
				break;
			case C_ParcoursDifferencie:
				this._donnees.parcoursDifferencie.infosLivret.date = aDate;
				this._donnees.parcoursDifferencie.infosLivret.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				this._donnees.parcoursDifferencie.infosLivret.estModifie = true;
				this.setEtatSaisie(true);
				break;
			default:
				break;
		}
	}
	_estSyntheseEditable() {
		return (
			!!this._donnees &&
			!!this._donnees.pfmp &&
			this._donnees.pfmp.editable &&
			!!this._donnees.pfmp.infosLSEleve &&
			(this._donnees.pfmp.modeAff ===
			TypeModeDAffichagePFMP_1.TypeModeDAffichagePFMP.tMAPFMP_CAP
				? true
				: this._donnees.pfmp.infosLSEleve.estExportSynthese)
		);
	}
	_composePFMPModeCAPNonEditable() {
		var _a;
		return IE.jsx.str(
			"div",
			{
				id: this.idPFMP,
				class: "pfmp_section",
				role: "group",
				"aria-labelledby": this.idTitrePfmp,
			},
			IE.jsx.str(
				"h2",
				{ id: this.idTitrePfmp, class: "Gras p-y ie-titre-petit" },
				this._donnees.pfmp.titre,
			),
			IE.jsx.str(
				"h3",
				{ class: "m-top-l p-y ie-titre-petit theme_color_foncee Gras" },
				ObjetTraduction_1.GTraductions.getValeur(
					"ficheScolaire.pfmp.apprStageReferents",
				) + " : ",
			),
			IE.jsx.str("div", {
				"aria-label": ObjetTraduction_1.GTraductions.getValeur(
					"ficheScolaire.pfmp.apprStageReferents",
				),
				id: this.listePFMP.getNom(),
				class: "m-top-l pfmp_exp_detail",
			}),
			this._donnees.pfmp.infosLSEleve.appreciation
				? IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str(
							"h3",
							{ class: "m-top-l p-y ie-titre-petit theme_color_foncee Gras" },
							ObjetTraduction_1.GTraductions.getValeur(
								"ficheScolaire.pfmp.syntheseRedigeePar",
								[
									(_a = this._donnees.pfmp.infosLSEleve.auteur) === null ||
									_a === void 0
										? void 0
										: _a.getLibelle(),
								],
							) + " : ",
						),
						IE.jsx.str("p", null, this._donnees.pfmp.infosLSEleve.appreciation),
					)
				: "",
		);
	}
	_composePFMPModeCAP() {
		if (
			this.estNonEditable &&
			[
				Enumere_Espace_1.EGenreEspace.Eleve,
				Enumere_Espace_1.EGenreEspace.Parent,
			].includes(this.etatUtilScoEspace.GenreEspace)
		) {
			return this._composePFMPModeCAPNonEditable();
		} else {
			return IE.jsx.str(
				"div",
				{ id: this.idPFMP, class: "pfmp_section" },
				IE.jsx.str("span", { class: "pfmp_titre" }, this._donnees.pfmp.titre),
				IE.jsx.str(
					"div",
					{ class: "pfmp_appr pfmp_sansInfo" },
					IE.jsx.str(
						"div",
						{ class: "pfmp_exp_appr" },
						IE.jsx.str("div", {
							id: this.listePFMP.getNom(),
							class: "pfmp_exp_detail",
						}),
					),
					IE.jsx.str(
						"div",
						{ class: "pfmp_exp_synthese" },
						IE.jsx.str("ie-textareamax", {
							"ie-model": "synthese",
							maxlength: this._donnees.pfmp.tailleMax,
							"aria-label": ObjetTraduction_1.GTraductions.getValeur(
								"ficheScolaire.pfmp.saisissezlaSyntheseCAP",
							),
							placeholder: ObjetTraduction_1.GTraductions.getValeur(
								"ficheScolaire.pfmp.saisissezlaSyntheseCAP",
							),
							class: "pfmp_exp_detail ie-no-autoresize",
						}),
						IE.jsx.str(
							"div",
							{ class: "pfmp_exp_pied" },
							ObjetTraduction_1.GTraductions.getValeur(
								"ficheScolaire.pfmp.redigeePar",
							),
							IE.jsx.str("span", {
								class: "pfmp_exp_auteur like-input",
								"ie-html": "getAuteur",
							}),
						),
					),
				),
			);
		}
	}
	_composePFMPModePRONonEditable() {
		var _a;
		return IE.jsx.str(
			"div",
			{
				id: this.idPFMP,
				class: "pfmp_section",
				role: "group",
				"aria-labelledby": this.idTitrePfmp,
			},
			IE.jsx.str(
				"h2",
				{ id: this.idTitrePfmp, class: "Gras p-y ie-titre-petit" },
				this._donnees.pfmp.titre,
			),
			this._avecNombreSemainesVisible()
				? IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str(
							"h3",
							{ class: "m-top-l p-y ie-titre-petit theme_color_foncee Gras" },
							ObjetTraduction_1.GTraductions.getValeur(
								"ficheScolaire.pfmp.libelleDuree",
							) + " : ",
						),
						IE.jsx.str("p", null, this._getNombreSemaines()),
					)
				: "",
			this._getALEtranger()
				? IE.jsx.str(
						"h3",
						{ class: "m-top-l p-y ie-titre-petit theme_color_foncee Gras" },
						ObjetTraduction_1.GTraductions.getValeur(
							"ficheScolaire.pfmp.libelleEtranger",
						),
					)
				: "",
			this._avecExportSynthese()
				? IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str(
							"h3",
							{ class: "m-top-l p-y ie-titre-petit theme_color_foncee Gras" },
							ObjetTraduction_1.GTraductions.getValeur(
								"ficheScolaire.pfmp.syntheseRedigeePar",
								[
									(_a = this._donnees.pfmp.infosLSEleve.auteur) === null ||
									_a === void 0
										? void 0
										: _a.getLibelle(),
								],
							) + " : ",
						),
						IE.jsx.str("p", null, this._donnees.pfmp.infosLSEleve.appreciation),
					)
				: IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str(
							"h3",
							{ class: "m-top-l p-y ie-titre-petit theme_color_foncee Gras" },
							ObjetTraduction_1.GTraductions.getValeur(
								"ficheScolaire.pfmp.apprStageReferents",
							) + " : ",
						),
						IE.jsx.str("div", {
							"aria-label": ObjetTraduction_1.GTraductions.getValeur(
								"ficheScolaire.pfmp.apprStageReferents",
							),
							id: this.listePFMP.getNom(),
							class: "m-top-l pfmp_exp_detail",
						}),
					),
		);
	}
	_composePFMPModePRO() {
		if (
			this.estNonEditable &&
			[
				Enumere_Espace_1.EGenreEspace.Eleve,
				Enumere_Espace_1.EGenreEspace.Parent,
			].includes(this.etatUtilScoEspace.GenreEspace)
		) {
			return this._composePFMPModePRONonEditable();
		} else {
			const T = [];
			T.push(`<div id="${this.idPFMP}" class="pfmp_section">`);
			T.push(
				`<div class="pfmp_titre"><span>${this._donnees.pfmp.titre}</span><ie-btnicon ie-model="btnMrFiche" class="bt-activable icon_question bt-small MargeGauche"></ie-btnicon></div>`,
			);
			T.push(
				`<div class="pfmp_info"><label ie-display="nombreSemaines.visible" for="${this.idPFMP}_nombreSemaines">${ObjetTraduction_1.GTraductions.getValeur("ficheScolaire.pfmp.libelleDuree")}</label><input id="${this.idPFMP}_nombreSemaines" type="text" ie-model="nombreSemaines" ie-display="nombreSemaines.visible" ie-mask="/[^0-9]/i" class="MargeGauche MargeDroit pfmp_nbrSem" maxLength="3" /><hr ie-display="nombreSemaines.visible" class="pfmp_sep" /><ie-checkbox ie-model="aLEtranger" class="pfmp_etranger">${ObjetTraduction_1.GTraductions.getValeur("ficheScolaire.pfmp.libelleEtranger")}</ie-checkbox></div>`,
			);
			T.push('<div class="pfmp_appr">');
			T.push(
				'<div class="pfmp_exp_appr">',
				`<ie-radio ie-model="radioExpAppr(false)" class="pfmp_exp_radio">${ObjetTraduction_1.GTraductions.getValeur("ficheScolaire.pfmp.exportAppreciationsReferents")}</ie-radio>`,
				`<div id="${this.listePFMP.getNom()}" class="pfmp_exp_detail"></div>`,
				`<div class="pfmp_exp_pied"><i class="icon_share" role="img" aria-label="${ObjetTraduction_1.GTraductions.getValeur("ficheScolaire.pfmp.legendeAppr", [this._donnees.pfmp.tailleMax])}"></i> ${ObjetTraduction_1.GTraductions.getValeur("ficheScolaire.pfmp.legendeAppr", [this._donnees.pfmp.tailleMax])}</div>`,
				"</div>",
			);
			T.push(
				'<div class="pfmp_exp_synthese">',
				`<div class="pfmp_exp_radio${!!this._donnees.pfmp.appreciationStage && !!this._donnees.pfmp.editable ? " avecCopier" : ""}"><ie-radio ie-model="radioExpAppr(true)" class="pfmp_exp_rd">${ObjetTraduction_1.GTraductions.getValeur("ficheScolaire.pfmp.exportSynthese")}</ie-radio><ie-btnicon ie-model="btnCopie" ie-display="btnCopie.visible" class="pfmp_exp_copie bt-activable icon_signin MargeGauche"></ie-btnicon></div>`,
				`<ie-textareamax ie-model="synthese" maxlength="${this._donnees.pfmp.tailleMax}" aria-label="${ObjetTraduction_1.GTraductions.getValeur("ficheScolaire.pfmp.saisissezlaSynthese")}" placeholder="${ObjetTraduction_1.GTraductions.getValeur("ficheScolaire.pfmp.saisissezlaSynthese")}" class="pfmp_exp_detail ie-no-autoresize"></ie-textareamax>`,
				`<div class="pfmp_exp_pied">${ObjetTraduction_1.GTraductions.getValeur("ficheScolaire.pfmp.redigeePar")}<span class="pfmp_exp_auteur like-input" ie-html="getAuteur"></span></div>`,
				"</div>",
			);
			T.push("</div>");
			T.push("</div>");
			return T.join("");
		}
	}
	_composePFMP() {
		const lModeAff = this._donnees.pfmp.modeAff;
		if (
			lModeAff === TypeModeDAffichagePFMP_1.TypeModeDAffichagePFMP.tMAPFMP_CAP
		) {
			return this._composePFMPModeCAP();
		} else {
			return this._composePFMPModePRO();
		}
	}
	_avecNombreSemainesVisible() {
		return (
			!!this._donnees &&
			!!this._donnees.pfmp &&
			!!this._donnees.pfmp.estNiveauTerminale
		);
	}
	_getNombreSemaines() {
		return this._donnees.pfmp && this._donnees.pfmp.infosLSEleve
			? this._donnees.pfmp.infosLSEleve.nombreSemaines
			: 0;
	}
	_getALEtranger() {
		return (
			!!this._donnees &&
			!!this._donnees.pfmp &&
			!!this._donnees.pfmp.infosLSEleve &&
			!!this._donnees.pfmp.infosLSEleve.aLEtranger
		);
	}
	_avecExportSynthese() {
		if (
			!!this._donnees &&
			!!this._donnees.pfmp &&
			!!this._donnees.pfmp.infosLSEleve
		) {
			return this._donnees.pfmp.infosLSEleve.estExportSynthese;
		} else {
			return false;
		}
	}
	_composeAvisCE() {
		const T = [];
		T.push('<div id="', this.idAvisCE, '" class="NoWrap">');
		T.push(
			'<div class="InlineBlock AlignementHaut">',
			this.estNonEditableAvisCE
				? this._construireAvisNonEditable()
				: this._construireAvis(),
			"</div>",
		);
		T.push(
			'<div id="',
			this.idRepartition,
			'_section" class="InlineBlock AlignementHaut GrandEspaceGauche">',
			'<div class="Gras">',
			this._donnees.avisCE.libelleRepatition,
			"</div>",
			'<div class="EspaceHaut">',
			'<div style="',
			ObjetStyle_1.GStyle.composeHeight(this.hauteurZone - 20),
			';padding-right:1px;" class="overflow-auto">',
			'<div id="',
			this.idRepartition,
			'" style="min-width : 300px;">',
			this._construireRepartition(),
			"</div>",
			"</div>",
			"</div>",
			"</div>",
		);
		T.push("</div>");
		return T.join("");
	}
	_composeEngagementsEleve() {
		const T = [];
		T.push('<div id="', this.idEngagements, '">');
		T.push(
			this.estNonEditable
				? this._construireEngagementsNonEditable()
				: this._construireEngagements(),
		);
		const lNom =
			this._donnees &&
			this._donnees.engagements &&
			this._donnees.engagements.infosLivret &&
			this._donnees.engagements.infosLivret.auteur &&
			this._donnees.engagements.infosLivret.auteur.getLibelle()
				? this._donnees.engagements.infosLivret.auteur.getLibelle()
				: null;
		const lDate =
			this._donnees &&
			this._donnees.engagements &&
			this._donnees.engagements.infosLivret &&
			this._donnees.engagements.infosLivret.date
				? this._donnees.engagements.infosLivret.date
				: null;
		if (
			[
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Etablissement,
			].includes(this.etatUtilScoEspace.GenreEspace) &&
			!this.estNonEditable
		) {
			T.push(
				this._construireSignature(
					TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Engagement,
				),
			);
		} else {
			T.push(this._construireSignatureNonEditable(lNom, lDate));
		}
		T.push("</div>");
		return T.join("");
	}
	_construireEngagements() {
		const T = [];
		const lIdTextArea = GUID_1.GUID.getId();
		T.push('<div class="WhiteSpaceNormal" style="padding-top:2px;">');
		T.push(
			'<div id="',
			this.idLabelEngagements,
			'" class="Gras">',
			ObjetTraduction_1.GTraductions.getValeur(
				"ficheScolaire.engagement.titre",
			),
			"</div>",
		);
		T.push('<div id="', this.selectEngagements.getNom(), '"></div>');
		T.push("</div>");
		T.push('<div class="EspaceHaut WhiteSpaceNormal">');
		T.push(
			'<div><label for="',
			lIdTextArea,
			'" class="Gras">',
			ObjetTraduction_1.GTraductions.getValeur(
				"ficheScolaire.engagement.commentaire",
			),
			"</label></div>",
		);
		T.push(
			'<textarea id="',
			lIdTextArea,
			'" maxlength="',
			this.parametresScoEspace.getTailleMaxAppreciationParEnumere(
				TypeGenreAppreciation_1.TypeGenreAppreciation.GA_BilanAnnuel_Generale,
			),
			'" style="width:600px; height:60px;',
			ObjetStyle_1.GStyle.composeCouleurBordure(GCouleur.bordure),
			'"></textarea>',
		);
		T.push("</div>");
		return T.join("");
	}
	_construireEngagementsNonEditable() {
		const T = [];
		T.push('<div class="WhiteSpaceNormal" style="padding-top:2px;">');
		if (
			this._donnees.engagements.listeEngagements.count() > 0 ||
			this._donnees.engagements.infosLivret.commentaire
		) {
			if (this._donnees.engagements.listeEngagements.count() > 0) {
				T.push(
					'<div class="Gras">',
					ObjetTraduction_1.GTraductions.getValeur(
						"ficheScolaire.engagement.titre",
					),
					" :",
					"</div>",
				);
				T.push(
					"<div>",
					this._donnees.engagements &&
						this._donnees.engagements.listeEngagements
						? this._donnees.engagements.listeEngagements
								.getTableauLibelles()
								.join(", ")
						: "&nbsp;",
					"</div>",
				);
			}
			T.push("</div>");
			T.push('<div class="EspaceHaut WhiteSpaceNormal">');
			if (this._donnees.engagements.infosLivret.commentaire) {
				T.push(
					'<div class="Gras">',
					ObjetTraduction_1.GTraductions.getValeur(
						"ficheScolaire.engagement.commentaire",
					),
					" :",
					"</div>",
				);
				T.push(
					"<div>",
					ObjetChaine_1.GChaine.replaceRCToHTML(
						this._donnees.engagements.infosLivret.commentaire,
					),
					"</div>",
				);
			}
		} else {
			T.push(
				this.composeMessage(
					ObjetTraduction_1.GTraductions.getValeur(
						"ficheScolaire.engagement.aucun",
					),
				),
			);
		}
		T.push("</div>");
		return T.join("");
	}
	_composeInvestissement() {
		const T = [];
		T.push('<div id="', this.idAvisInvestissement, '">');
		T.push(
			this.estNonEditable
				? this._construireAvisInvestissementNonEditable()
				: this._construireAvisInvestissement(),
		);
		const lNom =
			this._donnees &&
			this._donnees.investissement &&
			this._donnees.investissement.infosLivret &&
			this._donnees.investissement.infosLivret.auteur &&
			this._donnees.investissement.infosLivret.auteur.getLibelle()
				? this._donnees.investissement.infosLivret.auteur.getLibelle()
				: null;
		const lDate =
			this._donnees &&
			this._donnees.investissement &&
			this._donnees.investissement.infosLivret &&
			this._donnees.investissement.infosLivret.date
				? this._donnees.investissement.infosLivret.date
				: null;
		if (
			[
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Etablissement,
			].includes(this.etatUtilScoEspace.GenreEspace) &&
			!this.estNonEditable
		) {
			T.push(
				this._construireSignature(
					TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Investissement,
				),
			);
		} else {
			T.push(this._construireSignatureNonEditable(lNom, lDate));
		}
		T.push("</div>");
		return T.join("");
	}
	_construireAvisInvestissement() {
		const T = [];
		const lIdTextArea = GUID_1.GUID.getId();
		T.push('<div class="EspaceHaut WhiteSpaceNormal">');
		T.push(
			'<div class="Gras"><label for="',
			lIdTextArea,
			'">',
			ObjetTraduction_1.GTraductions.getValeur(
				"ficheScolaire.investissement.titre",
			),
			"</label></div>",
		);
		T.push(
			'<textarea id="',
			lIdTextArea,
			'" maxlength="',
			this.parametresScoEspace.getTailleMaxAppreciationParEnumere(
				TypeGenreAppreciation_1.TypeGenreAppreciation.GA_BilanAnnuel_Generale,
			),
			'" style="width:600px; height:96px;',
			ObjetStyle_1.GStyle.composeCouleurBordure(GCouleur.bordure),
			'"></textarea>',
		);
		T.push("</div>");
		return T.join("");
	}
	_construireAvisInvestissementNonEditable() {
		const T = [];
		T.push('<div class="EspaceHaut WhiteSpaceNormal">');
		if (this._donnees.investissement.infosLivret.commentaire) {
			T.push(
				'<div class="Gras">',
				ObjetTraduction_1.GTraductions.getValeur(
					"ficheScolaire.investissement.titre",
				),
				" :",
				"</div>",
			);
			T.push(
				"<div>",
				ObjetChaine_1.GChaine.replaceRCToHTML(
					this._donnees.investissement.infosLivret.commentaire,
				),
				"</div>",
			);
		} else {
			T.push(
				this.composeMessage(
					ObjetTraduction_1.GTraductions.getValeur(
						"ficheScolaire.investissement.aucun",
					),
				),
			);
		}
		T.push("</div>");
		return T.join("");
	}
	_construireSignature(aGenre) {
		const T = [];
		this.celluleDate[aGenre] = new ObjetCelluleDate_1.ObjetCelluleDate(
			this.Nom + ".celluleDate[" + aGenre + "]",
			null,
			this,
			this._surCelluleDate.bind(this, aGenre),
		);
		const lIdLabelNom = GUID_1.GUID.getId();
		T.push('<div  class="NoWrap">');
		T.push(
			'<label id="',
			lIdLabelNom,
			'" class="EspaceDroit">',
			ObjetTraduction_1.GTraductions.getValeur("Nom"),
			"</label>",
		);
		T.push(
			'<div class="InlineBlock AlignementMilieuVertical Espace"><ie-btnselecteur ie-model="btnNomSignature(',
			aGenre,
			')" style="width: 18rem;" aria-labelledby="',
			lIdLabelNom,
			'"></ie-btnselecteur></div>',
		);
		T.push(
			'<div class="InlineBlock AlignementMilieuVertical Espace GrandEspaceGauche">',
			ObjetTraduction_1.GTraductions.getValeur("Date"),
			"</div>",
		);
		T.push(
			'<div class="InlineBlock AlignementMilieuVertical Espace"><div id="',
			this.celluleDate[aGenre].getNom(),
			'"></div></div>',
		);
		T.push("</div>");
		return T.join("");
	}
	_construireSignatureNonEditable(aNom, aDate) {
		const T = [];
		if (
			aNom &&
			aDate &&
			[
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Etablissement,
			].includes(this.etatUtilScoEspace.GenreEspace)
		) {
			T.push('<div  class="NoWrap">');
			T.push(
				'<div class="InlineBlock AlignementMilieuVertical GrandEspaceHaut EspaceBas">',
				aNom ? aNom : "",
				aDate
					? ObjetDate_1.GDate.formatDate(
							aDate,
							(aNom ? ", " : "") +
								ObjetTraduction_1.GTraductions.getValeur("Le") +
								" %JJ/%MM/%AAAA",
						)
					: "",
				"</div>",
			);
			T.push("</div>");
		}
		return T.join("");
	}
	_construireAvis() {
		const T = [];
		const lIdTextArea = GUID_1.GUID.getId();
		T.push('<div style="position:relative; height:25px;">');
		T.push(
			'<div class="Gras" style="position:relative; top:2px;"><label for="',
			lIdTextArea,
			'">',
			ObjetTraduction_1.GTraductions.getValeur(
				"ficheScolaire.AvisDuChefDetablissement",
			),
			"</label></div>",
		);
		T.push(
			'<div id="',
			this.combo.getNom(),
			'" style="position:absolute; right:0; top:0"></div>',
		);
		T.push("</div>");
		T.push(
			'<textarea id="',
			lIdTextArea,
			'" maxlength="',
			this.parametresScoEspace.getTailleMaxAppreciationParEnumere(
				TypeGenreAppreciation_1.TypeGenreAppreciation.GA_BilanAnnuel_Generale,
			),
			'" style="width:410px; height:90px;',
			ObjetStyle_1.GStyle.composeCouleurBordure(GCouleur.bordure),
			'"></textarea>',
		);
		const lNom =
			this._donnees &&
			this._donnees.avisCE &&
			this._donnees.avisCE.infosLivret &&
			this._donnees.avisCE.infosLivret.auteur &&
			this._donnees.avisCE.infosLivret.auteur.getLibelle()
				? this._donnees.avisCE.infosLivret.auteur.getLibelle()
				: null;
		const lDate =
			this._donnees &&
			this._donnees.avisCE &&
			this._donnees.avisCE.infosLivret &&
			this._donnees.avisCE.infosLivret.date
				? this._donnees.avisCE.infosLivret.date
				: null;
		if (this._donnees.estIssueDUnBOLycee) {
			if (
				[
					Enumere_Espace_1.EGenreEspace.Professeur,
					Enumere_Espace_1.EGenreEspace.Etablissement,
				].includes(this.etatUtilScoEspace.GenreEspace)
			) {
				T.push(
					this._construireSignature(
						TypeAvisCommentaire_1.TypeAvisCommentaire.tac_ChefEtablissement,
					),
				);
			} else {
				T.push(this._construireSignatureNonEditable(lNom, lDate));
			}
		}
		return T.join("");
	}
	_construireAvisNonEditable() {
		const T = [];
		T.push('<div style="position:relative; height:25px;">');
		T.push(
			'<div style="position:relative; top:2px;"><span class="Gras">',
			ObjetTraduction_1.GTraductions.getValeur(
				"ficheScolaire.AvisDuChefDetablissement",
			),
			"&nbsp;:&nbsp;</span>",
			this._donnees.avisCE.infosLivret.avis
				? this._donnees.avisCE.infosLivret.avis.getLibelle()
				: "",
			"</div>",
		);
		T.push("</div>");
		T.push(
			'<div class="EspaceBas WhiteSpaceNormal" style="width:410px;">',
			ObjetChaine_1.GChaine.replaceRCToHTML(
				this._donnees.avisCE.infosLivret.commentaire,
			),
			"</div>",
		);
		const lNom =
			this._donnees &&
			this._donnees.avisCE &&
			this._donnees.avisCE.infosLivret &&
			this._donnees.avisCE.infosLivret.auteur &&
			this._donnees.avisCE.infosLivret.auteur.getLibelle()
				? this._donnees.avisCE.infosLivret.auteur.getLibelle()
				: null;
		const lDate =
			this._donnees &&
			this._donnees.avisCE &&
			this._donnees.avisCE.infosLivret &&
			this._donnees.avisCE.infosLivret.date
				? this._donnees.avisCE.infosLivret.date
				: null;
		T.push(this._construireSignatureNonEditable(lNom, lDate));
		return T.join("");
	}
	_construireLigneRepartition(aNombre, aLibelle) {
		const T = [];
		if (this._donnees.avisCE.nbElevesTotal > 0) {
			const lValeur =
				Math.round((aNombre * 10000) / this._donnees.avisCE.nbElevesTotal) /
				100;
			T.push('<div class="GrandEspaceDroit">');
			if (
				this._donnees &&
				this._donnees.estFilierePro &&
				!this._donnees.estCasBACPro
			) {
				T.push(
					'<div style="width:50px;" class="InlineBlock LigneRepartition">',
					aNombre,
					"</div>",
				);
			} else {
				if (isNaN(lValeur)) {
				} else {
					T.push(
						'<div style="width:50px;" class="InlineBlock LigneRepartition">',
						(lValeur < 10 ? "0" : "") + lValeur.toFixed(2),
						" %",
						"</div>",
					);
				}
			}
			T.push('<div  class="InlineBlock">', aLibelle, "</div>");
			T.push("</div>");
		}
		return T.join("");
	}
	_construireRepartition() {
		const T = [];
		let lNbAvisNonRemplis = this._donnees.avisCE.nbElevesTotal;
		for (let i = 0; i < this._donnees.avisCE.listeAvis.count(); i++) {
			const lAvis = this._donnees.avisCE.listeAvis.get(i);
			lNbAvisNonRemplis -= lAvis.nbEleves;
			T.push(
				this._construireLigneRepartition(lAvis.nbEleves, lAvis.getLibelle()),
			);
		}
		T.push(
			this._construireLigneRepartition(
				lNbAvisNonRemplis,
				ObjetTraduction_1.GTraductions.getValeur("ficheScolaire.AvisNonRempli"),
			),
		);
		return T.join("");
	}
	_composeParcoursDifferencie() {
		const T = [];
		T.push('<div id="', this.idParcoursDiff, '" class="NoWrap">');
		T.push(
			'<div class="InlineBlock AlignementHaut">',
			this.estNonEditableAvisCE
				? this._construireParcoursDifferencieNonEditable()
				: this._construireParcoursDifferencieEditable(),
			"</div>",
		);
		T.push("</div>");
		return T.join("");
	}
	_construireParcoursDifferencieEditable() {
		const T = [];
		const lIdTextArea = GUID_1.GUID.getId();
		const lAvecDonneesParcoursDiff =
			this._donnees &&
			this._donnees.parcoursDifferencie &&
			this._donnees.parcoursDifferencie.infosLivret;
		T.push('<div style="position:relative; height:25px;">');
		T.push(
			`<div><p>${ObjetTraduction_1.GTraductions.getValeur("ficheScolaire.ParcoursDifferencie")} : ${lAvecDonneesParcoursDiff && this._donnees.parcoursDifferencie.infosLivret.libelleParcours ? this._donnees.parcoursDifferencie.infosLivret.libelleParcours : ""}</p></div>`,
		);
		T.push("</div>");
		T.push(
			'<div><label for="',
			lIdTextArea,
			'" class="Gras">',
			ObjetTraduction_1.GTraductions.getValeur(
				"ficheScolaire.parcoursDifferencie.commentaire",
			),
			"</label></div>",
		);
		T.push(
			'<textarea id="',
			lIdTextArea,
			'" maxlength="',
			this.parametresScoEspace.getTailleMaxAppreciationParEnumere(
				TypeGenreAppreciation_1.TypeGenreAppreciation.GA_BilanAnnuel_Generale,
			),
			'" style="width:410px; height:90px;',
			ObjetStyle_1.GStyle.composeCouleurBordure(GCouleur.bordure),
			'"></textarea>',
		);
		const lNom =
			lAvecDonneesParcoursDiff &&
			this._donnees.parcoursDifferencie.infosLivret.auteur &&
			this._donnees.parcoursDifferencie.infosLivret.auteur.getLibelle()
				? this._donnees.parcoursDifferencie.infosLivret.auteur.getLibelle()
				: null;
		const lDate =
			lAvecDonneesParcoursDiff &&
			this._donnees.parcoursDifferencie.infosLivret.date
				? this._donnees.parcoursDifferencie.infosLivret.date
				: null;
		if (
			[
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Etablissement,
			].includes(this.etatUtilScoEspace.GenreEspace)
		) {
			T.push(this._construireSignature(C_ParcoursDifferencie));
		} else {
			T.push(this._construireSignatureNonEditable(lNom, lDate));
		}
		return T.join("");
	}
	_construireParcoursDifferencieNonEditable() {
		const T = [];
		const lAvecDonneesParcoursDiff =
			this._donnees &&
			this._donnees.parcoursDifferencie &&
			this._donnees.parcoursDifferencie.infosLivret;
		T.push('<div style="position:relative; height:25px;">');
		T.push(
			`<div><p>${ObjetTraduction_1.GTraductions.getValeur("ficheScolaire.ParcoursDifferencie")} : ${lAvecDonneesParcoursDiff && this._donnees.parcoursDifferencie.infosLivret.libelleParcours ? this._donnees.parcoursDifferencie.infosLivret.libelleParcours : ""}</p></div>`,
		);
		T.push("</div>");
		T.push(
			"<div>",
			ObjetTraduction_1.GTraductions.getValeur(
				"ficheScolaire.parcoursDifferencie.commentaire",
			),
			"</div>",
		);
		T.push(
			'<div class="EspaceBas WhiteSpaceNormal" style="width:410px;">',
			lAvecDonneesParcoursDiff
				? ObjetChaine_1.GChaine.replaceRCToHTML(
						this._donnees.parcoursDifferencie.infosLivret.commentaire,
					)
				: "",
			"</div>",
		);
		const lNom =
			lAvecDonneesParcoursDiff &&
			this._donnees.parcoursDifferencie.infosLivret.auteur &&
			this._donnees.parcoursDifferencie.infosLivret.auteur.getLibelle()
				? this._donnees.parcoursDifferencie.infosLivret.auteur.getLibelle()
				: null;
		const lDate =
			lAvecDonneesParcoursDiff &&
			this._donnees.parcoursDifferencie.infosLivret.date
				? this._donnees.parcoursDifferencie.infosLivret.date
				: null;
		T.push(this._construireSignatureNonEditable(lNom, lDate));
		return T.join("");
	}
	_evntDeclencherFenetreRessource(aDonnees) {
		let lListeDonnees = new ObjetListeElements_1.ObjetListeElements();
		if (
			this.genreAvisCommentaire ===
			TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Investissement
		) {
			lListeDonnees = aDonnees.listeAuteurs;
			lListeDonnees.setTri([
				ObjetTri_1.ObjetTri.init("Position"),
				ObjetTri_1.ObjetTri.init("Libelle"),
			]);
			lListeDonnees.trier();
		} else {
			aDonnees.listeAuteurs.parcourir((aElement) => {
				let lPere;
				if (aElement.fonction && aElement.fonction.existeNumero()) {
					lPere = lListeDonnees.getElementParNumeroEtGenre(
						aElement.fonction.getNumero(),
						-2,
					);
					if (!lPere) {
						lPere = new ObjetElement_1.ObjetElement(
							aElement.fonction.getLibelle(),
							aElement.fonction.getNumero(),
							-2,
							1,
						);
						lPere.estUnDeploiement = true;
						lPere.estDeploye = true;
						lListeDonnees.addElement(lPere);
					}
				} else if (
					aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Enseignant
				) {
					lPere = new ObjetElement_1.ObjetElement(
						ObjetTraduction_1.GTraductions.getValeur("Professeur"),
						0,
						C_ParcoursDifferencie,
						2,
					);
					lPere.estUnDeploiement = true;
					lPere.estDeploye = true;
					lListeDonnees.addElement(lPere);
				} else {
					lPere = lListeDonnees.getElementParNumeroEtGenre(0, -3);
					if (!lPere) {
						lPere = new ObjetElement_1.ObjetElement(
							ObjetTraduction_1.GTraductions.getValeur("FonctionNonPrecisee"),
							0,
							-3,
							2,
						);
						lPere.estUnDeploiement = true;
						lPere.estDeploye = true;
						lListeDonnees.addElement(lPere);
					}
				}
				aElement.pere = lPere;
				lListeDonnees.addElement(aElement);
			});
			lListeDonnees.setTri([
				ObjetTri_1.ObjetTri.initRecursif("pere", [
					ObjetTri_1.ObjetTri.init("Position"),
					ObjetTri_1.ObjetTri.init("Libelle"),
				]),
			]);
			lListeDonnees.trier();
		}
		this.listeSignataires = new ObjetListeElements_1.ObjetListeElements();
		this.listeSignataires.addElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("Aucun"),
				null,
				-1,
				0,
			),
		);
		this.listeSignataires.add(lListeDonnees);
		const lFenetreListe = new ObjetFenetre_Liste_1.ObjetFenetre_Liste({
			pere: this,
			evenement: this._evenementFenetreIndividu,
		});
		lFenetreListe.paramsListe = {
			optionsListe: {
				skin: ObjetListe_1.ObjetListe.skin.flatDesign,
				forcerOmbreScrollBottom: true,
			},
		};
		lFenetreListe.initAfficher({
			options: {
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"ficheScolaire.Signataire.Engagement",
				),
				largeur: 400,
				hauteur: 600,
				listeBoutons: [
					ObjetTraduction_1.GTraductions.getValeur("Annuler"),
					ObjetTraduction_1.GTraductions.getValeur("Valider"),
				],
			},
		});
		switch (this.genreAvisCommentaire) {
			case TypeAvisCommentaire_1.TypeAvisCommentaire.tac_ChefEtablissement:
				lFenetreListe.setOptionsFenetre({
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"ficheScolaire.Signataire.AvisCE",
					),
				});
				break;
			case TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Engagement:
				lFenetreListe.setOptionsFenetre({
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"ficheScolaire.Signataire.Engagement",
					),
				});
				break;
			case TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Investissement:
				lFenetreListe.setOptionsFenetre({
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"ficheScolaire.Signataire.Investissement",
					),
				});
				break;
			case C_ParcoursDifferencie:
				lFenetreListe.setOptionsFenetre({
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"ficheScolaire.Signataire.ParcoursDifferencie",
					),
				});
				break;
			default:
				break;
		}
		lFenetreListe.setDonnees(
			new DonneesListe_SelectionSignatairesAvis_1.DonneesListe_SelectionSignatairesAvis(
				this.listeSignataires,
			),
		);
	}
	_getGenreIndividu(aGenreRessource) {
		switch (aGenreRessource) {
			case Enumere_Ressource_1.EGenreRessource.Enseignant:
				return TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur.GIA_Professeur;
			case Enumere_Ressource_1.EGenreRessource.Personnel:
				return TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur.GIA_Personnel;
			case Enumere_Ressource_1.EGenreRessource.Responsable:
				return TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur
					.GIA_Responsable;
			case Enumere_Ressource_1.EGenreRessource.Eleve:
				return TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur.GIA_Eleve;
			case Enumere_Ressource_1.EGenreRessource.MaitreDeStage:
				return TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur
					.GIA_MaitreDeStage;
			case Enumere_Ressource_1.EGenreRessource.InspecteurPedagogique:
				return TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur.GIA_Inspecteur;
			default:
				break;
		}
	}
	_surChangeTextArea(event) {
		const lInstance = event.data.instance;
		lInstance.setEtatSaisie(true);
		lInstance._donnees.avisCE.infosLivret.setEtat(
			Enumere_Etat_1.EGenreEtat.Modification,
		);
		lInstance._donnees.avisCE.infosLivret.commentaire =
			ObjetHtml_1.GHtml.getValue(this);
		if (!lInstance.estNonEditableAvisCE) {
			if (lInstance._donnees.avisCE.infosLivret.commentaire) {
				if (
					!lInstance._donnees.avisCE.infosLivret.date &&
					lInstance._donnees.estIssueDUnBOLycee
				) {
					lInstance._donnees.avisCE.infosLivret.date =
						ObjetDate_1.GDate.getDateCourante();
					lInstance.celluleDate[
						TypeAvisCommentaire_1.TypeAvisCommentaire.tac_ChefEtablissement
					].setActif(true);
					lInstance.celluleDate[
						TypeAvisCommentaire_1.TypeAvisCommentaire.tac_ChefEtablissement
					].setDonnees(lInstance._donnees.avisCE.infosLivret.date);
				}
			} else {
				lInstance._donnees.avisCE.infosLivret.date = null;
				lInstance._donnees.avisCE.infosLivret.auteur = null;
				lInstance.celluleDate[
					TypeAvisCommentaire_1.TypeAvisCommentaire.tac_ChefEtablissement
				].setDonnees(lInstance._donnees.avisCE.infosLivret.date);
				lInstance.celluleDate[
					TypeAvisCommentaire_1.TypeAvisCommentaire.tac_ChefEtablissement
				].setActif(false);
			}
			lInstance.$refresh();
		}
	}
	_surChangeCommentaireEngagements(event) {
		const lInstance = event.data.instance;
		lInstance.setEtatSaisie(true);
		lInstance._donnees.engagements.infosLivret.setEtat(
			Enumere_Etat_1.EGenreEtat.Modification,
		);
		lInstance._donnees.engagements.estModifie = true;
		lInstance._donnees.engagements.infosLivret.commentaire =
			ObjetHtml_1.GHtml.getValue(this);
		if (!lInstance.estNonEditable) {
			if (lInstance._donnees.engagements.infosLivret.commentaire) {
				if (!lInstance._donnees.engagements.infosLivret.date) {
					lInstance._donnees.engagements.infosLivret.date =
						ObjetDate_1.GDate.getDateCourante();
					lInstance.celluleDate[
						TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Engagement
					].setActif(true);
					lInstance.celluleDate[
						TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Engagement
					].setDonnees(lInstance._donnees.engagements.infosLivret.date);
				}
			} else {
				lInstance._donnees.engagements.infosLivret.date = null;
				lInstance._donnees.engagements.infosLivret.auteur = null;
				lInstance.celluleDate[
					TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Engagement
				].setDonnees(lInstance._donnees.engagements.infosLivret.date);
				lInstance.celluleDate[
					TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Engagement
				].setActif(false);
			}
			lInstance.$refresh();
		}
	}
	_surChangeCommentaireInvestissement(event) {
		const lInstance = event.data.instance;
		lInstance.setEtatSaisie(true);
		lInstance._donnees.investissement.infosLivret.setEtat(
			Enumere_Etat_1.EGenreEtat.Modification,
		);
		lInstance._donnees.investissement.estModifie = true;
		lInstance._donnees.investissement.infosLivret.commentaire =
			ObjetHtml_1.GHtml.getValue(this);
		if (!lInstance.estNonEditable) {
			if (lInstance._donnees.investissement.infosLivret.commentaire) {
				if (!lInstance._donnees.investissement.infosLivret.date) {
					lInstance._donnees.investissement.infosLivret.date =
						ObjetDate_1.GDate.getDateCourante();
					lInstance.celluleDate[
						TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Investissement
					].setActif(true);
					lInstance.celluleDate[
						TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Investissement
					].setDonnees(lInstance._donnees.investissement.infosLivret.date);
				}
				if (!lInstance._donnees.investissement.infosLivret.auteur) {
					lInstance._donnees.investissement.infosLivret.auteur =
						new ObjetElement_1.ObjetElement(
							lInstance.etatUtilScoEspace.getUtilisateur().getLibelle(),
							lInstance.etatUtilScoEspace.getUtilisateur().getNumero(),
							lInstance._getGenreIndividu(
								lInstance.etatUtilScoEspace.getUtilisateur().getGenre(),
							),
						);
				}
			} else {
				lInstance._donnees.investissement.infosLivret.date = null;
				lInstance._donnees.investissement.infosLivret.auteur = null;
				lInstance.celluleDate[
					TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Investissement
				].setDonnees(lInstance._donnees.investissement.infosLivret.date);
				lInstance.celluleDate[
					TypeAvisCommentaire_1.TypeAvisCommentaire.tac_Investissement
				].setActif(false);
			}
			lInstance.$refresh();
		}
	}
	_surChangeCommentaireParcoursDifferencie(event) {
		const lInstance = event.data.instance;
		lInstance.setEtatSaisie(true);
		lInstance._donnees.parcoursDifferencie.infosLivret.setEtat(
			Enumere_Etat_1.EGenreEtat.Modification,
		);
		lInstance._donnees.parcoursDifferencie.infosLivret.estModifie = true;
		lInstance._donnees.parcoursDifferencie.infosLivret.commentaire =
			ObjetHtml_1.GHtml.getValue(this);
		if (!lInstance.estNonEditable) {
			if (lInstance._donnees.parcoursDifferencie.infosLivret.commentaire) {
				if (!lInstance._donnees.parcoursDifferencie.infosLivret.date) {
					lInstance._donnees.parcoursDifferencie.infosLivret.date =
						ObjetDate_1.GDate.getDateCourante();
					lInstance.celluleDate[C_ParcoursDifferencie].setActif(true);
					lInstance.celluleDate[C_ParcoursDifferencie].setDonnees(
						lInstance._donnees.parcoursDifferencie.infosLivret.date,
					);
				}
				if (!lInstance._donnees.parcoursDifferencie.infosLivret.auteur) {
					lInstance._donnees.parcoursDifferencie.infosLivret.auteur =
						new ObjetElement_1.ObjetElement(
							lInstance.etatUtilScoEspace.getUtilisateur().getLibelle(),
							lInstance.etatUtilScoEspace.getUtilisateur().getNumero(),
							lInstance._getGenreIndividu(
								lInstance.etatUtilScoEspace.getUtilisateur().getGenre(),
							),
						);
				}
			} else {
				lInstance._donnees.parcoursDifferencie.infosLivret.date = null;
				lInstance._donnees.parcoursDifferencie.infosLivret.auteur = null;
				lInstance.celluleDate[C_ParcoursDifferencie].setDonnees(
					lInstance._donnees.parcoursDifferencie.infosLivret.date,
				);
				lInstance.celluleDate[C_ParcoursDifferencie].setActif(false);
			}
			lInstance.$refresh();
		}
	}
}
exports.ObjetPiedFicheScolaire = ObjetPiedFicheScolaire;
class DonneesListe_PFMP extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.param = $.extend(
			{
				tailleMax: 300,
				estExportSynthese: false,
				modeAff:
					TypeModeDAffichagePFMP_1.TypeModeDAffichagePFMP.tMAPFMP_Standard,
			},
			aParam,
		);
	}
	setExportSynthese(aValue) {
		this.param.estExportSynthese = aValue;
	}
	avecEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_PFMP.colonnes.professeur:
			case DonneesListe_PFMP.colonnes.export:
				return false;
			case DonneesListe_PFMP.colonnes.appreciation:
				return false;
		}
		return this.options.avecEdition;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_PFMP.colonnes.professeur:
				return aParams.article.getLibelle();
			case DonneesListe_PFMP.colonnes.export: {
				if (
					this.param.modeAff !==
						TypeModeDAffichagePFMP_1.TypeModeDAffichagePFMP.tMAPFMP_CAP &&
					aParams.article.exportable &&
					!this.param.estExportSynthese &&
					![
						Enumere_Espace_1.EGenreEspace.Eleve,
						Enumere_Espace_1.EGenreEspace.Parent,
					].includes((0, AccessApp_1.getApp)().getEtatUtilisateur().GenreEspace)
				) {
					return `<i class="icon_share" ie-tooltiplabel="${ObjetTraduction_1.GTraductions.getValeur("ficheScolaire.pfmp.legendeAppr", [this.param.tailleMax])}" role="img"></i>`;
				}
				return "";
			}
			case DonneesListe_PFMP.colonnes.appreciation:
				return aParams.article.appreciation.getLibelle();
		}
		return "";
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_PFMP.colonnes.export:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_PFMP.colonnes.appreciation:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.ZoneTexte;
			default:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
		}
	}
	getClass(aParams) {
		const lClasses = [];
		switch (aParams.idColonne) {
			case DonneesListe_PFMP.colonnes.export:
				lClasses.push("AlignementDroit");
		}
		return lClasses.join(" ");
	}
	getControleCaracteresInput(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_PFMP.colonnes.appreciation:
				return { tailleMax: this.param.tailleMax };
		}
		return null;
	}
}
(function (DonneesListe_PFMP) {
	let colonnes;
	(function (colonnes) {
		colonnes["professeur"] = "DLPFMP_professeur";
		colonnes["export"] = "DLPFMP_export";
		colonnes["appreciation"] = "DLPFMP_appreciation";
	})(
		(colonnes =
			DonneesListe_PFMP.colonnes || (DonneesListe_PFMP.colonnes = {})),
	);
})(DonneesListe_PFMP || (DonneesListe_PFMP = {}));
const DonneesListe_PFMPOptions = {
	colonnes: [
		{
			id: DonneesListe_PFMP.colonnes.professeur,
			titre: {
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"ficheScolaire.pfmp.professeur",
				),
			},
			taille: ObjetListe_1.ObjetListe.initColonne(35, 320, 400),
			sansBordureDroite: true,
		},
		{
			id: DonneesListe_PFMP.colonnes.export,
			titre: {
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"ficheScolaire.pfmp.professeur",
				),
				avecFusionColonne: true,
			},
			taille: 12,
		},
		{
			id: DonneesListe_PFMP.colonnes.appreciation,
			titre: {
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"ficheScolaire.pfmp.appreciations",
				),
			},
			taille: ObjetListe_1.ObjetListe.initColonne(65, 520, 600),
		},
	],
	hauteurAdapteContenu: true,
};
