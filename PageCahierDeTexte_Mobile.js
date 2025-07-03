exports.PageCahierDeTexte_Mobile = void 0;
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDate_1 = require("ObjetDate");
const ObjetIdentite_Mobile_1 = require("ObjetIdentite_Mobile");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const ObjetRequeteSaisieTAFFaitEleve_1 = require("ObjetRequeteSaisieTAFFaitEleve");
const ObjetUtilitaireCahierDeTexte_1 = require("ObjetUtilitaireCahierDeTexte");
const EGenreDirectionSlide_1 = require("EGenreDirectionSlide");
const UtilitaireTAFEleves_1 = require("UtilitaireTAFEleves");
const UtilitaireContenuDeCours_1 = require("UtilitaireContenuDeCours");
const GestionnaireBlocTAF_1 = require("GestionnaireBlocTAF");
const Enumere_RessourcePedagogique_1 = require("Enumere_RessourcePedagogique");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_TypeRessourcesPedagogiques_1 = require("Enumere_TypeRessourcesPedagogiques");
const MethodesObjet_1 = require("MethodesObjet");
const AccessApp_1 = require("AccessApp");
class PageCahierDeTexte_Mobile extends ObjetIdentite_Mobile_1.ObjetIdentite_Mobile {
	constructor() {
		super(...arguments);
		this.appScoMobile = (0, AccessApp_1.getApp)();
		this.etatUtilScoMobile = this.appScoMobile.getEtatUtilisateur();
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
		});
	}
	setDonnees(
		aGenreOnglet,
		aListe,
		aCycleCourant,
		aAvecFiltrage,
		aFiltreMatiere,
		aListeTAFComplet,
		aEstListeRessource,
	) {
		this.genreOnglet = aGenreOnglet;
		this.ListeTAFComplet = aListeTAFComplet;
		const lSensSwipe =
			!this.cycleCourant || aCycleCourant === this.cycleCourant
				? EGenreDirectionSlide_1.EGenreDirectionSlide.Aucune
				: aCycleCourant < this.cycleCourant
					? EGenreDirectionSlide_1.EGenreDirectionSlide.Droite
					: EGenreDirectionSlide_1.EGenreDirectionSlide.Gauche;
		this.cycleCourant = aCycleCourant;
		this.avecFiltrage = aAvecFiltrage;
		this.filtreMatiere = aFiltreMatiere;
		this.estListeRessource = aEstListeRessource;
		if (this.genreOnglet === Enumere_Onglet_1.EGenreOnglet.CDT_TAF) {
			this.ListeTravailAFaire = aListe;
			this.actualiserTravailAFaire(this.ListeTravailAFaire);
		} else {
			this.ListeCahierDeTextes = aListe;
			if (!this.estListeRessource) {
				this.actualiserContenuDeCours();
			}
		}
		this.afficher(null, lSensSwipe);
	}
	actualiserContenuDeCours() {
		if (this.ListeCahierDeTextes) {
			if (!this.estListeRessource) {
				this.ListeCahierDeTextes.setTri([
					ObjetTri_1.ObjetTri.init("Date"),
				]).trier();
			} else {
				this.ListeCahierDeTextes.setTri([
					ObjetTri_1.ObjetTri.init("matiere.Libelle"),
				]).trier();
			}
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
			: this.estListeRessource
				? this.composePageRessource(this.ListeCahierDeTextes)
				: this.composePageContenu(this.ListeCahierDeTextes);
	}
	composePageContenu(aListeCahierDeTextes) {
		if (!aListeCahierDeTextes) {
			return "";
		}
		const lHtml = [];
		lHtml.push('<div class="conteneur-liste-CDT">');
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
				this.composeAucuneDonnee(
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.AucunContenu",
					),
				),
			);
		}
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composePageRessource(aListeCahierDeTextes) {
		if (!aListeCahierDeTextes) {
			return "";
		}
		const lHtml = [];
		lHtml.push('<div class="conteneur-liste-CDT">');
		if (!!aListeCahierDeTextes.count()) {
			lHtml.push('<div class="conteneur-ressource-mobile">');
			const lRessourcesPedagogiquesParMatiere =
				_regrouperRessourcesPedagogiquesParMatiere.call(
					this,
					aListeCahierDeTextes,
				);
			for (const lMatiere in lRessourcesPedagogiquesParMatiere) {
				if (!this.avecFiltrage) {
					let lCouleur;
					for (let i = 0; i < aListeCahierDeTextes.count(); i++) {
						const lElement = aListeCahierDeTextes.get(i);
						if (lElement.matiere.getLibelle() === lMatiere) {
							lCouleur = this.etatUtilScoMobile.pourPrimaire()
								? lElement.matiere.couleur
								: lElement.matiere.CouleurFond;
							break;
						}
					}
					lHtml.push('<div class="conteneur-ressource-journee">');
					lHtml.push('<div class="entete-element">');
					lHtml.push(
						'<div class="flex-contain">',
						'<div style="background-color:',
						lCouleur,
						';margin-right:0.8rem;padding:0.2rem;border-radius:0.4rem;"></div>',
					);
					lHtml.push("<div>");
					lHtml.push('<div class="titre-matiere">', lMatiere, "</div>");
					lHtml.push("</div>");
					lHtml.push("</div>");
					lHtml.push("</div>");
				}
				const lRessourcesPedagogiquesParType =
					_regrouperRessourcesPedagogiquesParType.call(
						this,
						lRessourcesPedagogiquesParMatiere[lMatiere],
						this.filtreMatiere,
					);
				for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
					Enumere_TypeRessourcesPedagogiques_1.EGenreTypeRessourcesPedagogiques,
				)) {
					const lType =
						Enumere_TypeRessourcesPedagogiques_1
							.EGenreTypeRessourcesPedagogiques[lKey];
					lHtml.push(
						this.composeRessourcesPeda(
							lRessourcesPedagogiquesParType[lType],
							lType,
						),
					);
				}
				lHtml.push("</div>");
			}
			lHtml.push("</div>");
		} else {
			lHtml.push(
				this.composeAucuneDonnee(
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.AucuneRessource",
					),
				),
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
		lHtml.push('<div class="conteneur-liste-CDT">');
		this.etatUtilScoMobile.setNavigationDate(
			ObjetDate_1.GDate.getDateCourante(),
		);
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
			lHtml.push(
				this.composeAucuneDonnee(
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.AucunTAFSelonCriteres",
					),
				),
			);
		}
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeRessourcesPeda(aListeRessPeda, aType) {
		const lHtml = [];
		switch (aType) {
			case Enumere_TypeRessourcesPedagogiques_1.EGenreTypeRessourcesPedagogiques
				.SujetOuCorrige:
				lHtml.push(
					this.utilitaireContenuDeCours.composeRPSujetOuCorrige(
						aListeRessPeda,
						true,
					),
				);
				break;
			case Enumere_TypeRessourcesPedagogiques_1.EGenreTypeRessourcesPedagogiques
				.TravailRendu:
				lHtml.push(
					this.utilitaireContenuDeCours.composeRPTravailRendu(
						aListeRessPeda,
						true,
					),
				);
				break;
			case Enumere_TypeRessourcesPedagogiques_1.EGenreTypeRessourcesPedagogiques
				.QCM:
				lHtml.push(
					this.utilitaireContenuDeCours.composeRPQCM(aListeRessPeda, true),
				);
				break;
			case Enumere_TypeRessourcesPedagogiques_1.EGenreTypeRessourcesPedagogiques
				.RessourcesGranulaires:
				lHtml.push(
					this.utilitaireContenuDeCours.composeRPRessourcesGranulaires(
						aListeRessPeda,
						true,
					),
				);
				break;
			case Enumere_TypeRessourcesPedagogiques_1.EGenreTypeRessourcesPedagogiques
				.ForumPedagogique:
				lHtml.push(
					this.utilitaireContenuDeCours.composeRPForumPedagogique(
						aListeRessPeda,
						true,
					),
				);
				break;
			case Enumere_TypeRessourcesPedagogiques_1.EGenreTypeRessourcesPedagogiques
				.Autre:
				lHtml.push(
					this.utilitaireContenuDeCours.composeRPAutre(aListeRessPeda, true),
				);
				break;
			default:
				break;
		}
		return lHtml.join("");
	}
	composeCours(aDonnees) {
		return this.utilitaireContenuDeCours.composeFicheCours(aDonnees);
	}
	composeTAF(aDonnees, aControleur) {
		return this.utilitaireTAFEleves.composeFicheTAF(
			aDonnees.ListeTravailAFaire,
			this.utilitaireCDT,
			aControleur,
		);
	}
	appelQCM(aNumeroQCM) {
		this.callback.appel({
			GenreBtnAction: GestionnaireBlocTAF_1.EGenreBtnActionBlocTAF.executionQCM,
			executionQCM: aNumeroQCM,
		});
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
	surUtilitaireCDT() {
		this.callback.appel();
	}
	surEvenementTafFait(aTaf) {
		this.callback.appel({ date: aTaf.PourLe });
	}
	evenementTafFait(aNumeroTaf) {
		const lElement = this.ListeTravailAFaire.getElementParNumero(aNumeroTaf);
		if (!!lElement.TAFFait) {
			lElement.TAFFait = false;
		} else {
			lElement.TAFFait = true;
		}
		lElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		new ObjetRequeteSaisieTAFFaitEleve_1.ObjetRequeteSaisieTAFFaitEleve(this)
			.lancerRequete({ listeTAF: this.ListeTravailAFaire })
			.then(() => {
				this.surEvenementTafFait(lElement);
			});
	}
}
exports.PageCahierDeTexte_Mobile = PageCahierDeTexte_Mobile;
function _regrouperRessourcesPedagogiquesParType(
	aListeRessources,
	aMatiereFiltrante,
) {
	const lRessourcesPedagogiquesParType = {};
	if (!!aListeRessources) {
		aListeRessources.parcourir((D) => {
			if (
				!D.matiere ||
				!aMatiereFiltrante ||
				D.matiere.getNumero() === aMatiereFiltrante.getNumero()
			) {
				let lTypeListe;
				if (
					D.getGenre() ===
						Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.sujet ||
					D.getGenre() ===
						Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.corrige
				) {
					lTypeListe =
						Enumere_TypeRessourcesPedagogiques_1
							.EGenreTypeRessourcesPedagogiques.SujetOuCorrige;
				} else if (
					D.getGenre() ===
					Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.travailRendu
				) {
					lTypeListe =
						Enumere_TypeRessourcesPedagogiques_1
							.EGenreTypeRessourcesPedagogiques.TravailRendu;
				} else if (
					D.getGenre() ===
					Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.QCM
				) {
					lTypeListe =
						Enumere_TypeRessourcesPedagogiques_1
							.EGenreTypeRessourcesPedagogiques.QCM;
				} else if (D.estForumPeda) {
					lTypeListe =
						Enumere_TypeRessourcesPedagogiques_1
							.EGenreTypeRessourcesPedagogiques.ForumPedagogique;
				} else if (
					D.getGenre() ===
					Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.kiosque
				) {
					lTypeListe =
						Enumere_TypeRessourcesPedagogiques_1
							.EGenreTypeRessourcesPedagogiques.RessourcesGranulaires;
				} else {
					lTypeListe =
						Enumere_TypeRessourcesPedagogiques_1
							.EGenreTypeRessourcesPedagogiques.Autre;
				}
				if (!lRessourcesPedagogiquesParType[lTypeListe]) {
					lRessourcesPedagogiquesParType[lTypeListe] =
						new ObjetListeElements_1.ObjetListeElements();
				}
				lRessourcesPedagogiquesParType[lTypeListe].addElement(D);
			}
		});
	}
	return lRessourcesPedagogiquesParType;
}
function _regrouperRessourcesPedagogiquesParMatiere(aListeRessources) {
	const lRessourcesPedagogiquesParMatiere = {};
	if (!!aListeRessources) {
		aListeRessources.parcourir((D) => {
			let lMatiereListe;
			if (D.matiere) {
				lMatiereListe = D.matiere.getLibelle();
			} else {
				lMatiereListe = undefined;
			}
			if (!lRessourcesPedagogiquesParMatiere[lMatiereListe]) {
				lRessourcesPedagogiquesParMatiere[lMatiereListe] =
					new ObjetListeElements_1.ObjetListeElements();
			}
			lRessourcesPedagogiquesParMatiere[lMatiereListe].addElement(D);
		});
	}
	return lRessourcesPedagogiquesParMatiere;
}
