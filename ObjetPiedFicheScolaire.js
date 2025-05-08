const {
	DonneesListe_SelectionEngagements,
} = require("DonneesListe_SelectionEngagements.js");
const {
	ObjetRequeteListeAuteurCommentaireLivret,
} = require("ObjetRequeteListeAuteurCommentaireLivret.js");
const { GUID } = require("GUID.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { GPosition } = require("ObjetPosition.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ZoneFenetre } = require("IEZoneFenetre.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { ObjetCelluleMultiSelection } = require("ObjetCelluleMultiSelection.js");
const { GDate } = require("ObjetDate.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const { Identite } = require("ObjetIdentite.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
const { ObjetTabOnglets } = require("ObjetTabOnglets.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TypeAvisCommentaire } = require("TypeAvisCommentaire.js");
const { TypeGenreAppreciation } = require("TypeGenreAppreciation.js");
const { TypeGenreIndividuAuteur } = require("TypeGenreIndividuAuteur.js");
const { ObjetListe } = require("ObjetListe.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const C_ParcoursDifferencie = 99;
class ObjetPiedFicheScolaire extends Identite {
	constructor(...aParams) {
		super(...aParams);
		this.idRepartition = GUID.getId();
		this.idAvisCE = GUID.getId();
		this.idEngagements = GUID.getId();
		this.idLabelEngagements = GUID.getId();
		this.idAvisInvestissement = GUID.getId();
		this.idPFMP = GUID.getId();
		this.idParcoursDiff = GUID.getId();
		this.idListePFMP = this.Nom + ".listePFMP";
		this.combo = new ObjetSaisie(
			this.Nom + ".combo",
			null,
			this,
			this._evenementSurCombo,
		);
		this.celluleDate = [];
		this.tabOnglets = new ObjetTabOnglets(
			this.Nom + ".tabOnglets",
			null,
			this,
			this._evenementSurTab,
		);
		this.selectEngagements = new ObjetCelluleMultiSelection(
			this.Nom + ".selectEngagements",
			null,
			this,
			this._evnSelectEngagements,
		);
		this.fenetreSelectPublic = new ObjetFenetre_Liste(
			this.Nom + ".fenetreSelectPublic",
			null,
			this,
			this._evenementFenetreIndividu,
		);
		ZoneFenetre.ajouterFenetre(
			this.fenetreSelectPublic.getNom(),
			this.fenetreSelectPublic.getZIndex(),
		);
		this.hauteurZone = 150;
		this.fenetreSelectPublic.setOptionsFenetre({
			titre: GTraductions.getValeur("ficheScolaire.Signataire.Engagement"),
			largeur: 380,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
			],
		});
		this.fenetreSelectPublic.paramsListe = {
			tailles: ["100%"],
			optionsListe: {
				hauteurAdapteContenu: true,
				hauteurMaxAdapteContenu: Math.min(GNavigateur.ecranH - 200, 600),
			},
		};
		this.fenetreSelectPublic.initialiser();
		this.listePFMP = new ObjetListe(this.idListePFMP, null, this);
		this.listePFMP.setOptionsListe(DonneesListe_PFMP.options);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnMrFiche: {
				event() {
					GApplication.getMessage().afficher({
						idRessource: "ficheScolaire.pfmp.MFicheSynthesePFMP",
					});
				},
				getTitle() {
					return GTraductions.getTitreMFiche(
						"ficheScolaire.pfmp.MFicheSynthesePFMP",
					);
				},
			},
			btnCopie: {
				event() {
					if (aInstance._donnees.pfmp.infosLSEleve.appreciation !== "") {
						GApplication.getMessage().afficher({
							type: EGenreBoiteMessage.Confirmation,
							message: GTraductions.getValeur(
								"ficheScolaire.pfmp.confirmationCopierAppreciations",
							),
							callback: function (aGenreAction) {
								if (aGenreAction === EGenreAction.Valider) {
									_remplacerAppreciationPourExport.call(
										aInstance,
										aInstance._donnees.pfmp.appreciationStage,
									);
									aInstance._donnees.pfmp.infosLSEleve.estExportSynthese = true;
								}
							},
						});
					} else {
						_remplacerAppreciationPourExport.call(
							aInstance,
							aInstance._donnees.pfmp.appreciationStage,
						);
						aInstance._donnees.pfmp.infosLSEleve.estExportSynthese = true;
					}
				},
				getTitle() {
					return GTraductions.getValeur(
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
					return aInstance._donnees.pfmp && aInstance._donnees.pfmp.infosLSEleve
						? aInstance._donnees.pfmp.infosLSEleve.nombreSemaines
						: 0;
				},
				setValue: function (aValue) {
					if (aValue) {
						try {
							const lValue = parseInt(aValue);
							if (lValue > 0) {
								aInstance._donnees.pfmp.infosLSEleve.nombreSemaines = lValue;
								aInstance._donnees.pfmp.infosLSEleve.setEtat(
									EGenreEtat.Modification,
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
							EGenreEtat.Modification,
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
			},
			aLEtranger: {
				getValue: function () {
					return (
						!!aInstance._donnees &&
						!!aInstance._donnees.pfmp &&
						!!aInstance._donnees.pfmp.infosLSEleve &&
						!!aInstance._donnees.pfmp.infosLSEleve.aLEtranger
					);
				},
				setValue: function (aValeur) {
					aInstance._donnees.pfmp.infosLSEleve.aLEtranger = !!aValeur;
					aInstance._donnees.pfmp.infosLSEleve.setEtat(EGenreEtat.Modification);
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
					_remplacerAppreciationPourExport.call(aInstance, aValue);
				},
				getDisabled: function () {
					return (
						!aInstance._donnees ||
						!aInstance._donnees.pfmp ||
						!aInstance._donnees.pfmp.infosLSEleve ||
						!aInstance._donnees.pfmp.editable ||
						!aInstance._donnees.pfmp.infosLSEleve.estExportSynthese
					);
				},
			},
			getAuteur: function () {
				if (
					!!aInstance._donnees &&
					!!aInstance._donnees.pfmp &&
					!!aInstance._donnees.pfmp.infosLSEleve &&
					aInstance._donnees.pfmp.infosLSEleve.estExportSynthese
				) {
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
						case TypeAvisCommentaire.tac_ChefEtablissement:
							lDonnees = aInstance._donnees.avisCE;
							break;
						case TypeAvisCommentaire.tac_Engagement:
							lDonnees = aInstance._donnees.engagements;
							break;
						case TypeAvisCommentaire.tac_Investissement:
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
						case TypeAvisCommentaire.tac_ChefEtablissement:
							lDonnees = aInstance._donnees.avisCE;
							break;
						case TypeAvisCommentaire.tac_Engagement:
							lDonnees = aInstance._donnees.engagements;
							break;
						case TypeAvisCommentaire.tac_Investissement:
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
			GHtml.setHtml(this.Nom, '<div style="height:175px"></div>');
			return;
		}
		let lEventMapTextArea, lJTextArea;
		this._donnees = aDonnees;
		this.estNonEditable = !this._donnees.editable;
		this.estNonEditableAvisCE = !this._donnees.editablePourAvisCE;
		this._donnees.estFilierePro = aEstFilierePro;
		this._donnees.estCasBACPro = aEstCasBACPro;
		GHtml.setHtml(this.Nom, this.construireAffichage(), this.controleur);
		const lListeOnglets = new ObjetListeElements();
		if (this._donnees.avecAvisCE) {
			lListeOnglets.addElement(
				new ObjetElement(
					this._donnees.estIssueDUnBOLycee
						? GTraductions.getValeur("ficheScolaire.AvisEnVueDuBac")
						: GTraductions.getValeur("ficheScolaire.AvisDuChefDetablissement"),
					null,
					TypeAvisCommentaire.tac_ChefEtablissement,
				),
			);
		}
		if (this._donnees.avecEngagements) {
			lListeOnglets.addElement(
				new ObjetElement(
					GTraductions.getValeur("ficheScolaire.Engagements"),
					null,
					TypeAvisCommentaire.tac_Engagement,
				),
			);
		}
		if (this._donnees.avecInvestissement) {
			lListeOnglets.addElement(
				new ObjetElement(
					GTraductions.getValeur("ficheScolaire.Investissement"),
					null,
					TypeAvisCommentaire.tac_Investissement,
				),
			);
		}
		if (this._donnees.avecPFMP) {
			lListeOnglets.addElement(
				new ObjetElement(
					GTraductions.getValeur("ficheScolaire.pfmp.onglet"),
					null,
					-2,
				),
			);
		}
		if (this._donnees.avecParcoursDifferencie) {
			lListeOnglets.addElement(
				new ObjetElement(
					GTraductions.getValeur("ficheScolaire.ParcoursDifferencie"),
					null,
					C_ParcoursDifferencie,
				),
			);
		}
		this.tabOnglets.setParametres(
			lListeOnglets,
			GPosition.getWidth(this.Nom) - 10,
			19,
		);
		this.tabOnglets.afficher();
		this.tabOnglets.selectOnglet(0);
		if (this._donnees.avecPFMP) {
			this.listePFMP.initialiser();
		}
		if (this._donnees.avecAvisCE) {
			this.combo.setOptionsObjetSaisie({
				longueur: 200,
				labelWAICellule: this._donnees.estIssueDUnBOLycee
					? GTraductions.getValeur("ficheScolaire.AvisEnVueDuBac")
					: GTraductions.getValeur("ficheScolaire.AvisDuChefDetablissement"),
			});
			this.combo.initialiser();
			if (this._donnees.estIssueDUnBOLycee && !this.estNonEditableAvisCE) {
				this.celluleDate[
					TypeAvisCommentaire.tac_ChefEtablissement
				].initialiser();
			}
			const lListeAvisCombo = new ObjetListeElements();
			lListeAvisCombo.add(this._donnees.avisCE.listeAvis);
			lListeAvisCombo.insererElement(new ObjetElement(""), 0);
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
						TypeAvisCommentaire.tac_ChefEtablissement
					].setDonnees(this._donnees.avisCE.infosLivret.date);
				} else {
					this.celluleDate[TypeAvisCommentaire.tac_ChefEtablissement].setActif(
						false,
					);
				}
			}
			delete this._initialisationCombo;
			lJTextArea = $("#" + this.idAvisCE.escapeJQ() + " textarea");
			GHtml.setValue(
				lJTextArea.get(0),
				this._donnees.avisCE.infosLivret.commentaire,
			);
			lEventMapTextArea = {
				change: _surChangeTextArea,
				keyup: _surChangeTextArea,
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
				titreFenetre: GTraductions.getValeur("ficheScolaire.Engagements"),
				titresColonnes: [
					{ estCoche: true },
					GTraductions.getValeur("ficheScolaire.engagement.code"),
					GTraductions.getValeur("Libelle"),
				],
				taillesColonnes: ["20", "30", "100%"],
				listeBoutons: [
					GTraductions.getValeur("Annuler"),
					GTraductions.getValeur("Valider"),
				],
				donneesListe: DonneesListe_SelectionEngagements,
				largeurFenetre: 450,
				hauteurFenetre: 250,
				labelledByWAI: this.idLabelEngagements,
			});
			this.selectEngagements.initialiser();
			if (!this.estNonEditable) {
				this.celluleDate[TypeAvisCommentaire.tac_Engagement].initialiser();
			}
			this.selectEngagements.setDonnees(
				this._donnees.listeEngagements,
				this._donnees.engagements.listeEngagements,
			);
			if (!this.estNonEditable) {
				if (this._donnees.engagements.infosLivret.date) {
					this.celluleDate[TypeAvisCommentaire.tac_Engagement].setDonnees(
						this._donnees.engagements.infosLivret.date,
					);
				} else {
					this.celluleDate[TypeAvisCommentaire.tac_Engagement].setActif(false);
				}
			}
			lJTextArea = $("#" + this.idEngagements.escapeJQ() + " textarea");
			GHtml.setValue(
				lJTextArea.get(0),
				this._donnees.engagements.infosLivret.commentaire,
			);
			lEventMapTextArea = {
				change: _surChangeCommentaireEngagements,
				keyup: _surChangeCommentaireEngagements,
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
				this.celluleDate[TypeAvisCommentaire.tac_Investissement].initialiser();
			}
			if (!this.estNonEditable) {
				if (this._donnees.investissement.infosLivret.date) {
					this.celluleDate[TypeAvisCommentaire.tac_Investissement].setDonnees(
						this._donnees.investissement.infosLivret.date,
					);
				} else {
					this.celluleDate[TypeAvisCommentaire.tac_Investissement].setActif(
						false,
					);
				}
			}
			lJTextArea = $("#" + this.idAvisInvestissement.escapeJQ() + " textarea");
			GHtml.setValue(
				lJTextArea.get(0),
				this._donnees.investissement.infosLivret.commentaire,
			);
			lEventMapTextArea = {
				change: _surChangeCommentaireInvestissement,
				keyup: _surChangeCommentaireInvestissement,
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
					this._donnees.parcoursDifferencie.infosLivret = new ObjetElement("");
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
			GHtml.setValue(lJTextArea.get(0), lCommentaire);
			lEventMapTextArea = {
				change: _surChangeCommentaireParcoursDifferencie,
				keyup: _surChangeCommentaireParcoursDifferencie,
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
			GStyle.composeHeight(this.hauteurZone),
			'">',
		);
		if (this._donnees.avecAvisCE) {
			T.push(_composeAvisCE.bind(this)());
		}
		if (this._donnees.avecEngagements) {
			T.push(_composeEngagementsEleve.bind(this)());
		}
		if (this._donnees.avecInvestissement) {
			T.push(_composeInvestissement.bind(this)());
		}
		if (this._donnees.avecPFMP) {
			T.push(_composePFMP.bind(this)());
		}
		if (this._donnees.avecParcoursDifferencie) {
			T.push(_composeParcoursDifferencie.bind(this)());
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
				case TypeAvisCommentaire.tac_ChefEtablissement:
					lDonnees = this._donnees.avisCE;
					break;
				case TypeAvisCommentaire.tac_Engagement:
					lDonnees = this._donnees.engagements;
					break;
				case TypeAvisCommentaire.tac_Investissement:
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
			lDonnees.infosLivret.setEtat(EGenreEtat.Modification);
			lDonnees.estModifie = true;
			this.setEtatSaisie(true);
		}
		this.genreAvisCommentaire = undefined;
	}
	_evnNomSignature(aGenre) {
		this.genreAvisCommentaire = aGenre;
		const lClasse = GEtatUtilisateur.Navigation.getRessource(
			EGenreRessource.Classe,
		);
		new ObjetRequeteListeAuteurCommentaireLivret(
			this,
			_evntDeclencherFenetreRessource.bind(this),
		).lancerRequete({
			genre: this.genreAvisCommentaire,
			classe: lClasse,
			estParcoursDifferencie:
				this.genreAvisCommentaire === C_ParcoursDifferencie,
		});
	}
	_evenementSurCombo(aParams) {
		if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
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
				GHtml.setHtml(this.idRepartition, _construireRepartition.bind(this)());
				this._donnees.avisCE.infosLivret.setEtat(EGenreEtat.Modification);
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
}
function _remplacerAppreciationPourExport(aValue) {
	this._donnees.pfmp.infosLSEleve.appreciation = aValue;
	if (
		!this._donnees.pfmp.infosLSEleve.auteur ||
		!this._donnees.pfmp.infosLSEleve.auteur.existeNumero()
	) {
		this._donnees.pfmp.infosLSEleve.auteur = GEtatUtilisateur.getUtilisateur();
	}
	this._donnees.pfmp.infosLSEleve.setEtat(EGenreEtat.Modification);
	this.setEtatSaisie(true);
}
function _surCelluleDate(aGenre, aDate) {
	switch (aGenre) {
		case TypeAvisCommentaire.tac_ChefEtablissement:
			this._donnees.avisCE.infosLivret.date = aDate;
			this._donnees.avisCE.infosLivret.setEtat(EGenreEtat.Modification);
			this.setEtatSaisie(true);
			break;
		case TypeAvisCommentaire.tac_Engagement:
			this._donnees.engagements.infosLivret.date = aDate;
			this._donnees.engagements.infosLivret.setEtat(EGenreEtat.Modification);
			this._donnees.engagements.estModifie = true;
			this.setEtatSaisie(true);
			break;
		case TypeAvisCommentaire.tac_Investissement:
			this._donnees.investissement.infosLivret.date = aDate;
			this._donnees.investissement.infosLivret.setEtat(EGenreEtat.Modification);
			this._donnees.investissement.estModifie = true;
			this.setEtatSaisie(true);
			break;
		case C_ParcoursDifferencie:
			this._donnees.parcoursDifferencie.infosLivret.date = aDate;
			this._donnees.parcoursDifferencie.infosLivret.setEtat(
				EGenreEtat.Modification,
			);
			this._donnees.parcoursDifferencie.infosLivret.estModifie = true;
			this.setEtatSaisie(true);
			break;
		default:
			break;
	}
}
function _composePFMP() {
	const T = [];
	T.push(`<div id="${this.idPFMP}" class="pfmp_section">`);
	T.push(
		`<div class="pfmp_titre"><span>${this._donnees.pfmp.titre}</span><ie-btnicon ie-model="btnMrFiche" class="bt-activable icon_question bt-small MargeGauche"></ie-btnicon></div>`,
	);
	T.push(
		`<div class="pfmp_info"><label for="${this.idPFMP}_nombreSemaines">${GTraductions.getValeur("ficheScolaire.pfmp.libelleDuree")}</label><input id="${this.idPFMP}_nombreSemaines" type="text" ie-model="nombreSemaines" ie-mask="/[^0-9]/i" class="round-style MargeGauche MargeDroit pfmp_nbrSem" maxLength="3" /><hr class="pfmp_sep" /><ie-checkbox ie-model="aLEtranger" class="pfmp_etranger">${GTraductions.getValeur("ficheScolaire.pfmp.libelleEtranger")}</ie-checkbox></div>`,
	);
	T.push('<div class="pfmp_appr">');
	T.push(
		'<div class="pfmp_exp_appr">',
		`<ie-radio ie-model="radioExpAppr(false)" class="pfmp_exp_radio">${GTraductions.getValeur("ficheScolaire.pfmp.exportAppreciationsReferents")}</ie-radio>`,
		`<div id="${this.listePFMP.getNom()}" class="pfmp_exp_detail"></div>`,
		`<div class="pfmp_exp_pied"><i class="icon_share"></i> ${GTraductions.getValeur("ficheScolaire.pfmp.legendeAppr", [this._donnees.pfmp.tailleMax])}</div>`,
		"</div>",
	);
	T.push(
		'<div class="pfmp_exp_synthese">',
		`<div class="pfmp_exp_radio${!!this._donnees.pfmp.appreciationStage && !!this._donnees.pfmp.editable ? " avecCopier" : ""}"><ie-radio ie-model="radioExpAppr(true)" class="pfmp_exp_rd">${GTraductions.getValeur("ficheScolaire.pfmp.exportSynthese")}</ie-radio><ie-btnicon ie-model="btnCopie" ie-display="btnCopie.visible" class="pfmp_exp_copie bt-activable icon_signin MargeGauche"></ie-btnicon></div>`,
		`<ie-textareamax ie-model="synthese" maxlength="${this._donnees.pfmp.tailleMax}" aria-label="${GTraductions.getValeur("ficheScolaire.pfmp.saisissezlaSynthese")}" placeholder="${GTraductions.getValeur("ficheScolaire.pfmp.saisissezlaSynthese")}" class="pfmp_exp_detail ie-no-autoresize"></ie-textareamax>`,
		`<div class="pfmp_exp_pied">${GTraductions.getValeur("ficheScolaire.pfmp.redigeePar")}<span class="pfmp_exp_auteur like-input" ie-html="getAuteur"></span></div>`,
		"</div>",
	);
	T.push("</div>");
	T.push("</div>");
	return T.join("");
}
function _composeAvisCE() {
	const T = [];
	T.push('<div id="', this.idAvisCE, '" class="NoWrap">');
	T.push(
		'<div class="InlineBlock AlignementHaut">',
		this.estNonEditableAvisCE
			? _construireAvisNonEditable.bind(this)()
			: _construireAvis.bind(this)(),
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
		GStyle.composeHeight(this.hauteurZone - 20),
		';padding-right:1px;" class="overflow-auto">',
		'<div id="',
		this.idRepartition,
		'" style="min-width : 300px;">',
		_construireRepartition.bind(this)(),
		"</div>",
		"</div>",
		"</div>",
		"</div>",
	);
	T.push("</div>");
	return T.join("");
}
function _composeEngagementsEleve() {
	const T = [];
	T.push('<div id="', this.idEngagements, '">');
	T.push(
		this.estNonEditable
			? _construireEngagementsNonEditable.bind(this)()
			: _construireEngagements.bind(this)(),
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
		[EGenreEspace.Professeur, EGenreEspace.Etablissement].includes(
			GEtatUtilisateur.GenreEspace,
		) &&
		!this.estNonEditable
	) {
		T.push(
			_construireSignature.bind(this)(
				lNom,
				lDate,
				TypeAvisCommentaire.tac_Engagement,
			),
		);
	} else {
		T.push(_construireSignatureNonEditable.bind(this)(lNom, lDate));
	}
	T.push("</div>");
	return T.join("");
}
function _construireEngagements() {
	const T = [];
	const lIdTextArea = GUID.getId();
	T.push('<div class="WhiteSpaceNormal" style="padding-top:2px;">');
	T.push(
		'<div id="',
		this.idLabelEngagements,
		'" class="Gras">',
		GTraductions.getValeur("ficheScolaire.engagement.titre"),
		"</div>",
	);
	T.push('<div id="', this.selectEngagements.getNom(), '"></div>');
	T.push("</div>");
	T.push('<div class="EspaceHaut WhiteSpaceNormal">');
	T.push(
		'<div><label for="',
		lIdTextArea,
		'" class="Gras">',
		GTraductions.getValeur("ficheScolaire.engagement.commentaire"),
		"</label></div>",
	);
	T.push(
		'<textarea id="',
		lIdTextArea,
		'" maxlength="',
		GParametres.getTailleMaxAppreciationParEnumere(
			TypeGenreAppreciation.GA_BilanAnnuel_Generale,
		),
		'" style="width:600px; height:60px;',
		GStyle.composeCouleurBordure(GCouleur.bordure),
		'"></textarea>',
	);
	T.push("</div>");
	return T.join("");
}
function _construireEngagementsNonEditable() {
	const T = [];
	T.push('<div class="WhiteSpaceNormal" style="padding-top:2px;">');
	if (
		this._donnees.engagements.listeEngagements.count() > 0 ||
		this._donnees.engagements.infosLivret.commentaire
	) {
		if (this._donnees.engagements.listeEngagements.count() > 0) {
			T.push(
				'<div class="Gras">',
				GTraductions.getValeur("ficheScolaire.engagement.titre"),
				" :",
				"</div>",
			);
			T.push(
				"<div>",
				this._donnees.engagements && this._donnees.engagements.listeEngagements
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
				GTraductions.getValeur("ficheScolaire.engagement.commentaire"),
				" :",
				"</div>",
			);
			T.push(
				"<div>",
				GChaine.replaceRCToHTML(
					this._donnees.engagements.infosLivret.commentaire,
				),
				"</div>",
			);
		}
	} else {
		T.push(
			this.composeMessage(
				GTraductions.getValeur("ficheScolaire.engagement.aucun"),
			),
		);
	}
	T.push("</div>");
	return T.join("");
}
function _composeInvestissement() {
	const T = [];
	T.push('<div id="', this.idAvisInvestissement, '">');
	T.push(
		this.estNonEditable
			? _construireAvisInvestissementNonEditable.bind(this)()
			: _construireAvisInvestissement.bind(this)(),
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
		[EGenreEspace.Professeur, EGenreEspace.Etablissement].includes(
			GEtatUtilisateur.GenreEspace,
		) &&
		!this.estNonEditable
	) {
		T.push(
			_construireSignature.bind(this)(
				lNom,
				lDate,
				TypeAvisCommentaire.tac_Investissement,
			),
		);
	} else {
		T.push(_construireSignatureNonEditable.bind(this)(lNom, lDate));
	}
	T.push("</div>");
	return T.join("");
}
function _construireAvisInvestissement() {
	const T = [];
	const lIdTextArea = GUID.getId();
	T.push('<div class="EspaceHaut WhiteSpaceNormal">');
	T.push(
		'<div class="Gras"><label for="',
		lIdTextArea,
		'">',
		GTraductions.getValeur("ficheScolaire.investissement.titre"),
		"</label></div>",
	);
	T.push(
		'<textarea id="',
		lIdTextArea,
		'" maxlength="',
		GParametres.getTailleMaxAppreciationParEnumere(
			TypeGenreAppreciation.GA_BilanAnnuel_Generale,
		),
		'" style="width:600px; height:96px;',
		GStyle.composeCouleurBordure(GCouleur.bordure),
		'"></textarea>',
	);
	T.push("</div>");
	return T.join("");
}
function _construireAvisInvestissementNonEditable() {
	const T = [];
	T.push('<div class="EspaceHaut WhiteSpaceNormal">');
	if (this._donnees.investissement.infosLivret.commentaire) {
		T.push(
			'<div class="Gras">',
			GTraductions.getValeur("ficheScolaire.investissement.titre"),
			" :",
			"</div>",
		);
		T.push(
			"<div>",
			GChaine.replaceRCToHTML(
				this._donnees.investissement.infosLivret.commentaire,
			),
			"</div>",
		);
	} else {
		T.push(
			this.composeMessage(
				GTraductions.getValeur("ficheScolaire.investissement.aucun"),
			),
		);
	}
	T.push("</div>");
	return T.join("");
}
function _construireSignature(aNom, aDate, aGenre) {
	const T = [];
	this.celluleDate[aGenre] = new ObjetCelluleDate(
		this.Nom + ".celluleDate[" + aGenre + "]",
		null,
		this,
		_surCelluleDate.bind(this, aGenre),
	);
	const lIdLabelNom = GUID.getId();
	T.push('<div  class="NoWrap">');
	T.push(
		'<label id="',
		lIdLabelNom,
		'" class="EspaceDroit">',
		GTraductions.getValeur("Nom"),
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
		GTraductions.getValeur("Date"),
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
function _construireSignatureNonEditable(aNom, aDate) {
	const T = [];
	if (
		aNom &&
		aDate &&
		[EGenreEspace.Professeur, EGenreEspace.Etablissement].includes(
			GEtatUtilisateur.GenreEspace,
		)
	) {
		T.push('<div  class="NoWrap">');
		T.push(
			'<div class="InlineBlock AlignementMilieuVertical GrandEspaceHaut EspaceBas">',
			aNom ? aNom : "",
			aDate
				? GDate.formatDate(
						aDate,
						(aNom ? ", " : "") +
							GTraductions.getValeur("Le") +
							" %JJ/%MM/%AAAA",
					)
				: "",
			"</div>",
		);
		T.push("</div>");
	}
	return T.join("");
}
function _construireAvis() {
	const T = [];
	const lIdTextArea = GUID.getId();
	T.push('<div style="position:relative; height:25px;">');
	T.push(
		'<div class="Gras" style="position:relative; top:2px;"><label for="',
		lIdTextArea,
		'">',
		GTraductions.getValeur("ficheScolaire.AvisDuChefDetablissement"),
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
		GParametres.getTailleMaxAppreciationParEnumere(
			TypeGenreAppreciation.GA_BilanAnnuel_Generale,
		),
		'" style="width:410px; height:90px;',
		GStyle.composeCouleurBordure(GCouleur.bordure),
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
			[EGenreEspace.Professeur, EGenreEspace.Etablissement].includes(
				GEtatUtilisateur.GenreEspace,
			)
		) {
			T.push(
				_construireSignature.bind(this)(
					lNom,
					lDate,
					TypeAvisCommentaire.tac_ChefEtablissement,
				),
			);
		} else {
			T.push(_construireSignatureNonEditable.bind(this)(lNom, lDate));
		}
	}
	return T.join("");
}
function _construireAvisNonEditable() {
	const T = [];
	T.push('<div style="position:relative; height:25px;">');
	T.push(
		'<div style="position:relative; top:2px;"><span class="Gras">',
		GTraductions.getValeur("ficheScolaire.AvisDuChefDetablissement"),
		"&nbsp;:&nbsp;</span>",
		this._donnees.avisCE.infosLivret.avis
			? this._donnees.avisCE.infosLivret.avis.getLibelle()
			: "",
		"</div>",
	);
	T.push("</div>");
	T.push(
		'<div class="EspaceBas WhiteSpaceNormal" style="width:410px;">',
		GChaine.replaceRCToHTML(this._donnees.avisCE.infosLivret.commentaire),
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
	T.push(_construireSignatureNonEditable.bind(this)(lNom, lDate));
	return T.join("");
}
function _construireLigneRepartition(aNombre, aLibelle) {
	const T = [];
	if (this._donnees.avisCE.nbElevesTotal > 0) {
		const lValeur =
			Math.round((aNombre * 10000) / this._donnees.avisCE.nbElevesTotal) / 100;
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
function _construireRepartition() {
	const T = [];
	let lNbAvisNonRemplis = this._donnees.avisCE.nbElevesTotal;
	for (let i = 0; i < this._donnees.avisCE.listeAvis.count(); i++) {
		const lAvis = this._donnees.avisCE.listeAvis.get(i);
		lNbAvisNonRemplis -= lAvis.nbEleves;
		T.push(
			_construireLigneRepartition.bind(this)(
				lAvis.nbEleves,
				lAvis.getLibelle(),
			),
		);
	}
	T.push(
		_construireLigneRepartition.bind(this)(
			lNbAvisNonRemplis,
			GTraductions.getValeur("ficheScolaire.AvisNonRempli"),
		),
	);
	return T.join("");
}
function _composeParcoursDifferencie() {
	const T = [];
	T.push('<div id="', this.idParcoursDiff, '" class="NoWrap">');
	T.push(
		'<div class="InlineBlock AlignementHaut">',
		this.estNonEditableAvisCE
			? _construireParcoursDifferencieNonEditable.bind(this)()
			: _construireParcoursDifferencieEditable.bind(this)(),
		"</div>",
	);
	T.push("</div>");
	return T.join("");
}
function _construireParcoursDifferencieEditable() {
	const T = [];
	const lIdTextArea = GUID.getId();
	const lAvecDonneesParcoursDiff =
		this._donnees &&
		this._donnees.parcoursDifferencie &&
		this._donnees.parcoursDifferencie.infosLivret;
	T.push('<div style="position:relative; height:25px;">');
	T.push(
		`<div><p>${GTraductions.getValeur("ficheScolaire.ParcoursDifferencie")} : ${lAvecDonneesParcoursDiff && this._donnees.parcoursDifferencie.infosLivret.libelleParcours ? this._donnees.parcoursDifferencie.infosLivret.libelleParcours : ""}</p></div>`,
	);
	T.push("</div>");
	T.push(
		'<div><label for="',
		lIdTextArea,
		'" class="Gras">',
		GTraductions.getValeur("ficheScolaire.parcoursDifferencie.commentaire"),
		"</label></div>",
	);
	T.push(
		'<textarea id="',
		lIdTextArea,
		'" maxlength="',
		GParametres.getTailleMaxAppreciationParEnumere(
			TypeGenreAppreciation.GA_BilanAnnuel_Generale,
		),
		'" style="width:410px; height:90px;',
		GStyle.composeCouleurBordure(GCouleur.bordure),
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
		[EGenreEspace.Professeur, EGenreEspace.Etablissement].includes(
			GEtatUtilisateur.GenreEspace,
		)
	) {
		T.push(_construireSignature.bind(this)(lNom, lDate, C_ParcoursDifferencie));
	} else {
		T.push(_construireSignatureNonEditable.bind(this)(lNom, lDate));
	}
	return T.join("");
}
function _construireParcoursDifferencieNonEditable() {
	const T = [];
	const lAvecDonneesParcoursDiff =
		this._donnees &&
		this._donnees.parcoursDifferencie &&
		this._donnees.parcoursDifferencie.infosLivret;
	T.push('<div style="position:relative; height:25px;">');
	T.push(
		`<div><p>${GTraductions.getValeur("ficheScolaire.ParcoursDifferencie")} : ${lAvecDonneesParcoursDiff && this._donnees.parcoursDifferencie.infosLivret.libelleParcours ? this._donnees.parcoursDifferencie.infosLivret.libelleParcours : ""}</p></div>`,
	);
	T.push("</div>");
	T.push(
		"<div>",
		GTraductions.getValeur("ficheScolaire.parcoursDifferencie.commentaire"),
		"</div>",
	);
	T.push(
		'<div class="EspaceBas WhiteSpaceNormal" style="width:410px;">',
		lAvecDonneesParcoursDiff
			? GChaine.replaceRCToHTML(
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
	T.push(_construireSignatureNonEditable.bind(this)(lNom, lDate));
	return T.join("");
}
function _evntDeclencherFenetreRessource(aDonnees) {
	let lListeDonnees = new ObjetListeElements();
	if (this.genreAvisCommentaire === TypeAvisCommentaire.tac_Investissement) {
		lListeDonnees = aDonnees.listeAuteurs;
		lListeDonnees.setTri([ObjetTri.init("Position"), ObjetTri.init("Libelle")]);
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
					lPere = new ObjetElement(
						aElement.fonction.getLibelle(),
						aElement.fonction.getNumero(),
						-2,
						1,
					);
					lPere.estUnDeploiement = true;
					lPere.estDeploye = true;
					lListeDonnees.addElement(lPere);
				}
			} else if (aElement.getGenre() === EGenreRessource.Enseignant) {
				lPere = new ObjetElement(
					GTraductions.getValeur("Professeur"),
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
					lPere = new ObjetElement(
						GTraductions.getValeur("FonctionNonPrecisee"),
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
		lListeDonnees.setTri(
			ObjetTri.initRecursif("pere", [
				ObjetTri.init("Position"),
				ObjetTri.init("Libelle"),
			]),
		);
		lListeDonnees.trier();
	}
	this.listeSignataires = new ObjetListeElements();
	this.listeSignataires.addElement(
		new ObjetElement(GTraductions.getValeur("Aucun"), null, -1, 0),
	);
	this.listeSignataires.add(lListeDonnees);
	switch (this.genreAvisCommentaire) {
		case TypeAvisCommentaire.tac_ChefEtablissement:
			this.fenetreSelectPublic.setOptionsFenetre({
				titre: GTraductions.getValeur("ficheScolaire.Signataire.AvisCE"),
			});
			break;
		case TypeAvisCommentaire.tac_Engagement:
			this.fenetreSelectPublic.setOptionsFenetre({
				titre: GTraductions.getValeur("ficheScolaire.Signataire.Engagement"),
			});
			break;
		case TypeAvisCommentaire.tac_Investissement:
			this.fenetreSelectPublic.setOptionsFenetre({
				titre: GTraductions.getValeur(
					"ficheScolaire.Signataire.Investissement",
				),
			});
			break;
		case C_ParcoursDifferencie:
			this.fenetreSelectPublic.setOptionsFenetre({
				titre: GTraductions.getValeur(
					"ficheScolaire.Signataire.ParcoursDifferencie",
				),
			});
			break;
		default:
			break;
	}
	this.fenetreSelectPublic.setDonnees(
		new DonneesListe_SelectionSignataireAvis(this.listeSignataires),
	);
}
function _getGenreIndividu(aGenreRessource) {
	switch (aGenreRessource) {
		case EGenreRessource.Enseignant:
			return TypeGenreIndividuAuteur.GIA_Professeur;
		case EGenreRessource.Personnel:
			return TypeGenreIndividuAuteur.GIA_Personnel;
		case EGenreRessource.Responsable:
			return TypeGenreIndividuAuteur.GIA_Responsable;
		case EGenreRessource.Eleve:
			return TypeGenreIndividuAuteur.GIA_Eleve;
		case EGenreRessource.MaitreDeStage:
			return TypeGenreIndividuAuteur.GIA_MaitreDeStage;
		case EGenreRessource.InspecteurPedagogique:
			return TypeGenreIndividuAuteur.GIA_Inspecteur;
		default:
			break;
	}
}
function _surChangeTextArea(event) {
	const lInstance = event.data.instance;
	lInstance.setEtatSaisie(true);
	lInstance._donnees.avisCE.infosLivret.setEtat(EGenreEtat.Modification);
	lInstance._donnees.avisCE.infosLivret.commentaire = GHtml.getValue(this);
	if (!lInstance.estNonEditableAvisCE) {
		if (lInstance._donnees.avisCE.infosLivret.commentaire) {
			if (
				!lInstance._donnees.avisCE.infosLivret.date &&
				lInstance._donnees.estIssueDUnBOLycee
			) {
				lInstance._donnees.avisCE.infosLivret.date = GDate.getDateCourante();
				lInstance.celluleDate[
					TypeAvisCommentaire.tac_ChefEtablissement
				].setActif(true);
				lInstance.celluleDate[
					TypeAvisCommentaire.tac_ChefEtablissement
				].setDonnees(lInstance._donnees.avisCE.infosLivret.date);
			}
		} else {
			lInstance._donnees.avisCE.infosLivret.date = null;
			lInstance._donnees.avisCE.infosLivret.auteur = null;
			lInstance.celluleDate[
				TypeAvisCommentaire.tac_ChefEtablissement
			].setDonnees(lInstance._donnees.avisCE.infosLivret.date);
			lInstance.celluleDate[TypeAvisCommentaire.tac_ChefEtablissement].setActif(
				false,
			);
		}
		lInstance.$refresh();
	}
}
function _surChangeCommentaireEngagements(event) {
	const lInstance = event.data.instance;
	lInstance.setEtatSaisie(true);
	lInstance._donnees.engagements.infosLivret.setEtat(EGenreEtat.Modification);
	lInstance._donnees.engagements.estModifie = true;
	lInstance._donnees.engagements.infosLivret.commentaire = GHtml.getValue(this);
	if (!lInstance.estNonEditable) {
		if (lInstance._donnees.engagements.infosLivret.commentaire) {
			if (!lInstance._donnees.engagements.infosLivret.date) {
				lInstance._donnees.engagements.infosLivret.date =
					GDate.getDateCourante();
				lInstance.celluleDate[TypeAvisCommentaire.tac_Engagement].setActif(
					true,
				);
				lInstance.celluleDate[TypeAvisCommentaire.tac_Engagement].setDonnees(
					lInstance._donnees.engagements.infosLivret.date,
				);
			}
		} else {
			lInstance._donnees.engagements.infosLivret.date = null;
			lInstance._donnees.engagements.infosLivret.auteur = null;
			lInstance.celluleDate[TypeAvisCommentaire.tac_Engagement].setDonnees(
				lInstance._donnees.engagements.infosLivret.date,
			);
			lInstance.celluleDate[TypeAvisCommentaire.tac_Engagement].setActif(false);
		}
		lInstance.$refresh();
	}
}
function _surChangeCommentaireInvestissement(event) {
	const lInstance = event.data.instance;
	lInstance.setEtatSaisie(true);
	lInstance._donnees.investissement.infosLivret.setEtat(
		EGenreEtat.Modification,
	);
	lInstance._donnees.investissement.estModifie = true;
	lInstance._donnees.investissement.infosLivret.commentaire =
		GHtml.getValue(this);
	if (!lInstance.estNonEditable) {
		if (lInstance._donnees.investissement.infosLivret.commentaire) {
			if (!lInstance._donnees.investissement.infosLivret.date) {
				lInstance._donnees.investissement.infosLivret.date =
					GDate.getDateCourante();
				lInstance.celluleDate[TypeAvisCommentaire.tac_Investissement].setActif(
					true,
				);
				lInstance.celluleDate[
					TypeAvisCommentaire.tac_Investissement
				].setDonnees(lInstance._donnees.investissement.infosLivret.date);
			}
			if (!lInstance._donnees.investissement.infosLivret.auteur) {
				lInstance._donnees.investissement.infosLivret.auteur = new ObjetElement(
					GEtatUtilisateur.getUtilisateur().getLibelle(),
					GEtatUtilisateur.getUtilisateur().getNumero(),
					_getGenreIndividu.bind(lInstance)(
						GEtatUtilisateur.getUtilisateur().getGenre(),
					),
				);
			}
		} else {
			lInstance._donnees.investissement.infosLivret.date = null;
			lInstance._donnees.investissement.infosLivret.auteur = null;
			lInstance.celluleDate[TypeAvisCommentaire.tac_Investissement].setDonnees(
				lInstance._donnees.investissement.infosLivret.date,
			);
			lInstance.celluleDate[TypeAvisCommentaire.tac_Investissement].setActif(
				false,
			);
		}
		lInstance.$refresh();
	}
}
function _surChangeCommentaireParcoursDifferencie(event) {
	const lInstance = event.data.instance;
	lInstance.setEtatSaisie(true);
	lInstance._donnees.parcoursDifferencie.infosLivret.setEtat(
		EGenreEtat.Modification,
	);
	lInstance._donnees.parcoursDifferencie.infosLivret.estModifie = true;
	lInstance._donnees.parcoursDifferencie.infosLivret.commentaire =
		GHtml.getValue(this);
	if (!lInstance.estNonEditable) {
		if (lInstance._donnees.parcoursDifferencie.infosLivret.commentaire) {
			if (!lInstance._donnees.parcoursDifferencie.infosLivret.date) {
				lInstance._donnees.parcoursDifferencie.infosLivret.date =
					GDate.getDateCourante();
				lInstance.celluleDate[C_ParcoursDifferencie].setActif(true);
				lInstance.celluleDate[C_ParcoursDifferencie].setDonnees(
					lInstance._donnees.parcoursDifferencie.infosLivret.date,
				);
			}
			if (!lInstance._donnees.parcoursDifferencie.infosLivret.auteur) {
				lInstance._donnees.parcoursDifferencie.infosLivret.auteur =
					new ObjetElement(
						GEtatUtilisateur.getUtilisateur().getLibelle(),
						GEtatUtilisateur.getUtilisateur().getNumero(),
						_getGenreIndividu.bind(lInstance)(
							GEtatUtilisateur.getUtilisateur().getGenre(),
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
class DonneesListe_PFMP extends ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.param = $.extend({ tailleMax: 300, estExportSynthese: false }, aParam);
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
				return aParams.article.editable;
		}
		return this.options.avecEdition;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_PFMP.colonnes.professeur:
				return aParams.article.getLibelle();
			case DonneesListe_PFMP.colonnes.export: {
				if (aParams.article.exportable && !this.param.estExportSynthese) {
					return `<i class="icon_share" aria-label="${GTraductions.getValeur("ficheScolaire.pfmp.legendeAppr", [this.param.tailleMax])}"></i>`;
				}
				return "";
			}
			case DonneesListe_PFMP.colonnes.appreciation:
				return aParams.article.appreciation.getLibelle();
		}
		return "";
	}
	surEdition(aParams, V) {
		aParams.article.appreciation.setEtat(EGenreEtat.Modification);
		aParams.article.setEtat(EGenreEtat.Modification);
		aParams.article.appreciation.setLibelle(V);
		aParams.article.appreciation._validationSaisie = true;
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_PFMP.colonnes.export:
				return ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_PFMP.colonnes.appreciation:
				return ObjetDonneesListe.ETypeCellule.ZoneTexte;
			default:
				return ObjetDonneesListe.ETypeCellule.Texte;
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
DonneesListe_PFMP.colonnes = {
	professeur: "DLPFMP_professeur",
	export: "DLPFMP_export",
	appreciation: "DLPFMP_appreciation",
};
DonneesListe_PFMP.options = {
	colonnes: [
		{
			id: DonneesListe_PFMP.colonnes.professeur,
			titre: {
				libelle: GTraductions.getValeur("ficheScolaire.pfmp.professeur"),
			},
			taille: ObjetListe.initColonne(35, 320, 400),
			sansBordureDroite: true,
		},
		{
			id: DonneesListe_PFMP.colonnes.export,
			titre: {
				libelle: GTraductions.getValeur("ficheScolaire.pfmp.professeur"),
				avecFusionColonne: true,
			},
			taille: 12,
		},
		{
			id: DonneesListe_PFMP.colonnes.appreciation,
			titre: {
				libelle: GTraductions.getValeur("ficheScolaire.pfmp.appreciations"),
			},
			taille: ObjetListe.initColonne(65, 520, 600),
		},
	],
	hauteurAdapteContenu: true,
};
class DonneesListe_SelectionSignataireAvis extends ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecEdition: false,
			avecSuppression: false,
			avecDeploiement: true,
			avecTri: false,
		});
	}
	getValeur(aParams) {
		return aParams.article.getLibelle();
	}
	avecSelection(aParams) {
		return !aParams.article.estUnDeploiement;
	}
	avecEvenementSelection(aParams) {
		return !aParams.article.estUnDeploiement;
	}
	avecImageSurColonneDeploiement(aParams) {
		return aParams.article && aParams.article.estUnDeploiement;
	}
	getIndentationCellule(aParams) {
		return this.getIndentationCelluleSelonParente(aParams);
	}
	getClass(aParams) {
		return aParams.article && aParams.article.estUnDeploiement ? "Gras" : "";
	}
}
module.exports = { ObjetPiedFicheScolaire };
