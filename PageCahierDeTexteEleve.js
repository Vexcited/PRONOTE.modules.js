exports.PageCahierDeTexteEleve = void 0;
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDate_1 = require("ObjetDate");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const ObjetRequeteSaisieTAFFaitEleve_1 = require("ObjetRequeteSaisieTAFFaitEleve");
const ObjetUtilitaireCahierDeTexte_1 = require("ObjetUtilitaireCahierDeTexte");
const UtilitaireTAFEleves_1 = require("UtilitaireTAFEleves");
const UtilitaireContenuDeCours_1 = require("UtilitaireContenuDeCours");
const GestionnaireBlocTAF_1 = require("GestionnaireBlocTAF");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_TypeRessourcesPedagogiques_1 = require("Enumere_TypeRessourcesPedagogiques");
const AccessApp_1 = require("AccessApp");
class PageCahierDeTexteEleve extends ObjetIdentite_1.Identite {
	constructor() {
		super(...arguments);
		this.cycleCourant = null;
		this.utilitaireCDT =
			new ObjetUtilitaireCahierDeTexte_1.ObjetUtilitaireCahierDeTexte(
				this.Nom + ".utilitaireCDT",
				this,
				this.surUtilitaireCDT,
			);
		this.utilitaireTAFEleves = new UtilitaireTAFEleves_1.UtilitaireTAFEleves();
		this.utilitaireContenuDeCours =
			new UtilitaireContenuDeCours_1.UtilitaireContenuDeCours();
		this.idTaf = this.Nom + "_Taf_";
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			appelQCM: {
				event: function (aNumero) {
					aInstance.appelQCM(aNumero);
				},
			},
			appelQCMRessource: {
				event: function (aNumero) {
					aInstance.appelQCMRessource(aNumero);
				},
			},
			evenementTafFait: {
				getValue: function (aNumeroTaf) {
					const lElement =
						aInstance.ListeTravailAFaire.getElementParNumero(aNumeroTaf);
					return lElement.TAFFait;
				},
				setValue: function (aNumero) {
					aInstance.evenementTafFait(aNumero);
				},
			},
			appelCours: {
				event: function (aNumero) {
					aInstance.appelCours(aNumero);
				},
			},
			appelTAF: {
				event: function (aNumero) {
					aInstance.appelTAF(aNumero);
				},
			},
			appelDetailTAF: {
				event: function (aNumero) {
					aInstance.appelDetailTAF(aNumero);
				},
			},
			nodeDeploiement: function () {
				$(this.node).eventValidation(() => {
					$(this.node).attr("aria-expanded", (aIndex, aAttr) => {
						return aAttr === "true" ? "false" : "true";
					});
					const lIcone = $(this.node).children().first().children().first();
					lIcone.toggleClass("icon_chevron_right");
					lIcone.toggleClass("icon_chevron_down");
					$(this.node).siblings().first().toggle(200);
					aInstance.setInfoRessourceDeploye($(this.node));
				});
			},
		});
	}
	setDonnees(aParams) {
		this.genreOnglet = GEtatUtilisateur.getGenreOnglet();
		this.avecFiltrage = aParams.avecFiltrage;
		if (this.genreOnglet === Enumere_Onglet_1.EGenreOnglet.CDT_TAF) {
			this.ListeTravailAFaire = aParams.liste;
			this.actualiserTravailAFaire(this.ListeTravailAFaire);
		} else {
			this.ListeCahierDeTextes = aParams.liste;
			this.actualiserContenuDeCours();
		}
		this.afficher(null);
	}
	actualiserContenuDeCours() {
		if (this.ListeCahierDeTextes) {
			this.ListeCahierDeTextes.setTri([
				ObjetTri_1.ObjetTri.init(
					"Date",
					Enumere_TriElement_1.EGenreTriElement.Decroissant,
				),
			]).trier();
		}
	}
	actualiserTravailAFaire(aListeTravailAFaire) {
		if (aListeTravailAFaire) {
			aListeTravailAFaire
				.setTri([
					ObjetTri_1.ObjetTri.init("PourLe"),
					ObjetTri_1.ObjetTri.init("Matiere.Libelle"),
					ObjetTri_1.ObjetTri.init("DonneLe"),
					ObjetTri_1.ObjetTri.init("Genre"),
				])
				.trier();
		}
	}
	construireAffichage() {
		return this.genreOnglet === Enumere_Onglet_1.EGenreOnglet.CDT_TAF
			? this.composePageTravailAFaire(this.ListeTravailAFaire)
			: this.composePageContenu(this.ListeCahierDeTextes);
	}
	composePageContenu(aListeCahierDeTextes) {
		if (!aListeCahierDeTextes) {
			return "";
		}
		const lHtml = [];
		lHtml.push('<div class="AvecSelectionTexte">');
		if (
			!!aListeCahierDeTextes.count() &&
			!!aListeCahierDeTextes
				.getListeElements((aEle) => {
					return (
						(aEle.listeContenus && aEle.listeContenus.count() > 0) ||
						(aEle.listeElementsProgrammeCDT &&
							aEle.listeElementsProgrammeCDT.count() > 0)
					);
				})
				.count()
		) {
			lHtml.push(
				this.utilitaireContenuDeCours.composePageContenu(
					aListeCahierDeTextes,
					this.avecFiltrage,
				),
			);
		} else {
			lHtml.push(
				'<div class="message-vide card card-nodata"><div class="card-content">' +
					this.composeMessage(
						ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.AucunContenu",
						),
					) +
					'</div><div class="Image_No_Data" aria-hidden="true"></div></div>',
			);
		}
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composePageTravailAFaire(aListeTravailAFaire) {
		if (!aListeTravailAFaire) {
			return "";
		}
		const lHtml = [];
		lHtml.push('<div class="AvecSelectionTexte">');
		(0, AccessApp_1.getApp)()
			.getEtatUtilisateur()
			.setNavigationDate(ObjetDate_1.GDate.getDateCourante());
		if (!!aListeTravailAFaire.count()) {
			lHtml.push(
				this.utilitaireTAFEleves.composePageTravailAFaire(
					aListeTravailAFaire,
					this.utilitaireCDT,
					this.controleur,
					this.avecFiltrage,
				),
			);
		} else {
		}
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeCours(aDonnees, aEstChronologique) {
		return this.utilitaireContenuDeCours.composeFicheCours(
			aDonnees,
			aEstChronologique,
		);
	}
	composeTAF(aDonnees, aControleur, aEstChronologique) {
		return this.utilitaireTAFEleves.composeFicheTAF(
			aDonnees.ListeTravailAFaire
				? aDonnees.ListeTravailAFaire
				: new ObjetListeElements_1.ObjetListeElements().add(aDonnees),
			this.utilitaireCDT,
			aControleur,
			aEstChronologique,
		);
	}
	composeTitreRessourcesPeda() {
		return this.utilitaireContenuDeCours.composeTitreRessourcesPeda();
	}
	composeRessourcesPeda(aListeRessPeda, aType, aInfoRessourceDeploye) {
		const lHtml = [];
		switch (aType) {
			case Enumere_TypeRessourcesPedagogiques_1.EGenreTypeRessourcesPedagogiques
				.SujetOuCorrige:
				lHtml.push(
					this.utilitaireContenuDeCours.composeRPSujetOuCorrige(
						aListeRessPeda,
						aInfoRessourceDeploye.sujetsCorriges,
					),
				);
				break;
			case Enumere_TypeRessourcesPedagogiques_1.EGenreTypeRessourcesPedagogiques
				.TravailRendu:
				lHtml.push(
					this.utilitaireContenuDeCours.composeRPTravailRendu(
						aListeRessPeda,
						aInfoRessourceDeploye.travauxRendu,
					),
				);
				break;
			case Enumere_TypeRessourcesPedagogiques_1.EGenreTypeRessourcesPedagogiques
				.QCM:
				lHtml.push(
					this.utilitaireContenuDeCours.composeRPQCM(
						aListeRessPeda,
						aInfoRessourceDeploye.QCM,
					),
				);
				break;
			case Enumere_TypeRessourcesPedagogiques_1.EGenreTypeRessourcesPedagogiques
				.RessourcesGranulaires:
				lHtml.push(
					this.utilitaireContenuDeCours.composeRPRessourcesGranulaires(
						aListeRessPeda,
						aInfoRessourceDeploye.ressourcesGranulaires,
					),
				);
				break;
			case Enumere_TypeRessourcesPedagogiques_1.EGenreTypeRessourcesPedagogiques
				.ForumPedagogique:
				lHtml.push(
					this.utilitaireContenuDeCours.composeRPForumPedagogique(
						aListeRessPeda,
						aInfoRessourceDeploye.forumPedagogique,
					),
				);
				break;
			case Enumere_TypeRessourcesPedagogiques_1.EGenreTypeRessourcesPedagogiques
				.Autre:
				lHtml.push(
					this.utilitaireContenuDeCours.composeRPAutre(
						aListeRessPeda,
						aInfoRessourceDeploye.documentsAutres,
					),
				);
				break;
			default:
				break;
		}
		return lHtml.join("");
	}
	composeManuelsNumeriques(
		aListeManuelsNumeriques,
		aFiltreMatiere,
		aInfoRessourceDeploye,
	) {
		const lHtml = [];
		lHtml.push(
			this.utilitaireContenuDeCours.composeMN(
				aListeManuelsNumeriques,
				aFiltreMatiere,
				aInfoRessourceDeploye.ressourcesNumeriques,
			),
		);
		return lHtml.join("");
	}
	setInfoRessourceDeploye(aNode) {
		this.callback.appel({ nodeDeploye: aNode });
	}
	appelQCM(aNumeroQCM) {
		this.callback.appel({ executionQCM: aNumeroQCM });
	}
	appelQCMRessource(aNumeroQCM) {
		this.callback.appel({ executionQCM: aNumeroQCM, estRessource: true });
	}
	appelCours(aNumero) {
		const lTAF = this.ListeTravailAFaire.getElementParNumero(aNumero);
		this.callback.appel({
			GenreBtnAction: GestionnaireBlocTAF_1.EGenreBtnActionBlocTAF.voirContenu,
			taf: lTAF,
		});
	}
	appelTAF(aNumero) {
		const lCours = this.ListeCahierDeTextes.getElementParNumero(aNumero);
		this.callback.appel({ cours: lCours });
	}
	appelDetailTAF(aNumero) {
		const lTAF = this.ListeTravailAFaire.getElementParNumero(aNumero);
		this.callback.appel({
			GenreBtnAction: GestionnaireBlocTAF_1.EGenreBtnActionBlocTAF.detailTAF,
			taf: lTAF,
		});
	}
	surUtilitaireCDT() {
		this.callback.appel();
	}
	surEvenementTafFait() {
		this.callback.appel();
	}
	evenementTafFait(aNumeroTaf) {
		const lElement = this.ListeTravailAFaire.getElementParNumero(aNumeroTaf);
		if (!!lElement.TAFFait) {
			lElement.TAFFait = false;
		} else {
			lElement.TAFFait = true;
		}
		lElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		new ObjetRequeteSaisieTAFFaitEleve_1.ObjetRequeteSaisieTAFFaitEleve(
			this,
			this.surEvenementTafFait,
		).lancerRequete({ listeTAF: this.ListeTravailAFaire });
	}
}
exports.PageCahierDeTexteEleve = PageCahierDeTexteEleve;
