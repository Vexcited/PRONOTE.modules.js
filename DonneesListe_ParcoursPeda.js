exports.DonneesListe_ParcoursPeda = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_CommandeMenu_1 = require("Enumere_CommandeMenu");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const TypeGenreParcoursEducatif_1 = require("TypeGenreParcoursEducatif");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeGenreAppreciation_1 = require("TypeGenreAppreciation");
const AccessApp_1 = require("AccessApp");
class DonneesListe_ParcoursPeda extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aParam) {
		super(aParam.donnees);
		this.param = aParam;
		this.libelleUtilisateur = this.param.libelleUtilisateur;
		this.avecCumulEleve = this.param.filtres.avecCumulParEleves;
		this.avecCumulGenreParcours = this.param.filtres.avecCumulParGenreParcours;
		this.setOptions({
			avecEvnt_ApresCreation: true,
			avecEvnt_ApresEdition: true,
			avecEvnt_ApresSuppression: true,
			avecEtatSaisie: false,
		});
	}
	getControleCaracteresInput(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ParcoursPeda.colonnes.description:
				return {
					tailleMax: (0, AccessApp_1.getApp)()
						.getObjetParametres()
						.getTailleMaxAppreciationParEnumere(
							TypeGenreAppreciation_1.TypeGenreAppreciation
								.GA_Bulletin_Professeur,
						),
				};
		}
		return null;
	}
	getCouleurCellule(aParams) {
		if (
			aParams.article.estCumulGenreParcours ||
			aParams.article.estCumulEleve
		) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Deploiement;
		}
	}
	avecDeploiement() {
		return this.avecCumulEleve || this.avecCumulGenreParcours;
	}
	avecImageSurColonneDeploiement(aParams) {
		return (
			this.avecDeploiement() &&
			aParams.idColonne === DonneesListe_ParcoursPeda.colonnes.date
		);
	}
	getNiveauDeploiement() {
		return this.avecCumulEleve
			? this.avecCumulGenreParcours
				? 2
				: 1
			: this.avecCumulGenreParcours
				? 1
				: 0;
	}
	avecEvenementSuppression() {
		return this.avecDeploiement();
	}
	avecSuppression(aParams) {
		return (
			this.param.droits.avecSaisie &&
			(aParams.article.supprimable || aParams.article.avecMessageSuppression)
		);
	}
	suppressionImpossible(D) {
		return D.avecMessageSuppression;
	}
	getMessageSuppressionImpossible() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"ParcoursPeda.MsgSupprParcoursClasse",
		);
	}
	avecEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ParcoursPeda.colonnes.date:
			case DonneesListe_ParcoursPeda.colonnes.description:
				return (
					this.param.droits.avecSaisie &&
					!!aParams.article &&
					aParams.article.editable
				);
		}
		return false;
	}
	getValeur(aParams) {
		if (
			aParams.article.estCumulGenreParcours ||
			aParams.article.estCumulEleve
		) {
			return this.param.avecCompteurSurCumul && aParams.article.nbParcours > 0
				? ObjetChaine_1.GChaine.format("%s (%d)", [
						aParams.article.getLibelle(),
						aParams.article.nbParcours,
					])
				: aParams.article.getLibelle();
		}
		switch (aParams.idColonne) {
			case DonneesListe_ParcoursPeda.colonnes.date:
				return aParams.article.Date ? aParams.article.Date : new Date();
			case DonneesListe_ParcoursPeda.colonnes.description:
				return aParams.article.Descr || "";
			case DonneesListe_ParcoursPeda.colonnes.suiviPar:
				return aParams.article.SuiviPar
					? this.param.avecTitres
						? aParams.article.SuiviPar
						: ObjetChaine_1.GChaine.format(
								ObjetTraduction_1.GTraductions.getValeur(
									"ParcoursPeda.colonne.suiviParS",
								),
								[aParams.article.SuiviPar],
							)
					: "";
			case DonneesListe_ParcoursPeda.colonnes.type:
				return aParams.article.StrType
					? "<div " +
							(aParams.article.HintType
								? 'ie-hint="' + aParams.article.HintType + '"'
								: "") +
							">" +
							aParams.article.StrType +
							"</div>"
					: "";
		}
		return "";
	}
	getEltCumulGenreParcours() {
		const lGenreParcours = this.getGenreParcoursCourant();
		const lIndice = this.Donnees.getIndiceElementParFiltre((aElement) => {
			return (
				aElement.estCumulGenreParcours && aElement.getGenre() === lGenreParcours
			);
		});
		if (lIndice > -1) {
			const lElt = this.Donnees.get(lIndice);
			if (lElt.getEtat() === Enumere_Etat_1.EGenreEtat.Suppression) {
				lElt.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
			}
			return lElt;
		} else {
			const lCumulGenreParcours = new ObjetElement_1.ObjetElement(
				TypeGenreParcoursEducatif_1.TypeGenreParcoursEducatifUtil.getLibelle(
					lGenreParcours,
				),
				0,
				lGenreParcours,
			);
			lCumulGenreParcours.estDeploye = false;
			lCumulGenreParcours.estUnDeploiement = true;
			lCumulGenreParcours.estCumulGenreParcours = true;
			this.Donnees.addElement(lCumulGenreParcours);
			return lCumulGenreParcours;
		}
	}
	getEltCumulDeRessource(aElt) {
		let lGenreParcoursCourant;
		const lThis = this;
		if (this.avecCumulGenreParcours) {
			lGenreParcoursCourant = this.getGenreParcoursCourant();
		}
		const lIndice = this.Donnees.getIndiceElementParFiltre((aElement) => {
			return (
				aElement.estCumulEleve &&
				aElement.getNumero() === aElt.getNumero() &&
				(!lThis.avecCumulGenreParcours ||
					aElement.pere.getGenre() === lGenreParcoursCourant)
			);
		});
		if (lIndice > -1) {
			const lElt = this.Donnees.get(lIndice);
			if (lElt.getEtat() === Enumere_Etat_1.EGenreEtat.Suppression) {
				lElt.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
			}
			return lElt;
		} else {
			const lCumul = new ObjetElement_1.ObjetElement(
				aElt.getLibelle(),
				aElt.getNumero(),
				aElt.getGenre(),
			);
			lCumul.estDeploye = false;
			lCumul.estUnDeploiement = true;
			lCumul.estCumulEleve = true;
			this.Donnees.addElement(lCumul);
			if (this.avecCumulGenreParcours) {
				const lCumulGenreParcours = this.getEltCumulGenreParcours();
				lCumul.pere = lCumulGenreParcours;
			}
			return lCumul;
		}
	}
	setGenreParcoursCourant(aGenre) {
		this.param.genreParcoursCourant = aGenre;
	}
	getGenreParcoursCourant() {
		if (this.param.filtres.genreParcours.length === 1) {
			return this.param.filtres.genreParcours[0];
		} else {
			return this.param.genreParcoursCourant;
		}
	}
	avecEvenementCreation() {
		return this.param.periodeCloture;
	}
	avecCreationElementsDynamique() {
		return true;
	}
	surCreation(D, V) {
		if (!this.param.periodeCloture) {
			const lRessources = this.param.ressources;
			if ("data" in V && V.data) {
				this.setGenreParcoursCourant(V.data.genre);
			}
			for (let i = 0, lNbr = lRessources.count(); i < lNbr; i++) {
				const lRessource = lRessources.get(i);
				let lCleTypeRessource = "";
				let lCleHintRessource = "";
				if (lRessource.Genre === Enumere_Ressource_1.EGenreRessource.Classe) {
					lCleTypeRessource = "ParcoursPeda.type.classe";
					lCleHintRessource = "ParcoursPeda.type.hint_classe";
				} else if (
					lRessource.Genre === Enumere_Ressource_1.EGenreRessource.Groupe
				) {
					lCleTypeRessource = "ParcoursPeda.type.groupe";
					lCleHintRessource = "ParcoursPeda.type.hint_groupe";
				} else {
					lCleTypeRessource = "ParcoursPeda.type.eleve";
					lCleHintRessource = "ParcoursPeda.type.hint_eleve";
				}
				const lNow = new Date();
				const lDateBornee = ObjetDate_1.GDate.getDateBornee(lNow);
				lDateBornee.setHours(
					lNow.getHours(),
					lNow.getMinutes(),
					lNow.getSeconds(),
					lNow.getMilliseconds(),
				);
				const lElement = new ObjetElement_1.ObjetElement();
				lElement.Date = lDateBornee;
				lElement.Descr =
					V[
						this.getNumeroColonneDId(
							DonneesListe_ParcoursPeda.colonnes.description,
						)
					];
				lElement.SuiviPar = this.libelleUtilisateur;
				lElement.StrType =
					ObjetTraduction_1.GTraductions.getValeur(lCleTypeRessource);
				lElement.HintType =
					ObjetTraduction_1.GTraductions.getValeur(lCleHintRessource);
				lElement.editable = true;
				lElement.ressource = lRessource;
				lElement.estCumulEleve = false;
				lElement.estCumulGenreParcours = false;
				if (this.avecCumulEleve) {
					lElement.pere = this.getEltCumulDeRessource(lElement.ressource);
					lElement.pere.nbParcours++;
				} else if (this.avecCumulGenreParcours) {
					lElement.pere = this.getEltCumulGenreParcours();
					lElement.pere.nbParcours++;
				}
				if (lElement.pere && lElement.pere.pere) {
					lElement.pere.pere.nbParcours++;
				}
				lElement.Genre = this.getGenreParcoursCourant();
				D.addElement(lElement);
			}
		}
	}
	surEdition(aParams, V) {
		let lModifie = false;
		switch (aParams.idColonne) {
			case DonneesListe_ParcoursPeda.colonnes.description:
				aParams.article.Descr = V;
				lModifie = true;
				break;
			case DonneesListe_ParcoursPeda.colonnes.date:
				if (ObjetDate_1.GDate.estDateValide(V)) {
					aParams.article.Date = V;
					const lDate = new Date();
					aParams.article.Date.setHours(
						lDate.getHours(),
						lDate.getMinutes(),
						lDate.getSeconds(),
						lDate.getMilliseconds(),
					);
					lModifie = true;
				}
				break;
			default:
				break;
		}
		if (lModifie) {
			aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
	}
	getTypeValeur(aParams) {
		if (
			aParams.article &&
			(aParams.article.estCumulGenreParcours || aParams.article.estCumulEleve)
		) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
		}
		switch (aParams.idColonne) {
			case DonneesListe_ParcoursPeda.colonnes.date:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule
					.DateCalendrier;
			case DonneesListe_ParcoursPeda.colonnes.description:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.ZoneTexte;
			case DonneesListe_ParcoursPeda.colonnes.type:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	fusionCelluleAvecColonnePrecedente(aParams) {
		const lId = aParams.idColonne;
		return (
			aParams.article.estUnDeploiement &&
			![DonneesListe_ParcoursPeda.colonnes.date].includes(lId)
		);
	}
	getTri(aColonneDeTri, aGenreTri) {
		if (aColonneDeTri === null || aColonneDeTri === undefined) {
			return [];
		}
		const lTris = [];
		if (this.avecCumulEleve || this.avecCumulGenreParcours) {
			if (this.avecCumulGenreParcours) {
				if (this.avecCumulEleve) {
					lTris.push(
						ObjetTri_1.ObjetTri.init((D) => {
							return D.estCumulGenreParcours
								? D.getLibelle()
								: D.estCumulEleve
									? D.pere.getLibelle()
									: D.pere.pere.getLibelle();
						}),
					);
				} else {
					lTris.push(
						ObjetTri_1.ObjetTri.init((D) => {
							return D.estCumulGenreParcours
								? D.getLibelle()
								: D.pere.getLibelle();
						}),
					);
				}
				lTris.push(
					ObjetTri_1.ObjetTri.init((D) => {
						return !D.estCumulGenreParcours;
					}),
				);
			}
			if (this.avecCumulEleve) {
				lTris.push(
					ObjetTri_1.ObjetTri.init((D) => {
						return D.estCumulEleve
							? D.getLibelle()
							: !D.estCumulGenreParcours
								? D.pere.getLibelle()
								: "";
					}),
				);
				lTris.push(
					ObjetTri_1.ObjetTri.init((D) => {
						return !D.estCumulEleve;
					}),
				);
			}
		}
		const lCol = aColonneDeTri;
		const lGenreTri = aGenreTri;
		switch (this.getId(lCol)) {
			case DonneesListe_ParcoursPeda.colonnes.date:
				lTris.push(ObjetTri_1.ObjetTri.init("Date", lGenreTri));
				break;
			case DonneesListe_ParcoursPeda.colonnes.description:
			case DonneesListe_ParcoursPeda.colonnes.suiviPar:
			case DonneesListe_ParcoursPeda.colonnes.type:
				lTris.push(
					ObjetTri_1.ObjetTri.init(
						this.getValeurPourTri.bind(this, lCol),
						lGenreTri,
					),
				);
				break;
			default:
				break;
		}
		return lTris;
	}
	initialiserObjetGraphique(aParams, aInstance) {
		aInstance.setParametres(
			GParametres.PremierLundi,
			GParametres.PremiereDate,
			GParametres.DerniereDate,
			null,
			null,
			null,
			false,
		);
	}
	setDonneesObjetGraphique(aParams, aInstance) {
		aInstance.setDonnees(aParams.article.Date);
	}
	avecMenuContextuel(aParams) {
		if (aParams.ligne === -1) {
			return (
				this.param.filtres.genreParcours.length > 1 &&
				!this.param.periodeCloture
			);
		}
		return (
			this.param.droits.avecSaisie &&
			aParams.article &&
			!aParams.article.estUnDeploiement
		);
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		if (aParametres.ligne === -1) {
			if (!this.param.periodeCloture) {
				for (
					let i = 0, lNbr = this.param.filtres.genreParcours.length;
					i < lNbr;
					i++
				) {
					const lGenre = this.param.filtres.genreParcours[i];
					aParametres.menuContextuel.addCommande(
						Enumere_CommandeMenu_1.EGenreCommandeMenu.Creation,
						TypeGenreParcoursEducatif_1.TypeGenreParcoursEducatifUtil.getLibelle(
							lGenre,
						),
						true,
						{ genre: lGenre },
					);
				}
			}
		} else {
			aParametres.menuContextuel.addCommande(
				Enumere_CommandeMenu_1.EGenreCommandeMenu.Edition,
				ObjetTraduction_1.GTraductions.getValeur("liste.modifier"),
				!aParametres.nonEditable &&
					(!aParametres.listeSelection ||
						aParametres.listeSelection.count() <= 1) &&
					this.avecEdition(aParametres),
			);
			aParametres.menuContextuel.addCommande(
				Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression,
				ObjetTraduction_1.GTraductions.getValeur("liste.supprimer"),
				!aParametres.nonEditable && this._avecSuppression(aParametres),
			);
		}
		aParametres.menuContextuel.setDonnees(aParametres.id);
	}
}
exports.DonneesListe_ParcoursPeda = DonneesListe_ParcoursPeda;
(function (DonneesListe_ParcoursPeda) {
	let colonnes;
	(function (colonnes) {
		colonnes["date"] = "date";
		colonnes["description"] = "description";
		colonnes["suiviPar"] = "suiviPar";
		colonnes["type"] = "type";
	})(
		(colonnes =
			DonneesListe_ParcoursPeda.colonnes ||
			(DonneesListe_ParcoursPeda.colonnes = {})),
	);
})(
	DonneesListe_ParcoursPeda ||
		(exports.DonneesListe_ParcoursPeda = DonneesListe_ParcoursPeda = {}),
);
