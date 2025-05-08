exports._InterfacePageSaisieCahierDeTextes = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_ElementCDT_1 = require("Enumere_ElementCDT");
const InterfacePage_1 = require("InterfacePage");
const UtilitaireSaisieCDT_1 = require("UtilitaireSaisieCDT");
const UtilitaireTiny_1 = require("UtilitaireTiny");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetRequeteSaisieRechercheKiosque extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
CollectionRequetes_1.Requetes.inscrire(
	"SaisieRechercheKiosque",
	ObjetRequeteSaisieRechercheKiosque,
);
class _InterfacePageSaisieCahierDeTextes extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.idEditeurHTML = this.Nom + "_myEditeur";
		this.TAFPleinEcran = false;
		this.ContenuPleinEcran = false;
		this.instanceFenetreHTML = null;
		this.etatUtilisateur = this.applicationSco.getEtatUtilisateur();
	}
	evenementEditionCategorie(ANumeroBouton) {
		if (ANumeroBouton === 1) {
			const LNumero = this.getInstance(
				this.identFenetreEditionCategorie,
			).getNumeroCategorie();
			if (this.contenuCourant.categorie.getNumero() !== LNumero) {
				this.contenuCourant.categorie.setNumero(LNumero);
				this.setEtatSaisie(true);
				this._getContenu(this.indiceElementSelectionne).setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
			}
		}
		this.listeCategories.trier();
		this.verifierEtatContenu();
		if (this.indiceContenus) {
			const lIndice = this.indiceContenus[this.indiceElementSelectionne];
			this.getInstance(this.identContenus[lIndice]).actualiserContenu(
				this._getContenu(this.indiceElementSelectionne),
				this._estVerrouille(),
				this.avecDocumentJoint,
				this.ContenuPleinEcran,
				this._getOptionsContenuMenuMagique(),
			);
		}
	}
	evenementSurBoutonCategorie() {
		this.getInstance(this.identFenetreEditionCategorie).setDonnees(
			this.listeCategories,
			{ avecEtatSaisie: true },
		);
		this.getInstance(this.identFenetreEditionCategorie).afficher();
	}
	evenementSurBoutonHTML(aDescriptif, aCallback, aParamFilePicker) {
		this.instanceFenetreHTML =
			UtilitaireTiny_1.UtilitaireTiny.ouvrirFenetreHtml({
				instance: this,
				descriptif: aDescriptif,
				readonly: this._estVerrouille(),
				labelWAI: ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.labelWAISaisieContenu",
				),
				callback: (aParams) => {
					if (aParams.valider) {
						if (aCallback) {
							aCallback(aParams.descriptif);
						} else if (
							this.genreElementSelectionne !== null &&
							this.genreElementSelectionne !== undefined &&
							(this.genreElementSelectionne ===
							Enumere_ElementCDT_1.EGenreElementCDT.Contenu
								? this.contenuCourant.descriptif !== aParams.descriptif
								: this.tafCourant.descriptif !== aParams.descriptif)
						) {
							this._actualiserHTMLDescriptif(
								this.indiceElementSelectionne,
								aParams.descriptif,
								aParams.estModifie,
							);
						}
					}
				},
				filePickerOpener: aParamFilePicker
					? aParamFilePicker.filePickerOpener
					: undefined,
				filePickerTypes: aParamFilePicker
					? aParamFilePicker.filePickerTypes
					: undefined,
				editeurEquation: true,
				editeurEquationMaxFileSize: 4096,
				iEContextSearch: {
					providers: this.etatUtilisateur.listeRessourcesRecherche,
					getLink: function (aUidRessource, aMotCle, aCallback) {
						new ObjetRequeteSaisieRechercheKiosque({})
							.lancerRequete({
								ressourceUid: aUidRessource,
								recherche: aMotCle,
							})
							.then(
								(aReponse) => {
									if (
										aReponse.genreReponse !==
											ObjetRequeteJSON_1.EGenreReponseSaisie.succes ||
										!aReponse.JSONRapportSaisie.documentJoint
									) {
										return "";
									}
									const lUrlDocJointServeur =
										ObjetChaine_1.GChaine.creerUrlBruteLienExterne(
											aReponse.JSONRapportSaisie.documentJoint,
										);
									aCallback(lUrlDocJointServeur);
								},
								() => {
									aCallback("");
								},
							);
					},
				},
			});
	}
	actualiserTAF() {}
	verifierEtatContenu() {
		UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.verifierContenu(
			this.contenuCourant,
		);
	}
	_estVerrouille() {
		return false;
	}
	_getContenu(aIndice) {
		return null;
	}
	_getTAF() {
		return null;
	}
	_getOptionsContenuMenuMagique() {
		return UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.getOptionsContenuMenuMagique(
			{
				cdt: this.CahierDeTextes,
				listeCDTsPrecedents: this.listeCDTsPrecedents,
			},
		);
	}
	_actualiserHTMLDescriptif(aIndice, aHtml, aHtmlModifie) {
		if (
			this.genreElementSelectionne ===
			Enumere_ElementCDT_1.EGenreElementCDT.Contenu
		) {
			if (aHtmlModifie) {
				this.contenuCourant.descriptif = aHtml;
				if (
					this.contenuCourant.Numero === null ||
					this.contenuCourant.Numero === undefined
				) {
					this.contenuCourant.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				} else {
					this.contenuCourant.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
				this.setEtatSaisie(true);
			}
		} else {
			if (aHtmlModifie) {
				this.tafCourant.descriptif = aHtml;
				if (
					this.tafCourant.Numero === null ||
					this.tafCourant.Numero === undefined
				) {
					this.tafCourant.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				} else {
					this.tafCourant.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
				this.setEtatSaisie(true);
			}
		}
		if (
			this.genreElementSelectionne ===
			Enumere_ElementCDT_1.EGenreElementCDT.Contenu
		) {
			this.verifierEtatContenu();
			this.getInstance(this.identContenus[aIndice]).actualiserContenu(
				this._getContenu(aIndice),
				this._estVerrouille(),
				this.avecDocumentJoint,
				this.ContenuPleinEcran,
			);
		} else {
			this.actualiserTAF();
		}
	}
}
exports._InterfacePageSaisieCahierDeTextes = _InterfacePageSaisieCahierDeTextes;
