exports.InterfacePageBulletinCompetences = void 0;
const PageBulletinCompetences_1 = require("PageBulletinCompetences");
const ObjetRequeteBulletinCompetences_1 = require("ObjetRequeteBulletinCompetences");
const ObjetIdentite_1 = require("ObjetIdentite");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSelection_1 = require("ObjetSelection");
const ObjetTabOnglets_1 = require("ObjetTabOnglets");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeGenreBulletinCompetence_1 = require("TypeGenreBulletinCompetence");
const UtilitaireCompetences_Mobile_1 = require("UtilitaireCompetences_Mobile");
const MultiObjetRequeteSaisieAccuseReceptionDocument = require("ObjetRequeteSaisieAccuseReceptionDocument");
const ObjetBoutonFlottant_1 = require("ObjetBoutonFlottant");
const UtilitaireGenerationPDF_1 = require("UtilitaireGenerationPDF");
const OptionsPDFSco_1 = require("OptionsPDFSco");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const UtilitaireGestionCloudEtPDF_1 = require("UtilitaireGestionCloudEtPDF");
const Enumere_Message_1 = require("Enumere_Message");
const ObjetHtml_1 = require("ObjetHtml");
const AccessApp_1 = require("AccessApp");
class InterfacePageBulletinCompetences extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.periodeCourant = new ObjetElement_1.ObjetElement();
		this.idWrapper = this.Nom + "_wrapper";
		this.listeTabs = new ObjetListeElements_1.ObjetListeElements();
		this.identBtnFlottant = null;
		this.avecGestionAccuseReception =
			[
				Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
				Enumere_Espace_1.EGenreEspace.Mobile_Parent,
			].includes(GEtatUtilisateur.GenreEspace) &&
			(this.etatUtilisateurSco.pourPrimaire() ||
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionARBulletins,
				));
	}
	jsxIdentiteBoutonFlottant() {
		return {
			class: ObjetBoutonFlottant_1.ObjetBoutonFlottant,
			pere: this,
			init: (aInstanceBouton) => {
				this.identBtnFlottant = aInstanceBouton;
				const lListeBtn = [];
				if (
					this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.autoriserImpressionBulletinReleveBrevet,
					)
				) {
					lListeBtn.push({
						primaire: true,
						icone: "icon_uniF1C1",
						ariaLabel: ObjetTraduction_1.GTraductions.getValeur(
							"GenerationPDF.TitreCommande",
						),
						callback: this.afficherModalitesGenerationPDF.bind(this),
					});
				}
				lListeBtn.push({
					icone: "icon_diffuser_information",
					ariaLabel: ObjetTraduction_1.GTraductions.getValeur(
						"competences.Legende",
					),
					callback: this.surClicLegende.bind(this, true),
				});
				aInstanceBouton.setOptionsBouton({ listeBoutons: lListeBtn });
			},
		};
	}
	afficherModalitesGenerationPDF() {
		let lParams = {
			callbaskEvenement: this.surEvenementFenetre.bind(this),
			modeGestion:
				UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.modeGestion
					.PDFEtCloud,
			avecDepot: true,
			avecTitreSelonOnglet: true,
		};
		UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.creerFenetreGestion(
			lParams,
		);
	}
	surEvenementFenetre(aLigne) {
		const lService = GEtatUtilisateur.listeCloudDepotServeur.get(aLigne);
		this._genererPdf(!!lService ? lService.getGenre() : null);
	}
	construireInstances() {
		this.identSelection = this.add(
			ObjetSelection_1.ObjetSelection,
			this.surSelectionPeriode,
			this._initSelecteur.bind(this),
		);
		if (this.avecGestionAccuseReception) {
			this.identCbAccuseReception = this.add(
				ObjetCheckBox,
				this._surEvenementAccuseReception.bind(this),
			);
		}
		this.identTabs = this.add(
			ObjetTabOnglets_1.ObjetTabOnglets,
			null,
			this._initialiserObjetTabs,
		);
		this.identPageBilanParMatiere = this.add(
			PageBulletinCompetences_1.PageBulletinCompetences,
		);
		this.identPageBilanTransversal = this.add(
			PageBulletinCompetences_1.PageBulletinCompetences,
		);
		const lOngletInterfaceParMatiere = ObjetElement_1.ObjetElement.create({
			Libelle: ObjetTraduction_1.GTraductions.getValeur(
				"competences.BilanParMatiere",
			),
			Genre:
				TypeGenreBulletinCompetence_1.TypeGenreBulletinCompetence
					.tGBC_ParMatiere,
			Actif: false,
			idDiv: this.getNomInstance(this.identPageBilanParMatiere),
		});
		this.listeTabs.addElement(lOngletInterfaceParMatiere);
		const lOngletInterfaceBilanTransv = ObjetElement_1.ObjetElement.create({
			Libelle: ObjetTraduction_1.GTraductions.getValeur(
				"competences.BilanTransversal",
			),
			Genre:
				TypeGenreBulletinCompetence_1.TypeGenreBulletinCompetence
					.tGBC_Transversal,
			Actif: false,
			idDiv: this.getNomInstance(this.identPageBilanTransversal),
		});
		this.listeTabs.addElement(lOngletInterfaceBilanTransv);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.AddSurZone = [];
		this.AddSurZone.push(this.identSelection);
		if (!!this.identCbAccuseReception) {
			this.AddSurZone.push(this.identCbAccuseReception);
		}
		this.AddSurZone.push(this.identTabs);
	}
	construireStructureAffichageAutre() {
		const lHtml = [];
		lHtml.push(
			IE.jsx.str(
				"div",
				{ id: this.idWrapper },
				IE.jsx.str("div", {
					id: this.getNomInstance(this.identPageBilanParMatiere),
				}),
				IE.jsx.str("div", {
					id: this.getNomInstance(this.identPageBilanTransversal),
				}),
			),
		);
		if (!this.identBtnFlottant) {
			$("#" + GInterface.idZonePrincipale).ieHtmlAppend(
				IE.jsx.str("div", {
					class: "is-sticky",
					"ie-identite": this.jsxIdentiteBoutonFlottant.bind(this),
				}),
				{ controleur: this.controleur, avecCommentaireConstructeur: false },
			);
			this.identBtnFlottant.setVisible(false);
		}
		return lHtml.join("");
	}
	surClicLegende(avecNiveauxPositionnements) {
		UtilitaireCompetences_Mobile_1.UtilitaireCompetences_Mobile.openPopupDetailLegende(
			avecNiveauxPositionnements,
		);
	}
	recupererDonnees() {
		const lOngletInfosPeriodes =
			this.etatUtilisateurSco.getOngletInfosPeriodes();
		const lListePeriodes = lOngletInfosPeriodes.listePeriodes;
		if (!(lListePeriodes && lListePeriodes.count())) {
			if (!!this.identCbAccuseReception) {
				this.getInstance(this.identCbAccuseReception).setVisible(false);
			}
			const lGenreMessage =
				Enumere_Message_1.EGenreMessage.AucunBulletinDeCompetencesPourEleve;
			const lMessage =
				typeof lGenreMessage === "number"
					? ObjetTraduction_1.GTraductions.getValeur("Message")[lGenreMessage]
					: lGenreMessage;
			const lHtml = [];
			lHtml.push(this.composeAucuneDonnee(lMessage));
			ObjetHtml_1.GHtml.setHtml(this.Nom, lHtml.join(""));
		} else {
			const lNrPeriodeParDefaut =
				this.etatUtilisateurSco.getPage() &&
				this.etatUtilisateurSco.getPage().periode
					? this.etatUtilisateurSco.getPage().periode.getNumero()
					: lOngletInfosPeriodes.periodeParDefaut.getNumero();
			let lIndiceParDefaut =
				lListePeriodes.getIndiceParNumeroEtGenre(lNrPeriodeParDefaut);
			if (!lIndiceParDefaut) {
				lIndiceParDefaut = 0;
			}
			this.periodeCourant = lListePeriodes.get(lIndiceParDefaut);
			this.getInstance(this.identSelection).setDonnees(
				lListePeriodes,
				lIndiceParDefaut,
				null,
			);
		}
	}
	actionSurRecupererDonnees(aIndiceBulletin, aParams) {
		this.maquetteBulletin = aParams.maquette;
		if (!this.maquetteBulletin) {
			this.listeTabs.getElementParGenre(
				TypeGenreBulletinCompetence_1.TypeGenreBulletinCompetence
					.tGBC_ParMatiere,
			).Actif = true;
			this.listeTabs.getElementParGenre(
				TypeGenreBulletinCompetence_1.TypeGenreBulletinCompetence
					.tGBC_Transversal,
			).Actif = false;
			this.getInstance(this.identPageBilanParMatiere).setMessage(
				aParams.Message,
			);
			if (!!this.identCbAccuseReception) {
				this.getInstance(this.identCbAccuseReception).setVisible(false);
			}
			this.identBtnFlottant.setVisible(false);
		} else {
			const lBulletin = this.maquetteBulletin.listeBulletins.get(
				aIndiceBulletin || 0,
			);
			if (
				lBulletin &&
				lBulletin.getGenre() ===
					TypeGenreBulletinCompetence_1.TypeGenreBulletinCompetence
						.tGBC_ParMatiere
			) {
				this.getInstance(this.identPageBilanParMatiere).setDonnees(
					aParams,
					true,
				);
				this.listeTabs.getElementParGenre(
					TypeGenreBulletinCompetence_1.TypeGenreBulletinCompetence
						.tGBC_ParMatiere,
				).Actif = true;
			} else if (
				lBulletin &&
				lBulletin.getGenre() ===
					TypeGenreBulletinCompetence_1.TypeGenreBulletinCompetence
						.tGBC_Transversal
			) {
				this.getInstance(this.identPageBilanTransversal).setDonnees(
					aParams,
					false,
				);
				this.listeTabs.getElementParGenre(
					TypeGenreBulletinCompetence_1.TypeGenreBulletinCompetence
						.tGBC_Transversal,
				).Actif = true;
				if (aIndiceBulletin === 0) {
					this.listeTabs.getElementParGenre(
						TypeGenreBulletinCompetence_1.TypeGenreBulletinCompetence
							.tGBC_ParMatiere,
					).Actif = false;
				}
			}
			if (aIndiceBulletin < this.maquetteBulletin.listeBulletins.count() - 1) {
				this.lancerRequete(++aIndiceBulletin);
				return;
			}
			if (!!this.identCbAccuseReception) {
				this.getInstance(this.identCbAccuseReception).setVisible(true);
				let lCbAccuseReceptionValeur = false;
				let lReponsableAccuseReception = null;
				if (
					!!aParams.listeAccusesReception &&
					aParams.listeAccusesReception.count() > 0
				) {
					lReponsableAccuseReception =
						aParams.listeAccusesReception.getPremierElement();
					if (!!lReponsableAccuseReception) {
						lCbAccuseReceptionValeur =
							lReponsableAccuseReception.aPrisConnaissance;
					}
				}
				this.getInstance(this.identCbAccuseReception).setDonnees(
					lCbAccuseReceptionValeur,
				);
				this.getInstance(this.identCbAccuseReception).setVisible(
					!!lReponsableAccuseReception,
				);
			}
			this.identBtnFlottant.setVisible(true);
		}
		this.getInstance(this.identTabs).setDonnees(this.listeTabs, 0);
		const $wrapper = $("#" + this.idWrapper.escapeJQ());
		let $tailleLegende = 0;
		const $legende = $wrapper.siblings("footer");
		if ($legende.is(":visible")) {
			$tailleLegende = $legende.height();
		}
		$wrapper.css("margin-bottom", $tailleLegende + "px");
	}
	lancerRequete(aIndiceBulletin) {
		new ObjetRequeteBulletinCompetences_1.ObjetRequeteBulletinCompetences(
			this,
			this.actionSurRecupererDonnees.bind(this, aIndiceBulletin),
		).lancerRequete({
			classe: GEtatUtilisateur.getMembre().Classe,
			periode: this.periodeCourant,
			eleve: GEtatUtilisateur.getMembre(),
			bulletin: this.maquetteBulletin
				? this.maquetteBulletin.listeBulletins.get(aIndiceBulletin)
				: undefined,
		});
	}
	free() {
		super.free();
		if (this.identBtnFlottant) {
			$("#" + this.identBtnFlottant.getNom().escapeJQ()).remove();
		}
	}
	surSelectionPeriode(aParam) {
		this.periodeCourant = aParam.element;
		this.etatUtilisateurSco.Navigation.setRessource(
			Enumere_Ressource_1.EGenreRessource.Periode,
			aParam.element,
		);
		this.lancerRequete(
			TypeGenreBulletinCompetence_1.TypeGenreBulletinCompetence.tGBC_ParMatiere,
		);
	}
	_genererPdf(aService) {
		const lParametrageAffichage = {
			genreGenerationPDF:
				TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
					.BulletinDeCompetences,
			periode: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
			),
			avecCodeCompetences: GEtatUtilisateur.estAvecCodeCompetences(),
		};
		UtilitaireGenerationPDF_1.GenerationPDF.genererPDF({
			paramPDF: lParametrageAffichage,
			optionsPDF: OptionsPDFSco_1.OptionsPDFSco.BulletinDeCompetences,
			cloudCible: aService,
		});
	}
	_surEvenementAccuseReception(aPrisConnaissance) {
		new MultiObjetRequeteSaisieAccuseReceptionDocument.ObjetRequeteSaisieAccuseReceptionDocument(
			this,
		).lancerRequete({
			aPrisConnaissance: aPrisConnaissance,
			periode: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
			),
		});
	}
	_initialiserObjetTabs(aInstance) {
		aInstance.setOptionsTabOnglets({ avecSwipe: false });
	}
	_initSelecteur(aInstance) {
		aInstance.setParametres({
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionPeriode",
			),
		});
	}
}
exports.InterfacePageBulletinCompetences = InterfacePageBulletinCompetences;
class ObjetCheckBox extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.estActif = false;
	}
	jsxModeleCheckboxJAiPrisConnaissance() {
		return {
			getValue: () => {
				return this.estActif;
			},
			setValue: (aValue) => {
				this.estActif = aValue;
				this.callback.appel(this.estActif);
			},
			getDisabled: () => {
				return this.estActif;
			},
		};
	}
	setDonnees(aEstActif) {
		this.estActif = aEstActif;
	}
	construireAffichage() {
		const lHtml = [];
		lHtml.push(
			IE.jsx.str(
				"div",
				{ style: "padding: 0.5rem;" },
				IE.jsx.str(
					"ie-checkbox",
					{
						class: "AlignementMilieuVertical",
						"ie-model": this.jsxModeleCheckboxJAiPrisConnaissance.bind(this),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.JAiPrisConnaissanceDuBilanPeriodique",
					),
				),
			),
		);
		return lHtml.join("");
	}
}
