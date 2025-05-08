exports.DonneesListe_ReponseAChoisir = void 0;
const Enumere_CommandeMenu_1 = require("Enumere_CommandeMenu");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeNote_1 = require("TypeNote");
class DonneesListe_ReponseAChoisir extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.callbackMenuContextuel = aParam.callbackMenuContextuel;
		this.dimensionsMaxResizeImages = aParam.dimensionsMaxResizeImages;
		this.callbackSelectionInputFile = aParam.callbackSelectionInputFile;
		this.avecUneBonneReponseUnique = aParam.avecUneBonneReponseUnique;
		this.avecUtilisationFractionsPourSaisie =
			aParam.avecUtilisationFractionsPourSaisie;
		this.creerIndexUnique("Libelle");
		const lOptions = {
			avecTri: false,
			avecEvnt_Creation: true,
			avecEvnt_Suppression: true,
			avecEvnt_ApresEdition: true,
			avecEvnt_ApresCreation: true,
		};
		if (aParam.hauteurMinCellule > 0) {
			$.extend(lOptions, { hauteurMinCellule: aParam.hauteurMinCellule });
		}
		this.setOptions(lOptions);
	}
	setUtilisationFractionsPourSaisie(aAvecUtilisationFractionsPourSaisie) {
		if (
			this.avecUtilisationFractionsPourSaisie !==
			aAvecUtilisationFractionsPourSaisie
		) {
			this.avecUtilisationFractionsPourSaisie =
				aAvecUtilisationFractionsPourSaisie;
			if (!aAvecUtilisationFractionsPourSaisie) {
				this.egaliserFractionsEntreBonnesReponses();
				const lThis = this;
				this.Donnees.parcourir((aReponse) => {
					if (aReponse.fractionReponse < 0) {
						lThis.surEditionPointPositif(aReponse, new TypeNote_1.TypeNote(0));
					}
				});
			}
		}
	}
	getOptionsNote(aParams) {
		let lNoteMin = 0;
		if (
			aParams.idColonne ===
			DonneesListe_ReponseAChoisir.colonnes.pourcentagePointNeg
		) {
			lNoteMin = -100;
		}
		return {
			avecVirgule: false,
			afficherAvecVirgule: false,
			textAlign: "center",
			suffixe: " %",
			min: lNoteMin,
			max: 100,
		};
	}
	getClassCelluleConteneur(aParams) {
		const lClasses = [];
		switch (aParams.idColonne) {
			case DonneesListe_ReponseAChoisir.colonnes.pourcentagePointPos:
			case DonneesListe_ReponseAChoisir.colonnes.pourcentagePointNeg:
				lClasses.push("AlignementMilieu");
				break;
		}
		return lClasses.join(" ");
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ReponseAChoisir.colonnes.coche: {
				let lEstCoche = false;
				const lFractionReponse = aParams.article.fractionReponse;
				if (this.avecUneBonneReponseUnique) {
					lEstCoche = !!lFractionReponse && lFractionReponse === 100;
				} else {
					lEstCoche = !!lFractionReponse && lFractionReponse > 0;
				}
				return lEstCoche;
			}
			case DonneesListe_ReponseAChoisir.colonnes.pourcentagePointPos: {
				let lFractionPos = null;
				if (
					!!aParams.article.fractionReponse &&
					aParams.article.fractionReponse > 0
				) {
					lFractionPos = new TypeNote_1.TypeNote(
						aParams.article.fractionReponse,
					);
				}
				return lFractionPos;
			}
			case DonneesListe_ReponseAChoisir.colonnes.pourcentagePointNeg: {
				let lFractionNeg = null;
				if (
					!!aParams.article.fractionReponse &&
					aParams.article.fractionReponse < 0
				) {
					lFractionNeg = new TypeNote_1.TypeNote(
						aParams.article.fractionReponse,
					);
				}
				return lFractionNeg;
			}
			case DonneesListe_ReponseAChoisir.colonnes.responseProposee:
				return !!aParams.article &&
					!!aParams.article.editionAvancee &&
					!!aParams.article.libelleHtml &&
					aParams.article.libelleHtml !== ""
					? `<div class="tiny-view">${aParams.article.libelleHtml}</div>`
					: aParams.article.getLibelle();
			case DonneesListe_ReponseAChoisir.colonnes.image:
				return !!aParams.article.image && aParams.article.image !== ""
					? '<img style="width:100%;" src="data:image/png;base64,' +
							aParams.article.image +
							'" onerror="$(this).parent().html(GTraductions.getValeur(\'ExecutionQCM.ImageNonSupportee\'));" />'
					: "";
			case DonneesListe_ReponseAChoisir.colonnes.commentaire:
				return aParams.article.feedback || "";
		}
		return "";
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ReponseAChoisir.colonnes.coche:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
			case DonneesListe_ReponseAChoisir.colonnes.pourcentagePointPos:
			case DonneesListe_ReponseAChoisir.colonnes.pourcentagePointNeg:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Note;
			case DonneesListe_ReponseAChoisir.colonnes.responseProposee:
				if (
					aParams.article &&
					aParams.article.editionAvancee &&
					aParams.article.libelleHtml &&
					aParams.article.libelleHtml !== ""
				) {
					return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
				}
				break;
			case DonneesListe_ReponseAChoisir.colonnes.image:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	surCreation(D, V) {
		D.Libelle =
			V[
				this.getNumeroColonneDId(
					DonneesListe_ReponseAChoisir.colonnes.responseProposee,
				)
			];
		D.editionAvancee = false;
		D.libelleHtml = "";
		D.fractionReponse = 0;
		D.image = "";
		D.feedback = "";
	}
	autoriserChaineVideSurEdition(aParams) {
		return (
			aParams.idColonne === DonneesListe_ReponseAChoisir.colonnes.commentaire
		);
	}
	egaliserFractionsEntreBonnesReponses() {
		const lThis = this;
		if (!!this.avecUneBonneReponseUnique) {
			let lPremierBonneReponseTrouve = false;
			this.Donnees.parcourir((aReponse) => {
				if (aReponse.fractionReponse < 100 || lPremierBonneReponseTrouve) {
					lThis.surEditionPointPositif(aReponse, new TypeNote_1.TypeNote(0));
				} else if (aReponse.fractionReponse === 100) {
					lPremierBonneReponseTrouve = true;
				}
			});
		} else {
			let lNbBonnesReponses = 0;
			this.Donnees.parcourir((aReponse) => {
				if (aReponse.fractionReponse > 0) {
					lNbBonnesReponses++;
				}
			});
			const lFractionReponseEquitable = Math.round(100 / lNbBonnesReponses);
			this.Donnees.parcourir((aReponse) => {
				if (aReponse.fractionReponse > 0) {
					lThis.surEditionPointPositif(
						aReponse,
						new TypeNote_1.TypeNote(lFractionReponseEquitable),
					);
				}
			});
		}
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_ReponseAChoisir.colonnes.coche:
				if (
					!this.avecUneBonneReponseUnique ||
					this.avecUtilisationFractionsPourSaisie
				) {
					const lNouvelleValeur2 = !!V ? 100 : 0;
					aParams.idColonne =
						DonneesListe_ReponseAChoisir.colonnes.pourcentagePointPos;
					this.surEdition(aParams, new TypeNote_1.TypeNote(lNouvelleValeur2));
					if (!this.avecUtilisationFractionsPourSaisie) {
						this.egaliserFractionsEntreBonnesReponses();
					}
				} else {
					if (!!V) {
						this.Donnees.parcourir((aReponse) => {
							if (aReponse.fractionReponse === 100) {
								aReponse.fractionReponse = 0;
								if (
									aReponse.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation &&
									aReponse.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression
								) {
									aReponse.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
									aReponse.Etat = Enumere_Etat_1.EGenreEtat.Modification;
								}
							}
						});
						aParams.idColonne =
							DonneesListe_ReponseAChoisir.colonnes.pourcentagePointPos;
						this.surEdition(aParams, new TypeNote_1.TypeNote(100));
					}
				}
				break;
			case DonneesListe_ReponseAChoisir.colonnes.pourcentagePointPos:
				this.surEditionPointPositif(aParams.article, V);
				break;
			case DonneesListe_ReponseAChoisir.colonnes.pourcentagePointNeg:
				aParams.article.fractionReponse = 0;
				if (V.estUneValeur()) {
					let lNouvelleValeurNeg = V.getValeur();
					if (lNouvelleValeurNeg > 0) {
						lNouvelleValeurNeg = lNouvelleValeurNeg * -1;
					}
					aParams.article.fractionReponse = lNouvelleValeurNeg;
				}
				break;
			case DonneesListe_ReponseAChoisir.colonnes.responseProposee:
				aParams.article.Libelle = V;
				break;
			case DonneesListe_ReponseAChoisir.colonnes.image:
				aParams.article.image = V;
				break;
			case DonneesListe_ReponseAChoisir.colonnes.commentaire:
				aParams.article.feedback = V;
				break;
			default:
				break;
		}
		if (aParams.article.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation) {
			aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			aParams.article.Etat = Enumere_Etat_1.EGenreEtat.Modification;
		}
	}
	surEditionPointPositif(aArticle, V) {
		let lNouvelleValeurPos = 0;
		if (V.estUneValeur()) {
			lNouvelleValeurPos = V.getValeur();
		}
		aArticle.fractionReponse = lNouvelleValeurPos;
		if (
			aArticle.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation &&
			aArticle.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression
		) {
			aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			aArticle.Etat = Enumere_Etat_1.EGenreEtat.Modification;
		}
	}
	avecEvenementEdition(aParams) {
		let lAvecEventEdition = false;
		switch (aParams.idColonne) {
			case DonneesListe_ReponseAChoisir.colonnes.responseProposee:
				lAvecEventEdition = !!aParams.article.editionAvancee;
				break;
		}
		return lAvecEventEdition;
	}
	avecSelecFile(aParams) {
		return aParams.idColonne === DonneesListe_ReponseAChoisir.colonnes.image;
	}
	getOptionsSelecFile() {
		return {
			accept: "image/*",
			maxSize: 0,
			avecResizeImage: true,
			largeurMaxImageResize: this.dimensionsMaxResizeImages.largeur,
			hauteurMaxImageResize: this.dimensionsMaxResizeImages.hauteur,
		};
	}
	evenementSurSelecFile(aParams, aParamsInput) {
		this.callbackSelectionInputFile(aParams, aParamsInput.listeFichiers);
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		if (aParametres.avecCreation) {
			aParametres.menuContextuel.addCommande(
				Enumere_CommandeMenu_1.EGenreCommandeMenu.Creation,
				ObjetTraduction_1.GTraductions.getValeur("liste.creer"),
				!aParametres.nonEditable,
			);
		}
		aParametres.menuContextuel.addCommande(
			Enumere_CommandeMenu_1.EGenreCommandeMenu.Edition,
			ObjetTraduction_1.GTraductions.getValeur("liste.modifier"),
			this.avecEdition(aParametres) && !aParametres.nonEditable,
		);
		aParametres.menuContextuel.addCommande(
			Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression,
			ObjetTraduction_1.GTraductions.getValeur("liste.supprimer"),
			this.avecSuppression(aParametres) && !aParametres.nonEditable,
		);
		aParametres.menuContextuel.addCommande(
			DonneesListe_ReponseAChoisir.GenreCommandeDonneesListeReponseAChoisir
				.SuppressionImage,
			ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.SupprimerImageReponse",
			),
			aParametres.article.image && !aParametres.nonEditable,
		);
		aParametres.menuContextuel.setDonnees();
	}
	evenementMenuContextuel(aParametres) {
		if (
			aParametres.numeroMenu ===
			DonneesListe_ReponseAChoisir.GenreCommandeDonneesListeReponseAChoisir
				.SuppressionImage
		) {
			this.surEdition(aParametres, "");
			this.callbackMenuContextuel(aParametres.numeroMenu);
			return true;
		}
		return false;
	}
}
exports.DonneesListe_ReponseAChoisir = DonneesListe_ReponseAChoisir;
DonneesListe_ReponseAChoisir.colonnes = {
	coche: "DLReponseAChoisir_coche",
	pourcentagePointPos: "DLReponseAChoisir_pPos",
	pourcentagePointNeg: "DLReponseAChoisir_pNeg",
	responseProposee: "DLReponseAChoisir_reponse",
	image: "DLReponseAChoisir_image",
	commentaire: "DLReponseAChoisir_commentaire",
};
(function (DonneesListe_ReponseAChoisir) {
	let GenreCommandeDonneesListeReponseAChoisir;
	(function (GenreCommandeDonneesListeReponseAChoisir) {
		GenreCommandeDonneesListeReponseAChoisir[
			(GenreCommandeDonneesListeReponseAChoisir["SuppressionImage"] = 0)
		] = "SuppressionImage";
	})(
		(GenreCommandeDonneesListeReponseAChoisir =
			DonneesListe_ReponseAChoisir.GenreCommandeDonneesListeReponseAChoisir ||
			(DonneesListe_ReponseAChoisir.GenreCommandeDonneesListeReponseAChoisir =
				{})),
	);
})(
	DonneesListe_ReponseAChoisir ||
		(exports.DonneesListe_ReponseAChoisir = DonneesListe_ReponseAChoisir = {}),
);
