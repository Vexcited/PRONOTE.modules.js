const ObjetBulletinCompetences = require("PageBulletinCompetences.js");
const {
	ObjetRequeteBulletinCompetences,
} = require("ObjetRequeteBulletinCompetences.js");
const { Identite } = require("ObjetIdentite.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage_Mobile } = require("InterfacePage_Mobile.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetSelection } = require("ObjetSelection.js");
const { ObjetTabOnglets } = require("ObjetTabOnglets.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	TypeGenreBulletinCompetence,
} = require("TypeGenreBulletinCompetence.js");
const UtilitaireCompetences_Mobile = require("UtilitaireCompetences_Mobile.js");
const ObjetRequeteSaisieAccuseReceptionDocument = require("ObjetRequeteSaisieAccuseReceptionDocument.js");
const { ObjetBoutonFlottant } = require("ObjetBoutonFlottant.js");
const { GenerationPDF } = require("UtilitaireGenerationPDF.js");
const { OptionsPDFSco } = require("OptionsPDFSco.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const {
	UtilitaireGestionCloudEtPDF,
} = require("UtilitaireGestionCloudEtPDF.js");
const { EGenreMessage } = require("Enumere_Message.js");
const { GHtml } = require("ObjetHtml.js");
class InterfacePageBulletinCompetences extends InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.listePeriodes = new ObjetListeElements();
		this.periodeCourant = new ObjetElement();
		this.indiceParDefaut = 0;
		this.idWrapper = this.Nom + "_wrapper";
		this.listeTabs = new ObjetListeElements();
		this.GenreStructure = EStructureAffichage.Autre;
		this.identBtnFlottant = null;
		this.avecGestionAccuseReception =
			[EGenreEspace.Mobile_PrimParent, EGenreEspace.Mobile_Parent].includes(
				GEtatUtilisateur.GenreEspace,
			) &&
			(GEtatUtilisateur.pourPrimaire() ||
				GApplication.droits.get(TypeDroits.fonctionnalites.gestionARBulletins));
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			getIdentiteBouton: function () {
				return {
					class: ObjetBoutonFlottant,
					pere: this,
					init: function (aBtn) {
						aInstance.identBtnFlottant = aBtn;
						const lListeBtn = [];
						if (
							GApplication.droits.get(
								TypeDroits.autoriserImpressionBulletinReleveBrevet,
							)
						) {
							lListeBtn.push({
								primaire: true,
								icone: "icon_pdf",
								callback: aInstance.afficherModalitesGenerationPDF.bind(
									this,
									aInstance,
									_genererPdf,
								),
							});
						}
						lListeBtn.push({
							icone: "icon_diffuser_information",
							callback: aInstance.surClicLegende.bind(this, true),
						});
						aBtn.setOptionsBouton({ listeBoutons: lListeBtn });
					},
				};
			},
		});
	}
	afficherModalitesGenerationPDF(aInstance) {
		let lParams = {
			callbaskEvenement: aInstance.surEvenementFenetre.bind(aInstance),
			modeGestion: UtilitaireGestionCloudEtPDF.modeGestion.PDFEtCloud,
			avecDepot: true,
			avecTitreSelonOnglet: true,
		};
		UtilitaireGestionCloudEtPDF.creerFenetreGestion(lParams);
	}
	surEvenementFenetre(aLigne) {
		const lService = GEtatUtilisateur.listeCloudDepotServeur.get(aLigne);
		_genererPdf.call(this, !!lService ? lService.getGenre() : null);
	}
	construireInstances() {
		this.identSelection = this.add(
			ObjetSelection,
			this.surSelectionPeriode,
			_initSelecteur.bind(this),
		);
		if (this.avecGestionAccuseReception) {
			this.identCbAccuseReception = this.add(
				ObjetCheckBox,
				_surEvenementAccuseReception.bind(this),
			);
		}
		this.identTabs = this.add(ObjetTabOnglets, null, _initialiserObjetTabs);
		this.identPageBilanParMatiere = this.add(ObjetBulletinCompetences);
		const lObjElementParMatiere = new ObjetElement(
			GTraductions.getValeur("competences.BilanParMatiere"),
			null,
			TypeGenreBulletinCompetence.tGBC_ParMatiere,
		);
		lObjElementParMatiere.Actif = false;
		lObjElementParMatiere.idDiv = this.getInstance(
			this.identPageBilanParMatiere,
		).getNom();
		this.listeTabs.addElement(lObjElementParMatiere);
		this.identPageBilanTransversal = this.add(ObjetBulletinCompetences);
		const lObjElementBilanTransv = new ObjetElement(
			GTraductions.getValeur("competences.BilanTransversal"),
			null,
			TypeGenreBulletinCompetence.tGBC_Transversal,
		);
		lObjElementBilanTransv.Actif = false;
		lObjElementBilanTransv.idDiv = this.getInstance(
			this.identPageBilanTransversal,
		).getNom();
		this.listeTabs.addElement(lObjElementBilanTransv);
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
			'<div id="',
			this.idWrapper,
			'">',
			'<div id="',
			this.getInstance(this.identPageBilanParMatiere).getNom(),
			'"></div>',
			'<div id="',
			this.getInstance(this.identPageBilanTransversal).getNom(),
			'"></div>',
			"</div>",
		);
		if (!this.identBtnFlottant) {
			$("#" + GInterface.idZonePrincipale).ieHtmlAppend(
				'<div class="is-sticky" ie-identite="getIdentiteBouton" ></div>',
				{ controleur: this.controleur, avecCommentaireConstructeur: false },
			);
			this.identBtnFlottant.setVisible(false);
		}
		return lHtml.join("");
	}
	surClicLegende(avecNiveauxPositionnements) {
		UtilitaireCompetences_Mobile.openPopupDetailLegende(
			avecNiveauxPositionnements,
		);
	}
	recupererDonnees() {
		const lOngletInfosPeriodes = GEtatUtilisateur.getOngletInfosPeriodes();
		this.listePeriodes = lOngletInfosPeriodes.listePeriodes;
		if (!(this.listePeriodes && this.listePeriodes.count())) {
			if (!!this.identCbAccuseReception) {
				this.getInstance(this.identCbAccuseReception).setVisible(false);
			}
			const lGenreMessage = EGenreMessage.AucunBulletinDeCompetencesPourEleve;
			const lMessage =
				typeof lGenreMessage === "number"
					? GTraductions.getValeur("Message")[lGenreMessage]
					: lGenreMessage;
			const lHtml = [];
			lHtml.push(this.composeAucuneDonnee(lMessage));
			GHtml.setHtml(this.Nom, lHtml);
		} else {
			const lNrPeriodeParDefaut =
				GEtatUtilisateur.getPage() && GEtatUtilisateur.getPage().periode
					? GEtatUtilisateur.getPage().periode.getNumero()
					: lOngletInfosPeriodes.periodeParDefaut.getNumero();
			this.indiceParDefaut =
				this.listePeriodes.getIndiceParNumeroEtGenre(lNrPeriodeParDefaut);
			if (!this.indiceParDefaut) {
				this.indiceParDefaut = 0;
			}
			this.periodeCourant = this.listePeriodes.get(this.indiceParDefaut);
			this.getInstance(this.identSelection).setDonnees(
				this.listePeriodes,
				this.indiceParDefaut,
				null,
				"",
			);
		}
	}
	actionSurRecupererDonnees(aIndiceBulletin, aParams) {
		this.maquetteBulletin = aParams.maquette;
		if (!this.maquetteBulletin) {
			this.listeTabs.getElementParGenre(
				TypeGenreBulletinCompetence.tGBC_ParMatiere,
			).Actif = true;
			this.listeTabs.getElementParGenre(
				TypeGenreBulletinCompetence.tGBC_Transversal,
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
				lBulletin.getGenre() === TypeGenreBulletinCompetence.tGBC_ParMatiere
			) {
				this.getInstance(this.identPageBilanParMatiere).setDonnees(
					aParams,
					true,
				);
				this.listeTabs.getElementParGenre(
					TypeGenreBulletinCompetence.tGBC_ParMatiere,
				).Actif = true;
			} else if (
				lBulletin &&
				lBulletin.getGenre() === TypeGenreBulletinCompetence.tGBC_Transversal
			) {
				this.getInstance(this.identPageBilanTransversal).setDonnees(
					aParams,
					false,
				);
				this.listeTabs.getElementParGenre(
					TypeGenreBulletinCompetence.tGBC_Transversal,
				).Actif = true;
				if (aIndiceBulletin === 0) {
					this.listeTabs.getElementParGenre(
						TypeGenreBulletinCompetence.tGBC_ParMatiere,
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
		new ObjetRequeteBulletinCompetences(
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
	free(...aParams) {
		super.free(...aParams);
		if (this.identBtnFlottant) {
			$("#" + this.identBtnFlottant.getNom().escapeJQ()).remove();
		}
	}
	surSelectionPeriode(aParam) {
		this.periodeCourant = aParam.element;
		GEtatUtilisateur.Navigation.setRessource(
			EGenreRessource.Periode,
			aParam.element,
		);
		this.lancerRequete(TypeGenreBulletinCompetence.tGBC_ParMatiere);
	}
}
function _genererPdf(aService) {
	const lParametrageAffichage = {
		genreGenerationPDF: TypeHttpGenerationPDFSco.BulletinDeCompetences,
		periode: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Periode),
		avecCodeCompetences: GEtatUtilisateur.estAvecCodeCompetences(),
	};
	GenerationPDF.genererPDF({
		paramPDF: lParametrageAffichage,
		optionsPDF: OptionsPDFSco.BulletinDeCompetences,
		cloudCible: aService,
	});
}
function _surEvenementAccuseReception(aPrisConnaissance) {
	new ObjetRequeteSaisieAccuseReceptionDocument(this).lancerRequete({
		aPrisConnaissance: aPrisConnaissance,
		periode: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Periode),
	});
}
function _initialiserObjetTabs(aInstance) {
	aInstance.setParametres({ avecSwipe: false });
}
function _initSelecteur(aInstance) {
	aInstance.setParametres({
		labelWAICellule: GTraductions.getValeur("WAI.ListeSelectionPeriode"),
	});
}
class ObjetCheckBox extends Identite {
	constructor(...aParams) {
		super(...aParams);
		this.estActif = false;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbAccuseReception: {
				getValue: function () {
					return aInstance.estActif;
				},
				setValue: function (aValue) {
					aInstance.estActif = aValue;
					aInstance.callback.appel(aInstance.estActif);
				},
				getDisabled: function () {
					return aInstance.estActif;
				},
			},
		});
	}
	setDonnees(aEstActif) {
		this.estActif = aEstActif;
	}
	construireAffichage() {
		const lHtml = [];
		lHtml.push(
			'<div style="padding: 0.5rem;">',
			'<ie-checkbox ie-textright class="AlignementMilieuVertical" ie-model="cbAccuseReception">',
			GTraductions.getValeur(
				"BulletinEtReleve.JAiPrisConnaissanceDuBilanPeriodique",
			),
			"</ie-checkbox>",
			"</div>",
		);
		return lHtml.join("");
	}
}
module.exports = InterfacePageBulletinCompetences;
