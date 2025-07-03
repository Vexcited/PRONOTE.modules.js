exports.DonneesListe_ElementsProgramme = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const _ObjetCouleur_1 = require("_ObjetCouleur");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const AccessApp_1 = require("AccessApp");
class DonneesListe_ElementsProgramme extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParams) {
		super(aDonnees);
		this.appSco = (0, AccessApp_1.getApp)();
		this.parametres = Object.assign(
			{
				periode: null,
				nbElementsActuelHorsListe: 0,
				nbMaxElements: 0,
				avecCreationPossible: false,
			},
			aParams,
		);
		this.strPeriode = this.parametres.periode
			? this.parametres.periode.getLibelle()
			: "";
		this.setOptions({
			avecEvnt_ApresEdition: true,
			avecEvnt_ApresCreation: true,
			avecEvnt_Suppression: true,
			avecInterruptionSuppression: true,
			avecEtatSaisie: false,
			avecTri: false,
			avecMultiSelection: true,
			avecTrimSurEdition: true,
			avecDeploiement: true,
			avecContenuTronque: true,
		});
	}
	surCreation(D, V, aLigne) {
		D.Libelle =
			V[
				this.getNumeroColonneDId(
					DonneesListe_ElementsProgramme.genreColonne.libelle,
				)
			];
		D.Genre =
			aLigne >= 0
				? Enumere_Ressource_1.EGenreRessource.ElementProgramme
				: Enumere_Ressource_1.EGenreRessource.ChapitreEltPgm;
		if (aLigne >= 0) {
			D.pere = this.Donnees.get(aLigne);
			D.nbrSurPeriode = 0;
			D.nbrSurAnnee = 0;
		}
	}
	avecEvenementEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ElementsProgramme.genreColonne.partage:
				if (
					aParams.article.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.Competence ||
					aParams.article.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.ElementPilier
				) {
					return false;
				}
				return (
					!!aParams.article.modifiable &&
					!this.appSco.droits.get(ObjetDroitsPN_1.TypeDroits.estEnConsultation)
				);
		}
		return false;
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_ElementsProgramme.genreColonne.coche:
				if (V && this.parametres.nbMaxElements > 0) {
					let lNbActifs = Math.max(
						this.parametres.nbElementsActuelHorsListe,
						0,
					);
					this.Donnees.parcourir((D) => {
						if (D.actif && D.existe()) {
							lNbActifs += 1;
						}
					});
					if (lNbActifs + 1 > this.parametres.nbMaxElements) {
						return ObjetChaine_1.GChaine.format(
							ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_ElementsProgramme.NombreLimiteAtteint",
							),
							[this.parametres.nbMaxElements],
						);
					}
				}
				aParams.article.actif = V;
				break;
			case DonneesListe_ElementsProgramme.genreColonne.libelle:
				aParams.article.Libelle_bak = aParams.article.Libelle;
				aParams.article.Libelle = V;
				break;
			default:
		}
	}
	getControleCaracteresInput(aParams) {
		if (
			aParams.idColonne === DonneesListe_ElementsProgramme.genreColonne.libelle
		) {
			return { tailleMax: 300 };
		}
		return null;
	}
	getMessageEditionImpossible(aParams, aErreur) {
		if (aErreur) {
			return aErreur;
		}
		return ObjetTraduction_1.GTraductions.getValeur("liste.editionImpossible");
	}
	avecEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ElementsProgramme.genreColonne.coche:
				return (
					aParams.article.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.ElementProgramme ||
					aParams.article.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.Competence
				);
			case DonneesListe_ElementsProgramme.genreColonne.libelle:
			case DonneesListe_ElementsProgramme.genreColonne.partage:
				return (
					!!aParams.article.modifiable &&
					!this.appSco.droits.get(ObjetDroitsPN_1.TypeDroits.estEnConsultation)
				);
			default:
				return false;
		}
	}
	editionConfirmation(aParams) {
		return (
			aParams.article &&
			aParams.article.utilise &&
			aParams.idColonne === DonneesListe_ElementsProgramme.genreColonne.libelle
		);
	}
	getMessageEditionConfirmation() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"Fenetre_ElementsProgramme.modificationLibelleConfirmation",
		);
	}
	getMessageEditionRefusee(aParams) {
		if (
			aParams.article &&
			aParams.article.utiliseCloture &&
			aParams.idColonne === DonneesListe_ElementsProgramme.genreColonne.libelle
		) {
			return ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_ElementsProgramme.ModificationImpossibleBulletinCloture",
			);
		}
		return "";
	}
	avecEvenementSelectionClick(aParams) {
		if (
			aParams.idColonne === DonneesListe_ElementsProgramme.genreColonne.coche &&
			(aParams.article.getGenre() ===
				Enumere_Ressource_1.EGenreRessource.ChapitreEltPgm ||
				aParams.article.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.ElementPilier)
		) {
			return this.parametres.avecCreationPossible;
		}
		return false;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ElementsProgramme.genreColonne.coche:
				return aParams.article.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.ChapitreEltPgm ||
					aParams.article.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.ElementPilier
					? this.parametres.avecCreationPossible
						? "Image_Ajout1Etat"
						: ""
					: aParams.article.actif;
			case DonneesListe_ElementsProgramme.genreColonne.libelle:
				return aParams.article.getLibelle();
			case DonneesListe_ElementsProgramme.genreColonne.nombre:
				if (aParams.article.nbrSurAnnee === 0) {
					return "";
				}
				return aParams.article.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.ElementProgramme
					? aParams.article.nbrSurPeriode + "/" + aParams.article.nbrSurAnnee
					: "";
			case DonneesListe_ElementsProgramme.genreColonne.proprietaire:
				return aParams.article.proprio || "";
			case DonneesListe_ElementsProgramme.genreColonne.partage: {
				const lHtmlPartage = [];
				if (
					!!aParams.article.partage ||
					aParams.article.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.Competence ||
					aParams.article.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.ElementPilier
				) {
					lHtmlPartage.push(
						'<i role="img" class="icon_fiche_cours_partage" style="font-size:1.4rem;" aria-label="' +
							ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_ElementsProgramme.HintTitrePartage",
							) +
							'"></i>',
					);
				}
				return lHtmlPartage.join("");
			}
			default:
		}
		return "";
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ElementsProgramme.genreColonne.coche:
				return aParams.article.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.ChapitreEltPgm
					? ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Image
					: ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
			case DonneesListe_ElementsProgramme.genreColonne.deploiement:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule
					.CocheDeploiement;
			case DonneesListe_ElementsProgramme.genreColonne.partage:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			default:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
		}
	}
	suppressionImpossible(D, aListeSelections) {
		return (
			_getListeNonSupprimables(aListeSelections).count() ===
			aListeSelections.count()
		);
	}
	getMessageSuppressionImpossible(D, aListeSelections) {
		const lMessage =
			ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_ElementsProgramme.SuppressionImpossible",
			) +
			_getListeElementsPourMessage(_getListeNonSupprimables(aListeSelections));
		return lMessage;
	}
	getListeSupprimables(aListeSelections) {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		aListeSelections.parcourir((aElement) => {
			if (aElement.modifiable) {
				lListe.addElement(aElement);
			}
		});
		return lListe;
	}
	getMessageSuppressionConfirmation(D, aListe) {
		const lListeSupprimables = this.getListeSupprimables(aListe),
			lListeNonSupprimables = _getListeNonSupprimables(aListe);
		let lMessage = "";
		if (lListeNonSupprimables.count() > 0) {
			lMessage +=
				ObjetTraduction_1.GTraductions.getValeur(
					"Fenetre_ElementsProgramme.SuppressionImpossible",
				) +
				_getListeElementsPourMessage(lListeNonSupprimables) +
				"<br><br>";
		}
		lMessage +=
			lListeSupprimables.count() > 1
				? ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_ElementsProgramme.ConfirmSupprElts",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_ElementsProgramme.ConfirmSupprElt",
					);
		if (lListeNonSupprimables.count() > 0) {
			lMessage += _getListeElementsPourMessage(lListeSupprimables);
		}
		return lMessage;
	}
	avecDeploiementSurColonne(aParams) {
		return (
			aParams.idColonne ===
			DonneesListe_ElementsProgramme.genreColonne.deploiement
		);
	}
	getCouleurCellule(aParams) {
		if (
			aParams.article &&
			(aParams.article.getGenre() ===
				Enumere_Ressource_1.EGenreRessource.ChapitreEltPgm ||
				aParams.article.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.ElementPilier)
		) {
			if (
				aParams.article.modifiable &&
				aParams.idColonne ===
					DonneesListe_ElementsProgramme.genreColonne.partage
			) {
				return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
			}
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Deploiement;
		}
		if (
			aParams.article &&
			aParams.article.modifiable &&
			aParams.article.getGenre() !==
				Enumere_Ressource_1.EGenreRessource.ChapitreEltPgm &&
			aParams.article.getGenre() !==
				Enumere_Ressource_1.EGenreRessource.ElementPilier &&
			aParams.idColonne ===
				DonneesListe_ElementsProgramme.genreColonne.deploiement
		) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
		}
		if (
			aParams.article &&
			aParams.article.estProprio &&
			aParams.idColonne ===
				DonneesListe_ElementsProgramme.genreColonne.proprietaire
		) {
			return new _ObjetCouleur_1.ObjectCouleurCellule(
				GCouleur.liste.nonEditable.fond,
				GCouleur.themeNeutre.moyen2,
				GCouleur.liste.nonEditable.bordure,
			);
		}
	}
	getStyle(aParams) {
		if (
			aParams.article &&
			aParams.article.modifiable &&
			aParams.article.getGenre() ===
				Enumere_Ressource_1.EGenreRessource.ChapitreEltPgm &&
			aParams.idColonne === DonneesListe_ElementsProgramme.genreColonne.libelle
		) {
			return ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.blanc);
		}
		return "";
	}
	getClassCelluleConteneur(aParams) {
		const lClasses = [super.getClassCelluleConteneur(aParams)];
		switch (aParams.idColonne) {
			case DonneesListe_ElementsProgramme.genreColonne.coche:
				lClasses.push("AvecMain");
				break;
			case DonneesListe_ElementsProgramme.genreColonne.deploiement:
				if (
					aParams.article &&
					aParams.article.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.ChapitreEltPgm
				) {
					lClasses.push("AvecMain");
				}
				break;
			case DonneesListe_ElementsProgramme.genreColonne.partage:
				if (aParams.article && aParams.article.modifiable) {
					lClasses.push("AvecMain");
				}
				break;
		}
		return lClasses.join(" ");
	}
	getClass(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ElementsProgramme.genreColonne.libelle:
			case DonneesListe_ElementsProgramme.genreColonne.proprietaire:
				if (
					aParams.article &&
					(aParams.article.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.ChapitreEltPgm ||
						aParams.article.getGenre() ===
							Enumere_Ressource_1.EGenreRessource.ElementPilier)
				) {
					return "Gras";
				}
				break;
		}
		return "";
	}
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ElementsProgramme.genreColonne.nombre:
				if (
					aParams.article.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.ElementProgramme
				) {
					return ObjetChaine_1.GChaine.format(
						ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_ElementsProgramme.HintLigneOccurence",
						),
						[
							aParams.article.nbrSurPeriode,
							this.strPeriode,
							aParams.article.nbrSurAnnee,
						],
					);
				}
				return "";
			case DonneesListe_ElementsProgramme.genreColonne.libelle:
				if (aParams.article.utiliseAutres) {
					return (
						aParams.article.getLibelle() +
						"\n" +
						ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_ElementsProgramme.ElementUtilisesParDAutres",
						)
					);
				}
				return "";
			case DonneesListe_ElementsProgramme.genreColonne.partage:
				if (aParams.article.utiliseAutres) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_ElementsProgramme.ElementUtilisesParDAutres",
					);
				}
				return "";
		}
		return "";
	}
	getVisible(D) {
		return D.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation;
	}
}
exports.DonneesListe_ElementsProgramme = DonneesListe_ElementsProgramme;
(function (DonneesListe_ElementsProgramme) {
	let genreColonne;
	(function (genreColonne) {
		genreColonne["coche"] = "coche";
		genreColonne["deploiement"] = "deploiement";
		genreColonne["libelle"] = "libelle";
		genreColonne["proprietaire"] = "proprietaire";
		genreColonne["partage"] = "partage";
		genreColonne["nombre"] = "nombre";
	})(
		(genreColonne =
			DonneesListe_ElementsProgramme.genreColonne ||
			(DonneesListe_ElementsProgramme.genreColonne = {})),
	);
})(
	DonneesListe_ElementsProgramme ||
		(exports.DonneesListe_ElementsProgramme = DonneesListe_ElementsProgramme =
			{}),
);
function _getListeNonSupprimables(aListeSelections) {
	const lListe = new ObjetListeElements_1.ObjetListeElements();
	aListeSelections.parcourir((aElement) => {
		if (!aElement.modifiable) {
			lListe.addElement(aElement);
		}
	});
	return lListe;
}
function _getListeElementsPourMessage(aListe) {
	let lMessage = "";
	aListe.parcourir((aElement) => {
		lMessage += "<br>&nbsp;&nbsp;&nbsp;&nbsp;- " + aElement.getLibelle();
	});
	return lMessage;
}
