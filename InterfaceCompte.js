exports.ObjetInterfaceCompte = void 0;
const ObjetPageCompte_1 = require("ObjetPageCompte");
const MultiObjetPageCompte_Parent = require("ObjetPageCompte_Parent");
const ObjetRequetePageInfosPerso_1 = require("ObjetRequetePageInfosPerso");
const ObjetRequeteSaisieInformations_1 = require("ObjetRequeteSaisieInformations");
const Enumere_Espace_1 = require("Enumere_Espace");
const InterfacePage_1 = require("InterfacePage");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetListe_1 = require("ObjetListe");
const DonneesListe_FiltreCompte_1 = require("DonneesListe_FiltreCompte");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const UtilitairePageDonneesPersonnelles_1 = require("UtilitairePageDonneesPersonnelles");
const ObjetWAI_1 = require("ObjetWAI");
const ObjetTraduction_1 = require("ObjetTraduction");
const MultipleObjetFenetre_InstallPronote = require("ObjetFenetre_InstallPronote");
const ObjetFicheAppliMobile_1 = require("ObjetFicheAppliMobile");
const ObjetFenetre_1 = require("ObjetFenetre");
const GUID_1 = require("GUID");
const AccessApp_1 = require("AccessApp");
class ObjetInterfaceCompte extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.appSco = (0, AccessApp_1.getApp)();
		this.etatUtilSco = this.appSco.getEtatUtilisateur();
		this.parametresSco = this.appSco.getObjetParametres();
		this.setOptionsEcrans({ nbNiveaux: 2, avecBascule: IE.estMobile });
		this.contexte = {
			niveauCourant: 0,
			ecran: [GenreEcran.principal, GenreEcran.detail],
			selection: [],
			guidRef: GUID_1.GUID.getId(),
		};
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListe,
			this._initListe,
		);
		this.identCompte = this.add(
			this.etatUtilSco.GenreEspace === Enumere_Espace_1.EGenreEspace.Parent ||
				this.etatUtilSco.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.PrimParent
				? MultiObjetPageCompte_Parent.ObjetPageCompte_Parent
				: ObjetPageCompte_1.ObjetPageCompte,
			function () {
				this._actualiserPage();
			},
		);
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnAppli: {
				event: function () {
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFicheAppliMobile_1.ObjetFicheAppliMobile,
						{
							pere: aInstance,
							initialiser: function (aInstance) {
								aInstance.setOptionsFenetre({ positionSurSouris: false });
							},
						},
					).afficher(aInstance.parametresSco.URLMobile);
				},
			},
			btnClient: {
				event: function () {
					if (MultipleObjetFenetre_InstallPronote) {
						ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							MultipleObjetFenetre_InstallPronote.ObjetFenetre_InstallPronote,
							{
								pere: aInstance,
								initialiser: function (aInstance) {
									aInstance.setOptionsFenetre({
										titre: ObjetTraduction_1.GTraductions.getValeur(
											"InstallPronote.titre",
										),
										largeur: 400,
										hauteur: 120,
										listeBoutons: [
											ObjetTraduction_1.GTraductions.getValeur(
												"principal.fermer",
											),
										],
									});
									aInstance.setParametres(
										this.etatUtilSco.urlInstallClient,
										this.etatUtilSco.urlParamClient,
										this.etatUtilSco.designationClient,
									);
								},
							},
						).afficher();
					}
				},
			},
		});
	}
	construireStructureAffichageAutre() {
		const H = [];
		let lHeightBtn = this.parametresSco.avecAccesMobile
			? this.etatUtilSco.urlInstallClient && MultipleObjetFenetre_InstallPronote
				? "48px"
				: "24px"
			: 0;
		H.push(
			`<div class="ObjetCompte">\n              <div id="${this.getIdDeNiveau({ niveauEcran: 0 })}" class="menu-contain">\n\n                <div class="liste-contain" id="${this.getInstance(this.identListe).getNom()}" ${lHeightBtn !== 0 ? `style="max-height: calc(100% - calc(${lHeightBtn} + 40px));"` : ""}></div>\n              </div>\n              <div id="${this.getIdDeNiveau({ niveauEcran: 1 })}" class="details-contain" ${IE.estMobile ? `style="display: none;"` : ""}>\n                <div style="display: none;" id="${this.getInstance(this.identCompte).getNom()}" class="compte-contain"></div>\n              </div>\n              <div class="btns-contain">\n                ${this._construireBoutons()}\n              </div>\n            </div>`,
		);
		return H.join("");
	}
	afficherPage() {
		this._actualiserPage();
	}
	recupererDonnees() {
		this._requete().then(() => {
			const lListe = this.getInstance(this.identCompte).getListeFiltresAff();
			let lIndiceElementASelectionner = -1;
			const lGenreElementASelectionner =
				this.etatUtilSco.getGenreAffichageCompteSelectionne();
			if (!!lGenreElementASelectionner) {
				lIndiceElementASelectionner = lListe.getIndiceElementParFiltre((D) => {
					return D.getGenre() === lGenreElementASelectionner;
				});
			}
			if (lIndiceElementASelectionner === -1) {
				lIndiceElementASelectionner = IE.estMobile ? 0 : 1;
			}
			this.getInstance(this.identListe).setDonnees(
				new DonneesListe_FiltreCompte_1.DonneesListe_FiltreCompte(
					lListe,
				).setOptions({ flatDesignMinimal: true }),
				lIndiceElementASelectionner,
			);
		});
	}
	valider() {
		const lStructure = {};
		if (
			this.getInstance(this.identCompte).getStructurePourValidation(lStructure)
		) {
			this.setEtatSaisie(false);
			new ObjetRequeteSaisieInformations_1.ObjetRequeteSaisieInformations(
				this,
				this.actionSurValidation,
			)
				.addUpload({ listeFichiers: lStructure.signature.listeFichiers })
				.lancerRequete(lStructure);
		}
	}
	construireEcran(aEcran) {
		switch (aEcran.genreEcran) {
			case GenreEcran.principal:
				if (this.optionsEcrans.avecBascule) {
					this.setHtmlStructureAffichageBandeau("");
				}
				break;
			case GenreEcran.detail:
				this.setHtmlStructureAffichageBandeau(this.construireBandeauEcran());
				this._actualiserAffichageDetails();
				break;
			default:
		}
	}
	construireBandeauEcran() {
		const lHtml = [];
		return super.construireBandeauEcran(lHtml.join(""));
	}
	_actualiserAffichageDetails() {
		const lSelection = this.getInstance(this.identListe).getElementSelection();
		this.getInstance(this.identCompte).afficher(
			lSelection ? lSelection.getGenre() : null,
		);
	}
	_initListe(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			hauteurAdapteContenu: true,
			hauteurMaxAdapteContenu: 800,
			ariaLabel: this.etatUtilSco.getLibelleLongOnglet(),
		});
	}
	_evenementListe(aParametres) {
		if (!!aParametres.article && aParametres.article.nonSelectionnable) {
			return;
		}
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe
				.ModificationSelection: {
				const lArticle = this.getInstance(
					this.identListe,
				).getElementSelection();
				if (lArticle) {
					this.etatUtilSco.setGenreAffichageCompteSelectionne(
						lArticle.getGenre(),
					);
				}
				if (this.optionsEcrans.avecBascule) {
					const lEcranSrc = {
						niveauEcran: 0,
						genreEcran: this.getCtxEcran({ niveauEcran: 0 }),
					};
					const lEcranDest = {
						niveauEcran: 1,
						genreEcran: this.getCtxEcran({ niveauEcran: 1 }),
					};
					this.basculerEcran(lEcranSrc, lEcranDest);
				}
				this._actualiserAffichageDetails();
				break;
			}
		}
	}
	_callbackIdentifiant() {
		UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.fenetreModificationIdentifiant(
			this,
			this._actualiserPage.bind(this),
		);
	}
	_callbackMDP() {
		UtilitairePageDonneesPersonnelles_1.UtilitairePageDonneesPersonnelles.fenetreModificationMDP(
			this,
		);
	}
	async _requete() {
		const lReponse =
			await new ObjetRequetePageInfosPerso_1.ObjetRequetePageInfosPerso(
				this,
			).lancerRequete();
		this.getInstance(this.identCompte).setDonneesPageCompte({
			donnees: lReponse,
			callbackIdentifiant: this._callbackIdentifiant.bind(this),
			callbackMDP: this._callbackMDP.bind(this),
		});
	}
	async _actualiserPage() {
		return this._requete().then(() => {
			this._actualiserAffichageDetails();
		});
	}
	_construireBoutons() {
		const H = [];
		if (
			this.parametresSco.avecAccesMobile &&
			!this.parametresSco.estAfficheDansENT
		) {
			H.push(`<ie-bouton ie-icon="icon_qr_code" class="small-bt themeBoutonNeutre" ie-model="btnAppli" title="${ObjetTraduction_1.GTraductions.getValeur("Commande.QRCode.Actif")}"\n              ${ObjetWAI_1.GObjetWAI.composeAttribut({ genre: ObjetWAI_1.EGenreAttribut.label, valeur: ObjetTraduction_1.GTraductions.getValeur("Commande.QRCode.Actif") })}>\n              ${ObjetTraduction_1.GTraductions.getValeur("Commande.QRCode.Actif")}
              </ie-bouton>`);
		}
		if (
			this.etatUtilSco.urlInstallClient &&
			MultipleObjetFenetre_InstallPronote
		) {
			H.push(`<ie-bouton ie-icon="${this.appSco.estEDT ? `icon_connexion_edt` : `icon_connexion_pronote`}" class="small-bt themeBoutonNeutre" ie-model="btnClient" title="${ObjetTraduction_1.GTraductions.getValeur("Commande.TelechargerClient.Actif")}"\n              ${ObjetWAI_1.GObjetWAI.composeAttribut({ genre: ObjetWAI_1.EGenreAttribut.label, valeur: ObjetTraduction_1.GTraductions.getValeur("Commande.TelechargerClient.Actif") })}>\n              ${ObjetTraduction_1.GTraductions.getValeur("Commande.TelechargerClient.Actif")}
              </ie-bouton>`);
		}
		return H.join("");
	}
}
exports.ObjetInterfaceCompte = ObjetInterfaceCompte;
var GenreEcran;
(function (GenreEcran) {
	GenreEcran["principal"] = "principal";
	GenreEcran["detail"] = "detail";
})(GenreEcran || (GenreEcran = {}));
