const { GDate } = require("ObjetDate.js");
const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { GTraductions } = require("ObjetTraduction.js");
const { tag } = require("tag.js");
const { GChaine } = require("ObjetChaine.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { UtilitaireDocument } = require("UtilitaireDocument.js");
const { MoteurInfoSondage } = require("MoteurInfoSondage.js");
const {
	DonneesListe_SelectionDiffusion,
} = require("DonneesListe_SelectionDiffusion.js");
const {
	ObjetFenetre_SelectionListeDiffusion,
} = require("ObjetFenetre_SelectionListeDiffusion.js");
const { GCache } = require("Cache.js");
const {
	ObjetRequeteSaisieActualites,
} = require("ObjetRequeteSaisieActualites.js");
const { ObjetRequeteListeDiffusion } = require("ObjetRequeteListeDiffusion.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { MoteurGestionPJPN } = require("MoteurGestionPJPN.js");
const { MoteurDestinatairesPN } = require("MoteurDestinatairesPN.js");
const { UtilitaireGenreRessource } = require("GestionnaireBlocPN.js");
const { UtilitaireGenreEspace } = require("GestionnaireBlocPN.js");
const { UtilitaireGenreReponse } = require("GestionnaireBlocPN.js");
const {
	FicheEditionInfoSond_Mobile,
} = require("FicheEditionInfoSond_Mobile.js");
const {
	ObjetFenetre_EditionActualite,
} = require("ObjetFenetre_EditionActualite.js");
const indiceRadioBtn = { tous: 0, avecDepot: 1, sansDepot: 2 };
class DonneesListe_CasierListeEleves extends ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.listeResponsables = MethodesObjet.dupliquer(aParam.listeResponsables);
		this.avecDroitSaisieInfoSondages = aParam.avecDroitSaisieInfoSondages;
		this.listeClasses = MethodesObjet.dupliquer(aParam.listeClasses);
		if (this.listeClasses && this.listeClasses.count() > 1) {
			this.listeClasses.insererElement(
				new ObjetElement({
					estTotal: true,
					Libelle: GTraductions.getValeur("Casier.toutes"),
				}),
				0,
			);
		}
		const lEstDepotParDocument = aParam.estDepotParDocument;
		this.optionsCasier = Object.assign(
			{ avecFiltreClasse: false },
			aParam.optionsCasier,
		);
		this.listeRadioBtn = [
			{
				libelle: lEstDepotParDocument
					? GTraductions.getValeur("Casier.tousLesEleves")
					: GTraductions.getValeur("Casier.tousLesDocuments"),
				indice: indiceRadioBtn.tous,
			},
			{
				libelle: lEstDepotParDocument
					? GTraductions.getValeur("Casier.uniqAvecDepot")
					: GTraductions.getValeur("Casier.uniqCeuxDeposes"),
				indice: indiceRadioBtn.avecDepot,
			},
			{
				libelle: lEstDepotParDocument
					? GTraductions.getValeur("Casier.uniqSansDepot")
					: GTraductions.getValeur("Casier.uniqCeuxNonDeposes"),
				indice: indiceRadioBtn.sansDepot,
			},
		];
		this.filtre = this.getFiltreDefaut();
		if (aParam.classeSelectionne && this.listeClasses) {
			const lIndice = this.listeClasses.getIndiceElementParFiltre(
				(aClasse) =>
					aClasse.getNumero() === aParam.classeSelectionne.getNumero(),
			);
			if (lIndice >= 0) {
				this.filtre.indiceClasse = lIndice;
			}
		}
	}
	setOptionsCasier(aParam) {
		Object.assign(this.optionsCasier, aParam);
	}
	getTitreZonePrincipale(aParams) {
		let lStr = aParams.article.getLibelle();
		const lClasse =
			aParams.article.classe && aParams.article.classe.getLibelle();
		if (lClasse) {
			lStr += ` (${aParams.article.classe.getLibelle()})`;
		}
		return lStr;
	}
	getInfosSuppZonePrincipale(aParams) {
		const H = [];
		if (
			aParams.article.documentsEleve &&
			aParams.article.documentsEleve.count() > 0
		) {
			const lDoc = aParams.article.documentsEleve.get(0);
			if (lDoc && lDoc.depositaire) {
				H.push(
					GTraductions.getValeur("Casier.deposePar") + " : " + lDoc.depositaire,
				);
			}
		}
		return H.join("");
	}
	getZoneMessage(aParams) {
		const H = [];
		if (
			aParams.article.documentsEleve &&
			aParams.article.documentsEleve.count() > 0
		) {
			const lDoc = aParams.article.documentsEleve.get(0);
			if (lDoc) {
				H.push(
					GChaine.composerUrlLienExterne({
						documentJoint: lDoc,
						class: "m-top",
					}),
				);
			}
		}
		return H.join("");
	}
	getZoneGauche(aParams) {
		let lHtml = "";
		const lAvecDocumentEleveDepose =
			aParams.article.documentsEleve &&
			aParams.article.documentsEleve.count() === 1;
		if (lAvecDocumentEleveDepose) {
			const lDocumentEleve = aParams.article.documentsEleve.get(0);
			if (lDocumentEleve && lDocumentEleve.dateDepot) {
				const lDate = GDate.formatDate(lDocumentEleve.dateDepot, "%J %MMM");
				lHtml = tag(
					"time",
					{
						class: "date-contain",
						datetime: GDate.formatDate(lDocumentEleve.dateDepot, "%MM-%JJ"),
					},
					lDate,
				);
			}
		}
		return lHtml;
	}
	getVisible(aArticle) {
		let lVisible = true;
		const lAvecDepot =
			aArticle.documentsEleve && aArticle.documentsEleve.count() > 0;
		if (this.filtre.indiceRadio === indiceRadioBtn.avecDepot) {
			lVisible = lAvecDepot;
		}
		if (this.filtre.indiceRadio === indiceRadioBtn.sansDepot) {
			lVisible = !lAvecDepot;
		}
		if (this.optionsCasier.avecFiltreClasse) {
			const lFiltre =
				this.listeClasses && this.listeClasses.get(this.filtre.indiceClasse);
			if (lFiltre && !lFiltre.estTotal) {
				lVisible =
					lVisible && aArticle.classe.getNumero() === lFiltre.getNumero();
			}
		}
		return lVisible;
	}
	reinitFiltres() {
		this.filtre = this.getFiltreDefaut();
		this.paramsListe.actualiserListe();
	}
	construireFiltres() {
		const H = [];
		const lRadios = [];
		this.listeRadioBtn.map(({ libelle: aLibelle, indice: aIndice }) =>
			lRadios.push(
				tag(
					"ie-radio",
					{
						name: "radio-filtre",
						"ie-model": tag.funcAttr("radioFiltre", [aIndice]),
					},
					aLibelle,
				),
			),
		);
		H.push(
			tag(
				"div",
				{ class: ["flex-contain", "cols", "flex-gap"] },
				lRadios.join(""),
			),
		);
		if (this.optionsCasier.avecFiltreClasse) {
			H.push(tag("div", { class: ["DAT_separateur", "m-y-l"] }, ""));
			H.push(
				tag("ie-combo", {
					"ie-model": "comboClasses",
					class: "combo-sans-fleche",
				}),
			);
		}
		return H.join("");
	}
	estFiltresParDefaut() {
		let lEstParDefaut =
			this.filtre.indiceRadio === this.getFiltreDefaut().indiceRadio;
		if (this.optionsCasier.avecFiltreClasse) {
			lEstParDefaut =
				lEstParDefaut &&
				this.filtre.indiceClasse === this.getFiltreDefaut().indiceClasse;
		}
		return lEstParDefaut;
	}
	getControleurFiltres() {
		return {
			radioFiltre: {
				getValue: (aIndice) => {
					return this.filtre.indiceRadio === aIndice;
				},
				setValue: (aIndice) => {
					this.filtre.indiceRadio = aIndice;
					this.paramsListe.actualiserListe();
				},
			},
			comboClasses: {
				init: (aCombo) => {
					aCombo.setOptionsObjetSaisie({ longueur: 200 });
					aCombo.setDonneesObjetSaisie({ liste: this.listeClasses });
				},
				event: (aParam) => {
					if (
						aParam.estSelectionManuelle &&
						aParam.element &&
						aParam.element !== this.filtre.indiceClasse
					) {
						this.filtre.indiceClasse =
							this.listeClasses.getIndiceElementParFiltre(
								(aClasse) => aClasse === aParam.element,
							);
						this.paramsListe.actualiserListe();
					}
				},
				getIndiceSelection: () => {
					return MethodesObjet.isNumeric(this.filtre.indiceClasse)
						? this.filtre.indiceClasse
						: -1;
				},
			},
		};
	}
	getFiltreDefaut() {
		const lParam = { indiceRadio: indiceRadioBtn.tous };
		if (this.optionsCasier.avecFiltreClasse) {
			lParam.indiceClasse = 0;
		}
		return lParam;
	}
	avecBoutonActionLigne(aParams) {
		const lLeleveAdeposeUnDoc =
			aParams.article.documentsEleve &&
			aParams.article.documentsEleve.count() > 0;
		const lAvecResponsableAccesible =
			(aParams.article.listeResponsables &&
				aParams.article.listeResponsables.count() > 0) ||
			(this.listeResponsables && this.listeResponsables.count() > 0);
		const lAvecBoutonActionLigne =
			lLeleveAdeposeUnDoc ||
			(this.avecDroitSaisieInfoSondages && lAvecResponsableAccesible);
		return super.avecBoutonActionLigne(aParams) && lAvecBoutonActionLigne;
	}
	initialisationObjetContextuel(aParams) {
		if (!aParams.menuContextuel) {
			return;
		}
		if (
			aParams.article.documentsEleve &&
			aParams.article.documentsEleve.count() > 0
		) {
			const lDoc = aParams.article.documentsEleve.get(0);
			aParams.menuContextuel.add(
				GTraductions.getValeur("Casier.telechargerLeDocument"),
				true,
				() => UtilitaireDocument.ouvrirUrl(lDoc),
				{ icon: "icon_download_alt" },
			);
		} else if (
			(aParams.article.listeResponsables &&
				aParams.article.listeResponsables.count() > 0) ||
			(this.listeResponsables && this.listeResponsables.count() > 0)
		) {
			aParams.menuContextuel.add(
				GTraductions.getValeur("Casier.diffuserUneInfo"),
				true,
				() => _ouvrirFenetreInfo.call(this, aParams),
				{ icon: "icon_diffuser_information" },
			);
		}
		aParams.menuContextuel.setDonnees();
	}
}
function _ouvrirFenetreInfo(aParams) {
	let lFenetreInfoSond;
	if (IE.estMobile) {
		lFenetreInfoSond = FicheEditionInfoSond_Mobile;
	} else {
		lFenetreInfoSond = ObjetFenetre_EditionActualite;
	}
	const lListeResponsables =
		(aParams.article && aParams.article.listeResponsables) ||
		this.listeResponsables;
	const lFenetre = ObjetFenetre.creerInstanceFenetre(lFenetreInfoSond, {
		pere: this,
		initialiser: (aInstance) => {
			if (IE.estMobile) {
				_initFicheEditionInfoSond.call(this, aInstance);
			} else {
				aInstance.avecEtatSaisie = false;
				aInstance.setOptionsFenetre({
					titre: GTraductions.getValeur("actualites.creerInfo"),
					largeur: 750,
					hauteur: 700,
					listeBoutons: [
						GTraductions.getValeur("Annuler"),
						GTraductions.getValeur("Valider"),
					],
				});
			}
		},
	});
	lFenetre.setDonnees({
		donnee: null,
		creation: true,
		estInfo: true,
		genresPublic: [lFenetre.utilitaires.genreRessource.getRessourceParent()],
		listePublic: MethodesObjet.dupliquer(lListeResponsables),
		maxSizePJ: GApplication.droits.get(
			TypeDroits.tailleMaxDocJointEtablissement,
		),
	});
}
function _initFicheEditionInfoSond(aInstance) {
	const utilitaires = {
		genreRessource: new UtilitaireGenreRessource(),
		genreEspace: new UtilitaireGenreEspace(),
		genreReponse: new UtilitaireGenreReponse(),
		moteurDestinataires: new MoteurDestinatairesPN(),
		moteurGestionPJ: new MoteurGestionPJPN(),
	};
	aInstance.setUtilitaires(utilitaires);
	const moteurCP = new MoteurInfoSondage(utilitaires);
	aInstance.setOptions({
		avecCBElevesRattaches: GParametres.avecElevesRattaches,
		avecGestionEleves: GApplication.droits.get(
			TypeDroits.fonctionnalites.gestionEleves,
		),
		avecGestionPersonnels: GApplication.droits.get(
			TypeDroits.fonctionnalites.gestionPersonnels,
		),
		avecGestionStages: GApplication.droits.get(
			TypeDroits.fonctionnalites.gestionStages,
		),
		avecGestionIPR: GApplication.droits.get(
			TypeDroits.fonctionnalites.gestionIPR,
		),
		avecPublicationPageEtablissement: GApplication.droits.get(
			TypeDroits.communication.avecPublicationPageEtablissement,
		),
	});
	aInstance.setOptionsFenetre({ avecFooterFlottant: false });
	aInstance.envoyerRequete = function (aParam) {
		moteurCP.formatterDonneesAvantSaisie({
			listeInfoSond: aParam.paramRequete.listeActualite,
		});
		return new ObjetRequeteSaisieActualites(this)
			.addUpload({ listeFichiers: aParam.listePJCree })
			.lancerRequete(aParam.paramRequete)
			.then(() => {
				aParam.clbckSurReussite.call(aInstance, 1);
			});
	}.bind(this);
	aInstance.avecListeDiffusion = true;
	aInstance.surBtnListeDiffusion = () => {
		let lListeDiffusions = null;
		if (GCache && GCache.general.existeDonnee("listeDiffusion")) {
			lListeDiffusions = GCache.general.getDonnee("listeDiffusion");
		}
		return Promise.resolve()
			.then(() => {
				if (!lListeDiffusions) {
					return new ObjetRequeteListeDiffusion(this)
						.lancerRequete()
						.then((aJSON) => {
							if (aJSON && aJSON.liste) {
								lListeDiffusions = aJSON.liste;
								if (GCache) {
									GCache.general.setDonnee("listeDiffusion", lListeDiffusions);
								}
							}
						});
				}
			})
			.then(() => {
				return new Promise((aResolve) => {
					if (!lListeDiffusions) {
						return null;
					}
					lListeDiffusions.parcourir((aElement) => {
						aElement.cmsActif = false;
					});
					ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_SelectionListeDiffusion,
						{
							pere: this,
							evenement: (aGenreBouton) => {
								let lListeDiffusionsSelection = new ObjetListeElements();
								if (aGenreBouton === 1) {
									lListeDiffusionsSelection = lListeDiffusions.getListeElements(
										(aElement) => !!aElement.cmsActif,
									);
								}
								aResolve(lListeDiffusionsSelection);
							},
						},
					).setDonnees(
						new DonneesListe_SelectionDiffusion(lListeDiffusions),
						false,
					);
				});
			});
	};
	aInstance.setOptionsFenetre({
		modale: true,
		listeBoutons: [
			GTraductions.getValeur("Annuler"),
			GTraductions.getValeur("Valider"),
		],
	});
}
module.exports = { DonneesListe_CasierListeEleves };
