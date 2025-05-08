const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { TypeGenreApiKiosque } = require("TypeGenreApiKiosque.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
class DonneesListe_PanierRessourceKiosque extends ObjetDonneesListe {
	constructor(aParam) {
		super(aParam.donnees);
		this.pere = aParam.pere;
		this.callbackLien = aParam.callbackLien;
		this.setOptions({
			avecEvnt_Selection: true,
			avecEtatSaisie: false,
			avecEvnt_Creation: true,
			avecEvnt_Suppression: true,
			avecDeploiement: true,
			avecEventDeploiementSurCellule: false,
			avecMultiSelection: !!aParam.avecMultiSelection,
		});
	}
	getControleur(aDonneesListe, aListe) {
		return $.extend(true, super.getControleur(aDonneesListe, aListe), {
			nodeLien: function (aGenre) {
				$(this.node).eventValidation(() => {
					const lDonnee = aDonneesListe.Donnees.getElementParNumeroEtGenre(
						null,
						aGenre,
					);
					if (!!lDonnee && !!lDonnee.ressource && aDonneesListe.callbackLien) {
						aDonneesListe.callbackLien(
							lDonnee.ressource.getGenre() ||
								EGenreRessource.RessourceNumeriqueKiosque,
						);
					}
				});
			},
		});
	}
	avecEdition(aParams) {
		if (!aParams.article.estUnDeploiement) {
			return [
				DonneesListe_PanierRessourceKiosque.colonnes.coche,
				DonneesListe_PanierRessourceKiosque.colonnes.titre,
				DonneesListe_PanierRessourceKiosque.colonnes.commentaire,
			].includes(aParams.idColonne);
		} else {
			return false;
		}
	}
	avecSuppression(aParams) {
		return !aParams.article.estUnDeploiement;
	}
	avecSelection(aParams) {
		return (
			!aParams.article.estUnDeploiement &&
			aParams.idColonne !== DonneesListe_PanierRessourceKiosque.colonnes.lien
		);
	}
	avecEvenementApresEdition(aParams) {
		return (
			!aParams.article.estUnDeploiement &&
			[
				DonneesListe_PanierRessourceKiosque.colonnes.coche,
				DonneesListe_PanierRessourceKiosque.colonnes.titre,
				DonneesListe_PanierRessourceKiosque.colonnes.commentaire,
			].includes(aParams.idColonne)
		);
	}
	avecMenuContextuel(aParams) {
		return !!aParams.article && !aParams.article.estUnDeploiement;
	}
	avecDeploiementSurColonne(aParams) {
		return [
			DonneesListe_PanierRessourceKiosque.colonnes.coche,
			DonneesListe_PanierRessourceKiosque.colonnes.titre,
		].includes(aParams.idColonne);
	}
	avecImageSurColonneDeploiement(aParams) {
		return (
			aParams.idColonne === DonneesListe_PanierRessourceKiosque.colonnes.titre
		);
	}
	getTri() {
		return [
			ObjetTri.initRecursif("pere", [
				ObjetTri.init("Genre"),
				ObjetTri.init((aElement) => {
					return aElement.Libelle;
				}),
			]),
		];
	}
	getColonneDeFusion(aParams) {
		if (!aParams.article.estUnDeploiement) {
			return;
		}
		if (
			[
				DonneesListe_PanierRessourceKiosque.colonnes.coche,
				DonneesListe_PanierRessourceKiosque.colonnes.lien,
				DonneesListe_PanierRessourceKiosque.colonnes.commentaire,
				DonneesListe_PanierRessourceKiosque.colonnes.dateAjout,
				DonneesListe_PanierRessourceKiosque.colonnes.api,
			].includes(aParams.idColonne)
		) {
			return DonneesListe_PanierRessourceKiosque.colonnes.titre;
		}
	}
	getValeur(aParams) {
		const lResult = [];
		switch (aParams.idColonne) {
			case DonneesListe_PanierRessourceKiosque.colonnes.coche:
				return aParams.article.estSelectionne;
			case DonneesListe_PanierRessourceKiosque.colonnes.titre:
				if (!!aParams.article) {
					if (!!aParams.article.estUnDeploiement) {
						lResult.push(
							`&nbsp;<span ${GHtml.composeAttr("ie-node", "nodeLien", [aParams.article.getGenre()])}>${GChaine.composerUrlLienExterne({ documentJoint: aParams.article.ressource, title: aParams.article.ressource.description, libelleEcran: aParams.article.ressource.titre })}</span>`,
						);
					} else {
						lResult.push(
							`&nbsp;<span class="Gras">${aParams.article.ressource.getLibelle()}</span>`,
						);
					}
				}
				return lResult.join("");
			case DonneesListe_PanierRessourceKiosque.colonnes.lien:
				return !!aParams.article.ressource
					? GChaine.composerUrlLienExterne({
							documentJoint: aParams.article.ressource,
							title: aParams.article.ressource.description,
							libelleEcran: "",
						})
					: "";
			case DonneesListe_PanierRessourceKiosque.colonnes.commentaire:
				if (!!aParams.article.estUnDeploiement) {
					return "";
				}
				return !!aParams.article.ressource
					? aParams.article.ressource.commentaire
					: "";
			case DonneesListe_PanierRessourceKiosque.colonnes.dateAjout:
				if (!!aParams.article.estUnDeploiement) {
					return "";
				}
				return !!aParams.article.ressource
					? aParams.article.ressource.strdate
					: "";
			case DonneesListe_PanierRessourceKiosque.colonnes.api:
				if (!!aParams.article.estUnDeploiement) {
					return "";
				}
				if (
					!!aParams.article.ressource &&
					!!aParams.article.ressource.apiSupport
				) {
					if (
						aParams.article.ressource.apiSupport.contains(
							TypeGenreApiKiosque.Api_AjoutPanier,
						)
					) {
						lResult.push("P ");
					}
					if (
						aParams.article.ressource.apiSupport.contains(
							TypeGenreApiKiosque.Api_RenduPJTAF,
						)
					) {
						lResult.push("R ");
					}
					if (
						aParams.article.ressource.apiSupport.contains(
							TypeGenreApiKiosque.Api_EnvoiNote,
						)
					) {
						lResult.push("N ");
					}
				}
				return lResult.join("");
			case DonneesListe_PanierRessourceKiosque.colonnes.envoiNote:
				return aParams.article &&
					aParams.article.ressource &&
					aParams.article.ressource.apiSupport
					? aParams.article.ressource.apiSupport.contains(
							TypeGenreApiKiosque.Api_EnvoiNote,
						)
					: false;
			case DonneesListe_PanierRessourceKiosque.colonnes.renduTAF: {
				return aParams.article &&
					aParams.article.ressource &&
					aParams.article.ressource.apiSupport
					? aParams.article.ressource.apiSupport.contains(
							TypeGenreApiKiosque.Api_RenduPJTAF,
						)
					: false;
			}
			default:
				return "";
		}
	}
	getHintForce(aParams) {
		if (
			aParams.idColonne === DonneesListe_PanierRessourceKiosque.colonnes.lien &&
			!!aParams.article.ressource
		) {
			return GTraductions.getValeur(
				"FenetrePanierKiosque.liste.HintLienAcceder",
			);
		}
		return "";
	}
	getLibelleDraggable(aParams) {
		return aParams.article.ressource.getLibelle();
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_PanierRessourceKiosque.colonnes.coche:
				if (!aParams.article.estUnDeploiement) {
					return ObjetDonneesListe.ETypeCellule.Coche;
				}
				return ObjetDonneesListe.ETypeCellule.Texte;
			case DonneesListe_PanierRessourceKiosque.colonnes.envoiNote:
			case DonneesListe_PanierRessourceKiosque.colonnes.renduTAF:
				return ObjetDonneesListe.ETypeCellule.Coche;
			case DonneesListe_PanierRessourceKiosque.colonnes.lien:
			case DonneesListe_PanierRessourceKiosque.colonnes.titre:
				return ObjetDonneesListe.ETypeCellule.Html;
			default:
				return ObjetDonneesListe.ETypeCellule.Texte;
		}
	}
	surEdition(aParams, aValeur) {
		if (
			aParams.idColonne ===
				DonneesListe_PanierRessourceKiosque.colonnes.coche &&
			!aParams.article.estUnDeploiement
		) {
			if (!!aValeur && !this.options.avecMultiSelection) {
				this.Donnees.parcourir((aElement) => {
					aElement.estSelectionne = false;
				});
			}
			aParams.article.estSelectionne = aValeur;
		}
		if (!aParams.article.estUnDeploiement) {
			switch (aParams.idColonne) {
				case DonneesListe_PanierRessourceKiosque.colonnes.coche:
					if (!!aValeur && !this.options.avecMultiSelection) {
						this.Donnees.parcourir((aElement) => {
							aElement.estSelectionne = false;
						});
					}
					aParams.article.estSelectionne = aValeur;
					break;
				case DonneesListe_PanierRessourceKiosque.colonnes.titre:
					aParams.article.ressource.setLibelle(aValeur);
					aParams.article.ressource.setEtat(EGenreEtat.Modification);
					aParams.article.setEtat(EGenreEtat.FilsModification);
					break;
				case DonneesListe_PanierRessourceKiosque.colonnes.commentaire:
					aParams.article.ressource.commentaire = aValeur;
					aParams.article.ressource.setEtat(EGenreEtat.Modification);
					aParams.article.setEtat(EGenreEtat.FilsModification);
					break;
			}
		}
	}
}
DonneesListe_PanierRessourceKiosque.colonnes = {
	coche: "panierKiosque_Coche",
	titre: "panierKiosque_Titre",
	lien: "panierKiosque_Lien",
	commentaire: "panierKiosque_Commentaire",
	dateAjout: "panierKiosque_DateAjout",
	api: "panierKiosque_API",
	renduTAF: "panierKiosque_RenduTAF",
	envoiNote: "panierKiosque_EnvoiNote",
};
DonneesListe_PanierRessourceKiosque.genreCommande = {
	VisuEleve: 0,
	CopierQCM: 1,
};
module.exports = DonneesListe_PanierRessourceKiosque;
